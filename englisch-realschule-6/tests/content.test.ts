import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import legacy6 from "./fixtures/de-by-realschule-6-englisch-grammatik-grundlagen-kvt.json";
import legacy7 from "./fixtures/de-by-realschule-7-englisch-grammatik-tenses-kvt.json";
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
	GB_CITIES,
	GB_HIGHLANDS,
	GB_LOWLANDS,
	GB_NORTH_ENGLAND,
	GB_SOUTH_ENGLAND,
	GB_WALES,
	LDN_CITY,
	LDN_EAST,
	LDN_NORTH,
	LDN_PLACES,
	LDN_SOUTH,
	LDN_WEST_END,
	renderBritainRegionsMap,
	renderLondonMap,
	renderStreetMap,
	renderUsaMap,
	US_ALASKA,
	US_CITIES,
	US_HAWAII,
	US_MIDWEST,
	US_NORTHEAST,
	US_ROCKIES,
	US_SOUTH,
	US_WEST,
	type MapPoint,
} from "../src/places-map";
import {
	comparisonSentence,
	fahrenheitToCelsius,
	fmtDe,
	renderWorkshop,
	timelineLabel,
	workshopGoals,
} from "../src/workshop";

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const legacyItems = [
	...legacy6.atoms.flatMap((atom) => atom.practice_items),
	...legacy7.atoms.flatMap((atom) => atom.practice_items),
];

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

describe("Grade 6 Realschule English teaching contract", () => {
	it("has 8 stages, 42 lessons, 126 goals and 126 cards", () => {
		expect(LESSONS).toHaveLength(42);
		expect(CORE_LESSONS).toHaveLength(42);
		expect(STAGES).toHaveLength(8);
		expect(cell.atoms).toHaveLength(42);
		expect(items).toHaveLength(126);
		expect(
			LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id),
		).toEqual([
			"e6-usa-weather",
			"e6-london-tickets",
			"e6-pronunciation",
			"e6-listening-stories",
		]);
	});

	it.each(LESSONS)("has substantial teaching and distinct tasks: $id", (lesson) => {
		expect(lesson.id).toMatch(/^e6-[a-z0-9-]+$/);
		expect(lesson.paragraphs).toHaveLength(2);
		expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(400);
		expect(lesson.material.length).toBeGreaterThan(100);
		expect(lesson.materialLanguage).toBe("en");
		expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
		expect(quizOptions(lesson)).toContain(lesson.quiz.answer);
		expect(lesson.quiz.explanation.length).toBeGreaterThan(15);
		for (const wrong of lesson.quiz.wrong) {
			expect(quizFeedback(lesson, wrong)).not.toContain(lesson.quiz.explanation);
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
			expect(entry.prompt, lesson.id).toMatch(/\([^)]+\)/);
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
		expect(lesson.tasks[1].model).not.toBe(lesson.tasks[2].model);
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
			takeaway: lesson.takeaway,
		});
		expect(visible).not.toMatch(/\d\.\d/);
		for (const goal of lesson.workshop.goals)
			expect(goal.before).not.toContain("→");
	});

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
				expect(workshopGoals(lesson.workshop, answers).filter(Boolean)).toHaveLength(
					1,
				);
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
		expect(coverage.rows).toHaveLength(42);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id)).toBe(true);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(35);
			for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
		}
		for (const id of ["E6-01", "E6-02", "E6-04", "E6-06", "E6-20", "E6-42"])
			expect(coverage.rows.find((row) => row.id === id)?.status).toBe(
				"supported",
			);
		expect(coverage.neighbour.boundary).toContain("relative clauses");
		expect(coverage.neighbour.boundary).toContain("question tags");
	});

	it("keeps the Grade 6 grammar boundary clear of Grade 7 topics", () => {
		expect(JSON.stringify(LESSONS)).not.toMatch(
			/question tag|if-clause|if clause|adverbs? of manner|past perfect|present perfect progressive|contact clause|defining relative clause/i,
		);
		expect(findLesson("e6-present-perfect-use")!.paragraphs.join(" ")).toContain(
			"Klasse 7",
		);
		expect(findLesson("e6-will-future")!.paragraphs.join(" ")).toContain(
			"Vorhersagen",
		);
		expect(findLesson("e6-going-to-future")!.paragraphs.join(" ")).toContain(
			"Absichten",
		);
	});
});

