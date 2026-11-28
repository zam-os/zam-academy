import { findLesson, LESSONS, lessonsFor } from "../curriculum";
import type { Track } from "../model/types";

export const STORAGE_KEY = "wib_ms8_academy_progress_v1";

export interface Progress {
  active: string;
  track: Track;
  level: 1 | 2;
  quiz: string[];
  workshop: string[];
  assessed: string[];
  drafts: Record<string, string>;
  solved: Record<string, number>;
  serial: Record<string, number>;
  /** Lessons whose lab goal was reached; shown, but not required for completion. */
  labs: string[];
}

export const keyOf = (id: string, level: 1 | 2) => `${id}:${level}`;

export const freshProgress = (): Progress => ({
  active: LESSONS[0].id,
  track: "R",
  level: 1,
  quiz: [],
  workshop: [],
  assessed: [],
  drafts: {},
  solved: {},
  serial: {},
  labs: [],
});

export function parseProgress(raw: string | null): Progress {
  const base = freshProgress();
  try {
    const parsed: unknown = JSON.parse(raw ?? "null");
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return base;
    const x = parsed as Record<string, unknown>;
    const object = (v: unknown): Record<string, unknown> =>
      v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
    const ids = new Set(LESSONS.map((l) => l.id));
    const keys = new Set(LESSONS.flatMap((l) => [keyOf(l.id, 1), keyOf(l.id, 2)]));
    const list = (v: unknown, allowed: Set<string>): string[] =>
      Array.isArray(v)
        ? [...new Set(v.filter((s): s is string => typeof s === "string" && allowed.has(s)))]
        : [];
    const drafts: Record<string, string> = {};
    for (const [key, value] of Object.entries(object(x.drafts)))
      if (keys.has(key) && typeof value === "string") drafts[key] = value.slice(0, 8000);
    const counts = (v: unknown, max: number) => {
      const out: Record<string, number> = {};
      for (const [k, n] of Object.entries(object(v)))
        if (keys.has(k) && typeof n === "number" && Number.isInteger(n) && n >= 0)
          out[k] = Math.min(max, n);
      return out;
    };
    return {
      ...base,
      active: typeof x.active === "string" && ids.has(x.active) ? x.active : base.active,
      track: x.track === "M" ? "M" : "R",
      level: x.level === 2 ? 2 : 1,
      quiz: list(x.quiz, ids),
      workshop: list(x.workshop, ids),
      assessed: list(x.assessed, keys).filter((k) => (drafts[k]?.trim().length ?? 0) >= 20),
      drafts,
      solved: counts(x.solved, 3),
      serial: counts(x.serial, 1_000_000),
      labs: list(x.labs, ids),
    };
  } catch {
    return base;
  }
}

export interface LoadResult {
  progress: Progress;
  persistent: boolean;
}

export function loadProgress(): LoadResult {
  try {
    return { progress: parseProgress(localStorage.getItem(STORAGE_KEY)), persistent: true };
  } catch {
    return { progress: freshProgress(), persistent: false };
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

export function resetProgress(track: Track = "R"): Progress {
  const base = { ...freshProgress(), track };
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Private browsing or blocked storage can still reset in-memory state.
  }
  return base;
}

export function isComplete(p: Progress, id: string): boolean {
  const lesson = findLesson(id);
  const key = keyOf(id, 1);
  if (!lesson || !p.quiz.includes(id) || !p.workshop.includes(id) || !p.assessed.includes(key))
    return false;
  return !lesson.practice || (p.solved[key] ?? 0) >= 3;
}

export function completion(p: Progress) {
  const visible = lessonsFor(p.track);
  return {
    done: visible.filter((l) => isComplete(p, l.id)).length,
    total: visible.length,
  };
}
