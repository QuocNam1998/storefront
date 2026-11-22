# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
