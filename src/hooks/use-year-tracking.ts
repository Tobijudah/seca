"use client";

import { useRef, useState, type RefObject } from "react";
import { timeline } from "@/data/timeline";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { ease } from "@/lib/animation/motion";
import { paintBoundary, settledPaint } from "@/lib/timeline/period-paint";
import { markerY, railTop, stopPosition, yearPositions } from "@/lib/timeline/rail-geometry";

type Options = {
  stageRef: RefObject<HTMLElement | null>;
  markerRef: RefObject<HTMLElement | null>;
  stepRefs: RefObject<(HTMLElement | null)[]>;
  reducedMotion: boolean;
  /** Called with the nearest stop whenever it changes. Must be stable. */
  onYearChange: (index: number) => void;
};

/** Height fraction of the viewport at which the reading position is taken. */
const READING_LINE = 0.55;
/** Scroll idle time before a part-crossed period boundary finishes on its own. */
const SETTLE_DELAY = 0.16;
const YEAR_HISTORY_ENTRY = "__timelineYearEntry";

/** Land the step's centre on the same reading line used to position the rail marker. */
function scrollToStep(step: HTMLElement, behavior: ScrollBehavior) {
  const center = step.getBoundingClientRect().top + window.scrollY + step.offsetHeight / 2;
  window.scrollTo({ top: center - window.innerHeight * READING_LINE, behavior });
}

/**
 * Follows native scroll through the timeline. Each year has a physical scroll step
 * behind the sticky stage; nothing intercepts wheel or touch input.
 *
 * On every scroll it moves the rail marker continuously, reports the nearest year, and
 * paints the period colours part-way across a boundary. When scrolling stops mid-
 * boundary, the colours finish on the nearer period rather than resting mixed. A click
 * on a distant year in another period plays the boundary sweep that the instant jump
 * skipped over.
 */
