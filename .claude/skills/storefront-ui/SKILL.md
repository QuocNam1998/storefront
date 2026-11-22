---
name: storefront-ui
description: Build or change UI inside Second Crack's existing look, reusing its theme tokens and components, then check the result in a real browser. Use for any page, component or layout change in this repo. Use frontend-design instead only for a new visual direction or a redesign of the whole look.
---

# Storefront UI

Second Crack already has a look. Work inside it: the job is to fit in, not to invent. For a new visual direction or a redesign, use `frontend-design` instead.

## Use the theme, not raw values

Everything visual comes from `src/index.css`. Read it before styling anything.

- **Color:** use the theme's classes, such as `bg-parchment`, `text-roast`, `bg-primary` and `text-muted-foreground`. The brand palette is bean (page), parchment (raised surfaces), roast (ink) and cherry (actions). No hex values, `rgb()` or Tailwind palette colors like `red-600`. The only exception is drawings in `ProductArt` and `RoastScale`, which show coffee itself.
- **Type:** one family, Archivo. Use its width axis for character: `font-wide` for display text and `font-condensed` for dense labels. Use Tailwind's type scale, not pixel sizes.
- **Spacing and radius:** use Tailwind's scale and the theme's `rounded-*` sizes. No arbitrary values for padding, margin, gap or radius, like `p-[13px]`.
- **Motion:** the bags rising onto the shelf (`shelf-rise`) is the site's one big animation. Don't add another one. Any small transition must respect reduced motion.
- **Focus:** keep the global focus ring. Don't remove outlines.

## Reuse before you write

Check in this order and take the first that fits:

1. **Site components** in `src/components/`.
2. **UI kit** in `src/components/ui/`.
3. **shadcn:** search with the shadcn MCP tools, look at its examples, then add it with the command they give. It lands in `src/components/ui/`.
4. **Custom component:** only when none of the above fits. Say why in the plan.

Change a variant or a prop before you copy a component. Two components that differ by one class are one component.

## Visual check

Do this after every UI change, and after the browser tests have run, because `pnpm test:e2e` clears `test-results/`.

1. Start the app with `pnpm dev` (http://localhost:5173), unless it's already running.
2. With the Playwright MCP tools, open each page you changed at both sizes defined in `playwright.config.ts`: the Desktop Chrome viewport and the Pixel 7 viewport. Take a full-page screenshot of each and save it under `test-results/visual-check/<feature>/`.
3. Read the browser console. There must be no errors or warnings caused by the change.
4. Use the keyboard alone to reach and use every new control. Focus must stay visible.
5. Go through the shadcn audit checklist (the shadcn MCP's audit tool) for any component you added.
6. Look at the screenshots, fix anything that breaks the look or the layout, and repeat. Report the screenshot paths.
