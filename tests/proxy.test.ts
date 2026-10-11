import { describe, expect, it } from "vitest";
import { isBareDomain } from "../src/lib/site-host";

describe("bare domain redirect", () => {
  it("matches only the bare domain", () => {
    expect(isBareDomain("iidevstudio.com")).toBe(true);
    expect(isBareDomain("IIDevStudio.com")).toBe(true);
    expect(isBareDomain("iidevstudio.com:443")).toBe(true);
  });

  it("never matches www, which would loop forever", () => {
    expect(isBareDomain("www.iidevstudio.com")).toBe(false);
  });

  it("never matches other subdomains, look-alikes or local hosts", () => {
    expect(isBareDomain("cf-test.iidevstudio.com")).toBe(false);
    expect(isBareDomain("iidevstudio.com.evil.example")).toBe(false);
    expect(isBareDomain("notiidevstudio.com")).toBe(false);
    expect(isBareDomain("localhost:3000")).toBe(false);
    expect(isBareDomain(null)).toBe(false);
    expect(isBareDomain("")).toBe(false);
  });
});
