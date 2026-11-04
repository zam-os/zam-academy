// Station 4 · Wörterschatz: der verbindliche Grundwortschatz 3/4 (LehrplanPLUS
// Deutsch 3/4, 4.4). Die Wörter stehen in grundwortschatz.ts. Sie werden hier
// geschrieben, nicht nur gewählt: Das ISB nennt häufiges Schreiben und sicheres
// Abrufen als die beiden Aufgaben des Grundwortschatzes.
import { choice, pick, shuffle, text } from "../exercises/tasks";
import type { Lesson, MachineView, MachineWorkshop, Rng, Task } from "../types";
import {
	type GroupId,
	groupOf,
	SOURCE_NOTE,
	spellable,
	wordbook,
	wordsIn,
} from "./grundwortschatz";
import { gaps, marks, slotWorkshop } from "./helpers";

/** Ein Wort aus den Gruppen, die falsche Schreibung als einzige Alternative. */
function spellingChoice(rng: Rng, ids: readonly GroupId[], prompt: string): Task {
	const word = pick(rng, spellable(ids));
	return choice(rng, {
		prompt,
		material: word.word === "Laib" ? "ein ___ Brot" : undefined,
		answer: word.word,
		wrong: [word.wrong],
		hint: groupOf(word.group).rule,
		explanation: `Richtig: ${word.word}. ${groupOf(word.group).rule}`,
		key: `schreibung:${word.word}`,
	});
}

/* ---------- 1 Wörter mit Regeln ---------- */

const RULE_GROUPS: GroupId[] = ["r", "ie", "doppel", "tz", "ck", "h"];
const RULE_WORDS = spellable(RULE_GROUPS);

/** Verschiebt die erste Trennstelle um einen Buchstaben: la-chen → lac-hen. */
function wrongSplits(hyphenated: string): string[] {
	const cut = hyphenated.indexOf("-");
	const letters = hyphenated.replace("-", "");
	const at = (position: number) =>
		`${letters.slice(0, position)}-${letters.slice(position)}`;
	return [at(cut + 1), ...(cut > 1 ? [at(cut - 1)] : [])];
}

const separable = wordsIn(["silben"]).filter((word) => word.hyphenated);
const whole = wordsIn(["silben"]).filter((word) => !word.hyphenated);

/** Satz mit Lücke; das Wort und sein Fehler stammen aus der Wortliste. */
const RULE_SENTENCES: [string, string][] = [
	["Brief", "Der ___ liegt schon auf dem Tisch."],
	["Zwiebel", "Beim Schneiden der ___ muss ich weinen."],
	["schwierig", "Die Aufgabe ist heute sehr ___."],
	["Tiere", "Im Zoo füttern wir die ___."],
	["Zimmer", "Mein ___ ist heute endlich aufgeräumt."],
	["schnell", "Der Hase läuft sehr ___."],
	["vergessen", "Ich habe mein Heft zu Hause ___."],
	["Platz", "Auf dem ___ steht ein großer Brunnen."],
	["plötzlich", "Es wurde ___ ganz dunkel."],
	["Glück", "Zum ___ hat der Regen aufgehört."],
	["Stück", "Möchtest du ein ___ Kuchen?"],
	["zurück", "Am Abend fahren wir nach Hause ___."],
	["Kühe", "Auf der Wiese stehen viele ___."],
	["Schuhe", "Ich ziehe meine neuen ___ an."],
	["Dorf", "Im ___ gibt es nur einen Bäcker."],
	["morgen", "Wir treffen uns ___ nach der Schule."],
	["kurz", "Die Pause war heute leider zu ___."],
	["Wurst", "Der Hund hat die ___ gestohlen."],
];

