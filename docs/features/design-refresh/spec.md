# design-refresh

## Problem

The owner has a new design for Cửa hàng của Thy: five screens in `/design/` (`Main`, `Product` and `Cart` for phones; `Desktop` and `DesktopProduct` from 1024 px). It brings a warmer palette (deep green, warm yellow, cream), an app-like phone layout with a floating cart bar, and a desktop shop page with a category sidebar and a cart panel that stays in view while you browse.

The mockups are a look and layout, not a new store. Their sample catalog, delivery fee, delivery-time choice and payment methods are placeholders. The owner decided (2026-11-22) that everything the store does today stays: the 24-product catalog in three categories, cash on delivery only with no time choice, the separate checkout page, deals, unit prices, free-delivery progress, the category sort and filters, and prices shown as `12.000 ₫`.

This feature changes these archived requirements from **grocery-store**:

| Archived requirement | What changes |
|---|---|
| grocery-store R3 (cool low-saturation background; the warm color marks deals only) | Cream background and the design's colors (R1). The yellow accent marks deals and also the cart count badge and the home hero button (R16) |
| grocery-store R12 (search box in the header on every page) | On phones, the product page and the cart page have no site header and so no search box, as in `Product` and `Cart` (R4) |
| grocery-store R14 (home page sections) | The home page becomes the shop screen: a hero, the category chooser and all products (R9, R10) |
| grocery-store R15 (product page) | Same content, new layout, plus `Mua ngay` on desktop (R15) |
| grocery-store R16 (`Thêm` on tiles) | Tile wording and look follow the mockups (R11). The behaviour is unchanged |
| grocery-store R20 (cart drawer and cart page) | The cart drawer is removed. The free-delivery message and bar move to the cart page and the desktop cart panel (R13, R14) |

Everything else in grocery-store still applies, in particular R7 (prices like `12.000 ₫`), R8 (unit prices), R9 (deals), R10 (stock), R13 (category filter, sort and in-stock option in the address), R17–R19 (cart rules), R21–R25 (delivery, checkout, COD) and R26 (390 px / 1366 px, keyboard, focus ring).

## Goals / Non-goals

**Goals**
- The five mockup screens, built on the real catalog, cart and store rules.
- One palette, set once as theme tokens, used by every page, including the ones with no mockup.
- On desktop, a cart that stays visible while shopping.

**Non-goals**
- Anything from the mockups' sample logic: their 16 products and `Dừa` category, the flat 15.000 đ fee, the `Giao ngay` / `Hẹn giờ` choice, bank QR and e-wallet payment, the note field, and `Đặt hàng` placing an order straight from the cart.
- The `Giao đến · Nhà riêng` address picker in the mockup headers. There are no accounts or saved addresses; the address is entered at checkout.
- New product data such as origin (`Xuất xứ`) or storage (`Bảo quản`).
- Redesigning checkout, order confirmation, search, deals or not-found beyond the new palette and shared components.
- A dark theme.

## Requirements

**Look**

- **R1.** The site uses the design's palette, defined once as theme tokens: background `#F7F5EE`, tiles and panels `#FFFFFF`, text `#1C1C18`, secondary text `#5E5E56`, action green `#1E5B3A` (hover `#143F28`), accent `#F2C14E`, borders `#ECE9DF` / `#E4E1D6`, the summary panel `#EDEAE0` and the selected-option tint `#E6F0DF`. Category tints follow the mockups: snacks `#FBEBD9` with icon `#9A4A12`, water and drinks `#E3EFF6` with `#1F5F86`, essentials `#EFE9F5` with `#5B4386`. Every page uses these, including pages with no mockup.
- **R2.** All body text, secondary text and button text meets WCAG AA contrast (at least 4.5:1) against its background. (Measured from the mockups: the lowest pairing is secondary text on the summary panel at 5.4:1.)
- **R3.** Every tappable control (buttons, links, steppers, category choices, pack choices) has a target of at least 44 × 44 px, is a real button, link or labelled form control, and keeps the global focus ring. This overrides the mockups where they differ (the `all: unset` category buttons, `outline: none` search fields, the 28–32 px `Nhà riêng` and `Xem tất cả` controls).
- **R16.** The yellow accent is used only for: the deal discount badge (ink text on it), the cart count badge, and the home hero's button. A deal's old price is struck through in secondary text.

