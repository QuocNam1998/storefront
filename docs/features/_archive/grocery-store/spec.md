# grocery-store

## Problem

The storefront is a demo for a coffee roaster (Second Crack). The owner wants to run it as **Cửa hàng của Thy**, a small neighborhood grocery that sells snacks, water and drinks, and everyday essentials to shoppers in Vietnam. Grocery shoppers behave differently from coffee shoppers. They buy many cheap items per order, mostly by searching or browsing a category, and they compare pack sizes and prices. They expect prices in đồng, a Vietnamese interface and address form, and cash on delivery. The owner wants the site to feel peaceful and calm.

This feature replaces the coffee catalog and the coffee-specific behavior with a grocery store. It changes these archived requirements from **test-setup**:

| Archived requirement | What changes |
|---|---|
| test-setup R8 (shipping rules: standard $5 / free from $40, express $12) | Replaced by R21: one delivery fee in đồng with a free-delivery threshold |
| test-setup R9 (next roast date) | Dropped: the grocery has no roast schedule (R27) |
| test-setup R10 (cart lines by coffee size and grind, at most 20 per line) | Replaced by R17–R19: lines by product and pack, at most 99 per line |
| test-setup R11 (full coffee order in the browser) | Replaced by R25: a full grocery order |

## Goals / Non-goals

**Goals**
- A Vietnamese grocery storefront with three categories: Snacks, Water & drinks, and Essentials.
- Fast shopping: search, category browsing, and adding to the cart straight from a product tile.
- Prices in VND, with a unit price so pack sizes can be compared.
- A calm, quiet look.
- A Vietnamese checkout with a phone number, a two-level address and cash on delivery.
- The same demo limits as before: no backend and no real payment, with orders kept in the browser.

**Non-goals**
- Real product photos. Placeholders are used until the owner has photos, but a photo must be easy to add later.
- Choosing a delivery day or time slot.
- Bank transfer, cards, e-wallets or any real payment.
- Accounts, order history, a "buy again" list, coupons or loyalty points.
- An English or bilingual interface.
- Stock that changes as orders are placed. Stock levels are fixed in the catalog.
- A backend, an admin page or inventory management.

## Requirements

**Brand and look**

- **R1.** The store is called **Cửa hàng của Thy**. The name appears in the header, the footer and the browser tab title. The page language is Vietnamese (`lang="vi"`).
- **R2.** All text a shopper sees is in Vietnamese: navigation, buttons, labels, messages, errors and product content. Prices use đồng. No coffee content remains anywhere (Second Crack, roast, grind, origin, brewing gear).
- **R3.** The look is calm. The page background is a soft, low-saturation cool color. There is one color for actions (buttons, links, focus). One separate warm color is used only to mark deals. There are no load animations, and motion only answers a shopper's action. With reduced motion turned on, nothing animates.
- **R4.** All body text, secondary text and button text meets WCAG AA contrast (at least 4.5:1) against its background.

**Catalog**

- **R5.** Products belong to one of three categories, and each category has four subcategories:

  | Category | Subcategories |
  |---|---|
  | Đồ ăn vặt (Snacks) | Snack & khoai tây chiên · Bánh quy & bánh gạo · Hạt & trái cây sấy · Kẹo |
  | Nước uống (Water & drinks) | Nước suối · Nước có ga · Nước ép & sữa · Trà |
  | Nhu yếu phẩm (Essentials) | Giấy & khăn giấy · Vệ sinh nhà cửa · Chăm sóc cá nhân · Gạo & gia vị |

- **R6.** Each product has one or more packs, for example `Chai 500 ml`, `Lốc 6 chai` and `Thùng 24 chai`. Each pack has its own price in whole đồng. The store starts with the 24 products in the appendix.
- **R7.** Every price is shown in Vietnamese format with no decimals, for example `12.000 ₫` and `185.000 ₫`.
- **R8.** Product tiles and product pages show a unit price for the selected pack:
  - per 100 g for products sold by weight, for example `12.000 ₫/100 g`
  - per litre for products sold by volume, for example `9.333 ₫/L`
  - per item for products sold by count, for example `7.900 ₫/cuộn`
  Unit prices are rounded to whole đồng.
- **R9.** A pack can be on a deal, which means it has an old price. A deal shows a discount badge (for example `-15%`, rounded to a whole percent) and the old price struck through. A deals page lists every product that has a pack on a deal.
- **R10.** A product is in stock, low on stock or out of stock. A low-stock product shows `Sắp hết hàng`. An out-of-stock product shows `Hết hàng` and can't be added to the cart from anywhere.
- **R11.** Until a product has a photo, it shows a placeholder: a square in its category's color with an icon for its subcategory. When a photo is added to a product's data, the photo shows instead, with no other change needed.

