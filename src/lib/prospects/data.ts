import { getDb } from "@/lib/cloudflare/env";
import { serialize } from "@/lib/cloudflare/rows";
import {
  compareForAudit,
  isDoNotContact,
  isDue,
  isGoneQuiet,
  isReadyToMessage,
  isToAudit,
  matchesView,
  outcomeForAction,
  todayInMalaysia,
  toMalaysianMobile,
} from "./rules";
import { isPreviewVisible, newPreviewToken, parsePreviewFindings, shouldCountView } from "./preview";
import type { ProspectCreateInput, ProspectPatchInput } from "./schema";
import { countByStatus, replyRate, sentInLastDays, weeklyActivity } from "./stats";
import type { EventActor, ProspectEvent, ProspectEventType, ProspectRecord, ProspectView } from "./types";

/** Columns a create or update may write. SQL column names only ever come from this list. */
const WRITABLE_COLUMNS = [
  "business_name",
  "category",
  "area",
  "phone",
  "whatsapp",
  "google_reviews",
  "priority",
  "status",
  "website",
  "website_state",
  "mobile_score",
  "has_gbp",
  "top_finding",
  "suggested_angle",
  "findings",
  "draft_first",
  "draft_followup",
  "draft_language",
  "audit_date",
  "last_contact",
  "next_follow_up",
  "notes",
  "lost_reason",
  "message_variant",
  "objection",
  "preview_findings",
  "source",
] as const;
type WritableColumn = (typeof WRITABLE_COLUMNS)[number];
type ColumnValues = Partial<Record<WritableColumn, string | number | boolean | null>>;

/** Events that feed the charts. Loaded separately so stats never depend on the per-prospect limit. */
const ACTIVITY_EVENTS = ["message_sent", "follow_up_sent", "reply_logged"];

export interface ProspectFilters {
  view?: ProspectView;
  query?: string;
  category?: string;
}

interface PendingEvent {
  type: ProspectEventType;
  metadata?: Record<string, unknown>;
  /** YYYY-MM-DD. Only for history carried over by an import; stored as midday in Malaysia. */
  happenedOn?: string;
}

function hydrateProspect(row: Record<string, unknown>): ProspectRecord {
  return {
    ...row,
    has_gbp: row.has_gbp == null ? null : Boolean(row.has_gbp),
    preview_findings: parsePreviewFindings(row.preview_findings),
    preview_views: Number(row.preview_views ?? 0),
  } as ProspectRecord;
}

/** The value as the database stores it, so "did this change?" compares like with like. */
function storedValue(value: unknown): string | number | boolean | null {
  if (value == null) return null;
  return typeof value === "object" ? JSON.stringify(value) : (value as string | number | boolean);
}

function hydrateEvent(row: Record<string, unknown>): ProspectEvent {
  let metadata: Record<string, unknown> = {};
  try {
    metadata = typeof row.metadata === "string" ? JSON.parse(row.metadata) : {};
  } catch {
    metadata = {};
  }
  return {
    id: Number(row.id),
    prospect_id: String(row.prospect_id),
    actor: String(row.actor),
    event_type: String(row.event_type),
    created_at: String(row.created_at),
    metadata,
  };
}

function toColumn(value: string | number | boolean | null): string | number | null {
  return typeof value === "boolean" ? (value ? 1 : 0) : value;
}

function eventStatement(db: D1Database, prospectId: string, who: EventActor, event: PendingEvent) {
  const actor = typeof who === "string" ? who : who.id;
  const metadata = serialize(typeof who === "string" ? event.metadata || {} : { ...event.metadata, via: who.via });
  if (!event.happenedOn) {
    return db
      .prepare("INSERT INTO prospect_events(prospect_id,actor,event_type,metadata) VALUES(?,?,?,?)")
      .bind(prospectId, actor, event.type, metadata);
  }
  return db
    .prepare("INSERT INTO prospect_events(prospect_id,actor,event_type,metadata,created_at) VALUES(?,?,?,?,?)")
    .bind(prospectId, actor, event.type, metadata, `${event.happenedOn}T04:00:00.000Z`);
}

