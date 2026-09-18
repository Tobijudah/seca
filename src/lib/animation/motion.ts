/**
 * The page's easing vocabulary, by role. Every tween picks from here rather than
 * naming its own curve, so motion across the page stays consistent.
 */
export const ease = {
  /** Entrances and reveals: arrive quickly, settle gently. */
  out: "power3.out",
  /** Exits: accelerate away. */
  in: "power2.in",
  /** Fades and small growth: softer than `out`. */
  soft: "power2.out",
  /** Things that go and come back, like a dot's return from its back face. */
  return: "power2.inOut",
  /** Mask wipes that should travel visibly rather than snap open. */
  wipe: "power1.inOut",
  /** Lines drawing in at constant speed, so they track the staggered years beside them. */
  draw: "none",
  /** Period colour sweeps. */
  sweep: "sine.inOut",
} as const;
