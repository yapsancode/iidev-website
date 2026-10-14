import { z } from "zod";
import { getDb } from "../../src/lib/cloudflare/env";
import { countEnquiriesWaiting } from "../../src/lib/leads/data";
import { createProspect, getOutboundOverview, getProspect, listProspects, loadProspects, updateProspect } from "../../src/lib/prospects/data";
import { todayInMalaysia, toMalaysiaDate } from "../../src/lib/prospects/rules";
import { prospectCreateSchema, prospectPatchSchema, type ProspectPatchInput } from "../../src/lib/prospects/schema";
import { briefProspect, buildPipelineSummary, type ProspectBrief } from "../../src/lib/prospects/summary";
import {
  draftLanguages,
  lostReasonLabels,
  lostReasons,
  objectionLabels,
  objections,
  prospectActions,
  prospectEventLabels,
  prospectPriorities,
  prospectStatuses,
  prospectStatusLabels,
  prospectViewLabels,
  prospectViews,
  websiteStateLabels,
  websiteStates,
  type ProspectEvent,
  type ProspectRecord,
} from "../../src/lib/prospects/types";
import {
  compact,
  dateInput,
  defineTool,
  limitInput,
  pickOne,
  READ_ONLY,
  ToolError,
  UNTRUSTED_NOTE,
  UUID_PATTERN,
  WRITE_RULE,
  type ToolContext,
} from "./toolkit";

const prospectInput = z
  .string()
  .trim()
  .min(2)
  .max(160)
  .describe("The prospect's id from an earlier result, or its business name. The id is safest.");

const noteInput = z.string().trim().min(1).max(4000);

function prospectLine(prospect: ProspectBrief) {
  return compact({
    id: prospect.id,
    name: prospect.business_name,
    category: prospect.category,
    area: prospect.area,
    status: prospectStatusLabels[prospect.status],
    priority: prospect.priority,
    top_finding: prospect.top_finding,
    last_contact: prospect.last_contact,
    next_follow_up: prospect.next_follow_up,
    has_whatsapp: Boolean(prospect.whatsapp),
    has_first_draft: prospect.has_first_draft,
    has_followup_draft: prospect.has_followup_draft,
  });
}

function shortList(rows: ProspectBrief[], limit: number, total: number = rows.length) {
  return { total, shown: rows.slice(0, limit).map(prospectLine) };
}

function prospectDetails(prospect: ProspectRecord) {
  return compact({
    ...prospectLine(briefProspect(prospect)),
    phone: prospect.phone,
    whatsapp: prospect.whatsapp,
    google_reviews: prospect.google_reviews,
    website: prospect.website,
    website_state: prospect.website_state ? websiteStateLabels[prospect.website_state] : null,
    mobile_score: prospect.mobile_score,
    has_google_listing: prospect.has_gbp,
    audit_date: prospect.audit_date,
    suggested_angle: prospect.suggested_angle,
    findings: prospect.findings,
    draft_language: prospect.draft_language,
    draft_first: prospect.draft_first,
    draft_followup: prospect.draft_followup,
    notes: prospect.notes,
    lost_reason: prospect.lost_reason ? lostReasonLabels[prospect.lost_reason] : null,
    objection_heard: prospect.objection ? objectionLabels[prospect.objection] : null,
    message_version: prospect.message_variant,
    preview_page_findings: prospect.preview_findings,
    preview_link_created: Boolean(prospect.preview_token),
    preview_times_opened: prospect.preview_token ? prospect.preview_views : null,
    source: prospect.source,
  });
}

async function findProspect(wanted: string): Promise<ProspectRecord> {
  if (UUID_PATTERN.test(wanted)) {
    const found = await getProspect(wanted);
    if (!found) throw new ToolError(`No prospect has the id ${wanted}. Call search_prospects to find the right one.`);
    return found.prospect;
  }
  return pickOne(await loadProspects(), wanted, {
    kind: "prospect",
    searchTool: "search_prospects",
    names: (prospect) => [prospect.business_name],
    label: (prospect) => `${prospect.business_name}${prospect.area ? `, ${prospect.area}` : ""} (id ${prospect.id})`,
  });
}

