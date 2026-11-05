// Station 6 · Schreibwerkstatt: Texte planen, schreiben und überarbeiten
// (LehrplanPLUS Deutsch 3/4, 3.2 und 3.3). Die App bewertet keine freien Texte:
// Die Aufgaben üben Teilschritte, der Schreibtisch jeder Lektion ist nur für das
// Kind. Handschrift und Schreibkonferenzen bleiben Praxis außerhalb der App.
import { choice, pick, text } from "../exercises/tasks";
import type { Lesson, MachineView, MachineWorkshop, Rng, Task } from "../types";
import { gaps, marks, slotWorkshop } from "./helpers";
import { FACT_TEXTS, type Passage, STORIES } from "./lesetexte";
import { type Item, sort, type TypedItem, typed } from "./lesewerkstatt";

/* ---------- 1 Ideen sammeln ---------- */

const NOTES: Item[] = [
	["Du machst dir Notizen zum Thema „Fledermäuse“.", "nachts aktiv, hängen kopfüber", ["Fledermäuse sind Tiere, die nachts aktiv sind und die kopfüber hängen.", "Ich finde das Thema heute ganz toll."], "Stichwörter sind kurz. Ganze Sätze schreibst du erst später."],
	["Du notierst dir etwas für einen Bericht über das Schulfest.", "Samstag, Schulhof, 80 Gäste", ["Am Samstag war auf dem Schulhof ein Fest mit 80 Gästen.", "Das Wetter ist oft wichtig."], "Drei kurze Angaben reichen. Daraus schreibst du später Sätze."],
	["Du sammelst Ideen für eine Geschichte über einen verlorenen Hund.", "Hund weg, Suche im Wald, Wiedersehen", ["Als unser Hund weg war, suchten wir ihn im Wald und fanden ihn wieder.", "Hunde sind schöne Tiere."], "Stichwörter halten die Idee fest und lassen dir noch Platz zum Ausdenken."],
	["Du liest einen Sachtext über die Zugspitze und notierst dir das Wichtigste.", "höchster Berg Deutschlands, 2962 m", ["Die Zugspitze ist der höchste Berg Deutschlands und 2962 Meter hoch.", "Der Text ist interessant."], "Nur die wichtigsten Wörter und Zahlen kommen auf den Zettel."],
	["Du planst einen Vortrag über dein Lieblingstier, die Katze.", "Haustier, schläft viel, jagt Mäuse", ["Die Katze ist ein Haustier, das viel schläft und Mäuse jagt.", "Mein Vortrag dauert drei Minuten."], "Auf dem Stichwortzettel steht nur, woran du dich erinnern willst."],
];

const WORD_COLLECTIONS: Item[] = [
	["Wörtersammlung für eine Rittergeschichte", "Turnschuhe", ["Burggraben", "Rüstung"], "Turnschuhe passen nicht in die Zeit der Ritter."],
	["Wörtersammlung für eine Abenteuererzählung im Dschungel", "Schulranzen", ["Lianen", "Machete"], "Lianen und Machete gehören zum Dschungel, der Schulranzen nicht."],
	["Wörtersammlung für einen Sachtext über Bienen", "Zauberstab", ["Nektar", "Bienenstock"], "Ein Sachtext nennt Tatsachen. Ein Zauberstab gehört in ein Märchen."],
	["Wörtersammlung für ein Märchen", "Fahrplan", ["Fee", "Schloss"], "Fee und Schloss sind typisch für Märchen, ein Fahrplan nicht."],
	["Wörtersammlung für einen Bericht über ein Fußballspiel", "Drachenei", ["Abpfiff", "Mannschaft"], "Abpfiff und Mannschaft gehören zum Fußball. Ein Drachenei wäre erfunden."],
];

const MINDMAP_BRANCHES: Item[] = [
	["Mindmap „Eichhörnchen“. Notiz: Nüsse und Samen", "Futter", ["Aussehen", "Wohnort"], "Nüsse und Samen frisst das Eichhörnchen."],
	["Mindmap „Eichhörnchen“. Notiz: rotbraunes Fell", "Aussehen", ["Futter", "Wohnort"], "Das Fell kannst du sehen."],
	["Mindmap „Unsere Schule“. Notiz: Frau Maier unterrichtet Sport", "Menschen", ["Gebäude", "Feste"], "Hier geht es um eine Person an der Schule."],
	["Mindmap „Unsere Schule“. Notiz: Turnhalle mit Kletterwand", "Gebäude", ["Menschen", "Feste"], "Die Turnhalle ist ein Teil des Gebäudes."],
	["Mindmap „Mein Ausflug“. Notiz: Wir fuhren eine Stunde mit dem Zug.", "Anreise", ["Essen", "Ziel"], "Die Zugfahrt gehört zum Weg dorthin."],
	["Mindmap „Mein Ausflug“. Notiz: Pausenbrote am See", "Essen", ["Anreise", "Ziel"], "Pausenbrote gehören zum Essen."],
];

const BUILDING_BLOCKS: Item[] = [
	["Du schreibst eine Abenteuererzählung.", "Plötzlich hörte ich hinter mir ein Knacken.", ["Der Wald besteht vor allem aus Fichten und Buchen.", "Verrühre das Mehl langsam mit den beiden Eiern."], "Das Knacken macht neugierig. Das passt zu einem Abenteuer."],
	["Du schreibst einen Sachtext über Igel.", "Igel fressen vor allem Käfer und Würmer.", ["Es war einmal ein kleiner, neugieriger Igel im Wald.", "„Hilfe!“, rief der Igel und rollte sich schnell zusammen."], "Ein Sachtext nennt Tatsachen."],
	["Du schreibst ein Märchen.", "Es war einmal eine Königin mit einem Zauberspiegel.", ["Am Montag besuchte unsere Klasse das Rathaus in Landshut.", "Ein großer Spiegel kostet im Möbelhaus etwa fünfzig Euro."], "„Es war einmal“ und der Zauberspiegel sind typisch für Märchen."],
	["Du schreibst einen Bericht über einen Ausflug.", "Um 8 Uhr fuhr unsere Klasse mit dem Bus los.", ["Der Bus verwandelte sich plötzlich in einen Drachen!", "Ich finde Busfahren einfach schöner als jede Zugfahrt."], "Ein Bericht nennt sachlich, was wann geschah."],
	["Du schreibst eine Fantasiegeschichte.", "Hinter dem Schrank öffnete sich eine winzige Tür.", ["In unserem Schrank liegen die Hosen im untersten Fach.", "Ein Schrank aus Holz kostet im Möbelhaus oft viel Geld."], "Die geheime Tür führt in eine Fantasiewelt."],
];

const ODD_WORDS: TypedItem[] = [
	["Thema Bauernhof: Traktor, Stall, Rakete, Heu", ["Rakete"], "Eine Rakete gehört nicht auf den Bauernhof."],
	["Thema Winter: Schnee, Schlitten, Badehose, Eis", ["Badehose"], "Die Badehose gehört zum Sommer."],
	["Thema Fußball: Tor, Schiedsrichter, Angelrute, Abseits", ["Angelrute"], "Eine Angelrute braucht man beim Fußball nicht."],
	["Thema Märchen: Fee, Zauberstab, Fahrkarte, Schloss", ["Fahrkarte"], "Die Fahrkarte passt nicht in die Märchenwelt."],
	["Thema Wald: Moos, Reh, Ampel, Fichte", ["Ampel"], "Eine Ampel steht nicht im Wald."],
	["Thema Schule: Tafel, Heft, Anker, Pause", ["Anker"], "Ein Anker gehört zu einem Schiff."],
];

