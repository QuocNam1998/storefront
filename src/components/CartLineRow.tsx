import { Link } from 'react-router-dom'
import { QuantityStepper } from '@/components/QuantityStepper'
import { formatPrice } from '@/lib/store'
import { useCart, type CartLine } from '@/store/cart'

export function CartLineRow({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQty, remove } = useCart()

  return (
    <li className="flex gap-4 py-4">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/p/${line.product.slug}`} onClick={onNavigate} className="font-semibold hover:underline">
              {line.product.name}
            </Link>
            <p className="text-sm text-muted-foreground">{line.pack.label}</p>
          </div>
          <span className="font-semibold tabular-nums">{formatPrice(line.lineTotal)}</span>
        </div>
        <div className="flex items-center gap-3">
          <QuantityStepper value={line.qty} onChange={(q) => setQty(line.key, q)} label={`Số lượng ${line.product.name}`} />
          <button
            type="button"
            className="rounded-md text-sm text-muted-foreground underline underline-offset-4 hover:text-ink"
            onClick={() => remove(line.key)}
            aria-label={`Xoá ${line.product.name}, ${line.pack.label}`}
          >
            Xoá
          </button>
        </div>
      </div>
    </li>
  )
}
