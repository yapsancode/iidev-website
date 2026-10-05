export const STORY_TYPE_CHARACTER_MS = 55;
export const STORY_SEARCH_MS = 350;
export const STORY_FOUND_HOLD_MS = 900;

// One play of the search story: the query is typed, the business shows up,
// then an enquiry arrives. It ends on "enquiry" and stays there.
export type StoryState =
  | { phase: "typing"; characterIndex: number }
  | { phase: "found" }
  | { phase: "enquiry" };

export const INITIAL_STORY_STATE: StoryState = {
  phase: "typing",
  characterIndex: 0,
};

// Also what the server renders, so the finished picture is in the HTML.
export const FINAL_STORY_STATE: StoryState = { phase: "enquiry" };

export function getStoryDelay(state: StoryState, query: string): number | null {
  switch (state.phase) {
    case "typing":
      return state.characterIndex < query.length
        ? STORY_TYPE_CHARACTER_MS
        : STORY_SEARCH_MS;
    case "found":
      return STORY_FOUND_HOLD_MS;
    case "enquiry":
      return null;
  }
}

export function advanceStoryState(state: StoryState, query: string): StoryState {
  switch (state.phase) {
    case "typing":
      return state.characterIndex < query.length
        ? { phase: "typing", characterIndex: state.characterIndex + 1 }
        : { phase: "found" };
    case "found":
      return { phase: "enquiry" };
    case "enquiry":
      return state;
  }
}

export function getStoryText(state: StoryState, query: string): string {
  return state.phase === "typing"
    ? query.slice(0, state.characterIndex)
    : query;
}
