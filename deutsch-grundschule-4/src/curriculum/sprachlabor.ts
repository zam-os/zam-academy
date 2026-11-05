// Station 7 · Sprachlabor: Sprachgebrauch untersuchen (LehrplanPLUS Deutsch 3/4,
// 4.1 und 4.2). Beispielwörter aus anderen Sprachen sind Einzelbeispiele; Gespräche
// mit Menschen, die diese Sprachen sprechen, bleiben Praxis außerhalb der App.
import type { Lesson, MachineView, MachineWorkshop } from "../types";
import { marks, slotWorkshop } from "./helpers";
import { type Item, sort, type TypedItem, typed } from "./lesewerkstatt";

/* ---------- 1 Sprache wirkt ---------- */

const DEVICES: Item[] = [
	["Probier ihn heute noch!", "direkte Anrede", ["Übertreibung", "Reim"], "Der Satz spricht dich direkt an."],
	["Hol dir jetzt dein neues Rad!", "direkte Anrede", ["Reim", "Übertreibung"], "„Hol dir“ meint dich persönlich."],
	["Die beste Schokolade der ganzen Welt!", "Übertreibung", ["direkte Anrede", "Reim"], "Das behauptet die Werbung. Beweisen kann sie es nicht."],
	["Dieser Schuh ist schneller als der Wind!", "Übertreibung", ["Reim", "direkte Anrede"], "Kein Schuh macht schneller als der Wind."],
	["Saft mit Kraft!", "Reim", ["Übertreibung", "direkte Anrede"], "Saft und Kraft klingen ähnlich. Das merkt man sich leicht."],
	["Alle froh mit Haferstroh!", "Reim", ["direkte Anrede", "Übertreibung"], "Froh und Stroh reimen sich. So bleibt der Spruch im Kopf."],
];

const INTENTIONS: Item[] = [
	["Nur heute: Zwei Spiele zum Preis von einem!", "dass du etwas kaufst", ["dass du lachst", "dass du spendest"], "Das ist Werbung. Der Preis soll dich locken."],
	["Dieser neue Roller macht dich zum Star auf dem Schulhof!", "dass du etwas kaufst", ["dass du dich informierst, wie Roller gebaut sind", "dass du spendest"], "Die Werbung verspricht dir etwas Schönes."],
	["Das Hochwasser hat Mikas Schule beschädigt. Hilf mit deiner Spende, damit er bald wieder lernen kann!", "dass du spendest", ["dass du etwas kaufst", "dass du lachst"], "Der Aufruf erzählt von einem Kind und bittet um Hilfe."],
	["Jeder Euro hilft, die Tiere im Tierheim satt zu machen.", "dass du spendest", ["dass du ein Tier kaufst", "dass du lachst"], "Das ist ein Aufruf zum Helfen."],
	["Treffen sich zwei Kerzen. Fragt die eine: „Ist Wasser gefährlich?“ Sagt die andere: „Davon kannst du ausgehen!“", "dass du lachst", ["dass du etwas kaufst", "dass du spendest"], "Das ist ein Witz: Ausgehen hat hier zwei Bedeutungen."],
	["Hoch oben im Turm flackerte ein Licht. Dann ging die Tür knarrend auf.", "dass du gespannt weiterliest", ["dass du etwas kaufst", "dass du spendest"], "Eine Geschichte will dich fesseln."],
];

const WHY_WORDS: Item[] = [
	["Eine Werbung sagt: „Du hast es dir verdient!“ Warum?", "Du sollst dich persönlich angesprochen fühlen.", ["Die Werbung kennt dich genau und weiß, was du dir verdient hast.", "Der Satz nennt dir den genauen Preis und alle wichtigen Angaben."], "Die Werbung kennt dich nicht. Das „Du“ soll nur Nähe schaffen."],
	["Ein Spendenaufruf erzählt von einem einzelnen Kind statt von vielen tausend Menschen. Warum?", "Bei einer einzelnen Geschichte fühlst du eher mit.", ["Es gibt auf der ganzen Welt nur dieses eine Kind, das Hilfe braucht.", "Zahlen dürfen in einem Spendenaufruf grundsätzlich nicht vorkommen."], "Die Geschichte eines einzelnen Menschen berührt uns oft stärker als eine Zahl."],
	["In einer Geschichte steht: „Etwas Kaltes berührte meine Hand.“ Warum steht dort nicht gleich, was es war?", "Du sollst gespannt sein und selbst rätseln.", ["Die Figur kennt das richtige Wort für dieses Ding leider nicht.", "Für dieses kalte Ding gibt es im Deutschen gar kein eigenes Wort."], "Was noch unklar ist, macht neugierig."],
	["Warum steht in Werbung oft „Nur noch heute!“?", "Du sollst schnell kaufen, ohne lange nachzudenken.", ["Der Laden schließt heute Abend für immer und kommt nie wieder.", "Morgen gibt es dieses Ding auf der ganzen Welt sicher nicht mehr."], "Eile soll dich drängen. Oft gibt es das Angebot später wieder."],
	["Warum klingt „Saft mit Kraft“ besser als „Saft mit Vitaminen“?", "Der Reim bleibt im Kopf und klingt fröhlich.", ["Der Satz sagt viel genauer, was alles in dem Saft enthalten ist.", "Das Wort Kraft ist viel kürzer als alle anderen Wörter im Satz."], "Reime kann man sich leicht merken."],
];

