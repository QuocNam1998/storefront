import { ProductGrid } from '@/components/ProductGrid'
import { CategoryIconRow } from '@/components/SiteChrome'
import { dealProducts } from '@/data/catalog'

export function Deals() {
  return (
    <div>
      <CategoryIconRow />
      <h1 className="text-3xl font-semibold sm:text-4xl">Ưu đãi</h1>
      <p className="mt-2 text-ink-soft">Sản phẩm đang giảm giá tuần này. Giá ưu đãi áp dụng cho từng quy cách được ghi rõ.</p>
      <section aria-label="Kết quả" className="mt-6">
        <p className="text-sm text-ink-soft">{dealProducts.length} sản phẩm</p>
        <ProductGrid products={dealProducts} />
      </section>
    </div>
  )
}
