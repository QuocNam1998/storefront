import { expect, test, type Page } from '@playwright/test'
import { getProductBySlug, productsInCategory } from '@/data/catalog'
import { ORDER, PAGES, seed } from './seed'

const UNKNOWN = ['/khong-co-trang-nay', '/c/khong-co', '/p/khong-co']

test('unknown addresses answer 404 and every real page answers 200', async ({ request }) => {
  for (const path of UNKNOWN) expect((await request.get(path)).status(), path).toBe(404)
  for (const path of ['/', '/c/do-an-vat', '/p/nuoc-suoi-tinh-khiet', '/cart', `/order/${ORDER.id}`]) {
    expect((await request.get(path)).status(), path).toBe(200)
  }
})

test('unknown addresses, categories and products show the not found page', async ({ page }) => {
  for (const path of UNKNOWN) {
    await page.goto(path)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Không tìm thấy trang')
  }
})

test('every page keeps the store title, description, icon and Vietnamese language', async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path)
    await expect(page.locator('html')).toHaveAttribute('lang', 'vi')
    await expect(page).toHaveTitle(/Cửa hàng của Thy/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Đồ ăn vặt, nước uống và nhu yếu phẩm. Giao hàng trong 2 giờ.')
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', /\/favicon\.svg/)
  }
})

test('moving to a product page and back happens without reloading the page', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => Object.assign(window, { stillThisPage: true }))
  await page.getByRole('link', { name: 'Bánh quy bơ' }).click()
  await expect(page).toHaveURL(/\/p\/banh-quy-bo$/)
  expect(await page.evaluate(() => 'stillThisPage' in window)).toBe(true)
  await page.goBack()
  await expect(page).toHaveURL(/\/$/)
  expect(await page.evaluate(() => 'stillThisPage' in window)).toBe(true)
})

test.describe('with JavaScript turned off', () => {
  test.use({ javaScriptEnabled: false })

  const results = (page: Page) => page.getByRole('region', { name: 'Kết quả' })

  test('the product page has its details, description and similar products', async ({ page }) => {
    const product = getProductBySlug('nuoc-suoi-tinh-khiet')
    await page.goto('/p/nuoc-suoi-tinh-khiet')
    const main = page.getByRole('main')
    await expect(main.getByRole('heading', { level: 1 })).toHaveText('Nước suối tinh khiết')
    await expect(main).toContainText(/5\.000\s₫\s*\/\s*Chai 500 ml/)
    await expect(main).toContainText('10.000 ₫/L')
    await expect(main).toContainText(product?.description ?? 'missing product')
    await expect(page.getByRole('region', { name: 'Có thể bạn cũng thích' }).getByRole('heading', { level: 3 })).toHaveCount(4)
  })

  test('the home page has the banner and all 24 products', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Giao hàng trong 2 giờ')
    await expect(page.getByRole('region', { name: 'Tất cả sản phẩm' }).getByRole('heading', { level: 3 })).toHaveCount(24)
  })

  test('the deals page lists the three deals with their badge and old price', async ({ page }) => {
    await page.goto('/deals')
    await expect(results(page).getByRole('heading', { level: 3 })).toHaveText(['Hạt điều rang muối', 'Nước suối tinh khiết', 'Nước giặt'])
    await expect(results(page)).toContainText('-15%')
    await expect(results(page).locator('s').first()).toContainText('135.000 ₫')
  })

  test('search shows its results, or says there are none', async ({ page }) => {
    await page.goto('/search?q=banh')
    await expect(results(page)).toContainText('Bánh quy bơ')
    await page.goto('/search?q=xyz123')
    await expect(results(page)).toContainText('Không tìm thấy sản phẩm nào cho "xyz123"')
  })

  test('a category arrives filtered and sorted as its address says', async ({ page }) => {
    const expected = productsInCategory('snacks')
      .filter((p) => p.subcategoryId === 'banh-quy-banh-gao')
      .sort((a, b) => a.packs[0].price - b.packs[0].price)
      .map((p) => p.name)
    await page.goto('/c/do-an-vat?sub=banh-quy-banh-gao&sort=price-asc')
    await expect(results(page).getByRole('heading', { level: 3 })).toHaveText(expected)
  })

  test('an unknown address or product shows the not found page', async ({ page }) => {
    for (const path of ['/khong-co-trang-nay', '/p/khong-co']) {
      await page.goto(path)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('Không tìm thấy trang')
    }
  })
})

test('the server never sends a cart count of 0, an empty cart or a missing order', async ({ request }) => {
  const home = await (await request.get('/')).text()
  expect(home).not.toContain('Mở giỏ hàng, 0 món')
  expect(home).not.toContain('Giỏ hàng đang trống.')
  expect(await (await request.get(`/order/${ORDER.id}`)).text()).not.toContain('Không tìm thấy đơn hàng')
})

test('a cart and order saved before the move show once the page has loaded', async ({ page }) => {
  await page.addInitScript((order) => {
    localStorage.setItem('thy-store.cart', JSON.stringify([{ key: 'p05|hu-250g', productId: 'p05', packId: 'hu-250g', qty: 3 }]))
    localStorage.setItem('thy-store.orders', JSON.stringify({ [order.id]: order }))
  }, ORDER)
  await page.goto('/')
  await expect(page.getByRole('banner').getByRole('button', { name: 'Mở giỏ hàng, 3 món' })).toBeVisible()
  await page.goto(`/order/${ORDER.id}`)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(`Cảm ơn ${ORDER.name}!`)
})

/** Opens each page and returns the console errors and warnings, leaving out the browser's report of a 404 page. */
async function consoleProblems(page: Page) {
  const problems: string[] = []
  page.on('console', (m) => {
    // A not found page answers 404 on purpose, and the browser reports that as an error.
    const own404 = m.text().startsWith('Failed to load resource') && m.text().includes('404') && m.location().url === page.url()
    if (['error', 'warning'].includes(m.type()) && !own404) problems.push(`${page.url()} ${m.type()}: ${m.text().slice(0, 200)}`)
  })
  for (const path of PAGES) {
    await page.goto(path, { waitUntil: 'networkidle' })
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  }
  return problems
}

test('no page logs an error or warning with an empty browser', async ({ page }) => {
  expect(await consoleProblems(page)).toEqual([])
})

test('no page logs an error or warning with a saved cart and order', async ({ page }) => {
  await seed(page)
  expect(await consoleProblems(page)).toEqual([])
})
