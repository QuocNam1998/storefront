import { ShoppingBag } from 'lucide-react'
import { Link, NavLink, useSearchParams } from 'react-router-dom'
import { formatDay, nextRoastDate } from '@/lib/store'
import { useCart } from '@/store/cart'
import { cn } from '@/lib/utils'

function NavItem({ to, type, children }: { to: string; type: string; children: string }) {
  const [params] = useSearchParams()
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'rounded-md px-2 py-1.5 font-medium underline-offset-[6px] hover:underline sm:px-3',
          isActive && params.get('type') === type && 'underline decoration-2',
        )
      }
    >
      {children}
    </NavLink>
  )
}

export function SiteHeader() {
  const { count, setOpen } = useCart()
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bean/95 backdrop-blur supports-[backdrop-filter]:bg-bean/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <Link to="/" className="font-wide mr-auto text-lg leading-none font-black tracking-tight sm:text-xl">
          Second Crack
        </Link>
        <nav aria-label="Main" className="flex items-center">
          <NavItem to="/shop?type=coffee" type="coffee">
            Coffee
          </NavItem>
          <NavItem to="/shop?type=gear" type="gear">
            Gear
          </NavItem>
        </nav>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="ml-1 inline-flex h-10 items-center gap-2 rounded-md bg-roast px-3 font-semibold text-parchment hover:bg-roast/90"
          aria-label={`Open cart, ${count} ${count === 1 ? 'item' : 'items'}`}
        >
          <ShoppingBag className="size-4" aria-hidden="true" />
          <span className="tabular-nums">{count}</span>
        </button>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-roast text-parchment">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="font-wide text-2xl font-black">Second Crack</p>
          <p className="mt-3 text-parchment/80">
            Small-batch coffee, roasted every Monday. The next roast is {formatDay(nextRoastDate())}.
          </p>
        </div>
        <div>
          <p className="font-semibold">Shop</p>
          <ul className="mt-3 space-y-2 text-parchment/80">
            <li><Link className="hover:text-parchment hover:underline" to="/shop?type=coffee">Coffee</Link></li>
            <li><Link className="hover:text-parchment hover:underline" to="/shop?type=gear">Brewing gear</Link></li>
            <li><Link className="hover:text-parchment hover:underline" to="/cart">Cart</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Help</p>
          <ul className="mt-3 space-y-2 text-parchment/80">
            <li>Free standard shipping over $40</li>
            <li>Ships within 48 hours of roasting</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-sm text-parchment/60 sm:px-6">
        This is a demo store. No real orders or payments are taken.
      </p>
    </footer>
  )
}
