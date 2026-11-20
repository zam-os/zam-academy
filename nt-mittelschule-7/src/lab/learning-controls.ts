import type { ChoiceParam, LabGoal, RangeParam } from "../model/types";

export function select(
	key: string,
	label: string,
	options: readonly string[],
): ChoiceParam {
	return {
		key,
		label,
		type: "choice",
		value: 0,
		options: options.map((label, value) => ({ label, value })),
	};
}

export function slider(
	key: string,
	label: string,
	min: number,
	max: number,
	value: number,
	unit: string,
	step = 1,
): RangeParam {
	return { key, label, type: "range", min, max, step, value, unit };
}

export function goal(
	id: string,
	text: string,
	check: LabGoal["check"],
): LabGoal {
	return { id, text, check };
}
