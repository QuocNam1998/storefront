# nextjs-migration: plan

Spec: [spec.md](spec.md). Decisions: [0007](../../decisions/0007-nextjs-app-router-on-vercel.md), feature [0001](decisions/0001-unknown-category-not-found-drawn-in-browser.md).

## Approach

Move the existing app into Next.js 16's App Router with as little code change as possible. Every page, component, store rule and test stays. Mostly, what changes is where routing comes from.

- **Routes:** each address gets a thin route file in `src/app/` that renders the existing page component. The page components move from `src/pages/` to `src/views/` with `git mv`, since Next.js would treat `src/pages/` as routes (decision 0007). The shared layout from `src/App.tsx` becomes the root layout: skip link, header, main, footer and cart drawer. `ShopLayout` becomes the layout of a `(shop)` route group around home, category, deals and search. It renders its children where it used to render React Router's outlet.
- **Router calls:** every React Router call is swapped for its Next.js equivalent in the same file:
  - `Link` becomes `next/link`.
  - `NavLink` becomes a link with `aria-current="page"` when the current path matches, so the existing `aria-[current=page]` styles keep working.
  - `useNavigate` becomes `useRouter`, and `useMatch` becomes a check on `usePathname`.
  - Page components take the slug or order id from their route as a prop, instead of calling `useParams`.
- **Address-driven pages:** the category filter, sort and in-stock option, and the search query, still come from `useSearchParams`. The category and search routes render on every request, so the server sees the query and renders the filtered list (R6). Category changes rewrite the address in place without a trip to the server or a scroll, as React Router's `replace` did. The header search form reads the query too, so it sits in a `Suspense` boundary whose fallback is the same form with an empty field. Otherwise every static page would fail to build.
- **Not found (R6, R13):** unknown addresses fall through to the root `not-found.tsx`, which is rendered on the server with a 404.
  - The product route lists every product's slug ahead of time and refuses any other, so an unknown product is treated the same way.
  - The category route calls Next's `notFound()` when `getCategoryBySlug` finds nothing. That sends a 404, but Next.js draws the page in the browser (feature decision 0001). A `not-found.tsx` inside `(shop)` keeps it inside the shop layout, as today.
  - Both not found files render the existing `NotFound`.
- **Cart and orders after load (R4, R7, R8):** `CartProvider` in `src/store/cart.tsx` starts empty and reads `thy-store.cart` in an effect once the page has loaded. It sets a `loaded` flag and doesn't save until then, so it never overwrites the saved cart. Places that would show a count of 0 or `Giỏ hàng đang trống.` wait for `loaded`: the header count, the cart panel, the drawer, the cart page and checkout. `OrderConfirmation` reads the order with `getOrder` (`src/lib/orders.ts`) in an effect, and shows neither the order nor "not found" until it has. Server and first browser render then match, so nothing mismatches.
- **Back button on the phone product page:** React Router's "first page of the visit" check has no Next.js equivalent. A small client component in the root layout notes when the shopper has moved between store pages. `Quay lại` goes back if they have, and home otherwise. The component lives in `src/views/ProductPage.tsx`, beside its only user.
- **Page details (R3):** `index.html`'s title, description, icon and theme color move into the root layout's metadata and viewport exports, with `lang="vi"` on `<html>`. The scroll to the top on every page change is Next.js's default, so `ScrollToTop` goes away.

Reused unchanged: everything in `src/lib/` (store rules, search, orders), `src/data/catalog.ts`, `src/components/ui/`, `src/index.css` (Tailwind and the Fontsource imports), and all components apart from their router imports. No new abstraction: route files are a few lines each, and `loaded` is one field on the existing cart context.

## Files

### Toolchain

