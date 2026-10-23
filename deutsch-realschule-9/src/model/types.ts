export type Level = 1 | 2;

export interface Check {
  question: string;
  answer: string;
  wrong: [string, string];
  explanation: string;
}

interface SortBase {
  title: string;
  instruction: string;
  categories: string[];
  entries: Array<{ text: string; target: number; feedback: string }>;
  conclusion: string;
}

/** Sorting entries into categories. */
export interface ClassifyWorkshop extends SortBase {
  kind: "classify";
}

/** Putting steps into their order; `target` of an entry is its position. */
export interface TimelineWorkshop extends SortBase {
  kind: "timeline";
}

export type SortWorkshop = ClassifyWorkshop | TimelineWorkshop;

/**
 * A piece of a text. Every piece can be clicked. A piece with `label` is a
 * target: the learner has to mark it with `labels[label]`. A piece without
 * `label` must stay unmarked. The pieces are joined without adding anything,
 * so spaces belong to the pieces.
 */
export interface Segment {
  t: string;
  label?: number;
  /** Said after checking a target: why this piece is what it is. */
  feedback?: string;
}

/** Marking parts of a short text with one of two to four labels. */
export interface MarkWorkshop {
  kind: "mark";
  title: string;
  instruction: string;
  labels: string[];
  text: Segment[];
  conclusion: string;
}

/**
 * A sentence as words without any comma in them. A comma stands after
 * `words[i]` for every i in `commas`. The sentence's final punctuation
 * belongs to the last word.
 */
export interface CommaItem {
  words: string[];
  commas: number[];
  feedback: string;
}

/** Setting the commas of some sentences by clicking the gaps between the words. */
export interface CommaWorkshop {
  kind: "commas";
  title: string;
  instruction: string;
  items: CommaItem[];
  conclusion: string;
}

/** A sentence with one gap: `before`, the chosen option, `after`. */
export interface ChooseItem {
  before: string;
  options: string[];
  /** Index into `options` of the right one. */
  answer: number;
  after: string;
  feedback: string;
}

/** Choosing the right word or spelling for the gap of each sentence. */
export interface ChooseWorkshop {
  kind: "choose";
  title: string;
  instruction: string;
  items: ChooseItem[];
  conclusion: string;
}

export type Workshop = SortWorkshop | MarkWorkshop | CommaWorkshop | ChooseWorkshop;

export interface CaseStep {
  question: string;
  /** Two to four options; `answer` is the index of the right one. */
  options: string[];
  answer: number;
  explanation: string;
}

/** A short text that is worked through in steps, each step checked on its own. */
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

/** A worked example: a text and what to see in it. `source` names a real work. */
export interface Example {
  title: string;
  text: string;
  analysis: string;
  source?: string;
}

/**
 * Practice rounds of three sentences drawn from `pool[level]`. The kind of
 * the pool is the kind of its items.
 */
export type Practice =
  | { kind: "commas"; title: string; instruction: string; pool: Record<Level, CommaItem[]> }
  | { kind: "choose"; title: string; instruction: string; pool: Record<Level, ChooseItem[]> };

export interface Lesson {
  /** Public contract: ZAM cards cite it as #lesson=<id>. */
  id: string;
  lb: number;
  /** The Fachlehrplan's own unit number, for example "4.2". */
  unit: string;
  /** The Kompetenzerwartungen of the unit this lesson teaches, as "<unit>.<n>", for example "4.2.4". */
  covers: string[];
  title: string;
  intro: string;
  paragraphs: string[];
  terms: Term[];
  examples?: Example[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  casework: CaseFile;
  tasks: Record<Level, WrittenTask>;
  practice?: Practice;
  /** Set by the curriculum index, for example "D9 LB 4.2: Sprachliche Strukturen untersuchen und reflektieren". */
  lehrplan?: string;
}

export interface Stage {
  lb: number;
  title: string;
  subtitle: string;
  glyph: string;
}
