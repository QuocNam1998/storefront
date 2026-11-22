import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { newOrderId, saveOrder, type Order } from '@/lib/orders'
import { SHIPPING_METHODS, formatPrice, nextRoastDate, shippingCost, type ShippingMethodId } from '@/lib/store'
import { useCart } from '@/store/cart'
import { cn } from '@/lib/utils'

const COUNTRIES = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'Vietnam']

type FieldName = 'email' | 'name' | 'address' | 'city' | 'region' | 'postalCode'
type Form = Record<FieldName, string> & { address2: string; country: string }

const EMPTY: Form = { email: '', name: '', address: '', address2: '', city: '', region: '', postalCode: '', country: 'United States' }

function validate(f: Form): Partial<Record<FieldName, string>> {
  const e: Partial<Record<FieldName, string>> = {}
  if (!f.email.trim()) e.email = 'Enter your email address.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter an email address like name@example.com.'
  if (!f.name.trim()) e.name = 'Enter the name for the delivery.'
  if (!f.address.trim()) e.address = 'Enter a street address.'
  if (!f.city.trim()) e.city = 'Enter a city.'
  if (!f.region.trim()) e.region = 'Enter a state or region.'
  if (!f.postalCode.trim()) e.postalCode = 'Enter a postal code.'
  return e
}

export function Checkout() {
  const { lines, subtotal, clear } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState<Form>(EMPTY)
  const [method, setMethod] = useState<ShippingMethodId>('standard')
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const shipping = shippingCost(method, subtotal)
  const total = subtotal + shipping

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <h1 className="font-wide text-4xl font-black tracking-tight sm:text-5xl">Checkout</h1>
        <p className="mt-6 text-lg">Your cart is empty, so there’s nothing to check out yet.</p>
        <Button asChild size="xl" className="mt-4">
          <Link to="/shop?type=coffee">Browse coffees</Link>
        </Button>
      </div>
    )
  }

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
      formRef.current?.querySelector<HTMLInputElement>(`#${first}`)?.focus()
      return
    }
    const order: Order = {
      id: newOrderId(),
      createdAt: new Date().toISOString(),
      roastDate: nextRoastDate().toISOString(),
      email: form.email.trim(),
      shipTo: {
        name: form.name.trim(),
        address: [form.address.trim(), form.address2.trim()].filter(Boolean).join(', '),
        city: form.city.trim(),
        region: form.region.trim(),
        postalCode: form.postalCode.trim(),
        country: form.country,
      },
      shippingMethod: method,
      lines: lines.map((l) => ({
        name: l.product.name,
        slug: l.product.slug,
        detail: [l.product.kind === 'coffee' ? l.size.label : null, l.grind].filter(Boolean).join(', '),
        qty: l.qty,
        lineTotal: l.lineTotal,
      })),
      subtotal,
      shipping,
      total,
    }
    saveOrder(order)
    clear()
    navigate(`/order/${order.id}`, { replace: true })
  }

  const errorCount = Object.keys(errors).length

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <h1 className="font-wide text-4xl font-black tracking-tight sm:text-5xl">Checkout</h1>

      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_360px]">
        <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-10">
          {submitted && errorCount > 0 && (
            <div role="alert" className="rounded-md border-2 border-cherry bg-parchment p-4">
              <p className="font-semibold text-cherry-deep">
                {errorCount === 1 ? '1 field needs' : `${errorCount} fields need`} attention before you can place the order.
              </p>
            </div>
          )}

          <fieldset className="space-y-4">
            <legend className="font-wide mb-4 text-xl font-extrabold">Contact</legend>
            <Field id="email" label="Email" type="email" autoComplete="email" value={form.email} onChange={set('email')} error={errors.email} />
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-wide mb-4 text-xl font-extrabold">Delivery address</legend>
            <Field id="name" label="Full name" autoComplete="name" value={form.name} onChange={set('name')} error={errors.name} />
            <Field id="address" label="Street address" autoComplete="address-line1" value={form.address} onChange={set('address')} error={errors.address} />
            <Field id="address2" label="Apartment, suite, etc. (optional)" autoComplete="address-line2" value={form.address2} onChange={set('address2')} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="city" label="City" autoComplete="address-level2" value={form.city} onChange={set('city')} error={errors.city} />
              <Field id="region" label="State or region" autoComplete="address-level1" value={form.region} onChange={set('region')} error={errors.region} />
              <Field id="postalCode" label="Postal code" autoComplete="postal-code" value={form.postalCode} onChange={set('postalCode')} error={errors.postalCode} />
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={form.country} onValueChange={set('country')}>
                  <SelectTrigger id="country" className="mt-1.5 w-full bg-parchment text-base data-[size=default]:h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-wide mb-4 text-xl font-extrabold">Shipping</legend>
            <RadioGroup value={method} onValueChange={(v) => setMethod(v as ShippingMethodId)} className="gap-3">
              {SHIPPING_METHODS.map((m) => {
                const cost = shippingCost(m.id, subtotal)
                return (
                  <Label
                    key={m.id}
                    htmlFor={`ship-${m.id}`}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 rounded-md border-2 bg-parchment p-4 font-normal',
                      method === m.id ? 'border-roast' : 'border-transparent',
                    )}
                  >
                    <RadioGroupItem id={`ship-${m.id}`} value={m.id} />
                    <span className="flex-1">
                      <span className="block font-semibold">{m.label}</span>
                      <span className="block text-sm text-muted-foreground">{m.detail}</span>
                    </span>
                    <span className="font-semibold tabular-nums">{cost === 0 ? 'Free' : formatPrice(cost)}</span>
                  </Label>
                )
              })}
            </RadioGroup>
          </fieldset>

          <fieldset>
            <legend className="font-wide mb-4 text-xl font-extrabold">Payment</legend>
            <p className="rounded-md bg-parchment p-4">
              This is a demo store, so no payment is taken. Placing the order saves it in this browser only.
            </p>
          </fieldset>

          <Button type="submit" size="xl" className="w-full sm:w-auto sm:min-w-72">
            Place order, {formatPrice(total)}
          </Button>
        </form>

        <aside className="self-start rounded-md bg-parchment p-6 md:sticky md:top-24" aria-label="Order summary">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {lines.map((l) => (
              <li key={l.key} className="flex justify-between gap-4 text-sm">
                <span>
                  <span className="font-medium">{l.qty} × {l.product.name}</span>
                  {l.product.kind === 'coffee' && (
                    <span className="block text-muted-foreground">{l.size.label}, {l.grind}</span>
                  )}
                </span>
                <span className="tabular-nums">{formatPrice(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-6 space-y-2 border-t border-border pt-4">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd className="tabular-nums">{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="flex justify-between border-t border-border pt-2 text-lg font-bold"><dt>Total</dt><dd className="tabular-nums">{formatPrice(total)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
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
        className="mt-1.5 h-11 bg-parchment text-base"
      />
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm font-medium text-cherry-deep">
          {error}
        </p>
      )}
    </div>
  )
}
