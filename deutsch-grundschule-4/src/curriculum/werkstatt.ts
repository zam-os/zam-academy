// Station 1 · Wörterwerkstatt: Wortarten, Fälle, Zeitformen und Wortbildung
// (LehrplanPLUS Deutsch 3/4, 4.3 with the related 4.4 strategies).
import { choice, pick, shuffle, text } from "../exercises/tasks";
import type { Lesson, MachineWorkshop } from "../types";
import { cuts, gaps, marks, slotWorkshop } from "./helpers";

/* ---------- 1 Nomen und Artikel ---------- */

const GENDER: [string, "der" | "die" | "das"][] = [
	["Löffel", "der"],
	["Gabel", "die"],
	["Messer", "das"],
	["Mond", "der"],
	["Sonne", "die"],
	["Fenster", "das"],
	["Käse", "der"],
	["Butter", "die"],
	["Brot", "das"],
	["Schrank", "der"],
	["Tür", "die"],
	["Zimmer", "das"],
	["Bleistift", "der"],
	["Brille", "die"],
	["Fahrrad", "das"],
	["Igel", "der"],
	["Ente", "die"],
	["Pferd", "das"],
	["Mut", "der"],
	["Freude", "die"],
	["Glück", "das"],
	["Schnee", "der"],
	["Wolke", "die"],
	["Gewitter", "das"],
];

const PLURAL: [string, string][] = [
	["der Baum", "Bäume"],
	["die Maus", "Mäuse"],
	["das Haus", "Häuser"],
	["der Vogel", "Vögel"],
	["die Blume", "Blumen"],
	["das Buch", "Bücher"],
	["der Apfel", "Äpfel"],
	["die Stadt", "Städte"],
	["das Kind", "Kinder"],
	["der Hund", "Hunde"],
	["die Nacht", "Nächte"],
	["das Glas", "Gläser"],
	["der Zahn", "Zähne"],
	["die Hand", "Hände"],
	["das Rad", "Räder"],
	["der Fuß", "Füße"],
];

const NOUNS: [string, string][] = [
	["Freude", "die"],
	["Mut", "der"],
	["Angst", "die"],
	["Idee", "die"],
	["Hunger", "der"],
	["Wald", "der"],
	["Brücke", "die"],
	["Ferien", "die"],
	["Glück", "das"],
	["Traum", "der"],
];
const NOT_NOUNS = ["laufen", "fröhlich", "schnell", "singen", "leise", "mutig", "ängstlich", "hungrig", "träumen", "glücklich"];

/** Lower-case sentences with exactly two nouns, for "Schreibe die Nomen heraus". */
const TWO_NOUNS: [string, string, string][] = [
	["im herbst fallen die bunten blätter.", "Herbst", "Blätter"],
	["meine oma backt einen leckeren kuchen.", "Oma", "Kuchen"],
	["der kleine junge hat große angst.", "Junge", "Angst"],
	["wir fahren mit dem zug nach augsburg.", "Zug", "Augsburg"],
	["die katze schläft auf dem sofa.", "Katze", "Sofa"],
	["mit viel mut klettert lea auf den turm.", "Mut", "Turm"],
	["das pferd frisst gern frische äpfel.", "Pferd", "Äpfel"],
	["nach der schule spielen wir im garten.", "Schule", "Garten"],
];