**Browsing**

- **R12.** A search box is in the header on every page. Searching shows a results page.
  - Search ignores Vietnamese accents and letter case, so `nuoc suoi` finds `Nước suối` and `GIAY` finds `Giấy vệ sinh 3 lớp`.
  - It matches product names, subcategory names and descriptions, and lists name matches first.
  - When nothing matches, the page says `Không tìm thấy sản phẩm nào cho "<query>"` and links to the three categories.
- **R13.** Each category has a page that lists its products. The shopper can:
  - filter by subcategory
  - sort by popularity (the default), price low to high, price high to low, or unit price low to high
  - choose to show only products that are in stock
  The chosen filter, sort and in-stock option are kept in the page address, so the view survives a reload and can be shared.
- **R14.** The home page shows, in order:
  - the delivery promise (R22) and the free-delivery rule (R21)
  - one tile per category, linking to its page
  - a row of deals
  - a row of products for each category, with a link to the full category
- **R15.** A product page shows the product's image, name, pack choice, price, unit price, stock state and description, plus a quantity choice and a button to add it to the cart. It also lists similar products: first from the same subcategory, then from the same category.
- **R16.** Every in-stock product tile has a `Thêm` (add) button that adds one of the product's first pack. Once that pack is in the cart, the button becomes a − / + quantity control on the tile. Taking the quantity to 0 removes it from the cart and brings the `Thêm` button back.

**Cart**

- **R17.** A cart line is one product in one pack. Adding the same product and pack again adds to that line's quantity. A different pack of the same product gets its own line.
- **R18.** A line's quantity is never more than 99.
- **R19.** The cart is still there after the page reloads. On load, saved items that are no longer in the catalog are dropped, and a cart saved by the old coffee store is ignored.
- **R20.** The cart drawer and the cart page show how much more the shopper needs to spend for free delivery, for example `Mua thêm 45.000 ₫ để được miễn phí giao hàng`, along with a progress bar. When the threshold is reached, they say `Đơn hàng được miễn phí giao hàng`.

**Checkout and orders**

- **R21.** Delivery costs 20.000 ₫, and is free when the cart subtotal is 300.000 ₫ or more. Checkout and the order confirmation show the subtotal, the delivery fee (or `Miễn phí`) and the total.
- **R22.** The store promises delivery within 2 hours: `Giao hàng trong 2 giờ`. The promise is shown on the home page, at checkout and on the order confirmation. The shopper doesn't choose a delivery day or time.
- **R23.** The checkout form asks for:

  | Field | Required | Rule |
  |---|---|---|
  | Họ và tên | yes | |
  | Số điện thoại | yes | Ignoring spaces and dots: 0 followed by 9 digits, or +84 followed by 9 digits |
  | Email | no | If filled in, it must look like an email address |
  | Số nhà, tên đường | yes | |
  | Phường/Xã | yes | |
  | Tỉnh/Thành phố | yes | A list: Hà Nội, TP. Hồ Chí Minh, Đà Nẵng, Hải Phòng, Cần Thơ, and `Khác` (other). Choosing `Khác` asks for the province name, which is then required. |
  | Ghi chú cho người giao hàng | no | |

  There is no district field and no postal code, since Vietnam uses a two-level address.
  If the shopper tries to place the order with problems, the page lists how many fields need attention, shows a Vietnamese message under each problem field, and moves focus to the first one.
- **R24.** The only payment method is `Thanh toán khi nhận hàng (COD)`. Checkout says this is a demo store and that the order is only saved in this browser.
- **R25.** Placing a valid order:
  - gives it an id of `THY-` followed by 6 digits
  - saves it in the browser
  - empties the cart
  - opens the order confirmation
  The confirmation thanks the shopper by name, and shows the delivery promise, the phone number, the address, each item with its pack and quantity, and the totals. It has a `Tiếp tục mua sắm` (continue shopping) button. Opening the confirmation link in a browser that doesn't have the order says the order wasn't found.

**Quality**

- **R26.** Every page works at phone width (390 px) and desktop width (1366 px) without horizontal scrolling. Every control can be reached and used with the keyboard, and shows a visible focus ring.
- **R27.** The roast schedule is gone: there's no roast date anywhere, and the "Monday orders get a roast date that has already passed" known concern no longer applies.

## Acceptance criteria