/**
 * A prospect imported as already messaged or replied happened before this system existed.
 * Recreate those moments on `last_contact` so reply rate and weekly charts stay true.
 */
function historyForImport(input: ProspectCreateInput): PendingEvent[] {
  if (!input.last_contact || input.status === "not_contacted" || input.status === "not_fit") return [];
  const history: PendingEvent[] = [{ type: "message_sent", happenedOn: input.last_contact, metadata: { imported: true } }];
  if (input.status !== "messaged" && input.status !== "lost") {
    history.push({ type: "reply_logged", happenedOn: input.last_contact, metadata: { imported: true } });
  }
  return history;
}

export async function loadProspects(): Promise<ProspectRecord[]> {
  const result = await (await getDb())
    .prepare("SELECT * FROM prospects ORDER BY created_at LIMIT 2000")
    .all<Record<string, unknown>>();
  return result.results.map(hydrateProspect);
}

export async function listProspects(
  filters: ProspectFilters = {},
  today: string = todayInMalaysia(),
): Promise<ProspectRecord[]> {
  const view = filters.view || "all";
  const query = filters.query?.trim().toLowerCase();
  const rows = (await loadProspects()).filter((prospect) => {
    if (!matchesView(prospect, view, today)) return false;
    if (filters.category && prospect.category !== filters.category) return false;
    if (!query) return true;
    return [prospect.business_name, prospect.area, prospect.category, prospect.phone]
      .filter(Boolean)
      .some((text) => String(text).toLowerCase().includes(query));
  });
  if (view === "due") return rows.sort((a, b) => (a.next_follow_up || "").localeCompare(b.next_follow_up || ""));
  return rows.sort(compareForAudit);
}

export async function getProspect(id: string): Promise<{ prospect: ProspectRecord; events: ProspectEvent[] } | null> {
  const db = await getDb();
  const [row, events] = await Promise.all([
    db.prepare("SELECT * FROM prospects WHERE id=?").bind(id).first<Record<string, unknown>>(),
    db
      .prepare("SELECT * FROM prospect_events WHERE prospect_id=? ORDER BY created_at DESC, id DESC LIMIT 100")
      .bind(id)
      .all<Record<string, unknown>>(),
  ]);
  if (!row) return null;
  return { prospect: hydrateProspect(row), events: events.results.map(hydrateEvent) };
}

export async function createProspect(
  input: ProspectCreateInput,
  actor: EventActor,
  eventType: ProspectEventType = "created",
): Promise<ProspectRecord> {
  const db = await getDb();
  const id = crypto.randomUUID();
  const values: ColumnValues = {};
  for (const column of WRITABLE_COLUMNS) {
    const value = input[column as keyof ProspectCreateInput];
    if (value !== undefined) values[column] = storedValue(value);
  }
  values.whatsapp = toMalaysianMobile(input.whatsapp) ?? toMalaysianMobile(input.phone);
  const columns = Object.keys(values) as WritableColumn[];
  await db.batch([
    db
      .prepare(`INSERT INTO prospects(id,${columns.join(",")}) VALUES(?,${columns.map(() => "?").join(",")})`)
      .bind(id, ...columns.map((column) => toColumn(values[column] ?? null))),
    eventStatement(db, id, actor, { type: eventType }),
    ...(eventType === "imported" ? historyForImport(input) : []).map((event) => eventStatement(db, id, actor, event)),
  ]);
  return (await getProspect(id))!.prospect;
}

/**
 * Applies field changes, an optional one-tap action and an optional note in one go,
 * and records what happened in the timeline. Returns null when the prospect does not exist.
 */
