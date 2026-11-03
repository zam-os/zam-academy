// Pure state machines behind the three Werkstatt kinds. The renderer in
// main.ts only displays a state and calls these functions; tests drive the
// same functions to prove every goal reachable and none reached at the start.
import type {
	Goal,
	MachineState,
	MachineWorkshop,
	Slot,
	SlotPuzzle,
	SlotState,
	SlotWorkshop,
	TrainState,
	TrainWorkshop,
	Workshop,
} from "../types";

export const isSlot = (part: string | Slot): part is Slot =>
	typeof part !== "string";

export const slotsOf = (puzzle: SlotPuzzle): Slot[] =>
	puzzle.parts.filter(isSlot);

/* ---------- slots: mark words, split syllables, set marks, fill gaps ---------- */

export function initialSlots(ws: SlotWorkshop): SlotState {
	const values: Record<string, string[]> = {};
	for (const puzzle of ws.puzzles)
		values[puzzle.id] = slotsOf(puzzle).map(() => "");
	return { values, pen: ws.pens[0]?.value ?? "" };
}

/** Tapping with the active pen sets it; tapping the same mark again clears it. */
export function tapSlot(
	ws: SlotWorkshop,
	state: SlotState,
	puzzleId: string,
	index: number,
	choice?: string,
): SlotState {
	const puzzle = ws.puzzles.find((p) => p.id === puzzleId);
	const slot = puzzle ? slotsOf(puzzle)[index] : undefined;
	if (!puzzle || !slot) return state;
	const current = state.values[puzzleId]?.[index] ?? "";
	let next: string;
	if (slot.options) {
		if (choice === undefined || !slot.options.includes(choice)) return state;
		next = current === choice ? "" : choice;
	} else {
		const pen = choice ?? state.pen;
		if (!ws.pens.some((p) => p.value === pen)) return state;
		next = current === pen ? "" : pen;
	}
	const row = [...(state.values[puzzleId] ?? [])];
	row[index] = next;
	return { ...state, values: { ...state.values, [puzzleId]: row } };
}

export const choosePen = (
	ws: SlotWorkshop,
	state: SlotState,
	pen: string,
): SlotState =>
	ws.pens.some((p) => p.value === pen) ? { ...state, pen } : state;

export function puzzleSolved(
	ws: SlotWorkshop,
	state: SlotState,
	puzzleId: string,
): boolean {
	const puzzle = ws.puzzles.find((p) => p.id === puzzleId);
	if (!puzzle) return false;
	const row = state.values[puzzleId] ?? [];
	return slotsOf(puzzle).every((slot, i) => (row[i] ?? "") === slot.answer);
}

/** The state in which every slot holds its expected value. */
export function solvedSlots(ws: SlotWorkshop, ids?: string[]): SlotState {
	const state = initialSlots(ws);
	for (const puzzle of ws.puzzles)
		if (!ids || ids.includes(puzzle.id))
			state.values[puzzle.id] = slotsOf(puzzle).map((s) => s.answer);
	return state;
}

/** Goal factory: one puzzle completely right. */
export const solveGoal = (
	ws: () => SlotWorkshop,
	puzzleId: string,
	label: string,
): Goal<SlotState> => ({
	id: puzzleId,
	label,
	reached: (state) => puzzleSolved(ws(), state, puzzleId),
});

/* ---------- train: Satzglieder as wagons ---------- */

export function initialTrain(ws: TrainWorkshop): TrainState {
	return settle(ws, { order: [...ws.order], end: ".", frontSeen: [], moves: 0 });
}

export function trainSentence(ws: TrainWorkshop, state: TrainState): string {
	const words = state.order.map((w, i) =>
		i === 0 ? ws.wagons[w].start : ws.wagons[w].mid,
	);
	return `${words.join(" ")}${state.end}`;
}

export const verbPosition = (ws: TrainWorkshop, state: TrainState): number =>
	state.order.findIndex((w) => ws.wagons[w].verb);

/** Aussagesatz: the verb wagon is the second wagon. */
export const isStatement = (ws: TrainWorkshop, state: TrainState): boolean =>
	state.end === "." && verbPosition(ws, state) === 1;

/** Entscheidungsfrage: the verb wagon leads and a question mark ends it. */
export const isQuestion = (ws: TrainWorkshop, state: TrainState): boolean =>
	state.end === "?" && verbPosition(ws, state) === 0;

function settle(ws: TrainWorkshop, state: TrainState): TrainState {
	if (!isStatement(ws, state)) return state;
	const front = state.order[0];
	return state.frontSeen.includes(front)
		? state
		: { ...state, frontSeen: [...state.frontSeen, front] };
}

/** Swap the wagon at `position` with its left (-1) or right (+1) neighbour. */
export function moveWagon(
	ws: TrainWorkshop,
	state: TrainState,
	position: number,
	direction: -1 | 1,
): TrainState {
	const target = position + direction;
	if (
		position < 0 ||
		position >= state.order.length ||
		target < 0 ||
		target >= state.order.length
	)
		return state;
	const order = [...state.order];
	[order[position], order[target]] = [order[target], order[position]];
	return settle(ws, { ...state, order, moves: state.moves + 1 });
}

/** Move a wagon straight to the front. */
export function wagonToFront(
	ws: TrainWorkshop,
	state: TrainState,
	position: number,
): TrainState {
	if (position <= 0 || position >= state.order.length) return state;
	const order = [...state.order];
	const [wagon] = order.splice(position, 1);
	order.unshift(wagon);
	return settle(ws, { ...state, order, moves: state.moves + 1 });
}

export const setEnd = (
	ws: TrainWorkshop,
	state: TrainState,
	end: "." | "?",
): TrainState => settle(ws, { ...state, end });

/* ---------- machine: change one setting, watch the word change ---------- */

export function initialMachine(ws: MachineWorkshop): MachineState {
	const view = ws.view(ws.initial);
	return { values: { ...ws.initial }, found: view.found ? [view.found] : [] };
}

export function setControl(
	ws: MachineWorkshop,
	state: MachineState,
	id: string,
	value: string,
): MachineState {
	const control = ws.controls.find((c) => c.id === id);
	if (!control || !control.options.includes(value)) return state;
	const values = { ...state.values, [id]: value };
	const view = ws.view(values);
	const found =
		view.found && !state.found.includes(view.found)
			? [...state.found, view.found]
			: state.found;
	return { values, found };
}

/* ---------- shared ---------- */

export type AnyState = SlotState | TrainState | MachineState;

export function initialState(ws: Workshop): AnyState {
	if (ws.kind === "slots") return initialSlots(ws);
	if (ws.kind === "train") return initialTrain(ws);
	return initialMachine(ws);
}

export function reachedGoals(ws: Workshop, state: AnyState): string[] {
	const goals = ws.goals as Goal<AnyState>[];
	return goals.filter((g) => g.reached(state)).map((g) => g.id);
}
