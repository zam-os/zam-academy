import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import { findLesson, LESSONS } from "../src/curriculum";
import {
	ENGLAND_LAND,
	type MapPoint,
	NORTHERN_IRELAND_LAND,
	REPUBLIC_OF_IRELAND_LAND,
	SCOTLAND_LAND,
	TOWN_PLACES,
	UK_MAJOR_CITIES,
	US_CITIES,
	US_MID_ATLANTIC,
	US_MIDWEST,
	US_NORTHEAST,
	US_ROCKIES,
	US_SOUTH,
	US_WEST,
	WALES_LAND,
} from "../src/places-map";
import { checkPractice } from "../src/practice";
import {
	britishDateSpoken,
	comparisonOutput,
	numberWords,
	ordinalWord,
} from "../src/workshop";

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
	it("enforces German typography rules (no decimal dots, no ASCII minus before digits, no leaked E5 IDs)", () => {
		for (const lesson of LESSONS) {
			const germanParts = [
				...lesson.paragraphs,
				lesson.takeaway,
				lesson.quiz.explanation,
				...lesson.practice.map((p) => p.feedback),
				lesson.tasks[1].prompt,
				lesson.tasks[2].prompt,
				...lesson.tasks[1].criteria,
				...lesson.tasks[2].criteria,
				...lesson.workshop.goals.map((g) => `${g.label} ${g.explanation}`),
			].join("\n");
			expect(germanParts).not.toMatch(/\d\.\d/);
			expect(germanParts).not.toMatch(/(?<![A-Za-z0-9])-\d/);

			const all = JSON.stringify(lesson);
			expect(all).not.toMatch(/\be5m-|englisch-mittelschule-5|\bms5\b/);
		}

		for (const atom of cell.atoms) {
			for (const item of atom.practice_items) {
				expect(item.question).not.toMatch(/^Schreibe\s+(eine|zwei|drei|vier)\b/);
				expect(item.question).not.toMatch(
					/\b(present perfect|going-to-future|past progressive|should|myself|yourself|mine|yours)\b/i,
				);
			}
		}
	});

	it("keeps hometown temperature minus sign, Sam's room scene and club/sports charts clean", () => {
		const hometown = findLesson("e6m-hometown-weather")!;
		expect(hometown.paragraphs.join(" ")).toContain("−2 °C");
		expect(hometown.material).toContain("−2 °C");

		const room = findLesson("e6m-room-flat-prepositions")!;
		const items = room.scene?.items ?? [];
		expect(items.map((i) => i.label)).toEqual(
			expect.arrayContaining([
				"window",
				"poster",
				"shelf",
				"desk",
				"lamp",
				"chair",
				"bed",
				"rug",
				"box",
			]),
		);
		for (const item of items) {
			expect(item.x).toBeGreaterThanOrEqual(0);
			expect(item.y).toBeGreaterThanOrEqual(0);
			expect(item.x + item.w).toBeLessThanOrEqual(620);
			expect(item.y + item.h).toBeLessThanOrEqual(340);
		}
	});

	it("accepts contracted/uncontracted forms and rejects wrong answers in practice", () => {
		const modals = findLesson("e6m-modals-can-must-have-to")!;
		expect(checkPractice(modals.practice, ["has to", "don't have to"])).toEqual([
			true,
			true,
		]);
		expect(
			checkPractice(modals.practice, ["has got to", "do not have to"]),
		).toEqual([true, true]);
		expect(checkPractice(modals.practice, ["have to", "must"])).toEqual([
			false,
			false,
		]);

		const future = findLesson("e6m-will-future")!;
		expect(checkPractice(future.practice, ["won't rain", "will"])).toEqual([
			true,
			true,
		]);
		expect(checkPractice(future.practice, ["will not rain", "will"])).toEqual([
			true,
			true,
		]);
		expect(checkPractice(future.practice, ["doesn't rain", "'ll"])).toEqual([
			false,
			false,
		]);
	});

	it("produces finite readouts for numbers, ordinals and comparisons without Romance more/most", () => {
		for (let n = 0; n <= 1000; n++) {
			expect(numberWords(n)).not.toMatch(/undefined|NaN/);
		}
		for (let d = 1; d <= 31; d++) {
			expect(ordinalWord(d)).not.toMatch(/undefined|NaN/);
			expect(britishDateSpoken(d, "May")).toMatch(/^the .+ of May$/);
		}
		for (let a = 10; a <= 100; a += 15) {
			for (let b = 10; b <= 100; b += 15) {
				const out = comparisonOutput(a, b);
				expect(out.en).not.toMatch(/undefined|NaN|\b(more|most)\b/i);
			}
		}
	});
});

