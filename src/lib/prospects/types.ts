import type { PreviewFinding } from "./preview";

export const prospectStatuses = [
  "not_contacted",
  "messaged",
  "replied",
  "audit_booked",
  "audit_done",
  "proposal",
  "won",
  "lost",
  "not_fit",
] as const;

export const prospectPriorities = ["A", "B"] as const;
export const websiteStates = ["none", "weak", "ok"] as const;
export const draftLanguages = ["ms", "en"] as const;

/** Suggested categories for the form. The database accepts any short text. */
export const prospectCategories = [
  "Clinic",
  "Dental",
  "Physio",
  "Renovation",
  "Aircon",
  "Tuition",
  "Beauty/Salon",
  "Car Workshop",
  "Law Firm",
  "Accounting",
  "Other",
] as const;

/** Why a prospect ended as Lost. "asked_to_stop" also means: never contact again. */
export const lostReasons = ["no_reply", "not_interested", "asked_to_stop", "has_agency", "price", "not_now", "other"] as const;
/** The main thing that held a prospect back, as heard in their reply. */
export const objections = ["price", "has_website", "facebook_enough", "has_agency", "no_time", "not_now", "trust", "other"] as const;

export const prospectViews = ["all", "to_audit", "ready", "due", "replied", "in_progress", "closed"] as const;
export const prospectActions = ["mark_sent", "follow_up_sent", "replied", "not_fit"] as const;

export const prospectEventTypes = [
  "created",
  "imported",
  "audited",
  "status_changed",
  "message_sent",
  "follow_up_sent",
  "reply_logged",
  "note_added",
  "draft_saved",
  "details_updated",
  "preview_published",
  "preview_removed",
  "preview_viewed",
] as const;

export type ProspectStatus = (typeof prospectStatuses)[number];
export type ProspectPriority = (typeof prospectPriorities)[number];
export type WebsiteState = (typeof websiteStates)[number];
export type DraftLanguage = (typeof draftLanguages)[number];
export type LostReason = (typeof lostReasons)[number];
export type Objection = (typeof objections)[number];
export type ProspectView = (typeof prospectViews)[number];
export type ProspectAction = (typeof prospectActions)[number];
export type ProspectEventType = (typeof prospectEventTypes)[number];

export interface ProspectRecord {
  id: string;
  business_name: string;
  category: string;
  area: string | null;
  phone: string | null;
  whatsapp: string | null;
  google_reviews: number | null;
  priority: ProspectPriority;
  status: ProspectStatus;
  website: string | null;
  website_state: WebsiteState | null;
  mobile_score: number | null;
  has_gbp: boolean | null;
  top_finding: string | null;
  suggested_angle: string | null;
  findings: string | null;
  draft_first: string | null;
  draft_followup: string | null;
  draft_language: DraftLanguage | null;
  audit_date: string | null;
  last_contact: string | null;
  next_follow_up: string | null;
  notes: string | null;
  lost_reason: LostReason | null;
  message_variant: string | null;
  objection: Objection | null;
  preview_findings: PreviewFinding[] | null;
  preview_token: string | null;
  preview_views: number;
  preview_first_viewed_at: string | null;
  preview_last_viewed_at: string | null;
  source: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

/**
 * Who made a change. A plain id is a founder working in the dashboard (or "claude" for the sales API).
 * The object form is a founder who made the change through the Claude app.
 */
export type EventActor = string | { id: string; via: "claude" };

export interface ProspectEvent {
  id: number;
  prospect_id: string;
  actor: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const prospectStatusLabels: Record<ProspectStatus, string> = {
  not_contacted: "Not contacted",
  messaged: "Messaged",
  replied: "Replied",
  audit_booked: "Audit booked",
  audit_done: "Audit done",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
  not_fit: "Not fit",
};

export const lostReasonLabels: Record<LostReason, string> = {
  no_reply: "No reply",
  not_interested: "Not interested",
  asked_to_stop: "Asked us to stop",
  has_agency: "Already has someone",
  price: "Price",
  not_now: "Not now",
  other: "Other",
};

export const objectionLabels: Record<Objection, string> = {
  price: "Price",
  has_website: "Already has a website",
  facebook_enough: "Facebook or Instagram is enough",
  has_agency: "Already has someone",
  no_time: "No time",
  not_now: "Not now",
  trust: "Does not know us",
  other: "Other",
};

export const websiteStateLabels: Record<WebsiteState, string> = {
  none: "No website",
  weak: "Weak website",
  ok: "Website is fine",
};

export const prospectViewLabels: Record<ProspectView, string> = {
  all: "All",
  to_audit: "To audit",
  ready: "Ready to message",
  due: "Follow-ups due",
  replied: "Replied",
  in_progress: "In progress",
  closed: "Closed",
};

export const prospectEventLabels: Record<string, string> = {
  created: "Prospect added",
  imported: "Imported",
  audited: "Audit saved",
  status_changed: "Status changed",
  message_sent: "First message sent",
  follow_up_sent: "Follow-up sent",
  reply_logged: "They replied",
  note_added: "Note added",
  draft_saved: "Message draft saved",
  details_updated: "Details updated",
  preview_published: "Preview link created",
  preview_removed: "Preview link removed",
  preview_viewed: "They opened the preview page",
};

export const closedProspectStatuses: ProspectStatus[] = ["won", "lost", "not_fit"];
export const inProgressProspectStatuses: ProspectStatus[] = ["audit_booked", "audit_done", "proposal"];
