import type { Pack } from '@/data/catalog'
import { discountPercent, formatPrice } from '@/lib/store'

// Apricot marks deals and nothing else, so these two are the only places it's used.

/** The -N% badge in the corner of a deal's image. Shows nothing for a pack that isn't on a deal. */
export function DealBadge({ pack }: { pack: Pack }) {
  const discount = discountPercent(pack)
  if (!discount) return null
  return (
    <span className="absolute top-2 left-2 rounded-md bg-apricot px-2 py-0.5 text-sm font-semibold text-ink">-{discount}%</span>
  )
}

/** A deal's old price, struck through. Shows nothing for a pack that isn't on a deal. */
export function OldPrice({ pack }: { pack: Pack }) {
  if (!pack.wasPrice) return null
  return (
    <s className="text-sm text-ink-soft tabular-nums decoration-apricot decoration-2">
      <span className="sr-only">Giá cũ </span>
      {formatPrice(pack.wasPrice)}
    </s>
  )
}
