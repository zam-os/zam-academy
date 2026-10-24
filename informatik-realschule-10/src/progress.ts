import { LESSONS, MODULES, WORKSHOPS } from "./curriculum";
import type { Lesson, Level, ModuleId } from "./types";
import { workshopSolved } from "./workshop";

export const STORAGE_KEY = "informatik_rs10_academy_v1";
export const LAB_IDS = [
  "network-web",
  "objects-counter",
  "objects-account",
  "objects-fraction",
  "logic-schutz",
  "logic-xor",
  "logic-adder",
  "robot-route",
  "robot-sensor",
  "ki-model",
] as const;
export interface Progress {
  modules: ModuleId[];
  active: string;
  level: Level;
  quiz: string[];
  workshops: string[];
  workshopDrafts: Record<string, number[]>;
  writing: string[];
  labs: string[];
  drafts: Record<string, string>;
  labDrafts: Record<string, string>;
}
const ids = new Set(LESSONS.map((lesson) => lesson.id));
const moduleIds = new Set(MODULES.map((module) => module.id));
const writingIds = new Set(
  LESSONS.flatMap((lesson) => [`${lesson.id}:1`, `${lesson.id}:2`]),
);
const labIds = new Set<string>(LAB_IDS);
export const writingKey = (id: string, level: Level) => `${id}:${level}`;
const allowed = (value: unknown, set: Set<string>): string[] =>
  Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (item): item is string => typeof item === "string" && set.has(item),
          ),
        ),
      ]
    : [];
export const canCompare = (value: string): boolean => value.trim().length >= 20;
export const canAssess = (value: string, checks: boolean[]): boolean =>
  canCompare(value) && checks.length === 3 && checks.every(Boolean);

export function freshProgress(): Progress {
  return {
    modules: MODULES.map((module) => module.id),
    active: LESSONS[0].id,
    level: 1,
    quiz: [],
    workshops: [],
    workshopDrafts: {},
    writing: [],
    labs: [],
    drafts: {},
    labDrafts: {},
  };
}

export function parseProgress(raw: string | null): Progress {
  const base = freshProgress();
  try {
    const value: unknown = JSON.parse(raw ?? "null");
    if (!value || typeof value !== "object" || Array.isArray(value))
      return base;
    const data = value as Record<string, unknown>;
    const readDrafts = (
      candidate: unknown,
      keys: Set<string>,
      limit: number,
    ): Record<string, string> => {
      const result: Record<string, string> = {};
      if (
        !candidate ||
        typeof candidate !== "object" ||
        Array.isArray(candidate)
      )
        return result;
      for (const [key, text] of Object.entries(candidate))
        if (keys.has(key) && typeof text === "string")
          result[key] = text.slice(0, limit);
      return result;
    };
    const drafts = readDrafts(data.drafts, writingIds, 8000);
    const workshopDrafts: Record<string, number[]> = {};
    if (
      data.workshopDrafts &&
      typeof data.workshopDrafts === "object" &&
      !Array.isArray(data.workshopDrafts)
    ) {
      for (const [id, candidate] of Object.entries(data.workshopDrafts)) {
        if (!ids.has(id) || !Array.isArray(candidate)) continue;
        const workshop = WORKSHOPS[id];
        workshopDrafts[id] = workshop.entries.map((_, index) => {
          const answer: unknown = candidate[index];
          return typeof answer === "number" &&
            Number.isInteger(answer) &&
            answer >= 0 &&
            answer < workshop.categories.length
            ? answer
            : -1;
        });
      }
    }
    const modules = allowed(data.modules, moduleIds) as ModuleId[];
    return {
      modules: modules.length ? modules : base.modules,
      active:
        typeof data.active === "string" && ids.has(data.active)
          ? data.active
          : base.active,
      level: data.level === 2 ? 2 : 1,
      quiz: allowed(data.quiz, ids),
      workshops: allowed(data.workshops, ids).filter((id) =>
        workshopSolved(WORKSHOPS[id], workshopDrafts[id] ?? []),
      ),
      workshopDrafts,
      writing: allowed(data.writing, writingIds).filter((key) =>
        canCompare(drafts[key] ?? ""),
      ),
      labs: allowed(data.labs, labIds),
      drafts,
      labDrafts: readDrafts(data.labDrafts, labIds, 12000),
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
export function complete(progress: Progress, lesson: Lesson): boolean {
  return (
    progress.quiz.includes(lesson.id) &&
    progress.workshops.includes(lesson.id) &&
    progress.writing.includes(writingKey(lesson.id, progress.level)) &&
    (!lesson.lab || progress.labs.includes(lesson.lab))
  );
}
export const selectedLessons = (progress: Progress): Lesson[] =>
  LESSONS.filter((lesson) => progress.modules.includes(lesson.module));
export function invalidateLab(progress: Progress, id: string): void {
  progress.labs = progress.labs.filter((entry) => entry !== id);
}
export function invalidateWriting(
  progress: Progress,
  id: string,
  level: Level,
): void {
  progress.writing = progress.writing.filter(
    (entry) => entry !== writingKey(id, level),
  );
}
