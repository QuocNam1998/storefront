import { ArrowRight, LayoutGrid } from 'lucide-react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { CartLineRow } from '@/components/CartLineRow'
import { FreeDeliveryProgress } from '@/components/FreeDeliveryProgress'
import { OrderTotals } from '@/components/OrderTotals'
import { CartCount, NAV_LINKS } from '@/components/SiteChrome'
import { Button } from '@/components/ui/button'
import { products } from '@/data/catalog'
import { deliveryFee, formatPrice } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useCart } from '@/store/cart'

const SIDEBAR_LINKS = [
  { to: '/', label: 'Tất cả', icon: LayoutGrid, tint: 'border border-line bg-surface', iconColor: 'text-sea', count: products.length },
  ...NAV_LINKS,
]

function CategorySidebar() {
  return (
    <nav aria-label="Danh mục" className="sticky top-24 hidden xl:block">
      <p className="px-2 text-sm font-semibold text-ink-soft">Danh mục</p>
      <ul className="mt-3 space-y-1">
        {SIDEBAR_LINKS.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end
              className="flex items-center gap-3 rounded-xl border-2 border-transparent p-2 font-semibold hover:bg-surface aria-[current=page]:border-sea aria-[current=page]:bg-surface"
            >
              <span className={cn('grid size-9 shrink-0 place-items-center rounded-lg', link.tint)}>
                <link.icon aria-hidden="true" className={cn('size-5', link.iconColor)} strokeWidth={1.75} />
              </span>
              <span className="flex-1">{link.label}</span>
              <span className="text-sm text-ink-soft tabular-nums">{link.count}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

function CartPanel() {
  const { lines, count, subtotal } = useCart()
  const delivery = deliveryFee(subtotal)
  return (
    <aside
      aria-label="Giỏ hàng"
      className="sticky top-24 hidden max-h-[calc(100svh-7rem)] overflow-y-auto rounded-2xl border border-line bg-surface p-5 xl:block"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-xl font-semibold">Giỏ hàng</h2>
        <span className="text-sm text-ink-soft">{count} món</span>
      </div>
      {lines.length === 0 ? (
        <p className="mt-4 text-ink-soft">Giỏ hàng đang trống.</p>
      ) : (
        <>
          <ul className="mt-2 divide-y divide-line">
            {lines.map((line) => (
              <CartLineRow key={line.key} line={line} />
            ))}
          </ul>
          <div className="mt-4">
            <FreeDeliveryProgress subtotal={subtotal} />
          </div>
          <OrderTotals subtotal={subtotal} delivery={delivery} />
          <Button asChild size="xl" className="mt-5 w-full">
            <Link to="/checkout">Thanh toán · {formatPrice(subtotal + delivery)}</Link>
          </Button>
        </>
      )}
    </aside>
  )
}

/** On phones, once the cart has items: a bar fixed to the bottom of the screen that opens the cart page. */
function CartBar() {
  const { count, subtotal } = useCart()
  if (count === 0) return null
  return (
    <Link
      to="/cart"
      data-bottom-bar
      aria-label={`Xem giỏ hàng, ${count} món, ${formatPrice(subtotal)}`}
      className="fixed inset-x-3 bottom-3 z-30 flex items-center gap-3 rounded-2xl bg-ink p-3 pl-4 text-surface md:hidden"
    >
      <CartCount count={count} />
      <span className="flex-1">
        <span className="block text-sm">Giỏ hàng</span>
        <span className="block font-bold tabular-nums">{formatPrice(subtotal)}</span>
      </span>
      <span className="flex items-center gap-1.5 font-semibold">
        Xem giỏ
        <ArrowRight aria-hidden="true" className="size-4" />
      </span>
    </Link>
  )
}

/** The frame around the home, category, deals and search pages: sidebar, page, cart panel, and the phone cart bar. */
export function ShopLayout() {
  return (
    <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 pt-6 sm:px-6 xl:grid-cols-[13rem_minmax(0,1fr)_20rem]">
      <CategorySidebar />
      <div className="min-w-0">
        <Outlet />
      </div>
      <CartPanel />
      <CartBar />
    </div>
  )
}
