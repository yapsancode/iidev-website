/**
 * Checks a saved WhatsApp draft against the outreach rules in
 * .claude/skills/outreach-message/SKILL.md, so a draft that breaks a rule is
 * caught before it is sent. It only reads the text. It never blocks a send:
 * the founder decides.
 */

export const FIRST_MESSAGE_MAX_WORDS = 80;
export const FOLLOW_UP_MAX_WORDS = 50;

export type DraftKind = "first" | "follow_up";

export interface DraftCheck {
  id: "length" | "price" | "link" | "stop_line" | "emoji" | "placeholder" | "chasing";
  ok: boolean;
  label: string;
}

const PRICE = /\bRM\s?\d|\d\s?ringgit\b|\bringgit\b/i;
const LINK = /https?:\/\/|www\.|wa\.me|\b[a-z0-9-]+\.(?:com|my|net|org|io|co|app|site)\b/i;
const STOP_LINE = /\b(?:reply|balas)\b[^.?!\n]{0,6}["'“‘]?\s*(?:no|tidak|stop)\b|won['’]?t message|tak(?:kan| akan) (?:mesej|message|ganggu)/i;
const PLACEHOLDER = /<[^>\n]{1,40}>|\{\{|\[(?:name|nama|business|area|clinic)\]/i;
const CHASING = /just checking in|following up on my (?:last|previous)|did you (?:see|get) my/i;
const EMOJI = /\p{Extended_Pictographic}/gu;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function checkDraft(text: string, kind: DraftKind): DraftCheck[] {
  const words = countWords(text);
  const max = kind === "first" ? FIRST_MESSAGE_MAX_WORDS : FOLLOW_UP_MAX_WORDS;
  const emoji = text.match(EMOJI)?.length ?? 0;
  const checks: DraftCheck[] = [
    {
      id: "length",
      ok: words <= max,
      label: words <= max ? `${words} words, under ${max}` : `${words} words. Keep it under ${max}.`,
    },
    {
      id: "price",
      ok: !PRICE.test(text),
      label: PRICE.test(text) ? "Mentions a price. The price comes only after they say yes." : "No price",
    },
    {
      id: "link",
      ok: !LINK.test(text),
      label: LINK.test(text) ? "Has a link. Links go only after they reply." : "No link",
    },
  ];
  if (kind === "first") {
    const hasStop = STOP_LINE.test(text);
    checks.push({
      id: "stop_line",
      ok: hasStop,
      label: hasStop ? "Says how to stop" : "No line on how to stop. Add one, such as: Reply \"no\" and I won't message again.",
    });
  } else if (CHASING.test(text)) {
    checks.push({ id: "chasing", ok: false, label: "Sounds like chasing. Give one new fact instead." });
  }
  if (emoji > 1) checks.push({ id: "emoji", ok: false, label: `${emoji} emoji. Use one at most.` });
  if (PLACEHOLDER.test(text)) checks.push({ id: "placeholder", ok: false, label: "Has a blank still to fill in." });
  return checks;
}

export function draftProblems(text: string | null, kind: DraftKind): DraftCheck[] {
  return text ? checkDraft(text, kind).filter((check) => !check.ok) : [];
}
