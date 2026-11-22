# grocery-store: plan

Spec: [spec.md](spec.md). Decisions: [0001](../../../decisions/0001-vitest-and-playwright-for-tests.md),
[0003](../../../decisions/0003-prices-in-whole-vnd.md), [0004](../../../decisions/0004-vietnamese-only-interface.md),
[0005](../../../decisions/0005-axe-for-accessibility-checks.md).
Branch: `feature/grocery-store` (holds this spec and plan).

## Approach

Replace the coffee storefront with a grocery store while keeping its architecture:
- a React Router app shell
- a typed catalog in `src/data/`
- a cart in React context, saved to localStorage
- plain logic in `src/lib/`
- one page per route
- shadcn/ui on Radix
- no backend

**Data.** A new catalog (`src/data/catalog.ts`) has 3 categories, 12 subcategories and the 24 products from the spec appendix.
A product has one or more **packs**. Each pack has a label, a price in whole đồng (decision 0003), an optional old price (`wasPrice`) that makes it a deal, and its total `amount` in a `unit` of `g`, `ml` or `item` (with an `itemLabel` such as `cuộn` for items).
Price formatting, unit price, discount and the delivery rules (20.000 ₫, free from 300.000 ₫, the 2-hour promise) are pure functions in `src/lib/store.ts`, the one home for store rules.
Search (`src/lib/search.ts`) normalizes both sides by removing accents with NFD, mapping `đ`/`Đ` to `d` and lowercasing, then ranks name matches above subcategory and description matches.

**Cart.** A line's key becomes `productId|packId`. Grind is gone, the per-line limit goes from 20 to 99, and the storage key changes to `thy-store.cart`, so a coffee cart is never read.
The store gains `getQty(productId, packId)` so product tiles can show their own quantity control.
**Orders** use `THY-` ids and the storage key `thy-store.orders`, and record the phone number, the two-level address, an optional note, `payment: 'cod'` and pack labels.

**Reuse.**
- `src/pages/Shop.tsx`'s URL-param helpers (`readList` and the param update), `sortProducts`, `FilterGroup` and `FilterCheckbox` are what the category filters need. Step 7 deletes `Shop.tsx`, because the type-check rejects unused functions and a placeholder can't keep them. Step 12 brings them back from git history (`git show main:src/pages/Shop.tsx`) into `src/pages/Category.tsx` and adapts them to packs.
- `ProductTile`, `QuantityStepper`, `CartLineRow`, `CartSheet`, `SiteChrome`, the cart store, `orders.ts` and every page are changed, not replaced.
- shadcn `Select`, `Checkbox`, `ToggleGroup`, `Sheet` and `Button` are already in `src/components/ui/`. Only `Progress` and `Textarea` are new.

**Switch-over.** The cart's shape changes, and every page uses the cart, so the coffee UI can't keep working alongside the new code.
- Steps 2–6 add the new pure functions and theme next to the coffee code, which keeps working. `formatPrice` keeps formatting US cents until step 7, because the coffee pages still use it.
- Step 7 switches the cart and `formatPrice`, swaps the routes to the grocery set with minimal placeholder pages, and deletes the coffee data, components and the coffee browser test.
- Steps 8–17 fill in the real components and pages one at a time. Each step adds its own tests.
`pnpm check` passes after every step. Step 6 starts `e2e/quality.spec.ts` with the R1 title and language checks, so there is always at least one browser test (Playwright fails when it finds none).

**Design.** Step 6 follows the frontend-design skill, and this section is its plan, already reviewed against generic defaults. Step 6 also rewrites the storefront-ui skill to describe this look. Steps 8–19 then follow storefront-ui.

