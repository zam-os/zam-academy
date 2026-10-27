import type { Rng } from "../exercises/rng";

/** Level 1 gives a hint and values; Level 2 is a transfer task in words. */
export type DifficultyLevel = 1 | 2;

/**
 * A module of the IT Anfangsunterricht (LehrplanPLUS Realschule IT 1.1–1.9).
 * The Anfangsunterricht is the same for every Wahlpflichtfächergruppe, so the
 * app has one shared learning path and no Zweig filter.
 */
export type ModuleCode = "1.1" | "1.2" | "1.3" | "1.4" | "1.5" | "1.6" | "1.7" | "1.8" | "1.9";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FormulaEntry {
  /** Name of a term, rule or model. */
  name: string;
  /** The rule as HTML (<sup>, <sub>, <code>), never LaTeX. */
  html: string;
  /** What the parts mean, e.g. "n Anzahl der Bits". */
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
 * the observation state of an experiment. Only actions change it.
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

/** A button under the drawing: run a program step, transmit a message, reset. */
export interface LabAction {
  id: string;
  label: string;
  /** The values after the action; may change state and visible params. */
  apply: (values: LabValues) => LabValues;
}

/** A point in SVG user units. */
export interface Pt {
  x: number;
  y: number;
}

/**
 * What a drag handle does: the params arrow keys step (Left/Right the x
 * param, Up/Down the y param), and the values a drag to an SVG point sets.
 */
export interface HandleSpec {
  x?: string;
  y?: string;
  drag: (p: Pt, values: LabValues) => Partial<LabValues>;
}

/** How a lab draws itself: an SVG for the current values, and its drag handles. */
export interface LabView {
  render: (values: LabValues, readouts: ReadoutValues) => string;
  handles?: Record<string, HandleSpec>;
}

export interface LabDefinition {
  /** Unique per lesson; names the lab in tests and styles. */
  kind: string;
  title: string;
  intro: string;
  params: LabParam[];
  readouts: LabReadout[];
  goals: LabGoal[];
  actions?: LabAction[];
  view: LabView;
  /**
   * Values that reach a goal, for labs whose parameter grid is too large to
   * search (tests prove each witness reaches its goal).
   */
  witnesses?: Record<string, LabValues>;
}

/** A number the learner types: a decimal value, a byte count, a price. */
export interface NumberField {
  kind: "number";
  /** HTML before the input, e.g. "Dezimalwert =". */
  label: string;
  answer: number;
  /** Shown after the input, e.g. "Byte"; empty for pure numbers. */
  unit: string;
  /** Decimals the solution is shown with. */
  digits: number;
  /** Relative tolerance; default 1 %. */
  tolerance?: number;
  /** Absolute tolerance in the answer's unit, when rounding conventions differ. */
  absTolerance?: number;
  /**
   * Typical wrong results and what to say about them, e.g. bits counted as
   * bytes or the gross price divided by 0,19.
   */
  slips?: Array<{ value: number; hint: string }>;
}

/**
 * A short code the learner types: a dual number, a cell reference, a
 * formula, an ASCII letter. Case and spaces are ignored unless the field says
 * otherwise; leading zeros of dual numbers are accepted through `answers`.
 */
export interface TextField {
  kind: "text";
  label: string;
  /** Every accepted spelling; the first one is shown as the solution. */
  answers: string[];
  placeholder: string;
  /** Upper and lower case count, e.g. for a single letter. */
  caseSensitive?: boolean;
  /** Typical wrong entries and what to say about them. */
  slips?: Array<{ value: string; hint: string }>;
}

/** A choice the learner makes beside or instead of numbers. */
export interface ChoiceField {
  kind: "choice";
  label: string;
  options: string[];
  correctIndex: number;
}

export type AnswerField = NumberField | TextField | ChoiceField;

export interface ExerciseTask {
  /** The task text as HTML. */
  prompt: string;
  /** Given values, one per line, as HTML. */
  given: string[];
  /** Shown in Level 1 only, as HTML. */
  formulaHint?: string;
  fields: AnswerField[];
  /** Indices of number fields that may be filled in any order. */
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
  /** The module of the Anfangsunterricht, e.g. "1.4". */
  module: ModuleCode;
  /** Where LehrplanPLUS places it, e.g. "IT 1.4 Informationsaustausch". */
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
  /** The module this stage covers, e.g. "IT 1.4 · ca. 14 Std.". */
  lehrplanLabel: string;
  module: ModuleCode;
  lessons: Lesson[];
}

/** Who the path is for: the Anfangsunterricht binds every Wahlpflichtfächergruppe. */
export const AUDIENCE_LABEL = "alle Wahlpflichtfächergruppen";
