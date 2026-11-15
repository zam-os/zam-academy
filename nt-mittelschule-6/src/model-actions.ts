import data from "./curriculum/model-actions.json";
import type { LabState } from "./lab-model";
import { rememberGoals } from "./investigations";
import type { LabKind } from "./model/types";

interface ActionText {
	goal: string;
	prompt: string;
	hint: string;
	explanation: string;
}
export type ModelAction = ActionText &
	(
		| { type: "order"; items: string[]; scene?: string }
		| {
				type: "labels";
				labels: string[];
				targets: {
					id: string;
					x: number;
					y: number;
					label: string;
					description?: string;
				}[];
				scene?: string;
				panels?: string[];
				hideLabels?: string[];
				template?: string;
		  }
		| {
				type: "network";
				nodes: { id: string; label: string; x: number; y: number }[];
				edges: [string, string][];
		  }
		| {
				type: "experiment";
				outcomes: string[];
				trials: { id: string; label: string; scene: string; outcome: string }[];
		  }
		| {
				type: "scenario";
				features: {
					id: string;
					label: string;
					initial: boolean;
					desired: boolean;
				}[];
		  }
		| { type: "molecule" }
		| ({
				type: "point";
				initial: { x: number; y: number };
		  } & (
				| {
						template: "force";
						region: {
							left: number;
							right: number;
							top: number;
							bottom: number;
						};
				  }
				| {
						template: "traffic";
						observer: { x: number; y: number };
						barrier: {
							left: number;
							right: number;
							top: number;
							bottom: number;
						};
				  }
		  ))
	);
export const MODEL_ACTIONS = data as unknown as Partial<
	Record<LabKind, ModelAction>
>;
export const actionFor = (kind: LabKind) => MODEL_ACTIONS[kind];
export interface ModelActionState {
	order: number[];
	labels: Record<string, string>;
	selectedLabel: string;
	edges: string[];
	selectedNode: string;
	counts: { H: number; O: number };
	point: { x: number; y: number };
	features: Record<string, boolean>;
	predictions: Record<string, string>;
	trials: Record<string, { prediction: string; outcome: string }>;
	activeTrial: string;
	submitted: boolean;
}
function initialAction(definition: ModelAction): ModelActionState {
	return {
		order:
			definition.type === "order"
				? definition.items.map((_, i) => (i + 1) % definition.items.length)
				: [],
		labels: {},
		selectedLabel: "",
		edges: [],
		selectedNode: "",
		counts: { H: 0, O: 0 },
		point:
			definition.type === "point"
				? { ...definition.initial }
				: { x: 300, y: 200 },
		features:
			definition.type === "scenario"
				? Object.fromEntries(definition.features.map((f) => [f.id, f.initial]))
				: {},
		predictions: {},
		trials: {},
		activeTrial: "",
		submitted: false,
	};
}
export function actionState(kind: LabKind, state: LabState): ModelActionState {
	return state.modelActions[kind] ?? initialAction(actionFor(kind)!);
}
export function actionCorrect(kind: LabKind, state: LabState): boolean {
	const def = actionFor(kind);
	if (!def) return false;
	const s = actionState(kind, state);
	switch (def.type) {
		case "order":
			return (
				s.order.length === def.items.length &&
				s.order.every((item, index) => item === index)
			);
		case "labels":
			return def.targets.every((t) => s.labels[t.id] === t.label);
		case "network":
			return (
				s.edges.length === def.edges.length &&
				def.edges.every(([from, to]) => s.edges.includes(`${from}->${to}`))
			);
		case "molecule":
			return s.counts.H === 2 && s.counts.O === 1;
		case "scenario":
			return def.features.every((f) => s.features[f.id] === f.desired);
		case "point": {
			if (def.template === "force")
				return (
					s.point.x >= def.region.left &&
					s.point.x <= def.region.right &&
					s.point.y >= def.region.top &&
					s.point.y <= def.region.bottom
				);
			// A point behind the vehicle is hidden if its sight line crosses the drawn body.
			// Check the actual ray, including the widening shadow near the vehicle's corners.
			if (s.point.x <= def.barrier.right) return false;
			const slope = (s.point.y - def.observer.y) / (s.point.x - def.observer.x);
			const nearY =
				def.observer.y + slope * (def.barrier.left - def.observer.x);
			const farY =
				def.observer.y + slope * (def.barrier.right - def.observer.x);
			return (
				Math.min(nearY, farY) <= def.barrier.bottom &&
				Math.max(nearY, farY) >= def.barrier.top
			);
		}
		case "experiment":
			return def.trials.every(
				(t) =>
					s.trials[t.id]?.prediction === t.outcome &&
					s.trials[t.id]?.outcome === t.outcome,
			);
	}
}
export function actionMatches(kind: LabKind, state: LabState): boolean {
	return (
		!!actionFor(kind) &&
		actionState(kind, state).submitted &&
		actionCorrect(kind, state)
	);
}
export type ModelCommand =
	| { type: "move"; index: number; delta: number }
	| { type: "select-label"; label: string }
	| { type: "place"; target: string }
	| { type: "node"; id: string }
	| { type: "atom"; element: "H" | "O"; delta: number }
	| { type: "feature"; id: string; checked: boolean }
	| { type: "predict"; trial: string; outcome: string }
	| { type: "run"; trial: string }
	| { type: "point"; x: number; y: number }
	| { type: "check" | "clear" };

