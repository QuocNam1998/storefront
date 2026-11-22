import { formatPrice } from '@/lib/store'

export function OrderTotals({ subtotal, delivery }: { subtotal: number; delivery: number }) {
  return (
    <dl className="mt-6 space-y-2 border-t border-line pt-4">
      <div className="flex justify-between">
        <dt>Tạm tính</dt>
        <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Phí giao hàng</dt>
        <dd className="tabular-nums">{delivery === 0 ? 'Miễn phí' : formatPrice(delivery)}</dd>
      </div>
      <div className="flex justify-between border-t border-line pt-2 text-lg font-bold">
        <dt>Tổng cộng</dt>
        <dd className="tabular-nums">{formatPrice(subtotal + delivery)}</dd>
      </div>
    </dl>
  )
}
