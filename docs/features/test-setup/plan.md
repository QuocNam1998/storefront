# test-setup: plan

## Approach

Add Vitest for unit and component tests and Playwright for browser tests, as recorded in [decision 0001](../../decisions/0001-vitest-and-playwright-for-tests.md).

- **Vitest** is configured inside the existing `vite.config.ts`, so tests use the same `@/` paths and React plugin as the app. A small setup file clears saved browser data before each test and removes anything the previous test rendered. Test files live in `src/`, which `tsconfig.app.json` already includes, so `pnpm build` type-checks them. The app never imports them, so they stay out of the production build.
- **Playwright** reads a new `playwright.config.ts` with two projects (desktop Chromium, Pixel 7 Chromium). It starts `pnpm dev` on port 5173, or reuses a running one when not in CI. `e2e/` and the config are added to `tsconfig.node.json` so they're type-checked too.
- **The cart tests** simulate a page reload by unmounting the cart and mounting a fresh one. The cart reads saved data only when it first mounts.
- **CI** is one GitHub Actions job: install, lint, build, unit tests, install Chromium, browser tests. The Playwright report and failure traces are uploaded when the job fails.
- **Docs** are updated last, once everything above exists.

The starter tests describe today's behavior and change no app code. The Monday roast date stays untested on purpose (spec R9, "Known concerns" in `docs/architecture.md`).

## Files

| File | Change |
|---|---|
| `package.json`, `pnpm-lock.yaml` | Dev dependencies `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/dom`, `@playwright/test`. Scripts `"test": "vitest run"` and `"test:e2e": "playwright test"` |
| `vite.config.ts` | Add a `test` section: jsdom, `src/**/*.test.{ts,tsx}`, setup file. Add the Vitest type reference so the section is type-checked |
| `src/test/setup.ts` (new) | Before each test: clear localStorage. After each test: unmount what was rendered |
| `src/lib/store.test.ts` (new) | Shipping-cost and next-roast-date tests |
| `src/store/cart.test.tsx` (new) | Cart tests through the real `CartProvider` and `useCart` |
| `playwright.config.ts` (new) | `testDir: 'e2e'`, base URL `http://localhost:5173`, projects `desktop-chromium` (Desktop Chrome) and `mobile-chromium` (Pixel 7), dev server started by Playwright (reused locally, always fresh in CI), keep a trace on failure, HTML report in CI and list output locally |
| `e2e/checkout.spec.ts` (new) | Full order: product page → add to cart → drawer's "Check out" → fill the form → place order → confirmation |
| `tsconfig.node.json` | Add `playwright.config.ts` and `e2e` to `include` |
| `.gitignore` | Ignore `test-results/`, `playwright-report/`, `blob-report/`, `playwright/.cache/` |
| `.github/workflows/ci.yml` (new) | On push and pull request: pnpm 11 + Node 22, `pnpm install --frozen-lockfile`, lint, build, `pnpm test`, `pnpm exec playwright install --with-deps chromium`, `pnpm test:e2e`. On failure, upload `playwright-report/` and `test-results/` |
| `README.md` | "Run it": add `pnpm test`, `pnpm test:e2e` and the one-time Chromium install. Remove the "Add tests" line from "Next steps" |
| `CLAUDE.md` | Remove the `_TBD_` line about missing test scripts |
| `docs/architecture.md` | These sections become untrue and are updated in the last step: **Tech stack** (add Vitest + jsdom + Testing Library, Playwright, GitHub Actions) and **Conventions → Testing** (remove the `_TBD_`, add the Chromium install). Components, Data flow and Known concerns are unchanged |

## Steps

