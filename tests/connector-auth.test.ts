import type { AuthRequest, OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { findActiveInternalUser } from "../src/lib/auth/founder";
import { handleAuthorize, type AuthorizeDeps } from "../workers/connector/authorize";
import { checkClientRegistration, CLAUDE_CALLBACK, isAllowedRedirectUri, isLoopbackUrl } from "../workers/connector/policy";
import { addFounder, createTestDb } from "./helpers/d1";

let db: D1Database;
let dispose: () => Promise<void>;

beforeAll(async () => {
  ({ db, dispose } = await createTestDb());
  await addFounder(db, "founder-one", "Founder@Example.com", "Founder One");
  await addFounder(db, "founder-left", "left@example.com", "Former Founder", 0);
});
afterAll(() => dispose());

describe("who may finish a sign-in", () => {
  it("accepts Claude's hosted callback and Claude Code on this computer, on any port", () => {
    expect(isAllowedRedirectUri(CLAUDE_CALLBACK)).toBe(true);
    expect(isAllowedRedirectUri("http://localhost:3118/callback")).toBe(true);
    expect(isAllowedRedirectUri("http://127.0.0.1:52001/callback")).toBe(true);
  });

  it("refuses every other address, including look-alikes", () => {
    for (const uri of [
      "https://claude.ai/api/mcp/auth_callback/",
      "https://claude.ai.evil.example/api/mcp/auth_callback",
      "https://evil.example/callback",
      "https://localhost/callback",
      "http://localhost:3118/other",
      "http://localhost:3118/callback?next=https://evil.example",
      "http://user@localhost:3118/callback",
      "http://192.168.1.5:3118/callback",
      "cursor://anysphere.cursor-mcp/oauth/callback",
      "not a url",
      "",
      null,
    ]) {
      expect(isAllowedRedirectUri(uri), String(uri)).toBe(false);
    }
  });

  it("lets a client register only when all of its addresses are Claude's", () => {
    expect(checkClientRegistration({ redirect_uris: [CLAUDE_CALLBACK] })).toBeUndefined();
    expect(checkClientRegistration({ redirect_uris: [CLAUDE_CALLBACK, "https://evil.example/cb"] })?.status).toBe(403);
    expect(checkClientRegistration({ redirect_uris: [] })?.status).toBe(403);
    expect(checkClientRegistration({})?.status).toBe(403);
  });

  it("only treats real localhost addresses as local", () => {
    expect(isLoopbackUrl("http://127.0.0.1:8788/mcp")).toBe(true);
    expect(isLoopbackUrl("https://mcp.iidevstudio.com/mcp")).toBe(false);
    expect(isLoopbackUrl("http://localhost.evil.example/mcp")).toBe(false);
  });
});

describe("the founder list", () => {
  it("finds an active founder whatever the letter case of the email", async () => {
    expect((await findActiveInternalUser(db, "founder@example.com"))?.id).toBe("founder-one");
  });

  it("returns nobody for a switched-off founder, a stranger or no email", async () => {
    expect(await findActiveInternalUser(db, "left@example.com")).toBeNull();
    expect(await findActiveInternalUser(db, "stranger@example.com")).toBeNull();
    expect(await findActiveInternalUser(db, null)).toBeNull();
  });
});

const oauthRequest: AuthRequest = {
  responseType: "code",
  clientId: "https://claude.ai/oauth/client",
  redirectUri: CLAUDE_CALLBACK,
  scope: ["iidev", "offline_access", "something-else"],
  state: "state-1",
  codeChallenge: "challenge",
  codeChallengeMethod: "S256",
  resource: "https://mcp.iidevstudio.com/mcp",
};

function fakeOauth(request: AuthRequest = oauthRequest) {
  return {
    parseAuthRequest: vi.fn().mockResolvedValue(request),
    describeConsent: vi.fn().mockResolvedValue({
      clientId: request.clientId,
      clientName: "Claude <b>",
      clientDomain: "claude.ai",
      redirectUri: request.redirectUri,
      redirectHost: "claude.ai",
      redirectIsLoopback: false,
      scope: request.scope,
    }),
    beginConsent: vi.fn().mockResolvedValue({ handle: "handle-1", headers: new Headers({ "Set-Cookie": "__Host-oauth-consent=1" }) }),
    approveConsent: vi.fn().mockResolvedValue({ request, headers: new Headers() }),
    denyConsent: vi.fn().mockResolvedValue({ headers: new Headers({ Location: `${CLAUDE_CALLBACK}?error=access_denied` }) }),
    completeAuthorization: vi.fn().mockResolvedValue({ redirectTo: `${CLAUDE_CALLBACK}?code=abc` }),
  };
}

const access = { teamDomain: "iidev.cloudflareaccess.com", audience: "aud-1" };
const authorizeUrl = "https://mcp.iidevstudio.com/authorize?client_id=x";

function deps(oauth: ReturnType<typeof fakeOauth>, signedInAs: string | null, extra: Partial<AuthorizeDeps> = {}): AuthorizeDeps {
  return {
    oauth: oauth as unknown as OAuthHelpers,
    db,
    access,
    verifyToken: vi.fn().mockResolvedValue(signedInAs),
    ...extra,
  };
}

function get(): Request {
  return new Request(authorizeUrl, { headers: { "cf-access-jwt-assertion": "token" } });
}

function post(decision: string): Request {
  return new Request(authorizeUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "cf-access-jwt-assertion": "token" },
    body: new URLSearchParams({ handle: "handle-1", decision }),
  });
}

