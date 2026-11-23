'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CartLineRow } from '@/components/CartLineRow'
import { FreeDeliveryProgress } from '@/components/FreeDeliveryProgress'
import { formatPrice } from '@/lib/store'
import { useCart } from '@/store/cart'

export function CartSheet() {
  const { lines, subtotal, isOpen, setOpen } = useCart()
  const close = () => setOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full gap-0 bg-mist sm:max-w-md">
        <SheetHeader className="border-b border-line">
          <SheetTitle className="text-xl font-semibold">Giỏ hàng</SheetTitle>
          <SheetDescription className="sr-only">Các sản phẩm bạn đã chọn và tạm tính.</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start gap-4 p-6">
            <p className="text-lg">Giỏ hàng đang trống.</p>
            <Button asChild size="xl">
              <Link href="/" onClick={close}>
                Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-4">
              {lines.map((line) => (
                <CartLineRow key={line.key} line={line} onNavigate={close} />
              ))}
            </ul>
            <SheetFooter className="gap-3 border-t border-line bg-surface">
              <div className="flex items-baseline justify-between text-base">
                <span>Tạm tính</span>
                <span className="text-lg font-bold tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <FreeDeliveryProgress subtotal={subtotal} />
              <Button asChild size="xl">
                <Link href="/checkout" onClick={close}>
                  Thanh toán
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/cart" onClick={close}>
                  Xem giỏ hàng
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
