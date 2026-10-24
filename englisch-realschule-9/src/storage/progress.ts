import { CORE_LESSONS, LESSONS } from "../curriculum";
import { canReview } from "../practice";
import type { Level } from "../types";

export const STORAGE_KEY = "englisch_rs9_academy_progress_v1";
export interface ListeningEvidence {
	synthetic: boolean;
	partner: boolean;
}
export interface Progress {
	/** A confirmed reset must also replace the state held by older tabs. */
	resetAt: number;
	activeLessonId: string;
	level: Level;
	includeFoundations: boolean;
	quizDone: string[];
	practiceDone: string[];
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
		Object.assign(
			progress,
			mergeProgress(
				parseProgress(localStorage.getItem(STORAGE_KEY)),
				progress,
				baseline,
			),
		);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
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
