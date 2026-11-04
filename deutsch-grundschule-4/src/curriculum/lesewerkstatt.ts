// Station 5 · Lesewerkstatt: Texte erschließen und verstehen (LehrplanPLUS
// Deutsch 3/4, 2.1, 2.3 und 2.4). Die Texte stehen in lesetexte.ts. Lautes Lesen,
// Gespräche über Bücher und Bibliotheksbesuche bleiben Praxis außerhalb der App.
import { choice, pick, text } from "../exercises/tasks";
import type { Lesson, MachineView, MachineWorkshop, Rng, Task } from "../types";
import { gaps, marks, slotWorkshop } from "./helpers";
import {
	type DataTable,
	FACT_TEXTS,
	type Passage,
	POEMS,
	type Question,
	STORIES,
	TABLES,
} from "./lesetexte";

const LITERAL_HINT = "Die Antwort steht fast wörtlich im Text. Suche das wichtige Wort aus der Frage.";
const DEEPER_HINT = "Das steht nicht wörtlich da. Lies die passende Stelle und überlege, was daraus folgt.";
const EXTRACT_HINT = "Suche die Stelle im Text und schreibe das Wort genau so ab.";

const passageOf = (p: Passage) => ({ title: p.title, paragraphs: p.paragraphs });

function ask(rng: Rng, source: { id: string }, q: Question, hint: string, extra: Pick<Task, "passage" | "table">): Task {
	return choice(rng, {
		prompt: q.q,
		answer: q.a,
		wrong: q.wrong,
		hint,
		explanation: q.why,
		key: `text:${source.id}:${q.q}`,
		...extra,
	});
}

function literal(rng: Rng, passages: Passage[]): Task {
	const p = pick(rng, passages);
	return ask(rng, p, pick(rng, p.literal), LITERAL_HINT, { passage: passageOf(p) });
}

function deeper(rng: Rng, passages: Passage[]): Task {
	const p = pick(rng, passages);
	return ask(rng, p, pick(rng, p.deeper), DEEPER_HINT, { passage: passageOf(p) });
}

function extract(rng: Rng, passages: Passage[]): Task {
	const p = pick(rng, passages);
	const e = pick(rng, p.extract);
	return text({
		prompt: e.q,
		passage: passageOf(p),
		accept: [e.a],
		hint: EXTRACT_HINT,
		explanation: e.why,
		key: `heraus:${p.id}:${e.a}`,
	});
}

const tableOf = (t: DataTable) => ({ title: t.title, head: t.head, rows: t.rows });

function tableTask(rng: Rng, list: "literal" | "deeper"): Task {
	const t = pick(rng, TABLES);
	return ask(
		rng,
		t,
		pick(rng, t[list]),
		list === "literal"
			? "Suche zuerst die passende Zeile, dann die passende Spalte."
			: "Vergleiche die Zahlen in der Spalte. Manchmal musst du auch rechnen.",
		{ table: tableOf(t) },
	);
}

/** Einfache Zuordnung: Prompt, Ausschnitt, richtige Antwort, falsche Antworten, Begründung. */
type Item = [string, string, string[], string];

function sort(rng: Rng, prompt: string, items: Item[], hint: string, key: string): Task {
	const [material, answer, wrong, why] = pick(rng, items);
	return choice(rng, {
		prompt,
		material,
		answer,
		wrong,
		hint,
		explanation: why,
		key: `${key}:${material}`,
	});
}

/* ---------- 1 Textarten ---------- */

const KINDS = ["Märchen", "Fabel", "Sage", "Gedicht", "Sachtext", "Rezept", "Anleitung"];
const others = (kind: string, ...more: string[]) => [...more, ...KINDS.filter((k) => k !== kind && !more.includes(k))].slice(0, 3);

const SNIPPETS: Item[] = [
	["Es war einmal ein armer Müller, der hatte drei Söhne. Eines Tages kam eine Fee an sein Haus.", "Märchen", others("Märchen", "Sage"), "Es war einmal und eine Fee sind typisch für Märchen."],
	["Eine kluge Prinzessin musste drei Rätsel lösen. Und wenn sie nicht gestorben ist, dann lebt sie noch heute.", "Märchen", others("Märchen", "Sage"), "Dieser Schlusssatz und die Rätsel sind typisch für Märchen."],
	["Der Hase prahlte vor der Maus: „Niemand ist so schnell wie ich!“ Am Ende hatte er nichts davon. Hochmut hilft dir nicht.", "Fabel", others("Fabel", "Märchen"), "Sprechende Tiere und eine Lehre am Schluss sind typisch für Fabeln."],
	["Die Krähe sagte zum Fuchs: „Teile mit mir, dann helfe ich dir.“ Das merkte sich der Fuchs. Wer teilt, findet Freunde.", "Fabel", others("Fabel", "Märchen"), "Tiere handeln wie Menschen, und der letzte Satz ist die Lehre."],
	["Auf dem Berg bei unserem Dorf soll früher ein Riese gewohnt haben. Noch heute zeigen die Leute den großen Stein, den er geworfen hat.", "Sage", others("Sage", "Märchen"), "Sagen erzählen von einem echten Ort oder Ding und erklären es mit einer alten Geschichte."],
	["In der Burgruine an der Donau soll nachts ein Ritter umgehen. So erzählen es die Menschen dort seit vielen Jahren.", "Sage", others("Sage", "Märchen"), "Ein echter Ort und „so erzählen es die Menschen“ sind typisch für Sagen."],
	["Der Wind, der pfeift ums alte Haus, / die Blätter fliegen weit hinaus.", "Gedicht", others("Gedicht", "Sachtext"), "Verse und Reime sind typisch für Gedichte."],
	["Der Mond schaut still durchs Fenster rein, / ich liege wach und bin allein.", "Gedicht", others("Gedicht", "Märchen"), "Verse und Reime sind typisch für Gedichte."],
	["Eichhörnchen leben in Wäldern und Parks. Sie fressen vor allem Nüsse und Samen.", "Sachtext", others("Sachtext", "Fabel"), "Der Text informiert sachlich über ein Tier. Es gibt keine Handlung."],
	["Die Donau fließt durch Bayern. Sie mündet weit im Osten ins Schwarze Meer.", "Sachtext", others("Sachtext", "Sage"), "Der Text nennt Tatsachen über einen Fluss."],
	["Du brauchst 200 g Mehl, 2 Eier und 300 ml Milch. Verrühre alles und backe es in der Pfanne.", "Rezept", others("Rezept", "Anleitung"), "Zutaten und Kochschritte sind typisch für Rezepte."],
	["Zutaten: 3 Äpfel, 1 Esslöffel Zucker. Schneide die Äpfel klein und koche sie weich.", "Rezept", others("Rezept", "Anleitung"), "Zutaten und Kochschritte sind typisch für Rezepte."],
	["Falte das Papier in der Mitte. Knicke die Ecken nach innen. Fertig ist dein Flieger.", "Anleitung", others("Anleitung", "Rezept"), "Schritte in der Du-Form erklären, wie man etwas herstellt."],
	["Lege zuerst den Spielplan auf den Tisch. Dann bekommt jedes Kind vier Figuren. Das jüngste Kind beginnt.", "Anleitung", others("Anleitung", "Sachtext"), "Der Text sagt Schritt für Schritt, wie das Spiel geht."],
];

