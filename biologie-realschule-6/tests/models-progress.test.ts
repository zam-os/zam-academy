import { afterEach, describe, expect, it, vi } from "vitest";
import { LESSONS } from "../src/curriculum";
import type { ModelKind } from "../src/model/types";
import {
	foodwebPattern,
	germination,
	initialModelState,
	matchingGoals,
	MODEL_SCENARIOS,
	type ModelState,
	modelReady,
	recordExploration,
	temperaturePattern,
} from "../src/models";
import {
	freshProject,
	missingProjectFields,
	projectReady,
	sanitizeProject,
	validProjectDate,
} from "../src/project";
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
import { renderModel } from "../src/ui/models";
import { renderProject } from "../src/ui/project";
const start = initialModelState();
const witnesses: Record<ModelKind, ModelState[]> = {
	flower: [1, 2, 3].map((phase) => ({ ...start, phase })),
	germination: [
		{ ...start, warm: true, water: true, light: false },
		{ ...start, warm: true, water: false },
		{ ...start, warm: true, water: true, air: false },
	],
	temperature: [
		{ ...start, animal: "bird", temperature: 5 },
		{ ...start, animal: "lizard", temperature: 5 },
		{ ...start, animal: "lizard", temperature: 30 },
	],
	foodweb: [
		{ ...start, leaves: false },
		{ ...start, leaves: false, alternative: true },
		{ ...start, leaves: true, alternative: true },
	],
};
describe("qualitative biological models", () => {
	it.each(Object.keys(witnesses) as ModelKind[])(
		"has reachable goals and starts unsolved: %s",
		(kind) => {
			expect(matchingGoals(kind, start)).toEqual([]);
			let explored: string[] = [];
			for (const [index, witness] of witnesses[kind].entries()) {
				expect(matchingGoals(kind, witness)).toContain(
					MODEL_SCENARIOS[kind][index].id,
				);
				explored = recordExploration(kind, explored, witness);
			}
			expect(modelReady(kind, explored)).toBe(true);
			expect(
				recordExploration(
					kind,
					[...explored, "foreign-goal"],
					witnesses[kind][0],
				),
			).toEqual(explored);
			expect(modelReady(kind, explored.slice(1))).toBe(false);
		},
	);
	it("separates dark germination, green growth and necessary conditions on the boolean grid", () => {
		for (const water of [false, true])
			for (const air of [false, true])
				for (const warm of [false, true])
					for (const light of [false, true])
						expect(germination({ ...start, water, air, warm, light })).toEqual({
							germinates: water && air && warm,
							growsGreen: water && air && warm && light,
						});
	});
	it("changes the temperature and food-web explanations with their controls", () => {
		expect(temperaturePattern(witnesses.temperature[0])).toContain(
			"Stoffwechselwärme",
		);
		expect(temperaturePattern(witnesses.temperature[1])).toContain("Kälte");
		expect(temperaturePattern(witnesses.temperature[2])).toContain("Hitze");
		expect(foodwebPattern(witnesses.foodweb[0])).toContain(
			"Eine genaue Bestandszahl folgt daraus nicht.",
		);
		expect(foodwebPattern(witnesses.foodweb[1])).toContain("alternative");
		expect(foodwebPattern(witnesses.foodweb[2])).toContain("mehrere Wege");
	});
	it("renders every selected state with controls and accessible explanations", () => {
		for (const lesson of LESSONS.filter((l) => l.model))
			for (const state of [start, ...witnesses[lesson.model!]]) {
				const html = renderModel(lesson, [], state);
				expect(html).toContain('role="img"');
				expect(html).toContain('role="status"');
				expect(html).toContain('id="record-model"');
				expect(html).not.toMatch(/NaN|undefined|Infinity/);
			}
	});
});
describe("local progress and field notebook", () => {
	afterEach(() => vi.unstubAllGlobals());
	it("requires all activities and counts only Level 1 as core", () => {
		const progress = freshProgress(),
			lesson = LESSONS.find((l) => l.id === "b6-keimung")!,
			key = writingKey(lesson.id, 1);
		progress.quizDone.push(lesson.id);
		progress.workshopDone.push(lesson.id);
		progress.drafts[key] =
			"Meine begründete Antwort mit mindestens zwanzig Zeichen.";
		progress.writingDone.push(key);
		expect(isComplete(progress, lesson.id)).toBe(false);
		progress.explored[lesson.id] = MODEL_SCENARIOS.germination.map((g) => g.id);
		expect(isComplete(progress, lesson.id)).toBe(true);
		expect(completion(progress)).toEqual({
			completed: 1,
			total: 30,
			percent: 3,
		});
		progress.writingDone = [writingKey(lesson.id, 2)];
		expect(isComplete(progress, lesson.id)).toBe(false);
	});
	it("round trips valid progress and drops stale ids and malformed values", () => {
		const p = freshProgress();
		p.drafts["b6-forschen:1"] =
			"Eine längere selbst verfasste Antwort zur Frage.";
		p.writingDone = ["b6-forschen:1"];
		expect(parseProgress(JSON.stringify(p))).toEqual(p);
		expect(parseProgress("{bad")).toEqual(freshProgress());
		const parsed = parseProgress(
			JSON.stringify({
				activeLessonId: "foreign",
				level: 7,
				quizDone: ["unknown", "b6-forschen", "b6-forschen"],
				writingDone: ["b6-forschen:1"],
				explored: { "b6-keimung": ["dark", "foreign", "dark"] },
				drafts: { "foreign:1": "x", "b6-forschen:1": 3 },
			}),
		);
		expect(parsed.activeLessonId).toBe(LESSONS[0].id);
		expect(parsed.level).toBe(1);
		expect(parsed.quizDone).toEqual(["b6-forschen"]);
		expect(parsed.writingDone).toEqual([]);
		expect(parsed.explored["b6-keimung"]).toEqual(["dark"]);
		expect(parsed.drafts).toEqual({});
	});
	it("uses an isolated storage key and degrades when storage is blocked", () => {
		const setItem = vi.fn();
		vi.stubGlobal("localStorage", { getItem: () => null, setItem });
		expect(loadProgress()).toEqual(freshProgress());
		expect(saveProgress(freshProgress())).toBe(true);
		expect(setItem).toHaveBeenCalledWith(STORAGE_KEY, expect.any(String));
		expect(STORAGE_KEY).toBe("biologie_rs6_academy_progress_v1");
		vi.stubGlobal("localStorage", {
			getItem() {
				throw Error("blocked");
			},
			setItem() {
				throw Error("blocked");
			},
		});
		expect(loadProgress()).toEqual(freshProgress());
		expect(saveProgress(freshProgress())).toBe(false);
	});
	it("validates a cumulative notebook and real dates without requiring a web account", () => {
		const p = freshProject();
		expect(projectReady(p, "question", "2026-11-13")).toBe(false);
		Object.assign(p, {
			place: "Öffentliche Hecke",
			question: "Wie unterscheiden sich Schatten und offener Boden?",
			date: "2026-11-12",
		});
		expect(projectReady(p, "question", "2026-11-13")).toBe(true);
		expect(projectReady(p, "evidence", "2026-11-13")).toBe(false);
		Object.assign(p, {
			conditions: "Sonniger Novembertag, gleiche Messhöhe an vier Stellen.",
			observations:
				"An den Schattenstellen war der Boden feuchter; die Messwerte stehen in meiner Tabelle.",
			source: "Eigene Beobachtungen und Bestimmungshilfe aus dem Unterricht.",
			judgment:
				"Ich vergleiche vollständige Rodung und abschnittsweise Pflege. Rückzugsorte sind mein entscheidendes Schutzkriterium.",
			limits:
				"Es fehlt eine Wiederholung nach Regen; der Boden war nicht überall gleich.",
			presentation:
				"Ich zeige Frage, Messpunkte, Tabelle und Schluss. Selbst bleibe ich auf Wegen.",
		});
		expect(missingProjectFields(p, "judgment", "2026-11-13")).toEqual([]);
		expect(validProjectDate("2026-02-30", "2026-11-13")).toBe(false);
		expect(validProjectDate("2026-11-14", "2026-11-13")).toBe(false);
		expect(validProjectDate("2024-02-29", "2026-11-13")).toBe(true);
		expect(
			sanitizeProject({ place: "x".repeat(5000), date: 4 }).place,
		).toHaveLength(4000);
		const html = renderProject(
			LESSONS.find((l) => l.projectStep === "question")!,
			{ ...p, place: '<img src="x">' },
		);
		expect(html).toContain("&lt;img");
		expect(html).not.toContain('<img src="x">');
	});
});
