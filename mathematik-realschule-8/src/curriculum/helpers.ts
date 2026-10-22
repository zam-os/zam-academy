import type {
  ChoiceField,
  ExerciseTask,
  LabParam,
  Lesson,
  NumberField,
  Stage,
  Track,
} from "../model/types";
import outline from "./outline.json";

export const BOTH: Track[] = ["I", "II_III"];
export const near = (a: number, b: number, delta = 1e-8): boolean =>
  Number.isFinite(a) && Math.abs(a - b) <= delta;
export const numberField = (
  label: string,
  answer: number,
  unit = "",
  digits = 2,
  extra: Partial<NumberField> = {},
): NumberField => ({ kind: "number", label, answer, unit, digits, tolerance: 0, ...extra });
export const choiceField = (
  label: string,
  options: string[],
  correctIndex: number,
): ChoiceField => ({ kind: "choice", label, options, correctIndex });
export const yesNo = (label: string, yes: boolean): ChoiceField =>
  choiceField(label, ["ja", "nein"], yes ? 0 : 1);
export const range = (
  key: string,
  label: string,
  min: number,
  max: number,
  value: number,
  step = 1,
  unit = "",
): LabParam => ({
  type: "range",
  key,
  label,
  min,
  max,
  value,
  step,
  unit,
  digits: step < 1 ? 2 : 0,
});
export const choice = (key: string, label: string, labels: string[], value = 0): LabParam => ({
  type: "choice",
  key,
  label,
  options: labels.map((label, value) => ({ label, value })),
  value,
});

type Content = Omit<
  Lesson,
  | "id"
  | "stageId"
  | "stepNumber"
  | "title"
  | "tracks"
  | "lehrplan"
  | "requiredCorrect"
  | "celebrationMessage"
>;

export function defineLesson(id: string, content: Content): Lesson {
  const entry = outline.lessons.find((l) => l.id === id);
  if (!entry) throw new Error(`Unknown lesson ${id}`);
  return {
    ...content,
    id,
    stageId: entry.stageId,
    stepNumber:
      outline.lessons.filter((l) => l.stageId === entry.stageId).findIndex((l) => l.id === id) + 1,
    title: entry.title,
    tracks: Object.keys(entry.bindings) as Track[],
    lehrplan: Object.entries(entry.bindings)
      .map(([t, lb]) => `M8 LB ${lb} (${t === "I" ? "I" : "II/III"})`)
      .join(" · "),
    requiredCorrect: 3,
    celebrationMessage: `Geschafft: ${entry.title}. Erkläre den Zusammenhang jetzt mit eigenen Worten.`,
  };
}

export function stage(id: string, lessons: Lesson[]): Stage {
  const meta = outline.stages.find((s) => s.id === id);
  if (!meta) throw new Error(`Unknown stage ${id}`);
  return { ...meta, lessons };
}

/** Guided tasks include a method; transfer tasks describe a fresh situation. */
export function task(
  prompt: string,
  fields: ExerciseTask["fields"],
  steps: string[],
  formulaHint?: string,
  meta?: Record<string, number>,
): ExerciseTask {
  return { prompt, given: [], fields, steps, formulaHint, meta };
}