| Token | Hex | Use |
|---|---|---|
| `--mist` | `#EEF3F1` | Page background, a pale blue-green like still water |
| `--surface` | `#FAFCFB` | Tiles, drawer, form fields, summary panels |
| `--ink` | `#1F3A3D` | Text (about 11:1 on mist) |
| `--ink-soft` | `#4F676A` | Secondary text: pack labels, unit prices, help text |
| `--sea` | `#2F7A6B` | The one action color: buttons, links, focus ring, the free-delivery bar |
| `--sea-deep` | `#235E52` | Button hover, error text |
| `--apricot` | `#F2B880` | Deals only: discount badge (ink text on it) and the struck-through old price marker |
| `--line` | `#D3DEDA` | Dividers, input borders |

Category tints (tile background, placeholder image, home section band) and their icon colors. They are tokens in `src/index.css`, like the rest of the palette. The catalog names the full classes (`bg-tint-snacks`, `text-icon-snacks`) so Tailwind finds them, and holds no hex values.

| Category | Tint token | Tint | Icon token | Icon color |
|---|---|---|---|---|
| Snacks | `--tint-snacks` | `#F7E3CF` | `--icon-snacks` | `#9A5B2A` |
| Water & drinks | `--tint-drinks` | `#D7EDF0` | `--icon-drinks` | `#2C6E7A` |
| Essentials | `--tint-essentials` | `#E4E2F0` | `--icon-essentials` | `#5A5480` |

Map the shadcn variables onto these tokens in `src/index.css`:
- `--background` → mist
- `--foreground` → ink
- `--primary` → sea
- `--card` and `--popover` → surface
- `--muted-foreground` → ink-soft
- `--border` and `--input` → line
- `--ring` → sea
- `--destructive` → sea-deep

Set `--radius: 0.75rem`.

- **Type:** Be Vietnam Pro only (`@fontsource/be-vietnam-pro`, weights 400/500/600/700).
  - Headings use 600, prices 600 with `tabular-nums`, and 700 is for the cart total only.
  - Sizes: 14 / 16 / 18 / 24 / 32–40 px, with one large heading per page.
  - No wide or condensed styles and no all-caps.
- **Motion:** no load animations. The `Thêm` button swaps to the stepper without animation, the drawer keeps shadcn's slide, and everything is off under `prefers-reduced-motion`.
- **Surfaces:** no drop shadows. Tiles are surface-colored on mist with the `--radius`. Category tints carry the color.
- **Layout:** left-aligned. Max width 72rem with 16 px gutters on phones.
  - Product grid: 2 columns under 640 px, 3 from 768 px, 4 from 1024 px, 5 from 1280 px.
  - Header: logo, search and cart on one row on desktop. On phones the search gets its own full-width row, and the category nav scrolls sideways.

```
Header  │ Cửa hàng của Thy   [🔍 Tìm đồ ăn vặt, nước uống, nhu yếu phẩm… ]   🛒 3 │
        │ Đồ ăn vặt   Nước uống   Nhu yếu phẩm   Ưu đãi                          │
Home    │ Giao hàng trong 2 giờ. Miễn phí giao hàng cho đơn từ 300.000 ₫         │
        │ [Đồ ăn vặt] [Nước uống] [Nhu yếu phẩm]          (tinted category tiles) │
        │ Ưu đãi tuần này ............................................ Xem tất cả │
        │ ── band in category tint: Đồ ăn vặt ......................... Xem tất cả │
Tile    │ [-15%] (icon on tint, pack label at foot)                               │
        │ Name (2 lines max) / pack label / 115.000 ₫ ~~135.000 ₫~~ / 46.000 ₫/100 g │
        │ [ + Thêm ]   →   [ − 2 + ]                                              │
```

## Files

**Create**

