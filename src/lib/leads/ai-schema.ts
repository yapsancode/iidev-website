import { z } from "zod";
import { requestedServices } from "./types";

export const leadExtractionSchema = z.object({
  language: z.enum(["en", "ms", "mixed", "other"]),
  industry: z.string().nullable(),
  location: z.string().nullable(),
  requestedServices: z.array(z.enum(requestedServices)),
  summary: z.string(),
  businessGoals: z.array(z.string()),
  painPoints: z.array(z.string()),
  urgency: z.enum(["low", "medium", "high"]),
  estimatedScope: z.enum(["small", "medium", "large", "unknown"]),
  automationOpportunity: z.boolean(),
  riskFlags: z.array(z.string()),
  recommendedNextAction: z.enum([
    "schedule_discovery",
    "ask_clarifying_questions",
    "send_service_information",
    "manual_review",
    "not_a_fit",
  ]),
  confidence: z.number().min(0).max(1),
});