/** The founder is the actor, and the timeline also shows the change came through Claude. */
const viaClaude = (context: ToolContext) => ({ id: context.founder.id, via: "claude" as const });

/** Applies a change through the website's own rules, under the founder's name. */
async function change(wanted: string, patch: ProspectPatchInput, context: ToolContext) {
  const prospect = await findProspect(wanted);
  const input = prospectPatchSchema.parse(patch);
  let saved: ProspectRecord | null;
  try {
    saved = await updateProspect(prospect.id, input, viaClaude(context), context.today ?? todayInMalaysia());
  } catch {
    throw new ToolError("Nothing was saved. Another prospect may already use this business name and phone.");
  }
  if (!saved) throw new ToolError("This prospect no longer exists. Call search_prospects to check.");
  return { saved: true, saved_by: context.founder.full_name, prospect: prospectLine(briefProspect(saved)) };
}

async function founderNames(): Promise<Map<string, string>> {
  const rows = await (await getDb()).prepare("SELECT id,full_name FROM internal_users").all<{ id: string; full_name: string }>();
  return new Map(rows.results.map((row) => [row.id, row.full_name]));
}

function timelineLine(event: ProspectEvent, names: Map<string, string>) {
  const person = names.get(event.actor) || "Founder";
  const metadata = event.metadata as { via?: string; from?: keyof typeof prospectStatusLabels; to?: keyof typeof prospectStatusLabels; body?: string; fields?: string[] };
  const detail =
    event.event_type === "status_changed" && metadata.to
      ? `${metadata.from ? prospectStatusLabels[metadata.from] : "?"} to ${prospectStatusLabels[metadata.to]}`
      : event.event_type === "note_added"
        ? metadata.body
        : event.event_type === "details_updated" && metadata.fields
          ? metadata.fields.join(", ")
          : null;
  return compact({
    date: toMalaysiaDate(event.created_at),
    what: prospectEventLabels[event.event_type] || event.event_type,
    detail,
    by:
      event.actor === "claude"
        ? "Claude Code"
        : event.actor === "prospect"
          ? "The prospect"
          : metadata.via === "claude"
            ? `${person}, via Claude`
            : person,
  });
}

const getPipelineSummary = defineTool({
  name: "get_pipeline_summary",
  title: "Pipeline summary",
  description: `The daily sales picture for IIDev Studio: follow-ups due today, replies waiting for an answer, prospects ready for a first message, who to audit next, counts by status and how many website enquiries are waiting. Use it for questions like "what is due today?". ${READ_ONLY}`,
  input: z.object({ limit: limitInput }),
  kind: "read",
  async run({ limit }, context) {
    const [overview, enquiries] = await Promise.all([getOutboundOverview(context.today), countEnquiriesWaiting()]);
    const summary = buildPipelineSummary(overview);
    return {
      today: summary.today,
      follow_ups_due: shortList(summary.follow_ups_due, limit),
      replies_waiting: shortList(summary.replies_waiting, limit),
      ready_to_message: shortList(summary.ready_to_message, limit),
      in_progress: shortList(summary.in_progress, limit),
      gone_quiet: shortList(summary.gone_quiet, limit),
      audit_next: shortList(summary.audit_next, limit, summary.to_audit_total),
      total_prospects: summary.total,
      counts_by_status: Object.fromEntries(summary.counts.map((entry) => [prospectStatusLabels[entry.status], entry.count])),
      sent_last_7_days: summary.sent_last_7_days,
      reply_rate: summary.reply_rate,
      website_enquiries: enquiries,
      note: UNTRUSTED_NOTE,
    };
  },
});

const searchProspects = defineTool({
  name: "search_prospects",
  title: "Search prospects",
  description: `Find outbound prospects (businesses we plan to contact) by list, by text or by category. Lists: ${prospectViews.map((view) => `${view} (${prospectViewLabels[view]})`).join(", ")}. ${READ_ONLY}`,
  input: z.object({
    view: z.enum(prospectViews).default("all").describe("Which list to look in."),
    query: z.string().trim().max(120).optional().describe("Text to look for in the business name, area, category or phone."),
    category: z.string().trim().max(40).optional().describe('Exact category, for example "Clinic", "Dental" or "Physio".'),
    limit: limitInput,
  }),
  kind: "read",
  async run({ view, query, category, limit }, context) {
    const rows = await listProspects({ view, query, category }, context.today ?? todayInMalaysia());
    return { list: prospectViewLabels[view], ...shortList(rows.map(briefProspect), limit), note: UNTRUSTED_NOTE };
  },
});

