export type PeriodId = "pre-commerce" | "explosion" | "growth";

export type Period = {
  id: PeriodId;
  label: string;
  /** Colour token (globals.css) for the stage background while this period is active. */
  colorToken: string;
  /** Colour token for the silhouettes behind the events. */
  motifToken: string;
};

export type TimelineEvent = {
  title: string;
  place: string;
  description: string;
  source: {
    publisher: string;
    title: string;
    url: string;
  };
};

export type TimelineStop = {
  id: string;
  label: string;
  period: PeriodId;
  headline: string;
  events: TimelineEvent[];
};

/** A change of displayed year: which stop is leaving, which is arriving, and which way. */
export type YearTransition = { from: number; to: number; direction: 1 | -1 };