const FEATURES: Item[] = [
	["ein Märchen", "Es spielt in keiner bestimmten Zeit, und es gibt Zauberei.", ["Es nennt genaue Zahlen und Tatsachen.", "Es besteht aus Zutaten und Schritten."], "Märchen spielen „einmal“ irgendwo und kennen Zauberei."],
	["eine Fabel", "Tiere sprechen, und es gibt eine Lehre.", ["Es gibt Zutaten und Kochschritte.", "Sie erklärt einen echten Ort."], "Fabeln lehren etwas mit sprechenden Tieren."],
	["eine Sage", "Sie erzählt von einem echten Ort, oft mit etwas Unglaublichem.", ["Sie besteht aus Versen und Reimen.", "Sie erklärt, wie ein Gerät funktioniert."], "Sagen knüpfen an echte Orte oder Menschen an."],
	["ein Gedicht", "Es hat Verse und oft Reime.", ["Es nennt die Schritte einer Bastelarbeit.", "Es hat immer eine Tabelle."], "Verse und Reime sind typisch für Gedichte."],
	["einen Sachtext", "Er informiert über Tatsachen.", ["Er beginnt mit „Es war einmal“.", "Er endet immer mit einem Reim."], "Sachtexte informieren."],
	["eine Anleitung", "Sie sagt Schritt für Schritt, was du tun sollst.", ["Sie erzählt von sprechenden Tieren.", "Sie hat immer Reime."], "Anleitungen führen dich durch Schritte."],
];

const PURPOSES: Item[] = [
	["Pfannkuchen für vier Personen", "um etwas nachzukochen", ["um eine spannende Geschichte zu erleben", "um Reime zu üben"], "Das klingt nach einem Rezept."],
	["So baust du ein Vogelhaus", "um etwas selbst zu bauen", ["um etwas über Märchen zu erfahren", "um mich zu gruseln"], "„So baust du“ kündigt eine Anleitung an."],
	["Wie Fledermäuse im Dunkeln fliegen", "um etwas Neues über ein Tier zu erfahren", ["um etwas nachzukochen", "um ein Spiel zu lernen"], "Diese Überschrift kündigt einen Sachtext an."],
	["Die Prinzessin und der sprechende Frosch", "um eine Geschichte zu genießen", ["um etwas nachzukochen", "um Tatsachen über Frösche zu lernen"], "Prinzessin und sprechender Frosch: Das klingt nach Märchen."],
	["Spielregeln für Mühle", "um zu erfahren, wie das Spiel geht", ["um mich zu gruseln", "um etwas über Mühlen am Bach zu lernen"], "Spielregeln sind eine Anleitung."],
	["Das Rätsel im Spukschloss", "um eine spannende Geschichte zu erleben", ["um etwas nachzubauen", "um eine Wetterkarte zu lesen"], "Die Überschrift verspricht Spannung."],
];

