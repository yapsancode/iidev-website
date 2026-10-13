import type { AuthRequest, ConsentDescription, OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import { verifyAccessToken, type AccessConfig } from "../../src/lib/auth/access-jwt";
import { findActiveInternalUser, type InternalUser } from "../../src/lib/auth/founder";
import { CONNECTOR_SCOPE, isAllowedRedirectUri } from "./policy";

export interface AuthorizeDeps {
  oauth: OAuthHelpers;
  db: D1Database;
  /** Team domain and audience of the Access application that guards /authorize. */
  access: Partial<AccessConfig>;
  /** Local testing only. The caller passes it only when the connector itself runs on localhost. */
  devEmail?: string;
  verifyToken?: (token: string | null, config: AccessConfig) => Promise<string | null>;
}

/** What is stored with the sign-in. The email is checked against the database on every call. */
export interface ConnectorProps {
  email: string;
  founderId: string;
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);

function page(title: string, body: string, status: number, headers: Headers = new Headers()): Response {
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  if (!headers.has("Content-Security-Policy")) headers.set("Content-Security-Policy", "frame-ancestors 'none'");
  headers.set("X-Frame-Options", "DENY");
  const html = `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${escapeHtml(title)}</title>
<style>
  body{font-family:system-ui,sans-serif;background:#f5f5f4;color:#171717;margin:0;padding:24px;line-height:1.5}
  main{max-width:440px;margin:8vh auto;background:#fff;border-radius:20px;padding:28px}
  h1{font-size:20px;margin:0 0 12px}
  p{font-size:14px;margin:10px 0}
  .muted{color:#666}
  .warn{background:#fef3c7;border-radius:12px;padding:12px}
  .row{display:flex;gap:10px;margin-top:22px}
  button{flex:1;border:0;border-radius:12px;padding:13px;font-size:14px;font-weight:700;cursor:pointer}
  .allow{background:#171717;color:#fff}
  .deny{background:#e7e5e4;color:#171717}
</style>
<main>${body}</main>
</html>`;
  return new Response(html, { status, headers });
}

function refusal(title: string, message: string, status: number): Response {
  return page(title, `<h1>${escapeHtml(title)}</h1><p>${escapeHtml(message)}</p>`, status);
}

function consentPage(details: ConsentDescription, founder: InternalUser, handle: string): string {
  const publisher = details.clientDomain
    ? `It is published by <strong>${escapeHtml(details.clientDomain)}</strong>.`
    : "This app registered itself, so its name is not verified.";
  const loopback = details.redirectIsLoopback
    ? `<p class="warn"><strong>This sends access to an app on your computer.</strong> Continue only if you just started connecting from Claude Code.</p>`
    : "";
  return `<h1>Let ${escapeHtml(details.clientName)} use the IIDev sales data?</h1>
<p>You are signed in as <strong>${escapeHtml(founder.full_name)}</strong> (${escapeHtml(founder.email)}).</p>
<p>${publisher} Access will be sent to <strong>${escapeHtml(details.redirectHost)}</strong>.</p>
${loopback}
<p>It will be able to read prospects and website enquiries, and to change them when you approve a change in Claude. It cannot send messages and cannot delete anything.</p>
<p class="muted">Changes are saved under your name.</p>
<form method="post">
  <input type="hidden" name="handle" value="${escapeHtml(handle)}">
  <div class="row">
    <button class="deny" name="decision" value="deny">Cancel</button>
    <button class="allow" name="decision" value="approve">Allow</button>
  </div>
</form>`;
}

/**
 * Who is at the keyboard. The only proof accepted is the signed token Cloudflare Access adds
 * after its login, plus an active row in `internal_users`. With Access not configured, nobody
 * gets through: the page stays locked rather than open.
 */
async function signedInFounder(request: Request, deps: AuthorizeDeps): Promise<InternalUser | null> {
  let email: string | null = deps.devEmail || null;
  if (!email) {
    const teamDomain = deps.access.teamDomain?.trim();
    const audience = deps.access.audience?.trim();
    if (!teamDomain || !audience) return refused("CF_ACCESS_TEAM_DOMAIN or CF_ACCESS_AUD is not set");
    const token = request.headers.get("cf-access-jwt-assertion");
    if (!token) return refused("no Cloudflare Access token on the request");
    email = await (deps.verifyToken || verifyAccessToken)(token, { teamDomain, audience });
    if (!email) return refused("the Access token did not match CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD");
  }
  return (await findActiveInternalUser(deps.db, email)) || refused("the signed-in email is not an active founder");
}

/** Says in the Worker log which check failed. Never logs the token, the email or a setting's value. */
function refused(reason: string): null {
  console.warn(`Sign-in refused: ${reason}.`);
  return null;
}

/** Errors the OAuth library raises for a bad request. Matched by shape, so tests need no Workers runtime. */
interface AuthorizationFailure {
  name: string;
  redirectTo?: string;
}

function asAuthorizationFailure(error: unknown): AuthorizationFailure | null {
  if (!(error instanceof Error)) return null;
  if (error.name !== "AuthorizationError" && error.name !== "CimdFetchError") return null;
  return error as AuthorizationFailure;
}

function grantedScopes(request: AuthRequest): string[] {
  const wanted = request.scope.filter((scope) => scope === CONNECTOR_SCOPE || scope === "offline_access");
  return wanted.includes(CONNECTOR_SCOPE) ? wanted : [CONNECTOR_SCOPE, ...wanted];
}

/** The sign-in page of the connector: GET shows the question, POST records the answer. */
export async function handleAuthorize(request: Request, deps: AuthorizeDeps): Promise<Response> {
  if (request.method !== "GET" && request.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, POST" } });
  }
  const founder = await signedInFounder(request, deps);
  if (!founder) {
    return refusal(
      "No access",
      "This page is only for IIDev Studio founders. If you are a founder, sign in with your founder email. If that still fails, your email is not on the founder list yet.",
      403,
    );
  }

  try {
    if (request.method === "GET") {
      const oauthRequest = await deps.oauth.parseAuthRequest(request);
      if (!isAllowedRedirectUri(oauthRequest.redirectUri)) {
        return refusal("Not allowed", "Only Claude can connect to this server.", 400);
      }
      const details = await deps.oauth.describeConsent(oauthRequest);
      const consent = await deps.oauth.beginConsent(oauthRequest);
      return page("Connect Claude to IIDev Studio", consentPage(details, founder, consent.handle), 200, consent.headers);
    }

    const form = await request.formData();
    const handle = String(form.get("handle") || "");
    if (form.get("decision") !== "approve") {
      const denied = await deps.oauth.denyConsent(request, handle);
      return new Response(null, { status: 302, headers: denied.headers });
    }
    const approved = await deps.oauth.approveConsent(request, handle);
    if (!isAllowedRedirectUri(approved.request.redirectUri)) {
      return refusal("Not allowed", "Only Claude can connect to this server.", 400);
    }
    const props: ConnectorProps = { email: founder.email.toLowerCase(), founderId: founder.id };
    const { redirectTo } = await deps.oauth.completeAuthorization({
      request: approved.request,
      // The library uses ":" as a separator in its storage keys.
      userId: founder.id.replaceAll(":", "_"),
      metadata: { email: props.email },
      scope: grantedScopes(approved.request),
      props,
    });
    approved.headers.set("Location", redirectTo);
    return new Response(null, { status: 302, headers: approved.headers });
  } catch (error) {
    const failure = asAuthorizationFailure(error);
    if (!failure) throw error;
    if (failure.redirectTo) return Response.redirect(failure.redirectTo, 302);
    return refusal(
      "This sign-in link did not work",
      "It may have expired or already been used. Go back to Claude and connect again.",
      400,
    );
  }
}
