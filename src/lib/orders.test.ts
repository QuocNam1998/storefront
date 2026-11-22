import { describe, expect, it } from 'vitest'
import { getOrder, newOrderId, saveOrder, type Order } from '@/lib/orders'

const order: Order = {
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

describe('orders', () => {
  it('gives ids of THY- and 6 digits', () => {
    for (let i = 0; i < 50; i++) expect(newOrderId()).toMatch(/^THY-\d{6}$/)
  })

  it('reads back a saved order by its id', () => {
    saveOrder(order)
    expect(getOrder('THY-123456')).toEqual(order)
    expect(Object.keys(JSON.parse(localStorage.getItem('thy-store.orders') ?? '{}'))).toEqual(['THY-123456'])
  })

  it('has nothing for an unknown id', () => {
    saveOrder(order)
    expect(getOrder('THY-000000')).toBeUndefined()
  })
})
