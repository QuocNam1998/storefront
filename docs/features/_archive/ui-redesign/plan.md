# ui-redesign: plan

Spec: [spec.md](spec.md). Mockups: `designs/*.png`.

## Approach

Most of the new look comes from the theme. Following [decision 0006](../../../decisions/0006-keep-theme-token-names-through-the-redesign.md), the token names in `src/index.css` stay and only their values change. The cart, checkout, confirmation and not found pages then pick up the cream page and white cards with little or no markup change (R1, R20). Exact color values are taken from the PNGs in step 1, and the axe scan in `e2e/quality.spec.ts` (which already checks contrast on every page at both sizes) proves R2.

The layout changes are made by rearranging the existing components:

- **Shop pages** (home, category, deals, search) get a shared route layout, `ShopLayout`, nested under the current `Layout` in `App.tsx`. It renders:
  - the `Danh mục` sidebar (1280 px and up)
  - the page itself
  - the cart panel (1280 px and up)
  - the phone cart bar (below 768 px, only when the cart has items).

  The panel is built from `CartLineRow`, `FreeDeliveryProgress` and `OrderTotals` with `deliveryFee` from `src/lib/store.ts`. No new cart logic.
- **Category links** have one source: `NAV_LINKS` in `SiteChrome.tsx`, which the footer already uses. It gains each link's icon, tint, icon color and product count (from `productsInCategory` and `dealProducts`), and is exported for the sidebar. The phone `CategoryIconRow` lives beside it in `SiteChrome.tsx`. Home, category, deals and search each place it at their top, so on the home page it sits under the banner as in the mockup.
- **Header:** the category row is removed. Search becomes one field with the icon inside, and Enter submits. The cart button becomes the black pill. On a product page below 768 px the header is hidden (a route match in `SiteHeader`).
- **Product tile:** the tile keeps its logic.
  - The add button gets the new label, with `vào giỏ` hidden at phone width. The accessible name stays `Thêm <name> vào giỏ`.
  - `QuantityStepper` gets a `filled` variant (full-width green, `N trong giỏ`) instead of the tile building its own stepper. The `storefront-ui` skill says to change a variant before copying a component.
  - `ProductImage` loses its pack-label overlay. The mockups show the pack label under the image, not on it, and no caller needs the overlay, so cart lines can use `ProductImage` as a small thumbnail.
- **Product page:** restyled in place in `ProductPage.tsx`.
  - Breadcrumb, chip, price with `/ <pack>`, pack cards (still the existing `ToggleGroup`, so arrow keys and Space work as today), and the add button showing `formatPrice(pack.price * qty)`.
  - `Mua ngay` calls the same `add` and then navigates to `/checkout`.
  - The delivery card uses `DELIVERY_PROMISE` and `FREE_DELIVERY_RULE`. (The `Thông tin` table moved to product-details with R17.)
  - Similar products: `similarProducts(product).slice(0, 4)`.
  - At phone width, the quantity and add row is fixed to the bottom of the screen. `Mua ngay` stays in the page under the pack choice. The back button uses React Router's location key to tell whether there's a page to go back to.
- **Fixed bars:** they never cover content, because `Layout` adds bottom padding at phone width whenever a fixed bar is on the page (a `has-[[data-bottom-bar]]` class on the layout root), and `html` gets a matching bottom scroll padding. Focused controls then scroll clear of the bar (R12, R19, R22).
- **Width:** pages widen from `max-w-6xl` (1152 px) to `max-w-7xl` (1280 px) so the three shop columns fit, as in the mockups.

Reused unchanged: `src/lib/store.ts` (`formatPrice`, `formatUnitPrice`, `deliveryFee`, `DELIVERY_PROMISE`, `FREE_DELIVERY_RULE`), `src/lib/search.ts`, `src/store/cart.tsx`, `DealMarks`, `FreeDeliveryProgress`, `OrderTotals`, `ProductGrid`, and the UI kit. No new dependencies.

## Files

