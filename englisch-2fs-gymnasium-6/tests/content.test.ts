import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import contract from "./fixtures/public-contract.json";
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
	ALASKA,
	CANADA,
	DC_SIGHTS,
	ENGLAND,
	HAWAII,
	ISLES_PLACES,
	LONDON_NORTH,
	LONDON_SIGHTS,
	LOWER_48,
	MANHATTAN,
	NA_PLACES,
	NORTHERN_IRELAND,
	NY_SIGHTS,
	REPUBLIC_OF_IRELAND,
	SCOTLAND,
	WALES,
	renderBritishIsles,
	renderCityCountry,
	renderLondonMap,
	renderNorthAmerica,
	renderTwoCities,
	riverY,
	type MapPoint,
} from "../src/places-map";
import {
	ampm,
	BLOCKS,
	calendarX,
	clockLabel,
	dateSentence,
	DIALOGUES,
	FESTIVALS,
	festivalNote,
	formatPrice,
	FREQUENCY,
	LAYOUTS,
	NOTES,
	numberWord,
	ordinal,
	ordinalWord,
	PAIRS,
	renderCalendar,
	renderWorkshop,
	SHOP_ITEMS,
	shopBill,
	spokenPrice,
	TIMELINES,
	TRANSFORMS,
	workshopGoals,
} from "../src/workshop";

type Atom = (typeof cell.atoms)[number];
type Item = Atom["practice_items"][number];
const items: Item[] = cell.atoms.flatMap((atom: Atom) => atom.practice_items);

function inside(point: MapPoint, polygon: readonly MapPoint[]): boolean {
	let contained = false;
	for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
		const current = polygon[index];
		const before = polygon[previous];
		if (
			current[1] > point[1] !== before[1] > point[1] &&
			point[0] <
				((before[0] - current[0]) * (point[1] - current[1])) / (before[1] - current[1]) +
					current[0]
		)
			contained = !contained;
	}
	return contained;
}

