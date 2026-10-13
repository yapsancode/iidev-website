import { sendLeadTelegramAlert } from "./telegram";
import type { LeadRecord } from "./types";
import { getDb } from "@/lib/cloudflare/env";
import { hydrateLead, serialize, updateLead } from "@/lib/cloudflare/rows";

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message.slice(0, 1000) : "Unknown error";
}

async function fetchLead(id: string): Promise<LeadRecord> {
  const row=await (await getDb()).prepare("SELECT * FROM leads WHERE id=?").bind(id).first<Record<string,unknown>>();
  if(!row) throw new Error("Lead not found."); return hydrateLead(row);
}

async function recordEvent(leadId: string, eventType: string, metadata: Record<string, unknown> = {}) {
  await (await getDb()).prepare("INSERT INTO lead_events(lead_id,event_type,metadata) VALUES(?,?,?)").bind(leadId,eventType,serialize(metadata)).run();
}

async function updateTelegramState(lead: LeadRecord) {
  try {
    const delivery = await sendLeadTelegramAlert(lead, Boolean(lead.ai_extraction) && lead.priority === "needs_review");
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

/**
 * A new enquiry: tell the founders at once, with the enquiry as the visitor wrote it.
 * No AI runs here. The lead stays "pending" (not yet summarised) until a founder asks
 * Claude for a summary, which is saved through `saveLeadAssessment`.
 */
export async function notifyNewLead(leadId: string): Promise<void> {
  await updateTelegramState(await fetchLead(leadId));
}

export async function resendTelegramAlert(leadId: string): Promise<void> {
  await updateTelegramState(await fetchLead(leadId));
}
