import type { Lesson } from "../model/types";

export const LESSONS_LB4_LB6: ReadonlyArray<Lesson> = [
	{
		id: "zeitreise-und-quellen",
		number: 14,
		stageId: "lb4",
		lb: 4,
		sectionCode: "HSU 3/4 · LB 4.1 & 4.2",
		title: "Zeitreise, Zeitleiste & historische Quellen",
		shortTitle: "Zeitleiste & Quellen",
		icon: "⏳",
		hook: "Woher wissen wir heute, wie Kinder vor 200 Jahren in deinem Ort gelebt haben – und warum liegt das Jahr 1835 im 19. Jahrhundert?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon Tagesablauf, Wochentage, Monate, Jahreszeiten und deine eigene Familiengeschichte.",
		storyParagraphs: [
			"Um uns in der Geschichte zurechtzufinden, ordnen wir Ereignisse in Vergangenheit, Gegenwart und Zukunft ein und nutzen feste Zeiträume: Ein Jahr hat 12 Monate, ein Jahrzehnt dauert 10 Jahre, ein Jahrhundert 100 Jahre und ein Jahrtausend 1 000 Jahre. Große geschichtliche Abschnitte wie Mittelalter oder Neuzeit nennen wir Epochen. Beim Jahrhundert musst du aufpassen: Das 1. Jahrhundert reicht von Jahr 1 bis 100. Deshalb gehören die Jahre 1801 bis 1900 schon zum 19. Jahrhundert und das Jahr 2026 zum 21. Jahrhundert!",
			"Auf einer Zeitleiste trägst du Ereignisse aus deinem Wohnort der Reihe nach mit gleichem Maßstab ein – zum Beispiel die erste Urkunde des Ortes im Mittelalter, den Bau der alten Brücke, die erste deutsche Eisenbahn zwischen Nürnberg und Fürth im Jahr 1835 oder die Eröffnung deiner Grundschule.",
			"Alles, woraus wir etwas über die Vergangenheit erfahren, heißt historische Quelle. Wir unterscheiden vier Arten: Sachquellen (Gegenstände und Bauwerke wie Münzen, Werkzeuge oder Burgen), Bildquellen (Gemälde, Stiche, alte Fotos), Textquellen (Urkunden, Briefe, Chroniken, Zeitungen) und mündliche Quellen durch Zeitzeuginnen und Zeitzeugen. Museen bewahren vor allem Sach- und Bildquellen geschützt auf und erklären sie; Archive sichern empfindliche Urkunden, Akten und alte Zeitungen.",
		],
		factCards: [
			{
				icon: "📏",
				title: "Jahrhundert-Trick",
				text: "1 bis 100 = 1. Jh., 1801 bis 1900 = 19. Jh., 2001 bis 2100 = 21. Jh. Bei glatten Hundertern wie 1900 bleibt es noch das 19. Jahrhundert!",
			},
			{
				icon: "🏺",
				title: "Vier Quellenarten",
				text: "Sachquellen (Gegenstände/Bauten), Bildquellen (Fotos/Gemälde), Textquellen (Urkunden/Briefe) und Zeitzeugenberichte.",
			},
			{
				icon: "🏛️",
				title: "Quellen kritisch prüfen",
				text: "Jede Quelle hat Grenzen: Ein Gemälde verschönert manchmal die Wirklichkeit, und Erinnerungen können nach Jahrzehnten verblassen.",
			},
		],
		workedExample: {
			title: "Dachbodenfund im alten Schulhaus",
			scenario:
				"Beim Umbau des alten Schulhauses findet eine Klasse eine Schiefertafel mit Griffel, ein Klassenfoto von 1924 und das Tagebuch einer Lehrerin.",
			steps: [
				"Wir ordnen das Jahr 1924 ein: Es liegt zwischen 1901 und 2000 – also im 20. Jahrhundert.",
				"Wir bestimmen die Quellenarten: Die Schiefertafel ist eine Sachquelle, das Foto eine Bildquelle und das Tagebuch eine Textquelle.",
				"Wir sichern die Funde: Das Heimatmuseum stellt die Schiefertafel aus, das Gemeindearchiv lagert das empfindliche Papier trocken und lichtgeschützt.",
			],
			conclusion:
				"Erst wenn man mehrere Quellenarten kombiniert und schützt, entsteht ein verlässliches Bild der Ortsgeschichte.",
		},
		merksatz:
			"Jahrzehnt (10 Jahre), Jahrhundert (100 Jahre) und Jahrtausend (1 000 Jahre) gliedern die Zeit. Sach-, Bild-, Textquellen und Zeitzeugen sind die Grundlage unseres Geschichtswissens; Museen und Archive bewahren sie für die Zukunft.",
		probenWissen: [
			{
				term: "Zeiträume",
				definition:
					"Jahr (12 Monate), Jahrzehnt (10 Jahre), Jahrhundert (100 Jahre), Jahrtausend (1 000 Jahre), Epoche (großer Geschichtsabschnitt).",
			},
			{
				term: "Sach-, Bild- & Textquelle",
				definition:
					"Gegenstände/Gebäude (Sachquelle), Fotos/Gemälde (Bildquelle), Urkunden/Briefe/Zeitungen (Textquelle) sowie Berichte von Zeitzeugen.",
			},
			{
				term: "Grenzen von Quellen",
				definition:
					"Quellen sind oft unvollständig oder zeigen nur die Sichtweise einer Person; deshalb vergleicht man mehrere Quellen.",
			},
			{
				term: "Museum & Archiv",
				definition:
					"Das Museum bewahrt und zeigt anschauliche Fundstücke; das Archiv schützt schriftliche Dokumente wie Urkunden, Karten und Zeitungen.",
			},
		],
		realWorldQuest:
			"Frage deine Großeltern oder ältere Nachbarn als Zeitzeugen: Wie sah ihr Klassenzimmer aus, womit haben sie geschrieben und was spielten sie in der Pause?",
		quickCheck: {
			question:
				"Am 7. Dezember 1835 fuhr der ‚Adler‘ als erste deutsche Eisenbahn von Nürnberg nach Fürth. In welchem Jahrhundert war das?",
			options: [
				"Im 18. Jahrhundert.",
				"Im 19. Jahrhundert.",
				"Im 20. Jahrhundert.",
			],
			correctIndex: 1,
			explanation:
				"Die Jahre 1801 bis 1900 bilden das 19. Jahrhundert, weil das 1. Jahrhundert bereits die Jahre 1 bis 100 umfasst.",
		},
		lab: {
			title: "Ortsarchiv- & Zeitleisten-Detektiv",
			intro:
				"Ordne drei Fundstücke deines Heimatortes der richtigen Quellenart, dem passenden Jahrhundert und dem besten Aufbewahrungsort zu!",
			controls: [
				{
					key: "urkunde1340",
					label: "Pergament-Urkunde von 1340",
					options: [
						{ value: "ungeklaert", label: "Noch nicht eingeordnet" },
						{
							value: "text14archiv",
							label: "Textquelle · 14. Jh. · ins klimatisierte Archiv",
						},
						{
							value: "sach13keller",
							label: "Sachquelle · 13. Jh. · in den feuchten Keller",
						},
					],
				},
				{
					key: "muffelMuenze",
					label: "Silbermünze von 1648 & alte Schmiedezange",
					options: [
						{ value: "ungeklaert", label: "Noch nicht eingeordnet" },
						{
							value: "sach17museum",
							label: "Sachquelle · 17. Jh. · Vitrine im Heimatmuseum",
						},
						{
							value: "text16privat",
							label: "Textquelle · 16. Jh. · privat verbiegen",
						},
					],
				},
				{
					key: "fotoZeitzeuge",
					label: "Altes Bahnhofsfoto von 1905 prüfen",
					options: [
						{ value: "ungeklaert", label: "Nur raten, was darauf zu sehen ist" },
						{
							value: "kombi20",
							label: "Bildquelle (20. Jh.) mit Chronik & Zeitzeugen abgleichen",
						},
					],
				},
			],
			initialState: {
				urkunde1340: "ungeklaert",
				muffelMuenze: "ungeklaert",
				fotoZeitzeuge: "ungeklaert",
			},
			goals: [
				{
					id: "urkunde-gesichert",
					title: "Urkunde von 1340 als Textquelle des 14. Jh. im Archiv sichern",
					check: (s) => s.urkunde1340 === "text14archiv",
					witness: {
						urkunde1340: "text14archiv",
						muffelMuenze: "ungeklaert",
						fotoZeitzeuge: "ungeklaert",
					},
				},
				{
					id: "sachquelle-museum",
					title: "Münze von 1648 als Sachquelle des 17. Jh. im Museum ausstellen",
					check: (s) => s.muffelMuenze === "sach17museum",
					witness: {
						urkunde1340: "ungeklaert",
						muffelMuenze: "sach17museum",
						fotoZeitzeuge: "ungeklaert",
					},
				},
				{
					id: "quellen-abgleich",
					title: "Komplette Orts-Zeitleiste (14., 17. & 20. Jh.) quellenkritisch prüfen",
					check: (s) =>
						s.urkunde1340 === "text14archiv" &&
						s.muffelMuenze === "sach17museum" &&
						s.fotoZeitzeuge === "kombi20",
					witness: {
						urkunde1340: "text14archiv",
						muffelMuenze: "sach17museum",
						fotoZeitzeuge: "kombi20",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Urkunde 1340",
					value:
						s.urkunde1340 === "text14archiv"
							? "Textquelle · 14. Jh. · im Archiv geschützt"
							: s.urkunde1340 === "sach13keller"
								? "Falsch eingeordnet & Schimmelgefahr!"
								: "Wartet auf Einordnung",
				},
				{
					label: "Münze 1648",
					value:
						s.muffelMuenze === "sach17museum"
							? "Sachquelle · 17. Jh. · im Museum erklärt"
							: s.muffelMuenze === "text16privat"
								? "Falsches Jahrhundert & Beschädigung!"
								: "Wartet auf Einordnung",
				},
				{
					label: "Quellen-Check 1905",
					value:
						s.fotoZeitzeuge === "kombi20"
							? "Bildquelle (20. Jh.) mehrstimmig belegt"
							: "Einzelvermutung ohne Beleg",
				},
			],
		},
		stamp: {
			id: "stempel-zeitreise",
			title: "Quellen-Spürnase",
			subtitle: "Zeitleiste & Quellen gemeistert",
			symbol: "⏳",
		},
	},
	{
		id: "wandel-fakten-fiktion",
		number: 15,
		stageId: "lb4",
		lb: 4,
		sectionCode: "HSU 3/4 · LB 4.2 & 4.3",
		title: "Erfindungen im Wandel, Fakten & Fiktion",
		shortTitle: "Wandel, Fakten & Fiktion",
		icon: "🏰",
		hook: "Warum hatte das erste Fahrrad noch keine Pedale – und gab es im Mittelalter wirklich feuerspeiende Drachen?",
		foundationNote:
			"Aus Station 14 weißt du bereits, wie historische Quellen uns helfen, echte Spuren der Vergangenheit zu untersuchen.",
		storyParagraphs: [
			"Alltagsgegenstände haben sich über Jahrhunderte stark verändert. Ein berühmtes Beispiel ist das Fahrrad: 1817 erfand Karl Drais die hölzerne Laufmaschine (Draisine). Sie hatte ein lenkbares Vorderrad, aber noch keine Pedale – man stieß sich mit den Füßen vom Boden ab. Um 1870 folgte das Hochrad mit Pedalen direkt am riesigen Vorderrad: Man kam schneller voran, stürzte aber leicht gefährlich kopfüber. Erst ab 1885 machten zwei gleich große Räder, der Kettenantrieb aufs Hinterrad und kurz darauf Luftreifen das Sicherheitsniederrad sicher und alltagstauglich für Arbeitswege und Ausflüge.",
			"Geschichten über früher begegnen uns oft in Sagen, Kinderbüchern, Filmen oder Videospielen. Dort mischen sich echte historische Fakten mit Fiktion (Erfundenem): Dass Ritter auf Burgen lebten und Kettenhemden trugen, ist durch Funde belegt. Dass ein Ritter gegen einen Drachen kämpfte oder Wikinger Hörnerhelme trugen, ist dagegen Fiktion zur spannenden Unterhaltung.",
			"In vielen bayerischen Orten halten Heimatmuseen, Denkmäler, Gedenktafeln und historische Feste die Erinnerung wach. Manche Feste feiern Stadtgründungen oder Handwerkstraditionen; Gedenktage erinnern mahnend auch an Kriege und Unrecht, damit wir Frieden und Demokratie heute schützen.",
		],
		factCards: [
			{
				icon: "🚲",
				title: "Vom Laufrad zum E-Bike",
				text: "1817 Draisine (ohne Pedale) → um 1870 Hochrad (Pedale am Vorderrad) → ab 1885 Niederrad mit Kette & Luftreifen → modernes Fahrrad.",
			},
			{
				icon: "🐉",
				title: "Fakt oder Fiktion?",
				text: "Fakten lassen sich durch echte Quellen belegen. Fiktion sind ausgeschmückte Sagen, Legenden oder Film-Effekte.",
			},
			{
				icon: "🕯️",
				title: "Erinnerungskultur",
				text: "Museen, Denkmäler und Gedenktage helfen einer Region, ihre Wurzeln zu verstehen und aus der Geschichte zu lernen.",
			},
		],
		workedExample: {
			title: "Die Burgsage unter der Forscherlupe",
			scenario:
				"Eine Stadtsage erzählt: ‚Im Jahr 1420 bauten die Bürger die Stadtmauer aus Granit, weil nachts ein Lindwurm am Stadttor klopfte.‘",
			steps: [
				"Wir prüfen Teil 1 an Quellen: Die Stadtmauer steht noch heute (Sachquelle) und in der Stadtrechnung von 1420 stehen Maurerlöhne (Textquelle) → historischer Fakt!",
				"Wir prüfen Teil 2: Für einen echten Lindwurm (Drachen) gibt es keinerlei Knochenfunde oder verlässliche Belege → Fiktion einer Sage!",
				"Wir deuten den Hintergrund: Bedrohungen wie Raubritter oder Brände wurden in alten Sagen oft bildhaft als Ungeheuer dargestellt.",
			],
			conclusion:
				"Wer Fakten und Fiktion trennt, genießt spannende Sagen, verwechselt sie aber nicht mit echter Geschichte.",
		},
		merksatz:
			"Technische Erfindungen wie das Fahrrad (Draisine → Hochrad → Niederrad mit Kettenantrieb) verändern Alltag und Mobilität. Historische Fakten stützen sich auf Quellen, während Sagen und Filme oft Fiktion beimischen.",
		probenWissen: [
			{
				term: "Draisine (1817)",
				definition:
					"Hölzerne Laufmaschine von Karl Drais mit lenkbarem Vorderrad, aber noch ohne Pedale und ohne Kette.",
			},
			{
				term: "Sicherheitsniederrad (ab 1885)",
				definition:
					"Vorläufer unseres heutigen Fahrrads mit zwei gleich großen Rädern, Kettenantrieb aufs Hinterrad und Luftreifen.",
			},
			{
				term: "Fakt vs. Fiktion",
				definition:
					"Fakt = durch Quellen überprüfbare Tatsache; Fiktion = erfundene oder ausgeschmückte Erzählung (z. B. in Sagen oder Filmen).",
			},
			{
				term: "Historische Erinnerung",
				definition:
					"Feste, Denkmäler, Gedenktage und Museen bewahren die Erinnerung an wichtige Ereignisse einer Region.",
			},
		],
		realWorldQuest:
			"Suche in deinem Wohnort nach einem Denkmal, einem alten Straßennamen oder einem Stadtwappen: An welche Person oder welches Ereignis erinnert es?",
		quickCheck: {
			question:
				"Welche Neuerung machte das Sicherheitsniederrad ab 1885 viel ungefährlicher als das Hochrad?",
			options: [
				"Ein noch größeres Vorderrad aus schwerem Gusseisen.",
				"Der Verzicht auf Lenker und Pedale wie bei der Draisine.",
				"Zwei gleich große, niedrigere Räder mit Kettenantrieb auf das Hinterrad.",
			],
			correctIndex: 2,
			explanation:
				"Durch den Kettenantrieb musste das Vorderrad nicht mehr riesig sein – man saß tief und stürzte beim Bremsen nicht mehr kopfüber.",
		},
		lab: {
			title: "Erfinder- & Sagen-Prüfstand",
			intro:
				"Stelle die Fahrrad-Entwicklung richtig ein, trenne in der Burggeschichte Fakt von Fiktion und erkläre den Sinn des Gedenktags!",
			controls: [
				{
					key: "fahrradStufe",
					label: "Technik-Meilenstein wählen",
					options: [
						{ value: "draisine", label: "1817 Draisine (Abstoßen ohne Pedale)" },
						{ value: "hochrad", label: "1870 Hochrad (hohe Sturzgefahr)" },
						{
							value: "niederrad",
							label: "1885 Niederrad (Kette + Luftreifen = alltagssicher)",
						},
					],
				},
				{
					key: "ritterCheck",
					label: "Ritterfilm mit Zauberschwert & Burgbrief von 1390",
					options: [
						{ value: "allesEcht", label: "Beides als echte Tatsachen glauben" },
						{
							value: "getrennt",
							label: "Burgbrief = Fakt (Quelle), Zauberschwert = Fiktion",
						},
					],
				},
				{
					key: "gedenktag",
					label: "Regionaler Gedenktag & Stadtjubiläum",
					options: [
						{ value: "egal", label: "Nur als schulfreien Tag ohne Bedeutung sehen" },
						{
							value: "erinnern",
							label: "Geschichte verstehen & Verantwortung für heute lernen",
						},
					],
				},
			],
			initialState: {
				fahrradStufe: "draisine",
				ritterCheck: "allesEcht",
				gedenktag: "egal",
			},
			goals: [
				{
					id: "fahrrad-durchbruch",
					title: "Alltagstaugliches Sicherheitsniederrad mit Kettenantrieb auswählen",
					check: (s) => s.fahrradStufe === "niederrad",
					witness: {
						fahrradStufe: "niederrad",
						ritterCheck: "allesEcht",
						gedenktag: "egal",
					},
				},
				{
					id: "fakt-fiktion-getrennt",
					title: "Historische Quelle (Fakt) und Film-Fiktion sauber trennen",
					check: (s) => s.ritterCheck === "getrennt",
					witness: {
						fahrradStufe: "draisine",
						ritterCheck: "getrennt",
						gedenktag: "egal",
					},
				},
				{
					id: "geschichts-profi",
					title: "Technikwandel, Quellenblick und Erinnerungskultur verbinden",
					check: (s) =>
						s.fahrradStufe === "niederrad" &&
						s.ritterCheck === "getrennt" &&
						s.gedenktag === "erinnern",
					witness: {
						fahrradStufe: "niederrad",
						ritterCheck: "getrennt",
						gedenktag: "erinnern",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Fahrrad-Technik",
					value:
						s.fahrradStufe === "niederrad"
							? "Kettenantrieb + Luftreifen: sicher im Alltag"
							: s.fahrradStufe === "hochrad"
								? "Schnell, aber hohe Sturzgefahr"
								: "1817: Laufmaschine ohne Pedale",
				},
				{
					label: "Medien-Prüfung",
					value:
						s.ritterCheck === "getrennt"
							? "Fakt & Fiktion klar unterschieden"
							: "Vorsicht: Film-Fantasie mit Geschichte verwechselt",
				},
				{
					label: "Erinnerungskultur",
					value:
						s.gedenktag === "erinnern"
							? "Aus der Vergangenheit für Gegenwart & Zukunft lernen"
							: "Bedeutung noch nicht erkannt",
				},
			],
		},
		stamp: {
			id: "stempel-wandel",
			title: "Fakten-Forscher",
			subtitle: "Technikwandel & Sagen-Check",
			symbol: "🏰",
		},
	},
	{
		id: "orientierung-und-kartenlesen",
		number: 16,
		stageId: "lb5",
		lb: 5,
		sectionCode: "HSU 3/4 · LB 5.1",
		title: "Himmelsrichtungen, Kompass & Karten lesen",
		shortTitle: "Kompass & Karten",
		icon: "🧭",
		hook: "Wie findest du mit Sonne, Kompass und Maßstab sicher ans Ziel – und wie passt ein ganzer Berg auf ein Blatt Papier?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon Wege auf dem Schulgelände und einfache Lagebegriffe wie links, rechts, vorn und hinten.",
		storyParagraphs: [
			"Auf der Windrose liegen die vier Haupthimmelsrichtungen im Uhrzeigersinn: Norden (N), Osten (O), Süden (S) und Westen (W) – Merkspruch: ‚Nie ohne Seife waschen!‘ Dazwischen liegen die vier Nebenhimmelsrichtungen Nordost (NO), Südost (SO), Südwest (SW) und Nordwest (NW). Tagsüber hilft der Sonnenstand (morgens im Osten, mittags im Süden, abends im Westen), nachts der Polarstern im Norden. Technische Hilfsmittel sind der Kompass, dessen Magnetnadel sich nach Norden ausrichtet, sowie GPS und Navigationsgeräte über Satelliten.",
			"Eine Karte ist kein Foto, sondern ein von Menschen für einen bestimmten Zweck verkleinertes und vereinfachtes Modell der Wirklichkeit. Wichtige Kartenmerkmale sind der Nordpfeil (meist ist oben Norden), die Legende mit den Kartenzeichen, die Generalisierung (Unwichtiges wird bei kleinem Maßstab weggelassen) und auf physischen Karten die Höhenschichtenfarben: Grün zeigt Tiefland, Gelb/Hellbraun Hügelland, Dunkelbraun Hochgebirge und Blau Gewässer.",
			"Der Maßstab verrät dir die Verkleinerung: Bei 1 : 10 000 entspricht 1 cm auf der Karte genau 10 000 cm = 100 m in der Wirklichkeit. Bei 1 : 100 000 steht 1 cm auf der Karte für 100 000 cm = 1 000 m = 1 km in der Natur!",
		],
		factCards: [
			{
				icon: "🧭",
				title: "8 Himmelsrichtungen",
				text: "Haupthimmelsrichtungen N, O, S, W und Nebenhimmelsrichtungen NO, SO, SW, NW; die Kompassnadel zeigt nach Norden.",
			},
			{
				icon: "📐",
				title: "Maßstab umrechnen",
				text: "100 cm = 1 m und 1 000 m = 1 km. Maßstab 1 : 25 000 bedeutet: 1 cm auf der Karte sind 250 m in echt.",
			},
			{
				icon: "⛰️",
				title: "Höhenschichten & Legende",
				text: "Grün = Tiefland, Gelb/Braun = Gebirge (je höher, desto dunkler braun), Blau = Flüsse und Seen.",
			},
		],
		workedExample: {
			title: "Wanderung zum Aussichtsturm",
			scenario:
				"Auf einer genordeten Wanderkarte im Maßstab 1 : 25 000 liegt der Aussichtsturm genau rechts oberhalb der Schule in 4 cm Kartenabstand auf einer dunkelbraunen Fläche.",
			steps: [
				"Wir bestimmen die Richtung: Oben ist Norden, rechts ist Osten – rechts oben liegt also Nordost (NO).",
				"Wir rechnen die Entfernung um: 1 cm entspricht 25 000 cm = 250 m. Also sind 4 cm · 250 m = 1 000 m = 1 km.",
				"Wir deuten die Farbe in der Legende: Dunkelbraun zeigt eine große Höhe – der Weg führt steil bergauf!",
			],
			conclusion:
				"Mit Richtung, Maßstab und Höhenfarbe weißt du schon vor dem Losgehen, wie weit und wie steil die Strecke wird.",
		},
		merksatz:
			"Karten sind genordete, verkleinerte (Maßstab) und vereinfachte (Generalisierung) Darstellungen der Wirklichkeit mit Legende und Höhenfarben. Natürliche (Sonne) und technische Hilfsmittel (Kompass, GPS) helfen bei der Orientierung.",
		probenWissen: [
			{
				term: "Windrose",
				definition:
					"Darstellung der 4 Haupthimmelsrichtungen (N, O, S, W) und 4 Nebenhimmelsrichtungen (NO, SO, SW, NW).",
			},
			{
				term: "Maßstab",
				definition:
					"Gibt das Verkleinerungsverhältnis an: 1 : 50 000 heißt 1 cm auf der Karte = 50 000 cm = 500 m in der Wirklichkeit.",
			},
			{
				term: "Generalisierung",
				definition:
					"Vereinfachen und Zusammenfassen von Details auf Karten, damit die Karte übersichtlich und lesbar bleibt.",
			},
			{
				term: "Höhenschichtenfarben",
				definition:
					"Grün = Tiefland (niedrig), Gelb/Hellbraun = Hügelland und Mittelgebirge, Dunkelbraun = Hochgebirge, Blau = Gewässer.",
			},
		],
		realWorldQuest:
			"Nimm einen Ortsplan oder eine Wanderkarte deiner Umgebung: Suche deine Schule, lies in der Legende drei Kartenzeichen nach und miss mit dem Lineal den Abstand zum nächsten Bahnhof oder Park!",
		quickCheck: {
			question:
				"Auf einer Wanderkarte im Maßstab 1 : 50 000 sind zwei Dörfer 2 cm voneinander entfernt. Wie weit liegen sie in der Wirklichkeit auseinander?",
			options: ["100 m.", "1 km (1 000 m).", "50 km."],
			correctIndex: 1,
			explanation:
				"1 cm auf der Karte sind 50 000 cm = 500 m in echt. 2 cm entsprechen daher 2 · 500 m = 1 000 m = 1 km.",
		},
		lab: {
			title: "Kompass- & Karten-Werkstatt",
			intro:
				"Richte die Karte nach Norden aus, peile die Berghütte im Südosten an und wähle die passende Detailkarte für eine Fußwanderung!",
			controls: [
				{
					key: "nordung",
					label: "Karte mit dem Kompass einnorden",
					options: [
						{ value: "verdreht", label: "Karte liegt verkehrt herum (Süden oben)" },
						{
							value: "genordet",
							label: "Nordpfeil der Karte zeigt genau zur roten Kompassspitze (N)",
						},
					],
				},
				{
					key: "peilung",
					label: "Richtung zur Berghütte unten rechts bestimmen",
					options: [
						{ value: "nordwest", label: "Nordwest (NW)" },
						{ value: "suedost", label: "Südost (SO) zwischen Süden und Osten" },
						{ value: "westen", label: "Genau Westen (W)" },
					],
				},
				{
					key: "kartenwahl",
					label: "Kartenmaßstab für 3 km Fußweg wählen",
					options: [
						{
							value: "weltkarte",
							label: "Europakarte 1 : 5 000 000 (stark generalisiert)",
						},
						{
							value: "wanderkarte",
							label: "Wanderkarte 1 : 25 000 mit Wegen & Höhenlinien",
						},
					],
				},
			],
			initialState: {
				nordung: "verdreht",
				peilung: "nordwest",
				kartenwahl: "weltkarte",
			},
			goals: [
				{
					id: "karte-genordet",
					title: "Karte mithilfe des Kompasses korrekt nach Norden ausrichten",
					check: (s) => s.nordung === "genordet",
					witness: {
						nordung: "genordet",
						peilung: "nordwest",
						kartenwahl: "weltkarte",
					},
				},
				{
					id: "wanderkarte-gewaehlt",
					title: "Detailreiche Wanderkarte (1 : 25 000) statt stark generalisierter Karte wählen",
					check: (s) => s.kartenwahl === "wanderkarte",
					witness: {
						nordung: "verdreht",
						peilung: "nordwest",
						kartenwahl: "wanderkarte",
					},
				},
				{
					id: "huette-gepeilt",
					title: "Mit genordeter Wanderkarte die Berghütte sicher im Südosten (SO) anpeilen",
					check: (s) =>
						s.nordung === "genordet" &&
						s.peilung === "suedost" &&
						s.kartenwahl === "wanderkarte",
					witness: {
						nordung: "genordet",
						peilung: "suedost",
						kartenwahl: "wanderkarte",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Karten-Ausrichtung",
					value:
						s.nordung === "genordet"
							? "Genordet: Oben = N, Rechts = O, Unten = S, Links = W"
							: "Verdreht: Richtungen auf der Karte täuschen!",
				},
				{
					label: "Peilung zur Hütte",
					value:
						s.nordung === "genordet" && s.peilung === "suedost"
							? s.kartenwahl === "wanderkarte"
								? "Treffer: Südost (SO) · 6 cm = 1,5 km"
								: "Südost (SO) stimmt – doch bei 1 : 5 000 000 wären 6 cm 300 km!"
							: s.peilung === "suedost"
								? "SO gewählt, aber Karte noch verdreht!"
								: "Falsche Richtung angepeilt",
				},
				{
					label: "Maßstab & Detailgrad",
					value:
						s.kartenwahl === "wanderkarte"
							? "1 : 25 000 (1 cm = 250 m · Fußwege sichtbar)"
							: "1 : 5 000 000 (viel zu stark generalisiert)",
				},
			],
		},
		stamp: {
			id: "stempel-kompass",
			title: "Karten-Lotse",
			subtitle: "Windrose & Maßstab geknackt",
			symbol: "🧭",
		},
	},
	{
		id: "bayern-deutschland-welt",
		number: 17,
		stageId: "lb5",
		lb: 5,
		sectionCode: "HSU 3/4 · LB 5.1 & 5.2",
		title: "Vom Heimatort nach Bayern, Europa & in die Welt",
		shortTitle: "Bayern, Europa & Welt",
		icon: "🗺️",
		hook: "Wie reiht sich dein Wohnort in die 7 Regierungsbezirke Bayerns und die Welt ein – und wie schützen wir empfindliche Naturräume trotz Tourismus?",
		foundationNote:
			"Aus Station 16 kannst du Karten, Himmelsrichtungen und Höhenschichtenfarben bereits sicher lesen.",
		storyParagraphs: [
			"Dein Wohnort gehört wie bei Zwiebelschalen zu immer größeren politischen und geographischen Einheiten: Gemeinde oder Stadt → Landkreis (oder kreisfreie Stadt) → Regierungsbezirk → Freistaat Bayern (Landeshauptstadt München) → Bundesrepublik Deutschland (16 Bundesländer, Hauptstadt Berlin) → Kontinent Europa → Planet Erde mit 7 Kontinenten.",
			"Bayern gliedert sich in 7 Regierungsbezirke: Oberbayern (München), Niederbayern (Landshut), Oberpfalz (Regensburg), Oberfranken (Bayreuth), Mittelfranken (Ansbach), Unterfranken (Würzburg) und Schwaben (Augsburg). Zwei große Flusssysteme prägen das Land: Im Norden schlängelt sich der Main nach Westen zum Rhein, im Süden fließt die Donau nach Osten Richtung Schwarzes Meer. Südlich der Donau münden Iller, Lech, Isar und Inn (Merkspruch: ‚Iller, Lech, Isar, Inn fließen rechts zur Donau hin‘); ganz im Süden ragen die Alpen mit der Zugspitze (2 962 m) auf.",
			"Menschen leben weltweit unter sehr verschiedenen Bedingungen – etwa in trockenen Wüstenrandgebieten, auf Inseln oder im Hochgebirge. Auch bei uns verändern menschliche Interessen wie Tourismus, Verkehr, Industrie und Landwirtschaft die Landschaft: In den Alpen sichern Bergbahnen und Hotels Arbeitsplätze, doch zu viel Autoverkehr, Müll und Pistenbau gefährden Bergwald und seltene Tiere. Schutzgebiete wie die Nationalparks Bayerischer Wald und Berchtesgaden sowie sanfter Tourismus helfen, Natur- und Kulturräume zu bewahren.",
		],
		factCards: [
			{
				icon: "🦁",
				title: "7 Regierungsbezirke Bayerns",
				text: "Oberbayern, Niederbayern, Oberpfalz, Oberfranken, Mittelfranken, Unterfranken und Schwaben.",
			},
			{
				icon: "🌊",
				title: "Donau, Main & Alpen",
				text: "Der Main fließt zum Rhein (Nordsee), die Donau zum Schwarzen Meer. Höchster Berg Bayerns und Deutschlands ist die Zugspitze (2 962 m).",
			},
			{
				icon: "🦌",
				title: "Räume nutzen & schützen",
				text: "Wo Tourismus, Landwirtschaft und Naturschutz aufeinandertreffen, helfen Schutzgebiete, markierte Wege und Anreise per Bahn.",
			},
		],
		workedExample: {
			title: "Interessenkonflikt am Alpensee",
			scenario:
				"Rund um einen bayerischen Bergsee wollen Gäste baden und parken, ein Hotel möchte das Schilfufer zubetonieren, und Wasservögel brüten im Schilf.",
			steps: [
				"Wir sammeln die Interessen: Urlauber suchen Erholung, Gastgeber Einkommen, die Natur braucht ungestörte Uferzonen.",
				"Wir prüfen die Folgen: Ein zubetoniertes Schilfufer zerstört den Brutplatz und die natürliche Wasserreinigung des Sees dauerhaft.",
				"Wir entwickeln eine Schutzlösung: Das Südufer bleibt geschützte Ruhezone, gebadet wird am ausgewiesenen Nordstrand und ein Wanderbus ersetzt Uferparkplätze.",
			],
			conclusion:
				"Sanfter Tourismus verbindet Erholung und regionale Arbeitsplätze mit dem Schutz empfindlicher Lebensräume.",
		},
		merksatz:
			"Unser Wohnort liegt in Gemeinde, Landkreis, einem der 7 Regierungsbezirke Bayerns, Deutschland, Europa und der Welt. Wenn Menschen Räume für Tourismus, Verkehr oder Wirtschaft nutzen, brauchen Natur und Kultur kluge Schutzmaßnahmen.",
		probenWissen: [
			{
				term: "Politische Gliederung",
				definition:
					"Gemeinde/Stadt → Landkreis → Regierungsbezirk → Bundesland Bayern (München) → Deutschland (Berlin) → Europa.",
			},
			{
				term: "7 Regierungsbezirke & Sitze",
				definition:
					"Oberbayern (München), Niederbayern (Landshut), Oberpfalz (Regensburg), Oberfranken (Bayreuth), Mittelfranken (Ansbach), Unterfranken (Würzburg), Schwaben (Augsburg).",
			},
			{
				term: "Südliche Donau-Nebenflüsse",
				definition:
					"Iller, Lech, Isar und Inn entspringen im Alpenraum und münden von Süden (rechts) in die Donau.",
			},
			{
				term: "Sanfter Tourismus",
				definition:
					"Natur- und umweltverträgliches Reisen (z. B. Anreise mit Bus/Bahn, auf Wegen bleiben, Schutzgebiete achten).",
			},
		],
		realWorldQuest:
			"Finde für deinen Wohnort die komplette Kette heraus: Wie heißen deine Gemeinde, dein Landkreis, dein Regierungsbezirk und der nächste größere Fluss?",
		quickCheck: {
			question:
				"Wie heißt die Regierungshauptstadt des bayerischen Regierungsbezirks Schwaben?",
			options: ["Augsburg.", "Regensburg.", "Würzburg."],
			correctIndex: 0,
			explanation:
				"Augsburg ist der Sitz der Regierung von Schwaben; Regensburg gehört zur Oberpfalz und Würzburg zu Unterfranken.",
		},
		lab: {
			title: "Bayern-Atlas & Alpenraum-Konferenz",
			intro:
				"Ordne die Raumebenen in der richtigen Reihenfolge, bestimme die Flüsse Bayerns und löse den Konflikt im Bergtal nachhaltig!",
			controls: [
				{
					key: "raumkette",
					label: "Raumgliederung vom Kleinen zum Großen",
					options: [
						{
							value: "durcheinander",
							label: "Europa → Gemeinde → Bayern → Landkreis",
						},
						{
							value: "geordnet",
							label: "Gemeinde → Landkreis → Regierungsbezirk → Bayern → Deutschland → Europa",
						},
					],
				},
				{
					key: "flusskarte",
					label: "Große Flüsse & Gebirge in Bayern zuordnen",
					options: [
						{ value: "vertauscht", label: "Main im Süden, Alpen im Norden" },
						{
							value: "richtig",
							label: "Main im Norden, Donau in der Mitte, Alpen (2 962 m) im Süden",
						},
					],
				},
				{
					key: "bergtal",
					label: "Konflikt im beliebten Bergtal lösen",
					options: [
						{
							value: "zubauen",
							label: "Schutzwälder roden für Riesenparkplatz am Gipfel",
						},
						{
							value: "sanft",
							label: "Ruhezonen für Wildtiere + Tal-Shuttlebus + markierte Wanderwege",
						},
					],
				},
			],
			initialState: {
				raumkette: "durcheinander",
				flusskarte: "vertauscht",
				bergtal: "zubauen",
			},
			goals: [
				{
					id: "zwiebelschalen-klar",
					title: "Politische Gliederung von der Gemeinde bis Europa richtig ordnen",
					check: (s) => s.raumkette === "geordnet",
					witness: {
						raumkette: "geordnet",
						flusskarte: "vertauscht",
						bergtal: "zubauen",
					},
				},
				{
					id: "bayern-topographie",
					title: "Main, Donau und Alpen auf der Bayernkarte richtig verorten",
					check: (s) => s.flusskarte === "richtig",
					witness: {
						raumkette: "durcheinander",
						flusskarte: "richtig",
						bergtal: "zubauen",
					},
				},
				{
					id: "raumschutz-gelungen",
					title: "Bayern-Orientierung mit sanftem Tourismus im Bergtal verbinden",
					check: (s) =>
						s.raumkette === "geordnet" &&
						s.flusskarte === "richtig" &&
						s.bergtal === "sanft",
					witness: {
						raumkette: "geordnet",
						flusskarte: "richtig",
						bergtal: "sanft",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Raumebenen",
					value:
						s.raumkette === "geordnet"
							? "6 Stufen sauber vom Heimatort bis Europa"
							: "Reihenfolge noch vertauscht",
				},
				{
					label: "Bayern-Karte",
					value:
						s.flusskarte === "richtig"
							? "Main (N) · Donau + Isar/Inn · Alpen im Süden"
							: "Flüsse und Gebirge vertauscht",
				},
				{
					label: "Bergtal-Zukunft",
					value:
						s.bergtal === "sanft"
							? "Natur geschützt & Gäste reisen umweltfreundlich"
							: "Schutzwald gefährdet & Stau im Tal",
				},
			],
		},
		stamp: {
			id: "stempel-bayern",
			title: "Bayern-Entdecker",
			subtitle: "7 Bezirke & Raumschutz im Blick",
			symbol: "🗺️",
		},
	},
	{
		id: "fahrrad-und-mobilitaet",
		number: 18,
		stageId: "lb5",
		lb: 5,
		sectionCode: "HSU 3/4 · LB 5.3",
		title: "Sicher mit dem Rad & nachhaltig mobil",
		shortTitle: "Verkehr & Fahrradprüfung",
		icon: "🚲",
		hook: "Was gehört alles an ein verkehrssicheres Fahrrad, wie klappt das Linksabbiegen in 8 Schritten – und warum ist der tote Winkel so gefährlich?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du sicheres Überqueren der Straße als Fußgänger; in der 4. Klasse folgt die Jugendverkehrsschule.",
		storyParagraphs: [
			"Menschen sind aus vielen Gründen unterwegs: täglich auf dem Schul- und Arbeitsweg, zum Einkaufen, in den Ferien – manchmal aber auch unfreiwillig auf der Flucht vor Krieg oder Naturkatastrophen. Früher waren Menschen, Waren und Briefe tagelang zu Fuß, mit Pferdewagen oder Postkutschen unterwegs; heute verbinden Züge, Schiffe, Autos und das Internet Orte in kurzer Zeit, verbrauchen aber auch viel Fläche, Energie und Ruhe.",
			"Für die Radfahrprüfung in der Jugendverkehrsschule muss dein Fahrrad verkehrssicher sein: Es braucht zwei voneinander unabhängige Bremsen (Vorder- und Hinterrad), eine helltönende Klingel, vorn einen weißen Scheinwerfer mit weißem Rückstrahler, hinten ein rotes Rücklicht mit rotem Großflächenrückstrahler, gelbe Rückstrahler an den Pedalen sowie Speichenreflektoren oder weiße Reflexstreifen an den Reifen. Ein passender Fahrradhelm und helle Kleidung schützen dich zusätzlich!",
			"Im Realverkehr denkst du vorausschauend für andere mit: Neben rechts abbiegenden Lkw und Bussen liegt der gefährliche tote Winkel, in dem Fahrende dich trotz Spiegeln nicht sehen – bleibe deshalb immer mit Abstand dahinter! An gleichrangigen Kreuzungen ohne Schilder gilt ‚rechts vor links‘. Beim Linksabbiegen beachtest du die 8 Punkte: 1. Umschauen, 2. Handzeichen links, 3. Einordnen zur Mitte, 4. Vorfahrt und Gegenverkehr beachten, 5. nochmals umschauen, 6. im weiten Bogen abbiegen, 7. rechts fahren, 8. konzentriert weiterfahren.",
		],
		factCards: [
			{
				icon: "🛑",
				title: "Verkehrszeichen-Formen",
				text: "Rotes Dreieck (Spitze oben) = Gefahr; runde Schilder = Vorschrift (rot: Verbot, blau: Gebot wie Radweg); Achteck = STOP.",
			},
			{
				icon: "🚛",
				title: "Toter Winkel",
				text: "Rechts neben Lkw oder Bus niemals vorfahren – im toten Winkel bist du unsichtbar. Sicher wartest du schräg dahinter!",
			},
			{
				icon: "🌿",
				title: "Umweltverbund",
				text: "Zu Fuß gehen, Radfahren, Bus und Bahn schonen Klima, Luft und Platz in der Stadt und halten deinen Körper fit.",
			},
		],
		workedExample: {
			title: "Gleichrangige Kreuzung auf dem Heimweg",
			scenario:
				"Du fährst mit dem Rad auf eine Kreuzung ohne Ampel und ohne Vorfahrtsschilder zu. Von rechts nähert sich ein Pkw, von links ein anderer Radfahrer.",
			steps: [
				"Keine Ampel, keine Polizistin/kein Polizist und keine Vorfahrtsschilder → es gilt die Grundregel ‚rechts vor links‘.",
				"Der Pkw kommt von rechts: Er hat Vorfahrt vor dir, du bremst rechtzeitig ab und nimmst Blickkontakt auf.",
				"Für den Radfahrer von links kommst du von rechts: Nachdem der Pkw durchgefahren ist, darfst du vor ihm fahren.",
			],
			conclusion:
				"Wer Verkehrsregeln sicher beherrscht und Blickkontakt sucht, vermeidet Missverständnisse an jeder Kreuzung.",
		},
		merksatz:
			"Ein verkehrssicheres Fahrrad (2 Bremsen, Klingel, Licht & Reflektoren rundum), vorausschauendes Verhalten (toter Winkel!), Verkehrszeichen, ‚rechts vor links‘ und die 8 Punkte beim Linksabbiegen machen dich fit für den Straßenverkehr.",
		probenWissen: [
			{
				term: "Verkehrssicheres Fahrrad",
				definition:
					"2 unabhängige Bremsen, Klingel, weißer Scheinwerfer + Frontreflektor, rotes Rücklicht + Rückstrahler, gelbe Pedalreflektoren, Speichenreflektoren/Reflexringe, rutschfeste Pedale.",
			},
			{
				term: "8 Punkte beim Linksabbiegen",
				definition:
					"1. Umschauen · 2. Handzeichen links · 3. Zur Mitte einordnen · 4. Vorfahrt/Gegenverkehr achten · 5. Umschauen · 6. Weiter Bogen · 7. Rechtsfahrgebot · 8. Weiterfahren.",
			},
			{
				term: "Verkehrszeichen-Gruppen",
				definition:
					"Gefahrzeichen (Dreieck Spitze oben), Vorschriftzeichen (rund: rot Verbot, blau Gebot), Richtzeichen (meist rechteckig blau).",
			},
			{
				term: "Flächenverbrauch & Nachhaltigkeit",
				definition:
					"Breite Straßen und Parkplätze versiegeln Boden; Radwege, Busse und Bahnen befördern viele Menschen auf wenig Raum.",
			},
		],
		realWorldQuest:
			"Mache zu Hause den Fahrrad-TÜV mit Checkliste: Funktionieren beide Bremsen, die Klingel, Vorder- und Rücklicht, und sind alle Reflektoren sauber?",
		quickCheck: {
			question:
				"An einer Ampel steht vor dir ein großer Lkw, der rechts blinkt. Wo wartest du mit deinem Fahrrad am sichersten?",
			options: [
				"Direkt rechts neben dem Führerhaus auf Höhe des Vorderrads.",
				"Schnell noch rechts am Lkw vorbeischlüpfen, bevor es Grün wird.",
				"Mit gutem Abstand hinter dem Lkw, niemals rechts daneben.",
			],
			correctIndex: 2,
			explanation:
				"Rechts neben dem Lkw liegt der tote Winkel – selbst mit Spiegeln kann dich die Fahrerin oder der Fahrer dort übersehen.",
		},
		lab: {
			title: "Jugendverkehrsschul-Check & Kreuzungs-Trainer",
			intro:
				"Rüste das Fahrrad verkehrssicher aus, meistere das Linksabbiegen an der Kreuzung und wähle eine umweltfreundliche Lösung für den Schulweg!",
			controls: [
				{
					key: "radCheck",
					label: "Fahrrad-Ausrüstung vor dem Start",
					options: [
						{ value: "mangelhaft", label: "Nur 1 Bremse, kein Rücklicht, keine Klingel" },
						{
							value: "verkehrssicher",
							label: "2 Bremsen, Klingel, Licht vorn/hinten & alle Reflektoren + Helm",
						},
					],
				},
				{
					key: "linksabbiegen",
					label: "Linksabbiegen mit Gegenverkehr",
					options: [
						{ value: "schneiden", label: "Ohne Umschauen schräg die Kurve schneiden" },
						{
							value: "achtPunkte",
							label: "Umschauen → Handzeichen → Mitte → Gegenverkehr durchlassen → weiter Bogen",
						},
					],
				},
				{
					key: "schulwegMobil",
					label: "Schulweg für 25 Kinder organisieren",
					options: [
						{ value: "elterntaxi", label: "25 einzelne Elterntaxis direkt vors Schultor" },
						{
							value: "radbus",
							label: "Geh- & Radlgruppen auf sicheren Wegen oder Schulbus",
						},
					],
				},
			],
			initialState: {
				radCheck: "mangelhaft",
				linksabbiegen: "schneiden",
				schulwegMobil: "elterntaxi",
			},
			goals: [
				{
					id: "rad-tuev-ok",
					title: "Fahrrad vollständig verkehrssicher ausstatten",
					check: (s) => s.radCheck === "verkehrssicher",
					witness: {
						radCheck: "verkehrssicher",
						linksabbiegen: "schneiden",
						schulwegMobil: "elterntaxi",
					},
				},
				{
					id: "sicher-links-abgebogen",
					title: "Mit verkehrssicherem Rad regelgerecht im weiten Bogen links abbiegen",
					check: (s) =>
						s.radCheck === "verkehrssicher" && s.linksabbiegen === "achtPunkte",
					witness: {
						radCheck: "verkehrssicher",
						linksabbiegen: "achtPunkte",
						schulwegMobil: "elterntaxi",
					},
				},
				{
					id: "nachhaltiger-schulweg",
					title: "Verkehrssicherheit und umweltfreundlichen Schulweg kombinieren",
					check: (s) =>
						s.radCheck === "verkehrssicher" &&
						s.linksabbiegen === "achtPunkte" &&
						s.schulwegMobil === "radbus",
					witness: {
						radCheck: "verkehrssicher",
						linksabbiegen: "achtPunkte",
						schulwegMobil: "radbus",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Fahrrad-Prüfplakette",
					value:
						s.radCheck === "verkehrssicher"
							? "Verkehrssicher (StVZO-komplett + Helm)"
							: "Nicht fahrbereit: Bremsen & Licht fehlen!",
				},
				{
					label: "Kreuzungs-Manöver",
					value:
						s.linksabbiegen === "achtPunkte"
							? "8-Punkte-Ablauf sicher & Gegenverkehr beachtet"
							: "Gefahr: Kurve geschnitten ohne Umschauen!",
				},
				{
					label: "Schulweg-Bilanz",
					value:
						s.schulwegMobil === "radbus"
							? "Wenig Abgase, mehr Bewegung & freie Sicht vorm Tor"
							: "Stau und unübersichtliche Gefahr vor der Schule",
				},
			],
		},
		stamp: {
			id: "stempel-verkehr",
			title: "Verkehrs-Profi",
			subtitle: "Rad-TÜV & Kreuzung gemeistert",
			symbol: "🚲",
		},
	},
	{
		id: "werkzeuge-maschinen-produktion",
		number: 19,
		stageId: "lb6",
		lb: 6,
		sectionCode: "HSU 3/4 · LB 6.1",
		title: "Hebel, Zahnräder, Werkzeuge & Produktion",
		shortTitle: "Hebel, Zahnräder & Arbeit",
		icon: "⚙️",
		hook: "Wie öffnet ein kleiner Flaschenöffner mühelos einen festen Kronkorken – und wie trocknet die Salatschleuder ganz ohne Föhn?",
		foundationNote:
			"Aus dem Alltag kennst du Schere, Locher, Schneebesen und Fahrradkette – hier entdeckst du die technischen Prinzipien dahinter.",
		storyParagraphs: [
			"Schon einfache technische Hilfsmittel sparen uns viel Muskelkraft: Beim Hebelprinzip (z. B. Flaschenöffner, Locher, Schubkarre oder Brechstange) dreht sich ein starrer Hebel um einen Drehpunkt. Je länger der Kraftarm im Vergleich zum kurzen Lastarm ist, desto weniger Kraft musst du aufwenden! Bei der Salatschleuder und der Wäscheschleuder wirkt die Fliehkraft: Durch schnelles Drehen werden die Wassertropfen nach außen durch die Sieblöcher geschleudert.",
			"Ein Zahnradgetriebe überträgt Kraft und verändert Drehrichtung sowie Geschwindigkeit – etwa im Handrührgerät, im Dosenöffner oder in der Salatschleuder. Zwei direkt ineinandergreifende Zahnräder drehen sich immer entgegengesetzt! Treibt ein großes Zahnrad mit 24 Zähnen ein kleines Zahnrad mit 8 Zähnen an, dreht sich das kleine Rad bei einer Kurbelumdrehung genau 3-mal. Aus Handwerkzeugen wurden im Lauf der Geschichte Maschinen: vom Handbohrer zur elektrischen Bohrmaschine, vom Waschbrett zur Waschmaschine und vom Federkiel zur Druckerpresse von Johannes Gutenberg, die Bücher und Bildung für viele Menschen zugänglich machte.",
			"Heute vergleichen wir handwerkliche Einzelfertigung mit industrieller Massenproduktion: Im Handwerk fertigen Fachleute langlebige Stücke oder reparieren sie, brauchen aber mehr Zeit pro Stück. In Fabriken entstehen durch Arbeitsteilung und Maschinen schnell viele günstige Waren – bei Billigkleidung (‚Fast Fashion‘) kostet das jedoch oft Unmengen an Wasser, Energie und Rohstoffen.",
		],
		factCards: [
			{
				icon: "🔧",
				title: "Hebelgesetz im Alltag",
				text: "Langer Kraftarm, kurzer Lastarm: So brauchst du am Flaschenöffner, Nussknacker oder an der Schubkarre viel weniger Kraft.",
			},
			{
				icon: "⚙️",
				title: "Zahnrad & Fliehkraft",
				text: "Benachbarte Zahnräder drehen gegenläufig; großes Rad treibt kleines Rad = schneller! Schnelle Drehung erzeugt Fliehkraft.",
			},
			{
				icon: "👕",
				title: "Handwerk vs. Massenware",
				text: "Massenproduktion senkt Preise, verbraucht aber viele Ressourcen. Reparieren, Tauschen und langlebige Qualität schützen die Umwelt.",
			},
		],
		workedExample: {
			title: "Das Getriebe in der Salatschleuder",
			scenario:
				"Im Deckel einer Salatschleuder greift ein großes Kurbelzahnrad mit 36 Zähnen in ein kleines Zahnrad mit 9 Zähnen am Siebkorb.",
			steps: [
				"Wir bestimmen die Übersetzung: 36 : 9 = 4. Bei 1 Umdrehung der Handkurbel dreht sich der Siebkorb 4-mal!",
				"Wir bestimmen die Drehrichtung: Kurbelst du im Uhrzeigersinn, dreht sich das direkt verbundene kleine Zahnrad gegen den Uhrzeigersinn.",
				"Wir erklären die Trocknung: Durch die hohe Drehzahl drückt die Fliehkraft das Wasser durch die Schlitze nach außen in die Schüssel.",
			],
			conclusion:
				"Zahnradübersetzung und Fliehkraft arbeiten in der Salatschleuder Hand in Hand – ganz ohne Strom!",
		},
		merksatz:
			"Hebel (langer Kraftarm), Fliehkraft und Zahnradgetriebe erleichtern die Arbeit. Die Entwicklung vom Werkzeug zur Maschine und zur Massenproduktion spart Zeit und Kosten, verlangt aber einen achtsamen Umgang mit Ressourcen.",
		probenWissen: [
			{
				term: "Hebelprinzip",
				definition:
					"Krafteinsparung durch langen Kraftarm und kurzen Lastarm am Drehpunkt (z. B. Flaschenöffner, Locher, Brechstange).",
			},
			{
				term: "Fliehkraft",
				definition:
					"Kraft bei Kreisbewegungen, die Körper oder Wassertropfen vom Mittelpunkt weg nach außen drückt (z. B. Salat- und Wäscheschleuder).",
			},
			{
				term: "Zahnradgetriebe",
				definition:
					"Zwei benachbarte Zahnräder drehen gegenläufig; großes Antriebsrad auf kleines Rad erhöht die Drehzahl.",
			},
			{
				term: "Handwerk vs. Massenproduktion",
				definition:
					"Handwerk: individuelle, oft reparierbare Einzelstücke; Massenproduktion: arbeitsteilige, maschinelle Fertigung großer Stückzahlen.",
			},
		],
		realWorldQuest:
			"Suche in eurer Küche drei heimliche Technik-Helfer: Wo steckt ein Hebel (z. B. Knoblauchpresse, Flaschenöffner), wo ein Getriebe und wo die Fliehkraft?",
		quickCheck: {
			question:
				"Ein großes Zahnrad mit 20 Zähnen dreht sich einmal im Uhrzeigersinn und treibt direkt ein kleines Zahnrad mit 10 Zähnen an. Was passiert am kleinen Zahnrad?",
			options: [
				"Es dreht sich 2-mal gegen den Uhrzeigersinn.",
				"Es dreht sich 2-mal im Uhrzeigersinn.",
				"Es dreht sich nur ein halbes Mal gegen den Uhrzeigersinn.",
			],
			correctIndex: 0,
			explanation:
				"20 Zähne schieben am 10er-Rad zweimal alle Zähne weiter (20 : 10 = 2), und zwei direkt ineinandergreifende Zahnräder drehen immer entgegengesetzt.",
		},
		lab: {
			title: "Erfinder-Werkbank: Hebel, Getriebe & Nachhaltigkeit",
			intro:
				"Hebe die schwere Kiste mit wenig Kraft an, bringe den Schleuderkorb auf hohe Drehzahl und triff eine ressourcenschonende Kleider-Entscheidung!",
			controls: [
				{
					key: "hebelArm",
					label: "Drehpunkt unter der Brechstange setzen",
					options: [
						{ value: "kurz", label: "Kurzer Kraftarm, langer Lastarm (schwer!)" },
						{
							value: "lang",
							label: "Langer Kraftarm, kurzer Lastarm nah an der Kiste",
						},
					],
				},
				{
					key: "getriebe",
					label: "Antrieb für die Salatschleuder wählen",
					options: [
						{
							value: "kleinAufGross",
							label: "Kleines Rad (8 Zähne) treibt großes Rad (24 Zähne)",
						},
						{
							value: "grossAufKlein",
							label: "Großes Rad (24 Zähne) treibt kleines Rad (8 Zähne)",
						},
					],
				},
				{
					key: "jacke",
					label: "Reißverschluss an der Winterjacke klemmt",
					options: [
						{ value: "wegwerfen", label: "Sofort wegwerfen & Billigjacke nachkaufen" },
						{
							value: "reparieren",
							label: "In der Änderungsschneiderei reparieren lassen",
						},
					],
				},
			],
			initialState: {
				hebelArm: "kurz",
				getriebe: "kleinAufGross",
				jacke: "wegwerfen",
			},
			goals: [
				{
					id: "hebel-leicht",
					title: "Mit langem Kraftarm die schwere Kiste leicht anheben",
					check: (s) => s.hebelArm === "lang",
					witness: {
						hebelArm: "lang",
						getriebe: "kleinAufGross",
						jacke: "wegwerfen",
					},
				},
				{
					id: "schleuder-schnell",
					title: "3-fache Drehzahl am Schleuderkorb durch Übersetzung Groß → Klein erreichen",
					check: (s) => s.getriebe === "grossAufKlein",
					witness: {
						hebelArm: "kurz",
						getriebe: "grossAufKlein",
						jacke: "wegwerfen",
					},
				},
				{
					id: "technik-nachhaltig",
					title: "Hebel, schnelles Getriebe und nachhaltige Reparatur vereinen",
					check: (s) =>
						s.hebelArm === "lang" &&
						s.getriebe === "grossAufKlein" &&
						s.jacke === "reparieren",
					witness: {
						hebelArm: "lang",
						getriebe: "grossAufKlein",
						jacke: "reparieren",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Hebel-Kraftaufwand",
					value:
						s.hebelArm === "lang"
							? "Leicht! Langer Kraftarm spart Muskelkraft"
							: "Mühsam: Kraftarm ist viel zu kurz",
				},
				{
					label: "Schleuder-Getriebe",
					value:
						s.getriebe === "grossAufKlein"
							? "1 Kurbeldrehung = 3 Korbdrehungen (gegenläufig) · starke Fliehkraft"
							: "Langsam (nur 1/3 Umdrehung) · Salat bleibt nass",
				},
				{
					label: "Ressourcen-Bilanz",
					value:
						s.jacke === "reparieren"
							? "Handwerk genutzt · Wasser & Rohstoffe gespart"
							: "Unnötiger Müll & hoher Ressourcenverbrauch",
				},
			],
		},
		stamp: {
			id: "stempel-technik",
			title: "Getriebe-Tüftler",
			subtitle: "Hebel, Fliehkraft & Handwerk",
			symbol: "⚙️",
		},
	},
	{
		id: "bruecken-und-balance",
		number: 20,
		stageId: "lb6",
		lb: 6,
		sectionCode: "HSU 3/4 · LB 6.2",
		title: "Stabile Brücken, Papierprofile & Gleichgewicht",
		shortTitle: "Brücken & Balance",
		icon: "🌉",
		hook: "Wie trägt ein einziges gefaltetes Blatt Papier ein schweres Buch – und warum steht die Steinerne Brücke in Regensburg seit fast 900 Jahren?",
		foundationNote:
			"Aus dem Bauen mit Bauklötzen weißt du schon, wann Türme wackeln; jetzt nutzt du echte Ingenieurs-Tricks für Stabilität und Balance.",
		storyParagraphs: [
			"Brücken überwinden Flüsse, Täler und Straßen – je nach Landschaft wählen Fachleute die passende Bauweise: Eine einfache Balkenbrücke liegt auf Pfeilern oder Widerlagern auf, biegt sich bei großer Spannweite aber leicht durch. Eine Bogenbrücke leitet die Last über einen gewölbten Bogen seitlich in die Ufer-Widerlager ab – wie die berühmte Steinerne Brücke über die Donau in Regensburg aus dem 12. Jahrhundert. Eine Fachwerkbrücke nutzt Stäbe in Dreiecksform, und eine Hängebrücke hängt mit Tragseilen an hohen Pylonen für besonders große Spannweiten.",
			"Im Modellbau erkennst du zwei Geheimnisse der Materialökonomie (maximale Stabilität mit möglichst wenig Material): Erstens wird ein flaches Blatt Papier enorm tragfähig, wenn du es zu einem Winkel-, U-, Zickzack- (Ziehharmonika-) oder Rundprofil faltest bzw. rollst. Zweitens lässt sich ein Vierecksrahmen seitlich verschieben, während ein Dreieck formstabil bleibt – eine diagonale Strebe steift jedes Geländer aus! Vor dem Bau helfen eine Bauzeichnung (Seitenansicht, Draufsicht) und eine klare Bauanleitung.",
			"Bei Wippe, Balkenwaage, Mobile und Baukran entscheidet das Gleichgewichtsprinzip: Gewicht mal Abstand vom Drehpunkt muss auf beiden Seiten gleich groß sein! Sitzt links ein Kind mit 40 kg genau 1 m vom Drehpunkt entfernt, hält rechts ein Kind mit 20 kg im doppelten Abstand von 2 m die Wippe exakt in der Waage (40 · 1 = 20 · 2).",
		],
		factCards: [
			{
				icon: "🌉",
				title: "Vier Brückentypen",
				text: "Balkenbrücke (Auflager), Bogenbrücke (Druck in Widerlager), Fachwerkbrücke (stabile Dreiecke), Hängebrücke (Pylone & Tragseile).",
			},
			{
				icon: "📄",
				title: "Profile & Dreiecke",
				text: "Zickzack-, U-, Winkel- und Rundprofile verhindern Durchbiegen; Diagonalstreben machen wackelige Vierecke zu stabilen Dreiecken.",
			},
			{
				icon: "⚖️",
				title: "Wippe im Gleichgewicht",
				text: "Halbes Gewicht braucht doppelten Abstand vom Drehpunkt: Gewicht links · Abstand links = Gewicht rechts · Abstand rechts.",
			},
		],
		workedExample: {
			title: "Papierbrücke für das Spielzeugauto",
			scenario:
				"Zwischen zwei Wörterbüchern klafft eine Lücke von 22 cm. Ein flaches Blatt Papier biegt sich schon unter einem Holzauto sofort durch.",
			steps: [
				"Wir zeichnen zuerst eine kurze Skizze und falten das Blatt im Zickzack-Profil (wie eine Ziehharmonika) mit 2 cm hohen Falten.",
				"Für das Seitengeländer kleben wir Papierstreifen nicht als bloße Rechtecke, sondern mit schrägen Diagonalstreben als Dreiecks-Fachwerk.",
				"Beim Belastungstest trägt dasselbe einzelne Blatt Papier nun problemlos das Holzauto und mehrere Bausteine – ganz ohne mehr Material!",
			],
			conclusion:
				"Kluge Formgebung (Profil + Dreiecks-Aussteifung) schlägt bloße Materialmenge – das nennt man Materialökonomie.",
		},
		merksatz:
			"Balken-, Bogen-, Fachwerk- und Hängebrücken nutzen unterschiedliche Konstruktionsprinzipien. Profile (Winkel, U, Zickzack, Röhre) und Dreiecksverbindungen erhöhen die Stabilität; an Balancegeräten gilt: Gewicht · Abstand ist links und rechts gleich.",
		probenWissen: [
			{
				term: "Brückenbauweisen",
				definition:
					"Balkenbrücke, Bogenbrücke (z. B. Steinerne Brücke Regensburg), Fachwerkbrücke (Dreiecke) und Hängebrücke (Pylone + Tragseile).",
			},
			{
				term: "Papierprofile",
				definition:
					"Umformungen wie Winkel-, U-, Zickzack- und Rundprofil erhöhen die Biegefestigkeit bei gleichem Materialeinsatz.",
			},
			{
				term: "Aussteifung durch Dreiecke",
				definition:
					"Vierecke verschieben sich leicht; eine Diagonalstrebe teilt das Viereck in zwei formstabile Dreiecke.",
			},
			{
				term: "Gleichgewichtsprinzip",
				definition:
					"An Wippe und Balkenwaage herrscht Gleichgewicht, wenn auf beiden Seiten Gewicht · Abstand zum Drehpunkt gleich groß ist.",
			},
		],
		realWorldQuest:
			"Baue zu Hause aus genau einem Blatt Altpapier zwischen zwei gleich dicken Büchern eine Brücke: Wie viele Münzen oder Stifte trägt sie flach – und wie viele als Zickzack-Profil?",
		quickCheck: {
			question:
				"Warum haben Fachwerkbrücken und Baukräne fast überall schräge Streben, sodass Dreiecke entstehen?",
			options: [
				"Nur zur Verzierung, damit Vögel besser darauf landen können.",
				"Damit die Brücke schwerer wird und im Fluss nach unten sinkt.",
				"Weil sich ein Dreieck im Gegensatz zum Viereck nicht seitlich verschieben lässt und mit wenig Material sehr stabil ist.",
			],
			correctIndex: 2,
			explanation:
				"Dreiecke sind geometrisch formstabil (Aussteifung) und ermöglichen hohe Tragkraft bei geringem Materialverbrauch.",
		},
		lab: {
			title: "Brücken-Prüfstand & Balance-Waage",
			intro:
				"Verstärke die Papierbrücke mit Profil und Dreiecksfachwerk und bringe daneben die Balkenwaage ins exakte Gleichgewicht!",
			controls: [
				{
					key: "fahrbahnProfil",
					label: "Papierfahrbahn formen",
					options: [
						{ value: "flach", label: "Flaches Einzelblatt (biegt stark durch)" },
						{ value: "zickzack", label: "Gefaltetes Zickzack-Profil mit Aufkantung" },
					],
				},
				{
					key: "aussteifung",
					label: "Seitenträger aussteifen",
					options: [
						{ value: "viereck", label: "Offene Vierecksrahmen ohne Diagonalen" },
						{ value: "dreieck", label: "Fachwerk mit Diagonalstreben (Dreiecke)" },
					],
				},
				{
					key: "waageRechts",
					label: "Balkenwaage (links: 4 Bausteine auf Feld 2)",
					options: [
						{ value: "feld1", label: "Rechts 2 Bausteine auf Feld 1 setzen" },
						{ value: "feld2", label: "Rechts 2 Bausteine auf Feld 2 setzen" },
						{
							value: "feld4",
							label: "Rechts 2 Bausteine auf Feld 4 setzen (2 · 4 = 8)",
						},
					],
				},
			],
			initialState: {
				fahrbahnProfil: "flach",
				aussteifung: "viereck",
				waageRechts: "feld1",
			},
			goals: [
				{
					id: "profil-stabil",
					title: "Durchbiegen der Fahrbahn durch ein Zickzack-Profil stoppen",
					check: (s) => s.fahrbahnProfil === "zickzack",
					witness: {
						fahrbahnProfil: "zickzack",
						aussteifung: "viereck",
						waageRechts: "feld1",
					},
				},
				{
					id: "fachwerk-fertig",
					title: "Brücke mit Zickzack-Profil und Dreiecks-Fachwerk tragfähig machen",
					check: (s) =>
						s.fahrbahnProfil === "zickzack" && s.aussteifung === "dreieck",
					witness: {
						fahrbahnProfil: "zickzack",
						aussteifung: "dreieck",
						waageRechts: "feld1",
					},
				},
				{
					id: "waage-im-lot",
					title: "Stabile Brücke UND Balkenwaage ins Gleichgewicht (4 · 2 = 2 · 4) bringen",
					check: (s) =>
						s.fahrbahnProfil === "zickzack" &&
						s.aussteifung === "dreieck" &&
						s.waageRechts === "feld4",
					witness: {
						fahrbahnProfil: "zickzack",
						aussteifung: "dreieck",
						waageRechts: "feld4",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Brücken-Tragkraft",
					value:
						s.fahrbahnProfil === "zickzack" && s.aussteifung === "dreieck"
							? "Sehr stabil! Profil + Dreiecke tragen den Prüfstein"
							: s.fahrbahnProfil === "zickzack"
								? "Fahrbahn steif, aber Geländer wackelt seitlich"
								: "Achtung: Flaches Blatt biegt sich durch!",
				},
				{
					label: "Materialökonomie",
					value:
						s.fahrbahnProfil === "zickzack" && s.aussteifung === "dreieck"
							? "Optimal: Hohe Tragkraft mit wenig Papier"
							: "Verbesserbar durch Falten und Diagonalstreben",
				},
				{
					label: "Balkenwaage",
					value:
						s.waageRechts === "feld4"
							? "Im Gleichgewicht! Links 4 · 2 = 8 · Rechts 2 · 4 = 8"
							: s.waageRechts === "feld2"
								? "Kippt nach links (8 > 4)"
								: "Kippt stark nach links (8 > 2)",
				},
			],
		},
		stamp: {
			id: "stempel-bruecken",
			title: "Brücken-Baumeister",
			subtitle: "Profile, Dreiecke & Balance",
			symbol: "🌉",
		},
	},
];
