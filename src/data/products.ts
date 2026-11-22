export type RoastLevel = 1 | 2 | 3 | 4 | 5 // 1 = lightest, 5 = darkest
export type Process = 'Washed' | 'Natural' | 'Honey' | 'Wet-hulled' | 'Sugarcane decaf'
export type FlavorFamily = 'Floral' | 'Fruity' | 'Caramel' | 'Chocolate' | 'Earthy'

export interface SizeOption {
  id: string
  label: string
  price: number // in cents
}

interface BaseProduct {
  id: string
  slug: string
  name: string
  summary: string
  description: string
  sizes: SizeOption[]
  featured?: boolean
}

export interface Coffee extends BaseProduct {
  kind: 'coffee'
  origin: string
  region: string
  producer: string
  altitude: string
  variety: string
  process: Process
  roast: RoastLevel
  notes: string[]
  flavor: FlavorFamily
  /** Flat color for the bag label, chosen from the cup's flavor. */
  bagColor: string
  /** Text color that reads on bagColor. */
  bagInk: string
}

export type GearShape = 'dripper' | 'kettle' | 'scale' | 'filters'

export interface Gear extends BaseProduct {
  kind: 'gear'
  shape: GearShape
  specs: { label: string; value: string }[]
}

export type Product = Coffee | Gear

const coffeeSizes = (small: number): SizeOption[] => [
  { id: '250g', label: '250 g', price: small },
  { id: '1kg', label: '1 kg', price: Math.round((small * 3.4) / 100) * 100 },
]

export const GRINDS = ['Whole bean', 'Espresso', 'Pour-over', 'French press'] as const
export type Grind = (typeof GRINDS)[number]

export const ROAST_NAMES: Record<RoastLevel, string> = {
  1: 'Light',
  2: 'Light-medium',
  3: 'Medium',
  4: 'Medium-dark',
  5: 'Dark',
}