const JOKES: Item[] = [
	["„Wie heißt ein Bumerang, der nicht zurückkommt?“ – „Stock.“", "Ohne Rückkehr ist er einfach nur ein Stück Holz.", ["Bumerangs kommen wirklich nie zurück und sind deshalb ganz nutzlos.", "Das Wort Stock reimt sich auf Bumerang, und das klingt einfach lustig."], "Der Witz nimmt die Frage wörtlich und überrascht dich."],
	["Treffen sich zwei Kerzen. „Ist Wasser gefährlich?“ – „Davon kannst du ausgehen!“", "„Ausgehen“ heißt hier annehmen und auch erlöschen.", ["Kerzen können wirklich sprechen und sind deshalb besonders schlau.", "Wasser ist für alle Dinge auf der Welt immer sehr gefährlich."], "Der Witz spielt mit den zwei Bedeutungen."],
	["„Welche Bank hat kein Geld?“ – „Die Parkbank.“", "„Bank“ meint zwei Dinge: Geldhaus und Sitzplatz.", ["Banken stehen oft im Park, und das weiß fast kein Mensch.", "Auf einer Parkbank darf man sein Geld nicht liegen lassen."], "Der Witz spielt mit den zwei Bedeutungen von „Bank“."],
	["„Welcher Hahn kräht nie?“ – „Der Wasserhahn.“", "„Hahn“ meint zwei Dinge: das Tier und den Wasserhahn.", ["Wasserhähne krähen jeden Morgen, nur ganz leise und sehr früh.", "Im Bad gibt es nie einen Hahn, und das weiß fast kein Mensch."], "Der Witz spielt mit den zwei Bedeutungen von „Hahn“."],
];

const TRUE_OR_TRICK: Item[] = [
	["Ein Müsli wirbt: „Macht dich zum Superhelden!“", "Das ist übertrieben. Müsli macht niemanden zum Superhelden.", ["Das stimmt bestimmt, sonst dürfte es gar nicht auf der Packung stehen.", "Das ist ein sicherer Beweis dafür, dass dieses Müsli das beste ist."], "Werbung darf übertreiben. Prüfe, was wirklich dahintersteckt."],
	["Ein Handyspiel wirbt: „Alle spielen es!“", "Das soll dich mitreißen. „Alle“ stimmt fast nie.", ["Dann musst du es auch spielen, denn sonst gehörst du nicht mehr dazu.", "Das ist eine genaue Zahl, denn jemand hat vorher alle Menschen gefragt."], "„Alle“ ist kein Grund. Du darfst selbst entscheiden."],
	["Ein Spendenaufruf zeigt ein trauriges Kind.", "Das soll dich berühren. Frag nach, wer dahintersteht.", ["Wenn ein Bild traurig ist, muss der ganze Text automatisch wahr sein.", "Traurige Bilder gibt es nur in Märchen und nie in der echten Welt."], "Gefühle sind nicht falsch. Frage aber Erwachsene, wenn du dir nicht sicher bist."],
	["Ein Saft wirbt: „Jetzt mit neuem Rezept!“", "Das soll neugierig machen. Neu heißt nicht besser.", ["Neu heißt in der Werbung jedes Mal, dass etwas auch besser geworden ist.", "Der Satz sagt ganz genau, was an dem neuen Rezept anders ist."], "Neu ist nicht automatisch besser."],
];

