// Station 7 · Sprachlabor: Sprachgebrauch untersuchen (LehrplanPLUS Deutsch 3/4,
// 4.1 und 4.2). Beispielwörter aus anderen Sprachen sind Einzelbeispiele; Gespräche
// mit Menschen, die diese Sprachen sprechen, bleiben Praxis außerhalb der App.
import type { Lesson, MachineView, MachineWorkshop } from "../types";
import { marks, slotWorkshop } from "./helpers";
import { type Item, sort } from "./lesewerkstatt";

/* ---------- 1 Sprache wirkt ---------- */

const DEVICES: Item[] = [
	["Probier ihn heute noch!", "direkte Anrede", ["Übertreibung", "Reim"], "Der Satz spricht dich direkt an."],
	["Hol dir jetzt dein neues Rad!", "direkte Anrede", ["Reim", "Übertreibung"], "„Hol dir“ meint dich persönlich."],
	["Die beste Schokolade der ganzen Welt!", "Übertreibung", ["direkte Anrede", "Reim"], "Das behauptet die Werbung. Beweisen kann sie es nicht."],
	["Mit diesem Schuh fliegst du schneller als der Wind!", "Übertreibung", ["Reim", "direkte Anrede"], "Kein Schuh macht schneller als der Wind."],
	["Saft mit Kraft!", "Reim", ["Übertreibung", "direkte Anrede"], "Saft und Kraft klingen ähnlich. Das merkt man sich leicht."],
	["Bleibt froh mit Haferstroh!", "Reim", ["direkte Anrede", "Übertreibung"], "Froh und Stroh reimen sich. So bleibt der Spruch im Kopf."],
];

const INTENTIONS: Item[] = [
	["Nur heute: Zwei Spiele zum Preis von einem!", "dass du etwas kaufst", ["dass du lachst", "dass du spendest"], "Das ist Werbung. Der Preis soll dich locken."],
	["Dieser neue Roller macht dich zum Star auf dem Schulhof!", "dass du etwas kaufst", ["dass du dich informierst, wie Roller gebaut sind", "dass du spendest"], "Die Werbung verspricht dir etwas Schönes."],
	["Mika ist sieben und hat bei der Flut sein Zuhause verloren. Hilf ihm mit deiner Spende!", "dass du spendest", ["dass du etwas kaufst", "dass du lachst"], "Der Aufruf erzählt von einem Kind und bittet um Hilfe."],
	["Jeder Euro hilft, dass die Tiere im Tierheim satt werden.", "dass du spendest", ["dass du ein Tier kaufst", "dass du lachst"], "Das ist ein Aufruf zum Helfen."],
	["Treffen sich zwei Kerzen. Fragt die eine: „Ist Wasser gefährlich?“ Sagt die andere: „Davon kannst du ausgehen!“", "dass du lachst", ["dass du etwas kaufst", "dass du spendest"], "Das ist ein Witz: Ausgehen hat hier zwei Bedeutungen."],
	["Hoch oben im Turm flackerte ein Licht. Dann ging die Tür knarrend auf.", "dass du gespannt weiterliest", ["dass du etwas kaufst", "dass du spendest"], "Eine Geschichte will dich fesseln."],
];

const WHY_WORDS: Item[] = [
	["Eine Werbung sagt: „Du hast es dir verdient!“ Warum?", "Du sollst dich persönlich angesprochen und wichtig fühlen.", ["Die Werbung kennt dich genau.", "Der Satz nennt den genauen Preis."], "Die Werbung kennt dich nicht. Das „Du“ soll nur Nähe schaffen."],
	["Ein Spendenaufruf erzählt von einem einzelnen Kind statt von vielen tausend Menschen. Warum?", "Bei einer einzelnen Geschichte fühlst du eher mit.", ["Es gibt nur dieses eine Kind.", "Zahlen sind verboten."], "Ein einzelnes Schicksal berührt uns oft stärker als eine Zahl."],
	["Eine Geschichte schreibt: „Etwas Kaltes berührte meine Hand.“ Warum sagt sie nicht gleich, was es war?", "Du sollst gespannt sein und selbst rätseln.", ["Die Figur kennt keine Wörter.", "Es gibt dafür kein Wort."], "Was noch unklar ist, macht neugierig."],
	["Warum steht in Werbung oft „Nur noch heute!“?", "Du sollst schnell kaufen, ohne lange nachzudenken.", ["Der Laden schließt für immer.", "Morgen gibt es das Ding auf keinen Fall mehr."], "Eile soll dich drängen. Oft gibt es das Angebot später wieder."],
	["Warum klingt „Saft mit Kraft“ besser als „Saft mit Vitaminen“?", "Der Reim bleibt im Kopf und klingt fröhlich.", ["Der Satz ist genauer.", "Das Wort Kraft ist kürzer als Saft."], "Reime kann man sich leicht merken."],
];

const JOKES: Item[] = [
	["„Wie heißt ein Bumerang, der nicht zurückkommt?“ – „Stock.“", "Es ist ein Spiel mit dem Unerwarteten: Ein solcher Bumerang ist einfach nur ein Stück Holz.", ["Bumerangs kommen wirklich nie zurück.", "Das Wort Stock reimt sich auf Bumerang."], "Der Witz nimmt die Frage wörtlich und überrascht dich."],
	["Treffen sich zwei Kerzen. „Ist Wasser gefährlich?“ – „Davon kannst du ausgehen!“", "„Ausgehen“ hat zwei Bedeutungen: annehmen und erlöschen.", ["Kerzen können wirklich sprechen.", "Wasser ist immer gefährlich."], "Der Witz spielt mit den zwei Bedeutungen."],
	["„Warum ist das Mathebuch traurig?“ – „Es hat so viele Probleme.“", "„Probleme“ meint hier zwei Dinge: Sorgen und Rechenaufgaben.", ["Mathebücher sind wirklich traurig.", "Das Buch ist zu dick."], "Der Witz spielt mit der doppelten Bedeutung."],
	["„Herr Doktor, ich fühle mich wie eine Brücke!“ – „Was ist denn über Sie gekommen?“ – „Drei Lkw und ein Bus.“", "„Über Sie gekommen“ meint eigentlich: was mit Ihnen los ist. Hier ist es wörtlich gemeint.", ["Über Menschen fahren oft Lkw.", "Der Arzt macht einen Fehler."], "Eine Redewendung wird wörtlich genommen."],
];

