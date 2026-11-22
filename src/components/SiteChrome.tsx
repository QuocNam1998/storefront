import { Search, ShoppingBasket } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { categories } from '@/data/catalog'
import { DELIVERY_PROMISE, FREE_DELIVERY_RULE } from '@/lib/store'
import { useCart } from '@/store/cart'
import { cn } from '@/lib/utils'

const STORE_NAME = 'Cửa hàng của Thy'

const NAV_LINKS = [...categories.map((c) => ({ to: `/c/${c.slug}`, label: c.name })), { to: '/deals', label: 'Ưu đãi' }]

function SearchForm() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const current = params.get('q') ?? ''
  const [value, setValue] = useState(current)
  const [shown, setShown] = useState(current)

  // When the address's search changes (a new search, Back, a link), show it in the box. The box itself stays put,
  // so a shopper who just pressed Enter keeps their place on the page.
  if (shown !== current) {
    setShown(current)
    setValue(current)
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <form role="search" onSubmit={submit} className="order-last flex w-full gap-2 md:order-none md:w-auto md:flex-1">
      <label htmlFor="site-search" className="sr-only">
        Tìm sản phẩm
      </label>
      <Input
        id="site-search"
        name="q"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm đồ ăn vặt, nước uống, nhu yếu phẩm…"
        className="h-10 bg-surface"
      />
      <Button type="submit" size="icon-lg" className="size-10 shrink-0" aria-label="Tìm">
        <Search aria-hidden="true" />
      </Button>
    </form>
  )
}

export function SiteHeader() {
  const { count, setOpen } = useCart()
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-mist">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 pt-3 sm:px-6">
        <Link to="/" className="mr-auto rounded-md text-lg font-semibold md:mr-0">
          {STORE_NAME}
        </Link>
        <SearchForm />
        <Button
          type="button"
          size="lg"
          variant="outline"
          onClick={() => setOpen(true)}
          className="h-10 bg-surface px-3"
          aria-label={`Mở giỏ hàng, ${count} món`}
        >
          <ShoppingBasket aria-hidden="true" />
          <span className="font-semibold tabular-nums">{count}</span>
        </Button>
      </div>
      <nav aria-label="Danh mục" className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6">
        <ul className="flex gap-1 py-2 whitespace-nowrap">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    'block rounded-md px-3 py-1.5 font-medium hover:bg-surface',
                    isActive && 'bg-surface text-sea-deep',
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="text-xl font-semibold">{STORE_NAME}</p>
          <p className="mt-3 text-ink-soft">
            {DELIVERY_PROMISE}. {FREE_DELIVERY_RULE}.
          </p>
          <p className="mt-2 text-ink-soft">Mở cửa 7:00–22:00 mỗi ngày.</p>
        </div>
        <div>
          <p className="font-semibold">Mua sắm</p>
          <ul className="mt-3 space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Link className="text-ink-soft hover:text-ink hover:underline" to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Giỏ hàng</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link className="text-ink-soft hover:text-ink hover:underline" to="/cart">
                Xem giỏ hàng
              </Link>
            </li>
            <li className="text-ink-soft">Thanh toán khi nhận hàng</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-6xl px-4 pb-8 text-sm text-ink-soft sm:px-6">
        Đây là cửa hàng demo. Đơn hàng chỉ được lưu trong trình duyệt này và không có thanh toán thật.
      </p>
    </footer>
  )
}
