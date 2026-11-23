import type { ReactNode } from 'react'
import { ShopLayout } from '@/components/ShopLayout'

export default function Layout({ children }: { children: ReactNode }) {
  return <ShopLayout>{children}</ShopLayout>
}
