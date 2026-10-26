import { describe, expect, it, vi } from "vitest";
import tile from "../cell.json";
import coverage from "../coverage.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import {
	CYCLE,
	freshLab,
	growthSeries,
	immuneCurve,
	selectionSeries,
} from "../src/labs";
import {
	canAccept,
	canReview,
	checkCases,
	esc,
	quizOptions,
} from "../src/practice";
import {
	completion,
	freshProgress,
	isComplete,
	loadProgress,
	parseProgress,
	saveProgress,
	updateDraft,
	writingKey,
} from "../src/storage/progress";
import { parseTrainingDeepLink, trainingBaseUrl } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

describe("Course and card contract", () => {
	it("pins all lesson anchors and independently assigned IDs", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(30);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual([4, 6, 8, 5, 7]);
		const ids = tile.atoms.flatMap((a) => [
			a.id,
			...a.practice_items.map((i) => i.id),
		]);
		expect(ids.sort()).toEqual(Object.values(contract.ids).sort());
		expect(new Set(ids).size).toBe(90);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect("retired_items" in tile).toBe(false);
		expect(
			tile.atoms.flatMap((a) => a.practice_items).some((i) => "replaces" in i),
		).toBe(false);
	});
	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s links the exact teaching target to two cards",
		(_, lesson) => {
			expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(lesson.material.length).toBeGreaterThan(40);
			expect(lesson.takeaway.length).toBeGreaterThan(15);
			expect(SOURCES.map((s) => s.id)).toEqual(
				expect.arrayContaining(lesson.sourceIds),
			);
			expect(new Set(quizOptions(lesson)).size).toBe(3);
			expect(lesson.cases).toHaveLength(2);
			expect(
				checkCases(
					lesson.cases,
					lesson.cases.map((c) => c.answer),
				),
			).toEqual([true, true]);
			expect(checkCases(lesson.cases, [])).toEqual([false, false]);
			for (const c of lesson.cases) {
				expect(new Set(c.options).size).toBe(2);
				expect(c.options).toContain(c.answer);
				expect(c.feedback.length).toBeGreaterThan(20);
			}
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			for (const level of [1, 2] as const) {
				expect(lesson.tasks[level].criteria).toHaveLength(3);
				expect(lesson.tasks[level].hints).toHaveLength(2);
				expect(canReview(lesson.tasks[level].model)).toBe(true);
			}
			const atom = tile.atoms.find((a) => a.slug === lesson.id)!;
			expect(atom).toBeDefined();
			const [fast, recall] = atom.practice_items;
			expect([fast.question, fast.concept]).toEqual([
				lesson.quiz.question,
				lesson.quiz.answer,
			]);
			expect(recall.question.length).toBeGreaterThan(15);
			expect(recall.concept).toBe(lesson.takeaway);
			expect(recall.sample_solution).toBe(recall.concept);
			expect(fast.fast_check!.correct_index).toBe(0);
			expect(fast.fast_check!.options[fast.fast_check!.correct_index]).toBe(
				lesson.quiz.answer,
			);
			for (const item of atom.practice_items)
				expect(item.source_link).toBe(
					`https://academy.zam-os.org/biologie-realschule-8/#lesson=${lesson.id}`,
				);
			expect(
				atom.curricula.find((c) => c.provider === "lehrplanplus-bayern"),
			).toMatchObject({
				grade: 8,
				school_type: "realschule",
				subject: "biologie",
				topic_code: `lb${lesson.bindings[0]}`,
			});
		},
	);
	it("documents every indexed expectation without claiming digital mastery", () => {
		expect(coverage.rows).toHaveLength(46);
		expect(
			[...new Set(coverage.rows.flatMap((row) => row.lessons))].sort(),
		).toEqual(LESSONS.map((l) => l.id).sort());
		expect(
			new Set(coverage.rows.map((e) => `${e.section}.${e.position}`)).size,
		).toBe(46);
		for (const row of coverage.rows) {
			expect(["guided", "preparation"]).toContain(row.support);
			expect(row.additional.length).toBeGreaterThan(20);
			for (const id of row.lessons)
				expect(LESSONS.some((l) => l.id === id)).toBe(true);
		}
		expect(
			new Set(LESSONS.map((l) => quizOptions(l).indexOf(l.quiz.answer))).size,
		).toBe(3);
	});
});

