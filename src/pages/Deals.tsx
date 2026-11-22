import { ProductGrid } from '@/components/ProductGrid'
import { dealProducts } from '@/data/catalog'

export function Deals() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <h1 className="text-3xl font-semibold sm:text-4xl">Ưu đãi</h1>
      <p className="mt-2 text-ink-soft">Sản phẩm đang giảm giá tuần này. Giá ưu đãi áp dụng cho từng quy cách được ghi rõ.</p>
      <section aria-label="Kết quả" className="mt-6">
        <p className="text-sm text-ink-soft">{dealProducts.length} sản phẩm</p>
        <ProductGrid products={dealProducts} />
      </section>
    </div>
  )
}
