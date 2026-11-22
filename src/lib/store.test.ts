import { describe, expect, it } from 'vitest'
import { nextRoastDate, shippingCost } from '@/lib/store'

describe('shippingCost', () => {
  it('charges $5.00 for standard shipping below $40.00', () => {
    expect(shippingCost('standard', 3999)).toBe(500)
  })

  it('makes standard shipping free from $40.00', () => {
    expect(shippingCost('standard', 4000)).toBe(0)
  })

  it('charges $12.00 for express shipping at any subtotal', () => {
    expect(shippingCost('express', 3999)).toBe(1200)
    expect(shippingCost('express', 4000)).toBe(1200)
  })
})

// Monday is left out on purpose: what an order placed on a roast day should get is still undecided.
describe('nextRoastDate', () => {
  it('gives the following Monday on a Tuesday', () => {
    expect(nextRoastDate(new Date(2026, 10, 24, 9, 0))).toEqual(new Date(2026, 10, 30))
  })

  it('gives the next day on a Sunday', () => {
    expect(nextRoastDate(new Date(2026, 10, 29, 23, 30))).toEqual(new Date(2026, 10, 30))
  })
})
