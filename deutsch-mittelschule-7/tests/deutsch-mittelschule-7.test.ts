import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { LESSONS, lessonsForTrack, SOURCES, STAGES } from "../src/curriculum";
import rawLessons from "../src/curriculum/lessons.json";
import { canAccept, canReview, checkCases, esc, quizOptions } from "../src/practice";
import {
	completion,
	freshProgress,
	isComplete,
	loadProgress,
	parseProgress,
	STORAGE_KEY,
	saveProgress,
	updateDraft,
	writingKey,
} from "../src/storage/progress";
import { parseTrainingDeepLink, trainingBaseUrl } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/;
const BASE_URL = "https://academy.zam-os.org/deutsch-mittelschule-7/";

describe("Curriculum und gepinnte Vertrags-IDs (Deutsch Mittelschule 7)", () => {
	it("keeps exact lesson count, stage distribution, tracks and pinned ULIDs", () => {
		expect(LESSONS).toHaveLength(37);
		expect(lessonsForTrack("all")).toHaveLength(37);
		expect(lessonsForTrack("R")).toHaveLength(36);
		expect(lessonsForTrack("M")).toHaveLength(36);
		expect(STAGES.map((s) => s.id)).toEqual([
			"sprechen",
			"lesen",
			"schreiben",
			"sprache",
		]);
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);

		const contractIds = contract.ids as Record<string, string>;
		for (const lesson of LESSONS) {
			const atom = cell.atoms.find((a) => a.slug === lesson.id);
			expect(atom).toBeDefined();
			if (!atom) continue;
			expect(atom.id).toMatch(ULID_RE);
			expect(atom.id).toBe(contractIds[`atom:${lesson.id}`]);
			expect(atom.practice_items).toHaveLength(2);
			for (const item of atom.practice_items) {
				expect(item.id).toMatch(ULID_RE);
				expect(item.id).toBe(contractIds[item.slug]);
				expect(item.source_link).toBe(`${BASE_URL}#lesson=${lesson.id}`);
			}
		}
		expect(new Set(Object.values(contractIds)).size).toBe(111);
	});

	it("ensures every lesson has distinct levels, sources, cases and ZAM distractors", () => {
		const validSources = new Set(SOURCES.map((s) => s.id));
		for (const lesson of LESSONS) {
			expect(lesson.tracks.length).toBeGreaterThanOrEqual(1);
			for (const track of lesson.tracks) {
				expect(["R", "M"]).toContain(track);
			}
			for (const sourceId of lesson.sourceIds) {
				expect(validSources.has(sourceId)).toBe(true);
			}
			expect(new Set(quizOptions(lesson)).size).toBe(3);
			expect(lesson.quiz.explanation.length).toBeGreaterThan(30);
			expect(lesson.cases).toHaveLength(2);
			for (const c of lesson.cases) {
				expect(c.options).toContain(c.answer);
				expect(new Set(c.options).size).toBe(c.options.length);
				expect(c.feedback.length).toBeGreaterThan(20);
			}
			expect(
				checkCases(
					lesson.cases,
					lesson.cases.map((c) => c.answer),
				),
			).toEqual([true, true]);
			expect(
				checkCases(
					lesson.cases,
					lesson.cases.map((c) => c.options.find((o) => o !== c.answer) ?? ""),
				),
			).toEqual([false, false]);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
			expect(lesson.tasks[1].criteria).not.toEqual(lesson.tasks[2].criteria);
			for (const level of [1, 2] as const) {
				expect(lesson.tasks[level].criteria).toHaveLength(3);
				expect(canReview(lesson.tasks[level].model)).toBe(true);
			}

			const atom = cell.atoms.find((a) => a.slug === lesson.id);
			if (!atom) throw new Error("Missing atom");
			const [fast, recall] = atom.practice_items;
			expect(fast.question).toBe(lesson.quiz.question);
			expect(fast.concept).toBe(lesson.quiz.answer);
			expect(fast.fast_check?.correct_index).toBe(0);
			expect(fast.choice_distractors).toHaveLength(2);
			expect(recall.sample_solution).toBe(recall.concept);
			expect(recall.choice_distractors).toHaveLength(2);

			const lp = atom.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
			for (const entry of lp) {
				expect(entry).toMatchObject({
					school_type: "mittelschule",
					grade: 7,
					subject: "deutsch",
				});
				expect(lesson.tracks).toContain(entry.track);
			}
		}
	});

	it("keeps card text only in cell.json and maintains acyclic track-safe prerequisites", () => {
		expect(
			(rawLessons as Array<Record<string, unknown>>).every(
				(l) => !("quiz" in l) && !("recall" in l),
			),
		).toBe(true);

		const atomIndex = new Map(cell.atoms.map((a, idx) => [a.id, idx]));
		const lessonBySlug = new Map(LESSONS.map((l) => [l.id, l]));
		for (const atom of cell.atoms) {
			const idx = atomIndex.get(atom.id) ?? -1;
			const lesson = lessonBySlug.get(atom.slug);
			for (const prereq of atom.prerequisites) {
				const depAtom = cell.atoms.find((a) => a.id === prereq.atom_id);
				expect(depAtom).toBeDefined();
				if (!depAtom || !lesson) continue;
				const depLesson = lessonBySlug.get(depAtom.slug);
				expect(depLesson).toBeDefined();
				expect((atomIndex.get(prereq.atom_id) ?? 999) < idx).toBe(true);
				for (const track of lesson.tracks) {
					expect(depLesson?.tracks).toContain(track);
				}
			}
		}

		const serialized = JSON.stringify(rawLessons) + JSON.stringify(cell);
		expect(serialized).not.toMatch(/realschule/i);
		expect(serialized).not.toMatch(/\bundefined\b/);
		expect(serialized).not.toMatch(/\bNaN\b/);
	});

	it("covers all 142 R/M LehrplanPLUS expectations and keeps proposal-only mapping clean", () => {
		expect(coverage.rows).toHaveLength(142);
		const byId = new Map(LESSONS.map((l) => [l.id, l]));
		const covered = new Set<string>();
		for (const row of coverage.rows) {
			expect(["R", "M"]).toContain(row.track);
			expect(["implemented", "supported"]).toContain(row.status);
			expect(row.lessons.length).toBeGreaterThan(0);
			for (const id of row.lessons) {
				const l = byId.get(id);
				expect(l).toBeDefined();
				expect(l?.tracks).toContain(row.track);
				expect(l?.bindings).toContain(row.lb);
				covered.add(id);
			}
		}
		expect([...covered].sort()).toEqual(LESSONS.map((l) => l.id).sort());

		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.sources).toEqual([]);
		expect(mapping.rows).toEqual([]);
	});

	it("varies answer positions across both quick checks and interactive cases", () => {
		expect(
			new Set(LESSONS.map((l) => quizOptions(l).indexOf(l.quiz.answer))).size,
		).toBe(3);
		expect(
			new Set(
				LESSONS.flatMap((l) => l.cases.map((c) => c.options.indexOf(c.answer))),
			).size,
		).toBe(3);
	});
});

