import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
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

describe("Grade 8 first-language Latin teaching contract", () => {
	it("has eight stages, 40 lessons, 120 goals and 120 cards", () => {
		expect(LESSONS).toHaveLength(40);
		expect(CORE_LESSONS).toHaveLength(40);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual([5, 5, 5, 5, 5, 5, 5, 5]);
		expect(cell.atoms).toHaveLength(40);
		expect(items).toHaveLength(120);
	});

	it.each(LESSONS)(
		"has substantial teaching, feedback, diagram and distinct tasks: $id",
		(l) => {
			expect(l.id).toMatch(/^l8-[a-z-]+$/);
			expect(l.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(400);
			expect(l.material.length).toBeGreaterThan(75);
			expect(["la", "de"]).toContain(l.materialLanguage);
			expect([
				"paenultima-lab",
				"verb-lab",
				"gerundiv-lab",
				"nci-lab",
				"modus-lab",
				"kaiserzeit-timeline",
				"limes-map",
				"recht-lab",
				"philo-lab",
				"morph-lab",
				"myth-values",
				"syntax-tree",
			]).toContain(l.diagram.kind);
			expect(l.workshop).not.toHaveProperty("kind");
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

	it("maps all 57 competences and every lesson, and respects Grade 9 boundaries", () => {
		expect(coverage.rows).toHaveLength(57);
		expect(new Set(coverage.rows.map((r) => r.id)).size).toBe(57);
		expect(coverage.optional_lessons).toEqual([]);
		const mapped = new Set(coverage.rows.flatMap((r) => r.lessons));
		for (const l of LESSONS) expect(mapped.has(l.id)).toBe(true);
		for (const r of coverage.rows) {
			expect(["supported", "implemented"]).toContain(r.status);
			expect(r.evidence.length).toBeGreaterThan(40);
			for (const id of r.lessons) expect(findLesson(id)).toBeDefined();
		}
		const supportedIds = [
			"L8-04",
			"L8-05",
			"L8-07",
			"L8-42",
			"L8-43",
			"L8-44",
			"L8-45",
			"L8-46",
			"L8-50",
			"L8-51",
			"L8-52",
			"L8-53",
			"L8-54",
			"L8-55",
			"L8-56",
			"L8-57",
		];
		expect(
			coverage.rows.filter((r) => r.status === "supported").map((r) => r.id),
		).toEqual(supportedIds);
		expect(
			LESSONS.some((l) =>
				/Nepos|bello Gallico|Distichon|oratio obliqua|historisches Präsens/i.test(
					l.title,
				),
			),
		).toBe(false);
	});
});

describe("answer handling, progress and routes", () => {
	it("normalises Latin macrons and punctuation while preserving umlauts", () => {
		expect(normalise(" fīĕrī. ")).toBe("fieri");
		expect(normalise("Prätor!")).toBe("prätor");
		expect(normalise("S. P. Q. R.")).toBe("s. p. q. r");
		const l = findLesson("l8-wortschatz-kontext")!;
		expect(
			checkPractice(l.practice, ["Er fragt den Senat um Rat.", "so"]),
		).toEqual([true, true]);
	});

	it("requires workshop, checks and a real self-assessed draft", () => {
		const p = freshProgress(),
			id = p.activeLessonId;
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(
			p,
			id,
			1,
			"Karthago muss zerstört werden, und die Gesetze müssen geachtet werden.",
		);
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
		expect(STORAGE_KEY).toBe("latein_gym8_l1_academy_progress_v1");
		const p = parseProgress(
			JSON.stringify({
				workshopDone: ["bad", "l8-gerundiv-praedikativ", "l8-gerundiv-praedikativ"],
			}),
		);
		expect(p.workshopDone).toEqual(["l8-gerundiv-praedikativ"]);
	});

	it("keeps both task levels and all lesson deep links valid", () => {
		for (const l of LESSONS)
			for (const level of [1, 2])
				expect(parseTrainingDeepLink(`#lesson=${l.id}&level=${level}`)).toEqual(
					{ lessonId: l.id, level },
				);
		expect(
			trainingBaseUrl("/app/", "?lesson=l8-gerundiv-praedikativ&level=1&keep=yes"),
		).toBe("/app/?keep=yes");
	});
});

describe("ZAM content and identifier contracts", () => {
	it("pins identifiers and ships neither replaces nor retirements while proposal-only", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell).not.toHaveProperty("retired_items");
		for (const atom of cell.atoms) expect(atom).not.toHaveProperty("replaces");
		for (const item of items) expect(item).not.toHaveProperty("replaces");
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
		"links only to real lessons and grade 8 curriculum: $slug",
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
					grade: 8,
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

	it("anchors key linguistic and cultural distinctions accurately", () => {
		const cato = findLesson("l8-gerundiv-praedikativ")!;
		expect(cato.material).toContain("Carthago delenda est");
		const nci = findLesson("l8-nci-aufbau")!;
		expect(nci.paragraphs.join(" ")).toContain("Nominativ");
		const limes = findLesson("l8-limes-germanen")!;
		expect(limes.paragraphs.join(" ")).toContain("Obergermanisch-Raetische Limes");
		const philo = findLesson("l8-epikur-stoa")!;
		expect(philo.paragraphs.join(" ")).toContain("Ataraxia");
		const kaiser = findLesson("l8-kaiserzeit-epochen")!;
		expect(kaiser.paragraphs.join(" ")).toContain("27 v. Chr.");
		expect(kaiser.material).toContain("pacem servandam et leges servandas curavit");
		expect(kaiser.tasks[1].model).not.toContain("bewahrt werden mussten");
		const religion = findLesson("l8-religion-interpretatio")!;
		expect(religion.material).toContain("Herculem ac Martem");
		expect(religion.material).not.toContain("Martem ac Iovem");
		const recht = findLesson("l8-werte-iustitia-humanitas")!;
		expect(recht.paragraphs.join(" ")).toContain("De officiis");
		expect(recht.paragraphs.join(" ")).not.toContain("Cicero prägte den berühmten Hinweis");
		const trad = findLesson("l8-antike-tradition-europa")!;
		expect(trad.practice[0].prompt).not.toContain("griechisch-lateinische");
		expect(trad.practice[0].feedback).toContain("19. Jh.");
		const sokrates = findLesson("l8-sokrates-fragen")!;
		expect(sokrates.material).toContain("iniuriam pati malebat quam facere");
		expect(sokrates.material).not.toContain("nec iniuriam facere");
		const seneca = findLesson("l8-cicero-seneca")!;
		expect(seneca.paragraphs.join(" ")).toContain("Non vitae, sed scholae discimus");
		expect(seneca.paragraphs.join(" ")).toContain("spätere Nachwelt");
	});

	it("addresses the learner directly with du instead of generic man in prompts", () => {
		const stripQuoted = (text: string) => text.replace(/„[^“]*“/g, "");
		for (const l of LESSONS) {
			expect(stripQuoted(l.quiz.question)).not.toMatch(/\bman\b/i);
			for (const p of l.practice) {
				expect(stripQuoted(p.prompt)).not.toMatch(/\bman\b/i);
			}
			for (const t of Object.values(l.tasks)) {
				expect(stripQuoted(t.prompt)).not.toMatch(/\bman\b/i);
			}
			for (const g of l.workshop.goals) {
				expect(stripQuoted(g.label)).not.toMatch(/\bman\b/i);
			}
		}
	});
});
