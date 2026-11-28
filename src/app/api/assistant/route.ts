import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type CatalogItem={id:string;name:string;brand:string;variant:string;category?:"Fashion"|"Phones"|"Laptops";price:number|null;specifications:string[];simulated:boolean};
type ConversationMessage={role:"user"|"assistant";content:string};
export async function POST(request:NextRequest){
 try{
  const body=await request.json() as {apiKey?:string;mode?:"finder"|"test"|"followup";query?:string;budget?:number|null;catalog?:CatalogItem[];conversation?:ConversationMessage[]};
  const apiKey=typeof body.apiKey==="string"?body.apiKey.trim():"";
  if(!apiKey)return NextResponse.json({error:"Add your Groq API key in Settings."},{status:400});
  const mode=body.mode==="test"?"test":body.mode==="followup"?"followup":"finder";
  const query=typeof body.query==="string"?body.query.trim().slice(0,1500):"";
  const catalog=Array.isArray(body.catalog)?body.catalog.slice(0,100).filter(p=>p&&typeof p.id==="string"&&typeof p.name==="string"):[];
  if(mode==="finder"&&!query)return NextResponse.json({error:"Describe what you want to find."},{status:400});
  if(mode==="followup"&&(!query||catalog.length===0))return NextResponse.json({error:"Ask a question about the current shortlist."},{status:400});
  const followupSystem=`You are ShopIntel, a focused shopping decision assistant. Answer follow-up questions ONLY about the shortlisted products in the supplied catalogue. Do not introduce outside products, invented specifications, prices, offers, retailers, benchmark scores or claims. Use exact product names and listed prices/specifications. For phones, compare listed battery capacity in mAh and never convert capacity into hours or promise battery life. For laptops, compare battery runtime only if a verified runtime value is listed. For demanding work or gaming, distinguish listed RAM/storage from CPU or chipset, thermals, benchmarks and sustained-performance data; when those are missing, state the limitation instead of guessing. If the data cannot establish a winner, say so and explain what is missing. Keep answers clear, practical and concise, with a direct recommendation when available evidence supports one. Catalogue: ${JSON.stringify(catalog)}`;
  const conversation=Array.isArray(body.conversation)?body.conversation.filter((m):m is ConversationMessage=>Boolean(m)&&((m.role==="user")||(m.role==="assistant"))&&typeof m.content==="string").slice(-8).map(m=>({role:m.role,content:m.content.slice(0,1200)})):[];
  const system=mode==="test"?"Reply with exactly: Groq connection successful.":`You are ShopIntel's shopping-intent engine. Understand the buyer's natural-language request and select the best matching products ONLY from the supplied catalogue. Never invent products, IDs, specifications, retailers, offers or prices. Some catalogue data is simulated; preserve that distinction. Interpret category, budget, shorthand like 20k, and priorities across fashion, footwear, accessories and electronics. For fashion, match requested garment or item type, occasion, style, fit, fabric, colour, size and budget only when those details are present in catalogue data; never invent fabric, fit, sizing or quality claims. Select Fashion when the buyer asks for clothing, outfits, shoes, bags or accessories. For laptops, prioritise CPU/chip, RAM, storage, display and battery data where supplied; for phones, consider processor, RAM, storage, display, camera and battery. Do not treat missing specifications as positive evidence. A budget written in the query overrides the separate budget field. If budget exists, only select products at or below it. If none fit, return rankedIds empty and explain. Do not return markdown. Return one valid JSON object and nothing else, with exactly these keys: budget (a number or null), category ("Fashion", "Phones" or "Laptops"), priorities (an array of strings), rankedIds (an array of exact catalogue ID strings, best first, maximum 4), explanation (a short string). Use null for budget when no budget is stated. Never include markdown or extra keys. Catalogue: ${JSON.stringify(catalog)}`;
  const messages=mode==="test"?[{role:"system",content:system},{role:"user",content:"Test connection."}]:mode==="followup"?[{role:"system",content:followupSystem},...conversation,{role:"user",content:query}]:[{role:"system",content:system},{role:"user",content:`Buyer request: ${query}\nBudget field INR: ${Number.isFinite(body.budget)?body.budget:"not supplied"}\nReturn JSON only.`}];
  const upstream=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+apiKey,"Content-Type":"application/json"},body:JSON.stringify({model:"openai/gpt-oss-120b",messages,temperature:mode==="followup"?0.35:0.2,max_tokens:mode==="followup"?900:1400,response_format:mode==="finder"?{type:"json_object"}:undefined}),cache:"no-store"});
  const result=await upstream.json().catch(()=>({})) as {error?:{message?:string};choices?:Array<{message?:{content?:string}} >};
  if(!upstream.ok){
   const upstreamMessage=result.error?.message||"";
   const modelUnavailable=/model.*(not exist|not found|access|permission)|no access.*model/i.test(upstreamMessage);
   const message=upstream.status===401?"Groq rejected this API key. Check it in Settings.":modelUnavailable?"Your Groq key cannot access the configured shopping model. Check the key's model access in Groq, then try again.":upstreamMessage||"Groq request failed ("+upstream.status+").";
   return NextResponse.json({error:message},{status:upstream.status===401?401:502,headers:{"Cache-Control":"no-store"}});
  }
  const content=result.choices?.[0]?.message?.content?.trim();
  if(!content)return NextResponse.json({error:"Groq returned an empty response."},{status:502});
  if(mode==="test"||mode==="followup")return NextResponse.json({answer:content},{headers:{"Cache-Control":"no-store"}});
  let parsed:unknown;try{parsed=JSON.parse(content);}catch{return NextResponse.json({error:"Groq returned an invalid shopping result. Please try again."},{status:502});}
  const candidate=parsed as Partial<{budget:number|null;category:string;priorities:string[];rankedIds:string[];explanation:string}>;
  const allowed=new Set(catalog.map(p=>p.id));
  const rankedIds=Array.isArray(candidate.rankedIds)?candidate.rankedIds.filter((id):id is string=>typeof id==="string"&&allowed.has(id)).slice(0,4):[];
  const safeBudget=typeof candidate.budget==="number"&&Number.isFinite(candidate.budget)&&candidate.budget>0?Math.round(candidate.budget):(typeof body.budget==="number"?body.budget:null);
  return NextResponse.json({result:{budget:safeBudget,category:candidate.category==="Fashion"?"Fashion":candidate.category==="Laptops"?"Laptops":"Phones",priorities:Array.isArray(candidate.priorities)?candidate.priorities.filter(x=>typeof x==="string").slice(0,8):[],rankedIds,explanation:typeof candidate.explanation==="string"?candidate.explanation.slice(0,500):"Ranked against your stated needs."}},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Could not process your shopping search. Please try again."},{status:500,headers:{"Cache-Control":"no-store"}});}
}