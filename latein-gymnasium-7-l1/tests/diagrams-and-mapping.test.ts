import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import legacy7 from "./fixtures/de-by-gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen-kvt.json";
import legacy8 from "./fixtures/de-by-gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio-kvt.json";
import {
	ablAbsModel,
	consecutioModel,
	CURSUS_STAGES,
	EPOCHEN_STAGES,
	HAUPTSATZ_MOODS,
	IMPERIUM_PLACES,
	konjunktivForm,
	renderStageIcon,
} from "../src/diagrams";
import { STAGES } from "../src/curriculum";

describe("interactive SVG models stay finite and accurate across all settings", () => {
	it("produces valid abl-abs results for every mode and translation style", () => {
		for (const mode of ["ppp", "ppa", "nominal"] as const) {
			for (const style of ["adverbial", "prepositional", "coordinate"] as const) {
				const res = ablAbsModel(mode, style);
				expect(res.latin.length).toBeGreaterThan(10);
				expect(res.german.length).toBeGreaterThan(15);
				expect(`${res.noun} ${res.participle} ${res.german}`).not.toMatch(
					/undefined|NaN/,
				);
			}
		}
		expect(ablAbsModel("ppp", "adverbial").relation).toContain("Vorzeitigkeit");
		expect(ablAbsModel("ppa", "adverbial").relation).toContain("Gleichzeitigkeit");
		expect(ablAbsModel("nominal", "prepositional").german).toContain(
			"Konsulat Ciceros",
		);
	});

	it("produces all four consecutio temporum combinations accurately", () => {
		expect(consecutioModel("haupttempus", "gleichzeitig").subForm).toBe(
			"faciat",
		);
		expect(consecutioModel("haupttempus", "vorzeitig").subForm).toBe("fecerit");
		expect(consecutioModel("nebentempus", "gleichzeitig").subForm).toBe(
			"faceret",
		);
		expect(consecutioModel("nebentempus", "vorzeitig").subForm).toBe(
			"fecisset",
		);
	});

	it("builds all 16 konjunktiv forms across conjugations, tenses and voices", () => {
		for (const conj of ["a", "e", "i", "kons"] as const) {
			for (const tense of ["praesens", "perfekt"] as const) {
				for (const voice of ["aktiv", "passiv"] as const) {
					const form = konjunktivForm(conj, tense, voice);
					expect(form.fullForm.length).toBeGreaterThan(3);
					expect(form.fullForm).not.toMatch(/undefined|NaN/);
				}
			}
		}
		expect(konjunktivForm("a", "praesens", "aktiv").fullForm).toBe("laudet");
		expect(konjunktivForm("e", "praesens", "aktiv").fullForm).toBe("moneat");
		expect(konjunktivForm("i", "praesens", "passiv").fullForm).toBe("audiatur");
		expect(konjunktivForm("kons", "perfekt", "aktiv").fullForm).toBe(
			"rexerit",
		);
		expect(konjunktivForm("a", "perfekt", "passiv").fullForm).toBe(
			"laudatus sit",
		);
	});

	it("keeps map places, cursus stages, epoch stages and stage icons complete", () => {
		expect(IMPERIUM_PLACES).toHaveLength(12);
		for (const place of IMPERIUM_PLACES) {
			expect(Number.isFinite(place.x)).toBe(true);
			expect(Number.isFinite(place.y)).toBe(true);
			expect(place.x).toBeGreaterThan(20);
			expect(place.x).toBeLessThan(610);
			expect(place.y).toBeGreaterThan(20);
			expect(place.y).toBeLessThan(305);
			expect(place.layers.length).toBeGreaterThan(0);
		}
		const wonders = IMPERIUM_PLACES.filter((p) =>
			p.layers.includes("weltwunder"),
		).map((p) => p.id);
		expect(wonders).toEqual([
			"olympia",
			"ephesos",
			"halikarnassos",
			"rhodos",
			"alexandria",
			"gizeh",
			"babylon",
		]);
		const olympia = IMPERIUM_PLACES.find((p) => p.id === "olympia");
		expect(olympia?.layers).toEqual(["heiligtuemer", "weltwunder"]);
		expect(IMPERIUM_PLACES.some((p) => p.id === "rhodos")).toBe(true);
		expect(IMPERIUM_PLACES.some((p) => p.id === "gizeh")).toBe(true);
		expect(CURSUS_STAGES).toHaveLength(4);
		expect(EPOCHEN_STAGES).toHaveLength(4);
		expect(Object.keys(HAUPTSATZ_MOODS)).toEqual([
			"hortativ",
			"jussiv",
			"prohibitiv",
			"optativ",
		]);
		for (const stage of STAGES) {
			expect(renderStageIcon(stage.icon)).toContain("<svg");
		}
	});
});

describe("legacy inventory proposal is complete and transfers no mastery", () => {
	it("inventories all 8 legacy items exactly once and verifies proposed slugs", () => {
		expect(mapping.schema).toBe(1);
		expect(mapping.status).toBe("proposal-only");
		expect(mapping.approved).toBeNull();
		expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);

		const legacyIds = [
			...legacy7.atoms.flatMap((a) => a.practice_items.map((i) => i.id)),
			...legacy8.atoms.flatMap((a) => a.practice_items.map((i) => i.id)),
		];
		expect(legacyIds).toHaveLength(8);
		expect(mapping.rows.map((r) => r.de_by_id).sort()).toEqual(
			legacyIds.sort(),
		);

		const cellSlugs = cell.atoms.flatMap((a) =>
			a.practice_items.map((i) => i.slug),
		);
		for (const row of mapping.rows) {
			if (row.category === "A" || row.category === "B") {
				expect(row.action).toBe("propose-replace-after-approval");
				expect(
					cellSlugs.filter((s) => s === row.academy_slug),
				).toHaveLength(1);
			} else {
				expect(row.action).toBe("keep-active");
				expect(row.academy_slug).toBeNull();
			}
		}
	});
});
