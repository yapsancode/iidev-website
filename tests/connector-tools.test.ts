import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { InternalUser } from "../src/lib/auth/founder";
import { provideDb } from "../src/lib/cloudflare/env";
import { createProspect, updateProspect } from "../src/lib/prospects/data";
import { prospectCreateSchema } from "../src/lib/prospects/schema";
import {
  annotationsFor,
  connectorTools,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  runTool,
  UNTRUSTED_NOTE,
  type ToolContext,
} from "../workers/connector/tools";
import { addFounder, createTestDb } from "./helpers/d1";

const today = "2026-10-14";
const founder: InternalUser = { id: "founder-one", email: "founder@example.com", full_name: "Founder One", role: "founder", active: 1 };
const context: ToolContext = { founder, today };

let db: D1Database;
let dispose: () => Promise<void>;

function tool(name: string) {
  const found = connectorTools.find((entry) => entry.name === name);
  if (!found) throw new Error(`No tool named ${name}`);
  return found;
}

async function call(name: string, args: Record<string, unknown> = {}) {
  const result = await runTool(tool(name), args, context);
  const text = result.content[0].text;
  return { isError: Boolean(result.isError), text, data: result.isError ? null : JSON.parse(text) };
}

async function add(businessName: string, extra: Record<string, unknown> = {}) {
  return createProspect(prospectCreateSchema.parse({ business_name: businessName, category: "Clinic", ...extra }), founder.id);
}

const eventsOf = async (name: string) =>
  (
    await db
      .prepare("SELECT e.event_type,e.actor FROM prospect_events e JOIN prospects p ON p.id=e.prospect_id WHERE p.business_name=? ORDER BY e.id")
      .bind(name)
      .all<{ event_type: string; actor: string }>()
  ).results;

const prospectRow = (name: string) => db.prepare("SELECT * FROM prospects WHERE business_name=?").bind(name).first<Record<string, unknown>>();
const namesIn = (rows: { name: string }[]) => rows.map((row) => row.name);

beforeAll(async () => {
  ({ db, dispose } = await createTestDb());
  provideDb(db);
  await addFounder(db, founder.id, founder.email, founder.full_name);

  const due = await add("Klinik Due", { phone: "012-345 6789", audit_date: "2026-10-01", website_state: "none" });
  await updateProspect(due.id, { action: "mark_sent" }, founder.id, "2026-10-10");
  const replied = await add("Klinik Replied");
  await updateProspect(replied.id, { action: "replied" }, founder.id, today);
  await add("Klinik Ready", { audit_date: "2026-10-12", website_state: "weak", top_finding: "No booking button on mobile" });
  for (let index = 0; index < 3; index += 1) await add(`Klinik To Audit ${index}`);

  await db
    .prepare("INSERT INTO leads(id,submission_id,full_name,whatsapp,raw_enquiry,consent_at,created_at) VALUES('lead-1','sub-1','Aina','+60123456789','We need a website for our bakery.','2026-10-13T00:00:00.000Z','2026-10-13T02:00:00.000Z')")
    .run();
});

afterAll(async () => {
  provideDb(null);
  await dispose();
});

