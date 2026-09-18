/** Limits a value to the 0–1 range. */
export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
