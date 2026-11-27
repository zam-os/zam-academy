import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import checks from "../source-checks.json";
import proposal from "../replaces-de-by.json";
import legacy from "./fixtures/de-by-gymnasium-8-englisch-past-perfect-passive-indirect-speech-usa-kvt.json";
import contract from "./fixtures/public-contract.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { checkPractice, normalise, quizOptions } from "../src/practice";
import { workshopPieces } from "../src/workshop";
import { britainPoint, MAP_DATA, SCENE_DATA } from "../src/maps";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";

const validUlid = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

describe("curriculum and lesson contracts", () => {
	it("maps the official rows bidirectionally across all learning areas", () => {
		expect(coverage.rows).toHaveLength(46);
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
		expect(STAGES).toHaveLength(7);
	});

	it("pins every lesson link, item id and second-language curriculum binding", () => {
		expect(LESSONS.map(({ id }) => id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(40);
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(
			cell.atoms.map(({ slug, id, practice_items }) => ({
				slug,
				id,
				items: practice_items.map(({ slug, id }) => ({ slug, id })),
			})),
		).toEqual(contract.atoms);
		const items = cell.atoms.flatMap((atom) => atom.practice_items);
		expect(items).toHaveLength(120);
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
					.map(({ subject, grade }) => ({ subject, grade })),
			).toEqual(lesson.bindings.map(() => ({ subject: "englisch-2fs", grade: 8 })));
			for (const item of atom.practice_items) {
				expect(item).not.toHaveProperty("replaces");
				expect(item.source_link).toBe(atom.source_link);
				if (item.tier === "tier1_fast") {
					expect(item.fast_check?.options).toHaveLength(2);
					expect(item.fast_check?.correct_index).toBe(0);
					expect(item.fast_check?.options[0]).toBe(item.concept);
					expect(item.fast_check?.options[1]).not.toBe(item.concept);
				} else expect(item.sample_solution?.[0].text).toBeTruthy();
			}
		}
	});

	it.each(LESSONS)("checks guided and open practice for $id", (lesson) => {
		expect(lesson.paragraphs).toHaveLength(2);
		for (const germanField of [
			...lesson.paragraphs,
			lesson.takeaway,
			lesson.quiz.question,
			lesson.quiz.explanation,
			lesson.tasks[1].prompt,
			lesson.tasks[2].prompt,
		]) {
			expect(germanField).not.toMatch(/\d\.\d/);
		}
		expect(new Set(quizOptions(lesson)).size).toBe(3);
		const pieces = workshopPieces(lesson.workshop.visual);
		const ids = pieces.map((piece) => piece.id);
		expect(ids).toHaveLength(3);
		expect(new Set(ids).size).toBe(3);
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
			expect(task.model.length).toBeGreaterThan(30);
		}
		if (lesson.listening) {
			expect(["en-GB", "en-US", "en-CA"]).toContain(lesson.accent);
			expect(lesson.materialLanguage).toBe("en");
		}
	});

	it("places quiz answers and workshop goal targets at varying positions across lessons", () => {
		const quizPositions = [0, 0, 0];
		const patterns = new Set<string>();
		const goalPosCounts = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		];
		for (const lesson of LESSONS) {
			quizPositions[quizOptions(lesson).indexOf(lesson.quiz.answer)]++;
			const ids = workshopPieces(lesson.workshop.visual).map((p) => p.id);
			const pat = lesson.workshop.goals.map((g) => {
				const idx = ids.indexOf(g.answer);
				return idx;
			});
			pat.forEach((idx, gIdx) => goalPosCounts[gIdx][idx]++);
			patterns.add(pat.join(""));
		}
		expect(quizPositions.every((c) => c >= 8)).toBe(true);
		expect(patterns.size).toBeGreaterThanOrEqual(5);
		for (const counts of goalPosCounts) {
			expect(counts.every((c) => c >= 5)).toBe(true);
		}
	});

	it("keeps UK and North America maps geometrically sound", () => {
		const [eryriX, eryriY] = britainPoint(-3.95, 53.05);
		const [cardiffX, cardiffY] = britainPoint(-3.18, 51.48);
		const [londonX] = britainPoint(-0.13, 51.51);
		expect(eryriY).toBeLessThan(cardiffY);
		expect(cardiffX).toBeLessThan(londonX);
		expect(eryriX).toBeLessThan(londonX);

		const [van, ott, nun] = MAP_DATA.canada.places;
		expect(van.point[0]).toBeLessThan(ott.point[0]);
		expect(nun.point[1]).toBeLessThan(ott.point[1]);
		expect(SCENE_DATA["holiday-calendar"].pieces).toHaveLength(3);
	});

	it("keeps the proposal-only legacy inventory complete without claiming replacements", () => {
		const itemIds = legacy.atoms.flatMap(({ practice_items }) =>
			practice_items.map(({ id }) => id),
		);
		expect(proposal.rows.map(({ de_by_id }) => de_by_id).sort()).toEqual(itemIds.sort());
		expect(proposal.status).toBe("proposal-only");
		expect(proposal.approved).toBeNull();
		expect(proposal.rows.every((row) => row.category === "C" && row.action === "keep-active")).toBe(
			true,
		);
		expect(cell.atoms.flatMap((a) => a.practice_items).filter((i) => "replaces" in i)).toEqual([]);
	});
});
