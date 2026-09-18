"use client";

import { useRef, useState } from "react";
import { timeline } from "@/data/timeline";
import { useIsPhone, usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useTimelineEntrance } from "@/hooks/use-timeline-entrance";
import { useYearTracking } from "@/hooks/use-year-tracking";
import { useYearTransition } from "@/hooks/use-year-transition";
import { stageTheme } from "@/lib/timeline/period-styles";
import { SourcesPanel } from "./sources-panel";
import { TimelineScene } from "./timeline-scene";
import { YearRail } from "./year-rail";

/**
 * The commerce timeline: a sticky stage (year rail and scene) over one invisible scroll
 * step per year. Scrolling the steps drives everything on the stage.
 */
export function Timeline() {
  const reducedMotion = usePrefersReducedMotion();
  const isPhone = useIsPhone();
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sourceOpenerRef = useRef<HTMLButtonElement>(null);

  const entered = useTimelineEntrance({ scopeRef: sectionRef, stageRef, indicatorRef, reducedMotion, isPhone });
  const { displayIndex, transition, requestYear, finishTransition } = useYearTransition({ animate: entered && !reducedMotion });
  const { activeIndex, jumpToYear } = useYearTracking({ stageRef, markerRef: indicatorRef, stepRefs, reducedMotion, onYearChange: requestYear });

  const displayStop = timeline[displayIndex];
  const outgoingStop = transition?.to === displayIndex ? timeline[transition.from] : null;

  function openSources(trigger: HTMLButtonElement) {
    sourceOpenerRef.current = trigger;
    setSourcesOpen(true);
  }

  function selectYear(index: number) {
    setSourcesOpen(false);
    jumpToYear(index);
  }

  return (
    <section className="relative" id="timeline" ref={sectionRef} aria-label="Commerce timeline">
      <div
        className={`sticky top-0 z-2 grid h-svh grid-cols-[150px_minmax(0,1fr)] overflow-clip bg-[linear-gradient(90deg,var(--phase-from)_calc(var(--phase-split)-10%),var(--phase-to)_calc(var(--phase-split)+10%))] text-commerce-cream [--phase-from:var(--color-commerce-yellow)] [--phase-split:122%] [--phase-to:var(--color-commerce-yellow)] phone:block phone:h-dvh ${stageTheme[timeline[activeIndex].period]}`}
        ref={stageRef}
      >
        <YearRail activeIndex={activeIndex} indicatorRef={indicatorRef} reducedMotion={reducedMotion} onYearSelect={selectYear} />
        <TimelineScene
          stop={displayStop}
          outgoingStop={outgoingStop}
          direction={transition?.direction ?? 1}
          entered={entered}
          reducedMotion={reducedMotion}
          onTransitionEnd={finishTransition}
          onOpenSources={openSources}
        />
      </div>
      <div className="pointer-events-none relative z-0 mt-[-100svh] phone:mt-[-100dvh]" aria-hidden="true">
        {timeline.map((stop, index) => (
          <div className="h-[76svh] min-h-130 first:h-svh last:h-[95svh] phone:first:h-dvh" id={`year-${stop.id}`} key={stop.id} ref={(element) => { stepRefs.current[index] = element; }} />
        ))}
      </div>
      <SourcesPanel stop={displayStop} open={sourcesOpen} onOpenChange={setSourcesOpen} openerRef={sourceOpenerRef} />
    </section>
  );
}
