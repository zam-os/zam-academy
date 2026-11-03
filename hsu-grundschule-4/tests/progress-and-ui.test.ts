import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LOTTA_MESSAGES, renderLottaSvg, renderStampSvg } from "../src/companion/lotta";
import {
	LESSONS,
	LEXIKON_GROUPS,
	REFERENCE_TABLES,
} from "../src/curriculum";
import {
	buildQuickCheckOptions,
	checkQuickCheckAnswer,
} from "../src/exercises/checker";
import {
	ACADEMY_HOME_URL,
	lessonSourceUrl,
	parseLessonHash,
} from "../src/zam/zam-link";
import {
	clearProgress,
	freshProgress,
	getLessonProgress,
	isLessonComplete,
	loadProgress,
	parseProgress,
	REQUIRED_CORRECT_PER_LEVEL,
	REQUIRED_LAB_GOALS,
	recordExerciseSuccess,
	recordLabGoals,
	recordQuizSolved,
	STORAGE_KEY,
	saveProgress,
} from "../src/storage/progress";

function createMemoryStorage(): Storage {
	const store = new Map<string, string>();
	return {
		get length() {
			return store.size;
		},
		clear() {
			store.clear();
		},
		getItem(key: string) {
			return store.get(key) ?? null;
		},
		key(index: number) {
			return [...store.keys()][index] ?? null;
		},
		removeItem(key: string) {
			store.delete(key);
		},
		setItem(key: string, value: string) {
			store.set(key, String(value));
		},
	};
}

