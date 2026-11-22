import { describe, expect, it } from 'vitest'
import { searchProducts } from '@/lib/search'

const names = (query: string) => searchProducts(query).map((p) => p.name)

describe('searchProducts', () => {
  it('ignores accents', () => {
    expect(names('nuoc suoi')).toContain('Nước suối tinh khiết')
  })

  it('ignores letter case and finds đ from d', () => {
    expect(names('GIAY')).toContain('Giấy vệ sinh 3 lớp')
    expect(names('dau phong')).toContain('Đậu phộng da cá')
  })

  it('finds every product whose name contains the word', () => {
    expect(names('banh')).toEqual(expect.arrayContaining(['Bánh quy bơ', 'Bánh gạo nướng vị ngọt']))
  })

  it('matches subcategory names', () => {
    expect(names('nuoc suoi')).toContain('Nước khoáng thiên nhiên')
  })

  it('lists name matches before description matches', () => {
    const results = names('gion')
    expect(results.slice(0, 2)).toEqual(['Snack rong biển sấy giòn', 'Mít sấy giòn'])
    expect(results).toContain('Khoai tây chiên vị tảo biển')
  })

  it('finds nothing for an unknown word or an empty query', () => {
    expect(names('xyz123')).toEqual([])
    expect(names('   ')).toEqual([])
  })
})
