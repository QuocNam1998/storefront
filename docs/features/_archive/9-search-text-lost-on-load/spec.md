# 9-search-text-lost-on-load

> Text typed into the header search box before the page has started up in the browser is wiped once it does, and Enter pressed in that moment doesn't search. Until the page is ready, the box should accept nothing. Once it's ready, it should work as it does today.

Fix branch: `feature/nextjs-migration`, inside PR [#8](https://github.com/QuocNam1998/storefront/pull/8), because #8 brought the bug in and shouldn't ship it (David's choice, 2026-11-23). It doesn't use the usual `fix/` branch.

Restores [nextjs-migration](../nextjs-migration/spec.md) R2: "Nothing a shopper sees or does changes." Before that move, the search box only appeared once the page had started up, so a shopper couldn't type into it any earlier. The search itself is [grocery-store](../grocery-store/spec.md) R12: "A search box is in the header on every page. Searching shows a results page."

## Symptom

GitHub issue: [#9](https://github.com/QuocNam1998/storefront/issues/9)

- A shopper types into the header search box while the page is still starting up, for example on a slow connection. A moment later the box is empty again. On a search results page, it goes back to the earlier search.
- A shopper who types and presses Enter in that moment stays on the page they were on, with `?q=…` added to the address, instead of getting the search results.

Found when the browser test `e2e/browse.spec.ts:115` failed once on CI for PR #8. It typed `nuoc suoi` and pressed Enter, and landed on `/search?q=`. Reproduced reliably on 2026-11-23 by holding the page's scripts back for 1.5 s.

## Steps to reproduce

- **Environment:** the built store (`pnpm build && pnpm start`, http://localhost:5173), Chromium, at desktop (1280 px) or phone (Pixel 7) width. Both widths behave the same. Hold the page's scripts back by 1.5 s (a slow network, or Playwright delaying `/_next/static/chunks/`), so there's time to type before the page starts up.
- **Starting state:** a fresh browser with nothing saved. The cart, saved orders and date make no difference.
- **Steps, text wiped:**
  1. Open `/`.
  2. Before the page has started up, type `nuoc suoi` into the search box (`Tìm sản phẩm`).
  3. Wait until it has started up and look at the box.
  4. Repeat on `/cart` and `/search?q=banh`.
- **Steps, early Enter:**
  1. Open `/`.
  2. Before the page has started up, type `nuoc suoi` into the search box and press Enter.

## Expected vs actual

| | Expected | Actual |
|---|---|---|
| Typing into the box before start-up | Nothing happens: the box takes no focus and shows no text | The text appears |
| Box after start-up, on `/` or `/cart` | Empty, ready to type into | Empty (the typed text is wiped) |
| Box after start-up, on `/search?q=banh` | `banh`, ready to type into | `banh` (the typed text is replaced) |
| Enter before start-up, on `/` | Nothing happens: the page and address stay as they are | The home page reloads at `/?q=nuoc+suoi`, with no results |
| How the box looks before start-up | The same as after | The same as after |

## Requirements

- **R1.** *(Changed 2026-11-23, David's choice; was: text typed before start-up stays in the box.)* Until the page has started up, the header search box takes no focus and accepts no text, on every page and at desktop and phone widths. Once the page has started up, it can be typed into as today.
- **R2.** *(Changed 2026-11-23, David's choice; was: Enter before start-up opens the results.)* Pressing Enter before the page has started up does nothing: the page and its address stay as they are.
- **R3.** When the shopper hasn't typed anything, the box shows the address's search on the results page (`banh` on `/search?q=banh`) and is empty on every other page. When the search in the address changes (a new search, Back, a link), the box shows the new one, as today.
- **R4.** Once the page has started up, search works as today: Enter opens the results for the typed text, ignoring accents and case, and a keyboard shopper stays in the search box.
- **R5.** The search box looks the same as today at every width ([ui-redesign](../ui-redesign/spec.md) R4).
- **R6.** *(Changed 2026-11-23, to match R1.)* No page writes an error or warning to the browser console, including after a shopper tried to type into the search box before start-up ([nextjs-migration](../nextjs-migration/spec.md) R8).
- **R7.** Before the page has started up, the box looks the same as after: no greyed-out or faded state, and the same placeholder.

## Acceptance criteria

- **R1:** Given the built store with the page's scripts held back 1.5 s and a fresh browser, at desktop and at Pixel 7 width, when the shopper opens `/`, clicks the search box and types `nuoc suoi` before the page has started up, then the box isn't focused and stays empty. Once the page has started up, typing `nuoc suoi` into the box shows it. The same holds on `/cart` and `/search?q=banh`, where the box shows `banh` once started.
- **R2:** Given the same set-up, when the shopper opens `/`, clicks the search box, types and presses Enter before the page has started up, then the address is still `/` and the home page is still shown.
- **R3:** Given `/search?q=banh` opened without typing, then the box shows `banh`. Given `/`, then the box is empty. Given a search for `banh` followed by Back, then the box shows the earlier search again.
- **R4:** Given the existing browser test "the header search ignores accents and case" (`browse.spec.ts`), then it passes unchanged at both widths.
- **R5:** Given the visual check (storefront-ui skill) of `/`, `/search?q=banh` and `/cart` at 390, 768, 1280 and 1366 px, then the header matches the screenshots in `.playwright-mcp/visual-check/nextjs-migration/after/`.
- **R6:** Given each page in the browser tests' page list, and given `/` after trying to type into the search box before start-up, then the console has no errors or warnings.
- **R7:** Given the same set-up as R1, when the box is read before start-up and again after, then its background color, opacity and placeholder are the same.

## Open questions

None. Resolved 2026-11-23 with David:

- **Before start-up, keep the text or accept nothing:** accept nothing (R1, R2 changed). It's the choice with the fewest issues. A loading skeleton for slow connections may come later, as its own feature.
- **Branch:** fixed on `feature/nextjs-migration` inside PR #8, not on `fix/9-search-text-lost-on-load`.
