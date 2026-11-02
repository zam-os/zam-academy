import { describe, expect, it } from "vitest";
import {
	additionColumns,
	columnAnswer,
	emptyColumnWork,
	writtenExit,
	writtenLab,
	writtenTask,
	writtenMistake,
	columnValidation,
	columnOrder,
} from "../src/course/written-addition";
import { columnBoard } from "../src/course/column-board";
import { correctForest } from "../src/course/tasks";
import {
	activeForestTask,
	advanceForest,
	freshForest,
	independentForest,
	recordForest,
	validForest,
} from "../src/course/progress";

const amount = (digits: readonly number[]) =>
	digits.slice(0, 7).reduce((sum, digit, col) => sum + digit * 10 ** col, 0);
describe("written addition", () => {
	it("agrees with whole-number and modular carry oracles over both levels", () => {
		for (const level of [1, 2] as const)
			for (let seed = 0; seed < 160; seed++)
				for (let index = 0; index < 3; index++) {
					const task = writtenTask(level, seed * 7919, index),
						c = task.columns;
					if (!c) throw new Error("Missing column operands");
					const m = additionColumns(c.a, c.b);
					expect(amount(m.answer)).toBe(c.a + c.b);
					expect(c.a + c.b).toBeLessThanOrEqual(1_000_000);
					for (let col = 1; col < 7; col++) {
						const unit = 10 ** col;
						expect(m.carries[col]).toBe(
							Math.floor(((c.a % unit) + (c.b % unit)) / unit),
						);
					}
					expect(m.totals.every(Number.isFinite)).toBe(true);
					if (task.kind === "columns")
						expect(columnAnswer(c.a, c.b, m.answer.map(String))).toEqual(
							task.answer,
						);
					if (level === 1 && index === 0)
						expect(m.carries.every((n) => n === 0)).toBe(true);
					else expect(m.carries[1]).toBe(1);
					if (task.kind === "choice") {
						const place = Math.log10(c.a + c.b - Number(c.shown));
						expect(Number.isInteger(place)).toBe(true);
						expect(m.carries[place]).toBe(1);
						expect(task.prompt).not.toContain("vergessen");
					}
				}
	});
	it("has three known lab witnesses including zero positions and the million boundary", () => {
		for (const [goal, total, carries] of [
			[0, 2468, [0, 0, 0, 0, 0, 0]],
			[1, 4235, [1, 1, 1, 0, 0, 0]],
			[2, 1000000, [1, 1, 1, 1, 1, 1]],
		] as const) {
			const task = writtenLab(goal);
			expect(correctForest(task, null)).toBe(false);
			expect(amount(task.answer as number[])).toBe(total);
			expect((task.answer as number[]).slice(7)).toEqual(carries);
			expect(correctForest(task, task.answer)).toBe(true);
		}
		expect(additionColumns(30407, 2685).result.slice(0, 5)).toEqual([
			2, 9, 0, 3, 3,
		]);
		expect(() => additionColumns(999999, 2)).toThrow();
	});
	it("requires every result digit and every nonzero carry, accepting blank zero carries", () => {
		const task = writtenLab(1),
			c = task.columns;
		if (!c) throw new Error("Missing operands");
		const work = (task.answer as number[]).map(String);
		expect(columnAnswer(c.a, c.b, emptyColumnWork())).toBeNull();
		work[7] = "";
		expect(correctForest(task, columnAnswer(c.a, c.b, work))).toBe(false);
		expect(writtenMistake(task, columnAnswer(c.a, c.b, work))).toContain(
			"Übertrag zur Spalte Z",
		);
		work[7] = "1";

		expect(correctForest(task, columnAnswer(c.a, c.b, work))).toBe(true);
		work[0] = "15";
		expect(columnAnswer(c.a, c.b, work)).toBeNull();
		work[0] = "5";
		work[7] = "2";
		expect(columnAnswer(c.a, c.b, work)).toBeNull();
	});
	it("keeps editable answers hidden and labels each result/carry by place", () => {
		const html = columnBoard({ a: 2687, b: 1548 }, emptyColumnWork());
		expect(html).toContain('aria-label="Ergebnis Einer (E)"');
		expect(html).toContain('aria-label="Übertrag zu Zehner (Z)"');
		expect(html).not.toContain('value="1"');
		expect(html).not.toContain("4 235");
		expect(html).not.toContain('id="column-13"');
		expect(
			columnBoard(
				{ a: 2687, b: 1548 },
				additionColumns(2687, 1548).answer.map(String),
				true,
			),
		).not.toContain("<input");
	});
	it("changes guided work into context, correction and reasoned error checking", () => {
		const prompts = new Set<string>();
		for (let seed = 0; seed < 80; seed++) {
			for (let index = 0; index < 3; index++) {
				const easy = writtenTask(1, seed, index),
					transfer = writtenTask(2, seed, index);
				expect(easy.kind).toBe("columns");
				expect(transfer.prompt).not.toBe(easy.prompt);
				if (!transfer.columns) throw new Error("Missing transfer board");
				if (transfer.kind === "columns")
					expect(columnBoard(transfer.columns, emptyColumnWork())).toContain(
						"<input",
					);
				else
					expect(columnBoard(transfer.columns, [], false, false)).not.toContain(
						"<input",
					);
				prompts.add(transfer.prompt);
			}
			expect([0, 1, 2].map((i) => writtenExit(seed, i).goal)).toEqual([
				1, 2, 3,
			]);
		}
		expect(prompts.size).toBeGreaterThan(150);
	});
	it("persists only valid written work and leaves earlier lesson documents unchanged", () => {
		const old = freshForest("geschickt-addieren", 1000),
			p = freshForest("schriftlich-addieren", 1000);
		expect(old.columnWork).toBeUndefined();
		expect(validForest(old)).toBe(true);
		expect(validForest(p)).toBe(true);
		p.columnWork = emptyColumnWork();
		p.columnWork[0] = "0";
		p.columnWork[7] = "1";
		expect(validForest(p)).toBe(true);
		for (const bad of [
			undefined,
			[],
			Array(13).fill("11"),
			[...Array(12).fill(""), "2"],
		])
			expect(validForest({ ...p, columnWork: bad })).toBe(false);
		p.stage = "lab";
		p.index = 0;
		p.columnWork[0] = "8";
		const task = activeForestTask(p);
		if (!task) throw new Error("Missing task");
		recordForest(p, task, task.answer);
		expect(advanceForest(p)).toBe(true);
		expect(p.columnWork).toEqual(emptyColumnWork());
	});
	it("does not turn the same written operation into fresh evidence through a story or correction", () => {
		const p = freshForest("schriftlich-addieren", 1000),
			task = writtenTask(2, 731, 0);
		p.stage = "practice-2";
		recordForest(p, task, task.answer);
		p.stage = "exit";
		recordForest(
			p,
			{ ...task, prompt: "Eine neue Geschichte mit denselben Zahlen" },
			task.answer,
		);
		expect(independentForest(p.attempts[p.attempts.length - 1])).toBe(false);
	});
});

