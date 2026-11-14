import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import publication from "../publication.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { renderMaterial } from "../src/material";
import {
	canAccept,
	canReview,
	checkCases,
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
import { renderVisual } from "../src/visuals";
import { parseTrainingDeepLink, trainingBaseUrl } from "../src/zam/zam-link";
import official from "./fixtures/official-d5.json";
import contract from "./fixtures/public-contract.json";
import narrative from "./fixtures/de-by-gymnasium-5-deutsch-erzaehlen-maerchen-fabeln-kvt.json";
import grammar from "./fixtures/de-by-gymnasium-5-deutsch-grammatik-faelle-rechtschreibung-kvt.json";

describe("Grade 5 Gymnasium package contract", () => {
	it("pins every lesson anchor and all freshly drawn identifiers", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(46);
		expect(cell.atoms).toHaveLength(46);
		const entries = cell.atoms.flatMap((a) => [a, ...a.practice_items]);
		expect(entries).toHaveLength(138);
		expect(new Set(entries.map((e) => e.id)).size).toBe(138);
		expect(Object.fromEntries(entries.map((e) => [e.slug, e.id]))).toEqual(
			contract.ids,
		);
		for (const entry of entries)
			expect(entry.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual([7, 12, 8, 19]);
		expect(publication).toEqual({ schema: 1, status: "local-only" });
	});
	it("maps all 42 official expectations without claiming classroom performance", () => {
		expect(coverage.rows).toHaveLength(42);
		expect(coverage.curriculum).toBe(official.source);
		expect(coverage.curriculum_sha256).toBe(official.html_sha256);
		expect(coverage.optional_lessons).toEqual([]);
		expect(
			coverage.rows.map(({ section, position, competence }) => ({
				section,
				position,
				competence,
			})),
		).toEqual(official.expectations);
		expect(official.areas).toEqual(
			[1, 2, 3, 4].map((lb) => ({ lb, hours: null })),
		);
		expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(
			new Set(LESSONS.map((l) => l.id)),
		);
		for (const row of coverage.rows) {
			expect(row.evidence.length).toBeGreaterThan(50);
			expect(["implemented", "supported"]).toContain(row.status);
			for (const id of row.lessons)
				expect(LESSONS.find((l) => l.id === id)?.bindings).toContain(
					row.section,
				);
		}
		for (const id of [
			"1.1.1",
			"1.2.1",
			"1.2.2",
			"1.2.3",
			"1.2.4",
			"1.3.1",
			"1.3.2",
			"1.4.1",
			"2.2.6",
			"2.4.1",
			"3.3.2",
		])
			expect(coverage.rows.find((r) => r.id === id)?.status).toBe("supported");
		expect(coverage.neighbours.map((n) => n.grade)).toEqual([4, 6]);
	});
	it("keeps all sixteen old retrievals and histories active without transfers", () => {
		const old = [
			...narrative.atoms.flatMap((a) =>
				a.practice_items.map((i) => ({ id: i.id })),
			),
			...grammar.atoms.flatMap((a) =>
				a.practice_items.map((i) => ({ id: i.id })),
			),
		];
		expect(old).toHaveLength(16);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.rows.map((r) => r.old_id).sort()).toEqual(
			old.map((i) => i.id).sort(),
		);
		expect(new Set(mapping.rows.map((r) => r.old_id)).size).toBe(16);
		expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(1);
		expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(15);
		for (const row of mapping.rows) {
			expect(row.action).toBe(
				row.category === "A" ? "propose-replace-after-approval" : "keep-active",
			);
			if (row.academy_slug)
				expect(
					cell.atoms
						.flatMap((a) => a.practice_items)
						.filter((i) => i.slug === row.academy_slug),
				).toHaveLength(1);
		}
		expect(cell).not.toHaveProperty("retired_items");
		for (const atom of cell.atoms)
			for (const item of atom.practice_items) {
				expect(item).not.toHaveProperty("replaces");
				expect(old.some((o) => o.id === item.id)).toBe(false);
			}
	});
	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s teaches and retrieves its own curriculum knowledge",
		(_, l) => {
			expect(l.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(l.takeaway.length).toBeGreaterThan(25);
			expect(l.lehrplan).toContain("D5 ·");
			expect(l.cases).toHaveLength(2);
			expect(checkCases(l.cases, [])).toEqual([false, false]);
			expect(
				checkCases(
					l.cases,
					l.cases.map((c) => c.answer),
				),
			).toEqual([true, true]);
			expect(
				checkCases(
					l.cases,
					l.cases.map((c) => c.options.find((o) => o !== c.answer) ?? ""),
				),
			).toEqual([false, false]);
			for (const c of l.cases) {
				expect(c.options).toContain(c.answer);
				expect(new Set(c.options).size).toBe(c.options.length);
				expect(c.feedback.length).toBeGreaterThan(25);
			}
			expect(new Set(quizOptions(l)).size).toBe(3);
			expect(quizOptions(l)).toContain(l.quiz.answer);
			expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
			expect(l.tasks[1].model).not.toBe(l.tasks[2].model);
			expect(l.tasks[1].criteria).not.toEqual(l.tasks[2].criteria);
			for (const level of [1, 2] as const) {
				expect(l.tasks[level].criteria).toHaveLength(3);
				expect(canReview(l.tasks[level].model)).toBe(true);
			}
			const atom = cell.atoms.find((a) => a.slug === l.id);
			if (!atom) throw new Error("Missing lesson atom");
			expect(atom.practice_items).toHaveLength(2);
			const [fast, recall] = atom.practice_items;
			expect(fast.tier).toBe("tier1_fast");
			expect(fast.question).toBe(l.quiz.question);
			expect(fast.concept).toBe(l.quiz.answer);
			expect(fast.fast_check?.options).toEqual([
				l.quiz.answer,
				l.quiz.wrong[0],
			]);
			expect(fast.fast_check?.correct_index).toBe(0);
			expect(recall.tier).toBe("tier2_synthesis");
			expect(recall.sample_solution?.length).toBeGreaterThan(20);
			for (const i of atom.practice_items) {
				expect(i.source_link).toBe(
					`https://academy.zam-os.org/deutsch-gymnasium-5/#lesson=${l.id}`,
				);
				expect(i.question).not.toMatch(/<\/?\w|\*\*|\\(?:frac|text|begin)\b/);
			}
			expect(
				atom.curricula
					.filter((c) => c.provider === "lehrplanplus-bayern")
					.map((c) => c.topic_code),
			).toEqual([...new Set(l.bindings.map((b) => `lb${b[0]}`))].sort());
			for (const binding of atom.curricula.filter(
				(c) => c.provider === "lehrplanplus-bayern",
			))
				expect(binding).toMatchObject({
					school_type: "gymnasium",
					subject: "deutsch",
					grade: 5,
				});
			for (const id of l.sourceIds)
				expect(SOURCES.some((s) => s.id === id)).toBe(true);
			for (const p of atom.prerequisites)
				expect(cell.atoms.some((a) => a.id === p.atom_id)).toBe(true);
		},
	);
	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s has an accessible, lesson-specific explorable diagram",
		(_, l) => {
			expect(l.visual.steps).toHaveLength(3);
			expect(new Set(l.visual.steps.map((s) => s.text)).size).toBe(3);
			const html = renderVisual(l);
			expect(html).toContain('role="img"');
			expect(html.match(/data-visual-step=/g)).toHaveLength(3);
			expect(html.match(/aria-pressed="false"/g)).toHaveLength(3);
			expect(html).not.toMatch(/NaN|undefined|aria-pressed="true"/);
			for (const s of l.visual.steps)
				expect(s.detail.length).toBeGreaterThan(25);
		},
	);
	it("retains all six tenses, all four adverbial types and grade-appropriate grammar", () => {
		const text = (id: string) =>
			JSON.stringify(LESSONS.find((l) => l.id === id));
		for (const tense of [
			"Präsens",
			"Präteritum",
			"Perfekt",
			"Plusquamperfekt",
			"Futur I",
			"Futur II",
		])
			expect(text("d5-zeitformen")).toContain(tense);
		for (const type of [
			"Temporaladverbiale",
			"Lokaladverbiale",
			"Modaladverbiale",
			"Kausaladverbiale",
		])
			expect(text("d5-adverbiale")).toContain(type);
		for (const term of [
			"Konjunktion",
			"Subjunktion",
			"Präposition",
			"Numerale",
			"Deklination",
			"Komparation",
			"Konjugation",
		])
			expect(text("d5-wortarten")).toContain(term);
		expect(text("d5-pronomen")).not.toContain("Relativsatz");
		expect(text("d5-gross-und-s")).not.toContain("das/dass");
		expect(text("d5-silbentrennung")).toContain("ba-cken");
	});
	it("bundles matching listening passages with optional transcripts", () => {
		for (const id of ["d5-zuhoeren", "d5-fabelhoeren"]) {
			const l = LESSONS.find((l) => l.id === id);
			if (!l) throw new Error(`Missing listening lesson ${id}`);
			const html = renderMaterial(l);
			expect(html).toContain("<audio controls");
			expect(html).toContain("<details>");
			expect(html).toContain(esc(l.material));
		}
		expect(LESSONS.find((l) => l.id === "d5-fabelhoeren")?.material).toContain(
			"Die Maus und das Blatt",
		);
	});
});

