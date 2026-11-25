import { NextRequest, NextResponse } from "next/server";
import { toSafeHttpUrl } from "@/lib/security/safe-url.js";

type ShoppingResult = {
  product_id?: string;
  title?: string;
  source?: string;
  price?: string;
  extracted_price?: number;
  old_price?: string;
  extracted_old_price?: number;
  rating?: number;
  reviews?: number;
  thumbnail?: string;
  product_link?: string;
  link?: string;
  delivery?: string;
  second_hand_condition?: string;
};

const blockedTerms = [
  "porn", "pornography", "adult toy", "sex toy", "vibrator",
  "gun", "firearm", "ammunition", "weapon", "taser", "pepper spray",
  "explosive", "bomb", "firework", "knife for self defense",
  "cocaine", "heroin", "methamphetamine", "marijuana", "weed", "thc",
  "vape", "vaping", "cigarette", "tobacco", "alcohol", "liquor",
  "betting", "casino", "gambling", "sportsbook"
];

export async function GET(request: NextRequest) {
  const query = (request.nextUrl.searchParams.get("q") || "").trim();
  if (query.length < 2 || query.length > 120) {
    return NextResponse.json({ error: "Enter a search with 2–120 characters." }, { status: 400 });
  }

  const normalized = query.toLowerCase();
  if (blockedTerms.some((term) => normalized.includes(term))) {
    return NextResponse.json({ error: "This search category isn't available in BuyWise." }, { status: 400 });
  }

  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey) {
    return NextResponse.json({
      error: "Live shopping search is not connected yet. Add SERPAPI_KEY to the project's server environment to enable real product listings.",
      code: "MISSING_PROVIDER_KEY"
    }, { status: 503 });
  }

  const params = new URLSearchParams({
    engine: "google_shopping",
    q: query,
    gl: "in",
    hl: "en",
    google_domain: "google.co.in",
    location: "India",
    safe: "active",
    api_key: apiKey
  });

  try {
    const response = await fetch(`https://serpapi.com/search.json?${params.toString()}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(20000),
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json({ error: "The shopping data provider couldn't complete this search. Please try again shortly." }, { status: 502 });
    }

    const payload = await response.json() as { shopping_results?: ShoppingResult[]; error?: string };
    if (payload.error) {
      return NextResponse.json({ error: "The shopping data provider returned an error. Check the API account and key." }, { status: 502 });
    }

    const products = (payload.shopping_results || []).slice(0, 40).map((item, index) => ({
      id: item.product_id || `${index}-${item.title || "product"}`,
      title: item.title || "Untitled product",
      seller: item.source || "Retailer not listed",
      price: item.price || (typeof item.extracted_price === "number" ? `₹${item.extracted_price.toLocaleString("en-IN")}` : "Price unavailable"),
      priceValue: typeof item.extracted_price === "number" ? item.extracted_price : null,
      oldPrice: item.old_price || null,
      rating: typeof item.rating === "number" ? item.rating : null,
      reviews: typeof item.reviews === "number" ? item.reviews : null,
      image: toSafeHttpUrl(item.thumbnail),
      url: toSafeHttpUrl(item.product_link || item.link),
      delivery: item.delivery || null,
      condition: item.second_hand_condition || null
    }));

    return NextResponse.json({
      query,
      products,
      resultCount: products.length,
      updatedAt: new Date().toISOString(),
      source: "Google Shopping via SerpApi"
    }, {
      headers: { "Cache-Control": "private, max-age=60, stale-while-revalidate=300" }
    });
  } catch {
    return NextResponse.json({ error: "Shopping search timed out. Please try again." }, { status: 504 });
  }
}
