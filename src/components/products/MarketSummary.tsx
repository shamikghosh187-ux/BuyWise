import { formatInr } from "@/lib/products/format.js";

type Summary = {
  sampleSize: number;
  lowest: number | null;
  median: number | null;
  highest: number | null;
};

export function MarketSummary({ summary }: { summary: Summary }) {
  if (summary.sampleSize < 1) return null;

  return (
    <div className="market-summary" aria-label="Observed prices in this search">
      <div><span>LOWEST OBSERVED</span><strong>{formatInr(summary.lowest ?? NaN)}</strong></div>
      <div><span>SEARCH MEDIAN</span><strong>{formatInr(summary.median ?? NaN)}</strong></div>
      <div><span>HIGHEST OBSERVED</span><strong>{formatInr(summary.highest ?? NaN)}</strong></div>
      <p>Snapshot from {summary.sampleSize} listings with numeric prices in this search. Not historical price data.</p>
    </div>
  );
}
