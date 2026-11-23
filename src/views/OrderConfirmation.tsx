'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { OrderTotals } from '@/components/OrderTotals'
import { Button } from '@/components/ui/button'
import { getOrder, type Order } from '@/lib/orders'
import { DELIVERY_PROMISE, formatPrice } from '@/lib/store'

function ContinueShopping() {
  return (
    <Button asChild size="xl" className="mt-8">
      <Link href="/">Tiếp tục mua sắm</Link>
    </Button>
  )
}

export function OrderConfirmation({ id }: { id: string }) {
  // Orders are saved only in the browser, so the page shows nothing until it has looked there, rather than
  // claiming an order it hasn't read yet doesn't exist.
  const [order, setOrder] = useState<Order | null>()
  useEffect(() => setOrder(getOrder(id) ?? null), [id])

  if (order === undefined) return null
  if (!order) {
    return (
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Không tìm thấy đơn hàng</h1>
        <p className="mt-4 max-w-md text-lg">
          Đơn hàng {id} không có trong trình duyệt này. Đơn hàng chỉ được lưu trên trình duyệt đã dùng để đặt.
        </p>
        <ContinueShopping />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Cảm ơn {order.name}!</h1>
      <p className="mt-2 text-lg">
        Mã đơn hàng <span className="font-semibold">{order.id}</span>. {DELIVERY_PROMISE}.
      </p>

      <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_22rem]">
        <section aria-label="Giao đến" className="space-y-1 rounded-2xl border border-line bg-surface p-5">
          <h2 className="mb-2 font-semibold">Giao đến</h2>
          <p>{order.name}</p>
          <p className="tabular-nums">{order.phone}</p>
          <p>{[order.street, order.ward, order.province].join(', ')}</p>
          {order.note && <p className="text-ink-soft">Ghi chú: {order.note}</p>}
          <p className="pt-3 text-ink-soft">Thanh toán khi nhận hàng (COD)</p>
        </section>

        <section aria-label="Đơn hàng" className="rounded-2xl border border-line bg-surface p-5">
          <h2 className="font-semibold">Đơn hàng</h2>
          <ul className="mt-4 space-y-3">
            {order.lines.map((l) => (
              <li key={`${l.slug}|${l.packLabel}`} className="flex justify-between gap-4 text-sm">
                <span>
                  <span className="font-medium">
                    {l.qty} × {l.name}
                  </span>
                  <span className="block text-ink-soft">{l.packLabel}</span>
                </span>
                <span className="tabular-nums">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <OrderTotals subtotal={order.subtotal} delivery={order.delivery} />
        </section>
      </div>

      <ContinueShopping />
    </div>
  )
}
