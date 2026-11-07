import cell from "../../cell.json";
import type { Lesson, Source, Stage } from "../types";
import data from "./lessons.json";
import outline from "./outline.json";

// The quick check reads its question and answer from the one authored card
// source. Lesson materials hold only teaching feedback and wrong choices.
export const LESSONS: Lesson[] = data.map((entry) => {
	const atom = cell.atoms.find((candidate) => candidate.slug === entry.id);
	if (!atom) throw new Error(`Missing cell atom for lesson ${entry.id}`);
	const item = atom.practice_items[0];
	return {
		...entry,
		quiz: { ...entry.quiz, question: item.question, answer: item.concept },
	} as Lesson;
});
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const STAGES = outline.stages as Stage[];
export const SOURCES = outline.sources as Source[];
/** Number of review questions in the cell, shown in the ZAM dialog. */
export const CARD_COUNT = cell.atoms.reduce(
	(sum, atom) => sum + atom.practice_items.length,
	0,
);
export const findLesson = (id: string): Lesson | undefined =>
	LESSONS.find((lesson) => lesson.id === id);
