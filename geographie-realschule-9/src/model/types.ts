export type Level = 1 | 2;
export type ModelKind =
  | "landscapes"
  | "climate"
  | "runoff"
  | "greenhouse"
  | "population"
  | "balance"
  | "city"
  | "europe";
export type ProjectStep = "question" | "evidence" | "judgment";

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
  title: string;
  period: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  optional?: boolean;
  language?: "en";
  model?: ModelKind;
  projectStep?: ProjectStep;
}

export interface Stage {
  lb: number;
  title: string;
  shortTitle: string;
  icon: string;
  hours?: number;
  optional?: boolean;
}
