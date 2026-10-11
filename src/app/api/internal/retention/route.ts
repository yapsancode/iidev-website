import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/cloudflare/env";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const db=await getDb();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  const twentyFourMonthsAgo = new Date();
  twentyFourMonthsAgo.setMonth(twentyFourMonthsAgo.getMonth() - 24);

  const deleted=await db.prepare("DELETE FROM leads WHERE status IN ('lost','not_fit') AND last_activity_at<?").bind(twelveMonthsAgo.toISOString()).run();
  const flagged=await db.prepare("UPDATE leads SET retention_review_due=1 WHERE status NOT IN ('lost','not_fit') AND last_activity_at<?").bind(twentyFourMonthsAgo.toISOString()).run();
  // Outbound prospects we gave up on follow the same 12-month rule.
  const prospects=await db.prepare("DELETE FROM prospects WHERE status IN ('lost','not_fit') AND last_activity_at<?").bind(twelveMonthsAgo.toISOString()).run();
  return NextResponse.json({deleted:deleted.meta.changes||0,flaggedForReview:flagged.meta.changes||0,prospectsDeleted:prospects.meta.changes||0});
}
