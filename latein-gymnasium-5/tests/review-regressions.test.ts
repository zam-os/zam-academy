import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import { findLesson, LESSONS } from "../src/curriculum";
import { FIGURES, renderFigure } from "../src/figures";
import { checkPractice } from "../src/practice";
import { drawDeclensionSvg, INSPECTORS } from "../src/workshop";

const text = (id: string) => JSON.stringify(findLesson(id));

describe("Latein 5 regression guards", () => {
	it("enforces pure Grade-5 active Latin without accidental passive, deponent or Grade-6 forms", () => {
		const all = JSON.stringify([LESSONS, INSPECTORS, cell, Object.values(FIGURES)]);
		expect(all).not.toMatch(
			/vocātur|turbātur|laudātur|expulsus|colloquēbantur|viderī|\bībat\b|sita est|\bdūx(?![-īe])|Audīō|Scīō|Tītus|pā-ter|hominibūs|\beōdem\b/,
		);
	});

	it("keeps Paenultima and Futur I mnemonics accurate, including naturally long ē in fēmina", () => {
		const aussprache = text("l5-aussprache-betonung");
		expect(aussprache).toContain("pa-ter");
		expect(aussprache).toContain("fē-mi-na");
		expect(aussprache).toContain("ob die drittletzte Silbe selbst lang ist (fē-mi-na) oder kurz");
		expect(renderFigure("l5-aussprache-betonung", 2)).toContain("FĒ - mi - na");
		expect(text("l5-imperfekt-futur1")).toContain("a und e: bo-bi-bu");
		expect(text("l5-imperfekt-futur1")).toContain("a-e-e");
		expect(text("l5-imperfekt-futur1")).not.toContain("bo-bi-bu bei a und u");
	});

	it("keeps Roman chronology, Seneca quotation, and calendar/historical wording accurate", () => {
		const romulus = text("l5-romulus-koenige-quellen");
		expect(romulus).toContain("753 v. Chr.");
		expect(romulus).toContain("509 v. Chr.");
		expect(romulus).toContain("Titus Līvius");
		expect(romulus).not.toContain("Zwillinge Rōmulus");
		const kalender = text("l5-kalender-zeit");
		expect(kalender).toContain("45 v. Chr.");
		expect(kalender).toContain("15. März");
		expect(kalender).toContain("1 a. u. c.");
		expect(kalender).not.toContain("753 a. u. c.");
		const wendungen = text("l5-wendungen-sentenzen");
		expect(wendungen).toContain("Nōn vītae, sed scholae discimus");
		expect(wendungen).toContain("Seneca, epist. 106,12");
		expect(wendungen).not.toContain("Nach Seneca: Nicht für die Schule");
		expect(text("l5-kreativ-gemeinsam")).not.toContain("Pietās omnia vincit");
	});

	it("pins morphology, syntax, rektion, vocabulary, and ZAM card accuracy fixes", () => {
		const esse = text("l5-esse-posse-velle");
		expect(esse).toContain("vor s wird sie zu pos-");
		expect(esse).not.toContain("vor Vokal pos-");
		expect(esse).not.toMatch(/\bnolle\b|\bmalle\b|\bnoli\b|\bnolite\b/);

		const pronomina = text("l5-pronomina");
		expect(pronomina).toContain("Mārcus amīcum suum videt");
		expect(pronomina).toContain("Mārcus patrem eius salūtat");
		expect(pronomina).not.toContain("Marcus et Mārcī");

		expect(text("l5-plusquamperfekt-futur2")).not.toContain("Postquam cōnsul verba fēcerat");

		const rektion = text("l5-rektion-wortstellung");
		expect(rektion).toContain("pārēre");
		expect(rektion).not.toMatch(/\bparēre\b/);

		const kasus = text("l5-kasus-gen-dat-akk");
		expect(kasus).toContain("Mārcō liber pulcher est");
		expect(kasus).not.toContain("Puellae liber pulcher est");
		expect(kasus).toContain("septem diēs (Akk. der zeitlichen Ausdehnung) in urbe manent");
		expect(kasus).not.toContain("fēstōs celebrant");

		const wortbildung = text("l5-wortbildung-kontext");
		expect(wortbildung).toContain("Welches deutsche Verb bedeutet 'āmittere'");
		expect(wortbildung).not.toContain("unterlegenen Feinde");

		expect(text("l5-wortarten-wortfelder")).not.toContain("dreimal leichter");
		expect(text("l5-europa-sprachen")).not.toContain("Hälfte des Wortschatzes");
		expect(text("l5-satzglieder-abfrage")).not.toContain("Marcus est amīcus");

		const cellText = JSON.stringify(cell);
		expect(cellText).not.toContain("fer!");
		expect(cellText).not.toContain("Puellae liber pulcher est");
		expect(cellText).not.toContain("Steuerzahlung an den Senat");
		const impCard = cell.atoms
			.flatMap((atom) => atom.practice_items)
			.find((item) => item.slug === "l5-praesens-konjugationen-apply");
		expect(impCard?.question).toContain("drei");
		expect(impCard?.concept).toContain("dīc!");
		expect(impCard?.concept).toContain("fac!");
	});

	it("pins accurate SVG figure labels for inscriptions, prohibitions, concrete, piety and underworld", () => {
		expect(renderFigure("l5-wendungen-sentenzen", 1)).toContain("R. I. P. = Requiēscat in pāce");
		expect(renderFigure("l5-esse-posse-velle", 2)).toContain("an eine Person");
		expect(renderFigure("l5-caput-mundi-kunst", 1)).toContain("Beton (opus caementicium)");
		expect(renderFigure("l5-senat-werte", 1)).toContain("gegenüber den Göttern");
		expect(renderFigure("l5-tod-unterwelt", 0)).toContain("D. M. = Dīs Mānibus");
		expect(renderFigure("l5-ablativ-funktionen", 2)).not.toContain("eōdem");
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
