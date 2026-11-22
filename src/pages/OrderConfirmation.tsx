import { Link, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { getOrder } from '@/lib/orders'
import { SHIPPING_METHODS, formatDay, formatPrice } from '@/lib/store'

export function OrderConfirmation() {
  const { id = '' } = useParams()
  const order = getOrder(id)

  if (!order) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <h1 className="font-wide text-4xl font-black tracking-tight">We couldn’t find order {id}.</h1>
        <p className="mt-4 max-w-md text-lg">Orders are saved in the browser they were placed in. Try opening this link there.</p>
        <Button asChild size="xl" className="mt-8">
          <Link to="/shop">Go to the shop</Link>
        </Button>
      </div>
    )
  }

  const roast = new Date(order.roastDate)
  const ships = new Date(roast)
  ships.setDate(ships.getDate() + 2)
  const firstName = order.shipTo.name.split(' ')[0]
  const method = SHIPPING_METHODS.find((m) => m.id === order.shippingMethod)

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 sm:px-6">
      <p className="text-muted-foreground">Order {order.id}</p>
      <h1 className="font-wide mt-2 text-4xl leading-none font-black tracking-tight sm:text-5xl">Thanks, {firstName}. Your order is in.</h1>
      <p className="mt-6 max-w-prose text-lg leading-relaxed">
        Your coffee goes into the roast on <strong className="font-semibold">{formatDay(roast)}</strong> and ships by{' '}
        <strong className="font-semibold">{formatDay(ships)}</strong>. In a real store, a confirmation would go to {order.email}.
      </p>

      <div className="mt-10 grid gap-8 rounded-md bg-parchment p-6 sm:grid-cols-2">
        <div>
          <h2 className="font-semibold">Shipping to</h2>
          <address className="mt-2 leading-relaxed not-italic">
            {order.shipTo.name}<br />
            {order.shipTo.address}<br />
            {order.shipTo.city}, {order.shipTo.region} {order.shipTo.postalCode}<br />
            {order.shipTo.country}
          </address>
          <p className="mt-3 text-sm text-muted-foreground">{method?.label} shipping, {method?.detail}</p>
        </div>
        <div>
          <h2 className="font-semibold">Items</h2>
          <ul className="mt-2 space-y-2">
            {order.lines.map((l) => (
              <li key={`${l.slug}-${l.detail}`} className="flex justify-between gap-4 text-sm">
                <span>
                  {l.qty} × <Link to={`/product/${l.slug}`} className="underline underline-offset-2">{l.name}</Link>
                  {l.detail && <span className="block text-muted-foreground">{l.detail}</span>}
                </span>
                <span className="tabular-nums">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{formatPrice(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd className="tabular-nums">{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</dd></div>
            <div className="flex justify-between text-base font-bold"><dt>Total</dt><dd className="tabular-nums">{formatPrice(order.total)}</dd></div>
          </dl>
        </div>
      </div>

      <Button asChild size="xl" className="mt-10">
        <Link to="/shop">Keep shopping</Link>
      </Button>
    </div>
  )
}
