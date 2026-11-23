import type { Page } from '@playwright/test'

export const ORDER = {
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

export const PAGES = [
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
export async function seed(page: Page) {
  await page.addInitScript((order) => {
    localStorage.setItem('thy-store.cart', JSON.stringify([{ key: 'p05|hu-250g', productId: 'p05', packId: 'hu-250g', qty: 1 }]))
    localStorage.setItem('thy-store.orders', JSON.stringify({ [order.id]: order }))
  }, ORDER)
}