- **R1:** Given any page, then the header and footer show `Cửa hàng của Thy`, the tab title contains `Cửa hàng của Thy`, and `<html>` has `lang="vi"`.
- **R2:** Given the finished feature, when every page is visited (home, each category, deals, search, a product, cart, checkout, confirmation, not found), then no visible text contains `Second Crack`, `roast`, `grind`, `coffee`, `cà phê`, `$` or `USD`. (`rang` is allowed, because `Hạt điều rang muối` means roasted cashews.)
- **R3**
  - Given the home page, then the page background, the action color and the deal color are three different colors, and the deal color appears only on deal badges and old prices.
  - Given reduced motion is turned on, when the home page loads, then no element animates.
- **R4:** Given body text, secondary text and button text on their usual backgrounds, then each has a contrast ratio of at least 4.5:1.
- **R5:** Given the catalog, then it has exactly the three categories and twelve subcategories in R5, and every product belongs to one of them.
- **R6:** Given the catalog, then it has the 24 products in the appendix, each with at least one pack, and every pack price is a whole number of đồng.
- **R7:** Given a pack priced at 12000 đồng, then it shows as `12.000 ₫`. Given 185000, then it shows as `185.000 ₫`. No price on the site shows a decimal separator followed by digits.
- **R8**
  - Given `Lốc 6 chai` of 500 ml at 28.000 ₫, then the unit price is `9.333 ₫/L`.
  - Given a 52 g pack at 12.000 ₫, then it's `23.077 ₫/100 g`.
  - Given `Lốc 10 cuộn` at 79.000 ₫, then it's `7.900 ₫/cuộn`.
- **R9**
  - Given a pack at 115.000 ₫ with an old price of 135.000 ₫, then its tile shows `-15%` and `135.000 ₫` struck through.
  - Given the deals page, then it lists exactly the products with a pack on a deal.
- **R10**
  - Given a low-stock product, then its tile and page show `Sắp hết hàng`.
  - Given an out-of-stock product, then its tile and page show `Hết hàng`, and there is no enabled control that adds it to the cart.
- **R11**
  - Given a product with no photo, then its image is a square in its category's color with an icon.
  - Given the same product with a photo path set, then the photo shows instead, with the product name as its alternative text.
- **R12**
  - Given the header search, when I search `nuoc suoi`, then the results include `Nước suối tinh khiết`.
  - When I search `banh`, then the results include `Bánh quy bơ` and `Bánh gạo nướng vị ngọt`.
  - When I search `xyz123`, then the page says `Không tìm thấy sản phẩm nào cho "xyz123"` and links to the three categories.
- **R13**
  - Given the drinks category page, when I choose `Nước suối`, then only still-water products are listed and the address contains that choice.
  - When I reload, then the same choice is still applied.
  - When I sort by price low to high, then each listed product's first-pack price is no lower than the one before it.
  - When I tick in-stock only, then no out-of-stock product is listed.
- **R14:** Given the home page, then it shows, in order: the delivery promise with the free-delivery rule, three category tiles, a deals row, and one product row per category, each with a link to its category.
- **R15:** Given `Nước suối tinh khiết`, when I choose `Thùng 24 chai` and quantity 2 and add it to the cart, then the cart has 2 × `Thùng 24 chai`, and the page lists similar products from `Nước suối` first.
- **R16**
  - Given an in-stock product tile and an empty cart, when I press `Thêm`, then the cart count is 1 and the tile shows a quantity control reading 1.
  - When I press + twice, then it reads 3.
  - When I press − three times, then the product leaves the cart and `Thêm` is back.
- **R17:** Given an empty cart, when the same product and pack is added with quantity 1 and then 2, then there's one line with quantity 3. When a different pack of that product is added, then there are two lines.
- **R18:** Given a line with quantity 98, when 5 more are added, then its quantity is 99.
- **R19**
  - Given a cart with one line, when the page reloads, then the line is still there.
  - Given saved data with one real product and one unknown product, when the cart loads, then only the real product appears.
  - Given a cart saved by the coffee store, when the grocery store loads, then the cart is empty.
- **R20**
  - Given a 255.000 ₫ subtotal, then the cart says `Mua thêm 45.000 ₫ để được miễn phí giao hàng`.
  - Given a 300.000 ₫ subtotal, then it says `Đơn hàng được miễn phí giao hàng`.
- **R21:** Given a subtotal of 299.999 ₫, then delivery is 20.000 ₫. Given 300.000 ₫, then delivery is free and shows `Miễn phí`. The total is always the subtotal plus delivery.
- **R22:** Given the home page, checkout and an order confirmation, then each shows `Giao hàng trong 2 giờ`, and checkout has no control for choosing a day or time.
- **R23**
  - Given an empty form, when I place the order, then the page says 5 fields need attention (`Họ và tên`, `Số điện thoại`, `Số nhà, tên đường`, `Phường/Xã` and `Tỉnh/Thành phố`), each shows a Vietnamese message, and focus moves to `Họ và tên`.
  - Given the phone `090 123 4567` or `+84 90.123.4567`, then it's accepted. Given `12345`, then it isn't.
  - Given `Khác` is chosen for the province and the province name is left empty, then the order isn't placed and that field shows a message.
  - The form has no district or postal-code field.
