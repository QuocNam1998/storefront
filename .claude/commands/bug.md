---
description: Write or update the spec for a bug fix
argument-hint: <issue-number-short-desc>
---

Write the bug spec for **$ARGUMENTS**. Name it after the GitHub issue: the issue number, then a short kebab-case description, e.g. `42-cart-total-wrong`. The fix branch is the same name with a `fix/` prefix (`fix/42-cart-total-wrong`).

1. Read `docs/architecture.md` and `docs/features/INDEX.md`.
2. If `docs/features/_archive/$ARGUMENTS/` exists, this fix is already done: stop and tell me. Otherwise create or open `docs/features/$ARGUMENTS/spec.md`.
3. If the broken behaviour belongs to a feature in `docs/features/_archive/`, name the requirement this fix restores (e.g. "restores shop-filters R3"). Never edit the archived spec.
4. Ask me about anything unclear before writing. Don't guess at a cause or invent behaviour. For this storefront, ask about:
   - where it happens: `pnpm dev` or the built site (`pnpm build && pnpm preview`), which browser, desktop or mobile width
   - the page and full URL, including any shop filters or sorting in the query string
   - what was in the cart and any earlier orders saved in the browser, or whether it was a fresh browser with nothing saved
   - the product, size, grind and quantity involved
   - today's date and time zone, since the next roast date and order dates depend on them
   - the exact checkout form input, if checkout is involved
5. Use these sections:
   - **Symptom**: what the shopper sees, and the GitHub issue link
   - **Steps to reproduce**: environment (dev or built site, browser, viewport), starting state (cart, saved orders, date), the exact clicks or input
   - **Expected vs actual**
   - **Requirements**: numbered (R1, R2, …), each one testable. R1 states the expected behaviour. Add more for nearby behaviour that must stay unchanged. When updating, keep existing numbers and cross out dropped ones (`~~R3~~ removed: <why>`)
   - **Acceptance criteria**: Given / When / Then, with the first one written as the reproduction steps
   - **Open questions**
6. Describe *what* should happen, not the cause or the fix. Those go in the plan.
7. Add or update the row in `docs/features/INDEX.md` with status `spec`.
