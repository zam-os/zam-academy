import type { Stage } from "../model/types";

export const STAGES: ReadonlyArray<Stage> = [
	{
		id: "lb1",
		lb: 1,
		worldName: "Rathausplatz & Medienmarkt",
		officialTitle: "Lernbereich 1: Demokratie und Gesellschaft",
		subtitle:
			"Gemeinsam entscheiden, Aufgaben der Gemeinde verstehen, Werbung durchschauen und nachhaltig einkaufen.",
		icon: "🏛️",
		accentLight: "#c84b28",
		accentDark: "#ff9373",
		softLight: "#fff1ec",
		softDark: "#381d16",
		probenFocus:
			"5 Wahlgrundsätze (allgemein, frei, gleich, geheim, unmittelbar), Pflichtaufgaben vs. freiwillige Aufgaben der Gemeinde, Bürgermeister & Gemeinderat, Kinderrechte und Werbetricks im Supermarkt.",
		parentEverydayTip:
			"Schaut beim nächsten Einkauf gemeinsam auf die Regalebenen (Sichtzone vs. Bückzone) oder sprecht am Rathaus darüber, wofür eure Gemeinde vor Ort sorgt (Feuerwehr, Wasser, Spielplätze).",
	},
	{
		id: "lb2",
		lb: 2,
		worldName: "Körper- & Erste-Hilfe-Zelt",
		officialTitle: "Lernbereich 2: Körper und Gesundheit",
		subtitle:
			"Das Wunderwerk Auge schützen, Großwerden verstehen, Erste Hilfe leisten und eigene Grenzen stärken.",
		icon: "🩺",
		accentLight: "#b82d62",
		accentDark: "#ff8ab5",
		softLight: "#fff0f6",
		softDark: "#361624",
		probenFocus:
			"Schutz- und Innenteile des Auges mit Lichtweg, Entwicklung vor der Geburt (Fruchtblase, Plazenta, Nabelschnur), Veränderungen in der Pubertät, Notruf 112 (W-Fragen), Erste Hilfe und körperliche Selbstbestimmung.",
		parentEverydayTip:
			"Beobachtet vor dem Spiegel im Badezimmer den Pupillenreflex beim Lichtanschalten und geht einmal ruhig die Notrufnummer 112 samt eurer genauen Wohnadresse durch.",
	},
	{
		id: "lb3",
		lb: 3,
		worldName: "Wald-, Bach- & Energielabor",
		officialTitle: "Lernbereich 3: Natur und Umwelt",
		subtitle:
			"Wald und Gewässer erforschen, Eiercodes knacken, Stromkreise schließen, Feuer bändigen und dem Wasserkreislauf folgen.",
		icon: "🌿",
		accentLight: "#18794e",
		accentDark: "#6ee7b7",
		softLight: "#ecfdf3",
		softDark: "#123124",
		probenFocus:
			"Stockwerke des Waldes & Nahrungsketten, Metamorphose (Frosch/Marienkäfer), Wolf & Hund, Eierstempel (0–3), Leiter/Nichtleiter & Schaltzeichen, Verbrennungsdreieck & Löschmethoden, Wasserkreislauf & Bodenschichten.",
		parentEverydayTip:
			"Entziffert am Frühstückstisch gemeinsam den Stempel auf einem Hühnerei (0–3 und Länderkürzel) oder überlegt nach einem Regenschauer, wo das Regenwasser versickert.",
	},
	{
		id: "lb4",
		lb: 4,
		worldName: "Zeitburg & Museumswerkstatt",
		officialTitle: "Lernbereich 4: Zeit und Wandel",
		subtitle:
			"Jahrhunderte einordnen, historische Quellen wie Detektive prüfen, Erfindungen vergleichen und Sagen hinterfragen.",
		icon: "🏰",
		accentLight: "#b06a0b",
		accentDark: "#fbbf24",
		softLight: "#fffbeb",
		softDark: "#36250e",
		probenFocus:
			"Zeiträume & Jahrhundert-Zuordnung (z. B. 1825 = 19. Jahrhundert), Sach-, Bild-, Textquellen und Zeitzeugen, Aufgaben von Museen & Archiven, Fahrrad-Entwicklung (Draisine bis heute) sowie Fakt vs. Fiktion.",
		parentEverydayTip:
			"Sucht bei einem Spaziergang nach einer Jahreszahl an einem alten Gebäude oder Denkmal und rechnet gemeinsam aus, in welchem Jahrhundert es gebaut wurde.",
	},
	{
		id: "lb5",
		lb: 5,
		worldName: "Kompassgipfel & Verkehrsplatz",
		officialTitle: "Lernbereich 5: Raum und Mobilität",
		subtitle:
			"Mit Kompass und Maßstab orientieren, Bayerns sieben Regierungsbezirke bereisen und sicher für die Radfahrprüfung trainieren.",
		icon: "🧭",
		accentLight: "#1662a8",
		accentDark: "#7cc4fa",
		softLight: "#eef7ff",
		softDark: "#12283d",
		probenFocus:
			"8 Himmelsrichtungen, Kartenmerkmale (Höhenschichten, Legende, Maßstab umrechnen), politische Gliederung mit Bayerns 7 Regierungsbezirken, verkehrssicheres Fahrrad, Verkehrszeichen, Rechts-vor-links und die 8 Punkte beim Linksabbiegen.",
		parentEverydayTip:
			"Macht gemeinsam vor der Jugendverkehrsschule den Sicherheitscheck am eigenen Fahrrad (Bremsen, Klingel, Licht, alle Reflektoren) und übt an ruhigen Wegen die Vorfahrtsregeln.",
	},
	{
		id: "lb6",
		lb: 6,
		worldName: "Erfinder- & Brückenwerkstatt",
		officialTitle: "Lernbereich 6: Technik und Kultur",
		subtitle:
			"Zahnräder und Hebel testen, Handwerk mit Fabriken vergleichen, stabile Brückenprofile falten und Wippen ausbalancieren.",
		icon: "⚙️",
		accentLight: "#6340b5",
		accentDark: "#c4b5fd",
		softLight: "#f5f1ff",
		softDark: "#24193d",
		probenFocus:
			"Hebelgesetz im Alltag (Kraftarm & Lastarm), Zahnradgetriebe (Drehrichtung & Tempo), Fliehkraft, Handwerk vs. Massenproduktion, Brückenarten (Balken-, Bogen-, Fachwerk-, Hängebrücke), Papierprofile und Gleichgewicht an der Balkenwaage.",
		parentEverydayTip:
			"Faltet ein Blatt Papier einmal im Zickzack zwischen zwei Bücher und staunt gemeinsam, wie viele Stifte oder Münzen diese kleine Papierbrücke plötzlich trägt!",
	},
];
