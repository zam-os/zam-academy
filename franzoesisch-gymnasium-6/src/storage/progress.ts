import { LESSONS } from "../curriculum";
import { canReview } from "../practice";
import type { Level } from "../types";

export const STORAGE_KEY = "franzoesisch_gym6_academy_progress_v1";
/**
 * Until 2026-11 this package also held the second-language path; its lessons
 * (`f6-2-…`) moved to `franzoesisch-2fs-gymnasium-6` on the same origin. Before
 * this package saves (and so drops ids it no longer knows), it hands those
 * entries over once, while the new package has nothing saved of its own.
 */
export const SECOND_LANGUAGE_STORAGE_KEY = "franzoesisch_2fs_gym6_academy_progress_v1";
const secondLanguage = (key: string) => key.startsWith("f6-2-");

/** Only the second-language entries of a saved state, or null when there are none. */
export function secondLanguageEntries(raw: string | null): string | null {
	try {
		const value: unknown = JSON.parse(raw ?? "null");
		if (!value || typeof value !== "object" || Array.isArray(value)) return null;
		const data = value as Record<string, unknown>;
		const picked: Record<string, unknown> = {};
		let found = false;
		for (const field of ["quizDone", "practiceDone", "workshopDone", "writingDone"]) {
			const list = Array.isArray(data[field])
				? (data[field] as unknown[]).filter(
						(entry) => typeof entry === "string" && secondLanguage(entry),
					)
				: [];
			picked[field] = list;
			found ||= list.length > 0;
		}
		for (const field of ["drafts", "listening"]) {
			const map = data[field];
			const entries =
				map && typeof map === "object" && !Array.isArray(map)
					? Object.entries(map).filter(([key]) => secondLanguage(key))
					: [];
			picked[field] = Object.fromEntries(entries);
			found ||= entries.length > 0;
		}
		if (typeof data.activeLessonId === "string" && secondLanguage(data.activeLessonId))
			picked.activeLessonId = data.activeLessonId;
		if (data.level === 2) picked.level = 2;
		return found ? JSON.stringify(picked) : null;
	} catch {
		return null;
	}
}

/**
 * Returns the second-language entries that still wait for the new package:
 * null once they are handed over (or there are none). A failed write, for
 * example a full storage quota, leaves them pending; saveProgress then keeps
 * them in this package's state so that the only copy is never overwritten.
 */
export function handOverSecondLanguage(): string | null {
	try {
		if (localStorage.getItem(SECOND_LANGUAGE_STORAGE_KEY) !== null) return null;
		const entries = secondLanguageEntries(localStorage.getItem(STORAGE_KEY));
		if (entries === null) return null;
		try {
			localStorage.setItem(SECOND_LANGUAGE_STORAGE_KEY, entries);
			return null;
		} catch {
			return entries;
		}
	} catch {
		return null;
	}
}

