import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import legacy from "./fixtures/de-by-gymnasium-6-englisch-past-tenses-present-perfect-adjectives-kvt.json";
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
	CORNWALL,
	ENGLAND,
	FLORIDA,
	HADRIANS_WALL,
	LAKE_DISTRICT,
	MIDWEST,
	NEW_ENGLAND,
	NORTHEAST,
	ROCKY_MOUNTAINS,
	SCOTLAND,
	SOUTH,
	UK_PLACES,
	US_PLACES,
	WALES,
	WEST,
	renderPictureScene,
	renderTownMap,
	renderUkRegionsMap,
	renderUsRegionsMap,
	type MapPoint,
} from "../src/places-map";
import {
	comparisonSentence,
	renderWorkshop,
	workshopGoals,
} from "../src/workshop";

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const legacyItems = legacy.atoms.flatMap((atom) => atom.practice_items);

function inside(point: MapPoint, polygon: readonly MapPoint[]): boolean {
	let contained = false;
	for (
		let index = 0, previous = polygon.length - 1;
		index < polygon.length;
		previous = index++
	) {
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

describe("Grade 6 Gymnasium English teaching contract", () => {
	it("has eight stages, 40 lessons, 120 workshop goals and 120 ZAM cards", () => {
		expect(LESSONS).toHaveLength(40);
		expect(CORE_LESSONS).toHaveLength(40);
		expect(STAGES).toHaveLength(8);
		expect(cell.atoms).toHaveLength(40);
		expect(items).toHaveLength(120);
		expect(
			LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id),
		).toEqual(["e6-listening", "e6-intonation"]);
	});

	it.each(LESSONS)(
		"has substantial teaching and distinct tasks: $id",
		(lesson) => {
			expect(lesson.id).toMatch(/^e6-[a-z0-9-]+$/);
			expect(lesson.paragraphs).toHaveLength(2);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(400);
			expect(lesson.material.length).toBeGreaterThan(95);
			expect(lesson.materialLanguage).toBe("en");
			expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
			expect(quizOptions(lesson)).toContain(lesson.quiz.answer);
			expect(lesson.quiz.explanation.length).toBeGreaterThan(15);
			for (const wrong of lesson.quiz.wrong) {
				expect(quizFeedback(lesson, wrong)).not.toContain(
					lesson.quiz.explanation,
				);
				expect(quizFeedback(lesson, wrong)).toContain("Prüfe");
			}
			expect(quizFeedback(lesson, lesson.quiz.answer)).toContain(
				lesson.quiz.explanation,
			);
			expect(lesson.practice).toHaveLength(2);
			for (const entry of lesson.practice) {
				expect(entry.answers.length).toBeGreaterThan(0);
				expect(entry.feedback.length).toBeGreaterThan(10);
				expect(practiceFeedback(entry, false)).not.toContain(entry.feedback);
				expect(entry.prompt, lesson.id).toMatch(/\([^)]+\)$/);
			}
			expect(
				checkPractice(
					lesson.practice,
					lesson.practice.map((entry) => entry.answers[0]),
				),
			).toEqual([true, true]);
			expect(checkPractice(lesson.practice, ["wrong", "wrong"])).toEqual([
				false,
				false,
			]);
			expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
			for (const task of Object.values(lesson.tasks)) {
				expect(task.criteria).toHaveLength(3);
				expect(task.model.length).toBeGreaterThan(35);
				expect(task.prompt.length).toBeGreaterThan(35);
			}
			for (const id of lesson.sourceIds)
				expect(SOURCES.some((source) => source.id === id)).toBe(true);
			expect(JSON.stringify(lesson)).not.toMatch(
				/<script|<p>|<div>|\\\\\(|teacherVideo/,
			);
			const visible = JSON.stringify({
				paragraphs: lesson.paragraphs,
				material: lesson.material,
				quiz: lesson.quiz,
				tasks: lesson.tasks,
				practice: lesson.practice,
			});
			expect(visible).not.toMatch(/\d\.\d/);
			for (const goal of lesson.workshop.goals)
				expect(goal.before).not.toContain("→");
		},
	);

	it.each(LESSONS)(
		"proves every visual goal reachable and none true initially: $id",
		(lesson) => {
			expect(lesson.workshop.goals).toHaveLength(3);
			expect(workshopGoals(lesson.workshop, [])).toEqual([false, false, false]);
			expect(
				workshopGoals(
					lesson.workshop,
					lesson.workshop.goals.map((goal) => goal.answer),
				),
			).toEqual([true, true, true]);
			lesson.workshop.goals.forEach((goal, index) => {
				expect(new Set(goal.options).size).toBe(3);
				expect(goal.options).toContain(goal.answer);
				const answers = Array(3).fill("");
				answers[index] = goal.answer;
				expect(
					workshopGoals(lesson.workshop, answers).filter(Boolean),
				).toHaveLength(1);
				for (const wrong of goal.options.filter(
					(value) => value !== goal.answer,
				)) {
					answers[index] = wrong;
					expect(
						workshopGoals(lesson.workshop, answers).filter(Boolean),
					).toHaveLength(0);
				}
			});
		},
	);

	it("maps every competence and every lesson, with honest limits", () => {
		expect(coverage.rows).toHaveLength(40);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id)).toBe(true);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(40);
			for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
		}
		for (const id of [
			"E6-01",
			"E6-02",
			"E6-04",
			"E6-05",
			"E6-06",
			"E6-07",
			"E6-10",
			"E6-19",
			"E6-20",
			"E6-29",
			"E6-39",
		])
			expect(coverage.rows.find((row) => row.id === id)?.status).toBe(
				"supported",
			);
		expect(coverage.neighbours.grade7.boundary).toContain(
			"past perfect simple",
		);
	});

	it("keeps the Grade 6 grammar boundary clear of Grade 7 targets", () => {
		expect(JSON.stringify(LESSONS)).not.toMatch(
			/past perfect|present perfect progressive|Conditional Type 2|If I won|1066|Henry VIII|Mayflower/i,
		);
	});
});

