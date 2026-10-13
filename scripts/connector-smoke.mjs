// Walks the whole Claude sign-in against a connector running on this computer, then calls one tool.
// Start the connector first with `npm run dev:connector`, then run: node scripts/connector-smoke.mjs
import { createHash, randomBytes } from "node:crypto";

const base = process.argv[2] || "http://127.0.0.1:8788";
const redirectUri = "https://claude.ai/api/mcp/auth_callback";
const check = (ok, label) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}`);
  if (!ok) process.exitCode = 1;
};
const mcp = (token, body) =>
  fetch(`${base}/mcp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json, text/event-stream",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
const readRpc = async (response) => {
  const text = await response.text();
  const line = text.startsWith("{") ? text : text.split("\n").find((entry) => entry.startsWith("data:"))?.slice(5);
  return JSON.parse(line);
};

// 1. Signed out: refused, with a pointer to the sign-in details.
const signedOut = await mcp(null, { jsonrpc: "2.0", id: 1, method: "tools/list" });
const challenge = signedOut.headers.get("www-authenticate") || "";
check(signedOut.status === 401, "a signed-out call gets 401");
const metadataUrl = challenge.match(/resource_metadata="([^"]+)"/)?.[1];
check(Boolean(metadataUrl), "the 401 points to the resource metadata");

const resource = await (await fetch(metadataUrl)).json();
check(resource.resource === `${base}/mcp`, `resource is exactly ${base}/mcp`);
const server = await (await fetch(`${resource.authorization_servers[0]}/.well-known/oauth-authorization-server`)).json();
check(server.code_challenge_methods_supported?.includes("S256"), "PKCE S256 is supported");
check(
  server.client_id_metadata_document_supported === true && server.token_endpoint_auth_methods_supported.includes("none"),
  "Claude's client metadata document is supported",
);

check((await mcp("not-a-real-token", { jsonrpc: "2.0", id: 1, method: "tools/list" })).status === 401, "a made-up token gets 401");

// 2. Registration: only Claude's callback addresses.
const register = (redirect_uris) =>
  fetch(server.registration_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_name: "Smoke test", redirect_uris, token_endpoint_auth_method: "none" }),
  });
check((await register(["https://evil.example/callback"])).status === 403, "another site cannot register");
const client = await (await register([redirectUri])).json();
check(Boolean(client.client_id), "Claude's callback can register");

// 3. The sign-in page, then Allow.
const verifier = randomBytes(32).toString("base64url");
const authorizeUrl = new URL(server.authorization_endpoint);
authorizeUrl.search = new URLSearchParams({
  response_type: "code",
  client_id: client.client_id,
  redirect_uri: redirectUri,
  scope: "iidev offline_access",
  state: "smoke",
  resource: resource.resource,
  code_challenge: createHash("sha256").update(verifier).digest("base64url"),
  code_challenge_method: "S256",
}).toString();
const consent = await fetch(authorizeUrl);
const html = await consent.text();
check(consent.status === 200 && html.includes("signed in as"), "the sign-in page shows who is signed in");
const handle = html.match(/name="handle" value="([^"]+)"/)?.[1];
const cookie = consent.headers.getSetCookie().map((entry) => entry.split(";")[0]).join("; ");
const approved = await fetch(server.authorization_endpoint, {
  method: "POST",
  redirect: "manual",
  headers: { "Content-Type": "application/x-www-form-urlencoded", Cookie: cookie, Origin: base },
  body: new URLSearchParams({ handle: handle?.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code)) ?? "", decision: "approve" }),
});
const back = new URL(approved.headers.get("location") || "http://invalid");
check(`${back.origin}${back.pathname}` === redirectUri && back.searchParams.has("code"), "Allow sends a code back to Claude");

// 4. Code for tokens.
const tokens = await (
  await fetch(server.token_endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: back.searchParams.get("code"),
      redirect_uri: redirectUri,
      client_id: client.client_id,
      code_verifier: verifier,
      resource: resource.resource,
    }),
  })
).json();
check(Boolean(tokens.access_token), "the code is exchanged for an access token");
check(Boolean(tokens.refresh_token), "a refresh token is issued, so the sign-in lasts");

// 5. Signed in: list the tools and call one.
const initialize = await mcp(tokens.access_token, {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "smoke", version: "1" } },
});
check(initialize.status === 200, "initialize works with the token");
const tools = (await readRpc(await mcp(tokens.access_token, { jsonrpc: "2.0", id: 2, method: "tools/list" }))).result.tools;
console.log(`      tools: ${tools.map((tool) => tool.name).join(", ")}`);
check(tools.every((tool) => tool.title && tool.annotations), "every tool has a title and hints");
const call = await readRpc(
  await mcp(tokens.access_token, {
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: { name: "get_pipeline_summary", arguments: { limit: 2 } },
  }),
);
const summary = JSON.parse(call.result.content[0].text);
check(!call.result.isError && typeof summary.total_prospects === "number", "get_pipeline_summary answers");
console.log(`      today ${summary.today}, ${summary.total_prospects} prospects, ${summary.follow_ups_due.total} follow-ups due`);
