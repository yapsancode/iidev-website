import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/cloudflare/env";
import { verifyAccessToken } from "./access-jwt";

export interface InternalUser {
  id: string;
  email: string;
  full_name: string;
  role: "founder" | "admin";
  active: number;
}

/**
 * Who is signed in, as an email address.
 *
 * In production the only proof accepted is the signed token from Cloudflare Access.
 * If `CF_ACCESS_TEAM_DOMAIN` or `CF_ACCESS_AUD` is not set, nobody is signed in:
 * the internal area stays locked rather than open.
 */
async function signedInEmail(): Promise<string | null> {
  if (process.env.NODE_ENV !== "production") return process.env.DEV_FOUNDER_EMAIL || null;
  const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN;
  const audience = process.env.CF_ACCESS_AUD;
  if (!teamDomain || !audience) return null;
  const token = (await headers()).get("cf-access-jwt-assertion");
  return verifyAccessToken(token, { teamDomain, audience });
}

export async function getInternalUser(): Promise<InternalUser | null> {
  const email = await signedInEmail();
  if (!email) return null;
  try {
    return await (await getDb()).prepare("SELECT id,email,full_name,role,active FROM internal_users WHERE lower(email)=lower(?) AND active=1").bind(email).first<InternalUser>();
  } catch {
    return null;
  }
}

export async function requireInternalUser(): Promise<InternalUser> {
  const user = await getInternalUser();
  if (!user) redirect("/internal/login");
  return user;
}
