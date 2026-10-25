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
		const lesson = LESSONS.find((entry) => entry.id === "e10-abroad-listening");
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
		const lesson = LESSONS.find((entry) => entry.id === "e10-verb-patterns");
		if (!lesson) throw new Error("Missing verb-pattern lesson");
		expect(lesson.tasks[2].model).toContain("Want to meet");
		expect(lesson.tasks[2].model).toContain("look forward to");
	});
	it("accepts natural short phrases without accepting a different fact", () => {
		const examples: [string, number, string, string][] = [
			["e10-abroad-listening", 0, "in the library", "in the classroom"],
			["e10-unless", 2, "in the classroom", "outside"],
			["e10-original-story", 1, "the spare chair", "the desk"],
			["e10-choices", 1, "to consult", "consulting"],
			["e10-technology-ethics", 1, "translation", "guess"],
			["e10-review", 1, "judgement", "promise"],
			["e10-feedback", 1, "issue", "timetable"],
			["e10-own-topic", 2, "opinion", "evidence"],
			["e10-sa-radio", 0, "a bus", "a train"],
			["e10-dictionary-intonation", 0, "a noun", "a verb"],
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
