import { categories, type Product } from '@/data/catalog'
import { cn } from '@/lib/utils'

/** The product's photo, or until it has one, a square in its category's color with its subcategory's icon. */
export function ProductImage({ product, packLabel }: { product: Product; packLabel: string }) {
  if (product.image) {
    return <img src={product.image} alt={product.name} className="aspect-square w-full rounded-lg object-cover" />
  }
  const category = categories.find((c) => c.id === product.categoryId)
  const Icon = category?.subcategories.find((s) => s.id === product.subcategoryId)?.icon
  // The name is always written next to the image, so the placeholder adds nothing for screen readers.
  return (
    <div aria-hidden="true" className={cn('relative grid aspect-square w-full place-items-center rounded-lg', category?.tint)}>
      {Icon && <Icon className={cn('size-1/3', category?.iconColor)} strokeWidth={1.5} />}
      <span className="absolute inset-x-2 bottom-2 truncate text-center text-sm text-ink-soft">{packLabel}</span>
    </div>
  )
}
