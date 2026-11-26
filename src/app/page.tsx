"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownUp, ArrowRight, Bell, Bookmark, Check, ChevronDown, CircleHelp,
  Command, Compass, Filter, Heart, Laptop, LayoutDashboard, Menu, Search,
  Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Smartphone, Star,
  TrendingDown, X, Zap
} from "lucide-react";

type Category = "All" | "Phones" | "Laptops";
type Product = {
  id: number; name: string; maker: string; category: "Phones" | "Laptops";
  price: number; oldPrice: number; rating: string; reviews: string; tag: string;
  accent: string; kind: "phone" | "laptop"; specs: string[];
};

const products: Product[] = [
  { id: 1, name: "Astra One Pro", maker: "Astra", category: "Phones", price: 54999, oldPrice: 62999, rating: "4.8", reviews: "2.4k", tag: "Best all-rounder", accent: "mint", kind: "phone", specs: ["256 GB storage", "50 MP camera", "120 Hz display"] },
  { id: 2, name: "Pixel Nova 9", maker: "Nova", category: "Phones", price: 42999, oldPrice: 47999, rating: "4.6", reviews: "1.8k", tag: "Camera pick", accent: "sand", kind: "phone", specs: ["128 GB storage", "AI camera", "All-day battery"] },
  { id: 3, name: "Orbit Edge", maker: "Orbit", category: "Phones", price: 32999, oldPrice: 36999, rating: "4.5", reviews: "980", tag: "Value pick", accent: "lavender", kind: "phone", specs: ["256 GB storage", "AMOLED display", "Fast charging"] },
  { id: 4, name: "AeroBook 14", maker: "Aero", category: "Laptops", price: 74990, oldPrice: 82990, rating: "4.7", reviews: "1.2k", tag: "Work & study", accent: "blue", kind: "laptop", specs: ["16 GB RAM", "512 GB SSD", "14-inch display"] },
  { id: 5, name: "Studio Air 15", maker: "Studio", category: "Laptops", price: 89990, oldPrice: 99990, rating: "4.8", reviews: "760", tag: "Creator pick", accent: "peach", kind: "laptop", specs: ["16 GB RAM", "1 TB SSD", "High-res display"] },
  { id: 6, name: "CoreBook Go", maker: "Core", category: "Laptops", price: 52990, oldPrice: 58990, rating: "4.4", reviews: "640", tag: "Everyday value", accent: "slate", kind: "laptop", specs: ["8 GB RAM", "512 GB SSD", "Lightweight build"] }
];

const money = (n: number) => "₹" + n.toLocaleString("en-IN");

function ProductVisual({ product }: { product: Product }) {
  return <div className={"product-visual " + product.accent}>
    {product.kind === "phone"
      ? <div className="phone-render"><div className="phone-camera"><i /><i /><i /></div><div className="phone-glow" /></div>
      : <div className="laptop-render"><div className="laptop-screen"><div className="screen-glow" /></div><div className="laptop-base" /></div>}
    <span className="visual-caption">{product.category === "Phones" ? "SMARTPHONE" : "NOTEBOOK"}</span>
  </div>;
}