const nomen: Lesson = {
	id: "nomen-artikel",
	stage: "werkstatt",
	title: "Nomen und ihre Begleiter",
	skill: "Du erkennst Nomen, findest ihren Artikel und bildest die Mehrzahl.",
	lehrplan: "D3/4 4.3 · 4.4: Nomen, Artikel, Nominalkern",
	bindings: ["4.3-06", "4.4-12"],
	sticker: { emoji: "🏷️", name: "Namensschild" },
	paragraphs: [
		"Nomen sind Namen. Sie benennen Menschen, Tiere, Pflanzen und Dinge: Oma, Igel, Tulpe, Tisch. Auch Gefühle und Gedanken sind Nomen, obwohl du sie nicht anfassen kannst: die Angst, die Freude, die Idee.",
		"Vor einem Nomen kann ein Artikel stehen, sein Begleiter. Bestimmte Artikel sind der, die und das. Unbestimmte Artikel sind ein und eine. Am Artikel siehst du das Geschlecht: der Löffel ist männlich, die Gabel weiblich, das Messer sächlich.",
		"Die meisten Nomen haben eine Einzahl und eine Mehrzahl: der Baum – die Bäume. Nomen schreibst du immer groß.",
	],
	example: {
		title: "So prüft Tinto ein Wort",
		lines: [
			"„Hund“: der Hund – die Hunde. Artikel passt, Mehrzahl geht → Nomen.",
			"„Angst“: die Angst. Ein Gefühl, aber mit Artikel → Nomen.",
			"„laufen“: der laufen? Das klingt falsch → kein Nomen.",
			"Erweitern hilft auch: der Ball – der rote Ball – der rote neue Ball. Das Wort am Ende ist das Nomen.",
		],
	},
	takeaway:
		"Nomen benennen Lebewesen, Dinge und Gedachtes. Sie haben einen Artikel (der, die, das) und werden großgeschrieben.",
	terms: [
		{ term: "Nomen", meaning: "Namenwort: Hund, Tisch, Freude" },
		{ term: "Artikel", meaning: "Begleiter: der, die, das · ein, eine" },
		{ term: "Einzahl / Mehrzahl", meaning: "der Baum – die Bäume" },
		{ term: "Geschlecht", meaning: "männlich (der), weiblich (die), sächlich (das)" },
	],
	check: {
		wrong: "Nur Wörter für Dinge, die man anfassen kann.",
		explanation: "Auch Gefühle und Gedanken wie die Freude oder die Idee sind Nomen.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Tintos Schreibmaschine",
			intro:
				"Oh nein! Tintos Schreibmaschine hat alle großen Buchstaben verschluckt. Tippe die Nomen an, damit Tinto weiß, was er groß schreiben muss.",
			pens: [{ value: "N", label: "Nomen", colour: "blue" }],
			puzzles: [
				marks("hund", "der kleine hund|N sucht im garten|N seinen knochen|N ."),
				marks("angst", "meine oma|N hat große angst|N vor gewittern|N ."),
				marks(
					"freude",
					"nach der schule|N spielen die kinder|N mit viel freude|N fußball|N .",
				),
			],
		},
		[
			"Finde alle Nomen im Hundesatz.",
			"Finde die Nomen im Oma-Satz. Ein Gefühl ist dabei!",
			"Finde alle vier Nomen im Fußball-Satz.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [answer, article] = pick(rng, NOUNS);
				const wrong = shuffle(rng, NOT_NOUNS).slice(0, 3);
				return choice(rng, {
					prompt: "Welches Wort ist ein Nomen?",
					answer,
					wrong,
					hint: "Setze der, die oder das davor. Klingt es richtig?",
					explanation: `Man kann sagen: ${article} ${answer}. Deshalb ist „${answer}“ ein Nomen.`,
					key: `nomen:${answer}:${wrong.join()}`,
				});
			},
			(rng) => {
				const [noun, article] = pick(rng, GENDER);
				return choice(rng, {
					prompt: "Welcher Artikel passt?",
					material: `___ ${noun}`,
					answer: article,
					wrong: ["der", "die", "das"],
					hint: "Sprich alle drei laut: der …, die …, das … Welcher klingt richtig?",
					explanation: `Es heißt: ${article} ${noun}.`,
					key: `artikel:${noun}`,
				});
			},
		],
		2: [
			(rng) => {
				const [singular, plural] = pick(rng, PLURAL);
				return text({
					prompt: "Schreibe die Mehrzahl auf.",
					material: `${singular} – die …`,
					accept: [plural, `die ${plural}`],
					hint: "Sprich: eins, zwei, viele … Achte auf Umlaute (ä, ö, ü) und schreibe groß.",
					explanation: `${singular} – die ${plural}.`,
					mistakes: {
						[plural.toLowerCase()]: "Nomen schreibst du groß.",
					},
					key: `plural:${singular}`,
				});
			},
			(rng) => {
				const [sentence, a, b] = pick(rng, TWO_NOUNS);
				return text({
					prompt:
						"Hier fehlen die großen Buchstaben. Schreibe die beiden Nomen richtig heraus.",
					material: sentence,
					accept: [`${a}, ${b}`, `${a} ${b}`, `${a} und ${b}`, `${b}, ${a}`, `${b} ${a}`, `${b} und ${a}`],
					hint: "Mache die Artikelprobe bei jedem Wort. Schreibe die Nomen mit großem Anfangsbuchstaben, getrennt durch ein Komma.",
					explanation: `Die Nomen sind „${a}“ und „${b}“.`,
					key: `zwei-nomen:${a}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 2 Die vier Fälle ---------- */

type Case = "1. Fall" | "2. Fall" | "3. Fall" | "4. Fall";
const CASES: Case[] = ["1. Fall", "2. Fall", "3. Fall", "4. Fall"];
const QUESTION: Record<Case, string> = {
	"1. Fall": "Wer oder was?",
	"2. Fall": "Wessen?",
	"3. Fall": "Wem?",
	"4. Fall": "Wen oder was?",
};
const LATIN: Record<Case, string> = {
	"1. Fall": "Nominativ",
	"2. Fall": "Genitiv",
	"3. Fall": "Dativ",
	"4. Fall": "Akkusativ",
};

/** Sentence, marked part, its case and the question that finds it. */
const CASE_SENTENCES: [string, Case, string][] = [
	["[[Der Bäcker]] backt frische Brezen.", "1. Fall", "Wer backt frische Brezen?"],
	["Das Auto [[des Nachbarn]] ist rot.", "2. Fall", "Wessen Auto ist rot?"],
	["Lena hilft [[ihrem Bruder]].", "3. Fall", "Wem hilft Lena?"],
	["Der Opa repariert [[das Fahrrad]].", "4. Fall", "Wen oder was repariert der Opa?"],
	["Wir besuchen [[den Zoo]].", "4. Fall", "Wen oder was besuchen wir?"],
	["Die Lehrerin gibt [[den Kindern]] die Hefte.", "3. Fall", "Wem gibt die Lehrerin die Hefte?"],
	["Die Kinder hören [[der Lehrerin]] zu.", "3. Fall", "Wem hören die Kinder zu?"],
	["Der Schwanz [[der Katze]] ist lang.", "2. Fall", "Wessen Schwanz ist lang?"],
	["[[Die Sonne]] scheint hell.", "1. Fall", "Wer oder was scheint hell?"],
	["Ich sehe [[die Sonne]].", "4. Fall", "Wen oder was sehe ich?"],
	["Das Dach [[des Hauses]] ist neu.", "2. Fall", "Wessen Dach ist neu?"],
	["Mia schreibt [[ihrer Freundin]] einen Brief.", "3. Fall", "Wem schreibt Mia einen Brief?"],
	["Mia schreibt ihrer Freundin [[einen Brief]].", "4. Fall", "Wen oder was schreibt Mia?"],
	["[[Mein Hund]] bellt laut.", "1. Fall", "Wer oder was bellt laut?"],
	["Wir danken [[dem Busfahrer]].", "3. Fall", "Wem danken wir?"],
	["Papa kauft [[einen Kuchen]].", "4. Fall", "Wen oder was kauft Papa?"],
];

/** Fill a noun phrase in the right case: sentence frame, base form, answer. */
const CASE_FILL: [string, string, string, Case][] = [
	["Tinto schenkt ___ eine Blume.", "die Lehrerin", "der Lehrerin", "3. Fall"],
	["Wir helfen ___ beim Tragen.", "der Nachbar", "dem Nachbarn", "3. Fall"],
	["Lea füttert ___.", "der Hund", "den Hund", "4. Fall"],
	["Das Fell ___ ist weich.", "das Pferd", "des Pferdes", "2. Fall"],
	["Ben gibt ___ einen Ball.", "das Kind", "dem Kind", "3. Fall"],
	["Ich suche ___.", "der Schlüssel", "den Schlüssel", "4. Fall"],
	["Die Farbe ___ ist blau.", "der Himmel", "des Himmels", "2. Fall"],
	["Oma erzählt ___ ein Märchen.", "die Kinder", "den Kindern", "3. Fall"],
	["Wir sehen ___ am Himmel.", "der Mond", "den Mond", "4. Fall"],
	["Die Blätter ___ sind gelb.", "der Baum", "des Baumes", "2. Fall"],
];

const ARTICLES: Record<string, Record<Case, [string, string]>> = {
	// noun → case → [without adjective, with adjective]
	Hund: {
		"1. Fall": ["der Hund", "der kleine Hund"],
		"2. Fall": ["des Hundes", "des kleinen Hundes"],
		"3. Fall": ["dem Hund", "dem kleinen Hund"],
		"4. Fall": ["den Hund", "den kleinen Hund"],
	},
	Katze: {
		"1. Fall": ["die Katze", "die kleine Katze"],
		"2. Fall": ["der Katze", "der kleinen Katze"],
		"3. Fall": ["der Katze", "der kleinen Katze"],
		"4. Fall": ["die Katze", "die kleine Katze"],
	},
	Pferd: {
		"1. Fall": ["das Pferd", "das kleine Pferd"],
		"2. Fall": ["des Pferdes", "des kleinen Pferdes"],
		"3. Fall": ["dem Pferd", "dem kleinen Pferd"],
		"4. Fall": ["das Pferd", "das kleine Pferd"],
	},
};
const FRAME: Record<Case, (x: string) => string> = {
	"1. Fall": (x) => `${x[0].toUpperCase()}${x.slice(1)} schläft im Stall.`,
	"2. Fall": (x) => `Das Fell ${x} glänzt.`,
	"3. Fall": (x) => `Tinto bringt ${x} Wasser.`,
	"4. Fall": (x) => `Tinto streichelt ${x}.`,
};

const caseMachine: MachineWorkshop = {
	kind: "machine",
	title: "Die Fall-Maschine",
	intro:
		"Dreh an den Rädern! Die Maschine setzt das Nomen in einen Satz. Beobachte, wie sich Artikel, Adjektiv und Nomen verändern.",
	controls: [
		{ id: "nomen", label: "Nomen", options: ["Hund", "Katze", "Pferd"] },
		{ id: "fall", label: "Fall", options: CASES },
		{ id: "adjektiv", label: "Adjektiv", options: ["ohne", "klein"] },
	],
	initial: { nomen: "Hund", fall: "1. Fall", adjektiv: "ohne" },
	view: (v) => {
		const c = v.fall as Case;
		const phrase = ARTICLES[v.nomen][c][v.adjektiv === "klein" ? 1 : 0];
		return {
			display: FRAME[c](phrase),
			note: `${c} (${LATIN[c]}) · Frage: ${QUESTION[c]} → ${phrase}`,
			found: `${v.nomen}|${c}|${v.adjektiv}`,
			tone: "ok",
		};
	},
	goals: [
		{
			id: "den-hund",
			label: "Finde den Fall, in dem aus „der Hund“ „den Hund“ wird.",
			reached: (s) => s.values.nomen === "Hund" && s.values.fall === "4. Fall",
		},
		{
			id: "der-katze",
			label: "Bei der Katze heißt es in zwei Fällen „der Katze“. Finde beide.",
			reached: (s) =>
				s.found.some((f) => f.startsWith("Katze|2. Fall")) &&
				s.found.some((f) => f.startsWith("Katze|3. Fall")),
		},
		{
			id: "kleinen",
			label: "Schalte „klein“ dazu und finde „dem kleinen Pferd“.",
			reached: (s) =>
				s.values.nomen === "Pferd" &&
				s.values.fall === "3. Fall" &&
				s.values.adjektiv === "klein",
		},
	],
};

const faelle: Lesson = {
	id: "vier-faelle",
	stage: "werkstatt",
	title: "Die vier Fälle",
	skill: "Du findest den Fall eines Nomens mit der richtigen Frage.",
	lehrplan: "D3/4 4.3: Fall bei Artikeln, Nomen und Adjektiven",
	bindings: ["4.3-06", "4.3-13"],
	sticker: { emoji: "🔑", name: "Fall-Schlüssel" },
	paragraphs: [
		"Im Satz steht ein Nomen immer in einem von vier Fällen. Du findest den Fall mit einer Frage. Dabei veränderst du den Satz nicht, du fragst nur.",
		"Je nach Fall ändert sich der Artikel, manchmal auch das Adjektiv und das Nomen: der Hund, des Hundes, dem Hund, den Hund. Aus „der kleine Hund“ wird „dem kleinen Hund“.",
		"Vorsicht: „der“ kann verschiedene Fälle zeigen. „Der Schwanz der Katze“ ist der 2. Fall, „Ich helfe der Katze“ der 3. Fall. Deshalb fragst du immer.",
	],
	example: {
		title: "Tinto fragt nach",
		lines: [
			"Die Katze jagt den Hund. → Wen oder was jagt die Katze? → den Hund: 4. Fall.",
			"Ich gebe dem Hund Futter. → Wem gebe ich Futter? → dem Hund: 3. Fall.",
			"Das Fell des Hundes glänzt. → Wessen Fell glänzt? → des Hundes: 2. Fall.",
			"Der Hund schläft. → Wer oder was schläft? → der Hund: 1. Fall.",
		],
	},
	takeaway:
		"1. Fall: Wer oder was? · 2. Fall: Wessen? · 3. Fall: Wem? · 4. Fall: Wen oder was?",
	terms: [
		{ term: "1. Fall (Nominativ)", meaning: "Wer oder was? – der Hund" },
		{ term: "2. Fall (Genitiv)", meaning: "Wessen? – des Hundes" },
		{ term: "3. Fall (Dativ)", meaning: "Wem? – dem Hund" },
		{ term: "4. Fall (Akkusativ)", meaning: "Wen oder was? – den Hund" },
	],
	check: {
		wrong: "Ich schaue nur, ob der Artikel „der“ oder „den“ ist.",
		explanation:
			"„der“ kann der 1., 2. oder 3. Fall sein. Nur die Frage zeigt den Fall sicher.",
	},
	workshop: caseMachine,
	generators: {
		1: [
			(rng) => {
				const [sentence, c, question] = pick(rng, CASE_SENTENCES);
				return choice(rng, {
					prompt: "In welchem Fall steht der unterstrichene Teil?",
					material: sentence,
					answer: c,
					wrong: CASES,
					hint: `Tinto fragt: „${question}“`,
					explanation: `Die Frage „${question}“ gehört zum ${c} (${LATIN[c]}).`,
					mistakes: Object.fromEntries(
						CASES.filter((x) => x !== c).map((x) => [
							x,
							`Für den ${x} fragst du „${QUESTION[x]}“. Passt diese Frage zum Satz?`,
						]),
					),
					key: `fall:${sentence}`,
				});
			},
			(rng) => {
				const [frame, base, answer, c] = pick(rng, CASE_FILL);
				const article = answer.split(" ")[0];
				return choice(rng, {
					prompt: "Welcher Artikel passt in die Lücke?",
					material: frame.replace("___", `___ ${answer.split(" ").slice(1).join(" ")}`),
					answer: article,
					wrong: ["der", "des", "dem", "den", "die"].filter((a) => a !== article).slice(0, 3),
					hint: `Frage: ${QUESTION[c]} Es geht um ${base}.`,
					explanation: `${QUESTION[c]} → ${c}: ${answer}.`,
					key: `artikel-fall:${frame}`,
				});
			},
		],
		2: [
			(rng) => {
				const [sentence, c, question] = pick(rng, CASE_SENTENCES);
				return choice(rng, {
					prompt: "Bestimme den Fall des unterstrichenen Satzteils.",
					material: sentence,
					answer: `${c} (${LATIN[c]})`,
					wrong: CASES.map((x) => `${x} (${LATIN[x]})`),
					hint: "Bilde eine Frage zum unterstrichenen Teil: Wer oder was? Wessen? Wem? Wen oder was?",
					explanation: `„${question}“ → ${c} (${LATIN[c]}).`,
					key: `fall2:${sentence}`,
				});
			},
			(rng) => {
				const [frame, base, answer, c] = pick(rng, CASE_FILL);
				return text({
					prompt: "Setze die Wörter in Klammern im richtigen Fall ein. Schreibe nur die beiden Wörter.",
					material: frame.replace("___", `___ (${base})`),
					accept: [answer],
					hint: `Frage nach der Lücke. Welcher Fall ist das?`,
					explanation: `${QUESTION[c]} → ${c}: ${frame.replace("___", answer)}`,
					mistakes: { [base]: "Das ist der 1. Fall. Frage nach der Lücke: Welcher Fall passt?" },
					key: `fall-fill:${frame}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 3 Adjektive steigern ---------- */

const ADJ: [string, string, string][] = [
	["klein", "kleiner", "am kleinsten"],
	["lang", "länger", "am längsten"],
	["kalt", "kälter", "am kältesten"],
	["jung", "jünger", "am jüngsten"],
	["alt", "älter", "am ältesten"],
	["laut", "lauter", "am lautesten"],
	["dunkel", "dunkler", "am dunkelsten"],
	["gut", "besser", "am besten"],
	["viel", "mehr", "am meisten"],
	["hoch", "höher", "am höchsten"],
	["nah", "näher", "am nächsten"],
	["stark", "stärker", "am stärksten"],
	["warm", "wärmer", "am wärmsten"],
	["schön", "schöner", "am schönsten"],
	["kurz", "kürzer", "am kürzesten"],
];
const ADJ_WORDS: [string, string][] = [
	["mutig", "ein mutiges Kind"],
	["leise", "eine leise Stimme"],
	["bunt", "ein bunter Ball"],
	["frech", "ein freches Kind"],
	["weich", "ein weiches Kissen"],
	["ehrlich", "ein ehrlicher Freund"],
	["schnell", "ein schnelles Auto"],
	["nass", "ein nasser Hund"],
];
const NOT_ADJ = ["Mut", "lachen", "Ruhe", "schwimmen", "Farbe", "springen", "Stille", "rennen"];

const COMPARE: [string, "als" | "wie"][] = [
	["Lea ist so groß ___ Tim.", "wie"],
	["Lea ist größer ___ Tim.", "als"],
	["Der Elefant ist schwerer ___ das Pferd.", "als"],
	["Mein Rad ist genauso schnell ___ deins.", "wie"],
	["Heute ist es kälter ___ gestern.", "als"],
	["Tinto schwimmt so schnell ___ ein Fisch.", "wie"],
	["Der Turm ist höher ___ das Haus.", "als"],
	["Die Suppe ist so heiß ___ der Tee.", "wie"],
];

const STEIGER: Record<string, [string, string, string]> = {
	schnell: [
		"Der Gepard ist schnell.",
		"Der Gepard ist schneller als das Pferd.",
		"Der Gepard ist am schnellsten.",
	],
	groß: [
		"Der Elefant ist groß.",
		"Der Wal ist größer als der Elefant.",
		"Der Blauwal ist am größten.",
	],
	gut: [
		"Das erste Diktat ist gut.",
		"Das zweite Diktat ist besser als das erste.",
		"Das dritte Diktat ist am besten.",
	],
	hoch: [
		"Das Rathaus ist hoch.",
		"Der Kirchturm ist höher als das Rathaus.",
		"Der Fernsehturm ist am höchsten.",
	],
	viel: [
		"Tinto hat viel Tinte.",
		"Seine Tante hat mehr Tinte als Tinto.",
		"Die Riesenkrake hat am meisten Tinte.",
	],
	warm: [
		"Die Milch ist warm.",
		"Der Tee ist wärmer als die Milch.",
		"Die Suppe ist am wärmsten.",
	],
};
const STUFEN = ["Grundform", "1. Steigerungsstufe", "2. Steigerungsstufe"];

const adjektive: Lesson = {
	id: "adjektive-steigern",
	stage: "werkstatt",
	title: "Adjektive vergleichen und steigern",
	skill: "Du erkennst Adjektive und steigerst sie richtig.",
	lehrplan: "D3/4 4.3 · 4.4: Adjektive, Steigerung, Vergleich",
	bindings: ["4.3-06", "4.4-13"],
	sticker: { emoji: "🏆", name: "Siegerpokal" },
	paragraphs: [
		"Adjektive sagen, wie etwas ist: groß, leise, bunt, freundlich. Mit Adjektiven beschreibst du genau und erzählst spannend.",
		"Die meisten Adjektive kannst du steigern: schnell – schneller – am schnellsten. Das sind die Grundform, die 1. Steigerungsstufe und die 2. Steigerungsstufe. Manchmal kommt ein Umlaut dazu: groß – größer – am größten.",
		"Einige Adjektive ändern sich ganz: gut – besser – am besten, viel – mehr – am meisten. Beim Vergleichen gilt: gleich groß → „so … wie“, verschieden → „…er als“.",
	],
	example: {
		title: "Tinto vergleicht",
		lines: [
			"Tinto ist so schnell wie Kiki. (gleich → wie)",
			"Der Hai ist schneller als Tinto. (verschieden → als)",
			"Der Schwertfisch ist am schnellsten.",
			"Trick: Kannst du ein Wort steigern oder zwischen Artikel und Nomen stellen (der schnelle Fisch), ist es ein Adjektiv.",
		],
	},
	takeaway:
		"Adjektive beschreiben, wie etwas ist. Steigerung: Grundform – 1. Steigerungsstufe (-er) – 2. Steigerungsstufe (am …sten). Vergleich: so … wie (gleich), …er als (verschieden).",
	terms: [
		{ term: "Adjektiv", meaning: "Wiewort: schnell, bunt, leise" },
		{ term: "Grundform", meaning: "schnell" },
		{ term: "1. Steigerungsstufe", meaning: "schneller (als)" },
		{ term: "2. Steigerungsstufe", meaning: "am schnellsten" },
	],
	check: {
		wrong: "Mein Rad ist schneller wie deins.",
		explanation: "Bei der 1. Steigerungsstufe vergleichst du mit „als“: schneller als.",
	},
	workshop: {
		kind: "machine",
		title: "Die Steigerungs-Treppe",
		intro:
			"Wähle ein Adjektiv und eine Stufe. Tinto klettert die Treppe hinauf und zeigt dir den Satz.",
		controls: [
			{ id: "adj", label: "Adjektiv", options: Object.keys(STEIGER) },
			{ id: "stufe", label: "Stufe", options: STUFEN },
		],
		initial: { adj: "schnell", stufe: "Grundform" },
		view: (v) => {
			const index = STUFEN.indexOf(v.stufe);
			return {
				display: STEIGER[v.adj][index],
				note: `${v.stufe} von „${v.adj}“`,
				found: `${v.adj}|${index}`,
				tone: "ok",
			};
		},
		goals: [
			{
				id: "ganz-anders",
				label: "Finde eine Steigerung, bei der das Wort ganz anders wird.",
				reached: (s) =>
					["gut", "viel"].includes(s.values.adj) && s.values.stufe !== "Grundform",
			},
			{
				id: "umlaut",
				label: "Finde eine Steigerung, in der ein Umlaut (ä, ö, ü) auftaucht.",
				reached: (s) =>
					["groß", "hoch", "warm"].includes(s.values.adj) &&
					s.values.stufe !== "Grundform",
			},
			{
				id: "drei-gipfel",
				label: "Klettere ganz nach oben: Bilde für drei Adjektive die 2. Steigerungsstufe.",
				reached: (s) => s.found.filter((f) => f.endsWith("|2")).length >= 3,
			},
		],
	},
	generators: {
		1: [
			(rng) => {
				const [base, comp, sup] = pick(rng, ADJ);
				return choice(rng, {
					prompt: `Welche Form ist die 1. Steigerungsstufe von „${base}“?`,
					answer: comp,
					wrong: [base, sup, `${base}er`],
					hint: "Die 1. Steigerungsstufe brauchst du für „… als“: Er ist ___ als ich.",
					explanation: `${base} – ${comp} – ${sup}.`,
					key: `komparativ:${base}`,
				});
			},
			(rng) => {
				const [answer, example] = pick(rng, ADJ_WORDS);
				const wrong = shuffle(rng, NOT_ADJ).slice(0, 3);
				return choice(rng, {
					prompt: "Welches Wort ist ein Adjektiv?",
					answer,
					wrong,
					hint: "Kannst du das Wort steigern? Oder passt es zwischen „der“ und ein Nomen?",
					explanation: `Man kann sagen: ${example}. „${answer}“ ist ein Adjektiv.`,
					key: `adjektiv:${answer}:${wrong.join()}`,
				});
			},
		],
		2: [
			(rng) => {
				const [base, comp, sup] = pick(rng, ADJ);
				const which = rng() < 0.5 ? 1 : 2;
				return text({
					prompt:
						which === 1
							? "Schreibe die 1. Steigerungsstufe."
							: "Schreibe die 2. Steigerungsstufe mit „am“.",
					material: `${base} – ${which === 1 ? "…" : comp} – ${which === 1 ? sup : "…"}`,
					accept: [which === 1 ? comp : sup],
					hint: "Sprich die Treppe laut: … – …er – am …sten. Achte auf Umlaute und Ausnahmen.",
					explanation: `${base} – ${comp} – ${sup}.`,
					mistakes:
						which === 1
							? { [`${base}er`]: "Hör genau hin: Bei diesem Wort ändert sich mehr, zum Beispiel ein Umlaut oder das ganze Wort." }
							: { [sup.replace("am ", "")]: "Bei der 2. Steigerungsstufe steht „am“ davor." },
					key: `steigern:${base}:${which}`,
				});
			},
			(rng) => {
				const [sentence, answer] = pick(rng, COMPARE);
				return choice(rng, {
					prompt: "„als“ oder „wie“? Wähle das richtige Wort.",
					material: sentence,
					answer,
					wrong: ["als", "wie"],
					hint: "Sind beide gleich? Dann „so … wie“. Ist einer mehr? Dann „…er als“.",
					explanation:
						answer === "wie"
							? "Bei gleichen Dingen vergleichst du mit „so … wie“."
							: "Nach der 1. Steigerungsstufe steht „als“.",
					key: `als-wie:${sentence}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 4 Verben und Personalformen ---------- */

const PERSONS = ["ich", "du", "er/sie/es", "wir", "ihr", "sie (Mehrzahl)"];
const CONJ: Record<string, string[]> = {
	spielen: ["spiele", "spielst", "spielt", "spielen", "spielt", "spielen"],
	lesen: ["lese", "liest", "liest", "lesen", "lest", "lesen"],
	laufen: ["laufe", "läufst", "läuft", "laufen", "lauft", "laufen"],
	fahren: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"],
	sein: ["bin", "bist", "ist", "sind", "seid", "sind"],
	geben: ["gebe", "gibst", "gibt", "geben", "gebt", "geben"],
	sehen: ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"],
	schlafen: ["schlafe", "schläfst", "schläft", "schlafen", "schlaft", "schlafen"],
	nehmen: ["nehme", "nimmst", "nimmt", "nehmen", "nehmt", "nehmen"],
	essen: ["esse", "isst", "isst", "essen", "esst", "essen"],
	helfen: ["helfe", "hilfst", "hilft", "helfen", "helft", "helfen"],
	tragen: ["trage", "trägst", "trägt", "tragen", "tragt", "tragen"],
	haben: ["habe", "hast", "hat", "haben", "habt", "haben"],
	malen: ["male", "malst", "malt", "malen", "malt", "malen"],
	schreiben: ["schreibe", "schreibst", "schreibt", "schreiben", "schreibt", "schreiben"],
	tanzen: ["tanze", "tanzt", "tanzt", "tanzen", "tanzt", "tanzen"],
};
const CHANGES_VOWEL = ["lesen", "laufen", "fahren", "geben", "sehen", "schlafen", "nehmen", "essen", "helfen", "tragen"];
const SUBJECT_FOR: string[] = ["Ich", "Du", "Er", "Wir", "Ihr", "Sie"];
/** The rest of a short sentence for each verb with a vowel change. */
const REST: Record<string, string> = {
	lesen: "ein Buch",
	laufen: "zur Schule",
	fahren: "mit dem Rad",
	geben: "dem Hund Futter",
	sehen: "einen Regenbogen",
	schlafen: "sehr lange",
	nehmen: "den Bus",
	essen: "ein Eis",
	helfen: "der Oma",
	tragen: "den Korb",
};

const PRONOUN: [string, string, string][] = [
	["[[Die Katze]] schläft.", "Sie", "Sie schläft."],
	["[[Der Opa]] liest.", "Er", "Er liest."],
	["[[Das Kind]] lacht.", "Es", "Es lacht."],
	["[[Die Kinder]] spielen.", "Sie", "Sie spielen."],
	["[[Lea und ich]] singen.", "Wir", "Wir singen."],
	["[[Der Bus]] kommt.", "Er", "Er kommt."],
	["[[Die Sonne]] scheint.", "Sie", "Sie scheint."],
	["[[Das Pferd]] trabt.", "Es", "Es trabt."],
];

const verben: Lesson = {
	id: "verben-personalform",
	stage: "werkstatt",
	title: "Verben und ihre Personalform",
	skill: "Du bildest von Verben die passende Personalform.",
	lehrplan: "D3/4 4.3: Verben (Personalform), Pronomen",
	bindings: ["4.3-06"],
	sticker: { emoji: "⚙️", name: "Verb-Zahnrad" },
	paragraphs: [
		"Verben sagen, was jemand tut oder was geschieht: lachen, schwimmen, regnen. Im Wörterbuch steht die Grundform. Sie endet auf -en oder -n: laufen, wandern.",
		"Im Satz verändert sich das Verb. Es passt sich der Person an: ich laufe, du läufst, sie läuft. Das ist die Personalform. Bei manchen Verben ändert sich dabei sogar der Selbstlaut: lesen – du liest, fahren – er fährt.",
		"Wörter wie ich, du, er, sie, es, wir, ihr heißen Personalpronomen. Sie können ein Nomen ersetzen: Tinto schreibt. → Er schreibt.",
	],
	example: {
		title: "Tinto dreht das Verb-Rad",
		lines: [
			"Grundform: lesen",
			"ich lese · du liest · er/sie/es liest",
			"wir lesen · ihr lest · sie lesen",
			"Probe: Kannst du eine Personalform bilden (ich …, du …)? Dann ist es ein Verb.",
		],
	},
	takeaway:
		"Verben sagen, was jemand tut. Im Satz steht die Personalform, sie passt zur Person: ich lese, du liest. Pronomen ersetzen Nomen.",
	terms: [
		{ term: "Verb", meaning: "Tuwort: lesen, laufen" },
		{ term: "Grundform", meaning: "lesen (endet auf -en oder -n)" },
		{ term: "Personalform", meaning: "ich lese, du liest" },
		{ term: "Personalpronomen", meaning: "ich, du, er, sie, es, wir, ihr, sie" },
	],
	check: {
		wrong: "du lest",
		explanation: "Bei „lesen“ wird in der du-Form aus e ein ie: du liest. „ihr lest“ ist die ihr-Form.",
	},
	workshop: {
		kind: "machine",
		title: "Das Verb-Rad",
		intro: "Wähle ein Verb und eine Person. Das Rad zeigt dir die passende Personalform.",
		controls: [
			{ id: "verb", label: "Verb", options: ["spielen", "lesen", "laufen", "fahren", "sein"] },
			{ id: "person", label: "Person", options: PERSONS },
		],
		initial: { verb: "spielen", person: "ich" },
		view: (v) => {
			const form = CONJ[v.verb][PERSONS.indexOf(v.person)];
			return {
				display: `${v.person.replace(" (Mehrzahl)", "")} ${form}`,
				note:
					form === v.verb
						? "Diese Personalform sieht aus wie die Grundform."
						: `Grundform: ${v.verb}`,
				found: `${v.verb}|${v.person}`,
				tone: "ok",
			};
		},
		goals: [
			{
				id: "selbstlaut",
				label: "Finde eine Personalform, in der sich der Selbstlaut ändert.",
				reached: (s) =>
					["lesen", "laufen", "fahren"].includes(s.values.verb) &&
					["du", "er/sie/es"].includes(s.values.person),
			},
			{
				id: "wie-grundform",
				label: "Finde eine Person, bei der die Personalform genau wie die Grundform aussieht.",
				reached: (s) =>
					s.values.verb !== "sein" &&
					["wir", "sie (Mehrzahl)"].includes(s.values.person),
			},
			{
				id: "sein",
				label: "Das schwierigste Verb: Bilde von „sein“ alle sechs Personalformen.",
				reached: (s) => s.found.filter((f) => f.startsWith("sein|")).length === 6,
			},
		],
	},
	generators: {
		1: [
			(rng) => {
				const verb = pick(rng, Object.keys(CONJ).filter((v) => v !== "sein"));
				const p = Math.floor(rng() * 6);
				const answer = CONJ[verb][p];
				const wrong = [...new Set(CONJ[verb])].filter((f) => f !== answer);
				return choice(rng, {
					prompt: "Welche Personalform passt?",
					material: `${PERSONS[p].replace(" (Mehrzahl)", "")} ___ (${verb})`,
					answer,
					wrong: shuffle(rng, wrong).slice(0, 3),
					hint: "Sprich den Satz mit jeder Form laut. Welche klingt richtig?",
					explanation: `${PERSONS[p].replace(" (Mehrzahl)", "")} ${answer}.`,
					key: `personalform:${verb}:${p}`,
				});
			},
			(rng) => {
				const verb = pick(rng, Object.keys(CONJ).filter((v) => v !== "sein"));
				const forms = shuffle(rng, [...new Set(CONJ[verb])].filter((f) => f !== verb)).slice(0, 3);
				return choice(rng, {
					prompt: "Welches Wort ist die Grundform?",
					answer: verb,
					wrong: forms,
					hint: "Die Grundform steht im Wörterbuch. Sie endet auf -en oder -n.",
					explanation: `„${verb}“ ist die Grundform.`,
					key: `grundform:${verb}`,
				});
			},
		],
		2: [
			(rng) => {
				const verb = pick(rng, CHANGES_VOWEL);
				const p = pick(rng, [1, 2, 4]);
				const answer = CONJ[verb][p];
				const naive =
					p === 1 ? `${verb.slice(0, -2)}st` : p === 2 ? `${verb.slice(0, -2)}t` : "";
				return text({
					prompt: "Setze die passende Personalform ein. Schreibe nur das Verb.",
					material: `${SUBJECT_FOR[p]} ___ (${verb}) ${REST[verb]}.`,
					accept: [answer],
					hint: "Achtung: Bei diesem Verb kann sich in der du- und er-Form der Selbstlaut ändern.",
					explanation: `${SUBJECT_FOR[p]} ${answer} ${REST[verb]}.`,
					mistakes: naive && naive !== answer
						? { [naive]: `Bei „${verb}“ ändert sich hier der Selbstlaut.` }
						: undefined,
					key: `personalform2:${verb}:${p}`,
				});
			},
			(rng) => {
				const [sentence, pronoun, full] = pick(rng, PRONOUN);
				return text({
					prompt: "Ersetze den unterstrichenen Teil durch ein Pronomen. Schreibe den ganzen Satz.",
					material: sentence,
					accept: [full, full.replace(/\.$/, "")],
					hint: "er (männlich), sie (weiblich oder Mehrzahl), es (sächlich), wir (ich und andere).",
					explanation: `Richtig: ${full}`,
					key: `pronomen:${sentence}:${pronoun}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 5 Zeitformen ---------- */

const TENSES = ["Präsens", "Präteritum", "Perfekt", "Futur"] as const;
type Tense = (typeof TENSES)[number];
const TENSE_NAME: Record<Tense, string> = {
	Präsens: "Gegenwart",
	Präteritum: "1. Vergangenheit",
	Perfekt: "2. Vergangenheit",
	Futur: "Zukunft",
};
// [er/sie/es Präteritum, er/sie/es Perfekt, wir Präteritum]
const PAST: Record<string, [string, string, string]> = {
	gehen: ["ging", "ist gegangen", "gingen"],
	kommen: ["kam", "ist gekommen", "kamen"],
	essen: ["aß", "hat gegessen", "aßen"],
	trinken: ["trank", "hat getrunken", "tranken"],
	schwimmen: ["schwamm", "ist geschwommen", "schwammen"],
	singen: ["sang", "hat gesungen", "sangen"],
	finden: ["fand", "hat gefunden", "fanden"],
	schreiben: ["schrieb", "hat geschrieben", "schrieben"],
	laufen: ["lief", "ist gelaufen", "liefen"],
	fahren: ["fuhr", "ist gefahren", "fuhren"],
	sehen: ["sah", "hat gesehen", "sahen"],
	spielen: ["spielte", "hat gespielt", "spielten"],
	lachen: ["lachte", "hat gelacht", "lachten"],
	springen: ["sprang", "ist gesprungen", "sprangen"],
	fliegen: ["flog", "ist geflogen", "flogen"],
	bringen: ["brachte", "hat gebracht", "brachten"],
	rufen: ["rief", "hat gerufen", "riefen"],
	schlafen: ["schlief", "hat geschlafen", "schliefen"],
	werfen: ["warf", "hat geworfen", "warfen"],
};
const TENSE_SENTENCES: [string, Tense][] = [
	["Morgen werden wir ins Kino gehen.", "Futur"],
	["Gestern habe ich Pizza gegessen.", "Perfekt"],
	["Der Ritter ritt durch den dunklen Wald.", "Präteritum"],
	["Tinto schreibt einen Brief.", "Präsens"],
	["Wir sind ans Meer gefahren.", "Perfekt"],
	["Die Kinder lachten laut.", "Präteritum"],
	["Ich werde dir helfen.", "Futur"],
	["Im Winter schneit es oft.", "Präsens"],
	["Oma hat einen Kuchen gebacken.", "Perfekt"],
	["Der Hund bellte die ganze Nacht.", "Präteritum"],
	["Nächste Woche wird es regnen.", "Futur"],
	["Lisa liest ein spannendes Buch.", "Präsens"],
];
const MACHINE_TENSE: Record<string, Record<Tense, [string, string, string]>> = {
	spielen: {
		Präsens: ["spiele", "spielt", "spielen"],
		Präteritum: ["spielte", "spielte", "spielten"],
		Perfekt: ["habe gespielt", "hat gespielt", "haben gespielt"],
		Futur: ["werde spielen", "wird spielen", "werden spielen"],
	},
	laufen: {
		Präsens: ["laufe", "läuft", "laufen"],
		Präteritum: ["lief", "lief", "liefen"],
		Perfekt: ["bin gelaufen", "ist gelaufen", "sind gelaufen"],
		Futur: ["werde laufen", "wird laufen", "werden laufen"],
	},
	schreiben: {
		Präsens: ["schreibe", "schreibt", "schreiben"],
		Präteritum: ["schrieb", "schrieb", "schrieben"],
		Perfekt: ["habe geschrieben", "hat geschrieben", "haben geschrieben"],
		Futur: ["werde schreiben", "wird schreiben", "werden schreiben"],
	},
	fahren: {
		Präsens: ["fahre", "fährt", "fahren"],
		Präteritum: ["fuhr", "fuhr", "fuhren"],
		Perfekt: ["bin gefahren", "ist gefahren", "sind gefahren"],
		Futur: ["werde fahren", "wird fahren", "werden fahren"],
	},
};
const T_PERSON = ["ich", "er/sie/es", "wir"];

const zeitformen: Lesson = {
	id: "zeitformen",
	stage: "werkstatt",
	title: "Zeitformen: früher, jetzt, später",
	skill: "Du erkennst und bildest Präsens, Präteritum, Perfekt und Futur.",
	lehrplan: "D3/4 4.3: Verben in verschiedenen Zeitformen",
	bindings: ["4.3-05", "4.3-06"],
	sticker: { emoji: "⏳", name: "Sanduhr" },
	paragraphs: [
		"Verben zeigen dir, wann etwas passiert. Präsens (Gegenwart): Es passiert jetzt oder immer. „Tinto schwimmt.“",
		"Für Vergangenes gibt es zwei Formen. Das Präteritum (1. Vergangenheit) benutzt du oft beim Erzählen und Schreiben: „Tinto schwamm.“ Das Perfekt (2. Vergangenheit) hört man oft beim Sprechen. Es hat zwei Teile, haben oder sein und eine Form wie „geschwommen“: „Tinto ist geschwommen.“",
		"Das Futur (Zukunft) bildest du mit werden und der Grundform: „Tinto wird schwimmen.“ Bei vielen Verben ändert sich im Präteritum der Wortstamm: laufen – lief, schreiben – schrieb.",
	],
	example: {
		title: "Ein Verb, vier Zeiten",
		lines: [
			"Präsens: Ich laufe zur Schule.",
			"Präteritum: Ich lief zur Schule.",
			"Perfekt: Ich bin zur Schule gelaufen.",
			"Futur: Ich werde zur Schule laufen.",
		],
	},
	takeaway:
		"Präsens: jetzt · Präteritum: erzählte Vergangenheit (lief) · Perfekt: haben/sein + gelaufen · Futur: werden + Grundform.",
	terms: [
		{ term: "Präsens", meaning: "Gegenwart: ich laufe" },
		{ term: "Präteritum", meaning: "1. Vergangenheit: ich lief" },
		{ term: "Perfekt", meaning: "2. Vergangenheit: ich bin gelaufen" },
		{ term: "Futur", meaning: "Zukunft: ich werde laufen" },
	],
	check: {
		wrong: "Präteritum",
		explanation: "„Ich habe gespielt“ hat zwei Teile mit „haben“. Das ist das Perfekt.",
	},
	workshop: {
		kind: "machine",
		title: "Die Zeitmaschine",
		intro: "Stell die Zeitmaschine ein: Verb, Person und Zeit. Schau, wie sich das Verb verwandelt.",
		controls: [
			{ id: "verb", label: "Verb", options: Object.keys(MACHINE_TENSE) },
			{ id: "person", label: "Person", options: T_PERSON },
			{ id: "zeit", label: "Zeit", options: [...TENSES] },
		],
		initial: { verb: "spielen", person: "ich", zeit: "Präsens" },
		view: (v) => {
			const zeit = v.zeit as Tense;
			const form = MACHINE_TENSE[v.verb][zeit][T_PERSON.indexOf(v.person)];
			return {
				display: `${v.person} ${form}`,
				note: `${zeit} (${TENSE_NAME[zeit]})${form.includes(" ") ? " · zwei Teile" : ""}`,
				found: `${v.verb}|${zeit}|${v.person}`,
				tone: "ok",
			};
		},
		goals: [
			{
				id: "mit-sein",
				label: "Finde eine Zeitform, die mit „sein“ (bin, ist, sind) gebildet wird.",
				reached: (s) =>
					s.values.zeit === "Perfekt" && ["laufen", "fahren"].includes(s.values.verb),
			},
			{
				id: "zukunft-wir",
				label: "Zeige, was „wir“ in der Zukunft tun werden.",
				reached: (s) => s.values.zeit === "Futur" && s.values.person === "wir",
			},
			{
				id: "stamm",
				label: "Finde drei Verben, deren Wortstamm sich im Präteritum verändert.",
				reached: (s) =>
					["laufen", "schreiben", "fahren"].every((verb) =>
						s.found.some((f) => f.startsWith(`${verb}|Präteritum|`)),
					),
			},
		],
	},
	generators: {
		1: [
			(rng) => {
				const [sentence, tense] = pick(rng, TENSE_SENTENCES);
				return choice(rng, {
					prompt: "In welcher Zeitform steht der Satz?",
					material: sentence,
					answer: tense,
					wrong: [...TENSES],
					hint: "Suche das Verb. Gibt es „werden“? Dann Futur. „haben“ oder „sein“ mit ge-…? Dann Perfekt.",
					explanation: `${sentence} → ${tense} (${TENSE_NAME[tense]}).`,
					key: `zeit:${sentence}`,
				});
			},
			(rng) => {
				const verb = pick(rng, Object.keys(PAST));
				const [prat, perf] = PAST[verb];
				return choice(rng, {
					prompt: `Welche Form ist das Präteritum von „${verb}“?`,
					material: `er ___`,
					answer: prat,
					wrong: [perf, presentEr(verb), `wird ${verb}`],
					hint: "Präteritum ist die Erzählform, ein einziges Wort: er lief, er sang.",
					explanation: `er ${prat} (Präteritum) – er ${perf} (Perfekt).`,
					key: `praeteritum:${verb}`,
				});
			},
		],
		2: [
			(rng) => {
				const verb = pick(rng, Object.keys(PAST));
				const wir = PAST[verb][2];
				return text({
					prompt: "Schreibe die Form im Präteritum.",
					material: `wir ___ (${verb})`,
					accept: [wir, `wir ${wir}`],
					hint: "Erzähle: Gestern … wir …",
					explanation: `wir ${wir}`,
					mistakes: { [`${verb.slice(0, -2)}ten`]: "Dieses Verb verändert im Präteritum seinen Wortstamm." },
					key: `praet-wir:${verb}`,
				});
			},
			(rng) => {
				const verb = pick(rng, Object.keys(PAST));
				const perf = PAST[verb][1];
				return text({
					prompt: "Setze ins Perfekt. Schreibe beide Teile.",
					material: `er ${presentEr(verb)} → er …`,
					accept: [perf, `er ${perf}`],
					hint: "Perfekt = hat oder ist + ge-Form. Bei Bewegungen wie gehen, fahren, fliegen meistens „ist“.",
					explanation: `er ${perf}`,
					mistakes: {
						[perf.startsWith("ist") ? perf.replace("ist", "hat") : perf.replace("hat", "ist")]:
							perf.startsWith("ist")
								? "Bei Bewegungen von einem Ort zum anderen nimmst du meistens „ist“."
								: "Bei diesem Verb nimmst du „hat“.",
					},
					key: `perfekt:${verb}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

const PRESENT_ER: Record<string, string> = {
	gehen: "geht",
	kommen: "kommt",
	trinken: "trinkt",
	schwimmen: "schwimmt",
	singen: "singt",
	finden: "findet",
	lachen: "lacht",
	springen: "springt",
	fliegen: "fliegt",
	bringen: "bringt",
	rufen: "ruft",
	werfen: "wirft",
};
const presentEr = (verb: string): string => CONJ[verb]?.[2] ?? PRESENT_ER[verb];

/* ---------- 6 Wortbausteine ---------- */

const UNG: [string, string][] = [
	["wandern", "Wanderung"],
	["erzählen", "Erzählung"],
	["rechnen", "Rechnung"],
	["warnen", "Warnung"],
	["hoffen", "Hoffnung"],
	["ordnen", "Ordnung"],
	["zeichnen", "Zeichnung"],
	["heizen", "Heizung"],
	["landen", "Landung"],
	["üben", "Übung"],
	["meinen", "Meinung"],
	["wohnen", "Wohnung"],
];
const HEIT: [string, string][] = [
	["krank", "Krankheit"],
	["frei", "Freiheit"],
	["gesund", "Gesundheit"],
	["dunkel", "Dunkelheit"],
	["sicher", "Sicherheit"],
	["ehrlich", "Ehrlichkeit"],
	["freundlich", "Freundlichkeit"],
	["müde", "Müdigkeit"],
	["sauber", "Sauberkeit"],
	["traurig", "Traurigkeit"],
	["schön", "Schönheit"],
	["klug", "Klugheit"],
];
const SUFFIX_WORDS: [string, "Nomen" | "Adjektiv"][] = [
	["Hoffnung", "Nomen"],
	["Gesundheit", "Nomen"],
	["Ehrlichkeit", "Nomen"],
	["Ergebnis", "Nomen"],
	["Freundschaft", "Nomen"],
	["Zeitung", "Nomen"],
	["lustig", "Adjektiv"],
	["freundlich", "Adjektiv"],
	["essbar", "Adjektiv"],
	["sparsam", "Adjektiv"],
	["neidisch", "Adjektiv"],
	["vorsichtig", "Adjektiv"],
];
/** Gap sentence, right prefix, prefixes that make no sense here. */
const PREFIX: [string, string, string[]][] = [
	["Das Glas ist ___brochen.", "zer", ["ver", "un"]],
	["Ich habe mich im Wald ___laufen.", "ver", ["zer", "un"]],
	["Tim war sehr ___glücklich und weinte.", "un", ["zer", "ent"]],
	["Die Forscher ___deckten eine Höhle.", "ent", ["zer", "un"]],
	["Opa ___zählt eine spannende Geschichte.", "er", ["zer", "un"]],
	["Wir ___suchen am Sonntag unsere Tante.", "be", ["zer", "ent"]],
	["Das Wetter ist heute ___freundlich und nass.", "un", ["be", "zer"]],
	["Der Hund hat das Kissen ___rissen.", "zer", ["un", "be"]],
];

const wortbausteine: Lesson = {
	id: "wortbausteine",
	stage: "werkstatt",
	title: "Wörter aus Bausteinen",
	skill: "Du zerlegst Wörter in Bausteine und erkennst die Wortart an der Nachsilbe.",
	lehrplan: "D3/4 4.3 · 4.4: Wortstamm, Vorsilben, Nachsilben",
	bindings: ["4.3-01", "4.3-02", "4.4-11"],
	sticker: { emoji: "🧱", name: "Baustein" },
	paragraphs: [
		"Viele Wörter sind aus Bausteinen gebaut wie aus Legosteinen. In der Mitte steht der Wortstamm. Davor kann eine Vorsilbe stehen, dahinter eine Nachsilbe: un-auf-merk-sam.",
		"Vorsilben verändern die Bedeutung: lernen – verlernen (vergessen) – erlernen (lernen, bis man es kann). Auch un- ist eine Vorsilbe, sie macht das Gegenteil: freundlich – unfreundlich.",
		"Nachsilben verraten oft die Wortart. Mit -ung, -heit, -keit, -nis und -schaft entstehen Nomen: klug – die Klugheit. Mit -ig, -lich, -isch, -bar und -sam entstehen Adjektive: Freund – freundlich.",
	],
	example: {
		title: "Tinto baut",
		lines: [
			"merk (Stamm) → merken (Verb)",
			"be + merk + ung → die Bemerkung (Nomen, großgeschrieben)",
			"auf + merk + sam → aufmerksam (Adjektiv)",
			"un + auf + merk + sam → unaufmerksam (Gegenteil)",
		],
	},
	takeaway:
		"Wortstamm + Vorsilbe/Nachsilbe = neues Wort. -ung, -heit, -keit, -nis, -schaft → Nomen (groß). -ig, -lich, -isch, -bar, -sam → Adjektiv (klein).",
	terms: [
		{ term: "Wortstamm", meaning: "der Kern eines Wortes: merk, fahr" },
		{ term: "Vorsilbe", meaning: "steht vorn: ver-, er-, be-, ent-, zer-, un-" },
		{ term: "Nachsilbe", meaning: "steht hinten: -ung, -heit, -keit, -lich, -ig" },
	],
	check: {
		wrong: "-lich",
		explanation: "Mit -lich entsteht ein Adjektiv. Ein Nomen entsteht mit -heit: die Klugheit.",
	},
	workshop: slotWorkshop(
		{
			variant: "letters",
			title: "Die Bausteinschere",
			intro:
				"Tinto hat lange Wörter gefunden. Tippe zwischen die Buchstaben und schneide jedes Wort in seine Bausteine.",
			pens: [{ value: "|", label: "Schnitt", colour: "orange" }],
			puzzles: [
				cuts("unaufmerksam", "un|auf|merk|sam", "|", "Vier Bausteine", "Vorsilbe, Vorsilbe, Stamm, Nachsilbe"),
				cuts("bemerkung", "Be|merk|ung", "|", "Drei Bausteine", "Vorsilbe, Stamm, Nachsilbe"),
				cuts("freundlichkeit", "Freund|lich|keit", "|", "Drei Bausteine", "Stamm, Nachsilbe, Nachsilbe"),
			],
		},
		[
			"Zerlege „unaufmerksam“ in vier Bausteine.",
			"Zerlege „Bemerkung“ in drei Bausteine.",
			"Zerlege „Freundlichkeit“: Hier stehen zwei Nachsilben hintereinander.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [adj, noun] = pick(rng, HEIT);
				const suffix = noun.endsWith("keit") ? "-keit" : "-heit";
				return choice(rng, {
					prompt: `Welche Nachsilbe macht aus „${adj}“ ein Nomen?`,
					answer: suffix,
					wrong: ["-lich", "-ig", "-bar", suffix === "-heit" ? "-keit" : "-heit"],
					hint: "Nomen bekommen Nachsilben wie -ung, -heit, -keit, -nis.",
					explanation: `${adj} → die ${noun}.`,
					key: `heit:${adj}`,
				});
			},
			(rng) => {
				const [word, kind] = pick(rng, SUFFIX_WORDS);
				return choice(rng, {
					prompt: "Welche Wortart ist das? Achte auf die Nachsilbe.",
					material: word,
					answer: kind,
					wrong: ["Nomen", "Adjektiv", "Verb"],
					hint: "-ung, -heit, -keit, -nis, -schaft → Nomen · -ig, -lich, -isch, -bar, -sam → Adjektiv",
					explanation: `„${word}“ ist ein ${kind}.`,
					key: `suffix:${word}`,
				});
			},
		],
		2: [
			(rng) => {
				const useUng = rng() < 0.5;
				const [base, noun] = pick(rng, useUng ? UNG : HEIT);
				return text({
					prompt: `Bilde ein Nomen mit ${useUng ? "-ung" : "-heit oder -keit"} und schreibe es mit Artikel.`,
					material: base,
					accept: [`die ${noun}`],
					hint: "Alle Nomen mit -ung, -heit und -keit haben den Artikel „die“. Und groß schreiben!",
					explanation: `${base} → die ${noun}`,
					mistakes: {
						[noun]: "Fast! Schreibe den Artikel dazu.",
						[`die ${noun.toLowerCase()}`]: "Ein Nomen schreibst du groß.",
					},
					key: `bilde:${base}`,
				});
			},
			(rng) => {
				const [sentence, answer, wrong] = pick(rng, PREFIX);
				return choice(rng, {
					prompt: "Welche Vorsilbe passt? Lies den ganzen Satz.",
					material: sentence,
					answer: `${answer}-`,
					wrong: wrong.map((w) => `${w}-`),
					hint: "zer- (kaputt) · ver- (falsch, weg) · un- (Gegenteil) · ent- (weg, frei) · er- · be-",
					explanation: sentence.replace("___", answer),
					key: `vorsilbe:${sentence}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 7 Wortfamilien ---------- */

const FAMILIES: { stem: string; members: string[]; impostors: string[] }[] = [
	{ stem: "fahr", members: ["Fahrer", "Abfahrt", "Fahrrad", "fahren"], impostors: ["Farbe", "fallen", "fertig"] },
	{ stem: "back", members: ["Bäcker", "backen", "Backofen", "Bäckerei"], impostors: ["Backe", "packen", "Becher"] },
	{ stem: "sing", members: ["singen", "Gesang", "Sänger", "Singvogel"], impostors: ["sinken", "Senf", "Sand"] },
	{ stem: "trink", members: ["trinken", "Getränk", "Trinkflasche", "trank"], impostors: ["Trick", "trocken", "Treppe"] },
	{ stem: "spiel", members: ["spielen", "Spieler", "Spielplatz", "verspielt"], impostors: ["Spiegel", "spitz", "Speise"] },
	{ stem: "les", members: ["lesen", "Leser", "Lesebuch", "lesbar"], impostors: ["Lehrer", "leise", "Lexikon"] },
];
const PERSON_NOUN: [string, string][] = [
	["singen", "Sänger"],
	["fahren", "Fahrer"],
	["backen", "Bäcker"],
	["lesen", "Leser"],
	["malen", "Maler"],
	["spielen", "Spieler"],
	["laufen", "Läufer"],
	["schwimmen", "Schwimmer"],
	["tanzen", "Tänzer"],
	["kaufen", "Käufer"],
	["lehren", "Lehrer"],
];
const STEM_SPELLING: [string, string, string][] = [
	["Getränk", "Getrenk", "trinken – trank"],
	["Sänger", "Senger", "singen – Gesang"],
	["fährt", "fehrt", "fahren"],
	["Bäckerei", "Beckerei", "backen"],
	["Räuber", "Reuber", "rauben"],
	["läuft", "leuft", "laufen"],
	["Fahrrad", "Farrad", "fahren"],
	["Schubkarre", "Schupkarre", "schieben – der Schub"],
];

const wortfamilien: Lesson = {
	id: "wortfamilien",
	stage: "werkstatt",
	title: "Wortfamilien",
	skill: "Du findest Wörter mit dem gleichen Wortstamm und nutzt sie beim Schreiben.",
	lehrplan: "D3/4 4.3 · 4.4: Wortfamilien, Stammschreibung",
	bindings: ["4.3-03", "4.4-10"],
	sticker: { emoji: "🌳", name: "Familienbaum" },
	paragraphs: [
		"Wörter mit dem gleichen Wortstamm gehören zu einer Wortfamilie: fahren, der Fahrer, die Abfahrt, das Fahrrad. Sie haben auch mit der Bedeutung zu tun.",
		"Manchmal ändert sich in der Familie der Selbstlaut im Stamm: singen – der Gesang, trinken – das Getränk, schieben – die Schubkarre. Die Familie bleibt trotzdem erkennbar.",
		"Vorsicht vor Wörtern, die nur ähnlich klingen: „Farbe“ gehört nicht zu „fahren“. Den Wortstamm schreibst du in der ganzen Familie gleich. Das hilft dir beim Schreiben: Wenn du „fahren“ mit h schreibst, schreibst du auch „Fahrrad“ mit h.",
	],
	example: {
		title: "Tintos Familienbaum",
		lines: [
			"Stamm: back",
			"backen · der Bäcker · die Bäckerei · der Backofen",
			"Aus a wird manchmal ä: backen – Bäcker.",
			"Nicht dabei: die Backe (Wange), packen.",
		],
	},
	takeaway:
		"Eine Wortfamilie hat einen gemeinsamen Wortstamm. Den Stamm schreibst du überall gleich, der Selbstlaut kann sich verändern (singen – Gesang).",
	terms: [
		{ term: "Wortfamilie", meaning: "Wörter mit dem gleichen Stamm" },
		{ term: "Wortstamm", meaning: "fahr in fahren, Fahrer, Abfahrt" },
	],
	check: {
		wrong: "Fahrer und Farbe",
		explanation: "„Farbe“ klingt nur ähnlich. Fahrer und Abfahrt haben den Stamm fahr.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Familientreffen",
			intro:
				"Bei Tinto klingeln viele Wörter. Aber nicht alle gehören zur Familie! Tippe nur die echten Familienmitglieder an.",
			pens: [{ value: "F", label: "gehört dazu", colour: "green" }],
			puzzles: [
				marks("fahr", "Fahrer|F Farbe Abfahrt|F fallen Fahrrad|F fertig", "Familie fahr"),
				marks("sing", "Sand Gesang|F sinken Sänger|F singen|F Senf", "Familie sing"),
				marks("trink", "Getränk|F Trick trocken trank|F Treppe Trinkflasche|F", "Familie trink"),
			],
		},
		[
			"Finde alle Mitglieder der Familie „fahr“.",
			"Finde die Familie „sing“. Achtung: Der Selbstlaut ändert sich!",
			"Finde die Familie „trink“.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const family = pick(rng, FAMILIES);
				const impostor = pick(rng, family.impostors);
				const members = shuffle(rng, family.members).slice(0, 3);
				return choice(rng, {
					prompt: "Welches Wort gehört NICHT zur Wortfamilie?",
					answer: impostor,
					wrong: members,
					hint: `Suche den gemeinsamen Stamm „${family.stem}“. Welches Wort klingt nur ähnlich?`,
					explanation: `„${impostor}“ klingt ähnlich, hat aber nicht den Stamm „${family.stem}“.`,
					key: `familie:${family.stem}:${impostor}`,
				});
			},
			(rng) => {
				const family = pick(rng, FAMILIES);
				const shown = shuffle(rng, family.members).slice(0, 3);
				const others = FAMILIES.filter((f) => f !== family).map((f) => f.stem);
				return choice(rng, {
					prompt: "Welcher Wortstamm steckt in allen drei Wörtern?",
					material: shown.join(" · "),
					answer: family.stem,
					wrong: shuffle(rng, others).slice(0, 3),
					hint: "Suche den Teil, der in allen Wörtern gleich oder fast gleich ist.",
					explanation: `Alle haben den Stamm „${family.stem}“.`,
					key: `stamm:${family.stem}:${shown.join()}`,
				});
			},
		],
		2: [
			(rng) => {
				const [verb, noun] = pick(rng, PERSON_NOUN);
				return text({
					prompt: "Bilde aus dem Verb ein Nomen für eine Person mit -er. Schreibe es mit Artikel.",
					material: `${verb} → der …`,
					accept: [`der ${noun}`, noun],
					hint: "Wer singt, ist der S…. Denk an den Stamm. Manchmal wird a zu ä.",
					explanation: `${verb} → der ${noun}`,
					mistakes: { [`der ${noun.toLowerCase()}`]: "Nomen schreibst du groß." },
					key: `person:${verb}`,
				});
			},
			(rng) => {
				const [right, wrong, family] = pick(rng, STEM_SPELLING);
				return choice(rng, {
					prompt: "Welches Wort ist richtig geschrieben? Denk an die Wortfamilie.",
					answer: right,
					wrong: [wrong],
					hint: "Suche ein verwandtes Wort aus der Familie und schau, wie dort der Stamm geschrieben wird.",
					explanation: `„${right}“ gehört zur Familie ${family}.`,
					key: `stammschreibung:${right}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 8 Zusammengesetzte Nomen ---------- */

const COMPOUNDS: Record<string, { word: string; article: string; fuge: string; kind: string }> = {
	"Haus|Tür": { word: "Haustür", article: "die", fuge: "", kind: "Nomen + Nomen" },
	"Haus|Garten": { word: "Hausgarten", article: "der", fuge: "", kind: "Nomen + Nomen" },
	"Sonne|Schirm": { word: "Sonnenschirm", article: "der", fuge: "n", kind: "Nomen + Nomen" },
	"Sonne|Licht": { word: "Sonnenlicht", article: "das", fuge: "n", kind: "Nomen + Nomen" },
	"schreiben|Tisch": { word: "Schreibtisch", article: "der", fuge: "", kind: "Verb + Nomen" },
	"schreiben|Block": { word: "Schreibblock", article: "der", fuge: "", kind: "Verb + Nomen" },
	"rot|Licht": { word: "Rotlicht", article: "das", fuge: "", kind: "Adjektiv + Nomen" },
	"Arbeit|Tisch": { word: "Arbeitstisch", article: "der", fuge: "s", kind: "Nomen + Nomen" },
	"Arbeit|Block": { word: "Arbeitsblock", article: "der", fuge: "s", kind: "Nomen + Nomen" },
	"Kind|Garten": { word: "Kindergarten", article: "der", fuge: "er", kind: "Nomen + Nomen" },
	"Kind|Tisch": { word: "Kindertisch", article: "der", fuge: "er", kind: "Nomen + Nomen" },
	"Kind|Schirm": { word: "Kinderschirm", article: "der", fuge: "er", kind: "Nomen + Nomen" },
};
const COMPOUND_ARTICLE: [string, string, string, string][] = [
	// first word, second word, compound, article of compound
	["das Haus", "die Tür", "Haustür", "die"],
	["die Sonne", "der Schirm", "Sonnenschirm", "der"],
	["das Fenster", "die Bank", "Fensterbank", "die"],
	["die Hand", "der Schuh", "Handschuh", "der"],
	["das Wasser", "die Flasche", "Wasserflasche", "die"],
	["die Schule", "der Hof", "Schulhof", "der"],
	["das Brot", "die Dose", "Brotdose", "die"],
	["der Garten", "das Haus", "Gartenhaus", "das"],
	["der Zahn", "die Bürste", "Zahnbürste", "die"],
	["das Feuer", "die Wehr", "Feuerwehr", "die"],
	["die Tasche", "das Geld", "Taschengeld", "das"],
	["die Uhr", "der Zeiger", "Uhrzeiger", "der"],
];
const FUGEN: [string, string, string][] = [
	// with gap, Fuge (or "–" for none), whole word
	["Geburt_tag", "s", "Geburtstag"],
	["Arbeit_blatt", "s", "Arbeitsblatt"],
	["Sonne_blume", "n", "Sonnenblume"],
	["Hund_hütte", "e", "Hundehütte"],
	["Kind_garten", "er", "Kindergarten"],
	["Tasche_lampe", "n", "Taschenlampe"],
	["Bild_buch", "er", "Bilderbuch"],
	["Wohnung_tür", "s", "Wohnungstür"],
	["Straße_bahn", "n", "Straßenbahn"],
	["Zeitung_papier", "s", "Zeitungspapier"],
	["Mittag_essen", "–", "Mittagessen"],
	["Apfel_baum", "–", "Apfelbaum"],
];
const BUILD_FROM: [string, string, string, string][] = [
	// compound, right analysis, two wrong analyses
	["Schreibblock", "schreiben (Verb) + der Block", "die Schreibe (Nomen) + der Block", "schreib (Adjektiv) + der Block"],
	["Fahrrad", "fahren (Verb) + das Rad", "die Fahrt (Nomen) + das Rad", "fahr (Adjektiv) + das Rad"],
	["Großstadt", "groß (Adjektiv) + die Stadt", "die Größe (Nomen) + die Stadt", "großen (Verb) + die Stadt"],
	["Kühlschrank", "kühlen (Verb) + der Schrank", "die Kühle (Nomen) + der Schrank", "der Kühl (Nomen) + der Schrank"],
	["Schwimmbad", "schwimmen (Verb) + das Bad", "der Schwimm (Nomen) + das Bad", "schwimm (Adjektiv) + das Bad"],
	["Hochhaus", "hoch (Adjektiv) + das Haus", "die Höhe (Nomen) + das Haus", "hochen (Verb) + das Haus"],
	["Schnellzug", "schnell (Adjektiv) + der Zug", "der Schnell (Nomen) + der Zug", "schnellen (Verb) + der Zug"],
	["Waschmaschine", "waschen (Verb) + die Maschine", "die Wäsche (Nomen) + die Maschine", "wasch (Adjektiv) + die Maschine"],
];

const zusammensetzungen: Lesson = {
	id: "zusammengesetzte-nomen",
	stage: "werkstatt",
	title: "Zusammengesetzte Nomen",
	skill: "Du baust neue Nomen und weißt, welcher Artikel dazugehört.",
	lehrplan: "D3/4 4.3 · 4.4: Zusammensetzungen, Fugenelement",
	bindings: ["4.3-04", "4.4-15", "4.4-17"],
	sticker: { emoji: "🔗", name: "Wortkette" },
	paragraphs: [
		"Aus zwei Wörtern kann ein neues Nomen werden: das Haus + die Tür = die Haustür. Das hintere Wort heißt Grundwort. Es bestimmt den Artikel. Das vordere Wort heißt Bestimmungswort. Es sagt genauer, was gemeint ist.",
		"Das Bestimmungswort kann ein Nomen, ein Verb oder ein Adjektiv sein: Schreibtisch (schreiben), Rotlicht (rot). Vom Verb bleibt nur der Wortstamm. Weil am Ende ein Nomen steht, schreibst du die Zusammensetzung groß.",
		"Manchmal steht zwischen den Wörtern ein Fugenelement: Arbeit-s-blatt, Sonne-n-schirm, Kind-er-garten.",
	],
	example: {
		title: "Tintos Wortkette",
		lines: [
			"die Sonne + n + der Schirm → der Sonnenschirm",
			"schreiben + der Block → der Schreibblock (vom Verb nur „schreib“)",
			"rot + das Licht → das Rotlicht",
			"Der Artikel kommt immer vom letzten Wort.",
		],
	},
	takeaway:
		"Bestimmungswort + Grundwort = zusammengesetztes Nomen. Das Grundwort (hinten) bestimmt Artikel und Wortart. Manchmal steht ein Fugenelement dazwischen (-s-, -n-, -er-).",
	terms: [
		{ term: "Grundwort", meaning: "das hintere Wort, gibt den Artikel" },
		{ term: "Bestimmungswort", meaning: "das vordere Wort, sagt was für eins" },
		{ term: "Fugenelement", meaning: "Arbeit-s-blatt, Sonne-n-schirm" },
	],
	check: {
		wrong: "der",
		explanation: "Der Artikel kommt vom Grundwort am Ende: die Tür → die Haustür.",
	},
	workshop: {
		kind: "machine",
		title: "Die Wortkupplung",
		intro: "Kupple ein Bestimmungswort und ein Grundwort zusammen. Ergibt es ein Wort aus Tintos Wörterliste?",
		controls: [
			{ id: "vorn", label: "Bestimmungswort", options: ["Haus", "Sonne", "schreiben", "rot", "Arbeit", "Kind"] },
			{ id: "hinten", label: "Grundwort", options: ["Tür", "Schirm", "Tisch", "Block", "Licht", "Garten"] },
		],
		initial: { vorn: "Haus", hinten: "Schirm" },
		view: (v) => {
			const hit = COMPOUNDS[`${v.vorn}|${v.hinten}`];
			if (!hit)
				return {
					display: "Diese Kupplung passt nicht.",
					note: "Dieses Wort steht nicht in Tintos Wörterliste. Probiere ein anderes Grundwort.",
					tone: "miss",
				};
			const stem = v.vorn === "schreiben" ? "schreib" : v.vorn;
			return {
				display: `${hit.article} ${hit.word}`,
				note: `${stem}${hit.fuge ? ` + ${hit.fuge}` : ""} + ${v.hinten} · ${hit.kind}${hit.fuge ? ` · Fugenelement „${hit.fuge}“` : ""}`,
				found: hit.word,
				tone: "ok",
			};
		},
		goals: [
			{
				id: "fugen-s",
				label: "Baue ein Wort mit dem Fugenelement „s“.",
				reached: (s) => s.found.includes("Arbeitstisch") || s.found.includes("Arbeitsblock"),
			},
			{
				id: "verb",
				label: "Baue ein Wort, dessen Bestimmungswort ein Verb ist.",
				reached: (s) => s.found.includes("Schreibtisch") || s.found.includes("Schreibblock"),
			},
			{
				id: "artikel",
				label: "Baue zwei Wörter mit gleichem Bestimmungswort, aber verschiedenem Artikel.",
				reached: (s) =>
					(s.found.includes("Haustür") && s.found.includes("Hausgarten")) ||
					(s.found.includes("Sonnenschirm") && s.found.includes("Sonnenlicht")),
			},
		],
	},
	generators: {
		1: [
			(rng) => {
				const [first, second, word, article] = pick(rng, COMPOUND_ARTICLE);
				return choice(rng, {
					prompt: "Welcher Artikel gehört zum neuen Wort?",
					material: `${first} + ${second} = ___ ${word}`,
					answer: article,
					wrong: ["der", "die", "das"],
					hint: "Schau auf das letzte Wort, das Grundwort.",
					explanation: `Das Grundwort ist „${second}“. Also: ${article} ${word}.`,
					key: `artikel-zus:${word}`,
				});
			},
			(rng) => {
				const [gap, fuge, word] = pick(rng, FUGEN);
				return choice(rng, {
					prompt: "Welches Fugenelement fehlt?",
					material: gap.replace("_", " _ "),
					answer: fuge,
					wrong: ["s", "n", "er", "e", "–"],
					hint: "Sprich das ganze Wort laut. Hörst du ein s, ein n, ein er oder nichts dazwischen?",
					explanation: `Es heißt „${word}“.`,
					key: `fuge:${word}`,
				});
			},
		],
		2: [
			(rng) => {
				const [first, second, word, article] = pick(rng, COMPOUND_ARTICLE);
				return text({
					prompt: "Bilde ein zusammengesetztes Nomen und schreibe es mit Artikel.",
					material: `${first} + ${second}`,
					accept: [`${article} ${word}`],
					hint: "Ein Wort, großgeschrieben, Artikel vom Grundwort.",
					explanation: `${article} ${word}`,
					mistakes: {
						[word]: "Schreibe den Artikel dazu.",
						[`${first.split(" ")[0]} ${word}`]: "Der Artikel kommt vom hinteren Wort.",
					},
					key: `bilde-zus:${word}`,
				});
			},
			(rng) => {
				const [word, right, w1, w2] = pick(rng, BUILD_FROM);
				return choice(rng, {
					prompt: "Aus welchen Wörtern ist das Nomen zusammengesetzt?",
					material: word,
					answer: right,
					wrong: [w1, w2],
					hint: "Welches Wort steckt vorne? Ist es ein Verb (Personalform möglich), ein Adjektiv (steigerbar) oder ein Nomen?",
					explanation: `${word}: ${right}.`,
					key: `zerlege:${word}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 9 Wortfelder ---------- */

const FIELDS: { field: string; members: string[]; impostors: string[] }[] = [
	{ field: "sagen", members: ["flüstern", "rufen", "fragen", "antworten", "erzählen", "schreien"], impostors: ["schleichen", "sehen", "essen"] },
	{ field: "gehen", members: ["schleichen", "rennen", "schlendern", "hüpfen", "stolpern", "humpeln"], impostors: ["flüstern", "starren", "naschen"] },
	{ field: "sehen", members: ["beobachten", "entdecken", "starren", "betrachten", "gucken", "erblicken"], impostors: ["rennen", "murmeln", "schmatzen"] },
	{ field: "essen", members: ["naschen", "schlingen", "kauen", "knabbern", "schmatzen", "futtern"], impostors: ["hüpfen", "rufen", "blinzeln"] },
];
/** Sentence, best word, worse words, reason, plain word it replaces. */
const BEST_WORD: [string, string, string[], string, string][] = [
	["„Psst“, ___ Lea ihrer Freundin ins Ohr.", "flüstert", ["brüllt", "jubelt"], "Ein Geheimnis sagt man leise.", "sagt"],
	["Der Dieb ___ auf Zehenspitzen durch den Flur.", "schleicht", ["rennt", "stampft"], "Auf Zehenspitzen ist man leise und langsam.", "geht"],
	["Mit dem Fernglas ___ wir die Vögel am See.", "beobachten", ["blinzeln", "schielen"], "Man schaut lange und genau hin.", "sehen"],
	["„Hilfe!“, ___ der Junge laut.", "schreit", ["murmelt", "flüstert"], "„Hilfe!“ und „laut“ passen zu schreien.", "sagt"],
	["Das Eichhörnchen ___ an einer Nuss.", "knabbert", ["schlingt", "schmatzt"], "Kleine Bissen an etwas Hartem: knabbern.", "isst"],
	["Nach dem Sturz ___ Tim zum Arzt.", "humpelt", ["hüpft", "schlendert"], "Mit einem verletzten Bein humpelt man.", "geht"],
	["Im Urlaub ___ wir gemütlich durch die Altstadt.", "schlendern", ["rasen", "stolpern"], "Gemütlich und ohne Eile: schlendern.", "gehen"],
	["Plötzlich ___ Mia eine Spur im Schnee.", "entdeckt", ["betrachtet", "beobachtet"], "Plötzlich etwas Neues finden: entdecken.", "sieht"],
];

const wortfelder: Lesson = {
	id: "wortfelder",
	stage: "werkstatt",
	title: "Treffende Wörter: Wortfelder",
	skill: "Du wählst aus einem Wortfeld das Wort, das genau passt.",
	lehrplan: "D3/4 4.3: Wortfelder (z. B. sehen, essen)",
	bindings: ["4.3-07"],
	sticker: { emoji: "🎨", name: "Farbpalette" },
	paragraphs: [
		"Ein Wortfeld sind Wörter mit ähnlicher Bedeutung. Zum Wortfeld „sagen“ gehören flüstern, rufen, fragen, antworten und schreien.",
		"Jedes Wort hat aber seinen eigenen Klang: Wer flüstert, ist leise. Wer schreit, ist laut. Mit dem treffenden Wort weiß dein Leser genau, was passiert. So wird deine Geschichte lebendig.",
		"Ein Wortfeld hilft dir auch, wenn du immer das gleiche Wort schreibst. Statt „sagte, sagte, sagte“ schreibst du „fragte“, „rief“ und „antwortete“.",
	],
	example: {
		title: "Tinto macht es spannender",
		lines: [
			"Langweilig: Der Fuchs ging zum Hühnerstall.",
			"Spannend: Der Fuchs schlich zum Hühnerstall.",
			"Langweilig: „Wo bist du?“, sagte Tim.",
			"Genauer: „Wo bist du?“, rief Tim.",
		],
	},
	takeaway:
		"Wörter mit ähnlicher Bedeutung bilden ein Wortfeld. Wähle das Wort, das genau zur Situation passt.",
	terms: [{ term: "Wortfeld", meaning: "Wörter mit ähnlicher Bedeutung: gehen – schleichen, rennen" }],
	check: {
		wrong: "Wörter mit dem gleichen Wortstamm.",
		explanation: "Das wäre eine Wortfamilie. Ein Wortfeld hat ähnliche Bedeutungen.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Tintos Zauberwörter",
			intro:
				"In Tintos Geschichten fehlen Wörter. Wähle für jede Lücke das Wort, das am besten passt.",
			pens: [],
			puzzles: [
				gaps("nacht", "Mitten in der Nacht {schlich|rannte|hüpfte} Tinto in die Küche. „Psst“, {flüsterte|brüllte|jubelte} er, „Oma schläft.“", "In der Nacht"),
				gaps("fest", "Beim Fest {futterten|knabberten|kosteten} die hungrigen Kinder zehn Brezen. „Mehr!“, {riefen|murmelten|flüsterten} sie.", "Das Fest"),
				gaps("wald", "Im Wald {entdeckte|betrachtete|blinzelte} Mia plötzlich einen Fuchs. Sie {beobachtete|entdeckte|starrte} ihn lange durch das Fernglas.", "Im Wald"),
			],
		},
		[
			"Mache die Nachtgeschichte leise und spannend.",
			"Mache die Festgeschichte laut und hungrig.",
			"Finde die genauen Wörter zum Sehen in der Waldgeschichte.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const field = pick(rng, FIELDS);
				const impostor = pick(rng, field.impostors);
				return choice(rng, {
					prompt: `Welches Wort gehört NICHT zum Wortfeld „${field.field}“?`,
					answer: impostor,
					wrong: shuffle(rng, field.members).slice(0, 3),
					hint: `Frage bei jedem Wort: Ist das eine Art zu ${field.field}?`,
					explanation: `„${impostor}“ ist keine Art zu ${field.field}.`,
					key: `feld:${field.field}:${impostor}`,
				});
			},
			(rng) => {
				const [sentence, answer, wrong, why] = pick(rng, BEST_WORD);
				return choice(rng, {
					prompt: "Welches Wort passt am besten in die Lücke?",
					material: sentence,
					answer,
					wrong,
					hint: "Lies den ganzen Satz. Welche Hinweise stecken darin (leise, laut, plötzlich …)?",
					explanation: why,
					key: `best:${sentence}`,
				});
			},
		],
		2: [
			(rng) => {
				const [sentence, answer, wrong, why, plain] = pick(rng, BEST_WORD);
				return choice(rng, {
					prompt: "Das unterstrichene Wort ist langweilig. Welches Wort ist treffender?",
					material: sentence.replace("___", `[[${plain}]]`),
					answer,
					wrong,
					hint: "Welches Wort passt zu allen Hinweisen im Satz?",
					explanation: why,
					key: `best2:${sentence}`,
				});
			},
			(rng) => {
				const field = pick(rng, FIELDS);
				const members = shuffle(rng, field.members).slice(0, 3);
				const others = FIELDS.filter((f) => f !== field).map((f) => f.field);
				return choice(rng, {
					prompt: "Zu welchem Wortfeld gehören diese Wörter?",
					material: members.join(" · "),
					answer: field.field,
					wrong: others,
					hint: "Was haben alle drei Wörter gemeinsam? Sie sind eine Art zu …",
					explanation: `${members.join(", ")} sind Arten zu ${field.field}.`,
					key: `feldname:${members.join()}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

export const WERKSTATT: Lesson[] = [
	nomen,
	faelle,
	adjektive,
	verben,
	zeitformen,
	wortbausteine,
	wortfamilien,
	zusammensetzungen,
	wortfelder,
];
