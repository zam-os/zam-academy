import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import legacy from "./fixtures/de-by-gymnasium-7-englisch-grammar-present-perfect-modals-conditionals-kvt.json";
import mainSource from "../src/main.ts?raw";
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
	ANGLESEY,
	DESERT_SOUTHWEST,
	ENGLAND_BORDER,
	ERYRI,
	MIDWEST,
	NEW_ENGLAND,
	NORTHEAST,
	SOUTH,
	US_PLACES,
	WALES,
	WALES_PLACES,
	renderFilmScene,
	renderUsMap,
	renderWalesMap,
	type MapPoint,
} from "../src/places-map";
import {
	adverbSentence,
	calendarX,
	CONDITIONS,
	historyX,
	holidays,
	LAYOUTS,
	nthWeekday,
	PAIRS,
	renderCalendar,
	renderWorkshop,
	TIMELINES,
	TRANSFORMS,
	workshopGoals,
} from "../src/workshop";

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const legacyItems: { id: string }[] = legacy.atoms.flatMap(
	(atom) => atom.practice_items as { id: string }[],
);

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

describe("Grade 7 Gymnasium English teaching contract", () => {
	it("has eight stages, 44 lessons, 132 workshop goals and 132 ZAM cards", () => {
		expect(LESSONS).toHaveLength(44);
		expect(CORE_LESSONS).toHaveLength(44);
		expect(STAGES).toHaveLength(8);
		for (const stage of STAGES)
			expect(
				LESSONS.filter((lesson) => lesson.stage === stage.id).length,
			).toBeGreaterThanOrEqual(5);
		expect(new Set(STAGES.map((stage) => stage.hue)).size).toBe(8);
		expect(LESSONS.flatMap((lesson) => lesson.workshop.goals)).toHaveLength(132);
		expect(cell.atoms).toHaveLength(44);
		expect(items).toHaveLength(132);
		expect(
			LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id),
		).toEqual(["e7-vlog-listening", "e7-pronunciation"]);
	});

	it.each(LESSONS)(
		"has substantial teaching and distinct tasks: $id",
		(lesson) => {
			expect(lesson.id).toMatch(/^e7-[a-z0-9-]+$/);
			expect(lesson.paragraphs).toHaveLength(2);
			expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(400);
			expect(lesson.material.length).toBeGreaterThan(95);
			expect(lesson.materialLanguage).toBe("en");
			expect(lesson.bindings.length).toBeGreaterThan(0);
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
		"proves every workshop goal reachable and none true initially: $id",
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
		expect(coverage.rows).toHaveLength(43);
		expect(coverage.rows.map((row) => row.id)).toEqual(
			Array.from({ length: 43 }, (_, i) => `E7-${String(i + 1).padStart(2, "0")}`),
		);
		const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
		for (const lesson of LESSONS) expect(mapped.has(lesson.id)).toBe(true);
		for (const row of coverage.rows) {
			expect(["supported", "implemented"]).toContain(row.status);
			expect(row.evidence.length).toBeGreaterThan(40);
			for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
		}
		for (const lesson of LESSONS) {
			const lbs = new Set(
				coverage.rows
					.filter((row) => row.lessons.includes(lesson.id))
					.map((row) => row.lb),
			);
			expect(new Set(lesson.bindings)).toEqual(lbs);
		}
		// Listening, free speaking, presenting, spontaneous mediation, films and research stay in class.
		for (const id of [
			"E7-01",
			"E7-02",
			"E7-05",
			"E7-06",
			"E7-07",
			"E7-08",
			"E7-11",
			"E7-21",
			"E7-22",
			"E7-31",
			"E7-42",
		])
			expect(coverage.rows.find((row) => row.id === id)?.status).toBe(
				"supported",
			);
		expect(coverage.neighbours.grade8.boundary).toContain("passive");
		expect(coverage.optional_lessons).toEqual([]);
	});

	it("keeps Grade 8 targets out of the Grade 7 lessons", () => {
		const text = JSON.stringify(LESSONS);
		expect(text).not.toMatch(/Boston Tea Party|gerund|Passiv|passive voice|Civil War|Martin Luther King/i);
		expect(findLesson("e7-independence-day")!.paragraphs[0]).toContain(
			"Jahrgangsstufe 8",
		);
	});

	it("gives the free-text field the small shared-account note and resets texts too", () => {
		expect(mainSource).toContain("Hast du dein eigenes Benutzerkonto");
		expect(mainSource).toContain("eigenen Texte und Häkchen");
		expect(mainSource).toContain("Hinweis für Eltern und Lehrkräfte");
	});
});

