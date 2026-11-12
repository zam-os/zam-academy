import { describe, expect, it } from "vitest";
import earlierCell from "../../deutsch-mittelschule-5/cell.json";
import earlierLessons from "../../deutsch-mittelschule-5/src/curriculum/lessons.json";
import cell from "../cell.json";
import coverage from "../coverage.json";
import { findLesson, LESSONS } from "../src/curriculum";
import { checkCases } from "../src/practice";

describe("Grade 6 progression", () => {
	it("reviews the foundation explicitly and gives every shared topic a new application", () => {
		const earlier = new Map(earlierLessons.map((l) => [l.id.slice(3), l]));
		for (const l of LESSONS) {
			const base = earlier.get(l.id.slice(3));
			if (!base) continue;
			expect(l.paragraphs[0]).toContain("Wiederholung aus Deutsch 5:");
			expect(l.material).not.toBe(base.material);
			expect(l.cases).not.toEqual(base.cases);
			expect(l.tasks[1].prompt).not.toBe(base.tasks["1"].prompt);
			expect(l.tasks[2].prompt).not.toBe(base.tasks["2"].prompt);
		}
	});
	it("does not give a learner both cells with identical question-answer pairs", () => {
		const existing = new Set(
			earlierCell.atoms.flatMap((a) =>
				a.practice_items.map((i) => JSON.stringify([i.question, i.concept])),
			),
		);
		for (const a of cell.atoms)
			for (const i of a.practice_items)
				expect(existing.has(JSON.stringify([i.question, i.concept]))).toBe(
					false,
				);
	});
	it("teaches figurative meaning and appropriate use, not just a mapped lesson id", () => {
		const l = findLesson("d6-sprachwahl");
		if (!l) throw new Error("Missing language lesson");
		expect(l.paragraphs.join(" ")).toContain("Redensart");
		expect(l.paragraphs.join(" ")).toContain("Sprichwort");
		expect(
			checkCases(l.cases, [
				"Jo ist über den Fund sehr erleichtert.",
				"Wiederholtes Üben mit Hilfe kann die Fertigkeit verbessern.",
			]),
		).toEqual([true, true]);
		expect(l.tasks[2].prompt).toContain("Grenze des Sprichworts");
		expect(
			coverage.rows.find((r) => r.section === "4.1" && r.position === 5)
				?.lessons,
		).toContain(l.id);
	});
	it("uses word formation to interpret a pragmatic text and create an explained name", () => {
		const l = findLesson("d6-wortbildung");
		if (!l) throw new Error("Missing word-formation lesson");
		expect(l.material).toContain("Werkstatttext");
		expect(l.material).toContain("Regenwasserspeicher");
		expect(l.tasks[2].prompt).toContain("Erfinde");
		expect(l.tasks[2].model).toContain("Erfundener Name");
		expect(l.tasks[1].model).toContain("Grundwort");
		expect(
			coverage.rows.find((r) => r.section === "4.2" && r.position === 2)
				?.lessons,
		).toContain(l.id);
	});
	it("makes the passive contrast unambiguous about the named agent", () => {
		const l = findLesson("d6-aktiv-passiv");
		if (!l) throw new Error("Missing passive lesson");
		expect(l.cases[1].prompt).toContain("Passivumformung");
		expect(l.cases[1].options).toEqual([
			"Die Tür wird geöffnet.",
			"Die Tür wird von Mina geöffnet.",
		]);
		expect(
			checkCases(l.cases, [
				l.cases[0].answer,
				"Die Tür wird von Mina geöffnet.",
			]),
		).toEqual([true, true]);
		expect(
			checkCases(l.cases, [l.cases[0].answer, "Die Tür wird geöffnet."]),
		).toEqual([true, false]);
	});
});
