# 0004. Vietnamese-only interface, written directly in components

- **Status:** proposed
- **Date:** 2026-11-22
- **Raised by:** grocery-store

## Context

The owner chose a Vietnamese interface for Cửa hàng của Thy. The grocery-store spec lists an English or bilingual interface as a non-goal.
Every later feature adds text a shopper sees, so each one needs to know which language to write it in and where it lives.

## Decision

- Everything a shopper sees is written in Vietnamese, directly in the components and in the catalog data. There is no translation library and no message catalog.
- Code, comments, file names, routes, test names, commit messages and the docs in `docs/` stay in English. Routes use short English paths (`/c/:slug`, `/p/:slug`, `/deals`, `/search`), with Vietnamese, accent-free slugs for categories and products (`/c/nuoc-uong`, `/p/nuoc-suoi-tinh-khiet`).
- `<html lang="vi">`. Dates, numbers and money are formatted with the `vi-VN` locale.
- Accessible names (`aria-label`, screen-reader-only text) are Vietnamese too, so browser tests find controls by their Vietnamese names, for example `getByRole('button', { name: 'Thêm' })`.

## Alternatives considered

- **An i18n library (react-i18next, FormatJS) with Vietnamese as the only locale:** makes a second language cheaper later, but every string goes through a key, and copy is harder to read and review in code. With one language and no plan for a second, it isn't worth it now.
- **English interface with VND prices:** the owner chose Vietnamese.

## Consequences

- Copy is easy to read and change where it's used.
- Adding a second language later means pulling strings out of every component. If that happens, supersede this decision.
- Test selectors use Vietnamese text, so changing a button's wording means updating its tests.
