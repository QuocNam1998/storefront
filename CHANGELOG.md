# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-11-22

### Added

- `pnpm test` runs unit and component tests with Vitest, jsdom and Testing Library. Starter tests cover shipping costs, the next roast date and the cart.
- `pnpm test:e2e` runs browser tests with Playwright in Chromium at desktop and phone sizes, starting the dev server when one isn't already running. A starter test places a full order from a product page.
- GitHub Actions CI runs lint, build and both test suites on every push and pull request, and keeps the browser test report when a run fails.
- Spec-driven workflow docs: architecture overview, decision records and feature specs and plans under `docs/`.

### Changed

- README and `docs/architecture.md` describe the test commands and the one-time Chromium install.
