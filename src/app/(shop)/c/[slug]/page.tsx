import { notFound } from 'next/navigation'
import { getCategoryBySlug } from '@/data/catalog'
import { Category } from '@/views/Category'

// The filter, sort and in-stock option live in the address, so the list is rendered for each request.
export const dynamic = 'force-dynamic'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCategoryBySlug(slug)) notFound()
  return <Category slug={slug} />
}
