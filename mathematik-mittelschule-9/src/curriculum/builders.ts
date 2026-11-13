import { gcd } from "../exercises/format";
import type {
  DifficultyLevel,
  ExerciseGenerator,
  ExerciseTask,
  LabDefinition,
  Lesson,
  NumberField,
  Stage,
  Track,
} from "../model/types";
import { numberField } from "./helpers";

/**
 * The eight Lernbereiche of the grade 9 Fachlehrpläne. Regelklasse (R9) and
 * Mittlere-Reife-Klasse (M9) share the numbering and the titles; M9 asks for
 * more within several of them.
 */
export const TOPICS = [
  "",
  "Prozent- und Zinsrechnung",
  "Potenzen",
  "Geometrische Figuren, Körper und Lagebeziehungen",
  "Flächeninhalt – Vielecke",
  "Rauminhalt – Prismen, Pyramiden, Kegel",
  "Wahrscheinlichkeiten",
  "Gleichungen",
  "Funktionale Zusammenhänge",
];

/** Both Züge, the default of a lesson. */
export const BOTH: Track[] = ["R", "M"];
/** Only the Mittlere-Reife-Klasse. */
export const M_ONLY: Track[] = ["M"];

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
  digits: step < 1 ? (step < 0.1 ? 2 : 1) : 0,
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
  emphasis = false,
) => ({ key, label, compute, unit, digits, ...(emphasis ? { emphasis } : {}) });

/** "R9 LB 3 · M9 LB 3: …" for both Züge, "M9 LB 3: …" for the M-Klasse alone. */
export function lehrplanLabel(stage: number, tracks: Track[]): string {
  const parts = tracks.map((t) => `${t === "R" ? "R9" : "M9"} LB ${stage}`);
  return `${parts.join(" · ")}: ${TOPICS[stage]}`;
}

/** A lesson of Lernbereich `stage`; stage and step numbers come from makeStage. */
export function makeLesson(
  stage: number,
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
    exercises: content.exercises.map((generator) => ({
      ...generator,
      make: withoutHalfway(generator.make),
    })),
    stageId: `stage-${stage}`,
    stepNumber: 0,
    lehrplan: lehrplanLabel(stage, content.tracks),
    requiredCorrect: 3,
    celebrationMessage:
      "Du hast Schnellcheck, Labor und beide Aufgabenstufen bearbeitet.",
  };
}

/**
 * True when a value lies exactly halfway between two numbers of `digits`
 * decimals, such as 12,345 € for cents. Learners and calculators round such
 * values differently, so no task asks for one.
 */
export function isHalfway(value: number, digits: number): boolean {
  const scaled = Math.abs(value) * 10 ** digits;
  return Math.abs(scaled - Math.floor(scaled) - 0.5) < 1e-6;
}

/** Draws a task again (up to 40 times) while one of its answers sits at a rounding half. */
function withoutHalfway(make: ExerciseGenerator["make"]): ExerciseGenerator["make"] {
  return (rng, level) => {
    let made = make(rng, level);
    for (
      let i = 0;
      i < 40 &&
      made.fields.some(
        (field) => field.kind === "number" && isHalfway(field.answer, field.digits),
      );
      i++
    )
      made = make(rng, level);
    return made;
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
    lehrplanLabel: `R9 LB ${number} · M9 LB ${number}: ${TOPICS[number]}`,
    lessons: lessons.map((lesson, index) => ({
      ...lesson,
      stageId: `stage-${number}`,
      stepNumber: index + 1,
      title: `${number}.${index + 1} ${lesson.title}`,
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
  actions?: LabDefinition["actions"],
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

/**
 * A task on either level. Level 1 shows the given values and the hint; Level 2
 * has its own prompt in words and gets the hint only after a wrong attempt.
 * `steps` is the worked solution; the result is added as the last step.
 */
export function task(
  level: DifficultyLevel,
  prompt: string,
  fields: ExerciseTask["fields"],
  hint: string,
  steps: string[],
  result: string,
  meta: ExerciseTask["meta"] = {},
  given: string[] = [],
): ExerciseTask {
  return {
    prompt,
    given: level === 1 ? given : [],
    fields,
    feedbackHint: hint,
    ...(level === 1 ? { formulaHint: hint } : {}),
    steps: [...steps, `<strong>${result}</strong>`],
    meta,
  };
}

/** First names for word problems, varied by the task's random numbers. */
export const NAMES = [
  "Lena",
  "Jonas",
  "Aylin",
  "Tim",
  "Mia",
  "Luca",
  "Emre",
  "Sofia",
  "Ben",
  "Lara",
  "Noah",
  "Hannah",
  "Milan",
  "Elif",
];

/**
 * Numerator and denominator as two whole-number fields, so a task can insist
 * on the fully reduced form. An unreduced result gets its own hint.
 */
export function fractionFields(n: number, d: number, prefix = ""): NumberField[] {
  const g = gcd(n, d);
  const z = n / g;
  const m = d / g;
  const hint = "Der Wert stimmt vielleicht schon, aber kürze noch vollständig.";
  return [
    numberField(`${prefix}Zähler =`, z, "", 0, { slips: z !== n ? [{ value: n, hint }] : [] }),
    numberField(`${prefix}Nenner =`, m, "", 0, { slips: m !== d ? [{ value: d, hint }] : [] }),
  ];
}