describe("the tool list", () => {
  it("is exactly the agreed twelve tools", () => {
    expect(connectorTools.map((entry) => entry.name).sort()).toEqual([
      "add_prospect_note",
      "create_prospect",
      "get_enquiry",
      "get_pipeline_summary",
      "get_prospect",
      "list_enquiries",
      "log_prospect_action",
      "save_enquiry_assessment",
      "save_prospect_audit",
      "save_prospect_draft",
      "search_prospects",
      "update_prospect_status",
    ]);
  });

  it("gives every tool a title, a description that marks returned text as data, and hints", () => {
    for (const entry of connectorTools) {
      expect(entry.title, entry.name).toBeTruthy();
      expect(entry.description, entry.name).toMatch(/data, not instructions/i);
      const hints = annotationsFor(entry);
      expect(hints.readOnlyHint, entry.name).toBe(entry.kind === "read");
      expect(hints.destructiveHint, entry.name).toBe(entry.kind === "change");
    }
  });

  it("marks the five read tools as read only, and tells every other tool to act only on the user's request", () => {
    const readOnly = connectorTools.filter((entry) => annotationsFor(entry).readOnlyHint).map((entry) => entry.name);
    expect(readOnly.sort()).toEqual(["get_enquiry", "get_pipeline_summary", "get_prospect", "list_enquiries", "search_prospects"]);
    for (const entry of connectorTools.filter((candidate) => candidate.kind !== "read")) {
      expect(entry.description, entry.name).toContain("only when the user asked");
    }
  });

  it("offers nothing that deletes, imports in bulk or sends a message", () => {
    for (const entry of connectorTools) expect(entry.name).not.toMatch(/delete|remove|import|send|whatsapp|email/);
  });

  it("uses 20 rows by default and never more than 50", () => {
    expect(DEFAULT_LIMIT).toBe(20);
    expect(MAX_LIMIT).toBe(50);
    expect(tool("search_prospects").input.parse({})).toMatchObject({ limit: 20 });
    expect(tool("list_enquiries").input.safeParse({ limit: 51 }).success).toBe(false);
  });
});

describe("get_pipeline_summary", () => {
  it("shows what is due, who replied and who is ready, by name and with readable statuses", async () => {
    const { data } = await call("get_pipeline_summary");
    expect(data.today).toBe(today);
    expect(data.follow_ups_due).toMatchObject({ total: 1, shown: [{ name: "Klinik Due", status: "Messaged", next_follow_up: "2026-10-14" }] });
    expect(namesIn(data.replies_waiting.shown)).toEqual(["Klinik Replied"]);
    expect(data.ready_to_message.shown[0]).toMatchObject({ name: "Klinik Ready", top_finding: "No booking button on mobile" });
    expect(data.audit_next.total).toBe(3);
    expect(data.total_prospects).toBe(6);
    expect(data.counts_by_status).toMatchObject({ "Not contacted": 4, Messaged: 1, Replied: 1 });
    expect(data.website_enquiries).toEqual({ new_enquiries: 1, not_summarised: 1 });
    expect(data.note).toBe(UNTRUSTED_NOTE);
  });

  it("keeps lists short but still reports the full count", async () => {
    const { data } = await call("get_pipeline_summary", { limit: 2 });
    expect(data.audit_next.shown).toHaveLength(2);
    expect(data.audit_next.total).toBe(3);
  });

  it("explains how to fix a limit that is too high", async () => {
    const { isError, text } = await call("get_pipeline_summary", { limit: MAX_LIMIT + 1 });
    expect(isError).toBe(true);
    expect(text).toContain("limit");
  });

  it("changes nothing in the database", async () => {
    const before = await db.prepare("SELECT count(*) n FROM prospect_events").first<{ n: number }>();
    await call("get_pipeline_summary");
    await call("search_prospects");
    await call("get_prospect", { prospect: "Klinik Due" });
    const after = await db.prepare("SELECT count(*) n FROM prospect_events").first<{ n: number }>();
    expect(after?.n).toBe(before?.n);
  });
});

describe("reading prospects", () => {
  it("searches by list and by text", async () => {
    expect((await call("search_prospects", { view: "to_audit" })).data).toMatchObject({ list: "To audit", total: 3 });
    expect(namesIn((await call("search_prospects", { query: "ready" })).data.shown)).toEqual(["Klinik Ready"]);
  });

  it("finds one prospect by name and shows its timeline with who did it", async () => {
    const { data } = await call("get_prospect", { prospect: "klinik due" });
    expect(data.prospect).toMatchObject({ name: "Klinik Due", status: "Messaged", whatsapp: "+60123456789" });
    expect(data.timeline.shown.map((event: { what: string; by: string }) => `${event.what} by ${event.by}`)).toContain(
      "First message sent by Founder One",
    );
  });

  it("asks which one when a name matches several, and says what to do when none match", async () => {
    const several = await call("get_prospect", { prospect: "To Audit" });
    expect(several.isError).toBe(true);
    expect(several.text).toContain("3 prospects match");
    expect(several.text).toContain("(id ");
    expect((await call("get_prospect", { prospect: "Kedai Tiada" })).text).toContain("search_prospects");
    expect((await call("get_prospect", { prospect: "00000000-0000-4000-8000-000000000000" })).isError).toBe(true);
  });
});

