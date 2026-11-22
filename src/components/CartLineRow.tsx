import { Link } from 'react-router-dom'
import { ProductArt } from '@/components/ProductArt'
import { QuantityStepper } from '@/components/QuantityStepper'
import { formatPrice } from '@/lib/store'
import { useCart, type CartLine } from '@/store/cart'

export function CartLineRow({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQty, remove } = useCart()
  const detail = [line.product.kind === 'coffee' ? line.size.label : null, line.grind].filter(Boolean).join(', ')

  return (
    <li className="flex gap-4 py-4">
      <Link to={`/product/${line.product.slug}`} onClick={onNavigate} className="w-16 shrink-0" tabIndex={-1} aria-hidden="true">
        <ProductArt product={line.product} sizeLabel={line.size.label} />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${line.product.slug}`} onClick={onNavigate} className="font-semibold hover:underline">
              {line.product.name}
            </Link>
            {detail && <p className="text-sm text-muted-foreground">{detail}</p>}
          </div>
          <span className="font-semibold tabular-nums">{formatPrice(line.lineTotal)}</span>
        </div>
        <div className="flex items-center gap-3">
          <QuantityStepper value={line.qty} onChange={(q) => setQty(line.key, q)} label={`Quantity of ${line.product.name}`} />
          <button
            type="button"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-roast"
            onClick={() => remove(line.key)}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  )
}
