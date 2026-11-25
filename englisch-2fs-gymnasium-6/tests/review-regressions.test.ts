import { describe, expect, it } from "vitest";
import { findLesson, LESSONS } from "../src/curriculum";
import { checkPractice } from "../src/practice";
import cell from "../cell.json";

const text = (id: string) => JSON.stringify(findLesson(id));

describe("checked Grade 6 facts stay as verified against the linked sources (2026-11-24)", () => {
	it("keeps the festival dates from the Wikipedia pages", () => {
		const festivals = text("e6s-festivals");
		expect(festivals).toContain("1. März ist St David's Day");
		expect(festivals).toContain("17. März St Patrick's Day");
		expect(festivals).toContain("5. November");
		expect(festivals).toContain("1605");
		expect(festivals).toContain("26. Dezember heißt Boxing Day");
	});

	it("keeps the geography of the UK and North America", () => {
		expect(text("e6s-british-isles")).toContain("Edinburgh (Scotland), Cardiff (Wales) und Belfast (Northern Ireland)");
		expect(text("e6s-british-isles")).toContain("seit 2020");
		expect(text("e6s-north-america")).toContain("Lower 48");
		expect(text("e6s-north-america")).toContain("zweitgrößte Land");
		expect(text("e6s-north-america")).toContain("Ottawa");
	});

	it("keeps the sights as checked: Big Ben is the bell, Liberty from France in 1886, Empire State 1931", () => {
		expect(text("e6s-london")).toContain("die große Glocke darin heißt Big Ben");
		expect(text("e6s-london")).toContain("Kronjuwelen");
		expect(text("e6s-washington-new-york")).toContain("1886");
		expect(text("e6s-washington-new-york")).toContain("1931");
		expect(text("e6s-washington-new-york")).toContain("gehört zu keinem Bundesstaat");
		// The National Mall page does not say that all museums are free: the lesson does not claim it.
		expect(text("e6s-washington-new-york")).not.toMatch(/kostenlos|free museums/);
		expect(text("e6s-rhyme")).toContain("Jane Taylor aus dem Jahr 1806");
	});

	it("names no current statistics and invents no numbers about English speakers", () => {
		expect(text("e6s-world")).toContain("Genaue Zahlen ändern sich");
		expect(text("e6s-world")).not.toMatch(/Millionen|million|percent|Prozent/);
		expect(text("e6s-world")).toContain("Erfinde keine Zahlen");
	});

	it("uses Ofcom drama telephone numbers in invented material", () => {
		expect(text("e6s-numbers")).toContain("0161 496 0732");
		expect(text("e6s-clothes")).toContain("07700 900123");
	});

	it("keeps the arithmetic in shopping and mediation tasks right", () => {
		// 8 + 2 · 3 = 14, 20 − 14 = 6.
		expect(findLesson("e6s-shopping")!.material).toContain("That's fourteen pounds");
		expect(findLesson("e6s-shopping")!.material).toContain("six pounds");
		// Souvenir shop: 5 + 3 · 1 = 8, 10 − 8 = 2.
		expect(findLesson("e6s-shopping")!.tasks[1].model).toContain("That's eight pounds");
		expect(findLesson("e6s-shopping")!.tasks[1].model).toContain("two pounds");
		// Picnic list: 2 + 4 + 3 + 2 + 1 = 12, 20 − 12 = 8.
		expect(findLesson("e6s-shopping")!.tasks[2].model).toContain("Total: twelve pounds");
		expect(findLesson("e6s-shopping")!.tasks[2].model).toContain("eight pounds left");
		// Family ticket £14 against 2 · £5 + 2 · £3 = £16.
		expect(findLesson("e6s-mediation")!.material).toContain("£14");
		expect(findLesson("e6s-mediation")!.tasks[1].model).toContain("günstiger als vier Einzelkarten");
		// 4:25 to 4:45 is twenty minutes.
		expect(findLesson("e6s-time")!.tasks[2].model).toContain("twenty minutes");
	});

	it("accepts the forms the lessons teach and rejects typical German transfer errors", () => {
		expect(checkPractice(findLesson("e6s-modals")!.practice, ["mustn't", "needn't"])).toEqual([true, true]);
		expect(checkPractice(findLesson("e6s-modals")!.practice, ["needn't", "mustn't"])).toEqual([false, false]);
		expect(checkPractice(findLesson("e6s-to-be")!.practice, ["aren't", "am"])).toEqual([true, true]);
		expect(checkPractice(findLesson("e6s-to-be")!.practice, ["isn't", "have"])).toEqual([false, false]);
		expect(checkPractice(findLesson("e6s-simple-past")!.practice, ["went", "did"])).toEqual([true, true]);
		expect(checkPractice(findLesson("e6s-simple-past")!.practice, ["goed", "do"])).toEqual([false, false]);
		expect(checkPractice(findLesson("e6s-genitive")!.practice, ["whose", "brothers'"])).toEqual([true, true]);
		expect(checkPractice(findLesson("e6s-genitive")!.practice, ["who's", "brother's"])).toEqual([false, false]);
		expect(checkPractice(findLesson("e6s-language-links")!.practice, ["drives", "lucky"])).toEqual([true, true]);
		expect(checkPractice(findLesson("e6s-language-links")!.practice, ["rides", "happy"])).toEqual([false, false]);
	});

	it("keeps every prerequisite earlier on the path and every quick check unambiguous", () => {
		const order = LESSONS.map((lesson) => lesson.id);
		const bySlug = new Map(cell.atoms.map((atom) => [atom.id, atom.slug]));
		for (const atom of cell.atoms)
			for (const edge of atom.prerequisites)
				expect(order.indexOf(bySlug.get(edge.atom_id)!)).toBeLessThan(order.indexOf(atom.slug));
		// "Please do so" answers a request for permission, not an offer.
		expect(findLesson("e6s-hello")!.quiz.wrong).toContain("Please do so.");
		// mustn't is a prohibition: the card offers the German trap as the wrong option.
		const card = cell.atoms
			.flatMap((atom) => atom.practice_items)
			.find((item) => item.slug === "e6s-modals-check")!;
		expect(card.concept).toContain("Verbot");
	});
});
