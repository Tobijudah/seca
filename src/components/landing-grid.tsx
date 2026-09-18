"use client";

import { useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { ease } from "@/lib/animation/motion";
import { buildDots, shuffledRanks, stopDot } from "@/lib/landing-grid/layout";
import { drawSymbol } from "@/lib/landing-grid/symbols";
import { PHONE_QUERY } from "@/lib/media";
import { themeColor } from "@/lib/theme";
import { clamp01 } from "@/lib/utils";
import type { Dot } from "@/types/landing-grid";

const REVEAL_DURATION = 1.2;

export function LandingGrid() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;

    const pink = themeColor("commerce-pink");
    const layout = () => buildDots(host.clientWidth, host.clientHeight, window.matchMedia(PHONE_QUERY).matches);
    let { dots, africa } = layout();
    let revealRanks = shuffledRanks(africa.length);
    let reveal = reducedMotion ? 1 : 0;
    let hovered = new Set<Dot>();
    let previousPointer: { x: number; y: number; time: number } | undefined;
    let pointerSpeed = 0;
    let entrance: gsap.core.Timeline | undefined;
    let drawFrame = 0;
    const fontFamily = getComputedStyle(canvas).fontFamily;

    const draw = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      context.clearRect(0, 0, width, height);

      // Draw faint cells in two batches. The bright cells replace those cells,
      // rather than sitting over a second copy of the grid.
      for (const alpha of [0.05, 0.1]) {
        context.beginPath();
        for (const dot of dots) {
          if (dot.alpha !== alpha || dot.bright) continue;
          context.moveTo(dot.x + dot.radius, dot.y);
          context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        }
        context.globalAlpha = alpha;
        context.fillStyle = pink;
        context.fill();
      }

      for (let index = 0; index < africa.length; index++) {
        const dot = africa[index];
        const light = clamp01((reveal - revealRanks[index] / africa.length * 0.58) / 0.42);
        const alpha = dot.alpha + (1 - dot.alpha) * light;
        context.save();
        context.translate(dot.x, dot.y);
        context.scale(1 + dot.lift * 0.3, 1 + dot.lift * 0.3);
        context.globalAlpha = alpha;
        if (dot.flip < 0.5) {
          context.scale(Math.max(0.001, 1 - dot.flip * 2), 1);
          context.fillStyle = pink;
          context.beginPath();
          context.arc(0, 0, dot.radius, 0, Math.PI * 2);
          context.fill();
        } else {
          context.scale(Math.max(0.001, (dot.flip - 0.5) * 2), 1);
          drawSymbol(context, dot.symbol, dot.radius, fontFamily);
        }
        context.restore();
      }
      context.globalAlpha = 1;
    };

    const queueDraw = () => {
      if (drawFrame) return;
      drawFrame = requestAnimationFrame(() => {
        drawFrame = 0;
        draw();
      });
    };

    const resize = () => {
      for (const dot of africa) stopDot(dot);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = host.clientWidth;
      const height = host.clientHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      ({ dots, africa } = layout());
      revealRanks = shuffledRanks(africa.length);
      hovered = new Set();
      previousPointer = undefined;
      pointerSpeed = 0;
      draw();
      host.classList.add("landing-grid--interactive");
      // Hidden by [data-reveal] until the canvas has drawn its first frame.
      host.style.visibility = "visible";
    };

    // Pointer flips are deliberately outside contextSafe: a canvas can create
    // thousands of short tweens per session, and context.data would retain each
    // one until unmount. Kill the live tweens explicitly in resize/cleanup below.
    const flip = (dot: Dot) => {
      if (reducedMotion) return;
      stopDot(dot);
      dot.tween = gsap.to(dot, {
        flip: 1, duration: 0.21 + dot.scatter * 0.1, ease: ease.out, onUpdate: queueDraw,
        onComplete: () => { dot.scaleTween = gsap.to(dot, { lift: 1, duration: 0.28, ease: ease.soft, onUpdate: queueDraw }); },
      });
      dot.returnCall = gsap.delayedCall(0.85 + dot.rhythm * 0.55, () => {
        dot.scaleTween = gsap.to(dot, { lift: 0, duration: 0.24, ease: ease.return, onUpdate: queueDraw });
        dot.tween = gsap.to(dot, { flip: 0, delay: 0.12, duration: 0.24 + dot.scatter * 0.17, ease: ease.return, onUpdate: queueDraw });
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || reducedMotion) return;
      const bounds = host.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const from = previousPointer ?? { x, y, time: event.timeStamp };
      const dx = x - from.x;
      const dy = y - from.y;
      const segmentLength = dx * dx + dy * dy;
      const speed = Math.sqrt(segmentLength) / Math.max(1, event.timeStamp - from.time);
      const previousSpeed = pointerSpeed;
      pointerSpeed = pointerSpeed * 0.3 + Math.min(speed, 4) * 0.7;
      const radius = africa[0]?.radius ?? 8;
      const narrow = Math.max(13, radius * 2.3);
      const wide = Math.max(34, radius * 6);
      const reachAt = (travel: number) => narrow + (wide - narrow) * Math.min(1, (previousSpeed + (pointerSpeed - previousSpeed) * travel) / 2.3);
      const nextHovered = new Set<Dot>();

      for (const dot of africa) {
        const nearPointer = Math.hypot(dot.x - x, dot.y - y) <= reachAt(1);
        if (nearPointer) nextHovered.add(dot);
        const travel = segmentLength
          ? clamp01(((dot.x - from.x) * dx + (dot.y - from.y) * dy) / segmentLength)
          : 0;
        const distance = Math.hypot(dot.x - from.x - travel * dx, dot.y - from.y - travel * dy);
        const coreReach = reachAt(travel);
        const scatteredFringe = coreReach * (1 + dot.scatter * 0.2);
        if (!hovered.has(dot) && distance <= scatteredFringe && dot.flip < 0.5) flip(dot);
      }

      hovered = nextHovered;
      previousPointer = { x, y, time: event.timeStamp };
    };

    const onPointerLeave = () => {
      hovered.clear();
      previousPointer = undefined;
      pointerSpeed = 0;
    };

    const onTouch = (event: PointerEvent) => {
      if (event.pointerType !== "touch" || reducedMotion || (event.target as Element).closest("a, button")) return;
      const bounds = host.getBoundingClientRect();
      const x = event.clientX - bounds.left;
      const y = event.clientY - bounds.top;
      const closest = africa.reduce<Dot | undefined>((best, dot) => {
        if (!best) return dot;
        return (dot.x - x) ** 2 + (dot.y - y) ** 2 < (best.x - x) ** 2 + (best.y - y) ** 2 ? dot : best;
      }, undefined);
      if (closest && (closest.x - x) ** 2 + (closest.y - y) ** 2 < 24 ** 2) flip(closest);
    };


    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    host.parentElement?.addEventListener("pointermove", onPointerMove as EventListener);
    host.parentElement?.addEventListener("pointerleave", onPointerLeave);
    host.parentElement?.addEventListener("pointerdown", onTouch as EventListener);

    if (!reducedMotion) {
      entrance = gsap.timeline();
      const progress = { value: 0 };
      entrance.to(progress, {
        value: 1,
        duration: REVEAL_DURATION,
        ease: ease.soft,
        delay: 0.33,
        onUpdate() { reveal = progress.value; queueDraw(); },
      });
      [0.1, 0.35, 0.57, 0.78, 0.92].forEach((fraction, order) => {
        entrance?.call(() => {
          const index = revealRanks.indexOf(Math.floor(fraction * (africa.length - 1)));
          if (africa[index]) flip(africa[index]);
        }, [], 0.72 + order * 0.17);
      });
    }

    return () => {
      observer.disconnect();
      host.parentElement?.removeEventListener("pointermove", onPointerMove as EventListener);
      host.parentElement?.removeEventListener("pointerleave", onPointerLeave);
      host.parentElement?.removeEventListener("pointerdown", onTouch as EventListener);
      entrance?.kill();
      if (drawFrame) cancelAnimationFrame(drawFrame);
      for (const dot of africa) stopDot(dot);
    };
  // Re-runs from scratch when the reduced-motion setting changes: the revert stops
  // everything, and the fresh run draws the map already lit and still.
  }, { scope: hostRef, dependencies: [reducedMotion], revertOnUpdate: true });

  return (
    <div
      data-reveal
      className="pointer-events-none absolute inset-[20px_40px_0] bg-[url('/figma/landing-grid.svg')] bg-cover bg-center bg-no-repeat phone:inset-0 phone:bg-[url('/figma/landing-grid-mobile.svg')] [&.landing-grid--interactive]:bg-none"
      aria-hidden="true"
      ref={hostRef}
    >
      <canvas className="block h-full w-full" ref={canvasRef} />
    </div>
  );
}
