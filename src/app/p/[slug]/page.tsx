import { products } from '@/data/catalog'
import { ProductPage } from '@/views/ProductPage'

// Every product page is built ahead of time and any other slug is refused, so an unknown product gets the full
// not found page from the server. Calling notFound() here would send an empty page for the browser to fill in.
export const dynamicParams = false

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ProductPage slug={slug} />
}
