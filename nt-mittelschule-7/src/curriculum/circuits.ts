import { physicsLabs } from "../lab/physics-models";
import { makeStage } from "./helpers";

export const CIRCUITS = makeStage(
	{
		id: "strom",
		stageNumber: 9,
		title: "Spannung und Stromstärke",
		subtitle: "Elektrische Wirkungen, Schaltzeichen und Messgeräte",
		icon: "💡",
		accent: "#875e12",
		badgeTitle: "Stromkreise untersucht",
		lehrplanLabel: "NT7 · 4.1 Elektrische Spannung und Stromstärke",
	},
	"4.1",
	4,
	[
		{
			id: "stromwirkungen",
			title: "Was elektrischer Strom bewirken kann",
			subtitle:
				"Erkläre Licht, Wärme, Bewegung und chemische Vorgänge aus Energieumwandlung.",
			text: [
				"Strömt elektrische Ladung durch ein Gerät, kann elektrische Energie in andere Energieformen übergehen. Eine Lampe gibt Strahlungsenergie als Licht und auch Wärme ab. Ein Heizdraht erwärmt sich. Ein Motor setzt Teile in Bewegung. Beim Laden eines Akkus wird ein Teil der zugeführten Energie als chemische Energie gespeichert.",
				"Eine Taschenlampe mit Akku verbindet zwei Schritte. Beim Laden wird Energie im Akku gespeichert. Beim Leuchten gibt die Lampe Strahlung und Wärme ab. Bei manchen chemischen Vorgängen kann Strom Stoffe umwandeln, etwa wenn Wasser in einem beaufsichtigten Schulversuch zerlegt wird. Das knüpft an das Wassermodell aus Klasse 6 an.",
			],
			rule: "Elektrische Energie kann sich in Licht, Wärme, Bewegung oder chemische Energie umwandeln.",
			quiz: [
				"Was wird beim Laden eines Akkus gespeichert?",
				"Chemische Energie",
				"Nur hörbarer Schall",
				"Bewegungsenergie eines Rotors",
				"Im Akku ändern sich Stoffe. So wird chemische Energie gespeichert.",
			],
			practice: [
				[
					[
						"Welche Wirkung ist beim Heizdraht erwünscht?",
						"Erwärmung",
						"Abkühlung ohne Energieabgabe",
						"Licht als einzige Wirkung",
						"Der Heizdraht wandelt elektrische Energie vor allem in Wärme um.",
					],
					[
						"Warum kann die Lampe warm werden, obwohl sie Licht liefern soll?",
						"Sie gibt einen Teil der Energie als Wärme ab.",
						"Licht schaltet Wärmewirkung grundsätzlich aus.",
						"Wärme stammt nur von einer zweiten Batterie.",
						"Mehr als eine Energieform kann entstehen.",
					],
				],
				[
					[
						"Welche Energieform ist beim Motor als Nutzwirkung wichtig?",
						"Bewegungsenergie",
						"Chemische Energie eines geladenen Akkus",
						"Nur Strahlungsenergie",
						"Der Motor setzt etwas in Bewegung.",
					],
					[
						"Ein batteriebetriebener Ventilator dreht sich und brummt etwas. Welche zusätzlich abgegebene Energieform hörst du?",
						"Schall",
						"Chemische Energie",
						"Nur gespeicherte elektrische Energie",
						"Das Geräusch zeigt Schall als weitere Energieabgabe.",
					],
				],
				[
					[
						"Was ist beim Laden des Akkus die erwünschte Energieform am Ende?",
						"Chemische Energie",
						"Wärme allein",
						"Strahlung",
						"Chemische Veränderungen speichern einen Teil der Energie.",
					],
					[
						"In einem Schulmodell entstehen beim Stromfluss aus Wasser neue Stoffe. Welche Wirkung passt?",
						"Eine chemische Wirkung",
						"Nur eine magnetische Wirkung",
						"Nur ein Wechsel des Aggregatzustands",
						"Die Bildung neuer Stoffe kennzeichnet eine chemische Veränderung.",
					],
				],
			],
			lab: physicsLabs.effects,
		},
		{
			id: "stromkreis",
			title: "Damit die Lampe leuchtet",
			subtitle: "Lies einen einfachen Schaltplan und finde zwei Fehlerquellen.",
			text: [
				"Im einfachen Stromkreis verbinden Leitungen eine Spannungsquelle, eine Lampe und einen Schalter. Im Schaltplan steht die Linie für den Leiter, der Kreis mit Kreuz für die Lampe und das Strichpaar für die Quelle. Ein offener Schalter unterbricht den Weg. Auch eine beschädigte Leitung kann die Verbindung unterbrechen.",
				"Elektronen in Metallleitern sind schon vorhanden. Bei geschlossenem Kreis treibt die elektrische Spannung den Strom an. Die Stromstärke gibt an, wie viel Ladung pro Zeit an einer Stelle vorbeifließt. Im unverzweigten stationären Kreis fließt an jeder Stelle gleich viel Strom. Die technische Stromrichtung zeigt im äußeren Stromkreis vom Plus- zum Minuspol. Elektronen bewegen sich entgegengesetzt.",
			],
			rule: "Strom braucht einen geschlossenen Weg. Spannung treibt ihn an, Stromstärke misst Ladungsfluss pro Zeit.",
			quiz: [
				"Was prüfst du, wenn ein geschlossener Schalter die Lampe nicht zum Leuchten bringt?",
				"Ob auch die übrigen Verbindungen durchgehend sind.",
				"Ob im Schaltplan eine gestrichelte Linie die Leitung ersetzt.",
				"Ob die Stromrichtung in beiden Leitungen gleich nach oben zeigt.",
				"Ein Bruch an jeder Stelle kann den Kreis unterbrechen.",
			],
			practice: [
				[
					[
						"Welches Schaltzeichen steht im Modell für die Lampe?",
						"Kreis mit Kreuz",
						"Zwei verschieden lange Striche",
						"Eine schräge abgehobene Linie",
						"Die anderen Zeichen stehen für Spannungsquelle und Schalter.",
					],
					[
						"Der Schalter liegt hinter der Lampe. Unterbricht er den Strom ebenfalls?",
						"Ja, jede Unterbrechung im einzigen Weg stoppt den Strom.",
						"Nur vor der Lampe wirkt er.",
						"Die Lampe liefert nach dem Schalter neuen Strom.",
						"Im unverzweigten Kreis liegen alle Bauteile auf einem Stromweg.",
					],
				],
				[
					[
						"Was bezeichnet Stromstärke?",
						"Ladung, die pro Zeit vorbeifließt",
						"Die von der Quelle abgegebene Wärme",
						"Die Länge der Leitung",
						"Stromstärke ist eine Flussgröße.",
					],
					[
						"Vor und hinter einer Lampe in Reihe wird gemessen. Ist der Strom hinter der Lampe kleiner?",
						"An beiden Stellen fließt gleich viel stationärer Strom.",
						"Die Lampe verbraucht einen Teil des Stroms.",
						"Der Strom nimmt in der Leitung nach jedem Bauteil zu.",
						"Die Lampe wandelt Energie um. Im Kreis fließt gleich viel Ladung je Zeit durch alle Stellen.",
					],
				],
				[
					[
						"Was treibt den Ladungsfluss im geschlossenen Kreis an?",
						"Die elektrische Spannung",
						"Der Name des Schalters",
						"Die eingezeichnete Pfeilfarbe",
						"Die Spannungsquelle sorgt für den Antrieb.",
					],
					[
						"Ein Förderband transportiert Gegenstände. Warum passt es nur teilweise als Strommodell?",
						"Ein geschlossener Fluss lässt sich darstellen. Die elektrische Spannung und Teilchenbewegung sind vereinfacht.",
						"Die Gegenstände sind bereits echte Elektronen.",
						"Das Band stellt jede Wirkung des Stroms maßstäblich dar.",
						"Ein Modell hebt ausgewählte Eigenschaften hervor.",
					],
				],
			],
			lab: physicsLabs.circuit,
		},
		{
			id: "messgeraete",
			title: "Strom und Spannung richtig messen",
			subtitle: "Setze die Messgeräte an die richtige Stelle im Schaltplan.",
			text: [
				"Die elektrische Stromstärke I misst du in Ampere (A). Ein Strommessgerät wird in Reihe in den zu messenden Stromweg eingebaut. Die elektrische Spannung U misst du in Volt (V). Ein Spannungsmessgerät wird parallel an die beiden Punkte angeschlossen, zwischen denen du die Spannung suchst.",
				"Im Modell liegen an der Lampe 6 V an und es fließen 100 mA. Das sind 0,1 A. Der Strommesswert gehört zum Lampenzweig. Die Spannung gehört zwischen die beiden Lampenanschlüsse. Ampere erinnert an André-Marie Ampère, Volt an Alessandro Volta. Messungen mit echten Geräten bleiben beaufsichtigte Schulversuche an passenden Spannungsquellen.",
			],
			rule: "Amperemeter in Reihe. Voltmeter zwischen zwei Messpunkten, parallel zum Bauteil.",
			quiz: [
				"Wo misst du die Spannung an einer Lampe?",
				"Zwischen den beiden Anschlüssen parallel zur Lampe",
				"Nur an einem Lampenanschluss",
				"In Reihe in einer Leitung",
				"Spannung ist eine Größe zwischen zwei Messpunkten.",
			],
			practice: [
				[
					[
						"Welche Einheit gehört zu I?",
						"Ampere",
						"Volt",
						"Ohm",
						"I steht für die Stromstärke.",
					],
					[
						"Das Amperemeter soll messen, wie viel Strom durch einen Lampenzweig fließt. Wo gehört es hin?",
						"In Reihe in den Lampenzweig",
						"Parallel direkt an die Spannungsquelle",
						"In einen unverbundenen zweiten Zweig",
						"Die zu messende Ladung fließt durch das Messgerät.",
					],
				],
				[
					[
						"Welche Einheit gehört zu U?",
						"Volt",
						"Ampere",
						"Ohm",
						"U steht für die Spannung.",
					],
					[
						"Ein Messprotokoll nennt 100 mA. Wie lautet dieser Wert in A?",
						"0,1 A",
						"1 A",
						"10 A",
						"1000 mA sind 1 A. Teile durch 1000.",
						[0.1, "A", 1],
					],
				],
				[
					[
						"Welche Buchstaben stehen im Schaltplan auf den Messgeräten?",
						"A für Strom, V für Spannung",
						"V für Strom, A für Spannung",
						"R für Strom, A für Spannung",
						"Die Zeichen folgen den Namen ihrer Einheiten.",
					],
					[
						"Ein Voltmeter wurde in den einzigen Strompfad eingesetzt. Wie muss der Plan für die Lampenspannung aussehen?",
						"Der Lampenstrompfad ist geschlossen, und das Voltmeter verbindet die beiden Lampenanschlüsse.",
						"Das Voltmeter bleibt in dem einzigen Strompfad.",
						"Es genügt, nur einen Prüfanschluss zu verbinden.",
						"Miss den Spannungsunterschied zwischen zwei Punkten.",
					],
				],
			],
			lab: physicsLabs.meters,
		},
		{
			id: "parallelkreise",
			title: "Wie sich der Strom an einem Knoten verteilt",
			subtitle:
				"Vergleiche Reihen- und Parallelschaltung sowie Knoten- und Maschenregel.",
			tracks: ["M"],
			text: [
				"In einer Reihenschaltung gibt es einen Stromweg. Die Stromstärke ist überall gleich. Die Teilspannungen in einer geschlossenen Masche addieren sich zur Quellspannung, wenn du die Richtung passend berücksichtigst. In einer Parallelschaltung teilen sich die Zweige am Knoten. Die Stromstärke vor der Verzweigung ist gleich der Summe der Zweigströme. Zwischen den gleichen beiden Knoten liegt an jedem Zweig die gleiche Spannung.",
				"Bei zwei gleichen Lampenzweigen an einer idealen 6-V-Quelle liegen an beiden Lampen 6 V. Fließen 100 mA durch jeden Zweig, sind es vor der Verzweigung 200 mA. Wird ein Zweig geöffnet, bleibt der andere in diesem Modell bei 100 mA. In Reihe würde ein offener Schalter den einzigen Weg unterbrechen.",
			],
			rule: "Knoten: Stromstärken der Zweige addieren. Masche in Reihe: Teilspannungen addieren. Parallele Zweige haben dieselbe Spannung.",
			quiz: [
				"Was gilt bei zwei parallelen Zweigen zwischen denselben Knoten?",
				"An beiden liegt dieselbe Spannung.",
				"Beide haben unabhängig vom Widerstand stets denselben Strom.",
				"Beide teilen die Spannung immer zur Hälfte.",
				"Die beiden Endpunkte der Zweige sind gleich. Deshalb ist auch die Spannung gleich.",
			],
			practice: [
				[
					[
						"Vor einem Knoten fließen 200 mA, im Zweig A 100 mA. Wie viel fließt im Zweig B?",
						"100 mA",
						"200 mA",
						"300 mA",
						"Ziehe den Strom von Zweig A vom Gesamtstrom ab.",
						[100, "mA", 0],
					],
					[
						"Zwei ungleiche Zweige führen 40 mA und 130 mA. Wie groß ist der Gesamtstrom?",
						"170 mA",
						"90 mA",
						"85 mA",
						"Addiere die beiden Zweigströme.",
						[170, "mA", 0],
					],
				],
				[
					[
						"An zwei Bauteilen in Reihe fallen 2 V und 4 V ab. Wie groß ist im idealen Kreis die Quellspannung?",
						"6 V",
						"4 V",
						"2 V",
						"Addiere die beiden Teilspannungen der Masche.",
						[6, "V", 0],
					],
					[
						"Eine ideale Quelle liefert 9 V. An der ersten Lampe in Reihe misst du 4 V. Welche Spannung bleibt an der zweiten?",
						"5 V",
						"9 V",
						"13 V",
						"Die Summe der Teilspannungen ist 9 V.",
						[5, "V", 0],
					],
				],
				[
					[
						"Was passiert mit der zweiten Lampe beim Öffnen eines parallelen Zweigs?",
						"Sie kann weiterleuchten, weil ihr Weg geschlossen bleibt.",
						"Sie erlischt stets mit.",
						"Sie erhält die doppelte Spannung.",
						"Der zweite Zweig hat einen eigenen vollständigen Stromweg.",
					],
					[
						"Du willst die Spannung in Zweig B und den Gesamtstrom erfassen. Wo misst du?",
						"Voltmeter an den beiden Knoten, Amperemeter in Reihe vor der Verzweigung.",
						"Voltmeter in Reihe in B, Amperemeter parallel an der Quelle.",
						"Beide Messgeräte in Reihe hinter nur einer Lampe.",
						"Die Spannung liegt zwischen den Knoten an. Der Gesamtstrom fließt durch die gemeinsame Leitung.",
					],
				],
			],
			lab: physicsLabs.parallel,
		},
	],
);
