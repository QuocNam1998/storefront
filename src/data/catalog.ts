import {
  Candy,
  Cookie,
  CupSoda,
  Droplet,
  Leaf,
  Milk,
  Nut,
  Popcorn,
  Scroll,
  ShowerHead,
  SprayCan,
  Wheat,
  type LucideIcon,
} from 'lucide-react'

export type CategoryId = 'snacks' | 'drinks' | 'essentials'
export type Unit = 'g' | 'ml' | 'item'
export type StockLevel = 'in' | 'low' | 'out'

export const STOCK_TEXT: Record<StockLevel, string | null> = { in: null, low: 'Sắp hết hàng', out: 'Hết hàng' }

export interface Subcategory {
  id: string
  name: string
  icon: LucideIcon
}

export interface Category {
  id: CategoryId
  slug: string
  name: string
  /** Full Tailwind class names, written out so Tailwind finds them. */
  tint: string
  iconColor: string
  subcategories: Subcategory[]
}

export interface Pack {
  id: string
  label: string
  price: number // whole đồng
  wasPrice?: number // set only while the pack is on a deal
  amount: number // total, in `unit`
  unit: Unit
  itemLabel?: string // what one item is called, for unit = 'item'
}

export interface Product {
  id: string
  slug: string
  name: string
  categoryId: CategoryId
  subcategoryId: string
  description: string
  packs: Pack[]
  stock: StockLevel
  image?: string
}

export const categories: Category[] = [
  {
    id: 'snacks',
    slug: 'do-an-vat',
    name: 'Đồ ăn vặt',
    tint: 'bg-tint-snacks',
    iconColor: 'text-icon-snacks',
    subcategories: [
      { id: 'snack-khoai-tay', name: 'Snack & khoai tây chiên', icon: Popcorn },
      { id: 'banh-quy-banh-gao', name: 'Bánh quy & bánh gạo', icon: Cookie },
      { id: 'hat-trai-cay-say', name: 'Hạt & trái cây sấy', icon: Nut },
      { id: 'keo', name: 'Kẹo', icon: Candy },
    ],
  },
  {
    id: 'drinks',
    slug: 'nuoc-uong',
    name: 'Nước uống',
    tint: 'bg-tint-drinks',
    iconColor: 'text-icon-drinks',
    subcategories: [
      { id: 'nuoc-suoi', name: 'Nước suối', icon: Droplet },
      { id: 'nuoc-co-ga', name: 'Nước có ga', icon: CupSoda },
      { id: 'nuoc-ep-sua', name: 'Nước ép & sữa', icon: Milk },
      { id: 'tra', name: 'Trà', icon: Leaf },
    ],
  },
  {
    id: 'essentials',
    slug: 'nhu-yeu-pham',
    name: 'Nhu yếu phẩm',
    tint: 'bg-tint-essentials',
    iconColor: 'text-icon-essentials',
    subcategories: [
      { id: 'giay-khan-giay', name: 'Giấy & khăn giấy', icon: Scroll },
      { id: 've-sinh-nha-cua', name: 'Vệ sinh nhà cửa', icon: SprayCan },
      { id: 'cham-soc-ca-nhan', name: 'Chăm sóc cá nhân', icon: ShowerHead },
      { id: 'gao-gia-vi', name: 'Gạo & gia vị', icon: Wheat },
    ],
  },
]

