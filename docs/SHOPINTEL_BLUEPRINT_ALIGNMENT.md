# ShopIntel — product blueprint alignment

This document records how the two supplied ShopIntel blueprints map to the ShopIntel application.

## Product boundary

ShopIntel should first behave as a shopping discovery and decision-intelligence layer, not as a retailer or a marketplace. Customers research and compare products in ShopIntel, then continue to the retailer for checkout. A unified cart or checkout is explicitly outside the initial platform model.

## Customer journey

1. Accept a natural-language product need, budget and constraints.
2. Let the customer choose from data sources that are actually available.
3. Normalise product records and clearly label the retailer/source.
4. Compare price, specifications, available review evidence and relevant policies.
5. Explain trade-offs and missing information, then link out to the retailer when a permitted URL exists.

## Trust requirements

- Keep canonical product information separate from retailer-specific offers.
- Preserve source, variant, currency and last-checked timestamp for each offer.
- Distinguish exact product matches, variant matches and similar alternatives.
- Never invent ratings, review counts, seller trust, stock, delivery dates, warranty, returns or price history.
- Label retailer-sourced facts, review-derived themes and AI interpretation separately.
- Disclose affiliate links and keep sponsored placements visibly separate from organic ranking.
- Do not describe a CSV import as a live retailer integration. A store should only be described as connected/searchable after an authorised integration is working reliably.
- Retailers keep checkout in the initial model. Do not imply ShopIntel/BuyWise sells or fulfils third-party products.

## Current ShopIntel implementation snapshot

The root application is Next.js. It currently has a phone/laptop catalogue, Groq-powered shopping search and shortlist follow-ups, product comparison, local saved items/history, target-price tracking and browser-based CSV feed import. The application has been rebranded from BuyWise to ShopIntel and the interface follows the supplied indigo/lavender design direction. The imported feed data and the simulated demo catalogue are different sources; demo products and offers must remain visibly marked as simulated.

The product-detail view now includes a Shopping Risk Report panel. It separates specifications and offer data currently present in the catalogue from review, seller, stock, delivery, return, warranty and reliability information that the current data model does not establish.

## Phased roadmap from the supplied blueprints

### Phase 1 — Universal search foundation
- Responsive home/search experience, supported-source selection, product cards and retailer links.
- Source timestamps, variant-aware product identity and robust empty/error states.
- Start with the supported product-data sources actually available; do not display inactive retailer brands as connected.

### Phase 2 — Category intelligence and trust
- Electronics evaluation for processor/chip, RAM, storage, display, battery, camera, connectivity, OS and upgradeability where relevant.
- Fashion evaluation for fabric, fit/sizing, quality feedback and appearance, based only on supplied data.
- Shopping Risk Reports with verified/known facts, review themes and sample context, missing-data warnings, seller/policy details and alternatives.

### Phase 3 — Retention
- Accounts, saved products/research, preferences and price alerts only when persistence and source refresh behaviour are reliable.

### Phase 4 — Operations
- Admin visibility for integration health, data freshness, AI/provider usage and cost, errors, quotas, affiliate clicks and disclosures.

### Phase 5 — Expansion
- Add more stores/categories only after access terms, data quality, operating costs and legal/partner requirements are validated.

## Explicit launch guardrails

Do not claim all stores are connected, that a product is always the cheapest, that a seller is 100% safe, that a size will definitely fit, or that authenticity has been proved by an AI report. Use qualified wording such as “lowest price among offers we could verify at the displayed time” and clearly show when data is unavailable.

The proposed ₹199/month and 300 research sessions/month premium plan in the UI blueprint is a proposal, not a proven price or cost limit. Measure actual provider costs and pilot real sessions before offering any quota or subscription.
