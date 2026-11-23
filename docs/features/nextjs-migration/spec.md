# nextjs-migration

> Move Cửa hàng của Thy onto Next.js, with its catalog pages rendered on the server, without changing anything a shopper sees or does.

## Problem

Thy needs more than a shop window: an API, and admin pages to add products and categories and to track orders. Today the store is a browser-only app with no server, so none of that has anywhere to live, and building it as a second project would mean two codebases to keep in step. Moving the store onto Next.js gives the shop, the API and the admin pages one home.

Doing the move on its own, before any backend work, keeps it safe: the whole store should look and work exactly as it does now, so any difference is a bug in the move and the existing browser tests can prove there is none.

## Goals

- The store runs on Next.js and looks and works exactly as before, at every width and with the keyboard.
- Catalog pages arrive from the server with their content already in the page, so search engines and link previews see products and prices.
- The store can be deployed to Vercel.
- The project's commands, tests, lint limits and CI keep working.

## Non-goals

- An API, a database, admin pages or sign-in. Each comes later as its own feature.
- Any change to the look, layout, wording, catalog, prices or store rules.
- Moving the cart or orders off the browser. They stay in localStorage.
- A title or description per page. Every page keeps the one store title, as today.
- Dark mode, new pages, or new behaviour of any kind (apart from the 404 status in R13, which shoppers don't see).
- A preview deployment for every pull request.

## Changes to archived requirements

None. Every requirement in [grocery-store](../_archive/grocery-store/spec.md) and [ui-redesign](../_archive/ui-redesign/spec.md) still holds as written (R2 here).

## Requirements

### The same store for shoppers

- **R1.** Every page keeps its address:
  - `/` home, `/c/<slug>` category, `/deals`, `/search?q=…`, `/p/<slug>` product, `/cart`, `/checkout`, `/order/<id>`
  - the category page's subcategory filter, sort and in-stock option, and the search query, still live in the address and survive a reload
  - any other address, and a category or product slug that doesn't exist, shows the not found page.
- **R2.** Nothing a shopper sees or does changes. Every requirement of grocery-store and ui-redesign still holds: the look and layout at phone, tablet and desktop widths, the cart and checkout behaviour, keyboard use and focus, reduced motion, and the accessibility checks. *(One exception, kept 2026-11-23: on a phone, the unknown-product not found page now shows the site header. See [feature decision 0001](decisions/0001-unknown-category-not-found-drawn-in-browser.md).)*
- **R3.** Every page keeps the same page details: Vietnamese as its language, the title `Cửa hàng của Thy`, the store description and the site icon.
- **R4.** The cart and orders stay in the shopper's browser under the same names (`thy-store.cart` and `thy-store.orders`), so a cart or order saved before the move is still there after it.
- **R5.** Moving between pages inside the store, by link or with the back button, doesn't reload the whole page, as today.

### Rendered on the server

- **R6.** These pages arrive with their content already in the page, readable with JavaScript turned off:
  - home: the delivery banner and all 24 product tiles
  - category: the heading and the products, already filtered and sorted when the address says so
  - deals: the products on a deal
  - search: the results for the query in the address, or the no-results message
  - product: the name, the price with its pack label, the unit price, any deal badge and old price, any stock text, the pack choice, the description and the similar products
  - not found, for an unknown address or an unknown product. An unknown category's not found page is drawn in the browser once the page loads, still with the 404 status (R13). Next.js can't render it on the server for a page that is rendered for each request. *(Changed 2026-11-22, see [feature decision 0001](decisions/0001-unknown-category-not-found-drawn-in-browser.md).)*

  Each product tile shows its name, pack label, price, unit price, deal badge and stock text.
- **R7.** Everything that depends on the shopper's saved cart or orders fills in once the page has loaded in the browser. That covers the header count, a tile's quantity control, the cart panel, the phone cart bar, the cart drawer, the cart page, checkout and the order confirmation. Until it has loaded, it never shows something that may be wrong: no cart count of 0, no `Giỏ hàng đang trống.` and no "order not found" message.
- **R8.** No page writes an error or warning to the browser console, with or without a saved cart or order. That includes warnings that the page built in the browser doesn't match the one sent by the server. The browser's own report that a not found page answered with a 404 (R13) doesn't count. *(Clarified 2026-11-22.)*

### Working on the project

- **R9.** The project commands still do their jobs:
  - `pnpm dev` starts the store at a local address
  - `pnpm build` type-checks and builds it
  - `pnpm start` serves the built store
  - `pnpm lint`, `pnpm test`, `pnpm test:e2e` and `pnpm check` run as before.

  CI runs them on every push and pull request, and they pass.
- **R10.** The existing unit tests and browser tests still pass, with none of their checks removed or loosened. Only their setup may change, for example how the server starts or how a test renders a component.
- **R11.** The coding guardrails ([decision 0002](../../decisions/0002-kiss-and-dry-guardrails.md)) cover every TypeScript file, including any new folders. `pnpm lint` enforces them, and Claude Code's lint-on-edit check still reports errors as files are edited.
- **R12.** The store can be deployed to Vercel, on the owner's own account, with no server of its own to run, and a deployment serves every page in R1.

### Added after review

- **R13.** The not found page answers with a 404 status, so browsers and search engines know the page is missing. This covers an unknown address and a category or product slug that doesn't exist. Every page in R1 that exists answers as found (200). Shoppers see the same not found page as before.

## Acceptance criteria

- **R1:** Given each address in the list, when I open it, then I see the same page as before the move. Given `/c/khong-co`, `/p/khong-co` or `/khong-co-trang-nay`, then I see the not found page. Given a category page with a subcategory filter and a sort chosen, when I reload, then the same filter and sort are applied.
- **R2:** Given the browser tests from before the move, then they all pass at the desktop and Pixel 7 sizes. Given the visual check (storefront-ui skill) of every page at 390, 768, 1280 and 1366 px, then each screenshot matches the same page from before the move.
- **R3:** Given any page, then its language is Vietnamese, its title contains `Cửa hàng của Thy`, and it has the store description and the site icon.
- **R4:** Given a cart with 3 items and an order `THY-123456` saved in the browser before the move, when I open the store after it, then the header shows 3 items and `/order/THY-123456` shows that order.
- **R5:** Given the home page, when I select a product tile's name, then the product page opens without a full page reload. When I go back, then the home page shows again without a full page reload.
- **R6:** Given JavaScript turned off:
  - when I open `/p/nuoc-suoi-tinh-khiet`, then I see `Nước suối tinh khiết`, `5.000 ₫`, `Chai 500 ml`, `10.000 ₫/L`, its description and four similar products
  - when I open `/`, then I see the banner and 24 product tiles
  - when I open `/deals`, then I see the three products on a deal
  - when I open `/search?q=banh`, then I see `Bánh quy bơ`; when I open `/search?q=xyz123`, then I see the no-results message
  - when I open a category address with a subcategory filter and a price sort, then I see only that subcategory's products, cheapest first
  - when I open `/khong-co-trang-nay` or `/p/khong-co`, then I see the not found page.
- **R7:** Given a cart with 3 items saved in the browser, when the server sends the home page, then it holds neither a cart count of 0 nor `Giỏ hàng đang trống.`; once the page has loaded, the header shows 3. Given a saved order `THY-123456`, when the server sends `/order/THY-123456`, then it holds no "order not found" message; once the page has loaded, it shows the order.
- **R8:** Given each page in the browser tests' page list, opened with an empty cart and again with a saved cart and order, then the console has no errors or warnings.
- **R9:** Given a fresh clone, when I run `pnpm install` and then `pnpm check`, then it passes; `pnpm dev` and `pnpm start` serve the store. Given a push, then CI passes.
- **R10:** Given the test files from before the move, then every check in them is still there and passes. Only server start-up, addresses and render setup differ.
- **R11:** Given a new TypeScript file with a function nested 4 deep, when I run `pnpm lint`, then it fails. When Claude edits that file, then the lint-on-edit check shows the error.
- **R12:** Given one Vercel deployment of the branch, when I open each address in R1, then it serves the same page as `pnpm start`.
- **R13:** Given `/khong-co-trang-nay`, `/c/khong-co` or `/p/khong-co`, when I request it, then the status is 404 and the page is the not found page. Given `/`, `/c/do-an-vat`, `/p/nuoc-suoi-tinh-khiet`, `/cart` or `/order/THY-123456`, then the status is 200.

## Open questions

None. Resolved 2026-11-22:

- **Not found status:** not found pages answer with a 404 status (R13).
- **Vercel:** the store deploys to the owner's own Vercel account. This feature proves that one deployment works (R12). A preview deployment for every pull request is left for later.
- **TypeScript version:** if Next.js doesn't support TypeScript 7 yet, the project goes back to the newest version it does support. The plan checks this first, and decision 0007 records the result together with the choice of Next.js and Vercel.
