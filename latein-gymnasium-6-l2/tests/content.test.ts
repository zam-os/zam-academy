import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import {
	CORE_LESSONS,
	findLesson,
	LESSONS,
	SOURCES,
	STAGES,
} from "../src/curriculum";
import {
	canAccept,
	canReview,
	checkPractice,
	normalise,
	practiceFeedback,
	quizFeedback,
	quizOptions,
} from "../src/practice";
import {
	freshProgress,
	isComplete,
	parseProgress,
	STORAGE_KEY,
	updateDraft,
	writingKey,
} from "../src/storage/progress";
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";
import { workshopGoals } from "../src/workshop";

const items = cell.atoms.flatMap((a) => a.practice_items);

describe("Grade 6 second-foreign-language Latin teaching contract", () => {
	it("has eight stages of five lessons, three goals and three cards per lesson", () => {
		expect(LESSONS).toHaveLength(40);
		expect(CORE_LESSONS).toHaveLength(40);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual(Array(8).fill(5));
		expect(cell.atoms).toHaveLength(40);
		expect(items).toHaveLength(120);
		expect(LESSONS.filter((l) => l.aloud).map((l) => l.id)).toEqual([
			"l6-aussprache",
			"l6-herakles-aeneas",
		]);
	});

	it.each(LESSONS)(
		"has substantial teaching, feedback, SVG visual and distinct tasks: $id",
		(l) => {
			expect(l.id).toMatch(/^l6-[a-z0-9-]+$/);
			expect(l.paragraphs).toHaveLength(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(400);
			expect(l.material.length).toBeGreaterThan(95);
			expect(l.materialLanguage).toBe("la");
			expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
			expect(quizOptions(l)).toContain(l.quiz.answer);
			expect(l.quiz.explanation.length).toBeGreaterThan(15);
			for (const wrong of l.quiz.wrong) {
				expect(quizFeedback(l, wrong)).not.toContain(l.quiz.explanation);
				expect(quizFeedback(l, wrong)).toContain("Prüfe");
			}
			expect(quizFeedback(l, l.quiz.answer)).toContain(l.quiz.explanation);
			expect(l.practice).toHaveLength(2);
			for (const p of l.practice) {
				expect(p.answers.length).toBeGreaterThan(0);
				expect(p.feedback.length).toBeGreaterThan(10);
				expect(practiceFeedback(p, false)).not.toContain(p.feedback);
			}
			expect(
				checkPractice(
					l.practice,
					l.practice.map((p) => p.answers[0]),
				),
			).toEqual([true, true]);
			expect(checkPractice(l.practice, ["wrong", "wrong"])).toEqual([
				false,
				false,
			]);
			expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
			for (const t of Object.values(l.tasks)) {
				expect(t.criteria).toHaveLength(3);
				expect(t.model.length).toBeGreaterThan(35);
				expect(t.prompt.length).toBeGreaterThan(35);
			}
			if (l.workshop.kind === "concept") {
				expect(l.workshop.nodes).toHaveLength(3);
			}
			for (const id of l.sourceIds)
				expect(SOURCES.some((s) => s.id === id)).toBe(true);
			const prose = `${l.paragraphs.join(" ")} ${l.takeaway} ${l.quiz.question} ${l.quiz.explanation}`;
			expect(prose).not.toMatch(/\d\.\d/);
			expect(JSON.stringify(l)).not.toMatch(/<script|<p>|<div>|teacherVideo/);
		},
	);

	it.each(LESSONS)(
		"proves every workshop goal reachable and none true initially: $id",
		(l) => {
			expect(l.workshop.goals).toHaveLength(3);
			expect(workshopGoals(l.workshop, [])).toEqual([false, false, false]);
			expect(
				workshopGoals(
					l.workshop,
					l.workshop.goals.map((g) => g.answer),
				),
			).toEqual([true, true, true]);
			l.workshop.goals.forEach((g, i) => {
				expect(new Set(g.options).size).toBe(3);
				expect(g.options).toContain(g.answer);
				const answers = Array(3).fill("");
				answers[i] = g.answer;
				expect(workshopGoals(l.workshop, answers).filter(Boolean)).toHaveLength(
					1,
				);
				for (const wrong of g.options.filter((v) => v !== g.answer)) {
					answers[i] = wrong;
					expect(
						workshopGoals(l.workshop, answers).filter(Boolean),
					).toHaveLength(0);
				}
			});
		},
	);

	it("maps all 57 competencies and all 40 lessons, keeping grade 7 topics out", () => {
		expect(coverage.rows).toHaveLength(57);
		expect(new Set(coverage.rows.map((r) => r.id)).size).toBe(57);
		const mapped = new Set(coverage.rows.flatMap((r) => r.lessons));
		for (const l of LESSONS) expect(mapped.has(l.id)).toBe(true);
		for (const r of coverage.rows) {
			expect(["supported", "implemented"]).toContain(r.status);
			expect(r.evidence.length).toBeGreaterThan(40);
			for (const id of r.lessons) expect(findLesson(id)).toBeDefined();
		}
		for (const id of ["L6-03", "L6-04", "L6-05", "L6-07", "L6-29", "L6-38", "L6-57"]) {
			expect(coverage.rows.find((r) => r.id === id)?.status).toBe("supported");
		}
		expect(coverage.neighbour.boundary).toContain("Ablativus Absolutus");
		expect(
			LESSONS.some((l) =>
				/Passiv|Konjunktiv|Participium|Ablativus absolutus|u-Deklination|e-Deklination/.test(
					l.title,
				),
			),
		).toBe(false);
	});
});

describe("answer handling, progress and routes", () => {
	it("normalises macrons and punctuation without losing letter precision", () => {
		expect(normalise("  Lībertās! ")).toBe("libertas");
		expect(normalise("dūxisse.")).toBe("duxisse");
		const l = findLesson("l6-dritte-deklination")!;
		expect(checkPractice(l.practice, ["rēge", "maria"])).toEqual([true, true]);
		expect(checkPractice(l.practice, ["rege", "maria"])).toEqual([true, true]);
		expect(checkPractice(l.practice, ["regis", "mare"])).toEqual([false, false]);
	});

	it("requires workshop, checks, draft and aloud confirmation where marked", () => {
		const p = freshProgress();
		const id = p.activeLessonId; // l6-aussprache (aloud: true)
		p.workshopDone.push(id);
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(p, id, 1, "amīce: vorletzte Silbe lang; dominus: drittletzte Silbe.");
		p.writingDone.push(writingKey(id, 1));
		expect(isComplete(p, id)).toBe(false);
		p.aloudDone.push(id);
		expect(isComplete(p, id)).toBe(true);
		updateDraft(p, id, 1, "Geänderter Entwurf mit mehr als zwanzig Zeichen.");
		expect(isComplete(p, id)).toBe(false);
		expect(canReview(" ".repeat(80))).toBe(false);
		expect(canAccept("Eine vollständige Erklärung zu den drei Wörtern.", [true, true, false])).toBe(false);
		expect(canAccept("Eine vollständige Erklärung zu den drei Wörtern.", [true, true, true])).toBe(true);
	});

	it("recovers corrupted state and isolates its storage key", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"])
			expect(parseProgress(raw)).toEqual(freshProgress());
		expect(STORAGE_KEY).toBe("latein_gym6_l2_academy_progress_v1");
		const p = parseProgress(
			JSON.stringify({ workshopDone: ["bad", "l6-aussprache", "l6-aussprache"] }),
		);
		expect(p.workshopDone).toEqual(["l6-aussprache"]);
	});

	it("keeps both task levels and all lesson deep links valid", () => {
		for (const l of LESSONS)
			for (const level of [1, 2])
				expect(parseTrainingDeepLink(`#lesson=${l.id}&level=${level}`)).toEqual(
					{ lessonId: l.id, level },
				);
		expect(trainingBaseUrl("/app/", "?lesson=l6-perfekt&level=1&keep=yes")).toBe(
			"/app/?keep=yes",
		);
	});
});

