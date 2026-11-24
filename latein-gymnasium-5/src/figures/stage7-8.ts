import {
	arrow,
	badge,
	card,
	type ConceptFigure,
	label,
	partGroup,
	pill,
	threeColumns,
} from "./draw";

export const STAGE7_8_FIGURES: Record<string, ConceptFigure> = {
	"l5-religion-auspizien": {
		title: "Römischer Tempel, Opferformel und Auspizien",
		question: "Wo wurde geopfert und wie fragten Priester den Willen der Götter ab?",
		alt: "Dreiteiliges Schaubild zu Altar draußen vs. Cella drinnen, dem Prinzip do ut des und Vogelschau/Orakel.",
		caption: "Genaue Rituale am Außenaltar und beobachtete Zeichen (auspicia) sicherten das Wohlwollen der Götter.",
		parts: [
			{
				label: "Altar draußen · Cella drinnen",
				note: "Die Cella beherbergte die Statue der Gottheit; die Gemeinde feierte und opferte vor dem Tempel am Altar (āra).",
			},
			{
				label: "Prinzip: dō ut dēs",
				note: "'Ich gebe, damit du gibst': Ein genau eingehaltenes Opfer begründete eine wechselseitige Verpflichtung.",
			},
			{
				label: "Auspizien & Orakel",
				note: "Auguren deuteten den Vogelflug (auspicia = avis + specere); bei Krisen befragte man Orakel (z. B. Delphi).",
			},
		],
		draw: () =>
			threeColumns(
				"Kult, Gebet und Zeichenschau in Rom",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Tempel & Altar",
						lines: ["Cella = Götterbild drinnen", "Āra = Altar im Freien", "Gemeinde steht davor", "Unterschied zur Kirche"],
						footer: "Opfer im Freien",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "dō ut dēs",
						lines: ["'Ich gebe, damit du gibst'", "Vertrag durch Ritual", "exakte Gebetsworte", "keine Fehler erlaubt"],
						footer: "Gegenseitigkeit",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "Auspizien & Orakel",
						lines: ["Augur beobachtet Vögel", "avis + specere = auspicia", "heilige Hühner / Blitze", "Orakel (Delphi / Sibyllen)"],
						footer: "Götterwillen prüfen",
					},
				],
				false,
			),
	},
	"l5-olympier": {
		title: "Die zwölf Olympier: Römische & griechische Götterwelt",
		question: "Welche römischen Götter entsprechen den griechischen Olympiern – und woran erkennst du sie?",
		alt: "Dreiteiliges Götter-Schaubild: Kapitolinische Trias (Jupiter, Juno, Minerva), Natur- und Handelsgötter sowie Krieg/Licht/Liebe/Herd.",
		caption: "Blitz, Eule, Dreizack, Leier und Ähren machen die Olympier in Texten und Kunstwerken erkennbar.",
		parts: [
			{
				label: "Kapitolinische Trias",
				note: "Iuppiter (Zeus, Blitz/Adler), Iūnō (Hera, Pfau) und Minerva (Athene, Eule/Weisheit) thronten gemeinsam auf dem Kapitol.",
			},
			{
				label: "Meer, Handel, Handwerk, Ernte",
				note: "Neptūnus (Poseidon, Dreizack), Mercurius (Hermes, Flügelschuhe), Volcānus (Hephaistos, Hammer), Cerēs (Demeter, Ähren).",
			},
			{
				label: "Licht, Jagd, Krieg, Liebe, Herd",
				note: "Apollō (Leier), Diāna (Artemis, Bogen), Mārs (Ares, Lanze), Venus (Aphrodite, Taube), Vesta (Hestia, Feuer) / Bacchus.",
			},
		],
		draw: () =>
			threeColumns(
				"Zwölf Olympier · Römisch (Griechisch)",
				[
					{
						badge: "1",
						fill: "v-gold-fill",
						heading: "Kapitolinische Trias",
						lines: ["Iuppiter (Zeus) · Blitz", "Iūnō (Hera) · Ehe/Pfau", "Minerva (Athene) · Eule", "Haupttempel am Kapitol"],
						footer: "Staat & Weisheit",
					},
					{
						badge: "2",
						fill: "v-teal-fill",
						heading: "Welt & Arbeit",
						lines: ["Neptūnus (Poseidon) · Meer", "Mercurius (Hermes) · Bote", "Volcānus (Hephaistos)", "Cerēs (Demeter) · Ähren"],
						footer: "Dreizack · Stab · Hammer",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "Schutz & Mythos",
						lines: ["Mārs (Ares) · Diāna (Artemis)", "Apollō · Venus (Aphrodite)", "Vesta (Herd) / Bacchus", "feste Erkennungszeichen"],
						footer: "Bogen · Leier · Feuer",
					},
				],
				false,
			),
	},
	"l5-tod-unterwelt": {
		title: "Gräberstraße und Reise durch die Unterwelt",
		question: "Was glaubten die Römer über die Toten und ihren Weg über die Styx?",
		alt: "Dreiteiliges Schaubild zum Gedenken an der Via Appia (dī mānēs), der Überfahrt mit Charon über die Styx und Cerberus/Gericht/Elysium.",
		caption: "Gräber lagen vor der Stadt; im Mythos brauchte die Seele Bestattung und eine Münze für Charon.",
		parts: [
			{
				label: "Via Appia & dī mānēs",
				note: "Gräber säumten die Ausfallstraßen; Inschriften (D. M. = Dīs Mānibus) hielten die Namen beim Vorbeigehen lebendig.",
			},
			{
				label: "Überfahrt & Wächter",
				note: "Der Fährmann Charōn setzte gegen eine Münze (Obolus) über die Styx; der dreiköpfige Hund Cerberus bewachte das Tor.",
			},
			{
				label: "Tartarus & Elysium",
				note: "Plūtō und Prōserpina herrschten im Orcus; gerechte Helden zogen ins Elysium, schwere Frevler büßten im Tartarus.",
			},
		],
		draw: () => `${card(4, 4, 592, 242, "v-banner-bg", 14)}
			${label(300, 26, "Tod, Erinnerung und mythische Unterwelt", "heading")}
			${partGroup(
				1,
				`${card(16, 46, 174, 184, "v-paper", 12)}
				${badge(34, 46, 1)}
				${pill(30, 56, 146, 26, "1. Grab & D. M.", "v-gold-fill", "micro")}
				${label(103, 108, "Grabsteine an Via Appia", "micro")}
				${label(103, 132, "außerhalb der Stadt", "micro")}
				${label(103, 156, "D. M. = dī mānēs", "micro")}
				${pill(30, 190, 146, 26, "Münze für die Reise", "v-gold-fill", "micro")}`,
			)}
			${arrow(192, 136, 206, 136)}
			${partGroup(
				2,
				`${card(208, 46, 178, 184, "v-paper", 12)}
				${badge(226, 46, 2)}
				${pill(222, 56, 150, 26, "2. Styx & Cerberus", "v-blue-fill", "micro")}
				${label(297, 108, "Fährmann Charōn", "micro")}
				${label(297, 132, "Fluss Styx überqueren", "micro")}
				${label(297, 156, "3-köpfiger Hund Cerberus", "micro")}
				${pill(222, 190, 150, 26, "Tor zum Orcus", "v-blue-fill", "micro")}`,
			)}
			${arrow(388, 136, 402, 136)}
			${partGroup(
				3,
				`${card(404, 46, 180, 184, "v-paper", 12)}
				${badge(422, 46, 3)}
				${pill(418, 56, 152, 26, "3. Plūtō & Gericht", "v-purple-fill", "micro")}
				${label(494, 108, "Plūtō & Prōserpina", "micro")}
				${label(494, 132, "Ēlysium (Gerechte)", "micro")}
				${label(494, 156, "Tartarus (Frevler)", "micro")}
				${pill(418, 190, 152, 26, "Lohn und Strafe", "v-purple-fill", "micro")}`,
			)}`,
	},
	"l5-herkules-aeneas": {
		title: "Zwei Vorbilder im Mythos: Herkules und Aeneas",
		question: "Was leisteten Herakles/Herkules und Aeneas – und wofür standen sie in Rom?",
		alt: "Dreiteiliges Schaubild zu Herkules (12 Taten, virtus), Aeneas' Flucht mit Anchises und Iulus aus Troja sowie Ankunft in Latium (pietas).",
		caption: "Herkules verkörpert Kraft und Ausdauer (virtūs), Aeneas verantwortungsvolle Treue (pietās).",
		parts: [
			{
				label: "Herkules (12 Taten → virtūs)",
				note: "Nemeischer Löwe, neunköpfige Hydra, Cerberus aus der Unterwelt: Herkules steht für Kraft, Mut und Schutz der Reisenden.",
			},
			{
				label: "Aeneas' Flucht aus Troja",
				note: "Sohn der Venus; trägt Vater Anchises, führt Sohn Iulus (Ascanius) und rettet die trojanischen Penaten.",
			},
			{
				label: "Ziel Latium (→ pietās)",
				note: "Nach Irrfahrt über Karthago landet Aeneas in Italien und legt die Grundlage für Alba Longa und das spätere Rom.",
			},
		],
		draw: () =>
			threeColumns(
				"Heldenmythos als Vorbild für Rom",
				[
					{
						badge: "1",
						fill: "v-orange-fill",
						heading: "Herakles / Herkules",
						lines: ["12 Arbeiten (labōrēs)", "Löwe · Hydra · Cerberus", "Schutzgott der Kaufleute", "Vorbild für Ausdauer"],
						footer: "Leitwert: virtūs",
					},
					{
						badge: "2",
						fill: "v-coral-fill",
						heading: "Aeneas flieht (Troja)",
						lines: ["Sohn der Venus", "trägt Vater Anchises", "führt Sohn Iulus", "rettet die Penaten"],
						footer: "Leitwert: pietās",
					},
					{
						badge: "3",
						fill: "v-teal-fill",
						heading: "Ankunft in Latium",
						lines: ["Irrfahrt / Karthago", "Landung in Italien", "Alba Longa (Iulus)", "Ahnherr der Römer"],
						footer: "Brücke zu Troja",
					},
				],
				false,
			),
	},
	"l5-romulus-koenige-quellen": {
		title: "Roms Gründungsmythos, Königszeit und zwei Hauptquellen",
		question: "Wie verbindet sich der Mythos von Romulus mit der Königszeit und den Autoren Vergil & Livius?",
		alt: "Dreiteiliger Zeitstrahl von Romulus und Remus (753 v. Chr.) über Sabinerinnen/7 Könige (bis 509 v. Chr.) zu Vergil und Livius.",
		caption: "Dichtung (Vergil) und Geschichtsschreibung (Livius) erzählen Roms sagenhafte Anfänge aus rund 700 Jahren Abstand.",
		parts: [
			{
				label: "Romulus & Remus (753 v. Chr.)",
				note: "Zwillinge (Mars & Rhea Silvia), gesäugt von der Wölfin; Auspizienstreit auf Palatin/Aventin, Mauersprung und Gründung Roms.",
			},
			{
				label: "Sabinerinnen & 7 Könige",
				note: "Raub und Versöhnung der Sabinerinnen; insgesamt sieben Könige bis zur Vertreibung von Tarquinius Superbus (509 v. Chr.).",
			},
			{
				label: "Quellen: Vergil & Livius",
				note: "Vergil schrieb das Epos 'Aeneis' über Aeneas; Titus Līvius verfasste das Geschichtswerk 'Ab urbe conditā'.",
			},
		],
		draw: () =>
			threeColumns(
				"Gründungsmythos, Könige und literarische Quellen",
				[
					{
						badge: "1",
						fill: "v-coral-fill",
						heading: "753 v. Chr.: Romulus",
						lines: ["Wölfin am Tiber", "Auspizien-Streit", "Mauer auf dem Palatin", "Stadtname Rōma"],
						footer: "Gründungsmythos",
					},
					{
						badge: "2",
						fill: "v-gold-fill",
						heading: "7 Könige bis 509 v. Chr.",
						lines: ["Raub der Sabinerinnen", "Versöhnung der Familien", "sieben Könige", "Tarquinius Superbus"],
						footer: "509 v. Chr. → Republik",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "Vergil & Livius",
						lines: ["Vergil: Epos 'Aeneis'", "Livius: 'Ab urbe conditā'", "entstanden 1. Jh. v. Chr.", "Sage vs. Archäologie"],
						footer: "wichtige Quellen",
					},
				],
				true,
			),
	},
	"l5-text-erschliessen": {
		title: "Vorentlastung: Erst Überblick, dann Satz für Satz",
		question: "Wie knackst du Sinn und Zusammenhang eines Texts vor der Detailübersetzung?",
		alt: "Dreiteiliges Erschließungsdiagramm: 1. Überschrift & Eigennamen -> 2. Sachfelder & Verben -> 3. W-Fragen zum roten Faden.",
		caption: "Mit Überschrift, Eigennamen und Sachfeldern übersetzt du deutlich gezielter und vermeidest Raterei.",
		parts: [
			{
				label: "1. Überschrift & Namen",
				note: "Lies zuerst Titel/Einleitung und markiere großgeschriebene Namen, Orte und Zeitangaben im Text.",
			},
			{
				label: "2. Sachfelder & Tempora",
				note: "Verbinde thematisch verwandte Wörter (flammae, aqua, ignis) und prüfe die vorherrschenden Verbzeiten.",
			},
			{
				label: "3. W-Fragen (Roter Faden)",
				note: "Wer handelt? Wo/Wann passiert es? Was geschieht Schritt für Schritt? Danach erst startet die Satzanalyse.",
			},
		],
		draw: () =>
			threeColumns(
				"Texterschließung vor dem ersten Übersetzungssatz",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "1. Titel & Namen",
						lines: ["Überschrift lesen", "Rōma / Vesta / Cōnsul", "Orte & Zeiten markieren", "(nocte, in forō)"],
						footer: "Rahmen abstecken",
					},
					{
						badge: "2",
						fill: "v-orange-fill",
						heading: "2. Sachfeld & Tempus",
						lines: ["flammae · ignis · aqua", "→ Thema: Brandgefahr!", "Präsens od. Perfekt?", "Kontext eingrenzen"],
						footer: "Wörter vernetzen",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "3. W-Fragen klären",
						lines: ["Wer handelt?", "Wo & wann?", "Welches Problem/Ziel?", "dann Abfrageschema!"],
						footer: "roter Faden steht",
					},
				],
				true,
			),
	},
	"l5-uebersetzen-pruefen": {
		title: "Vier-Punkte-Check für fehlerfreie Übersetzungen",
		question: "Woran erkennst und reparierst du typische Übersetzungsfehler selbst?",
		alt: "Dreiteiliges Prüfdiagramm: 1. Deutscher Sinntest -> 2. Verb-Check (Tempus & Numerus) -> 3. Kasus- & KNG-Check.",
		caption: "Prüfe jede Übersetzung immer einmal rückwärts am deutschen Sinn und einmal gegen die lateinischen Endungen.",
		parts: [
			{
				label: "1. Deutscher Sinntest",
				note: "Lies deinen deutschen Satz allein: Ergibt er Sinn? Fehlen Objekte oder steht versehentlich ein 'dass'-Satz?",
			},
			{
				label: "2. Tempus & Numerus",
				note: "Stimmt die Zeit (Präs. / Prät. / Futur / AcI-Vorzeitigkeit)? Passen Subjekt und Verb im Singular/Plural zusammen?",
			},
			{
				label: "3. Kasus & KNG-Check",
				note: "Wurde kein Akkusativobjekt (-am/-um/-em/-ōs) zum Subjekt gemacht? Stehen alle Adjektive beim echten Bezugswort?",
			},
		],
		draw: () =>
			threeColumns(
				"Qualitätskontrolle für deinen Übersetzungsentwurf",
				[
					{
						badge: "1",
						fill: "v-teal-fill",
						heading: "1. Deutscher Sinntest",
						lines: ["ohne Latein lesen!", "Klingt der Satz logisch?", "Alle Wörter übersetzt?", "Handlungsfluss stimmig?"],
						footer: "Verständlichkeit",
					},
					{
						badge: "2",
						fill: "v-orange-fill",
						heading: "2. Verb-Kontrolle",
						lines: ["audit vs. audiet (Fut.)", "vēnisse = vorzeitig!", "Sg. oder Pl. am Verb?", "Subjekt passt zum Verb?"],
						footer: "Tempus & Numerus",
					},
					{
						badge: "3",
						fill: "v-coral-fill",
						heading: "3. Kasus & KNG",
						lines: ["Akk. ≠ Subjekt!", "(senātōrem cīvēs...)", "Attribute prüfen", "dōna magna (Pl.!)"],
						footer: "Endungen gegenlesen",
					},
				],
				true,
			),
	},
	"l5-vortrag-stellungnahme": {
		title: "Sinngestaltendes Vorlesen und begründete Stellungnahme",
		question: "Wie liest man lateinische Sätze hörbar gegliedert vor und urteilt sachlich darüber?",
		alt: "Dreiteiliges Schaubild: Pausen & Betonung im Lesevortrag, Verstehen des Gedankens und begründetes eigenes Urteil.",
		caption: "Wer Sätze beim Vorlesen richtig gliedert, hat ihre Struktur verstanden – und kann fundiert Stellung nehmen.",
		parts: [
			{
				label: "Pausen & Paenultima",
				note: "Atme kurz vor Nebensätzen (sī, quod) und vor dem AcI; halte betonte lange Paenultima-Silben sauber (lī-ber-TĀ-tem).",
			},
			{
				label: "Klammern verbinden",
				note: "Führe gesperrte Wortpaare (lībertātem ... nostram) mit der Stimme zusammen, damit Hörer den Bezug sofort spüren.",
			},
			{
				label: "Dreischritt Stellungnahme",
				note: "1. Textaussage genau nennen → 2. mit Antike & Heute vergleichen → 3. eigenes Urteil begründen.",
			},
		],
		draw: () =>
			threeColumns(
				"Vom klaren Lesevortrag zum eigenen Urteil",
				[
					{
						badge: "1",
						fill: "v-blue-fill",
						heading: "Pausen & Betonung",
						lines: ["Pause vor Nebensatz/AcI", "lī-ber-TĀ-tem (lang)", "ho-MI-ni-bus (kurz)", "Satzzeichen hören"],
						footer: "Gliederung hörbar",
					},
					{
						badge: "2",
						fill: "v-purple-fill",
						heading: "Klammern spannen",
						lines: ["Gesperrte Paare binden", "Stimme am Komma hoch", "Punkt senkt die Stimme", "Text lebendig sprechen"],
						footer: "Ausdruck & Sinn",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Stellungnahme (3fach)",
						lines: ["1. Aussage wiedergeben", "2. Antike ↔ Gegenwart", "3. Urteil begründen", "(Beispiele nennen)"],
						footer: "reflektierter Umgang",
					},
				],
				true,
			),
	},
	"l5-lernplan-hilfsmittel": {
		title: "Lernstrategien, Kartei und 5-Tage-Planung",
		question: "Wie organisierst du Vokabeln, Merkkästen und Prüfungsvorbereitung ohne Zeitdruck?",
		alt: "Dreiteiliges Schaubild zur Vokabelkartei und Eselsbrücken, eigenen Merkkästen und einem 5-Tage-Vorbereitungsplan.",
		caption: "Kleine, aktive Wiederholungen über mehrere Tage schlagen spätes Durchlesen um Längen.",
		parts: [
			{
				label: "Kartei & Eselsbrücken",
				note: "Lerne täglich 10–15 Min. in Fächern über mehrere Sinne (laut sagen, schreiben, Eselsbrücke / Fremdwort verknüpfen).",
			},
			{
				label: "Merkkästen & Hilfsmittel",
				note: "Zeichne eigene Tabellen und Pfeildiagramme; schlage unsichere Genitive und Stammformen gezielt im Buchregister nach.",
			},
			{
				label: "Realistischer 5-Tage-Plan",
				note: "Tag 1–2 Wortschatz, Tag 3–4 Formen aktiv bilden, Tag 5 ganzen Text übersetzen & Fehlerliste prüfen.",
			},
		],
		draw: () =>
			threeColumns(
				"Klug lernen statt spät pauken",
				[
					{
						badge: "1",
						fill: "v-teal-fill",
						heading: "Kartei & Eselsbrücken",
						lines: ["10–15 Min. täglich", "Fach 1 → Fach 3", "laut sprechen + schreiben", "Fremdwort-Brücken"],
						footer: "Mehrkanal-Lernen",
					},
					{
						badge: "2",
						fill: "v-gold-fill",
						heading: "Merkkästen & Register",
						lines: ["Farbe: Stamm vs. Endung", "eigene Übersicht zeichnen", "Lehrbuch / App nutzen", "aktiv testen statt starren"],
						footer: "gezielt nachschlagen",
					},
					{
						badge: "3",
						fill: "v-blue-fill",
						heading: "5-Tage-Prüfungsplan",
						lines: ["T1–2: Grundwortschatz", "T3: Dekl. / Konj. bilden", "T4: Text + Checkliste", "T5: Lücken schließen"],
						footer: "ohne Panik & Stress",
					},
				],
				false,
			),
	},
	"l5-kreativ-gemeinsam": {
		title: "Kreative Rezeption, offene Formen und faires Team-Feedback",
		question: "Wie gelingen Standbild, Stationenarbeit und respektvolle Rückmeldungen im Team?",
		alt: "Dreiteiliges Schaubild zu kreativer Umsetzung (Standbild, Plakat, Spielszene), selbstständigem Lernen im Lernzirkel und fairer Feedback-Regel.",
		caption: "Kreativität macht Texte greifbar; offene Lernformen und Teamarbeit bauen auf Verantwortung und Fairplay.",
		parts: [
			{
				label: "Kreative Umsetzung",
				note: "Standbild, kurze Spielszene, Comic oder Götterplakat machen Figurenbeziehungen nach dem Übersetzen unmittelbar sichtbar.",
			},
			{
				label: "Freiarbeit & Lernzirkel",
				note: "Wähle sinnvolle Reihenfolge, arbeite konzentriert und nutze Lösungsblätter erst nach dem eigenen Versuch zur Korrektur.",
			},
			{
				label: "Faires Feedback im Team",
				note: "Rollen gerecht teilen, einander helfen und Rückmeldungen immer nach 'Lob + konkreter, freundlicher Tipp' geben.",
			},
		],
		draw: () =>
			threeColumns(
				"Gemeinsam gestalten und fair lernen",
				[
					{
						badge: "1",
						fill: "v-coral-fill",
						heading: "Kreativ umsetzen",
						lines: ["Standbild (Haltung/Blick)", "Plakat zu Olympiern", "kurze Spielszene / Comic", "Bezug zum Text bewahren"],
						footer: "Verstehen sichtbar",
					},
					{
						badge: "2",
						fill: "v-blue-fill",
						heading: "Offene Unterrichtsform",
						lines: ["Stationen selbst planen", "Wochenplan abhaken", "erst selbst denken", "dann ehrlich prüfen"],
						footer: "Selbstorganisation",
					},
					{
						badge: "3",
						fill: "v-green-fill",
						heading: "Team & Feedback",
						lines: ["Aufgaben fair teilen", "1. Was gelang gut?", "2. Konkreter Tipp", "wertschätzend sprechen"],
						footer: "gemeinsamer Erfolg",
					},
				],
				false,
			),
	},
};
