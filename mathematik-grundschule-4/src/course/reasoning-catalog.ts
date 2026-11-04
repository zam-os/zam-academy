import type { ForestLesson } from "./catalog";

export const REASONING_LESSONS: ForestLesson[] = [
	{
		id: "anzahlen-schaetzen-fermi",
		title: "Milos Samenschätzung",
		shortTitle: "Anzahlen schätzen und Fermi",
		icon: "≈",
		lead: "Wie viele Samen sind das wohl? Hilf Milo, eine Schätzung mit passenden Annahmen zu begründen.",
		goals: [
			"Mit einer typischen Teilmenge schätzen",
			"Schätzwege vergleichen und bewerten",
			"Fermi-Annahmen verändern und prüfen",
		],
		paragraphs: [
			"Eine Anzahl schätzt du, wenn genaues Zählen zunächst zu aufwendig ist. Teile die Menge in ähnlich große Teile, zähle eine typische Probe und übertrage sie. Prüfe vorher, ob die Teile ähnlich dicht gefüllt sind.",
			"Eine Fermi-Aufgabe hat noch nicht alle Angaben. Frage zuerst: Was muss ich wissen? Du kannst eine Probe zählen, messen oder nachfragen. Kennzeichne jede bloße Annahme. Eine Rechenzahl aus einer Annahme ist keine gemessene Gesamtzahl.",
			"Vergleiche Schätzwege: Mehrere typische Proben sind besser begründet als nur die dichteste Stelle. Eine andere plausible Annahme kann eine andere Schätzung ergeben. Vergleiche die Ergebnisse und erkläre, welche Annahme besser zur Situation passt.",
			"In der Werkstatt rechnest du mit ausdrücklich genannten Modellannahmen. Gib den Rechenwert ohne weiteres Runden ein. Draußen wählst du eigene Proben und besprichst, wie verlässlich sie sind.",
		],
		example:
			"Auf 5 gleich großen, ähnlich gefüllten Feldern vermutest du etwa 40 Samen je Feld: 5 · 40 = ungefähr 200 Samen. Eine zweite Annahme von 44 ergibt 220, also 20 mehr. Zähle weitere typische Felder, bevor du entscheidest, welcher Schätzwert besser passt.",
		takeaway:
			"Passende Probe wählen, Annahmen nennen, hochrechnen und prüfen. Eine Schätzung bleibt ungefähr.",
		transfer:
			"Du vergleichst zwei Annahmen und berechnest, wie stark sie die Schätzung verändern. Unterscheide richtiges Rechnen von verlässlichen Ausgangsdaten.",
		quiz: {
			goal: 2,
			prompt:
				"Warum ist das dichteste Feld allein eine schlechte Probe für eine ungleich gefüllte Fläche?",
			choices: [
				{
					label: "Es kann die typische Anzahl je Feld überschätzen.",
					correct: true,
				},
				{
					label: "Eine Probe muss immer genau ein Samenkorn enthalten.",
					correct: false,
				},
				{
					label:
						"Richtiges Multiplizieren macht jede Annahme zu einer Messung.",
					correct: false,
				},
			],
			explanation:
				"Die Probe soll zur ganzen Fläche passen. Ein absichtlich besonders dichtes Feld kann die Gesamtzahl zu groß erscheinen lassen.",
		},
		parentPrompt:
			"Schätze eine Schale mit kleinen Gegenständen. Welche Teilmenge zählst du? Begründe deine Wahl, vergleiche eine zweite Probe und prüfe durch Nachzählen.",
	},
	{
		id: "rechenweg-waehlen",
		title: "Milos Rechenwege",
		shortTitle: "Rechenweg wählen",
		icon: "⑂",
		lead: "Im Kopf, halbschriftlich oder schriftlich? Wähle einen Rechenweg, den du erklären kannst.",
		goals: [
			"Runde Bündel im Kopf nutzen",
			"Hilfsaufgaben mit Notizen rechnen",
			"Schriftlichen Weg und Genauigkeit begründen",
		],
		paragraphs: [
			"Im Kopf rechnest du besonders gut mit bekannten Aufgaben und runden Zahlen. 4 000 + 3 000 sind 7 000. Große Zahlen verlangen nicht automatisch eine schriftliche Rechnung.",
			"Halbschriftlich bedeutet: Du hältst wichtige Zwischenergebnisse, Teilrechnungen oder Sprünge am Rechenstrich fest. Du nutzt eine passende Zerlegung oder Hilfsaufgabe und schreibst deinen Weg nachvollziehbar auf.",
			"Schriftlich rechnest du nach einem festen Stellenverfahren. Bei vielen verschiedenen Ziffern hilft es, gleiche Stellenwerte untereinander zu setzen und jeden Übertrag mitzuschreiben. Vergleiche den Aufwand und die Fehlergefahr mit einem anderen Weg.",
			"Es kann mehrere gute Wege geben. In der Werkstatt ist ein Ziel vorgegeben: ohne Notizen mit runden Bündeln, eine Hilfsaufgabe mit Notizen oder alle Ziffern mit Überträgen. Wähle dazu passend. Erkläre anschließend auch deinen eigenen Weg auf Papier.",
			"Der Zweck entscheidet über die Genauigkeit. Für eine erste Größenordnung reicht ein Überschlag. Beim genauen Bestand, Rückgeld oder einem knappen Budget brauchst du ein genaues Ergebnis. Ein Überschlag bleibt eine gute Kontrolle.",
		],
		example:
			"27 400 + 2 900: Halbschriftlich notierst du 27 400 + 3 000 = 30 400, dann 30 400 − 100 = 30 300. Für 4 000 + 3 000 genügen Hunderter- oder Tausenderbündel im Kopf. Bei 284 756 + 137 689 kann die schriftliche Tafel helfen, alle Stellen zu verfolgen.",
		takeaway:
			"Wähle nach Zahlenstruktur und Zweck. Notiere nötige Zwischenschritte. Prüfe dein Ergebnis und begründe deinen Weg.",
		transfer:
			"Nutze deine gewählte Methode auch für eine genaue Summe. Begründe zusätzlich, wann ein Überschlag für den genannten Zweck reicht.",
		quiz: {
			goal: 2,
			prompt:
				"Du möchtest 18 600 + 2 900 mit einer Hilfsaufgabe und zwei Notizen rechnen. Welcher Weg passt?",
			choices: [
				{ label: "Halbschriftlich: + 3 000, danach − 100.", correct: true },
				{
					label: "+ 3 000 ohne Ausgleich, denn 2 900 ist fast dasselbe.",
					correct: false,
				},
				{
					label: "Nur die Einer addieren, alle anderen Stellen weglassen.",
					correct: false,
				},
			],
			explanation:
				"Die Hilfsaufgabe addiert 100 zu viel. Die zweite Notiz gleicht dies aus. Auch andere richtig ausgeführte Wege sind möglich.",
		},
		parentPrompt:
			"Rechne eine Aufgabe im Kopf, halbschriftlich und schriftlich. Welchen Weg findest du übersichtlich? Zeige deine Notizen und begründe die Wahl.",
	},
	{
		id: "sachaufgaben-veraendern",
		title: "Milos Geschichtenwerkstatt",
		shortTitle: "Sachaufgaben verändern",
		icon: "✎",
		lead: "Eine Geschichte kann kürzer werden oder neue Angaben bekommen. Prüfe, welche Rechnung zur Frage passt.",
		goals: [
			"Unwichtige Angaben entfernen",
			"Eine Sachsituation erweitern",
			"Fehlende Informationen aus Quellen beschaffen",
		],
		paragraphs: [
			"Lies zuerst die Frage: Was ist gesucht? Eine verkürzte Geschichte behält alle nötigen Angaben. Farbe oder Werkzeugzahl dürfen wegfallen, wenn sie für die gefragte Anzahl unwichtig sind. Streiche niemals eine benötigte Menge.",
			"Beim Erweitern kommen Angaben oder Schritte hinzu. Wird etwas geliefert, addierst du es zum Vorrat. Wird danach etwas verbraucht, ziehst du es ab. Erkläre, welcher Teil deiner Rechnung zu welchem Ereignis gehört.",
			"Fehlt eine nötige Angabe, ist die Aufgabe noch nicht eindeutig lösbar. Wähle eine passende Quelle: Etikett, Tabelle, Plan, Messung oder Nachfrage. Nimm nicht irgendeine Zahl aus dem Text. Die Werkstatt bietet lokale Modellquellen zum Nachlesen.",
			"Bei einer Fermi-Aufgabe darfst du eine begründete Annahme verwenden, wenn kein genauer Wert zu beschaffen ist. Sage ausdrücklich, dass du schätzt, und prüfe die Annahme. Eine erfundene Zahl ist kein Messergebnis.",
		],
		example:
			"4 Beutel enthalten je 15 Samen; die Kiste ist grün. Gefragt sind die Samen: 4 · 15 = 60. Die Farbe kann weg. Erweitert: 12 lose Samen kommen dazu, 7 werden gesät: 60 + 12 − 7 = 65. Fehlt die Zahl je Beutel, liest du sie auf dem Etikett nach.",
		takeaway:
			"Die Frage bestimmt die nötigen Angaben. Beim Ändern der Geschichte prüfst du jeden Rechenschritt. Fehlendes passend nachlesen, messen oder erfragen.",
		transfer:
			"Nun verändert eine zusätzliche Handlung den Vorrat. Begründe auch, warum beim Verkürzen die Antwort gleich bleibt.",
		quiz: {
			goal: 3,
			prompt:
				"Du kennst die Zahl gleich gefüllter Saftflaschen, aber nicht ihren Inhalt. Welche Information fehlt für die gesamte Saftmenge?",
			choices: [
				{
					label: "Der Inhalt je Flasche, zum Beispiel vom Etikett.",
					correct: true,
				},
				{
					label: "Die Farbe des Regals; sie bestimmt die Literzahl.",
					correct: false,
				},
				{
					label: "Keine: Die Flaschenzahl ist schon die Saftmenge in Litern.",
					correct: false,
				},
			],
			explanation:
				"Flaschenzahl und Inhalt je Flasche werden beide gebraucht. Das Etikett ist eine passende Quelle für den Inhalt.",
		},
		parentPrompt:
			"Erfinde eine kurze Sachaufgabe. Verlängere sie um eine Handlung und verkürze sie wieder. Lass eine nötige Angabe weg: Wie kannst du sie beschaffen?",
	},
	{
		id: "groessen-vergleichen-ordnen",
		world: "measure",
		title: "Milos Größenparade",
		shortTitle: "Größen vergleichen und ordnen",
		icon: "⇅",
		lead: "Welche Größe ist am kleinsten? Vergleiche Längen, Zeitspannen, Massen und Hohlmaße mit passenden Einheiten.",
		goals: [
			"Längen in gleicher Einheit vergleichen",
			"Zeitspannen mit 60 min je Stunde ordnen",
			"Massen und Hohlmaße stellenrichtig ordnen",
		],
		paragraphs: [
			"Vergleiche nur Größen desselben Bereichs. Bringe sie zuerst in dieselbe Einheit. 2 m sind 200 cm und deshalb länger als 180 cm, obwohl die Zahl 2 kleiner als 180 ist.",
			"Für Längen gilt 1 m = 100 cm, für Massen 1 kg = 1 000 g und für Hohlmaße 1 l = 1 000 ml. Beim Umwandeln ändert sich die Maßzahl, aber nicht die wirkliche Größe.",
			"Bei Zeitspannen hat 1 h genau 60 min. 1 h 15 min sind 75 min. 90 min dauern deshalb länger. Zeitspannen werden nicht mit einem Hunderterschritt umgerechnet.",
			"Ordne nach dem Umwandeln von klein nach groß und begründe die Reihenfolge. In der Werkstatt trägst du die Nummern der Angebote ein. Im dritten Ziel ordnest du zuerst drei Massen und danach getrennt drei Hohlmaße; Masse und Inhalt vergleichst du niemals miteinander. Gleiche Größen wären gleichrangig; die drei Angebote jedes Bereichs sind hier verschieden. Prüfe echte Gegenstände bei Bedarf durch Messen und besprich, ob die Reihenfolge plausibel ist.",
		],
		example:
			"Ordne 1 kg 200 g, 950 g und 2 kg: In Gramm sind das 1 200 g, 950 g und 2 000 g. Also 950 g < 1 kg 200 g < 2 kg. Ebenso gilt 750 ml < 1 l < 1 l 250 ml.",
		takeaway:
			"Gleicher Größenbereich, gleiche Einheit, dann vergleichen und ordnen. Bei Stunden gilt der Sechzigerschritt.",
		transfer:
			"Jetzt planst du die Umwandlung selbst und berechnest zusätzlich den Unterschied zwischen größter und kleinster Größe. Ordne weiter jeden Größenbereich getrennt.",
		quiz: {
			goal: 2,
			prompt: "Welche Zeitspanne dauert länger: 1 h 20 min oder 95 min?",
			choices: [
				{ label: "95 min, denn 1 h 20 min sind 80 min.", correct: true },
				{ label: "1 h 20 min, denn das sind 120 min.", correct: false },
				{
					label: "Beide sind gleich lang, weil 20 und 95 Minuten sind.",
					correct: false,
				},
			],
			explanation:
				"1 h = 60 min, also 1 h 20 min = 80 min. 95 min sind um 15 min länger.",
		},
		parentPrompt:
			"Ordne drei echte Längen oder Gefäße zuerst nach deiner Vermutung. Miss nach und diskutiere, warum du die Reihenfolge ändern musstest oder behalten konntest.",
	},
];
