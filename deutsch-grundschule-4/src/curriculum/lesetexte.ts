// Eigene Lesetexte der Lesewerkstatt, keine Auszüge aus Büchern. Fragen mit
// `literal` stehen wörtlich im Text (Stufe 1), `deeper` verlangen mitzudenken
// (Stufe 2). `extract` lässt ein Wort aus dem Text heraussuchen.

export interface Question {
	q: string;
	a: string;
	wrong: [string, string];
	why: string;
}

export interface Extract {
	q: string;
	a: string;
	why: string;
}

export interface Passage {
	id: string;
	title: string;
	paragraphs: string[];
	literal: Question[];
	deeper: Question[];
	extract: Extract[];
}

export interface DataTable {
	id: string;
	title: string;
	head: string[];
	rows: string[][];
	literal: Question[];
	deeper: Question[];
}

/* ---------- Sachtexte ---------- */

export const FACT_TEXTS: Passage[] = [
	{
		id: "igel",
		title: "Der Igel",
		paragraphs: [
			"Der Igel ist nachtaktiv. Am Tag schläft er in einem Versteck aus Laub. Erst in der Dämmerung geht er auf Nahrungssuche.",
			"Igel fressen vor allem Käfer, Raupen, Würmer und Schnecken. Darum sehen viele Menschen sie gern im Garten.",
			"Droht Gefahr, rollt sich der Igel zu einer Kugel zusammen. Seine Stacheln schützen ihn dann.",
			"Im Herbst frisst er sich ein Fettpolster an. Etwa von November bis März hält er Winterschlaf.",
		],
		literal: [
			{ q: "Wann geht der Igel auf Nahrungssuche?", a: "in der Dämmerung", wrong: ["am Mittag", "am frühen Morgen"], why: "Im ersten Absatz steht: Erst in der Dämmerung geht er auf Nahrungssuche." },
			{ q: "Was tut der Igel, wenn Gefahr droht?", a: "Er rollt sich zu einer Kugel zusammen.", wrong: ["Er läuft schnell davon.", "Er gräbt sich in die Erde ein."], why: "Das steht im dritten Absatz." },
			{ q: "Wann hält der Igel Winterschlaf?", a: "etwa von November bis März", wrong: ["etwa von März bis November", "etwa von Juni bis August"], why: "Das steht im letzten Absatz." },
		],
		deeper: [
			{ q: "Warum sehen viele Menschen den Igel gern im Garten?", a: "Er frisst Tiere wie Schnecken und Raupen, die an Pflanzen nagen.", wrong: ["Er schläft den ganzen Tag im Laub.", "Er rollt sich bei Gefahr zusammen."], why: "Der Text nennt seine Nahrung direkt davor. Dass Schnecken und Raupen an Pflanzen nagen, weißt du aus dem Garten." },
			{ q: "Warum frisst der Igel im Herbst besonders viel?", a: "Im Winterschlaf lebt er von seinem Fettpolster.", wrong: ["Im Herbst gibt es die meisten Käfer.", "Er will seine Stacheln wachsen lassen."], why: "Das Fettpolster und der Winterschlaf stehen im selben Absatz. Beides gehört zusammen." },
			{ q: "Warum siehst du tagsüber kaum einen Igel?", a: "Er schläft dann in seinem Versteck.", wrong: ["Er sucht dann im Wald nach Futter.", "Er rollt sich dann zur Kugel zusammen."], why: "Er ist nachtaktiv und schläft am Tag." },
		],
		extract: [
			{ q: "Schreibe aus dem Text heraus: Woraus ist das Versteck des Igels?", a: "Laub", why: "Im Text steht: in einem Versteck aus Laub." },
			{ q: "Schreibe aus dem Text heraus: Was schützt den Igel, wenn er eine Kugel ist?", a: "Stacheln", why: "Im Text steht: Seine Stacheln schützen ihn dann." },
		],
	},
	{
		id: "wasser",
		title: "Der Weg des Wassers",
		paragraphs: [
			"Die Sonne erwärmt das Wasser in Meeren, Seen und Flüssen. Dabei verdunstet ein Teil des Wassers. Es steigt als unsichtbarer Wasserdampf in die Luft.",
			"Weiter oben ist die Luft kälter. Dort kühlt der Wasserdampf ab und bildet winzige Tröpfchen. Viele Tröpfchen zusammen sehen wir als Wolke.",
			"Werden die Tropfen zu schwer, fallen sie als Regen oder Schnee auf die Erde. Das Wasser fließt in Bäche und Flüsse und am Ende wieder ins Meer. Dann beginnt alles von vorn.",
		],
		literal: [
			{ q: "Was erwärmt das Wasser?", a: "die Sonne", wrong: ["der Wind", "der Regen"], why: "Das steht im ersten Satz." },
			{ q: "Woraus besteht eine Wolke?", a: "aus vielen winzigen Tröpfchen", wrong: ["aus unsichtbarem Rauch", "aus großen Eisblöcken"], why: "Im zweiten Absatz steht: Viele Tröpfchen zusammen sehen wir als Wolke." },
			{ q: "Wann fällt Regen oder Schnee?", a: "wenn die Tropfen zu schwer werden", wrong: ["wenn die Sonne scheint", "wenn das Wasser verdunstet"], why: "Das steht am Anfang des letzten Absatzes." },
		],
		deeper: [
			{ q: "Warum nennt man diesen Weg einen Kreislauf?", a: "Am Ende beginnt alles wieder von vorn.", wrong: ["Das Wasser fließt immer im Kreis um einen See.", "Die Wolken ziehen im Kreis um die Erde."], why: "Ein Kreislauf hat kein Ende: Der letzte Schritt führt wieder zum ersten." },
			{ q: "Was passiert direkt, nachdem das Wasser verdunstet ist?", a: "Es steigt als Wasserdampf in die Luft.", wrong: ["Es fällt als Regen auf die Erde.", "Es fließt in die Bäche."], why: "Die Reihenfolge lautet: verdunsten, aufsteigen, abkühlen, Wolke, Regen." },
			{ q: "Warum siehst du Wasserdampf am Himmel nicht, eine Wolke aber schon?", a: "Der Dampf ist unsichtbar, die Tröpfchen der Wolke sieht man.", wrong: ["Der Dampf ist zu weit weg, die Wolke ist näher.", "Wolken gibt es nur am Tag, Dampf nur nachts."], why: "Der Text nennt den Dampf unsichtbar. Erst die Tröpfchen sehen wir als Wolke." },
		],
		extract: [
			{ q: "Schreibe aus dem Text heraus: Was tut ein Teil des Wassers, wenn die Sonne es erwärmt?", a: "verdunstet", why: "Im Text steht: Dabei verdunstet ein Teil des Wassers." },
			{ q: "Schreibe aus dem Text heraus: Wohin fließt das Wasser am Ende?", a: "Meer", why: "Im Text steht: am Ende wieder ins Meer." },
		],
	},
	{
		id: "bienen",
		title: "Ein Bienenvolk",
		paragraphs: [
			"In einem Bienenstock leben viele tausend Bienen. Die meisten sind Arbeiterinnen. Nur eine Biene legt die Eier: die Königin.",
			"Die Arbeiterinnen fliegen zu den Blüten und sammeln Nektar und Pollen. Aus dem Nektar entsteht im Stock der Honig.",
			"Hat eine Biene viele Blüten gefunden, tanzt sie im Stock. So zeigt sie den anderen, wo das Futter liegt.",
		],
		literal: [
			{ q: "Welche Biene legt die Eier?", a: "die Königin", wrong: ["jede Arbeiterin", "die älteste Arbeiterin"], why: "Im ersten Absatz steht: Nur eine Biene legt die Eier: die Königin." },
			{ q: "Woraus entsteht der Honig?", a: "aus dem Nektar", wrong: ["aus den Blütenblättern", "aus dem Wachs"], why: "Das steht im zweiten Absatz." },
			{ q: "Wie zeigt eine Biene den anderen, wo Futter liegt?", a: "Sie tanzt im Stock.", wrong: ["Sie summt besonders laut.", "Sie bringt eine Blüte mit."], why: "Das steht im letzten Absatz." },
		],
		deeper: [
			{ q: "Warum ist der Tanz für das ganze Bienenvolk nützlich?", a: "Viele Bienen finden so schnell dieselben Blüten.", wrong: ["Die Königin kann dann mehr Eier legen.", "Im Stock wird es durch den Tanz wärmer."], why: "Der Tanz verrät den Ort des Futters. Das spart den anderen die Suche." },
			{ q: "Welche Überschrift passt am besten zum zweiten Absatz?", a: "Die Arbeit der Arbeiterinnen", wrong: ["Der Tanz der Bienen", "Die Königin im Stock"], why: "Der Absatz erzählt, was die Arbeiterinnen tun." },
			{ q: "Was wäre neu für jemanden, der nur weiß, dass Bienen Honig machen?", a: "Eine einzige Biene legt alle Eier des Volkes.", wrong: ["Bienen fliegen zu Blüten.", "Honig schmeckt süß."], why: "Eine neue Information ist etwas, das du vorher noch nicht wusstest." },
		],
		extract: [
			{ q: "Schreibe aus dem Text heraus: Wie heißen die Bienen, die Nektar sammeln?", a: "Arbeiterinnen", why: "Im Text steht: Die Arbeiterinnen fliegen zu den Blüten." },
			{ q: "Schreibe aus dem Text heraus: Was sammeln die Bienen außer Nektar?", a: "Pollen", why: "Im Text steht: sammeln Nektar und Pollen." },
		],
	},
	{
		id: "zugspitze",
		title: "Die Zugspitze",
		paragraphs: [
			"Die Zugspitze ist mit 2962 Metern der höchste Berg Deutschlands. Sie liegt in Bayern, direkt an der Grenze zu Österreich.",
			"Auf den Gipfel führen Wanderwege und Bergbahnen. Geübte Bergsteiger brauchen zu Fuß meist mehr als einen Tag.",
			"Oben ist es viel kälter als im Tal. Darum packst du auch im Sommer eine warme Jacke ein.",
		],
		literal: [
			{ q: "Wie hoch ist die Zugspitze?", a: "2962 Meter", wrong: ["2692 Meter", "962 Meter"], why: "Das steht im ersten Satz." },
			{ q: "An welches Land grenzt die Zugspitze?", a: "an Österreich", wrong: ["an die Schweiz", "an Italien"], why: "Das steht im ersten Absatz." },
		],
		deeper: [
			{ q: "Wie kommt eine Familie mit kleinen Kindern am ehesten auf den Gipfel?", a: "mit einer Bergbahn", wrong: ["zu Fuß an einem Vormittag", "mit dem Fahrrad"], why: "Zu Fuß brauchen sogar Geübte meist mehr als einen Tag." },
			{ q: "Warum steht im Text etwas über eine warme Jacke?", a: "Es ist oben auch im Sommer kalt.", wrong: ["Im Tal schneit es im Sommer.", "Bergbahnen sind nicht geheizt."], why: "Der Satz davor nennt den Grund: Oben ist es viel kälter als im Tal." },
		],
		extract: [
			{ q: "Schreibe aus dem Text heraus: In welchem Bundesland liegt die Zugspitze?", a: "Bayern", why: "Im Text steht: Sie liegt in Bayern." },
		],
	},
];

