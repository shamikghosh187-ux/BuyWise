# API reference

## `GET /api/products/search?q={query}`

Searches the configured shopping-data provider for India-localised product listings.

### Query parameter

- `q` — required string, trimmed and limited to 2–120 characters.

### Success response

Returns a JSON object containing:

- `query` — the submitted search phrase.
- `products` — normalised offer objects.
- `resultCount` — number of returned offers.
- `updatedAt` — ISO timestamp for this response.
- `source` — upstream source label.

Individual offer fields may be absent upstream and are represented as nullable values where appropriate. A missing rating or image is not treated as an error.

### Error responses

- `400` — invalid query or restricted category.
- `502` — upstream provider error.
- `503` — server-side provider key is not configured.
- `504` — upstream request timed out.

The endpoint never returns the provider API key.

## `GET /api/health`

Returns service status, timestamp and a boolean indicating whether the shopping integration is configured. It does not reveal credentials or account details.
