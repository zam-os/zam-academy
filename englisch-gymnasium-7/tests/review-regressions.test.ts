import { describe, expect, it } from "vitest";
import { findLesson, LESSONS } from "../src/curriculum";
import { checkPractice } from "../src/practice";

const text = (id: string) => JSON.stringify(findLesson(id));

describe("checked Grade 7 facts stay as verified against the linked sources", () => {
	it("keeps the dates of English history consistent (Wikipedia, checked 2026-11-23)", () => {
		expect(text("e7-1066")).toContain("14. Oktober 1066");
		expect(text("e7-1066")).toContain("Westminster Abbey");
		expect(text("e7-1066")).toContain("1086");
		expect(text("e7-henry-viii")).toContain("1534");
		expect(text("e7-henry-viii")).toContain("1509 bis 1547");
		expect(text("e7-elizabeth-i")).toContain("1558 bis 1603");
		expect(text("e7-elizabeth-i")).toContain("1588");
		expect(text("e7-mayflower")).toContain("102 Passagiere");
		expect(text("e7-mayflower")).toContain("September 1620");
		expect(text("e7-wales-castle-mediation")).toContain("between 1283 and 1287");
		expect(text("e7-wales-castle-mediation")).toContain("eight huge towers");
	});

	it("keeps geography and holiday facts consistent", () => {
		expect(text("e7-wales")).toContain("1085 Metern");
		expect(text("e7-wales")).toContain("Cardiff");
		expect(text("e7-desert-southwest")).toContain("446 Kilometer");
		expect(text("e7-desert-southwest")).toContain("Navajo Nation");
		expect(text("e7-thanksgiving")).toContain("vierten Donnerstag im November");
		expect(text("e7-thanksgiving")).toContain("zweiten Montag im Oktober");
		expect(text("e7-independence-day")).toContain("zweiten Montag im Oktober");
		expect(findLesson("e7-vlog-listening")!.tasks[2].model).toContain(
			"etwa 40 Grad Celsius",
		);
	});

	it("names no current prices, results or statistics as facts", () => {
		expect(text("e7-southwest-mediation")).not.toMatch(/\d+ dollars/);
		expect(text("e7-current-events")).toContain("erfunden");
		expect(text("e7-food-free-time")).not.toMatch(/percent|Prozent/);
		expect(text("e7-media-use")).toContain("Erfinde keine Zahlen");
	});

	it("keeps Grade 6 modal substitutes as repetition, not as a new Grade 7 target", () => {
		for (const lesson of LESSONS)
			expect(lesson.title.toLowerCase()).not.toContain("had to");
		expect(text("e7-conditional-2")).toContain("Typ I");
	});

	it("accepts the grammar answers the lessons teach and rejects typical German transfer errors", () => {
		const since = findLesson("e7-since-for")!;
		expect(checkPractice(since.practice, ["since", "ago"])).toEqual([true, true]);
		expect(checkPractice(since.practice, ["for", "before"])).toEqual([false, false]);
		const tense = findLesson("e7-tense-sequence")!;
		expect(checkPractice(tense.practice, ["will arrive", "had eaten"])).toEqual([
			false,
			true,
		]);
		const wishes = findLesson("e7-wishes")!;
		expect(checkPractice(wishes.practice, ["know", "had taken"])).toEqual([
			false,
			true,
		]);
		const contrast = findLesson("e7-language-contrast")!;
		expect(checkPractice(contrast.practice, ["be", "live"])).toEqual([false, false]);
		expect(checkPractice(contrast.practice, ["is", "have lived"])).toEqual([true, true]);
	});
});
