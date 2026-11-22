# ui-redesign

> Give Cửa hàng của Thy the look and layout from the mockups in `designs/`, without changing what the store sells or how it works.

## Problem

The store works, but it looks plain: a cool grey-green page, a text-only name, small buttons, and long category rows that run off the side of the page. Thy had a set of mockups made (`designs/`, five PNGs: shop and product page at desktop and phone width, and the phone cart) with a warmer, bolder look that feels more like a neighborhood shop. Shoppers should get that look and its easier layout: categories always at hand, the cart always in view on desktop, and big add buttons that are easy to tap.

The mockups also show things the store doesn't do (a coconut category, a 15.000 đ delivery fee, delivery time slots, bank transfer and e-wallet payment, `5.000đ` prices). Those are left out: this feature only changes the look and layout, plus three product page additions that Thy asked for.

## Goals

- Match the mockups' look: warm cream page, deep green actions, one yellow accent, white rounded cards, a logo mark, a black cart button.
- Match the mockups' layout: category sidebar and cart panel on desktop, category icon row and cart bar on phone, one product grid on the home page.
- Match the mockups' product tile and product page, including `Mua ngay` and a delivery and payment card. (The mockups' `Thông tin` table is its own feature, product-details.)

## Non-goals

- Any change to the catalog's categories, subcategories, products, packs or prices.
- Any change to the store rules: unit prices, deals and the deals page, stock levels, the 20.000 ₫ delivery fee and free delivery from 300.000 ₫, the 2-hour delivery promise, cash on delivery as the only payment, and the checkout form.
- Any change to the price format: prices stay `12.000 ₫` ([decision 0003](../../../decisions/0003-prices-in-whole-vnd.md)).
- These parts of the mockups: the `Giao đến: Nhà riêng` address picker, the `Giao ngay / Hẹn giờ` delivery time choice, the bank transfer (QR) and e-wallet options, the store note field, and placing an order straight from the cart panel.
- Dark mode.
- New designs for screens the mockups don't show (search results, deals, checkout, order confirmation, not found). They take the new colors and card style but keep their current content.

## Changes to archived requirements

From [grocery-store](../grocery-store/spec.md):

- **R3** (the look): the page background becomes a warm cream, not a cool color. The yellow accent marks deals, as before, and is also used for the cart count and the home banner button. There is still one action color and still no load animations.
- **R12** (search box on every page): the product page at phone width has no site header, so no search box (see R19 here).
- **R14** (home page content): replaced by R8 and R9 here.
- **R15** (product page): keeps everything it lists, and adds `Mua ngay`, the delivery and payment card and a new heading for similar products (R13 to R18 here).
- **R16** (tile add button): the button reads `Thêm vào giỏ` at desktop width, and the quantity control shows `N trong giỏ` (R10 here). The behaviour is unchanged.

R1, R2, R4 to R11, R13 and R17 to R27 still hold as written.

## Requirements

### Look

- **R1.** The colors follow the mockups:
  - page background: a warm cream
  - cards, panels, the drawer and form fields: white
  - action color (buttons, links, the focus ring, prices): a deep forest green
  - one yellow accent, used only for the cart count, the home banner (its button and icon) and deal badges
  - the three category tints and icon colors keep their hue (peach for snacks, blue for drinks, lavender for essentials), with the mockups' shades.
- **R2.** Body text, secondary text, prices and button text meet WCAG AA contrast (at least 4.5:1) against their background, including text on the yellow accent and on the green.
- **R3.** The header shows a logo mark (a green rounded square with a white basket icon) beside `Cửa hàng của Thy` in green. Together they link to the home page.

### Header

- **R4.** At desktop width the header has, on one row: the logo, a wide search field (cream fill, rounded, search icon inside, placeholder `Tìm đồ ăn vặt, nước uống, nhu yếu phẩm…`), and a black rounded cart button reading `Giỏ hàng` with the item count in a yellow circle. At phone width the logo and the cart button (icon and count, no text) share the first row and the search field fills the second. The cart button opens the cart drawer and keeps its accessible name `Mở giỏ hàng, N món`.
- **R5.** The row of category links under the header is removed. Categories are reached from the sidebar (R6), the icon row (R7), the breadcrumb on product pages and the footer.

