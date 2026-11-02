export const EXTRA_LESSON_IDS = [
	"zahlen-vergleichen-ordnen",
	"zahlenstrahl-zahlenspruenge",
	"zahlen-zerlegen-ergaenzen",
] as const;
export type ExtraLessonId = (typeof EXTRA_LESSON_IDS)[number];
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
		prompt: string;
		choices: [string, string, string];
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
			prompt: "Warum ist 507 030 größer als 507 003?",
			choices: [
				"Die Zehnerstelle entscheidet: 3 Zehner sind mehr als 0 Zehner.",
				"Die Einerstelle allein entscheidet immer über die ganze Zahl.",
				"Beide Zahlen enthalten dieselben Ziffern, also sind sie gleich.",
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
			prompt:
				"Zwischen 60 000 und 80 000 liegen zehn gleich große Abschnitte. Wie groß ist ein Schritt?",
			choices: [
				"2 000, denn zehn Schritte ergeben zusammen 20 000.",
				"20 000, denn das ist der Abstand der beiden beschrifteten Zahlen.",
				"10 000, denn es gibt zehn Abschnitte.",
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
			prompt: "Welche Zerlegung passt zu 405 060?",
			choices: [
				"400 000 + 5 000 + 60",
				"400 000 + 50 000 + 6",
				"40 000 + 5 000 + 600",
			],
			explanation:
				"Die 4 steht bei den Hunderttausendern, die 5 bei den Tausendern und die 6 bei den Zehnern. Die übrigen Stellen sind leer.",
		},
		parentPrompt:
			"Wie kannst du 100 000 in zwei Teile zerlegen? Finde eine zweite Zerlegung und erkläre, was sich ändert.",
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
