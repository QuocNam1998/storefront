# 5-old-theme-color: plan

Spec: [spec.md](spec.md). Issue: [#5](https://github.com/QuocNam1998/storefront/issues/5).

## Approach

**Root cause.** Two static files hard-code the palette from before the redesign. The grocery-store plan wrote `#EEF3F1` (the old `--mist`) as the theme color in `index.html`, and drew `public/favicon.svg` in `#EEF3F1` and the old teal `#2F7A6B`. The ui-redesign plan changed the palette by changing only the token values in `src/index.css` ([decision 0006](../../../decisions/0006-keep-theme-token-names-through-the-redesign.md)). Its Files table listed neither `index.html` nor `public/favicon.svg`. Neither file can read the CSS tokens: browsers read a theme-color meta tag as a plain value, and a favicon is drawn on its own, outside the page's CSS. No test compared these files with the tokens, so they kept the old values without anyone noticing.

**Fix.** Change the literal values in place:

- `index.html`: theme color `#EEF3F1` → `#F7F5EE` (the current `--mist`).
- `public/favicon.svg`: `#EEF3F1` → `#F7F5EE` and `#2F7A6B` → `#1E5B3A` (the current `--sea`). The shapes stay as they are.

The literal copies stay. Making them follow the tokens on their own would take a build step or script that writes the HTML head or the SVG from `src/index.css`. That's more machinery than two hex values need, and CLAUDE.md says KISS wins over DRY. Drift is caught by a test instead: the new browser tests read `--mist` and `--sea` from the running page and compare the theme color and the favicon's colors against them. A future palette change that misses either file fails CI and names the file.

Reused: the per-page loop and `PAGES` list in `e2e/quality.spec.ts` (every route, desktop and phone), and the existing title, `lang` and page-background tests for R4. No app code in `src/` changes. No new dependencies or files.

No decision record. The choice (literal copies guarded by a test) is small, and the one-line architecture note in step 4 is where a later palette change will find it.

## Files

| File | Change |
|---|---|
| `e2e/quality.spec.ts` | In the per-page loop, a new test: the theme-color meta tag equals the page's `--mist` token, and the meta description is unchanged. Below the loop, a new test: the head links `/favicon.svg` as an SVG icon, the favicon still has its one rounded square and three paths, and every color in it is `--mist` or `--sea`. |
| `index.html` | Theme-color value `#EEF3F1` → `#F7F5EE`. Nothing else in the file changes. |
| `public/favicon.svg` | Fill and stroke `#EEF3F1` → `#F7F5EE`, `#2F7A6B` → `#1E5B3A`. Shapes and attributes stay as they are. |
| `docs/architecture.md` | Design tokens row: add that `index.html`'s theme color and the favicon repeat the cream and green as literal values, and a browser test keeps them equal to the tokens. Nothing in the current text becomes untrue. This only adds the fact a future palette change needs. |

## Steps

- [x] **1. Regression tests.** Add the two tests to `e2e/quality.spec.ts`. Run `pnpm test:e2e e2e/quality.spec.ts` and confirm that on the current code the theme-color test fails on every page with `#EEF3F1`, and the favicon color test fails naming `#EEF3F1` and `#2F7A6B`. The link, shape and description checks pass already. *(R1, R2, R3, R4)*
- [x] **2. Theme color.** Change the value in `index.html`. The theme-color test passes on every page at both sizes. *(R1)*
- [x] **3. Favicon.** Change the two colors in `public/favicon.svg`. The favicon test passes, and the diff touches color values only. *(R2, R3)*
- [x] **4. Architecture and check.** Add the note to the Design tokens row in `docs/architecture.md`. Run `pnpm check` (tests, browser tests, lint, build) and confirm it passes. *(R4)*

## Tests

| Req | Test |
|---|---|
| R1 | `e2e/quality.spec.ts`, per-page loop: on all 13 routes at desktop and Pixel 7 size, `meta[name="theme-color"]` content equals the page's `--mist` token (case-insensitive), so it's `#F7F5EE` today. |
| R2 | `e2e/quality.spec.ts`: fetch `/favicon.svg`, collect every `#rrggbb` in it, and check the set is exactly `--mist` and `--sea` from a loaded page, with no `#EEF3F1` or `#2F7A6B`. |
| R3 | Same test: `link[rel="icon"]` has `href="/favicon.svg"` and `type="image/svg+xml"`, the response is an SVG, and it still has one `<rect>` and three `<path>` elements. The step 3 diff, limited to color values, covers the rest of "same design". |
| R4 | Existing per-page test `carries the store name and is in Vietnamese` (title, `lang="vi"`). The new per-page test checks the meta description text. The existing `the background, action and accent colors differ…` test and the ui-redesign R1 checks show the page background and theme are unchanged. |

## Risks

- **How the token reads back.** The tests expect `getComputedStyle(document.documentElement).getPropertyValue('--mist')` to return the hex as written in `src/index.css`, possibly with spaces or different letter case. The tests trim it and compare case-insensitively. Step 1 has to show this works in Chromium before anything else relies on it. If the value comes back in another form, compare after converting both sides to `rgb()`.
- **Favicon caching.** Browsers cache favicons hard, so after the fix a developer may still see the old icon in their own tab. The test fetches the file directly, so CI isn't affected. This only matters when someone looks by eye.
- **iOS Safari and other browsers.** Some browsers ignore theme color or apply it only in some modes. The spec settled on the browser test as enough, so no device check is planned.
