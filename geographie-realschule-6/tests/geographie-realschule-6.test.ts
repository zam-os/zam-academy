import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { EUROPEAN_STATES } from "../src/data/europe";
import {
	CLIMATE_PROFILES,
	MODEL_SCENARIOS,
	MONTHS,
	RUNOFF_CASES,
	TRAFFIC_COUNTS,
	climateSummary,
	energyKwh,
	fmt,
	modelReady,
	recordExploration,
} from "../src/models";
import {
	freshProgress,
	isComplete,
	parseProgress,
	STORAGE_KEY,
	writingKey,
} from "../src/storage/progress";
import { renderDiagram } from "../src/ui/diagrams";
import { mapPoint, renderStateFinder } from "../src/ui/maps";
import { initialModelState, renderModel } from "../src/ui/models";
import { checkWorkshop } from "../src/workshop";
import {
	lessonLink,
	parseTrainingDeepLink,
	ZAM_CELL_ID,
	ZAM_CELL_TITLE,
	zamEnrolRequest,
} from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-realschule-7-geographie-europa-raum-wirtschaft-kvt.json";
import official from "./fixtures/official-curriculum.json";
import anchors from "./fixtures/public-contract.json";
import sources from "./fixtures/source-checks.json";

describe("curriculum and usable lesson content", () => {
	it("maps all 35 official competencies to 25 lessons in the same seven areas", () => {
		expect(LESSONS).toHaveLength(25);
		expect(new Set(LESSONS.map((lesson) => lesson.id)).size).toBe(25);
		expect(coverage.rows).toHaveLength(35);
		expect(
			STAGES.map(({ lb, title, hours }) => ({ lb, title, hours })),
		).toEqual(coverage.areas);
		expect(official.flatMap((area) => area.competencies)).toEqual(
			coverage.rows.map((row) => row.competence),
		);
		for (const row of coverage.rows) {
			expect(row.lessons.length).toBeGreaterThan(0);
			expect(row.evidence.length).toBeGreaterThan(20);
			expect(["supported", "implemented"]).toContain(row.status);
			for (const id of row.lessons)
				expect(LESSONS.find((lesson) => lesson.id === id)?.lb).toBe(row.lb);
		}
		expect(new Set(coverage.rows.flatMap((row) => row.lessons))).toEqual(
			new Set(LESSONS.map((lesson) => lesson.id)),
		);
	});
	it("lists a verified title for every external destination", () => {
		expect(SOURCES.map(({ id, url }) => ({ id, url }))).toEqual(
			sources.map(({ id, url }) => ({ id, url })),
		);
		for (const lesson of LESSONS)
			for (const id of lesson.sourceIds)
				expect(SOURCES.some((source) => source.id === id)).toBe(true);
	});
	it.each(LESSONS)(
		"supports an unsolved workshop and two distinct tasks in $id",
		(lesson) => {
			const { quiz, tasks, workshop } = lesson;
			expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(new Set([quiz.answer, ...quiz.wrong]).size).toBe(3);
			expect(quiz.explanation.length).toBeGreaterThan(25);
			expect(tasks[1].prompt).not.toBe(tasks[2].prompt);
			for (const task of Object.values(tasks)) {
				expect(task.hints).toHaveLength(2);
				expect(task.criteria).toHaveLength(3);
				expect(task.model.length).toBeGreaterThan(90);
			}
			expect(
				checkWorkshop(
					workshop,
					workshop.entries.map(() => -1),
				),
			).toEqual([false, false, false]);
			expect(
				checkWorkshop(
					workshop,
					workshop.entries.map((entry) => entry.target),
				),
			).toEqual([true, true, true]);
			expect(lesson.model || renderDiagram(lesson.id)).toBeTruthy();
			expect(JSON.stringify(lesson)).not.toMatch(/\d\.\d|(?<!\w)-\d/);
		},
	);
});

