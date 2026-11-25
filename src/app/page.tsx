"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { getMarketSummary, getObservedPricePosition } from "@/lib/products/analytics.js";
import { sortOffers } from "@/lib/products/sort.js";
import { readWatchlist, writeWatchlist } from "@/lib/products/storage.js";
import { validateProductQuery } from "@/lib/search/query.js";

type Product = {
  id: string; title: string; seller: string; price: string; priceValue: number | null;
  oldPrice: string | null; rating: number | null; reviews: number | null;
  image: string | null; url: string | null; delivery: string | null; condition: string | null;
};
type SearchResponse = { products: Product[]; resultCount: number; updatedAt: string; source: string; error?: string; code?: string };

const categories = ["Phones", "Laptops", "Headphones", "Watches", "Cameras", "Home appliances"];
const money = (value: number) => "₹" + value.toLocaleString("en-IN");

export default function Home() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [saved, setSaved] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [view, setView] = useState<"discover" | "watchlist" | "compare">("discover");
  const [sort, setSort] = useState("relevance");
  const [detail, setDetail] = useState<Product | null>(null);
  const [ready, setReady] = useState(false);
  const [updatedAt, setUpdatedAt] = useState("");

  useEffect(() => {
    setSaved(readWatchlist());
    setReady(true);
  }, []);
  useEffect(() => { if (ready) writeWatchlist(saved); }, [saved, ready]);

  async function searchProducts(searchTerm = query) {
    const validation = validateProductQuery(searchTerm);
    if (!validation.valid) { setError(validation.message || "Check your search and try again."); return; }
    const term = validation.query;
    setQuery(term); setView("discover"); setLoading(true); setError(""); setSearched(true);
    try {
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(term)}`);
      const data = await response.json() as SearchResponse;
      if (!response.ok) throw new Error(data.error || "Search failed.");
      setProducts(data.products || []);
      setUpdatedAt(data.updatedAt || "");
      setSort("relevance");
    } catch (err) {
      setProducts([]);
      setError(err instanceof Error ? err.message : "Couldn't load shopping results.");
    } finally { setLoading(false); }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void searchProducts();
  }

  const visible = useMemo(() => {
    const list = view === "watchlist" ? products.filter(p => saved.includes(p.id)) : products;
    return sortOffers(list, sort);
  }, [products, saved, sort, view]);
  const marketSummary = useMemo(() => getMarketSummary(products), [products]);

  const toggleSaved = (id: string) => setSaved(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const toggleCompare = (id: string) => setCompare(current => current.includes(id) ? current.filter(x => x !== id) : current.length < 3 ? [...current, id] : current);
  const selected = products.filter(p => compare.includes(p.id));

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark">b</span><span>buy<span>wise</span></span></a>
      <nav className="top-actions">
        <button className={`top-link ${view === "discover" ? "selected-link" : ""}`} onClick={() => setView("discover")}>Discover</button>
        <button className={`top-link ${view === "compare" ? "selected-link" : ""}`} onClick={() => setView("compare")}>Compare ({compare.length})</button>
        <button className={`top-link ${view === "watchlist" ? "selected-link" : ""}`} onClick={() => setView("watchlist")}>Watchlist ({saved.length})</button>
        <span className="avatar">BW</span>
      </nav>
    </header>
    <div className="page">
      <section className="hero">
        <div>
          <div className="eyebrow">REAL SHOPPING SEARCH · INDIA</div>
          <h1>Find the right buy.<br/><em>At the right price.</em></h1>
          <p className="hero-copy">Search products across shopping listings, compare seller offers, and open the retailer's page when you're ready to learn more.</p>
          <form className="search-wrap" onSubmit={submitSearch}>
            <span className="search-icon">⌕</span>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="What are you looking for?" aria-label="Search products"/>
            <button type="submit" disabled={loading}>{loading ? "Searching…" : "Search ↗"}</button>
          </form>
          <div className="search-hint">Try a product name or choose a category below.</div>
        </div>
        <div className="hero-art"><div className="art-top"><span className="art-label">BuyWise shopping intelligence</span><span>✳</span></div><div className="art-title">Real listings.<br/>Clearer choices.</div><div className="art-bottom"><span>Discover · Compare · Decide</span><span className="art-chip">India catalogue</span></div></div>
      </section>

      <section className="stats">
        <div className="stat"><strong>Live search</strong><span>Listings from a connected shopping data source</span></div>
        <div className="stat"><strong>Seller offers</strong><span>See the store and its listed price</span></div>
        <div className="stat"><strong>Your shortlist</strong><span>Save and compare up to three results</span></div>
      </section>

      <section>
        <div className="section-head"><div><h2>{view === "watchlist" ? "Your watchlist" : view === "compare" ? "Compare offers" : "Search products"}</h2><p>{view === "watchlist" ? "Saved products from your searches." : view === "compare" ? "Review your selected results side by side." : "Choose a category or search for a specific product."}</p></div>
          {view !== "discover" && <button className="text-btn" onClick={() => setView("discover")}>← Back to results</button>}
        </div>
        {view === "discover" && <div className="category-row">{categories.map(c => <button key={c} className="category" onClick={() => void searchProducts(c)}>{c}</button>)}</div>}
        {view !== "compare" && <>
          <div className="toolbar"><span className="result-count">{loading ? "Searching shopping listings…" : view === "watchlist" ? `${visible.length} saved products` : searched ? `${visible.length} listings found` : "Live shopping results will appear here"}</span>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort products"><option value="relevance">Relevance</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select>
          </div>
          {view === "discover" && marketSummary.sampleSize > 0 && <div className="market-summary">
            <div><span>LOWEST OBSERVED</span><strong>{money(marketSummary.lowest)}</strong></div>
            <div><span>SEARCH MEDIAN</span><strong>{money(marketSummary.median)}</strong></div>
            <div><span>HIGHEST OBSERVED</span><strong>{money(marketSummary.highest)}</strong></div>
            <p>Snapshot from {marketSummary.sampleSize} listings with numeric prices in this search. Not historical price data.</p>
          </div>}

          {error && <div className="error-panel"><strong>Shopping search isn't ready</strong><p>{error}</p>{error.includes("SERPAPI_KEY") && <span>Add the key in Vercel → Project → Settings → Environment Variables, then redeploy.</span>}</div>}
          {loading && <div className="loading-panel"><span className="loader"/>Fetching current shopping listings…</div>}
          {!loading && !error && <div className="product-grid">
            {visible.map(p => <article className="product-card" key={p.id}>
              <div className="product-visual">
                {p.image ? <img src={p.image} alt={p.title} className="product-image"/> : <span className="no-image">Product image unavailable</span>}
                <button className={`save-btn ${saved.includes(p.id) ? "saved" : ""}`} onClick={() => toggleSaved(p.id)} aria-label="Toggle watchlist">{saved.includes(p.id) ? "♥" : "♡"}</button>
              </div>
              <div className="product-info">
                <div className="product-category">{p.seller}</div><h3 className="product-name">{p.title}</h3>
                <div className="live-price">{p.price}</div>
                {p.priceValue !== null && <div className={`market-position ${getObservedPricePosition(p.priceValue, marketSummary)}`}>{getObservedPricePosition(p.priceValue, marketSummary).replaceAll("-", " ")}</div>}
                {p.oldPrice && <div className="old-price-line">Previously listed: {p.oldPrice}</div>}
                <div className="live-meta">{p.rating !== null ? <span>★ {p.rating}{p.reviews !== null ? ` · ${p.reviews.toLocaleString("en-IN")} reviews` : ""}</span> : <span>Rating not supplied</span>}{p.condition && <span>{p.condition}</span>}</div>
                {p.delivery && <p className="delivery-copy">{p.delivery}</p>}
                <div className="live-card-actions"><button className={`compare-full ${compare.includes(p.id) ? "chosen" : ""}`} onClick={() => toggleCompare(p.id)}>{compare.includes(p.id) ? "✓ Added to compare" : "⇄ Compare"}</button>{p.url ? <a className="retailer-link" href={p.url} target="_blank" rel="noopener noreferrer">View retailer ↗</a> : <span className="no-link">Retailer link unavailable</span>}</div>
              </div>
            </article>)}
            {visible.length === 0 && <div className="empty-state">{view === "watchlist" ? "Your watchlist is empty. Save products from a search." : searched ? "No listings came back for this search. Try another product name." : "Search for a product to see real shopping listings here."}</div>}
          </div>}
          {updatedAt && <p className="source-note">Results retrieved {new Date(updatedAt).toLocaleString("en-IN")} · Source: Google Shopping via SerpApi. Prices and availability can change; confirm on the retailer's page.</p>}
        </>}
        {view === "compare" && (selected.length === 0 ? <div className="empty-state">Your comparison is empty. Search for a product and add up to three offers.</div> :
          <div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>Offer detail</th>{selected.map(p => <th key={p.id}>{p.title}</th>)}</tr></thead><tbody>
            {([["Seller", (p:Product)=>p.seller],["Listed price",(p:Product)=>p.price],["Rating",(p:Product)=>p.rating === null ? "Not supplied" : `★ ${p.rating}`],["Reviews",(p:Product)=>p.reviews === null ? "Not supplied" : p.reviews.toLocaleString("en-IN")],["Delivery",(p:Product)=>p.delivery || "Not supplied"],["Condition",(p:Product)=>p.condition || "Not supplied"]] as [string,(p:Product)=>string][]).map(([label,fn])=><tr key={label}><td>{label}</td>{selected.map(p=><td key={p.id}>{fn(p)}</td>)}</tr>)}
            <tr><td>Retailer</td>{selected.map(p=><td key={p.id}>{p.url ? <a href={p.url} target="_blank" rel="noopener noreferrer">Open offer ↗</a> : "Link unavailable"}</td>)}</tr>
          </tbody></table><button className="text-btn" onClick={() => setCompare([])}>Clear comparison ×</button></div>)}
        <p className="notice">BuyWise displays third-party shopping listings. Seller, price, stock, delivery and ratings are supplied by the source and may change. Always verify the final details on the retailer's website.</p>
      </section>

      <section className="insight-panel"><div><div className="eyebrow" style={{color:"#ffad79"}}>BUYWISE PRINCIPLE</div><h3>Don't just find a product. Understand the offer.</h3><p>We're building toward clearer seller comparisons, transparent price history and explainable buying recommendations. The current live search is the first data-connected step.</p></div><div className="insight-icon">✳</div></section>
      <footer className="footer"><span>© 2026 BuyWise · Shopping intelligence</span><span>Choose with confidence.</span></footer>
    </div>
    {compare.length > 0 && <div className="compare-bar"><span>{compare.length} of 3 selected</span><button onClick={() => setView("compare")}>Review comparison ↗</button><button className="clear-compare" onClick={() => setCompare([])}>Clear</button></div>}
    {detail && <div className="modal-backdrop" onClick={() => setDetail(null)}><section className="product-modal" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}><button className="modal-close" onClick={() => setDetail(null)} aria-label="Close">×</button><h2>{detail.title}</h2><p>{detail.seller}</p><div className="modal-metrics"><div><small>LISTED PRICE</small><strong>{detail.price}</strong></div><div><small>RATING</small><strong>{detail.rating ?? "—"}</strong></div><div><small>REVIEWS</small><strong>{detail.reviews ?? "—"}</strong></div></div>{detail.delivery && <p>{detail.delivery}</p>}{detail.url && <a className="retailer-link" href={detail.url} target="_blank" rel="noopener noreferrer">Open retailer offer ↗</a>}</section></div>}
  </main>;
}