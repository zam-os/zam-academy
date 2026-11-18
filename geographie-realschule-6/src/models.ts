import type { ModelKind } from "./model/types";

export const MODEL_SCENARIOS = {
	europa: [
		{ id: "relief", label: "Gebirge & Gewässer" },
		{ id: "west", label: "Nord- & Westeuropa" },
		{ id: "central", label: "Mittel- & Südeuropa" },
		{ id: "east", label: "Osteuropa & Übergang nach Asien" },
		{ id: "states", label: "Staaten suchen" },
	],
	klima: [
		{ id: "atlantic", label: "Atlantikküste" },
		{ id: "inland", label: "Binnenland" },
		{ id: "mediterranean", label: "Mittelmeerraum" },
	],
	abfluss: [
		{ id: "covered", label: "Boden mit Pflanzen" },
		{ id: "bare", label: "Offener Boden" },
		{ id: "sealed", label: "Asphalt" },
	],
	verkehr: [
		{ id: "rhine", label: "Wasserweg Rhein" },
		{ id: "freight", label: "Transit durch Deutschland" },
		{ id: "brenner", label: "Brenner: Pass & Bahn" },
		{ id: "air", label: "Flughafen München" },
	],
	zaehlung: [
		{ id: "morning", label: "Vor Schulbeginn" },
		{ id: "afternoon", label: "Nach Schulschluss" },
	],
	industrie: [
		{ id: "cars", label: "Fahrzeugindustrie" },
		{ id: "planes", label: "Luftfahrtindustrie" },
	],
	energie: [
		{ id: "sources", label: "Energiequellen" },
		{ id: "wind", label: "Viel Windstrom in Deutschland" },
		{ id: "water", label: "Strombedarf in Deutschland" },
	],
	verbrauch: [
		{ id: "old", label: "Lampe mit 60 W" },
		{ id: "efficient", label: "Lampe mit 10 W" },
	],
	tourismus: [
		{ id: "sea", label: "Küste" },
		{ id: "mountain", label: "Gebirge" },
		{ id: "city", label: "Stadt" },
	],
	kreta: [
		{ id: "overview", label: "Griechenland & Kreta" },
		{ id: "event", label: "Gemeldete Orte auf Kreta" },
	],
} satisfies Record<ModelKind, Array<{ id: string; label: string }>>;

export const fmt = (value: number): string =>
	new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 })
		.format(value)
		.replaceAll("-", "−");

export function modelReady(kind: ModelKind, visited: string[]): boolean {
	return MODEL_SCENARIOS[kind].every((scenario) =>
		visited.includes(scenario.id),
	);
}

export function recordExploration(
	kind: ModelKind,
	visited: string[],
	id: string,
): string[] {
	const allowed = new Set(MODEL_SCENARIOS[kind].map((scenario) => scenario.id));
	return [...new Set([...visited, id].filter((value) => allowed.has(value)))];
}

export const MONTHS = [
	"Jan",
	"Feb",
	"Mär",
	"Apr",
	"Mai",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Okt",
	"Nov",
	"Dez",
];
// Invented profiles chosen for recognizable patterns, with shared axes for fair comparison.
export const CLIMATE_PROFILES = {
	atlantic: {
		label: "Atlantikküste · etwa bei Irland",
		temperature: [5, 5, 7, 9, 12, 15, 18, 17, 15, 12, 8, 6],
		rain: [96, 80, 77, 65, 64, 64, 70, 79, 92, 108, 104, 103],
		note: "Das Meer mildert den Winter und bremst die Erwärmung im Sommer. In diesem Beispiel fällt in jedem Monat Niederschlag.",
	},
	inland: {
		label: "Binnenland · etwa im östlichen Mitteleuropa",
		temperature: [-4, -2, 3, 9, 15, 19, 22, 21, 16, 10, 4, -1],
		rain: [30, 35, 40, 43, 58, 75, 85, 70, 51, 42, 42, 37],
		note: "Kalter Winter, warmer Sommer und ein Niederschlagsmaximum im Sommer ergeben einen ausgeprägteren Jahresgang.",
	},
	mediterranean: {
		label: "Mittelmeerraum · etwa an Spaniens Mittelmeerküste",
		temperature: [9, 10, 12, 15, 18, 22, 26, 26, 23, 18, 13, 10],
		rain: [81, 72, 60, 50, 39, 20, 8, 13, 51, 90, 103, 88],
		note: "Viel Regen fällt im Herbst und Winter. Der Sommer ist warm und niederschlagsarm.",
	},
};

export function climateSummary(temperature: number[], rain: number[]) {
	return {
		range: Math.max(...temperature) - Math.min(...temperature),
		rain: rain.reduce((sum, value) => sum + value, 0),
	};
}

export const TRAFFIC_COUNTS = {
	morning: [18, 12, 2],
	afternoon: [15, 8, 3],
};

export const RUNOFF_CASES = {
	covered: {
		surface: "Pflanzendecke",
		soaks: "Viel Wasser versickert",
		outflow: "Langsamer, meist klarerer Abfluss",
		width: 3,
		note: "Pflanzen bremsen Wasser und schützen den Boden vor abgetragenen Teilchen.",
	},
	bare: {
		surface: "Offener Boden",
		soaks: "Ein Teil des Wassers versickert",
		outflow: "Schnellerer, oft trüber Abfluss",
		width: 7,
		note: "Regentropfen lösen Teilchen. Die Hangneigung begünstigt Abfluss und Bodenabtrag.",
	},
	sealed: {
		surface: "Asphalt",
		soaks: "Kaum Versickerung",
		outflow: "Viel schneller Oberflächenabfluss",
		width: 11,
		note: "Das Wasser gelangt rasch in tiefere Lagen. Von intaktem Asphalt wird dabei kaum Boden abgetragen.",
	},
};

export const energyKwh = (watts: number, hours: number): number =>
	(watts * hours) / 1000;
