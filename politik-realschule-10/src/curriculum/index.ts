import cell from "../../cell.json";
import type { Lesson, Source, Stage } from "../types";
import lessons from "./lessons.json";
import outline from "./outline.json";

/** The cell is the sole source for the check and recall wording. */
export const LESSONS: Lesson[] = lessons.map((lesson) => {
	const atom = cell.atoms.find((a) => a.slug === lesson.id);
	if (!atom) throw new Error(`Missing cell atom: ${lesson.id}`);
	const [fast, recall] = atom.practice_items;
	const check = fast.fast_check;
	if (!check || !recall) throw new Error(`Missing practice item: ${lesson.id}`);
	const wrong = check.options.find((option) => option !== fast.concept);
	if (!wrong) throw new Error(`Missing distractor: ${lesson.id}`);
	return {
		...lesson,
		takeaway: recall.concept,
		quiz: {
			question: fast.question,
			answer: fast.concept,
			wrong: [wrong, lesson.quiz.extraWrong],
			explanation: lesson.quiz.explanation,
		},
	} as Lesson;
});
export const STAGES = outline.stages as Stage[];
export const SOURCES = outline.sources as Source[];
export const findLesson = (id: string): Lesson | undefined =>
	LESSONS.find((lesson) => lesson.id === id);
