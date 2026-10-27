import type { DifficultyLevel, Lesson, Stage } from "../model/types";

const STORAGE_KEY = "informatik_rs8_academy_progress_v1";

export interface LearnerProgress {
  activeLessonId: string;
  difficultyLevel: DifficultyLevel;
  /** Lessons whose quick check was answered correctly. */
  quizDone: string[];
  /** Lab goal ids reached, per lesson. */
  labGoals: Record<string, string[]>;
  /** Correctly solved exercises per lesson and level. */
  solved: Record<string, { 1: number; 2: number }>;
  /** Attempt counters that seed the next generated task, per lesson. */
  attempts: Record<string, number>;
  celebratedStageIds: string[];
  /** Lessons whose completion was already announced. */
  celebratedLessonIds: string[];
}

export const DEFAULT_LESSON_ID = "it8-zehnfingersystem";

function defaults(): LearnerProgress {
  return {
    activeLessonId: DEFAULT_LESSON_ID,
    difficultyLevel: 1,
    quizDone: [],
    labGoals: {},
    solved: {},
    attempts: {},
    celebratedStageIds: [],
    celebratedLessonIds: [],
  };
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v) => typeof v === "string");

const count = (value: unknown): number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0 ? value : 0;

const uniqueStrings = (a: readonly string[], b: readonly string[]): string[] =>
  Array.from(new Set([...a, ...b]));

function parseLearnerProgress(raw: string | null): LearnerProgress | null {
  if (!raw) return null;
  const base = defaults();
  try {
    const parsed = JSON.parse(raw) as Partial<LearnerProgress>;
    const labGoals: Record<string, string[]> = {};
    if (parsed.labGoals && typeof parsed.labGoals === "object") {
      for (const [key, value] of Object.entries(parsed.labGoals)) {
        if (isStringArray(value)) labGoals[key] = value;
      }
    }
    const solved: Record<string, { 1: number; 2: number }> = {};
    if (parsed.solved && typeof parsed.solved === "object") {
      for (const [key, value] of Object.entries(parsed.solved)) {
        const entry = value as { 1?: unknown; 2?: unknown };
        solved[key] = {
          1: count(entry?.[1]),
          2: count(entry?.[2]),
        };
      }
    }
    const attempts: Record<string, number> = {};
    if (parsed.attempts && typeof parsed.attempts === "object") {
      for (const [key, value] of Object.entries(parsed.attempts)) {
        attempts[key] = count(value);
      }
    }
    return {
      activeLessonId:
        typeof parsed.activeLessonId === "string" ? parsed.activeLessonId : base.activeLessonId,
      difficultyLevel: parsed.difficultyLevel === 2 ? 2 : 1,
      quizDone: isStringArray(parsed.quizDone) ? parsed.quizDone : [],
      labGoals,
      solved,
      attempts,
      celebratedStageIds: isStringArray(parsed.celebratedStageIds) ? parsed.celebratedStageIds : [],
      celebratedLessonIds: isStringArray(parsed.celebratedLessonIds)
        ? parsed.celebratedLessonIds
        : [],
    };
  } catch {
    return null;
  }
}

export function mergeLearnerProgress(
  stored: LearnerProgress,
  incoming: LearnerProgress,
): LearnerProgress {
  const labGoals: Record<string, string[]> = {};
  for (const key of uniqueStrings(Object.keys(stored.labGoals), Object.keys(incoming.labGoals))) {
    labGoals[key] = uniqueStrings(stored.labGoals[key] ?? [], incoming.labGoals[key] ?? []);
  }
  const solved: Record<string, { 1: number; 2: number }> = {};
  for (const key of uniqueStrings(Object.keys(stored.solved), Object.keys(incoming.solved))) {
    solved[key] = {
      1: Math.max(stored.solved[key]?.[1] ?? 0, incoming.solved[key]?.[1] ?? 0),
      2: Math.max(stored.solved[key]?.[2] ?? 0, incoming.solved[key]?.[2] ?? 0),
    };
  }
  const attempts: Record<string, number> = {};
  for (const key of uniqueStrings(Object.keys(stored.attempts), Object.keys(incoming.attempts))) {
    attempts[key] = Math.max(stored.attempts[key] ?? 0, incoming.attempts[key] ?? 0);
  }
  return {
    activeLessonId: incoming.activeLessonId,
    difficultyLevel: incoming.difficultyLevel,
    quizDone: uniqueStrings(stored.quizDone, incoming.quizDone),
    labGoals,
    solved,
    attempts,
    celebratedStageIds: uniqueStrings(stored.celebratedStageIds, incoming.celebratedStageIds),
    celebratedLessonIds: uniqueStrings(stored.celebratedLessonIds, incoming.celebratedLessonIds),
  };
}

