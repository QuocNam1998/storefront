# 9-search-text-lost-on-load: plan

Spec: [spec.md](spec.md).

## Approach

**Root cause.** Since nextjs-migration, the server sends the header search box in the page, so a shopper can reach it before the page has started up. It sits inside a loading boundary (`Suspense`), added so that pages built ahead of time could still build, because the form reads the address's search with `useSearchParams`. For the moment before the real form is ready, the server sends a stand-in form with an empty box. The real form then replaces it, and anything typed into the stand-in goes with it. Checked 2026-11-23 on the built store by reading the HTML the server sends:

- `/` and `/cart`, built ahead of time: the server sends only the stand-in (`<!--$!-->`), and the browser draws the real form at start-up.
- `/search?q=banh`, rendered per request: the server sends the stand-in first (`<!--$?-->`), then the real form with `banh` later in the same response.

Enter before start-up reloads the page because the form has no address of its own. Until the page's script takes over, the browser sends the form to the page it's on (`/?q=nuoc+suoi`).

**Fix:** the box is disabled until the page has started up (R1, R2). Nothing can be typed, so nothing is lost when the stand-in is replaced, and Enter has no field to send the form from. The boundary, the stand-in and the address handling all stay as they are.

- **When the page counts as started up:** the cart store's existing `loaded` flag (`src/store/cart.tsx`). It turns on once the page has started up and the saved cart has been read, which is also when the header count fills in. `SearchForm` reads it with `useCart()`, the same way `CartCount` and the cart button already do. That means no new state or effect.
- **Why disabled, not read-only.** Checked 2026-11-23 in Chromium at both widths: Enter in a read-only box still sends its form (the page reloads at `?q=`), and the box can still be focused. A disabled box takes no focus and sends nothing.
- **Look (R7):** the shared input greys out a disabled field (`disabled:bg-input/50 disabled:opacity-50` in `src/components/ui/input.tsx`). The search box overrides that in its own classes with `disabled:bg-mist disabled:opacity-100`. Checked 2026-11-23: `cn` drops the input's two grey classes in favour of these.

Reused unchanged: `useCart().loaded`, `Input`, the `Suspense` stand-in, `SearchFormFromAddress`, the submit handler, `src/lib/search.ts` and the Search page. The `Input` component itself stays as it is, so other disabled fields keep their grey look.

## Files

| File | Change |
|---|---|
| `e2e/server.spec.ts` | New tests with the page's scripts held back 1.5 s, which gives a reliable moment before start-up. Before start-up the box can't be focused or typed into, and once the page has started up it can, on `/`, `/cart` and `/search?q=banh` (R1). Enter before start-up leaves the page at `/` (R2). The box's look is the same before and after (R7). No console problems after trying to type early (R6). A small helper in this file holds the scripts back, because four tests use it. |
| `e2e/browse.spec.ts` | One new test beside the header search test: the box shows `banh` on `/search?q=banh`, is empty on `/`, and shows the earlier search after Back (R3). The existing tests are untouched. |
| `src/components/SiteChrome.tsx` | `SearchForm` takes `loaded` from `useCart()`, and its `Input` gets `disabled={!loaded}` and the two classes above, with a comment on why the box waits. |
| `docs/architecture.md` | The last step. Data flow step 1 lists the parts that wait for the page to start up. Add that the header search box can't be used until then. |

No decision record: the change uses an existing flag, and the behaviour choice is recorded in the spec's resolved questions.

No CHANGELOG entry. The bug came in and goes out within the unreleased 0.2.1, so no released version ever had it.

## Steps

- [x] **1. Regression tests.** Add the `server.spec.ts` tests (R1, R2, R6, R7) and the `browse.spec.ts` test (R3). Run them on the current code:
  - The R1 and R2 tests fail with the symptom: the box takes focus and text before start-up, and Enter reloads at `/?q=nuoc+suoi`.
  - The R3, R6 and R7 tests pass.
  - Each early test first checks that the header cart button still has its name from before start-up (`Mở giỏ hàng`, with no count), so it can't pass by acting too late.

  *(R1, R2, R3, R6, R7)*
- [x] **2. Fix.** Change `SearchForm` in `SiteChrome.tsx` as in Approach. The step 1 tests and the existing search test (`browse.spec.ts:115`) pass at both widths. *(R1, R2, R4, R6, R7)*
- [x] **3. Check.** Run `pnpm check`. Run the storefront-ui visual check of `/`, `/search?q=banh` and `/cart` at 390, 768, 1280 and 1366 px into `.playwright-mcp/visual-check/9-search-text-lost-on-load/`, and compare the header with `.playwright-mcp/visual-check/nextjs-migration/after/`. Tab to the box and search with the keyboard on `/`. *(R4, R5)*
- [x] **4. Docs.** Update data flow step 1 in `docs/architecture.md` (Files). *(all)*

## Tests

| Req | Proved by |
|---|---|
| R1 | `server.spec.ts`: at both widths, with scripts held back, on `/`, `/cart` and `/search?q=banh`, clicking the box and typing before start-up leaves it unfocused and unchanged. Once the cart button shows its count, typing into the box works. |
| R2 | `server.spec.ts`: same set-up on `/`, click the box, type and press Enter before start-up. The address is still `/`, and the home banner is still shown. |
| R3 | `browse.spec.ts` (new): `/search?q=banh` shows `banh`; `/` shows an empty box; searching `banh` from the results page and going Back shows the earlier search. |
| R4 | `browse.spec.ts:115` "the header search ignores accents and case", unchanged, at both widths. `quality.spec.ts:131`, the keyboard-only order that starts with a search. |
| R5 | Visual check (step 3) against the nextjs-migration after shots. The existing phone search-row test in `browse.spec.ts` still passes. |
| R6 | `server.spec.ts`: the existing console checks over the page list, plus a new one on `/` after trying to type early. |
| R7 | `server.spec.ts`: the box's background color, opacity and placeholder read the same before and after start-up. |

## Risks

- **The keyboard test may Tab before start-up.** `quality.spec.ts:131` starts pressing Tab once `/` has loaded. If the page hasn't started up by then, Tab skips the disabled box and the test can run out of tries. Normally the page has started up by the time loading finishes, and the full test runs in step 3 will show it. If it does flake, the fix is in that test's setup (wait for the cart button's count before tabbing). That would be a change to an old test, which needs David's approval under nextjs-migration R10.
- **A tap on a slow connection does nothing.** That's the intended behaviour (R1), until a loading skeleton exists. There's no hint that the box isn't ready yet.
- **The box waits for the saved cart to be read.** The saved cart is read in the same moment the page starts up, so there's no extra delay. If reading the cart ever became slow (a server cart, later), the search box would wait for it too. A later feature that changes how the cart loads should check this.
- **The pointer over the waiting box.** A disabled box ignores the pointer, so for that moment the pointer shows as an arrow rather than a text cursor. Nothing else about the look changes.
