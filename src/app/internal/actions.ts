"use server";

import { after } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { processLead, resendTelegramAlert } from "@/lib/leads/processing";
import { leadStatuses } from "@/lib/leads/types";
import { getDb } from "@/lib/cloudflare/env";
import { serialize } from "@/lib/cloudflare/rows";

const idSchema = z.uuid();
const ownerSchema = z.string().min(1).max(100);

async function addFounderEvent(leadId: string, actorId: string, eventType: string, metadata: Record<string, unknown>) {
  await (await getDb()).prepare("INSERT INTO lead_events(lead_id,actor_id,event_type,metadata) VALUES(?,?,?,?)").bind(leadId,actorId,eventType,serialize(metadata)).run();
}

function refreshLeadPaths(leadId: string) {
  revalidatePath("/internal"); revalidatePath("/internal/leads");
  revalidatePath(`/internal/leads/${leadId}`); revalidatePath("/internal/insights");
}

export async function updateLeadStatus(formData: FormData) {
  const user = await requireInternalUser();
  const parsed = z.object({ leadId: idSchema, status: z.enum(leadStatuses) }).parse({
    leadId: formData.get("leadId"), status: formData.get("status"),
  });
  const now=new Date().toISOString();
  await (await getDb()).prepare("UPDATE leads SET status=?,updated_at=?,last_activity_at=? WHERE id=?").bind(parsed.status,now,now,parsed.leadId).run();
  await addFounderEvent(parsed.leadId, user.id, "status_changed", { status: parsed.status });
  refreshLeadPaths(parsed.leadId);
}

export async function assignLeadOwner(formData: FormData) {
  const user = await requireInternalUser();
  const leadId = idSchema.parse(formData.get("leadId"));
  const ownerValue = String(formData.get("ownerId") || "");
  const ownerId = ownerValue ? ownerSchema.parse(ownerValue) : null;
  const now=new Date().toISOString();
  await (await getDb()).prepare("UPDATE leads SET owner_id=?,updated_at=?,last_activity_at=? WHERE id=?").bind(ownerId,now,now,leadId).run();
  await addFounderEvent(leadId, user.id, "owner_changed", { ownerId });
  refreshLeadPaths(leadId);
}

export async function addLeadNote(formData: FormData) {
  const user = await requireInternalUser();
  const parsed = z.object({ leadId: idSchema, body: z.string().trim().min(1).max(4000) }).parse({
    leadId: formData.get("leadId"), body: formData.get("body"),
  });
  await (await getDb()).prepare("INSERT INTO lead_notes(id,lead_id,author_id,body) VALUES(?,?,?,?)").bind(crypto.randomUUID(),parsed.leadId,user.id,parsed.body).run();
  await addFounderEvent(parsed.leadId, user.id, "note_added", {});
  refreshLeadPaths(parsed.leadId);
}

export async function retryLeadProcessing(formData: FormData) {
  const user = await requireInternalUser();
  const leadId = idSchema.parse(formData.get("leadId"));
  await addFounderEvent(leadId, user.id, "ai_retry_requested", {});
  after(() => processLead(leadId));
  refreshLeadPaths(leadId);
}

export async function resendLeadTelegram(formData: FormData) {
  const user = await requireInternalUser();
  const leadId = idSchema.parse(formData.get("leadId"));
  await addFounderEvent(leadId, user.id, "telegram_retry_requested", {});
  after(() => resendTelegramAlert(leadId));
  refreshLeadPaths(leadId);
}
