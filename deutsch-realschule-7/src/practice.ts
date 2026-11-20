import type { Case, Lesson } from "./types";

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
		.toLocaleLowerCase("de")
		.replace(/\s+/g, " ")
		.replace(/[.!?]+$/, "");

export function checkCases(cases: Case[], answers: string[]): boolean[] {
	return cases.map((item, index) => answers[index] === item.answer);
}

function rotateStable(options: string[], key: string): string[] {
	let seed = 2166136261;
	for (const character of key)
		seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
	const offset = seed % options.length;
	return [...options.slice(offset), ...options.slice(0, offset)];
}

/** Stable answer order with different correct positions across lessons. */
export function quizOptions(lesson: Lesson): string[] {
	return rotateStable([lesson.quiz.answer, ...lesson.quiz.wrong], lesson.id);
}

/** Stable option order varying the correct radio position across cases. */
export function caseOptions(lesson: Lesson, index: number): string[] {
	const item = lesson.cases[index];
	if (!item) return [];
	const normalized = [
		item.answer,
		...item.options.filter((option) => option !== item.answer),
	];
	return rotateStable(normalized, `${lesson.id}:${index}`);
}

export const canReview = (text: string): boolean => text.trim().length >= 20;
export const canAccept = (text: string, checks: boolean[]): boolean =>
	canReview(text) && checks.length === 3 && checks.every(Boolean);
