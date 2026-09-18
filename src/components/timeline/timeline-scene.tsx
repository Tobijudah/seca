"use client";

import { useRef, type Ref } from "react";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { ease } from "@/lib/animation/motion";
import { concealWords, hideWords, revealWords, splitWords } from "@/lib/animation/reveal";
import { eventPlacement } from "@/lib/timeline/event-placement";
import type { TimelineStop } from "@/types/timeline";
import { SourceChevron } from "./source-chevron";

const motifShape = "absolute block mask-size-[100%_100%] mask-center mask-no-repeat";

function Motif() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-1" aria-hidden="true">
      <span data-entrance-motif className={`${motifShape} top-[34.8%] left-[5.5%] aspect-[396.297/819.452] w-[30.7207%] bg-(--motif-left-color,var(--motif-color)) mask-[url('/figma/motif-left.svg')] phone:top-[34%] phone:-left-40 phone:h-[819.5px] phone:w-[396.3px]`} />
      <span data-entrance-motif className={`${motifShape} top-[29.75%] left-[34.26%] aspect-[296.903/588.407] w-[23.0157%] bg-(--motif-center-color,var(--motif-color)) mask-[url('/figma/motif-center.svg')] phone:top-[53%] phone:left-32.5 phone:h-[588.4px] phone:w-[296.9px]`} />
      <span data-entrance-motif className={`${motifShape} top-[56.8%] left-[63.72%] aspect-[439.913/433.554] w-[34.1018%] bg-(--motif-right-color,var(--motif-color)) mask-[url('/figma/motif-right.svg')] phone:top-[58%] phone:left-80 phone:h-[433.6px] phone:w-[439.9px]`} />
    </div>
  );
}


