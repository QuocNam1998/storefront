import { Minus, Plus } from 'lucide-react'
import { MAX_QTY } from '@/store/cart'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  onChange: (qty: number) => void
  min?: number
  label: string
  size?: 'sm' | 'lg'
}

export function QuantityStepper({ value, onChange, min = 1, label, size = 'sm' }: Props) {
  const btn = cn(
    'grid place-items-center text-roast transition-colors hover:bg-secondary disabled:opacity-40 disabled:hover:bg-transparent',
    size === 'lg' ? 'size-12' : 'size-8',
  )
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('inline-flex items-center rounded-md border border-input bg-parchment', size === 'lg' ? 'h-12' : 'h-8')}
    >
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus className="size-4" />
      </button>
      <span className={cn('text-center font-semibold tabular-nums', size === 'lg' ? 'w-8' : 'w-6 text-sm')} aria-live="polite">
        {value}
      </span>
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        <Plus className="size-4" />
      </button>
    </div>
  )
}