describe("explorers, geometry and schematic maps", () => {
	it("places every US, London and Great Britain city pin and label inside its region", () => {
		const usRegions = {
			west: US_WEST,
			rockies: US_ROCKIES,
			midwest: US_MIDWEST,
			south: US_SOUTH,
			northeast: US_NORTHEAST,
		} as const;
		for (const city of Object.values(US_CITIES)) {
			expect(inside(city.pin, usRegions[city.region])).toBe(true);
			expect(inside(city.labelAt, usRegions[city.region])).toBe(true);
			expect(
				Math.hypot(city.pin[0] - city.labelAt[0], city.pin[1] - city.labelAt[1]),
			).toBeLessThanOrEqual(15);
		}
		expect(inside([70, 60], US_ALASKA)).toBe(true);
		expect(inside([60, 285], US_HAWAII)).toBe(true);

		const londonZones = {
			north: LDN_NORTH,
			west: LDN_WEST_END,
			city: LDN_CITY,
			east: LDN_EAST,
			south: LDN_SOUTH,
		} as const;
		for (const place of Object.values(LDN_PLACES)) {
			expect(inside(place.pin, londonZones[place.zone])).toBe(true);
			expect(inside(place.labelAt, londonZones[place.zone])).toBe(true);
		}

		const gbRegions = {
			highlands: GB_HIGHLANDS,
			lowlands: GB_LOWLANDS,
			north: GB_NORTH_ENGLAND,
			wales: GB_WALES,
			south: GB_SOUTH_ENGLAND,
		} as const;
		for (const city of Object.values(GB_CITIES)) {
			expect(inside(city.pin, gbRegions[city.region])).toBe(true);
			expect(inside(city.labelAt, gbRegions[city.region])).toBe(true);
		}
		expect(GB_CITIES.inverness.pin[1]).toBeLessThan(GB_CITIES.edinburgh.pin[1]);
		expect(GB_CITIES.edinburgh.pin[1]).toBeLessThan(GB_CITIES.london.pin[1]);
		expect(renderUsaMap()).toContain("Washington, D.C.");
		expect(renderLondonMap()).toContain("River Thames");
		expect(renderBritainRegionsMap()).toContain("Highlands");
		expect(renderStreetMap()).toContain("Green Park");
	});

	it("renders all custom workshops cleanly without NaN or undefined", () => {
		for (const id of [
			"e6-usa-map",
			"e6-usa-weather",
			"e6-london-city",
			"e6-london-directions",
			"e6-scotland",
			"e6-media-habits",
			"e6-comparatives",
			"e6-past-progressive",
			"e6-writing-linking",
		]) {
			const html = renderWorkshop(findLesson(id)!);
			expect(html).not.toMatch(/NaN|undefined/);
			expect(html).toContain("0 von 3 Zielen erreicht.");
		}
		expect(fahrenheitToCelsius(32)).toBe(0);
		expect(fahrenheitToCelsius(68)).toBe(20);
		expect(fahrenheitToCelsius(86)).toBe(30);
		expect(fmtDe(fahrenheitToCelsius(14), 0)).toBe("\u221210");
		expect(comparisonSentence(90, 90).en).toBe("Tower A is as tall as Tower B.");
		expect(timelineLabel(35).en).toContain("phone rang");
	});
});

describe("answer handling, progress and routes", () => {
	it("treats apostrophes equally while keeping its distinct from it's", () => {
		expect(normalise(" I'm ")).toBe("i'm");
		expect(normalise("I’m")).toBe("i'm");
		expect(normalise("its")).not.toBe(normalise("it's"));
		const lesson = findLesson("e6-possessives")!;
		expect(checkPractice(lesson.practice, ["mine", "hers"])).toEqual([
			true,
			true,
		]);
	});

	it("requires workshop, checks and a real self-assessed draft", () => {
		const progress = freshProgress();
		const id = progress.activeLessonId;
		progress.quizDone.push(id);
		progress.practiceDone.push(id);
		updateDraft(progress, id, 1, "Washington, D.C. is the capital of the USA.");
		progress.writingDone.push(writingKey(id, 1));
		expect(isComplete(progress, id)).toBe(false);
		progress.workshopDone.push(id);
		expect(isComplete(progress, id)).toBe(true);
		updateDraft(progress, id, 1, "Alaska and Hawaii lie outside the 48 states.");
		expect(isComplete(progress, id)).toBe(false);
		expect(canReview(" ".repeat(100))).toBe(false);
		expect(canAccept("A complete answer with enough text.", [true, true, false])).toBe(
			false,
		);
		expect(canAccept("A complete answer with enough text.", [true, true, true])).toBe(
			true,
		);
	});

	it("recovers corrupted state and isolates its storage key", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"])
			expect(parseProgress(raw)).toEqual(freshProgress());
		expect(STORAGE_KEY).toBe("englisch_real6_academy_progress_v1");
		const progress = parseProgress(
			JSON.stringify({ workshopDone: ["bad", "e6-usa-map", "e6-usa-map"] }),
		);
		expect(progress.workshopDone).toEqual(["e6-usa-map"]);
	});

	it("keeps both task levels and all lesson deep links valid", () => {
		for (const lesson of LESSONS)
			for (const level of [1, 2] as const)
				expect(parseTrainingDeepLink(`#lesson=${lesson.id}&level=${level}`)).toEqual({
					lessonId: lesson.id,
					level,
				});
		expect(
			trainingBaseUrl("/englisch-realschule-6/", "?lesson=e6-usa-map&level=1&keep=yes"),
		).toBe("/englisch-realschule-6/?keep=yes");
	});
});

describe("ZAM content and proposal-only legacy inventory", () => {
	it("pins identifiers and keeps cell free of replaces until Thomas approves", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.approved).toBeNull();
		expect(mapping.status).toBe("proposal-only");
		expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
		expect(
			cell.atoms.map((atom) => ({
				id: atom.id,
				slug: atom.slug,
				lesson: atom.source_link,
				items: atom.practice_items.map((item) => ({ id: item.id, slug: item.slug })),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((entry) => entry.id);
		expect(new Set(ids).size).toBe(168);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
		expect(mapping.rows).toHaveLength(legacyItems.length);
		expect(new Set(mapping.rows.map((row) => row.de_by_id)).size).toBe(
			legacyItems.length,
		);
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
		expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(5);
		expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(11);
	});

	it.each(cell.atoms)(
		"links only to real lessons and Grade 6 Realschule curriculum: $slug",
		(atom) => {
			const lesson = findLesson(atom.slug)!;
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(atom.practice_items).toHaveLength(3);
			expect(new Set(atom.practice_items.map((item) => item.question)).size).toBe(
				3,
			);
			for (const binding of atom.curricula.filter(
				(entry) => entry.provider === "lehrplanplus-bayern",
			)) {
				expect(binding).toMatchObject({
					school_type: "realschule",
					grade: 6,
					subject: "englisch",
				});
				expect(binding).not.toHaveProperty("track");
			}
			for (const edge of atom.prerequisites)
				expect(cell.atoms.some((other) => other.id === edge.atom_id)).toBe(true);
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
