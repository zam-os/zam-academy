export type Locale = "de" | "en";
export const asLocale = (value: unknown): Locale =>
	value === "en" ? "en" : "de";
export function localeFromHash(hash: string, fallback: Locale = "de"): Locale {
	const value = new URLSearchParams(hash.replace(/^#/, "")).get("lang");
	return value === null ? fallback : asLocale(value);
}
export function trainingHash(lessonId: string | null, locale: Locale): string {
	const params = new URLSearchParams();
	if (lessonId) params.set("lesson", lessonId);
	params.set("lang", locale);
	return `#${params.toString()}`;
}
const de = {
	brand: "Algorithmen",
	tagline: "ZAM Academy · Programmieren verstehen",
	path: "Lernpfad",
	help: "Syntaxhilfe",
	zam: "In ZAM festigen",
	language: "Sprache / Language",
	progress: "Fortschritt",
	reset: "Fortschritt zurücksetzen",
	close: "Schließen",
	footerScope: "LehrplanPLUS Bayern · IT 2.6.1 · modularer Aufbauunterricht",
	privacy:
		"Keine Konten, kein Tracking. Code und Fortschritt bleiben in diesem Browser.",
	storage:
		"Speichern ist gesperrt. Du kannst weiter üben; dein Fortschritt bleibt für diese Sitzung erhalten.",
	official: "Offizieller Lehrplan ↗",
	eyebrow: "DEIN WEG VOM ABLAUF ZUM PROGRAMM",
	heroTitle: "Ideen werden",
	heroEm: "ausführbar.",
	heroText:
		"Plane klare Schritte. Schreibe eigenen Code. Finde heraus, warum er funktioniert — oder wo er noch hakt.",
	continue: "Weiterlernen",
	start: "Mit der ersten Lektion starten",
	heroMeta: "20 kurze Lektionen · echte Codeübungen · läuft auch offline",
	exampleLabel: "Beispiel eines Programms",
	firstIdea: "Deine erste Idee",
	exampleComment: "// Aus einer Regel wird ein Ablauf.",
	output: "Ausgabe",
	traceable: "Schritt für Schritt nachvollziehbar",
	scope: "Dein Lernrahmen",
	scopeText:
		"IT 2.6.1 „Modellieren und Codieren von Algorithmen“, ca. 14 Unterrichtsstunden. Die Schule legt fest, in welcher Jahrgangsstufe das Modul stattfindet. Dieses Paket übt einen klar benannten JavaScript-Ausschnitt und bildet keinen vollständigen IT-Jahreskurs ab.",
	stage: "ETAPPE",
	complete: "Geübt",
	open: "Offen",
	ownWorkTitle: "Verstehen braucht eigenes Tun.",
	ownWorkText:
		"Die Werkstatt prüft Ausgaben bei mehreren Eingaben. Ein Häkchen ist ein Übungserfolg; es ersetzt keine eigenständigen Projekte oder die Beurteilung durch deine Lehrkraft.",
	previous: "Vorherige Lektion",
	next: "Nächste Lektion",
	understand: "VERSTEHEN",
	model: "Der Ablauf als Modell",
	modelNote:
		"Vereinfachter Ablaufstreifen. Ergänze eigene Struktogramme oder Programmablaufpläne im Unterricht.",
	quickCheck: "KURZ PRÜFEN",
	choose: "Wähle eine Antwort",
	checkAnswer: "Antwort prüfen",
	quizAlready: "Diesen Kurzcheck hast du bereits gelöst.",
	practiceStatus: "Dein Übungsstand",
	nextLesson: "Nächste Lektion →",
	backPath: "Zum Lernpfad",
	workshop: "CODE-WERKSTATT",
	subset: "JavaScript-Ausschnitt",
	yourTurn: "Jetzt bist du dran",
	readPrint:
		"read() liefert die Testeingaben nacheinander. print(wert) zeigt einen Wert. Nutze den Punkt als Dezimaltrennzeichen.",
	codeLocale:
		"Beispiele und Testwerte folgen der gewählten Sprache. Deine Codeentwürfe werden für Deutsch und Englisch getrennt gespeichert; die gelösten Konzepte zählen gemeinsam.",
	program: "Dein Programm",
	editorHelp:
		"Mit „Ausführen“ siehst du Test 1 und seine Spur. „Alle Tests prüfen“ prüft dein Programm mit verschiedenen Eingaben.",
	run: "▶ Ausführen",
	allTests: "Alle Tests prüfen",
	template: "Vorlage laden",
	hint: "Tipp anzeigen",
	solution: "Lösung vergleichen",
	solutionNote:
		"Vergleiche die Schritte mit deinem eigenen Ansatz. Die Lösung wird nicht automatisch als eigener Übungserfolg markiert.",
	inputs: "Eingaben",
	notRun: "Noch nicht ausgeführt.",
	stepByStep: "Schritt für Schritt",
	traceNote:
		"Wiedergabe einer begrenzten Aufzeichnung, bis zu 250 Zustände. Ein Haltepunkt stoppt die Wiedergabe an der gewählten Zeile.",
	stepBack: "← Schritt",
	stepNext: "Schritt →",
	untilBreakpoint: "Bis Haltepunkt →",
	breakpoint: "Haltepunkt in Zeile",
	toggleBreakpoint: "Setzen / entfernen",
	noBreakpoint: "Kein Haltepunkt gesetzt.",
	runFirst: "Führe zuerst dein Programm aus.",
	bothDone: "✓ Kurzcheck und Codeaufgabe gelöst.",
	quizStatus: "Kurzcheck",
	codeStatus: "Codeaufgabe",
	chooseFirst: "Wähle zuerst eine Antwort.",
	correct: "✓ Richtig. ",
	incorrect: "Noch nicht. ",
	templateLoaded: "Die Vorlage ist wieder im Editor.",
	noOutput: "(keine Ausgabe)",
	testsPassed: "✓ Alle Tests bestanden.",
	testsFailed: "Noch nicht alle Tests bestanden.",
	expected: "Erwartet",
	actual: "erhalten",
	error: "Fehler",
	variables: "Variablen im aktuellen Zustand",
	name: "Name",
	value: "Wert",
	noVariables: "Noch keine Variablen angelegt.",
	outputSoFar: "Bisherige Ausgabe",
	line: "Zeile",
	state: "Zustand",
	missingTitle: "Lektion nicht gefunden",
	missingText:
		"Dieser Link enthält keine bekannte Lektion. Wähle eine Lektion im Lernpfad.",
	resetTitle: "Fortschritt zurücksetzen?",
	resetText:
		"Damit entfernst du die gelösten Aufgaben und alle gespeicherten Codeentwürfe beider Sprachen dieses Pakets aus diesem Browser.",
	confirmReset: "Ja, zurücksetzen",
	zamTitle: "Was du verstehst, mit ZAM behalten",
	zamIntro:
		"Öffne ZAM Studio und wähle bei Lern-Karten im Importmenü „Aus der ZAM Academy“. Nimm dort „Algorithmen und Programmieren“ auf.",
	zamLinks:
		"Jede Karte führt zurück zu ihrer Lektion. Falls das Paket noch nicht im Angebot erscheint, wird es mit einer späteren Veröffentlichung verfügbar.",
	zamOnlyCards: "Die App selbst exportiert keine zweite Kartenliste.",
	languageChanged:
		"Sprache geändert. Die gespeicherte Codevorlage dieser Sprache ist geladen; Ausgaben und Ablaufspur wurden geleert.",
	sourceCurriculum:
		"LehrplanPLUS Bayern · Informationstechnologie · Modul 2.6.1",
	sourceStandard: "ECMA-262 · Sprachstandard JavaScript (ECMAScript)",
	syntaxTitle: "Deine Lernsprache",
	syntaxScope:
		"Ein bewusst begrenzter JavaScript-Ausschnitt: let, Zahlen, Texte, Booleans, null, Felder, Indexzugriff, length, + − * / %, Vergleiche mit === und !==, < > <= >=, &&, || und !, if/else, while, do-while, for-Zählschleifen sowie Funktionen mit Parametern und return. Kommentare: // oder /* … */.",
	syntaxHelpers:
		"read() und print() sind Hilfsfunktionen dieser Werkstatt. Sie gehören nicht zum JavaScript-Sprachstandard. Funktionen stehen auf der obersten Programmebene und werden vor ihrem ersten Aufruf definiert. Anweisungen brauchen hier ein Semikolon. ++ und -- sind als einzelne Anweisungen erlaubt.",
	syntaxLimits:
		"Kein DOM, Netz, Dateizugriff, eval, Objekte, Klassen, Methoden oder vollständiges JavaScript. Keine automatische Typumwandlung bei Zahlenoperationen; == und != werden mit einem Hinweis abgelehnt. Ein ungültiger Feldindex ist hier ein Fehler. Funktionen ohne return liefern hier null statt JavaScripts undefined.",
	syntaxResources:
		"Grenzen: 20.000 Zeichen, 1.200 Rechenschritte, 20 verschachtelte Aufrufe, 100 Feldeinträge, Tiefe 10 und 1.000 Wertknoten pro Zustand, 100 Ausgaben, 250 Spurzustände und eine begrenzte Gesamtgröße der Spur. Sehr große oder zyklische Felder werden verweigert.",
	syntaxTests:
		"Die Tests prüfen Ausgaben für vorgegebene Eingaben, nicht jeden denkbaren Programmweg.",
};
const en: typeof de = {
	brand: "Algorithms",
	tagline: "ZAM Academy · Understanding programming",
	path: "Learning path",
	help: "Syntax guide",
	zam: "Remember with ZAM",
	language: "Language / Sprache",
	progress: "Progress",
	reset: "Reset progress",
	close: "Close",
	footerScope: "Bavarian LehrplanPLUS · IT 2.6.1 · modular advanced course",
	privacy:
		"No accounts or tracking. Your code and progress stay in this browser.",
	storage:
		"Storage is blocked. You can keep practising; your progress remains available for this session.",
	official: "Official curriculum ↗",
	eyebrow: "YOUR PATH FROM A PROCESS TO A PROGRAM",
	heroTitle: "Make your ideas",
	heroEm: "executable.",
	heroText:
		"Plan clear steps. Write your own code. Discover why it works — and where it still needs attention.",
	continue: "Continue learning",
	start: "Start with the first lesson",
	heroMeta: "20 short lessons · real coding exercises · works offline",
	exampleLabel: "Example program",
	firstIdea: "Your first idea",
	exampleComment: "// Turn a rule into a process.",
	output: "Output",
	traceable: "Follow the steps as they happen",
	scope: "Your learning scope",
	scopeText:
		"IT 2.6.1, “Modelling and coding algorithms”, approximately 14 teaching hours. Each school chooses when to teach this module. This package practises an explicitly limited JavaScript subset; it is not a complete year-long IT course.",
	stage: "STAGE",
	complete: "Practised",
	open: "Not yet practised",
	ownWorkTitle: "Understanding comes from doing.",
	ownWorkText:
		"The workshop checks output for several inputs. A tick marks successful practice; it does not replace independent projects or assessment by a teacher.",
	previous: "Previous lesson",
	next: "Next lesson",
	understand: "UNDERSTAND",
	model: "The process as a model",
	modelNote:
		"A simplified process strip. Add your own structured diagrams or flowcharts as a further activity.",
	quickCheck: "QUICK CHECK",
	choose: "Choose an answer",
	checkAnswer: "Check answer",
	quizAlready: "You have already solved this quick check.",
	practiceStatus: "Your practice progress",
	nextLesson: "Next lesson →",
	backPath: "Back to learning path",
	workshop: "CODE WORKSHOP",
	subset: "JavaScript subset",
	yourTurn: "Your turn",
	readPrint:
		"read() supplies the test inputs in order. print(value) displays a value. Use a decimal point in numbers.",
	codeLocale:
		"Examples and test values follow the selected language. German and English code drafts are saved separately; completed concepts count in both languages.",
	program: "Your program",
	editorHelp:
		"“Run” shows test 1 and its trace. “Check all tests” checks your program with different inputs.",
	run: "▶ Run",
	allTests: "Check all tests",
	template: "Load starter",
	hint: "Show a hint",
	solution: "Compare a solution",
	solutionNote:
		"Compare these steps with your own approach. Viewing a solution does not automatically mark your own exercise as solved.",
	inputs: "Inputs",
	notRun: "Not run yet.",
	stepByStep: "Step by step",
	traceNote:
		"Replay a bounded recording of up to 250 states. A breakpoint pauses playback at the selected line.",
	stepBack: "← Step",
	stepNext: "Step →",
	untilBreakpoint: "To breakpoint →",
	breakpoint: "Breakpoint at line",
	toggleBreakpoint: "Add / remove",
	noBreakpoint: "No breakpoint set.",
	runFirst: "Run your program first.",
	bothDone: "✓ Quick check and coding task solved.",
	quizStatus: "Quick check",
	codeStatus: "Coding task",
	chooseFirst: "Choose an answer first.",
	correct: "✓ Correct. ",
	incorrect: "Not quite. ",
	templateLoaded: "The starter code is back in the editor.",
	noOutput: "(no output)",
	testsPassed: "✓ All tests passed.",
	testsFailed: "Some tests have not passed yet.",
	expected: "Expected",
	actual: "got",
	error: "Error",
	variables: "Variables in the current state",
	name: "Name",
	value: "Value",
	noVariables: "No variables declared yet.",
	outputSoFar: "Output so far",
	line: "Line",
	state: "State",
	missingTitle: "Lesson not found",
	missingText:
		"This link does not identify a known lesson. Choose one in the learning path.",
	resetTitle: "Reset your progress?",
	resetText:
		"This removes solved exercises and saved code drafts for both languages of this package from this browser.",
	confirmReset: "Yes, reset",
	zamTitle: "Keep what you understand with ZAM",
	zamIntro:
		"Open ZAM Studio and choose “From ZAM Academy” in the Learning Cards import menu. Add “Algorithms and Programming”. The package may appear under its German title, “Algorithmen und Programmieren”.",
	zamLinks:
		"Each card links back to its lesson. If the package is not listed yet, it will become available after a later publication.",
	zamOnlyCards: "The app does not export a separate card list.",
	languageChanged:
		"Language changed. This language’s saved draft is loaded; output and trace have been cleared.",
	sourceCurriculum:
		"Bavarian LehrplanPLUS · Information technology · Module 2.6.1",
	sourceStandard: "ECMA-262 · JavaScript language standard (ECMAScript)",
	syntaxTitle: "Your learning language",
	syntaxScope:
		"A deliberately limited JavaScript subset: let, numbers, strings, Booleans, null, arrays, index access, length, + − * / %, comparisons with === and !==, < > <= >=, &&, || and !, if/else, while, do-while, counting for loops, and functions with parameters and return. Comments: // or /* … */.",
	syntaxHelpers:
		"read() and print() are workshop helpers, not part of the JavaScript standard. Define functions at the top level before their first call. Statements need a semicolon here. ++ and -- are supported as separate statements.",
	syntaxLimits:
		"No DOM, network, file access, eval, objects, classes, methods or complete JavaScript. Numeric operations do not automatically convert text; == and != are rejected with a helpful message. Invalid array indices are errors here. Functions without return produce null instead of JavaScript’s undefined.",
	syntaxResources:
		"Limits: 20,000 source characters, 1,200 execution steps, 20 nested calls, 100 array elements, depth 10 and 1,000 expanded value nodes per state, 100 outputs, 250 trace states and a bounded total trace size. Very large or cyclic arrays are rejected.",
	syntaxTests:
		"Tests check output for specified inputs, not every possible program path.",
};
export const UI = { de, en };
export const stageNames: Record<Locale, string[]> = {
	de: [
		"Abläufe und Werte",
		"Entscheidungen und Schleifen",
		"Felder und Funktionen",
		"Prüfen und verbessern",
	],
	en: [
		"Processes and values",
		"Decisions and loops",
		"Arrays and functions",
		"Checking and improving",
	],
};
export const progressLabel = (locale: Locale, done: number, total: number) =>
	locale === "en"
		? `${done} of ${total} lessons practised`
		: `${done} von ${total} Lektionen geübt`;
export const lessonLabel = (
	locale: Locale,
	stage: number,
	index: number,
	total: number,
) =>
	locale === "en"
		? `STAGE ${stage} · LESSON ${index} OF ${total}`
		: `ETAPPE ${stage} · LEKTION ${index} VON ${total}`;
export const runLabel = (locale: Locale, steps: number, states: number) =>
	locale === "en"
		? `Finished. ${steps} execution steps; ${states} states recorded.`
		: `Ausgeführt. ${steps} Rechenschritte; ${states} Zustände aufgezeichnet.`;
export const chooseLineLabel = (locale: Locale, count: number) =>
	locale === "en"
		? `Choose a line between 1 and ${count}.`
		: `Wähle eine Zeile zwischen 1 und ${count}.`;
export const breakpointsLabel = (locale: Locale, lines: number[]) =>
	(locale === "en" ? "Breakpoints: " : "Haltepunkte: ") + lines.join(", ");
