# product-details

> Add the mockups' `Thông tin` table to the product page: where each product comes from, its pack size and how to store it.

## Problem

Shoppers in a small grocery often ask where a product comes from and how to keep it once opened. The product page from [ui-redesign](../_archive/ui-redesign/spec.md) has room for this beside the description, as the mockups in `designs/` show, but the store has no origin or storage text yet. Thy is writing the real text for each of the 24 products. This feature was split out of ui-redesign (its R17) so the rest of the redesign could ship without waiting for that text.

## Goals

- Every product page shows a `Thông tin` card with origin, pack size and storage, using Thy's real text.

## Non-goals

- Any other change to the product page, the catalog's products, packs or prices.
- Made-up or placeholder text: the card ships only with Thy's text for all 24 products.

## Changes to archived requirements

From ui-redesign (archived once verified):

- **R13** (desktop product page order): the `Mô tả sản phẩm` card gets the `Thông tin` card beside it, so the order becomes: ..., `Mô tả sản phẩm`, `Thông tin`, `Có thể bạn cũng thích`.

## Requirements

- **R1.** A `Thông tin` card shows a table with three rows:
  - `Xuất xứ`: where the product comes from
  - `Quy cách`: the chosen pack's label
  - `Bảo quản`: how to store it.

  Every product in the catalog has an origin and storage text, provided by Thy; none is made up.
- **R2.** At desktop width (768 px and up) the card sits beside the `Mô tả sản phẩm` card, in the same style (white, bordered, rounded). At phone width it sits under the description.

## Acceptance criteria

- **R1:** Given the catalog, then every product has a non-empty origin and storage text, matching Thy's list. Given `Nước suối tinh khiết` with `Lốc 6 chai` chosen, then `Thông tin` shows that product's `Xuất xứ` and `Bảo quản`, and `Quy cách` reads `Lốc 6 chai`.
- **R2:** Given a product page at 1280 px, then the `Thông tin` card's top lines up with the `Mô tả sản phẩm` card's top. At 412 px, it sits below the description card.

## Open questions

- **Input needed, not a question:** Thy's origin and storage text for all 24 products. `/plan` can be written now, but `/implement` waits for the text.
