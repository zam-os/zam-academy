import { CORE_LESSONS, LESSONS } from "../curriculum";
import { canReview } from "../practice";
import type { Level } from "../types";

export const STORAGE_KEY = "englisch_rs9_academy_progress_v1";
export interface Progress {
	activeLessonId: string;
	level: Level;
	includeFoundations: boolean;
	quizDone: string[];
	practiceDone: string[];
	writingDone: string[];
	drafts: Record<string, string>;
	listening: Record<string, "synthetic" | "partner">;
}
export const writingKey = (id: string, level: Level): string =>
	`${id}:${level}`;
const lessonIds = new Set(LESSONS.map((lesson) => lesson.id));
const writingKeys = new Set(
	LESSONS.flatMap((lesson) => [
		writingKey(lesson.id, 1),
		writingKey(lesson.id, 2),
	]),
);
const listeningIds = new Set(
	LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id),
);
export function freshProgress(): Progress {
	return {
		activeLessonId: CORE_LESSONS[0].id,
		level: 1,
		includeFoundations: false,
		quizDone: [],
		practiceDone: [],
		writingDone: [],
		drafts: {},
		listening: {},
	};
}
const strings = (value: unknown, allowed: Set<string>): string[] =>
	Array.isArray(value)
		? [
				...new Set(
					value.filter(
						(entry): entry is string =>
							typeof entry === "string" && allowed.has(entry),
					),
				),
			]
		: [];

export function parseProgress(raw: string | null): Progress {
	const base = freshProgress();
	try {
		const value: unknown = JSON.parse(raw ?? "null");
		if (!value || typeof value !== "object" || Array.isArray(value))
			return base;
		const data = value as Record<string, unknown>;
		const drafts: Record<string, string> = {};
		if (
			data.drafts &&
			typeof data.drafts === "object" &&
			!Array.isArray(data.drafts)
		)
			for (const [key, text] of Object.entries(data.drafts))
				if (writingKeys.has(key) && typeof text === "string")
					drafts[key] = text.slice(0, 8000);
		const listening: Progress["listening"] = {};
		if (
			data.listening &&
			typeof data.listening === "object" &&
			!Array.isArray(data.listening)
		)
			for (const [id, mode] of Object.entries(data.listening))
				if (
					listeningIds.has(id) &&
					(mode === "synthetic" || mode === "partner")
				)
					listening[id] = mode;
		return {
			activeLessonId:
				typeof data.activeLessonId === "string" &&
				lessonIds.has(data.activeLessonId)
					? data.activeLessonId
					: base.activeLessonId,
			level: data.level === 2 ? 2 : 1,
			includeFoundations: data.includeFoundations === true,
			quizDone: strings(data.quizDone, lessonIds),
			practiceDone: strings(data.practiceDone, lessonIds),
			writingDone: strings(data.writingDone, writingKeys).filter((key) =>
				canReview(drafts[key] ?? ""),
			),
			drafts,
			listening,
		};
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
/** Any edit invalidates the comparison and self-assessment of that exact draft. */
export function updateDraft(
	progress: Progress,
	id: string,
	level: Level,
	text: string,
): void {
	const key = writingKey(id, level);
	if (progress.drafts[key] !== text) {
		progress.drafts[key] = text.slice(0, 8000);
		progress.writingDone = progress.writingDone.filter(
			(entry) => entry !== key,
		);
	}
}
export function isComplete(progress: Progress, id: string): boolean {
	const lesson = LESSONS.find((entry) => entry.id === id);
	return (
		!!lesson &&
		progress.quizDone.includes(id) &&
		progress.practiceDone.includes(id) &&
		progress.writingDone.includes(writingKey(id, 1)) &&
		canReview(progress.drafts[writingKey(id, 1)] ?? "") &&
		(!lesson.listening || !!progress.listening[id])
	);
}
export function completion(
	progress: Progress,
	includeFoundations = false,
): { completed: number; total: number; percent: number } {
	const visible = includeFoundations ? LESSONS : CORE_LESSONS;
	const completed = visible.filter((lesson) =>
		isComplete(progress, lesson.id),
	).length;
	return {
		completed,
		total: visible.length,
		percent: Math.round((100 * completed) / visible.length),
	};
}
