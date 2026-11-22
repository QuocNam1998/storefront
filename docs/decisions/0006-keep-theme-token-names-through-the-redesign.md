# 0006. Keep theme token names through the redesign

- **Status:** accepted
- **Date:** 2026-11-22
- **Raised by:** ui-redesign

## Context

The redesign replaces the store's palette: the cool mint page becomes warm cream, the sea-green action color becomes deep forest green, tiles become white, and the apricot deal color becomes a yellow accent that also marks the cart count and the home banner button. Every component uses the theme's named colors (`bg-mist`, `bg-surface`, `text-ink-soft`, `bg-primary`, `text-sea-deep`, `border-line`, `bg-apricot`, the category tints): about 90 places in `src/`. Any later feature that styles UI needs to know which names to use and what each one means now.

## Decision

- Keep every token name in `src/index.css` and change only its value. The names now stand for roles, not hues:
  - `mist`: page background (now cream)
  - `surface`: cards, panels, the drawer and fields (now white)
  - `ink` and `ink-soft`: text and secondary text
  - `sea`: the one action color (now forest green); `sea-deep`: hover and error text
  - `apricot`: the yellow accent
  - `line`: dividers and borders
  - the category tints and icon colors
- `apricot` is no longer for deals only. It marks deals, the cart count and the home banner button, and nothing else.
- No new color tokens. The black cart button and cart bar use `ink` with `surface` text.

## Alternatives considered

- **Rename the tokens to match the new colors** (`cream`, `forest`, `honey`): clearer names, but about 90 edits across every component, for no change a shopper sees. It also makes the redesign's diff much harder to review, because real layout changes would be buried in renames.
- **Add new tokens beside the old ones:** two names for the same role, and the old ones would linger.

## Consequences

- The redesign mostly changes values in one file. The cart, checkout and confirmation pages pick up the new look without touching their markup.
- The names no longer describe the colors (`mist` is cream, `sea` is green). The `storefront-ui` skill and `docs/architecture.md` describe each token by role so that nobody picks a color by its name.
- A later feature that wants role names (`page`, `action`, `accent`) can rename them in one pass with a new decision that supersedes this one.