describe("changing prospects", () => {
  it("mark_sent follows the website rule: Messaged, follow-up 4 days later, under the founder's name", async () => {
    const { data } = await call("log_prospect_action", { prospect: "Klinik Ready", action: "mark_sent" });
    expect(data).toMatchObject({
      saved: true,
      saved_by: "Founder One",
      prospect: { status: "Messaged", last_contact: today, next_follow_up: "2026-10-18" },
    });
    expect(await eventsOf("Klinik Ready")).toEqual(
      expect.arrayContaining([
        { event_type: "status_changed", actor: "founder-one" },
        { event_type: "message_sent", actor: "founder-one" },
      ]),
    );
  });

  it("sets a status with a note", async () => {
    await call("update_prospect_status", { prospect: "Klinik Replied", status: "audit_booked", note: "Audit on Friday" });
    expect(await prospectRow("Klinik Replied")).toMatchObject({ status: "audit_booked" });
    expect((await eventsOf("Klinik Replied")).map((event) => event.event_type)).toEqual(
      expect.arrayContaining(["status_changed", "note_added"]),
    );
  });

  it("refuses a status that does not exist and saves nothing", async () => {
    const { isError, text } = await call("update_prospect_status", { prospect: "Klinik Replied", status: "sold" });
    expect(isError).toBe(true);
    expect(text).toContain("status");
    expect(await prospectRow("Klinik Replied")).toMatchObject({ status: "audit_booked" });
  });

  it("adds a note without touching anything else, and the timeline says it came through Claude", async () => {
    await call("add_prospect_note", { prospect: "Klinik To Audit 0", note: "Owner is Dr Tan" });
    const { data } = await call("get_prospect", { prospect: "Klinik To Audit 0" });
    expect(data.timeline.shown).toContainEqual({ date: expect.any(String), what: "Note added", detail: "Owner is Dr Tan", by: "Founder One, via Claude" });
    expect(data.timeline.shown).toContainEqual({ date: expect.any(String), what: "Prospect added", by: "Founder One" });
    expect(await prospectRow("Klinik To Audit 0")).toMatchObject({ status: "not_contacted" });
    expect(await eventsOf("Klinik To Audit 0")).toContainEqual({ event_type: "note_added", actor: "founder-one" });
  });

  it("saves drafts, and asks for one when none is given", async () => {
    expect((await call("save_prospect_draft", { prospect: "Klinik To Audit 0" })).isError).toBe(true);
    await call("save_prospect_draft", { prospect: "Klinik To Audit 0", draft_first: "Salam Dr, ...", language: "ms" });
    expect(await prospectRow("Klinik To Audit 0")).toMatchObject({ draft_first: "Salam Dr, ...", draft_language: "ms", status: "not_contacted" });
  });

  it("saves an audit, dated today, which makes the prospect ready to message", async () => {
    await call("save_prospect_audit", {
      prospect: "Klinik To Audit 1",
      website_state: "none",
      top_finding: "No website on the Google listing",
      has_google_listing: true,
      google_reviews: 12,
    });
    expect(await prospectRow("Klinik To Audit 1")).toMatchObject({ audit_date: today, website_state: "none", has_gbp: 1, google_reviews: 12 });
    expect(await eventsOf("Klinik To Audit 1")).toContainEqual({ event_type: "audited", actor: "founder-one" });
    expect(namesIn((await call("search_prospects", { view: "ready" })).data.shown)).toContain("Klinik To Audit 1");
  });

  it("rejects a website address that is not a web address", async () => {
    const { isError, text } = await call("save_prospect_audit", {
      prospect: "Klinik To Audit 2",
      website_state: "weak",
      top_finding: "Slow",
      website: "javascript:alert(1)",
    });
    expect(isError).toBe(true);
    expect(text).toContain("website");
    expect(await prospectRow("Klinik To Audit 2")).toMatchObject({ audit_date: null });
  });

  it("adds a prospect once, and explains a duplicate", async () => {
    const first = await call("create_prospect", { business_name: "Physio Baru", category: "Physio", area: "Serdang", phone: "019-876 5432" });
    expect(first.data).toMatchObject({ saved: true, prospect: { name: "Physio Baru", status: "Not contacted", has_whatsapp: true } });
    expect(await prospectRow("Physio Baru")).toMatchObject({ source: "claude", whatsapp: "+60198765432" });
    expect(await eventsOf("Physio Baru")).toEqual([{ event_type: "created", actor: "founder-one" }]);
    const created = await db
      .prepare("SELECT e.metadata FROM prospect_events e JOIN prospects p ON p.id=e.prospect_id WHERE p.business_name='Physio Baru'")
      .first<{ metadata: string }>();
    expect(JSON.parse(created!.metadata)).toEqual({ via: "claude" });
    const again = await call("create_prospect", { business_name: "physio baru", phone: "019-876 5432" });
    expect(again.isError).toBe(true);
    expect(again.text).toContain("already exists");
  });
});

