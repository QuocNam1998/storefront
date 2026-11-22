import { ROAST_NAMES, type RoastLevel } from '@/data/products'

// Bean color at each roast level, light to dark.
const ROAST_SWATCHES = ['#c49a6c', '#a87444', '#82502b', '#5c3519', '#3a2418']

export function RoastScale({ level }: { level: RoastLevel }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-semibold">Roast</span>
        <span>{ROAST_NAMES[level]}</span>
      </div>
      <div className="mt-2 flex gap-1" role="img" aria-label={`Roast level ${level} of 5, ${ROAST_NAMES[level]}`}>
        {ROAST_SWATCHES.map((c, i) => (
          <span
            key={c}
            className="h-3 flex-1 rounded-sm"
            style={{ background: c, opacity: i + 1 === level ? 1 : 0.28, outline: i + 1 === level ? '2px solid var(--roast)' : undefined, outlineOffset: 2 }}
          />
        ))}
      </div>
    </div>
  )
}
