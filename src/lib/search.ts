import { categories, products, type Product } from '@/data/catalog'

/** Drops Vietnamese accents and case, so "Nước" and "nuoc" compare equal. đ is its own letter, not an accented d, so it needs its own rule. */
function fold(text: string): string {
  return text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().trim()
}

const subcategoryNames = new Map(categories.flatMap((c) => c.subcategories).map((s) => [s.id, s.name]))

/** Products whose name, subcategory or description contains the query, name matches first. */
export function searchProducts(query: string): Product[] {
  const q = fold(query)
  if (!q) return []
  const byName = products.filter((p) => fold(p.name).includes(q))
  const byOther = products.filter(
    (p) => !byName.includes(p) && fold(`${subcategoryNames.get(p.subcategoryId)} ${p.description}`).includes(q),
  )
  return [...byName, ...byOther]
}
