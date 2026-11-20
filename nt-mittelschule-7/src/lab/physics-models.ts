import type { LabDefinition, LabValues } from "../model/types";
import { goal, select, slider } from "./learning-controls";

export const sites = [
	{
		name: "Standorte vergleichen",
		wind: 0,
		costs: "Weg und Netzanschluss prüfen",
		nature: "Tiere und Schutzgebiete prüfen",
		people: "Abstände und Beteiligung prüfen",
	},
	{
		name: "Freie Hochfläche",
		wind: 5,
		costs: "lange neue Zuwegung",
		nature: "Zugroute von Vögeln kreuzt das Gebiet",
		people: "weite Entfernung zur Siedlung",
	},
	{
		name: "Gewerbegebiet am Ortsrand",
		wind: 4,
		costs: "Netz und Straße in der Nähe",
		nature: "Naturschutz muss geprüft werden",
		people: "Schall und Abstände prüfen",
	},
	{
		name: "Windarmes Tal",
		wind: 1,
		costs: "leicht erreichbar",
		nature: "kleiner Eingriff am vorhandenen Weg",
		people: "Wohnhäuser in der Nähe",
	},
] as const;

export const effects = [
	[
		"Stromkreis bereit",
		"Elektrische Energie kann verschiedene Wirkungen haben.",
	],
	["Lampe", "Elektrische Energie wird in Licht und Wärme umgewandelt."],
	["Heizdraht", "Elektrische Energie wird vor allem in Wärme umgewandelt."],
	[
		"Elektromotor",
		"Elektrische Energie wird in Bewegung und auch Wärme umgewandelt.",
	],
	[
		"Akku beim Laden",
		"Ein Teil der elektrischen Energie wird als chemische Energie gespeichert.",
	],
] as const;

export const electricalCases = [
	["Alltagssituationen", "Wähle einen Fall. Begründe, welcher Schutz hilft."],
	[
		"Beschädigte Leitung",
		"Abstand halten, Gerät außer Betrieb lassen und einer erwachsenen Person Bescheid sagen.",
	],
	[
		"Gerät in Wassernähe",
		"Netzgeräte von Wasser fernhalten. Wasser kann einen unbeabsichtigten Stromweg bilden.",
	],
	[
		"Viele starke Geräte",
		"Überlastung kann Leitungen erwärmen. Die Belastbarkeit von Mehrfachsteckdosen beachten.",
	],
] as const;

export const circuitClosed = (v: LabValues) => v.sw === 1 && v.fault === 0;
export function branchCurrents(v: LabValues) {
	const left = v.left ? 100 : 0;
	const right = v.right ? 100 : 0;
	return { left, right, total: left + right };
}
export const ohmicResistance = (v: LabValues) => (1000 * v.voltage) / v.current;

export const materials = [
	{ name: "Kupfer", resistivity: 0.0175, temperatureCoefficient: 0.0039 },
	{ name: "Aluminium", resistivity: 0.028, temperatureCoefficient: 0.004 },
] as const;

export function exampleWire(v: LabValues) {
	const { resistivity, temperatureCoefficient } = materials[v.material];
	return (
		resistivity *
		(v.length / v.area) *
		(1 + temperatureCoefficient * (v.warm ? 40 : 0))
	);
}

