import type { NextRequest } from "next/server";
import { json, readBody, rejectUnlessAuthorized, SALES_API_ACTOR } from "@/lib/prospects/api";
import { createProspect, listProspects } from "@/lib/prospects/data";
import { prospectCreateSchema } from "@/lib/prospects/schema";
import { prospectViews, type ProspectView } from "@/lib/prospects/types";

export const runtime = "nodejs";

/** GET /api/internal/prospects?view=to_audit|ready|due|replied|in_progress|closed|all&query=&limit= */
export async function GET(request: NextRequest) {
  const denied = rejectUnlessAuthorized(request);
  if (denied) return denied;
  const params = request.nextUrl.searchParams;
  const view = params.get("view") || "all";
  if (!(prospectViews as readonly string[]).includes(view)) {
    return json({ error: `Unknown view. Use one of: ${prospectViews.join(", ")}.` }, 400);
  }
  const limit = Math.min(500, Math.max(1, Number(params.get("limit")) || 100));
  const prospects = await listProspects({ view: view as ProspectView, query: params.get("query") || undefined });
  return json({ view, total: prospects.length, prospects: prospects.slice(0, limit) });
}

/** POST /api/internal/prospects: add one prospect. */
export async function POST(request: NextRequest) {
  const denied = rejectUnlessAuthorized(request);
  if (denied) return denied;
  const body = await readBody(request, prospectCreateSchema);
  if ("response" in body) return body.response;
  try {
    const prospect = await createProspect({ ...body.data, source: body.data.source || "claude" }, SALES_API_ACTOR);
    return json({ prospect }, 201);
  } catch {
    return json({ error: "A prospect with this business name and phone already exists." }, 409);
  }
}
