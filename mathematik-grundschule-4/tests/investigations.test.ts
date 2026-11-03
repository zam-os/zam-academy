import { describe, expect, it } from "vitest";
import { forestLesson } from "../src/course/catalog";
import { investigationBoard } from "../src/course/investigation-board";
import {
	INVESTIGATION_IDS,
	investigationInput,
	investigationMistake,
	patternLab,
	patternTask,
	storyLab,
	storyTask,
	validInvestigationWork,
} from "../src/course/investigations";
import {
	activeForestTask,
	advanceForest,
	forestKey,
	freshForest,
	independentForest,
	recordForest,
	validForest,
} from "../src/course/progress";
import { forestExit, forestTask } from "../src/course/tasks";
import { forestTeacherPanel } from "../src/course/view";

const required = <T>(value: T | null | undefined): T => {
	if (value == null) throw new Error("Expected test value");
	return value;
};

describe("Pattern and story investigations", () => {
	it("uses independent arithmetic oracles for both levels and every task family", () => {
		for (const level of [1, 2] as const)
			for (let i = 0; i < 240; i++) {
				const p = patternTask(level, i * 7919, i),
					s = storyTask(level, i * 9973, i);
				for (const t of [p, s]) {
					const b = required(t.investigation);
					expect(
						investigationInput(
							b,
							b.fields.map((f) => String(f.value)),
						),
					).toEqual(t.answer);
					expect(
						investigationInput(
							b,
							b.fields.map(() => ""),
						),
					).toBeNull();
					expect(
						validInvestigationWork(
							b.fields.map(() => ""),
							b,
						),
					).toBe(true);
					expect(
						(t.answer as number[]).every(
							(n) => Number.isSafeInteger(n) && n >= 0 && n <= 1e6,
						),
					).toBe(true);
				}
				const [kind, a, b, c, d] = required(p.investigation).identity;
				const nums = p.answer as number[];
				if (kind === "sequence")
					expect(nums).toEqual([
						1,
						Number(a) + (level === 1 ? 3 : 1) * Number(b),
						Number(a) + 4 * Number(b),
					]);
				if (kind === "packet") {
					expect(nums).toEqual([
						1,
						Number(a) + Number(b) + 2 * (Number(c) + Number(d)),
						Number(a) + Number(b) + 3 * (Number(c) + Number(d)),
					]);
					for (const row of required(p.investigation).rows)
						expect(
							row.slice(0, 2).every((v) => Number(v.replace(/\s/g, "")) >= 0),
						).toBe(true);
				}
				if (kind === "anna") {
					const x = Number(a) + 2 * Number(c),
						y = Number(b) + 2 * Number(d);
					const big = Number(`${x}${y}${y}${x}`),
						small = Number(`${y}${x}${x}${y}`);
					expect(nums).toEqual([big, small, big - small, 1]);
					expect(x).toBeLessThanOrEqual(9);
					expect(y).toBeLessThan(x);
				}
				const [story, x, y, z] = required(s.investigation).identity;
				const sx = Number(x),
					sy = Number(y),
					sz = Number(z);
				if (story === "packing")
					expect(s.answer).toEqual([1, sx * sy, sx * sy - sz, 1]);
				if (story === "boats") {
					const total = sx + sy,
						needed = Math.ceil(total / sz);
					expect(s.answer).toEqual([
						total,
						Math.floor(total / sz),
						total % sz,
						needed,
						1,
					]);
					expect(needed * sz).toBeGreaterThanOrEqual(total);
					expect((needed - 1) * sz).toBeLessThan(total);
					expect(level === 1 ? total % sz === 0 : total % sz > 0).toBe(true);
				}
				if (story === "backwards")
					expect(s.answer).toEqual([1, sx * sy, sx * sy + sz, 1]);
			}
	});
	it("keeps ANNA teaching numbers separate from every lab row", () => {
		const panel = forestTeacherPanel(
			required(forestLesson("muster-zahlbeziehungen")),
		).replace(/\s/g, "");
		for (const row of required(patternLab(2).investigation).rows) {
			for (const n of row.slice(2, 4))
				if (n !== "?") expect(panel).not.toContain(n.replace(/\s/g, ""));
		}
		const answer = required(patternLab(2).investigation).fields;
		for (const n of answer.slice(0, 2))
			expect(panel).not.toContain(String(n.value));
	});
	it("keeps teaching and quiz answers outside generated ANNA and boat domains", () => {
		const patterns = forestTeacherPanel(
			required(forestLesson("muster-zahlbeziehungen")),
		).replace(/\s/g, "");
		const story = required(forestLesson("sachaufgaben-mehrschrittig"));
		expect(story.example).toContain("117 : 8 = 14 Rest 5");
		expect(story.quiz.prompt).toContain("15 Rest 2");
		// Include the exact seeds that exposed the previous examples.
		for (const seed of [
			30,
			25926,
			...Array.from({ length: 500 }, (_, i) => i * 7919),
		])
			for (const level of [1, 2] as const) {
				const p = required(patternTask(level, seed, 2).investigation);
				for (const f of p.fields.slice(0, 2))
					expect(patterns).not.toContain(String(f.value));
				for (const row of p.rows) expect(Number(row[1])).toBeLessThanOrEqual(5);
				const boat = storyTask(level, seed, 1).answer as number[];
				expect(boat[1]).toBeLessThanOrEqual(12);
			}
	});
	it("changes structure between guided and transfer work and covers each goal on exit", () => {
		for (const id of INVESTIGATION_IDS) {
			for (let i = 0; i < 3; i++)
				expect(forestTask(id, 1, 42, i)).not.toEqual(forestTask(id, 2, 42, i));
			expect([0, 1, 2].map((i) => forestExit(id, 72, i).goal)).toEqual([
				1, 2, 3,
			]);
		}
	});
	it("keeps all fields initially empty, allows grouped integers and refuses invalid choices", () => {
		const b = required(patternLab(0).investigation);
		expect(investigationInput(b, ["1", "2 000", "2250"])).toEqual([
			1, 2000, 2250,
		]);
		expect(investigationInput(b, ["1", "2.000", "2.250"])).toEqual([
			1, 2000, 2250,
		]);
		expect(validInvestigationWork(["1", "2.000", "2.250"], b)).toBe(true);
		for (const bad of ["1.5", "−2", "1000001", "NaN", "<img>"]) {
			expect(investigationInput(b, ["1", bad, "2250"])).toBeNull();
			expect(validInvestigationWork(["1", bad, "2250"], b)).toBe(false);
		}
		expect(investigationInput(b, ["99", "2000", "2250"])).toBeNull();
		expect(investigationInput(b, ["1", "2000"])).toBeNull();
		expect(investigationBoard(b)).not.toContain("checked");
		expect(investigationBoard(b)).not.toContain('value="2000"');
		expect(investigationBoard(b)).not.toContain('value="2250"');
	});
	it("does not expose computed story answers in choices and targets the first incorrect step", () => {
		for (let i = 0; i < 3; i++) {
			const t = storyLab(i),
				b = required(t.investigation);
			const answers = b.fields.filter((f) => !f.choices).map((f) => f.value);
			const labels = b.fields
				.flatMap((f) => f.choices?.map((c) => c.label) ?? [])
				.join(" ");
			for (const n of answers) expect(labels).not.toContain(String(n));
			const wrong = [...(t.answer as number[])];
			wrong[1]++;
			expect(investigationMistake(b, wrong)).toContain(b.fields[1].label);
		}
	});
	it("validates resumable work against the current task and clears it at transitions", () => {
		for (const id of INVESTIGATION_IDS) {
			const p = freshForest(id, 100);
			p.stage = "lab";
			const t = required(activeForestTask(p));
			p.investigationWork = required(t.investigation).fields.map(() => "");
			expect(validForest(p)).toBe(true);
			p.investigationWork[0] = "bad";
			expect(validForest(p)).toBe(false);
			p.investigationWork = required(t.investigation).fields.map((f) =>
				String(f.value),
			);
			expect(validForest(p)).toBe(true);
			expect(advanceForest(p)).toBe(false);
			recordForest(p, t, t.answer);
			expect(advanceForest(p)).toBe(true);
			expect(p.investigationWork).toBeNull();
			expect(validForest(p)).toBe(true);
		}
	});
	it("normalizes anonymous camp order for evidence", () => {
		for (let seed = 0; seed < 200; seed++) {
			const t = storyTask(2, seed, 1),
				b = required(t.investigation);
			const first = Number(b.rows[0][1]),
				second = Number(b.rows[1][1]);
			expect(b.identity.slice(1, 3)).toEqual([
				Math.min(first, second),
				Math.max(first, second),
			]);
			const p = freshForest("sachaufgaben-mehrschrittig");
			p.stage = "exit";
			recordForest(p, t, t.answer);
			p.index = 1;
			recordForest(
				p,
				{
					...t,
					investigation: {
						...b,
						rows: [
							["Camp 1", String(second)],
							["Camp 2", String(first)],
							b.rows[2],
						],
					},
				},
				t.answer,
			);
			expect(required(p.attempts.at(-1)).first).toBe(false);
		}
	});
	it("does not turn reworded, reordered or irrelevant-number variants into fresh evidence", () => {
		const p = freshForest("sachaufgaben-mehrschrittig");
		p.stage = "exit";
		const t = storyLab(0);
		recordForest(p, t, t.answer);
		p.index = 1;
		const variant = {
			...t,
			prompt: "Another wording",
			investigation: {
				...required(t.investigation),
				rows: [["Gießkannen", "9"]],
				fields: [...required(t.investigation).fields].reverse(),
			},
		};
		recordForest(p, variant, variant.answer);
		expect(p.attempts.at(-1)?.first).toBe(false);
		expect(independentForest(required(p.attempts.at(-1)))).toBe(false);
		p.index = 2;
		p.helped.push(forestKey(p));
		const fresh = storyTask(2, 888, 0);
		recordForest(p, fresh, fresh.answer);
		expect(independentForest(required(p.attempts.at(-1)))).toBe(false);
	});
});
