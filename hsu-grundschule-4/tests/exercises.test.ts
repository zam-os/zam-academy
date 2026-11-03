import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
	checkChoiceTask,
	checkNumberTask,
	isNumberTask,
	parseGermanNumber,
} from "../src/exercises/checker";
import { generateExerciseTask } from "../src/exercises/generators";
import { fmt } from "../src/model/format";

describe("Two-level HSU exercise generators & German number checker", () => {
	it("parses German decimal commas, decimal points, spaces, U+2212 minus, and trailing units", () => {
		expect(parseGermanNumber("1,5")).toBe(1.5);
		expect(parseGermanNumber("1.5")).toBe(1.5);
		expect(parseGermanNumber("1,5 km")).toBe(1.5);
		expect(parseGermanNumber("1 000 m")).toBe(1000);
		expect(parseGermanNumber("19.")).toBe(19);
		expect(parseGermanNumber("−2,5")).toBe(-2.5);
		expect(parseGermanNumber("")).toBeNull();
		expect(parseGermanNumber("abc")).toBeNull();
	});

	for (const lesson of LESSONS) {
		it(`Station ${lesson.number} (${lesson.id}): Level 1 & Level 2 differ and 80 tasks per level validate`, () => {
			const l1Sample = generateExerciseTask(lesson.id, 1, 1);
			const l2Sample = generateExerciseTask(lesson.id, 2, 1);
			expect(l1Sample.prompt).not.toBe(l2Sample.prompt);
			expect(l1Sample.contextTag).toContain("Spürnase");
			expect(l2Sample.contextTag).toContain("Proben-Profi");

			const promptsByLevel = { 1: new Set<string>(), 2: new Set<string>() };

			for (const level of [1, 2] as const) {
				for (let seed = 1; seed <= 80; seed++) {
					const task = generateExerciseTask(lesson.id, level, seed);
					promptsByLevel[level].add(task.prompt);
					expect(task.lessonId).toBe(lesson.id);
					expect(task.level).toBe(level);
					expect(task.hint.length).toBeGreaterThan(10);
					expect(task.explanation.length).toBeGreaterThan(10);

					if (isNumberTask(task)) {
						expect(Number.isFinite(task.expected)).toBe(true);
						const withComma = fmt(task.expected);
						const withPoint = String(task.expected);
						expect(checkNumberTask(task, withComma).correct).toBe(true);
						expect(checkNumberTask(task, withPoint).correct).toBe(true);
						expect(
							checkNumberTask(task, `${withComma} ${task.unit}`).correct,
						).toBe(true);
						const wrong = checkNumberTask(task, fmt(task.expected + 7));
						expect(wrong.correct).toBe(false);
						expect(wrong.feedback.length).toBeGreaterThan(8);
					} else {
						expect(task.options.length).toBeGreaterThanOrEqual(3);
						expect(new Set(task.options).size).toBe(task.options.length);
						expect(
							checkChoiceTask(task, task.correctIndex).correct,
						).toBe(true);
						task.options.forEach((_, idx) => {
							if (idx !== task.correctIndex) {
								const wrong = checkChoiceTask(task, idx);
								expect(wrong.correct).toBe(false);
								expect(wrong.feedback.length).toBeGreaterThan(10);
							}
						});
					}
				}
				expect(promptsByLevel[level].size).toBeGreaterThanOrEqual(2);
			}
			for (const p of promptsByLevel[1]) {
				expect(promptsByLevel[2].has(p)).toBe(false);
			}
		});
	}
});
