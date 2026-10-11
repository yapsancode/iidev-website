/**
 * Verifies the signed token Cloudflare Access attaches to every request it lets through
 * (`Cf-Access-Jwt-Assertion`). The plain `cf-access-authenticated-user-email` header can be
 * typed by anyone, so it is never trusted on its own.
 */

export interface AccessConfig {
  /** For example "iidev.cloudflareaccess.com". */
  teamDomain: string;
  /** The Application Audience (AUD) tag of the Access application. */
  audience: string;
}

type AccessKey = JsonWebKey & { kid?: string };
export type KeyLoader = (teamDomain: string) => Promise<AccessKey[]>;

interface AccessClaims {
  aud?: string | string[];
  email?: string;
  exp?: number;
  nbf?: number;
  iss?: string;
}

const KEY_CACHE_MS = 60 * 60 * 1000;
const keyCache = new Map<string, { keys: AccessKey[]; loadedAt: number }>();

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function decodeJson<T>(segment: string): T | null {
  try {
    return JSON.parse(new TextDecoder().decode(base64UrlToBytes(segment))) as T;
  } catch {
    return null;
  }
}

/** "https://team.cloudflareaccess.com/" and "team.cloudflareaccess.com" both become the bare host. */
export function normaliseTeamDomain(value: string): string {
  return value.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "").toLowerCase();
}

export const loadAccessKeys: KeyLoader = async (teamDomain) => {
  const cached = keyCache.get(teamDomain);
  if (cached && Date.now() - cached.loadedAt < KEY_CACHE_MS) return cached.keys;
  const response = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!response.ok) throw new Error(`Could not load Access keys (${response.status}).`);
  const body = (await response.json()) as { keys?: AccessKey[] };
  const keys = body.keys || [];
  keyCache.set(teamDomain, { keys, loadedAt: Date.now() });
  return keys;
};

/**
 * Returns the signed-in email when the token is genuine, meant for this application and not expired.
 * Returns null for anything else. Never throws.
 */
export async function verifyAccessToken(
  token: string | null | undefined,
  config: AccessConfig,
  loadKeys: KeyLoader = loadAccessKeys,
  now: number = Date.now(),
): Promise<string | null> {
  try {
    if (!token) return null;
    const teamDomain = normaliseTeamDomain(config.teamDomain);
    if (!teamDomain || !config.audience) return null;

    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const header = decodeJson<{ alg?: string; kid?: string }>(parts[0]);
    const claims = decodeJson<AccessClaims>(parts[1]);
    if (!header || !claims || header.alg !== "RS256" || !header.kid) return null;

    const key = (await loadKeys(teamDomain)).find((entry) => entry.kid === header.kid);
    if (!key) return null;
    const cryptoKey = await crypto.subtle.importKey("jwk", key, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
    const genuine = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      base64UrlToBytes(parts[2]),
      new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
    );
    if (!genuine) return null;

    const seconds = Math.floor(now / 1000);
    const audiences = Array.isArray(claims.aud) ? claims.aud : claims.aud ? [claims.aud] : [];
    if (!audiences.includes(config.audience)) return null;
    if (claims.iss !== `https://${teamDomain}`) return null;
    if (typeof claims.exp !== "number" || claims.exp <= seconds) return null;
    if (typeof claims.nbf === "number" && claims.nbf > seconds + 60) return null;
    if (typeof claims.email !== "string" || !claims.email.includes("@")) return null;
    return claims.email.toLowerCase();
  } catch {
    return null;
  }
}
