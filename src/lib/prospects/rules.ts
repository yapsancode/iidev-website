import {
  closedProspectStatuses,
  inProgressProspectStatuses,
  type ProspectAction,
  type ProspectRecord,
  type ProspectStatus,
  type ProspectView,
} from "./types";

/** Days to wait after the first message before the single follow-up. */
export const FOLLOW_UP_DAYS = 4;
/** A messaged prospect with no follow-up planned and no contact for this long has gone quiet. */
export const GONE_QUIET_DAYS = 14;

const MALAYSIA_TIME_ZONE = "Asia/Kuala_Lumpur";
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

type Datable = Pick<ProspectRecord, "status" | "audit_date" | "website_state" | "next_follow_up" | "last_contact">;

/** The calendar date in Malaysia as YYYY-MM-DD. All prospect dates use this, never UTC. */
export function toMalaysiaDate(instant: Date | string): string {
  const date = typeof instant === "string" ? new Date(instant) : instant;
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: MALAYSIA_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function todayInMalaysia(now: Date = new Date()): string {
  return toMalaysiaDate(now);
}

export function isValidDateString(value: string): boolean {
  if (!DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function addDays(date: string, days: number): string {
  const parsed = new Date(`${date}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

export function followUpDate(sentOn: string): string {
  return addDays(sentOn, FOLLOW_UP_DAYS);
}

export function isClosed(status: ProspectStatus): boolean {
  return closedProspectStatuses.includes(status);
}

/** Not contacted and never audited: the audit comes before any message. */
export function isToAudit(prospect: Datable): boolean {
  return prospect.status === "not_contacted" && !prospect.audit_date;
}

/** Audited, has a real problem to open with, and nothing sent yet. */
export function isReadyToMessage(prospect: Datable): boolean {
  return (
    prospect.status === "not_contacted" &&
    Boolean(prospect.audit_date) &&
    (prospect.website_state === "none" || prospect.website_state === "weak")
  );
}

/** Messaged, and the follow-up date is today or already passed. */
export function isDue(prospect: Datable, today: string): boolean {
  return prospect.status === "messaged" && Boolean(prospect.next_follow_up) && prospect.next_follow_up! <= today;
}

export function isGoneQuiet(prospect: Datable, today: string): boolean {
  return (
    prospect.status === "messaged" &&
    !prospect.next_follow_up &&
    Boolean(prospect.last_contact) &&
    prospect.last_contact! <= addDays(today, -GONE_QUIET_DAYS)
  );
}

export function matchesView(prospect: Datable, view: ProspectView, today: string): boolean {
  switch (view) {
    case "to_audit":
      return isToAudit(prospect);
    case "ready":
      return isReadyToMessage(prospect);
    case "due":
      return isDue(prospect, today);
    case "replied":
      return prospect.status === "replied";
    case "in_progress":
      return inProgressProspectStatuses.includes(prospect.status);
    case "closed":
      return isClosed(prospect.status);
    default:
      return true;
  }
}

/** Audit order: Priority A first, then the fewest Google reviews (most likely to have no site). */
export function compareForAudit(
  a: Pick<ProspectRecord, "priority" | "google_reviews" | "business_name">,
  b: Pick<ProspectRecord, "priority" | "google_reviews" | "business_name">,
): number {
  if (a.priority !== b.priority) return a.priority === "A" ? -1 : 1;
  const reviewsA = a.google_reviews ?? Number.MAX_SAFE_INTEGER;
  const reviewsB = b.google_reviews ?? Number.MAX_SAFE_INTEGER;
  if (reviewsA !== reviewsB) return reviewsA - reviewsB;
  return a.business_name.localeCompare(b.business_name);
}

export interface ActionOutcome {
  patch: Partial<Pick<ProspectRecord, "status" | "last_contact" | "next_follow_up">>;
  event: "message_sent" | "follow_up_sent" | "reply_logged" | null;
}

/** What each one-tap action changes. Kept pure so the page, the API and the tests agree. */
export function outcomeForAction(action: ProspectAction, today: string): ActionOutcome {
  switch (action) {
    case "mark_sent":
      return {
        patch: { status: "messaged", last_contact: today, next_follow_up: followUpDate(today) },
        event: "message_sent",
      };
    case "follow_up_sent":
      return { patch: { last_contact: today, next_follow_up: null }, event: "follow_up_sent" };
    case "replied":
      return { patch: { status: "replied", last_contact: today, next_follow_up: null }, event: "reply_logged" };
    case "not_fit":
      return { patch: { status: "not_fit", next_follow_up: null }, event: null };
  }
}

/**
 * Malaysian mobile number in E.164 (+601…), or null for landlines and anything unrecognised.
 * Only mobiles can receive WhatsApp, so only mobiles get a wa.me link.
 */
export function toMalaysianMobile(phone: string | null | undefined): string | null {
  if (!phone) return null;
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("60")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  if (!/^1\d{8,9}$/.test(digits)) return null;
  return `+60${digits}`;
}

export function whatsappLink(whatsapp: string | null | undefined, text?: string | null): string | null {
  if (!whatsapp) return null;
  const digits = whatsapp.replace(/\D/g, "");
  if (!digits) return null;
  const message = text?.trim();
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ""}`;
}
