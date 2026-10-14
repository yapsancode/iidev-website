import { Tag } from "@/components/internal/ui";
import { prospectStatusLabels, type ProspectPriority, type ProspectStatus, type WebsiteState } from "@/lib/prospects/types";

const statusTones: Record<ProspectStatus, "neutral" | "accent" | "solid" | "outline"> = {
  not_contacted: "outline",
  messaged: "neutral",
  replied: "accent",
  audit_booked: "solid",
  audit_done: "solid",
  proposal: "solid",
  won: "solid",
  lost: "outline",
  not_fit: "outline",
};

export function ProspectStatusBadge({ status }: { status: ProspectStatus }) {
  return <Tag tone={statusTones[status]}>{prospectStatusLabels[status]}</Tag>;
}

export function ProspectPriorityBadge({ priority }: { priority: ProspectPriority }) {
  return <Tag tone={priority === "A" ? "neutral" : "outline"}>Priority {priority}</Tag>;
}

export const websiteStateShort: Record<WebsiteState, string> = { none: "No site", weak: "Weak site", ok: "Site ok" };

export function WebsiteStateBadge({ state }: { state: WebsiteState | null }) {
  if (!state) return null;
  return <Tag tone="outline">{websiteStateShort[state]}</Tag>;
}

/** 14 Oct, from a YYYY-MM-DD string, without any time zone shift. */
export function formatDay(date: string | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

/** 14 Oct, 3:22 pm in Malaysia, from an ISO timestamp. */
export function formatMoment(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kuala_Lumpur" }).format(new Date(value));
}
