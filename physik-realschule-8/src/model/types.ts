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
  /** What the formula is called, e.g. "Druck". */
  name: string;
  /** The formula as HTML with <sub>/<sup>, never LaTeX. */
  html: string;
  /** Quantities and units, e.g. "p in Pa, F in N, A in m²". */
  quantities: string;
}

export type LabValues = Record<string, number>;
export type ReadoutValues = Record<string, number | string>;

export interface RangeParam {
  type: "range";
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  value: number;
  /** Decimals shown next to the slider. */
  digits?: number;
}

export interface ChoiceParam {
  type: "choice";
  key: string;
  label: string;
  options: Array<{ value: number; label: string }>;
  value: number;
}

export type LabParam = RangeParam | ChoiceParam;

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

export type LabKind =
  // Etappe 1: Mechanik
  | "measure-length"
  | "uniform-motion"
  | "force-arrow"
  | "interaction"
  | "spring"
  | "weight-places"
  | "particle-states"
  | "density"
  | "friction"
  // Etappe 2: Optik
  | "seeing"
  | "shadow"
  | "eclipse"
  | "reflection"
  | "refraction"
  | "total-reflection"
  | "lens-rays"
  | "lens-image"
  | "eye-glasses"
  // Etappe 3: Mechanik und Energie
  | "inclined-plane"
  | "lever"
  | "pulley"
  | "work-force"
  | "power-stairs"
  | "energy-forms"
  | "energy-track"
  | "efficiency"
  // Etappe 4: Wärmelehre
  | "internal-energy"
  | "thermometer"
  | "heating-curve"
  | "expansion"
  | "water-anomaly"
  | "conduction"
  | "thermos"
  // Etappe 5: Magnetismus und Elektrizitätslehre
  | "elementary-magnets"
  | "field-lines"
  | "charge-transfer"
  | "influence"
  | "electro-filter"
  | "current-flow"
  | "circuit"
  | "ammeter"
  | "ions-field"
  | "body-current"
  // Etappe 6 und 7: Wahlbereich
  | "sound-wave"
  | "sound-speed"
  | "retrograde"
  | "solar-scale";

export interface LabDefinition {
  kind: LabKind;
  title: string;
  intro: string;
  params: LabParam[];
  readouts: LabReadout[];
  goals: LabGoal[];
}

export interface ExerciseTask {
  /** The task text as HTML. */
  prompt: string;
  /** Given quantities, one per line, e.g. "m = 2 kg". */
  given: string[];
  /** Shown in Level 1 only. */
  formulaHint?: string;
  answer: number;
  unit: string;
  /** Decimals the solution is shown with. */
  digits: number;
  /** Relative tolerance; default 2 %. */
  tolerance?: number;
  /** Absolute tolerance in the answer's unit, when rounding conventions differ. */
  absTolerance?: number;
  /** The worked solution as HTML. */
  solutionHtml: string;
  /** The values the generator drew, so tests can check the scenario (e.g. V2 < V1). */
  meta?: Record<string, number>;
}

export interface ExerciseGenerator {
  id: string;
  make: (rng: Rng, level: DifficultyLevel) => ExerciseTask;
}

/** A teacher's explainer video for a lesson, shown above the explanation when set. */
export interface TeacherVideo {
  url: string;
  title: string;
  author?: string;
}

export interface Lesson {
  /** Public contract: ZAM cards cite it as #lesson=<id>. */
  id: string;
  stageId: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  tracks: Track[];
  /** Where LehrplanPLUS places it, e.g. "Ph8 LB 1 (II/III): Hooke". */
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
  /**
   * A Wahl the Lehrplan leaves to the teacher (Flaschenzug or Hebel, Akustik
   * or Astronomie): it can be learned, but never blocks a stage or the total.
   */
  optional?: boolean;
  /** Teacher explainer video; filled in separately from the lesson content. */
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
