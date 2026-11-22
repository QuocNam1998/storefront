import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FreeDeliveryProgress } from '@/components/FreeDeliveryProgress'

describe('FreeDeliveryProgress', () => {
  it('says how much more to spend for free delivery', () => {
    render(<FreeDeliveryProgress subtotal={255000} />)
    expect(screen.getByText('Mua thêm 45.000 ₫ để được miễn phí giao hàng')).toBeTruthy()
    expect(screen.getByRole('progressbar', { name: 'Tiến tới miễn phí giao hàng' }).getAttribute('aria-valuenow')).toBe('85')
  })

  it('says delivery is free once the threshold is reached', () => {
    render(<FreeDeliveryProgress subtotal={300000} />)
    expect(screen.getByText('Đơn hàng được miễn phí giao hàng')).toBeTruthy()
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100')
  })
})
