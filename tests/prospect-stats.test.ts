import { describe, expect, it } from "vitest";
import {
  categoryByStatus,
  countByStatus,
  replyRate,
  sentInLastDays,
  websiteStateOfAudited,
  weeklyActivity,
  weekStartOf,
} from "../src/lib/prospects/stats";

function event(prospect_id: string, event_type: string, created_at: string) {
  return { prospect_id, event_type, created_at };
}

describe("pipeline counts", () => {
  it("lists every status in pipeline order, including zeros", () => {
    const counts = countByStatus([{ status: "messaged" }, { status: "messaged" }, { status: "won" }]);
    expect(counts.map((entry) => entry.status)).toEqual([
      "not_contacted", "messaged", "replied", "audit_booked", "audit_done", "proposal", "won", "lost", "not_fit",
    ]);
    expect(counts.find((entry) => entry.status === "messaged")?.count).toBe(2);
    expect(counts.find((entry) => entry.status === "replied")?.count).toBe(0);
  });

  it("handles an empty pipeline", () => {
    expect(countByStatus([]).every((entry) => entry.count === 0)).toBe(true);
    expect(categoryByStatus([])).toEqual([]);
  });

  it("splits each category by status, largest category first", () => {
    const breakdown = categoryByStatus([
      { category: "Dental", status: "not_contacted" },
      { category: "Dental", status: "messaged" },
      { category: "Dental", status: "messaged" },
      { category: "Clinic", status: "replied" },
    ]);
    expect(breakdown.map((row) => [row.category, row.total])).toEqual([["Dental", 3], ["Clinic", 1]]);
    expect(breakdown[0].byStatus).toEqual([
      { status: "not_contacted", count: 1 },
      { status: "messaged", count: 2 },
    ]);
  });

  it("counts website state only for audited prospects", () => {
    expect(
      websiteStateOfAudited([
        { audit_date: "2026-10-09", website_state: "none" },
        { audit_date: "2026-10-09", website_state: "ok" },
        { audit_date: null, website_state: "weak" },
        { audit_date: "2026-10-09", website_state: null },
      ]),
    ).toEqual([
      { state: "none", count: 1 },
      { state: "weak", count: 0 },
      { state: "ok", count: 1 },
    ]);
  });
});

describe("activity over time", () => {
  it("starts weeks on Monday", () => {
    expect(weekStartOf("2026-10-12")).toBe("2026-10-12"); // Monday
    expect(weekStartOf("2026-10-14")).toBe("2026-10-12"); // Wednesday
    expect(weekStartOf("2026-10-18")).toBe("2026-10-12"); // Sunday
    expect(weekStartOf("2026-10-19")).toBe("2026-10-19"); // next Monday
  });

  it("buckets events by Malaysian week and zero-fills quiet weeks", () => {
    const weeks = weeklyActivity(
      [
        event("a", "message_sent", "2026-10-12T02:00:00Z"),
        event("b", "message_sent", "2026-10-13T02:00:00Z"),
        event("a", "follow_up_sent", "2026-10-16T02:00:00Z"),
        event("a", "reply_logged", "2026-10-17T02:00:00Z"),
        // 00:30 Monday 19 Oct in Malaysia, still Sunday 18 Oct in UTC: belongs to the next week.
        event("c", "message_sent", "2026-10-18T16:30:00Z"),
        event("d", "message_sent", "2026-06-01T02:00:00Z"), // older than the window
        event("a", "status_changed", "2026-10-12T02:00:00Z"), // not an activity event
      ],
      "2026-10-20",
      3,
    );
    expect(weeks).toEqual([
      { weekStart: "2026-10-05", sent: 0, followUps: 0, replies: 0 },
      { weekStart: "2026-10-12", sent: 2, followUps: 1, replies: 1 },
      { weekStart: "2026-10-19", sent: 1, followUps: 0, replies: 0 },
    ]);
  });

  it("counts reply rate per business, not per message", () => {
    expect(
      replyRate([
        event("a", "message_sent", "2026-10-12T02:00:00Z"),
        event("a", "follow_up_sent", "2026-10-16T02:00:00Z"),
        event("a", "reply_logged", "2026-10-17T02:00:00Z"),
        event("a", "reply_logged", "2026-10-18T02:00:00Z"),
        event("b", "message_sent", "2026-10-12T02:00:00Z"),
        event("c", "message_sent", "2026-10-12T02:00:00Z"),
        event("z", "reply_logged", "2026-10-12T02:00:00Z"), // replied without a logged first message
      ]),
    ).toEqual({ replied: 1, messaged: 3, percent: 33 });
  });

  it("has no reply rate before the first message", () => {
    expect(replyRate([])).toEqual({ replied: 0, messaged: 0, percent: null });
  });

  it("counts first messages and follow-ups in the last 7 days including today", () => {
    const events = [
      event("a", "message_sent", "2026-10-14T02:00:00Z"), // 7 days window starts 14 Oct for today = 20 Oct
      event("b", "message_sent", "2026-10-13T02:00:00Z"), // one day too old
      event("a", "follow_up_sent", "2026-10-20T02:00:00Z"),
      event("a", "reply_logged", "2026-10-20T02:00:00Z"),
    ];
    expect(sentInLastDays(events, "2026-10-20", 7)).toBe(2);
    expect(sentInLastDays([], "2026-10-20", 7)).toBe(0);
  });
});

describe("chart stages", () => {
  it("groups the nine statuses into five stages", async () => {
    const { stageOf } = await import("../src/lib/prospects/stats");
    expect(stageOf("not_contacted")).toBe("waiting");
    expect(stageOf("messaged")).toBe("messaged");
    expect(["replied", "audit_booked", "audit_done", "proposal"].map((status) => stageOf(status as never))).toEqual(["talking", "talking", "talking", "talking"]);
    expect(stageOf("won")).toBe("won");
    expect([stageOf("lost"), stageOf("not_fit")]).toEqual(["dropped", "dropped"]);
  });

  it("counts each category by stage without losing anyone", async () => {
    const { categoryByStage } = await import("../src/lib/prospects/stats");
    const rows = categoryByStage([
      { category: "Dental", status: "not_contacted" },
      { category: "Dental", status: "replied" },
      { category: "Dental", status: "proposal" },
      { category: "Dental", status: "not_fit" },
      { category: "Clinic", status: "won" },
    ]);
    expect(rows[0]).toEqual({ category: "Dental", total: 4, stages: { waiting: 1, messaged: 0, talking: 2, won: 0, dropped: 1 } });
    expect(rows[1].stages.won).toBe(1);
    expect(rows.every((row) => Object.values(row.stages).reduce((sum, count) => sum + count, 0) === row.total)).toBe(true);
  });
});