describe("UK, USA and Town schematic map geometry", () => {
	it("places every UK city pin and label inside its own land polygon", () => {
		const pairs = [
			[UK_MAJOR_CITIES.edinburgh, SCOTLAND_LAND],
			[UK_MAJOR_CITIES.glasgow, SCOTLAND_LAND],
			[UK_MAJOR_CITIES.london, ENGLAND_LAND],
			[UK_MAJOR_CITIES.manchester, ENGLAND_LAND],
			[UK_MAJOR_CITIES.liverpool, ENGLAND_LAND],
			[UK_MAJOR_CITIES.birmingham, ENGLAND_LAND],
			[UK_MAJOR_CITIES.cardiff, WALES_LAND],
			[UK_MAJOR_CITIES.belfast, NORTHERN_IRELAND_LAND],
			[UK_MAJOR_CITIES.dublin, REPUBLIC_OF_IRELAND_LAND],
		] as const;

		for (const [city, land] of pairs) {
			expect(onLand(city.pin, land), `${city.name} pin`).toBe(true);
			expect(onLand(city.labelAt, land), `${city.name} label`).toBe(true);
			expect(
				Math.hypot(city.labelAt[0] - city.pin[0], city.labelAt[1] - city.pin[1]),
				`${city.name} label distance`,
			).toBeLessThan(95);
		}

		expect(UK_MAJOR_CITIES.glasgow.pin[0]).toBeLessThan(
			UK_MAJOR_CITIES.edinburgh.pin[0],
		);
		expect(UK_MAJOR_CITIES.liverpool.pin[0]).toBeLessThan(
			UK_MAJOR_CITIES.manchester.pin[0],
		);
		expect(UK_MAJOR_CITIES.manchester.pin[1]).toBeLessThan(
			UK_MAJOR_CITIES.birmingham.pin[1],
		);
		expect(UK_MAJOR_CITIES.birmingham.pin[1]).toBeLessThan(
			UK_MAJOR_CITIES.london.pin[1],
		);
		expect(UK_MAJOR_CITIES.belfast.pin[1]).toBeLessThan(
			UK_MAJOR_CITIES.dublin.pin[1],
		);
		const scotlandYs = SCOTLAND_LAND.map((p: MapPoint) => p[1]);
		expect(Math.max(...scotlandYs) - Math.min(...scotlandYs)).toBeGreaterThanOrEqual(
			140,
		);
	});

	it("places every US city pin and label inside its own region polygon", () => {
		const pairs = [
			[US_CITIES.seattle, US_WEST],
			[US_CITIES.losAngeles, US_WEST],
			[US_CITIES.denver, US_ROCKIES],
			[US_CITIES.chicago, US_MIDWEST],
			[US_CITIES.houston, US_SOUTH],
			[US_CITIES.miami, US_SOUTH],
			[US_CITIES.newYork, US_NORTHEAST],
			[US_CITIES.washington, US_MID_ATLANTIC],
		] as const;

		for (const [city, region] of pairs) {
			expect(onLand(city.pin, region), `${city.name} pin`).toBe(true);
			expect(onLand(city.labelAt, region), `${city.name} label`).toBe(true);
			expect(
				Math.hypot(city.labelAt[0] - city.pin[0], city.labelAt[1] - city.pin[1]),
				`${city.name} label distance`,
			).toBeLessThan(95);
		}

		expect(US_CITIES.washington.capital).toBe(true);
		expect(US_CITIES.newYork.capital).toBe(false);
		expect(US_CITIES.seattle.pin[1]).toBeLessThan(US_CITIES.losAngeles.pin[1]);
		expect(US_CITIES.newYork.pin[1]).toBeLessThan(US_CITIES.washington.pin[1]);
	});

	it("keeps town map places within canvas and non-overlapping", () => {
		const places = Object.values(TOWN_PLACES);
		for (let i = 0; i < places.length; i++) {
			const a = places[i];
			expect(a.x).toBeGreaterThan(0);
			expect(a.y).toBeGreaterThan(0);
			expect(a.x + a.w).toBeLessThan(620);
			expect(a.y + a.h).toBeLessThan(370);
			for (let j = i + 1; j < places.length; j++) {
				const b = places[j];
				const overlapX = a.x < b.x + b.w && a.x + a.w > b.x;
				const overlapY = a.y < b.y + b.h && a.y + a.h > b.y;
				expect(overlapX && overlapY, `${a.label} vs ${b.label}`).toBe(false);
			}
		}
	});
});

describe("no history transfer contract in Vitest", () => {
	it("keeps proposal-only state and leaves existing cells untouched", () => {
		expect(mapping.schema).toBe(1);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toEqual([]);
		expect(mapping.sources).toEqual([]);
		expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);
		expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
	});
});
