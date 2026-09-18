import type { LandingSymbol } from "@/types/landing-grid";
import { themeColor } from "@/lib/theme";

// Currency markets: Paystack country and currency documentation (2026).
// Physical-goods categories: Jumia's 2020 item-count breakdown across its markets.
// The dots are an illustration, not precise country markers or an Africa-wide sales ranking.


const currencyGlyphs: Partial<Record<LandingSymbol, string>> = {
  NGN: "₦",
  GHS: "₵",
  ZAR: "R",
  KES: "KSh",
  XOF: "CFA",
  EGP: "E£",
};

const goods: LandingSymbol[] = ["fashion", "beauty", "home", "groceries", "phone"];

// Lucide SVG geometry, in its native 24 × 24 coordinate system. The Path2D
// objects are created lazily once in the browser, never once per animated dot.
// Sources: https://github.com/lucide-icons/lucide/tree/main/icons (ISC license).
const iconPaths = {
  fashion: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",
  beauty: "M3 3h.01 M7 5h.01 M11 7h.01 M3 7h.01 M7 9h.01 M3 11h.01 M15 5h4v4h-4z M19 9l2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2 M13 14l8-2 M13 19l8-2",
  home: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8 M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  groceries: "M15 11l-1 9 M19 11l-4-7 M2 11h20 M3.5 11l1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4 M4.5 15.5h15 M5 11l4-7 M9 11l1 9",
  phone: "M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z M12 18h.01",
} satisfies Record<"fashion" | "beauty" | "home" | "groceries" | "phone", string>;

let cachedIconPaths: Record<keyof typeof iconPaths, Path2D> | undefined;
function getIconPaths() {
  cachedIconPaths ??= Object.fromEntries(
    Object.entries(iconPaths).map(([name, path]) => [name, new Path2D(path)]),
  ) as Record<keyof typeof iconPaths, Path2D>;
  return cachedIconPaths;
}

export function symbolForCell(row: number, column: number, mobile: boolean): LandingSymbol {
  const x = (column - (mobile ? 12 : 18)) / 12;
  const y = (row - (mobile ? 38 : 3)) / 15;
  const good = goods[(row * 7 + column * 11) % goods.length];
  if ((row + column) % 3 === 0) return good;

  // Broad visual regions, deliberately not a country-level coordinate lookup.
  if (y < 0.24 && x > 0.4 && x < 0.8) return "EGP";
  if (y > 0.73 && x > 0.34 && x < 0.78) return "ZAR";
  if (x > 0.57 && y > 0.29 && y < 0.7) return "KES";
  if (x > 0.29 && x < 0.5 && y > 0.25 && y < 0.6) return "NGN";
  if (x > 0.17 && x <= 0.29 && y > 0.25 && y < 0.6) return "GHS";
  if (x <= 0.17 && y > 0.25 && y < 0.6) return "XOF";
  return good;
}

export function drawSymbol(context: CanvasRenderingContext2D, symbol: LandingSymbol, radius: number, fontFamily: string) {
  context.fillStyle = themeColor("commerce-cream");
  context.beginPath();
  context.arc(0, 0, radius, 0, Math.PI * 2);
  context.fill();
  context.strokeStyle = themeColor("wine");
  context.fillStyle = themeColor("wine");
  context.lineCap = "round";
  context.lineJoin = "round";

  const glyph = currencyGlyphs[symbol];
  if (glyph) {
    const size = glyph.length > 2 ? 0.9 : glyph.length > 1 ? 1.15 : 1.45;
    context.font = `700 ${radius * size}px ${fontFamily}`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(glyph, 0, radius * 0.04, radius * 1.72);
    return;
  }

  context.save();
  context.scale(radius / 14, radius / 14);
  context.translate(-12, -12);
  context.lineWidth = 2;
  context.stroke(getIconPaths()[symbol as keyof typeof iconPaths]);
  context.restore();
}
