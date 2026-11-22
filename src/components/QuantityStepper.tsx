import { Minus, Plus } from 'lucide-react'
import { MAX_QTY } from '@/store/cart'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  onChange: (qty: number) => void
  min?: number
  label: string
  size?: 'sm' | 'lg'
  /** Full width and green, reading "N trong giỏ": the control a product tile turns into. */
  filled?: boolean
}

export function QuantityStepper({ value, onChange, min = 1, label, size = 'sm', filled = false }: Props) {
  const btn = cn(
    'grid place-items-center transition-colors disabled:opacity-40 disabled:hover:bg-transparent',
    filled ? 'size-10 text-surface hover:bg-sea-deep' : 'text-ink hover:bg-secondary',
    !filled && (size === 'lg' ? 'size-12' : 'size-8'),
  )
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex items-center rounded-lg border',
        filled ? 'h-10 w-full justify-between border-sea bg-sea text-surface' : 'border-input bg-surface',
        !filled && (size === 'lg' ? 'h-12' : 'h-8'),
      )}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Giảm số lượng">
        <Minus className="size-4" />
      </button>
      <span className={cn('text-center font-semibold tabular-nums', size === 'lg' ? 'w-8' : 'min-w-6 text-sm')} aria-live="polite">
        {value}
        {filled && <span className="hidden md:inline"> trong giỏ</span>}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Tăng số lượng">
        <Plus className="size-4" />
      </button>
    </div>
  )
}