- **R24:** Given checkout, then the only payment method is `Thanh toán khi nhận hàng (COD)`, and the demo notice is shown.
- **R25**
  - Given an empty cart, when a shopper adds a product from a tile, adds another from its product page, goes to checkout, fills in valid details and places the order, then the page is `/order/THY-` followed by 6 digits.
  - It shows the shopper's name, phone number, address, both products with their packs, the totals and `Giao hàng trong 2 giờ`.
  - The header cart count is 0.
  - Given `/order/THY-000000` in a browser without that order, then the page says the order wasn't found.
- **R26:** Given each page at 390 px and at 1366 px wide, then the page is no wider than the window. Given keyboard-only use, then a shopper can search, add a product, open the cart and place an order, with a visible focus ring on every focused control.
- **R27:** Given the finished feature, then no page or code mentions a roast date, and the Monday roast-date item is gone from "Known concerns" in `docs/architecture.md`.

## Open questions

None.

## Appendix: starter catalog

Names are generic, not real brands. Prices are in đồng. An old price means the pack is on a deal (R9).

| # | Product | Subcategory | Packs: price (old price) | Stock |
|---|---|---|---|---|
| 1 | Khoai tây chiên vị tảo biển | Snack & khoai tây chiên | Gói 52 g: 12.000 · Lốc 5 gói: 55.000 | in |
| 2 | Snack rong biển sấy giòn | Snack & khoai tây chiên | Lốc 3 gói × 5 g: 25.000 | in |
| 3 | Bánh quy bơ | Bánh quy & bánh gạo | Hộp 454 g: 89.000 | in |
| 4 | Bánh gạo nướng vị ngọt | Bánh quy & bánh gạo | Gói 150 g: 28.000 | in |
| 5 | Hạt điều rang muối | Hạt & trái cây sấy | Hũ 250 g: 115.000 (135.000) · Hũ 500 g: 220.000 | in |
| 6 | Đậu phộng da cá | Hạt & trái cây sấy | Gói 200 g: 32.000 | in |
| 7 | Mít sấy giòn | Hạt & trái cây sấy | Gói 100 g: 35.000 | in |
| 8 | Kẹo dẻo trái cây | Kẹo | Gói 100 g: 18.000 | in |
| 9 | Nước suối tinh khiết | Nước suối | Chai 500 ml: 5.000 · Lốc 6 chai: 28.000 · Thùng 24 chai: 99.000 (115.000) | in |
| 10 | Nước khoáng thiên nhiên | Nước suối | Chai 1,5 L: 12.000 · Lốc 6 chai: 68.000 | in |
| 11 | Nước khoáng có ga | Nước có ga | Lon 330 ml: 15.000 · Lốc 6 lon: 85.000 | in |
| 12 | Soda chanh | Nước có ga | Lon 330 ml: 10.000 · Lốc 6 lon: 56.000 | in |
| 13 | Nước ép cam | Nước ép & sữa | Chai 1 L: 45.000 | in |
| 14 | Sữa đậu nành | Nước ép & sữa | Lốc 4 hộp × 200 ml: 22.000 | in |
| 15 | Trà xanh không đường | Trà | Chai 450 ml: 10.000 · Thùng 24 chai: 220.000 | in |
| 16 | Nước dừa đóng hộp | Nước ép & sữa | Hộp 330 ml: 18.000 | low |
| 17 | Giấy vệ sinh 3 lớp | Giấy & khăn giấy | Lốc 10 cuộn: 79.000 | in |
| 18 | Khăn giấy rút | Giấy & khăn giấy | Lốc 3 gói × 180 tờ: 45.000 | in |
| 19 | Nước rửa chén hương chanh | Vệ sinh nhà cửa | Chai 750 g: 32.000 | in |
| 20 | Nước giặt | Vệ sinh nhà cửa | Túi 3,6 kg: 185.000 (215.000) | in |
| 21 | Kem đánh răng | Chăm sóc cá nhân | Tuýp 180 g: 38.000 | in |
| 22 | Dầu gội | Chăm sóc cá nhân | Chai 650 ml: 129.000 | out |
| 23 | Gạo ST25 | Gạo & gia vị | Túi 5 kg: 185.000 | in |
| 24 | Nước mắm | Gạo & gia vị | Chai 500 ml: 55.000 | in |