describe("Fictional models distinguish mechanisms", () => {
	it("starts with a positive count and distinguishes finite model capacity", () => {
		expect(growthSeries(0, false)).toEqual([1]);
		expect(growthSeries(8, false).at(-1)).toBe(256);
		expect(growthSeries(8, true).at(-1)).toBe(50);
		expect(() => growthSeries(9, false)).toThrow();
		expect(() => growthSeries(NaN, false)).toThrow();
	});
	it("selection responds to environment while not creating an absent variant", () => {
		expect(selectionSeries(50, "neutral", 8)).toEqual(Array(9).fill(50));
		expect(selectionSeries(50, "dark", 1)[1]).toBeCloseTo(200 / 3);
		expect(selectionSeries(50, "light", 1)[1]).toBeCloseTo(100 / 3);
		expect(selectionSeries(0, "dark", 8)).toEqual(Array(9).fill(0));
		expect(selectionSeries(100, "light", 8)).toEqual(Array(9).fill(100));
		expect(() => selectionSeries(-1, "neutral", 2)).toThrow();
		expect(() => selectionSeries(20, "neutral", 2.5)).toThrow();
	});
	it("passive response decays while a memory response begins earlier", () => {
		const first = immuneCurve("first"),
			memory = immuneCurve("memory"),
			passive = immuneCurve("passive");
		expect(first).toHaveLength(13);
		expect(memory[1]).toBeGreaterThan(first[1]);
		expect(passive[0]).toBe(100);
		expect(passive.every((v, i) => i === 0 || v < passive[i - 1])).toBe(true);
		expect(
			[...first, ...memory, ...passive].every((v) => v >= 0 && v <= 100),
		).toBe(true);
	});
	it("presents cycle stages without personal dates or a fertility calculation", () => {
		expect(CYCLE.map((p) => p.title)).toEqual([
			"Follikelreifung",
			"Eisprung",
			"Gelbkörperphase",
			"Ohne Schwangerschaft",
		]);
		expect(CYCLE[1].detail).toContain("LH");
		expect(freshLab()).toMatchObject({ phase: 0, steps: 6 });
	});
});

describe("Progress requires work and keeps levels independent", () => {
	const lesson = LESSONS[0];
	const ready = () => {
		const p = freshProgress();
		p.quizDone.push(lesson.id);
		p.cases[lesson.id] = lesson.cases.map((c) => c.answer);
		updateDraft(
			p,
			lesson.id,
			1,
			"Meine eigene Antwort mit einer nachvollziehbaren Begründung.",
		);
		p.writingDone.push(writingKey(lesson.id, 1));
		return p;
	};
	it("needs every component and resets only an edited answer", () => {
		const p = ready();
		expect(isComplete(p, lesson.id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, total: 30 });
		expect(isComplete(p, lesson.id, 2)).toBe(false);
		updateDraft(
			p,
			lesson.id,
			2,
			"Ein eigener Vergleich auf der zweiten Aufgabenstufe.",
		);
		p.writingDone.push(writingKey(lesson.id, 2));
		updateDraft(
			p,
			lesson.id,
			1,
			"Ein überarbeiteter Text benötigt einen neuen Vergleich.",
		);
		expect(isComplete(p, lesson.id, 1)).toBe(false);
		expect(isComplete(p, lesson.id, 2)).toBe(true);
		p.cases[lesson.id][0] = "wrong";
		expect(isComplete(p, lesson.id, 2)).toBe(false);
	});
	it("requires three affirmed criteria without treating length as correctness", () => {
		expect(canAccept("Eine eigene längere Antwort.", [true, true, true])).toBe(
			true,
		);
		expect(canAccept("Eine eigene längere Antwort.", [true, false, true])).toBe(
			false,
		);
		expect(canAccept("Eine eigene längere Antwort.", [])).toBe(false);
		expect(canAccept("kurz", [true, true, true])).toBe(false);
	});
	it.each(["{", "null", "[]", "7"])(
		"recovers from corrupt storage %s",
		(raw) => {
			expect(parseProgress(raw)).toEqual(freshProgress());
		},
	);
	it("sanitises stored foreign lesson keys and invalid evidence", () => {
		const key = writingKey(lesson.id, 1);
		const p = parseProgress(
			JSON.stringify({
				level: 9,
				quizDone: [lesson.id, lesson.id, "other"],
				cases: { [lesson.id]: ["<script>", 123] },
				drafts: { [key]: "" },
				writingDone: [key, "other"],
			}),
		);
		expect(p.level).toBe(1);
		expect(p.quizDone).toEqual([lesson.id]);
		expect(p.writingDone).toEqual([]);
		expect(isComplete(p, lesson.id)).toBe(false);
	});
	it("continues when browser storage is blocked", () => {
		vi.stubGlobal("localStorage", {
			getItem() {
				throw Error("blocked");
			},
			setItem() {
				throw Error("blocked");
			},
		});
		try {
			expect(loadProgress()).toEqual(freshProgress());
			expect(saveProgress(freshProgress())).toBe(false);
		} finally {
			vi.unstubAllGlobals();
		}
	});
});

describe("Safe routes and user text", () => {
	it("opens a card fragment and removes stale query routes", () => {
		expect(
			parseTrainingDeepLink(
				"#lesson=b8-hiv&level=2",
				"?lesson=b8-viren&level=1",
			),
		).toEqual({ lessonId: "b8-hiv", level: 2 });
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=9")).toEqual({});
		expect(
			trainingBaseUrl(
				"/biologie-realschule-8/",
				"?lesson=b8-viren&level=1&from=zam",
			),
		).toBe("/biologie-realschule-8/?from=zam");
	});
	it("escapes drafts and source labels", () => {
		expect(esc('<img src=x onerror="run()"> &')).toBe(
			"&lt;img src=x onerror=&quot;run()&quot;&gt; &amp;",
		);
	});
});
