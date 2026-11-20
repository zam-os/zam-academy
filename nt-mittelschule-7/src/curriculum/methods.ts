import { inspection } from "../lab/definitions";
import { makeStage } from "./helpers";

export const METHODS = makeStage(
	{
		id: "methoden",
		stageNumber: 1,
		title: "Forschen und sicher arbeiten",
		subtitle:
			"Vermutungen testen, Informationen vergleichen und Gefahren erkennen",
		icon: "🔎",
		accent: "#087c78",
		badgeTitle: "Forschen und sicher arbeiten",
		lehrplanLabel: "NT7 · Lernbereich 1",
	},
	"LB 1",
	1,
	[
		{
			id: "forschen",
			title: "Vom Verdacht zur Folgerung",
			subtitle: "Prüfe eine Vermutung mit einem fairen Vergleich.",
			text: [
				"Aus einer Frage formulierst du eine prüfbare Vermutung, die Hypothese. Plane zwei vergleichbare Ansätze und ändere nur die Bedingung, die du untersuchst. Halte Frage, Vermutung, Aufbau, Beobachtung und Auswertung im Protokoll fest. Farben beschreibst du in Worten (qualitativ). Zeiten, Massen oder Längen gibst du mit Zahl und Einheit an (quantitativ).",
				"Rostet Eisen in feuchter Luft leichter? Zwei gleiche Nägel liegen gleich lang in Luft, einer trocken und einer feucht. „Auf dem feuchten Nagel ist eine rotbraune Schicht“ ist eine Beobachtung. „Feuchtigkeit begünstigt die Rostbildung“ ist eine Folgerung. Wiederholungen helfen, Zufälle zu erkennen.",
			],
			rule: "Ändere beim fairen Vergleich nur eine Bedingung. Trenne Beobachtung und Deutung.",
			quiz: [
				"Was ist eine Beobachtung?",
				"Auf dem Nagel ist eine rotbraune Schicht.",
				"Feuchtigkeit hat Rost verursacht.",
				"Der Versuch war überzeugend.",
				"Eine Beobachtung beschreibt, was du wahrnimmst oder misst.",
			],
			practice: [
				[
					[
						"Womit beginnt ein Protokoll sinnvoll?",
						"Mit Frage und Vermutung",
						"Mit der gewünschten Erklärung",
						"Mit einem Urteil über das Ergebnis",
						"Frage und Hypothese legen fest, was untersucht wird.",
					],
					[
						"Ein Nagel ist feucht und warm, der andere trocken und kalt. Kannst du allein die Wirkung des Wassers erkennen?",
						"Nein, Feuchtigkeit und Temperatur ändern sich.",
						"Ja, da beide Nägel aus Eisen sind.",
						"Ja, solange nur einer rostet.",
						"Bei zwei veränderten Bedingungen lässt sich der Einfluss nicht zuordnen.",
					],
				],
				[
					[
						"Welche Angabe ist quantitativ?",
						"Die Messung dauerte 20 s.",
						"Die Oberfläche ist rau.",
						"Die Oberfläche erscheint dunkler.",
						"Eine quantitative Angabe enthält einen Messwert, hier eine Zeit.",
					],
					[
						"Du misst Rostflächen nach 1, 2 und 3 Tagen. Wie zeigst du den Verlauf?",
						"Mit einem Diagramm: Zeit waagerecht, Rostfläche senkrecht.",
						"Mit einem Kreisdiagramm ohne Zeiten.",
						"Mit drei Zeichnungen ohne Maßstab oder Einheit.",
						"Ein Verlaufsdiagramm verbindet Messgröße und Zeit.",
					],
				],
				[
					[
						"Was bleibt beim Vergleich von Feuchtigkeit gleich?",
						"Material, Zugang zu Luft und Dauer",
						"Feuchtigkeit und Material",
						"Nur die Feuchtigkeit",
						"Gleich bleiben die Bedingungen, die du gerade nicht untersuchst.",
					],
					[
						"Zwei Wiederholungen zeigen verschiedene Ergebnisse. Wie gehst du vor?",
						"Halte beide fest und suche nach einem Unterschied im Aufbau.",
						"Streiche alle Werte, die der Vermutung widersprechen.",
						"Übernimm immer den größeren Wert.",
						"Unterschiede können auf eine weitere Einflussgröße oder einen Messfehler hinweisen.",
					],
				],
			],
			lab: inspection(
				"investigation",
				"Ein Rostversuch auf Papier",
				"Geh die Stationen durch. Prüfe, an welcher Stelle du etwas änderst, beobachtest oder erklärst.",
				[
					"Finde den Aufbau, der nur die Feuchtigkeit verändert.",
					"Finde eine Beschreibung, die du sehen könntest.",
					"Finde die Folgerung, die auf den Beobachtungen beruht.",
				],
			),
		},
		{
			id: "quellen",
			title: "Tabelle, Bild oder Behauptung?",
			subtitle:
				"Wähle eine Darstellung, mit der du deine Frage beantworten kannst.",
			text: [
				"Eine Tabelle liefert ablesbare Zahlen, ein Balkendiagramm macht Größenunterschiede sichtbar, ein Teilchenbild erklärt eine Vorstellung über den Aufbau. Frage zuerst, was du wissen willst. Prüfe dann, was die Quelle zeigt, welche Einheiten sie verwendet und wofür sie gemacht wurde. Trenne eine überprüfbare Beschreibung von einer Bewertung.",
				"Die Tabelle nennt für trockene Luft etwa 78 % Stickstoff. Aus einer Zeichnung mit zwei N₂-Molekülen und einem O₂-Molekül liest du das nicht ab, wenn die Zeichnung nur Teilchensorten zeigt. „Stickstoff hat den größten Anteil“ beschreibt die Daten. „Die Darstellung ist übersichtlich“ ist eine Bewertung.",
			],
			rule: "Lies Werte aus Quellen mit Skala oder Einheit. Nutze ein Modell für die Frage, die es zu beantworten hilft.",
			quiz: [
				"Wo liest du den genauen Volumenanteil ab?",
				"In einer Tabelle mit Prozentangaben",
				"Im Titel eines Posters ohne Zahlen",
				"In jeder Zeichnung eines Moleküls",
				"Eine Tabelle mit Einheiten gibt an, welche Größe die Werte beschreiben.",
			],
			practice: [
				[
					[
						"Welche Angabe beschreibt Daten?",
						"Der Balken für Stickstoff ist am längsten.",
						"Das Poster ist schön gestaltet.",
						"Die Tabelle ist am besten.",
						"Die Balkenlänge ist überprüfbar.",
					],
					[
						"Jemand schreibt: „Das Diagramm hat eine ordentliche Beschriftung, also sind alle Daten richtig.“ Was prüfst du?",
						"Die Datenquelle und die Beschriftung getrennt.",
						"Nur, ob das Diagramm bunt genug ist.",
						"Nur den größten Balken.",
						"Gute Gestaltung allein belegt nicht, woher die Daten kommen.",
					],
				],
				[
					[
						"Was zeigt ein nicht maßstäbliches Teilchenbild zuverlässig?",
						"Welche Teilchensorten dargestellt sind",
						"Die tatsächliche Größe jedes Atoms",
						"Den exakten Volumenanteil",
						"Ein schematisches Bild steht für ausgewählte Merkmale.",
					],
					[
						"Zwei Luftbilder benutzen unterschiedliche Farben für Sauerstoff. Was hilft beim Vergleich?",
						"Lies jeweils die Legende und vergleiche Formeln und Symbole.",
						"Halte Rot überall für Sauerstoff.",
						"Ordne nur nach der Größe der Kreise.",
						"Die Legende legt die Bedeutung der Zeichen fest.",
					],
				],
				[
					[
						"Welche Quelle macht 78 % und 21 % auf einen Blick vergleichbar?",
						"Ein beschriftetes Balkendiagramm",
						"Eine Wortliste",
						"Ein Foto einer Wolke",
						"Balken zeigen Mengenunterschiede durch ihre Länge.",
					],
					[
						"In Quelle A steht 21 Volumenprozent O₂, in Quelle B 23 Massenprozent. Ein Widerspruch?",
						"Nein, die Angaben beziehen sich auf unterschiedliche Größen.",
						"Ja, einer der Werte muss falsch sein.",
						"Ja, Prozente bedeuten immer Volumenanteile.",
						"Die Bezugsgröße entscheidet, was eine Prozentzahl bedeutet.",
					],
				],
			],
			lab: inspection(
				"evidence",
				"Dieselbe Luft in zwei Darstellungen",
				"Vergleiche die Darstellungen für die Frage nach dem häufigsten Gas.",
				[
					"Finde die Darstellung mit ablesbaren Anteilen.",
					"Finde das Modell für die verschiedenen Teilchensorten.",
					"Vergleiche eine Beschreibung mit einer Bewertung.",
				],
			),
		},
		{
			id: "sicherheit",
			title: "Chemie mit Schutz und Plan",
			subtitle:
				"Lies Gefahrensymbole und kläre vor dem Versuch den Umgang mit Geräten.",
			text: [
				"Gefahrensymbole geben Hinweise auf Risiken. Die Flamme weist auf entzündbare Stoffe hin. Bei dem Zeichen mit tropfender Flüssigkeit auf Hand und Metall musst du mit Ätzwirkung rechnen. Beachte Etikett, Sicherheitsunterweisung und die Schutzmaßnahmen der Lehrkraft. Im Labor isst und trinkst du nicht, trägst bei Bedarf Schutzbrille und meldest Zwischenfälle sofort.",
				"Vor dem Einsatz eines Gasbrenners zeigt dir die Lehrkraft den sicheren Umgang und prüft den Aufbau. Neben einem entzündbaren Stoff bleibt jede Zündquelle fern. Spritzer und beschädigte Geräte werden der Lehrkraft gemeldet.",
			],
			rule: "Erkenne zuerst die Gefahr. Wähle danach mit der Lehrkraft passende Schutzmaßnahmen.",
			quiz: [
				"Worauf weist die Flamme auf dem Gefahrenschild hin?",
				"Auf Entzündbarkeit",
				"Auf hohe Dichte",
				"Auf Ätzwirkung",
				"Das Flammensymbol macht auf das Risiko einer Entzündung aufmerksam.",
			],
			practice: [
				[
					[
						"Was bedeutet das Bild mit Tropfen auf Hand und Metall?",
						"Ätzwirkung möglich",
						"Der Stoff ist ein Edelgas.",
						"Der Stoff ist bei Raumtemperatur fest.",
						"Die Darstellung warnt insbesondere vor Verätzungen.",
					],
					[
						"In einem Versuch könnte ätzende Flüssigkeit spritzen. Welche Vorsorge passt?",
						"Die Lehrkraft klärt Schutzbrille und den sicheren Umgang.",
						"Die Gruppe verlässt sich auf eine kleine Stoffmenge.",
						"Die Lernenden prüfen die Flüssigkeit mit der Hand.",
						"Bereits kleine Spritzer können Augen und Haut schädigen.",
					],
				],
				[
					[
						"Wer weist dich vor der Arbeit am Gasbrenner ein?",
						"Die Lehrkraft",
						"Ein Mitschüler ohne Einweisung",
						"Ein Schild mit dem Namen des Geräts",
						"Die Lehrkraft kennt Gerät, Aufbau und notwendige Schutzmaßnahmen.",
					],
					[
						"Vor Beginn fällt dir ein beschädigtes Gerät auf. Was tust du?",
						"Lass es außer Betrieb und melde es der Lehrkraft.",
						"Verwende es nur kurz.",
						"Ersetze es eigenständig durch ein beliebiges anderes Gerät.",
						"Beschädigte Geräte können unvorhersehbare Gefahren schaffen.",
					],
				],
				[
					[
						"Wie schützt du dich bei einem entzündbaren Stoff vor einer Entzündung?",
						"Halte Zündquellen fern.",
						"Stelle eine offene Flamme daneben.",
						"Achte nur auf die Farbe des Etiketts.",
						"Eine Zündquelle kann die Entzündung auslösen.",
					],
					[
						"Ein Behälter im Schulversuch trägt kein lesbares Etikett. Was ist der nächste Schritt?",
						"Lass ihn stehen und frag bei der Lehrkraft nach.",
						"Bestimme den Inhalt durch Riechen.",
						"Benutze ihn, wenn die Flüssigkeit klar ist.",
						"Aussehen und Geruch reichen zur sicheren Bestimmung nicht aus.",
					],
				],
			],
			lab: inspection(
				"safety",
				"Vom Warnhinweis zur Schutzmaßnahme",
				"Untersuche die Fälle. Verbinde jede Gefahr mit einer passenden Vorkehrung.",
				[
					"Finde den Fall mit Brandgefahr durch Zündquellen.",
					"Finde den Fall, bei dem Spritzer Augen und Haut gefährden.",
					"Finde das Gerät, das eine Einweisung erfordert.",
				],
			),
		},
	],
);