const ideen: Lesson = {
	id: "ideen-sammeln",
	stage: "schreibwerkstatt",
	title: "Ideen und Wörter sammeln",
	skill: "Du sammelst vor dem Schreiben Ideen und Wörter und bringst sie in eine Ordnung.",
	lehrplan: "D3/4 3.2: Stichwortzettel, Mindmap, Sammlungen für eigene Texte",
	bindings: ["3.2-01", "3.2-02"],
	sticker: { emoji: "🗂️", name: "Ideensammler" },
	paragraphs: [
		"Gute Texte beginnen vor dem Schreiben. Auf einem Stichwortzettel stehen nur die wichtigen Wörter, keine ganzen Sätze. Bei einer Mindmap steht dein Thema in der Mitte. Davon gehen Äste ab, und an jedem Ast stehen die passenden Wörter.",
		"Schau dir auch andere Texte an: Eine Abenteuergeschichte braucht andere Wörter als ein Sachtext über Bienen. Typische Wörter und Sätze schreibst du dir in eine Sammlung, zum Beispiel „Plötzlich hörte ich …“ für eine spannende Geschichte. Sammelst du mit anderen zusammen, fällt euch mehr ein.",
		"Beim Sammeln ist erst einmal alles erlaubt. Danach streichst du, was nicht zum Thema passt, und ordnest den Rest.",
	],
	example: {
		title: "Tinto sammelt zum Thema Eichhörnchen",
		lines: [
			"Mitte der Mindmap: Eichhörnchen",
			"Ast Aussehen: rotbraun, buschiger Schwanz",
			"Ast Futter: Nüsse, Samen",
			"Ast Wohnort: Wald, Park",
		],
	},
	takeaway: "Erst sammeln, dann streichen, dann ordnen. Auf den Stichwortzettel kommen nur wichtige Wörter, in die Mindmap kommt das Thema in die Mitte.",
	terms: [
		{ term: "Stichwortzettel", meaning: "Zettel mit den wichtigsten Wörtern, ohne ganze Sätze" },
		{ term: "Mindmap", meaning: "Wortbild mit dem Thema in der Mitte und Ästen für die Unterthemen" },
		{ term: "Wörtersammlung", meaning: "Liste mit passenden Wörtern und Sätzen zu einem Thema oder einer Textart" },
	],
	check: {
		wrong: "nur die Überschrift",
		explanation: "Auf dem Stichwortzettel stehen die wichtigen Wörter. So erinnerst du dich an alles, ohne viel zu schreiben.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Tintos Mindmap",
			intro: "Tinto hat alles gesammelt. Wähle einen Stift und ordne jedes Wort seinem Ast zu. Was nicht zum Thema passt, bleibt ohne Farbe.",
			pens: [
				{ value: "A", label: "Aussehen", colour: "blue" },
				{ value: "F", label: "Futter", colour: "orange" },
				{ value: "W", label: "Wohnort", colour: "green" },
			],
			puzzles: [
				marks("eichhoernchen", "buschiger_Schwanz|A Nüsse|F Baumkrone|W Schulranzen", "Thema: Eichhörnchen", "Was siehst du, was frisst es, wo lebt es? Passt alles zum Thema?"),
				marks("igel", "Stacheln|A Käfer|F Laubhaufen|W Fußball", "Thema: Igel", "Ein Wort gehört gar nicht zum Igel."),
				marks("biene", "Nektar|F schwarz-gelb|A Bienenstock|W Taschenlampe", "Thema: Biene", "Die Wörter stehen hier in einer anderen Reihenfolge."),
			],
		},
		["Ordne die Wörter zum Eichhörnchen.", "Ordne die Wörter zum Igel.", "Ordne die Wörter zur Biene."],
	),
	desk: {
		task: "Wähle ein Thema, das dich interessiert. Schreibe zuerst alles auf, was dir dazu einfällt. Ordne die Wörter dann unter zwei oder drei Überschriften.",
		checklist: ["Ich habe nur Stichwörter notiert.", "Ich habe gestrichen, was nicht zum Thema passt.", "Meine Wörter stehen unter passenden Überschriften."],
	},
	generators: {
		1: [
			(rng) => sort(rng, "Welche Notiz gehört auf den Stichwortzettel?", NOTES, "Stichwörter sind kurz. Du brauchst keinen ganzen Satz.", "notiz"),
			(rng) => sort(rng, "Welches Wort passt nicht in diese Sammlung?", WORD_COLLECTIONS, "Überlege: Zu welchem Thema oder zu welcher Textart gehört die Sammlung?", "fremdwort"),
		],
		2: [
			(rng) => sort(rng, "An welchen Ast der Mindmap gehört diese Notiz?", MINDMAP_BRANCHES, "Worum geht es in der Notiz? Suche den passenden Oberbegriff.", "ast"),
			(rng) => sort(rng, "Welchen Satz nimmst du in deine Sammlung für diesen Text auf?", BUILDING_BLOCKS, "Was will diese Textart: spannend erzählen oder sachlich informieren?", "baustein"),
			(rng) => typed(rng, "Ein Wort passt nicht zu diesem Thema. Schreibe es heraus.", ODD_WORDS, "Streiche beim Sammeln, was nicht zum Thema gehört.", "streichen"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 2 Geschichte aufbauen ---------- */

const STORY_PARTS: Item[] = [
	["An einem kalten Morgen stapfte Jana mit ihrem Hund durch den Schnee.", "Erzählsituation", ["Ereignis", "Ausgang"], "Hier erfährst du, wer wann wo unterwegs ist. Noch passiert nichts Besonderes."],
	["Als unsere Klasse in den Ferien im Zeltlager war, regnete es den ganzen Tag.", "Erzählsituation", ["Ereignis", "Ausgang"], "Der Satz führt dich an den Ort und in die Zeit der Geschichte."],
	["Plötzlich brach das Eis unter dem Hund, und er zappelte im Wasser.", "Ereignis", ["Erzählsituation", "Ausgang"], "Hier passiert das Besondere. Darum geht es in der Geschichte."],
	["Da sprang ein riesiger Frosch aus dem Zelt und sprach uns an.", "Ereignis", ["Erzählsituation", "Ausgang"], "Ein sprechender Frosch ist das, was die Geschichte erzählenswert macht."],
	["Am Ende saßen wir alle müde, aber froh am warmen Ofen.", "Ausgang", ["Erzählsituation", "Ereignis"], "Der Satz zeigt, wie alles ausgegangen ist."],
	["Seitdem lasse ich meinen Hund nie mehr aufs Eis.", "Ausgang", ["Erzählsituation", "Ereignis"], "Das ist die Folge am Schluss der Geschichte."],
];

const PART_CONTENTS: Item[] = [
	["in die Erzählsituation", "wer dabei ist, wo und wann es spielt", ["wie alles am Ende ausgeht", "das größte Problem der Geschichte"], "Am Anfang führst du deine Leser an Ort und Zeit."],
	["in das Ereignis", "etwas Besonderes, das alles verändert", ["was du zum Frühstück gegessen hast", "das Datum von heute"], "Das Ereignis ist der Grund, warum du die Geschichte erzählst."],
	["in den Ausgang", "wie das Problem gelöst wird oder was daraus folgt", ["neue Figuren, die erst jetzt kommen", "wie die Figuren heißen"], "Am Schluss erfahren die Leser, wie es ausgeht."],
	["in den Anfang einer Geschichte über einen Campingurlaub", "Wir zelteten im Sommer an einem kleinen See.", ["Da stand der Bär direkt vor unserem Zelt!", "Seitdem zelten wir nur noch mit einer Trillerpfeife."], "Das nennt Ort und Zeit, bevor etwas geschieht."],
	["in die Mitte einer Geschichte über einen Campingurlaub", "Da stand der Bär direkt vor unserem Zelt!", ["Wir zelteten im Sommer an einem kleinen See.", "Seitdem zelten wir nur noch mit einer Trillerpfeife."], "Der Bär ist das erzählenswerte Ereignis."],
	["in den Schluss einer Geschichte über einen Campingurlaub", "Seitdem zelten wir nur noch mit einer Trillerpfeife.", ["Wir zelteten im Sommer an einem kleinen See.", "Da stand der Bär direkt vor unserem Zelt!"], "„Seitdem“ zeigt, was aus dem Erlebnis folgt."],
];

const WORTHWHILE: Item[] = [
	["Du erzählst von deinem Ausflug in den Tierpark.", "Ein Affe stahl mir die Mütze vom Kopf.", ["Wir kauften am Eingang zwei Eintrittskarten für den Tierpark.", "Wir gingen nacheinander an vielen großen Gehegen vorbei."], "Der Mützendieb ist das Besondere. Der Rest passiert fast bei jedem Ausflug."],
	["Du erzählst von einem Tag am See.", "Mitten im See ging unser Ruderboot unter.", ["Wir packten zu Hause zuerst unsere Handtücher in die Tasche.", "Das Wasser im See war an diesem Tag ziemlich kalt."], "Ein sinkendes Boot ist spannend. Handtücher nicht."],
	["Du erzählst von deinem Schultag.", "Im Klassenzimmer saß ein fremdes Huhn.", ["In der ersten Stunde hatten wir wie jeden Montag Mathematik.", "Um eins war die Schule aus, und ich ging nach Hause."], "Ein Huhn im Klassenzimmer ist erzählenswert."],
	["Du erzählst von deinem Geburtstag.", "Aus dem Karton sprang ein kleiner Hund.", ["Ich wurde an diesem Tag zehn Jahre alt und bekam Geschenke.", "Es gab wie jedes Jahr Schokoladenkuchen und Limonade."], "Das Überraschende steht im Mittelpunkt."],
	["Du erzählst von einer Bahnfahrt.", "In Nürnberg fuhr der Zug ohne meinen Koffer weiter.", ["Der Zug hatte acht Wagen und hielt an jedem großen Bahnhof.", "Ich saß die ganze Zeit am Fenster und schaute nach draußen."], "Der verlorene Koffer ist das Problem, das die Geschichte in Gang bringt."],
];

const ENDINGS: Item[] = [
	["Ereignis: Beim Wandern verlieren Pia und Noah im Nebel den Weg.", "Mit Noahs Kompass finden sie zur Hütte zurück.", ["Am nächsten Tag ist Montag, und beide müssen wieder zur Schule.", "Nebel besteht aus vielen winzigen Wassertröpfchen in der Luft."], "Der Ausgang löst das Problem aus dem Ereignis."],
	["Ereignis: Mira versteckt das Zeugnis, weil sie Angst vor dem Gespräch hat.", "Am Abend gibt sie es ihrer Mutter, und beide reden.", ["Mira hat einen roten Pullover und eine neue Schultasche.", "Zeugnisse gibt es in der Grundschule zweimal im Schuljahr."], "Der Ausgang zeigt, was aus Miras Angst wird."],
	["Ereignis: Ein fremder Kater läuft Tom jeden Tag bis zur Schule nach.", "Tom findet die Besitzerin, und der Kater darf ihn besuchen.", ["Katzen schlafen sehr viel und jagen gern in der Dämmerung.", "Die Schule von Tom hat zwei Stockwerke und eine große Turnhalle."], "Der Ausgang gehört zu Tom und dem Kater."],
	["Ereignis: Beim Backen verwechselt Ben Zucker und Salz.", "Alle verziehen das Gesicht, und Ben backt lachend neu.", ["Salz kommt aus dem Meer oder tief aus den Bergen.", "Der große Backofen steht in der Küche neben dem Kühlschrank."], "Der Ausgang erzählt, wie das Missgeschick endet."],
];

const MISSING_PARTS: TypedItem[] = [
	["Am Samstag gingen wir in den Wald. Plötzlich stand ein Hirsch vor uns.", ["Ausgang", "Schluss", "Ende"], "Wie die Begegnung ausgeht, fehlt noch."],
	["Emma spielte im Garten. Auf einmal rollte ihr Ball in ein Loch im Zaun.", ["Ausgang", "Schluss", "Ende"], "Ob Emma den Ball wiederbekommt, erfährst du nicht."],
	["Plötzlich fiel der Strom aus. Am Ende lachten alle im Kerzenschein.", ["Erzählsituation", "Situation", "Anfang"], "Wer ist dabei, wo und wann? Das fehlt am Anfang."],
	["Da krachte es laut im Keller. Seitdem schließen wir die Tür immer ab.", ["Erzählsituation", "Situation", "Anfang"], "Wer dabei war und wo es geschah, steht nirgends."],
	["Im Sommer waren wir am Badesee. Am Abend fuhren wir müde nach Hause.", ["Ereignis"], "Es passiert nichts Besonderes. Dann gibt es nichts zu erzählen."],
	["An einem Regentag saß Tim in der Küche. Danach aß er zufrieden sein Brot.", ["Ereignis"], "Zwischen den Sätzen geschieht nichts Erzählenswertes."],
];

const aufbauen: Lesson = {
	id: "erzaehlen-aufbauen",
	stage: "schreibwerkstatt",
	title: "Eine Geschichte aufbauen",
	skill: "Du baust eine Geschichte aus Erzählsituation, Ereignis und Ausgang auf und stellst ein erzählenswertes Ereignis in die Mitte.",
	lehrplan: "D3/4 3.2: erzählende Texte sinnvoll aufbauen",
	bindings: ["3.2-03"],
	sticker: { emoji: "🏗️", name: "Geschichtenbauer" },
	paragraphs: [
		"In der Lesewerkstatt hast du den Auslöser einer Geschichte gesucht. Jetzt baust du selbst. Eine Erzählung hat drei Teile. Die Erzählsituation sagt, wer dabei ist, wo und wann es spielt.",
		"Dann kommt das Ereignis: etwas Besonderes, das alles verändert. Es ist der Grund, warum du die Geschichte überhaupt erzählst. Hier nimmst du dir die meiste Zeit und erzählst genau.",
		"Der Ausgang sagt, wie alles endet oder was daraus folgt. Erzähle nicht den ganzen Tag der Reihe nach. Wähle das eine Erlebnis aus, das erzählenswert ist.",
	],
	example: {
		title: "Tinto plant seine Geschichte",
		lines: [
			"Erzählsituation: Ich räume mit Oma den Dachboden auf.",
			"Ereignis: Aus einer alten Kiste krabbelt eine Maus und rennt über Omas Schuh.",
			"Ausgang: Oma lacht, und wir fangen die Maus mit einem Marmeladenglas.",
		],
	},
	takeaway: "Erzählsituation – Ereignis – Ausgang. Das erzählenswerte Ereignis steht im Mittelpunkt, und dort erzählst du am genauesten.",
	terms: [
		{ term: "Erzählsituation", meaning: "der Anfang: wer, wo und wann" },
		{ term: "Ereignis", meaning: "das Besondere in der Mitte der Geschichte" },
		{ term: "Ausgang", meaning: "der Schluss: wie es endet oder was daraus folgt" },
	],
	check: {
		wrong: "Überschrift, Absatz, Bild",
		explanation: "Erzählsituation, Ereignis und Ausgang bilden den Aufbau einer Erzählung.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Der Geschichten-Baukasten",
			intro: "Lies die drei Sätze. Welcher Teil der Geschichte ist jeder Satz? Die Sätze stehen nicht immer in der richtigen Reihenfolge.",
			pens: [],
			puzzles: [
				gaps("schlitten", "{Situation|Ereignis|Ausgang} Am Sonntag rodelten wir am Hang hinter dem Dorf.\n{Ereignis|Situation|Ausgang} Da löste sich die Schnur, und der Schlitten raste ohne mich los.\n{Ausgang|Situation|Ereignis} Unten fing ihn ein Schneehaufen auf, und ich holte ihn lachend zurück.", "Der Schlitten", "Wer, wo, wann? Was passiert Besonderes? Wie endet es?"),
				gaps("kuchen", "{Ereignis|Situation|Ausgang} Plötzlich stand der Hund auf dem Stuhl und fraß den halben Kuchen.\n{Ausgang|Situation|Ereignis} Zum Glück reichte der Rest noch für alle.\n{Situation|Ereignis|Ausgang} Für das Fest stellte Mama einen Kuchen auf den Tisch.", "Der Kuchen", "Hier steht das Ereignis zuerst. Suche den Satz, der die Lage erklärt."),
				gaps("floss", "{Ausgang|Situation|Ereignis} Seitdem binden wir jeden Knoten doppelt.\n{Situation|Ereignis|Ausgang} In den Ferien bauten wir am Bach ein Floß.\n{Ereignis|Situation|Ausgang} Kaum schwamm es, lösten sich alle Knoten.", "Das Floß", "Achte auf Wörter wie „seitdem“ und „kaum“."),
			],
		},
		["Baue die Geschichte vom Schlitten auf.", "Baue die Geschichte vom Kuchen auf.", "Baue die Geschichte vom Floß auf."],
	),
	desk: {
		task: "Schreibe eine kurze Geschichte über etwas Besonderes, das du erlebt oder dir ausgedacht hast. Plane zuerst die drei Teile.",
		checklist: ["Am Anfang steht, wer dabei ist, wo und wann es spielt.", "In der Mitte passiert etwas Besonderes.", "Dort erzähle ich am genauesten.", "Am Schluss steht, wie es ausgeht."],
	},
	generators: {
		1: [
			(rng) => sort(rng, "Welcher Teil einer Erzählung ist dieser Satz?", STORY_PARTS, "Noch nichts Besonderes? Dann ist es die Situation. Geht es zu Ende? Dann ist es der Ausgang.", "teil"),
			(rng) => sort(rng, "Was gehört dort hinein?", PART_CONTENTS, "Am Anfang: wer, wo, wann. In der Mitte: das Besondere. Am Schluss: wie es endet.", "inhalt"),
		],
		2: [
			(rng) => sort(rng, "Welches Ereignis stellst du in den Mittelpunkt deiner Erzählung?", WORTHWHILE, "Worüber würden deine Freunde sagen: Das musst du genau erzählen?", "erzaehlenswert"),
			(rng) => sort(rng, "Welcher Ausgang passt zu diesem Ereignis?", ENDINGS, "Der Ausgang gehört zur Geschichte und löst das Problem oder zeigt die Folge.", "ausgang"),
			(rng) => typed(rng, "Ein Teil fehlt in dieser Geschichte. Schreibe seinen Namen auf.", MISSING_PARTS, "Die drei Teile heißen Erzählsituation, Ereignis und Ausgang. Welcher fehlt hier?", "fehlend"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 3 Lebendig erzählen ---------- */

const MEANS: Item[] = [
	["„Da kommt der Stier“, sagte Ali.", "wörtliche Rede", ["treffendes Verb", "Gefühl zeigen"], "Du hörst die Figur selbst sprechen."],
	["„Das schaffen wir nie“, sagte Lea.", "wörtliche Rede", ["Gefühl zeigen", "treffendes Verb"], "Die Anführungszeichen zeigen, dass Lea spricht."],
	["Der Dieb huschte um die Ecke.", "treffendes Verb", ["wörtliche Rede", "Gefühl zeigen"], "„Huschte“ sagt viel genauer als „ging“, wie er sich bewegt."],
	["Das Pferd galoppierte über die Wiese.", "treffendes Verb", ["wörtliche Rede", "Gefühl zeigen"], "„Galoppierte“ zeigt die Bewegung genau."],
	["Mein Herz klopfte bis zum Hals.", "Gefühl zeigen", ["wörtliche Rede", "treffendes Verb"], "So spürst du die Angst, ohne dass das Wort dasteht."],
	["Vor Freude machte Tim einen Luftsprung.", "Gefühl zeigen", ["wörtliche Rede", "treffendes Verb"], "Der Sprung zeigt, wie froh Tim ist."],
];

const VERBS: Item[] = [
	["Lea will nicht gehört werden. Lea [[…]] durch das dunkle Haus.", "schlich", ["war", "machte"], "„Schlich“ zeigt: leise und vorsichtig."],
	["Der Hund ist wütend. Der Hund [[…]] den Fremden an.", "knurrte", ["sah", "hatte"], "„Knurrte“ lässt dich die Wut hören."],
	["Ben hat große Eile. Ben [[…]] zum Bus.", "rannte", ["kam", "war"], "„Rannte“ zeigt die Eile."],
	["Es ist ganz still. Nina [[…]] ihrer Freundin etwas zu.", "flüsterte", ["brüllte", "tat"], "„Flüsterte“ passt zur Stille."],
	["Der Sturm ist heftig. Der Wind [[…]] um das Haus.", "heulte", ["war", "kam"], "„Heulte“ lässt dich den Sturm hören."],
	["Oma ist glücklich. Oma [[…]] über das ganze Gesicht.", "strahlte", ["hatte", "tat"], "„Strahlte“ zeigt die Freude."],
];

const LIVELY: Item[] = [
	["Es war spannend.", "Mein Atem stockte. Wer stand hinter der Tür?", ["Es war wirklich sehr, sehr spannend und auch ziemlich aufregend.", "Danach war es dann auch noch spannend, und dann war es vorbei."], "Zeige die Spannung, statt sie nur zu nennen."],
	["Der Mann war böse.", "Der Mann ballte die Fäuste. „Raus hier!“, brüllte er.", ["Der Mann war sehr böse, und er war auch wirklich gar nicht nett.", "Der Mann war böse, und dann war er noch viel böser als vorher."], "Fäuste und wörtliche Rede zeigen die Wut."],
	["Ich hatte Angst.", "Meine Knie zitterten, und ich brachte kein Wort heraus.", ["Ich hatte große Angst, wirklich sehr große Angst an diesem Tag.", "Dann hatte ich Angst, und dann hatte ich noch mehr Angst davor."], "Zitternde Knie lassen dich die Angst spüren."],
	["Der Hund freute sich.", "Der Hund wedelte wild und sprang an mir hoch.", ["Der Hund war ein Hund, der sich an diesem Tag sehr gefreut hat.", "Der Hund hat sich dann gefreut, und dann hat er sich noch gefreut."], "Du siehst die Freude des Hundes."],
	["Dann kam ein Gewitter.", "Ein Blitz zuckte, und gleich darauf krachte der Donner.", ["Dann kam ein Gewitter, und dann war das Gewitter endlich da.", "Dann war Gewitter, und es war ein ziemlich großes Gewitter da."], "Treffende Verben machen das Gewitter lebendig."],
];

const SPLIT_UP: Item[] = [
	["Geschichte: Ein Einbrecher schleicht durchs Haus.", "Ein Knarren. Dann Stille. Da! Die Tür bewegte sich.", ["Es gab ein Knarren, und danach war es still, und nachdem es still war, bewegte sich die Tür.", "Die Tür ist aus Holz und kann sich bewegen."], "Kurze Sätze lassen dich mit angehaltenem Atem mitlesen."],
	["Geschichte: Der Schiedsrichter pfeift gleich ab.", "Noch zehn Sekunden. Ali schießt. Tor!", ["Es waren noch zehn Sekunden übrig, als Ali, der schon lange spielte, schoss und traf.", "Beim Fußball gibt es zwei Tore."], "Kurze Sätze machen den Moment schnell und spannend."],
	["Geschichte: Du wartest beim Versteckspiel.", "Schritte. Immer näher. Ich hielt die Luft an.", ["Ich hörte Schritte, die immer näher kamen, und deshalb hielt ich die Luft an, weil ich Angst hatte.", "Beim Versteckspiel verstecken sich die Kinder."], "Kurze Sätze lassen die Schritte näher kommen."],
	["Geschichte: Ein Boot kippt fast um.", "Eine Welle. Noch eine. Das Boot schwankte.", ["Weil eine Welle und noch eine Welle kamen, schwankte das Boot, das wir hatten.", "Wellen entstehen meistens durch den Wind."], "Kurze Sätze machen das Schwanken spürbar."],
];

const BEN_MOVES: Record<string, string> = {
	"schlich+auf Zehenspitzen": "leise",
	"rannte+so schnell er konnte": "eilig",
	"stampfte+mit rotem Kopf": "wuetend",
};

function benView(values: Record<string, string>): MachineView {
	const how = values.wie;
	const sentence =
		how === "ohne Zusatz"
			? `Ben ${values.verb} durch den Flur.`
			: how === "so schnell er konnte"
				? `Ben ${values.verb}, so schnell er konnte, durch den Flur.`
				: `Ben ${values.verb} ${how} durch den Flur.`;
	const found = BEN_MOVES[`${values.verb}+${how}`];
	return {
		display: sentence,
		note: found
			? "Verb und Zusatz zeigen dasselbe. So siehst du Ben richtig vor dir."
			: values.verb === "ging"
				? "„Ging“ sagt noch wenig. Wähle ein treffendes Verb."
				: how === "ohne Zusatz"
					? "Schon lebendig! Mit einem passenden Zusatz siehst du es noch genauer."
				: "Beides ist lebendig, passt aber nicht ganz zusammen. Probiere etwas anderes.",
		found,
		tone: found ? "ok" : undefined,
	};
}

const benMachine: MachineWorkshop = {
	kind: "machine",
	title: "Die Satz-Bühne",
	intro: "Ben geht durch den Flur. Wähle ein Verb und einen Zusatz. Wie wirkt der Satz jetzt? Zeige Ben auf drei verschiedene Arten.",
	controls: [
		{ id: "verb", label: "Verb", options: ["ging", "schlich", "rannte", "stampfte"] },
		{ id: "wie", label: "Zusatz", options: ["ohne Zusatz", "auf Zehenspitzen", "so schnell er konnte", "mit rotem Kopf"] },
	],
	initial: { verb: "ging", wie: "ohne Zusatz" },
	view: benView,
	goals: [
		{ id: "leise", label: "Zeige: Ben will nicht gehört werden.", reached: (state) => state.found.includes("leise") },
		{ id: "eilig", label: "Zeige: Ben hat große Eile.", reached: (state) => state.found.includes("eilig") },
		{ id: "wuetend", label: "Zeige: Ben ist wütend.", reached: (state) => state.found.includes("wuetend") },
	],
};

const VERB_GAPS: TypedItem[] = [
	["Der Dieb will nicht gehört werden. Er schl… um die Ecke.", ["schlich"], "„Schlich“ zeigt: leise und vorsichtig."],
	["Der Hund ist wütend. Er kn… den Fremden an.", ["knurrte"], "„Knurrte“ lässt dich die Wut hören."],
	["Alle schlafen schon. Nina fl… ihrer Schwester etwas zu.", ["flüsterte"], "„Flüsterte“ passt zur Stille."],
	["Draußen tobt der Sturm. Der Wind h… um das Haus.", ["heulte"], "„Heulte“ lässt dich den Sturm hören."],
	["Das Pferd ist schnell. Es gal… über die Wiese.", ["galoppierte"], "„Galoppierte“ zeigt die Bewegung genau."],
	["Ben hat große Eile. Er r… zum Bus.", ["rannte"], "„Rannte“ zeigt die Eile."],
];

const lebendig: Lesson = {
	id: "erzaehlen-lebendig",
	stage: "schreibwerkstatt",
	title: "Lebendig erzählen",
	skill: "Du machst deine Texte mit treffenden Verben, wörtlicher Rede und gezeigten Gefühlen lebendig.",
	lehrplan: "D3/4 3.2: erzählende Texte lebendig und anschaulich gestalten",
	bindings: ["3.2-04"],
	sticker: { emoji: "🎭", name: "Wortmaler" },
	paragraphs: [
		"Eine Geschichte wird lebendig, wenn deine Leser alles vor sich sehen. Treffende Verben helfen dabei: Statt „ging“ kannst du „schlich“, „rannte“ oder „stampfte“ schreiben. Jedes Verb zeigt etwas anderes. Wortfelder kennst du schon aus der Wörterwerkstatt.",
		"Lass deine Figuren selbst sprechen. Wörtliche Rede macht einen Text sofort lebendiger. Nenne Gefühle nicht nur, sondern zeige sie: Statt „Ich hatte Angst“ schreibst du „Meine Knie zitterten“.",
		"An spannenden Stellen helfen kurze Sätze. Sie machen das Lesen schnell. Vermeide viele gleiche Satzanfänge wie „und dann“.",
	],
	example: {
		title: "Tinto macht einen Satz lebendig",
		lines: [
			"Vorher: Ich ging in den Keller. Ich hatte Angst.",
			"Treffendes Verb: Ich schlich in den Keller.",
			"Gefühl zeigen: Mein Herz klopfte bis zum Hals.",
			"Wörtliche Rede: „Ist da jemand?“, flüsterte ich.",
		],
	},
	takeaway: "Zeigen statt nur nennen: treffende Verben, wörtliche Rede und gezeigte Gefühle. An spannenden Stellen schreibst du kurze Sätze.",
	terms: [
		{ term: "treffendes Verb", meaning: "ein Verb, das genau zeigt, wie etwas geschieht" },
		{ term: "wörtliche Rede", meaning: "das, was eine Figur selbst sagt, in Anführungszeichen" },
	],
	check: {
		wrong: "viele gleiche Satzanfänge",
		explanation: "Treffende Verben, wörtliche Rede und gezeigte Gefühle lassen die Leser alles miterleben.",
	},
	workshop: benMachine,
	desk: {
		task: "Nimm den Satz „Ich ging in den Keller. Ich hatte Angst.“ oder einen Satz aus deiner eigenen Geschichte. Schreibe ihn so um, dass man alles vor sich sieht.",
		checklist: ["Ich habe ein treffendes Verb gewählt.", "Ich zeige das Gefühl, statt es nur zu nennen.", "Eine Figur spricht selbst.", "An der spannendsten Stelle stehen kurze Sätze."],
	},
	generators: {
		1: [
			(rng) => sort(rng, "Welches Mittel macht diesen Satz lebendig?", MEANS, "Spricht jemand? Zeigt das Verb die Bewegung genau? Oder merkst du ein Gefühl?", "mittel"),
			(rng) => sort(rng, "Welches Verb passt am besten in die Lücke?", VERBS, "Lies den ersten Satz. Welches Verb zeigt genau das?", "verb"),
		],
		2: [
			(rng) => sort(rng, "Wie erzählst du diesen Satz am lebendigsten?", LIVELY, "Suche die Fassung, bei der du alles vor dir siehst.", "lebendig"),
			(rng) => sort(rng, "Wie erzählst du diesen spannenden Moment?", SPLIT_UP, "Welche Fassung lässt dich den Atem anhalten?", "kurz"),
			(rng) => typed(rng, "Ergänze das treffende Verb. Die ersten Buchstaben stehen schon da.", VERB_GAPS, "Schreibe das ganze Verb in der Vergangenheit.", "verbluecke"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 4 Beschreiben ---------- */

const NEXT_STEPS: Item[] = [
	["Versuch „Schwimmt Eis?“: Du hast ein Glas mit Wasser gefüllt.", "Lege einen Eiswürfel hinein.", ["Schreibe auf, was du beobachtet hast.", "Räume das Glas weg."], "Erst kommt der Eiswürfel ins Wasser, dann kannst du beobachten."],
	["Versuch „Schwimmt Eis?“: Der Eiswürfel liegt im Wasser.", "Beobachte, ob er schwimmt oder sinkt.", ["Fülle das Glas mit Wasser.", "Hole einen Eiswürfel."], "Jetzt kannst du sehen, was passiert."],
	["Versuch „Was hält der Magnet?“: Du hast Nagel, Korken und Münze auf den Tisch gelegt.", "Halte den Magneten nacheinander an jedes Ding.", ["Trage die Ergebnisse in die Tabelle ein.", "Räume den Magneten weg."], "Erst probieren, dann das Ergebnis notieren."],
	["Versuch „Was hält der Magnet?“: Du hast alle Dinge ausprobiert.", "Trage die Ergebnisse in die Tabelle ein.", ["Hole einen Magneten.", "Lege den Nagel auf den Tisch."], "Am Schluss schreibst du auf, was du herausgefunden hast."],
	["Bastelanleitung Papierboot: Du hast das Blatt in der Mitte gefaltet.", "Knicke die oberen Ecken zur Mitte.", ["Lass das Boot auf dem Wasser schwimmen.", "Suche ein Blatt Papier."], "Ein Boot entsteht Schritt für Schritt."],
];

const DESCRIPTION_STYLE: Item[] = [
	["Du beschreibst deinen vermissten Rucksack.", "Er ist blau und hat vorn eine kleine Tasche.", ["Er war ein Geschenk, und ich liebe ihn sehr.", "Plötzlich war er weg!"], "Eine Beschreibung nennt genaue Merkmale."],
	["Du beschreibst das Klassenzimmer.", "Vorn hängt die Tafel, hinten steht ein Regal.", ["Ich finde unser Zimmer am allerschönsten.", "Einmal fiel das Regal fast um."], "Die Orte im Raum machen die Beschreibung klar."],
	["Du beschreibst einen Fahrradfahrer für die Polizei.", "Er trug eine rote Jacke und einen schwarzen Helm.", ["Er sah irgendwie komisch aus.", "Er tat mir leid."], "Nur genaue Angaben helfen, jemanden zu erkennen."],
	["Du beschreibst, wie ein Versuch abläuft.", "Dann legst du den Eiswürfel in das Glas.", ["Ich war total aufgeregt.", "Der Eiswürfel ist bestimmt traurig."], "In Vorgangsbeschreibungen zählen die Schritte, nicht deine Gefühle."],
	["Du beschreibst deinen Hund, der weggelaufen ist.", "Er ist braun und hat ein weißes Ohr.", ["Er ist der beste Hund der Welt.", "Er hat mich noch nie gebissen."], "Farbe und Merkmale helfen beim Suchen."],
];

const PERSON_ORDER: Item[] = [
	["Du hast schon die Haare und das Gesicht beschrieben.", "Sie trägt ein grünes Hemd und eine Jeans.", ["Sie ist etwa zehn Jahre alt und für ihr Alter ziemlich groß.", "Sie hat kurze braune Haare und eine kleine Brille auf der Nase."], "Von oben nach unten: Nach dem Kopf kommt die Kleidung."],
	["Du beginnst deine Beschreibung einer Person.", "Tom ist etwa zehn Jahre alt und ziemlich groß.", ["Er trägt an den Füßen weiße Turnschuhe mit roten Streifen.", "Seine blaue Jacke hat vorn einen langen Reißverschluss."], "Zuerst der Gesamteindruck, danach die Einzelheiten."],
	["Du hast Alter, Haare und Oberteil schon beschrieben.", "Dazu trägt sie blaue Stiefel.", ["Sie ist ungefähr zehn Jahre alt und etwas kleiner als Tom.", "Ihre Haare sind lockig und reichen bis auf die Schultern."], "Die Schuhe kommen am Schluss."],
	["Du beschreibst einen Menschen auf einem Foto. Du hast schon sein Alter genannt.", "Er hat graue Haare und einen Bart.", ["Er trägt an den Füßen schwarze Schuhe mit dicken Sohlen.", "Seine Hose ist braun und hat an der Seite zwei Taschen."], "Nach dem Gesamteindruck kommt der Kopf, dann die Kleidung von oben nach unten."],
];

const FINDER: Item[] = [
	["Suchmeldung: Unsere Katze ist weg. Welche Angabe fehlt am dringendsten?", "Fellfarbe und besondere Merkmale", ["was sie am liebsten frisst und wo sie gern schläft", "wie sehr wir sie lieben und wie lange wir sie schon haben"], "Ohne Aussehen kann niemand sie erkennen."],
	["Versuchsanleitung: Fülle Wasser ins Glas. Beobachte den Eiswürfel. Welcher Schritt fehlt?", "Lege den Eiswürfel in das Glas.", ["Freue dich darauf, was gleich passieren wird.", "Lies vorher ein spannendes Buch über das Eis."], "Ohne diesen Schritt gibt es nichts zu beobachten."],
	["Weg-Beschreibung: Geh aus der Schule und dann zum Bäcker. Was hilft am meisten?", "Geh nach links und an der Ampel über die Straße.", ["Der Weg ist wirklich nicht schwierig, du findest ihn schon.", "Der Bäcker hat sehr gute Brezen und frische Semmeln."], "Genaue Richtungen führen ans Ziel."],
	["Beschreibung eines Pullovers. Welche Angabe hilft beim Fundbüro?", "rot, Größe 140, mit einem Stern auf der Brust", ["sehr schön und ziemlich teuer, mein absoluter Lieblingspullover", "von meiner Oma zum Geburtstag, letztes Jahr im Frühling"], "Farbe, Größe und Stern kann man prüfen."],
];

const PRESENT_FORMS: TypedItem[] = [
	["Zuerst [[…]] du das Glas mit Wasser. (füllen)", ["füllst"], "Du füllst: Gegenwart."],
	["Dann [[…]] du den Eiswürfel hinein. (legen)", ["legst"], "Du legst: Gegenwart."],
	["Danach [[…]] du, ob er schwimmt. (beobachten)", ["beobachtest"], "Du beobachtest: Gegenwart."],
	["Das Mädchen [[…]] eine gelbe Jacke. (tragen)", ["trägt"], "Sie trägt: Gegenwart, mit ä."],
	["Er [[…]] kurze braune Haare. (haben)", ["hat"], "Er hat: Gegenwart."],
	["Zum Schluss [[…]] du alles auf. (schreiben)", ["schreibst"], "Du schreibst: Gegenwart."],
];

const beschreiben: Lesson = {
	id: "genau-beschreiben",
	stage: "schreibwerkstatt",
	title: "Genau beschreiben",
	skill: "Du beschreibst Abläufe Schritt für Schritt und Personen in einer sinnvollen Ordnung.",
	lehrplan: "D3/4 3.2: informierende, beschreibende Texte, reihende Darstellung und logische Anordnung",
	bindings: ["3.2-05"],
	sticker: { emoji: "🔬", name: "Genauschreiber" },
	paragraphs: [
		"Eine Beschreibung informiert. Nach ihr soll jemand etwas nachmachen oder wiedererkennen können. Deshalb schreibst du genau und sachlich, meist in der Gegenwart (Präsens). Deine Gefühle gehören nicht hinein.",
		"Bei einem Versuch oder einer Anleitung reihst du die Schritte genau so, wie sie nacheinander geschehen. Wörter wie „zuerst“, „dann“ und „zum Schluss“ helfen dir.",
		"Bei einer Person gehst du logisch vor: erst der Gesamteindruck wie Alter und Größe, dann von oben nach unten: Haare, Gesicht, Kleidung, Schuhe. Nenne Merkmale, an denen man sie erkennt.",
	],
	example: {
		title: "Tinto beschreibt einen Versuch",
		lines: [
			"Zuerst füllst du ein Glas mit Wasser.",
			"Dann legst du einen Eiswürfel hinein.",
			"Danach beobachtest du den Eiswürfel.",
			"Zum Schluss schreibst du auf: Der Eiswürfel schwimmt.",
		],
	},
	takeaway: "Beschreiben heißt: genau, sachlich und meist in der Gegenwart (Präsens). Abläufe reihst du Schritt für Schritt, Personen beschreibst du von oben nach unten.",
	terms: [
		{ term: "Gegenwart (Präsens)", meaning: "die Zeitform für das, was jetzt oder immer wieder geschieht: Ich lege, du beobachtest." },
		{ term: "sachlich", meaning: "ohne Gefühle und Wertungen, nur das, was wirklich so ist" },
	],
	check: {
		wrong: "im Futur (Zukunft)",
		explanation: "Beschreibungen gelten immer wieder neu. Deshalb stehen sie meist in der Gegenwart.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Die Schritt-für-Schritt-Karte",
			intro: "Die Sätze sind durcheinandergeraten. Gib jedem Satz eine Nummer: 1 kommt zuerst. Jede Nummer gibt es nur einmal.",
			pens: [],
			puzzles: [
				gaps("eis", "{3|1|2} Beobachte, ob der Eiswürfel schwimmt.\n{1|2|3} Fülle ein Glas mit Wasser.\n{2|1|3} Lege einen Eiswürfel hinein.", "Versuch: Schwimmt Eis?", "Was brauchst du, bevor etwas schwimmen kann?"),
				gaps("magnet", "{2|1|3|4} Halte den Magneten an jedes Ding.\n{4|1|2|3} Räume alles wieder weg.\n{1|2|3|4} Lege Nagel, Korken und Münze auf den Tisch.\n{3|1|2|4} Trage ein, was der Magnet hält.", "Versuch: Was hält der Magnet?", "Erst legen, dann probieren, dann notieren."),
				gaps("person", "{3|1|2|4} Sie trägt eine gelbe Regenjacke.\n{1|2|3|4} Das Mädchen ist etwa neun Jahre alt und ziemlich klein.\n{4|1|2|3} An den Füßen hat sie rote Stiefel.\n{2|1|3|4} Sie hat zwei lange braune Zöpfe.", "Personenbeschreibung", "Erst der Gesamteindruck, dann von oben nach unten."),
			],
		},
		["Ordne den Versuch mit dem Eiswürfel.", "Ordne den Versuch mit dem Magneten.", "Ordne die Personenbeschreibung von oben nach unten."],
	),
	desk: {
		task: "Beschreibe einen einfachen Versuch oder eine Bastelarbeit Schritt für Schritt. Oder beschreibe eine Figur aus deinem Lieblingsbuch so, dass man sie erkennt.",
		checklist: ["Ich schreibe sachlich und nenne keine Gefühle.", "Ich schreibe in der Gegenwart (Präsens).", "Die Schritte stehen in der richtigen Reihenfolge, oder ich gehe von oben nach unten.", "Jemand könnte es nach meinem Text nachmachen oder erkennen."],
	},
	generators: {
		1: [
			(rng) => sort(rng, "Was kommt als Nächstes?", NEXT_STEPS, "Was muss schon fertig sein, damit der nächste Schritt geht?", "schritt"),
			(rng) => sort(rng, "Welcher Satz passt in diese Beschreibung?", DESCRIPTION_STYLE, "Eine Beschreibung nennt genaue Angaben. Gefühle und Meinungen gehören nicht hinein.", "stil"),
		],
		2: [
			(rng) => sort(rng, "Welcher Satz kommt in dieser Personenbeschreibung als Nächstes?", PERSON_ORDER, "Erst der Gesamteindruck, dann von oben nach unten.", "person"),
			(rng) => sort(rng, "Was brauchen deine Leser hier?", FINDER, "Hilft die Angabe wirklich, etwas zu finden oder nachzumachen?", "brauchen"),
			(rng) => typed(rng, "Schreibe das Verb in der Klammer in der Gegenwart (Präsens).", PRESENT_FORMS, "Beschreibungen stehen meist in der Gegenwart. Wer tut etwas: du, sie oder er?", "praesens"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 5 Berichten ---------- */

const OPEN_QUESTION: [string, string][] = [
	["Lena stürzte auf dem Pausenhof und verletzte sich am Knie.", "Wann"],
	["Tom fand in der Turnhalle eine Geldbörse.", "Wann"],
	["Am Montag stürzte Lena und verletzte sich am Knie.", "Wo"],
	["Am Freitag wurde im Museum ein Preis überreicht.", "Wer"],
	["Am Dienstag war Jonas im Schulgarten.", "Was"],
];

const OTHER_QUESTION = "Auch das ist offen, aber hier fehlt eine der vier Grundfragen: Wer, Wann, Wo oder Was.";

function openQuestion(rng: Rng): Task {
	const [material, answer] = pick(rng, OPEN_QUESTION);
	return text({
		prompt: "Eine der vier Grundfragen bleibt in diesem Bericht offen. Schreibe nur das Fragewort auf.",
		material,
		accept: [answer, `${answer}?`],
		hint: "Prüfe der Reihe nach: Wer? Wann? Wo? Was?",
		explanation: `Das bleibt hier offen: ${answer}?`,
		mistakes: {
			Warum: OTHER_QUESTION,
			"Warum?": OTHER_QUESTION,
			Wie: OTHER_QUESTION,
			"Wie?": OTHER_QUESTION,
		},
		key: `offen:${material}`,
	});
}

const REPORT_BELONGS: Item[] = [
	["Um 10 Uhr rutschte Paul auf dem nassen Boden aus.", "gehört in den Bericht", ["gehört nicht in den Bericht: eine Meinung", "gehört nicht in den Bericht: erfunden"], "Der Satz sagt sachlich, was wann geschah."],
	["Frau Maier rief sofort die Sanitäter.", "gehört in den Bericht", ["gehört nicht in den Bericht: eine Meinung", "gehört nicht in den Bericht: erfunden"], "Das ist eine wichtige Tatsache."],
	["Die Klasse 4b fuhr um 8 Uhr mit dem Bus zur Burg.", "gehört in den Bericht", ["gehört nicht in den Bericht: eine Meinung", "gehört nicht in den Bericht: erfunden"], "Wer, wann, wie und wohin stehen hier sachlich."],
	["Das war der schönste Tag meines Lebens!", "gehört nicht in den Bericht: eine Meinung", ["gehört in den Bericht", "gehört nicht in den Bericht: erfunden"], "Ein Bericht nennt Tatsachen, nicht deine Meinung."],
	["Ich finde, der Hausmeister ist total nett.", "gehört nicht in den Bericht: eine Meinung", ["gehört in den Bericht", "gehört nicht in den Bericht: erfunden"], "Das ist deine Meinung, keine Information über den Vorfall."],
	["Auf der Burg begegnete uns ein feuerspeiender Drache.", "gehört nicht in den Bericht: erfunden", ["gehört in den Bericht", "gehört nicht in den Bericht: eine Meinung"], "Ein Bericht erzählt, was wirklich geschah."],
];

const TIME_ORDER: Item[] = [
	["Bericht vom Ausflug. Bisher: Um 8 Uhr fuhren wir los. Um 9 Uhr kamen wir an der Burg an.", "Dann führte uns eine Frau durch die Burg.", ["Um 12 Uhr aßen wir auf der Wiese unsere Brotzeit.", "Um 7 Uhr packten wir zu Hause unsere Rucksäcke."], "Die Führung schließt direkt an. Die Brotzeit kommt erst danach, das Packen war vorher."],
	["Bericht vom Vorfall. Bisher: In der Pause spielten Lea und Finn Fangen. Lea stolperte über eine Tasche.", "Sie fiel hin und schlug sich das Knie auf.", ["Am Nachmittag ging es ihr schon wieder viel besser.", "Die große Pause hatte an diesem Tag um 10 Uhr begonnen."], "Erst der Sturz, dann die Folgen. Die Zeit der Pause gehört an den Anfang."],
	["Bericht vom Sportfest. Bisher: Um 9 Uhr begrüßte uns die Schulleiterin.", "Danach starteten die ersten Läufe.", ["Am Ende bekam jede Klasse vor dem Schulhaus eine Urkunde.", "Vorher hatten wir uns in der Turnhalle schnell umgezogen."], "Nach der Begrüßung geht das Fest los."],
	["Bericht vom Feueralarm. Bisher: Um 11 Uhr heulte die Sirene. Alle Klassen gingen auf den Schulhof.", "Dort zählten die Lehrkräfte die Kinder.", ["Um 11.30 Uhr durften wir zurück in unser Schulhaus.", "Am Morgen hatten wir noch ganz normal Mathematik."], "Erst zählen, dann zurückgehen."],
];

const FACTUAL: Item[] = [
	["Etwas Spannendes passierte auf dem Schulhof.", "Am Mittwoch fiel auf dem Schulhof ein Ast von der Kastanie.", ["Am Mittwoch krachte es furchtbar, und alle bekamen einen Riesenschreck!", "Ein Riesending stürzte auf uns herab, und wir rannten um unser Leben!"], "Der sachliche Satz nennt Zeit, Ort und Geschehen."],
	["Der Ball flog total heftig gegen das Fenster.", "Der Ball traf das Fenster, und die Scheibe bekam einen Riss.", ["Peng! Der Ball sauste wie eine Rakete los und zerschmetterte alles!", "Der arme Ball und das arme Fenster, das war wirklich schrecklich!"], "Ein Bericht nennt nur, was geschah."],
	["Unser Ausflug war mega toll.", "Am Freitag besuchte die Klasse 4a das Römermuseum.", ["Es war das Allerbeste, was wir in unserem ganzen Leben erlebt haben!", "Wow, das Römermuseum ist einfach super, da müsst ihr alle hin!"], "Der Bericht nennt, wer wann wo war."],
	["Der fiese Hund erschreckte uns alle.", "Vor dem Schultor bellte ein großer Hund die Kinder an.", ["Der Hund war ein gemeines Monster, und wir hassen ihn alle sehr!", "Wir waren starr vor Angst, und unsere Herzen rasten wie verrückt!"], "„Fies“ und „Monster“ sind Wertungen."],
	["Es regnete wie verrückt, und alles war schrecklich.", "Wegen des starken Regens fiel das Sportfest aus.", ["Der Himmel weinte den ganzen Tag lang, und wir weinten alle mit!", "Das Wetter hat uns den schönen Tag total verdorben, so ein Mist!"], "Der sachliche Satz nennt das Wetter und die Folge."],
];

const PAST_FORMS: TypedItem[] = [
	["Am Montag [[…]] Lena auf dem Pausenhof. (stürzen)", ["stürzte"], "Lena stürzte: 1. Vergangenheit."],
	["Um 8 Uhr [[…]] die Klasse mit dem Bus los. (fahren)", ["fuhr"], "Die Klasse fuhr: 1. Vergangenheit."],
	["Frau Maier [[…]] sofort die Sanitäter. (rufen)", ["rief"], "Sie rief: 1. Vergangenheit."],
	["Tom [[…]] in der Turnhalle eine Geldbörse. (finden)", ["fand"], "Tom fand: 1. Vergangenheit."],
	["Ein Ast [[…]] von der Kastanie. (fallen)", ["fiel"], "Der Ast fiel: 1. Vergangenheit."],
	["Am Freitag [[…]] wir das Museum. (besuchen)", ["besuchten"], "Wir besuchten: 1. Vergangenheit."],
];

const berichten: Lesson = {
	id: "berichten",
	stage: "schreibwerkstatt",
	title: "Sachlich berichten",
	skill: "Du schreibst vollständig und in der richtigen zeitlichen Ordnung, was geschehen ist.",
	lehrplan: "D3/4 3.2: berichtende Texte, Vollständigkeit und zeitliche Ordnung",
	bindings: ["3.2-06"],
	sticker: { emoji: "📰", name: "Reporter" },
	paragraphs: [
		"Ein Bericht sagt anderen, was wirklich geschehen ist, zum Beispiel bei einem Ausflug oder bei einem Vorfall in der Pause. Er soll vollständig sein. Prüfe die W-Fragen: Wer? Was? Wann? Wo? Oft auch: Wie? und Warum?",
		"Du schreibst in der Reihenfolge, in der alles geschah. Spannung brauchst du hier nicht. Ein Bericht beginnt also nicht mit dem Aufregendsten, sondern am Anfang.",
		"Du berichtest sachlich und meist in der 1. Vergangenheit (Präteritum). Deine Meinung und erfundene Dinge gehören nicht hinein. Auch Ausrufe wie „Wow!“ lässt du weg.",
	],
	example: {
		title: "Tinto berichtet vom Pausenhof",
		lines: [
			"Wann und wo: Am Dienstag um 10 Uhr auf dem Pausenhof.",
			"Wer: Finn aus der Klasse 4b.",
			"Was: Finn stolperte über eine Tasche und stürzte.",
			"Folge: Frau Maier kühlte sein Knie. Danach ging es ihm besser.",
		],
	},
	takeaway: "Ein Bericht ist vollständig, sachlich und zeitlich geordnet: Wer? Was? Wann? Wo? Meinung und Erfundenes gehören nicht hinein.",
	terms: [
		{ term: "W-Fragen", meaning: "Wer? Was? Wann? Wo? Wie? Warum? Sie prüfen, ob etwas fehlt." },
		{ term: "1. Vergangenheit (Präteritum)", meaning: "die Zeitform für Vergangenes in Berichten: Er stürzte, sie rief." },
	],
	check: {
		wrong: "Nur: Wer war am lustigsten?",
		explanation: "Die W-Fragen zeigen dir, ob dein Bericht vollständig ist.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Die Reporter-Stifte",
			intro: "Jeder Bericht antwortet auf die W-Fragen. Wähle einen Stift und markiere in jedem Satz, wer, wann, wo und was geschah.",
			pens: [
				{ value: "P", label: "Wer?", colour: "blue" },
				{ value: "T", label: "Wann?", colour: "orange" },
				{ value: "O", label: "Wo?", colour: "green" },
				{ value: "E", label: "Was geschah?", colour: "purple" },
			],
			puzzles: [
				marks("sturz", "Am_Montag|T stürzte|E Jonas|P auf_dem_Pausenhof|O .", "Satz aus einem Unfallbericht", "Das Verb sagt dir, was geschah."),
				marks("museum", "Am_Freitag|T besuchte|E die_Klasse_4b|P das_Römermuseum|O .", "Satz aus einem Ausflugsbericht", "Wo war die Klasse?"),
				marks("sportfest", "In_der_Turnhalle|O eröffnete_das_Sportfest|E Frau_Maier|P um_zehn_Uhr|T .", "Satz über das Sportfest", "Hier steht der Ort am Anfang."),
			],
		},
		["Markiere den Satz über den Sturz.", "Markiere den Satz über den Ausflug.", "Markiere den Satz über das Sportfest."],
	),
	desk: {
		task: "Schreibe einen kurzen Bericht über einen Ausflug oder über etwas, das in der Pause geschehen ist.",
		checklist: ["Mein Bericht antwortet auf Wer? Was? Wann? Wo?", "Alles steht in der richtigen zeitlichen Reihenfolge.", "Ich habe meine Meinung und Erfundenes weggelassen.", "Ich schreibe in der 1. Vergangenheit (Präteritum)."],
	},
	generators: {
		1: [openQuestion, (rng) => sort(rng, "Gehört dieser Satz in einen Bericht?", REPORT_BELONGS, "Ist es eine Tatsache? Oder ist es eine Meinung oder erfunden?", "gehoert")],
		2: [
			(rng) => sort(rng, "Welcher Satz kommt in diesem Bericht als Nächstes?", TIME_ORDER, "Stelle dir den Ablauf wie einen Film vor. Was geschieht direkt danach?", "zeit"),
			(rng) => sort(rng, "Wie schreibst du das sachlich für einen Bericht?", FACTUAL, "Welcher Satz nennt nur, was geschah, ohne Wertung und Übertreibung?", "sachlich"),
			(rng) => typed(rng, "Schreibe das Verb in der Klammer in der 1. Vergangenheit (Präteritum).", PAST_FORMS, "Berichte stehen meist in der 1. Vergangenheit: gestern stürzte, fuhr, rief.", "praeteritum"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 6 Begründen ---------- */

const ARGUMENT_PARTS: Item[] = [
	["Ich bin dafür, dass wir an den Chiemsee fahren.", "Standpunkt", ["Grund", "Beispiel"], "Hier sagst du, was du möchtest."],
	["Meiner Meinung nach sollten wir eine Pausenbücherei einrichten.", "Standpunkt", ["Grund", "Beispiel"], "„Meiner Meinung nach“ kündigt deinen Standpunkt an."],
	["Dort können alle Kinder baden, auch wenn sie noch nicht gut schwimmen.", "Grund", ["Standpunkt", "Beispiel"], "Der Satz sagt, warum der Vorschlag gut ist."],
	["Viele Kinder lesen in der Pause gern, weil es dort ruhig ist.", "Grund", ["Standpunkt", "Beispiel"], "„Weil“ zeigt dir den Grund."],
	["Zum Beispiel gibt es dort einen flachen Strand für Anfänger.", "Beispiel", ["Standpunkt", "Grund"], "„Zum Beispiel“ macht den Grund anschaulich."],
	["Zum Beispiel liest Mia in jeder Pause in ihrem Buch.", "Beispiel", ["Standpunkt", "Grund"], "Mia zeigt an einem Fall, dass der Grund stimmt. „Zum Beispiel“ kündigt das an."],
];

const FITTING_REASON: Item[] = [
	["Wir sollten den Computerplatz wochenweise verteilen.", "So kommt jedes Kind gleich oft dran.", ["Computer sind aus Metall und Kunststoff.", "Ich mag Computer einfach am liebsten."], "Der Grund zeigt, warum die Regel für alle gut ist."],
	["Der Wandertag sollte in den Bayerischen Wald gehen.", "Dort können wir den Baumwipfelpfad besuchen.", ["Der Wald ist ein Wald.", "Weil ich es so will."], "Das nennt etwas, das am Ziel wirklich gut ist."],
	["Wir brauchen längere Pausen.", "Danach können sich alle wieder besser konzentrieren.", ["Pausen sind auf dem Stundenplan.", "Mein Bruder hat auch Pausen."], "Das nennt einen Vorteil für das Lernen."],
	["Unsere Klasse sollte ein Beet anlegen.", "So lernen wir, wie Pflanzen wachsen.", ["Beete haben vier Ecken.", "Ich finde das eben so."], "Hier steht, was alle davon haben."],
	["Es sollte einen Spieletag geben.", "Beim Spielen lernen sich alle Kinder besser kennen.", ["Es gibt sehr viele Spiele.", "Spiele kann man kaufen."], "Dieser Grund zeigt einen echten Nutzen."],
];

const STRONG_REASONS: Item[] = [
	["Lea möchte die Klasse von einem Ausflug zum Bauernhof überzeugen.", "Dort sehen wir, woher unsere Lebensmittel kommen.", ["Ich will da einfach unbedingt hin, weil ich es mir so wünsche.", "Wer nicht mitkommen will, ist doof, und das sage ich auch allen."], "Der Grund betrifft alle. Die anderen Sätze überzeugen niemanden."],
	["Tom möchte eine Regel für den Fußballplatz.", "Dann streiten wir weniger, und jede Klasse kann spielen.", ["Wir sind einfach die Besten und sollten deshalb immer spielen dürfen.", "Weil ich das gesagt habe, und das muss jetzt einfach genügen."], "Weniger Streit und gerechte Zeiten überzeugen alle."],
	["Mia möchte weniger Hausaufgaben am Wochenende.", "Dann bleibt mehr Zeit für Sport, Familie und Freunde.", ["Hausaufgaben sind voll blöd, und das finde ich schon seit Langem.", "Alle anderen finden das bestimmt auch, glaube ich zumindest."], "Der Grund erklärt, was dadurch besser wird."],
	["Ben möchte, dass die Klasse Müll trennt.", "So kann mehr Papier und Plastik wiederverwertet werden.", ["Müll stinkt, und das nervt mich jeden Tag im Klassenzimmer.", "Das macht man jetzt halt so, auch wenn keiner weiß, warum."], "Der Grund nennt den Nutzen für die Umwelt."],
];

const SUPPORTING_EXAMPLES: Item[] = [
	["Grund: Beim Baumwipfelpfad lernen wir viel über den Wald.", "Zum Beispiel zeigen Schautafeln, welche Tiere dort leben.", ["Zum Beispiel fuhr mein Onkel im letzten Sommer nach Italien ans Meer.", "Zum Beispiel ist heute Dienstag, und morgen ist dann schon Mittwoch."], "Das Beispiel gehört zum Grund und zeigt, was man dort lernt."],
	["Grund: Längere Pausen helfen beim Lernen.", "Zum Beispiel rechnen wir nach dem Sport viel konzentrierter.", ["Zum Beispiel esse ich in der Pause besonders gern einen Apfel.", "Zum Beispiel hat unsere Schule zwei große Türen zum Pausenhof."], "Das Beispiel zeigt die Wirkung einer Bewegungspause."],
	["Grund: Mit einer Klassenregel kommt jeder an den Computer.", "Zum Beispiel kommen jede Woche zwei andere Kinder dran.", ["Zum Beispiel haben manche Computer eine Maus und eine große Tastatur.", "Zum Beispiel lese ich viel lieber Comics als lange Geschichten."], "Das Beispiel zeigt, wie die Regel funktioniert."],
	["Grund: Auf dem Bauernhof sehen wir, woher unser Essen kommt.", "Zum Beispiel können wir beim Melken zusehen.", ["Zum Beispiel fuhr unser Bus letztes Jahr bis nach Passau an die Donau.", "Zum Beispiel bin ich am Wochenende sehr gern draußen im Garten."], "Das Melken gehört direkt zum Grund."],
];

const ARGUMENT_WORDS: TypedItem[] = [
	["Wir sollten ein Beet anlegen, [[…]] wir so lernen, wie Pflanzen wachsen.", ["weil", "da"], "„Weil“ leitet einen Grund ein."],
	["Der Computerplatz sollte wechseln, [[…]] jedes Kind gleich oft drankommen soll.", ["weil", "da"], "„Weil“ leitet einen Grund ein."],
	["Zum [[…]] gibt es dort einen flachen Strand.", ["Beispiel"], "„Zum Beispiel“ kündigt einen einzelnen Fall an."],
	["Ich bin [[…]], dass wir an den See fahren.", ["dafür"], "„Ich bin dafür, dass …“ nennt deinen Standpunkt."],
	["[[…]] Meinung nach sollten wir längere Pausen machen.", ["Meiner"], "„Meiner Meinung nach“ kündigt deinen Standpunkt an."],
	["Du hast alle Gründe gehört. [[…]] stimmt bitte für den Bauernhof!", ["Deshalb", "Darum", "Daher"], "„Deshalb“ zieht am Schluss die Folgerung."],
];

const begruenden: Lesson = {
	id: "standpunkt-begruenden",
	stage: "schreibwerkstatt",
	title: "Meinung begründen",
	skill: "Du vertrittst einen Standpunkt und stützt ihn mit Gründen und Beispielen.",
	lehrplan: "D3/4 3.2: Gründe und Beispiele zu einer Position, argumentierende Texte nach Textvorbildern",
	bindings: ["3.2-07", "3.2-08"],
	sticker: { emoji: "🗣️", name: "Überzeuger" },
	paragraphs: [
		"Manchmal willst du andere überzeugen, zum Beispiel vom Ziel für den Wandertag. Dann sagst du zuerst deinen Standpunkt: Was möchtest du? Beginnen kannst du mit „Ich bin dafür, dass …“ oder „Meiner Meinung nach …“.",
		"Danach kommen Gründe. Ein guter Grund erklärt, warum dein Vorschlag für alle gut ist. „Weil ich das will“ überzeugt niemanden. Sammle zuerst mehrere Gründe und ordne sie: Der stärkste kommt oft zum Schluss.",
		"Ein Beispiel macht deinen Grund anschaulich: „Zum Beispiel gibt es dort …“. So baust du einen Text wie nach einem Vorbild: Standpunkt, Gründe, Beispiele und ein kurzer Schluss.",
	],
	example: {
		title: "Tinto schreibt an die Klasse",
		lines: [
			"Standpunkt: Ich bin dafür, dass wir zum Bauernhof fahren.",
			"Grund: Dort sehen wir, woher unsere Lebensmittel kommen.",
			"Beispiel: Wir können beim Melken zusehen.",
			"Schluss: Deshalb stimmt bitte für den Bauernhof!",
		],
	},
	takeaway: "Standpunkt nennen, Gründe sammeln und ordnen, mit Beispielen zeigen. Ein guter Grund erklärt, warum der Vorschlag für alle gut ist.",
	terms: [
		{ term: "Standpunkt", meaning: "das, was du meinst oder möchtest" },
		{ term: "Grund", meaning: "die Antwort auf die Frage: Warum ist das gut?" },
		{ term: "Beispiel", meaning: "ein einzelner Fall, der deinen Grund zeigt" },
	],
	check: {
		wrong: "nur ein lauter Ausruf",
		explanation: "Standpunkt, Gründe und Beispiele machen deine Meinung nachvollziehbar.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Der Überzeugungs-Plan",
			intro: "Tinto will überzeugen. Wähle einen Stift und ordne jeden Satz zu. Was nichts zur Sache beiträgt, bleibt ohne Farbe.",
			pens: [
				{ value: "S", label: "Standpunkt", colour: "purple" },
				{ value: "G", label: "Grund", colour: "blue" },
				{ value: "B", label: "Beispiel", colour: "green" },
			],
			puzzles: [
				marks("bauernhof", "Ich_bin_für_den_Bauernhof.|S Dort_sehen_wir,_woher_unser_Essen_kommt.|G Zum_Beispiel_können_wir_beim_Melken_zusehen.|B Mein_Pulli_ist_grün.", "Ziel für den Wandertag", "Ein Satz hat mit dem Ausflug nichts zu tun."),
				marks("computer", "Der_Computerplatz_sollte_wochenweise_wechseln.|S Dann_kommt_jedes_Kind_gleich_oft_dran.|G So_wären_diese_Woche_Ali_und_Mia_dran.|B Computer_haben_einen_Bildschirm.", "Regel für den Computerplatz", "Welcher Satz stimmt zwar, hilft aber nicht beim Überzeugen?"),
				marks("beet", "Zum_Beispiel_ernten_wir_im_Herbst_Kürbisse.|B Wir_sollten_ein_Beet_anlegen.|S So_lernen_wir,_wie_Pflanzen_wachsen.|G Gestern_hat_es_geregnet.", "Beet für die Klasse", "Hier steht das Beispiel vorn. Lies alle Sätze zuerst."),
			],
		},
		["Ordne die Sätze zum Wandertag.", "Ordne die Sätze zum Computerplatz.", "Ordne die Sätze zum Beet."],
	),
	desk: {
		task: "Worüber möchtest du mitbestimmen? Vielleicht über das Ziel für den Wandertag oder eine Regel in der Klasse. Schreibe auf, was du möchtest, und überzeuge die anderen.",
		checklist: ["Ich nenne zuerst meinen Standpunkt.", "Ich habe mindestens zwei Gründe.", "Jeder Grund hilft auch den anderen.", "Ein Beispiel macht meinen Grund anschaulich."],
	},
	generators: {
		1: [
			(rng) => sort(rng, "Was ist dieser Satz?", ARGUMENT_PARTS, "Was möchte jemand? Warum ist das gut? Oder zeigt der Satz einen einzelnen Fall?", "teil"),
			(rng) => sort(rng, "Welcher Grund passt zu diesem Standpunkt?", FITTING_REASON, "Der Grund antwortet auf die Frage: Warum ist das gut?", "passend"),
		],
		2: [
			(rng) => sort(rng, "Welcher Grund überzeugt die anderen am ehesten?", STRONG_REASONS, "Würde auch jemand zustimmen, der zuerst anderer Meinung war?", "stark"),
			(rng) => sort(rng, "Welches Beispiel stützt diesen Grund?", SUPPORTING_EXAMPLES, "Das Beispiel muss genau zu diesem Grund gehören.", "beispiel"),
			(rng) => typed(rng, "Ergänze das Wort, das hier fehlt.", ARGUMENT_WORDS, "Soll hier ein Grund, ein Beispiel, dein Standpunkt oder der Schluss stehen?", "signalwort"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 7 Schreiben zum Verstehen ---------- */

const story = (id: string) => {
	const p = STORIES.find((s) => s.id === id) as Passage;
	return { title: p.title, paragraphs: p.paragraphs };
};
const fact = (id: string) => {
	const p = FACT_TEXTS.find((s) => s.id === id) as Passage;
	return { title: p.title, paragraphs: p.paragraphs };
};

const VOICES: [string, string, string, [string, string], string][] = [
	["drachen", "Ich stand allein am Zaun und traute mich nicht, jemanden anzusprechen.", "Ben", ["Tim", "die Lehrerin"], "Am Zaun stand Ben, der neue Junge."],
	["drachen", "Mein Drachen hing fest, und niemand wusste Rat.", "Tim", ["Ben", "der Hausmeister"], "Der Drachen gehört Tim."],
	["drachen", "Der neue Junge warf einen Tennisball, und schon hatte ich meinen Drachen zurück.", "Tim", ["Ben", "die Kastanie"], "Tim bekommt seinen Drachen zurück."],
	["brunnen", "Als ich durch das Gitter schaute, blitzte tief unten etwas.", "Mia", ["Oma", "der Schlüssel"], "Mia schaut durch das Gitter."],
	["brunnen", "Zwanzig Jahre habe ich diesen Schlüssel gesucht!", "Oma", ["Mia", "die Truhe"], "Oma sucht den Schlüssel schon so lange."],
	["brunnen", "Auf dem alten Foto hatte Oma die gleiche Zahnlücke wie ich.", "Mia", ["Oma", "der Brunnen"], "Mia entdeckt die Zahnlücke."],
];

function voice(rng: Rng): Task {
	const [id, material, answer, wrong, why] = pick(rng, VOICES);
	return choice(rng, {
		prompt: "Aus wessen Sicht ist dieser Satz geschrieben?",
		material,
		passage: story(id),
		answer,
		wrong,
		hint: "Lies die Geschichte. Wer könnte „ich“ sein?",
		explanation: why,
		key: `sicht:${material}`,
	});
}

const LEARNING_LOG: Item[] = [
	["Lea schreibt nach einer Rechtschreibstunde in ihr Lerntagebuch.", "Heute habe ich gelernt, wie ich Wörter verlängere, um d und t zu unterscheiden.", ["Heute hatten wir Rechtschreibung.", "Unsere Lehrerin trug einen blauen Pullover."], "Das Tagebuch nennt, was du gelernt hast, nicht nur, was stattfand."],
	["Tim schreibt nach dem Lesen eines Sachbuchs in sein Lesetagebuch.", "Neu war für mich, dass Igel Winterschlaf halten.", ["Das Buch hat 40 Seiten.", "Das Buch habe ich am Montag bekommen."], "„Neu war für mich“ zeigt, was du gelernt hast."],
	["Mia schreibt nach einer Schreibstunde in ihr Lerntagebuch.", "Schwer fiel mir, kurze Sätze an der spannenden Stelle zu finden.", ["Ich saß heute neben Ali.", "Die Stunde dauerte 45 Minuten."], "Auch das, was schwer war, gehört in dein Lerntagebuch."],
	["Finn schreibt am Ende einer Woche in sein Lesetagebuch.", "Diese Woche habe ich gemerkt, dass ich Tabellen schon viel schneller lese.", ["Diese Woche war es oft kalt.", "Am Freitag gab es Nudeln."], "Du beschreibst deinen Fortschritt."],
];

const LEARNING_PROGRESS: Item[] = [
	["Wie beschreibst du deinen Fortschritt beim Grundwortschatz?", "Vor zwei Wochen schrieb ich fünf Wörter richtig, heute neun.", ["Ich bin eigentlich schon immer ziemlich gut in Deutsch gewesen, finde ich.", "Wörter üben ist doof, aber es muss halt leider irgendwie sein."], "Dieser Eintrag sagt genau, was sich verändert hat."],
	["Wie beschreibst du, was dir beim Gedicht geholfen hat?", "Ich habe die Reimwörter markiert, dann ging das Merken leichter.", ["Das Gedicht war irgendwie gut, und ich habe es auch irgendwie gekonnt.", "Gedichte stehen oft in Büchern und haben meistens mehrere Strophen."], "Du nennst, was du getan hast und wie es dir half."],
	["Wie planst du den nächsten Schritt?", "Morgen übe ich Wörter mit „ie“, denn dort mache ich noch Fehler.", ["Morgen ist wieder Schule, und dann sehen wir einfach, wie es so läuft.", "Hoffentlich wird es irgendwann besser, das wäre wirklich sehr schön."], "Ein guter Plan nennt, was du genau üben willst."],
	["Wie beschreibst du eine Schwierigkeit beim Lesen?", "Ich verstand „nachtaktiv“ nicht. Der nächste Satz hat es erklärt.", ["Der Text war mir heute einfach zu lang und auch ziemlich langweilig.", "Lesen mag ich nicht so gern, lieber spiele ich draußen Fußball."], "Du sagst genau, wo es schwierig war und was half."],
];

const SUMMARIES: [string, "fact" | "story", string, [string, string], string][] = [
	["igel", "fact", "Igel sind nachts unterwegs, fressen vor allem Käfer, Raupen und Würmer, schützen sich mit Stacheln und halten Winterschlaf.", ["Igel fressen Käfer.", "Der Igel ist nachtaktiv. Am Tag schläft er in einem Versteck aus Laub. Erst in der Dämmerung geht er auf Nahrungssuche."], "Die Zusammenfassung nennt das Wichtigste aus allen Absätzen, mit eigenen Worten. Das Abschreiben eines Absatzes reicht nicht."],
	["bienen", "fact", "In einem Bienenstock legt die Königin die Eier. Arbeiterinnen sammeln Nektar für den Honig und zeigen einander mit einem Tanz das Futter.", ["Bienen tanzen gern.", "In einem Bienenstock leben viele tausend Bienen. Die meisten sind Arbeiterinnen. Nur eine Biene legt die Eier: die Königin. Die Arbeiterinnen fliegen zu den Blüten."], "Hier kommt jeder Absatz vor. Abgeschriebene Sätze aus dem Anfang reichen nicht."],
	["wasser", "fact", "Wasser verdunstet, bildet in der kalten Luft Wolken, fällt als Regen oder Schnee und fließt zurück ins Meer.", ["Die Sonne ist heiß, und Wasser ist nass.", "Die Sonne erwärmt das Wasser in Meeren, Seen und Flüssen. Dabei verdunstet ein Teil des Wassers. Es steigt als unsichtbarer Wasserdampf in die Luft."], "Die Zusammenfassung nennt den ganzen Weg, nicht nur ein Stück."],
	["brunnen", "story", "Mia und ihre Oma angeln einen alten Schlüssel aus dem Brunnen und finden damit in einer Truhe Fotos von Oma als Kind.", ["Oma hat einen Dachboden.", "Mia besuchte in den Ferien ihre Oma auf dem Land. Hinter dem Haus stand ein alter Brunnen, abgedeckt mit einem Gitter. Als Mia durch das Gitter schaute, blitzte etwas."], "Das fasst die ganze Handlung zusammen."],
	["drachen", "story", "Der neue Junge Ben holt Tims Drachen aus dem Baum und findet so einen Freund.", ["Tims Drachen hängt im Baum.", "Ben war neu in der Klasse. In den Pausen stand er allein am Zaun und sagte kaum ein Wort."], "Der Satz nennt Anfang, Ereignis und Ausgang in Kürze."],
];

function summary(rng: Rng): Task {
	const [id, kind, answer, wrong, why] = pick(rng, SUMMARIES);
	return choice(rng, {
		prompt: "Welcher Text fasst das Wichtigste am besten zusammen?",
		passage: kind === "fact" ? fact(id) : story(id),
		answer,
		wrong,
		hint: "Eine Zusammenfassung nennt das Wichtigste aus dem ganzen Text, nicht nur ein Stück.",
		explanation: why,
		key: `zusammen:${id}`,
	});
}

const DIARIES: [string, string, [string, string], string][] = [
	["Was schreibt Ben am Abend in sein Tagebuch?", "Heute habe ich mich zum ersten Mal getraut. Vielleicht habe ich jetzt einen Freund.", ["Ich habe mich sehr geärgert, weil mein schöner Drachen hoch im Baum hängen blieb.", "Heute war ich gar nicht in der Schule, denn ich war den ganzen Tag krank zu Hause."], "Ben hat den Drachen gerettet, und Tim lädt ihn ein. Das macht ihm Mut."],
	["Was schreibt Tim am Abend in sein Tagebuch?", "Ben sagt fast nie etwas, aber er hatte als Einziger eine Idee.", ["Heute war Ben ganz laut und hat allen anderen gesagt, was sie tun sollen.", "Mein Drachen ist für immer verloren, und niemand konnte mir helfen."], "Tim hat gerade gemerkt, wie klug der stille Ben ist."],
];

function diary(rng: Rng): Task {
	const [prompt, answer, wrong, why] = pick(rng, DIARIES);
	return choice(rng, {
		prompt,
		passage: story("drachen"),
		answer,
		wrong,
		hint: "Versetze dich in die Figur. Was hat sie erlebt, und wie fühlt sie sich?",
		explanation: why,
		key: `tagebuch:${prompt}`,
	});
}

const I_FORMS: TypedItem[] = [
	["Ben geht nach Hause. → Ich [[…]] nach Hause.", ["gehe"], "Aus „Ben geht“ wird „ich gehe“."],
	["Mia sieht etwas im Brunnen. → Ich [[…]] etwas im Brunnen.", ["sehe"], "Aus „Mia sieht“ wird „ich sehe“."],
	["Oma sucht den Schlüssel. → Ich [[…]] den Schlüssel.", ["suche"], "Aus „Oma sucht“ wird „ich suche“."],
	["Ben freut sich. → Ich [[…]] mich.", ["freue"], "Aus „Ben freut sich“ wird „ich freue mich“."],
	["Tim hat eine Idee. → Ich [[…]] eine Idee.", ["habe"], "Aus „Tim hat“ wird „ich habe“."],
	["Ben wirft den Ball. → Ich [[…]] den Ball.", ["werfe"], "Aus „Ben wirft“ wird „ich werfe“."],
];

const verstehen: Lesson = {
	id: "schreiben-und-verstehen",
	stage: "schreibwerkstatt",
	title: "Schreiben hilft verstehen",
	skill: "Du schreibst aus der Sicht einer Figur, fasst Sachtexte zusammen und hältst fest, was du gelernt hast.",
	lehrplan: "D3/4 3.2: Schreiben zum Erschließen von Texten, Lernerfahrungen beschreiben",
	bindings: ["3.2-09", "3.2-10"],
	sticker: { emoji: "📓", name: "Tagebuchschreiber" },
	paragraphs: [
		"Wer über einen Text schreibt, versteht ihn besser. Schreibe zum Beispiel aus der Sicht einer Figur: Du bist Ben aus „Der neue Junge“ und schreibst in der Ich-Form auf, was du erlebt und gefühlt hast.",
		"Bei einem Sachtext hilft eine Zusammenfassung. Sie nennt nur das Wichtigste aus dem ganzen Text, mit eigenen Worten. Einzelne Sätze abzuschreiben reicht nicht.",
		"In einem Lern- oder Lesetagebuch hältst du fest, was du gelernt hast: Was war neu? Was fiel mir schwer? Was hat mir geholfen? Was übe ich als Nächstes? So siehst du später, wie viel du dazugelernt hast.",
	],
	example: {
		title: "Tinto schreibt über einen Text",
		lines: [
			"Aus Bens Sicht: Heute habe ich Tims Drachen gerettet. Mein Herz klopfte.",
			"Zusammenfassung: Ben holt den Drachen herunter und findet einen Freund.",
			"Lerntagebuch: Neu war für mich, dass ich die Sicht wechseln kann.",
		],
	},
	takeaway: "Figurensicht: in der Ich-Form schreiben. Zusammenfassung: nur das Wichtigste mit eigenen Worten. Lerntagebuch: Was habe ich gelernt, was war schwer, was übe ich?",
	terms: [
		{ term: "Perspektive", meaning: "die Sicht, aus der etwas erzählt wird" },
		{ term: "Zusammenfassung", meaning: "kurzer Text mit dem Wichtigsten eines längeren Textes" },
		{ term: "Lerntagebuch", meaning: "Heft, in dem du festhältst, was und wie du lernst" },
	],
	check: {
		wrong: "nur die Überschrift",
		explanation: "Eine Zusammenfassung nennt das Wichtigste aus dem ganzen Text, kurz und mit eigenen Worten.",
	},
	workshop: slotWorkshop(
		{
			variant: "gap",
			title: "Die Sichtwechsel-Brille",
			intro: "Tinto schreibt um. Wähle in jedem Satz das passende Wort. Achte auf die Überschrift: Was soll entstehen?",
			pens: [],
			puzzles: [
				gaps("ben", "{Ich|Er|Tim} stand allein am Zaun.\nAm Freitag hing Tims Drachen im Baum, und {ich|er|Tim} warf einen Tennisball über den Ast.\nZum ersten Mal lächelte {ich|er|Tim}.", "Aus der Sicht von Ben", "Du bist Ben. Du erzählst selbst."),
				gaps("kurz", "Der Igel ist {nachts|morgens|mittags} unterwegs.\nEr frisst vor allem {Käfer|Nüsse|Fische}.\nIm Winter hält er {Winterschlaf|Abstand|Mittagsruhe}.", "Zusammenfassung „Der Igel“", "Du kennst den Text aus der Lesewerkstatt. Der Igel ist nachtaktiv."),
				gaps("tagebuch", "Das wusste ich noch nicht: {Neu|Alt|Bekannt} war für mich, wie das Wasser in die Wolken kommt.\nDas konnte ich zuerst nicht erklären: {Schwer|Leicht|Lustig} fiel mir das Wort „verdunsten“.\nDas kommt jetzt: Als {Nächstes|Letztes|Gestern} übe ich, den Weg des Wassers zu erklären.", "Eintrag im Lerntagebuch", "Was war neu, was war schwer, was kommt jetzt?"),
			],
		},
		["Schreibe die Sätze aus Bens Sicht.", "Fülle die Zusammenfassung aus.", "Fülle den Eintrag im Lerntagebuch aus."],
	),
	desk: {
		task: "Schreibe in dein Lerntagebuch: Was hast du diese Woche in Deutsch gelernt? Was war schwer? Was übst du als Nächstes? Oder schreibe aus der Sicht einer Figur aus deinem Lieblingsbuch. Oder fasse einen Sachtext in zwei Sätzen zusammen.",
		checklist: ["Ich nenne genau, was ich gelernt habe.", "Ich nenne etwas, das schwer war.", "Ich weiß, was ich als Nächstes übe.", "Aus Figurensicht schreibe ich in der Ich-Form.", "In einer Zusammenfassung steht nur das Wichtigste."],
	},
	generators: {
		1: [voice, (rng) => sort(rng, "Welcher Eintrag zeigt, was gelernt wurde?", LEARNING_LOG, "Steht in dem Satz, was du gelernt hast oder was schwer war?", "lerntagebuch")],
		2: [summary, diary, (rng) => sort(rng, "Welcher Eintrag ist am genauesten?", LEARNING_PROGRESS, "Sagt der Eintrag genau, was sich verändert hat oder was hilft?", "fortschritt"), (rng) => typed(rng, "Schreibe den Satz aus der Sicht der Figur. Ergänze das Verb in der Ich-Form.", I_FORMS, "Du bist jetzt die Figur. Was sagst du: ich …?", "ichform")],
	},
	requiredCorrect: 3,
};

/* ---------- 8 Überarbeiten ---------- */

const FEEDBACK: Item[] = [
	["Rückmeldung zu einer Geschichte", "Der Anfang macht neugierig. In der Mitte kannst du mehr von Finns Angst zeigen.", ["Das ist schlecht.", "Das hast du irgendwie gut gemacht."], "Die Rückmeldung nennt eine Stärke und eine konkrete Anregung."],
	["Rückmeldung zu einem Bericht", "Du nennst Zeit und Ort genau. Schreibe noch, wer dem verletzten Kind geholfen hat.", ["Dein Bericht ist langweilig.", "Berichte mag ich nicht."], "Hier weiß der Schreiber genau, was gelungen ist und was fehlt."],
	["Rückmeldung zu einer Beschreibung", "Die Schritte stehen gut der Reihe nach. Beim zweiten Schritt fehlt, wie viel Wasser man braucht.", ["Schreib das noch mal ganz neu.", "Das verstehe ich alles nicht."], "So eine Anregung kann man sofort umsetzen."],
	["Rückmeldung zu einem Text über den Wandertag", "Dein Grund mit dem Baumwipfelpfad überzeugt mich. Ein Beispiel dazu würde noch helfen.", ["Ich will aber woandershin.", "Du schreibst immer so."], "Sie würdigt den Grund und sagt, was noch fehlt."],
	["Rückmeldung zu einem Gedicht", "Die Reime gefallen mir sehr. In Zeile drei stimmt der Reim noch nicht ganz.", ["Gedichte sind doof.", "Das kann mein Bruder besser."], "Die Rückmeldung ist freundlich und genau."],
];

const GOALS_FOR_HINT: Item[] = [
	["Anregung: Die Mitte deiner Geschichte ist etwas langweilig.", "mehr Spannung beim Ereignis", ["mehr Fragewörter in der Überschrift", "schönere Schrift am Rand"], "Ziel und Anregung gehören zusammen."],
	["Anregung: Ich weiß nicht, wann das passiert ist.", "die W-Frage „Wann?“ beantworten", ["mehr wörtliche Rede einbauen", "lustigere Wörter benutzen"], "Es fehlt die Zeitangabe."],
	["Anregung: Fünf Sätze hintereinander beginnen mit „Dann“.", "abwechslungsreiche Satzanfänge", ["einen längeren Titel", "mehr Zahlen"], "Die Umstellprobe hilft dir dabei."],
	["Anregung: In deinem Bericht steht viel über dein Gefühl.", "sachlicher schreiben", ["noch mehr Ausrufezeichen", "einen spannenderen Schluss"], "Ein Bericht braucht Tatsachen."],
	["Anregung: Ich verstehe nicht, warum wir dorthin fahren sollen.", "einen klaren Grund nennen", ["den Text kürzer abschreiben", "ein zweites Bild malen"], "Bei einer Meinung fehlt hier der Grund."],
];

const GOAL_CHECK: Item[] = [
	["Dein Ziel: mehr Spannung.", "Ich zeige die Angst und schreibe kurze Sätze.", ["Ich schreibe die Überschrift größer und male ein buntes Bild dazu.", "Ich zähle meine Wörter und schreibe noch zehn weitere Sätze dazu."], "Diese Änderung passt genau zum Ziel."],
	["Dein Ziel: ein vollständiger Bericht.", "Ich prüfe die W-Fragen und ergänze, was fehlt.", ["Ich füge einen erfundenen Drachen hinzu, damit es spannender wird.", "Ich male ein Bild an den Rand und schreibe meine Meinung dazu."], "Die W-Fragen zeigen, ob etwas fehlt."],
	["Dein Ziel: eine genaue Beschreibung.", "Ich ergänze Farbe und Größe des Rucksacks.", ["Ich schreibe, wie sehr ich den Rucksack mag und wie toll er ist.", "Ich schreibe den ganzen Text noch einmal ordentlich und klein ab."], "Farbe und Größe machen die Beschreibung genauer."],
	["Dein Ziel: abwechslungsreiche Satzanfänge.", "Ich stelle Satzglieder um: Sofort rannte ich los.", ["Ich setze am Anfang von jedem Satz noch ein „und dann“ ein.", "Ich streiche alle Verben, damit die Sätze schön kurz werden."], "Die Umstellprobe bringt Abwechslung."],
	["Dein Ziel: dass dein Text überzeugt.", "Ich ergänze einen Grund und ein Beispiel.", ["Ich schreibe den ganzen Text in großen Buchstaben mit Ausrufezeichen.", "Ich drohe den anderen, dass ich sonst nicht mehr mitkomme."], "Gründe und Beispiele überzeugen."],
];

const LAYOUTS: Item[] = [
	["ein Sachtext über Igel für die Klassenzeitung", "Überschrift, Absätze und ein Bild vom Igel", ["nur Großbuchstaben, ohne Absätze und ohne Überschrift", "bunte Sterne über jedem einzelnen Wort und keine Absätze"], "Überschrift, Absätze und ein passendes Bild helfen beim Lesen."],
	["eine Einladung zum Klassenfest", "große Überschrift, darunter Tag, Uhrzeit und Ort", ["ein langer Text ohne Absätze, die Uhrzeit irgendwo mittendrin", "Tag und Ort in ganz kleiner Schrift auf der Rückseite"], "Die wichtigen Angaben sollen sofort auffallen."],
	["eine Anleitung für einen Versuch", "Liste mit nummerierten Schritten", ["alle Schritte in einem einzigen langen Satz hintereinander", "ein langes Gedicht über den Versuch, schön verziert"], "Nummern zeigen die Reihenfolge."],
	["eine Geschichte für das Klassenbuch", "Absätze für Anfang, Ereignis und Schluss", ["eine Tabelle mit allen Figuren anstelle des ganzen Textes", "keine Überschrift, keine Absätze, alles in einem Block"], "Absätze zeigen, wo ein neuer Teil beginnt."],
	["ein Plakat über deinen Vorschlag für den Wandertag", "große, kurze Sätze und ein Foto vom Ziel", ["sehr kleine Schrift bis ganz an den Rand des großen Plakats", "der ganze lange Text aus deinem Heft, ohne Überschrift"], "Ein Plakat liest man im Vorbeigehen. Es muss von Weitem wirken."],
];

const GOAL_WORDS: TypedItem[] = [
	["Mach die Mitte spannender.", ["spannender"], "Das Ziel ist: mehr Spannung."],
	["Beschreibe den Rucksack genauer.", ["genauer"], "Das Ziel ist: mehr Genauigkeit."],
	["Schreibe den Bericht sachlicher.", ["sachlicher"], "Das Ziel ist: weniger Meinung."],
	["Erzähle den Schluss kürzer.", ["kürzer"], "Das Ziel ist: ein kürzerer Schluss."],
	["Gestalte die Überschrift größer.", ["größer"], "Das Ziel ist: Die Überschrift soll auffallen."],
	["Schreibe den Anfang lebendiger.", ["lebendiger"], "Das Ziel ist: ein lebendiger Anfang."],
];

const ueberarbeiten: Lesson = {
	id: "texte-ueberarbeiten",
	stage: "schreibwerkstatt",
	title: "Texte überarbeiten und gestalten",
	skill: "Du gibst hilfreiche Rückmeldungen, setzt dir ein Überarbeitungsziel und gestaltest deinen fertigen Text passend.",
	lehrplan: "D3/4 3.3: Rückmeldungen geben und aufnehmen, Überarbeitungsziel, eigener Rechtschreibdurchgang, Text gestalten",
	bindings: ["3.3-01", "3.3-02", "3.3-03", "3.3-04"],
	sticker: { emoji: "🪄", name: "Textverbesserer" },
	paragraphs: [
		"Kein guter Text ist beim ersten Mal fertig. Eine Rückmeldung hilft dir weiter. Wenn du selbst eine gibst, beginne mit etwas, das gelungen ist. Danach nennst du einen konkreten Hinweis: nicht „Das ist schlecht“, sondern „In der Mitte kannst du mehr von Finns Angst zeigen“.",
		"Hast du eine Rückmeldung bekommen, wähle das Wichtigste aus und setze dir ein konkretes Ziel, zum Beispiel: Ich mache die Mitte spannender. Dann änderst du nur das. Die Rechtschreibung prüfst du in einem eigenen Durchgang, wie beim Fehlerdetektiv.",
		"Zum Schluss gestaltest du den Text so, wie es zu ihm passt: mit Überschrift und Absätzen, bei einer Anleitung mit Nummern, bei einem Plakat mit großer Schrift. Auch ein Computer oder ein Bild kann helfen.",
	],
	example: {
		title: "Tinto überarbeitet",
		lines: [
			"Rückmeldung: Dein Anfang ist spannend. Die Mitte geht mir zu schnell.",
			"Mein Ziel: Ich mache die Mitte spannender.",
			"Änderung: Statt „Ich hatte Angst“ schreibe ich „Meine Knie zitterten“.",
			"Gestaltung: Überschrift, drei Absätze und ein Bild.",
		],
	},
	takeaway: "Erst loben, dann einen konkreten Hinweis geben. Ein Ziel pro Überarbeitung. Zum Schluss den Text passend gestalten.",
	terms: [
		{ term: "Rückmeldung", meaning: "was jemand zu deinem Text sagt: Gelungenes und Anregungen" },
		{ term: "Überarbeitungsziel", meaning: "das, was du in deinem Text gezielt verbesserst" },
		{ term: "Absatz", meaning: "ein Textstück zu einem Teil oder Thema, mit neuer Zeile" },
	],
	check: {
		wrong: "mit deiner Note für den Text",
		explanation: "Wer zuerst hört, was gelungen ist, nimmt den nächsten Hinweis leichter an.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Der Rückmeldungs-Check",
			intro: "Tinto liest Rückmeldungen. Wähle einen Stift. Was nennt eine Stärke, was ist eine konkrete Anregung? Was weder hilft noch etwas sagt, bleibt ohne Farbe.",
			pens: [
				{ value: "S", label: "Stärke", colour: "green" },
				{ value: "A", label: "Anregung", colour: "blue" },
			],
			puzzles: [
				marks("geschichte", "Dein_Anfang_macht_neugierig.|S Zeig_in_der_Mitte_mehr_von_Finns_Angst.|A Das_ist_alles_doof.", "Zu einer Geschichte", "Eine Anregung sagt, was man konkret tun kann."),
				marks("bericht", "Das_finde_ich_nicht_so_toll.  Schreibe_noch,_wann_es_passiert_ist.|A Du_nennst_den_Ort_ganz_genau.|S", "Zu einem Bericht", "Hier steht die Stärke am Schluss."),
				marks("anleitung", "Schreibe_für_jeden_Schritt_eine_neue_Zeile.|A Mach_es_halt_besser.  Die_Reihenfolge_stimmt_genau.|S", "Zu einer Anleitung", "„Mach es besser“ sagt nicht, wie."),
			],
		},
		["Prüfe die Rückmeldung zur Geschichte.", "Prüfe die Rückmeldung zum Bericht.", "Prüfe die Rückmeldung zur Anleitung."],
	),
	desk: {
		task: "Nimm einen deiner Texte vom Schreibtisch oder aus dem Heft. Setze dir ein Ziel und schreibe die Stelle hier neu. Bitte auch jemanden um eine Rückmeldung.",
		checklist: ["Ich habe mir genau ein Ziel gesetzt.", "Meine Änderung passt zu diesem Ziel.", "Ich habe die Rechtschreibung extra geprüft.", "Mein Text hat eine Überschrift und Absätze."],
	},
	generators: {
		1: [
			(rng) => sort(rng, "Welche Rückmeldung hilft am meisten?", FEEDBACK, "Sagt sie, was gelungen ist? Kann man den Hinweis sofort umsetzen?", "rueckmeldung"),
			(rng) => sort(rng, "Welches Überarbeitungsziel setzt du dir?", GOALS_FOR_HINT, "Was wünscht sich die Anregung? Wähle genau das als Ziel.", "ziel"),
		],
		2: [
			(rng) => sort(rng, "Welche Änderung bringt dich deinem Ziel näher?", GOAL_CHECK, "Prüfe: Verändert das wirklich das, was du verbessern willst?", "aenderung"),
			(rng) => sort(rng, "Wie gestaltest du diesen Text passend?", LAYOUTS, "Wozu ist der Text da? Wer liest ihn und wie?", "gestalten"),
			(rng) => typed(rng, "Diese Anregung nennt dein Überarbeitungsziel. Schreibe das Wort heraus, das sagt, was besser werden soll.", GOAL_WORDS, "Das gesuchte Wort sagt, wie der Text werden soll.", "zielwort"),
		],
	},
	requiredCorrect: 3,
};

export const SCHREIBWERKSTATT: Lesson[] = [ideen, aufbauen, lebendig, beschreiben, berichten, begruenden, verstehen, ueberarbeiten];
