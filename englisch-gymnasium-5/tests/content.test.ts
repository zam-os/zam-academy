import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import legacy from "./fixtures/de-by-gymnasium-5-englisch-starter-grammar-tenses-kvt.json";
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
import {
	GREAT_BRITAIN,
	IRELAND_ISLAND,
	LOWER_48,
	CANADA,
	ALASKA,
	HAWAII,
	PLACES,
	type MapPoint,
} from "../src/places-map";
import { clockLabel, ordinal, workshopGoals } from "../src/workshop";

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const legacyItems = legacy.atoms.flatMap((atom) => atom.practice_items);

function inside(point: MapPoint, polygon: readonly MapPoint[]): boolean {
	let contained = false;
	for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
		const current = polygon[index];
		const before = polygon[previous];
		if (
			current[1] > point[1] !== before[1] > point[1] &&
			point[0] <
				((before[0] - current[0]) * (point[1] - current[1])) /
					(before[1] - current[1]) +
					current[0]
		)
			contained = !contained;
	}
	return contained;
}

describe("Grade 5 Gymnasium English teaching contract", () => {
	it("has eight stages and three goals and three cards per lesson", () => {
		expect(LESSONS).toHaveLength(40);
		expect(CORE_LESSONS).toHaveLength(40);
		expect(STAGES).toHaveLength(8);
		expect(cell.atoms).toHaveLength(40);
		expect(items).toHaveLength(120);
		expect(LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id)).toEqual([
			"e5-listening",
			"e5-sounds",
		]);
	});
	it.each(LESSONS)("has substantial teaching and distinct tasks: $id", (lesson) => {
		expect(lesson.id).toMatch(/^e5-[a-z0-9-]+$/);
		expect(lesson.paragraphs).toHaveLength(2);
		expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(400);
		expect(lesson.material.length).toBeGreaterThan(95);
		expect(lesson.materialLanguage).toBe("en");
		expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
		expect(quizOptions(lesson)).toContain(lesson.quiz.answer);
		expect(lesson.quiz.explanation.length).toBeGreaterThan(15);
		for (const wrong of lesson.quiz.wrong) {
			expect(quizFeedback(lesson, wrong)).not.toContain(lesson.quiz.explanation);
			expect(quizFeedback(lesson, wrong)).toContain("Prüfe");
		}
		expect(quizFeedback(lesson, lesson.quiz.answer)).toContain(lesson.quiz.explanation);
		expect(lesson.practice).toHaveLength(2);
		for (const entry of lesson.practice) {
			expect(entry.answers.length).toBeGreaterThan(0);
			expect(entry.feedback.length).toBeGreaterThan(10);
			expect(practiceFeedback(entry, false)).not.toContain(entry.feedback);
		}
		expect(checkPractice(lesson.practice, lesson.practice.map((entry) => entry.answers[0]))).toEqual([
			true,
			true,
		]);
		expect(checkPractice(lesson.practice, ["wrong", "wrong"])).toEqual([false, false]);
		expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
		for (const task of Object.values(lesson.tasks)) {
			expect(task.criteria).toHaveLength(3);
			expect(task.model.length).toBeGreaterThan(35);
			expect(task.prompt.length).toBeGreaterThan(35);
		}
		for (const id of lesson.sourceIds) expect(SOURCES.some((source) => source.id === id)).toBe(true);
		expect(JSON.stringify(lesson)).not.toMatch(/<script|<p>|<div>|\\\\\(|teacherVideo/);
		expect(JSON.stringify({
			paragraphs: lesson.paragraphs,
			material: lesson.material,
			quiz: lesson.quiz,
			tasks: lesson.tasks,
			practice: lesson.practice,
		})).not.toMatch(/\d\.\d/);
	});
	it.each(LESSONS)("proves every visual goal reachable and none true initially: $id", (lesson) => {
		expect(lesson.workshop.goals).toHaveLength(3);
		expect(workshopGoals(lesson.workshop, [])).toEqual([false, false, false]);
		expect(workshopGoals(lesson.workshop, lesson.workshop.goals.map((goal) => goal.answer))).toEqual([
			true,
			true,
			true,
		]);
		lesson.workshop.goals.forEach((goal, index) => {
			expect(new Set(goal.options).size).toBe(3);
			expect(goal.options).toContain(goal.answer);
			const answers = Array(3).fill("");
			answers[index] = goal.answer;
			expect(workshopGoals(lesson.workshop, answers).filter(Boolean)).toHaveLength(1);
			for (const wrong of goal.options.filter((value) => value !== goal.answer)) {
				answers[index] = wrong;
				expect(workshopGoals(lesson.workshop, answers).filter(Boolean)).toHaveLength(0);
			}
		});
	});
	it("maps every competence and every lesson, with honest limits", () => {
		expect(coverage.rows).toHaveLength(38);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id)).toBe(true);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(40);
			for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
		}
		for (const id of ["E5-01", "E5-04", "E5-09", "E5-18", "E5-26", "E5-36"])
			expect(coverage.rows.find((row) => row.id === id)?.status).toBe("supported");
		expect(coverage.neighbour.boundary).toContain("present perfect");
	});
	it("keeps the grade 5 grammar boundary and the reviewed distinctions", () => {
		const text = (id: string) => findLesson(id)!.paragraphs.join(" ");
		expect(text("e5-simple-present")).toContain("nicht zu den Zischlauten");
		expect(text("e5-simple-present")).toContain("goes");
		expect(text("e5-progressive")).toContain("every day");
		expect(text("e5-progressive")).toContain("now");
		expect(text("e5-modals")).toContain("mustn't");
		expect(text("e5-modals")).toContain("needn't");
		expect(text("e5-have-got")).toContain("lässt got weg");
		expect(text("e5-past")).toContain("didn't");
		expect(text("e5-awareness")).toContain("werden");
		expect(text("e5-uk")).toContain("Northern Ireland");
		expect(text("e5-america")).toContain("Washington, D.C.");
		expect(text("e5-clothes")).toContain("put on");
		expect(text("e5-routine")).toContain("get up");
		expect(JSON.stringify(LESSONS)).not.toMatch(/present perfect|question tag|going to|Past Progressive/);
		const time = findLesson("e5-time")!;
		expect(checkPractice(time.practice, ["7.30", "7.30"])).toEqual([false, false]);
		expect(checkPractice(time.practice, ["past", "to"])).toEqual([true, true]);
	});
});

