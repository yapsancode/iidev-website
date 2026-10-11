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
] as const;

export type ProspectStatus = (typeof prospectStatuses)[number];
export type ProspectPriority = (typeof prospectPriorities)[number];
export type WebsiteState = (typeof websiteStates)[number];
export type DraftLanguage = (typeof draftLanguages)[number];
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
  source: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
}

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
};

export const closedProspectStatuses: ProspectStatus[] = ["won", "lost", "not_fit"];
export const inProgressProspectStatuses: ProspectStatus[] = ["audit_booked", "audit_done", "proposal"];
