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

describe("Displayed language models and their Grade 7 Gymnasium purpose", () => {
	it("contrasts semantic narrowing, amelioration and pejoration in wortgeschichte-bedeutungswandel", () => {
		expect(words("wortgeschichte-bedeutungswandel", 0)).toContain("hochgezit");
		expect(words("wortgeschichte-bedeutungswandel", 0)).toContain("Hochzeit");
		expect(words("wortgeschichte-bedeutungswandel", 1)).toContain("marahscalc");
		expect(words("wortgeschichte-bedeutungswandel", 1)).toContain("Marschall");
		expect(words("wortgeschichte-bedeutungswandel", 2)).toContain("billig = gerecht");
		expect(words("wortgeschichte-bedeutungswandel", 2)).toContain(
			"billig = minderwertig",
		);
	});

	it("contrasts mood, attribute density and clause structure effects in jugendsprache-sprachwandel", () => {
		expect(words("jugendsprache-sprachwandel", 0)).toContain("werde pünktlich geschlossen");
		expect(words("jugendsprache-sprachwandel", 1)).toContain("Das schwere, knarrende");
		expect(words("jugendsprache-sprachwandel", 2)).toContain("Obwohl drei Schüler rannten");
	});

	it("shows case flexibility, verb bracket and cognate roots in ober-unterbegriffe-d6", () => {
		expect(words("ober-unterbegriffe-d6", 0)).toBe("Den Text liest das Kind.");
		expect(words("ober-unterbegriffe-d6", 1)).toContain("hat");
		expect(words("ober-unterbegriffe-d6", 1)).toContain("gelesen.");
		expect(words("ober-unterbegriffe-d6", 2)).toContain("lat. scribere");
	});

	it("builds abstract nouns and splits loanword components in fremdwoerter-funktion", () => {
		expect(words("fremdwoerter-funktion", 0)).toContain("die Veränderung");
		expect(words("fremdwoerter-funktion", 1)).toContain("Biblio- -thek");
		expect(words("fremdwoerter-funktion", 2)).toContain("Rhy- -th- -mus");
	});

	it("separates Konjunktiv I from Konjunktiv II substitution in indirect speech", () => {
		expect(words("indikativ-konjunktiv-rede", -1)).toContain(
			"„Ich habe den Bericht gelesen.“",
		);
		expect(words("indikativ-konjunktiv-rede", 0)).toContain("sie habe");
		expect(words("indikativ-konjunktiv-rede", 1)).toContain("sie bräuchten");
		expect(words("indikativ-konjunktiv-rede", 2)).toContain("sein Team werde");
	});

	it("gradates modality, irrealis and politeness with Konjunktiv II in adverbiale-bestimmungen", () => {
		expect(words("adverbiale-bestimmungen", 0)).toContain("dürfte");
		expect(words("adverbiale-bestimmungen", 1)).toContain("Wenn ein Schlüssel da wäre");
		expect(words("adverbiale-bestimmungen", 2)).toContain("Könnten Sie");
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

	it("contrasts conditional and consecutive clauses and adverbials in kausal-temporalsaetze", () => {
		expect(words("kausal-temporalsaetze", 0)).toContain("Falls es trocken bleibt,");
		expect(words("kausal-temporalsaetze", 1)).toContain("sodass wir im Hof spielten.");
		expect(words("kausal-temporalsaetze", 2)).toContain("Bei gutem Wetter");
	});

	it("contrasts concessive and adversative clauses and adverbials in modal-lokal-attributsaetze", () => {
		expect(words("modal-lokal-attributsaetze", 0)).toContain("Obwohl es stürmte,");
		expect(words("modal-lokal-attributsaetze", 1)).toContain("Trotz des heftigen Sturms");
		expect(words("modal-lokal-attributsaetze", 2)).toContain(
			"während die Achte in die Aula umzog.",
		);
	});

	it("contrasts coordination and subordination in satzreihe-satzgefuege", () => {
		expect(words("satzreihe-satzgefuege", 0)).toContain("aber");
		expect(words("satzreihe-satzgefuege", 1)).toContain("Weil das Licht ausfiel,");
		expect(words("satzreihe-satzgefuege", 2)).toContain("sodass man im Flur leuchtete.");
	});

	it("marks obligatory commas for infinitive and participle groups in das-oder-dass", () => {
		expect(words("das-oder-dass", 0)).toContain("um den Preis zu gewinnen.");
		expect(words("das-oder-dass", 1)).toContain("Sie denkt daran,");
		expect(words("das-oder-dass", 2)).toContain("Vom Lärm geweckt,");
	});

	it("keeps appositions in congruent case and encloses postposed specifications in komma-satzreihe-satzgefuege", () => {
		expect(words("komma-satzreihe-satzgefuege", 0)).toContain(
			"die neue Bibliotheksleiterin,",
		);
		expect(words("komma-satzreihe-satzgefuege", 1)).toContain(
			"dem erfahrenen Trainer,",
		);
		expect(words("komma-satzreihe-satzgefuege", 2)).toContain(
			"vor allem Naturballaden,",
		);
	});

	it("positions direct speech commas and quotation reference brackets cleanly in zitieren-apostroph", () => {
		expect(words("zitieren-apostroph", 0)).toBe("„Wer liest vor?“ , fragt er.");
		expect(words("zitieren-apostroph", 1)).toBe(
			"„Das Tor“, rief der Bote, „öffnet sich gleich!“",
		);
		expect(words("zitieren-apostroph", 2)).toBe("„… unabhängig“ (S. 14) .");
	});

	it("distinguishes nominalisation, time expressions, compound separation and dictionary entry", () => {
		expect(words("gross-kleinschreibung", 0)).toContain("Beim Trainieren");
		expect(words("gross-kleinschreibung", 1)).toContain("das neue Buch");
		expect(words("gross-kleinschreibung", 2)).toContain(
			"Heute Morgen dienstags & abends auf Grün",
		);
		expect(words("getrennt-zusammen", 0)).toContain("Rad fahren stattfinden");
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
