import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getProductById, type Pack, type Product } from '@/data/catalog'

// A new key, so a cart saved by the old coffee store is never read.
const STORAGE_KEY = 'thy-store.cart'

export interface CartItem {
  key: string
  productId: string
  packId: string
  qty: number
}

export interface CartLine extends CartItem {
  product: Product
  pack: Pack
  lineTotal: number
}

interface CartContextValue {
  lines: CartLine[]
  count: number
  subtotal: number
  isOpen: boolean
  setOpen: (open: boolean) => void
  add: (item: Omit<CartItem, 'key'>) => void
  getQty: (productId: string, packId: string) => number
  setQty: (key: string, qty: number) => void
  remove: (key: string) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export const MAX_QTY = 99

export function itemKey(productId: string, packId: string) {
  return `${productId}|${packId}`
}

function findPack(productId: string, packId: string) {
  const product = getProductById(productId)
  const pack = product?.packs.find((p) => p.id === packId)
  return product && pack ? { product, pack } : undefined
}

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as CartItem[]
    // Drop anything that no longer matches the catalog.
    return parsed.filter((i) => findPack(i.productId, i.packId) && i.qty > 0)
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
    const key = itemKey(item.productId, item.packId)
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
      const found = findPack(i.productId, i.packId)
      if (!found) return []
      return [{ ...i, ...found, lineTotal: found.pack.price * i.qty }]
    })
    return {
      lines,
      count: lines.reduce((n, l) => n + l.qty, 0),
      subtotal: lines.reduce((n, l) => n + l.lineTotal, 0),
      isOpen,
      setOpen,
      add,
      getQty: (productId, packId) => items.find((i) => i.key === itemKey(productId, packId))?.qty ?? 0,
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