/* ---------- Tabellen und Diagramme (erfundene Werte) ---------- */

export const TABLES: DataTable[] = [
	{
		id: "wetter",
		title: "Wetterstation der Klasse 4b",
		head: ["Tag", "Temperatur mittags", "Regen"],
		rows: [
			["Montag", "12 °C", "0 mm"],
			["Dienstag", "15 °C", "2 mm"],
			["Mittwoch", "18 °C", "0 mm"],
			["Donnerstag", "14 °C", "6 mm"],
			["Freitag", "9 °C", "4 mm"],
		],
		literal: [
			{ q: "Wie warm war es am Dienstag mittags?", a: "15 °C", wrong: ["12 °C", "18 °C"], why: "Suche die Zeile Dienstag und die Spalte Temperatur." },
			{ q: "An welchem Tag fielen 6 mm Regen?", a: "am Donnerstag", wrong: ["am Dienstag", "am Freitag"], why: "Suche in der Spalte Regen die 6 mm." },
		],
		deeper: [
			{ q: "An welchem Tag war es mittags am wärmsten und trocken?", a: "am Mittwoch", wrong: ["am Montag", "am Dienstag"], why: "Mittwoch hat die höchste Temperatur und 0 mm Regen." },
			{ q: "An welchem Tag war es am kältesten?", a: "am Freitag", wrong: ["am Montag", "am Donnerstag"], why: "9 °C ist der kleinste Wert in der Spalte Temperatur." },
			{ q: "Wie viel Regen fiel in der ganzen Woche zusammen?", a: "12 mm", wrong: ["6 mm", "10 mm"], why: "2 + 6 + 4 = 12. Montag und Mittwoch blieben trocken." },
		],
	},
	{
		id: "lesen",
		title: "Gelesene Bücher im Oktober",
		head: ["Kind", "Bücher", "Balken"],
		rows: [
			["Lea", "6", "■■■■■■"],
			["Tim", "4", "■■■■"],
			["Mia", "9", "■■■■■■■■■"],
			["Ben", "5", "■■■■■"],
		],
		literal: [
			{ q: "Wie viele Bücher hat Tim im Oktober gelesen?", a: "4", wrong: ["5", "6"], why: "In der Zeile Tim steht 4." },
			{ q: "Wer hat 5 Bücher gelesen?", a: "Ben", wrong: ["Lea", "Tim"], why: "Suche in der Spalte Bücher die 5." },
		],
		deeper: [
			{ q: "Wer hat die meisten Bücher gelesen?", a: "Mia", wrong: ["Lea", "Ben"], why: "Mia hat den längsten Balken: 9 Bücher." },
			{ q: "Wie viele Bücher hat Mia mehr gelesen als Tim?", a: "5", wrong: ["4", "13"], why: "9 − 4 = 5." },
			{ q: "Wie viele Bücher haben die vier Kinder zusammen gelesen?", a: "24", wrong: ["20", "9"], why: "6 + 4 + 9 + 5 = 24." },
		],
	},
];

