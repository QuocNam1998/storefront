import type { Pack, Unit } from '@/data/catalog'

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })

/** Whole đồng, for example 12.000 ₫. */
export function formatPrice(dong: number): string {
  return money.format(dong)
}

export const DELIVERY_PROMISE = 'Giao hàng trong 2 giờ'
export const DELIVERY_FEE = 20000
export const FREE_DELIVERY_THRESHOLD = 300000
export const FREE_DELIVERY_RULE = `Miễn phí giao hàng cho đơn từ ${formatPrice(FREE_DELIVERY_THRESHOLD)}`

export function deliveryFee(subtotal: number): number {
  return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE
}

export function amountToFreeDelivery(subtotal: number): number {
  return Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal)
}

const UNIT_PRICE_BASE: Record<Unit, number> = { g: 100, ml: 1000, item: 1 }

/** Price per 100 g, per litre or per item, in whole đồng. */
export function unitPrice(pack: Pick<Pack, 'price' | 'amount' | 'unit'>): number {
  return Math.round((pack.price / pack.amount) * UNIT_PRICE_BASE[pack.unit])
}

/** For example 23.077 ₫/100 g, 9.333 ₫/L or 7.900 ₫/cuộn. */
export function formatUnitPrice(pack: Pack): string {
  const per = { g: '100 g', ml: 'L', item: pack.itemLabel ?? 'cái' }[pack.unit]
  return `${formatPrice(unitPrice(pack))}/${per}`
}

/** How much a deal takes off its old price, as a whole percent. 0 when the pack isn't on a deal. */
export function discountPercent(pack: Pick<Pack, 'price' | 'wasPrice'>): number {
  if (!pack.wasPrice) return 0
  return Math.round(((pack.wasPrice - pack.price) / pack.wasPrice) * 100)
}
