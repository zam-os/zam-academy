import { CORE_LESSONS, findLesson, LESSONS } from "../curriculum";
export const STORAGE_KEY = "bwr_rs9_academy_progress_v1";
export interface PracticeNote {
  question: string;
  source: string;
  observation: string;
  conclusion: string;
  performed: boolean;
}
export interface Progress {
  active: string;
  level: 1 | 2;
  extra: boolean;
  quiz: string[];
  workshop: string[];
  assessed: string[];
  drafts: Record<string, string>;
  solved: Record<string, number>;
  serial: Record<string, number>;
  note: PracticeNote;
}
export const keyOf = (id: string, level: 1 | 2) => `${id}:${level}`;
export const freshProgress = (): Progress => ({
  active: LESSONS[0].id,
  level: 1,
  extra: false,
  quiz: [],
  workshop: [],
  assessed: [],
  drafts: {},
  solved: {},
  serial: {},
  note: { question: "", source: "", observation: "", conclusion: "", performed: false },
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
    const note = object(x.note);
    return {
      ...base,
      active: typeof x.active === "string" && ids.has(x.active) ? x.active : base.active,
      extra: x.extra === true,
      level: x.level === 2 ? 2 : 1,
      quiz: list(x.quiz, ids),
      workshop: list(x.workshop, ids),
      assessed: list(x.assessed, keys).filter((k) => (drafts[k]?.trim().length ?? 0) >= 20),
      drafts,
      solved: counts(x.solved, 3),
      serial: counts(x.serial, 1_000_000),
      note: {
        question: typeof note.question === "string" ? note.question.slice(0, 4000) : "",
        source: typeof note.source === "string" ? note.source.slice(0, 4000) : "",
        observation: typeof note.observation === "string" ? note.observation.slice(0, 4000) : "",
        conclusion: typeof note.conclusion === "string" ? note.conclusion.slice(0, 4000) : "",
        performed: note.performed === true,
      },
    };
  } catch {
    return base;
  }
}
export function isComplete(p: Progress, id: string) {
  const lesson = findLesson(id),
    key = keyOf(id, 1);
  return (
    !!lesson &&
    p.quiz.includes(id) &&
    p.workshop.includes(id) &&
    p.assessed.includes(key) &&
    (p.drafts[key]?.trim().length ?? 0) >= 20 &&
    (!lesson.practice || (p.solved[key] ?? 0) >= 3)
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
/** Documentation and performance are self-reported; this does not verify an external activity. */
export const noteDocumented = (note: PracticeNote) =>
  note.performed &&
  [note.question, note.source, note.observation, note.conclusion].every(
    (x) => x.trim().length >= 20,
  );
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
