import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import { CORE_LESSONS, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import {
	renderTownMap,
	renderUkCitiesMap,
	renderUsaMap,
} from "../src/places-map";
import {
	canAccept,
	canReview,
	checkPractice,
	quizFeedback,
	quizOptions,
} from "../src/practice";
import {
	britishDateSpoken,
	comparisonOutput,
	numberParts,
	numberWords,
	ordinalSuffix,
	ordinalWord,
	workshopGoals,
} from "../src/workshop";
import { ZAM_ACADEMY_APP_URL, ZAM_CELL_ID, lessonLink } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const ULID_RE = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

describe("englisch-mittelschule-6 curriculum content", () => {
	it("defines 6 stages and 36 core lessons", () => {
		expect(STAGES).toHaveLength(6);
		expect(LESSONS).toHaveLength(36);
		expect(CORE_LESSONS).toHaveLength(36);
		expect(new Set(LESSONS.map((l) => l.id)).size).toBe(36);
	});

	it("references only valid stages and verified HTTPS sources", () => {
		const stageIds = new Set(STAGES.map((s) => s.id));
		const sourceIds = new Set(SOURCES.map((s) => s.id));
		for (const lesson of LESSONS) {
			expect(stageIds.has(lesson.stage)).toBe(true);
			expect(lesson.sourceIds.length).toBeGreaterThan(0);
			for (const id of lesson.sourceIds) {
				expect(sourceIds.has(id)).toBe(true);
				const found = SOURCES.find((s) => s.id === id);
				expect(found?.url.startsWith("https://")).toBe(true);
			}
		}
	});

	it("meets lesson depth, two-level distinction and workshop standards", () => {
		for (const lesson of LESSONS) {
			expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThanOrEqual(350);
			expect(lesson.takeaway.length).toBeGreaterThan(30);
			expect(lesson.material.length).toBeGreaterThanOrEqual(95);

			const options = quizOptions(lesson);
			expect(options).toHaveLength(3);
			expect(new Set(options).size).toBe(3);
			expect(options).toContain(lesson.quiz.answer);
			expect(quizFeedback(lesson, lesson.quiz.answer)).toMatch(/^Richtig\./);

			expect(lesson.workshop.goals).toHaveLength(3);
			expect(workshopGoals(lesson.workshop, ["", "", ""])).toEqual([
				false,
				false,
				false,
			]);
			for (const goal of lesson.workshop.goals) {
				expect(goal.options).toHaveLength(3);
				expect(new Set(goal.options).size).toBe(3);
				expect(goal.options).toContain(goal.answer);
			}
			expect(
				workshopGoals(
					lesson.workshop,
					lesson.workshop.goals.map((g) => g.answer),
				),
			).toEqual([true, true, true]);

			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
			expect(lesson.tasks[1].criteria).toHaveLength(3);
			expect(lesson.tasks[2].criteria).toHaveLength(3);

			expect(lesson.practice.length).toBeGreaterThanOrEqual(2);
			for (const item of lesson.practice) {
				for (const accepted of item.answers) {
					expect(checkPractice([item], [accepted])).toEqual([true]);
				}
			}
		}
	});

	it("stays strictly inside Mittelschule Grade 6 boundaries (no Grade 7 grammar)", () => {
		for (const lesson of LESSONS) {
			const combined = [
				...lesson.paragraphs,
				lesson.takeaway,
				lesson.material,
				lesson.quiz.question,
				lesson.quiz.answer,
				...lesson.quiz.wrong,
				...lesson.practice.map((p) => p.prompt),
				lesson.tasks[1].model,
				lesson.tasks[2].model,
			].join(" ");

			expect(combined).not.toMatch(
				/\b(present perfect|going-to-future|past progressive|should|shouldn't|myself|yourself|himself|herself|ourselves|themselves|mine|yours|theirs)\b/i,
			);
			expect(combined).not.toMatch(/\b(was|were)\s+\w+ing\b/i);
			expect(combined).not.toMatch(
				/\b(more|most)\s+(interesting|expensive|exciting|difficult|beautiful|comfortable|important|popular|famous)\b/i,
			);
		}
	});

	it("renders UK, USA and Town maps plus 0-1000 numbers, 1st-31st ordinals and Germanic comparison", () => {
		const ukSvg = renderUkCitiesMap();
		for (const label of [
			"Scotland",
			"England",
			"Wales",
			"Northern Ireland",
			"Republic of Ireland",
			"London",
			"Edinburgh",
			"Glasgow",
			"Manchester",
			"Liverpool",
			"Birmingham",
			"Cardiff",
			"Belfast",
			"Dublin",
		]) {
			expect(ukSvg).toContain(label);
		}

		const usaSvg = renderUsaMap();
		for (const label of [
			"Washington, D.C.",
			"New York",
			"Chicago",
			"Los Angeles",
			"Seattle",
			"Houston",
			"Miami",
			"Alaska",
			"Hawaii",
			"Canada",
			"Mexico",
		]) {
			expect(usaSvg).toContain(label);
		}

		const townSvg = renderTownMap();
		for (const label of [
			"Youth Hostel",
			"Souvenir Shop",
			"Newsagent",
			"Museum",
			"Bus Stop",
			"City Park",
			"Bridge",
			"High Street",
			"River Street",
		]) {
			expect(townSvg).toContain(label);
		}

		expect(numberParts(0)).toEqual([0]);
		expect(numberParts(42)).toEqual([40, 2]);
		expect(numberParts(208)).toEqual([200, 8]);
		expect(numberParts(347)).toEqual([300, 40, 7]);
		expect(numberParts(1000)).toEqual([1000]);
		expect(numberWords(0)).toBe("zero");
		expect(numberWords(100)).toBe("one hundred");
		expect(numberWords(101)).toBe("one hundred and one");
		expect(numberWords(347)).toBe("three hundred and forty-seven");
		expect(numberWords(500)).toBe("five hundred");
		expect(numberWords(999)).toBe("nine hundred and ninety-nine");
		expect(numberWords(1000)).toBe("one thousand");
		for (let n = 0; n <= 1000; n += 13) {
			const w = numberWords(n);
			expect(w.length).toBeGreaterThan(0);
			expect(w).not.toMatch(/undefined|NaN/);
		}

		expect(ordinalSuffix(1)).toBe("1st");
		expect(ordinalSuffix(2)).toBe("2nd");
		expect(ordinalSuffix(3)).toBe("3rd");
		expect(ordinalSuffix(11)).toBe("11th");
		expect(ordinalSuffix(12)).toBe("12th");
		expect(ordinalSuffix(13)).toBe("13th");
		expect(ordinalSuffix(21)).toBe("21st");
		expect(ordinalSuffix(31)).toBe("31st");
		expect(ordinalWord(5)).toBe("fifth");
		expect(ordinalWord(8)).toBe("eighth");
		expect(ordinalWord(9)).toBe("ninth");
		expect(ordinalWord(12)).toBe("twelfth");
		expect(ordinalWord(20)).toBe("twentieth");
		expect(ordinalWord(30)).toBe("thirtieth");
		expect(ordinalWord(31)).toBe("thirty-first");
		expect(britishDateSpoken(14, "May")).toBe("the fourteenth of May");
		for (let d = 1; d <= 31; d++) {
			expect(ordinalSuffix(d)).not.toMatch(/undefined|NaN/);
			expect(ordinalWord(d)).not.toMatch(/undefined|NaN/);
		}

		for (const a of [10, 40, 65, 100]) {
			for (const b of [10, 40, 65, 100]) {
				const out = comparisonOutput(a, b);
				expect(out.en).not.toMatch(/undefined|NaN|\b(more|most)\b/i);
				expect(out.de).not.toMatch(/undefined|NaN|\b(more|most)\b/i);
			}
		}
		expect(comparisonOutput(50, 50).en).toContain("as tall as");
		expect(comparisonOutput(80, 40).en).toContain("taller than");
		expect(comparisonOutput(30, 70).en).toContain("shorter than");
	});

	it("matches coverage.json, cell.json and public-contract.json 1:1", () => {
		const coveredIds = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) {
			expect(coveredIds.has(lesson.id)).toBe(true);
		}

		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms).toHaveLength(LESSONS.length);
		expect(contract).toHaveLength(LESSONS.length);

		let totalItems = 0;
		const seenIds = new Set<string>();
		for (let i = 0; i < LESSONS.length; i++) {
			const lesson = LESSONS[i];
			const atom = cell.atoms[i];
			const c = contract[i];

			expect(atom.slug).toBe(lesson.id);
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(atom.source_link.startsWith(ZAM_ACADEMY_APP_URL)).toBe(true);
			expect(ULID_RE.test(atom.id)).toBe(true);
			expect(seenIds.has(atom.id)).toBe(false);
			seenIds.add(atom.id);

			expect(atom.practice_items).toHaveLength(3);
			expect(c.id).toBe(atom.id);
			expect(c.slug).toBe(atom.slug);
			expect(c.items).toHaveLength(3);

			for (let j = 0; j < atom.practice_items.length; j++) {
				const item = atom.practice_items[j];
				totalItems += 1;
				expect(ULID_RE.test(item.id)).toBe(true);
				expect(seenIds.has(item.id)).toBe(false);
				seenIds.add(item.id);
				expect(c.items[j]).toEqual({ id: item.id, slug: item.slug });
			}
		}
		expect(totalItems).toBe(108);
	});

	it("enforces writing length and self-check gates", () => {
		expect(canReview("short")).toBe(false);
		expect(canReview("This text is more than twenty chars long.")).toBe(true);
		expect(
			canAccept("This text is more than twenty chars long.", [
				true,
				true,
				false,
			]),
		).toBe(false);
		expect(
			canAccept("This text is more than twenty chars long.", [
				true,
				true,
				true,
			]),
		).toBe(true);
	});
});
