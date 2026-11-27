import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import contract from "./fixtures/public-contract.json";
import source from "./fixtures/franzoesisch-gymnasium-6-cell-2026.11.2.json";
import {
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

describe("Grade 6 French as the second foreign language: teaching contract", () => {
	it("provides one complete path with eight stages and three cards per lesson", () => {
		expect(LESSONS).toHaveLength(46);
		expect(STAGES).toHaveLength(8);
		for (const stage of STAGES)
			expect(LESSONS.some((lesson) => lesson.stage === stage.id)).toBe(true);
		for (const lesson of LESSONS)
			expect(STAGES.some((stage) => stage.id === lesson.stage)).toBe(true);
		expect(cell.atoms).toHaveLength(46);
		expect(items).toHaveLength(138);
		expect(LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id)).toEqual([
			"f6-2-sons", "f6-2-ecouter-moi", "f6-2-ecouter-courses",
		]);
	});
	it.each(LESSONS)(
		"has substantial teaching, feedback and distinct tasks: $id",
		(l) => {
			expect(l.id).toMatch(/^f6-2-[a-z-]+$/);
			expect(l.paragraphs).toHaveLength(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(330);
			expect(l.material.length).toBeGreaterThan(90);
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
				expect(t.model.length).toBeGreaterThan(28);
				expect(t.prompt.length).toBeGreaterThan(28);
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
	it("maps each expectation to lessons and each lesson to an expectation, with honest limits", () => {
		expect(coverage.rows).toHaveLength(47);
		expect(new Set(coverage.rows.map((row) => row.id)).size).toBe(47);
		expect(coverage.optional_lessons).toEqual([]);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id)).toBe(true);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(30);
			expect(row.lessons.length).toBeGreaterThan(0);
			for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
			for (const id of row.lessons)
				expect(findLesson(id)!.bindings.length).toBeGreaterThan(0);
		}
		for (const id of ["F2-01", "F2-11", "F2-24", "F2-32", "F2-45"])
			expect(coverage.rows.find((row) => row.id === id)?.status).toBe("supported");
	});
	it("teaches the Grade 6 additions of the second language and leaves Grade 7 out", () => {
		const text = (id: string) => findLesson(id)!.paragraphs.join(" ");
		expect(text("f6-2-er-ecriture")).toContain("nous commençons");
		expect(text("f6-2-er-ecriture")).toContain("vous préférez");
		expect(text("f6-2-ecole")).toContain("vous dites");
		expect(text("f6-2-quel")).toContain("Que fait Nathalie");
		expect(text("f6-2-objets-directs")).toContain("Je vais le prendre");
		expect(text("f6-2-demonstratifs")).toContain("cet");
		expect(text("f6-2-accord")).toContain("deux grandes places rouges");
		expect(text("f6-2-negation-suite")).toContain("ne … rien");
		const all = LESSONS.map((lesson) => lesson.paragraphs.join(" ")).join(" ");
		expect(all).not.toMatch(/passé composé|imparfait|subjonctif|Relativsatz/);
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
		const l = findLesson("f6-2-accents")!;
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
		expect(STORAGE_KEY).toBe("franzoesisch_2fs_gym6_academy_progress_v1");
		const p = parseProgress(
			JSON.stringify({ workshopDone: ["bad", "f6-2-bonjour", "f6-2-bonjour"] }),
		);
		expect(p.workshopDone).toEqual(["f6-2-bonjour"]);
	});
	it("keeps both task levels and all lesson deep links valid", () => {
		for (const l of LESSONS)
			for (const level of [1, 2])
				expect(parseTrainingDeepLink(`#lesson=${l.id}&level=${level}`)).toEqual(
					{ lessonId: l.id, level },
				);
		expect(trainingBaseUrl("/app/", "?lesson=f6-2-mois&level=1&keep=yes")).toBe(
			"/app/?keep=yes",
		);
	});
});
describe("ZAM content and identifier contracts", () => {
	it("pins identifiers and declares no history transfer or retirement", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell).not.toHaveProperty("retired_items");
		expect(items.some((item) => "replaces" in item)).toBe(false);
		expect(
			cell.atoms.map((a) => ({
				id: a.id,
				slug: a.slug,
				lesson: a.source_link,
				items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((x) => x.id);
		expect(new Set(ids).size).toBe(184);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});
	it.each(cell.atoms)(
		"links only to real lessons and grade 6 curriculum: $slug",
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
					grade: 6,
					subject: "franzoesisch-2fs",
				});
				expect(b.topic_code).toMatch(/^lb[1-5]/);
				expect(b).not.toHaveProperty("track");
			}
			for (const d of a.prerequisites)
				expect(cell.atoms.some((other) => other.id === d.atom_id)).toBe(true);
			for (const item of a.practice_items) {
				expect(item.source_link).toBe(lessonLink(l.id));
				expect(item.question.length).toBeGreaterThan(15);
				expect(item.concept.length).toBeGreaterThan(1);
				expect(item.question.trim()).toBe(item.question);
				if (item.fast_check) {
					expect(item.fast_check.options).toHaveLength(2);
					expect(item.fast_check.correct_index).toBe(0);
					expect(item.fast_check.options[0]).not.toBe(item.fast_check.options[1]);
				} else expect(item.sample_solution).toBeTruthy();
			}
		},
	);
});

describe("cards moved from franzoesisch-gymnasium-6", () => {
	const old = new Map(
		source.atoms
			.filter((atom) => atom.slug.startsWith("f6-2-"))
			.map((atom) => [atom.id, atom]),
	);
	it("takes over every second-language atom of the source cell and nothing else", () => {
		expect(source.tile_id).toBe("zam-academy:franzoesisch-gymnasium-6");
		expect(source.version).toBe("2026.11.2");
		expect([...old.keys()]).toEqual(cell.atoms.map((atom) => atom.id));
	});
	it.each(cell.atoms)("keeps ids, slugs and every card field ZAM compares: $slug", (atom) => {
		const before = old.get(atom.id)!;
		const strip = ({ namespace: _n, source_link: _s, curricula: _c, ...rest }: Record<string, unknown>) => rest;
		const items = (value: { practice_items: Record<string, unknown>[] }) =>
			value.practice_items.map(({ source_link: _s, ...rest }) => rest);
		expect({ ...strip(atom), practice_items: items(atom) }).toEqual({
			...strip(before),
			practice_items: items(before),
		});
		expect(atom.namespace).toBe("zam-academy-franzoesisch-2fs-gymnasium-6");
		expect(atom.source_link).toBe(
			before.source_link.replace("/franzoesisch-gymnasium-6/", "/franzoesisch-2fs-gymnasium-6/"),
		);
		expect(atom.curricula.map((b) => b.topic_code)).toEqual(
			before.curricula.map((b) => b.topic_code.replace(/^f2-/, "")),
		);
	});
});
