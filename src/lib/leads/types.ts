export const budgetBands = [
  "under_1k",
  "1k_3k",
  "3k_6k",
  "6k_10k",
  "10k_20k",
  "20k_plus",
  "not_sure",
] as const;

export const timelineBands = [
  "under_2_weeks",
  "one_month",
  "1_3_months",
  "3_6_months",
  "6_plus_months",
  "exploring",
] as const;

export const leadStatuses = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "won",
  "lost",
  "not_fit",
] as const;

export const processingStatuses = [
  "pending",
  "processing",
  "complete",
  "needs_review",
  "failed",
] as const;

export const leadPriorities = ["high", "medium", "low", "needs_review"] as const;

export const requestedServices = [
  "website_audit",
  "web_presence",
  "search_ready_website",
  "growth_retainer",
  "business_os",
  "other",
] as const;

export type BudgetBand = (typeof budgetBands)[number];
export type TimelineBand = (typeof timelineBands)[number];
export type LeadStatus = (typeof leadStatuses)[number];
export type ProcessingStatus = (typeof processingStatuses)[number];
export type LeadPriority = (typeof leadPriorities)[number];
export type RequestedService = (typeof requestedServices)[number];

export interface LeadSubmission {
  submissionId: string;
  fullName: string;
  whatsapp: string;
  enquiry: string;
  consent: true;
  businessName?: string;
  email?: string;
  budget?: BudgetBand;
  timeline?: TimelineBand;
  serviceContext?: string;
  sourcePage?: string;
  referrer?: string;
  utm?: Record<string, string>;
  companyWebsite?: string;
}

export interface LeadExtraction {
  language: "en" | "ms" | "mixed" | "other";
  industry: string | null;
  location: string | null;
  requestedServices: RequestedService[];
  summary: string;
  businessGoals: string[];
  painPoints: string[];
  urgency: "low" | "medium" | "high";
  estimatedScope: "small" | "medium" | "large" | "unknown";
  automationOpportunity: boolean;
  riskFlags: string[];
  recommendedNextAction:
    | "schedule_discovery"
    | "ask_clarifying_questions"
    | "send_service_information"
    | "manual_review"
    | "not_a_fit";
  confidence: number;
}

export interface ScoreBreakdown {
  serviceFit: number;
  budgetFit: number;
  timeline: number;
  clarity: number;
  completeness: number;
  total: number;
}

export interface LeadRecord {
  id: string;
  submission_id: string;
  created_at: string;
  updated_at: string;
  last_activity_at: string;
  full_name: string;
  business_name: string | null;
  whatsapp: string;
  email: string | null;
  budget: BudgetBand | null;
  timeline: TimelineBand | null;
  raw_enquiry: string;
  service_context: string | null;
  source_page: string | null;
  referrer: string | null;
  utm: Record<string, string>;
  consent_at: string;
  status: LeadStatus;
  processing_status: ProcessingStatus;
  priority: LeadPriority;
  lead_score: number | null;
  score_breakdown: ScoreBreakdown | null;
  ai_extraction: LeadExtraction | null;
  ai_confidence: number | null;
  ai_model: string | null;
  ai_prompt_version: string | null;
  ai_input_tokens: number | null;
  ai_output_tokens: number | null;
  ai_latency_ms: number | null;
  ai_error: string | null;
  processing_attempts: number;
  telegram_status: "pending" | "sent" | "failed" | "not_configured";
  telegram_sent_at: string | null;
  telegram_error: string | null;
  owner_id: string | null;
  retention_review_due: boolean;
}

export const budgetLabels: Record<BudgetBand, string> = {
  under_1k: "Below RM1,000",
  "1k_3k": "RM1,000–3,000",
  "3k_6k": "RM3,000–6,000",
  "6k_10k": "RM6,000–10,000",
  "10k_20k": "RM10,000–20,000",
  "20k_plus": "RM20,000+",
  not_sure: "Not sure yet",
};

export const timelineLabels: Record<TimelineBand, string> = {
  under_2_weeks: "Within 2 weeks",
  one_month: "Within 1 month",
  "1_3_months": "1–3 months",
  "3_6_months": "3–6 months",
  "6_plus_months": "6+ months",
  exploring: "Just exploring",
};

export const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal: "Proposal",
  won: "Won",
  lost: "Lost",
  not_fit: "Not a fit",
};
