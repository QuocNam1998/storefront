import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'
import { PAGES, seed } from './seed'

for (const path of PAGES) {
  test.describe(`page ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await seed(page)
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('carries the store name and is in Vietnamese', async ({ page, isMobile }) => {
      await expect(page).toHaveTitle(/Cửa hàng của Thy/)
      await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
      // On a phone the product page has no site header: its photo carries back and cart buttons instead.
      if (!(isMobile && path.startsWith('/p/'))) await expect(page.getByRole('banner')).toContainText('Cửa hàng của Thy')
      await expect(page.getByRole('contentinfo')).toContainText('Cửa hàng của Thy')
    })

    test('tints the browser bar with the cream page color and keeps its description', async ({ page }) => {
      const mist = await page.locator('html').evaluate((html) => getComputedStyle(html).getPropertyValue('--mist').trim().toUpperCase())
      expect(mist).toMatch(/^#[0-9A-F]{6}$/)
      expect((await page.locator('meta[name="theme-color"]').getAttribute('content'))?.toUpperCase()).toBe(mist)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Đồ ăn vặt, nước uống và nhu yếu phẩm. Giao hàng trong 2 giờ.')
    })

    test('has no coffee words, dollars, roast dates or decimal prices', async ({ page }) => {
      const text = await page.locator('body').innerText()
      // "rang" alone is fine: Hạt điều rang muối means salted roasted cashews.
      for (const word of [/second crack/i, /roast/i, /grind/i, /coffee/i, /cà phê/i, /\$/, /USD/, /ngày rang/i]) {
        expect(text, `found ${word}`).not.toMatch(word)
      }
      expect(text).not.toMatch(/\d,\d+\s?₫/)
      expect(text).not.toMatch(/\.\d{1,2}\s?₫/)
    })

    test('passes an axe scan for WCAG A and AA, contrast included', async ({ page }) => {
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
    })

    for (const [width, height] of [
      [390, 844],
      [1366, 900],
    ]) {
      test(`fits ${width} px without sideways scrolling`, async ({ page }) => {
        await page.setViewportSize({ width, height })
        expect(await page.locator('html').evaluate((html) => html.scrollWidth <= html.clientWidth)).toBe(true)
      })
    }
  })
}

test('the background, action and accent colors differ, and the accent marks only deals, cart counts and the home banner', async ({ page }) => {
  await page.goto('/')
  const colors = await page.locator('body').evaluate((body) => {
    const apricot = getComputedStyle(body.querySelector('.bg-apricot') as Element).backgroundColor
    const banner = [...body.querySelectorAll('section')].find((s) => s.querySelector('h1')?.textContent === 'Giao hàng trong 2 giờ')
    const misplaced = [...body.querySelectorAll('*')].filter((el) => {
      const s = getComputedStyle(el)
      const usesApricot = [s.backgroundColor, s.color, s.borderTopColor].includes(apricot) || (el.tagName !== 'S' && s.textDecorationColor === apricot && s.textDecorationLine !== 'none')
      const isDeal = /^-\d+%$/.test(el.textContent ?? '') || el.tagName === 'S'
      const isCartCount = !!el.closest('[aria-label^="Mở giỏ hàng"], [aria-label^="Xem giỏ"]')
      const isBanner = !!banner?.contains(el)
      return usesApricot && !isDeal && !isCartCount && !isBanner
    })
    return {
      background: getComputedStyle(body).backgroundColor,
      action: getComputedStyle(body.querySelector('header .bg-sea') as Element).backgroundColor,
      deal: apricot,
      misplaced: misplaced.map((el) => el.outerHTML.slice(0, 80)),
    }
  })
  expect(new Set([colors.background, colors.action, colors.deal]).size).toBe(3)
  expect(colors.misplaced).toEqual([])
})

test('the favicon is the store basket drawn only in the cream page color and the green action color', async ({ page }) => {
  await page.goto('/')
  const icon = page.locator('link[rel="icon"]')
  await expect(icon).toHaveAttribute('href', '/favicon.svg')
  await expect(icon).toHaveAttribute('type', 'image/svg+xml')
  const tokens = await page.locator('html').evaluate((html) => {
    const style = getComputedStyle(html)
    return [style.getPropertyValue('--mist'), style.getPropertyValue('--sea')].map((v) => v.trim().toUpperCase())
  })

  const response = await page.request.get('/favicon.svg')
  expect(response.headers()['content-type']).toContain('image/svg+xml')
  const svg = await response.text()
  const colors = [...new Set(svg.toUpperCase().match(/#[0-9A-F]{3}(?:[0-9A-F]{3})?\b/g))]
  expect(colors.sort()).toEqual(tokens.sort())
  expect(svg.match(/<rect\b/g)).toHaveLength(1)
  expect(svg.match(/<path\b/g)).toHaveLength(3)
})

test.describe('with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('nothing animates on load or when the cart opens', async ({ page }) => {
    await page.goto('/')
    expect(await page.locator('html').evaluate((html) => html.ownerDocument.getAnimations().length)).toBe(0)
    await page.getByRole('button', { name: /^Mở giỏ hàng/ }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    expect(await page.locator('html').evaluate((html) => html.ownerDocument.getAnimations().length)).toBe(0)
  })
})

/**
 * Presses Tab until the target has focus, checking that every control passed on the way shows a focus ring.
 * Tabbing past the last control leaves the page for the browser's own controls and then starts again at the top,
 * which the page sees as nothing focused; that stop is skipped.
 */
async function tabTo(page: Page, target: Locator) {
  for (let i = 0; i < 80; i++) {
    await page.keyboard.press('Tab')
    const ring = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement
      const s = getComputedStyle(el)
      const outline = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0
      return { left: el === document.body, outline, shadow: s.boxShadow !== 'none', tag: el.outerHTML.slice(0, 60) }
    })
    if (ring.left) continue
    expect(ring.outline || ring.shadow, `no focus ring on ${ring.tag}`).toBe(true)
    if (await target.evaluate((el) => el === document.activeElement)) return
  }
  throw new Error('Never reached the target with Tab')
}

test('a shopper can search, add, open the cart and order with the keyboard alone', async ({ page }) => {
  await page.goto('/')
  await tabTo(page, page.getByRole('searchbox', { name: 'Tìm sản phẩm' }))
  await page.keyboard.type('banh quy')
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/search\?q=banh/)

  await tabTo(page, page.getByRole('button', { name: 'Thêm Bánh quy bơ vào giỏ' }))
  await page.keyboard.press('Enter')
  await tabTo(page, page.getByRole('button', { name: 'Mở giỏ hàng, 1 món' }))
  await page.keyboard.press('Enter')
  await tabTo(page, page.getByRole('dialog').getByRole('link', { name: 'Thanh toán' }))
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/checkout$/)

  for (const [label, value] of [
    ['Họ và tên', 'Lê Thu Hà'],
    ['Số điện thoại', '0912345678'],
    ['Số nhà, tên đường', '8 Hàng Bài'],
    ['Phường/Xã', 'Phường Tràng Tiền'],
  ]) {
    await tabTo(page, page.getByLabel(label, { exact: true }))
    await page.keyboard.type(value)
  }
  await tabTo(page, page.getByRole('combobox', { name: 'Tỉnh/Thành phố' }))
  await page.keyboard.press('Enter')
  await expect(page.getByRole('option', { name: 'Hà Nội' })).toBeFocused()
  await page.keyboard.press('Enter')
  await tabTo(page, page.getByRole('button', { name: 'Đặt hàng' }))
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL(/\/order\/THY-\d{6}$/)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cảm ơn Lê Thu Hà!')
})

test('on a phone, a control reached by keyboard is never hidden behind the cart bar', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The cart bar is for phones')
  await page.goto('/c/do-an-vat')
  await page.getByRole('button', { name: 'Thêm Khoai tây chiên vị tảo biển vào giỏ' }).click()
  const bar = page.getByRole('link', { name: /^Xem giỏ hàng, \d+ món/ })
  await expect(bar).toBeVisible()

  // Put the button on screen but behind the bar: a browser only scrolls a focused control it thinks is out of view.
  const tile = page.getByRole('article').filter({ hasText: 'Kẹo dẻo trái cây' })
  const button = tile.getByRole('button', { name: 'Thêm Kẹo dẻo trái cây vào giỏ' })
  await button.evaluate((el) => window.scrollBy(0, el.getBoundingClientRect().bottom - (window.innerHeight - 10)))
  await tile.getByRole('link').focus()
  await page.keyboard.press('Tab')
  await expect(button).toBeFocused()

  const [buttonBox, barBox] = [await button.boundingBox(), await bar.boundingBox()]
  if (!buttonBox || !barBox) throw new Error('the button or the bar is not on screen')
  expect(buttonBox.y + buttonBox.height).toBeLessThanOrEqual(barBox.y)
})
