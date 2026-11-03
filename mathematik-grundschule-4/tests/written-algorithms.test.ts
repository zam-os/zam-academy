import { describe, it, expect } from "vitest";
import {
	algorithmModel,
	algorithmAnswer,
	algorithmValidation,
	algorithmLab,
	algorithmTask,
	algorithmExit,
	algorithmMistake,
	algorithmExplanation,
	ALGORITHM_EXAMPLES,
	type Algorithm,
} from "../src/course/written-algorithms";
import { algorithmBoard } from "../src/course/algorithm-board";
import {
	activeForestTask,
	advanceForest,
	freshForest,
	recordForest,
	validForest,
	independentForest,
} from "../src/course/progress";
import { forestTaskView, forestTeacherPanel } from "../src/course/view";
import { forestLesson } from "../src/course/catalog";
import { correctForest } from "../src/course/tasks";
const ids = ["schriftlich-multiplizieren", "schriftlich-dividieren"] as const;
const need = <T>(value: T | null | undefined): T => {
	if (value == null) throw new Error("Missing model witness");
	return value;
};
describe("written multiplication and division", () => {
	it("matches whole-number multiplication and independent carry oracles", () => {
		for (let seed = 0; seed < 1200; seed++)
			for (const level of [1, 2] as const)
				for (let index = 0; index < 3; index++) {
					const algorithm = need(
							algorithmTask(ids[0], level, seed, index).algorithm,
						),
						m = algorithmModel(algorithm);
					expect(m.result).toBe(algorithm.a * algorithm.b);
					expect(m.result).toBeLessThanOrEqual(1_000_000);
					const partials = m.rows
						.slice(0, algorithm.b < 10 ? 1 : 2)
						.map((row, shift) => {
							const factor = Math.floor(algorithm.b / 10 ** shift) % 10;
							const value =
								row.result.reduce(
									(s, i, col) => s + m.answer[i] * 10 ** col,
									0,
								) *
								10 ** shift;
							expect(value).toBe(algorithm.a * factor * 10 ** shift);
							for (let col = 1; col < row.width; col++)
								expect(m.answer[row.carries[col]]).toBe(
									Math.floor(((algorithm.a % 10 ** col) * factor) / 10 ** col),
								);
							return value;
						});
					expect(partials.reduce((a, b) => a + b, 0)).toBe(m.result);
					const last = m.rows.at(-1);
					if (algorithm.b >= 10 && last)
						expect(
							last.result.reduce((s, i, col) => s + m.answer[i] * 10 ** col, 0),
						).toBe(m.result);
					expect(algorithmAnswer(algorithm, m.answer.map(String))).toEqual(
						m.answer,
					);
					expect(m.fields.every((f) => f.value >= 0 && f.value <= f.max)).toBe(
						true,
					);
					if (level === 1 && index === 0)
						expect(
							m.fields.filter((f) => f.blankZero).every((f) => f.value === 0),
						).toBe(true);
					if (level === 1) expect(algorithm.b).toBeLessThan(10);
					else expect(algorithm.b).toBeGreaterThanOrEqual(10);
					if (level === 2 && index === 1) expect(algorithm.b % 10).toBe(0);
				}
	});
	it("handles zero multiplication without inventing division by zero", () => {
		for (const [a, b] of [
			[1234, 0],
			[0, 99],
			[1000000, 1],
			[10101, 99],
		]) {
			const algorithm: Algorithm = { kind: "multiply", a, b },
				m = algorithmModel(algorithm);
			expect(m.result).toBe(a * b);
			expect(algorithmExplanation(algorithm)).not.toMatch(/\d\s*:\s*0\s*=/);
			if (b >= 10)
				expect(algorithmExplanation(algorithm)).not.toContain(`: ${b} =`);
		}
		for (const algorithm of [
			{ kind: "divide", a: 1, b: 0 },
			{ kind: "divide", a: 1, b: 11 },
			{ kind: "multiply", a: 1000000, b: 2 },
		] as Algorithm[])
			expect(() => algorithmModel(algorithm)).toThrow();
	});
	it("matches Euclidean division and prefix invariants with zeros and rest", () => {
		for (let seed = 0; seed < 1200; seed++)
			for (const level of [1, 2] as const)
				for (let index = 0; index < 3; index++) {
					const algorithm = need(
							algorithmTask(ids[1], level, seed, index).algorithm,
						),
						m = algorithmModel(algorithm);
					expect(m.result * algorithm.b + m.remainder).toBe(algorithm.a);
					expect(m.remainder).toBeLessThan(algorithm.b);
					let prefix = 0,
						quotient = 0,
						priorRest = 0;
					for (const step of m.steps) {
						const [current, q, product, rest] = step.indices.map(
							(i) => m.answer[i],
						);
						prefix = prefix * 10 + step.digit;
						quotient = quotient * 10 + q;
						expect(current).toBe(priorRest * 10 + step.digit);
						expect(product).toBe(q * algorithm.b);
						expect(current - product).toBe(rest);
						expect(prefix).toBe(quotient * algorithm.b + rest);
						expect(rest).toBeLessThan(algorithm.b);
						priorRest = rest;
					}
					expect(quotient).toBe(Math.floor(algorithm.a / algorithm.b));
					if (level === 1) expect(m.remainder).toBe(0);
					else {
						expect(String(m.result)).toMatch(/0/);
						if (index !== 1) expect(m.remainder).toBeGreaterThan(0);
						else expect(algorithm.b).toBe(10);
					}
				}
		for (const [a, b] of [
			[0, 1],
			[0, 10],
			[1_000_000, 10],
			[1_000_000, 3],
			[1, 10],
			[2417, 8],
		]) {
			const m = algorithmModel({ kind: "divide", a, b });
			expect(m.result * b + m.remainder).toBe(a);
			expect(m.remainder).toBeLessThan(b);
		}
	});
	it("validates every multiplication digit, carry and shifted partial product", () => {
		const algorithm: Algorithm = { kind: "multiply", a: 204, b: 23 },
			m = algorithmModel(algorithm),
			work = m.answer.map(String);
		for (let i = 0; i < work.length; i++)
			if (m.fields[i].blankZero && m.fields[i].value === 0) work[i] = "";
		expect(algorithmAnswer(algorithm, work)).toEqual(m.answer);
		for (const index of m.rows[1].result) {
			const wrong = [...work];
			wrong[index] = String((m.answer[index] + 1) % 10);
			expect(algorithmAnswer(algorithm, wrong)).not.toEqual(m.answer);
		}
		const carry = algorithmModel({ kind: "multiply", a: 347, b: 6 });
		const missing = carry.answer.map((value, i) =>
			carry.fields[i].blankZero ? "" : String(value),
		);
		expect(
			algorithmValidation({ kind: "multiply", a: 347, b: 6 }, missing),
		).toContain("Trage auch deine Überträge");
		missing[carry.rows[0].carries[1]] = "0";
		expect(
			algorithmValidation({ kind: "multiply", a: 347, b: 6 }, missing),
		).toBeNull();
		expect(
			algorithmAnswer({ kind: "multiply", a: 347, b: 6 }, missing),
		).not.toEqual(carry.answer);
	});
	it("requires the quotient zeros, intermediate subtraction and final remainder", () => {
		const a: Algorithm = { kind: "divide", a: 1259, b: 6 },
			m = algorithmModel(a),
			work = m.answer.map(String);
		expect(algorithmValidation(a, Array(m.fields.length).fill(""))).toContain(
			"Fülle",
		);
		for (let index = 0; index < work.length; index++) {
			const blank = [...work];
			blank[index] = "";
			expect(algorithmAnswer(a, blank)).toBeNull();
			const wrong = [...work];
			wrong[index] = String((m.answer[index] + 1) % (m.fields[index].max + 1));
			if (wrong[index] !== work[index])
				expect(algorithmAnswer(a, wrong)).not.toEqual(m.answer);
		}
		expect(algorithmAnswer(a, work)).toEqual(m.answer);
		const task = algorithmLab(ids[1], 2),
			wrong = [...m.answer];
		wrong[m.steps[0].indices[3]] = 6;
		expect(algorithmMistake(task, wrong)).toContain("Rest muss kleiner");
	});
	it("has three reachable labs and fresh exits with a real correction board", () => {
		for (const id of ids)
			for (let goal = 0; goal < 3; goal++) {
				const task = algorithmLab(id, goal),
					a = need(task.algorithm),
					m = algorithmModel(a);
				expect(
					correctForest(
						task,
						algorithmAnswer(a, Array(m.fields.length).fill("")),
					),
				).toBe(false);
				expect(
					correctForest(task, algorithmAnswer(a, m.answer.map(String))),
				).toBe(true);
			}
		for (const id of ids)
			for (let seed = 0; seed < 80; seed++) {
				expect([0, 1, 2].map((i) => algorithmExit(id, seed, i).goal)).toEqual([
					1, 2, 3,
				]);
				const last = algorithmExit(id, seed, 2),
					a = need(last.algorithm),
					m = algorithmModel(a);
				expect(last.kind).toBe("algorithm");
				expect(a.shown).toBeDefined();
				expect(a.shown).not.toBe(m.result);
				expect(last.prompt).not.toContain(
					id === ids[0] ? "verschoben" : "vergessen",
				);
			}
	});
	it("withholds answers, labels every editable field and shows worked examples read-only", () => {
		for (const id of ids) {
			const task = algorithmLab(id, 2),
				a = need(task.algorithm),
				m = algorithmModel(a),
				p = freshForest(id);
			p.stage = "lab";
			p.index = 2;
			const html = algorithmBoard(a),
				view = forestTaskView(p, task, "", "");
			expect(html).not.toMatch(/value="\d/);
			expect(html).toContain('id="algorithm-input-error" role="status"></p>');
			for (const f of m.fields)
				expect(html).toContain(`aria-label="${f.label}"`);
			expect(view).toContain('data-action="forest-check"');
			expect(view).not.toContain('id="forest-answer"');
			expect(algorithmBoard(a, m.answer.map(String), true)).not.toContain(
				"<input",
			);
		}
		const shifted = algorithmBoard({ kind: "multiply", a: 204, b: 23 });
		expect(shifted).toContain(
			'aria-label="Feste 0 in der Einerstelle der Zehnerreihe"',
		);
		expect(shifted).toContain('class="algorithm-preview"');
	});
	it("rejects malformed work, isolates lesson documents and clears each finished task", () => {
		for (const id of ids) {
			const p = freshForest(id);
			expect(p.algorithmWork).toBeNull();
			expect(validForest(p)).toBe(true);
			p.stage = "lab";
			const task = need(activeForestTask(p)),
				a = need(task.algorithm),
				m = algorithmModel(a);
			p.algorithmWork = Array(m.fields.length).fill("");
			expect(validForest(p)).toBe(true);
			for (const bad of [
				undefined,
				[],
				Array(m.fields.length).fill("999"),
				Array(m.fields.length).fill("-1"),
			])
				expect(validForest({ ...p, algorithmWork: bad })).toBe(false);
			recordForest(p, task, task.answer);
			expect(advanceForest(p)).toBe(true);
			expect(p.algorithmWork).toBeNull();
			expect(validForest(p)).toBe(true);
		}
		expect(
			freshForest("schriftlich-subtrahieren").algorithmWork,
		).toBeUndefined();
	});
	it("does not award independent evidence for a repeated calculation", () => {
		for (const id of ids) {
			const p = freshForest(id),
				task = algorithmTask(id, 2, 9876, 0);
			p.stage = "practice-2";
			recordForest(p, task, task.answer);
			p.stage = "exit";
			recordForest(
				p,
				{ ...task, prompt: "Verbessere dieselbe Rechnung." },
				task.answer,
			);
			expect(independentForest(need(p.attempts.at(-1)))).toBe(false);
		}
	});
	it("explains the calculation and outgoing carry at every place without reusing the incoming carry", () => {
		const text = algorithmExplanation({ kind: "multiply", a: 347, b: 6 });
		expect(text).toContain("E: 7 · 6 = 42; schreibe 2, übertrage 4 zu Z");
		expect(text).toContain(
			"Z: 4 · 6 + 4 ankommender Übertrag = 28; schreibe 8, übertrage 2 zu H",
		);
		expect(text).toContain(
			"H: 3 · 6 + 2 ankommender Übertrag = 20; schreibe 0, übertrage 2 zu T",
		);
		expect(text).toContain(
			"T: 0 · 6 + 2 ankommender Übertrag = 2; schreibe 2, kein weiterer Übertrag",
		);
		for (const [a, b] of [
			[10101, 99],
			[99999, 9],
			[1000000, 1],
		])
			expect(
				algorithmExplanation({ kind: "multiply", a, b }).length,
			).toBeLessThanOrEqual(4000);
	});
	it("distinguishes unnecessary, excessive and missing carries in partial products and their sum", () => {
		for (const algorithm of [
			{ kind: "multiply", a: 213, b: 3 },
			{ kind: "multiply", a: 204, b: 23 },
		] as Algorithm[]) {
			const m = algorithmModel(algorithm),
				row = need(m.rows.at(-1));
			const wrong = [...m.answer];
			wrong[row.carries[1]] = 1;
			const task = { ...algorithmLab(ids[0], 0), algorithm, answer: m.answer };
			expect(algorithmValidation(algorithm, wrong.map(String))).toBeNull();
			expect(algorithmMistake(task, wrong)).toContain("kein voller Zehner");
			expect(algorithmMistake(task, wrong)).toContain("leer oder schreibe 0");
			const fixed = wrong.map(String);
			fixed[row.carries[1]] = "";
			expect(algorithmAnswer(algorithm, fixed)).toEqual(m.answer);
		}
		const task = algorithmLab(ids[0], 1),
			algorithm = need(task.algorithm),
			m = algorithmModel(algorithm);
		const index = m.rows[0].carries[2],
			high = [...m.answer],
			low = [...m.answer];
		high[index]++;
		low[index]--;
		expect(algorithmMistake(task, high)).toContain("Übertrag ist zu groß");
		expect(algorithmMistake(task, high)).not.toContain("kein voller Zehner");
		expect(algorithmMistake(task, low)).toContain("Übertrag ist zu klein");
	});
	it("keeps teaching examples separate from every lab calculation, including the collapsed panel", () => {
		for (const id of ids) {
			const lesson = need(forestLesson(id)),
				panel = forestTeacherPanel(lesson).replace(/\s/g, "");
			for (let goal = 0; goal < 3; goal++) {
				const lab = need(algorithmLab(id, goal).algorithm),
					op = lab.kind === "multiply" ? "·" : ":";
				expect(panel).not.toContain(`${lab.a}${op}${lab.b}`);
				const example = ALGORITHM_EXAMPLES[lab.kind];
				expect([example.a, example.b]).not.toEqual([lab.a, lab.b]);
			}
		}
	});
	it("labels the full-tens zero row and keeps carry instructions out of division", () => {
		const zero = algorithmBoard({ kind: "multiply", a: 123, b: 40 });
		expect(zero).toContain("Nullreihe");
		expect(zero).toContain("ändert die Nullreihe die Summe nicht");
		const division: Algorithm = { kind: "divide", a: 2138, b: 7 };
		expect(algorithmBoard(division)).not.toContain("Übertragsfelder");
		expect(algorithmValidation(division, [])).not.toContain("Übertragsfelder");
	});
});