### Shop pages (home, category, deals, search)

- **R6.** At desktop width, shop pages have a left sidebar headed `Danh mục` with links, each showing a product count:
  - `Tất cả` → home (24)
  - each category → its page (8 each)
  - `Ưu đãi` → deals (the number of products on a deal).

  Each link has a tinted square with an icon. The current page's link is outlined and marked as the current page for screen readers.
- **R7.** At phone width, shop pages show a row of category icon tiles instead of the sidebar: the three categories and `Ưu đãi`. Each tile is a tinted square with the icon and its name underneath, and links to the same page as in the sidebar. The current page's tile is marked as the current page for screen readers.
- **R8.** The home page starts with a deep green rounded banner. It shows `Giao hàng trong 2 giờ` as its heading, the free-delivery rule (`Miễn phí giao hàng cho đơn từ 300.000 ₫`) and a yellow `Xem ưu đãi` button that links to the deals page, with a decorative yellow line icon on the right at desktop width.
- **R9.** Under the banner (and the icon row at phone width), the home page shows the heading `Tất cả sản phẩm`, the count `24 sản phẩm`, and one grid of all 24 products in catalog order. The grid has 3 columns at desktop width and 2 at phone width.
- **R10.** Product tiles are white rounded cards holding:
  - the tinted image area with the category icon, or the photo (the deal badge sits on it)
  - the name, the pack label and the price in bold green (with the old price struck through on a deal)
  - the unit price and any stock text
  - a full-width button at the bottom of the card. Buttons in the same grid row line up, however long the names are.

  For an in-stock product, the button:
  - is outlined green and reads `+ Thêm vào giỏ` (`+ Thêm` at phone width), with the accessible name `Thêm <name> vào giỏ`
  - once that pack is in the cart, becomes a filled green bar with `−`, `N trong giỏ` (just `N` at phone width) and `+`.

  An out-of-stock product shows `Hết hàng` and its add button is disabled, as today.
- **R11.** At desktop width, shop pages have a white cart panel on the right that stays in view while the page scrolls. It shows:
  - `Giỏ hàng` and the item count (`N món`)
  - one row per cart line: the tinted icon square, the name, the pack label, the line total in green and a − / + quantity control, with the same behaviour as cart page lines
  - the free-delivery progress
  - the subtotal (`Tạm tính`), the delivery fee (`Phí giao hàng`, or `Miễn phí`) and the total (`Tổng cộng`)
  - a full-width green `Thanh toán · <total>` button that goes to checkout.

  With an empty cart it shows `Giỏ hàng đang trống.` and no button.
- **R12.** At phone width, when the cart has items, shop pages show a black bar fixed to the bottom of the screen. It shows the item count in a yellow circle, `Giỏ hàng` and the subtotal, and a `Xem giỏ →` link to the cart page. It is hidden when the cart is empty. The page leaves room so the bar never covers the last content or the footer.

### Product page

- **R13.** At desktop width the product page shows, in order:
  - a breadcrumb (`Trang chủ / <category> / <product>`, the first two are links)
  - a large tinted image on the left
  - on the right:
    - a category chip
    - the name
    - the price in large green type with `/ <pack label>`, the deal badge and old price on a deal, the unit price and any stock text
    - the pack choice
    - the quantity control, the add button and `Mua ngay`
    - the delivery and payment card (R15)
  - below: a `Mô tả sản phẩm` card (product-details adds the `Thông tin` card beside it)
  - then the similar products.
