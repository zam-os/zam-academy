import type {
  DifficultyLevel,
  ExerciseTask,
  LabDefinition,
  Lesson,
  NumberField,
  Stage,
} from "../model/types";
import { reduce } from "../models";
import { numberField } from "./helpers";

const TOPICS = [
  "",
  "Rationale Zahlen",
  "Achsenspiegelung und Symmetrie",
  "Flächeninhalt ebener Figuren",
  "Raumgeometrie",
  "Terme und Gleichungen",
  "Direkte Proportionalität",
];

const curriculumLabel = (lb: number): string => `M6 LB ${lb}: ${TOPICS[lb]}`;

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

/** One Lernbereich is one stage; the plan is the same for all Zweige in grade 6. */
export function makeLesson(
  stage: number,
  step: number,
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
    lehrplan: curriculumLabel(stage),
    requiredCorrect: 3,
    celebrationMessage:
      "Du hast Schnellcheck, Labor und beide Aufgabenstufen bearbeitet.",
  };
}

export function makeStage(
  number: number,
  title: string,
  subtitle: string,
  accent: string,
  icon: string,
  lessons: Lesson[],
): Stage {
  return {
    id: `stage-${number}`,
    stageNumber: number,
    title,
    subtitle,
    accent,
    icon,
    badgeTitle: title,
    lehrplanLabel: curriculumLabel(number),
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

/**
 * Numerator and denominator as two whole-number fields, so a task can insist
 * on the fully reduced form. An unreduced result gets its own hint.
 */
export function fractionFields(
  n: number,
  d: number,
  prefix = "",
): NumberField[] {
  const [z, m] = reduce(n, d);
  // A whole number needs no denominator of 1.
  if (m === 1) return [numberField(`${prefix}Ergebnis =`, z, "", 0)];
  const hint = "Der Wert stimmt vielleicht schon, aber kürze noch vollständig.";
  return [
    numberField(`${prefix}Zähler =`, z, "", 0, {
      slips: Math.abs(n) !== Math.abs(z) ? [{ value: n, hint }] : [],
    }),
    numberField(`${prefix}Nenner =`, m, "", 0, {
      slips: Math.abs(d) !== m ? [{ value: Math.abs(d), hint }] : [],
    }),
  ];
}
