import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DealBadge, OldPrice } from '@/components/DealMarks'
import { ProductGrid } from '@/components/ProductGrid'
import { ProductImage } from '@/components/ProductImage'
import { QuantityStepper } from '@/components/QuantityStepper'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { categories, getProductBySlug, similarProducts, STOCK_TEXT, type Product } from '@/data/catalog'
import { DELIVERY_PROMISE, formatPrice, formatUnitPrice } from '@/lib/store'
import { NotFound } from '@/pages/NotFound'
import { useCart } from '@/store/cart'

function ProductDetail({ product }: { product: Product }) {
  const { add, setOpen } = useCart()
  const [packId, setPackId] = useState(product.packs[0].id)
  const [qty, setQty] = useState(1)
  const pack = product.packs.find((p) => p.id === packId) ?? product.packs[0]
  const category = categories.find((c) => c.id === product.categoryId)
  const inStock = product.stock !== 'out'

  const addToCart = () => {
    add({ productId: product.id, packId: pack.id, qty })
    setOpen(true)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="relative max-w-md">
        <ProductImage product={product} packLabel={pack.label} />
        <DealBadge pack={pack} />
      </div>
      <div>
        {category && (
          <Link to={`/c/${category.slug}`} className="rounded-md text-sm font-medium text-sea-deep underline underline-offset-4">
            {category.name}
          </Link>
        )}
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{product.name}</h1>

        {product.packs.length > 1 && (
          <ToggleGroup
            type="single"
            value={pack.id}
            onValueChange={(v) => v && setPackId(v)}
            aria-label="Quy cách"
            variant="outline"
            spacing={2}
            className="mt-6 flex-wrap justify-start"
          >
            {product.packs.map((p) => (
              <ToggleGroupItem
                key={p.id}
                value={p.id}
                className="h-auto flex-col items-start bg-surface px-3 py-2 data-[state=on]:border-sea data-[state=on]:text-sea-deep"
              >
                <span className="font-medium">{p.label}</span>
                <span className="text-sm tabular-nums">{formatPrice(p.price)}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}

        <div className="mt-6">
          <p className="text-ink-soft">{pack.label}</p>
          <p className="flex flex-wrap items-baseline gap-x-3">
            <span className="text-2xl font-semibold tabular-nums">{formatPrice(pack.price)}</span>
            <OldPrice pack={pack} />
          </p>
          <p className="text-sm text-ink-soft tabular-nums">{formatUnitPrice(pack)}</p>
          {STOCK_TEXT[product.stock] && <p className="mt-2 font-medium text-ink-soft">{STOCK_TEXT[product.stock]}</p>}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          {inStock && <QuantityStepper value={qty} onChange={setQty} label="Số lượng" size="lg" />}
          <Button size="xl" disabled={!inStock} onClick={addToCart}>
            Thêm vào giỏ
          </Button>
        </div>
        <p className="mt-3 text-sm text-ink-soft">{DELIVERY_PROMISE}.</p>

        <h2 className="mt-8 text-lg font-semibold">Mô tả</h2>
        <p className="mt-2 max-w-prose">{product.description}</p>
      </div>
    </div>
  )
}

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)
  if (!product) return <NotFound />

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <ProductDetail key={product.id} product={product} />
      <section aria-label="Sản phẩm tương tự" className="mt-16">
        <h2 className="text-2xl font-semibold">Sản phẩm tương tự</h2>
        <ProductGrid products={similarProducts(product).slice(0, 5)} />
      </section>
    </div>
  )
}