- **R14.** The pack choice, headed `Chọn loại`, shows each pack as a large card with its label and price, and the chosen one is outlined green on a light green tint. As today, it appears only when a product has more than one pack, the arrow keys move between cards, and Space or Enter chooses one. The add button reads `Thêm vào giỏ · <price × quantity>` and updates when the pack or quantity changes.
- **R15.** `Mua ngay` adds the chosen pack and quantity to the cart, following the same rules as the add button (one line per product and pack, at most 99), then goes to checkout. Like the add button, it is disabled for an out-of-stock product.
- **R16.** A delivery and payment card lists, each with an icon:
  - `Giao hàng trong 2 giờ`, with the free-delivery rule underneath
  - `Thanh toán khi nhận hàng (COD)`.
- ~~**R17.**~~ removed: the `Thông tin` table moved to its own feature, [product-details](../../product-details/spec.md), because Thy's text for it arrives after the rest of this feature.
- **R18.** Similar products sit under the heading `Có thể bạn cũng thích`: the first four, chosen in the same order as before, shown as the same product tiles as the grid (R10) in a row of 4 at desktop width and 2 columns at phone width.
- **R19.** At phone width the product page has no site header. The product image fills the width at the top. A round back button (accessible name `Quay lại`) sits at its top left: it goes to the previous page, or home when there is none. A round cart button with the yellow count sits at its top right and opens the drawer. The rest of the page sits in a white panel with rounded top corners that overlaps the bottom of the image. A white bar is fixed to the bottom of the screen with the quantity control and the add button. `Mua ngay` appears under the pack choice. The page leaves room so the bar never covers the last content or the footer.

### Other pages

- **R20.** The cart page, cart drawer, checkout, order confirmation and not found page use the new colors, white rounded cards on cream, and the new cart line style (as in R11). Their content and behaviour don't change.
- **R21.** The footer uses the new colors and keeps its content, including the store name.

### Every page

- **R22.** Every page works at phone width (390 px) and desktop width (1366 px) without horizontal scrolling. Every control can be reached and used with the keyboard and shows a visible green focus ring, and nothing fixed to the screen covers the focused control. The automated accessibility checks pass on every page.

- **R23.** Layout by width:
  - **Shop pages:** the sidebar (R6) and the cart panel (R11) show only when the window is wide enough for them beside a 3-column grid (1280 px and up). Below that, the icon row (R7) shows and the header cart button is the way into the cart.
  - **Phone width (below 768 px):** the cart bar (R12) and the product page's phone layout (R19) show.
  - **Product page from 768 px up:** the desktop layout (R13), with the site header.

## Acceptance criteria

