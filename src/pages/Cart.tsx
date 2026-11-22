import { Link } from 'react-router-dom'
import { CartLineRow } from '@/components/CartLineRow'
import { FreeDeliveryProgress } from '@/components/FreeDeliveryProgress'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/store'
import { useCart } from '@/store/cart'

export function Cart() {
  const { lines, subtotal } = useCart()

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Giỏ hàng</h1>

      {lines.length === 0 ? (
        <div className="mt-8 max-w-md">
          <p className="text-lg">Giỏ hàng đang trống.</p>
          <Button asChild size="xl" className="mt-4">
            <Link to="/">Tiếp tục mua sắm</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_22rem]">
          <ul className="divide-y divide-line border-y border-line">
            {lines.map((line) => (
              <CartLineRow key={line.key} line={line} />
            ))}
          </ul>
          <section aria-label="Tóm tắt" className="space-y-4 rounded-lg bg-surface p-5">
            <div className="flex items-baseline justify-between">
              <span>Tạm tính</span>
              <span className="text-xl font-bold tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <FreeDeliveryProgress subtotal={subtotal} />
            <Button asChild size="xl" className="w-full">
              <Link to="/checkout">Thanh toán</Link>
            </Button>
          </section>
        </div>
      )}
    </div>
  )
}
