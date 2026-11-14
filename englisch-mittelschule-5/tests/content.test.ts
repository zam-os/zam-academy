import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import { CORE_LESSONS, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import {
	canAccept,
	canReview,
	checkPractice,
	quizFeedback,
	quizOptions,
} from "../src/practice";
import { renderUkMap } from "../src/uk-map";
import {
	clockLabel,
	numberParts,
	numberWords,
	workshopGoals,
} from "../src/workshop";
import { ZAM_ACADEMY_APP_URL, ZAM_CELL_ID, lessonLink } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const ULID_RE = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

describe("englisch-mittelschule-5 curriculum content", () => {
	it("defines 6 stages and 36 core lessons", () => {
		expect(STAGES).toHaveLength(6);
		expect(LESSONS).toHaveLength(36);
		expect(CORE_LESSONS).toHaveLength(36);
		expect(new Set(LESSONS.map((l) => l.id)).size).toBe(36);
	});

	it("references only valid stages and verified sources", () => {
		const stageIds = new Set(STAGES.map((s) => s.id));
		const sourceIds = new Set(SOURCES.map((s) => s.id));
		for (const lesson of LESSONS) {
			expect(stageIds.has(lesson.stage)).toBe(true);
			expect(lesson.sourceIds.length).toBeGreaterThan(0);
			for (const id of lesson.sourceIds) {
				expect(sourceIds.has(id)).toBe(true);
			}
			for (const source of lesson.sourceIds) {
				const found = SOURCES.find((s) => s.id === source);
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

			// Quiz integrity
			const options = quizOptions(lesson);
			expect(options).toHaveLength(3);
			expect(new Set(options).size).toBe(3);
			expect(options).toContain(lesson.quiz.answer);
			expect(quizFeedback(lesson, lesson.quiz.answer)).toMatch(/^Richtig\./);

			// Workshop integrity: 3 reachable goals, none reached on empty selection
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

			// Two distinct task levels with 3 criteria each
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
			expect(lesson.tasks[1].criteria).toHaveLength(3);
			expect(lesson.tasks[2].criteria).toHaveLength(3);

			// Short practice items are answerable by each accepted variant
			expect(lesson.practice.length).toBeGreaterThanOrEqual(2);
			for (const item of lesson.practice) {
				for (const accepted of item.answers) {
					expect(checkPractice([item], [accepted])).toEqual([true]);
				}
			}
		}
	});

	it("stays strictly inside Mittelschule Grade 5 boundaries (no Grade 6 tenses)", () => {
		for (const lesson of LESSONS) {
			const combined = [
				...lesson.paragraphs,
				lesson.takeaway,
				lesson.material,
				lesson.tasks[1].model,
				lesson.tasks[2].model,
			].join(" ");
			// Check there is no progressive verb phrase like "is playing" or "are going"
			const prog = combined.match(/\b(am|is|are|was|were)\s+\w+ing\b/gi) ?? [];
			// Only Gerund predicate in "hobbies are swimming and drawing" is allowed
			for (const hit of prog) {
				expect(hit.toLowerCase()).toBe("are swimming");
			}
		}
	});

	it("renders UK map, 0-100 number explorer and quarter-hour clock accurately", () => {
		const mapSvg = renderUkMap();
		for (const label of [
			"Scotland",
			"England",
			"Wales",
			"Northern Ireland",
			"Republic of Ireland",
			"Edinburgh",
			"London",
			"Cardiff",
			"Belfast",
			"Dublin",
		]) {
			expect(mapSvg).toContain(label);
		}

		expect(numberParts(0)).toEqual([0]);
		expect(numberParts(42)).toEqual([40, 2]);
		expect(numberParts(100)).toEqual([100]);
		expect(numberWords(0)).toBe("zero");
		expect(numberWords(14)).toBe("fourteen");
		expect(numberWords(42)).toBe("forty-two");
		expect(numberWords(99)).toBe("ninety-nine");
		expect(numberWords(100)).toBe("one hundred");

		expect(clockLabel(9, 0)).toBe("nine o'clock");
		expect(clockLabel(9, 15)).toBe("quarter past nine");
		expect(clockLabel(10, 30)).toBe("half past ten");
		expect(clockLabel(11, 45)).toBe("quarter to twelve");
		expect(clockLabel(23, 45)).toBe("quarter to twelve");
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
