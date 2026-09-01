import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";
import { budgetBands, timelineBands } from "./types";

const optionalShortText = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((value) => value || undefined);

export const leadSubmissionSchema = z.object({
  submissionId: z.uuid(),
  fullName: z.string().trim().min(2).max(100),
  businessName: optionalShortText,
  whatsapp: z.string().trim().min(7).max(30),
  email: z.union([z.email().max(160), z.literal("")]).optional().transform((value) => value || undefined),
  budget: z.enum(budgetBands).optional(),
  timeline: z.enum(timelineBands).optional(),
  enquiry: z.string().trim().min(15).max(4000),
  serviceContext: optionalShortText,
  sourcePage: z.string().trim().max(500).optional(),
  referrer: z.string().trim().max(500).optional(),
  utm: z.record(z.string().max(50), z.string().max(200)).optional().default({}),
  consent: z.literal(true),
  companyWebsite: z.string().max(200).optional(),
});

export function normalizeWhatsapp(value: string): string | null {
  const phone = parsePhoneNumberFromString(value, "MY");
  return phone?.isValid() ? phone.number : null;
}
