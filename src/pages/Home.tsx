import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { BagArt } from '@/components/ProductArt'
import { ProductTile } from '@/components/ProductTile'
import { coffees, gear } from '@/data/products'
import { formatDay, nextRoastDate } from '@/lib/store'

const shelf = [coffees.find((c) => c.slug === 'kenya-nyeri')!, coffees.find((c) => c.slug === 'ethiopia-guji')!, coffees.find((c) => c.slug === 'colombia-huila')!]

const journey = [
  { when: 'Monday', title: 'We roast', body: 'Every coffee is roasted in small batches on Monday morning, and only as much as was ordered.' },
  { when: 'By Wednesday', title: 'It ships', body: 'Bags are sealed with a one-way valve and leave within 48 hours of roasting.' },
  { when: 'Days 4 to 14', title: 'It tastes best', body: 'Fresh coffee needs a few days to rest. It arrives just as it reaches its peak.' },
]

export function Home() {
  const roastDay = nextRoastDate()
  const featured = coffees.filter((c) => c.featured)
  const featuredGear = gear.slice(0, 4)

  return (
    <>
      <section className="mx-auto grid max-w-6xl items-end gap-10 px-4 pt-10 pb-6 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-16">
        <div className="pb-4 md:pb-16">
          <h1 className="font-wide text-[2.6rem] leading-[0.95] font-black tracking-tight text-balance sm:text-6xl lg:text-7xl">
            Roasted on Monday. Shipped by Wednesday.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed">
            Order by Sunday night and your coffee goes into the next roast on{' '}
            <strong className="font-semibold whitespace-nowrap">{formatDay(roastDay)}</strong>.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl">
              <Link to="/shop?type=coffee">Shop coffee</Link>
            </Button>
            <Button asChild size="xl" variant="outline" className="border-roast bg-transparent">
              <Link to="/shop?type=gear">Brewing gear</Link>
            </Button>
          </div>
        </div>

        {/* The shelf: this week's bags, standing on a roast-colored ledge. */}
        <div className="relative">
          <div className="flex items-end justify-center gap-3 px-2 sm:gap-4">
            {shelf.map((c, i) => (
              <Link
                key={c.id}
                to={`/product/${c.slug}`}
                className="shelf-rise block"
                style={{ animationDelay: `${i * 140}ms`, width: i === 1 ? '38%' : '30%' }}
              >
                <BagArt coffee={c} />
                <span className="sr-only">{c.name}</span>
              </Link>
            ))}
          </div>
          <div className="h-3 rounded-sm bg-roast" aria-hidden="true" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6" aria-labelledby="this-week">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="this-week" className="font-wide text-3xl font-extrabold tracking-tight sm:text-4xl">
            This week’s coffees
          </h2>
          <Link to="/shop?type=coffee" className="shrink-0 font-medium underline underline-offset-4 hover:text-cherry">
            See all {coffees.length}
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {featured.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="mt-24 bg-parchment" aria-labelledby="journey">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="journey" className="font-wide max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            From the roaster to your cup in a week
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-0">
            {journey.map((step, i) => (
              <li key={step.when} className="border-l-4 border-roast pl-5 md:pr-8" style={{ borderColor: i === 2 ? 'var(--cherry)' : undefined }}>
                <p className="font-condensed text-2xl font-extrabold">{step.when}</p>
                <p className="mt-1 font-semibold">{step.title}</p>
                <p className="mt-2 max-w-xs text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20 sm:px-6" aria-labelledby="gear">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="gear" className="font-wide text-3xl font-extrabold tracking-tight sm:text-4xl">
            Brew it well
          </h2>
          <Link to="/shop?type=gear" className="shrink-0 font-medium underline underline-offset-4 hover:text-cherry">
            All gear
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {featuredGear.map((p) => (
            <ProductTile key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  )
}
