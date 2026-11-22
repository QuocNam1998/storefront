// A new key, so orders saved by the old coffee store are never read.
const STORAGE_KEY = 'thy-store.orders'

export interface OrderLine {
  name: string
  slug: string
  packLabel: string
  qty: number
  lineTotal: number
}

export interface Order {
  id: string
  createdAt: string
  name: string
  phone: string
  email?: string
  street: string
  ward: string
  province: string
  note?: string
  payment: 'cod'
  lines: OrderLine[]
  subtotal: number
  delivery: number
  total: number
}

function readAll(): Record<string, Order> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, Order>
  } catch {
    return {}
  }
}

export function saveOrder(order: Order) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readAll(), [order.id]: order }))
  } catch {
    // Without storage the confirmation page can't reload the order, but checkout still completes.
  }
}

export function getOrder(id: string): Order | undefined {
  return readAll()[id]
}

export function newOrderId(): string {
  return `THY-${Math.floor(100000 + Math.random() * 900000)}`
}
