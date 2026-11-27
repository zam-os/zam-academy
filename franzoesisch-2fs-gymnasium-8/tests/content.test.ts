import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import legacy from "./fixtures/de-by-gymnasium-8-franzoesisch-imparfait-passe-compose-objektpronomen-kvt.json";
import contract from "./fixtures/public-contract.json";
import sourceChecks from "../source-checks.json";
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
} from "../src/storage/progress";
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";
import { renderExplorer } from "../src/explorers";
import { workshopGoals } from "../src/workshop";

const items = cell.atoms.map((a) => a.practice_items).flat();
const visible = (html: string) =>
	html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const lessonText = (id: string) => JSON.stringify(findLesson(id));

describe("Grade 8 second-language French teaching contract", () => {
	it("provides a complete path in five stages and three cards per lesson", () => {
		expect(LESSONS).toHaveLength(43);
		expect(STAGES).toHaveLength(5);
		expect(new Set(STAGES.map((stage) => stage.hue)).size).toBe(5);
		for (const stage of STAGES)
			expect(LESSONS.filter((lesson) => lesson.stage === stage.id).length).toBeGreaterThanOrEqual(8);
		expect(cell.atoms).toHaveLength(43);
		expect(items).toHaveLength(129);
		expect(LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id)).toEqual([
			"f8-2-annonce",
			"f8-2-podcast",
			"f8-2-sons",
		]);
	});
	it.each(LESSONS)("has substantial teaching, feedback and distinct tasks: $id", (l) => {
		expect(l.id).toMatch(/^f8-2-[a-z-]+$/);
		expect(STAGES.some((stage) => stage.id === l.stage)).toBe(true);
		expect(l.paragraphs.length).toBeGreaterThanOrEqual(2);
		expect(l.paragraphs.join(" ").length).toBeGreaterThan(400);
		expect(l.material.length).toBeGreaterThan(65);
		expect(l.materialLanguage).toBe(l.id === "f8-2-programme" ? "de" : "fr");
		expect(l.takeaway.length).toBeGreaterThan(40);
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
		expect(checkPractice(l.practice, l.practice.map((p) => p.answers[0]))).toEqual([true, true]);
		expect(checkPractice(l.practice, ["wrong", "wrong"])).toEqual([false, false]);
		expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
		for (const t of Object.values(l.tasks)) {
			expect(t.criteria).toHaveLength(3);
			expect(t.model.length).toBeGreaterThan(28);
			expect(t.prompt.length).toBeGreaterThan(28);
		}
		for (const id of l.sourceIds) expect(SOURCES.some((s) => s.id === id)).toBe(true);
		expect(JSON.stringify(l)).not.toMatch(/<script|<p>|<div>|\\\\\(|teacherVideo/);
	});
	it.each(LESSONS)("proves every workshop goal reachable and none true initially: $id", (l) => {
		expect(l.workshop.goals).toHaveLength(3);
		expect(workshopGoals(l.workshop, [])).toEqual([false, false, false]);
		expect(workshopGoals(l.workshop, l.workshop.goals.map((g) => g.answer))).toEqual([true, true, true]);
		l.workshop.goals.forEach((g, i) => {
			expect(new Set(g.options).size).toBe(3);
			expect(g.options).toContain(g.answer);
			const answers = Array(3).fill("");
			answers[i] = g.answer;
			expect(workshopGoals(l.workshop, answers).filter(Boolean)).toHaveLength(1);
			for (const wrong of g.options.filter((v) => v !== g.answer)) {
				answers[i] = wrong;
				expect(workshopGoals(l.workshop, answers).filter(Boolean)).toHaveLength(0);
			}
		});
	});
	it.each(LESSONS)("opens with a visual explorer that shows no internal keys: $id", (l) => {
		const html = renderExplorer(l);
		expect(html.length).toBeGreaterThan(200);
		const text = visible(html);
		expect(text).not.toMatch(/f8-2-|f2-[a-z]|undefined|NaN|\[object/);
		expect(text).not.toMatch(/\b[a-z]+_[a-z]+\b/);
		const steps = html.match(/data-step="\d"/g) ?? [];
		const panels = html.match(/data-step-panel="\d"/g) ?? [];
		expect(panels.length).toBe(steps.length);
		for (const mark of html.match(/data-mark="(\d)"/g) ?? [])
			expect(steps).toContain(mark.replace("mark", "step"));
	});
	it("links only sources whose real page title was read", () => {
		expect(sourceChecks.map((s) => [s.id, s.url])).toEqual(SOURCES.map((s) => [s.id, s.url]));
		for (const check of sourceChecks) expect(check.title.length).toBeGreaterThan(10);
		expect(cell.sources.map((s) => s.uri)).toEqual(SOURCES.map((s) => s.url));
	});
	it("gives every timeline three different points in time", () => {
		const timelines = LESSONS.map(renderExplorer).filter((html) => html.includes("timeline-figure"));
		expect(timelines).toHaveLength(5);
		for (const html of timelines) {
			const labels = [...html.matchAll(/<g data-mark="\d"><circle[^>]*\/><text[^>]*>([^<]+)<\/text>/g)].map((m) => m[1]);
			expect(labels).toHaveLength(3);
			expect(new Set(labels).size).toBe(3);
		}
	});
	it("maps each expectation and lesson, with honest limits", () => {
		const count = coverage.rows.length;
		expect(new Set(coverage.rows.map((row) => row.id)).size).toBe(count);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id), lesson.id).toBe(true);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(30);
			expect(row.lessons.length).toBeGreaterThan(0);
			for (const id of row.lessons) expect(findLesson(id), row.id).toBeDefined();
			expect(row.track).toBe("F2");
		}
		for (const row of coverage.rows.filter((r) => /Hör- und Hörsehverstehen|Sprechen|dolmetschen|Rollenspiel/.test(r.lb + r.competence)))
			if (/Hör- und Hörseh|Vorträgen|dolmetschen|Rollenspiel/.test(row.competence)) expect(row.status, row.id).toBe("supported");
	});
	it("teaches the Grade 8 grammar and leaves Grade 9 grammar out", () => {
		expect(lessonText("f8-2-plus-que-parfait")).toContain("j’avais mangé");
		expect(lessonText("f8-2-inversion")).toContain("A-t-il un frère ?");
		expect(lessonText("f8-2-lequel")).toContain("lesquelles");
		expect(lessonText("f8-2-qui-quoi")).toContain("Qu’est-ce qui se passe ?");
		expect(lessonText("f8-2-personne-rien")).toContain("Personne ne répond");
		expect(lessonText("f8-2-emment")).toContain("évidemment");
		expect(lessonText("f8-2-courir-rire")).toContain("j’ai ri");
		expect(lessonText("f8-2-croire-mourir")).toContain("nous croyons");
		expect(lessonText("f8-2-accord-avoir")).toContain("selbst anwenden musst du sie noch nicht");
		const french = LESSONS.flatMap((l) => [
			l.material,
			l.quiz.answer,
			...l.practice.flatMap((p) => p.answers),
			...Object.values(l.tasks).map((t) => t.model),
			...l.workshop.goals.flatMap((g) => [g.before, g.answer, g.after]),
		]).join(" ");
		// Grade 9: y/en as adverbial pronouns, futur simple, conditionnel and si-clauses.
		expect(french).not.toMatch(/\b(j’y|n’y|on y|il y va|j’en|n’en)\b/);
		expect(french).not.toMatch(/\b(serai|seras|sera|serons|aurai|aura|ferai|fera|irai|ira|viendra|partira|pourrai|pourra)\b/);
		expect(french).not.toMatch(/\b(serait|aurait|ferait|pourrais|irais)\b/);
	});
	it("writes German learner text with the school conventions", () => {
		for (const l of LESSONS) {
			const german = [...l.paragraphs, l.takeaway, l.skill, l.quiz.question, l.quiz.explanation].join(" ");
			expect(german, l.id).not.toMatch(/\d\.\d/);
			expect(german, l.id).not.toMatch(/\bSie\b (kannst|hast|bist)/);
		}
	});
});

