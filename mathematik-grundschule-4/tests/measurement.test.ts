import { describe, expect, it } from "vitest";
import { investigationInput } from "../src/course/investigations";
import {
	measureLab,
	measureTask,
	measureExit,
} from "../src/course/measurement";
import { freshForest, recordForest, validForest } from "../src/course/progress";
import { parseQuantity, quantityText } from "../src/course/quantity";
import { correctForest } from "../src/course/tasks";
import { forestTaskView } from "../src/course/view";
import {
	acceptsWorkshop,
	freshWorkshop,
	workshopView,
	stepWorkshop,
	validWorkshop,
} from "../src/course/workshop";
import { MEASURE_IDS } from "../src/course/worlds";
const need = <T>(v: T | null | undefined): T => {
	if (v == null) throw new Error("Missing fixture");
	return v;
};
describe("quantity input contracts", () => {
	it("normalises comma/point decimals exactly, without changing integer parsing", () => {
		expect(parseQuantity("1.000")).toBe(1000);
		for (const s of ["1,5", "1.50", "01,50"])
			expect(parseQuantity(s, { scale: 100 })).toBe(150);
		expect(parseQuantity("1 000,50", { scale: 100 })).toBe(100050);
		for (const s of ["1,005", "1.000,50", "1e2", "-1", "1,2.3", "1,", "1 00,5"])
			expect(parseQuantity(s, { scale: 100 })).toBeNull();
		for (const n of [0, 1, 5, 99, 100, 105, 999999, 1000000])
			expect(
				parseQuantity(quantityText(n, { scale: 100 }), { scale: 100 }),
			).toBe(n);
	});
	it("uses 24-hour clock input and rejects decimal time, invalid hours and minutes", () => {
		expect(parseQuantity("00:15", { clock: true })).toBe(15);
		expect(parseQuantity("23:59", { clock: true })).toBe(1439);
		for (const s of ["24:00", "12:60", "1,25", "13:5", "-1:00"])
			expect(parseQuantity(s, { clock: true })).toBeNull();
	});
});
describe("Measure Market", () => {
	it("has reachable controls, no solved starting model, and quantity-equivalent constructions", () => {
		for (const id of MEASURE_IDS)
			for (let i = 0; i < 3; i++) {
				const task = measureLab(id, i);
				if (!task.model) {
					expect(task.investigation).toBeDefined();
					expect(correctForest(task, task.answer)).toBe(true);
					continue;
				}
				const m = task.model;
				let state = freshWorkshop(m);
				expect(acceptsWorkshop(m, state), `${id} ${i}`).toBe(false);
				for (let col = 0; col < m.controls.length; col++)
					for (let n = 0; n < 100 && state[col] !== m.target[col]; n++)
						state = stepWorkshop(
							m,
							state,
							col,
							Math.sign(m.target[col] - state[col]),
						);
				expect(state).toEqual(m.target);
				expect(correctForest(task, state)).toBe(true);
				expect(
					validWorkshop(
						state.map((n, j) => (j === 0 ? m.controls[0].max + 1 : n)),
						m,
					),
				).toBe(false);
			}
		expect(correctForest(measureLab("geld-einkaufen", 0), [1, 3, 1, 1])).toBe(
			true,
		);
		expect(correctForest(measureLab("geld-einkaufen", 0), [1, 3, 1, 2])).toBe(
			false,
		);
	});
	it("checks generated measurements with independent unit and time oracles", () => {
		for (const id of MEASURE_IDS)
			for (const level of [1, 2] as const)
				for (let seed = 0; seed < 160; seed++)
					for (let index = 0; index < 3; index++) {
						const task = measureTask(id, level, seed * 7919, index),
							b = need(task.investigation),
							a = task.answer as number[],
							identity = b.identity;
						const values = b.fields.map((f) => quantityText(f.value, f.format));
						expect(investigationInput(b, values)).toEqual(a);
						expect(correctForest(task, investigationInput(b, values))).toBe(
							true,
						);
						expect(
							correctForest(
								task,
								a.map((n, i) => (i === 0 ? n + 1 : n)),
							),
						).toBe(false);
						expect(a.every(Number.isSafeInteger)).toBe(true);
						if (identity[0] === "length")
							expect(a[0]).toBe(Number(identity[2]) - Number(identity[1]));
						if (identity[0] === "ribbon")
							expect(a[0]).toBe(
								Number(identity[1]) * Number(identity[2]) + Number(identity[3]),
							);
						if (identity[0] === "mass")
							expect(a[0]).toBe(
								Number(identity[1]) * 1000 +
									Number(identity[2]) +
									Number(identity[3]),
							);
						if (identity[0] === "duration")
							expect(a).toEqual([
								Number(identity[2]) - Number(identity[1]),
								Math.floor(a[0] / 60),
								a[0] % 60,
							]);
						if (identity[0] === "shopping")
							expect(a).toEqual([
								Number(identity[1]) * Number(identity[2]),
								Number(identity[3]) - Number(identity[1]) * Number(identity[2]),
							]);
						if (identity[0] === "water-plan") {
							const needed = Number(identity[1]) * Number(identity[2]);
							expect(a[1] * 1000).toBeGreaterThanOrEqual(needed);
							expect((a[1] - 1) * 1000).toBeLessThan(needed);
							expect(a[2]).toBe(a[1] * 1000 - needed);
						}
						if (identity[0] === "unit-conversion")
							expect(a[0]).toBe(a[1] * 1000 + a[2]);
					}
	});
	it("makes transfer structurally different and keeps worksheets, units and evidence restorable", () => {
		for (const id of MEASURE_IDS) {
			const first = measureTask(id, 1, 17, 1),
				transfer = measureTask(id, 2, 17, 1);
			expect(JSON.stringify(first.investigation)).not.toBe(
				JSON.stringify(transfer.investigation),
			);
			const p = freshForest(id);
			p.stage = "lab";
			p.modelWork = freshWorkshop(need(measureLab(id, 0).model));
			expect(validForest(p)).toBe(true);
			p.modelWork = [999];
			expect(validForest(p)).toBe(false);
			p.modelWork = null;
			p.labGoals = [0, 1, 2];
			p.quiz = true;
			p.stage = "practice-1";
			const task = measureTask(id, 1, p.seed, 0);
			p.investigationWork = need(task.investigation).fields.map((f) =>
				quantityText(f.value, f.format),
			);
			expect(validForest(p)).toBe(true);
			recordForest(p, task, task.answer);
			expect(p.attempts[0].mode).toBe("guided");
			expect(p.attempts[0].prompt).toContain(need(task.investigation).caption);
			expect(forestTaskView(p, task, "", "")).not.toContain("NaN");
		}
	});
});

