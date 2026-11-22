---
description: Write or update the spec for a feature
argument-hint: <feature-name>
---

Write the spec for feature **$ARGUMENTS**.

1. Read `docs/architecture.md` and `docs/features/INDEX.md`.
2. If `docs/features/_archive/$ARGUMENTS/` exists, the feature is done: stop, and suggest a new feature for the change whose spec names the requirements it changes. Otherwise create or open `docs/features/$ARGUMENTS/spec.md`.
3. Ask me about anything unclear before writing — don't invent requirements. For a feature that changes the UI, ask about anything the request doesn't settle: which states each screen has (empty, loading, error), how it behaves at desktop and phone sizes, and how it works with the keyboard.
4. Use these sections:
   - **Problem**: who needs this, and why
   - **Goals / Non-goals**
   - **Requirements**: numbered (R1, R2, …), each one testable. When updating a spec, keep the existing numbers: add new ones after the last, and cross out a dropped one (`~~R7~~ removed: <why>`) instead of deleting it
   - **Acceptance criteria**: Given / When / Then
   - **Open questions**
5. Describe *what* the feature does, not *how* to build it.
6. Add or update the row in `docs/features/INDEX.md` with status `spec`.
