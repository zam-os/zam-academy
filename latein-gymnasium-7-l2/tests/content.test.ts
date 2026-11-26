import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import legacyCell from "./fixtures/de-by-gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen-kvt.json";
import contract from "./fixtures/public-contract.json";
import {
	CORE_LESSONS,
	findLesson,
	LESSONS,
	SOURCES,
	STAGES,
} from "../src/curriculum";
import { renderExplorerDiagram } from "../src/diagrams";
import { heroBannerSvg, stageIconSvg } from "../src/icons";
import {
	consecutioSample,
	CURSUS_TIERS,
	EPOCH_STOPS,
	PAENULTIMA_WORDS,
	PASSIVE_SAMPLES,
	renderMediterraneanMap,
	romanBreakdown,
	romanLatinHint,
	timelineSample,
	toRoman,
} from "../src/models";
import {
	canAccept,
	canReview,
	checkPractice,
	normalise,
	practiceFeedback,
	quizFeedback,
	quizOptions,
} from "../src/practice";
import { workshopGoals } from "../src/workshop";
import {
	lessonLink,
	parseTrainingDeepLink,
	trainingBaseUrl,
	ZAM_CELL_ID,
} from "../src/zam/zam-link";

const items = cell.atoms.flatMap((a) => a.practice_items);

