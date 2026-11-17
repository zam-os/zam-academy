import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import publication from "../publication.json";
import checks from "../source-checks.json";
import contract from "./fixtures/public-contract.json";
import { LESSONS, findLesson, STAGES, SOURCES } from "../src/curriculum";
import { LABS, freshLab, renderLab } from "../src/labs";
import {
	checkWorkshop,
	canAcceptSelfAssessment,
	canReviewDraft,
} from "../src/workshop";
import {
	completion,
	confirmWriting,
	freshProgress,
	isComplete,
	parseProgress,
	recordQuizAnswer,
	recordWorkshopAnswer,
	STORAGE_KEY,
	updateDraft,
} from "../src/storage/progress";
import {
	lessonLink,
	parseTrainingDeepLink,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";

describe("Complete Mittelschule Natur und Technik 6", () => {
	it("maps all 40 official expectations to 38 lessons with explicit practical boundaries", () => {
		expect(LESSONS).toHaveLength(38);
		expect(STAGES.map((s) => s.lehrplan)).toEqual([
			"NT6 LB 1",
			"NT6 LB 2.1",
			"NT6 LB 2.2",
			"NT6 LB 2.3",
			"NT6 LB 3",
			"NT6 LB 4.1",
			"NT6 LB 4.2",
			"NT6 LB 4.3",
		]);
		expect(coverage.rows).toHaveLength(40);
		expect(coverage.rows.filter((r) => r.status === "supported")).toHaveLength(
			14,
		);
		expect(coverage.scope).toContain("All learning areas");
		expect(coverage.excluded).toEqual([]);
		expect(
			Object.fromEntries(
				["1", "2.1", "2.2", "2.3", "3", "4.1", "4.2", "4.3"].map((section) => [
					section,
					coverage.rows.filter((row) => row.section === section).length,
				]),
			),
		).toEqual({
			"1": 9,
			"2.1": 7,
			"2.2": 5,
			"2.3": 4,
			"3": 4,
			"4.1": 2,
			"4.2": 4,
			"4.3": 5,
		});
		const used = new Set<string>();
		for (const row of coverage.rows) {
			expect(row.evidence.length).toBeGreaterThan(100);
			expect(row.lessons.length).toBeGreaterThan(0);
			for (const id of row.lessons) {
				expect(findLesson(id)).toBeDefined();
				used.add(id);
			}
			if (row.status === "supported")
				expect(row.evidence).toMatch(/class|supervis/i);
		}
		expect([...used].sort()).toEqual(LESSONS.map((l) => l.id).sort());
		expect(publication.status).toBe("ready");
		for (const source of SOURCES) {
			const checked = checks.find((c) => c.url === source.url);
			expect(checked?.title).toMatch(
				/LehrplanPLUS.*6.*Natur und Technik.*Fachlehrpläne/,
			);
		}
	});

	it.each(LESSONS)(
		"has a worked example, three model goals and two substantial tasks: $id",
		(lesson) => {
			expect(lesson.id).toMatch(/^(?:c6|nt6)-[a-z0-9-]+$/);
			expect(lesson.paragraphs).toHaveLength(3);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(800);
			expect(lesson.paragraphs[2]).toContain("Beispiel:");
			expect(lesson.takeaway.length).toBeGreaterThan(60);
			expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
			expect(lesson.quiz.explanation.length).toBeGreaterThan(60);
			expect(lesson.lab).toBeDefined();
			expect(LABS[lesson.lab!].choices).toHaveLength(3);
			expect(renderLab(lesson.lab!, freshLab())).toContain("Modellgrenze:");
			expect(lesson.workshop.entries.length).toBeGreaterThanOrEqual(4);
			expect(checkWorkshop(lesson.workshop, [])).toEqual(
				lesson.workshop.entries.map(() => false),
			);
			expect(
				checkWorkshop(
					lesson.workshop,
					lesson.workshop.entries.map((e) => e.target),
				).every(Boolean),
			).toBe(true);
			expect(new Set(lesson.workshop.entries.map((e) => e.target)).size).toBe(
				lesson.workshop.categories.length,
			);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
			for (const task of Object.values(lesson.tasks)) {
				expect(task.model.length).toBeGreaterThan(200);
				expect(task.hints).toHaveLength(2);
				expect(task.criteria).toHaveLength(3);
				expect(canReviewDraft(task.model)).toBe(true);
				expect(canAcceptSelfAssessment(task.model, [true, false, true])).toBe(
					false,
				);
			}
			expect("teacherVideo" in lesson).toBe(false);
			const prose = [
				lesson.title,
				lesson.intro,
				...lesson.paragraphs,
				lesson.takeaway,
				JSON.stringify(lesson.quiz),
				JSON.stringify(lesson.tasks),
			].join("\n");
			expect(prose).not.toMatch(
				/\d\.\d|(?<![\p{L}\d])-\d|\b(?:TODO|TBD|Lorem|NaN|undefined)\b/u,
			);
			expect(lesson.paragraphs.join(" ")).not.toMatch(/<[^>]+>|\$|\\[a-z]+/);
		},
	);
});

describe("Cell and identifier contract", () => {
	it("pins every real ULID, lesson link, prerequisite and the 114 card identities", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms).toHaveLength(38);
		const ids = new Set<string>(),
			seenAtoms = new Set<string>();
		const add = (id: string) => {
			expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
			expect(ids.has(id)).toBe(false);
			ids.add(id);
		};
		for (const [i, atom] of cell.atoms.entries()) {
			add(atom.id);
			const lesson = LESSONS[i];
			expect(atom.slug).toBe(lesson.id);
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(atom.curricula).toContainEqual(
				expect.objectContaining({
					provider: "lehrplanplus-bayern",
					school_type: "mittelschule",
					grade: 6,
					subject: "nt",
					topic_code:
						lesson.lb === 1
							? "lb1"
							: lesson.lb <= 4
								? "lb2"
								: lesson.lb === 5
									? "lb3"
									: "lb4",
				}),
			);
			for (const prereq of atom.prerequisites)
				expect(seenAtoms.has(prereq.atom_id)).toBe(true);
			seenAtoms.add(atom.id);
			expect(atom.practice_items).toHaveLength(3);
			for (const [j, item] of atom.practice_items.entries()) {
				add(item.id);
				expect(item.source_link).toBe(lessonLink(lesson.id));
				expect("replaces" in item).toBe(false);
				expect("question" in item !== "question_segments" in item).toBe(true);
				expect(item.concept.length).toBeLessThan(210);
				if (j < 2) {
					expect(item.tier).toBe("tier1_fast");
					expect(item.fast_check?.options).toHaveLength(2);
					expect(item.fast_check?.options[0]).toBe(item.concept);
					expect(item.fast_check?.options[1]).not.toBe(item.concept);
					expect(item.fast_check?.correct_index).toBe(0);
				} else {
					expect(item.tier).toBe("tier2_synthesis");
					expect(item.sample_solution?.length).toBeGreaterThan(80);
				}
			}
			expect(contract[i]).toEqual({
				id: atom.id,
				slug: atom.slug,
				lesson: atom.source_link,
				items: atom.practice_items.map((item) => ({
					id: item.id,
					slug: item.slug,
				})),
			});
		}
		expect(ids.size).toBe(152);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toEqual([]);
		expect(mapping.sources).toEqual([]);
		expect("retired_items" in cell).toBe(false);
	});
});

