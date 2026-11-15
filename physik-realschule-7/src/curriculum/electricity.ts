import { classify, lesson, sequence, task } from "./helpers";

export const ELECTRICITY = [
	lesson(3, {
		id: "el-magnete",
		title: "Magnete, Pole und Elementarmagnete",
		illustration: "magnet",
		model: "magnet",
		intro:
			"Magnete ziehen nicht jedes Metall an. Untersuche Pole und die Grenzen des Elementarmagnetmodells.",
		paragraphs: [
			"Ein Magnet zieht insbesondere Eisen und viele eisenhaltige Werkstoffe sowie Nickel und Kobalt an. Kupfer und Aluminium zeigen bei einer einfachen Prüfung keine solche starke ferromagnetische Anziehung. Nicht jedes Metall ist also ein geeigneter Magnetstoff. An Nord- und Südpol ist die Wirkung eines Stabmagneten besonders deutlich. Gleichnamige Pole stoßen sich ab, ungleichnamige ziehen sich an.",
			"Im Elementarmagnetmodell stellst du dir ein ferromagnetisches Material aus vielen kleinen magnetischen Bereichen vor. Bei ungeordneten Richtungen heben sich ihre Wirkungen weitgehend auf; bei bevorzugt gleichgerichteten Bereichen wird das Stück nach außen magnetisch. Ein Magnet in der Nähe kann diese Ordnung fördern: magnetische Influenz. Ein Eisennagel wird so vorübergehend zum Magneten und kann weitere geeignete Nägel anziehen.",
			"Nach Entfernen des äußeren Magneten verliert weichmagnetisches Material seine Wirkung weitgehend, ein geeigneter Dauermagnet behält sie. Erwärmung oder starke Erschütterung können die Ordnung stören. Das Elementarmagnetmodell ist eine Vorstellung und zeigt keine sichtbaren Mini-Stabmagnete im Metall. Teilst du einen Magneten, erhältst du wieder Magnete mit beiden Polen, keinen einzelnen Nordpol.",
		],
		takeaway:
			"Gleichnamige Pole stoßen sich ab, ungleichnamige ziehen sich an. Ferromagnetismus lässt sich mit geordneten magnetischen Bereichen modellieren.",
		quiz: {
			question: "Was entsteht beim Teilen eines Stabmagneten?",
			answer: "Zwei kleinere Magnete mit jeweils Nord- und Südpol",
			wrong: [
				"Ein einzelner Nordpol und ein einzelner Südpol",
				"Zwei ausschließlich unmagnetische Stücke",
			],
			explanation: "Im Modell besitzt jedes Teilstück wieder beide Pole.",
		},
		workshop: classify(
			"Beobachtung und Erklärung",
			["Anziehung", "Abstoßung", "Kein starker ferromagnetischer Effekt"],
			[
				["Nordpol nahe Südpol", 0, "Ungleichnamige Pole ziehen sich an."],
				["Nordpol nahe Nordpol", 1, "Gleichnamige Pole stoßen sich ab."],
				[
					"Magnet nahe einem Kupferstück im einfachen Versuch",
					2,
					"Kupfer ist nicht ferromagnetisch.",
				],
				[
					"Magnet nahe einem geeigneten Eisennagel",
					0,
					"Magnetische Influenz kann Bereiche ausrichten.",
				],
			],
			"Anziehung allein zeigt nicht, welcher Pol eines unbekannten Magneten vorliegt.",
		),
		tasks: {
			1: task(
				"Ein Eisennagel hält neben einem Magneten eine Büroklammer fest. Nach dem Entfernen fällt sie ab. Erkläre das mit dem Elementarmagnetmodell.",
				"Der äußere Magnet richtet im Nagel magnetische Bereiche bevorzugt aus. Der Nagel wirkt dadurch vorübergehend selbst magnetisch und zieht die geeignete Büroklammer an. Nach dem Entfernen geht die Ordnung bei diesem Material weitgehend verloren; die Anziehung reicht nicht mehr aus.",
				[
					"Magnetische Influenz",
					"Modell der Ausrichtung",
					"Temporärer Magnetismus",
				],
				[
					"Was ändert sich im Modell?",
					"Bleibt die Ordnung ohne äußeren Magneten?",
				],
			),
			2: task(
				"Du sollst den Nordpol eines unbekannten Magneten finden. Warum reicht ein Eisennagel nicht, und wie hilft ein Magnet mit bekanntem Nordpol?",
				"Ein geeigneter Eisennagel wird von beiden Polen angezogen und unterscheidet sie deshalb nicht. Mit einem bekannten Nordpol suche ich die Abstoßung: Der abstoßende Pol des unbekannten Magneten ist ebenfalls ein Nordpol. Abstoßung ist hier die eindeutige Beobachtung.",
				[
					"Anziehung bei beiden Polen",
					"Bekannter Vergleichspol",
					"Abstoßung als Nachweis",
				],
				[
					"Was passiert am unmagnetisierten Eisen?",
					"Welche Polkombination stößt sich ab?",
				],
			),
		},
	}),
	lesson(3, {
		id: "el-magnetfeld",
		title: "Magnetfelder und der Kompass der Erde",
		illustration: "magnet",
		model: "magnet",
		intro:
			"Ein Feld beschreibt die magnetische Wirkung im Raum. Eine Kompassnadel zeigt seine Richtung.",
		paragraphs: [
			"Ein Magnet wirkt auch ohne Berührung. Das Magnetfeld beschreibt diese Wirkung im umgebenden Raum. Eine kleine frei drehbare Magnetnadel richtet sich entlang der lokalen Feldrichtung aus. Die Feldlinien zeigen die Richtung, in die ihr Nordpol weist. Außerhalb eines Magneten verlaufen sie vom Nordpol zum Südpol; im Magneten setzen sie sich zu geschlossenen Linien fort.",
			"Beim Stabmagneten verlaufen die Linien außen bogenförmig zwischen den Polen. Zwischen den gegenüberliegenden Flächen eines Hufeisenmagneten sind sie im mittleren Bereich näherungsweise parallel. Dicht gezeichnete Linien kennzeichnen eine größere Feldstärke in derselben Darstellung. Feldlinien kreuzen sich nicht; sie sind keine materiellen Fäden. Eisenfeilspäne machen eine Anordnung sichtbar, ihre Ausrichtung stört das Feld aber auch etwas.",
			"Die Erde hat ein Magnetfeld. Der nordsuchende Pol eines Kompasses weist ungefähr zum geografischen Norden, wo sich aus Sicht des einfachen Stabmagnetmodells eine magnetische Südpolregion befindet. Magnetische und geografische Richtung stimmen nicht überall genau überein. Ein naher Magnet oder Eisenkörper kann die Anzeige ablenken. Ein Kompass ist deshalb kein unfehlbarer Zeiger auf einen exakten geografischen Punkt.",
		],
		takeaway:
			"Die Feldrichtung zeigt die Richtung des Kompass-Nordpols. Außen verlaufen Feldlinien von N nach S und bilden insgesamt geschlossene Linien.",
		quiz: {
			question:
				"Warum weist der Nordpol der Kompassnadel ungefähr nach geografisch Norden?",
			answer:
				"Dort liegt im einfachen Erdmodell eine magnetische Südpolregion.",
			wrong: [
				"Gleichnamige Magnetpole ziehen sich besonders stark an.",
				"Die Nadel wird durch ihre Farbe nach Norden gezogen.",
			],
			explanation:
				"Der Nordpol der Nadel wird von einer magnetischen Südpolregion angezogen.",
		},
		workshop: classify(
			"Feldvorstellung prüfen",
			["Passend", "Verbessern"],
			[
				[
					"Feldlinien außen vom Nordpol zum Südpol",
					0,
					"Das ist die vereinbarte Feldrichtung.",
				],
				[
					"Zwei Feldlinien kreuzen sich an einem Ort",
					1,
					"Das würde zwei verschiedene lokale Feldrichtungen behaupten.",
				],
				[
					"Ein naher Magnet lenkt den Kompass ab",
					0,
					"Die Nadel folgt dem lokalen Gesamtfeld.",
				],
				[
					"Feldlinien sind echte Schnüre im Raum",
					1,
					"Sie sind ein Darstellungsmodell.",
				],
			],
			"Das Feldlinienbild zeigt Richtung und qualitative Stärke, keine sichtbaren Gegenstände.",
		),
		tasks: {
			1: task(
				"Zeichne ein Feldlinienbild eines Stabmagneten und füge an einer Stelle eine Kompassnadel hinzu. Beschrifte die Richtung außerhalb des Magneten.",
				"Außen zeichne ich bogenförmige Linien von N nach S mit Richtungspfeilen. Die Linien setzen sich innen zu geschlossenen Verläufen fort und kreuzen sich nicht. Die Kompassnadel liegt tangential zur Linie; ihr Nordpol zeigt in Pfeilrichtung.",
				[
					"Außenrichtung N nach S",
					"Geschlossene kreuzungsfreie Linien",
					"Kompass tangential",
				],
				[
					"Was bedeutet die Pfeilrichtung?",
					"Wie liegt die Nadel an einer gebogenen Linie?",
				],
			),
			2: task(
				"Ein Kompass auf einem Tisch zeigt plötzlich anders, sobald ein Lautsprecher danebensteht. Erkläre das und beschreibe eine einfache Kontrollprüfung.",
				"Der Lautsprecher enthält einen Magneten, dessen Feld das Erdmagnetfeld am Ort der Nadel verändert. Die Nadel richtet sich nach dem lokalen Gesamtfeld. Ich entferne den Lautsprecher und andere störende Gegenstände und vergleiche die Richtung an mehreren freien Stellen.",
				[
					"Zusätzliches Magnetfeld",
					"Lokales Feld als Ursache",
					"Kontrolle durch Abstand oder Ortswechsel",
				],
				[
					"Welche magnetischen Gegenstände liegen nahe?",
					"Was sollte bei größerem Abstand geschehen?",
				],
			),
		},
	}),
	lesson(3, {
		id: "el-stromkreis",
		title: "Vom Aufbau zum Schaltbild",
		illustration: "circuit",
		model: "circuit",
		intro:
			"Eine Lampe braucht eine geeignete Quelle und einen geschlossenen leitenden Weg.",
		paragraphs: [
			"Ein einfacher Stromkreis enthält eine geeignete Quelle, leitende Verbindungen und einen Verbraucher, etwa ein Lämpchen. Der Weg verbindet beide Anschlüsse der Quelle über den Verbraucher. Ein offener Schalter unterbricht diesen Weg. Ein einzelner Draht von der Quelle zur Lampe reicht nicht. Elektrischer Strom wird nicht im Lämpchen aufgebraucht; die Quelle überträgt Energie an den Verbraucher.",
			"Ein Schaltbild stellt die Verbindungen mit vereinbarten Symbolen dar, unabhängig von der räumlichen Form des Aufbaus. Ein Kreis mit Kreuz steht für eine Lampe, zwei unterschiedlich lange parallele Striche für eine Zelle. Ein offener Schalter hat eine sichtbare Lücke; ein Punkt kennzeichnet einen verbundenen Knoten. Zeichne Leitungen übersichtlich und prüfe, welche Anschlüsse tatsächlich verbunden sind.",
			"Beispiel Taschenlampe: Quelle, geschlossener Schalter und Lämpchen bilden einen durchgehenden Weg. Bei offenem Schalter bleibt das Lämpchen dunkel. Das Modell schaltet nur an oder aus und berechnet weder Stromstärke noch Spannung. Einen realen Aufbau stellst du nur unter Anleitung mit einer vorgesehenen schulischen Kleinspannungsquelle her; das digitale Modell ersetzt den Aufbau nicht.",
		],
		takeaway:
			"Ein Verbraucher braucht einen geschlossenen leitenden Stromweg zwischen beiden Anschlüssen einer geeigneten Quelle.",
		quiz: {
			question:
				"Warum bleibt eine Lampe bei offenem Schalter im einfachen Stromkreis dunkel?",
			answer: "Der leitende Stromweg ist unterbrochen.",
			wrong: [
				"Die Lampe hat alle Elektronen verbraucht.",
				"Ein offener Schalter liefert zusätzliche Energie.",
			],
			explanation:
				"Ohne geschlossenen leitenden Weg fließt in diesem einfachen Aufbau kein dauernder Strom durch die Lampe.",
		},
		workshop: sequence(
			"Einen einfachen Aufbau planen",
			[
				[
					"Aufgabe und geeignete Kleinspannungsquelle klären",
					"Der Aufbau beginnt mit der technischen Aufgabe und passenden Geräten.",
				],
				[
					"Schaltbild mit Quelle, Schalter und Lampe zeichnen",
					"Das Bild legt die Verbindungen eindeutig fest.",
				],
				[
					"Unter Anleitung bei offenem Schalter aufbauen und prüfen",
					"Vor dem Schließen wird der Aufbau kontrolliert.",
				],
				[
					"Schalter schließen und Beobachtung mit dem Plan vergleichen",
					"Ein funktionierender Aufbau wird anhand des Schaltbilds erklärt.",
				],
			],
			"Ein digitales Schaltbild bestätigt keine sichere Durchführung eines echten Versuchs.",
		),
		tasks: {
			1: task(
				"Zeichne einen Stromkreis für eine schaltbare Taschenlampe. Erkläre die Bedeutung von Quelle, Lampe, Leitungen und Schalter.",
				"Die Quelle liefert Energie. Die Lampe liegt mit den Leitungen und dem Schalter in einem geschlossenen Weg zwischen beiden Quellanschlüssen. Der geschlossene Schalter ermöglicht den Stromweg; der offene unterbricht ihn. Die Lampe wandelt übertragene Energie unter anderem in Licht um.",
				[
					"Beide Anschlüsse verbunden",
					"Verbraucher im Stromweg",
					"Schalterfunktion erklärt",
				],
				[
					"Kannst du den Weg vollständig verfolgen?",
					"Wo wird der Weg beim Öffnen unterbrochen?",
				],
			),
			2: task(
				"Ein Aufbau sieht anders aus als das Schaltbild, hat aber dieselben Anschlüsse verbunden. Kann er dieselbe Funktion haben? Beschreibe eine systematische Prüfung.",
				"Die räumliche Anordnung darf anders sein; entscheidend sind die Verbindungen. Ich verfolge beide Anschlüsse der Quelle, den Weg durch die Lampe und die Schalterstellung. Dann vergleiche ich jeden Knoten im Aufbau mit dem Schaltbild und prüfe den Aufbau unter Anleitung.",
				[
					"Anordnung von Verbindung getrennt",
					"Knoten und Wege verglichen",
					"Prüfung unter Anleitung",
				],
				[
					"Was bedeutet ein Knoten?",
					"Welcher Unterschied verändert tatsächlich den Stromweg?",
				],
			),
		},
	}),
	lesson(3, {
		id: "el-schaltungen",
		title: "Schaltungen für eine Aufgabe entwickeln",
		illustration: "circuit",
		model: "circuit",
		intro:
			"Sollen zwei Lämpchen gemeinsam oder unabhängig geschaltet werden? Entwickle die passenden Wege.",
		paragraphs: [
			"In einer Reihenschaltung liegen die Bauteile hintereinander in einem einzigen Stromweg. Ist dieser an einer Stelle unterbrochen, bleiben beide Lämpchen dunkel. Zwei Schalter in Reihe können eine UND-Bedingung bilden: Nur wenn A und B geschlossen sind, ist der Weg vollständig. Die logische Funktion beschreibt das Schalten, keine Helligkeitsrechnung.",
			"Bei einer Parallelschaltung teilt sich der Stromweg an Knoten in Zweige und vereinigt sich wieder. In jedem Zweig kann ein Lämpchen mit eigenem Schalter liegen. Beispiel Modell: A ist geschlossen, B offen. Im parallelen Aufbau leuchtet dann Lampe A, während B dunkel bleibt. Im Reihenaufbau sind bei denselben Schalterstellungen beide dunkel.",
			"Formuliere vor dem Zeichnen die Anforderung: gemeinsam einschalten, unabhängig schalten oder nur bei zwei erfüllten Bedingungen einschalten. Verfolge danach für jede Schalterkombination die geschlossenen Wege und notiere das Ergebnis in einer Zustandstabelle. Für eine echte Klingel- oder Beleuchtungsschaltung brauchst du geeignete Bauteile und einen begleiteten Aufbau; rechnerische Regeln für Widerstände gehören hier noch nicht dazu.",
		],
		takeaway:
			"Reihe: ein gemeinsamer Weg. Parallel: getrennte Zweige. Prüfe jede Schalterstellung an den tatsächlich geschlossenen Wegen.",
		quiz: {
			question:
				"Zwei Lämpchen sollen mit je einem Schalter unabhängig leuchten. Welche Anordnung passt?",
			answer: "Zwei parallele Zweige mit je Schalter und Lämpchen",
			wrong: [
				"Beide Schalter und Lämpchen in einem einzigen Reihenweg",
				"Ein unterbrochener Draht ohne zweiten Anschluss",
			],
			explanation:
				"Jeder Zweig kann einen eigenen geschlossenen Stromweg bilden.",
		},
		workshop: classify(
			"Welche Funktion brauchst du?",
			["Gemeinsamer Reihenweg", "Unabhängige parallele Zweige"],
			[
				[
					"Beide Schalter müssen geschlossen sein, sonst sind beide Lampen aus",
					0,
					"Jeder offene Reihenschalter unterbricht den gemeinsamen Weg.",
				],
				[
					"Lampe A soll trotz offenem Schalter B leuchten können",
					1,
					"A braucht einen eigenen geschlossenen Zweig.",
				],
				[
					"Eine Unterbrechung stoppt beide Verbraucher",
					0,
					"Es gibt nur einen Stromweg.",
				],
				[
					"Zwei Tischlampen einzeln schalten",
					1,
					"Die Schalter gehören jeweils in ihren eigenen Zweig.",
				],
			],
			"Eine passende Schaltung beginnt mit einer klaren technischen Anforderung.",
		),
		tasks: {
			1: task(
				"A ist geschlossen und B offen. Vergleiche die beiden Lämpchen im Reihen- und Parallelmodell. Begründe über die Stromwege.",
				"Im Reihenmodell unterbricht B den einzigen Weg, deshalb bleiben beide Lampen aus. Im Parallelmodell ist der A-Zweig vollständig geschlossen, daher leuchtet A. B bleibt dunkel, weil nur sein eigener Zweig unterbrochen ist.",
				["Reihe beide aus", "Parallel nur A an", "Wege als Begründung"],
				[
					"Wo liegt die Unterbrechung?",
					"Gibt es einen anderen vollständigen Weg?",
				],
			),
			2: task(
				"Eine Modellanlage soll nur dann starten, wenn zwei Freigabeschalter geschlossen sind. Entwickle ein Schaltbild mit Lämpchen als Startanzeige und prüfe alle vier Schalterkombinationen.",
				"Ich setze beide Freigabeschalter und das Lämpchen in einen gemeinsamen Reihenweg. Offen/offen, offen/geschlossen und geschlossen/offen unterbrechen ihn. Nur geschlossen/geschlossen lässt die Anzeige leuchten. Das Modell ist eine Logikübung und kein Bauplan für eine echte Maschinensicherung.",
				[
					"Schalter in Reihe",
					"Alle vier Zustände geprüft",
					"Modell von echter Sicherheitsanlage getrennt",
				],
				[
					"Welche Bedingung ist gefordert?",
					"Reicht ein geschlossener Schalter?",
				],
			),
		},
	}),
	lesson(3, {
		id: "el-leiter-schutz",
		title: "Leiter, Stromwirkungen und Schutz im Alltag",
		illustration: "circuit",
		model: "circuit",
		intro:
			"Aus Materialeigenschaften und Stromwirkungen leitest du Regeln für einen verantwortlichen Umgang ab.",
		paragraphs: [
			"Leiter wie Kupfer ermöglichen unter üblichen Bedingungen elektrischen Strom. Kunststoffe oder trockenes Glas wirken in einfachen Niederspannungsversuchen als Isolatoren. Die Einteilung hängt von Material und Bedingungen ab: Wasser mit gelösten Stoffen und ein feuchter Körper können leiten. Ein Kunststoffmantel isoliert eine Leitung, macht beschädigte Geräte aber nicht automatisch sicher.",
			"Elektrischer Strom kann Wärme, Licht, magnetische Wirkungen und chemische Veränderungen verursachen. Ein Heizdraht nutzt die Wärmewirkung, eine Spule im Elektromagneten die magnetische Wirkung. Im menschlichen Körper kann Strom Nerven und Muskeln beeinflussen, Verbrennungen verursachen und lebenswichtige Funktionen stören. Eine Wirkung ist im Gerät nützlich und beim falschen Kontakt gefährlich.",
			"Benutze nur unbeschädigte Geräte, halte Netzgeräte von Wasser fern und fasse keine blanken Leiter an. Öffne keine Geräte am Stromnetz. Eine direkte leitende Verbindung zwischen den Quellanschlüssen ohne vorgesehenen Verbraucher ist ein Kurzschluss; sie kann Leitungen und Quellen stark erwärmen. Sicherungen begrenzen gefährliche Überströme; ein Fehlerstromschutzschalter kann bestimmte Fehlerströme erkennen. Keines dieser Mittel erlaubt riskantes Ausprobieren. Melde Schäden einer erwachsenen verantwortlichen Person; eigene Versuche nur mit vorgesehenen schulischen Geräten unter Anleitung.",
		],
		takeaway:
			"Prüfe Material und Bedingungen. Stromwirkungen begründen den Nutzen und die Schutzregeln; beschädigte Netzgeräte nicht weiter benutzen.",
		quiz: {
			question:
				"Was ist bei einer beschädigten Netzleitung die passende Handlung?",
			answer:
				"Nicht weiter benutzen und eine verantwortliche erwachsene Person informieren.",
			wrong: [
				"Die blanke Stelle kurz mit der Hand testen.",
				"Weiterbenutzen, solange die Lampe noch leuchtet.",
			],
			explanation:
				"Funktionieren ist kein Sicherheitsnachweis. An blanken Leitern oder am geöffneten Netzgerät wird nicht experimentiert.",
		},
		workshop: classify(
			"Wirkung und Anwendung",
			[
				"Wärmewirkung",
				"Magnetische Wirkung",
				"Chemische Wirkung",
				"Schutzregel",
			],
			[
				[
					"Ein geeigneter Heizdraht wird warm",
					0,
					"Die Wärme ist hier die beabsichtigte Wirkung.",
				],
				[
					"Eine stromdurchflossene Spule zieht einen geeigneten Eisenkern an",
					1,
					"Der Strom erzeugt ein Magnetfeld.",
				],
				[
					"Stoffveränderung beim angeleiteten Elektrolyseversuch",
					2,
					"Die chemische Veränderung ist eine Stromwirkung.",
				],
				[
					"Beschädigte Geräte nicht weiter benutzen",
					3,
					"Ein Defekt kann gefährliche Berührungen ermöglichen.",
				],
			],
			"Eine Schutzeinrichtung verhindert nicht jede gefährliche Situation.",
		),
		tasks: {
			1: task(
				"Erkläre, warum ein Kabel einen Kupferkern und einen Kunststoffmantel besitzt. Leite daraus eine Regel für einen beschädigten Mantel ab.",
				"Kupfer leitet den Strom im vorgesehenen Weg, der Kunststoffmantel isoliert ihn nach außen. Bei beschädigter Isolation können Leiter berührbar sein oder unerwünschte Verbindungen entstehen. Ich benutze das Netzgerät nicht weiter und informiere eine verantwortliche erwachsene Person.",
				[
					"Leiter und Isolator erklärt",
					"Schadensfolge begründet",
					"Passende Handlung",
				],
				[
					"Welche Aufgabe haben Kern und Mantel?",
					"Beweist Funktionieren die Sicherheit?",
				],
			),
			2: task(
				"Jemand will eine Quelle direkt mit einem Draht verbinden, um zu prüfen, ob sie funktioniert. Erkläre das Problem und formuliere eine sichere Alternative für den Unterricht.",
				"Die direkte Verbindung ohne vorgesehenen Verbraucher ist ein Kurzschluss. Es kann ein großer Strom fließen und Draht oder Quelle stark erwärmen. Stattdessen wird unter Anleitung eine dafür vorgesehene schulische Kleinspannungsquelle mit einem passenden Verbraucher und geprüftem Schaltbild verwendet. Am Stromnetz findet kein solcher Versuch statt.",
				[
					"Kurzschluss erkannt",
					"Wärmegefahr begründet",
					"Geeigneter begleiteter Aufbau",
				],
				[
					"Wo ist der Verbraucher?",
					"Was begrenzt im vorgesehenen Aufbau den Strom?",
				],
			),
		},
	}),
];
