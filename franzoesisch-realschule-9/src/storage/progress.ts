import { CORE_LESSONS, findLesson, LESSONS } from "../curriculum";
import { REQUIRED_ROUNDS } from "../exercises/practice";
import { looksLikeDraft } from "../format";
import { keyOf } from "./keys";

export { keyOf };

export const STORAGE_KEY = "franzoesisch_rs9_academy_progress_v1";

export interface Progress {
  active: string;
  level: 1 | 2;
  quiz: string[];
  workshop: string[];
  casework: string[];
  assessed: string[];
  drafts: Record<string, string>;
  /** Practice rounds solved per `<lesson id>:<level>`. */
  solved: Record<string, number>;
  serial: Record<string, number>;
}

export const freshProgress = (): Progress => ({
  active: LESSONS[0].id,
  level: 1,
  quiz: [],
  workshop: [],
  casework: [],
  assessed: [],
  drafts: {},
  solved: {},
  serial: {},
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
      level: x.level === 2 ? 2 : 1,
      quiz: list(x.quiz, ids),
      workshop: list(x.workshop, ids),
      casework: list(x.casework, ids),
      assessed: list(x.assessed, keys).filter((k) => looksLikeDraft(drafts[k] ?? "")),
      drafts,
      solved: counts(x.solved, 3),
      serial: counts(x.serial, 1_000_000),
    };
  } catch {
    return base;
  }
}

/** A lesson is complete when every part is done; practice rounds are counted on Niveau 1. */
export function isComplete(p: Progress, id: string) {
  const lesson = findLesson(id),
    key = keyOf(id, 1);
  return (
    !!lesson &&
    p.quiz.includes(id) &&
    p.workshop.includes(id) &&
    p.casework.includes(id) &&
    p.assessed.includes(key) &&
    looksLikeDraft(p.drafts[key] ?? "") &&
    (!lesson.practice || (p.solved[key] ?? 0) >= REQUIRED_ROUNDS)
  );
}

export function completion(p: Progress) {
  const done = CORE_LESSONS.filter((l) => isComplete(p, l.id)).length;
  return {
    done,
    total: CORE_LESSONS.length,
    percent: Math.round((done / CORE_LESSONS.length) * 100),
  };
}

/**
 * Joins what another tab saved with what this tab holds, so two open tabs do
 * not wipe each other's progress (a ZAM card opens its lesson in a new tab).
 * Finished parts only grow, so they are joined; the counters take the larger
 * value; the lesson and level of this tab stand. A text is the one that was
 * saved, unless this tab changed it since it loaded (`dirty`): only a real
 * input of this tab may replace a text another tab saved. A rating stays
 * only with the very text it was given for.
 */
export function mergeProgress(stored: Progress, own: Progress, dirty: ReadonlySet<string> = new Set()): Progress {
  const join = (a: string[], b: string[]) => [...new Set([...a, ...b])];
  const largest = (a: Record<string, number>, b: Record<string, number>) => {
    const out = { ...a };
    for (const [k, n] of Object.entries(b)) out[k] = Math.max(out[k] ?? 0, n);
    return out;
  };
  const drafts: Record<string, string> = {};
  for (const key of new Set([...Object.keys(stored.drafts), ...Object.keys(own.drafts)]))
    drafts[key] = dirty.has(key) ? (own.drafts[key] ?? "") : (stored.drafts[key] ?? own.drafts[key] ?? "");
  return {
    ...own,
    quiz: join(own.quiz, stored.quiz),
    workshop: join(own.workshop, stored.workshop),
    casework: join(own.casework, stored.casework),
    assessed: join(
      own.assessed.filter((k) => drafts[k] === own.drafts[k]),
      stored.assessed.filter((k) => drafts[k] === stored.drafts[k]),
    ),
    drafts,
    solved: largest(own.solved, stored.solved),
    serial: largest(own.serial, stored.serial),
  };
}

export function loadProgress(): { progress: Progress; persistent: boolean } {
  try {
    return { progress: parseProgress(localStorage.getItem(STORAGE_KEY)), persistent: true };
  } catch {
    return { progress: freshProgress(), persistent: false };
  }
}

export function saveProgress(progress: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    return true;
  } catch {
    return false;
  }
}
