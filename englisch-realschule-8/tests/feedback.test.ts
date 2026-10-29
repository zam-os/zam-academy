import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { checkPractice, practiceFeedback, quizFeedback } from "../src/practice";
import { ZAM_CELL_TITLE, zamEnrolRequest } from "../src/zam/zam-link";

describe("feedback after a real attempt", () => {
	it("does not reveal the answer-bearing explanation after a wrong quick check", () => {
		for (const lesson of LESSONS) {
			expect(lesson.quiz.wrongFeedback).toHaveLength(2);
			for (const wrong of lesson.quiz.wrong) {
				const feedback = quizFeedback(lesson, wrong);
				expect(feedback).not.toContain(lesson.quiz.explanation);
				expect(feedback).not.toContain("Richtig.");
				expect(feedback.length).toBeGreaterThan(35);
			}
			expect(quizFeedback(lesson, lesson.quiz.answer)).toContain(
				lesson.quiz.explanation,
			);
		}
	});
	it("reveals the prepared short-answer explanation only for a solved field", () => {
		const lesson = LESSONS.find((entry) => entry.id === "e8-radio-ad");
		if (!lesson) throw new Error("Missing listening lesson");
		const practice = lesson.practice;
		for (const item of practice) {
			expect(practiceFeedback(item, false)).not.toContain(item.feedback);
			expect(practiceFeedback(item, true)).toBe(item.feedback);
		}
	});
	it("summarises the key rule rather than repeating the opening sentence", () => {
		for (const lesson of LESSONS)
			expect(lesson.paragraphs[0].startsWith(lesson.takeaway)).toBe(false);
	});
	it("explains the roles of to with two different verb patterns", () => {
		const lesson = LESSONS.find((entry) => entry.id === "e8-verb-patterns");
		if (!lesson) throw new Error("Missing verb-pattern lesson");
		expect(lesson.paragraphs[1]).toContain("Präposition");
		expect(lesson.tasks[2].model).toContain("looking forward to meeting");
	});
	it("keeps the German-learner trap explain me out of every model answer", () => {
		for (const lesson of LESSONS)
			for (const task of Object.values(lesson.tasks))
				expect(task.model).not.toMatch(/\bexplain me\b/i);
	});
	it("accepts natural short phrases without accepting a different fact", () => {
		const examples: [string, number, string, string][] = [
			["e8-radio-ad", 1, "back", "main"],
			["e8-subway-listening", 1, "the C train", "the A train"],
			["e8-states", 2, "Guam", "Hawaii"],
			["e8-if-type3", 0, "'d have left", "would leave"],
			["e8-negative-questions", 0, "Is not", "Isn't it"],
			["e8-civil-rights", 2, "act", "law"],
			["e8-neighbours", 0, "9,000", "8,000"],
			["e8-dictionary-stress", 0, "noun", "verb"],
			["e8-ing-ed-adjectives", 0, "exciting", "excited"],
			["e8-two-objects", 0, "lent me a bike", "lent a bike me"],
		];
		for (const [id, index, good, bad] of examples) {
			const lesson = LESSONS.find((entry) => entry.id === id);
			if (!lesson) throw new Error(`Missing lesson ${id}`);
			const answers = lesson.practice.map((item) => item.answers[0]);
			answers[index] = good;
			expect(checkPractice(lesson.practice, answers).every(Boolean)).toBe(true);
			answers[index] = bad;
			expect(checkPractice(lesson.practice, answers)[index]).toBe(false);
		}
	});
	it("provides the learner's actual ZAM enrolment request", () => {
		expect(zamEnrolRequest()).toContain(ZAM_CELL_TITLE);
	});
});
