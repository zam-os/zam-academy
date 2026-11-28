import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import publication from "../publication.json";
import sourceChecks from "../source-checks.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { renderMaterial } from "../src/material";
import {
	caseOptions,
	checkCases,
	canReview,
	quizOptions,
} from "../src/practice";
import { STORAGE_KEY } from "../src/storage/progress";
import {
	ZAM_CELL_ID,
	lessonLink,
	parseTrainingDeepLink,
} from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-gymnasium-8-deutsch-eroerterung-drama-novelle-textanalyse-kvt.json";
import contract from "./fixtures/public-contract.json";

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const byId = new Map(LESSONS.map((lesson) => [lesson.id, lesson]));

describe("Grade 8 Gymnasium package", () => {
	it("pins the public lesson and card identifiers and an independent storage namespace", () => {
		expect(LESSONS.map((lesson) => lesson.id)).toEqual(contract.lessons);
		expect(LESSONS).toHaveLength(42);
		expect(items).toHaveLength(84);
		const entries = [...cell.atoms, ...items];
		expect(new Set(entries.map((entry) => entry.id)).size).toBe(126);
		expect(
			entries.every((entry) => /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(entry.id)),
		).toBe(true);
		expect(
			Object.fromEntries(entries.map((entry) => [entry.slug, entry.id])),
		).toEqual(contract.ids);
		expect(publication).toMatchObject({
			schema: 1,
			status: "ready",
			version: "0.0",
		});
		expect(STORAGE_KEY).toBe("deutsch_gym8_progress_v1");
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
	});

	it("maps each expectation bidirectionally and binds the MuG profile to its track", () => {
		expect(coverage.rows).toHaveLength(48);
		expect(
			coverage.rows.filter((row) => row.status === "supported"),
		).toHaveLength(18);
		expect(coverage.areas.map(({ lb, hours }) => [lb, hours])).toEqual(
			[1, 2, 3, 4, 5].map((lb) => [lb, null]),
		);
		expect(
			STAGES.map(
				(stage) => LESSONS.filter((lesson) => lesson.stage === stage.id).length,
			),
		).toEqual([6, 11, 10, 11, 4]);
		expect(new Set(coverage.rows.flatMap((row) => row.lessons))).toEqual(
			new Set(byId.keys()),
		);
		for (const row of coverage.rows) {
			expect(row.lessons.length).toBeGreaterThan(0);
			expect(row.evidence.length).toBeGreaterThan(60);
			for (const id of row.lessons)
				expect(byId.get(id)?.bindings).toContain(row.section);
			expect(row.track).toBe(row.lb === 5 ? "MuG" : undefined);
		}
		for (const [index, lesson] of LESSONS.entries()) {
			const atom = cell.atoms[index];
			expect(atom.slug).toBe(lesson.id);
			const binding = atom.curricula.find(
				(c) => c.provider === "lehrplanplus-bayern",
			);
			const stage = STAGES.findIndex((stage) => stage.id === lesson.stage) + 1;
			expect(binding).toMatchObject({
				school_type: "gymnasium",
				grade: 8,
				subject: "deutsch",
				topic_code: `lb${stage}`,
			});
			expect(binding && "track" in binding ? binding.track : undefined).toBe(
				stage === 5 ? "MuG" : undefined,
			);
			expect(lesson.tracks).toEqual(stage === 5 ? ["MuG"] : undefined);
			for (const prerequisite of atom.prerequisites) {
				const parent = cell.atoms.findIndex(
					(candidate) => candidate.id === prerequisite.atom_id,
				);
				expect(parent).toBeGreaterThanOrEqual(0);
				expect(parent).toBeLessThan(index);
			}
		}
		expect(coverage.neighbours.map(({ grade }) => grade)).toEqual([7, 9]);
	});

	it("keeps the four legacy cards inventoried as a proposal with no active migration", () => {
		const old = legacy.atoms.flatMap<{ id: string }>(
			(atom) => atom.practice_items,
		);
		expect(mapping).toMatchObject({ status: "proposal-only", approved: null });
		expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
			old.map((item) => item.id).sort(),
		);
		expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(1);
		expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(3);
		for (const row of mapping.rows) {
			expect(row.reason.length).toBeGreaterThan(40);
			if (row.category === "A") {
				expect(row.action).toBe("propose-replace-after-approval");
				expect(
					items.filter((item) => item.slug === row.academy_slug),
				).toHaveLength(1);
			} else {
				expect(row.action).toBe("keep-active");
				expect(row).not.toHaveProperty("academy_slug");
			}
		}
		expect(cell).not.toHaveProperty("retired_items");
		for (const item of items) {
			expect(item).not.toHaveProperty("replaces");
			expect(old.some(({ id }) => id === item.id)).toBe(false);
		}
	});

	it.each(LESSONS)(
		"$id has a worked example, solvable cases and two different tasks",
		(lesson) => {
			expect(lesson.paragraphs).toHaveLength(2);
			expect(lesson.material.length).toBeGreaterThan(60);
			expect(lesson.takeaway.length).toBeGreaterThan(35);
			expect(lesson.cases).toHaveLength(2);
			expect(checkCases(lesson.cases, [])).toEqual([false, false]);
			expect(
				checkCases(
					lesson.cases,
					lesson.cases.map((c) => c.answer),
				),
			).toEqual([true, true]);
			expect(
				checkCases(
					lesson.cases,
					lesson.cases.map((c) => c.options[1]),
				),
			).toEqual([false, false]);
			for (const [index, item] of lesson.cases.entries()) {
				const options = caseOptions(lesson, index);
				expect(new Set(options).size).toBe(3);
				expect(options).toContain(item.answer);
				expect(item.feedback.length).toBeGreaterThan(20);
			}
			expect(new Set(quizOptions(lesson)).size).toBe(3);
			expect(quizOptions(lesson)).toContain(lesson.quiz.answer);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
			expect(lesson.tasks[1].criteria).not.toEqual(lesson.tasks[2].criteria);
			for (const level of [1, 2] as const) {
				expect(new Set(lesson.tasks[level].criteria).size).toBe(3);
				expect(canReview(lesson.tasks[level].model)).toBe(true);
			}

			const atom = cell.atoms.find(({ slug }) => slug === lesson.id);
			expect(atom?.practice_items).toHaveLength(2);
			if (!atom) throw new Error("Missing atom");
			const [fast, recall] = atom.practice_items;
			expect(fast).toMatchObject({
				tier: "tier1_fast",
				question: lesson.quiz.question,
				concept: lesson.quiz.answer,
				fast_check: {
					options: [lesson.quiz.answer, lesson.quiz.wrong[0]],
					correct_index: 0,
				},
			});
			expect(recall.tier).toBe("tier2_synthesis");
			expect(recall.sample_solution?.length).toBeGreaterThan(35);
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(lessonLink(lesson.id));
				expect(parseTrainingDeepLink(new URL(item.source_link).hash)).toEqual({
					lessonId: lesson.id,
				});
				expect(item.question + item.concept).not.toMatch(/<\/?\w|\*\*|\d\.\d/);
			}
		},
	);

	it("lists only checked sources and renders four local audio tracks and accessible text", () => {
		for (const source of SOURCES)
			expect(sourceChecks.find(({ id }) => id === source.id)).toMatchObject({
				url: source.url,
				title: expect.any(String),
				sha256: expect.stringMatching(/^[a-f0-9]{64}$/),
			});
		for (const lesson of LESSONS)
			for (const id of lesson.sourceIds)
				expect(SOURCES.some((source) => source.id === id)).toBe(true);
		const material = LESSONS.map(renderMaterial).join("\n");
		expect(material.match(/<audio controls/g)).toHaveLength(4);
		expect(
			material.match(/<summary>Hörtext anzeigen<\/summary>/g),
		).toHaveLength(2);
		expect(material).toContain("Variante B · Motor und Pause");
	});
});
