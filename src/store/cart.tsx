import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProductById, type Grind, type Product, type SizeOption } from '@/data/products'

const STORAGE_KEY = 'second-crack.cart'

export interface CartItem {
  key: string
  productId: string
  sizeId: string
  grind?: Grind
  qty: number
}

export interface CartLine extends CartItem {
  product: Product
  size: SizeOption
  lineTotal: number
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  add: (item: Omit<CartItem, 'key'>) => void
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export const MAX_QTY = 20

function itemKey(productId: string, sizeId: string, grind?: string) {
  return [productId, sizeId, grind ?? ''].join('|')
}

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    // Drop anything that no longer matches the catalog.
    return parsed.filter((i) => {
      const p = getProductById(i.productId)
      return p && p.sizes.some((s) => s.id === i.sizeId) && i.qty > 0
    })
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load)
  const [isOpen, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Storage can be unavailable (private mode); the cart still works for this visit.
    }
  }, [items])

  const add = useCallback((item: Omit<CartItem, 'key'>) => {
    const key = itemKey(item.productId, item.sizeId, item.grind)
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, i.qty + item.qty) } : i))
      }
      return [...prev, { ...item, key, qty: Math.min(MAX_QTY, item.qty) }]
    })
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.key !== key) : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, qty) } : i)),
    )
  }, [])

  const remove = useCallback((key: string) => setItems((prev) => prev.filter((i) => i.key !== key)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLine[] = items.flatMap((i) => {
      const product = getProductById(i.productId)
      const size = product?.sizes.find((s) => s.id === i.sizeId)
      if (!product || !size) return []
      return [{ ...i, product, size, lineTotal: size.price * i.qty }]
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      isOpen,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    }
  }, [items, isOpen, add, setQty, remove, clear])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
