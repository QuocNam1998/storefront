import { Plus } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { DealBadge, OldPrice } from '@/components/DealMarks'
import { ProductImage } from '@/components/ProductImage'
import { QuantityStepper } from '@/components/QuantityStepper'
import { Button } from '@/components/ui/button'
import { STOCK_TEXT, type Product } from '@/data/catalog'
import { formatPrice, formatUnitPrice } from '@/lib/store'
import { itemKey, useCart } from '@/store/cart'

/** Shows the product's first pack, and adds it straight from the tile. */
export function ProductTile({ product }: { product: Product }) {
  const { add, getQty, setQty } = useCart()
  const pack = product.packs[0]
  const qty = getQty(product.id, pack.id)
  const inStock = product.stock !== 'out'
  const showStepper = inStock && qty > 0
  const controlRef = useRef<HTMLDivElement>(null)
  const refocus = useRef(false)

  // Pressing Thêm, or taking the quantity to 0, swaps the button the shopper just pressed for another.
  // Move focus to the new control, or a keyboard shopper is sent back to the top of the page.
  useEffect(() => {
    if (!refocus.current) return
    refocus.current = false
    controlRef.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus()
  }, [showStepper])

  return (
    // Keeps the hidden "old price" label inside the tile, or a sideways row of tiles makes the whole page scroll on phones.
    <article className="relative flex flex-col rounded-lg bg-surface p-3">
      <Link to={`/p/${product.slug}`} className="group block rounded-md">
        <div className="relative">
          <ProductImage product={product} packLabel={pack.label} />
          <DealBadge pack={pack} />
        </div>
        <h3 className="mt-3 line-clamp-2 font-medium group-hover:underline">{product.name}</h3>
      </Link>
      <p className="text-sm text-ink-soft">{pack.label}</p>
      <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
        <span className="font-semibold tabular-nums">{formatPrice(pack.price)}</span>
        <OldPrice pack={pack} />
      </p>
      <p className="text-sm text-ink-soft tabular-nums">{formatUnitPrice(pack)}</p>
      {STOCK_TEXT[product.stock] && <p className="mt-1 text-sm font-medium text-ink-soft">{STOCK_TEXT[product.stock]}</p>}
      <div ref={controlRef} className="mt-auto pt-3">
        {showStepper ? (
          <QuantityStepper
            value={qty}
            min={0}
            onChange={(q) => {
              refocus.current = q === 0
              setQty(itemKey(product.id, pack.id), q)
            }}
            label={`Số lượng ${product.name}`}
          />
        ) : (
          <Button
            disabled={!inStock}
            onClick={() => {
              refocus.current = true
              add({ productId: product.id, packId: pack.id, qty: 1 })
            }}
            aria-label={`Thêm ${product.name} vào giỏ`}
          >
            <Plus aria-hidden="true" />
            Thêm
          </Button>
        )}
      </div>
    </article>
  )
}
