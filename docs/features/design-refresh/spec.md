# design-refresh

> **Draft.** Written from the design handoff notes before the mockup files were in the repo. Settle the open questions and check every requirement against `/design/*.dc.html` before running `/plan`.

## Problem

The owner has a new design for Cửa hàng của Thy: five screens (`Main`, `Product`, `Cart` for phones; `Desktop`, `DesktopProduct` from 1024 px), handed over as `.dc.html` mockups with screenshots in `/design/`. It brings a new palette (deep green, warm yellow accent, warm cream background) and, on desktop, a shop page with a category sidebar and a cart panel that stays in view. Shoppers on a laptop then see their cart while they browse instead of opening a drawer.

This feature changes these archived requirements from **grocery-store**:

| Archived requirement | What changes |
|---|---|
| grocery-store R3 (calm look, *cool* low-saturation background, one action color, one warm deal color) | The background becomes the design's warm cream and the colors come from the design (R1, R2). Whether the yellow accent is still for deals only is open question 2 |
| grocery-store R13 (category page filters) | On desktop, categories are picked from a sidebar on the shop page (R5). The filter, sort and in-stock option stay in the address |
| grocery-store R14 (home page layout) | The shop screens follow `Main` and `Desktop` (R4, R5) |
| grocery-store R15 (product page) | Follows `Product` and `DesktopProduct` (R6). Content stays the same |
| grocery-store R20 (cart drawer) | On desktop the sticky cart panel takes the drawer's place (R5); see open question 4 |

Everything else in grocery-store, including prices in đồng (R7), the cart rules (R17–R19), delivery (R21–R22), checkout (R23–R25) and the 390 px / 1366 px layout rule (R26), still applies.

## Goals / Non-goals

**Goals**
- The five screens look like their mockups at phone and desktop sizes.
- One palette, set once in `src/index.css`, used by every page, including the pages the mockups don't show.
- A shared, always-visible cart on desktop.

**Non-goals**
- New catalog data, product photos or store rules.
- New checkout or order-confirmation screens (they take the new palette only).
- Copying the mockups' shortcuts: one product for every card, and one cart per screen.
- A dark theme.

## Requirements

**Look**

- **R1.** The site uses the design's colors: green `#1E5B3A` for actions (buttons, links, focus ring), accent `#F2C14E`, background `#F7F5EE`, text `#1C1C18`. They are defined once as theme tokens and every page uses them, including the pages with no mockup (search, deals, checkout, order confirmation, not found).
- **R2.** All body text, secondary text and button text still meets WCAG AA contrast (at least 4.5:1) against its background with the new colors.
- **R3.** Every tappable control (buttons, links, the quantity stepper, filters) has a target of at least 44 × 44 px and is a real button, link or labelled form control.

**Screens**

- **R4.** On phones, the shop, product detail and cart screens match `Main`, `Product` and `Cart` in layout, spacing and type.
- **R5.** From 1024 px wide, the shop screen matches `Desktop`: a category sidebar, the product grid, and a cart panel that stays in view while the page scrolls. The panel shows the same lines, quantities, subtotal and free-delivery progress as the cart page, and changes made in it show up everywhere at once.
- **R6.** From 1024 px wide, the product page matches `DesktopProduct`.

**Behaviour kept from today**

- **R7.** Every product card opens that product's own page at `/p/:slug`.
- **R8.** There is one cart. Adding, changing or removing an item on any screen (tile, product page, cart page, cart panel, drawer) shows the same result on every other screen, and it survives a reload.

## Acceptance criteria

- **R1:** Given any page, then the page background is `#F7F5EE`, text is `#1C1C18`, and the primary button and focus ring are `#1E5B3A`. Given the source code, then no component contains a hex color.
- **R2:** Given body text, secondary text and button text on their usual backgrounds, then each has a contrast ratio of at least 4.5:1 (axe reports no contrast violations).
- **R3:** Given each page at 390 px, then every button and link is at least 44 px high and wide, and axe reports no violations.
- **R4:** Given the shop, a product and the cart at 390 px, when compared with `Main.png`, `Product.png` and `Cart.png`, then layout, colors and type match.
- **R5:** Given the shop at 1366 px with two items in the cart, when I scroll to the bottom of the grid, then the cart panel is still visible and shows both lines. When I raise a quantity in the panel, then the header count and the product tile show the new quantity.
- **R6:** Given a product page at 1366 px, when compared with `DesktopProduct.png`, then layout, colors and type match.
- **R7:** Given the shop, when I open two different product cards, then each opens its own `/p/:slug` page with its own name and price.
- **R8:** Given a product added from a tile, when I open the product page, the cart page and (on desktop) the cart panel, then each shows the same quantity; after a reload it's still there.

## Open questions

1. **Mockup files.** The `.dc.html` files and screenshots aren't in `/design/` yet. Every screen requirement (R4–R6) has to be checked against them.
2. **Accent `#F2C14E`.** Is it only for deals (discount badge, old price), as apricot is today, or also for other highlights in the design? Measured: ink `#1C1C18` on the accent is 10.2:1, so it works as a fill behind text. But the accent on the cream background is only 1.5:1, so it can never be used as text or as the only edge of a control.
3. **Price format.** The handoff note writes prices as `toLocaleString('vi-VN') + 'đ'` (`12.000đ`). The app shows `12.000 ₫` ([decision 0003](../../decisions/0003-prices-in-whole-vnd.md), grocery-store R7). Keep `₫`, or switch to `đ` and supersede decision 0003?
4. **Cart drawer on desktop.** With the sticky panel on the shop page, does the header cart button still open the drawer on desktop, and is the panel shown on the product page too?
5. **Category sidebar vs category pages.** Does the sidebar filter the shop page in place (`/?c=snacks`), or link to today's `/c/:slug` pages laid out with the sidebar? Either way the selection must stay in the address.
6. **Category tints.** The current snack/drink/essentials tints were picked for the old cool palette. Does the design keep, change or drop them?
7. **Home page sections.** Today's home page has the delivery promise, category tiles, a deals row and a row per category. Which of these does `Main` / `Desktop` keep?
