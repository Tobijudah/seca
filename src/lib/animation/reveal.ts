import { gsap, SplitText } from "@/lib/animation/gsap";
import { ease } from "@/lib/animation/motion";

// The masked word reveal used across the page: each word sits behind its own mask
// and rises into view. Leaving words fall out through the same masks.

/** How far below its mask a word starts, as a percentage of its own height. */
export const WORD_OFFSET = 110;

type Direction = 1 | -1;
type WordMotion = { duration: number; stagger: number; direction?: Direction };

/**
 * Splits text into words, each behind its own mask.
 *
 * `aria: "none"` because SplitText's default puts an `aria-label` on the element it
 * splits, and a label is prohibited on paragraphs and other generic elements (axe
 * `aria-prohibited-attr`; Lighthouse flagged it). With it off, the words stay in the
 * accessibility tree as ordinary text in reading order.
 *
 * Call inside useGSAP: SplitText registers with the hook's context, so the original
 * text is restored when the hook reverts.
 */
export function splitWords(target: HTMLElement) {
  return SplitText.create(target, { type: "words", mask: "words", aria: "none" });
}

/** Parks words below their masks (or above, for direction -1), ready to reveal. */
export function hideWords(words: Element[], direction: Direction = 1) {
  gsap.set(words, { yPercent: WORD_OFFSET * direction });
}

/** Adds a reveal to a timeline. Direction -1 staggers from the last word. */
export function revealWords(timeline: gsap.core.Timeline, words: Element[], position: number, { duration, stagger, direction = 1 }: WordMotion) {
  timeline.to(words, { yPercent: 0, duration, stagger: { each: stagger, from: direction === 1 ? "start" : "end" }, ease: ease.out }, position);
}

/** Adds an exit to a timeline: words leave through the opposite side of their masks. */
export function concealWords(timeline: gsap.core.Timeline, words: Element[], position: number, { duration, stagger, direction = 1 }: WordMotion) {
  timeline.to(words, { yPercent: -WORD_OFFSET * direction, duration, stagger: { each: stagger, from: direction === 1 ? "start" : "end" }, ease: ease.in }, position);
}
