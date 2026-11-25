import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import checks from "../source-checks.json";
import proposal from "../replaces-de-by.json";
import legacy from "./fixtures/de-by-gymnasium-7-englisch-grammar-present-perfect-modals-conditionals-kvt.json";
import contract from "./fixtures/public-contract.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { checkPractice, normalise, quizOptions } from "../src/practice";
import { workshopPieces } from "../src/workshop";
import { britainPoint } from "../src/britain";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";

const validUlid = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

describe("curriculum and lesson contracts", () => {
	it("maps the official rows bidirectionally", () => {
		expect(coverage.rows).toHaveLength(40);
		expect([...new Set(coverage.rows.map((row) => row.lb))]).toEqual([
			"1.1",
			"1.2",
			"2",
			"3",
			"4",
			"5",
		]);
		for (const row of coverage.rows) {
			expect(row.evidence.length, row.id).toBeGreaterThan(20);
			expect(row.lessons.length, row.id).toBeGreaterThan(0);
			for (const id of row.lessons)
				expect(LESSONS.find((lesson) => lesson.id === id)?.bindings, row.id).toContain(row.lb);
		}
		for (const lesson of LESSONS) {
			expect(lesson.bindings, lesson.id).toEqual([
				...new Set(
					coverage.rows.filter((row) => row.lessons.includes(lesson.id)).map((row) => row.lb),
				),
			]);
			expect(STAGES.some((stage) => stage.id === lesson.stage)).toBe(true);
			expect(lesson.sourceIds.every((id) => SOURCES.some((source) => source.id === id))).toBe(true);
		}
		expect(SOURCES.map(({ url }) => url)).toEqual(checks.map(({ url }) => url));
		expect(coverage.choices).toEqual({ uk: "Cornwall", usa: "Florida" });
	});

	it("pins every lesson link, item id and second-language curriculum binding", () => {
		expect(LESSONS.map(({ id }) => id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(37);
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(
			cell.atoms.map(({ slug, id, practice_items }) => ({
				slug,
				id,
				items: practice_items.map(({ slug, id }) => ({ slug, id })),
			})),
		).toEqual(contract.atoms);
		const items = cell.atoms.flatMap((atom) => atom.practice_items);
		expect(items).toHaveLength(74);
		const ids = [...cell.atoms, ...items].map(({ id }) => id);
		expect(ids.every((id) => validUlid.test(id))).toBe(true);
		expect(new Set(ids).size).toBe(ids.length);
		expect(cell).not.toHaveProperty("retired_items");
		for (const [index, atom] of cell.atoms.entries()) {
			const lesson = LESSONS[index];
			expect(atom.slug).toBe(lesson.id);
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(parseTrainingDeepLink(new URL(atom.source_link).hash).lessonId).toBe(lesson.id);
			expect(
				atom.curricula
					.filter(({ provider }) => provider === "lehrplanplus-bayern")
					.map(({ subject }) => subject),
			).toEqual(lesson.bindings.map(() => "englisch-2fs"));
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(atom.source_link);
				expect(item).not.toHaveProperty("replaces");
				if (item.tier === "tier1_fast") {
					expect(item.fast_check?.options).toHaveLength(2);
					expect(item.fast_check?.options[item.fast_check.correct_index]).toBe(item.concept);
				} else expect(item.sample_solution?.[0].text).toBeTruthy();
			}
		}
	});

	it.each(LESSONS)("checks guided and open practice for $id", (lesson) => {
		expect(lesson.paragraphs).toHaveLength(2);
		expect(new Set(quizOptions(lesson)).size).toBe(3);
		const pieces = workshopPieces(lesson.workshop.visual);
		const ids = pieces.map((piece) => piece.id);
		expect(ids.length).toBeGreaterThanOrEqual(3);
		expect(new Set(ids).size).toBe(ids.length);
		const targets = lesson.workshop.goals.map(({ answer }) => answer);
		expect(new Set(targets).size).toBe(3);
		for (const goal of lesson.workshop.goals) {
			expect(ids, goal.label).toContain(goal.answer);
			expect(goal.explanation.length).toBeGreaterThan(15);
			const duplicate = lesson.practice.some(({ prompt }) =>
				normalise(prompt).includes(normalise(goal.label)),
			);
			expect(duplicate, goal.label).toBe(false);
		}
		expect(lesson.practice).toHaveLength(2);
		expect(
			checkPractice(
				lesson.practice,
				lesson.practice.map((item) => item.answers[0]),
			),
		).toEqual([true, true]);
		expect(checkPractice(lesson.practice, ["", ""])).toEqual([false, false]);
		expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
		for (const task of Object.values(lesson.tasks)) {
			expect(new Set(task.criteria).size).toBe(3);
			expect(task.model.length).toBeGreaterThan(20);
		}
		if (lesson.listening) {
			expect(["en-GB", "en-US"]).toContain(lesson.accent);
			expect(lesson.materialLanguage).toBe("en");
		}
	});
	it("accepts valid alternate spellings and relative pronouns without weakening other checks", () => {
		const practice = (id: string) => LESSONS.find((lesson) => lesson.id === id)!.practice;
		expect(checkPractice(practice("e7s-relatives"), ["that", "that"])).toEqual([true, true]);
		expect(checkPractice(practice("e7s-relatives"), ["which", "who"])).toEqual([false, false]);
		expect(checkPractice(practice("e7s-airport"), ["B16", "2:15"])).toEqual([true, true]);
		expect(checkPractice(practice("e7s-airport"), ["B 16", "2:15"])).toEqual([true, true]);
		expect(checkPractice(practice("e7s-station"), ["9.40", "4"])).toEqual([true, true]);
		expect(checkPractice(practice("e7s-station"), ["9:40", "4"])).toEqual([true, true]);
	});

	it("keeps the map north-up and places Bath in south-west England", () => {
		const [truroX, truroY] = britainPoint(-5.052, 50.262);
		const [bathX, bathY] = britainPoint(-2.359, 51.381);
		const [londonX] = britainPoint(-0.1276, 51.5072);
		const [, wallY] = britainPoint(-2.37, 55.13);
		expect(bathX).toBeGreaterThan(truroX);
		expect(bathX).toBeLessThan(londonX);
		expect(bathY).toBeLessThan(truroY);
		expect(bathY).toBeGreaterThan(wallY);
	});

	it("records J03 as the sole future proposal against every id in the legacy snapshot", () => {
		const itemIds = legacy.atoms.flatMap(({ practice_items }) =>
			practice_items.map(({ id }) => id),
		);
		expect(proposal.rows.map(({ de_by_id }) => de_by_id).sort()).toEqual(itemIds.sort());
		expect(proposal.status).toBe("proposal-only");
		expect(proposal.approved).toBeNull();
		const pending = proposal.rows.filter((row) => row.action === "propose-replace-after-approval");
		expect(pending).toHaveLength(1);
		expect(pending[0]).toMatchObject({
			category: "A",
			de_by_id: "01K4E7G0000000000000000J03",
			academy_slug: "e7s-modals-check",
		});
		const successors = cell.atoms
			.flatMap(({ practice_items }) => practice_items)
			.filter((item) => item.slug === pending[0].academy_slug);
		expect(successors).toHaveLength(1);
		expect(successors[0].concept).toMatch(/^Had to/i);
	});
});
