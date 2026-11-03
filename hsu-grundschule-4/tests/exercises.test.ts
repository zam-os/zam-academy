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
	it("parses German decimal commas, thousands dots, decimal points, spaces, U+2212 minus, and trailing units", () => {
		expect(parseGermanNumber("1,5")).toBe(1.5);
		expect(parseGermanNumber("1.5")).toBe(1.5);
		expect(parseGermanNumber("0.125")).toBe(0.125);
		expect(parseGermanNumber("1,5 km")).toBe(1.5);
		expect(parseGermanNumber("1 000 m")).toBe(1000);
		expect(parseGermanNumber("1.000")).toBe(1000);
		expect(parseGermanNumber("1.500")).toBe(1500);
		expect(parseGermanNumber("1.500 m")).toBe(1500);
		expect(parseGermanNumber("4.000 m")).toBe(4000);
		expect(parseGermanNumber("25.000")).toBe(25000);
		expect(parseGermanNumber("1.000.000")).toBe(1000000);
		expect(parseGermanNumber("1.250,5 km")).toBe(1250.5);
		expect(parseGermanNumber("1.25,5")).toBeNull();
		expect(parseGermanNumber("19.")).toBe(19);
		expect(parseGermanNumber("19. Jh.")).toBe(19);
		expect(parseGermanNumber("−2,5")).toBe(-2.5);
		expect(parseGermanNumber("")).toBeNull();
		expect(parseGermanNumber("abc")).toBeNull();
	});

	it("rejects un-converted meter answers written with German thousands dots on Station 16 scale tasks", () => {
		const seenScales = new Set<string>();
		for (let seed = 1; seed <= 80; seed++) {
			const task = generateExerciseTask("orientierung-und-kartenlesen", 2, seed);
			expect(isNumberTask(task)).toBe(true);
			if (!isNumberTask(task)) continue;

			if (task.prompt.includes("1 : 25 000") && task.prompt.includes("6 cm")) {
				seenScales.add("25k");
				for (const raw of ["1.500", "1.500 m", "1 500 m"]) {
					const res = checkNumberTask(task, raw);
					expect(res.validInput).toBe(true);
					expect(res.correct).toBe(false);
					expect(res.parsedValue).toBe(1500);
					expect(res.feedback).toContain("teile noch durch 1 000 für Kilometer");
				}
			}
			if (task.prompt.includes("1 : 100 000") && task.prompt.includes("4 cm")) {
				seenScales.add("100k");
				for (const raw of ["4.000", "4.000 m", "4 000 m"]) {
					const res = checkNumberTask(task, raw);
					expect(res.validInput).toBe(true);
					expect(res.correct).toBe(false);
					expect(res.parsedValue).toBe(4000);
					expect(res.feedback).toContain("teile noch durch 1 000 für Kilometer");
				}
			}
		}
		expect(seenScales).toEqual(new Set(["25k", "100k"]));
	});

	it("aligns Station 8 Level 1 forest layers with all five taught layers including Wurzelschicht", () => {
		let foundForestTask = false;
		for (let seed = 1; seed <= 40; seed++) {
			const task = generateExerciseTask("lebensraeume-wald-gewaesser", 1, seed);
			if (task.kind === "choice" && task.prompt.includes("Stockwerke des Waldes")) {
				foundForestTask = true;
				expect(task.prompt).toContain("fünf Stockwerke");
				expect(task.options[task.correctIndex]).toContain("Wurzelschicht");
			}
		}
		expect(foundForestTask).toBe(true);
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
