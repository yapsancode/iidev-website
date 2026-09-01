import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { leadExtractionSchema } from "./ai-schema";
import { priorityForScore, scoreLead } from "./scoring";
import { sendLeadTelegramAlert } from "./telegram";
import type { LeadExtraction, LeadRecord } from "./types";
import { getDb } from "@/lib/cloudflare/env";
import { hydrateLead, serialize, updateLead } from "@/lib/cloudflare/rows";

const PROMPT_VERSION = "lead-intelligence-v1";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 1000) : "Unknown processing error";
}

async function wait(milliseconds: number) {
  await new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function extractLead(lead: LeadRecord): Promise<{
  extraction: LeadExtraction;
  model: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
}> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured.");
  const model = process.env.OPENAI_LEAD_MODEL || "gpt-5.4-mini";
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    maxRetries: 0,
    timeout: 10_000,
  });
  const startedAt = Date.now();
  const response = await openai.responses.parse({
    model,
    store: false,
    reasoning: { effort: "none" },
    instructions: [
      "You qualify website enquiries for iidev Studio, a Malaysian search-first web and business automation studio.",
      "Understand mixed Bahasa Melayu and English. Extract only facts supported by the enquiry.",
      "Do not invent budget, location, scope, or commitments. Flag suspected spam, sensitive data, and unrealistic deadlines.",
      "Recommendations remain internal and must never promise price, delivery date, or business outcome.",
    ].join(" "),
    input: JSON.stringify({
      fullName: lead.full_name,
      businessName: lead.business_name,
      budget: lead.budget,
      timeline: lead.timeline,
      serviceContext: lead.service_context,
      enquiry: lead.raw_enquiry,
    }),
    text: { format: zodTextFormat(leadExtractionSchema, "lead_extraction") },
  });
  if (!response.output_parsed) throw new Error("The model did not return a parsed lead extraction.");
  return {
    extraction: response.output_parsed,
    model,
    inputTokens: response.usage?.input_tokens ?? 0,
    outputTokens: response.usage?.output_tokens ?? 0,
    latencyMs: Date.now() - startedAt,
  };
}

async function fetchLead(id: string): Promise<LeadRecord> {
  const row=await (await getDb()).prepare("SELECT * FROM leads WHERE id=?").bind(id).first<Record<string,unknown>>();
  if(!row) throw new Error("Lead not found."); return hydrateLead(row);
}

async function recordEvent(leadId: string, eventType: string, metadata: Record<string, unknown> = {}) {
  await (await getDb()).prepare("INSERT INTO lead_events(lead_id,event_type,metadata) VALUES(?,?,?)").bind(leadId,eventType,serialize(metadata)).run();
}

async function updateTelegramState(lead: LeadRecord, manualReview = false) {
  try {
    const delivery = await sendLeadTelegramAlert(lead, manualReview);
    await updateLead(lead.id,{
      telegram_status: delivery.status,
      telegram_sent_at: delivery.status === "sent" ? new Date().toISOString() : null,
      telegram_error: delivery.error,
    });
    await recordEvent(lead.id, delivery.status === "sent" ? "telegram_sent" : `telegram_${delivery.status}`, {
      error: delivery.error,
    });
  } catch (error) {
    const message = errorMessage(error);
    await updateLead(lead.id,{ telegram_status: "failed", telegram_error: message });
    await recordEvent(lead.id, "telegram_failed", { error: message });
  }
}

export async function processLead(leadId: string): Promise<void> {
  const initialLead = await fetchLead(leadId);
  await updateLead(leadId,{
    processing_status: "processing",
    processing_attempts: initialLead.processing_attempts + 1,
    ai_error: null,
  });
  await recordEvent(leadId, "ai_processing_started", { attempt: initialLead.processing_attempts + 1 });

  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const lead = await fetchLead(leadId);
      const result = await extractLead(lead);
      const breakdown = scoreLead({
        businessName: lead.business_name,
        email: lead.email,
        budget: lead.budget,
        timeline: lead.timeline,
        extraction: result.extraction,
      });
      const priority = priorityForScore(breakdown.total, result.extraction.confidence);
      const processingStatus = priority === "needs_review" ? "needs_review" : "complete";
      await updateLead(leadId,{
        ai_extraction: result.extraction,
        ai_confidence: result.extraction.confidence,
        ai_model: result.model,
        ai_prompt_version: PROMPT_VERSION,
        ai_input_tokens: result.inputTokens,
        ai_output_tokens: result.outputTokens,
        ai_latency_ms: result.latencyMs,
        score_breakdown: breakdown,
        lead_score: breakdown.total,
        priority,
        processing_status: processingStatus,
        ai_error: null,
      });
      await recordEvent(leadId, "ai_processing_completed", {
        model: result.model,
        score: breakdown.total,
        priority,
        confidence: result.extraction.confidence,
      });
      const processedLead = await fetchLead(leadId);
      await updateTelegramState(processedLead, priority === "needs_review");
      return;
    } catch (error) {
      lastError = error;
      if (attempt < 2) await wait(500 * attempt);
    }
  }

  const message = errorMessage(lastError);
  await updateLead(leadId,{
    processing_status: "needs_review",
    priority: "needs_review",
    ai_error: message,
  });
  await recordEvent(leadId, "ai_processing_failed", { error: message });
  const failedLead = await fetchLead(leadId);
  await updateTelegramState(failedLead, true);
}

export async function resendTelegramAlert(leadId: string): Promise<void> {
  await updateTelegramState(await fetchLead(leadId));
}
