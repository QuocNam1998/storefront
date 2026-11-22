import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProductImage } from '@/components/ProductImage'
import { getProductBySlug } from '@/data/catalog'

const chips = getProductBySlug('khoai-tay-chien-vi-tao-bien')!

describe('ProductImage', () => {
  it('shows a square in the category color with the subcategory icon until there is a photo', () => {
    const { container } = render(<ProductImage product={chips} packLabel="Gói 52 g" />)
    const placeholder = container.firstElementChild
    expect(placeholder).toHaveProperty('className', expect.stringContaining('bg-tint-snacks'))
    expect(placeholder?.querySelector('svg.lucide-popcorn')).not.toBeNull()
    expect(placeholder?.textContent).toBe('Gói 52 g')
    expect(screen.queryByRole('img')).toBeNull()
  })

  it('shows the photo instead, named after the product, once one is set', () => {
    render(<ProductImage product={{ ...chips, image: '/photos/khoai-tay.jpg' }} packLabel="Gói 52 g" />)
    const photo = screen.getByRole('img', { name: 'Khoai tây chiên vị tảo biển' })
    expect(photo.getAttribute('src')).toBe('/photos/khoai-tay.jpg')
  })
})
