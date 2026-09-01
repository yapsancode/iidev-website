import { describe, expect, it } from "vitest";
import {
  BRAND_RETURN_MS,
  HEADLINE_REST_MS,
  INITIAL_HEADLINE_STATE,
  advanceHeadlineState,
  getHeadlineDelay,
  getHeadlineText,
  type HeadlineState,
} from "@/components/ui/hero-headline-sequence";

const BRAND_LINE = "We Don't Just Build Websites, We Help Businesses Thrive.";
const PHRASES = [
  "Built for the AI era.",
  "Looks good. Loads fast. Gets found.",
] as const;

describe("bounded hero headline sequence", () => {
  it("shows two complete phrase cycles without replaying the slot reveal", () => {
    const completedPhrases: string[] = [];
    let state: HeadlineState = INITIAL_HEADLINE_STATE;
    let brandReturnEntries = 0;
    let restingEntries = 0;
    let slotEntries = 1;

    for (let step = 0; step < 1_000 && restingEntries < 2; step += 1) {
      const nextState = advanceHeadlineState(state, PHRASES);
      if (nextState.phase === "phrase-hold") {
        completedPhrases.push(
          getHeadlineText(nextState, BRAND_LINE, PHRASES),
        );
      }
      if (nextState.phase === "resting" && state.phase !== "resting") {
        restingEntries += 1;
      }
      if (
        nextState.phase === "brand-return" &&
        state.phase !== "brand-return"
      ) {
        brandReturnEntries += 1;
      }
      if (nextState.phase === "slot" && state.phase !== "slot") slotEntries += 1;
      state = nextState;
    }

    expect(completedPhrases).toEqual([...PHRASES, ...PHRASES]);
    expect(brandReturnEntries).toBe(2);
    expect(restingEntries).toBe(2);
    expect(slotEntries).toBe(1);
    expect(state).toEqual({ phase: "resting" });
    expect(getHeadlineText(state, BRAND_LINE, PHRASES)).toBe(BRAND_LINE);
  });

  it("animates the brand return before entering the resting state", () => {
    const finalDeletion: HeadlineState = {
      phase: "deleting",
      phraseIndex: PHRASES.length - 1,
      characterIndex: 0,
    };
    const brandReturn = advanceHeadlineState(finalDeletion, PHRASES);

    expect(brandReturn).toEqual({ phase: "brand-return" });
    expect(getHeadlineDelay(brandReturn)).toBe(BRAND_RETURN_MS);
    expect(getHeadlineText(brandReturn, BRAND_LINE, PHRASES)).toBe(BRAND_LINE);
    expect(advanceHeadlineState(brandReturn, PHRASES)).toEqual({
      phase: "resting",
    });
  });

  it("rests for ten seconds before restarting at the first phrase", () => {
    const resting = { phase: "resting" } as const;

    expect(getHeadlineDelay(resting)).toBe(HEADLINE_REST_MS);
    expect(getHeadlineText(resting, BRAND_LINE, PHRASES)).toBe(BRAND_LINE);
    expect(advanceHeadlineState(resting, PHRASES)).toEqual({
      phase: "typing",
      phraseIndex: 0,
      characterIndex: 0,
    });
  });
});
