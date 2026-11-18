import { describe, expect, it } from "vitest";
import { findLesson } from "../src/curriculum";
import { checkPractice } from "../src/practice";
import { comparisonSentence } from "../src/workshop";

describe("reviewed Grade 6 learner-facing accuracy", () => {
	it("keeps Hadrian's Wall inside northern England and south of Scotland", () => {
		const wall = findLesson("e6-romans-wall")!;
		expect(wall.paragraphs.join(" ")).toContain("vollständig in England");
		expect(wall.quiz.answer).toContain("komplett in Nordengland");
	});

	it("keeps mustn't distinct from don't have to", () => {
		const sub = findLesson("e6-substitutes")!;
		expect(sub.paragraphs.join(" ")).toContain("don't / doesn't / didn't have to");
		expect(sub.paragraphs.join(" ")).toContain("mustn't");
		expect(checkPractice(sub.practice, ["had to", "don't have to"])).toEqual([
			true,
			true,
		]);
		expect(checkPractice(sub.practice, ["had to", "mustn't"])).toEqual([
			true,
			false,
		]);
	});

	it("keeps no will inside type I if-clauses", () => {
		const cond = findLesson("e6-conditional-1")!;
		expect(cond.takeaway).toContain("niemals will");
		expect(checkPractice(cond.practice, ["rains", "can"])).toEqual([
			true,
			true,
		]);
		expect(checkPractice(cond.practice, ["will rain", "can"])).toEqual([
			false,
			true,
		]);
	});

	it("evaluates comparison scores across equal and unequal pairs", () => {
		expect(comparisonSentence(2, 2, "good")).toContain("as good as");
		expect(comparisonSentence(4, 2, "fast")).toContain("faster than");
		expect(comparisonSentence(1, 5, "exciting")).toContain(
			"more exciting than",
		);
	});
});
