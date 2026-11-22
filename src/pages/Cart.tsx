import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { CartLineRow } from '@/components/CartLineRow'
import { FreeShippingNote } from '@/components/CartSheet'
import { formatPrice } from '@/lib/store'
import { useCart } from '@/store/cart'

export function Cart() {
  const { lines, subtotal } = useCart()

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <h1 className="font-wide text-4xl font-black tracking-tight sm:text-5xl">Cart</h1>

      {lines.length === 0 ? (
        <div className="mt-8 max-w-md">
          <p className="text-lg">Your cart is empty.</p>
          <Button asChild size="xl" className="mt-4">
            <Link to="/shop?type=coffee">Browse coffees</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_340px]">
          <ul className="divide-y divide-border border-y border-border">
            {lines.map((line) => (
              <CartLineRow key={line.key} line={line} />
            ))}
          </ul>
          <aside className="self-start rounded-md bg-parchment p-6" aria-label="Order summary">
            <div className="flex items-baseline justify-between">
              <span>Subtotal</span>
              <span className="text-xl font-bold tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Shipping is calculated at checkout.</p>
            <div className="mt-3">
              <FreeShippingNote subtotal={subtotal} />
            </div>
            <Button asChild size="xl" className="mt-6 w-full">
              <Link to="/checkout">Check out</Link>
            </Button>
            <Link to="/shop" className="mt-4 block text-center text-sm underline underline-offset-4">
              Keep shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}
