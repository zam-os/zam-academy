import type { LabDefinition, LabValues } from "../model/types";
import { goal, select } from "./learning-controls";

export const animals = [
	{
		name: "Bachforelle",
		group: "Fische",
		cover: "Schuppen",
		trait: "Kiemen und Flossen",
		movement: "Rumpf und Schwanzflosse treiben voran.",
	},
	{
		name: "Grasfrosch",
		group: "Amphibien",
		cover: "feuchte, drüsenreiche Haut",
		trait: "kräftige Hinterbeine",
		movement: "Die Hinterbeine schieben beim Sprung und beim Schwimmen.",
	},
	{
		name: "Zauneidechse",
		group: "Reptilien",
		cover: "trockene Hornschuppen",
		trait: "vier Beine mit Krallen",
		movement: "Beine und Krallen geben Halt auf trockenem Untergrund.",
	},
	{
		name: "Mauersegler",
		group: "Vögel",
		cover: "Federn",
		trait: "schmale, lange Flügel",
		movement:
			"Die Flügel erzeugen Auftrieb. Der Körper hat wenig Luftwiderstand.",
	},
	{
		name: "Abendsegler",
		group: "Säugetiere",
		cover: "Fell",
		trait: "Flughaut zwischen langen Fingern",
		movement: "Die bewegliche Flughaut bildet die Tragfläche.",
	},
] as const;

export const airway = [
	[
		"Nase und Mund",
		"Luft tritt ein. In der Nase wird sie angewärmt, befeuchtet und teilweise gereinigt.",
	],
	[
		"Kehlkopf und Luftröhre",
		"Die Luft strömt am Kehlkopf vorbei. Knorpelspangen halten die Luftröhre offen.",
	],
	[
		"Bronchien und Bronchiolen",
		"Die Atemwege verzweigen sich in immer feinere Röhren.",
	],
	[
		"Lungenbläschen",
		"Hier liegen Atemluft und Blut nur durch sehr dünne Wände getrennt.",
	],
] as const;

export const blood = [
	[
		"Blutplasma",
		"Die Flüssigkeit transportiert gelöste Nährstoffe, Abfallstoffe und Wärme.",
	],
	[
		"Rote Blutkörperchen",
		"Hämoglobin bindet vor allem Sauerstoff für den Transport.",
	],
	["Weiße Blutkörperchen", "Sie gehören zur Abwehr gegen Erreger."],
	[
		"Blutplättchen",
		"Sie helfen beim Wundverschluss und bei der Blutgerinnung.",
	],
] as const;

export const routes = [
	["Rechte Herzhälfte", "Pumpt sauerstoffärmeres Blut in Richtung Lunge."],
	[
		"Lungenkapillaren",
		"Hier nimmt das Blut Sauerstoff auf und gibt Kohlenstoffdioxid ab.",
	],
	["Linke Herzhälfte", "Pumpt sauerstoffreicheres Blut in den Körper."],
	[
		"Körperkapillaren",
		"Die Versorgung der Zellen findet an den feinen Kapillaren statt.",
	],
] as const;

export const healthChoices = [
	[
		"Ausgangslage",
		"Vergleiche, wie sich eine Gewohnheit auf Herz und Gefäße auswirken kann.",
	],
	[
		"Regelmäßig zu Fuß gehen",
		"Bewegung trainiert den Kreislauf und kann Ausdauer verbessern.",
	],
	[
		"Rauchen",
		"Rauchen erhöht auf Dauer das Risiko für Erkrankungen von Herz und Gefäßen.",
	],
	[
		"Oft sehr salzreich essen",
		"Eine sehr salzreiche Ernährung kann bei vielen Menschen den Blutdruck erhöhen.",
	],
] as const;

const loads = [
	{ activity: "Ruhe", pulse: 72, breath: 15 },
	{ activity: "Zügiges Gehen", pulse: 106, breath: 22 },
	{ activity: "Laufen", pulse: 148, breath: 34 },
	{ activity: "Erholung", pulse: 90, breath: 18 },
] as const;
export const activityAt = (v: LabValues) => loads[v.load];

