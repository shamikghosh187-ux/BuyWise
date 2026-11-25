/** Pure, explainable analysis based only on the offers in the current search. */

/** @param {Array<{priceValue?: number|null}>} offers */
export function getMarketSummary(offers = []) {
  const prices = offers
    .map((offer) => offer.priceValue)
    .filter((value) => Number.isFinite(value) && value > 0)
    .sort((a, b) => a - b);

  if (prices.length === 0) {
    return { sampleSize: 0, lowest: null, median: null, highest: null, spread: null, average: null };
  }

  const middle = Math.floor(prices.length / 2);
  const lowerMiddle = prices[middle - 1] ?? null;
  const upperMiddle = prices[middle] ?? null;
  const lowest = prices[0] ?? null;
  const highest = prices[prices.length - 1] ?? null;

  // Guard indexed reads explicitly: TypeScript may treat array entries as undefined.
  const median = prices.length % 2
    ? upperMiddle
    : lowerMiddle !== null && upperMiddle !== null
      ? (lowerMiddle + upperMiddle) / 2
      : lowerMiddle ?? upperMiddle;

  return {
    sampleSize: prices.length,
    lowest,
    median,
    highest,
    spread: lowest !== null && highest !== null ? highest - lowest : null,
    average: prices.reduce((sum, value) => sum + value, 0) / prices.length,
  };
}

/**
 * Labels an offer relative to this search's observed median.
 * This is not historical price tracking or proof of a genuine discount.
 */
export function getObservedPricePosition(priceValue, marketSummary) {
  if (!Number.isFinite(priceValue) || priceValue <= 0 || !marketSummary?.median) return "unknown";
  const ratio = priceValue / marketSummary.median;
  if (ratio <= 0.9) return "below-observed-median";
  if (ratio >= 1.1) return "above-observed-median";
  return "near-observed-median";
}
