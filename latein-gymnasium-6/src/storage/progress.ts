import { CORE_LESSONS, LESSONS } from "../curriculum";
import { canReview } from "../practice";
import type { Level } from "../types";

export const STORAGE_KEY = "zam-academy:latein-gymnasium-6:v1";

export interface RecitationEvidence {
	synthetic: boolean;
	partner: boolean;
}

export interface Progress {
	schema: 1;
	activeLessonId: string;
	level: Level;
	includeFoundations: boolean;
	workshopDone: string[];
	quizDone: string[];
	practiceDone: string[];
	writingDone: string[];
	recitation: Record<string, RecitationEvidence>;
	drafts: Record<string, string>;
	resetAt: number;
}

const VALID_IDS = new Set(LESSONS.map((lesson) => lesson.id));
const VALID_WRITING_KEY = (key: string): boolean => {
	const match = /^([a-z0-9-]+):([12])$/.exec(key);
	return !!match && VALID_IDS.has(match[1]);
};

export const writingKey = (id: string, level: Level): string =>
	`${id}:${level}`;

export function freshProgress(): Progress {
	return {
		schema: 1,
		activeLessonId: CORE_LESSONS[0].id,
		level: 1,
		includeFoundations: false,
		workshopDone: [],
		quizDone: [],
		practiceDone: [],
		writingDone: [],
		recitation: {},
		drafts: {},
		resetAt: 0,
	};
}

const ids = (value: unknown): string[] =>
	Array.isArray(value)
		? [
				...new Set(
					value.filter(
						(entry): entry is string =>
							typeof entry === "string" && VALID_IDS.has(entry),
					),
				),
			]
		: [];

const writingKeys = (value: unknown): string[] =>
	Array.isArray(value)
		? [
				...new Set(
					value.filter(
						(entry): entry is string =>
							typeof entry === "string" && VALID_WRITING_KEY(entry),
					),
				),
			]
		: [];

function parseRecitation(value: unknown): Record<string, RecitationEvidence> {
	if (!value || typeof value !== "object") return {};
	const result: Record<string, RecitationEvidence> = {};
	for (const [id, entry] of Object.entries(value as Record<string, unknown>)) {
		if (!VALID_IDS.has(id)) continue;
		if (entry === "synthetic") result[id] = { synthetic: true, partner: false };
		else if (entry === "partner")
			result[id] = { synthetic: false, partner: true };
		else if (
			entry &&
			typeof entry === "object" &&
			typeof (entry as RecitationEvidence).synthetic === "boolean" &&
			typeof (entry as RecitationEvidence).partner === "boolean"
		) {
			const { synthetic, partner } = entry as RecitationEvidence;
			if (synthetic || partner) result[id] = { synthetic, partner };
		}
	}
	return result;
}

export function parseProgress(raw: string | null): Progress {
	const empty = freshProgress();
	if (!raw) return empty;
	try {
		const data = JSON.parse(raw) as Partial<Progress>;
		if (!data || typeof data !== "object") return empty;
		const drafts: Record<string, string> = {};
		if (data.drafts && typeof data.drafts === "object") {
			for (const [key, value] of Object.entries(data.drafts)) {
				if (VALID_WRITING_KEY(key) && typeof value === "string")
					drafts[key] = value.slice(0, 8000);
			}
		}
		return {
			schema: 1,
			activeLessonId:
				typeof data.activeLessonId === "string" &&
				VALID_IDS.has(data.activeLessonId)
					? data.activeLessonId
					: empty.activeLessonId,
			level: data.level === 2 ? 2 : 1,
			includeFoundations: Boolean(data.includeFoundations),
			workshopDone: ids(data.workshopDone),
			quizDone: ids(data.quizDone),
			practiceDone: ids(data.practiceDone),
			writingDone: writingKeys(data.writingDone),
			recitation: parseRecitation(data.recitation),
			drafts,
			resetAt:
				typeof data.resetAt === "number" && Number.isFinite(data.resetAt)
					? data.resetAt
					: 0,
		};
	} catch {
		return empty;
	}
}

export function loadProgress(): Progress {
	try {
		return parseProgress(localStorage.getItem(STORAGE_KEY));
	} catch {
		return freshProgress();
	}
}

const union = (a: string[], b: string[]) => [...new Set([...a, ...b])];

