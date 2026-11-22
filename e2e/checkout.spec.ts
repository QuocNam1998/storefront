import { expect, test, type Page } from '@playwright/test'

/** Puts lines straight into the saved cart, for tests that start at checkout. */
async function seedCart(page: Page, items: { productId: string; packId: string; qty: number }[]) {
  await page.goto('/')
  await page.evaluate(
    (lines) => localStorage.setItem('thy-store.cart', JSON.stringify(lines.map((l) => ({ ...l, key: `${l.productId}|${l.packId}` })))),
    items,
  )
  await page.goto('/checkout')
}

async function chooseProvince(page: Page, name: string) {
  await page.getByRole('combobox', { name: 'Tỉnh/Thành phố' }).click()
  await page.getByRole('option', { name, exact: true }).click()
}

const placeOrder = (page: Page) => page.getByRole('button', { name: 'Đặt hàng' }).click()

test('a shopper orders one product from a tile and one from its product page', async ({ page }) => {
  await page.goto('/c/do-an-vat')
  await page.getByRole('article').filter({ hasText: 'Bánh quy bơ' }).getByRole('button', { name: /^Thêm/ }).click()

  await page.goto('/p/nuoc-suoi-tinh-khiet')
  await page.getByRole('radio', { name: /Lốc 6 chai/ }).click()
  await page.getByRole('button', { name: 'Thêm vào giỏ' }).click()
  await page.getByRole('dialog').getByRole('link', { name: 'Thanh toán' }).click()
  await expect(page).toHaveURL(/\/checkout$/)

  await page.getByLabel('Họ và tên').fill('Nguyễn Thị Lan')
  await page.getByLabel('Số điện thoại').fill('090 123 4567')
  await page.getByLabel('Số nhà, tên đường').fill('12 Lê Lợi')
  await page.getByLabel('Phường/Xã').fill('Phường Bến Nghé')
  await chooseProvince(page, 'TP. Hồ Chí Minh')
  await placeOrder(page)

  await expect(page).toHaveURL(/\/order\/THY-\d{6}$/)
  const main = page.getByRole('main')
  await expect(main.getByRole('heading', { level: 1 })).toHaveText('Cảm ơn Nguyễn Thị Lan!')
  for (const text of [
    'Giao hàng trong 2 giờ',
    '090 123 4567',
    '12 Lê Lợi, Phường Bến Nghé, TP. Hồ Chí Minh',
    '1 × Bánh quy bơ',
    'Hộp 454 g',
    '1 × Nước suối tinh khiết',
    'Lốc 6 chai',
  ]) {
    await expect(main).toContainText(text)
  }
  // 89.000 + 28.000, plus 20.000 delivery below the free-delivery threshold.
  await expect(main.getByRole('definition').last()).toHaveText('137.000 ₫')
  await expect(page.getByRole('button', { name: 'Mở giỏ hàng, 0 món' })).toBeVisible()
})

test('delivery is free from 300.000 ₫ and the total adds up', async ({ page }) => {
  await seedCart(page, [{ productId: 'p23', packId: 'tui-5kg', qty: 2 }])
  const summary = page.getByRole('complementary', { name: 'Tóm tắt đơn hàng' })
  await expect(summary).toContainText('Phí giao hàngMiễn phí')
  await expect(summary.getByRole('definition').last()).toHaveText('370.000 ₫')
})

test('checkout promises delivery in 2 hours and has no day or time to choose', async ({ page }) => {
  await seedCart(page, [{ productId: 'p08', packId: 'goi-100g', qty: 1 }])
  await expect(page.getByRole('main')).toContainText('Giao hàng trong 2 giờ')
  await expect(page.locator('input[type=date], input[type=time], input[type=datetime-local]')).toHaveCount(0)
})

test('an empty form lists 5 problems and focuses the name', async ({ page }) => {
  await seedCart(page, [{ productId: 'p08', packId: 'goi-100g', qty: 1 }])
  await placeOrder(page)
  await expect(page.getByRole('alert')).toHaveText('5 trường cần được sửa trước khi đặt hàng.')
  for (const message of [
    'Vui lòng nhập họ và tên.',
    'Vui lòng nhập số điện thoại.',
    'Vui lòng nhập số nhà, tên đường.',
    'Vui lòng nhập phường/xã.',
    'Vui lòng chọn tỉnh/thành phố.',
  ]) {
    await expect(page.getByText(message)).toBeVisible()
  }
  await expect(page.getByLabel('Họ và tên')).toBeFocused()
  await expect(page.getByLabel(/Quận|Huyện|bưu/)).toHaveCount(0)
})

test('phone numbers start with 0 or +84 and have 9 more digits', async ({ page }) => {
  await seedCart(page, [{ productId: 'p08', packId: 'goi-100g', qty: 1 }])
  const phone = page.getByLabel('Số điện thoại')
  const rule = page.getByText('Số điện thoại gồm số 0 và 9 chữ số, hoặc +84 và 9 chữ số.')

  await phone.fill('12345')
  await placeOrder(page)
  await expect(rule).toBeVisible()

  await phone.fill('090 123 4567')
  await expect(rule).toBeHidden()
  await phone.fill('+84 90.123.4567')
  await expect(rule).toBeHidden()
})

test('choosing Khác asks for the province name', async ({ page }) => {
  await seedCart(page, [{ productId: 'p08', packId: 'goi-100g', qty: 1 }])
  await page.getByLabel('Họ và tên').fill('Trần Văn Minh')
  await page.getByLabel('Số điện thoại').fill('0901234567')
  await page.getByLabel('Số nhà, tên đường').fill('5 Trần Phú')
  await page.getByLabel('Phường/Xã').fill('Phường 1')
  await chooseProvince(page, 'Khác')
  await placeOrder(page)

  await expect(page.getByText('Vui lòng nhập tên tỉnh/thành phố.')).toBeVisible()
  await expect(page.getByLabel('Tên tỉnh/thành phố')).toBeFocused()
  await expect(page).toHaveURL(/\/checkout$/)
})

test('cash on delivery is the only way to pay, and the demo notice is shown', async ({ page }) => {
  await seedCart(page, [{ productId: 'p08', packId: 'goi-100g', qty: 1 }])
  const payment = page.getByRole('group', { name: 'Thanh toán' })
  await expect(payment).toContainText('Thanh toán khi nhận hàng (COD)')
  await expect(payment).toContainText('Đây là cửa hàng demo')
  await expect(page.getByRole('main').getByRole('radio')).toHaveCount(0)
})

test('an order that is not in this browser says it was not found', async ({ page }) => {
  await page.goto('/order/THY-000000')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Không tìm thấy đơn hàng')
})