const TRUE_OR_TRICK: Item[] = [
	["Ein Müsli wirbt: „Macht dich zum Superhelden!“", "Das ist übertrieben. Müsli macht niemanden zum Superhelden.", ["Das stimmt, sonst dürfte es nicht auf der Packung stehen.", "Das ist ein Beweis für die gute Qualität."], "Werbung darf übertreiben. Prüfe, was wirklich dahintersteckt."],
	["Ein Handyspiel wirbt: „Alle spielen es!“", "Das soll dich mitreißen. „Alle“ stimmt fast nie.", ["Dann musst du es auch spielen.", "Das ist eine genaue Zahl."], "„Alle“ ist kein Grund. Du darfst selbst entscheiden."],
	["Ein Spendenaufruf zeigt ein trauriges Kind.", "Das soll dich berühren. Du kannst trotzdem prüfen, wer dahintersteht.", ["Dann kann alles nur wahr sein.", "Traurige Bilder gibt es nur in Märchen."], "Gefühle sind nicht falsch. Frage aber Erwachsene, wenn du dir nicht sicher bist."],
	["Ein Saft wirbt: „Jetzt mit neuem Rezept!“", "Das soll neugierig machen. Besser ist der Saft dadurch nicht unbedingt.", ["Neu heißt immer besser.", "Das sagt genau, was anders ist."], "Neu ist nicht automatisch besser."],
];

