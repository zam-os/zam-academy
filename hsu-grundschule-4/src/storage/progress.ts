import type {
	AppProgress,
	AttemptEvidence,
	LessonProgress,
	StageId,
} from "../model/types";

export const STORAGE_KEY = "zam-hsu-gs4-v1";
export const REQUIRED_CORRECT_PER_LEVEL = 1;
export const REQUIRED_LAB_GOALS = 3;
const MAX_EVIDENCE = 40;

export function emptyLessonProgress(): LessonProgress {
	return {
		goalsReached: [],
		quizSolved: false,
		level1Correct: 0,
		level2Correct: 0,
		stampEarnedAt: null,
	};
}

export function freshProgress(): AppProgress {
	return {
		schema: 1,
		lessons: {},
		recentEvidence: [],
		quietMode: false,
		soundEnabled: false,
	};
}

function isStringArray(v: unknown): v is string[] {
	return Array.isArray(v) && v.every((item) => typeof item === "string");
}

export function parseProgress(raw: string | null): {
	progress: AppProgress;
	corrupted: boolean;
} {
	if (!raw) return { progress: freshProgress(), corrupted: false };
	try {
		const parsed = JSON.parse(raw) as Record<string, unknown>;
		if (!parsed || typeof parsed !== "object" || parsed.schema !== 1) {
			return { progress: freshProgress(), corrupted: true };
		}
		const lessonsRaw = parsed.lessons;
		if (!lessonsRaw || typeof lessonsRaw !== "object" || Array.isArray(lessonsRaw)) {
			return { progress: freshProgress(), corrupted: true };
		}
		const lessons: Record<string, LessonProgress> = {};
		for (const [id, entry] of Object.entries(
			lessonsRaw as Record<string, unknown>,
		)) {
			if (!entry || typeof entry !== "object") continue;
			const e = entry as Record<string, unknown>;
			if (
				!isStringArray(e.goalsReached) ||
				typeof e.quizSolved !== "boolean" ||
				typeof e.level1Correct !== "number" ||
				typeof e.level2Correct !== "number"
			) {
				return { progress: freshProgress(), corrupted: true };
			}
			lessons[id] = {
				goalsReached: [...new Set(e.goalsReached)],
				quizSolved: e.quizSolved,
				level1Correct: Math.max(0, Math.floor(e.level1Correct)),
				level2Correct: Math.max(0, Math.floor(e.level2Correct)),
				stampEarnedAt:
					typeof e.stampEarnedAt === "string" ? e.stampEarnedAt : null,
			};
		}
		const evidenceRaw = Array.isArray(parsed.recentEvidence)
			? parsed.recentEvidence
			: [];
		const recentEvidence: AttemptEvidence[] = [];
		for (const item of evidenceRaw.slice(0, MAX_EVIDENCE)) {
			if (!item || typeof item !== "object") continue;
			const r = item as Record<string, unknown>;
			if (
				typeof r.at === "string" &&
				typeof r.lessonId === "string" &&
				typeof r.lessonTitle === "string" &&
				typeof r.stageId === "string" &&
				(r.level === 1 || r.level === 2) &&
				typeof r.promptSummary === "string" &&
				typeof r.helped === "boolean" &&
				typeof r.correctFirstTry === "boolean"
			) {
				recentEvidence.push({
					at: r.at,
					lessonId: r.lessonId,
					lessonTitle: r.lessonTitle,
					stageId: r.stageId as StageId,
					level: r.level,
					promptSummary: r.promptSummary,
					helped: r.helped,
					correctFirstTry: r.correctFirstTry,
				});
			}
		}
		return {
			progress: {
				schema: 1,
				lessons,
				recentEvidence,
				quietMode: parsed.quietMode === true,
				soundEnabled: parsed.soundEnabled === true,
			},
			corrupted: false,
		};
	} catch {
		return { progress: freshProgress(), corrupted: true };
	}
}

export function loadProgress(): {
	progress: AppProgress;
	storageAvailable: boolean;
	corrupted: boolean;
} {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		const { progress, corrupted } = parseProgress(raw);
		return { progress, storageAvailable: true, corrupted };
	} catch {
		return {
			progress: freshProgress(),
			storageAvailable: false,
			corrupted: false,
		};
	}
}

