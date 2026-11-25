/** @typedef {{id: string, priceValue?: number|null, rating?: number|null, reviews?: number|null}} Offer */

/**
 * Sort offers without narrowing away the caller's product fields.
 * @template {Offer} T
 * @param {T[]} offers
 * @param {string} mode
 * @returns {T[]}
 */
export function sortOffers(offers = [], mode = "relevance") {
  const copy = [...offers];
  if (mode === "price-low") {
    return copy.sort((a, b) => (a.priceValue ?? Infinity) - (b.priceValue ?? Infinity));
  }
  if (mode === "price-high") {
    return copy.sort((a, b) => (b.priceValue ?? -Infinity) - (a.priceValue ?? -Infinity));
  }
  if (mode === "rating") {
    return copy.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
  }
  if (mode === "reviews") {
    return copy.sort((a, b) => (b.reviews ?? -1) - (a.reviews ?? -1));
  }
  return copy;
}
