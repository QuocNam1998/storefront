# test-setup

## Problem

The storefront has no automated tests. `pnpm test` exits with an error, and nothing checks the cart, shipping rules or checkout before a change lands. The spec-driven workflow needs a working test command: `/implement` runs it after every step and `/verify` uses it to check every requirement. Until it exists, no feature can be implemented or verified. The developer needs one command for fast logic and component tests, one for real-browser tests of the shopping flow, and a CI run on GitHub so a broken change is caught before it's merged.

## Goals / Non-goals

**Goals**
- `pnpm test` runs unit and component tests; `pnpm test:e2e` runs browser tests.
- A few starter tests on real storefront behavior prove that each kind of test works.
- GitHub runs lint, build and both test suites on every push and pull request.

**Non-goals**
- Full test coverage of existing pages. Later features add tests for what they touch.
- Coverage thresholds or coverage reports.
- Visual or screenshot comparison tests.
- Firefox, WebKit or real mobile devices.
- Pre-commit hooks, deployment or preview builds.
- Changing any storefront behavior. The starter tests describe the site as it works today.

## Requirements

**Running tests**

- **R1.** `pnpm test` runs every unit and component test once and exits. It doesn't stay in watch mode. It exits non-zero when any test fails.
- **R2.** Unit and component tests live beside the file they test, named `*.test.ts` or `*.test.tsx` under `src/`. They can import app code using the same `@/` paths the app uses.
- **R3.** Component tests can render React components and use hooks in a simulated browser that has localStorage. Each test starts with empty localStorage.
- **R4.** `pnpm test:e2e` runs every browser test in `e2e/` against the running storefront. If the app isn't already running, the command starts it and stops it afterwards. It exits non-zero when any test fails.
- **R5.** Every browser test runs twice: in Chromium at a desktop size and in Chromium emulating a phone.
- **R6.** Running either test command leaves `git status` unchanged: reports, results and caches aren't tracked.
- **R7.** With the test files in place, `pnpm build` and `pnpm lint` still pass, test files are type-checked, and no test code ends up in the production build.

**Starter tests**

- **R8.** Unit tests check the shipping rules:
  - standard shipping costs $5.00 when the subtotal is below $40.00 and is free from $40.00 up
  - express shipping costs $12.00 at any subtotal
- **R9.** Unit tests check the next roast date:
  - on any day except Monday it's the following Monday, including on a Sunday
  - Monday is left untested on purpose: what it should return is a known concern (see "Known concerns" in `docs/architecture.md`)
- **R10.** Component tests check the cart:
  - adding the same product with the same size and grind twice gives one line with the quantities added together
  - the same product with a different size or grind gives a separate line
  - a line's quantity never goes above 20
  - the cart is still there after the page reloads
  - on load, saved items that are no longer in the catalog are dropped
- **R11.** A browser test covers a full order: a shopper opens a coffee, adds it to the cart, fills in checkout with valid details and places the order. They land on the order confirmation for that order, which shows the coffee they bought. The cart is then empty.

**CI and docs**

- **R12.** A GitHub Actions workflow runs on every push and every pull request. It installs dependencies and runs lint, build, `pnpm test` and `pnpm test:e2e`. If any step fails, the run fails.
- **R13.** If a browser test fails in CI, its report and failure details are kept on the run so the failure can be investigated without reproducing it locally.
- **R14.** The README's "Run it" section lists `pnpm test` and `pnpm test:e2e`, plus any one-time setup that browser tests need. The "Add tests" item is removed from "Next steps". The `_TBD_` notes about missing test scripts are removed from `CLAUDE.md` and `docs/architecture.md`.

## Acceptance criteria

- **R1**
  - Given the starter tests pass, when I run `pnpm test`, then it prints the results, exits 0 and returns to the prompt.
  - Given one unit test is made to fail, when I run `pnpm test`, then it exits non-zero and names the failing test.
- **R2:** Given a file `src/lib/example.test.ts` that imports from `@/lib/store`, when I run `pnpm test`, then that test is found and runs.
- **R3:** Given one component test writes to localStorage, when the next test reads localStorage, then it's empty.
- **R4**
  - Given nothing is running on port 5173, when I run `pnpm test:e2e`, then the storefront starts, the browser tests run, and nothing is left running afterwards.
  - Given `pnpm dev` is already running, when I run `pnpm test:e2e`, then the tests use it without starting a second server.
  - Given one browser test fails, when I run `pnpm test:e2e`, then it exits non-zero.
- **R5:** Given the browser test for R11, when `pnpm test:e2e` finishes, then the results list it once for desktop Chromium and once for mobile Chromium.
- **R6:** Given a clean working tree, when I run `pnpm test` and then `pnpm test:e2e`, then `git status` shows no changes.
- **R7:** Given the test setup is in place, when I run `pnpm build` and `pnpm lint`, then both pass, a type error in a test file fails `pnpm build`, and `dist/` contains no test code.
- **R8**
  - Given standard shipping and a $39.99 subtotal, then shipping is $5.00. Given standard shipping and a $40.00 subtotal, then shipping is $0.00.
  - Given express shipping and a $39.99 or $40.00 subtotal, then shipping is $12.00.
- **R9:** Given Tuesday 24 Nov 2026, then the next roast date is Monday 30 Nov 2026. Given Sunday 29 Nov 2026, then it's Monday 30 Nov 2026.
- **R10**
  - Given an empty cart, when the same coffee, size and grind is added with quantity 1 and then quantity 2, then the cart has one line with quantity 3.
  - Given that line, when the same coffee is added with a different grind, then the cart has two lines.
  - Given a line with quantity 19, when 5 more are added, then its quantity is 20.
  - Given a cart with one line, when the cart is loaded again from saved data, then the line is still there.
  - Given saved cart data with one real product and one unknown product id, when the cart loads, then only the real product appears.
- **R11:** Given an empty cart, when a shopper opens a coffee's product page, adds it to the cart, goes to checkout, enters a valid email, name, address, city, region, postal code and country, and places the order, then the page is `/order/SC-` followed by 6 digits, it shows that coffee, and the cart count in the header is 0.
- **R12**
  - Given a push or a pull request to the GitHub repo, then the workflow runs lint, build, unit tests and browser tests.
  - Given a change that breaks any one of them, then the run is marked failed.
- **R13:** Given a CI run where a browser test fails, then the browser test report can be downloaded from that run.
- **R14:** Given the feature is done, then the README lists both test commands, and `grep -n "_TBD" CLAUDE.md docs/architecture.md` finds no line about the test setup.

## Open questions

None.
