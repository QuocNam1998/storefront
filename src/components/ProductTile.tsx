import { Link } from 'react-router-dom'
import { ProductArt } from '@/components/ProductArt'
import type { Product } from '@/data/products'
import { formatPrice } from '@/lib/store'

/** No card chrome: the bag is the object, the text sits beneath it like a shelf tag. */
export function ProductTile({ product }: { product: Product }) {
  const from = product.sizes[0].price
  return (
    <Link to={`/product/${product.slug}`} className="group block rounded-md focus-visible:outline-offset-4">
      <ProductArt product={product} className="transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0" />
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <h3 className="font-semibold group-hover:underline">{product.name}</h3>
        <span className="tabular-nums">
          {product.kind === 'coffee' && <span className="sr-only">From </span>}
          {formatPrice(from)}
        </span>
      </div>
      <p className="mt-0.5 text-sm text-muted-foreground">
        {product.kind === 'coffee' ? product.notes.join(', ') : product.summary}
      </p>
    </Link>
  )
}
