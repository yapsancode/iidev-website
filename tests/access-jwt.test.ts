import { beforeAll, describe, expect, it } from "vitest";
import { normaliseTeamDomain, verifyAccessToken, type KeyLoader } from "../src/lib/auth/access-jwt";

const config = { teamDomain: "iidev.cloudflareaccess.com", audience: "aud-of-the-internal-app" };
const now = Date.parse("2026-10-11T04:00:00Z");
const nowSeconds = Math.floor(now / 1000);

function base64Url(input: string | ArrayBuffer): string {
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

let signingKey: CryptoKey;
let otherKey: CryptoKey;
let loadKeys: KeyLoader;

async function sign(claims: Record<string, unknown>, options: { key?: CryptoKey; kid?: string; alg?: string } = {}) {
  const head = base64Url(JSON.stringify({ alg: options.alg || "RS256", kid: options.kid || "key-1", typ: "JWT" }));
  const body = base64Url(JSON.stringify(claims));
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", options.key || signingKey, new TextEncoder().encode(`${head}.${body}`));
  return `${head}.${body}.${base64Url(signature)}`;
}

const goodClaims = {
  aud: [config.audience],
  email: "Founder@Example.com",
  iss: `https://${config.teamDomain}`,
  exp: nowSeconds + 600,
  nbf: nowSeconds - 10,
};

beforeAll(async () => {
  const algorithm = { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" };
  const pair = await crypto.subtle.generateKey(algorithm, true, ["sign", "verify"]);
  const stranger = await crypto.subtle.generateKey(algorithm, true, ["sign", "verify"]);
  signingKey = pair.privateKey;
  otherKey = stranger.privateKey;
  const publicJwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
  loadKeys = async () => [{ ...publicJwk, kid: "key-1" }];
});

describe("Cloudflare Access token", () => {
  it("accepts a genuine token and returns the email in lower case", async () => {
    expect(await verifyAccessToken(await sign(goodClaims), config, loadKeys, now)).toBe("founder@example.com");
  });

  it("rejects a token signed by someone else", async () => {
    expect(await verifyAccessToken(await sign(goodClaims, { key: otherKey }), config, loadKeys, now)).toBeNull();
  });

  it("rejects a token whose contents were changed after signing", async () => {
    const [head, , signature] = (await sign(goodClaims)).split(".");
    const forged = base64Url(JSON.stringify({ ...goodClaims, email: "attacker@example.com" }));
    expect(await verifyAccessToken(`${head}.${forged}.${signature}`, config, loadKeys, now)).toBeNull();
  });

  it("rejects an unsigned token that claims no algorithm", async () => {
    const head = base64Url(JSON.stringify({ alg: "none", kid: "key-1" }));
    const body = base64Url(JSON.stringify(goodClaims));
    expect(await verifyAccessToken(`${head}.${body}.`, config, loadKeys, now)).toBeNull();
  });

  it("rejects a token meant for a different application", async () => {
    expect(await verifyAccessToken(await sign({ ...goodClaims, aud: ["another-app"] }), config, loadKeys, now)).toBeNull();
  });

  it("rejects a token from a different Access team", async () => {
    expect(await verifyAccessToken(await sign({ ...goodClaims, iss: "https://evil.cloudflareaccess.com" }), config, loadKeys, now)).toBeNull();
  });

  it("rejects an expired token", async () => {
    expect(await verifyAccessToken(await sign({ ...goodClaims, exp: nowSeconds - 1 }), config, loadKeys, now)).toBeNull();
  });

  it("rejects a token with an unknown key id", async () => {
    expect(await verifyAccessToken(await sign(goodClaims, { kid: "key-9" }), config, loadKeys, now)).toBeNull();
  });

  it("rejects a token without an email", async () => {
    const { email: _email, ...withoutEmail } = goodClaims;
    void _email;
    expect(await verifyAccessToken(await sign(withoutEmail), config, loadKeys, now)).toBeNull();
  });

  it("rejects missing, empty and malformed tokens", async () => {
    expect(await verifyAccessToken(null, config, loadKeys, now)).toBeNull();
    expect(await verifyAccessToken("", config, loadKeys, now)).toBeNull();
    expect(await verifyAccessToken("not-a-token", config, loadKeys, now)).toBeNull();
    expect(await verifyAccessToken("a.b.c", config, loadKeys, now)).toBeNull();
  });

  it("stays locked when the configuration is incomplete", async () => {
    const token = await sign(goodClaims);
    expect(await verifyAccessToken(token, { teamDomain: "", audience: config.audience }, loadKeys, now)).toBeNull();
    expect(await verifyAccessToken(token, { teamDomain: config.teamDomain, audience: "" }, loadKeys, now)).toBeNull();
  });

  it("stays locked when the keys cannot be loaded", async () => {
    const failing: KeyLoader = async () => { throw new Error("network down"); };
    expect(await verifyAccessToken(await sign(goodClaims), config, failing, now)).toBeNull();
  });

  it("accepts the team domain written with https and a trailing slash", async () => {
    expect(normaliseTeamDomain("https://IIDev.cloudflareaccess.com/")).toBe("iidev.cloudflareaccess.com");
    expect(await verifyAccessToken(await sign(goodClaims), { ...config, teamDomain: "https://iidev.cloudflareaccess.com/" }, loadKeys, now)).toBe("founder@example.com");
  });
});