| File | What |
|---|---|
| `src/data/catalog.ts` | Replaces `products.ts`, whose coffee shape can't hold packs. Types (`CategoryId`, `Category`, `Subcategory`, `Unit`, `Pack`, `Product` with optional `image`), the 3 categories with their tint and icon class names and slugs (`do-an-vat`, `nuoc-uong`, `nhu-yeu-pham`), the 24 products, and lookups `getProductById`, `getProductBySlug`, `getCategoryBySlug`, `productsInCategory`, `dealProducts`, `similarProducts` |
| `src/data/catalog.test.ts` | Catalog shape tests |
| `src/lib/search.ts` | Nothing searches today (R12). `searchProducts(query)`, with accent removal kept private to the file |
| `src/lib/search.test.ts` | |
| `src/lib/orders.test.ts` | Id format, save/read round trip, unknown id |
| `src/components/ProductImage.tsx` | Used by tiles and the product page (R11). Placeholder (tint, subcategory icon, pack label) or `<img>` when `product.image` is set |
| `src/components/ProductImage.test.tsx` | |
| `src/components/ProductTile.test.tsx` | Add, stepper, deal, stock states |
| `src/components/FreeDeliveryProgress.tsx` | Used by the drawer and the cart page (R20). Message plus shadcn `Progress` |
| `src/components/FreeDeliveryProgress.test.tsx` | |
| `src/components/ProductGrid.tsx` | Added in step 13: the product grid (2/3/4/5 columns) is used by the category, deals, search and product pages, so it has one home |
| `src/components/DealMarks.tsx` | Added in step 14: the `-N%` badge and the struck-through old price, used by tiles and the product page, so apricot is only ever applied here (R3, R9) |
| `src/components/ui/progress.tsx`, `src/components/ui/textarea.tsx` | For R20 and the checkout note (R23). Added with the shadcn MCP or `pnpm dlx shadcn@latest add progress textarea`. Step 15 fixed one line in the generated `progress.tsx`: it never passed its value on, so screen readers heard an empty bar |
| `src/pages/Category.tsx` | `/c/:slug`. A placeholder in step 7; step 12 fills it in with the filter helpers from `Shop.tsx` in git history |
| `src/pages/Deals.tsx` | `/deals` (R9) |
| `src/pages/Search.tsx` | `/search?q=` (R12) |
| `e2e/browse.spec.ts` | Search, category filters, deals, product page, tile stepper, stock |
| `e2e/quality.spec.ts` | Started in step 6 with the R1 checks. Brand and language, no coffee text, axe scan, no horizontal scroll, keyboard order, reduced motion |
| `docs/decisions/0003-prices-in-whole-vnd.md`, `0004-vietnamese-only-interface.md`, `0005-axe-for-accessibility-checks.md` | Already written with this plan, status `proposed` |

**Change**

