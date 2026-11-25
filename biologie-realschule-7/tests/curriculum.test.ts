import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import publication from "../publication.json";
import mapping from "../replaces-de-by.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { checkWorkshop, initialOrder, moveEntry } from "../src/workshop";
import { lessonLink, ZAM_CELL_ID, parseTrainingDeepLink } from "../src/zam/zam-link";
import snapshot from "./fixtures/de-by-realschule-7-biologie-pflanzen-fotosynthese-kvt.json";
import contract from "./fixtures/public-contract.json";

describe("LehrplanPLUS B7", () => {
	it("binds every expected competence to at least one known lesson and every lesson to the curriculum", () => {
		expect(coverage.tracks).toEqual(["I", "II", "IIIa", "IIIb"]);
		expect(coverage.stages.map(({ title, hours }) => [title, hours ?? undefined])).toEqual(
			STAGES.map(({ title, hours }) => [title, hours]),
		);
		expect(coverage.core_lessons).toBe(LESSONS.length);
		const sections = ["1.1", "1.2", "1.3", "2", "3", "4"];
		expect(sections.map((section) =>
			coverage.rows.filter((row) => row.section === section).map((row) => row.position),
		)).toEqual([10, 8, 3, 5, 5, 7].map((n) => Array.from({ length: n }, (_, i) => i + 1)));
		expect(new Set(coverage.rows.flatMap(({ lessons }) => lessons))).toEqual(
			new Set(LESSONS.map(({ id }) => id)),
		);
		expect(coverage.rows.filter(({ status }) => status === "supported")).toHaveLength(7);
	});

	it.each(LESSONS)("$id teaches, checks and gives practice at both levels", (lesson) => {
		expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(3);
		expect(lesson.visual.steps.length).toBeGreaterThanOrEqual(2);
		expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
		expect(lesson.sourceIds.every((id) => SOURCES.some((source) => source.id === id))).toBe(true);
		expect(lesson.tasks[2].prompt).not.toBe(lesson.tasks[1].prompt);
		for (const task of [lesson.tasks[1], lesson.tasks[2]]) {
			expect(task.model.length).toBeGreaterThan(40);
			expect(new Set(task.criteria).size).toBe(3);
		}
		expect(JSON.stringify(lesson)).not.toMatch(/\d\.\d|\bundefined\b|\bNaN\b/);
		const { workshop } = lesson;
		const solution = workshop.kind === "timeline"
			? workshop.entries.map((_, i) => i)
			: workshop.entries.map(({ target }) => target);
		const start = workshop.kind === "timeline"
			? initialOrder(workshop, lesson.id)
			: workshop.entries.map(() => -1);
		expect(checkWorkshop(workshop, start).every(Boolean)).toBe(false);
		expect(checkWorkshop(workshop, solution).every(Boolean)).toBe(true);
		expect(checkWorkshop(workshop, []).every(Boolean)).toBe(false);
		if (workshop.kind === "timeline") {
			expect(checkWorkshop(workshop, workshop.entries.map(() => 0)).every(Boolean)).toBe(false);
			expect(moveEntry(start, 0, -1)).toEqual(start);
			expect(moveEntry(start, 0, 1).slice(0, 2)).toEqual([start[1], start[0]]);
		}
	});
});

describe("ZAM cell", () => {
	it("pins every public anchor and stable atom and practice item id", () => {
		const allIds = cell.atoms.flatMap(({ id, practice_items }) => [id, ...practice_items.map((item) => item.id)]);
		expect(new Set(allIds).size).toBe(81);
		expect(allIds.every((id) => /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(id))).toBe(true);
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms.map(({ slug }) => slug)).toEqual(LESSONS.map(({ id }) => id));
		expect(Object.fromEntries(cell.atoms.map((a) => [
			a.slug, { atom: a.id, items: Object.fromEntries(a.practice_items.map((i) => [i.slug, i.id])) },
		]))).toEqual(contract);
		const seen = new Set<string>();
		for (const [i, atom] of cell.atoms.entries()) {
			expect(atom.prerequisites.every(({ atom_id }) => seen.has(atom_id))).toBe(true);
			seen.add(atom.id);
			expect(atom.curricula[1]).toMatchObject({
				provider: "lehrplanplus-bayern", school_type: "realschule", grade: 7,
				subject: "biologie", topic_code: `lb${LESSONS[i].lb}`,
			});
			expect(atom.source_link).toBe(lessonLink(atom.slug));
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(atom.source_link);
				expect(parseTrainingDeepLink(new URL(item.source_link).hash)).toEqual({ lessonId: atom.slug });
				if (item.tier === "tier1_fast") {
					expect(item.fast_check?.options).toHaveLength(2);
					expect(item.fast_check?.options[0]).toBe(item.concept);
					expect(item.fast_check?.correct_index).toBe(0);
				} else {
					expect(item.sample_solution).toBe(item.concept);
				}
			}
		}
	});

	it("declares exactly the approved plant card replacements and keeps the other cards active", () => {
		expect(publication.status).toBe("ready");
		expect(mapping.approved).toBe("2026-11-20");
		expect(mapping.status).toBe("approved");
		const legacyItems = snapshot.atoms.flatMap((a) => a.practice_items);
		expect(mapping.rows.map((row) => row.de_by_id)).toEqual(legacyItems.map(({ id }) => id));
		expect(mapping.rows.map((row) => row.de_by_question)).toEqual(legacyItems.map(({ question }) => question));
		const items = cell.atoms.flatMap((a) => a.practice_items);
		const replacements = mapping.rows.filter(({ category }) => category === "A");
		expect(replacements).toHaveLength(4);
		expect(new Set(replacements.map(({ academy_slug }) => academy_slug)).size).toBe(4);
		expect(items.flatMap((item) => "replaces" in item ? [{ slug: item.slug, ids: item.replaces }] : []))
			.toEqual(replacements.map((row) => ({ slug: row.academy_slug, ids: [row.de_by_id] })));
		expect(replacements.every(({ action }) => action === "replace")).toBe(true);
		expect(mapping.rows.filter(({ category, action, academy_slug }) =>
			category === "C" && action === "keep-active" && academy_slug === null,
		)).toHaveLength(4);
		expect(cell).not.toHaveProperty("retired_items");
	});
});
