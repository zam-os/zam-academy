import type {
  DifficultyLevel,
  ExerciseTask,
  LabDefinition,
  Lesson,
  Stage,
} from "../model/types";
import { mathMarkup } from "../ui/math-text";

/**
 * Every task text the learner reads: the real minus sign, superscripts and
 * subscripts set from `^`/`_`, and no coefficient 1 in front of a variable
 * ("1x" is written "x").
 */
const tidy = (html: string) =>
  mathMarkup(
    html
      .replace(/(^|[\s(=:|,{±|])-(?=\d)/g, "$1−")
      .replace(/(^|[\s(=+−·])1([a-z])(?![a-zA-Z])/g, "$1$2"),
  );

/** Applies `tidy` to whatever a generator returns, however it was built. */
function tidyTask(task: ExerciseTask): ExerciseTask {
  return {
    ...task,
    prompt: tidy(task.prompt),
    given: task.given.map(tidy),
    steps: task.steps.map(tidy),
    ...(task.feedbackHint ? { feedbackHint: tidy(task.feedbackHint) } : {}),
    ...(task.formulaHint ? { formulaHint: tidy(task.formulaHint) } : {}),
  };
}

/** Die fünf Lernbereiche des Fachlehrplans M12 (Gymnasium) wortgleich. */
export const TOPICS = [
  "",
  "Untersuchung von Funktionen – Stammfunktion, Produkt- und Kettenregel",
  "Zufallsgrößen und Binomialverteilung",
  "Einseitiger Signifikanztest (bei als binomialverteilt angenommenen Merkmalen)",
  "Untersuchung von Funktionen – Quotientenregel, Umkehrfunktion",
  "Grundlagen der Koordinatengeometrie im Raum",
];

export const SECTIONS: Record<number, Record<number, string>> = {
  1: {
    1: "Ganzrationale Funktionen (mit Parametern)",
    2: "Natürliche Exponentialfunktion",
    3: "Sinus- und Kosinusfunktion",
  },
  4: {
    1: "Gebrochen-rationale Funktionen",
    2: "Wurzelfunktion",
    3: "Natürliche Logarithmusfunktion",
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
    exercises: content.exercises.map((generator) => ({
      ...generator,
      make: (rng, level) => tidyTask(generator.make(rng, level)),
    })),
    title: content.title.startsWith(`${stage}.${step} `)
      ? content.title
      : `${stage}.${step} ${content.title}`,
    stageId: `stage-${stage}`,
    stepNumber: step,
    lehrplan: section
      ? `M12 LB ${stage}.${section}: ${SECTIONS[stage][section]}`
      : `M12 LB ${stage}: ${TOPICS[stage]}`,
    requiredCorrect: 3,
    celebrationMessage:
      "Du hast Schnellcheck, Labor und beide Aufgabenstufen gemeistert.",
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
    lehrplanLabel: `M12 LB ${number}: ${TOPICS[number]}`,
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

export interface TaskLevelSpec {
  prompt: string;
  given?: string[];
  fields: ExerciseTask["fields"];
  hint?: string;
  reasoning: string;
  result: string;
  meta?: ExerciseTask["meta"];
}

export function levelTask(
  level: DifficultyLevel,
  l1: TaskLevelSpec,
  l2: TaskLevelSpec,
): ExerciseTask {
  const spec = level === 1 ? l1 : l2;
  const cleanResult = tidy(spec.result);
  const cleanReasoning = tidy(spec.reasoning);
  const cleanHint = tidy(spec.hint ?? (level === 1 ? "Wende die passende mathematische Rechenregel an." : spec.reasoning));
  const cleanPrompt = tidy(spec.prompt);

  return {
    prompt: cleanPrompt,
    given: (spec.given ?? []).map(tidy),
    fields: spec.fields,
    feedbackHint: cleanHint,
    ...(level === 1 ? { formulaHint: cleanHint } : {}),
    steps: [cleanReasoning, `<strong>${cleanResult}</strong>`],
    meta: spec.meta ?? {},
  };
}

export function task(
  level: DifficultyLevel,
  guided: string,
  transfer: string,
  fields: ExerciseTask["fields"],
  arg5: string,
  arg6: string,
  arg7?: string | ExerciseTask["meta"],
  arg8: ExerciseTask["meta"] = {},
): ExerciseTask {
  let hint: string;
  let reasoning: string;
  let result: string;
  let meta: ExerciseTask["meta"];

  if (typeof arg7 === "object" && arg7 !== null) {
    hint = "Wende die passende mathematische Rechenregel an.";
    reasoning = arg5;
    result = arg6;
    meta = arg7;
  } else if (typeof arg7 === "string") {
    hint = arg5;
    reasoning = arg6;
    result = arg7;
    meta = arg8 ?? {};
  } else {
    hint = "Wende die passende mathematische Rechenregel an.";
    reasoning = arg5;
    result = arg6;
    meta = {};
  }

  const cleanResult = tidy(result);
  const cleanReasoning = tidy(reasoning);
  const cleanHint = tidy(hint);
  const cleanGuided = tidy(guided);
  const cleanTransfer = tidy(transfer);

  return {
    prompt: level === 1 ? cleanGuided : cleanTransfer,
    given: [],
    fields,
    feedbackHint: cleanHint,
    ...(level === 1 ? { formulaHint: cleanHint } : {}),
    steps: [cleanReasoning, `<strong>${cleanResult}</strong>`],
    meta,
  };
}
