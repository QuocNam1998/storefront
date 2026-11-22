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

## Shortcuts in the mockups — don't copy them

- **Every product card opens the same coconut product.** The app already has a real route per product, `/p/:slug`. Keep it.
- **Each screen keeps its own copy of the cart.** The app already has one shared cart, `CartProvider` in `src/store/cart.tsx`. Every screen reads and writes that one store.
- **Prices written as `12.000đ`.** The app formats every price with `formatPrice` in `src/lib/store.ts` (`12.000 ₫`, [decision 0003](../docs/decisions/0003-prices-in-whole-vnd.md)). Changing that is an open question in the spec, not something to do in passing.

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
