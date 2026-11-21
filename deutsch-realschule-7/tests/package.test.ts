import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import publication from "../publication.json";
import sources from "../source-checks.json";
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
	caseOptions,
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
import official from "./fixtures/official-d7.json";
import contract from "./fixtures/public-contract.json";
import inhaltsangabeCell from "./fixtures/de-by-realschule-7-deutsch-inhaltsangabe-sachtexte-literatur-kvt.json";
import satzstrukturenCell from "./fixtures/de-by-realschule-7-deutsch-satzstrukturen-adverbialsaetze-kommasetzung-kvt.json";

const items = cell.atoms.flatMap((a) => a.practice_items);
const lesson = (slug: string) => {
	const found = LESSONS.find((l) => l.id === `d7-${slug}`);
	if (!found) throw new Error(`Missing lesson ${slug}`);
	return found;
};

describe("Grade 7 Realschule package contract", () => {
	it("pins new ULIDs, lesson anchors, independent storage and ready publication", () => {
		expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(50);
		expect(cell.atoms).toHaveLength(50);
		expect(items).toHaveLength(100);
		const entries = cell.atoms.flatMap((a) => [a, ...a.practice_items]);
		expect(new Set(entries.map((e) => e.id)).size).toBe(150);
		expect(Object.fromEntries(entries.map((e) => [e.slug, e.id]))).toEqual(
			contract.ids,
		);
		for (const e of entries)
			expect(e.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual([10, 14, 10, 16]);
		expect(publication).toMatchObject({
			schema: 1,
			status: "ready",
			version: "0.1",
		});
		expect(STORAGE_KEY).toContain("deutsch_rs7");
		expect(STORAGE_KEY).not.toMatch(/gym|rs5|rs6|mittelschule/);
	});

	it("maps all 57 verbatim expectations and qualifies activities outside the app", () => {
		expect(coverage.rows).toHaveLength(57);
		expect(coverage.curriculum).toBe(official.source);
		expect(coverage.curriculum_sha256).toBe(official.html_sha256);
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
		for (const id of [
			"1.1.1",
			"1.1.2",
			"1.2.1",
			"1.3.2",
			"1.4.1",
			"2.2.8",
			"2.4.1",
			"2.4.2",
			"3.1.1",
			"3.3.2",
		])
			expect(coverage.rows.find((r) => r.id === id)?.status).toBe("supported");
		expect(coverage.neighbours.map((n) => n.grade)).toEqual([6, 8]);
	});

	it("moves four approved histories and keeps the other six legacy cards active", () => {
		const old: Array<{ id: string }> = [];
		for (const tile of [inhaltsangabeCell, satzstrukturenCell])
			for (const atom of tile.atoms)
				for (const item of atom.practice_items) old.push(item);
		expect(old).toHaveLength(10);
		expect(mapping.status).toBe("approved");
		expect(mapping.approved).toBe("2026-11-21");
		expect(mapping.rows.map((r) => r.de_by_id).sort()).toEqual(
			old.map((i) => i.id).sort(),
		);
		expect(new Set(mapping.rows.map((r) => r.de_by_id)).size).toBe(10);
		expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(4);
		expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(6);
		for (const row of mapping.rows) {
			expect(row.reason.length).toBeGreaterThan(40);
			expect(row.action).toBe(
				row.category === "A" ? "replace" : "keep-active",
			);
			if (row.academy_slug)
				expect(items.filter((i) => i.slug === row.academy_slug)).toHaveLength(
					1,
				);
			if (row.category === "C") expect(row).not.toHaveProperty("academy_slug");
		}
		expect(cell).not.toHaveProperty("retired_items");
		for (const i of items) {
			const row = mapping.rows.find((candidate) => candidate.academy_slug === i.slug);
			if (row?.category === "A") expect(i).toMatchObject({ replaces: [row.de_by_id] });
			else expect(i).not.toHaveProperty("replaces");
			expect(old.some((o) => o.id === i.id)).toBe(false);
		}
	});

	it.each(LESSONS.map((l) => [l.id, l] as const))(
		"%s has coherent examples, two tasks, curated distractors and reachable case goals",
		(_, l) => {
			expect(l.paragraphs.length).toBeGreaterThanOrEqual(2);
			expect(l.material.length).toBeGreaterThan(60);
			expect(l.takeaway.length).toBeGreaterThan(35);
			expect(l.lehrplan).toContain("D7 ·");
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
			for (const [index, c] of l.cases.entries()) {
				const rendered = caseOptions(l, index);
				expect(rendered).toContain(c.answer);
				expect(new Set(rendered).size).toBe(c.options.length);
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
					`https://academy.zam-os.org/deutsch-realschule-7/#lesson=${l.id}`,
				);
				expect(i.question).not.toMatch(/<\/?\w|\*\*|\\(?:frac|text|begin)\b/);
				expect(i.question).not.toMatch(/\d\.\d/);
				expect(i.concept).not.toMatch(/\d\.\d/);
				expect(i.choice_distractors).toHaveLength(2);
				for (const d of i.choice_distractors ?? []) {
					expect(d.reason.length).toBeGreaterThan(25);
				}
			}
			const bindings = atom.curricula.filter(
				(c) => c.provider === "lehrplanplus-bayern",
			);
			expect(bindings.map((c) => c.topic_code)).toEqual(
				[...new Set(l.bindings.map((b) => `lb${b[0]}`))].sort(),
			);
			for (const b of bindings) {
				expect(b).toMatchObject({
					school_type: "realschule",
					grade: 7,
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
		expect(models).toHaveLength(16);
		expect(models.map((l) => l.id)).toEqual(
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
		expect(SOURCES.map((s) => s.url)).toEqual(sources.map((s) => s.url));
		for (const source of sources) {
			expect(source.title.length).toBeGreaterThan(8);
			expect(source.checked).toBe("2026-11-20");
			expect(source.sha256).toMatch(/^[a-f0-9]{64}$/);
		}
		for (const id of ["notizen-debatte", "hoerbeitrag-gestaltung"]) {
			const l = lesson(id);
			const html = renderMaterial(l);
			expect(html).toContain("<audio controls");
			expect(html).toContain("<details>");
			expect(html).toContain(esc(l.material));
			expect(html).toContain("Computerstimme");
		}
		expect(renderMaterial(lesson("diskontinuierliche-texte"))).toContain(
			'<th scope="col">Anteil</th>',
		);
	});

	it("retains the Grade 7 curriculum scope and explicit Grade 6 foundations", () => {
		const text = (id: string) => JSON.stringify(lesson(id));
		expect(text("gattungen-ballade")).toContain("Epik");
		expect(text("gattungen-ballade")).toContain("Lyrik");
		expect(text("gattungen-ballade")).toContain("Dramatik");
		expect(text("mittelalter-barock-gegenwart")).toContain("Mittelalter");
		expect(text("mittelalter-barock-gegenwart")).toContain("Barock");
		expect(text("buchrezension-leseportfolio")).toContain(
			"mindestens ein ganzes Kinder- oder Jugendbuch",
		);
		expect(text("indikativ-konjunktiv-rede")).toContain("Konjunktiv I");
		expect(text("indikativ-konjunktiv-rede")).toContain("Konjunktiv II");
		expect(text("kausal-temporalsaetze")).toContain("Kausalsatz");
		expect(text("kausal-temporalsaetze")).toContain("Temporalsatz");
		expect(text("modal-lokal-attributsaetze")).toContain("Modalsatz");
		expect(text("modal-lokal-attributsaetze")).toContain("Lokalsatz");
		expect(text("modal-lokal-attributsaetze")).toContain("Attributsatz");
		expect(text("das-oder-dass")).toContain("dieses");
		expect(text("das-oder-dass")).toContain("jenes");
		expect(text("das-oder-dass")).toContain("welches");
		expect(text("gross-kleinschreibung")).toContain("Heute Morgen");
		expect(text("gross-kleinschreibung")).toContain("morgens");
		expect(text("ober-unterbegriffe-d6")).toContain("Oberbegriffe");
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
		expect(
			parseTrainingDeepLink("#lesson=d7-gattungen-ballade&level=2"),
		).toMatchObject({
			lessonId: "d7-gattungen-ballade",
			level: 2,
		});
		expect(
			parseTrainingDeepLink("#lesson=d7-gattungen-ballade&level=99").level,
		).toBeUndefined();
		expect(
			trainingBaseUrl("/deutsch-realschule-7/", "?lesson=old&level=1&from=zam"),
		).toBe("/deutsch-realschule-7/?from=zam");
	});

	it("varies case option positions so no fixed-position strategy passes", () => {
		const positions = LESSONS.flatMap((l) =>
			l.cases.map((c, index) => caseOptions(l, index).indexOf(c.answer)),
		);
		expect(positions.filter((pos) => pos === 0).length).toBeGreaterThan(0);
		expect(positions.filter((pos) => pos === 1).length).toBeGreaterThan(0);
		for (const pattern of [
			[0, 0],
			[1, 1],
			[0, 1],
			[1, 0],
		] as const) {
			const passing = LESSONS.filter((l) => {
				const chosen = l.cases.map(
					(_, index) => caseOptions(l, index)[pattern[index]],
				);
				return checkCases(l.cases, chosen).every(Boolean);
			});
			expect(passing.length).toBeLessThan(LESSONS.length);
		}
	});
});
