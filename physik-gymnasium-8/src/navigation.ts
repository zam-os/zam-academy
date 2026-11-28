import { findLesson, lessonsFor } from "./curriculum";
import { isComplete, type Progress } from "./storage/progress";

/** A card opens its lesson without changing the learner's chosen curriculum. */
export function visitLesson(progress: Progress, id: string) {
  const lesson = findLesson(id);
  if (lesson) progress.activeLessonId = lesson.id;
  return lesson;
}

export function pathLesson(progress: Progress) {
  const lessons = lessonsFor(progress.track, progress.includeExtra);
  return (
    lessons.find((lesson) => lesson.id === progress.activeLessonId) ??
    lessons.find((lesson) => !isComplete(progress, lesson.id)) ??
    lessons[0]
  );
}
