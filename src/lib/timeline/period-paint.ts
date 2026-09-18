import { periodById } from "@/data/timeline";
import { gsap } from "@/lib/animation/gsap";
import { themeColor } from "@/lib/theme";
import { clamp01 } from "@/lib/utils";
import type { PeriodId } from "@/types/timeline";

const colorsOf = (period: PeriodId) => {
  const { colorToken, motifToken } = periodById[period];
  return { color: themeColor(colorToken), motifColor: themeColor(motifToken) };
};

/** Boundary positions (the `--phase-split` custom property) that leave one period filling the stage. */
const SPLIT_ALL_EARLIER = 122;
const SPLIT_ALL_LATER = -10;

/**
 * Paints the stage part-way across a period boundary. `fraction` is 0 at the earlier
 * year and 1 at the later one.
 *
 * The background boundary sweeps from right to left. The silhouettes, and the event
 * text in front of each, change colour as the boundary passes them — right shape
 * first, left shape last — so the change reads as one front crossing the stage.
 */
export function paintBoundary(stage: HTMLElement, from: PeriodId, to: PeriodId, fraction: number) {
  const crossing = from !== to;
  const earlier = colorsOf(from);
  const later = colorsOf(to);
  const progressFrom = (start: number, span: number) => (crossing ? clamp01((fraction - start) / span) : 0);
  const shapes = { left: progressFrom(0.65, 0.35), center: progressFrom(0.55, 0.45), right: progressFrom(0.2, 0.3) };

  stage.style.setProperty("--phase-from", earlier.color);
  stage.style.setProperty("--phase-to", later.color);
  stage.style.setProperty("--phase-split", `${crossing ? SPLIT_ALL_EARLIER - (SPLIT_ALL_EARLIER - SPLIT_ALL_LATER) * fraction : SPLIT_ALL_EARLIER}%`);
  for (const [shape, progress] of Object.entries(shapes)) {
    stage.style.setProperty(`--motif-${shape}-color`, gsap.utils.interpolate(earlier.motifColor, later.motifColor, progress));
    stage.style.setProperty(`--event-${shape}-bg`, gsap.utils.interpolate(earlier.color, later.color, progress));
  }
}

/**
 * The custom-property values that finish a sweep on one period. Tweened to when
 * scrolling stops part-way across a boundary. `side` says which side of the boundary
 * the settled period is on.
 */
export function settledPaint(period: PeriodId, side: "earlier" | "later") {
  const { color, motifColor } = colorsOf(period);
  return {
    "--phase-split": `${side === "earlier" ? SPLIT_ALL_EARLIER : SPLIT_ALL_LATER}%`,
    "--motif-left-color": motifColor,
    "--motif-center-color": motifColor,
    "--motif-right-color": motifColor,
    "--event-left-bg": color,
    "--event-center-bg": color,
    "--event-right-bg": color,
  };
}
