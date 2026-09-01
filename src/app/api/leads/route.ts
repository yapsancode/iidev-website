import { after } from "next/server";
import { NextResponse, type NextRequest } from "next/server";
import { leadSubmissionSchema, normalizeWhatsapp } from "@/lib/leads/schema";
import { hashIp, isAllowedOrigin } from "@/lib/leads/security";
import { processLead } from "@/lib/leads/processing";
import { buildWhatsAppUrl } from "@/lib/leads/whatsapp";
import { getDb } from "@/lib/cloudflare/env";
import { serialize } from "@/lib/cloudflare/rows";

export const runtime = "nodejs";
export const maxDuration = 30;

function clientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown";
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request.headers.get("origin"), request.nextUrl.origin)) {
    return NextResponse.json({ error: "Request origin is not allowed." }, { status: 403 });
  }
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 25_000) {
    return NextResponse.json({ error: "Enquiry is too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const parsed = leadSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted details.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const fallbackWhatsappUrl = buildWhatsAppUrl(parsed.data);
  if (parsed.data.companyWebsite) {
    return NextResponse.json({ leadId: null, whatsappUrl: fallbackWhatsappUrl }, { status: 201 });
  }

  const whatsapp = normalizeWhatsapp(parsed.data.whatsapp);
  if (!whatsapp) {
    return NextResponse.json({ error: "Enter a valid WhatsApp number." }, { status: 400 });
  }
  let db:D1Database;
  try { db=await getDb(); } catch { return NextResponse.json({error:"Lead capture is being configured. You can still continue on WhatsApp.",fallbackWhatsappUrl},{status:503}); }
  const ipHash = hashIp(clientIp(request));
  const now=Date.now(), windowStart=new Date(now-900000).toISOString();
  const rate=await db.prepare("SELECT window_started_at,request_count FROM lead_rate_limits WHERE ip_hash=?").bind(ipHash).first<{window_started_at:string;request_count:number}>();
  const count=rate&&rate.window_started_at>=windowStart?rate.request_count+1:1;
  await db.prepare("INSERT INTO lead_rate_limits(ip_hash,window_started_at,request_count) VALUES(?,?,?) ON CONFLICT(ip_hash) DO UPDATE SET window_started_at=excluded.window_started_at,request_count=excluded.request_count").bind(ipHash,count===1?new Date().toISOString():rate!.window_started_at,count).run();
  if (count>5) {
    return NextResponse.json({ error: "Too many enquiries. Please wait before trying again." }, { status: 429 });
  }

  const existing=await db.prepare("SELECT id FROM leads WHERE submission_id=?").bind(parsed.data.submissionId).first<{id:string}>();
  if (existing?.id) {
    return NextResponse.json({ leadId: existing.id, whatsappUrl: fallbackWhatsappUrl }, { status: 200 });
  }

  const leadId=crypto.randomUUID();
  try { await db.prepare("INSERT INTO leads(id,submission_id,full_name,business_name,whatsapp,email,budget,timeline,raw_enquiry,service_context,source_page,referrer,utm,consent_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(leadId,parsed.data.submissionId,parsed.data.fullName,parsed.data.businessName||null,whatsapp,parsed.data.email||null,parsed.data.budget||null,parsed.data.timeline||null,parsed.data.enquiry,parsed.data.serviceContext||null,parsed.data.sourcePage||null,parsed.data.referrer||null,serialize(parsed.data.utm),new Date().toISOString()).run(); } catch {
    return NextResponse.json({
      error: "We could not save your enquiry. Nothing has been lost—please retry or continue on WhatsApp.",
      fallbackWhatsappUrl,
    }, { status: 503 });
  }

  await db.prepare("INSERT INTO lead_events(lead_id,event_type,metadata) VALUES(?,?,?)").bind(leadId,"lead_captured",serialize({sourcePage:parsed.data.sourcePage||null,serviceContext:parsed.data.serviceContext||null})).run();
  after(() => processLead(leadId));

  return NextResponse.json({ leadId, whatsappUrl: fallbackWhatsappUrl }, { status: 201 });
}
