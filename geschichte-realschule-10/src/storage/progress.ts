import { CORE_LESSONS, LESSONS } from "../curriculum";
import type { Level } from "../model/types";

export const STORAGE_KEY = "geschichte_rs10_academy_progress_v1";
export interface Progress {
  activeLessonId: string;
  level: Level;
  includeEnglish: boolean;
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
    includeEnglish: false,
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
    const writingDone = strings(value.writingDone, writingKeys).filter(
      (key) => (drafts[key]?.trim().length ?? 0) >= 20,
    );
    return {
      activeLessonId:
        typeof value.activeLessonId === "string" && lessonIds.has(value.activeLessonId)
          ? value.activeLessonId
          : base.activeLessonId,
      level: value.level === 2 ? 2 : 1,
      includeEnglish: value.includeEnglish === true,
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
  return (
    progress.quizDone.includes(id) &&
    progress.workshopDone.includes(id) &&
    progress.writingDone.includes(writingKey(id, 1))
  );
}

export function completion(
  progress: Progress,
  includeEnglish = false,
): { completed: number; total: number; percent: number } {
  const lessons = includeEnglish ? LESSONS : CORE_LESSONS;
  const completed = lessons.filter((lesson) => isComplete(progress, lesson.id)).length;
  return {
    completed,
    total: lessons.length,
    percent: Math.round((100 * completed) / lessons.length),
  };
}
