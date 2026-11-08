import type {
  DifficultyLevel,
  ExerciseTask,
  LabDefinition,
  Lesson,
  Stage,
} from "../model/types";

/** The three Lernbereiche of Fachlehrplan M6 (Gymnasium) and their sections, verbatim. */
const TOPICS = [
  "",
  "Rationale Zahlen",
  "Flächeninhalt und Volumen",
  "Prozentrechnung, Daten und Diagramme",
];
const SECTIONS: Record<number, Record<number, string>> = {
  1: {
    1: "Bruchteile und Bruchzahlen",
    2: "Dezimalbrüche",
    3: "Addition und Subtraktion rationaler Zahlen",
    4: "Multiplikation und Division rationaler Zahlen",
    5: "Verbindung der Grundrechenarten bei rationalen Zahlen",
  },
  2: {
    1: "Flächeninhalt",
    2: "Volumen",
  },
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

export const output = (
  key: string,
  label: string,
  compute: (v: Record<string, number>) => number | string,
  unit = "",
  digits = 2,
) => ({ key, label, compute, unit, digits });

/** A lesson of Lernbereich `stage`; `section` names its part where the plan has parts. */
export function makeLesson(
  stage: number,
  step: number,
  section: number | null,
  content: Omit<
    Lesson,
    "stageId" | "stepNumber" | "lehrplan" | "requiredCorrect" | "celebrationMessage"
  >,
): Lesson {
  return {
    ...content,
    stageId: `stage-${stage}`,
    stepNumber: step,
    lehrplan: section
      ? `M6 LB ${stage}.${section}: ${SECTIONS[stage][section]}`
      : `M6 LB ${stage}: ${TOPICS[stage]}`,
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
    lehrplanLabel: `M6 LB ${number}: ${TOPICS[number]}`,
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
