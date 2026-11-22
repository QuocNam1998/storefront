import { useEffect } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { CartSheet } from '@/components/CartSheet'
import { SiteFooter, SiteHeader } from '@/components/SiteChrome'
import { Cart } from '@/pages/Cart'
import { Category } from '@/pages/Category'
import { Checkout } from '@/pages/Checkout'
import { Deals } from '@/pages/Deals'
import { Home } from '@/pages/Home'
import { NotFound } from '@/pages/NotFound'
import { OrderConfirmation } from '@/pages/OrderConfirmation'
import { ProductPage } from '@/pages/ProductPage'
import { Search } from '@/pages/Search'
import { CartProvider } from '@/store/cart'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function Layout() {
  return (
    <div className="flex min-h-svh flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-surface">
        Bỏ qua đến nội dung chính
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
      <CartSheet />
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="c/:slug" element={<Category />} />
            <Route path="deals" element={<Deals />} />
            <Route path="search" element={<Search />} />
            <Route path="p/:slug" element={<ProductPage />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order/:id" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  )
}
