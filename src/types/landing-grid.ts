/** What a map dot shows on its back face: a Paystack-market currency or a leading goods category. */
export type LandingSymbol =
  | "NGN" | "GHS" | "ZAR" | "KES" | "XOF" | "EGP"
  | "fashion" | "beauty" | "home" | "groceries" | "phone";

/** One cell of the landing grid. `flip` and `lift` are animated; the tweens are kept so they can be stopped. */
export type Dot = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  bright: boolean;
  symbol: LandingSymbol;
  scatter: number;
  rhythm: number;
  flip: number;
  lift: number;
  tween?: gsap.core.Tween;
  scaleTween?: gsap.core.Tween;
  returnCall?: gsap.core.Tween;
};
