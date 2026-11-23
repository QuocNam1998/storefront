import { expect, test, type Locator, type Page } from '@playwright/test'

const results = (page: Page) => page.getByRole('region', { name: 'Kết quả' })

async function box(locator: Locator) {
  const b = await locator.boundingBox()
  if (!b) throw new Error(`${locator} is not visible`)
  return b
}
async function listedNames(page: Page): Promise<string[]> {
  const names = results(page).getByRole('heading', { level: 3 })
  // Reading every heading doesn't wait for the page, so wait for the first tile before reading.
  await names.first().waitFor()
  return names.allTextContents()
}

/** Each tile's current price, read from the first đồng amount on it (the old price comes after). */
async function listedPrices(page: Page): Promise<number[]> {
  const texts = await results(page).locator('article').allInnerTexts()
  return texts.map((t) => Number(/([\d.]+)\s₫/.exec(t)?.[1].replaceAll('.', '')))
}

test('a subcategory filter narrows the category and survives a reload', async ({ page }) => {
  await page.goto('/c/nuoc-uong')
  await page.getByRole('button', { name: 'Nước suối', exact: true }).click()
  await expect(page).toHaveURL(/[?&]sub=nuoc-suoi/)
  await expect(results(page)).toContainText('2 sản phẩm')
  expect(await listedNames(page)).toEqual(['Nước suối tinh khiết', 'Nước khoáng thiên nhiên'])

  await page.reload()
  await expect(page.getByRole('button', { name: 'Nước suối', exact: true })).toHaveAttribute('aria-pressed', 'true')
  expect(await listedNames(page)).toEqual(['Nước suối tinh khiết', 'Nước khoáng thiên nhiên'])
})

test('sorting by price lists each product no cheaper than the one before', async ({ page }) => {
  await page.goto('/c/do-an-vat')
  await page.getByRole('combobox', { name: 'Sắp xếp' }).click()
  await page.getByRole('option', { name: 'Giá thấp đến cao', exact: true }).click()
  await expect(page).toHaveURL(/[?&]sort=price-asc/)
  // The list re-sorts a moment after the address changes, so check again until it has.
  await expect(async () => {
    const prices = await listedPrices(page)
    expect(prices).toHaveLength(8)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  }).toPass()
})

test('in-stock only hides products that are sold out', async ({ page }) => {
  await page.goto('/c/nhu-yeu-pham')
  expect(await listedNames(page)).toContain('Dầu gội')
  // The box ticks once the address updates, a moment after the click.
  await page.getByLabel('Chỉ hiện hàng còn').click()
  await expect(page.getByLabel('Chỉ hiện hàng còn')).toBeChecked()
  await expect(page).toHaveURL(/[?&]stock=in/)
  await expect(results(page)).toContainText('7 sản phẩm')
  expect(await listedNames(page)).not.toContain('Dầu gội')
})

test('the home page shows the delivery banner, then every product in one grid', async ({ page, isMobile }) => {
  await page.goto('/')
  const main = page.getByRole('main')
  await expect(main.getByRole('heading', { level: 1 })).toHaveText('Giao hàng trong 2 giờ')
  await expect(main).toContainText('Miễn phí giao hàng cho đơn từ 300.000 ₫')

  const all = main.getByRole('region', { name: 'Tất cả sản phẩm' })
  await expect(all).toContainText('24 sản phẩm')
  const names = all.getByRole('heading', { level: 3 })
  await expect(names).toHaveCount(24)
  await expect(names.first()).toHaveText('Khoai tây chiên vị tảo biển')
  await expect(names.last()).toHaveText('Nước mắm')
  const columns = await all.getByRole('article').evaluateAll((tiles) => {
    const tops = tiles.map((t) => t.getBoundingClientRect().top)
    return tops.filter((top) => top === tops[0]).length
  })
  expect(columns).toBe(isMobile ? 2 : 3)
  expect(await page.locator('html').evaluate((html) => html.scrollWidth <= html.clientWidth)).toBe(true)

  await main.getByRole('link', { name: 'Xem ưu đãi' }).click()
  await expect(page).toHaveURL(/\/deals$/)
})

