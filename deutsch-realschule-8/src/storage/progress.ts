import { findLesson, LESSONS } from "../curriculum";
import { canReview, checkCases } from "../practice";
import type { Level } from "../types";

export const STORAGE_KEY = "deutsch_rs8_progress_v1";
export const writingKey = (id: string, level: Level): string =>
	`${id}:${level}`;
export interface Progress {
	level: Level;
	quizDone: string[];
	cases: Record<string, string[]>;
	drafts: Record<string, string>;
	writingDone: string[];
}
export const freshProgress = (): Progress => ({
	level: 1,
	quizDone: [],
	cases: {},
	drafts: {},
	writingDone: [],
});
export function parseProgress(raw: string | null): Progress {
	const base = freshProgress();
	try {
		const data = JSON.parse(raw ?? "null");
		if (!data || typeof data !== "object" || Array.isArray(data)) return base;
		const ids = new Set(LESSONS.map((l) => l.id));
		const keys = new Set(
			LESSONS.flatMap((l) => [writingKey(l.id, 1), writingKey(l.id, 2)]),
		);
		const list = (value: unknown, allowed: Set<string>): string[] =>
			Array.isArray(value)
				? [
						...new Set(
							value.filter(
								(v): v is string => typeof v === "string" && allowed.has(v),
							),
						),
					]
				: [];
		const record = (value: unknown): Record<string, unknown> =>
			value && typeof value === "object" && !Array.isArray(value)
				? (value as Record<string, unknown>)
				: {};
		for (const [key, text] of Object.entries(record(data.drafts)))
			if (keys.has(key) && typeof text === "string")
				base.drafts[key] = text.slice(0, 8000);
		for (const [id, answers] of Object.entries(record(data.cases))) {
			const lesson = findLesson(id);
			if (lesson && Array.isArray(answers))
				base.cases[id] = lesson.cases.map((c, i) =>
					c.options.includes(answers[i]) ? answers[i] : "",
				);
		}
		base.level = data.level === 2 ? 2 : 1;
		base.quizDone = list(data.quizDone, ids);
		base.writingDone = list(data.writingDone, keys).filter((k) =>
			canReview(base.drafts[k] ?? ""),
		);
		return base;
	} catch {
		return base;
	}
}
export function loadProgress(): Progress {
	try {
		return parseProgress(localStorage.getItem(STORAGE_KEY));
	} catch {
		return freshProgress();
	}
}
export function saveProgress(progress: Progress): boolean {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
		return true;
	} catch {
		return false;
	}
}
export function updateDraft(
	progress: Progress,
	id: string,
	level: Level,
	text: string,
): void {
	const key = writingKey(id, level);
	const bounded = text.slice(0, 8000);
	if (bounded === progress.drafts[key]) return;
	progress.drafts[key] = bounded;
	progress.writingDone = progress.writingDone.filter((k) => k !== key);
}
export function isComplete(
	progress: Progress,
	id: string,
	level = progress.level,
): boolean {
	const lesson = findLesson(id);
	const key = writingKey(id, level);
	return (
		!!lesson &&
		progress.quizDone.includes(id) &&
		checkCases(lesson.cases, progress.cases[id] ?? []).every(Boolean) &&
		progress.writingDone.includes(key) &&
		canReview(progress.drafts[key] ?? "")
	);
}
export function completion(progress: Progress): {
	completed: number;
	total: number;
} {
	return {
		completed: LESSONS.filter((l) => isComplete(progress, l.id)).length,
		total: LESSONS.length,
	};
}
