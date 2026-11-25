export type Level = 1 | 2;
/**
 * Natur und Technik 7 has one Fachlehrplan for every learner of the grade:
 * the Ausbildungsrichtungen of the Gymnasium begin in Jahrgangsstufe 8.
 * So there is no track here; every lesson is for everyone.
 */
export type ModelKind =
  | "einstrahlung"
  | "pole"
  | "elementar"
  | "kompass"
  | "dichte"
  | "messzylinder"
  | "werkstoff"
  | "sehen"
  | "farbe"
  | "farbschatten"
  | "schatten"
  | "halbschatten"
  | "mondphasen"
  | "finsternis"
  | "sichtbarkeit"
  | "atom"
  | "reiben"
  | "stromkreis"
  | "spule"
  | "schaltung";
export type CalculationKind = "dichte" | "differenz" | "bauteil";
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
  /** Stable when first published: every ZAM card cites this anchor. */
  id: string;
  /** Abschnitt 1.1, 1.2 or 1.3 of NT7 Lernbereich 1, as stage 1, 2 or 3. */
  lb: number;
  title: string;
  period: string;
  intro: string;
  paragraphs: string[];
  takeaway: string;
  /** Formeln und Fachbegriffe für das Nachschlagen. */
  formulas: string[];
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  model?: ModelKind;
  calculation?: CalculationKind;
}
export interface Stage {
  lb: number;
  /** The section of the Fachlehrplan, such as "1.2". */
  section: string;
  title: string;
  shortTitle: string;
  hours: number;
}
export interface ExerciseTask {
  prompt: string;
  formulaHint?: string;
  answer: number;
  unit: string;
  digits: number;
  tolerance?: number;
  absTolerance?: number;
  solutionHtml: string;
}
