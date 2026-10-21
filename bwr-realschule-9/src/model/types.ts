export type Level = 1 | 2;
export type PracticeKind =
  | "private"
  | "equity"
  | "purchase"
  | "land"
  | "depreciation"
  | "partial"
  | "depreciationBooking"
  | "gwg"
  | "running"
  | "costs"
  | "payback"
  | "ratio"
  | "payout"
  | "interest"
  | "loan"
  | "effective"
  | "repayment"
  | "supplier"
  | "deposit"
  | "stockbuy"
  | "dividend"
  | "stocksell"
  | "overdue"
  | "doubtful"
  | "writeoff"
  | "recovery"
  | "ewb"
  | "pwb"
  | "vat"
  | "vatbalance";
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
  lab?: "depreciation" | "loans" | "supplier" | "claims";
}
export interface Entry {
  side: "debit" | "credit";
  account: string;
  amount: number;
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
  booking: Entry[];
  solution: string;
}
export interface LearnerEntry {
  side: string;
  account: string;
  amount: string;
}