describe("Learner boundaries", () => {
	it("treats a character threshold as access to a rubric, never a quality grade", () => {
		expect(canReview("kurz")).toBe(false);
		expect(
			canAccept("Ein ausreichend langer Entwurf.", [true, true, false]),
		).toBe(false);
		expect(
			canAccept("Ein ausreichend langer Entwurf.", [true, true, true]),
		).toBe(true);
	});
	it("invalidates both completion and stale confirmations after editing", () => {
		const p = freshProgress(),
			l = LESSONS[0],
			key = writingKey(l.id, 1);
		p.quizDone = [l.id];
		p.cases[l.id] = l.cases.map((c) => c.answer);
		p.drafts[key] = "Ein längerer geprüfter eigener Entwurf.";
		p.writingDone = [key];
		expect(isComplete(p, l.id)).toBe(true);
		expect(isComplete(p, l.id, 2)).toBe(false);
		updateDraft(p, l.id, 1, "Ein anderer Entwurf mit neuen Aussagen.");
		expect(isComplete(p, l.id)).toBe(false);
		expect(completion(p).completed).toBe(0);
	});
	it("recovers from corrupt or unavailable storage", async () => {
		expect(parseProgress("{broken")).toEqual(freshProgress());
		expect(parseProgress('{"quizDone":["unknown"],"level":99}')).toEqual(
			freshProgress(),
		);
		vi.stubGlobal("localStorage", {
			getItem() {
				throw new Error("blocked");
			},
			setItem() {
				throw new Error("blocked");
			},
		});
		expect(loadProgress()).toEqual(freshProgress());
		expect(await saveProgress(freshProgress())).toBe(false);
		vi.unstubAllGlobals();
	});
	it("escapes learner content and normalises only harmless input differences", () => {
		expect(esc('<script>"&</script>')).toBe(
			"&lt;script&gt;&quot;&amp;&lt;/script&gt;",
		);
		expect(normalise("  Drei   Wörter! ")).toBe("drei wörter");
	});
	it("supports stable lesson links and rejects invalid levels", () => {
		expect(parseTrainingDeepLink("#lesson=d5-fabel&level=2")).toMatchObject({
			lessonId: "d5-fabel",
			level: 2,
		});
		expect(
			parseTrainingDeepLink("#lesson=d5-fabel&level=99").level,
		).toBeUndefined();
		expect(
			trainingBaseUrl("/deutsch-gymnasium-5/", "?lesson=old&level=1&from=zam"),
		).toBe("/deutsch-gymnasium-5/?from=zam");
	});
});
