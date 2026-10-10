import { describe, expect, it } from "vitest";
import {
  addDays,
  compareForAudit,
  followUpDate,
  isDue,
  isGoneQuiet,
  isReadyToMessage,
  isToAudit,
  isValidDateString,
  matchesView,
  outcomeForAction,
  todayInMalaysia,
  toMalaysianMobile,
  whatsappLink,
} from "../src/lib/prospects/rules";
import type { ProspectRecord } from "../src/lib/prospects/types";

type Datable = Pick<ProspectRecord, "status" | "audit_date" | "website_state" | "next_follow_up" | "last_contact">;

function prospect(overrides: Partial<Datable> = {}): Datable {
  return { status: "not_contacted", audit_date: null, website_state: null, next_follow_up: null, last_contact: null, ...overrides };
}

describe("Malaysia calendar dates", () => {
  it("uses the Malaysian date late at night, when UTC is still on the previous day", () => {
    // 00:30 on 11 Oct in Malaysia is 16:30 UTC on 10 Oct.
    expect(todayInMalaysia(new Date("2026-10-10T16:30:00Z"))).toBe("2026-10-11");
  });

  it("stays on the same day just before Malaysian midnight", () => {
    // 23:30 on 10 Oct in Malaysia is 15:30 UTC on 10 Oct.
    expect(todayInMalaysia(new Date("2026-10-10T15:30:00Z"))).toBe("2026-10-10");
  });

  it("adds days across a month end and a year end", () => {
    expect(addDays("2026-10-29", 4)).toBe("2026-11-02");
    expect(addDays("2026-12-30", 4)).toBe("2027-01-03");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("plans the follow-up four days after the first message", () => {
    expect(followUpDate("2026-10-10")).toBe("2026-10-14");
  });

  it("rejects dates that are not real", () => {
    expect(isValidDateString("2026-10-10")).toBe(true);
    expect(isValidDateString("2026-02-30")).toBe(false);
    expect(isValidDateString("10/10/2026")).toBe(false);
    expect(isValidDateString("")).toBe(false);
  });
});

describe("which list a prospect belongs to", () => {
  it("needs an audit while nothing has been checked", () => {
    expect(isToAudit(prospect())).toBe(true);
    expect(isToAudit(prospect({ audit_date: "2026-10-09" }))).toBe(false);
    expect(isToAudit(prospect({ status: "messaged" }))).toBe(false);
  });

  it("is ready to message only after an audit that found a real problem", () => {
    expect(isReadyToMessage(prospect({ audit_date: "2026-10-09", website_state: "none" }))).toBe(true);
    expect(isReadyToMessage(prospect({ audit_date: "2026-10-09", website_state: "weak" }))).toBe(true);
    expect(isReadyToMessage(prospect({ audit_date: "2026-10-09", website_state: "ok" }))).toBe(false);
    expect(isReadyToMessage(prospect({ website_state: "none" }))).toBe(false);
    expect(isReadyToMessage(prospect({ status: "messaged", audit_date: "2026-10-09", website_state: "none" }))).toBe(false);
  });

  it("is due on the follow-up day and stays due when overdue", () => {
    const messaged = prospect({ status: "messaged", next_follow_up: "2026-10-14" });
    expect(isDue(messaged, "2026-10-13")).toBe(false);
    expect(isDue(messaged, "2026-10-14")).toBe(true);
    expect(isDue(messaged, "2026-10-20")).toBe(true);
    expect(isDue(prospect({ status: "replied", next_follow_up: "2026-10-14" }), "2026-10-20")).toBe(false);
    expect(isDue(prospect({ status: "messaged" }), "2026-10-20")).toBe(false);
  });

  it("has gone quiet 14 days after the last contact with no follow-up planned", () => {
    const sent = prospect({ status: "messaged", last_contact: "2026-10-01" });
    expect(isGoneQuiet(sent, "2026-10-14")).toBe(false);
    expect(isGoneQuiet(sent, "2026-10-15")).toBe(true);
    expect(isGoneQuiet({ ...sent, next_follow_up: "2026-10-05" }, "2026-10-30")).toBe(false);
  });

  it("matches the named views", () => {
    const today = "2026-10-14";
    expect(matchesView(prospect(), "to_audit", today)).toBe(true);
    expect(matchesView(prospect({ status: "replied" }), "replied", today)).toBe(true);
    expect(matchesView(prospect({ status: "audit_booked" }), "in_progress", today)).toBe(true);
    expect(matchesView(prospect({ status: "not_fit" }), "closed", today)).toBe(true);
    expect(matchesView(prospect({ status: "messaged" }), "closed", today)).toBe(false);
    expect(matchesView(prospect({ status: "lost" }), "all", today)).toBe(true);
  });

  it("audits Priority A first, then the fewest Google reviews", () => {
    const rows = [
      { business_name: "B many", priority: "B" as const, google_reviews: 3 },
      { business_name: "A many", priority: "A" as const, google_reviews: 2481 },
      { business_name: "A few", priority: "A" as const, google_reviews: 93 },
      { business_name: "A unknown", priority: "A" as const, google_reviews: null },
    ];
    expect(rows.sort(compareForAudit).map((row) => row.business_name)).toEqual(["A few", "A many", "A unknown", "B many"]);
  });
});

describe("one-tap actions", () => {
  it("marks a first message as sent and plans the follow-up", () => {
    expect(outcomeForAction("mark_sent", "2026-10-29")).toEqual({
      patch: { status: "messaged", last_contact: "2026-10-29", next_follow_up: "2026-11-02" },
      event: "message_sent",
    });
  });

  it("clears the follow-up date after the single follow-up", () => {
    expect(outcomeForAction("follow_up_sent", "2026-10-14")).toEqual({
      patch: { last_contact: "2026-10-14", next_follow_up: null },
      event: "follow_up_sent",
    });
  });

  it("moves to Replied and stops the follow-up", () => {
    expect(outcomeForAction("replied", "2026-10-12")).toEqual({
      patch: { status: "replied", last_contact: "2026-10-12", next_follow_up: null },
      event: "reply_logged",
    });
  });

  it("marks not fit without claiming any contact happened", () => {
    expect(outcomeForAction("not_fit", "2026-10-12")).toEqual({
      patch: { status: "not_fit", next_follow_up: null },
      event: null,
    });
  });
});

describe("WhatsApp numbers", () => {
  it("recognises Malaysian mobiles in the formats the tracker uses", () => {
    expect(toMalaysianMobile("+60 18-915 3360")).toBe("+60189153360");
    expect(toMalaysianMobile("018-915 3360")).toBe("+60189153360");
    expect(toMalaysianMobile("+60 11-3942 6972")).toBe("+601139426972");
    expect(toMalaysianMobile("60162215926")).toBe("+60162215926");
  });

  it("returns nothing for landlines and junk", () => {
    expect(toMalaysianMobile("+60 3-7931 3090")).toBeNull();
    expect(toMalaysianMobile("03-7931 3090")).toBeNull();
    expect(toMalaysianMobile("")).toBeNull();
    expect(toMalaysianMobile(null)).toBeNull();
    expect(toMalaysianMobile("call us")).toBeNull();
  });

  it("builds a wa.me link with the drafted message safely encoded", () => {
    expect(whatsappLink("+60189153360")).toBe("https://wa.me/60189153360");
    expect(whatsappLink("+60189153360", "Hi, saya Isyraf & team.\nBoleh share?")).toBe(
      "https://wa.me/60189153360?text=Hi%2C%20saya%20Isyraf%20%26%20team.%0ABoleh%20share%3F",
    );
    expect(whatsappLink("+60189153360", "   ")).toBe("https://wa.me/60189153360");
    expect(whatsappLink(null, "Hi")).toBeNull();
  });
});
