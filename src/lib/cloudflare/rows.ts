import type { LeadRecord } from "@/lib/leads/types";
import { getDb } from "./env";

function json<T>(value: unknown, fallback: T): T {
  if (typeof value !== "string" || !value) return fallback;
  try { return JSON.parse(value) as T; } catch { return fallback; }
}

export function hydrateLead(row: Record<string, unknown>): LeadRecord {
  return {
    ...row,
    utm: json(row.utm, {}),
    score_breakdown: json(row.score_breakdown, null),
    ai_extraction: json(row.ai_extraction, null),
    retention_review_due: Boolean(row.retention_review_due),
  } as LeadRecord;
}

export function serialize(value: unknown): string | null {
  return value == null ? null : JSON.stringify(value);
}

export async function updateLead(id: string, values: Record<string, unknown>) {
  const entries = Object.entries({ ...values, updated_at: new Date().toISOString() });
  const sql = `UPDATE leads SET ${entries.map(([key]) => `${key}=?`).join(",")} WHERE id=?`;
  const bound = entries.map(([,value]) => typeof value === "object" && value !== null ? serialize(value) : value);
  await (await getDb()).prepare(sql).bind(...bound,id).run();
}
