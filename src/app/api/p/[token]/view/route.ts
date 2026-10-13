import type { NextRequest } from "next/server";
import { recordPreviewView } from "@/lib/prospects/data";
import { isLinkPreviewFetch, tokenFromRef } from "@/lib/prospects/preview";

export const runtime = "nodejs";

type Context = { params: Promise<{ token: string }> };

/** Counts one view of a preview page. Always answers 204, so the link's existence is not revealed. */
export async function POST(request: NextRequest, { params }: Context) {
  const token = tokenFromRef((await params).token);
  if (token && !isLinkPreviewFetch(request.headers.get("user-agent"))) {
    try {
      await recordPreviewView(token);
    } catch {
      // A missed count must never show an error to the prospect.
    }
  }
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
