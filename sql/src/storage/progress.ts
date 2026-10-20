import {
  type AppLocale,
  type DifficultyLevel,
  FILTER_RANK,
  type Lesson,
  MODULE_RANK,
  type ModuleFilter,
  type Stage,
} from "../model/types";

const STORAGE_KEY = "zam_academy_sql_progress_v1";

export interface LearnerProgress {
  locale: AppLocale;
  activeLessonId: string;
  difficultyLevel: DifficultyLevel;
  moduleFilter: ModuleFilter;
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

export const DEFAULT_LESSON_ID = "db-1-datenbanksystem";

function browserLocale(): AppLocale {
  try {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    return languages.some((lang) => lang?.toLowerCase().startsWith("de")) ? "de" : "en";
  } catch {
    return "de";
  }
}

function defaults(): LearnerProgress {
  return {
    locale: browserLocale(),
    activeLessonId: DEFAULT_LESSON_ID,
    difficultyLevel: 1,
    moduleFilter: "alle",
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

export function loadLearnerProgress(): LearnerProgress {
  const base = defaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
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
          1: typeof entry?.[1] === "number" ? entry[1] : 0,
          2: typeof entry?.[2] === "number" ? entry[2] : 0,
        };
      }
    }
    const attempts: Record<string, number> = {};
    if (parsed.attempts && typeof parsed.attempts === "object") {
      for (const [key, value] of Object.entries(parsed.attempts)) {
        if (typeof value === "number") attempts[key] = value;
      }
    }
    return {
      locale: parsed.locale === "en" || parsed.locale === "de" ? parsed.locale : base.locale,
      activeLessonId:
        typeof parsed.activeLessonId === "string" ? parsed.activeLessonId : base.activeLessonId,
      difficultyLevel: parsed.difficultyLevel === 2 ? 2 : 1,
      moduleFilter:
        parsed.moduleFilter === "2.3.1" || parsed.moduleFilter === "2.3.2" ? parsed.moduleFilter : "alle",
      quizDone: isStringArray(parsed.quizDone) ? parsed.quizDone : [],
      labGoals,
      solved,
      attempts,
      celebratedStageIds: isStringArray(parsed.celebratedStageIds) ? parsed.celebratedStageIds : [],
      celebratedLessonIds: isStringArray(parsed.celebratedLessonIds) ? parsed.celebratedLessonIds : [],
    };
  } catch {
    return base;
  }
}

export function saveLearnerProgress(progress: LearnerProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage may be full or blocked; the app keeps working in memory.
  }
}

/** Wipes learning progress but keeps language and level. */
export function resetLearnerProgress(current: LearnerProgress): LearnerProgress {
  const fresh = { ...defaults(), locale: current.locale, difficultyLevel: current.difficultyLevel, moduleFilter: current.moduleFilter };
  saveLearnerProgress(fresh);
  return fresh;
}

export function solvedCount(progress: LearnerProgress, lessonId: string, level: DifficultyLevel): number {
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
  return isLessonComplete(progress, lesson) && solvedCount(progress, lesson.id, 2) >= lesson.requiredCorrect;
}

export interface CompletionStats {
  completed: number;
  total: number;
  percent: number;
}

/** Whether a lesson belongs to what the learner chose to cover. */
export function isRelevant(lesson: Lesson, filter: ModuleFilter): boolean {
  return MODULE_RANK[lesson.module] <= FILTER_RANK[filter];
}

/** The lessons of a stage inside the chosen scope; "alle" keeps all. */
export function relevantLessons(stage: Stage, filter: ModuleFilter = "alle"): Lesson[] {
  return stage.lessons.filter((lesson) => isRelevant(lesson, filter));
}

/** Progress in a stage, counting only the lessons of the chosen scope. */
export function stageStats(progress: LearnerProgress, stage: Stage, filter: ModuleFilter = "alle"): CompletionStats {
  const lessons = relevantLessons(stage, filter);
  const total = lessons.length;
  const completed = lessons.filter((lesson) => isLessonComplete(progress, lesson)).length;
  return { completed, total, percent: total ? Math.round((completed / total) * 100) : 0 };
}

/** A stage is done when every lesson of the chosen scope in it is complete, and there is at least one. */
export function isStageComplete(progress: LearnerProgress, stage: Stage, filter: ModuleFilter = "alle"): boolean {
  const lessons = relevantLessons(stage, filter);
  return lessons.length > 0 && lessons.every((lesson) => isLessonComplete(progress, lesson));
}

export function overallStats(
  progress: LearnerProgress,
  stages: Stage[],
  filter: ModuleFilter = "alle",
): CompletionStats & { completedStages: number; totalStages: number } {
  const lessons = stages.flatMap((stage) => relevantLessons(stage, filter));
  const completed = lessons.filter((lesson) => isLessonComplete(progress, lesson)).length;
  const withLessons = stages.filter((stage) => relevantLessons(stage, filter).length > 0);
  const completedStages = withLessons.filter((stage) => isStageComplete(progress, stage, filter)).length;
  return {
    completed,
    total: lessons.length,
    percent: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
    completedStages,
    totalStages: withLessons.length,
  };
}
