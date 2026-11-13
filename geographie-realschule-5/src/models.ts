import type { ModelKind } from "./model/types";

export interface ModelScenario {
	id: string;
	label: string;
}
export const MODEL_SCENARIOS: Record<ModelKind, ModelScenario[]> = {
	earth: [
		{ id: "june", label: "Juni · nördlicher Sommer" },
		{ id: "december", label: "Dezember · nördlicher Winter" },
	],
	world: [
		{ id: "munich", label: "München · Nord und Ost" },
		{ id: "quito", label: "Quito · nahe am Äquator" },
		{ id: "sydney", label: "Sydney · Süd und Ost" },
	],
	scale: [
		{ id: "detail", label: "1 : 25 000 vergleichen" },
		{ id: "overview", label: "1 : 50 000 vergleichen" },
	],
	relief: [
		{ id: "gentle", label: "Weiter Linienabstand" },
		{ id: "steep", label: "Enger Linienabstand" },
	],
	germany: [
		{ id: "berlin", label: "Berlin · Bundeshauptstadt" },
		{ id: "munich", label: "München · Oberbayern" },
		{ id: "ansbach", label: "Ansbach · Mittelfranken" },
	],
	thematic: [
		{ id: "settlement", label: "Karte 1 · ausgewählte Stadtregionen" },
		{ id: "agriculture", label: "Karte 2 · ausgewählte Agrarräume" },
	],
};
export const fmt = (n: number): string =>
	new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 })
		.format(n)
		.replace(/-/g, "−");
export function modelReady(kind: ModelKind, visited: string[]): boolean {
	return MODEL_SCENARIOS[kind].every((s) => visited.includes(s.id));
}
export function recordExploration(
	kind: ModelKind,
	visited: string[],
	id: string,
): string[] {
	const allowed = new Set(MODEL_SCENARIOS[kind].map((s) => s.id));
	return [...new Set([...visited, id].filter((value) => allowed.has(value)))];
}
/** Input is a measured paper length, not a physical SVG/screen length. */
export function realDistanceMeters(
	centimeters: number,
	denominator: number,
): number {
	if (
		!Number.isFinite(centimeters) ||
		!Number.isFinite(denominator) ||
		centimeters < 0 ||
		denominator <= 0
	)
		return 0;
	return (centimeters * denominator) / 100;
}
export const WORLD_PLACES = [
	{
		id: "munich",
		name: "München",
		lon: 11.5,
		lat: 48,
		note: "Ungefähr 48° Nord und 11,5° Ost.",
	},
	{
		id: "quito",
		name: "Quito",
		lon: -78.5,
		lat: -0.2,
		note: "Ungefähr 0,2° Süd und 78,5° West; nahe am Äquator.",
	},
	{
		id: "sydney",
		name: "Sydney",
		lon: 151.2,
		lat: -33.9,
		note: "Ungefähr 33,9° Süd und 151,2° Ost.",
	},
];
/** Approximate orientation coordinates; state and district boundaries are not drawn. */
export const CAPITALS = [
	["berlin", "Berlin", "Berlin · Bundeshauptstadt", 13.4, 52.5],
	["kiel", "Kiel", "Schleswig-Holstein", 10.1, 54.3],
	["hamburg", "Hamburg", "Hamburg", 10, 53.6],
	["bremen", "Bremen", "Bremen", 8.8, 53.1],
	["hannover", "Hannover", "Niedersachsen", 9.7, 52.4],
	["schwerin", "Schwerin", "Mecklenburg-Vorpommern", 11.4, 53.6],
	["potsdam", "Potsdam", "Brandenburg", 13.1, 52.4],
	["magdeburg", "Magdeburg", "Sachsen-Anhalt", 11.6, 52.1],
	["duesseldorf", "Düsseldorf", "Nordrhein-Westfalen", 6.8, 51.2],
	["erfurt", "Erfurt", "Thüringen", 11, 51],
	["dresden", "Dresden", "Sachsen", 13.7, 51.1],
	["wiesbaden", "Wiesbaden", "Hessen", 8.2, 50.1],
	["mainz", "Mainz", "Rheinland-Pfalz", 8.3, 50],
	["saarbruecken", "Saarbrücken", "Saarland", 7, 49.2],
	["stuttgart", "Stuttgart", "Baden-Württemberg", 9.2, 48.8],
	["munich", "München", "Bayern · Oberbayern", 11.6, 48.1],
	["landshut", "Landshut", "Niederbayern", 12.2, 48.5],
	["regensburg", "Regensburg", "Oberpfalz", 12.1, 49],
	["bayreuth", "Bayreuth", "Oberfranken", 11.6, 49.9],
	["ansbach", "Ansbach", "Mittelfranken", 10.6, 49.3],
	["wuerzburg", "Würzburg", "Unterfranken", 9.9, 49.8],
	["augsburg", "Augsburg", "Schwaben", 10.9, 48.4],
] as const;
export const THEMATIC_POINTS = {
	settlement: [
		{
			name: "Ruhrgebiet",
			lon: 7.2,
			lat: 51.5,
			meaning: "Beispiel einer verdichteten Stadtregion",
		},
		{
			name: "Berlin",
			lon: 13.4,
			lat: 52.5,
			meaning: "Beispiel einer großen Stadtregion",
		},
		{
			name: "München",
			lon: 11.6,
			lat: 48.1,
			meaning: "Beispiel einer großen Stadtregion",
		},
	],
	agriculture: [
		{
			name: "Magdeburger Börde",
			lon: 11.4,
			lat: 52,
			meaning: "Beispiel eines Ackerbauraums mit Lössböden",
		},
		{
			name: "Gäuboden",
			lon: 12.6,
			lat: 48.9,
			meaning: "Beispiel eines Ackerbauraums mit Lössböden",
		},
		{
			name: "Allgäu",
			lon: 10.3,
			lat: 47.8,
			meaning: "Beispiel eines durch Grünland geprägten Raums",
		},
	],
};
