# BuyWise

**Make the smarter buy.**

BuyWise is a shopping-intelligence workspace designed to help people research, understand and compare smartphones and laptops before choosing where to buy.

## Current build

This repository currently contains the first redesigned UI foundation:
- Responsive discovery workspace for phones and laptops
- Search, category filtering and sorting
- Product save/watchlist interactions
- Side-by-side comparison selection
- Clear demo-data labeling

## Important data note

The catalogue currently uses illustrative demo entries. Prices, ratings, product names and specifications are not live retailer data and must not be treated as purchase advice.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Roadmap

1. Connect compliant retailer / affiliate product feeds.
2. Build normalized product and variant matching.
3. Add live offer comparison with source and freshness labels.
4. Add price history and deal context.
5. Add accounts, persistent watchlists and user preferences.

BuyWise is a decision layer, not a marketplace or checkout provider.
