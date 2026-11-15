import type { ModelKind } from "./model/types";
export interface ModelState {
	selected: string;
	values: Record<string, number>;
}
export interface Param {
	key: string;
	label: string;
	min: number;
	max: number;
	step: number;
	unit: string;
	options?: string[];
}
interface Scenario {
	id: string;
	label: string;
	values: Record<string, number>;
}
const p = (
	key: string,
	label: string,
	min: number,
	max: number,
	step = 1,
	unit = "",
): Param => ({ key, label, min, max, step, unit });
const choice = (key: string, label: string, options: string[]): Param => ({
	key,
	label,
	min: 0,
	max: options.length - 1,
	step: 1,
	unit: "",
	options,
});
const s = (
	id: string,
	label: string,
	values: Record<string, number>,
): Scenario => ({ id, label, values });
export const PARAMS: Record<ModelKind, Param[]> = {
	measurement: [
		p("start", "Anfangsmarke", 0, 4, 1, "cm"),
		p("length", "Länge des Körpers", 2, 8, 0.5, "cm"),
		p("step", "Kleinster Skalenabstand", 0.5, 1, 0.5, "cm"),
	],
	motion: [
		p("v", "Geschwindigkeit", 1, 5, 1, "m/s"),
		p("t", "Vergangene Zeit", 0, 10, 1, "s"),
	],
	forces: [
		choice("pair", "Betrachtete Kräfte", [
			"Gleichgewicht an einem Körper",
			"Wechselwirkung an zwei Körpern",
		]),
		p("force", "Betrag beider Kräfte", 1, 5, 1, "N"),
	],
	spring: [
		p("force", "Zugkraft", 0, 8, 0.5, "N"),
		p("d", "Federhärte", 1, 4, 0.5, "N/cm"),
	],
	particles: [
		choice("state", "Aggregatzustand", ["Fest", "Flüssig", "Gasförmig"]),
		p("phase", "Modellschritt", 0, 4),
	],
	friction: [
		choice("kind", "Kontaktbewegung", ["Haften", "Gleiten", "Rollen"]),
		choice("rough", "Unterlage", ["Glatt", "Rau"]),
	],
	density: [
		p("rho", "Dichte", 1, 8, 0.5, "g/cm³"),
		p("volume", "Volumen", 10, 50, 5, "cm³"),
	],
	light: [
		choice("mode", "Lichtsituation", [
			"Sehen",
			"Schatten",
			"Sonnenfinsternis",
			"Mondfinsternis",
		]),
		p("size", "Größe der Lichtquelle", 0, 2),
	],
	reflection: [
		p("angle", "Einfallswinkel zum Lot", 0, 70, 5, "°"),
		choice("rough", "Oberfläche", ["Ebener Spiegel", "Raue Fläche"]),
	],
	refraction: [
		p("angle", "Einfallswinkel zum Lot", 0, 70, 5, "°"),
		choice("out", "Lichtübergang", ["Luft → Wasser", "Wasser → Luft"]),
	],
	spectrum: [
		choice("white", "Einfallendes Licht", ["Rotes Licht", "Weißes Licht"]),
	],
	lens: [
		p("f", "Brennweite", 10, 20, 5, "cm"),
		p("g", "Gegenstandsweite", 5, 60, 5, "cm"),
	],
	magnet: [
		choice("reverse", "Polanordnung", ["Nordpol links", "Nordpol rechts"]),
		choice("shape", "Magnetform", ["Stabmagnet", "Hufeisenmagnet"]),
	],
	circuit: [
		choice("parallel", "Schaltung", ["Reihe", "Parallel"]),
		choice("a", "Schalter A", ["Offen", "Geschlossen"]),
		choice("b", "Schalter B", ["Offen", "Geschlossen"]),
		choice("insulator", "Verbindungsmaterial", [
			"Kupfer (Leiter)",
			"Kunststoff (Isolator)",
		]),
	],
};
export const MODEL_SCENARIOS: Record<ModelKind, Scenario[]> = {
	measurement: [
		s("zero", "An der Null beginnen", { start: 0, length: 4.5, step: 0.5 }),
		s("offset", "Nullmarke beschädigt", { start: 3, length: 4.5, step: 0.5 }),
		s("coarse", "Gröbere Skala", { start: 3, length: 4.5, step: 1 }),
	],
	motion: [
		s("slow", "Gleichförmig mit 2 m/s", { v: 2, t: 5 }),
		s("fast", "Gleichförmig mit 4 m/s", { v: 4, t: 5 }),
	],
	forces: [
		s("balance", "Gleichgewicht am Buch", { pair: 0, force: 3 }),
		s("interaction", "Wechselwirkung Buch ↔ Tisch", { pair: 1, force: 3 }),
	],
	spring: [
		s("small", "Eine Belastung", { force: 2, d: 2 }),
		s("double", "Doppelte Kraft", { force: 4, d: 2 }),
		s("limit", "Modellgrenze überschritten", { force: 7, d: 2 }),
	],
	particles: [
		s("solid", "Fest", { state: 0, phase: 0 }),
		s("liquid", "Flüssig", { state: 1, phase: 1 }),
		s("gas", "Gasförmig", { state: 2, phase: 2 }),
	],
	friction: [
		s("static", "Haften", { kind: 0, rough: 1 }),
		s("sliding", "Gleiten", { kind: 1, rough: 1 }),
		s("rolling", "Rollen", { kind: 2, rough: 1 }),
	],
	density: [
		s("light", "Stoff A · 20 cm³", { rho: 2.5, volume: 20 }),
		s("large", "Gleicher Stoff · größeres Volumen", { rho: 2.5, volume: 40 }),
		s("dense", "Stoff B · gleiches Volumen", { rho: 8, volume: 20 }),
	],
	light: [
		s("seeing", "Licht gelangt ins Auge", { mode: 0, size: 0 }),
		s("shadow", "Ausgedehnte Quelle", { mode: 1, size: 2 }),
		s("solar", "Sonnenfinsternis", { mode: 2, size: 0 }),
		s("lunar", "Mondfinsternis", { mode: 3, size: 0 }),
	],
	reflection: [
		s("mirror", "Gerichtete Reflexion", { angle: 35, rough: 0 }),
		s("diffuse", "Diffuse Reflexion", { angle: 35, rough: 1 }),
	],
	refraction: [
		s("enter", "Luft → Wasser", { angle: 35, out: 0 }),
		s("leave", "Wasser → Luft", { angle: 35, out: 1 }),
		s("total", "Totalreflexion", { angle: 55, out: 1 }),
	],
	spectrum: [
		s("white", "Weißes Licht", { white: 1 }),
		s("red", "Nur rotes Licht", { white: 0 }),
	],
	lens: [
		s("real", "Reelles Bild", { f: 15, g: 45 }),
		s("focus", "Gegenstand im Brennpunkt", { f: 15, g: 15 }),
		s("virtual", "Lupe · virtuelles Bild", { f: 15, g: 10 }),
	],
	magnet: [
		s("bar", "Stabmagnet", { reverse: 0, shape: 0 }),
		s("reversed", "Pole vertauschen", { reverse: 1, shape: 0 }),
		s("horseshoe", "Hufeisenmagnet", { reverse: 0, shape: 1 }),
	],
	circuit: [
		s("open", "Reihe · unterbrochen", {
			parallel: 0,
			a: 1,
			b: 0,
			insulator: 0,
		}),
		s("closed", "Reihe · geschlossen", {
			parallel: 0,
			a: 1,
			b: 1,
			insulator: 0,
		}),
		s("branch", "Parallel · ein Zweig offen", {
			parallel: 1,
			a: 1,
			b: 0,
			insulator: 0,
		}),
		s("insulated", "Kunststoff unterbricht", {
			parallel: 1,
			a: 1,
			b: 1,
			insulator: 1,
		}),
	],
};
export const initialModelState = (): ModelState => ({
	selected: "",
	values: {},
});
export const modelValues = (
	kind: ModelKind,
	state: ModelState,
): Record<string, number> => ({
	...MODEL_SCENARIOS[kind][0].values,
	...state.values,
});
export function applyScenario(
	kind: ModelKind,
	state: ModelState,
	id: string,
): ModelState {
	const scenario = MODEL_SCENARIOS[kind].find((x) => x.id === id);
	return scenario ? { selected: id, values: { ...scenario.values } } : state;
}
export function setModelValue(
	kind: ModelKind,
	state: ModelState,
	key: string,
	value: number,
): ModelState {
	const param = PARAMS[kind].find((x) => x.key === key);
	if (
		!param ||
		!Number.isFinite(value) ||
		value < param.min ||
		value > param.max ||
		Math.abs(
			(value - param.min) / param.step -
				Math.round((value - param.min) / param.step),
		) > 1e-7
	)
		return state;
	return {
		selected: "",
		values: { ...modelValues(kind, state), [key]: value },
	};
}
export const recordExploration = (
	kind: ModelKind,
	seen: string[],
	id: string,
): string[] => [
	...new Set(
		[...seen, id].filter((x) => MODEL_SCENARIOS[kind].some((s) => s.id === x)),
	),
];
export const modelReady = (kind: ModelKind, seen: string[]): boolean =>
	MODEL_SCENARIOS[kind].every((s) => seen.includes(s.id));
