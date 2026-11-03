import { describe, expect, it } from "vitest";
import { combinationBoard } from "../src/course/combination-board";
import {
	allowedCombination,
	combinationCode,
	combinationExit,
	combinationIdentity,
	combinationLab,
	combinationTask,
	combinationTuples,
	validCombinationChoice,
} from "../src/course/combinations";
import { divisorExit, divisorLab, divisorTask } from "../src/course/divisors";
import {
	advanceForest,
	freshForest,
	independentForest,
	recordForest,
	validForest,
} from "../src/course/progress";
import { correctForest } from "../src/course/tasks";

const required = <T>(v: T | null | undefined): T => {
	if (v == null) throw new Error("Expected model");
	return v;
};

describe("Systematic combinations", () => {
	it("enumerates a Cartesian product exactly once, with an independent nested-loop oracle", () => {
		for (const level of [1, 2] as const)
			for (let i = 0; i < 240; i++) {
				const t = combinationTask(level, i * 7919, i),
					m = required(t.combination),
					tuples = combinationTuples(m);
				const all: number[] = [],
					allowed: number[] = [];
				for (let a = 0; a < m.axes[0].options.length; a++)
					for (let b = 0; b < m.axes[1].options.length; b++)
						for (let c = 0; c < (m.axes[2]?.options.length ?? 1); c++) {
							const code =
								m.axes.length === 2
									? (a + 1) * 10 + b + 1
									: (a + 1) * 100 + (b + 1) * 10 + c + 1;
							all.push(code);
							if (!m.restricted || a !== 0 || b === 0) allowed.push(code);
						}
				expect(t.numbers).toEqual(all);
				expect(t.answer).toEqual(allowed);
				expect(new Set(tuples.map(combinationCode)).size).toBe(tuples.length);
				expect(tuples.length).toBeLessThanOrEqual(12);
				expect(correctForest(t, [...allowed].reverse())).toBe(true);
				expect(correctForest(t, [])).toBe(false);
				if (m.restricted) {
					expect(allowed.length).toBeLessThan(all.length);
					expect(correctForest(t, all)).toBe(false);
				}
			}
	});
	it("provides three lab goals, changes the transfer structure and keeps exit contexts separate", () => {
		for (let i = 0; i < 3; i++) {
			const lab = combinationLab(i);
			expect(lab.goal).toBe(i + 1);
			expect(combinationExit(42, i).goal).toBe(i + 1);
			expect(correctForest(lab, lab.answer)).toBe(true);
			expect(correctForest(lab, null)).toBe(false);
			expect(combinationTask(1, 42, i).combination).not.toEqual(
				combinationTask(2, 42, i).combination,
			);
		}
		const teaching = new Set(["T-Shirt", "Hose"]);
		for (let seed = 0; seed < 150; seed++)
			for (let i = 0; i < 3; i++) {
				const exit = required(combinationExit(seed, i).combination);
				for (const level of [1, 2] as const) {
					const practice = required(
						combinationTask(level, seed, i).combination,
					);
					expect(combinationIdentity(exit)).not.toBe(
						combinationIdentity(practice),
					);
					for (const a of practice.axes)
						expect(teaching.has(a.label)).toBe(false);
				}
			}
	});
	it("canonicalizes presentation order but retains actual restrictions", () => {
		const m = required(combinationLab(1).combination);
		const reordered = {
			axes: [...m.axes]
				.reverse()
				.map((a) => ({ ...a, options: [...a.options].reverse() })),
			restricted: false,
		};
		expect(combinationIdentity(m)).toBe(combinationIdentity(reordered));
		const p = freshForest("systematisch-kombinieren");
		p.stage = "exit";
		const task = combinationLab(1);
		recordForest(p, task, task.answer);
		p.index = 1;
		recordForest(p, { ...task, combination: reordered }, task.answer);
		expect(independentForest(required(p.attempts.at(-1)))).toBe(false);
		expect(combinationIdentity({ ...m, restricted: true })).not.toBe(
			combinationIdentity(m),
		);
	});
	it("records the actual choice rows in stable parent evidence", () => {
		const p = freshForest("systematisch-kombinieren");
		p.stage = "lab";
		const task = combinationLab(1);
		recordForest(p, task, task.answer);
		const snapshot = required(p.attempts.at(-1)).prompt;
		for (const axis of required(task.combination).axes) {
			expect(snapshot).toContain(axis.label);
			for (const option of axis.options) expect(snapshot).toContain(option);
		}
	});
	it("validates current builder choices and entered rows, and clears them on advance", () => {
		const p = freshForest("systematisch-kombinieren");
		p.stage = "lab";
		const t = combinationLab(0),
			m = required(t.combination);
		for (const invalid of [[0], [-2, 0], [0, 3], [0, NaN], [0, 1, 0]])
			expect(validCombinationChoice(invalid, m)).toBe(false);
		p.combinationChoice = [0, -1];
		p.selection = [11];
		expect(validForest(p)).toBe(true);
		p.selection = [999];
		expect(validForest(p)).toBe(false);
		p.selection = [11, 11];
		expect(validForest(p)).toBe(false);
		p.selection = [11];
		recordForest(p, t, t.answer);
		expect(advanceForest(p)).toBe(true);
		expect(p.combinationChoice).toBeNull();
		expect(p.selection).toEqual([]);
		expect(validForest(p)).toBe(true);
	});
	it("does not render all expected tuples before the child constructs them", () => {
		const m = required(combinationLab(0).combination),
			html = combinationBoard(m, null, []);
		expect(html).toContain("Hier ist noch nichts eingetragen.");
		expect(html).not.toContain("Tulpe + Tontopf");
		expect(combinationBoard(m, [0, 0], [11])).toContain("Tulpe + Tontopf");
		expect(combinationBoard(m, [0, 0], [11], true)).not.toContain(
			"forest-combination-choice",
		);
		expect(allowedCombination({ ...m, restricted: true }, [0, 1])).toBe(false);
	});
});

