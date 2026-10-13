/** Where the hosted Claude apps (web, desktop, mobile) receive the sign-in result. */
export const CLAUDE_CALLBACK = "https://claude.ai/api/mcp/auth_callback";

/** The one permission this connector grants. Claude's own settings decide which tools may run. */
export const CONNECTOR_SCOPE = "iidev";

const LOOPBACK_HOSTS = ["localhost", "127.0.0.1"];

/**
 * Only Claude may finish a sign-in here: its hosted callback, or Claude Code's callback on this
 * computer (http://localhost:<any port>/callback). Everything else is refused, however the client
 * introduced itself.
 */
export function isAllowedRedirectUri(value: unknown): boolean {
  if (typeof value !== "string") return false;
  if (value === CLAUDE_CALLBACK) return true;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  return (
    url.protocol === "http:" &&
    LOOPBACK_HOSTS.includes(url.hostname) &&
    url.pathname === "/callback" &&
    !url.search &&
    !url.hash &&
    !url.username &&
    !url.password
  );
}

/** For self-registration: returns nothing to allow, or the reason to refuse. */
export function checkClientRegistration(
  clientMetadata: Record<string, unknown>,
): { description: string; status: number } | undefined {
  const redirectUris = clientMetadata.redirect_uris;
  if (Array.isArray(redirectUris) && redirectUris.length > 0 && redirectUris.every(isAllowedRedirectUri)) {
    return undefined;
  }
  return { description: "Only Claude can connect to this server.", status: 403 };
}

/** True for http://localhost and http://127.0.0.1 addresses, which only exist on a developer's computer. */
export function isLoopbackUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" && LOOPBACK_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}
