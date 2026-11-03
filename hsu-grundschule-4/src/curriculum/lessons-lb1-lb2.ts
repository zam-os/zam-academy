import type { Lesson } from "../model/types";

export const LESSONS_LB1_LB2: ReadonlyArray<Lesson> = [
	{
		id: "gemeinschaft-kinderrechte",
		number: 1,
		stageId: "lb1",
		lb: 1,
		sectionCode: "HSU 3/4 · LB 1.1",
		title: "Fair zusammenleben, wählen & Kinderrechte",
		shortTitle: "Demokratie & Kinderrechte",
		icon: "🗳️",
		hook: "Wie entscheidet eine Klasse gerecht, wenn nicht alle dasselbe wollen – und welche Rechte hat jedes Kind?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon Klassenregeln und einfache Kompromisse im Gesprächskreis.",
		storyParagraphs: [
			"Wo viele Menschen zusammenleben – in deiner Familie, in der Schule oder im Sportverein –, gibt es verschiedene Meinungen. In einer Demokratie darf jede Person ihre Meinung begründen, ohne ausgelacht zu werden. Bei einem Streit hilft konstruktive Kritik: Du sagst ruhig, was dich stört, und schlägst eine faire Lösung oder einen Kompromiss vor.",
			"Wenn die Klasse eine Klassensprecherin oder einen Klassensprecher wählt, gelten fünf wichtige Wahlgrundsätze: Die Wahl ist allgemein (alle Kinder der Klasse dürfen wählen), frei (niemand wird gedrängt), gleich (jede Stimme zählt genau gleich viel), geheim (niemand schaut auf deinen Stimmzettel) und unmittelbar (du wählst die Person direkt).",
			"Außerdem gelten für alle Kinder weltweit die UN-Kinderrechte – unabhängig von Herkunft, Religion, Geschlecht oder einer Behinderung. Dazu gehören das Recht auf Bildung, auf Schutz vor Gewalt, auf Freizeit, auf Mitbestimmung und auf gemeinsames Lernen (Inklusion). Auch Rollenklischees wie ‚Fußball ist nur für Buben‘ oder ‚Tanzen ist nur für Mädchen‘ hinterfragen wir: Jedes Kind darf seine eigenen Stärken entfalten.",
		],
		factCards: [
			{
				icon: "🗳️",
				title: "Die 5 Wahlgrundsätze",
				text: "Allgemein, frei, gleich, geheim und unmittelbar – so bleibt jede demokratische Wahl fair.",
			},
			{
				icon: "🤝",
				title: "Rechte & Pflichten",
				text: "Wer das Recht hat, mitzubestimmen und gehört zu werden, hat auch die Pflicht, Regeln einzuhalten und andere zu achten.",
			},
			{
				icon: "🌍",
				title: "Kinderrechte & Vielfalt",
				text: "Die UN-Kinderrechtskonvention schützt jedes Kind. Verschiedene Feste, Speisen und Bräuche bereichern unser Zusammenleben.",
			},
		],
		workedExample: {
			title: "Die Klassensprecherwahl in der 4b",
			scenario:
				"In der 4b schlägt Ben vor: ‚Wer für Mia ist, hebt jetzt vor allen die Hand! Außerdem zählt die Stimme der ersten Reihe doppelt.‘",
			steps: [
				"Wir prüfen die Wahlgrundsätze: Offenes Handheben verletzt den Grundsatz ‚geheim‘, weil sich manche Kinder nicht trauen, ehrlich abzustimmen.",
				"Doppelte Stimmen für die erste Reihe verletzen den Grundsatz ‚gleich‘, denn jede Stimme muss genau gleich viel zählen.",
				"Richtig läuft es mit verdeckten Stimmzetteln in einer Wahlurne und genau einer Stimme für jedes Kind der Klasse.",
			],
			conclusion:
				"Erst durch geheime Stimmzettel und gleiches Stimmrecht wird die Wahl demokratisch gültig.",
		},
		merksatz:
			"Demokratische Wahlen sind allgemein, frei, gleich, geheim und unmittelbar. In der Gemeinschaft gehören Rechte (z. B. Mitbestimmung, Bildung, Schutz) und Pflichten (Rücksicht und Regeltreue) fest zusammen.",
		probenWissen: [
			{
				term: "5 Wahlgrundsätze",
				definition:
					"allgemein (alle Wahlberechtigten), frei (ohne Druck), gleich (jede Stimme zählt 1), geheim (unbeobachtet), unmittelbar (direkte Wahl).",
			},
			{
				term: "Kompromiss",
				definition:
					"Eine friedliche Einigung, bei der beide Seiten einen Schritt aufeinander zugehen.",
			},
			{
				term: "UN-Kinderrechte",
				definition:
					"Weltweit gültige Rechte für Kinder bis 18 Jahre, z. B. Recht auf Bildung, Schutz vor Gewalt, Gesundheit, Mitbestimmung und Inklusion.",
			},
			{
				term: "Rollenklischee",
				definition:
					"Ein veraltetes Vorurteil darüber, was angeblich ‚typisch Mädchen‘ oder ‚typisch Bub‘ sei.",
			},
		],
		realWorldQuest:
			"Entdecke zu Hause oder in der Schule: Welche Feste feiern Familien aus deiner Klasse im Jahreslauf, und welche Gemeinsamkeiten (z. B. Licht, gemeinsames Essen, Geschenke) findet ihr?",
		quickCheck: {
			question:
				"Welcher Wahlgrundsatz wird verletzt, wenn alle Kinder ihren Stimmzettel offen auf den Tisch legen müssen?",
			options: [
				"Der Grundsatz der geheimen Wahl.",
				"Der Grundsatz der unmittelbaren Wahl.",
				"Der Grundsatz der allgemeinen Wahl.",
			],
			correctIndex: 0,
			explanation:
				"Geheim bedeutet, dass niemand sehen darf, wen du gewählt hast – deshalb nutzt man eine Wahlkabine oder gefaltete Stimmzettel.",
		},
		lab: {
			title: "Klassenrat- & Wahlkabinen-Werkstatt",
			intro:
				"Stelle in der 4b eine faire Wahl und einen guten Klassenrats-Beschluss ein. Zu Beginn ist noch nichts demokratisch geregelt!",
			controls: [
				{
					key: "kabine",
					label: "Abstimmung",
					options: [
						{ value: "zuruf", label: "Offener Zuruf im Raum" },
						{ value: "geheim", label: "Verdeckter Stimmzettel in der Urne" },
					],
				},
				{
					key: "stimmrecht",
					label: "Stimmenverteilung",
					options: [
						{ value: "ersteReihe", label: "Nur erste Reihe wählt" },
						{ value: "alleGleich", label: "Jedes Kind hat genau 1 Stimme" },
					],
				},
				{
					key: "pausenstreit",
					label: "Streit um das Fußballfeld",
					options: [
						{ value: "schimpfen", label: "Laut streiten, wer stärker ist" },
						{
							value: "kompromiss",
							label: "Wechselplan für Mädchen, Buben & Rollikinder",
						},
					],
				},
			],
			initialState: {
				kabine: "zuruf",
				stimmrecht: "ersteReihe",
				pausenstreit: "schimpfen",
			},
			goals: [
				{
					id: "g1-wahl",
					title: "Mache die Klassensprecherwahl geheim, allgemein und gleich",
					check: (s) => s.kabine === "geheim" && s.stimmrecht === "alleGleich",
					witness: {
						kabine: "geheim",
						stimmrecht: "alleGleich",
						pausenstreit: "schimpfen",
					},
				},
				{
					id: "g1-kompromiss",
					title: "Löse den Pausenstreit mit einem inklusiven Kompromiss",
					check: (s) => s.pausenstreit === "kompromiss",
					witness: {
						kabine: "zuruf",
						stimmrecht: "ersteReihe",
						pausenstreit: "kompromiss",
					},
				},
				{
					id: "g1-komplett",
					title: "Verbinde gültige Wahl und fairen Pausenhof-Kompromiss",
					check: (s) =>
						s.kabine === "geheim" &&
						s.stimmrecht === "alleGleich" &&
						s.pausenstreit === "kompromiss",
					witness: {
						kabine: "geheim",
						stimmrecht: "alleGleich",
						pausenstreit: "kompromiss",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Wahlprüfung",
					value:
						s.kabine === "geheim" && s.stimmrecht === "alleGleich"
							? "Gültig: geheim, allgemein & gleich"
							: s.kabine !== "geheim"
								? "Ungültig: Wahl ist nicht geheim"
								: "Ungültig: Nicht alle haben gleiches Stimmrecht",
				},
				{
					label: "Pausenhof-Klima",
					value:
						s.pausenstreit === "kompromiss"
							? "Fairer Kompromiss ohne Rollenklischees (Inklusion aktiv)"
							: "Konflikt ungelöst – es fehlt ein Kompromiss",
				},
			],
		},
		stamp: {
			id: "stamp-demokratie",
			title: "Klassenrats-Stimme",
			subtitle: "Demokratie & Kinderrechte gemeistert",
			symbol: "🗳️",
		},
	},
	{
		id: "unsere-gemeinde",
		number: 2,
		stageId: "lb1",
		lb: 1,
		sectionCode: "HSU 3/4 · LB 1.1",
		title: "Unsere Gemeinde: Rathaus, Ämter & Entscheidungen",
		shortTitle: "Rathaus & Gemeinde",
		icon: "🏛️",
		hook: "Wer sorgt eigentlich dafür, dass aus dem Wasserhahn Trinkwasser kommt, die Feuerwehr ausrückt und ein neuer Spielplatz entsteht?",
		foundationNote:
			"Aus der Schule kennst du Klassensprecher und Regeln – in deiner Wohnort-Gemeinde funktioniert Mitbestimmung im Großen ganz ähnlich.",
		storyParagraphs: [
			"Jede Stadt und jedes Dorf in Bayern ist eine Gemeinde (Kommune). Alle sechs Jahre wählen die wahlberechtigten Bürgerinnen und Bürger bei der Kommunalwahl den Gemeinderat (in Städten: Stadtrat) sowie die Erste Bürgermeisterin oder den Ersten Bürgermeister.",
			"Der Gemeinderat berät und beschließt wichtige Projekte und den Haushaltsplan (wofür Geld ausgegeben wird). Die Bürgermeisterin oder der Bürgermeister leitet das Rathaus (die Gemeindeverwaltung), führt den Vorsitz im Gemeinderat und setzt die Beschlüsse um. Viele Bürgerinnen und Bürger helfen außerdem im Ehrenamt – also freiwillig und unbezahlt, etwa bei der Freiwilligen Feuerwehr.",
			"Die Aufgaben der Gemeinde teilen wir in drei Gruppen ein: Pflichtaufgaben muss jede Gemeinde erfüllen (z. B. Trinkwasser, Abwasser, Grundschule, Feuerwehr, Gemeindestraßen, Müllentsorgung). Freiwillige Aufgaben leistet sie sich nach Kassenlage (z. B. Schwimmbad, Bücherei, Jugendtreff, Museum). Übertragene Aufgaben erledigt sie im Auftrag des Staates (z. B. Personalausweise im Einwohnermeldeamt, Standesamt, Wahlen durchführen).",
		],
		factCards: [
			{
				icon: "🚒",
				title: "Pflichtaufgaben",
				text: "Muss jede Gemeinde erledigen: Trinkwasser, Abwasser, Feuerwehr, Grundschulgebäude, Straßenbau.",
			},
			{
				icon: "🏊",
				title: "Freiwillige Aufgaben",
				text: "Schöne Zusatzangebote, wenn genug Geld im Haushalt ist: Freibad, Bücherei, Musikschule, Feste.",
			},
			{
				icon: "🪪",
				title: "Übertragene Aufgaben",
				text: "Staatliche Aufgaben im Rathaus: Einwohnermeldeamt (Pässe/Ausweise), Standesamt, Organisation von Wahlen.",
			},
		],
		workedExample: {
			title: "Streit um die freie Wiese am Ortsrand",
			scenario:
				"Eine freie Gemeindefläche soll neu gestaltet werden. Familien wünschen sich einen Abenteuerspielplatz, Anwohner wünschen Ruhe, der Naturschutzbund möchte alte Obstbäume erhalten.",
			steps: [
				"Zuerst sammelt die Gemeinde in einer Bürgerversammlung oder Kinder- und Jugendsprechstunde alle Anliegen.",
				"Der Gemeinderat wägt persönliche Interessen und das Gemeinwohl ab und prüft die Kosten im Gemeindehaushalt.",
				"Mehrheitsbeschluss im Gemeinderat: Ein Spielplatz mit Klettergerüst in der Mitte, eine dichte Hecke als Lärmschutz zu den Wohnhäusern und Erhalt der Obstbäume am Rand.",
			],
			conclusion:
				"Politische Entscheidungen in der Gemeinde suchen einen tragfähigen Ausgleich verschiedener Interessen zum Wohl aller.",
		},
		merksatz:
			"Alle 6 Jahre wählen Bürgerinnen und Bürger in Bayern Bürgermeister/in und Gemeinderat/Stadtrat. Die Gemeinde erfüllt Pflichtaufgaben, freiwillige Aufgaben und übertragene Staatsaufgaben.",
		probenWissen: [
			{
				term: "Gemeinderat / Stadtrat",
				definition:
					"Gewählte Vertretung der Bürgerinnen und Bürger; berät und beschließt über Projekte und Geld der Gemeinde.",
			},
			{
				term: "Bürgermeister/in",
				definition:
					"Leitet die Gemeindeverwaltung im Rathaus, leitet die Sitzungen des Gemeinderats und vertritt die Gemeinde.",
			},
			{
				term: "Gemeinwohl",
				definition:
					"Das Wohl möglichst vieler Menschen in der Gemeinschaft statt nur der Vorteil einzelner Personen.",
			},
			{
				term: "Ehrenamt",
				definition:
					"Freiwilliger, unbezahlter Einsatz für andere, z. B. bei der Freiwilligen Feuerwehr oder im Sportverein.",
			},
		],
		realWorldQuest:
			"Finde heraus: Wie heißt deine Gemeinde oder Stadt, wie heißt eure Erste Bürgermeisterin oder euer Erster Bürgermeister, und welches Symbol zeigt euer Gemeindewappen?",
		quickCheck: {
			question:
				"Welche der folgenden Aufgaben ist eine Pflichtaufgabe jeder Gemeinde?",
			options: [
				"Die Versorgung mit sauberem Trinkwasser und der Brandschutz (Feuerwehr).",
				"Der Bau eines beheizten Erlebnis-Freibads mit Wasserrutsche.",
				"Das Ausstellen eines Reisepasses als freiwilliges Geschenk.",
			],
			correctIndex: 0,
			explanation:
				"Trinkwasser, Abwasser, Feuerwehr und Grundschulgebäude sind lebenswichtige Pflichtaufgaben. Ein Freibad ist eine freiwillige Aufgabe, Pässe gehören zu den übertragenen Aufgaben.",
		},
		lab: {
			title: "Rathaus- & Gemeinde-Planer",
			intro:
				"Ordne die Aufgaben im Rathaus richtig zu und plane die freie Gemeindewiese so, dass Gemeinwohl und Naturschutz zusammenpassen!",
			controls: [
				{
					key: "wasserFeuerwehr",
					label: "Feuerwehr & Trinkwasser einordnen",
					options: [
						{ value: "freiwillig", label: "Als freiwillige Aufgabe" },
						{ value: "pflicht", label: "Als Pflichtaufgabe" },
					],
				},
				{
					key: "buechereiBad",
					label: "Stadtbücherei & Freibad einordnen",
					options: [
						{ value: "pflicht", label: "Als Pflichtaufgabe" },
						{ value: "freiwillig", label: "Als freiwillige Aufgabe" },
					],
				},
				{
					key: "wiese",
					label: "Beschluss für die freie Wiese",
					options: [
						{ value: "beton", label: "Komplett zubetonieren für Parkplätze" },
						{ value: "nurRuhe", label: "Betreten für Kinder komplett verbieten" },
						{
							value: "ausgleich",
							label: "Spielbereich + Ruhebank + Schutzhecke für Tiere",
						},
					],
				},
			],
			initialState: {
				wasserFeuerwehr: "freiwillig",
				buechereiBad: "pflicht",
				wiese: "beton",
			},
			goals: [
				{
					id: "g2-pflicht",
					title: "Ordne Feuerwehr und Trinkwasser als Pflichtaufgabe zu",
					check: (s) => s.wasserFeuerwehr === "pflicht",
					witness: {
						wasserFeuerwehr: "pflicht",
						buechereiBad: "pflicht",
						wiese: "beton",
					},
				},
				{
					id: "g2-trennung",
					title: "Trenne Pflichtaufgaben und freiwillige Aufgaben fehlerfrei",
					check: (s) =>
						s.wasserFeuerwehr === "pflicht" && s.buechereiBad === "freiwillig",
					witness: {
						wasserFeuerwehr: "pflicht",
						buechereiBad: "freiwillig",
						wiese: "beton",
					},
				},
				{
					id: "g2-gemeinwohl",
					title: "Beschließe auf der Gemeindewiese den Ausgleich für alle Gruppen",
					check: (s) =>
						s.wasserFeuerwehr === "pflicht" &&
						s.buechereiBad === "freiwillig" &&
						s.wiese === "ausgleich",
					witness: {
						wasserFeuerwehr: "pflicht",
						buechereiBad: "freiwillig",
						wiese: "ausgleich",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Rathaus-Zuordnung",
					value:
						s.wasserFeuerwehr === "pflicht" && s.buechereiBad === "freiwillig"
							? "Korrekt: Pflicht- und freiwillige Aufgaben stimmen!"
							: "Noch vertauscht: Prüfe, was jede Gemeinde zwingend leisten muss.",
				},
				{
					label: "Gemeinderats-Abwägung",
					value:
						s.wiese === "ausgleich"
							? "Gemeinwohl erreicht: Kinder, Senioren & Natur berücksichtigt"
							: s.wiese === "beton"
								? "Einseitig: Boden versiegelt, kein Platz für Kinder & Natur"
								: "Einseitig: Bedürfnisse der Kinder wurden übergangen",
				},
			],
		},
		stamp: {
			id: "stamp-gemeinde",
			title: "Rathaus-Siegel",
			subtitle: "Gemeinde & Kommunalpolitik verstanden",
			symbol: "🏛️",
		},
	},
	{
		id: "medien-und-konsum",
		number: 3,
		stageId: "lb1",
		lb: 1,
		sectionCode: "HSU 3/4 · LB 1.2",
		title: "Medienprofi, Werbetricks & bewusster Einkauf",
		shortTitle: "Medien & Konsum",
		icon: "🛒",
		hook: "Warum liegen teure Süßigkeiten im Supermarkt genau auf deiner Augenhöhe – und stimmt alles, was Werbung verspricht?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon den Unterschied zwischen lebenswichtigen Grundbedürfnissen und bloßen Wünschen beim Taschengeld.",
		storyParagraphs: [
			"Bücher, Zeitungen, Radio, Fernsehen, Spielekonsolen und Smartphones sind Medien. Wir nutzen sie mit unterschiedlichen Zielen: zur Information (Nachrichten, Sachbuch), zur Kommunikation (Nachrichten schreiben, telefonieren) oder zur Unterhaltung (Filme, Spiele). Ein Medienprofi prüft immer kritisch: Ist ein Video oder Foto echt, gestellt oder übertrieben? Und er schützt seine persönlichen Daten und vereinbart feste bildschirmfreie Pausen.",
			"Im Supermarkt und im Internet begegnen dir ausgeklügelte Verkaufstricks. In der Sicht- und Griffzone (auf Augenhöhe) stehen oft teure Markenprodukte. Günstige Grundnahrungsmittel liegen dagegen ganz unten in der Bückzone oder ganz oben in der Streckzone. An der Kasse wartet die Quengelware für spontane Käufe, während Backduft, langsame Musik und große Einkaufswagen zum Mehrkaufen verlocken.",
			"Als bewusste Verbraucherin oder bewusster Verbraucher überlegst du vor dem Kauf: Brauche ich das wirklich? Wie lange hält es? Entsteht unnötiger Plastikmüll? Wer Dinge repariert, ausleiht, gebraucht kauft oder eine Mehrwegflasche nutzt, schont Rohstoffe, Energie und unsere Umwelt.",
		],
		factCards: [
			{
				icon: "📱",
				title: "Funktionen von Medien",
				text: "Information (lernen/wissen), Kommunikation (austauschen) und Unterhaltung (Spaß/Entspannung) – oft auch gemischt!",
			},
			{
				icon: "👀",
				title: "Regal-Tricks im Markt",
				text: "Sicht-/Griffzone = teure Markenware; Bück- und Streckzone = günstigere Ware; Kasse = Quengelware.",
			},
			{
				icon: "♻️",
				title: "Nachhaltiger Konsum",
				text: "Qualität statt Wegwerfware, Mehrweg statt Einweg und vor jedem Kauf fragen: Wunsch oder echter Bedarf?",
			},
		],
		workedExample: {
			title: "Zwei Müslipackungen im Preis- und Werbecheck",
			scenario:
				"Auf Augenhöhe steht das bunte ‚Super-Dino-Knuspermüsli‘ mit kleiner Plastikfigur (250 g für 3,00 €). Unten in der Bückzone steht Hafermüsli ohne Spielzeug (500 g für 2,00 €).",
			steps: [
				"Wir vergleichen nicht nur den Packungspreis, sondern den Grundpreis für gleiche Mengen: 500 g Dino-Müsli würden 2 · 3,00 € = 6,00 € kosten – also dreimal so viel!",
				"Die Plastikfigur und der Comic-Dino sind Werbetricks, die Kinder beeinflussen sollen, und erzeugen zusätzlichen Müll.",
				"Ein Blick auf die Zutatenliste zeigt außerdem oft viel versteckten Zucker im Werbemüsli.",
			],
			conclusion:
				"Wer in die Bückzone schaut und Grundpreise sowie Verpackung prüft, lässt sich von Werbung nicht täuschen.",
		},
		merksatz:
			"Medien informieren, unterhalten und verbinden uns – aber Werbung und mediale Bilder zeigen oft eine geschönte Welt. Bewusste Verbraucher durchschauen Verkaufstricks und achten auf Qualität, Müllvermeidung und Nachhaltigkeit.",
		probenWissen: [
			{
				term: "Sicht- und Griffzone",
				definition:
					"Regalhöhe auf Augen- und Handhöhe; dort stehen meist teure Markenprodukte.",
			},
			{
				term: "Bück- und Streckzone",
				definition:
					"Unterste und oberste Regalfächer; dort liegen oft günstigere Produkte des täglichen Bedarfs.",
			},
			{
				term: "Quengelware",
				definition:
					"Kleine Süßigkeiten und Spielsachen direkt an der Warteschlange der Kasse für spontane Käufe.",
			},
			{
				term: "Nachhaltiger Konsum",
				definition:
					"So einkaufen und nutzen, dass Umwelt, Rohstoffe und Menschen heute und in Zukunft geschützt werden.",
			},
		],
		realWorldQuest:
			"Mach beim nächsten Einkauf den Regal-Detektiv-Test: Vergleiche bei einem Lebensmittel (z. B. Nudeln oder Müsli) den Kilopreis auf Augenhöhe mit dem Kilopreis ganz unten im Regal!",
		quickCheck: {
			question:
				"Warum liegen große Gänge mit Obst und Gemüse sowie duftende Backwaren im Supermarkt fast immer direkt am Eingang?",
			options: [
				"Frische Farben und guter Duft sorgen sofort für Kauflaune und den Eindruck von Frische.",
				"Weil Obst und Backwaren schwerer sind als Getränkekisten.",
				"Damit Kundinnen und Kunden möglichst schnell wieder ohne Einkauf hinausgehen.",
			],
			correctIndex: 0,
			explanation:
				"Frische Farben, Licht und Backduft sprechen unsere Sinne an, verlangsamen das Tempo und regen zum Einkaufen an.",
		},
		lab: {
			title: "Supermarkt-Detektiv & Werbe-Lupe",
			intro:
				"Schalte Lottas Werbe-Lupe ein, untersuche die Regalebenen und triff eine umweltfreundliche Kaufentscheidung!",
			controls: [
				{
					key: "lupe",
					label: "Lottas Werbe-Lupe",
					options: [
						{ value: "aus", label: "Aus (nur bunte Packung sehen)" },
						{ value: "an", label: "An (Kilopreis & Tricks aufdecken)" },
					],
				},
				{
					key: "regal",
					label: "Untersuchter Ort im Markt",
					options: [
						{ value: "sicht", label: "Sichtzone (Augenhöhe)" },
						{ value: "bueck", label: "Bückzone (ganz unten)" },
						{ value: "kasse", label: "Warteschlange an der Kasse" },
					],
				},
				{
					key: "wahl",
					label: "Getränk im Einkaufskorb",
					options: [
						{ value: "einweg", label: "Einweg-Trinkpäckchen mit Strohhalm" },
						{
							value: "mehrweg",
							label: "Regionale Mehrwegflasche für die Trinkflasche",
						},
					],
				},
			],
			initialState: {
				lupe: "aus",
				regal: "sicht",
				wahl: "einweg",
			},
			goals: [
				{
					id: "g3-bueckzone",
					title: "Prüfe mit eingeschalteter Werbe-Lupe die günstige Bückzone",
					check: (s) => s.lupe === "an" && s.regal === "bueck",
					witness: { lupe: "an", regal: "bueck", wahl: "einweg" },
				},
				{
					id: "g3-quengel",
					title: "Entlarve mit der Werbe-Lupe die Quengelware an der Kasse",
					check: (s) => s.lupe === "an" && s.regal === "kasse",
					witness: { lupe: "an", regal: "kasse", wahl: "einweg" },
				},
				{
					id: "g3-mehrweg",
					title: "Wähle das abfallarme Mehrweg-Getränk mit eingeschalteter Lupe",
					check: (s) => s.lupe === "an" && s.wahl === "mehrweg",
					witness: { lupe: "an", regal: "sicht", wahl: "mehrweg" },
				},
			],
			readouts: (s) => [
				{
					label: "Regal-Analyse",
					value:
						s.lupe === "aus"
							? "Werbe-Lupe ist aus – schalte sie ein, um versteckte Verkaufstricks zu sehen!"
							: s.regal === "bueck"
								? "Bückzone erkannt: Hier liegen oft günstige Produkte ohne teure Werbefigur."
								: s.regal === "kasse"
									? "Kassen-Trick erkannt: Quengelware nutzt Wartezeit für Spontankäufe!"
									: "Sichtzone erkannt: Beste Platzierung für teure Markenware auf Augenhöhe.",
				},
				{
					label: "Umwelt-Check",
					value:
						s.wahl === "mehrweg"
							? "Nachhaltig: Mehrweg wird bis zu 50-mal neu befüllt und spart Müll!"
							: "Viel Verpackungsmüll durch Einweg-Verbundkarton.",
				},
			],
		},
		stamp: {
			id: "stamp-medien",
			title: "Werbe-Detektivlupe",
			subtitle: "Medien & Konsum durchschaut",
			symbol: "🔍",
		},
	},
	{
		id: "wunderwerk-auge",
		number: 4,
		stageId: "lb2",
		lb: 2,
		sectionCode: "HSU 3/4 · LB 2.1",
		title: "Wunderwerk Auge: Aufbau, Sehen & Schutz",
		shortTitle: "Das Auge",
		icon: "👁️",
		hook: "Warum wird der schwarze Punkt in deinem Auge bei Sonnenschein blitzschnell klein – und wieso steht das Bild im Auge eigentlich kopf?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du unsere fünf Sinne – heute erforschen wir unser wichtigstes Sinnesorgan bis ins Innere!",
		storyParagraphs: [
			"Unser Auge ist empfindlich und deshalb mehrfach geschützt: Der knöcherne Schädel bildet die sichere Augenhöhle. Die Augenbrauen leiten Schweiß von der Stirn seitlich weg. Augenlider und Wimpern fangen Staub und Schmutz ab. Bei jedem Lidschlag verteilt die Tränendrüse salzige Tränenflüssigkeit über das Auge, hält es feucht und spült Fremdkörper heraus.",
			"Von außen siehst du die weiße Lederhaut, die farbige Regenbogenhaut (Iris) und in ihrer Mitte ein Sehloch: die Pupille. Bei grellem Licht zieht sich die Regenbogenhaut zusammen – die Pupille wird eng, damit die empfindliche Netzhaut nicht geblendet wird (Pupillenreflex). Im Dunkeln wird die Pupille weit, um möglichst viel Licht einzufangen.",
			"Beim Sehen fällt das Licht durch die durchsichtige Hornhaut und die Pupille auf die elastische Augenlinse. Sie bündelt die Lichtstrahlen durch den durchsichtigen Glaskörper auf die Netzhaut im Augenhintergrund. Dort entsteht ein verkleinertes, auf dem Kopf stehendes Bild! Sinneszellen wandeln es in Signale um, der Sehnerv leitet sie zum Gehirn – und erst unser Gehirn dreht das Bild wieder richtig herum.",
		],
		factCards: [
			{
				icon: "🛡️",
				title: "Natürlicher Schutz",
				text: "Augenhöhle (Stöße), Augenbrauen (Schweiß), Lider & Wimpern (Staub), Tränenflüssigkeit (Reinigung).",
			},
			{
				icon: "☀️",
				title: "Pupillenreflex",
				text: "Helles Licht → Pupille klein (Blendungsschutz). Dunkelheit → Pupille groß (mehr Lichteinfall).",
			},
			{
				icon: "🧠",
				title: "Der Weg des Lichts",
				text: "Hornhaut → Pupille → Linse → Glaskörper → Netzhaut (Bild steht kopf) → Sehnerv → Gehirn.",
			},
		],
		workedExample: {
			title: "Vom dunklen Hausflur hinaus in den Schnee",
			scenario:
				"Du trittst im Winter aus dem schattigen Hausflur hinaus auf eine sonnenhelle Schneewiese.",
			steps: [
				"Der Schnee wirft sehr viel Sonnenlicht in deine Augen.",
				"Sofort greift der unwillkürliche Pupillenreflex: Deine Regenbogenhaut (Iris) verengt die Pupille zu einem kleinen Punkt.",
				"Zusätzlich schützt eine gute Sonnenbrille mit UV-Filter Hornhaut und Netzhaut vor unsichtbarer UV-Strahlung; niemals direkt in die Sonne schauen!",
			],
			conclusion:
				"Schutzreflexe und kluges Verhalten (gutes Leselicht, Abstand zum Bildschirm, UV-Sonnenbrille) halten deine Augen gesund.",
		},
		merksatz:
			"Licht fällt durch Hornhaut, Pupille, Linse und Glaskörper auf die Netzhaut. Dort entsteht ein umgekehrtes Bild, das über den Sehnerv ans Gehirn gemeldet und dort richtig herum wahrgenommen wird.",
		probenWissen: [
			{
				term: "Regenbogenhaut (Iris)",
				definition:
					"Gibt dem Auge seine Farbe und regelt wie eine Kamerablende die Größe der Pupille.",
			},
			{
				term: "Pupille",
				definition:
					"Die Öffnung (Sehloch) in der Mitte der Iris: bei Helligkeit eng, bei Dunkelheit weit.",
			},
			{
				term: "Netzhaut",
				definition:
					"Lichtempfindliche Innenschicht hinten im Auge mit Millionen Sehzellen; das Bild steht dort auf dem Kopf.",
			},
			{
				term: "Sehnerv",
				definition:
					"Leitet die elektrischen Sehsignale von der Netzhaut direkt an das Gehirn weiter.",
			},
		],
		realWorldQuest:
			"Spiegel-Experiment zu Hause: Schließe im hellen Zimmer für 10 Sekunden eine Hand leicht über den Augen (ohne zu drücken), nimm sie weg und beobachte im Spiegel, wie deine Pupillen kleiner werden!",
		quickCheck: {
			question:
				"Welche Aufgabe haben die Augenbrauen beim Schutz unseres Auges?",
			options: [
				"Sie leiten Schweißperlen und Regentropfen von der Stirn seitlich am Auge vorbei.",
				"Sie bündeln die Lichtstrahlen auf die Netzhaut.",
				"Sie leiten die Signale vom Auge zum Gehirn.",
			],
			correctIndex: 0,
			explanation:
				"Augenbrauen wirken wie eine kleine Regenrinne über dem Auge, damit salziger Schweiß nicht ins Auge brennt.",
		},
		lab: {
			title: "Licht- & Augenschutz-Labor",
			intro:
				"Verändere das Umgebungslicht, teste die Schutzteile des Auges und schalte den Längsschnitt ein!",
			controls: [
				{
					key: "licht",
					label: "Umgebungslicht",
					options: [
						{ value: "zimmer", label: "Normales Zimmerlicht" },
						{ value: "nacht", label: "Dunkle Dämmerung" },
						{ value: "sonne", label: "Heller Sonnentag" },
					],
				},
				{
					key: "schutz",
					label: "Schutz-Probe",
					options: [
						{ value: "ruhig", label: "Keine Gefahr" },
						{ value: "staub", label: "Staubkorn im Wind" },
						{ value: "schweiss", label: "Schweiß auf der Stirn" },
					],
				},
				{
					key: "ansicht",
					label: "Labor-Ansicht",
					options: [
						{ value: "aussen", label: "Außenansicht (Iris & Pupille)" },
						{ value: "innen", label: "Längsschnitt (Linse, Netzhaut, Sehnerv)" },
					],
				},
			],
			initialState: {
				licht: "zimmer",
				schutz: "ruhig",
				ansicht: "aussen",
			},
			goals: [
				{
					id: "g4-pupille",
					title: "Beobachte, wie sich die Pupille an einem hellen Sonnentag verengt",
					check: (s) => s.licht === "sonne",
					witness: { licht: "sonne", schutz: "ruhig", ansicht: "aussen" },
				},
				{
					id: "g4-schutz",
					title: "Teste Lider, Wimpern und Tränenflüssigkeit bei einem Staubkorn",
					check: (s) => s.schutz === "staub",
					witness: { licht: "zimmer", schutz: "staub", ansicht: "aussen" },
				},
				{
					id: "g4-laengsschnitt",
					title: "Verfolge im Längsschnitt den Lichtweg bis zur Netzhaut",
					check: (s) => s.ansicht === "innen",
					witness: { licht: "zimmer", schutz: "ruhig", ansicht: "innen" },
				},
			],
			readouts: (s) => [
				{
					label: "Pupillen-Weite",
					value:
						s.licht === "sonne"
							? "Eng zusammengezogen – schützt die Netzhaut vor Blendung"
							: s.licht === "nacht"
								? "Weit geöffnet – fängt möglichst viel Restlicht ein"
								: "Mittlere Öffnung bei normalem Tageslicht",
				},
				{
					label: "Aktiver Schutz & Bild",
					value:
						s.ansicht === "innen"
							? "Lichtweg: Hornhaut → Pupille → Linse → Glaskörper → Netzhaut (steht kopf!) → Sehnerv"
							: s.schutz === "staub"
								? "Lidschlussreflex + Tränenflüssigkeit spülen das Staubkorn heraus!"
								: s.schutz === "schweiss"
									? "Augenbraue leitet den Schweiß seitlich am Auge vorbei."
									: "Tränenfilm hält die Hornhaut klar und feucht.",
				},
			],
		},
		stamp: {
			id: "stamp-auge",
			title: "Adlerauge-Abzeichen",
			subtitle: "Aufbau & Schutz des Auges erforscht",
			symbol: "👁️",
		},
	},
	{
		id: "wachsen-und-neues-leben",
		number: 5,
		stageId: "lb2",
		lb: 2,
		sectionCode: "HSU 3/4 · LB 2.1",
		title: "Groß werden: Neues Leben & Beginn der Pubertät",
		shortTitle: "Entwicklung & Pubertät",
		icon: "🌱",
		hook: "Wie wächst ein Baby neun Monate lang geschützt im Bauch der Mutter heran – und was verändert sich auf dem Weg zum Jugendlichen?",
		foundationNote:
			"Aus der 1. und 2. Klasse weißt du schon, was dich als Person einzigartig macht und wie gute Pflege und Ernährung deinen Körper stärken.",
		storyParagraphs: [
			"Jedes Menschenleben beginnt mit einem winzigen Wunder: Bei der Zeugung (Befruchtung) verschmelzen eine weibliche Eizelle und eine männliche Samenzelle. Die befruchtete Eizelle teilt sich immer weiter und nistet sich gut geschützt in der Gebärmutter der Mutter ein. Eine Schwangerschaft dauert rund 9 Monate (etwa 40 Wochen).",
			"In der Gebärmutter schwimmt das ungeborene Kind in der Fruchtblase im warmen Fruchtwasser – es polstert Stöße ab und hält die Temperatur gleichmäßig. Über den Mutterkuchen (die Plazenta) und die Nabelschnur erhält das Baby Sauerstoff und Nährstoffe aus dem Blutkreislauf der Mutter und gibt Abfallstoffe ab, denn atmen und essen kann es im Bauch noch nicht selbst. Bei der Geburt öffnen sich die Geburtswege, das Baby kommt zur Welt und macht seinen ersten eigenen Atemzug.",
			"Zwischen etwa 9 und 15 Jahren startet bei jedem Kind im ganz eigenen Tempo die Pubertät – der Übergang vom Kind zum Jugendlichen. Botenstoffe (Hormone) lösen einen Wachstumsschub aus: Der Körper verändert sich (Scham- und Achselhaare, tiefere Stimme/Stimmbruch besonders bei Buben, Brustwachstum und erste Regelblutung/Menstruation bei Mädchen, stärkeres Schwitzen). Auch Gefühle fahren manchmal Achterbahn: Der Wunsch nach Selbstständigkeit und Privatsphäre wächst.",
		],
		factCards: [
			{
				icon: "🫧",
				title: "Fruchtblase & Fruchtwasser",
				text: "Umhüllen das Baby wie ein warmes Schutzkissen gegen Stöße und ermöglichen Bewegungen.",
			},
			{
				icon: "🔗",
				title: "Plazenta & Nabelschnur",
				text: "Versorgen das ungeborene Kind 9 Monate lang zuverlässig mit Sauerstoff und Nährstoffen.",
			},
			{
				icon: "🌿",
				title: "Beginnende Pubertät",
				text: "Jedes Kind entwickelt sich im eigenen Tempo – Körperpflege, Geduld und Respekt helfen dabei.",
			},
		],
		workedExample: {
			title: "Wie atmet ein Baby eigentlich vor der Geburt?",
			scenario:
				"Lukas wundert sich: ‚Das Baby schwimmt doch im Fruchtwasser – warum verschluckt es sich beim Atmen nicht?‘",
			steps: [
				"Vor der Geburt sind die Lungen des Babys noch nicht mit Luft gefüllt.",
				"Die Mutter atmet Sauerstoff über ihre eigene Lunge ins Blut ein.",
				"Im Mutterkuchen (Plazenta) wandert dieser Sauerstoff zusammen mit Nährstoffen in das Blut des Kindes und gelangt durch die Nabelschnur direkt zum Baby.",
			],
			conclusion:
				"Erst direkt nach der Geburt atmet das Neugeborene zum ersten Mal mit den eigenen Lungen Luft ein, und die Nabelschnur wird durchtrennt – zurück bleibt unser Bauchnabel!",
		},
		merksatz:
			"Nach der Verschmelzung von Eizelle und Samenzelle wächst das Kind rund 9 Monate geschützt in der Fruchtblase der Gebärmutter heran und wird über Plazenta und Nabelschnur versorgt. In der Pubertät verändern Botenstoffe Körper und Gefühle im jeweils eigenen Tempo.",
		probenWissen: [
			{
				term: "Zeugung (Befruchtung)",
				definition:
					"Verschmelzung einer weiblichen Eizelle mit einer männlichen Samenzelle zum Beginn neuen Lebens.",
			},
			{
				term: "Plazenta (Mutterkuchen) & Nabelschnur",
				definition:
					"Versorgungsbrücke zwischen Mutter und Kind für Sauerstoff und Nährstoffe während der rund 9 Monate Schwangerschaft.",
			},
			{
				term: "Fruchtblase & Fruchtwasser",
				definition:
					"Schützende Hülle mit Flüssigkeit in der Gebärmutter, die Stöße dämpft und warm hält.",
			},
			{
				term: "Pubertät",
				definition:
					"Entwicklungsphase vom Kind zum Jugendlichen mit körperlichen (z. B. Wachstum, Stimmbruch, Menstruation) und seelischen Veränderungen.",
			},
		],
		realWorldQuest:
			"Schau dir gemeinsam mit deiner Familie ein Babyfoto von dir an: Was konntest du mit einem Jahr noch nicht, was du heute ganz selbstverständlich kannst?",
		quickCheck: {
			question:
				"Wie erhält ein ungeborenes Baby im Bauch der Mutter Sauerstoff und Nährstoffe?",
			options: [
				"Über den Mutterkuchen (die Plazenta) und die Nabelschnur.",
				"Indem es Luftblasen aus dem Fruchtwasser mit der Lunge einatmet.",
				"Über feste Nahrung, die es im 3. Monat mit den Zähnen kaut.",
			],
			correctIndex: 0,
			explanation:
				"Vor der Geburt sind die Lungen noch nicht in Betrieb – Plazenta und Nabelschnur liefern Sauerstoff und Nährstoffe direkt ins Blut des Kindes.",
		},
		lab: {
			title: "Entwicklungs- & Lebensreise-Entdecker",
			intro:
				"Erkunde die Entwicklung in den 9 Schwangerschaftsmonaten, die Versorgungsorgane und die Veränderungen in der Pubertät!",
			controls: [
				{
					key: "monat",
					label: "Zeitpunkt vor der Geburt",
					options: [
						{ value: "m1", label: "1. Monat (etwa reiskorngroß)" },
						{ value: "m5", label: "5. Monat (strampelt spürbar)" },
						{ value: "m9", label: "9. Monat (bereit für die Geburt)" },
					],
				},
				{
					key: "fokus",
					label: "Schutz- & Versorgungs-Lupe",
					options: [
						{ value: "ueberblick", label: "Gesamtüberblick" },
						{ value: "fruchtblase", label: "Fruchtblase & Fruchtwasser" },
						{ value: "nabelschnur", label: "Plazenta & Nabelschnur" },
					],
				},
				{
					key: "lebensphase",
					label: "Blick aufs Größerwerden",
					options: [
						{ value: "grundschule", label: "Grundschulzeit" },
						{ value: "pubertaet", label: "Beginnende Pubertät (eigenes Tempo)" },
					],
				},
			],
			initialState: {
				monat: "m1",
				fokus: "ueberblick",
				lebensphase: "grundschule",
			},
			goals: [
				{
					id: "g5-schutz",
					title: "Untersuche im 5. Monat den Schutz durch Fruchtblase & Fruchtwasser",
					check: (s) => s.monat === "m5" && s.fokus === "fruchtblase",
					witness: {
						monat: "m5",
						fokus: "fruchtblase",
						lebensphase: "grundschule",
					},
				},
				{
					id: "g5-versorgung",
					title: "Verfolge bis zum 9. Monat die Versorgung über Plazenta & Nabelschnur",
					check: (s) => s.monat === "m9" && s.fokus === "nabelschnur",
					witness: {
						monat: "m9",
						fokus: "nabelschnur",
						lebensphase: "grundschule",
					},
				},
				{
					id: "g5-pubertaet",
					title: "Entdecke die körperlichen und seelischen Veränderungen der Pubertät",
					check: (s) => s.lebensphase === "pubertaet",
					witness: {
						monat: "m1",
						fokus: "ueberblick",
						lebensphase: "pubertaet",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Entwicklung im Mutterleib",
					value:
						s.monat === "m9"
							? "9. Monat (ca. 50 cm, rund 3 300 g): Alle Organe sind bereit für das Leben außerhalb des Bauches."
							: s.monat === "m5"
								? "5. Monat (ca. 25 cm): Das Baby hört schon Stimmen, bewegt Arme und Beine im Fruchtwasser."
								: "1. Monat: Nach der Befruchtung nistet sich der Keim in der Gebärmutter ein; das winzige Herz beginnt zu schlagen.",
				},
				{
					label: "Schutz, Versorgung & Wachsen",
					value:
						s.lebensphase === "pubertaet"
							? "Pubertät: Hormone starten Wachstumsschub, Körperveränderungen und Wunsch nach Mitbestimmung – bei jedem Kind im eigenen Tempo!"
							: s.fokus === "fruchtblase"
								? "Fruchtblase & Fruchtwasser dämpfen Stöße und halten das Baby angenehm warm."
								: s.fokus === "nabelschnur"
									? "Plazenta & Nabelschnur übertragen Sauerstoff und Nährstoffe ohne Vermischung der Blutkreisläufe."
									: "Gebärmutter schützt das heranwachsende Leben rund 40 Wochen lang.",
				},
			],
		},
		stamp: {
			id: "stamp-wachsen",
			title: "Lebensbaum-Stempel",
			subtitle: "Entwicklung & Pubertät verstanden",
			symbol: "🌱",
		},
	},
	{
		id: "erste-hilfe-und-notruf",
		number: 6,
		stageId: "lb2",
		lb: 2,
		sectionCode: "HSU 3/4 · LB 2.1",
		title: "Erste Hilfe leisten & den Notruf 112 absetzen",
		shortTitle: "Erste Hilfe & 112",
		icon: "🚑",
		hook: "Ein Kind stürzt auf dem Schulhof – was tust du zuerst, wie versorgst du kleine Wunden und welche fünf W-Fragen braucht die 112?",
		foundationNote:
			"Aus der 1. und 2. Klasse weißt du schon, wie wichtig Achtsamkeit für deinen Körper ist – jetzt lernst du, im Notfall ruhig und überlegt zu helfen.",
		storyParagraphs: [
			"Erste Hilfe bedeutet nicht, Ärztin oder Arzt zu sein – sondern nicht wegzuschauen! Das Wichtigste zuerst: Ruhe bewahren, auf die eigene Sicherheit achten (z. B. im Straßenverkehr!), die verletzte Person trösten und sofort Erwachsene oder den Rettungsdienst rufen, wenn es ernst ist.",
			"Kleine Verletzungen kannst du schon gut einschätzen: Eine leichte Schürfwunde wird vorsichtig gereinigt und keimfrei mit einem Pflaster oder einer Wundkompresse abgedeckt (niemals mit bloßen Fingern in die Wunde fassen!). Einen Insektenstich im Arm oder eine Prellung kühlst du mit einem feuchten Tuch oder Kühlpack (immer ein Tuch dazwischenlegen, nie Eis direkt auf die Haut!). Bei Nasenbluten setzt man sich aufrecht hin, beugt den Kopf leicht nach vorn und legt ein kaltes Tuch in den Nacken. Bei Schwindel/Kreislaufschwäche hilft: Hinlegen, Beine hochlagern und zudecken.",
			"Ist eine Person bewusstlos, atmet aber normal, bringt man sie in die stabile Seitenlage, damit die Atemwege frei bleiben, hält sie warm (Rettungsdecke) und wählt sofort kostenfrei in ganz Europa den Notruf 112! Dabei helfen die 5 W-Fragen: 1. Wo ist es passiert? 2. Was ist passiert? 3. Wie viele Verletzte? 4. Welche Verletzungen? 5. Warten auf Rückfragen (erst auflegen, wenn die Leitstelle es sagt!).",
		],
		factCards: [
			{
				icon: "☎️",
				title: "Notruf 112 & 5 W-Fragen",
				text: "Wo? Was? Wie viele? Welche Art der Verletzung? Warten auf Rückfragen! Europaweit kostenlos.",
			},
			{
				icon: "🩹",
				title: "Kleine Verletzungen",
				text: "Schürfwunde keimfrei mit Pflaster abdecken; Prellung/Stich am Arm kühlen; Nasenbluten: Kopf nach vorn!",
			},
			{
				icon: "🛟",
				title: "Schock & Bewusstlosigkeit",
				text: "Kreislaufschwäche: Beine hochlagern & wärmen. Bewusstlos mit normaler Atmung: stabile Seitenlage + 112!",
			},
		],
		workedExample: {
			title: "Fahrradsturz am Parkweg – der richtige 112-Anruf",
			scenario:
				"Beim Radfahren am Stadtpark (Eingang Lindenstraße 12) ist ein Erwachsener schwer gestürzt. Er antwortet nicht auf Ansprechen, atmet aber ruhig.",
			steps: [
				"Eigene Sicherheit prüfen, eine weitere Person um Hilfe bitten und prüfen: Spricht er? Atmet er normal?",
				"Stabile Seitenlage herstellen, damit die Zunge die Atemwege nicht versperrt, und vor Auskühlung schützen.",
				"112 wählen und ruhig sagen: ‚Stadtpark am Eingang Lindenstraße 12 – Fahrradsturz – eine Person – bewusstlos, atmet normal‘ – danach am Telefon auf Rückfragen warten!",
			],
			conclusion:
				"Schon Kinder können durch Trost, klare Ortsangabe und den Notruf 112 Leben retten!",
		},
		merksatz:
			"Europaweiter Notruf für Rettungsdienst und Feuerwehr: 112 (Wo? Was? Wie viele? Welche Verletzungen? Warten auf Rückfragen!). Kleine Wunden keimfrei abdecken, Schwellungen kühlen, Bewusstlose mit Atmung in die stabile Seitenlage bringen.",
		probenWissen: [
			{
				term: "Notruf 112",
				definition:
					"Kostenlose Notrufnummer für Feuerwehr und Rettungsdienst in Deutschland und der gesamten EU.",
			},
			{
				term: "Die 5 W-Fragen",
				definition:
					"Wo geschah es? Was geschah? Wie viele Verletzte? Welche Verletzungen? Warten auf Rückfragen!",
			},
			{
				term: "Stabile Seitenlage",
				definition:
					"Lagerung für eine bewusstlose, aber normal atmende Person, damit Atemwege frei bleiben.",
			},
			{
				term: "Nasenbluten-Regel",
				definition:
					"Aufrecht sitzen, Kopf leicht nach vorn beugen (Blut nicht schlucken!) und Nacken kühlen.",
			},
		],
		realWorldQuest:
			"Schau zu Hause mit deinen Eltern nach, wo euer Verbandskasten liegt, was darin enthalten ist (Pflaster, Mullbinde, Rettungsdecke, Einmalhandschuhe) und ob das Haltbarkeitsdatum noch stimmt!",
		quickCheck: {
			question:
				"Warum darfst du beim Notruf 112 nach deinen Angaben nicht sofort auflegen?",
			options: [
				"Weil das 5. W ‚Warten auf Rückfragen‘ heißt – die Leitstelle fragt oft noch wichtige Details zum Weg.",
				"Weil der Anruf erst nach fünf Minuten kostenlos wird.",
				"Weil man am Telefon selbst den Krankenwagen lenken muss.",
			],
			correctIndex: 0,
			explanation:
				"Das Gespräch beendet immer die Rettungsleitstelle! Sie gibt dir oft auch beruhigende Anleitungen bis zum Eintreffen der Hilfe.",
		},
		lab: {
			title: "Erste-Hilfe-Koffer & 112-Leitstelle",
			intro:
				"Wähle zu jedem Fall die passende Erste-Hilfe-Maßnahme und entscheide richtig über den Notruf!",
			controls: [
				{
					key: "fall",
					label: "Unfall-Situation",
					options: [
						{ value: "knie", label: "Kleine Schürfwunde am Knie" },
						{ value: "stich", label: "Wespenstich an der Hand (keine Allergie)" },
						{
							value: "bewusstlos",
							label: "Person ist bewusstlos, atmet aber normal",
						},
					],
				},
				{
					key: "hilfe",
					label: "Gewählte Maßnahme",
					options: [
						{ value: "nichts", label: "Abwarten und weitergehen" },
						{
							value: "pflaster",
							label: "Trösten, reinigen & keimfrei mit Pflaster abdecken",
						},
						{
							value: "kuehlen",
							label: "Mit feuchtem Tuch oder umwickeltem Kühlpack kühlen",
						},
						{
							value: "seitenlage",
							label: "Stabile Seitenlage, wärmen & sofort Hilfe holen",
						},
					],
				},
				{
					key: "telefon",
					label: "Telefon-Entscheidung",
					options: [
						{ value: "keinNotruf", label: "Eltern/Lehrkraft informieren (kein 112)" },
						{
							value: "notruf112",
							label: "112 wählen, 5 W-Fragen nennen & am Hörer warten",
						},
					],
				},
			],
			initialState: {
				fall: "knie",
				hilfe: "nichts",
				telefon: "keinNotruf",
			},
			goals: [
				{
					id: "g6-wunde",
					title: "Versorge die kleine Schürfwunde am Knie fachgerecht ohne 112-Fehlalarm",
					check: (s) =>
						s.fall === "knie" &&
						s.hilfe === "pflaster" &&
						s.telefon === "keinNotruf",
					witness: {
						fall: "knie",
						hilfe: "pflaster",
						telefon: "keinNotruf",
					},
				},
				{
					id: "g6-stich",
					title: "Kühle den Wespenstich an der Hand richtig",
					check: (s) =>
						s.fall === "stich" &&
						s.hilfe === "kuehlen" &&
						s.telefon === "keinNotruf",
					witness: {
						fall: "stich",
						hilfe: "kuehlen",
						telefon: "keinNotruf",
					},
				},
				{
					id: "g6-notfall",
					title: "Handle bei Bewusstlosigkeit mit stabiler Seitenlage und Notruf 112",
					check: (s) =>
						s.fall === "bewusstlos" &&
						s.hilfe === "seitenlage" &&
						s.telefon === "notruf112",
					witness: {
						fall: "bewusstlos",
						hilfe: "seitenlage",
						telefon: "notruf112",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Versorgungs-Check",
					value:
						s.fall === "knie" && s.hilfe === "pflaster"
							? "Super: Keimfrei abgedeckt und getröstet!"
							: s.fall === "stich" && s.hilfe === "kuehlen"
								? "Super: Kühlen lindert Schwellung und Schmerz!"
								: s.fall === "bewusstlos" && s.hilfe === "seitenlage"
									? "Lebensrettend: Stabile Seitenlage hält die Atemwege frei!"
									: "Noch nicht passend: Wähle die richtige Maßnahme für genau diesen Fall.",
				},
				{
					label: "Leitstellen-Check",
					value:
						s.fall === "bewusstlos"
							? s.telefon === "notruf112"
								? "Richtig: Bewusstlosigkeit ist ein echter Notfall für die 112!"
								: "Achtung: Bei Bewusstlosigkeit sofort 112 wählen!"
							: s.telefon === "keinNotruf"
								? "Richtig: Für kleine Schrammen hält man die Notrufleitung 112 frei."
								: "Hinweis: Die 112 ist für echte Notfälle – hier helfen Eltern oder Lehrkräfte.",
				},
			],
		},
		stamp: {
			id: "stamp-erstehilfe",
			title: "112-Retterstern",
			subtitle: "Erste Hilfe & Notruf sicher geübt",
			symbol: "🚑",
		},
	},
	{
		id: "gefuehle-grenzen-wohlbefinden",
		number: 7,
		stageId: "lb2",
		lb: 2,
		sectionCode: "HSU 3/4 · LB 2.1 & 2.2",
		title: "Starke Gefühle, eigene Grenzen & Wohlbefinden",
		shortTitle: "Gefühle & Grenzen",
		icon: "💛",
		hook: "Warum darfst du immer ‚Nein!‘ sagen, wenn dir eine Nähe unangenehm ist – und wieso sehen Menschen auf Werbeplakaten oft unnatürlich makellos aus?",
		foundationNote:
			"Aus der 1. und 2. Klasse kennst du schon Wut-Stopp-Tricks und weißt, dass Gefühle wichtige Signale deines Körpers sind.",
		storyParagraphs: [
			"Freude, Stolz, Neugier, aber auch Trauer, Angst oder Ärger gehören zum Leben. Wer achtsam auf seine Gefühle hört, merkt früh, was ihm guttut und wann ein ‚Bauchgefühl‘ warnt. Besonders wichtig ist die körperliche Selbstbestimmung: Dein Körper gehört dir! Du entscheidest selbst über Nähe und Berührungen – und achtest genauso die körperlichen Grenzen anderer Kinder.",
			"Wir unterscheiden gute Geheimnisse (wie eine schöne Geburtstagsüberraschung, die bald aufgelöst wird und Freude macht) von schlechten Geheimnissen, die Angst, Druck oder Bauchschmerzen auslösen. Wenn dir jemand unangenehm nahekommt oder verlangt ‚Das darfst du niemandem erzählen!‘, gilt: Sag laut und deutlich ‚Stopp! Ich will das nicht!‘, geh weg und vertraue dich sofort einer erwachsenen Vertrauensperson an – Hilfe holen ist niemals Petzen!",
			"Zum Wohlbefinden gehört auch ein gesunder Blick auf dich selbst. In Werbung und sozialen Medien werden Gesichter und Körper mit Licht und Bildbearbeitung geglättet. Solche künstlichen Schönheitsideale entsprechen nicht der Wirklichkeit! Jeder Mensch ist wertvoll – ganz gleich ob groß, klein, mit Brille, Sommersprossen oder im Rollstuhl. Aktive Freizeit draußen an der frischen Luft, im Sportverein, beim Musizieren oder mit Freunden stärkt Körper und Seele.",
		],
		factCards: [
			{
				icon: "🛑",
				title: "Mein Körper gehört mir",
				text: "Du hast das Recht, bei unangenehmer Nähe klar ‚Nein!‘ zu sagen – und respektierst auch jedes ‚Stopp!‘ anderer.",
			},
			{
				icon: "🗣️",
				title: "Gute vs. schlechte Geheimnisse",
				text: "Macht ein Geheimnis Angst oder Druck, darfst und sollst du es immer einer Vertrauensperson erzählen.",
			},
			{
				icon: "🚲",
				title: "Echt statt gefiltert",
				text: "Werbebilder sind bearbeitet. Bewegung, Freunde, Hobbys und Erholung schenken echtes Wohlbefinden.",
			},
		],
		workedExample: {
			title: "Selbstwahrnehmung, Fremdwahrnehmung & Medienfilter",
			scenario:
				"Klara findet auf einem Werbeplakat für Sportkleidung kein einziges Sommersprossen-Gesicht und denkt erst: ‚Mit meinen Sommersprossen sehe ich komisch aus.‘",
			steps: [
				"Selbstwahrnehmung (wie Klara sich gerade kritisch sieht) und Fremdwahrnehmung (ihre Freunde mögen ihr offenes Lachen) unterscheiden sich oft stark.",
				"Auf Werbefotos werden Hautmerkmale meist digital wegretuschiert, um Produkte zu verkaufen.",
				"Beim gemeinsamen Nachmittag im Kletterpark zählt nicht ein Werbefilter, sondern was ihr Körper kann und wie viel Spaß alle zusammen haben.",
			],
			conclusion:
				"Schönheitsideale aus der Werbung sind künstlich gemacht – echte Vielfalt und aktive Freizeit machen stark.",
		},
		merksatz:
			"Dein Körper gehört dir: Du achtest die Grenzen anderer und forderst deine eigenen Grenzen ein. Schlechte Geheimnisse darfst du immer einer Vertrauensperson sagen. Künstliche Schönheitsideale hinterfragen wir kritisch.",
		probenWissen: [
			{
				term: "Körperliche Selbstbestimmung",
				definition:
					"Das Recht jedes Menschen, selbst über den eigenen Körper und über Berührungen zu bestimmen.",
			},
			{
				term: "Gutes vs. schlechtes Geheimnis",
				definition:
					"Gute Geheimnisse machen Vorfreude (z. B. Geschenk); schlechte Geheimnisse machen Angst oder Druck und dürfen weitererzählt werden.",
			},
			{
				term: "Selbst- und Fremdwahrnehmung",
				definition:
					"Selbstwahrnehmung ist das eigene Bild von sich; Fremdwahrnehmung ist, wie andere Personen uns erleben.",
			},
			{
				term: "Schönheitsideal",
				definition:
					"Zeit- und medienabhängige Vorstellung von ‚perfektem‘ Aussehen, oft durch Bildbearbeitung künstlich erzeugt.",
			},
		],
		realWorldQuest:
			"Überlege dir drei feste Vertrauenspersonen (z. B. in der Familie, in der Schule, in der Verwandtschaft) und entdecke ein aktives Freizeitangebot in deiner Wohnumgebung (z. B. Bolzplatz, Bücherei, Jugendfeuerwehr, Schwimmverein)!",
		quickCheck: {
			question:
				"Was unterscheidet ein schlechtes Geheimnis von einem guten Geheimnis?",
			options: [
				"Ein schlechtes Geheimnis löst Angst, Druck oder ein ungutes Gefühl aus – man darf und soll sich sofort Hilfe bei einer Vertrauensperson holen.",
				"Ein schlechtes Geheimnis ist eine fröhliche Überraschungsparty zum Geburtstag.",
				"Ein schlechtes Geheimnis muss man für immer ganz allein behalten.",
			],
			correctIndex: 0,
			explanation:
				"Wenn jemand Druck ausübt oder dir etwas Angst macht, brichst du kein Versprechen, wenn du dir Hilfe bei Erwachsenen holst – das ist dein gutes Recht!",
		},
		lab: {
			title: "Gefühle-Kompass & Foto-Entzauberer",
			intro:
				"Entlarve das geschönte Werbeplakat, übe eine klare Grenz-Reaktion und plane einen gesunden, aktiven Nachmittag!",
			controls: [
				{
					key: "plakat",
					label: "Foto-Prüfer",
					options: [
						{ value: "filter", label: "Retuschiertes Werbeplakat glauben" },
						{ value: "echt", label: "Filter aufdecken: echte Vielfalt sehen" },
					],
				},
				{
					key: "grenze",
					label: "Reaktion bei einem ‚schlechten Geheimnis‘",
					options: [
						{ value: "schweigen", label: "Aus Angst still bleiben" },
						{
							value: "hilfeHolen",
							label: "Klar ‚Stopp!‘ sagen & Vertrauensperson einweihen",
						},
					],
				},
				{
					key: "freizeit",
					label: "Nachmittags-Gestaltung",
					options: [
						{ value: "nurSofa", label: "4 Stunden allein vor dem Bildschirm" },
						{
							value: "aktiv",
							label: "Draußen bewegen, Freunde treffen & Erholungspause",
						},
					],
				},
			],
			initialState: {
				plakat: "filter",
				grenze: "schweigen",
				freizeit: "nurSofa",
			},
			goals: [
				{
					id: "g7-filter",
					title: "Decke mit dem Foto-Prüfer die künstliche Bildbearbeitung auf",
					check: (s) => s.plakat === "echt",
					witness: {
						plakat: "echt",
						grenze: "schweigen",
						freizeit: "nurSofa",
					},
				},
				{
					id: "g7-grenze",
					title: "Wähle die starke Schutz-Reaktion bei einem schlechten Geheimnis",
					check: (s) => s.grenze === "hilfeHolen",
					witness: {
						plakat: "filter",
						grenze: "hilfeHolen",
						freizeit: "nurSofa",
					},
				},
				{
					id: "g7-wohlbefinden",
					title: "Kombiniere echte Vielfalt, klare Grenzen und aktive Freizeit",
					check: (s) =>
						s.plakat === "echt" &&
						s.grenze === "hilfeHolen" &&
						s.freizeit === "aktiv",
					witness: {
						plakat: "echt",
						grenze: "hilfeHolen",
						freizeit: "aktiv",
					},
				},
			],
			readouts: (s) => [
				{
					label: "Körperbild & Selbstschutz",
					value:
						s.plakat === "echt" && s.grenze === "hilfeHolen"
							? "Ich-Stärke aktiv: Du durchschaust Werbefilter und schützt deine Grenzen!"
							: s.grenze === "hilfeHolen"
								? "Stark gehandelt: Hilfe holen bei schlechten Geheimnissen ist mutig und richtig."
								: "Prüfe das Werbebild kritisch und hole bei unguten Gefühlen immer Hilfe.",
				},
				{
					label: "Wohlbefinden-Balance",
					value:
						s.freizeit === "aktiv"
							? "Ausgeglichen: Bewegung im Freien, Gemeinschaft und Ruhe tun gut!"
							: "Zu einseitig: Dein Körper braucht Bewegung, frische Luft und echte Begegnungen.",
				},
			],
		},
		stamp: {
			id: "stamp-wohlbefinden",
			title: "Stärke-Kompass",
			subtitle: "Gefühle, Grenzen & Wohlbefinden gestärkt",
			symbol: "💛",
		},
	},
];
