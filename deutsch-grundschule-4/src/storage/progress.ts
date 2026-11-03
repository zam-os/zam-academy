import { findLesson, LESSONS } from "../curriculum";
import type { Level } from "../types";

export const STORAGE_KEY = "deutsch_gs4_progress_v1";

/**
 * Everything here only grows: a right quick check, a reached goal, a solved
 * task. That makes tabs easy to merge (union and maximum). A reset starts a
 * new epoch; a tab that still holds the old epoch adopts the reset.
 */
export interface Progress {
	epoch: string;
	level: Level;
	quizDone: string[];
	goals: Record<string, string[]>;
	solved: Record<string, { 1: number; 2: number }>;
	/** Seeds the next generated task, per `lessonId:level`. */
	attempts: Record<string, number>;
	/** Lessons whose sticker celebration was shown. */
	celebrated: string[];
}

const newEpoch = (): string =>
	`${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const freshProgress = (): Progress => ({
	epoch: newEpoch(),
	level: 1,
	quizDone: [],
	goals: {},
	solved: {},
	attempts: {},
	celebrated: [],
});

const record = (value: unknown): Record<string, unknown> =>
	value && typeof value === "object" && !Array.isArray(value)
		? (value as Record<string, unknown>)
		: {};
const count = (value: unknown): number =>
	typeof value === "number" && Number.isFinite(value) && value > 0
		? Math.floor(value)
		: 0;

export function parseProgress(raw: string | null): Progress {
	const base = freshProgress();
	try {
		const data = record(JSON.parse(raw ?? "null"));
		if (!Object.keys(data).length) return base;
		const ids = new Set(LESSONS.map((l) => l.id));
		const list = (value: unknown): string[] =>
			Array.isArray(value)
				? [...new Set(value.filter((v): v is string => typeof v === "string" && ids.has(v)))]
				: [];
		if (typeof data.epoch === "string" && data.epoch) base.epoch = data.epoch;
		base.level = data.level === 2 ? 2 : 1;
		base.quizDone = list(data.quizDone);
		base.celebrated = list(data.celebrated);
		for (const [id, goals] of Object.entries(record(data.goals))) {
			const lesson = findLesson(id);
			if (!lesson || !Array.isArray(goals)) continue;
			const known = new Set(lesson.workshop.goals.map((g) => g.id));
			const kept = [...new Set(goals.filter((g): g is string => typeof g === "string" && known.has(g)))];
			if (kept.length) base.goals[id] = kept;
		}
		for (const [id, value] of Object.entries(record(data.solved))) {
			if (!ids.has(id)) continue;
			const entry = record(value);
			base.solved[id] = { 1: count(entry[1]), 2: count(entry[2]) };
		}
		for (const [key, value] of Object.entries(record(data.attempts))) {
			const [id, level] = key.split(":");
			if (ids.has(id) && (level === "1" || level === "2")) base.attempts[key] = count(value);
		}
		return base;
	} catch {
		return base;
	}
}

/** Union of two progress states of the same epoch. `local` keeps its level. */
export function mergeProgress(local: Progress, stored: Progress): Progress {
	const merged = freshProgress();
	merged.epoch = local.epoch;
	merged.level = local.level;
	const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];
	merged.quizDone = union(stored.quizDone, local.quizDone);
	merged.celebrated = union(stored.celebrated, local.celebrated);
	for (const id of new Set([...Object.keys(stored.goals), ...Object.keys(local.goals)]))
		merged.goals[id] = union(stored.goals[id] ?? [], local.goals[id] ?? []);
	for (const id of new Set([...Object.keys(stored.solved), ...Object.keys(local.solved)]))
		merged.solved[id] = {
			1: Math.max(stored.solved[id]?.[1] ?? 0, local.solved[id]?.[1] ?? 0),
			2: Math.max(stored.solved[id]?.[2] ?? 0, local.solved[id]?.[2] ?? 0),
		};
	for (const key of new Set([...Object.keys(stored.attempts), ...Object.keys(local.attempts)]))
		merged.attempts[key] = Math.max(stored.attempts[key] ?? 0, local.attempts[key] ?? 0);
	return merged;
}

const resetPending = new WeakSet<Progress>();

export function loadProgress(): Progress {
	try {
		return parseProgress(localStorage.getItem(STORAGE_KEY));
	} catch {
		return freshProgress();
	}
}

/** A deliberate reset: the next save overwrites instead of merging. */
export function resetProgress(): Progress {
	const progress = freshProgress();
	resetPending.add(progress);
	return progress;
}

/**
 * Save and adopt what other tabs saved meanwhile. Returns the state the tab
 * should continue with, and whether writing worked.
 */
export function saveProgress(progress: Progress): { progress: Progress; saved: boolean } {
	try {
		let next = progress;
		if (!resetPending.has(progress)) {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const stored = parseProgress(raw);
				next =
					stored.epoch === progress.epoch
						? mergeProgress(progress, stored)
						: { ...stored, level: progress.level };
			}
		}
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
		resetPending.delete(progress);
		return { progress: next, saved: true };
	} catch {
		return { progress, saved: false };
	}
}

/**
 * Take over what another tab saved, without writing. Writing here would let
 * two tabs with different levels answer each other's storage events forever.
 */
export function adoptStored(progress: Progress): Progress {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return progress;
		const stored = parseProgress(raw);
		return stored.epoch === progress.epoch
			? mergeProgress(progress, stored)
			: { ...stored, level: progress.level };
	} catch {
		return progress;
	}
}

export function recordQuiz(progress: Progress, id: string): void {
	if (!progress.quizDone.includes(id)) progress.quizDone.push(id);
}

export function recordGoals(progress: Progress, id: string, goals: string[]): string[] {
	const before = new Set(progress.goals[id] ?? []);
	const fresh = goals.filter((g) => !before.has(g));
	if (fresh.length) progress.goals[id] = [...before, ...fresh];
	return fresh;
}

export function recordSolved(progress: Progress, id: string, level: Level): number {
	const entry = progress.solved[id] ?? { 1: 0, 2: 0 };
	entry[level] += 1;
	progress.solved[id] = entry;
	return entry[level];
}

export const attemptKey = (id: string, level: Level): string => `${id}:${level}`;

export function nextAttempt(progress: Progress, id: string, level: Level): number {
	const key = attemptKey(id, level);
	progress.attempts[key] = (progress.attempts[key] ?? 0) + 1;
	return progress.attempts[key];
}

export interface Stars {
	quiz: boolean;
	workshop: boolean;
	level1: boolean;
	level2: boolean;
}

export function stars(progress: Progress, id: string): Stars {
	const lesson = findLesson(id);
	if (!lesson) return { quiz: false, workshop: false, level1: false, level2: false };
	const goals = new Set(progress.goals[id] ?? []);
	const solved = progress.solved[id] ?? { 1: 0, 2: 0 };
	return {
		quiz: progress.quizDone.includes(id),
		workshop: lesson.workshop.goals.every((g) => goals.has(g.id)),
		level1: solved[1] >= lesson.requiredCorrect,
		level2: solved[2] >= lesson.requiredCorrect,
	};
}

export const starCount = (s: Stars): number =>
	[s.quiz, s.workshop, s.level1, s.level2].filter(Boolean).length;

export const isComplete = (progress: Progress, id: string): boolean =>
	starCount(stars(progress, id)) === 4;

export function completion(progress: Progress): { completed: number; stars: number; total: number } {
	return {
		completed: LESSONS.filter((l) => isComplete(progress, l.id)).length,
		stars: LESSONS.reduce((n, l) => n + starCount(stars(progress, l.id)), 0),
		total: LESSONS.length,
	};
}
