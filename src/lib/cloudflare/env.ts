import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getCloudflareEnv() {
  const { env } = await getCloudflareContext({ async: true });
  if (!env.DB) throw new Error("Cloudflare D1 binding DB is not configured.");
  return env;
}

export async function getDb(): Promise<D1Database> {
  return (await getCloudflareEnv()).DB;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}
