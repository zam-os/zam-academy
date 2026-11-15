import type { Track } from "../model/types";
import { MECHANICS } from "./mechanics";
import { OPTICS } from "./optics";
import { ELECTRICITY } from "./electricity";
export { CURRICULUM_URL, curriculumUrl, SOURCES, STAGES } from "./sources";
export const LESSONS = [...MECHANICS, ...OPTICS, ...ELECTRICITY];
export const CORE_LESSONS = LESSONS;
export const findLesson = (id: string) =>
	LESSONS.find((lesson) => lesson.id === id);
export const lessonsFor = (_track: Track, _extra = false) => LESSONS;
