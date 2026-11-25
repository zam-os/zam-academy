import { describe, expect, it } from "vitest";
import { findLesson } from "../src/curriculum";
import { TOWN_ROUTES } from "../src/places-map";
import { checkPractice } from "../src/practice";
import { comparisonSentence } from "../src/workshop";

describe("reviewed Grade 6 learner-facing accuracy", () => {
	it("keeps Hadrian's Wall inside northern England and south of Scotland", () => {
		const wall = findLesson("e6-romans-wall")!;
		expect(wall.paragraphs.join(" ")).toContain("vollständig in England");
		expect(wall.quiz.answer).toContain("komplett in Nordengland");
	});

	it("keeps the museum route directions consistent with the town map", () => {
		expect(TOWN_ROUTES.museum.note).toContain("on your left");
		expect(TOWN_ROUTES.museum.note).not.toContain("right into High Street. Walk past the crossroads; the museum is on the right");
		const dir = findLesson("e6-directions")!;
		expect(dir.tasks[2].model).toContain("The museum is on your left.");
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

	it("keeps no will inside type I if-clauses and checks the requested modal verb", () => {
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
		expect(checkPractice(cond.practice, ["rains", "will"])).toEqual([
			true,
			false,
		]);
	});

	it("marks experiential ever/never as an outlook beyond Grade 6 core and keeps Rockies wording accurate", () => {
		const contrast = findLesson("e6-past-or-perfect")!;
		expect(contrast.paragraphs.join(" ")).toContain("Ausblick auf Klasse 7");
		expect(contrast.takeaway).toContain("Ausblick Klasse 7");
		const rockies = findLesson("e6-rockies")!;
		expect(rockies.paragraphs.join(" ")).toContain("national parks");
		expect(rockies.material).toContain("National parks");
		const prog = findLesson("e6-past-progressive")!;
		expect(prog.tasks[2].prompt).toContain("Unterschied im aspect zwischen");
	});

	it("evaluates comparison scores across equal and unequal pairs", () => {
		expect(comparisonSentence(2, 2, "good")).toContain("as good as");
		expect(comparisonSentence(4, 2, "fast")).toContain("faster than");
		expect(comparisonSentence(1, 5, "exciting")).toContain(
			"more exciting than",
		);
	});
});