const RHYME_WORDS: TypedItem[] = [
	["[[Saft]] mit Kraft!", ["Kraft"], "Saft und Kraft reimen sich."],
	["Flitzer-[[Schuh]]: schnell im Nu!", ["Nu"], "Schuh und Nu reimen sich."],
	["Alle [[froh]] mit Haferstroh!", ["Haferstroh"], "Froh und Haferstroh reimen sich."],
	["Spaß und [[Spiel]], und davon viel!", ["viel"], "Spiel und viel reimen sich."],
	["Bleib [[fit]], mach mit!", ["mit"], "Fit und mit reimen sich."],
	["Ein [[Eis]] zum kleinen Preis!", ["Preis"], "Eis und Preis reimen sich."],
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
	takeaway: "Frage immer: Was will dieser Text von mir? Anrede, Übertreibung und Reim wollen dich locken, Geschichten einzelner Menschen berühren dich, Witze spielen mit Bedeutungen.",
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
				{ value: "A", label: "Anrede", colour: "blue" },
				{ value: "U", label: "Übertreibung", colour: "red" },
				{ value: "R", label: "Reim", colour: "purple" },
			],
			puzzles: [
				marks("saft", "Saft_mit_Kraft!|R Der_beste_Saft_der_Welt.|U Probier_ihn_heute!|A Eine_Flasche_enthält_einen_Liter.", "Werbung für Saft", "Welcher Satz sagt nur eine Tatsache?"),
				marks("schuh", "Hol_dir_die_neuen_Flitzer!|A Schneller_als_jede_Rakete!|U Flitzer-Schuh:_schnell_im_Nu!|R Es_gibt_sie_in_drei_Farben.", "Werbung für Turnschuhe", "Kein Schuh ist schneller als eine Rakete. Schuh und Nu reimen sich."),
				marks("fest", "Komm_zu_unserem_Fest!|A Das_größte_Fest_aller_Zeiten!|U Spaß_und_Spiel,_und_davon_viel!|R Es_beginnt_um_15_Uhr.", "Plakat für ein Schulfest", "Spiel und viel reimen sich. Die Uhrzeit informiert nur."),
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
			(rng) => typed(rng, "Schreibe das Wort heraus, das sich auf das unterstrichene Wort reimt.", RHYME_WORDS, "Sprich den Spruch laut. Welche zwei Wörter klingen am Ende gleich?", "reimwort"),
			(rng) => sort(rng, "Was stimmt hier am ehesten?", TRUE_OR_TRICK, "Glaube nicht alles sofort. Was soll der Satz bewirken? Stimmt er wirklich?", "pruefen"),
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
	["Lena sagt: „Du bist zu blöd dafür!“", "Die andere Person zieht sich zurück oder wird wütend.", ["Die andere Person fühlt sich ermutigt.", "Die andere Person lernt schneller."], "Beleidigungen beenden das gute Gespräch."],
	["Lea sagt nur: „Wir treffen uns morgen.“", "Ihre Freundin weiß nicht, wo und wann.", ["Ihre Freundin kommt pünktlich an den richtigen Ort.", "Ihre Freundin ist beleidigt."], "Unvollständige Angaben führen zu Missverständnissen."],
];

const WHY_FAILS: Item[] = [
	["„Bring das Ding mit!“, sagt Ali. Paul bringt das falsche Buch mit.", "Ali hat nicht genau gesagt, was er meint.", ["Paul kann noch nicht lesen und hat deshalb irgendein Buch genommen.", "Bücher sind für Kinder zu schwer, und darum ging es hier schief."], "„Das Ding“ ist nicht genau."],
	["Mia spricht beim Vortrag leise und schaut nur auf ihren Zettel. Die Klasse wird unruhig.", "Sie erreicht die anderen weder mit Stimme noch mit Blick.", ["Die ganze Klasse mag grundsätzlich keine Vorträge, egal von welchem Kind.", "Ihr Zettel ist zu klein, und deshalb hört ihr niemand richtig zu."], "Stimme und Blick fehlen."],
	["Lena ruft: „Deine Idee ist Mist!“ Tom sagt danach gar nichts mehr.", "Lena war verletzend, und Tom zieht sich zurück.", ["Tom hat plötzlich keine einzige Idee mehr und mag nie wieder reden.", "Lena hat zu leise gesprochen, und Tom hat sie deshalb nicht verstanden."], "Wer andere abwertet, beendet das Gespräch."],
	["Finn erzählt erst das Ende, dann den Anfang und dann die Mitte. Keiner versteht ihn.", "Seine Informationen sind nicht geordnet.", ["Seine Geschichte ist viel zu kurz, und deshalb versteht sie niemand.", "Die anderen Kinder hören einfach nicht gut, und das macht ihn traurig."], "Eine klare Reihenfolge hilft beim Verstehen."],
	["„Treffen wir uns dort?“, schreibt Lea. Nina wartet am falschen Ort.", "Lea hat den Ort nicht genannt.", ["Nina hat ihr Handy verloren und konnte die Nachricht nicht ganz lesen.", "Lea schreibt immer viel zu schnell, und Nina kommt da nicht mit."], "Mit „dort“ weiß Nina nicht genug."],
];

