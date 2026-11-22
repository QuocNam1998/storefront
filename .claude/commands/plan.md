---
description: Turn a feature spec into an implementation plan
argument-hint: <feature-name>
---

Write the implementation plan for feature **$ARGUMENTS**.

1. Read `docs/features/$ARGUMENTS/spec.md`. If it's missing or has open questions, stop and tell me.
2. Read `docs/architecture.md`, the relevant files in `docs/decisions/`, and any files in `docs/features/$ARGUMENTS/decisions/`.
3. Write `docs/features/$ARGUMENTS/plan.md` with:
   - **Approach**: a short summary of the design. Name the existing code it reuses (`src/lib/`, `src/components/`, `src/data/`), following the coding rules in `CLAUDE.md`
   - **Files**: each file to create or change, and what changes in it. Give each new file, abstraction or dependency a one-line reason it's needed. If the change will make any section of `docs/architecture.md` untrue, list it here and make updating it the last step, so it describes the system only once the code exists
   - **Steps**: an ordered checklist (`- [ ]`); each step small enough to review on its own and listing which requirements (R1, R2, …) it covers
     If the spec has a **Symptom** section (a bug), the first step is a regression test that reproduces it and fails on the current code. Put the root cause in **Approach**.
   - **Tests**: which tests prove each requirement
   - **Risks**

   If `plan.md` already exists, update it instead of rewriting it:
   - keep every ticked step (`- [x]`) word for word
   - put new or changed work in new unticked steps after the last one, naming the requirements they cover (mark changed ones "R4, changed")
   - bring Approach, Files, Tests and Risks in line with the current spec
4. If the plan makes a significant technical choice, record it from `docs/decisions/0000-template.md`:
   - another feature's plan would need to read it → `docs/decisions/`, with `Raised by: $ARGUMENTS`
   - it affects only this feature → `docs/features/$ARGUMENTS/decisions/`, numbered from 0001
5. Set the feature's status in `docs/features/INDEX.md` to `planned`.