| File | Change |
|---|---|
| `src/index.css` | New values for every color token (cream, white, forest green, yellow, mockup category tints). `html` gets a bottom scroll padding below 768 px. |
| `src/App.tsx` | Shop routes (`/`, `c/:slug`, `deals`, `search`) nest under a `ShopLayout` route. The `Layout` root gets bottom padding when a fixed bar is on the page. |
| `src/components/ShopLayout.tsx` | **New.** Route layout for the four shop pages: sidebar, outlet, cart panel, phone cart bar. *Reason:* the four pages share this frame. It sits with the other site components, as `CartSheet` does, rather than growing `App.tsx`. |
| `src/components/SiteChrome.tsx` | Logo mark. Search field with the icon inside and no submit button. Black cart pill. Header row removed, and the header hidden on product pages below 768 px. `NAV_LINKS` gains icon, tint and count and is exported. New exported `CategoryIconRow`. Footer restyled. |
| `src/components/ProductTile.tsx` | Full-width outlined `Thêm vào giỏ` / `Thêm` button. Uses the `filled` stepper. Green price. Buttons pinned to the bottom (already `mt-auto`). |
| `src/components/QuantityStepper.tsx` | Optional `filled` variant: full width, green, value shown as `N trong giỏ` (`trong giỏ` hidden below 640 px). |
| `src/components/ProductImage.tsx` | Drop the `packLabel` prop and overlay. Keep the rounded tint square or photo. |
| `src/components/ProductGrid.tsx` | Columns: 2, 3 from 768 px, 4 from 1024 px, 3 from 1280 px (beside the sidebar and panel). |
| `src/components/CartLineRow.tsx` | Mockup line style: thumbnail, name, pack, green line total, stepper. `Xoá` kept. |
| `src/components/CartSheet.tsx`, `src/components/OrderTotals.tsx` | Class changes only, for the new card style. |
| `src/pages/Home.tsx` | Green banner (`h1` `Giao hàng trong 2 giờ`, rule, yellow `Xem ưu đãi`, decorative icon), `CategoryIconRow`, `Tất cả sản phẩm` with count and one `ProductGrid` of all products. The category tiles and product rows are removed. |
| `src/pages/Category.tsx`, `Deals.tsx`, `Search.tsx` | Add `CategoryIconRow` at the top. Drop their own width wrapper, because `ShopLayout` now sets the width. |
| `src/pages/ProductPage.tsx` | The layout in R13 to R19: breadcrumb, chip, price, pack cards, add button with total, `Mua ngay`, delivery card, description card, 4 similar products, phone layout with back and cart buttons and the fixed action bar. |
| `src/pages/Cart.tsx`, `Checkout.tsx`, `OrderConfirmation.tsx`, `NotFound.tsx` | `max-w-6xl` → `max-w-7xl`, and white card classes where the mockup cart shows them. No content changes. |
| `src/components/ProductTile.test.tsx` | Button label and `N trong giỏ` text. |
| `src/components/ProductImage.test.tsx` | No pack label. |
| `e2e/browse.spec.ts` | Home test rewritten for R8/R9. Stepper text expectations. Product page tests for R13 to R19. Shop layout tests for R6, R7, R11, R12, R23. |
| `e2e/quality.spec.ts` | Color test rewritten for R1. The page list and keyboard order are unchanged. Add the fixed-bar focus check (R22). |
| `docs/decisions/0006-keep-theme-token-names-through-the-redesign.md` | **New.** Written with this plan. |
| `docs/architecture.md` | **Becomes untrue:** App shell (shop layout), Pages (home content), Site components (sidebar, icon row, cart panel and bar), Design tokens (new palette, decision 0006). Updated in the last step. |
| `.claude/skills/storefront-ui/SKILL.md` | **Becomes untrue:** palette description, "apricot marks deals and nothing else", `max-w-6xl`, grid columns. Updated in the last step. |

## Steps

