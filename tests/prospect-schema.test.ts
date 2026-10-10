import { describe, expect, it } from "vitest";
import { isAuthorizedSalesRequest } from "../src/lib/prospects/api-auth";
import { prospectCreateSchema, prospectImportSchema, prospectPatchSchema } from "../src/lib/prospects/schema";

const token = "t".repeat(40);

describe("prospect input", () => {
  it("fills safe defaults for a minimal new prospect", () => {
    const parsed = prospectCreateSchema.parse({ business_name: "  DR Renovation  " });
    expect(parsed).toMatchObject({ business_name: "DR Renovation", category: "Other", priority: "B", status: "not_contacted" });
  });

  it("turns empty strings into no value", () => {
    const parsed = prospectCreateSchema.parse({ business_name: "X", area: "  ", website: "", audit_date: "" });
    expect(parsed.area).toBeNull();
    expect(parsed.website).toBeNull();
    expect(parsed.audit_date).toBeNull();
  });

  it("rejects a status that does not exist", () => {
    expect(prospectCreateSchema.safeParse({ business_name: "X", status: "Messaged" }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ status: "contacted" }).success).toBe(false);
  });

  it("rejects dates that are not real and scores out of range", () => {
    expect(prospectPatchSchema.safeParse({ next_follow_up: "2026-02-30" }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ next_follow_up: "14 Oct" }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ mobile_score: 101 }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ google_reviews: -1 }).success).toBe(false);
  });

  it("only accepts http and https websites", () => {
    expect(prospectPatchSchema.safeParse({ website: "https://klinikmekar.com/" }).success).toBe(true);
    expect(prospectPatchSchema.safeParse({ website: "javascript:alert(1)" }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ website: "klinikmekar.com" }).success).toBe(false);
  });

  it("rejects unknown fields and empty patches", () => {
    expect(prospectPatchSchema.safeParse({ id: "something-else" }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ created_at: "2020-01-01" }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({}).success).toBe(false);
  });

  it("accepts an action or a note on its own", () => {
    expect(prospectPatchSchema.safeParse({ action: "mark_sent" }).success).toBe(true);
    expect(prospectPatchSchema.safeParse({ note: "Owner asked to call after 5pm" }).success).toBe(true);
    expect(prospectPatchSchema.safeParse({ action: "delete" }).success).toBe(false);
  });

  it("lets a patch clear a value with null", () => {
    const parsed = prospectPatchSchema.parse({ next_follow_up: null, top_finding: null });
    expect(parsed.next_follow_up).toBeNull();
    expect(parsed.top_finding).toBeNull();
    expect(parsed.status).toBeUndefined();
  });

  it("limits an import to a sane batch", () => {
    expect(prospectImportSchema.safeParse({ prospects: [] }).success).toBe(false);
    expect(prospectImportSchema.safeParse({ prospects: [{ business_name: "A" }, { business_name: "B" }] }).success).toBe(true);
    const tooMany = Array.from({ length: 201 }, (_, index) => ({ business_name: `Business ${index}` }));
    expect(prospectImportSchema.safeParse({ prospects: tooMany }).success).toBe(false);
  });
});

describe("sales API token", () => {
  it("accepts only the exact bearer token", () => {
    expect(isAuthorizedSalesRequest(`Bearer ${token}`, token)).toBe(true);
    expect(isAuthorizedSalesRequest(`Bearer ${token}x`, token)).toBe(false);
    expect(isAuthorizedSalesRequest(`Bearer ${token.slice(1)}`, token)).toBe(false);
    expect(isAuthorizedSalesRequest(token, token)).toBe(false);
    expect(isAuthorizedSalesRequest(`bearer ${token}`, token)).toBe(false);
  });

  it("rejects a missing header", () => {
    expect(isAuthorizedSalesRequest(null, token)).toBe(false);
    expect(isAuthorizedSalesRequest("", token)).toBe(false);
  });

  it("stays locked when the secret is missing or too short", () => {
    expect(isAuthorizedSalesRequest("Bearer ", undefined)).toBe(false);
    expect(isAuthorizedSalesRequest("Bearer ", "")).toBe(false);
    expect(isAuthorizedSalesRequest("Bearer short", "short")).toBe(false);
  });
});
