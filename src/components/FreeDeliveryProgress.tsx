import { Progress } from '@/components/ui/progress'
import { amountToFreeDelivery, FREE_DELIVERY_THRESHOLD, formatPrice } from '@/lib/store'

export function FreeDeliveryProgress({ subtotal }: { subtotal: number }) {
  const remaining = amountToFreeDelivery(subtotal)
  return (
    <div>
      <p className="text-sm">
        {remaining > 0 ? `Mua thêm ${formatPrice(remaining)} để được miễn phí giao hàng` : 'Đơn hàng được miễn phí giao hàng'}
      </p>
      <Progress
        value={Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}
        aria-label="Tiến tới miễn phí giao hàng"
        className="mt-2 h-2 bg-line"
      />
    </div>
  )
}
