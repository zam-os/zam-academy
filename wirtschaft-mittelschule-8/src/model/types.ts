export type Track = "R" | "M";
export type Level = 1 | 2;

export type PracticeKind =
  | "projectCost"
  | "projectSchedule"
  | "applicationTimeline"
  | "trainingPay"
  | "profileMatch"
  | "procurementCompare"
  | "ecoSaving"
  | "priceCalc"
  | "guvCalc"
  | "circularFlowCalc"
  | "pieceRate"
  | "minimumWageCheck"
  | "netPayCalc"
  | "internshipHours"
  | "productivity"
  | "noiseCheck"
  | "weightedDecision";

export type LabKind =
  | "projectPlan"
  | "careerMatch"
  | "shopGuV"
  | "circularFlow"
  | "wageForms"
  | "netPay"
  | "internshipCheck"
  | "noiseProtection"
  | "productionCompare";

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
  id: string;
  lb: number;
  tracks: Track[];
  lehrplan: string;
  title: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  optional?: boolean;
  practice?: PracticeKind;
  lab?: LabKind;
}

export interface NumericField {
  label: string;
  answer: number;
  unit: string;
}

export interface Exercise {
  prompt: string;
  hint: string;
  fields: NumericField[];
  solution: string;
}
