import { describe, expect, it } from "vitest";
import { completion, freshProgress } from "../src/storage/progress";
import { findLesson } from "../src/curriculum";
import { checkPractice } from "../src/practice";
import {
	FRANCE_CITIES,
	FRANCE_LAND,
	FRANCE_MOUNTAINS,
	FRANCE_RIVERS,
	type MapPoint,
} from "../src/france-map";
import { clockLabel } from "../src/workshop";

function segmentDistance(p: MapPoint, a: MapPoint, b: MapPoint): number {
	const dx = b[0] - a[0],
		dy = b[1] - a[1];
	const t = Math.max(
		0,
		Math.min(
			1,
			((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy),
		),
	);
	return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}
function lineDistance(p: MapPoint, points: readonly MapPoint[]): number {
	return Math.min(
		...points.slice(1).map((b, i) => segmentDistance(p, points[i], b)),
	);
}
function onLand([x, y]: MapPoint): boolean {
	let inside = false;
	for (let i = 0, j = FRANCE_LAND.length - 1; i < FRANCE_LAND.length; j = i++) {
		const a = FRANCE_LAND[i],
			b = FRANCE_LAND[j];
		if (
			a[1] > y !== b[1] > y &&
			x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]
		)
			inside = !inside;
	}
	return inside;
}

describe("reviewed learner-facing language", () => {
	it("accepts both common decimal separators in the bakery price", () => {
		const price = findLesson("f6-2-mediation")!.practice[0];
		for (const input of ["1,50", "1.50", "1,5", "1.5"])
			expect(checkPractice([price], [input])).toEqual([true]);
		expect(checkPractice([price], ["1,05"])).toEqual([false]);
	});

	it("makes the possessive quiz a first-person utterance completed by the whole answer", () => {
		const quiz = findLesson("f6-2-famille")!.quiz;
		expect(quiz.question.replace("…", ` ${quiz.answer}.`)).toBe(
			"Lina dit : « Voici ma mère. »",
		);
		expect(quiz.explanation).toContain("Lina spricht selbst");
	});
	it.each([
		[0, 0, "minuit"],
		[0, 15, "minuit quinze"],
		[0, 30, "minuit trente"],
		[0, 45, "minuit quarante-cinq"],
		[12, 0, "midi"],
		[12, 15, "midi quinze"],
		[12, 30, "midi trente"],
		[12, 45, "midi quarante-cinq"],
		[1, 0, "une heure"],
		[1, 30, "une heure trente"],
		[21, 0, "vingt et une heures"],
		[21, 45, "vingt et une heures quarante-cinq"],
	] as const)("reads %i:%i as %s", (h, m, expected) => {
		expect(clockLabel(h, m)).toBe(expected);
	});
});

describe("map meaning survives schematic simplification", () => {
	it("places both mountain ranges and their labels on the mainland", () => {
		for (const { name, labelAt, peaks } of FRANCE_MOUNTAINS) {
			expect(onLand(labelAt), name).toBe(true);
			for (const peak of peaks)
				for (const point of peak)
					expect(onLand(point), `${name} at ${point}`).toBe(true);
		}
	});

	it("puts Paris, Lyon, Nantes, Bordeaux and Toulouse on the rivers taught in the lesson", () => {
		for (const [city, river] of [
			[FRANCE_CITIES.paris, FRANCE_RIVERS.seine],
			[FRANCE_CITIES.lyon, FRANCE_RIVERS.rhone],
			[FRANCE_CITIES.nantes, FRANCE_RIVERS.loire],
			[FRANCE_CITIES.bordeaux, FRANCE_RIVERS.garonne],
			[FRANCE_CITIES.toulouse, FRANCE_RIVERS.garonne],
		] as const)
			expect(lineDistance(city.pin, river.points), city.name).toBe(0);
	});
	it("ends the rivers at the coast and the Rhône west of Marseille", () => {
		const coast = [...FRANCE_LAND, FRANCE_LAND[0]];
		for (const river of Object.values(FRANCE_RIVERS))
			expect(
				lineDistance(river.points.at(-1)!, coast),
				river.name,
			).toBeLessThan(1);
		const mouth = FRANCE_RIVERS.rhone.points.at(-1)!;
		expect(mouth[0]).toBeLessThan(FRANCE_CITIES.marseille.pin[0]);
		expect(
			lineDistance(FRANCE_CITIES.marseille.pin, FRANCE_RIVERS.rhone.points),
		).toBeGreaterThan(20);
	});
	it("keeps city labels beside their pins and river labels beside their lines, on land", () => {
		for (const city of Object.values(FRANCE_CITIES)) {
			expect(onLand(city.pin), city.name).toBe(true);
			expect(onLand(city.labelAt), city.name).toBe(true);
			expect(
				Math.hypot(
					city.labelAt[0] - city.pin[0],
					city.labelAt[1] - city.pin[1],
				),
				city.name,
			).toBeLessThan(24);
		}
		for (const river of Object.values(FRANCE_RIVERS)) {
			expect(onLand(river.labelAt), river.name).toBe(true);
			expect(
				lineDistance(river.labelAt, river.points),
				river.name,
			).toBeLessThan(30);
		}
	});
});

describe("single second-language path", () => {
	it("counts progress over all 46 lessons of the first year of French", () => {
		expect(completion(freshProgress())).toEqual({ completed: 0, total: 46, percent: 0 });
		expect(freshProgress().activeLessonId).toBe("f6-2-bonjour");
	});
});
