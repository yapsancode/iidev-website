import { z } from "zod";
import { isValidDateString } from "./rules";
import { draftLanguages, prospectActions, prospectPriorities, prospectStatuses, websiteStates } from "./types";

/** Trimmed text where an empty string means "no value". */
function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .nullable()
    .optional()
    .transform((value) => (value === undefined ? undefined : value || null));
}

const optionalDate = z
  .union([z.string().trim().refine(isValidDateString, "Use a real date as YYYY-MM-DD."), z.literal(""), z.null()])
  .optional()
  .transform((value) => (value === undefined ? undefined : value || null));

const optionalWebsite = z
  .union([z.url({ protocol: /^https?$/ }).max(500), z.literal(""), z.null()])
  .optional()
  .transform((value) => (value === undefined ? undefined : value || null));

const optionalCount = (max: number) => z.number().int().min(0).max(max).nullable().optional();

const fields = {
  business_name: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(40),
  area: optionalText(120),
  phone: optionalText(40),
  /** Only needed when the WhatsApp number differs from `phone`. Otherwise it is worked out from `phone`. */
  whatsapp: optionalText(40),
  google_reviews: optionalCount(1_000_000),
  priority: z.enum(prospectPriorities),
  status: z.enum(prospectStatuses),
  website: optionalWebsite,
  website_state: z.enum(websiteStates).nullable().optional(),
  mobile_score: optionalCount(100),
  has_gbp: z.boolean().nullable().optional(),
  top_finding: optionalText(1000),
  suggested_angle: optionalText(1000),
  findings: optionalText(4000),
  draft_first: optionalText(2000),
  draft_followup: optionalText(2000),
  draft_language: z.enum(draftLanguages).nullable().optional(),
  audit_date: optionalDate,
  last_contact: optionalDate,
  next_follow_up: optionalDate,
  notes: optionalText(8000),
  source: z.string().trim().min(1).max(40).optional(),
};

export const prospectCreateSchema = z
  .object({
    ...fields,
    category: fields.category.default("Other"),
    priority: fields.priority.default("B"),
    status: fields.status.default("not_contacted"),
  })
  .strict();

/** Any subset of fields, plus an optional one-tap action and an optional note for the timeline. */
export const prospectPatchSchema = z
  .object({
    ...fields,
    business_name: fields.business_name.optional(),
    category: fields.category.optional(),
    priority: fields.priority.optional(),
    status: fields.status.optional(),
    action: z.enum(prospectActions).optional(),
    note: z.string().trim().min(1).max(4000).optional(),
  })
  .strict()
  .refine((value) => Object.values(value).some((entry) => entry !== undefined), "Nothing to change.");

export const prospectImportSchema = z.object({ prospects: z.array(prospectCreateSchema).min(1).max(200) }).strict();

type CreateOutput = z.infer<typeof prospectCreateSchema>;
/** Optional fields may be left out entirely, not only set to undefined. */
export type ProspectCreateInput = Partial<CreateOutput> & Pick<CreateOutput, "business_name" | "category" | "priority" | "status">;
export type ProspectPatchInput = Partial<z.infer<typeof prospectPatchSchema>>;
