import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import { findLesson, LESSONS } from "../src/curriculum";
import { checkPractice, practiceFeedback, quizFeedback } from "../src/practice";

describe("feedback keeps unfinished answers unrevealed", () => {
	it.each(LESSONS)(
		"withholds the answer-bearing quiz explanation on a wrong attempt: $id",
		(lesson) => {
			for (const wrong of lesson.quiz.wrong) {
				const feedback = quizFeedback(lesson, wrong);
				expect(feedback).not.toContain(lesson.quiz.explanation);
				expect(feedback).not.toContain("Richtig.");
				expect(feedback).toContain("Prüfe");
			}
			expect(quizFeedback(lesson, lesson.quiz.answer)).toContain(
				lesson.quiz.explanation,
			);
		},
	);
	it.each(LESSONS)(
		"withholds the solution feedback for each unsolved short answer: $id",
		(lesson) => {
			for (const item of lesson.practice) {
				expect(practiceFeedback(item, false)).not.toContain(item.feedback);
				expect(practiceFeedback(item, false)).toContain("Noch prüfen");
				expect(practiceFeedback(item, true)).toBe(item.feedback);
			}
		},
	);
	it("can explain a solved field while leaving the other answer open", () => {
		const lesson = findLesson("f8-verbes-ir-dre")!;
		const result = checkPractice(lesson.practice, ["dors", "bad answer"]);
		expect(result).toEqual([true, false]);
		expect(practiceFeedback(lesson.practice[0], result[0])).toBe(
			lesson.practice[0].feedback,
		);
		expect(practiceFeedback(lesson.practice[1], result[1])).not.toContain(
			"répondons",
		);
	});
});

describe("complete dates and language-specific punctuation", () => {
	it("keeps the month in the festival key rule", () => {
		expect(findLesson("f8-fetes")!.takeaway).toBe(
			"Die Fête de la musique findet am 21. Juni statt.",
		);
	});
	it("does not put French question-mark spacing on German recall prompts", () => {
		for (const atom of cell.atoms)
			for (const item of atom.practice_items)
				expect(item.question, item.slug).not.toMatch(/\s\?$/);
		const item = cell.atoms.find((a) => a.slug === "f8-participes")!
			.practice_items[1];
		expect(item.question).toBe(
			"Wie heißt „Ich habe geschrieben“ auf Französisch?",
		);
		// Target-language examples retain French punctuation.
		expect(findLesson("f8-amis")!.quiz.question).toBe(
			"Où est le rendez-vous ?",
		);
	});
});


describe("distinct retrieval prompts", () => {
	it("uses different prompts within each lesson while preserving the festival date target", () => {
		for (const atom of cell.atoms) {
			const prompts = atom.practice_items.map((item) => item.question.trim());
			expect(new Set(prompts).size, atom.slug).toBe(prompts.length);
		}
		const festival = cell.atoms.find((atom) => atom.slug === "f8-fetes")!;
		expect(festival.practice_items[1].question).toContain("Korrigiere die Aussage");
		expect(festival.practice_items.map((item) => item.concept)).toEqual([
			"Am 21. Juni.", "Am 21. Juni.",
		]);
	});
});
