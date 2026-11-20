import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import publication from "../publication.json";
import {
	AIR_GASES,
	ELEMENTS,
	ISOTOPES,
	magnesiumEquation,
	neutralAtom,
	shells,
} from "../src/chemistry/models";
import {
	ALL_LESSONS,
	continuationLesson,
	lessonsForTrack,
	nextLesson,
	previousLesson,
} from "../src/curriculum";
import { checkTask } from "../src/exercises/checker";
import { createRng } from "../src/exercises/rng";
import {
	computeReadouts,
	defaultLabValues,
	enumerateLabGrid,
	reachedGoals,
} from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import {
	parseTrainingDeepLink,
	ZAM_CELL_ID,
	lessonLink,
} from "../src/zam/zam-link";

import {
	branchCurrents,
	circuitClosed,
	exampleWire,
	ohmicResistance,
} from "../src/lab/physics-models";

const shared = [
	"forschen",
	"quellen",
	"sicherheit",
	"luft",
	"luftdruck",
	"zeichensprache",
	"verbrennung",
	"brandschutz",
	"oxidation",
	"rosten",
	"windkraft",
	"atommodelle",
	"kern-huelle",
	"isotope",
	"periodensystem",
	"wirbeltierklassen",
	"fortbewegung",
	"atemwege",
	"atembewegung",
	"gasaustausch",
	"blutbestandteile",
	"blutkreislauf",
	"herzpumpe",
	"kreislaufgesundheit",
	"stromwirkungen",
	"stromkreis",
	"messgeraete",
	"widerstand",
	"leiterwahl",
	"stromsicherheit",
];
const mOnly = [
	"formelgleichungen",
	"windstandort",
	"energiestufen",
	"zellatmung",
	"belastung",
	"parallelkreise",
];
const ulid = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

describe("track and source contracts", () => {
	it("offers the full shared path and six M7 extensions", () => {
		expect(lessonsForTrack("R").map((lesson) => lesson.id)).toEqual(shared);
		expect(
			lessonsForTrack("M")
				.filter((lesson) => lesson.tracks.length === 1)
				.map((lesson) => lesson.id),
		).toEqual(mOnly);
		expect(nextLesson("rosten", "R")?.id).toBe("windkraft");
		expect(nextLesson("rosten", "M")?.id).toBe("formelgleichungen");
		expect(previousLesson("atommodelle", "R")?.id).toBe("windkraft");
		expect(continuationLesson("energiestufen", "R").id).toBe("forschen");
	});

	it("maps each in-scope expectation and each lesson in its track", () => {
		expect(coverage.rows.filter((row) => row.track === "R")).toHaveLength(36);
		expect(coverage.rows.filter((row) => row.track === "M")).toHaveLength(41);
		expect(new Set(coverage.rows.map((row) => row.id)).size).toBe(77);
		for (const row of coverage.rows) {
			expect(row.competence.length).toBeGreaterThan(15);
			expect(row.evidence.length).toBeGreaterThan(15);
			expect(["implemented", "supported"]).toContain(row.status);
			{
				const section = row.lb === "1" ? "LB 1" : row.lb;
				expect(
					row.lessons.some((id) =>
						ALL_LESSONS.find((lesson) => lesson.id === id)?.lehrplan.endsWith(
							section,
						),
					),
				).toBe(true);
			}
			for (const id of row.lessons) {
				const lesson = ALL_LESSONS.find((entry) => entry.id === id);
				expect(lesson?.tracks).toContain(row.track);
			}
		}
		for (const lesson of ALL_LESSONS) {
			for (const track of lesson.tracks) {
				expect(
					coverage.rows.some(
						(row) => row.track === track && row.lessons.includes(lesson.id),
					),
				).toBe(true);
			}
		}
	});

	it("keeps one atom and three recall items per lesson", () => {
		expect(publication).toEqual({
			schema: 1,
			status: "ready",
			version: "0.0",
		});
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell).not.toHaveProperty("retired_items");
		expect(cell.atoms.map((atom) => atom.slug)).toEqual(
			ALL_LESSONS.map((lesson) => lesson.id),
		);
		expect(cell.sources.map((source) => source.uri)).toEqual([
			coverage.curriculum.R,
			coverage.curriculum.M,
		]);
		const ids = new Set<string>();
		for (const [i, atom] of cell.atoms.entries()) {
			const lesson = ALL_LESSONS[i];
			expect(atom.id).toMatch(ulid);
			expect(ids.has(atom.id)).toBe(false);
			expect(atom.atom_uri).toBe("urn:zam:atom:" + atom.id);
			expect(
				atom.prerequisites.every(
					({ atom_id, type }) => type === "soft" && ids.has(atom_id),
				),
			).toBe(true);
			ids.add(atom.id);
			expect(atom.title).toBe(lesson.title);
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(
				parseTrainingDeepLink(new URL(atom.source_link).hash).lessonId,
			).toBe(lesson.id);
			const bindings = atom.curricula.filter(
				(binding) => binding.provider === "lehrplanplus-bayern",
			);
			expect(bindings.map((binding) => binding.track)).toEqual(lesson.tracks);
			for (const binding of bindings) {
				expect(binding).toMatchObject({
					school_type: "mittelschule",
					grade: 7,
					subject: "nt",
					topic_code: "lb" + lesson.bindings[binding.track as "M" | "R"],
				});
			}
			expect(atom.practice_items).toHaveLength(3);
			expect(new Set(atom.practice_items.map((item) => item.slug)).size).toBe(
				3,
			);
			for (const item of atom.practice_items) {
				expect(item.id).toMatch(ulid);
				expect(ids.has(item.id)).toBe(false);
				ids.add(item.id);
				expect(item.source_link).toBe(atom.source_link);
				expect(item).not.toHaveProperty("replaces");
				if (item.tier === "tier1_fast") {
					expect(item.fast_check?.options).toHaveLength(2);
					expect(item.fast_check?.options[0]).toBe(item.concept);
					expect(item.fast_check?.correct_index).toBe(0);
				} else expect(item.sample_solution?.length).toBeGreaterThan(15);
			}
		}
		expect(ids.size).toBe(144);
	});
});

