import { describe, expect, it } from "vitest";
import cellData from "../cell.json";

interface Cell {
	tile_id: string;
	atoms: Array<{
		id: string;
		source_link: string;
		curricula: Array<{ provider: string; subject: string; topic_code: string }>;
		practice_items: Array<{
			id: string;
			source_link: string;
			question: string;
			concept: string;
			fast_check?: { options: string[]; correct_index: number };
		}>;
	}>;
}
const cell = cellData as Cell;

import coverage from "../coverage.json";
import {
	checkCode,
	EN_LESSONS,
	LESSONS,
	lessonFromHash,
	lessonInLocale,
	lessonLink,
	lessonsForLocale,
	STAGES,
} from "../src/curriculum";
import { freshProgress, isComplete, parseProgress } from "../src/progress";

const PINNED = [
	"algo-eindeutigkeit",
	"algo-sequenz",
	"algo-modelle",
	"algo-variablen",
	"algo-zahlen",
	"algo-boolean",
	"algo-bedingungen",
	"algo-logik",
	"algo-while",
	"algo-for",
	"algo-do-while",
	"algo-kontrollstrukturen",
	"algo-felder",
	"algo-felder-schleife",
	"algo-funktionen",
	"algo-parameter",
	"algo-rueckgabe",
	"algo-syntax-semantik",
	"algo-debuggen",
	"algo-testen",
];
describe("curriculum and public lesson contract", () => {
	it("pins lesson anchors and preserves four coherent stages", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(PINNED);
		expect(new Set(LESSONS.map((l) => l.stage)).size).toBe(STAGES.length);
	});
	for (const lesson of LESSONS)
		it(`${lesson.id}: teaches a solvable task with meaningful checks`, () => {
			expect(lesson.paragraphs).toHaveLength(2);
			for (const p of lesson.paragraphs) expect(p.length).toBeGreaterThan(110);
			expect(lesson.model.length).toBeGreaterThanOrEqual(2);
			expect(lesson.task.length).toBeGreaterThan(30);
			expect(checkCode(lesson, lesson.solution).passed).toBe(true);
			expect(checkCode(lesson, "").passed).toBe(false);
			expect(checkCode(lesson, lesson.starter).passed).toBe(false);
			expect(new Set(lesson.options).size).toBe(3);
			expect(lesson.correct).toBeGreaterThanOrEqual(0);
			expect(lesson.correct).toBeLessThan(3);
			if (lesson.id !== "algo-funktionen")
				expect(lesson.tests.length).toBeGreaterThanOrEqual(2);
		});
	it("links the only card source to actual lessons and honest modular metadata", () => {
		expect(cell.tile_id).toBe("zam-academy:algorithmen");
		expect(cell.atoms).toHaveLength(20);
		const items = cell.atoms.flatMap((a) => a.practice_items);
		expect(items).toHaveLength(40);
		const ids = [...cell.atoms, ...items].map((x) => x.id);
		expect(new Set(ids).size).toBe(60);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		for (const atom of cell.atoms) {
			const lesson = lessonFromHash(new URL(atom.source_link).hash);
			expect(lesson).toBeDefined();
			expect(atom.source_link).toBe(lessonLink(lesson!.id));
			expect(
				atom.curricula.some(
					(b) =>
						b.provider === "lehrplanplus-bayern" &&
						b.subject === "it" &&
						b.topic_code === "it-2.6.1",
				),
			).toBe(true);
			for (const binding of atom.curricula) {
				expect("grade" in binding).toBe(false);
				expect("track" in binding).toBe(false);
			}
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(atom.source_link);
				expect(item.question.length).toBeGreaterThan(20);
				expect(item.concept.length).toBeGreaterThan(4);
				if ("fast_check" in item && item.fast_check) {
					expect(new Set(item.fast_check.options).size).toBe(2);
					expect(item.fast_check.options[item.fast_check.correct_index]).toBe(
						item.concept,
					);
				}
			}
		}
		expect(JSON.stringify(LESSONS)).not.toContain("practice_items");
	});
	it("maps all listed competencies to lessons without claiming full-year coverage", () => {
		expect(coverage.module).toBe("2.6.1");
		for (const competency of coverage.competencies)
			for (const id of competency.lessons) expect(PINNED).toContain(id);
		expect(coverage.limits.join(" ")).toContain("keine vollständige");
	});
	it("handles good and bad lesson links without executing content", () => {
		expect(lessonFromHash("#lesson=algo-while")?.id).toBe("algo-while");
		expect(lessonFromHash("#lesson=%3Cscript%3E")).toBeUndefined();
		expect(lessonFromHash("#lesson=missing")).toBeUndefined();
	});
	it("moves the current lesson into the new locale, even when a link names no lesson", () => {
		for (const [lesson, locale] of [
			[LESSONS[3], "en"],
			[EN_LESSONS[3], "de"],
			[LESSONS[3], "de"],
		] as const) {
			const moved = lessonInLocale(lesson, locale);
			expect(moved.id).toBe(lesson.id);
			expect(lessonsForLocale(locale).indexOf(moved)).toBe(3);
		}
		// A hash such as #lesson=missing&lang=en keeps the view renderable.
		expect(lessonFromHash("#lesson=missing&lang=en")).toBeUndefined();
		const unknown = { ...LESSONS[0], id: "missing" };
		expect(lessonInLocale(unknown, "en")).toBe(EN_LESSONS[0]);
	});
	it("recovers usable progress from malformed and untrusted saves", () => {
		expect(parseProgress("broken")).toEqual(freshProgress());
		expect(
			parseProgress(
				JSON.stringify({
					completed: ["algo-while", "algo-while", "unknown", 9],
					quiz: ["algo-while"],
					drafts: { "algo-while": "print(1);", unknown: "x" },
				}),
			),
		).toEqual({
			locale: "de",
			draftsEn: {},
			completed: ["algo-while"],
			quiz: ["algo-while"],
			drafts: { "algo-while": "print(1);" },
		});
		const p = freshProgress();
		p.completed = ["algo-while"];
		expect(isComplete(p, "algo-while")).toBe(false);
		p.quiz = ["algo-while"];
		expect(isComplete(p, "algo-while")).toBe(true);
	});
});
