import { describe, expect, it } from "vitest";
import { findLesson } from "../src/curriculum";
import { US_CITIES } from "../src/places-map";
import { checkPractice } from "../src/practice";
import {
	comparisonSentence,
	fahrenheitToCelsius,
	fmtDe,
	timelineLabel,
} from "../src/workshop";

describe("Grade 6 Realschule pedagogical accuracy checks", () => {
	it("formats negative Celsius values with U+2212 minus and decimal comma", () => {
		expect(fmtDe(fahrenheitToCelsius(14), 1)).toBe("\u221210,0");
		expect(fmtDe(fahrenheitToCelsius(32), 1)).toBe("0,0");
		expect(fmtDe(fahrenheitToCelsius(68), 1)).toBe("20,0");
		expect(fmtDe(fahrenheitToCelsius(86), 1)).toBe("30,0");
	});

	it("keeps possessive pronouns apostrophe-free and distinct from determiners", () => {
		const lesson = findLesson("e6-possessives")!;
		expect(lesson.paragraphs.join(" ")).toContain("niemals einen Apostroph");
		expect(checkPractice(lesson.practice, ["mine", "her's"])).toEqual([
			true,
			false,
		]);
		expect(checkPractice(lesson.practice, ["mine", "hers"])).toEqual([
			true,
			true,
		]);
	});

	it("keeps will-future and going-to-future separated without contrast traps", () => {
		const willLesson = findLesson("e6-will-future")!;
		const goingLesson = findLesson("e6-going-to-future")!;
		expect(willLesson.quiz.wrong.join(" ")).not.toContain("going to");
		expect(goingLesson.quiz.wrong.join(" ")).not.toContain("will");
	});

	it("keeps comparison and timeline helpers finite across all slider stops", () => {
		for (let a = 40; a <= 120; a += 10)
			for (let b = 40; b <= 120; b += 10) {
				const out = comparisonSentence(a, b);
				expect(out.en).not.toMatch(/NaN|undefined/);
				expect(out.de).not.toMatch(/NaN|undefined/);
			}
		for (let minute = 0; minute <= 60; minute += 5) {
			const point = timelineLabel(minute);
			expect(point.time).toMatch(/^1[67]:\d{2}$/);
			expect(point.en).not.toMatch(/NaN|undefined/);
		}
	});

	it("keeps review fixes intact across IPA, grammar prompts, and regions", () => {
		const pron = findLesson("e6-pronunciation")!;
		expect(pron.paragraphs.join(" ")).toContain("/təˈmeɪtoʊ/");
		expect(pron.paragraphs.join(" ")).not.toContain("/təˈmeɪtəʊ/");
		expect(pron.material).toContain("/təˈmeɪtoʊ/");
		expect(pron.material).not.toContain("/təˈmeɪtəʊ/");

		const will = findLesson("e6-will-future")!;
		expect(will.quiz.answer).toContain("pick it up");
		expect(will.quiz.wrong[0]).toContain("pick it up");

		const ppUse = findLesson("e6-present-perfect-use")!;
		expect(ppUse.tasks["1"].model).not.toContain("I've got");

		const goingTo = findLesson("e6-going-to-future")!;
		expect(goingTo.quiz.wrong.join(" ")).not.toContain("Present Progressive");

		expect(US_CITIES.washington.region).toBe("midAtlantic");
	});
});
