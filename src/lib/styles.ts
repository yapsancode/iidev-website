// Shared look of the public site: hard black borders, square corners, offset
// shadows. Compose with cn() from "@/lib/utils" when a spot needs a tweak.

/** The one main action button ("Book a Free Call"). */
export const PRIMARY_BUTTON =
  "inline-flex items-center justify-center gap-2 border-2 border-black bg-indigo-600 px-8 py-3 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:bg-indigo-500 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] dark:hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]";

/** Small tilted label above a heading. */
export const BADGE =
  "inline-flex -rotate-1 items-center border-2 border-black bg-white px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:bg-neutral-900 dark:text-white dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]";

/** Border and shadow shared by every card. Add a background and padding. */
export const CARD_FRAME =
  "border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:border-white dark:shadow-[5px_5px_0px_0px_rgba(255,255,255,1)]";

export const CARD_WHITE = `${CARD_FRAME} bg-white text-neutral-900 dark:bg-neutral-800 dark:text-white`;
export const CARD_ACCENT = `${CARD_FRAME} bg-emerald-300 text-black dark:bg-emerald-400`;
export const CARD_DARK = `${CARD_FRAME} bg-black text-white`;

/** For cards that are links: the card presses into its shadow on hover. */
export const CARD_HOVER =
  "transition-[transform,box-shadow] duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] motion-reduce:transition-none";

/** Small uppercase label inside cards and above lists. */
export const LABEL = "font-mono text-xs font-bold uppercase tracking-widest";
