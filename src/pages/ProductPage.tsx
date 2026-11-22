import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ProductArt } from '@/components/ProductArt'
import { ProductTile } from '@/components/ProductTile'
import { QuantityStepper } from '@/components/QuantityStepper'
import { RoastScale } from '@/components/RoastScale'
import { GRINDS, getProductBySlug, products, type Grind, type Product } from '@/data/products'
import { formatDay, formatPrice, nextRoastDate } from '@/lib/store'
import { useCart } from '@/store/cart'
import { NotFound } from '@/pages/NotFound'

function related(product: Product): Product[] {
  const sameKind = products.filter((p) => p.kind === product.kind && p.id !== product.id)
  if (product.kind !== 'coffee') return sameKind.slice(0, 4)
  // Closest cups first: same flavor family, then nearest roast level.
  return sameKind
    .map((p) => ({ p, score: (p.kind === 'coffee' ? Math.abs(p.roast - product.roast) : 9) - (p.kind === 'coffee' && p.flavor === product.flavor ? 3 : 0) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 4)
    .map((x) => x.p)
}

export function ProductPage() {
  const { slug = '' } = useParams()
  const product = getProductBySlug(slug)
  if (!product) return <NotFound />
  // Remount on slug change so option state resets when moving between products.
  return <ProductDetail key={product.id} product={product} />
}

function ProductDetail({ product }: { product: Product }) {
  const { add, setOpen } = useCart()
  const [sizeId, setSizeId] = useState(product.sizes[0].id)
  const [grind, setGrind] = useState<Grind>('Whole bean')
  const [qty, setQty] = useState(1)
  const size = product.sizes.find((s) => s.id === sizeId) ?? product.sizes[0]
  const isCoffee = product.kind === 'coffee'

  const addToCart = () => {
    add({ productId: product.id, sizeId: size.id, grind: isCoffee ? grind : undefined, qty })
    setQty(1)
    setOpen(true)
  }

  const details =
    product.kind === 'coffee'
      ? [
          { label: 'Producer', value: product.producer },
          { label: 'Region', value: `${product.region}, ${product.origin}` },
          { label: 'Altitude', value: product.altitude },
          { label: 'Variety', value: product.variety },
          { label: 'Process', value: product.process },
        ]
      : product.specs

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap gap-1.5">
          <li>
            <Link to="/shop" className="hover:text-roast hover:underline">Shop</Link>
            <span aria-hidden="true"> /</span>
          </li>
          <li>
            <Link to={`/shop?type=${product.kind}`} className="hover:text-roast hover:underline">
              {isCoffee ? 'Coffee' : 'Gear'}
            </Link>
            <span aria-hidden="true"> /</span>
          </li>
          <li aria-current="page" className="text-roast">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
        <div className="md:sticky md:top-24 md:self-start">
          <ProductArt product={product} sizeLabel={size.label} className="mx-auto max-w-[420px]" />
        </div>

        <div>
          <h1 className="font-wide text-4xl leading-none font-black tracking-tight sm:text-5xl">{product.name}</h1>
          {product.kind === 'coffee' && <p className="mt-3 text-lg">{product.origin}, {product.region}</p>}
          <p className="mt-4 text-2xl font-semibold tabular-nums">{formatPrice(size.price)}</p>

          {product.kind === 'coffee' && (
            <p className="font-condensed mt-6 text-3xl leading-tight font-bold sm:text-4xl">
              {product.notes.join(', ')}
            </p>
          )}
          <p className="mt-4 max-w-prose text-lg leading-relaxed">{product.summary}</p>

          {product.kind === 'coffee' && (
            <div className="mt-8 max-w-sm">
              <RoastScale level={product.roast} />
            </div>
          )}

          <div className="mt-8 space-y-6 border-t border-border pt-8">
            {product.sizes.length > 1 && (
              <div>
                <p id="size-label" className="text-sm font-semibold">Size</p>
                <ToggleGroup
                  type="single"
                  value={sizeId}
                  onValueChange={(v) => v && setSizeId(v)}
                  aria-labelledby="size-label"
                  variant="outline"
                  spacing={2}
                  className="mt-2"
                >
                  {product.sizes.map((s) => (
                    <ToggleGroupItem
                      key={s.id}
                      value={s.id}
                      className="h-12 min-w-28 flex-col gap-0 bg-parchment px-4 data-[state=on]:border-roast data-[state=on]:bg-roast data-[state=on]:text-parchment"
                    >
                      <span className="font-semibold">{s.label}</span>
                      <span className="text-xs tabular-nums opacity-80">{formatPrice(s.price)}</span>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}

            {isCoffee && (
              <div className="max-w-xs">
                <Label htmlFor="grind" className="text-sm font-semibold">Grind</Label>
                <Select value={grind} onValueChange={(v) => setGrind(v as Grind)}>
                  <SelectTrigger id="grind" className="mt-2 w-full bg-parchment data-[size=default]:h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GRINDS.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <QuantityStepper value={qty} onChange={setQty} label="Quantity" size="lg" />
              <Button size="xl" className="flex-1 sm:flex-none sm:min-w-56" onClick={addToCart}>
                Add to cart
              </Button>
            </div>
            {isCoffee && (
              <p className="text-sm text-muted-foreground">
                Goes into the roast on {formatDay(nextRoastDate())}.
              </p>
            )}
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <h2 className="font-semibold">{isCoffee ? 'About this coffee' : 'Details'}</h2>
            <p className="mt-2 max-w-prose leading-relaxed">{product.description}</p>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              {details.map((d) => (
                <div key={d.label} className="contents">
                  <dt className="text-muted-foreground">{d.label}</dt>
                  <dd>{d.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section className="mt-24" aria-labelledby="related">
        <h2 id="related" className="font-wide text-2xl font-extrabold tracking-tight sm:text-3xl">
          {isCoffee ? 'If you like this one' : 'More brewing gear'}
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {related(product).map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  )
}
