import { expect, test } from '@playwright/test'

test('a shopper can order a coffee from its product page', async ({ page }) => {
  await page.goto('/product/kenya-nyeri')
  await page.getByRole('button', { name: 'Add to cart' }).click()
  await page.getByRole('link', { name: 'Check out' }).click()
  await expect(page).toHaveURL(/\/checkout$/)

  await page.getByLabel('Email').fill('shopper@example.com')
  await page.getByLabel('Full name').fill('Test Shopper')
  await page.getByLabel('Street address').fill('1 Main St')
  await page.getByLabel('City').fill('Portland')
  await page.getByLabel('State or region').fill('OR')
  await page.getByLabel('Postal code').fill('97201')
  await page.getByRole('button', { name: /Place order/ }).click()

  await expect(page).toHaveURL(/\/order\/SC-\d{6}$/)
  await expect(page.getByRole('main')).toContainText('Nyeri Peaberry')
  await expect(page.getByRole('button', { name: 'Open cart, 0 items' })).toBeVisible()
})
