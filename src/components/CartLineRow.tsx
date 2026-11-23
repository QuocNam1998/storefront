import Link from 'next/link'
import { ProductImage } from '@/components/ProductImage'
import { QuantityStepper } from '@/components/QuantityStepper'
import { formatPrice } from '@/lib/store'
import { useCart, type CartLine } from '@/store/cart'

export function CartLineRow({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQty, remove } = useCart()

  return (
    <li className="flex items-start gap-3 py-3">
      <div className="w-12 shrink-0">
        <ProductImage product={line.product} />
      </div>
      <div className="min-w-0 flex-1">
        <Link href={`/p/${line.product.slug}`} onClick={onNavigate} className="leading-snug font-semibold hover:underline">
          {line.product.name}
        </Link>
        <p className="text-sm text-muted-foreground">{line.pack.label}</p>
        <p className="font-semibold text-sea tabular-nums">{formatPrice(line.lineTotal)}</p>
      </div>
      <div className="flex flex-col items-end gap-1.5">
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
    </li>
  )
}