describe("explorers, schematic maps and interactive scenes", () => {
	it("produces valid comparison sentences across all adjective types", () => {
		for (const adj of ["fast", "exciting", "good"] as const)
			for (let bike = 1; bike <= 5; bike++)
				for (let train = 1; train <= 5; train++) {
					const sentence = comparisonSentence(bike, train, adj);
					expect(sentence).not.toMatch(/undefined|NaN/);
					expect(sentence.length).toBeGreaterThan(20);
				}
		expect(comparisonSentence(3, 3, "fast")).toContain("as fast as");
		expect(comparisonSentence(5, 2, "good")).toContain("better than");
		expect(comparisonSentence(1, 4, "exciting")).toContain(
			"more exciting than",
		);
	});

	it("places UK regions, Hadrian's Wall and US regions consistently", () => {
		expect(inside(UK_PLACES.edinburgh.pin, SCOTLAND)).toBe(true);
		expect(inside(UK_PLACES.edinburgh.pin, ENGLAND)).toBe(false);
		expect(inside(UK_PLACES.penzance.pin, CORNWALL)).toBe(true);
		expect(inside(UK_PLACES.penzance.pin, ENGLAND)).toBe(true);
		expect(inside(UK_PLACES.bath.pin, ENGLAND)).toBe(true);
		expect(inside(UK_PLACES.london.pin, ENGLAND)).toBe(true);
		expect(inside(UK_PLACES.chester.pin, ENGLAND)).toBe(true);
		expect(inside(UK_PLACES.manchester.pin, ENGLAND)).toBe(true);
		expect(inside(UK_PLACES.chester.pin, WALES)).toBe(false);

		for (const point of HADRIANS_WALL) {
			expect(inside(point, ENGLAND)).toBe(true);
			expect(inside(point, SCOTLAND)).toBe(false);
			expect(point[1]).toBeLessThan(LAKE_DISTRICT[0][1]);
		}
		expect(UK_PLACES.penzance.pin[0]).toBeLessThan(UK_PLACES.bath.pin[0]);
		expect(UK_PLACES.penzance.pin[1]).toBeGreaterThan(UK_PLACES.bath.pin[1]);
		expect(LAKE_DISTRICT[0][1]).toBeLessThan(UK_PLACES.manchester.pin[1]);

		for (const place of Object.values(UK_PLACES)) {
			expect(
				Math.hypot(
					place.pin[0] - place.labelAt[0],
					place.pin[1] - place.labelAt[1],
				),
			).toBeLessThanOrEqual(16);
		}

		expect(inside(US_PLACES.boston.pin, NEW_ENGLAND)).toBe(true);
		expect(inside(US_PLACES.newYork.pin, NORTHEAST)).toBe(true);
		expect(inside(US_PLACES.washington.pin, SOUTH)).toBe(true);
		expect(inside(US_PLACES.chicago.pin, MIDWEST)).toBe(true);
		expect(inside(US_PLACES.denver.pin, WEST)).toBe(true);
		expect(inside(US_PLACES.denver.pin, ROCKY_MOUNTAINS)).toBe(true);
		expect(inside(US_PLACES.miami.pin, FLORIDA)).toBe(true);
		expect(inside(US_PLACES.boston.pin, FLORIDA)).toBe(false);

		expect(renderUkRegionsMap()).toContain("Hadrian's Wall");
		expect(renderUsRegionsMap()).toContain("Rocky Mountains");
		expect(renderTownMap()).toContain("Park Lane");
		expect(renderPictureScene()).toContain("In the foreground");
		expect(renderPictureScene()).toContain("in the background");
		expect(renderWorkshop(findLesson("e6-past-progressive")!)).toContain(
			"timeline-axis",
		);
	});
});

