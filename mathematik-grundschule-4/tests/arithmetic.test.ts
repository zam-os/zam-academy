import { describe, expect, it } from "vitest";
import { FOREST_LESSONS } from "../src/course/catalog";
import { arithmeticLab, arithmeticTask } from "../src/course/arithmetic";
import {
	forestExit,
	forestMistake,
	correctForest,
	forestInput,
} from "../src/course/tasks";
import { forestGraphic, forestTaskView } from "../src/course/view";
import {
	activeForestTask,
	recordForest,
	independentForest,
	freshForest,
} from "../src/course/progress";

const ids = [
	"geschickt-addieren",
	"geschickt-subtrahieren",
	"malnehmen-teilen",
] as const;
const numeral = (n: string) => Number(n.replace(/\s/g, ""));
describe("arithmetic strategies and equal groups", () => {
	it("matches independent operation oracles across 240 seeds per level and lesson", () => {
		for (const id of ids)
			for (const level of [1, 2] as const) {
				const kinds = new Set<string>();
				for (let seed = 0; seed < 240; seed++)
					for (let i = 0; i < 3; i++) {
						const task = arithmeticTask(id, level, seed * 7919, i);
						kinds.add(task.kind);
						if (!task.calculation) continue;
						const { a, b, op } = task.calculation;
						const oracle =
							op === "+"
								? a + b
								: op === "−"
									? a - b
									: op === "·"
										? a * b
										: a / b;
						expect(task.answer).toBe(oracle);
						if (op === "·" && b < 10)
							expect(task.prompt).not.toContain(`= ${oracle}`);
						expect(Number.isInteger(oracle)).toBe(true);
						expect(oracle).toBeGreaterThanOrEqual(0);
						expect(oracle).toBeLessThanOrEqual(1_000_000);
						expect(forestInput(String(oracle))).toBe(oracle);
						expect(correctForest(task, oracle + 1)).toBe(false);
						if (op === ":") expect(b).toBeGreaterThan(0);
					}
				expect(kinds.has("choice")).toBe(level === 2);
			}
	});
	it("uses the correct direction and amount for both kinds of compensation", () => {
		for (const id of ids.slice(0, 2))
			for (let seed = 0; seed < 160; seed++) {
				const task = arithmeticTask(id, 2, seed, 2);
				const match = task.prompt.match(
					/Für ([\d\s]+) ([+−]) ([\d\s]+) rechnet Milo zuerst ([\d\s]+) ([+−]) ([\d\s]+) = ([\d\s]+)\./,
				);
				if (!match) throw new Error(task.prompt);
				const a = numeral(match[1]),
					b = numeral(match[3]),
					helper = numeral(match[6]),
					interim = numeral(match[7]);
				const delta = helper - b;
				expect(delta).toBeGreaterThan(0);
				expect(interim).toBe(match[2] === "+" ? a + helper : a - helper);
				expect(
					task.choices?.find((c) => c.value === task.answer)?.label,
				).toContain(match[2] === "+" ? "abziehen" : "dazugeben");
				expect(task.explanation.replace(/\s/g, " ")).toContain(
					String(match[2] === "+" ? a + b : a - b).replace(
						/\B(?=(\d{3})+(?!\d))/g,
						" ",
					),
				);
			}
	});
	it("has independent lab witnesses and truthful readouts at all eleven positions", () => {
		const targets = [
			[6, 3, 1],
			[4, 5, 3],
			[6, 7, 8],
		];
		const finalValues = [
			[38000, 27100, 48900],
			[8000, 29700, 47300],
			[24, 42, 3200],
		];
		for (let lesson = 0; lesson < ids.length; lesson++)
			for (let goal = 0; goal < 3; goal++) {
				const task = arithmeticLab(ids[lesson], goal);
				expect(correctForest(task, 0)).toBe(false);
				expect(correctForest(task, targets[lesson][goal])).toBe(true);
				for (let position = 0; position <= 10; position++) {
					const value = task.hops
						? task.hops.start + task.hops.direction * position * task.hops.unit
						: position * (task.groups?.each ?? 0);
					expect(value).toBeGreaterThanOrEqual(0);
					expect(Number.isFinite(value)).toBe(true);
					expect(forestGraphic(task, position).replace(/\s/g, " ")).toContain(
						`>${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</strong>`,
					);
					if (position === targets[lesson][goal])
						expect(value).toBe(finalValues[lesson][goal]);
				}
			}
	});
	it("keeps independent checks aligned with all three lesson goals", () => {
		for (const id of ids)
			for (let seed = 0; seed < 40; seed++) {
				expect([0, 1, 2].map((i) => forestExit(id, seed, i).goal)).toEqual([
					1, 2, 3,
				]);
			}
	});
	it("gives targeted hints for opposite operations and incorrect bundle sizes", () => {
		const add = arithmeticTask(ids[0], 1, 2, 0),
			sub = arithmeticTask(ids[1], 1, 2, 0),
			mul = arithmeticTask(ids[2], 1, 2, 0),
			div = arithmeticTask(ids[2], 1, 2, 1);
		for (const task of [add, sub, mul, div]) {
			const c = task.calculation;
			if (!c) throw new Error("Missing task operands");
			const wrong =
				c.op === "+"
					? Math.abs(c.a - c.b)
					: c.op === "−" || c.op === "·"
						? c.a + c.b
						: c.a - c.b;
			expect(forestMistake(task, wrong)).not.toBe(task.hint);
		}
		expect(forestMistake(mul, Number(mul.answer) * 10)).toContain(
			"Bündelgröße",
		);
	});
	it("shows task operands without printing the answer before a numeric response", () => {
		for (const id of ids) {
			const task = arithmeticTask(id, 1, 987654, 0);
			expect(forestGraphic(task)).toContain('class="missing-part">?</span>');
			expect(forestGraphic(task)).not.toContain(
				`<strong>${task.answer}</strong>`,
			);
		}
	});
	it("names model controls by their effect, including backwards calculation jumps", () => {
		for (const id of ids) {
			const p = freshForest(id, 1000);
			p.stage = "lab";
			const view = forestTaskView(p, arithmeticLab(id, 0), "", "");
			expect(view).toContain(
				id === "malnehmen-teilen"
					? "Einen Korb hinzufügen"
					: "Einen Sprung hinzufügen",
			);
			expect(view).toContain('type="range"');
		}
		expect(
			FOREST_LESSONS.filter((l) => ids.includes(l.id as (typeof ids)[number])),
		).toHaveLength(3);
	});
});