describe("chemistry models", () => {
	it("conserves each atom sort only where the equation balances", () => {
		expect(magnesiumEquation(1, 1, 1)).toMatchObject({
			left: { mg: 1, o: 2 },
			right: { mg: 1, o: 1 },
			balanced: false,
		});
		expect(magnesiumEquation(2, 1, 2).balanced).toBe(true);
		expect(magnesiumEquation(4, 2, 4).balanced).toBe(true);
		expect(magnesiumEquation(2, 2, 2).balanced).toBe(false);
	});

	it("keeps the simplified air total and the neutral atom counts", () => {
		expect(AIR_GASES.map((gas) => gas.share)).toEqual([78, 21, 1]);
		for (const { z, a } of ISOTOPES) {
			expect(neutralAtom(z, a)).toEqual({
				protons: z,
				neutrons: a - z,
				electrons: z,
			});
		}
		expect(neutralAtom(6, 12).neutrons).toBe(6);
		expect(neutralAtom(6, 13).neutrons).toBe(7);
	});

	it("places successive atoms in their periods with the right outer counts", () => {
		for (const [i, [, , period]] of ELEMENTS.entries()) {
			const z = i + 1;
			expect(shells(z)).toHaveLength(period);
			expect(shells(z).reduce((sum, count) => sum + count, 0)).toBe(z);
		}
		expect(shells(2)).toEqual([2]);
		expect(shells(10)).toEqual([2, 8]);
		expect(shells(11)).toEqual([2, 8, 1]);
		expect(shells(18)).toEqual([2, 8, 8]);
	});
});

