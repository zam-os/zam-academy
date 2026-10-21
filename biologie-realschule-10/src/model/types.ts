export type Level = 1 | 2;
export type ModelKind = "dna" | "division" | "inheritance" | "code" | "ecosystem" | "screening";
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
  /** A permanent public anchor when the Academy first publishes the cell. */
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
