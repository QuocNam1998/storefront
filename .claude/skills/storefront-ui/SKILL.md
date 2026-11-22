---
name: storefront-ui
description: Build or change UI inside Cửa hàng của Thy's existing look, reusing its theme tokens and components, then check the result in a real browser. Use for any page, component or layout change in this repo. Use frontend-design instead only for a new visual direction or a redesign of the whole look.
---

# Storefront UI

Cửa hàng của Thy, a small neighborhood grocery, already has a look: calm, quiet, like still water. Work inside it: the job is to fit in, not to invent. For a new visual direction or a redesign, use `frontend-design` instead.

## Use the theme, not raw values

Everything visual comes from `src/index.css`. Read it before styling anything.

- **Color:** use the theme's classes, such as `bg-mist`, `bg-surface`, `text-ink`, `text-ink-soft`, `bg-primary` and `text-muted-foreground`. No hex values, `rgb()` or Tailwind palette colors like `red-600`.
  - mist is the page, surface is for tiles, the drawer, form fields and summary panels, ink is text, ink-soft is secondary text, and line is for dividers and input borders.
  - **sea** is the one action color: buttons, links, the focus ring and the free-delivery bar. sea-deep is for button hover and error text.
  - **apricot** marks deals and nothing else: the discount badge (ink text on it) and the struck-through old price.
  - Each category has a tint and an icon color (`bg-tint-snacks`, `text-icon-snacks`, and the same for `drinks` and `essentials`). They go on that category's tiles, placeholder images and home band. The catalog in `src/data/catalog.ts` holds the full class names.
- **Surfaces:** no drop shadows. Tiles are surface-colored on mist with the theme radius. The category tints carry the color.
- **Type:** one family, Be Vietnam Pro, in weights 400, 500, 600 and 700. Headings use 600. Prices use 600 with `tabular-nums`, and 700 is for the cart total only. One large heading per page. No wide or condensed styles and no all-caps. Use Tailwind's type scale, not pixel sizes.
- **Spacing and radius:** use Tailwind's scale and the theme's `rounded-*` sizes. No arbitrary values for padding, margin, gap or radius, like `p-[13px]`.
- **Layout:** left-aligned, max width `max-w-6xl` (72rem) with `px-4` gutters on phones. Product grids are 2 columns on phones, 3 from `md`, 4 from `lg` and 5 from `xl`.
- **Motion:** no load animations. Motion only answers a shopper's action, like the cart drawer's slide. Swapping `Thêm` for the quantity control has no animation. Everything is off under reduced motion, which `src/index.css` already enforces.
- **Focus:** keep the global focus ring. Don't remove outlines.
- **Language:** every word a shopper sees is Vietnamese, written straight into the component (decision 0004). Prices go through `formatPrice` in `src/lib/store.ts`.

## Reuse before you write

Check in this order and take the first that fits:

1. **Site components** in `src/components/`.
2. **UI kit** in `src/components/ui/`.
3. **shadcn:** search with the shadcn MCP tools, look at its examples, then add it with the command they give. It lands in `src/components/ui/`.
4. **Custom component:** only when none of the above fits. Say why in the plan.

Change a variant or a prop before you copy a component. Two components that differ by one class are one component.

## Visual check

Do this after every UI change.

1. Start the app with `pnpm dev` (http://localhost:5173), unless it's already running.
2. With the Playwright MCP tools, open each page you changed at both sizes defined in `playwright.config.ts`: the Desktop Chrome viewport and the Pixel 7 viewport. Take a full-page screenshot of each and save it under `.playwright-mcp/visual-check/<feature>/`. Git ignores that folder and the browser tests don't clear it, so the screenshots last until `/verify`.
3. Read the browser console. There must be no errors or warnings caused by the change.
4. Use the keyboard alone to reach and use every new control. Focus must stay visible.
5. Go through the shadcn audit checklist (the shadcn MCP's audit tool) for any component you added.
6. Look at the screenshots, fix anything that breaks the look or the layout, and repeat. Report the screenshot paths.
