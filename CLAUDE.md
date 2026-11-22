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

## Coding rules

See [decision 0002](docs/decisions/0002-kiss-and-dry-guardrails.md).

- **KISS:** write the simplest code that meets the requirement. No abstraction, generic type, config object or option that only one caller uses or that exists "for later". Use plain functions and existing components first. Don't add a dependency for something a few lines can do.
- **DRY:** search before writing. Each thing has one source of truth: store rules (prices, shipping, roast dates) in `src/lib/store.ts`, products in `src/data/`, look and feel in `src/index.css`. Pull logic into a shared helper when it shows up a second time. Markup that only looks similar doesn't count.
- **When KISS and DRY conflict, KISS wins.** Two small repeated lines beat the wrong abstraction.
- **Don't silence lint rules** with disable comments. `pnpm lint` limits function complexity, nesting and parameter count, and lints each TypeScript file Claude edits. When code doesn't fit, simplify it.

## UI reference

- Design source: `/design/*.dc.html` plus a screenshot of each (`Main`, `Product`, `Cart` on mobile; `Desktop`, `DesktopProduct` from 1024 px). Reference only: never import them or copy their runtime. See `design/README.md`.
- Target brand from the design: green `#1E5B3A`, accent `#F2C14E`, background `#F7F5EE`, text `#1C1C18`. These reach the code only as tokens in `src/index.css`, through the `design-refresh` feature. Until that feature lands, `src/index.css` is the source of truth; never put a hex value in a component.
- Font: Be Vietnam Pro, weights 400/500/600/700 (already loaded from Fontsource).
- All UI copy is Vietnamese (decision 0004). Every price goes through `formatPrice` in `src/lib/store.ts`; don't format money anywhere else.
- Touch targets at least 44 × 44 px. Use real `<button>`, `<a>`/`<Link>` and `<label>`, never a clickable `<div>`.
- The mockups are look and layout only; their data and logic are placeholders. The app keeps its catalog, its `/p/:slug` routes, its one shared `CartProvider`, its store rules and its COD-only checkout. `design/README.md` lists what not to copy.

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
