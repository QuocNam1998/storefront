# Architecture

> System overview. Keep it short and up to date; put the reasoning behind choices in `decisions/`.

## Purpose

Cửa hàng của Thy is a demo storefront for a small neighborhood grocery in Vietnam. Shoppers search or browse 24 products in three categories (snacks, water and drinks, everyday essentials), compare packs by unit price, add to the cart straight from a product tile, and place a cash-on-delivery order with a Vietnamese address. The interface is Vietnamese only and prices are in whole đồng. It runs on Next.js, sends catalog pages from the server already rendered, and is deployed to Vercel ([decision 0007](decisions/0007-nextjs-app-router-on-vercel.md)). It's a demo: there's no API or database yet, and no payment is taken.

## Components

| Component | Location | Responsibility |
|---|---|---|
| Root layout | `src/app/layout.tsx` | The page details (Vietnamese language, title, description, icon, theme color), the cart store, and the shared layout: skip link, header, footer and cart drawer. It also holds the note of whether the shopper has moved between store pages, which the phone product page's `Quay lại` uses. On phones the layout leaves room under the footer whenever a bar is fixed to the bottom of the screen. Next.js scrolls to the top on every page change |
| Routes | `src/app/` | A few lines per address, each rendering one page component. Home, category, deals and search sit in the `(shop)` group, whose layout is the shop layout. Category and search render on every request, because their address's query decides the list. The 24 product pages are built ahead of time, and any other product slug is refused. Unknown addresses and products get the not found page from the server with a 404. An unknown category answers 404 too, but its not found page is drawn in the browser ([feature decision 0001](features/_archive/nextjs-migration/decisions/0001-unknown-category-not-found-drawn-in-browser.md)) |
| Pages | `src/views/` | One component per route: Home, Category, Deals, Search, ProductPage, Cart, Checkout, OrderConfirmation and NotFound. They're client components, rendered to HTML on the server and then run in the browser |
| Catalog | `src/data/catalog.ts` | Categories and subcategories (with their tint, icon color and icon), the 24 products with their packs (label, price, optional old price, amount and unit) and stock level, the stock wording, and lookups: by id or slug, by category, deals and similar products |
| Cart store | `src/store/cart.tsx` | Cart state shared through React context: one line per product and pack, count, subtotal, drawer open or closed, add, quantity of a pack, change quantity (up to 99), remove, clear. Saved in localStorage under `thy-store.cart`. It's read only once the page has loaded in the browser, and never saved before then. Until then it reports itself as not loaded. On load it drops items that are no longer in the catalog |
| Store rules | `src/lib/store.ts` | Price formatting in whole đồng, unit price (per 100 g, per litre or per item) and its formatting, discount percent, delivery fee (20.000 ₫, free from 300.000 ₫) and the 2-hour delivery promise |
| Search | `src/lib/search.ts` | Product search that ignores Vietnamese accents and case and lists name matches before subcategory and description matches |
| Orders | `src/lib/orders.ts` | Creates order ids (`THY-` plus 6 digits), and saves and reads demo orders in localStorage under `thy-store.orders` |
| Site components | `src/components/` | Header (logo, search, black cart button with the yellow count; hidden on the product page on phones) and footer, the category links with their counts and the category icon row shown below desktop width, the shop layout (category sidebar and cart panel from 1280 px, cart bar fixed to the bottom on phones), cart drawer and cart line, product tile, product grid, product image (photo or category-colored placeholder), deal badge and old price, free-delivery progress, order totals, quantity stepper (with a full-width green variant for tiles) |
| UI kit | `src/components/ui/` | shadcn/ui components built on Radix |
| Design tokens | `src/index.css` | Tailwind v4 theme: palette (cream page, white cards, forest-green action color, one yellow accent, the category tints; the token names describe roles, not hues, per [decision 0006](decisions/0006-keep-theme-token-names-through-the-redesign.md)), the Be Vietnam Pro font, scroll padding that keeps focused controls clear of a fixed bottom bar on phones, and no motion under reduced motion. The root layout's theme color and `public/favicon.svg` can't read these tokens, so they repeat the cream and green as plain values; a browser test fails if they stop matching |

## Data flow

