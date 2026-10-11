import type { NextRequest } from "next/server";
import { z } from "zod";
import { json, readBody, rejectUnlessAuthorized, SALES_API_ACTOR } from "@/lib/prospects/api";
import { getProspect, updateProspect } from "@/lib/prospects/data";
import { prospectPatchSchema } from "@/lib/prospects/schema";

export const runtime = "nodejs";

const idSchema = z.uuid();
type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: Context) {
  const denied = rejectUnlessAuthorized(request);
  if (denied) return denied;
  const id = idSchema.safeParse((await params).id);
  const found = id.success ? await getProspect(id.data) : null;
  if (!found) return json({ error: "Prospect not found." }, 404);
  return json(found);
}

/** PATCH: change fields, and/or run an action (mark_sent, follow_up_sent, replied, not_fit), and/or add a note. */
export async function PATCH(request: NextRequest, { params }: Context) {
  const denied = rejectUnlessAuthorized(request);
  if (denied) return denied;
  const id = idSchema.safeParse((await params).id);
  if (!id.success) return json({ error: "Prospect not found." }, 404);
  const body = await readBody(request, prospectPatchSchema);
  if ("response" in body) return body.response;
  try {
    const prospect = await updateProspect(id.data, body.data, SALES_API_ACTOR);
    if (!prospect) return json({ error: "Prospect not found." }, 404);
    return json({ prospect });
  } catch {
    return json({ error: "Could not save. Another prospect may already use this business name and phone." }, 409);
  }
}
