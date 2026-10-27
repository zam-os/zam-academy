import { describe, expect, it, vi } from "vitest";
import tile from "../cell.json";
import coverage from "../coverage.json";
import curriculum from "../curriculum.json";
import mapping from "../replaces-de-by.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import countries from "../src/data/countries.json";
import {
	developmentIndex,
	freshLab,
	goals,
	type LabKind,
	MAPS,
	perCapita,
	priceShares,
	RAIN,
	renderLab,
	waterBalance,
} from "../src/labs";
import {
	canAccept,
	canReview,
	checkCases,
	esc,
	quizOptions,
} from "../src/practice";
import {
	freshProject,
	PROJECT_FIELDS,
	projectReady,
	sanitizeProject,
	sourceUrl,
	validProjectDate,
} from "../src/project";
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
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-realschule-8-geographie-tropen-regenwald-passat-wuesten-kvt.json";
import contract from "./fixtures/public-contract.json";

function required<T>(value: T | undefined): T {
	if (value === undefined) throw new Error("Missing expected fixture entry");
	return value;
}

describe("Official curriculum and lasting public contract", () => {
	it("covers every mandatory expectation, preserving its official wording and order", () => {
		expect(curriculum.expectations).toHaveLength(37);
		expect(coverage.rows).toHaveLength(34);
		expect(
			coverage.rows.map(({ section, position, competence }) => ({
				section,
				position,
				competence,
			})),
		).toEqual(curriculum.expectations.filter((e) => e.section !== "6"));
		expect(coverage.optional_curriculum).toEqual(
			curriculum.expectations.filter((e) => e.section === "6"),
		);
		expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(
			new Set(LESSONS.map((l) => l.id)),
		);
		for (const row of coverage.rows)
			for (const id of row.lessons)
				expect(LESSONS.some((l) => l.id === id)).toBe(true);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual([12, 9, 4, 7, 2]);
		expect(
			curriculum.areas.slice(0, 5).map((a) => ("hours" in a ? a.hours : null)),
		).toEqual([17, 17, 6, 12, 4]);
	});
	it("pins generated ULIDs and lesson anchors without transferring uncertain histories", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(tile.tile_id).toBe(ZAM_CELL_ID);
		const ids = tile.atoms.flatMap((a) => [
			a.id,
			...a.practice_items.map((i) => i.id),
		]);
		expect(new Set(ids).size).toBe(102);
		expect([...ids].sort()).toEqual(Object.values(contract.ids).sort());
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(tile.atoms).toHaveLength(34);
		expect(tile.atoms.flatMap((a) => a.practice_items)).toHaveLength(68);
		expect("retired_items" in tile).toBe(false);
		expect(
			tile.atoms.flatMap((a) => a.practice_items).some((i) => "replaces" in i),
		).toBe(false);
		expect(mapping.approved).toBeNull();
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.rows.map((r) => r.de_by_id).sort()).toEqual(
			legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id)).sort(),
		);
		expect(
			mapping.rows.every((r) => r.category === "C" && r.academy_slug === null),
		).toBe(true);
	});
	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s teaches, checks and links the same target",
		(_, lesson) => {
			expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(400);
			expect(lesson.takeaway.length).toBeGreaterThan(40);
			for (const id of lesson.sourceIds)
				expect(
					SOURCES.some((s) => s.id === id && s.url.startsWith("https://")),
				).toBe(true);
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
				expect(c.feedback.length).toBeGreaterThan(25);
			}
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			for (const level of [1, 2] as const) {
				const task = lesson.tasks[level];
				expect(task.model.length).toBeGreaterThan(100);
				expect(task.criteria).toHaveLength(3);
				expect(task.hints).toHaveLength(2);
			}
			const atom = required(tile.atoms.find((a) => a.slug === lesson.id));
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(
				atom.curricula.find((c) => c.provider === "lehrplanplus-bayern"),
			).toMatchObject({
				school_type: "realschule",
				subject: "geographie",
				grade: 8,
				topic_code: `lb${lesson.bindings[0]}`,
			});
			const [fast, recall] = atom.practice_items;
			expect(fast.question).toBe(lesson.quiz.question);
			expect(fast.concept).toBe(lesson.quiz.answer);
			expect(
				required(fast.fast_check).options[
					required(fast.fast_check).correct_index
				],
			).toBe(fast.concept);
			expect(recall.sample_solution).toBeTruthy();
			expect(recall.question).not.toBe(fast.question);
			for (const item of atom.practice_items)
				expect(item.source_link).toBe(lessonLink(lesson.id));
		},
	);
});