describe("Grade 6 Gymnasium English (second foreign language) teaching contract", () => {
	it("has eight stages, 43 lessons, 129 workshop goals and 129 ZAM cards", () => {
		expect(LESSONS).toHaveLength(43);
		expect(CORE_LESSONS).toHaveLength(43);
		expect(STAGES).toHaveLength(8);
		for (const stage of STAGES)
			expect(LESSONS.filter((lesson) => lesson.stage === stage.id).length).toBeGreaterThanOrEqual(5);
		expect(new Set(STAGES.map((stage) => stage.hue)).size).toBe(8);
		// Stage accents stay clearly apart on the colour wheel.
		const hues = STAGES.map((stage) => stage.hue).sort((a, b) => a - b);
		for (let i = 1; i < hues.length; i++) expect(hues[i] - hues[i - 1]).toBeGreaterThanOrEqual(20);
		expect(LESSONS.flatMap((lesson) => lesson.workshop.goals)).toHaveLength(129);
		expect(cell.atoms).toHaveLength(43);
		expect(items).toHaveLength(129);
		expect(LESSONS.filter((lesson) => lesson.listening).map((lesson) => lesson.id)).toEqual([
			"e6s-listening",
			"e6s-sounds",
		]);
	});

	it.each(LESSONS)("has substantial teaching and distinct tasks: $id", (lesson) => {
		expect(lesson.id).toMatch(/^e6s-[a-z0-9-]+$/);
		expect(lesson.paragraphs).toHaveLength(2);
		expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(400);
		expect(lesson.material.length).toBeGreaterThan(95);
		expect(lesson.materialLanguage).toBe("en");
		expect(lesson.bindings.length).toBeGreaterThan(0);
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
			expect(entry.prompt, lesson.id).toMatch(/\([^)]+\)$/);
			expect(entry.prompt, lesson.id).toContain("___");
		}
		expect(
			checkPractice(lesson.practice, lesson.practice.map((entry) => entry.answers[0])),
		).toEqual([true, true]);
		expect(checkPractice(lesson.practice, ["wrong", "wrong"])).toEqual([false, false]);
		expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
		for (const task of Object.values(lesson.tasks)) {
			expect(task.criteria).toHaveLength(3);
			expect(task.model.length).toBeGreaterThan(35);
			expect(task.prompt.length).toBeGreaterThan(35);
		}
		for (const id of lesson.sourceIds) expect(SOURCES.some((source) => source.id === id)).toBe(true);
		expect(JSON.stringify(lesson)).not.toMatch(/<script|<p>|<div>|\\\\\(|teacherVideo/);
		const visible = JSON.stringify({
			paragraphs: lesson.paragraphs,
			material: lesson.material,
			quiz: lesson.quiz,
			tasks: lesson.tasks,
			practice: lesson.practice,
			takeaway: lesson.takeaway,
		});
		// German decimal comma and no ASCII hyphen as a minus sign.
		expect(visible).not.toMatch(/\d\.\d/);
		expect(visible).not.toMatch(/\d ?- ?\d+ ?=/);
		for (const goal of lesson.workshop.goals) expect(goal.before).not.toContain("→");
	});

	it.each(LESSONS)("proves every workshop goal reachable and none true initially: $id", (lesson) => {
		expect(lesson.workshop.goals).toHaveLength(3);
		expect(workshopGoals(lesson.workshop, [])).toEqual([false, false, false]);
		expect(
			workshopGoals(lesson.workshop, lesson.workshop.goals.map((goal) => goal.answer)),
		).toEqual([true, true, true]);
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
		expect(coverage.rows).toHaveLength(39);
		expect(coverage.rows.map((row) => row.id)).toEqual(
			Array.from({ length: 39 }, (_, i) => `E6F-${String(i + 1).padStart(2, "0")}`),
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
				coverage.rows.filter((row) => row.lessons.includes(lesson.id)).map((row) => row.lb),
			);
			expect(new Set(lesson.bindings)).toEqual(lbs);
		}
		// Listening, speaking, reading aloud, pronunciation, films, attitudes and current events stay in class.
		for (const id of ["E6F-01", "E6F-02", "E6F-04", "E6F-05", "E6F-06", "E6F-07", "E6F-10", "E6F-18", "E6F-27", "E6F-37"])
			expect(coverage.rows.find((row) => row.id === id)?.status).toBe("supported");
		expect(coverage.neighbours.grade7_second_language.boundary).toContain("present perfect");
		expect(coverage.optional_lessons).toEqual([]);
	});

	it("keeps Grade 7 (second foreign language) targets out of the Grade 6 lessons", () => {
		const text = JSON.stringify(LESSONS);
		// No will-future, present perfect, comparison, relative clauses, possessive pronouns or conditionals.
		expect(text).not.toMatch(/will-future|present perfect|past progressive|conditional|Konditional|relative clause|Relativsatz|Steigerung|comparative|superlative|Possessivpronomen/i);
		expect(text).not.toMatch(/\b(mine|yours|hers|ours|theirs)\b/);
		expect(text).not.toMatch(/\b(biggest|bigger|better than|more \w+ than)\b/);
		expect(text).not.toMatch(/\b(could|might|should)\b/);
		expect(text).not.toMatch(/Cornwall|Lake District|Hadrian|Romans|1066|Florida|Rocky Mountains/);
	});

	it("gives the free-text field the small shared-account note and resets texts too", () => {
		expect(mainSource).toContain("Hast du dein eigenes Benutzerkonto");
		expect(mainSource).toContain("eigenen Texte und Häkchen");
		expect(mainSource).toContain("Hinweis für Eltern und Lehrkräfte");
		expect(mainSource).toContain("129 Wiederholungsfragen");
		expect(mainSource).toContain("43 Lektionen · 129 Entdeckerziele");
		expect(mainSource).toContain("englisch_2fs_gym6_theme");
	});
});

