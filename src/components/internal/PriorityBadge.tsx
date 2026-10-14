import { Tag } from "@/components/internal/ui";
import type { LeadPriority } from "@/lib/leads/types";

const tones: Record<LeadPriority, "accent" | "neutral" | "outline" | "alert"> = {
  high: "accent",
  medium: "neutral",
  low: "outline",
  needs_review: "alert",
};

const labels: Record<LeadPriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
  needs_review: "Check by hand",
};

export function PriorityBadge({ priority, score }: { priority: LeadPriority; score?: number | null }) {
  return <Tag tone={tones[priority]}>{labels[priority]}{score !== undefined && score !== null ? <span className="tabular"> · {score}</span> : null}</Tag>;
}
