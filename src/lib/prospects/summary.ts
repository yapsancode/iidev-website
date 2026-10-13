import type { OutboundOverview } from "./data";
import { inProgressProspectStatuses, type ProspectRecord } from "./types";

/** The few fields a list needs. The full record stays behind `get`. */
export function briefProspect(prospect: ProspectRecord) {
  return {
    id: prospect.id,
    business_name: prospect.business_name,
    category: prospect.category,
    area: prospect.area,
    priority: prospect.priority,
    status: prospect.status,
    google_reviews: prospect.google_reviews,
    whatsapp: prospect.whatsapp,
    website_state: prospect.website_state,
    top_finding: prospect.top_finding,
    last_contact: prospect.last_contact,
    next_follow_up: prospect.next_follow_up,
    has_first_draft: Boolean(prospect.draft_first),
    has_followup_draft: Boolean(prospect.draft_followup),
  };
}

export type ProspectBrief = ReturnType<typeof briefProspect>;

/** Everything the daily pipeline review needs. Shared by the sales API and the Claude connector. */
export function buildPipelineSummary(overview: OutboundOverview) {
  return {
    today: overview.today,
    total: overview.total,
    counts: overview.counts,
    follow_ups_due: overview.due.map(briefProspect),
    replies_waiting: overview.replied.map(briefProspect),
    ready_to_message: overview.ready.map(briefProspect),
    in_progress: overview.prospects
      .filter((prospect) => inProgressProspectStatuses.includes(prospect.status))
      .map(briefProspect),
    gone_quiet: overview.goneQuiet.map(briefProspect),
    audit_next: overview.toAudit.slice(0, 5).map(briefProspect),
    to_audit_total: overview.toAudit.length,
    sent_last_7_days: overview.sentLast7Days,
    reply_rate: overview.replyRate,
    weekly: overview.weekly,
  };
}

export type PipelineSummary = ReturnType<typeof buildPipelineSummary>;