1. The server sends each page already rendered, with its products, prices and descriptions in the HTML. The parts that depend on the shopper's cart or orders are left empty, because only the browser knows them: the cart count, the cart panel, the cart page, checkout and the order confirmation. Moving between pages after that fetches the next page's data from the server without reloading the page.
2. Once the page has loaded, the cart store reads the saved cart from localStorage, keeping only items that still match the catalog, and the cart parts fill in. A cart saved by the old coffee store uses a different key and is never read.
3. Pages read products straight from the catalog, on the server and in the browser alike. The category page keeps its subcategory filter, sort and in-stock option in the URL query string, and search keeps its query there, so a view can be shared or reloaded.
4. Adding to the cart from a tile or a product page updates the cart store, which saves to localStorage on every change. The header count, the tiles' quantity controls, the cart drawer, the desktop cart panel and the phone cart bar update with it. `Mua ngay` on a product page adds the same way, then goes to checkout.
5. Checkout checks the name, phone number, optional email and the two-level address, and moves focus to the first problem. When the form is valid it works out the delivery fee with the store rules, builds the order, saves it to localStorage, empties the cart and replaces the page with `/order/:id`.
6. Once the page has loaded, the order confirmation page reads the order back from localStorage by its id.

The cart and orders never leave the browser. The server only sends pages and their catalog data.

## Tech stack

- React 19, TypeScript 7, Next.js 16 with the App Router ([decision 0007](decisions/0007-nextjs-app-router-on-vercel.md)), with the `@` alias pointing to `src/`
- Hosted on Vercel
- Tailwind CSS v4 (through PostCSS), shadcn/ui on Radix, lucide-react icons, the Be Vietnam Pro font from Fontsource (weights 400–700)
- Browser localStorage is the only storage
- oxlint for linting, pnpm for packages
- Vitest with jsdom and Testing Library for unit and component tests (configured in `vitest.config.ts`, which uses Vite for tests only), Playwright (Chromium, desktop and Pixel 7 sizes) for browser tests, and axe-core in the browser tests for accessibility checks ([decision 0005](decisions/0005-axe-for-accessibility-checks.md))
- GitHub Actions CI (`.github/workflows/ci.yml`): lint, build, unit tests and browser tests on every push and pull request
- Claude Code MCP servers in `.mcp.json`: shadcn (components) and playwright (driving the browser)

## Conventions

- **Layout:** code in `src/`, organised as `app/` (Next.js routes and layouts, a few lines each), `views/` (one page component per route; not `pages/`, which Next.js would treat as routes), `components/` (site components) with `components/ui/` (shadcn), `store/` (React context), `lib/` (plain logic) and `data/` (catalog). Unit and component tests go beside the file they test as `*.test.ts(x)`, and browser tests go in `e2e/*.spec.ts`.
- **Running:** `pnpm install`, then `pnpm dev` (http://localhost:5173). `pnpm build` type-checks and builds to `.next/`, `pnpm start` serves that build, and `pnpm lint` runs oxlint. Deploy with `pnpm dlx vercel deploy --prod` (the project is linked in `.vercel/`, which git ignores). `pnpm check` runs the tests, browser tests, lint and build in one go; `/implement` and `/verify` use it.
- **Testing:** Vitest for unit and component tests, Playwright for browser flows. Run everything with `pnpm test && pnpm test:e2e`. Before the first browser test run on a new machine, install Chromium once with `pnpm exec playwright install chromium`.
- **Guardrails** ([decision 0002](decisions/0002-kiss-and-dry-guardrails.md)): `pnpm lint` enforces the limits set in `.oxlintrc.json` on function complexity, nesting depth and parameter count, and fails on a needless `else`, lone `if` or trailing `return`. In Claude Code, a hook in `.claude/settings.json` lints each `.ts`/`.tsx` file Claude writes or edits and shows it the errors straight away. The hook's script and its test live in `.claude/hooks/`, and `pnpm test` runs that test too. UI work follows the `storefront-ui` skill in `.claude/skills/`: theme tokens, reuse before writing, and a visual check at desktop and phone sizes.

## Known concerns

- `pnpm dev` and the production build differ on one page. On a phone, the unknown-product not found page shows the site header in production but not on the development server ([feature decision 0001](features/_archive/nextjs-migration/decisions/0001-unknown-category-not-found-drawn-in-browser.md)). The browser tests run on the production build ([feature decision 0002](features/_archive/nextjs-migration/decisions/0002-browser-tests-on-the-built-store.md)).

Fix new ones with `/bug`.