export const products: Product[] = [
  {
    kind: 'coffee',
    id: 'c-guji',
    slug: 'ethiopia-guji',
    name: 'Guji Highlands',
    origin: 'Ethiopia',
    region: 'Guji Zone, Oromia',
    producer: 'Hambela smallholder cooperative',
    altitude: '1,950–2,200 m',
    variety: 'Ethiopian landraces',
    process: 'Washed',
    roast: 1,
    notes: ['Jasmine', 'Bergamot', 'White peach'],
    flavor: 'Floral',
    bagColor: '#b9a6d9',
    bagInk: '#2b1d45',
    summary: 'Tea-like and floral, with a clean peach finish.',
    description:
      'Grown by hundreds of smallholders and washed at a shared station. We roast it light so the jasmine stays in the cup. Best as pour-over.',
    sizes: coffeeSizes(2100),
    featured: true,
  },
  {
    kind: 'coffee',
    id: 'c-nyeri',
    slug: 'kenya-nyeri',
    name: 'Nyeri Peaberry',
    origin: 'Kenya',
    region: 'Nyeri County',
    producer: 'Gikanda farmers’ society',
    altitude: '1,700–1,900 m',
    variety: 'SL28, SL34',
    process: 'Washed',
    roast: 2,
    notes: ['Blackcurrant', 'Pink grapefruit', 'Cane sugar'],
    flavor: 'Fruity',
    bagColor: '#8e2f4f',
    bagInk: '#fbe9ef',
    summary: 'Bright and juicy, with deep blackcurrant.',
    description:
      'Peaberries are single round beans, sorted out by hand. This lot has the bright acidity Kenya is known for, balanced by a syrupy body.',
    sizes: coffeeSizes(2400),
    featured: true,
  },
  {
    kind: 'coffee',
    id: 'c-huila',
    slug: 'colombia-huila',
    name: 'Huila Tierra Alta',
    origin: 'Colombia',
    region: 'Huila',
    producer: 'Finca La Esperanza',
    altitude: '1,600–1,900 m',
    variety: 'Caturra, Castillo',
    process: 'Washed',
    roast: 3,
    notes: ['Red apple', 'Caramel', 'Cocoa'],
    flavor: 'Caramel',
    bagColor: '#d9902f',
    bagInk: '#3a2108',
    summary: 'Sweet and round. Our everyday coffee.',
    description:
      'An easy, balanced coffee that works any way you brew it. Red apple up front, caramel as it cools.',
    sizes: coffeeSizes(1800),
    featured: true,
  },
  {
    kind: 'coffee',
    id: 'c-huehue',
    slug: 'guatemala-huehuetenango',
    name: 'Huehuetenango',
    origin: 'Guatemala',
    region: 'Huehuetenango',
    producer: 'Finca El Mirador',
    altitude: '1,800 m',
    variety: 'Bourbon',
    process: 'Washed',
    roast: 3,
    notes: ['Milk chocolate', 'Almond', 'Orange zest'],
    flavor: 'Chocolate',
    bagColor: '#6b8f4e',
    bagInk: '#f2f7ec',
    summary: 'Milk chocolate and almond, with a hint of orange.',
    description:
      'Warm winds from Mexico protect these high slopes from frost, so the coffee can grow this high. Good with milk or without.',
    sizes: coffeeSizes(1900),
  },
  {
    kind: 'coffee',
    id: 'c-cerrado',
    slug: 'brazil-cerrado',
    name: 'Cerrado Mineiro',
    origin: 'Brazil',
    region: 'Cerrado, Minas Gerais',
    producer: 'Fazenda Boa Vista',
    altitude: '1,100 m',
    variety: 'Mundo Novo, Catuaí',
    process: 'Natural',
    roast: 4,
    notes: ['Hazelnut', 'Dark chocolate', 'Brown sugar'],
    flavor: 'Chocolate',
    bagColor: '#8a5a3c',
    bagInk: '#fbefe6',
    summary: 'Nutty and heavy-bodied. Made for espresso.',
    description:
      'Dried in the whole cherry on raised beds, which gives it a heavy body and low acidity. It shines as espresso and holds up in milk.',
    sizes: coffeeSizes(1700),
  },
  {
    kind: 'coffee',
    id: 'c-nyamasheke',
    slug: 'rwanda-nyamasheke',
    name: 'Nyamasheke',
    origin: 'Rwanda',
    region: 'Nyamasheke, Lake Kivu',
    producer: 'Kanzu washing station',
    altitude: '1,800–2,000 m',
    variety: 'Red Bourbon',
    process: 'Honey',
    roast: 2,
    notes: ['Red currant', 'Hibiscus', 'Honey'],
    flavor: 'Fruity',
    bagColor: '#c4495a',
    bagInk: '#fff1f2',
    summary: 'Hibiscus and red fruit, with a honeyed body.',
    description:
      'Some of the fruit is left on the bean while it dries. That adds sweetness and body without hiding the hibiscus.',
    sizes: coffeeSizes(2200),
    featured: true,
  },
  {
    kind: 'coffee',
    id: 'c-aceh',
    slug: 'sumatra-aceh',
    name: 'Aceh Gayo',
    origin: 'Indonesia',
    region: 'Gayo Highlands, Aceh, Sumatra',
    producer: 'Gayo highland cooperative',
    altitude: '1,400–1,600 m',
    variety: 'Ateng, Tim Tim',
    process: 'Wet-hulled',
    roast: 5,
    notes: ['Cedar', 'Dark cocoa', 'Clove'],
    flavor: 'Earthy',
    bagColor: '#3f5b4a',
    bagInk: '#e9f2ec',
    summary: 'Earthy and full, with cedar and spice.',
    description:
      'The beans are hulled while still wet, which gives Sumatran coffee its earthy, herbal character. For anyone who likes a dark, heavy cup.',
    sizes: coffeeSizes(1900),
  },
  {
    kind: 'coffee',
    id: 'c-nightshift',
    slug: 'night-shift-espresso',
    name: 'Night Shift',
    origin: 'Brazil and Colombia',
    region: 'Blend',
    producer: 'Fazenda Boa Vista and Finca La Esperanza',
    altitude: '1,100–1,900 m',
    variety: 'Mundo Novo, Caturra',
    process: 'Natural',
    roast: 4,
    notes: ['Cherry cola', 'Dark chocolate', 'Molasses'],
    flavor: 'Chocolate',
    bagColor: '#2f4a7a',
    bagInk: '#eaf0fb',
    summary: 'Our espresso blend. Sweet, dense, forgiving.',
    description:
      'Two parts Brazil for body, one part Colombia for sweetness. It pulls well across a wide range of grind settings.',
    sizes: coffeeSizes(1800),
  },
  {
    kind: 'coffee',
    id: 'c-decaf',
    slug: 'colombia-decaf',
    name: 'Decaf Caña',
    origin: 'Colombia',
    region: 'Caldas',
    producer: 'Descafecol',
    altitude: '1,500–1,800 m',
    variety: 'Castillo',
    process: 'Sugarcane decaf',
    roast: 3,
    notes: ['Toffee', 'Red grape', 'Malt'],
    flavor: 'Caramel',
    bagColor: '#9aa9b8',
    bagInk: '#1e2833',
    summary: 'Decaf that tastes like coffee. Toffee and red grape.',
    description:
      'The caffeine is removed with a solvent made from fermented sugarcane, which keeps the coffee’s sweetness. 99.9% caffeine-free.',
    sizes: coffeeSizes(1900),
  },
  {
    kind: 'gear',
    id: 'g-dripper',
    slug: 'ceramic-dripper',
    shape: 'dripper',
    name: 'Ceramic dripper',
    summary: 'A cone dripper that holds heat for an even pour-over.',
    description:
      'Thick porcelain keeps the brew temperature steady. Fits size 02 filters and brews one to four cups.',
    specs: [
      { label: 'Material', value: 'Porcelain' },
      { label: 'Filter size', value: '02' },
      { label: 'Brews', value: '1–4 cups' },
    ],
    sizes: [{ id: 'one', label: 'One size', price: 2800 }],
    featured: true,
  },
  {
    kind: 'gear',
    id: 'g-kettle',
    slug: 'gooseneck-kettle',
    shape: 'kettle',
    name: 'Gooseneck kettle',
    summary: 'A long, thin spout for slow, precise pouring.',
    description:
      'Stainless steel, 0.9 L, works on gas, electric and induction. The narrow spout lets you control exactly where the water lands.',
    specs: [
      { label: 'Capacity', value: '0.9 L' },
      { label: 'Material', value: 'Stainless steel' },
      { label: 'Hob', value: 'Gas, electric, induction' },
    ],
    sizes: [{ id: 'one', label: 'One size', price: 6500 }],
    featured: true,
  },
  {
    kind: 'gear',
    id: 'g-scale',
    slug: 'brew-scale',
    shape: 'scale',
    name: 'Brew scale',
    summary: 'Weighs to 0.1 g with a built-in timer.',
    description:
      'Weigh your coffee and water, and time the brew on one display. Charges over USB-C and lasts about a month per charge.',
    specs: [
      { label: 'Accuracy', value: '0.1 g' },
      { label: 'Max weight', value: '2 kg' },
      { label: 'Power', value: 'USB-C, rechargeable' },
    ],
    sizes: [{ id: 'one', label: 'One size', price: 4800 }],
    featured: true,
  },
  {
    kind: 'gear',
    id: 'g-filters',
    slug: 'paper-filters',
    shape: 'filters',
    name: 'Paper filters',
    summary: 'Unbleached size 02 filters, pack of 100.',
    description:
      'Rinse once with hot water before brewing to remove any paper taste. Fits our ceramic dripper.',
    specs: [
      { label: 'Size', value: '02' },
      { label: 'Count', value: '100' },
      { label: 'Paper', value: 'Unbleached' },
    ],
    sizes: [{ id: 'one', label: 'Pack of 100', price: 800 }],
  },
]

export const coffees = products.filter((p): p is Coffee => p.kind === 'coffee')
export const gear = products.filter((p): p is Gear => p.kind === 'gear')

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}
