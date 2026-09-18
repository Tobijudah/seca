const resolved = new Map<string, string>();

/**
 * Reads a colour token from globals.css (`--color-<token>`), so canvas drawing and
 * GSAP colour tweens use the same values as the Tailwind classes. Tokens do not
 * change at runtime, so each is read from the document once and cached.
 * Browser-only.
 */
export function themeColor(token: string) {
  let value = resolved.get(token);
  if (value === undefined) {
    value = getComputedStyle(document.documentElement).getPropertyValue(`--color-${token}`).trim();
    resolved.set(token, value);
  }
  return value;
}
