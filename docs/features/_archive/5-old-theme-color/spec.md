# 5-old-theme-color

> The browser's theme color and the favicon still use the cool grey-green and teal from before the redesign. They should match the warm cream and forest green.

Fix branch: `fix/5-old-theme-color`

Restores [ui-redesign](../ui-redesign/spec.md) R3: "the page background becomes a warm cream, not a cool color." The browser bar tinted from the theme color, and the favicon, are the last places still showing the old cool palette.

## Symptom

GitHub issue: [#5](https://github.com/QuocNam1998/storefront/issues/5)

- The page tells browsers to use `#EEF3F1` (the old pale grey-green page background) as its theme color. Browsers that tint their address bar or tab strip from it show a cool grey-green bar directly above the cream page and white header.
- The favicon in the browser tab is a pale grey-green tile with a teal (`#2F7A6B`) basket. Neither color is in the redesign's palette.

This was found by reading the page source and the favicon file. Nobody has seen it on a device yet (see Open questions).

## Steps to reproduce

- **Environment:** either `pnpm dev` (http://localhost:5173) or the built site (`pnpm build && pnpm preview`). Both serve the same page head. To see the tinted bar, use a browser that applies theme color, such as Chrome on Android at phone width. On any browser, the value can be read in devtools.
- **Starting state:** any. The cart, saved orders, products and date make no difference, and neither do the page or the query string, because every route shares the same page head.
- **Steps:**
  1. Open `/`.
  2. Look at the browser's address bar or tab strip, or read the `theme-color` meta tag in devtools.
  3. Look at the icon in the browser tab.

## Expected vs actual

| | Expected | Actual |
|---|---|---|
| Theme color | `#F7F5EE`, the cream page color | `#EEF3F1`, the old cool grey-green |
| Browser bar on phones (where it's tinted) | Cream, the same as the page | Grey-green, so it clashes with the cream page |
| Favicon | Drawn in the redesign's cream (`#F7F5EE`) and forest green (`#1E5B3A`) | Drawn in the old grey-green (`#EEF3F1`) and teal (`#2F7A6B`) |

## Requirements

- **R1.** The page's theme color is `#F7F5EE`, the same value as the cream page background, on every route.
- **R2.** The favicon is drawn only in the redesign's cream (`#F7F5EE`) and forest green (`#1E5B3A`). Neither the old grey-green `#EEF3F1` nor the old teal `#2F7A6B` appears in it.
- **R3.** The favicon keeps its current design (a basket under a handle, three slats, on a rounded square) and stays an SVG served at `/favicon.svg`. Only its colors change.
- **R4.** Nothing else changes: the page title `Cửa hàng của Thy`, the Vietnamese meta description, `lang="vi"`, the page background and every other color in the theme stay as they are.

## Acceptance criteria

- **R1:** Given the site running with `pnpm dev` or the built site, in a fresh browser, when the shopper opens `/`, then the theme color is `#F7F5EE`. On a browser that tints its bar from it, the bar is cream, not grey-green.
- **R1:** Given any other route (`/c/:slug`, `/deals`, `/search?q=…`, `/p/:slug`, `/cart`, `/checkout`, `/order/:id`, an unknown path), when it loads, then the theme color is still `#F7F5EE`.
- **R2:** Given the favicon at `/favicon.svg`, when its colors are read, then every color is either `#F7F5EE` or `#1E5B3A`, and neither `#EEF3F1` nor `#2F7A6B` appears.
- **R3:** Given the page head, then it still links `/favicon.svg` as an SVG icon, and the favicon still shows the basket, handle and three slats on a rounded square.
- **R4:** Given any page, then the title is `Cửa hàng của Thy`, the meta description and `lang="vi"` are unchanged, and the page background is still the cream color (ui-redesign R1's check still passes).

## Open questions

None.

Resolved 2026-11-22: there is no manual check on a real Android or iOS device. The browser test that reads the theme color and the favicon's colors is enough, because how a phone tints its bar from that value is up to the browser.