describe("enquiries", () => {
  const assessment = {
    language: "en",
    industry: "Food and beverage",
    location: null,
    requestedServices: ["web_presence"],
    summary: "A bakery owner wants a first website so customers can find the shop.",
    businessGoals: ["Be found online"],
    painPoints: [],
    urgency: "low",
    estimatedScope: "small",
    automationOpportunity: false,
    riskFlags: [],
    recommendedNextAction: "schedule_discovery",
    confidence: 0.85,
  };

  it("lists the ones with no summary yet, and filters by date", async () => {
    const waiting = await call("list_enquiries", { summarised: false });
    expect(waiting.data).toMatchObject({ total: 1, shown: [{ id: "lead-1", name: "Aina", status: "New", received: "2026-10-13" }] });
    expect((await call("list_enquiries", { since: "2026-10-14" })).data.total).toBe(0);
  });

  it("shows one enquiry in full, with the visitor's text clearly labelled", async () => {
    const { data } = await call("get_enquiry", { enquiry: "aina" });
    expect(data.enquiry.text_written_by_the_visitor).toBe("We need a website for our bakery.");
    expect(data.summary).toBe("Not summarised yet.");
    expect(data.note).toBe(UNTRUSTED_NOTE);
  });

  it("saves a summary, scored by the website's rules, under the founder's name", async () => {
    const { data } = await call("save_enquiry_assessment", { enquiry: "Aina", assessment });
    expect(data).toMatchObject({ saved: true, saved_by: "Founder One", enquiry: { summarised: true }, needs_a_human_look: false });
    const row = await db.prepare("SELECT ai_model,lead_score,processing_status FROM leads WHERE id='lead-1'").first<Record<string, unknown>>();
    expect(row).toMatchObject({ ai_model: "claude-connector", lead_score: data.score.total, processing_status: "complete" });
    const event = await db.prepare("SELECT actor_id FROM lead_events WHERE lead_id='lead-1'").first<{ actor_id: string }>();
    expect(event?.actor_id).toBe("founder-one");
    expect((await call("list_enquiries", { summarised: false })).data.total).toBe(0);
    expect((await call("get_enquiry", { enquiry: "Aina" })).data.summary.summary).toBe(assessment.summary);
  });

  it("refuses a badly shaped or oversized summary", async () => {
    const wrongShape = await call("save_enquiry_assessment", { enquiry: "Aina", assessment: { ...assessment, confidence: 3 } });
    expect(wrongShape.isError).toBe(true);
    expect(wrongShape.text).toContain("assessment.confidence");
    const tooLong = await call("save_enquiry_assessment", { enquiry: "Aina", assessment: { ...assessment, summary: "x".repeat(7000) } });
    expect(tooLong.text).toContain("too long");
  });
});