describe("answer handling, progress and routes", () => {
	it("accepts typography without discarding meaningful accents", () => {
		expect(normalise(" D’ABORD. ")).toBe("d'abord");
		expect(normalise("évid#emment".replace("#", ""))).toBe("évidemment");
		expect(normalise("Viens-tu avec nous ?")).toBe(normalise("Viens-tu avec nous?"));
		const l = findLesson("f8-2-emment")!;
		expect(checkPractice(l.practice, ["constamment", "récemment"])).toEqual([true, true]);
		expect(checkPractice(l.practice, ["constament", "recemment"])).toEqual([false, false]);
	});
	it("requires workshop, checks and a real self-assessed draft", () => {
		const p = freshProgress(),
			id = p.activeLessonId;
		const listening = findLesson(id)!.listening;
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(p, id, 1, "Le train pour Rouen part de la voie sept.");
		p.writingDone.push(writingKey(id, 1));
		if (listening) p.listening[id] = { synthetic: true, partner: false };
		expect(isComplete(p, id)).toBe(false);
		p.workshopDone.push(id);
		expect(isComplete(p, id)).toBe(true);
		updateDraft(p, id, 1, "Le train a un retard de vingt minutes.");
		expect(isComplete(p, id)).toBe(false);
		expect(canReview(" ".repeat(100))).toBe(false);
		expect(canAccept("Une réponse personnelle et complète.", [true, true, false])).toBe(false);
		expect(canAccept("Une réponse personnelle et complète.", [true, true, true])).toBe(true);
	});
	it("recovers corrupted state and keeps only its own lesson ids", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"]) expect(parseProgress(raw)).toEqual(freshProgress());
		const p = parseProgress(JSON.stringify({ workshopDone: ["bad", "f7-2-echange", "f8-2-lequel", "f8-2-lequel"] }));
		expect(p.workshopDone).toEqual(["f8-2-lequel"]);
	});
	it("keeps both task levels and all lesson deep links valid", () => {
		for (const l of LESSONS)
			for (const level of [1, 2])
				expect(parseTrainingDeepLink(`#lesson=${l.id}&level=${level}`)).toEqual({ lessonId: l.id, level });
		expect(trainingBaseUrl("/app/", "?lesson=f8-2-pays&level=1&keep=yes")).toBe("/app/?keep=yes");
	});
});