describe("Fortschritt, Track-Filter und Navigation (Mittelschule 7)", () => {
	const lesson = LESSONS[0];
	function completed() {
		const p = freshProgress();
		p.quizDone.push(lesson.id);
		p.cases[lesson.id] = lesson.cases.map((c) => c.answer);
		updateDraft(
			p,
			lesson.id,
			1,
			"Meine eigene ausfuehrliche Antwort mit einer klaren Begruendung.",
		);
		p.writingDone.push(writingKey(lesson.id, 1));
		return p;
	}

	it("uses a dedicated STORAGE_KEY and computes track-filtered completion cleanly", () => {
		expect(STORAGE_KEY).toBe("deutsch_ms7_progress_v1");
		const p = completed();
		expect(isComplete(p, lesson.id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, total: 37 });
		expect(completion({ ...p, track: "R" })).toEqual({ completed: 1, total: 36 });
		expect(completion({ ...p, track: "M" })).toEqual({ completed: 1, total: 36 });
		p.level = 2;
		expect(isComplete(p, lesson.id)).toBe(false);
	});

	it("keeps level separation, handles invalid storage and blocked localStorage safely", async () => {
		const p = completed();
		expect(canAccept("Eine ausreichend lange eigene Antwort.", [true, true, false])).toBe(
			false,
		);
		expect(canAccept("Eine ausreichend lange eigene Antwort.", [true, true, true])).toBe(
			true,
		);
		expect(parseProgress("{")).toEqual(freshProgress());
		expect(parseProgress(JSON.stringify({ level: 9, track: "Z" }))).toEqual(
			freshProgress(),
		);
		const restored = parseProgress(JSON.stringify(p));
		expect(restored).toEqual(p);

		vi.stubGlobal("localStorage", {
			getItem() {
				throw new Error("blocked");
			},
			setItem() {
				throw new Error("blocked");
			},
		});
		try {
			expect(loadProgress()).toEqual(freshProgress());
			expect(await saveProgress(freshProgress())).toBe(false);
		} finally {
			vi.unstubAllGlobals();
		}
	});

	it("parses deep links, builds clean base URLs and escapes markup", () => {
		expect(
			parseTrainingDeepLink(
				"#lesson=zitate-und-textuebernahmen&level=2",
				"?lesson=zuhoeren-und-notizen&level=1",
			),
		).toEqual({ lessonId: "zitate-und-textuebernahmen", level: 2 });
		expect(
			trainingBaseUrl(
				"/deutsch-mittelschule-7/",
				"?lesson=zuhoeren-und-notizen&level=2&from=zam",
			),
		).toBe("/deutsch-mittelschule-7/?from=zam");
		expect(esc('<img src=x onerror="run()"> &')).toBe(
			"&lt;img src=x onerror=&quot;run()&quot;&gt; &amp;",
		);
	});
});
