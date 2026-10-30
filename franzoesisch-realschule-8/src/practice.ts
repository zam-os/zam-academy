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

export const normalise = (value: string): string =>
	value
		.normalize("NFKC")
		.replace(/[’‘]/g, "'")
		.trim()
		.toLocaleLowerCase("fr")
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

export const canReview = (text: string): boolean => text.trim().length >= 20;
export const canAccept = (text: string, checks: boolean[]): boolean =>
	canReview(text) && checks.length === 3 && checks.every(Boolean);