describe("Divisors and multiples", () => {
	it("agrees with division and repeated-addition oracles on both levels", () => {
		for (const level of [1, 2] as const)
			for (let i = 0; i < 300; i++) {
				const task = divisorTask(level, i * 9973, i);
				expect(correctForest(task, task.answer)).toBe(true);
				if (task.divisorTotal) {
					const wanted: number[] = [];
					for (let d = 1; d <= 10; d++)
						if (task.divisorTotal / d === Math.floor(task.divisorTotal / d))
							wanted.push(d);
					expect(task.answer).toEqual(wanted);
					expect(correctForest(task, [...wanted].reverse())).toBe(true);
					if (level === 2) expect(task.divisorTotal).toBeGreaterThan(100);
				} else {
					const board = required(task.investigation),
						[kind, a, b] = board.identity;
					if (kind === "divisor-check") {
						const total = Number(a),
							size = Number(b),
							q = Math.floor(total / size),
							r = total - q * size;
						expect(task.answer).toEqual([q, r, 1]);
						expect(size).toBeGreaterThan(0);
						expect(size).toBeLessThanOrEqual(10);
						if (level === 2) expect(q).toBeGreaterThan(10);
					} else {
						let sum = 0;
						const values: number[] = [];
						for (let n = 1; n < Number(b) + 5; n++) {
							sum += Number(a);
							if (n >= Number(b)) values.push(sum);
						}
						const holes = level === 1 ? [2, 3, 4] : [1, 3, 4];
						expect(task.answer).toEqual(holes.map((h) => values[h]));
					}
				}
			}
	});
	it("requires all three skills at lab and fresh exits without preset success", () => {
		for (let i = 0; i < 3; i++)
			for (const task of [divisorLab(i), divisorExit(97, i)]) {
				expect(task.goal).toBe(i + 1);
				expect(correctForest(task, null)).toBe(false);
				expect(correctForest(task, task.answer)).toBe(true);
			}
	});
	it("does not reuse a divisor total under a context change as independent evidence", () => {
		const p = freshForest("teiler-vielfache");
		p.stage = "exit";
		const t = divisorLab(2);
		recordForest(p, t, t.answer);
		p.index = 1;
		recordForest(
			p,
			{ ...t, prompt: "The same quantity in a different story" },
			t.answer,
		);
		expect(independentForest(required(p.attempts.at(-1)))).toBe(false);
	});
});
