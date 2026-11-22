# CLAUDE.md

Spec-driven project: every feature goes **spec → plan → implement → verify**.
Don't write code for a feature that has no approved spec and plan.

## Rules

- Read `docs/architecture.md` before any non-trivial change.
- One feature = one folder in `docs/features/<feature>/` holding `spec.md` and `plan.md`.
- Keep `docs/features/INDEX.md` current: add a row for each new feature and update its status as it moves along.
- Make a significant technical choice → record it, one file per decision, numbered `NNNN-title.md`, copied from `docs/decisions/0000-template.md`. Where it goes depends on one test: would another feature's plan need to read it?
  - Yes → `docs/decisions/` (project-wide), with a `Raised by` line naming the feature that prompted it.
  - No → `docs/features/<feature>/decisions/` (feature-only, numbered from 0001 within that feature). It is archived with the feature.
- Once a feature is verified, move its folder to `docs/features/_archive/` and mark it `done` in INDEX.md.
- To change a feature that's `done`, write a new feature whose spec names the archived requirements it changes (e.g. "create-a-todo-list R4"). Never edit anything in `_archive/`.
- Requirement numbers (R1, R2, …) are permanent, because plans and tests refer to them. Never reuse or renumber them: add new ones after the last, and cross out a dropped one (`~~R7~~ removed: <why>`) instead of deleting it.
- Code goes in `src/`, tests in `src/**/*.test.ts(x)` beside the file under test (Vitest), browser tests in `e2e/*.spec.ts` (Playwright). Run tests with `pnpm test && pnpm test:e2e`. Every requirement in a spec should have at least one test.

## Workflow commands

| Command | Use |
|---|---|
| `/spec <feature>` | Write or update `docs/features/<feature>/spec.md` |
| `/bug <issue-desc>` | Write a bug spec in `docs/features/<issue-desc>/spec.md` (e.g. `42-cart-total-wrong`, branch `fix/42-cart-total-wrong`), then use `/plan`, `/implement` and `/verify` as usual |
| `/plan <feature>` | Turn the spec into `docs/features/<feature>/plan.md` |
| `/implement <feature>` | Do the plan step by step |
| `/verify <feature>` | Check the code and tests against the spec |

## Pointers

- System overview: `docs/architecture.md`
- Why we chose X: `docs/decisions/` (project-wide), `docs/features/<feature>/decisions/` (feature-only)
- Feature status: `docs/features/INDEX.md`
- Finished work: `docs/features/_archive/`