test('below desktop width the categories show as a row of icon tiles instead of the sidebar', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The icon row replaces the sidebar on phones')
  await page.goto('/')
  const row = page.getByRole('navigation', { name: 'Danh mục' })
  await expect(row.getByRole('link')).toHaveText(['Đồ ăn vặt', 'Nước uống', 'Nhu yếu phẩm', 'Ưu đãi'])
  await row.getByRole('link', { name: 'Ưu đãi' }).click()
  await expect(page).toHaveURL(/\/deals$/)
  await expect(row.getByRole('link', { name: 'Ưu đãi' })).toHaveAttribute('aria-current', 'page')
})

test('the shop layout has the sidebar and cart panel from 1280 px, and the icon row below that', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Sets its own window sizes')
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Danh mục' })
  const panel = page.getByRole('complementary', { name: 'Giỏ hàng' })
  await expect(panel).toBeVisible()
  await expect(nav.getByRole('link').first()).toHaveText(/^Tất cả/)

  await page.setViewportSize({ width: 1024, height: 800 })
  await expect(panel).toBeHidden()
  await expect(nav.getByRole('link')).toHaveText(['Đồ ăn vặt', 'Nước uống', 'Nhu yếu phẩm', 'Ưu đãi'])
  await page.getByRole('button', { name: 'Thêm Bánh quy bơ vào giỏ' }).click()
  await expect(page.getByRole('link', { name: /^Xem giỏ hàng, \d+ món/ })).toBeHidden()
  await page.getByRole('button', { name: 'Mở giỏ hàng, 1 món' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('the deals page lists exactly the products with a pack on a deal', async ({ page }) => {
  await page.goto('/deals')
  expect(await listedNames(page)).toEqual(['Hạt điều rang muối', 'Nước suối tinh khiết', 'Nước giặt'])
})

test('the header search ignores accents and case', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('searchbox', { name: 'Tìm sản phẩm' }).fill('nuoc suoi')
  await page.getByRole('searchbox', { name: 'Tìm sản phẩm' }).press('Enter')
  await expect(page).toHaveURL(/\/search\?q=nuoc(%20|\+)suoi$/)
  // A keyboard shopper stays in the search box, instead of being sent back to the top of the page.
  await expect(page.getByRole('searchbox', { name: 'Tìm sản phẩm' })).toBeFocused()
  expect(await listedNames(page)).toContain('Nước suối tinh khiết')

  await page.goto('/search?q=banh')
  expect(await listedNames(page)).toEqual(expect.arrayContaining(['Bánh quy bơ', 'Bánh gạo nướng vị ngọt']))
})

test('the header search box shows the address search, and the earlier one after Back', async ({ page }) => {
  const search = page.getByRole('searchbox', { name: 'Tìm sản phẩm' })
  await page.goto('/search?q=banh')
  await expect(search).toHaveValue('banh')
  await page.goto('/')
  await expect(search).toHaveValue('')

  await page.goto('/search?q=nuoc')
  await search.fill('banh')
  await search.press('Enter')
  await expect(page).toHaveURL(/\/search\?q=banh$/)
  await page.goBack()
  await expect(page).toHaveURL(/\/search\?q=nuoc$/)
  await expect(search).toHaveValue('nuoc')
})

test('a search with no results says so and links to the three categories', async ({ page }) => {
  await page.goto('/search?q=xyz123')
  await expect(results(page)).toContainText('Không tìm thấy sản phẩm nào cho "xyz123"')
  for (const name of ['Đồ ăn vặt', 'Nước uống', 'Nhu yếu phẩm']) {
    await expect(results(page).getByRole('link', { name })).toBeVisible()
  }
  await results(page).getByRole('link', { name: 'Nước uống' }).click()
  await expect(page).toHaveURL(/\/c\/nuoc-uong$/)
})

test('a chosen pack and quantity go into the cart from the product page', async ({ page }) => {
  await page.goto('/p/nuoc-suoi-tinh-khiet')
  await page.getByRole('radio', { name: /Thùng 24 chai/ }).click()
  await expect(page.getByRole('main')).toContainText('-14%')
  await page.getByRole('button', { name: 'Tăng số lượng' }).click()
  await page.getByRole('button', { name: 'Thêm vào giỏ' }).click()

  const drawer = page.getByRole('dialog')
  await expect(drawer).toContainText('Thùng 24 chai')
  await expect(drawer.getByRole('listitem')).toHaveCount(1)
  await expect(drawer.getByRole('group')).toHaveText('2')
})

test('similar products are the first four, starting with the same subcategory', async ({ page }) => {
  await page.goto('/p/nuoc-suoi-tinh-khiet')
  const similar = page.getByRole('region', { name: 'Có thể bạn cũng thích' }).getByRole('heading', { level: 3 })
  await expect(similar).toHaveCount(4)
  await expect(similar.first()).toHaveText('Nước khoáng thiên nhiên')
})

test('the desktop product page shows its parts in order', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The phone layout is checked on its own')
  await page.goto('/p/nuoc-suoi-tinh-khiet')
  const crumbs = page.getByRole('navigation', { name: 'Đường dẫn' })
  await expect(crumbs.getByRole('link')).toHaveText(['Trang chủ', 'Nước uống'])
  await expect(crumbs).toContainText('Nước suối tinh khiết')

  const main = page.getByRole('main')
  await expect(main).toContainText(/5\.000\s₫\s*\/\s*Chai 500 ml/)
  await expect(main).toContainText('10.000 ₫/L')
  const parts = [
    main.getByRole('link', { name: 'Nước uống', exact: true }).last(),
    main.getByRole('heading', { level: 1 }),
    main.getByRole('heading', { name: 'Chọn loại' }),
    main.getByRole('button', { name: /^Thêm vào giỏ ·/ }),
    main.getByText('Thanh toán khi nhận hàng (COD)'),
    main.getByRole('heading', { name: 'Mô tả sản phẩm' }),
    main.getByRole('heading', { name: 'Có thể bạn cũng thích' }),
  ]
  const tops = []
  for (const part of parts) tops.push((await box(part)).y)
  expect(tops).toEqual([...tops].sort((a, b) => a - b))
  await expect(main.getByRole('button', { name: 'Mua ngay' })).toBeVisible()
})

test('the add button shows the total for the chosen pack and quantity, and packs can be chosen by keyboard', async ({ page }) => {
  await page.goto('/p/nuoc-suoi-tinh-khiet')
  await page.getByRole('radio', { name: /Thùng 24 chai/ }).click()
  await page.getByRole('button', { name: 'Tăng số lượng' }).click()
  await expect(page.getByRole('button', { name: /^Thêm vào giỏ ·/ })).toHaveText('Thêm vào giỏ · 198.000 ₫')

  await page.getByRole('radio', { name: /Chai 500 ml/ }).click()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('radio', { name: /Lốc 6 chai/ })).toBeFocused()
  await page.keyboard.press('Space')
  await expect(page.getByRole('radio', { name: /Lốc 6 chai/ })).toBeChecked()
})

