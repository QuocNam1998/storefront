import { act, renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { CartProvider, useCart } from '@/store/cart'

const wrapper = ({ children }: { children: ReactNode }) => <CartProvider>{children}</CartProvider>
const renderCart = () => renderHook(() => useCart(), { wrapper })

const guji = { productId: 'c-guji', sizeId: '250g', grind: 'Whole bean' } as const

describe('cart', () => {
  it('adds the same coffee, size and grind to one line', () => {
    const { result } = renderCart()
    act(() => result.current.add({ ...guji, qty: 1 }))
    act(() => result.current.add({ ...guji, qty: 2 }))
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.lines[0].qty).toBe(3)
  })

  it('keeps a different grind or size on its own line', () => {
    const { result } = renderCart()
    act(() => result.current.add({ ...guji, qty: 1 }))
    act(() => result.current.add({ ...guji, grind: 'Espresso', qty: 1 }))
    act(() => result.current.add({ ...guji, sizeId: '1kg', qty: 1 }))
    expect(result.current.lines).toHaveLength(3)
  })

  it('never lets a line go above 20', () => {
    const { result } = renderCart()
    act(() => result.current.add({ ...guji, qty: 19 }))
    act(() => result.current.add({ ...guji, qty: 5 }))
    expect(result.current.lines[0].qty).toBe(20)
  })

  it('is still there after the page reloads', () => {
    const first = renderCart()
    act(() => first.result.current.add({ ...guji, qty: 2 }))
    first.unmount()

    const { result } = renderCart()
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.lines[0]).toMatchObject({ productId: 'c-guji', qty: 2 })
  })

  it('drops saved items that are no longer in the catalog', () => {
    localStorage.setItem(
      'second-crack.cart',
      JSON.stringify([
        { key: 'c-guji|250g|', productId: 'c-guji', sizeId: '250g', qty: 1 },
        { key: 'retired|250g|', productId: 'retired-coffee', sizeId: '250g', qty: 1 },
      ]),
    )
    const { result } = renderCart()
    expect(result.current.lines.map((l) => l.productId)).toEqual(['c-guji'])
    const saved = JSON.parse(localStorage.getItem('second-crack.cart') ?? '[]') as { productId: string }[]
    expect(saved.map((i) => i.productId)).toEqual(['c-guji'])
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
