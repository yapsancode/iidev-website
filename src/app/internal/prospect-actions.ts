"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireInternalUser } from "@/lib/auth/internal-user";
import { createProspect, updateProspect } from "@/lib/prospects/data";
import { prospectCreateSchema, prospectPatchSchema } from "@/lib/prospects/schema";
import { prospectActions, prospectStatuses } from "@/lib/prospects/types";

const idSchema = z.uuid();

function refreshProspectPaths(prospectId?: string) {
  revalidatePath("/internal");
  revalidatePath("/internal/prospects");
  revalidatePath("/internal/insights");
  if (prospectId) revalidatePath(`/internal/prospects/${prospectId}`);
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function wholeNumber(formData: FormData, key: string): number | null {
  const raw = text(formData, key).trim();
  if (!raw) return null;
  const parsed = Number(raw);
  return Number.isInteger(parsed) ? parsed : Number.NaN;
}

/** Reads the shared add/edit form into the shape the schemas expect. */
function fieldsFromForm(formData: FormData) {
  const hasGbp = text(formData, "has_gbp");
  return {
    business_name: text(formData, "business_name"),
    category: text(formData, "category") || "Other",
    area: text(formData, "area"),
    phone: text(formData, "phone"),
    whatsapp: text(formData, "whatsapp"),
    google_reviews: wholeNumber(formData, "google_reviews"),
    priority: text(formData, "priority") || "B",
    status: text(formData, "status") || "not_contacted",
    website: text(formData, "website"),
    website_state: text(formData, "website_state") || null,
    mobile_score: wholeNumber(formData, "mobile_score"),
    has_gbp: hasGbp === "yes" ? true : hasGbp === "no" ? false : null,
    top_finding: text(formData, "top_finding"),
    suggested_angle: text(formData, "suggested_angle"),
    findings: text(formData, "findings"),
    draft_first: text(formData, "draft_first"),
    draft_followup: text(formData, "draft_followup"),
    draft_language: text(formData, "draft_language") || null,
    audit_date: text(formData, "audit_date"),
    last_contact: text(formData, "last_contact"),
    next_follow_up: text(formData, "next_follow_up"),
    notes: text(formData, "notes"),
  };
}

function firstProblem(error: z.ZodError): string {
  const issue = error.issues[0];
  const field = issue?.path.join(".") || "form";
  return `${field.replaceAll("_", " ")}: ${issue?.message || "please check this value"}`;
}

/** Mark sent, follow-up sent, they replied, not fit. */
export async function runProspectAction(formData: FormData) {
  const user = await requireInternalUser();
  const parsed = z
    .object({ prospectId: idSchema, action: z.enum(prospectActions) })
    .parse({ prospectId: formData.get("prospectId"), action: formData.get("action") });
  await updateProspect(parsed.prospectId, { action: parsed.action }, user.id);
  refreshProspectPaths(parsed.prospectId);
}

export async function setProspectStatus(formData: FormData) {
  const user = await requireInternalUser();
  const parsed = z
    .object({ prospectId: idSchema, status: z.enum(prospectStatuses) })
    .parse({ prospectId: formData.get("prospectId"), status: formData.get("status") });
  await updateProspect(parsed.prospectId, { status: parsed.status }, user.id);
  refreshProspectPaths(parsed.prospectId);
}

/** Called by the board when a card is dropped on a column or moved from its menu. */
export async function moveProspect(prospectId: string, status: string) {
  const user = await requireInternalUser();
  const parsed = z.object({ prospectId: idSchema, status: z.enum(prospectStatuses) }).parse({ prospectId, status });
  await updateProspect(parsed.prospectId, { status: parsed.status }, user.id);
  refreshProspectPaths(parsed.prospectId);
}

export async function addProspectNote(formData: FormData) {
  const user = await requireInternalUser();
  const parsed = z
    .object({ prospectId: idSchema, note: z.string().trim().min(1).max(4000) })
    .parse({ prospectId: formData.get("prospectId"), note: formData.get("note") });
  await updateProspect(parsed.prospectId, { note: parsed.note }, user.id);
  refreshProspectPaths(parsed.prospectId);
}

export async function saveProspect(formData: FormData) {
  const user = await requireInternalUser();
  const prospectId = idSchema.parse(formData.get("prospectId"));
  const parsed = prospectPatchSchema.safeParse(fieldsFromForm(formData));
  if (!parsed.success) {
    redirect(`/internal/prospects/${prospectId}/edit?error=${encodeURIComponent(firstProblem(parsed.error))}`);
  }
  let problem: string | null = null;
  try {
    const updated = await updateProspect(prospectId, parsed.data, user.id);
    if (!updated) problem = "This prospect no longer exists.";
  } catch {
    problem = "Could not save. Another prospect may already use this business name and phone.";
  }
  if (problem) redirect(`/internal/prospects/${prospectId}/edit?error=${encodeURIComponent(problem)}`);
  refreshProspectPaths(prospectId);
  redirect(`/internal/prospects/${prospectId}`);
}

export async function createProspectFromForm(formData: FormData) {
  const user = await requireInternalUser();
  const parsed = prospectCreateSchema.safeParse({ ...fieldsFromForm(formData), source: "manual" });
  if (!parsed.success) redirect(`/internal/prospects/new?error=${encodeURIComponent(firstProblem(parsed.error))}`);
  let createdId: string | null = null;
  try {
    createdId = (await createProspect(parsed.data, user.id)).id;
  } catch {
    createdId = null;
  }
  if (!createdId) {
    redirect(`/internal/prospects/new?error=${encodeURIComponent("Could not add. A prospect with this business name and phone already exists.")}`);
  }
  refreshProspectPaths(createdId);
  redirect(`/internal/prospects/${createdId}`);
}
