import test from "node:test";
import assert from "node:assert/strict";
import { getMarketSummary, getObservedPricePosition } from "../src/lib/products/analytics.js";
import { sortOffers } from "../src/lib/products/sort.js";
import { validateProductQuery } from "../src/lib/search/query.js";
import { readWatchlist, writeWatchlist } from "../src/lib/products/storage.js";
import { toSafeHttpUrl } from "../src/lib/security/safe-url.js";

test("market summary uses only valid positive numeric prices", () => {
  const summary = getMarketSummary([{ priceValue: 100 }, { priceValue: 300 }, { priceValue: 200 }, { priceValue: -5 }, { priceValue: null }]);
  assert.equal(summary.sampleSize, 3);
  assert.equal(summary.lowest, 100);
  assert.equal(summary.median, 200);
  assert.equal(summary.highest, 300);
  assert.equal(summary.average, 200);
});

test("market summary handles empty and even-sized samples", () => {
  assert.equal(getMarketSummary([]).median, null);
  assert.equal(getMarketSummary([{ priceValue: 100 }, { priceValue: 300 }]).median, 200);
});

test("observed price position is transparent and handles unknown values", () => {
  const market = getMarketSummary([{ priceValue: 100 }, { priceValue: 200 }, { priceValue: 300 }]);
  assert.equal(getObservedPricePosition(170, market), "below-observed-median");
  assert.equal(getObservedPricePosition(200, market), "near-observed-median");
  assert.equal(getObservedPricePosition(240, market), "above-observed-median");
  assert.equal(getObservedPricePosition(null, market), "unknown");
});

test("sorting returns a copy and handles missing prices", () => {
  const offers = [{ priceValue: 200 }, { priceValue: null }, { priceValue: 100 }];
  const sorted = sortOffers(offers, "price-low");
  assert.deepEqual(sorted.map((item) => item.priceValue), [100, 200, null]);
  assert.equal(offers[0].priceValue, 200);
});

test("search query validation trims and bounds input", () => {
  assert.deepEqual(validateProductQuery("  wireless   headphones "), { valid: true, query: "wireless headphones" });
  assert.equal(validateProductQuery("x").valid, false);
  assert.equal(validateProductQuery("a".repeat(121)).valid, false);
});

test("watchlist storage filters malformed values and tolerates failures", () => {
  const values = new Map([["buywise-watchlist", JSON.stringify(["one", 4, "one", "two"])]]);
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  assert.deepEqual(readWatchlist(storage), ["one", "two"]);
  assert.equal(writeWatchlist(["one", "", "two", "one"], storage), true);
  assert.deepEqual(JSON.parse(values.get("buywise-watchlist")), ["one", "two"]);
  assert.deepEqual(readWatchlist({ getItem: () => { throw new Error("blocked"); } }), []);
});

test("external URL helper rejects unsafe protocols", () => {
  assert.equal(toSafeHttpUrl("https://example.com/item"), "https://example.com/item");
  assert.equal(toSafeHttpUrl("javascript:alert(1)"), null);
  assert.equal(toSafeHttpUrl("not a URL"), null);
});
