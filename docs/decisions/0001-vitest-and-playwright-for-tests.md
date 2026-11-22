# 0001. Vitest and Playwright for tests

- **Status:** accepted
- **Date:** 2026-11-22
- **Raised by:** test-setup

## Context

The storefront had no tests. The spec-driven workflow needs a test command for every feature. The test-setup spec asks for fast tests of plain logic and React components, plus real-browser tests of the shopping flow at desktop and phone sizes. Every later feature's plan will write tests with whatever is chosen here.

## Decision

- **Unit and component tests:** Vitest, running in jsdom (a simulated browser) with React Testing Library. Tests sit next to the file they test as `src/**/*.test.ts(x)`. They import `describe`, `it` and `expect` from `vitest` explicitly rather than relying on globals. Before each test, saved browser data is cleared and anything rendered by the previous test is removed. Run with `pnpm test`.
- **Browser tests:** Playwright, in `e2e/*.spec.ts`, run in Chromium at a desktop size and in Chromium emulating a phone (Pixel 7). Playwright starts `pnpm dev` itself when nothing is already running on port 5173. Run with `pnpm test:e2e`.

David chose this pair at project setup, following the README's "Next steps" (Vitest for cart logic, Playwright for the checkout flow).

## Alternatives considered

- **Jest:** needs its own TypeScript, JSX and `@/` path setup alongside Vite's. Vitest reuses `vite.config.ts`, so tests resolve imports the same way the app does.
- **happy-dom instead of jsdom:** faster, but it implements less of the browser. _TBD: whether speed ever matters enough here to switch._
- **Vitest browser mode:** runs component tests in a real browser, but it adds a second browser setup on top of Playwright. Not needed for the current tests.
- **Cypress:** not picked at setup. Playwright also covers phone emulation, and this repo's Claude Code setup already uses the Playwright MCP server.

## Consequences

- `pnpm build` type-checks test files in `src/` along with the app. A broken test can fail the build.
- Each machine, and each CI run, has to download Chromium once (`pnpm exec playwright install chromium`).
- jsdom isn't a real browser. Layout, CSS and anything visual are only checked by Playwright.
- Browser tests run twice, once per screen size, so they take about twice as long.
