# Data trust and shopper transparency

BuyWise is a discovery and comparison aid. It is not the retailer and does not complete purchases.

## What the app can show

Depending on the provider response, an offer may include a product title, seller/source label, displayed price, rating, review count, image, delivery text and retailer link.

## What the app cannot currently guarantee

- Whether an item is still in stock.
- Whether a seller is authorised or trustworthy.
- Whether a displayed price includes every fee.
- Whether a delivery estimate will be met.
- Whether a stated discount reflects a genuine historical price.
- Whether ratings or review counts are complete or current.

## Market calculations

A median or price position calculated from one search is a snapshot of the returned listings. It is not a price-history chart, a market-wide survey, or proof that an offer is a bargain. Small result sets should be treated cautiously.

## Safe implementation rules

- Keep provider API keys in server-side environment variables.
- Never render unvalidated URL schemes as clickable links or image sources.
- Preserve the restricted-category checks in the search API.
- Do not fabricate product listings, reviews, prices, seller badges or stock labels.
