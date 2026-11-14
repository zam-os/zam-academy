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

describe("Chemistry within Mittelschule NT6", () => {
	it("maps 20 selected official expectations to all 17 lessons without claiming a full NT6 course", () => {
		expect(LESSONS).toHaveLength(17);
		expect(STAGES.map((s) => s.lehrplan)).toEqual([
			"NT6 LB 1",
			"NT6 LB 2.1",
			"NT6 LB 2.3",
		]);
		expect(coverage.rows).toHaveLength(20);
		expect(coverage.rows.filter((r) => r.status === "supported")).toHaveLength(
			8,
		);
		expect(coverage.scope).toContain("not a complete NT6 course");
		expect(coverage.excluded.map((r) => r.section)).toEqual(["2.2", "3", "4"]);
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
		expect(publication.status).toBe("local-only");
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
			expect(lesson.id).toMatch(/^c6-[a-z0-9-]+$/);
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
	it("pins every real ULID, lesson link, prerequisite and the 51 card identities", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms).toHaveLength(17);
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
					topic_code: lesson.lb === 1 ? "lb1" : "lb2",
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
		expect(ids.size).toBe(68);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toEqual([]);
		expect(mapping.sources).toEqual([]);
		expect("retired_items" in cell).toBe(false);
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
		expect(completion(p)).toEqual({ completed: 1, total: 17, percent: 6 });
		expect(isComplete(parseProgress(JSON.stringify(p)), l.id)).toBe(true);
		updateDraft(p, l.id, 2, "Eine neue selbst formulierte Begründung.");
		expect(isComplete(p, l.id)).toBe(false);
		expect(p.writingDone).toContain(`${l.id}:1`);
		expect(p.writingDone).not.toContain(`${l.id}:2`);
	});
	it("isolates storage, validates untrusted persisted values and parses both task levels", () => {
		expect(STORAGE_KEY).toBe("chemie_ms6_academy_progress_v1");
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
