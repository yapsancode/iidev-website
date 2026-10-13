import { OAuthError, OAuthProvider, type OAuthHelpers } from "@cloudflare/workers-oauth-provider";
import { createMcpHandler } from "agents/mcp/server";
import { findActiveInternalUser } from "../../src/lib/auth/founder";
import { provideDb } from "../../src/lib/cloudflare/env";
import { handleAuthorize, type ConnectorProps } from "./authorize";
import { checkClientRegistration, CONNECTOR_SCOPE, isLoopbackUrl } from "./policy";
import { createServer } from "./server";

interface Env {
  DB: D1Database;
  /** Where the OAuth library keeps sign-ins. Tokens are stored only as hashes. */
  OAUTH_KV: KVNamespace;
  OAUTH_PROVIDER: OAuthHelpers;
  /** The exact address typed into Claude, for example https://mcp.iidevstudio.com/mcp. */
  CONNECTOR_URL: string;
  CF_ACCESS_TEAM_DOMAIN?: string;
  CF_ACCESS_AUD?: string;
  /** Local testing only. Ignored unless CONNECTOR_URL is a localhost address. */
  DEV_FOUNDER_EMAIL?: string;
}

const THIRTY_DAYS = 30 * 24 * 60 * 60;

function refuse(status: number, message: string): Response {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Everything under /mcp. The OAuth library has already checked the access token. */
const mcpHandler = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    provideDb(env.DB);
    const props = (ctx as ExecutionContext & { props?: Partial<ConnectorProps> }).props;
    // Checked on every call, so removing a founder from the database locks them out at once.
    const founder = await findActiveInternalUser(env.DB, props?.email);
    if (!founder) return refuse(403, "This account is not an active IIDev Studio founder.");
    const { hostname } = new URL(env.CONNECTOR_URL);
    return createMcpHandler(() => createServer({ founder }), {
      route: "/mcp",
      allowedHostnames: [hostname],
      authContext: { props: { email: founder.email, founderId: founder.id } },
    })(request, env, ctx);
  },
};

/** Everything else: the sign-in page, and nothing more. */
const defaultHandler = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);
    if (pathname === "/authorize") {
      provideDb(env.DB);
      return handleAuthorize(request, {
        oauth: env.OAUTH_PROVIDER,
        db: env.DB,
        access: { teamDomain: env.CF_ACCESS_TEAM_DOMAIN, audience: env.CF_ACCESS_AUD },
        devEmail: isLoopbackUrl(env.CONNECTOR_URL) && isLoopbackUrl(request.url) ? env.DEV_FOUNDER_EMAIL : undefined,
      });
    }
    if (pathname === "/") {
      return new Response("IIDev Studio connector for Claude. Add this server in Claude with the address ending in /mcp.", {
        headers: { "Content-Type": "text/plain; charset=utf-8", "X-Robots-Tag": "noindex" },
      });
    }
    return new Response("Not found", { status: 404 });
  },
};

function buildProvider(connectorUrl: string) {
  return new OAuthProvider<Env>({
    apiRoute: "/mcp",
    apiHandler: mcpHandler,
    defaultHandler,
    authorizeEndpoint: "/authorize",
    tokenEndpoint: "/oauth/token",
    // Claude introduces itself with a metadata document. Self-registration stays as a fallback,
    // limited to Claude's own callback addresses.
    clientRegistrationEndpoint: "/oauth/register",
    clientIdMetadataDocumentEnabled: true,
    clientRegistrationCallback: ({ clientMetadata }) => checkClientRegistration(clientMetadata),
    scopesSupported: [CONNECTOR_SCOPE, "offline_access"],
    requiredScopes: [CONNECTOR_SCOPE],
    resourceMetadata: {
      resource: connectorUrl,
      authorization_servers: [new URL(connectorUrl).origin],
      bearer_methods_supported: ["header"],
      resource_name: "IIDev Studio",
    },
    // A sign-in lasts while it is used, and ends after 30 days without use.
    refreshTokenIdleTTL: THIRTY_DAYS,
    async tokenExchangeCallback({ props, env }) {
      const founder = await findActiveInternalUser(env.DB, (props as Partial<ConnectorProps> | undefined)?.email);
      // invalid_grant makes the library delete this sign-in, so Claude has to connect again.
      if (!founder) throw new OAuthError("invalid_grant", { description: "This account is no longer a founder." });
    },
  });
}

let provider: { url: string; instance: ReturnType<typeof buildProvider> } | null = null;

const connectorWorker = {
  fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    if (!provider || provider.url !== env.CONNECTOR_URL) {
      provider = { url: env.CONNECTOR_URL, instance: buildProvider(env.CONNECTOR_URL) };
    }
    return provider.instance.fetch(request, env, ctx);
  },
};

export default connectorWorker;
