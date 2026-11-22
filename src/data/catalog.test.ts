import { describe, expect, it } from 'vitest'
import {
  categories,
  dealProducts,
  getCategoryBySlug,
  getProductBySlug,
  products,
  productsInCategory,
  similarProducts,
} from '@/data/catalog'

describe('catalog', () => {
  it('has the three categories and twelve subcategories from the spec', () => {
    expect(categories.map((c) => [c.name, c.subcategories.map((s) => s.name)])).toEqual([
      ['Đồ ăn vặt', ['Snack & khoai tây chiên', 'Bánh quy & bánh gạo', 'Hạt & trái cây sấy', 'Kẹo']],
      ['Nước uống', ['Nước suối', 'Nước có ga', 'Nước ép & sữa', 'Trà']],
      ['Nhu yếu phẩm', ['Giấy & khăn giấy', 'Vệ sinh nhà cửa', 'Chăm sóc cá nhân', 'Gạo & gia vị']],
    ])
  })

  it('puts every product in a subcategory of its own category', () => {
    for (const p of products) {
      const category = categories.find((c) => c.id === p.categoryId)
      expect(category?.subcategories.some((s) => s.id === p.subcategoryId), p.name).toBe(true)
    }
  })

  it('has 24 products with unique ids and slugs', () => {
    expect(products).toHaveLength(24)
    expect(new Set(products.map((p) => p.id)).size).toBe(24)
    expect(new Set(products.map((p) => p.slug)).size).toBe(24)
  })

  it('holds exactly the 24 products of the spec appendix, with their packs, prices, old prices and stock', () => {
    // One line per appendix row: name | subcategory | packs: price (old price) | stock.
    const appendix = [
      'Khoai tây chiên vị tảo biển | Snack & khoai tây chiên | Gói 52 g: 12.000 · Lốc 5 gói: 55.000 | in',
      'Snack rong biển sấy giòn | Snack & khoai tây chiên | Lốc 3 gói × 5 g: 25.000 | in',
      'Bánh quy bơ | Bánh quy & bánh gạo | Hộp 454 g: 89.000 | in',
      'Bánh gạo nướng vị ngọt | Bánh quy & bánh gạo | Gói 150 g: 28.000 | in',
      'Hạt điều rang muối | Hạt & trái cây sấy | Hũ 250 g: 115.000 (135.000) · Hũ 500 g: 220.000 | in',
      'Đậu phộng da cá | Hạt & trái cây sấy | Gói 200 g: 32.000 | in',
      'Mít sấy giòn | Hạt & trái cây sấy | Gói 100 g: 35.000 | in',
      'Kẹo dẻo trái cây | Kẹo | Gói 100 g: 18.000 | in',
      'Nước suối tinh khiết | Nước suối | Chai 500 ml: 5.000 · Lốc 6 chai: 28.000 · Thùng 24 chai: 99.000 (115.000) | in',
      'Nước khoáng thiên nhiên | Nước suối | Chai 1,5 L: 12.000 · Lốc 6 chai: 68.000 | in',
      'Nước khoáng có ga | Nước có ga | Lon 330 ml: 15.000 · Lốc 6 lon: 85.000 | in',
      'Soda chanh | Nước có ga | Lon 330 ml: 10.000 · Lốc 6 lon: 56.000 | in',
      'Nước ép cam | Nước ép & sữa | Chai 1 L: 45.000 | in',
      'Sữa đậu nành | Nước ép & sữa | Lốc 4 hộp × 200 ml: 22.000 | in',
      'Trà xanh không đường | Trà | Chai 450 ml: 10.000 · Thùng 24 chai: 220.000 | in',
      'Nước dừa đóng hộp | Nước ép & sữa | Hộp 330 ml: 18.000 | low',
      'Giấy vệ sinh 3 lớp | Giấy & khăn giấy | Lốc 10 cuộn: 79.000 | in',
      'Khăn giấy rút | Giấy & khăn giấy | Lốc 3 gói × 180 tờ: 45.000 | in',
      'Nước rửa chén hương chanh | Vệ sinh nhà cửa | Chai 750 g: 32.000 | in',
      'Nước giặt | Vệ sinh nhà cửa | Túi 3,6 kg: 185.000 (215.000) | in',
      'Kem đánh răng | Chăm sóc cá nhân | Tuýp 180 g: 38.000 | in',
      'Dầu gội | Chăm sóc cá nhân | Chai 650 ml: 129.000 | out',
      'Gạo ST25 | Gạo & gia vị | Túi 5 kg: 185.000 | in',
      'Nước mắm | Gạo & gia vị | Chai 500 ml: 55.000 | in',
    ]
    const dong = (n: number) => n.toLocaleString('vi-VN')
    const subcategoryName = new Map(categories.flatMap((c) => c.subcategories).map((s) => [s.id, s.name]))
    const rows = products.map((p) => {
      const packs = p.packs.map((k) => `${k.label}: ${dong(k.price)}${k.wasPrice ? ` (${dong(k.wasPrice)})` : ''}`)
      return [p.name, subcategoryName.get(p.subcategoryId), packs.join(' · '), p.stock].join(' | ')
    })
    expect(rows).toEqual(appendix)
  })

  it('gives every product at least one pack, each priced in whole đồng above 0', () => {
    for (const p of products) {
      expect(p.packs.length, p.name).toBeGreaterThan(0)
      for (const pack of p.packs) {
        expect(Number.isInteger(pack.price) && pack.price > 0, `${p.name} ${pack.label}`).toBe(true)
        expect(pack.amount, `${p.name} ${pack.label}`).toBeGreaterThan(0)
      }
    }
  })

  it('lists exactly the products with a pack on a deal', () => {
    expect(dealProducts.map((p) => p.name)).toEqual(['Hạt điều rang muối', 'Nước suối tinh khiết', 'Nước giặt'])
  })

  it('marks coconut water low on stock and shampoo out of stock', () => {
    expect(products.filter((p) => p.stock !== 'in').map((p) => [p.name, p.stock])).toEqual([
      ['Nước dừa đóng hộp', 'low'],
      ['Dầu gội', 'out'],
    ])
  })

  it('finds a category by its slug and lists its products', () => {
    const drinks = getCategoryBySlug('nuoc-uong')
    expect(drinks?.name).toBe('Nước uống')
    expect(productsInCategory('drinks')).toHaveLength(8)
    expect(getCategoryBySlug('ca-phe')).toBeUndefined()
  })

  it('lists similar products from the same subcategory first, then the same category', () => {
    const water = getProductBySlug('nuoc-suoi-tinh-khiet')!
    const similar = similarProducts(water)
    expect(similar[0].name).toBe('Nước khoáng thiên nhiên')
    expect(similar).toHaveLength(7)
    expect(similar.every((p) => p.categoryId === 'drinks' && p.id !== water.id)).toBe(true)
  })
})
