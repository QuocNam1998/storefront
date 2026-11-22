# 0005. axe-core for accessibility checks in browser tests

- **Status:** accepted
- **Date:** 2026-11-22
- **Raised by:** grocery-store

## Context

The grocery-store spec requires WCAG AA contrast for all text (R4) and keyboard access with visible focus (R26).
Contrast depends on the final rendered colors, so jsdom can't check it, and checking it by hand doesn't scale to every page.
Other features will add pages and colors, and their tests should check accessibility the same way.

## Decision

- Add `@axe-core/playwright` as a dev dependency.
- Browser tests scan each page with `new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()` and expect no violations.
  Where a rule must be skipped, the test says which rule and why in a comment next to `disableRules`.
- Keyboard access and focus visibility are still checked by tests that drive the page with the keyboard. axe can't judge those.

## Alternatives considered

- **Hand-written contrast checks** (reading computed colors and calculating ratios in a test): works for a few known pairs, but misses text on unexpected backgrounds and duplicates what axe already does.
- **Lighthouse in CI:** heavier, scores whole pages rather than failing on a specific violation, and needs its own Chrome setup.
- **eslint-plugin-jsx-a11y:** only sees the source, not the rendered colors. It also doesn't fit oxlint, the linter in use.

## Consequences

- Each scanned page adds a little time to `pnpm test:e2e`, doubled by the two browser sizes.
- axe finds about a third to a half of accessibility problems automatically. It doesn't replace keyboard tests or review.
- New features get accessibility checks by adding a scan to their browser tests.
