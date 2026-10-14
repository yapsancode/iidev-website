import { describe, expect, it } from "vitest";
import { prospectPatchSchema } from "../src/lib/prospects/schema";
import { clinicWords, isHealthcare, mockupClinic, parseMockup, sampleClinic } from "../src/lib/sample/clinic";

describe("sample clinic website", () => {
  it("always says the clinic is not real, in both languages", () => {
    expect(sampleClinic("en").notice).toContain("not a real clinic");
    expect(sampleClinic("ms").notice).toContain("bukan klinik sebenar");
  });

  it("contains no invented doctors, reviews or guarantees", () => {
    for (const language of ["en", "ms"] as const) {
      const text = JSON.stringify([clinicWords(language), sampleClinic(language)]).toLowerCase();
      expect(text).not.toMatch(/dr\.? [a-z]|5 stars|guarantee|dijamin|number 1|nombor 1/);
    }
  });
});

describe("sketch for one prospect", () => {
  const prospect = { business_name: "Klinik Seri", area: "SS2", draft_language: "ms" as const };

  it("uses their name and details, and says it is only a sketch", () => {
    const site = mockupClinic(prospect, { services: ["Demam"], hours: "24 jam" });
    expect(site).toMatchObject({ name: "Klinik Seri", area: "SS2", language: "ms", services: ["Demam"], hours: "24 jam" });
    expect(site.notice).toContain("Bukan website sebenar");
  });

  it("falls back to placeholders for anything not given", () => {
    const site = mockupClinic({ ...prospect, area: null, draft_language: null }, {});
    expect(site.language).toBe("en");
    expect(site.area).toBe("your area");
    expect(site.services.length).toBeGreaterThan(0);
  });

  it("accepts only the known details", () => {
    expect(prospectPatchSchema.safeParse({ mockup: {} }).success).toBe(true);
    expect(prospectPatchSchema.safeParse({ mockup: null }).success).toBe(true);
    expect(prospectPatchSchema.safeParse({ mockup: { services: [] } }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ mockup: { logo: "x" } }).success).toBe(false);
    expect(parseMockup("{bad")).toBeNull();
    expect(parseMockup(JSON.stringify({ hours: "24 jam" }))).toEqual({ hours: "24 jam" });
  });

  it("is for healthcare only", () => {
    expect(isHealthcare("Clinic")).toBe(true);
    expect(isHealthcare("dental")).toBe(true);
    expect(isHealthcare("Renovation")).toBe(false);
    expect(isHealthcare(null)).toBe(false);
  });
});
