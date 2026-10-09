import type { NextRequest } from "next/server";
import { json, rejectUnlessAuthorized } from "@/lib/prospects/api";
import { getOutboundOverview } from "@/lib/prospects/data";
import { inProgressProspectStatuses, type ProspectRecord } from "@/lib/prospects/types";

export const runtime = "nodejs";

function brief(prospect: ProspectRecord) {
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

/** GET: everything the daily pipeline review needs, in one call. */
export async function GET(request: NextRequest) {
  const denied = rejectUnlessAuthorized(request);
  if (denied) return denied;
  const overview = await getOutboundOverview();
  return json({
    today: overview.today,
    total: overview.total,
    counts: overview.counts,
    follow_ups_due: overview.due.map(brief),
    replies_waiting: overview.replied.map(brief),
    ready_to_message: overview.ready.map(brief),
    in_progress: overview.prospects.filter((prospect) => inProgressProspectStatuses.includes(prospect.status)).map(brief),
    gone_quiet: overview.goneQuiet.map(brief),
    audit_next: overview.toAudit.slice(0, 5).map(brief),
    to_audit_total: overview.toAudit.length,
    sent_last_7_days: overview.sentLast7Days,
    reply_rate: overview.replyRate,
    weekly: overview.weekly,
  });
}
