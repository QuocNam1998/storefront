import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
      <h1 className="font-wide text-4xl font-black tracking-tight sm:text-5xl">This page doesn’t exist.</h1>
      <p className="mt-4 max-w-md text-lg">The link may be old, or the coffee may have sold out for the season.</p>
      <Button asChild size="xl" className="mt-8">
        <Link to="/shop">Go to the shop</Link>
      </Button>
    </div>
  )
}
