'use client'

import { ShoppingBasket } from 'lucide-react'
import Link from 'next/link'
import { ProductGrid } from '@/components/ProductGrid'
import { CategoryIconRow } from '@/components/SiteChrome'
import { Button } from '@/components/ui/button'
import { products } from '@/data/catalog'
import { DELIVERY_PROMISE, FREE_DELIVERY_RULE } from '@/lib/store'

export function Home() {
  return (
    <>
      <section aria-labelledby="home-title" className="mb-8 flex items-center gap-6 rounded-3xl bg-sea p-6 text-surface sm:p-8">
        <div className="flex-1">
          <h1 id="home-title" className="text-2xl font-bold sm:text-3xl">
            {DELIVERY_PROMISE}
          </h1>
          <p className="mt-2 sm:text-lg">{FREE_DELIVERY_RULE}.</p>
          <Button asChild size="lg" className="mt-5 h-11 rounded-full bg-apricot px-5 font-semibold text-ink hover:bg-apricot/85">
            <Link href="/deals">Xem ưu đãi</Link>
          </Button>
        </div>
        <ShoppingBasket aria-hidden="true" className="hidden size-24 shrink-0 text-apricot md:block" strokeWidth={1.5} />
      </section>

      <CategoryIconRow />

      <section aria-labelledby="all-products">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="all-products" className="text-2xl font-semibold">
            Tất cả sản phẩm
          </h2>
          <p className="text-sm text-ink-soft">{products.length} sản phẩm</p>
        </div>
        <ProductGrid products={products} />
      </section>
    </>
  )
}
