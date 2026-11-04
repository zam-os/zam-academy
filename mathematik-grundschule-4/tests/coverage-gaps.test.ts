import { describe, expect, it } from "vitest";
import coverage from "../coverage.json";
import { investigationBoard } from "../src/course/investigation-board";
import { investigationInput } from "../src/course/investigations";
import { REASONING_IDS, reasoningTask } from "../src/course/reasoning";
import { numberWord } from "../src/course/representations";
import { correctForest, forestLab, forestTask } from "../src/course/tasks";
import {
	activeForestTask,
	advanceForest,
	freshForest,
	recordForest,
	validForest,
} from "../src/course/progress";
import {
	additionColumns,
	columnAnswer,
	writtenExplanation,
} from "../src/course/written-addition";
import { columnBoard } from "../src/course/column-board";
import { finalTask } from "../src/course/data-and-expeditions";

const required = <T>(value: T | null | undefined): T => {
	if (value == null) throw new Error("Expected test value");
	return value;
};

describe("curriculum gap closure", () => {
	it("keeps exits and later checks fresh after labs and both practice levels", () => {
		for (const id of REASONING_IDS)
			for (let seed = 0; seed < 240; seed++) {
				const p = freshForest(id);
				p.seed = seed;
				for (const stage of ["lab", "practice-1", "practice-2"] as const) {
					p.stage = stage;
					for (let i = 0; i < 3; i++) {
						p.index = i;
						const t = required(activeForestTask(p));
						recordForest(p, t, t.answer);
					}
				}
				p.stage = "exit";
				for (let i = 0; i < 3; i++) {
					p.index = i;
					const t = required(activeForestTask(p));
					recordForest(p, t, t.answer);
					expect(p.attempts.at(-1)?.first, `${id} seed ${seed} exit ${i}`).toBe(
						true,
					);
					expect(activeForestTask(p)).toEqual(t);
				}
				p.stage = "finished";
				p.recall = { seed, index: 0, at: 2000 };
				const later = required(activeForestTask(p));
				recordForest(p, later, later.answer);
				expect(p.attempts.at(-1)?.first).toBe(true);
			}
	});
	it("preserves in-progress boards from the published preview without discarding evidence", () => {
		for (const id of [
			"schriftlich-addieren",
			"daten-sammeln-darstellen",
			"zahlen-zerlegen-ergaenzen",
		] as const) {
			const old = freshForest(id, 100);
			delete old.contentRevision;
			if (id === "zahlen-zerlegen-ergaenzen") delete old.investigationWork;
			old.stage = id === "daten-sammeln-darstellen" ? "practice-2" : "lab";
			old.index = id === "schriftlich-addieren" ? 2 : 0;
			if (old.stage === "practice-2") {
				old.labGoals = [0, 1, 2];
				old.quiz = true;
			}
			const task = required(activeForestTask(old));
			if (id === "schriftlich-addieren")
				expect(task.columns?.extra).toEqual([]);
			if (id === "daten-sammeln-darstellen") {
				expect(task.investigation?.fields).toHaveLength(3);
				old.investigationWork = required(task.investigation).fields.map((f) =>
					String(f.value),
				);
			}
			expect(validForest(structuredClone(old))).toBe(true);
			recordForest(old, task, task.answer);
			expect(validForest(structuredClone(old))).toBe(true);
			expect(old.attempts).toHaveLength(1);
		}
	});
	it("proves three initially unsolved reachable goals and resumable fields for each new lesson", () => {
		for (const id of REASONING_IDS) {
			const p = freshForest(id, 100);
			p.stage = "lab";
			for (let index = 0; index < 3; index++) {
				const task = forestLab(id, index),
					board = required(task.investigation);
				expect(
					correctForest(
						task,
						investigationInput(
							board,
							board.fields.map(() => ""),
						),
					),
				).toBe(false);
				expect(investigationBoard(board)).not.toContain("checked");
				p.investigationWork = board.fields.map((f) => String(f.value));
				expect(validForest(structuredClone(p))).toBe(true);
				expect(
					correctForest(task, investigationInput(board, p.investigationWork)),
				).toBe(true);
				expect(activeForestTask(p)?.answer).toEqual(task.answer);
				recordForest(p, task, task.answer);
				expect(advanceForest(p)).toBe(true);
			}
			expect(p.labGoals).toEqual([0, 1, 2]);
		}
	});
	it("checks at least 80 tasks per level against independent numerical oracles", () => {
		for (const id of REASONING_IDS)
			for (const level of [1, 2] as const)
				for (let i = 0; i < 120; i++) {
					const task = reasoningTask(id, level, i * 7919, i),
						b = required(task.investigation);
					expect(forestTask(id, level, i * 7919, i)).toEqual(task);
					expect(
						investigationInput(
							b,
							b.fields.map((f) => String(f.value)),
						),
					).toEqual(task.answer);
					if (id === "anzahlen-schaetzen-fermi") {
						const [, groups, sample, second] = b.identity.map(Number);
						expect(b.fields[0].value).toBe(groups * sample);
						if (level === 2 || task.goal === 3) {
							expect(b.fields[2].value).toBe(groups * second);
							expect(b.fields[3].value).toBe(groups * (second - sample));
						}
					}
					if (id === "rechenweg-waehlen") {
						const [, a, c] = b.identity.map(Number);
						expect(
							b.fields.find((f) => f.label === "Genaue Summe")?.value,
						).toBe(a + c);
					}
					if (id === "sachaufgaben-veraendern") {
						const [, groups, each, extra, used] = b.identity.map(Number);
						expect(
							b.fields.find(
								(f) =>
									f.label ===
									(task.goal === 2
										? "Samen vor der Erweiterung"
										: "Samen insgesamt"),
							)?.value,
						).toBe(groups * each);
						if (task.goal === 2)
							expect(b.fields.at(-1)?.value).toBe(
								groups * each + extra - (level === 2 ? used : 0),
							);
					}
					if (id === "groessen-vergleichen-ordnen") {
						const convert = (s: string) => {
							const chunks = [
								...s
									.replace(/(?<=\d)[ \u202f](?=\d)/g, "")
									.matchAll(/(\d+) (kg|g|ml|l|cm|m|h|min)\b/g),
							];
							const factor: Record<string, number> = {
								m: 100,
								cm: 1,
								h: 60,
								min: 1,
								kg: 1000,
								g: 1,
								l: 1000,
								ml: 1,
							};
							return chunks.reduce(
								(n, m) => n + Number(m[1]) * factor[m[2]],
								0,
							);
						};
						for (let group = 0; group < b.rows.length / 3; group++) {
							const sizes = b.rows
								.slice(group * 3, group * 3 + 3)
								.map((row) => convert(row[2]));
							const fields = b.fields.slice(group * (level === 1 ? 5 : 6));
							expect(fields.slice(0, 3).map((f) => sizes[f.value - 1])).toEqual(
								[...sizes].sort((a, b) => a - b),
							);
							expect(fields[3].value).toBe(Math.min(...sizes));
							if (level === 2)
								expect(fields[4].value).toBe(
									Math.max(...sizes) - Math.min(...sizes),
								);
						}
					}
				}
	});
	it("handles three/four addends, carries of 2/3, commuted evidence and boundary sums", () => {
		for (const ns of [
			[199999, 299999, 499999],
			[99999, 99999, 99999, 99999],
			[999999, 0, 0, 1],
		]) {
			const [a, b, ...extra] = ns,
				m = additionColumns(a, b, extra);
			expect(m.result.reduce((s, n, i) => s + n * 10 ** i, 0)).toBe(
				ns.reduce((s, n) => s + n, 0),
			);
			for (let col = 1; col < 7; col++)
				expect(m.carries[col]).toBe(
					Math.floor(ns.reduce((s, n) => s + (n % 10 ** col), 0) / 10 ** col),
				);
			expect(columnAnswer(a, b, m.answer.map(String), extra)).toEqual(m.answer);
			expect(writtenExplanation(a, b, extra)).not.toContain(
				"übertrage undefined",
			);
			expect(columnBoard({ a, b, extra })).toContain("3. Zahl");
		}
		for (const level of [1, 2] as const)
			for (let seed = 0; seed < 120; seed++) {
				const task = forestTask("schriftlich-addieren", level, seed, 2),
					c = required(task.columns);
				expect(c.extra).toHaveLength(level === 1 ? 1 : 2);
				expect(
					correctForest(
						task,
						columnAnswer(
							c.a,
							c.b,
							(task.answer as number[]).map(String),
							c.extra,
						),
					),
				).toBe(true);
				const p = freshForest("schriftlich-addieren");
				p.stage = "exit";
				recordForest(p, task, task.answer);
				recordForest(
					p,
					{
						...task,
						prompt: "Andere Worte",
						columns: { a: c.b, b: c.a, extra: c.extra },
					},
					task.answer,
				);
				expect(p.attempts.at(-1)?.first).toBe(false);
			}
	});
	it("teaches zero positions across words and stage notation, plus five-category data", () => {
		for (const [n, word] of [
			[0, "null"],
			[1, "eins"],
			[21, "einundzwanzig"],
			[1001, "eintausendeins"],
			[4024, "viertausendvierundzwanzig"],
			[101101, "einhunderteintausendeinhunderteins"],
			[1000000, "eine Million"],
		] as const)
			expect(numberWord(n)).toBe(word);
		for (const level of [1, 2] as const) {
			const t = forestTask("zahlen-zerlegen-ergaenzen", level, 9, 2);
			expect(t.investigation?.identity[0]).toBe("number-word");
			expect(correctForest(t, t.answer)).toBe(true);
		}
		const data = finalTask("daten-sammeln-darstellen", 2, 95, 0),
			b = required(data.investigation);
		expect(b.rows).toHaveLength(5);
		expect(data.scene?.chart?.labels).toHaveLength(5);
		expect(data.scene?.chart?.hidden).toEqual([4]);
		expect(b.fields[5].value * 2).toBe(b.fields[4].value);
	});
	it("leaves all 54 rows explicitly awaiting teacher review and names outside practice", () => {
		expect(coverage.full_coverage).toBe(false);
		expect(coverage.review_status).toBe("awaiting-primary-teacher");
		for (const row of coverage.rows) {
			expect(row.gap_audit.teacher_review).toBe("pending");
			expect(row.gap_audit.digital).toMatch(/^(closed|existing)$/);
			expect(row.reviewer).toBeNull();
			expect(row.remaining).toContain("(c)");
		}
	});
});
