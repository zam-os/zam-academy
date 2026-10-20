import type { Lesson, ModuleFilter, Stage } from "../model/types";
import { isRelevant } from "../storage/progress";
import { STAGE_TABELLEN } from "./stage-1-tabellen";
import { STAGE_ABFRAGEN } from "./stage-2-abfragen";
import { STAGE_BEZIEHUNGEN } from "./stage-3-beziehungen";
import { STAGE_BERICHTE } from "./stage-4-berichte";

/**
 * Four stages: tables and keys, queries, several tables, reports and data
 * maintenance. Stages 1–2 follow module 2.3.1 "Datenbanksysteme I" of
 * LehrplanPLUS IT (Realschule Bayern), stage 3 and the data maintenance
 * lesson module 2.3.2 "Datenbanksysteme II"; GROUP BY and LEFT JOIN are the
 * extra every developer needs.
 */
export const STAGES: Stage[] = [STAGE_TABELLEN, STAGE_ABFRAGEN, STAGE_BEZIEHUNGEN, STAGE_BERICHTE];

export const ALL_LESSONS: Lesson[] = STAGES.flatMap((stage) => stage.lessons);

export function findLessonById(id: string): { stage: Stage; lesson: Lesson } | undefined {
  for (const stage of STAGES) {
    const lesson = stage.lessons.find((l) => l.id === id);
    if (lesson) return { stage, lesson };
  }
  return undefined;
}

export function findStageById(id: string): Stage | undefined {
  return STAGES.find((stage) => stage.id === id);
}

/** Lessons inside the learner's chosen scope; "alle" keeps every lesson. */
export function lessonsForFilter(filter: ModuleFilter): Lesson[] {
  return ALL_LESSONS.filter((lesson) => isRelevant(lesson, filter));
}

export function nextLesson(id: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === id);
  return index >= 0 ? ALL_LESSONS[index + 1] : undefined;
}

export function previousLesson(id: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === id);
  return index > 0 ? ALL_LESSONS[index - 1] : undefined;
}
