import { leadExtractionSchema } from "./ai-schema";
import { priorityForScore, scoreLead } from "./scoring";
import type { LeadExtraction, LeadPriority, LeadRecord, ScoreBreakdown } from "./types";
import { getDb } from "@/lib/cloudflare/env";
import { hydrateLead, serialize, updateLead } from "@/lib/cloudflare/rows";

/** Recorded as the model for summaries written in the Claude app and saved through the connector. */
export const CONNECTOR_MODEL = "claude-connector";
const ASSESSMENT_VERSION = "claude-connector-v1";

export interface SavedAssessment {
  lead: LeadRecord;
  breakdown: ScoreBreakdown;
  priority: LeadPriority;
}

/**
 * Saves a summary of one enquiry and works out its score with the website's own rules.
 * The summary is checked against `leadExtractionSchema` first, so a badly shaped one throws
 * a ZodError and nothing is saved. Returns null when the enquiry does not exist.
 */
export async function saveLeadAssessment(
  leadId: string,
  input: unknown,
  actorId: string,
  model: string = CONNECTOR_MODEL,
): Promise<SavedAssessment | null> {
  const extraction: LeadExtraction = leadExtractionSchema.parse(input);
  const db = await getDb();
  const row = await db.prepare("SELECT * FROM leads WHERE id=?").bind(leadId).first<Record<string, unknown>>();
  if (!row) return null;
  const lead = hydrateLead(row);

  const breakdown = scoreLead({
    businessName: lead.business_name,
    email: lead.email,
    budget: lead.budget,
    timeline: lead.timeline,
    extraction,
  });
  const priority = priorityForScore(breakdown.total, extraction.confidence);
  await updateLead(leadId, {
    ai_extraction: extraction,
    ai_confidence: extraction.confidence,
    ai_model: model,
    ai_prompt_version: ASSESSMENT_VERSION,
    ai_input_tokens: null,
    ai_output_tokens: null,
    ai_latency_ms: null,
    score_breakdown: breakdown,
    lead_score: breakdown.total,
    priority,
    processing_status: priority === "needs_review" ? "needs_review" : "complete",
    processing_attempts: lead.processing_attempts + 1,
    ai_error: null,
  });
  await db
    .prepare("INSERT INTO lead_events(lead_id,actor_id,event_type,metadata) VALUES(?,?,?,?)")
    .bind(leadId, actorId, "ai_processing_completed", serialize({ model, score: breakdown.total, priority, confidence: extraction.confidence }))
    .run();

  const saved = await db.prepare("SELECT * FROM leads WHERE id=?").bind(leadId).first<Record<string, unknown>>();
  return { lead: hydrateLead(saved!), breakdown, priority };
}
