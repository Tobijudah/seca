"use client";

import { useRef, useState, type RefObject } from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { ease } from "@/lib/animation/motion";
import { hideWords, revealWords } from "@/lib/animation/reveal";

type Options = {
  scopeRef: RefObject<HTMLElement | null>;
  stageRef: RefObject<HTMLElement | null>;
  indicatorRef: RefObject<HTMLElement | null>;
  reducedMotion: boolean;
  isPhone: boolean;
};

/**
 * Plays the rail's entrance the first time the stage is 30% in view: period names rise
 * through their masks, years stagger in top to bottom while the rail lines draw
 * alongside them, the silhouettes fade up, and the year marker appears last, once every
 * year has arrived. Returns whether the timeline has entered, which gates the first
 * year's text reveal.
 *
 * Only the visible rail animates — the phone strip or the desktop column.
 */
export function useTimelineEntrance({ scopeRef, stageRef, indicatorRef, reducedMotion, isPhone }: Options) {
  const [entered, setEntered] = useState(false);
  // Resizing across the phone breakpoint re-runs the hook; the entrance must not replay.
  const enteredRef = useRef(false);
  const markEntered = () => {
    enteredRef.current = true;
    setEntered(true);
  };

  useGSAP((_context, contextSafe) => {
    const stage = stageRef.current;
    if (!stage || !contextSafe || enteredRef.current) return;
    if (reducedMotion) {
      markEntered();
      return;
    }
    const periodTexts = stage.querySelectorAll<HTMLElement>(isPhone ? '[data-entrance-period="phone"]' : '[data-entrance-period="desktop"]');
    const yearTexts = stage.querySelectorAll<HTMLElement>(isPhone ? '[data-entrance-year="phone"] > span' : '[data-entrance-year="desktop"] > span');
    const railLines = stage.querySelectorAll<HTMLElement>(isPhone ? '[data-entrance-line="phone"]' : '[data-entrance-line="desktop"]');
    const motifs = stage.querySelectorAll<HTMLElement>("[data-entrance-motif]");
    const indicator = isPhone ? null : indicatorRef.current;

    hideWords([...periodTexts]);
    gsap.set(yearTexts, { autoAlpha: 0, y: 10 });
    gsap.set(railLines, isPhone ? { scaleX: 0 } : { scaleY: 0 });
    gsap.set(motifs, { autoAlpha: 0 });
    if (indicator) gsap.set(indicator, { autoAlpha: 0, scale: 0.86, transformOrigin: "50% 50%" });

    // Runs from an observer callback, after this hook has returned, so it is wrapped
    // to keep the timeline inside the hook's context and reverted with it.
    const play = contextSafe(() => {
      const entrance = gsap.timeline();
      revealWords(entrance, [...periodTexts], 0, { duration: 0.7, stagger: 0.1 });
      entrance.to(yearTexts, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.045, ease: ease.out, clearProps: "opacity,visibility,transform" }, 0.16);
      entrance.to(railLines, { [isPhone ? "scaleX" : "scaleY"]: 1, duration: 0.9, ease: ease.draw, clearProps: "transform" }, 0.1);
      if (indicator) entrance.to(indicator, { autoAlpha: 1, scale: 1, duration: 0.36, ease: ease.out, clearProps: "opacity,visibility,transform" }, 1.4);
      entrance.to(motifs, { autoAlpha: 1, duration: 0.95, stagger: 0.1, ease: ease.soft }, 0.35);
      entrance.call(markEntered, [], 0.55);
    });

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      play();
    }, { threshold: 0.3 });
    observer.observe(stage);
    return () => observer.disconnect();
  }, { scope: scopeRef, dependencies: [reducedMotion, isPhone], revertOnUpdate: true });

  return entered;
}