| File | Change |
|---|---|
| `package.json` | Add `next@16.4.6`, the framework itself. Add `@tailwindcss/postcss`, because Tailwind v4 plugs into Next.js through PostCSS rather than Vite. Remove `react-router-dom` and `@tailwindcss/vite`. Keep `vite` and `@vitejs/plugin-react` as dev dependencies for Vitest only. Scripts: `dev` becomes `next dev --port 5173`, `build` becomes `next build` (it type-checks, as `tsc -b` did), `start` becomes `next start` (new; replaces `preview`). `lint`, `test`, `test:e2e` and `check` are unchanged. |
| `next.config.ts` | New, Next.js's required config. Turns off the development indicator. That floating button sits over the bottom-left corner on phones, where it would cover the cart bar and trip the browser tests. Also turns off the `AGENTS.md` that `next dev` would otherwise write into the repo root on every run (David's choice; CLAUDE.md already holds the rules). |
| `postcss.config.mjs` | New. Loads `@tailwindcss/postcss`. |
| `tsconfig.json` | Merge `tsconfig.app.json` and `tsconfig.node.json` into this one file, which Next.js reads. Keep their compiler options, add Next's plugin and `next-env.d.ts`, and drop `vite/client` types. Include `src`, `e2e` and the config files, so the build still type-checks tests (decision 0001). |
| `tsconfig.app.json`, `tsconfig.node.json` | Delete (merged). |
| `vite.config.ts` → `vitest.config.ts` | Rename. Keep the test settings, the React plugin and the `@` alias, and drop the Tailwind plugin. |
| `index.html`, `src/main.tsx`, `src/App.tsx` | Delete. Their content moves to `src/app/layout.tsx`. |
| `playwright.config.ts` | `webServer.command` becomes `pnpm dev`. `--strictPort` was a Vite flag, and the port now comes from the `dev` script. |
| `.gitignore` | Add `.next/`, `next-env.d.ts` and `*.tsbuildinfo` (Next.js generates all three; the last is TypeScript's build cache, which Next turns on). |
| `components.json` | `rsc: true`, so components added later with shadcn get the client marker. |

### Routes (`src/app/`, all new)

| File | Renders |
|---|---|
| `layout.tsx` | `<html lang="vi">`, metadata (title, description, `/favicon.svg`) and viewport (theme color `#F7F5EE`), `index.css`, `CartProvider`, the skip link, header, main, footer, cart drawer and the back-button tracker |
| `not-found.tsx` | `NotFound` for unknown addresses |
| `(shop)/layout.tsx` | `ShopLayout` around the shop pages |
| `(shop)/not-found.tsx` | `NotFound` inside the shop layout, for an unknown category (drawn in the browser) |
| `(shop)/page.tsx` | `Home` |
| `(shop)/c/[slug]/page.tsx` | `notFound()` for an unknown slug, otherwise `Category`. Rendered per request. |
| `(shop)/deals/page.tsx` | `Deals` |
| `(shop)/search/page.tsx` | `Search`. Rendered per request. |
| `p/[slug]/page.tsx` | `ProductPage`. Lists every product slug ahead of time and refuses any other, so an unknown slug gets the root not found page from the server. |
| `cart/page.tsx`, `checkout/page.tsx` | `Cart`, `Checkout` |
| `order/[id]/page.tsx` | `OrderConfirmation` with the id |

### Code

| File | Change |
|---|---|
| `src/pages/` → `src/views/` | `git mv`. Each file swaps its React Router calls for Next.js ones and gets `'use client'` where a route imports it. `Category`, `ProductPage` and `OrderConfirmation` take their slug or id as a prop. `Category` writes filter changes to the address in place. `ProductPage` gets the back-button tracker and goes to checkout with `useRouter`. `Checkout` uses `router.replace`, and both `Checkout` and `Cart` wait for `loaded`. `OrderConfirmation` reads the order after load. |
| `src/components/SiteChrome.tsx` | `'use client'`. Next.js links. `aria-current` on the icon row. The product-page check uses `usePathname`. The search form uses `useRouter` and sits in `Suspense`. The count waits for `loaded`. |
| `src/components/ShopLayout.tsx` | `'use client'`. Takes `children` instead of the outlet. `aria-current` on the sidebar. The cart panel waits for `loaded`. |
| `src/components/CartSheet.tsx` | `'use client'`. `next/link`. No wait needed: the drawer's contents only render once it's opened, which can't happen before the saved cart is read. |
| `src/components/CartLineRow.tsx`, `ProductTile.tsx` | `next/link` |
| `src/store/cart.tsx` | `'use client'`. Reads the saved cart after load, adds `loaded`, and saves only once loaded. |
| `src/components/ProductTile.test.tsx` | Drop the `MemoryRouter` wrapper. Setup only; checked 2026-11-22 that `next/link` renders and handles a click in Vitest with no router. |
| `src/store/cart.test.tsx` | Add a test for `loaded` and for not overwriting a saved cart before it's read. Existing checks stay. |

### Tests and docs

| File | Change |
|---|---|
| `e2e/server.spec.ts` | New. Server rendering, status codes, page details, console and navigation checks (R3, R5–R8, R13). A separate file keeps the existing browser tests untouched, which is R10's evidence. |
| `e2e/seed.ts` | New. The page list, sample order and seeding helper, moved unchanged out of `quality.spec.ts`, because `server.spec.ts` is their second user. Importing one spec file from another would run its tests twice. |
| `docs/decisions/0007-nextjs-app-router-on-vercel.md` | New (written with this plan). |
| `docs/architecture.md` | The last step. These parts become untrue: the Purpose wording "no backend" (still true, but it should name Next.js); the Components table (app shell, pages, the shop layout as a route group); Data flow step 1 (cart read after load) and the line "The site makes no network requests for data"; the Tech stack (React Router, Vite); the Conventions on layout (`pages/` → `views/` plus `app/`) and running (`pnpm preview` → `pnpm start`, `dist/` → `.next/`). |
| `README.md` | The stack line names Vite. Add `pnpm start`. |

## Steps

- [x] **1. Before screenshots.** On `develop` code, before any change: run the storefront-ui visual check of every page in the quality test's page list at 390, 768, 1280 and 1366 px. Save under `.playwright-mcp/visual-check/nextjs-migration/before/`. *(R2)*
- [x] **2. Toolchain.** Install and remove the dependencies. Add `next.config.ts` and `postcss.config.mjs`. Merge the tsconfigs. Rename the Vitest config. Update the scripts, `.gitignore`, `components.json` and the Playwright server command. Delete `index.html` and `src/main.tsx`. `pnpm test` still passes, except the tile test, which still imports React Router until step 3. *(R9, R11)*
- [x] **3. Router calls.** `git mv src/pages src/views`. Swap every React Router call for Next.js (Approach), with `'use client'` where needed. Add the back-button tracker and the search form's `Suspense`. Pages take their slug or id as a prop. Drop `MemoryRouter` from the tile test. Delete `src/App.tsx`. *(R1, R5)*
- [x] **4. Routes.** Add every file in `src/app/` from the table above, with metadata and viewport in the root layout and per-request rendering on category and search. `pnpm build` passes, and `pnpm dev` serves every page. The product route lists its slugs ahead of time (feature decision 0001), and `next.config.ts` turns off `AGENTS.md`. *(R1, R3, R6 changed, R13)*
- [x] **5. Cart and orders after load.** Add `loaded` to the cart store and the waits listed in Files. `OrderConfirmation` reads after load. Add the cart unit tests. *(R4, R7, R8)*
- [x] **6. New browser tests.** Write `e2e/server.spec.ts` (Tests below). Run `pnpm check`. Check that `git diff develop -- e2e/*.spec.ts src/**/*.test.tsx` shows only setup changes to the old tests. *(R3–R10, R13)*
- [x] **7. Look and keyboard.** Run the storefront-ui visual check again at the same widths into `…/nextjs-migration/after/`, and compare each pair with the before shots. Do a keyboard pass on home, a product page and checkout. Also check the lint limits: a throwaway file in `src/app/` with blocks nested 4 deep fails `pnpm lint`, and the lint-on-edit hook reports it. Then delete the file. *(R2, R11)*
- [x] **8. Vercel.** David deploys the branch once from his own Vercel account (`pnpm dlx vercel deploy`; Vercel detects Next.js and pnpm). Check the deployment: every address in R1 returns 200 with the store's title, the three unknown addresses return 404, and the home and product pages look right in a browser. *(R12)*
- [x] **9. Docs.** Update `docs/architecture.md` (the sections listed in Files) and `README.md`, so they describe the system as built. *(all)*

## Tests

| Req | Proved by |
|---|---|
| R1 | The existing browser tests open every address, including the category filter surviving a reload (`browse.spec.ts`). `server.spec.ts` checks that `/c/khong-co`, `/p/khong-co` and `/khong-co-trang-nay` show the not found page. |
| R2 | The existing browser and unit tests, unchanged apart from setup (`quality.spec.ts` covers axe, both widths, keyboard and reduced motion). Before/after screenshots at 390, 768, 1280 and 1366 px (steps 1 and 7). |
| R3 | `server.spec.ts`: language `vi`, the title, the description and the icon link on each page in the page list. |
| R4 | `server.spec.ts`: with `thy-store.cart` (3 items) and `thy-store.orders` saved, the header shows 3 once loaded and `/order/THY-123456` shows the order. `cart.test.tsx`: the saved cart isn't overwritten before it's read. |
| R5 | `server.spec.ts`: a marker set on `window` survives a click from home to a product page and back, so no full page reload happened. |
| R6 | `server.spec.ts` with JavaScript turned off: home (banner and 24 tiles), the product page (name, price and pack, unit price, description, 4 similar), deals (3), search with and without results, a category with a subcategory filter and a price sort, and the not found page for `/khong-co-trang-nay` and `/p/khong-co`. |
| R7 | `server.spec.ts`: the HTML the server sends for `/` holds no `Mở giỏ hàng, 0 món` and no `Giỏ hàng đang trống.`, and for `/order/THY-123456` holds no `Không tìm thấy đơn hàng`. Once loaded with a saved cart, the header shows 3. |
| R8 | `server.spec.ts`: no console errors or warnings on each page in the page list, with an empty browser and with a saved cart and order. The only line ignored is Chrome's "Failed to load resource … 404" for a not found page's own address. |
| R9 | `pnpm check` locally (step 6) and CI on the pushed branch. `pnpm start` serves the built store (step 8 compares it with the deployment). |
| R10 | The diff review in step 6. One change goes beyond setup, approved by David on 2026-11-22: in `checkout.spec.ts`, the error summary's `alert` is looked up inside `main`, because Next.js adds its own empty `alert` (the route announcer for screen readers) to every page. The text check is unchanged. A second, approved by David on 2026-11-23: in `browse.spec.ts`, the sort test checks the order again until the list has re-sorted, because the list now updates a moment after the address (feature decision 0002). The check is unchanged. |
| R11 | `pnpm lint` in `pnpm check` covers `src/app/`. The throwaway-file check in step 7. The existing `lint-on-edit.test.mjs`. |
| R12 | The deployment check in step 8. |
| R13 | `server.spec.ts`: 404 for the three unknown addresses, and 200 for `/`, `/c/do-an-vat`, `/p/nuoc-suoi-tinh-khiet`, `/cart` and `/order/THY-123456`. |

## Risks

- **Browser tests on the development server:** Next.js builds each page the first time it's opened, so the first test to open a page may hit Playwright's timeouts. If it does, raise the timeout for the first visit, or run the browser tests against `pnpm build && pnpm start`. Either way, record the choice in a feature decision.
- **Address changes and scrolling:** writing category filters to the address in place must not jump the page or trigger a server request. Search from the header is a normal navigation and scrolls to the top, which changes nothing visible today unless a search is made from a scrolled-down search page. The before/after shots and `browse.spec.ts` cover the filter.
- **Content that pops in after load:** the cart count, a tile's quantity control and the cart panel now appear a moment after the page. That's what R7 asks for. Watch the after screenshots and the reduced-motion test for layout shift.
- **Fonts and CSS through PostCSS:** the Fontsource `@import`s in `index.css` must resolve through Next's CSS pipeline. A missing font would only show in the screenshots, so step 7 checks them.
- **Lint warnings:** route files export `metadata` and `viewport` objects, so oxlint's fast-refresh rule warns, as it already does for six other files. Warnings don't fail `pnpm lint`.
- **Unit tests with the cart read after load:** tests that render `CartProvider` rely on the effect running inside Testing Library's `act`. If one reads the cart too early, the fix is in the test's setup (waiting for `loaded`), never a loosened check.
