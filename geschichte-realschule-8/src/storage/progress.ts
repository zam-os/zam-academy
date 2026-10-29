import { CORE_LESSONS, LESSONS } from "../curriculum";
import type { Level } from "../model/types";
import { canReviewDraft } from "../workshop";

export const STORAGE_KEY = "geschichte_rs8_academy_progress_v1";
export interface Progress {
  activeLessonId: string;
  level: Level;
  includeEnglish: boolean;
  quizDone: string[];
  workshopDone: string[];
  writingDone: string[];
  drafts: Record<string, string>;
}

export const writingKey = (id: string, level: Level): string =>
  `${id}:${level}`;
const lessonIds = new Set(LESSONS.map((lesson) => lesson.id));
const writingKeys = new Set(
  LESSONS.flatMap((lesson) => [
    writingKey(lesson.id, 1),
    writingKey(lesson.id, 2),
  ]),
);
const strings = (value: unknown, allowed: Set<string>): string[] =>
  Array.isArray(value)
    ? [
        ...new Set(
          value.filter(
            (entry): entry is string =>
              typeof entry === "string" && allowed.has(entry),
          ),
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
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      return base;
    const value = parsed as Record<string, unknown>;
    const drafts: Record<string, string> = {};
    if (
      value.drafts &&
      typeof value.drafts === "object" &&
      !Array.isArray(value.drafts)
    ) {
      for (const [key, draft] of Object.entries(value.drafts)) {
        if (writingKeys.has(key) && typeof draft === "string")
          drafts[key] = draft.slice(0, 8000);
      }
    }
    const writingDone = strings(value.writingDone, writingKeys).filter(
      (key) => (drafts[key]?.trim().length ?? 0) >= 20,
    );
    return {
      activeLessonId:
        typeof value.activeLessonId === "string" &&
        lessonIds.has(value.activeLessonId)
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

// Each loaded object represents one tab. Only explicit actions are merged;
// action revisions keep queued saves from consuming edits made after them.
const initialized = new WeakSet<Progress>();
interface PendingChanges {
  quiz: Map<string, number>;
  workshop: Map<string, number>;
  drafts: Map<string, number>;
  writing: Map<string, number>;
}
const kinds = ["quiz", "workshop", "drafts", "writing"] as const;
let revision = 0;
const pending = new WeakMap<Progress, PendingChanges>();
const emptyChanges = (): PendingChanges => ({
  quiz: new Map(),
  workshop: new Map(),
  drafts: new Map(),
  writing: new Map(),
});
function changesFor(progress: Progress): PendingChanges {
  let changes = pending.get(progress);
  if (!changes) {
    changes = emptyChanges();
    pending.set(progress, changes);
  }
  return changes;
}
function mark(
  progress: Progress,
  kind: keyof PendingChanges,
  key: string,
): void {
  changesFor(progress)[kind].set(key, ++revision);
}
const copyProgress = (value: Progress): Progress =>
  parseProgress(JSON.stringify(value));
function mergeProgress(
  local: Progress,
  latest: Progress,
  changes: PendingChanges,
): Progress {
  const merged = copyProgress(latest);
  // The visible task level belongs to this tab. Adopting another tab's
  // selection would route the current textarea into the wrong level.
  merged.level = local.level;
  merged.activeLessonId = local.activeLessonId;
  merged.includeEnglish = local.includeEnglish;
  for (const id of changes.quiz.keys()) {
    merged.quizDone = merged.quizDone.filter((value) => value !== id);
    if (local.quizDone.includes(id)) merged.quizDone.push(id);
  }
  for (const id of changes.workshop.keys()) {
    merged.workshopDone = merged.workshopDone.filter((value) => value !== id);
    if (local.workshopDone.includes(id)) merged.workshopDone.push(id);
  }
  const keys = new Set([...changes.drafts.keys(), ...changes.writing.keys()]);
  for (const key of keys) {
    const draftChanged = changes.drafts.has(key);
    const text = draftChanged ? local.drafts[key] : latest.drafts[key];
    if (text !== undefined) merged.drafts[key] = text;
    else delete merged.drafts[key];
    // A confirmation belongs to the exact text that was compared. Never
    // attach a stale tab's confirmation to another tab's changed draft.
    const confirmed =
      draftChanged || latest.drafts[key] === local.drafts[key]
        ? local.writingDone.includes(key)
        : latest.writingDone.includes(key);
    merged.writingDone = merged.writingDone.filter((value) => value !== key);
    if (confirmed && canReviewDraft(text ?? "")) merged.writingDone.push(key);
  }
  return copyProgress(merged);
}
export function loadProgress(): Progress {
  let progress: Progress;
  try {
    progress = parseProgress(localStorage.getItem(STORAGE_KEY));
  } catch {
    progress = freshProgress();
  }
  initialized.add(progress);
  return progress;
}
function writeProgress(
  progress: Progress,
  snapshot: Progress,
  submitted: PendingChanges,
): boolean {
  try {
    const current = changesFor(progress);
    const effective = emptyChanges();
    for (const kind of kinds)
      for (const [key, rev] of submitted[kind])
        if (current[kind].get(key) === rev) effective[kind].set(key, rev);
    // A fresh object is the explicit reset path. Reset it only once, even
    // if more than one save was queued before the first write succeeded.
    const merged = initialized.has(progress)
      ? mergeProgress(
          snapshot,
          parseProgress(localStorage.getItem(STORAGE_KEY)),
          effective,
        )
      : copyProgress(snapshot);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    for (const kind of kinds)
      for (const [key, rev] of effective[kind])
        if (current[kind].get(key) === rev) current[kind].delete(key);
    // Adopt remote work while retaining newer local actions that were not
    // part of this immutable save request (or superseded its actions).
    Object.assign(progress, mergeProgress(progress, merged, current));
    initialized.add(progress);
    return true;
  } catch {
    return false;
  }
}
/** Coordinate the entire read/merge/write across tabs when Web Locks exists. */
export async function saveProgress(progress: Progress): Promise<boolean> {
  const snapshot = copyProgress(progress);
  const submitted = emptyChanges();
  const current = changesFor(progress);
  for (const kind of kinds) submitted[kind] = new Map(current[kind]);
  const write = () => writeProgress(progress, snapshot, submitted);
  try {
    const locks =
      typeof navigator === "undefined" ? undefined : navigator.locks;
    if (!locks) return write();
    return await locks.request(STORAGE_KEY, write);
  } catch (error) {
    // Some offline/opaque origins expose the API but cannot obtain a lock.
    // Keep the working merge fallback; other lock failures remain visible.
    if (
      error instanceof DOMException &&
      (error.name === "SecurityError" || error.name === "NotSupportedError")
    )
      return write();
    return false;
  }
}
/** Record submissions even when their values equal this tab's old snapshot. */
export function recordQuizAnswer(
  progress: Progress,
  id: string,
  correct: boolean,
): void {
  mark(progress, "quiz", id);
  progress.quizDone = progress.quizDone.filter((value) => value !== id);
  if (correct) progress.quizDone.push(id);
}
export function recordWorkshopAnswer(
  progress: Progress,
  id: string,
  correct: boolean,
): void {
  mark(progress, "workshop", id);
  progress.workshopDone = progress.workshopDone.filter((value) => value !== id);
  if (correct) progress.workshopDone.push(id);
}
export function invalidateWriting(
  progress: Progress,
  id: string,
  level: Level,
): void {
  const key = writingKey(id, level);
  mark(progress, "writing", key);
  progress.writingDone = progress.writingDone.filter((value) => value !== key);
}
export function confirmWriting(
  progress: Progress,
  id: string,
  level: Level,
  comparedText: string,
): boolean {
  const key = writingKey(id, level);
  if (progress.drafts[key] !== comparedText || !canReviewDraft(comparedText))
    return false;
  mark(progress, "writing", key);
  if (!progress.writingDone.includes(key)) progress.writingDone.push(key);
  return true;
}
export function updateDraft(
  progress: Progress,
  id: string,
  level: Level,
  text: string,
): void {
  const key = writingKey(id, level);
  const bounded = text.slice(0, 8000);
  if (bounded === progress.drafts[key]) return;
  mark(progress, "drafts", key);
  mark(progress, "writing", key);
  progress.drafts[key] = bounded;
  progress.writingDone = progress.writingDone.filter((k) => k !== key);
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
  const completed = lessons.filter((lesson) =>
    isComplete(progress, lesson.id),
  ).length;
  return {
    completed,
    total: lessons.length,
    percent: Math.round((100 * completed) / lessons.length),
  };
}
