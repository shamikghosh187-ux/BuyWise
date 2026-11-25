"use client";

import { useEffect, useMemo, useState } from "react";

type Product = {
  id: number; brand: string; name: string; category: string; description: string;
  price: number; rating: number; reviews: number; score: number; tag: string;
  emoji: string; specs: Record<string,string>;
};

const products: Product[] = [
  {id:1,brand:"Sony",name:"WH-1000XM5",category:"Audio",description:"Comfortable wireless headphones with adaptive noise cancellation.",price:24990,rating:4.6,reviews:1940,score:94,tag:"TOP RATED",emoji:"🎧",specs:{"Type":"Over-ear wireless","Battery":"Up to 30 hours","Noise control":"Active noise cancelling","Charging":"USB-C"}},
  {id:2,brand:"Logitech",name:"MX Master 3S",category:"Accessories",description:"An ergonomic productivity mouse with quiet clicks and customisable controls.",price:8995,rating:4.6,reviews:743,score:92,tag:"EDITOR PICK",emoji:"🖱️",specs:{"Type":"Wireless mouse","DPI":"Up to 8,000","Battery":"Up to 70 days","Connectivity":"Bluetooth / USB"}},
  {id:3,brand:"Samsung",name:"Galaxy S24 FE",category:"Phones",description:"A balanced everyday phone with a vivid display and versatile cameras.",price:44999,rating:4.5,reviews:1284,score:91,tag:"SMART PICK",emoji:"📱",specs:{"Display":"6.7-inch AMOLED","Processor":"Exynos 2400e","Camera":"50 MP main","Storage":"128 GB"}},
  {id:4,brand:"Nothing",name:"Ear (a)",category:"Audio",description:"Distinctive wireless earbuds with active noise cancellation and a compact case.",price:7999,rating:4.4,reviews:532,score:90,tag:"WORTH A LOOK",emoji:"🎵",specs:{"Type":"True wireless","Battery":"Up to 42.5 hours","Noise control":"Active noise cancelling","Charging":"USB-C"}},
  {id:5,brand:"Apple",name:"iPhone 15",category:"Phones",description:"A polished phone experience with strong performance and long software support.",price:59900,rating:4.7,reviews:2301,score:89,tag:"POPULAR",emoji:"📱",specs:{"Display":"6.1-inch OLED","Processor":"A16 Bionic","Camera":"48 MP main","Storage":"128 GB"}},
  {id:6,brand:"ASUS",name:"Vivobook 15",category:"Laptops",description:"A practical laptop for study, productivity and everyday multitasking.",price:52990,rating:4.3,reviews:876,score:87,tag:"EVERYDAY VALUE",emoji:"💻",specs:{"Display":"15.6-inch FHD","Processor":"Intel Core i5","Memory":"16 GB RAM","Storage":"512 GB SSD"}}
];
const categories=["All products","Phones","Laptops","Audio","Accessories"];
const money=(n:number)=>"₹"+n.toLocaleString("en-IN");

