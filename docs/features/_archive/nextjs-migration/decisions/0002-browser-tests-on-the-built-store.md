# 0002. Browser tests run on the built store

- **Status:** accepted
- **Date:** 2026-11-23

## Context

The plan's first risk: the browser tests ran on `pnpm dev`, and Next.js's development server builds each page the first time it's opened. On 2026-11-23 that broke two runs:

- Locally, `pnpm check` failed once in six runs. The development server answered 500 for `/p/nuoc-suoi-tinh-khiet` because Next.js read one of its own files while it was still being written ("Unexpected end of JSON input").
- On CI, the whole browser test run took 3.6 minutes against 44 seconds locally, and the sort test read the category list before it had re-sorted.

The development server also draws one page differently from the production build (the phone header on the unknown-product page, [feature decision 0001](0001-unknown-category-not-found-drawn-in-browser.md)), so the tests weren't checking what Vercel serves.

## Decision

- Playwright starts the store with `pnpm build && pnpm start --port 5173` instead of `pnpm dev`. Locally it still reuses a server already running on port 5173.
- The sort test in `browse.spec.ts` checks the order again until the list has re-sorted. The list now updates a moment after the address changes rather than at the same time. The check itself is unchanged. David approved this change to an old test on 2026-11-23 (spec R10).

David chose both on 2026-11-23.

## Alternatives considered

- **A longer timeout for the first visit:** doesn't help, because the development server answered with an error rather than slowly.
- **Retrying failed tests:** hides real failures as well as the server's.
- **Re-sorting the category list in the same moment the address changes:** keeps the old test untouched, but adds code to the category page for a delay no shopper can see.

## Consequences

- The browser tests check the same build Vercel serves, including the phone header on the unknown-product page.
- `pnpm test:e2e` builds the store first, so a run takes a few seconds longer, and `pnpm check` builds twice.
- A change to a page shows up in the browser tests only after a fresh build. A development server left running on port 5173 is reused instead, as before.
