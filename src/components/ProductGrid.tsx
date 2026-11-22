import { ProductTile } from '@/components/ProductTile'
import type { Product } from '@/data/catalog'

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((p) => (
        <li key={p.id} className="grid">
          <ProductTile product={p} />
        </li>
      ))}
    </ul>
  )
}
