import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };
type Mode = "general" | "shopping" | "test";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      apiKey?: string;
      mode?: Mode;
      messages?: ChatMessage[];
      catalog?: Array<{ name: string; brand: string; variant: string; price: number | null; specifications: string[]; simulated: true }>;
    };
    const apiKey = typeof body.apiKey === "string" ? body.apiKey.trim() : "";
    if (!apiKey) return NextResponse.json({ error: "Add your Groq API key in Settings." }, { status: 400 });
    const mode: Mode = body.mode === "shopping" || body.mode === "test" ? body.mode : "general";
    const messages = Array.isArray(body.messages) ? body.messages.slice(-16).filter((m): m is ChatMessage =>
      Boolean(m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
    ).map(m => ({ role: m.role, content: m.content.slice(0, 6000) })) : [];
    if (mode !== "test" && !messages.some(m => m.role === "user")) {
      return NextResponse.json({ error: "Write a question before sending." }, { status: 400 });
    }

    const systemPrompt = mode === "shopping"
      ? "You are BuyWise Shopping Assistant. You MUST answer shopping/product questions using ONLY the fictional demo-phone catalogue supplied below. These models, prices and specifications are simulated test data, not real products or retailer offers. Never claim they are real, never invent a product, retailer, live price, benchmark, review, warranty or availability. If the catalogue does not contain enough information, say so clearly. You may explain trade-offs using only supplied fields. If the user asks a non-shopping/general question in this mode, politely say this mode is limited to the demo phone catalogue and suggest switching to Ask anything. Be concise, clear, and honest. Catalogue: " + JSON.stringify(Array.isArray(body.catalog) ? body.catalog.slice(0, 30) : [])
      : "You are BuyWise AI, a helpful general-purpose assistant. Answer the user's question directly and clearly. You can help with learning, science, coding, writing, reasoning and everyday questions. Do not pretend to have live information or access to tools you do not have. If a question asks for product recommendations, do not invent real prices or availability; direct the user to Demo phones only mode for the fictional test catalogue.";
    const requestMessages = mode === "test"
      ? [{ role: "system", content: "Reply with exactly: Groq connection successful." }, { role: "user", content: "Connection test." }]
      : [{ role: "system", content: systemPrompt }, ...messages];

    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": "Bearer " + apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: requestMessages,
        temperature: 0.4,
        max_tokens: 1200
      }),
      cache: "no-store"
    });
    const result = await upstream.json().catch(() => ({})) as {
      error?: { message?: string };
      choices?: Array<{ message?: { content?: string } }>;
    };
    if (!upstream.ok) {
      const message = result.error?.message || (upstream.status === 401 ? "Groq rejected this API key. Check it in Settings." : "Groq request failed (" + upstream.status + ").");
      return NextResponse.json({ error: message }, { status: upstream.status === 401 ? 401 : 502, headers: { "Cache-Control": "no-store" } });
    }
    const answer = result.choices?.[0]?.message?.content?.trim();
    if (!answer) return NextResponse.json({ error: "Groq returned an empty answer. Please try again." }, { status: 502 });
    return NextResponse.json({ answer }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Could not process the AI request. Please try again." }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
