---
description: Implement a feature by following its plan
argument-hint: <feature-name>
---

Implement feature **$ARGUMENTS**.

1. Read `docs/features/$ARGUMENTS/spec.md` and `docs/features/$ARGUMENTS/plan.md`. If there's no plan, stop and tell me. If the feature's status in `docs/features/INDEX.md` is `spec`, the spec changed after the plan was written: stop and tell me to run `/plan $ARGUMENTS` first.
2. Check the status of every decision the plan links to in `docs/decisions/`, and of every file in `docs/features/$ARGUMENTS/decisions/`. If any is not `accepted` (still `proposed`, or `superseded`), stop, list them, and change nothing. Don't accept a decision yourself.
3. Set the feature's status in `docs/features/INDEX.md` to `in-progress`.
4. Work through the plan's unchecked steps in order. For each step:
   - change only what that step needs (code in `src/`, tests in `src/**/*.test.ts(x)` beside the file under test, browser tests in `e2e/*.spec.ts`)
   - run the tests (`pnpm test && pnpm test:e2e`)
   - for a bug's regression-test step, the new test must fail. If it passes, it doesn't reproduce the bug: stop and tell me
   - tick the step in `plan.md`
5. If the plan turns out to be wrong, stop and suggest a change to `plan.md` rather than going off-plan.
6. When every step is done, tell me to run `/verify $ARGUMENTS`.
