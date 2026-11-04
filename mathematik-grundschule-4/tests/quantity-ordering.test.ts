import { describe, expect, it } from "vitest";
import { forestLesson } from "../src/course/catalog";
import { investigationInput } from "../src/course/investigations";
import {
	activeForestTask,
	freshForest,
	recordForest,
} from "../src/course/progress";
import {
	reasoningExit,
	reasoningLab,
	reasoningTask,
} from "../src/course/reasoning";
import { correctForest } from "../src/course/tasks";
import { forestParentView } from "../src/course/view";

const ID = "groessen-vergleichen-ordnen";
const required = <T>(value: T | null | undefined): T => {
	if (value == null) throw new Error("Expected test value");
	return value;
};
// Parse only the displayed measurements, independently of generator identities.
const measure = (text: string): number => {
	const factors: Record<string, number> = {
		m: 100,
		cm: 1,
		h: 60,
		min: 1,
		kg: 1000,
		g: 1,
		l: 1000,
		ml: 1,
	};
	const plain = text.replace(/(?<=\d)[ \u202f](?=\d)/g, "");
	return [...plain.matchAll(/(\d+) (kg|g|ml|l|cm|m|h|min)\b/g)].reduce(
		(sum, match) => sum + Number(match[1]) * factors[match[2]],
		0,
	);
};

describe("quantity-ordering review regressions", () => {
	it("keeps each goal's actual domains fixed in lab, both levels, exit and later checks", () => {
		for (const seed of [
			1,
			907,
			...Array.from({ length: 120 }, (_, i) => i * 7919),
		])
			for (let index = 0; index < 3; index++) {
				const p = freshForest(ID);
				p.seed = seed;
				p.stage = "finished";
				p.recall = { seed, index, at: 2000 };
				for (const task of [
					reasoningLab(ID, index),
					reasoningTask(ID, 1, seed, index),
					reasoningTask(ID, 2, seed, index),
					reasoningExit(ID, seed, index),
					required(activeForestTask(p)),
				]) {
					expect(task.goal).toBe(index + 1);
					const board = required(task.investigation);
					expect([...new Set(board.rows.map((row) => row[0]))]).toEqual(
						index === 0
							? ["Längen"]
							: index === 1
								? ["Zeitspannen"]
								: ["Massen", "Hohlmaße"],
					);
					if (index === 1) {
						expect(board.rows.some((row) => /\d+ h\b/.test(row[2]))).toBe(true);
						expect(board.rows.some((row) => /\d+ min\b/.test(row[2]))).toBe(
							true,
						);
						// The smallest value is shown in hours, so its numeric answer requires ×60.
						const ordered = board.rows
							.map((row) => ({ text: row[2], amount: measure(row[2]) }))
							.sort((a, b) => a.amount - b.amount);
						expect(ordered[0].text).toMatch(/\d+ h\b/);
						expect(board.fields[3].value).toBe(ordered[0].amount);
						expect(
							Math.max(...ordered.map((row) => row.amount)),
						).toBeLessThanOrEqual(255);
					}
					expect(
						board.rows.every((row) => !/\b0 (cm|min|g|ml)\b/.test(row[2])),
					).toBe(true);
				}
			}
	});
	it("requires a correct separate mass and capacity ordering before awarding goal 3", () => {
		for (const task of [
			reasoningLab(ID, 2),
			reasoningTask(ID, 1, 1, 2),
			reasoningTask(ID, 2, 1, 2),
			reasoningExit(ID, 1, 2),
		]) {
			const board = required(task.investigation),
				fieldsPerDomain = board.fields.length / 2;
			expect(board.rows.slice(0, 3).every((row) => row[0] === "Massen")).toBe(
				true,
			);
			expect(board.rows.slice(3).every((row) => row[0] === "Hohlmaße")).toBe(
				true,
			);
			const values = board.fields.map((field) => String(field.value));
			expect(
				correctForest(
					task,
					investigationInput(
						board,
						values.map(() => ""),
					),
				),
			).toBe(false);
			expect(correctForest(task, investigationInput(board, values))).toBe(true);
			const massOnly = values.map((value, i) =>
				i < fieldsPerDomain ? value : "",
			);
			expect(correctForest(task, investigationInput(board, massOnly))).toBe(
				false,
			);
			const wrongCapacity = [...values];
			wrongCapacity[fieldsPerDomain] = String(
				(Number(wrongCapacity[fieldsPerDomain]) % 3) + 1,
			);
			expect(
				correctForest(task, investigationInput(board, wrongCapacity)),
			).toBe(false);
		}
	});
	it("records independent exit examples under the matching parent-view goal", () => {
		const p = freshForest(ID);
		p.seed = 1;
		p.stage = "exit";
		for (let index = 0; index < 3; index++) {
			p.index = index;
			const task = required(activeForestTask(p));
			recordForest(p, task, task.answer);
			expect(p.attempts.at(-1)?.goal).toBe(index + 1);
			expect(p.attempts.at(-1)?.first).toBe(true);
		}
		const html = forestParentView(required(forestLesson(ID)), p);
		const observations = [
			...html.matchAll(/<article class="observation">([\s\S]*?)<\/article>/g),
		].map((match) => match[1]);
		expect(observations).toHaveLength(3);
		for (const [index, domain] of [
			"Längen",
			"Zeitspannen",
			"Massen",
		].entries()) {
			expect(observations[index]).toContain(
				"Neue Aufgabe selbstständig gelöst",
			);
			expect(observations[index]).toContain(
				`<h3>${required(forestLesson(ID)).goals[index]}</h3>`,
			);
			expect(observations[index]).toContain(
				`Ordne ${index === 2 ? "zuerst die Massen, danach getrennt davon die Hohlmaße" : `die ${domain}`}`,
			);
		}
	});
});
