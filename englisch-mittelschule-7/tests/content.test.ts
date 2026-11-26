import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { CARD_COUNT, LESSONS, SOURCES, STAGES, findLesson, lessonsForTrack } from "../src/curriculum";
import { canAccept, canReview, checkPractice, isReferenceLanguageLesson, quizOptions } from "../src/practice";
import { renderWorkshop, workshopGoals } from "../src/workshop";
import { lessonLink, parseTrainingDeepLink, trainingBaseUrl, ZAM_CELL_ID } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const ULID = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const ids = LESSONS.map((lesson) => lesson.id);
const byId = (id: string) => {
	const lesson = findLesson(id);
	if (!lesson) throw new Error(`Missing lesson ${id}`);
	return lesson;
};

describe("Grade 7 English curriculum and practice", () => {
	it("offers five stages and the applicable lessons for each track", () => {
		expect(STAGES).toHaveLength(5);
		expect(new Set(ids).size).toBe(35);
		expect(lessonsForTrack("all")).toHaveLength(35);
		expect(lessonsForTrack("R")).toHaveLength(31);
		expect(lessonsForTrack("M")).toHaveLength(35);
		expect(LESSONS.filter((lesson) => !lesson.tracks.includes("R")).map((lesson) => lesson.id))
			.toEqual(["e7-mediation-en", "e7-notes-listening", "e7-units", "e7-word-parts"]);
	});

	it.each(LESSONS)("checks the worked example, choices, workshop and transfer of $id", (lesson) => {
		expect(STAGES.some(({ id }) => id === lesson.stage)).toBe(true);
		expect(lesson.sourceIds).toContain(lesson.tracks.includes("R") ? "r7" : "m7");
		expect(lesson.sourceIds.every((id) => SOURCES.some((source) => source.id === id && source.url.startsWith("https://")))).toBe(true);
		expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(120);
		expect(lesson.takeaway.length).toBeGreaterThan(30);
		expect(lesson.material.length).toBeGreaterThan(65);

		expect(quizOptions(lesson).sort()).toEqual([lesson.quiz.answer, ...lesson.quiz.wrong].sort());
		expect(new Set(quizOptions(lesson)).size).toBe(3);
		expect(lesson.quiz.explanation.length).toBeGreaterThan(20);
		expect(lesson.practice).toHaveLength(2);
		expect(checkPractice(lesson.practice, lesson.practice.map((item) => item.answers[0]))).toEqual([true, true]);
		expect(checkPractice(lesson.practice, ["unrelated", ""])).toEqual([false, false]);

		const goals = lesson.workshop.goals;
		expect(goals).toHaveLength(3);
		expect(workshopGoals(lesson.workshop, ["", "", ""])).toEqual([false, false, false]);
		for (const [index, goal] of goals.entries()) {
			expect(new Set(goal.options).size).toBe(3);
			expect(goal.options).toContain(goal.answer);
			expect(goal.explanation.length).toBeGreaterThan(18);
			const witness = ["", "", ""];
			witness[index] = goal.answer;
			expect(workshopGoals(lesson.workshop, witness).filter(Boolean)).toHaveLength(1);
		}
		expect(workshopGoals(lesson.workshop, goals.map((goal) => goal.answer))).toEqual([true, true, true]);
		expect(renderWorkshop(lesson)).toContain("0 von 3 Zielen erreicht");
		expect(lesson.tasks[1].prompt).not.toEqual(lesson.tasks[2].prompt);
		expect(lesson.tasks[1].model).not.toEqual(lesson.tasks[2].model);
		for (const task of Object.values(lesson.tasks)) {
			expect(task.criteria).toHaveLength(3);
			expect(canAccept(task.model, [true, true, true])).toBe(true);
		}
	});

	it("keeps Grade 7 intentions receptive and teaches the long adjective comparison", () => {
		const future = byId("e7-plans");
		expect(future.tasks[1].language).toBe("de");
		expect(future.tasks[2].language).toBe("de");
		expect(future.paragraphs[0]).toContain("Absicht");
		expect(byId("e7-comparison").material).toContain("more expensive than");
		expect(byId("e7-comparison").material).toContain("the most expensive");
		expect(isReferenceLanguageLesson(future)).toBe(true);
		expect(isReferenceLanguageLesson(byId("e7-dictionary"))).toBe(true);
		expect(isReferenceLanguageLesson(byId("e7-hobby-talk"))).toBe(false);
	});

	it("uses German decimal and minus typography and package-specific lesson identifiers", () => {
		for (const lesson of LESSONS) {
			const tasks = Object.values(lesson.tasks);
			const germanText = [
				...lesson.paragraphs,
				lesson.takeaway,
				lesson.materialLabel,
				...(lesson.materialLanguage === "de" ? [lesson.material] : []),
				lesson.quiz.explanation,
				...(lesson.quiz.optionLanguage === "de"
					? [lesson.quiz.question, lesson.quiz.answer, ...lesson.quiz.wrong]
					: []),
				...lesson.practice.map(({ feedback }) => feedback),
				...tasks.flatMap(({ prompt, criteria, language, model }) =>
					[prompt, ...criteria, ...(language === "de" ? [model] : [])]),
				...lesson.workshop.goals.flatMap(({ label, explanation }) => [label, explanation]),
			].join("\n");

			expect(germanText, lesson.id).not.toMatch(/\d\.\d|(?<![A-Za-z0-9])-\d/);
			expect(JSON.stringify(lesson), lesson.id).not.toMatch(/\be6m-|englisch-mittelschule-6|\bms6\b/);
		}
	});

	it("labels the map and timeline and accepts common input variants", () => {
		const map = renderWorkshop(byId("e7-island-ireland"));
		expect(map).toContain('class="map-pin map-belfast"');
		expect(map).toContain('class="map-pin map-dublin"');
		expect(map).toContain('class="map-label map-city-name">Belfast<');
		expect(map).toContain('class="map-label map-city-name">Dublin<');
		expect(map).toContain("Irische See");
		expect(map).toContain('data-map-focus="uk"');
		const timeline = renderWorkshop(byId("e7-perfect-form"));
		expect(timeline).toContain("time-focus");
		expect(timeline).toContain("Sam has written the title.");
		expect(checkPractice(byId("e7-advice").practice, [" TALK. ", "shouldn’t"])).toEqual([true, true]);
		expect(checkPractice(byId("e7-advice").practice, ["talk", "should not"])).toEqual([true, true]);
		expect(checkPractice(byId("e7-advice").practice, ["to talk", "should"])).toEqual([false, false]);
	});

	it("requires all three self-checks on a substantive answer", () => {
		expect(canReview("just a word")).toBe(false);
		expect(canAccept("An answer that is long enough", [true, false, true])).toBe(false);
		expect(canAccept("An answer that is long enough", [true, true, true])).toBe(true);
	});
});