export function saveProgress(progress: AppProgress): boolean {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
		return true;
	} catch {
		return false;
	}
}

export function clearProgress(): boolean {
	try {
		localStorage.removeItem(STORAGE_KEY);
		return true;
	} catch {
		return false;
	}
}

export function getLessonProgress(
	progress: AppProgress,
	lessonId: string,
): LessonProgress {
	return progress.lessons[lessonId] ?? emptyLessonProgress();
}

export function isLessonComplete(lp: LessonProgress): boolean {
	return (
		lp.goalsReached.length >= REQUIRED_LAB_GOALS &&
		lp.quizSolved &&
		lp.level1Correct >= REQUIRED_CORRECT_PER_LEVEL &&
		lp.level2Correct >= REQUIRED_CORRECT_PER_LEVEL
	);
}

function maybeUnlockStamp(
	lp: LessonProgress,
	nowIso: string,
): { updated: LessonProgress; newlyUnlocked: boolean } {
	if (isLessonComplete(lp) && !lp.stampEarnedAt) {
		return {
			updated: { ...lp, stampEarnedAt: nowIso },
			newlyUnlocked: true,
		};
	}
	return { updated: lp, newlyUnlocked: false };
}

export function recordLabGoals(
	progress: AppProgress,
	lessonId: string,
	newlyReachedIds: ReadonlyArray<string>,
	nowIso = new Date().toISOString(),
): { progress: AppProgress; addedGoals: string[]; stampUnlocked: boolean } {
	const current = getLessonProgress(progress, lessonId);
	const existing = new Set(current.goalsReached);
	const addedGoals = newlyReachedIds.filter((id) => !existing.has(id));
	if (addedGoals.length === 0) {
		return { progress, addedGoals: [], stampUnlocked: false };
	}
	const merged: LessonProgress = {
		...current,
		goalsReached: [...current.goalsReached, ...addedGoals],
	};
	const { updated, newlyUnlocked } = maybeUnlockStamp(merged, nowIso);
	return {
		progress: {
			...progress,
			lessons: { ...progress.lessons, [lessonId]: updated },
		},
		addedGoals,
		stampUnlocked: newlyUnlocked,
	};
}

export function recordQuizSolved(
	progress: AppProgress,
	lessonId: string,
	nowIso = new Date().toISOString(),
): { progress: AppProgress; stampUnlocked: boolean } {
	const current = getLessonProgress(progress, lessonId);
	if (current.quizSolved) {
		return { progress, stampUnlocked: false };
	}
	const merged: LessonProgress = { ...current, quizSolved: true };
	const { updated, newlyUnlocked } = maybeUnlockStamp(merged, nowIso);
	return {
		progress: {
			...progress,
			lessons: { ...progress.lessons, [lessonId]: updated },
		},
		stampUnlocked: newlyUnlocked,
	};
}

export function recordExerciseSuccess(
	progress: AppProgress,
	params: {
		lessonId: string;
		lessonTitle: string;
		stageId: StageId;
		level: 1 | 2;
		promptSummary: string;
		helped: boolean;
		correctFirstTry: boolean;
		nowIso?: string;
	},
): { progress: AppProgress; stampUnlocked: boolean } {
	const nowIso = params.nowIso ?? new Date().toISOString();
	const current = getLessonProgress(progress, params.lessonId);
	const merged: LessonProgress = {
		...current,
		level1Correct:
			params.level === 1 ? current.level1Correct + 1 : current.level1Correct,
		level2Correct:
			params.level === 2 ? current.level2Correct + 1 : current.level2Correct,
	};
	const { updated, newlyUnlocked } = maybeUnlockStamp(merged, nowIso);
	const entry: AttemptEvidence = {
		at: nowIso,
		lessonId: params.lessonId,
		lessonTitle: params.lessonTitle,
		stageId: params.stageId,
		level: params.level,
		promptSummary: params.promptSummary.slice(0, 160),
		helped: params.helped,
		correctFirstTry: params.correctFirstTry,
	};
	return {
		progress: {
			...progress,
			lessons: { ...progress.lessons, [params.lessonId]: updated },
			recentEvidence: [entry, ...progress.recentEvidence].slice(
				0,
				MAX_EVIDENCE,
			),
		},
		stampUnlocked: newlyUnlocked,
	};
}
