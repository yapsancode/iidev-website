import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { provideDb } from "../src/lib/cloudflare/env";
import { createProspect, getProspect, importProspects, updateProspect } from "../src/lib/prospects/data";
import { previewCopy, previewProof } from "../src/lib/prospects/preview-copy";
import { prospectCreateSchema, prospectPatchSchema } from "../src/lib/prospects/schema";
import { countByField, replyRateBy } from "../src/lib/prospects/stats";
import { addFounder, createTestDb } from "./helpers/d1";

const actor = "founder-one";
let db: D1Database;
let dispose: () => Promise<void>;

const add = (name: string, extra: Record<string, unknown> = {}) =>
  createProspect(prospectCreateSchema.parse({ business_name: name, category: "Clinic", ...extra }), actor);

beforeAll(async () => {
  ({ db, dispose } = await createTestDb());
  provideDb(db);
  await addFounder(db, actor, "founder@example.com", "Founder One");
});

afterAll(async () => {
  provideDb(null);
  await dispose();
});

describe("asked to stop", () => {
  it("closes the prospect and cancels the follow-up", async () => {
    const prospect = await add("Klinik Stop", { phone: "012-345 6780" });
    await updateProspect(prospect.id, { action: "mark_sent" }, actor, "2026-10-14");
    const stopped = await updateProspect(prospect.id, { lost_reason: "asked_to_stop" }, actor);
    expect(stopped).toMatchObject({ status: "lost", lost_reason: "asked_to_stop", next_follow_up: null });
  });

  it("stays closed: no action, no reopening and no new draft", async () => {
    const prospect = await add("Klinik Stay Closed");
    await updateProspect(prospect.id, { lost_reason: "asked_to_stop" }, actor);
    await updateProspect(prospect.id, { action: "mark_sent" }, actor, "2026-10-14");
    await updateProspect(prospect.id, { status: "not_contacted", draft_first: "Hi again" }, actor);
    const after = (await getProspect(prospect.id))!.prospect;
    expect(after).toMatchObject({ status: "lost", lost_reason: "asked_to_stop", draft_first: null, next_follow_up: null });
  });

  it("is not brought back by a later import", async () => {
    const prospect = await add("Klinik Imported Again", { phone: "03-1234 5678" });
    await updateProspect(prospect.id, { lost_reason: "asked_to_stop" }, actor);
    const summary = await importProspects(
      [prospectCreateSchema.parse({ business_name: "Klinik Imported Again", phone: "03-1234 5678", category: "Clinic" })],
      actor,
    );
    expect(summary).toEqual({ created: 0, updated: 0, unchanged: 1 });
    expect((await getProspect(prospect.id))!.prospect.status).toBe("lost");
  });

  it("can be reopened only by a founder changing the reason first", async () => {
    const prospect = await add("Klinik Mistake");
    await updateProspect(prospect.id, { lost_reason: "asked_to_stop" }, actor);
    const reopened = await updateProspect(prospect.id, { lost_reason: null, status: "replied" }, actor);
    expect(reopened).toMatchObject({ status: "replied", lost_reason: null });
  });
});

describe("lost reasons and objections", () => {
  it("clears the lost reason when a prospect comes back", async () => {
    const prospect = await add("Klinik Back");
    await updateProspect(prospect.id, { status: "lost", lost_reason: "no_reply" }, actor);
    const back = await updateProspect(prospect.id, { action: "replied", objection: "price" }, actor, "2026-10-14");
    expect(back).toMatchObject({ status: "replied", lost_reason: null, objection: "price" });
  });

  it("rejects reasons and objections that are not on the list", () => {
    expect(prospectPatchSchema.safeParse({ lost_reason: "ghosted" }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ objection: "expensive" }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ message_variant: "x".repeat(41) }).success).toBe(false);
  });

  it("records the message version on the sent event", async () => {
    const prospect = await add("Klinik Version", { phone: "012-345 6781" });
    await updateProspect(prospect.id, { draft_first: "Hi", draft_language: "ms", message_variant: "v2-no-price" }, actor);
    await updateProspect(prospect.id, { action: "mark_sent" }, actor, "2026-10-14");
    const sent = (await getProspect(prospect.id))!.events.find((event) => event.event_type === "message_sent");
    expect(sent?.metadata).toEqual({ variant: "v2-no-price", language: "ms" });
  });
});

describe("reply rate by group", () => {
  const prospects = [
    { id: "a", message_variant: "v1" },
    { id: "b", message_variant: "v2" },
    { id: "c", message_variant: "v2" },
    { id: "d", message_variant: null },
    { id: "e", message_variant: "v2" },
  ];
  const events = [
    { prospect_id: "a", event_type: "message_sent", created_at: "2026-10-01T00:00:00Z" },
    { prospect_id: "b", event_type: "message_sent", created_at: "2026-10-01T00:00:00Z" },
    { prospect_id: "c", event_type: "message_sent", created_at: "2026-10-01T00:00:00Z" },
    { prospect_id: "d", event_type: "message_sent", created_at: "2026-10-01T00:00:00Z" },
    { prospect_id: "b", event_type: "reply_logged", created_at: "2026-10-02T00:00:00Z" },
    { prospect_id: "e", event_type: "reply_logged", created_at: "2026-10-02T00:00:00Z" },
  ];

  it("counts only businesses that were messaged, largest group first", () => {
    expect(replyRateBy(prospects, events, (prospect) => prospect.message_variant)).toEqual([
      { label: "v2", messaged: 2, replied: 1, percent: 50 },
      { label: "Not recorded", messaged: 1, replied: 0, percent: 0 },
      { label: "v1", messaged: 1, replied: 0, percent: 0 },
    ]);
  });

  it("counts field values and leaves out empty ones", () => {
    expect(countByField([{ o: "price" }, { o: null }, { o: "price" }, { o: "trust" }], (row) => row.o)).toEqual([
      { value: "price", count: 2 },
      { value: "trust", count: 1 },
    ]);
  });
});

describe("proof on the preview page", () => {
  it("shows the clinic to healthcare and adds our own product for others", () => {
    const copy = previewCopy("en");
    expect(previewProof(copy, "Dental")).toHaveLength(1);
    expect(previewProof(copy, "Renovation").join(" ")).toContain("KerjaKit");
    expect(previewProof(copy, null)).toHaveLength(2);
  });
});
