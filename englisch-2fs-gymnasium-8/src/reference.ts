import { esc } from "./practice";

const grammar = [
	{
		title: "Zeitenfolge, Dauer und Bedingungen",
		rows: [
			[
				"Present perfect simple vs. progressive",
				"Simple fragt nach Ergebnis oder Anzahl, progressive nach Dauer oder anhaltender Tätigkeit bis jetzt.",
				"I’ve written three emails. · It’s been snowing since noon.",
				"present-perfect-prog",
			],
			[
				"Past perfect simple",
				"Had + 3. Verbform zeigt die Vorvergangenheit vor einem späteren Punkt im simple past.",
				"When we reached the dock, the ferry had already left.",
				"past-perfect",
			],
			[
				"Temporalsätze & Zeitenfolge",
				"In Zukunfts-Nebensätzen (after, when, as soon as) steht present tense statt will; in der Vergangenheit trennt past perfect frühere Schritte.",
				"I’ll call you as soon as I arrive. · After we had eaten, we left.",
				"tense-sequence",
			],
			[
				"Conditional II & III",
				"Typ II: if + simple past, would + Grundform (jetzt/unwahrscheinlich). Typ III: if + past perfect, would have + 3. Form (verpasst in der Vergangenheit).",
				"If I lived in Ottawa, I’d ski. · If he had left earlier, he’d have caught it.",
				"conditional-two",
			],
			[
				"Mixed Conditionals & Wünsche",
				"Mischform verbindet frühere Bedingung (past perfect) mit Folge heute (would + Grundform). Wünsche nutzen I wish + past oder past perfect.",
				"If I had saved the file, I wouldn’t worry now. · I wish I knew.",
				"mixed-wishes",
			],
		],
	},
	{
		title: "Adverbien, Gerund, Infinitiv und Passiv",
		rows: [
			[
				"Adverbstellung & Sinnesverben",
				"Häufigkeitsadverbien stehen vor dem Vollverb (hinter be/Hilfsverb), Art–Ort–Zeit meist am Satzende. Nach look, sound, smell, taste, feel steht ein Adjektiv für eine Eigenschaft.",
				"She always speaks calmly. · The soup smells wonderful.",
				"sense-verbs",
			],
			[
				"Gerund & Infinitivmuster",
				"Als Subjekt und nach Präpositionen/Ausdrücken (capable of, look forward to, avoid, it’s no use) steht -ing; bei in order to, it’s + Adj. + to und the first to steht to-Infinitiv.",
				"Swimming helps you relax. · She was the first to arrive.",
				"gerund-patterns",
			],
			[
				"Stop & Remember mit Bedeutungswechsel",
				"Mit -ing: laufende Handlung beenden (stop) oder Erinnerung an Früheres (remember). Mit to-Infinitiv: anhalten für (stop) oder rechtzeitig an eine Aufgabe denken.",
				"He stopped talking. · He stopped to buy water.",
				"gerund-inf-meaning",
			],
			[
				"Verben mit zwei Objekten & Passiv",
				"Bei two-object verbs kann auch die Person Passivsubjekt werden (Personal Passive). Im Passiv trägt to be die Zeitform, das Vollverb bleibt 3. Form.",
				"Maya was shown the route. · The letters were sent yesterday.",
				"passive-tenses",
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
							`<div><dt><button type="button" class="text-button" data-lesson="e8s-${lesson}">${esc(term)}</button></dt><dd>${esc(rule)}<br><em lang="en">${esc(example)}</em></dd></div>`,
					)
					.join("")}</dl></section>`,
		)
		.join("")}</div></section>`;
}