describe("electric circuits", () => {
	it("opens each physical branch independently and adds the branch currents", () => {
		expect(circuitClosed({ sw: 0, fault: 0 })).toBe(false);
		expect(circuitClosed({ sw: 1, fault: 1 })).toBe(false);
		expect(circuitClosed({ sw: 1, fault: 0 })).toBe(true);
		expect(branchCurrents({ left: 0, right: 0 })).toEqual({
			left: 0,
			right: 0,
			total: 0,
		});
		expect(branchCurrents({ left: 1, right: 0 })).toEqual({
			left: 100,
			right: 0,
			total: 100,
		});
		expect(branchCurrents({ left: 0, right: 1 })).toEqual({
			left: 0,
			right: 100,
			total: 100,
		});
		expect(branchCurrents({ left: 1, right: 1 })).toEqual({
			left: 100,
			right: 100,
			total: 200,
		});
	});

	it("converts milliamperes before dividing and keeps the wire comparison consistent", () => {
		expect(ohmicResistance({ voltage: 4, current: 100 })).toBe(40);
		expect(ohmicResistance({ voltage: 8, current: 200 })).toBe(40);
		expect(ohmicResistance({ voltage: 9, current: 150 })).toBe(60);
		const cold = { length: 10, area: 1, material: 0, warm: 0 };
		const reference = exampleWire(cold);
		expect(exampleWire({ ...cold, length: 20 })).toBeCloseTo(2 * reference);
		expect(exampleWire({ ...cold, area: 2 })).toBeCloseTo(reference / 2);
		expect(exampleWire({ ...cold, material: 1 })).toBeGreaterThan(reference);
		expect(exampleWire({ ...cold, warm: 1 })).toBeGreaterThan(reference);
	});
});

describe.each(ALL_LESSONS)("$id", (lesson) => {
	it("has a worked example, key rule and valid quick check", () => {
		expect(lesson.explanationHtml).toContain("Beispiel");
		expect(lesson.explanationHtml).toContain("Merksatz");
		expect(lesson.formulas).toHaveLength(1);
		expect(new Set(lesson.quiz.options).size).toBe(3);
		expect(lesson.quiz.options[lesson.quiz.correctIndex]).toBeTruthy();
		expect(lesson.explanationHtml).not.toMatch(/\d\.\d|\d-\d/);
	});

	it("renders finite models and offers a witness for every goal", () => {
		const { lab } = lesson;
		expect(reachedGoals(lab, defaultLabValues(lab))).toEqual([]);
		const reached = new Set<string>();
		for (const values of enumerateLabGrid(lab, 19)) {
			const readouts = computeReadouts(lab, values);
			for (const value of Object.values(readouts)) {
				if (typeof value === "number")
					expect(Number.isFinite(value)).toBe(true);
				else expect(value.length).toBeGreaterThan(0);
			}
			const drawing = labView(lab.kind).render(values, readouts);
			expect(drawing).toContain('role="img"');
			expect(drawing).not.toMatch(/NaN|undefined|Infinity/);
			for (const goal of reachedGoals(lab, values, readouts))
				reached.add(goal.id);
		}
		expect(reached).toEqual(new Set(lab.goals.map((goal) => goal.id)));
	});

	it("checks every guided and transfer task and rejects wrong choices", () => {
		expect(lesson.exercises).toHaveLength(3);
		expect(lesson.requiredCorrect).toBe(3);
		for (const generator of lesson.exercises) {
			const guided = generator.make(createRng(1), 1);
			const transfer = generator.make(createRng(1), 2);
			expect(guided.prompt).not.toBe(transfer.prompt);
			expect(guided.formulaHint).toBeTruthy();
			expect(transfer.formulaHint).toBeUndefined();
			for (const level of [1, 2] as const) {
				for (let seed = 1; seed <= 12; seed++) {
					const task = generator.make(createRng(seed), level);
					const field = task.fields[0];
					if (field.kind === "number") {
						expect(
							checkTask(task, [String(field.answer).replace(".", ",")]).status,
						).toBe("correct");
						expect(checkTask(task, [String(field.answer + 1)]).status).toBe(
							"wrong",
						);
					} else {
						expect(new Set(field.options).size).toBe(3);
						expect(checkTask(task, [String(field.correctIndex)]).status).toBe(
							"correct",
						);
						expect(
							checkTask(task, [String((field.correctIndex + 1) % 3)]).status,
						).toBe("wrong");
					}
					expect(task.steps).toHaveLength(3);
					expect(task.prompt).not.toMatch(/\d\.\d|\d-\d/);
				}
			}
		}
	});
});
