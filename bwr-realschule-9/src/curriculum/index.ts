import data from "./lessons.json";
import type { Lesson } from "../model/types";
export { SOURCES, STAGES, CURRICULUM_URL, EDITORIAL_DATE } from "./sources";
export const LESSONS = data as Lesson[];
export const CORE_LESSONS = LESSONS.filter((l) => !l.optional);
export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);
