export type Level = 1 | 2;

/** Numeric task families and interactive models used by this course. */
export type PracticeKind = "gleichgewicht" | "ueberhang" | "verzugszins";
export type LabKind = "nutzwert" | "arbeitsmarkt" | "markt" | "kreislauf" | "geschaeftsfaehigkeit" | "kaufvertrag" | "grundpreis";

export interface Check {
  question: string;
  answer: string;
  wrong: [string, string];
  explanation: string;
}

/** Sorting entries into categories, or putting steps into their order. */
export interface Workshop {
  kind: "timeline" | "classify";
  title: string;
  instruction: string;
  categories: string[];
  entries: Array<{ text: string; target: number; feedback: string }>;
  conclusion: string;
}

export interface CaseStep {
  question: string;
  /** Two to four options; `answer` is the index of the right one. */
  options: string[];
  answer: number;
  explanation: string;
}

/** A short story that is solved in steps, each step checked on its own. */
export interface CaseFile {
  title: string;
  story: string;
  steps: CaseStep[];
  verdict: string;
}

export interface WrittenTask {
  prompt: string;
  hints: [string, string];
  model: string;
  criteria: [string, string, string];
}

export interface Term {
  term: string;
  text: string;
}

/** A paraphrase of a rule, never a quotation; `url` opens the statute itself. */
export interface LawNote {
  ref: string;
  text: string;
  url?: string;
}

export interface Lesson {
  /** Public contract: ZAM cards cite it as #lesson=<id>. */
  id: string;
  lb: number;
  /** The Fachlehrplan's own unit number, for example "4.3". */
  unit: string;
  title: string;
  intro: string;
  paragraphs: string[];
  terms: Term[];
  law?: LawNote[];
  takeaway: string;
  visual?: { title: string; layout?: "comparison"; steps: string[] };
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  casework: CaseFile;
  tasks: Record<Level, WrittenTask>;
  lab?: LabKind;
  /** The assignments of `lab` this lesson asks for; all of them when left out. */
  labGoals?: string[];
  practice?: PracticeKind;
  optional?: boolean;
  /** Set by the curriculum index. */
  tracks?: Array<"II">;
  /** Set by the curriculum index, for example "WR8 LB 4.2 (II): Vertragsrecht". */
  lehrplan?: string;
}

export interface NumericField {
  label: string;
  answer: number;
  unit: string;
}

export interface ExerciseTable {
  head: string[];
  rows: Array<Array<string | number>>;
}

export interface Exercise {
  prompt: string;
  table?: ExerciseTable;
  hint: string;
  fields: NumericField[];
  solution: string;
}

export interface Stage {
  lb: number;
  title: string;
  subtitle: string;
  hours: number;
  glyph: string;
}
