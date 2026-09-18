"use client";

import { useCallback, useSyncExternalStore } from "react";
import { PHONE_QUERY, REDUCED_MOTION_QUERY } from "@/lib/media";


/**
 * Subscribes to a media query. `useSyncExternalStore` gives an explicit server
 * snapshot (false), so the first client render matches the static HTML and the real
 * value follows immediately after hydration.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback((onChange: () => void) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

export const usePrefersReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);
export const useIsPhone = () => useMediaQuery(PHONE_QUERY);