- [x] **1. Theme.** New token values in `src/index.css`, sampled from the mockup PNGs. Rewrite the R1 color test: the cream page, green action and yellow accent are distinct, and yellow appears only on deal badges, struck prices, the cart count and the banner button. Run the axe scan to check contrast. *(R1, R2)*
- [x] **2. Header and footer.** Logo mark, search field, black cart pill (icon and count only below 640 px), category row removed, footer restyled. `NAV_LINKS` gains icon, tint and count, and `CategoryIconRow` is added. *(R3, R4, R5, R21)*
- [x] **3. Tile and stepper.** `ProductImage` drops the overlay. `QuantityStepper` gets `filled`. `ProductTile` gets the new button and stepper. `ProductGrid` columns change. Update the unit tests. *(R10)*
- [x] **4. Shop layout.** `ShopLayout` with sidebar, cart panel and phone cart bar. Nest the shop routes in `App.tsx`, and add the `Layout` bottom padding and the `html` scroll padding. *(R6, R11, R12, R23)*
- [x] **5. Shop pages.** Home: banner, icon row, all-products grid. Category, deals and search: icon row at the top, width wrapper removed. Rewrite the home e2e test. *(R7, R8, R9)*
- [x] **6. Product page, desktop.** Breadcrumb, chip, price, pack cards, add button with total, `Mua ngay`, delivery card, description card, 4 similar products. *(R13, R14, R15, R16, R18)*
- [ ] ~~**7. Catalog details.** Add `origin` and `storage` with Thy's text for all 24 products, add the `Thông tin` card, and add the catalog test. **Blocked until Thy's text arrives**; steps 8 and 9 don't depend on it. *(R17)*~~ Moved to product-details with R17.
- [x] **8. Product page, phone.** Header hidden below 768 px, full-width image with `Quay lại` and the cart button, overlapping white panel, fixed action bar, `Mua ngay` under the pack choice. *(R19, R23)*
- [x] **9. Other pages.** Cart line style in the drawer, cart page and panel. Card classes and `max-w-7xl` on cart, checkout, confirmation and not found. *(R20)*
- [x] **10. Whole-site check.** `pnpm check`. Visual check (storefront-ui skill) of every page at Desktop Chrome and Pixel 7, plus 1366 px and 768 px, with screenshots in `.playwright-mcp/visual-check/ui-redesign/`. Keyboard pass, including focus above the fixed bars. *(R22)*
- [x] **11. Docs.** Update `docs/architecture.md` and the `storefront-ui` skill to describe the system as built.
- [ ] ~~**12. Docs for catalog details.** Once step 7 is done, add the origin and storage fields to the Catalog row of `docs/architecture.md`. *(R17; added because Thy's text arrives after the rest of the feature)*~~ Moved to product-details with R17.

## Tests

| Req | Test |
|---|---|
| R1 | `e2e/quality.spec.ts`: page background, action color and accent are three different colors. The accent is found only on deal badges, struck prices, the cart count and the banner button. |
| R2 | `e2e/quality.spec.ts`: the existing axe scan (WCAG A and AA, contrast included) on every page at both sizes, with a cart line, so the panel and bar are scanned. |
| R3 | `e2e/browse.spec.ts`: the logo link goes home, and the header contains the mark and the name. |
| R4 | `e2e/browse.spec.ts`: with 4 items, the cart button reads `Giỏ hàng` and `4` at desktop and opens the drawer. At phone width the search field is below the logo row (bounding boxes). |
| R5 | `e2e/browse.spec.ts`: no category nav in the header. The footer links to each category. |
| R6 | `e2e/browse.spec.ts` (desktop): sidebar counts `24`, `8`, `8`, `8` and the deal count. `aria-current="page"` on the current link. Navigating to drinks works. |
| R7 | `e2e/browse.spec.ts` (mobile): no sidebar, and the icon row has 4 links to the right pages. |
| R8 | `e2e/browse.spec.ts`: banner `h1` and rule text. `Xem ưu đãi` goes to `/deals`. |
| R9 | `e2e/browse.spec.ts`: `Tất cả sản phẩm`, `24 sản phẩm`, 24 tile headings in catalog order. Column count from the tiles' x positions at both sizes. |
| R10 | `ProductTile.test.tsx`: button name and label, `1 trong giỏ`, back to `Thêm` at 0, out of stock disabled. `e2e/browse.spec.ts`: buttons in one grid row share a y position. |
| R11 | `e2e/browse.spec.ts` (desktop): empty panel text. After an add: line, `Phí giao hàng 20.000 ₫`, `Tổng cộng`. + in the panel updates the tile. `Thanh toán` goes to checkout. The panel stays in view after scrolling to the bottom. |
| R12 | `e2e/browse.spec.ts` (mobile): no bar when empty. After an add, the bar shows count and subtotal, and `Xem giỏ` goes to `/cart`. At the bottom, the footer's box ends above the bar's top. |
| R13 | `e2e/browse.spec.ts` (desktop): breadcrumb links and the order of sections on `/p/nuoc-suoi-tinh-khiet`. |
| R14 | `e2e/browse.spec.ts`: choose `Thùng 24 chai`, quantity 2, and the button reads `Thêm vào giỏ · 198.000 ₫`. Arrow and Space choose a pack. |
| R15 | `e2e/checkout.spec.ts`: `Mua ngay` with `Lốc 6 chai` × 3 lands on checkout with that line. Disabled on `/p/dau-goi`. The 99 cap is already covered by `cart.test.tsx`, because `Mua ngay` calls the same `add`. |
| R16 | `e2e/browse.spec.ts`: the card's three texts on a product page. |
| ~~R17~~ | Moved to product-details. |
| R18 | `e2e/browse.spec.ts`: 4 tiles under `Có thể bạn cũng thích`, matching `similarProducts(...).slice(0, 4)` and starting with `Nước khoáng thiên nhiên` (replaces the current similar-products test). |
| R19 | `e2e/browse.spec.ts` (mobile): no `banner` landmark and no search box on a product page. `Quay lại` from home returns home, and opened directly it goes home. The action bar is fixed at the bottom. |
| R20 | `e2e/quality.spec.ts`: the existing keyboard order test (search, add, cart, checkout, place order) passes unchanged. The visual check covers the look. |
| R21 | `e2e/quality.spec.ts`: the existing footer name check. |
| R22 | `e2e/quality.spec.ts`: the existing no-horizontal-scroll and axe tests on every page at both sizes. New: on mobile, tab to the last tile's button above the cart bar and check it isn't behind the bar. |
| R23 | `e2e/browse.spec.ts`: set the viewport to 1280, 1024 and 768 px and check which of sidebar, panel, icon row and header show. |

## Risks

- ~~**Thông tin text:**~~ no longer a risk here: R17 moved to product-details.
- **Test viewports differ from the spec's sizes.** Playwright's Desktop Chrome is 1280 px wide and Pixel 7 is 412 px, while the spec names 1366 and 390. The sidebar and panel breakpoint is exactly 1280 px, so desktop tests get the full layout. Step 10 also checks 1366 and 390 px by hand.
- **Duplicate controls on desktop shop pages:** a product in the cart has a stepper on its tile and another in the panel, both labelled `Số lượng <name>`. Tests that aren't scoped to a tile or the panel will find two. Existing tests are already scoped to the tile, and new ones must be too.
- **Token names no longer describe their colors** (decision 0006). The skill and architecture docs describe them by role to stop wrong picks.
- **The quantity text changes** from `1` to `1 trong giỏ` on tiles, so existing e2e expectations on the tile group's text must change with step 3.
- **Bottom padding relies on CSS `:has()`.** It's supported in Chromium (the only browser tests run in) and in current Safari and Firefox.
- **Removing the search submit button:** search is submitted with Enter only. The R12 search tests already press Enter. A shopper who can't use Enter on a phone keyboard still gets the keyboard's search/go key, because the field has `type="search"` inside a search form.
- **The diff is large** (about 20 files). Each step is meant to be reviewed and committed on its own.
