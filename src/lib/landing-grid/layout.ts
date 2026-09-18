import { desktopAfricaCells, mobileAfricaCells } from "@/data/landing-grid-dots";
import { symbolForCell } from "@/lib/landing-grid/symbols";
import type { Dot } from "@/types/landing-grid";

// Geometry of the supplied 1440 × 900 landing frame's dot grid.
const DESKTOP = { width: 1360, height: 898, columns: 33, rows: 22, pitch: 42, inset: 8, radius: 8 } as const;
// The phone grid has no Figma frame; it keeps one lattice at every phone ratio.
const PHONE = { width: 390, height: 844, columns: 26, pitch: 15, radius: 2.85 } as const;
const FAINT = 0.05;
/** Desktop columns right of the text column sit slightly brighter, as in the Figma export. */
const FAINT_BRIGHTER = 0.1;

/** A stable 0–1 value per cell, so each dot's timing varies but never changes between renders. */
export function variation(index: number, salt: number) {
  let value = Math.imul(index + salt, 0x45d9f3b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return ((value ^ (value >>> 16)) >>> 0) / 0xffffffff;
}

/** A fixed shuffle of 0…count-1: the order in which the map dots light up. */
export function shuffledRanks(count: number) {
  const ranks = Array.from({ length: count }, (_, index) => index);
  let seed = 0x5f3759df;
  for (let index = count - 1; index > 0; index--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const swapIndex = seed % (index + 1);
    [ranks[index], ranks[swapIndex]] = [ranks[swapIndex], ranks[index]];
  }
  return ranks;
}

function createDot(index: number, row: number, column: number, x: number, y: number, radius: number, alpha: number, bright: boolean, phone: boolean): Dot {
  return {
    x,
    y,
    radius,
    alpha,
    bright,
    symbol: symbolForCell(row, column, phone),
    scatter: variation(index, 17),
    rhythm: variation(index, 83),
    flip: 0,
    lift: 0,
  };
}

/**
 * Lays out the grid for a canvas of the given size. `africa` holds the map cells:
 * they replace faint cells at the same lattice positions rather than sitting on a
 * second grid.
 */
export function buildDots(width: number, height: number, phone: boolean) {
  const dots: Dot[] = [];
  const africa: Dot[] = [];
  const add = (dot: Dot) => {
    dots.push(dot);
    if (dot.bright) africa.push(dot);
  };

  if (phone) {
    // Extra columns fill wider phones while the map stays inside the right and bottom edges.
    const scale = Math.min(width / PHONE.width, height / PHONE.height);
    const pitch = PHONE.pitch * scale;
    const columns = Math.max(PHONE.columns, Math.floor(width / pitch));
    const rows = Math.ceil(height / pitch);
    const shift = columns - PHONE.columns;
    const map = new Set(mobileAfricaCells.map((cell) => Math.floor(cell / PHONE.columns) * columns + (cell % PHONE.columns) + shift));
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        const index = row * columns + column;
        add(createDot(index, row, column, (column + 0.5) * pitch, (row + 0.5) * pitch, PHONE.radius * scale, FAINT, map.has(index), true));
      }
    }
    return { dots, africa };
  }

  const scale = Math.max(width / DESKTOP.width, height / DESKTOP.height);
  const left = (width - DESKTOP.width * scale) / 2;
  const top = (height - DESKTOP.height * scale) / 2;
  const map = new Set<number>(desktopAfricaCells);
  for (let row = 0; row < DESKTOP.rows; row++) {
    for (let column = 0; column < DESKTOP.columns; column++) {
      const index = row * DESKTOP.columns + column;
      const x = left + (DESKTOP.inset + column * DESKTOP.pitch) * scale;
      const y = top + (DESKTOP.inset + row * DESKTOP.pitch) * scale;
      add(createDot(index, row, column, x, y, DESKTOP.radius * scale, column <= 15 ? FAINT : FAINT_BRIGHTER, map.has(index), false));
    }
  }
  return { dots, africa };
}

/** Stops every animation on a dot. */
export function stopDot(dot: Dot) {
  dot.tween?.kill();
  dot.scaleTween?.kill();
  dot.returnCall?.kill();
}
