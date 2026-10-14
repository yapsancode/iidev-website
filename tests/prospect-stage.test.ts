import { describe, expect, it } from "vitest";
import { checkDraft, countWords, draftProblems } from "../src/lib/prospects/draft-check";
import { moveForStatus } from "../src/lib/prospects/rules";
import { daysBetween, journeyIndex, stageOf } from "../src/lib/prospects/stage";
import type { ProspectRecord } from "../src/lib/prospects/types";

type Stageable = Pick<
  ProspectRecord,
  "status" | "audit_date" | "website_state" | "next_follow_up" | "last_contact" | "draft_first" | "lost_reason"
>;

function prospect(overrides: Partial<Stageable> = {}): Stageable {
  return {
    status: "not_contacted",
    audit_date: null,
    website_state: null,
    next_follow_up: null,
    last_contact: null,
    draft_first: null,
    lost_reason: null,
    ...overrides,
  };
}

const today = "2026-10-14";

const goodFirst =
  "Hi, Isyraf here from IIDev Studio in PJ. We build websites for local businesses.\n\nI tapped the Website button on your Google listing. It opens a \"404 Page Not Found\" error.\n\nWant me to send over what I found?\n\nNot interested? Reply \"no\" and I won't message again.";

describe("stage of a prospect", () => {
  it("follows the routine: audit, write, send", () => {
    expect(stageOf(prospect(), today)).toBe("to_audit");
    expect(stageOf(prospect({ audit_date: "2026-10-09", website_state: "ok" }), today)).toBe("no_problem");
    expect(stageOf(prospect({ audit_date: "2026-10-09", website_state: "none" }), today)).toBe("needs_draft");
    expect(stageOf(prospect({ audit_date: "2026-10-09", website_state: "weak", draft_first: "Hi" }), today)).toBe("ready");
  });

  it("splits messaged into waiting, due and follow-up already sent", () => {
    expect(stageOf(prospect({ status: "messaged", next_follow_up: "2026-10-18" }), today)).toBe("waiting");
    expect(stageOf(prospect({ status: "messaged", next_follow_up: "2026-10-14" }), today)).toBe("follow_up_due");
    expect(stageOf(prospect({ status: "messaged", next_follow_up: null, last_contact: "2026-10-12" }), today)).toBe("follow_up_sent");
  });

  it("puts asked to stop above everything else", () => {
    expect(stageOf(prospect({ status: "lost", lost_reason: "asked_to_stop" }), today)).toBe("stopped");
    expect(stageOf(prospect({ status: "lost", lost_reason: "no_reply" }), today)).toBe("closed");
    expect(stageOf(prospect({ status: "audit_booked" }), today)).toBe("in_progress");
  });

  it("maps stages to the step strip", () => {
    expect(journeyIndex("to_audit", "not_contacted")).toBe(0);
    expect(journeyIndex("ready", "not_contacted")).toBe(2);
    expect(journeyIndex("replied", "replied")).toBe(4);
    expect(journeyIndex("closed", "won")).toBe(6);
    expect(journeyIndex("closed", "lost")).toBeNull();
    expect(journeyIndex("stopped", "lost")).toBeNull();
  });

  it("counts whole days between Malaysian dates", () => {
    expect(daysBetween("2026-10-09", "2026-10-14")).toBe(5);
    expect(daysBetween("2026-10-14", "2026-10-14")).toBe(0);
  });
});

describe("board and status menu moves", () => {
  it("records a first message like the Mark sent button", () => {
    expect(moveForStatus("not_contacted", "messaged")).toEqual({ action: "mark_sent" });
  });

  it("records a reply like the They replied button", () => {
    expect(moveForStatus("messaged", "replied")).toEqual({ action: "replied" });
    expect(moveForStatus("not_contacted", "replied")).toEqual({ action: "replied" });
  });

  it("uses a plain status for the later stages, and nothing when unchanged", () => {
    expect(moveForStatus("replied", "audit_booked")).toEqual({ status: "audit_booked" });
    expect(moveForStatus("replied", "messaged")).toEqual({ status: "messaged" });
    expect(moveForStatus("messaged", "messaged")).toBeNull();
    expect(moveForStatus("not_contacted", "not_fit")).toEqual({ action: "not_fit" });
  });
});

describe("draft check", () => {
  it("passes a first message that follows the rules", () => {
    expect(draftProblems(goodFirst, "first")).toEqual([]);
    expect(countWords(goodFirst)).toBeLessThanOrEqual(80);
  });

  it("catches a price, a link and a missing stop line", () => {
    const ids = draftProblems("Hi, we do audits for RM 500. See iidevstudio.com", "first").map((check) => check.id);
    expect(ids).toEqual(["price", "link", "stop_line"]);
  });

  it("accepts the Malay stop line", () => {
    const text = "Salam, saya Isyraf dari IIDev Studio. Boleh saya share apa yang saya jumpa? Kalau tak berminat, balas 'tidak' dan saya tak akan mesej lagi.";
    expect(draftProblems(text, "first")).toEqual([]);
  });

  it("flags long messages, extra emoji, blanks and chasing", () => {
    const long = Array.from({ length: 81 }, () => "word").join(" ") + " Reply \"no\" and I won't message again.";
    expect(draftProblems(long, "first").map((check) => check.id)).toEqual(["length"]);
    expect(draftProblems("Hi <name> 👋🙂 reply no", "first").map((check) => check.id)).toEqual(["emoji", "placeholder"]);
    expect(draftProblems("Hi again, just checking in on my message.", "follow_up").map((check) => check.id)).toEqual(["chasing"]);
  });

  it("does not ask a follow-up for a stop line", () => {
    expect(checkDraft("One more thing: your Facebook page links to a dead site. Want me to send what I found?", "follow_up").every((check) => check.ok)).toBe(true);
  });
});
