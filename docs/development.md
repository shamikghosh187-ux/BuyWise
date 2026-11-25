# Development guide

## Requirements

- Node.js 20 or a compatible supported Node.js release.
- npm.
- A server-side `SERPAPI_KEY` for live shopping searches.

## Commands

```bash
npm install
npm run dev
npm run build
npm test
```

The test suite uses Node's built-in test runner and mocked in-memory data. It does not call the shopping provider.

## Environment

Create `.env.local` from `.env.example` and set `SERPAPI_KEY`. Never commit the real file or expose the key through a `NEXT_PUBLIC_` variable.

## Contribution checklist

- Keep product calculations deterministic and explainable.
- Add tests for new pure utility functions.
- Treat missing provider fields as normal; do not assume every listing has a rating, price or image.
- Keep external links restricted to HTTP and HTTPS.
- Update the data-trust documentation when the app starts showing new provider-derived claims.