describe("Local progress storage, ZAM deep-links, Lotta SVG & Lexikon", () => {
	const originalStorage = globalThis.localStorage;

	beforeEach(() => {
		Object.defineProperty(globalThis, "localStorage", {
			value: createMemoryStorage(),
			configurable: true,
			writable: true,
		});
	});

	afterEach(() => {
		Object.defineProperty(globalThis, "localStorage", {
			value: originalStorage,
			configurable: true,
			writable: true,
		});
	});

	it("recovers safely from corrupted payloads and unlocks stamp after single-pass completion", () => {
		expect(REQUIRED_CORRECT_PER_LEVEL).toBe(1);
		expect(REQUIRED_LAB_GOALS).toBe(3);

		const broken = parseProgress("{not-valid-json");
		expect(broken.corrupted).toBe(true);
		expect(broken.progress.schema).toBe(1);

		const wrongSchema = parseProgress(JSON.stringify({ schema: 99, lessons: {} }));
		expect(wrongSchema.corrupted).toBe(true);

		const lesson = LESSONS[3]; // wunderwerk-auge
		let p = freshProgress();
		p = recordQuizSolved(p, lesson.id, "2026-11-03T08:00:00Z").progress;
		p = recordLabGoals(
			p,
			lesson.id,
			lesson.lab.goals.map((g) => g.id),
			"2026-11-03T08:01:00Z",
		).progress;
		p = recordExerciseSuccess(p, {
			lessonId: lesson.id,
			lessonTitle: lesson.shortTitle,
			stageId: lesson.stageId,
			level: 1,
			promptSummary: "Stufe 1",
			helped: false,
			correctFirstTry: true,
			nowIso: "2026-11-03T08:02:00Z",
		}).progress;
		expect(isLessonComplete(getLessonProgress(p, lesson.id))).toBe(false);

		const finalStep = recordExerciseSuccess(p, {
			lessonId: lesson.id,
			lessonTitle: lesson.shortTitle,
			stageId: lesson.stageId,
			level: 2,
			promptSummary: "Stufe 2",
			helped: false,
			correctFirstTry: true,
			nowIso: "2026-11-03T08:03:00Z",
		});
		expect(finalStep.stampUnlocked).toBe(true);
		expect(
			isLessonComplete(getLessonProgress(finalStep.progress, lesson.id)),
		).toBe(true);
		expect(getLessonProgress(finalStep.progress, lesson.id).stampEarnedAt).toBe(
			"2026-11-03T08:03:00Z",
		);

		// Round-trip through localStorage
		expect(saveProgress(finalStep.progress)).toBe(true);
		expect(localStorage.getItem(STORAGE_KEY)).toContain("wunderwerk-auge");

		const loaded = loadProgress();
		expect(loaded.storageAvailable).toBe(true);
		expect(loaded.corrupted).toBe(false);
		expect(
			isLessonComplete(getLessonProgress(loaded.progress, lesson.id)),
		).toBe(true);
		expect(loaded.progress.recentEvidence).toHaveLength(2);

		expect(clearProgress()).toBe(true);
		expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
	});

	it("degrades gracefully when localStorage throws SecurityError", () => {
		Object.defineProperty(globalThis, "localStorage", {
			get() {
				throw new Error("SecurityError: storage disabled");
			},
			configurable: true,
		});
		const loaded = loadProgress();
		expect(loaded.storageAvailable).toBe(false);
		expect(loaded.progress.schema).toBe(1);
		expect(saveProgress(freshProgress())).toBe(false);
	});

	it("parses #lesson=<id> deep-links and rejects unknown lesson ids", () => {
		const knownIds = new Set(LESSONS.map((l) => l.id));
		expect(ACADEMY_HOME_URL).toBe("https://academy.zam-os.org/");
		for (const lesson of LESSONS) {
			expect(lessonSourceUrl(lesson.id)).toBe(
				`https://academy.zam-os.org/hsu-grundschule-4/#lesson=${lesson.id}`,
			);
			expect(parseLessonHash(`#lesson=${lesson.id}`, knownIds)).toBe(
				lesson.id,
			);
		}
		expect(parseLessonHash("#lesson=unbekannt", knownIds)).toBeNull();
		expect(parseLessonHash("#view=lexikon", knownIds)).toBeNull();
	});

	it("renders accessible SVGs for Lotta moods, stamps, and complete Lexikon reference tables", () => {
		for (const mood of ["curious", "celebrating", "encouraging", "resting"] as const) {
			expect(LOTTA_MESSAGES[mood].length).toBeGreaterThan(20);
			const svg = renderLottaSvg(mood);
			expect(svg).toContain("<svg");
			expect(svg).toContain('role="img"');
		}

		const lockedStamp = renderStampSvg("👁️", "Adlerauge", false, "#c24b38");
		expect(lockedStamp).toContain("noch offen");
		const earnedStamp = renderStampSvg("👁️", "Adlerauge", true, "#c24b38");
		expect(earnedStamp).toContain("freigeschaltet");

		expect(LEXIKON_GROUPS).toHaveLength(6);
		const totalEntries = LEXIKON_GROUPS.reduce(
			(sum, g) => sum + g.entries.length,
			0,
		);
		expect(totalEntries).toBeGreaterThanOrEqual(60);
		expect(REFERENCE_TABLES).toHaveLength(6);
		expect(REFERENCE_TABLES.map((t) => t.title).join(" ")).toContain(
			"Notruf 112",
		);
	});

	it("keeps Schlaufuchs-Check grading attached to explicit optionId markers when options shuffle", () => {
		for (const lesson of LESSONS) {
			const correctDisplayPositions = new Set<number>();
			for (let seed = 1; seed <= 30; seed++) {
				const presented = buildQuickCheckOptions(
					lesson.quickCheck,
					seed * 2654435761,
				);
				expect(presented).toHaveLength(3);
				expect(new Set(presented.map((o) => o.optionId))).toEqual(
					new Set([0, 1, 2]),
				);

				presented.forEach((opt, displayIdx) => {
					const graded = checkQuickCheckAnswer(
						lesson.quickCheck,
						opt.optionId,
					);
					expect(graded.correct).toBe(opt.isCorrect);
					if (opt.isCorrect) {
						correctDisplayPositions.add(displayIdx);
						expect(opt.text).toBe(
							lesson.quickCheck.options[lesson.quickCheck.correctIndex],
						);
						expect(graded.feedback).toContain(lesson.quickCheck.explanation);
					} else {
						expect(graded.feedback).toContain("Fast!");
					}
				});
			}
			expect(correctDisplayPositions.size).toBe(3);
		}
	});
});
