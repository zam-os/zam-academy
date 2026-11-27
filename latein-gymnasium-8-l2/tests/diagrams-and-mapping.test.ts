import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import {
	CHRISTENTUM_PHASES,
	EUROPA_PHASES,
	gerundivModel,
	hauptsatzModusModel,
	KAISERZEIT_PHASES,
	LIMES_PLACES,
	nciModel,
	PAENULTIMA_WORDS,
	paenultimaModel,
	PHILO_SCHOOLS,
	RECHT_CASES,
	relativKonjModel,
	renderStageIcon,
	verbModel,
} from "../src/diagrams";
import { STAGES } from "../src/curriculum";

describe("interactive SVG models stay finite and accurate across all settings", () => {
	it("covers all 6 Paenultima entries without malformed output", () => {
		expect(PAENULTIMA_WORDS).toHaveLength(6);
		for (const entry of PAENULTIMA_WORDS) {
			const res = paenultimaModel(entry.id);
			expect(res.stressIndex).toBeGreaterThanOrEqual(0);
			expect(res.stressIndex).toBeLessThan(res.syllables.length);
			expect(res.paenultimaRule.length).toBeGreaterThan(20);
			expect(`${res.word} ${res.meaning} ${res.paenultimaRule}`).not.toMatch(
				/undefined|NaN/,
			);
		}
		expect(paenultimaModel("iustitia").stressIndex).toBe(1);
		expect(paenultimaModel("gerundivum").stressIndex).toBe(2);
	});

	it("models all 8 Grade-8 verb classes accurately", () => {
		for (const kind of [
			"a-deponens",
			"e-deponens",
			"i-deponens",
			"kons-deponens",
			"kons-i-deponens",
			"semideponens",
			"perfektopraesens",
			"fieri",
		] as const) {
			const res = verbModel(kind);
			expect(res.presentBox.length).toBeGreaterThan(5);
			expect(res.perfectBox.length).toBeGreaterThan(5);
			expect(res.latin.length).toBeGreaterThan(10);
			expect(res.german.length).toBeGreaterThan(10);
			expect(`${res.label} ${res.ruleBadge} ${res.hint}`).not.toMatch(
				/undefined|NaN/,
			);
		}
		expect(verbModel("a-deponens").perfectBox).toBe("hortātus est");
		expect(verbModel("e-deponens").perfectBox).toBe("veritus est");
		expect(verbModel("semideponens").presentBox).toContain("audet");
		expect(verbModel("perfektopraesens").presentBox).toContain("Gegenwart");
		expect(verbModel("perfektopraesens").latin).toContain("odit");
		expect(verbModel("fieri").presentBox).toContain("fit / fīunt");
	});

	it("produces valid Gerund vs. Gerundiv results for all modes and styles", () => {
		for (const mode of [
			"gerund",
			"attributiv",
			"praedikativ",
			"auctoris",
		] as const) {
			for (const style of ["passivisch", "idiomatisch"] as const) {
				const res = gerundivModel(mode, style);
				expect(res.latin.length).toBeGreaterThan(10);
				expect(res.german.length).toBeGreaterThan(15);
				expect(
					`${res.leftLabel} ${res.leftText} ${res.rightLabel} ${res.rightText} ${res.german}`,
				).not.toMatch(/undefined|NaN/);
			}
		}
		expect(gerundivModel("attributiv", "idiomatisch").german).toContain(
			"Rettung der Stadt",
		);
		expect(gerundivModel("praedikativ", "passivisch").german).toContain(
			"Karthago muss zerstört werden",
		);
		expect(gerundivModel("auctoris", "idiomatisch").german).toBe(
			"Gute Bürger müssen die Gesetze immer achten.",
		);
	});

	it("produces all 16 NcI trigger, relation and style combinations accurately", () => {
		for (const trigger of ["dicitur", "videtur", "traduntur", "existimatur"] as const) {
			for (const rel of ["gleichzeitig", "vorzeitig"] as const) {
				const unp = nciModel(trigger, rel, "unpersoenlich");
				const mod = nciModel(trigger, rel, "modal");
				for (const res of [unp, mod]) {
					expect(res.subjNom.length).toBeGreaterThan(4);
					expect(res.verbPass.length).toBeGreaterThan(4);
					expect(res.infinitive.length).toBeGreaterThan(3);
					expect(res.latin.length).toBeGreaterThan(10);
					expect(res.german.length).toBeGreaterThan(10);
					expect(`${res.latin} ${res.german} ${res.hint}`).not.toMatch(
						/undefined|NaN/,
					);
				}
				expect(unp.german).not.toBe(mod.german);
				expect(unp.latin).toContain(trigger);
			}
		}
	});

	it("models all Hauptsatz and Relativsatz Konjunktiv modes", () => {
		for (const mood of [
			"deliberativ-pr",
			"deliberativ-vg",
			"potentialis",
			"begehrssaetze",
		] as const) {
			const res = hauptsatzModusModel(mood);
			expect(res.latin.length).toBeGreaterThan(8);
			expect(res.german.length).toBeGreaterThan(10);
			expect(`${res.title} ${res.negation}`).not.toMatch(/undefined|NaN/);
		}
		expect(hauptsatzModusModel("deliberativ-pr").negation).toContain("non");
		expect(hauptsatzModusModel("begehrssaetze").negation).toBe("ne!");

		for (const sense of ["final", "kausal", "konsekutiv", "konzessiv"] as const) {
			const res = relativKonjModel(sense);
			expect(res.latin.length).toBeGreaterThan(10);
			expect(res.german.length).toBeGreaterThan(10);
			expect(`${res.title} ${res.signal} ${res.hint}`).not.toMatch(
				/undefined|NaN/,
			);
		}
		expect(relativKonjModel("final").latin).toContain("qui pacem peterent");
		expect(relativKonjModel("kausal").signal).toContain("quippe qui");
	});

	it("keeps timelines, Limes places non-overlapping, Recht cases, Philo schools and stage icons valid", () => {
		expect(KAISERZEIT_PHASES).toHaveLength(4);
		expect(CHRISTENTUM_PHASES).toHaveLength(4);
		expect(EUROPA_PHASES).toHaveLength(4);
		expect(RECHT_CASES).toHaveLength(4);
		for (const item of RECHT_CASES) {
			expect(item.shortPrinciple.length).toBeLessThanOrEqual(24);
		}
		expect(PHILO_SCHOOLS).toHaveLength(5);

		expect(LIMES_PLACES).toHaveLength(8);
		for (const place of LIMES_PLACES) {
			expect(Number.isFinite(place.x)).toBe(true);
			expect(Number.isFinite(place.y)).toBe(true);
			expect(place.x).toBeGreaterThan(20);
			expect(place.x).toBeLessThan(610);
			expect(place.y).toBeGreaterThan(20);
			expect(place.y).toBeLessThan(305);
			expect(place.layers.length).toBeGreaterThan(0);
		}
		for (let i = 0; i < LIMES_PLACES.length; i++) {
			for (let j = i + 1; j < LIMES_PLACES.length; j++) {
				const a = LIMES_PLACES[i];
				const b = LIMES_PLACES[j];
				expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeGreaterThan(45);
			}
		}
		for (const stage of STAGES) {
			expect(renderStageIcon(stage.icon)).toContain("<svg");
		}
	});
});

describe("legacy history", () => {
	it("records the existing inventories and assigns no legacy IDs to this package", () => {
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.rows).toEqual([]);
		expect(mapping.related_inventories.map((entry) => entry.inventory)).toEqual([
			"latein-gymnasium-7-l1/replaces-de-by.json",
			"latein-gymnasium-8-l1/replaces-de-by.json",
		]);
		for (const atom of cell.atoms) {
			expect(atom).not.toHaveProperty("replaces");
			for (const item of atom.practice_items) expect(item).not.toHaveProperty("replaces");
		}
		expect(cell).not.toHaveProperty("retired_items");
	});
});
