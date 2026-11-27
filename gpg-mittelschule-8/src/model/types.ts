export type Level = 1 | 2;
export type Track = "R" | "M";
export type TrackFilter = "all" | Track;

export type LabId =
  | "energiemix"
  | "haushalt-energie"
  | "gesetzgebung"
  | "wahlbeteiligung"
  | "generationenvertrag"
  | "oekolandbau-kosten";

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
  lb: number;
  tracks: Track[];
  lehrplan: string;
  title: string;
  period: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  labId?: LabId;
  tasks: Record<Level, WrittenTask>;
  /** Ids of the drawings and maps in src/figures.ts that the lesson shows. */
  figures: string[];
  /** Earlier school knowledge this lesson repeats, e.g. "Wiederholung aus GPG 7". */
  review?: string;
}

export interface Stage {
  lb: number;
  title: string;
  shortTitle: string;
  icon: string;
}
