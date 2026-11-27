import { describe, expect, it } from "vitest";
import mapping from "../replaces-de-by.json";
import cell from "../cell.json";
import legacy7 from "./fixtures/de-by-gymnasium-7-franzoesisch-passe-compose-relativsaetze-verneinung-kvt.json";
import { completion, freshProgress } from "../src/storage/progress";
import {
	FRANCE_CITIES,
	FRANCE_LAND,
	FRANCE_MOUNTAINS,
	FRANCE_RIVERS,
	SAONE,
	type MapPoint,
} from "../src/france-map";
import legacy8 from "./fixtures/de-by-gymnasium-8-franzoesisch-imparfait-passe-compose-objektpronomen-kvt.json";

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
	it("shows the Saône joining the Rhône at Lyon on the continuation map", () => {
		expect(SAONE.points.at(-1)).toEqual(FRANCE_CITIES.lyon.pin);
		expect(lineDistance(FRANCE_CITIES.lyon.pin, FRANCE_RIVERS.rhone.points)).toBe(0);
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

describe("approved history transfer", () => {
	it("accounts for both legacy cells and assigns exactly one successor", () => {
		expect(mapping.schema).toBe(1);
		expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);
		expect(mapping.status).toBe("approved");
		expect(mapping.approved).toBe("2026-11-23");
		const ids = [...legacy7.atoms, ...legacy8.atoms].flatMap((atom) => atom.practice_items.map((item) => item.id));
		expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(ids.sort());
		const items = cell.atoms.map((atom) => atom.practice_items).flat();
		const replacements = items.filter((item) => "replaces" in item);
		expect(replacements).toHaveLength(1);
		for (const row of mapping.rows) {
			expect(row.reason.length).toBeGreaterThan(40);
			if (row.category === "A") {
				expect(row.action).toBe("replace");
				expect(row.de_by_id).toBe("01K8G8M0000000000000000J01");
				expect(row.academy_slug).toBe("f7-1-imparfait-check");
				const successors = items.filter((item) => item.slug === row.academy_slug);
				expect(successors).toHaveLength(1);
				expect(successors[0]).toMatchObject({ replaces: [row.de_by_id] });
				expect(successors[0].concept).toContain("-ais, -ais, -ait, -ions, -iez, -aient");
			} else {
				expect(row.action).toBe("keep-active");
				expect(row.academy_slug).toBeUndefined();
			}
		}
		expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(1);
	});
});
describe("course progress", () => {
	it("counts only lessons in the 1. Fremdsprache package", () => {
		const progress = freshProgress();
		expect(completion(progress)).toEqual({ completed: 0, total: 29, percent: 0 });
	});
});
