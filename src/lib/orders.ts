import type { ShippingMethodId } from '@/lib/store'

const STORAGE_KEY = 'second-crack.orders'

export interface OrderLine {
  name: string
  slug: string
  detail: string
  qty: number
  lineTotal: number
}

export interface Order {
  id: string
  createdAt: string
  roastDate: string
  email: string
  shipTo: { name: string; address: string; city: string; region: string; postalCode: string; country: string }
  shippingMethod: ShippingMethodId
  lines: OrderLine[]
  subtotal: number
  shipping: number
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
  return `SC-${Math.floor(100000 + Math.random() * 900000)}`
}
