export const EXTRA_LESSON_IDS = [
	"zahlen-vergleichen-ordnen",
	"zahlenstrahl-zahlenspruenge",
	"zahlen-zerlegen-ergaenzen",
	"geschickt-addieren",
	"geschickt-subtrahieren",
	"malnehmen-teilen",
	"schriftlich-addieren",
] as const;
export type ExtraLessonId = (typeof EXTRA_LESSON_IDS)[number];
export interface QuizChoice {
	label: string;
	correct: boolean;
}
export interface ForestLesson {
	id: ExtraLessonId;
	title: string;
	shortTitle: string;
	icon: string;
	lead: string;
	goals: [string, string, string];
	paragraphs: string[];
	example: string;
	takeaway: string;
	transfer: string;
	quiz: {
		goal: 1 | 2 | 3;
		prompt: string;
		choices: [QuizChoice, QuizChoice, QuizChoice];
		explanation: string;
	};
	parentPrompt: string;
}
export const FOREST_LESSONS: ForestLesson[] = [
	{
		id: "zahlen-vergleichen-ordnen",
		title: "Milos Zahlentor",
		shortTitle: "Vergleichen und ordnen",
		icon: "⇄",
		lead: "Am Zahlentor brauchen alle Zahlen den richtigen Platz. Hilf Milo beim Vergleichen und Sortieren.",
		goals: [
			"Kleiner, größer und gleich unterscheiden",
			"Die erste unterschiedliche Stelle finden",
			"Mehrere Zahlen aufsteigend ordnen",
		],
		paragraphs: [
			"Beim Vergleichen zählt der Wert der ganzen Zahl. Hat eine Zahl mehr Stellen, ist sie größer, solange du keine Nullen vor die Zahl schreibst: 10 000 ist größer als 9 999.",
			"Bei gleich vielen Stellen vergleichst du von links. Gleiche Ziffern überspringst du. Die erste unterschiedliche Stelle entscheidet: 425 090 ist größer als 424 999, denn 5 Tausender sind mehr als 4 Tausender.",
			"Das Zeichen < bedeutet ist kleiner als, > bedeutet ist größer als und = bedeutet ist gleich. Die offene Seite zeigt zur größeren Zahl. Gleich große Zahlen bleiben gleich, auch wenn du sie anders zerlegst.",
			"Aufsteigend ordnen heißt: Du beginnst mit der kleinsten Zahl. Vergleiche danach die übrigen Zahlen auf dieselbe Weise. Begründe deine Reihenfolge mit den Stellenwerten.",
		],
		example:
			"Ordne 80 080, 8 800 und 80 008: 8 800 < 80 008 < 80 080. Zuerst entscheidet die Stellenzahl. Bei den beiden fünfstelligen Zahlen entscheidet danach die Zehnerstelle.",
		takeaway:
			"Vergleiche von links. Die erste unterschiedliche Stelle entscheidet. Aufsteigend geht es von klein nach groß.",
		transfer:
			"Jetzt vergleichst du auch Zahlen aus kurzen Geschichten und ordnest ähnliche Zahlen. Achte auf die Nullstellen. Die Geschichte ändert die Bedeutung der Zeichen nicht.",
		quiz: {
			goal: 2,
			prompt: "Warum ist 507 030 größer als 507 003?",
			choices: [
				{
					label:
						"Die Zehnerstelle entscheidet: 3 Zehner sind mehr als 0 Zehner.",
					correct: true,
				},
				{
					label:
						"Die Einerstelle allein entscheidet immer über die ganze Zahl.",
					correct: false,
				},
				{
					label:
						"Beide Zahlen enthalten dieselben Ziffern, also sind sie gleich.",
					correct: false,
				},
			],
			explanation:
				"Bis zur Hunderterstelle sind die Ziffern gleich. An der Zehnerstelle unterscheiden sie sich zuerst: 3 ist größer als 0.",
		},
		parentPrompt:
			"Woran erkennst du, ob 90 009 oder 90 090 größer ist? Zeige mir die erste unterschiedliche Stelle.",
	},
	{
		id: "zahlenstrahl-zahlenspruenge",
		title: "Milos Zahlenpfad",
		shortTitle: "Zahlenstrahl und Sprünge",
		icon: "↗",
		lead: "Milo entdeckt einen Zahlenpfad. Finde heraus, wie groß ein Schritt ist und wo eine Zahl wohnt.",
		goals: [
			"Die Schrittweite eines Zahlenstrahls bestimmen",
			"Zahlen am Zahlenstrahl lesen und eintragen",
			"Vorwärts und rückwärts in gleichen Schritten zählen",
		],
		paragraphs: [
			"Auf dem Zahlenstrahl werden die Zahlen nach rechts größer und nach links kleiner. Gleich lange Abschnitte bedeuten gleich große Zahlenschritte. Ein Ausschnitt muss nicht bei 0 beginnen.",
			"Lies zuerst die beschrifteten Zahlen. Zähle dann die Abschnitte dazwischen, nicht die Striche. Zwischen zwei Strichen liegt ein Abschnitt. Zehn Abschnitte haben elf Begrenzungsstriche.",
			"Von 200 000 bis 300 000 sind es 100 000. Bei zehn gleich großen Abschnitten ist ein Schritt 10 000 groß. Der dritte Strich rechts von 200 000 liegt bei 230 000.",
			"Für mehrere Sprünge addierst oder subtrahierst du die Schrittweite mehrmals. Von 230 000 führen drei Schritte zu je 10 000 nach links zu 200 000. Prüfe, ob du in die richtige Richtung gegangen bist.",
		],
		example:
			"Ein Zahlenstrahl zeigt 40 000 und 50 000 mit zehn Abschnitten dazwischen. Ein Schritt ist 1 000 groß. Vier Schritte rechts von 40 000 führen zu 44 000; zwei Schritte links von 47 000 führen zu 45 000.",
		takeaway:
			"Erst die Schrittweite bestimmen, dann Abschnitte zählen. Rechts wird es größer, links kleiner.",
		transfer:
			"Nun fehlen manche Beschriftungen. Bestimme die Schrittweite selbst und nutze sie für mehrere Sprünge. Der ganze Pfad bleibt zwischen 0 und 1 Million.",
		quiz: {
			goal: 1,
			prompt:
				"Zwischen 60 000 und 80 000 liegen zehn gleich große Abschnitte. Wie groß ist ein Schritt?",
			choices: [
				{
					label: "2 000, denn zehn Schritte ergeben zusammen 20 000.",
					correct: true,
				},
				{
					label:
						"20 000, denn das ist der Abstand der beiden beschrifteten Zahlen.",
					correct: false,
				},
				{ label: "10 000, denn es gibt zehn Abschnitte.", correct: false },
			],
			explanation:
				"Die Differenz beträgt 20 000. Du verteilst sie auf zehn Abschnitte: 20 000 : 10 = 2 000.",
		},
		parentPrompt:
			"Zeichne einen Zahlenstrahl von 100 000 bis 200 000 mit zehn Abschnitten. Wo liegt 170 000, und wie weißt du das?",
	},
	{
		id: "zahlen-zerlegen-ergaenzen",
		title: "Milos Zahlenschatz",
		shortTitle: "Zerlegen und ergänzen",
		icon: "◇",
		lead: "Ein Zahlenschatz lässt sich auf verschiedene Truhen verteilen. Die Teile müssen zusammen immer die ganze Zahl ergeben.",
		goals: [
			"Eine Zahl in passende Teile zerlegen",
			"Fehlende Teile durch Ergänzen bestimmen",
			"Zerlegungen erklären und überprüfen",
		],
		paragraphs: [
			"Eine Zahl kannst du auf verschiedene Weise in Summanden zerlegen. Die Summe der Teile bleibt gleich: 10 000 = 3 000 + 7 000 und 10 000 = 4 000 + 6 000.",
			"Bei der Stellenwertzerlegung zerlegst du nach dem Wert der Ziffern. 304 070 = 300 000 + 4 000 + 70. Eine leere Stelle trägt nichts zur Summe bei; sie darf die anderen Ziffern aber nicht verschieben.",
			"Fehlt ein Teil, ergänze vom bekannten Teil zur ganzen Zahl oder rechne die Differenz aus. In 100 000 = 36 000 + □ fehlt 64 000. Prüfe durch Addieren: 36 000 + 64 000 = 100 000.",
			"Du kannst auch Bündel zusammenfassen: 100 000 sind zehn Zehntausender. Werden bei gleichbleibender ganzer Zahl 1 000 zum einen Teil hinzugefügt, müssen 1 000 beim anderen Teil weggenommen werden.",
		],
		example:
			"Milos Schatz hat den Wert 1 000 000. Eine Truhe enthält 250 000. Es fehlen 750 000, denn 250 000 + 750 000 = 1 000 000. Dieselbe Million kannst du auch in 400 000 und 600 000 zerlegen.",
		takeaway:
			"Die Teile ergeben zusammen die ganze Zahl. Fehlender Teil = ganze Zahl − bekannter Teil. Prüfe mit der Summe.",
		transfer:
			"Wähle nun die passenden Stellenwertteile selbst aus und ergänze in kleinen Geschichten bis zu einem Ziel. Nimm nur die Teile, die du wirklich brauchst.",
		quiz: {
			goal: 1,
			prompt: "Welche Zerlegung passt zu 405 060?",
			choices: [
				{ label: "400 000 + 5 000 + 60", correct: true },
				{ label: "400 000 + 50 000 + 6", correct: false },
				{ label: "40 000 + 5 000 + 600", correct: false },
			],
			explanation:
				"Die 4 steht bei den Hunderttausendern, die 5 bei den Tausendern und die 6 bei den Zehnern. Die übrigen Stellen sind leer.",
		},
		parentPrompt:
			"Wie kannst du 100 000 in zwei Teile zerlegen? Finde eine zweite Zerlegung und erkläre, was sich ändert.",
	},
	{
		id: "geschickt-addieren",
		title: "Milos Sprungbrücke",
		shortTitle: "Geschickt addieren",
		icon: "+",
		lead: "Über die Sprungbrücke kommst du mit kleinen Rechenschritten. Hilf Milo, große Summen geschickt zu finden.",
		goals: [
			"Bekannte Plusaufgaben auf große Zahlen übertragen",
			"Summanden zerlegen und in Schritten addieren",
			"Eine Hilfsaufgabe nutzen und richtig ausgleichen",
		],
		paragraphs: [
			"Addieren heißt zusammenzählen. Die Zahlen, die du addierst, heißen Summanden. Das Ergebnis heißt Summe. Bekannte Aufgaben helfen auch bei großen Zahlen: Aus 6 + 3 = 9 wird 6 000 + 3 000 = 9 000. Rechne mit gleich großen Bündeln.",
			"Du darfst einen Summanden zerlegen und die Teile nacheinander addieren. Bei 26 800 + 3 500 zerlegst du 3 500 in 3 000 und 500: zuerst 29 800, dann 30 300. Notiere die Zwischenergebnisse oder zeichne einen Rechenstrich.",
			"Manchmal hilft der nächste volle Tausender: 46 000 + 2 900 rechnest du als 46 000 + 3 000 − 100. Du hast zuerst 100 zu viel addiert und musst diese 100 wieder wegnehmen. So erhältst du 48 900.",
			"Du kannst Summanden auch vertauschen und passend zusammenfassen: 3 600 + 1 700 + 400 = 3 600 + 400 + 1 700 = 5 700. Wähle einen Weg, den du erklären kannst. Prüfe mit einer anderen Zerlegung oder durch Rückwärtsrechnen.",
		],
		example:
			"Rechne 38 700 + 4 800. In Schritten: 38 700 + 4 000 = 42 700; 42 700 + 800 = 43 500. Mit Hilfsaufgabe: 38 700 + 5 000 = 43 700; 43 700 − 200 = 43 500. Beide Wege ergeben dieselbe Summe.",
		takeaway:
			"Zerlege einen Summanden in passende Teile. Addierst du bei einer Hilfsaufgabe zu viel, nimmst du diesen Betrag wieder weg.",
		transfer:
			"Jetzt nutzt du Plusaufgaben in Geschichten, ergänzt Zwischenschritte und prüfst Milos Hilfsaufgaben. Überlege zuerst, was gesucht ist.",
		quiz: {
			goal: 3,
			prompt:
				"Milo rechnet 24 600 + 3 900 mit 24 600 + 4 000. Wie muss er ausgleichen?",
			choices: [
				{
					label: "100 abziehen, weil er zuerst 100 zu viel addiert hat.",
					correct: true,
				},
				{
					label:
						"100 addieren, weil die ursprüngliche Aufgabe eine Plusaufgabe ist.",
					correct: false,
				},
				{
					label: "Nichts ändern, weil 3 900 und 4 000 fast gleich sind.",
					correct: false,
				},
			],
			explanation:
				"24 600 + 4 000 = 28 600. Das sind 100 zu viel: 28 600 − 100 = 28 500.",
		},
		parentPrompt:
			"Wie rechnest du 17 800 + 2 900? Zeige zwei Wege und erkläre den Ausgleich.",
	},
	{
		id: "geschickt-subtrahieren",
		title: "Milos Rückweg",
		shortTitle: "Geschickt subtrahieren",
		icon: "−",
		lead: "Milo geht auf dem Rechenpfad zurück. Entdecke, wie Zerlegen, Ergänzen und eine passende Probe helfen.",
		goals: [
			"Bekannte Minusaufgaben auf große Zahlen übertragen",
			"In Schritten subtrahieren und durch Ergänzen prüfen",
			"Eine Minus-Hilfsaufgabe richtig ausgleichen",
		],
		paragraphs: [
			"Subtrahieren heißt abziehen oder einen Unterschied bestimmen. Das Ergebnis heißt Differenz. Aus 9 − 4 = 5 wird 9 000 − 4 000 = 5 000. Ziehe gleich große Bündel voneinander ab. In dieser Lektion ist das Ergebnis immer mindestens 0.",
			"Zerlege die Zahl, die du abziehst: 52 300 − 4 700 = 52 300 − 4 000 − 700. Die Zwischenergebnisse sind 48 300 und 47 600. Am Rechenstrich führen die Sprünge nach links.",
			"Bei einer Hilfsaufgabe musst du genau ausgleichen: 52 300 − 4 900 = 52 300 − 5 000 + 100 = 47 400. Du hast zuerst 100 zu viel weggenommen. Deshalb gibst du die 100 wieder dazu.",
			"Du kannst eine Differenz auch durch Ergänzen finden. Von 38 700 bis 40 000 fehlen 1 300, von dort bis 42 000 noch 2 000. Also ist 42 000 − 38 700 = 3 300. Die Additionsprobe prüft jede Minusaufgabe: Differenz + abgezogene Zahl = Startzahl.",
		],
		example:
			"Rechne 63 200 − 5 800. In Schritten: 63 200 − 5 000 = 58 200; 58 200 − 800 = 57 400. Mit Hilfsaufgabe: 63 200 − 6 000 + 200 = 57 400. Probe: 57 400 + 5 800 = 63 200.",
		takeaway:
			"Ziehe zerlegte Teile nacheinander ab. Ziehst du bei einer Hilfsaufgabe zu viel ab, gibst du diesen Betrag wieder dazu. Prüfe durch Addieren.",
		transfer:
			"Finde Unterschiede in Geschichten, ergänze eine Additionsprobe und erkläre den Ausgleich einer Hilfsaufgabe. Die Reihenfolge der Zahlen beim Subtrahieren bleibt wichtig.",
		quiz: {
			goal: 3,
			prompt:
				"Für 35 200 − 2 900 rechnet Milo zuerst 35 200 − 3 000. Was folgt?",
			choices: [
				{
					label: "100 dazugeben: Er hat zuerst 100 zu viel weggenommen.",
					correct: true,
				},
				{
					label: "100 weiter abziehen: Bei Minus geht es immer nur nach links.",
					correct: false,
				},
				{
					label:
						"3 000 dazugeben: Jede Minusaufgabe wird vollständig rückgängig gemacht.",
					correct: false,
				},
			],
			explanation:
				"35 200 − 3 000 = 32 200. Gib die zu viel abgezogenen 100 zurück: 32 200 + 100 = 32 300. Probe: 32 300 + 2 900 = 35 200.",
		},
		parentPrompt:
			"Warum rechnest du bei 41 500 − 3 900 mit − 4 000 + 100? Zeige anschließend die Probe.",
	},
	{
		id: "malnehmen-teilen",
		title: "Milos Körbchengarten",
		shortTitle: "Malnehmen und teilen",
		icon: "·",
		lead: "Im Körbchengarten liegen gleich große Gruppen. Milo braucht deine Hilfe beim Packen und gerechten Verteilen.",
		goals: [
			"Gleich große Gruppen mit einer Malaufgabe beschreiben",
			"Eine Geteiltaufgabe mit der Umkehraufgabe lösen",
			"Einmaleinswissen auf große Bündel übertragen",
		],
		paragraphs: [
			"Wiederholung aus Klasse 1/2: 6 Gruppen mit je 4 Dingen sind 6 · 4 = 24. Multiplizieren heißt malnehmen. Du kannst 4 + 4 + 4 + 4 + 4 + 4 durch 6 · 4 ersetzen. Die Faktoren darfst du vertauschen: 4 · 6 ergibt ebenfalls 24.",
			"Dividieren heißt teilen. 24 Blätter auf 6 gleich gefüllte Körbe verteilen ergibt 24 : 6 = 4 Blätter je Korb. Anders gefragt: Wie viele Körbe mit je 4 Blättern passen zu 24 Blättern? 24 : 4 = 6 Körbe. Achte darauf, was die Antwort beschreibt.",
			"Malnehmen und Teilen sind Umkehraufgaben. Zu 6 · 4 = 24 gehören 24 : 6 = 4 und 24 : 4 = 6. Prüfe eine Geteiltaufgabe durch Malnehmen. Durch 0 darfst du nicht teilen; hier teilst du immer ohne Rest. Bekannte Malaufgaben helfen dir auch, eine fehlende Anzahl gleich großer Gruppen zu finden.",
			"In Klasse 3/4 nutzt du das kleine Einmaleins auch mit großen Bündeln. 6 · 400 = 2 400, denn 6 · 4 Hunderter sind 24 Hunderter. Deshalb ist 2 400 : 6 = 400. Erkläre den Stellenwert, statt nur Nullen anzuhängen.",
		],
		example:
			"7 Körbe enthalten je 300 Samen. 7 · 3 = 21, also 7 · 300 = 2 100 Samen. Verteile die 2 100 Samen wieder auf 7 Körbe: 2 100 : 7 = 300 Samen je Korb. Die Malaufgabe prüft die Geteiltaufgabe.",
		takeaway:
			"Gleich große Gruppen passen zu einer Malaufgabe. Die Umkehraufgabe hilft beim Teilen. Bei großen Zahlen rechnest du mit den passenden Bündeln.",
		transfer:
			"Entscheide in kurzen Geschichten selbst zwischen Malnehmen und Teilen. Finde fehlende Faktoren und prüfe große Bündel mit dem kleinen Einmaleins.",
		quiz: {
			goal: 2,
			prompt:
				"2 400 Samen werden gleichmäßig auf 6 Körbe verteilt. Welche Rechnung und Probe passen?",
			choices: [
				{ label: "2 400 : 6 = 400; Probe: 6 · 400 = 2 400.", correct: true },
				{
					label: "2 400 − 6 = 2 394; Probe: 2 394 + 6 = 2 400.",
					correct: false,
				},
				{ label: "2 400 : 6 = 40; Probe: 6 · 40 = 240.", correct: false },
			],
			explanation:
				"Du verteilst die ganze Menge auf 6 gleich große Gruppen. Weil 6 · 4 = 24 gilt, sind 6 · 400 = 2 400. In jeden Korb kommen 400 Samen.",
		},
		parentPrompt:
			"6 Körbe enthalten zusammen 4 800 Samen. Wie viele sind in jedem Korb? Welche Malaufgabe prüft deine Antwort?",
	},
	{
		id: "schriftlich-addieren",
		title: "Milos Rechenturm",
		shortTitle: "Schriftlich addieren",
		icon: "▤",
		lead: "Im Rechenturm hat jede Ziffer ihren Platz. Hilf Milo beim Addieren und bringe jeden Übertrag in die richtige Etage.",
		goals: [
			"Stellenrichtig ohne Übertrag addieren",
			"Überträge in der nächsten Spalte mitrechnen",
			"Übertragsketten und Ergebnisse prüfen",
		],
		paragraphs: [
			"Beim schriftlichen Addieren stehen gleiche Stellenwerte untereinander: Einer unter Einern, Zehner unter Zehnern und so weiter. Schreibe auch unterschiedlich lange Zahlen rechtsbündig. Bei 2 345 + 123 steht die 3 der 123 unter der 5, weil beide Einer sind. Eine unbesetzte Stelle zählt wie 0.",
			"Beginne rechts bei den Einern. Addiere die beiden Ziffern einer Spalte und einen ankommenden Übertrag. Ist die Spaltensumme kleiner als 10, schreibst du sie unten in dieselbe Spalte. Danach gehst du eine Spalte nach links.",
			"Ab 10 bündelst du: 7 Einer + 8 Einer = 15 Einer. Schreibe 5 in die Einerspalte des Ergebnisses. Die übrigen 10 Einer werden zu 1 Zehner. Schreibe diese 1 klein in die Übertragszeile der nächsten Spalte links und rechne sie dort mit. Der Übertrag ist kein zusätzlicher Einer.",
			"Bei 2 687 + 1 548 geht es so weiter: Zehner 8 + 4 + 1 = 13, also 3 schreiben und 1 Hunderter übertragen. Hunderter 6 + 5 + 1 = 12, also 2 schreiben und 1 Tausender übertragen. Tausender 2 + 1 + 1 = 4. Die Summe ist 4 235.",
			"Ein Übertrag kann mehrere Spalten durchlaufen. 999 999 + 1 ergibt 1 000 000: Jede volle Zehnergruppe wird links neu gebündelt. Prüfe deine Summe mit einer Tauschaufgabe: Vertausche die beiden Summanden und rechne neu. Vergleiche beide Ergebnisse. Bei zwei Summanden ist ein Übertrag immer 0 oder 1.",
		],
		example:
			"Rechne 30 407 + 2 685. Einer: 7 + 5 = 12, schreibe 2, übertrage 1 zu Z. Zehner: 0 + 8 + 1 = 9. Hunderter: 4 + 6 = 10, schreibe 0, übertrage 1 zu T. Tausender: 0 + 2 + 1 = 3. Zehntausender: 3 + 0 = 3. Ergebnis: 33 092. Tauschprobe: 2 685 + 30 407 = 33 092. Rechne die Tauschaufgabe neu und vergleiche.",
		takeaway:
			"Gleiche Stellen untereinander. Von rechts nach links rechnen. Ab 10 die Einerziffer schreiben und 1 in die nächste Spalte links übertragen. Jeden Übertrag mitrechnen.",
		transfer:
			"Jetzt rechnest du schriftlich in einer Geschichte und überprüfst Milos Rechnung. Die Spalten und Überträge helfen dir auch bei Nullstellen und langen Zahlen.",
		quiz: {
			goal: 2,
			prompt: "In der Einerspalte erhältst du 7 + 8 = 15. Was trägst du ein?",
			choices: [
				{
					label: "5 ins Ergebnis bei E und 1 als Übertrag bei Z.",
					correct: true,
				},
				{
					label: "15 vollständig in die Einerspalte und keinen Übertrag.",
					correct: false,
				},
				{
					label: "1 ins Ergebnis bei E und 5 als Übertrag bei Z.",
					correct: false,
				},
			],
			explanation:
				"15 Einer sind 1 Zehner und 5 Einer. Die 5 bleibt bei E. Der volle Zehner wandert als Übertrag 1 zu Z und wird dort mitgerechnet.",
		},
		parentPrompt:
			"Rechne 3 708 + 2 596 schriftlich. Was bedeutet jeder Übertrag, und wie prüfst du die Summe?",
	},
];
export const COURSE_LINKS = [
	{
		id: "stellenwerte-buendeln",
		shortTitle: "Stellenwerte und Bündel",
		icon: "♧",
	},
	...FOREST_LESSONS,
];
export function forestLesson(id: string): ForestLesson | undefined {
	return FOREST_LESSONS.find((lesson) => lesson.id === id);
}
