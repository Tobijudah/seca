"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { YearTransition } from "@/types/timeline";

/**
 * Separates the year the reader has scrolled to from the year on screen.
 *
 * Scrolling can pass several years while one masked text handoff is still running.
 * Rather than interrupting it, the handoff finishes and then goes straight from the
 * year it showed to the latest requested one. Intermediate years are skipped, not
 * queued, so fast scrolling settles quickly and never plays a backlog.
 */
export function useYearTransition({ animate }: { animate: boolean }) {
  const [displayIndex, setDisplayIndex] = useState(0);
  const [transition, setTransition] = useState<YearTransition | null>(null);
  const displayIndexRef = useRef(0);
  const requestedIndexRef = useRef(0);
  const transitioningRef = useRef(false);
  const animateRef = useRef(animate);

  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  const show = useCallback((index: number) => {
    const previous = displayIndexRef.current;
    if (previous === index) return;
    displayIndexRef.current = index;
    transitioningRef.current = animateRef.current;
    setTransition(animateRef.current ? { from: previous, to: index, direction: index > previous ? 1 : -1 } : null);
    setDisplayIndex(index);
  }, []);

  const requestYear = useCallback((index: number) => {
    requestedIndexRef.current = index;
    if (!transitioningRef.current) show(index);
  }, [show]);

  const finishTransition = useCallback(() => {
    transitioningRef.current = false;
    if (requestedIndexRef.current !== displayIndexRef.current) show(requestedIndexRef.current);
    else setTransition(null);
  }, [show]);

  return { displayIndex, transition, requestYear, finishTransition };
}
