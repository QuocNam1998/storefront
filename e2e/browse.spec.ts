import { expect, test, type Page } from '@playwright/test'

const results = (page: Page) => page.getByRole('region', { name: 'Kết quả' })
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
  const prices = await listedPrices(page)
  expect(prices).toHaveLength(8)
  expect(prices).toEqual([...prices].sort((a, b) => a - b))
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

test('the home page shows delivery, the categories, deals, then a row per category', async ({ page }) => {
  await page.goto('/')
  const main = page.getByRole('main')
  await expect(main.getByRole('heading', { level: 1 })).toHaveText('Giao hàng trong 2 giờ')
  await expect(main).toContainText('Miễn phí giao hàng cho đơn từ 300.000 ₫')

  const sections = await main.locator('section').evaluateAll((els) => els.map((el) => el.getAttribute('aria-label')))
  expect(sections).toEqual(['Danh mục sản phẩm', 'Ưu đãi tuần này', 'Đồ ăn vặt', 'Nước uống', 'Nhu yếu phẩm'])
  // The product rows scroll sideways; the page itself must not.
  expect(await page.locator('html').evaluate((html) => html.scrollWidth <= html.clientWidth)).toBe(true)

  await main.getByRole('region', { name: 'Danh mục sản phẩm' }).getByRole('link', { name: /Nhu yếu phẩm/ }).click()
  await expect(page).toHaveURL(/\/c\/nhu-yeu-pham$/)
  await page.goBack()
  await main.getByRole('link', { name: 'Xem tất cả Nước uống' }).click()
  await expect(page).toHaveURL(/\/c\/nuoc-uong$/)
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

test('similar products start with the same subcategory', async ({ page }) => {
  await page.goto('/p/nuoc-suoi-tinh-khiet')
  const similar = page.getByRole('region', { name: 'Sản phẩm tương tự' }).getByRole('heading', { level: 3 })
  await expect(similar.first()).toHaveText('Nước khoáng thiên nhiên')
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
})

test('a tile turns Thêm into a quantity control and back', async ({ page }) => {
  await page.goto('/c/do-an-vat')
  const tile = page.getByRole('article').filter({ hasText: 'Bánh quy bơ' })
  await tile.getByRole('button', { name: /^Thêm/ }).click()
  await expect(page.getByRole('button', { name: 'Mở giỏ hàng, 1 món' })).toBeAttached()
  await expect(tile.getByRole('group')).toHaveText('1')

  await tile.getByRole('button', { name: 'Tăng số lượng' }).click()
  await tile.getByRole('button', { name: 'Tăng số lượng' }).click()
  await expect(tile.getByRole('group')).toHaveText('3')

  for (let i = 0; i < 3; i++) await tile.getByRole('button', { name: 'Giảm số lượng' }).click()
  await expect(tile.getByRole('button', { name: /^Thêm/ })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Mở giỏ hàng, 0 món' })).toBeAttached()
})