/** A check submits a constructed model. Exploring views or guessing a quiz cannot submit it. */
export function applyModelAction(
	kind: LabKind,
	state: LabState,
	command: ModelCommand,
): boolean {
	const def = actionFor(kind);
	if (!def) return false;
	let s = state.modelActions[kind] ?? initialAction(def);
	let changed = true;
	switch (command.type) {
		case "move": {
			if (
				def.type !== "order" ||
				!Number.isInteger(command.index) ||
				![-1, 1].includes(command.delta)
			)
				return false;
			const next = command.index + command.delta;
			if (
				command.index < 0 ||
				command.index >= s.order.length ||
				next < 0 ||
				next >= s.order.length
			)
				return false;
			[s.order[command.index], s.order[next]] = [
				s.order[next],
				s.order[command.index],
			];
			break;
		}
		case "select-label":
			if (def.type !== "labels" || !def.labels.includes(command.label))
				return false;
			s.selectedLabel = command.label;
			changed = false;
			break;
		case "place":
			if (
				def.type !== "labels" ||
				!def.targets.some((t) => t.id === command.target) ||
				!def.labels.includes(s.selectedLabel)
			)
				return false;
			s.labels[command.target] = s.selectedLabel;
			break;
		case "node": {
			if (def.type !== "network" || !def.nodes.some((n) => n.id === command.id))
				return false;
			if (!s.selectedNode) {
				s.selectedNode = command.id;
				changed = false;
				break;
			}
			if (s.selectedNode === command.id) {
				s.selectedNode = "";
				changed = false;
				break;
			}
			const edge = `${s.selectedNode}->${command.id}`;
			s.edges = s.edges.includes(edge)
				? s.edges.filter((e) => e !== edge)
				: [...s.edges, edge];
			s.selectedNode = "";
			break;
		}
		case "atom": {
			if (
				def.type !== "molecule" ||
				!["H", "O"].includes(command.element) ||
				![-1, 1].includes(command.delta)
			)
				return false;
			s.counts[command.element] = Math.max(
				0,
				Math.min(
					command.element === "H" ? 4 : 3,
					s.counts[command.element] + command.delta,
				),
			);
			break;
		}
		case "feature":
			if (
				def.type !== "scenario" ||
				!def.features.some((f) => f.id === command.id) ||
				typeof command.checked !== "boolean"
			)
				return false;
			s.features[command.id] = command.checked;
			break;
		case "predict":
			if (
				def.type !== "experiment" ||
				!def.trials.some((t) => t.id === command.trial) ||
				(command.outcome !== "" && !def.outcomes.includes(command.outcome))
			)
				return false;
			s.predictions[command.trial] = command.outcome;
			delete s.trials[command.trial];
			if (s.activeTrial === command.trial) s.activeTrial = "";
			break;
		case "run": {
			if (def.type !== "experiment") return false;
			const trial = def.trials.find((t) => t.id === command.trial),
				prediction = s.predictions[command.trial];
			if (!trial || !def.outcomes.includes(prediction)) return false;
			s.trials[trial.id] = { prediction, outcome: trial.outcome };
			s.activeTrial = trial.id;
			break;
		}
		case "point":
			if (
				def.type !== "point" ||
				!Number.isFinite(command.x) ||
				!Number.isFinite(command.y)
			)
				return false;
			s.point = {
				x: Math.max(30, Math.min(570, command.x)),
				y: Math.max(30, Math.min(330, command.y)),
			};
			break;
		case "clear":
			s = initialAction(def);
			state.goals = state.goals.filter((key) => key !== `${kind}:0`);
			break;
		case "check":
			s.submitted = true;
			state.modelActions[kind] = s;
			rememberGoals(kind, state);
			return true;
	}
	if (changed) s.submitted = false;
	state.modelActions[kind] = s;
	return true;
}
