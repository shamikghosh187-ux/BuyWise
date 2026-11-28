# ShopIntel

**Buy Smarter. Not Harder.** ShopIntel is a fashion-first shopping intelligence platform. It helps shoppers discover clothing, footwear and accessories, compare available retailer offers, and understand style, fit, fabric and value before continuing to a retailer. Electronics remains a secondary discovery category.

This repository was previously used for BuyWise. The application is now branded as **ShopIntel**.

## Current experience

- Natural-language shopping search powered by a Groq model configured on the server.
- Product recommendations grounded in the catalogue supplied to the model.
- Contextual follow-up questions about the current shortlist.
- Fashion-first homepage and shopping brief, with clothing, footwear and accessories as primary discovery paths.
- Fashion product-feed categorisation plus electronics discovery for phones and laptops.
- Product discovery, category filtering, price sorting and imported-source filtering.
- Side-by-side comparison for up to four products.
- Product detail view with a Shopping Risk Report that distinguishes available catalogue information from missing or unverified information.
- Local saved products, comparison history, imported feed records, price snapshots and target prices.
- CSV import for retailer or affiliate product feeds the operator is authorised to use.

## Current data coverage

The starter catalogue contains fictional phone and laptop examples for interface testing. These are labelled as preview/simulated records and are not real products, verified offers or current market prices.

Imported CSV offers and permitted product-image URLs are stored locally in the current browser. A manual CSV import is not a live retailer integration. Retailers are only presented as available source filters when they exist in the imported feed data. Amazon, Flipkart, Myntra, AJIO and other retailers must not be described as connected until authorised integrations are built and tested.

The CSV parser recognises fashion/apparel, footwear and accessories product categories as well as phones and laptops. Fashion recommendations are grounded in attributes actually supplied by an imported feed; richer fabric, fit, size and review intelligence depends on adding structured source data. Home & Kitchen remains planned.

## CSV feed format

Required headers: title, price, retailer, url

Optional headers: brand, category, variant, sku, specs

Use only retailer/affiliate data and product images you are authorised to access. The `image_url` column must point to an image the feed permits ShopIntel to display. The app does not scrape retailer sites or bypass access controls.

## Run locally

npm install
npm run dev
npm run typecheck
npm run build

## AI configuration

Add a Groq API key through the in-app Settings dialog. The key is stored in this browser's local storage and sent to the ShopIntel server route when the user requests AI search or follow-up analysis. Do not commit API keys or .env secrets.

## Data, trust and privacy

Imported feed data, watchlists, comparison history, price snapshots and target prices are currently stored in this browser's local storage. They are not synced between devices or accounts yet.

Do not invent prices, discounts, stock, ratings, review counts, seller reputation, delivery dates, warranty, return periods or price history. Show missing or unverified details as such. Preserve source and timestamp context for each imported offer. The Shopping Risk Report is a decision aid, not a guarantee of product safety or seller conduct.

## Roadmap

1. Validate official/authorised product-data access and partner terms for each retailer.
2. Build a normalised product/variant/offer data model with source identifiers and timestamps.
3. Expand category-specific intelligence beyond the current phone/laptop starter catalogue.
4. Add secure account-backed storage and user privacy controls.
5. Add Shopping Risk Reports with review-source context, missing-data warnings and seller/policy information where permitted.
6. Add operational monitoring for data freshness, provider usage, errors and costs.
7. Pilot real shopping sessions and measure costs before introducing any paid plan or research quota.

Premium price and session quotas remain proposals until measured usage and operating costs validate them.