describe("Academy cell contract", () => {
	it("pins atom and practice IDs and gives every card a source and a lesson", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(contract.tile_id).toBe(ZAM_CELL_ID);
		expect(cell.atoms.map((atom) => atom.slug)).toEqual(ids);
		const allIds = cell.atoms.flatMap((atom) => [atom.id, ...atom.practice_items.map((item) => item.id)]);
		expect(allIds.every((id) => ULID.test(id))).toBe(true);
		expect(new Set(allIds).size).toBe(allIds.length);
		expect(cell.atoms.reduce((sum, atom) => sum + atom.practice_items.length, 0)).toBe(CARD_COUNT);
		for (const [index, atom] of cell.atoms.entries()) {
			const url = lessonLink(atom.slug);
			expect(atom.source_link).toBe(url);
			expect(atom.atom_uri).toBe(`urn:zam:atom:${atom.id}`);
			expect(atom.prerequisites.every(({ atom_id }) => cell.atoms.some((entry) => entry.id === atom_id))).toBe(true);
			expect(contract.atoms[index]).toEqual({
				slug: atom.slug, id: atom.id,
				items: atom.practice_items.map(({ slug, id }) => ({ slug, id })),
			});
			const bindings = new Set(coverage.rows.filter((row) => row.lessons.includes(atom.slug))
				.map((row) => `${row.track}:lb${row.lb}`));
			expect(new Set(atom.curricula.filter((entry) => entry.provider === "lehrplanplus-bayern")
				.map((entry) => `${entry.track}:${entry.topic_code}`))).toEqual(bindings);
			for (const card of atom.practice_items) {
				expect(card.source_link).toBe(url);
				expect(card.question).not.toMatch(/[<>]/);
				if (card.tier === "tier1_fast") {
					expect(card.fast_check?.options).toHaveLength(2);
					expect(card.fast_check?.options[card.fast_check.correct_index]).toBe(card.concept);
					expect(new Set(card.fast_check?.options).size).toBe(2);
				} else {
					expect(card.tier).toBe("tier2_synthesis");
					expect(card.sample_solution?.length).toBeGreaterThan(2);
				}
			}
		}
	});

	it("declares no history changes and preserves section links after navigation", () => {
		expect(mapping).toMatchObject({ approved: null, status: "proposal-only", sources: [], rows: [] });
		expect(cell).not.toHaveProperty("retired_items");
		for (const atom of cell.atoms) {
			expect(atom).not.toHaveProperty("replaces");
			for (const item of atom.practice_items) expect(item).not.toHaveProperty("replaces");
		}
		expect(parseTrainingDeepLink("#lesson=e7-units&level=2")).toEqual({ lessonId: "e7-units", level: 2 });
		expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
		expect(trainingBaseUrl("/englisch-mittelschule-7/", "?lesson=e7-units&level=2&from=zam"))
			.toBe("/englisch-mittelschule-7/?from=zam");
	});
});
