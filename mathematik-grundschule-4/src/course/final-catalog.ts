import type { ForestLesson } from "./catalog";
export const FINAL_LESSONS: ForestLesson[] = [
	{
		id: "daten-sammeln-darstellen",
		world: "chance",
		title: "Milos Datensammlung",
		shortTitle: "Daten sammeln und darstellen",
		icon: "▥",
		lead: "Sammle Modellbeobachtungen, ordne sie in Kategorien und baue dein eigenes beschriftetes Säulendiagramm.",
		goals: [
			"Beobachtungen in Kategorien zählen",
			"Häufigkeiten mit einer passenden Skala darstellen",
			"Eine Sammlung einzeln erfassen und zusammenfassen",
		],
		evidenceGoals: [
			"Kategorien einer Modellsammlung vollständig zählen",
			"Häufigkeiten und Skalenstufen unterscheiden",
			"Daten zusammenfassen und die Erfassung begründen",
		],
		paragraphs: [
			"Daten entstehen aus Beobachtungen oder Antworten auf eine Frage. Lege vor dem Sammeln fest, was du zählen möchtest und welche Kategorien passen. In Milos Modellsammlung gehört jede Frucht genau zu einer der Kategorien Äpfel, Birnen oder Pflaumen.",
			"Mit einer Strichliste oder Tabelle kannst du geordnet zählen. Jeder Eintrag wird genau einmal berücksichtigt. Häufigkeit bedeutet hier: Wie oft kommt eine Kategorie vor? Addiere die Häufigkeiten als Kontrolle und vergleiche mit der Zahl aller Beobachtungen.",
			"Ein Säulendiagramm macht Häufigkeiten vergleichbar. Die Kategorien brauchen Namen, die Zahlen eine Einheit und die Achse eine erkennbare Skala. Gleiche Häufigkeiten ergeben gleich hohe Säulen. Eine kleine Skalenstufe kann ein Stück oder auch zwei Stück bedeuten.",
			"In der Werkstatt deckst du Beobachtungen einzeln auf und veränderst die Säulen selbst. Diese Sammlung ist ein Modell in der App. Eine echte Sammlung zu Hause oder eine Befragung planst du mit anderen; sie wird nicht automatisch beobachtet oder hochgeladen. Formuliere dazu auch eine eigene Frage.",
		],
		example:
			"In einer Modellsammlung liegen 4 Äpfel, 6 Birnen und 3 Pflaumen. Die Tabelle hat die Häufigkeiten 4, 6 und 3; zusammen sind es 13 Früchte. Bei einer Skalenstufe von einem Stück sind die Säulen 4, 6 und 3 Stufen hoch. Die Achse und die Kategorien bleiben beschriftet.",
		takeaway:
			"Jede Beobachtung genau einmal zählen. Kategorien, Einheit und Skala beschriften; Häufigkeiten ergeben zusammen die Gesamtzahl.",
		transfer:
			"Ergänze fehlende Häufigkeiten aus einer Gesamtzahl und lies Diagramme mit größeren Skalenstufen. Die Zahl der Stufen ist nicht immer die Zahl der Stücke.",
		quiz: {
			goal: 2,
			prompt:
				"Eine Säule reicht über vier kleine Skalenstufen. Eine Stufe bedeutet zwei Stück. Welche Häufigkeit zeigt sie?",
			choices: [
				{ label: "8 Stück.", correct: true },
				{ label: "4 Stück, unabhängig von der Skala.", correct: false },
				{ label: "2 Stück, weil das die Skalenstufe ist.", correct: false },
			],
			explanation:
				"Vier Stufen zu je zwei Stück ergeben 4 · 2 = 8 Stück. Erst die Skala lesen, dann die Höhe deuten.",
		},
		parentPrompt:
			"Lege eine klare Frage für eine kleine Sammlung fest, bilde passende Kategorien und erstelle eine Strichliste oder ein Diagramm. Vergleiche mit der Gesamtzahl. Die App bestätigt keine reale Befragung.",
	},
	{
		id: "tabellen-diagramme-auswerten",
		world: "chance",
		title: "Milos Tabellenblick",
		shortTitle: "Tabellen und Diagramme auswerten",
		icon: "▤",
		lead: "Milo verbindet Fahrpläne, Preislisten und Diagramme. Manche Antworten kannst du lesen, andere musst du aus mehreren Angaben erschließen.",
		goals: [
			"Eine Diagrammskala lesen und Unterschiede bestimmen",
			"Fahrtzeit und Aufenthalt aus einem Fahrplan berechnen",
			"Fehlende Angaben oder Preise aus Quellen erschließen",
		],
		paragraphs: [
			"Lies bei einer Tabelle die Überschriften und Einheiten mit. In einem Diagramm prüfst du Kategorien, Startpunkt und Skala. Gleich lange Abschnitte bedeuten gleiche Zahlenabstände. Eine doppelt so hohe Säule bedeutet nur dann doppelt so viele, wenn die Skala dazu passt und bei 0 beginnt.",
			"Eine Differenz ist eine neue Information: Wenn A 6 und B 12 Besucher hat, sind es bei B 6 mehr. Die Summe 18 beantwortet dagegen die Frage nach beiden Ständen zusammen. Überlege zuerst, welche Frage du mit den vorhandenen Angaben beantworten kannst.",
			"Ein Fahrplan nennt Zeitpunkte. Die Reisezeit dazwischen ist eine Zeitspanne. Unterscheide reine Fahrtzeit und einen Aufenthalt. Liegt die Ankunft nach Mitternacht, gehört der nächste Tag dazu. Eine Stunde hat 60 Minuten, keine hundert.",
			"Aus Gesamtzahl und bekannten Teilen kannst du einen fehlenden Teil berechnen. Zwei Quellen können sich ergänzen: Die Zahl gleicher Hefte und ihr Stückpreis ergeben den Gesamtpreis. Bei gleichem Stückpreis ohne Rabatt verdoppelt sich der Preis mit der Menge. Eigene sinnvolle Fragen zu Daten besprichst du zusätzlich mit anderen.",
		],
		example:
			"Ein Modellfahrplan zeigt Abfahrt 08:10 Uhr, Ankunft am Zwischenhalt 08:35 Uhr, Weiterfahrt 08:45 Uhr und Zielankunft 09:15 Uhr. Die Fahrten dauern 25 und 30 min, der Aufenthalt 10 min. Zusammen sind es 65 min Reisezeit, davon 55 min reine Fahrt.",
		takeaway:
			"Überschriften, Einheiten und Skala lesen. Für eine neue Frage verknüpfst du passende Angaben; Fahrtzeit und Aufenthalt bleiben unterscheidbar.",
		transfer:
			"Rechne auch über Mitternacht und erschließe eine fehlende Häufigkeit aus einer Gesamtzahl. Die fehlende Säulenhöhe wird nicht als fertiger Wert angezeigt.",
		quiz: {
			goal: 1,
			prompt:
				"Stand A hat 6 Besucher, Stand B hat 12. Welche Antwort passt zur Frage: Wie viele mehr hat B?",
			choices: [
				{ label: "6 Besucher mehr.", correct: true },
				{ label: "18 Besucher mehr: beide Zahlen addieren.", correct: false },
				{ label: "12 Besucher mehr: nur B ablesen.", correct: false },
			],
			explanation:
				"Gesucht ist der Unterschied: 12 − 6 = 6. Die Summe würde eine andere Frage beantworten.",
		},
		parentPrompt:
			"Lies gemeinsam eine Preisliste oder einen Fahrplan und erfinde zwei beantwortbare mathematische Fragen. Benenne die benötigten Angaben und begründe deinen Rechenweg.",
	},
	{
		id: "zufallsexperimente",
		world: "chance",
		title: "Milos Kugelgarten",
		shortTitle: "Zufallsexperimente und Chancen",
		icon: "✧",
		lead: "Vermute, ziehe und protokolliere. Entdecke, warum eine größere Chance noch keine sichere nächste Farbe bedeutet.",
		goals: [
			"Chancen aus dem Beutelinhalt einschätzen",
			"Geänderte Bedingungen vergleichen",
			"Beobachtungen zählen und Vorhersagen begrenzen",
		],
		paragraphs: [
			"Bei einem Zufallsexperiment kennst du mögliche Ergebnisse, aber nicht das einzelne nächste Ergebnis sicher. Unsere Beutel enthalten rote und blaue Kugeln. Alle sind gleich groß und gleich gut zu greifen; nach jeder Ziehung wird die Kugel zurückgelegt und neu gemischt.",
			"Mehr Kugeln einer Farbe bedeuten unter diesen Bedingungen eine größere Chance auf diese Farbe. Bei gleichen Anzahlen sind die Chancen gleich. Vergleiche zwei Beutel hier nur dann direkt über die Zahl roter Kugeln, wenn beide gleich viele Kugeln insgesamt enthalten.",
			"Schreibe oder wähle vor dem Versuch eine Vermutung. Sie darf sich im Versuch als unpassend erweisen. Zähle danach die beobachteten Farben und vergleiche mit dem Beutelinhalt. Eine kurze Reihe muss die Chancen nicht genau abbilden: Auch bei gleichen Chancen können die Häufigkeiten verschieden sein.",
			"Wenn du Kugeln zurücklegst und neu mischst, erzwingen frühere Ergebnisse keine nächste Farbe. Nach mehreren roten Ziehungen muss Blau nicht ausgleichen. Verändere die Beutelzusammensetzung systematisch und untersuche die neuen Bedingungen. In der App bleibt dein angefangener Modellversuch beim Weiterlernen erhalten; für reale Versuche brauchst du geeignetes Material.",
		],
		example:
			"Beutel A enthält 1 rote und 3 blaue Kugeln. Blau hat die größere Chance, Rot ist trotzdem möglich. Beutel B enthält 3 rote und 1 blaue Kugel; bei gleicher Gesamtzahl ist dort die Chance auf Rot größer. Zwölf Ziehungen können schwanken und garantieren keine bestimmte dreizehnte Farbe.",
		takeaway:
			"Beutelbedingungen bestimmen Chancen. Beobachtete Häufigkeiten beschreiben eine Reihe; eine größere Chance ist keine Garantie für die nächste Ziehung.",
		transfer:
			"Beurteile Chancen nach zurückgelegten Ziehungen, ändere Beutelbedingungen und unterscheide zwei beobachtete Reihen von einer sicheren Vorhersage.",
		quiz: {
			goal: 3,
			prompt:
				"Aus einem Beutel mit Rot und Blau wurde fünfmal Rot gezogen, jedes Mal zurückgelegt und gemischt. Muss jetzt Blau kommen?",
			choices: [
				{
					label:
						"Nein. Die nächste Farbe ist nicht sicher; der Beutelinhalt ist unverändert.",
					correct: true,
				},
				{
					label: "Ja. Blau muss die fünf roten Ziehungen sofort ausgleichen.",
					correct: false,
				},
				{
					label: "Nein, denn ab jetzt kommt garantiert nur noch Rot.",
					correct: false,
				},
			],
			explanation:
				"Das Zurücklegen erhält die Bedingungen. Die vorigen Farben erzwingen bei neuem Mischen keine nächste Farbe.",
		},
		parentPrompt:
			"Vermute vor einem sicheren Beutel- oder Würfelversuch, führe mehrere Versuche durch und protokolliere. Verändert genau eine Bedingung und vergleicht. Echte Versuche werden nicht von der App beobachtet.",
	},
	{
		id: "expedition-werkstatt",
		world: "expedition",
		title: "Milos neue Werkstatt",
		shortTitle: "Expedition: Werkstatt ausstatten",
		icon: "⚒",
		lead: "Plane Material, Einkauf und Transport für Milos Werkstatt. Wähle Hilfen und verbinde mehrere Rechenschritte mit der Geschichte.",
		goals: [
			"Ganze Werkstücke und Materialbedarf planen",
			"Teilpreise und genaues Budget prüfen",
			"Gewichtsgrenzen mit ganzen Kisten einhalten",
		],
		paragraphs: [
			"Lies zuerst, was gesucht ist und welche Angaben wichtig sind. Für gleich lange Leisten brauchst du ihre Anzahl, die Länge einer Leiste und die Länge eines Bretts. Wandle Längen in dieselbe Einheit um, bevor du planst. In diesen Modellen wird ohne Schnittverlust gerechnet.",
			"Eine Leiste muss als ganzes Stück auf ein Brett passen. Bei 200 cm Brettlänge passen drei 60-cm-Leisten, aber keine vier. Die reine Gesamtlänge kann irreführen, wenn Reststücke nicht zusammengesetzt werden dürfen. Ein zusätzlich angebrochenes Brett zählt als ganzes gekauftes Brett.",
			"Eine Preisliste verbindet Stückzahl und Stückpreis. Berechne die Teilpreise und addiere sie. Rechne für ein knappes Budget genau in Cent und prüfe das Ergebnis. Die Modellpreise sind Übungsangaben; in der App gibt es keinen echten Kauf.",
			"Beim Transport zählt die Masse der vollen Kiste, also Inhalt plus Verpackung. Jede Kiste bleibt ganz und die Grenze je Fahrt darf nicht überschritten werden. Eine Tabelle, eine Skizze oder eine Rechnung auf Papier können dir helfen. Erkläre, warum deine ganze Zahl an Brettern oder Fahrten tatsächlich ausreicht.",
		],
		example:
			"Sieben Leisten zu je 60 cm sollen aus 2-m-Brettern geschnitten werden. Auf ein Brett passen drei ganze Leisten. Zwei Bretter liefern nur sechs; deshalb brauchst du drei Bretter. Bei 2 € je Brett sind das 6 €. Die Leisten selbst sind zusammen 420 cm lang, doch diese Summe allein entscheidet nicht die Brettanzahl.",
		takeaway:
			"Ganze Werkstücke und Grenzen beachten. Erst passende Einheiten und Teilrechnungen wählen, dann ganze Vorräte ausreichend planen und die Geschichte prüfen.",
		transfer:
			"Verbinde die Materialplanung mit Kosten und berücksichtige beim Transport auch die leere Kiste. Werkzeuge zeigen Angaben, keine fertige Lösung.",
		quiz: {
			goal: 1,
			prompt:
				"Auf ein Brett passen drei ganze Leisten. Du brauchst sieben. Wie viele Bretter sind mindestens nötig?",
			choices: [
				{
					label: "Drei Bretter, weil zwei nur sechs Leisten liefern.",
					correct: true,
				},
				{
					label:
						"Zwei Bretter, weil sieben näher bei sechs als bei neun liegt.",
					correct: false,
				},
				{
					label:
						"Sieben Bretter, weil immer nur eine Leiste auf ein Brett passt.",
					correct: false,
				},
			],
			explanation:
				"Nach zwei Brettern fehlt noch eine Leiste. Dafür musst du ein drittes ganzes Brett einplanen.",
		},
		parentPrompt:
			"Plane mit Papierstreifen oder ungefährlichem Bastelmaterial eine kleine Ausstattung. Erkläre Reste, ganze Packungen und eine Preisrechnung. Reales Sägen oder Transportieren gehört nicht zur App-Aufgabe.",
	},
	{
		id: "expedition-reise",
		world: "expedition",
		title: "Milos Inselreise",
		shortTitle: "Expedition: Eine Reise planen",
		icon: "⚑",
		lead: "Verbinde Wege, Uhrzeiten, Tickets und Sitzplätze zu einem nachvollziehbaren Reiseplan.",
		goals: [
			"Weglänge und Dauer aus einem Plan bestimmen",
			"Abfahrt und Ankunft mit Wartezeit berechnen",
			"Ticketkosten und ganze Boote planen",
		],
		paragraphs: [
			"Ein Lageplan gibt Abstände und Orientierung an. Für einen Weg mit einer Ecke zählst du beide Abschnitte; die Luftlinie ist eine andere Strecke. Die wirkliche Länge ergibt sich aus der Bedeutung eines Planabstands. Lies die Legende, statt Zentimeter am Bildschirm zu messen.",
			"Ein Zeitplan verbindet Startzeit und Dauern. Zähle Fußweg, mögliche Wartezeit und Bootsfahrt mit. Eine Uhrzeit ist ein Zeitpunkt, eine Dauer eine Zeitspanne. Du kannst eine Startuhr öffnen und eine Zeitleiste auf Papier zeichnen; eine Stunde hat 60 Minuten.",
			"Die Preise für Kinder und Erwachsene können verschieden sein. Berechne die beiden Gruppenpreise und addiere in derselben Einheit. Ein doppelt so teures Erwachsenenticket kostet das Zweifache eines Kindertickets; es bedeutet nicht, dass du die Zahl der Erwachsenen verdoppeln sollst.",
			"Alle Reisenden brauchen einen Sitzplatz. Passt ein Rest nicht mehr in die schon gezählten Boote, brauchst du ein weiteres ganzes Boot. Kosten und Plätze beantworten verschiedene Fragen. Begründe deinen Plan mit den Angaben; die fiktiven Tickets und Fahrtzeiten sind keine echten Reiseangebote.",
		],
		example:
			"Ein Weg führt drei Planabstände nach Osten und zwei nach Norden. Ein Abstand bedeutet 20 m und ist mit 5 min geplant. Die Strecke ist 100 m lang. Mit einer Pause von 10 min dauert der Weg 5 · 5 min + 10 min = 35 min. Bei einer Startzeit von 08:20 Uhr wäre das Ende 08:55 Uhr.",
		takeaway:
			"Wegabschnitte, Zeiten, Preise und Plätze getrennt bestimmen und sinnvoll verbinden. Ein Rest kann ein weiteres ganzes Boot nötig machen.",
		transfer:
			"Berücksichtige Wartezeiten und kleine Boote mit begrenzten Plätzen. Prüfe die vollständige Reise, nicht nur einen einzelnen Abschnitt.",
		quiz: {
			goal: 2,
			prompt:
				"Du startest um 09:40 Uhr. Der Weg dauert 15 min, dann wartest du 10 min. Wann fährt das Boot ab?",
			choices: [
				{ label: "10:05 Uhr.", correct: true },
				{
					label: "09:65 Uhr, weil Minuten bis hundert zählen.",
					correct: false,
				},
				{
					label: "09:55 Uhr, weil die Wartezeit nicht zur Abfahrt gehört.",
					correct: false,
				},
			],
			explanation:
				"Nach 15 min ist es 09:55 Uhr; weitere 10 min führen über die volle Stunde zu 10:05 Uhr.",
		},
		parentPrompt:
			"Plane eine kurze bekannte Reise auf Papier. Benenne Strecke, Start, Dauer, Wartezeit und Plätze. Prüft die Angaben gemeinsam; die App beobachtet keine echte Reise.",
	},
	{
		id: "expedition-inselfest",
		world: "expedition",
		title: "Milos Inselfest",
		shortTitle: "Expedition: Ein Fest organisieren",
		icon: "✿",
		lead: "Plane Getränke, Sitzplätze, Abstimmung und Zeitablauf für ein kleines Inselfest. Begründe, warum dein Plan reicht.",
		goals: [
			"Getränke und Plätze ausreichend planen",
			"Eine Modellabstimmung mit einer festen Regel auswerten",
			"Einen vollständigen Zeitplan einschließlich Aufräumen berechnen",
		],
		paragraphs: [
			"Ein Festplan beginnt mit der Zahl aller Beteiligten. Helfer gehören bei Getränken und Sitzplätzen dazu. Rechne Portion je Person mal Personenzahl in derselben Einheit. Volle Flaschen und ganze Tische werden ausreichend nach oben eingeplant; ein nicht ganz gefüllter letzter Tisch kann nötig sein.",
			"Für eine Abstimmung muss die Regel vorher feststehen. In unseren Modelldaten hat jede Person genau eine Stimme und die Aktivität mit der höchsten Stimmenzahl wird gewählt. Eine höhere Stimmenzahl ist nicht automatisch mehr als die Hälfte aller Stimmen. Die Aufgaben haben hier einen eindeutigen ersten Platz.",
			"Ein Diagramm braucht Kategorien und eine Skala. Lies alle Häufigkeiten, bestimme die Gesamtzahl und den Vorsprung vor dem zweiten Platz. Modelldaten einer Aufgabe erlauben keine Aussage darüber, was andere Kinder wirklich mögen.",
			"Zum Zeitplan gehören Spiel, Basteln, mögliche Pausen und Aufräumen. Addiere alle Dauern und bestimme daraus die Endzeit. Nutze eine Tabelle oder eine eigene Zeitleiste. Ein vollständiger Plan lässt sich durch Rückwärtsrechnen und die Frage prüfen, ob ein Abschnitt vergessen wurde.",
		],
		example:
			"13 Kinder und 3 Helfer brauchen je 250 ml Wasser. Das sind 16 · 250 ml = 4 000 ml, also vier volle Literflaschen. Bei sechs Plätzen je Tisch reichen zwei Tische nicht für alle 16 Personen; drei sind nötig. Beim Zeitplan zählt auch die Zeit fürs Aufräumen mit.",
		takeaway:
			"Alle Personen und Zeitabschnitte berücksichtigen. Ganze Vorräte ausreichend planen, Diagrammregel vorher klären und Ergebnisse in der Geschichte prüfen.",
		transfer:
			"Plane kleinere Portionen, werte weitere Abstimmungsdaten aus und nimm Pausen in den vollständigen Zeitplan auf.",
		quiz: {
			goal: 1,
			prompt:
				"16 Personen brauchen einen Platz. An einen Tisch passen sechs. Wie viele Tische reichen mindestens?",
			choices: [
				{ label: "Drei Tische.", correct: true },
				{
					label: "Zwei Tische, weil 16 durch 6 ungefähr 2 ist.",
					correct: false,
				},
				{
					label:
						"Sechs Tische, weil die Zahl der Plätze je Tisch die Tischzahl ist.",
					correct: false,
				},
			],
			explanation:
				"Zwei Tische haben zwölf Plätze und reichen nicht. Drei haben 18 Plätze und bieten allen 16 Personen einen Platz.",
		},
		parentPrompt:
			"Entwirf einen kleinen Festplan mit einer selbst gewählten Darstellung. Erfinde eine sinnvolle Frage zu einer Tabelle oder Abstimmung und prüfe, ob Vorräte und Zeit ausreichen. Die App bewertet keine tatsächliche Veranstaltung.",
	},
];