it("does not classify teaching or cross-representation repetitions as fresh exit evidence", () => {
	const band = measureExit("laengen-messen", 2845, 0);
	expect(band.investigation?.identity).not.toEqual(["length", 13, 58]);
	const clock = measureExit("uhrzeit-zeitspannen", 43, 0);
	expect(clock.investigation?.identity).not.toEqual(["clock-read", 575]);
	const inverse = measureExit("uhrzeit-zeitspannen", 2691, 2);
	expect(inverse.investigation?.identity).not.toEqual([
		"time-endpoint",
		825,
		25,
	]);
	const p = freshForest("uhrzeit-zeitspannen");
	p.stage = "lab";
	const lab = measureLab("uhrzeit-zeitspannen", 0);
	recordForest(p, lab, lab.answer);
	p.stage = "exit";
	p.labGoals = [0, 1, 2];
	p.quiz = true;
	const read = { ...measureTask("uhrzeit-zeitspannen", 2, 43 ^ 0x3c6ef372, 0) };
	expect(read.investigation?.identity).toEqual(["clock-read", 575]);
	recordForest(p, read, read.answer);
	expect(p.attempts.at(-1)?.first).toBe(false);
});
it("shows distinct3-l and4-l supply states on the configured8-l scale", () => {
	const m = need(measureLab("schaetzen-sachprobleme", 1).model);
	const three = workshopView(m, [3], false),
		four = workshopView(m, [4], false);
	expect(three).toContain("8 000 ml");
	expect(four).toContain("8 000 ml");
	expect(three).not.toBe(four);
	expect(acceptsWorkshop(m, [3])).toBe(false);
	expect(acceptsWorkshop(m, [4])).toBe(true);
});