describe("Models show mechanisms and their boundaries", () => {
	it("preserves the one-step water balance with independently calculated witnesses", () => {
		expect(waterBalance(0).end).toBe(110);
		expect(waterBalance(10).end).toBe(100);
		expect(waterBalance(40).end).toBe(70);
		for (let n = 0; n <= 40; n++) {
			const w = waterBalance(n);
			expect(w.start + w.inflow - w.evaporation - w.withdrawal).toBe(w.end);
		}
		for (const n of [-1, 41, NaN, Infinity])
			expect(() => waterBalance(n)).toThrow();
	});
	it("price shares always sum to 100 while manufacturing and trade offset", () => {
		expect(priceShares(20)).toEqual([10, 20, 10, 20, 40]);
		for (let n = 10; n <= 50; n++) {
			const shares = priceShares(n);
			expect(shares.reduce((a, b) => a + b, 0)).toBe(100);
			expect(shares.every((x) => x >= 0)).toBe(true);
		}
		expect(() => priceShares(51)).toThrow();
	});
	it("a weak development dimension cannot be linearly replaced", () => {
		expect(developmentIndex(0.8, 0.8, 0.8)).toBeCloseTo(0.8);
		expect(developmentIndex(1, 1, 0.1)).toBeCloseTo(Math.cbrt(0.1));
		expect(developmentIndex(0.8, 0.8, 0.2)).toBeLessThan(0.6);
		expect(() => developmentIndex(0, 0.8, 0.8)).toThrow();
		expect(() => developmentIndex(0.8, NaN, 0.8)).toThrow();
		expect(perCapita(600, 20)).toBe(30000);
		expect(perCapita(900, 60)).toBe(15000);
		expect(() => perCapita(600, 0)).toThrow();
	});
	it("maps have independent geographical witnesses and explicit projection limits", () => {
		expect(
			required(MAPS.america.points.find((p) => p.id === "andes")).lon,
		).toBeLessThan(
			required(MAPS.america.points.find((p) => p.id === "amazon")).lon,
		);
		expect(
			required(MAPS.asia.points.find((p) => p.id === "himalaya")).lat,
		).toBeGreaterThan(
			required(MAPS.asia.points.find((p) => p.id === "ganges")).lat,
		);
		expect(
			required(MAPS.russia.points.find((p) => p.id === "aral")).note,
		).toContain("nicht in Russland");
		for (const kind of ["america", "asia", "russia"] as const) {
			const markup = renderLab(kind, freshLab());
			expect(markup).toContain("nicht flächentreu");
			expect(markup).toContain("Natural Earth");
			expect(markup).not.toMatch(/NaN|Infinity/);
		}
	});
	it("places the Andes orientation point on the Altiplano within the shipped land polygons", () => {
		const andes = required(MAPS.america.points.find((p) => p.id === "andes"));
		const bolivia = required(
			countries.find((country) => country.code === "BOL"),
		);
		const inRing = (lon: number, lat: number, ring: number[][]) => {
			let inside = false;
			for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
				const [xi, yi] = ring[i];
				const [xj, yj] = ring[j];
				if (
					yi > lat !== yj > lat &&
					lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi
				)
					inside = !inside;
			}
			return inside;
		};
		// Bolivia is a Polygon; its outer ring contains this Altiplano point,
		// while the former Pacific coordinate must remain outside.
		expect(bolivia.geometry.type).toBe("Polygon");
		const rings = bolivia.geometry.coordinates as number[][][];
		expect(inRing(andes.lon, andes.lat, rings[0])).toBe(true);
		expect(
			rings.slice(1).some((ring) => inRing(andes.lon, andes.lat, ring)),
		).toBe(false);
		expect(inRing(-72, -20, rings[0])).toBe(false);
	});
	it("requires unchanged total output for the population-only comparison", () => {
		expect(
			goals("stats", { ...freshLab(), changed: true, population: 60 }),
		).toEqual([true, false]);
		expect(
			goals("stats", {
				...freshLab(),
				changed: true,
				total: 900,
				population: 60,
			}),
		).toEqual([false, true]);
	});
	it("all model goals start open and have a reachable witness", () => {
		const kinds: LabKind[] = [
			"america",
			"asia",
			"russia",
			"monsoon",
			"water",
			"chain",
			"hdi",
			"stats",
		];
		for (const kind of kinds)
			expect(goals(kind, freshLab())).toEqual([false, false]);
		for (const kind of ["america", "asia", "russia"] as const) {
			const state = freshLab();
			state.visited = MAPS[kind].points.slice(0, 3).map((p) => p.id);
			expect(goals(kind, state)).toEqual([true, true]);
		}
		expect(goals("monsoon", { ...freshLab(), season: "summer" })[0]).toBe(true);
		expect(goals("monsoon", { ...freshLab(), season: "winter" })[1]).toBe(true);
		for (const [kind, first, second] of [
			["water", { withdrawal: 10 }, { withdrawal: 20 }],
			["chain", { share: 30 }, { share: 50 }],
			["hdi", { income: 0.8 }, { education: 0.2 }],
			["stats", { population: 60 }, { total: 900, population: 60 }],
		] as const) {
			expect(goals(kind, { ...freshLab(), ...first, changed: true })[0]).toBe(
				true,
			);
			expect(goals(kind, { ...freshLab(), ...second, changed: true })[1]).toBe(
				true,
			);
		}
		expect(RAIN.summer.slice(5, 9).reduce((a, b) => a + b, 0)).toBe(1000);
		expect(RAIN.summer).toHaveLength(12);
		expect(RAIN.winter).toHaveLength(12);
	});
});

