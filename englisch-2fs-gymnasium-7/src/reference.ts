import { esc } from "./practice";

const grammar = [
	{
		title: "Rückblick und Ergebnis",
		rows: [
			[
				"Simple past",
				"Ein Ereignis zu einer abgeschlossenen Zeit, zum Beispiel yesterday oder last Friday.",
				"We repaired the bike yesterday.",
				"perfect",
			],
			[
				"Present perfect simple",
				"Have oder has + dritte Verbform. Das Ergebnis ist jetzt wichtig.",
				"We’ve repaired the bike. You can ride it now.",
				"perfect",
			],
			[
				"Past progressive",
				"Was oder were + ing-Form. Die Handlung war gerade im Gange.",
				"We were cycling when it started to rain.",
				"past-progressive",
			],
		],
	},
	{
		title: "Pläne, Bedingungen und Modalverben",
		rows: [
			[
				"Fahrplan und will-future",
				"Fahrpläne verwenden das simple present. Für Vorhersagen und spontane Angebote steht oft will + Grundform.",
				"The bus leaves at six. I’ll wait with you.",
				"future",
			],
			[
				"Conditional I",
				"Im if-Teil steht hier simple present. Der Hauptsatz kann eine Vorhersage, Möglichkeit, Anweisung oder regelmäßige Folge ausdrücken.",
				"If it rains, we’ll take the bus.",
				"conditions",
			],
			[
				"Modale Ersatzformen",
				"Had to drückt eine frühere Pflicht aus. Be able to steht für Fähigkeit. Be allowed to steht für Erlaubnis.",
				"We had to wait. We’ll be allowed to go inside.",
				"modals",
			],
		],
	},
	{
		title: "Vergleiche und genauere Beschreibungen",
		rows: [
			[
				"Adjektiv und Adverb",
				"Das Adjektiv beschreibt hier eine Sache. Das Adverb sagt, wie die Handlung abläuft.",
				"a quiet voice · She speaks quietly.",
				"adverbs",
			],
			[
				"Steigerung",
				"Mit than vergleichst du Unterschiede, mit as … as Gleichheit. Well wird zu better und best.",
				"Lee runs faster than Jo. Ava is as fast as Bo.",
				"compare",
			],
			[
				"Relativsätze",
				"Who oder that für Personen, which oder that für Sachen. Ein Objekt-Relativpronomen kann hier wegfallen.",
				"the girl who plays the drums · the song we heard",
				"relatives",
			],
		],
	},
] as const;

export function renderGrammarReference(): string {
	return `<section class="panel" aria-labelledby="grammar-overview"><h2 id="grammar-overview">Grammatik auf einen Blick</h2><div class="grammar-overview">${grammar
		.map(
			({ title, rows }) =>
				`<section><h3>${esc(title)}</h3><dl>${rows
					.map(
						([term, rule, example, lesson]) =>
							`<div><dt><button type="button" class="text-button" data-lesson="e7s-${lesson}">${esc(term)}</button></dt><dd>${esc(rule)}<br><em lang="en">${esc(example)}</em></dd></div>`,
					)
					.join("")}</dl></section>`,
		)
		.join("")}</div></section>`;
}
