# 0007. Next.js App Router on Vercel

- **Status:** accepted
- **Date:** 2026-11-22
- **Raised by:** nextjs-migration

## Context

The store is a browser-only React app built with Vite and React Router. Thy needs an API and admin pages (products, categories, order tracking) next, and wants them in this codebase rather than in a second project. The nextjs-migration spec asks for the store to move to Next.js first, with no change a shopper can see, with the catalog pages rendered on the server, and with deployment to Vercel. Every later feature's plan (API, database, admin) builds on how this move lays out the code.

## Decision

- **Next.js 16 with the App Router**, deployed to Vercel on the owner's account. `pnpm dev` stays on port 5173, and `pnpm start` serves the built site.
- **TypeScript stays at 7.** Checked 2026-11-22: `next build` from Next.js 16.4.6 type-checked a test app with `typescript` 7.0.2. It failed on a deliberate type error and passed once the error was fixed. The downgrade agreed in the spec isn't needed.
- **Routes are thin files in `src/app/`.** A route file reads the address, shows the not found page with a 404 status for an unknown slug, marks the page for rendering on every request when its query string matters, and renders one page component.
- **Page components move from `src/pages/` to `src/views/`.** Next.js treats any `src/pages/` folder as old-style routes. Checked 2026-11-22: a `src/pages/Home.tsx` beside `src/app/` made `next build` fail.
- **Pages and site components stay client components.** Next.js still renders them to HTML on the server, so their content is in the page before any script runs. Only route files and layouts are server components for now. Server-only code (API routes, database access) arrives with the features that need it.
- **Browser storage is read only after the page has loaded**, never during the first render. That covers the cart and orders, and anything else later that lives in localStorage. Until then, the parts that depend on it show nothing rather than a guess.
- **Vitest keeps Vite for tests only.** Its settings move from `vite.config.ts` to `vitest.config.ts`. Playwright builds the store and serves it with `pnpm start` on port 5173 ([nextjs-migration feature decision 0002](../features/_archive/nextjs-migration/decisions/0002-browser-tests-on-the-built-store.md)).

## Alternatives considered

- **React Router in framework mode** (the successor to Remix): the smallest change, since links and route hooks stay as they are, and it can render on the server too. Turned down because Next.js has the larger ecosystem for admin tools and auth, and deploys to Vercel with no setup.
- **Keep the Vite app and add a separate API project:** two codebases to keep in step, which is what this move is meant to avoid.
- **The Next.js Pages Router:** older, and Next.js's new features (server components, server actions) are built for the App Router.
- **Server components for whole pages now:** most pages read the cart or the address on every interaction, so they would need splitting into server and client parts. That's more change than "no visible difference" needs. A later feature can convert a page when it has a reason to.

## Consequences

- A new page is a route file in `src/app/` plus a page component in `src/views/`.
- The catalog is still bundled into the browser's JavaScript, as before. Moving it to the server is the backend feature's job.
- Moving between pages now fetches the page's data from the server, so the site is no longer free of network requests after the first load. It needs Node.js or Vercel to run, and can't be served as plain files.
- For a shopper with a saved cart, the cart count and cart contents appear a moment after the page itself.
- [Decision 0001](0001-vitest-and-playwright-for-tests.md) still holds, except that tests are configured in `vitest.config.ts` rather than `vite.config.ts`.
