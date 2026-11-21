import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import { findLesson, LESSONS, SOURCES, STAGES } from "../src/curriculum";
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

describe("Grade 7 Realschule French teaching contract", () => {
	it("provides one complete path with eight stages and three cards per lesson", () => {
		expect(LESSONS).toHaveLength(54);
		expect(new Set(LESSONS.map((lesson) => lesson.id)).size).toBe(54);
		expect(STAGES).toHaveLength(8);
		expect(new Set(STAGES.map((stage) => stage.hue)).size).toBe(8);
		for (const stage of STAGES)
			expect(LESSONS.some((lesson) => lesson.stage === stage.id)).toBe(true);
		// Lessons appear stage by stage in learning-path order.
		const order = LESSONS.map((lesson) => STAGES.findIndex((stage) => stage.id === lesson.stage));
		expect(order).toEqual([...order].sort((a, b) => a - b));
		expect(cell.atoms).toHaveLength(54);
		expect(items).toHaveLength(162);
		expect(LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id)).toEqual([
			"f7-sons", "f7-courses", "f7-ecouter",
		]);
	});
	it.each(LESSONS)(
		"has substantial teaching, feedback and distinct tasks: $id",
		(l) => {
			expect(l.id).toMatch(/^f7-[a-z-]+$/);
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
	it("maps each expectation to lessons and every lesson to an expectation, with honest limits", () => {
		expect(coverage.rows).toHaveLength(70);
		expect(new Set(coverage.rows.map((row) => row.id)).size).toBe(70);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id)).toBe(true);
		expect(coverage.optional_lessons).toEqual([]);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(30);
			expect(row.lessons.length).toBeGreaterThan(0);
			for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
		}
		// Listening, speaking, mediation in person, performance and research stay partly in class.
		for (const prefix of ["erfassen sehr kurze", "agieren und reagieren", "lesen überschaubare", "finden Gefallen", "aktuelle Themen"])
			expect(coverage.rows.find((row) => row.competence.startsWith(prefix))?.status).toBe("supported");
	});
	it("keeps grade 7 scope: no structures that later grades introduce", () => {
		const text = LESSONS.map((lesson) => [lesson.paragraphs.join(" "), lesson.material, lesson.takeaway, lesson.tasks[1].model, lesson.tasks[2].model].join(" ")).join(" ");
		expect(text).not.toMatch(/passé composé|imparfait|subjonctif|conditionnel|Relativsatz/);
		// Grade 7 lists only me, te, nous, vous as object pronouns; le / la / les / lui / leur follow in grade 8.
		expect(text).not.toMatch(/\b(?:je|tu|il|elle|on|nous|vous|ils|elles) (?:ne )?(?:l’|la |le |les |lui |leur )(?:[a-zéèêàâîôûç]+(?:e|es|ons|ez|ent|s|t|d))\b(?! (?:de|du|la|le|les))/i);
		expect(text).not.toMatch(/\b(?:je|tu|il|elle|on|nous) me lève|qui est infirmière|y vais/);
		expect(findLesson("f7-cer-ger")!.paragraphs.join(" ")).toContain("nous commençons");
		expect(findLesson("f7-me-te")!.paragraphs.join(" ")).toContain("Il ne m’écoute pas");
		expect(findLesson("f7-futur")!.paragraphs.join(" ")).toContain("je vais jouer");
	});
	it("follows German and French text conventions", () => {
		for (const lesson of LESSONS) {
			const shown = [lesson.title, lesson.skill, ...lesson.paragraphs, lesson.material, lesson.takeaway, lesson.quiz.question, lesson.quiz.answer, ...lesson.quiz.wrong, lesson.quiz.explanation, ...lesson.practice.flatMap((p) => [p.prompt, p.feedback]), lesson.tasks[1].prompt, lesson.tasks[1].model, lesson.tasks[2].prompt, lesson.tasks[2].model].join(" ");
			// Decimal comma, typographic apostrophe, no ASCII minus between numbers.
			expect(shown, lesson.id).not.toMatch(/\d\.\d/);
			expect(shown, lesson.id).not.toMatch(/'/);
			expect(shown, lesson.id).not.toMatch(/\d ?- ?\d/);
			// French question and exclamation marks take a space before them.
			expect(lesson.material, lesson.id).not.toMatch(/[a-zàâçéèêëîïôûù][?!]/);
		}
	});
	it("gives verb tables six rows whose forms match the explanation", () => {
		const forms = (id: string, verb: string) =>
			findLesson(id)!.conjugation!.find((table) => table.verb === verb)!.rows.map(([, stem, ending]) => stem + ending);
		for (const lesson of LESSONS)
			for (const table of lesson.conjugation ?? []) expect(table.rows, `${lesson.id} ${table.verb}`).toHaveLength(6);
		expect(forms("f7-verbes-er", "parler")).toEqual(["parle", "parles", "parle", "parlons", "parlez", "parlent"]);
		expect(forms("f7-cer-ger", "manger")).toEqual(["mange", "manges", "mange", "mangeons", "mangez", "mangent"]);
		expect(forms("f7-cer-ger", "commencer")).toEqual(["commence", "commences", "commence", "commençons", "commencez", "commencent"]);
		expect(forms("f7-etre-avoir", "être")).toEqual(["suis", "es", "est", "sommes", "êtes", "sont"]);
		expect(forms("f7-etre-avoir", "avoir")).toEqual(["ai", "as", "a", "avons", "avez", "ont"]);
		expect(forms("f7-aller-faire", "aller")).toEqual(["vais", "vas", "va", "allons", "allez", "vont"]);
		expect(forms("f7-aller-faire", "faire")).toEqual(["fais", "fais", "fait", "faisons", "faites", "font"]);
		expect(forms("f7-prendre", "prendre")).toEqual(["prends", "prends", "prend", "prenons", "prenez", "prennent"]);
		expect(forms("f7-vouloir-pouvoir", "vouloir")).toEqual(["veux", "veux", "veut", "voulons", "voulez", "veulent"]);
		expect(forms("f7-vouloir-pouvoir", "pouvoir")).toEqual(["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"]);
	});
	it("gives every lesson a visual: map, clock, number line, scene, verb table or explorer", () => {
		const special = new Set(["f7-carte", "f7-heure", "f7-nombres", "f7-maison", "f7-chemin"]);
		for (const lesson of LESSONS) {
			expect(special.has(lesson.id) || !!lesson.explorer || !!lesson.conjugation?.length, lesson.id).toBe(true);
			for (const step of lesson.explorer?.steps ?? []) {
				expect(step.example.length).toBeGreaterThan(5);
				expect(step.detail.length).toBeGreaterThan(5);
			}
		}
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
		const l = findLesson("f7-accents")!;
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
		expect(STORAGE_KEY).toBe("franzoesisch_rs7_academy_progress_v1");
		const p = parseProgress(
			JSON.stringify({ workshopDone: ["bad", "f7-bonjour", "f7-bonjour"] }),
		);
		expect(p.workshopDone).toEqual(["f7-bonjour"]);
	});
	it("keeps both task levels and all lesson deep links valid", () => {
		for (const l of LESSONS)
			for (const level of [1, 2])
				expect(parseTrainingDeepLink(`#lesson=${l.id}&level=${level}`)).toEqual(
					{ lessonId: l.id, level },
				);
		expect(trainingBaseUrl("/app/", "?lesson=f7-date&level=1&keep=yes")).toBe(
			"/app/?keep=yes",
		);
	});
});
describe("ZAM content and identifier contracts", () => {
	it("pins identifiers and keeps the proposal-only cell free of replacements", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toHaveLength(4);
		expect(cell).not.toHaveProperty("retired_items");
		expect(
			cell.atoms.map((a) => ({
				id: a.id,
				slug: a.slug,
				lesson: a.source_link,
				items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((x) => x.id);
		expect(new Set(ids).size).toBe(216);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});
	it.each(cell.atoms)(
		"links only to real lessons and grade 7 curriculum: $slug",
		(a) => {
			const l = findLesson(a.slug)!;
			expect(a.source_link).toBe(lessonLink(l.id));
			expect(a.practice_items).toHaveLength(3);
			expect(new Set(a.practice_items.map((i) => i.question)).size).toBe(3);
			for (const b of a.curricula.filter(
				(b) => b.provider === "lehrplanplus-bayern",
			)) {
				expect(b).toMatchObject({
					school_type: "realschule",
					grade: 7,
					track: "IIIa",
					subject: "franzoesisch",
				});
				expect(l.bindings.map((binding) => `lb${binding}`)).toContain(b.topic_code);
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
