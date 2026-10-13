export interface InternalUser {
  id: string;
  email: string;
  full_name: string;
  role: "founder" | "admin";
  active: number;
}

/**
 * The active founder row for an email, or null. Being let in by Cloudflare Access is not enough:
 * the email must also be an active row in `internal_users`. Never throws.
 */
export async function findActiveInternalUser(db: D1Database, email: string | null | undefined): Promise<InternalUser | null> {
  if (!email) return null;
  try {
    return await db
      .prepare("SELECT id,email,full_name,role,active FROM internal_users WHERE lower(email)=lower(?) AND active=1")
      .bind(email)
      .first<InternalUser>();
  } catch {
    return null;
  }
}