describe("explorer models", () => {
	it("writes cardinal and ordinal numbers correctly", () => {
		expect(numberWord(35)).toBe("thirty-five");
		expect(numberWord(40)).toBe("forty");
		expect(numberWord(14)).toBe("fourteen");
		const ordinals: [number, string, string][] = [
			[1, "1st", "first"],
			[2, "2nd", "second"],
			[3, "3rd", "third"],
			[4, "4th", "fourth"],
			[5, "5th", "fifth"],
			[8, "8th", "eighth"],
			[9, "9th", "ninth"],
			[11, "11th", "eleventh"],
			[12, "12th", "twelfth"],
			[13, "13th", "thirteenth"],
			[20, "20th", "twentieth"],
			[21, "21st", "twenty-first"],
			[22, "22nd", "twenty-second"],
			[23, "23rd", "twenty-third"],
			[30, "30th", "thirtieth"],
			[31, "31st", "thirty-first"],
		];
		for (const [n, figure, word] of ordinals) {
			expect(ordinal(n)).toBe(figure);
			expect(ordinalWord(n)).toBe(word);
		}
		for (let month = 0; month < 12; month++)
			for (let day = 1; day <= 31; day++) {
				const sentence = dateSentence(day, month);
				expect(sentence.written).toMatch(/^My birthday is on \d+(st|nd|rd|th) [A-Z][a-z]+\.$/);
				expect(sentence.spoken).toMatch(/^on the [a-z-]+ of [A-Z][a-z]+$/);
			}
		// February has at most 29 days; April 31 does not exist.
		expect(dateSentence(31, 1).written).toBe("My birthday is on 29th February.");
		expect(dateSentence(31, 3).written).toBe("My birthday is on 30th April.");
	});

	it("tells the time in British English on every five-minute step", () => {
		expect(clockLabel(4, 15)).toBe("quarter past four");
		expect(clockLabel(4, 30)).toBe("half past four");
		expect(clockLabel(4, 40)).toBe("twenty to five");
		expect(clockLabel(7, 45)).toBe("quarter to eight");
		expect(clockLabel(15, 0)).toBe("three o'clock");
		expect(clockLabel(11, 55)).toBe("five to twelve");
		expect(clockLabel(0, 0)).toBe("midnight");
		expect(clockLabel(23, 35)).toBe("twenty-five to twelve");
		expect(ampm(19, 0)).toBe("7:00 p.m.");
		expect(ampm(7, 0)).toBe("7:00 a.m.");
		expect(ampm(0, 15)).toBe("12:15 a.m.");
		expect(ampm(12, 30)).toBe("12:30 p.m.");
		for (let h = 0; h < 24; h++)
			for (let m = 0; m < 60; m += 5) {
				expect(clockLabel(h, m)).not.toMatch(/undefined|NaN/);
				expect(ampm(h, m)).toMatch(/^\d{1,2}:\d{2} [ap]\.m\.$/);
			}
	});

	it("adds up shop bills and change in pounds and pence on every setting", () => {
		expect(formatPrice(250)).toBe("£2.50");
		expect(formatPrice(80)).toBe("80p");
		expect(formatPrice(1400)).toBe("£14.00");
		expect(spokenPrice(250)).toBe("two pounds fifty");
		expect(spokenPrice(80)).toBe("eighty p");
		expect(spokenPrice(100)).toBe("one pound");
		expect(spokenPrice(1405)).toBe("fourteen pounds five");
		// The lesson material: a cap and two pairs of socks with £20.
		const bill = shopBill([1, 2, 0, 0, 0], 2000);
		expect(bill.total).toBe(1400);
		expect(bill.change).toBe(600);
		expect(bill.changeText).toContain("six pounds");
		let combinations = 0;
		for (let a = 0; a < 4; a++)
			for (let b = 0; b < 4; b++)
				for (let c = 0; c < 4; c++)
					for (let d = 0; d < 4; d++)
						for (let e = 0; e < 4; e++)
							for (const note of NOTES) {
								const result = shopBill([a, b, c, d, e], note);
								const expected =
									a * SHOP_ITEMS[0].pence + b * SHOP_ITEMS[1].pence + c * SHOP_ITEMS[2].pence + d * SHOP_ITEMS[3].pence + e * SHOP_ITEMS[4].pence;
								expect(result.total).toBe(expected);
								expect(result.change).toBe(note - expected);
								expect(`${result.totalText} ${result.changeText}`).not.toMatch(/undefined|NaN|£-|-£|-\d/);
								combinations++;
							}
		expect(combinations).toBe(3072);
	});

	it("dates the UK festivals with the right weekday every year", () => {
		// 5 November 2026 is a Thursday, 25 December 2026 a Friday.
		const bonfire = FESTIVALS.find((festival) => festival.id === "bonfire")!;
		expect(festivalNote(bonfire, 2026)).toContain("Thursday, 5th November 2026");
		expect(festivalNote(FESTIVALS.find((f) => f.id === "christmas")!, 2026)).toContain("Friday, 25th December 2026");
		expect(FESTIVALS.map((f) => [f.month, f.day])).toEqual([
			[2, 1],
			[2, 17],
			[9, 31],
			[10, 5],
			[11, 25],
			[11, 26],
		]);
		for (let year = 2024; year <= 2040; year++)
			for (const festival of FESTIVALS) {
				const x = calendarX(festival.month, festival.day);
				expect(x).toBeGreaterThan(20 + festival.month * 36);
				expect(x).toBeLessThan(20 + (festival.month + 1) * 36);
				expect(festivalNote(festival, year)).toContain(String(year));
			}
		// Neighbouring festivals sit in different lanes, so their markers never overlap.
		for (let i = 1; i < FESTIVALS.length; i++) {
			const a = FESTIVALS[i - 1];
			const b = FESTIVALS[i];
			if (Math.abs(calendarX(a.month, a.day) - calendarX(b.month, b.day)) < 22)
				expect(a.lane).not.toBe(b.lane);
		}
		expect(renderCalendar(2026)).not.toMatch(/NaN|undefined/);
	});

	it("has data for every data-driven explorer and renders every workshop", () => {
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
			if (kind === "blocks") expect(BLOCKS[lesson.id], lesson.id).toBeDefined();
			if (kind === "dialogue") expect(DIALOGUES[lesson.id], lesson.id).toBeDefined();
			const markup = renderWorkshop(lesson);
			expect(markup).not.toMatch(/NaN|undefined/);
			expect(markup, lesson.id).toMatch(/<svg|explorer/);
		}
		// Past events lie before NOW, plans after it.
		const past = TIMELINES["e6s-simple-past"];
		for (const mode of past.modes) {
			for (const x of mode.dots) expect(x).toBeLessThan(past.now);
			for (const [, to] of mode.bars) expect(to).toBeLessThan(past.now);
		}
		const plan = TIMELINES["e6s-going-to"];
		for (const mode of plan.modes) expect(Math.max(...mode.dots)).toBeGreaterThan(plan.now);
		const progressive = TIMELINES["e6s-progressive"];
		const [from, to] = progressive.modes[0].bars[0];
		expect(from).toBeLessThan(progressive.now);
		expect(to).toBeGreaterThan(progressive.now);
		// Transform examples use the form they teach; tags exist in every dialogue line.
		for (const data of Object.values(TRANSFORMS))
			for (const entry of data.entries)
				expect(entry.example.toLowerCase()).toContain(entry.output.split(" ").at(-1)!.toLowerCase());
		for (const data of Object.values(DIALOGUES))
			for (const line of data.lines)
				for (const tag of line.tags) expect(data.tags.some((entry) => entry.key === tag)).toBe(true);
		// The frequency grid matches the adverb: always 7, never 0, and decreasing.
		expect(FREQUENCY.map((entry) => entry.days.length)).toEqual([7, 5, 3, 1, 0]);
		// The two classroom-English pairs come from the lesson text.
		expect(PAIRS["e6s-language-links"].rows.map(([de, en]) => `${de}=${en}`)).toContain("bekommen=get");
	});

	it("keeps places on the learning maps consistent with the lessons", () => {
		expect(inside(ISLES_PLACES.london.pin, ENGLAND)).toBe(true);
		expect(inside(ISLES_PLACES.edinburgh.pin, SCOTLAND)).toBe(true);
		expect(inside(ISLES_PLACES.cardiff.pin, WALES)).toBe(true);
		expect(inside(ISLES_PLACES.belfast.pin, NORTHERN_IRELAND)).toBe(true);
		expect(inside(ISLES_PLACES.dublin.pin, REPUBLIC_OF_IRELAND)).toBe(true);
		expect(inside(ISLES_PLACES.dublin.pin, NORTHERN_IRELAND)).toBe(false);
		expect(inside(ISLES_PLACES.cardiff.pin, ENGLAND)).toBe(false);
		// Ireland lies west of Great Britain.
		expect(Math.max(...REPUBLIC_OF_IRELAND.map(([x]) => x))).toBeLessThan(Math.min(...WALES.map(([x]) => x)));

		// London: the London Eye is across the river from Parliament; the others are north of the Thames.
		for (const key of LONDON_NORTH) expect(LONDON_SIGHTS[key].pin[1], key).toBeLessThan(riverY(LONDON_SIGHTS[key].pin[0]));
		expect(LONDON_SIGHTS.eye.pin[1]).toBeGreaterThan(riverY(LONDON_SIGHTS.eye.pin[0]));
		expect(Math.abs(LONDON_SIGHTS.towerBridge.pin[1] - riverY(LONDON_SIGHTS.towerBridge.pin[0]))).toBeLessThan(3);
		expect(LONDON_SIGHTS.tower.pin[0]).toBeGreaterThan(LONDON_SIGHTS.parliament.pin[0]);

		expect(inside(NA_PLACES.ottawa.pin, CANADA)).toBe(true);
		expect(inside(NA_PLACES.toronto.pin, CANADA)).toBe(true);
		expect(inside(NA_PLACES.vancouver.pin, CANADA)).toBe(true);
		expect(inside(NA_PLACES.washington.pin, LOWER_48)).toBe(true);
		expect(inside(NA_PLACES.newYork.pin, LOWER_48)).toBe(true);
		expect(inside(NA_PLACES.anchorage.pin, ALASKA)).toBe(true);
		expect(inside(NA_PLACES.honolulu.pin, HAWAII)).toBe(true);
		expect(inside(NA_PLACES.anchorage.pin, LOWER_48)).toBe(false);
		// Alaska borders Canada; New York is north-east of Washington.
		expect(ALASKA.some(([x, y]) => CANADA.some(([cx, cy]) => cx === x && cy === y))).toBe(true);
		expect(NA_PLACES.newYork.pin[0]).toBeGreaterThan(NA_PLACES.washington.pin[0]);
		expect(NA_PLACES.newYork.pin[1]).toBeLessThan(NA_PLACES.washington.pin[1]);

		// Washington: Lincoln Memorial – Washington Monument – Capitol from west to east, White House to the north.
		expect(DC_SIGHTS.lincoln.pin[0]).toBeLessThan(DC_SIGHTS.monument.pin[0]);
		expect(DC_SIGHTS.monument.pin[0]).toBeLessThan(DC_SIGHTS.capitol.pin[0]);
		expect(DC_SIGHTS.whiteHouse.pin[1]).toBeLessThan(DC_SIGHTS.monument.pin[1]);
		// New York: Central Park north of Times Square north of the Empire State Building; Liberty Island off Manhattan.
		expect(NY_SIGHTS.centralPark.pin[1]).toBeLessThan(NY_SIGHTS.timesSquare.pin[1]);
		expect(NY_SIGHTS.timesSquare.pin[1]).toBeLessThan(NY_SIGHTS.empire.pin[1]);
		for (const key of ["centralPark", "timesSquare", "empire"] as const)
			expect(inside(NY_SIGHTS[key].pin, MANHATTAN), key).toBe(true);
		expect(inside(NY_SIGHTS.liberty.pin, MANHATTAN)).toBe(false);

		for (const markup of [renderBritishIsles(), renderLondonMap(), renderNorthAmerica(), renderTwoCities(), renderCityCountry()]) {
			expect(markup).not.toMatch(/NaN|undefined/);
			expect(markup).toContain("data-focus-root");
		}
		expect(renderNorthAmerica()).toContain("Hawaii (USA)");
		expect(renderLondonMap()).toContain("London Eye");
	});
});