describe("explorer models", () => {
	it("compares two learners with adverbs on every setting", () => {
		for (const kind of ["fast", "carefully", "well"] as const)
			for (let lena = 1; lena <= 5; lena++)
				for (let tom = 1; tom <= 5; tom++) {
					const sentence = adverbSentence(lena, tom, kind);
					expect(sentence).not.toMatch(/undefined|NaN/);
					expect(sentence).toMatch(/than|as .* as/);
				}
		expect(adverbSentence(3, 3, "well")).toBe("Lena sings as well as Tom.");
		expect(adverbSentence(5, 2, "carefully")).toBe(
			"Lena writes more carefully than Tom.",
		);
		expect(adverbSentence(1, 4, "fast")).toBe("Tom runs faster than Lena.");
		expect(adverbSentence(4, 2, "well")).not.toMatch(/weller|more well/);
	});

	it("computes the North American holiday dates", () => {
		// Fourth Thursday in November and second Monday in October.
		expect(nthWeekday(2025, 10, 4, 4)).toBe(27);
		expect(nthWeekday(2026, 10, 4, 4)).toBe(26);
		expect(nthWeekday(2027, 10, 4, 4)).toBe(25);
		// Wikipedia "Columbus Day": 13 Oct 2025, 12 Oct 2026, 11 Oct 2027, 9 Oct 2028.
		expect([2025, 2026, 2027, 2028].map((y) => nthWeekday(y, 9, 1, 2))).toEqual([
			13, 12, 11, 9,
		]);
		for (let year = 2024; year <= 2040; year++) {
			const list = holidays(year);
			const thanksgiving = list.find((h) => h.id === "thanksgiving")!;
			expect(thanksgiving.day).toBeGreaterThanOrEqual(22);
			expect(thanksgiving.day).toBeLessThanOrEqual(28);
			expect(new Date(Date.UTC(year, 10, thanksgiving.day)).getUTCDay()).toBe(4);
			for (const holiday of list) {
				expect(holiday.note).toContain(String(year));
				const x = calendarX(holiday.month, holiday.day);
				expect(x).toBeGreaterThan(20 + holiday.month * 36);
				expect(x).toBeLessThan(20 + (holiday.month + 1) * 36);
			}
		}
		const markup = renderCalendar(2026);
		expect(markup).toContain("Thursday, 26 November 2026");
		expect(markup).not.toMatch(/NaN|undefined/);
	});

	it("orders the history frieze from 1066 to 1620", () => {
		const years = [1066, 1086, 1509, 1534, 1547, 1558, 1588, 1603, 1620];
		const xs = years.map(historyX);
		for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThan(xs[i - 1]);
		expect(xs[0]).toBeGreaterThanOrEqual(30);
		expect(xs.at(-1)!).toBeLessThanOrEqual(476);
		expect(historyX(1100)).toBeLessThan(historyX(1500));
	});

	it("has data for every data-driven explorer and keeps timelines on the axis", () => {
		for (const lesson of LESSONS) {
			const kind = lesson.workshop.kind;
			if (kind === "timeline") {
				const data = TIMELINES[lesson.id];
				expect(data, lesson.id).toBeDefined();
				expect(data.modes.length).toBeGreaterThanOrEqual(2);
				for (const mode of data.modes) {
					expect(mode.readout.length).toBeGreaterThan(15);
					for (const [from, to] of mode.bars) {
						expect(from).toBeGreaterThanOrEqual(28);
						expect(to).toBeLessThanOrEqual(432);
						expect(to).toBeGreaterThan(from);
					}
					for (const x of [...mode.dots, ...mode.captions.map((c) => c.x)]) {
						expect(x).toBeGreaterThanOrEqual(28);
						expect(x).toBeLessThanOrEqual(432);
					}
				}
			}
			if (kind === "transform") expect(TRANSFORMS[lesson.id], lesson.id).toBeDefined();
			if (kind === "layout") expect(LAYOUTS[lesson.id], lesson.id).toBeDefined();
			if (kind === "pairs") expect(PAIRS[lesson.id], lesson.id).toBeDefined();
			const markup = renderWorkshop(lesson);
			expect(markup).not.toMatch(/NaN|undefined/);
			if (!["sentence", "dialogue", "sequence"].includes(kind))
				expect(markup, lesson.id).toMatch(/<svg|explorer/);
		}
		// Past events in the tense-sequence timeline lie before NOW, future ones after it.
		const sequence = TIMELINES["e7-tense-sequence"];
		expect(Math.max(...sequence.modes[0].dots)).toBeLessThan(sequence.now);
		expect(Math.min(...sequence.modes[1].dots)).toBeGreaterThan(sequence.now);
		for (const [id, data] of Object.entries(TIMELINES))
			for (const mode of data.modes)
				for (const [, to] of mode.bars)
					expect(to, id).toBeLessThanOrEqual(data.now);
		expect(CONDITIONS.map((entry) => entry.id)).toEqual([
			"I",
			"II",
			"III",
			"mixed",
			"wish",
		]);
		for (const data of Object.values(TRANSFORMS))
			for (const entry of data.entries)
				expect(entry.example.toLowerCase()).toContain(
					entry.output.split(" ").at(-1)!.toLowerCase(),
				);
	});

	it("places Wales and the US South-West consistently on the learning maps", () => {
		for (const place of Object.values(WALES_PLACES)) {
			expect(inside(place.pin, WALES), place.name).toBe(true);
			expect(inside(place.pin, ENGLAND_BORDER), place.name).toBe(false);
			expect(
				Math.hypot(place.pin[0] - place.labelAt[0], place.pin[1] - place.labelAt[1]),
			).toBeLessThanOrEqual(40);
		}
		for (const point of ANGLESEY) expect(inside(point, WALES)).toBe(false);
		expect(inside(WALES_PLACES.yrWyddfa.pin, ERYRI)).toBe(true);
		expect(inside(WALES_PLACES.cardiff.pin, ERYRI)).toBe(false);
		// Cardiff in the south, Conwy on the north coast.
		expect(WALES_PLACES.cardiff.pin[1]).toBeGreaterThan(WALES_PLACES.conwy.pin[1]);

		for (const id of ["lasVegas", "grandCanyon", "monumentValley", "phoenix", "santaFe"] as const)
			expect(inside(US_PLACES[id].pin, DESERT_SOUTHWEST), id).toBe(true);
		expect(inside(US_PLACES.boston.pin, NEW_ENGLAND)).toBe(true);
		expect(inside(US_PLACES.plymouth.pin, NEW_ENGLAND)).toBe(true);
		expect(US_PLACES.plymouth.pin[1]).toBeGreaterThan(US_PLACES.boston.pin[1]);
		expect(inside(US_PLACES.newYork.pin, NORTHEAST)).toBe(true);
		expect(inside(US_PLACES.washington.pin, SOUTH)).toBe(true);
		expect(inside(US_PLACES.chicago.pin, MIDWEST)).toBe(true);
		expect(inside(US_PLACES.boston.pin, DESERT_SOUTHWEST)).toBe(false);
		expect(US_PLACES.phoenix.pin[0]).toBeLessThan(US_PLACES.santaFe.pin[0]);

		expect(renderWalesMap()).toContain("Croeso i Gymru");
		expect(renderWalesMap()).toContain("Eryri National Park");
		expect(renderUsMap()).toContain("Desert South-West");
		expect(renderUsMap()).toContain("Mayflower, 1620");
		expect(renderFilmScene()).toContain('data-scene-zone="foreground"');
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
		updateDraft(progress, id, 1, "My little brother eats very slowly every day.");
		progress.writingDone.push(writingKey(id, 1));
		expect(isComplete(progress, id)).toBe(false);
		progress.workshopDone.push(id);
		expect(isComplete(progress, id)).toBe(true);
		updateDraft(progress, id, 1, "My best friend speaks English really well.");
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
		expect(STORAGE_KEY).toBe("englisch_gym7_academy_progress_v1");
		const progress = parseProgress(
			JSON.stringify({
				workshopDone: ["bad", "e7-adverbs-manner", "e7-adverbs-manner", "e6-station"],
			}),
		);
		expect(progress.workshopDone).toEqual(["e7-adverbs-manner"]);
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
			trainingBaseUrl("/app/", "?lesson=e7-wales&level=1&keep=yes"),
		).toBe("/app/?keep=yes");
	});
});

