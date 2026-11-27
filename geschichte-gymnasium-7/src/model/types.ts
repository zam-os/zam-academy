export type Level = 1 | 2;

/** Every interactive model and historical map explorer in src/labs; a lesson names at most one. */
export type LabKind =
  | "ottonenReich"
  | "investiturstreit"
  | "lehnswesen"
  | "kurfuerstenwahl"
  | "kathedrale"
  | "altstadt"
  | "pestKarte"
  | "kreuzzugKarte"
  | "perspektive"
  | "entdeckerKarte"
  | "hanseKarte"
  | "reformationVerlauf"
  | "flugblatt"
  | "kriegsphasen"
  | "versailles"
  | "balanceOfPower"
  | "bauwerkeVergleich";

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

export interface CriteriaCatalog {
  title: string;
  steps: string[];
}

export interface SourceExcerpt {
  label: string;
  quote: string;
  attribution: string;
}

export interface Lesson {
  /** Public contract once published: every card links to this anchor. */
  id: string;
  /** The Lernbereich (stage) of the learning path, 1–7; see outline.json. */
  lb: number;
  title: string;
  /** Lehrplan label, e.g. "LB 5 · Das konfessionelle Zeitalter". */
  period: string;
  intro: string;
  paragraphs: string[];
  /** Attributed translated historical source excerpt when analyzing written sources. */
  sourceExcerpt?: SourceExcerpt;
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  /** Ids of the drawings and maps in src/figures that the lesson shows. */
  figures: string[];
  /** Optional interactive SVG model or map explorer embedded in the lesson. */
  lab?: LabKind;
  /** Optional vorgegebener knapper Kriterienkatalog for map/object/diagram/portrait analysis. */
  kriterien?: CriteriaCatalog;
  /** Grundlegende Daten und Begriffe highlighted in the lesson and reference view. */
  grundwissen?: string[];
  /** Earlier knowledge revisited inside the lesson. */
  review?: string;
}

export interface Stage {
  lb: number;
  /** Lernbereich code, e.g. "LB 1". */
  code: string;
  hours: string;
  title: string;
  shortTitle: string;
  icon: string;
}