const REPHRASE: Item[] = [
	["„Dein Plan ist Quatsch!“", "„Ich sehe das anders. Können wir noch etwas überlegen?“", ["„Dein Plan ist wirklich totaler Quatsch, das sage ich dir ganz ehrlich!“", "„Du hast sowieso nie gute Pläne, und das wissen hier auch alle.“"], "Du sagst deine Meinung, ohne den anderen abzuwerten."],
	["„Du spielst schlecht!“", "„Gib den Ball früher ab, dann klappt es bestimmt.“", ["„Du wirst es nie lernen, egal wie lange du noch weiterübst.“", "„Geh am besten gleich vom Platz, dann stört uns keiner mehr.“"], "Ein konkreter Tipp hilft mehr."],
	["„Sei endlich still!“", "„Bitte lass mich kurz ausreden.“", ["„Du redest schon wieder nur Unsinn, und das nervt uns alle.“", "„Immer musst du stören, wenn ich gerade etwas sagen möchte!“"], "Eine Bitte kommt besser an als ein Befehl."],
	["„Das verstehst du eh nicht.“", "„Soll ich es dir noch einmal anders erklären?“", ["„Das ist doch ganz einfach, das müsste sogar ein Baby verstehen.“", "„Frag mich am besten nicht mehr, ich habe keine Lust mehr dazu.“"], "Hilfe anbieten zeigt Respekt."],
	["„Deine Schrift ist ein Chaos.“", "„Ich kann das Wort hier nicht lesen. Schreibst du es deutlicher?“", ["„So schreibt doch höchstens ein Baby, und das weißt du auch ganz genau.“", "„Du schreibst von allen Kindern in der Klasse am allerschlechtesten.“"], "Du sagst genau, was du brauchst."],
];

