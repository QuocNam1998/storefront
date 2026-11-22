# Architecture

> System overview. Keep it short and up to date; put the reasoning behind choices in `decisions/`.

## Purpose

Second Crack is a demo storefront for a small specialty coffee roaster. Shoppers browse 9 coffees and 4 pieces of brewing gear, filter and sort the catalog, choose size, grind and quantity, build a cart and place an order. It's a demo: there's no backend and no payment is taken.

## Components

| Component | Location | Responsibility |
|---|---|---|
| App shell and routes | `src/App.tsx`, `src/main.tsx` | Sets up the routes and the shared layout (skip link, header, footer, cart drawer), and scrolls to the top on every page change |
| Pages | `src/pages/` | One file per route: `/` Home, `/shop` Shop, `/product/:slug` ProductPage, `/cart` Cart, `/checkout` Checkout, `/order/:id` OrderConfirmation, and NotFound for anything else |
| Catalog | `src/data/products.ts` | Product data (coffees and gear, sizes, grinds, roast levels, flavors, process) and lookup by slug or id |
| Cart store | `src/store/cart.tsx` | Cart state shared through React context: lines, count, subtotal, drawer open or closed, add, change quantity (up to 20), remove, clear. Saved in localStorage under `second-crack.cart`; on load it drops items that are no longer in the catalog |
| Store rules | `src/lib/store.ts` | Price formatting (all prices in US cents), next roast date (every Monday), shipping methods (standard $5, express $12) and free standard shipping from $40 |
| Orders | `src/lib/orders.ts` | Creates order ids (`SC-` plus 6 digits), and saves and reads demo orders in localStorage under `second-crack.orders` |
| Site components | `src/components/` | Header and footer, cart drawer, cart line, product tile, SVG drawings of the coffee bags and gear (no image files), roast scale, quantity stepper |
| UI kit | `src/components/ui/` | shadcn/ui components built on Radix |
| Design tokens | `src/index.css` | Tailwind v4 theme: palette, the Archivo font and its width axis |

## Data flow

1. On page load the cart store reads the saved cart from localStorage, keeping only items that still match the catalog.
2. Pages read products straight from the catalog. The shop keeps the product type (coffee or gear), its filters (roast, flavor, process) and the sort order in the URL query string, so a filtered view can be shared or reloaded.
3. Adding to the cart from a product page updates the cart store, which saves to localStorage on every change. The header count and cart drawer update with it.
4. Checkout checks the contact, address and shipping form and moves focus to the first error. When the form is valid it works out shipping with the store rules, builds the order, saves it to localStorage, empties the cart and replaces the page with `/order/:id`.
5. The order confirmation page reads the order back from localStorage by its id.

The site makes no network requests for data.

## Tech stack

- React 19, TypeScript 7, React Router 7
- Vite 8 (with the `@` alias pointing to `src/`)
- Tailwind CSS v4, shadcn/ui on Radix, lucide-react icons, the Archivo variable font from Fontsource
- Browser localStorage is the only storage
- oxlint for linting, pnpm for packages
- Vitest with jsdom and Testing Library for unit and component tests, Playwright (Chromium, desktop and Pixel 7 sizes) for browser tests
- GitHub Actions CI (`.github/workflows/ci.yml`): lint, build, unit tests and browser tests on every push and pull request
- Claude Code MCP servers in `.mcp.json`: shadcn (components) and playwright (driving the browser)

## Conventions

- **Layout:** code in `src/`, organised as `pages/` (one per route), `components/` (site components) with `components/ui/` (shadcn), `store/` (React context), `lib/` (plain logic) and `data/` (catalog). Unit and component tests go beside the file they test as `*.test.ts(x)`, and browser tests go in `e2e/*.spec.ts`.
- **Running:** `pnpm install`, then `pnpm dev` (http://localhost:5173). `pnpm build` type-checks and builds to `dist/`, `pnpm preview` serves that build, and `pnpm lint` runs oxlint. `pnpm check` runs the tests, browser tests, lint and build in one go; `/implement` and `/verify` use it.
- **Testing:** Vitest for unit and component tests, Playwright for browser flows. Run everything with `pnpm test && pnpm test:e2e`. Before the first browser test run on a new machine, install Chromium once with `pnpm exec playwright install chromium`.
- **Guardrails** ([decision 0002](decisions/0002-kiss-and-dry-guardrails.md)): `pnpm lint` enforces the limits set in `.oxlintrc.json` on function complexity, nesting depth and parameter count, and fails on a needless `else`, lone `if` or trailing `return`. In Claude Code, a hook in `.claude/settings.json` lints each `.ts`/`.tsx` file Claude writes or edits and shows it the errors straight away. The hook's script and its test live in `.claude/hooks/`, and `pnpm test` runs that test too. UI work follows the `storefront-ui` skill in `.claude/skills/`: theme tokens, reuse before writing, and a visual check at desktop and phone sizes.

## Known concerns

Deferred until the UI work is finished. Fix each one with `/bug`.

- **Monday orders get a roast date that has already passed.** The site says coffee is roasted on Monday morning from orders placed by Sunday night. An order placed on a Monday, even at 23:30, is still told it goes into that day's roast, and its ship-by date is based on that roast. The home page, product page and order confirmation all show this. Reproduced on 2026-11-22 with the browser clock set to Mon 23 Nov 2026 23:30. To decide before fixing: the exact order cutoff, and which time zone it uses (dates currently follow the shopper's own clock).