export const uniformMotion = (speed: number, time: number): number =>
	speed * time;
/** The particular teaching spring is only characterised up to 6 N. */
export const extension = (force: number, stiffness: number): number | null =>
	force <= 6 ? force / stiffness : null;
export const massOf = (density: number, volume: number): number =>
	density * volume;
/** Snell's law computes the geometry; the lesson remains qualitative. */
export function refractedAngle(
	angle: number,
	leavingWater: boolean,
): number | null {
	const sine =
		Math.sin((angle * Math.PI) / 180) * (leavingWater ? 4 / 3 : 3 / 4);
	return sine > 1 ? null : (Math.asin(sine) * 180) / Math.PI;
}
/** Thin-lens geometry, including the focal-plane singularity explicitly. */
export function lensImage(
	f: number,
	g: number,
): {
	b: number | null;
	scale: number | null;
	kind: "real" | "virtual" | "focus";
} {
	if (f === g) return { b: null, scale: null, kind: "focus" };
	const b = (f * g) / (g - f);
	return { b, scale: -b / g, kind: b > 0 ? "real" : "virtual" };
}
export function lampStates(
	parallel: boolean,
	a: boolean,
	b: boolean,
	insulator: boolean,
): [boolean, boolean] {
	if (insulator) return [false, false];
	return parallel ? [a, b] : [a && b, a && b];
}
