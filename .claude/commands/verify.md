---
description: Check an implemented feature against its spec
argument-hint: <feature-name>
---

Verify feature **$ARGUMENTS** against its spec.

1. Read `docs/features/$ARGUMENTS/spec.md` and `docs/features/$ARGUMENTS/plan.md`.
2. Run `pnpm check` (the tests, browser tests, linter and type-checking build) and report the actual output.
3. For each requirement (R1, R2, …) and acceptance criterion, report:
   - **pass / fail / untested**
   - the code and test that cover it (`path:line`)
   - for a UI requirement, the screenshots from the `storefront-ui` visual check
4. List any plan steps that are still unchecked, and any code change that no requirement covers.
   Add a **KISS / DRY review** of the feature's changes: repeated logic, abstractions or options with only one user, and exports nothing imports. Write "none found" if there are none.
5. If everything passes, set the status in `docs/features/INDEX.md` to `verified` and leave the folder where it is. Archiving waits for the PR's CI to pass (see CLAUDE.md).
   Otherwise, list what's left to do and leave the status unchanged.