describe("answer handling, progress and routes", () => {
	it("treats apostrophes as equal and keeps its distinct from it's", () => {
		expect(normalise(" don't ")).toBe("don't");
		expect(normalise("don’t")).toBe("don't");
		expect(normalise("its")).not.toBe(normalise("it's"));
	});

	it("requires workshop, checks and a real self-assessed draft", () => {
		const progress = freshProgress();
		const id = progress.activeLessonId;
		progress.quizDone.push(id);
		progress.practiceDone.push(id);
		updateDraft(progress, id, 1, "Hi Amy! I'm Mia and I'm from Augsburg.");
		progress.writingDone.push(writingKey(id, 1));
		expect(isComplete(progress, id)).toBe(false);
		progress.workshopDone.push(id);
		expect(isComplete(progress, id)).toBe(true);
		updateDraft(progress, id, 1, "Hello, my name is Mia. Nice to meet you.");
		expect(isComplete(progress, id)).toBe(false);
		expect(canReview(" ".repeat(100))).toBe(false);
		expect(canAccept("Eine eigene vollständige Antwort.", [true, true, false])).toBe(false);
		expect(canAccept("Eine eigene vollständige Antwort.", [true, true, true])).toBe(true);
	});

	it("recovers corrupted state and isolates its storage key", () => {
		for (const raw of [null, "null", "[]", "42", "bad json"])
			expect(parseProgress(raw)).toEqual(freshProgress());
		expect(STORAGE_KEY).toBe("englisch_2fs_gym6_academy_progress_v1");
		const progress = parseProgress(
			JSON.stringify({ workshopDone: ["bad", "e6s-hello", "e6s-hello", "e6-station"] }),
		);
		expect(progress.workshopDone).toEqual(["e6s-hello"]);
	});

	it("keeps both task levels and all lesson deep links valid", () => {
		for (const lesson of LESSONS)
			for (const level of [1, 2] as const)
				expect(parseTrainingDeepLink(`#lesson=${lesson.id}&level=${level}`)).toEqual({
					lessonId: lesson.id,
					level,
				});
		expect(trainingBaseUrl("/app/", "?lesson=e6s-london&level=1&keep=yes")).toBe("/app/?keep=yes");
	});
});

