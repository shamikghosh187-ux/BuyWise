"use client";

import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  description: string;
  price: number;
  oldPrice: number;
  rating: string;
  tag: string;
  emoji: string;
  tone: string;
  saving: string;
};

const products: Product[] = [
  { id: 1, name: "Everyday ANC Headphones", category: "Audio", description: "Comfort-first wireless audio with active noise cancellation.", price: 4999, oldPrice: 6999, rating: "4.6", tag: "BEST VALUE", emoji: "🎧", tone: "#e8e7df", saving: "29% less" },
  { id: 2, name: "Creator Wireless Mouse", category: "Accessories", description: "Precise tracking, quiet clicks and a clean ergonomic shape.", price: 1899, oldPrice: 2499, rating: "4.5", tag: "POPULAR PICK", emoji: "🖱️", tone: "#e7e9e6", saving: "24% less" },
  { id: 3, name: "Everyday Smartwatch", category: "Wearables", description: "A bright display with useful health and activity features.", price: 3299, oldPrice: 4499, rating: "4.3", tag: "PRICE DROP", emoji: "⌚", tone: "#e9e5df", saving: "27% less" },
  { id: 4, name: "Portable Bluetooth Speaker", category: "Audio", description: "Compact sound for desks, travel and everyday listening.", price: 2499, oldPrice: 2999, rating: "4.4", tag: "GOOD CHOICE", emoji: "🔊", tone: "#e5e9e8", saving: "17% less" },
  { id: 5, name: "Mechanical Keyboard", category: "Accessories", description: "Tactile typing feel in a compact, desk-friendly layout.", price: 3799, oldPrice: 4999, rating: "4.7", tag: "TOP RATED", emoji: "⌨️", tone: "#ebe6e1", saving: "24% less" },
  { id: 6, name: "Compact 4K Monitor", category: "Computing", description: "Sharp detail and versatile connectivity for focused work.", price: 18999, oldPrice: 22999, rating: "4.5", tag: "WORTH A LOOK", emoji: "🖥️", tone: "#e6e8e4", saving: "17% less" }
];

const categories = ["All products", "Audio", "Accessories", "Wearables", "Computing"];