const OPEN_INFO: TypedItem[] = [
	["Wir treffen uns morgen um vier.", ["Wo", "Wo?"], "Der Ort fehlt noch."],
	["Das Training ist morgen um vier.", ["Wo", "Wo?"], "Der Ort fehlt noch."],
	["Wir treffen uns am Spielplatz.", ["Wann", "Wann?"], "Die Zeit fehlt noch."],
	["Bring es bitte morgen mit!", ["Was", "Was?"], "Es steht nicht da, was jemand mitbringen soll."],
	["Morgen um acht soll jemand den Ball mitbringen.", ["Wer", "Wer?"], "Es steht nicht da, wer das tun soll."],
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
			intro: "Wähle einen Stift. Die Ursache ist das, was jemand tut. Die Wirkung ist das, was daraus folgt. Was gar nicht zum Gespräch gehört, bleibt ohne Farbe.",
			pens: [
				{ value: "U", label: "Ursache", colour: "blue" },
				{ value: "W", label: "Wirkung", colour: "green" },
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
			(rng) => typed(rng, "Diese Nachricht ist nicht vollständig. Schreibe das Fragewort auf, das noch offen ist.", OPEN_INFO, "Prüfe der Reihe nach: Wer? Was? Wann? Wo?", "fragewort"),
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
	["Eine Chat-Nachricht", "Sie hat oft kurze Sätze, Abkürzungen und Emojis.", ["Sie hat lange Sätze und viele genaue Fachwörter.", "Sie hat eine Überschrift und mehrere Absätze."], "Im Chat schreibt man fast so, wie man spricht."],
	["Ein Zeitungsartikel", "Er hat eine Überschrift und genaue Angaben.", ["Er hat viele Emojis und beginnt oft mit „hey“.", "Er besteht fast nur aus kurzen Ausrufen."], "In der Zeitung soll alles für alle klar sein."],
	["Ein Sachtext", "Er nennt genaue Fachwörter und Tatsachen.", ["Er fragt dich zuerst: „Na, wie geht’s?“", "Er kürzt fast alle Wörter ab und reimt sich."], "Sachtexte informieren genau."],
	["Eine Werbung", "Sie spricht dich oft locker und direkt an.", ["Sie ist lang und erklärt jedes Detail sehr genau.", "Sie nennt nie einen Namen und nie ein Produkt."], "Werbung tut oft so, als rede sie mit dir."],
	["Eine E-Mail an einen Freund", "Sie darf locker sein, mit kurzer Anrede.", ["Sie braucht viele Fachwörter und lange Sätze.", "Sie steht in der Zeitung und ist für alle gedacht."], "Eine E-Mail an Freunde klingt oft wie ein Gespräch."],
];

const REWRITE: Item[] = [
	["hey leute, morgen kein sport, halle kaputt 😢", "Morgen fällt der Sportunterricht aus, weil die Turnhalle beschädigt ist.", ["hey leute, morgen fällt sport aus, weil die halle kaputt ist, echt schade 😢", "Morgen ist voll blöd, denn es gibt keinen Sport, und die Halle ist hin, ey!"], "Vollständiger Satz, sachlich, ohne Emoji."],
	["boah, der hund war mega schnell weg", "Der Hund lief sehr schnell davon.", ["Boah, der Hund war echt mega schnell weg, das war vielleicht krass!", "hund total schnell weg, keiner hat was gemacht, echt jetzt"], "Ohne „boah“ und „mega“ und als ganzer Satz."],
	["fest war super, waren voll viele da", "Zum Fest kamen sehr viele Gäste.", ["Das Fest war super, und es waren voll viele Leute da, echt cool!", "fest super, voll viele da, hat sich total gelohnt, bis bald 😀"], "Im Zeitungsbericht stehen genaue, ganze Sätze."],
	["bus kam nicht, mussten 20 min warten", "Der Bus kam nicht, deshalb mussten wir 20 Minuten warten.", ["bus kam nicht, mussten 20 min warten, voll doof, oder was meinst du?", "Der Bus kam echt nicht, und wir so: 20 min warten, ey, wie blöd!"], "Hier stehen alle Wörter und ganze Sätze."],
];

const WHICH_STYLE: Item[] = [
	["Du schreibst der Schulleiterin, dass du krank bist.", "Sehr geehrte Frau Maier, ich bin heute leider krank.", ["hey frau maier, bin krank, komm heute nich, bis dann, tschüss 😷", "Yo, heute nix Schule für mich, bin krank, schöne Grüße an alle!"], "Einer Schulleiterin schreibst du höflich und in ganzen Sätzen."],
	["Du schreibst deinem besten Freund, dass du später kommst.", "Komme 10 min später, bis gleich!", ["Sehr geehrter Herr, ich teile Ihnen mit, dass ich mich verspäte.", "Die Verspätung beträgt laut Plan insgesamt zehn Minuten."], "Unter Freunden darf es kurz und locker sein."],
	["Du schreibst für die Klassenzeitung über den Ausflug.", "Am Freitag fuhr die Klasse 4b ins Römermuseum.", ["war richtig cool im museum, ey, nächstes mal komm ich wieder mit!", "Yo Leute, was geht? Wir waren im Museum, voll der krasse Tag!"], "Die Zeitung lesen viele. Schreibe sachlich und vollständig."],
	["Du schreibst einen Zettel für deine Mutter.", "Bin bei Lea, um sechs zurück. Kuss!", ["Sehr geehrte Mutter, hiermit teile ich Ihnen meinen Aufenthaltsort mit.", "Lea wohnt in einem Haus mit drei Stockwerken und einem Garten."], "Kurz und persönlich passt zu einem Zettel."],
	["Du bittest die Bücherei um ein Buch für deinen Vortrag.", "Guten Tag, ich suche ein Buch über Igel. Können Sie mir helfen?", ["hey, habt ihr so n igel-buch da? brauch das echt schnell für morgen", "Gib mir mal ganz schnell das Buch über Igel, ich hab wenig Zeit!"], "Fremde Erwachsene sprichst du höflich und vollständig an."],
];

const SPOKEN_WORDS: TypedItem[] = [
	["Ich komme in 5 [[min]].", ["Minuten"], "In der Zeitung steht das ganze Wort."],
	["Sorry, [[hab]] heute keine Zeit.", ["habe"], "Im Chat fällt das e oft weg, in der Zeitung nicht."],
	["Das ist [[nix]] für mich.", ["nichts"], "„Nix“ sagt man, geschrieben heißt es „nichts“."],
	["Das [[is]] echt toll.", ["ist"], "„Is“ sagt man nur so. Geschrieben heißt es „ist“."],
	["[[Kommste]] heute auch?", ["Kommst du"], "Beim Sprechen verschmelzen die Wörter, geschrieben sind es zwei."],
	["Wir [[ham]] das Spiel gewonnen.", ["haben"], "„Ham“ sagt man nur so. Geschrieben heißt es „haben“."],
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
			intro: "Wähle einen Stift. Klingt das Stück wie gesprochen oder wie sorgfältig geschrieben? Ein einzelnes Wort bleibt frei.",
			pens: [
				{ value: "M", label: "gesprochen", colour: "orange" },
				{ value: "S", label: "geschrieben", colour: "blue" },
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
			(rng) => sort(rng, "Was ist typisch für diese Textform?", FEATURES, "Wer liest das, und wie gut kennen sich die beiden?", "typisch"),
		],
		2: [
			(rng) => sort(rng, "Wie schreibst du das für die Schulzeitung?", REWRITE, "Für die Zeitung brauchst du ganze Sätze und genaue Wörter, ohne „boah“ und Emojis.", "umschreiben"),
			(rng) => sort(rng, "Welche Nachricht passt hier?", WHICH_STYLE, "Wem schreibst du? Wie gut kennst du die Person?", "passt"),
			(rng) => typed(rng, "Schreibe das unterstrichene Wort so, wie es in einem Zeitungsartikel stehen würde.", SPOKEN_WORDS, "Sprich es langsam und deutlich. Wie heißt das ganze Wort?", "ganzeswort"),
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
	["Dialekt", "Er gehört zu einer Region und hat eigene Wörter.", ["Er ist falsches Deutsch, das man korrigieren muss.", "Er ist eine Schrift aus Punkten zum Ertasten."], "Dialekte sind nicht falsch. Sie haben eigene Wörter und Regeln."],
	["Blindenschrift", "Jeder Buchstabe besteht aus bis zu sechs Punkten.", ["Man liest sie am besten mit einer starken Lupe.", "Sie besteht aus Handzeichen und Gesichtsausdrücken."], "Die Punkte ertastet man mit den Fingerspitzen."],
	["Gebärdensprache", "Sie ist eine eigene Sprache mit eigenen Regeln.", ["Sie ist nur Pantomime und hat gar keine Regeln.", "Sie besteht aus kleinen Punkten auf dem Papier."], "Gehörlose Menschen können damit über alles sprechen."],
	["Arabische Schrift", "Sie läuft von rechts nach links.", ["Sie hat genau dieselben Buchstaben wie das Deutsche.", "Sie besteht nur aus großen Buchstaben ohne Abstände."], "Viele Schriften laufen anders als unsere."],
	["Englisch", "Es ist verwandt, darum ähneln sich manche Wörter.", ["Es hat mit dem Deutschen kein einziges ähnliches Wort.", "Es wird auf der ganzen Welt nur in England gesprochen."], "Haus und house, Milch und milk sind verwandt."],
	["Herkunftssprache", "Das ist eine Sprache von zu Hause.", ["Das ist eine Sprache, die nur Erwachsene sprechen.", "Das ist immer dieselbe Sprache wie das Englische."], "Mehrere Sprachen zu können, ist eine Stärke."],
];

const COMPARE: Item[] = [
	["Haus und house, Milch und milk, Vater und father", "Die Wörter ähneln sich, weil beide Sprachen verwandt sind.", ["Die Wörter sind rein zufällig gleich, und das hat gar keinen Grund.", "Das Englische hat alle diese Wörter aus dem Bairischen übernommen."], "Verwandte Sprachen haben ähnliche Wörter."],
	["Milch und süt, Haus und ev", "Deutsch und Türkisch sind nicht verwandt.", ["Türkische Wörter sind grundsätzlich kürzer und leichter als deutsche.", "Eines der beiden Wörter ist bestimmt falsch geschrieben worden."], "Nicht alle Sprachen sind miteinander verwandt."],
	["Schule und Schui, Milch und Milli", "Bairisch und Standardsprache sind eng verwandt.", ["Bairisch ist eine ganz fremde Sprache und gar nicht mit Deutsch verwandt.", "Schui und Milli sind einfach Fehler, die man korrigieren muss."], "Dialekt und Standardsprache gehören eng zusammen."],
	["„Das ist krass!“ und „Das ist erstaunlich.“", "Beide passen, aber zu verschiedenen Situationen.", ["Nur der zweite Satz ist richtiges Deutsch, der erste ist ganz falsch.", "Beide Sätze gehören immer und überall nur in eine Zeitung."], "Jugendsprache passt zu Freunden, Standardsprache zu fremden Lesern."],
	["Blindenschrift und unsere Buchstaben", "Die eine ertastet man, die andere sieht man.", ["Blindenschrift hat mit Buchstaben und Lauten überhaupt nichts zu tun.", "Unsere Buchstaben kann man ausschließlich mit den Fingern ertasten."], "Schriften können ganz verschieden aussehen und doch dasselbe leisten."],
];

const AWARENESS: Item[] = [
	["Ein Kind in deiner Klasse spricht zu Hause Arabisch.", "Du fragst, wie man auf Arabisch schreibt und grüßt.", ["Du sagst ihm, dass es in der Schule nur Deutsch sprechen darf.", "Du lachst über die fremde Schrift und zeigst sie allen anderen."], "Andere Sprachen sind eine Chance, etwas zu entdecken."],
	["Dein Opa spricht nur Bairisch.", "Du freust dich über die Wörter und fragst nach.", ["Du verbesserst ihn jedes Mal, weil das ja falsches Deutsch ist.", "Du antwortest ihm gar nicht mehr, bis er anders spricht."], "Dialekte sind ein Schatz. Falsch sind sie nicht."],
	["Du triffst ein gehörloses Kind.", "Du schaust es an und probierst Zeichen oder Aufschreiben.", ["Du rufst besonders laut und deutlich, damit es dich sicher hört.", "Du redest nur mit den anderen Kindern über das gehörlose Kind."], "Manche Gehörlose lesen ein wenig von den Lippen ab, das ist aber schwer. Zeichen und Aufschreiben helfen."],
	["In einem Buch über Japan siehst du Schriftzeichen.", "Du überlegst, was anders ist, und schlägst nach.", ["Du sagst, dass das gar keine richtige Schrift sein kann.", "Du blätterst lachend weiter und zeigst es nie jemandem."], "Vergleichen hilft dir auch, die eigene Sprache besser zu verstehen."],
	["Dein Bruder sagt ständig „krass“.", "Unter Freunden passt das, im Brief an die Schule nicht.", ["Du denkst, dass dein Bruder einfach kein richtiges Deutsch kann.", "Du schreibst selbst überall „krass“ in deine Aufsätze."], "Du wählst die Sprache je nach Situation."],
];

const TABLE: Record<string, Record<string, string>> = {
	Mutter: { Standardsprache: "Mutter", Bairisch: "Muatta", Englisch: "mother", Türkisch: "anne" },
	Wasser: { Standardsprache: "Wasser", Bairisch: "Wossa", Englisch: "water", Türkisch: "su" },
	Milch: { Standardsprache: "Milch", Bairisch: "Milli", Englisch: "milk", Türkisch: "süt" },
	Haus: { Standardsprache: "Haus", Bairisch: "Haus", Englisch: "house", Türkisch: "ev" },
};

const LANGUAGE_NOTES: Record<string, { note: string; found?: string }> = {
	Standardsprache: { note: "So steht das Wort im Wörterbuch und in der Zeitung. Stelle eine andere Sprache ein." },
	Bairisch: { note: "Bairisch spricht man in großen Teilen Bayerns. In Franken und Schwaben klingt es wieder anders. Die Schreibung schwankt, denn Dialekt wird meist gesprochen.", found: "dialekt" },
	Englisch: { note: "Englisch und Deutsch sind verwandt. Viele Wörter sehen deshalb ähnlich aus.", found: "aehnlich" },
	Türkisch: { note: "Türkisch ist mit Deutsch nicht verwandt. Die Wörter klingen deshalb ganz anders.", found: "anders" },
};

function bridgeView(values: Record<string, string>): MachineView {
	const language = LANGUAGE_NOTES[values.sprache];
	const form = TABLE[values.wort][values.sprache];
	// Ein gleich geschriebenes Wort zeigt keinen Unterschied und zählt deshalb nicht.
	const same = form === values.wort && values.sprache !== "Standardsprache";
	const found = same ? undefined : language.found;
	return {
		display: `${values.wort} → ${form}`,
		note: same ? "Dieses Wort schreibt man hier gleich. Probiere ein anderes Wort." : language.note,
		found,
		tone: found ? "ok" : undefined,
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
	initial: { wort: "Mutter", sprache: "Standardsprache" },
	view: bridgeView,
	goals: [
		{ id: "dialekt", label: "Finde ein Wort, das im Dialekt anders aussieht.", reached: (state) => state.found.includes("dialekt") },
		{ id: "aehnlich", label: "Finde ein ähnliches Wort aus einer verwandten Sprache.", reached: (state) => state.found.includes("aehnlich") },
		{ id: "anders", label: "Finde ein Wort aus einer nicht verwandten Sprache.", reached: (state) => state.found.includes("anders") },
	],
};

const RELATED_WORDS: TypedItem[] = [
	["Schui (Bairisch)", ["Schule"], "Schui ist das bairische Wort für Schule."],
	["Milli (Bairisch)", ["Milch"], "Milli ist ein bairisches Wort für Milch."],
	["house (Englisch)", ["Haus"], "House und Haus sind verwandt."],
	["water (Englisch)", ["Wasser"], "Water und Wasser sind verwandt."],
	["father (Englisch)", ["Vater"], "Father und Vater sind verwandt."],
	["milk (Englisch)", ["Milch"], "Milk und Milch sind verwandt."],
];

const sprachen: Lesson = {
	id: "sprachen-im-umfeld",
	stage: "sprachlabor",
	title: "Sprachen um dich herum",
	skill: "Du beschreibst Gemeinsamkeiten und Unterschiede von Sprachen und Schriften in deinem Umfeld.",
	lehrplan: "D3/4 4.2: Standardsprache, Dialekte, Jugendsprache, Herkunftssprachen, Englisch, Blindenschrift, Gebärdensprache",
	bindings: ["4.2-02"],
	sticker: { emoji: "🌍", name: "Sprachenforscher" },
	paragraphs: [
		"Um dich herum gibt es viele Sprachen. Standardsprache steht in der Zeitung und im Wörterbuch. Bairisch und andere Dialekte gehören zu einer Region. Jugendliche haben ihre eigenen Wörter. Viele Kinder bringen von zu Hause eine andere Sprache mit, ihre Herkunftssprache, etwa Türkisch, Arabisch oder Polnisch, und in der Schule lernst du Englisch.",
		"Vergleichst du Sprachen, entdeckst du viel. Englisch und Deutsch sind verwandt: Haus und house, Milch und milk. Türkisch ist nicht verwandt: Milch heißt süt.",
		"Auch Schriften sind verschieden. Arabisch läuft von rechts nach links. Blindenschrift besteht aus Punkten, die man ertastet. Gebärdensprache ist keine Schrift, sondern eine eigene Sprache mit Händen, Gesicht und Körper. Keine Sprache ist besser als eine andere. Wer mehrere kann, hat etwas Besonderes.",
	],
	example: {
		title: "Tinto vergleicht das Wort „Wasser“",
		lines: [
			"Standardsprache: Wasser",
			"Bairisch: Wossa",
			"Englisch: water (ähnlich, die Sprachen sind verwandt)",
			"Türkisch: su (ganz anders, nicht verwandt)",
		],
	},
	takeaway: "Sprachen und Schriften sind verschieden und alle wertvoll. Vergleichen zeigt dir, was ähnlich ist, was anders ist und wie deine eigene Sprache funktioniert.",
	terms: [
		{ term: "Standardsprache", meaning: "die Form des Deutschen, die alle verstehen und die in Büchern steht" },
		{ term: "Dialekt", meaning: "regionale Form einer Sprache, zum Beispiel Bairisch" },
		{ term: "Herkunftssprache", meaning: "eine Sprache, die jemand von zu Hause mitbringt" },
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
			(rng) => typed(rng, "Zu welchem Wort der Standardsprache gehört dieses Wort? Schreibe es auf.", RELATED_WORDS, "Sprich das Wort laut. Woran erinnert es dich?", "verwandt"),
		],
	},
	requiredCorrect: 3,
};

export const SPRACHLABOR: Lesson[] = [wirkt, verstaendigung, muendlich, sprachen];
