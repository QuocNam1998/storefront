---
description: Check an implemented feature against its spec
argument-hint: <feature-name>
---

Verify feature **$ARGUMENTS** against its spec.

1. Read `docs/features/$ARGUMENTS/spec.md` and `docs/features/$ARGUMENTS/plan.md`.
2. Run the full test suite (`pnpm test && pnpm test:e2e`) and report the actual output.
3. For each requirement (R1, R2, …) and acceptance criterion, report:
   - **pass / fail / untested**
   - the code and test that cover it (`path:line`)
4. List any plan steps that are still unchecked, and any code change that no requirement covers.
5. If everything passes:
   - move `docs/features/$ARGUMENTS/` to `docs/features/_archive/$ARGUMENTS/`
   - set the status in `docs/features/INDEX.md` to `done`
   Otherwise, list what's left to do and leave the status unchanged.