const getProspectTool = defineTool({
  name: "get_prospect",
  title: "Prospect details",
  description: `One prospect in full: contact details, audit findings, saved message drafts, notes and its timeline (latest 20 events). ${READ_ONLY}`,
  input: z.object({ prospect: prospectInput }),
  kind: "read",
  async run({ prospect: wanted }) {
    const prospect = await findProspect(wanted);
    const [found, names] = await Promise.all([getProspect(prospect.id), founderNames()]);
    const events = found?.events ?? [];
    return {
      prospect: prospectDetails(prospect),
      timeline: { total: events.length, shown: events.slice(0, 20).map((event) => timelineLine(event, names)) },
      note: UNTRUSTED_NOTE,
    };
  },
});

const logProspectAction = defineTool({
  name: "log_prospect_action",
  title: "Log a prospect action",
  description: `Record something the founder already did by hand. mark_sent: the first message was sent (sets status Messaged and plans the one follow-up). follow_up_sent: the follow-up was sent (no further follow-up is planned). replied: they replied (status Replied). not_fit: not a fit (status Not fit). ${WRITE_RULE}`,
  input: z.object({
    prospect: prospectInput,
    action: z.enum(prospectActions),
    objection: z.enum(objections).optional().describe(`With "replied": the main thing holding them back, if they said one. ${objections.map((value) => `${value} (${objectionLabels[value]})`).join(", ")}.`),
    note: noteInput.optional().describe("Optional note for the timeline."),
  }),
  kind: "change",
  run: ({ prospect, action, objection, note }, context) => change(prospect, { action, objection, note }, context),
});

const updateProspectStatus = defineTool({
  name: "update_prospect_status",
  title: "Set a prospect's status",
  description: `Move a prospect to another status: ${prospectStatuses.map((status) => `${status} (${prospectStatusLabels[status]})`).join(", ")}. For "message sent", "follow-up sent" or "they replied", use log_prospect_action instead, because it also sets the dates. ${WRITE_RULE}`,
  input: z.object({
    prospect: prospectInput,
    status: z.enum(prospectStatuses),
    lost_reason: z.enum(lostReasons).optional().describe(`Give this when the status is lost. ${lostReasons.map((value) => `${value} (${lostReasonLabels[value]})`).join(", ")}. asked_to_stop also means the business is never contacted again.`),
    note: noteInput.optional().describe("Optional note for the timeline, for example why."),
  }),
  kind: "change",
  run({ prospect, status, lost_reason, note }, context) {
    if (status === "lost" && !lost_reason) throw new ToolError("Nothing was saved. Give lost_reason when the status is lost.");
    return change(prospect, { status, lost_reason: status === "lost" ? lost_reason : undefined, note }, context);
  },
});

const addProspectNote = defineTool({
  name: "add_prospect_note",
  title: "Add a note to a prospect",
  description: `Add one note to a prospect's timeline. Earlier notes stay. ${WRITE_RULE}`,
  input: z.object({ prospect: prospectInput, note: noteInput }),
  kind: "add",
  run: ({ prospect, note }, context) => change(prospect, { note }, context),
});

