# coding-guardrails

## Problem

Claude writes most of the code in this repo. Without clear rules it drifts toward two habits: building more than the task needs (wrappers, options and abstractions with a single user) and writing new code where reusable code already exists (a second price formatter, a hand-rolled button, a raw color instead of a theme token). Nothing in the repo stops either habit today. CLAUDE.md has no coding rules, the linter only checks hooks and fast refresh, and the workflow commands never ask "does this already exist?" or "is this simpler than it needs to be?". The UI side has the same gap: the `frontend-design` skill is about inventing a new look, not working inside the existing one, and no step ever opens the site to look at the result.

The developer needs the repo itself to push every Claude session (local, cloud or another contributor's) toward simple code that isn't repeated, and to catch the most measurable kinds of complexity mechanically, at the moment the code is written.

## Goals / Non-goals

**Goals**
- KISS and DRY rules written down in the project's CLAUDE.md, so they apply to every session.
- The linter fails on overly complex functions, both locally and in CI.
- Claude sees lint errors in a file right after editing it, without waiting for CI.
- The spec → plan → implement → verify commands ask for reuse and simplicity, and check for them.
- A project skill for building UI inside Second Crack's existing look, including a visual check in a real browser.

**Non-goals**
- Detecting copy-pasted code with a tool. Repeated code is caught in review by `/verify`.
- Refactoring existing code. The new limits are set so today's code passes.
- Linting edits Claude makes through shell commands instead of its file-editing tools. `pnpm lint` and CI still catch those.
- Running the edit-time lint on native Windows shells. macOS and Linux only.
- Pinning MCP server versions, or any change to storefront behavior.

## Requirements

**Coding rules**

- **R1.** `CLAUDE.md` has a coding rules section that states:
  - **KISS:** write the simplest code that meets the requirement. No abstraction, generic type, config object or option that only one caller uses or that exists "for later". Use plain functions and existing components first. Don't add a dependency for something a few lines can do.
  - **DRY:** search before writing. Each thing has one source of truth: store rules (prices, shipping, roast dates) in `src/lib/store.ts`, products in `src/data/`, look and feel in `src/index.css`. Pull logic into a shared helper when it shows up a second time. Markup that only looks similar doesn't count.
  - When KISS and DRY conflict, KISS wins.
  - Lint rules aren't silenced with disable comments. The code is simplified instead.

**Lint limits**

- **R2.** `pnpm lint` reports an error, and exits non-zero, for:
  - a function with a cyclomatic complexity above 15
  - blocks nested more than 3 deep
  - a function with more than 4 parameters
  - an `else` after a branch that already returns
  - an `if` that is the only statement inside an `else`
  - a `return` with nothing after it at the end of a function
- **R3.** The current code passes `pnpm lint` with no new errors and no changes under `src/`. The existing fast-refresh warnings stay warnings.

**Lint on edit**

- **R4.** When Claude Code creates or edits a `.ts` or `.tsx` file in this project with its file-editing tools, that file is linted straight away. If lint reports errors, they're shown to Claude in the same turn so it can fix them. If the file is clean, nothing is shown.
- **R5.** Editing any other kind of file (Markdown, JSON, CSS), or a file outside the project, doesn't run the linter.
- **R6.** The lint-on-edit setting is checked into the repo, so it applies to anyone who opens the project in Claude Code. It needs nothing beyond the project's dependencies and standard macOS and Linux command-line tools.

**Workflow commands**

- **R7.** `/spec`, for a feature that changes the UI, asks about anything the request doesn't already settle: which states each screen has (empty, loading, error), how it behaves at desktop and phone sizes, and how it works with the keyboard.
- **R8.** `/plan` requires the **Approach** to name the existing code the feature reuses, and each new file, abstraction or dependency listed under **Files** to give a one-line reason it's needed.
- **R9.** `/implement`, for each step:
  - looks for existing code to reuse in `src/lib/`, `src/components/` (including `ui/`) and `src/data/` before writing new code
  - runs `pnpm lint` and `pnpm build` as well as the tests, so a type error anywhere, including in a test file, is caught at that step
  - after a step that changes the UI, does the visual check from R11
- **R10.** `/verify`:
  - runs `pnpm lint` and `pnpm build`, and reports their actual output alongside the test output
  - adds a **KISS / DRY review** to its report, listing repeated logic, abstractions or options with only one user, and exports nothing imports. It lists "none found" when that's the case.
  - for each UI requirement, links the screenshots from the visual check as evidence

**UI skill**

- **R11.** A project skill named `storefront-ui` is offered when Claude builds or changes UI in this repo. It covers:
  - using the theme tokens in `src/index.css` for color, type and spacing, not raw values
  - checking for an existing component in this order: site components, then `src/components/ui/`, then adding one from shadcn, and only then writing a custom one
  - a visual check: run the app, take a screenshot at desktop size and at phone size (the same sizes the browser tests use), confirm the browser console shows no errors, and go through the shadcn audit checklist
- **R12.** The `storefront-ui` skill says when to use it and when to use `frontend-design` instead: `storefront-ui` for work inside the existing look, `frontend-design` for a new visual direction or a redesign.

**Docs**

- **R13.** The Conventions section of `docs/architecture.md` mentions the lint limits, lint on edit and the `storefront-ui` skill. Everything else in the file is still true.

**Visual check files** (found by the trial run of the workflow on 2026-11-22)

- **R14.** Doing the visual check leaves `git status` unchanged: nothing it or the browser tool writes shows up as a new file.
- **R15.** Screenshots from the visual check are still there after a later `pnpm test:e2e` run, so `/verify` can link them at the end of a feature.

## Acceptance criteria

- **R1:** Given the feature is done, when I read `CLAUDE.md`, then its coding rules section contains each of the four points in R1.
- **R2**
  - Given a `.ts` file under `src/` with a function that takes 5 parameters, when I run `pnpm lint`, then it reports an error for that function and exits non-zero.
  - Given a file with an `if` nested 4 blocks deep, then `pnpm lint` reports an error for it.
  - Given a function with a complexity of 16, then `pnpm lint` reports an error for it. Given one with a complexity of 15, then it doesn't.
  - Given `if (a) { return 1 } else { return 2 }`, then `pnpm lint` reports an error for the `else`.
  - Given `else { if (b) { … } }` with nothing else in the `else`, then `pnpm lint` reports an error for it.
  - Given a function that ends with a bare `return`, then `pnpm lint` reports an error for it.
  - Given a push to GitHub that adds any of the above, then the CI run fails at the lint step.
- **R3:** Given the feature is done, when I run `pnpm lint`, then it exits 0, its only warnings are the fast-refresh warnings that were there before, and `git diff main -- src/` shows no changes.
- **R4**
  - Given Claude edits a `.tsx` file and leaves a function with 5 parameters, then in that same turn Claude is shown the lint error naming the file and line.
  - Given Claude edits a `.ts` file that has no lint errors, then nothing extra is shown.
- **R5:** Given Claude edits `README.md` or `src/index.css`, then the linter doesn't run.
- **R6:** Given a fresh clone with dependencies installed, on macOS or Linux, when Claude edits a `.ts` file with a lint error, then the error is shown, with no extra setup.
- **R7:** Given `/spec` for a feature that adds a new page and the request mentions only its content, then Claude asks about its states, its phone layout and its keyboard behaviour before writing the spec.
- **R8:** Given `/plan` for a feature whose plan adds a new file, then **Approach** names the existing code being reused and **Files** gives a reason for the new file.
- **R9:** Given `/implement` on a plan with a UI step, then for that step Claude reports what existing code it checked, the `pnpm lint` and `pnpm build` results alongside the test results, and the desktop and phone screenshots. Given a step that leaves a type error in a test file, then that step's checks fail.
- **R10:** Given `/verify` on a finished feature, then the report includes the `pnpm lint` and `pnpm build` output, a KISS / DRY review section (or "none found"), and screenshots for each UI requirement.
- **R11:** Given a request to add a UI element, then the `storefront-ui` skill is offered, and following it means using theme tokens, reusing components in the stated order, and doing the visual check.
- **R12:** Given the feature is done, when I read the `storefront-ui` skill, then it says when to use it and when to use `frontend-design`.
- **R13:** Given the feature is done, then the Conventions section of `docs/architecture.md` mentions the lint limits, lint on edit and the `storefront-ui` skill.
- **R14:** Given a clean working tree, when the visual check is done on a page, then `git status` still shows no changes.
- **R15:** Given visual-check screenshots of a page, when `pnpm test:e2e` runs afterwards, then the screenshots are still there.

## Open questions

None.
