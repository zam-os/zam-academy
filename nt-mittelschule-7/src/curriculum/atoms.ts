import { inspection, labs } from "../lab/definitions";
import { makeStage } from "./helpers";

export const ATOMS = makeStage(
	{
		id: "atome",
		stageNumber: 4,
		title: "Atome und Periodensystem",
		subtitle: "Modelle vergleichen, Atomkerne zählen und Elemente einordnen",
		icon: "⚛️",
		accent: "#8342a8",
		badgeTitle: "Atome und Periodensystem",
		lehrplanLabel: "NT7 · 2.2 Atommodelle und Aufbau der Materie",
	},
	"2.2",
	2,
	[
		{
			id: "atommodelle",
			title: "Wie Atommodelle sich verändern",
			subtitle:
				"Vergleiche Demokrit, Dalton und Rutherford mit ihren jeweiligen Fragen.",
			text: [
				"Demokrit dachte sich die Materie aus kleinsten, unteilbaren Teilchen. Das war eine philosophische Vorstellung. Dalton beschrieb Atome verschiedener Elemente als Kugeln mit elementtypischer Masse. Sein Modell erklärt feste Zahlenverhältnisse in Verbindungen, lässt aber inneren Aufbau offen.",
				"Beim Streuversuch nach Rutherford gingen die meisten zum Beschuss verwendeten Teilchen fast gerade durch dünne Goldfolie. Wenige wurden stark abgelenkt. Das passt zu einem sehr kleinen, positiv geladenen Kern in einer großen Hülle. Das Kern-Hülle-Modell erklärt die Streuung, liefert aber noch keine genaue Beschreibung der Elektronenverteilung.",
			],
			rule: "Ein Modell erklärt ausgewählte Beobachtungen. Passen neue Beobachtungen nicht dazu, kann ein genaueres Modell nötig sein.",
			quiz: [
				"Welche Beobachtung spricht für einen kleinen dichten Kern?",
				"Wenige Teilchen werden stark abgelenkt, die meisten kaum.",
				"Alle Teilchen bleiben in der Folie stecken.",
				"Jedes Teilchen wird an der gleichen Stelle abgelenkt.",
				"Ein kleiner Kern beeinflusst wenige vorbeifliegende Teilchen sehr stark.",
			],
			practice: [
				[
					[
						"Worauf beruhte die Atomidee Demokrits?",
						"Auf philosophischer Überlegung",
						"Auf einem Streuversuch",
						"Auf einer Aufnahme von Elektronen",
						"Demokrit formulierte eine Vorstellung über teilbare Materie.",
					],
					[
						"Warum reicht Demokrits Idee allein als Erklärung eines Versuchs nicht aus?",
						"Sie liefert keine überprüfte Aussage darüber, wie die Teilchen aufgebaut sind.",
						"Sie zeigt bereits einzelne Protonen.",
						"Sie beruht auf Messungen von Elektronenhüllen.",
						"Eine Idee allein erklärt erst mit überprüfbaren Aussagen die Versuchsdaten.",
					],
				],
				[
					[
						"Was erklärt Daltons Kugelmodell?",
						"Feste Teilchenverhältnisse in Verbindungen",
						"Die Ladung und Größe des Kerns",
						"Die Zahl besetzter Schalen",
						"Kugeln werden im Modell in festen Anzahlen verbunden.",
					],
					[
						"Warum blieb Daltons Modell trotz späterer Entdeckungen nützlich?",
						"Stoffverhältnisse lassen sich damit weiterhin anschaulich machen.",
						"Es beschreibt den Kern genauer als moderne Modelle.",
						"Ein Modell muss jede Beobachtung erklären.",
						"Ein einfaches Modell kann für einen begrenzten Zweck geeignet sein.",
					],
				],
				[
					[
						"Welche Aussage macht Rutherford über den Kern?",
						"Er ist sehr klein und positiv geladen.",
						"Er füllt fast den ganzen Durchmesser aus.",
						"Er besteht aus Elektronen.",
						"Die Streuung weist auf eine kleine konzentrierte positive Ladung hin.",
					],
					[
						"Welche Beobachtung erfasst das Kugelmodell ohne Kern schlecht?",
						"Die starken Ablenkungen einzelner Teilchen im Goldfolienversuch.",
						"Ein festes Zahlenverhältnis in Wasser.",
						"Dass Stoffe aus Teilchen bestehen.",
						"Für starke einzelne Ablenkungen ist konzentrierte Ladung bedeutsam.",
					],
				],
			],
			lab: inspection(
				"history",
				"Drei Modelle und ihre Reichweite",
				"Wechsle zwischen Atomvorstellungen. Suche jeweils heraus, was die Darstellung erklären kann.",
				[
					"Finde die philosophische Vorstellung unteilbarer Teilchen.",
					"Finde das Modell für feste Teilchenverhältnisse.",
					"Finde das Modell, das die seltene starke Ablenkung erklärt.",
				],
			),
		},
		{
			id: "kern-huelle",
			title: "Ein kleiner Kern in einer großen Hülle",
			subtitle: "Ordne Teilchen zum Kern oder zur Hülle und vergleiche Größen.",
			text: [
				"Protonen sind positiv, Neutronen elektrisch neutral und Elektronen negativ. Protonen und gegebenenfalls Neutronen bilden den Atomkern. Die Elektronen gehören zur Atomhülle. Fast die ganze Masse sitzt im sehr kleinen Kern. Der größte Teil des Atomdurchmessers gehört zur Hülle.",
				"Stell dir ein ungefähr 100 m breites Atom vor. Bei einem Durchmesserverhältnis von etwa 100 000 zu 1 wäre der Kern ungefähr 1 mm breit. Das Verhältnis ist eine Größenordnung. Verschiedene Atome und Kerne haben unterschiedliche Abmessungen.",
			],
			rule: "Im Kern sitzen Protonen und gegebenenfalls Neutronen. Die Elektronen bilden die Hülle.",
			quiz: [
				"Welches Teilchen gehört zur Hülle?",
				"Elektron",
				"Proton",
				"Neutron",
				"Elektronen tragen negative Ladung und befinden sich in der Hülle.",
			],
			practice: [
				[
					[
						"Wo steckt fast die gesamte Masse eines Atoms?",
						"Im Kern",
						"In der Luft um das Atom",
						"Gleich verteilt über die Hülle",
						"Protonen und Neutronen sind viel schwerer als Elektronen.",
					],
					[
						"In einem Bild erscheinen Kern und Atom fast gleich groß. Woran musst du denken?",
						"Der Kern ist zur Verdeutlichung stark vergrößert.",
						"Das Größenverhältnis gilt für alle Atome.",
						"Elektronen sind in Wirklichkeit größer als das Atom.",
						"Schemata verändern oft den Maßstab, damit du kleine Teile sehen kannst.",
					],
				],
				[
					[
						"Welche Ladung hat ein Proton?",
						"Positiv",
						"Negativ",
						"Keine",
						"Die Protonen bestimmen die positive Kernladung.",
					],
					[
						"Ein Heliumkern enthält zwei Protonen und zwei Neutronen. Warum ist er positiv?",
						"Die Protonen sind positiv, die Neutronen neutral.",
						"Die Neutronen sind negativ und schwerer.",
						"Die Elektronen im Kern überwiegen.",
						"Die neutralen Neutronen ändern die Kernladung nicht.",
					],
				],
				[
					[
						"Welches Teilchen hat keine elektrische Ladung?",
						"Neutron",
						"Elektron",
						"Proton",
						"Neutronen sind elektrisch neutral.",
					],
					[
						"Das gedachte Atom ist 10 m breit. Was entspricht bei 100 000 zu 1 etwa dem Kern?",
						"0,1 mm",
						"10 cm",
						"1 m",
						"10 m sind 10 000 mm. Teile durch 100 000.",
						[0.1, "mm", 1],
					],
				],
			],
			lab: labs.atom,
		},
		{
			id: "isotope",
			title: "Protonen, Neutronen und Elektronen zählen",
			subtitle: "Nutze Ordnungszahl und Massenzahl für neutrale Atome.",
			text: [
				"Die Ordnungszahl Z findest du am Elementsymbol im Periodensystem. Sie gibt die Zahl der Protonen an und legt das Element fest. Im neutralen Atom ist die Anzahl der Elektronen gleich der der Protonen. Die Massenzahl A zählt Protonen und Neutronen zusammen. Die Massenzahl muss für das ausgewählte Isotop angegeben sein. Die oft gebrochene mittlere Atommasse im Periodensystem ist eine andere Angabe.",
				"Kohlenstoff hat Z = 6. Kohlenstoff–12 hat sechs Protonen und 12 − 6 = 6 Neutronen. Kohlenstoff–13 hat ebenfalls sechs Protonen, aber sieben Neutronen. Die beiden sind Isotope desselben Elements.",
			],
			rule: "Protonen = Z. Neutronen = A − Z. Für neutrale Atome gilt Elektronen = Z.",
			quiz: [
				"Was bleibt bei Isotopen eines Elements gleich?",
				"Die Anzahl der Protonen",
				"Die Anzahl der Neutronen",
				"Die Massenzahl",
				"Die Protonenzahl legt das Element fest.",
			],
			practice: [
				[
					[
						"Wie viele Protonen hat Sauerstoff mit Z = 8?",
						"Acht",
						"Sechzehn",
						"Vier",
						"Z gibt direkt die Protonenzahl an.",
					],
					[
						"Zwei Atome haben beide A = 14. Eines hat sechs, das andere sieben Protonen. Sind es Isotope desselben Elements?",
						"Nein, ihre Protonenzahlen sind verschieden.",
						"Ja, dieselbe Massenzahl bedeutet dasselbe Element.",
						"Ja, beide müssen dieselbe Neutronenzahl haben.",
						"Elemente werden durch Z bestimmt, unabhängig von A.",
					],
				],
				[
					[
						"Wie viele Neutronen hat Natrium–23 mit Z = 11?",
						"Zwölf",
						"Elf",
						"Dreiundzwanzig",
						"Ziehe 11 von 23 ab.",
						[12, "", 0],
					],
					[
						"Du kennst nur die Ordnungszahl. Kannst du daraus die Neutronenzahl des Atoms bestimmen?",
						"Erst wenn auch das Isotop oder seine Massenzahl bekannt ist.",
						"Ja, sie ist immer gleich Z.",
						"Ja, sie ist stets doppelt so groß wie Z.",
						"Isotope unterscheiden sich in der Neutronenzahl.",
					],
				],
				[
					[
						"Wie viele Elektronen hat ein neutrales Aluminiumatom mit Z = 13?",
						"Dreizehn",
						"Vierzehn",
						"Siebenundzwanzig",
						"Die Ladungen von Elektronen und Protonen gleichen sich im neutralen Atom aus.",
					],
					[
						"Ein neutrales Atom enthält 8 Protonen und 10 Neutronen. Welche Zahlen passen?",
						"Z = 8 und A = 18",
						"Z = 10 und A = 18",
						"Z = 18 und A = 8",
						"Z zählt Protonen. A zählt die beiden Arten von Kernteilchen zusammen.",
					],
				],
			],
			lab: labs.isotopes,
		},
		{
			id: "periodensystem",
			title: "Elemente im Periodensystem finden",
			subtitle:
				"Lies Gruppen und Perioden und verbinde Eigenschaften mit Verwendungen.",
			text: [
				"Die Elemente stehen nach steigender Ordnungszahl im Periodensystem. Die waagerechten Zeilen heißen Perioden. Senkrechte Spalten heißen Gruppen. Metalle stehen überwiegend links und in der Mitte. Nichtmetalle findest du vor allem rechts oben und als Sonderfall Wasserstoff links oben. Edelgase bilden als besondere Nichtmetalle die Gruppe ganz rechts.",
				"Aluminium ist ein leichtes Metall für Fahrradrahmen. Natrium ist ein reaktionsfreudiges Metall. Natriumdampf wird in manchen Leuchten genutzt. Elementares Fluor und Chlor sind reaktionsfreudige Nichtmetalle. Fluoride in Zahnpasta sind Verbindungen bzw. Ionen mit Fluor und haben andere Eigenschaften als elementares Fluor. Chlor dient unter anderem zur Kunststoffherstellung. Helium füllt Ballons, Neon erzeugt in geeigneten Entladungsröhren rotoranges Licht.",
			],
			rule: "Lies Perioden waagerecht und Gruppen senkrecht. Die Ordnungszahl ist die Zahl der Protonen.",
			quiz: [
				"Wo stehen die Edelgase?",
				"Ganz rechts in Gruppe 18",
				"Alle in Periode 3",
				"Links in Gruppe 1",
				"Edelgase bilden die äußerste rechte Spalte.",
			],
			practice: [
				[
					[
						"Welche Bezeichnung hat eine Zeile im Periodensystem?",
						"Periode",
						"Gruppe",
						"Isotop",
						"Perioden verlaufen waagerecht.",
					],
					[
						"Fluor und Chlor stehen untereinander. Was bedeutet das?",
						"Sie gehören zur gleichen Gruppe und zu verschiedenen Perioden.",
						"Sie haben dieselbe Ordnungszahl.",
						"Sie gehören nur deshalb zusammen, weil beide in derselben Periode stehen.",
						"Eine Spalte bleibt dieselbe Gruppe beim Wechsel der Zeile.",
					],
				],
				[
					[
						"Welches Material ist ein Metall?",
						"Aluminium",
						"Chlor",
						"Neon",
						"Aluminium ist ein leichtes Metall.",
					],
					[
						"Warum eignet sich Helium als Ballongas?",
						"Es ist leichter als Luft und reagiert unter Alltagsbedingungen kaum.",
						"Es ist ein sehr schweres Metall.",
						"Es bildet in Luft schnell neue brennbare Stoffe.",
						"Die geringe Dichte und Reaktionsträgheit sind für die Anwendung wichtig.",
					],
				],
				[
					[
						"Welche Ordnungszahl hat Natrium im Ausschnitt?",
						"Elf",
						"Drei",
						"Achtzehn",
						"Die kleine Zahl im Kästchen steht für die Protonenzahl.",
					],
					[
						"Fluoride in Zahnpasta enthalten Fluor. Haben sie dieselben Eigenschaften wie elementares Fluor?",
						"Nein, Stoffe mit Fluor können andere Eigenschaften haben als das Element.",
						"Ja, das Elementsymbol bestimmt alle Stoffeigenschaften.",
						"Ja, weil alle Fluorstoffe Edelgase sind.",
						"Die Eigenschaften einer Verbindung unterscheiden sich oft von denen des Elements.",
					],
				],
			],
			lab: labs.periodic,
		},
		{
			id: "energiestufen",
			title: "Elektronen, Schalen und Edelgase",
			subtitle:
				"Verknüpfe das Energiestufenmodell mit Perioden und Außenelektronen.",
			tracks: ["M"],
			text: [
				"Im Energiestufenmodell verteilst du Elektronen auf Schalen. Für die ersten 18 Elemente füllst du innen zuerst 2, dann bis zu 8 und für diesen Ausschnitt in der dritten Schale bis zu 8 Elektronen. Die Schalen stehen für Energiestufen. Die Kreise bedeuten keine festen Umlaufbahnen. Die Periodennummer zeigt beim neutralen Atom im Grundzustand die Zahl besetzter Schalen.",
				"Neon hat 2 und 8 Elektronen. Natrium hat 2, 8 und 1 und beginnt Periode 3. Edelgasatome reagieren unter normalen Bedingungen selten. Bei Neon und Argon ist die äußerste Schale mit acht Elektronen voll. Helium ist schon mit zwei Elektronen in der ersten Schale ganz gefüllt. Viele Atome können bei Reaktionen eine Edelgaskonfiguration erreichen. Das ist die Oktettregel mit der Zweier-Ausnahme für die erste Schale.",
			],
			rule: "Bei den Hauptgruppen außer Helium wiederholt sich die Zahl der Außenelektronen in einer Spalte. Eine volle Außenschale erklärt die Reaktionsträgheit der Edelgase.",
			quiz: [
				"Warum gilt die Zahl acht für Helium nicht?",
				"Seine einzige Schale ist mit zwei Elektronen gefüllt.",
				"Seine Hülle enthält keine Elektronen.",
				"Sein Kern ersetzt die äußere Schale.",
				"In die erste Schale passen nur zwei Elektronen.",
			],
			practice: [
				[
					[
						"Wie verteilen sich zehn Elektronen beim neutralen Neonatom?",
						"2 und 8",
						"8 und 2",
						"2, 6 und 2",
						"Beginne mit zwei Elektronen in der innersten Schale.",
					],
					[
						"Natrium (Z = 11) folgt auf Neon (Z = 10). Warum beginnt eine neue Periode?",
						"Das weitere Elektron besetzt die nächste Energiestufe.",
						"Die Ordnungszahl beginnt wieder bei eins.",
						"Beim folgenden Element verschwindet die äußerste Schale.",
						"Zwei Schalen sind bei Neon im Modell voll.",
					],
				],
				[
					[
						"Was zeigt die Periodennummer in diesem Modell?",
						"Die Anzahl besetzter Schalen",
						"Die Neutronenzahl",
						"Die Zahl der Außenelektronen",
						"Eine neue Periode beginnt mit der Besetzung einer neuen Schale.",
					],
					[
						"Fluor hat 2, 7 und Chlor 2, 8, 7 Elektronen. Was bringt beide in eine Gruppe?",
						"Beide haben sieben Außenelektronen.",
						"Beide haben gleich viele Schalen.",
						"Beide haben gleich viele Protonen.",
						"Bei diesen Hauptgruppenelementen passt die Zahl der Außenelektronen zur Gruppe.",
					],
				],
				[
					[
						"Was macht Neon im Alltag reaktionsträge?",
						"Eine volle Außenschale",
						"Ein ungeladener Kern ohne Protonen",
						"Eine leere Elektronenhülle",
						"Die besetzte Außenschale bleibt unter normalen Bedingungen stabil.",
					],
					[
						"Zwei Atome zeigen 2, 8, 7 und 2, 8, 8 Elektronen. Welches passt zum Edelgas?",
						"Das Atom mit 2, 8, 8",
						"Das Atom mit 2, 8, 7",
						"Beide, weil die innere Schale gleich ist.",
						"Entscheidend ist hier die äußere Schale, nicht die innere.",
					],
				],
			],
			lab: labs.shells,
		},
	],
);
