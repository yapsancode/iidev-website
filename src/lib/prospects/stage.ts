import { isDoNotContact, isDue, isReadyToMessage, isToAudit } from "./rules";
import { inProgressProspectStatuses, type ProspectRecord } from "./types";

/**
 * Where a prospect is in the outreach routine, and so what to do next.
 * Follows the order of the three sales skills: audit, write, send, follow up once, answer.
 */
export type ProspectStage =
  | "stopped"
  | "closed"
  | "to_audit"
  | "no_problem"
  | "needs_draft"
  | "ready"
  | "waiting"
  | "follow_up_due"
  | "follow_up_sent"
  | "replied"
  | "in_progress";

type Stageable = Pick<
  ProspectRecord,
  "status" | "audit_date" | "website_state" | "next_follow_up" | "last_contact" | "draft_first" | "lost_reason"
>;

export function stageOf(prospect: Stageable, today: string): ProspectStage {
  if (isDoNotContact(prospect)) return "stopped";
  switch (prospect.status) {
    case "won":
    case "lost":
    case "not_fit":
      return "closed";
    case "replied":
      return "replied";
    case "messaged":
      if (isDue(prospect, today)) return "follow_up_due";
      return prospect.next_follow_up ? "waiting" : "follow_up_sent";
    case "not_contacted":
      if (isToAudit(prospect)) return "to_audit";
      if (!isReadyToMessage(prospect)) return "no_problem";
      return prospect.draft_first ? "ready" : "needs_draft";
    default:
      return inProgressProspectStatuses.includes(prospect.status) ? "in_progress" : "closed";
  }
}

/** A few words on what comes next, for lists. */
export const stageLabels: Record<ProspectStage, string> = {
  stopped: "Do not contact",
  closed: "Closed",
  to_audit: "Audit first",
  no_problem: "No clear problem",
  needs_draft: "Needs a message",
  ready: "Ready to send",
  waiting: "Waiting for reply",
  follow_up_due: "Follow-up due",
  follow_up_sent: "Follow-up sent",
  replied: "Replied",
  in_progress: "In progress",
};

/** The steps shown at the top of a prospect page. */
export const journeySteps = ["Audit", "Write", "Send", "Follow up", "Reply", "Deal"] as const;

/** Index of the current step in `journeySteps`, or null when the prospect is closed. */
export function journeyIndex(stage: ProspectStage, status: ProspectRecord["status"]): number | null {
  switch (stage) {
    case "to_audit":
    case "no_problem":
      return 0;
    case "needs_draft":
      return 1;
    case "ready":
      return 2;
    case "waiting":
    case "follow_up_due":
      return 3;
    case "follow_up_sent":
    case "replied":
      return 4;
    case "in_progress":
      return 5;
    case "closed":
      return status === "won" ? journeySteps.length : null;
    default:
      return null;
  }
}

/** Whole days from one YYYY-MM-DD to another. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86_400_000);
}