export async function updateProspect(
  id: string,
  input: ProspectPatchInput,
  actor: EventActor,
  today: string = todayInMalaysia(),
): Promise<ProspectRecord | null> {
  const db = await getDb();
  const existing = await getProspect(id);
  if (!existing) return null;
  const current = existing.prospect;
  const { action, note, whatsapp, ...fields } = input;

  const wanted: ColumnValues = {};
  for (const column of WRITABLE_COLUMNS) {
    const value = (fields as Record<string, unknown>)[column];
    if (value !== undefined) wanted[column] = storedValue(value);
  }
  if (whatsapp !== undefined || fields.phone !== undefined) {
    const phone = fields.phone !== undefined ? fields.phone : current.phone;
    wanted.whatsapp = toMalaysianMobile(whatsapp) ?? toMalaysianMobile(phone);
  }
  let outcome = action ? outcomeForAction(action, today) : null;
  if (wanted.lost_reason === "asked_to_stop") {
    // Asking us to stop closes the prospect, whatever else was sent with it.
    outcome = null;
    wanted.status = "lost";
    wanted.next_follow_up = null;
  } else if (isDoNotContact(current) && wanted.lost_reason === undefined) {
    // Still closed: no action, no reopening and no new drafts until a founder changes the reason.
    outcome = null;
    delete wanted.status;
    delete wanted.next_follow_up;
    delete wanted.draft_first;
    delete wanted.draft_followup;
  }
  if (outcome) Object.assign(wanted, outcome.patch);
  const nextStatus = wanted.status ?? current.status;
  if (nextStatus !== "lost" && current.lost_reason && wanted.lost_reason === undefined) wanted.lost_reason = null;

  const changed = (Object.keys(wanted) as WritableColumn[]).filter(
    (column) => wanted[column] !== storedValue((current as unknown as Record<string, unknown>)[column]),
  );

  const events: PendingEvent[] = [];
  if (changed.includes("status")) {
    events.push({ type: "status_changed", metadata: { from: current.status, to: wanted.status } });
  }
  if (outcome?.event === "message_sent") {
    events.push({
      type: "message_sent",
      metadata: {
        variant: wanted.message_variant ?? current.message_variant,
        language: wanted.draft_language ?? current.draft_language,
      },
    });
  } else if (outcome?.event) {
    events.push({ type: outcome.event, metadata: wanted.objection ? { objection: wanted.objection } : {} });
  }
  if (changed.includes("audit_date") && wanted.audit_date) events.push({ type: "audited" });
  if (
    (changed.includes("draft_first") && wanted.draft_first) ||
    (changed.includes("draft_followup") && wanted.draft_followup)
  ) {
    events.push({ type: "draft_saved", metadata: { language: wanted.draft_language ?? current.draft_language } });
  }
  if (note) events.push({ type: "note_added", metadata: { body: note } });
  if (changed.length > 0 && events.length === 0) events.push({ type: "details_updated", metadata: { fields: changed } });
  if (changed.length === 0 && events.length === 0) return current;

  const now = new Date().toISOString();
  const statements = events.map((event) => eventStatement(db, id, actor, event));
  const assignments = [...changed.map((column) => `${column}=?`), "updated_at=?", "last_activity_at=?"];
  statements.unshift(
    db
      .prepare(`UPDATE prospects SET ${assignments.join(",")} WHERE id=?`)
      .bind(...changed.map((column) => toColumn(wanted[column] ?? null)), now, now, id),
  );
  await db.batch(statements);
  return (await getProspect(id))!.prospect;
}

/** Creates the private link (or removes it). Only a founder does this, after reading the findings. */
export async function setPreviewPublished(id: string, published: boolean, actor: string): Promise<ProspectRecord | null> {
  const db = await getDb();
  const existing = await getProspect(id);
  if (!existing) return null;
  const current = existing.prospect;
  if (published === Boolean(current.preview_token)) return current;
  if (published && !current.preview_findings?.length) return current;
  const now = new Date().toISOString();
  await db.batch([
    db
      .prepare(
        "UPDATE prospects SET preview_token=?,preview_views=0,preview_first_viewed_at=NULL,preview_last_viewed_at=NULL,updated_at=? WHERE id=?",
      )
      .bind(published ? newPreviewToken() : null, now, id),
    eventStatement(db, id, actor, { type: published ? "preview_published" : "preview_removed" }),
  ]);
  return (await getProspect(id))!.prospect;
}

