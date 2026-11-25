import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "buywise",
    integrations: {
      shoppingSearch: Boolean(process.env.SERPAPI_KEY),
    },
    timestamp: new Date().toISOString(),
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