describe("maps, scenarios and quantitative models", () => {
	it.each(LESSONS.filter((lesson) => lesson.model))(
		"visits every rendered scenario in $id",
		(lesson) => {
			const kind = lesson.model!;
			let visited: string[] = [];
			expect(modelReady(kind, visited)).toBe(false);
			expect(recordExploration(kind, visited, "invented")).toEqual([]);
			for (const { id, label } of MODEL_SCENARIOS[kind]) {
				const html = renderModel(lesson, visited, {
					...initialModelState(),
					selected: id,
				});
				expect(html).toContain(`data-scenario="${id}" aria-pressed="true"`);
				expect(html).toContain('role="img"');
				expect(html).not.toMatch(/NaN|undefined/);
				expect(label).not.toBe("");
				visited = recordExploration(kind, visited, id);
			}
			expect(modelReady(kind, visited)).toBe(true);
		},
	);
	it("uses checked model values for practice examples, shared axes and valid ranges", () => {
		expect(MONTHS).toHaveLength(12);
		expect(
			Object.values(CLIMATE_PROFILES).map(({ temperature, rain }) => {
				expect(temperature).toHaveLength(12);
				expect(rain).toHaveLength(12);
				expect(temperature.every((value) => value >= -10 && value <= 30)).toBe(
					true,
				);
				expect(rain.every((value) => value >= 0 && value <= 120)).toBe(true);
				return climateSummary(temperature, rain).range;
			}),
		).toEqual([13, 26, 17]);
		expect(CLIMATE_PROFILES.inland.temperature.slice(0, 3)).toEqual([
			-4, -2, 3,
		]);
		expect(CLIMATE_PROFILES.inland.rain.slice(0, 3)).toEqual([30, 35, 40]);
		expect(TRAFFIC_COUNTS.morning).toEqual([18, 12, 2]);
		expect(RUNOFF_CASES.covered.width).toBeLessThan(RUNOFF_CASES.bare.width);
		expect(RUNOFF_CASES.bare.width).toBeLessThan(RUNOFF_CASES.sealed.width);
		expect(energyKwh(60, 5) - energyKwh(10, 5)).toBeCloseTo(0.25);
		expect(fmt(-4.5)).toBe("−4,5");
	});
	it("locates every state finder marker inside the mapping viewport", () => {
		expect(EUROPEAN_STATES).toHaveLength(51);
		expect(new Set(EUROPEAN_STATES.map(([code]) => code)).size).toBe(51);
		for (const [code, state, , lon, lat] of EUROPEAN_STATES) {
			const [x, y] = mapPoint(lon, lat, [-25, 77, 32, 72]);
			expect(x).toBeGreaterThan(10);
			expect(x).toBeLessThan(690);
			expect(y).toBeGreaterThan(10);
			expect(y).toBeLessThan(340);
			expect(renderStateFinder(code)).toContain(state);
		}
		expect(renderStateFinder("TUR")).toContain("Ankara");
		for (const code of ["DEU", "KOS"]) {
			expect(renderStateFinder(code)).toContain(
				`class="map-country selected-country" data-map-country="${code}"`,
			);
		}
		expect(renderStateFinder("KOS")).toContain("Pristina");
	});
});

