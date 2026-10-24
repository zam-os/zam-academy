import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { practiceFeedback, quizFeedback } from "../src/practice";
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
		const lesson = LESSONS.find((entry) => entry.id === "e9-business-call");
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
	it("quotes example sentences in the bike-repair comparison", () => {
		const lesson = LESSONS.find((entry) => entry.id === "e9-chunks");
		if (!lesson) throw new Error("Missing chunks lesson");
		expect(lesson.tasks[2].model).toContain(
			"The sentence “I repaired my bike”",
		);
		expect(lesson.tasks[2].model).toContain(
			"The sentence “The shop is said to be reliable”",
		);
	});
	it("provides the learner's actual ZAM enrolment request", () => {
		expect(zamEnrolRequest()).toContain(ZAM_CELL_TITLE);
	});
});
