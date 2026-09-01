import { afterEach, describe, expect, it, vi } from "vitest";
import { sendLeadTelegramAlert } from "../src/lib/leads/telegram";
import type { LeadRecord } from "../src/lib/leads/types";

const lead = {
  id: "08b4535a-d0f2-4ad8-b916-e0b3ca123456",
  submission_id: "d9428888-122b-4f1f-a6c1-1f593d12bdef",
  created_at: "2026-08-30T00:00:00.000Z",
  updated_at: "2026-08-30T00:00:00.000Z",
  last_activity_at: "2026-08-30T00:00:00.000Z",
  full_name: "Aina & Sons",
  business_name: "Aina <Bakery>",
  whatsapp: "+60123456789",
  email: "aina@example.com",
  budget: "6k_10k",
  timeline: "one_month",
  raw_enquiry: "We need a bilingual ordering website for our bakery.",
  service_context: "Search-ready website",
  source_page: "/",
  referrer: null,
  utm: {},
  consent_at: "2026-08-30T00:00:00.000Z",
  status: "new",
  processing_status: "complete",
  priority: "high",
  lead_score: 84,
  score_breakdown: {
    serviceFit: 30,
    budgetFit: 20,
    timeline: 20,
    clarity: 9,
    completeness: 5,
    total: 84,
  },
  ai_extraction: {
    language: "mixed",
    industry: "Food and beverage",
    location: "Shah Alam",
    summary: "Needs a bilingual ordering website.",
    requestedServices: ["search_ready_website", "business_os"],
    businessGoals: ["Increase orders"],
    painPoints: ["Manual order handling"],
    urgency: "high",
    estimatedScope: "medium",
    automationOpportunity: true,
    riskFlags: [],
    recommendedNextAction: "schedule_discovery",
    confidence: 0.92,
  },
  ai_confidence: 0.92,
  ai_model: "gpt-5.4-mini",
  ai_prompt_version: "v1",
  ai_input_tokens: 200,
  ai_output_tokens: 120,
  ai_latency_ms: 900,
  ai_error: null,
  processing_attempts: 1,
  telegram_status: "pending",
  telegram_sent_at: null,
  telegram_error: null,
  owner_id: null,
  retention_review_due: false,
} satisfies LeadRecord;

describe("Telegram lead alerts", () => {
  afterEach(() => {
    delete process.env.TELEGRAM_BOT_TOKEN;
    delete process.env.TELEGRAM_CHAT_ID;
    vi.unstubAllGlobals();
  });

  it("stays retryable when credentials are not configured", async () => {
    await expect(sendLeadTelegramAlert(lead)).resolves.toEqual({
      status: "not_configured",
      error: null,
    });
  });

  it("sends an escaped private-group alert with a secure dashboard link", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "-100123";
    process.env.NEXT_PUBLIC_SITE_URL = "https://iidevstudio.com";
    const fetchMock = vi.fn().mockResolvedValue(new Response("ok", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(sendLeadTelegramAlert(lead)).resolves.toEqual({ status: "sent", error: null });
    const [, request] = fetchMock.mock.calls[0];
    const payload = JSON.parse(request.body as string);

    expect(payload.chat_id).toBe("-100123");
    expect(payload.text).toContain("Aina &lt;Bakery&gt;");
    expect(payload.text).toContain("https://iidevstudio.com/internal/leads/08b4535a-d0f2-4ad8-b916-e0b3ca123456");
  });

  it("returns a bounded error when Telegram rejects the alert", async () => {
    process.env.TELEGRAM_BOT_TOKEN = "test-token";
    process.env.TELEGRAM_CHAT_ID = "-100123";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("forbidden", { status: 403 })));

    await expect(sendLeadTelegramAlert(lead)).resolves.toEqual({
      status: "failed",
      error: "forbidden",
    });
  });
});