/* ---------- Erzähltexte ---------- */

export const STORIES: Passage[] = [
	{
		id: "brunnen",
		title: "Der Schlüssel im Brunnen",
		paragraphs: [
			"Mia besuchte in den Ferien ihre Oma auf dem Land. Hinter dem Haus stand ein alter Brunnen, abgedeckt mit einem Gitter. Als Mia durch das Gitter schaute, blitzte tief unten etwas.",
			"Sie holte Oma und einen langen Stock mit einem Haken. Nach vielen Versuchen hielten die beiden einen rostigen Schlüssel in der Hand.",
			"Oma staunte. „Den suche ich seit zwanzig Jahren! Er gehört zur Truhe auf dem Dachboden.“ Gemeinsam stiegen sie die Treppe hinauf. In der Truhe lagen alte Fotos von Oma als Kind. Mia lachte: „Du hattest ja die gleiche Zahnlücke wie ich!“",
		],
		literal: [
			{ q: "Wo steht der Brunnen?", a: "hinter Omas Haus", wrong: ["auf dem Dachboden", "mitten im Dorf"], why: "Im ersten Absatz steht: Hinter dem Haus stand ein alter Brunnen." },
			{ q: "Was finden die beiden im Brunnen?", a: "einen rostigen Schlüssel", wrong: ["eine alte Truhe", "ein altes Foto"], why: "Das steht im zweiten Absatz." },
			{ q: "Was liegt in der Truhe?", a: "alte Fotos von Oma", wrong: ["ein zweiter Schlüssel", "Mias Zahn"], why: "Das steht im letzten Absatz." },
		],
		deeper: [
			{ q: "Welches Ereignis bringt die Geschichte in Gang?", a: "Mia sieht etwas im Brunnen blitzen.", wrong: ["Mia lacht über die Zahnlücke.", "Oma steigt die Treppe hinauf."], why: "Ohne das Blitzen gäbe es keine Suche und keinen Schlüssel." },
			{ q: "Warum staunt Oma?", a: "Sie hat den Schlüssel schon lange gesucht.", wrong: ["Sie wusste nicht, dass es einen Brunnen gibt.", "Sie hat Mia noch nie gesehen."], why: "Oma sagt: Den suche ich seit zwanzig Jahren." },
			{ q: "Welche Bedeutung hat der Brunnen für die Geschichte?", a: "In ihm liegt das Geheimnis, das alles auslöst.", wrong: ["Mia holt dort Wasser für die Blumen.", "Er zeigt nur, dass Oma auf dem Land wohnt."], why: "Ohne den Brunnen gäbe es den Fund nicht. Orte können für die Handlung wichtig sein." },
		],
		extract: [
			{ q: "Schreibe aus dem Text heraus: Wo steht die Truhe?", a: "Dachboden", why: "Im Text steht: zur Truhe auf dem Dachboden." },
			{ q: "Schreibe aus dem Text heraus: Wer besucht die Oma? Schreibe nur den Namen.", a: "Mia", why: "Der erste Satz nennt ihren Namen." },
		],
	},
	{
		id: "drachen",
		title: "Der neue Junge",
		paragraphs: [
			"Ben war neu in der Klasse. In den Pausen stand er allein am Zaun und sagte kaum ein Wort.",
			"Am Freitag blieb Tims Drachen hoch in der Kastanie hängen. Die anderen riefen durcheinander, doch keiner wusste Rat. Ben band einen Tennisball an eine lange Schnur und warf ihn über den Ast. Mit einem Ruck kam der Drachen frei.",
			"„Das hast du super gemacht!“, rief Tim. „Bauen wir am Samstag zusammen einen neuen?“ Ben wurde rot und nickte. Zum ersten Mal lächelte er.",
		],
		literal: [
			{ q: "Wo steht Ben in den Pausen?", a: "allein am Zaun", wrong: ["unter der Kastanie", "bei Tim"], why: "Das steht im ersten Absatz." },
			{ q: "Wem gehört der Drachen?", a: "Tim", wrong: ["Ben", "der ganzen Klasse"], why: "Im Text steht: Tims Drachen." },
			{ q: "Wie holt Ben den Drachen herunter?", a: "mit einem Tennisball an einer Schnur", wrong: ["mit einer langen Leiter", "mit einem Stock"], why: "Das steht im zweiten Absatz." },
		],
		deeper: [
			{ q: "Wie fühlt sich Ben wohl am Anfang der Geschichte?", a: "einsam und unsicher", wrong: ["wütend auf Tim", "stolz auf seinen Drachen"], why: "Er steht allein am Zaun und sagt kaum ein Wort." },
			{ q: "Was zeigt, dass sich etwas für Ben verändert?", a: "Er lächelt zum ersten Mal.", wrong: ["Er steht am Zaun.", "Der Drachen hängt im Baum."], why: "Das Lächeln am Schluss steht im Gegensatz zum Anfang." },
			{ q: "Was könnte Ben am Abend zu seiner Mutter sagen?", a: "„Heute habe ich vielleicht einen Freund gefunden.“", wrong: ["„Tim hat mir meinen Drachen weggenommen.“", "„In der Schule rede ich mit niemandem mehr.“"], why: "Du versetzt dich in Ben: Tim lädt ihn ein, und Ben freut sich." },
		],
		extract: [
			{ q: "Schreibe aus dem Text heraus: In welchem Baum hängt der Drachen?", a: "Kastanie", why: "Im Text steht: hoch in der Kastanie." },
			{ q: "Schreibe aus dem Text heraus: An welchem Tag wollen die Jungen einen neuen Drachen bauen?", a: "Samstag", why: "Tim sagt: Bauen wir am Samstag zusammen einen neuen?" },
		],
	},
	{
		id: "fabel",
		title: "Die Schnecke und die Schwalbe",
		paragraphs: [
			"Eine Schwalbe lachte über eine Schnecke: „Du bist so langsam! Bis du am Bach bist, ist der Sommer vorbei.“ Die Schnecke kroch weiter und sagte nichts.",
			"Am Abend zog ein Sturm auf. Die Schwalbe fand keinen trockenen Platz und wurde nass bis auf die letzte Feder. Die Schnecke zog sich in ihr Haus zurück und blieb trocken.",
			"„Schnell zu sein ist schön“, sagte die Schnecke am nächsten Morgen. „Aber jeder hat etwas, das ihm hilft.“",
		],
		literal: [
			{ q: "Worüber lacht die Schwalbe?", a: "darüber, dass die Schnecke so langsam ist", wrong: ["über das Haus der Schnecke", "über den Sturm"], why: "Das sagt die Schwalbe im ersten Satz." },
			{ q: "Wo bleibt die Schnecke beim Sturm?", a: "in ihrem Haus", wrong: ["am Bach", "unter einem Blatt"], why: "Das steht im zweiten Absatz." },
		],
		deeper: [
			{ q: "Welche Lehre hat diese Fabel?", a: "Niemand sollte andere auslachen, denn jeder hat eigene Stärken.", wrong: ["Wer schnell ist, gewinnt immer.", "Bei Sturm bleibt man besser am Bach."], why: "Fabeln wollen eine Lehre vermitteln. Hier sagt es die Schnecke am Schluss." },
			{ q: "Woran erkennst du, dass dieser Text eine Fabel ist?", a: "Tiere sprechen wie Menschen, und am Ende steht eine Lehre.", wrong: ["Er beginnt mit „Es war einmal“.", "Er erklärt, wie Schnecken leben."], why: "Sprechende Tiere und eine Lehre sind typisch für Fabeln." },
		],
		extract: [
			{ q: "Schreibe aus dem Text heraus: Welches Wetter kommt am Abend auf?", a: "Sturm", why: "Im Text steht: Am Abend zog ein Sturm auf." },
		],
	},
];