/** The prospect behind a preview link, or null when the link is unknown or switched off. */
export async function getProspectByPreviewToken(token: string): Promise<ProspectRecord | null> {
  const row = await (await getDb())
    .prepare("SELECT * FROM prospects WHERE preview_token=?")
    .bind(token)
    .first<Record<string, unknown>>();
  if (!row) return null;
  const prospect = hydrateProspect(row);
  return isPreviewVisible(prospect) ? prospect : null;
}

/** Counts one view: a number and two times, nothing about the visitor. Reloads within the gap are ignored. */
export async function recordPreviewView(token: string, now: Date = new Date()): Promise<boolean> {
  const prospect = await getProspectByPreviewToken(token);
  if (!prospect || !shouldCountView(prospect.preview_last_viewed_at, now)) return false;
  const db = await getDb();
  const at = now.toISOString();
  const statements = [
    db
      .prepare(
        "UPDATE prospects SET preview_views=preview_views+1,preview_first_viewed_at=coalesce(preview_first_viewed_at,?),preview_last_viewed_at=? WHERE id=?",
      )
      .bind(at, at, prospect.id),
  ];
  if (!prospect.preview_first_viewed_at) {
    statements.push(eventStatement(db, prospect.id, "prospect", { type: "preview_viewed" }));
  }
  await db.batch(statements);
  return true;
}

/** Adds new prospects and updates existing ones, matched on business name + phone. Safe to run twice. */
export async function importProspects(
  inputs: ProspectCreateInput[],
  actor: string,
): Promise<{ created: number; updated: number; unchanged: number }> {
  const db = await getDb();
  const summary = { created: 0, updated: 0, unchanged: 0 };
  for (const input of inputs) {
    const match = await db
      .prepare("SELECT id,updated_at,lost_reason FROM prospects WHERE lower(business_name)=lower(?) AND ifnull(phone,'')=?")
      .bind(input.business_name, input.phone ?? "")
      .first<{ id: string; updated_at: string; lost_reason: string | null }>();
    if (match?.lost_reason === "asked_to_stop") {
      summary.unchanged += 1;
      continue;
    }
    if (!match) {
      await createProspect(input, actor, "imported");
      summary.created += 1;
      continue;
    }
    const after = await updateProspect(match.id, input, actor);
    if (after && after.updated_at !== match.updated_at) summary.updated += 1;
    else summary.unchanged += 1;
  }
  return summary;
}

export async function loadActivityEvents(sinceDays = 120): Promise<ProspectEvent[]> {
  const since = new Date(Date.now() - sinceDays * 86_400_000).toISOString();
  const result = await (await getDb())
    .prepare(
      `SELECT * FROM prospect_events WHERE created_at>=? AND event_type IN (${ACTIVITY_EVENTS.map(() => "?").join(",")}) ORDER BY created_at`,
    )
    .bind(since, ...ACTIVITY_EVENTS)
    .all<Record<string, unknown>>();
  return result.results.map(hydrateEvent);
}

/** Everything the Home block, the Insights charts and the sales API summary need. */
export async function getOutboundOverview(today: string = todayInMalaysia()) {
  const [prospects, events] = await Promise.all([loadProspects(), loadActivityEvents()]);
  const due = prospects
    .filter((prospect) => isDue(prospect, today))
    .sort((a, b) => (a.next_follow_up || "").localeCompare(b.next_follow_up || ""));
  return {
    today,
    total: prospects.length,
    prospects,
    events,
    counts: countByStatus(prospects),
    due,
    replied: prospects.filter((prospect) => prospect.status === "replied"),
    ready: prospects.filter(isReadyToMessage).sort(compareForAudit),
    toAudit: prospects.filter(isToAudit).sort(compareForAudit),
    goneQuiet: prospects.filter((prospect) => isGoneQuiet(prospect, today)),
    sentLast7Days: sentInLastDays(events, today, 7),
    replyRate: replyRate(events),
    weekly: weeklyActivity(events, today, 8),
  };
}

export type OutboundOverview = Awaited<ReturnType<typeof getOutboundOverview>>;
