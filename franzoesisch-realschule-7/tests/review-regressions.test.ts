import { describe, expect, it } from "vitest";
import mapping from "../replaces-de-by.json";
import { cell } from "./cell-types";
import legacy from "./fixtures/de-by-realschule-7-franzoesisch-starter-grammatik-verben-kvt.json";
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
import { clockLabel, colloquialClockLabel } from "../src/workshop";
import { SCENE_POSITIONS } from "../src/explorers";

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
	it("accepts both common decimal separators for the change at the market", () => {
		const change = findLesson("f7-courses")!.practice[0];
		for (const input of ["2,60", "2.60", "2,6", "2.6"])
			expect(checkPractice([change], [input])).toEqual([true]);
		expect(checkPractice([change], ["7,40"])).toEqual([false]);
	});
	it("makes the possessive quiz complete Léa's own sentence", () => {
		const quiz = findLesson("f7-famille")!.quiz;
		expect(quiz.answer).toBe("Voici ma mère.");
		expect(quiz.wrong).toContain("Voici mon mère.");
	});
	it.each([
		[0, 0, "minuit"],
		[12, 0, "midi"],
		[1, 0, "une heure"],
		[15, 30, "quinze heures trente"],
		[21, 0, "vingt et une heures"],
		[21, 45, "vingt et une heures quarante-cinq"],
	] as const)("reads %i:%i officially as %s", (h, m, expected) => {
		expect(clockLabel(h, m)).toBe(expected);
	});
	it.each([
		[15, 30, "trois heures et demie"],
		[7, 15, "sept heures et quart"],
		[8, 45, "neuf heures moins le quart"],
		[11, 45, "midi moins le quart"],
		[23, 45, "minuit moins le quart"],
		[12, 30, "midi et demi"],
		[0, 30, "minuit et demi"],
		[13, 0, "une heure"],
		[0, 45, "une heure moins le quart"],
	] as const)("reads %i:%i in everyday French as %s", (h, m, expected) => {
		expect(colloquialClockLabel(h, m)).toBe(expected);
	});
	it("has a finite everyday label for every offered clock setting", () => {
		for (let h = 0; h < 24; h++)
			for (const m of [0, 15, 30, 45])
				expect(colloquialClockLabel(h, m)).toMatch(/^[a-z ]+$/);
	});
	it("agrees with the workshop answers of the clock lesson", () => {
		const goals = findLesson("f7-heure")!.workshop.goals;
		expect(goals[0].answer).toBe(clockLabel(15, 30));
		expect(`sept heures ${goals[1].answer}`).toBe(colloquialClockLabel(7, 15));
		expect(goals[2].answer).toBe(colloquialClockLabel(8, 45));
	});
});

describe("preposition scene", () => {
	it("offers one distinct position per preposition, each with a readable label", () => {
		const entries = Object.entries(SCENE_POSITIONS);
		expect(entries.map(([id]) => id)).toEqual(["sur", "sous", "devant", "derriere", "dans"]);
		expect(new Set(entries.map(([, p]) => `${p.x}:${p.y}`)).size).toBe(5);
		for (const [id, p] of entries) {
			expect(p.label.startsWith(id === "derriere" ? "derrière" : id)).toBe(true);
			expect(p.x).toBeGreaterThan(20);
			expect(p.x).toBeLessThan(400);
			expect(p.y).toBeGreaterThan(20);
			expect(p.y).toBeLessThan(260);
		}
		// Under the table means below the tabletop (y 110), on it means above.
		expect(SCENE_POSITIONS.sous.y).toBeGreaterThan(124);
		expect(SCENE_POSITIONS.sur.y).toBeLessThan(110);
	});
	it("matches every workshop goal of the lesson to a word the scene shows", () => {
		for (const goal of findLesson("f7-maison")!.workshop.goals)
			expect(["sur", "sous", "devant", "derrière", "dans"]).toContain(goal.answer);
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

describe("approved mapping of the legacy grade 7 cell", () => {
	it("maps every legacy item once and moves exactly the two approved histories", () => {
		expect(mapping.schema).toBe(1);
		expect(mapping.status).toBe("approved");
		expect(mapping.approved).toBe("2026-11-22");
		expect(mapping.source).toContain("Beide A freigeben");
		expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);
		const ids = legacy.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id));
		expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual([...ids].sort());
		const items = cell.atoms.flatMap((atom) => atom.practice_items);
		expect(cell).not.toHaveProperty("retired_items");
		for (const row of mapping.rows) {
			expect(row.reason.length).toBeGreaterThan(40);
			if (row.category === "A") {
				expect(row.action).toBe("replace");
				const successors = items.filter((item) => item.slug === row.academy_slug);
				expect(successors).toHaveLength(1);
				expect(successors[0]).toMatchObject({ replaces: [row.de_by_id] });
			} else {
				expect(row.category).toBe("C");
				expect(row.action).toBe("keep-active");
				expect(row.academy_slug).toBeNull();
			}
		}
		// One history never spreads over several cards.
		const replaced = items.flatMap((item) => item.replaces ?? []);
		expect(replaced.sort()).toEqual(mapping.rows.filter((row) => row.category === "A").map((row) => row.de_by_id).sort());
		expect(items.filter((item) => item.replaces)).toHaveLength(2);
	});
	it("gives each history a successor that asks the same retrieval", () => {
		const items = cell.atoms.flatMap((atom) => atom.practice_items);
		const ont = items.find((item) => item.slug === "f7-etre-avoir-check")!;
		expect(ont.fast_check?.options).toEqual(["ils / elles ont", "ils / elles sont"]);
		const negation = items.find((item) => item.slug === "f7-negation-recall")!;
		expect(negation.concept).toContain("Je ne parle pas français");
	});
});

describe("single learning path", () => {
	it("counts progress over all lessons", () => {
		expect(completion(freshProgress())).toEqual({ completed: 0, total: 54, percent: 0 });
	});
});
