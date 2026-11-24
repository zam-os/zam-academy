import { type ConceptFigure, threeColumns } from "./draw";

export const STAGE7_8_FIGURES: Record<string, ConceptFigure> = {
	"l6-europa-theseus": {
		title: "Europa und Theseus auf Kreta",
		question: "Wie verknüpfen diese beiden Sagen Phönizien, Athen und das Meer um Kreta?",
		alt: "Dreiteiliges Schaubild zur Entführung Europas nach Kreta, Theseus' Kampf gegen den Minotaurus mit dem Ariadnefaden und der Tragik des Ägeus.",
		caption: "Unsere Begriffe 'Europa', 'Ariadnefaden' und 'Ägäisches Meer' stammen aus diesen Mythen.",
		parts: [
			{
				label: "Europa & der weiße Stier",
				note: "Iuppiter trägt die Königstochter als sanfter weißer Stier übers Meer nach Kreta → Name Europa.",
			},
			{
				label: "Theseus & Ariadnefaden",
				note: "Mit Schwert und Wollknäuel der Ariadne besiegt Theseus den Minotaurus im Labyrinth.",
			},
			{
				label: "Das schwarze Segel",
				note: "Weil Theseus das weiße Siegessegel vergisst, stürzt sich sein Vater Ägeus ins Ägäische Meer.",
			},
		],
		draw: () =>
			threeColumns(
				"Kreta-Mythen und ihre Spuren auf der Landkarte",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Europa (Phönizien)",
						lines: ["Iuppiter als weißer Stier", "Ritt über das Meer", "Ankunft auf Kreta", "→ Name des Erdteils"],
						footer: "Kontinentname",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Labyrinth & Ariadne",
						lines: ["Minotaurus (Kreta)", "Baumeister: Daedalus", "Ariadnefaden (Ausweg)", "Theseus siegt mutig"],
						footer: "Klugheit rettet",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "Heimfahrt & Ägeus",
						lines: ["schwarzes Trauersegel", "vergessenes weißes Segel", "Sturz des Vaters Ägeus", "→ Ägäisches Meer"],
						footer: "tragisches Ende",
					},
				],
				true,
			),
	},
	"l6-daedalus-ikarus": {
		title: "Daedalus und Ikarus: Maßhalten zwischen Meer und Sonne",
		question: "Warum gelingt Daedalus der Flug über das Meer, während Ikarus abstürzt?",
		alt: "Dreiteiliges Schaubild zum Flügelbau auf Kreta, Daedalus' Warnung ('Inter utrumque volā!') und Ikarus' Absturz durch geschmolzenes Wachs.",
		caption: "Erfindergeist (Daedalus) verlangt Besonnenheit; Maßlosigkeit (Hybris) zerstört den Erfolg.",
		parts: [
			{
				label: "Erfindung auf Kreta",
				note: "Flügel aus Federn (pennae), Leinen (līnum) und Bienenwachs (cēra) zur Flucht vor König Minos.",
			},
			{
				label: "Die goldene Mitte",
				note: "Daedalus warnt (Ovid, Met. 8): 'Inter utrumque volā!' – weder zu tief (Wasser) noch zu hoch (Sonne).",
			},
			{
				label: "Hybris und Sturz",
				note: "Ikarus fliegt übermütig der Sonne entgegen; das Wachs schmilzt und er fällt ins Ikarische Meer.",
			},
		],
		draw: () =>
			threeColumns(
				"Flügel aus Wachs und die Warnung vor Übermut",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Bau der Flügel",
						lines: ["Haft auf Kreta (Minos)", "Vogelfedern nach Größe", "Fäden in der Mitte", "Bienenwachs (cēra) hält"],
						footer: "menschliche Technik",
					},
					{
						badge: "2",
						fill: "v-green-fill",
						heading: "Warnung des Vaters",
						lines: ["'Inter utrumque volā!'", "tief → Wasser beschwert", "hoch → Sonne schmilzt", "goldene Mitte halten"],
						footer: "Maß & Vorsicht",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "Übermut & Absturz",
						lines: ["Ikarus steigt zu hoch", "Hybris im Höhenrausch", "cēra schmilzt sofort", "Sturz ins Meer"],
						footer: "Grenzen achten!",
					},
				],
				true,
			),
	},
	"l6-orpheus-eurydike-unterwelt": {
		title: "Orpheus und Eurydike im Reich der Schatten",
		question: "Wie weit reicht die Macht der Musik im Orcus – und woran scheitert die Rückkehr?",
		alt: "Dreiteiliges Schaubild zu Verlust durch Schlangenbiss, Gesang vor Plūtō und Prōserpina sowie dem verhängnisvollen Rückblick vor dem Ausgang.",
		caption: "Orpheus rührt die Unterweltsgötter, doch das göttliche Verbot bleibt unerbittlich.",
		parts: [
			{
				label: "Verlust & Abstieg",
				note: "Eurydike stirbt am Schlangenbiss; der Sänger Orpheus steigt lebendig in den Orcus hinab.",
			},
			{
				label: "Gesang vor Plūtō",
				note: "Seine Leier bewegt selbst Plūtō und Prōserpina zur Freigabe unter einer einzigen Bedingung.",
			},
			{
				label: "Verbotener Rückblick",
				note: "Blickverbot (Met. 10,51: ne flectat retro sua lumina) – dicht vor dem Licht wendet Orpheus den Blick und verliert sie.",
			},
		],
		draw: () =>
			threeColumns(
				"Kunst, Vertrauen und die Grenze des Todes",
				[
					{
						badge: "1",
						fill: "v-purple-fill",
						heading: "Abstieg ins Schattenreich",
						lines: ["Schlangenbiss tötet", "Eurydike kurz nach Ehe", "Orpheus geht hinab", "in den Orcus / Styx"],
						footer: "Mut aus Trauer",
					},
					{
						badge: "2",
						fill: "v-gold-fill",
						heading: "Gesang vor dem Thron",
						lines: ["Leier (lyra) + Klage", "Plūtō & Prōserpina gerührt", "Bedingung (Met. 10,51):", "Augen nicht zurückwenden"],
						footer: "Göttergebot prüfen",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "Der eine Blick zurück",
						lines: ["kurz vor dem Sonnenlicht", "Sorge siegt über Vertrauen", "Orpheus dreht sich um", "zweiter, ewiger Verlust"],
						footer: "Tod bleibt endgültig",
					},
				],
				true,
			),
	},
	"l6-trojanischer-krieg": {
		title: "Vom Paris-Urteil bis zum Fall Trojas",
		question: "Warum entfachte ein goldener Apfel einen zehnjährigen Krieg, den erst eine List entschied?",
		alt: "Dreiteiliges Schaubild zum Paris-Urteil (Iūnō, Minerva, Venus), den Kämpfen zwischen Achilles und Hektor sowie der List mit dem Trojanischen Pferd.",
		caption: "Wo zehnjährige Belagerung scheiterte, bezwang das hölzerne Pferd des Odysseus die Stadt.",
		parts: [
			{
				label: "Streit & Paris-Urteil",
				note: "Eris' Apfel entzweit Iūnō, Minerva und Venus; Paris wählt Venus und erhält Helena von Sparta.",
			},
			{
				label: "Zehn Jahre Krieg (Ilias & Sagenkreis)",
				note: "Homers Ilias erzählt den Zweikampf Achilles vs. Hektor; spätere Epen berichten den Pfeil in die Achillesferse.",
			},
			{
				label: "Das Trojanische Pferd",
				note: "Odysseus (Ulixēs) versteckt Krieger im Holzpferd; Troja missachtet Laokoons Warnung und fällt.",
			},
		],
		draw: () =>
			threeColumns(
				"Der Trojanische Sagenkreis im Überblick",
				[
					{
						badge: "1",
						fill: "v-gold-fill",
						heading: "Paris-Urteil",
						lines: ["Eris-Apfel ('Schönste')", "Iūnō vs. Minerva vs. Venus", "Paris wählt Venus", "Entführung Helenas"],
						footer: "Götter & Menschen",
					},
					{
						badge: "2",
						fill: "v-coral-fill",
						heading: "Kampf vor Troja",
						lines: ["10 Jahre Belagerung", "Ilias: Achilles vs. Hektor", "späteres Epos:", "Pfeil in die Ferse"],
						footer: "Ilias & Sagenkreis",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "List des Ulixēs",
						lines: ["Hölzernes Pferd am Tor", "Warnung des Laokoon:", "'Timeō Danaōs ...'", "Einnahme durch List"],
						footer: "Verstand vor Gewalt",
					},
				],
				true,
			),
	},
	"l6-irrfahrten-odysseus": {
		title: "Die Irrfahrten des Odysseus (Ulixēs)",
		question: "Wie bezwang Odysseus übermächtige Gefahren zwischen Troja und Ithaka?",
		alt: "Dreiteiliges Schaubild zu Polyphem ('Nēmō'), Kirke und den Sirenen (Wachs & Mast) sowie der Heimkehr zu Penelope auf Ithaka.",
		caption: "Geduld, List ('Nēmō') und Selbstkontrolle führten Odysseus nach zwanzig Jahren heim.",
		parts: [
			{
				label: "Polyphem ('Nēmō'-List)",
				note: "Deckname 'Niemand' verhindert Hilfe der anderen Kyklopen; Flucht unter den Bäuchen der Schafe.",
			},
			{
				label: "Kirke & die Sirenen",
				note: "Befreiung der verwandelten Gefährten; bei den Sirenen schützt Wachs die Crew und ein Seil Odysseus.",
			},
			{
				label: "Heimkehr nach Ithaka",
				note: "Nach insgesamt 20 Jahren überwindet Ulixēs im Bettlergewand die Freier an Penelopes Bogenprobe.",
			},
		],
		draw: () =>
			threeColumns(
				"Zehn Jahre Heimfahrt durch das Mittelmeer",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Kyklop Polyphem",
						lines: ["Fels blockiert die Höhle", "Name: 'Nēmō' (Niemand)", "Wein + Blendung", "Flucht unter Schafen"],
						footer: "Geistesgegenwart",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "Kirke & Sirenen",
						lines: ["Schutz vor Zaubertrank", "Wachs (cēra) in die Ohren", "selbst an den Mast", "Verlockung widerstehen"],
						footer: "Selbstkontrolle",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "Rückkehr nach Ithaka",
						lines: ["20 Jahre von daheim weg", "kluge Frau Penelope", "Prüfung am Königsbogen", "Sieg über die Freier"],
						footer: "Homers Odyssee",
					},
				],
				true,
			),
	},
	"l6-ovid-bild-text-vergleich": {
		title: "Ovid als Mythenquelle und Bild-Text-Vergleich",
		question: "Wie unterscheidet sich ein erzählender Ovid-Text von einer antiken Vase oder einem Fresko?",
		alt: "Dreiteiliges Schaubild zu Ovids Metamorphosen, den Bildmitteln der Malerei (Moment & Attribute) und dem kriteriengeleiteten Bild-Text-Vergleich.",
		caption: "Texte führen durch die Zeit; Bilder verdichten den Höhepunkt mithilfe klarer Attribute.",
		parts: [
			{
				label: "Quelle: Ovid (Metamorphosen)",
				note: "Über 200 Verwandlungsmythen in lebendigen Versen (Europa, Daedalus/Ikarus, Orpheus).",
			},
			{
				label: "Sprache des Bildes",
				note: "Einzelner prägnanter Augenblick plus feste Attribute (Leier, Flügel, Stier, Fadenknäuel).",
			},
			{
				label: "Vergleich Text ↔ Bild",
				note: "Was lässt sich auf dem Bild sofort erkennen, und was steuern Gedanken/Reden im Text bei?",
			},
		],
		draw: () =>
			threeColumns(
				"Ovids Dichtung neben Fresko, Relief und Vase",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Textquelle (Ovid)",
						lines: ["Metamorphōsēs", "(Verwandlungssagen)", "Ablauf durch die Zeit", "Gedanken & direkte Rede"],
						footer: "poetische Deutung",
					},
					{
						badge: "2",
						fill: "v-coral-fill",
						heading: "Bildsprache (Kunst)",
						lines: ["einziger Höhepunkt", "erkennbare Attribute:", "Leier · Flügel · Stier", "Körpersprache & Blicke"],
						footer: "verdichteter Moment",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Vergleich (3 Fragen)",
						lines: ["1. Welche Figur / Szene?", "2. Was stimmt überein?", "3. Was betont das Bild", "oder lässt es weg?"],
						footer: "genau belegen",
					},
				],
				false,
			),
	},
	"l6-satzanalyse-pc-nebensaetze": {
		title: "Komplexe Sätze knacken: PC-Klammern und Nebensätze",
		question: "Wie behältst du in langen lateinischen Perioden sofort den Überblick?",
		alt: "Dreiteiliges Schaubild zum Einrücken von Nebensätzen, dem Sichern des Hauptsatzes und dem Einklammern von PC-Blöcken nach KNG.",
		caption: "Erst das Baugerüst zeichnen (Nebensatz, Hauptsatz, [PC]), erst danach übersetzen!",
		parts: [
			{
				label: "1. Nebensätze abgrenzen",
				note: "Subjunktion (ut, nē, cum, quod) markieren und Block bis zu seinem konjugierten Verb einrücken.",
			},
			{
				label: "2. Hauptsatz-Gerüst",
				note: "Das verbleibende Hauptprädikat (Ende!) und Subjekt zuerst isolieren.",
			},
			{
				label: "3. [PC]- & AcI-Klammern",
				note: "Bezugswort und Partizip nach KNG verbinden; Leitfragen klären Personen- und Zeitverlauf.",
			},
		],
		draw: () =>
			threeColumns(
				"Baukasten-Analyse vor dem Übersetzen",
				[
					{
						badge: "1",
						fill: "v-purple-fill",
						heading: "Nebensätze einrücken",
						lines: ["cum · ut · nē · quod · sī", "Anfang: Subjunktion", "Ende: finites Verb!", "(Modus: Ind. / Konj.)"],
						footer: "Schachtelung lösen",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Hauptsatz sichern",
						lines: ["Hauptprädikat suchen", "(Aktiv oder Passiv?)", "Subjekt im Nominativ", "Grundaussage steht"],
						footer: "roter Faden",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "[PC] & AcI klammern",
						lines: ["[Nomen ... Partizip]", "über KNG verbinden!", "Leitfragen am Text:", "Wer? Warum? Wann?"],
						footer: "Sinnzusammenhang",
					},
				],
				true,
			),
	},
	"l6-uebersetzungstechniken": {
		title: "Übersetzungstechniken im Vergleich",
		question: "Wann hilft dir die Konstruktionsmethode, wann die Wortblockmethode?",
		alt: "Dreiteiliges Schaubild zu Konstruktionsmethode (Prädikat→Subjekt), Wortblockmethode (links nach rechts in Blöcken) und der bloßen Roh-Technik Wort-für-Wort.",
		caption: "Die richtige Technik spart Zeit und verhindert typische Bezugsfehler.",
		parts: [
			{
				label: "Konstruktionsmethode",
				note: "Prädikat → Subjekt → erfragte Satzglieder; ideal bei langen, geschachtelten PC-/AcI-Sätzen.",
			},
			{
				label: "Wortblock-/Pendelmethode",
				note: "Sinnblöcke (KNG-Pakete, Präpositionalausdrücke) von links nach rechts vorausschauend lesen.",
			},
			{
				label: "Wort-für-Wort (nur Start!)",
				note: "Hilft kurz beim Wörter-Antasten, muss wegen deutscher Verb-Zweitstellung aber umgebaut werden.",
			},
		],
		draw: () =>
			threeColumns(
				"Drei Wege zum deutschen Zieltext",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Konstruktionsmethode",
						lines: ["Prädikat → Subjekt", "→ Objekte / Adverbiale", "ideal für lange", "PC- & AcI-Perioden"],
						footer: "höchste Sicherheit",
					},
					{
						badge: "2",
						fill: "v-green-fill",
						heading: "Wortblockmethode",
						lines: ["[Sinnblock 1] + [Block 2]", "von links nach rechts", "KNG sofort bündeln", "flüssiges Lesetempo"],
						footer: "natürlicher Lesefluss",
					},
					{
						badge: "3",
						fill: "v-orange-fill",
						heading: "Wort-für-Wort (Roh)",
						lines: ["nur erstes Wörter-Netz", "falsche Endstellung im Dt.", "unbedingt umbauen!", "nie roh stehen lassen"],
						footer: "nur Vorstufe",
					},
				],
				false,
			),
	},
	"l6-fehleranalyse-textaufbau": {
		title: "Fehleranalyse und Textzusammenhang prüfen",
		question: "Welche vier Denkfehler entlarvst du bei der Selbst- und Partnerkontrolle zuerst?",
		alt: "Dreiteiliges Schaubild zur Kontrolle von Genus Verbi (Passiv), KNG-Bezug bei Partizipien und Kohärenz/Textaufbau.",
		caption: "Eine systematische Gegenkontrolle findet Fehler, noch bevor die Lehrkraft sie anstreicht.",
		parts: [
			{
				label: "Passiv- & Tempuscheck",
				note: "'urbs capta est' = wurde erobert (kein Aktiv, kein Präsens!); 'ā/ab' als Urheber prüfen.",
			},
			{
				label: "KNG-Check beim PC",
				note: "Bezugsnomen von PPA/PPP streng über Kasus, Numerus, Genus verifizieren (nicht raten!).",
			},
			{
				label: "Sinn- & Textaufbau",
				note: "Passen Subjektwechsel, Pronomina (hic/ille/is) und ut/cum-Logik zum roten Faden des Absatzes?",
			},
		],
		draw: () =>
			threeColumns(
				"Vier Kontrollschritte am eigenen Entwurf",
				[
					{
						badge: "1",
						fill: "v-coral-fill",
						heading: "Passiv & Tempus",
						lines: ["capta est = wurde erobert", "Urheber mit ā/ab + Abl.", "Konjunktiv-Sinn prüfen", "AcI-Zeitverhältnis klar?"],
						footer: "Verb-Kontrolle",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "KNG-Brücke (PC / Adj.)",
						lines: ["fīliam rīdentem:", "Akk. Sg. gehört zu fīliam!", "dīves / pauper / vetus:", "Abl. -e · Gen. Pl. -um"],
						footer: "Endungen prüfen",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Textaufbau & Logik",
						lines: ["ut nōn (Folge) vs. nē", "cum + tamen = obwohl", "Pronomen-Referenz klar?", "klingt Deutsch natürlich?"],
						footer: "im Team abgleichen",
					},
				],
				true,
			),
	},
	"l6-lernstrategien-pruefung": {
		title: "Stammformen vernetzen, Nachschlagen und Planen",
		question: "Wie lernst du 900 Grundwörter plus Stammformen klug statt durch bloßes Auswendigpauken?",
		alt: "Dreiteiliges Schaubild zu Analogieschlüssen mit Deutsch/Englisch, Wörterbuch-Rückführung und einem 5-Tage-Prüfungsplan.",
		caption: "Verknüpfen über Deutsch/Englisch und geplante Übungsetappen schlagen Nachtschichten.",
		parts: [
			{
				label: "Analogien & Eselsbrücken",
				note: "PPP über Fremdwörter/Englisch verankern (scrīptum → Skript, captum → capture, missum → Mission).",
			},
			{
				label: "Hilfsmittel & Grundform",
				note: "Vor dem Nachschlagen stets zur Grundform führen (iērunt → īre, veterum → vetus, captī → capere).",
			},
			{
				label: "Prüfung planen (5 Tage)",
				note: "Kurze tägliche Blöcke: Wortschatz → Formen → Konstruktionen → Probetext → Fehlerauswertung.",
			},
		],
		draw: () =>
			threeColumns(
				"Werkzeuge für nachhaltiges Latein-Lernen",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Eselsbrücken & Analogie",
						lines: ["scrīptum → Skript", "missum → Mission", "captum → engl. capture", "Mehrkanal: laut + schriftl."],
						footer: "Stammformen sichern",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Hilfsmittel nutzen",
						lines: ["auf Grundform schließen:", "veterum → vetus", "iērunt → īre", "Lehrbuch + ZAM-Karten"],
						footer: "gezielt nachschlagen",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Prüfungsplanung",
						lines: ["5 kleine Etappen statt", "Nachtschicht vor Test", "Probetext mit Zeitlimit", "Fehlerliste abarbeiten"],
						footer: "Schritt für Schritt",
					},
				],
				false,
			),
	},
	"l6-kreativ-praesentation-team": {
		title: "Kreativ gestalten, präsentieren und im Team lernen",
		question: "Wie machst du antike Texte anschaulich – und wie gelingt faires Team-Feedback?",
		alt: "Dreiteiliges Schaubild zu kreativen Produkten (Hörszene, Comic, Plakat), klaren Visualisierungen und wertschätzender Rückmeldung im Team.",
		caption: "Kompakte Visualisierungen und respektvolle Rückmeldungen helfen der ganzen Gruppe.",
		parts: [
			{
				label: "Kreative Rezeption",
				note: "Comic-Storyboard (Daedalus/Ikarus), Hörszene (Plinius in Misenum) oder Museumsposter mit Zitat.",
			},
			{
				label: "Gute Visualisierung",
				note: "Große Leitbegriffe, Zeitstrahl oder Skizze statt dichter Textwände; korrekte KNG-Überschriften.",
			},
			{
				label: "Team & Wochenplan",
				note: "Zeit einteilen, zuerst Stärken loben, dann konkrete sprachliche Verbesserung begründen.",
			},
		],
		draw: () =>
			threeColumns(
				"Vom Text zur Präsentation im Team",
				[
					{
						badge: "1",
						fill: "v-gold-fill",
						heading: "Kreative Formen",
						lines: ["4-Felder-Storyboard", "Hörszene (Plinius)", "Standbild / Rollenspiel", "lateinische Schlagzeile"],
						footer: "Texte lebendig machen",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Klare Darstellung",
						lines: ["Stichworte statt Fließtext", "Skizze / Karte / Zeitstrahl", "korrekte Endungen prüfen", "(z. B. Pompēiī opertī)"],
						footer: "Visualisieren",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Stationen & Feedback",
						lines: ["1. was stark gelang", "2. konkreter Form-Tipp", "Wertschätzung im Ton", "Wochenplan einteilen"],
						footer: "gemeinsam wachsen",
					},
				],
				false,
			),
	},
};
