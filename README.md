# BuyWise

BuyWise is an independent shopping-intelligence workspace for smartphones and laptops. It helps people discover products, compare retailer offers, keep a shortlist and build a price trail from authorised retailer feeds.

## Current MVP
- Search and filter by category, model, specifications and budget.
- Import authorised retailer/affiliate CSV feeds.
- Group offers by product name and variant, retaining retailer, product URL and import timestamp.
- Compare up to four products side by side.
- View retailer offers sorted by price and open the source retailer page.
- Save a local watchlist, comparison history and target prices.
- Record price snapshots each time a feed is imported.
- Keep fictional starter examples clearly labelled and separate from imported offers.

## Feed format
Required CSV headers: title, price, retailer, url
Optional: brand, category, variant, sku, specs

Example:
title,brand,category,variant,price,retailer,url,specs
Example Phone,Example,Phones,8GB 256GB,34999,Example Store,https://example.com/product,8GB RAM;256GB storage

Use only feeds supplied by retailer or affiliate programmes you are authorised to access. The app does not scrape retailer sites or bypass access controls.

## Run locally
npm install
npm run dev

## Data and privacy
Imported feed data, watchlists, comparison history, price snapshots and target prices are stored in this browser's local storage. They are not synced between devices or accounts yet. Starter examples are fictional and do not represent current market prices.

## Next milestones
1. Add supported official affiliate/API connectors for specific retailers.
2. Add account-backed cloud sync and multi-device persistence.
3. Improve variant matching with GTIN/MPN identifiers and confidence review.
4. Build richer price-history charts and explainable buy/wait assessments.
5. Add opt-in price alerts and retailer/seller trust signals.
