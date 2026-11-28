import { findLesson, LESSONS, lessonsFor } from "../curriculum";
import type { Lesson, Level, Track } from "../model/types";
import { MODEL_SCENARIOS, modelReady } from "../models";
export const STORAGE_KEY = "physik_gym8_academy_progress_v1";
export const PRACTICE_LEVELS = [1, 2] as const;
export const REQUIRED_CORRECT = 3;
/** A notebook slot for each of the six common experiments and the NTG investigations. */
export const EXPERIMENT_SLOTS = [
  { lb: 1, title: "Kennlinien von Widerstand und Glühlampe" },
  { lb: 1, title: "Strom und Spannung in Reihen- und Parallelschaltungen" },
  { lb: 2, title: "Spiegelbilder und Reflexionsgesetz" },
  { lb: 2, title: "Abbildung durch eine Sammellinse" },
  { lb: 3, title: "Beschleunigung aus gemessenen Geschwindigkeiten" },
  { lb: 3, title: "Kraft und Dehnung einer Feder" },
  { lb: 4, title: "Solarmodule in Reihe und parallel (NTG)" },
  { lb: 4, title: "Weitere Elektrizitätsquellen untersuchen (NTG)" },
] as const;
export interface Experiment {
  lb: 1 | 2 | 3 | 4;
  status: "planned" | "done";
  question: string;
  setup: string;
  data: string;
  conclusion: string;
}
export const freshExperiment = (): Experiment => ({
  lb: 1,
  status: "planned",
  question: "",
  setup: "",
  data: "",
  conclusion: "",
});
export interface Progress {
  activeLessonId: string;
  level: Level;
  track: Track;
  includeExtra: boolean;
  explored: Record<string, string[]>;
  quizDone: string[];
  workshopDone: string[];
  writingDone: string[];
  drafts: Record<string, string>;
  calculationDone: Record<string, number>;
  exerciseSerial: Record<string, number>;
  experiments: Experiment[];
}
export const writingKey = (id: string, level: Level): string =>
  `${id}:${level}`;
const ids = new Set(LESSONS.map((l) => l.id));
const keys = new Set(
  LESSONS.flatMap((l) => [writingKey(l.id, 1), writingKey(l.id, 2)]),
);
const strings = (v: unknown, allowed: Set<string>): string[] =>
  Array.isArray(v)
    ? [
        ...new Set(
          v.filter((x): x is string => typeof x === "string" && allowed.has(x)),
        ),
      ]
    : [];
export function freshProgress(): Progress {
  return {
    activeLessonId: LESSONS[0].id,
    level: 1,
    track: "ANDERE",
    includeExtra: false,
    explored: {},
    quizDone: [],
    workshopDone: [],
    writingDone: [],
    drafts: {},
    calculationDone: {},
    exerciseSerial: {},
    experiments: EXPERIMENT_SLOTS.map(({ lb }) => ({
      ...freshExperiment(),
      lb,
    })),
  };
}
export function parseProgress(raw: string | null): Progress {
  const base = freshProgress();
  try {
    const parsed: unknown = JSON.parse(raw ?? "null");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return base;
    const v = parsed as Record<string, unknown>;
    const object = (x: unknown): Record<string, unknown> =>
      x && typeof x === "object" && !Array.isArray(x)
        ? (x as Record<string, unknown>)
        : {};
    const drafts: Record<string, string> = {};
    for (const [key, value] of Object.entries(object(v.drafts)))
      if (keys.has(key) && typeof value === "string")
        drafts[key] = value.slice(0, 8000);
    const explored: Record<string, string[]> = {};
    for (const lesson of LESSONS)
      if (lesson.model)
        explored[lesson.id] = strings(
          object(v.explored)[lesson.id],
          new Set(MODEL_SCENARIOS[lesson.model].map((s) => s.id)),
        );
    const counters = (input: unknown, limit: number) => {
      const output: Record<string, number> = {};
      for (const [key, value] of Object.entries(object(input)))
        if (
          keys.has(key) &&
          typeof value === "number" &&
          Number.isInteger(value) &&
          value >= 0
        )
          output[key] = Math.min(value, limit);
      return output;
    };
    const track: Track = v.track === "NTG" ? "NTG" : "ANDERE",
      includeExtra = v.includeExtra === true;
    const visible = lessonsFor(track, includeExtra);
    const experiments = base.experiments.map((fallback, i) => {
      const entry = object(
        Array.isArray(v.experiments) ? v.experiments[i] : null,
      );
      return {
        ...fallback,
        status:
          entry.status === "done" ? ("done" as const) : ("planned" as const),
        ...Object.fromEntries(
          ["question", "setup", "data", "conclusion"].map((key) => [
            key,
            typeof entry[key] === "string" ? entry[key].slice(0, 4000) : "",
          ]),
        ),
      };
    });
    return {
      ...base,
      track,
      includeExtra,
      activeLessonId:
        typeof v.activeLessonId === "string" &&
        visible.some((l) => l.id === v.activeLessonId)
          ? v.activeLessonId
          : visible[0].id,
      level: v.level === 2 ? 2 : 1,
      drafts,
      explored,
      experiments,
      quizDone: strings(v.quizDone, ids),
      workshopDone: strings(v.workshopDone, ids),
      writingDone: strings(v.writingDone, keys).filter(
        (key) => (drafts[key]?.trim().length ?? 0) >= 20,
      ),
      calculationDone: counters(v.calculationDone, REQUIRED_CORRECT),
      exerciseSerial: counters(v.exerciseSerial, 1_000_000),
    };
  } catch {
    return base;
  }
}
export function loadProgress(): Progress {
  try {
    return parseProgress(localStorage.getItem(STORAGE_KEY));
  } catch {
    return freshProgress();
  }
}
export function saveProgress(progress: Progress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
export function practiceStatus(
  progress: Progress,
  lesson: Lesson,
  level: Level,
) {
  const key = writingKey(lesson.id, level);
  const writingDone = progress.writingDone.includes(key);
  const solved = progress.calculationDone[key] ?? 0;
  return {
    writingDone,
    solved,
    complete:
      writingDone && (!lesson.calculation || solved >= REQUIRED_CORRECT),
  };
}

export function isComplete(progress: Progress, id: string): boolean {
  const lesson = findLesson(id);
  if (!lesson) return false;
  return (
    (!lesson.model || modelReady(lesson.model, progress.explored[id] ?? [])) &&
    progress.quizDone.includes(id) &&
    progress.workshopDone.includes(id) &&
    PRACTICE_LEVELS.every(
      (level) => practiceStatus(progress, lesson, level).complete,
    )
  );
}
export function completion(progress: Progress) {
  const lessons = lessonsFor(progress.track).filter((l) => !l.optional),
    completed = lessons.filter((l) => isComplete(progress, l.id)).length;
  return {
    completed,
    total: lessons.length,
    percent: Math.round((100 * completed) / lessons.length),
  };
}
export const experimentDocumented = (e: Experiment): boolean =>
  e.status === "done" &&
  [e.question, e.setup, e.data, e.conclusion].every(
    (x) => x.trim().length >= 20,
  );
/** The notebook records individual experiments; classroom requirements are stated separately. */
export function experimentSummary(experiments: Experiment[], track: Track) {
  const visible = experiments.filter(
    (experiment) => experiment.lb !== 4 || track === "NTG",
  );
  return {
    count: visible.filter(experimentDocumented).length,
    total: visible.length,
  };
}
