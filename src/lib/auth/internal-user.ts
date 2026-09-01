import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/cloudflare/env";

export interface InternalUser {
  id: string;
  email: string;
  full_name: string;
  role: "founder" | "admin";
  active: number;
}

export async function getInternalUser(): Promise<InternalUser | null> {
  const requestHeaders = await headers();
  const email = requestHeaders.get("cf-access-authenticated-user-email")
    || (process.env.NODE_ENV !== "production" ? process.env.DEV_FOUNDER_EMAIL : null);
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