describe("the sign-in page", () => {
  it("refuses a visitor with no Cloudflare Access login, before reading the request", async () => {
    const oauth = fakeOauth();
    const response = await handleAuthorize(get(), deps(oauth, null));
    expect(response.status).toBe(403);
    expect(oauth.parseAuthRequest).not.toHaveBeenCalled();
  });

  it("refuses a request that carries no Access token at all", async () => {
    const settings = deps(fakeOauth(), "founder@example.com");
    const response = await handleAuthorize(new Request(authorizeUrl), settings);
    expect(response.status).toBe(403);
    expect(settings.verifyToken).not.toHaveBeenCalled();
  });

  it("ignores stray spaces around the Access settings", async () => {
    const settings = deps(fakeOauth(), "founder@example.com", { access: { teamDomain: ` ${access.teamDomain}
`, audience: ` ${access.audience}
` } });
    expect((await handleAuthorize(get(), settings)).status).toBe(200);
    expect(settings.verifyToken).toHaveBeenCalledWith("token", access);
  });

  it("stays locked when Cloudflare Access is not configured", async () => {
    const oauth = fakeOauth();
    const verifyToken = vi.fn().mockResolvedValue("founder@example.com");
    const response = await handleAuthorize(get(), deps(oauth, null, { access: {}, verifyToken }));
    expect(response.status).toBe(403);
    expect(verifyToken).not.toHaveBeenCalled();
  });

  it("checks the Access token against this application's team and audience", async () => {
    const oauth = fakeOauth();
    const settings = deps(oauth, "founder@example.com");
    await handleAuthorize(new Request(authorizeUrl, { headers: { "cf-access-jwt-assertion": "the-token" } }), settings);
    expect(settings.verifyToken).toHaveBeenCalledWith("the-token", access);
  });

  it("refuses an email that passed Access but is not a founder", async () => {
    const response = await handleAuthorize(get(), deps(fakeOauth(), "stranger@example.com"));
    expect(response.status).toBe(403);
  });

  it("refuses a founder who was switched off", async () => {
    const oauth = fakeOauth();
    expect((await handleAuthorize(get(), deps(oauth, "left@example.com"))).status).toBe(403);
    expect((await handleAuthorize(post("approve"), deps(oauth, "left@example.com"))).status).toBe(403);
    expect(oauth.completeAuthorization).not.toHaveBeenCalled();
  });

  it("shows a founder the question, with the app's name made safe", async () => {
    const response = await handleAuthorize(get(), deps(fakeOauth(), "founder@example.com"));
    const html = await response.text();
    expect(response.status).toBe(200);
    expect(response.headers.get("Set-Cookie")).toContain("__Host-oauth-consent");
    expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    expect(html).toContain("Founder One");
    expect(html).toContain("claude.ai");
    expect(html).not.toContain("<b>");
  });

  it("refuses a client that wants the answer sent somewhere other than Claude", async () => {
    const oauth = fakeOauth({ ...oauthRequest, redirectUri: "https://evil.example/callback" });
    const response = await handleAuthorize(get(), deps(oauth, "founder@example.com"));
    expect(response.status).toBe(400);
    expect(oauth.beginConsent).not.toHaveBeenCalled();
  });

  it("on Allow, stores the founder from the database and only the scopes this server knows", async () => {
    const oauth = fakeOauth();
    const response = await handleAuthorize(post("approve"), deps(oauth, "FOUNDER@example.com"));
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toBe(`${CLAUDE_CALLBACK}?code=abc`);
    expect(oauth.completeAuthorization).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: "founder-one",
        scope: ["iidev", "offline_access"],
        props: { email: "founder@example.com", founderId: "founder-one" },
      }),
    );
  });

  it("on Cancel, sends Claude a refusal and stores nothing", async () => {
    const oauth = fakeOauth();
    const response = await handleAuthorize(post("deny"), deps(oauth, "founder@example.com"));
    expect(response.status).toBe(302);
    expect(response.headers.get("Location")).toContain("error=access_denied");
    expect(oauth.completeAuthorization).not.toHaveBeenCalled();
  });

  it("shows a plain error, without redirecting, when the link is broken or expired", async () => {
    const oauth = fakeOauth();
    const broken = Object.assign(new Error("bad"), { name: "AuthorizationError" });
    oauth.parseAuthRequest.mockRejectedValue(broken);
    const response = await handleAuthorize(get(), deps(oauth, "founder@example.com"));
    expect(response.status).toBe(400);
    expect(response.headers.get("Location")).toBeNull();
  });

  it("uses the local test email only when the caller hands it over", async () => {
    const oauth = fakeOauth();
    const response = await handleAuthorize(get(), deps(oauth, null, { access: {}, devEmail: "founder@example.com" }));
    expect(response.status).toBe(200);
  });
});
