'use client'

import { BadgePercent, Search, ShoppingBasket, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { categories, dealProducts, productsInCategory } from '@/data/catalog'
import { DELIVERY_PROMISE, FREE_DELIVERY_RULE } from '@/lib/store'
import { useCart } from '@/store/cart'
import { cn } from '@/lib/utils'

const STORE_NAME = 'Cửa hàng của Thy'

export const NAV_LINKS = [
  ...categories.map((c) => ({
    to: `/c/${c.slug}`,
    label: c.name,
    icon: c.subcategories[0].icon,
    tint: c.tint,
    iconColor: c.iconColor,
    count: productsInCategory(c.id).length,
  })),
  { to: '/deals', label: 'Ưu đãi', icon: BadgePercent, tint: 'border border-line bg-surface', iconColor: 'text-sea', count: dealProducts.length },
]

function SearchForm({ current }: { current: string }) {
  const router = useRouter()
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
    router.push(`/search?q=${encodeURIComponent(value.trim())}`)
  }

  return (
    <form role="search" onSubmit={submit} className="relative order-last w-full md:order-none md:w-auto md:flex-1">
      <label htmlFor="site-search" className="sr-only">
        Tìm sản phẩm
      </label>
      <Search aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-soft" />
      <Input
        id="site-search"
        name="q"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Tìm đồ ăn vặt, nước uống, nhu yếu phẩm…"
        className="h-11 rounded-xl bg-mist pl-10"
      />
    </form>
  )
}

function SearchFormFromAddress() {
  return <SearchForm current={useSearchParams().get('q') ?? ''} />
}

/** The yellow circle with the number of items in the cart. */
export function CartCount({ count }: { count: number }) {
  // Hidden until the saved cart is read, so it never shows a wrong count and the button around it keeps its size.
  const { loaded } = useCart()
  return (
    <span className={cn('grid size-6 place-items-center rounded-full bg-apricot text-sm font-bold text-ink tabular-nums', !loaded && 'invisible')}>
      {count}
    </span>
  )
}

/** Below desktop width, the categories and deals as a row of tinted icon tiles. */
export function CategoryIconRow() {
  const pathname = usePathname()
  return (
    <nav aria-label="Danh mục" className="mb-8 xl:hidden">
      <ul className="grid grid-cols-4 gap-3">
        {NAV_LINKS.map((link) => (
          <li key={link.to}>
            <Link
              href={link.to}
              aria-current={pathname === link.to ? 'page' : undefined}
              className="group flex flex-col items-center gap-2 rounded-xl text-center text-sm font-semibold"
            >
              <span className={cn('grid aspect-square w-full max-w-24 place-items-center rounded-2xl group-aria-[current=page]:ring-2 group-aria-[current=page]:ring-sea', link.tint)}>
                <link.icon aria-hidden="true" className={cn('size-8', link.iconColor)} strokeWidth={1.75} />
              </span>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export function SiteHeader() {
  const { loaded, count, setOpen } = useCart()
  // On a phone the product page puts its own back and cart buttons over the photo instead.
  const onProductPage = usePathname().startsWith('/p/')
  return (
    <header className={cn('sticky top-0 z-40 border-b border-line bg-surface', onProductPage && 'max-md:hidden')}>
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="mr-auto flex items-center gap-2.5 rounded-md text-xl font-bold text-sea md:mr-0">
          <span className="grid size-10 place-items-center rounded-xl bg-sea text-surface">
            <ShoppingBasket aria-hidden="true" className="size-5" />
          </span>
          {STORE_NAME}
        </Link>
        {/* Pages built ahead of time don't know the address's search, so they start with an empty box. */}
        <Suspense fallback={<SearchForm current="" />}>
          <SearchFormFromAddress />
        </Suspense>
        <Button
          type="button"
          size="lg"
          onClick={() => setOpen(true)}
          className="h-11 gap-2.5 rounded-xl bg-ink px-4 text-surface hover:bg-ink/85"
          aria-label={loaded ? `Mở giỏ hàng, ${count} món` : 'Mở giỏ hàng'}
        >
          <ShoppingCart aria-hidden="true" />
          <span className="hidden font-semibold md:inline">Giỏ hàng</span>
          <CartCount count={count} />
        </Button>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="max-w-sm">
          <p className="text-xl font-bold text-sea">{STORE_NAME}</p>
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
                <Link className="text-ink-soft hover:text-ink hover:underline" href={link.to}>
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
              <Link className="text-ink-soft hover:text-ink hover:underline" href="/cart">
                Xem giỏ hàng
              </Link>
            </li>
            <li className="text-ink-soft">Thanh toán khi nhận hàng</li>
          </ul>
        </div>
      </div>
      <p className="mx-auto max-w-7xl px-4 pb-8 text-sm text-ink-soft sm:px-6">
        Đây là cửa hàng demo. Đơn hàng chỉ được lưu trong trình duyệt này và không có thanh toán thật.
      </p>
    </footer>
  )
}