const regeln: Lesson = {
	id: "grundwortschatz-regeln",
	stage: "woerterschatz",
	title: "Schatzwörter mit Regeln",
	skill: "Du schreibst Wörter des Grundwortschatzes sicher, weil du die passende Regel kennst.",
	lehrplan: "D3/4 4.4: Grundwortschatz 3/4, phonologisches und silbisches Prinzip",
	bindings: ["4.4-01"],
	sticker: { emoji: "💎", name: "Schatzwort" },
	paragraphs: [
		"Der Grundwortschatz sind Wörter, die du in der 3. und 4. Klasse sicher schreiben lernst. Du brauchst sie immer wieder. Viele davon kannst du dir mit einer Regel herleiten, du musst sie also nicht einzeln auswendig lernen.",
		"Klingt der Selbstlaut lang, steht oft ie: Brief. Klingt er kurz, folgen oft zwei gleiche Mitlaute oder tz und ck: Zimmer, Platz, Stück. Das r nach einem Selbstlaut hörst du kaum, es steht trotzdem da: Dorf.",
		"Manchmal steht ein h zwischen zwei Silben. Du hörst es, wenn du deutlich sprichst: se-hen. In der kurzen Form bleibt es: die Kühe, die Kuh. Am Zeilenende trennst du Wörter nach Silben: Ge-schich-te. Schreibe die Wörter auch mit der Hand, das hilft deinem Wortgedächtnis.",
	],
	example: {
		title: "Tinto prüft „Stück“",
		lines: [
			"Das ü klingt kurz.",
			"Nach einem kurzen Selbstlaut steht ck statt k.",
			"Also: das Stück.",
			"Trennen geht hier nicht, das Wort hat nur eine Silbe.",
		],
	},
	takeaway:
		"Langes i: meistens ie. Kurzer Selbstlaut: doppelter Mitlaut, tz oder ck. Das r und das h zwischen zwei Silben hörst du, wenn du deutlich sprichst. Getrennt wird nach Silben.",
	terms: [
		{ term: "Grundwortschatz", meaning: "Wörter, die du sicher schreiben lernst, weil du sie oft brauchst" },
		{ term: "Wortgedächtnis", meaning: "dein Kopf merkt sich, wie ein Wort aussieht und sich schreiben lässt" },
	],
	wordbook: { groups: wordbook(["silben", "r", "ie", "doppel", "tz", "ck", "h"]), note: SOURCE_NOTE },
	check: {
		wrong: "Ges-chich-te",
		explanation: "Du trennst nach Silben. sch und ch bleiben zusammen: Ge-schich-te.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Die Schatzkarte",
			intro: "Auf Tintos Schatzkarte fehlen Buchstaben. Wähle bei jeder Lücke den richtigen. Sprich die Wörter vorher deutlich.",
			pens: [],
			puzzles: [
				gaps("ie", "Der Br{ie|i}f l{ie|i}gt t{ie|i}f unter der Zw{ie|i}bel.", "Langes i", "Klingt das i lang, schreibst du meistens ie."),
				gaps("kurz", "Im Zi{mm|m}er liegt ein Stü{ck|k} Papier, und der Pla{tz|z} ist noch frei.", "Kurzer Selbstlaut", "Nach einem kurzen Selbstlaut folgen zwei Mitlaute, tz oder ck."),
				gaps("r", "Mo{r|h}gen laufen wir zum Do{r|h}f, der Weg ist ku{r|h}z und gar nicht schwe{r|h} zu finden.", "Das leise r", "Sprich überdeutlich. Dann hörst du das r nach dem Selbstlaut."),
			],
		},
		[
			"Fülle den Satz mit dem langen i richtig aus.",
			"Fülle den Satz mit den kurzen Selbstlauten richtig aus.",
			"Fülle den Satz mit dem leisen r richtig aus.",
		],
	),
	generators: {
		1: [
			(rng) => spellingChoice(rng, RULE_GROUPS, "Welche Schreibung ist richtig?"),
			(rng) => {
				const word = pick(rng, separable);
				const right = word.hyphenated as string;
				return choice(rng, {
					prompt: "Wo trennst du das Wort am Zeilenende?",
					material: word.word,
					answer: right,
					wrong: wrongSplits(right),
					hint: "Sprich das Wort langsam und klatsche die Silben. ch und sch bleiben zusammen.",
					explanation: `Richtig: ${right}.`,
					key: `trennen:${word.word}`,
				});
			},
			(rng) => {
				const answer = pick(rng, whole);
				const others = shuffle(rng, separable).slice(0, 2);
				return choice(rng, {
					prompt: "Welches Wort kannst du nicht trennen?",
					answer: answer.word,
					wrong: others.map((word) => word.word),
					hint: "Klatsche die Silben. Bei einer Silbe gibt es nichts zu trennen. Ein einzelner Buchstabe bleibt nicht allein stehen.",
					explanation:
						answer.word === "oben"
							? "„oben“ trennst du nicht: Das o bliebe allein in der Zeile."
							: `„${answer.word}“ hat nur eine Silbe.`,
					key: `ganz:${answer.word}`,
				});
			},
		],
		2: [
			(rng) => {
				const word = pick(rng, RULE_WORDS);
				return text({
					prompt: "Schreibe das ganze Wort mit den fehlenden Buchstaben.",
					material: word.masked,
					accept: [word.word],
					hint: groupOf(word.group).rule,
					mistakes: { [word.wrong]: `Noch nicht. ${groupOf(word.group).rule}` },
					explanation: `Richtig: ${word.word}.`,
					key: `luecke:${word.word}`,
				});
			},
			(rng) => {
				const [right, sentence] = pick(rng, RULE_SENTENCES);
				const word = RULE_WORDS.find((w) => w.word === right);
				if (!word) throw new Error(`${right} fehlt in der Wortliste`);
				return text({
					prompt: "Das markierte Wort ist falsch geschrieben. Schreibe es richtig auf.",
					material: sentence.replace("___", `[[${word.wrong}]]`),
					accept: [right],
					hint: groupOf(word.group).rule,
					mistakes: { [word.wrong]: "Das ist noch die falsche Schreibung aus dem Satz." },
					explanation: `Richtig: ${sentence.replace("___", right)}`,
					key: `fehler:${right}`,
				});
			},
			(rng) => {
				const word = pick(rng, separable);
				const right = word.hyphenated as string;
				return text({
					prompt: "Schreibe das Wort mit allen Trennstrichen auf.",
					material: word.word,
					accept: [right],
					hint: "Klatsche die Silben und setze zwischen zwei Silben einen Strich: Ta-sche.",
					mistakes: { [word.word]: "Setze zwischen die Silben einen Trennstrich." },
					explanation: `Richtig: ${right}.`,
					key: `striche:${word.word}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 2 Wörter, die sich verändern ---------- */

const FORM_GROUPS: GroupId[] = ["verhaertung", "umlaut", "kombination", "praeteritum"];
const FORM_WORDS = spellable(FORM_GROUPS);
const PAST_WORDS = spellable(["praeteritum"]);

/** Gebeugte Wörter: Satz, richtige Form, falsche Formen. */
const INFLECTED: [string, string, string[]][] = [
	["Wir treffen uns ___ Montag.", "am", ["an", "im"]],
	["Ich lehne mich ___ die Wand.", "an", ["am", "im"]],
	["Ich helfe ___ Bruder beim Lernen.", "deinem", ["deinen", "dein"]],
	["Hast du ___ Hund schon gefüttert?", "deinen", ["deinem", "dein"]],
	["Tinto gibt ___ Kind einen Stift.", "dem", ["den", "das"]],
	["Ich sehe ___ Hund im Garten.", "den", ["dem", "der"]],
	["In ___ Haus wohnt meine Oma.", "diesem", ["diesen", "dies"]],
	["Kennst du ___ Mann?", "diesen", ["diesem", "dies"]],
	["Sie schreibt mit ___ Stift.", "einem", ["einen", "ein"]],
	["Ich kaufe ___ Apfel.", "einen", ["einem", "ein"]],
	["Wir spielen mit ___ Ball.", "eurem", ["euren", "euer"]],
	["Ich habe ___ Lehrer gesehen.", "euren", ["eurem", "euer"]],
	["Mit ___ Herzen freue ich mich.", "ganzem", ["ganzen", "ganz"]],
	["Wir bleiben den ___ Tag draußen.", "ganzen", ["ganzem", "ganz"]],
	["Der Hund folgt ___ überallhin. (dem Jungen)", "ihm", ["ihn", "ihnen"]],
	["Ich rufe ___ gleich an. (den Jungen)", "ihn", ["ihm", "ihnen"]],
	["Ich gebe ___ das Buch. (den Kindern)", "ihnen", ["ihn", "ihm"]],
	["Lea zeigt ___ Bild. (das Bild von ihr)", "ihr", ["ihre", "ihrem"]],
	["Lea ruft ___ Freundin an.", "ihre", ["ihr", "ihren"]],
	["Das ist Lea mit ___ Fahrrad.", "ihrem", ["ihren", "ihre"]],
	["Lea sucht ___ Schlüssel.", "ihren", ["ihrem", "ihre"]],
	["Die Kinder spielen ___ Garten.", "im", ["in", "ins"]],
	["Wir gehen morgen ___ die Schule.", "in", ["im", "am"]],
	["Ich fahre an ___ Tag mit dem Rad.", "jedem", ["jeden", "jede"]],
	["Tinto übt fast ___ Tag.", "jeden", ["jedem", "jede"]],
	["Auf ___ Stuhl ist noch Platz.", "keinem", ["keinen", "kein"]],
	["Heute habe ich ___ Hunger.", "keinen", ["keinem", "kein"]],
	["Ich spiele mit ___ Bruder.", "meinem", ["meinen", "mein"]],
	["Ich suche ___ Bleistift.", "meinen", ["meinem", "mein"]],
	["Kannst du ___ bitte abholen?", "mich", ["mir", "mein"]],
	["Kannst du ___ bitte helfen?", "mir", ["mich", "mein"]],
	["Tim fährt mit ___ Rad.", "seinem", ["seinen", "sein"]],
	["Tim sucht ___ Ball.", "seinen", ["seinem", "sein"]],
	["Wir wohnen ___ drei Jahren hier.", "seit", ["seid", "seidt"]],
	["Sie wohnt in ___ Haus.", "unserem", ["unseren", "uns"]],
	["Sie besucht ___ Lehrer.", "unseren", ["unserem", "uns"]],
	["Ich komme gerade ___ Sport.", "vom", ["von", "vor"]],
	["Das Geschenk ist ___ meiner Oma.", "von", ["vom", "vor"]],
	["Mit ___ Stift schreibst du?", "welchem", ["welchen", "welche"]],
	["___ Film möchtest du sehen?", "Welchen", ["Welchem", "Welche"]],
	["___ gehört diese Tasche?", "Wem", ["Wen", "Wer"]],
	["___ hast du gestern getroffen?", "Wen", ["Wem", "Wer"]],
	["Wir gehen ___ Oma.", "zu", ["zum", "zur"]],
	["Ich fahre ___ Bahnhof.", "zum", ["zur", "zu"]],
	["Ich gehe ___ Schule.", "zur", ["zum", "zu"]],
];

/** Lücke im Satz für Wörter mit Auslaut: Das Wort selbst darf nicht dastehen. */
const WORD_END_SENTENCES: [string, string][] = [
	["Abend", "Am Aben_ gehen wir früh ins Bett."],
	["abends", "Wir essen aben_s gemeinsam."],
	["Berg", "Wir klettern auf einen hohen Ber_."],
	["fremd", "In der neuen Stadt ist mir alles frem_."],
	["Geld", "Für das Eis brauche ich noch Gel_."],
	["rund", "Der Ball ist run_."],
	["erlaubt", "Das ist hier nicht erlau_t."],
	["liebt", "Meine Katze lie_t warme Plätze."],
	["liegt", "Das Heft lie_t auf dem Tisch."],
	["steigt", "Der Vogel stei_t hoch in die Luft."],
	["wird", "Es wir_ heute noch regnen."],
];

/** Veränderte Wörter: Aufforderung, Bezugswort, Antwort. */
const CHANGED: [string, string, string][] = [
	["Schreibe die Mehrzahl.", "der Arzt", "Ärzte"],
	["Schreibe die Mehrzahl.", "das Band", "Bänder"],
	["Schreibe die Mehrzahl.", "die Hand", "Hände"],
	["Schreibe die Mehrzahl.", "das Land", "Länder"],
	["Schreibe die Mehrzahl.", "der Mann", "Männer"],
	["Schreibe die Mehrzahl.", "das Rad", "Räder"],
	["Schreibe die Mehrzahl.", "der Wald", "Wälder"],
	["Schreibe die Mehrzahl.", "der Ast", "Äste"],
	["Schreibe die Mehrzahl.", "die Nacht", "Nächte"],
	["Schreibe die Mehrzahl.", "der Saft", "Säfte"],
	["Steigere das Wort.", "alt", "älter"],
	["Steigere das Wort.", "lang", "länger"],
	["Steigere das Wort.", "stark", "stärker"],
	["Schreibe die Form mit „er“.", "laufen", "läuft"],
	["Schreibe die Form mit „er“.", "lassen", "lässt"],
	["Wie heißt die Person?", "backen", "Bäcker"],
	["Wie heißt die Person?", "kaufen", "Verkäufer"],
];

const PAST: Record<string, string> = {
	bleiben: "blieben",
	gehen: "gingen",
	essen: "aßen",
	sitzen: "saßen",
	können: "konnten",
	schneiden: "schnitten",
	rufen: "riefen",
	tragen: "trugen",
};

function pastView(values: Record<string, string>): MachineView {
	const verb = values.verb;
	if (values.zeit === "heute")
		return {
			display: `Heute: wir ${verb}`,
			note: "Stelle die Maschine auf „gestern“ und schau, was mit dem Selbstlaut passiert.",
		};
	const form = PAST[verb] ?? verb;
	return {
		display: `Gestern: wir ${form}`,
		note: pastNote(form),
		found: form,
		tone: "ok",
	};
}

function pastNote(form: string): string {
	if (form.includes("ie")) return "Das i klingt lang, also schreibst du ie.";
	if (form.includes("ß")) return "Das a klingt lang und das s scharf, also schreibst du ß.";
	if (/nn|tt/.test(form)) return "Der Selbstlaut klingt kurz, also folgen zwei gleiche Mitlaute.";
	return "Der Selbstlaut hat sich geändert. Sprich die Form deutlich.";
}

const pastMachine: MachineWorkshop = {
	kind: "machine",
	title: "Die Gestern-Maschine",
	intro: "Wähle ein Verb und stelle die Zeit um. Schreibe die neue Form danach auf einen Zettel.",
	controls: [
		{ id: "verb", label: "Verb", options: Object.keys(PAST) },
		{ id: "zeit", label: "Zeit", options: ["heute", "gestern"] },
	],
	initial: { verb: "bleiben", zeit: "heute" },
	view: pastView,
	goals: [
		{
			id: "ie",
			label: "Finde eine Form mit ie.",
			reached: (state) => state.found.some((form) => form.includes("ie")),
		},
		{
			id: "sz",
			label: "Finde eine Form mit ß.",
			reached: (state) => state.found.some((form) => form.includes("ß")),
		},
		{
			id: "doppelt",
			label: "Finde eine Form mit doppeltem Mitlaut.",
			reached: (state) => state.found.some((form) => /nn|tt/.test(form)),
		},
	],
};

const formen: Lesson = {
	id: "grundwortschatz-formen",
	stage: "woerterschatz",
	title: "Schatzwörter, die sich verändern",
	skill: "Du findest die richtige Schreibung, wenn ein Wort seine Form ändert.",
	lehrplan: "D3/4 4.4: Grundwortschatz 3/4, morphologisches und grammatisches Prinzip",
	bindings: ["4.4-01"],
	sticker: { emoji: "🔮", name: "Verwandlungswort" },
	paragraphs: [
		"Viele Wörter verändern ihre Form: Berg und Berge, Hand und Hände, gehen und gingen. Der Wortstamm hilft dir: Ist das Wortende unklar, verlängerst du das Wort. Bei ä oder äu suchst du ein verwandtes Wort mit a oder au.",
		"Im Präteritum ändern viele Verben ihren Selbstlaut: wir bleiben, wir blieben. Achte darauf, ob er lang oder kurz klingt. Lang: wir liefen. Kurz: wir schnitten.",
		"Kleine Wörter verändern sich im Satz: dem oder den, mir oder mich, zum oder zur. Welche Form passt, hängt vom ganzen Satz ab. Darum liest du den Satz immer zu Ende.",
	],
	example: {
		title: "Tinto verwandelt Wörter",
		lines: [
			"Hand oder Hant? Verlängern: die Hände → d",
			"Hände oder Hende? Ableiten: die Hand → ä",
			"wir gehen → gestern: wir gingen",
			"Ich helfe dem Mann. Ich sehe den Mann.",
		],
	},
	takeaway:
		"Verlängere bei unklarem Wortende, leite ä und äu von a und au ab und achte im Präteritum auf den Selbstlaut. Kleine Wörter prüfst du im ganzen Satz.",
	terms: [
		{ term: "Präteritum", meaning: "die Zeitform für Vergangenes in Erzählungen: wir gingen" },
		{ term: "verlängern", meaning: "das Wort so verändern, dass du das Wortende hörst: Berg, Berge" },
		{ term: "ableiten", meaning: "ein verwandtes Wort suchen: Hände kommt von Hand" },
	],
	wordbook: { groups: wordbook(["verhaertung", "umlaut", "flexion", "kombination", "praeteritum"]), note: SOURCE_NOTE },
	check: {
		wrong: "wir gehten",
		explanation: "gehen ändert im Präteritum den Wortstamm: wir gingen.",
	},
	workshop: pastMachine,
	generators: {
		1: [
			(rng) => {
				const word = pick(rng, FORM_WORDS);
				return choice(rng, {
					prompt: "Welche Form ist richtig geschrieben?",
					material: `${word.clue} → ?`,
					answer: word.word,
					wrong: [word.wrong],
					hint: groupOf(word.group).rule,
					explanation: `Richtig: ${word.clue} → ${word.word}. ${groupOf(word.group).rule}`,
					key: `form:${word.word}`,
				});
			},
			(rng) => {
				const [sentence, answer, wrong] = pick(rng, INFLECTED);
				return choice(rng, {
					prompt: "Welches Wort passt in den Satz?",
					material: sentence,
					answer,
					wrong,
					hint: groupOf("flexion").rule,
					explanation: `Richtig: ${sentence.replace("___", answer)}`,
					key: `satzwort:${sentence}`,
				});
			},
		],
		2: [
			(rng) => {
				const word = pick(rng, PAST_WORDS);
				return text({
					prompt: "Setze das Verb ins Präteritum und schreibe nur das fehlende Wort.",
					material: `Gestern ___ wir. (${word.clue})`,
					accept: [word.word, `wir ${word.word}`],
					hint: groupOf("praeteritum").rule,
					mistakes: {
						[word.wrong]: "Fast. Achte darauf, ob der Selbstlaut kurz oder lang klingt.",
						[word.clue as string]: "Das ist die Gegenwart. Was haben wir gestern gemacht?",
					},
					explanation: `Richtig: wir ${word.word}.`,
					key: `praeteritum:${word.clue}`,
				});
			},
			(rng) => {
				const [prompt, clue, answer] = pick(rng, CHANGED);
				const word = FORM_WORDS.find((w) => w.word === answer);
				return text({
					prompt,
					material: clue,
					accept: prompt.includes("„er“") ? [answer, `er ${answer}`] : [answer],
					hint: "Suche das a oder au im verwandten Wort. Daraus wird ä oder äu.",
					mistakes: word ? { [word.wrong]: "Leite vom verwandten Wort ab: Aus a wird ä, aus au wird äu." } : undefined,
					explanation: `Richtig: ${clue} → ${answer}.`,
					key: `veraendert:${answer}`,
				});
			},
			(rng) => {
				const [right, sentence] = pick(rng, WORD_END_SENTENCES);
				const word = FORM_WORDS.find((w) => w.word === right);
				return text({
					prompt: "Schreibe das Wort mit der Lücke vollständig auf.",
					material: sentence,
					accept: [right],
					hint: "Verlängere das Wort. Dann hörst du, welcher Buchstabe fehlt.",
					mistakes: word ? { [word.wrong]: "Verlängere das Wort. Was hörst du dann?" } : undefined,
					explanation: `Richtig: ${right}. ${groupOf("verhaertung").rule}`,
					key: `wortende:${right}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 3 Merkwörter ---------- */

const MEMORY_GROUPS: GroupId[] = ["haeufig", "sz", "ch", "v", "y", "ks", "zz", "dt", "dehnung", "doppelvokal", "ae", "i", "ai"];
const MEMORY_WORDS = spellable(MEMORY_GROUPS);
const FREQUENT_WORDS = spellable(["haeufig"]);

const FREQUENT: [string, string][] = [
	["ab", "Heute fährt der Zug _b Gleis drei."],
	["bin", "Ich b_n heute sehr müde."],
	["bis", "Warte hier, b_s ich wiederkomme."],
	["bist", "Du b_st heute früh dran."],
	["dann", "Erst lernen wir, d___ spielen wir."],
	["hier", "Komm h__r zu mir!"],
	["hin", "Wo gehst du denn h_n?"],
	["immer", "Im Sommer ist es _mmer warm."],
	["ins", "Heute gehen wir _ns Kino."],
	["man", "Hier darf m_n nicht rennen."],
	["nicht", "Ich kann das noch n___t."],
	["nichts", "Im Kühlschrank ist n_____ mehr."],
	["nie", "Das habe ich n__ gesagt."],
	["nur", "Ich habe n_r noch einen Stift."],
	["ob", "Weißt du, _b es morgen regnet?"],
	["oft", "Wir gehen _ft ins Schwimmbad."],
	["sehr", "Der Kuchen schmeckt s__r gut."],
	["voll", "Das Glas ist bis oben v___."],
	["wann", "Weißt du, w___ die Schule anfängt?"],
	["warum", "Sag mir, w_rum du weinst."],
	["wenig", "Wir haben heute w___g Zeit."],
	["wie", "Sag mir, w__ du heißt."],
	["wieder", "Morgen scheint w___er die Sonne."],
	["zu", "Ich gehe _u meiner Tante."],
	["zuletzt", "Wer kommt z___tzt an die Reihe?"],
	["zusammen", "Wir spielen z___mmen Fußball."],
];

const SPECIAL: [string, string][] = [
	["außer", "Alle kommen, au_er Tim."],
	["draußen", "Wir spielen heute dr___en."],
	["heißen", "Wie h___en deine Eltern?"],
	["Straße", "Die Str__e ist sehr breit."],
	["Christ", "Ein Ch____ glaubt an Jesus."],
	["vielleicht", "Morgen schneit es v_____icht."],
	["vier", "Ein Hund hat _ier Beine."],
	["Handy", "Mein Hand_ ist kaputt."],
	["Fuchs", "Der F___s schleicht durch den Wald."],
	["links", "Biege an der Ampel l___s ab."],
	["Taxi", "Wir fahren mit dem Ta_i zum Bahnhof."],
	["Text", "Ich lese einen langen Te_t."],
	["sechs", "Ein Würfel hat s___s Seiten."],
	["Pizza", "Heute gibt es Pi__a zum Essen."],
	["Skizze", "Zeichne zuerst eine Sk___e."],
	["Stadt", "München ist eine große St___."],
	["verwandt", "Tim und Lea sind miteinander verw___t."],
	["erzählen", "Oma will uns ein Märchen er___len."],
	["fahren", "Wir f___en mit dem Bus."],
	["wahr", "Ist diese Geschichte w___?"],
	["zehn", "Ich habe z___ Finger."],
	["Haar", "Lea hat langes H__r."],
	["Meer", "Im Urlaub baden wir im M__r."],
	["Schnee", "Im Winter fällt Schn__."],
	["See", "Wir schwimmen im S__."],
	["Käfer", "Ein K_fer krabbelt über den Stein."],
	["Käfig", "Der Vogel sitzt im K_fig."],
	["Märchen", "Oma liest uns ein M_rchen vor."],
	["Tiger", "Der T_ger lebt in Asien."],
	["Maschine", "Die Masch_ne macht viel Lärm."],
	["Familie", "Meine Fam_lie ist groß."],
	["Laib", "Ich kaufe einen L__b Brot."],
];

/** Besonderheiten, die das Kind benennen kann, und ihre Wörter. */
const KINDS: GroupId[] = ["sz", "ks", "dt", "dehnung", "doppelvokal", "i"];

const merkwoerter: Lesson = {
	id: "grundwortschatz-merkwoerter",
	stage: "woerterschatz",
	title: "Merkwörter im Schatz",
	skill: "Du merkst dir Wörter, für die keine Regel hilft, und schlägst sie im Zweifel nach.",
	lehrplan: "D3/4 4.4: Grundwortschatz 3/4, Häufigkeitswortschatz und Merkwörter",
	bindings: ["4.4-01"],
	sticker: { emoji: "👑", name: "Merkwort-Krone" },
	paragraphs: [
		"Nicht jedes Wort lässt sich mit einer Regel erklären. Bei Stadt, vielleicht oder Haar hilft dir keine Regel. Solche Wörter heißen Merkwörter: Du prägst dir ein, wie sie aussehen.",
		"Kleine Wörter wie immer, nicht oder wieder brauchst du in fast jedem Text. Wenn du sie oft schreibst, kommen sie irgendwann von allein. Dann hat dein Kopf mehr Platz für schwierigere Wörter.",
		"So übst du ein Merkwort: Schau es genau an, decke es ab, schreibe es auf und vergleiche. Bist du später unsicher, schlägst du im Wörterbuch nach. Das machen auch Erwachsene.",
	],
	example: {
		title: "Tinto merkt sich „Stadt“",
		lines: [
			"Anschauen: Stadt, mit dt am Ende.",
			"Abdecken und aufschreiben.",
			"Vergleichen: Stimmt jeder Buchstabe?",
			"Unsicher? Im Wörterbuch nachschlagen.",
		],
	},
	takeaway:
		"Merkwörter lernst du durch häufiges Schreiben: anschauen, abdecken, aufschreiben, vergleichen. Bist du unsicher, schlägst du im Wörterbuch nach.",
	terms: [
		{ term: "Merkwort", meaning: "ein Wort, dessen Schreibung du dir einprägen musst" },
		{ term: "Dehnungs-h", meaning: "ein stummes h, das den Selbstlaut davor lang macht: fahren" },
		{ term: "doppelter Selbstlaut", meaning: "zwei gleiche Selbstlaute für einen langen Laut: Haar, See" },
	],
	wordbook: { groups: wordbook(MEMORY_GROUPS), note: SOURCE_NOTE },
	check: {
		wrong: "Mitlautverdopplung",
		explanation: "In Haar, Meer und Schnee steht der Selbstlaut doppelt. Das ist keine Regel, du merkst dir diese Wörter.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Der Merkwort-Sortierer",
			intro: "Wähle einen Stift und tippe die Wörter an, die dazu passen. Jedes Wort bekommt eine Farbe.",
			pens: [
				{ value: "DS", label: "doppelter Selbstlaut", colour: "purple" },
				{ value: "DH", label: "Dehnungs-h", colour: "blue" },
				{ value: "SZ", label: "ß", colour: "green" },
				{ value: "KS", label: "ks-Laut", colour: "orange" },
			],
			puzzles: [
				marks("lang", "Haar|DS zehn|DH Schnee|DS fahren|DH", "Lange Selbstlaute", "Steht der Selbstlaut doppelt oder folgt ein stummes h?"),
				marks("scharf", "Straße|SZ Meer|DS wahr|DH außer|SZ", "Dazu das ß", "Das ß steht nach einem langen Selbstlaut oder ei, au, eu."),
				marks("alle", "Fuchs|KS draußen|SZ See|DS Taxi|KS erzählen|DH Text|KS", "Alle vier", "Der ks-Laut kann chs oder x geschrieben werden."),
			],
		},
		[
			"Sortiere die Wörter mit langem Selbstlaut.",
			"Sortiere die Wörter mit dem ß dazu.",
			"Sortiere die Wörter mit allen vier Stiften.",
		],
	),
	generators: {
		1: [
			(rng) => spellingChoice(rng, MEMORY_GROUPS, "Welches Merkwort ist richtig geschrieben?"),
			(rng) => {
				const kind = pick(rng, KINDS);
				const word = pick(rng, spellable([kind]));
				const others = shuffle(rng, KINDS.filter((k) => k !== kind)).slice(0, 2);
				return choice(rng, {
					prompt: "Welche Besonderheit hat das Wort?",
					material: word.word,
					answer: groupOf(kind).title,
					wrong: others.map((k) => groupOf(k).title),
					hint: "Schau dir die schwierige Stelle im Wort genau an.",
					explanation: `„${word.word}“ gehört zu: ${groupOf(kind).title}.`,
					key: `besonderheit:${word.word}`,
				});
			},
		],
		2: [
			(rng) => {
				const [right, sentence] = pick(rng, FREQUENT);
				const word = FREQUENT_WORDS.find((w) => w.word === right);
				return text({
					prompt: "Ergänze das kleine Wort und schreibe es ganz auf.",
					material: sentence,
					accept: [right],
					hint: "Lies den Satz. Dieses Wort brauchst du sehr oft.",
					mistakes: word ? { [word.wrong]: "Fast. Schau dir die Stelle im Wort noch einmal genau an." } : undefined,
					explanation: `Richtig: ${right}.`,
					key: `klein:${right}`,
				});
			},
			(rng) => {
				const [right, sentence] = pick(rng, SPECIAL);
				const word = MEMORY_WORDS.find((w) => w.word === right);
				return text({
					prompt: "Schreibe das Merkwort mit der Lücke vollständig auf.",
					material: sentence,
					accept: [right],
					hint: word ? groupOf(word.group).rule : "Dieses Wort merkst du dir.",
					mistakes: word ? { [word.wrong]: `Noch nicht. ${groupOf(word.group).rule}` } : undefined,
					explanation: `Richtig: ${right}.`,
					key: `merkwort:${right}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

export const WOERTERSCHATZ: Lesson[] = [regeln, formen, merkwoerter];