describe("ZAM content and identifier contracts", () => {
	it("pins ULID identifiers and proposes no unapproved history transfer", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.approved).toBeNull();
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.rows).toHaveLength(0);
		expect(mapping.neighbouring_grade_review.cell_id).toBe(
			"de-by:gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen",
		);
		expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
		expect(
			cell.atoms.map((a) => ({
				id: a.id,
				slug: a.slug,
				lesson: a.source_link,
				items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((x) => x.id);
		expect(new Set(ids).size).toBe(160);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});

	it.each(cell.atoms)(
		"links only to real lessons and grade 6 Latin curriculum: $slug",
		(a) => {
			const l = findLesson(a.slug)!;
			expect(a.source_link).toBe(lessonLink(l.id));
			expect(a.practice_items).toHaveLength(3);
			expect(new Set(a.practice_items.map((i) => i.question)).size).toBe(3);
			for (const b of a.curricula.filter(
				(entry) => entry.provider === "lehrplanplus-bayern",
			)) {
				expect(b).toMatchObject({
					school_type: "gymnasium",
					grade: 6,
					subject: "latein",
				});
				expect(b).not.toHaveProperty("track");
			}
			for (const d of a.prerequisites)
				expect(cell.atoms.some((other) => other.id === d.atom_id)).toBe(true);
			for (const item of a.practice_items) {
				expect(item.source_link).toBe(lessonLink(l.id));
				expect(item.question.length).toBeGreaterThan(15);
				expect(item.concept.length).toBeGreaterThan(3);
				expect(item.question).not.toMatch(/\s\?$/);
				if (item.fast_check) {
					expect(item.fast_check.options).toHaveLength(2);
					expect(item.fast_check.correct_index).toBe(0);
					expect(item.fast_check.options[0]).toBe(item.concept);
				} else expect(item.sample_solution).toBe(item.concept);
			}
		},
	);
});
