import { describe, expect, it } from "vitest";
import { priorityForScore, scoreLead } from "../src/lib/leads/scoring";
import type { LeadExtraction } from "../src/lib/leads/types";

const strongExtraction: LeadExtraction = {
  language: "mixed",
  industry: "Healthcare",
  location: "Shah Alam",
  requestedServices: ["search_ready_website"],
  summary: "Dental clinic needs a search-ready website that consistently generates appointment bookings.",
  businessGoals: ["Increase bookings"],
  painPoints: ["Existing website generates no leads"],
  urgency: "medium",
  estimatedScope: "medium",
  automationOpportunity: true,
  riskFlags: [],
  recommendedNextAction: "schedule_discovery",
  confidence: 0.94,
};

describe("deterministic lead scoring", () => {
  it("scores a complete, well-fit lead without model-defined points", () => {
    const score = scoreLead({
      businessName: "ABC Dental", email: "aina@example.com", budget: "6k_10k",
      timeline: "1_3_months", extraction: strongExtraction,
    });
    expect(score).toEqual({ serviceFit: 30, budgetFit: 25, timeline: 20, clarity: 15, completeness: 10, total: 100 });
    expect(priorityForScore(score.total, strongExtraction.confidence)).toBe("high");
  });

  it("uses a neutral budget score when budget is unknown", () => {
    const score = scoreLead({ extraction: strongExtraction, budget: "not_sure" });
    expect(score.budgetFit).toBe(15);
  });

  it("forces manual review for low-confidence extraction", () => {
    expect(priorityForScore(92, 0.69)).toBe("needs_review");
  });

  it("removes service-fit points for suspected spam", () => {
    const score = scoreLead({ extraction: { ...strongExtraction, riskFlags: ["spam suspected"] } });
    expect(score.serviceFit).toBe(0);
  });
});
