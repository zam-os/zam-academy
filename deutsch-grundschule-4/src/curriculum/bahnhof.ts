// Station 2 · Satzbahnhof: Satzarten, wörtliche Rede, Satzglieder und
// Bindewörter (LehrplanPLUS Deutsch 3/4, 4.3).
import { choice, pick, shuffle, text } from "../exercises/tasks";
import type { Lesson, Rng, Task, TrainState, TrainWorkshop } from "../types";
import { isQuestion, isStatement } from "../workshop/engine";
import { marks, marksBetween, slotWorkshop } from "./helpers";

/* ---------- shared Satzglied bank ---------- */

type Role = "S" | "P" | "DO" | "AO" | "ORT" | "ZEIT";
interface Glied {
	mid: string;
	start: string;
	role: Role;
}
const g = (role: Role, mid: string, start = mid[0].toUpperCase() + mid.slice(1)): Glied => ({
	mid,
	start,
	role,
});
/** Sentences in their usual order: Subjekt, Prädikat, further Satzglieder. */
const BANK: Glied[][] = [
	[g("S", "die Kinder"), g("P", "spielen"), g("ZEIT", "nach der Schule"), g("ORT", "im Hof"), g("AO", "Fußball")],
	[g("S", "Tinto"), g("P", "schenkt"), g("DO", "seiner Oma"), g("AO", "einen Kuchen")],
	[g("S", "der Bäcker"), g("P", "backt"), g("ZEIT", "jeden Morgen"), g("AO", "frische Brezen")],
	[g("S", "meine Schwester"), g("P", "wohnt"), g("ORT", "in München")],
	[g("S", "der Opa"), g("P", "erzählt"), g("DO", "den Kindern"), g("AO", "eine Geschichte")],
	[g("S", "wir"), g("P", "fahren"), g("ZEIT", "am Samstag"), g("ORT", "an den See")],
	[g("S", "Lea"), g("P", "hilft"), g("DO", "ihrem kleinen Bruder")],
	[g("S", "der Hund"), g("P", "schläft"), g("ORT", "unter dem Tisch")],
	[g("S", "die Lehrerin"), g("P", "gibt"), g("ZEIT", "heute"), g("DO", "den Schülern"), g("AO", "die Hefte")],
	[g("S", "die Schwalben"), g("P", "fliegen"), g("ZEIT", "im Herbst"), g("ORT", "nach Afrika")],
	[g("S", "mein Freund"), g("P", "besucht"), g("AO", "mich"), g("ZEIT", "morgen")],
	[g("S", "die Katze"), g("P", "fängt"), g("ZEIT", "in der Nacht"), g("AO", "eine Maus")],
	[g("S", "der Igel"), g("P", "schläft"), g("ZEIT", "im Winter"), g("ORT", "unter einem Laubhaufen")],
	[g("S", "Ben"), g("P", "dankt"), g("DO", "dem Busfahrer")],
	[g("S", "die Oma"), g("P", "liest"), g("ZEIT", "am Abend"), g("DO", "ihrem Enkel"), g("AO", "ein Märchen")],
];

const ROLE_NAME: Record<Role, string> = {
	S: "Subjekt",
	P: "Prädikat",
	DO: "Dativobjekt",
	AO: "Akkusativobjekt",
	ORT: "Ortsangabe",
	ZEIT: "Zeitangabe",
};

/** Build the sentence with `front` (index) moved to the front. */
function arrange(parts: Glied[], front = 0): string {
	const verb = parts.findIndex((p) => p.role === "P");
	const first = parts[front];
	const rest = parts.filter((_, i) => i !== front && i !== verb);
	return `${[first.start, parts[verb].mid, ...rest.map((p) => p.mid)].join(" ")}.`;
}

/** A sentence from the bank, sometimes starting with another Satzglied. */
function bankSentence(rng: Rng, filter: (s: Glied[]) => boolean = () => true) {
	const parts = pick(rng, BANK.filter(filter));
	const candidates = parts.map((_, i) => i).filter((i) => parts[i].role !== "P");
	const front = rng() < 0.5 ? 0 : pick(rng, candidates);
	return { parts, front, sentence: arrange(parts, front) };
}

/** As written in the sentence: start form at the front, otherwise mid form. */
const written = (parts: Glied[], front: number, i: number): string =>
	i === front ? parts[i].start : parts[i].mid;

function permutations<T>(list: T[]): T[][] {
	if (list.length <= 1) return [list];
	return list.flatMap((x, i) =>
		permutations([...list.slice(0, i), ...list.slice(i + 1)]).map((rest) => [x, ...rest]),
	);
}

function markIn(sentence: string, part: string): string {
	return sentence.replace(part, `[[${part}]]`);
}

/* ---------- 1 Satzarten ---------- */

type Art = "Aussagesatz" | "Fragesatz" | "Ausrufe- oder Aufforderungssatz";
const ARTS: Art[] = ["Aussagesatz", "Fragesatz", "Ausrufe- oder Aufforderungssatz"];
const MARK: Record<Art, string> = { Aussagesatz: ".", Fragesatz: "?", "Ausrufe- oder Aufforderungssatz": "!" };
const ART_SENTENCES: [string, Art][] = [
	["Wo hast du meinen Füller versteckt", "Fragesatz"],
	["Gib mir sofort den Füller zurück", "Ausrufe- oder Aufforderungssatz"],
	["Der Füller liegt unter deinem Heft", "Aussagesatz"],
	["Kommst du morgen mit ins Schwimmbad", "Fragesatz"],
	["Das Wasser hat heute 24 Grad", "Aussagesatz"],
	["Vergiss dein Handtuch nicht", "Ausrufe- oder Aufforderungssatz"],
	["Hurra, wir haben gewonnen", "Ausrufe- oder Aufforderungssatz"],
	["Wer hat das letzte Tor geschossen", "Fragesatz"],
	["Tinto schießt mit dem dritten Arm", "Aussagesatz"],
	["Wann beginnt der Film", "Fragesatz"],
	["Bitte mach das Fenster zu", "Ausrufe- oder Aufforderungssatz"],
	["Im Winter schlafen Igel sehr lange", "Aussagesatz"],
];
/** Statement → Entscheidungsfrage. */
const TO_QUESTION: [string, string][] = [
	["Tinto schreibt einen Brief.", "Schreibt Tinto einen Brief?"],
	["Lea spielt Geige.", "Spielt Lea Geige?"],
	["Der Bus kommt pünktlich.", "Kommt der Bus pünktlich?"],
	["Du hast Hunger.", "Hast du Hunger?"],
	["Die Kinder gehen in den Zoo.", "Gehen die Kinder in den Zoo?"],
	["Ihr fahrt nach Passau.", "Fahrt ihr nach Passau?"],
	["Opa kocht heute Nudeln.", "Kocht Opa heute Nudeln?"],
	["Der Film ist spannend.", "Ist der Film spannend?"],
];
/** Statement with marked part → W-Frage. */
const W_QUESTION: [string, string][] = [
	["Tinto wohnt [[im Brunnen]].", "Wo wohnt Tinto?"],
	["[[Lea]] gewinnt das Rennen.", "Wer gewinnt das Rennen?"],
	["Das Fest beginnt [[um drei Uhr]].", "Wann beginnt das Fest?"],
	["Ben isst [[einen Apfel]].", "Was isst Ben?"],
	["Die Klasse fährt [[nach Würzburg]].", "Wohin fährt die Klasse?"],
	["Die Katze schläft [[auf dem Sofa]].", "Wo schläft die Katze?"],
	["Der Zug kommt [[am Abend]].", "Wann kommt der Zug?"],
	["[[Der Postbote]] bringt ein Paket.", "Wer bringt ein Paket?"],
];