function mergeRecitation(
	stored: Record<string, RecitationEvidence>,
	own: Record<string, RecitationEvidence>,
	baseline: Record<string, RecitationEvidence>,
): Record<string, RecitationEvidence> {
	const result: Record<string, RecitationEvidence> = {};
	for (const id of new Set([...Object.keys(stored), ...Object.keys(own)])) {
		const base = baseline[id];
		const left = stored[id];
		const right = own[id];
		const synthetic =
			Boolean(left?.synthetic) || Boolean(right?.synthetic);
		const ownPartner = Boolean(right?.partner);
		const changed = ownPartner !== Boolean(base?.partner);
		const partner = changed ? ownPartner : Boolean(left?.partner);
		if (synthetic || partner) result[id] = { synthetic, partner };
	}
	return result;
}

/** Combine concurrent tabs without losing another tab's drafts or checks. */
export function mergeProgress(
	stored: Progress,
	own: Progress,
	baseline?: Progress,
): Progress {
	if (!baseline) return own;
	if (own.resetAt > stored.resetAt) return own;
	if (stored.resetAt > own.resetAt) {
		const reset = freshProgress();
		reset.resetAt = stored.resetAt;
		return reset;
	}
	const drafts = { ...stored.drafts };
	for (const key of new Set([
		...Object.keys(own.drafts),
		...Object.keys(baseline.drafts),
	])) {
		if (own.drafts[key] === baseline.drafts[key]) continue;
		if (own.drafts[key] === undefined) delete drafts[key];
		else drafts[key] = own.drafts[key];
	}
	const keys = new Set([
		...stored.writingDone,
		...own.writingDone,
		...baseline.writingDone,
	]);
	const writingDone: string[] = [];
	for (const key of keys) {
		const inStored = stored.writingDone.includes(key),
			inOwn = own.writingDone.includes(key),
			inBase = baseline.writingDone.includes(key);
		const storedDraftChanged =
			(stored.drafts[key] ?? "") !== (baseline.drafts[key] ?? "");
		const ownDraftChanged =
			(own.drafts[key] ?? "") !== (baseline.drafts[key] ?? "");
		const keep =
			inOwn !== inBase
				? inOwn
				: inStored &&
					!(
						ownDraftChanged &&
						!storedDraftChanged &&
						(own.drafts[key] ?? "") !== (stored.drafts[key] ?? "")
					);
		if (keep && canReview(drafts[key] ?? "")) writingDone.push(key);
	}
	return {
		...stored,
		activeLessonId: own.activeLessonId,
		level: own.level,
		includeFoundations:
			own.includeFoundations !== baseline.includeFoundations
				? own.includeFoundations
				: stored.includeFoundations,
		workshopDone: union(stored.workshopDone, own.workshopDone),
		quizDone: union(stored.quizDone, own.quizDone),
		practiceDone: union(stored.practiceDone, own.practiceDone),
		writingDone,
		recitation: mergeRecitation(
			stored.recitation,
			own.recitation,
			baseline.recitation,
		),
		drafts,
		resetAt: stored.resetAt,
	};
}

export function resetProgress(
	current: Progress,
	now = Date.now(),
): Progress {
	const reset = freshProgress();
	reset.resetAt = Math.max(now, current.resetAt + 1);
	return reset;
}

export function saveProgress(
	progress: Progress,
	baseline?: Progress,
): boolean {
	try {
		const merged = mergeProgress(loadProgress(), progress, baseline);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
		Object.assign(progress, merged);
		return true;
	} catch {
		return false;
	}
}

export function setPartnerRecitation(
	progress: Progress,
	id: string,
	checked: boolean,
): void {
	const previous = progress.recitation[id];
	if (checked)
		progress.recitation[id] = {
			synthetic: previous?.synthetic === true,
			partner: true,
		};
	else if (previous?.synthetic)
		progress.recitation[id] = { synthetic: true, partner: false };
	else delete progress.recitation[id];
}

export function markSyntheticRecitation(progress: Progress, id: string): void {
	progress.recitation[id] = {
		synthetic: true,
		partner: progress.recitation[id]?.partner === true,
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
		(!lesson.recitation ||
			progress.recitation[id]?.synthetic === true ||
			progress.recitation[id]?.partner === true)
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
