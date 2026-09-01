import { describe, expect, it } from "vitest";
import { buildWhatsAppUrl } from "../src/lib/leads/whatsapp";

describe("WhatsApp handoff", () => {
  it("includes the founder-readable context and enquiry", () => {
    const url = buildWhatsAppUrl({
      submissionId: "d9428888-122b-4f1f-a6c1-1f593d12bdef",
      fullName: "Aina",
      businessName: "ABC Dental",
      whatsapp: "+60123456789",
      enquiry: "We need a website that brings in appointment bookings.",
      serviceContext: "Search-Ready Website",
      budget: "3k_6k",
      timeline: "1_3_months",
    });
    const decoded = decodeURIComponent(url);
    expect(decoded).toContain("https://wa.me/601133506561");
    expect(decoded).toContain("ABC Dental");
    expect(decoded).toContain("RM3,000–6,000");
    expect(decoded).toContain("appointment bookings");
  });
});
