export const SLOT_REVEAL_MS = 1_600;
export const BRAND_HOLD_MS = 1_200;
export const TYPE_CHARACTER_MS = 45;
export const PHRASE_HOLD_MS = 1_400;
export const DELETE_CHARACTER_MS = 25;
export const BRAND_RETURN_MS = 650;
export const HEADLINE_REST_MS = 10_000;

export type HeadlineState =
  | { phase: "slot" }
  | { phase: "brand-hold" }
  | { phase: "typing"; phraseIndex: number; characterIndex: number }
  | { phase: "phrase-hold"; phraseIndex: number }
  | { phase: "deleting"; phraseIndex: number; characterIndex: number }
  | { phase: "brand-return" }
  | { phase: "resting" };

export const INITIAL_HEADLINE_STATE: HeadlineState = { phase: "slot" };

export function getHeadlineDelay(state: HeadlineState): number | null {
  switch (state.phase) {
    case "slot":
      return SLOT_REVEAL_MS;
    case "brand-hold":
      return BRAND_HOLD_MS;
    case "typing":
      return TYPE_CHARACTER_MS;
    case "phrase-hold":
      return PHRASE_HOLD_MS;
    case "deleting":
      return DELETE_CHARACTER_MS;
    case "brand-return":
      return BRAND_RETURN_MS;
    case "resting":
      return HEADLINE_REST_MS;
  }
}

export function advanceHeadlineState(
  state: HeadlineState,
  phrases: readonly string[],
): HeadlineState {
  switch (state.phase) {
    case "slot":
      return phrases.length > 0
        ? { phase: "brand-hold" }
        : { phase: "resting" };
    case "brand-hold":
      return { phase: "typing", phraseIndex: 0, characterIndex: 0 };
    case "typing": {
      const phrase = phrases[state.phraseIndex] ?? "";
      if (state.characterIndex < phrase.length) {
        return { ...state, characterIndex: state.characterIndex + 1 };
      }
      return { phase: "phrase-hold", phraseIndex: state.phraseIndex };
    }
    case "phrase-hold": {
      const phrase = phrases[state.phraseIndex] ?? "";
      return {
        phase: "deleting",
        phraseIndex: state.phraseIndex,
        characterIndex: phrase.length,
      };
    }
    case "deleting":
      if (state.characterIndex > 0) {
        return { ...state, characterIndex: state.characterIndex - 1 };
      }
      if (state.phraseIndex + 1 < phrases.length) {
        return {
          phase: "typing",
          phraseIndex: state.phraseIndex + 1,
          characterIndex: 0,
        };
      }
      return { phase: "brand-return" };
    case "brand-return":
      return { phase: "resting" };
    case "resting":
      return phrases.length > 0
        ? { phase: "typing", phraseIndex: 0, characterIndex: 0 }
        : state;
  }
}

export function getHeadlineText(
  state: HeadlineState,
  brandLine: string,
  phrases: readonly string[],
): string {
  switch (state.phase) {
    case "typing":
    case "deleting":
      return (phrases[state.phraseIndex] ?? "").slice(0, state.characterIndex);
    case "phrase-hold":
      return phrases[state.phraseIndex] ?? brandLine;
    default:
      return brandLine;
  }
}
