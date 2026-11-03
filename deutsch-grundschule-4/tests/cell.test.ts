import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import { LESSONS } from "../src/curriculum";
import { lessonLink } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const ULID = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

describe("ZAM-Zelle", () => {
	it("has one atom per lesson with three cards each", () => {
		expect(cell.tile_id).toBe("zam-academy:deutsch-grundschule-4");
		expect(cell.atoms).toHaveLength(23);
		expect(cell.atoms.map((a) => a.slug)).toEqual(LESSONS.map((l) => `gs4d-${l.id}`));
		for (const a of cell.atoms) expect(a.practice_items, a.slug).toHaveLength(3);
	});

	it("pins all 92 ULIDs and slugs", () => {
		const ids: Record<string, string> = {};
		for (const a of cell.atoms) {
			ids[a.slug] = a.id;
			for (const i of a.practice_items) ids[i.slug] = i.id;
		}
		expect(ids).toEqual(contract.ids);
		const all = Object.values(ids);
		expect(new Set(all).size).toBe(92);
		for (const id of all) expect(id).toMatch(ULID);
		for (const a of cell.atoms) expect(a.atom_uri).toBe(`urn:zam:atom:${a.id}`);
	});

	it("cites the matching lesson on every atom and card", () => {
		for (const a of cell.atoms) {
			const lessonId = a.slug.replace(/^gs4d-/, "");
			expect(a.source_link).toBe(lessonLink(lessonId));
			for (const i of a.practice_items) expect(i.source_link, i.slug).toBe(lessonLink(lessonId));
		}
	});

	it("asks short tier-1 checks and one transfer card with a sample solution", () => {
		for (const a of cell.atoms) {
			const [one, two, transfer] = a.practice_items;
			for (const i of [one, two]) {
				expect(i.tier, i.slug).toBe("tier1_fast");
				expect(i.fast_check?.type).toBe("binary_choice");
				expect(i.fast_check?.correct_index).toBe(0);
				expect(i.fast_check?.options).toHaveLength(2);
				expect(i.fast_check?.options[0]).toBe(i.concept);
				expect(i.fast_check?.options[1]).not.toBe(i.concept);
				expect(i.concept.length, i.slug).toBeLessThan(140);
			}
			expect(transfer.tier).toBe("tier2_synthesis");
			expect(transfer.sample_solution?.length, transfer.slug).toBeGreaterThan(40);
			for (const i of a.practice_items) {
				expect(i.language).toBe("de");
				expect(i.question.length).toBeGreaterThan(10);
				expect("choice_distractors" in i).toBe(false);
			}
		}
	});

	it("keeps the extra quick-check answer apart from the card's wrong answer", () => {
		for (const l of LESSONS) {
			expect(l.check.wrong, l.id).not.toBe(l.quiz.answer);
			expect(l.check.wrong, l.id).not.toBe(l.quiz.wrong[0]);
		}
	});

	it("links prerequisites to earlier atoms of this cell only", () => {
		const order = cell.atoms.map((a) => a.id);
		cell.atoms.forEach((a, index) => {
			for (const p of a.prerequisites) {
				expect(order.indexOf(p.atom_id), a.slug).toBeGreaterThanOrEqual(0);
				expect(order.indexOf(p.atom_id), a.slug).toBeLessThan(index);
				expect(p.type).toBe("soft");
			}
		});
	});

	it("binds atoms to their station only and transfers no history", () => {
		const codes: Record<string, string> = { werkstatt: "woerterwerkstatt", bahnhof: "satzbahnhof", detektiv: "detektivbuero" };
		for (const a of cell.atoms) {
			const lesson = LESSONS.find((l) => `gs4d-${l.id}` === a.slug);
			expect(a.curricula).toEqual([
				expect.objectContaining({ provider: "zam-academy", subject: "deutsch-grundschule-4", topic_code: codes[lesson?.stage ?? ""] }),
			]);
		}
		expect("retired_items" in cell).toBe(false);
		for (const a of cell.atoms) for (const i of a.practice_items) expect("replaces" in i).toBe(false);
	});
});
