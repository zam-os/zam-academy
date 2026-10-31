import { LESSON_ID } from "../practice/tasks";

export const CELL_ID = "zam-academy:mathematik-grundschule-4";
export const SOURCE_LINK = `https://academy.zam-os.org/mathematik-grundschule-4/#lesson=${LESSON_ID}`;

export function validLessonHash(hash: string): boolean {
	return (
		new URLSearchParams(hash.replace(/^#/, "")).get("lesson") === LESSON_ID
	);
}
