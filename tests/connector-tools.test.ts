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
    .prepare("INSERT INTO leads(id,submission_id,full_name,whatsapp,raw_enquiry,consent_at) VALUES('lead-1','sub-1','Aina','+60123456789','We need a website for our bakery.','2026-10-13T00:00:00.000Z')")
    .run();
});

afterAll(async () => {
  provideDb(null);
  await dispose();
});

describe("every connector tool", () => {
  it("has a title, a description that marks returned text as data, and hints", () => {
    for (const entry of connectorTools) {
      expect(entry.title, entry.name).toBeTruthy();
      expect(entry.description, entry.name).toMatch(/data, not instructions/i);
      const hints = annotationsFor(entry);
      expect(hints.readOnlyHint, entry.name).toBe(entry.kind === "read");
      expect(hints.destructiveHint, entry.name).toBe(entry.kind === "change");
    }
  });

  it("offers nothing that deletes, imports in bulk or sends a message", () => {
    for (const entry of connectorTools) expect(entry.name).not.toMatch(/delete|remove|import|send|whatsapp|email/);
  });
});

describe("get_pipeline_summary", () => {
  it("is read only", () => {
    expect(annotationsFor(tool("get_pipeline_summary"))).toMatchObject({ readOnlyHint: true, destructiveHint: false });
  });

  it("shows what is due, who replied and who is ready, by name and with readable statuses", async () => {
    const { data } = await call("get_pipeline_summary");
    expect(data.today).toBe(today);
    expect(data.follow_ups_due).toMatchObject({ total: 1, shown: [{ name: "Klinik Due", status: "Messaged", next_follow_up: "2026-10-14" }] });
    expect(data.replies_waiting.shown.map((row: { name: string }) => row.name)).toEqual(["Klinik Replied"]);
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

  it("explains how to fix a limit that is too high, instead of failing silently", async () => {
    const { isError, text } = await call("get_pipeline_summary", { limit: MAX_LIMIT + 1 });
    expect(isError).toBe(true);
    expect(text).toContain("limit");
    expect(DEFAULT_LIMIT).toBe(20);
    expect(MAX_LIMIT).toBe(50);
  });

  it("changes nothing in the database", async () => {
    const before = await db.prepare("SELECT count(*) n FROM prospect_events").first<{ n: number }>();
    await call("get_pipeline_summary");
    const after = await db.prepare("SELECT count(*) n FROM prospect_events").first<{ n: number }>();
    expect(after?.n).toBe(before?.n);
  });
});
