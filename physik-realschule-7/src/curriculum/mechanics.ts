import { classify, lesson, sequence, task } from "./helpers";

export const MECHANICS = [
	lesson(1, {
		id: "me-messen",
		title: "Länge und Zeit sinnvoll messen",
		illustration: "measurement",
		model: "measurement",
		calculation: "length",
		intro:
			"Welche Ziffern kannst du wirklich ablesen? Unterscheide eine Messung von einer bloßen Zahl.",
		paragraphs: [
			"Wähle ein Messgerät mit passendem Messbereich und passender Auflösung: ein Lineal für ein Heft, ein Maßband für den Raum, eine Stoppuhr für einen Lauf. Eine Länge braucht einen Zahlenwert und eine Einheit. Es gilt: 1 m = 100 cm = 1 000 mm; 1 min = 60 s. Rechne Einheiten um, bevor du Werte vergleichst.",
			"Lege den Körper an der Nullmarke an und schaue senkrecht auf die Skala. Bei einer beschädigten Nullmarke misst du zwischen zwei anderen Marken: Liegen Anfang und Ende bei 3 cm und 7,5 cm, ist die Länge 4,5 cm. Die Endmarke allein ist keine Länge. Eine gröbere Skala erlaubt weniger genaue Angaben; zusätzliche Dezimalstellen machen das Gerät nicht genauer.",
			"Bei einer Handstoppung beeinflusst deine Reaktionszeit Start und Ende. Miss mehrfach unter denselben Bedingungen und notiere die einzelnen Werte. Stimmen sie nicht genau überein, ist das kein Grund, sie passend zu machen. Besprich zufällige Schwankungen und mögliche systematische Fehler, etwa eine falsche Nullstellung. Das Modell zeigt nur Ablesung und Skalenabstand, keine vollständige Messunsicherheit.",
		],
		takeaway:
			"Messwert = Zahlenwert mit Einheit. Prüfe Nullpunkt, Messbereich, Auflösung und sinnvolle Stellenzahl.",
		quiz: {
			question: "Ein Stift liegt zwischen 2 cm und 8,5 cm. Wie lang ist er?",
			answer: "6,5 cm",
			wrong: ["8,5 cm", "10,5 cm"],
			explanation:
				"Du ziehst die Anfangsmarke von der Endmarke ab: 8,5 cm − 2 cm = 6,5 cm.",
		},
		workshop: classify(
			"Welche Messung passt?",
			["Sinnvolle Messung", "Verbessern"],
			[
				[
					"Raumlänge mit einem Maßband messen",
					0,
					"Das Maßband hat einen passenden Messbereich.",
				],
				[
					"Handgestoppte Laufzeit als 4,123456 s angeben",
					1,
					"Die Reaktionszeit rechtfertigt diese Stellenzahl nicht.",
				],
				[
					"Drei Laufzeiten samt Einheit notieren",
					0,
					"Wiederholungen machen Schwankungen sichtbar.",
				],
				[
					"Schräg an einer Skala ablesen",
					1,
					"Senkrechtes Ablesen vermindert den Parallaxefehler.",
				],
			],
			"Ein genauer wirkender Zahlenwert ist nicht automatisch eine bessere Messung.",
		),
		tasks: {
			1: task(
				"Du misst einen Tisch dreimal: 120,1 cm, 120,0 cm und 120,2 cm. Erkläre, was du protokollierst und weshalb 120,10000 cm keine bessere Angabe ist.",
				"Ich notiere alle drei Messwerte mit cm und das benutzte Gerät. Die Streuung zeigt, dass die Messung nicht beliebig genau ist. Weitere angehängte Nullen verbessern weder Ablesung noch Messgerät.",
				[
					"Alle Werte und Einheit genannt",
					"Streuung erklärt",
					"Scheingenauigkeit erkannt",
				],
				[
					"Was lässt sich auf der Skala ablesen?",
					"Welche Information geht beim Weglassen einzelner Werte verloren?",
				],
			),
			2: task(
				"Zwei Gruppen stoppen denselben Lauf von Hand. Ihre Zeiten unterscheiden sich. Plane eine Prüfung, die zwischen Reaktionsschwankung und einem systematischen Startfehler unterscheidet.",
				"Ich lasse mehrfach dieselbe Strecke mit gleichem Startsignal stoppen und halte die Einzelwerte fest. Wechselnde Abweichungen passen zu Reaktionsschwankungen. Eine Gruppe, die immer erst beim ersten Schritt startet, kann systematisch zu kurze Zeiten messen.",
				[
					"Bedingungen konstant gehalten",
					"Wiederholungen vorgesehen",
					"Systematischer Fehler von Schwankung getrennt",
				],
				[
					"Was bleibt gleich?",
					"Ist die Abweichung immer in derselben Richtung?",
				],
			),
		},
	}),
	lesson(1, {
		id: "me-bewegung",
		title: "Gleichförmige Bewegung und Geschwindigkeit",
		illustration: "motion",
		model: "motion",
		calculation: "speed",
		intro:
			"Gleiche Wege in gleichen Zeiten: So erkennst du eine gleichförmige Bewegung.",
		paragraphs: [
			"Bei einer geradlinig gleichförmigen Bewegung bleiben Richtung und Geschwindigkeit gleich. In jeweils 2 s legt ein Wagen etwa 4 m zurück. Nach 4 s sind es 8 m, nach 6 s sind es 12 m. Der Weg ab dem Start ist direkt proportional zur Zeit: Verdoppelst du die Zeit, verdoppelt sich der Weg. Die direkte Proportionalität kennst du aus Mathematik 6.",
			"Berechne die Geschwindigkeit mit v = s / t. Im Beispiel: 12 m / 6 s = 2 m/s. Daraus folgen s = v · t und t = s / v. Im Zeit-Weg-Diagramm steht die Zeit waagerecht und der zurückgelegte Weg senkrecht. Bei Startweg null entsteht eine Gerade durch den Ursprung. Ihre Steigung beschreibt die Geschwindigkeit. Eine steilere Gerade bedeutet mehr Weg pro Zeit.",
			"Eine einzelne Gesamtstrecke mit Gesamtzeit beweist keine gleichförmige Bewegung: Ein Bus kann zwischendurch halten. Vergleiche mehrere gleich lange Zeitabschnitte. Zur Umrechnung gilt 1 m/s = 3,6 km/h, weil 1 h = 3 600 s und 1 km = 1 000 m. Beschleunigungsformeln gehören erst in spätere Jahrgangsstufen.",
		],
		takeaway:
			"Gleichförmig: gleiche Wege in gleichen Zeiten; v = s / t. Der Weg ab Start ist direkt proportional zur Zeit.",
		quiz: {
			question:
				"Ein Wagen fährt in jeder Sekunde 3 m weiter. Wie weit fährt er in 4 s?",
			answer: "12 m",
			wrong: ["7 m", "0,75 m"],
			explanation:
				"Bei gleichförmiger Bewegung gilt s = v · t = 3 m/s · 4 s = 12 m.",
		},
		workshop: classify(
			"Welche Bewegung ist gleichförmig?",
			["Gleichförmig", "Nicht gleichförmig"],
			[
				[
					"Gerade Fahrt: je 2 s immer 6 m",
					0,
					"Gleiche Wege in gleichen Zeiten bei gleicher Richtung.",
				],
				["Anfahren an einer Ampel", 1, "Die Geschwindigkeit nimmt zu."],
				[
					"Gerade Fahrt: nach 1 s 2 m, nach 2 s 4 m, nach 3 s 6 m",
					0,
					"Das Verhältnis Weg zu Zeit bleibt gleich.",
				],
				[
					"Busfahrt mit Haltestellen",
					1,
					"Die Geschwindigkeit ist unterwegs nicht konstant.",
				],
			],
			"Prüfe mehrere Zeitabschnitte statt nur einer Gesamtzeit.",
		),
		tasks: {
			1: task(
				"Ein Wagen ist nach 2 s bei 5 m, nach 4 s bei 10 m und nach 6 s bei 15 m. Erkläre den Zusammenhang und zeichne die Punkte in ein Zeit-Weg-Diagramm.",
				"Die Wege wachsen in gleichen Zeitabschnitten um je 5 m. Weg und Zeit sind direkt proportional; der Quotient beträgt 2,5 m/s. Mit Zeit auf der waagerechten Achse liegen die Punkte auf einer Geraden durch den Ursprung.",
				[
					"Gleiche Zuwächse beschrieben",
					"2,5 m/s mit Einheit",
					"Achsen und Gerade erklärt",
				],
				["Wie groß ist s / t?", "Wo liegt der Startpunkt?"],
			),
			2: task(
				"Zwei Fahrräder schaffen 600 m in 120 s. Eines hält zwischendurch an. Darfst du bei beiden von gleichförmiger Bewegung sprechen? Begründe und schlage zusätzliche Messungen vor.",
				"Beide haben dieselbe mittlere Geschwindigkeit über die Gesamtstrecke. Das Rad mit Halt bewegt sich dabei nicht gleichförmig. Ich messe die Wege in mehreren gleich langen Zeitabschnitten und prüfe, ob Wegzuwächse und Richtung gleich bleiben.",
				[
					"Gesamtwert nicht als Nachweis verwendet",
					"Halt berücksichtigt",
					"Abschnittsmessungen vorgeschlagen",
				],
				[
					"Was sagt ein Gesamtquotient nicht?",
					"Welche Messreihe wäre aussagekräftiger?",
				],
			),
		},
	}),
	lesson(1, {
		id: "me-kraft",
		title: "Kräfte an ihren Wirkungen erkennen",
		illustration: "forces",
		model: "forces",
		intro:
			"Eine Kraft kann verformen, beschleunigen, bremsen oder die Bewegungsrichtung ändern.",
		paragraphs: [
			"Eine Kraft erkennst du an einer Wechselwirkung: Ein Fuß verformt einen Ball und ändert seine Bewegung. Eine Kraft kann den Betrag oder die Richtung der Geschwindigkeit ändern; auch Bremsen ist eine Bewegungsänderung. Ein gedehntes Gummiband zeigt eine statische Kraftwirkung. Kräfte werden in Newton, kurz N, angegeben und beispielsweise mit einem Federkraftmesser gemessen.",
			"Für eine vollständige Beschreibung brauchst du Betrag, Richtung und Angriffspunkt. Ein Kraftpfeil zeigt die Richtung mit der Spitze und den Betrag mit seiner Länge; der Anfang kennzeichnet den Angriffspunkt. Zwei Pfeile darfst du nur bei demselben gewählten Maßstab vergleichen. Drückst du eine Tür nahe am Scharnier, ist die Wirkung anders als am Griff: Der Angriffspunkt zählt.",
			"Im Alltag meint „Kraft haben“ oft Ausdauer oder Energie. In Physik benennst du, welcher Körper auf welchen wirkt. Eine sichtbare Bewegung allein beweist keine resultierende Kraft in Bewegungsrichtung: Ein bereits fahrender Wagen kann bei ausgeglichenen Kräften geradlinig gleichförmig weiterfahren. Hier erklärst du Änderungen qualitativ, ohne eine Beschleunigungsformel.",
		],
		takeaway:
			"Eine Kraft hat Betrag, Richtung und Angriffspunkt. Sie kann einen Körper verformen oder seinen Bewegungszustand ändern.",
		quiz: {
			question: "Welche Beobachtung zeigt eine dynamische Kraftwirkung?",
			answer: "Ein Ball wird beim Fangen abgebremst.",
			wrong: ["Ein Ball ist rot.", "Ein Ball hat eine Masse."],
			explanation:
				"Beim Abbremsen ändert sich die Geschwindigkeit. Die Fanghand übt eine Kraft auf den Ball aus.",
		},
		workshop: classify(
			"Kraftwirkung oder Eigenschaft?",
			["Verformung", "Bewegungsänderung", "Keine Kraftwirkung beschrieben"],
			[
				["Eine Feder wird länger", 0, "Die Form ändert sich."],
				[
					"Ein Fahrrad wird in einer Kurve umgelenkt",
					1,
					"Auch eine Richtungsänderung ist eine Bewegungsänderung.",
				],
				["Ein Würfel ist blau", 2, "Eine Farbe beschreibt keine Kraftwirkung."],
				[
					"Ein Ball wird schneller",
					1,
					"Der Geschwindigkeitsbetrag ändert sich.",
				],
			],
			"Nenne jeweils den einwirkenden Körper und den betroffenen Körper.",
		),
		tasks: {
			1: task(
				"Beschreibe beim Fangen eines Balls die Kraftwirkung und die drei Bestimmungsstücke eines passenden Kraftpfeils.",
				"Die Hand bremst den Ball und kann ihn verformen. Der Pfeil greift am Kontakt zum Ball an, zeigt beim Bremsen entgegen seiner Bewegung und hat eine zum gewählten Kraftmaßstab passende Länge für den Betrag.",
				[
					"Bremsen als Änderung erkannt",
					"Angriffspunkt und Richtung genannt",
					"Betrag durch Pfeillänge dargestellt",
				],
				[
					"Wer wirkt auf wen?",
					"Welche Bedeutung haben Anfang, Spitze und Länge?",
				],
			),
			2: task(
				"Jemand behauptet: „Solange ein Wagen vorwärts fährt, muss eine vorwärts gerichtete Gesamtkraft wirken.“ Prüfe die Behauptung mit einer ideal glatten geraden Bahn.",
				"Auf einer ideal glatten Bahn kann ein Wagen seine Geschwindigkeit beibehalten, wenn sich die Kräfte ausgleichen. Eine Gesamtkraft ist für eine Änderung des Bewegungszustands erforderlich. Reale Wagen werden durch Reibung langsamer, wenn kein Antrieb sie ausgleicht.",
				[
					"Bewegung von Änderung unterschieden",
					"Modellannahme genannt",
					"Reibung im Alltag berücksichtigt",
				],
				[
					"Was ändert die Gesamtkraft?",
					"Weshalb braucht ein reales Fahrrad einen Antrieb?",
				],
			),
		},
	}),
	lesson(1, {
		id: "me-wechselwirkung",
		title: "Wechselwirkung und Kräftegleichgewicht trennen",
		illustration: "forces",
		model: "forces",
		intro:
			"Zwei gleich große entgegengesetzte Kräfte: Entscheidend ist, auf welche Körper sie wirken.",
		paragraphs: [
			"Drückst du mit der Hand auf die Wand, drückt die Wand gleichzeitig auf deine Hand. Die beiden Wechselwirkungskräfte haben denselben Betrag, entgegengesetzte Richtungen und wirken auf verschiedene Körper. Sie gehören immer zu derselben Wechselwirkung. Deshalb kannst du sie nicht als Kräfte an einem einzigen Körper gegenseitig wegstreichen.",
			"Bei einem ruhenden Buch auf einem Tisch gleichen sich Gewichtskraft der Erde auf das Buch und Stützkraft des Tisches auf das Buch aus. Diese Kräfte wirken beide auf das Buch. Das ist Kräftegleichgewicht am Buch. Die Gegenkraft zur Stützkraft ist dagegen die Kraft des Buchs auf den Tisch; die Gegenkraft zur Erdanziehung ist die Anziehung des Buchs auf die Erde.",
			"Beispiel Schwimmen: Deine Hand drückt Wasser nach hinten, das Wasser drückt deine Hand nach vorn. Ob du schneller wirst, hängt zusätzlich von den übrigen Kräften auf deinen Körper ab. Benenne stets „Körper A wirkt auf Körper B“. Im Modell vergleichst du das Gleichgewicht am Buch mit dem Kontaktpaar Buch und Tisch; die Pfeile stehen schematisch für Kräfte.",
		],
		takeaway:
			"Wechselwirkung: Kräfte an verschiedenen Körpern. Gleichgewicht: Kräfte am selben Körper gleichen sich aus.",
		quiz: {
			question:
				"Was unterscheidet ein Wechselwirkungspaar vom Kräftegleichgewicht?",
			answer:
				"Die Kräfte des Wechselwirkungspaars wirken auf verschiedene Körper.",
			wrong: [
				"Die Kräfte des Wechselwirkungspaars zeigen immer in dieselbe Richtung.",
				"Bei einem Wechselwirkungspaar wirkt nur eine Kraft.",
			],
			explanation:
				"Ein Kräftegleichgewicht wird für einen Körper betrachtet; das Wechselwirkungspaar betrifft zwei Körper.",
		},
		workshop: classify(
			"Wer wirkt auf wen?",
			["Wechselwirkungspaar", "Gleichgewicht an einem Körper"],
			[
				[
					"Hand auf Wand und Wand auf Hand",
					0,
					"Die betroffenen Körper sind verschieden.",
				],
				[
					"Erde auf ruhendes Buch und Tisch auf dieses Buch",
					1,
					"Beide Kräfte wirken auf das Buch.",
				],
				["Buch auf Tisch und Tisch auf Buch", 0, "Das ist das Kontaktpaar."],
				[
					"Zwei gleich große entgegengesetzte Seilkräfte an einer ruhenden Kiste",
					1,
					"Die Kräfte gleichen sich an der Kiste aus.",
				],
			],
			"Gleicher Betrag allein reicht zum Unterscheiden nicht aus.",
		),
		tasks: {
			1: task(
				"Ein Buch liegt ruhig auf dem Tisch. Nenne die beiden Kräfte, die sich am Buch ausgleichen, und das Wechselwirkungspaar zum Kontakt mit dem Tisch.",
				"Am Buch gleichen sich die Gewichtskraft der Erde auf das Buch und die Stützkraft des Tisches auf das Buch aus. Zum Kontakt gehören Tisch auf Buch und Buch auf Tisch. Die Kontaktkräfte betreffen verschiedene Körper.",
				[
					"Gleichgewicht am Buch erklärt",
					"Kontaktpaar vollständig",
					"Betroffene Körper unterschieden",
				],
				[
					"Welche Kräfte wirken beide am Buch?",
					"Welche Kraft wirkt auf den Tisch?",
				],
			),
			2: task(
				"Ein Kind zieht einen Schlitten. Es sagt: „Der Schlitten zieht gleich stark zurück, also kann er nicht losfahren.“ Erkläre den Denkfehler und die Rolle der Reibung.",
				"Zugkraft auf den Schlitten und Gegenkraft auf das Kind wirken auf verschiedene Körper. Für das Losfahren des Schlittens vergleiche ich die Kräfte auf den Schlitten: Zug und entgegenwirkende Reibung. Die Gegenkraft auf das Kind hebt den Zug am Schlitten nicht auf.",
				[
					"Verschiedene Körper benannt",
					"Nur Kräfte am Schlitten verglichen",
					"Reibung einbezogen",
				],
				[
					"Auf welchen Körper wirkt die Gegenkraft?",
					"Welche Kräfte gehören zum Schlitten?",
				],
			),
		},
	}),
	lesson(1, {
		id: "me-feder",
		title: "Eine Feder dehnen: das Gesetz von Hooke",
		illustration: "spring",
		model: "spring",
		calculation: "spring",
		intro:
			"Doppelte Zugkraft, doppelte Dehnung? Prüfe den Bereich, in dem diese Regel gilt.",
		paragraphs: [
			"Miss zuerst die unbelastete Federlänge. Die Dehnung ist die zusätzliche Länge, nicht die gesamte Federlänge. Eine Feder mit 8 cm Ausgangslänge ist unter Last 10 cm lang: Ihre Dehnung beträgt 2 cm. Belastest du die Feder schrittweise und misst jeweils die Dehnung, kannst du Kraft und Dehnung in einem Diagramm vergleichen.",
			"Im Hooke-Bereich sind Kraft F und Dehnung Δl direkt proportional: F = D · Δl. Die Federhärte D sagt, wie viel Kraft pro Dehnung nötig ist. Bei D = 2 N/cm bewirken 4 N eine Dehnung von 2 cm. Eine härtere Feder dehnt sich bei gleicher Kraft weniger. Verwende passende Einheiten: Bei N/cm setzt du die Dehnung in cm ein.",
			"Die Regel gilt nicht beliebig weit. Elastisch bedeutet, dass der Körper nach Entlastung in seine ursprüngliche Form zurückkehrt. Plastische Verformung bleibt bestehen. Nicht jede elastische Verformung muss exakt proportional sein. Im Modell sind nur Kräfte bis 6 N als proportional charakterisiert; oberhalb gibt es bewusst keinen berechneten Dehnungswert. Überlaste reale Federn nicht.",
		],
		takeaway:
			"Hooke-Bereich: F = D · Δl. Prüfe den proportionalen Bereich und unterscheide Dehnung von Gesamtlänge.",
		quiz: {
			question:
				"Eine Feder ist unbelastet 8 cm und belastet 11 cm lang. Wie groß ist die Dehnung?",
			answer: "3 cm",
			wrong: ["11 cm", "19 cm"],
			explanation:
				"Die Dehnung ist die Zunahme der Länge: 11 cm − 8 cm = 3 cm.",
		},
		workshop: classify(
			"Was lässt die Messung zu?",
			[
				"Hooke-Bereich",
				"Keine sichere Hooke-Rechnung",
				"Plastische Verformung",
			],
			[
				[
					"Doppeltes F ergibt doppeltes Δl; die Feder kehrt zurück",
					0,
					"Die Messreihe zeigt Proportionalität im untersuchten Bereich.",
				],
				[
					"Nach Entlastung bleibt die Feder länger",
					2,
					"Es bleibt eine Verformung zurück.",
				],
				[
					"Die Kraft liegt außerhalb des untersuchten Bereichs",
					1,
					"Die Proportionalität darfst du nicht ungeprüft fortsetzen.",
				],
				[
					"Vierfaches F ergibt vierfaches Δl im geprüften Bereich",
					0,
					"Das entspricht einer direkten Proportionalität.",
				],
			],
			"Das Gesetz beschreibt einen geprüften Bereich, keine unbegrenzt dehnbare Feder.",
		),
		tasks: {
			1: task(
				"Für 1 N, 2 N und 3 N misst du 0,5 cm, 1 cm und 1,5 cm Dehnung. Bestimme D und beschreibe das Kraft-Dehnungs-Diagramm.",
				"Der Quotient F / Δl ist jeweils 2 N/cm. Die Federhärte ist daher 2 N/cm. Im Diagramm mit Dehnung waagerecht und Kraft senkrecht liegen die Werte auf einer Geraden durch den Ursprung; die Aussage gilt zunächst nur für den Messbereich.",
				[
					"Quotient korrekt",
					"Achsen und Ursprungsgerade",
					"Gültigkeitsbereich eingeschränkt",
				],
				[
					"Was bleibt beim Dividieren gleich?",
					"Was wurde tatsächlich gemessen?",
				],
			),
			2: task(
				"Eine Feder bleibt nach starker Belastung um 1 cm länger. Darfst du mit der ursprünglichen Federhärte weiter alle Belastungen berechnen? Begründe und schlage eine neue Prüfung vor.",
				"Die bleibende Verlängerung zeigt plastische Verformung. Die alte Ausgangslänge und Kennlinie beschreiben diese Feder nicht mehr zuverlässig. Ich würde sie nicht weiter überlasten und nur unter Anleitung eine neue unbelastete Länge und Messreihe im zulässigen Bereich bestimmen.",
				[
					"Plastische Verformung erkannt",
					"Alte Kennlinie hinterfragt",
					"Schonende neue Prüfung vorgeschlagen",
				],
				["Kehrt die Feder zurück?", "Welche Ausgangsgröße hat sich geändert?"],
			),
		},
	}),
	lesson(1, {
		id: "me-masse-gewicht",
		title: "Masse, Gewichtskraft und Kraftmesser",
		illustration: "spring",
		model: "spring",
		calculation: "weight",
		intro:
			"Eine Masse bleibt beim Ortswechsel gleich. Ihre Gewichtskraft kann sich ändern.",
		paragraphs: [
			"Die Masse beschreibt sowohl die Schwere als auch die Trägheit eines Körpers. Trägheit bedeutet, dass sich ein Körper einer Änderung seines Bewegungszustands widersetzt. Die Einheit der Masse ist Kilogramm, kg. Ein Körper mit der Masse 1 kg hat auch auf dem Mond die Masse 1 kg. Gewichtskraft ist dagegen die Gravitationskraft auf ihn und wird in Newton gemessen.",
			"Es gilt F_G = m · g. Der Ortsfaktor g gibt die Gewichtskraft je Kilogramm an. Nahe der Erdoberfläche rechnest du hier mit 10 N/kg als Näherung; auf dem Mond ungefähr mit 1,6 N/kg. Ein Körper mit 0,5 kg hat damit hier ungefähr 5 N und auf dem Mond ungefähr 0,8 N Gewichtskraft. Verwechsle 500 g Masse nicht mit dem Ortsfaktor g als Formelzeichen.",
			"Einen Federkraftmesser kalibrierst du durch eine unbelastete Nullmarke und bekannte Massen: Bei 10 N/kg steht eine Masse von 0,1 kg für ungefähr 1 N. Trage mehrere Marken ein und prüfe den zulässigen Messbereich. Ein auf kg beschrifteter Federkraftmesser ist auf seinen Kalibrierungsort angewiesen; eine Masse ist keine Kraft. Für eine sichere Kalibrierung verwendest du schulische Geräte unter Anleitung.",
		],
		takeaway:
			"Masse in kg ist ortsunabhängig; Gewichtskraft in N hängt von g ab: F_G = m · g.",
		quiz: {
			question:
				"Was geschieht beim Transport eines Körpers von der Erde zum Mond?",
			answer: "Seine Masse bleibt gleich, seine Gewichtskraft wird kleiner.",
			wrong: [
				"Masse und Gewichtskraft bleiben beide gleich.",
				"Seine Masse verschwindet vollständig.",
			],
			explanation:
				"Die Masse bleibt erhalten. Der kleinere Ortsfaktor des Monds bewirkt eine kleinere Gewichtskraft.",
		},
		workshop: sequence(
			"Einen Kraftmesser kalibrieren",
			[
				[
					"Unbelastete Nullmarke prüfen",
					"Ohne Last beginnt die Skala bei null.",
				],
				[
					"Bekannte Masse anhängen",
					"Die Masse liefert mit dem Ortsfaktor eine bekannte Gewichtskraft.",
				],
				[
					"Gewichtskraft berechnen und Marke setzen",
					"Die Marke wird in N beschriftet.",
				],
				[
					"Mit weiteren zulässigen Lasten prüfen",
					"Mehrere Punkte prüfen Skala und proportionalen Bereich.",
				],
			],
			"Ein Gerät wird durch Vergleich mit bekannten Größen kalibriert.",
		),
		tasks: {
			1: task(
				"Du hängst 200 g an eine Feder. Rechne mit 10 N/kg. Welche Kraftmarke setzt du und warum muss die Nullmarke vorher stimmen?",
				"200 g entsprechen 0,2 kg. Die Gewichtskraft beträgt 0,2 kg · 10 N/kg = 2 N. Ich setze die 2-N-Marke an der belasteten Position. Ein falscher Nullpunkt verschiebt alle Ablesungen und muss vorher korrigiert werden.",
				["Masse in kg umgerechnet", "2 N berechnet", "Nullpunktfehler erklärt"],
				["Wie viele kg sind 200 g?", "Welche Kraft ist ohne Last vorhanden?"],
			),
			2: task(
				"Ein auf der Erde mit kg beschrifteter Federkraftmesser zeigt auf dem Mond bei derselben Masse viel weniger an. Hat der Körper Masse verloren? Begründe und nenne eine passende Beschriftung.",
				"Der Körper hat keine Masse verloren. Die Feder reagiert auf die kleinere Gewichtskraft, weil der Ortsfaktor auf dem Mond kleiner ist. Eine Newtonskala bezeichnet die gemessene Kraft; eine Umrechnung in kg muss den dortigen Ortsfaktor berücksichtigen.",
				[
					"Masse als unverändert bezeichnet",
					"Ortsfaktor als Ursache",
					"Kraftmessung von Massenangabe getrennt",
				],
				["Worauf reagiert die Feder?", "Welche Größe hängt vom Ort ab?"],
			),
		},
	}),
	lesson(1, {
		id: "me-teilchen",
		title: "Fest, flüssig, gasförmig im Teilchenmodell",
		illustration: "particles",
		model: "particles",
		intro:
			"Dieselben Teilchen können verschieden angeordnet sein. Das Modell erklärt Form und Volumen.",
		paragraphs: [
			"Stelle dir Stoffe aus sehr kleinen Teilchen vor. Bei einem festen Körper liegen sie dicht beieinander und schwingen um feste Plätze; der Körper hat eine eigene Form und ein weitgehend festes Volumen. Bei einer Flüssigkeit bleiben die Teilchen nahe beieinander, können ihre Nachbarn aber wechseln. Die Flüssigkeit passt ihre Form dem Gefäß an, ihr Volumen ändert sich wenig.",
			"In einem Gas sind die Teilchen im Vergleich zu ihrer Größe weit voneinander entfernt und bewegen sich ungeordnet. Ein Gas füllt den verfügbaren Raum und lässt sich viel leichter zusammendrücken als eine Flüssigkeit. Beispiel: Luft in einer verschlossenen Spritze kann deutlich komprimiert werden. Die Teilchen selbst werden dabei nicht kleiner; ihre Abstände nehmen ab.",
			"Beim Schmelzen wechseln Anordnung und Bewegungsmöglichkeiten, nicht die Art der Teilchen. Die gezeichneten Kreise sind keine maßstäblichen Kugeln und zeigen keine echte Teilchengröße. Im Modell bleibt ihre Zahl und Größe gleich. Zeichne für deine eigene Skizze gleich große Teilchen, passende Abstände und Bewegungspfeile; begründe damit die beobachteten Stoffeigenschaften.",
		],
		takeaway:
			"Zustände unterscheiden sich durch Anordnung, Abstände und Bewegung der Teilchen, nicht durch deren Größenänderung.",
		quiz: {
			question: "Warum lässt sich ein Gas vergleichsweise gut zusammendrücken?",
			answer: "Zwischen seinen Teilchen ist viel Abstand.",
			wrong: [
				"Die einzelnen Teilchen schrumpfen dabei stark.",
				"Beim Drücken verschwinden die Teilchen.",
			],
			explanation:
				"Vor allem die Abstände werden kleiner; Teilchenzahl und Teilchengröße bleiben im Modell gleich.",
		},
		workshop: classify(
			"Eigenschaft und Zustand",
			["Fest", "Flüssig", "Gasförmig"],
			[
				[
					"Eigene Form, Teilchen schwingen um feste Plätze",
					0,
					"Ein Festkörper behält seine Form.",
				],
				[
					"Nahe Teilchen wechseln ihre Nachbarn",
					1,
					"Eine Flüssigkeit kann fließen.",
				],
				[
					"Füllt den verfügbaren Raum",
					2,
					"Gasförmige Teilchen verteilen sich im Gefäß.",
				],
				[
					"Leicht komprimierbar durch kleinere Abstände",
					2,
					"Die großen Abstände erlauben deutliche Kompression.",
				],
			],
			"Erkläre eine sichtbare Eigenschaft mit dem unsichtbaren Modell.",
		),
		tasks: {
			1: task(
				"Zeichne einen festen und einen flüssigen Stoff im Teilchenmodell. Erkläre, warum die Flüssigkeit die Gefäßform annimmt, aber ihr Volumen ungefähr behält.",
				"Im Festkörper zeichne ich nahe Teilchen mit festen Nachbarn. In der Flüssigkeit bleiben sie nahe beieinander, können aber aneinander vorbeigleiten und Nachbarn wechseln. So ändert sich die Form, während die kleinen Abstände und damit das Volumen ungefähr bleiben.",
				[
					"Dichte Anordnung in beiden Skizzen",
					"Beweglichkeit unterschieden",
					"Form und Volumen erklärt",
				],
				["Bleiben die Nachbarn gleich?", "Müssen die Teilchen größer werden?"],
			),
			2: task(
				"Jemand zeichnet Luft nach dem Zusammendrücken mit halb so vielen, kleineren Teilchen. Korrigiere die Skizze für ein dicht verschlossenes Gefäß und begründe.",
				"In einem dicht verschlossenen Gefäß bleibt die Teilchenzahl gleich. Auch die Teilchengröße bleibt im Modell unverändert. Ich zeichne dieselben Teilchen im kleineren Raum mit geringeren mittleren Abständen; so erkläre ich die Kompression ohne Teilchenverlust.",
				[
					"Teilchenzahl erhalten",
					"Teilchengröße erhalten",
					"Abstände verändert",
				],
				[
					"Kann Luft aus dem Gefäß entweichen?",
					"Welche Modellgröße darf sich ändern?",
				],
			),
		},
	}),
	lesson(1, {
		id: "me-reibung",
		title: "Haften, gleiten und rollen",
		illustration: "friction",
		model: "friction",
		intro:
			"Reibung hilft beim Gehen und Bremsen. Sie kann Bewegung aber auch behindern.",
		paragraphs: [
			"Reibung wirkt bei berührenden Flächen einer relativen Bewegung oder deren Beginn entgegen. Beim Haften verschieben sich die Kontaktflächen noch nicht gegeneinander. Die Haftreibung passt sich dem Zug bis zu einem Höchstwert an. Erst wenn dieser nicht mehr ausreicht, beginnt ein Körper zu gleiten. Gleitreibung wirkt bei bereits gegeneinander gleitenden Flächen.",
			"Beim Rollen sind Verformungen an Rad und Unterlage wichtig. In vielen Alltagssituationen ist der Rollwiderstand kleiner als die Gleitreibung bei vergleichbaren Bedingungen. Eine rollende Transportkiste lässt sich deshalb oft leichter bewegen als eine gleitende. Das ist eine qualitative Orientierung, kein allgemeines Zahlengesetz für alle Stoffe und Bedingungen. Oberflächenrauheit allein erklärt Reibung nicht vollständig.",
			"Beim Gehen verhindert Haftreibung, dass dein Fuß nach hinten rutscht. Beim Bremsen braucht ein Reifen ausreichenden Kontakt zur Straße. Nässe, Eis und Schmutz können diesen verschlechtern; passe dein Verhalten an. Das Modell ordnet typische Situationen, berechnet aber keine Bremswege und keine Reibungskoeffizienten. Die Kraftpfeile zeigen nur die Richtung, keinen gemessenen Betrag.",
		],
		takeaway:
			"Haften verhindert das Losgleiten; Gleiten betrifft rutschende Flächen. Rollen ist unter vergleichbaren Bedingungen oft leichter.",
		quiz: {
			question:
				"Welche Reibungsart hält einen ruhenden Schuh beim Abstoßen am Boden?",
			answer: "Haftreibung",
			wrong: ["Gleitreibung", "Ein fehlender Kontakt zum Boden"],
			explanation:
				"Solange der Schuh nicht über den Boden rutscht, handelt es sich um Haftreibung.",
		},
		workshop: classify(
			"Welche Kontaktbewegung liegt vor?",
			["Haften", "Gleiten", "Rollen"],
			[
				[
					"Ein Schuh steht rutschfrei auf dem Boden",
					0,
					"Die Kontaktflächen verschieben sich nicht.",
				],
				[
					"Ein Schlitten rutscht über Schnee",
					1,
					"Die Kufen gleiten relativ zur Unterlage.",
				],
				[
					"Ein Koffer bewegt sich auf Rädern",
					2,
					"Die Räder rollen; Verformung trägt zum Widerstand bei.",
				],
				[
					"Eine Kiste bewegt sich trotz kleinem Zug noch nicht",
					0,
					"Haftreibung kann den Zug ausgleichen.",
				],
			],
			"Beurteile die Bewegung der Kontaktflächen, nicht nur die des ganzen Körpers.",
		),
		tasks: {
			1: task(
				"Du ziehst eine Kiste zunächst schwach, dann stärker. Erst bleibt sie stehen, dann rutscht sie. Erkläre beide Phasen ohne eine Formel.",
				"Zuerst gleicht Haftreibung den Zug aus, die Kiste bleibt in Ruhe. Die Haftreibung kann nur bis zu einem Höchstwert anwachsen. Wird dieser überschritten, beginnt die Kiste zu gleiten; dann wirkt Gleitreibung der relativen Bewegung entgegen.",
				[
					"Haftreibung nicht als konstant behauptet",
					"Grenze des Haftens erklärt",
					"Gleitreibung richtig zugeordnet",
				],
				[
					"Rutschen die Kontaktflächen schon?",
					"Kann die Haftreibung beliebig zunehmen?",
				],
			),
			2: task(
				"Bei Nässe will jemand ebenso schnell durch eine enge Fahrradkurve fahren wie auf trockener Straße. Begründe eine vernünftige Entscheidung mit dem Kontakt zwischen Reifen und Straße.",
				"In der Kurve muss der Reifenkontakt die Fahrtrichtung ändern. Nässe kann die übertragbare Haftreibung verringern. Ich fahre vor der Kurve langsamer, halte Abstand und vermeide abruptes Lenken oder Bremsen. Aus dem Modell kann ich keinen sicheren Zahlenwert für die Geschwindigkeit ablesen.",
				[
					"Haftkontakt zur Richtungsänderung erklärt",
					"Nässe berücksichtigt",
					"Vorsicht ohne erfundene Grenzgeschwindigkeit",
				],
				[
					"Was passiert beim Wegrutschen?",
					"Was sagt das qualitative Modell nicht?",
				],
			),
		},
	}),
	lesson(1, {
		id: "me-volumen",
		title: "Volumen messen und Einheiten verbinden",
		illustration: "density",
		calculation: "volume",
		intro:
			"Wie viel Raum nimmt ein Körper ein? Nutze geometrische Maße oder Wasserverdrängung.",
		paragraphs: [
			"Das Volumen beschreibt den Rauminhalt eines Körpers. Für einen Quader gilt Länge · Breite · Höhe. Bei 4 cm · 3 cm · 2 cm erhältst du 24 cm³. Die Einheiten müssen vor dem Multiplizieren zusammenpassen. Ein Kubikzentimeter ist ein Würfel mit 1 cm Kantenlänge; ein Kubikdezimeter enthält 1 000 solcher Würfel.",
			"Es gilt: 1 l = 1 dm³ = 1 000 cm³ und 1 ml = 1 cm³. Ein kleiner unregelmäßiger Körper lässt sich durch Wasserverdrängung messen, wenn er wasserfest ist und vollständig untertaucht. Steigt der Wasserstand im Messzylinder von 50 ml auf 68 ml, beträgt sein Volumen 18 cm³. Die Endanzeige allein enthält auch das vorherige Wasser.",
			"Lies die Skala auf Augenhöhe ab; bei Wasser nutzt du den unteren Rand des Meniskus. Vermeide Luftblasen und Spritzer. Schwimmende, poröse oder wasserlösliche Körper brauchen eine andere Methode oder eine besprochene Korrektur. Das Dichtemodell zeigt hier Volumen und Masse eines homogenen Körpers, keinen echten Messzylinder.",
		],
		takeaway:
			"Volumen durch Geometrie oder Verdrängung bestimmen. 1 ml = 1 cm³; 1 l = 1 000 cm³.",
		quiz: {
			question:
				"Wasser steigt beim vollständigen Eintauchen von 40 ml auf 55 ml. Welches Volumen hat der Körper?",
			answer: "15 cm³",
			wrong: ["55 cm³", "95 cm³"],
			explanation:
				"Nur die Zunahme gehört zum Körper: 55 ml − 40 ml = 15 ml = 15 cm³.",
		},
		workshop: sequence(
			"Volumen durch Verdrängung",
			[
				[
					"Anfangsvolumen auf Augenhöhe ablesen",
					"Die erste Anzeige gehört zum Wasser.",
				],
				[
					"Geeigneten Körper vollständig und ohne Luftblasen eintauchen",
					"Nur das vollständig verdrängte Wasser entspricht dem Körpervolumen.",
				],
				[
					"Endvolumen ablesen",
					"Die zweite Anzeige enthält Wasser und Verdrängung.",
				],
				[
					"Anfangswert abziehen und Einheit angeben",
					"Die Differenz in ml entspricht dem Volumen in cm³.",
				],
			],
			"Prüfe vor dem Versuch, ob Wasser und Körper geeignet sind.",
		),
		tasks: {
			1: task(
				"Ein wasserfester Stein erhöht den Wasserstand von 35 ml auf 52 ml. Beschreibe die Auswertung und zwei Bedingungen für ein brauchbares Ergebnis.",
				"Das Steinvolumen ist 52 ml − 35 ml = 17 ml, also 17 cm³. Der Stein muss vollständig untergetaucht sein; Luftblasen dürfen das Ergebnis nicht vergrößern. Ich lese beide Wasserstände auf Augenhöhe ab und vermeide Wasserverlust.",
				[
					"17 cm³ berechnet",
					"Vollständiges Eintauchen genannt",
					"Messfehler berücksichtigt",
				],
				["Welche Differenz suchst du?", "Was verdrängt zusätzlich Wasser?"],
			),
			2: task(
				"Ein Stück Zucker soll durch Eintauchen in Wasser vermessen werden. Begründe, warum das problematisch ist, und schlage eine passendere Messmethode vor.",
				"Zucker löst sich in Wasser, sodass die Methode den unveränderten Körper nicht zuverlässig erfasst. Bei einem quaderförmigen Stück messe ich Länge, Breite und Höhe und berechne ihr Produkt in derselben Längeneinheit. Unregelmäßige Formen brauchen eine geeignete andere Methode.",
				[
					"Löslichkeit als Problem",
					"Passende Alternative",
					"Einheiten oder Formgrenze beachtet",
				],
				[
					"Bleibt der Körper unverändert?",
					"Welche Form kannst du geometrisch berechnen?",
				],
			),
		},
	}),
	lesson(1, {
		id: "me-dichte",
		title: "Dichte: Masse und Volumen zusammen betrachten",
		illustration: "density",
		model: "density",
		calculation: "density",
		intro:
			"Ein großer Körper muss nicht aus einem dichteren Stoff bestehen. Vergleiche Masse je Volumen.",
		paragraphs: [
			"Die Dichte ρ ist die Masse je Volumen eines homogenen Stoffes: ρ = m / V. Bei gleicher Temperatur und gleichem Druck ist sie eine kennzeichnende Stoffgröße. Ein Körper mit 54 g Masse und 20 cm³ Volumen hat die Dichte 2,7 g/cm³. Ein zweites, doppelt so großes Stück desselben Stoffs hat doppelte Masse, aber dieselbe Dichte.",
			"Du kannst umstellen: m = ρ · V und V = m / ρ. Bei 2,7 g/cm³ und 10 cm³ ergibt sich 27 g. Achte auf zusammenpassende Einheiten: 1 g/cm³ entspricht 1 000 kg/m³. Bestimme zur Stoffsuche Masse und Volumen unabhängig und vergleiche die berechnete Dichte mit geeigneten Tabellenwerten. Eine ähnliche Dichte allein beweist noch keine eindeutige Stoffidentität.",
			"Bei Hohlkörpern gehört eingeschlossene Luft zum äußeren Volumen. Masse durch Außenvolumen liefert dann eine mittlere Dichte des ganzen Körpers und nicht sicher die Dichte des Wandmaterials. Das Modell nimmt einen homogenen Körper an. Die frei einstellbaren Dichten sind Vergleichswerte, keine Materialtabelle.",
		],
		takeaway:
			"Dichte = Masse / Volumen. Bei gleichem Stoff wachsen Masse und Volumen im selben Verhältnis.",
		quiz: {
			question:
				"Du halbierst einen homogenen Körper. Was geschieht mit seiner Dichte?",
			answer: "Sie bleibt bei gleichen Bedingungen gleich.",
			wrong: ["Sie halbiert sich wie die Masse.", "Sie verdoppelt sich immer."],
			explanation:
				"Masse und Volumen halbieren sich gemeinsam. Ihr Quotient bleibt gleich.",
		},
		workshop: classify(
			"Was ändert sich?",
			["Dichte gleich", "Dichte größer", "Keine sichere Stoffdichte"],
			[
				[
					"Doppelte Masse und doppeltes Volumen desselben Stoffs",
					0,
					"Der Quotient bleibt gleich.",
				],
				[
					"Gleiche Masse in halb so viel Volumen",
					1,
					"Masse je Volumen wird doppelt so groß.",
				],
				[
					"Hohle Metallkugel: Masse durch Außenvolumen",
					2,
					"Die Luft im Hohlraum verfälscht die Zuordnung zum Metall.",
				],
				[
					"Kleineres Stück aus demselben homogenen Material",
					0,
					"Die Stoffdichte hängt nicht von der Stückgröße ab.",
				],
			],
			"Vergleiche den Quotienten und prüfe die Modellannahme „homogen“.",
		),
		tasks: {
			1: task(
				"Zwei Proben haben 30 g bei 10 cm³ und 60 g bei 20 cm³. Vergleiche die Dichten und erkläre, was du daraus über den Stoff sagen kannst.",
				"Beide Quotienten ergeben 3 g/cm³. Die größere Masse der zweiten Probe beruht auf ihrem größeren Volumen. Gleiche Dichten sind mit demselben Stoff vereinbar, beweisen seine Identität allein aber nicht; Bedingungen und weitere Eigenschaften müssen passen.",
				[
					"Beide Dichten korrekt",
					"Größe von Dichte getrennt",
					"Stoffzuordnung eingeschränkt",
				],
				[
					"Was ist m / V?",
					"Können verschiedene Stoffe ähnliche Dichten haben?",
				],
			),
			2: task(
				"Eine hohle Metallkugel hat außen 50 cm³ Volumen und 100 g Masse. Eine Tabelle nennt für das Metall 8 g/cm³. Ist das ein Widerspruch? Begründe.",
				"100 g / 50 cm³ ergibt 2 g/cm³ als mittlere Dichte der ganzen Kugel einschließlich Hohlraum. Die Tabelle beschreibt das homogene Metall ohne eingeschlossene Luft. Deshalb widersprechen sich die Angaben nicht; zur Materialdichte brauche ich das Volumen des Metalls.",
				[
					"Mittlere Dichte 2 g/cm³",
					"Hohlraum berücksichtigt",
					"Tabellenbezug richtig erklärt",
				],
				["Welches Volumen wurde gemessen?", "Worauf bezieht sich die Tabelle?"],
			),
		},
	}),
];
