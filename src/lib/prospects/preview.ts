import { z } from "zod";
import type { ProspectRecord } from "./types";

/** A view is counted again only after this long, so a reload is not a second view. */
export const PREVIEW_VIEW_GAP_MINUTES = 30;
/** The page must stay visible this long before a view counts. */
export const PREVIEW_VIEW_DELAY_MS = 5000;

const TOKEN_PATTERN = /([0-9a-f]{20})$/;

/** One finding as the prospect reads it: what their customer sees, and how to check it themselves. */
export const previewFindingSchema = z
  .object({
    seen: z.string().trim().min(1).max(400),
    check: z.string().trim().min(1).max(300),
  })
  .strict();

export const previewFindingsSchema = z.array(previewFindingSchema).min(1).max(3);
export type PreviewFinding = z.infer<typeof previewFindingSchema>;

/** Reads the stored JSON. Anything malformed counts as "no findings", never as a broken page. */
export function parsePreviewFindings(raw: unknown): PreviewFinding[] | null {
  if (typeof raw !== "string" || !raw) return null;
  try {
    const parsed = previewFindingsSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export function newPreviewToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** `/p/dr-renovation-0123456789abcdef0123`. The name is for trust, the token is the secret. */
export function previewPath(prospect: Pick<ProspectRecord, "business_name" | "preview_token">): string | null {
  if (!prospect.preview_token) return null;
  const slug = slugify(prospect.business_name);
  return `/p/${slug ? `${slug}-` : ""}${prospect.preview_token}`;
}

/** The token from a link's last path part, or null when it is not shaped like one. */
export function tokenFromRef(ref: string): string | null {
  return TOKEN_PATTERN.exec(ref)?.[1] ?? null;
}

/** A business that asked us to stop, or that we ruled out, no longer has a page. */
export function isPreviewVisible(
  prospect: Pick<ProspectRecord, "status" | "preview_token" | "preview_findings">,
): boolean {
  return (
    Boolean(prospect.preview_token) &&
    Boolean(prospect.preview_findings?.length) &&
    prospect.status !== "lost" &&
    prospect.status !== "not_fit"
  );
}

export function shouldCountView(lastViewedAt: string | null, now: Date): boolean {
  if (!lastViewedAt) return true;
  const last = new Date(lastViewedAt).getTime();
  if (Number.isNaN(last)) return true;
  return now.getTime() - last >= PREVIEW_VIEW_GAP_MINUTES * 60_000;
}

/** WhatsApp fetches the link from the sender's own phone to build the preview card. */
export function isLinkPreviewFetch(userAgent: string | null): boolean {
  return /^WhatsApp\/|facebookexternalhit|TelegramBot|Slackbot|bot\b|crawler|spider/i.test(userAgent || "");
}
