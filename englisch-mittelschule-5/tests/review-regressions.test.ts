import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import { findLesson, LESSONS } from "../src/curriculum";
import { checkPractice } from "../src/practice";
import {
	ENGLAND_LAND,
	type MapPoint,
	NORTHERN_IRELAND_LAND,
	REPUBLIC_OF_IRELAND_LAND,
	SCOTLAND_LAND,
	UK_CITIES,
	WALES_LAND,
} from "../src/uk-map";
import { clockLabel } from "../src/workshop";

function onLand([x, y]: MapPoint, polygon: readonly MapPoint[]): boolean {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const a = polygon[i],
			b = polygon[j];
		if (
			a[1] > y !== b[1] > y &&
			x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]
		)
			inside = !inside;
	}
	return inside;
}

describe("reviewed learner-facing language and curriculum rules", () => {
	it("distinguishes language subjects from general school subjects in capitalisation", () => {
		const lesson = findLesson("e5m-timetable-clock")!;
		expect(lesson.takeaway).toContain("Sprachnamen (English, German)");
		expect(lesson.takeaway).toContain("klein");
		expect(lesson.tasks[1].model).toContain("At ten o'clock we have maths.");
	});

	it("asks an unambiguous neutral some/any question in the quiz", () => {
		const quiz = findLesson("e5m-some-any-no-this-that")!.quiz;
		expect(quiz.question).toContain("neutral information question");
		expect(quiz.answer).toBe("Are there any bananas in the bag?");
		expect(quiz.wrong).toEqual([
			"Is there any bananas in the bag?",
			"There aren't no bananas in the bag.",
		]);
	});

	it("keeps past-tense story, invitation length, rhyme and British vocabulary clean", () => {
		const past = findLesson("e5m-simple-past-did-svo")!;
		expect(past.material).toContain("took funny photos");
		expect(past.material).not.toContain("made funny photos");
		expect(past.material).not.toContain("rain today");

		const rhyme = findLesson("e5m-riddles-rhymes-stories")!;
		expect(rhyme.tasks[2].model).toContain("fur so fair");
		expect(rhyme.tasks[2].model).toContain("garden chair");

		const inv = findLesson("e5m-invitations-letters")!;
		expect(inv.tasks[1].model).toContain("crisps");
		expect(inv.tasks[2].model.split(/\s+/).length).toBeGreaterThanOrEqual(50);

		const festival = findLesson("e5m-festivals-traditions")!;
		expect(festival.tasks[1].model).toContain("Christmas Eve");
		expect(festival.tasks[2].model).not.toContain("twenty-four");

		const garden = findLesson("e5m-pets-home-scene")!;
		expect(garden.scene?.items.map((item) => item.label)).toEqual(
			expect.arrayContaining([
				"house",
				"fence",
				"dog",
				"terrace",
				"sofa",
				"bike",
				"tree",
				"cat",
				"box",
			]),
		);
	});

	it("stays inside Grade 5 boundaries across lessons and ZAM cards (no E6 modals, ordinals or feet/teeth)", () => {
		for (const lesson of LESSONS) {
			const body = [
				...lesson.paragraphs,
				lesson.takeaway,
				lesson.material,
				lesson.tasks[1].model,
				lesson.tasks[2].model,
			].join(" ");
			expect(body).not.toMatch(/\b(feet|teeth)\b/i);
			expect(body).not.toMatch(/\b\d+(st|nd|rd|th)\b/i);
			expect(body).not.toMatch(/\bwalk on foot\b/i);
			expect(body).not.toMatch(/\bWe can\b/i);
		}
		for (const atom of cell.atoms) {
			for (const item of atom.practice_items) {
				expect(item.question).not.toMatch(/^Schreibe\s+(zwei|eine|drei)\b/);
			}
		}
	});
});

describe("practice positive/negative cases and workshop clock", () => {
	it("accepts standard time and lunch variants and rejects invalid answers", () => {
		const clock = findLesson("e5m-timetable-clock")!;
		for (const accepted of [
			"quarter to nine",
			"a quarter to nine",
			"eight forty-five",
			"Quarter to nine.",
		]) {
			expect(checkPractice([clock.practice[0]], [accepted])).toEqual([true]);
		}
		for (const rejected of ["quarter past nine", "half past eight", ""]) {
			expect(checkPractice([clock.practice[0]], [rejected])).toEqual([false]);
		}

		const meals = findLesson("e5m-meals-daily-routine")!;
		expect(checkPractice(meals.practice, ["get", "fruit"])).toEqual([true, true]);
		expect(checkPractice(meals.practice, ["get", "water"])).toEqual([true, true]);
		expect(checkPractice(meals.practice, ["get", "pizza"])).toEqual([true, false]);
	});

	it("renders finite clock readouts across every hour and quarter-hour setting", () => {
		for (let h = 0; h < 24; h++) {
			for (const m of [0, 15, 30, 45]) {
				expect(clockLabel(h, m)).not.toMatch(/undefined|NaN/);
			}
		}
	});
});

describe("UK schematic map geometry", () => {
	it("places every city pin and label inside its own land polygon and close together", () => {
		const pairs = [
			[UK_CITIES.london, ENGLAND_LAND],
			[UK_CITIES.edinburgh, SCOTLAND_LAND],
			[UK_CITIES.cardiff, WALES_LAND],
			[UK_CITIES.belfast, NORTHERN_IRELAND_LAND],
			[UK_CITIES.dublin, REPUBLIC_OF_IRELAND_LAND],
		] as const;

		for (const [city, land] of pairs) {
			expect(onLand(city.pin, land), `${city.name} pin`).toBe(true);
			expect(onLand(city.labelAt, land), `${city.name} label`).toBe(true);
			expect(
				Math.hypot(city.labelAt[0] - city.pin[0], city.labelAt[1] - city.pin[1]),
				`${city.name} label distance`,
			).toBeLessThan(95);
		}
	});

	it("preserves geographic relations and Scotland proportions", () => {
		expect(UK_CITIES.edinburgh.pin[0]).toBeGreaterThan(300);
		expect(UK_CITIES.cardiff.pin[1]).toBeGreaterThan(300);
		expect(UK_CITIES.dublin.pin[0]).toBeGreaterThan(160);
		expect(UK_CITIES.belfast.pin[1]).toBeLessThan(UK_CITIES.dublin.pin[1]);

		const scotlandYs = SCOTLAND_LAND.map((p) => p[1]);
		const scotlandHeight = Math.max(...scotlandYs) - Math.min(...scotlandYs);
		expect(scotlandHeight).toBeGreaterThanOrEqual(135);
	});
});

describe("no history transfer contract in Vitest", () => {
	it("keeps proposal-only state and leaves neighbouring Gymnasium cells untouched", () => {
		expect(mapping.schema).toBe(1);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toEqual([]);
		expect(mapping.sources).toEqual([]);
		expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);
		expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
	});
});
