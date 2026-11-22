import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { CartLineRow } from '@/components/CartLineRow'
import { FREE_SHIPPING_THRESHOLD, formatPrice } from '@/lib/store'
import { useCart } from '@/store/cart'

export function FreeShippingNote({ subtotal }: { subtotal: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal
  if (remaining <= 0) return <p className="text-sm">Standard shipping is free on this order.</p>
  return <p className="text-sm text-muted-foreground">Add {formatPrice(remaining)} more for free standard shipping.</p>
}

export function CartSheet() {
  const { lines, subtotal, isOpen, setOpen } = useCart()
  const close = () => setOpen(false)

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="w-full gap-0 bg-bean sm:max-w-md">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-wide text-xl font-extrabold">Your cart</SheetTitle>
          <SheetDescription className="sr-only">Items you’ve added and your subtotal.</SheetDescription>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-start gap-4 p-6">
            <p className="text-lg">Your cart is empty.</p>
            <Button asChild size="lg">
              <Link to="/shop?type=coffee" onClick={close}>
                Browse coffees
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-border overflow-y-auto px-4">
              {lines.map((line) => (
                <CartLineRow key={line.key} line={line} onNavigate={close} />
              ))}
            </ul>
            <SheetFooter className="gap-3 border-t border-border bg-parchment">
              <div className="flex items-baseline justify-between text-base">
                <span>Subtotal</span>
                <span className="text-lg font-bold tabular-nums">{formatPrice(subtotal)}</span>
              </div>
              <FreeShippingNote subtotal={subtotal} />
              <Button asChild size="xl">
                <Link to="/checkout" onClick={close}>
                  Check out
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/cart" onClick={close}>
                  View full cart
                </Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
