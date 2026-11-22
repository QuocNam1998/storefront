import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { CartProvider, useCart } from '@/store/cart'

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>
const renderCart = () => renderHook(() => useCart(), { wrapper })

const bottle = { productId: 'p09', packId: 'chai-500ml' } as const

describe('cart', () => {
  it('adds the same product and pack to one line', () => {
    const { result } = renderCart()
    act(() => result.current.add({ ...bottle, qty: 1 }))
    act(() => result.current.add({ ...bottle, qty: 2 }))
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.lines[0].qty).toBe(3)
  })

  it('keeps a different pack of the same product on its own line', () => {
    const { result } = renderCart()
    act(() => result.current.add({ ...bottle, qty: 1 }))
    act(() => result.current.add({ ...bottle, packId: 'loc-6-chai', qty: 1 }))
    expect(result.current.lines.map((l) => l.pack.label)).toEqual(['Chai 500 ml', 'Lốc 6 chai'])
  })

  it('never lets a line go above 99', () => {
    const { result } = renderCart()
    act(() => result.current.add({ ...bottle, qty: 98 }))
    act(() => result.current.add({ ...bottle, qty: 5 }))
    expect(result.current.lines[0].qty).toBe(99)
  })

  it('gives the quantity of a product and pack, or 0 when it is not in the cart', () => {
    const { result } = renderCart()
    act(() => result.current.add({ ...bottle, qty: 4 }))
    expect(result.current.getQty('p09', 'chai-500ml')).toBe(4)
    expect(result.current.getQty('p09', 'loc-6-chai')).toBe(0)
  })

  it('is still there after the page reloads', () => {
    const first = renderCart()
    act(() => first.result.current.add({ ...bottle, qty: 2 }))
    first.unmount()

    const { result } = renderCart()
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.lines[0]).toMatchObject({ productId: 'p09', packId: 'chai-500ml', qty: 2 })
  })

  it('drops saved items that are no longer in the catalog', () => {
    localStorage.setItem(
      'thy-store.cart',
      JSON.stringify([
        { key: 'p09|chai-500ml', productId: 'p09', packId: 'chai-500ml', qty: 1 },
        { key: 'retired|goi', productId: 'retired', packId: 'goi', qty: 1 },
        { key: 'p09|thung-50', productId: 'p09', packId: 'thung-50', qty: 1 },
      ]),
    )
    const { result } = renderCart()
    expect(result.current.lines.map((l) => l.key)).toEqual(['p09|chai-500ml'])
    const saved = JSON.parse(localStorage.getItem('thy-store.cart') ?? '[]') as { key: string }[]
    expect(saved.map((i) => i.key)).toEqual(['p09|chai-500ml'])
  })

  it('ignores a cart saved by the old coffee store', () => {
    localStorage.setItem(
      'second-crack.cart',
      JSON.stringify([{ key: 'c-guji|250g|', productId: 'c-guji', sizeId: '250g', qty: 1 }]),
    )
    const { result } = renderCart()
    expect(result.current.lines).toEqual([])
  })
})

// These two run in order: the second proves the first one's saved data didn't carry over.
describe('test isolation', () => {
  it('can save data in the browser', () => {
    localStorage.setItem('leftover', 'from the previous test')
    expect(localStorage.length).toBe(1)
  })

  it('starts the next test with nothing saved', () => {
    expect(localStorage.length).toBe(0)
  })
})
