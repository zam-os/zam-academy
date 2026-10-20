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
  /** What the formula is called, e.g. "Satz des Pythagoras". */
  name: string;
  /** The formula as HTML (<sup>, <sub>, the helpers in math-html.ts), never LaTeX. */
  html: string;
  /** What the letters mean, e.g. "a, b Katheten, c Hypotenuse". */
  quantities: string;
}

export type LabValues = Record<string, number>;
export type ReadoutValues = Record<string, number | string>;

interface ParamBase {
  key: string;
  /** Shown only while this holds, e.g. the slider of one experiment of several. */
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
  /** Decimals shown next to the slider. */
  digits?: number;
}

export interface ChoiceParam extends ParamBase {
  type: "choice";
  label: string;
  options: Array<{ value: number; label: string }>;
  value: number;
}

/**
 * State the lab keeps that no control shows: the counters of a simulation and
 * the seed of its next draw. Only actions change it.
 */
export interface StateParam extends ParamBase {
  type: "state";
  value: number;
  /** Back to `value` whenever the learner changes a slider or a choice, so counts never mix two set-ups. */
  resetOnChange?: boolean;
}

export type LabParam = RangeParam | ChoiceParam | StateParam;

export interface LabReadout {
  key: string;
  label: string;
  unit?: string;
  digits?: number;
  /** Highlighted as the quantity the lesson is about. */
  emphasis?: boolean;
  compute: (values: LabValues) => number | string;
}

export interface LabGoal {
  id: string;
  text: string;
  check: (values: LabValues, readouts: ReadoutValues) => boolean;
}

/** A button under the drawing: draw a ball, run a simulation, start over. */
export interface LabAction {
  id: string;
  label: string;
  /** The values after the action; may change state and visible params. */
  apply: (values: LabValues) => LabValues;
}

export type LabKind =
  | "pythagoras"
  | "rope"
  | "thales"
  | "ladder"
  | "slope"
  | "unit-quarter"
  | "wheel"
  | "pizza"
  | "sector"
  | "can"
  | "cone"
  | "sphere"
  | "line-equation"
  | "two-lines"
  | "elimination"
  | "system-cases"
  | "puzzle-farm"
  | "vertex"
  | "basketball"
  | "square-tiles"
  | "discriminant"
  | "roots"
  | "parabola-line"
  | "fence"
  | "urn"
  | "at-least-once"
  | "test-table"
  | "data-dots"
  | "boxplot";

export interface LabDefinition {
  kind: LabKind;
  title: string;
  intro: string;
  params: LabParam[];
  readouts: LabReadout[];
  goals: LabGoal[];
  actions?: LabAction[];
}

/** A number the learner types: a coordinate, a length, a probability. */
export interface NumberField {
  kind: "number";
  /** HTML before the input, e.g. "x =" or "c =". */
  label: string;
  answer: number;
  /** Shown after the input, e.g. "cm²"; empty for pure numbers. */
  unit: string;
  /** Decimals the solution is shown with. */
  digits: number;
  /** Relative tolerance; default 1 %. */
  tolerance?: number;
  /** Absolute tolerance in the answer's unit, when rounding conventions differ. */
  absTolerance?: number;
  /**
   * Typical wrong results and what to say about them, e.g. the value a
   * calculator in RAD mode gives, or c² instead of c.
   */
  slips?: Array<{ value: number; hint: string }>;
}

/** A choice the learner makes beside the numbers, e.g. how many solutions. */
export interface ChoiceField {
  kind: "choice";
  label: string;
  options: string[];
  correctIndex: number;
}

export type AnswerField = NumberField | ChoiceField;

export interface ExerciseTask {
  /** The task text as HTML. */
  prompt: string;
  /** Given values, one per line, as HTML. */
  given: string[];
  /** Shown in Level 1 only, as HTML. */
  formulaHint?: string;
  fields: AnswerField[];
  /** Indices of number fields that may be filled in any order (the two solutions x₁ and x₂). */
  anyOrder?: number[];
  /**
   * The worked solution as HTML steps. "Tipp" shows them one by one; the
   * last one holds the result in <strong>.
   */
  steps: string[];
  /** The values the generator drew, so tests can check the scenario. */
  meta?: Record<string, number>;
}

export interface ExerciseGenerator {
  id: string;
  make: (rng: Rng, level: DifficultyLevel) => ExerciseTask;
}

export interface Lesson {
  /** Public contract: ZAM cards cite it as #lesson=<id>. */
  id: string;
  stageId: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  tracks: Track[];
  /** Where LehrplanPLUS places it, e.g. "M9 LB 3 (I) · M9 LB 3 (II/III)". */
  lehrplan: string;
  whyItMatters: string;
  explanationHtml: string;
  formulas: FormulaEntry[];
  quiz: QuizQuestion;
  lab: LabDefinition;
  exercises: ExerciseGenerator[];
  /** Correct exercises per level that complete the lesson. */
  requiredCorrect: number;
  celebrationMessage: string;
}

export interface Stage {
  id: string;
  stageNumber: number;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  badgeTitle: string;
  /** The Lernbereich(e) this stage covers. */
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