test('on a phone the product page has no header, puts back and cart buttons on the photo and fixes the add bar to the bottom', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The phone layout of the product page')
  await page.goto('/')
  await page.getByRole('link', { name: 'Bánh quy bơ' }).click()
  await expect(page).toHaveURL(/\/p\/banh-quy-bo$/)
  await expect(page.getByRole('banner')).toHaveCount(0)
  await expect(page.getByRole('searchbox')).toHaveCount(0)

  const bar = page.locator('[data-bottom-bar]')
  await expect(bar.getByRole('button', { name: /^Thêm vào giỏ ·/ })).toBeVisible()
  const windowHeight = await page.evaluate(() => window.innerHeight)
  const barBox = await box(bar)
  expect(barBox.y + barBox.height).toBe(windowHeight)
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  const footer = await box(page.getByRole('contentinfo'))
  expect(footer.y + footer.height).toBeLessThanOrEqual((await box(bar)).y)

  await page.getByRole('button', { name: 'Mở giỏ hàng, 0 món' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Quay lại' }).click()
  await expect(page).toHaveURL(/\/$/)

  await page.goto('/p/banh-quy-bo')
  await page.getByRole('button', { name: 'Quay lại' }).click()
  await expect(page).toHaveURL(/\/$/)
})

test('from 768 px the product page has the site header and no photo buttons', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Sets its own window size')
  await page.setViewportSize({ width: 768, height: 900 })
  await page.goto('/p/banh-quy-bo')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Quay lại' })).toHaveCount(0)
  await page.getByRole('banner').getByRole('button', { name: /^Mở giỏ hàng/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
})

test('every product page lists the delivery promise, the free-delivery rule and cash on delivery', async ({ page }) => {
  await page.goto('/p/banh-quy-bo')
  const main = page.getByRole('main')
  for (const text of ['Giao hàng trong 2 giờ', 'Miễn phí giao hàng cho đơn từ 300.000 ₫', 'Thanh toán khi nhận hàng (COD)']) {
    await expect(main.getByText(text, { exact: true })).toBeVisible()
  }
})

test('a low-stock product page says so and still lets the product be added', async ({ page }) => {
  await page.goto('/p/nuoc-dua-dong-hop')
  await expect(page.getByRole('main')).toContainText('Sắp hết hàng')
  await expect(page.getByRole('button', { name: 'Thêm vào giỏ' })).toBeEnabled()
})

test('an out-of-stock product says so and cannot be added', async ({ page }) => {
  await page.goto('/p/dau-goi')
  await expect(page.getByRole('main')).toContainText('Hết hàng')
  await expect(page.getByRole('button', { name: 'Thêm vào giỏ' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Mua ngay' })).toBeDisabled()
})

test('the header has the logo, the search field and the cart button, and no category row', async ({ page, isMobile }) => {
  await page.goto('/c/do-an-vat')
  const header = page.getByRole('banner')
  await expect(header.getByRole('navigation')).toHaveCount(0)
  const footer = page.getByRole('contentinfo')
  for (const name of ['Đồ ăn vặt', 'Nước uống', 'Nhu yếu phẩm']) await expect(footer.getByRole('link', { name })).toBeVisible()

  const tile = page.getByRole('article').filter({ hasText: 'Bánh quy bơ' })
  await tile.getByRole('button', { name: /^Thêm/ }).click()
  for (let i = 0; i < 3; i++) await tile.getByRole('button', { name: 'Tăng số lượng' }).click()
  const cart = header.getByRole('button', { name: 'Mở giỏ hàng, 4 món' })
  await expect(cart.getByText('4', { exact: true })).toBeVisible()
  if (isMobile) await expect(cart.getByText('Giỏ hàng')).toBeHidden()
  else await expect(cart.getByText('Giỏ hàng')).toBeVisible()

  const logo = header.getByRole('link', { name: 'Cửa hàng của Thy' })
  const search = header.getByRole('searchbox', { name: 'Tìm sản phẩm' })
  const [logoBox, searchBox] = [await box(logo), await box(search)]
  // On a phone the search field gets its own row under the logo; on desktop they share one.
  if (isMobile) expect(searchBox.y).toBeGreaterThan(logoBox.y + logoBox.height)
  else expect(searchBox.y).toBeLessThan(logoBox.y + logoBox.height)

  await cart.click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await page.keyboard.press('Escape')
  await logo.click()
  await expect(page).toHaveURL(/\/$/)
})

test('tile buttons in one grid row line up, and read Thêm vào giỏ on desktop and Thêm on a phone', async ({ page, isMobile }) => {
  await page.goto('/c/do-an-vat')
  const buttons = page.getByRole('article').getByRole('button', { name: /^Thêm/ })
  // The first row mixes a two-line name with a one-line one.
  const lastInRow = isMobile ? 1 : 2
  expect((await box(buttons.nth(lastInRow))).y).toBe((await box(buttons.nth(0))).y)
  await expect(buttons.first()).toHaveText(isMobile ? 'Thêm' : 'Thêm vào giỏ', { useInnerText: true })
})

test('the desktop sidebar lists every category with its count and marks the current one', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The sidebar is for desktop widths')
  await page.goto('/c/do-an-vat')
  const sidebar = page.getByRole('navigation', { name: 'Danh mục' })
  await expect(sidebar.getByRole('link')).toHaveText([/^Tất cả\s*24$/, /^Đồ ăn vặt\s*8$/, /^Nước uống\s*8$/, /^Nhu yếu phẩm\s*8$/, /^Ưu đãi\s*3$/])
  await expect(sidebar.getByRole('link', { name: /Đồ ăn vặt/ })).toHaveAttribute('aria-current', 'page')
  await sidebar.getByRole('link', { name: /Nước uống/ }).click()
  await expect(page).toHaveURL(/\/c\/nuoc-uong$/)
})

test('the desktop cart panel shows the cart, updates with the tiles and stays in view', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The cart panel is for desktop widths')
  await page.goto('/c/do-an-vat')
  const panel = page.getByRole('complementary', { name: 'Giỏ hàng' })
  await expect(panel).toContainText('Giỏ hàng đang trống.')
  await expect(panel.getByRole('link', { name: /Thanh toán/ })).toHaveCount(0)

  const tile = page.getByRole('article').filter({ hasText: 'Bánh quy bơ' })
  await tile.getByRole('button', { name: /^Thêm/ }).click()
  await expect(panel).toContainText('Bánh quy bơ')
  await expect(panel).toContainText(/Phí giao hàng\s*20\.000\s₫/)
  await expect(panel).toContainText(/Tổng cộng\s*109\.000\s₫/)
  await panel.getByRole('button', { name: 'Tăng số lượng' }).click()
  await expect(tile.getByRole('group')).toHaveText('2 trong giỏ')

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(panel).toBeInViewport()
  await panel.getByRole('link', { name: /Thanh toán/ }).click()
  await expect(page).toHaveURL(/\/checkout$/)
})

test('the phone cart bar shows once the cart has items, never covers the footer, and opens the cart', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The cart bar is for phones')
  await page.goto('/c/do-an-vat')
  // The footer has its own plain "Xem giỏ hàng" link; the bar's name also carries the count and subtotal.
  const bar = page.getByRole('link', { name: /^Xem giỏ hàng, \d+ món/ })
  await expect(bar).toHaveCount(0)

  await page.getByRole('article').filter({ hasText: 'Bánh quy bơ' }).getByRole('button', { name: /^Thêm/ }).click()
  await expect(bar).toHaveAccessibleName('Xem giỏ hàng, 1 món, 89.000 ₫')
  await expect(bar).toContainText('Giỏ hàng')

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  const [footer, barBox] = [await box(page.getByRole('contentinfo')), await box(bar)]
  expect(footer.y + footer.height).toBeLessThanOrEqual(barBox.y)

  await bar.click()
  await expect(page).toHaveURL(/\/cart$/)
})

test('a tile turns Thêm into a quantity control and back', async ({ page }) => {
  await page.goto('/c/do-an-vat')
  const tile = page.getByRole('article').filter({ hasText: 'Bánh quy bơ' })
  await tile.getByRole('button', { name: /^Thêm/ }).click()
  await expect(page.getByRole('button', { name: 'Mở giỏ hàng, 1 món' })).toBeAttached()
  await expect(tile.getByRole('group')).toHaveText('1 trong giỏ')

  await tile.getByRole('button', { name: 'Tăng số lượng' }).click()
  await tile.getByRole('button', { name: 'Tăng số lượng' }).click()
  await expect(tile.getByRole('group')).toHaveText('3 trong giỏ')

  for (let i = 0; i < 3; i++) await tile.getByRole('button', { name: 'Giảm số lượng' }).click()
  await expect(tile.getByRole('button', { name: /^Thêm/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mở giỏ hàng, 0 món' })).toBeAttached()
})