- **R1:** Given any page, then the page background is the cream color, primary buttons use the green action color, and the yellow accent appears only on the cart count, the home banner's button and icon, and deal badges.
- **R2:** Given body text, secondary text, prices and button text on their usual backgrounds (cream, white, green, yellow, black), then each has a contrast ratio of at least 4.5:1.
- **R3:** Given any page at desktop width, when I select the logo, then I'm on the home page, and the header shows the basket mark beside `Cửa hàng của Thy`.
- **R4:** Given a cart with 4 items at desktop width, then the header shows `Giỏ hàng` and `4` in the cart button. When I press it, the cart drawer opens. Given phone width, then the logo and cart button share a row and the search field sits below them.
- **R5:** Given any page, then there's no category link row under the header, and each category can be reached from the footer.
- **R6:** Given the snacks category page at desktop width, then the sidebar lists `Tất cả 24`, the three categories with `8` each and `Ưu đãi` with the deal count, and the snacks link is marked as the current page. When I select `Nước uống`, then I'm on the drinks category page.
- **R7:** Given the home page at phone width, then there's no sidebar, and a row of four icon tiles (three categories and `Ưu đãi`) links to their pages.
- **R8:** Given the home page, then the banner shows `Giao hàng trong 2 giờ` and `Miễn phí giao hàng cho đơn từ 300.000 ₫`. When I select `Xem ưu đãi`, then I'm on the deals page.
- **R9:** Given the home page, then it shows `Tất cả sản phẩm` and `24 sản phẩm`, followed by 24 product tiles in catalog order, in 3 columns at 1366 px and 2 at 390 px.
- **R10:** Given an empty cart at desktop width, when I select `Thêm Nước suối tinh khiết vào giỏ`, then that tile's button becomes `1 trong giỏ` with − and +. At phone width the button reads `Thêm` and then `1`. Given an out-of-stock product, then its tile shows `Hết hàng` and its add button is disabled. Given a grid row where one name wraps to two lines, then the buttons in that row are at the same height.
- **R11:** Given an empty cart at desktop width on the home page, then the panel shows `Giỏ hàng đang trống.` and no checkout button. When I add a product, then the panel shows its line, `Tạm tính`, `Phí giao hàng 20.000 ₫` and `Tổng cộng`. When I press + in the panel, then the line and the tile both show quantity 2. When I select `Thanh toán`, then I'm on checkout. When I scroll to the bottom of the home page, then the panel is still in view.
- **R12:** Given an empty cart at phone width, then no cart bar shows. When I add a product, then a bar shows `1`, `Giỏ hàng` and the subtotal. When I select `Xem giỏ`, then I'm on the cart page. When I scroll to the bottom, then the whole footer can be seen and none of it is behind the bar.
- **R13:** Given `Nước suối tinh khiết` at desktop width, then the page shows the breadcrumb `Trang chủ / Nước uống / Nước suối tinh khiết` with the first two as links, the category chip, the price `5.000 ₫ / Chai 500 ml`, the unit price, the pack cards, the buttons, the delivery and payment card, `Mô tả sản phẩm` and `Có thể bạn cũng thích`, in that order.
- **R14:** Given `Nước suối tinh khiết`, when I choose `Thùng 24 chai` and quantity 2, then that card is marked chosen and the add button reads `Thêm vào giỏ · 198.000 ₫`. When I move to another pack card with the arrow keys and press Space, then that pack is chosen.
- **R15:** Given an empty cart, when I choose `Lốc 6 chai` and quantity 3 on `Nước suối tinh khiết` and select `Mua ngay`, then I'm on checkout and the cart has 3 × `Lốc 6 chai`. Given a line already at 98, when I buy 5 more of it with `Mua ngay`, then its quantity is 99. Given an out-of-stock product, then `Mua ngay` is disabled.
- **R16:** Given any product page, then the delivery and payment card shows `Giao hàng trong 2 giờ`, `Miễn phí giao hàng cho đơn từ 300.000 ₫` and `Thanh toán khi nhận hàng (COD)`.
- ~~**R17**~~ removed: moved to product-details.
- **R18:** Given `Nước suối tinh khiết`, then `Có thể bạn cũng thích` shows four tiles, and they are the first four of its similar products, starting with `Nước khoáng thiên nhiên` from the same subcategory.
- **R19:** Given a product page at phone width, then there's no site header or search box. The image is at the top with `Quay lại` and the cart button over it, and a bar fixed to the bottom shows the quantity control and the add button. When I arrive from the home page and select `Quay lại`, then I'm back on the home page. When I open the product page directly and select `Quay lại`, then I'm on the home page.
- **R20:** Given the cart page, drawer, checkout, order confirmation and not found page, then each uses the cream background and white cards. A full keyboard order (search, add, open the cart, check out, place the order) still works as before.
- **R21:** Given any page, then the footer shows `Cửa hàng của Thy` in the new colors.
- **R22:** Given each page at 390 px and at 1366 px wide, then the page is no wider than the window, and the axe checks report no violations. Given keyboard-only use, then every control shows a green focus ring, and when focus reaches the last control above a fixed bar, that control is fully visible.
- **R23:** Given the home page at 1280 px, then the sidebar and cart panel show and the icon row doesn't. At 1024 px, the icon row shows and the sidebar, panel and cart bar don't. Given a product page at 768 px, then the site header shows and the cart button opens the drawer.

## Open questions

None. Resolved 2026-11-22: the layout breakpoints are set in R23. The `Thông tin` table (R17) moved to product-details, since Thy provides its text later.
