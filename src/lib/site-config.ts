import { IIDEV_WHATSAPP_NUMBER } from "@/lib/leads/whatsapp";

// Single source of truth for the public site's name, canonical URL and contact details.

const DEFAULT_SITE_URL = "https://www.iidevstudio.com";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
).replace(/\/+$/, "");

export const BRAND_NAME = "IIDev Studio";

export const CONTACT_EMAIL = "team.iidevstudio@gmail.com";

export const WHATSAPP_NUMBER = IIDEV_WHATSAPP_NUMBER;
export const WHATSAPP_DISPLAY = "+60 11-3350 6561";
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

// Shared JSON-LD @id so every page points at the same Organization node.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function absoluteUrl(path = ""): string {
  return `${SITE_URL}${path}`;
}
