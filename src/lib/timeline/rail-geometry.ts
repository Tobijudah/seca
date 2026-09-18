/** The supplied timeline frames are 1440 × 810; rail positions are measured on that height. */
export const RAIL_FRAME_HEIGHT = 810;

/** Centre of each year label on the reference frame, in px, one per timeline stop. */
export const yearPositions = [97, 153, 197, 241, 285, 329, 373, 417, 461, 505, 549, 593, 637, 681, 725];

/** A reference-frame y position as a percentage of the rail, so the rail scales with the viewport. */
export const railTop = (y: number) => (y / RAIL_FRAME_HEIGHT) * 100;

/**
 * Where the reader is along the timeline, as a fractional stop index: 2.4 means 40% of
 * the way from the third stop to the fourth. `centers` are the document-y centres of
 * the scroll steps; `reference` is the document-y the reading position is taken at.
 */
export function stopPosition(centers: number[], reference: number) {
  let position = 0;
  for (let index = 0; index < centers.length - 1; index++) {
    if (reference < centers[index]) break;
    position = index + Math.min(1, (reference - centers[index]) / (centers[index + 1] - centers[index]));
  }
  return position;
}

/** The marker's y on the reference frame for a fractional stop index, between the two labels it sits between. */
export function markerY(position: number) {
  const lower = Math.min(Math.floor(position), yearPositions.length - 1);
  const upper = Math.min(lower + 1, yearPositions.length - 1);
  return yearPositions[lower] + (yearPositions[upper] - yearPositions[lower]) * (position - lower);
}
