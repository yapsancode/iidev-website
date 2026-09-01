import type {
  BudgetBand,
  LeadExtraction,
  LeadPriority,
  RequestedService,
  ScoreBreakdown,
  TimelineBand,
} from "./types";

const budgetRank: Record<Exclude<BudgetBand, "not_sure">, number> = {
  under_1k: 0,
  "1k_3k": 1,
  "3k_6k": 2,
  "6k_10k": 3,
  "10k_20k": 4,
  "20k_plus": 5,
};

const serviceFloor: Record<RequestedService, number | null> = {
  website_audit: 0,
  web_presence: 1,
  search_ready_website: 2,
  growth_retainer: 1,
  business_os: 4,
  other: null,
};

const timelineScore: Record<TimelineBand, number> = {
  under_2_weeks: 12,
  one_month: 18,
  "1_3_months": 20,
  "3_6_months": 15,
  "6_plus_months": 5,
  exploring: 8,
};

interface ScoreInput {
  businessName?: string | null;
  email?: string | null;
  budget?: BudgetBand | null;
  timeline?: TimelineBand | null;
  extraction: LeadExtraction;
}

function calculateServiceFit(extraction: LeadExtraction): number {
  if (extraction.riskFlags.some((flag) => flag.toLowerCase().includes("spam"))) return 0;
  if (extraction.requestedServices.some((service) => service !== "other")) return 30;
  return extraction.requestedServices.includes("other") ? 15 : 5;
}

function calculateBudgetFit(budget: BudgetBand | null | undefined, services: RequestedService[]): number {
  if (!budget || budget === "not_sure") return 15;
  const floors = services.map((service) => serviceFloor[service]).filter((floor): floor is number => floor !== null);
  if (floors.length === 0) return 15;
  const required = Math.max(...floors);
  const actual = budgetRank[budget];
  if (actual >= required) return 25;
  if (actual === required - 1) return 10;
  return 0;
}

function calculateClarity(extraction: LeadExtraction): number {
  let facts = 0;
  if (extraction.summary.trim().length >= 40) facts += 1;
  if (extraction.industry) facts += 1;
  if (extraction.requestedServices.length > 0) facts += 1;
  if (extraction.businessGoals.length > 0 || extraction.painPoints.length > 0) facts += 1;
  if (extraction.estimatedScope !== "unknown") facts += 1;
  return Math.min(15, facts * 3);
}

export function scoreLead(input: ScoreInput): ScoreBreakdown {
  const serviceFit = calculateServiceFit(input.extraction);
  const budgetFit = calculateBudgetFit(input.budget, input.extraction.requestedServices);
  const timeline = input.timeline ? timelineScore[input.timeline] : 10;
  const clarity = calculateClarity(input.extraction);
  const optionalFields = [input.businessName, input.email, input.budget, input.timeline].filter(Boolean).length;
  const completeness = Math.round(optionalFields * 2.5);
  return {
    serviceFit,
    budgetFit,
    timeline,
    clarity,
    completeness,
    total: serviceFit + budgetFit + timeline + clarity + completeness,
  };
}

export function priorityForScore(score: number, confidence: number): LeadPriority {
  if (confidence < 0.7) return "needs_review";
  if (score >= 75) return "high";
  if (score >= 50) return "medium";
  return "low";
}
