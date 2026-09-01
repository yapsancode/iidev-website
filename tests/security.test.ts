import { afterEach, describe, expect, it } from "vitest";
import { hashIp, isAllowedOrigin } from "../src/lib/leads/security";

const originalSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

afterEach(() => { process.env.NEXT_PUBLIC_SITE_URL = originalSiteUrl; });

describe("lead endpoint security helpers", () => {
  it("accepts only the configured production origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.iidevstudio.com";
    expect(isAllowedOrigin("https://www.iidevstudio.com")).toBe(true);
    expect(isAllowedOrigin("https://attacker.example")).toBe(false);
  });

  it("creates stable, non-plain-text IP identifiers", () => {
    process.env.RATE_LIMIT_SALT = "test-salt";
    const hash = hashIp("203.0.113.10");
    expect(hash).toHaveLength(64);
    expect(hash).not.toContain("203.0.113.10");
    expect(hashIp("203.0.113.10")).toBe(hash);
  });
});
