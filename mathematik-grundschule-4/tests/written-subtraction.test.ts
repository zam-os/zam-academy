import { describe, expect, it } from "vitest";
import {
	bundleValue,
	freshSubtractionWork,
	subtractionAnswer,
	subtractionColumns,
	subtractionExit,
	subtractionLab,
	subtractionTask,
	subtractionValidation,
	unbundleSubtraction,
	subtractionMistake,
} from "../src/course/written-subtraction";
import { forestGraphic, forestTaskView } from "../src/course/view";
import { subtractionBoard } from "../src/course/subtraction-board";
import {
	activeForestTask,
	advanceForest,
	freshForest,
	independentForest,
	recordForest,
	validForest,
} from "../src/course/progress";
import { correctForest } from "../src/course/tasks";

const need = <T>(value: T | null | undefined): T => {
	if (value == null) throw new Error("Missing witness");
	return value;
};
const digits = (n: number) =>
	Array.from({ length: 7 }, (_, col) => Math.floor(n / 10 ** col) % 10);
describe("written subtraction", () => {
	it("matches independent whole-number and final-bundle oracles including the boundaries", () => {
		for (const [a, b] of [
			[0, 0],
			[1_000_000, 1],
			[1_000_000, 999999],
			[5002, 1786],
			[98765, 98765],
			[98765, 0],
			...Array.from({ length: 1500 }, (_, i) => {
				const a = (i * 7919) % 1_000_001;
				return [a, (i * 271) % (a + 1)];
			}),
		]) {
			const model = subtractionColumns(a, b),
				result = digits(a - b),
				bottom = digits(b);
			expect(model.result).toEqual(result);
			// In each column, the regrouped top is bottom plus the true result
			// digit. This oracle does not repeat the borrowing implementation.
			expect(model.bundles).toEqual(bottom.map((n, col) => n + result[col]));
			expect(bundleValue(model.bundles)).toBe(a);
			let top = digits(a);
			for (const col of model.exchanges) {
				const next = unbundleSubtraction(top, col);
				if (!next) throw new Error("Unreachable exchange witness");
				expect(bundleValue(next)).toBe(a);
				expect(next[col]).toBe(top[col] - 1);
				expect(next[col - 1]).toBe(top[col - 1] + 10);
				top = next;
			}
			expect(top).toEqual(model.bundles);
		}
		for (const [a, b] of [
			[1, 2],
			[-1, 0],
			[1.5, 1],
			[1000001, 0],
		])
			expect(() => subtractionColumns(a, b)).toThrow();
	});
	it("guarantees simpler guided tasks and transfer across zeros over 1500 seeds", () => {
		const variety = new Set<string>();
		for (let seed = 0; seed < 1500; seed++)
			for (let index = 0; index < 3; index++) {
				const easy = subtractionTask(1, seed, index),
					hard = subtractionTask(2, seed, index);
				if (!easy.calculation || !hard.calculation)
					throw new Error("Missing operands");
				const e = easy.calculation,
					h = hard.calculation,
					em = subtractionColumns(e.a, e.b),
					hm = subtractionColumns(h.a, h.b);
				expect(em.width).toBeGreaterThanOrEqual(4);
				expect(em.width).toBeLessThanOrEqual(5);
				expect(em.exchanges).toHaveLength(index);
				expect(String(h.a)).toHaveLength(6);
				expect(String(h.b)).toHaveLength(5);
				expect(digits(h.a)[1]).toBe(0);
				expect(hm.exchanges).toContain(2);
				expect(hm.exchanges).toContain(1);
				expect(h.a).toBeGreaterThanOrEqual(h.b);
				expect(h.a).toBeLessThanOrEqual(1000000);
				expect(hard.kind).toBe(["subtraction", "number", "subtraction"][index]);
				if (hard.subtraction?.shown !== undefined) {
					expect(hard.subtraction.shown).not.toBe(h.a - h.b);
					expect(hard.prompt).not.toContain("vertauscht");
				}
				expect(correctForest(easy, easy.answer)).toBe(true);
				expect(correctForest(hard, hard.answer)).toBe(true);
				variety.add(hard.prompt);
			}
		expect(variety.size).toBeGreaterThan(4000);
	});
	it("has three reachable lab witnesses with no pre-completed goal, including zero chains", () => {
		for (let goal = 0; goal < 3; goal++) {
			const task = subtractionLab(goal),
				c = task.subtraction;
			if (!c) throw new Error("Missing board");
			const work = freshSubtractionWork(c.a),
				model = subtractionColumns(c.a, c.b);
			expect(correctForest(task, subtractionAnswer(c.a, c.b, work))).toBe(
				false,
			);
			for (const col of model.exchanges)
				work.bundles = need(unbundleSubtraction(work.bundles, col));
			work.result = digits(c.a - c.b).map(String);
			expect(subtractionValidation(c.a, c.b, work)).toBeNull();
			expect(correctForest(task, subtractionAnswer(c.a, c.b, work))).toBe(true);
		}
		expect(subtractionColumns(10000, 1).bundles).toEqual([
			10, 9, 9, 9, 0, 0, 0,
		]);
		for (let seed = 0; seed < 80; seed++) {
			expect([0, 1, 2].map((i) => subtractionExit(seed, i).goal)).toEqual([
				1, 2, 3,
			]);
			expect(subtractionExit(seed, 2).subtraction?.shown).toBeDefined();
		}
	});
	it("checks the actual regrouping as well as every result digit", () => {
		const task = subtractionLab(1),
			work = freshSubtractionWork(5342);
		expect(subtractionValidation(5342, 1218, work)).toContain("Fülle");
		work.result = digits(4124).map(String);
		expect(subtractionValidation(5342, 1218, work)).toContain(
			"Zeige auch das Entbündeln",
		);
		expect(correctForest(task, subtractionAnswer(5342, 1218, work))).toBe(
			false,
		);
		expect(
			subtractionMistake(task, subtractionAnswer(5342, 1218, work)),
		).toContain("Einerspalte");
		work.bundles = need(unbundleSubtraction(work.bundles, 1));
		expect(correctForest(task, subtractionAnswer(5342, 1218, work))).toBe(true);
		const over = {
			bundles: need(unbundleSubtraction(work.bundles, 3)),
			result: [...work.result],
		};
		expect(subtractionValidation(5342, 1218, over)).toContain(
			"Bündel zurücksetzen",
		);
		work.result[0] = "16";
		expect(subtractionAnswer(5342, 1218, work)).toBeNull();
		work.result[0] = "4";
		work.bundles[0]++;
		expect(subtractionAnswer(5342, 1218, work)).toBeNull();
		expect(unbundleSubtraction(digits(10000), 1)).toBeNull();
		expect(unbundleSubtraction(digits(10000), 0)).toBeNull();
	});
	it("hides the answer and exposes keyboard buttons, place labels and a separate live error", () => {
		const html = subtractionBoard({ a: 5002, b: 1786 });
		const p = freshForest("schriftlich-subtrahieren");
		p.stage = "lab";
		const view = forestTaskView(p, subtractionLab(0), "", "");
		expect(view).toContain('data-action="forest-check"');
		expect(view).not.toContain('id="forest-answer"');
		const probe = forestGraphic(subtractionTask(2, 42, 1));
		expect(probe).toContain('aria-label="Additionsprobe"');
		expect(probe).toContain("<b>+</b>");
		expect(probe).not.toContain("<b>−</b>");
		expect(html).not.toContain("3 216");
		expect(html).not.toContain('value="6"');
		expect(html).toContain('aria-label="1 T in 10 H tauschen"');
		expect(html).toContain('aria-label="Ergebnis Einer (E)"');
		expect(html).toContain('id="subtraction-input-error" role="status"></p>');
		expect(html).toContain('id="subtraction-input-note"');
		const model = subtractionColumns(5002, 1786);
		expect(
			subtractionBoard(
				{ a: 5002, b: 1786 },
				{ bundles: model.bundles, result: model.result.map(String) },
				true,
			),
		).not.toContain("<input");
	});
	it("isolates saved work, rejects corrupt or wrong-task bundles and resets it on advancement", () => {
		const p = freshForest("schriftlich-subtrahieren", 1000),
			old = freshForest("schriftlich-addieren", 1000);
		expect(p.subtractionWork).toBeNull();
		expect(old.subtractionWork).toBeUndefined();
		expect(validForest(old)).toBe(true);
		expect(validForest(p)).toBe(true);
		p.stage = "lab";
		const task = activeForestTask(p);
		if (!task?.subtraction) throw new Error("Missing lab");
		p.subtractionWork = freshSubtractionWork(task.subtraction.a);
		expect(validForest(p)).toBe(true);
		for (const bad of [
			undefined,
			{},
			{ bundles: [1], result: [] },
			{ bundles: Array(7).fill(0), result: Array(7).fill("") },
			{ bundles: digits(task.subtraction.a), result: Array(7).fill("10") },
		])
			expect(validForest({ ...p, subtractionWork: bad })).toBe(false);
		recordForest(p, task, task.answer);
		expect(advanceForest(p)).toBe(true);
		expect(p.subtractionWork).toBeNull();
		expect(validForest(p)).toBe(true);
	});
	it("treats repeated calculations and inverse probes as familiar evidence", () => {
		const p = freshForest("schriftlich-subtrahieren", 1000),
			task = subtractionTask(2, 42, 0);
		p.stage = "practice-2";
		recordForest(p, task, task.answer);
		p.stage = "exit";
		recordForest(
			p,
			{ ...task, prompt: "Prüfe dieselbe Rechnung noch einmal." },
			task.answer,
		);
		expect(independentForest(need(p.attempts.at(-1)))).toBe(false);
		const c = need(task.calculation);
		p.index = 1;
		recordForest(
			p,
			{ ...task, calculation: { a: c.a - c.b, b: c.b, op: "+" } },
			task.answer,
		);
		expect(independentForest(need(p.attempts.at(-1)))).toBe(false);
	});
});
