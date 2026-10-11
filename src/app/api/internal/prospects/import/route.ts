import type { NextRequest } from "next/server";
import { json, readBody, rejectUnlessAuthorized, SALES_API_ACTOR } from "@/lib/prospects/api";
import { importProspects } from "@/lib/prospects/data";
import { prospectImportSchema } from "@/lib/prospects/schema";

export const runtime = "nodejs";

/** POST: add or update up to 200 prospects, matched on business name + phone. Safe to repeat. */
export async function POST(request: NextRequest) {
  const denied = rejectUnlessAuthorized(request);
  if (denied) return denied;
  const body = await readBody(request, prospectImportSchema);
  if ("response" in body) return body.response;
  return json(await importProspects(body.data.prospects, SALES_API_ACTOR));
}
