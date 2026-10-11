import { NextResponse, type NextRequest } from "next/server";
import type { z } from "zod";
import { isAuthorizedSalesRequest } from "./api-auth";

/** Who the timeline shows for changes made through the sales API. */
export const SALES_API_ACTOR = "claude";
const MAX_BODY_BYTES = 400_000;

/** Returns a 401 response when the bearer token is missing or wrong, otherwise null. */
export function rejectUnlessAuthorized(request: NextRequest): NextResponse | null {
  if (isAuthorizedSalesRequest(request.headers.get("authorization"), process.env.SALES_API_TOKEN)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: { "Cache-Control": "no-store" } });
}

export function json(body: unknown, status = 200): NextResponse {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Reads and validates a JSON body. Returns either the parsed data or a ready 4xx response. */
export async function readBody<Schema extends z.ZodType>(
  request: NextRequest,
  schema: Schema,
): Promise<{ data: z.infer<Schema> } | { response: NextResponse }> {
  if (Number(request.headers.get("content-length") || 0) > MAX_BODY_BYTES) {
    return { response: json({ error: "Request body is too large." }, 413) };
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return { response: json({ error: "Body must be valid JSON." }, 400) };
  }
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return {
      response: json(
        {
          error: "Invalid input.",
          issues: parsed.error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
        },
        400,
      ),
    };
  }
  return { data: parsed.data };
}
