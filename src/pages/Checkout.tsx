import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { OrderTotals } from '@/components/OrderTotals'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { newOrderId, saveOrder, type Order } from '@/lib/orders'
import { DELIVERY_PROMISE, deliveryFee, formatPrice } from '@/lib/store'
import { useCart, type CartLine } from '@/store/cart'

const OTHER = 'Khác'
const PROVINCES = ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', OTHER]

type FieldName = 'name' | 'phone' | 'email' | 'street' | 'ward' | 'province' | 'otherProvince'
type Form = Record<FieldName | 'note', string>
type Errors = Partial<Record<FieldName, string>>

const EMPTY: Form = { name: '', phone: '', email: '', street: '', ward: '', province: '', otherProvince: '', note: '' }

/** 0 then 9 digits, or +84 then 9 digits, ignoring spaces and dots. */
const isPhone = (v: string) => /^(0|\+84)\d{9}$/.test(v.replace(/[\s.]/g, ''))
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
const required = (v: string, message: string) => (v.trim() ? undefined : message)

// In the order the fields appear, so focus goes to the first problem on the page.
const CHECKS: Record<FieldName, (f: Form) => string | undefined> = {
  name: (f) => required(f.name, 'Vui lòng nhập họ và tên.'),
  phone: (f) =>
    required(f.phone, 'Vui lòng nhập số điện thoại.') ??
    (isPhone(f.phone) ? undefined : 'Số điện thoại gồm số 0 và 9 chữ số, hoặc +84 và 9 chữ số.'),
  email: (f) => (!f.email.trim() || isEmail(f.email.trim()) ? undefined : 'Email chưa đúng, ví dụ ten@example.com.'),
  street: (f) => required(f.street, 'Vui lòng nhập số nhà, tên đường.'),
  ward: (f) => required(f.ward, 'Vui lòng nhập phường/xã.'),
  province: (f) => required(f.province, 'Vui lòng chọn tỉnh/thành phố.'),
  otherProvince: (f) => (f.province === OTHER ? required(f.otherProvince, 'Vui lòng nhập tên tỉnh/thành phố.') : undefined),
}

function validate(f: Form): Errors {
  const errors: Errors = {}
  for (const [field, check] of Object.entries(CHECKS) as [FieldName, (f: Form) => string | undefined][]) {
    const message = check(f)
    if (message) errors[field] = message
  }
  return errors
}

function buildOrder(f: Form, lines: CartLine[], subtotal: number): Order {
  const delivery = deliveryFee(subtotal)
  return {
    id: newOrderId(),
    createdAt: new Date().toISOString(),
    name: f.name.trim(),
    phone: f.phone.trim(),
    email: f.email.trim() || undefined,
    street: f.street.trim(),
    ward: f.ward.trim(),
    province: f.province === OTHER ? f.otherProvince.trim() : f.province,
    note: f.note.trim() || undefined,
    payment: 'cod',
    lines: lines.map((l) => ({ name: l.product.name, slug: l.product.slug, packLabel: l.pack.label, qty: l.qty, lineTotal: l.lineTotal })),
    subtotal,
    delivery,
    total: subtotal + delivery,
  }
}

export function Checkout() {
  const { lines, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <h1 className="text-3xl font-semibold sm:text-4xl">Thanh toán</h1>
        <p className="mt-6 text-lg">Giỏ hàng đang trống, nên chưa có gì để thanh toán.</p>
        <Button asChild size="xl" className="mt-4">
          <Link to="/">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    )
  }

  const delivery = deliveryFee(subtotal)

  const set = (key: keyof Form) => (value: string) => {
    const next = { ...form, [key]: value }
    setForm(next)
    if (submitted) setErrors(validate(next))
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    const found = validate(form)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`#${first}`)?.focus()
      return
    }
    const order = buildOrder(form, lines, subtotal)
    saveOrder(order)
    clear()
    navigate(`/order/${order.id}`, { replace: true })
  }

  const errorCount = Object.keys(errors).length

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Thanh toán</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_22rem]">
        <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-10">
          {submitted && errorCount > 0 && (
            <div role="alert" className="rounded-lg border-2 border-sea-deep bg-surface p-4">
              <p className="font-semibold text-sea-deep">{errorCount} trường cần được sửa trước khi đặt hàng.</p>
            </div>
          )}

          <fieldset className="space-y-4">
            <legend className="mb-4 text-xl font-semibold">Người nhận</legend>
            <Field id="name" label="Họ và tên" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
            <Field id="phone" label="Số điện thoại" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} error={errors.phone} />
            <Field id="email" label="Email (không bắt buộc)" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-4 text-xl font-semibold">Địa chỉ giao hàng</legend>
            <Field id="street" label="Số nhà, tên đường" autoComplete="address-line1" value={form.street} onChange={set('street')} error={errors.street} />
            <Field id="ward" label="Phường/Xã" value={form.ward} onChange={set('ward')} error={errors.ward} />
            <div>
              <Label htmlFor="province">Tỉnh/Thành phố</Label>
              <Select value={form.province} onValueChange={set('province')}>
                <SelectTrigger
                  id="province"
                  aria-invalid={errors.province ? true : undefined}
                  aria-describedby={errors.province ? 'province-error' : undefined}
                  className="mt-1.5 w-full bg-surface text-base data-[size=default]:h-11"
                >
                  <SelectValue placeholder="Chọn tỉnh/thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.province && <ErrorText id="province-error">{errors.province}</ErrorText>}
            </div>
            {form.province === OTHER && (
              <Field id="otherProvince" label="Tên tỉnh/thành phố" value={form.otherProvince} onChange={set('otherProvince')} error={errors.otherProvince} />
            )}
            <div>
              <Label htmlFor="note">Ghi chú cho người giao hàng (không bắt buộc)</Label>
              <Textarea id="note" value={form.note} onChange={(e) => set('note')(e.target.value)} className="mt-1.5 bg-surface text-base" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-4 text-xl font-semibold">Giao hàng</legend>
            <p className="rounded-lg bg-surface p-4 font-medium">{DELIVERY_PROMISE} sau khi đặt hàng.</p>
          </fieldset>

          <fieldset>
            <legend className="mb-4 text-xl font-semibold">Thanh toán</legend>
            <div className="space-y-2 rounded-lg bg-surface p-4">
              <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
              <p className="text-sm text-ink-soft">
                Đây là cửa hàng demo: không có thanh toán thật, và đơn hàng chỉ được lưu trong trình duyệt này.
              </p>
            </div>
          </fieldset>

          <Button type="submit" size="xl" className="w-full sm:w-auto sm:min-w-72">
            Đặt hàng
          </Button>
        </form>

        <aside className="self-start rounded-lg bg-surface p-6 md:sticky md:top-32" aria-label="Tóm tắt đơn hàng">
          <h2 className="font-semibold">Tóm tắt đơn hàng</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-4 text-sm">
                <span>
                  <span className="font-medium">
                    {l.qty} × {l.product.name}
                  </span>
                  <span className="block text-ink-soft">{l.pack.label}</span>
                </span>
                <span className="tabular-nums">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <OrderTotals subtotal={subtotal} delivery={delivery} />
        </aside>
      </div>
    </div>
  )
}

function ErrorText({ id, children }: { id: string; children: string }) {
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-sea-deep">
      {children}
    </p>
  )
}

interface FieldProps {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  error?: string
  type?: string
  autoComplete?: string
}

function Field({ id, label, value, onChange, error, type = 'text', autoComplete }: FieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-1.5 h-11 bg-surface text-base"
      />
      {error && <ErrorText id={`${id}-error`}>{error}</ErrorText>}
    </div>
  )
}
