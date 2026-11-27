import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type CatalogItem={id:string;name:string;brand:string;variant:string;price:number|null;specifications:string[];simulated:boolean};
export async function POST(request:NextRequest){
 try{
  const body=await request.json() as {apiKey?:string;mode?:"finder"|"test";query?:string;budget?:number|null;catalog?:CatalogItem[]};
  const apiKey=typeof body.apiKey==="string"?body.apiKey.trim():"";
  if(!apiKey)return NextResponse.json({error:"Add your Groq API key in Settings."},{status:400});
  const mode=body.mode==="test"?"test":"finder";
  const query=typeof body.query==="string"?body.query.trim().slice(0,1500):"";
  const catalog=Array.isArray(body.catalog)?body.catalog.slice(0,100).filter(p=>p&&typeof p.id==="string"&&typeof p.name==="string"):[];
  if(mode==="finder"&&!query)return NextResponse.json({error:"Describe what you want to find."},{status:400});
  const system=mode==="test"?"Reply with exactly: Groq connection successful.":`You are BuyWise's shopping-intent engine. Understand the buyer's natural-language request and select the best matching products ONLY from the supplied catalogue. Never invent products, IDs, specifications, retailers, offers or prices. Some catalogue data is simulated; preserve that distinction. Interpret category, budget, shorthand like 20k, and priorities including gaming/performance, battery, camera, display, portability and value. A budget written in the query overrides the separate budget field. If budget exists, only select products at or below it. If none fit, return rankedIds empty and explain. Do not return markdown. Return exactly JSON: {"budget":number|null,"category":"Phones"|"Laptops","priorities":string[],"rankedIds":string[],"explanation":string}. rankedIds must be exact IDs from catalogue, best first, maximum 4. Catalogue: ${JSON.stringify(catalog)}`;
  const messages=mode==="test"?[{role:"system",content:system},{role:"user",content:"Test connection."}]:[{role:"system",content:system},{role:"user",content:`Buyer request: ${query}\nBudget field INR: ${Number.isFinite(body.budget)?body.budget:"not supplied"}\nReturn JSON only.`}];
  const upstream=await fetch("https://api.groq.com/openai/v1/chat/completions",{method:"POST",headers:{Authorization:"Bearer "+apiKey,"Content-Type":"application/json"},body:JSON.stringify({model:"openai/gpt-oss-120b",messages,temperature:0.2,max_tokens:900,response_format:mode==="finder"?{
    type:"json_schema",
    json_schema:{
     name:"buywise_shopping_match",
     strict:true,
     schema:{
      type:"object",
      properties:{
       budget:{anyOf:[{type:"number"},{type:"null"}]},
       category:{type:"string",enum:["Phones","Laptops"]},
       priorities:{type:"array",items:{type:"string"}},
       rankedIds:{type:"array",items:{type:"string"}},
       explanation:{type:"string"}
      },
      required:["budget","category","priorities","rankedIds","explanation"],
      additionalProperties:false
     }
    }
   }:undefined}),cache:"no-store"});
  const result=await upstream.json().catch(()=>({})) as {error?:{message?:string};choices?:Array<{message?:{content?:string}} >};
  if(!upstream.ok){
   const upstreamMessage=result.error?.message||"";
   const modelUnavailable=/model.*(not exist|not found|access|permission)|no access.*model/i.test(upstreamMessage);
   const message=upstream.status===401?"Groq rejected this API key. Check it in Settings.":modelUnavailable?"Your Groq key cannot access the configured shopping model. Check the key's model access in Groq, then try again.":upstreamMessage||"Groq request failed ("+upstream.status+").";
   return NextResponse.json({error:message},{status:upstream.status===401?401:502,headers:{"Cache-Control":"no-store"}});
  }
  const content=result.choices?.[0]?.message?.content?.trim();
  if(!content)return NextResponse.json({error:"Groq returned an empty response."},{status:502});
  if(mode==="test")return NextResponse.json({answer:content},{headers:{"Cache-Control":"no-store"}});
  let parsed:unknown;try{parsed=JSON.parse(content);}catch{return NextResponse.json({error:"Groq returned an invalid shopping result. Please try again."},{status:502});}
  const candidate=parsed as Partial<{budget:number|null;category:string;priorities:string[];rankedIds:string[];explanation:string}>;
  const allowed=new Set(catalog.map(p=>p.id));
  const rankedIds=Array.isArray(candidate.rankedIds)?candidate.rankedIds.filter((id):id is string=>typeof id==="string"&&allowed.has(id)).slice(0,4):[];
  const safeBudget=typeof candidate.budget==="number"&&Number.isFinite(candidate.budget)&&candidate.budget>0?Math.round(candidate.budget):(typeof body.budget==="number"?body.budget:null);
  return NextResponse.json({result:{budget:safeBudget,category:candidate.category==="Laptops"?"Laptops":"Phones",priorities:Array.isArray(candidate.priorities)?candidate.priorities.filter(x=>typeof x==="string").slice(0,8):[],rankedIds,explanation:typeof candidate.explanation==="string"?candidate.explanation.slice(0,500):"Ranked against your stated needs."}},{headers:{"Cache-Control":"no-store"}});
 }catch{return NextResponse.json({error:"Could not process your shopping search. Please try again."},{status:500,headers:{"Cache-Control":"no-store"}});}
}