describe("answer handling, progress and routes", () => {
	it("treats apostrophes as equal and keeps its distinct from it's", () => {
		expect(normalise(" won't ")).toBe("won't");
		expect(normalise("won’t")).toBe("won't");
		expect(normalise("its")).not.toBe(normalise("it's"));
	});

	it("requires workshop, checks and a real self-assessed draft", () => {
		const progress = freshProgress();
		const id = progress.activeLessonId;
		progress.quizDone.push(id);
		progress.practiceDone.push(id);
		updateDraft(progress, id, 1, "Could I have a return ticket to Bath, please?");
		progress.writingDone.push(writingKey(id, 1));
		expect(isComplete(progress, id)).toBe(false);
		progress.workshopDone.push(id);
		expect(isComplete(progress, id)).toBe(true);
		updateDraft(progress, id, 1, "Could I have a single ticket to York, please?");
		expect(isComplete(progress, id)).toBe(false);
		expect(canReview(" ".repeat(100))).toBe(false);
		expect(
			canAccept("Eine eigene vollständige Antwort.", [true, true, false]),
		).toBe(false);
		expect(
			canAccept("Eine eigene vollständige Antwort.", [true, true, true]),
		).toBe(true);
	});

	it("recovers corrupted state and isolates its storage key", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"])
			expect(parseProgress(raw)).toEqual(freshProgress());
		expect(STORAGE_KEY).toBe("englisch_gym6_academy_progress_v1");
		const progress = parseProgress(
			JSON.stringify({
				workshopDone: ["bad", "e6-station", "e6-station"],
			}),
		);
		expect(progress.workshopDone).toEqual(["e6-station"]);
	});

	it("keeps both task levels and all lesson deep links valid", () => {
		for (const lesson of LESSONS)
			for (const level of [1, 2] as const)
				expect(
					parseTrainingDeepLink(`#lesson=${lesson.id}&level=${level}`),
				).toEqual({
					lessonId: lesson.id,
					level,
				});
		expect(
			trainingBaseUrl("/app/", "?lesson=e6-station&level=1&keep=yes"),
		).toBe("/app/?keep=yes");
	});
});

describe("ZAM content and the approved history", () => {
	it("pins identifiers and moves only the approved A histories", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.status).toBe("approved");
		expect(mapping.approved).toBe("2026-11-18");
		expect(JSON.stringify(cell)).not.toMatch(/"retired_items"/);
		expect(
			cell.atoms.map((atom) => ({
				id: atom.id,
				slug: atom.slug,
				lesson: atom.source_link,
				items: atom.practice_items.map((item) => ({
					id: item.id,
					slug: item.slug,
				})),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((entry) => entry.id);
		expect(new Set(ids).size).toBe(160);
		for (const id of ids)
			expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);

		expect(mapping.rows).toHaveLength(legacyItems.length);
		expect(new Set(mapping.rows.map((row) => row.de_by_id)).size).toBe(
			legacyItems.length,
		);
		for (const row of mapping.rows) {
			expect(legacyItems.some((item) => item.id === row.de_by_id)).toBe(true);
			if (row.action === "replace") {
				expect(row.category).toBe("A");
				const successors = items.filter(
					(item) => item.slug === row.academy_slug,
				);
				expect(successors).toHaveLength(1);
				expect((successors[0] as { replaces?: string[] }).replaces).toEqual([
					row.de_by_id,
				]);
			} else {
				expect(row.action).toBe("keep-active");
				expect(row.category).toBe("C");
				expect(row.academy_slug).toBeNull();
			}
		}
		expect(
			items.filter((item) => "replaces" in item),
		).toHaveLength(3);
		expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(3);
		expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(5);
	});

	it.each(cell.atoms)(
		"links only to real lessons and grade 6 curriculum: $slug",
		(atom) => {
			const lesson = findLesson(atom.slug)!;
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(atom.practice_items).toHaveLength(3);
			expect(
				new Set(atom.practice_items.map((item) => item.question)).size,
			).toBe(3);
			for (const binding of atom.curricula.filter(
				(entry) => entry.provider === "lehrplanplus-bayern",
			)) {
				expect(binding).toMatchObject({
					school_type: "gymnasium",
					grade: 6,
					subject: "englisch",
				});
				expect(binding).not.toHaveProperty("track");
			}
			for (const edge of atom.prerequisites)
				expect(
					cell.atoms.some((other) => other.id === edge.atom_id),
				).toBe(true);
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(lessonLink(lesson.id));
				expect(item.question.length).toBeGreaterThan(15);
				expect(item.concept.length).toBeGreaterThan(2);
				expect(item.question).not.toMatch(/\s\?$/);
				if (item.fast_check) {
					expect(item.fast_check.options).toHaveLength(2);
					expect(item.fast_check.correct_index).toBe(0);
					expect(item.fast_check.options[0]).toBe(item.concept);
				} else expect(item.sample_solution).toBe(item.concept);
			}
		},
	);
});
