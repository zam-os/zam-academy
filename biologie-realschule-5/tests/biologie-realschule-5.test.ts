import { describe, expect, it, vi } from "vitest";
import tile from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import {
	armState,
	cellStructures,
	focusSharpness,
	freshLab,
	labGoals,
	ORGAN_SYSTEMS,
	totalMagnification,
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
import legacyMensch from "./fixtures/de-by-realschule-5-biologie-mensch-skelett-bewegung-organe-kvt.json";
import legacyNut from "./fixtures/de-by-realschule-5-natur-technik-mikroskop-experiment-dateien-kvt.json";
import legacyPflanzen from "./fixtures/de-by-realschule-5-biologie-pflanzen-bluetenbau-samen-kvt.json";
import contract from "./fixtures/public-contract.json";

describe("Course and card contract", () => {
	it("pins all lesson anchors and independently assigned IDs", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(25);
		expect(tile.version).toBe("2026.11.1");
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toHaveLength(24);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual([7, 4, 6, 8]);
		const ids = tile.atoms.flatMap((a) => [
			a.id,
			...a.practice_items.map((i) => i.id),
		]);
		expect(ids.sort()).toEqual(Object.values(contract.ids).sort());
		expect(new Set(ids).size).toBe(75);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(tile.published_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
		expect("retired_items" in tile).toBe(false);
		expect(
			tile.atoms.flatMap((a) => a.practice_items).some((i) => "replaces" in i),
		).toBe(false);
	});

	it("tracks every legacy item in replaces-de-by.json once with valid proposed slugs", () => {
		const allSlugs = tile.atoms.flatMap((a) =>
			a.practice_items.map((i) => i.slug),
		);
		const fixtureItemIds = [legacyMensch, legacyPflanzen, legacyNut].flatMap(
			(f) => f.atoms.flatMap((a) => a.practice_items.map((i) => i.id)),
		);
		const oldIds = mapping.rows.map((row) => row.de_by_id);
		expect(new Set(oldIds)).toEqual(new Set(fixtureItemIds));
		expect(oldIds).toHaveLength(fixtureItemIds.length);
		expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(5);
		expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(19);
		for (const row of mapping.rows) {
			if (row.category === "A") {
				expect(row.action).toBe("propose-replace-after-approval");
				expect(row.academy_slug).not.toBeNull();
				expect(
					allSlugs.filter((slug) => slug === row.academy_slug),
				).toHaveLength(1);
			} else {
				expect(row.category).toBe("C");
				expect(row.action).toBe("keep-active");
				expect(row.academy_slug).toBeNull();
			}
		}
	});

	it("keeps lessons aligned with curriculum coverage and atom metadata", () => {
		const stageIds = new Set(STAGES.map((s) => s.id));
		const sourceIds = new Set(SOURCES.map((s) => s.id));
		const atomIds = new Set(tile.atoms.map((a) => a.id));
		expect(tile.atoms).toHaveLength(LESSONS.length);
		expect(coverage.rows).toHaveLength(40);
		expect(coverage.optional_lessons).toEqual([]);
		expect(
			["1.1", "1.2", "1.3", "2", "3", "4"].map(
				(sec) => coverage.rows.filter((r) => r.section === sec).length,
			),
		).toEqual([11, 7, 3, 5, 5, 9]);

		const coveredLessons = new Set(coverage.rows.flatMap((r) => r.lessons));
		for (const lesson of LESSONS) {
			expect(stageIds.has(lesson.stage)).toBe(true);
			expect(coveredLessons.has(lesson.id)).toBe(true);
			expect(lesson.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
			expect(lesson.cases.length).toBeGreaterThanOrEqual(2);
			expect(lesson.quiz.wrong).toHaveLength(2);
			expect(lesson.tasks["1"].prompt).not.toBe(lesson.tasks["2"].prompt);
			const learnerTexts = [
				lesson.title,
				lesson.skill,
				...lesson.paragraphs,
				lesson.material,
				lesson.quiz.question,
				lesson.quiz.answer,
				...lesson.quiz.wrong,
				lesson.quiz.explanation,
				lesson.takeaway,
				...lesson.cases.flatMap((c) => [c.prompt, c.answer, c.feedback, ...c.options]),
				lesson.tasks["1"].prompt,
				lesson.tasks["1"].model,
				lesson.tasks["2"].prompt,
				lesson.tasks["2"].model,
			];
			for (const txt of learnerTexts) {
				expect(txt).not.toMatch(/\d\.\d/);
			}

			const atom = tile.atoms.find((a) => a.slug === lesson.id);
			expect(atom).toBeDefined();
			expect(atom?.typical_age_min).toBe(10);
			expect(atom?.source_link).toBe(
				`https://academy.zam-os.org/biologie-realschule-5/#lesson=${lesson.id}`,
			);
			for (const pre of atom?.prerequisites ?? []) {
				expect(atomIds.has(pre.atom_id)).toBe(true);
			}
			expect(
				atom?.curricula.filter((c) => c.provider === "lehrplanplus-bayern")
					.length,
			).toBe(lesson.bindings.length);
			for (const c of atom?.curricula ?? []) {
				if (c.provider === "lehrplanplus-bayern") {
					expect(c.school_type).toBe("realschule");
					expect(c.grade).toBe(5);
					expect(c.exam_relevant).toBe(false);
				}
			}
			for (const item of atom?.practice_items ?? []) {
				expect(item.source_link).toBe(atom?.source_link);
			}
		}
	});
});

describe("Biology 5 interactive lab models", () => {
	it("computes magnification, focus sharpness, cell structures and arm posture accurately", () => {
		expect(totalMagnification(10, 4)).toBe(40);
		expect(totalMagnification(10, 40)).toBe(400);
		expect(() => totalMagnification(15 as 10, 4)).toThrow();
		expect(() => totalMagnification(10, 20 as 4)).toThrow();

		expect(focusSharpness(4, 6)).toEqual({ target: 6, distance: 0, isSharp: true });
		expect(focusSharpness(40, 8)).toEqual({ target: 8, distance: 0, isSharp: true });
		expect(focusSharpness(40, 2)).toEqual({ target: 8, distance: 6, isSharp: false });
		expect(() => focusSharpness(4, 11)).toThrow();

		expect(cellStructures("plant")).toHaveLength(6);
		expect(cellStructures("animal")).toHaveLength(3);
		expect(() => cellStructures("bacteria" as "plant")).toThrow();

		expect(Object.keys(ORGAN_SYSTEMS)).toHaveLength(7);
		expect(ORGAN_SYSTEMS.nerven.regions).toEqual(["head", "spine"]);
		expect(ORGAN_SYSTEMS.ausscheidung.regions).toEqual(["abdomen", "pelvis"]);

		expect(armState(55).pose).toBe("gebeugt");
		expect(armState(55).biceps).toBe("spannt an (zieht den Unterarm hoch)");
		expect(armState(160).pose).toBe("gestreckt");
		expect(armState(160).triceps).toBe("spannt an (zieht den Unterarm gerade)");
		expect(() => armState(20)).toThrow();
	});

	it("starts every lab with all goals unreached and lets learners reach every goal", () => {
		const start = freshLab();
		for (const kind of ["microscope", "cellCompare", "torso", "armLever"] as const) {
			const initialGoals = labGoals(kind, start);
			expect(initialGoals).toHaveLength(3);
			expect(initialGoals.every((g) => !g.done)).toBe(true);
		}

		// Microscope witnesses
		expect(
			labGoals("microscope", { ...start, okular: 10, objektiv: 4, focus: 6 })[0]
				.done,
		).toBe(true);
		expect(
			labGoals("microscope", {
				...start,
				okular: 10,
				objektiv: 40,
				focus: 8,
			})[1].done,
		).toBe(true);
		expect(
			labGoals("microscope", { ...start, specimen: "cheek", focus: 6 })[2].done,
		).toBe(true);

		// Cell compare witnesses
		expect(
			labGoals("cellCompare", { ...start, cellType: "animal" })[0].done,
		).toBe(true);
		expect(
			labGoals("cellCompare", {
				...start,
				cellType: "plant",
				part: "zellwand",
			})[1].done,
		).toBe(true);
		expect(
			labGoals("cellCompare", { ...start, showCompare: true })[2].done,
		).toBe(true);

		// Torso witnesses
		expect(
			labGoals("torso", { ...start, system: "atmung" })[0].done,
		).toBe(true);
		expect(
			labGoals("torso", { ...start, system: "nerven" })[1].done,
		).toBe(true);
		expect(
			labGoals("torso", { ...start, showCoop: true })[2].done,
		).toBe(true);

		// Arm lever witnesses
		expect(
			labGoals("armLever", { ...start, angle: 55 })[0].done,
		).toBe(true);
		expect(
			labGoals("armLever", { ...start, angle: 160 })[1].done,
		).toBe(true);
		expect(
			labGoals("armLever", { ...start, showLabels: true })[2].done,
		).toBe(true);
	});
});

describe("Interactive cases, self-checked writing and storage resilience", () => {
	it("checks quiz options, cases, writing flow and completion", () => {
		const lesson = LESSONS[0];
		expect(quizOptions(lesson)).toHaveLength(3);
		expect(
			checkCases(
				lesson.cases,
				lesson.cases.map((c) => c.answer),
			).every(Boolean),
		).toBe(true);
		const p = freshProgress();
		updateDraft(p, lesson.id, 1, "zu kurz");
		expect(canReview(p.drafts[writingKey(lesson.id, 1)])).toBe(false);
		updateDraft(
			p,
			lesson.id,
			1,
			"Für das Messen von Zeit, Länge und Masse braucht man passende Messgeräte mit Einheit.",
		);
		expect(canReview(p.drafts[writingKey(lesson.id, 1)])).toBe(true);
		expect(
			canAccept(p.drafts[writingKey(lesson.id, 1)], [true, true, false]),
		).toBe(false);
		expect(
			canAccept(p.drafts[writingKey(lesson.id, 1)], [true, true, true]),
		).toBe(true);
		expect(completion(p)).toEqual({ completed: 0, total: 25 });
	});

	it("ignores corrupt browser storage and survives missing storage", async () => {
		const lesson = LESSONS[0];
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
			expect(await saveProgress(freshProgress())).toBe(false);
		} finally {
			vi.unstubAllGlobals();
		}
	});
});

describe("Safe routes and user text", () => {
	it("opens a card fragment and removes stale query routes", () => {
		expect(
			parseTrainingDeepLink(
				"#lesson=b5-mikroskop&level=2",
				"?lesson=b5-geraete&level=1",
			),
		).toEqual({ lessonId: "b5-mikroskop", level: 2 });
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=9")).toEqual({});
		expect(
			trainingBaseUrl(
				"/biologie-realschule-5/",
				"?lesson=b5-geraete&level=1&from=zam",
			),
		).toBe("/biologie-realschule-5/?from=zam");
	});

	it("escapes drafts and source labels", () => {
		expect(esc('<img src=x onerror="run()"> &')).toBe(
			"&lt;img src=x onerror=&quot;run()&quot;&gt; &amp;",
		);
	});
});
