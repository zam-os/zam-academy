export const EXTRA_LESSON_IDS = [
	"zahlen-vergleichen-ordnen",
	"zahlenstrahl-zahlenspruenge",
	"zahlen-zerlegen-ergaenzen",
	"geschickt-addieren",
	"geschickt-subtrahieren",
	"malnehmen-teilen",
	"schriftlich-addieren",
	"schriftlich-subtrahieren",
	"schriftlich-multiplizieren",
	"schriftlich-dividieren",
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
	{
		id: "schriftlich-subtrahieren",
		title: "Milos Bündeltausch",
		shortTitle: "Schriftlich subtrahieren",
		icon: "−",
		lead: "Im Vorratshaus werden Samen verteilt. Hilf Milo, den Rest zu finden und größere Bündel in kleinere zu tauschen.",
		goals: [
			"Gleiche Stellen untereinander schreiben und spaltenweise abziehen",
			"Durch Entbündeln auch über Nullstellen hinweg abziehen",
			"Fehler verbessern und mit der Additionsprobe prüfen",
		],
		paragraphs: [
			"Beim schriftlichen Subtrahieren schreibst du Einer unter Einer, Zehner unter Zehner und die weiteren gleichen Stellenwerte untereinander. Die Zahl, von der du abziehst, steht oben. In dieser Lektion ist sie mindestens so groß wie die untere Zahl. Beginne rechts bei den Einern und ziehe die untere Menge von der oberen ab.",
			"Reicht die obere Menge nicht, entbündelst du in der oberen Zahl: Aus einem Zehner werden zehn Einer. Oben bei den Zehnern ist dann einer weniger, bei den Einern sind zehn mehr. Der Wert der oberen Zahl bleibt gleich. Vertausche nicht einfach die Ziffern, um immer die kleinere von der größeren abzuziehen.",
			"Steht links daneben 0, gehe bis zum nächsten vorhandenen größeren Bündel. Tausche von dort Schritt für Schritt nach rechts. Bei 5 002 − 1 786 wird zuerst 1 T zu 10 H, dann 1 H zu 10 Z und schließlich 1 Z zu 10 E. Oben liegen jetzt 4 T, 9 H, 9 Z und 12 E. Zusammen sind das weiterhin 5 002.",
			"Ziehe nun spaltenweise ab. Schreibe in jede Ergebnisstelle eine Ziffer, auch wenn sie 0 ist. Die Additionsprobe prüft den Rest: Ergebnis plus abgezogene Zahl muss wieder die obere Startzahl ergeben. Rechne diese Probe selbst, zum Beispiel schriftlich mit dem Verfahren aus der vorigen Lektion.",
		],
		example:
			"5 002 − 1 786: Nach dem Entbündeln rechnest du E: 12 − 6 = 6; Z: 9 − 8 = 1; H: 9 − 7 = 2; T: 4 − 1 = 3. Der Rest ist 3 216. Additionsprobe: 3 216 + 1 786 = 5 002. Die Nullstellen verschwinden nicht; die Bündel werden schrittweise getauscht.",
		takeaway:
			"Gleiche Stellen untereinander. Von rechts nach links abziehen. Reicht es oben nicht, entbündle ein größeres Bündel in zehn kleinere. Die obere Zahl bleibt gleich viel wert. Prüfe durch Addieren.",
		transfer:
			"Jetzt verteilst du Samen, bestimmst den Rest mit einer Additionsprobe und verbesserst Milos Rechnung. Bei Nullstellen helfen mehrere kleine Tauschaktionen.",
		quiz: {
			goal: 2,
			prompt:
				"Bei 4 003 − 128 reichen 3 Einer nicht. Bei den Zehnern und Hundertern steht 0. Was hilft?",
			choices: [
				{
					label:
						"1 T in 10 H, dann 1 H in 10 Z und 1 Z in 10 E tauschen; die obere Zahl bleibt gleich viel wert.",
					correct: true,
				},
				{
					label:
						"In jeder Spalte immer die kleinere Ziffer von der größeren abziehen.",
					correct: false,
				},
				{
					label:
						"10 Einer hinzufügen und alle größeren Bündel unverändert lassen.",
					correct: false,
				},
			],
			explanation:
				"Nach dem Tauschen liegen oben 3 T, 9 H, 9 Z und 13 E. Das sind weiterhin 4 003. Nun kannst du in jeder Spalte unten von oben abziehen. Der Rest ist 3 875.",
		},
		parentPrompt:
			"Rechne 6 004 − 2 578. Zeige, wie du über die Nullstellen entbündelst. Wie prüfst du den Rest durch Addieren?",
	},
	{
		id: "schriftlich-multiplizieren",
		title: "Milos Kistenlager",
		shortTitle: "Schriftlich multiplizieren",
		icon: "·",
		lead: "Viele Kisten, gleich viele Samen. Mit Stellenwerten und zwei Rechenreihen findest du auch große Mengen.",
		goals: [
			"Mit einem einstelligen Faktor schriftlich multiplizieren",
			"Überträge und die Verschiebung der Zehnerreihe beachten",
			"Zweistellig multiplizieren und fehlerhafte Produkte verbessern",
		],
		paragraphs: [
			"Beim Multiplizieren heißen die Zahlen Faktoren, das Ergebnis heißt Produkt. Beginne beim schriftlichen Multiplizieren mit den Einern der ersten Zahl. Multipliziere jede Ziffer mit dem einstelligen Faktor und rechne einen ankommenden Übertrag mit. Schreibe nur die Einerziffer dieser Spaltensumme ins Ergebnis.",
			"Die vollen Zehner merkst du als Übertrag für die nächste Stelle links. Bei 286 · 7 gilt: 6 · 7 = 42, schreibe 2 und übertrage 4. Dann 8 · 7 + 4 = 60, schreibe 0 und übertrage 6. Zuletzt 2 · 7 + 6 = 20. Das Produkt ist 2 002. In der Tafel hat auch die neue Tausenderstelle ein eigenes Feld.",
			"Einen zweistelligen Faktor zerlegst du in Zehner und Einer: 24 = 20 + 4. Rechne zuerst mit 4, danach mit 20. Für die Zehnerreihe rechnest du mit 2 und verschiebst alle Stellen um eine Stelle nach links. Die Einerstelle dieser Reihe ist deshalb fest 0. Aus 305 · 2 = 610 wird 305 · 20 = 6 100.",
			"Addiere die beiden Teilergebnisse stellenrichtig und rechne auch dabei die Überträge mit. Ist die Einerziffer des Faktors 0, ist die ganze Einerreihe 0; die Zehnerreihe bleibt nötig. Leere Übertragsfelder bedeuten 0. Große Ergebnisfelder füllst du auch bei 0 aus. Prüfe durch eine andere Zerlegung, mit der Umkehraufgabe oder grob durch Überschlagen.",
		],
		example:
			"305 · 24: Einerreihe 305 · 4 = 1 220. Zehnerreihe 305 · 20 = 6 100. Addiere 1 220 + 6 100 = 7 320. Eine andere Zerlegung prüft: 300 · 24 = 7 200 und 5 · 24 = 120; zusammen 7 320. Ohne Verschiebung der Zehnerreihe wäre das Produkt falsch.",
		takeaway:
			"Jede Reihe von rechts nach links rechnen und Überträge mitnehmen. Beim Zehnerfaktor eine Stelle nach links verschieben. Zum Schluss die Teilergebnisse stellenrichtig addieren.",
		transfer:
			"Packe jetzt Kisten in Geschichten, rechne auch mit vollen Zehnern und verbessere Milos Produkt. Nutze die Stellenwerte und prüfe deinen Weg.",
		quiz: {
			goal: 2,
			prompt:
				"Warum steht die Reihe zu 305 · 20 eine Stelle weiter links als die Reihe zu 305 · 2?",
			choices: [
				{
					label:
						"20 ist zehnmal so groß wie 2. Jeder Stellenwert des Teilergebnisses wird zehnmal so groß.",
					correct: true,
				},
				{
					label:
						"Die 0 im Faktor kann man weglassen; beide Reihen sind gleich viel wert.",
					correct: false,
				},
				{
					label:
						"Bei jeder zweiten Reihe wird immer eine 0 vorne links ergänzt.",
					correct: false,
				},
			],
			explanation:
				"305 · 2 = 610, aber 305 · 20 = 6 100. Die feste 0 steht rechts bei den Einern; alle anderen Stellen rücken nach links.",
		},
		parentPrompt:
			"Rechne 306 · 24 schriftlich. Was bedeutet die feste 0 in der Zehnerreihe? Prüfe mit einer anderen Zerlegung.",
	},
	{
		id: "schriftlich-dividieren",
		title: "Milos gerechte Beete",
		shortTitle: "Schriftlich dividieren",
		icon: ":",
		lead: "Verteile Samen gerecht. Behalte beim Teilen jede Stelle und den letzten Rest im Blick.",
		goals: [
			"Schriftlich von links nach rechts teilen",
			"Nullstellen im Ergebnis erhalten",
			"Einen Rest bestimmen, prüfen und fehlerhafte Ergebnisse verbessern",
		],
		paragraphs: [
			"Beim Dividieren teilst du eine Menge gleichmäßig auf. In dieser Lektion teilst du durch ganze Zahlen von 1 bis 10. Beginne links bei der ersten Ziffer. Bestimme, wie oft der Teiler ganz in diese Teilzahl passt. Notiere die Ergebnisziffer, multipliziere sie mit dem Teiler und ziehe diesen Betrag ab.",
			"Der Rest aus einem Schritt wird vor der nächsten Ziffer zehnmal so groß: Du tauschst ihn in die nächstkleineren Bündel um und holst die nächste Ziffer dazu. Neue Teilzahl = vorheriger Rest · 10 + nächste Ziffer. Wiederhole Teilen, Multiplizieren und Abziehen bis zur letzten Ziffer.",
			"Passt der Teiler in einem Schritt noch nicht in die Teilzahl, notiere 0 als Ergebnisziffer. In dieser Werkstatt bekommt jede Ziffer der Startzahl ihren eigenen Schritt. Eine führende Ergebnisnull lässt du beim Lesen der ganzen Antwort weg; eine 0 mitten im Ergebnis bleibt stehen. Bei 2 036 : 4 entstehen die Ergebnisziffern 0, 5, 0, 9; die Antwort ist 509.",
			"Am Ende darf ein Rest übrig bleiben. Er muss kleiner als der Teiler sein; sonst könntest du noch einmal verteilen. Die Probe lautet: Ergebnis · Teiler + Rest = Startzahl. Beim Verteilen sagt der Rest, wie viele Dinge übrig bleiben. Teile hier keine halben Samen und rechne noch nicht mit Dezimalzahlen.",
		],
		example:
			"2 138 : 7: Zuerst 2 : 7 → 0, Rest 2. Die nächste Teilzahl ist 21: 21 : 7 → 3, Rest 0. Dann 3 : 7 → 0, Rest 3. Zuletzt 38 : 7 → 5, Rest 3. Ergebnis: 305 Rest 3. Probe: 305 · 7 + 3 = 2 135 + 3 = 2 138; 3 ist kleiner als 7.",
		takeaway:
			"Von links nach rechts: teilen, multiplizieren, abziehen, nächste Ziffer herunterholen. Schreibe auch Ergebnisziffern 0. Der letzte Rest ist kleiner als der Teiler. Prüfe mit Malaufgabe plus Rest.",
		transfer:
			"Verteile größere Vorräte, teile auch durch 10 und verbessere Milos Rechnung. Der Rest gehört zur Antwort und zur Probe.",
		quiz: {
			goal: 3,
			prompt: "Milo erhält beim Teilen durch 6 am Ende Rest 8. Was zeigt das?",
			choices: [
				{
					label:
						"6 passt noch einmal hinein. Der Quotient muss um 1 größer werden und der Rest wird 2.",
					correct: true,
				},
				{
					label:
						"Der Rest darf größer als der Teiler sein; er zählt einfach nicht zur Antwort.",
					correct: false,
				},
				{
					label: "Der Rest wird an die ganze Ergebniszahl angehängt.",
					correct: false,
				},
			],
			explanation:
				"Ein gültiger Rest ist kleiner als der Teiler. Aus Rest 8 kannst du noch einmal 6 verteilen: 8 − 6 = 2. Prüfe anschließend die ganze Rechnung mit Ergebnis · 6 + Rest.",
		},
		parentPrompt:
			"Teile 2 417 durch 8 schriftlich. Wo brauchst du eine 0 im Ergebnis? Was bleibt übrig, und wie prüfst du es?",
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
