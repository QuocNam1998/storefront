# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-11-22

### Changed

- New look from Thy's mockups: a warm cream page, white rounded cards, deep forest green for actions and prices, and one yellow accent for deals, cart counts and the home banner.
- The header has a basket logo mark, a wider search field and a black `Giỏ hàng` cart button with the count in a yellow circle. The row of category links under it is gone.
- The home page opens with a green delivery banner, then shows all 24 products in one grid.
- Product tiles have a full-width `Thêm vào giỏ` button that turns into a green `N trong giỏ` quantity bar, and the buttons in a row line up.
- The product page has a breadcrumb, a category chip, large pack cards, an add button showing the total, and `Có thể bạn cũng thích` for similar products. On a phone it has no site header: back and cart buttons sit on the photo, and the add bar is fixed to the bottom of the screen.
- Cart lines show the product's image, with the line total in green.

### Added

- From 1280 px, the home, category, deals and search pages have a category sidebar with product counts and a cart panel that stays in view. Below that, a row of category icon tiles.
- On phones, a black cart bar fixed to the bottom of the shop pages once the cart has items.
- `Mua ngay` on the product page adds the chosen pack and goes straight to checkout.
- A delivery and payment card on every product page.

## [0.1.0] - 2026-11-22

### Changed

- The storefront is now **Cửa hàng của Thy**, a Vietnamese neighborhood grocery selling snacks, water and drinks, and everyday essentials, in place of the Second Crack coffee store. The whole interface is in Vietnamese and every price is in whole đồng.
- New calm look: a pale blue-green page, one sea-green action color, apricot only for deals, the Be Vietnam Pro typeface, no drop shadows and no load animations.
- Cart lines are one product in one pack, up to 99 each, and the cart is saved under a new key, so a coffee cart is never read.
- Checkout asks for a phone number and a two-level Vietnamese address (no district or postal code), with an optional note for the driver. Delivery is 20.000 ₫, free from 300.000 ₫, within 2 hours. Cash on delivery is the only payment method.
- Orders get `THY-` ids.

### Added

- 24 products in 3 categories and 12 subcategories, each with one or more packs and a stock level.
- Unit prices (per 100 g, per litre or per item) on tiles and product pages, and deals with a discount badge and the old price struck through.
- Header search that ignores accents and case, with a results page.
- Category pages with a subcategory filter, four sorts and an in-stock-only option, all kept in the address.
- Deals page, and a home page with the delivery promise, category tiles, a deals row and a row per category.
- Add to cart straight from a product tile, which turns into a quantity control.
- Free-delivery progress bar in the cart drawer and on the cart page.
- Product images fall back to a placeholder in the category's color with the subcategory's icon until a photo is added.
- Browser checks for every page: Vietnamese text and store name, no coffee words or dollars, an axe accessibility scan, no sideways scrolling at 390 and 1366 px, a keyboard-only order with a visible focus ring, and no motion under reduced motion.

### Removed

- The coffee catalog, brewing gear, roast dates, grind choice, the roast scale and the US shipping methods.

## [0.0.2] - 2026-11-22

### Added

- Lint limits: `pnpm lint` and CI fail on a function with a complexity above 15, nesting deeper than 3 or more than 4 parameters, and on a needless `else`, lone `if` or trailing `return`.
- Lint on edit: in Claude Code, each `.ts`/`.tsx` file Claude writes or edits is linted straight away, and any errors are shown to Claude in the same turn.
- `pnpm check` runs the tests, browser tests, lint and type-checking build in one go.
- `storefront-ui` skill for building UI inside the site's existing look: theme tokens, reuse before writing, and a visual check at desktop and phone sizes.
- KISS and DRY coding rules in `CLAUDE.md`, with decision 0002 recording the approach.

### Changed

- `/spec` asks about states, phone layout and keyboard use for UI features. `/plan` names the code it reuses and gives a reason for each new file. `/implement` and `/verify` run `pnpm check`, and `/verify` adds a KISS / DRY review.
- Claude Code's browser tool output, including visual-check screenshots, is kept out of git.

## [0.0.1] - 2026-11-22

### Added

- `pnpm test` runs unit and component tests with Vitest, jsdom and Testing Library. Starter tests cover shipping costs, the next roast date and the cart.
- `pnpm test:e2e` runs browser tests with Playwright in Chromium at desktop and phone sizes, starting the dev server when one isn't already running. A starter test places a full order from a product page.
- GitHub Actions CI runs lint, build and both test suites on every push and pull request, and keeps the browser test report when a run fails.
- Spec-driven workflow docs: architecture overview, decision records and feature specs and plans under `docs/`.

### Changed

- README and `docs/architecture.md` describe the test commands and the one-time Chromium install.
