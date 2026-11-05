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

	it("defines 20 complete stations in sequential order with varied quickCheck correctIndex", () => {
		expect(LESSONS).toHaveLength(20);
		const correctCounts = new Map<number, number>([
			[0, 0],
			[1, 0],
			[2, 0],
		]);
		LESSONS.forEach((lesson, idx) => {
			expect(lesson.number).toBe(idx + 1);
			expect(lesson.storyParagraphs.length).toBeGreaterThanOrEqual(2);
			expect(lesson.factCards).toHaveLength(3);
			expect(lesson.workedExample.steps.length).toBeGreaterThanOrEqual(3);
			expect(lesson.merksatz.length).toBeGreaterThan(25);
			expect(lesson.probenWissen.length).toBeGreaterThanOrEqual(3);
			expect(new Set(lesson.quickCheck.options).size).toBe(3);
			expect([0, 1, 2]).toContain(lesson.quickCheck.correctIndex);
			correctCounts.set(
				lesson.quickCheck.correctIndex,
				(correctCounts.get(lesson.quickCheck.correctIndex) ?? 0) + 1,
			);
			expect(lesson.lab.goals).toHaveLength(3);
		});
		for (const idx of [0, 1, 2]) {
			expect(correctCounts.get(idx)).toBeGreaterThanOrEqual(5);
			expect(correctCounts.get(idx)).toBeLessThanOrEqual(8);
		}
		expect(LEXIKON_GROUPS).toHaveLength(6);
	});

	it("maps all 75 official HSU 3/4 competences to valid lessons and leaves no orphan lesson", () => {
		expect(publication.status).toBe("preview");
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

	it("matches the pinned ZAM cell contract (20 atoms, 61 items, valid ULIDs, acyclic prerequisites)", () => {
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
			// The stage, and the school place ZAM's Schule lens reads.
			expect(atom.curricula[1]).toEqual({
				provider: "zam-academy",
				school_type: "grundschule",
				grade: 4,
				subject: "hsu",
				topic_code: atom.curricula[0].topic_code,
				topic_title: atom.curricula[0].topic_title,
			});
			expect(atom.curricula).toHaveLength(2);

			expect(atom.practice_items).toHaveLength(pinnedAtom.items.length);
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

		const items = cell.atoms.flatMap((atom) => atom.practice_items);
		expect(items).toHaveLength(61);
		expect(items.filter((item) => item.tier === "tier1_fast")).toHaveLength(41);
		expect(items.filter((item) => item.tier === "tier2_synthesis")).toHaveLength(20);
	});

	it("asks about the Fliehkraft the lesson teaches", () => {
		const atom = cell.atoms.find(
			(a) => a.slug === "hsu4-werkzeuge-maschinen-produktion",
		);
		expect(atom?.practice_items).toHaveLength(4);
		const taught = LESSON_BY_ID.get("werkzeuge-maschinen-produktion");
		expect(taught?.merksatz).toContain("Fliehkraft");
		expect(atom?.practice_items[3].concept).toContain("Fliehkraft");
	});

	it("gives nothing away by the length of a fast_check option", () => {
		const gaps = cell.atoms
			.flatMap((atom) => atom.practice_items)
			.flatMap((item) => (item.fast_check ? [item.fast_check] : []))
			.map((check) => {
				const right = check.options[check.correct_index];
				const wrong = check.options[1 - check.correct_index];
				return [...right].length - [...wrong].length;
			});
		expect(gaps).toHaveLength(41);
		for (const gap of gaps) expect(Math.abs(gap)).toBeLessThanOrEqual(10);
		// Neither the right nor the wrong option is the longer one in most cards.
		expect(gaps.filter((gap) => gap > 0).length).toBeLessThanOrEqual(21);
		expect(gaps.filter((gap) => gap < 0).length).toBeLessThanOrEqual(21);
	});

	it("never words a wrong option on a fat fire as advice to use water", () => {
		const item = cell.atoms
			.flatMap((atom) => atom.practice_items)
			.find((i) => i.slug === "hsu4-feuer-und-brandschutz-2");
		expect(item?.fast_check?.options[1]).not.toMatch(/lösch|gieß|nehmen/i);
	});
});
