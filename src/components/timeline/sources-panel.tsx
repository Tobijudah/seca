"use client";

import { useRef, type RefObject } from "react";
import { Drawer } from "@base-ui/react/drawer";
import { useIsPhone } from "@/hooks/use-media-query";
import type { TimelineStop } from "@/types/timeline";
import { SourceChevron } from "./source-chevron";

type SourcesPanelProps = {
  stop: TimelineStop;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  openerRef: RefObject<HTMLButtonElement | null>;
};

export function SourcesPanel({ stop, open, onOpenChange, openerRef }: SourcesPanelProps) {
  const isMobile = useIsPhone();
  const closeRef = useRef<HTMLButtonElement>(null);

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection={isMobile ? "down" : "right"}>
      <Drawer.Portal className="pointer-events-none fixed inset-0 z-50">
        <Drawer.Backdrop className="pointer-events-auto fixed inset-0 bg-[rgba(18,18,18,.35)] opacity-100 transition-opacity duration-220 ease-[ease-out] data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Drawer.Viewport className="pointer-events-none fixed inset-0 flex justify-end phone:items-end">
          <Drawer.Popup
            className="pointer-events-auto flex h-full w-[min(460px,100%)] translate-x-(--drawer-swipe-movement-x,0px) flex-col bg-paper text-ink shadow-[-10px_0_40px_rgba(0,0,0,.13)] transition-[translate] duration-220 ease-[ease-out] data-ending-style:translate-x-full data-starting-style:translate-x-full data-swiping:transition-none phone:h-[min(78svh,620px)] phone:w-full phone:translate-x-0 phone:translate-y-(--drawer-swipe-movement-y,0px) phone:rounded-t-[18px] phone:data-ending-style:translate-x-0 phone:data-ending-style:translate-y-full phone:data-starting-style:translate-x-0 phone:data-starting-style:translate-y-full"
            initialFocus={() => { closeRef.current?.focus({ preventScroll: true }); return false; }}
            finalFocus={() => { if (openerRef.current?.isConnected) openerRef.current.focus({ preventScroll: true }); return false; }}
          >
            <div className="hidden phone:mx-auto phone:mt-2.75 phone:block phone:h-1.25 phone:w-9 phone:flex-none phone:rounded-full phone:bg-handle" aria-hidden="true" />
            <Drawer.Content className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-7.5 pt-8.5 pb-15 phone:px-6.25 phone:pt-4 phone:pb-12.5">
              <div className="flex items-start justify-between gap-5 border-b border-line pb-7">
                <div><p className="mb-1.75 text-[11px] tracking-[.13em] uppercase">Sources</p><Drawer.Title className="text-[38px] tracking-tighter" id="sources-title">{stop.label}</Drawer.Title></div>
                <Drawer.Close className="size-9.5 cursor-pointer rounded-full border border-line-strong bg-none text-[27px] leading-none" ref={closeRef} type="button" aria-label="Close sources">×</Drawer.Close>
              </div>
              <ol className="list-decimal pl-6.75">
                {stop.events.map((event) => (
                  <li className="border-b border-line-soft pt-6.25 pb-6.75 pl-1.25" key={event.title}>
                    <h3 className="mb-2.5 text-[19px] leading-[1.3]">{event.title}</h3>
                    <p className="mb-2 text-[13px] text-ink-muted">{event.place} · {event.source.publisher}</p>
                    <p className="mt-2.75 mb-3.25 text-[15px] leading-[1.55] text-ink">{event.description}</p>
                    <a className="text-[14px] leading-[1.4] underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-180 ease-[ease-out] hover:decoration-current focus-visible:decoration-current" href={event.source.url} target="_blank" rel="noopener noreferrer">{event.source.title} <SourceChevron className="ml-1.25 -rotate-135" /></a>
                  </li>
                ))}
              </ol>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