| File | What changes |
|---|---|
| `package.json`, `pnpm-lock.yaml` | Add `@fontsource/be-vietnam-pro` (the one typeface, with full Vietnamese glyphs) and `@axe-core/playwright` (dev, decision 0005). Remove `@fontsource-variable/archivo`. In the last step, set version to `0.1.0`. |
| `index.html` | `lang="vi"`, title `Cửa hàng của Thy`, Vietnamese meta description, `theme-color` `#EEF3F1` |
| `public/favicon.svg` | Simple basket in sea green |
| `src/index.css` | New tokens (including the category tint and icon tokens) and font. Remove the Archivo import, `font-wide`, `font-condensed`, the `--bean`/`--parchment`/`--roast`/`--cherry` tokens, and the `shelf-rise` keyframes. |
| `.claude/skills/storefront-ui/SKILL.md` | Step 6: describe the new look (store name, tokens, Be Vietnam Pro, no load animations, no shadows). Remove Archivo, `shelf-rise` and the `ProductArt`/`RoastScale` exception. |
| `src/lib/store.ts` | Add `unitPrice(pack)`, `discountPercent(pack)`, `DELIVERY_FEE = 20000`, `FREE_DELIVERY_THRESHOLD = 300000`, `deliveryFee(subtotal)`, `amountToFreeDelivery(subtotal)`, `DELIVERY_PROMISE = 'Giao hàng trong 2 giờ'`. In step 7, switch `formatPrice` to whole đồng (decision 0003), add `formatUnitPrice(pack)`, and remove `nextRoastDate`, `formatDay`, `FREE_SHIPPING_THRESHOLD`, `SHIPPING_METHODS` and `shippingCost`. |
| `src/lib/store.test.ts` | Rewritten for the price and delivery rules. The roast-date tests are removed. |
| `src/lib/orders.ts` | New `Order` shape (name, phone, email?, street, ward, province, note?, `payment: 'cod'`, lines with pack label), `THY-` ids, `thy-store.orders` |
| `src/store/cart.tsx` | `packId` instead of `sizeId`/`grind`, `MAX_QTY = 99`, `thy-store.cart`, `getQty`, lookups from `catalog.ts` |
| `src/store/cart.test.tsx` | Rewritten for packs, 99, reload, unknown items, old coffee key |
| `src/components/QuantityStepper.tsx` | Vietnamese accessible names (`Giảm số lượng`, `Tăng số lượng`) and an optional `min={0}` for tiles |
| `src/components/ProductTile.tsx` | Rewritten: ProductImage, name, pack label, price, old price, discount badge, unit price, stock text, `Thêm` or stepper |
| `src/components/CartLineRow.tsx` | Pack label instead of size/grind, Vietnamese text |
| `src/components/CartSheet.tsx` | Vietnamese text, `FreeDeliveryProgress` |
| `src/components/SiteChrome.tsx` | Header with search form and category nav; footer with name, delivery rule, hours, links and demo notice |
| `src/pages/Home.tsx`, `ProductPage.tsx`, `Cart.tsx`, `Checkout.tsx`, `OrderConfirmation.tsx`, `NotFound.tsx` | Rewritten for the grocery (placeholders first in step 7, real versions later) |
| `src/App.tsx` | Routes `/`, `/c/:slug`, `/deals`, `/search`, `/p/:slug`, `/cart`, `/checkout`, `/order/:id`, `*` |
| `README.md`, `screenshots/*` | Name, description, palette, routes and new screenshots |
| `CHANGELOG.md` | `0.1.0` entry |
| `docs/architecture.md` | **This change makes these sections untrue:** Purpose (coffee roaster), Components (pages and routes, catalog, cart limit and key, store rules, orders, site components, design tokens), Data flow (shop filters, shipping, form fields), Tech stack (Archivo, add axe-core), Known concerns (the Monday roast-date item no longer applies). Update them in the last step. |
| `docs/features/INDEX.md` | Status changes as the work moves along |

