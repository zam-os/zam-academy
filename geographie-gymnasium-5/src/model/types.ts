export type Level = 1 | 2;

export interface Source {
  id: string;
  label: string;
  url: string;
}

export interface Check {
  question: string;
  answer: string;
  wrong: [string, string];
  explanation: string;
}

/** A deliberately authored task; reconstructed material is never called an original. */
export interface Workshop {
  kind: "timeline" | "classify";
  title: string;
  instruction: string;
  material?: string;
  materialLabel?: string;
  categories: string[];
  entries: Array<{ text: string; target: number; feedback: string }>;
  conclusion: string;
}

export interface WrittenTask {
  prompt: string;
  hints: [string, string];
  model: string;
  criteria: [string, string, string];
}

/** Ids of the interactive labs in src/labs. */
export type LabId =
  | "kompass"
  | "gradnetz"
  | "massstab"
  | "hoehen"
  | "schalen"
  | "lebenszone"
  | "saeulen"
  | "wetterwoche"
  | "landnutzung"
  | "gezeiten"
  | "pendler"
  | "planquadrat"
  | "kartierung";

export interface Lesson {
  /** Public contract once published: every card links to this anchor. */
  id: string;
  lb: number;
  title: string;
  period: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  /** Ids of the drawings and maps in src/figures that the lesson shows. */
  figures: string[];
  /** The interactive lab of the lesson, if it has one. */
  lab?: LabId;
  /** Earlier school knowledge this lesson repeats, e.g. "Wiederholung aus HSU 3/4". */
  review?: string;
}

export interface Stage {
  lb: number;
  title: string;
  shortTitle: string;
  icon: string;
}
