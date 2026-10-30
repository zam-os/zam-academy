import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import {
	CORE_LESSONS,
	findLesson,
	LESSONS,
	SOURCES,
	STAGES,
} from "../src/curriculum";
import { localFrenchVoices } from "../src/listening";
import {
	canAccept,
	canReview,
	checkPractice,
	esc,
	normalise,
	quizOptions,
} from "../src/practice";
import {
	completion,
	freshProgress,
	isComplete,
	loadProgress,
	parseProgress,
	saveProgress,
	updateDraft,
	writingKey,
} from "../src/storage/progress";
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";
import legacy from "./fixtures/de-by-franzoesisch-8.json";
import mapping from "../replaces-de-by.json";

const items = cell.atoms.flatMap((a) => a.practice_items);

describe("French 8 curriculum and original teaching material", () => {
	it("separates 40 core lessons from two optional relative-clause extensions", () => {
		expect(CORE_LESSONS).toHaveLength(40);
		expect(LESSONS).toHaveLength(42);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual([5, 5, 5, 5, 5, 5, 5, 5, 2]);
		expect(LESSONS.filter((l) => l.optional).map((l) => l.id)).toEqual([
			"f8-relatifs-qui-que",
			"f8-relatif-ou",
		]);
		expect(LESSONS.filter((l) => l.listening).map((l) => l.id)).toEqual([
			"f8-ecouter-rendezvous",
			"f8-ecouter-gare",
			"f8-prononciation",
		]);
	});
	it("traces every indexed expectation with real lesson anchors and additional work", () => {
		expect(coverage.rows).toHaveLength(56);
		expect(new Set(coverage.rows.map((e) => e.id)).size).toBe(56);
		expect(coverage.indexing).toContain("not official ISB ids");
		for (const e of coverage.rows) {
			expect(e.lessons.length, e.id).toBeGreaterThan(0);
			for (const id of e.lessons) expect(findLesson(id), e.id).toBeDefined();
			expect(["guided", "preparation"]).toContain(e.treatment);
			expect(e.additionalPractice.length).toBeGreaterThan(25);
		}
		for (const id of ["F8.1.1.H1", "F8.1.1.M3", "F8.1.2.A1", "F8.4.K5"])
			expect(coverage.rows.find((e) => e.id === id)?.treatment).toBe(
				"preparation",
			);
		expect(
			coverage.rows
				.filter((e) => e.id.startsWith("F8.1.2.G"))
				.flatMap((e) => e.facets ?? []),
		).toHaveLength(13);
	});
	it.each(LESSONS)(
		"provides usable checks and two distinct tasks: $id",
		(l) => {
			expect(l.id).toMatch(/^f8-[a-z0-9-]+$/);
			expect(l.paragraphs).toHaveLength(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(350);
			expect(l.materialLanguage).toBe("fr");
			expect(l.material.length).toBeGreaterThan(100);
			expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
			expect(quizOptions(l)).toContain(l.quiz.answer);
			expect(l.quiz.explanation.trim()).not.toBe("");
			expect(l.takeaway.trim()).not.toBe("");
			for (const id of l.sourceIds)
				expect(SOURCES.find((s) => s.id === id)?.url).toMatch(/^https:\/\//);
			expect(
				checkPractice(
					l.practice,
					l.practice.map((p) => p.answers[0]),
				),
			).toEqual(l.practice.map(() => true));
			expect(
				checkPractice(
					l.practice,
					l.practice.map(() => "not an answer"),
				),
			).toEqual(l.practice.map(() => false));
			expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
			for (const task of Object.values(l.tasks)) {
				expect(task.criteria).toHaveLength(3);
				expect(task.model.trim()).not.toBe("");
			}
		},
	);
	it("teaches the curriculum's missing details and avoids legacy overgeneralisations", () => {
		expect(findLesson("f8-passe-etre")!.paragraphs.join(" ")).toContain(
			"j’ai marché",
		);
		expect(findLesson("f8-passe-etre")!.paragraphs.join(" ")).toContain(
			"elle a sorti son livre",
		);
		expect(findLesson("f8-relatifs-qui-que")!.paragraphs.join(" ")).toContain(
			"qui te parle",
		);
		expect(findLesson("f8-irreguliers")!.paragraphs.join(" ")).toContain(
			"Il faut un stylo",
		);
		expect(findLesson("f8-irreguliers")!.paragraphs.join(" ")).toContain(
			"il faut lire",
		);
		expect(findLesson("f8-lexique")!.paragraphs.join(" ")).toContain(
			"un jeu, des jeux",
		);
		expect(findLesson("f8-lui-leur")!.paragraphs.join(" ")).toContain(
			"Je pense à elle",
		);
		expect(findLesson("f8-fetes")!.sourceIds).toContain("fete");
		expect(findLesson("f8-recherche")!.tasks[1].model).toContain(
			"keine Recherche",
		);
	});
});

describe("French answer checking and honest self-assessment", () => {
	it("accepts typography variants while preserving meaningful French accents", () => {
		expect(normalise("  D’ABORD. ")).toBe("d'abord");
		expect(normalise("e\u0301crit")).toBe("écrit");
		expect(normalise("  nous   avons  parlé! ")).toBe("nous avons parlé");
		const p = findLesson("f8-dictionnaire")!.practice;
		expect(checkPractice(p, ["a", "à"])).toEqual([true, true]);
		expect(checkPractice(p, ["à", "a"])).toEqual([false, false]);
		expect(checkPractice(p, ["a"])).toEqual([false, false]);
		expect(checkPractice(p, ["a", "à", "extra"])).toEqual([false, false]);
	});
	it("requires a draft and all three criteria, without treating a model view as completion", () => {
		expect(canReview(" ".repeat(100))).toBe(false);
		expect(
			canAccept("Une réponse complète avec mes propres mots.", [
				true,
				true,
				false,
			]),
		).toBe(false);
		expect(
			canAccept("Une réponse complète avec mes propres mots.", [true, true]),
		).toBe(false);
		expect(
			canAccept("Une réponse complète avec mes propres mots.", [
				true,
				true,
				true,
			]),
		).toBe(true);
		const p = freshProgress(),
			id = p.activeLessonId;
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(p, id, 1, "Bonjour, on se retrouve samedi à quinze heures ?");
		expect(isComplete(p, id)).toBe(false);
		p.writingDone.push(writingKey(id, 1));
		expect(isComplete(p, id)).toBe(true);
		updateDraft(p, id, 2, "Une autre réponse pour le deuxième niveau.");
		p.writingDone.push(writingKey(id, 2));
		updateDraft(p, id, 1, "Bonjour, on se retrouve dimanche à seize heures ?");
		expect(isComplete(p, id)).toBe(false);
		expect(p.writingDone).toContain(writingKey(id, 2));
	});
	it("keeps listening and optional lessons outside unearned core completion", () => {
		const p = freshProgress(),
			id = "f8-ecouter-rendezvous";
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(
			p,
			id,
			1,
			"On se retrouve devant la piscine à quatorze heures.",
		);
		p.writingDone.push(writingKey(id, 1));
		expect(isComplete(p, id)).toBe(false);
		p.listening[id] = "partner";
		expect(isComplete(p, id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, total: 40, percent: 3 });
		expect(completion(p, true).total).toBe(42);
	});
	it("uses only installed French voices, preferring fr-FR", () => {
		const voices = [
			{ name: "remote", lang: "fr-FR", localService: false },
			{ name: "english", lang: "en-GB", localService: true },
			{ name: "quebec", lang: "fr-CA", localService: true },
			{ name: "france", lang: "fr-FR", localService: true },
		] as SpeechSynthesisVoice[];
		expect(localFrenchVoices(voices).map((v) => v.name)).toEqual([
			"france",
			"quebec",
		]);
		expect(localFrenchVoices([])).toEqual([]);
	});
});

describe("offline state and navigation", () => {
	it.each([null, "null", "[]", "42", "bad json"])(
		"recovers invalid storage: %s",
		(raw) => {
			expect(parseProgress(raw)).toEqual(freshProgress());
		},
	);
	it("round trips independent drafts and filters unsupported state", () => {
		const p = freshProgress(),
			id = p.activeLessonId;
		updateDraft(p, id, 1, "Bonjour, on se retrouve samedi devant le cinéma ?");
		p.writingDone.push(writingKey(id, 1));
		expect(parseProgress(JSON.stringify(p))).toEqual(p);
		const parsed = parseProgress(
			JSON.stringify({
				activeLessonId: "<bad>",
				quizDone: [id, id, "bad"],
				drafts: { [writingKey(id, 1)]: "a".repeat(9000), bad: "bad" },
				listening: { [id]: "partner", "f8-ecouter-gare": "partner" },
			}),
		);
		expect(parsed.activeLessonId).toBe(id);
		expect(parsed.quizDone).toEqual([id]);
		expect(parsed.drafts[writingKey(id, 1)]).toHaveLength(8000);
		expect(parsed.listening).toEqual({ "f8-ecouter-gare": "partner" });
	});
	it("survives denied storage and escapes arbitrary learner text", () => {
		vi.stubGlobal("localStorage", {
			getItem() {
				throw Error("blocked");
			},
			setItem() {
				throw Error("blocked");
			},
		});
		try {
			expect(loadProgress()).toEqual(freshProgress());
			expect(saveProgress(freshProgress())).toBe(false);
		} finally {
			vi.unstubAllGlobals();
		}
		expect(esc('<img src=x onerror="bad">')).toBe(
			"&lt;img src=x onerror=&quot;bad&quot;&gt;",
		);
	});
	it("resolves lesson anchors, handles query compatibility and removes stale routes", () => {
		for (const l of LESSONS)
			expect(parseTrainingDeepLink(`#lesson=${l.id}&level=2`)).toEqual({
				lessonId: l.id,
				level: 2,
			});
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
		expect(
			parseTrainingDeepLink(
				"#lesson=f8-amis&level=2",
				"?lesson=f8-train&level=1",
			),
		).toEqual({ lessonId: "f8-amis", level: 2 });
		expect(trainingBaseUrl("/app/", "?lesson=f8-amis&level=1&keep=yes")).toBe(
			"/app/?keep=yes",
		);
	});
});

describe("cell contract and independent histories", () => {
	it("documents every old item as an unapproved keep-active C row", () => {
		expect(mapping.approved).toBeNull();
		expect(mapping.status).toBe("proposal-only");
		expect(new Set(mapping.rows.map((row) => row.de_by_id))).toEqual(
			new Set(legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id))),
		);
		for (const row of mapping.rows) {
			expect(row.category).toBe("C");
			expect(row.action).toBe("keep-active");
			expect(row.academy_slug).toBeNull();
		}
	});
	it("maps every lesson to a curriculum row or the optional list", () => {
		const mapped = new Set(coverage.rows.flatMap((r) => r.lessons));
		for (const l of LESSONS)
			expect(mapped.has(l.id) || coverage.optional_lessons.includes(l.id)).toBe(
				true,
			);
		for (const row of coverage.rows) {
			expect(row.track).toBe("IIIa");
			expect(row.lb).toBeGreaterThanOrEqual(1);
			expect(row.evidence.length).toBeGreaterThan(30);
		}
	});
	it("binds core lessons exclusively to grade 8 IIIa, with optional grammar outside school scope", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms).toHaveLength(42);
		expect(items).toHaveLength(84);
		for (const l of LESSONS) {
			const a = cell.atoms.find((a) => a.slug === l.id)!;
			expect(a.source_link).toBe(lessonLink(l.id));
			const bindings = a.curricula.filter(
				(b) => b.provider === "lehrplanplus-bayern",
			);
			expect(bindings).toHaveLength(l.optional ? 0 : l.bindings.length);
			for (const b of bindings)
				expect(b).toMatchObject({
					school_type: "realschule",
					grade: 8,
					track: "IIIa",
					subject: "franzoesisch",
					exam_relevant: true,
				});
			const recall = a.practice_items[1];
			expect(recall.question.length).toBeGreaterThan(15);
			expect(recall.concept.length).toBeLessThan(190);
			expect(recall.sample_solution).toBe(recall.concept);
			for (const i of a.practice_items)
				expect(i.source_link).toBe(lessonLink(l.id));
			const fast = a.practice_items[0].fast_check!;
			expect(fast.correct_index).toBe(0);
			expect(fast.options[0]).toBe(a.practice_items[0].concept);
		}
	});
	it("pins all ids and lesson anchors without replacing or retiring existing items", () => {
		expect(
			cell.atoms.map((a) => ({
				id: a.id,
				slug: a.slug,
				lesson: a.source_link,
				items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((a) => a.id);
		expect(new Set(ids).size).toBe(126);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		const oldIds = new Set(
			legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id)),
		);
		expect(ids.some((id) => oldIds.has(id))).toBe(false);
		expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
	});
});
