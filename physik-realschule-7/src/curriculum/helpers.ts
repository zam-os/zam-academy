import type { Lesson, WrittenTask, Workshop } from "../model/types";
export const task = (
	prompt: string,
	model: string,
	criteria: [string, string, string],
	hints: [string, string],
): WrittenTask => ({ prompt, model, criteria, hints });
export function classify(
	title: string,
	categories: string[],
	entries: [string, number, string][],
	conclusion: string,
): Workshop {
	return {
		kind: "classify",
		title,
		instruction:
			"Ordne jeden Fall zu. Prüfe danach deine Begründung mit der Rückmeldung.",
		categories,
		entries: entries.map(([text, target, feedback]) => ({
			text,
			target,
			feedback,
		})),
		conclusion,
	};
}
export function sequence(
	title: string,
	entries: [string, string][],
	conclusion: string,
): Workshop {
	return {
		kind: "timeline",
		title,
		instruction:
			"Bringe die Schritte mit den Pfeiltasten in eine sinnvolle Reihenfolge.",
		categories: [],
		entries: entries.map(([text, feedback], target) => ({
			text,
			target,
			feedback,
		})),
		conclusion,
	};
}
export function lesson(
	lb: number,
	data: Omit<Lesson, "lb" | "period" | "tracks" | "sourceIds">,
): Lesson {
	return {
		...data,
		lb,
		period: `Ph7 LB ${lb} (I) · LehrplanPLUS Bayern`,
		tracks: ["I"],
		sourceIds: ["lp", "basics"],
	};
}
