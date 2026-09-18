"use client";

import { useEffect, useRef, type KeyboardEvent, type RefObject } from "react";
import { periods, timeline } from "@/data/timeline";
import { markerTint, periodBackground, railLabelPlacement } from "@/lib/timeline/period-styles";
import { railTop, yearPositions } from "@/lib/timeline/rail-geometry";

type YearRailProps = {
  activeIndex: number;
  indicatorRef: RefObject<HTMLSpanElement | null>;
  reducedMotion: boolean;
  onYearSelect: (index: number) => void;
};

export function YearRail({ activeIndex, indicatorRef, reducedMotion, onYearSelect }: Readonly<YearRailProps>) {
  const activePeriod = timeline[activeIndex].period;
  const mobileYearsRef = useRef<HTMLDivElement>(null);

  // Each rail is a single Tab stop. Arrow keys (and Home/End) move between years and
  // select as they go, so the next Tab lands in that year's content instead of
  // passing through every remaining year first.
  function onRailKeyDown(event: KeyboardEvent<HTMLElement>) {
    const focused = (event.target as HTMLElement).closest<HTMLElement>("[data-year-index]");
    const current = focused ? Number(focused.dataset.yearIndex) : activeIndex;
    const steps: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next: number | undefined;
    if (event.key in steps) next = Math.min(timeline.length - 1, Math.max(0, current + steps[event.key]));
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = timeline.length - 1;
    if (next === undefined || next === current) return;
    event.preventDefault();
    onYearSelect(next);
    event.currentTarget.querySelector<HTMLElement>(`[data-year-index="${next}"]`)?.focus({ preventScroll: true });
  }

  // Keep the active year centred in the phone strip as it changes.
  useEffect(() => {
    const strip = mobileYearsRef.current;
    const active = strip?.querySelector<HTMLElement>(`[data-year-index="${activeIndex}"]`);
    if (!strip || !active) return;
    strip.scrollTo({ left: active.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2, behavior: reducedMotion ? "instant" : "smooth" });
  }, [activeIndex, reducedMotion]);

  return (
    <>
      <nav className="relative z-3 block h-full bg-[linear-gradient(180deg,var(--color-commerce-yellow)_31.499%,var(--color-commerce-orange)_32.61%,var(--color-commerce-orange)_69.762%,var(--color-commerce-dark-green)_70.794%)] text-white phone:hidden" aria-label="Jump to a year">
        <span data-entrance-line="desktop" className="pointer-events-none absolute inset-y-0 left-10 w-px origin-top bg-white/55" aria-hidden="true" />
        <span data-entrance-line="desktop" className="pointer-events-none absolute inset-y-0 right-0 w-px origin-top bg-white/65" aria-hidden="true" />
        {periods.map((period) => (
          <span className={`absolute left-2.5 block w-5 rotate-180 overflow-hidden text-center text-[13px] leading-4.5 font-bold tracking-normal uppercase [writing-mode:vertical-rl] ${railLabelPlacement[period.id]}`} key={period.id}>
            <span data-entrance-period="desktop" className="inline-block">{period.label}</span>
          </span>
        ))}
        {/* display: contents keeps the absolutely placed years laid out against the rail. */}
        <div className="contents" role="toolbar" aria-orientation="vertical" aria-label="Years" onKeyDown={onRailKeyDown}>
          {timeline.map((stop, index) => (
            <button
              className={`absolute left-10 flex w-27.5 -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-none p-0 text-center text-[13px] leading-[1.35] tracking-[-.01em] transition-[opacity,font-weight] duration-280 ease-[ease-out] ${index === 0 ? "h-12" : "h-6"} ${index === activeIndex ? "font-semibold opacity-100" : "font-normal opacity-55"}`}
              data-entrance-year="desktop"
              data-year-index={index}
              type="button"
              key={stop.id}
              style={{ top: `${railTop(yearPositions[index])}%` }}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => onYearSelect(index)}
              aria-current={index === activeIndex ? "step" : undefined}
              aria-label={`Jump to ${stop.label}`}
            >
              <span>{index === 0 ? <>Early 90s/<br />2000s</> : stop.label}</span>
            </button>
          ))}
        </div>
        <span
          className={`pointer-events-none absolute top-[11.975%] left-35.25 z-5 block size-4.5 -translate-y-1/2 bg-[url('/figma/year-indicator.svg')] bg-contain bg-center bg-no-repeat ${markerTint[activePeriod]}`}
          ref={indicatorRef}
          aria-hidden="true"
        />
      </nav>

      <nav className={`hidden phone:absolute phone:bottom-0 phone:z-4 phone:flex phone:h-26 phone:w-full phone:flex-col phone:text-commerce-cream phone:transition-[background-color] phone:duration-650 phone:ease-[ease-in-out] ${periodBackground[activePeriod]}`} aria-label="Jump to a year">
        <span data-entrance-line="phone" className="absolute top-0 right-0 left-0 z-1 h-px origin-left bg-white/35" aria-hidden="true" />
        <div className="grid h-7.5 flex-none grid-cols-[30%_42%_28%]" aria-hidden="true">
          {periods.map((period) => (
            <span className={`flex items-center justify-center overflow-hidden text-[10px] font-[650] whitespace-nowrap ${periodBackground[period.id]}`} key={period.id}>
              <span data-entrance-period="phone" className="inline-block">{period.label}</span>
            </span>
          ))}
        </div>
        <div role="toolbar" aria-orientation="horizontal" aria-label="Years" onKeyDown={onRailKeyDown} className="flex min-h-0 snap-x snap-proximity items-center gap-1 overflow-x-auto overflow-y-hidden scrollbar-none [&::-webkit-scrollbar]:hidden" ref={mobileYearsRef}>
          {timeline.map((stop, index) => (
            <button
              type="button"
              key={stop.id}
              data-year-index={index}
              data-entrance-year="phone"
              className={`max-w-32.5 min-h-16 flex-[0_0_auto] cursor-pointer snap-center border-0 bg-none px-2.25 py-3 leading-[1.1] text-commerce-cream transition-[opacity,font-weight,font-size] duration-280 ease-[ease-out] ${index === 0 ? "min-w-28" : "min-w-14"} ${index === activeIndex ? "text-[17px] font-[750] opacity-100" : "text-[13px] opacity-65"}`}
              tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => onYearSelect(index)}
              aria-current={index === activeIndex ? "step" : undefined}
              aria-label={`Jump to ${stop.label}`}
            ><span>{stop.label}</span></button>
          ))}
        </div>
      </nav>
    </>
  );
}
