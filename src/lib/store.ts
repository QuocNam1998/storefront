const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatPrice(cents: number): string {
  return money.format(cents / 100)
}

/** We roast every Monday. Orders placed by Sunday night go in that roast. */
export function nextRoastDate(from = new Date()): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const daysUntilMonday = (8 - d.getDay()) % 7
  d.setDate(d.getDate() + daysUntilMonday)
  return d
}

export function formatDay(d: Date): string {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export const FREE_SHIPPING_THRESHOLD = 4000

export const SHIPPING_METHODS = [
  { id: 'standard', label: 'Standard', detail: '3–5 business days after roasting', price: 500 },
  { id: 'express', label: 'Express', detail: '1–2 business days after roasting', price: 1200 },
] as const

export type ShippingMethodId = (typeof SHIPPING_METHODS)[number]['id']

export function shippingCost(method: ShippingMethodId, subtotal: number): number {
  if (method === 'standard' && subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  return SHIPPING_METHODS.find((m) => m.id === method)!.price
}
