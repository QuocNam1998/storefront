# 0003. Prices in whole đồng

- **Status:** proposed
- **Date:** 2026-11-22
- **Raised by:** grocery-store

## Context

The store is becoming Cửa hàng của Thy, a grocery for shoppers in Vietnam. The owner chose VND as the only currency.
Until now every price was stored as US cents and divided by 100 for display. VND has no subunit in practice (no hào or xu in circulation), so prices are always whole đồng.
Every feature that shows, adds up or charges money needs to know how prices are stored and formatted.

## Decision

- All money values (pack prices, old prices, delivery fee, thresholds, subtotals, totals, unit prices) are **whole numbers of đồng**, stored as plain `number` integers. Nothing is divided by 100.
- Money is formatted in one place, `formatPrice` in `src/lib/store.ts` (where the store's other price rules live), using `new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })`. That gives `12.000 ₫`, with a non-breaking space (U+00A0) before `₫` so a price never wraps across lines.
- Unit prices are calculated from the pack's total amount and rounded to whole đồng with `Math.round` before formatting.
- Discount percentages are `Math.round((1 - price / wasPrice) * 100)`.

## Alternatives considered

- **Keep cents and divide by 100:** misleading for a currency with no cents, and an easy source of off-by-100 bugs.
- **A money library (dinero.js and similar):** handles several currencies and exact decimal arithmetic. The store has one currency with no decimals, and integer sums are exact up to `Number.MAX_SAFE_INTEGER` (about 9 × 10¹⁵ đồng), so a library adds weight for nothing.
- **Hand-built formatting (a regex that inserts dots):** `Intl` is already in every target browser and Node, and gets the symbol and spacing right.

## Consequences

- Prices in code and tests are readable as written: `12000` is 12.000 ₫.
- Tests that compare formatted text must include the non-breaking space (`'12.000 ₫'`), or compare against `formatPrice(...)` instead of a typed string. Playwright's text assertions normalize whitespace, so browser tests can use a normal space.
- Supporting a second currency later would mean revisiting this decision (formatting and storage).