describe("Curriculum and prerequisite metadata", () => {
	it("uses one official title per code without marking Grade 6 as an exam year", () => {
		const titles = new Map<string, Set<string>>();
		for (const atom of cell.atoms)
			for (const binding of atom.curricula) {
				if (binding.provider !== "lehrplanplus-bayern") continue;
				expect(binding.exam_relevant).toBe(false);
				const seen = titles.get(binding.topic_code) ?? new Set();
				seen.add(binding.topic_title);
				titles.set(binding.topic_code, seen);
			}
		expect([...titles.get("lb1")!]).toEqual([
			"Naturwissenschaftliches Arbeiten",
		]);
		expect([...titles.get("lb2")!]).toEqual([
			"Lebensgrundlagen Wasser und Boden",
		]);
	});
	it("keeps substantive prerequisites and excludes unrelated lesson-order edges", () => {
		const atoms = new Map(cell.atoms.map((atom) => [atom.slug, atom]));
		const depends = (from: string, to: string) =>
			atoms
				.get(from)!
				.prerequisites.some((edge) => edge.atom_id === atoms.get(to)!.id);
		expect(depends("c6-wasserzerlegung", "c6-molekuele")).toBe(true);
		expect(depends("c6-wasseranomalie", "c6-teilchen-zustaende")).toBe(true);
		expect(depends("c6-wasserkraft", "c6-wasserzerlegung")).toBe(false);
		expect(depends("c6-waldnetz", "c6-molekuele")).toBe(false);
		expect(depends("c6-bodenleben", "c6-fotosynthese")).toBe(false);
		for (const atom of cell.atoms)
			for (const edge of atom.prerequisites)
				expect(edge.rationale).not.toContain("Builds on the earlier lesson");
	});
});

describe("Learning progress and deep links", () => {
	it("requires both independent self-assessments and invalidates only an edited level", () => {
		const p = freshProgress(),
			l = LESSONS[0];
		recordQuizAnswer(p, l.id, true);
		recordWorkshopAnswer(p, l.id, true);
		updateDraft(p, l.id, 1, l.tasks[1].model);
		expect(confirmWriting(p, l.id, 1, l.tasks[1].model)).toBe(true);
		expect(isComplete(p, l.id)).toBe(false);
		updateDraft(p, l.id, 2, l.tasks[2].model);
		expect(
			confirmWriting(p, l.id, 2, "A different and no longer current draft."),
		).toBe(false);
		expect(confirmWriting(p, l.id, 2, l.tasks[2].model)).toBe(true);
		expect(isComplete(p, l.id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, total: 38, percent: 3 });
		expect(isComplete(parseProgress(JSON.stringify(p)), l.id)).toBe(true);
		updateDraft(p, l.id, 2, "Eine neue selbst formulierte Begründung.");
		expect(isComplete(p, l.id)).toBe(false);
		expect(p.writingDone).toContain(`${l.id}:1`);
		expect(p.writingDone).not.toContain(`${l.id}:2`);
	});
	it("isolates storage, validates untrusted persisted values and parses both task levels", () => {
		expect(STORAGE_KEY).toBe("nt_ms6_academy_progress_v1");
		expect(parseTrainingDeepLink("#lesson=c6-molekuele&level=2")).toEqual({
			lessonId: "c6-molekuele",
			level: 2,
		});
		expect(parseTrainingDeepLink("#lesson=<script>&level=99")).toEqual({});
		expect(parseProgress("broken")).toEqual(freshProgress());
		const p = parseProgress(
			JSON.stringify({
				activeLessonId: "missing",
				level: 3,
				quizDone: [LESSONS[0].id, "missing"],
				drafts: { "missing:1": "x" },
				writingDone: [`${LESSONS[0].id}:1`],
			}),
		);
		expect(p.quizDone).toEqual([LESSONS[0].id]);
		expect(p.writingDone).toEqual([]);
		expect(p.drafts).toEqual({});
	});
});