const money = (value: number) => "₹" + value.toLocaleString("en-IN");

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All products");
  const [saved, setSaved] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);
  const [sort, setSort] = useState("featured");
  const [showSaved, setShowSaved] = useState(false);

  const visibleProducts = useMemo(() => {
    let list = products.filter((product) => {
      const matchesCategory = activeCategory === "All products" || product.category === activeCategory;
      const matchesQuery = (product.name + " " + product.category + " " + product.description).toLowerCase().includes(query.toLowerCase());
      const matchesSaved = !showSaved || saved.includes(product.id);
      return matchesCategory && matchesQuery && matchesSaved;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => Number(b.rating) - Number(a.rating));
    return list;
  }, [activeCategory, query, saved, showSaved, sort]);

  const toggleSaved = (id: number) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleCompare = (id: number) => setCompare((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current);

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand"><span className="brand-mark">b</span><span>buy<span>wise</span></span></div>
        <nav className="top-actions">
          <button className="top-link" onClick={() => { setShowSaved(false); document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" }); }}>Discover</button>
          <button className="top-link" onClick={() => { setShowSaved(true); document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" }); }}>Watchlist ({saved.length})</button>
          <button className="top-link" onClick={() => document.getElementById("intelligence")?.scrollIntoView({ behavior: "smooth" })}>How it works</button>
          <div className="avatar">BW</div>
        </nav>
      </header>

      <div className="page">
        <section className="hero">
          <div>
            <div className="eyebrow">Shopping intelligence, made simple</div>
            <h1>Buy better.<br /><em>Know why.</em></h1>
            <p className="hero-copy">A clearer way to shop. Explore products, compare what matters and understand the value behind every choice — all in one place.</p>
            <form className="search-wrap" onSubmit={(event) => { event.preventDefault(); document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" }); }}>
              <span className="search-icon">⌕</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, categories or features..." aria-label="Search products" />
              <button type="submit">Explore products</button>
            </form>
          </div>
          <div className="hero-art">
            <div className="art-top"><span className="art-label">The smarter side of shopping</span><span>✳</span></div>
            <div className="art-title">Less guessing.<br />More knowing.</div>
            <div className="art-bottom"><span>Discover · Compare · Decide</span><span className="art-chip">Your buying companion ↗</span></div>
          </div>
        </section>

        <section className="stats" aria-label="Platform highlights">
          <div className="stat"><strong>01 / Discover</strong><span>Explore products by what matters to you</span></div>
          <div className="stat"><strong>02 / Compare</strong><span>Put your shortlist side by side</span></div>
          <div className="stat"><strong>03 / Decide</strong><span>Make choices with more context</span></div>
        </section>

        <section id="discover">
          <div className="section-head">
            <div><h2>{showSaved ? "Your watchlist" : "Explore products"}</h2><p>{showSaved ? "Your saved shortlist, all in one place." : "A starting point for more informed decisions."}</p></div>
            {showSaved && <button className="text-btn" onClick={() => setShowSaved(false)}>Back to discovery ↗</button>}
          </div>
          <div className="category-row">
            {categories.map((category) => <button key={category} className={`category ${activeCategory === category ? "active" : ""}`} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>
          <div className="toolbar">
            <span className="result-count">{visibleProducts.length} products to explore</span>
            <select className="sort-select" value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort products">
              <option value="featured">Sort: Featured</option>
              <option value="low">Price: Low to high</option>
              <option value="high">Price: High to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
          <div className="product-grid">
            {visibleProducts.length ? visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-visual" style={{ background: product.tone }}>
                  <span className="product-tag">{product.tag}</span>
                  <button className="save-btn" onClick={() => toggleSaved(product.id)} aria-label={saved.includes(product.id) ? "Remove from watchlist" : "Save to watchlist"}>{saved.includes(product.id) ? "♥" : "♡"}</button>
                  <span className="product-emoji">{product.emoji}</span>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-desc">{product.description}</div>
                  <div className="price-line"><span className="price">{money(product.price)}</span><span className="old-price">{money(product.oldPrice)}</span><span className="deal">{product.saving}</span></div>
                  <div className="card-foot">
                    <span className="rating"><b>★</b> {product.rating} <span style={{ color: "#999" }}>· sample rating</span></span>
                    <label className="compare-check"><input type="checkbox" checked={compare.includes(product.id)} onChange={() => toggleCompare(product.id)} /> Compare</label>
                  </div>
                </div>
              </article>
            )) : <div className="empty-state">{showSaved ? "Your watchlist is empty. Save a product with the heart icon to keep it here." : "No products match that search. Try another keyword or category."}</div>}
          </div>
          <p className="notice">Preview catalogue: product names, prices, ratings and offers are illustrative sample data, not live retailer listings.</p>
        </section>

        <section className="insight-panel" id="intelligence">
          <div>
            <div className="eyebrow" style={{ color: "#ff9a6d" }}>A more thoughtful way to buy</div>
            <h3>Don't just find a product. Understand the choice.</h3>
            <p>BuyWise is being built around the questions that matter before checkout: Is it good value? What are the trade-offs? Are there better alternatives? The next stage is connecting reliable product and pricing sources to power those answers.</p>
          </div>
          <div className="insight-icon">✳</div>
        </section>

        <footer className="footer"><span>© 2026 BuyWise · Shopping intelligence</span><span>Built to help you choose with confidence.</span></footer>
      </div>

      {compare.length > 0 && <div className="compare-bar"><span>{compare.length} of 3 selected for comparison</span><button onClick={() => { const names = products.filter((product) => compare.includes(product.id)).map((product) => product.name); window.alert("Comparison shortlist:\n" + names.join("\n") + "\n\nDetailed live comparisons are coming next."); }}>Review comparison ↗</button><button style={{ background: "transparent", padding: "8px 2px" }} onClick={() => setCompare([])}>Clear</button></div>}
    </main>
  );
}