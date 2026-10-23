import type {
  DifficultyLevel,
  ExerciseTask,
  LabDefinition,
  Lesson,
  Stage,
  Track,
} from "../model/types";

export const BOTH: Track[] = ["I", "II_III"];
const TOPICS = [
  "",
  "Potenzen",
  "Parallelverschiebung",
  "Dreiecke",
  "Raumgeometrie",
  "Geometrische Ortslinien und Ortsbereiche",
  "Terme, Gleichungen und Ungleichungen",
  "Proportionalitäten",
  "Auswertung von Daten",
];

function curriculumLabel(
  lb: [number, number | null],
  tracks: Track[],
  topic: string,
): string {
  return `${tracks.map((track) => `M7 LB ${track === "I" ? lb[0] : lb[1]} (${track === "I" ? "I" : "II/III"})`).join(" · ")}: ${topic}`;
}
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

/** Curriculum placement is explicit for each track, even where LB numbers differ. */
export function makeLesson(
  stage: number,
  step: number,
  lb: [number, number | null],
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
  const tracks = content.tracks ?? (lb[1] === null ? ["I"] : BOTH);
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
  lb: [number, number | null],
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
      lb[1] === null ? ["I"] : BOTH,
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
