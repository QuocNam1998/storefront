# 0002. KISS and DRY guardrails

- **Status:** accepted
- **Date:** 2026-11-22
- **Raised by:** coding-guardrails

## Context

Claude writes most of the code here, and without guardrails it tends to over-build and to rewrite code that already exists. The coding-guardrails spec asks for KISS and DRY rules that every session follows, and for the measurable part of KISS to be checked mechanically. Every later feature's code has to live within whatever limits are chosen here, so later plans need to know them.

## Decision

- **KISS is enforced by lint limits.** `pnpm lint` (and so CI) fails on a function with a cyclomatic complexity above 15, blocks nested more than 3 deep, a function with more than 4 parameters, an `else` after a return, a lone `if` inside an `else`, and a needless trailing `return`. The limits sit exactly at today's ceiling: the existing code passes untouched, and anything more complex fails.
- **Lint runs on every edit.** A Claude Code hook lints each `.ts`/`.tsx` file Claude writes or edits, and shows Claude the errors in the same turn.
- **DRY is enforced by the workflow, not a tool.** `/plan` names the code it reuses, `/implement` searches for existing code before writing, and `/verify` reports repeated logic. Logic is pulled into a shared helper the second time it shows up.
- **When the two conflict, KISS wins.**

## Alternatives considered

- **Copy-paste detection (`jscpd`):** a new dependency that flags JSX which only looks alike, so it would need tuning and would push toward premature abstraction. Not tried on this repo.
- **Stricter limits** (complexity 10, 3 parameters): would force refactoring three working functions in `src/` for no user-visible gain. A later feature can tighten the limits with a new decision.
- **ESLint with a cognitive-complexity plugin:** a second linter beside oxlint, for one rule.
- **Rules in CLAUDE.md only:** nothing would catch a session that ignores them until review.

## Consequences

- Every later feature's functions must stay within the limits. Tightening or loosening them needs a new decision that supersedes this one.
- Lint errors reach Claude while it's still editing, rather than at CI. Edits made through shell commands are only caught by `pnpm lint` and CI.
- Disabling a rule with a comment is against the rules in CLAUDE.md, so code that doesn't fit has to be simplified.
- Repeated code is caught only as well as `/verify`'s review catches it.
