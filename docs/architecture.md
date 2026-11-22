# Architecture

> System overview. Keep it short and up to date; put the reasoning behind choices in `decisions/`.

## Purpose

Cửa hàng của Thy is a demo storefront for a small neighborhood grocery in Vietnam. Shoppers search or browse 24 products in three categories (snacks, water and drinks, everyday essentials), compare packs by unit price, add to the cart straight from a product tile, and place a cash-on-delivery order with a Vietnamese address. The interface is Vietnamese only and prices are in whole đồng. It's a demo: there's no backend and no payment is taken.

## Components

| Component | Location | Responsibility |
|---|---|---|
| App shell and routes | `src/App.tsx`, `src/main.tsx` | Sets up the routes and the shared layout (skip link, header, footer, cart drawer), and scrolls to the top on every page change |
| Pages | `src/pages/` | One file per route: `/` Home, `/c/:slug` Category, `/deals` Deals, `/search` Search, `/p/:slug` ProductPage, `/cart` Cart, `/checkout` Checkout, `/order/:id` OrderConfirmation, and NotFound for anything else |
| Catalog | `src/data/catalog.ts` | Categories and subcategories (with their tint, icon color and icon), the 24 products with their packs (label, price, optional old price, amount and unit) and stock level, the stock wording, and lookups: by id or slug, by category, deals and similar products |
| Cart store | `src/store/cart.tsx` | Cart state shared through React context: one line per product and pack, count, subtotal, drawer open or closed, add, quantity of a pack, change quantity (up to 99), remove, clear. Saved in localStorage under `thy-store.cart`; on load it drops items that are no longer in the catalog |
| Store rules | `src/lib/store.ts` | Price formatting in whole đồng, unit price (per 100 g, per litre or per item) and its formatting, discount percent, delivery fee (20.000 ₫, free from 300.000 ₫) and the 2-hour delivery promise |
| Search | `src/lib/search.ts` | Product search that ignores Vietnamese accents and case and lists name matches before subcategory and description matches |
| Orders | `src/lib/orders.ts` | Creates order ids (`THY-` plus 6 digits), and saves and reads demo orders in localStorage under `thy-store.orders` |
| Site components | `src/components/` | Header (search, category nav, cart button) and footer, cart drawer and cart line, product tile, product grid, product image (photo or category-colored placeholder), deal badge and old price, free-delivery progress, order totals, quantity stepper |
| UI kit | `src/components/ui/` | shadcn/ui components built on Radix |
| Design tokens | `src/index.css` | Tailwind v4 theme: palette (including the category tints), the Be Vietnam Pro font, and no motion under reduced motion |

## Data flow

1. On page load the cart store reads the saved cart from localStorage, keeping only items that still match the catalog. A cart saved by the old coffee store uses a different key and is never read.
2. Pages read products straight from the catalog. The category page keeps its subcategory filter, sort and in-stock option in the URL query string, and search keeps its query there, so a view can be shared or reloaded.
3. Adding to the cart from a tile or a product page updates the cart store, which saves to localStorage on every change. The header count, the tiles' quantity controls and the cart drawer update with it.
4. Checkout checks the name, phone number, optional email and the two-level address, and moves focus to the first problem. When the form is valid it works out the delivery fee with the store rules, builds the order, saves it to localStorage, empties the cart and replaces the page with `/order/:id`.
5. The order confirmation page reads the order back from localStorage by its id.

The site makes no network requests for data.

## Tech stack

- React 19, TypeScript 7, React Router 7
- Vite 8 (with the `@` alias pointing to `src/`)
- Tailwind CSS v4, shadcn/ui on Radix, lucide-react icons, the Be Vietnam Pro font from Fontsource (weights 400–700)
- Browser localStorage is the only storage
- oxlint for linting, pnpm for packages
- Vitest with jsdom and Testing Library for unit and component tests, Playwright (Chromium, desktop and Pixel 7 sizes) for browser tests, and axe-core in the browser tests for accessibility checks ([decision 0005](decisions/0005-axe-for-accessibility-checks.md))
- GitHub Actions CI (`.github/workflows/ci.yml`): lint, build, unit tests and browser tests on every push and pull request
- Claude Code MCP servers in `.mcp.json`: shadcn (components) and playwright (driving the browser)

## Conventions

- **Layout:** code in `src/`, organised as `pages/` (one per route), `components/` (site components) with `components/ui/` (shadcn), `store/` (React context), `lib/` (plain logic) and `data/` (catalog). Unit and component tests go beside the file they test as `*.test.ts(x)`, and browser tests go in `e2e/*.spec.ts`.
- **Running:** `pnpm install`, then `pnpm dev` (http://localhost:5173). `pnpm build` type-checks and builds to `dist/`, `pnpm preview` serves that build, and `pnpm lint` runs oxlint. `pnpm check` runs the tests, browser tests, lint and build in one go; `/implement` and `/verify` use it.
- **Testing:** Vitest for unit and component tests, Playwright for browser flows. Run everything with `pnpm test && pnpm test:e2e`. Before the first browser test run on a new machine, install Chromium once with `pnpm exec playwright install chromium`.
- **Guardrails** ([decision 0002](decisions/0002-kiss-and-dry-guardrails.md)): `pnpm lint` enforces the limits set in `.oxlintrc.json` on function complexity, nesting depth and parameter count, and fails on a needless `else`, lone `if` or trailing `return`. In Claude Code, a hook in `.claude/settings.json` lints each `.ts`/`.tsx` file Claude writes or edits and shows it the errors straight away. The hook's script and its test live in `.claude/hooks/`, and `pnpm test` runs that test too. UI work follows the `storefront-ui` skill in `.claude/skills/`: theme tokens, reuse before writing, and a visual check at desktop and phone sizes.

## Known concerns

None at the moment. Fix new ones with `/bug`.