const wirkt: Lesson = {
	id: "sprache-wirkt",
	stage: "sprachlabor",
	title: "Wie Sprache wirkt",
	skill: "Du erkennst, mit welchen sprachlichen Mitteln Werbung, Spendenaufrufe, Geschichten und Witze wirken wollen.",
	lehrplan: "D3/4 4.1: sprachliche Mittel und ihre Wirkung untersuchen",
	bindings: ["4.1-01"],
	sticker: { emoji: "📣", name: "Werbedurchblicker" },
	paragraphs: [
		"Dass Menschen mit Sprache etwas erreichen wollen, weißt du schon aus der 1. und 2. Klasse. Jetzt schaust du, wie sie das machen. Werbung will, dass du etwas kaufst. Sie spricht dich direkt an („Probier es!“), übertreibt („die beste Schokolade der Welt“) und reimt, damit du dir den Spruch merkst.",
		"Ein Spendenaufruf will, dass du hilfst. Er erzählt oft von einem einzelnen Menschen oder Tier, damit du mitfühlst. Geschichten machen neugierig, weil sie nicht gleich alles verraten. Witze spielen oft mit zwei Bedeutungen eines Wortes.",
		"Wenn du solche Mittel kennst, kannst du selbst entscheiden: Was will mir dieser Text? Stimmt das wirklich?",
	],
	example: {
		title: "Tinto untersucht eine Werbung",
		lines: [
			"Text: Saft mit Kraft! Der beste Saft der Welt. Probier ihn heute!",
			"Reim: Saft und Kraft.",
			"Übertreibung: der beste Saft der Welt.",
			"Direkte Anrede: Probier ihn heute!",
		],
	},
	takeaway: "Frage immer: Was will dieser Text von mir? Anrede, Übertreibung und Reim wollen dich locken, Einzelschicksale berühren dich, Witze spielen mit Bedeutungen.",
	terms: [
		{ term: "Übertreibung", meaning: "etwas wird größer oder besser dargestellt, als es ist" },
		{ term: "direkte Anrede", meaning: "der Text spricht dich an: du, dir, dein" },
		{ term: "Spendenaufruf", meaning: "Text, der um Geld oder Hilfe für andere bittet" },
	],
	check: {
		wrong: "dass du eine Geschichte schreibst",
		explanation: "Werbung will verkaufen. Darum macht sie dir das Ding schmackhaft.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Das Werbe-Labor",
			intro: "Tinto untersucht drei Texte. Wähle einen Stift und markiere jedes Mittel. Was nur informiert, bleibt ohne Farbe.",
			pens: [
				{ value: "A", label: "direkte Anrede", colour: "blue" },
				{ value: "U", label: "Übertreibung", colour: "red" },
				{ value: "R", label: "Reim", colour: "purple" },
			],
			puzzles: [
				marks("saft", "Saft_mit_Kraft!|R Der_beste_Saft_der_Welt.|U Probier_ihn_heute!|A Eine_Flasche_enthält_einen_Liter.", "Werbung für Saft", "Welcher Satz sagt nur eine Tatsache?"),
				marks("schuh", "Hol_dir_die_neuen_Flitzer!|A Schneller_als_jede_Rakete!|U Flitzer_für_Sieger!|R Es_gibt_sie_in_drei_Farben.", "Werbung für Turnschuhe", "Kein Schuh ist schneller als eine Rakete. Flitzer und Sieger klingen ähnlich."),
				marks("fest", "Komm_zu_unserem_Fest!|A Das_größte_Fest_aller_Zeiten!|U Alle_mal_herhören_und_mitfeiern_beim_Bären!|R Es_beginnt_um_15_Uhr.", "Plakat für ein Schulfest", "Herhören und Bären klingen ähnlich. Die Uhrzeit informiert nur."),
			],
		},
		["Untersuche die Werbung für Saft.", "Untersuche die Werbung für Turnschuhe.", "Untersuche das Plakat für das Fest."],
	),
	generators: {
		1: [
			(rng) => sort(rng, "Welches sprachliche Mittel steckt in diesem Satz?", DEVICES, "Spricht dich der Satz an? Ist er viel zu groß gedacht? Oder klingen zwei Wörter gleich?", "mittel"),
			(rng) => sort(rng, "Was will dieser Text bei dir erreichen?", INTENTIONS, "Überlege: Ist das Werbung, ein Spendenaufruf, ein Witz oder eine Geschichte?", "absicht"),
		],
		2: [
			(rng) => sort(rng, "Warum ist das so geschrieben?", WHY_WORDS, "Was soll der Text bei dir bewirken?", "warum"),
			(rng) => sort(rng, "Warum ist dieser Witz lustig?", JOKES, "Hat ein Wort hier zwei Bedeutungen? Oder wird etwas wörtlich genommen?", "witz"),
			(rng) => sort(rng, "Was denkst du am besten über diesen Satz?", TRUE_OR_TRICK, "Glaube nicht alles sofort. Was soll der Satz bewirken? Stimmt er wirklich?", "pruefen"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 2 Verständigung ---------- */

const HELPS: Item[] = [
	["Mia erklärt Ali ein Spiel.", "Sie nennt die Regeln der Reihe nach.", ["Sie redet durcheinander und ganz schnell.", "Sie schaut dabei aus dem Fenster."], "Geordnete Informationen kann man leicht verstehen."],
	["Ben erzählt der Klasse von seinem Hund.", "Er schaut die anderen an und zeigt, wie groß der Hund ist.", ["Er spricht leise in sein Heft.", "Er dreht allen den Rücken zu."], "Blick und Gesten halten die Aufmerksamkeit."],
	["Lea sagt Ali, dass er zu laut ist.", "„Kannst du bitte leiser sein? Ich kann mich sonst nicht konzentrieren.“", ["„Halt endlich den Mund!“", "„Du nervst immer alle.“"], "Sie sagt freundlich, was sie braucht."],
	["Tom beschreibt den Weg zum Treffpunkt.", "Er sagt, wo, wann und wie man hinkommt.", ["Er sagt nur: Du findest das schon.", "Er nennt nur die Uhrzeit."], "Vollständige Informationen verhindern Missverständnisse."],
	["Nina hört ihrer Freundin zu.", "Sie schaut sie an, nickt und fragt nach.", ["Sie schaut nebenbei auf ihr Handy.", "Sie redet gleich dazwischen."], "So merkt die Freundin, dass Nina zuhört."],
];

const CAUSE_EFFECT: Item[] = [
	["Ali schaut beim Vortrag die Klasse an und spricht deutlich.", "Die anderen hören aufmerksam zu.", ["Keiner weiß, worum es geht.", "Alle ärgern sich."], "Blick und Deutlichkeit wecken Aufmerksamkeit."],
	["Mia stellt ihrem Vortrag eine spannende Frage voran.", "Die anderen werden neugierig.", ["Die anderen schlafen ein.", "Die anderen fühlen sich beleidigt."], "Eine Frage weckt Interesse."],
	["Finn sagt: „Dein Bild ist schön. Die Farben mag ich besonders.“", "Lena freut sich und zeigt gern mehr.", ["Lena ist gekränkt.", "Lena versteht nichts."], "Wertschätzung macht Mut."],
	["Tom sagt: „Du bist zu blöd dafür!“", "Die andere Person zieht sich zurück oder wird wütend.", ["Die andere Person fühlt sich ermutigt.", "Die andere Person lernt schneller."], "Beleidigungen beenden das gute Gespräch."],
	["Lea sagt nur: „Wir treffen uns morgen.“", "Ihre Freundin weiß nicht, wo und wann.", ["Ihre Freundin kommt pünktlich an den richtigen Ort.", "Ihre Freundin ist beleidigt."], "Unvollständige Angaben führen zu Missverständnissen."],
];

const WHY_FAILS: Item[] = [
	["„Bring das Ding mit!“, sagt Ali. Paul bringt das falsche Buch mit.", "Ali hat nicht genau gesagt, was er meint.", ["Paul kann nicht lesen.", "Bücher sind zu schwer."], "„Das Ding“ ist nicht genau."],
	["Mia spricht beim Vortrag leise und schaut nur auf ihren Zettel. Die Klasse wird unruhig.", "Sie erreicht die anderen weder mit Stimme noch mit Blick.", ["Die Klasse mag keine Vorträge.", "Ihr Zettel ist zu klein."], "Stimme und Blick fehlen."],
	["Tom ruft: „Deine Idee ist Mist!“ Lena sagt danach gar nichts mehr.", "Tom ist nicht wertschätzend, und Lena fühlt sich verletzt.", ["Lena hat keine Ideen mehr.", "Tom hat zu leise gesprochen."], "Herabsetzung beendet das Gespräch."],
	["Finn erzählt erst das Ende, dann den Anfang und dann die Mitte. Keiner versteht ihn.", "Seine Informationen sind nicht geordnet.", ["Seine Geschichte ist zu kurz.", "Die anderen hören nicht gut."], "Eine klare Reihenfolge hilft beim Verstehen."],
	["„Treffen wir uns dort?“, schreibt Lea. Nina wartet am falschen Ort.", "Lea hat den Ort nicht genannt.", ["Nina hat kein Handy.", "Lea schreibt zu schnell."], "Mit „dort“ weiß Nina nicht genug."],
];

const REPHRASE: Item[] = [
	["„Dein Plan ist Quatsch!“", "„Ich habe Bedenken. Könnten wir auch einen anderen Plan überlegen?“", ["„Dein Plan ist wirklich totaler Quatsch!“", "„Du hast nie gute Pläne.“"], "Du sagst deine Meinung, ohne den anderen abzuwerten."],
	["„Du spielst schlecht!“", "„Wenn du den Ball früher abgibst, klappt es bestimmt besser.“", ["„Du wirst es nie lernen.“", "„Geh einfach vom Platz.“"], "Ein konkreter Tipp hilft mehr."],
	["„Sei endlich still!“", "„Bitte lass mich kurz ausreden.“", ["„Du redest nur Unsinn.“", "„Immer musst du stören!“"], "Eine Bitte kommt besser an als ein Befehl."],
	["„Das verstehst du eh nicht.“", "„Soll ich es dir noch einmal anders erklären?“", ["„Das ist doch ganz einfach, du Trottel.“", "„Frag mich nicht mehr.“"], "Hilfe anbieten zeigt Respekt."],
	["„Deine Schrift ist ein Chaos.“", "„Ich kann das Wort hier nicht lesen. Schreibst du es noch einmal deutlich?“", ["„So schreibt nur ein Baby.“", "„Du schreibst immer am schlechtesten.“"], "Du sagst genau, was du brauchst."],
];

const verstaendigung: Lesson = {
	id: "verstaendigung",
	stage: "sprachlabor",
	title: "Damit Verständigung gelingt",
	skill: "Du beschreibst, was ein Gespräch gelingen lässt und was es bewirkt.",
	lehrplan: "D3/4 4.1: Ursachen und Wirkungen gelingender Verständigung",
	bindings: ["4.1-02"],
	sticker: { emoji: "🤝", name: "Brückenbauer" },
	paragraphs: [
		"Ob dich jemand versteht, hängt nicht nur von den Wörtern ab. Du hilfst anderen, wenn deine Informationen vollständig und geordnet sind: Wer? Wo? Wann?",
		"Auch der Körper spricht mit. Schaust du jemanden an, nickst oder zeigst etwas mit den Händen, merken die anderen: Das ist wichtig. Das nennt man Gestik und Mimik.",
		"Wertschätzung ist genauso wichtig. Beleidigungen beenden ein Gespräch, freundliche Worte öffnen es. Gelingt die Verständigung, hören dir die anderen aufmerksam zu, zeigen Interesse und antworten gern.",
	],
	example: {
		title: "Tinto vergleicht zwei Gespräche",
		lines: [
			"„Bring das Ding morgen mit!“ → Keiner weiß, was gemeint ist.",
			"„Bringst du bitte morgen um acht dein Lesebuch mit?“ → Alles ist klar.",
			"Dabei schaut Tinto sein Gegenüber freundlich an. → Es hört gern zu.",
		],
	},
	takeaway: "Vollständig und geordnet sprechen, dabei anschauen und freundlich bleiben. Dann hören dir andere aufmerksam zu.",
	terms: [
		{ term: "Gestik", meaning: "was du mit deinen Händen und Armen zeigst" },
		{ term: "Mimik", meaning: "was dein Gesicht zeigt" },
		{ term: "wertschätzend", meaning: "so, dass andere sich ernst genommen fühlen" },
	],
	check: {
		wrong: "immer das letzte Wort haben",
		explanation: "Wer vollständig und geordnet spricht, wird leichter verstanden.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Die Gesprächs-Lupe",
			intro: "Wähle einen Stift. Was tut die Person? Was bewirkt es? Was gar nicht zum Gespräch gehört, bleibt ohne Farbe.",
			pens: [
				{ value: "U", label: "Das tut jemand (Ursache)", colour: "blue" },
				{ value: "W", label: "Das bewirkt es (Wirkung)", colour: "green" },
			],
			puzzles: [
				marks("vortrag", "Mia_schaut_die_Klasse_an.|U Alle_hören_aufmerksam_zu.|W Der_Raum_hat_drei_Fenster.", "Beim Vortrag", "Die Fenster gehören nicht zum Gespräch."),
				marks("streit", "Lena_wird_wieder_ruhig.|W Finn_sagt:_„Das_tut_mir_leid.“|U Heute_ist_Dienstag.", "Nach einem Streit", "Die Wirkung steht hier zuerst."),
				marks("erklaeren", "Ali_nennt_die_Regeln_der_Reihe_nach.|U Pia_versteht_das_Spiel_sofort.|W Der_Ball_ist_rot.", "Beim Erklären", "Was hat Ali getan? Was folgt daraus?"),
			],
		},
		["Untersuche das Gespräch beim Vortrag.", "Untersuche das Gespräch nach dem Streit.", "Untersuche das Gespräch beim Erklären."],
	),
	generators: {
		1: [
			(rng) => sort(rng, "Was hilft hier am meisten?", HELPS, "Ist die Information vollständig und geordnet? Schaut die Person hin? Bleibt sie freundlich?", "hilft"),
			(rng) => sort(rng, "Was bewirkt das wahrscheinlich?", CAUSE_EFFECT, "Stelle dir vor, du wärst die andere Person. Wie würdest du reagieren?", "wirkung"),
		],
		2: [
			(rng) => sort(rng, "Warum klappt die Verständigung hier nicht?", WHY_FAILS, "Ist etwas unvollständig, ungeordnet oder verletzend?", "klappt"),
			(rng) => sort(rng, "Wie sagst du das wertschätzend?", REPHRASE, "Sage deine Meinung oder Bitte, ohne die andere Person abzuwerten.", "wertschaetzen"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 3 Mündlich und schriftlich ---------- */

const SPOKEN_OR_WRITTEN: Item[] = [
	["hey, kommste nachher?? 😀", "wie gesprochen", ["wie geschrieben"], "Kurz, locker, mit Emoji: So schreibt man im Chat."],
	["Boah, voll cool, oder?", "wie gesprochen", ["wie geschrieben"], "Ausrufe und „oder?“ klingen wie im Gespräch."],
	["hab keine zeit, sorry, bis morgen", "wie gesprochen", ["wie geschrieben"], "Das Wort „ich“ fehlt, alles ist klein geschrieben. So schreibt man im Chat."],
	["Probier’s aus, echt super lecker!", "wie gesprochen", ["wie geschrieben"], "Auch Werbung klingt oft wie ein Gespräch."],
	["Die Stadt München eröffnete am Montag eine neue Bücherei.", "wie geschrieben", ["wie gesprochen"], "Vollständiger Satz, genaue Angaben: So schreibt eine Zeitung."],
	["Igel halten etwa von November bis März Winterschlaf.", "wie geschrieben", ["wie gesprochen"], "So steht es in einem Sachtext."],
	["Am Samstag findet in der Turnhalle das Sommerfest statt.", "wie geschrieben", ["wie gesprochen"], "Das ist eine genaue, sachliche Mitteilung."],
];

const FEATURES: Item[] = [
	["Eine Chat-Nachricht", "Sie hat oft kurze Sätze, Abkürzungen und Emojis.", ["Sie hat immer lange Sätze und Fachwörter.", "Sie hat immer eine Überschrift und Absätze."], "Im Chat schreibt man fast so, wie man spricht."],
	["Ein Zeitungsartikel", "Er hat eine Überschrift, vollständige Sätze und genaue Angaben.", ["Er hat viele Emojis und „hey“.", "Er besteht nur aus Ausrufen."], "In der Zeitung soll alles für alle klar sein."],
	["Ein Sachtext", "Er nennt genaue Fachwörter und Tatsachen.", ["Er sagt: „Na, wie geht’s?“", "Er kürzt fast alle Wörter ab."], "Sachtexte informieren genau."],
	["Eine Werbung", "Sie spricht dich oft locker und direkt an, fast wie im Gespräch.", ["Sie ist immer lang und sehr genau.", "Sie nennt nie einen Namen."], "Werbung tut oft so, als rede sie mit dir."],
	["Eine E-Mail an einen Freund", "Sie darf locker sein, oft mit kurzer Anrede.", ["Sie braucht immer viele Fachwörter.", "Sie steht immer in einer Zeitung."], "Eine E-Mail an Freunde klingt oft wie ein Gespräch."],
];

const REWRITE: Item[] = [
	["hey leute, morgen kein sport, halle kaputt 😢", "Morgen fällt der Sportunterricht aus, weil die Turnhalle beschädigt ist.", ["Morgen ist voll blöd, kein Sport!!", "morgen kein sport"], "Vollständiger Satz, sachlich, ohne Emoji."],
	["boah, der hund war mega schnell weg", "Der Hund lief sehr schnell davon.", ["Boah, mega schnell!", "hund weg"], "Ohne „boah“ und „mega“ und als ganzer Satz."],
	["fest war super, waren voll viele da", "Zum Fest kamen sehr viele Gäste.", ["Fest super!!!", "voll viele da"], "Im Zeitungsbericht stehen genaue, ganze Sätze."],
	["bus kam nicht, mussten 20 min warten", "Der Bus kam nicht, deshalb mussten wir 20 Minuten warten.", ["bus nicht da, doof", "20 min"], "Hier stehen alle Wörter und ganze Sätze."],
];

const WHICH_STYLE: Item[] = [
	["Du schreibst der Schulleiterin, dass du krank bist.", "Sehr geehrte Frau Maier, ich kann heute leider nicht kommen, weil ich krank bin.", ["hey, bin krank, bis dann 😷", "Yo, heute nix Schule!"], "Einer Schulleiterin schreibst du höflich und in ganzen Sätzen."],
	["Du schreibst deinem besten Freund, dass du später kommst.", "Komme 10 min später, bis gleich!", ["Sehr geehrter Herr, ich teile Ihnen mit, dass ich mich verspäte.", "Die Verspätung beträgt zehn Minuten laut Plan."], "Unter Freunden darf es kurz und locker sein."],
	["Du schreibst für die Klassenzeitung über den Ausflug.", "Am Freitag fuhr die Klasse 4b ins Römermuseum.", ["war cool im museum, ey!", "Yo Leute, was geht?"], "Die Zeitung lesen viele. Schreibe sachlich und vollständig."],
	["Du schreibst einen Zettel für deine Mutter.", "Bin bei Lea, um sechs zurück. Kuss!", ["Sehr geehrte Mutter, hiermit teile ich Ihnen meinen Aufenthaltsort mit.", "Lea wohnt in einem Haus mit drei Stockwerken."], "Kurz und persönlich passt zu einem Zettel."],
	["Du bittest die Bücherei um ein Buch für deinen Vortrag.", "Guten Tag, ich suche für einen Vortrag ein Buch über Igel. Können Sie mir helfen?", ["hey, igel-buch da?", "Gib mal Buch!"], "Fremde Erwachsene sprichst du höflich und vollständig an."],
];

const muendlich: Lesson = {
	id: "muendlich-schriftlich",
	stage: "sprachlabor",
	title: "Wie gesprochen, wie geschrieben",
	skill: "Du vergleichst lockere, gesprächsnahe Texte mit sorgfältig geschriebenen und wählst die passende Form.",
	lehrplan: "D3/4 4.2: Mündlichkeit in Werbetexten, SMS, Chat, Mail und Schriftlichkeit in Zeitungsartikeln, Sachtexten",
	bindings: ["4.2-01"],
	sticker: { emoji: "💬", name: "Stilwechsler" },
	paragraphs: [
		"Manche Texte stehen zwar auf dem Bildschirm oder auf Papier, klingen aber wie gesprochen. In einem Chat, einer SMS oder einer Mail an Freunde schreibst du kurz und locker, mit Abkürzungen und Emojis. Auch Werbung klingt oft so.",
		"Andere Texte sind sorgfältig geschrieben: Zeitungsartikel und Sachtexte haben vollständige Sätze, genaue Wörter und meist Absätze. Sie richten sich an viele Menschen, die du nicht kennst. Darum muss alles klar sein, auch ohne Rückfrage.",
		"Nichts davon ist besser oder schlechter. Es kommt darauf an, wem du schreibst und wozu. Dem besten Freund schreibst du anders als der Schulleiterin.",
	],
	example: {
		title: "Tinto schreibt zweimal dasselbe",
		lines: [
			"Chat: hey, morgen kein sport, halle kaputt 😢",
			"Schulzeitung: Morgen fällt der Sportunterricht aus, weil die Turnhalle beschädigt ist.",
			"Beide Texte sagen dasselbe. Sie richten sich nur an andere Menschen.",
		],
	},
	takeaway: "Wie gesprochen: kurz, locker, mit Abkürzungen und Emojis. Wie geschrieben: vollständige Sätze und genaue Wörter. Wähle nach Empfänger und Zweck.",
	terms: [
		{ term: "Chat", meaning: "Gespräch mit kurzen Nachrichten auf dem Bildschirm" },
		{ term: "Abkürzung", meaning: "kürzere Form eines Wortes, zum Beispiel „min“ für Minuten" },
		{ term: "Empfänger", meaning: "die Person, an die sich ein Text richtet" },
	],
	check: {
		wrong: "viele Absätze mit Überschriften",
		explanation: "Im Chat schreibst du fast so, wie du sprichst: kurz, mit Abkürzungen und Emojis.",
	},
	workshop: slotWorkshop(
		{
			variant: "mark",
			title: "Der Stil-Scanner",
			intro: "Wähle einen Stift. Klingt das Stück wie gesprochen oder wie sorgfältig geschrieben? Was keinen Satz bildet, bleibt frei.",
			pens: [
				{ value: "M", label: "wie gesprochen", colour: "orange" },
				{ value: "S", label: "wie geschrieben", colour: "blue" },
			],
			puzzles: [
				marks("sport", "hey,_kein_sport_morgen|M Der_Sportunterricht_entfällt_am_Dienstag.|S bis_dann_😀|M Turnhalle", "Zwei Nachrichten zum Sport", "Das einzelne Wort „Turnhalle“ ist kein Satz."),
				marks("fest", "Am_Samstag_findet_das_Schulfest_statt.|S kommste_auch??|M Der_Eintritt_ist_frei.|S Samstag", "Zum Schulfest", "Das einzelne Wort „Samstag“ ist kein Satz."),
				marks("igel", "boah_igel_sind_voll_süß|M Igel_halten_von_November_bis_März_Winterschlaf.|S echt_jetzt?|M Winter", "Über Igel", "Das einzelne Wort „Winter“ ist kein Satz."),
			],
		},
		["Scanne die Nachrichten zum Sport.", "Scanne die Nachrichten zum Schulfest.", "Scanne die Sätze über Igel."],
	),
	generators: {
		1: [
			(rng) => sort(rng, "Wie klingt dieser Text?", SPOKEN_OR_WRITTEN, "Stelle dir vor, jemand sagt das zu dir. Klingt es wie ein Gespräch?", "klang"),
			(rng) => sort(rng, "Was ist typisch für diese Textform?", FEATURES, "Wer liest diesen Text, und wie gut kennt ihn der Schreiber?", "typisch"),
		],
		2: [
			(rng) => sort(rng, "Wie schreibst du das für die Schulzeitung?", REWRITE, "Für die Zeitung brauchst du ganze Sätze und genaue Wörter, ohne „boah“ und Emojis.", "umschreiben"),
			(rng) => sort(rng, "Welche Nachricht passt hier?", WHICH_STYLE, "Wem schreibst du? Wie gut kennst du die Person?", "passt"),
		],
	},
	requiredCorrect: 3,
};

/* ---------- 4 Sprachen im Umfeld ---------- */

const KINDS_OF_LANGUAGE: Item[] = [
	["Eine Oma aus Niederbayern sagt „Servus“ und „Schui“ für Schule.", "Dialekt", ["Englisch", "Blindenschrift"], "Bairisch ist ein Dialekt. Er gehört zu einer Region."],
	["In der Zeitung steht: „Die Schule beginnt um acht Uhr.“", "Standardsprache", ["Dialekt", "Jugendsprache"], "Die Standardsprache verstehen alle, die Deutsch können."],
	["Ein großer Bruder sagt: „Das ist krass!“", "Jugendsprache", ["Standardsprache", "Blindenschrift"], "Solche Wörter benutzen vor allem Jugendliche untereinander."],
	["Auf einer Medikamentenpackung kannst du kleine erhabene Punkte ertasten.", "Blindenschrift", ["Gebärdensprache", "Jugendsprache"], "Blinde Menschen lesen diese Punkte mit den Fingern."],
	["Zwei Menschen unterhalten sich schnell mit Händen, Gesicht und Körper, ganz ohne Stimme.", "Gebärdensprache", ["Blindenschrift", "Dialekt"], "Gebärdensprache ist eine eigene Sprache, die man sieht."],
	["Auf einem Schild am Flughafen steht „Exit“.", "Englisch", ["Dialekt", "Standardsprache"], "„Exit“ ist Englisch und heißt Ausgang."],
];

const TRUE_FACTS: Item[] = [
	["Dialekt", "Er gehört zu einer Region und ist eine vollwertige Form zu sprechen.", ["Er ist falsches Deutsch.", "Er ist eine Schrift aus Punkten."], "Dialekte sind nicht falsch. Sie haben eigene Wörter und Regeln."],
	["Blindenschrift", "Jeder Buchstabe besteht aus bis zu sechs erhabenen Punkten.", ["Man liest sie mit einer Lupe.", "Sie besteht aus Handzeichen."], "Die Punkte ertastet man mit den Fingerspitzen."],
	["Gebärdensprache", "Sie ist eine eigene Sprache mit eigener Grammatik.", ["Sie ist nur Pantomime ohne Regeln.", "Sie besteht aus Punkten auf Papier."], "Gehörlose Menschen unterhalten sich mit ihr genauso genau wie andere mit Lautsprache."],
	["Arabische Schrift", "Sie wird von rechts nach links geschrieben.", ["Sie hat genau dieselben Buchstaben wie Deutsch.", "Sie wird nur mit Großbuchstaben geschrieben."], "Viele Schriften laufen anders als unsere."],
	["Englisch", "Es ist mit Deutsch verwandt. Darum ähneln sich manche Wörter.", ["Es hat kein einziges ähnliches Wort.", "Es wird nur in England gesprochen."], "Haus und house, Milch und milk sind verwandt."],
	["Herkunftssprache", "Das ist eine Sprache, die jemand oft von zu Hause mitbringt.", ["Das ist eine Sprache, die nur Erwachsene sprechen.", "Das ist immer dieselbe Sprache wie Englisch."], "Mehrere Sprachen zu können, ist eine Stärke."],
];

const COMPARE: Item[] = [
	["Haus und house, Milch und milk, Schule und school", "Die Wörter ähneln sich, weil Deutsch und Englisch verwandt sind.", ["Sie sind zufällig gleich, das hat keinen Grund.", "Das Englische hat sie aus dem Bairischen."], "Verwandte Sprachen haben ähnliche Wörter."],
	["Milch und süt, Schule und okul", "Deutsch und Türkisch sind nicht verwandt, darum klingen die Wörter ganz anders.", ["Türkische Wörter sind immer kürzer als deutsche.", "Eines der beiden Wörter ist falsch geschrieben."], "Nicht alle Sprachen sind miteinander verwandt."],
	["Schule und Schui, Milch und Milli", "Bairisch und Standardsprache sind sich nah, klingen aber anders.", ["Bairisch ist eine ganz fremde Sprache ohne Verwandtschaft.", "Schui ist ein Rechtschreibfehler."], "Dialekt und Standardsprache gehören eng zusammen."],
	["„Das ist krass!“ und „Das ist erstaunlich.“", "Beide sagen etwas Ähnliches, passen aber zu anderen Situationen.", ["Nur der zweite Satz ist richtiges Deutsch.", "Beide Sätze gehören nur in die Zeitung."], "Jugendsprache passt zu Freunden, Standardsprache zu fremden Lesern."],
	["Blindenschrift und unsere Buchstaben", "Beide stehen für Laute, die eine ertastet man, die andere sieht man.", ["Blindenschrift hat mit Buchstaben nichts zu tun.", "Unsere Buchstaben kann man nur ertasten."], "Schriften können ganz verschieden aussehen und doch dasselbe leisten."],
];

const AWARENESS: Item[] = [
	["Ein Kind in deiner Klasse spricht zu Hause Arabisch.", "Du kannst es fragen, wie man dort schreibt und grüßt.", ["Du sagst ihm, dass es nur Deutsch sprechen darf.", "Du lachst über die fremde Schrift."], "Andere Sprachen sind eine Chance, etwas zu entdecken."],
	["Dein Opa spricht nur Bairisch.", "Du freust dich über die besonderen Wörter und fragst nach, was du nicht verstehst.", ["Du verbesserst ihn, weil das falsches Deutsch ist.", "Du antwortest ihm gar nicht."], "Dialekte sind ein Schatz. Falsch sind sie nicht."],
	["Du triffst ein gehörloses Kind.", "Du schaust es beim Sprechen an und probierst Zeichen oder Aufschreiben.", ["Du rufst besonders laut.", "Du redest nur mit den anderen über es."], "Gehörlose können oft von den Lippen ablesen, wenn sie dein Gesicht sehen. Zeichen helfen auch."],
	["In einem Buch über Japan siehst du Schriftzeichen.", "Du überlegst, was anders ist als bei unserer Schrift, und schlägst nach.", ["Du sagst, das sei gar keine richtige Schrift.", "Du blätterst lachend weiter."], "Vergleichen hilft dir auch, die eigene Sprache besser zu verstehen."],
	["Dein Bruder sagt ständig „krass“.", "Du weißt, dass das unter Freunden passt, in einem Brief an die Schule aber nicht.", ["Du denkst, dass er kein Deutsch kann.", "Du schreibst selbst überall „krass“ in deine Aufsätze."], "Du wählst die Sprache je nach Situation."],
];

const TABLE: Record<string, Record<string, string>> = {
	Mutter: { Standarddeutsch: "Mutter", Bairisch: "Muatta", Englisch: "mother", Türkisch: "anne" },
	Schule: { Standarddeutsch: "Schule", Bairisch: "Schui", Englisch: "school", Türkisch: "okul" },
	Milch: { Standarddeutsch: "Milch", Bairisch: "Milli", Englisch: "milk", Türkisch: "süt" },
	Haus: { Standarddeutsch: "Haus", Bairisch: "Haus", Englisch: "house", Türkisch: "ev" },
};

const LANGUAGE_NOTES: Record<string, { note: string; found?: string }> = {
	Standarddeutsch: { note: "So steht das Wort im Wörterbuch und in der Zeitung. Stelle eine andere Sprache ein." },
	Bairisch: { note: "Bairisch ist ein Dialekt aus unserer Region. Die Schreibung schwankt, denn Dialekt wird meist gesprochen.", found: "dialekt" },
	Englisch: { note: "Englisch und Deutsch sind verwandt. Viele Wörter sehen deshalb ähnlich aus.", found: "aehnlich" },
	Türkisch: { note: "Türkisch ist mit Deutsch nicht verwandt. Die Wörter klingen deshalb ganz anders.", found: "anders" },
};

function bridgeView(values: Record<string, string>): MachineView {
	const language = LANGUAGE_NOTES[values.sprache];
	return {
		display: `${values.wort} → ${TABLE[values.wort][values.sprache]}`,
		note: language.note,
		found: language.found,
		tone: language.found ? "ok" : undefined,
	};
}

const bridgeMachine: MachineWorkshop = {
	kind: "machine",
	title: "Die Wörter-Brücke",
	intro: "Wähle ein Wort und eine Sprache. Vergleiche: Was ist ähnlich, was ganz anders? Das sind nur Einzelbeispiele. Vielleicht kennst du noch andere Sprachen.",
	controls: [
		{ id: "wort", label: "Wort", options: Object.keys(TABLE) },
		{ id: "sprache", label: "Sprache", options: Object.keys(LANGUAGE_NOTES) },
	],
	initial: { wort: "Mutter", sprache: "Standarddeutsch" },
	view: bridgeView,
	goals: [
		{ id: "dialekt", label: "Finde ein Wort im Dialekt.", reached: (state) => state.found.includes("dialekt") },
		{ id: "aehnlich", label: "Finde ein ähnliches Wort aus einer verwandten Sprache.", reached: (state) => state.found.includes("aehnlich") },
		{ id: "anders", label: "Finde ein Wort aus einer nicht verwandten Sprache.", reached: (state) => state.found.includes("anders") },
	],
};

const sprachen: Lesson = {
	id: "sprachen-im-umfeld",
	stage: "sprachlabor",
	title: "Sprachen um dich herum",
	skill: "Du beschreibst Gemeinsamkeiten und Unterschiede von Sprachen und Schriften in deinem Umfeld.",
	lehrplan: "D3/4 4.2: Standardsprache, Dialekte, Jugendsprache, Herkunftssprachen, Englisch, Blindenschrift, Gebärdensprache",
	bindings: ["4.2-02"],
	sticker: { emoji: "🌍", name: "Sprachenforscher" },
	paragraphs: [
		"Um dich herum gibt es viele Sprachen. Standardsprache steht in der Zeitung und im Wörterbuch. Bairisch und andere Dialekte gehören zu einer Region. Jugendliche haben ihre eigenen Wörter. Viele Kinder sprechen zu Hause eine andere Sprache, etwa Türkisch, Arabisch oder Polnisch, und in der Schule lernst du Englisch.",
		"Vergleichst du Sprachen, entdeckst du viel. Englisch und Deutsch sind verwandt: Haus und house, Milch und milk. Türkisch ist nicht verwandt: Milch heißt süt.",
		"Auch Schriften sind verschieden. Arabisch läuft von rechts nach links. Blindenschrift besteht aus Punkten, die man ertastet. Gebärdensprache ist eine eigene Sprache mit Händen, Gesicht und Körper. Keine Sprache ist besser als eine andere. Wer mehrere kann, hat etwas Besonderes.",
	],
	example: {
		title: "Tinto vergleicht das Wort „Schule“",
		lines: [
			"Standardsprache: Schule",
			"Bairisch: Schui",
			"Englisch: school (ähnlich, die Sprachen sind verwandt)",
			"Türkisch: okul (ganz anders, nicht verwandt)",
		],
	},
	takeaway: "Sprachen und Schriften sind verschieden und alle wertvoll. Vergleichen zeigt dir, was ähnlich ist, was anders ist und wie deine eigene Sprache funktioniert.",
	terms: [
		{ term: "Standardsprache", meaning: "die Form des Deutschen, die alle verstehen und die in Büchern steht" },
		{ term: "Dialekt", meaning: "regionale Form einer Sprache, zum Beispiel Bairisch" },
		{ term: "Blindenschrift", meaning: "Schrift aus erhabenen Punkten zum Ertasten" },
		{ term: "Gebärdensprache", meaning: "eigene Sprache mit Händen, Gesicht und Körper" },
	],
	check: {
		wrong: "eine Sprache nur für Erwachsene",
		explanation: "Ein Dialekt gehört zu einer Region, zum Beispiel Bairisch in großen Teilen Bayerns.",
	},
	workshop: bridgeMachine,
	generators: {
		1: [
			(rng) => sort(rng, "Was ist das?", KINDS_OF_LANGUAGE, "Hörst du etwas, siehst du etwas, oder ertastest du etwas? Gehört es zu einer Region oder einem Alter?", "art"),
			(rng) => sort(rng, "Was stimmt über dieses Thema?", TRUE_FACTS, "Denke an das, was im Text oben steht.", "fakt"),
		],
		2: [
			(rng) => sort(rng, "Was kannst du aus diesem Vergleich schließen?", COMPARE, "Was ist gleich, was ist anders? Warum könnte das so sein?", "vergleich"),
			(rng) => sort(rng, "Wie gehst du damit am besten um?", AWARENESS, "Keine Sprache ist schlechter. Was hilft dir beim Entdecken und Verstehen?", "umgang"),
		],
	},
	requiredCorrect: 3,
};

export const SPRACHLABOR: Lesson[] = [wirkt, verstaendigung, muendlich, sprachen];
