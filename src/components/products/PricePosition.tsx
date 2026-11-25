import { getObservedPricePosition } from "@/lib/products/analytics.js";

type Summary = { median: number | null };

export function PricePosition({ priceValue, marketSummary }: {
  priceValue: number | null;
  marketSummary: Summary;
}) {
  if (priceValue === null) return null;
  const position = getObservedPricePosition(priceValue, marketSummary);
  return <div className={`market-position ${position}`}>{position.replaceAll("-", " ")}</div>;
}
