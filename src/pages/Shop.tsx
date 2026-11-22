import { SlidersHorizontal } from 'lucide-react'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ProductTile } from '@/components/ProductTile'
import { products, ROAST_NAMES, type FlavorFamily, type Process, type Product, type RoastLevel } from '@/data/products'

type ShopType = 'all' | 'coffee' | 'gear'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price, low to high' },
  { id: 'price-desc', label: 'Price, high to low' },
  { id: 'name', label: 'Name, A to Z' },
] as const
type SortId = (typeof SORTS)[number]['id']

const FLAVORS: FlavorFamily[] = ['Floral', 'Fruity', 'Caramel', 'Chocolate', 'Earthy']
const PROCESSES: Process[] = ['Washed', 'Natural', 'Honey', 'Wet-hulled', 'Sugarcane decaf']
const ROASTS: RoastLevel[] = [1, 2, 3, 4, 5]

const HEADINGS: Record<ShopType, string> = { all: 'Everything', coffee: 'Coffee', gear: 'Brewing gear' }

function readList(params: URLSearchParams, key: string): string[] {
  return params.get(key)?.split(',').filter(Boolean) ?? []
}

function sortProducts(list: Product[], sort: SortId): Product[] {
  const copy = [...list]
  switch (sort) {
    case 'price-asc':
      return copy.sort((a, b) => a.sizes[0].price - b.sizes[0].price)
    case 'price-desc':
      return copy.sort((a, b) => b.sizes[0].price - a.sizes[0].price)
    case 'name':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return copy.sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  }
}

