// Station 4 · Wörterschatz: der verbindliche Grundwortschatz 3/4 (LehrplanPLUS
// Deutsch 3/4, 4.4). Die Wörter stehen in grundwortschatz.ts. Sie werden hier
// geschrieben, nicht nur gewählt: Das ISB nennt häufiges Schreiben und sicheres
// Abrufen als die beiden Aufgaben des Grundwortschatzes.
//
// Getippte Wörter stehen immer in einem Satz: Eine Lücke allein ließe oft mehrere
// Wörter zu (Schu… passt auch zu Schule). In den Sätzen steht ___ für das Wort mit
// seiner Lücke; „…“ verrät nicht, wie viele Buchstaben fehlen.
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

type SpellableWord = ReturnType<typeof spellable>[number];

function wordOf(words: SpellableWord[], right: string): SpellableWord {
	const word = words.find((w) => w.word === right);
	if (!word) throw new Error(`${right} fehlt in der Wortliste`);
	return word;
}

/** Ein Wort aus den Gruppen, die falsche Schreibung als einzige Alternative. */
function spellingChoice(rng: Rng, words: SpellableWord[], prompt: string): Task {
	const word = pick(rng, words);
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

/** Das Wort in seinem Satz ergänzen und ganz aufschreiben. */
function gapInSentence(
	rng: Rng,
	table: readonly (readonly [string, string])[],
	words: SpellableWord[],
	prompt: string,
	key: string,
): Task {
	const [right, sentence] = pick(rng, table);
	const word = wordOf(words, right);
	const rule = groupOf(word.group).rule;
	return text({
		prompt,
		material: sentence.replace("___", word.masked),
		accept: [right],
		hint: rule,
		mistakes: { [word.wrong]: rule },
		explanation: `Richtig: ${sentence.replace("___", right)}`,
		key: `${key}:${right}`,
	});
}

const GAP_PROMPT = "Schreibe das Wort mit der Lücke ganz auf.";

/* ---------- 1 Wörter mit Regeln ---------- */

const RULE_GROUPS: GroupId[] = ["r", "ie", "doppel", "tz", "ck", "h"];
const RULE_WORDS = spellable(RULE_GROUPS);

/** Verschiebt die erste Trennstelle um einen Buchstaben: la-chen → lac-hen. */
function wrongSplits(hyphenated: string): string[] {
	const cut = hyphenated.indexOf("-");
	const letters = hyphenated.replace("-", "");
	const at = (position: number) =>
		`${letters.slice(0, position)}-${letters.slice(position)}`;
	return [at(cut + 1), at(cut - 1)];
}

const separable = wordsIn(["silben"]).filter((word) => word.hyphenated);
const whole = wordsIn(["silben"]).filter((word) => !word.hyphenated);

/** Jedes Wort der Regel-Gruppen in einem Satz. */
const RULE_SENTENCES: [string, string][] = [
	["Arm", "Ich habe mir den ___ gebrochen."],
	["Dorf", "Im ___ gibt es nur einen Bäcker."],
	["dort", "Der Ball liegt ___ hinten."],
	["Eltern", "Meine ___ holen mich ab."],
	["Erde", "Die ___ dreht sich um die Sonne."],
	["erst", "Wir essen ___ nach dem Spielen."],
	["gern", "Ich spiele sehr ___ Fußball."],
	["gestern", "Wo warst du ___ den ganzen Tag?"],
	["kurz", "Die Pause war heute leider zu ___."],
	["merken", "Diese Zahl kann ich mir gut ___."],
	["morgen", "Wir treffen uns ___ nach der Schule."],
	["schwer", "Der Koffer ist sehr ___."],
	["sofort", "Komm bitte ___ her!"],
	["stark", "Der Riese ist sehr ___."],
	["Tür", "Bitte mach die ___ zu."],
	["werfen", "Ich kann den Ball weit ___."],
	["Wurst", "Der Hund hat die ___ gestohlen."],
	["Beispiel", "Nenne mir ein ___ für ein Nomen."],
	["Brief", "Der ___ liegt schon auf dem Tisch."],
	["Briefe", "Oma schreibt uns lange ___."],
	["geschrieben", "Ich habe einen Zettel ___."],
	["liest", "Lea ___ gerade ein Buch."],
	["nie", "Jetzt oder ___!"],
	["niemals", "Das würde ich ___ wieder tun."],
	["riechen", "Diese Rosen ___ gut."],
	["riecht", "Die Suppe ___ lecker."],
	["schieben", "Wir müssen das Auto ___."],
	["schiebt", "Tim ___ sein Fahrrad."],
	["schwierig", "Die Aufgabe ist heute sehr ___."],
	["tief", "Der See ist sehr ___."],
	["tiefer", "Der Brunnen ist noch ___ als der See."],
	["Tier", "Mein liebstes ___ ist der Igel."],
	["Tiere", "Im Zoo füttern wir die ___."],
	["verlieren", "Ich will meinen Schlüssel nicht ___."],
	["ziehen", "Zwei Pferde ___ den Wagen."],
	["zieht", "Der Hund ___ an der Leine."],
	["zielen", "Beim Werfen musst du gut ___."],
	["zielt", "Tim ___ auf das Tor."],
	["Zwiebel", "Beim Schneiden der ___ muss ich weinen."],
	["dumm", "Das finde ich wirklich ___."],
	["essen", "Wir ___ heute Nudeln."],
	["kommen", "Wann ___ deine Eltern?"],
	["schlimm", "Mein Schnupfen ist nicht ___."],
	["schwimmen", "Im Sommer ___ wir im See."],
	["schnell", "Der Hase läuft sehr ___."],
	["stellen", "Wir ___ die Stühle auf den Tisch."],
	["vergessen", "Ich habe mein Heft zu Hause ___."],
	["Zimmer", "Mein ___ ist endlich aufgeräumt."],
	["zusammen", "Wir spielen heute ___ im Hof."],
	["Platz", "Auf dem ___ steht ein großer Brunnen."],
	["Pfütze", "Das Kind springt in die ___."],
	["plötzlich", "Es wurde ___ ganz dunkel."],
	["schützen", "Helme ___ den Kopf."],
	["Glück", "Zum ___ hat der Regen aufgehört."],
	["glücklich", "Mit dem neuen Hund bin ich sehr ___."],
	["Schreck", "Vor ___ ließ ich die Tasse fallen."],
	["erschrecken", "Der Knall kann uns ___."],
	["Stück", "Möchtest du ein ___ Kuchen?"],
	["verstecken", "Wir ___ uns hinter dem Baum."],
	["zurück", "Am Abend fahren wir nach Hause ___."],
	["blühen", "Im Frühling ___ die Tulpen."],
	["drehen", "Die Räder ___ sich schnell."],
	["gehen", "Wir ___ heute in den Wald."],
	["Kuh", "Die ___ gibt Milch."],
	["Kühe", "Auf der Wiese stehen viele ___."],
	["Schuh", "An meinem ___ ist ein Loch."],
	["Schuhe", "Ich ziehe meine neuen ___ an."],
	["sehen", "Von hier ___ wir das Meer."],
	["stehen", "Wir ___ vor der Tür."],
	["Zeh", "Mein großer ___ tut weh."],
	["Zehen", "An jedem Fuß habe ich fünf ___."],
];

/** Wörter mit einer Silbe und „oben“: Satz mit dem Wortanfang als Hilfe. */
const WHOLE_SENTENCES: [string, string][] = [
	["Ding", "Was ist das für ein Di…?"],
	["Fisch", "Ein Fi… schwimmt im Teich."],
	["gleich", "Ich komme gl… wieder."],
	["Hals", "Mir tut der Ha… weh."],
	["Licht", "Mach bitte das Li… an."],
	["Loch", "Ein Lo… ist in meiner Socke."],
	["Luft", "Frische Lu… tut uns gut."],
	["Mensch", "Jeder Me… braucht Schlaf."],
	["Milch", "Die Mi… steht im Kühlschrank."],
	["neu", "Das Fahrrad ist ne… und glänzt."],
	["oben", "Die Katze sitzt ob… auf dem Schrank."],
	["reich", "Der König ist rei… und mächtig."],
	["schlecht", "Das Wetter ist schl… und kalt."],
	["Stein", "Ein großer St… liegt im Weg."],
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
		"Klingt das i lang, steht meistens ie: Brief. Klingt ein Selbstlaut kurz, folgen oft zwei gleiche Mitlaute oder tz und ck: Zimmer, Platz, Stück. Das r nach einem Selbstlaut hörst du kaum, es steht trotzdem da: Dorf.",
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
			(rng) => spellingChoice(rng, RULE_WORDS, "Welche Schreibung ist richtig?"),
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
			(rng) => gapInSentence(rng, RULE_SENTENCES, RULE_WORDS, GAP_PROMPT, "luecke"),
			(rng) => {
				const [right, sentence] = pick(rng, RULE_SENTENCES);
				const word = wordOf(RULE_WORDS, right);
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
			(rng) => {
				const [right, sentence] = pick(rng, WHOLE_SENTENCES);
				return text({
					prompt: "Ergänze das Wort im Satz und schreibe es ganz auf.",
					material: sentence,
					accept: [right],
					hint: "Lies den ganzen Satz. Der Wortanfang steht schon da.",
					explanation: `Richtig: ${right}.`,
					key: `satzwort:${right}`,
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

/**
 * Gebeugte Wörter: Satz, richtige Form, falsche Formen. Jede Form der Liste ist
 * mindestens einmal die richtige Antwort, damit die kurze Form nie als falsch gilt.
 */
const INFLECTED: [string, string, string[]][] = [
	["Wir treffen uns ___ Montag.", "am", ["an", "im"]],
	["Ich lehne mich ___ die Wand.", "an", ["am", "im"]],
	["Ist das ___ Hund?", "dein", ["deinem", "deinen"]],
	["Ich helfe ___ Bruder beim Lernen.", "deinem", ["deinen", "dein"]],
	["Hast du ___ Hund schon gefüttert?", "deinen", ["deinem", "dein"]],
	["Tinto gibt ___ Kind einen Stift.", "dem", ["den", "das"]],
	["Ich sehe ___ Hund im Garten.", "den", ["dem", "der"]],
	["Ist ___ dein Stift?", "dies", ["diesem", "diesen"]],
	["In ___ Haus wohnt meine Oma.", "diesem", ["diesen", "dies"]],
	["Kennst du ___ Mann?", "diesen", ["diesem", "dies"]],
	["Das ist ___ Igel.", "ein", ["einem", "einen"]],
	["Sie schreibt mit ___ Stift.", "einem", ["einen", "ein"]],
	["Ich kaufe ___ Apfel.", "einen", ["einem", "ein"]],
	["Ist das ___ Haus?", "euer", ["eurem", "euren"]],
	["Wir spielen mit ___ Ball.", "eurem", ["euren", "euer"]],
	["Ich habe ___ Lehrer gesehen.", "euren", ["eurem", "euer"]],
	["Das Glas ist ___ voll.", "ganz", ["ganzem", "ganzen"]],
	["Ich freue mich von ___ Herzen.", "ganzem", ["ganzen", "ganz"]],
	["Wir bleiben den ___ Tag draußen.", "ganzen", ["ganzem", "ganz"]],
	["Der Hund folgt ___ überallhin. (dem Jungen)", "ihm", ["ihn", "ihnen"]],
	["Ich rufe ___ gleich an. (den Jungen)", "ihn", ["ihm", "ihnen"]],
	["Ich gebe ___ das Buch. (den Kindern)", "ihnen", ["ihn", "ihm"]],
	["Lea zeigt ___ Bild. (das Bild von Lea)", "ihr", ["ihre", "ihrem"]],
	["Lea ruft ___ Freundin an.", "ihre", ["ihr", "ihren"]],
	["Das ist Lea mit ___ Fahrrad.", "ihrem", ["ihren", "ihre"]],
	["Lea sucht ___ Ball.", "ihren", ["ihrem", "ihre"]],
	["Die Kinder spielen ___ Garten.", "im", ["in", "ins"]],
	["Wir gehen morgen ___ die Schule.", "in", ["im", "am"]],
	["Hier hat ___ Katze einen Korb.", "jede", ["jedem", "jeden"]],
	["Ich fahre an ___ Tag mit dem Rad.", "jedem", ["jeden", "jede"]],
	["Tinto übt fast ___ Tag.", "jeden", ["jedem", "jede"]],
	["Das ist ___ Hund, sondern ein Wolf.", "kein", ["keinem", "keinen"]],
	["Auf ___ Stuhl ist noch Platz.", "keinem", ["keinen", "kein"]],
	["Heute habe ich ___ Hunger.", "keinen", ["keinem", "kein"]],
	["Das ist ___ Fahrrad.", "mein", ["meinem", "meinen"]],
	["Ich spiele mit ___ Bruder.", "meinem", ["meinen", "mein"]],
	["Ich suche ___ Bleistift.", "meinen", ["meinem", "mein"]],
	["Kannst du ___ bitte abholen?", "mich", ["mir", "mein"]],
	["Kannst du ___ bitte helfen?", "mir", ["mich", "mein"]],
	["Tim sagt: Das ist ___ Ball.", "sein", ["seinem", "seinen"]],
	["Tim fährt mit ___ Rad.", "seinem", ["seinen", "sein"]],
	["Tim sucht ___ Ball.", "seinen", ["seinem", "sein"]],
	["Wir wohnen ___ drei Jahren hier.", "seit", ["seid", "seidt"]],
	["Kommst du morgen zu ___?", "uns", ["unserem", "unseren"]],
	["Sie wohnt in ___ Haus.", "unserem", ["unseren", "uns"]],
	["Sie besucht ___ Lehrer.", "unseren", ["unserem", "uns"]],
	["Ich komme gerade ___ Sport.", "vom", ["von", "vor"]],
	["Das Geschenk ist ___ meiner Oma.", "von", ["vom", "vor"]],
	["___ Farbe magst du am liebsten?", "Welche", ["Welchem", "Welchen"]],
	["Mit ___ Stift schreibst du?", "welchem", ["welchen", "welche"]],
	["___ Film möchtest du sehen?", "Welchen", ["Welchem", "Welche"]],
	["___ gehört diese Tasche?", "Wem", ["Wen", "Wer"]],
	["___ hast du gestern getroffen?", "Wen", ["Wem", "Wer"]],
	["Ich gehe ___ Tim.", "zu", ["zum", "zur"]],
	["Ich fahre ___ Bahnhof.", "zum", ["zur", "zu"]],
	["Ich gehe ___ Schule.", "zur", ["zum", "zu"]],
];

const INFLECTED_PROMPT = "Schreibe das Wort aus der Klammer in der passenden Form auf.";

/**
 * Zum Tippen braucht der Satz eine Grundform in Klammern: Ohne sie passen in
 * „Ich helfe ___ Bruder.“ auch meinem, seinem oder dem.
 */
const INFLECTED_TYPED = INFLECTED.flatMap(([sentence, answer, wrong]) => {
	const base = wrong.find(
		(form) =>
			form === "euer" ||
			(form.length < answer.length && answer.toLowerCase().startsWith(form.toLowerCase())),
	);
	return base ? [{ sentence, answer, wrong, base }] : [];
});

/** Jede Präteritumsform in einem Satz, der mit ihr Sinn ergibt. */
const PAST_SENTENCES: [string, string][] = [
	["blieben", "Gestern ___ wir lange wach."],
	["aßen", "Gestern ___ wir Pizza."],
	["fielen", "Beim Spielen ___ wir hin."],
	["gaben", "Gestern ___ wir dem Hund Futter."],
	["gingen", "Gestern ___ wir in den Zoo."],
	["hielten", "Gestern ___ wir an der Ampel."],
	["hießen", "Früher ___ die Straßen anders."],
	["kamen", "Gestern ___ wir zu spät."],
	["konnten", "Gestern ___ wir nicht spielen."],
	["ließen", "Gestern ___ wir den Drachen steigen."],
	["liefen", "Gestern ___ wir zur Schule."],
	["lasen", "Gestern ___ wir ein Buch."],
	["lagen", "Gestern ___ wir auf der Wiese."],
	["mussten", "Gestern ___ wir früh aufstehen."],
	["riefen", "Gestern ___ wir laut nach Tinto."],
	["schienen", "Gestern ___ die Sterne hell."],
	["schoben", "Gestern ___ wir das Rad nach Hause."],
	["sangen", "Gestern ___ wir ein Lied."],
	["saßen", "Gestern ___ wir im Garten."],
	["schliefen", "Gestern ___ wir im Zelt."],
	["schnitten", "Gestern ___ wir den Kuchen an."],
	["schrieben", "Gestern ___ wir einen Brief."],
	["stiegen", "Gestern ___ wir auf den Berg."],
	["schwammen", "Gestern ___ wir im See."],
	["trugen", "Gestern ___ wir die Taschen nach Hause."],
	["tranken", "Gestern ___ wir Apfelsaft."],
	["vergaßen", "Gestern ___ wir das Heft."],
	["zogen", "Gestern ___ wir den Schlitten."],
];

/** Wörter, deren Ende du durch Verlängern findest, im Satz. */
const WORD_END_SENTENCES: [string, string][] = [
	["Abend", "Am ___ gehen wir früh ins Bett."],
	["abends", "Wir essen ___ gemeinsam."],
	["Berg", "Wir klettern auf einen hohen ___."],
	["fremd", "In der neuen Stadt ist mir alles ___."],
	["Geld", "Für das Eis brauche ich noch ___."],
	["rund", "Der Ball ist ___."],
	["erlaubt", "Das ist hier nicht ___."],
	["liebt", "Meine Katze ___ warme Plätze."],
	["liegt", "Das Heft ___ auf dem Tisch."],
	["steigt", "Der Vogel ___ hoch in die Luft."],
	["wird", "Es ___ heute noch regnen."],
];

const PLURAL = "Schreibe die Mehrzahl.";
const COMPARE = "Schreibe die Form mit -er.";
const WITH_ER = "Schreibe die Form mit „er“.";

/** Veränderte Wörter: Aufforderung, Bezugswort, Antwort, weitere richtige Antworten. */
const CHANGED: [string, string, string, string[]][] = [
	[PLURAL, "der Arzt", "Ärzte", ["die Ärzte"]],
	[PLURAL, "das Band", "Bänder", ["die Bänder"]],
	[PLURAL, "die Hand", "Hände", ["die Hände"]],
	[PLURAL, "das Land", "Länder", ["die Länder"]],
	[PLURAL, "der Mann", "Männer", ["die Männer"]],
	[PLURAL, "das Rad", "Räder", ["die Räder"]],
	[PLURAL, "der Wald", "Wälder", ["die Wälder"]],
	[PLURAL, "der Ast", "Äste", ["die Äste"]],
	[PLURAL, "die Nacht", "Nächte", ["die Nächte"]],
	[PLURAL, "der Saft", "Säfte", ["die Säfte"]],
	[COMPARE, "alt", "älter", []],
	[COMPARE, "lang", "länger", []],
	[COMPARE, "stark", "stärker", []],
	[WITH_ER, "laufen", "läuft", ["er läuft"]],
	[WITH_ER, "lassen", "lässt", ["er lässt"]],
	["Wer backt das Brot? Schreibe das Nomen.", "backen", "Bäcker", ["Bäckerin", "der Bäcker", "die Bäckerin"]],
	["Wer verkauft etwas im Laden? Schreibe das Nomen.", "kaufen", "Verkäufer", ["Verkäuferin", "der Verkäufer", "die Verkäuferin"]],
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

function pastNote(form: string): string {
	if (form.includes("ie")) return "Das i klingt lang, also schreibst du ie.";
	if (form.includes("ß")) return "Das a klingt lang und das s scharf, also schreibst du ß.";
	if (/nn|tt/.test(form)) return "Der Selbstlaut klingt kurz, also folgen zwei gleiche Mitlaute.";
	return "Der Selbstlaut hat sich geändert. Sprich die Form deutlich.";
}

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
				const [form, sentence] = pick(rng, PAST_SENTENCES);
				const word = wordOf(PAST_WORDS, form);
				const verb = word.clue as string;
				return text({
					prompt: "Setze das Verb ins Präteritum und schreibe nur das fehlende Wort.",
					material: `${sentence} (${verb})`,
					accept: sentence.includes(" wir ") ? [form, `wir ${form}`] : [form],
					hint: groupOf("praeteritum").rule,
					mistakes: {
						[word.wrong]: "Achte darauf, ob der Selbstlaut kurz oder lang klingt.",
						[verb]: "Das ist die Grundform. Was ist schon vorbei?",
					},
					explanation: `Richtig: ${sentence.replace("___", form)}`,
					key: `praeteritum:${verb}`,
				});
			},
			(rng) => {
				const [prompt, clue, answer, also] = pick(rng, CHANGED);
				const word = wordOf(FORM_WORDS, answer);
				return text({
					prompt,
					material: clue,
					accept: [answer, ...also],
					hint: "Suche das a oder au im verwandten Wort. Daraus wird ä oder äu.",
					mistakes: { [word.wrong]: "Leite vom verwandten Wort ab: Aus a wird ä, aus au wird äu." },
					explanation: `Richtig: ${clue} → ${answer}.`,
					key: `veraendert:${answer}`,
				});
			},
			(rng) =>
				gapInSentence(rng, WORD_END_SENTENCES, FORM_WORDS, GAP_PROMPT, "wortende"),
			(rng) => {
				const { sentence, answer, wrong, base } = pick(rng, INFLECTED_TYPED);
				return text({
					prompt: INFLECTED_PROMPT,
					material: `${sentence} (${base})`,
					accept: [answer],
					hint: groupOf("flexion").rule,
					mistakes: Object.fromEntries(wrong.map((w) => [w, "Diese Form passt hier nicht. Lies den ganzen Satz."])),
					explanation: `Richtig: ${sentence.replace("___", answer)}`,
					key: `satzform:${sentence}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 3 Merkwörter ---------- */

const MEMORY_GROUPS: GroupId[] = ["haeufig", "sz", "ch", "v", "y", "ks", "zz", "dt", "dehnung", "doppelvokal", "ae", "i", "ai"];
const MEMORY_WORDS = spellable(MEMORY_GROUPS);

const FREQUENT: [string, string][] = [
	["ab", "Der Zug fährt um acht Uhr ___."],
	["bin", "Ich ___ heute sehr müde."],
	["bis", "Warte hier, ___ ich wiederkomme."],
	["bist", "Du ___ heute früh dran."],
	["dann", "Wenn es regnet, ___ bleiben wir drinnen."],
	["hier", "Komm ___ zu mir!"],
	["hin", "Wo gehst du denn ___?"],
	["immer", "Im Sommer ist es ___ warm."],
	["ins", "Heute gehen wir ___ Kino."],
	["man", "Hier darf ___ nicht rennen."],
	["nicht", "Ich kann das noch ___."],
	["nichts", "Im Kühlschrank ist ___ mehr."],
	["nie", "Jetzt oder ___!"],
	["nur", "Ich habe ___ noch einen Stift."],
	["ob", "Weißt du, ___ es morgen regnet?"],
	["oft", "Wir gehen ___ ins Schwimmbad."],
	["sehr", "Der Kuchen schmeckt ___ gut."],
	["voll", "Das Glas ist bis oben ___."],
	["wann", "Weißt du, ___ die Schule anfängt? Um acht Uhr."],
	["warum", "Sag mir, ___ du weinst."],
	["wenig", "Wir haben heute ___ Zeit."],
	["wie", "Sag mir, ___ du heißt."],
	["wieder", "Morgen scheint ___ die Sonne."],
	["zu", "Ich gehe ___ meiner Tante."],
	["zuletzt", "Wer kommt ___ an die Reihe?"],
	["zusammen", "Wir spielen ___ Fußball."],
];

const SPECIAL: [string, string][] = [
	["außer", "Alle kommen, ___ Tim."],
	["draußen", "Wir spielen heute ___."],
	["heißen", "Wie möchtest du ___?"],
	["Straße", "Die ___ ist sehr breit."],
	["Christ", "Ein ___ glaubt an Jesus."],
	["vielleicht", "Morgen schneit es ___."],
	["vier", "Ein Hund hat ___ Beine."],
	["Handy", "Mein ___ ist kaputt."],
	["Fuchs", "Der ___ schleicht durch den Wald."],
	["links", "Biege an der Ampel ___ ab."],
	["Taxi", "Wir fahren mit dem ___ zum Bahnhof."],
	["Text", "Ich lese einen langen ___."],
	["sechs", "Ein Würfel hat ___ Seiten."],
	["Pizza", "Heute gibt es ___ zum Essen."],
	["Skizze", "Zeichne zuerst eine ___."],
	["Stadt", "München ist eine große ___."],
	["verwandt", "Tim und Lea sind miteinander ___."],
	["erzählen", "Oma will uns ein Märchen ___."],
	["fahren", "Wir ___ mit dem Bus."],
	["wahr", "Ist diese Geschichte ___?"],
	["zehn", "An beiden Händen habe ich ___ Finger."],
	["Haar", "Lea hat langes ___."],
	["Meer", "Im Urlaub baden wir im ___."],
	["Schnee", "Im Winter fällt ___."],
	["See", "Wir schwimmen im ___."],
	["Käfer", "Ein ___ krabbelt über den Stein."],
	["Käfig", "Der Vogel sitzt im ___."],
	["Märchen", "Oma liest uns ein ___ vor."],
	["Tiger", "Der ___ lebt in Asien."],
	["Maschine", "Die ___ macht viel Lärm."],
	["Familie", "Meine ___ ist groß."],
	["Laib", "Ich kaufe einen ___ Brot."],
];

/** Besonderheiten, die das Kind benennen kann, und ihre Wörter. */
const KINDS: GroupId[] = ["sz", "ks", "dt", "dehnung", "doppelvokal", "i"];
const KIND_WORDS = KINDS.flatMap((kind) => spellable([kind]));

const merkwoerter: Lesson = {
	id: "grundwortschatz-merkwoerter",
	stage: "woerterschatz",
	title: "Merkwörter im Schatz",
	skill: "Du schreibst Wörter sicher, die du sehr oft brauchst oder die sich nicht herleiten lassen.",
	lehrplan: "D3/4 4.4: Grundwortschatz 3/4, Häufigkeitswortschatz und Merkwörter",
	bindings: ["4.4-01"],
	sticker: { emoji: "👑", name: "Merkwort-Krone" },
	paragraphs: [
		"Nicht jedes Wort lässt sich mit einer Regel erklären. Bei Stadt, Pizza oder Haar hilft dir keine Regel. Solche Wörter heißen Merkwörter: Du prägst dir ein, wie sie aussehen.",
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
		wrong: "doppelter Mitlaut",
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
			(rng) => spellingChoice(rng, MEMORY_WORDS, "Welches Merkwort ist richtig geschrieben?"),
			(rng) => {
				const word = pick(rng, KIND_WORDS);
				const others = shuffle(rng, KINDS.filter((k) => k !== word.group)).slice(0, 2);
				const title = groupOf(word.group).title;
				return choice(rng, {
					prompt: "Welche Besonderheit hat das Wort?",
					material: word.word,
					answer: title,
					wrong: others.map((k) => groupOf(k).title),
					hint: "Schau dir die schwierige Stelle im Wort genau an.",
					explanation: `„${word.word}“ gehört zu: ${title}.`,
					key: `besonderheit:${word.word}`,
				});
			},
		],
		2: [
			(rng) => gapInSentence(rng, FREQUENT, MEMORY_WORDS, "Ergänze das kleine Wort und schreibe es ganz auf.", "klein"),
			(rng) => gapInSentence(rng, SPECIAL, MEMORY_WORDS, "Schreibe das Merkwort mit der Lücke ganz auf.", "merkwort"),
		],
	},
	requiredCorrect: 3,
};

export const WOERTERSCHATZ: Lesson[] = [regeln, formen, merkwoerter];
