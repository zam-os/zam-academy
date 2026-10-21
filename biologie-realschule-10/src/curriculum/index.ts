import type { Lesson } from "../model/types";
import data from "./lessons.json";

export { CURRICULUM_URL, SOURCES, STAGES } from "./sources";
// The content contract is validated for every lesson by the curriculum tests.
export const LESSONS = data as Lesson[];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
