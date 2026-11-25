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
import { workshopGoals } from "../src/workshop";

const items = cell.atoms.flatMap((a) => a.practice_items);

describe("Grade 7 first-language Latin teaching contract", () => {
	it("has eight stages, 36 lessons, 108 goals and 108 cards", () => {
		expect(LESSONS).toHaveLength(36);
		expect(CORE_LESSONS).toHaveLength(36);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual([5, 4, 5, 5, 4, 5, 4, 4]);
		expect(cell.atoms).toHaveLength(36);
		expect(items).toHaveLength(108);
	});

	it.each(LESSONS)(
		"has substantial teaching, feedback, diagram and distinct tasks: $id",
		(l) => {
			expect(l.id).toMatch(/^l7-[a-z-]+$/);
			expect(l.paragraphs).toHaveLength(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(400);
			expect(l.material.length).toBeGreaterThan(80);
			expect(["la", "de"]).toContain(l.materialLanguage);
			expect(l.diagram.title.length).toBeGreaterThan(5);
			expect(l.diagram.caption.length).toBeGreaterThan(10);
			if (l.diagram.parts) {
				expect(l.diagram.parts).toHaveLength(3);
				for (const part of l.diagram.parts) {
					expect(part.label.length).toBeGreaterThan(3);
					expect(part.detail.length).toBeGreaterThan(15);
				}
			}
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
			expect(checkPractice(l.practice, ["falsch", "falsch"])).toEqual([
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
			expect(l.paragraphs.join(" ")).not.toMatch(/\d\.\d/);
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

	it("maps all 50 competences and every lesson, and respects Grade 8 boundaries", () => {
		expect(coverage.rows).toHaveLength(50);
		expect(new Set(coverage.rows.map((r) => r.id)).size).toBe(50);
		const mapped = new Set(coverage.rows.flatMap((r) => r.lessons));
		for (const l of LESSONS) expect(mapped.has(l.id)).toBe(true);
		for (const r of coverage.rows) {
			expect(["supported", "implemented"]).toContain(r.status);
			expect(r.evidence.length).toBeGreaterThan(40);
			for (const id of r.lessons) expect(findLesson(id)).toBeDefined();
		}
		for (const id of [
			"L7-04",
			"L7-05",
			"L7-07",
			"L7-27",
			"L7-36",
			"L7-41",
			"L7-44",
			"L7-45",
			"L7-46",
			"L7-47",
			"L7-48",
			"L7-49",
			"L7-50",
		]) {
			expect(coverage.rows.find((r) => r.id === id)?.status).toBe("supported");
		}
		expect(
			LESSONS.some((l) => /Gerundiv|Semideponent|Phaedrus|fieri/i.test(l.title)),
		).toBe(false);
	});
});

describe("answer handling, progress and routes", () => {
	it("normalises Latin macrons and punctuation while preserving umlauts", () => {
		expect(normalise(" amāre. ")).toBe("amare");
		expect(normalise("Prätor!")).toBe("prätor");
		expect(normalise("V. S. L. M.")).toBe("v. s. l. m");
		const l = findLesson("l7-aussprache-paenultima")!;
		expect(checkPractice(l.practice, ["fa", "em"])).toEqual([true, true]);
	});

	it("requires workshop, checks and a real self-assessed draft", () => {
		const p = freshProgress(),
			id = p.activeLessonId;
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(p, id, 1, "Die Soldaten erhoben die Feldzeichen und rückten vor.");
		p.writingDone.push(writingKey(id, 1));
		expect(isComplete(p, id)).toBe(false);
		p.workshopDone.push(id);
		expect(isComplete(p, id)).toBe(true);
		updateDraft(p, id, 1, "Eine andere Übersetzung ohne neue Prüfung.");
		expect(isComplete(p, id)).toBe(false);
		expect(canReview(" ".repeat(100))).toBe(false);
		expect(
			canAccept("Eine eigene Antwort mit mehr als zwanzig Zeichen.", [
				true,
				true,
				false,
			]),
		).toBe(false);
		expect(
			canAccept("Eine eigene Antwort mit mehr als zwanzig Zeichen.", [
				true,
				true,
				true,
			]),
		).toBe(true);
	});

	it("recovers corrupted state and isolates its storage key", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"])
			expect(parseProgress(raw)).toEqual(freshProgress());
		expect(STORAGE_KEY).toBe("latein_gym7_l1_academy_progress_v1");
		const p = parseProgress(
			JSON.stringify({
				workshopDone: ["bad", "l7-abl-abs-aufbau", "l7-abl-abs-aufbau"],
			}),
		);
		expect(p.workshopDone).toEqual(["l7-abl-abs-aufbau"]);
	});

	it("keeps both task levels and all lesson deep links valid", () => {
		for (const l of LESSONS)
			for (const level of [1, 2])
				expect(parseTrainingDeepLink(`#lesson=${l.id}&level=${level}`)).toEqual(
					{ lessonId: l.id, level },
				);
		expect(
			trainingBaseUrl("/app/", "?lesson=l7-abl-abs-aufbau&level=1&keep=yes"),
		).toBe("/app/?keep=yes");
	});
});

describe("ZAM content and identifier contracts", () => {
	it("pins identifiers and ships no replaces or retired_items", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.approved).toBeNull();
		expect(mapping.status).toBe("proposal-only");
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
		expect(new Set(ids).size).toBe(144);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});

	it.each(cell.atoms)(
		"links only to real lessons and grade 7 curriculum: $slug",
		(a) => {
			const l = findLesson(a.slug)!;
			expect(l).toBeDefined();
			expect(a.source_link).toBe(lessonLink(l.id));
			expect(a.practice_items).toHaveLength(3);
			expect(new Set(a.practice_items.map((i) => i.question)).size).toBe(3);
			for (const b of a.curricula.filter(
				(b) => b.provider === "lehrplanplus-bayern",
			)) {
				expect(b).toMatchObject({
					school_type: "gymnasium",
					grade: 7,
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

	it("preserves PR #201 linguistic and historical accuracy fixes", () => {
		const stress = findLesson("l7-aussprache-paenultima")!;
		expect(stress.material).toContain("prōvincia");
		expect(stress.material).not.toContain("provīncia");
		expect(stress.tasks[1].model).toContain("prō-VÍN-ci-a");
		expect(stress.tasks[1].model).toContain("vorletzte Silbe -ci-");

		const perfKonj = findLesson("l7-konjunktiv-perfekt")!;
		expect(perfKonj.material).toContain("Ne dubitaveris, amice,");
		expect(perfKonj.material).not.toContain("dubitaveris, amici");
		expect(perfKonj.tasks[1].model).toContain("Zweifle nicht, Freund,");

		const clauses = findLesson("l7-indirekte-fragen-begehr")!;
		expect(clauses.paragraphs[0]).toContain("verneint ne");
		expect(clauses.paragraphs[0]).toContain("verneint ut non");

		const wonders = findLesson("l7-weltwunder-staetten")!;
		expect(wonders.paragraphs[0]).toContain("mesopotamische Tradition");
		expect(wonders.paragraphs[0]).toContain("Nebukadnezar II.");
		expect(wonders.paragraphs[0]).toContain("archäologisch bis heute nicht gesichert");
	});
});