describe("clock, ordinals and the schematic maps", () => {
	it("reads every offered clock setting in words", () => {
		for (let hour = 0; hour < 24; hour++)
			for (const minute of [0, 15, 30, 45]) {
				const label = clockLabel(hour, minute);
				expect(label).not.toMatch(/undefined|NaN|\d/);
				expect(label.length).toBeGreaterThan(3);
			}
		expect(clockLabel(0, 0)).toBe("midnight");
		expect(clockLabel(7, 0)).toBe("seven o'clock");
		expect(clockLabel(7, 15)).toBe("quarter past seven");
		expect(clockLabel(7, 30)).toBe("half past seven");
		expect(clockLabel(7, 45)).toBe("quarter to eight");
		expect(clockLabel(12, 0)).toBe("twelve o'clock");
		expect(clockLabel(21, 0)).toBe("nine o'clock");
	});
	it("uses st, nd, rd and keeps 11 to 13 on th", () => {
		expect(ordinal(1)).toBe("1st");
		expect(ordinal(2)).toBe("2nd");
		expect(ordinal(3)).toBe("3rd");
		expect(ordinal(11)).toBe("11th");
		expect(ordinal(12)).toBe("12th");
		expect(ordinal(13)).toBe("13th");
		expect(ordinal(21)).toBe("21st");
		expect(ordinal(22)).toBe("22nd");
		expect(ordinal(23)).toBe("23rd");
		expect(ordinal(31)).toBe("31st");
		for (let value = 1; value <= 31; value++) expect(ordinal(value)).toMatch(/^\d+(st|nd|rd|th)$/);
	});
	it("puts cities on the land the lessons name", () => {
		expect(inside(PLACES.london.pin, GREAT_BRITAIN)).toBe(true);
		expect(inside(PLACES.edinburgh.pin, GREAT_BRITAIN)).toBe(true);
		expect(inside(PLACES.cardiff.pin, GREAT_BRITAIN)).toBe(true);
		expect(inside(PLACES.dublin.pin, IRELAND_ISLAND)).toBe(true);
		expect(inside(PLACES.belfast.pin, IRELAND_ISLAND)).toBe(true);
		expect(inside(PLACES.london.pin, IRELAND_ISLAND)).toBe(false);
		expect(inside(PLACES.dublin.pin, GREAT_BRITAIN)).toBe(false);
		expect(PLACES.edinburgh.pin[1]).toBeLessThan(PLACES.london.pin[1]);
		expect(PLACES.belfast.pin[1]).toBeLessThan(PLACES.dublin.pin[1]);
		expect(inside(PLACES.ottawa.pin, CANADA)).toBe(true);
		expect(inside(PLACES.washington.pin, LOWER_48)).toBe(true);
		expect(inside(PLACES.newYork.pin, LOWER_48)).toBe(true);
		expect(inside(PLACES.washington.pin, CANADA)).toBe(false);
		expect(inside([350, 60], ALASKA)).toBe(true);
		expect(inside([350, 60], LOWER_48)).toBe(false);
		expect(inside([360, 235], HAWAII)).toBe(true);
		expect(inside([360, 235], LOWER_48)).toBe(false);
		expect(PLACES.newYork.pin[0]).toBeGreaterThan(PLACES.washington.pin[0]);
	});
});

