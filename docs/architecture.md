# BuyWise architecture

## Current request flow

1. The browser submits a product phrase to `GET /api/products/search?q=...`.
2. The server validates the request and applies the restricted-category guard.
3. The server calls the configured shopping-data provider using a server-only API key.
4. The route normalises provider results into a small, stable offer shape.
5. The browser renders the listings and supports sorting, comparison and a local watchlist.

## Main areas

- `src/app/page.tsx`: discovery interface and client-side interaction state.
- `src/app/api/products/search/route.ts`: server-side shopping search integration.
- `src/lib/products`: pure product analysis, sorting and browser persistence helpers.
- `src/lib/search`: search-input validation shared by UI and tests.
- `src/lib/security`: URL validation for external resources.
- `tests`: deterministic tests that do not call external services or consume API quota.

## Design boundaries

- Provider credentials stay on the server.
- Search results are observations, not verified stock or historical pricing.
- No checkout, payment, order placement or seller endorsement is implemented.
- Market calculations use only the current result set and must be labelled as observed data.
