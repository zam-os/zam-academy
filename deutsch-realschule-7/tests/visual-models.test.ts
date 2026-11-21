import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { modelBlocks, renderLanguageModel } from "../src/language-model";
import { renderVisual } from "../src/visuals";

const lesson = (slug: string) => {
	const found = LESSONS.find((entry) => entry.id === `d7-${slug}`);
	if (!found) throw new Error(`Missing lesson ${slug}`);
	return found;
};
const decode = (text: string) =>
	text
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'")
		.replace(/&gt;/g, ">")
		.replace(/&lt;/g, "<")
		.replace(/&amp;/g, "&");
const words = (slug: string, step: number) =>
	[
		...renderLanguageModel(lesson(slug), step).matchAll(
			/<strong>(.*?)<\/strong>/gs,
		),
	]
		.map((match) => decode(match[1]))
		.join(" ");

describe("Displayed language models and their Grade 7 purpose", () => {
	it("splits loanword building blocks cleanly in fremdwoerter-funktion", () => {
		expect(words("fremdwoerter-funktion", 0)).toBe("kon- stru- -ieren");
		expect(words("fremdwoerter-funktion", 1)).toBe("Re- par- -atur");
		expect(words("fremdwoerter-funktion", 2)).toContain("Biblio- -thek");
	});

	it("contrasts historicism, semantic shift and historical spelling", () => {
		expect(words("wortgeschichte-bedeutungswandel", 0)).toContain("Knappe");
		expect(words("wortgeschichte-bedeutungswandel", 1)).toContain("billig = gerecht");
		expect(words("wortgeschichte-bedeutungswandel", 1)).toContain(
			"billig = preisgünstig",
		);
		expect(words("wortgeschichte-bedeutungswandel", 2)).toContain("Thür (1870)");
		expect(words("wortgeschichte-bedeutungswandel", 2)).toContain("Tür (heute)");
	});

	it("separates Konjunktiv I from Konjunktiv II substitution in indirect speech", () => {
		expect(words("indikativ-konjunktiv-rede", -1)).toContain(
			"„Ich habe den Bericht gelesen.“",
		);
		expect(words("indikativ-konjunktiv-rede", 0)).toContain("sie habe");
		expect(words("indikativ-konjunktiv-rede", 1)).toContain("sie bräuchten");
		expect(words("indikativ-konjunktiv-rede", 2)).toContain("sein Team werde");
	});

	it("keeps pre- and post-nominal attributes attached to their head noun", () => {
		expect(words("attribute-vor-nachgestellt", 0)).toContain(
			"Die aufmerksame Schülerin",
		);
		expect(words("attribute-vor-nachgestellt", 1)).toContain("der Redaktion");
		expect(words("attribute-vor-nachgestellt", 1)).toContain(
			"über das Turnier",
		);
		expect(words("attribute-vor-nachgestellt", 2)).toContain(
			"Den gedruckten Bericht der Redaktion",
		);
	});

	it("shows tense shift for anterior temporal clauses and verb-final order", () => {
		expect(words("kausal-temporalsaetze", 0)).toContain(
			"weil die Bühne gestrichen wird.",
		);
		expect(words("kausal-temporalsaetze", 1)).toContain(
			"Während die Bühne gestrichen wird,",
		);
		expect(words("kausal-temporalsaetze", 2)).toContain(
			"Nachdem die Farbe getrocknet war,",
		);
	});

	it("contrasts pronominal-adverb series, subordinate clauses and prepositional reduction", () => {
		expect(words("satzreihe-satzgefuege", 0)).toContain("deshalb");
		expect(words("satzreihe-satzgefuege", 1)).toContain("Weil es stark regnet,");
		expect(words("satzreihe-satzgefuege", 2)).toContain(
			"Wegen des starken Regens",
		);
	});

	it("shows replacement probes for das and no replacement for dass", () => {
		expect(words("das-oder-dass", 0)).toContain("Dieses");
		expect(words("das-oder-dass", 1)).toContain("welches");
		expect(words("das-oder-dass", 2)).toContain("kein Ersatz!");
	});

	it("marks embedded relative-clause commas, direct quotes and name apostrophes", () => {
		expect(words("komma-satzreihe-satzgefuege", 2)).toBe(
			"Der Bus, auf den wir gewartet haben, fährt pünktlich ab.",
		);
		expect(words("zitieren-apostroph", 0)).toBe(
			"„Alle hielten den Atem an“ (Z. 14), heißt es im Bericht.",
		);
		expect(words("zitieren-apostroph", 2)).toBe("Andreas’ Heft Lenas Heft");
	});

	it("distinguishes nominalisation, time expressions, compound separation and dictionary entry", () => {
		expect(words("gross-kleinschreibung", 0)).toContain("Beim Trainieren");
		expect(words("gross-kleinschreibung", 1)).toContain("auf Grün");
		expect(words("gross-kleinschreibung", 2)).toContain(
			"Heute Morgen dienstags & abends",
		);
		expect(words("getrennt-zusammen", 0)).toContain("Rad fahren");
		expect(words("getrennt-zusammen", 1)).toContain("hellblau leuchtend blau");
		expect(words("getrennt-zusammen", 2)).toContain(
			"schwer krank schwerbehindert",
		);
		const dictHtml = renderLanguageModel(lesson("fehleranalyse-strategien"), 2);
		expect(dictHtml).toContain('<span class="letter-active">R</span>');
		expect(
			modelBlocks(lesson("fehleranalyse-strategien"), 2).some(
				(b) => b.tone === "entry" && b.text === "Rhythmus",
			),
		).toBe(true);
	});
});

describe("Character constellation diagram structure", () => {
	it("renders all three characters, turning point and numbered visual marks", () => {
		const html = renderVisual(lesson("strukturierungshilfen"));
		expect(html).toContain("Mira");
		expect(html).toContain("Lukas");
		expect(html).toContain("Tara");
		expect(html).toContain("Wendepunkt: Fundort");
		expect(html.match(/data-visual-mark="/g)).toHaveLength(3);
	});

	it("renders the three literary genres on the ballad diagram", () => {
		const html = renderVisual(lesson("gattungen-ballade"));
		expect(html).toContain("Epik");
		expect(html).toContain("Lyrik");
		expect(html).toContain("Dramatik");
		expect(html.match(/data-visual-mark="/g)).toHaveLength(3);
	});
});