const saveProspectDraft = defineTool({
  name: "save_prospect_draft",
  title: "Save a message draft",
  description: `Save the draft of the first WhatsApp message, the follow-up, or both, on a prospect. It replaces the draft saved before. The founder reads it and sends it by hand. ${WRITE_RULE}`,
  input: z.object({
    prospect: prospectInput,
    draft_first: z.string().trim().min(1).max(2000).optional().describe("The first message."),
    draft_followup: z.string().trim().min(1).max(2000).optional().describe("The follow-up, sent about 4 days later if there is no reply."),
    language: z.enum(draftLanguages).optional().describe("ms for Bahasa Melayu, en for English."),
    message_version: z.string().trim().min(1).max(40).optional().describe('Short label of the first-message version, for example "v2-no-price". Used to compare reply rates.'),
  }),
  kind: "change",
  run({ prospect, draft_first, draft_followup, language, message_version }, context) {
    if (!draft_first && !draft_followup) throw new ToolError("Nothing was saved. Give draft_first, draft_followup, or both.");
    return change(prospect, { draft_first, draft_followup, draft_language: language, message_variant: message_version }, context);
  },
});

const saveProspectAudit = defineTool({
  name: "save_prospect_audit",
  title: "Save audit findings",
  description: `Save what an audit of a prospect's Google listing and website found. It replaces the findings saved before. Only save findings that were actually checked. ${WRITE_RULE}`,
  input: z.object({
    prospect: prospectInput,
    website_state: z.enum(websiteStates).describe("none: no website. weak: a website that brings little. ok: the website is fine."),
    top_finding: z.string().trim().min(1).max(1000).describe("The one specific problem a customer would notice first."),
    findings: z.string().trim().max(4000).optional().describe("All findings, in plain language."),
    suggested_angle: z.string().trim().max(1000).optional().describe("How to open the first message."),
    website: z.string().trim().max(500).optional().describe("The website address, starting with http:// or https://."),
    mobile_score: z.number().int().min(0).max(100).optional().describe("Mobile speed score, 0 to 100."),
    has_google_listing: z.boolean().optional(),
    google_reviews: z.number().int().min(0).optional().describe("Number of Google reviews seen today."),
    audit_date: dateInput.optional().describe("Defaults to today in Malaysia."),
    page_findings: z
      .array(z.object({ seen: z.string().trim().min(1).max(400), check: z.string().trim().min(1).max(300) }))
      .min(1)
      .max(3)
      .optional()
      .describe("The findings as the business owner will read them on their private preview page, top finding first. seen: what a customer sees, in plain words, with no fix and no price. check: how the owner can check it themselves. Only findings checked today. The founder creates the link by hand."),
  }),
  kind: "change",
  run({ prospect, has_google_listing, audit_date, page_findings, ...fields }, context) {
    return change(prospect, { ...fields, preview_findings: page_findings, has_gbp: has_google_listing, audit_date: audit_date ?? context.today ?? todayInMalaysia() }, context);
  },
});

const createProspectTool = defineTool({
  name: "create_prospect",
  title: "Add a prospect",
  description: `Add one new business to the prospect list, with status Not contacted. Check with search_prospects first that it is not there already. ${WRITE_RULE}`,
  input: z.object({
    business_name: z.string().trim().min(1).max(160),
    category: z.string().trim().min(1).max(40).default("Other").describe('For example "Clinic", "Dental", "Physio", "Tuition".'),
    area: z.string().trim().max(120).optional().describe('Town or area, for example "Seri Kembangan".'),
    phone: z.string().trim().max(40).optional().describe("As shown on the Google listing. A Malaysian mobile number also becomes the WhatsApp number."),
    website: z.string().trim().max(500).optional().describe("Starting with http:// or https://."),
    google_reviews: z.number().int().min(0).optional(),
    priority: z.enum(prospectPriorities).default("B").describe("A for the best fits, B for the rest."),
    notes: z.string().trim().max(8000).optional(),
  }),
  kind: "add",
  async run(args, context) {
    const input = prospectCreateSchema.parse({ ...args, source: "claude" });
    try {
      const prospect = await createProspect(input, viaClaude(context));
      return { saved: true, saved_by: context.founder.full_name, prospect: prospectLine(briefProspect(prospect)) };
    } catch {
      throw new ToolError("Nothing was saved. A prospect with this business name and phone already exists. Call search_prospects to find it.");
    }
  },
});

export const prospectTools = [
  getPipelineSummary,
  searchProspects,
  getProspectTool,
  logProspectAction,
  updateProspectStatus,
  addProspectNote,
  saveProspectDraft,
  saveProspectAudit,
  createProspectTool,
];
