import { describe, expect, it } from "vitest";
import { completion, freshProgress } from "../src/storage/progress";
import {
	FRANCE_CITIES,
	FRANCE_LAND,
	FRANCE_MOUNTAINS,
	FRANCE_RIVERS,
	QUEBEC_CITIES,
	QUEBEC_RIVER,
	type MapPoint,
} from "../src/france-map";

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

describe("Grade 8 maps", () => {
	it("puts Lille in the north near Belgium and Marseille on the Mediterranean coast", () => {
		const { lille, paris, marseille } = FRANCE_CITIES;
		expect(lille.pin[1]).toBeLessThan(paris.pin[1] - 40);
		expect(marseille.pin[1]).toBeGreaterThan(paris.pin[1] + 180);
		expect(lineDistance(lille.pin, [...FRANCE_LAND, FRANCE_LAND[0]])).toBeLessThan(25);
	});
	it("sets Montréal and Québec on the St. Lawrence, Québec downstream to the north-east", () => {
		const { montreal, quebec, ottawa } = QUEBEC_CITIES;
		expect(lineDistance(montreal.pin, QUEBEC_RIVER)).toBe(0);
		expect(lineDistance(quebec.pin, QUEBEC_RIVER)).toBe(0);
		expect(quebec.pin[0]).toBeGreaterThan(montreal.pin[0]);
		expect(quebec.pin[1]).toBeLessThan(montreal.pin[1]);
		expect(ottawa.pin[0]).toBeLessThan(montreal.pin[0]);
		expect(QUEBEC_RIVER.at(-1)![0]).toBeGreaterThan(quebec.pin[0]);
	});
});

describe("course progress", () => {
	it("counts only lessons in the 2. Fremdsprache package", () => {
		const progress = freshProgress();
		expect(completion(progress)).toEqual({ completed: 0, total: 43, percent: 0 });
	});
});