export const livingLabs = {
	animals: {
		kind: "animals",
		title: "Wirbeltiere anhand ihrer Merkmale zuordnen",
		intro:
			"Wähle ein heimisches Tier. Vergleiche Körperbedeckung, Körperform und ein typisches Merkmal im Steckbrief.",
		params: [
			select(
				"animal",
				"Tier",
				animals.map(({ name }) => name),
			),
		],
		readouts: [
			{
				key: "group",
				label: "Wirbeltierklasse",
				compute: (v) => animals[v.animal].group,
			},
			{
				key: "cover",
				label: "Körperbedeckung",
				compute: (v) => animals[v.animal].cover,
			},
			{
				key: "trait",
				label: "Merkmal",
				compute: (v) => animals[v.animal].trait,
			},
		],
		goals: [
			goal(
				"amphibian",
				"Finde ein Wirbeltier mit feuchter Haut und kräftigen Hinterbeinen.",
				(v) => v.animal === 1,
			),
			goal(
				"scales",
				"Finde das Landwirbeltier mit trockenen Hornschuppen.",
				(v) => v.animal === 2,
			),
			goal("fur", "Finde ein fliegendes Tier mit Fell.", (v) => v.animal === 4),
		],
	},
	locomotion: {
		kind: "locomotion",
		title: "Land, Wasser und Luft vergleichen",
		intro:
			"Wähle ein Tier und ein Medium. Das Modell zeigt, ob und wie sich dieses Tier dort fortbewegt.",
		params: [
			select(
				"animal",
				"Tier",
				animals.map(({ name }) => name),
			),
			select("medium", "Medium", ["Land", "Wasser", "Luft"]),
		],
		readouts: [
			{ key: "movement", label: "Fortbewegung", compute: (v) => movementAt(v) },
		],
		goals: [
			goal(
				"swim",
				"Zeige den Vortrieb der Bachforelle im Wasser.",
				(v) => v.animal === 0 && v.medium === 1,
			),
			goal(
				"jump",
				"Zeige den Sprung des Grasfroschs an Land.",
				(v) => v.animal === 1 && v.medium === 0,
			),
			goal(
				"flight",
				"Vergleiche die Tragflächen eines Vogels und einer Fledermaus. Wähle danach den Abendsegler in der Luft.",
				(v) => v.animal === 4 && v.medium === 2,
			),
		],
	},
	airway: {
		kind: "airway",
		title: "Ein Atemzug durch die Lunge",
		intro:
			"Verfolge die Atemluft von der Nase bis an die Blutkapillaren. Die Linie markiert die ausgewählte Station.",
		params: [
			select(
				"step",
				"Station",
				airway.map(([name]) => name),
			),
		],
		readouts: [
			{ key: "role", label: "Aufgabe", compute: (v) => airway[v.step][1] },
		],
		goals: [
			goal(
				"support",
				"Finde den Atemweg, den Knorpelspangen offen halten.",
				(v) => v.step === 1,
			),
			goal(
				"split",
				"Zeige die Verzweigung zu immer feineren Atemwegen.",
				(v) => v.step === 2,
			),
			goal(
				"surface",
				"Finde die Station mit besonders dünner Trennwand zur Kapillare.",
				(v) => v.step === 3,
			),
		],
	},
	ventilation: {
		kind: "ventilation",
		title: "Brustraum vergrößern und verkleinern",
		intro:
			"Wähle eine Atembewegung. Die Darstellung zeigt die Richtung von Zwerchfell, Rippen und Luftstrom.",
		params: [
			select("phase", "Atembewegung", ["Pause", "Einatmen", "Ausatmen"]),
		],
		readouts: [
			{
				key: "pressure",
				label: "Luftstrom",
				compute: (v) =>
					[
						"Kein Luftstrom bei ausgeglichenem Druck.",
						"Der Brustraum wird größer. Luft strömt hinein.",
						"Der Brustraum wird kleiner. Luft strömt hinaus.",
					][v.phase],
			},
		],
		goals: [
			goal(
				"in",
				"Vergrößere den Brustraum. Beobachte Zwerchfell und Rippen.",
				(v) => v.phase === 1,
			),
			goal(
				"out",
				"Verkleinere den Brustraum. Beobachte die Richtung der Luft.",
				(v) => v.phase === 2,
			),
		],
	},
	exchange: {
		kind: "exchange",
		title: "Durch die Wand des Lungenbläschens",
		intro:
			"Verfolge getrennt den Weg von Sauerstoff und Kohlenstoffdioxid. Die Pfeile zeigen jeweils die Netto-Richtung.",
		params: [
			select("gas", "Teilchen verfolgen", [
				"Übersicht",
				"Sauerstoff",
				"Kohlenstoffdioxid",
			]),
		],
		readouts: [
			{
				key: "direction",
				label: "Netto-Weg",
				compute: (v) =>
					[
						"Lungenbläschen und Kapillare liegen dicht aneinander.",
						"Sauerstoff geht von der Luft ins Blut über.",
						"Kohlenstoffdioxid geht vom Blut in die Luft über.",
					][v.gas],
			},
		],
		goals: [
			goal(
				"oxygen",
				"Verfolge das Gas, das in der Lunge ins Blut gelangt.",
				(v) => v.gas === 1,
			),
			goal(
				"carbon",
				"Verfolge das Gas, das anschließend ausgeatmet wird.",
				(v) => v.gas === 2,
			),
		],
	},
	blood: {
		kind: "blood",
		title: "Bestandteile des Blutes unter der Lupe",
		intro:
			"Hebe einen Bestandteil hervor. Die Zeichnung zeigt Form und Aufgabe schematisch.",
		params: [
			select(
				"part",
				"Bestandteil",
				blood.map(([name]) => name),
			),
		],
		readouts: [
			{ key: "role", label: "Aufgabe", compute: (v) => blood[v.part][1] },
		],
		goals: [
			goal(
				"transport",
				"Zeige die Zellen, die den meisten Sauerstoff transportieren.",
				(v) => v.part === 1,
			),
			goal(
				"defence",
				"Zeige einen Bestandteil der Abwehr.",
				(v) => v.part === 2,
			),
			goal(
				"clot",
				"Zeige die kleinen Bestandteile, die beim Wundverschluss helfen.",
				(v) => v.part === 3,
			),
		],
	},
	circulation: {
		kind: "circulation",
		title: "Zwei Schleifen, ein Kreislauf",
		intro:
			"Verfolge ein Blutteilchen durch beide Schleifen. Die Farben stehen für den Sauerstoffgehalt, nicht für die wirkliche Blutfarbe.",
		params: [
			select(
				"station",
				"Station",
				routes.map(([name]) => name),
			),
		],
		readouts: [
			{
				key: "role",
				label: "Was hier passiert",
				compute: (v) => routes[v.station][1],
			},
		],
		goals: [
			goal(
				"lung",
				"Finde die Stelle, an der Sauerstoff ins Blut gelangt.",
				(v) => v.station === 1,
			),
			goal(
				"left",
				"Finde die Pumpe für den Körperkreislauf.",
				(v) => v.station === 2,
			),
			goal(
				"cells",
				"Finde die Gefäße für den Stoffaustausch im Körper.",
				(v) => v.station === 3,
			),
		],
	},
	pump: {
		kind: "pump",
		title: "Herzklappen am Pumpmodell",
		intro:
			"Wechsle zwischen Füllen und Auswerfen. Die beiden Klappen öffnen je nach Druck von selbst in die erlaubte Richtung.",
		params: [
			select("beat", "Herzphase", [
				"Übersicht",
				"Kammer füllt sich",
				"Kammer wirft Blut aus",
			]),
		],
		readouts: [
			{
				key: "valves",
				label: "Klappenstellung",
				compute: (v) =>
					[
						"Zwischen Vorhof, Kammer und Arterie liegen Klappen.",
						"Einlass offen, Auslass geschlossen.",
						"Einlass geschlossen, Auslass offen.",
					][v.beat],
			},
		],
		goals: [
			goal(
				"fill",
				"Lass Blut aus dem Vorhof in die Kammer fließen.",
				(v) => v.beat === 1,
			),
			goal(
				"pump",
				"Lass Blut aus der Kammer in die Arterie fließen.",
				(v) => v.beat === 2,
			),
		],
	},
	health: {
		kind: "health",
		title: "Gewohnheiten und Kreislauf vergleichen",
		intro:
			"Wähle eine Alltagssituation. Ordne ihr die beobachtete oder langfristig mögliche Wirkung zu.",
		params: [
			select(
				"case",
				"Gewohnheit",
				healthChoices.map(([name]) => name),
			),
		],
		readouts: [
			{
				key: "effect",
				label: "Einfluss",
				compute: (v) => healthChoices[v.case][1],
			},
		],
		goals: [
			goal(
				"movement",
				"Zeige eine Gewohnheit, die die Ausdauer unterstützen kann.",
				(v) => v.case === 1,
			),
			goal(
				"smoke",
				"Zeige ein Risiko durch eingeatmete Stoffe.",
				(v) => v.case === 2,
			),
			goal(
				"food",
				"Zeige eine Ernährungsgewohnheit, die den Blutdruck erhöhen kann.",
				(v) => v.case === 3,
			),
		],
	},
	load: {
		kind: "load",
		title: "Atmung und Puls bei Belastung",
		intro:
			"Wechsle die Aktivität. Die Beispielwerte sind erfunden und zeigen einen möglichen Verlauf. Beide Skalen haben unterschiedliche Einheiten.",
		params: [
			select(
				"load",
				"Aktivität",
				loads.map(({ activity }) => activity),
			),
		],
		readouts: [
			{
				key: "pulse",
				label: "Herzschläge pro Minute",
				digits: 0,
				compute: (v) => activityAt(v).pulse,
			},
			{
				key: "breath",
				label: "Atemzüge pro Minute",
				digits: 0,
				compute: (v) => activityAt(v).breath,
			},
		],
		goals: [
			goal("walk", "Zeige die Werte beim zügigen Gehen.", (v) => v.load === 1),
			goal(
				"peak",
				"Stelle im Modell den höchsten Energiebedarf ein.",
				(v) => v.load === 2,
			),
			goal(
				"recover",
				"Vergleiche danach den Übergang zur Ruhe.",
				(v) => v.load === 3,
			),
		],
	},
} satisfies Record<string, LabDefinition>;

export function movementAt(v: LabValues): string {
	const compare: string[][] = [
		[
			"Außerhalb des Wassers keine wirksame Fortbewegung.",
			animals[0].movement,
			"Bachforellen fliegen nicht.",
		],
		[
			"Die Hinterbeine strecken sich zum Sprung.",
			"Die Hinterbeine stoßen Wasser nach hinten.",
			"Beim Springen fliegt der Grasfrosch nicht aktiv.",
		],
		[
			animals[2].movement,
			"In diesem Vergleich wird ihr Lauf auf festem Boden betrachtet.",
			"Zauneidechsen fliegen nicht.",
		],
		[
			"Am Boden kann er sich nur eingeschränkt fortbewegen.",
			"Die Flügel des Mauerseglers sind für den Luftflug angepasst.",
			animals[3].movement,
		],
		[
			"Die kurzen Füße dienen vor allem zum Festhalten.",
			"Der Abendsegler benutzt seine Tragflächen in der Luft.",
			animals[4].movement,
		],
	];
	return compare[v.animal][v.medium];
}