describe("ZAM content and the proposed history mapping", () => {
	it("pins identifiers and changes no history without Thomas's approval", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(JSON.stringify(cell)).not.toMatch(/"retired_items"|"replaces"/);
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
		expect(new Set(ids).size).toBe(176);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);

		expect(mapping.rows).toHaveLength(legacyItems.length);
		expect(new Set(mapping.rows.map((row) => row.de_by_id)).size).toBe(
			legacyItems.length,
		);
		for (const row of mapping.rows) {
			expect(legacyItems.some((item) => item.id === row.de_by_id)).toBe(true);
			expect(row.reason.length).toBeGreaterThan(60);
			if (row.category === "A" || row.category === "B") {
				expect(row.action).toBe("propose-replace-after-approval");
				expect(items.filter((item) => item.slug === row.academy_slug)).toHaveLength(1);
			} else {
				expect(row.category).toBe("C");
				expect(["keep-active", "propose-retire-after-approval"]).toContain(row.action);
				expect(row.academy_slug).toBeNull();
			}
		}
		expect(mapping.rows.map((row) => row.category)).toEqual(["A", "C", "C", "C"]);
	});

	it.each(cell.atoms)(
		"links only to real lessons and the Grade 7 curriculum: $slug",
		(atom) => {
			const lesson = findLesson(atom.slug)!;
			expect(lesson).toBeDefined();
			expect(atom.source_link).toBe(lessonLink(lesson.id));
			expect(atom.practice_items).toHaveLength(3);
			expect(new Set(atom.practice_items.map((item) => item.question)).size).toBe(3);
			const bindings = atom.curricula.filter(
				(entry) => entry.provider === "lehrplanplus-bayern",
			);
			expect(bindings.map((entry) => entry.topic_code)).toEqual(
				lesson.bindings.map((lb) => `lb${lb}`),
			);
			for (const binding of bindings) {
				expect(binding).toMatchObject({
					school_type: "gymnasium",
					grade: 7,
					subject: "englisch",
				});
				expect(binding).not.toHaveProperty("track");
			}
			for (const edge of atom.prerequisites) {
				expect(edge.atom_id).not.toBe(atom.id);
				expect(cell.atoms.some((other) => other.id === edge.atom_id)).toBe(true);
			}
			for (const item of atom.practice_items) {
				expect(item.source_link).toBe(lessonLink(lesson.id));
				expect(item.question.length).toBeGreaterThan(15);
				expect(item.concept.length).toBeGreaterThan(2);
				expect(item.question).not.toMatch(/\s\?$/);
				if ("fast_check" in item && item.fast_check) {
					expect(item.fast_check.options).toHaveLength(2);
					expect(item.fast_check.correct_index).toBe(0);
					expect(item.fast_check.options[0]).toBe(item.concept);
					expect(item.fast_check.options[1]).not.toBe(item.concept);
				} else expect((item as { sample_solution?: string }).sample_solution).toBe(item.concept);
			}
		},
	);
});
