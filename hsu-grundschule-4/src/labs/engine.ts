import type { LabReadout, LabState, Lesson } from "../model/types";

export interface LabGoalResult {
	id: string;
	title: string;
	reached: boolean;
}

export interface LabEvaluation {
	state: LabState;
	readouts: ReadonlyArray<LabReadout>;
	goalResults: ReadonlyArray<LabGoalResult>;
	reachedGoalIds: ReadonlyArray<string>;
	allReached: boolean;
}

export function defaultLabState(lesson: Lesson): LabState {
	return { ...lesson.lab.initialState };
}

export function applyLabOption(
	lesson: Lesson,
	current: LabState,
	key: string,
	value: string,
): LabState {
	const control = lesson.lab.controls.find((c) => c.key === key);
	if (!control) return current;
	if (!control.options.some((opt) => opt.value === value)) return current;
	return { ...current, [key]: value };
}

export function evaluateLab(lesson: Lesson, state: LabState): LabEvaluation {
	const readouts = lesson.lab.readouts(state);
	const goalResults = lesson.lab.goals.map((goal) => ({
		id: goal.id,
		title: goal.title,
		reached: Boolean(goal.check(state)),
	}));
	const reachedGoalIds = goalResults
		.filter((goal) => goal.reached)
		.map((goal) => goal.id);
	return {
		state,
		readouts,
		goalResults,
		reachedGoalIds,
		allReached: goalResults.every((goal) => goal.reached),
	};
}