**Delete:** `src/data/products.ts`, `src/components/ProductArt.tsx`, `src/components/RoastScale.tsx`, `src/pages/Shop.tsx`, `e2e/checkout.spec.ts` (step 7; step 12 reuses `Shop.tsx`'s filter helpers from git history, and step 17 brings back a grocery `e2e/checkout.spec.ts`).

## Steps

- [x] 1. Check out branch `feature/grocery-store`, which already holds this spec, plan and decisions, and bring it up to date with `main`. Add `@fontsource/be-vietnam-pro` and `@axe-core/playwright` (dev). Add the shadcn `progress` and `textarea` components. Change no behavior. (setup)
- [x] 2. Add `unitPrice` for `g` (per 100 g), `ml` (per L) and `item` (per `itemLabel`) and `discountPercent` to `src/lib/store.ts`, with tests. Both return numbers, so the coffee prices are untouched. (R8, R9)
- [x] 3. Add `src/data/catalog.ts` with the categories, subcategories, the 24 appendix products (with short Vietnamese descriptions), stock levels and lookups, plus its tests. Nothing imports it yet. (R5, R6, R9, R10)
- [x] 4. Add the delivery rules and promise to `src/lib/store.ts` beside the old shipping code, with tests. (R21, R22)
- [x] 5. Add `src/lib/search.ts` (accent- and case-insensitive, name matches first) and its tests. (R12)
- [x] 6. Theme:
  - Tokens (including the category tint and icon tokens), font and favicon in `src/index.css`, `index.html` and `public/favicon.svg`. Set `lang="vi"` and the new title. Remove Archivo and its utilities.
  - Rewrite the storefront-ui skill for the new look.
  - Start `e2e/quality.spec.ts` with the R1 title and `html[lang=vi]` checks.
  The coffee pages still build and work, just unstyled in places. (R1, R3, R4)
- [x] 7. Switch-over:
  - Change `cart.tsx` to packs, 99 per line, `thy-store.cart` and `getQty`, and rewrite `cart.test.tsx`.
  - Switch `formatPrice` to whole đồng and add `formatUnitPrice`, with tests. (R7, R8)
  - Point `CartLineRow` and `CartSheet` at the catalog's packs.
  - Replace `App.tsx` routes with the grocery set, with every page a minimal placeholder (Vietnamese heading only).
  - Delete `Shop.tsx` and add `Category.tsx` as the category placeholder. The type-check rejects unused functions, so the filter helpers can't wait in a placeholder; step 12 brings them back from git history.
  - Delete the coffee data, the other coffee pages and components, and `e2e/checkout.spec.ts`.
  - Remove `nextRoastDate`, `formatDay`, `FREE_SHIPPING_THRESHOLD`, `SHIPPING_METHODS` and `shippingCost` and their tests.
  - Remove the callers of the deleted coffee code, and nothing more: the roast-date sentence in the `SiteChrome.tsx` footer, the free-shipping note in `CartSheet.tsx`, and the skip link's coffee colors in `App.tsx` (switch it to `ink` and `surface`). Steps 10 and 15 rewrite these files properly.
  (R7, R8, R17, R18, R19, R27)
- [x] 8. `ProductImage` (placeholder by category tint and subcategory icon; `<img>` with alt text when `image` is set) and its tests. (R11)
- [x] 9. `ProductTile` and its tests: price, old price with `-N%` badge, unit price, `Sắp hết hàng`/`Hết hàng`, `Thêm` → stepper → back to `Thêm` at 0. Out-of-stock tiles have no enabled add control. Update `QuantityStepper` labels. (R8, R9, R10, R16)
- [x] 10. Header (search form to `/search?q=`, category nav with active state, cart button) and footer in `SiteChrome.tsx`. (R1, R2, R12)
- [x] 11. Home page: delivery strip, category tiles, deals row and one tinted band per category with `Xem tất cả`. (R14, R22, R3)
- [x] 12. Category page, built on `readList`, the param update, `sortProducts`, `FilterGroup` and `FilterCheckbox` brought back from `Shop.tsx` in git history (`git show main:src/pages/Shop.tsx`) and adapted to packs: subcategory toggle, sort (popular, price ascending and descending, unit price), in-stock-only checkbox, all in the URL, and an empty state. Start `e2e/browse.spec.ts` with the R13 cases. (R13)
- [x] 13. Deals page and search page, including the no-results message with category links. Add their cases to `e2e/browse.spec.ts`. (R9, R12)
- [x] 14. Product page: pack toggle (label and price), price and unit price for the chosen pack, stock state, quantity, `Thêm vào giỏ` (opens the drawer), description and `Sản phẩm tương tự`. Add the R15, R10 and R16 cases to `e2e/browse.spec.ts`. (R10, R15, R16)
- [x] 15. Cart drawer and cart page in Vietnamese, with `FreeDeliveryProgress` and its tests. (R18, R20)
- [x] 16. Checkout:
  - Fields and rules from R23, including `Khác` with a required province name. Use the shadcn `Select` and `Textarea`.
  - An error summary, inline messages, and focus on the first error.
  - `Giao hàng trong 2 giờ` and no time picker.
  - COD only, with the demo notice.
  - A summary with subtotal, delivery or `Miễn phí`, and total.
  - Update `orders.ts` (new shape, `THY-` ids, `thy-store.orders`) and add `orders.test.ts`.
  (R21, R22, R23, R24, R25)
- [x] 17. Order confirmation (thanks by name, promise, phone, address, lines with packs, totals, `Tiếp tục mua sắm`, not-found message) and NotFound in Vietnamese. Add `e2e/checkout.spec.ts`: the full order from R25 plus the R23 empty-form, phone and `Khác` cases. (R22, R23, R25)
- [x] 18. Fill in `e2e/quality.spec.ts`:
  - name, title and `lang="vi"` on every page
  - no coffee words or `$` on every page
  - an axe scan per page
  - no horizontal scroll at 390 × 844 and 1366 × 900
  - a keyboard-only order with a visible focus ring
  - no animation with reduced motion
  Fix anything it finds. (R1, R2, R3, R4, R26, R27)
- [x] 19. Visual review with the Playwright MCP at 390 and 1366 px: home, a category, deals, search, a product, the cart drawer, checkout with errors and the confirmation. Critique against the Design section (one action color, apricot only on deals, no shadows, calm spacing) and fix what's off. (R3, R26)
- [x] 20. Docs last:
  - Update `docs/architecture.md` (Purpose, Components, Data flow, Tech stack, Known concerns).
  - Update `README.md` and replace the screenshots.
  - Add the `0.1.0` entry to `CHANGELOG.md` and set `version` to `0.1.0` in `package.json`.
  - Run `pnpm check`.
  (R2, R27)

## Tests

| Req | Test |
|---|---|
| R1 | `e2e/quality.spec.ts`: header and footer text, `document.title`, `html[lang=vi]` on every page |
| R2 | `e2e/quality.spec.ts`: visits every page and checks the visible text contains none of `Second Crack`, `roast`, `grind`, `coffee`, `cà phê`, `$`, `USD` |
| R3 | `e2e/quality.spec.ts`: the background, action and deal colors differ; the deal color appears only on deal elements; with `reducedMotion: 'reduce'`, `document.getAnimations()` is empty after load |
| R4 | `e2e/quality.spec.ts`: axe `color-contrast` (part of `wcag2aa`) passes on every page |
| R5 | `src/data/catalog.test.ts`: exactly 3 categories and 12 subcategories with the spec's names; every product's category and subcategory exist |
| R6 | `src/data/catalog.test.ts`: 24 products, unique ids and slugs, at least one pack each, every price is an integer above 0 |
| R7 | `src/lib/store.test.ts`: `12000` → `12.000 ₫`, `185000` → `185.000 ₫`; `e2e/quality.spec.ts`: no text on any page matches `\d,\d+\s?₫` or `\.\d{1,2}\s?₫` (decimals in a price; `Chai 1,5 L` is fine) |
| R8 | `src/lib/store.test.ts`: the three examples from the spec; `ProductTile.test.tsx`: the tile shows the unit price |
| R9 | `src/lib/store.test.ts`: 115000/135000 → 15; `ProductTile.test.tsx`: `-15%` badge and struck-through old price; `e2e/browse.spec.ts`: the deals page lists exactly the deal products |
| R10 | `ProductTile.test.tsx`: low and out labels, and no enabled add control when out; `e2e/browse.spec.ts`: the product page for `Dầu gội` shows `Hết hàng` with the add button disabled |
| R11 | `ProductImage.test.tsx`: the placeholder has the category tint and an icon; with `image` set it renders an `img` with the product name as `alt` |
| R12 | `src/lib/search.test.ts`: `nuoc suoi`, `GIAY`, `banh` and name-first ranking; `e2e/browse.spec.ts`: header search and the no-results message with category links |
| R13 | `e2e/browse.spec.ts`: subcategory filter in the URL survives reload; price order; in-stock-only hides `Dầu gội` |
| R14 | `e2e/browse.spec.ts`: home sections appear in order and the category links work |
| R15 | `e2e/browse.spec.ts`: `Thùng 24 chai` × 2 added from the product page; the similar products start with the same subcategory |
| R16 | `ProductTile.test.tsx` and `e2e/browse.spec.ts`: `Thêm` → 1 → 3 → back to `Thêm` |
| R17 | `src/store/cart.test.tsx`: same pack merges; a different pack makes a second line |
| R18 | `src/store/cart.test.tsx`: 98 + 5 → 99 |
| R19 | `src/store/cart.test.tsx`: survives reload; unknown items dropped; a `second-crack.cart` value is ignored |
| R20 | `FreeDeliveryProgress.test.tsx`: 255000 → `Mua thêm 45.000 ₫…`; 300000 → `Đơn hàng được miễn phí giao hàng` |
| R21 | `src/lib/store.test.ts`: 299999 → 20000, 300000 → 0; `e2e/checkout.spec.ts`: the summary shows `Miễn phí` above the threshold and the total adds up |
| R22 | `e2e/checkout.spec.ts`: the promise on home, checkout and confirmation, and no date or time control in checkout |
| R23 (changed) | `e2e/checkout.spec.ts`: the empty form says 5 fields need attention (`Họ và tên`, `Số điện thoại`, `Số nhà, tên đường`, `Phường/Xã`, `Tỉnh/Thành phố`), each shows a message, and focus goes to `Họ và tên`; accepted and rejected phone numbers; `Khác` needs a province name; no district or postal-code field |
| R24 | `e2e/checkout.spec.ts`: COD is the only payment option and the demo notice is visible |
| R25 | `src/lib/orders.test.ts`: `THY-\d{6}` ids, save and read, unknown id is undefined; `e2e/checkout.spec.ts`: the full order and the not-found order page |
| R26 | `e2e/quality.spec.ts`: `scrollWidth <= innerWidth` on every page at both sizes; a keyboard-only order with a visible focus outline on each focused control |
| R27 | `e2e/quality.spec.ts`: no page text mentions a roast date; step 7 removes the roast-date code and tests; step 20 removes the Known concerns item |

## Risks

- **Non-breaking space in prices.** `Intl` puts U+00A0 before `₫`. Unit tests must expect ` ` (or compare against `formatPrice`). Playwright text assertions normalize whitespace, so browser tests can use a normal space. Mixing these up gives confusing failures.
- **Big switch-over in step 7.** It touches the cart, `formatPrice` and every route at once. Keep it limited to what's listed (placeholders only) so it stays reviewable. Between steps 7 and 12 the only browser tests are the R1 checks in `quality.spec.ts`.
- **Lint limits (decision 0002).** Complexity 15, nesting 3, 4 parameters. Today `Shop`'s filter code reaches complexity 13 and a 4-parameter helper, and `ProductDetail` reaches 12. The Category page adds four sorts, subcategories and in-stock, and the product page adds packs and stock. Keep each filter and sort a small function (`sortProducts` maps a sort id to a comparator), and give checkout one small check per field.
- **Saved data from the coffee store.** Shoppers who visited the coffee demo have `second-crack.cart` and `second-crack.orders` in localStorage. The new keys avoid reading them. The old data is left in place, which is harmless.
- **Old links.** `/shop` and `/product/...` now show the Vietnamese not-found page. That's acceptable for a demo with no real traffic. Add redirects only if the owner asks.
- **Accessible names in Vietnamese.** Tests look up controls by Vietnamese text (decision 0004), so wording changes break selectors. Keep button text identical to the spec (`Thêm`, `Thêm vào giỏ`, `Thanh toán`, `Đặt hàng`).
- **axe false positives.** Disabled out-of-stock buttons and struck-through text can trip contrast rules. Disabled controls are exempt in WCAG. If axe still flags them, disable that rule only for that element, with a comment (decision 0005).
- **Phone emulation width.** The Playwright `mobile-chromium` project uses Pixel 7 (412 px), but R26 says 390 px. `quality.spec.ts` must set a 390 × 844 viewport itself for the overflow checks.
- **Font weights.** `@fontsource/be-vietnam-pro` is static (no variable version). Import only 400, 500, 600 and 700, or the bundle grows.
- **Required-field count.** R23's empty-form criterion was corrected from 6 to 5 to match its field table. Email, the note and the `Khác` province name are not part of that count; the province name is only checked once `Khác` is chosen.
