"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/animation/gsap";
import { ease } from "@/lib/animation/motion";
import { hideWords, revealWords, splitWords } from "@/lib/animation/reveal";
import { useIsPhone, usePrefersReducedMotion } from "@/hooks/use-media-query";
import { LandingGrid } from "@/components/landing-grid";

function PaystackMark() {
  return (
    <span className="inline-flex h-7.5 items-center gap-1.75" role="img" aria-label="Paystack">
      <Image src="/figma/paystack-mark.svg" alt="" width={19} height={21} unoptimized />
      <Image src="/figma/paystack-wordmark.svg" alt="" width={94} height={21} unoptimized />
    </span>
  );
}

export function Landing() {
  const landingRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const mobile = useIsPhone();
  const reducedMotion = usePrefersReducedMotion();

  useGSAP(() => {
    const kickerElement = kickerRef.current;
    const headingElement = headingRef.current;
    const descriptionElement = descriptionRef.current;
    const button = buttonRef.current;
    if (!kickerElement || !headingElement || !descriptionElement || !button) return;
    // Hidden by [data-reveal] until now; with reduced motion they simply appear.
    if (reducedMotion) {
      gsap.set([kickerElement, headingElement, descriptionElement, button], { visibility: "visible" });
      return;
    }
    const kicker = splitWords(kickerElement);
    const heading = splitWords(headingElement);
    const description = splitWords(descriptionElement);
    const wordDuration = mobile ? 0.8 : 0.75;
    const wordStagger = mobile ? 0.1 : 0.04;
    hideWords([...kicker.words, ...heading.words, ...description.words]);
    gsap.set([kickerElement, headingElement, descriptionElement], { visibility: "visible" });
    const entrance = gsap.timeline();
    revealWords(entrance, kicker.words, 0.1, { duration: wordDuration, stagger: wordStagger });
    revealWords(entrance, heading.words, 0.18, { duration: wordDuration, stagger: wordStagger });
    revealWords(entrance, description.words, 0.32, { duration: wordDuration, stagger: mobile ? 0.03 : 0.025 });
    entrance.fromTo(button, { autoAlpha: 0, scale: 0.75, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: mobile ? 0.36 : 0.38, ease: ease.out, clearProps: "transform" }, 0.56);
    // The splits belong to the hook's context, which restores the original text on revert.
  }, { scope: landingRef, dependencies: [mobile, reducedMotion], revertOnUpdate: true });

  return (
    <section className="relative min-h-svh overflow-clip bg-wine text-commerce-cream" id="top" aria-labelledby="page-title" ref={landingRef}>
      <div className="relative min-h-svh w-full">
        <header className="absolute top-10 right-10 left-10 z-2 flex h-7.5 items-center justify-between phone:top-6.75 phone:right-6.25 phone:left-6.25">
          <PaystackMark />
          <nav className="phone:hidden" aria-label="Report navigation"><a className="border-0 p-0 text-[16px] leading-7.5 font-normal no-underline" href="#timeline">Commerce Timeline</a></nav>
        </header>
        <LandingGrid />
        <div className="absolute top-58.25 left-38.25 z-2 m-0 w-91.75 p-0 phone:top-[clamp(185px,25svh,275px)] phone:left-6.25 phone:w-[min(367px,calc(100%-50px))]">
          <p ref={kickerRef} data-reveal className="mb-2 text-[32px] leading-normal font-normal text-commerce-cream/50 phone:text-[26px]">State of</p>
          <h1 ref={headingRef} data-reveal className="
          text-[56px] leading-[1.2] font-bold tracking-tight phone:text-[clamp(44px,11vw,56px)]" id="page-title" aria-label="Ecommerce in Africa">Ecommerce<br />in Africa</h1>
          <p ref={descriptionRef} data-reveal className="mt-8 text-[18px] leading-[1.7] font-normal text-commerce-cream phone:max-w-77.5 phone:text-[16px] phone:leading-[1.6]">A comprehensive review of the ground truth of ecommerce and the biggest ecommerce related trends. Compiled by Paystack.</p>
          <a ref={buttonRef} data-reveal className="mt-15.75 inline-flex min-h-13.5 min-w-47 items-center justify-center rounded-lg bg-pink-deep px-6 py-3 text-[16px] font-semibold text-white no-underline transition-[background-color,translate] duration-160 ease-[ease] hover:-translate-y-0.5 hover:bg-pink-deep-hover active:translate-y-0 phone:mt-9" href="#timeline">Explore the Report</a>
        </div>
      </div>
    </section>
  );
}
