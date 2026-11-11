import type {
  DifficultyLevel,
  ExerciseTask,
  LabDefinition,
  Lesson,
  Stage,
} from "../model/types";

/** The common Mittelschule curriculum; numbered sections belong to their learning area. */
const TOPICS = [
  "",
  "Natürliche Zahlen",
  "Ganze Zahlen",
  "Geometrische Figuren und Lagebeziehungen",
  "Flächeninhalt – Rechtecke",
  "Größen im Alltag",
  "Daten",
  "Gleichungen und Formeln",
];
const SECTIONS: Record<string, string> = {
  "1.1": "Der Zahlenraum über eine Milliarde hinaus",
  "1.2": "Grundrechenarten im Bereich der natürlichen Zahlen",
};

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

/** A lesson of Lernbereich `stage`; `section` names the part of Lernbereich 1. */
export function makeLesson(
  stage: number,
  step: number,
  section: number | null,
  content: Omit<
    Lesson,
    | "stageId"
    | "stepNumber"
    | "lehrplan"
    | "requiredCorrect"
    | "celebrationMessage"
  >,
): Lesson {
  return {
    ...content,
    stageId: `stage-${stage}`,
    stepNumber: step,
    lehrplan: section
      ? `M5 LB ${stage}.${section}: ${SECTIONS[`${stage}.${section}`]}`
      : `M5 LB ${stage}: ${TOPICS[stage]}`,
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
    lehrplanLabel: `M5 LB ${number}: ${TOPICS[number]}`,
    lessons: lessons.map((lesson, index) => ({
      ...lesson,
      stageId: `stage-${number}`,
      stepNumber: index + 1,
      title: lesson.title.replace(/^\d+\.\d+ /, `${number}.${index + 1} `),
    })),
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

/** Shared task envelope; each generator supplies its own model and reasoning. */
export function task(
  level: DifficultyLevel,
  guided: string,
  transfer: string,
  fields: ExerciseTask["fields"],
  hint: string,
  reasoning: string,
  result: string,
  meta: ExerciseTask["meta"] = {},
): ExerciseTask {
  return {
    prompt: level === 1 ? guided : transfer,
    given: [],
    fields,
    feedbackHint: hint,
    ...(level === 1 ? { formulaHint: hint } : {}),
    steps: [reasoning, `<strong>${result}</strong>`],
    meta,
  };
}
