import type { Rng } from "../exercises/rng";

/** Level 1 gives formula and values; Level 2 is a transfer task in words. */
export type DifficultyLevel = 1 | 2;

/** Wahlpflichtfächergruppe of the Bavarian Realschule. */
export type Track = "I" | "II_III";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FormulaEntry {
  /** What the formula is called, e.g. "Sinussatz". */
  name: string;
  /** The formula as HTML (<sup>, <sub>, fractions, etc.), never raw LaTeX. */
  html: string;
  /** What the letters mean, e.g. "a, b Seiten, alpha, beta Gegenwinkel". */
  quantities: string;
}

export type LabValues = Record<string, number>;
export type ReadoutValues = Record<string, number | string>;

interface ParamBase {
  key: string;
  showIf?: (values: LabValues) => boolean;
}

export interface RangeParam extends ParamBase {
  type: "range";
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  digits?: number;
}

export interface ChoiceParam extends ParamBase {
  type: "choice";
  label: string;
  options: Array<{ value: number; label: string }>;
  value: number;
}

export interface StateParam extends ParamBase {
  type: "state";
  value: number;
  resetOnChange?: boolean;
}

export type LabParam = RangeParam | ChoiceParam | StateParam;

export interface LabReadout {
  key: string;
  label: string;
  unit?: string;
  digits?: number;
  emphasis?: boolean;
  compute: (values: LabValues) => number | string;
}

export interface LabGoal {
  id: string;
  text: string;
  check: (values: LabValues, readouts: ReadoutValues) => boolean;
}

export interface LabAction {
  id: string;
  label: string;
  apply: (values: LabValues) => LabValues;
}

export type LabKind =
  | "unit-circle"
  | "sine-cosine-law"
  | "triangle-area"
  | "radian-arc"
  | "vector-plane"
  | "dot-product"
  | "determinant-area"
  | "vector-rotation"
  | "power-graph"
  | "exponential-growth"
  | "logarithm-scale"
  | "composite-body"
  | "probability-tree";

export interface LabDefinition {
  kind: LabKind;
  title: string;
  intro: string;
  params: LabParam[];
  readouts: LabReadout[];
  goals: LabGoal[];
  actions?: LabAction[];
}

export interface NumberField {
  kind: "number";
  label: string;
  answer: number;
  unit: string;
  digits: number;
  tolerance?: number;
  absTolerance?: number;
  slips?: Array<{ value: number; hint: string }>;
}

export interface ChoiceField {
  kind: "choice";
  label: string;
  options: string[];
  correctIndex: number;
}

export type AnswerField = NumberField | ChoiceField;

export interface ExerciseTask {
  prompt: string;
  given: string[];
  formulaHint?: string;
  fields: AnswerField[];
  anyOrder?: number[];
  steps: string[];
  meta?: Record<string, number>;
}

export interface ExerciseGenerator {
  id: string;
  make: (rng: Rng, level: DifficultyLevel) => ExerciseTask;
}

export interface TeacherVideo {
  url: string;
  title: string;
  author?: string;
}

export interface Lesson {
  id: string;
  stageId: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  tracks: Track[];
  lehrplan: string;
  whyItMatters: string;
  explanationHtml: string;
  formulas: FormulaEntry[];
  quiz: QuizQuestion;
  lab: LabDefinition;
  exercises: ExerciseGenerator[];
  requiredCorrect: number;
  celebrationMessage: string;
  teacherVideo?: TeacherVideo;
}

export interface Stage {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  badgeTitle: string;
  lehrplanLabel: string;
  lessons: Lesson[];
}

export const TRACK_LABELS: Record<Track, string> = {
  I: "Zweig I",
  II_III: "Zweig II/III",
};

export const TRACK_LONG_LABELS: Record<Track, string> = {
  I: "Wahlpflichtfächergruppe I (mathematisch-naturwissenschaftlich)",
  II_III: "Wahlpflichtfächergruppen II und III",
};
