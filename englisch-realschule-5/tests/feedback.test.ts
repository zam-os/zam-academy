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
		const lesson = LESSONS.find((entry) => entry.id === "e5-classroom-phrases");
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
	it("explains the difference between verb + to-infinitive and verb + -ing", () => {
		const lesson = LESSONS.find((entry) => entry.id === "e5-hobbies-sports");
		if (!lesson) throw new Error("Missing hobbies lesson");
		expect(lesson.paragraphs[1]).toContain("enjoy");
		expect(lesson.tasks[1].model).toContain("enjoy playing");
	});
	it("keeps the German-learner trap didn't went out of every model answer", () => {
		for (const lesson of LESSONS)
			for (const task of Object.values(lesson.tasks))
				expect(task.model).not.toMatch(/\bdidn['’]t went\b/i);
	});
	it("accepts natural short phrases without accepting a different fact", () => {
		const examples: [string, number, string, string][] = [
			["e5-classroom-phrases", 0, "14", "40"],
			["e5-family-listening", 0, "three", "four"],
			["e5-to-be", 0, "aren't", "isn't"],
			["e5-have-got", 0, "hasn't", "haven't"],
			["e5-articles-nouns", 0, "children", "childs"],
			["e5-articles-nouns", 2, "a", "an"],
			["e5-simple-present", 0, "tidies", "tidys"],
			["e5-present-progressive", 0, "is sitting", "sitting"],
			["e5-simple-past-irregular-did", 1, "take", "took"],
			["e5-imperatives", 0, "Don't", "Not"],
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