// Listed in popularity order, which is the default sort.
export const products: Product[] = [
  {
    id: 'p01',
    slug: 'khoai-tay-chien-vi-tao-bien',
    name: 'Khoai tây chiên vị tảo biển',
    categoryId: 'snacks',
    subcategoryId: 'snack-khoai-tay',
    description: 'Lát khoai tây mỏng, chiên giòn, rắc tảo biển thơm nhẹ.',
    packs: [
      { id: 'goi-52g', label: 'Gói 52 g', price: 12000, amount: 52, unit: 'g' },
      { id: 'loc-5-goi', label: 'Lốc 5 gói', price: 55000, amount: 260, unit: 'g' },
    ],
    stock: 'in',
  },
  {
    id: 'p02',
    slug: 'snack-rong-bien-say-gion',
    name: 'Snack rong biển sấy giòn',
    categoryId: 'snacks',
    subcategoryId: 'snack-khoai-tay',
    description: 'Rong biển sấy giòn, vị mặn nhẹ, gói nhỏ tiện mang theo.',
    packs: [{ id: 'loc-3-goi', label: 'Lốc 3 gói × 5 g', price: 25000, amount: 15, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p03',
    slug: 'banh-quy-bo',
    name: 'Bánh quy bơ',
    categoryId: 'snacks',
    subcategoryId: 'banh-quy-banh-gao',
    description: 'Bánh quy bơ giòn xốp trong hộp thiếc, hợp làm quà.',
    packs: [{ id: 'hop-454g', label: 'Hộp 454 g', price: 89000, amount: 454, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p04',
    slug: 'banh-gao-nuong-vi-ngot',
    name: 'Bánh gạo nướng vị ngọt',
    categoryId: 'snacks',
    subcategoryId: 'banh-quy-banh-gao',
    description: 'Bánh gạo nướng giòn, phủ lớp đường mỏng.',
    packs: [{ id: 'goi-150g', label: 'Gói 150 g', price: 28000, amount: 150, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p05',
    slug: 'hat-dieu-rang-muoi',
    name: 'Hạt điều rang muối',
    categoryId: 'snacks',
    subcategoryId: 'hat-trai-cay-say',
    description: 'Hạt điều Bình Phước rang muối, còn vỏ lụa, đựng trong hũ kín.',
    packs: [
      { id: 'hu-250g', label: 'Hũ 250 g', price: 115000, wasPrice: 135000, amount: 250, unit: 'g' },
      { id: 'hu-500g', label: 'Hũ 500 g', price: 220000, amount: 500, unit: 'g' },
    ],
    stock: 'in',
  },
  {
    id: 'p06',
    slug: 'dau-phong-da-ca',
    name: 'Đậu phộng da cá',
    categoryId: 'snacks',
    subcategoryId: 'hat-trai-cay-say',
    description: 'Đậu phộng bọc bột giòn, vị béo, ăn kèm nước ngọt rất hợp.',
    packs: [{ id: 'goi-200g', label: 'Gói 200 g', price: 32000, amount: 200, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p07',
    slug: 'mit-say-gion',
    name: 'Mít sấy giòn',
    categoryId: 'snacks',
    subcategoryId: 'hat-trai-cay-say',
    description: 'Mít chín sấy giòn, giữ vị ngọt tự nhiên, không thêm đường.',
    packs: [{ id: 'goi-100g', label: 'Gói 100 g', price: 35000, amount: 100, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p08',
    slug: 'keo-deo-trai-cay',
    name: 'Kẹo dẻo trái cây',
    categoryId: 'snacks',
    subcategoryId: 'keo',
    description: 'Kẹo dẻo nhiều vị trái cây, mềm và thơm.',
    packs: [{ id: 'goi-100g', label: 'Gói 100 g', price: 18000, amount: 100, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p09',
    slug: 'nuoc-suoi-tinh-khiet',
    name: 'Nước suối tinh khiết',
    categoryId: 'drinks',
    subcategoryId: 'nuoc-suoi',
    description: 'Nước uống tinh khiết đóng chai, lọc nhiều lớp.',
    packs: [
      { id: 'chai-500ml', label: 'Chai 500 ml', price: 5000, amount: 500, unit: 'ml' },
      { id: 'loc-6-chai', label: 'Lốc 6 chai', price: 28000, amount: 3000, unit: 'ml' },
      { id: 'thung-24-chai', label: 'Thùng 24 chai', price: 99000, wasPrice: 115000, amount: 12000, unit: 'ml' },
    ],
    stock: 'in',
  },
  {
    id: 'p10',
    slug: 'nuoc-khoang-thien-nhien',
    name: 'Nước khoáng thiên nhiên',
    categoryId: 'drinks',
    subcategoryId: 'nuoc-suoi',
    description: 'Nước khoáng từ nguồn suối tự nhiên, vị thanh nhẹ.',
    packs: [
      { id: 'chai-1-5l', label: 'Chai 1,5 L', price: 12000, amount: 1500, unit: 'ml' },
      { id: 'loc-6-chai', label: 'Lốc 6 chai', price: 68000, amount: 9000, unit: 'ml' },
    ],
    stock: 'in',
  },
  {
    id: 'p11',
    slug: 'nuoc-khoang-co-ga',
    name: 'Nước khoáng có ga',
    categoryId: 'drinks',
    subcategoryId: 'nuoc-co-ga',
    description: 'Nước khoáng có ga tự nhiên, uống lạnh rất sảng khoái.',
    packs: [
      { id: 'lon-330ml', label: 'Lon 330 ml', price: 15000, amount: 330, unit: 'ml' },
      { id: 'loc-6-lon', label: 'Lốc 6 lon', price: 85000, amount: 1980, unit: 'ml' },
    ],
    stock: 'in',
  },
  {
    id: 'p12',
    slug: 'soda-chanh',
    name: 'Soda chanh',
    categoryId: 'drinks',
    subcategoryId: 'nuoc-co-ga',
    description: 'Soda vị chanh tươi, ít ngọt.',
    packs: [
      { id: 'lon-330ml', label: 'Lon 330 ml', price: 10000, amount: 330, unit: 'ml' },
      { id: 'loc-6-lon', label: 'Lốc 6 lon', price: 56000, amount: 1980, unit: 'ml' },
    ],
    stock: 'in',
  },
  {
    id: 'p13',
    slug: 'nuoc-ep-cam',
    name: 'Nước ép cam',
    categoryId: 'drinks',
    subcategoryId: 'nuoc-ep-sua',
    description: 'Nước cam ép nguyên chất, không thêm đường. Bảo quản lạnh.',
    packs: [{ id: 'chai-1l', label: 'Chai 1 L', price: 45000, amount: 1000, unit: 'ml' }],
    stock: 'in',
  },
  {
    id: 'p14',
    slug: 'sua-dau-nanh',
    name: 'Sữa đậu nành',
    categoryId: 'drinks',
    subcategoryId: 'nuoc-ep-sua',
    description: 'Sữa đậu nành nguyên chất, hộp nhỏ cho bữa sáng.',
    packs: [{ id: 'loc-4-hop', label: 'Lốc 4 hộp × 200 ml', price: 22000, amount: 800, unit: 'ml' }],
    stock: 'in',
  },
  {
    id: 'p15',
    slug: 'tra-xanh-khong-duong',
    name: 'Trà xanh không đường',
    categoryId: 'drinks',
    subcategoryId: 'tra',
    description: 'Trà xanh pha sẵn, không đường, vị chát nhẹ.',
    packs: [
      { id: 'chai-450ml', label: 'Chai 450 ml', price: 10000, amount: 450, unit: 'ml' },
      { id: 'thung-24-chai', label: 'Thùng 24 chai', price: 220000, amount: 10800, unit: 'ml' },
    ],
    stock: 'in',
  },
  {
    id: 'p16',
    slug: 'nuoc-dua-dong-hop',
    name: 'Nước dừa đóng hộp',
    categoryId: 'drinks',
    subcategoryId: 'nuoc-ep-sua',
    description: 'Nước dừa xiêm Bến Tre, ngọt mát tự nhiên.',
    packs: [{ id: 'hop-330ml', label: 'Hộp 330 ml', price: 18000, amount: 330, unit: 'ml' }],
    stock: 'low',
  },
  {
    id: 'p17',
    slug: 'giay-ve-sinh-3-lop',
    name: 'Giấy vệ sinh 3 lớp',
    categoryId: 'essentials',
    subcategoryId: 'giay-khan-giay',
    description: 'Giấy vệ sinh 3 lớp mềm, dai, không mùi.',
    packs: [{ id: 'loc-10-cuon', label: 'Lốc 10 cuộn', price: 79000, amount: 10, unit: 'item', itemLabel: 'cuộn' }],
    stock: 'in',
  },
  {
    id: 'p18',
    slug: 'khan-giay-rut',
    name: 'Khăn giấy rút',
    categoryId: 'essentials',
    subcategoryId: 'giay-khan-giay',
    description: 'Khăn giấy rút 2 lớp, mỗi gói 180 tờ.',
    packs: [{ id: 'loc-3-goi', label: 'Lốc 3 gói × 180 tờ', price: 45000, amount: 3, unit: 'item', itemLabel: 'gói' }],
    stock: 'in',
  },
  {
    id: 'p19',
    slug: 'nuoc-rua-chen-huong-chanh',
    name: 'Nước rửa chén hương chanh',
    categoryId: 'essentials',
    subcategoryId: 've-sinh-nha-cua',
    description: 'Nước rửa chén sạch dầu mỡ, hương chanh dễ chịu.',
    packs: [{ id: 'chai-750g', label: 'Chai 750 g', price: 32000, amount: 750, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p20',
    slug: 'nuoc-giat',
    name: 'Nước giặt',
    categoryId: 'essentials',
    subcategoryId: 've-sinh-nha-cua',
    description: 'Nước giặt đậm đặc, dùng cho cả máy giặt và giặt tay.',
    packs: [{ id: 'tui-3-6kg', label: 'Túi 3,6 kg', price: 185000, wasPrice: 215000, amount: 3600, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p21',
    slug: 'kem-danh-rang',
    name: 'Kem đánh răng',
    categoryId: 'essentials',
    subcategoryId: 'cham-soc-ca-nhan',
    description: 'Kem đánh răng hương bạc hà, giúp hơi thở thơm mát.',
    packs: [{ id: 'tuyp-180g', label: 'Tuýp 180 g', price: 38000, amount: 180, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p22',
    slug: 'dau-goi',
    name: 'Dầu gội',
    categoryId: 'essentials',
    subcategoryId: 'cham-soc-ca-nhan',
    description: 'Dầu gội dịu nhẹ cho mọi loại tóc, dùng hằng ngày.',
    packs: [{ id: 'chai-650ml', label: 'Chai 650 ml', price: 129000, amount: 650, unit: 'ml' }],
    stock: 'out',
  },
  {
    id: 'p23',
    slug: 'gao-st25',
    name: 'Gạo ST25',
    categoryId: 'essentials',
    subcategoryId: 'gao-gia-vi',
    description: 'Gạo ST25 Sóc Trăng, hạt dài, cơm dẻo và thơm.',
    packs: [{ id: 'tui-5kg', label: 'Túi 5 kg', price: 185000, amount: 5000, unit: 'g' }],
    stock: 'in',
  },
  {
    id: 'p24',
    slug: 'nuoc-mam',
    name: 'Nước mắm',
    categoryId: 'essentials',
    subcategoryId: 'gao-gia-vi',
    description: 'Nước mắm cá cơm truyền thống, độ đạm cao.',
    packs: [{ id: 'chai-500ml', label: 'Chai 500 ml', price: 55000, amount: 500, unit: 'ml' }],
    stock: 'in',
  },
]

export const dealProducts = products.filter((p) => p.packs.some((pack) => pack.wasPrice))

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

export function productsInCategory(categoryId: CategoryId): Product[] {
  return products.filter((p) => p.categoryId === categoryId)
}

/** The rest of the subcategory first, then the rest of the category. */
export function similarProducts(product: Product): Product[] {
  const others = productsInCategory(product.categoryId).filter((p) => p.id !== product.id)
  return [
    ...others.filter((p) => p.subcategoryId === product.subcategoryId),
    ...others.filter((p) => p.subcategoryId !== product.subcategoryId),
  ]
}
