import { Link } from 'react-router-dom'
import { ProductTile } from '@/components/ProductTile'
import { categories, dealProducts, productsInCategory, type Product } from '@/data/catalog'
import { DELIVERY_PROMISE, FREE_DELIVERY_RULE } from '@/lib/store'
import { cn } from '@/lib/utils'

function ProductRow({ title, to, products, tint }: { title: string; to: string; products: Product[]; tint?: string }) {
  return (
    <section aria-label={title} className={cn('mt-12 rounded-lg', tint && `${tint} p-4 sm:p-6`)}>
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <Link to={to} className="shrink-0 rounded-md font-medium text-sea-deep underline underline-offset-4" aria-label={`Xem tất cả ${title}`}>
          Xem tất cả
        </Link>
      </div>
      {/* One row that scrolls sideways inside itself, so the page never does. */}
      <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
        {products.map((p) => (
          <li key={p.id} className="grid w-40 shrink-0 sm:w-48">
            <ProductTile product={p} />
          </li>
        ))}
      </ul>
    </section>
  )
}

export function Home() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">{DELIVERY_PROMISE}</h1>
      <p className="mt-2 text-lg text-ink-soft">{FREE_DELIVERY_RULE}.</p>

      <section aria-label="Danh mục sản phẩm" className="mt-8">
        <ul className="grid gap-3 sm:grid-cols-3">
          {categories.map((c) => {
            const Icon = c.subcategories[0].icon
            return (
              <li key={c.id}>
                <Link to={`/c/${c.slug}`} className={cn('flex items-center gap-4 rounded-lg p-4 hover:underline', c.tint)}>
                  <Icon className={cn('size-10 shrink-0', c.iconColor)} strokeWidth={1.5} aria-hidden="true" />
                  <span>
                    <span className="block text-xl font-semibold">{c.name}</span>
                    <span className="block text-sm text-ink-soft">{c.subcategories.map((s) => s.name).join(' · ')}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <ProductRow title="Ưu đãi tuần này" to="/deals" products={dealProducts} />
      {categories.map((c) => (
        <ProductRow key={c.id} title={c.name} to={`/c/${c.slug}`} products={productsInCategory(c.id)} tint={c.tint} />
      ))}
    </div>
  )
}