export function Shop() {
  const [params, setParams] = useSearchParams()
  const typeParam = params.get('type')
  const type: ShopType = typeParam === 'coffee' || typeParam === 'gear' ? typeParam : 'all'
  const sortParam = params.get('sort') as SortId | null
  const sort: SortId = SORTS.some((s) => s.id === sortParam) ? sortParam! : 'featured'
  const roasts = readList(params, 'roast')
  const flavors = readList(params, 'flavor')
  const processes = readList(params, 'process')
  const coffeeFiltersActive = roasts.length + flavors.length + processes.length
  const showCoffeeFilters = type !== 'gear'

  const update = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(changes)) {
      if (v === null || v === '') next.delete(k)
      else next.set(k, v)
    }
    setParams(next, { replace: true })
  }

  const toggleIn = (key: string, current: string[], value: string, on: boolean) => {
    const set = new Set(current)
    if (on) set.add(value)
    else set.delete(value)
    update({ [key]: [...set].join(',') })
  }

  const clearFilters = () => update({ roast: null, flavor: null, process: null })

  const results = useMemo(() => {
    const filtered = products.filter((p) => {
      if (type !== 'all' && p.kind !== type) return false
      if (p.kind === 'gear') return coffeeFiltersActive === 0 || type === 'gear'
      if (roasts.length && !roasts.includes(String(p.roast))) return false
      if (flavors.length && !flavors.includes(p.flavor)) return false
      if (processes.length && !processes.includes(p.process)) return false
      return true
    })
    return sortProducts(filtered, sort)
  }, [type, sort, roasts, flavors, processes, coffeeFiltersActive])

  const noun = type === 'coffee' ? (results.length === 1 ? 'coffee' : 'coffees') : results.length === 1 ? 'item' : 'items'

  const renderFilters = (prefix: string) => (
    <div className="space-y-8">
      <FilterGroup title="Roast">
        {ROASTS.map((r) => (
          <FilterCheckbox
            key={r}
            id={`${prefix}-roast-${r}`}
            label={ROAST_NAMES[r]}
            checked={roasts.includes(String(r))}
            onChange={(on) => toggleIn('roast', roasts, String(r), on)}
          />
        ))}
      </FilterGroup>
      <FilterGroup title="Flavor">
        {FLAVORS.map((f) => (
          <FilterCheckbox key={f} id={`${prefix}-flavor-${f}`} label={f} checked={flavors.includes(f)} onChange={(on) => toggleIn('flavor', flavors, f, on)} />
        ))}
      </FilterGroup>
      <FilterGroup title="Process">
        {PROCESSES.map((p) => (
          <FilterCheckbox key={p} id={`${prefix}-process-${p}`} label={p} checked={processes.includes(p)} onChange={(on) => toggleIn('process', processes, p, on)} />
        ))}
      </FilterGroup>
      {coffeeFiltersActive > 0 && (
        <Button variant="outline" onClick={clearFilters} className="border-roast bg-transparent">
          Clear filters
        </Button>
      )}
    </div>
  )

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
      <h1 className="font-wide text-4xl font-black tracking-tight sm:text-5xl">{HEADINGS[type]}</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-b border-border pb-4">
        <ToggleGroup
          type="single"
          value={type}
          onValueChange={(v) => v && update({ type: v === 'all' ? null : v, ...(v === 'gear' ? { roast: null, flavor: null, process: null } : {}) })}
          aria-label="Product type"
          variant="outline"
          spacing={0}
          className="bg-parchment"
        >
          <ToggleGroupItem value="all" className="px-4">All</ToggleGroupItem>
          <ToggleGroupItem value="coffee" className="px-4">Coffee</ToggleGroupItem>
          <ToggleGroupItem value="gear" className="px-4">Gear</ToggleGroupItem>
        </ToggleGroup>

        {showCoffeeFilters && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="bg-parchment md:hidden">
                <SlidersHorizontal aria-hidden="true" />
                Filters{coffeeFiltersActive > 0 && ` (${coffeeFiltersActive})`}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="overflow-y-auto bg-bean">
              <SheetHeader>
                <SheetTitle className="font-wide text-xl font-extrabold">Filter coffees</SheetTitle>
                <SheetDescription>Results update as you choose.</SheetDescription>
              </SheetHeader>
              <div className="px-4 pb-8">{renderFilters('sheet')}</div>
            </SheetContent>
          </Sheet>
        )}

        <div className="ml-auto flex items-center gap-2">
          <Label htmlFor="sort" className="text-sm text-muted-foreground">
            Sort
          </Label>
          <Select value={sort} onValueChange={(v) => update({ sort: v === 'featured' ? null : v })}>
            <SelectTrigger id="sort" className="w-48 bg-parchment">
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

      <div className={showCoffeeFilters ? 'mt-8 grid gap-10 md:grid-cols-[200px_1fr]' : 'mt-8'}>
        {showCoffeeFilters && (
          <aside className="hidden md:block" aria-label="Filters">
            {renderFilters('side')}
          </aside>
        )}

        <section aria-live="polite" aria-label="Results">
          <p className="text-sm text-muted-foreground">
            {results.length} {noun}
          </p>
          {results.length === 0 ? (
            <div className="mt-6 max-w-md">
              <p className="text-lg">No coffees match all of these filters.</p>
              <p className="mt-1 text-muted-foreground">Remove a filter to see more.</p>
              <Button className="mt-4" size="lg" onClick={clearFilters}>
                Clear filters
              </Button>
            </div>
          ) : (
            <div className={`mt-4 grid grid-cols-2 gap-x-5 gap-y-10 ${showCoffeeFilters ? 'lg:grid-cols-3' : 'md:grid-cols-4'}`}>
              {results.map((p) => (
                <ProductTile key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="font-semibold">{title}</legend>
      <div className="mt-3 space-y-2.5">{children}</div>
    </fieldset>
  )
}

function FilterCheckbox({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (on: boolean) => void }) {
  return (
    <div className="flex items-center gap-2.5">
      <Checkbox id={id} checked={checked} onCheckedChange={(v) => onChange(v === true)} className="size-5 border-input bg-parchment" />
      <Label htmlFor={id} className="font-normal">
        {label}
      </Label>
    </div>
  )
}
