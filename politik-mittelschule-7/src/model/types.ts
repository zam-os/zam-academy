export type Level = 1 | 2;
/** R = Regelklasse (R7), M = Mittlere-Reife-Klasse (M7). */
export type Track = "R" | "M";

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

export interface Lesson {
  /** Public contract once published: every card links to this anchor. */
  id: string;
  /** Lernbereich of the Fachlehrplan; every lesson of this package is LB 3. */
  lb: number;
  /** The stage (one accent colour each) on the learning path. */
  stage: number;
  /** The Zweige whose learning path includes the lesson. */
  tracks: Track[];
  /** Curriculum label shown in the lesson, e.g. "GPG 7 LB 3 (R7, M7): Soziale Frage". */
  lehrplan: string;
  title: string;
  period: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  /** Ids of the drawings in src/figures/index.ts that the lesson shows. */
  figures: string[];
  /** Earlier school knowledge this lesson repeats, e.g. "Wiederholung aus HSU 3/4". */
  review?: string;
}

export interface Stage {
  id: number;
  title: string;
  shortTitle: string;
  icon: string;
}
