export type Level = 1 | 2;
/**
 * Ausbildungsrichtung. Lernbereiche 1 bis 3 gelten für alle; den
 * Profilbereich (Lernbereich 4) hat nur das NTG.
 */
export type Track = "NTG" | "ANDERE";
export type ModelKind =
  | "circular"
  | "centripetal"
  | "centriexp"
  | "curve"
  | "gravity"
  | "orbit"
  | "oscillation"
  | "spring"
  | "pendulum"
  | "uncertainty"
  | "wave"
  | "superposition"
  | "interference"
  | "standing"
  | "doubleslit"
  | "kepler"
  | "hubble"
  | "frames"
  | "lorentz"
  | "muon"
  | "chain"
  | "utility"
  | "saving"
  | "euler"
  | "airfall"
  | "eulerosc"
  | "solar"
  | "pvplant"
  | "ride"
  | "chaos";
export type CalculationKind =
  | "circular"
  | "centripetal"
  | "centriexp"
  | "curve"
  | "gravity"
  | "orbit"
  | "oscillation"
  | "spring"
  | "pendulum"
  | "uncertainty"
  | "wave"
  | "interference"
  | "standing"
  | "light"
  | "kepler"
  | "hubble"
  | "lorentz"
  | "contraction"
  | "efficiency"
  | "fullload"
  | "saving"
  | "euler"
  | "airfall"
  | "solar"
  | "pvplant"
  | "ride";
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
  /** Lernbereich 1 bis 4; die Etappe im Lernpfad. */
  lb: number;
  title: string;
  period: string;
  intro: string;
  tracks: Track[];
  paragraphs: string[];
  takeaway: string;
  /** Formeln und Fachbegriffe für die Formelsammlung. */
  formulas?: string[];
  sourceIds: string[];
  quiz: Check;
  workshop: Workshop;
  tasks: Record<Level, WrittenTask>;
  optional?: boolean;
  model?: ModelKind;
  calculation?: CalculationKind;
}
export interface Stage {
  lb: number;
  title: string;
  shortTitle: string;
  icon: string;
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
