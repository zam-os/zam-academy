import type { Lesson, Stage } from "../model/types";
import { stageMeta } from "./builders";
import { makeStage } from "./make";
import { STAGE_1_LESSONS } from "./stage-1-terme";
import { STAGE_2_LESSONS } from "./stage-2-symmetrie";
import { STAGE_3_LESSONS } from "./stage-3-gleichungen";
import { STAGE_4_LESSONS } from "./stage-4-daten";
import { STAGE_5_LESSONS } from "./stage-5-kongruenz";

export const STAGES: Stage[] = [
  makeStage(1, stageMeta[1], STAGE_1_LESSONS),
  makeStage(2, stageMeta[2], STAGE_2_LESSONS),
  makeStage(3, stageMeta[3], STAGE_3_LESSONS),
  makeStage(4, stageMeta[4], STAGE_4_LESSONS),
  makeStage(5, stageMeta[5], STAGE_5_LESSONS),
];

export const ALL_LESSONS: Lesson[] = STAGES.flatMap((stage) => stage.lessons);

export function findLessonById(
  id: string,
): { stage: Stage; lesson: Lesson } | undefined {
  for (const stage of STAGES) {
    const lesson = stage.lessons.find((entry) => entry.id === id);
    if (lesson) return { stage, lesson };
  }
  return undefined;
}

export function findStageById(id: string): Stage | undefined {
  return STAGES.find((stage) => stage.id === id);
}

export function nextLesson(lessonId: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((entry) => entry.id === lessonId);
  return index >= 0 && index + 1 < ALL_LESSONS.length
    ? ALL_LESSONS[index + 1]
    : undefined;
}

export function previousLesson(lessonId: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((entry) => entry.id === lessonId);
  return index > 0 ? ALL_LESSONS[index - 1] : undefined;
}