export default function Home() {
  const [category, setCategory] = useState<Category>("All");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<number[]>([]);
  const [compare, setCompare] = useState<number[]>([]);
  const [activeNav, setActiveNav] = useState("Discover");
  const [showCompare, setShowCompare] = useState(false);
  const [sort, setSort] = useState("Recommended");
  const [mobileMenu, setMobileMenu] = useState(false);

  const visible = useMemo(() => products
    .filter(p => category === "All" || p.category === category)
    .filter(p => (p.name + " " + p.maker + " " + p.category + " " + p.specs.join(" ")).toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => sort === "Price: low to high" ? a.price - b.price : sort === "Price: high to low" ? b.price - a.price : a.id - b.id), [category, query, sort]);
  const toggleSaved = (id: number) => setSaved(current => current.includes(id) ? current.filter(x => x !== id) : [...current, id]);
  const toggleCompare = (id: number) => setCompare(current => current.includes(id) ? current.filter(x => x !== id) : current.length < 3 ? [...current, id] : current);

  return <main className="app-shell">
    <aside className={"sidebar " + (mobileMenu ? "sidebar-open" : "")}>
      <a className="brand" href="#"><span className="brand-mark"><Command size={19} strokeWidth={2.6} /></span><span>buywise<span className="brand-dot">.</span><small>SHOPPING INTELLIGENCE</small></span></a>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">
        {[{name:"Discover",icon:Compass},{name:"Compare",icon:ArrowDownUp},{name:"Watchlist",icon:Bookmark}].map(item => {
          const Icon = item.icon;
          return <button key={item.name} className={"nav-item " + (activeNav === item.name ? "active" : "")} onClick={() => { setActiveNav(item.name); setMobileMenu(false); if(item.name === "Compare") setShowCompare(true); }}>
            <Icon size={17}/><span>{item.name}</span>{item.name === "Watchlist" && saved.length > 0 && <em>{saved.length}</em>}
          </button>;
        })}
      </nav>
      <div className="workspace-label tools-label">YOUR TOOLS</div>
      <button className="nav-item" onClick={() => { setCategory("Phones"); setActiveNav("Discover"); }}><Smartphone size={17}/><span>Phones</span></button>
      <button className="nav-item" onClick={() => { setCategory("Laptops"); setActiveNav("Discover"); }}><Laptop size={17}/><span>Laptops</span></button>
      <div className="sidebar-bottom">
        <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Learn how BuyWise helps you choose with confidence.</p><button onClick={() => alert("BuyWise brings product research, comparisons and retailer information into one clear workspace.")}>Explore guide <ArrowRight size={13}/></button></div>
        <button className="profile-row"><div className="avatar">B</div><span><strong>BuyWise workspace</strong><small>Personal space</small></span><Settings2 size={16}/></button>
      </div>
    </aside>

    <section className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu"><Menu size={20}/></button>
        <div className="breadcrumbs">Workspace <span>/</span> <strong>{activeNav}</strong></div>
        <div className="top-actions"><span className="status-pill"><i/> Intelligence workspace</span><button className="icon-button" aria-label="Notifications"><Bell size={18}/><b/></button><div className="top-avatar">B</div></div>
      </header>

      <div className="content-wrap">
        <section className="welcome-row">
          <div><div className="eyebrow"><Sparkles size={13}/> A BETTER WAY TO DECIDE</div><h1>Good choices start<br/><span>with clarity.</span></h1><p className="welcome-copy">Research less. Understand more. Find the right phone or laptop for what matters to you.</p></div>
          <div className="welcome-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-center"><Command size={34}/></div><span className="art-spark spark-a">✳</span><span className="art-spark spark-b">✦</span><span className="art-label">BUY SMARTER</span></div>
        </section>

        <section className="search-panel">
          <div className="search-heading"><div><span className="section-kicker">START YOUR RESEARCH</span><h2>What are you looking for?</h2></div><span className="search-shortcut"><Command size={12}/> Search</span></div>
          <div className="search-box"><Search size={19}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Try “best laptop for college” or “camera phone under ₹50,000”"/><button onClick={() => setQuery("")} className="clear-search" aria-label="Clear search">{query && <X size={16}/>}</button><button className="search-submit" onClick={() => setActiveNav("Discover")}>Explore <ArrowRight size={16}/></button></div>
          <div className="quick-searches"><span>POPULAR:</span>{["Student laptops","Camera phones","Under ₹40,000"].map(t=><button key={t} onClick={()=>setQuery(t === "Student laptops" ? "laptop" : t === "Camera phones" ? "camera" : "")}>{t}</button>)}</div>
        </section>

        <section className="insight-strip">
          <div className="insight-icon"><ShieldCheck size={20}/></div><div><strong>Clarity over clutter.</strong><span>Compare the details that matter—not just the price tag.</span></div><div className="insight-right"><span>BUILT FOR BETTER DECISIONS</span><ArrowRight size={16}/></div>
        </section>

        <section className="products-section">
          <div className="section-top"><div><span className="section-kicker">THE DISCOVERY SPACE</span><h2>Explore products <span className="count">{visible.length.toString().padStart(2,"0")}</span></h2><p>Thoughtful picks to help you get started.</p></div><div className="sort-wrap"><SlidersHorizontal size={16}/><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort products"><option>Recommended</option><option>Price: low to high</option><option>Price: high to low</option></select><ChevronDown size={14}/></div></div>
          <div className="filter-row"><div className="category-tabs">{(["All","Phones","Laptops"] as Category[]).map(c=><button key={c} className={category===c?"selected":""} onClick={()=>setCategory(c)}>{c==="Phones"?<Smartphone size={15}/>:c==="Laptops"?<Laptop size={15}/>:<Compass size={15}/>}{c}</button>)}</div><button className="filter-button" onClick={()=>setSort(sort==="Recommended"?"Price: low to high":"Recommended")}><Filter size={15}/> Quick sort</button></div>
          <div className="product-grid">{visible.map(p=><article className="product-card" key={p.id}>
            <div className="card-visual-wrap"><ProductVisual product={p}/><span className="product-tag"><Sparkles size={11}/>{p.tag}</span><button className={"save-button "+(saved.includes(p.id)?"saved":"")} onClick={()=>toggleSaved(p.id)} aria-label="Save product"><Heart size={17} fill={saved.includes(p.id)?"currentColor":"none"}/></button></div>
            <div className="product-info"><div className="product-maker">{p.maker.toUpperCase()} <span>·</span> {p.category.toUpperCase()}</div><h3>{p.name}</h3><div className="rating-row"><Star size={13} fill="currentColor"/><strong>{p.rating}</strong><span>({p.reviews} reviews · sample)</span></div><div className="price-row"><strong>{money(p.price)}</strong><del>{money(p.oldPrice)}</del><span className="demo-discount">DEMO</span></div><div className="spec-row">{p.specs.map(s=><span key={s}>{s}</span>)}</div><div className="card-actions"><button className={"compare-button "+(compare.includes(p.id)?"is-added":"")} onClick={()=>toggleCompare(p.id)}>{compare.includes(p.id)?<Check size={14}/>:<ArrowDownUp size={14}/>}{compare.includes(p.id)?"Added":"Compare"}</button><button className="details-button" onClick={()=>toggleSaved(p.id)}>Save for later <ArrowRight size={14}/></button></div></div>
          </article>)}</div>
          {visible.length===0 && <div className="empty-state"><Search size={25}/><strong>No matching products yet</strong><span>Try another search or switch categories.</span><button onClick={()=>{setQuery("");setCategory("All");}}>Clear filters</button></div>}
          <p className="demo-note"><CircleHelp size={13}/> Preview catalogue only. Product names, prices and ratings are illustrative demo data—not live retailer offers.</p>
        </section>

        <section className="bottom-feature"><div className="feature-symbol"><TrendingDown size={22}/></div><div><span className="section-kicker">COMING INTO FOCUS</span><h3>Know when a deal is actually a good deal.</h3><p>Price history, seller context and product comparisons will come together in one decision view.</p></div><span className="coming-soon">IN DEVELOPMENT</span></section>
        <footer><span>© 2026 BuyWise</span><span>Make the smarter buy. <span className="footer-heart">♥</span></span><span>Independent shopping intelligence</span></footer>
      </div>
    </section>

    {compare.length>0 && <div className="compare-bar"><div><span className="compare-count">{compare.length}</span><strong>{compare.length} of 3 products selected</strong><span className="compare-hint">Choose up to three to compare</span></div><div className="compare-bar-actions"><button className="text-button" onClick={()=>setCompare([])}>Clear</button><button className="compare-open" onClick={()=>setShowCompare(true)}>Compare now <ArrowRight size={15}/></button></div></div>}
    {showCompare && <div className="modal-backdrop" onClick={()=>setShowCompare(false)}><section className="compare-modal" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="section-kicker">SIDE BY SIDE</span><h2>Your comparison</h2></div><button className="icon-button" onClick={()=>setShowCompare(false)} aria-label="Close"><X size={19}/></button></div>{compare.length===0?<div className="empty-state"><ArrowDownUp size={25}/><strong>No products selected</strong><span>Add products using the Compare button on a card.</span></div>:<div className="comparison-list">{compare.map(id=>{const p=products.find(x=>x.id===id)!;return <div className="comparison-item" key={id}><ProductVisual product={p}/><div><strong>{p.name}</strong><span>{p.category} · {p.specs.join(" · ")}</span><b>{money(p.price)} <small>illustrative</small></b></div><button onClick={()=>toggleCompare(id)} aria-label="Remove"><X size={16}/></button></div>;})}</div>}<p className="demo-note"><CircleHelp size={13}/> This preview uses illustrative product data. Live retailer comparisons are not connected yet.</p><button className="modal-done" onClick={()=>setShowCompare(false)}>Done</button></section></div>}
  </main>;
}
