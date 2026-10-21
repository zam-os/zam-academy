import { CORE_LESSONS, LESSONS } from "../curriculum";
import type { Level } from "../model/types";
import { MODEL_SCENARIOS, modelReady } from "../models";
import { type BioProject, freshProject, projectReady, sanitizeProject } from "../project";

export const STORAGE_KEY = "biologie_rs10_academy_progress_v1";
export interface Progress {
  activeLessonId: string;
  level: Level;
  includeNerves: boolean;
  includeEvolution: boolean;
  explored: Record<string, string[]>;
  project: BioProject;
  quizDone: string[];
  workshopDone: string[];
  writingDone: string[];
  drafts: Record<string, string>;
}

export const writingKey = (id: string, level: Level): string => `${id}:${level}`;
const lessonIds = new Set(LESSONS.map((lesson) => lesson.id));
const writingKeys = new Set(
  LESSONS.flatMap((lesson) => [writingKey(lesson.id, 1), writingKey(lesson.id, 2)]),
);
const strings = (value: unknown, allowed: Set<string>): string[] =>
  Array.isArray(value)
    ? [
        ...new Set(
          value.filter((entry): entry is string => typeof entry === "string" && allowed.has(entry)),
        ),
      ]
    : [];

export function freshProgress(): Progress {
  return {
    activeLessonId: CORE_LESSONS[0].id,
    level: 1,
    includeNerves: false,
    includeEvolution: false,
    explored: {},
    project: freshProject(),
    quizDone: [],
    workshopDone: [],
    writingDone: [],
    drafts: {},
  };
}

export function parseProgress(raw: string | null): Progress {
  const base = freshProgress();
  try {
    const parsed = JSON.parse(raw ?? "null") as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return base;
    const value = parsed as Record<string, unknown>;
    const drafts: Record<string, string> = {};
    if (value.drafts && typeof value.drafts === "object" && !Array.isArray(value.drafts)) {
      for (const [key, draft] of Object.entries(value.drafts)) {
        if (writingKeys.has(key) && typeof draft === "string") drafts[key] = draft.slice(0, 8000);
      }
    }
    const explored: Record<string, string[]> = {};
    if (value.explored && typeof value.explored === "object" && !Array.isArray(value.explored)) {
      for (const lesson of LESSONS) {
        if (lesson.model && Array.isArray((value.explored as Record<string, unknown>)[lesson.id]))
          explored[lesson.id] = strings(
            (value.explored as Record<string, unknown>)[lesson.id],
            new Set(MODEL_SCENARIOS[lesson.model].map((s) => s.id)),
          );
      }
    }
    const writingDone = strings(value.writingDone, writingKeys).filter(
      (key) => (drafts[key]?.trim().length ?? 0) >= 20,
    );
    return {
      activeLessonId:
        typeof value.activeLessonId === "string" && lessonIds.has(value.activeLessonId)
          ? value.activeLessonId
          : base.activeLessonId,
      level: value.level === 2 ? 2 : 1,
      includeNerves: value.includeNerves === true,
      includeEvolution: value.includeEvolution === true,
      explored,
      project: sanitizeProject(value.project),
      quizDone: strings(value.quizDone, lessonIds),
      workshopDone: strings(value.workshopDone, lessonIds),
      writingDone,
      drafts,
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

/** False means persistence failed; callers keep working in memory and tell the learner. */
export function saveProgress(progress: Progress): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}

export function isComplete(progress: Progress, id: string): boolean {
  const lesson = LESSONS.find((entry) => entry.id === id);
  if (!lesson) return false;
  return (
    (!lesson.model || modelReady(lesson.model, progress.explored[id] ?? [])) &&
    (!lesson.projectStep || projectReady(progress.project, lesson.projectStep)) &&
    progress.quizDone.includes(id) &&
    progress.workshopDone.includes(id) &&
    progress.writingDone.includes(writingKey(id, 1))
  );
}

export function completion(
  progress: Progress,
  includeNerves = false,
  includeEvolution = false,
): { completed: number; total: number; percent: number } {
  const lessons = LESSONS.filter(
    (lesson) =>
      !lesson.optional ||
      (lesson.lb === 5 && includeNerves) ||
      (lesson.lb === 6 && includeEvolution),
  );
  const completed = lessons.filter((lesson) => isComplete(progress, lesson.id)).length;
  return {
    completed,
    total: lessons.length,
    percent: Math.round((100 * completed) / lessons.length),
  };
}
