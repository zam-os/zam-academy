import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import publication from "../publication.json";
import contract from "./fixtures/public-contract.json";
import official from "./fixtures/official-curriculum.json";
import legacy5 from "./fixtures/de-by-realschule-5-geographie-erde-gradnetz-orientierung-kvt.json";
import legacy6 from "./fixtures/de-by-realschule-6-geographie-deutschland-bayern-raum-kvt.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import {
	CAPITALS,
	fmt,
	MODEL_SCENARIOS,
	modelReady,
	realDistanceMeters,
	recordExploration,
	THEMATIC_POINTS,
	WORLD_PLACES,
} from "../src/models";
import {
	applyScenario,
	initialModelState,
	mapPoint,
	renderModel,
} from "../src/ui/models";
import {
	completion,
	freshProgress,
	isComplete,
	loadProgress,
	parseProgress,
	saveProgress,
	STORAGE_KEY,
	writingKey,
} from "../src/storage/progress";
import {
	canAcceptSelfAssessment,
	canReviewDraft,
	checkWorkshop,
	esc,
	initialOrder,
	moveEntry,
	shuffle,
} from "../src/workshop";
import {
	lessonLink,
	parseTrainingDeepLink,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";

const items = cell.atoms.flatMap((a) => a.practice_items);
const oldItems = [...legacy5.atoms, ...legacy6.atoms].flatMap(
	(a) => a.practice_items,
);
describe("official curriculum and authored content", () => {
	it("binds all 30 verbatim competences to the shared Grade 5 curriculum", () => {
		expect(publication.status).toBe("preview");
		expect(LESSONS).toHaveLength(31);
		expect(STAGES.map((s) => s.hours)).toEqual([8, 8, 10, 10, 8, 8, 4]);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.lb === s.lb).length),
		).toEqual([4, 5, 6, 5, 5, 3, 3]);
		expect(coverage.areas.flatMap((a) => a.competencies)).toHaveLength(30);
		const ids = coverage.areas.flatMap((a) =>
			a.competencies.flatMap((c) => c.lessons),
		);
		expect(new Set(ids)).toEqual(new Set(LESSONS.map((l) => l.id)));
		for (const a of coverage.areas) {
			expect(a.competencies.map((c) => c.competence)).toEqual(
				official.areas.find((o) => o.lb === a.lb)!.competences,
			);
			for (const c of a.competencies) {
				expect(c.evidence.length).toBeGreaterThan(50);
				expect(["implemented", "supported"]).toContain(c.status);
				for (const id of c.lessons)
					expect(LESSONS.some((l) => l.id === id)).toBe(true);
			}
		}
		expect(coverage.areas[3].competencies[3].status).toBe("supported");
		expect(coverage.areas[5].competencies[3].status).toBe("supported");
		expect(
			coverage.areas[6].competencies.every((c) => c.status === "supported"),
		).toBe(true);
	});
	it.each(LESSONS)(
		"has examples, sourced explanations and distinct writing levels: $id",
		(l) => {
			expect(l.paragraphs).toHaveLength(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(550);
			expect(l.paragraphs[1]).toContain("Beispiel");
			expect(l.takeaway.length).toBeGreaterThan(40);
			expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
			for (const id of l.sourceIds)
				expect(SOURCES.some((s) => s.id === id)).toBe(true);
			expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
			for (const t of Object.values(l.tasks)) {
				expect(t.model.length).toBeGreaterThan(150);
				expect(t.hints).toHaveLength(2);
				expect(t.criteria).toHaveLength(3);
			}
			const text = JSON.stringify({
				intro: l.intro,
				paragraphs: l.paragraphs,
				quiz: l.quiz,
				workshop: l.workshop,
				tasks: l.tasks,
			});
			expect(text).not.toMatch(/\d\.\d/);
			expect(text).not.toMatch(/<\/?[a-z]+[ >]/i);
			expect(text).not.toContain("Halb kugel");
			expect("teacherVideo" in l).toBe(false);
		},
	);
});
describe("workshop goals and self-assessment", () => {
	it.each(LESSONS)(
		"has reachable unsolved assignments and rejects malformed answers: $id",
		(l) => {
			const w = l.workshop;
			const correct = w.entries.map((e) => e.target);
			expect(w.entries.length).toBeGreaterThanOrEqual(3);
			expect(checkWorkshop(w, correct).every(Boolean)).toBe(true);
			for (const answer of [
				[],
				correct.map(() => -1),
				correct.map(() => 100),
				[...correct, 0],
			])
				expect(checkWorkshop(w, answer).every(Boolean)).toBe(false);
			for (const e of w.entries) {
				expect(w.categories[e.target]).toBeTruthy();
				expect(e.feedback.length).toBeGreaterThan(15);
			}
		},
	);
	it("preserves keyboard ordering, escaping and deliberate self-rating gates", () => {
		const order = [2, 0, 1];
		expect(moveEntry(order, 0, 1)).toEqual([0, 2, 1]);
		expect(order).toEqual([2, 0, 1]);
		expect(moveEntry(order, 0, -1)).toEqual(order);
		const w = {
			...LESSONS[0].workshop,
			kind: "timeline" as const,
			entries: LESSONS[0].workshop.entries.map((e, target) => ({
				...e,
				target,
			})),
		};
		expect(checkWorkshop(w, initialOrder(w, "test")).every(Boolean)).toBe(
			false,
		);
		expect(checkWorkshop(w, [0, 0, 0]).every(Boolean)).toBe(false);
		expect(
			new Set(LESSONS.map((l) => shuffle([0, 1, 2], l.id)[0])).size,
		).toBeGreaterThan(1);
		expect(canReviewDraft("kurz")).toBe(false);
		expect(
			canAcceptSelfAssessment("Eine eigene begründete Antwort.", [
				true,
				true,
				false,
			]),
		).toBe(false);
		expect(
			canAcceptSelfAssessment("Eine eigene begründete Antwort.", [
				true,
				true,
				true,
			]),
		).toBe(true);
		expect(esc('<script>"&')).toBe("&lt;script&gt;&quot;&amp;");
	});
});
describe("maps, model comparisons and arithmetic", () => {
	it("recalculates every scale-slider setting in both comparison modes", () => {
		for (let cm = 1; cm <= 8; cm++)
			for (const d of [25000, 50000])
				expect(realDistanceMeters(cm, d)).toBe(cm * (d === 25000 ? 250 : 500));
		expect(realDistanceMeters(8, 25000)).toBe(2000);
		expect(realDistanceMeters(1, 50000)).toBe(500);
		for (const [cm, d] of [
			[NaN, 50000],
			[1, Infinity],
			[-1, 25000],
			[1, 0],
		])
			expect(realDistanceMeters(cm, d)).toBe(0);
		expect(fmt(-23.5)).toBe("−23,5");
	});
	it("projects locations correctly and preserves the regional longitude correction", () => {
		for (const place of WORLD_PLACES) {
			const [x, y] = mapPoint(place.lon, place.lat, [-180, 180, -90, 90]);
			expect(x).toBeGreaterThan(30);
			expect(x).toBeLessThan(670);
			expect(y).toBeGreaterThan(25);
			expect(y).toBeLessThan(345);
		}
		const center = mapPoint(0, 0, [-180, 180, -90, 90]);
		expect(center).toEqual([350, 185]);
		const origin = mapPoint(10, 51, [5, 16, 47, 56]);
		const east = mapPoint(11, 51, [5, 16, 47, 56]);
		const north = mapPoint(10, 52, [5, 16, 47, 56]);
		expect((east[0] - origin[0]) / (origin[1] - north[1])).toBeCloseTo(
			Math.cos((51.5 * Math.PI) / 180),
		);
		expect(CAPITALS.slice(0, 16)).toHaveLength(16);
		expect(new Set(CAPITALS.map((c) => c[0])).size).toBe(22);
		expect(THEMATIC_POINTS.settlement).toHaveLength(3);
		expect(THEMATIC_POINTS.agriculture).toHaveLength(3);
	});

	it.each(["geo-deutschland", "geo-bayern", "geo-themenkarten"])(
		"keeps neighbouring land and the sea background in the same projected frame: %s",
		(id) => {
			const lesson = LESSONS.find((l) => l.id === id)!;
			const html = renderModel(lesson, [], initialModelState(lesson.model!));
			for (const code of ["NLD", "POL", "DNK", "FRA"])
				expect(html).toMatch(
					new RegExp(
						`<path data-map-country="${code}"[^>]*class="map-context"`,
					),
				);
			expect(html).toMatch(
				/<path data-map-country="DEU"[^>]*class="map-country"/,
			);
			expect(html).toContain('clip-path="url(#regional-map-frame)"');
			const water = html.match(/<rect[^>]*class="map-water"[^>]*>/)![0];
			const attribute = (name: string) =>
				Number(water.match(new RegExp(`${name}="([^" ]+)"`))![1]);
			expect(attribute("x")).toBeGreaterThan(200);
			expect(attribute("width")).toBeGreaterThan(280);
			expect(attribute("width")).toBeLessThan(300);
			expect(attribute("y")).toBe(25);
			expect(attribute("height")).toBe(380);
		},
	);
	it("anchors both sea labels within the actual regional window", () => {
		const lesson = LESSONS.find((l) => l.id === "geo-deutschland")!;
		const html = renderModel(lesson, [], initialModelState("germany"));
		for (const [id, lon, lat] of [
			["north-sea", 7, 54.6],
			["baltic-sea", 14.3, 54.8],
		] as const) {
			const tag = html.match(
				new RegExp(`<text[^>]*data-sea-label="${id}"[^>]*>`),
			)![0];
			const x = Number(tag.match(/ x="([^"]+)"/)![1]);
			const y = Number(tag.match(/ y="([^"]+)"/)![1]);
			expect([x, y]).toEqual(mapPoint(lon, lat, [5, 16, 47, 56]));
			expect(x).toBeGreaterThan(205);
			expect(x).toBeLessThan(495);
			expect(y).toBeGreaterThan(25);
			expect(y).toBeLessThan(105);
		}
	});
	it.each(LESSONS.filter((l) => l.model))(
		"makes all comparisons reachable and retains explicit model limits: $id",
		(l) => {
			const kind = l.model!;
			let visited: string[] = [];
			let state = initialModelState(kind);
			expect(modelReady(kind, visited)).toBe(false);
			expect(state.selected).toBe("");
			for (const s of MODEL_SCENARIOS[kind]) {
				visited = recordExploration(kind, visited, s.id);
				state = applyScenario(kind, state, s.id);
				expect(renderModel(l, visited, state)).not.toMatch(/NaN|undefined/);
			}
			expect(modelReady(kind, visited)).toBe(true);
			expect(recordExploration(kind, visited, "unknown")).toEqual(visited);
			expect(applyScenario(kind, state, "unknown")).toEqual(state);
			expect(renderModel(l, visited, state)).toContain(
				"Alle Vergleichssituationen geöffnet",
			);
			expect(renderModel(l, visited, state)).toContain(
				"nicht dein Verständnis",
			);
		},
	);
});
describe("local progress and deep links", () => {
	it("requires models as well as quiz, workshop and a self-assessed response", () => {
		const p = freshProgress(),
			l = LESSONS.find((l) => l.model)!;
		p.quizDone = [l.id];
		p.workshopDone = [l.id];
		p.writingDone = [writingKey(l.id, 1)];
		expect(isComplete(p, l.id)).toBe(false);
		p.explored[l.id] = MODEL_SCENARIOS[l.model!].map((s) => s.id);
		expect(isComplete(p, l.id)).toBe(true);
		expect(completion(p).total).toBe(31);
		expect(completion(p).completed).toBe(1);
		expect(STORAGE_KEY).toBe("geographie_rs5_academy_progress_v1");
	});
	it("keeps drafts separate by level and drops unknown or oversized data", () => {
		const p = freshProgress(),
			key = writingKey(p.activeLessonId, 1);
		p.drafts[key] = "x".repeat(9000);
		p.writingDone = [key];
		const parsed = parseProgress(
			JSON.stringify({
				...p,
				quizDone: [p.activeLessonId, "unknown"],
				drafts: { ...p.drafts, unknown: "secret" },
			}),
		);
		expect(parsed.drafts[key]).toHaveLength(8000);
		expect(parsed.drafts.unknown).toBeUndefined();
		expect(parsed.quizDone).toEqual([p.activeLessonId]);
		expect(parsed.drafts[writingKey(p.activeLessonId, 2)]).toBeUndefined();
		for (const raw of [null, "null", "[]", "broken", "12"])
			expect(parseProgress(raw)).toEqual(freshProgress());
	});
	it("remains usable when browser storage is unavailable", () => {
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
	it("opens every lesson and rejects malicious or invalid fragments", () => {
		for (const l of LESSONS)
			expect(parseTrainingDeepLink(`#lesson=${l.id}&level=2`)).toEqual({
				lessonId: l.id,
				level: 2,
			});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
		expect(
			parseTrainingDeepLink(
				"#lesson=geo-atlas&level=2",
				"?lesson=geo-stadt&level=1",
			),
		).toEqual({ lessonId: "geo-atlas", level: 2 });
	});
});
describe("cell contract and proposal-only history mapping", () => {
	it("pins stable generated identifiers and all 62 lesson source anchors", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms).toHaveLength(31);
		expect(items).toHaveLength(62);
		expect(
			cell.atoms.map((a) => ({
				id: a.id,
				slug: a.slug,
				lesson: a.source_link,
				items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((x) => x.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
		for (const l of LESSONS) {
			const atom = cell.atoms.find((a) => a.source_link === lessonLink(l.id))!;
			expect(atom.title).toBe(l.title);
			expect(
				atom.curricula.find((c) => c.provider === "lehrplanplus-bayern"),
			).toMatchObject({
				grade: 5,
				school_type: "realschule",
				subject: "geographie",
				topic_code: `lb${l.lb}`,
			});
			expect(atom.curricula.every((c) => !("track" in c))).toBe(true);
			for (const prereq of atom.prerequisites)
				expect(cell.atoms.some((a) => a.id === prereq.atom_id)).toBe(true);
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(lessonLink(l.id));
				expect(item.question).toBeTruthy();
				expect(item.concept).toBeTruthy();
			}
			const fast = atom.practice_items[0];
			expect(fast.fast_check?.options).toHaveLength(2);
			expect(fast.fast_check?.correct_index).toBe(0);
			expect(atom.practice_items[1].sample_solution).toBeTruthy();
		}
	});
	it("classifies every old item once without enabling any transfer or retirement", () => {
		expect(mapping.approved).toBeNull();
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.rows).toHaveLength(16);
		expect(new Set(mapping.rows.map((r) => r.de_by_id))).toEqual(
			new Set(oldItems.map((i) => i.id)),
		);
		expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(6);
		expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(10);
		expect("retired_items" in cell).toBe(false);
		expect(items.every((i) => !("replaces" in i))).toBe(true);
		for (const row of mapping.rows) {
			expect(row.reason.length).toBeGreaterThan(50);
			if (row.academy_slug)
				expect(items.filter((i) => i.slug === row.academy_slug)).toHaveLength(
					1,
				);
			if (row.category === "A")
				expect(row.action).toBe("propose-replace-after-approval");
		}
	});
});