**Shop screens (home and category pages)**

- **R9.** The home page (`/`) and each category page (`/c/:slug`) share one shop layout. A category chooser lists `Tất cả` (linking to `/`) and the three categories (linking to their pages), each with its tint and icon; the current one is marked as selected (`aria-current="page"`). On phones the chooser is a row of category tiles as in `Main`; from 1024 px it is a sidebar with a product count per entry as in `Desktop`. The home page lists all products; a category page lists that category's products with its subcategory filter, sort and in-stock option (grocery-store R13). The header no longer has its own category row.
- **R10.** The home page starts with a green hero, as in the mockups, that shows the delivery promise (`Giao hàng trong 2 giờ`), the free-delivery rule and a yellow button linking to `/deals`.
- **R11.** Product tiles follow the mockups: tinted image area, name, pack, price in green, and an outlined `Thêm` button (`Thêm vào giỏ` from 1024 px) that becomes a solid green − / + control once the pack is in the cart (`N trong giỏ` from 1024 px). Tiles keep the unit price, the deal badge and old price, and the stock wording (grocery-store R8–R10). An out-of-stock tile has no add button.
- **R12.** On phones, whenever the cart isn't empty, the shop screens show a floating cart bar at the bottom, as in `Main`: the item count in a yellow badge, `Giỏ hàng` with the subtotal, and `Xem giỏ` linking to `/cart`. It doesn't cover the last row of products.

**Cart**

- **R13.** The cart page follows `Cart`: a back link to the shop, the heading `Giỏ hàng` with the item count, one row per line (image, name, pack, line total, − / + control), the free-delivery message and bar, and a summary with `Tạm tính`, `Phí giao hàng` (store rules, or `Miễn phí`) and `Tổng cộng`. A fixed bottom button `Đặt hàng · <total>` goes to `/checkout`. An empty cart shows `Giỏ hàng đang trống` with a `Tiếp tục mua sắm` link, and no order button.
- **R5.** From 1024 px wide, the shop screens show a cart panel beside the products, as in `Desktop`. It stays in view while the page scrolls and has the same content and actions as the cart page (R13): lines with − / + controls, free-delivery message and bar, summary, and `Đặt hàng · <total>` to `/checkout`. When empty it says `Giỏ hàng đang trống. Thêm vài món bên trái nhé.`
- **R14.** The cart drawer is removed. The header cart button (with its yellow count badge) links to `/cart`, except on desktop shop screens, where it moves focus to the cart panel.

**Product page**

- **R4.** On phones, the shop, product and cart screens match `Main`, `Product` and `Cart` in layout, spacing and type. The product and cart pages have no site header: the product page has floating back and cart buttons over its image, and the cart page has its own back link.
- **R6.** From 1024 px wide, the product page matches `DesktopProduct`, with the site header and a breadcrumb `Trang chủ / <category> / <product>`.
- **R15.** The product page keeps the content of grocery-store R15 in the new layout: a category chip, name, price and unit price for the chosen pack, the packs as two-line choice buttons (name and price), stock state, quantity − / +, and `Thêm vào giỏ · <price × quantity>`. After adding, the phone page's button becomes `Đã thêm · Xem giỏ hàng` (a link to `/cart`) until the pack or quantity changes, and the desktop page announces `Đã thêm <n> <pack> vào giỏ hàng` in a status message. From 1024 px there is also `Mua ngay`, which adds the chosen pack and quantity and goes to `/checkout`. The page ends with `Có thể bạn cũng thích`: similar products as in grocery-store R15, as a scrolling row on phones and a grid on desktop, each with an add button.

**Behaviour kept from today**

- **R7.** Every product tile opens that product's own page at `/p/:slug`.
- **R8.** There is one cart. Adding, changing or removing an item anywhere (tile, product page, cart page, cart panel) shows the same result everywhere else at once, and survives a reload.
- **R17.** The `storefront-ui` skill and `docs/architecture.md` describe the new tokens and layout, so later UI work follows the new look.

## Acceptance criteria

