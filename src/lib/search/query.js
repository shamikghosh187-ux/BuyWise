/** Shared input checks for product-search interfaces. */
export function validateProductQuery(value) {
  if (typeof value !== "string") {
    return { valid: false, query: "", message: "Enter a product name to search." };
  }
  const query = value.trim().replace(/\s+/g, " ");
  if (query.length < 2) return { valid: false, query, message: "Type at least two characters to search." };
  if (query.length > 120) return { valid: false, query, message: "Keep your search under 120 characters." };
  return { valid: true, query, message: "" };
}
