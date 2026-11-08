import type {
  DifficultyLevel,
  ExerciseTask,
  LabDefinition,
  Lesson,
  Stage,
} from "../model/types";

/**
 * The four Lernbereiche of the Fachlehrplan Mathematik 13 (Gymnasium,
 * erhöhtes Anforderungsniveau) and their hours, verbatim.
 */
const TOPICS = [
  "",
  "Flächeninhalt und bestimmtes Integral",
  "Normalverteilung",
  "Geraden und Ebenen im Raum",
  "Anwendungen der Differential- und Integralrechnung",
];

export const range = (
  key: string,
  label: string,
  min: number,
  max: number,
  value: number,
  step = 1,
  unit = "",
) => ({
  type: "range" as const,
  key,
  label,
  min,
  max,
  value,
  step,
  unit,
  digits: step < 1 ? 2 : 0,
});
export const choice = (
  key: string,
  label: string,
  labels: string[],
  value = 0,
) => ({
  type: "choice" as const,
  key,
  label,
  value,
  options: labels.map((label, value) => ({ value, label })),
});
export const output = (
  key: string,
  label: string,
  compute: (v: Record<string, number>) => number | string,
  unit = "",
  digits = 2,
) => ({ key, label, compute, unit, digits });

/** A lesson of Lernbereich `stage`; every Kompetenzerwartung names its own lesson or shares one. */
export function makeLesson(
  stage: number,
  step: number,
  content: Omit<
    Lesson,
    "stageId" | "stepNumber" | "lehrplan" | "requiredCorrect" | "celebrationMessage"
  >,
): Lesson {
  return {
    ...content,
    stageId: `stage-${stage}`,
    stepNumber: step,
    lehrplan: `M13 LB ${stage}: ${TOPICS[stage]}`,
    requiredCorrect: 3,
    celebrationMessage:
      "Du hast Schnellcheck, Labor und beide Aufgabenstufen bearbeitet.",
  };
}

export function makeStage(
  number: number,
  subtitle: string,
  accent: string,
  icon: string,
  lessons: Lesson[],
): Stage {
  return {
    id: `stage-${number}`,
    stageNumber: number,
    title: TOPICS[number],
    subtitle,
    accent,
    icon,
    badgeTitle: TOPICS[number],
    lehrplanLabel: `M13 LB ${number}: ${TOPICS[number]}`,
    lessons,
  };
}

export function lab(
  kind: LabDefinition["kind"],
  title: string,
  intro: string,
  params: LabDefinition["params"],
  readouts: LabDefinition["readouts"],
  goals: LabDefinition["goals"],
): LabDefinition {
  return { kind, title: `Labor: ${title}`, intro, params, readouts, goals };
}

/**
 * Shared task envelope; each generator supplies its own model and reasoning.
 * `reasoning` is one step or several, the last line of the task holds the
 * result in <strong>.
 */
export function task(
  level: DifficultyLevel,
  guided: string,
  transfer: string,
  fields: ExerciseTask["fields"],
  hint: string,
  reasoning: string | string[],
  result: string,
  meta: ExerciseTask["meta"] = {},
): ExerciseTask {
  const steps = [...(Array.isArray(reasoning) ? reasoning : [reasoning])];
  return {
    prompt: level === 1 ? guided : transfer,
    given: [],
    fields,
    feedbackHint: hint,
    ...(level === 1 ? { formulaHint: hint } : {}),
    steps: [...steps, `<strong>${result}</strong>`],
    meta,
  };
}
