// Station 3 · Detektivbüro: Rechtschreibstrategien (LehrplanPLUS Deutsch
// 3/4, 4.4: phonologisches, morphologisches und grammatisches Prinzip).
import { choice, pick, shuffle, text } from "../exercises/tasks";
import type { Lesson, Rng } from "../types";
import { cuts, gaps, marks, slotWorkshop } from "./helpers";

/* ---------- 1 Silbentrennung ---------- */

/** Correct split and tempting wrong splits. */
const SPLITS: [string, string[]][] = [
	["Ta-fel", ["Taf-el", "T-afel"]],
	["Kin-der", ["Ki-nder", "Kind-er"]],
	["Son-ne", ["So-nne", "Sonn-e"]],
	["Wet-ter", ["We-tter", "Wett-er"]],
	["Zu-cker", ["Zuc-ker", "Zuck-er"]],
	["Fens-ter", ["Fen-ster", "Fenst-er"]],
	["Kis-te", ["Ki-ste", "Kist-e"]],
	["Ku-chen", ["Kuc-hen", "Kuch-en"]],
	["Ta-sche", ["Tas-che", "Tasch-e"]],
	["Kat-ze", ["Ka-tze", "Katz-e"]],
	["Ap-fel", ["A-pfel", "Apf-el"]],
	["Gar-ten", ["Ga-rten", "Gart-en"]],
	["Ei-mer", ["Eim-er", "E-imer"]],
	["Pup-pe", ["Pu-ppe", "Pupp-e"]],
	["Wol-ke", ["Wo-lke", "Wolk-e"]],
	["Brü-cke", ["Brüc-ke", "Brück-e"]],
];
const LONG_SPLITS: [string, number][] = [
	["Wet-ter-be-richt", 4],
	["Scho-ko-la-de", 4],
	["Schmet-ter-ling", 3],
	["Lö-wen-zahn", 3],
	["Bä-cke-rei", 3],
	["Ge-burts-tag", 3],
	["Sonn-tag", 2],
	["Fe-ri-en", 3],
	["Kin-der-gar-ten", 4],
	["Ta-schen-lam-pe", 4],
	["Hub-schrau-ber", 3],
	["Zahn-bürs-te", 3],
];

