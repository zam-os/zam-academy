import { describe, expect, it } from "vitest";
import {
	aciTransform,
	conjugateVerb,
	declineNoun,
	NOUN_IDS,
	numeralSpec,
	romanNumeral,
	SYLLABLE_WORDS,
	syllableStress,
	type Casus,
	type Numerus,
	type TenseId,
	type VerbId,
} from "../src/latin-models";
import {
	ITALY_LAND,
	ITALY_PLACES,
	ROME_AQUEDUCT,
	ROME_LANDMARKS,
	ROME_TIBER,
	type MapPoint,
} from "../src/maps";

function onPolygon([x, y]: MapPoint, poly: readonly MapPoint[]): boolean {
	let inside = false;
	for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
		const a = poly[i];
		const b = poly[j];
		if (
			a[1] > y !== b[1] > y &&
			x < ((b[0] - a[0]) * (y - a[1])) / (b[1] - a[1]) + a[0]
		) {
			inside = !inside;
		}
	}
	return inside;
}

describe("Latin grammar and numeral models", () => {
	it("produces finite numerals 1..12 with subtractive IV and IX", () => {
		const expected = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
		for (let n = 1; n <= 12; n++) {
			const spec = numeralSpec(n);
			expect(romanNumeral(n)).toBe(expected[n - 1]);
			expect(spec.cardinal.length).toBeGreaterThan(2);
			expect(spec.ordinal.length).toBeGreaterThan(4);
			expect(JSON.stringify(spec)).not.toMatch(/undefined|NaN/);
		}
		expect(numeralSpec(4).parts).toEqual(["V", "−", "I"]);
		expect(numeralSpec(9).parts).toEqual(["X", "−", "I"]);
	});

	it("declines all Grade 6 noun classes accurately", () => {
		const cases: Casus[] = ["nom", "gen", "dat", "akk", "abl"];
		const numeri: Numerus[] = ["sg", "pl"];
		for (const nounId of NOUN_IDS) {
			for (const num of numeri) {
				for (const c of cases) {
					const res = declineNoun(nounId, num, c);
					expect(res.full.length).toBeGreaterThan(2);
					expect(res.full).not.toMatch(/undefined|NaN/);
				}
			}
		}
		expect(declineNoun("serva", "pl", "akk").full).toBe("servās");
		expect(declineNoun("templum", "pl", "nom").full).toBe("templa");
		expect(declineNoun("urbs", "pl", "gen").full).toBe("urbium");
		expect(declineNoun("mare", "sg", "abl").full).toBe("marī");
		expect(declineNoun("mare", "pl", "nom").full).toBe("maria");
		expect(declineNoun("rex", "sg", "gen").full).toBe("rēgis");
	});

	it("conjugates all regular classes and six irregular verbs across all six active tenses", () => {
		const verbs: VerbId[] = [
			"vocare",
			"monere",
			"ducere",
			"capere",
			"audire",
			"esse",
			"posse",
			"velle",
			"nolle",
			"malle",
			"ire",
		];
		const tenses: TenseId[] = [
			"praesens",
			"imperfekt",
			"perfekt",
			"plusquamperfekt",
			"futur1",
			"futur2",
		];
		for (const v of verbs) {
			for (const t of tenses) {
				for (let p = 0; p < 6; p++) {
					const res = conjugateVerb(v, t, p);
					expect(res.full.length).toBeGreaterThan(1);
					expect(res.translation.length).toBeGreaterThan(3);
					expect(JSON.stringify(res)).not.toMatch(/undefined|NaN/);
				}
			}
		}
		expect(conjugateVerb("vocare", "imperfekt", 0).full).toBe("vocābam");
		expect(conjugateVerb("ducere", "futur1", 2).full).toBe("dūcet");
		expect(conjugateVerb("capere", "praesens", 5).full).toBe("capiunt");
		expect(conjugateVerb("audire", "imperfekt", 5).full).toBe("audiēbant");
		expect(conjugateVerb("posse", "imperfekt", 0).full).toBe("poteram");
		expect(conjugateVerb("velle", "praesens", 1).full).toBe("vīs");
		expect(conjugateVerb("nolle", "praesens", 2).full).toBe("nōn vult");
		expect(conjugateVerb("malle", "praesens", 2).full).toBe("māvult");
		expect(conjugateVerb("ire", "praesens", 5).full).toBe("eunt");
		expect(conjugateVerb("ire", "futur1", 0).full).toBe("ībō");
	});

	it("handles active AcI relative time and syllable stress", () => {
		expect(aciTransform("praesens", "praesens").german).toContain("kommt");
		expect(aciTransform("praesens", "perfekt").german).toContain("gekommen ist");
		expect(aciTransform("perfekt", "praesens").german).toContain("kam");
		expect(aciTransform("perfekt", "perfekt").german).toContain("gekommen war");
		for (const id of Object.keys(SYLLABLE_WORDS)) {
			const s = syllableStress(id);
			expect(s.stressIndex).toBeGreaterThanOrEqual(0);
			expect(s.stressIndex).toBeLessThan(s.syllables.length);
		}
		expect(syllableStress("amicus").stressIndex).toBe(1);
		expect(syllableStress("dominus").stressIndex).toBe(0);
	});
});

describe("Rome and Italy map topology and label separation", () => {
	it("places Rome landmarks east of the Tiber and prevents label overlap", () => {
		const pts = Object.values(ROME_LANDMARKS);
		for (const l of pts) {
			expect(l.pin[0]).toBeGreaterThan(215);
		}
		expect(ROME_TIBER[0][0]).toBeLessThan(210);
		expect(ROME_AQUEDUCT.points[0][0]).toBeGreaterThan(ROME_LANDMARKS.kolosseum.pin[0]);
		const labels = pts.map((l) => l.labelAt);
		for (let i = 0; i < labels.length; i++) {
			for (let j = i + 1; j < labels.length; j++) {
				const dist = Math.hypot(labels[i][0] - labels[j][0], labels[i][1] - labels[j][1]);
				expect(dist).toBeGreaterThan(25);
			}
		}
	});

	it("keeps mainland Italian sites on land and Pompeji/Herkuláneum accurately oriented around Vesuv", () => {
		for (const id of ["roma", "ostia", "neapolis", "vesuv", "herkulaneum", "pompeji"] as const) {
			expect(onPolygon(ITALY_PLACES[id].pin, ITALY_LAND), id).toBe(true);
		}
		expect(ITALY_PLACES.pompeji.pin[0]).toBeGreaterThan(ITALY_PLACES.vesuv.pin[0]);
		expect(ITALY_PLACES.pompeji.pin[1]).toBeGreaterThan(ITALY_PLACES.vesuv.pin[1]);
		expect(ITALY_PLACES.herkulaneum.pin[0]).toBeLessThan(ITALY_PLACES.vesuv.pin[0]);
		const labels = Object.values(ITALY_PLACES).map((p) => p.labelAt);
		for (let i = 0; i < labels.length; i++) {
			for (let j = i + 1; j < labels.length; j++) {
				const dist = Math.hypot(labels[i][0] - labels[j][0], labels[i][1] - labels[j][1]);
				expect(dist).toBeGreaterThan(22);
			}
		}
	});
});