describe("ZAM content", () => {
	it("pins identifiers and declares no history changes", () => {
		expect(cell.tile_id).toBe(ZAM_CELL_ID);
		expect(ZAM_CELL_ID).toBe("zam-academy:englisch-2fs-gymnasium-6");
		expect(JSON.stringify(cell)).not.toMatch(/"retired_items"|"replaces"/);
		expect(
			cell.atoms.map((atom: Atom) => ({
				id: atom.id,
				slug: atom.slug,
				lesson: atom.source_link,
				items: atom.practice_items.map((item) => ({ id: item.id, slug: item.slug })),
			})),
		).toEqual(contract);
		const ids = [...cell.atoms, ...items].map((entry) => entry.id);
		expect(new Set(ids).size).toBe(172);
		for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
	});

	it.each(cell.atoms)("links only to real lessons and the Grade 6 second-language curriculum: $slug", (atom: Atom) => {
		const lesson = findLesson(atom.slug)!;
		expect(lesson).toBeDefined();
		expect(atom.source_link).toBe(lessonLink(lesson.id));
		expect(atom.practice_items).toHaveLength(3);
		expect(new Set(atom.practice_items.map((item) => item.question)).size).toBe(3);
		const bindings = atom.curricula.filter((entry) => entry.provider === "lehrplanplus-bayern");
		expect(bindings.map((entry) => entry.topic_code)).toEqual(lesson.bindings.map((lb) => `lb${lb}`));
		for (const binding of bindings) {
			expect(binding).toMatchObject({ school_type: "gymnasium", grade: 6, subject: "englisch-2fs" });
			expect(binding).not.toHaveProperty("track");
		}
		const order = LESSONS.map((entry) => entry.id);
		for (const edge of atom.prerequisites) {
			expect(edge.atom_id).not.toBe(atom.id);
			const prerequisite = cell.atoms.find((other: Atom) => other.id === edge.atom_id);
			expect(prerequisite).toBeDefined();
			// A card builds only on lessons that come earlier on the path.
			expect(order.indexOf(prerequisite!.slug)).toBeLessThan(order.indexOf(atom.slug));
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
	});
});
