import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import publication from "../publication.json";
import { LESSON_BY_ID, LESSONS, LEXIKON_GROUPS, STAGES } from "../src/curriculum";
import { lessonSourceUrl } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const ULID_RE = /^[0-9A-HJKMNP-TV-Z]{26}$/;

describe("HSU 4 curriculum, coverage & ZAM cell contract", () => {
	it("defines 6 stages with distinct light and dark palettes", () => {
		expect(STAGES).toHaveLength(6);
		const lightColors = new Set(STAGES.map((s) => s.accentLight));
		const darkColors = new Set(STAGES.map((s) => s.accentDark));
		expect(lightColors.size).toBe(6);
		expect(darkColors.size).toBe(6);
	});

	it("defines 20 complete stations in sequential order", () => {
		expect(LESSONS).toHaveLength(20);
		LESSONS.forEach((lesson, idx) => {
			expect(lesson.number).toBe(idx + 1);
			expect(lesson.storyParagraphs.length).toBeGreaterThanOrEqual(2);
			expect(lesson.factCards).toHaveLength(3);
			expect(lesson.workedExample.steps.length).toBeGreaterThanOrEqual(3);
			expect(lesson.merksatz.length).toBeGreaterThan(25);
			expect(lesson.probenWissen.length).toBeGreaterThanOrEqual(3);
			expect(new Set(lesson.quickCheck.options).size).toBe(3);
			expect(lesson.lab.goals).toHaveLength(3);
		});
		expect(LEXIKON_GROUPS).toHaveLength(6);
	});

	it("maps all 75 official HSU 3/4 competences to valid lessons and leaves no orphan lesson", () => {
		expect(publication.status).toBe("local-only");
		expect(coverage.rows).toHaveLength(75);
		const referenced = new Set<string>(coverage.optional_lessons);
		for (const row of coverage.rows) {
			expect(row.competence.length).toBeGreaterThan(15);
			expect(row.lessons.length).toBeGreaterThanOrEqual(1);
			for (const id of row.lessons) {
				expect(LESSON_BY_ID.has(id)).toBe(true);
				referenced.add(id);
			}
		}
		for (const lesson of LESSONS) {
			expect(referenced.has(lesson.id)).toBe(true);
		}
	});

	it("matches the pinned ZAM cell contract (20 atoms, 60 items, valid ULIDs, acyclic prerequisites)", () => {
		expect(cell.tile_id).toBe(contract.tile_id);
		expect(cell.atoms).toHaveLength(LESSONS.length);

		const seenIds = new Set<string>();
		const atomIds = new Set<string>();

		cell.atoms.forEach((atom, idx) => {
			const lesson = LESSONS[idx];
			const pinnedAtom = contract.atoms[idx];
			expect(atom.id).toBe(pinnedAtom.id);
			expect(atom.slug).toBe(pinnedAtom.slug);
			expect(ULID_RE.test(atom.id)).toBe(true);
			expect(seenIds.has(atom.id)).toBe(false);
			seenIds.add(atom.id);
			atomIds.add(atom.id);

			const expectedLink = lessonSourceUrl(lesson.id);
			expect(atom.source_link).toBe(expectedLink);
			expect(atom.curricula.every((c) => c.provider === "zam-academy")).toBe(
				true,
			);

			expect(atom.practice_items).toHaveLength(3);
			atom.practice_items.forEach((item, itemIdx) => {
				const pinnedItem = pinnedAtom.items[itemIdx];
				expect(item.id).toBe(pinnedItem.id);
				expect(item.slug).toBe(pinnedItem.slug);
				expect(item.tier).toBe(pinnedItem.tier);
				expect(ULID_RE.test(item.id)).toBe(true);
				expect(seenIds.has(item.id)).toBe(false);
				seenIds.add(item.id);
				expect(item.source_link).toBe(expectedLink);
				expect(item.choice_distractors).toHaveLength(2);
				for (const d of item.choice_distractors) {
					expect(d.text.length).toBeGreaterThan(10);
					expect(d.reason.length).toBeGreaterThan(10);
				}
			});
		});

		for (const atom of cell.atoms) {
			for (const prereq of atom.prerequisites) {
				expect(atomIds.has(prereq.atom_id)).toBe(true);
				expect(prereq.atom_id).not.toBe(atom.id);
			}
		}
	});
});
