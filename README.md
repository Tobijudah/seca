# State of E-commerce in Africa

An interactive timeline based on Paystack's supplied Figma design.

- [Live site](https://seca.tobiju.com)
- [Source code](https://github.com/Tobijudah/seca)

## Run locally

### Prerequisites

Node.js and pnpm 10.28.1.

### Install and start

```sh
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000).

### Production checks

```sh
pnpm typecheck
pnpm lint
pnpm build
```

For the browser accessibility audit, install the official `@playwright/cli` and run `pnpm a11y http://localhost:3000/`. The audit reports the known contrast issues below.

## Key implementation decisions

- I used Next.js and React, GSAP for animation, and Tailwind CSS for styling. The site builds as a static export.
- I drew the landing grid on a canvas to animate its dots and symbol flips. Most text enters through masked word reveals.
- I kept normal page scrolling for the timeline. A sticky scene responds to the current year, and readers can also select a year directly. The year controls form one Tab stop: arrow keys move between years, Home and End jump to the first and last year, and the next Tab moves into that year's content. Sources can be opened by keyboard; Escape closes the drawer and returns focus to its trigger.
- On mobile, I moved the year strip to the bottom.
- I built Sources with Base UI's Drawer so its focus and dismissal behaviour comes from an accessible component.
- I added sourced events through 2020 rather than leaving visible years empty. The number of events varies by year. Chapters without content are not linked.

## Assumptions

- The page serves people involved in African commerce and fintech, as well as readers interested in the region's history.
- The Figma frames show visual states but do not specify the transitions or a mobile layout, so I designed those behaviours.
- The illustrations are abstract motifs. The landing symbols shown on hover are illustrative, not a geographic data map.

## Tradeoffs

- I kept cream text on the yellow and orange periods to preserve the design. Some text fails WCAG AA contrast: approximately 1.75:1 on yellow and 3.12:1 for small text on orange. I would resolve this with the designer before a production release.
- Historical events are stored in code rather than a CMS. A larger report would need an editorial workflow and ongoing source review.
- The entrance waits for JavaScript to set up its text masks, avoiding a flash before the animation but delaying the landing text. Median mobile Largest Contentful Paint across three Lighthouse runs was 2.44 seconds; about 1.7 seconds was render delay. I would revisit that balance in production.

## AI use

I used Claude Code and Codex mainly to turn my direction into code, research historical events, and help inspect the result in a browser. I set the art direction and decided how the page should move, respond to scrolling, work on mobile, and reveal its sources. I rejected the AI's motion proposals. I accepted animation implementation details, then changed the code structure and GSAP usage where they did not follow React guidance or match the intended behaviour.

I validated the result through browser reviews of the layout and motion, a production build, typecheck, lint, the accessibility script, and Lighthouse. AI drafted descriptions for added events; I reviewed and corrected them against cited sources. This exercise put most of my time into the experience and its execution. I did not review every generated implementation detail to the standard I would apply in production; there I would spend more time on code review, tests, and maintainability, and revisit some of the current implementation choices.