describe("written-addition review regressions", () => {
	it("limits guided difficulty and guarantees transfer features over 5000 seeds", () => {
		const lengths = new Set<boolean>();
		for (let seed = 0; seed < 5000; seed++)
			for (let index = 0; index < 3; index++) {
				const guided = writtenTask(1, seed, index).columns,
					transfer = writtenTask(2, seed, index).columns;
				if (!guided || !transfer) throw new Error("Missing board");
				const m = additionColumns(guided.a, guided.b),
					t = additionColumns(transfer.a, transfer.b);
				expect(m.width).toBeGreaterThanOrEqual(4);
				expect(m.width).toBeLessThanOrEqual(5);
				expect(m.carries.reduce((s, n) => s + n, 0)).toBe(index);
				expect(m.carries.every((n, i) => !n || !m.carries[i + 1])).toBe(true);
				if (index === 0)
					lengths.add(String(guided.a).length === String(guided.b).length);
				expect(String(transfer.a)).toHaveLength(6);
				expect(String(transfer.b)).toHaveLength(5);
				expect(String(transfer.a)).toContain("0");
				expect(t.carries[1]).toBe(1);
				expect(t.carries[2]).toBe(1);
				expect(transfer.a + transfer.b).toBeLessThanOrEqual(1_000_000);
			}
		expect(lengths.size).toBe(2);
	});
	it("requires a corrected board with a carry chain for the goal-three exit", () => {
		for (let seed = 0; seed < 80; seed++) {
			const task = writtenExit(seed, 2);
			expect(task.kind).toBe("columns");
			expect(task.goal).toBe(3);
			if (!task.columns) throw new Error("Missing correction board");
			const m = additionColumns(task.columns.a, task.columns.b);
			expect(m.carries[1] + m.carries[2]).toBe(2);
			expect(task.columns.shown).not.toBe(task.columns.a + task.columns.b);
		}
	});
	it("accepts genuinely visible blank zero carries among nonzero carries", () => {
		const model = additionColumns(30407, 2685),
			work = model.answer.map(String);
		for (const index of [8, 10]) {
			work[index] = "";
			expect(columnAnswer(30407, 2685, work)).toEqual(model.answer);
			work[index] = "1";
			expect(columnAnswer(30407, 2685, work)).not.toEqual(model.answer);
			work[index] = "";
		}
	});
	it("distinguishes incomplete input from deliberate wrong carries", () => {
		const task = writtenLab(1),
			model = additionColumns(2687, 1548),
			work = model.answer.map(String);
		expect(columnValidation(2687, 1548, emptyColumnWork())).toContain("Fülle");
		for (let i = 7; i < 13; i++) work[i] = "";
		expect(columnValidation(2687, 1548, work)).toContain(
			"Trage auch deine Überträge",
		);
		work[7] = "0";
		expect(columnValidation(2687, 1548, work)).toBeNull();
		expect(correctForest(task, columnAnswer(2687, 1548, work))).toBe(false);
	});
	it("keeps an independent exit/later attempt after incomplete input", () => {
		for (const mode of ["exit", "later"] as const) {
			const p = freshForest("schriftlich-addieren", 1000),
				task = writtenExit(876543, 1);
			if (mode === "exit") p.stage = "exit";
			else p.recall = { seed: 876543, index: 1, at: 2000 };
			expect(recordForest(p, task, null)).toBe(false);
			expect(p.attempts).toHaveLength(0);
			recordForest(p, task, task.answer);
			expect(p.attempts).toHaveLength(1);
			expect(independentForest(p.attempts[0])).toBe(true);
		}
	});
	it("reports the first result/carry mismatch in calculation order and gives the right direction", () => {
		const task = writtenLab(1),
			answer = [...(task.answer as number[])];
		answer[0] = 4;
		answer[9] = 0;
		expect(writtenMistake(task, answer)).toContain("Einerspalte");
		answer[0] = 5;
		answer[7] = 0;
		expect(writtenMistake(task, answer)).toContain("Übertrag zur Spalte Z");
		answer[7] = 1;
		answer[1] = 2;
		expect(writtenMistake(task, answer)).toContain("Zehnerspalte");
		const noCarry = writtenLab(0),
			tooMuch = [...(noCarry.answer as number[])];
		tooMuch[7] = 1;
		expect(writtenMistake(noCarry, tooMuch)).toContain("kein voller Zehner");
		expect(writtenMistake(noCarry, tooMuch)).toContain("leer oder schreibe 0");
	});
	it("uses the calculation order for keyboard navigation and a separate empty live region", () => {
		expect(columnOrder(4)).toEqual([0, 7, 1, 8, 2, 9, 3]);
		const html = columnBoard({ a: 2687, b: 1548 });
		expect(html).toContain('id="column-input-note">');
		expect(html).not.toContain('id="column-input-note" role="status"');
		expect(html).toContain('id="column-input-error" role="status"></p>');
		expect(html).toContain(
			'class="visually-hidden">Kein Übertrag zu den Einern',
		);
	});
});