/* ---------- Gedichte ---------- */

export const POEMS: Passage[] = [
	{
		id: "regentag",
		title: "Regentag",
		paragraphs: [
			"Der Regen tropft aufs Fensterbrett,",
			"die Katze liegt im warmen Bett.",
			"Ich hol mein Buch und les mich ein,",
			"so kann ein Regentag auch sein.",
		],
		literal: [
			{ q: "Wo liegt die Katze?", a: "im warmen Bett", wrong: ["auf dem Fensterbrett", "im Regen"], why: "Das steht in der zweiten Zeile." },
		],
		deeper: [
			{ q: "Welche Stimmung passt am besten zu diesem Gedicht?", a: "gemütlich", wrong: ["traurig", "gefährlich"], why: "Warmes Bett, Katze und Buch: Der Regen stört hier niemanden." },
		],
		extract: [
			{ q: "Schreibe aus dem Gedicht heraus: Welches Wort reimt sich auf „Fensterbrett“?", a: "Bett", why: "Fensterbrett und Bett klingen am Ende gleich." },
			{ q: "Schreibe aus dem Gedicht heraus: Welches Wort reimt sich auf „ein“?", a: "sein", why: "ein und sein klingen am Ende gleich." },
		],
	},
	{
		id: "schneemann",
		title: "Der Schneemann",
		paragraphs: [
			"Der Schneemann steht im Garten still,",
			"weil er die Sonne gar nicht will.",
			"Scheint sie ihm warm auf seinen Bauch,",
			"dann schmilzt ihm seine Nase auch.",
		],
		literal: [
			{ q: "Wo steht der Schneemann?", a: "im Garten", wrong: ["auf dem Dach", "im Haus"], why: "Das steht in der ersten Zeile." },
		],
		deeper: [
			{ q: "Warum will der Schneemann die Sonne nicht?", a: "Von ihrer Wärme schmilzt er.", wrong: ["Sie blendet ihn in den Augen.", "Er mag lieber den Regen."], why: "Die letzten beiden Zeilen nennen den Grund." },
		],
		extract: [
			{ q: "Schreibe aus dem Gedicht heraus: Welches Wort reimt sich auf „still“?", a: "will", why: "still und will klingen am Ende gleich." },
			{ q: "Schreibe aus dem Gedicht heraus: Welches Wort reimt sich auf „Bauch“?", a: "auch", why: "Bauch und auch klingen am Ende gleich." },
		],
	},
];
