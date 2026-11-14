import data from "./curriculum/investigations.json";
import type { LabState } from "./lab-model";
import type { LabKind } from "./model/types";
import { getParameter, parameterFor } from "./extended-models";

export interface Investigation {
	goal: string;
	prompt: string;
	options: [string, string, string];
	correct: number;
	hint: string;
	explanation: string;
}
export const INVESTIGATIONS = data as unknown as Record<
	LabKind,
	[Investigation, Investigation, Investigation]
>;
export const goalKey = (kind: LabKind, index: number): string =>
	`${kind}:${index}`;
export function usesModelControl(kind: LabKind, index: number): boolean {
	return (
		(index === 0 && !!parameterFor(kind)) ||
		((kind === "electrolysis" || kind === "particles") && index < 2) ||
		((kind === "anomaly" || kind === "hydro") && index === 0)
	);
}

/** Evaluate the learner's model, not whether they have opened an explanation. */
export function investigationMatches(
	kind: LabKind,
	state: LabState,
	index: number,
): boolean {
	const question = INVESTIGATIONS[kind][index];
	if (!question) return false;
	const parameter = parameterFor(kind);
	if (parameter && index === 0)
		return getParameter(kind, state) === parameter.target;
	if (kind === "electrolysis" && index === 0)
		return state.hydrogenCount === 2 && state.oxygenCount === 1;
	if (kind === "electrolysis" && index === 1)
		return state.hydrogenVolume === 20;
	if (kind === "anomaly" && index === 0) return state.densityTemperature === 4;
	if (kind === "hydro" && index === 0)
		return (
			state.energyOrder.length === 4 &&
			state.energyOrder.every((value, position) => value === position)
		);
	if (kind === "particles" && index === 0) return state.temperature === 0;
	if (kind === "particles" && index === 1) return state.temperature === 100;
	return state.answers[goalKey(kind, index)] === question.correct;
}
export function rememberGoals(kind: LabKind, state: LabState): void {
	const conditions = INVESTIGATIONS[kind].map((_, index) =>
		investigationMatches(kind, state, index),
	);
	conditions.forEach((met, index) => {
		const key = goalKey(kind, index);
		if (met && !state.goals.includes(key)) state.goals.push(key);
	});
}

export function answerInvestigation(
	kind: LabKind,
	state: LabState,
	index: number,
	answer: number,
): void {
	const question = INVESTIGATIONS[kind][index];
	if (
		!question ||
		usesModelControl(kind, index) ||
		!Number.isInteger(answer) ||
		answer < 0 ||
		answer >= question.options.length
	)
		return;
	state.answers[goalKey(kind, index)] = answer;
	rememberGoals(kind, state);
}

export type Quantity =
	| "hydrogenCount"
	| "oxygenCount"
	| "hydrogenVolume"
	| "densityTemperature";
const quantities: Record<
	Quantity,
	{ kind: LabKind; min: number; max: number; step: number }
> = {
	hydrogenCount: { kind: "electrolysis", min: 0, max: 4, step: 1 },
	oxygenCount: { kind: "electrolysis", min: 0, max: 3, step: 1 },
	hydrogenVolume: { kind: "electrolysis", min: 0, max: 40, step: 5 },
	densityTemperature: { kind: "anomaly", min: 0, max: 20, step: 1 },
};
export function setLabQuantity(
	kind: LabKind,
	state: LabState,
	key: Quantity,
	value: number,
): void {
	const definition = quantities[key];
	if (!definition || definition.kind !== kind || !Number.isFinite(value))
		return;
	state[key] = Math.max(
		definition.min,
		Math.min(
			definition.max,
			Math.round(value / definition.step) * definition.step,
		),
	);
	if (key === "hydrogenCount" || key === "oxygenCount") {
		state.customProducts = true;
		state.mode = "after";
	}
	rememberGoals(kind, state);
}
export function moveEnergy(
	state: LabState,
	index: number,
	delta: number,
): void {
	if (!Number.isInteger(index) || (delta !== -1 && delta !== 1)) return;
	const next = index + delta;
	if (index < 0 || index >= 4 || next < 0 || next >= 4) return;
	[state.energyOrder[index], state.energyOrder[next]] = [
		state.energyOrder[next],
		state.energyOrder[index],
	];
	rememberGoals("hydro", state);
}
export const ENERGY_STEPS = [
	"Lageenergie",
	"Bewegung des Wassers",
	"Mechanische Energie der Turbine",
	"Elektrische Energie",
];
