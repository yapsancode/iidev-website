import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";
import { provideDb } from "../src/lib/cloudflare/env";
import { CONNECTOR_MODEL, saveLeadAssessment } from "../src/lib/leads/assessment";
import { notifyNewLead } from "../src/lib/leads/processing";
import type { LeadExtraction } from "../src/lib/leads/types";
import { addFounder, createTestDb } from "./helpers/d1";

let db: D1Database;
let dispose: () => Promise<void>;

const extraction: LeadExtraction = {
  language: "mixed",
  industry: "Healthcare",
  location: "Serdang",
  requestedServices: ["search_ready_website"],
  summary: "A dental clinic in Serdang wants a new website that brings bookings from Google.",
  businessGoals: ["More bookings"],
  painPoints: ["Old site brings no enquiries"],
  urgency: "medium",
  estimatedScope: "medium",
  automationOpportunity: false,
  riskFlags: [],
  recommendedNextAction: "schedule_discovery",
  confidence: 0.9,
};

async function addLead(id: string) {
  await db
    .prepare(
      "INSERT INTO leads(id,submission_id,full_name,business_name,whatsapp,email,budget,timeline,raw_enquiry,consent_at) VALUES(?,?,?,?,?,?,?,?,?,?)",
    )
    .bind(id, `sub-${id}`, "Dr Lim", "Klinik Gigi Lim", "+60123456789", "lim@example.com", "3k_6k", "1_3_months", "We need a new website for our dental clinic.", "2026-10-13T00:00:00.000Z")
    .run();
}

const leadRow = (id: string) => db.prepare("SELECT * FROM leads WHERE id=?").bind(id).first<Record<string, unknown>>();

beforeAll(async () => {
  ({ db, dispose } = await createTestDb());
  provideDb(db);
  await addFounder(db, "founder-one", "founder@example.com", "Founder One");
});
afterEach(() => {
  delete process.env.TELEGRAM_BOT_TOKEN;
  delete process.env.TELEGRAM_CHAT_ID;
  vi.unstubAllGlobals();
});
afterAll(async () => {
  provideDb(null);
  await dispose();
});

describe("a new enquiry", () => {
  it("is alerted at once and stays marked as not yet summarised", async () => {
    await addLead("lead-new");
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "-100123";
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await notifyNewLead("lead-new");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toContain("api.telegram.org");
    const row = await leadRow("lead-new");
    expect(row).toMatchObject({ processing_status: "pending", telegram_status: "sent", ai_extraction: null, lead_score: null });
  });

  it("is still saved when Telegram is not set up", async () => {
    await addLead("lead-quiet");
    await notifyNewLead("lead-quiet");
    expect(await leadRow("lead-quiet")).toMatchObject({ processing_status: "pending", telegram_status: "not_configured" });
  });
});

describe("saving a summary", () => {
  it("stores it the way the old AI step did, scored by the website's own rules", async () => {
    await addLead("lead-1");
    const saved = await saveLeadAssessment("lead-1", extraction, "founder-one");

    // serviceFit 30 + budgetFit 25 + timeline 20 + clarity 15 + completeness 10
    expect(saved?.breakdown.total).toBe(100);
    expect(saved?.priority).toBe("high");
    const row = await leadRow("lead-1");
    expect(row).toMatchObject({
      lead_score: 100,
      priority: "high",
      processing_status: "complete",
      ai_model: CONNECTOR_MODEL,
      ai_confidence: 0.9,
      ai_error: null,
      processing_attempts: 1,
    });
    expect(JSON.parse(String(row?.ai_extraction)).summary).toBe(extraction.summary);
    const event = await db
      .prepare("SELECT actor_id,metadata FROM lead_events WHERE lead_id='lead-1' AND event_type='ai_processing_completed'")
      .first<{ actor_id: string; metadata: string }>();
    expect(event?.actor_id).toBe("founder-one");
    expect(JSON.parse(event!.metadata)).toMatchObject({ model: CONNECTOR_MODEL, score: 100, priority: "high" });
  });

  it("marks an unsure summary for review", async () => {
    await addLead("lead-2");
    const saved = await saveLeadAssessment("lead-2", { ...extraction, confidence: 0.5 }, "founder-one");
    expect(saved?.priority).toBe("needs_review");
    expect(await leadRow("lead-2")).toMatchObject({ processing_status: "needs_review" });
  });

  it("refuses a badly shaped summary and saves nothing", async () => {
    await addLead("lead-3");
    await expect(saveLeadAssessment("lead-3", { ...extraction, urgency: "now" }, "founder-one")).rejects.toBeInstanceOf(ZodError);
    expect(await leadRow("lead-3")).toMatchObject({ processing_status: "pending", ai_extraction: null });
  });

  it("returns nothing for an enquiry that does not exist", async () => {
    expect(await saveLeadAssessment("no-such-lead", extraction, "founder-one")).toBeNull();
  });
});