/** One year's headline and events. During a year change the leaving year stays mounted as an inert outgoing layer. */
function YearContent({ stop, layerRef, outgoing, onOpenSources }: {
  stop: TimelineStop;
  layerRef: Ref<HTMLDivElement>;
  outgoing?: boolean;
  onOpenSources?: (trigger: HTMLButtonElement) => void;
}) {
  return (
    <div className={`absolute inset-0 phone:flex phone:flex-col phone:px-6.25 phone:pt-6 phone:pb-10.5 short-phone:pt-3 ${outgoing ? "pointer-events-none" : ""}`} ref={layerRef} aria-hidden={outgoing || undefined}>
      <h2 data-scene-headline className="absolute top-[9.88%] left-17.5 m-0 w-[min(683px,72%)] text-[48px] leading-[1.2] font-normal tracking-[-.04em] text-commerce-cream opacity-(--headline-opacity) phone:static phone:mb-3.5 phone:w-full phone:flex-none phone:text-[clamp(31px,8vw,43px)] short-phone:mb-2 short-phone:text-[26px] short-phone:leading-[1.1]">{stop.headline}</h2>
      <div className="absolute inset-0 block phone:static phone:flex phone:min-h-0 phone:flex-1 phone:flex-col phone:gap-4.5 phone:overflow-clip short-phone:gap-[10px]" aria-live={outgoing ? undefined : "polite"} aria-atomic={outgoing ? undefined : "true"}>
        {stop.events.map((event, index) => (
          <article data-event-copy className={`absolute w-77.5 max-w-[29%] text-commerce-cream phone:static phone:m-0 phone:w-full phone:max-w-xl phone:first:mt-auto ${eventPlacement(Math.min(stop.events.length, 3), index, stop.period)}`} key={`${stop.id}-${event.title}`}>
            <h3 className="relative z-1 -mb-1.25 table max-w-full bg-(--event-bg) px-1.25 pb-1.25 text-[24px] leading-[1.4] font-bold tracking-tight phone:block phone:w-fit phone:pr-6.75 phone:text-[21px] short-phone:text-[17px] short-phone:leading-[1.25]">
              <span data-event-title>{event.title}</span>
              {!outgoing && <button className="absolute top-[-2.5px] right-[-22.5px] inline-flex size-6 cursor-pointer items-center justify-center border-0 bg-none p-0 text-[10px] leading-none underline underline-offset-2 opacity-70 phone:top-1 phone:right-[5px]" type="button" onClick={(click) => onOpenSources?.(click.currentTarget)} aria-label={`Show source for ${event.title}`}>{index + 1}</button>}
            </h3>
            <p data-event-place className="inline bg-(--event-bg) box-decoration-clone px-1.25 py-0.75 text-[15px] leading-normal font-normal tracking-normal short-phone:text-[12px] short-phone:leading-[1.4]">{event.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

type TimelineSceneProps = {
  stop: TimelineStop;
  outgoingStop: TimelineStop | null;
  direction: 1 | -1;
  entered: boolean;
  reducedMotion: boolean;
  onTransitionEnd: () => void;
  onOpenSources: (trigger: HTMLButtonElement) => void;
};

export function TimelineScene({ stop, outgoingStop, direction, entered, reducedMotion, onTransitionEnd, onOpenSources }: TimelineSceneProps) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const currentLayerRef = useRef<HTMLDivElement>(null);
  const outgoingLayerRef = useRef<HTMLDivElement>(null);
  const lastStopRef = useRef<string | null>(null);

  useGSAP(() => {
    const current = currentLayerRef.current;
    const outgoing = outgoingLayerRef.current;
    if (!current) return;
    if (reducedMotion) {
      lastStopRef.current = stop.id;
      if (outgoing) onTransitionEnd();
      return;
    }
    if (!entered) {
      gsap.set(current, { autoAlpha: 0 });
      return;
    }
    const newStop = lastStopRef.current !== stop.id;
    lastStopRef.current = stop.id;
    if (outgoing) {
      const selectors = "[data-scene-headline], [data-event-title], [data-event-place]";
      const outgoingSplits = Array.from(outgoing.querySelectorAll<HTMLElement>(selectors)).map(splitWords);
      const incomingSplits = Array.from(current.querySelectorAll<HTMLElement>(selectors)).map(splitWords);
      const incomingWords = incomingSplits.flatMap((split) => split.words);
      const outgoingArticles = Array.from(outgoing.querySelectorAll<HTMLElement>("[data-event-copy]"));
      const incomingArticles = Array.from(current.querySelectorAll<HTMLElement>("[data-event-copy]"));
      const backgroundMask = direction === 1 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)";
      const visibleBackground = direction === 1 ? "inset(0 0 0% 0)" : "inset(0% 0 0 0)";
      const wordStagger = (index: number) => index % 2 === 0 && index !== 0 ? 0.025 : 0.04;
      const exitDuration = Math.max(...outgoingSplits.map((split, index) => 0.3 + Math.max(0, split.words.length - 1) * wordStagger(index)));
      hideWords(incomingWords, direction);
      gsap.set(incomingArticles, { clipPath: backgroundMask });
      const timeline = gsap.timeline({ onComplete: onTransitionEnd });
      outgoingSplits.forEach((split, index) => concealWords(timeline, split.words, 0, { duration: 0.3, stagger: wordStagger(index), direction }));
      timeline.to(outgoingArticles, { clipPath: backgroundMask, duration: 0.24, ease: ease.in }, Math.max(0, exitDuration - 0.24));
      timeline.to(incomingArticles, { clipPath: visibleBackground, duration: 0.62, ease: ease.wipe }, exitDuration);
      incomingSplits.forEach((split, index) => revealWords(timeline, split.words, exitDuration + (index === 0 ? 0 : 0.25), { duration: 0.52, stagger: wordStagger(index), direction }));
      return;
    }
    if (!newStop) return;

    const headline = current.querySelector<HTMLElement>("[data-scene-headline]");
    const articles = Array.from(current.querySelectorAll<HTMLElement>("[data-event-copy]"));
    const targets = [headline, ...current.querySelectorAll<HTMLElement>("[data-event-title], [data-event-place]")].filter((item): item is HTMLElement => Boolean(item));
    const splits = targets.map(splitWords);
    gsap.set(current, { autoAlpha: 1 });
    gsap.set(articles, { autoAlpha: 0 });
    hideWords(splits.flatMap((split) => split.words));
    const timeline = gsap.timeline();
    if (headline && splits[0]) {
      timeline.set(headline, { visibility: "visible" }, 0);
      revealWords(timeline, splits[0].words, 0, { duration: 0.75, stagger: 0.04 });
    }
    articles.forEach((article, index) => {
      const title = article.querySelector<HTMLElement>("[data-event-title]");
      const description = article.querySelector<HTMLElement>("[data-event-place]");
      const words = [title, description].flatMap((target) => target ? splits[targets.indexOf(target)]?.words ?? [] : []);
      const at = 0.16 + index * 0.13;
      timeline.to(article, { autoAlpha: 1, duration: 0.12 }, at);
      revealWords(timeline, words, at, { duration: 0.68, stagger: 0.025 });
    });
    // Splits and timelines belong to the hook's context; revertOnUpdate restores the
    // original text before React renders the next year.
  }, { scope: sceneRef, dependencies: [stop.id, outgoingStop?.id, entered, reducedMotion], revertOnUpdate: true });

  return (
    <div className="relative isolate h-full min-w-0 overflow-clip phone:h-[calc(100%-104px)]" ref={sceneRef}>
      <Motif />
      {outgoingStop && <YearContent key={`outgoing-${outgoingStop.id}`} stop={outgoingStop} layerRef={outgoingLayerRef} outgoing />}
      <YearContent key={`current-${stop.id}`} stop={stop} layerRef={currentLayerRef} onOpenSources={onOpenSources} />
      <button className="absolute right-11.5 bottom-3 cursor-pointer rounded-sm border-0 bg-(--phase-bg) px-1.5 py-0.5 text-[15px] leading-5 text-commerce-cream phone:right-4.75 phone:bottom-2.25" type="button" onClick={(click) => onOpenSources(click.currentTarget)} aria-haspopup="dialog">Sources <SourceChevron className="ml-1.25" /></button>
    </div>
  );
}
