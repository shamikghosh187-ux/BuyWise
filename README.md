# BuyWise

**Find the right buy. At the right price.**

BuyWise is a shopping-intelligence MVP. It searches live Google Shopping listings for India through SerpApi, then lets people save and compare offers before opening the retailer's page.

## Features

- Live product search (India locale)
- Seller/source, listed price, image, rating and delivery details when supplied by the source
- Open the original retailer offer
- Sort results by price or rating
- Compare up to three offers
- Browser-persisted watchlist
- Responsive product discovery interface

## Local setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`
3. Add your SerpApi key to `SERPAPI_KEY`
4. Start the app: `npm run dev`
5. Open http://localhost:3000

The API key must stay on the server. Never add it to client-side code, commit it to Git, or paste it into chat.

## Shopping data provider

BuyWise uses the SerpApi Google Shopping Results API for live search. The server route is `/api/products/search`. It requests India-localised results and returns a normalised subset of listing fields.

Provider documentation: https://serpapi.com/google-shopping-api

The provider requires an API key. Provider plans, quotas and terms can change; check the provider's current account page before relying on it. Do not commit API keys. Add `SERPAPI_KEY` as a server-side environment variable in the deployment platform.

## Data and trust

Listings, prices, ratings, images, seller names and delivery details are supplied by the third-party source. They can be incomplete, delayed or changed by the retailer. BuyWise does not independently verify stock, warranty, seller legitimacy, delivery promises or final checkout price. Always check the retailer page before making a decision.

BuyWise currently redirects shoppers to retailer pages. It does not take payments, place orders, or claim to be the seller.

## Next milestones

1. Add more permitted product feeds and retailer integrations.
2. Persist price observations with timestamps for genuine price-history charts.
3. Add seller, return-policy, warranty and delivery comparison where reliable data exists.
4. Build transparent recommendation scoring that explains each factor.
5. Add accounts and cloud-synced watchlists.

## Stack

- Next.js 15
- React 19
- TypeScript
- SerpApi Google Shopping Results API