export default function Home(){
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("All products");
  const [sort,setSort]=useState("recommended");
  const [saved,setSaved]=useState<number[]>([]);
  const [compare,setCompare]=useState<number[]>([]);
  const [view,setView]=useState<"discover"|"watchlist"|"compare">("discover");
  const [detail,setDetail]=useState<Product|null>(null);
  const [ready,setReady]=useState(false);

  useEffect(()=>{try{setSaved(JSON.parse(localStorage.getItem("buywise-watchlist")||"[]"));}catch{setSaved([]);}setReady(true);},[]);
  useEffect(()=>{if(ready)localStorage.setItem("buywise-watchlist",JSON.stringify(saved));},[saved,ready]);

  const visible=useMemo(()=>{
    let list=products.filter(p=>(category==="All products"||p.category===category)&&[p.name,p.brand,p.category,p.description].join(" ").toLowerCase().includes(query.toLowerCase())&&(view!=="watchlist"||saved.includes(p.id)));
    if(sort==="price-low")list=[...list].sort((a,b)=>a.price-b.price);
    if(sort==="price-high")list=[...list].sort((a,b)=>b.price-a.price);
    if(sort==="rating")list=[...list].sort((a,b)=>b.rating-a.rating);
    if(sort==="recommended")list=[...list].sort((a,b)=>b.score-a.score);
    return list;
  },[category,query,sort,view,saved]);

  const toggleSaved=(id:number)=>setSaved(current=>current.includes(id)?current.filter(x=>x!==id):[...current,id]);
  const toggleCompare=(id:number)=>setCompare(current=>current.includes(id)?current.filter(x=>x!==id):current.length<3?[...current,id]:current);
  const selected=products.filter(p=>compare.includes(p.id));
  const comparisonRows: [string,(p:Product)=>string][] = [["Brand",p=>p.brand],["Category",p=>p.category],["Indicative price",p=>money(p.price)],["Sample rating",p=>"★ "+p.rating+"/5"],["Value indicator",p=>p.score+"/100"],...Object.keys(selected[0]?.specs||{}).map(k=>[k,(p:Product)=>p.specs[k]||"—"] as [string,(p:Product)=>string])];

  return <main className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-mark">b</span><span>buy<span>wise</span></span></a>
      <nav className="top-actions">
        <button className="top-link" onClick={()=>setView("discover")}>Discover</button>
        <button className="top-link" onClick={()=>setView("compare")}>Compare ({compare.length})</button>
        <button className="top-link" onClick={()=>setView("watchlist")}>Watchlist ({saved.length})</button>
        <span className="avatar">BW</span>
      </nav>
    </header>
    <div className="page">
      <section className="hero">
        <div>
          <div className="eyebrow">Shopping intelligence, made simple</div>
          <h1>Buy better.<br/><em>Know why.</em></h1>
          <p className="hero-copy">Explore products, compare what matters, and understand the value behind every choice — all in one place.</p>
          <form className="search-wrap" onSubmit={e=>{e.preventDefault();setView("discover");}}>
            <span className="search-icon">⌕</span>
            <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search products, brands or categories..." aria-label="Search products"/>
            <button type="submit">Search ↗</button>
          </form>
        </div>
        <div className="hero-art"><div className="art-top"><span className="art-label">The smarter side of shopping</span><span>✳</span></div><div className="art-title">Less guessing.<br/>More knowing.</div><div className="art-bottom"><span>Discover · Compare · Decide</span><span className="art-chip">Your buying companion ↗</span></div></div>
      </section>

      <section className="stats">
        <div className="stat"><strong>01 / Discover</strong><span>Find products by what matters to you</span></div>
        <div className="stat"><strong>02 / Compare</strong><span>Put your shortlist side by side</span></div>
        <div className="stat"><strong>03 / Decide</strong><span>Choose with more context</span></div>
      </section>

      <section id="discover">
        <div className="section-head"><div><h2>{view==="watchlist"?"Your watchlist":view==="compare"?"Compare products":"Explore products"}</h2><p>{view==="watchlist"?"Products you saved for later.":view==="compare"?"A side-by-side look at your shortlist.":"A considered starting point for your next purchase."}</p></div>
          {view!=="discover"&&<button className="text-btn" onClick={()=>setView("discover")}>← Back to discovery</button>}
        </div>
        {view!=="compare"&&<>
          <div className="category-row">{categories.map(c=><button key={c} className={`category ${category===c?"active":""}`} onClick={()=>setCategory(c)}>{c}</button>)}</div>
          <div className="toolbar"><span className="result-count">{visible.length} products to explore</span><select className="sort-select" value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sort products"><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="rating">Top rated</option></select></div>
          <div className="product-grid">{visible.map(p=><article className="product-card" key={p.id}>
            <div className="product-visual"><span className="product-tag">{p.tag}</span><button className={`save-btn ${saved.includes(p.id)?"saved":""}`} onClick={()=>toggleSaved(p.id)} aria-label="Toggle watchlist">{saved.includes(p.id)?"♥":"♡"}</button><span className="product-emoji">{p.emoji}</span></div>
            <div className="product-info"><div className="product-category">{p.brand} · {p.category}</div><h3 className="product-name">{p.name}</h3><p className="product-desc">{p.description}</p>
              <div className="price-line"><span className="price">{money(p.price)}</span><span className="value-score">✳ {p.score}/100</span></div>
              <div className="card-foot"><span className="rating">★ {p.rating} <small>({p.reviews.toLocaleString("en-IN")} sample ratings)</small></span><button className="details-link" onClick={()=>setDetail(p)}>Details ↗</button></div>
              <button className={`compare-full ${compare.includes(p.id)?"chosen":""}`} onClick={()=>toggleCompare(p.id)}>{compare.includes(p.id)?"✓ Added to compare":"⇄ Add to compare"}</button>
            </div>
          </article>)}</div>
          {visible.length===0&&<div className="empty-state">{view==="watchlist"?"Your watchlist is empty. Save a product using the heart icon.":"No matching products. Try a different search or category."}</div>}
        </>}
        {view==="compare"&&(selected.length===0?<div className="empty-state">Your comparison is empty. Add up to three products from Discover.</div>:<div className="compare-table-wrap"><table className="compare-table"><thead><tr><th>What matters</th>{selected.map(p=><th key={p.id}>{p.emoji} {p.name}</th>)}</tr></thead><tbody>{comparisonRows.map(([label,fn])=><tr key={label}><td>{label}</td>{selected.map(p=><td key={p.id}>{fn(p)}</td>)}</tr>)}</tbody></table><button className="text-btn" onClick={()=>setCompare([])}>Clear comparison ×</button></div>)}
        <p className="notice">MVP preview: product details, prices and ratings shown here are illustrative sample data, not live retailer offers. Verify details with sellers before purchasing.</p>
      </section>

      <section className="insight-panel"><div><div className="eyebrow" style={{color:"#ffad79"}}>A more thoughtful way to buy</div><h3>Don't just find a product. Understand the choice.</h3><p>BuyWise is being built around the questions that matter before checkout: Is it good value? What are the trade-offs? Are there better alternatives? Live retailer sources and verified price history are the next integration stage.</p></div><div className="insight-icon">✳</div></section>
      <footer className="footer"><span>© 2026 BuyWise · Shopping intelligence</span><span>Built to help you choose with confidence.</span></footer>
    </div>
    {compare.length>0&&<div className="compare-bar"><span>{compare.length} of 3 selected</span><button onClick={()=>setView("compare")}>Review comparison ↗</button><button className="clear-compare" onClick={()=>setCompare([])}>Clear</button></div>}
    {detail&&<div className="modal-backdrop" onClick={()=>setDetail(null)}><section className="product-modal" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setDetail(null)} aria-label="Close">×</button><div className="modal-hero">{detail.emoji}</div><div className="product-category">{detail.brand} · {detail.category}</div><h2>{detail.name}</h2><p>{detail.description}</p><div className="modal-metrics"><div><small>INDICATIVE PRICE</small><strong>{money(detail.price)}</strong></div><div><small>SAMPLE RATING</small><strong>★ {detail.rating}</strong></div><div><small>VALUE INDICATOR</small><strong>{detail.score}/100</strong></div></div><h3>Key specifications</h3>{Object.entries(detail.specs).map(([k,v])=><div className="spec-row" key={k}><span>{k}</span><strong>{v}</strong></div>)}<p className="modal-disclaimer">Sample catalogue information only. BuyWise has not verified current retailer pricing, stock or seller details.</p></section></div>}
  </main>;
}