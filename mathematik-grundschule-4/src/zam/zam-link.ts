import { COURSE_LINKS } from "../course/catalog";
import { LESSON_ID } from "../practice/tasks";

export const CELL_ID = "zam-academy:mathematik-grundschule-4";
export const SOURCE_LINK = `https://academy.zam-os.org/mathematik-grundschule-4/#lesson=${LESSON_ID}`;

export function validLessonHash(hash: string): boolean {
	const id = new URLSearchParams(hash.replace(/^#/, "")).get("lesson");
	return COURSE_LINKS.some((lesson) => lesson.id === id);
}
export function lessonIdFromHash(hash: string): string {
	const id = new URLSearchParams(hash.replace(/^#/, "")).get("lesson");
	return COURSE_LINKS.find((lesson) => lesson.id === id)?.id ?? LESSON_ID;
}
