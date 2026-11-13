import type { ModelKind } from "./model/types";

export interface ModelState {
	phase: number;
	water: boolean;
	air: boolean;
	warm: boolean;
	light: boolean;
	temperature: number;
	animal: "bird" | "lizard";
	leaves: boolean;
	alternative: boolean;
}
export const initialModelState = (): ModelState => ({
	phase: 0,
	water: false,
	air: true,
	warm: false,
	light: true,
	temperature: 20,
	animal: "bird",
	leaves: true,
	alternative: false,
});
export const MODEL_SCENARIOS: Record<
	ModelKind,
	{ id: string; title: string }[]
> = {
	flower: [
		{ id: "pollination", title: "Zeige Pollen auf der Narbe." },
		{ id: "fertilization", title: "Verfolge den Weg zur Befruchtung." },
		{ id: "fruit", title: "Zeige, welche Teile zu Samen und Frucht werden." },
	],
	germination: [
		{
			id: "dark",
			title: "Lass die Bohne unter geeigneten Bedingungen im Dunkeln keimen.",
		},
		{ id: "dry", title: "Prüfe bei geeigneter Wärme einen trockenen Ansatz." },
		{
			id: "air",
			title:
				"Prüfe einen feuchten, warmen Ansatz ohne ausreichende Luftzufuhr.",
		},
	],
	temperature: [
		{
			id: "bird-cold",
			title: "Untersuche eine Amsel bei höchstens 5 °C Außentemperatur.",
		},
		{
			id: "lizard-cold",
			title: "Vergleiche eine Eidechse bei höchstens 5 °C.",
		},
		{
			id: "lizard-warm",
			title: "Vergleiche die Eidechse bei mindestens 30 °C.",
		},
	],
	foodweb: [
		{
			id: "loss",
			title: "Verringere das Blattangebot ohne alternative Insektennahrung.",
		},
		{
			id: "alternative",
			title: "Prüfe zusätzlich eine alternative Insektennahrung.",
		},
		{
			id: "restore",
			title: "Stelle Blätter und alternative Nahrung gemeinsam bereit.",
		},
	],
};
/** Qualitative classroom rule, not a prediction of a real seed batch. */
export function germination(state: ModelState): {
	germinates: boolean;
	growsGreen: boolean;
} {
	const germinates = state.water && state.air && state.warm;
	return { germinates, growsGreen: germinates && state.light };
}
export function temperaturePattern(state: ModelState): string {
	if (state.animal === "bird")
		return state.temperature <= 5
			? "Die Amsel erzeugt Stoffwechselwärme. Aufgeplusterte Federn können Wärmeverlust begrenzen."
			: "Die Amsel hält ihre Körpertemperatur vergleichsweise stabil; bei Wärme muss sie Wärme abgeben.";
	return state.temperature <= 5
		? "Die Eidechse ist stark von der Umgebung abhängig; bei Kälte ist ihre Aktivität meist eingeschränkt."
		: "Die Eidechse kann äußere Wärme nutzen. Bei zu großer Hitze braucht sie kühlere Aufenthaltsorte.";
}
export function foodwebPattern(state: ModelState): string {
	if (state.leaves)
		return state.alternative
			? "Blätter und weitere Insektennahrung bieten mehrere Wege zur Meise. Ein Netz kann Ausweichmöglichkeiten zeigen."
			: "Blatt → Raupe → Meise → Sperber. Die Pfeile führen von der Nahrung zum Fresser.";
	return state.alternative
		? "Weniger Blätter können Raupen beeinträchtigen. Weitere Insekten bieten der Meise eine alternative Nahrungsquelle."
		: "Weniger Blätter können Raupen und damit die Nahrungsgrundlage der Meise beeinträchtigen. Eine genaue Bestandszahl folgt daraus nicht.";
}
export function matchingGoals(kind: ModelKind, state: ModelState): string[] {
	if (kind === "flower")
		return ["", "pollination", "fertilization", "fruit"][state.phase]
			? [["", "pollination", "fertilization", "fruit"][state.phase]]
			: [];
	if (kind === "germination") {
		if (!state.warm) return [];
		if (!state.water && state.air) return ["dry"];
		if (state.water && !state.air) return ["air"];
		if (germination(state).germinates && !state.light) return ["dark"];
		return [];
	}
	if (kind === "temperature") {
		if (state.temperature <= 5)
			return [state.animal === "bird" ? "bird-cold" : "lizard-cold"];
		return state.animal === "lizard" && state.temperature >= 30
			? ["lizard-warm"]
			: [];
	}
	if (!state.leaves) return [state.alternative ? "alternative" : "loss"];
	return state.alternative ? ["restore"] : [];
}
export function recordExploration(
	kind: ModelKind,
	explored: string[],
	state: ModelState,
): string[] {
	const allowed = new Set(MODEL_SCENARIOS[kind].map((goal) => goal.id));
	return [
		...new Set([
			...explored.filter((id) => allowed.has(id)),
			...matchingGoals(kind, state),
		]),
	];
}
export const modelReady = (kind: ModelKind, explored: string[]): boolean =>
	MODEL_SCENARIOS[kind].every((goal) => explored.includes(goal.id));
