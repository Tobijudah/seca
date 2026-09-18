import type { PeriodId } from "@/types/timeline";

// Desktop callout positions from the supplied frames, keyed by how many events a
// year has. Each column also takes the event background of the silhouette behind it,
// so the colour sweep reaches the text at the same moment it reaches the shape.
const eventLeft = "[--event-bg:var(--event-left-bg,var(--phase-bg))]";
const eventCenter = "[--event-bg:var(--event-center-bg,var(--phase-bg))]";
const eventRight = "[--event-bg:var(--event-right-bg,var(--phase-bg))]";

/** Desktop classes positioning one event callout. Phones stack the callouts instead. */
export function eventPlacement(count: number, index: number, period: PeriodId) {
  if (count === 1) return `${eventCenter} top-[48%] left-[36%]`;
  if (count === 2) {
    if (index === 0) return `${eventLeft} top-[48.5%] left-[5.5%]`;
    return period === "pre-commerce" ? `${eventCenter} top-[48%] left-[35.65%]` : `${eventCenter} top-[62%] left-[32.55%]`;
  }
  return [
    `${eventLeft} top-[48.5%] left-[5.5%]`,
    `${eventCenter} top-[47%] left-[35.65%]`,
    `${eventRight} top-[63%] left-[60%]`,
  ][index];
}
