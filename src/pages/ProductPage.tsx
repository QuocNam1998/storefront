import { ArrowLeft, ShoppingCart, Truck, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { DealBadge, OldPrice } from '@/components/DealMarks'
import { ProductImage } from '@/components/ProductImage'
import { ProductTile } from '@/components/ProductTile'
import { QuantityStepper } from '@/components/QuantityStepper'
import { CartCount } from '@/components/SiteChrome'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { categories, getProductBySlug, similarProducts, STOCK_TEXT, type Pack, type Product } from '@/data/catalog'
import { DELIVERY_PROMISE, FREE_DELIVERY_RULE, formatPrice, formatUnitPrice } from '@/lib/store'
import { cn } from '@/lib/utils'
import { NotFound } from '@/pages/NotFound'
import { useCart } from '@/store/cart'

function PackChoice({ product, pack, onChange }: { product: Product; pack: Pack; onChange: (packId: string) => void }) {
  return (
    <div className="mt-6">
      <h2 className="font-semibold">Chọn loại</h2>
      <ToggleGroup
        type="single"
        value={pack.id}
        onValueChange={(v) => v && onChange(v)}
        aria-label="Chọn loại"
        variant="outline"
        spacing={3}
        className="mt-3 grid w-full grid-cols-2"
      >
        {product.packs.map((p) => (
          <ToggleGroupItem
            key={p.id}
            value={p.id}
            className="h-auto flex-col items-start rounded-xl border-line bg-surface px-4 py-3 text-left data-[state=on]:border-sea data-[state=on]:bg-sea/10"
          >
            <span className="font-semibold">{p.label}</span>
            <span className="text-sm font-semibold text-sea tabular-nums">{formatPrice(p.price)}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}

/** On a phone, round back and cart buttons over the top of the photo, in place of the site header. */
function PhotoButtons() {
  const { count, setOpen } = useCart()
  const navigate = useNavigate()
  const location = useLocation()
  const round = 'absolute top-4 grid size-11 place-items-center rounded-full bg-surface text-ink md:hidden'
  // A page opened straight from a link has no earlier page in this store to go back to.
  const goBack = () => (location.key === 'default' ? navigate('/') : navigate(-1))
  return (
    <>
      <button type="button" onClick={goBack} aria-label="Quay lại" className={cn(round, 'left-4')}>
        <ArrowLeft aria-hidden="true" className="size-5" />
      </button>
      <button type="button" onClick={() => setOpen(true)} aria-label={`Mở giỏ hàng, ${count} món`} className={cn(round, 'right-4')}>
        <ShoppingCart aria-hidden="true" className="size-5" />
        <span className="absolute -top-1 -right-1">
          <CartCount count={count} />
        </span>
      </button>
    </>
  )
}

function DeliveryCard() {
  return (
    <ul className="mt-8 space-y-4 rounded-2xl border border-line bg-surface p-5">
      <li className="flex gap-3">
        <Truck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sea" />
        <div>
          <p className="font-semibold">{DELIVERY_PROMISE}</p>
          <p className="text-sm text-ink-soft">{FREE_DELIVERY_RULE}</p>
        </div>
      </li>
      <li className="flex gap-3">
        <Wallet aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-sea" />
        <p className="font-semibold">Thanh toán khi nhận hàng (COD)</p>
      </li>
    </ul>
  )
}

function ProductDetail({ product }: { product: Product }) {
  const { add, setOpen } = useCart()
  const navigate = useNavigate()
  const [packId, setPackId] = useState(product.packs[0].id)
  const [qty, setQty] = useState(1)
  const pack = product.packs.find((p) => p.id === packId) ?? product.packs[0]
  const category = categories.find((c) => c.id === product.categoryId)
  const inStock = product.stock !== 'out'

  const addToCart = () => {
    add({ productId: product.id, packId: pack.id, qty })
    setOpen(true)
  }
  const buyNow = () => {
    add({ productId: product.id, packId: pack.id, qty })
    navigate('/checkout')
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10">
        <div className="relative max-md:-mx-4 max-md:-mt-6">
          <div className="max-md:*:rounded-none">
            <ProductImage product={product} />
          </div>
          {/* On a phone the back button sits in the corner, so the deal badge moves down below it. */}
          <div className="absolute inset-x-0 top-0 max-md:top-16 max-md:left-2">
            <DealBadge pack={pack} />
          </div>
          <PhotoButtons />
        </div>
        <div className="max-md:relative max-md:-mx-4 max-md:-mt-6 max-md:rounded-t-3xl max-md:bg-surface max-md:px-4 max-md:pt-6 max-md:pb-2">
          {category && (
            <Link to={`/c/${category.slug}`} className="inline-block rounded-full bg-sea/10 px-3 py-1 text-sm font-semibold text-sea hover:underline">
              {category.name}
            </Link>
          )}
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3">
            <span className="text-3xl font-bold text-sea tabular-nums">{formatPrice(pack.price)}</span>
            <span className="text-ink-soft">/ {pack.label}</span>
            <OldPrice pack={pack} />
          </p>
          <p className="mt-1 text-sm text-ink-soft tabular-nums">{formatUnitPrice(pack)}</p>
          {STOCK_TEXT[product.stock] && <p className="mt-2 font-medium text-ink-soft">{STOCK_TEXT[product.stock]}</p>}

          {product.packs.length > 1 && <PackChoice product={product} pack={pack} onChange={setPackId} />}

          <div className="mt-6 flex flex-wrap gap-3">
            <div
              data-bottom-bar
              className="flex flex-1 gap-3 max-md:fixed max-md:inset-x-0 max-md:bottom-0 max-md:z-30 max-md:border-t max-md:border-line max-md:bg-surface max-md:p-4"
            >
              {inStock && <QuantityStepper value={qty} onChange={setQty} label="Số lượng" size="lg" />}
              <Button size="xl" disabled={!inStock} onClick={addToCart} className="h-auto min-h-12 min-w-0 flex-1 rounded-xl px-4 whitespace-normal max-md:text-sm">
                Thêm vào giỏ · {formatPrice(pack.price * qty)}
              </Button>
            </div>
            <Button
              size="xl"
              variant="outline"
              disabled={!inStock}
              onClick={buyNow}
              className="h-12 rounded-xl border-sea bg-surface font-semibold text-sea hover:bg-sea/10 hover:text-sea-deep max-md:w-full"
            >
              Mua ngay
            </Button>
          </div>

          <DeliveryCard />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section aria-labelledby="product-description" className="rounded-2xl border border-line bg-surface p-6">
          <h2 id="product-description" className="text-lg font-semibold">
            Mô tả sản phẩm
          </h2>
          <p className="mt-3 leading-relaxed">{product.description}</p>
        </section>
      </div>
    </>
  )
}

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)
  if (!product) return <NotFound />
  const category = categories.find((c) => c.id === product.categoryId)

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <nav aria-label="Đường dẫn" className="mb-6 text-sm max-md:hidden">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link to="/" className="text-sea hover:underline">
              Trang chủ
            </Link>
          </li>
          <li aria-hidden="true" className="text-ink-soft">
            /
          </li>
          {category && (
            <>
              <li>
                <Link to={`/c/${category.slug}`} className="text-sea hover:underline">
                  {category.name}
                </Link>
              </li>
              <li aria-hidden="true" className="text-ink-soft">
                /
              </li>
            </>
          )}
          <li aria-current="page" className="text-ink-soft">
            {product.name}
          </li>
        </ol>
      </nav>
      <ProductDetail key={product.id} product={product} />
      <section aria-labelledby="similar-products" className="mt-12">
        <h2 id="similar-products" className="text-2xl font-semibold">
          Có thể bạn cũng thích
        </h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-5">
          {similarProducts(product)
            .slice(0, 4)
            .map((p) => (
              <li key={p.id} className="grid">
                <ProductTile product={p} />
              </li>
            ))}
        </ul>
      </section>
    </div>
  )
}
