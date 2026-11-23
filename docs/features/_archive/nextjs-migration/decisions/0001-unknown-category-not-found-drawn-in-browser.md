# 0001. Unknown category: not found page drawn in the browser

- **Status:** accepted
- **Date:** 2026-11-22

## Context

The spec asks for the not found page to arrive from the server (R6) with a 404 status (R13). Checked 2026-11-22 on Next.js 16.4.6, in this store and in a bare Next.js app:

- An address that matches no route gets the fully rendered not found page from the server, with a 404.
- A route rendered for each request that calls `notFound()` sends a 404 with an empty page. The browser then draws the not found page from the page's data. With JavaScript on it looks exactly as before, and the unknown category keeps its shop sidebar. With JavaScript off, the page is blank.
- A route that lists its slugs ahead of time and refuses any others treats an unknown slug as an unmatched address: fully rendered and a 404. But Next.js ignores that refusal on a route rendered for each request (`/c/khong-co` answered 200).

The product route can list its slugs ahead of time. The category route can't, because it has to render for each request so that the filtered list is in the page (R6).

## Decision

- **Products:** the route lists all product slugs ahead of time and refuses any others, so an unknown product gets the server-rendered not found page with a 404.
- **Categories:** the route keeps calling `notFound()`. An unknown category answers 404, and its not found page (inside the shop layout, as today) is drawn in the browser.
- Spec R6 is narrowed to match, and R8 no longer counts the browser's console report of a 404 page.

David chose this on 2026-11-22.

## Alternatives considered

- **A Next.js proxy (request filter) that answers unknown category addresses with the not found page before rendering:** meets R6 in full, but adds a new file and concept for one dead-end address, and the page would lose the shop sidebar, a visible change (R2).
- **Drop per-request rendering for categories:** the filtered list would then only appear in the browser, which breaks the main part of R6.

## Consequences

- With JavaScript off, `/c/<unknown>` shows a blank page that still answers 404. Search engines still see the 404.
- Product pages are built ahead of time, so they're served without rendering on each request.
- On a phone, the unknown-product page now shows the site header, as every other not found page does. The old app hid it, because it hid the header on every `/p/` address, including that not found page with no buttons of its own. Found on the Vercel deployment on 2026-11-23, and kept by David as an accidental fix. `pnpm dev` still hides it, because the development server renders this not found page differently from the production build.
- If a later Next.js release renders `notFound()` on the server for routes rendered per request, this decision can be revisited and R6 restored.
