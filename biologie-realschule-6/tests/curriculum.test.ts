import { describe, expect, it } from "vitest";
import indexHtml from "../index.html?raw";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import extract from "./fixtures/curriculum-extract.json";
import contract from "./fixtures/public-contract.json";
import { CURRICULUM_URL, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import {
	checkWorkshop,
	initialOrder,
	moveEntry,
	esc,
	canAcceptSelfAssessment,
} from "../src/workshop";
import {
	lessonLink,
	parseTrainingDeepLink,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const legacy = Object.values(
	import.meta.glob<{
		default: { atoms: Array<{ practice_items: Array<{ id: string }> }> };
	}>("./fixtures/de-by-*.json", { eager: true }),
).flatMap((module) =>
	module.default.atoms.flatMap((atom) => atom.practice_items),
);

describe("Grade 6 curriculum and content", () => {
	it("covers the common Fachlehrplan with traceable wording and honest practical limits", () => {
		expect(STAGES.map((stage) => [stage.lb, stage.hours ?? null])).toEqual([
			[1, null],
			[2, 18],
			[3, 20],
			[4, 18],
		]);
		expect(LESSONS).toHaveLength(30);
		expect(
			STAGES.map(
				(stage) => LESSONS.filter((lesson) => lesson.lb === stage.lb).length,
			),
		).toEqual([5, 10, 8, 7]);
		expect(coverage.rows).toHaveLength(46);
		expect(
			coverage.rows.map(({ section, position, competence }) => ({
				section,
				position,
				competence,
			})),
		).toEqual(extract.rows);
		expect(coverage.curriculum_sha256).toBe(extract.curriculum_sha256);
		expect(new Set(coverage.rows.flatMap((row) => row.lessons))).toEqual(
			new Set(LESSONS.map((lesson) => lesson.id)),
		);
		for (const row of coverage.rows) {
			expect(["implemented", "supported"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(80);
			if (row.status === "supported")
				expect(row.additional.length).toBeGreaterThan(25);
		}
		expect(coverage.optional_lessons).toEqual([]);
		expect(
			LESSONS.filter((l) => l.projectStep).map((l) => l.projectStep),
		).toEqual(["question", "evidence", "judgment"]);
	});
	it.each(LESSONS)(
		"offers explanations, an interactive workshop and distinct work on both levels: $id",
		(lesson) => {
			expect(lesson.paragraphs).toHaveLength(2);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(600);
			expect(lesson.paragraphs.join(" ")).toContain("Beispiel");
			expect(lesson.takeaway.length).toBeGreaterThan(40);
			expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
			expect(lesson.quiz.explanation.length).toBeGreaterThan(45);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			for (const task of Object.values(lesson.tasks)) {
				expect(task.model.length).toBeGreaterThan(180);
				expect(task.criteria).toHaveLength(3);
				expect(new Set(task.criteria).size).toBe(3);
				expect(task.hints).toHaveLength(2);
			}
			for (const id of lesson.sourceIds)
				expect(SOURCES.some((s) => s.id === id)).toBe(true);
			const text = JSON.stringify(lesson);
			expect(text).not.toMatch(/\d\.\d|<\/?[a-z]|teacherVideo|youtube\.com/);
			const work = lesson.workshop;
			expect(work.entries.length).toBeGreaterThanOrEqual(3);
			const start =
				work.kind === "timeline"
					? initialOrder(work, lesson.id)
					: work.entries.map(() => -1);
			expect(checkWorkshop(work, start).every(Boolean)).toBe(false);
			const solution =
				work.kind === "timeline"
					? work.entries.map((_, i) => i)
					: work.entries.map((entry) => entry.target);
			expect(checkWorkshop(work, solution).every(Boolean)).toBe(true);
			expect(checkWorkshop(work, []).every(Boolean)).toBe(false);
			expect(
				checkWorkshop(
					work,
					work.entries.map(() => 99),
				).every(Boolean),
			).toBe(false);
		},
	);
	it("does not turn self-assessment into an automatic content score", () => {
		expect(
			canAcceptSelfAssessment(
				"Eine begründete Antwort mit mehr als zwanzig Zeichen.",
				[true, true, false],
			),
		).toBe(false);
		expect(canAcceptSelfAssessment("kurz", [true, true, true])).toBe(false);
		expect(
			canAcceptSelfAssessment(
				"Eine begründete Antwort mit mehr als zwanzig Zeichen.",
				[true, true, true],
			),
		).toBe(true);
		expect(moveEntry([0, 1, 2], 0, -1)).toEqual([0, 1, 2]);
		expect(moveEntry([0, 1, 2], 0, 1)).toEqual([1, 0, 2]);
		expect(esc('<img src="x">&')).toBe("&lt;img src=&quot;x&quot;&gt;&amp;");
	});
});
describe("cell and proposal identities", () => {
	it("links the visible footer to the same Grade 6 curriculum as the lessons", () => {
		expect(indexHtml).toContain(`href="${CURRICULUM_URL}"`);
		expect(indexHtml).not.toMatch(/fachlehrplan\/realschule\/(?!6\/biologie)/);
	});
	it("does not propose a second transfer of the history already owned by Grade 5", () => {
		const row = mapping.rows.find(
			(r) => r.de_by_id === "01K4B5P0000000000000000J03",
		);
		expect(row).toMatchObject({
			category: "C",
			academy_slug: null,
			action: "keep-active",
		});
		expect(row?.note).toContain("b5-bluete-vielfalt-check");
	});

	it("pins every identifier and anchor and binds only Grade 6", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms).toHaveLength(30);
		expect(items).toHaveLength(60);
		expect(
			cell.atoms.map((a) => ({
				id: a.id,
				slug: a.slug,
				lesson: a.source_link,
				items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
			})),
		).toEqual(contract);
		expect(LESSONS.map((l) => lessonLink(l.id))).toEqual(
			contract.map((a) => a.lesson),
		);
		const ids = [...cell.atoms, ...items].map((entry) => entry.id);
		expect(new Set(ids).size).toBe(ids.length);
		for (const id of ids) expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
		for (const [index, atom] of cell.atoms.entries()) {
			const lesson = LESSONS[index];
			expect(atom.title).toBe(lesson.title);
			expect(
				atom.curricula.filter(
					(binding) => binding.provider === "lehrplanplus-bayern",
				),
			).toEqual([
				expect.objectContaining({
					grade: 6,
					school_type: "realschule",
					subject: "biologie",
					topic_code: `lb${lesson.lb}`,
					exam_relevant: false,
				}),
			]);
			for (const edge of atom.prerequisites)
				expect(cell.atoms.some((a) => a.id === edge.atom_id)).toBe(true);
			const expectedReplaces: Record<string, string[]> = {
				"b6-bestaeubung-check": ["01K4B5P0000000000000000J05"],
				"b6-temperatur-check": ["01K4B7W0000000000000000J01"],
				"b6-lebensraum-check": ["01K4B7W0000000000000000J05"],
			};
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(lessonLink(lesson.id));
				expect(item.question.length).toBeGreaterThan(10);
				expect(item.concept.trim()).not.toBe("");
				if (expectedReplaces[item.slug]) {
					expect(item).toHaveProperty("replaces", expectedReplaces[item.slug]);
				} else {
					expect(item).not.toHaveProperty("replaces");
				}
				if ("fast_check" in item && item.fast_check) {
					expect(item.fast_check.options).toHaveLength(2);
					expect(item.fast_check.options[0]).toBe(item.concept);
					expect(item.fast_check.correct_index).toBe(0);
				} else expect(item).toHaveProperty("sample_solution", item.concept);
			}
		}
		for (const source of SOURCES)
			expect(cell.sources.some((s) => s.uri === source.url)).toBe(true);
	});
	it("maps every old snapshot once with Thomas's approved transfers", () => {
		expect(mapping.status).toBe("approved");
		expect(mapping.approved).toBe("2026-11-14");
		expect(mapping.rows).toHaveLength(40);
		expect(new Set(mapping.rows.map((r) => r.de_by_id))).toEqual(
			new Set(legacy.map((i) => i.id)),
		);
		expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(3);
		expect(cell).not.toHaveProperty("retired_items");
		for (const row of mapping.rows) {
			expect(row.note.length).toBeGreaterThan(25);
			if (row.academy_slug) {
				const matches = items.filter((i) => i.slug === row.academy_slug);
				expect(matches).toHaveLength(1);
				expect(matches[0]).toHaveProperty("replaces", [row.de_by_id]);
				expect(row.action).toBe("replace");
			} else expect(row.action).toBe("keep-active");
		}
	});
	it("parses published lesson links without accepting arbitrary fragments", () => {
		expect(parseTrainingDeepLink("#lesson=b6-keimung&level=2")).toEqual({
			lessonId: "b6-keimung",
			level: 2,
		});
		expect(parseTrainingDeepLink("#lesson=<script>&level=99")).toEqual({});
		expect(parseTrainingDeepLink("", "?lesson=b6-organe&level=1")).toEqual({
			lessonId: "b6-organe",
			level: 1,
		});
	});
});
