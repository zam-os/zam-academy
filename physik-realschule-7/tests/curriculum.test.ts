import { describe, expect, it } from "vitest";
import data from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import {
	findLesson,
	LESSONS,
	lessonsFor,
	SOURCES,
	STAGES,
} from "../src/curriculum";
import { MODEL_SCENARIOS } from "../src/models";
import { renderIllustration } from "../src/ui/models";
import { checkWorkshop, initialOrder } from "../src/workshop";
import {
	lessonLink,
	parseTrainingDeepLink,
	ZAM_CELL_TITLE,
} from "../src/zam/zam-link";

const IDS = [
	"me-messen",
	"me-bewegung",
	"me-kraft",
	"me-wechselwirkung",
	"me-feder",
	"me-masse-gewicht",
	"me-teilchen",
	"me-reibung",
	"me-volumen",
	"me-dichte",
	"op-sehen",
	"op-schatten",
	"op-reflexion",
	"op-spiegelbild",
	"op-brechung",
	"op-totalreflexion",
	"op-dispersion",
	"op-linsen",
	"op-geraete",
	"el-magnete",
	"el-magnetfeld",
	"el-stromkreis",
	"el-schaltungen",
	"el-leiter-schutz",
];
interface Item {
	id: string;
	slug: string;
	tier: string;
	source_link: string;
	question: string;
	concept?: string;
	concept_segments?: { type: string; speech?: string }[];
	fast_check?: { options: string[]; correct_index: number };
	sample_solution: string;
	replaces?: string[];
}
interface Atom {
	id: string;
	source_link: string;
	prerequisites: { atom_id: string }[];
	curricula: {
		provider: string;
		school_type?: string;
		grade?: number;
		track?: string;
		subject?: string;
		topic_code: string;
	}[];
	practice_items: Item[];
}
const cell = data as { atoms: Atom[]; retired_items?: unknown[] };

describe("Grade 7 Group I curriculum and lesson anchors", () => {
	it("pins all anchors and covers precisely three curriculum areas", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(IDS);
		expect(lessonsFor("I")).toHaveLength(24);
		expect(STAGES.map((s) => s.lb)).toEqual([1, 2, 3]);
		expect(
			[1, 2, 3].map((lb) => LESSONS.filter((l) => l.lb === lb).length),
		).toEqual([10, 9, 5]);
		expect(coverage.rows).toHaveLength(17);
		expect(coverage.curriculum_sha256).toMatch(/^[a-f0-9]{64}$/);
		expect(coverage.experiments.minimum_total).toBe(5);
		expect(
			coverage.rows.filter((r) => r.status === "supported").length,
		).toBeGreaterThan(0);
		const covered = new Set(coverage.rows.flatMap((r) => r.lessons));
		expect(covered).toEqual(new Set(IDS));
		for (const row of coverage.rows) {
			expect(row.track).toBe("I");
			expect(row.evidence.length).toBeGreaterThan(60);
			for (const id of row.lessons) expect(findLesson(id)?.lb).toBe(row.lb);
		}
	});
	for (const lesson of LESSONS)
		it(`${lesson.id}: substantial teaching, both task levels and an unsolved workshop`, () => {
			expect(lesson.tracks).toEqual(["I"]);
			expect(lesson.period).toBe(
				`Ph7 LB ${lesson.lb} (I) · LehrplanPLUS Bayern`,
			);
			expect(lesson.paragraphs).toHaveLength(3);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(750);
			expect(lesson.takeaway.length).toBeGreaterThan(40);
			expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
			expect(lesson.quiz.question.endsWith("?")).toBe(true);
			for (const id of lesson.sourceIds)
				expect(SOURCES.some((s) => s.id === id)).toBe(true);
			for (const level of [1, 2] as const) {
				expect(lesson.tasks[level].model.length).toBeGreaterThan(150);
				expect(lesson.tasks[level].criteria).toHaveLength(3);
				expect(lesson.tasks[level].hints).toHaveLength(2);
			}
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			const w = lesson.workshop,
				solution =
					w.kind === "timeline"
						? w.entries.map((_, i) => i)
						: w.entries.map((e) => e.target);
			expect(checkWorkshop(w, solution).every(Boolean)).toBe(true);
			expect(
				checkWorkshop(
					w,
					w.entries.map(() => -1),
				).some(Boolean),
			).toBe(false);
			if (w.kind === "timeline")
				expect(initialOrder(w, lesson.id)).not.toEqual(solution);
			const prose = [
				...lesson.paragraphs,
				lesson.takeaway,
				...[1, 2].flatMap((level) =>
					Object.values(lesson.tasks[level as 1 | 2]).flat(),
				),
			].join(" ");
			expect(prose).not.toMatch(/<[^>]+>|\\(?:frac|cdot|text)|\d\.\d|-\d/);
			const visual = renderIllustration(lesson);
			expect(visual).toContain('role="img"');
			expect(visual).toContain("<figcaption>");
			expect(visual).not.toMatch(/NaN|Infinity|undefined/);
		});
});

