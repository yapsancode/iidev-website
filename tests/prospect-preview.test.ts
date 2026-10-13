import { describe, expect, it } from "vitest";
import {
  isLinkPreviewFetch,
  isPreviewVisible,
  newPreviewToken,
  parsePreviewFindings,
  previewPath,
  shouldCountView,
  tokenFromRef,
} from "../src/lib/prospects/preview";
import { previewCopy, previewShareMessage } from "../src/lib/prospects/preview-copy";
import { prospectPatchSchema } from "../src/lib/prospects/schema";

const finding = { seen: "The Website button opens an error page.", check: "Tap Website on your Google listing." };

describe("preview findings", () => {
  it("accepts one to three findings and rejects more, fewer or extra fields", () => {
    expect(prospectPatchSchema.safeParse({ preview_findings: [finding] }).success).toBe(true);
    expect(prospectPatchSchema.safeParse({ preview_findings: [finding, finding, finding, finding] }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ preview_findings: [] }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ preview_findings: [{ ...finding, score: 3 }] }).success).toBe(false);
    expect(prospectPatchSchema.safeParse({ preview_findings: null }).success).toBe(true);
  });

  it("treats malformed stored findings as none", () => {
    expect(parsePreviewFindings(JSON.stringify([finding]))).toEqual([finding]);
    expect(parsePreviewFindings("{not json")).toBeNull();
    expect(parsePreviewFindings(JSON.stringify([{ seen: "x" }]))).toBeNull();
    expect(parsePreviewFindings(null)).toBeNull();
  });
});

describe("preview link", () => {
  it("builds a link with the name for trust and a token that cannot be guessed", () => {
    const token = newPreviewToken();
    expect(token).toMatch(/^[0-9a-f]{20}$/);
    expect(newPreviewToken()).not.toBe(token);
    const path = previewPath({ business_name: "DR Renovation & Co.", preview_token: token });
    expect(path).toBe(`/p/dr-renovation-co-${token}`);
    expect(tokenFromRef(path!.slice(3))).toBe(token);
    expect(previewPath({ business_name: "X", preview_token: null })).toBeNull();
  });

  it("does not read a token out of a link that has none", () => {
    expect(tokenFromRef("dr-renovation")).toBeNull();
    expect(tokenFromRef("0123456789abcdef012")).toBeNull();
    expect(tokenFromRef("../../internal")).toBeNull();
  });

  it("hides the page once a business asked us to stop or was ruled out", () => {
    const base = { preview_token: "a".repeat(20), preview_findings: [finding] };
    expect(isPreviewVisible({ ...base, status: "replied" })).toBe(true);
    expect(isPreviewVisible({ ...base, status: "lost" })).toBe(false);
    expect(isPreviewVisible({ ...base, status: "not_fit" })).toBe(false);
    expect(isPreviewVisible({ ...base, status: "replied", preview_token: null })).toBe(false);
    expect(isPreviewVisible({ ...base, status: "replied", preview_findings: null })).toBe(false);
  });
});

describe("preview views", () => {
  const now = new Date("2026-10-14T10:00:00Z");

  it("counts the first view and ignores a reload within the gap", () => {
    expect(shouldCountView(null, now)).toBe(true);
    expect(shouldCountView("2026-10-14T09:45:00Z", now)).toBe(false);
    expect(shouldCountView("2026-10-14T09:30:00Z", now)).toBe(true);
  });

  it("ignores the fetch WhatsApp makes to build the link card", () => {
    expect(isLinkPreviewFetch("WhatsApp/2.23.20.0 A")).toBe(true);
    expect(isLinkPreviewFetch("facebookexternalhit/1.1")).toBe(true);
    expect(isLinkPreviewFetch("Mozilla/5.0 (Linux; Android 14) Chrome/128.0 Mobile Safari/537.36")).toBe(false);
    expect(isLinkPreviewFetch(null)).toBe(false);
  });
});

describe("preview words", () => {
  it("never promises a ranking or names a client in either language", () => {
    for (const language of ["en", "ms"] as const) {
      const text = JSON.stringify(previewCopy(language)).toLowerCase();
      expect(text).not.toMatch(/guarantee|dijamin|klinik mekar/);
      expect(text).toContain("rm 500");
    }
  });

  it("writes the share message in the prospect's language", () => {
    expect(previewShareMessage("ms", "Klinik A", "https://x/p/1")).toContain("Terima kasih");
    expect(previewShareMessage(null, "Klinik A", "https://x/p/1")).toContain("https://x/p/1");
  });
});
