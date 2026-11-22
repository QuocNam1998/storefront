import { describe, expect, it } from 'vitest'
import { amountToFreeDelivery, deliveryFee, discountPercent, formatPrice, formatUnitPrice, unitPrice } from '@/lib/store'

// Prices put a non-breaking space before ₫.
const nbsp = ' '

describe('formatPrice', () => {
  it('shows whole đồng with a dot between thousands', () => {
    expect(formatPrice(12000)).toBe(`12.000${nbsp}₫`)
    expect(formatPrice(185000)).toBe(`185.000${nbsp}₫`)
  })
})

describe('deliveryFee', () => {
  it('charges 20.000 ₫ below 300.000 ₫', () => {
    expect(deliveryFee(299999)).toBe(20000)
  })

  it('is free from 300.000 ₫', () => {
    expect(deliveryFee(300000)).toBe(0)
  })
})

describe('amountToFreeDelivery', () => {
  it('gives what is left to reach 300.000 ₫', () => {
    expect(amountToFreeDelivery(255000)).toBe(45000)
  })

  it('is 0 once the threshold is reached or passed', () => {
    expect(amountToFreeDelivery(300000)).toBe(0)
    expect(amountToFreeDelivery(410000)).toBe(0)
  })
})

describe('unitPrice', () => {
  it('gives the price per litre for a 6 × 500 ml pack at 28.000 ₫', () => {
    expect(unitPrice({ price: 28000, amount: 3000, unit: 'ml' })).toBe(9333)
  })

  it('gives the price per 100 g for a 52 g pack at 12.000 ₫', () => {
    expect(unitPrice({ price: 12000, amount: 52, unit: 'g' })).toBe(23077)
  })

  it('gives the price per item for a 10-roll pack at 79.000 ₫', () => {
    expect(unitPrice({ price: 79000, amount: 10, unit: 'item' })).toBe(7900)
  })
})

describe('formatUnitPrice', () => {
  it('shows the three units from the spec', () => {
    const pack = { id: 'x', label: 'x', price: 0, amount: 0 }
    expect(formatUnitPrice({ ...pack, price: 28000, amount: 3000, unit: 'ml' })).toBe(`9.333${nbsp}₫/L`)
    expect(formatUnitPrice({ ...pack, price: 12000, amount: 52, unit: 'g' })).toBe(`23.077${nbsp}₫/100 g`)
    expect(formatUnitPrice({ ...pack, price: 79000, amount: 10, unit: 'item', itemLabel: 'cuộn' })).toBe(
      `7.900${nbsp}₫/cuộn`,
    )
  })
})

describe('discountPercent', () => {
  it('rounds 115.000 ₫ down from 135.000 ₫ to 15%', () => {
    expect(discountPercent({ price: 115000, wasPrice: 135000 })).toBe(15)
  })

  it('is 0 for a pack with no old price', () => {
    expect(discountPercent({ price: 115000 })).toBe(0)
  })
})
