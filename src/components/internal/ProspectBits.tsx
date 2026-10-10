import { prospectStatusLabels, type ProspectPriority, type ProspectStatus, type WebsiteState } from "@/lib/prospects/types";

const statusStyles: Record<ProspectStatus, string> = {
  not_contacted: "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
  messaged: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  replied: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  audit_booked: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
  audit_done: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200",
  proposal: "bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-200",
  won: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  lost: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
  not_fit: "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

const pill = "inline-flex rounded-full px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide";

export function ProspectStatusBadge({ status }: { status: ProspectStatus }) {
  return <span className={`${pill} ${statusStyles[status]}`}>{prospectStatusLabels[status]}</span>;
}

export function ProspectPriorityBadge({ priority }: { priority: ProspectPriority }) {
  const style = priority === "A"
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
    : "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200";
  return <span className={`${pill} ${style}`}>Priority {priority}</span>;
}

export function WebsiteStateBadge({ state }: { state: WebsiteState | null }) {
  if (!state) return null;
  const styles: Record<WebsiteState, string> = {
    none: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
    weak: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-200",
    ok: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  };
  const labels: Record<WebsiteState, string> = { none: "No site", weak: "Weak site", ok: "Site ok" };
  return <span className={`${pill} ${styles[state]}`}>{labels[state]}</span>;
}

/** 14 Oct, from a YYYY-MM-DD string, without any time zone shift. */
export function formatDay(date: string | null): string {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}