- [x] 1. Install Vitest, jsdom and Testing Library. Add the `test` script and the `test` section in `vite.config.ts`. Write `src/lib/store.test.ts`. Check that `pnpm test` passes, and that a deliberately broken assertion makes it exit non-zero and name the test (then undo it). Covers R1, R2, R8, R9.
- [x] 2. Add `src/test/setup.ts` and write `src/store/cart.test.tsx`. Include one pair of tests where the first writes localStorage and the second finds it empty. Covers R3, R10.
- [x] 3. Install `@playwright/test` and Chromium. Add the `test:e2e` script, `playwright.config.ts`, the `tsconfig.node.json` include and the `.gitignore` entries. Write `e2e/checkout.spec.ts`. Run `pnpm test:e2e` with nothing on port 5173, then again with `pnpm dev` already running. Check that both screen sizes are listed, that no server is left running, and that a deliberately failing step exits non-zero (then undo it). Covers R4, R5, R6, R11.
- [x] 4. Check that the test files don't break the build. Run `pnpm build` and `pnpm lint`. Confirm that a deliberate type error in a test file fails `pnpm build` (then undo it), that `dist/` contains no test code, and that `git status` is unchanged after both test commands. Covers R6, R7.
- [ ] 5. Add `.github/workflows/ci.yml`. Before pushing anything, ask David whether a branch can be pushed to check the workflow. A green run checks R12. A throwaway commit with a failing browser test checks that the run fails and the report can be downloaded, and it's then dropped. Covers R12, R13.
- [ ] 6. Update the README, remove the `_TBD_` line from `CLAUDE.md`, and update Tech stack and Conventions → Testing in `docs/architecture.md`. Covers R14.

## Tests

| Req | Proved by |
|---|---|
| R1 | `pnpm test` exits 0 with the starter tests and non-zero with a deliberately broken one (step 1) |
| R2 | `src/lib/store.test.ts` is found under `src/` and imports `@/lib/store` |
| R3 | `src/store/cart.test.tsx`: the write-then-read-empty pair; the cart tests render `CartProvider` |
| R4 | `pnpm test:e2e` run with no server and with `pnpm dev` already running; exit code with a failing step (step 3) |
| R5 | `pnpm test:e2e` output lists `checkout.spec.ts` under both `desktop-chromium` and `mobile-chromium` |
| R6 | `git status` unchanged after `pnpm test` and `pnpm test:e2e` (step 4) |
| R7 | `pnpm build` and `pnpm lint` pass; a deliberate type error in a test fails the build; `dist/` has no test code (step 4) |
| R8 | `src/lib/store.test.ts`: standard at $39.99 and $40.00, express at $39.99 and $40.00 |
| R9 | `src/lib/store.test.ts`: Tuesday 24 Nov 2026 and Sunday 29 Nov 2026 → Monday 30 Nov 2026 |
| R10 | `src/store/cart.test.tsx`: merging repeat adds, separate line for a different grind, cap at 20, survives remount, unknown product dropped on load |
| R11 | `e2e/checkout.spec.ts`: lands on `/order/SC-` plus 6 digits, the coffee's name is shown, and the header reads "Open cart, 0 items" |
| R12 | A green GitHub Actions run on a pushed branch, and a red run when a step fails (step 5) |
| R13 | The Playwright report can be downloaded from the failing run (step 5) |
| R14 | README content; `grep -n "_TBD" CLAUDE.md docs/architecture.md` finds no test-setup line |

## Risks

- **New tool versions:** the repo runs TypeScript 7 and Vite 8. Vitest 5.1.1 lists Vite 8 as supported, but the Vitest and Playwright type definitions haven't been tried under TypeScript 7's `tsc -b` here. `skipLibCheck` is already on. If it still fails, stop and suggest a plan change rather than loosening type checks.
- **pnpm 11 install scripts:** pnpm may ask to approve dependency build scripts during install. If it does, report which package asked and don't approve it silently.
- **The full test command doesn't exist until step 3:** `/implement` runs `pnpm test && pnpm test:e2e` after each step, but `test:e2e` only exists from step 3. Steps 1 and 2 can only run `pnpm test`.
- **Port 5173 already in use by another app:** locally, Playwright would reuse it and test the wrong site. CI always starts its own server.
- **Mobile layout:** the full order runs on the phone-sized project too. If the header or cart drawer is laid out differently on small screens, the test must find elements by role and label, not by position.
- **R12 and R13 need a push to GitHub,** which is outward-facing. Step 5 asks first. Without a push, those two requirements stay untested and `/verify` will report them that way.
- **Random order ids:** the confirmation test matches the `SC-` plus 6 digits pattern, not a fixed id.
