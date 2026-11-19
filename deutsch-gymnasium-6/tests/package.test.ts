import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import publication from "../publication.json";
import sourceChecks from "../source-checks.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { renderMaterial } from "../src/material";
import {
	exploredGoals,
	modelBlocks,
	renderLanguageModel,
} from "../src/language-model";
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
	STORAGE_KEY,
} from "../src/storage/progress";
import { renderVisual } from "../src/visuals";
import { parseTrainingDeepLink, trainingBaseUrl } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";
import legacy from "./fixtures/de-by-gymnasium-7-deutsch-konjunktiv-indirekte-rede-passiv-syntax-kvt.json";

const items = cell.atoms.flatMap((a) => a.practice_items);
const lesson = (slug: string) => {
	const found = LESSONS.find((l) => l.id === `d6-${slug}`);
	if (!found) throw new Error(`Missing lesson ${slug}`);
	return found;
};

describe("Grade 6 Gymnasium package contract", () => {
	it("pins new ULIDs, lesson anchors, independent storage and local-only publication", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(49);
		expect(cell.atoms).toHaveLength(49);
		expect(items).toHaveLength(98);
		const entries = cell.atoms.flatMap((a) => [a, ...a.practice_items]);
		expect(new Set(entries.map((e) => e.id)).size).toBe(147);
		expect(Object.fromEntries(entries.map((e) => [e.slug, e.id]))).toEqual(
			contract.ids,
		);
		for (const e of entries)
			expect(e.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual([8, 12, 8, 21]);
		expect(publication).toMatchObject({ schema: 1, status: "local-only" });
		expect(STORAGE_KEY).toContain("deutsch_gym6");
		expect(STORAGE_KEY).not.toMatch(/rs6|rs5|mittelschule/);
	});
	it("maps all 42 expectations and qualifies activities outside the app", () => {
		expect(coverage.rows).toHaveLength(42);
		expect(coverage.curriculum).toBe(SOURCES[0].url);
		expect(coverage.curriculum_sha256).toMatch(/^[a-f0-9]{64}$/);
		expect(new Set(coverage.rows.map((row) => row.id)).size).toBe(42);
		expect(coverage.areas).toEqual([1, 2, 3, 4].map((lb) => ({ lb, hours: null })));
		expect(coverage.optional_lessons).toEqual([]);
		expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(
			new Set(LESSONS.map((l) => l.id)),
		);
		for (const row of coverage.rows) {
			expect(row.lessons.length).toBeGreaterThan(0);
			expect(row.evidence.length).toBeGreaterThan(70);
			for (const id of row.lessons)
				expect(LESSONS.find((l) => l.id === id)?.bindings).toContain(
					row.section,
				);
			expect(["implemented", "supported"]).toContain(row.status);
		}
		for (const id of ["1.1.1", "1.2.1", "1.2.3", "1.3.2", "1.4.1", "2.2.6", "2.4.1", "3.1.3", "3.3.2"])
			expect(coverage.rows.find((r) => r.id === id)?.status).toBe("supported");
		expect(coverage.neighbours.map((n) => n.grade)).toEqual([5, 7]);
	});
	it("accounts for every item in the overlapping D7 tile while preserving its review state", () => {
		const old = legacy.atoms.flatMap<{ id: string }>((atom) => atom.practice_items);
		expect(old).toHaveLength(4);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.rows.map((r) => r.old_id).sort()).toEqual(old.map((i) => i.id).sort());
		for (const row of mapping.rows) {
			expect(row).toMatchObject({ category: "C", action: "keep-active" });
			expect(row.reason.length).toBeGreaterThan(40);
			expect(row).not.toHaveProperty("academy_slug");
		}
		expect(cell).not.toHaveProperty("retired_items");
		for (const i of items) {
			expect(i).not.toHaveProperty("replaces");
			expect(old.some((o) => o.id === i.id)).toBe(false);
		}
	});
	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s has coherent examples, two tasks and reachable case goals",
		(_, l) => {
			expect(l.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(l.material.length).toBeGreaterThan(60);
			expect(l.takeaway.length).toBeGreaterThan(35);
			expect(l.lehrplan).toContain("D6 ·");
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
				expect(c.feedback.length).toBeGreaterThan(30);
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
			if (!atom) throw new Error("Missing atom");
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
			expect(recall.sample_solution?.length).toBeGreaterThan(35);
			for (const i of atom.practice_items) {
				expect(i.source_link).toBe(
					`https://academy.zam-os.org/deutsch-gymnasium-6/#lesson=${l.id}`,
				);
				expect(i.question).not.toMatch(/<\/?\w|\*\*|\\(?:frac|text|begin)\b/);
				expect(i.question).not.toMatch(/\d\.\d/);
			}
			const bindings = atom.curricula.filter(
				(c) => c.provider === "lehrplanplus-bayern",
			);
			expect(bindings.map((c) => c.topic_code)).toEqual(
				[...new Set(l.bindings.map((b) => `lb${b[0]}`))].sort(),
			);
			for (const b of bindings) {
				expect(b).toMatchObject({
					school_type: "gymnasium",
					grade: 6,
					subject: "deutsch",
				});
				expect(b).not.toHaveProperty("track");
			}
			for (const id of l.sourceIds)
				expect(SOURCES.some((s) => s.id === id)).toBe(true);
			for (const p of atom.prerequisites) {
				expect(p.type).toBe("soft");
				expect(cell.atoms.some((a) => a.id === p.atom_id)).toBe(true);
			}
		},
	);
	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s has three explorable visual goals",
		(_, l) => {
			expect(l.visual.steps).toHaveLength(3);
			expect(new Set(l.visual.steps.map((s) => s.text)).size).toBe(3);
			const html = renderVisual(l);
			expect(html).toContain('role="img"');
			expect(html.match(/data-visual-step=/g)).toHaveLength(3);
			expect(html.match(/aria-pressed="false"/g)).toHaveLength(3);
			expect(html.match(/data-model-reached="false"/g)).toHaveLength(3);
			expect(html).not.toMatch(/NaN|undefined|aria-pressed="true"/);
			for (const step of l.visual.steps)
				expect(step.detail.length).toBeGreaterThan(30);
		},
	);
	it("changes visible grammatical content in every language model", () => {
		const models = LESSONS.filter((l) => l.visual.initial);
		expect(models).toHaveLength(29);
		expect(models.filter((l) => l.stage === "sprache").map((l) => l.id)).toEqual(
			LESSONS.filter((l) => l.stage === "sprache").map((l) => l.id),
		);
		for (const l of models) {
			const initial = JSON.stringify(modelBlocks(l, -1));
			expect(modelBlocks(l, -1).length).toBeGreaterThan(0);
			const variants = new Set<string>();
			for (let i = 0; i < 3; i++) {
				const state = modelBlocks(l, i);
				expect(state.length).toBeGreaterThan(0);
				expect(JSON.stringify(state)).not.toBe(initial);
				variants.add(JSON.stringify(state));
				expect(renderLanguageModel(l, i)).not.toMatch(/NaN|undefined/);
			}
			expect(variants.size).toBe(3);
		}
		expect(exploredGoals(new Set())).toEqual([false, false, false]);
		expect(exploredGoals(new Set([0, 1, 2]))).toEqual([true, true, true]);
	});
	it("keeps source links checked and listening transcripts available on demand", () => {
		expect(SOURCES.map((s) => s.url)).toEqual(sourceChecks.sources.map((s) => s.url));
		expect(SOURCES.map((s) => s.label)).toEqual(sourceChecks.sources.map((s) => s.title));
		expect(sourceChecks.checked).toBe("2026-11-19");
		for (const id of ["hoerbericht", "gedicht"]) {
			const l = lesson(id);
			const html = renderMaterial(l);
			expect(html).toContain("<audio controls");
			expect(html).toContain("<details>");
			expect(html).toContain(esc(l.material));
			expect(html).toContain("Computerstimme");
		}
		expect(renderMaterial(lesson("diskontinuierlich"))).toContain(
			'<th scope="col">Museum an</th>',
		);
	});
	it("retains the grade-specific scope and avoids blanket grammar rules", () => {
		const text = (id: string) => JSON.stringify(lesson(id));
		for (const t of [
			"Präsens",
			"Präteritum",
			"Perfekt",
			"Plusquamperfekt",
			"Futur I",
			"Futur II",
		])
			expect(text("zeitformen")).toContain(t);
		for (const t of [
			"Temporaladverbiale",
			"Lokaladverbiale",
			"Modaladverbiale",
			"Kausaladverbiale",
		])
			expect(text("adverbiale")).toContain(t);
		expect(text("objekte")).toContain("Genitivobjekt");
		expect(text("objekte")).toContain("Präpositionalobjekt");
		expect(text("ganzschrift")).toContain("mindestens ein ganzes Buch");
		expect(text("ariadne")).toContain("Kreta");
		for (const clause of ["Temporalsatz", "Kausalsatz", "Finalsatz", "Modalsatz"])
			expect(text("adverbialsaetze")).toContain(clause);
		expect(text("subjekt-objektsatz")).toContain("Objektsatz");
		expect(text("praedikativ")).toContain("Prädikativ im Nominativ");
		expect(text("relativsaetze")).toContain("Kasus hängt von seiner Aufgabe im Relativsatz ab");
		expect(text("nominalisierung")).toContain("das neue Buch");
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
		expect(parseTrainingDeepLink("#lesson=d6-ariadne&level=2")).toMatchObject({
			lessonId: "d6-ariadne",
			level: 2,
		});
		expect(
			parseTrainingDeepLink("#lesson=d6-ariadne&level=99").level,
		).toBeUndefined();
		expect(
			trainingBaseUrl("/deutsch-gymnasium-6/", "?lesson=old&level=1&from=zam"),
		).toBe("/deutsch-gymnasium-6/?from=zam");
	});
});