const satzarten: Lesson = {
	id: "satzarten",
	stage: "bahnhof",
	title: "Satzarten und Satzzeichen",
	skill: "Du unterscheidest Aussage-, Frage- und Ausrufesätze und setzt das passende Zeichen.",
	lehrplan: "D3/4 4.3: Satzarten, ihre Wirkung und Satzzeichen",
	bindings: ["4.3-09"],
	sticker: { emoji: "🚦", name: "Signal" },
	paragraphs: [
		"Mit einem Aussagesatz erzählst oder berichtest du etwas. Am Ende steht ein Punkt.",
		"Mit einem Fragesatz willst du etwas wissen. Am Ende steht ein Fragezeichen. Eine W-Frage beginnt mit einem Fragewort (Wer? Wo? Wann? Warum?). Bei einer Ja-Nein-Frage steht das Verb ganz vorne: Kommst du mit?",
		"Mit einem Ausrufe- oder Aufforderungssatz zeigst du ein starkes Gefühl oder du willst, dass jemand etwas tut. Am Ende steht ein Ausrufezeichen: Hurra! Komm sofort her!",
	],
	example: {
		title: "Tinto am Signal",
		lines: [
			"Der Zug fährt um acht Uhr ab.  → Aussage: Punkt",
			"Wann fährt der Zug ab?  → Frage: Fragezeichen",
			"Fährt der Zug pünktlich?  → Ja-Nein-Frage, Verb vorne",
			"Steig schnell ein!  → Aufforderung: Ausrufezeichen",
		],
	},
	takeaway:
		"Aussagesatz → Punkt (.) · Fragesatz → Fragezeichen (?) · Ausrufe- und Aufforderungssatz → Ausrufezeichen (!)",
	terms: [
		{ term: "Aussagesatz", meaning: "teilt etwas mit · Punkt" },
		{ term: "Fragesatz", meaning: "will etwas wissen · Fragezeichen" },
		{ term: "Ausrufe- / Aufforderungssatz", meaning: "Gefühl oder Befehl · Ausrufezeichen" },
	],
	check: {
		wrong: "ein Punkt",
		explanation: "„Komm sofort her“ ist eine Aufforderung. Dahin gehört ein Ausrufezeichen.",
	},
	workshop: slotWorkshop(
		{
			variant: "punct",
			title: "Das Signal-Stellwerk",
			intro:
				"Im Bahnhof fehlen die Signale am Satzende. Wähle oben ein Zeichen und setze es mit einem Tipp in die Lücke.",
			pens: [
				{ value: ".", label: "Punkt", colour: "green" },
				{ value: "?", label: "Fragezeichen", colour: "blue" },
				{ value: "!", label: "Ausrufezeichen", colour: "red" },
			],
			puzzles: [
				marksBetween("fueller", "Wo hast du meinen Füller versteckt {?} Gib ihn sofort zurück {!} Er liegt unter deinem Heft {.}"),
				marksBetween("schwimmbad", "Kommst du morgen mit ins Schwimmbad {?} Das Wasser hat heute 24 Grad {.} Vergiss dein Handtuch nicht {!}"),
				marksBetween("tor", "Hurra, wir haben gewonnen {!} Wer hat das letzte Tor geschossen {?} Tinto schoss es mit dem dritten Arm {.}"),
			],
		},
		[
			"Setze alle Zeichen im Füller-Streit.",
			"Setze alle Zeichen in der Schwimmbad-Nachricht.",
			"Setze alle Zeichen beim Fußballspiel.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [sentence, art] = pick(rng, ART_SENTENCES);
				return choice(rng, {
					prompt: "Welches Satzzeichen gehört ans Ende?",
					material: `${sentence} ___`,
					answer: MARK[art],
					wrong: [".", "?", "!"],
					hint: "Will jemand etwas wissen? Erzählt er etwas? Oder ruft oder befiehlt er?",
					explanation: `Das ist ein ${art}. Er endet mit „${MARK[art]}“.`,
					key: `zeichen:${sentence}`,
				});
			},
			(rng) => {
				const [sentence, art] = pick(rng, ART_SENTENCES);
				return choice(rng, {
					prompt: "Welche Satzart ist das?",
					material: `${sentence}${MARK[art]}`,
					answer: art,
					wrong: ARTS,
					hint: "Schau auf das Satzzeichen und auf den Anfang: Fragewort oder Verb vorne?",
					explanation: `Das ist ein ${art}.`,
					key: `art:${sentence}`,
				});
			},
		],
		2: [
			(rng) => {
				const [statement, question] = pick(rng, TO_QUESTION);
				return text({
					prompt: "Mache aus dem Aussagesatz eine Ja-Nein-Frage. Schreibe den ganzen Satz.",
					material: statement,
					accept: [question],
					hint: "Das Verb wandert ganz nach vorne. Denk an den großen Anfangsbuchstaben und an das Fragezeichen.",
					explanation: `Richtig: ${question}`,
					mistakes: { [question.replace("?", ".")]: "Eine Frage endet mit einem Fragezeichen." },
					key: `frage:${statement}`,
				});
			},
			(rng) => {
				const [statement, question] = pick(rng, W_QUESTION);
				return text({
					prompt: "Frage nach dem unterstrichenen Teil. Schreibe eine W-Frage.",
					material: statement,
					accept: [question],
					hint: "Wähle das passende Fragewort: Wer? Was? Wo? Wohin? Wann? Danach kommt das Verb.",
					explanation: `Richtig: ${question}`,
					key: `wfrage:${statement}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 2 Wörtliche Rede ---------- */

/** [Begleitsatz vorne, Begleitsatz hinten, wrong variant]. */
const SPEECH: [string, string, string][] = [
	["Mia sagt: „Ich komme mit.“", "„Ich komme mit“, sagt Mia.", "„Ich komme mit.“, sagt Mia."],
	["Tim ruft: „Pass auf!“", "„Pass auf!“, ruft Tim.", "„Pass auf“! ruft Tim."],
	["Oma fragt: „Hast du Hunger?“", "„Hast du Hunger?“, fragt Oma.", "„Hast du Hunger“, fragt Oma?"],
	["Tinto flüstert: „Ich habe einen Plan.“", "„Ich habe einen Plan“, flüstert Tinto.", "„Ich habe einen Plan.“ flüstert Tinto."],
	["Lea antwortet: „Das weiß ich nicht.“", "„Das weiß ich nicht“, antwortet Lea.", "„Das weiß ich nicht.“, antwortet Lea."],
	["Der Lehrer sagt: „Packt eure Hefte ein.“", "„Packt eure Hefte ein“, sagt der Lehrer.", "„Packt eure Hefte ein.“ sagt der Lehrer."],
	["Ben fragt: „Wo ist mein Schuh?“", "„Wo ist mein Schuh?“, fragt Ben.", "„Wo ist mein Schuh“? fragt Ben."],
	["Papa ruft: „Das Essen ist fertig!“", "„Das Essen ist fertig!“, ruft Papa.", "„Das Essen ist fertig“! ruft Papa."],
];

const rede: Lesson = {
	id: "woertliche-rede",
	stage: "bahnhof",
	title: "Wörtliche Rede",
	skill: "Du setzt bei wörtlicher Rede Anführungszeichen, Doppelpunkt und Komma richtig.",
	lehrplan: "D3/4 4.3: Wörtliche Rede und Redebegleitsatz",
	bindings: ["4.3-08", "4.3-14"],
	sticker: { emoji: "💬", name: "Sprechblase" },
	paragraphs: [
		"Was jemand genau sagt, ist wörtliche Rede. Sie steht in Anführungszeichen: vorne unten „ und hinten oben “. Der Satz, der sagt, wer spricht, heißt Begleitsatz.",
		"Steht der Begleitsatz vorne, folgt ein Doppelpunkt. Das Satzzeichen der Rede steht vor dem Schlusszeichen: Tinto sagt: „Ich habe Hunger.“",
		"Steht der Begleitsatz hinten, setzt du nach dem Schlusszeichen ein Komma. Der Punkt der Rede fällt weg. Fragezeichen und Ausrufezeichen bleiben: „Hast du Hunger?“, fragt Tinto.",
	],
	example: {
		title: "Tintos Sprechblasen",
		lines: [
			"Begleitsatz vorne: Lea ruft: „Komm schnell!“",
			"Begleitsatz hinten: „Ich komme gleich“, antwortet Ben.",
			"Mit Frage: „Wo bist du?“, fragt Lea.",
			"Merke: Punkt fällt weg – ? und ! bleiben.",
		],
	},
	takeaway:
		"Begleitsatz vorne: Doppelpunkt, dann „Rede.“ · Begleitsatz hinten: „Rede“, Begleitsatz. Fragezeichen und Ausrufezeichen der Rede bleiben stehen.",
	terms: [
		{ term: "wörtliche Rede", meaning: "was jemand genau sagt, in „…“" },
		{ term: "Begleitsatz", meaning: "sagt, wer spricht: sagt Tinto" },
		{ term: "Anführungszeichen", meaning: "„ vorne unten, “ hinten oben" },
	],
	check: {
		wrong: "ein Punkt",
		explanation: "Steht der Begleitsatz vorne, folgt ein Doppelpunkt: Tinto sagt: „Ich habe Hunger.“",
	},
	workshop: slotWorkshop(
		{
			variant: "punct",
			title: "Die Sprechblasen-Werkstatt",
			intro:
				"Tintos Freunde reden durcheinander. Wähle ein Zeichen und tippe in die Lücken. Manche Lücken bleiben leer!",
			pens: [
				{ value: "„", label: "„ vorne", colour: "blue" },
				{ value: "“", label: "“ hinten", colour: "blue" },
				{ value: ":", label: "Doppelpunkt", colour: "purple" },
				{ value: ",", label: "Komma", colour: "orange" },
				{ value: ".", label: "Punkt", colour: "green" },
				{ value: "?", label: "Fragezeichen", colour: "teal" },
				{ value: "!", label: "Ausrufezeichen", colour: "red" },
			],
			puzzles: [
				marksBetween("vorne", "Tinto ruft {:} {„} Komm {} schnell her {!} {“}", "Begleitsatz vorne"),
				marksBetween("hinten", "{„} Ich bin {} gleich fertig {“} {,} sagt {} Lea {.}", "Begleitsatz hinten"),
				marksBetween("frage", "{„} Kommst du {} mit {?} {“} {,} fragt Ben {.}", "Begleitsatz hinten mit Frage"),
			],
		},
		[
			"Setze die Zeichen, wenn der Begleitsatz vorne steht.",
			"Setze die Zeichen, wenn der Begleitsatz hinten steht.",
			"Setze die Zeichen bei einer Frage mit Begleitsatz hinten.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [front, , wrongBack] = pick(rng, SPEECH);
				const broken = front.replace(":", "").replace("„", "").replace("“", "");
				return choice(rng, {
					prompt: "Welcher Satz ist richtig geschrieben? Der Begleitsatz steht vorne.",
					answer: front,
					wrong: [broken, front.replace(": „", " „").replace("“", ""), wrongBack],
					hint: "Begleitsatz vorne: Doppelpunkt, Anführungszeichen unten, Rede mit Satzzeichen, Anführungszeichen oben.",
					explanation: `Richtig: ${front}`,
					key: `rede-vorne:${front}`,
				});
			},
			(rng) => {
				const [front, back] = pick(rng, SPEECH);
				const speech = back.slice(1, back.indexOf("“"));
				const begleit = back.slice(back.indexOf("“") + 3).replace(/\.$/, "");
				const asFront = rng() < 0.5;
				const answer = asFront ? front.slice(0, front.indexOf(":")) : begleit;
				return choice(rng, {
					prompt: "Was ist der Begleitsatz?",
					material: asFront ? front : back,
					answer,
					wrong: [speech.replace(/[?!]$/, ""), asFront ? answer.split(" ")[0] : answer.split(" ").slice(1).join(" ")],
					hint: "Der Begleitsatz sagt, wer spricht und wie.",
					explanation: `„${answer}“ sagt, wer spricht. Das ist der Begleitsatz.`,
					key: `begleit:${back}`,
				});
			},
		],
		2: [
			(rng) => {
				const [front, back, wrongBack] = pick(rng, SPEECH);
				const alt = back.includes("?") || back.includes("!")
					? back.replace(/([?!])“,/, "“$1")
					: back.replace("“,", ".“,");
				return choice(rng, {
					prompt: "Welcher Satz ist richtig? Der Begleitsatz steht hinten.",
					answer: back,
					wrong: [wrongBack, alt, back.replace("“,", "“")],
					hint: "Begleitsatz hinten: Ein Punkt fällt weg, ? und ! bleiben. Nach dem Schlusszeichen kommt ein Komma.",
					explanation: `Richtig: ${back} (Begleitsatz vorne wäre: ${front})`,
					key: `rede-hinten:${back}`,
				});
			},
			(rng) => {
				const [front, back] = pick(rng, SPEECH);
				return text({
					prompt:
						"Schreibe den Satz so um, dass der Begleitsatz vorne steht. Anführungszeichen darfst du mit \" tippen.",
					material: back,
					accept: [front],
					hint: "Erst der Begleitsatz, dann ein Doppelpunkt, dann die Rede in Anführungszeichen mit ihrem Satzzeichen.",
					explanation: `Richtig: ${front}`,
					key: `umschreiben:${back}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 3 Satzglieder und Umstellprobe ---------- */

const zug: TrainWorkshop = {
	kind: "train",
	title: "Der Satzzug",
	intro:
		"Jeder Waggon ist ein Satzglied. Verschiebe die Waggons mit den Pfeilen. Der rote Waggon ist das Prädikat: Im Aussagesatz fährt er immer an zweiter Stelle.",
	wagons: [
		{ mid: "am Montag", start: "Am Montag" },
		{ mid: "bringt", start: "Bringt", verb: true },
		{ mid: "Tinto", start: "Tinto" },
		{ mid: "seiner Oma", start: "Seiner Oma" },
		{ mid: "einen Kuchen", start: "Einen Kuchen" },
	],
	order: [2, 1, 3, 0, 4],
	goals: [
		{
			id: "anders-vorne",
			label: "Stelle ein anderes Satzglied an den Anfang. Der Satz muss richtig bleiben.",
			reached: (s: TrainState) => isStatement(zug, s) && s.order[0] !== 2,
		},
		{
			id: "alle-vorne",
			label: "Jedes Satzglied (außer dem Prädikat) war einmal vorne in einem richtigen Satz.",
			reached: (s: TrainState) => [0, 2, 3, 4].every((w) => s.frontSeen.includes(w)),
		},
		{
			id: "frage",
			label: "Mach daraus eine Ja-Nein-Frage: Das Prädikat fährt nach vorne, hinten steht „?“.",
			reached: (s: TrainState) => isQuestion(zug, s),
		},
	],
};

const satzglieder: Lesson = {
	id: "satzglieder-umstellprobe",
	stage: "bahnhof",
	title: "Satzglieder: der Satzzug",
	skill: "Du findest Satzglieder mit der Umstellprobe und veränderst Sätze.",
	lehrplan: "D3/4 4.3: Satzglieder umstellen, ersetzen, weglassen, erweitern",
	bindings: ["4.3-11", "4.3-15"],
	sticker: { emoji: "🚂", name: "Lokomotive" },
	paragraphs: [
		"Ein Satz ist wie ein Zug aus Waggons. Jeder Waggon ist ein Satzglied. Ein Satzglied kann ein Wort sein oder aus mehreren Wörtern bestehen.",
		"So findest du die Satzglieder: Stelle den Satz um, ohne dass sich der Sinn ändert. Wörter, die dabei immer zusammenbleiben, bilden ein Satzglied. Das ist die Umstellprobe.",
		"Im Aussagesatz steht das Prädikat (die Personalform des Verbs) immer an zweiter Stelle. Du kannst Satzglieder auch ersetzen (Tinto → er), weglassen oder erweitern (am Montag früh). So machst du deine Sätze abwechslungsreich.",
	],
	example: {
		title: "Tinto rangiert",
		lines: [
			"Tinto | bringt | seiner Oma | am Montag | einen Kuchen.",
			"Am Montag | bringt | Tinto | seiner Oma | einen Kuchen.",
			"Einen Kuchen | bringt | Tinto | am Montag | seiner Oma.",
			"„seiner Oma“ bleibt immer zusammen → ein Satzglied. „bringt“ steht immer an 2. Stelle.",
		],
	},
	takeaway:
		"Satzglieder sind Wörter, die beim Umstellen zusammenbleiben. Im Aussagesatz steht das Prädikat immer an zweiter Stelle.",
	terms: [
		{ term: "Satzglied", meaning: "ein Waggon im Satzzug" },
		{ term: "Umstellprobe", meaning: "Satzglieder verschieben, der Sinn bleibt" },
		{ term: "Ersatzprobe", meaning: "ein Satzglied durch ein anderes Wort ersetzen" },
	],
	check: {
		wrong: "Jedes einzelne Wort ist ein Satzglied.",
		explanation: "Ein Satzglied kann aus mehreren Wörtern bestehen, zum Beispiel „seiner Oma“.",
	},
	workshop: zug,
	generators: {
		1: [
			(rng) => {
				const { parts, sentence } = bankSentence(rng);
				const n = parts.length;
				return choice(rng, {
					prompt: "Wie viele Satzglieder hat der Satz?",
					material: sentence,
					answer: String(n),
					wrong: ["2", "3", "4", "5", "6"].filter((x) => x !== String(n)).slice(0, 3),
					hint: "Stelle den Satz im Kopf um. Was bleibt zusammen?",
					explanation: `Die Satzglieder sind: ${parts.map((p) => p.mid).join(" | ")}.`,
					key: `anzahl:${sentence}`,
				});
			},
			(rng) => {
				const { parts, front, sentence } = bankSentence(rng, (s) => s.some((p) => p.mid.includes(" ")));
				const i = parts.findIndex((p) => p.mid.includes(" "));
				const glied = written(parts, front, i);
				const words = sentence.replace(/\.$/, "").split(" ");
				const wrongs = words
					.slice(0, -1)
					.map((_, k) => words.slice(k, k + 2).join(" "))
					.filter((x) => !parts.some((p) => p.mid === x || p.start === x))
					.slice(0, 3);
				return choice(rng, {
					prompt: "Welche Wörter bilden zusammen ein Satzglied?",
					material: sentence,
					answer: glied,
					wrong: wrongs,
					hint: "Stelle um: Welche Wörter wandern immer gemeinsam?",
					explanation: `„${glied}“ bleibt beim Umstellen zusammen.`,
					key: `glied:${sentence}`,
				});
			},
		],
		2: [
			(rng) => {
				const parts = pick(rng, BANK.filter((s) => s.length >= 4));
				const others = parts.map((_, i) => i).filter((i) => parts[i].role !== "P" && i !== 0);
				const front = pick(rng, others);
				const right = arrange(parts, front);
				const verb = parts.find((p) => p.role === "P") as Glied;
				const rest = parts.filter((p, i) => i !== front && p.role !== "P").map((p) => p.mid);
				const wrongA = `${[parts[front].start, ...rest, verb.mid].join(" ")}.`;
				const wrongB = `${[parts[front].start, rest[0], verb.mid, ...rest.slice(1)].join(" ")}.`;
				return choice(rng, {
					prompt: "Welche Umstellung ist ein richtiger Aussagesatz?",
					material: arrange(parts, 0),
					answer: right,
					wrong: [wrongA, wrongB],
					hint: "Wo steht das Prädikat im Aussagesatz?",
					explanation: `In „${right}“ steht das Prädikat „${verb.mid}“ an zweiter Stelle.`,
					key: `umstellen:${right}`,
				});
			},
			(rng) => {
				const parts = pick(rng, BANK.filter((s) => s.length >= 3));
				const others = parts.map((_, i) => i).filter((i) => parts[i].role !== "P" && i !== 0);
				const front = pick(rng, others);
				const target = arrange(parts, front);
				// Any order of the remaining Satzglieder behind the verb is a correct statement.
				const verb = parts.find((p) => p.role === "P") as Glied;
				const rest = parts.filter((p, i) => i !== front && p.role !== "P").map((p) => p.mid);
				const accept = permutations(rest).map((r) => `${[parts[front].start, verb.mid, ...r].join(" ")}.`);
				return text({
					prompt: "Stelle den Satz um: Der unterstrichene Teil soll vorne stehen.",
					material: markIn(arrange(parts, 0), parts[front].mid),
					accept: [target, ...accept.filter((a) => a !== target), ...accept.map((a) => a.replace(/\.$/, ""))],
					hint: "Das unterstrichene Satzglied nach vorne, dann das Prädikat. Großer Anfangsbuchstabe!",
					explanation: `Richtig: ${target}`,
					key: `vorne:${target}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 4 Subjekt und Prädikat ---------- */

/** Subject, verb choice frame and the three persons' forms. */
const AGREE: [string, string, string[]][] = [
	["Die Kinder ___ im Garten.", "spielen", ["spielt", "spielst"]],
	["Das Kind ___ im Garten.", "spielt", ["spielen", "spielst"]],
	["Mein Opa ___ jeden Tag Zeitung.", "liest", ["lesen", "lest"]],
	["Die Vögel ___ ein Nest.", "bauen", ["baut", "baust"]],
	["Du ___ sehr schnell.", "läufst", ["laufen", "läuft"]],
	["Lea und Ben ___ ein Lied.", "singen", ["singt", "singst"]],
	["Der Zug ___ pünktlich ab.", "fährt", ["fahren", "fahrt"]],
	["Ihr ___ morgen einen Ausflug.", "macht", ["machen", "machst"]],
];

const subjektPraedikat: Lesson = {
	id: "subjekt-praedikat",
	stage: "bahnhof",
	title: "Subjekt und Prädikat",
	skill: "Du bestimmst Prädikat und Subjekt und lässt sie zusammenpassen.",
	lehrplan: "D3/4 4.3: Prädikat und Subjekt bestimmen",
	bindings: ["4.3-12", "4.3-15"],
	sticker: { emoji: "🚉", name: "Bahnsteig" },
	paragraphs: [
		"Das Prädikat ist die Satzaussage. Es sagt, was jemand tut oder was geschieht. Das Prädikat ist die Personalform des Verbs. Frage: Was tut …? Was geschieht?",
		"Das Subjekt ist der Satzgegenstand. Du findest es mit der Frage „Wer oder was?“. Das Subjekt steht immer im 1. Fall.",
		"Subjekt und Prädikat passen zusammen: Das Kind lacht. Die Kinder lachen. Manchmal hat das Prädikat zwei Teile: Tinto hat gelacht. Tinto ruft Oma an.",
	],
	example: {
		title: "Tinto fragt sich durch",
		lines: [
			"Am Morgen weckt der Wecker die ganze Familie.",
			"Was geschieht? → weckt: Prädikat",
			"Wer oder was weckt? → der Wecker: Subjekt",
			"Zwei Teile: Hat Lea den Schlüssel gefunden? → Prädikat: hat … gefunden",
		],
	},
	takeaway:
		"Prädikat: Was tut …? (Personalform des Verbs) · Subjekt: Wer oder was? (1. Fall). Beide passen zusammen.",
	terms: [
		{ term: "Prädikat", meaning: "Satzaussage: Was tut …?" },
		{ term: "Subjekt", meaning: "Satzgegenstand: Wer oder was?" },
	],
	check: {
		wrong: "Was tut jemand?",
		explanation: "„Was tut jemand?“ führt zum Prädikat. Das Subjekt findest du mit „Wer oder was?“, es kann auch hinter dem Prädikat stehen.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Die Bahnsteig-Kontrolle",
			intro:
				"Tinto kontrolliert die Satzzüge. Wähle einen Stift und markiere Prädikat und Subjekt. Die übrigen Waggons bleiben unmarkiert.",
			pens: [
				{ value: "P", label: "Prädikat", colour: "red" },
				{ value: "S", label: "Subjekt", colour: "blue" },
			],
			puzzles: [
				marks("wecker", "Am_Morgen weckt|P der_Wecker|S die_ganze_Familie ."),
				marks("brief", "Tinto|S schreibt|P seiner_Freundin einen_Brief ."),
				marks("schluessel", "Hat|P Lea|S den_Schlüssel gefunden|P ?", "Zwei Teile!"),
			],
		},
		[
			"Kontrolliere den Wecker-Zug.",
			"Kontrolliere den Brief-Zug.",
			"Kontrolliere den Frage-Zug. Das Prädikat hat zwei Teile!",
		],
	),
	generators: {
		1: [
			(rng) => {
				const { parts, front, sentence } = bankSentence(rng);
				const vi = parts.findIndex((p) => p.role === "P");
				return choice(rng, {
					prompt: "Was ist das Prädikat?",
					material: sentence,
					answer: written(parts, front, vi),
					wrong: shuffle(rng, parts.map((_, i) => i).filter((i) => i !== vi)).slice(0, 3).map((i) => written(parts, front, i)),
					hint: "Frage: Was tut jemand? Was geschieht? Suche die Personalform des Verbs.",
					explanation: `„${parts[vi].mid}“ sagt, was geschieht. Das ist das Prädikat.`,
					key: `praedikat:${sentence}`,
				});
			},
			(rng) => {
				const { parts, front, sentence } = bankSentence(rng);
				const si = parts.findIndex((p) => p.role === "S");
				const verb = parts.find((p) => p.role === "P") as Glied;
				return choice(rng, {
					prompt: "Was ist das Subjekt?",
					material: sentence,
					answer: written(parts, front, si),
					wrong: shuffle(rng, parts.map((_, i) => i).filter((i) => i !== si)).slice(0, 3).map((i) => written(parts, front, i)),
					hint: `Frage mit „Wer oder was …?“ und dem Prädikat „${verb.mid}“.`,
					explanation: `„${parts[si].mid}“ antwortet auf die Frage „Wer oder was?“. Das ist das Subjekt.`,
					key: `subjekt:${sentence}`,
				});
			},
		],
		2: [
			(rng) => {
				const [frame, right, wrong] = pick(rng, AGREE);
				return choice(rng, {
					prompt: "Welche Form des Prädikats passt zum Subjekt?",
					material: frame,
					answer: right,
					wrong,
					hint: "Suche zuerst das Subjekt: eins oder mehrere? Du, ihr oder er?",
					explanation: frame.replace("___", right),
					key: `passt:${frame}`,
				});
			},
			(rng) => {
				const parts = pick(rng, BANK.filter((s) => s.length >= 3));
				const front = pick(rng, parts.map((_, i) => i).filter((i) => !["S", "P"].includes(parts[i].role)));
				const s2 = arrange(parts, front);
				const si = parts.findIndex((p) => p.role === "S");
				const subject = parts[si].mid;
				return text({
					prompt: "Schreibe das Subjekt heraus, genau wie es im Satz steht.",
					material: s2,
					accept: [subject, parts[si].start],
					hint: "Frage „Wer oder was …?“ und schreibe das ganze Satzglied ab.",
					explanation: `Das Subjekt ist „${subject}“.`,
					key: `subjekt2:${s2}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 5 Objekte im 3. und 4. Fall ---------- */

const DATIV_VERBS = ["helfen", "danken", "gehören", "gratulieren", "antworten", "zuhören", "folgen", "vertrauen"];
const AKK_VERBS = ["sehen", "kaufen", "lesen", "suchen", "finden", "fragen", "besuchen", "essen"];

const objekte: Lesson = {
	id: "objekte",
	stage: "bahnhof",
	title: "Wem? Wen oder was? Die Objekte",
	skill: "Du bestimmst Dativobjekt und Akkusativobjekt.",
	lehrplan: "D3/4 4.3: Satzergänzungen (Objekte), Abhängigkeit vom Prädikat",
	bindings: ["4.3-12", "4.3-13"],
	sticker: { emoji: "🎁", name: "Geschenk" },
	paragraphs: [
		"Das Prädikat bestimmt, was ein Satz noch braucht. „Tinto schenkt.“ Da fehlt etwas! Wem schenkt er? Was schenkt er? Diese Satzglieder heißen Satzergänzungen oder Objekte.",
		"Das Dativobjekt steht im 3. Fall. Du fragst: Wem? → Tinto schenkt seiner Oma einen Kuchen. Wem? seiner Oma.",
		"Das Akkusativobjekt steht im 4. Fall. Du fragst: Wen oder was? → Was schenkt Tinto? einen Kuchen. Manche Verben brauchen nur ein Objekt: Ich helfe dir (Wem?). Ich sehe dich (Wen?).",
	],
	example: {
		title: "Tinto packt Geschenke ein",
		lines: [
			"Der Opa erzählt den Kindern eine Geschichte.",
			"Wem erzählt der Opa? → den Kindern: Dativobjekt (3. Fall)",
			"Was erzählt der Opa? → eine Geschichte: Akkusativobjekt (4. Fall)",
			"Wer erzählt? → der Opa: Subjekt, kein Objekt!",
		],
	},
	takeaway:
		"Dativobjekt: Wem? (3. Fall) · Akkusativobjekt: Wen oder was? (4. Fall). Das Prädikat bestimmt, welche Objekte nötig sind.",
	terms: [
		{ term: "Dativobjekt", meaning: "Wem? – seiner Oma" },
		{ term: "Akkusativobjekt", meaning: "Wen oder was? – einen Kuchen" },
	],
	check: {
		wrong: "Wen oder was?",
		explanation: "Nach dem Dativobjekt fragst du mit „Wem?“. „Wen oder was?“ gehört zum Akkusativobjekt.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Die Paketstation",
			intro:
				"Tinto sortiert Pakete. Markiere, wer etwas bekommt (Wem?) und was verschickt wird (Wen oder was?). Subjekt und Prädikat bleiben frei.",
			pens: [
				{ value: "DO", label: "Wem? (3. Fall)", colour: "orange" },
				{ value: "AO", label: "Wen oder was? (4. Fall)", colour: "purple" },
			],
			puzzles: [
				marks("kuchen", "Tinto schenkt seiner_Oma|DO einen_Kuchen|AO ."),
				marks("bruder", "Lea hilft ihrem_kleinen_Bruder|DO ."),
				marks("hefte", "Heute gibt die_Lehrerin den_Schülern|DO die_Hefte|AO ."),
			],
		},
		[
			"Sortiere das Kuchen-Paket.",
			"Sortiere das Hilfe-Paket. Hier gibt es nur ein Objekt.",
			"Sortiere das Heft-Paket. Achtung: die Lehrerin ist das Subjekt!",
		],
	),
	generators: {
		1: [
			(rng) => {
				const { parts, front, sentence } = bankSentence(rng, (s) => s.some((p) => p.role === "DO"));
				const di = parts.findIndex((p) => p.role === "DO");
				const verb = parts.find((p) => p.role === "P") as Glied;
				return choice(rng, {
					prompt: "Welches Satzglied ist das Dativobjekt?",
					material: sentence,
					answer: written(parts, front, di),
					wrong: parts.map((_, i) => i).filter((i) => i !== di && parts[i].role !== "P").map((i) => written(parts, front, i)),
					hint: `Frage: Wem ${verb.mid} …?`,
					explanation: `Wem? → ${parts[di].mid}: Dativobjekt (3. Fall).`,
					key: `dativ:${sentence}`,
				});
			},
			(rng) => {
				const { parts, front, sentence } = bankSentence(rng, (s) => s.some((p) => p.role === "AO"));
				const ai = parts.findIndex((p) => p.role === "AO");
				const verb = parts.find((p) => p.role === "P") as Glied;
				return choice(rng, {
					prompt: "Welches Satzglied ist das Akkusativobjekt?",
					material: sentence,
					answer: written(parts, front, ai),
					wrong: parts.map((_, i) => i).filter((i) => i !== ai && parts[i].role !== "P").map((i) => written(parts, front, i)),
					hint: `Frage: Wen oder was ${verb.mid} …?`,
					explanation: `Wen oder was? → ${parts[ai].mid}: Akkusativobjekt (4. Fall).`,
					key: `akk:${sentence}`,
				});
			},
		],
		2: [
			(rng) => {
				const { parts, front, sentence } = bankSentence(rng, (s) => s.some((p) => p.role === "DO" || p.role === "AO"));
				const options = parts.map((_, i) => i).filter((i) => ["S", "DO", "AO"].includes(parts[i].role));
				const i = pick(rng, options);
				const role = parts[i].role;
				return choice(rng, {
					prompt: "Bestimme das unterstrichene Satzglied.",
					material: markIn(sentence, written(parts, front, i)),
					answer: ROLE_NAME[role],
					wrong: ["Subjekt", "Dativobjekt", "Akkusativobjekt", "Prädikat"],
					hint: "Frage: Wer oder was? Wem? Wen oder was?",
					explanation: `Das ist das ${ROLE_NAME[role]}.`,
					key: `bestimme:${sentence}:${i}`,
				});
			},
			(rng) => {
				const dativ = pick(rng, DATIV_VERBS);
				return choice(rng, {
					prompt: "Welches Verb braucht ein Dativobjekt (Wem?)?",
					answer: dativ,
					wrong: shuffle(rng, AKK_VERBS).slice(0, 3),
					hint: "Bilde mit jedem Verb einen kleinen Satz: Ich … dir? Oder: Ich … dich?",
					explanation: `Man sagt: Ich ${dativ === "zuhören" ? "höre dir zu" : `${dativ.replace(/en$/, "e").replace(/ern$/, "ere")} dir`}. „${dativ}“ braucht ein Dativobjekt.`,
					key: `dativverb:${dativ}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 6 Orts- und Zeitangaben ---------- */

const PLACE_TIME: [string, "Ortsangabe" | "Zeitangabe", string][] = [
	["im Hof", "Ortsangabe", "Wo?"],
	["nach der Schule", "Zeitangabe", "Wann?"],
	["in München", "Ortsangabe", "Wo?"],
	["an den See", "Ortsangabe", "Wohin?"],
	["am Samstag", "Zeitangabe", "Wann?"],
	["seit drei Tagen", "Zeitangabe", "Seit wann?"],
	["unter dem Tisch", "Ortsangabe", "Wo?"],
	["nach Afrika", "Ortsangabe", "Wohin?"],
	["aus dem Wald", "Ortsangabe", "Woher?"],
	["zwei Stunden lang", "Zeitangabe", "Wie lange?"],
	["im Winter", "Zeitangabe", "Wann?"],
	["vom Bäcker", "Ortsangabe", "Woher?"],
];
const EXTEND: [string, string, string][] = [
	["Wir spielen Fußball.", "nach dem Mittagessen", "Nach dem Mittagessen spielen wir Fußball."],
	["Tinto schwimmt.", "jeden Morgen", "Jeden Morgen schwimmt Tinto."],
	["Die Kinder basteln.", "am Nachmittag", "Am Nachmittag basteln die Kinder."],
	["Der Igel schläft.", "im Winter", "Im Winter schläft der Igel."],
	["Wir fahren nach Hause.", "um fünf Uhr", "Um fünf Uhr fahren wir nach Hause."],
	["Lea liest ein Buch.", "im Bett", "Im Bett liest Lea ein Buch."],
	["Opa backt Plätzchen.", "in der Küche", "In der Küche backt Opa Plätzchen."],
	["Die Vögel singen.", "im Garten", "Im Garten singen die Vögel."],
];

const angaben: Lesson = {
	id: "orts-zeitangaben",
	stage: "bahnhof",
	title: "Wo? Wann? Orts- und Zeitangaben",
	skill: "Du findest Orts- und Zeitangaben und machst Sätze genauer.",
	lehrplan: "D3/4 4.3: Orts- und Zeitangaben bestimmen",
	bindings: ["4.3-12", "4.3-11"],
	sticker: { emoji: "🗺️", name: "Fahrplan" },
	paragraphs: [
		"Orts- und Zeitangaben machen einen Satz genauer. Sie sind eigene Satzglieder. Mit der Umstellprobe kannst du sie verschieben.",
		"Eine Ortsangabe findest du mit den Fragen Wo? Wohin? Woher? → Der Hund schläft unter dem Tisch.",
		"Eine Zeitangabe findest du mit den Fragen Wann? Seit wann? Wie lange? Wie oft? → Im Winter schläft der Igel. Wenn du eine Angabe an den Anfang stellst, wird dein Text abwechslungsreicher.",
	],
	example: {
		title: "Tintos Fahrplan",
		lines: [
			"Am Samstag fahren wir an den See.",
			"Wann fahren wir? → am Samstag: Zeitangabe",
			"Wohin fahren wir? → an den See: Ortsangabe",
		],
	},
	takeaway: "Ortsangabe: Wo? Wohin? Woher? · Zeitangabe: Wann? Seit wann? Wie lange? Wie oft?",
	terms: [
		{ term: "Ortsangabe", meaning: "Wo? Wohin? Woher?" },
		{ term: "Zeitangabe", meaning: "Wann? Seit wann? Wie lange?" },
	],
	check: {
		wrong: "Wohin?",
		explanation: "„Wohin?“ fragt nach einem Ort. Nach einer Zeitangabe fragst du mit „Wann?“.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Der Fahrplan",
			intro:
				"Tinto schreibt den Fahrplan. Markiere jede Ortsangabe und jede Zeitangabe mit dem passenden Stift.",
			pens: [
				{ value: "ORT", label: "Ort: Wo? Wohin? Woher?", colour: "green" },
				{ value: "ZEIT", label: "Zeit: Wann? Wie lange?", colour: "teal" },
			],
			puzzles: [
				marks("wochenende", "Am_Wochenende|ZEIT fahren wir zu_unserer_Tante|ORT nach_Regensburg|ORT ."),
				marks("regen", "Seit_drei_Tagen|ZEIT regnet es in_unserem_Dorf|ORT ."),
				marks("igel", "Der_Igel schläft im_Winter|ZEIT unter_einem_Laubhaufen|ORT ."),
			],
		},
		[
			"Plane die Wochenend-Fahrt: eine Zeit und zwei Orte.",
			"Plane den Regentag.",
			"Plane den Igel-Winter.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const { parts, front, sentence } = bankSentence(rng, (s) => s.some((p) => p.role === "ORT"));
				const oi = parts.findIndex((p) => p.role === "ORT");
				return choice(rng, {
					prompt: "Welches Satzglied ist die Ortsangabe?",
					material: sentence,
					answer: written(parts, front, oi),
					wrong: parts.map((_, i) => i).filter((i) => i !== oi && parts[i].role !== "P").map((i) => written(parts, front, i)),
					hint: "Frage: Wo? Wohin? Woher?",
					explanation: `„${parts[oi].mid}“ sagt, wo oder wohin. Das ist die Ortsangabe.`,
					key: `ort:${sentence}`,
				});
			},
			(rng) => {
				const [part, kind, question] = pick(rng, PLACE_TIME);
				return choice(rng, {
					prompt: "Ist das eine Ortsangabe oder eine Zeitangabe?",
					material: part,
					answer: kind,
					wrong: ["Ortsangabe", "Zeitangabe"],
					hint: "Passt die Frage Wo/Wohin/Woher oder die Frage Wann/Wie lange?",
					explanation: `Frage: ${question} → ${kind}.`,
					key: `ortzeit:${part}`,
				});
			},
		],
		2: [
			(rng) => {
				const [part, , question] = pick(rng, PLACE_TIME);
				return choice(rng, {
					prompt: "Mit welcher Frage findest du dieses Satzglied?",
					material: part,
					answer: question,
					wrong: ["Wo?", "Wohin?", "Woher?", "Wann?", "Wie lange?", "Seit wann?"].filter((q) => q !== question).slice(0, 3),
					hint: "Probiere jede Frage aus. Welche passt genau?",
					explanation: `„${part}“ antwortet auf die Frage „${question}“.`,
					key: `frage:${part}`,
				});
			},
			(rng) => {
				const [sentence, add, target] = pick(rng, EXTEND);
				return text({
					prompt: "Erweitere den Satz. Die Angabe soll ganz vorne stehen.",
					material: `${sentence} + ${add}`,
					accept: [target],
					hint: "Angabe vorne, dann das Prädikat an zweiter Stelle, dann der Rest. Großer Anfangsbuchstabe und Punkt!",
					explanation: `Richtig: ${target}`,
					key: `erweitern:${sentence}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 7 Sätze verbinden ---------- */

const KUPPLUNG: Record<string, [string, string, string]> = {
	// [order A first, order B first, meaning]
	und: [
		"Tinto geht schwimmen und das Wasser ist kalt.",
		"Das Wasser ist kalt und Tinto geht schwimmen.",
		"„und“ reiht nur aneinander. Kein Komma nötig.",
	],
	aber: [
		"Tinto geht schwimmen, aber das Wasser ist kalt.",
		"Das Wasser ist kalt, aber Tinto geht schwimmen.",
		"„aber“ zeigt einen Gegensatz. Davor steht ein Komma.",
	],
	denn: [
		"Tinto geht schwimmen, denn das Wasser ist kalt.",
		"Das Wasser ist kalt, denn Tinto geht schwimmen.",
		"„denn“ nennt einen Grund. Ergibt der Grund hier Sinn? Davor steht ein Komma.",
	],
	weil: [
		"Tinto geht schwimmen, weil das Wasser kalt ist.",
		"Das Wasser ist kalt, weil Tinto schwimmen geht.",
		"„weil“ nennt einen Grund. Das Verb wandert ans Ende! Davor steht ein Komma. Prüfe: Ergibt der Grund Sinn?",
	],
	obwohl: [
		"Tinto geht schwimmen, obwohl das Wasser kalt ist.",
		"Das Wasser ist kalt, obwohl Tinto schwimmen geht.",
		"„obwohl“ zeigt einen Gegensatz. Das Verb wandert ans Ende. Davor steht ein Komma. Prüfe: Ergibt der Satz Sinn?",
	],
};
const AFTER: Record<string, string> = {
	weil: "Nach „weil“ steht das Verb am Ende.",
	dass: "Nach „dass“ steht das Verb am Ende.",
	denn: "Nach „denn“ steht das Verb an zweiter Stelle.",
	aber: "„aber“ zeigt einen Gegensatz.",
};
/** Sentence with gap, right word, words that are wrong here, reason. */
const CONNECT: [string, string, string[], string][] = [
	["Ich ziehe eine Jacke an, ___ es ist kalt.", "denn", ["weil", "dass"], "„denn“ nennt den Grund, das Verb steht an zweiter Stelle."],
	["Ich ziehe eine Jacke an, ___ es kalt ist.", "weil", ["denn", "aber"], "„weil“ nennt den Grund, das Verb steht am Ende."],
	["Lea wollte ins Kino, ___ der Film war ausverkauft.", "aber", ["weil", "dass"], "Ins Kino wollen und ausverkauft sein ist ein Gegensatz."],
	["Möchtest du Tee ___ lieber Kakao?", "oder", ["weil", "dass"], "Bei einer Auswahl nimmst du „oder“."],
	["Tim weiß, ___ morgen Ferien sind.", "dass", ["weil", "denn"], "Nach „wissen“ folgt hier „dass“, das Verb steht am Ende."],
	["Wir bleiben drinnen, ___ es stark regnet.", "weil", ["denn", "aber"], "„weil“ nennt den Grund, das Verb „regnet“ steht am Ende."],
	["Oma liest vor ___ wir hören zu.", "und", ["weil", "dass"], "Zwei Dinge passieren nebeneinander. Nach „und“ bleibt das Verb an zweiter Stelle."],
	["Ben ist müde, ___ er spielt weiter.", "aber", ["weil", "dass"], "Müde sein und weiterspielen ist ein Gegensatz."],
];
/** [first, second, Bindewort, joined, the weil/dass sentence put in front]. */
const JOIN: [string, string, string, string, string?][] = [
	["Tim lacht.", "Der Film ist lustig.", "weil", "Tim lacht, weil der Film lustig ist.", "Weil der Film lustig ist, lacht Tim."],
	["Wir bleiben zu Hause.", "Es regnet.", "weil", "Wir bleiben zu Hause, weil es regnet.", "Weil es regnet, bleiben wir zu Hause."],
	["Lea ist froh.", "Sie hat Geburtstag.", "weil", "Lea ist froh, weil sie Geburtstag hat.", "Weil sie Geburtstag hat, ist Lea froh."],
	["Ich weiß.", "Tinto mag Brezen.", "dass", "Ich weiß, dass Tinto Brezen mag.", "Dass Tinto Brezen mag, weiß ich."],
	["Ben hofft.", "Die Sonne scheint morgen.", "dass", "Ben hofft, dass die Sonne morgen scheint.", "Dass die Sonne morgen scheint, hofft Ben."],
	["Der Hund bellt.", "Es klingelt.", "weil", "Der Hund bellt, weil es klingelt.", "Weil es klingelt, bellt der Hund."],
	// "aber" and "denn" keep their order: swapped, the sentence means something else.
	["Mia ist müde.", "Sie spielt weiter.", "aber", "Mia ist müde, aber sie spielt weiter."],
	["Ich nehme einen Schirm mit.", "Es regnet.", "denn", "Ich nehme einen Schirm mit, denn es regnet."],
];

const verbinden: Lesson = {
	id: "saetze-verbinden",
	stage: "bahnhof",
	title: "Sätze verbinden: die Kupplung",
	skill: "Du verbindest Sätze mit passenden Bindewörtern und setzt das Komma.",
	lehrplan: "D3/4 4.3: Sätze sinnvoll verknüpfen (Bindewörter)",
	bindings: ["4.3-10"],
	sticker: { emoji: "🪝", name: "Kupplung" },
	paragraphs: [
		"Bindewörter verbinden Sätze wie eine Kupplung zwei Waggons: und, oder, aber, denn, weil, dass. Jedes Bindewort gibt dem Satz einen anderen Sinn.",
		"„und“ reiht aneinander, „oder“ zeigt eine Wahl, „aber“ einen Gegensatz. „denn“ und „weil“ nennen einen Grund. Nach „weil“ und „dass“ wandert das Verb ans Ende: …, weil es regnet.",
		"Ein „weil“- oder „dass“-Satz darf auch vorne stehen: Weil es regnet, bleiben wir drinnen. Dann kommt das Verb des anderen Satzes gleich nach dem Komma.",
		"Vor aber, denn, weil und dass steht ein Komma, vor „und“ und „oder“ hier keins. Diese Kommaregel lernst du genau erst in der 5. Klasse. Tinto übt sie hier schon mit dir.",
	],
	example: {
		title: "Tinto kuppelt",
		lines: [
			"Es regnet. Wir bleiben drinnen.",
			"Wir bleiben drinnen, denn es regnet.  (Verb an 2. Stelle)",
			"Wir bleiben drinnen, weil es regnet.  (Verb am Ende)",
			"Weil es regnet, bleiben wir drinnen.  (weil-Satz vorne)",
			"Es regnet, aber wir gehen trotzdem raus.  (Gegensatz)",
		],
	},
	takeaway:
		"und (aneinander) · oder (Wahl) · aber (Gegensatz) · denn/weil (Grund) · dass. Komma vor aber, denn, weil, dass. Nach weil und dass steht das Verb am Ende.",
	terms: [
		{ term: "Bindewort", meaning: "verbindet Sätze: und, aber, weil …" },
		{ term: "Komma", meaning: "vor aber, denn, weil, dass" },
	],
	check: {
		wrong: "Ich bleibe drinnen, weil es regnet sehr.",
		explanation: "Nach „weil“ wandert das Verb ans Ende: …, weil es sehr regnet.",
	},
	workshop: {
		kind: "machine",
		title: "Die Satz-Kupplung",
		intro:
			"Zwei Satzwaggons: „Tinto geht schwimmen.“ und „Das Wasser ist kalt.“ Wähle eine Kupplung und die Reihenfolge. Schau, was mit Sinn, Komma und Verb passiert.",
		controls: [
			{ id: "wort", label: "Bindewort", options: Object.keys(KUPPLUNG) },
			{ id: "folge", label: "Reihenfolge", options: ["Schwimmen zuerst", "Wasser zuerst"] },
		],
		initial: { wort: "und", folge: "Schwimmen zuerst" },
		view: (v) => {
			const [a, b, note] = KUPPLUNG[v.wort];
			return {
				display: v.folge === "Schwimmen zuerst" ? a : b,
				note,
				found: `${v.wort}|${v.folge}`,
				tone: "ok",
			};
		},
		goals: [
			{
				id: "verb-ende",
				label: "Finde ein Bindewort, nach dem das Verb ans Satzende wandert.",
				reached: (s) => ["weil", "obwohl"].includes(s.values.wort),
			},
			{
				id: "gegensatz",
				label: "Zeige mit „aber“ einen Gegensatz und beginne mit dem Wasser-Satz.",
				reached: (s) => s.values.wort === "aber" && s.values.folge === "Wasser zuerst",
			},
			{
				id: "grund",
				label: "Probiere „denn“ und „weil“ beide aus: Beide nennen einen Grund.",
				reached: (s) =>
					s.found.some((f) => f.startsWith("denn|")) && s.found.some((f) => f.startsWith("weil|")),
			},
		],
	},
	generators: {
		1: [
			(rng) => {
				const [gap, right, wrong, why] = pick(rng, CONNECT);
				return choice(rng, {
					prompt: "Welches Bindewort passt?",
					material: gap,
					answer: right,
					wrong,
					hint: "Lies den Satz mit jedem Wort. Achte auch darauf, wo das Verb steht.",
					explanation: `${gap.replace("___", right)} ${why}`,
					mistakes: Object.fromEntries(wrong.map((w) => [w, AFTER[w] ?? why])),
					key: `binde:${gap}`,
				});
			},
			(rng) => {
				const [a, b, word, joined] = pick(rng, JOIN);
				const noComma = joined.replace(",", "");
				const wrongPlace = joined.replace(`, ${word} `, ` ${word}, `);
				return choice(rng, {
					prompt: "Wo steht das Komma richtig?",
					answer: joined,
					wrong: [noComma, wrongPlace],
					hint: "Das Komma steht vor dem Bindewort.",
					explanation: `Vor „${word}“ steht ein Komma: ${joined}`,
					key: `komma:${a}${b}`,
				});
			},
		],
		2: [
			(rng) => {
				const [a, b, word, joined, front] = pick(rng, JOIN);
				return text({
					prompt: `Verbinde die beiden Sätze mit „${word}“. Schreibe den ganzen Satz.`,
					material: `${a} ${b}`,
					accept: front ? [joined, front] : [joined],
					hint:
						word === "weil" || word === "dass"
							? `Komma vor „${word}“. Nach „${word}“ wandert das Verb ans Ende.`
							: `Komma vor „${word}“. Die Wortstellung bleibt gleich.`,
					explanation: front ? `Richtig: ${joined} Auch richtig: ${front}` : `Richtig: ${joined}`,
					mistakes: Object.fromEntries(
						[joined, front ?? ""].filter(Boolean).map((s) => [s.replace(",", ""), "Zwischen den beiden Sätzen fehlt das Komma."]),
					),
					key: `verbinde:${a}`,
				});
			},
			(rng): Task => {
				const [gap, right, wrong, why] = pick(rng, CONNECT);
				const correct = gap.replace("___", right);
				const broken = gap.replace("___", wrong[0]);
				return choice(rng, {
					prompt: "Welcher Satz ist richtig?",
					answer: correct,
					wrong: [broken],
					hint: "Prüfe Sinn und Wortstellung: Wo steht das Verb?",
					explanation: `${correct} – ${why}`,
					key: `richtig:${gap}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

export const BAHNHOF: Lesson[] = [satzarten, rede, satzglieder, subjektPraedikat, objekte, angaben, verbinden];
