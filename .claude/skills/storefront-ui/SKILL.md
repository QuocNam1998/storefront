---
name: storefront-ui
description: Build or change UI inside Cửa hàng của Thy's existing look, reusing its theme tokens and components, then check the result in a real browser. Use for any page, component or layout change in this repo. Use frontend-design instead only for a new visual direction or a redesign of the whole look.
---

# Storefront UI

Cửa hàng của Thy, a small neighborhood grocery, already has a look: warm and friendly, a cream page with white rounded cards, deep forest green for actions and one yellow accent. It follows the mockups in `designs/`. Work inside it: the job is to fit in, not to invent. For a new visual direction or a redesign, use `frontend-design` instead.

## Use the theme, not raw values

Everything visual comes from `src/index.css`. Read it before styling anything.

- **Color:** use the theme's classes, such as `bg-mist`, `bg-surface`, `text-ink`, `text-ink-soft`, `bg-primary` and `text-muted-foreground`. No hex values, `rgb()` or Tailwind palette colors like `red-600`.
  - The token names describe roles, not hues (decision 0006): pick a token by its job, never by its name.
  - mist is the cream page, surface is white (header, cards, tiles, panels, the drawer, form fields), ink is text and the black cart button and cart bar, ink-soft is secondary text, and line is for card borders, dividers and input borders.
  - **sea** (forest green) is the one action color: buttons, links, prices, the focus ring and the free-delivery bar. sea-deep is for button hover and error text. A light green tint for a chosen option is `bg-sea/10`.
  - **apricot** is the yellow accent, used for three things only: deals (the discount badge with ink text, and the struck-through old price), cart counts (the yellow circle), and the home banner (its button and icon).
  - Each category has a tint and an icon color (`bg-tint-snacks`, `text-icon-snacks`, and the same for `drinks` and `essentials`). They go on that category's tiles, placeholder images, sidebar and icon-row tiles. The catalog in `src/data/catalog.ts` holds the full class names.
- **Surfaces:** no drop shadows. Cards and tiles are white on cream, with a `border-line` border and `rounded-2xl`. The category tints carry the color.
- **Type:** one family, Be Vietnam Pro, in weights 400, 500, 600 and 700. Headings use 600; the store name, the home banner heading and the product name use 700. Prices are green and bold with `tabular-nums`. One large heading per page. No wide or condensed styles and no all-caps. Use Tailwind's type scale, not pixel sizes.
- **Spacing and radius:** use Tailwind's scale and the theme's `rounded-*` sizes. No arbitrary values for padding, margin, gap or radius, like `p-[13px]`.
- **Layout:** left-aligned, max width `max-w-7xl` (80rem) with `px-4` gutters on phones.
  - **Widths:** phone layout below `md` (768 px). The shop pages (home, category, deals, search) get the category sidebar and cart panel from `xl` (1280 px), and the category icon row below that.
  - **Product grids:** on shop pages, 2 columns on phones, 3 from `md`, 4 from `lg` and 3 from `xl` (beside the sidebar and panel). Similar products on a product page: 2, then 4 from `md`, then 5 from `xl`.
  - **Bars fixed to the bottom on phones:** mark them `data-bottom-bar`. The layout then leaves room under the footer, and focused controls scroll clear of the bar.
- **Motion:** no load animations. Motion only answers a shopper's action, like the cart drawer's slide. Swapping `Thêm vào giỏ` for the quantity control has no animation. Everything is off under reduced motion, which `src/index.css` already enforces.
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
2. With the Playwright MCP tools, open each page you changed at both sizes defined in `playwright.config.ts` (the Desktop Chrome viewport, 1280 px, and the Pixel 7 viewport), and at 768 px for anything that changes between the phone and desktop layouts. Take a full-page screenshot of each and save it under `.playwright-mcp/visual-check/<feature>/`. Git ignores that folder and the browser tests don't clear it, so the screenshots last until `/verify`.
3. Read the browser console. There must be no errors or warnings caused by the change.
4. Use the keyboard alone to reach and use every new control. Focus must stay visible.
5. Go through the shadcn audit checklist (the shadcn MCP's audit tool) for any component you added.
6. Look at the screenshots, fix anything that breaks the look or the layout, and repeat. Report the screenshot paths.
