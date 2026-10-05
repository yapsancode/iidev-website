import { describe, expect, it } from "vitest";
import {
  FINAL_STORY_STATE,
  INITIAL_STORY_STATE,
  STORY_FOUND_HOLD_MS,
  STORY_SEARCH_MS,
  STORY_TYPE_CHARACTER_MS,
  advanceStoryState,
  getStoryDelay,
  getStoryText,
  type StoryState,
} from "@/components/ui/search-story-sequence";

const QUERY = "klinik gigi shah alam";

describe("search story sequence", () => {
  it("types the query one character at a time, then finds, then enquires", () => {
    const typed: string[] = [];
    const phases: string[] = [];
    let state: StoryState = INITIAL_STORY_STATE;

    for (let step = 0; step < 1_000 && getStoryDelay(state, QUERY) !== null; step += 1) {
      if (state.phase === "typing") typed.push(getStoryText(state, QUERY));
      const nextState = advanceStoryState(state, QUERY);
      if (nextState.phase !== state.phase) phases.push(nextState.phase);
      state = nextState;
    }

    expect(typed).toEqual(
      Array.from({ length: QUERY.length + 1 }, (_, length) =>
        QUERY.slice(0, length),
      ),
    );
    expect(phases).toEqual(["found", "enquiry"]);
    expect(state).toEqual(FINAL_STORY_STATE);
  });

  it("pauses on the full query before the business appears", () => {
    const midWord: StoryState = { phase: "typing", characterIndex: 3 };
    const fullQuery: StoryState = {
      phase: "typing",
      characterIndex: QUERY.length,
    };

    expect(getStoryDelay(midWord, QUERY)).toBe(STORY_TYPE_CHARACTER_MS);
    expect(getStoryDelay(fullQuery, QUERY)).toBe(STORY_SEARCH_MS);
    expect(getStoryText(fullQuery, QUERY)).toBe(QUERY);
    expect(advanceStoryState(fullQuery, QUERY)).toEqual({ phase: "found" });
    expect(getStoryDelay({ phase: "found" }, QUERY)).toBe(STORY_FOUND_HOLD_MS);
  });

  it("rests on the enquiry with the whole query still showing", () => {
    expect(getStoryDelay(FINAL_STORY_STATE, QUERY)).toBeNull();
    expect(advanceStoryState(FINAL_STORY_STATE, QUERY)).toBe(FINAL_STORY_STATE);
    expect(getStoryText(FINAL_STORY_STATE, QUERY)).toBe(QUERY);
  });
});
