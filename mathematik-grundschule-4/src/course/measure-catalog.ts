import type { ForestLesson } from "./catalog";
export const MEASURE_LESSONS: ForestLesson[] = [
	{
		id: "laengen-messen",
		world: "measure",
		title: "Milos Bandwerkstatt",
		shortTitle: "Längen messen",
		icon: "↔",
		lead: "Auf dem Messmarkt braucht Milo passende Bänder. Lies das Modell-Lineal und miss danach mit einem echten Lineal.",
		goals: [
			"Längen in cm und mm ablesen",
			"Bei verschobenem Anfang die Differenz bilden",
			"Längen für mehrere Stücke planen",
		],
		paragraphs: [
			"Eine Länge beschreibst du mit einer Maßzahl und einer Einheit. Ein Zentimeter (cm) besteht aus 10 Millimetern (mm). Ein Meter (m) besteht aus 100 cm; ein Kilometer (km) aus 1 000 m. Wähle eine Einheit, die zur Strecke passt.",
			"Lege bei einer echten Messung den Nullstrich am Anfang an, nicht unbedingt den Rand des Lineals. Schau gerade auf die Skala. Zwischen zwei benachbarten cm-Strichen liegen zehn gleich große mm-Abschnitte.",
			"Beginnt ein Band bei 2 cm und endet bei 7 cm, ist es 5 cm lang: 7 cm − 2 cm = 5 cm. Der Endwert allein ist nur dann die Länge, wenn der Anfang bei 0 liegt. Notiere die Einheit mit dem Messergebnis.",
			"Für mehrere gleich lange Bänder multiplizierst du Anzahl und Einzellänge. Reserve addierst du danach. In der Kommaschreibweise sind 1 m 25 cm gleich 1,25 m. Die Abbildung ist ein Modell: Ein Bildschirmzentimeter ist kein echtes Maß.",
		],
		example:
			"Ein Band beginnt bei 13 mm und endet bei 58 mm. Seine Länge ist 58 mm − 13 mm = 45 mm = 4 cm 5 mm. Drei solche Bänder brauchen 135 mm. Für genaues Zuschneiden misst du am echten Material nach.",
		takeaway:
			"Länge = Endwert − Anfangswert. 1 cm = 10 mm; 1 m = 100 cm. Schreibe immer die Einheit dazu.",
		transfer:
			"Miss nun gedanklich mit verschobenem Anfang und plane mehrere Bänder samt Reserve. Die neue Aufgabe verlangt deinen eigenen Rechenweg.",
		quiz: {
			goal: 2,
			prompt: "Ein Band reicht am Lineal von 3 cm bis 9 cm. Wie lang ist es?",
			choices: [
				{ label: "6 cm: 9 cm − 3 cm.", correct: true },
				{ label: "9 cm: Nur das Ende zählt.", correct: false },
				{ label: "12 cm: Anfang und Ende addieren.", correct: false },
			],
			explanation:
				"Der Abstand ist gesucht: 9 cm − 3 cm = 6 cm. Die Strecke vor dem Anfang gehört nicht zum Band.",
		},
		parentPrompt:
			"Miss einen Stift mit einem echten Lineal. Zeige den Nullstrich, lies cm und mm und erkläre die Einheit. Das kann die App nicht überprüfen.",
	},
	{
		id: "masse-fassungsvermoegen",
		world: "measure",
		title: "Milos Waage und Wasserkrug",
		shortTitle: "Masse und Inhalt",
		icon: "⚖",
		lead: "Gewichte auflegen, Becher füllen: Entdecke, was eine Waage und ein Messbecher jeweils messen.",
		goals: [
			"Massen in kg und g zusammensetzen",
			"Inhalte in l und ml bestimmen",
			"Hälften und Viertel von Inhalten bilden",
		],
		paragraphs: [
			"Eine Waage misst Masse. Für einen Apfel passen Gramm (g), für einen gefüllten Rucksack Kilogramm (kg). 1 kg = 1 000 g. Eine schwere Sache braucht nicht besonders groß zu sein: Vergleiche mit bekannten Gegenständen und wiege nach.",
			"Ein Messbecher misst den Inhalt einer Flüssigkeit. Liter (l) und Milliliter (ml) sind Hohlmaße und beschreiben Fassungsvermögen; 1 l = 1 000 ml. Masse und Inhalt sind verschiedene Größen. Aus einer Literangabe allein kennst du nicht die Masse jeder beliebigen Flüssigkeit.",
			"Stelle einen echten Messbecher eben hin und lies die Skala auf Augenhöhe. Gleich große Abstände der Skala bedeuten gleich große Inhaltsunterschiede. Beim Wiegen muss eine leere Schüssel vorher berücksichtigt werden: Ihr Gewicht gehört nicht zum Inhalt.",
			"Zwei Portionen mit je 500 ml ergeben 1 l. Vier Portionen mit je 250 ml ergeben ebenfalls 1 l. Ein halber Liter sind 500 ml, ein Viertelliter sind 250 ml und drei Viertelliter sind 750 ml. Für gleich große Teile teilst du zuerst das Ganze, dann nimmst du die nötigen Teile.",
		],
		example:
			"Ein Beutel enthält 1 kg 200 g und die leere Kiste wiegt 300 g. Zusammen sind das 1 000 g + 200 g + 300 g = 1 500 g = 1 kg 500 g. Bei einem Saftkrug brauchst du stattdessen ml: Drei Becher zu 250 ml enthalten 750 ml.",
		takeaway:
			"1 kg = 1 000 g und 1 l = 1 000 ml. Halte Masse und Fassungsvermögen auseinander; teile ein Ganzes in gleich große Teile.",
		transfer:
			"Berücksichtige jetzt die leere Verpackung, verbleibenden Saft oder mehrere gleich große Teile. Prüfe, welche Größe und welches Messgerät passen.",
		quiz: {
			goal: 3,
			prompt: "Wie viel ist ein Viertel von 1 l?",
			choices: [
				{
					label:
						"250 ml, weil vier gleiche Portionen zusammen 1 000 ml ergeben.",
					correct: true,
				},
				{ label: "400 ml, weil Viertel vier bedeutet.", correct: false },
				{ label: "25 ml, weil ein Liter 100 ml hat.", correct: false },
			],
			explanation:
				"1 l = 1 000 ml. 1 000 ml : 4 = 250 ml; 4 · 250 ml = 1 000 ml.",
		},
		parentPrompt:
			"Fülle Wasser mit einem Messbecher in vier gleich große Portionen und wiege einen Gegenstand. Verwende sichere Gefäße; die App beobachtet diese Handlungen nicht.",
	},
	{
		id: "uhrzeit-zeitspannen",
		world: "measure",
		title: "Milos Uhrenweg",
		shortTitle: "Uhrzeit und Dauer",
		icon: "◷",
		lead: "Milo plant seine Wege. Unterscheide einen Zeitpunkt auf der Uhr von einer Zeitspanne dazwischen.",
		goals: [
			"Zeiger und Tagesabschnitt lesen",
			"Zeitspannen über volle Stunden bestimmen",
			"Anfang, Ende und Sekunden berechnen",
		],
		paragraphs: [
			"Ein Zeitpunkt sagt, wann etwas geschieht: 14:20 Uhr. Eine Zeitspanne sagt, wie lange es dauert: 35 min. Der lange Zeiger zeigt Minuten, der kurze die Stunde. Der kurze Zeiger bewegt sich auch zwischen den vollen Stunden weiter.",
			"Die Uhr hat zwölf Stundenzahlen, der Tag hat 24 Stunden. Die Zeigerstellung von 3 Uhr kann 03:00 oder 15:00 Uhr bedeuten. Lies deshalb den Tagesabschnitt oder die 24-Stunden-Angabe mit. 00:00 Uhr ist der Beginn eines neuen Tages.",
			"Eine Stunde hat 60 Minuten (1 h = 60 min), eine Minute 60 Sekunden (1 min = 60 s). Rechne hier nicht mit Hunderterschritten. 1 h 25 min sind 85 min, nicht 125 min und auch nicht 1,25 h.",
			"Ergänze für eine Dauer zunächst zur vollen Stunde und dann zum Ende. Anfang + Dauer = Ende; Ende − Dauer = Anfang. Geht ein Weg über Mitternacht, berücksichtige den nächsten Tag. Eine Stoppuhr misst eine Dauer, eine Tagesuhr einen Zeitpunkt.",
		],
		example:
			"Von 10:45 bis 12:10 Uhr am selben Tag vergehen zunächst 15 min bis 11 Uhr, dann 60 min bis 12 Uhr und noch 10 min. Zusammen sind es 85 min = 1 h 25 min. Beginnt dieser Weg 25 min früher, endet er auch 25 min früher.",
		takeaway:
			"1 h = 60 min; 1 min = 60 s; 1 Tag = 24 h. Anfang + Dauer = Ende. Beachte Tagesabschnitt und Tageswechsel.",
		transfer:
			"Plane auch rückwärts von einer Ankunft und rechne über Mitternacht. Schreibe Uhrzeiten mit Doppelpunkt und Dauern mit ihren Einheiten.",
		quiz: {
			goal: 2,
			prompt: "Wie lange dauert ein Weg von 09:50 bis 10:15 Uhr am selben Tag?",
			choices: [
				{ label: "25 min: 10 min bis 10 Uhr, dann 15 min.", correct: true },
				{
					label: "65 min: Uhrzeiten wie Hunderterzahlen abziehen.",
					correct: false,
				},
				{ label: "15 min: Nur die Minuten am Ende zählen.", correct: false },
			],
			explanation:
				"Die Dauer ist 10 min + 15 min = 25 min. Eine Stunde hat 60 Minuten.",
		},
		parentPrompt:
			"Plane eine echte kurze Tätigkeit. Lies Anfang und Ende ab, miss ihre Dauer mit einer Uhr oder Stoppuhr und vergleiche mit deiner Vorhersage. Das ist keine digitale Messbeobachtung.",
	},
	{
		id: "geld-einkaufen",
		world: "measure",
		title: "Milos Münzstand",
		shortTitle: "Geld und Einkaufen",
		icon: "◉",
		lead: "Mit Spielgeld wechselst du Beträge und planst einen Einkauf. Es gibt keine echten Käufe.",
		goals: [
			"Euro und Cent gleichwertig darstellen",
			"Gesamtpreis und Rückgeld bestimmen",
			"Stückpreis und Budget vergleichen",
		],
		paragraphs: [
			"Ein Euro entspricht 100 Cent: 1 € = 100 ct. 3 € 5 ct schreibst du 3,05 €, nicht 3,5 €. Hinter dem Komma stehen bei Geldbeträgen üblicherweise zwei Stellen für Cent. 3,50 € sind 3 € 50 ct.",
			"Du kannst einen Betrag auf verschiedene Weise legen. Zwei 50-ct-Münzen haben denselben Wert wie eine 1-€-Münze. Beim Wechseln bleibt der Wert erhalten, auch wenn sich die Zahl der Münzen ändert. Mehr Münzen bedeuten nicht automatisch mehr Geld.",
			"Bei mehreren gleichen Waren berechnest du zuerst Anzahl mal Stückpreis. Verschiedene Waren addierst du. Für das Rückgeld rechnest du bezahlt minus Gesamtpreis. Prüfe: Gesamtpreis plus Rückgeld ergibt den bezahlten Betrag.",
			"Bei gleichen Waren ohne Rabatt kannst du den Stückpreis aus Gesamtpreis und Anzahl bestimmen. Doppelt so viele kosten dann doppelt so viel. Für ein knappes Budget rechne genau in Cent. Ein gerundeter Überschlag reicht für die Größenordnung, aber nicht für jede Kaufentscheidung.",
		],
		example:
			"Ein Heft kostet 1,35 €. Drei Hefte kosten 3 · 135 ct = 405 ct = 4,05 €. Bezahlt Milo mit 5 €, bekommt er 500 ct − 405 ct = 95 ct zurück. Die Probe 405 ct + 95 ct = 500 ct bestätigt den Betrag.",
		takeaway:
			"1 € = 100 ct. Gesamtpreis vor Rückgeld berechnen; Rückgeld = bezahlt − Gesamtpreis. Beim Wechseln bleibt der Wert gleich.",
		transfer:
			"Bestimme nun einen Stückpreis aus einer Preisliste und entscheide, ob das genaue Budget für eine andere Anzahl reicht.",
		quiz: {
			goal: 1,
			prompt: "Welche Schreibweise passt zu 4 € 7 ct?",
			choices: [
				{ label: "4,07 €", correct: true },
				{ label: "4,70 €", correct: false },
				{ label: "47,00 €", correct: false },
			],
			explanation:
				"7 ct sind sieben Hundertstel eines Euro. Die Centstellen heißen 07: 4,07 €.",
		},
		parentPrompt:
			"Lege denselben Betrag zweimal mit verschieden vielen Spielmünzen. Erkläre, warum der Wert gleich bleibt. Bitte keine echten Käufe in der App.",
	},
	{
		id: "einheiten-wechseln",
		world: "measure",
		title: "Milos Einheitenbrücke",
		shortTitle: "Einheiten wechseln",
		icon: "⇆",
		lead: "Auf beiden Seiten der Brücke liegt dieselbe Menge. Nur die Einheit und ihre Maßzahl wechseln.",
		goals: [
			"Längen in km und m wechseln",
			"Massen in kg und g zerlegen",
			"Inhalte in l und ml umwandeln",
		],
		paragraphs: [
			"Eine Größe bleibt gleich, wenn du ihre Einheit wechselst. 2 km und 2 000 m sind dieselbe Strecke. Bei der kleineren Einheit brauchst du die größere Maßzahl. Die Einheit beschreibt, wie groß ein einzelnes Messstück ist.",
			"Für die Brücken dieser Werkstatt gilt: 1 km = 1 000 m, 1 kg = 1 000 g und 1 l = 1 000 ml. Große Einheiten werden in Tausender kleine Einheiten zerlegt. Umgekehrt bündelst du volle Tausender und behältst den Rest.",
			"3 kg 400 g sind 3 · 1 000 g + 400 g = 3 400 g. 2 750 ml sind 2 l 750 ml. Der Rest ist jeweils kleiner als 1 000 kleine Einheiten. So kannst du die Zerlegung mit einer Addition kontrollieren.",
			"Nicht jede Einheit hat einen Tausenderschritt: 1 m = 100 cm, 1 cm = 10 mm, 1 € = 100 ct, 1 h = 60 min. Wähle zuerst den Größenbereich und die passende Beziehung. Wandle niemals kg in l um, ohne weitere Informationen zum Stoff zu haben.",
		],
		example:
			"4 600 m lassen sich in 4 000 m und 600 m zerlegen. 4 000 m sind 4 km, also 4 600 m = 4 km 600 m. Die Probe lautet 4 · 1 000 m + 600 m = 4 600 m. Die Strecke hat sich durch die neue Schreibweise nicht verändert.",
		takeaway:
			"Erst Größenbereich und Umwandlungsschritt prüfen. Ganze große Einheiten plus Rest ergeben die ursprüngliche Größe.",
		transfer:
			"Wechsle nun von der kleinen Einheit zurück zur gemischten Angabe und nutze die Menge für gleich große Portionen. Zeit braucht eigene Umwandlungsschritte.",
		quiz: {
			goal: 2,
			prompt: "Welche Angabe ist genauso viel wie 2 300 g?",
			choices: [
				{ label: "2 kg 300 g", correct: true },
				{ label: "23 kg", correct: false },
				{ label: "2 kg 30 g", correct: false },
			],
			explanation:
				"2 000 g sind 2 kg, dazu bleiben 300 g. Die Probe 2 · 1 000 g + 300 g = 2 300 g stimmt.",
		},
		parentPrompt:
			"Zeige eine Strecke, eine Masse und einen Inhalt mit passenden Einheiten. Erkläre an einer Angabe, warum eine andere Einheit die wirkliche Größe nicht verändert.",
	},
	{
		id: "schaetzen-sachprobleme",
		world: "measure",
		title: "Milos Vorratsplan",
		shortTitle: "Schätzen und Planen",
		icon: "≈",
		lead: "Milo plant eine Pause für seine Freunde. Entscheide, wann eine Schätzung hilft und wann du genau rechnen musst.",
		goals: [
			"Mit Bezugsgrößen nachvollziehbar schätzen",
			"Ganze Vorratspackungen ausreichend planen",
			"Genaue Rechnung und Überschlag passend wählen",
		],
		paragraphs: [
			"Beim Schätzen nutzt du etwas Bekanntes als Bezugsgröße: etwa eine 1-l-Flasche, ein 1-kg-Paket oder deine gemessene Handspanne. Sage, womit du vergleichst. Eine Schätzung ist ungefähr und bekommt trotzdem eine Einheit.",
			"Wenn eine Bank ungefähr sechs Handspannen und eine Handspanne ungefähr 18 cm lang ist, schätzt du 6 · 18 cm, also ungefähr 108 cm. Weil die Angaben ungefähr sind, ist auch das Ergebnis ungefähr. Eine Rechnung macht aus einer Schätzung keine genaue Messung.",
			"Für einen Vorrat brauchst du sinnvolle Angaben: Anzahl der Kinder, Menge je Kind und Inhalt einer Packung. Berechne zunächst den Gesamtbedarf in derselben Einheit. Gibt es nur ganze Flaschen, musst du genug volle Flaschen einplanen, auch wenn eine davon nicht ganz verbraucht wird.",
			"Ein Überschlag prüft die Größenordnung. Beim genauen Zuschneiden, beim Rückgeld oder bei einem knappen Budget brauchst du dagegen ein genaues Ergebnis. Prüfe nach dem Rechnen: Kann die Menge reichen? Welche Angaben fehlen? Andere begründete Schätzungen können ebenfalls sinnvoll sein.",
		],
		example:
			"Für 13 Kinder sind je 250 ml Wasser geplant. Das sind 13 · 250 ml = 3 250 ml. Drei 1-l-Flaschen reichen nicht. Vier Flaschen enthalten 4 000 ml; 750 ml bleiben. Der Vorrat ist ausreichend geplant, aber nicht jedes Kind muss in Wirklichkeit genau gleich viel trinken.",
		takeaway:
			"Schätze mit einer genannten Bezugsgröße. Plane ganze Vorräte ausreichend und rechne bei knappen Grenzen genau nach.",
		transfer:
			"Jetzt ändern sich Portionen und Budgetgrenzen. Begründe deine Entscheidung und überprüfe, ob das Ergebnis zur Geschichte passt.",
		quiz: {
			goal: 2,
			prompt:
				"Du brauchst 2 250 ml Wasser. Es gibt nur volle 1-l-Flaschen. Wie viele brauchst du mindestens?",
			choices: [
				{ label: "3 Flaschen, denn 2 000 ml reichen nicht.", correct: true },
				{
					label: "2 Flaschen, weil 2 250 näher an 2 000 liegt.",
					correct: false,
				},
				{
					label: "225 Flaschen, weil die Einheiten egal sind.",
					correct: false,
				},
			],
			explanation:
				"Zwei Flaschen liefern 2 000 ml. Erst drei Flaschen liefern mindestens 2 250 ml. Du planst nach oben.",
		},
		parentPrompt:
			"Schätze eine sichere Alltagsgröße, nenne deine Bezugsgröße und miss danach nach. Besprecht die Abweichung ohne sie als digitales Messergebnis zu speichern.",
	},
];
