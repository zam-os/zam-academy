import type { Lesson, Practice } from "./types";

export const esc = (value: string): string =>
	value.replace(
		/[&<>"']/g,
		(character) =>
			({
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#39;",
			})[character] ?? character,
	);

/**
 * Normalises Latin and German short answers: folds macrons (ā→a, ē→e, ī→i,
 * ō→o, ū→u) so learners can type plain ASCII Latin without penalty, keeps
 * German umlauts intact, collapses whitespace, and strips trailing sentence
 * punctuation.
 */
export const normalise = (value: string): string =>
	value
		.normalize("NFKC")
		.replace(/[’‘]/g, "'")
		.replace(/[āĀ]/g, "a")
		.replace(/[ēĒ]/g, "e")
		.replace(/[īĪ]/g, "i")
		.replace(/[ōŌ]/g, "o")
		.replace(/[ūŪ]/g, "u")
		.replace(/[ăĂ]/g, "a")
		.replace(/[ĕĔ]/g, "e")
		.replace(/[ĭĬ]/g, "i")
		.replace(/[ŏŎ]/g, "o")
		.replace(/[ŭŬ]/g, "u")
		.trim()
		.toLocaleLowerCase("de")
		.replace(/\s+/g, " ")
		.replace(/[.!?]+$/, "");

export function checkPractice(
	practice: Practice[],
	answers: string[],
): boolean[] {
	if (answers.length !== practice.length) return practice.map(() => false);
	return practice.map(
		(item, index) =>
			typeof answers[index] === "string" &&
			item.answers.some(
				(answer) => normalise(answer) === normalise(answers[index]),
			),
	);
}

/** Stable answer order with different correct positions across lessons. */
export function quizOptions(lesson: Lesson): string[] {
	const options = [lesson.quiz.answer, ...lesson.quiz.wrong];
	let seed = 2166136261;
	for (const character of lesson.id)
		seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
	const offset = seed % options.length;
	return [...options.slice(offset), ...options.slice(0, offset)];
}

/** Keep a wrong attempt useful without exposing the prepared solution. */
export function quizFeedback(lesson: Lesson, selected: string): string {
	return selected === lesson.quiz.answer
		? `Richtig. ${lesson.quiz.explanation}`
		: "Noch einmal überlegen. Prüfe die Frage und die passende Stelle im Material, im Schaubild oder in der Regel.";
}

/** A solved field may show its explanation; unfinished fields retain the task. */
export function practiceFeedback(item: Practice, correct: boolean): string {
	return correct
		? item.feedback
		: "Noch prüfen. Vergleiche deine Form mit der Regel, dem Schaubild und dem lateinischen Übungstext.";
}

export const canReview = (text: string): boolean => text.trim().length >= 20;
export const canAccept = (text: string, checks: boolean[]): boolean =>
	canReview(text) && checks.length === 3 && checks.every(Boolean);