export const physicsLabs = {
	wind: {
		kind: "wind",
		title: "Vom Wind ins Stromnetz",
		intro:
			"Schalte Wind und Netzverbindung im vereinfachten Modell getrennt. Verfolge, an welchem Bauteil die Energie weitergegeben wird.",
		params: [
			select("wind", "Wind", [
				"still",
				"mäßiger Wind",
				"kräftiger Wind im Betriebsbereich",
			]),
			select("grid", "Netz", ["getrennt", "verbunden"]),
		],
		readouts: [
			{
				key: "rotor",
				label: "Rotor im Modell",
				compute: (v) => ["steht", "dreht", "dreht schneller"][v.wind],
			},
			{
				key: "flow",
				label: "Abgabe ans Netz",
				compute: (v) =>
					v.wind && v.grid
						? "Elektrische Energie wird eingespeist."
						: "Keine Einspeisung.",
			},
		],
		goals: [
			goal(
				"rotation",
				"Lass den Rotor drehen, während die Netzanbindung noch fehlt.",
				(v) => v.wind === 1 && !v.grid,
			),
			goal(
				"delivery",
				"Stelle das Modell so ein, dass Energie ins Netz gelangt.",
				(v) => v.wind === 1 && v.grid === 1,
			),
			goal(
				"limit",
				"Zeige, dass die Anlage bei Windstille trotz Netzanbindung nichts einspeist.",
				(v) => !v.wind && v.grid === 1,
			),
		],
	},
	windSite: {
		kind: "wind-site",
		title: "Drei erfundene Standorte abwägen",
		intro:
			"Vergleiche die Standortkarten nacheinander. Die Windskala ist eine vereinfachte Einschätzung. Kosten, Natur und Menschen brauchen eine eigene Prüfung.",
		params: [
			select(
				"site",
				"Standort",
				sites.map(({ name }) => name),
			),
		],
		readouts: [
			{
				key: "wind",
				label: "Wind (Modellskala von 1 bis 5)",
				compute: (v) => (v.site ? sites[v.site].wind : "Wähle einen Ort."),
			},
			{
				key: "cost",
				label: "Netz und Wege",
				compute: (v) => sites[v.site].costs,
			},
			{ key: "nature", label: "Natur", compute: (v) => sites[v.site].nature },
			{
				key: "people",
				label: "Menschen",
				compute: (v) => sites[v.site].people,
			},
		],
		goals: [
			goal(
				"wind",
				"Finde den windreichsten Standort und prüfe das Risiko für Vögel.",
				(v) => v.site === 1,
			),
			goal(
				"network",
				"Zeige einen windreichen Standort mit kurzem Netzanschluss.",
				(v) => v.site === 2,
			),
			goal(
				"low",
				"Finde den Ort, dessen gute Erreichbarkeit den schwachen Wind nicht ausgleicht.",
				(v) => v.site === 3,
			),
		],
	},
	effects: {
		kind: "effects",
		title: "Was macht elektrische Energie?",
		intro:
			"Wechsle das angeschlossene Gerät. Lies die Umwandlung vom Eingang zur Wirkung.",
		params: [
			select(
				"effect",
				"Gerät",
				effects.map(([name]) => name),
			),
		],
		readouts: [
			{
				key: "effect",
				label: "Energieumwandlung",
				compute: (v) => effects[v.effect][1],
			},
		],
		goals: [
			goal(
				"light",
				"Stelle die Strahlungswirkung im Modell ein.",
				(v) => v.effect === 1,
			),
			goal(
				"heat",
				"Stelle das Gerät ein, das hauptsächlich heizt.",
				(v) => v.effect === 2,
			),
			goal(
				"chemical",
				"Finde das Gerät, das chemische Energie speichert.",
				(v) => v.effect === 4,
			),
		],
	},
	circuit: {
		kind: "circuit",
		title: "Ein Schaltplan mit zwei möglichen Unterbrechungen",
		intro:
			"Betätige den Schalter und prüfe die Leitung. Die Pfeile im geschlossenen Kreis zeigen die technische Stromrichtung außerhalb der Quelle.",
		params: [
			select("sw", "Schalter", ["offen", "geschlossen"]),
			select("fault", "Leitung", ["in Ordnung", "unterbrochen"]),
		],
		readouts: [
			{
				key: "state",
				label: "Lampe",
				compute: (v) => (circuitClosed(v) ? "leuchtet" : "bleibt aus"),
			},
		],
		goals: [
			goal("on", "Lass die Lampe im geschlossenen Kreis leuchten.", (v) =>
				circuitClosed(v),
			),
			goal(
				"fault",
				"Zeige einen Fehler, bei dem die Lampe trotz geschlossenem Schalter aus bleibt.",
				(v) => v.sw === 1 && v.fault === 1,
			),
			goal(
				"both",
				"Zeige einen Kreis mit offenem Schalter und defekter Leitung.",
				(v) => !v.sw && v.fault === 1,
			),
		],
	},
	meters: {
		kind: "meters",
		title: "Wo kommen die Messgeräte hin?",
		intro:
			"Wähle eine Messaufgabe und die Anschlüsse an einem einfachen Lampenmodell. Falsche Anschlüsse werden nur im Modell verglichen.",
		params: [
			select("meter", "Messaufgabe", [
				"auswählen",
				"Stromstärke der Lampe",
				"Spannung an der Lampe",
			]),
			select("placement", "Anschluss", [
				"auswählen",
				"in Reihe im Lampenzweig",
				"parallel zur Lampe",
			]),
		],
		readouts: [
			{
				key: "reading",
				label: "Messwert",
				compute: (v) => {
					if (!v.meter || !v.placement) return "Wähle Gerät und Anschluss.";
					if (v.meter !== v.placement)
						return "Dieser Anschluss passt nicht zur Messaufgabe.";
					return v.meter === 1 ? "100 mA im Lampenzweig" : "6 V an der Lampe";
				},
			},
		],
		goals: [
			goal(
				"current",
				"Schließe das Amperemeter richtig für die Stromstärke an.",
				(v) => v.meter === 1 && v.placement === 1,
			),
			goal(
				"voltage",
				"Schließe das Voltmeter richtig für die Lampenspannung an.",
				(v) => v.meter === 2 && v.placement === 2,
			),
		],
	},
	parallel: {
		kind: "parallel",
		title: "Knotenregel im Modell zweier Zweige",
		intro:
			"Schließe die Zweige einzeln oder gemeinsam. Die Quelle hat 6 V und beide Lampen sind als gleiche Widerstände vereinfacht.",
		params: [
			select("left", "Zweig A", ["offen", "geschlossen"]),
			select("right", "Zweig B", ["offen", "geschlossen"]),
		],
		readouts: [
			{
				key: "a",
				label: "Strom in A",
				unit: "mA",
				digits: 0,
				compute: (v) => branchCurrents(v).left,
			},
			{
				key: "b",
				label: "Strom in B",
				unit: "mA",
				digits: 0,
				compute: (v) => branchCurrents(v).right,
			},
			{
				key: "total",
				label: "Strom vor dem Knoten",
				unit: "mA",
				digits: 0,
				compute: (v) => branchCurrents(v).total,
			},
		],
		goals: [
			goal(
				"first",
				"Lass nur in Zweig A Strom fließen.",
				(v) => !!v.left && !v.right,
			),
			goal(
				"second",
				"Lass nur in Zweig B Strom fließen.",
				(v) => !v.left && !!v.right,
			),
			goal(
				"total",
				"Erzeuge einen Gesamtstrom von 200 mA.",
				(v) => branchCurrents(v).total === 200,
			),
		],
	},
	resistance: {
		kind: "resistance",
		title: "Aus Messwerten den Widerstand bestimmen",
		intro:
			"Stelle ein Wertepaar an einer Messkarte ein. Die Grafik zeigt, wie viele Volt pro Ampere nötig sind. Gleicher Quotient bedeutet gleicher Widerstand.",
		params: [
			slider("voltage", "Spannung U", 2, 12, 4, "V", 2),
			slider("current", "Strom I", 50, 300, 50, "mA", 50),
		],
		readouts: [
			{
				key: "r",
				label: "Widerstand R",
				unit: "Ω",
				digits: 1,
				compute: (v) => ohmicResistance(v),
			},
		],
		goals: [
			goal(
				"forty",
				"Stelle 4 V und 100 mA ein. Lies den Widerstand ab.",
				(v) => v.voltage === 4 && v.current === 100,
			),
			goal(
				"same",
				"Verdopple beide Werte und vergleiche den Widerstand.",
				(v) => v.voltage === 8 && v.current === 200,
			),
			goal(
				"larger",
				"Stelle bei 8 V weniger Strom als zuletzt ein und erhalte 80 Ω.",
				(v) => v.voltage === 8 && v.current === 100,
			),
		],
	},
	wire: {
		kind: "wire",
		title: "Einen geeigneten Leiter auswählen",
		intro:
			"Vergleiche gleichartige Leitungen, indem du jeweils nur eine Größe änderst. Die Werte gelten näherungsweise für die angegebenen Metalle. Temperatur ist eine Vertiefung im M-Zug.",
		params: [
			slider("length", "Länge", 10, 30, 10, "m", 10),
			slider("area", "Querschnittsfläche", 1, 3, 1, "mm²"),
			select(
				"material",
				"Material",
				materials.map(({ name }) => name),
			),
			select("warm", "Temperatur (M7)", ["20 °C", "60 °C"]),
		],
		readouts: [
			{
				key: "r",
				label: "Widerstand",
				unit: "Ω",
				digits: 3,
				compute: (v) => exampleWire(v),
			},
		],
		goals: [
			goal(
				"length",
				"Verdopple nur die Leitungslänge der ersten Einstellung.",
				(v) => v.length === 20 && v.area === 1 && !v.material && !v.warm,
			),
			goal(
				"area",
				"Verdopple anschließend bei gleicher Länge die Querschnittsfläche.",
				(v) => v.length === 20 && v.area === 2 && !v.material && !v.warm,
			),
			goal(
				"material",
				"Tausche bei der gleichen Geometrie Kupfer gegen Aluminium.",
				(v) => v.length === 20 && v.area === 2 && v.material === 1 && !v.warm,
			),
		],
	},
	electricalSafety: {
		kind: "electrical-safety",
		title: "Gefahren erkennen und erklären",
		intro:
			"Untersuche Alltagsszenen. Ordne zu, ob die Gefahr vor allem durch fehlende Isolierung, einen unerwünschten Stromweg oder zu große Belastung entsteht.",
		params: [
			select(
				"case",
				"Situation",
				electricalCases.map(([label]) => label),
			),
		],
		readouts: [
			{
				key: "protection",
				label: "Sichere Entscheidung",
				compute: (v) => electricalCases[v.case][1],
			},
		],
		goals: [
			goal(
				"insulation",
				"Finde den Fall einer defekten Isolierung.",
				(v) => v.case === 1,
			),
			goal(
				"water",
				"Zeige einen möglichen Stromweg über Wasser.",
				(v) => v.case === 2,
			),
			goal(
				"heat",
				"Zeige die Gefahr der Überhitzung durch Überlastung.",
				(v) => v.case === 3,
			),
		],
	},
} satisfies Record<string, LabDefinition>;