describe("Latein 7 (2. Fremdsprache) Gymnasium teaching contract", () => {
	it("has eight stages of five lessons, 120 workshop goals and 120 ZAM cards", () => {
		expect(LESSONS).toHaveLength(40);
		expect(CORE_LESSONS).toHaveLength(40);
		expect(
			STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length),
		).toEqual(Array(8).fill(5));
		expect(cell.atoms).toHaveLength(40);
		expect(items).toHaveLength(120);
		for (const stage of STAGES) {
			expect(stageIconSvg(stage.id)).toContain("<svg");
		}
		expect(heroBannerSvg()).toContain("<svg");
	});

	it.each(LESSONS)(
		"has substantial teaching, interactive SVG diagram, feedback and distinct tasks: $id",
		(l) => {
			expect(l.id).toMatch(/^l7-[a-z-]+$/);
			expect(l.paragraphs).toHaveLength(2);
			expect(l.paragraphs.join(" ").length).toBeGreaterThan(420);
			expect(l.diagram.parts).toHaveLength(3);
			expect(renderExplorerDiagram(l.diagram)).toContain("<svg");
			for (const part of l.diagram.parts) {
				expect(part.tag.length).toBeGreaterThan(2);
				expect(part.title.length).toBeGreaterThan(3);
				expect(part.formula.length).toBeGreaterThan(3);
				expect(part.note.length).toBeGreaterThan(25);
			}
			expect(l.material.length).toBeGreaterThan(90);
			expect(["la", "de"]).toContain(l.materialLanguage);
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
				expect(t.model.length).toBeGreaterThan(40);
				expect(t.prompt.length).toBeGreaterThan(35);
			}
			for (const id of l.sourceIds)
				expect(SOURCES.some((s) => s.id === id)).toBe(true);
			expect(JSON.stringify(l)).not.toMatch(
				/<script|<p>|<div>|\\\\\(|teacherVideo/,
			);
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

	it("maps every LehrplanPLUS L7 competence and every lesson, with honest limits", () => {
		expect(coverage.rows).toHaveLength(51);
		expect(new Set(coverage.rows.map((r) => r.id)).size).toBe(51);
		const mapped = new Set(coverage.rows.flatMap((r) => r.lessons));
		for (const l of LESSONS) expect(mapped.has(l.id)).toBe(true);
		for (const r of coverage.rows) {
			expect(["supported", "implemented"]).toContain(r.status);
			expect(r.evidence.length).toBeGreaterThan(40);
			for (const id of r.lessons) expect(findLesson(id)).toBeDefined();
		}
		for (const id of ["L7-04", "L7-05", "L7-07", "L7-27", "L7-45", "L7-51"]) {
			expect(coverage.rows.find((r) => r.id === id)?.status).toBe("supported");
		}
		expect(coverage.neighbours.next.boundary).toContain("deponents");
		expect(
			LESSONS.some((l) => /Gerundiv|Deponens|Hortativ|NcI/.test(l.title)),
		).toBe(false);
	});
});

describe("interactive SVG models", () => {
	it("decomposes every integer from 1 to 1000 into valid Roman numerals", () => {
		for (let n = 1; n <= 1000; n++) {
			const parts = romanBreakdown(n);
			expect(parts.reduce((sum, p) => sum + p.value, 0)).toBe(n);
			expect(toRoman(n)).toMatch(/^[IVXLCDM]+$/);
			expect(romanLatinHint(n).length).toBeGreaterThan(10);
		}
		expect(toRoman(4)).toBe("IV");
		expect(toRoman(9)).toBe("IX");
		expect(toRoman(44)).toBe("XLIV");
		expect(toRoman(218)).toBe("CCXVIII");
		expect(toRoman(490)).toBe("CDXC");
		expect(toRoman(749)).toBe("DCCXLIX");
		expect(toRoman(940)).toBe("CMXL");
		expect(toRoman(1000)).toBe("M");
	});

	it("provides complete passive, timeline, consecutio, paenultima, map, epochs and cursus models", () => {
		expect(Object.keys(PASSIVE_SAMPLES)).toHaveLength(6);
		for (const sample of Object.values(PASSIVE_SAMPLES)) {
			expect(sample.passiveSentence).toContain("ā magistrō");
			expect(sample.passiveDe).not.toMatch(/undefined|NaN/);
		}
		for (const kind of ["aci", "pc", "ablabs"] as const)
			for (const main of ["praesens", "perfekt"] as const)
				for (const rel of ["gleichzeitig", "vorzeitig"] as const) {
					const entry = timelineSample(kind, main, rel);
					expect(entry.latin.length).toBeGreaterThan(10);
					expect(entry.german.length).toBeGreaterThan(15);
				}
		for (const group of ["haupt", "neben"] as const)
			for (const rel of ["gleichzeitig", "vorzeitig"] as const)
				for (const voice of ["aktiv", "passiv"] as const) {
					const cellSample = consecutioSample(group, rel, voice);
					expect(cellSample.latin).toContain("cūr");
					expect(cellSample.german).toContain("warum");
				}
		expect(PAENULTIMA_WORDS).toHaveLength(6);
		for (const w of PAENULTIMA_WORDS) {
			expect(w.stressedIndex).toBeGreaterThanOrEqual(0);
			expect(w.stressedIndex).toBeLessThan(w.syllables.length);
		}
		const map = renderMediterraneanMap();
		for (const token of [
			"Cambodunum",
			"Karthago",
			"Theben",
			"Syrakus",
			"SICILIA",
			"CRETA",
			"RAETIA",
			"1 Gizeh",
			"2 Babylon",
			"3 Olympia",
			"4 Ephesos",
			"5 Halikarnassos",
			"6 Rhodos",
			"7 Pharos",
		]) {
			expect(map).toContain(token);
		}
		expect(EPOCH_STOPS).toHaveLength(4);
		expect(CURSUS_TIERS).toHaveLength(4);
	});
});

describe("answer normalisation and deep links", () => {
	it("folds Latin macrons while keeping German umlauts and rejecting empty drafts", () => {
		expect(normalise("Dēfenditur.")).toBe("defenditur");
		expect(normalise("RĒ PŪBLICĀ!")).toBe("re publica");
		expect(normalise("Prädikativum")).toBe("prädikativum");
		expect(canReview(" ".repeat(80))).toBe(false);
		expect(canAccept("Eine sorgfältige Übersetzung.", [true, true, false])).toBe(
			false,
		);
		expect(canAccept("Eine sorgfältige Übersetzung.", [true, true, true])).toBe(
			true,
		);
	});

	it("keeps deep links for all 40 lessons and both levels valid", () => {
		for (const l of LESSONS)
			for (const level of [1, 2])
				expect(parseTrainingDeepLink(`#lesson=${l.id}&level=${level}`)).toEqual(
					{ lessonId: l.id, level },
				);
		expect(trainingBaseUrl("/app/", "?lesson=l7-irrealis&level=2&keep=1")).toBe(
			"/app/?keep=1",
		);
	});
});

describe("ZAM cell, identifier contract and proposal-only legacy mapping", () => {
	it("pins all 160 ULIDs and enforces proposal-only mapping without replaces", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
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
		expect(new Set(ids).size).toBe(160);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);

		const legacyIds = legacyCell.atoms
			.flatMap((a) => a.practice_items)
			.map((i) => i.id);
		expect(mapping.rows.map((r) => r.legacy_item_id).sort()).toEqual(
			legacyIds.sort(),
		);
		const allSlugs = items.map((i) => i.slug);
		for (const row of mapping.rows) {
			if (row.action === "propose-replace-after-approval") {
				expect(allSlugs.filter((s) => s === row.academy_slug)).toHaveLength(1);
			} else {
				expect(row.action).toBe("keep-active");
				expect(row.academy_slug).toBeNull();
			}
		}
	});

	it.each(cell.atoms)(
		"links only to real lessons and grade 7 Latin curriculum: $slug",
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
			}
			for (const d of a.prerequisites)
				expect(cell.atoms.some((other) => other.id === d.atom_id)).toBe(true);
			for (const item of a.practice_items) {
				expect(item.source_link).toBe(lessonLink(l.id));
				expect(item.question.length).toBeGreaterThan(15);
				expect(item.concept.length).toBeGreaterThan(3);
				if (item.fast_check) {
					expect(item.fast_check.options).toHaveLength(2);
					expect(item.fast_check.correct_index).toBe(0);
					expect(item.fast_check.options[0]).toBe(item.concept);
				} else {
					expect(item.sample_solution).toBe(item.concept);
				}
			}
		},
	);
});
