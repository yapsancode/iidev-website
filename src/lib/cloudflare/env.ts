let providedDb: D1Database | null = null;

/**
 * Hands the database to code that runs outside the website: the Claude connector Worker and the tests.
 * The website never calls this, so it keeps asking OpenNext for the binding.
 */
export function provideDb(db: D1Database | null): void {
  providedDb = db;
}

export async function getCloudflareEnv() {
  // Loaded only when needed, so a plain Worker can use the data code without OpenNext.
  const { getCloudflareContext } = await import("@opennextjs/cloudflare");
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) throw new Error("Cloudflare D1 binding DB is not configured.");
  return env;
}

export async function getDb(): Promise<D1Database> {
  if (providedDb) return providedDb;
  return (await getCloudflareEnv()).DB;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
