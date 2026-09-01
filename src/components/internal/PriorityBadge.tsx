import type { LeadPriority } from "@/lib/leads/types";

const styles: Record<LeadPriority, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-200",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200",
  low: "bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
  needs_review: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-200",
};

export function PriorityBadge({ priority, score }: { priority: LeadPriority; score?: number | null }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide ${styles[priority]}`}>{priority.replace("_", " ")}{score !== undefined && score !== null ? ` · ${score}` : ""}</span>;
}
