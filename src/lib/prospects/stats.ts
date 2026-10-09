import { addDays, toMalaysiaDate } from "./rules";
import {
  prospectStatuses,
  websiteStates,
  type ProspectEvent,
  type ProspectRecord,
  type ProspectStatus,
  type WebsiteState,
} from "./types";

type StatusOnly = Pick<ProspectRecord, "status">;
type EventLike = Pick<ProspectEvent, "prospect_id" | "event_type" | "created_at">;

export interface StatusCount {
  status: ProspectStatus;
  count: number;
}

export interface CategoryBreakdown {
  category: string;
  total: number;
  byStatus: StatusCount[];
}

export interface WeekActivity {
  /** Monday of the week, YYYY-MM-DD, Malaysia time. */
  weekStart: string;
  sent: number;
  followUps: number;
  replies: number;
}

export interface ReplyRate {
  replied: number;
  messaged: number;
  /** Whole percent, or null when nobody has been messaged yet. */
  percent: number | null;
}

/** Every status in pipeline order, including the ones with zero. */
export function countByStatus(prospects: StatusOnly[]): StatusCount[] {
  const counts = new Map<ProspectStatus, number>();
  for (const prospect of prospects) counts.set(prospect.status, (counts.get(prospect.status) || 0) + 1);
  return prospectStatuses.map((status) => ({ status, count: counts.get(status) || 0 }));
}

/** One row per category, largest first, each split by status. */
export function categoryByStatus(prospects: Pick<ProspectRecord, "status" | "category">[]): CategoryBreakdown[] {
  const groups = new Map<string, StatusOnly[]>();
  for (const prospect of prospects) {
    const key = prospect.category || "Other";
    groups.set(key, [...(groups.get(key) || []), prospect]);
  }
  return [...groups.entries()]
    .map(([category, rows]) => ({
      category,
      total: rows.length,
      byStatus: countByStatus(rows).filter((entry) => entry.count > 0),
    }))
    .sort((a, b) => b.total - a.total || a.category.localeCompare(b.category));
}

/** Website state of prospects that have actually been audited. */
export function websiteStateOfAudited(
  prospects: Pick<ProspectRecord, "audit_date" | "website_state">[],
): { state: WebsiteState; count: number }[] {
  const audited = prospects.filter((prospect) => prospect.audit_date && prospect.website_state);
  return websiteStates.map((state) => ({
    state,
    count: audited.filter((prospect) => prospect.website_state === state).length,
  }));
}

/** Monday of the week that holds `date` (YYYY-MM-DD). */
export function weekStartOf(date: string): string {
  const day = new Date(`${date}T00:00:00Z`).getUTCDay(); // 0 = Sunday
  return addDays(date, day === 0 ? -6 : 1 - day);
}

/** The last `weeks` weeks ending with the current one, oldest first, zero-filled. */
export function weeklyActivity(events: EventLike[], today: string, weeks = 8): WeekActivity[] {
  const currentWeek = weekStartOf(today);
  const buckets = new Map<string, WeekActivity>();
  for (let index = weeks - 1; index >= 0; index -= 1) {
    const weekStart = addDays(currentWeek, -7 * index);
    buckets.set(weekStart, { weekStart, sent: 0, followUps: 0, replies: 0 });
  }
  for (const event of events) {
    const bucket = buckets.get(weekStartOf(toMalaysiaDate(event.created_at)));
    if (!bucket) continue;
    if (event.event_type === "message_sent") bucket.sent += 1;
    else if (event.event_type === "follow_up_sent") bucket.followUps += 1;
    else if (event.event_type === "reply_logged") bucket.replies += 1;
  }
  return [...buckets.values()];
}

/** Of the businesses we sent a first message to, how many replied. Counted per business, not per message. */
export function replyRate(events: EventLike[]): ReplyRate {
  const messaged = new Set<string>();
  const replied = new Set<string>();
  for (const event of events) {
    if (event.event_type === "message_sent") messaged.add(event.prospect_id);
    if (event.event_type === "reply_logged") replied.add(event.prospect_id);
  }
  const repliedAfterMessage = [...replied].filter((id) => messaged.has(id)).length;
  return {
    replied: repliedAfterMessage,
    messaged: messaged.size,
    percent: messaged.size === 0 ? null : Math.round((repliedAfterMessage / messaged.size) * 100),
  };
}

/** First messages and follow-ups sent in the last `days` days, counting today. */
export function sentInLastDays(events: EventLike[], today: string, days = 7): number {
  const from = addDays(today, -(days - 1));
  return events.filter((event) => {
    if (event.event_type !== "message_sent" && event.event_type !== "follow_up_sent") return false;
    const date = toMalaysiaDate(event.created_at);
    return date >= from && date <= today;
  }).length;
}

/**
 * Nine statuses are too many colours for one chart, so charts group them into five stages.
 * The order here is the stacking order.
 */
export const pipelineStages = ["waiting", "messaged", "talking", "won", "dropped"] as const;
export type PipelineStage = (typeof pipelineStages)[number];

export const pipelineStageLabels: Record<PipelineStage, string> = {
  waiting: "Not contacted",
  messaged: "Messaged",
  talking: "In conversation",
  won: "Won",
  dropped: "Lost or not fit",
};

export function stageOf(status: ProspectStatus): PipelineStage {
  if (status === "not_contacted") return "waiting";
  if (status === "messaged") return "messaged";
  if (status === "won") return "won";
  if (status === "lost" || status === "not_fit") return "dropped";
  return "talking";
}

export interface CategoryStageRow {
  category: string;
  total: number;
  stages: Record<PipelineStage, number>;
}

/** One row per category, largest first, counted by stage. */
export function categoryByStage(prospects: Pick<ProspectRecord, "status" | "category">[]): CategoryStageRow[] {
  return categoryByStatus(prospects).map((row) => {
    const stages: Record<PipelineStage, number> = { waiting: 0, messaged: 0, talking: 0, won: 0, dropped: 0 };
    for (const entry of row.byStatus) stages[stageOf(entry.status)] += entry.count;
    return { category: row.category, total: row.total, stages };
  });
}
