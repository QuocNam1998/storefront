# coding-guardrails: plan

## Approach

Write the rules down, check what can be checked mechanically, and add reuse and simplicity checks to the workflow, as recorded in [decision 0002](../../decisions/0002-kiss-and-dry-guardrails.md).

- **Reused, not rebuilt:** the existing oxlint setup and its `pnpm lint` step in CI, the existing Vitest setup, the shadcn and Playwright MCP servers already in `.mcp.json`, and the two screen sizes already defined in `playwright.config.ts`. Nothing new is installed.
- **Lint limits** are six rules added to `.oxlintrc.json`. Tried on 2026-11-22: with these limits, today's code reports no errors.
- **Lint on edit** is a Claude Code hook in a checked-in `.claude/settings.json`. After Claude writes or edits a file, it runs a small Node script. The script skips anything that isn't a `.ts`/`.tsx` file inside the project, then runs the project's own oxlint on that file, showing errors only. If there are errors, they're shown to Claude, which makes it fix them in the same turn. The script is Node because every machine that can run this project has Node, while jq isn't on every Linux machine. It finds the project folder from its own location, so it needs no setup.
- **Tests** live in one Vitest file beside the hook. The lint-limit tests and the hook tests both need sample files, so they share one helper. Sample files are written under `node_modules/.tmp/`. Tried on 2026-11-22: oxlint lints a file there when given its path, `pnpm lint` doesn't pick it up, and git never tracks it. This keeps `src/` untouched (R3) and `git status` clean even if a test run dies halfway.
- **Rules and workflow** are plain text: a coding rules section in `CLAUDE.md`, a few lines in each workflow command, and a new `storefront-ui` skill. The skill refers to `playwright.config.ts` for screen sizes instead of copying them.
- **Visual check files (R14, R15):** the Playwright MCP already writes its page snapshots and console logs to `.playwright-mcp/` in the project. Screenshots go in the same folder, under `.playwright-mcp/visual-check/<feature>/`, and the folder is git-ignored. One ignore line keeps `git status` clean, and `pnpm test:e2e` only clears `test-results/`, so the screenshots survive.
- **Docs** are updated last.

## Files

| File | Change |
|---|---|
| `.oxlintrc.json` | Add `eslint/complexity` (15), `eslint/max-depth` (3), `eslint/max-params` (4), `eslint/no-else-return`, `eslint/no-lonely-if`, `eslint/no-useless-return`, all as errors |
| `vite.config.ts` | Add `.claude/hooks/*.test.mjs` to the test `include`, so the hook's test runs with `pnpm test` and in CI |
| `.claude/hooks/lint-on-edit.mjs` (new) | The hook script. Needed because the hook has to parse the edit details and filter paths, which is unreadable as a one-line command in JSON. Reads the edit details from input, skips non-`.ts`/`.tsx` files and paths outside the project, runs `node_modules/.bin/oxlint --quiet <file>` from the project folder, and passes any errors back to Claude with a "blocking" exit code. If oxlint can't be started (dependencies not installed), it says so without blocking |
| `.claude/hooks/lint-on-edit.test.mjs` (new) | Tests for R2, R4 and R5. Needed because these requirements are mechanical and must stay proven. Sits beside the hook per the test convention |
| `.claude/settings.json` (new) | A hook on Claude's Write and Edit tools that runs the script, located through the project folder Claude Code provides |
| `CLAUDE.md` | New **Coding rules** section with the four points in spec R1 |
| `.claude/skills/storefront-ui/SKILL.md` (new) | The UI skill (R11, R12). Needed because `frontend-design` covers new looks, not work inside this one |
| `.claude/commands/spec.md` | Step 3: for a UI feature, ask about states, phone layout and keyboard behaviour |
| `.claude/commands/plan.md` | **Approach** names the reused code; **Files** gives a reason for each new file, abstraction or dependency |
| `.claude/commands/implement.md` | Per step: search for reusable code first, run `pnpm lint` and `pnpm build` with the tests, do the visual check after a UI step |
| `.claude/commands/verify.md` | Run `pnpm lint` and `pnpm build`, add the KISS / DRY review, link screenshots for UI requirements |
| `package.json` | A `check` script that runs the tests, browser tests, linter and build in one go. Needed because `/implement` and `/verify` both run that exact line, so it should be written once |
| `.gitignore` | Ignore `.playwright-mcp/`, where the browser tool writes its files and the visual check saves screenshots (R14, R15) |
| `docs/decisions/0002-kiss-and-dry-guardrails.md` (new) | The decision behind this feature. **Proposed**, so David has to accept it before `/implement` |
| `docs/architecture.md` | **Conventions** becomes incomplete and gets a bullet covering the lint limits, lint on edit and the `storefront-ui` skill, in the last step. **Conventions → Running** gets `pnpm check` (step 11). The **Tech stack** line about `.mcp.json` stays true. Purpose, Components, Data flow and Known concerns are unchanged |

