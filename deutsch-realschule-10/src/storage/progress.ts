import { findLesson, LESSONS } from "../curriculum";
import { canReview, checkCases } from "../practice";
import type { Level } from "../types";

export const STORAGE_KEY = "deutsch_rs10_progress_v1";
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
// Each loaded object represents one tab. Only explicit actions are merged;
// action revisions keep queued saves from consuming edits made after them.
const initialized = new WeakSet<Progress>();
interface PendingChanges {
	quiz: Map<string, number>;
	cases: Map<string, number>;
	drafts: Map<string, number>;
	writing: Map<string, number>;
}
const kinds = ["quiz", "cases", "drafts", "writing"] as const;
let revision = 0;
const pending = new WeakMap<Progress, PendingChanges>();
const emptyChanges = (): PendingChanges => ({
	quiz: new Map(),
	cases: new Map(),
	drafts: new Map(),
	writing: new Map(),
});
function changesFor(progress: Progress): PendingChanges {
	let changes = pending.get(progress);
	if (!changes) {
		changes = emptyChanges();
		pending.set(progress, changes);
	}
	return changes;
}
function mark(
	progress: Progress,
	kind: keyof PendingChanges,
	key: string,
): void {
	changesFor(progress)[kind].set(key, ++revision);
}
const copyProgress = (value: Progress): Progress =>
	parseProgress(JSON.stringify(value));
function mergeProgress(
	local: Progress,
	latest: Progress,
	changes: PendingChanges,
): Progress {
	const merged = copyProgress(latest);
	// The visible task level belongs to this tab. Adopting another tab's
	// selection would route the current textarea into the wrong level.
	merged.level = local.level;
	for (const id of changes.quiz.keys()) {
		merged.quizDone = merged.quizDone.filter((value) => value !== id);
		if (local.quizDone.includes(id)) merged.quizDone.push(id);
	}
	for (const id of changes.cases.keys()) {
		if (local.cases[id]) merged.cases[id] = [...local.cases[id]];
		else delete merged.cases[id];
	}
	const keys = new Set([...changes.drafts.keys(), ...changes.writing.keys()]);
	for (const key of keys) {
		const draftChanged = changes.drafts.has(key);
		const text = draftChanged ? local.drafts[key] : latest.drafts[key];
		if (text !== undefined) merged.drafts[key] = text;
		else delete merged.drafts[key];
		// A confirmation belongs to the exact text that was compared. Never
		// attach a stale tab's confirmation to another tab's changed draft.
		const confirmed =
			draftChanged || latest.drafts[key] === local.drafts[key]
				? local.writingDone.includes(key)
				: latest.writingDone.includes(key);
		merged.writingDone = merged.writingDone.filter((value) => value !== key);
		if (confirmed && canReview(text ?? "")) merged.writingDone.push(key);
	}
	return copyProgress(merged);
}
export function loadProgress(): Progress {
	let progress: Progress;
	try {
		progress = parseProgress(localStorage.getItem(STORAGE_KEY));
	} catch {
		progress = freshProgress();
	}
	initialized.add(progress);
	return progress;
}
function writeProgress(
	progress: Progress,
	snapshot: Progress,
	submitted: PendingChanges,
): boolean {
	try {
		const current = changesFor(progress);
		const effective = emptyChanges();
		for (const kind of kinds)
			for (const [key, rev] of submitted[kind])
				if (current[kind].get(key) === rev) effective[kind].set(key, rev);
		// A fresh object is the explicit reset path. Reset it only once, even
		// if more than one save was queued before the first write succeeded.
		const merged = initialized.has(progress)
			? mergeProgress(
					snapshot,
					parseProgress(localStorage.getItem(STORAGE_KEY)),
					effective,
				)
			: copyProgress(snapshot);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
		for (const kind of kinds)
			for (const [key, rev] of effective[kind])
				if (current[kind].get(key) === rev) current[kind].delete(key);
		// Adopt remote work while retaining newer local actions that were not
		// part of this immutable save request (or superseded its actions).
		Object.assign(progress, mergeProgress(progress, merged, current));
		initialized.add(progress);
		return true;
	} catch {
		return false;
	}
}
/** Coordinate the entire read/merge/write across tabs when Web Locks exists. */
export async function saveProgress(progress: Progress): Promise<boolean> {
	const snapshot = copyProgress(progress);
	const submitted = emptyChanges();
	const current = changesFor(progress);
	for (const kind of kinds) submitted[kind] = new Map(current[kind]);
	const write = () => writeProgress(progress, snapshot, submitted);
	try {
		const locks =
			typeof navigator === "undefined" ? undefined : navigator.locks;
		if (!locks) return write();
		return await locks.request(STORAGE_KEY, write);
	} catch (error) {
		// Some offline/opaque origins expose the API but cannot obtain a lock.
		// Keep the working merge fallback; other lock failures remain visible.
		if (
			error instanceof DOMException &&
			(error.name === "SecurityError" || error.name === "NotSupportedError")
		)
			return write();
		return false;
	}
}
/** Record submissions even when their values equal this tab's old snapshot. */
export function recordQuizAnswer(
	progress: Progress,
	id: string,
	correct: boolean,
): void {
	mark(progress, "quiz", id);
	progress.quizDone = progress.quizDone.filter((value) => value !== id);
	if (correct) progress.quizDone.push(id);
}
export function submitCaseAnswers(
	progress: Progress,
	id: string,
	values: string[],
): void {
	mark(progress, "cases", id);
	progress.cases[id] = [...values];
}
export function confirmWriting(
	progress: Progress,
	id: string,
	level: Level,
	comparedText: string,
): boolean {
	const key = writingKey(id, level);
	if (progress.drafts[key] !== comparedText || !canReview(comparedText))
		return false;
	mark(progress, "writing", key);
	if (!progress.writingDone.includes(key)) progress.writingDone.push(key);
	return true;
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
	mark(progress, "drafts", key);
	mark(progress, "writing", key);
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