describe("Progress requires actual answers and keeps the two levels separate", () => {
	const lesson = LESSONS[0];
	const ready = () => {
		const p = freshProgress();
		p.quizDone = [lesson.id];
		p.cases[lesson.id] = lesson.cases.map((c) => c.answer);
		p.drafts[writingKey(lesson.id, 1)] =
			"Meine selbst geschriebene Antwort ist hier dokumentiert.";
		p.writingDone = [writingKey(lesson.id, 1)];
		return p;
	};
	it("requires all steps and invalidates changed written evidence", () => {
		const p = ready();
		expect(isComplete(p, lesson.id, 1)).toBe(true);
		expect(isComplete(p, lesson.id, 2)).toBe(false);
		expect(completion(p).completed).toBe(1);
		updateDraft(
			p,
			lesson.id,
			1,
			"Eine neue Antwort mit genügend eigenem Text.",
		);
		expect(isComplete(p, lesson.id)).toBe(false);
		const bad = ready();
		bad.cases[lesson.id] = [];
		expect(isComplete(bad, lesson.id)).toBe(false);
		expect(canAccept("Viel zu kurz", [true, true, true])).toBe(false);
		expect(canAccept("Ein hinreichend langer eigener Text", [true, true])).toBe(
			false,
		);
		expect(canReview(" ")).toBe(false);
	});
	it("bounds and filters stored data and tolerates unavailable storage", () => {
		expect(parseProgress("{broken")).toEqual(freshProgress());
		const p = parseProgress(
			JSON.stringify({
				level: 2,
				quizDone: [lesson.id, lesson.id, "unknown"],
				drafts: { [writingKey(lesson.id, 2)]: "a".repeat(9000), unknown: "x" },
				cases: { [lesson.id]: ["unknown"] },
				writingDone: ["unknown"],
			}),
		);
		expect(p.level).toBe(2);
		expect(p.quizDone).toEqual([lesson.id]);
		expect(p.drafts[writingKey(lesson.id, 2)]).toHaveLength(8000);
		expect(p.cases[lesson.id][0]).toBe("");
		expect(p.writingDone).toEqual([]);
		vi.stubGlobal("localStorage", {
			getItem() {
				throw Error("blocked");
			},
			setItem() {
				throw Error("blocked");
			},
		});
		expect(loadProgress()).toEqual(freshProgress());
		expect(saveProgress(ready())).toBe(false);
		vi.unstubAllGlobals();
		expect(esc('<script>"&')).toBe("&lt;script&gt;&quot;&amp;");
	});
});

describe("The real project is separate from fictional exercises", () => {
	it("validates real calendar dates and distinct safe web addresses", () => {
		expect(validProjectDate("2026-02-29", "2026-10-26")).toBe(false);
		expect(validProjectDate("2024-02-29", "2026-10-26")).toBe(true);
		expect(validProjectDate("2026-10-27", "2026-10-26")).toBe(false);
		expect(sourceUrl("javascript:alert(1)")).toBeNull();
		expect(sourceUrl("https://user:secret@example.org")).toBeNull();
		expect(sourceUrl("https://example.org/a#x")).toBe("https://example.org/a");
		expect(
			sanitizeProject({ place: "x".repeat(5000), unknown: "x" }).place,
		).toHaveLength(4000);
		expect(projectReady(freshProject(), "judgment")).toBe(false);
	});
	it("a full formal notebook is required for the project completion, without claiming a checked presentation", () => {
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2026-10-26T12:00:00Z"));
		try {
			const project = freshProject();
			for (const key of Object.keys(
				PROJECT_FIELDS,
			) as (keyof typeof PROJECT_FIELDS)[])
				project[key] = "Ein selbst recherchierter und belegter Text ".repeat(5);
			project.eventDate =
				project.sourceADate =
				project.sourceBDate =
					"2026-10-20";
			project.sourceA = "https://example.org/a";
			project.sourceB = "https://example.org/b";
			expect(projectReady(project, "judgment")).toBe(true);
			project.sourceB = "https://example.org/a#copy";
			expect(projectReady(project, "judgment")).toBe(false);
			const p = freshProgress();
			const l = required(LESSONS.find((l) => l.projectStep === "judgment"));
			p.quizDone = [l.id];
			p.cases[l.id] = l.cases.map((c) => c.answer);
			p.drafts[writingKey(l.id, 1)] =
				"Meine eigene ausführliche Antwort zur tatsächlichen Recherche.";
			p.writingDone = [writingKey(l.id, 1)];
			expect(isComplete(p, l.id)).toBe(false);
		} finally {
			vi.useRealTimers();
		}
	});
});

describe("Lesson links remain usable online and offline", () => {
	it("accepts only known-shaped routes and does not resurrect query lessons", () => {
		expect(parseTrainingDeepLink("#lesson=g8-monsun&level=2")).toEqual({
			lessonId: "g8-monsun",
			level: 2,
		});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
		expect(
			trainingBaseUrl("/index.html", "?lesson=g8-monsun&level=2&other=x"),
		).toBe("/index.html?other=x");
	});
});