const textarten: Lesson = {
	id: "textarten-erkennen",
	stage: "lesewerkstatt",
	title: "Textarten erkennen",
	skill: "Du erkennst, was für ein Text vor dir liegt und was du von ihm erwarten kannst.",
	lehrplan: "D3/4 2.1 · 2.3: Textarten unterscheiden, Erwartungen formulieren",
	bindings: ["2.1-05", "2.3-02"],
	sticker: { emoji: "📚", name: "Textkenner" },
	paragraphs: [
		"Texte wollen Verschiedenes von dir. Eine Geschichte oder ein Gedicht möchte dich unterhalten oder berühren. Ein Sachtext informiert dich. Ein Rezept oder eine Anleitung sagt dir, was du tun sollst.",
		"Erzählende Texte erkennst du an ihrem Aufbau: Märchen haben oft Zauberei und beginnen mit „Es war einmal“. In Fabeln sprechen Tiere, und am Ende steht eine Lehre. Sagen erzählen von echten Orten und Menschen, oft mit etwas Unglaublichem. Gedichte haben Verse und oft Reime.",
		"Schau dir vor dem Lesen die Überschrift und die ersten Zeilen an. Dann weißt du schon viel: Was für ein Text ist das? Was erwarte ich? Welche Fragen habe ich?",
	],
	example: {
		title: "Tinto schaut zuerst genau hin",
		lines: [
			"Überschrift: So baust du ein Vogelhaus",
			"„So baust du“ → Das ist eine Anleitung.",
			"Ich erwarte: Material und Schritte.",
			"Meine Frage: Welches Werkzeug brauche ich?",
		],
	},
	takeaway:
		"Erzählende und poetische Texte unterhalten, Sachtexte informieren, Gebrauchstexte sagen dir, was zu tun ist. Überschrift und erste Zeilen verraten dir schon viel.",
	terms: [
		{ term: "Fabel", meaning: "kurze Erzählung mit sprechenden Tieren und einer Lehre" },
		{ term: "Sage", meaning: "alte Erzählung, die an einen echten Ort oder Menschen anknüpft" },
		{ term: "Gebrauchstext", meaning: "Text, mit dem du etwas tust: Rezept, Anleitung" },
	],
	check: {
		wrong: "ein Gedicht",
		explanation: "Zutaten und Schritte gehören zum Rezept. Rezepte sind Gebrauchstexte.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Der Text-Sortierer",
			intro: "Tinto hat Textstücke vermischt. Wähle einen Stift und tippe jedes Stück an: erzählend, sachlich oder zum Gebrauch?",
			pens: [
				{ value: "E", label: "erzählend oder poetisch", colour: "purple" },
				{ value: "S", label: "sachlich", colour: "blue" },
				{ value: "G", label: "Gebrauchstext", colour: "green" },
			],
			puzzles: [
				marks("eins", "Es_war_einmal_ein_König|E Igel_fressen_Käfer|S Schneide_die_Äpfel_klein|G", "Erste Karte", "Wer erzählt, wer informiert, wer sagt dir, was zu tun ist?"),
				marks("zwei", "Der_Fuchs_sprach_zum_Raben|E Falte_das_Papier_zweimal|G Die_Donau_fließt_durch_Bayern|S", "Zweite Karte", "Sprechen Tiere? Stehen da Tatsachen? Oder Schritte?"),
				marks("drei", "Die_Sonne_lacht,_der_Tag_erwacht|E Bienen_sammeln_Nektar|S Würfle_und_rücke_vor|G Die_Fee_schwang_ihren_Stab|E", "Dritte Karte", "Hier steht auch ein Reim. Gedichte gehören zu den poetischen Texten."),
			],
		},
		["Sortiere die erste Karte richtig.", "Sortiere die zweite Karte richtig.", "Sortiere die dritte Karte richtig."],
	),
	generators: {
		1: [
			(rng) => sort(rng, "Zu welcher Textart gehört dieser Ausschnitt?", SNIPPETS, "Achte auf typische Merkmale: Zauberei, sprechende Tiere, Reime, Tatsachen oder Schritte.", "ausschnitt"),
			(rng) => sort(rng, "Welches Merkmal ist typisch für diese Textart?", FEATURES, "Überlege, was du von diesem Text erwartest.", "merkmal"),
		],
		2: [
			(rng) => sort(rng, "Du siehst nur die Überschrift. Warum würdest du diesen Text lesen?", PURPOSES, "Die Überschrift verrät die Textart. Wozu ist diese Textart da?", "absicht"),
			(rng) => deeper(rng, STORIES.filter((s) => s.id === "fabel").concat(FACT_TEXTS.filter((f) => f.id === "zugspitze"))),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 2 Lesestrategien ---------- */

const STRATEGIES: Item[] = [
	["Ich lese die Überschrift und überlege, was ich schon weiß.", "vor dem Lesen", ["während des Lesens", "nach dem Lesen"], "Vorwissen holst du dir, bevor du anfängst."],
	["Ich schaue mir die Bilder an und stelle eine Frage an den Text.", "vor dem Lesen", ["während des Lesens", "nach dem Lesen"], "Bilder und Fragen bereiten das Lesen vor."],
	["Ich markiere die wichtigsten Wörter.", "während des Lesens", ["vor dem Lesen", "nach dem Lesen"], "Markieren geht nur, während du den Text vor dir hast."],
	["Ich stoppe bei einem unbekannten Wort und kläre es.", "während des Lesens", ["vor dem Lesen", "nach dem Lesen"], "Unbekannte Wörter klärst du gleich beim Lesen."],
	["Ich schreibe eine Notiz an den Rand.", "während des Lesens", ["vor dem Lesen", "nach dem Lesen"], "Randnotizen entstehen beim Lesen."],
	["Ich erzähle das Gelesene mit eigenen Worten.", "nach dem Lesen", ["vor dem Lesen", "während des Lesens"], "Nacherzählen zeigt am Schluss, was du verstanden hast."],
	["Ich prüfe, ob meine Fragen beantwortet sind.", "nach dem Lesen", ["vor dem Lesen", "während des Lesens"], "Das geht erst, wenn du den Text kennst."],
	["Ich überlege, was für mich neu war.", "nach dem Lesen", ["vor dem Lesen", "während des Lesens"], "Du vergleichst den Text mit dem, was du vorher wusstest."],
];

const CONTEXT_WORDS: Item[] = [
	["Der Igel ist nachtaktiv. Am Tag schläft er, erst abends wird er munter. Was bedeutet „nachtaktiv“?", "nachts wach und unterwegs", ["nachts besonders müde", "nur im Sommer wach"], "Der Satz danach erklärt das Wort."],
	["Die Bären verbrachten den Winter im Gehege. Es war mit einem hohen Zaun umgeben. Was ist ein „Gehege“?", "ein eingezäuntes Gelände für Tiere", ["ein kleiner Wald ohne Zaun", "ein Futter für Bären"], "Der hohe Zaun im nächsten Satz hilft dir."],
	["Der Ritter trug eine Rüstung aus Eisen. Kein Pfeil kam durch sie hindurch. Was ist eine „Rüstung“?", "eine harte Schutzkleidung", ["ein großes Pferd", "ein spitzer Pfeil"], "„Aus Eisen“ und „kein Pfeil kam durch“ erklären das Wort."],
	["Nach dem Regen führte der Bach Hochwasser. Das Wasser überflutete die Wiese. Was heißt „überflutete“?", "Das Wasser bedeckte die Wiese.", ["Das Wasser floss ganz langsam ab.", "Die Wiese wurde gemäht."], "Beim Hochwasser steigt das Wasser über das Ufer."],
	["Lea war erschöpft. Nach der langen Wanderung konnte sie kaum noch stehen. Was bedeutet „erschöpft“?", "sehr müde und ohne Kraft", ["sehr fröhlich", "sehr hungrig"], "„Konnte kaum noch stehen“ zeigt, was gemeint ist."],
	["Der Bäcker knetet den Teig kräftig. Dann lässt er ihn in Ruhe gehen. Was bedeutet „gehen“ hier?", "Der Teig wird größer.", ["Der Teig läuft davon.", "Der Bäcker geht nach Hause."], "Im Zusammenhang mit Teig hat „gehen“ eine eigene Bedeutung. Im Zweifel schlägst du nach."],
];

const lesestrategien: Lesson = {
	id: "lesestrategien",
	stage: "lesewerkstatt",
	title: "Mit Strategien lesen",
	skill: "Du weißt, was du vor, während und nach dem Lesen tun kannst, um einen Text zu verstehen.",
	lehrplan: "D3/4 2.3: Lesestrategien, zentrale Informationen markieren, Wörter klären",
	bindings: ["2.3-01", "2.3-03", "2.3-04", "2.3-08"],
	sticker: { emoji: "🖍️", name: "Textmarker" },
	paragraphs: [
		"Gute Leserinnen und Leser tun mehr als nur lesen. Vor dem Lesen schauen sie auf Überschrift und Bilder und fragen sich: Was weiß ich schon? Was will ich wissen?",
		"Beim Lesen markieren sie nur die wichtigsten Wörter, nicht ganze Absätze. Ein unbekanntes Wort klären sie aus dem Zusammenhang: Oft erklärt der Satz davor oder danach das Wort. Hilft das nicht, fragen sie nach oder schlagen im Wörterbuch nach.",
		"Nach dem Lesen prüfen sie: Sind meine Fragen beantwortet? Was war neu für mich? Können sie den Text mit eigenen Worten wiedergeben, haben sie ihn verstanden.",
	],
	example: {
		title: "Tinto liest „Der Igel“",
		lines: [
			"Vorher: Ich weiß, dass Igel Stacheln haben. Was fressen sie?",
			"Dabei: Ich markiere Käfer, Raupen, Würmer, Schnecken.",
			"Unbekannt: nachtaktiv. Der Satz danach erklärt es.",
			"Nachher: Meine Frage ist beantwortet. Neu war der Winterschlaf.",
		],
	},
	takeaway:
		"Vorher: Überschrift lesen, Vorwissen holen, Fragen stellen. Dabei: Wichtiges markieren, Wörter klären. Nachher: Fragen prüfen und mit eigenen Worten wiedergeben.",
	terms: [
		{ term: "Lesestrategie", meaning: "ein Schritt, der dir hilft, einen Text besser zu verstehen" },
		{ term: "Schlüsselwort", meaning: "ein Wort, das eine wichtige Information enthält" },
		{ term: "Zusammenhang", meaning: "die Sätze rund um ein Wort, die seine Bedeutung zeigen" },
	],
	check: {
		wrong: "den ganzen Absatz",
		explanation: "Markierst du alles, fällt nichts mehr auf. Nur Schlüsselwörter helfen dir beim Wiederfinden.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Tintos Textmarker",
			intro: "Lies die Frage über jedem Satz. Markiere dann nur die Wörter, die die Frage beantworten.",
			pens: [{ value: "M", label: "Textmarker", colour: "orange" }],
			puzzles: [
				marks("versteck", "Am Tag schläft der Igel in einem Versteck_aus_Laub|M .", "Wo schläft der Igel am Tag?", "Markiere nur den Ort, nicht den ganzen Satz."),
				marks("honig", "Aus dem Nektar|M entsteht im Stock der Honig .", "Woraus entsteht der Honig?", "Suche, was zu Honig wird."),
				marks("berg", "Die Zugspitze ist mit 2962_Metern|M der höchste Berg Deutschlands .", "Wie hoch ist die Zugspitze?", "Markiere die Zahl mit ihrer Einheit."),
			],
		},
		["Markiere die Antwort im Igel-Satz.", "Markiere die Antwort im Honig-Satz.", "Markiere die Antwort im Berg-Satz."],
	),
	generators: {
		1: [
			(rng) => sort(rng, "Wann nutzt du diese Lesestrategie?", STRATEGIES, "Geht das schon, bevor du den Text gelesen hast? Oder erst danach?", "strategie"),
			(rng) => literal(rng, FACT_TEXTS),
		],
		2: [
			(rng) => sort(rng, "Kläre das Wort aus dem Zusammenhang.", CONTEXT_WORDS, "Lies den Satz davor und danach. Sie erklären das Wort.", "wortklaeren"),
			(rng) => extract(rng, FACT_TEXTS),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 3 Sachtexte und Tabellen ---------- */

const RESEARCH: Item[] = [
	["Du willst wissen, auf welcher Seite in deinem Tierbuch das Kapitel „Vögel“ beginnt.", "im Inhaltsverzeichnis vorn im Buch", ["auf der letzten Seite der Geschichte", "auf dem Buchrücken"], "Das Inhaltsverzeichnis nennt die Kapitel mit ihren Seiten."],
	["Du suchst im dicken Tierlexikon nur das Wort „Fledermaus“.", "im Stichwortverzeichnis nach dem Abc", ["im Vorwort", "bei den Bildern auf Seite 1"], "Das Stichwortverzeichnis nennt einzelne Wörter und ihre Seiten."],
	["Du willst in einer Kindersuchmaschine etwas über den Winterschlaf der Igel erfahren.", "Igel Winterschlaf", ["Hallo, ich habe da mal eine Frage an dich", "Tiere"], "Wenige genaue Stichwörter führen am schnellsten zum Ziel."],
	["Du willst in einer Kindersuchmaschine die Höhe der Zugspitze finden.", "Zugspitze Höhe", ["Berge", "Wie geht es dir heute"], "Wenige genaue Stichwörter führen am schnellsten zum Ziel."],
	["Du hast mehrere Treffer gefunden. Einer ist von einer Kinderseite über Tiere, einer eine Werbung für Tierfutter.", "die Kinderseite über Tiere", ["die Werbung für Tierfutter", "immer den allerletzten Treffer"], "Werbung will dir etwas verkaufen. Du suchst aber sachliche Informationen."],
	["Du willst schnell wissen, wie viele Kinder in deiner Klasse Geburtstag im Mai haben. Lea hat es aufgeschrieben.", "in Leas Tabelle", ["in einem Märchenbuch", "in einem Rezept"], "Geordnete Angaben findest du am schnellsten in einer Tabelle."],
];

const WEATHER: Record<string, { temperatur: number; regen: number }> = {
	Montag: { temperatur: 12, regen: 0 },
	Dienstag: { temperatur: 15, regen: 2 },
	Mittwoch: { temperatur: 18, regen: 0 },
	Donnerstag: { temperatur: 14, regen: 6 },
	Freitag: { temperatur: 9, regen: 4 },
};

function weatherView(values: Record<string, string>): MachineView {
	const day = WEATHER[values.tag];
	const reading = values.spalte === "Temperatur" ? `${day.temperatur} °C` : `${day.regen} mm Regen`;
	const key = `${values.tag}:${values.spalte}`;
	const found = key === "Mittwoch:Temperatur" ? "warm" : key === "Donnerstag:Regen" ? "nass" : key === "Montag:Regen" || key === "Mittwoch:Regen" ? "trocken" : undefined;
	return {
		display: `${values.tag}: ${reading}`,
		note: found ? "Genau das hast du gesucht." : "Lies Zeile und Spalte. Stelle dann einen anderen Wert ein und vergleiche.",
		found,
		tone: found ? "ok" : undefined,
	};
}

const weatherMachine: MachineWorkshop = {
	kind: "machine",
	title: "Die Tabellen-Lupe",
	intro: "Die Lupe zeigt immer nur ein Feld der Wettertabelle. Wähle einen Tag und eine Spalte und finde die drei gesuchten Werte.",
	controls: [
		{ id: "tag", label: "Zeile: Tag", options: Object.keys(WEATHER) },
		{ id: "spalte", label: "Spalte", options: ["Temperatur", "Regen"] },
	],
	initial: { tag: "Montag", spalte: "Temperatur" },
	view: weatherView,
	goals: [
		{ id: "warm", label: "Finde die höchste Temperatur der Woche.", reached: (state) => state.found.includes("warm") },
		{ id: "nass", label: "Finde den Tag mit dem meisten Regen.", reached: (state) => state.found.includes("nass") },
		{ id: "trocken", label: "Finde einen Tag ganz ohne Regen.", reached: (state) => state.found.includes("trocken") },
	],
};

const sachtexte: Lesson = {
	id: "sachtexte-tabellen",
	stage: "lesewerkstatt",
	title: "Sachtexte, Tabellen und Diagramme",
	skill: "Du findest Informationen in Sachtexten, Tabellen und Diagrammen und bringst sie in Beziehung.",
	lehrplan: "D3/4 2.3 · 2.4: Sachtexte und Diagramme verstehen, recherchieren, Abläufe darstellen",
	bindings: ["2.3-05", "2.3-06", "2.3-09", "2.4-01"],
	sticker: { emoji: "📊", name: "Daten-Lupe" },
	paragraphs: [
		"Ein Sachtext ist in Absätze gegliedert. Jeder Absatz hat ein eigenes Thema. Findest du für jeden Absatz eine kurze Überschrift, kannst du den Text gut mit eigenen Worten wiedergeben.",
		"Tabellen und Diagramme zeigen Angaben geordnet. In einer Tabelle suchst du zuerst die passende Zeile, dann die Spalte. In einem Balkendiagramm vergleichst du die Längen der Balken. Oft musst du zwei Angaben vergleichen oder zusammenrechnen.",
		"Abläufe kannst du mit Pfeilen aufzeichnen, zum Beispiel den Weg des Wassers: verdunsten → aufsteigen → Wolke → Regen → Fluss → Meer. Suchst du selbst etwas, nutze Inhaltsverzeichnis, Stichwortverzeichnis oder wenige genaue Suchwörter.",
	],
	example: {
		title: "Tinto liest eine Tabelle",
		lines: [
			"Frage: Wie warm war es am Dienstag?",
			"Zeile: Dienstag. Spalte: Temperatur.",
			"Antwort: 15 °C.",
			"Vergleich: Am Mittwoch war es 3 °C wärmer.",
		],
	},
	takeaway:
		"Gib jedem Absatz eine kurze Überschrift. Lies Tabellen über Zeile und Spalte und vergleiche die Werte. Zeichne Abläufe mit Pfeilen. Suche mit wenigen genauen Stichwörtern.",
	terms: [
		{ term: "Absatz", meaning: "ein Textstück zu einem Thema" },
		{ term: "Spalte und Zeile", meaning: "Spalten laufen von oben nach unten, Zeilen von links nach rechts" },
		{ term: "Stichwortverzeichnis", meaning: "Liste von Wörtern nach dem Abc mit ihren Seiten" },
	],
	check: {
		wrong: "im Vorwort",
		explanation: "Einzelne Wörter findest du am schnellsten im Stichwortverzeichnis nach dem Abc.",
	},
	workshop: weatherMachine,
	generators: {
		1: [
			(rng) => tableTask(rng, "literal"),
			(rng) => literal(rng, FACT_TEXTS),
			(rng) => sort(rng, "Wo suchst du am besten?", RESEARCH.slice(0, 2).concat(RESEARCH.slice(5)), "Was willst du finden: ein Kapitel, ein einzelnes Wort oder eine geordnete Angabe?", "suchen"),
		],
		2: [
			(rng) => tableTask(rng, "deeper"),
			(rng) => deeper(rng, FACT_TEXTS),
			(rng) => sort(rng, "Was ist hier die beste Wahl?", RESEARCH.slice(2, 5), "Wenige genaue Wörter führen zum Ziel. Werbung will dir etwas verkaufen.", "recherche"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 4 Geschichten ---------- */

const geschichten: Lesson = {
	id: "geschichten-verstehen",
	stage: "lesewerkstatt",
	title: "Geschichten verstehen",
	skill: "Du beschreibst Figuren, Orte und Handlung einer Geschichte und erkennst, was sie spannend macht.",
	lehrplan: "D3/4 2.3 · 2.4: Figuren, Orte und Handlung, Handlungsverlauf, auslösendes Ereignis",
	bindings: ["2.3-07", "2.4-01", "2.4-02", "2.4-04"],
	sticker: { emoji: "📖", name: "Geschichtenfinder" },
	paragraphs: [
		"Jede Geschichte hat Figuren, Orte und eine Handlung. Frag dich beim Lesen: Wer kommt vor? Wo spielt es? Was passiert?",
		"Meist bringt ein besonderes Ereignis die Handlung in Gang: Jemand findet etwas, eine fremde Figur taucht auf, oder etwas geht schief. Ab da wird es spannend. Am Schluss löst sich oft etwas auf. Diesen Verlauf kannst du dir mit Pfeilen aufzeichnen.",
		"Auch Orte sind wichtig. Ein Brunnen, ein Turm oder ein Wald können ein Geheimnis verbergen. Vergleiche die Geschichte auch mit dir selbst: Hast du so etwas schon erlebt?",
	],
	example: {
		title: "Tinto zeichnet einen Pfeil-Plan",
		lines: [
			"Anfang: Mia besucht ihre Oma.",
			"Auslöser: Im Brunnen blitzt etwas. →",
			"Spannung: Sie angeln einen Schlüssel heraus. →",
			"Schluss: In der Truhe liegen alte Fotos.",
		],
	},
	takeaway:
		"Wer? Wo? Was passiert? Suche das Ereignis, das die Handlung in Gang bringt, und zeichne den Verlauf mit Pfeilen auf. Überlege, welche Rolle der Ort spielt.",
	terms: [
		{ term: "Figur", meaning: "eine Person oder ein Wesen, das in einer Geschichte handelt" },
		{ term: "Handlung", meaning: "das, was in einer Geschichte der Reihe nach passiert" },
		{ term: "Auslöser", meaning: "das Ereignis, das die Handlung in Gang bringt" },
	],
	check: {
		wrong: "der letzte Satz",
		explanation: "Der Auslöser steht am Anfang der Spannung. Ohne ihn gäbe es die Handlung nicht.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Der Pfeil-Plan",
			intro: "Die Sätze sind durcheinandergeraten. Gib jedem Satz seine Nummer in der richtigen Reihenfolge.",
			pens: [],
			puzzles: [
				gaps("brunnen", "{3|1|2} Sie angeln einen Schlüssel heraus. {1|2|3} Mia sieht etwas im Brunnen blitzen. {2|1|3} Sie holt Oma und einen Stock.", "Der Schlüssel im Brunnen", "Was muss zuerst passieren, damit das Nächste möglich ist?"),
				gaps("drachen", "{2|1|3|4} Tims Drachen hängt im Baum. {4|1|2|3} Tim lädt Ben zum Basteln ein. {1|2|3|4} Ben steht allein am Zaun. {3|1|2|4} Ben holt den Drachen herunter.", "Der neue Junge", "Beginne mit der Lage am Anfang."),
				gaps("fabel", "{3|1|2} Die Schnecke bleibt in ihrem Haus trocken. {1|2|3} Die Schwalbe lacht über die Schnecke. {2|1|3} Ein Sturm zieht auf.", "Die Schnecke und die Schwalbe", "Worüber wird zuerst erzählt?"),
			],
		},
		["Bringe „Der Schlüssel im Brunnen“ in die richtige Reihenfolge.", "Bringe „Der neue Junge“ in die richtige Reihenfolge.", "Bringe die Fabel in die richtige Reihenfolge."],
	),
	generators: {
		1: [(rng) => literal(rng, STORIES), (rng) => extract(rng, STORIES.filter((s) => s.id === "brunnen"))],
		2: [(rng) => deeper(rng, STORIES), (rng) => extract(rng, STORIES.filter((s) => s.id !== "brunnen"))],
	},
	requiredCorrect: 3,
};

/* ---------- 5 Figuren ---------- */

const FIGURE_KINDS: Item[] = [
	["Lars hat rote Haare und eine große Brille.", "Äußeres", ["Wesen", "Handeln"], "Haare und Brille kannst du sehen."],
	["Emma trägt immer eine zerrissene Jeans.", "Äußeres", ["Wesen", "Beziehung"], "Kleidung gehört zum Aussehen."],
	["Paul ist sehr klein und hat Sommersprossen.", "Äußeres", ["Wesen", "Handeln"], "Größe und Sommersprossen kannst du sehen."],
	["Nina ist mutig und gibt nie auf.", "Wesen", ["Äußeres", "Beziehung"], "Mut ist eine Eigenschaft, die zu Nina gehört."],
	["Finn ist sehr schüchtern.", "Wesen", ["Äußeres", "Handeln"], "Schüchtern beschreibt, wie Finn ist."],
	["Oma Hilde ist immer freundlich und geduldig.", "Wesen", ["Äußeres", "Beziehung"], "Freundlich und geduldig beschreiben ihr Wesen."],
	["Lena rettet die Katze vom Dach.", "Handeln", ["Äußeres", "Beziehung"], "Der Satz sagt, was Lena tut."],
	["Jonas teilt sein Pausenbrot.", "Handeln", ["Äußeres", "Wesen"], "Der Satz sagt, was Jonas tut."],
	["Der Ritter öffnet das schwere Tor.", "Handeln", ["Äußeres", "Beziehung"], "Der Satz sagt, was der Ritter tut."],
	["Sara ist Toms beste Freundin.", "Beziehung", ["Wesen", "Handeln"], "Der Satz sagt, wie die beiden zueinander stehen."],
	["Der König ist der Vater der Prinzessin.", "Beziehung", ["Äußeres", "Handeln"], "Der Satz sagt, wie die beiden verwandt sind."],
	["Die Brüder streiten sich oft.", "Beziehung", ["Äußeres", "Wesen"], "Der Satz sagt, wie die Brüder miteinander umgehen."],
];

const figuren: Lesson = {
	id: "figuren-verstehen",
	stage: "lesewerkstatt",
	title: "Figuren genau kennenlernen",
	skill: "Du beschreibst eine Figur genau und versetzt dich in ihre Sicht.",
	lehrplan: "D3/4 2.4: Figuren nach Äußerem, Wesen, Handeln und Beziehungen beschreiben",
	bindings: ["2.4-03", "2.3-07"],
	sticker: { emoji: "🎭", name: "Figurenkenner" },
	paragraphs: [
		"Eine Figur kannst du von vier Seiten beschreiben: ihr Äußeres, also wie sie aussieht. Ihr Wesen, also wie sie ist. Ihr Handeln, also was sie tut. Und ihre Beziehungen, also wie sie zu anderen steht.",
		"Oft steht das Wesen nicht direkt im Text. Du erschließt es aus dem Handeln: Wer ein Kind tröstet, ist wohl freundlich. Wer allein am Zaun steht und schweigt, ist vielleicht einsam.",
		"Versetze dich in die Figur hinein. Frag dich: Wie würde ich mich an ihrer Stelle fühlen? Was würde sie jetzt sagen? So verstehst du auch, warum sie so handelt.",
	],
	example: {
		title: "Tinto beschreibt Ben",
		lines: [
			"Wesen: schüchtern, weil er kaum ein Wort sagt.",
			"Handeln: Er holt den Drachen vom Baum.",
			"Beziehung: Tim lädt ihn ein, sie freunden sich an.",
			"Bens Sicht: „Endlich gehöre ich dazu.“",
		],
	},
	takeaway:
		"Beschreibe Äußeres, Wesen, Handeln und Beziehungen einer Figur. Schließe vom Handeln auf das Wesen und überlege, wie die Figur die Sache selbst sieht.",
	terms: [
		{ term: "Wesen", meaning: "wie eine Figur ist: mutig, schüchtern, freundlich" },
		{ term: "Sichtweise", meaning: "wie eine Figur eine Sache sieht und erlebt" },
	],
	check: {
		wrong: "seine Beziehung",
		explanation: "Mutig beschreibt, wie jemand ist. Das nennt man das Wesen einer Figur.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Die Figuren-Karte",
			intro: "Wähle einen Stift und ordne jede Angabe zu: Äußeres, Wesen, Handeln oder Beziehung?",
			pens: [
				{ value: "A", label: "Äußeres", colour: "blue" },
				{ value: "W", label: "Wesen", colour: "purple" },
				{ value: "H", label: "Handeln", colour: "green" },
				{ value: "B", label: "Beziehung", colour: "orange" },
			],
			puzzles: [
				marks("nele", "hat_lange_Zöpfe|A ist_neugierig|W klettert_auf_den_Turm|H", "Nele", "Was kannst du sehen, was ist sie, was tut sie?"),
				marks("omar", "trägt_eine_blaue_Mütze|A ist_Neles_Bruder|B ist_vorsichtig|W", "Omar", "Eine Angabe verrät, wie Omar zu Nele steht."),
				marks("kater", "hat_nur_ein_Ohr|A ist_frech|W stiehlt_die_Wurst|H ist_Neles_Freund|B", "Kater Moritz", "Jede der vier Seiten kommt einmal vor."),
			],
		},
		["Fülle die Karte von Nele richtig aus.", "Fülle die Karte von Omar richtig aus.", "Fülle die Karte von Kater Moritz richtig aus."],
	),
	generators: {
		1: [
			(rng) => sort(rng, "Was beschreibt dieser Satz an der Figur?", FIGURE_KINDS, "Aussehen, Eigenschaft, Tat oder Verhältnis zu anderen?", "figur"),
			(rng) => literal(rng, STORIES.filter((s) => s.id === "drachen")),
		],
		2: [
			(rng) => deeper(rng, STORIES.filter((s) => s.id === "drachen" || s.id === "brunnen")),
			(rng) => extract(rng, STORIES.filter((s) => s.id === "drachen")),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 6 Sprachbilder und Gedichte ---------- */

const IDIOMS: Item[] = [
	["jemandem die Daumen drücken", "jemandem Glück wünschen", ["jemandem wehtun", "jemandem die Hand schütteln"], "Das ist ein Sprachbild: Niemand drückt dabei wirklich fremde Daumen."],
	["jemandem einen Bären aufbinden", "jemandem etwas Unwahres erzählen", ["jemandem beim Tragen helfen", "jemandem ein Stofftier schenken"], "Gemeint ist kein echter Bär, sondern eine erfundene Geschichte."],
	["ins Wasser fallen", "nicht stattfinden", ["baden gehen", "sehr nass werden"], "„Das Fest fällt ins Wasser“ heißt: Es fällt aus."],
	["Tomaten auf den Augen haben", "etwas nicht bemerken", ["sehr gern Salat essen", "rote Augen haben"], "Wer etwas Offensichtliches übersieht, hat „Tomaten auf den Augen“."],
	["zwei linke Hände haben", "ungeschickt sein", ["Linkshänder sein", "beim Klatschen falsch stehen"], "Gemeint ist: Beim Basteln oder Bauen klappt wenig."],
	["den Kopf in den Sand stecken", "ein Problem nicht sehen wollen", ["am Strand spielen", "sehr müde sein"], "Wer so handelt, will die Schwierigkeit nicht wahrhaben."],
	["die Katze aus dem Sack lassen", "ein Geheimnis verraten", ["eine Katze befreien", "etwas verlieren"], "Gemeint ist kein Tier: Etwas Verborgenes kommt ans Licht."],
	["Übung macht den Meister.", "Wer oft übt, wird immer besser.", ["Nur Meister dürfen üben.", "Wer übt, braucht keinen Lehrer."], "Das Sprichwort macht Mut, dranzubleiben."],
	["Aller Anfang ist schwer.", "Neues fällt am Beginn oft schwer.", ["Man sollte nichts Neues beginnen.", "Nur schwere Dinge lohnen sich."], "Das Sprichwort tröstet, wenn etwas noch nicht klappt."],
	["Lügen haben kurze Beine.", "Lügen kommen schnell heraus.", ["Wer lügt, ist klein.", "Lügen sind nicht schlimm."], "Eine Lüge kommt nicht weit."],
];

const SITUATIONS: Item[] = [
	["Lea hat am Montag ihre Lesevorstellung. Ben sagt am Sonntag zu ihr:", "„Ich drücke dir die Daumen!“", ["„Du hast zwei linke Hände!“", "„Das fällt ins Wasser!“"], "Ben wünscht ihr Glück."],
	["Das Sommerfest kann wegen des Sturms nicht stattfinden. Die Lehrerin sagt:", "„Das Fest fällt leider ins Wasser.“", ["„Wir lassen die Katze aus dem Sack.“", "„Wir drücken die Daumen.“"], "Das Fest fällt aus. Dazu passt das Sprachbild."],
	["Tim sucht seine Brille und trägt sie schon auf der Nase. Mia lacht:", "„Hast du Tomaten auf den Augen?“", ["„Lügen haben kurze Beine.“", "„Aller Anfang ist schwer.“"], "Tim übersieht etwas ganz Offensichtliches."],
	["Jonas verrät schon vor dem Geburtstag, was das Geschenk ist. Seine Schwester ruft:", "„Jetzt hast du die Katze aus dem Sack gelassen!“", ["„Du hast zwei linke Hände!“", "„Übung macht den Meister!“"], "Jonas hat das Geheimnis verraten."],
	["Lea übt schon lange Geige. Heute klingt das Lied zum ersten Mal schön. Ihre Lehrerin sagt:", "„Übung macht den Meister!“", ["„Lügen haben kurze Beine!“", "„Du steckst den Kopf in den Sand!“"], "Leas Üben hat sich gelohnt."],
	["Ben behauptet, er habe einen Löwen gestreichelt. Das stimmt nicht. Ein paar Tage später fliegt es auf. Oma sagt:", "„Lügen haben kurze Beine.“", ["„Aller Anfang ist schwer.“", "„Ich drücke dir die Daumen.“"], "Die Unwahrheit ist schnell herausgekommen."],
];

const sprachbilder: Lesson = {
	id: "sprachbilder-gedichte",
	stage: "lesewerkstatt",
	title: "Sprachbilder und Gedichte",
	skill: "Du erklärst Redewendungen und Sprichwörter und erkennst Reime und Stimmung in Gedichten.",
	lehrplan: "D3/4 2.4: Redewendungen und Sprichwörter erklären, Verse und Gedichte erschließen",
	bindings: ["2.4-05", "2.4-07"],
	sticker: { emoji: "🌈", name: "Sprachbild" },
	paragraphs: [
		"Manche Sätze meinen etwas anderes, als die Wörter sagen. Wer „ins Wasser fällt“, muss nicht nass werden: Das Fest findet einfach nicht statt. Solche Sprachbilder heißen Redewendungen. Ihre Bedeutung erkennst du aus dem Zusammenhang.",
		"Sprichwörter sind feste kurze Sätze mit einem Rat oder einer Erfahrung: Übung macht den Meister. Erkläre sie mit eigenen Worten.",
		"Gedichte haben Verse, also Zeilen mit einem eigenen Rhythmus. Reimwörter klingen am Ende gleich: Bett und Fensterbrett. Lies Gedichte laut, klopfe den Rhythmus mit und achte darauf, welche Stimmung sie erzeugen.",
	],
	example: {
		title: "Tinto erklärt ein Sprachbild",
		lines: [
			"Satz: Das Fest fällt ins Wasser.",
			"Wörtlich: Ein Fest kann nicht baden.",
			"Zusammenhang: Es regnet und stürmt.",
			"Gemeint: Das Fest findet nicht statt.",
		],
	},
	takeaway:
		"Redewendungen und Sprichwörter meinen mehr, als die Wörter sagen: Erkläre sie aus dem Zusammenhang. Gedichte haben Verse, Reime und einen Rhythmus, den du beim lauten Lesen hörst.",
	terms: [
		{ term: "Redewendung", meaning: "feste Wortgruppe mit übertragener Bedeutung: ins Wasser fallen" },
		{ term: "Sprichwort", meaning: "fester Satz mit einem Rat oder einer Erfahrung" },
		{ term: "Vers", meaning: "eine Zeile in einem Gedicht" },
	],
	check: {
		wrong: "Es wird ans Meer verlegt.",
		explanation: "„Ins Wasser fallen“ ist ein Sprachbild. Gemeint ist, dass etwas nicht stattfindet.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Die Reim-Werkstatt",
			intro: "In Tintos kleinen Gedichten fehlt jeweils ein Reimwort. Wähle das Wort, das am Ende gleich klingt. Lies die Zeilen danach laut.",
			pens: [],
			puzzles: [
				gaps("katze", "Die Katze schläft im warmen Haus und träumt von einer fetten {Maus|Ratte|Schnecke}.", "Die Katze", "Welches Wort klingt wie Haus?"),
				gaps("wind", "Der Wind, der weht das Laub vom Baum, ich sehe meinen Drachen {kaum|nicht|mehr}.", "Der Wind", "Welches Wort klingt wie Baum?"),
				gaps("mond", "Der Mond schaut in mein Zimmer rein, er will wohl auch heut bei mir {sein|bleiben|schlafen}.", "Der Mond", "Welches Wort klingt wie rein?"),
			],
		},
		["Finde das Reimwort im Katzen-Gedicht.", "Finde das Reimwort im Wind-Gedicht.", "Finde das Reimwort im Mond-Gedicht."],
	),
	generators: {
		1: [
			(rng) => sort(rng, "Was bedeutet dieser Ausdruck?", IDIOMS, "Das ist nicht wörtlich gemeint. Stell dir vor, wann jemand das sagen würde.", "sprachbild"),
			(rng) => literal(rng, POEMS),
		],
		2: [
			(rng) => sort(rng, "Welcher Ausdruck passt zu dieser Lage?", SITUATIONS, "Überlege, was hier gerade passiert. Welcher Ausdruck meint genau das?", "lage"),
			(rng) => extract(rng, POEMS),
			(rng) => deeper(rng, POEMS),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 7 Medien ---------- */

const FORMATS: Item[] = [
	["Eine Moderatorin erklärt, was heute in der Welt passiert ist.", "Kindernachrichten", ["Kinderserie", "Quizsendung"], "Nachrichten informieren über aktuelle Ereignisse."],
	["Ein Sprecher zeigt mit Trickbildern, wie ein Vulkan ausbricht.", "Wissenssendung", ["Kindernachrichten", "Kinderserie"], "Wissenssendungen erklären, wie etwas funktioniert."],
	["Zwei Teams beantworten Fragen und sammeln Punkte.", "Quizsendung", ["Wissenssendung", "Kinderserie"], "In Quizsendungen wird um Punkte gerätselt."],
	["Jede Woche erlebt dieselbe Bande eine neue erfundene Geschichte.", "Kinderserie", ["Kindernachrichten", "Quizsendung"], "Serien erzählen erfundene Folgen mit denselben Figuren."],
];

const VERSIONS: Item[] = [
	["Du hörst ein Märchen als Hörspiel. Was kommt dazu, was im Buch fehlt?", "Stimmen, Geräusche und Musik", ["bunte Bilder", "Sprechblasen"], "Ein Hörspiel erzählt nur mit dem, was du hören kannst."],
	["Du siehst ein Märchen als Film. Was fehlt, wenn du es nur im Buch liest?", "bewegte Bilder und Filmmusik", ["Wörter und Sätze", "eine Handlung"], "Ein Film zeigt, was das Buch nur beschreibt."],
	["Du liest ein Märchen im Bilderbuch. Was hilft dir dort besonders?", "Bilder zeigen Figuren und Orte.", ["Du hörst Geräusche dazu.", "Die Figuren bewegen sich."], "Bilderbücher erzählen mit Text und Bild."],
	["Was bleibt meist gleich, wenn ein Märchen als Buch und als Film erscheint?", "die Figuren und die Handlung", ["die Stimmen", "die Musik"], "Die Geschichte bleibt, nur die Form ändert sich."],
	["Eine Fabel soll ein Comic werden. Was brauchst du dafür?", "Bilder und Sprechblasen", ["Geräusche und Musik", "Zutaten und Mengen"], "Comics erzählen mit Bildern und Sprechblasen."],
	["Eine Buchszene soll ein Hörspiel werden. Was brauchst du dafür?", "Sprecher und Geräusche", ["Sprechblasen", "gezeichnete Bilder"], "Im Hörspiel muss alles zu hören sein."],
];

const CHOICES: Item[] = [
	["Du willst für ein Referat schnell und richtig wissen, wie Bienen leben.", "ein Sachbuch oder eine Wissensseite für Kinder", ["ein Märchenbuch", "eine Kinderserie über sprechende Bienen"], "Für Tatsachen brauchst du sachliche Quellen."],
	["Du willst wissen, was heute in der Welt geschehen ist.", "Kindernachrichten", ["eine Quizsendung", "ein Märchenfilm"], "Nachrichten berichten über aktuelle Ereignisse."],
	["Du willst dich auf einer langen Autofahrt unterhalten, ohne auf etwas zu schauen.", "ein Hörbuch", ["ein Comic", "ein Bilderbuch"], "Beim Hören brauchst du die Augen nicht."],
	["In einem Buch steht: „Mädchen können nicht gut rechnen.“ Wie denkst du darüber?", "Das ist ein Klischee und stimmt nicht.", ["Das ist eine wichtige Tatsache.", "Das gilt nur in Büchern."], "Ein Klischee behauptet etwas über alle, ohne dass es stimmt."],
	["In einer Serie sind alle Jungen stark und alle Mädchen ängstlich. Was fällt dir auf?", "Die Serie zeigt Klischees.", ["Die Serie zeigt genau die Wirklichkeit.", "Die Serie erklärt Wissen."], "Menschen sind verschieden. Die Serie malt alle gleich."],
	["Eine Seite verspricht: „Dieses Spielzeug macht dich zum klügsten Kind der Welt!“", "Das ist Werbung und übertreibt.", ["Das ist eine sichere Tatsache.", "Das ist eine Nachricht von heute."], "Werbung will dir etwas verkaufen."],
];

const medien: Lesson = {
	id: "medien-verstehen",
	stage: "lesewerkstatt",
	title: "Medien verstehen und wählen",
	skill: "Du unterscheidest Sendungen und Medien, erkennst ihre Absicht und wählst passend aus.",
	lehrplan: "D3/4 2.1 · 2.4: Formate unterscheiden, Medien vergleichen, auswählen und beurteilen",
	bindings: ["2.1-06", "2.1-07", "2.1-09", "2.4-06"],
	sticker: { emoji: "📺", name: "Medienprofi" },
	paragraphs: [
		"Sendungen wollen Verschiedenes. Kindernachrichten berichten, was gerade geschieht. Wissenssendungen erklären etwas. Quizsendungen lassen rätseln. Kinderserien erzählen erfundene Geschichten. Frag dich immer: Was will diese Sendung von mir?",
		"Dieselbe Geschichte kann als Buch, Bilderbuch, Hörspiel oder Film erscheinen. Die Handlung bleibt ähnlich, die Mittel ändern sich: Im Hörspiel erzählen Stimmen und Geräusche, im Comic Bilder und Sprechblasen, im Film bewegte Bilder und Musik.",
		"Wähle ein Medium danach aus, was du brauchst: Für Tatsachen nimmst du ein Sachbuch oder eine Wissensseite. Prüfe dabei, was du siehst. Ein Klischee behauptet etwas über alle Menschen einer Gruppe. Das stimmt so nie. Und Werbung will dir etwas verkaufen.",
	],
	example: {
		title: "Tinto wählt aus",
		lines: [
			"Frage: Wie leben Bienen?",
			"Märchenfilm? Der erfindet zu viel.",
			"Wissensseite für Kinder? Passt.",
			"Prüfen: Wer hat das geschrieben? Will mir jemand etwas verkaufen?",
		],
	},
	takeaway:
		"Frag dich bei jedem Medium: Was will es von mir? Dieselbe Geschichte erzählt jedes Medium mit eigenen Mitteln. Wähle nach deinem Bedarf und achte auf Klischees und Werbung.",
	terms: [
		{ term: "Medium", meaning: "womit etwas vermittelt wird: Buch, Hörspiel, Film, Internet" },
		{ term: "Hörspiel", meaning: "eine Geschichte nur mit Stimmen, Geräuschen und Musik" },
		{ term: "Klischee", meaning: "eine falsche Vorstellung, die alle einer Gruppe gleich macht" },
	],
	check: {
		wrong: "Quizsendung",
		explanation: "Eine Sendung über das, was heute geschieht, sind Kindernachrichten. Beim Quiz wird um Punkte gerätselt.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Das Programm-Heft",
			intro: "Im Programm-Heft fehlen die Bezeichnungen. Wähle einen Stift und tippe jede Beschreibung an.",
			pens: [
				{ value: "N", label: "Nachrichten", colour: "blue" },
				{ value: "W", label: "Wissen", colour: "green" },
				{ value: "Q", label: "Quiz", colour: "orange" },
				{ value: "S", label: "Serie", colour: "purple" },
			],
			puzzles: [
				marks("montag", "Was_heute_in_der_Welt_geschah|N Warum_der_Himmel_blau_ist|W", "Montag", "Berichtet die Sendung oder erklärt sie?"),
				marks("dienstag", "Team_Rot_gegen_Team_Blau_um_Punkte|Q Die_Bande_und_der_verschwundene_Hund,_Folge_12|S", "Dienstag", "Wird gerätselt oder eine Geschichte erzählt?"),
				marks("mittwoch", "So_kommt_der_Strom_in_die_Steckdose|W Neues_aus_dem_Landtag_für_Kinder|N Wer_weiß_die_meisten_Tiernamen?|Q Die_Bande_im_Ferienlager,_Folge_13|S", "Mittwoch", "Alle vier Arten kommen vor."),
			],
		},
		["Ordne das Montagsprogramm richtig zu.", "Ordne das Dienstagsprogramm richtig zu.", "Ordne das Mittwochsprogramm richtig zu."],
	),
	generators: {
		1: [
			(rng) => sort(rng, "Welche Art von Sendung ist das?", FORMATS, "Wird berichtet, erklärt, gerätselt oder eine Geschichte erzählt?", "format"),
			(rng) => sort(rng, "Vergleiche die Medien.", VERSIONS.slice(0, 3), "Was kannst du in diesem Medium sehen oder hören?", "version"),
		],
		2: [
			(rng) => sort(rng, "Was passt hier am besten?", CHOICES, "Was brauchst du gerade? Will dir jemand etwas verkaufen? Werden alle Menschen einer Gruppe gleich dargestellt?", "wahl"),
			(rng) => sort(rng, "Eine Geschichte wechselt das Medium. Was stimmt?", VERSIONS.slice(3), "Was bleibt gleich, und welche Mittel hat das neue Medium?", "wechsel"),
		],
	},
	requiredCorrect: 3,
};

export const LESEWERKSTATT: Lesson[] = [textarten, lesestrategien, sachtexte, geschichten, figuren, sprachbilder, medien];
