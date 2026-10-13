import type { NextRequest } from "next/server";
import { json, rejectUnlessAuthorized } from "@/lib/prospects/api";
import { getOutboundOverview } from "@/lib/prospects/data";
import { buildPipelineSummary } from "@/lib/prospects/summary";

export const runtime = "nodejs";

/** GET: everything the daily pipeline review needs, in one call. */
export async function GET(request: NextRequest) {
  const denied = rejectUnlessAuthorized(request);
  if (denied) return denied;
  return json(buildPipelineSummary(await getOutboundOverview()));
}
