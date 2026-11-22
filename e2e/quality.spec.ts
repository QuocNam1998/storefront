import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator, type Page } from '@playwright/test'

const ORDER = {
  id: 'THY-123456',
  createdAt: '2026-11-22T08:00:00.000Z',
  name: 'Nguyễn Thị Lan',
  phone: '090 123 4567',
  street: '12 Lê Lợi',
  ward: 'Phường Bến Nghé',
  province: 'TP. Hồ Chí Minh',
  payment: 'cod',
  lines: [{ name: 'Bánh quy bơ', slug: 'banh-quy-bo', packLabel: 'Hộp 454 g', qty: 2, lineTotal: 178000 }],
  subtotal: 178000,
  delivery: 20000,
  total: 198000,
}

const PAGES = [
  '/',
  '/c/do-an-vat',
  '/c/nuoc-uong',
  '/c/nhu-yeu-pham',
  '/deals',
  '/search?q=banh',
  '/search?q=xyz123',
  '/p/hat-dieu-rang-muoi',
  '/p/dau-goi',
  '/cart',
  '/checkout',
  `/order/${ORDER.id}`,
  '/khong-co-trang-nay',
]

/** Every page opens with a cart line and a saved order, so the cart, checkout and confirmation have content. */
async function seed(page: Page) {
  await page.addInitScript((order) => {
    localStorage.setItem('thy-store.cart', JSON.stringify([{ key: 'p05|hu-250g', productId: 'p05', packId: 'hu-250g', qty: 1 }]))
    localStorage.setItem('thy-store.orders', JSON.stringify({ [order.id]: order }))
  }, ORDER)
}

for (const path of PAGES) {
  test.describe(`page ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      await seed(page)
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    })

    test('carries the store name and is in Vietnamese', async ({ page }) => {
      await expect(page).toHaveTitle(/Cửa hàng của Thy/)
      await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
      await expect(page.getByRole('banner')).toContainText('Cửa hàng của Thy')
      await expect(page.getByRole('contentinfo')).toContainText('Cửa hàng của Thy')
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

test('the background, action and deal colors differ, and the deal color marks only deals', async ({ page }) => {
  await page.goto('/')
  const colors = await page.locator('body').evaluate((body) => {
    const apricot = getComputedStyle(body.querySelector('.bg-apricot') as Element).backgroundColor
    const misplaced = [...body.querySelectorAll('*')].filter((el) => {
      const s = getComputedStyle(el)
      const usesApricot = [s.backgroundColor, s.color, s.borderTopColor].includes(apricot) || (el.tagName !== 'S' && s.textDecorationColor === apricot && s.textDecorationLine !== 'none')
      const isDeal = /^-\d+%$/.test(el.textContent ?? '') || el.tagName === 'S'
      return usesApricot && !isDeal
    })
    return {
      background: getComputedStyle(body).backgroundColor,
      action: getComputedStyle(body.querySelector('button[type=submit]') as Element).backgroundColor,
      deal: apricot,
      misplaced: misplaced.map((el) => el.outerHTML.slice(0, 80)),
    }
  })
  expect(new Set([colors.background, colors.action, colors.deal]).size).toBe(3)
  expect(colors.misplaced).toEqual([])
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