describe("arithmetic evidence regressions", () => {
	it("does not turn a reworded or commuted calculation into fresh evidence", () => {
		const p = freshForest("malnehmen-teilen", 1000);
		p.stage = "practice-1";
		const guided = arithmeticTask(p.lesson as "malnehmen-teilen", 1, 88, 0);
		recordForest(p, guided, guided.answer);
		p.stage = "exit";
		const reworded = forestExit(p.lesson, 88 + 15485863, 0);
		expect(reworded.calculation).toEqual(guided.calculation);
		expect(reworded.prompt).not.toBe(guided.prompt);
		recordForest(p, reworded, reworded.answer);
		expect(independentForest(p.attempts[p.attempts.length - 1])).toBe(false);
		const c = guided.calculation;
		if (!c) throw new Error("Missing operands");
		p.index++;
		recordForest(
			p,
			{
				...guided,
				prompt: "Vertauschte Faktoren",
				calculation: { ...c, a: c.b, b: c.a },
			},
			guided.answer,
		);
		expect(independentForest(p.attempts[p.attempts.length - 1])).toBe(false);
	});
	it("does not count a basket fact already displayed in the lab or its inverse as fresh", () => {
		const p = freshForest("malnehmen-teilen", 1000);
		p.stage = "lab";
		const lab = arithmeticLab("malnehmen-teilen", 0);
		recordForest(p, lab, 6);
		p.stage = "exit";
		const repeated = forestExit(p.lesson, 290 + 15485863, 0);
		expect(repeated.calculation).toEqual({ a: 6, b: 4, op: "·" });
		recordForest(p, repeated, 24);
		expect(independentForest(p.attempts[p.attempts.length - 1])).toBe(false);
		p.index++;
		recordForest(
			p,
			{ ...repeated, calculation: { a: 24, b: 6, op: ":" }, answer: 4 },
			4,
		);
		expect(independentForest(p.attempts[p.attempts.length - 1])).toBe(false);
	});
	it("records compensation and inverse-division quizzes against their actual goals", () => {
		for (const [id, goal] of [
			["geschickt-addieren", 3],
			["geschickt-subtrahieren", 3],
			["malnehmen-teilen", 2],
		] as const) {
			const p = freshForest(id, 1000);
			p.stage = "quiz";
			expect(activeForestTask(p)?.goal).toBe(goal);
		}
	});
});