const silben: Lesson = {
	id: "silbentrennung",
	stage: "detektiv",
	title: "Silben schwingen und trennen",
	skill: "Du trennst Wörter am Zeilenende nach Silben, auch bei ck und Doppelkonsonanten.",
	lehrplan: "D3/4 4.4: Trennung nach Schreibsilben, Silbengelenk",
	bindings: ["4.4-08"],
	sticker: { emoji: "✂️", name: "Silbenschere" },
	paragraphs: [
		"Sprich ein Wort langsam und schwinge die Silben mit dem Arm: Scho – ko – la – de. Jede Silbe hat einen Selbstlaut (a, e, i, o, u, ä, ö, ü) oder einen Zwielaut (au, ei, eu).",
		"Passt ein Wort nicht mehr in die Zeile, trennst du es zwischen zwei Silben: Fens-ter, Kin-der. Ein einzelner Mitlaut zwischen zwei Selbstlauten kommt in die nächste Silbe: Ta-fel.",
		"Bei doppelten Mitlauten trennst du in der Mitte: Son-ne, Wet-ter. Das ist das Silbengelenk. Aber: ck, ch und sch bleiben zusammen: Zu-cker, Ku-chen, Ta-sche. Einen einzelnen Selbstlaut am Wortanfang trennst du nicht ab: Abend.",
	],
	example: {
		title: "Tintos Silbenschere",
		lines: [
			"Son-nen-schirm → Doppel-n wird getrennt.",
			"Zu-cker-do-se → ck bleibt zusammen.",
			"Fens-ter → s und t werden getrennt.",
			"O-fen? Nein: „Ofen“ bleibt ganz.",
		],
	},
	takeaway:
		"Trenne nach Sprechsilben. Doppelte Mitlaute werden getrennt (Son-ne). ck, ch und sch bleiben zusammen (Zu-cker). Einzelne Selbstlaute am Anfang nicht abtrennen.",
	terms: [
		{ term: "Silbe", meaning: "Sprecheinheit mit Selbstlaut: Ta-fel" },
		{ term: "Silbengelenk", meaning: "der doppelte Mitlaut: Son-ne" },
	],
	check: {
		wrong: "Zuc-ker",
		explanation: "ck bleibt immer zusammen und kommt in die nächste Silbe: Zu-cker.",
	},
	workshop: slotWorkshop(
		{
			variant: "letters",
			title: "Die Silbenschere",
			intro:
				"Tinto muss lange Wörter auf seine schmalen Zettel schreiben. Tippe zwischen die Buchstaben, wo man trennen darf.",
			pens: [{ value: "-", label: "Trennstrich", colour: "purple" }],
			puzzles: [
				cuts("sonnenschirm", "Son-nen-schirm", "-", "Drei Silben"),
				cuts("zuckerdose", "Zu-cker-do-se", "-", "Vier Silben mit ck"),
				cuts("schokoladenkuchen", "Scho-ko-la-den-ku-chen", "-", "Sechs Silben"),
			],
		},
		[
			"Trenne „Sonnenschirm“. Achte auf das Doppel-n.",
			"Trenne „Zuckerdose“. Wohin gehört das ck?",
			"Trenne das Riesenwort „Schokoladenkuchen“.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [right, wrongs] = pick(rng, SPLITS);
				return choice(rng, {
					prompt: "Wie trennst du das Wort richtig?",
					answer: right,
					wrong: wrongs,
					hint: "Sprich und schwinge die Silben. Doppelte Mitlaute trennst du, ck, ch und sch nicht.",
					explanation: `Richtig: ${right}.`,
					key: `trennen:${right}`,
				});
			},
			(rng) => {
				const [split, n] = pick(rng, LONG_SPLITS);
				return choice(rng, {
					prompt: "Wie viele Silben hat das Wort?",
					material: split.replaceAll("-", ""),
					answer: String(n),
					wrong: ["2", "3", "4", "5"],
					hint: "Klatsche bei jeder Silbe einmal.",
					explanation: `${split}: ${n} Silben.`,
					key: `silben:${split}`,
				});
			},
		],
		2: [
			(rng) => {
				const [split] = pick(rng, LONG_SPLITS);
				return text({
					prompt: "Trenne das Wort mit Strichen in alle Silben.",
					material: split.replaceAll("-", ""),
					accept: [split],
					hint: "Schwinge Silbe für Silbe. Schreibe zwischen die Silben einen Strich: Ta-fel.",
					explanation: `Richtig: ${split}.`,
					mistakes: {
						[split.replace("ck", "c-k").replace("-c-k", "c-k")]: "ck bleibt zusammen.",
					},
					key: `trenne2:${split}`,
				});
			},
			(rng) => {
				const traps: [string, string, string[], string][] = [
					["Abend", "Abend (nicht trennen)", ["A-bend", "Ab-end"], "Ein einzelner Selbstlaut am Wortanfang wird nicht abgetrennt."],
					["Ofen", "Ofen (nicht trennen)", ["O-fen", "Of-en"], "Ein einzelner Selbstlaut am Wortanfang wird nicht abgetrennt."],
					["Jacke", "Ja-cke", ["Jac-ke", "Jack-e"], "ck bleibt zusammen."],
					["Flasche", "Fla-sche", ["Flas-che", "Flasch-e"], "sch bleibt zusammen."],
					["Teller", "Tel-ler", ["Te-ller", "Tell-er"], "Doppelte Mitlaute werden getrennt."],
					["Kasten", "Kas-ten", ["Ka-sten", "Kast-en"], "s und t werden getrennt."],
					["Lachen", "La-chen", ["Lac-hen", "Lach-en"], "ch bleibt zusammen."],
					["Igel", "Igel (nicht trennen)", ["I-gel", "Ig-el"], "Ein einzelner Selbstlaut am Wortanfang wird nicht abgetrennt."],
				];
				const [word, right, wrongs, why] = pick(rng, traps);
				return choice(rng, {
					prompt: "Am Zeilenende: Wie darfst du das Wort trennen?",
					material: word,
					answer: right,
					wrong: wrongs,
					hint: "Denk an die Sonderfälle: ck, ch, sch, doppelte Mitlaute, ein Selbstlaut am Anfang.",
					explanation: why,
					key: `falle:${word}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 2 Kurze Selbstlaute: Doppelkonsonant, ck, tz ---------- */

/** Word, gap pattern with right letters first, rule. */
const SHORT: [string, string, string, string][] = [
	["Zucker", "Zu{ck|k}er", "ck", "Kurzes u, ein Mitlaut hörbar → ck."],
	["Jacke", "Ja{ck|k}e", "ck", "Kurzes a → ck."],
	["Socke", "So{ck|k}e", "ck", "Kurzes o → ck."],
	["Brücke", "Brü{ck|k}e", "ck", "Kurzes ü → ck."],
	["Wolke", "Wol{k|ck}e", "k", "Nach l steht nie ck."],
	["Schaukel", "Schau{k|ck}el", "k", "Nach au steht nie ck."],
	["Bank", "Ban{k|ck}", "k", "Nach n steht nie ck."],
	["Gurke", "Gur{k|ck}e", "k", "Nach r steht nie ck."],
	["Katze", "Ka{tz|z}e", "tz", "Kurzes a → tz."],
	["Mütze", "Mü{tz|z}e", "tz", "Kurzes ü → tz."],
	["Pfütze", "Pfü{tz|z}e", "tz", "Kurzes ü → tz."],
	["Blitz", "Bli{tz|z}", "tz", "Kurzes i → tz."],
	["Kerze", "Ker{z|tz}e", "z", "Nach r steht nie tz."],
	["Pilz", "Pil{z|tz}", "z", "Nach l steht nie tz."],
	["Heizung", "Hei{z|tz}ung", "z", "Nach ei steht nie tz."],
	["Pflanze", "Pflan{z|tz}e", "z", "Nach n steht nie tz."],
	["Mutter", "Mu{tt|t}er", "tt", "Kurzes u → doppeltes t."],
	["Teller", "Te{ll|l}er", "ll", "Kurzes e → doppeltes l."],
	["Himmel", "Hi{mm|m}el", "mm", "Kurzes i → doppeltes m."],
	["Koffer", "Ko{ff|f}er", "ff", "Kurzes o → doppeltes f."],
	["Suppe", "Su{pp|p}e", "pp", "Kurzes u → doppeltes p."],
	["Hose", "Ho{s|ss}e", "s", "Langes o → nur ein Mitlaut."],
	["Tafel", "Ta{f|ff}el", "f", "Langes a → nur ein Mitlaut."],
	["Rabe", "Ra{b|bb}e", "b", "Langes a → nur ein Mitlaut."],
];
const SHORT_LONG: [string, "kurz" | "lang"][] = [
	["Kamm", "kurz"],
	["Kahn", "lang"],
	["Bett", "kurz"],
	["Beet", "lang"],
	["Mitte", "kurz"],
	["Miete", "lang"],
	["Stall", "kurz"],
	["Stahl", "lang"],
	["Hütte", "kurz"],
	["Hüte", "lang"],
	["Ofen", "lang"],
	["offen", "kurz"],
];

function gapTask(rng: Rng, word: string, pattern: string, why: string, prompt: string) {
	const options = [...pattern.matchAll(/\{([^}]*)\}/g)][0][1].split("|");
	const shown = pattern.replace(/\{[^}]*\}/, "_");
	return choice(rng, {
		prompt,
		material: shown,
		answer: word,
		wrong: options.slice(1).map((o) => pattern.replace(/\{[^}]*\}/, o)),
		hint: "Sprich das Wort deutlich. Ist der Selbstlaut davor kurz oder lang? Steht davor l, n, r, au oder ei?",
		explanation: `${word}: ${why}`,
		key: `gap:${word}`,
	});
}

const kurz: Lesson = {
	id: "kurze-selbstlaute",
	stage: "detektiv",
	title: "Kurz und knapp: doppelte Mitlaute, ck und tz",
	skill: "Du hörst kurze Selbstlaute und schreibst Doppelkonsonanten, ck und tz richtig.",
	lehrplan: "D3/4 4.4: Klangunterschiede der Vokale, Konsonantenverdoppelung",
	bindings: ["4.4-02", "4.4-09"],
	sticker: { emoji: "🥁", name: "Trommel" },
	paragraphs: [
		"Sprich genau: Ist der betonte Selbstlaut kurz wie in „Kamm“ oder lang wie in „Kahn“? Das ist dein wichtigster Detektiv-Hinweis.",
		"Nach einem kurzen betonten Selbstlaut hörst du oft nur einen Mitlaut, du schreibst aber zwei: Mutter, Teller, Himmel. Statt kk schreibst du ck (Zucker), statt zz schreibst du tz (Katze).",
		"Folgen nach dem kurzen Selbstlaut schon zwei verschiedene Mitlaute, wird nicht verdoppelt: Hand, Wurst. Nach l, n, r und nach au, ei, eu steht nie ck oder tz: Wolke, Bank, Kerze, Schaukel, Heizung.",
	],
	example: {
		title: "Tinto lauscht",
		lines: [
			"Kat-ze: kurzes a, ein Mitlaut hörbar → tz",
			"Ker-ze: nach r → nur z",
			"Zu-cker: kurzes u → ck",
			"Schau-kel: nach au → nur k",
		],
	},
	takeaway:
		"Kurzer betonter Selbstlaut + nur ein Mitlaut hörbar → verdoppeln (tt, ll, mm …), ck statt kk, tz statt zz. Nach l, n, r, au, ei, eu nie ck und nie tz.",
	terms: [
		{ term: "Selbstlaut (Vokal)", meaning: "a, e, i, o, u, ä, ö, ü" },
		{ term: "Mitlaut (Konsonant)", meaning: "b, c, d, f, g …" },
		{ term: "Doppelkonsonant", meaning: "zwei gleiche Mitlaute: Mutter" },
	],
	check: {
		wrong: "Kazze",
		explanation: "Nach dem kurzen a hörst du nur einen Mitlaut. Statt zz schreibst du tz: Katze.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Die Lausch-Lupe",
			intro: "Sprich jedes Wort laut. Wähle dann für jede Lücke die richtigen Buchstaben.",
			pens: [],
			puzzles: [
				gaps("doppelt", "Mu{tt|t}er · Te{ll|l}er · Ho{s|ss}e", "Doppelt oder einfach?", "Lang oder kurz? Mutter (kurz), Teller (kurz), Hose (lang)"),
				gaps("ck", "Zu{ck|k}er · Wol{k|ck}e · Ja{ck|k}e", "ck oder k?", "Nach l nie ck."),
				gaps("tz", "Ka{tz|z}e · Ker{z|tz}e · Hei{z|tz}ung", "tz oder z?", "Nach r und ei nie tz."),
			],
		},
		[
			"Löse die Doppel-Wörter.",
			"Löse die ck-Wörter.",
			"Löse die tz-Wörter.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [word, kind] = pick(rng, SHORT_LONG);
				return choice(rng, {
					prompt: "Sprich das Wort laut. Ist der betonte Selbstlaut kurz oder lang?",
					material: word,
					answer: kind,
					wrong: ["kurz", "lang"],
					hint: "Kurz klingt wie ein Klopfen: Kamm. Lang klingt gedehnt: Kahn.",
					explanation: `In „${word}“ ist der Selbstlaut ${kind}.`,
					key: `kurzlang:${word}`,
				});
			},
			(rng) => {
				const [word, pattern, , why] = pick(rng, SHORT);
				return gapTask(rng, word, pattern, why, "Welche Schreibung ist richtig?");
			},
		],
		2: [
			(rng) => {
				const [word, pattern, , why] = pick(rng, SHORT);
				const shown = pattern.replace(/\{([^}]*)\}/, (_, o: string) => `(${o.split("|").sort().join("/")})`);
				return text({
					prompt: "Schreibe das Wort richtig auf.",
					material: shown,
					accept: [word],
					hint: "Kurz oder lang? Steht davor l, n, r, au oder ei?",
					explanation: `${word}: ${why}`,
					key: `schreibe:${word}`,
				});
			},
			(rng) => {
				const reasons: [string, string, string[]][] = [
					["Bank", "Nach n steht nie ck.", ["Der Selbstlaut ist lang.", "Bank ist ein Merkwort."]],
					["Kerze", "Nach r steht nie tz.", ["Der Selbstlaut ist lang.", "Am Wortende hört man z."]],
					["Schaukel", "Nach au steht nie ck.", ["Das a ist kurz.", "Schaukel ist ein Fremdwort."]],
					["Katze", "Nach dem kurzen a hört man nur einen Mitlaut, deshalb tz.", ["Nach a steht immer tz.", "Katze ist ein Merkwort."]],
					["Mutter", "Das u ist kurz und man hört nur ein t, deshalb tt.", ["Das u ist lang.", "Nach u steht immer tt."]],
					["Hose", "Das o ist lang, deshalb nur ein s.", ["Das o ist kurz.", "Nach o steht nie ss."]],
				];
				const [word, right, wrong] = pick(rng, reasons);
				return choice(rng, {
					prompt: `Begründe die Schreibung von „${word}“.`,
					answer: right,
					wrong,
					hint: "Sprich das Wort. Kurz oder lang? Welcher Buchstabe steht vor der Stelle?",
					explanation: right,
					key: `begruende:${word}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 3 Lange Selbstlaute: ie, h, Doppelvokal, ß ---------- */

const LONG: [string, string, string][] = [
	["Biene", "B{ie|i}ne", "Langes i schreibst du meistens ie."],
	["Spiegel", "Sp{ie|i}gel", "Langes i schreibst du meistens ie."],
	["Wiese", "W{ie|i}se", "Langes i schreibst du meistens ie."],
	["Ziege", "Z{ie|i}ge", "Langes i schreibst du meistens ie."],
	["Brief", "Br{ie|i}f", "Langes i schreibst du meistens ie."],
	["Kino", "K{i|ie}no", "Ausnahme: Kino ist ein Merkwort mit i."],
	["Tiger", "T{i|ie}ger", "Ausnahme: Tiger ist ein Merkwort mit i."],
	["Straße", "Stra{ß|ss}e", "Langes a und scharfes s → ß."],
	["Fuß", "Fu{ß|ss}", "Langes u → ß."],
	["heiß", "hei{ß|ss}", "Nach ei und scharfem s → ß."],
	["Wasser", "Wa{ss|ß}er", "Kurzes a → ss."],
	["Kissen", "Ki{ss|ß}en", "Kurzes i → ss."],
	["Schlüssel", "Schlü{ss|ß}el", "Kurzes ü → ss."],
	["Nuss", "Nu{ss|ß}", "Kurzes u → ss."],
	["Rose", "Ro{s|ß}e", "Summendes s → nur s."],
	["Zahn", "Z{ah|a}n", "Merkwort mit Dehnungs-h."],
	["Stuhl", "St{uh|u}l", "Merkwort mit Dehnungs-h."],
	["Boot", "B{oo|o}t", "Merkwort mit Doppel-o."],
	["Meer", "M{ee|e}r", "Merkwort mit Doppel-e."],
	["Haar", "H{aa|a}r", "Merkwort mit Doppel-a."],
];
const S_SOUND: [string, string, string][] = [
	["Wir e___en Nudeln.", "essen", "Kurzes e → ss."],
	["Die Stra___e ist nass.", "Straße", "Langes a → ß."],
	["Im Flu___ schwimmen Fische.", "Fluss", "Kurzes u → ss."],
	["Ich habe kalte Fü___e.", "Füße", "Langes ü → ß."],
	["Die Ro___e duftet.", "Rose", "Summendes s → s."],
	["Mein Opa hei___t Franz.", "heißt", "Nach ei → ß."],
	["Wir mü___en los.", "müssen", "Kurzes ü → ss."],
	["Der Teller ist wei___.", "weiß", "Nach ei → ß."],
	["Die Ta___e ist leer.", "Tasse", "Kurzes a → ss."],
	["Der Ha___e hoppelt.", "Hase", "Summendes s → s."],
];

const lang: Lesson = {
	id: "lange-selbstlaute",
	stage: "detektiv",
	title: "Lang gezogen: ie, h, Doppelvokal und ß",
	skill: "Du schreibst lange Selbstlaute und s-Laute richtig.",
	lehrplan: "D3/4 4.4: <ie> als regelhafte Schreibung, Merkwörter, s-Laute",
	bindings: ["4.4-09", "4.4-07"],
	sticker: { emoji: "🎈", name: "Luftballon" },
	paragraphs: [
		"Ein langes i schreibst du fast immer ie: Biene, spielen, Riese. Nur wenige Wörter sind Ausnahmen, zum Beispiel Kino, Tiger, Igel, mir, dir, wir. Die musst du dir merken.",
		"Manchmal zeigt ein h, dass ein Selbstlaut lang ist: Zahn, Stuhl, fahren. Manchmal steht der Selbstlaut doppelt: Boot, Meer, Haar. Das hörst du nicht, das sind Merkwörter. Übe sie mit deiner Lernwörterkartei.",
		"Beim scharfen s hilft dir wieder kurz oder lang: Nach einem kurzen Selbstlaut schreibst du ss (Wasser, Fluss). Nach einem langen Selbstlaut oder ei, au, eu schreibst du ß (Straße, Fuß, heiß). Ein summendes s schreibst du s (Rose).",
	],
	example: {
		title: "Tinto dehnt",
		lines: [
			"Wie-se: langes i → ie",
			"Ki-no: Merkwort ohne e",
			"Fuß – Fluss: langes u → ß, kurzes u → ss",
			"Zahn: Dehnungs-h → Merkwort",
		],
	},
	takeaway:
		"Langes i → meistens ie. Dehnungs-h und Doppelvokal (aa, ee, oo) sind Merkwörter. Scharfes s: kurz → ss, lang oder nach ei/au/eu → ß, summend → s.",
	terms: [
		{ term: "Dehnungs-h", meaning: "zeigt einen langen Selbstlaut: Zahn" },
		{ term: "Doppelvokal", meaning: "aa, ee, oo: Boot" },
		{ term: "Merkwort", meaning: "musst du dir einprägen" },
	],
	check: {
		wrong: "Strasse",
		explanation: "Das a in Straße ist lang. Nach langem Selbstlaut schreibst du ß.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Die Dehn-Werkstatt",
			intro: "Sprich die Wörter lang und kurz. Wähle für jede Lücke die richtige Schreibung.",
			pens: [],
			puzzles: [
				gaps("ie", "Sp{ie|i}gel · K{i|ie}no · W{ie|i}se", "ie oder i?", "Kino ist ein Merkwort."),
				gaps("s", "Stra{ß|ss}e · Wa{ss|ß}er · Fu{ß|ss}ball", "ß oder ss?", "Lang → ß, kurz → ss"),
				gaps("merk", "St{uh|u}l · B{oo|o}t · M{ee|e}r", "Merkwörter", "Dehnungs-h und Doppelvokal musst du dir merken."),
			],
		},
		[
			"Löse die ie-Wörter. Eins ist ein Merkwort!",
			"Löse die s-Laut-Wörter.",
			"Löse die Merkwörter.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [word, pattern, why] = pick(rng, LONG.filter(([, p]) => p.includes("ie|i") || p.includes("i|ie")));
				return gapTask(rng, word, pattern, why, "ie oder i? Welche Schreibung ist richtig?");
			},
			(rng) => {
				const [word, pattern, why] = pick(rng, LONG.filter(([, p]) => p.includes("ß") || p.includes("{s")));
				return gapTask(rng, word, pattern, why, "Welches s ist richtig?");
			},
		],
		2: [
			(rng) => {
				const [sentence, word, why] = pick(rng, S_SOUND);
				return text({
					prompt: "s, ss oder ß? Schreibe das fehlende Wort ganz auf.",
					material: sentence,
					accept: [word],
					hint: "Kurz → ss. Lang oder nach ei/au/eu → ß. Summend → s.",
					explanation: `${word}: ${why}`,
					key: `slaut:${word}`,
				});
			},
			(rng) => {
				const pairs: [string, string, string[]][] = [
					["Fuß – Fluss", "Bei Fuß ist das u lang, bei Fluss kurz.", ["Fuß ist ein Nomen, Fluss nicht.", "Am Wortende steht immer ß."]],
					["Biene – Kino", "Langes i schreibt man meist ie, Kino ist eine Ausnahme.", ["Kino hat ein kurzes i.", "Nach K steht nie ie."]],
					["Straße – Rose", "In Straße klingt das s scharf, in Rose summend.", ["Rose ist ein Merkwort.", "Nach o steht immer s."]],
					["Wasser – Soße", "Bei Wasser ist das a kurz, bei Soße ist das o lang.", ["Wasser ist ein Getränk.", "Nach a steht immer ss."]],
					["Stuhl – Schule", "Das h ist ein Merkzeichen, beide u sind lang.", ["Bei Schule ist das u kurz.", "Vor l steht immer h."]],
				];
				const [shown, right, wrong] = pick(rng, pairs);
				return choice(rng, {
					prompt: "Detektivfrage: Warum werden die Wörter verschieden geschrieben?",
					material: shown,
					answer: right,
					wrong,
					hint: "Sprich beide Wörter. Lang oder kurz? Scharf oder summend? Oder ist es ein Merkwort?",
					explanation: right,
					key: `warum:${shown}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 4 Verlängern ---------- */

/** Word, gap pattern (right first), extension. */
const HARD: [string, string, string][] = [
	["Hund", "Hun{d|t}", "die Hunde"],
	["Wald", "Wal{d|t}", "die Wälder"],
	["Brot", "Bro{t|d}", "die Brote"],
	["Bild", "Bil{d|t}", "die Bilder"],
	["Kind", "Kin{d|t}", "die Kinder"],
	["Hut", "Hu{t|d}", "die Hüte"],
	["Zelt", "Zel{t|d}", "die Zelte"],
	["Pferd", "Pfer{d|t}", "die Pferde"],
	["Kleid", "Klei{d|t}", "die Kleider"],
	["Wort", "Wor{t|d}", "die Wörter"],
	["Korb", "Kor{b|p}", "die Körbe"],
	["Kalb", "Kal{b|p}", "die Kälber"],
	["Dieb", "Die{b|p}", "die Diebe"],
	["gelb", "gel{b|p}", "gelbe Blumen"],
	["er lebt", "er le{b|p}t", "leben"],
	["Berg", "Ber{g|k}", "die Berge"],
	["Zwerg", "Zwer{g|k}", "die Zwerge"],
	["Weg", "We{g|k}", "die Wege"],
	["Zug", "Zu{g|k}", "die Züge"],
	["klug", "klu{g|k}", "kluge Kinder"],
	["sie fragt", "sie fra{g|k}t", "fragen"],
	["Schrank", "Schran{k|g}", "die Schränke"],
	["Volk", "Vol{k|g}", "die Völker"],
	["König", "Köni{g|ch}", "die Könige"],
	["lustig", "lusti{g|ch}", "lustige Leute"],
	["Teppich", "Teppi{ch|g}", "die Teppiche"],
];

const verlaengern: Lesson = {
	id: "verlaengern",
	stage: "detektiv",
	title: "Der Verlängerungs-Trick",
	skill: "Du findest am Wortende b, d, g mit dem Verlängern.",
	lehrplan: "D3/4 4.4: Auslautverhärtung, ein- und zweisilbige Wortformen",
	bindings: ["4.4-16", "4.4-02"],
	sticker: { emoji: "🔍", name: "Detektiv-Lupe" },
	paragraphs: [
		"Am Wortende klingen b, d und g oft wie p, t und k. Hörst du „Hunt“ oder „Hund“? Mit den Ohren allein kannst du das nicht entscheiden.",
		"Der Detektiv-Trick heißt Verlängern. Mach das Wort länger, dann hörst du den Laut deutlich: Nomen in die Mehrzahl (der Hund – die Hunde), Verben in die Grundform (er lebt – leben), Adjektive mit einem Nomen (gelb – gelbe Blumen).",
		"Auch bei -ig hilft Verlängern: König – Könige. Bei -ich hörst du in der Verlängerung weiter ch: Teppich – Teppiche.",
	],
	example: {
		title: "Tinto verlängert",
		lines: [
			"Ber? → die Berge → g → Berg",
			"Hu? → die Hüte → t → Hut",
			"er gi?t → geben → b → er gibt",
			"Köni? → die Könige → g → König",
		],
	},
	takeaway:
		"b oder p? d oder t? g oder k? Verlängere das Wort: Mehrzahl, Grundform oder Adjektiv + Nomen. Dann hörst du es.",
	terms: [{ term: "Verlängern", meaning: "Hund → Hunde, lebt → leben, gelb → gelbe" }],
	check: {
		wrong: "Ich schaue, ob das Wort ein Nomen ist.",
		explanation: "Die Wortart allein hilft nicht. Am Ende klingt d wie t. Erst die Verlängerung „Hunde“ zeigt das d.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Der Verlängerungs-Koffer",
			intro:
				"Tinto hat verdächtige Wortenden gefunden. Öffne die Lupe, wenn du Hilfe brauchst, und entscheide dich dann.",
			pens: [],
			puzzles: [
				gaps("dt", "Hun{d|t} · Wal{d|t} · Bro{t|d}", "d oder t?", "die Hunde · die Wälder · die Brote"),
				gaps("bpgk", "Kor{b|p} · Ber{g|k} · Schran{k|g}", "b/p und g/k", "die Körbe · die Berge · die Schränke"),
				gaps("mix", "er le{b|p}t · wil{d|t} · Köni{g|ch}", "Verb, Adjektiv, -ig", "leben · wilde Tiere · die Könige"),
			],
		},
		[
			"Entlarve die d- und t-Wörter.",
			"Entlarve die b-, g- und k-Wörter.",
			"Entlarve das Verb, das Adjektiv und den König.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [word, pattern, ext] = pick(rng, HARD);
				const options = [...pattern.matchAll(/\{([^}]*)\}/g)][0][1].split("|");
				return choice(rng, {
					prompt: "Welcher Buchstabe fehlt? Die Verlängerung hilft dir.",
					material: `${pattern.replace(/\{[^}]*\}/, "_")}  →  ${ext}`,
					answer: options[0],
					wrong: options.slice(1),
					hint: "Sprich die Verlängerung deutlich. Was hörst du?",
					explanation: `${ext} → ${word}.`,
					key: `verl1:${word}`,
				});
			},
			(rng) => {
				const [word, , ext] = pick(rng, HARD.filter(([, , e]) => e.startsWith("die ")));
				const others = shuffle(rng, HARD.filter(([w]) => w !== word).map(([, , e]) => e)).slice(0, 2);
				return choice(rng, {
					prompt: `Welche Verlängerung hilft dir bei „${word.replace(/(ch|[bdgtkp])$/, "_")}“?`,
					answer: ext,
					wrong: others,
					hint: "Bilde die Mehrzahl desselben Wortes.",
					explanation: `${ext} → ${word}.`,
					key: `verl-welche:${word}`,
				});
			},
		],
		2: [
			(rng) => {
				const [word, pattern] = pick(rng, HARD);
				const options = [...pattern.matchAll(/\{([^}]*)\}/g)][0][1].split("|");
				const shown = pattern.replace(/\{[^}]*\}/, `(${[...options].sort().join("/")})`);
				const wrongWord = pattern.replace(/\{[^}]*\}/, options[1]);
				return text({
					prompt: "Schreibe es richtig auf. Verlängere dafür im Kopf.",
					material: shown,
					accept: [word],
					hint: "Mehrzahl? Grundform? Adjektiv mit Nomen?",
					explanation: `Richtig: ${word}.`,
					mistakes: { [wrongWord]: "Verlängere das Wort und hör genau hin." },
					key: `verl2:${word}`,
				});
			},
			(rng) => {
				const [word, , ext] = pick(rng, HARD);
				return choice(rng, {
					prompt: `Begründe: Warum schreibt man „${word}“ so?`,
					answer: `Verlängert heißt es „${ext}“. Da hört man es.`,
					wrong: [
						`„${word}“ ist ein Merkwort.`,
						`Am Wortende schreibt man immer so, wie man es hört.`,
					],
					hint: "Welcher Detektiv-Trick passt zu Wortenden?",
					explanation: `${ext} → ${word}.`,
					key: `verl-begr:${word}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 5 Ableiten ---------- */

const UMLAUT: [string, string, string][] = [
	["Hände", "H{ä|e}nde", "die Hand"],
	["Bäcker", "B{ä|e}cker", "backen"],
	["Blätter", "Bl{ä|e}tter", "das Blatt"],
	["Bälle", "B{ä|e}lle", "der Ball"],
	["Gläser", "Gl{ä|e}ser", "das Glas"],
	["er fährt", "er f{ä|e}hrt", "fahren"],
	["sie schläft", "sie schl{ä|e}ft", "schlafen"],
	["Kälte", "K{ä|e}lte", "kalt"],
	["Zähne", "Z{ä|e}hne", "der Zahn"],
	["Gärtner", "G{ä|e}rtner", "der Garten"],
	["Bäume", "B{äu|eu}me", "der Baum"],
	["Häuser", "H{äu|eu}ser", "das Haus"],
	["Mäuse", "M{äu|eu}se", "die Maus"],
	["Träume", "Tr{äu|eu}me", "der Traum"],
	["er läuft", "er l{äu|eu}ft", "laufen"],
	["Räuber", "R{äu|eu}ber", "rauben"],
	["Heft", "H{e|ä}ft", ""],
	["Feld", "F{e|ä}ld", ""],
	["Eule", "{Eu|Äu}le", ""],
	["Feuer", "F{eu|äu}er", ""],
	["heute", "h{eu|äu}te", ""],
	["Leute", "L{eu|äu}te", ""],
];

const ableiten: Lesson = {
	id: "ableiten",
	stage: "detektiv",
	title: "Der Ableitungs-Trick: ä oder e, äu oder eu",
	skill: "Du entscheidest ä/e und äu/eu mit einem verwandten Wort.",
	lehrplan: "D3/4 4.4: Umlautung, Stammschreibung auf verwandte Wörter übertragen",
	bindings: ["4.4-16", "4.4-10"],
	sticker: { emoji: "🧭", name: "Kompass" },
	paragraphs: [
		"„Hände“ oder „Hende“? ä und e klingen gleich, äu und eu auch. Hier hilft dir der Ableitungs-Trick.",
		"Suche ein verwandtes Wort mit a oder au. Gibt es eins, schreibst du ä oder äu: die Hand → die Hände, der Baum → die Bäume, fahren → er fährt.",
		"Findest du kein verwandtes Wort mit a oder au, schreibst du meistens e oder eu: das Heft, die Eule, das Feuer.",
	],
	example: {
		title: "Tinto leitet ab",
		lines: [
			"M?use → die Maus → äu → Mäuse",
			"B?cker → backen → ä → Bäcker",
			"L?te → kein Wort mit au → eu → Leute",
		],
	},
	takeaway:
		"ä oder e? äu oder eu? Suche ein verwandtes Wort mit a oder au. Gibt es eins → ä/äu. Gibt es keins → meistens e/eu.",
	terms: [{ term: "Ableiten", meaning: "Hände ← Hand, Bäume ← Baum" }],
	check: {
		wrong: "Weil es ein Nomen ist.",
		explanation: "ä und e klingen gleich. Das verwandte Wort „Hand“ zeigt: Hände mit ä.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Der Kompass",
			intro: "Tintos Kompass zeigt auf verwandte Wörter. Wähle für jede Lücke die richtigen Buchstaben.",
			pens: [],
			puzzles: [
				gaps("ae", "H{ä|e}nde · B{ä|e}cker · H{e|ä}ft", "ä oder e?", "die Hand · backen · (kein a)"),
				gaps("aeu", "B{äu|eu}me · {Eu|Äu}le · H{äu|eu}ser", "äu oder eu?", "der Baum · (kein au) · das Haus"),
				gaps("mix", "er f{ä|e}hrt · L{eu|äu}te · M{äu|eu}se", "Gemischt", "fahren · (kein au) · die Maus"),
			],
		},
		[
			"Löse die ä- und e-Wörter.",
			"Löse die äu- und eu-Wörter.",
			"Löse die gemischten Wörter.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [word, pattern, related] = pick(rng, UMLAUT.filter(([, , r]) => r));
				const options = [...pattern.matchAll(/\{([^}]*)\}/g)][0][1].split("|");
				return choice(rng, {
					prompt: "Welche Schreibung ist richtig? Das verwandte Wort hilft.",
					material: `${pattern.replace(/\{[^}]*\}/, "_")}  ←  ${related}`,
					answer: word,
					wrong: [pattern.replace(/\{[^}]*\}/, options[1])],
					hint: "Steckt im verwandten Wort ein a oder au?",
					explanation: `${related} → ${word}.`,
					key: `abl1:${word}`,
				});
			},
			(rng) => {
				const [word, , related] = pick(rng, UMLAUT.filter(([, , r]) => r));
				const others = shuffle(rng, UMLAUT.filter(([w, , r]) => r && w !== word).map(([, , r]) => r)).slice(0, 2);
				return choice(rng, {
					prompt: `Welches verwandte Wort hilft dir bei „${word}“?`,
					answer: related,
					wrong: others,
					hint: "Suche ein Wort aus der gleichen Familie mit a oder au.",
					explanation: `${related} → ${word}.`,
					key: `abl-welches:${word}`,
				});
			},
		],
		2: [
			(rng) => {
				const [word, pattern] = pick(rng, UMLAUT);
				const options = [...pattern.matchAll(/\{([^}]*)\}/g)][0][1].split("|");
				const shown = pattern.replace(/\{[^}]*\}/, `(${[...options].sort().join("/")})`);
				return text({
					prompt: "Schreibe das Wort richtig auf.",
					material: shown,
					accept: [word],
					hint: "Gibt es ein verwandtes Wort mit a oder au?",
					explanation: `Richtig: ${word}.`,
					mistakes: { [pattern.replace(/\{[^}]*\}/, options[1])]: "Prüfe mit einem verwandten Wort." },
					key: `abl2:${word}`,
				});
			},
			(rng) => {
				const [word, , related] = pick(rng, UMLAUT);
				const right = related
					? `Es kommt von „${related}“.`
					: "Es gibt kein verwandtes Wort mit a oder au.";
				return choice(rng, {
					prompt: `Begründe die Schreibung von „${word}“.`,
					answer: right,
					wrong: related
						? ["Es gibt kein verwandtes Wort mit a oder au.", "Man schreibt es, wie man es hört."]
						: ["Es kommt von einem Wort mit au.", "Nach diesem Buchstaben steht immer e."],
					hint: "Suche ein verwandtes Wort. Gibt es eins mit a oder au?",
					explanation: right,
					key: `abl-begr:${word}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 6 Großschreibung ---------- */

const CAPITAL: [string, string][] = [
	["der mutige ritter rettete die prinzessin.", "Der mutige Ritter rettete die Prinzessin."],
	["im sommer fahren wir an den see.", "Im Sommer fahren wir an den See."],
	["lea hat große freude an ihrem hund.", "Lea hat große Freude an ihrem Hund."],
	["die dunkelheit machte dem kind angst.", "Die Dunkelheit machte dem Kind Angst."],
	["tinto schreibt seiner tante einen brief.", "Tinto schreibt seiner Tante einen Brief."],
	["am abend leuchten die sterne hell.", "Am Abend leuchten die Sterne hell."],
	["die zeitung liegt auf dem tisch.", "Die Zeitung liegt auf dem Tisch."],
	["mit viel geduld baute ben ein vogelhaus.", "Mit viel Geduld baute Ben ein Vogelhaus."],
];
const NOUN_SIGNS: [string, string, string[]][] = [
	["Freiheit", "Die Nachsilbe -heit zeigt ein Nomen.", ["Man kann es steigern.", "Man kann eine Personalform bilden."]],
	["Hoffnung", "Die Nachsilbe -ung zeigt ein Nomen.", ["Die Vorsilbe zeigt ein Verb.", "Man kann es steigern."]],
	["Ergebnis", "Die Nachsilbe -nis zeigt ein Nomen.", ["Man kann eine Personalform bilden.", "Es steht am Satzanfang."]],
	["Freundschaft", "Die Nachsilbe -schaft zeigt ein Nomen.", ["Man kann es steigern.", "Es ist ein Gefühlswort."]],
	["Müdigkeit", "Die Nachsilbe -keit zeigt ein Nomen.", ["Man kann es steigern.", "Man kann eine Personalform bilden."]],
	["Mut", "Man kann sagen: der große Mut.", ["Man kann es steigern.", "Man kann eine Personalform bilden."]],
];
const PHRASES: [string, string[]][] = [
	["mit großer Freude", ["mit großer freude", "mit Großer Freude"]],
	["voller Angst", ["voller angst", "Voller angst"]],
	["die schönste Überraschung", ["die schönste überraschung", "die Schönste überraschung"]],
	["eine gute Idee", ["eine gute idee", "eine Gute Idee"]],
	["viel Glück", ["viel glück", "Viel glück"]],
	["die Ehrlichkeit", ["die ehrlichkeit", "Die ehrlichkeit"]],
];

const gross: Lesson = {
	id: "grossschreibung",
	stage: "detektiv",
	title: "Groß oder klein? Nomen entlarven",
	skill: "Du erkennst Nomen mit Proben und schreibst sie groß.",
	lehrplan: "D3/4 4.4: Nominalkern erweitern, Wortbausteine, Satzzusammenhang",
	bindings: ["4.4-12", "4.4-11", "4.4-14"],
	sticker: { emoji: "👑", name: "Krone" },
	paragraphs: [
		"Groß schreibst du das erste Wort im Satz, alle Nomen und alle Namen. Bei den Nomen helfen dir drei Detektiv-Proben.",
		"Artikelprobe: Passt der, die oder das davor? → die Angst. Erweiterungsprobe: Kannst du ein Adjektiv davor setzen? → der Ball, der rote Ball, der rote neue Ball. Das Wort am Ende ist ein Nomen.",
		"Nachsilben-Probe: Wörter mit -ung, -heit, -keit, -nis und -schaft sind immer Nomen: die Hoffnung, die Gesundheit. Profi-Tipp: Auch ein Verb kann zum Nomen werden, wenn ein Begleiter davor steht: beim Lesen, das Schwimmen.",
	],
	example: {
		title: "Tinto prüft „angst“ im Satz „Das Kind hatte große angst.“",
		lines: [
			"Artikelprobe: die Angst ✓",
			"Erweiterungsprobe: große Angst ✓",
			"→ Nomen → groß: „Das Kind hatte große Angst.“",
		],
	},
	takeaway:
		"Groß: Satzanfang, Nomen, Namen. Nomen-Proben: Artikelprobe, Erweiterungsprobe (der rote Ball), Nachsilben -ung, -heit, -keit, -nis, -schaft.",
	terms: [
		{ term: "Artikelprobe", meaning: "der, die, das davor setzen" },
		{ term: "Erweiterungsprobe", meaning: "der Ball → der rote Ball" },
		{ term: "Nachsilben-Probe", meaning: "-ung, -heit, -keit, -nis, -schaft" },
	],
	check: {
		wrong: "Satzanfänge, Nomen und Adjektive",
		explanation: "Adjektive schreibst du klein, auch vor einem Nomen: die große Freude.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Die Kronen-Jagd",
			intro:
				"In Tintos Tagebuch ist alles klein geschrieben. Setze jedem Wort eine Krone auf, das großgeschrieben werden muss.",
			pens: [{ value: "G", label: "Krone: groß", colour: "orange" }],
			puzzles: [
				marks("reise", "tinto|G schreibt seiner freundin|G einen langen brief|G über seine reise|G nach italien|G ."),
				marks("dunkel", "die|G dunkelheit|G im wald|G machte den kindern|G große angst|G ."),
				marks("morgen", "am|G morgen|G sah lea|G die fröhliche überraschung|G auf dem tisch|G ."),
			],
		},
		[
			"Kröne im Reise-Satz jedes Wort, das großgeschrieben wird.",
			"Kröne im Wald-Satz jedes Wort, das großgeschrieben wird.",
			"Kröne im Morgen-Satz jedes Wort, das großgeschrieben wird.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const [lower, right] = pick(rng, CAPITAL);
				const lw = lower.replace(/\.$/, "").split(" ");
				const rw = right.replace(/\.$/, "").split(" ");
				const candidates = rw.map((w, i) => (i > 0 && w !== lw[i] ? i : -1)).filter((i) => i >= 0);
				const i = pick(rng, candidates);
				const small = lw.filter((w, k) => rw[k] === w && k > 0);
				return choice(rng, {
					prompt: "Welches Wort musst du großschreiben?",
					material: lower,
					answer: lw[i],
					wrong: shuffle(rng, small).slice(0, 3),
					hint: "Mache bei jedem Wort die Artikelprobe.",
					explanation: `„${rw[i]}“ ist ein Nomen oder Name.`,
					key: `gross1:${lower}:${i}`,
				});
			},
			(rng) => {
				const [word, right, wrong] = pick(rng, NOUN_SIGNS);
				return choice(rng, {
					prompt: `Woran erkennst du, dass „${word}“ ein Nomen ist?`,
					answer: right,
					wrong,
					hint: "Denk an die drei Nomen-Proben.",
					explanation: right,
					key: `probe:${word}`,
				});
			},
		],
		2: [
			(rng) => {
				const [lower, right] = pick(rng, CAPITAL);
				return text({
					prompt: "Schreibe den Satz richtig ab: mit großen Anfangsbuchstaben.",
					material: lower,
					accept: [right, right.replace(/\.$/, "")],
					hint: "Satzanfang, Nomen und Namen groß. Vergiss den Punkt nicht.",
					explanation: `Richtig: ${right}`,
					key: `gross2:${lower}`,
				});
			},
			(rng) => {
				const [right, wrong] = pick(rng, PHRASES);
				return choice(rng, {
					prompt: "Welche Schreibung ist richtig?",
					answer: right,
					wrong,
					hint: "Adjektive vor einem Nomen schreibst du klein, das Nomen groß.",
					explanation: `Richtig: ${right}.`,
					key: `phrase:${right}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

/* ---------- 7 Wörterbuch und Fehlerdetektiv ---------- */

const ABC_GROUPS: string[][] = [
	["Ball", "Baum", "Bank", "Bart"],
	["Hose", "Hund", "Haus", "Herz"],
	["Sonne", "Sand", "Seil", "Sofa"],
	["Mantel", "Maus", "Mama", "Markt"],
	["Tisch", "Tante", "Turm", "Tee"],
	["Kerze", "Katze", "Kiste", "Kuh"],
	["Fisch", "Feder", "Fahne", "Fuß"],
	["Regen", "Rabe", "Riese", "Rose"],
];
const LOOKUP: [string, string, string[]][] = [
	["er fährt", "fahren", ["fährt", "fuhr"]],
	["die Bäume", "Baum", ["Bäume", "Bäumen"]],
	["größer", "groß", ["größte", "Größe"]],
	["sie lief", "laufen", ["lief", "läuft"]],
	["die Häuser", "Haus", ["Häuser", "Häuschen"]],
	["wir aßen", "essen", ["aßen", "aß"]],
	["am besten", "gut", ["best", "besser"]],
	["du nimmst", "nehmen", ["nimmst", "nahm"]],
	["die Mäuse", "Maus", ["Mäuse", "Mäuserich"]],
	["er schrieb", "schreiben", ["schrieb", "Schrift"]],
];
const SPOT: [string[], string, string, string][] = [
	[["Hund", "Katze", "Pferd", "Vogl"], "Vogl", "Vogel", "In jeder Silbe steht ein Selbstlaut: Vo-gel."],
	[["Wiese", "Biene", "Spigel", "Riese"], "Spigel", "Spiegel", "Langes i → ie."],
	[["Zucker", "Jacke", "Wolcke", "Socke"], "Wolcke", "Wolke", "Nach l nie ck."],
	[["Hände", "Bälle", "Gläser", "Bleter"], "Bleter", "Blätter", "Ableiten: das Blatt → ä, kurzes ä → tt."],
	[["Berg", "Zwerg", "Wek", "Tag"], "Wek", "Weg", "Verlängern: die Wege."],
	[["Straße", "Fuß", "Wasser", "Kisen"], "Kisen", "Kissen", "Kurzes i → ss."],
	[["Katze", "Mütze", "Kertze", "Blitz"], "Kertze", "Kerze", "Nach r nie tz."],
	[["Bäume", "Häuser", "Meuse", "Träume"], "Meuse", "Mäuse", "Ableiten: die Maus → äu."],
];

function firstAlphabetical(words: string[]): string {
	return [...words].sort((a, b) => a.localeCompare(b, "de"))[0];
}

const woerterbuch: Lesson = {
	id: "woerterbuch-fehlerdetektiv",
	stage: "detektiv",
	title: "Wörterbuch und Fehlerdetektiv",
	skill: "Du schlägst Wörter nach und findest Fehler in Texten.",
	lehrplan: "D3/4 4.4 · 3.3: Wörterbuch nutzen, Texte überarbeiten",
	bindings: ["4.4-06", "4.4-03", "4.4-14", "3.3-03", "3.2-11"],
	sticker: { emoji: "📖", name: "Wörterbuch" },
	paragraphs: [
		"Im Wörterbuch stehen die Wörter nach dem Abc. Haben zwei Wörter den gleichen ersten Buchstaben, entscheidet der zweite, dann der dritte: Ball, Bank, Bart, Baum.",
		"Im Wörterbuch steht die Grundform. Verben suchst du in der Grundform (er fährt → fahren), Nomen in der Einzahl (die Bäume → Baum), Adjektive in der Grundform (größer → groß).",
		"Als Fehlerdetektiv liest du deinen Text langsam, Wort für Wort, am besten zweimal. Prüfe verdächtige Stellen mit deinen Tricks: verlängern, ableiten, Artikelprobe, kurz oder lang. Bei Merkwörtern hilft das Wörterbuch.",
	],
	example: {
		title: "Tinto ermittelt",
		lines: [
			"Verdächtig: „Der Hunt bellt.“",
			"Trick: verlängern → die Hunde → d",
			"Berichtigt: „Der Hund bellt.“",
			"Unsicher bei „Stuhl“? → Merkwort → im Wörterbuch nachschlagen.",
		],
	},
	takeaway:
		"Wörterbuch: Abc beachten (1., 2., 3. Buchstabe) und die Grundform suchen. Fehler finden: langsam lesen, Tricks anwenden, Merkwörter nachschlagen.",
	terms: [
		{ term: "Grundform", meaning: "so steht ein Wort im Wörterbuch: fahren, Baum, groß" },
		{ term: "Abc-Ordnung", meaning: "erst 1., dann 2., dann 3. Buchstabe" },
	],
	check: {
		wrong: "fährt",
		explanation: "Im Wörterbuch stehen Verben in der Grundform: fahren.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Fall für den Fehlerdetektiv",
			intro: "In Tintos Briefen haben sich Fehler versteckt. Markiere jedes falsch geschriebene Wort.",
			pens: [{ value: "X", label: "Fehler", colour: "red" }],
			puzzles: [
				marks("hund", "Gestern ist mein Hunt|X in den Wald gelaufen .", "Ein Fehler", "Verlängere die Wortenden."),
				marks("ball", "Die Kinder spilen|X mit dem Ball auf der Strasse|X .", "Zwei Fehler", "Lang oder kurz? ie? ß?"),
				marks("abend", "Am abend|X trinkt Tinto heise|X Schokolade .", "Zwei Fehler", "Artikelprobe und s-Laut."),
			],
		},
		[
			"Löse den ersten Fall: ein Fehler.",
			"Löse den zweiten Fall: zwei Fehler.",
			"Löse den dritten Fall: zwei Fehler.",
		],
	),
	generators: {
		1: [
			(rng) => {
				const group = shuffle(rng, pick(rng, ABC_GROUPS));
				const first = firstAlphabetical(group);
				return choice(rng, {
					prompt: "Welches Wort steht im Wörterbuch zuerst?",
					material: group.join(" · "),
					answer: first,
					wrong: group.filter((w) => w !== first),
					hint: "Der erste Buchstabe ist gleich. Vergleiche den zweiten, dann den dritten.",
					explanation: `Nach dem Abc: ${[...group].sort((a, b) => a.localeCompare(b, "de")).join(", ")}.`,
					key: `abc:${group.slice().sort().join()}`,
				});
			},
			(rng) => {
				const [form, base, wrong] = pick(rng, LOOKUP);
				return choice(rng, {
					prompt: "Unter welchem Wort schlägst du im Wörterbuch nach?",
					material: form,
					answer: base,
					wrong,
					hint: "Verben in der Grundform, Nomen in der Einzahl, Adjektive in der Grundform.",
					explanation: `„${form}“ findest du unter „${base}“.`,
					key: `nachschlagen:${form}`,
				});
			},
		],
		2: [
			(rng) => {
				const [form, base] = pick(rng, LOOKUP);
				return text({
					prompt: "Schreibe die Grundform auf, unter der du nachschlägst.",
					material: form,
					accept: [base],
					hint: "Verb → Grundform auf -en. Nomen → Einzahl ohne Artikel. Adjektiv → Grundform.",
					mistakes: Object.fromEntries(
						["der", "die", "das"].map((a) => [`${a} ${base}`, "Fast! Schreibe das Wort ohne Artikel."]),
					),
					explanation: `„${form}“ steht unter „${base}“.`,
					key: `grundform2:${form}`,
				});
			},
			(rng) => {
				const [words, wrong, right, why] = pick(rng, SPOT);
				return text({
					prompt: "Ein Wort ist falsch geschrieben. Schreibe es richtig auf.",
					material: shuffle(rng, words).join(" · "),
					accept: [right],
					hint: "Lies jedes Wort langsam. Welcher Detektiv-Trick passt?",
					explanation: `„${wrong}“ → „${right}“. ${why}`,
					mistakes: { [wrong]: "Dieses Wort ist das falsche. Schreibe es richtig." },
					key: `spot:${wrong}`,
				});
			},
		],
	},
	requiredCorrect: 3,
};

export const DETEKTIV: Lesson[] = [silben, kurz, lang, verlaengern, ableiten, gross, woerterbuch];
