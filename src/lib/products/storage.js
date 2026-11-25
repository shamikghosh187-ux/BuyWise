const STORAGE_KEY = "buywise-watchlist";

/** Read saved IDs safely; storage may be unavailable or contain old data. */
export function readWatchlist(storage) {
  try {
    const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null);
    if (!target) return [];
    const parsed = JSON.parse(target.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed)
      ? [...new Set(parsed.filter((value) => typeof value === "string" && value.length > 0))]
      : [];
  } catch {
    return [];
  }
}

/** Persist only string IDs. Returns false when browser storage is unavailable. */
export function writeWatchlist(ids, storage) {
  try {
    const target = storage ?? (typeof window !== "undefined" ? window.localStorage : null);
    if (!target) return false;
    const safeIds = [...new Set((Array.isArray(ids) ? ids : []).filter(
      (value) => typeof value === "string" && value.length > 0
    ))];
    target.setItem(STORAGE_KEY, JSON.stringify(safeIds));
    return true;
  } catch {
    return false;
  }
}
