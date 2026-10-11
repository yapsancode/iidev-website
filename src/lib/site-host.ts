const BARE_HOST = "iidevstudio.com";

/** True only for the bare domain itself. `www.` and any other subdomain must not match. */
export function isBareDomain(host: string | null): boolean {
  return (host || "").toLowerCase().replace(/:\d+$/, "") === BARE_HOST;
}
