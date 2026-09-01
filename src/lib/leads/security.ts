import { createHmac } from "node:crypto";

export function isAllowedOrigin(origin: string | null, requestOrigin?: string): boolean {
  if (!origin) return process.env.NODE_ENV !== "production";
  const allowed = new Set<string>();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) allowed.add(new URL(siteUrl).origin);
  if (requestOrigin) allowed.add(requestOrigin);
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
  }
  return allowed.has(origin);
}

export function hashIp(ip: string): string {
  const salt = process.env.RATE_LIMIT_SALT || "local-development-only";
  return createHmac("sha256", salt).update(ip).digest("hex");
}