## Steps

- [x] 1. Add the six rules to `.oxlintrc.json`. Add the test `include` to `vite.config.ts`. Write the lint-limit half of `.claude/hooks/lint-on-edit.test.mjs`: for each rule, a sample file that breaks it fails, and a file at the limit (complexity 15, depth 3, 4 parameters) passes. The tests run oxlint from the project folder with no extra options, the same way `pnpm lint` does. Run `pnpm lint`: it must exit 0 with only the existing fast-refresh warnings, and `git diff main -- src/` must be empty. Covers R2, R3.
- [x] 2. Write `.claude/hooks/lint-on-edit.mjs` and `.claude/settings.json`. Add the hook tests, which feed the script edit details the way Claude Code does: a `.tsx` file with 5 parameters gives the error with file and line and the blocking exit code; a clean `.ts` file gives no output and exit 0; `README.md`, a `.css` file and a broken `.ts` file outside the project give no output and exit 0. Then ask David to open a fresh Claude Code session in the repo and have Claude edit a scratch `.tsx` file into a lint error. Claude should be shown the error in that turn. Delete the scratch file afterwards. Covers R4, R5, R6.
  - Done 2026-11-22: Claude Code loaded the new hook in the running session, so the live check ran there and no fresh session was needed. Writing `scratch-hook-check.tsx` with 5 parameters showed Claude "PostToolUse:Write hook blocking error … scratch-hook-check.tsx:1:24: error eslint(max-params)" in the same turn. Editing it down to 4 parameters showed nothing. The file was then deleted. With the outside-project check removed from the script, the outside-project test failed, so the test does depend on it.