describe("cell and unapproved mapping contract", () => {
	it("binds every atom to Grade 7 I, with real ULIDs and lesson-specific cards", () => {
		expect(ZAM_CELL_TITLE).toBe(data.title);
		const items = cell.atoms.flatMap((a) => a.practice_items);
		expect(cell.atoms).toHaveLength(24);
		expect(items).toHaveLength(73);
		expect(new Set([...cell.atoms, ...items].map((x) => x.id)).size).toBe(97);
		for (const entry of [...cell.atoms, ...items])
			expect(entry.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		for (const atom of cell.atoms) {
			const id = new URL(atom.source_link).hash.slice(8),
				lesson = findLesson(id)!;
			expect(lesson).toBeDefined();
			expect(atom.source_link).toBe(lessonLink(id));
			const bindings = atom.curricula.filter(
				(b) => b.provider === "lehrplanplus-bayern",
			);
			expect(bindings).toHaveLength(1);
			expect(bindings[0]).toMatchObject({
				school_type: "realschule",
				grade: 7,
				track: "I",
				subject: "physik",
				topic_code: `lb${lesson.lb}`,
			});
			expect(atom.practice_items.length).toBeGreaterThanOrEqual(3);
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(atom.source_link);
				expect(Boolean(item.concept)).not.toBe(Boolean(item.concept_segments));
				if (item.tier === "tier1_fast") {
					expect(item.fast_check?.options).toHaveLength(2);
					expect(item.fast_check?.correct_index).toBe(0);
				} else expect(item.sample_solution.length).toBeGreaterThan(60);
				for (const segment of item.concept_segments ?? [])
					if (segment.type === "math") expect(segment.speech).toBeTruthy();
			}
			for (const p of atom.prerequisites)
				expect(cell.atoms.some((a) => a.id === p.atom_id)).toBe(true);
		}
		const visit = (id: string, stack: string[] = []): void => {
			expect(stack).not.toContain(id);
			for (const p of cell.atoms.find((a) => a.id === id)!.prerequisites)
				visit(p.atom_id, [...stack, id]);
		};
		for (const atom of cell.atoms) visit(atom.id);
		expect(new Set(LESSONS.map((l) => l.model).filter(Boolean)).size).toBe(
			Object.keys(MODEL_SCENARIOS).length,
		);
	});
	it("maps the two approved same-retrieval items", () => {
		expect(mapping.approved).toBe("2026-11-19");
		expect(mapping.status).toBe("approved");
		expect(mapping.rows).toHaveLength(16);
		expect(new Set(mapping.rows.map((r) => r.de_by_id)).size).toBe(16);
		expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(2);
		expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(14);
		const items = cell.atoms.flatMap((a) => a.practice_items);
		expect(cell.retired_items ?? []).toEqual([]);
		for (const row of mapping.rows) {
			if (row.category === "A") {
				expect(items.filter((i) => i.slug === row.academy_slug)).toHaveLength(
					1,
				);
				expect(row.action).toBe("replace");
			} else {
				expect(row.academy_slug).toBeNull();
				expect(row.action).toBe("keep-active");
			}
		}
	});
	it("accepts valid lesson deep links and refuses markup in an anchor", () => {
		expect(parseTrainingDeepLink("#lesson=op-linsen&level=2")).toEqual({
			lessonId: "op-linsen",
			level: 2,
		});
		expect(parseTrainingDeepLink("#lesson=<script>&level=9")).toEqual({});
	});
});
