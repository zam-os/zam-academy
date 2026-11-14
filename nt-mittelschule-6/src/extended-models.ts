import data from "./curriculum/extended-models.json";
import type { LabDefinition, LabState } from "./lab-model";
import { fmtDe } from "./lab-model";
import { rememberGoals } from "./investigations";
import type { ExtendedKind, LabKind } from "./model/types";

export interface ModelParameter {
	label: string;
	min: number;
	max: number;
	step: number;
	initial: number;
	target: number;
	unit: string;
}
export const EXTENDED_LABS = data as unknown as Record<
	ExtendedKind,
	LabDefinition & { control?: ModelParameter }
>;
export function parameterFor(kind: LabKind): ModelParameter | undefined {
	return EXTENDED_LABS[kind as ExtendedKind]?.control;
}
export function getParameter(kind: LabKind, state: LabState): number {
	const definition = parameterFor(kind);
	if (!definition) return 0;
	const value = state.parameters[kind];
	return Number.isFinite(value)
		? Math.max(definition.min, Math.min(definition.max, value))
		: definition.initial;
}
export function setParameter(
	kind: LabKind,
	state: LabState,
	value: number,
): void {
	const definition = parameterFor(kind);
	if (!definition || !Number.isFinite(value)) return;
	state.parameters[kind] = Math.max(
		definition.min,
		Math.min(
			definition.max,
			definition.min +
				Math.round((value - definition.min) / definition.step) *
					definition.step,
		),
	);
	// Numerical proposals are shown in their corresponding measurement scene.
	state.mode = EXTENDED_LABS[kind as ExtendedKind].choices[0].id;
	rememberGoals(kind, state);
}

/** All numerical readouts share these explicit, bounded school-model assumptions. */
export function modelReadings(
	kind: LabKind,
	state: LabState,
): Record<string, number> {
	const p = getParameter(kind, state);
	switch (kind) {
		case "microscope":
			return { focus: p, blur: Math.abs(p - 5) * 0.7 };
		case "forceMeter":
			return { force: p, extension: 2 * p };
		case "work":
			return { force: 20, distance: p, work: 20 * p };
		case "lever":
			return { load: 6, loadArm: 20, effortArm: p, effort: 120 / p };
		case "machines":
			return { load: 60, height: 1, length: p, effort: 60 / p, work: 60 };
		case "speed":
			return { distance: 60, time: p, speed: 60 / p, kmh: 216 / p };
		case "motionGraph":
			return { speed: p, distance: 8 * p };
		case "stopping":
			return {
				speed: p,
				reaction: (p / 10) * 3,
				braking: (p / 10) ** 2,
				total: (p / 10) * 3 + (p / 10) ** 2,
			};
		default:
			return {};
	}
}
export function modelReadout(kind: LabKind, state: LabState): string {
	const r = modelReadings(kind, state),
		f = (n: number) => fmtDe(n, Number.isInteger(n) ? 0 : 2);
	switch (kind) {
		case "microscope":
			return r.focus === 5
				? "Modellfokus scharf · echte Sichtbarkeit bleibt vom Präparat abhängig."
				: "Modellfokus unscharf · vergleiche die Zellgrenzen.";
		case "forceMeter":
			return `${f(r.force)} N → ${f(r.extension)} cm Dehnung · Modellfeder`;
		case "work":
			return `${f(r.force)} N · ${f(r.distance)} m = ${f(r.work)} J · ideale Hubarbeit`;
		case "lever":
			return `Last: 6 N an 20 cm · Kraft: ${f(r.effort)} N an ${f(r.effortArm)} cm · ideal`;
		case "machines":
			return `60 N Last · 1 m Höhe · ${f(r.length)} m Rampe → ${f(r.effort)} N · ideal 60 J`;
		case "speed":
			return `60 m : ${f(r.time)} s = ${f(r.speed)} m/s = ${f(r.kmh)} km/h`;
		case "motionGraph":
			return `${f(r.speed)} m/s · nach 8 s: ${f(r.distance)} m`;
		case "stopping":
			return `${f(r.reaction)} m Reaktion + ${f(r.braking)} m Bremsen = ${f(r.total)} m · überschlägig`;
		default:
			return "";
	}
}
