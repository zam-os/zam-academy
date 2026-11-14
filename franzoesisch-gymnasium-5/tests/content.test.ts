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
	updateDraft,
	writingKey,
	STORAGE_KEY,
} from "../src/storage/progress";
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";
import { clockLabel, numberParts, workshopGoals } from "../src/workshop";
const items = cell.atoms.flatMap((a) => a.practice_items);

describe("Grade 5 first-language French teaching contract", () => {
	it("has eight stages of five lessons, three goals and three cards per lesson", () => {
		expect(LESSONS).toHaveLength(40);
		expect(CORE_LESSONS).toHaveLength(40);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual(Array(8).fill(5));
		expect(cell.atoms).toHaveLength(40);
		expect(items).toHaveLength(120);
		expect(LESSONS.filter((l) => l.listening).map((l) => l.id)).toEqual([
			"f5-sons",
			"f5-ecouter-moi",
			"f5-ecouter-courses",
		]);
	});
	it.each(LESSONS)(
		"has substantial teaching, feedback and distinct tasks: $id",
		(l) => {
			expect(l.id).toMatch(/^f5-[a-z-]+$/);
			expect(l.paragraphs).toHaveLength(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(400);
			expect(l.material.length).toBeGreaterThan(95);
			expect(l.materialLanguage).toBe("fr");
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
			for (const id of l.sourceIds)
				expect(SOURCES.some((s) => s.id === id)).toBe(true);
			expect(JSON.stringify(l)).not.toMatch(
				/<script|<p>|<div>|\\\\\(|teacherVideo/,
			);
		},
	);
	it.each(LESSONS)(
		"proves every visual goal reachable and none true initially: $id",
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
	it("maps every competence and every lesson, with honest limits", () => {
		expect(coverage.rows).toHaveLength(47);
		expect(new Set(coverage.rows.map((r) => r.id)).size).toBe(47);
		const mapped = new Set(coverage.rows.flatMap((r) => r.lessons));
		for (const l of LESSONS) expect(mapped.has(l.id)).toBe(true);
		for (const r of coverage.rows) {
			expect(["supported", "implemented"]).toContain(r.status);
			expect(r.evidence.length).toBeGreaterThan(40);
			for (const id of r.lessons) expect(findLesson(id)).toBeDefined();
		}
		for (const id of [
			"F5-01",
			"F5-24",
			"F5-25",
			"F5-32",
			"F5-33",
			"F5-43",
			"F5-45",
			"F5-46",
		])
			expect(coverage.rows.find((r) => r.id === id)?.status).toBe("supported");
		expect(coverage.neighbour.boundary).toContain("passé composé");
	});
	it("retains the detailed grade 5 targets", () => {
		const text = (id: string) => findLesson(id)!.paragraphs.join(" ");
		expect(text("f5-er-ecriture")).toContain("nous commençons");
		expect(text("f5-er-ecriture")).toContain("vous préférez");
		expect(text("f5-ecole")).toContain("vous dites");
		expect(text("f5-loisirs")).toContain("ils/elles prennent");
		expect(text("f5-quel")).toContain("Que fait Nathalie");
		expect(text("f5-sons")).toContain("/ɛ̃/");
		expect(text("f5-famille")).toContain("leur/leurs");
		expect(text("f5-france")).toContain("Loire");
		expect(text("f5-fetes")).toContain("Joyeux Noël");
		expect(text("f5-objets")).toContain("Objektpronomen folgen erst");
		expect(
			LESSONS.some((l) => /passé|imparfait|subjonctif/.test(l.title)),
		).toBe(false);
	});
});
describe("interactive number and time models", () => {
	it("preserves the whole number throughout the slider range", () => {
		for (let n = 0; n <= 100; n++) {
			const parts = numberParts(n);
			expect(parts.reduce((a, b) => a + b, 0)).toBe(n);
			expect(parts.every(Number.isFinite)).toBe(true);
		}
		expect(numberParts(71)).toEqual([60, 11]);
		expect(numberParts(81)).toEqual([20, 20, 20, 20, 1]);
	});
	it("has finite clock labels for all offered settings, including 21 heures", () => {
		for (let h = 0; h < 24; h++)
			for (const m of [0, 15, 30, 45])
				expect(clockLabel(h, m)).not.toMatch(/undefined|NaN/);
		expect(clockLabel(15, 30)).toBe("quinze heures trente");
		expect(clockLabel(21, 0)).toBe("vingt et une heures");
	});
});
describe("answer handling, progress and routes", () => {
	it("accepts typography without discarding meaningful accents", () => {
		expect(normalise(" D’ABORD. ")).toBe("d'abord");
		expect(normalise("e\u0301cole")).toBe("école");
		const l = findLesson("f5-accents")!;
		expect(checkPractice(l.practice, ["a", "à"])).toEqual([true, true]);
		expect(checkPractice(l.practice, ["à", "a"])).toEqual([false, false]);
		expect(checkPractice(l.practice, ["a"])).toEqual([false, false]);
	});
	it("requires workshop, checks and a real self-assessed draft", () => {
		const p = freshProgress(),
			id = p.activeLessonId;
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(p, id, 1, "Bonjour, Madame. Une baguette, s’il vous plaît.");
		p.writingDone.push(writingKey(id, 1));
		expect(isComplete(p, id)).toBe(false);
		p.workshopDone.push(id);
		expect(isComplete(p, id)).toBe(true);
		updateDraft(p, id, 1, "Bonjour, Monsieur. Merci et au revoir.");
		expect(isComplete(p, id)).toBe(false);
		expect(canReview(" ".repeat(100))).toBe(false);
		expect(
			canAccept("Une réponse personnelle et complète.", [true, true, false]),
		).toBe(false);
		expect(
			canAccept("Une réponse personnelle et complète.", [true, true, true]),
		).toBe(true);
	});
	it("recovers corrupted state and isolates its storage key", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"])
			expect(parseProgress(raw)).toEqual(freshProgress());
		expect(STORAGE_KEY).toBe("franzoesisch_gym5_academy_progress_v1");
		const p = parseProgress(
			JSON.stringify({ workshopDone: ["bad", "f5-bonjour", "f5-bonjour"] }),
		);
		expect(p.workshopDone).toEqual(["f5-bonjour"]);
	});
	it("keeps both task levels and all lesson deep links valid", () => {
		for (const l of LESSONS)
			for (const level of [1, 2])
				expect(parseTrainingDeepLink(`#lesson=${l.id}&level=${level}`)).toEqual(
					{ lessonId: l.id, level },
				);
		expect(trainingBaseUrl("/app/", "?lesson=f5-mois&level=1&keep=yes")).toBe(
			"/app/?keep=yes",
		);
	});
});
describe("ZAM content and identifier contracts", () => {
	it("pins identifiers and has no history transfer", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toHaveLength(0);
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
		"links only to real lessons and grade 5 curriculum: $slug",
		(a) => {
			const l = findLesson(a.slug)!;
			expect(a.source_link).toBe(lessonLink(l.id));
			expect(a.practice_items).toHaveLength(3);
			expect(new Set(a.practice_items.map((i) => i.question)).size).toBe(3);
			for (const b of a.curricula.filter(
				(b) => b.provider === "lehrplanplus-bayern",
			)) {
				expect(b).toMatchObject({
					school_type: "gymnasium",
					grade: 5,
					subject: "franzoesisch",
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
