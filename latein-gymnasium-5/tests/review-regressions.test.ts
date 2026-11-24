import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import { findLesson, LESSONS } from "../src/curriculum";
import { checkPractice } from "../src/practice";
import { drawDeclensionSvg, INSPECTORS } from "../src/workshop";

const text = (id: string) => JSON.stringify(findLesson(id));

describe("Latein 5 regression guards", () => {
	it("enforces pure Grade-5 active Latin without accidental passive, deponent or Grade-6 forms", () => {
		const all = JSON.stringify([LESSONS, INSPECTORS, cell]);
		expect(all).not.toMatch(
			/vocātur|turbātur|laudātur|expulsus|colloquēbantur|viderī|\bībat\b|sita est|\bdūx(?![-īe])|Audīō|Scīō|Tītus|pā-ter|hominibūs/,
		);
	});

	it("keeps Paenultima and Futur I mnemonics accurate", () => {
		expect(text("l5-aussprache-betonung")).toContain("pa-ter");
		expect(text("l5-imperfekt-futur1")).toContain("a und e: bo-bi-bu");
		expect(text("l5-imperfekt-futur1")).toContain("a-e-e");
		expect(text("l5-imperfekt-futur1")).not.toContain("bo-bi-bu bei a und u");
	});

	it("keeps Roman chronology and calendar dates exact", () => {
		expect(text("l5-romulus-koenige-quellen")).toContain("753 v. Chr.");
		expect(text("l5-romulus-koenige-quellen")).toContain("509 v. Chr.");
		expect(text("l5-romulus-koenige-quellen")).toContain("Titus Līvius");
		expect(text("l5-kalender-zeit")).toContain("45 v. Chr.");
		expect(text("l5-kalender-zeit")).toContain("15. März");
	});

	it("preserves morphological hyphens instead of mathematical minus signs in declension SVGs", () => {
		const svg = drawDeclensionSvg("a", "sg", 1);
		expect(svg).toContain("Endung: -ae");
		expect(svg).not.toContain("Endung: −ae");
	});

	it("keeps deduplicated curriculum bindings on Ablativfunktionen", () => {
		expect(findLesson("l5-ablativ-funktionen")!.bindings).toEqual(["L5 2.3"]);
	});

	it("accepts German and Latin equivalents with or without macrons and rejects typical case mixups", () => {
		const rektion = findLesson("l5-rektion-wortstellung")!;
		expect(checkPractice(rektion.practice, ["urbem", "matrem"])).toEqual([
			true,
			true,
		]);
		expect(checkPractice(rektion.practice, ["urbe", "matri"])).toEqual([
			false,
			false,
		]);
		const aci = findLesson("l5-aci")!;
		expect(checkPractice(aci.practice, ["kommt", "gelesen hatte"])).toEqual([
			true,
			true,
		]);
		expect(checkPractice(aci.practice, ["kam", "liest"])).toEqual([
			false,
			false,
		]);
	});
});
