import { Search } from '@/views/Search'

// The search lives in the address, so the results are rendered for each request.
export const dynamic = 'force-dynamic'

export default function Page() {
  return <Search />
}
