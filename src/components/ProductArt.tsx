import type { Coffee, Gear, Product } from '@/data/products'
import { ROAST_NAMES } from '@/data/products'
import { cn } from '@/lib/utils'

/** Crimped-top, flat-bottom pouch. Coordinates in a 200×280 box. */
const BAG_BODY = 'M16 26 L184 26 L189 262 Q189 272 179 272 L21 272 Q11 272 11 262 Z'
const crimp = Array.from({ length: 21 }, (_, i) => `L${8 + i * 9.2} ${i % 2 ? 4 : 0}`).join(' ')
const BAG_TOP = `M8 0 ${crimp} L192 0 L192 28 L8 28 Z`

export function BagArt({ coffee, sizeLabel = '250 g', className }: { coffee: Coffee; sizeLabel?: string; className?: string }) {
  // Shrink the name so its longest word fits the label width (~54cqw at ~0.47em per condensed glyph).
  const longest = Math.max(...coffee.name.split(' ').map((w) => w.length))
  const nameSize = Math.min(11.5, 54 / (longest * 0.47))
  return (
    <div className={cn('@container relative aspect-[5/7] w-full', className)} role="img" aria-label={`${coffee.name} coffee bag`}>
      <svg viewBox="0 0 200 280" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path d={BAG_BODY} fill={coffee.bagColor} />
        {/* side gussets */}
        <path d="M16 26 L30 26 L28 272 L21 272 Q11 272 11 262 Z" fill="#000" opacity="0.12" />
        <path d="M170 26 L184 26 L189 262 Q189 272 179 272 L172 272 Z" fill="#000" opacity="0.08" />
        <path d={BAG_TOP} fill={coffee.bagColor} />
        <path d={BAG_TOP} fill="#000" opacity="0.18" />
        {/* one-way degassing valve */}
        <circle cx="100" cy="52" r="8" fill="#000" opacity="0.18" />
        <circle cx="100" cy="52" r="4" fill={coffee.bagColor} />
      </svg>
      <div
        className="absolute top-[30%] right-[17%] bottom-[16%] left-[17%] flex flex-col bg-parchment px-[6cqw] py-[5cqw] text-roast"
        style={{ borderRadius: '1.5cqw' }}
      >
        <span className="font-wide text-[4.6cqw] leading-none font-bold">Second Crack</span>
        <span className="font-condensed mt-[4cqw] leading-[0.92] font-extrabold text-balance" style={{ fontSize: `${nameSize}cqw` }}>
          {coffee.name}
        </span>
        <span className="mt-[2.5cqw] text-[5cqw] leading-tight">{coffee.origin}</span>
        <span className="mt-auto flex items-center justify-between gap-[2cqw] text-[4.4cqw] leading-none">
          <span className="flex gap-[1.2cqw]" title={`${ROAST_NAMES[coffee.roast]} roast`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className="block size-[3.2cqw] rounded-full border-[0.6cqw] border-roast"
                style={{ background: n <= coffee.roast ? 'var(--roast)' : 'transparent' }}
              />
            ))}
          </span>
          <span className="font-semibold">{sizeLabel}</span>
        </span>
      </div>
    </div>
  )
}

function GearDrawing({ shape }: { shape: Gear['shape'] }) {
  const stroke = { stroke: 'var(--roast)', strokeWidth: 5, fill: 'none', strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
  switch (shape) {
    case 'dripper':
      return (
        <g>
          <path d="M52 92 L148 92 L118 170 L82 170 Z" {...stroke} fill="var(--parchment)" />
          <path d="M70 186 L130 186" {...stroke} />
          <path d="M82 170 L76 186 M118 170 L124 186" {...stroke} />
          <path d="M148 106 Q172 112 162 140 Q156 150 138 146" {...stroke} />
          <path d="M84 112 L100 160 M116 112 L100 160" {...stroke} strokeWidth={3} opacity={0.5} />
          <ellipse cx="100" cy="92" rx="48" ry="7" fill="var(--cherry)" />
        </g>
      )
    case 'kettle':
      return (
        <g>
          <path d="M60 110 Q60 96 74 96 L126 96 Q140 96 140 110 L146 186 L54 186 Z" {...stroke} fill="var(--parchment)" />
          <path d="M60 150 Q34 150 30 118 Q28 100 16 90" {...stroke} />
          <path d="M140 108 Q172 108 172 140 Q172 168 144 170" {...stroke} />
          <path d="M84 96 L84 86 L116 86 L116 96" {...stroke} />
          <circle cx="100" cy="80" r="6" fill="var(--cherry)" />
          <path d="M54 186 L146 186" {...stroke} />
        </g>
      )
    case 'scale':
      return (
        <g>
          <rect x="30" y="118" width="140" height="56" rx="10" {...stroke} fill="var(--parchment)" />
          <rect x="44" y="104" width="112" height="14" rx="4" {...stroke} />
          <rect x="54" y="134" width="60" height="24" rx="3" fill="var(--roast)" />
          <text x="84" y="152" textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--bean)" style={{ fontFamily: 'inherit' }}>
            18.0
          </text>
          <circle cx="138" cy="146" r="8" fill="var(--cherry)" />
        </g>
      )
    case 'filters':
      return (
        <g>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${44 + i * 10} ${86 + i * 12} L${156 + i * 10} ${86 + i * 12} L${126 + i * 10} ${176 + i * 6} L${74 + i * 10} ${176 + i * 6} Z`}
              {...stroke}
              fill={i === 2 ? 'var(--parchment)' : '#e4e0d0'}
            />
          ))}
          <path d="M118 140 L132 162" stroke="var(--cherry)" strokeWidth={5} strokeLinecap="round" />
        </g>
      )
  }
}

export function GearArt({ gear, className }: { gear: Gear; className?: string }) {
  return (
    <div className={cn('relative aspect-[5/7] w-full', className)} role="img" aria-label={gear.name}>
      <svg viewBox="0 0 200 280" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <rect x="11" y="26" width="178" height="246" rx="10" fill="#c7d0ba" />
        <g transform="translate(0 40)">
          <GearDrawing shape={gear.shape} />
        </g>
      </svg>
    </div>
  )
}

export function ProductArt({ product, sizeLabel, className }: { product: Product; sizeLabel?: string; className?: string }) {
  return product.kind === 'coffee' ? (
    <BagArt coffee={product} sizeLabel={sizeLabel} className={className} />
  ) : (
    <GearArt gear={product} className={className} />
  )
}