- **R1:** Given any page, then the page background is `#F7F5EE`, body text is `#1C1C18`, and the primary button and links are `#1E5B3A`. Given the source in `src/`, then no component contains a hex color; they all come from `src/index.css`.
- **R2:** Given every page at both sizes, then axe reports no color-contrast violations.
- **R3:** Given every page at 390 px, then every button and link is at least 44 px high and wide. Given keyboard-only use, then every control shows the focus ring when focused.
- **R4:** Given the shop, a product page and the cart at 390 px, when compared with `Main`, `Product` and `Cart`, then layout, colors and type match; the product and cart pages show no site header.
- **R5:** Given the home page at 1366 px with two lines in the cart, when I scroll to the bottom, then the cart panel is still visible with both lines. When I press + in the panel, then the tile and the header badge show the new quantity. When I press `Đặt hàng`, then I'm on `/checkout`.
- **R6:** Given a product page at 1366 px, when compared with `DesktopProduct`, then layout, colors and type match, and the breadcrumb links to `/` and to the product's category.
- **R7:** Given the home page, when I open two different tiles, then each opens its own `/p/:slug` page with its own name and price.
- **R8:** Given a product added from a tile, when I open its product page, the cart page and (at 1366 px) the cart panel, then each shows the same quantity, and after a reload it's still there.
- **R9:** Given `/` at 390 px, then I see `Tất cả` selected and tiles for the three categories; pressing one opens `/c/:slug` with that category selected. Given `/c/:slug` at 1366 px, then the sidebar lists `Tất cả` and the three categories with their product counts, the current one marked with `aria-current="page"`, and the subcategory filter, sort and in-stock option work and stay in the address.
- **R10:** Given the home page, then the hero shows `Giao hàng trong 2 giờ` and the free-delivery rule, and its button opens `/deals`.
- **R11:** Given a tile for an in-stock product, when I press `Thêm`, then it becomes a − / + control showing 1; at 1366 px the button reads `Thêm vào giỏ` and the control reads `1 trong giỏ`. Given a deal, then the tile shows the yellow badge and the struck-through old price. Given an out-of-stock product, then its tile shows `Hết hàng` and no add button.
- **R12:** Given the home page at 390 px, when the cart is empty, then no cart bar shows. When I add a product, then the bar shows the count and subtotal, and `Xem giỏ` opens `/cart`. When I scroll to the bottom, then the last row of tiles is not hidden behind the bar.
- **R13:** Given a cart with a 120.000 ₫ subtotal, then the cart page shows the free-delivery message and bar, `Phí giao hàng` 20.000 ₫, `Tổng cộng` 140.000 ₫, and `Đặt hàng · 140.000 ₫`, which opens `/checkout`. Given an empty cart, then it shows `Giỏ hàng đang trống`, a `Tiếp tục mua sắm` link and no order button.
- **R14:** Given any page, then there is no cart drawer. Given a product page at either size, when I press the header cart button, then `/cart` opens. Given the home page at 1366 px, when I press it, then focus moves to the cart panel.
- **R15:** Given `Nước suối tinh khiết` at 390 px, when I choose `Thùng 24 chai` and quantity 2 and press `Thêm vào giỏ`, then the cart has 2 × `Thùng 24 chai` and the button reads `Đã thêm · Xem giỏ hàng`; changing the quantity brings `Thêm vào giỏ` back. At 1366 px, after adding, the status message says it was added; pressing `Mua ngay` adds the pack and opens `/checkout`. Similar products from `Nước suối` come first.
- **R16:** Given the home page, then the yellow accent appears only on deal badges, the cart count badge and the hero button.
- **R17:** Given the finished feature, then `.claude/skills/storefront-ui/SKILL.md` and `docs/architecture.md` name the new tokens, and neither mentions sea, apricot or mist, or the cart drawer.

## Open questions

1. **Hero wording.** The mockup's `Dừa xiêm tươi mỗi sáng` doesn't fit the catalog. Proposed heading `Ưu đãi hôm nay`, with `Giao hàng trong 2 giờ · Miễn phí giao hàng cho đơn từ 300.000 ₫` below and a `Xem ưu đãi` button. Owner to confirm or give the copy.
2. **Screenshots.** The mockups need their design tool's `support.js` to render, so `/design/` has no screenshots yet. Export a PNG of each screen into `/design/` before `/implement`, so each slice can be compared against a picture.
3. **Shadows.** The mockups use a drop shadow on elements that float over content (the phone cart bar, the round buttons over the product image). `storefront-ui` currently says no shadows. Proposed: allow a shadow only on elements that float over content.
