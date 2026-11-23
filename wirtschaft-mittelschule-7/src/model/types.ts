export type Track = "R" | "M";
export type Level = 1 | 2;

export type PracticeKind =
  | "projectTime"
  | "projectBudget"
  | "workplaceScore"
  | "trainingCompare"
  | "workShare"
  | "selfEmployedProfit"
  | "portfolioCheck"
  | "profileMatch"
  | "trainingBudget"
  | "workTimeValue"
  | "livingStandard"
  | "multiWeekBudget"
  | "unitPriceCompare"
  | "marketBalance"
  | "schoolSaleCalc"
  | "holidayJobLimits"
  | "applianceCost"
  | "householdProduction";

export type LabKind =
  | "projectPlan"
  | "workplaceCheck"
  | "selfEmployedSim"
  | "careerMatch"
  | "householdBudget"
  | "marketMechanism"
  | "schoolSale"
  | "holidayJobCheck"
  | "applianceCheck";

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
