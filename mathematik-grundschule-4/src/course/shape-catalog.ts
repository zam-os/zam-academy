import type { ForestLesson } from "./catalog";
export const SHAPE_LESSONS: ForestLesson[] = [
	{
		id: "wege-lageplaene",
		evidenceGoals: [
			"Einen Zielpunkt im Lageplan bestimmen",
			"Eine wirkliche Weglänge berechnen",
			"Den Startpunkt rückwärts bestimmen",
		],
		world: "shape",
		title: "Milos Inselkarte",
		shortTitle: "Wege und Lagepläne",
		icon: "↱",
		lead: "Eine kleine Karte hilft Milo beim Orientieren. Beschreibe Wege und verbinde Planstrecken mit wirklichen Längen.",
		goals: [
			"Einen Weg im Lageplan verfolgen",
			"Planabstände in wirkliche Wege übersetzen",
			"Vom Ziel rückwärts zum Start finden",
		],
		paragraphs: [
			"Ein Lageplan zeigt Orte von oben. Er ist eine vereinfachte Darstellung: Nicht jedes Detail ist eingezeichnet. Lies zuerst die Orientierung. In dieser Werkstatt liegt Norden oben, Osten rechts, Süden unten und Westen links.",
			"Spalten zählen wir von links, Zeilen von oben. Spalte 2, Zeile 3 heißt: zweites Feld von links und drittes von oben. Ein Schritt nach Osten erhöht die Spaltenzahl, ein Schritt nach Norden verringert die Zeilenzahl. Das sind Planrichtungen, nicht deine augenblickliche Blickrichtung.",
			"Ein Feldabstand kann in Wirklichkeit zum Beispiel 20 m bedeuten. Drei solche Abstände entsprechen dann 60 m. Für einen Weg mit einer Ecke addierst du beide Abschnitte. Die direkte Luftlinie wäre eine andere Strecke.",
			"Um vom Ziel zum Start zurückzugehen, kehrst du Reihenfolge und Richtung der Bewegungen um. Aus erst zwei nach Osten, dann einem nach Süden wird erst einer nach Norden, dann zwei nach Westen. Zeichne auf Papier auch einen eigenen einfachen Lageplan und erkläre ihn jemandem.",
		],
		example:
			"Milo startet bei Spalte 1, Zeile 2. Er geht zwei Abstände nach Osten und einen nach Süden und endet bei Spalte 3, Zeile 3. Bei 20 m je Abstand ist der Weg 3 · 20 m = 60 m lang. Rückwärts geht er zuerst nach Norden, dann nach Westen.",
		takeaway:
			"Erst die Orientierung lesen. Wegabschnitte zählen und addieren; rückwärts kehrst du Reihenfolge und Richtungen um.",
		transfer:
			"Wege führen jetzt auch nach Westen oder Norden. Bestimme die wirkliche Weglänge oder finde einen unbekannten Anfang.",
		quiz: {
			goal: 3,
			prompt:
				"Du gehst erst nach Osten, dann nach Norden. Wie kehrst du auf demselben Weg zurück?",
			choices: [
				{ label: "Erst nach Süden, dann nach Westen.", correct: true },
				{ label: "Erst nach Westen, dann nach Süden.", correct: false },
				{ label: "Noch einmal nach Osten und Norden.", correct: false },
			],
			explanation:
				"Du machst die letzte Bewegung zuerst rückgängig. Norden wird Süden, danach Osten zu Westen.",
		},
		parentPrompt:
			"Skizziere ein Zimmer oder einen sicheren bekannten Weg. Erkläre Orientierung und Legende. Die App prüft keine tatsächliche Wegbegehung.",
	},
	{
		id: "wuerfelgebaeude-ansichten",
		evidenceGoals: [
			"Würfel im vollständigen Bauplan zählen",
			"Höhen der Vorderansicht bestimmen",
			"Eine fehlende Stapelhöhe berechnen",
		],
		world: "shape",
		title: "Milos Würfelhafen",
		shortTitle: "Würfelgebäude und Ansichten",
		icon: "▦",
		lead: "Baue Stapel und verknüpfe Schrägbild, Bauplan und Vorderansicht. Verdeckte Würfel gehören dazu.",
		goals: [
			"Ein Gebäude nach Bauplan bauen und zählen",
			"Eine Vorderansicht aus Stapelhöhen bestimmen",
			"Einen fehlenden Stapel aus der Gesamtzahl finden",
		],
		paragraphs: [
			"Ein Würfelgebäude besteht hier aus gleich großen Einheitswürfeln. Jeder Stapel ist von unten lückenlos gefüllt. Ein Bauplan zeigt von oben, wie hoch jeder Stapel ist. Die Zahl 0 bedeutet: An diesem Platz steht kein Würfel.",
			"Die hintere Reihe steht im Bauplan oben, die vordere unten. Ein Schrägbild lässt mehrere Seiten erkennen, kann aber Würfel verdecken. Für die Gesamtzahl addierst du alle Stapelhöhen des vollständigen Bauplans, auch die hinteren.",
			"Bei der Vorderansicht schaust du vom unteren Rand nach hinten. Stapel in derselben Spalte liegen hintereinander. Der höchste bestimmt die Höhe dieser Spalte in der Ansicht. Zwei hintereinander stehende Stapel mit Höhe 2 und 3 ergeben in der Vorderansicht Höhe 3, nicht 5.",
			"Kennt man die Gesamtzahl aller Würfel und die übrigen Stapel, lässt sich ein fehlender Stapel ergänzen. Ziehe die bekannten Würfel vom Ganzen ab. Eine Vorderansicht allein bestimmt das Gebäude nicht immer eindeutig: Dahinter können verschiedene niedrigere Stapel verborgen sein.",
		],
		example:
			"Hinten stehen Stapel mit Höhen 1 und 3, vorne mit Höhen 2 und 1. Zusammen sind es 1 + 3 + 2 + 1 = 7 Würfel. Die Vorderansicht ist links 2 und rechts 3 Würfel hoch. Die sichtbare Silhouette enthält nicht die ganze Information des Bauplans.",
		takeaway:
			"Bauplanzahlen sind Stapelhöhen. Für alle Würfel addierst du; für die Vorderansicht suchst du die größte Höhe je Spalte.",
		transfer:
			"Jetzt kommen breitere Pläne und unbekannte Stapel dazu. Unterscheide Gesamtzahl, belegte Plätze und Höhe der Ansicht.",
		quiz: {
			goal: 2,
			prompt:
				"Links stehen hintereinander ein 2er- und ein 4er-Stapel. Wie hoch ist diese Spalte von vorne?",
			choices: [
				{
					label: "4 Würfel hoch: Der höhere Stapel bestimmt die Ansicht.",
					correct: true,
				},
				{ label: "6 Würfel hoch: Die Höhen immer addieren.", correct: false },
				{
					label: "2 Würfel hoch: Hintere Stapel sind grundsätzlich unsichtbar.",
					correct: false,
				},
			],
			explanation:
				"Von vorne liegen die Stapel hintereinander. Der höchste reicht bis Höhe 4; die Ansicht ist nicht ihre Summe.",
		},
		parentPrompt:
			"Baue mit gleich großen Würfeln, zeichne den Bauplan und betrachte von vorne. Welche Würfel sind verdeckt? Die App beobachtet den echten Bau nicht.",
	},
	{
		id: "figuren-zeichnen",
		evidenceGoals: [
			"Gegenüberliegende Seitenlängen eines Rechtecks bestimmen",
			"Rechte Winkel und Randlänge eines Rechtecks bestimmen",
			"Abstände im Kreis beschreiben",
		],
		world: "shape",
		title: "Milos Zeichenatelier",
		shortTitle: "Figuren zeichnen",
		icon: "⌑",
		lead: "Eigenschaften machen eine Figur erkennbar. Markiere Rechtecke und plane mit Lineal, Geodreieck und Zirkel auf Papier.",
		goals: [
			"Ein Rechteck nach Längenangaben markieren",
			"Vier rechte Winkel an einem Rechteck prüfen",
			"Gleiche Abstände im Kreis beschreiben",
		],
		paragraphs: [
			"Ein rechter Winkel ist die Ecke wie an einem sorgfältig gefalteten Blatt. Ein Rechteck hat vier rechte Winkel; gegenüberliegende Seiten sind gleich lang und parallel. Ein Quadrat ist ein besonderes Rechteck mit vier gleich langen Seiten. Auch ein gedrehtes Rechteck bleibt ein Rechteck.",
			"Im Punktgitter markieren vier passende Eckpunkte ein Rechteck. In dieser Werkstatt liegen seine Seiten waagerecht und senkrecht: Wähle zwei verschiedene Spalten und zwei verschiedene Zeilen. Der Abstand von einem Punkt zum nächsten ist ein Abschnitt, nicht ein zusätzlicher Punkt.",
			"Zeichne auf Papier mit einem echten Lineal eine Strecke und mit dem Geodreieck einen rechten Winkel. Prüfe Längen und Winkel gemeinsam. Die Bildschirmdarstellung ist eine Skizze, keine verlässliche Zentimeterskala. Für die Randlänge kannst du die vier Seiten einzeln addieren.",
			"Beim Kreis hältst du die Zirkelspitze an einem festen Mittelpunkt und die Öffnung unverändert. Jeder Randpunkt hat denselben Abstand zur Mitte. Eine gerade Strecke von Rand zu Rand durch die Mitte besteht aus zwei solchen Abständen. Übe das sichere Zeichnen mit geeignetem Material und Unterstützung.",
		],
		example:
			"Ein Rechteck ist oben 5 cm und rechts 3 cm lang. Unten sind es ebenfalls 5 cm, links 3 cm. Alle vier Ecken sind rechte Winkel; sein Rand ist 5 + 3 + 5 + 3 = 16 cm lang. Ein Kreis mit 20 mm Zirkelöffnung hat überall 20 mm Abstand von der Mitte zum Rand.",
		takeaway:
			"Ein Rechteck braucht vier rechte Winkel. Ein Kreis hat an jedem Randpunkt denselben Abstand zur Mitte. Prüfe mit passenden Hilfsmitteln.",
		transfer:
			"Begründe Eigenschaften und prüfe einen Zeichenplan. Die App prüft markierte Gitterpunkte und Rechenwege; die genaue Papierzeichnung bleibt eine eigene Tätigkeit.",
		quiz: {
			goal: 2,
			prompt:
				"Reichen zwei Paare gleich langer gegenüberliegender Seiten für ein Rechteck?",
			choices: [
				{
					label: "Nein. Zusätzlich müssen alle vier Winkel rechte Winkel sein.",
					correct: true,
				},
				{ label: "Ja. Die Winkel spielen keine Rolle.", correct: false },
				{
					label:
						"Nein. Ein Rechteck muss immer vier gleich lange Seiten haben.",
					correct: false,
				},
			],
			explanation:
				"Auch ein schiefes Parallelogramm hat gleich lange gegenüberliegende Seiten. Das Rechteck braucht zusätzlich vier rechte Winkel.",
		},
		parentPrompt:
			"Zeichne auf Papier eine Strecke, ein Rechteck und einen Kreis. Prüfe gemeinsam Längen, rechte Winkel und gleichbleibende Zirkelöffnung; dies wird nicht digital als ausgeführte Konstruktion gewertet.",
	},
	{
		id: "koerper-netze",
		evidenceGoals: [
			"Ein Netz durch gedankliches Falten prüfen",
			"Ein gültiges Würfelnetz selbst ergänzen",
			"Deckungsgleiche Flächenpaare des Quaders erkennen",
		],
		world: "shape",
		title: "Milos Faltwerft",
		shortTitle: "Körper und Netze",
		icon: "▧",
		lead: "Aus flachen Flächen entstehen Körper. Ergänze und erfinde Würfelnetze und untersuche auch einen Quader.",
		goals: [
			"Ein unvollständiges Würfelnetz ergänzen",
			"Ein eigenes gültiges Würfelnetz bauen",
			"Flächenpaare im Quadernetz erkennen",
		],
		paragraphs: [
			"Ein Würfel hat 6 quadratische Flächen, 12 Kanten und 8 Ecken. Alle seine Kanten sind gleich lang. Ein Quader hat ebenfalls 6 Flächen, 12 Kanten und 8 Ecken; seine Flächen sind Rechtecke und gegenüberliegende Flächen deckungsgleich. Der Würfel ist ein besonderer Quader.",
			"Ein Netz ist die aufgeklappte Oberfläche eines Körpers. Beim Würfel besteht es aus sechs gleich großen Quadraten, die an ganzen Kanten verbunden sind. Sechs Quadrate allein genügen nicht: Ihre Anordnung muss beim Falten passen. Keine zwei Flächen dürfen dieselbe Seite bedecken.",
			"Halte beim gedanklichen Falten eine Fläche als Boden fest und klappe benachbarte Flächen hoch. Prüfe dann die übrigen Flächen. Eine Drehung oder ein Wenden des ganzen Netzes ändert seine Eignung nicht. Deckungsgleich heißt, dass Formen durch passendes Aufeinanderlegen genau übereinstimmen.",
			"Ein Quader mit drei verschiedenen Kantenlängen hat drei Paare deckungsgleicher Rechtecke. Gegenüberliegende Flächen bilden jeweils ein Paar. Zeichne oder schneide ein Papiernetz und prüfe das Falten praktisch; die App kann nur die eingegebene Anordnung prüfen, nicht deinen gebauten Körper.",
		],
		example:
			"Bei einem Quader mit Kanten 2, 3 und 4 Einheiten haben je zwei Flächen die Seiten 2 und 3, 2 und 4 sowie 3 und 4. Das sind zusammen sechs Rechtecke. Ein Würfelnetz aus sechs Quadraten ist dagegen nur gültig, wenn sie beim Falten sechs verschiedene Seiten schließen.",
		takeaway:
			"Ein Würfelnetz braucht sechs passend verbundene Quadrate ohne Überlappung beim Falten. Beim Quader sind gegenüberliegende Flächen deckungsgleich.",
		transfer:
			"Untersuche unbekannte Netze durch gedankliches Falten und begründe, was beim Drehen erhalten bleibt. Vergleiche außerdem die Flächen eines Quaders.",
		quiz: {
			goal: 1,
			prompt: "Sind sechs an Kanten verbundene Quadrate immer ein Würfelnetz?",
			choices: [
				{
					label: "Nein. Beim Falten können Flächen übereinander liegen.",
					correct: true,
				},
				{ label: "Ja. Nur die Anzahl ist wichtig.", correct: false },
				{
					label: "Ja. Jede Anordnung lässt sich durch Drehen reparieren.",
					correct: false,
				},
			],
			explanation:
				"Die sechs Flächen müssen sechs verschiedene Seiten des Würfels bilden. Die Nachbarschaften entscheiden mit.",
		},
		parentPrompt:
			"Zeichne ein Netz auf kariertes Papier und falte es mit Hilfe. Welche Kanten treffen zusammen? Schneiden und Falten sind unüberprüfte Tätigkeiten außerhalb der App.",
	},
	{
		id: "spiegeln-symmetrie",
		evidenceGoals: [
			"Einen Spiegelpunkt bestimmen",
			"Den Abstand zur Symmetrieachse bestimmen",
			"Anzahl der Spiegelpunkte und Spiegelregel begründen",
		],
		world: "shape",
		title: "Milos Spiegelsteg",
		shortTitle: "Spiegeln und Symmetrie",
		icon: "◫",
		lead: "Auf der anderen Seite des Stegs entsteht ein Spiegelbild. Gleicher Abstand zur Achse ist entscheidend.",
		goals: [
			"Spiegelpunkte an einer senkrechten Achse ergänzen",
			"Gleiche Abstände zur Symmetrieachse prüfen",
			"An einer waagerechten Achse spiegeln",
		],
		paragraphs: [
			"Eine Figur heißt achsensymmetrisch, wenn ihre beiden Teile beim Falten an einer passenden Geraden genau aufeinanderpassen. Diese Gerade heißt Symmetrieachse. Die Teile sind deckungsgleich; gleich viele Punkte allein reichen dafür nicht aus.",
			"Ein Punkt und sein Spiegelpunkt liegen genau gegenüber und im gleichen Abstand von der Achse. Bei einer senkrechten Achse bleibt die Höhe, bei einer waagerechten Achse die Spalte gleich. Ein Punkt direkt auf der Achse bleibt an seinem Platz.",
			"Im Fünfergitter dieser Werkstatt geht die senkrechte Mittelachse durch die Mittelpunkte der dritten Spalte, die waagerechte durch die dritte Zeile. Ein Punkt in Spalte 1 wird an der senkrechten Mittelachse zu Spalte 5. Beide sind zwei Feldabstände von Spalte 3 entfernt.",
			"Spiegle eine Figur Punkt für Punkt. Eine Verschiebung aller Punkte nach rechts ist keine Spiegelung. Prüfe mit einem Spiegel oder durch Falten von Papier nach. Die App kontrolliert die markierten Gitterfelder; dein Umgang mit dem echten Spiegel muss jemand vor Ort beobachten.",
		],
		example:
			"Der Punkt in Spalte 2, Zeile 1 liegt einen Abstand links von der senkrechten Mittelachse in Spalte 3. Sein Spiegelpunkt liegt einen Abstand rechts: Spalte 4, Zeile 1. An einer waagerechten Achse durch Zeile 3 würde derselbe Ausgangspunkt zu Spalte 2, Zeile 5.",
		takeaway:
			"Spiegelpunkte liegen genau gegenüber und gleich weit von der Symmetrieachse entfernt. Auf der Achse bleibt ein Punkt fest.",
		transfer:
			"Die Achse kann nun waagerecht liegen. Beschreibe Abstände und prüfe auch eine ganze Figur auf passende Spiegelpunkte.",
		quiz: {
			goal: 2,
			prompt: "Was muss bei einem Punkt und seinem Spiegelpunkt stimmen?",
			choices: [
				{
					label:
						"Sie liegen genau gegenüber und gleich weit von der Achse entfernt.",
					correct: true,
				},
				{
					label: "Beide müssen immer rechts von der Achse liegen.",
					correct: false,
				},
				{
					label: "Nur die Anzahl der markierten Punkte muss gleich sein.",
					correct: false,
				},
			],
			explanation:
				"Die Lage und der gleiche Abstand zur Achse sind nötig. Beim Falten müssen beide Punkte aufeinanderliegen.",
		},
		parentPrompt:
			"Erzeuge ein Spiegelbild mit Papierfalten oder einem Spiegel. Zeichne die Achse ein und prüfe zwei Punkte. Die App kann die praktische Tätigkeit nicht bestätigen.",
	},
	{
		id: "vergroessern-verkleinern",
		evidenceGoals: [
			"Vergrößerte Seitenlängen berechnen",
			"Verkleinerte Seitenlängen berechnen",
			"Eine fehlerhafte Vergrößerung begründen",
		],
		world: "shape",
		title: "Milos Bilderbrücke",
		shortTitle: "Vergrößern und Verkleinern",
		icon: "⤢",
		lead: "Ein Bild wird größer oder kleiner und behält seine Form. Verändere jede Länge nach derselben Regel.",
		goals: [
			"Alle Längen auf das Doppelte vergrößern",
			"Alle Längen auf die Hälfte verkleinern",
			"Eine einseitige Veränderung korrigieren",
		],
		paragraphs: [
			"Beim maßstäblichen Vergrößern änderst du jede entsprechende Länge mit demselben Faktor. Doppelt so groß in der Länge bedeutet: Aus 1 cm werden 2 cm. Die Angabe 2 : 1 beschreibt diese Vergrößerung der Längen, nicht die Zahl aller Kästchen in der Fläche.",
			"Ein Rechteck mit Breite 2 und Höhe 3 Feldabständen wird beim Verdoppeln 4 breit und 6 hoch. Nur die Breite zu verdoppeln würde seine Form verändern. Auch schräge Strecken und die Abstände entsprechender Punkte müssen zur gleichen Vergrößerung passen.",
			"Beim Verkleinern auf die Hälfte teilst du alle entsprechenden Längen durch 2. Aus 8 cm und 4 cm werden 4 cm und 2 cm. Die Umkehrprobe lautet: Wenn du die kleinen Längen wieder verdoppelst, erhältst du die ursprünglichen Längen.",
			"Im Punktgitter bleibt die linke obere Ecke dieser Aufgaben fest. Zähle Abschnitte zwischen Punkten und markiere die neuen Ecken. Zeichne danach auch eine Vergrößerung auf Papier. Bildschirmfelder sind keine genauen Zentimeter; die Papierzeichnung wird von der App nicht beobachtet.",
		],
		example:
			"Ein Rechteck ist 3 cm breit und 2 cm hoch. Bei der Vergrößerung 2 : 1 wird es 6 cm breit und 4 cm hoch. Bleibt die Höhe bei 2 cm, ist es keine passende Vergrößerung. Beim Halbieren von 6 cm und 4 cm erhältst du wieder 3 cm und 2 cm.",
		takeaway:
			"Jede entsprechende Länge bekommt denselben Faktor. Zum Verdoppeln mal 2, zum Halbieren durch 2; eine einzige veränderte Seite genügt nicht.",
		transfer:
			"Nutze auch andere ganze Faktoren und verbessere einen Plan, in dem nur eine Seitenlänge verändert wurde.",
		quiz: {
			goal: 3,
			prompt:
				"Ein 2 cm breites und 4 cm hohes Rechteck soll doppelte Längen erhalten. Welcher Plan stimmt?",
			choices: [
				{ label: "4 cm breit und 8 cm hoch.", correct: true },
				{ label: "4 cm breit und 4 cm hoch.", correct: false },
				{ label: "3 cm breit und 5 cm hoch.", correct: false },
			],
			explanation:
				"Beide Längen werden mit 2 multipliziert. Dasselbe Stück zu addieren wäre eine andere Regel.",
		},
		parentPrompt:
			"Vergrößere eine einfache Figur im karierten Heft auf doppelte Längen. Prüfe mehrere entsprechende Strecken und danach die Verkleinerung als Umkehrung.",
	},
	{
		id: "parkette-ornamente",
		evidenceGoals: [
			"Eine fehlende Markierung im Grundmuster bestimmen",
			"Vollständige Musterwiederholungen zählen",
			"Ein Grundmuster selbst ergänzen und wiederholen",
		],
		world: "shape",
		title: "Milos Fliesenpfad",
		shortTitle: "Parkette und Ornamente",
		icon: "▨",
		lead: "Lege quadratische Fliesen und erfinde ein Bandornament. Die ganze Wiederholungseinheit bestimmt das Muster.",
		goals: [
			"Quadratische Fliesen ohne Lücken anordnen",
			"Ein vorgegebenes Bandornament fortsetzen",
			"Ein eigenes Grundmuster wiederholen",
		],
		paragraphs: [
			"Ein Parkett bedeckt eine Fläche ohne Lücken und ohne Überlappungen. In dieser Werkstatt verwenden wir gleich große quadratische Fliesen. Die Kreise, Dreiecke und Quadrate auf ihnen sind Markierungen; die Fliese selbst bleibt ein Quadrat.",
			"Bei einem Bandornament wiederholt sich eine festgelegte Einheit entlang eines Bandes. Kreis, Dreieck, Dreieck, Kreis kann eine Einheit sein. Nach allen vier Markierungen beginnt dieselbe Einheit wieder von vorn. Die Einheit muss nicht die kürzestmögliche Beschreibung sein.",
			"Eine kurze Folge allein legt nicht eindeutig fest, wie es weitergeht. Deshalb geben die Aufgaben ihr Grundmuster ausdrücklich an. Zähle die Plätze innerhalb dieser Einheit, statt einzelne Zeichen nach Gefühl anzuhängen. Bei drei Vierergruppen sind es 12 Fliesen.",
			"Du kannst ein eigenes Grundmuster entwerfen und mehrmals wiederholen. Die App prüft hier drei Wiederholungen der angegebenen Einheit aus drei, vier oder fünf Fliesen mit mindestens zwei verschiedenen Markierungen. Ob Teile zusätzlich achsensymmetrisch sind, untersuchst du mit Falten, Zeichnen oder einem Spiegel außerhalb dieser Prüfung.",
		],
		example:
			"Das Grundmuster lautet Kreis – Dreieck – Dreieck – Kreis. Zweimal wiederholt ergibt es acht Fliesen: Kreis – Dreieck – Dreieck – Kreis – Kreis – Dreieck – Dreieck – Kreis. Die zwei Kreise an der Grenze gehören zu zwei benachbarten vollständigen Einheiten.",
		takeaway:
			"Ein Parkett hat keine Lücken oder Überlappungen. Wiederhole bei einem Ornament immer die ganze angegebene oder selbst gewählte Einheit.",
		transfer:
			"Plane weitere vollständige Wiederholungen und erkläre, warum das nächste Zeichen an seiner Stelle steht.",
		quiz: {
			goal: 2,
			prompt:
				"Das Grundmuster ist Kreis – Dreieck – Dreieck. Was folgt nach zwei ganzen Wiederholungen?",
			choices: [
				{
					label: "Ein Kreis als Beginn der nächsten ganzen Einheit.",
					correct: true,
				},
				{
					label: "Immer ein weiteres Dreieck, weil vorher ein Dreieck stand.",
					correct: false,
				},
				{
					label: "Das ist trotz angegebenem Grundmuster unbestimmbar.",
					correct: false,
				},
			],
			explanation:
				"Nach jeder Dreiergruppe beginnt genau dieselbe ausdrücklich festgelegte Einheit mit einem Kreis.",
		},
		parentPrompt:
			"Lege ein Parkett mit Papierquadraten und entwirf ein Bandornament. Beschreibe die Wiederholung und suche mögliche Spiegelachsen. Die App bewertet diese praktische Gestaltung nicht.",
	},
	{
		id: "flaechen-vergleichen",
		evidenceGoals: [
			"Einheitsflächen einer Figur zählen",
			"Flächen beim Umlegen vergleichen",
			"Fehlende Einheitsplättchen berechnen",
		],
		world: "shape",
		title: "Milos Plättchenteppich",
		shortTitle: "Flächen vergleichen",
		icon: "▥",
		lead: "Bedecke Figuren mit gleich großen Plättchen. Die Anzahl gleicher Einheitsflächen hilft beim Vergleichen.",
		goals: [
			"Eine Figur mit Einheitsflächen auslegen",
			"Flächen nach dem Umlegen vergleichen",
			"Fehlende Plättchen bis zum vollen Rahmen bestimmen",
		],
		paragraphs: [
			"Eine Fläche kannst du mit gleich großen Einheitsplättchen auslegen. Jedes Plättchen bedeckt ein Stück. Es dürfen keine Lücken oder Überlappungen bleiben. Zähle die ausgelegten Plättchen je Reihe und addiere ihre Anzahl.",
			"Zum Vergleichen brauchst du dieselbe Einheitsfläche. Zwölf große Plättchen und zwölf winzige Plättchen bedecken nicht dieselbe Fläche. In den Aufgaben sind alle Einheitsplättchen gleich groß, damit ihre Anzahl vergleichbar ist.",
			"Zerlege eine Figur und ordne genau dieselben Plättchen ohne Lücken oder Überlappung neu an. Ihre Fläche bleibt gleich. Eine längliche Form muss nicht größer sein als eine kompakte. Der Rand und die bedeckte Fläche sind unterschiedliche Dinge.",
			"Ein Rahmen mit fünf Reihen und je fünf Plätzen braucht 25 Einheitsplättchen. Sind schon 12 Plätze bedeckt, fehlen 13. Das Auslegen und Umlegen knüpft an das Flächenvergleichen aus den Klassen 1 und 2 an; eine allgemeine Flächenformel ist hier nicht nötig.",
		],
		example:
			"Eine Figur hat in ihren vier Reihen 3, 4, 2 und 3 Einheitsplättchen. Zusammen sind das 12. Mit genau diesen zwölf Plättchen legst du eine andere Form ohne Überlappung: Ihre Fläche bleibt gleich. In einem Rahmen mit 25 Plätzen würden noch 13 Plättchen fehlen.",
		takeaway:
			"Vergleiche mit gleich großen Einheitsflächen. Lückenloses Umlegen derselben Plättchen verändert die Fläche nicht.",
		transfer:
			"Vergleiche auch anders angeordnete Figuren und plane fehlende Einheitsplättchen für einen größeren Rahmen.",
		quiz: {
			goal: 2,
			prompt:
				"Du legst dieselben zehn Einheitsplättchen ohne Lücken oder Überlappung anders an. Was passiert mit der Fläche?",
			choices: [
				{ label: "Sie bleibt gleich groß.", correct: true },
				{
					label: "Sie wird größer, sobald die Figur länger aussieht.",
					correct: false,
				},
				{ label: "Sie wird immer kleiner.", correct: false },
			],
			explanation:
				"Anzahl und Größe der Plättchen bleiben gleich. Ihre neue Anordnung ändert die bedeckte Fläche nicht.",
		},
		parentPrompt:
			"Schneide gleich große Papierquadrate aus, lege zwei Formen und vergleiche durch Umlegen. Besprecht den Unterschied zwischen Rand und Fläche; dies bleibt außerhalb der digitalen Beobachtung.",
	},
	{
		id: "rauminhalte-wuerfel",
		evidenceGoals: [
			"Einheitswürfel schichtweise zählen",
			"Rauminhalte mit gleichen Würfeln vergleichen",
			"Fehlende und verbleibende Würfel berechnen",
		],
		world: "shape",
		title: "Milos Packkiste",
		shortTitle: "Rauminhalte mit Würfeln",
		icon: "▣",
		lead: "Fülle Kisten mit gleich großen Einheitswürfeln. Auch Würfel im Inneren und hinter anderen Stapeln zählen.",
		goals: [
			"Eine Kiste bauen und schichtweise zählen",
			"Rauminhalte mit derselben Würfeleinheit vergleichen",
			"Nach dem Herausnehmen zum Ganzen ergänzen",
		],
		paragraphs: [
			"Ein Rauminhalt beschreibt, wie viel Raum ein Körper einnimmt oder wie viel eine Kiste fasst. Wir vergleichen hier mit gleich großen Einheitswürfeln. Die Würfel füllen den Raum lückenlos aus; hohle Stellen müssen ausdrücklich berücksichtigt werden.",
			"Zähle zuerst eine vollständige Schicht. Bei drei Reihen mit je zwei Würfeln enthält sie sechs Würfel. Zwei gleich aufgebaute Schichten enthalten zwölf. Das ist ein Zählweg am gebauten Modell, keine neue Formel mit Kubikeinheiten.",
			"Würfel im Inneren oder hinter anderen Würfeln zählen ebenfalls. Die Zahl sichtbarer Quadrate auf Außenflächen ist etwas anderes. Vergleiche zwei Gebäude mit derselben Würfelgröße: Gleich viele solcher Würfel bedeuten denselben Rauminhalt, auch wenn ihre äußere Form verschieden ist.",
			"Nimmst du Würfel aus einer vollen Kiste heraus, wird der gefüllte Rauminhalt kleiner. Verbleibende und herausgenommene Würfel ergeben zusammen das Ganze. Baue mit echten Würfeln nach und prüfe deine Schichtenzählung; die App kann das wirkliche Packen nicht beobachten.",
		],
		example:
			"Eine Schicht hat zwei Reihen mit je drei Einheitswürfeln: 6 Würfel. Drei gleiche Schichten enthalten 18. Werden vier herausgenommen, bleiben 14; vier fehlen bis zur vollen Kiste. Ein anders geformtes Gebäude mit denselben 18 Einheitswürfeln hätte denselben Rauminhalt.",
		takeaway:
			"Zähle gleich große Einheitswürfel vollständig, auch im Inneren. Schichten helfen; die Außenflächen allein verraten den Rauminhalt nicht.",
		transfer:
			"Vergleiche anders gebaute Körper und ergänze nach dem Herausnehmen zur vollen Kiste. Die Würfelgröße bleibt gleich.",
		quiz: {
			goal: 2,
			prompt:
				"Zwei verschieden geformte Gebäude bestehen jeweils aus zwölf gleich großen Einheitswürfeln ohne Lücken. Wie vergleichst du ihren Rauminhalt?",
			choices: [
				{
					label: "Er ist gleich, weil Anzahl und Würfelgröße gleich sind.",
					correct: true,
				},
				{
					label: "Das höhere Gebäude hat immer mehr Rauminhalt.",
					correct: false,
				},
				{ label: "Nur die sichtbaren Außenquadrate zählen.", correct: false },
			],
			explanation:
				"Dieselben zwölf Raumeinheiten können anders angeordnet sein. Eine andere äußere Form verändert ihre Gesamtmenge nicht.",
		},
		parentPrompt:
			"Packe eine kleine Kiste mit gleichen Bauwürfeln und zähle schichtweise. Nimm einige heraus und prüfe die Ergänzung. Praktisches Packen ist kein automatisch bestätigter App-Erfolg.",
	},
];