export function useYearTracking({ stageRef, markerRef, stepRefs, reducedMotion, onYearChange }: Options) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const pendingJumpRef = useRef<{ from: number; to: number } | null>(null);
  const animateMarkerToRef = useRef<((index: number) => void) | null>(null);

  useGSAP((_context, contextSafe) => {
    const stage = stageRef.current;
    const marker = markerRef.current;
    const steps = (stepRefs.current ?? []).filter((step): step is HTMLElement => Boolean(step));
    if (!stage || !marker || !steps.length || !contextSafe) return;

    // Scroll fires constantly, and GSAP keeps every animation created inside a context
    // until it reverts. So the scroll path creates nothing per event: the marker uses a
    // quick setter, and the settle timer is one delayed call restarted on each event.
    const setMarkerTop = gsap.quickSetter(marker, "top", "%");
    // One reusable tween for distant year selections; scroll itself still drives
    // the marker directly, with no tween created for each scroll event.
    let markerJumpTarget: number | null = null;
    const markerTo = gsap.quickTo(marker, "top", {
      duration: 0.65,
      ease: ease.move,
      onComplete: () => {
        markerJumpTarget = null;
        setMarkerTop(railTop(markerY(stopPosition(centers, window.scrollY + window.innerHeight * READING_LINE))));
      },
    });
    animateMarkerToRef.current = (index) => {
      markerJumpTarget = index;
      markerTo(railTop(yearPositions[index]) / 100 * (marker.parentElement?.clientHeight ?? stage.clientHeight));
    };
    let centers: number[] = [];
    let settleTween: gsap.core.Tween | undefined;
    let jumpSweep: gsap.core.Tween | undefined;
    let jumpTarget: number | null = null;
    let lastBoundary = { from: timeline[0].period, to: timeline[0].period, fraction: 0 };

    const settle = contextSafe(() => {
      const { from, to, fraction } = lastBoundary;
      if (from === to) return;
      const period = timeline[activeIndexRef.current].period;
      const remaining = period === from ? fraction : 1 - fraction;
      settleTween = gsap.to(stage, {
        ...settledPaint(period, period === from ? "earlier" : "later"),
        duration: reducedMotion ? 0 : 0.35 + remaining * 1.1,
        ease: ease.sweep,
        overwrite: true,
      });
    });
    const settleTimer = gsap.delayedCall(SETTLE_DELAY, settle).pause();

    const sweepForJump = contextSafe((from: number, to: number) => {
      const forward = to > from;
      const earlier = timeline[forward ? from : to].period;
      const later = timeline[forward ? to : from].period;
      const progress = { value: forward ? 0 : 1 };
      jumpTarget = to;
      jumpSweep = gsap.to(progress, {
        value: forward ? 1 : 0,
        duration: reducedMotion ? 0 : 1.15,
        ease: ease.sweep,
        onUpdate: () => paintBoundary(stage, earlier, later, progress.value),
        onComplete: () => { jumpTarget = null; },
      });
      paintBoundary(stage, earlier, later, progress.value);
    });

    const measure = () => {
      centers = steps.map((step) => step.getBoundingClientRect().top + window.scrollY + step.offsetHeight / 2);
    };

    const update = () => {
      const position = stopPosition(centers, window.scrollY + window.innerHeight * READING_LINE);
      if (markerJumpTarget !== null && Math.round(position) !== markerJumpTarget) {
        markerTo.tween.pause();
        markerJumpTarget = null;
      }
      if (markerJumpTarget === null) setMarkerTop(railTop(markerY(position)));

      const nearest = Math.round(position);
      if (nearest !== activeIndexRef.current) {
        activeIndexRef.current = nearest;
        setActiveIndex(nearest);
        onYearChange(nearest);
      }

      const pendingJump = pendingJumpRef.current;
      if (pendingJump && nearest === pendingJump.to) {
        pendingJumpRef.current = null;
        settleTimer.pause();
        settleTween?.kill();
        jumpSweep?.kill();
        sweepForJump(pendingJump.from, pendingJump.to);
        return;
      }
      // Leave a jump's sweep alone while it plays; any other scroll takes over from it.
      if (jumpTarget === nearest && jumpSweep?.isActive()) return;
      jumpSweep?.kill();
      jumpTarget = null;
      settleTween?.kill();

      const lower = Math.min(Math.floor(position), timeline.length - 1);
      const upper = Math.min(lower + 1, timeline.length - 1);
      lastBoundary = { from: timeline[lower].period, to: timeline[upper].period, fraction: position - lower };
      paintBoundary(stage, lastBoundary.from, lastBoundary.to, lastBoundary.fraction);
      settleTimer.restart(true);
    };

    const onResize = () => {
      markerTo.tween.pause();
      markerJumpTarget = null;
      measure();
      update();
    };
    const onManualScroll = () => {
      if (markerJumpTarget === null) return;
      markerTo.tween.pause();
      markerJumpTarget = null;
      update();
    };
    measure();
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("wheel", onManualScroll, { passive: true });
    window.addEventListener("touchstart", onManualScroll, { passive: true });

    let frame = 0;
    const restoreYearLink = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      const hashIndex = timeline.findIndex((stop) => `year-${stop.id}` === hash);
      if (hashIndex < 0) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        scrollToStep(steps[hashIndex], "instant");
        update();
      });
    };
    // Handle both an initial deep link and later back/forward or anchor navigation.
    restoreYearLink();
    window.addEventListener("popstate", restoreYearLink);
    window.addEventListener("hashchange", restoreYearLink);

    return () => {
      animateMarkerToRef.current = null;
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onManualScroll);
      window.removeEventListener("touchstart", onManualScroll);
      window.removeEventListener("popstate", restoreYearLink);
      window.removeEventListener("hashchange", restoreYearLink);
    };
  }, { dependencies: [reducedMotion, onYearChange], revertOnUpdate: true });

  /** Scrolls to a year's own scroll step, so the page position always matches the year shown. */
  function jumpToYear(index: number) {
    const step = stepRefs.current?.[index];
    if (!step) return;
    const current = activeIndexRef.current;
    const adjacent = Math.abs(index - current) <= 1;
    pendingJumpRef.current = !adjacent && timeline[index].period !== timeline[current].period ? { from: current, to: index } : null;
    const hash = `#year-${timeline[index].id}`;
    if (window.location.hash !== hash) {
      // Keep the entry the visitor arrived on. Later year selections can reuse
      // our own entry without filling the Back stack with every selection.
      const state = { ...(window.history.state ?? {}), [YEAR_HISTORY_ENTRY]: true };
      if (window.history.state?.[YEAR_HISTORY_ENTRY]) window.history.replaceState(state, "", hash);
      else window.history.pushState(state, "", hash);
    }
    if (!adjacent && !reducedMotion) animateMarkerToRef.current?.(index);
    scrollToStep(step, adjacent && !reducedMotion ? "smooth" : "instant");
  }

  return { activeIndex, jumpToYear };
}