describe("answer handling, progress and routes", () => {
	it("treats apostrophes as equal and keeps its distinct from it's", () => {
		expect(normalise(" I'm ")).toBe("i'm");
		expect(normalise("I’m")).toBe("i'm");
		expect(normalise("its")).not.toBe(normalise("it's"));
		const lesson = findLesson("e5-to-be")!;
		expect(checkPractice(lesson.practice, ["is", "aren't"])).toEqual([true, true]);
	});
	it("requires workshop, checks and a real self-assessed draft", () => {
		const progress = freshProgress();
		const id = progress.activeLessonId;
		progress.quizDone.push(id);
		progress.practiceDone.push(id);
		updateDraft(progress, id, 1, "Hello, Mrs Taylor. I am Mia. Goodbye.");
		progress.writingDone.push(writingKey(id, 1));
		expect(isComplete(progress, id)).toBe(false);
		progress.workshopDone.push(id);
		expect(isComplete(progress, id)).toBe(true);
		updateDraft(progress, id, 1, "Hello, Mr Taylor. I am Sam. Goodbye.");
		expect(isComplete(progress, id)).toBe(false);
		expect(canReview(" ".repeat(100))).toBe(false);
		expect(canAccept("Eine eigene vollständige Antwort.", [true, true, false])).toBe(false);
		expect(canAccept("Eine eigene vollständige Antwort.", [true, true, true])).toBe(true);
	});
	it("recovers corrupted state and isolates its storage key", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"])
			expect(parseProgress(raw)).toEqual(freshProgress());
		expect(STORAGE_KEY).toBe("englisch_gym5_academy_progress_v1");
		const progress = parseProgress(JSON.stringify({ workshopDone: ["bad", "e5-hello", "e5-hello"] }));
		expect(progress.workshopDone).toEqual(["e5-hello"]);
	});
	it("keeps both task levels and all lesson deep links valid", () => {
		for (const lesson of LESSONS)
			for (const level of [1, 2] as const)
				expect(parseTrainingDeepLink(`#lesson=${lesson.id}&level=${level}`)).toEqual({
					lessonId: lesson.id,
					level,
				});
		expect(trainingBaseUrl("/app/", "?lesson=e5-hello&level=1&keep=yes")).toBe("/app/?keep=yes");
	});
});

describe("ZAM content and the proposal-only history", () => {
	it("pins identifiers and ships no history transfer", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.approved).toBeNull();
		expect(mapping.status).toBe("proposal-only");
		expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
		expect(cell.atoms.map((atom) => ({
			id: atom.id,
			slug: atom.slug,
			lesson: atom.source_link,
			items: atom.practice_items.map((item) => ({ id: item.id, slug: item.slug })),
		}))).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((entry) => entry.id);
		expect(new Set(ids).size).toBe(160);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(mapping.rows).toHaveLength(legacyItems.length);
		expect(new Set(mapping.rows.map((row) => row.de_by_id)).size).toBe(legacyItems.length);
		for (const row of mapping.rows) {
			expect(legacyItems.some((item) => item.id === row.de_by_id)).toBe(true);
			if (row.action === "propose-replace-after-approval") {
				expect(row.category).toBe("A");
				expect(items.filter((item) => item.slug === row.academy_slug)).toHaveLength(1);
			} else {
				expect(row.action).toBe("keep-active");
				expect(row.academy_slug).toBeNull();
			}
		}
		expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(4);
		expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(4);
	});
	it.each(cell.atoms)("links only to real lessons and grade 5 curriculum: $slug", (atom) => {
		const lesson = findLesson(atom.slug)!;
		expect(atom.source_link).toBe(lessonLink(lesson.id));
		expect(atom.practice_items).toHaveLength(3);
		expect(new Set(atom.practice_items.map((item) => item.question)).size).toBe(3);
		for (const binding of atom.curricula.filter((entry) => entry.provider === "lehrplanplus-bayern")) {
			expect(binding).toMatchObject({ school_type: "gymnasium", grade: 5, subject: "englisch" });
			expect(binding).not.toHaveProperty("track");
		}
		for (const edge of atom.prerequisites)
			expect(cell.atoms.some((other) => other.id === edge.atom_id)).toBe(true);
		for (const item of atom.practice_items) {
			expect(item.source_link).toBe(lessonLink(lesson.id));
			expect(item.question.length).toBeGreaterThan(15);
			expect(item.concept.length).toBeGreaterThan(3);
			expect(item.question).not.toMatch(/\s\?$/);
			if (item.fast_check) {
				expect(item.fast_check.options).toHaveLength(2);
				expect(item.fast_check.correct_index).toBe(0);
				expect(item.fast_check.options[0]).toBe(item.concept);
			} else expect(item.sample_solution).toBe(item.concept);
		}
	});
});
