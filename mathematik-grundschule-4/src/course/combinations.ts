import { random } from "../practice/tasks";
import type { Answer, ForestTask } from "./tasks";

export interface CombinationAxis {
	label: string;
	options: string[];
}
export interface CombinationModel {
	axes: CombinationAxis[];
	// The first option on axis 0 can be paired only with the first on axis 1.
	restricted: boolean;
}
export function combinationTuples(model: CombinationModel): number[][] {
	return model.axes.reduce<number[][]>(
		(rows, axis) =>
			rows.flatMap((row) => axis.options.map((_, i) => [...row, i])),
		[[]],
	);
}
export const combinationCode = (tuple: readonly number[]): number =>
	tuple.reduce((n, i) => n * 10 + i + 1, 0);
export function combinationTuple(
	model: CombinationModel,
	code: number,
): number[] | undefined {
	return combinationTuples(model).find(
		(tuple) => combinationCode(tuple) === code,
	);
}
export const allowedCombination = (
	model: CombinationModel,
	tuple: readonly number[],
): boolean => !model.restricted || tuple[0] !== 0 || tuple[1] === 0;
export function combinationLabel(
	model: CombinationModel,
	tuple: readonly number[],
): string {
	return tuple.map((choice, i) => model.axes[i].options[choice]).join(" + ");
}
export function combinationIdentity(model: CombinationModel): string {
	// Axis/option presentation order must not manufacture fresh evidence.
	const assignments = combinationTuples(model)
		.filter((t) => allowedCombination(model, t))
		.map((t) =>
			t
				.map((n, i) => `${model.axes[i].label}:${model.axes[i].options[n]}`)
				.sort()
				.join("/"),
		);
	return JSON.stringify(assignments.sort());
}
export function validCombinationChoice(
	raw: unknown,
	model: CombinationModel,
): raw is number[] {
	return (
		Array.isArray(raw) &&
		raw.length === model.axes.length &&
		raw.every(
			(n, i) =>
				Number.isInteger(n) && n >= -1 && n < model.axes[i].options.length,
		)
	);
}
function make(model: CombinationModel, goal: 1 | 2 | 3): ForestTask {
	const tuples = combinationTuples(model),
		allowed = tuples.filter((t) => allowedCombination(model, t));
	const restriction = model.restricted
		? `Achtung: Die Auswahl „${model.axes[0].options[0]}“ darf nur mit der Auswahl „${model.axes[1].options[0]}“ zusammen gewählt werden. Alle anderen Auswahlen passen zusammen.`
		: "Jede Auswahl darf mit jeder anderen zusammen gewählt werden.";
	const counts = model.axes.map((a) => a.options.length),
		perFirst = counts.slice(1).reduce((p, n) => p * n, 1);
	const hint =
		"Halte die erste Auswahl fest und gehe die nächste Reihe vollständig durch. Bei drei Reihen hältst du auch die zweite Auswahl fest und wechselst zuerst nur die dritte. Dann gehst du geordnet weiter.";
	const totals = model.axes[0].options.map(
		(label, i) => `${label}: ${allowed.filter((t) => t[0] === i).length}`,
	);
	return {
		kind: "combinations",
		goal,
		combination: model,
		numbers: tuples.map(combinationCode),
		answer: allowed.map(combinationCode),
		prompt: `Wähle genau eine Möglichkeit aus jeder Reihe. Sammle alle erlaubten Zusammenstellungen, jede nur einmal. ${restriction}`,
		hint,
		explanation: `Es gibt ${allowed.length} erlaubte Zusammenstellungen. ${totals.join("; ")}. ${model.restricted ? "Zähle die erlaubten Fälle für jede erste Auswahl getrennt und addiere sie. Die Einschränkung gilt auch bei einer dritten Auswahl." : `Zu jeder ersten Auswahl gehören ${perFirst} Zusammenstellungen. ${counts.join(" · ")} = ${allowed.length}.`} Eine systematische Liste zeigt, dass nichts fehlt und nichts doppelt vorkommt.`,
	};
}
const contexts: CombinationAxis[][] = [
	[
		{
			label: "Becher",
			options: ["gelber Becher", "blauer Becher", "roter Becher"],
		},
		{ label: "Getränk", options: ["Wasser", "Apfelsaft", "Traubensaft"] },
		{ label: "Platz", options: ["am Baum", "am Teich"] },
	],
	[
		{ label: "Brot", options: ["Vollkornbrot", "Roggenbrot", "Weißbrot"] },
		{ label: "Belag", options: ["Käse", "Gurke", "Tomate"] },
		{ label: "Obst", options: ["Apfel", "Birne"] },
	],
	[
		{ label: "Kappe", options: ["grüne Kappe", "blaue Kappe", "rote Kappe"] },
		{ label: "Weg", options: ["Waldweg", "Seeweg", "Hügelweg"] },
		{ label: "Tasche", options: ["Stofftasche", "Rucksack"] },
	],
	[
		{ label: "Band", options: ["gelbes Band", "rotes Band", "blaues Band"] },
		{ label: "Anhänger", options: ["Stern", "Blatt", "Herz"] },
		{ label: "Schachtel", options: ["runde Schachtel", "eckige Schachtel"] },
	],
];
function generate(
	level: 1 | 2,
	seed: number,
	index: number,
	pool: CombinationAxis[][],
): ForestTask {
	const next = random(
		(seed + Math.imul(index + 1, 2654435761) + level * 65537) >>> 0,
	);
	const int = (lo: number, hi: number) =>
		lo + Math.floor(next() * (hi - lo + 1));
	const goal = ((index % 3) + 1) as 1 | 2 | 3;
	const context = pool[int(0, pool.length - 1)];
	const three = goal === 2 || (level === 2 && goal === 3);
	const axes = context.slice(0, three ? 3 : 2).map((a, i) => {
		const options = [...a.options];
		for (let j = options.length - 1; j > 0; j--) {
			const k = int(0, j);
			[options[j], options[k]] = [options[k], options[j]];
		}
		// No more than twelve cases: small enough for a child to enumerate.
		return {
			...a,
			options: options.slice(0, i === 0 || three ? 2 : int(2, 3)),
		};
	});
	if (level === 2 && goal === 1)
		axes[0] = { ...axes[0], options: [...context[0].options] };
	return make({ axes, restricted: goal === 3 }, goal);
}
export function combinationLab(index: number): ForestTask {
	// Teaching/quiz examples use other labels; these are not copied answers.
	const axes = [
		{ label: "Blume", options: ["Tulpe", "Rose"] },
		{ label: "Topf", options: ["Tontopf", "Holztopf", "Steintopf"] },
		{ label: "Schild", options: ["Sonne", "Mond"] },
	];
	const goal = ((index % 3) + 1) as 1 | 2 | 3;
	return make(
		{
			axes:
				goal === 2
					? [
							axes[0],
							{ ...axes[1], options: axes[1].options.slice(0, 2) },
							axes[2],
						]
					: axes.slice(0, 2),
			restricted: goal === 3,
		},
		goal,
	);
}
export const combinationTask = (
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask => generate(level, seed, index, contexts);
const exitContexts: CombinationAxis[][] = [
	[
		{ label: "Karte", options: ["Seekarte", "Waldkarte", "Bergkarte"] },
		{ label: "Marke", options: ["Fuchsmarke", "Hasenmarke", "Bärenmarke"] },
		{ label: "Umschlag", options: ["grüner Umschlag", "gelber Umschlag"] },
	],
	[
		{ label: "Schiff", options: ["Segelboot", "Ruderboot", "Dampfer"] },
		{ label: "Fahne", options: ["gelbe Fahne", "rote Fahne", "blaue Fahne"] },
		{ label: "Ziel", options: ["Nordinsel", "Südinsel"] },
	],
];
export const combinationExit = (seed: number, index: number): ForestTask =>
	generate(2, seed ^ 0x3c6ef372, index, exitContexts);
export function combinationMistake(
	model: CombinationModel,
	answer: Answer | null,
): string {
	if (!Array.isArray(answer) || answer.length === 0)
		return "Baue zuerst eine Zusammenstellung aus genau einer Auswahl pro Reihe und trage sie in deine Liste ein.";
	if (
		answer.some((code) => {
			const t = combinationTuple(model, code);
			return !t || !allowedCombination(model, t);
		})
	)
		return `Prüfe die Einschränkung: Die Auswahl „${model.axes[0].options[0]}“ darf nur mit der Auswahl „${model.axes[1].options[0]}“ zusammen vorkommen. Entferne unpassende Einträge.`;
	return "Es fehlen noch Möglichkeiten. Halte eine erste Auswahl fest und prüfe alle passenden Auswahlen der anderen Reihen. Gehe dann zur nächsten ersten Auswahl weiter.";
}