describe("ZAM content and identifier contracts", () => {
	it("pins identifiers and keeps the first cell free of replacements and retirements", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell).not.toHaveProperty("retired_items");
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
		expect(new Set(ids).size).toBe(172);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});
	it.each(cell.atoms)("links only to real lessons and the Grade 8 curriculum: $slug", (a) => {
		const l = findLesson(a.slug)!;
		expect(l).toBeDefined();
		expect(a.source_link).toBe(lessonLink(l.id));
		expect(a.title).toBe(l.title);
		expect(a.practice_items).toHaveLength(3);
		expect(new Set(a.practice_items.map((i) => i.question)).size).toBe(3);
		const bindings = a.curricula.filter((b) => b.provider === "lehrplanplus-bayern");
		expect(bindings.map((b) => b.topic_code)).toEqual(l.bindings.map((b) => `f2-lb${b}`));
		for (const b of bindings) {
			expect(b).toMatchObject({ school_type: "gymnasium", grade: 8, subject: "franzoesisch-2fs" });
			expect(b).not.toHaveProperty("track");
		}
		expect(a.curricula[0]).toMatchObject({ provider: "zam-academy", topic_code: l.stage });
		for (const d of a.prerequisites) expect(cell.atoms.some((other) => other.id === d.atom_id)).toBe(true);
		for (const item of a.practice_items) {
			expect(item.source_link).toBe(lessonLink(l.id));
			expect(item.question.length).toBeGreaterThan(8);
			expect(item.concept.length).toBeGreaterThan(1);
			expect(item.question.trim()).toBe(item.question);
			if (item.tier === "tier1_fast") {
				expect(item.fast_check!.options).toHaveLength(2);
				expect(item.fast_check!.correct_index).toBe(0);
				expect(item.fast_check!.options[0]).toBe(item.concept);
				expect(item.fast_check!.options[0]).not.toBe(item.fast_check!.options[1]);
			} else {
				expect(item.sample_solution).toBe(item.concept);
				// Cards ask lasting knowledge, not lists that exist only in this package.
				expect(item.question).not.toMatch(/Nenne (die|alle) (\S+ )?(drei|vier|fünf|sechs)/);
			}
			expect(item).not.toHaveProperty("choice_distractors");
		}
		expect(a.practice_items.map((i) => i.tier)).toEqual(["tier1_fast", "tier2_synthesis", "tier2_synthesis"]);
	});
	it("proposes, but does not approve, the legacy Grade 8 mapping", () => {
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.sources.map((s) => s.tile_id)).toEqual([legacy.tile_id]);
		const legacyIds = legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id));
		expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual([...legacyIds].sort());
		const slugs = new Set(items.map((i) => i.slug));
		for (const row of mapping.rows) {
			expect(["A", "B", "C"]).toContain(row.category);
			expect(row.reason.length).toBeGreaterThan(40);
			if (row.category === "C") expect(["keep-active", "propose-retire-after-approval"]).toContain(row.action);
			else {
				expect(row.action).toBe("propose-replace-after-approval");
				expect(slugs.has((row as { academy_slug?: string }).academy_slug ?? "")).toBe(true);
			}
		}
	});
});
