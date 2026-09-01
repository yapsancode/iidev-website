import { describe, expect, it } from "vitest";
import { leadSubmissionSchema, normalizeWhatsapp } from "../src/lib/leads/schema";

const validLead = {
  submissionId: "d9428888-122b-4f1f-a6c1-1f593d12bdef",
  fullName: "Aina Rahman",
  whatsapp: "+60 12-345 6789",
  enquiry: "I run a dental clinic and need a website that brings in bookings.",
  consent: true,
};

describe("lead submission validation", () => {
  it("accepts the three required lead fields", () => {
    expect(leadSubmissionSchema.safeParse(validLead).success).toBe(true);
  });

  it("rejects missing consent and short enquiries", () => {
    const result = leadSubmissionSchema.safeParse({ ...validLead, consent: false, enquiry: "Need site" });
    expect(result.success).toBe(false);
  });

  it("limits attribution fields", () => {
    const result = leadSubmissionSchema.safeParse({ ...validLead, sourcePage: "x".repeat(501) });
    expect(result.success).toBe(false);
  });
});

describe("WhatsApp normalization", () => {
  it("normalizes a Malaysian local number to E.164", () => {
    expect(normalizeWhatsapp("012-345 6789")).toBe("+60123456789");
  });

  it("rejects an invalid number", () => {
    expect(normalizeWhatsapp("123")).toBeNull();
  });
});
