import { Link, useSearchParams } from 'react-router-dom'
import { ProductGrid } from '@/components/ProductGrid'
import { categories } from '@/data/catalog'
import { searchProducts } from '@/lib/search'

export function Search() {
  const [params] = useSearchParams()
  const query = params.get('q')?.trim() ?? ''
  const results = searchProducts(query)

  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
      <h1 className="text-3xl font-semibold wrap-break-word sm:text-4xl">{query ? `Kết quả cho “${query}”` : 'Tìm kiếm'}</h1>
      <section aria-live="polite" aria-label="Kết quả" className="mt-6">
        {results.length > 0 ? (
          <>
            <p className="text-sm text-ink-soft">{results.length} sản phẩm</p>
            <ProductGrid products={results} />
          </>
        ) : (
          <div className="max-w-xl">
            <p className="text-lg wrap-break-word">
              {query ? `Không tìm thấy sản phẩm nào cho "${query}"` : 'Nhập tên sản phẩm vào ô tìm kiếm ở đầu trang.'}
            </p>
            <p className="mt-4 text-ink-soft">Hoặc xem theo danh mục:</p>
            <ul className="mt-2 flex flex-wrap gap-3">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/c/${c.slug}`} className="block rounded-md bg-surface px-4 py-2 font-medium text-sea-deep underline underline-offset-4">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
