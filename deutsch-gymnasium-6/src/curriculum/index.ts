import cell from "../../cell.json";
import type { Lesson, Source, Stage } from "../types";
import sprechen from "./lessons-sprechen.json";
import lesen from "./lessons-lesen.json";
import schreiben from "./lessons-schreiben.json";
import sprache from "./lessons-sprache.json";
import outline from "./outline.json";

// A lesson reuses its tier-1 cell item for the quick check. Card questions
// and answers live only in cell.json; the lesson adds feedback and one
// additional workshop option, not a second card list.
export const LESSONS: Lesson[] = [...sprechen, ...lesen, ...schreiben, ...sprache].map(({ check, ...lesson }) => {
	const atom = cell.atoms.find((candidate) => candidate.slug === lesson.id);
	const item = atom?.practice_items.find(
		(candidate) => candidate.tier === "tier1_fast",
	);
	const fast = item?.fast_check;
	if (!item || !fast || fast.options.length !== 2 || fast.correct_index !== 0)
		throw new Error(`Missing valid quick check for ${lesson.id}`);
	return {
		...lesson,
		visual: lesson.visual as Lesson["visual"],
		tasks: lesson.tasks as Lesson["tasks"],
		quiz: {
			question: item.question,
			answer: item.concept,
			wrong: [fast.options[1], check.wrong],
			explanation: check.explanation,
		},
	};
});
export const STAGES = outline.stages as Stage[];
export const SOURCES = outline.sources as Source[];
export const findLesson = (id: string): Lesson | undefined =>
	LESSONS.find((lesson) => lesson.id === id);
