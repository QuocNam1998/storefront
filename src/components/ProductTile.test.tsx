import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { ProductTile } from '@/components/ProductTile'
import { getProductBySlug } from '@/data/catalog'
import { CartProvider, useCart } from '@/store/cart'

function CartCount() {
  return <output aria-label="Số món trong giỏ">{useCart().count}</output>
}

function renderTile(slug: string) {
  return render(
    <MemoryRouter>
      <CartProvider>
        <ProductTile product={getProductBySlug(slug)!} />
        <CartCount />
      </CartProvider>
    </MemoryRouter>,
  )
}

const count = () => screen.getByRole('status', { name: 'Số món trong giỏ' }).textContent

describe('ProductTile', () => {
  it('shows the first pack with its price and unit price', () => {
    renderTile('nuoc-suoi-tinh-khiet')
    expect(screen.getByRole('heading', { name: 'Nước suối tinh khiết' })).toBeTruthy()
    expect(screen.getByText('Chai 500 ml', { selector: 'p' })).toBeTruthy()
    expect(screen.getByText('5.000 ₫')).toBeTruthy()
    expect(screen.getByText('10.000 ₫/L')).toBeTruthy()
  })

  it('shows a deal as a discount badge and the old price struck through', () => {
    const { container } = renderTile('hat-dieu-rang-muoi')
    expect(screen.getByText('-15%')).toBeTruthy()
    expect(screen.getByText('115.000 ₫')).toBeTruthy()
    expect(container.querySelector('s')?.textContent).toMatch(/135\.000\s₫$/)
  })

  it('has no badge or old price when the first pack is not on a deal', () => {
    const { container } = renderTile('banh-quy-bo')
    expect(screen.queryByText(/^-\d+%$/)).toBeNull()
    expect(container.querySelector('s')).toBeNull()
  })

  it('says when a product is low on stock and still lets it be added', () => {
    renderTile('nuoc-dua-dong-hop')
    expect(screen.getByText('Sắp hết hàng')).toBeTruthy()
    expect(screen.getByRole('button', { name: /^Thêm/ })).toHaveProperty('disabled', false)
  })

  it('has no enabled add control when a product is out of stock', () => {
    renderTile('dau-goi')
    expect(screen.getByText('Hết hàng')).toBeTruthy()
    expect(screen.getAllByRole('button').every((b) => (b as HTMLButtonElement).disabled)).toBe(true)
  })

  it('turns Thêm into a quantity control, and back again at 0', () => {
    renderTile('banh-quy-bo')
    fireEvent.click(screen.getByRole('button', { name: /^Thêm/ }))
    expect(count()).toBe('1')
    const stepper = screen.getByRole('group', { name: 'Số lượng Bánh quy bơ' })
    expect(stepper.textContent).toBe('1')
    expect(stepper.contains(document.activeElement)).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: 'Tăng số lượng' }))
    fireEvent.click(screen.getByRole('button', { name: 'Tăng số lượng' }))
    expect(stepper.textContent).toBe('3')

    for (let i = 0; i < 3; i++) fireEvent.click(screen.getByRole('button', { name: 'Giảm số lượng' }))
    expect(count()).toBe('0')
    expect(screen.queryByRole('group')).toBeNull()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /^Thêm/ }))
  })
})