describe("ZAM cell contract and legacy review history", () => {
	it("binds one atom per lesson to Grade 6 for all tracks, with stable links and two cards each", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms).toHaveLength(LESSONS.length);
		const positions = new Map(
			cell.atoms.map((atom, index) => [atom.id, index]),
		);
		const ids: string[] = [];
		for (const [index, atom] of cell.atoms.entries()) {
			const lesson = LESSONS[index];
			const source = `https://academy.zam-os.org/geographie-realschule-6/#lesson=${lesson.id}`;
			const contract = anchors[lesson.id as keyof typeof anchors];
			expect(atom.id).toBe(contract.atom);
			expect(atom.source_link).toBe(source);
			expect(atom.curricula).toContainEqual(
				expect.objectContaining({
					school_type: "realschule",
					grade: 6,
					subject: "geographie",
					topic_code: `lb${lesson.lb}`,
				}),
			);
			expect(atom.curricula.some((binding) => "track" in binding)).toBe(false);
			for (const prior of atom.prerequisites)
				expect(positions.get(prior.atom_id)).toBeLessThan(index);
			expect(atom.practice_items.map((item) => item.id)).toEqual(
				contract.items,
			);
			expect(atom.practice_items).toHaveLength(2);
			expect(atom.practice_items[0].fast_check?.options).toHaveLength(2);
			expect(atom.practice_items[0].fast_check?.correct_index).toBe(0);
			expect(atom.practice_items[1].sample_solution?.length).toBeGreaterThan(
				25,
			);
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(source);
				expect(item.language).toBe("de");
			}
			ids.push(atom.id, ...atom.practice_items.map((item) => item.id));
		}
		expect(new Set(ids).size).toBe(75);
		expect(ids.every((id) => /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(id))).toBe(
			true,
		);
		expect(
			parseTrainingDeepLink(
				new URL(lessonLink(LESSONS[0].id) + "&level=2").hash,
			),
		).toEqual({ lessonId: LESSONS[0].id, level: 2 });
		expect(zamEnrolRequest()).toContain(ZAM_CELL_TITLE);
	});
	it("declares exactly the three approved transfers and keeps the other legacy cards active", () => {
		const items = cell.atoms.flatMap((atom) => atom.practice_items);
		expect(mapping.status).toBe("approved");
		expect(mapping.approved).toBe("2026-11-18");
		expect(cell.version).toBe("2026.11.2");
		expect(mapping.rows.map((row) => row.de_by_id)).toEqual(
			legacy.atoms.flatMap((atom) =>
				atom.practice_items.map((item) => item.id),
			),
		);
		expect(new Set(mapping.rows.map((row) => row.de_by_id)).size).toBe(8);
		expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(3);
		for (const row of mapping.rows) {
			expect(row.de_by_cell).toBe(legacy.tile_id);
			expect(row.reason.length).toBeGreaterThan(30);
			if (row.category === "A") {
				expect(
					items.filter((item) => item.slug === row.academy_slug),
				).toHaveLength(1);
				expect(row.action).toBe("replace");
			} else {
				expect(row.academy_slug).toBeNull();
				expect(row.action).toBe("keep-active");
			}
		}
		expect("retired_items" in cell).toBe(false);
		expect(
			items
				.filter((item) => "replaces" in item)
				.map((item) => [item.slug, item.replaces]),
		).toEqual([
			["geo6-europa-natur-check", ["01K4G7E0000000000000000J01"]],
			["geo6-europa-alltag-check", ["01K4G7E0000000000000000J07"]],
			["geo6-klimaraeume-check", ["01K4G7E0000000000000000J03"]],
		]);
	});
});

describe("local progress", () => {
	it("isolates Grade 6 storage and requires the model, workshop, quiz and Level 1 comparison", () => {
		const lesson = LESSONS[0];
		const id = lesson.id;
		const data = freshProgress();
		expect(STORAGE_KEY).toContain("rs6");
		data.quizDone = [id, "geo-geographie"];
		data.workshopDone = [id];
		data.writingDone = [writingKey(id, 1)];
		data.drafts[writingKey(id, 1)] = "Die Donau fließt vorwiegend nach Osten.";
		expect(isComplete(data, id)).toBe(false);
		data.explored[id] = MODEL_SCENARIOS.europa
			.map((entry) => entry.id)
			.concat(["invalid"]);
		const restored = parseProgress(JSON.stringify(data));
		expect(restored.quizDone).toEqual([id]);
		expect(restored.explored[id]).not.toContain("invalid");
		expect(isComplete(restored, id)).toBe(true);
	});
});
