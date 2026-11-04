import { describe, it, expect } from "vitest";
import {
	finalTask,
	finalLab,
	finalFamily,
	finalExit,
} from "../src/course/data-and-expeditions";
import {
	drawsFor,
	acceptsExperiment,
	compositionChoice,
	validExperimentState,
	dataChartView,
	experimentView,
} from "../src/course/data-model";
import { freshWorkshop, validWorkshop } from "../src/course/workshop";
import { correctForest } from "../src/course/tasks";
import {
	freshForest,
	recordForest,
	forestKey,
	activeForestTask,
	validForest,
} from "../src/course/progress";
import { investigationInput } from "../src/course/investigations";
import { quantityText } from "../src/course/quantity";
import { FINAL_IDS } from "../src/course/worlds";
const need = <T>(v: T | null | undefined): T => {
	if (v == null) throw new Error("Missing final-world fixture");
	return v;
};
describe("data and chance models", () => {
	it("varies stable experiment option order without changing the selected answer's meaning", () => {
		const correctPositions: number[] = [];
		for (let i = 0; i < 3; i++) {
			const model = need(finalLab("zufallsexperimente", i).model),
				state = [...model.target],
				render = () => experimentView(model, state, false),
				buttons = (markup: string) => [
					...markup.matchAll(
						/<button data-action="forest-experiment-conclude" data-col="4" data-value="(\d)"[^>]*>(.*?)<\/button>/g,
					),
				];
			const first = buttons(render());
			correctPositions.push(first.findIndex((m) => m[1] === "1"));
			expect(buttons(render()).map((m) => m[1])).toEqual(
				first.map((m) => m[1]),
			);
			expect(first.find((m) => m[1] === "1")?.[2]).toContain(
				"nicht sicher vorhersagbar",
			);
			expect(first.find((m) => m[1] === "1")?.[0]).toContain(
				'aria-pressed="true"',
			);
			expect(render()).not.toContain('data-action="forest-model-reset"');
		}
		expect(correctPositions).toEqual([0, 1, 2]);
	});
	it("counts category observations exactly and keeps every model initially unsolved", () => {
		for (let i = 0; i < 3; i++) {
			const t = finalLab("daten-sammeln-darstellen", i),
				m = need(t.model),
				c = need(m.scene.chart);
			expect(correctForest(t, freshWorkshop(m))).toBe(false);
			expect(correctForest(t, m.target)).toBe(true);
			expect(validWorkshop(m.target, m)).toBe(true);
			if (c.observations)
				expect(c.values).toEqual(
					c.labels.map((_, j) => c.observations?.filter((n) => n === j).length),
				);
			expect(c.values.every((n) => n <= c.max && n % c.scale === 0)).toBe(true);
		}
	});
	it("preserves deterministic draw prefixes, replacement and revisable conclusions without grading an initial guess", () => {
		for (let i = 0; i < 3; i++) {
			const t = finalLab("zufallsexperimente", i),
				m = need(t.model),
				e = need(m.scene.experiment),
				target = m.target;
			expect(drawsFor(e, 5)).toEqual(drawsFor(e).slice(0, 5));
			expect(drawsFor(e)).toHaveLength(12);
			expect(correctForest(t, freshWorkshop(m))).toBe(false);
			for (const guess of [1, 2, 3])
				expect(acceptsExperiment(m, [guess, ...target.slice(1)])).toBe(true);
			expect(validExperimentState([0, 1, 0, 0, 0], e)).toBe(false);
			expect(validExperimentState([1, 13, 0, 0, 0], e)).toBe(false);
			expect(acceptsExperiment(m, [target[0], 11, ...target.slice(2)])).toBe(
				false,
			);
			const wrong = [...target];
			wrong[2] = (wrong[2] + 1) % 13;
			expect(acceptsExperiment(m, wrong)).toBe(false);
			expect(compositionChoice(e)).toBe([2, 1, 3][i]);
			expect({ red: e.red, blue: e.blue }).toEqual(
				[
					{ red: 1, blue: 3 },
					{ red: 3, blue: 1 },
					{ red: 2, blue: 2 },
				][i],
			);
		}
	});
	it("keeps chart values inside scales and omits a hidden value from the graphic", () => {
		for (const id of FINAL_IDS)
			for (const level of [1, 2] as const)
				for (let seed = 0; seed < 200; seed++)
					for (let i = 0; i < 3; i++) {
						const t = finalTask(id, level, seed, i),
							c = t.scene?.chart;
						if (!c) continue;
						expect(
							c.values.every((n) => n >= 0 && n <= c.max),
							`${id} seed${seed}`,
						).toBe(true);
						expect(dataChartView(c)).not.toMatch(/NaN|Infinity/);
					}
		const hidden = dataChartView({
			labels: ["A", "B", "C"],
			values: [10, 20, 37],
			scale: 5,
			max: 40,
			unit: "Personen",
			hidden: [2],
		});
		expect(hidden).toContain("C: nicht angegeben");
		expect(hidden).not.toContain(">37<");
		expect(hidden.match(/<rect /g)).toHaveLength(2);
	});
});
describe("final-world mathematical checks", () => {
	it("marks every timetable event after midnight, including arrivals and departures at the stop", () => {
		const encountered = new Set<string>();
		for (let seed = 0; seed < 200; seed++) {
			const board = need(
					finalTask("tabellen-diagramme-auswerten", 2, seed, 1).investigation,
				),
				[, start, first, pause, second] = board.identity.map(Number),
				events = [
					[board.rows[0][2], start],
					[board.rows[1][1], start + first],
					[board.rows[1][2], start + first + pause],
					[board.rows[2][1], start + first + pause + second],
				] as const;
			for (const [shown, minutes] of events) {
				expect(shown.includes("nächster Tag")).toBe(minutes >= 1440);
				encountered.add(minutes >= 1440 ? "next" : "same");
			}
			expect(board.fields.map((f) => f.value)).toEqual([
				first + second,
				pause,
				first + pause + second,
			]);
		}
		expect([...encountered].sort()).toEqual(["next", "same"]);
	});
	it("roundtrips quantity inputs and checks whole pieces, loads, seats and exact budgets independently", () => {
		for (const id of FINAL_IDS)
			for (const level of [1, 2] as const)
				for (let seed = 0; seed < 160; seed++)
					for (let index = 0; index < 3; index++) {
						const t = finalTask(id, level, seed * 7919, index),
							b = need(t.investigation),
							a = t.answer as number[],
							d = b.identity;
						expect(
							investigationInput(
								b,
								b.fields.map((f) => quantityText(f.value, f.format)),
							),
						).toEqual(a);
						expect(correctForest(t, a)).toBe(true);
						expect(
							correctForest(
								t,
								a.map((n, i) => (i === 0 ? n + 1 : n)),
							),
						).toBe(false);
						if (d[0] === "workshop-boards") {
							const [pieces, length, board, price] = d.slice(1).map(Number),
								per = a[0],
								boards = a[1];
							expect(per * length).toBeLessThanOrEqual(board);
							expect((per + 1) * length).toBeGreaterThan(board);
							expect(boards * per).toBeGreaterThanOrEqual(pieces);
							expect((boards - 1) * per).toBeLessThan(pieces);
							expect(a[2]).toBe(level === 2 ? boards * price : pieces * length);
						}
						if (d[0] === "workshop-load") {
							const [crates, content, empty, limit] = d.slice(1).map(Number),
								[each, per, trips] = a;
							expect(each).toBe(content + empty);
							expect(per * each).toBeLessThanOrEqual(limit);
							expect((per + 1) * each).toBeGreaterThan(limit);
							expect(trips * per).toBeGreaterThanOrEqual(crates);
							expect((trips - 1) * per).toBeLessThan(crates);
						}
						if (d[0] === "workshop-budget") {
							const [sets, p, brushes, each, budget] = d.slice(1).map(Number);
							expect(a).toEqual([
								sets * p,
								sets * p + brushes * each,
								budget >= sets * p + brushes * each ? 1 : 2,
							]);
						}
						if (d[0] === "journey-tickets") {
							const [kids, adults, price, seats] = d.slice(1).map(Number);
							expect(a[0]).toBe(2 * price);
							expect(a[1]).toBe(kids * price + adults * 2 * price);
							expect(a[2] * seats).toBeGreaterThanOrEqual(kids + adults);
							expect((a[2] - 1) * seats).toBeLessThan(kids + adults);
						}
						if (d[0] === "festival-supply") {
							const [kids, helpers, per, seats] = d.slice(1).map(Number),
								people = kids + helpers;
							expect(a[0]).toBe(people * per);
							expect(a[1] * 1000).toBeGreaterThanOrEqual(a[0]);
							expect((a[1] - 1) * 1000).toBeLessThan(a[0]);
							expect(a[2] * seats).toBeGreaterThanOrEqual(people);
							expect((a[2] - 1) * seats).toBeLessThan(people);
						}
						if (d[0] === "chance-bags") {
							const [total, red, change, other] = d.slice(1).map(Number);
							expect(a).toEqual([
								red + change,
								red + change === other ? 3 : red + change > other ? 1 : 2,
								total - red - change,
							]);
						}
						if (d[0] === "festival-votes") {
							const v = d.slice(1).map(Number),
								sorted = [...v].sort((a, b) => b - a);
							expect(a[0]).toBe(v.indexOf(sorted[0]) + 1);
							expect(a[1]).toBe(v.reduce((s, n) => s + n, 0));
							expect(a[2]).toBe(sorted[0] - sorted[1]);
							expect(sorted[0]).toBeGreaterThan(sorted[1]);
						}
					}
	});
	it("deduplicates identical presented series even when hidden bag conditions differ", () => {
		const a = finalTask("zufallsexperimente", 2, 31, 2),
			b = finalTask("zufallsexperimente", 2, 35, 2);
		expect(a.investigation?.rows).toEqual(b.investigation?.rows);
		expect(a.answer).toEqual(b.answer);
		expect(finalFamily(a)).toEqual(finalFamily(b));
		const p = freshForest("zufallsexperimente");
		p.stage = "exit";
		p.labGoals = [0, 1, 2];
		p.quiz = true;
		recordForest(p, a, a.answer);
		p.index = 1;
		recordForest(p, b, b.answer);
		expect(p.attempts.at(-1)?.first).toBe(false);
	});
	it("reserves authored examples and keeps resampled tasks pinned after submission", () => {
		expect(finalFamily(finalExit("expedition-inselfest", 1300, 0))).not.toEqual(
			["festival-supply", 13, 3, 250, 6],
		);
		expect(finalFamily(finalExit("expedition-werkstatt", 2616, 0))).not.toEqual(
			["workshop-boards", 7, 60, 200, 200],
		);
		for (const id of FINAL_IDS) {
			const p = freshForest(id);
			p.stage = "exit";
			p.labGoals = [0, 1, 2];
			p.quiz = true;
			p.solved = { 1: 3, 2: 3 };
			const t = need(activeForestTask(p));
			p.stage = "practice-1";
			recordForest(p, t, t.answer);
			p.stage = "exit";
			const next = need(activeForestTask(p));
			expect(finalFamily(next)).not.toEqual(finalFamily(t));
			const key = forestKey(p);
			recordForest(p, next, next.answer);
			expect(forestKey(p)).toBe(key);
			expect(activeForestTask(p)).toEqual(next);
			expect(validForest(p)).toBe(true);
		}
	});
});
