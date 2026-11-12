import type {
  DifficultyLevel,
  ExerciseTask,
  LabAction,
  LabDefinition,
  Lesson,
  Stage,
  Track,
} from "../model/types";

export const BOTH: Track[] = ["R", "M"];

const TOPICS = [
  "",
  "Prozentrechnung",
  "Quadratzahlen und Quadratwurzeln",
  "Geometrische Figuren, Körper und Lagebeziehungen",
  "Flächeninhalt – Kreise",
  "Rauminhalt – Zylinder",
  "Zufallsexperimente",
  "Gleichungen",
  "Funktionale Zusammenhänge",
];

function curriculumLabel(
  lb: [number | null, number],
  tracks: Track[],
  topic: string,
): string {
  return `${tracks.map((track) => `M8 LB ${track === "R" ? lb[0] : lb[1]} (${track})`).join(" · ")}: ${topic}`;
}

export const range = (
  key: string,
  label: string,
  min: number,
  max: number,
  value: number,
  step = 1,
  unit = "",
  showIf?: (v: Record<string, number>) => boolean,
) => ({
  type: "range" as const,
  key,
  label,
  min,
  max,
  value,
  step,
  unit,
  digits: step < 1 ? (step < 0.1 ? 2 : 1) : 0,
  ...(showIf ? { showIf } : {}),
});

export const choice = (
  key: string,
  label: string,
  labels: string[],
  value = 0,
  showIf?: (v: Record<string, number>) => boolean,
) => ({
  type: "choice" as const,
  key,
  label,
  value,
  options: labels.map((l, v) => ({ value: v, label: l })),
  ...(showIf ? { showIf } : {}),
});

export const state = (key: string, value: number, resetOnChange = true) => ({
  type: "state" as const,
  key,
  value,
  resetOnChange,
});

export const output = (
  key: string,
  label: string,
  compute: (v: Record<string, number>) => number | string,
  unit = "",
  digits = 2,
  emphasis = false,
) => ({ key, label, compute, unit, digits, ...(emphasis ? { emphasis: true } : {}) });

export function makeLesson(
  stage: number,
  step: number,
  lb: [number | null, number],
  content: Omit<
    Lesson,
    | "stageId"
    | "stepNumber"
    | "lehrplan"
    | "requiredCorrect"
    | "celebrationMessage"
    | "tracks"
  > & { tracks?: Track[] },
): Lesson {
  const tracks = content.tracks ?? (lb[0] === null ? ["M"] : BOTH);
  return {
    ...content,
    tracks,
    stageId: `stage-${stage}`,
    stepNumber: step,
    lehrplan: curriculumLabel(lb, tracks, TOPICS[stage]),
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
  lb: [number | null, number],
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
    lehrplanLabel: curriculumLabel(
      lb,
      lb[0] === null ? ["M"] : BOTH,
      TOPICS[number],
    ),
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
  actions?: LabAction[],
): LabDefinition {
  return {
    kind,
    title: `Labor: ${title}`,
    intro,
    params,
    readouts,
    goals,
    ...(actions ? { actions } : {}),
  };
}

export function task(
  level: DifficultyLevel,
  guided: string,
  transfer: string,
  fields: ExerciseTask["fields"],
  hint: string,
  steps: string[],
  meta: ExerciseTask["meta"] = {},
): ExerciseTask {
  return {
    prompt: level === 1 ? guided : transfer,
    given: [],
    fields,
    feedbackHint: hint,
    ...(level === 1 ? { formulaHint: hint } : {}),
    steps,
    meta,
  };
}
