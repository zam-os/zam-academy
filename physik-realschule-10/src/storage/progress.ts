import { findLesson, LESSONS, lessonsFor } from "../curriculum";
import type { Level, Track } from "../model/types";
import { MODEL_SCENARIOS, modelReady } from "../models";
export const STORAGE_KEY = "physik_rs10_academy_progress_v1";
export interface Experiment {
  lb: 1 | 2;
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
    track: "II_III",
    includeExtra: false,
    explored: {},
    quizDone: [],
    workshopDone: [],
    writingDone: [],
    drafts: {},
    calculationDone: {},
    exerciseSerial: {},
    experiments: [
      freshExperiment(),
      { ...freshExperiment(), lb: 2 },
      { ...freshExperiment(), lb: 2 },
    ],
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
    const track = v.track === "I" ? "I" : "II_III",
      includeExtra = v.includeExtra === true;
    const visible = lessonsFor(track, includeExtra);
    const experiments = base.experiments.map((fallback, i) => {
      const entry = object(
        Array.isArray(v.experiments) ? v.experiments[i] : null,
      );
      return {
        ...fallback,
        lb:
          entry.lb === 1
            ? (1 as const)
            : entry.lb === 2
              ? (2 as const)
              : fallback.lb,
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
      calculationDone: counters(v.calculationDone, 3),
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
export function isComplete(progress: Progress, id: string): boolean {
  const lesson = findLesson(id);
  if (!lesson) return false;
  return (
    (!lesson.model || modelReady(lesson.model, progress.explored[id] ?? [])) &&
    (!lesson.calculation ||
      (progress.calculationDone[writingKey(id, 1)] ?? 0) >= 3) &&
    progress.quizDone.includes(id) &&
    progress.workshopDone.includes(id) &&
    progress.writingDone.includes(writingKey(id, 1))
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
export function experimentSummary(experiments: Experiment[]) {
  const done = experiments.filter(experimentDocumented);
  return {
    count: done.length,
    coversBoth: done.some((e) => e.lb === 1) && done.some((e) => e.lb === 2),
    ready:
      done.length >= 3 &&
      done.some((e) => e.lb === 1) &&
      done.some((e) => e.lb === 2),
  };
}
