import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { CartSheet } from '@/components/CartSheet'
import { SiteFooter, SiteHeader } from '@/components/SiteChrome'
import { CartProvider } from '@/store/cart'
import { StoreNavigationTracker } from '@/views/ProductPage'
import '@/index.css'

export const metadata: Metadata = {
  title: 'Cửa hàng của Thy',
  description: 'Đồ ăn vặt, nước uống và nhu yếu phẩm. Giao hàng trong 2 giờ.',
  icons: { icon: { url: '/favicon.svg', type: 'image/svg+xml' } },
}

export const viewport: Viewport = { themeColor: '#F7F5EE' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <CartProvider>
          <StoreNavigationTracker />
          {/* Leaves room under the footer on phones, so a bar fixed to the bottom of the screen never covers it. */}
          <div className="flex min-h-svh flex-col max-md:has-[[data-bottom-bar]]:pb-24">
            <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-surface">
              Bỏ qua đến nội dung chính
            </a>
            <SiteHeader />
            <main id="main" className="flex-1">
              {children}
            </main>
            <SiteFooter />
            <CartSheet />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