export function loadLearnerProgress(): LearnerProgress {
  try {
    return parseLearnerProgress(localStorage.getItem(STORAGE_KEY)) ?? defaults();
  } catch {
    return defaults();
  }
}

export function saveLearnerProgress(progress: LearnerProgress): LearnerProgress {
  try {
    const stored = parseLearnerProgress(localStorage.getItem(STORAGE_KEY));
    const next = stored ? mergeLearnerProgress(stored, progress) : progress;
    Object.assign(progress, next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    // Storage may be full or blocked; the app keeps working in memory.
    return progress;
  }
}

export function resetLearnerProgress(): LearnerProgress {
  const fresh = defaults();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  } catch {
    // Storage may be full or blocked; the app keeps working in memory.
  }
  return fresh;
}

export function solvedCount(
  progress: LearnerProgress,
  lessonId: string,
  level: DifficultyLevel,
): number {
  return progress.solved[lessonId]?.[level] ?? 0;
}

export function goalsReached(progress: LearnerProgress, lessonId: string): string[] {
  return progress.labGoals[lessonId] ?? [];
}

export function isQuizDone(progress: LearnerProgress, lessonId: string): boolean {
  return progress.quizDone.includes(lessonId);
}

export function allGoalsReached(progress: LearnerProgress, lesson: Lesson): boolean {
  const reached = goalsReached(progress, lesson.id);
  return lesson.lab.goals.every((goal) => reached.includes(goal.id));
}

/** Quick check right, every lab goal reached and enough Level-1 tasks solved. */
export function isLessonComplete(progress: LearnerProgress, lesson: Lesson): boolean {
  return (
    isQuizDone(progress, lesson.id) &&
    allGoalsReached(progress, lesson) &&
    solvedCount(progress, lesson.id, 1) >= lesson.requiredCorrect
  );
}

/** Enough Level-2 transfer tasks solved on top of a complete lesson. */
export function isTransferDone(progress: LearnerProgress, lesson: Lesson): boolean {
  return (
    isLessonComplete(progress, lesson) &&
    solvedCount(progress, lesson.id, 2) >= lesson.requiredCorrect
  );
}

export interface CompletionStats {
  completed: number;
  total: number;
  percent: number;
}

/** Progress in a stage. */
export function stageStats(progress: LearnerProgress, stage: Stage): CompletionStats {
  const total = stage.lessons.length;
  const completed = stage.lessons.filter((lesson) => isLessonComplete(progress, lesson)).length;
  return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
}

/** A stage is done when every lesson in it is complete, and there is at least one. */
export function isStageComplete(progress: LearnerProgress, stage: Stage): boolean {
  return stage.lessons.length > 0 && stage.lessons.every((lesson) => isLessonComplete(progress, lesson));
}

export function overallStats(
  progress: LearnerProgress,
  stages: Stage[],
): CompletionStats & { completedStages: number; totalStages: number } {
  const lessons = stages.flatMap((stage) => stage.lessons);
  const completed = lessons.filter((lesson) => isLessonComplete(progress, lesson)).length;
  const completedStages = stages.filter((stage) => isStageComplete(progress, stage)).length;
  return {
    completed,
    total: lessons.length,
    percent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
    completedStages,
    totalStages: stages.length,
  };
}