/** This package's state plus the second-language entries that are still pending. */
function withPending(progress: Progress, pending: string): Record<string, unknown> {
	const extra = JSON.parse(pending) as Record<string, unknown>;
	const state: Record<string, unknown> = { ...progress };
	for (const field of ["quizDone", "practiceDone", "workshopDone", "writingDone"] as const)
		state[field] = [...new Set([...progress[field], ...((extra[field] as string[]) ?? [])])];
	state.drafts = { ...((extra.drafts as object) ?? {}), ...progress.drafts };
	state.listening = { ...((extra.listening as object) ?? {}), ...progress.listening };
	return state;
}
export interface ListeningEvidence {
	synthetic: boolean;
	partner: boolean;
}
export interface Progress {
	/** A confirmed reset must also replace the state held by older tabs. */
	resetAt: number;
	activeLessonId: string;
	level: Level;
	quizDone: string[];
	practiceDone: string[];
	workshopDone: string[];
	writingDone: string[];
	drafts: Record<string, string>;
	listening: Record<string, ListeningEvidence>;
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
		resetAt: 0,
		activeLessonId: LESSONS[0].id,
		level: 1,
		quizDone: [],
		practiceDone: [],
		workshopDone: [],
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
			for (const [id, mode] of Object.entries(data.listening)) {
				if (!listeningIds.has(id)) continue;
				// Read the original single-mode format without losing a completed exercise.
				const evidence =
					mode && typeof mode === "object"
						? (mode as Record<string, unknown>)
						: {};
				const synthetic = mode === "synthetic" || evidence.synthetic === true;
				const partner = mode === "partner" || evidence.partner === true;
				if (synthetic || partner) listening[id] = { synthetic, partner };
			}
		return {
			resetAt:
				typeof data.resetAt === "number" &&
				Number.isSafeInteger(data.resetAt) &&
				data.resetAt >= 0
					? data.resetAt
					: 0,
			activeLessonId:
				typeof data.activeLessonId === "string" &&
				lessonIds.has(data.activeLessonId)
					? data.activeLessonId
					: base.activeLessonId,
			level: data.level === 2 ? 2 : 1,
			quizDone: strings(data.quizDone, lessonIds),
			practiceDone: strings(data.practiceDone, lessonIds),
			workshopDone: strings(data.workshopDone, lessonIds),
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
	handOverSecondLanguage();
	try {
		return parseProgress(localStorage.getItem(STORAGE_KEY));
	} catch {
		return freshProgress();
	}
}
/**
 * Finished checks grow across tabs. Only a text edited since this tab's last
 * saved baseline may replace a newer stored draft; an assessment belongs to
 * that exact text. Partner confirmation and completed speech are independent.
 */
export function mergeProgress(
	stored: Progress,
	own: Progress,
	baseline: Progress,
): Progress {
	if (stored.resetAt > own.resetAt)
		return { ...stored, activeLessonId: own.activeLessonId, level: own.level };
	if (own.resetAt > stored.resetAt) return own;
	const join = (a: string[], b: string[]) => [...new Set([...a, ...b])];
	const drafts: Progress["drafts"] = {};
	for (const key of new Set([
		...Object.keys(stored.drafts),
		...Object.keys(own.drafts),
	])) {
		const edited = (own.drafts[key] ?? "") !== (baseline.drafts[key] ?? "");
		drafts[key] = edited
			? (own.drafts[key] ?? "")
			: (stored.drafts[key] ?? own.drafts[key] ?? "");
	}
	const listening: Progress["listening"] = {};
	for (const id of listeningIds) {
		const synthetic =
			stored.listening[id]?.synthetic === true ||
			own.listening[id]?.synthetic === true;
		const ownPartner = own.listening[id]?.partner === true;
		const changed = ownPartner !== (baseline.listening[id]?.partner === true);
		const partner = changed
			? ownPartner
			: stored.listening[id]?.partner === true;
		if (synthetic || partner) listening[id] = { synthetic, partner };
	}
	return {
		...own,
		quizDone: join(stored.quizDone, own.quizDone),
		practiceDone: join(stored.practiceDone, own.practiceDone),
		workshopDone: join(stored.workshopDone, own.workshopDone),
		drafts,
		writingDone: join(
			stored.writingDone.filter((key) => drafts[key] === stored.drafts[key]),
			own.writingDone.filter((key) => drafts[key] === own.drafts[key]),
		).filter((key) => canReview(drafts[key] ?? "")),
		listening,
	};
}

/** Read immediately before writing: navigation in a stale tab must not erase work. */
export function saveProgress(progress: Progress, baseline: Progress): boolean {
	try {
		const stored = parseProgress(localStorage.getItem(STORAGE_KEY));
		// A confirmed reset deletes this package's texts, pending ones included.
		const pending =
			progress.resetAt > stored.resetAt ? null : handOverSecondLanguage();
		Object.assign(progress, mergeProgress(stored, progress, baseline));
		localStorage.setItem(
			STORAGE_KEY,
			JSON.stringify(pending ? withPending(progress, pending) : progress),
		);
		return true;
	} catch {
		return false;
	}
}

export function resetProgress(previous: Progress): Progress {
	return {
		...freshProgress(),
		resetAt: Math.max(Date.now(), previous.resetAt + 1),
	};
}

export function setPartnerListening(
	progress: Progress,
	id: string,
	partner: boolean,
): void {
	const synthetic = progress.listening[id]?.synthetic === true;
	if (synthetic || partner) progress.listening[id] = { synthetic, partner };
	else delete progress.listening[id];
}

export function markSyntheticListening(progress: Progress, id: string): void {
	progress.listening[id] = {
		synthetic: true,
		partner: progress.listening[id]?.partner === true,
	};
}
/** Any edit invalidates the comparison and self-assessment of that exact draft. */
export function updateDraft(
	progress: Progress,
	id: string,
	level: Level,
	text: string,
): void {
	const key = writingKey(id, level);
	const trimmed = text.slice(0, 8000);
	if (progress.drafts[key] !== trimmed) {
		progress.drafts[key] = trimmed;
		progress.writingDone = progress.writingDone.filter(
			(entry) => entry !== key,
		);
	}
}
export function isComplete(progress: Progress, id: string): boolean {
	const lesson = LESSONS.find((entry) => entry.id === id);
	return (
		!!lesson &&
		progress.workshopDone.includes(id) &&
		progress.quizDone.includes(id) &&
		progress.practiceDone.includes(id) &&
		progress.writingDone.includes(writingKey(id, 1)) &&
		canReview(progress.drafts[writingKey(id, 1)] ?? "") &&
		(!lesson.listening ||
			progress.listening[id]?.synthetic === true ||
			progress.listening[id]?.partner === true)
	);
}
export function completion(
	progress: Progress,
): { completed: number; total: number; percent: number } {
	const completed = LESSONS.filter((lesson) =>
		isComplete(progress, lesson.id),
	).length;
	return {
		completed,
		total: LESSONS.length,
		percent: Math.round((100 * completed) / LESSONS.length),
	};
}