- [x] 3. Add the **Coding rules** section to `CLAUDE.md`. Covers R1.
- [x] 4. Write `.claude/skills/storefront-ui/SKILL.md`: its description says when to use it versus `frontend-design`. The body covers theme tokens from `src/index.css`, the component reuse order (site components → `src/components/ui/` → shadcn → custom), and the visual check. The check runs `pnpm dev`, takes screenshots at the two sizes in `playwright.config.ts` and saves them under `test-results/visual-check/`, confirms the browser console has no errors, and goes through the shadcn audit checklist. Covers R11, R12.
- [x] 5. Edit `/spec`, `/plan`, `/implement` and `/verify` as in **Files**. Covers R7, R8, R9, R10.
- [x] 6. Add the Conventions bullet to `docs/architecture.md`. Covers R13.
- [x] 7. Fix the KISS / DRY review findings from `/verify` on 2026-11-22. In `.claude/hooks/lint-on-edit.test.mjs`, drop the sample helper's file-extension and folder options, each used by one test, and have those two tests write their files directly. In the `storefront-ui` skill, point to `src/components/` instead of listing its components. In the Conventions bullet of `docs/architecture.md`, point to `.oxlintrc.json` for the limits instead of repeating the numbers. Covers R2, R4, R5, R11, R13.
- [x] 8. Trial-run the workflow on a throwaway UI feature, then discard it. Covers R7, R8, R9, R10, R11.
  - Done 2026-11-22 on branch `trial/about-page` (deleted afterwards, nothing committed; patch kept outside the repo). Feature: an About page, requested by content only. `/spec` asked about states, phone layout and keyboard before writing, and raised the KISS rule against "portable to a backend later" (R7). `/plan` named the reused code (the home page's journey list, `BagArt`, `Button`, the skip link) and gave a reason for each new file. The DRY rule made it share the roast and ship text with the home page instead of copying it (R8). `/implement` reported its reuse check, ran tests and lint each step, and did the visual check. The check caught a wrong test in the plan (focus shown as a ring, not an outline), and `/implement` stopped for approval (R9). `/verify` reported lint output, the KISS / DRY review and screenshots per UI requirement, then archived (R10). `storefront-ui` was loaded and followed for the UI work (R11). It found three gaps, fixed in steps 9 and 10: a type error in a test passed every per-step check and only `pnpm build` caught it; the browser tool left `.playwright-mcp/` in `git status`; `pnpm test:e2e` deleted the screenshots.
- [x] 9. Add `pnpm build` to the checks in `/implement` (per step) and `/verify`. Covers R9, changed and R10, changed.
- [x] 10. Add `.playwright-mcp/` to `.gitignore`. In the `storefront-ui` skill, save screenshots under `.playwright-mcp/visual-check/<feature>/` and drop the note about running after the browser tests. Do a visual check of one page, then run `pnpm test:e2e`: `git status` must be clean and the screenshots must still be there. Covers R14, R15.
- [x] 11. Fix the KISS / DRY finding from the second `/verify` on 2026-11-22: the check line `pnpm test && pnpm test:e2e && pnpm lint && pnpm build` was written out in both `/implement` and `/verify`. Add a `check` script with that line to `package.json`, have both commands run `pnpm check`, and list it under Running in `docs/architecture.md`. Covers R9, R10.
- [ ] 12. Check R2's CI part with a red run. Ask David first, as it pushes to GitHub. Push a throwaway branch that adds a 5-parameter function under `src/`, confirm the CI run fails at the lint step, then delete the branch locally and on GitHub. Covers R2.

## Tests

| Req | Proved by |
|---|---|
| R1 | Reading `CLAUDE.md`: the coding rules section has all four points (`/verify` checks the text) |
| R2 | `.claude/hooks/lint-on-edit.test.mjs`, lint-limit cases: each of the six rules fails a breaking sample and passes one at the limit. The CI part is shown by `pnpm lint` exiting non-zero on a breaking sample, since CI already runs `pnpm lint`. A push to check it on GitHub happens only if David agrees |
| R3 | `pnpm lint` exits 0 with only the existing fast-refresh warnings; `git diff main -- src/` is empty |
| R4 | Hook test cases (error shown with blocking exit; clean file silent), plus the live check in a fresh session (step 2) |
| R5 | Hook test cases: `README.md`, `.css` and an outside-project `.ts` file with a lint error produce no output and exit 0 |
| R6 | `.claude/settings.json` is tracked by git. The hook tests run on macOS locally and on Linux in CI. The script uses only Node and the project's oxlint |
| R7–R10 | Reading each command file, and the trial run in step 8. For the `pnpm build` part of R9 and R10: the command text, plus a deliberate type error in a test file failing `pnpm build` (step 9) |
| R11, R12 | Reading the skill. In a fresh session, a UI request offers `storefront-ui` |
| R13 | Reading the Conventions section of `docs/architecture.md` |
| R14 | Visual check on one page, then `git status` is clean (step 10) |
| R15 | Visual check, then `pnpm test:e2e`, then the screenshots are still in `.playwright-mcp/visual-check/` (step 10) |

R1 and R7–R15 are about text and how Claude behaves, so there's no automated test for them. `/verify` checks them by reading the files and trying them out.

## Risks

- **Decision 0002 is proposed.** `/implement` stops until David accepts it.
- **Hook behaviour is taken from Claude Code's documentation, not tried yet.** The plan assumes that the edit details arrive as input with the file's path, that a "blocking" exit code after an edit shows the message to Claude, and that the project folder is available to the command. The automated tests check the script but not Claude Code itself. Step 2's live check covers that, and if it fails, stop and suggest a plan change.
- **Hook changes may need a new session.** Claude Code may only load hooks when a session starts, so the live check in step 2 runs in a fresh session.
- **Vitest may skip the `.claude` folder** because its name starts with a dot. If the hook test isn't found, stop and suggest moving the hook out of `.claude/` rather than changing how Vitest searches.
- **The browser tool's output folder could change.** R14 and R15 rely on the Playwright MCP writing to `.playwright-mcp/` in the project. If a later version writes elsewhere, `git status` would show it and the ignore line needs updating.
- **`pnpm build` makes each step slower,** by about a second today.
- **Edits through shell commands skip the hook** (a spec non-goal). `pnpm lint` and CI still catch them.
- **Windows** isn't supported by the hook (a spec non-goal): the oxlint path differs there.
- **The workflow commands change partway through this feature.** Step 5 edits `/implement` and `/verify` while this feature is using them. The new wording applies from the next command run.
