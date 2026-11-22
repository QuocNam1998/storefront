# Design reference

The designer's mockups for the next look of Cửa hàng của Thy. **Reference only**: read them for layout, colours, spacing and behaviour, but never import them, copy their runtime script, or serve them from the app.

The feature that builds this design is [`design-refresh`](../docs/features/design-refresh/spec.md).

## What goes here

| Screen | Source file | Screenshot | Size | Replaces today's |
|---|---|---|---|---|
| Shop (mobile) | `Main.dc.html` | `Main.png` | phone | `/` Home and `/c/:slug` Category |
| Product detail (mobile) | `Product.dc.html` | `Product.png` | phone | `/p/:slug` ProductPage |
| Cart (mobile) | `Cart.dc.html` | `Cart.png` | phone | `/cart` Cart and the cart drawer |
| Shop (desktop, ≥1024 px) | `Desktop.dc.html` | `Desktop.png` | desktop | `/` and `/c/:slug`, now with a category sidebar and a sticky cart panel |
| Product detail (desktop) | `DesktopProduct.dc.html` | `DesktopProduct.png` | desktop | `/p/:slug` |

Use these exact names so specs, plans and prompts can point at them.

The `.dc.html` files need their design tool's `support.js` to render, which isn't here, so read them as source. Export a PNG of each screen from the design tool and add it here.

## The mockups are look and layout, not store logic

Take colors, spacing, type and layout from them. Their data and logic are placeholders, and the owner decided (2026-11-22) to keep the store's real behaviour. The [spec](../docs/features/design-refresh/spec.md) lists everything; in short, don't copy:

- **The catalog.** Their 16 products and `Dừa` category are samples. Use `src/data/catalog.ts` (24 products, three categories).
- **Every card opening the coconut product.** Each tile opens its own `/p/:slug`.
- **One cart per screen.** There is one shared cart, `CartProvider` in `src/store/cart.tsx`.
- **The checkout options on the cart.** No `Giao ngay` / `Hẹn giờ`, no bank QR or e-wallet, no note field; `Đặt hàng` goes to the existing `/checkout` (cash on delivery).
- **The 15.000đ fee.** Delivery follows `src/lib/store.ts` (20.000 ₫, free from 300.000 ₫).
- **Prices as `12.000đ`.** Every price goes through `formatPrice` (`12.000 ₫`, [decision 0003](../docs/decisions/0003-prices-in-whole-vnd.md)).
- **The `Giao đến · Nhà riêng` picker.** There are no saved addresses.
- **Accessibility slips.** `all: unset` and `outline: none` remove the focus ring, and a few controls are under 44 px. Keep the focus ring and 44 px targets.

## How to work from it

1. Drop the five `.dc.html` files and their screenshots in this folder.
2. Finish the spec: `/spec design-refresh` (answer its open questions).
3. Plan before coding. Start Claude Code in plan mode and run `/plan design-refresh`, adding:

   ```
   Read /design/*.dc.html and the screenshots. Propose the component tree,
   file structure and state approach for the five screens, reusing what is
   already in src/ (pages, site components, CartProvider, catalog, formatPrice).
   Don't write code yet.
   ```

4. Build one slice at a time with `/implement design-refresh`, in a fresh conversation per slice. After each slice, run `pnpm dev` and compare the page with its screenshot here at both sizes before moving on.
5. Finish with `/verify design-refresh`.
