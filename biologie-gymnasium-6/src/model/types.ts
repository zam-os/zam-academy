export type Level = 1 | 2;

/** Every interactive model in src/labs; a lesson names at most one. */
export type LabKind =
  | "fairTest"
  | "microscope"
  | "dispersal"
  | "germination"
  | "waterweed"
  | "phototropism"
  | "streamline"
  | "thermo"
  | "metamorphosis"
  | "echolocation"
  | "vertebrateKey"
  | "foodWeb";

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
  dataTable?: {
    title: string;
    unit: string;
    rows: Array<{ label: string; value: number }>;
    note: string;
  };
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
  /** The stage (Station) of the learning path, 1–9; see outline.json. */
  lb: number;
  title: string;
  /** Lehrplan label, e.g. "NT6 1.3 · Aktive Bewegung". */
  period: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  /** Ids of the drawings in src/figures that the lesson shows. */
  figures: string[];
  /** Optional interactive SVG model embedded in the lesson. */
  lab?: LabKind;
  /** Earlier school knowledge this lesson repeats, e.g. "Wiederholung aus NT5". */
  review?: string;
}

export interface Stage {
  lb: number;
  /** Teilbereich of the Fachlehrplan Natur und Technik 6, e.g. "1.3". */
  code: string;
  title: string;
  shortTitle: string;
  icon: string;
}
