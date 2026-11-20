import { findLesson, LESSONS } from "./curriculum";
import { isComplete, type Progress } from "./storage/progress";

/** A card opens its lesson. */
export function visitLesson(progress: Progress, id: string) {
  const lesson = findLesson(id);
  if (lesson) progress.activeLessonId = lesson.id;
  return lesson;
}

export function pathLesson(progress: Progress) {
  return (
    LESSONS.find((lesson) => lesson.id === progress.activeLessonId) ??
    LESSONS.find((lesson) => !isComplete(progress, lesson.id)) ??
    LESSONS[0]
  );
}
