import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import { findLesson, LESSONS } from "../src/curriculum";
import { FIGURES, renderFigure } from "../src/figures";
import { renderItalyMap } from "../src/maps";
import { checkPractice } from "../src/practice";
import {
	drawKonjunktivSvg,
	drawPassivSvg,
	INSPECTORS,
} from "../src/workshop";

const text = (id: string) => JSON.stringify(findLesson(id));

describe("Latein 6 regression guards", () => {
	it("enforces Grade-6 curriculum boundaries without Grade 7+ grammar or authors", () => {
		const all = JSON.stringify([LESSONS, INSPECTORS, cell, Object.values(FIGURES)]);
		expect(all).not.toMatch(
			/Deponens|Deponentien|Ablativus absolutus|Abl\. abs\.|Gerundiv|Gerundium|\bPFA\b|Partizip Futur|tūtissimus|\baliquis\b|cursus honorum|\bHoraz\b|\bAugustus\b|Ödipus|Antigone|Diogenes|\bDelphi\b|\bOlympia\b|\bCaesar\b|\bCicero\b|Alexander der Große|Nein, kein/,
		);
	});

	it("forbids dot decimals inside learner-visible lesson text and card prompts", () => {
		for (const lesson of LESSONS) {
			const visible = JSON.stringify({
				title: lesson.title,
				skill: lesson.skill,
				paragraphs: lesson.paragraphs,
				material: lesson.material,
				materialLabel: lesson.materialLabel,
				quiz: lesson.quiz,
				takeaway: lesson.takeaway,
				practice: lesson.practice,
				tasks: lesson.tasks,
				workshop: lesson.workshop,
			});
			expect(visible, lesson.id).not.toMatch(/\d\.\d/);
		}
		expect(JSON.stringify(INSPECTORS)).not.toMatch(/\d\.\d/);
	});

	it("pins key Grade-6 morphology, quotes, numerals, and cultural details", () => {
		const adj3 = text("l6-dritte-deklination-adjektive");
		expect(adj3).toContain("paupere");
		expect(adj3).toContain("veterum");
		expect(adj3).toContain("gravī");

		const num = text("l6-numeralia-1000");
		expect(num).toContain("CCXVIII");
		expect(num).toContain("CDXC");
		expect(num).toContain("LXXIX");
		expect(num).toContain("duo mīlia mīlitum");

		const plinius = text("l6-plinius-vesuvbriefe");
		expect(plinius).toContain("6,16");
		expect(plinius).toContain("6,20");
		expect(plinius).toContain("Fortēs fortūna iuvat");
		expect(plinius).toContain("fōrma pīnus");

		const daedalus = text("l6-daedalus-ikarus");
		expect(daedalus).toContain("Inter utrumque volā!");
		expect(daedalus).toContain("8,206");

		const eur = text("l6-europa-theseus");
		expect(eur).toContain("Ariadnefaden");
		expect(eur).toContain("Ägäisches Meer");
	});

	it("preserves morphological hyphens instead of mathematical minus signs in explorer SVGs", () => {
		const svgPass = drawPassivSvg("pres", "pass");
		expect(svgPass).toContain("dēfenduntur");
		expect(svgPass).not.toContain("−ntur");
		const svgKonj = drawKonjunktivSvg("capere", "act");
		expect(svgKonj).toContain("caperent");
		expect(svgKonj).not.toContain("−rent");
	});

	it("keeps INSPECTORS notes compact to prevent SVG viewBox edge overflow", () => {
		for (const [kind, spec] of Object.entries(INSPECTORS)) {
			for (const item of spec.items) {
				expect(item.note.length, `${kind}: ${item.btn}`).toBeLessThanOrEqual(76);
				expect(item.box1.length, `${kind}: ${item.btn}`).toBeLessThanOrEqual(36);
				expect(item.box2.length, `${kind}: ${item.btn}`).toBeLessThanOrEqual(36);
				expect(item.box3.length, `${kind}: ${item.btn}`).toBeLessThanOrEqual(36);
			}
		}
	});

	it("renders Stage 5–8 figures cleanly and deduplicates lesson bindings", () => {
		expect(renderFigure("l6-hannibal-punische-kriege", 2)).toContain("Zama");
		expect(renderFigure("l6-daedalus-ikarus", 1)).toContain("Inter utrumque");
		expect(findLesson("l6-konjunktiv-irrealis")!.bindings).toEqual(["L6 2.3"]);
	});

	it("validates practice matching with or without macrons and rejects case errors", () => {
		const pc = findLesson("l6-participium-coniunctum")!;
		const p0 = pc.practice[0];
		const p1 = pc.practice[1];
		expect(
			checkPractice(pc.practice, [p0.answers[0], p1.answers[0]]),
		).toEqual([true, true]);
		expect(checkPractice(pc.practice, ["falsch", "ebenso falsch"])).toEqual([
			false,
			false,
		]);
	});

	it("pins all PR #198 review fixes for Latin accuracy, Ovid sources, history and map placement", () => {
		const inschriften = text("l6-wendungen-inschriften");
		expect(inschriften).toContain("fīliīs dīxit");
		expect(inschriften).not.toContain("fīliōs dīxit");
		expect(inschriften).not.toContain("treffen dir");

		expect(text("l6-final-konsekutiv-ut")).not.toContain("legō, ut multa discerem");
		expect(text("l6-final-konsekutiv-ut")).toContain("Librum lēgī, ut multa discerem");

		const orpheus = text("l6-orpheus-eurydike-unterwelt");
		expect(orpheus).toContain("ne flectat retro sua lumina");
		expect(orpheus).toContain("Met. 10,51");
		expect(orpheus).not.toContain("Nōlī respicere");

		expect(text("l6-lernstrategien-pruefung")).not.toContain("Kapitulation");
		expect(text("l6-englisch-romanisch")).toContain("Lehnübersetzung");
		expect(text("l6-plinius-vesuvbriefe")).not.toContain("geprägt");

		const hannibal = text("l6-hannibal-punische-kriege");
		expect(hannibal).toContain("211 'Hannibal ante portās!'");
		expect(hannibal).not.toContain("218 Hannibal zieht über die Alpen ('Hannibal ante portās!')");

		const cellText = JSON.stringify(cell);
		expect(cellText).not.toContain("Division' und 'dividieren' geht direkt auf den PPP-Stamm");
		expect(cellText).not.toContain("Nōlī respicere");
		expect(cellText).toContain("ne flectat retro sua lumina");

		expect(FIGURES["l6-demonstrativa-hic-ille-iste"].caption).toContain("huius/huic");
		expect(FIGURES["l6-demonstrativa-hic-ille-iste"].caption).not.toContain("Alle drei zeigen -īus");
		expect(FIGURES["l6-trojanischer-krieg"].parts[1].note).toContain("spätere Epen");

		const mapHtml = renderItalyMap("italy", "syrakus");
		expect(mapHtml).toContain("Magna</tspan>");
		expect(mapHtml).not.toContain('x="328" y="220"');
	});
});
