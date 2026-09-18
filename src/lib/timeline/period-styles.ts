import type { PeriodId } from "@/types/timeline";

// Every per-period Tailwind class lives here. Class names are written out in full
// because Tailwind only generates classes it can find as literal strings.

/**
 * Settled colours on the stage. While a period boundary is being crossed, the
 * scroll handler overrides the per-shape and per-event variables inline.
 */
export const stageTheme: Record<PeriodId, string> = {
  "pre-commerce": "[--motif-color:var(--color-motif-yellow)] [--phase-bg:var(--color-commerce-yellow)] [--headline-opacity:0.6]",
  // Deviation from Figma: the orange headline is full cream (3.12:1, passes as large text) instead of 60%.
  explosion: "[--motif-color:var(--color-motif-orange)] [--phase-bg:var(--color-commerce-orange)] [--headline-opacity:1]",
  growth: "[--motif-color:var(--color-motif-dark-green)] [--phase-bg:var(--color-commerce-dark-green)] [--headline-opacity:0.6]",
};

/** Solid period background, used by the phone year strip and its period names. */
export const periodBackground: Record<PeriodId, string> = {
  "pre-commerce": "bg-commerce-yellow",
  explosion: "bg-commerce-orange",
  growth: "bg-commerce-dark-green",
};

/** The year marker's artwork is drawn in the pre-commerce colour; these filters retint it. */
export const markerTint: Record<PeriodId, string> = {
  "pre-commerce": "",
  explosion: "hue-rotate-339 saturate-[.8]",
  growth: "hue-rotate-125 saturate-[.6]",
};

// Where each period's vertical label sits on the desktop rail, from the supplied frames.
export const railLabelPlacement: Record<PeriodId, string> = {
  "pre-commerce": "top-[9.9%] h-30",
  explosion: "top-[46.8%] h-21",
  growth: "top-[77.5%] h-30",
};
