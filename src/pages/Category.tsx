import { useParams, useSearchParams } from 'react-router-dom'
import { ProductGrid } from '@/components/ProductGrid'
import { CategoryIconRow } from '@/components/SiteChrome'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { getCategoryBySlug, productsInCategory, type Product } from '@/data/catalog'
import { unitPrice } from '@/lib/store'
import { NotFound } from '@/pages/NotFound'

type Compare = (a: Product, b: Product) => number

// The catalog lists products in popularity order, so the default sort keeps that order.
const SORTS: { id: string; label: string; compare?: Compare }[] = [
  { id: 'popular', label: 'Phổ biến' },
  { id: 'price-asc', label: 'Giá thấp đến cao', compare: (a, b) => a.packs[0].price - b.packs[0].price },
  { id: 'price-desc', label: 'Giá cao đến thấp', compare: (a, b) => b.packs[0].price - a.packs[0].price },
  { id: 'unit-asc', label: 'Đơn giá thấp đến cao', compare: (a, b) => unitPrice(a.packs[0]) - unitPrice(b.packs[0]) },
]

function readList(params: URLSearchParams, key: string): string[] {
  return params.get(key)?.split(',').filter(Boolean) ?? []
}

function sortProducts(list: Product[], sortId: string): Product[] {
  const compare = SORTS.find((s) => s.id === sortId)?.compare
  return compare ? [...list].sort(compare) : list
}

function filterProducts(list: Product[], subs: string[], inStockOnly: boolean): Product[] {
  return list.filter((p) => (subs.length === 0 || subs.includes(p.subcategoryId)) && (!inStockOnly || p.stock !== 'out'))
}

export function Category() {
  const { slug = '' } = useParams()
  const [params, setParams] = useSearchParams()
  const category = getCategoryBySlug(slug)
  if (!category) return <NotFound />

  const subs = readList(params, 'sub')
  const inStockOnly = params.get('stock') === 'in'
  const sort = SORTS.find((s) => s.id === params.get('sort'))?.id ?? 'popular'
  const results = sortProducts(filterProducts(productsInCategory(category.id), subs, inStockOnly), sort)

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === '') next.delete(k)
      else next.set(k, v)
    }
    setParams(next, { replace: true })
  }

  return (
    <div>
      <CategoryIconRow />
      <h1 className="text-3xl font-semibold sm:text-4xl">{category.name}</h1>

      <div className="mt-6 space-y-4 border-b border-line pb-4">
        <ToggleGroup
          type="multiple"
          value={subs}
          onValueChange={(v) => update({ sub: v.join(',') })}
          aria-label="Loại sản phẩm"
          variant="outline"
          spacing={2}
          className="flex-wrap justify-start"
        >
          {category.subcategories.map((s) => (
            <ToggleGroupItem key={s.id} value={s.id} className="bg-surface px-3 data-[state=on]:border-sea data-[state=on]:text-sea-deep">
              {s.name}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <FilterCheckbox id="in-stock" label="Chỉ hiện hàng còn" checked={inStockOnly} onChange={(on) => update({ stock: on ? 'in' : null })} />
          <div className="flex items-center gap-2 sm:ml-auto">
            <Label htmlFor="sort" className="text-sm text-ink-soft">
              Sắp xếp
            </Label>
            <Select value={sort} onValueChange={(v) => update({ sort: v === 'popular' ? null : v })}>
              <SelectTrigger id="sort" className="w-52 bg-surface">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORTS.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <section aria-live="polite" aria-label="Kết quả" className="mt-4">
        <p className="text-sm text-ink-soft">{results.length} sản phẩm</p>
        {results.length === 0 ? (
          <div className="mt-6 max-w-md">
            <p className="text-lg">Không có sản phẩm nào phù hợp với bộ lọc này.</p>
            <Button className="mt-4" size="lg" onClick={() => update({ sub: null, stock: null })}>
              Xoá bộ lọc
            </Button>
          </div>
        ) : (
          <ProductGrid products={results} />
        )}
      </section>
    </div>
  )
}

function FilterCheckbox({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="size-5 border-input bg-surface" />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  )
}
