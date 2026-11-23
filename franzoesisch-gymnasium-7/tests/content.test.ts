import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import {
	lessonsForTrack,
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
import { workshopGoals } from "../src/workshop";
const items = cell.atoms.map((a) => a.practice_items).flat();

describe("Grade 7 first- and second-language French teaching contract", () => {
	it("provides two complete paths and three goals and cards per lesson", () => {
		expect(LESSONS).toHaveLength(68);
		expect(lessonsForTrack("f1")).toHaveLength(29);
		expect(lessonsForTrack("f2")).toHaveLength(39);
		for (const track of ["f1", "f2"] as const) {
			const stages = STAGES.filter((stage) => stage.track === track);
			expect(stages).toHaveLength(5);
			for (const stage of stages)
				expect(lessonsForTrack(track).some((lesson) => lesson.stage === stage.id)).toBe(true);
		}
		expect(cell.atoms).toHaveLength(68);
		expect(items).toHaveLength(204);
		expect(LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id)).toEqual([
			"f7-1-appel", "f7-1-chanson", "f7-1-sons", "f7-2-meteo",
			"f7-2-hotel", "f7-2-trajet", "f7-2-sons",
		]);
	});
	it.each(LESSONS)(
		"has substantial teaching, feedback and distinct tasks: $id",
		(l) => {
			expect(l.id).toMatch(/^f7-[12]-[a-z-]+$/);
			expect(l.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(250);
			expect(l.material.length).toBeGreaterThan(65);
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
	it("maps each expectation and lesson to the correct path, with honest limits", () => {
		expect(coverage.rows).toHaveLength(103);
		expect(new Set(coverage.rows.map((row) => row.id)).size).toBe(103);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id)).toBe(true);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(30);
			for (const id of row.lessons)
				expect(findLesson(id)?.track).toBe(row.track.toLowerCase());
		}
		for (const id of ["F1-01", "F1-03", "F1-09", "F1-24", "F1-38", "F1-47", "F2-01", "F2-05", "F2-38", "F2-52"])
			expect(coverage.rows.find((row) => row.id === id)?.status).toBe("supported");
	});
	it("places new structures in the right curricula and labels the speaking and hearing supports", () => {
		const text = (id: string) => findLesson(id)!.paragraphs.join(" ");
		expect(text("f7-2-relatifs")).toContain("le parc où je joue");
		expect(text("f7-2-objets-indirects")).toContain("Je vais leur parler");
		expect(text("f7-2-avoir-passe")).toContain("j’ai joué");
		expect(text("f7-2-etre-passe")).toContain("elles sont arrivées");
		expect(text("f7-1-deux-questions")).toContain("Qu’est-ce qui");
		expect(findLesson("f7-2-deux-questions")).toBeUndefined();
		expect(findLesson("f7-1-relatifs")).toBeUndefined();
		for (const track of ["1", "2"]) {
			expect(text(`f7-${track}-imparfait`)).toContain("nous finissons");
			expect(text(`f7-${track}-en`)).toContain("J’en prends deux");
			expect(text(`f7-${track}-pronominaux`)).toContain("Nous allons nous lever");
		}
	});
});
describe("answer handling, progress and routes", () => {
	it("accepts typography without discarding meaningful accents", () => {
		expect(normalise(" D’ABORD. ")).toBe("d'abord");
		expect(normalise("e\u0301cole")).toBe("école");
		const l = findLesson("f7-2-accents")!;
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
		expect(STORAGE_KEY).toBe("franzoesisch_gym7_academy_progress_v1");
		const p = parseProgress(
			JSON.stringify({ workshopDone: ["bad", "f7-2-echange", "f7-2-echange"] }),
		);
		expect(p.workshopDone).toEqual(["f7-2-echange"]);
	});
	it("keeps both task levels and all lesson deep links valid", () => {
		for (const l of LESSONS)
			for (const level of [1, 2])
				expect(parseTrainingDeepLink(`#lesson=${l.id}&level=${level}`)).toEqual(
					{ lessonId: l.id, level },
				);
		expect(trainingBaseUrl("/app/", "?lesson=f7-2-calendrier&level=1&keep=yes")).toBe(
			"/app/?keep=yes",
		);
	});
});
describe("ZAM content and identifier contracts", () => {
	it("uses accepted short answers when a card repeats a lesson prompt", () => {
		let checked = 0;
		for (const atom of cell.atoms) {
			const lesson = findLesson(atom.slug)!;
			for (const item of atom.practice_items) {
				const practice = lesson.practice.find(({ prompt }) => prompt === item.question);
				if (!practice) continue;
				expect(checkPractice([practice], [item.concept]), item.slug).toEqual([true]);
				expect(item.sample_solution, item.slug).toEqual([
					{ type: "text", text: item.concept },
				]);
				checked++;
			}
		}
		expect(checked).toBe(39);
	});
	it("pins identifiers and keeps the proposal free of retirements and replacements", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toHaveLength(8);
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
		expect(new Set(ids).size).toBe(272);
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
					school_type: "gymnasium",
					grade: 7,
					subject: "franzoesisch",
				});
				expect(b.topic_code).toMatch(new RegExp(`^${l.track}-lb`));
				expect(b).not.toHaveProperty("track");
			}
			for (const d of a.prerequisites)
				expect(cell.atoms.some((other) => other.id === d.atom_id)).toBe(true);
			for (const item of a.practice_items) {
				expect(item.source_link).toBe(lessonLink(l.id));
				expect(item).not.toHaveProperty("replaces");
				expect(item.question.length).toBeGreaterThan(8);
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
