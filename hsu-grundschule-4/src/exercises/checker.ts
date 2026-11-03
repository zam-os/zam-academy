import type { ChoiceTask, ExerciseTask, NumberTask } from "../model/types";

export interface ChoiceCheckResult {
	correct: boolean;
	feedback: string;
}

export interface NumberCheckResult {
	validInput: boolean;
	correct: boolean;
	parsedValue: number | null;
	feedback: string;
}

export function parseGermanNumber(raw: string): number | null {
	const trimmed = raw.trim();
	if (!trimmed) return null;

	// Strip optional trailing units (e.g. "1,5 km", "19. Jh.", "0 (Kennziffer)") while keeping decimal points.
	let cleaned = trimmed.replace(/[a-zA-ZäöüÄÖÜß%°()/\s.]+$/u, (suffix) => {
		// Preserve nothing if it's purely unit text, spaces, or an ordinal trailing dot.
		return suffix ? "" : suffix;
	});

	cleaned = cleaned
		.replace(/\u2212/g, "-")
		.replace(/\s+/g, "")
		.replace(",", ".");

	if (!/^-?\d+(\.\d+)?$/.test(cleaned)) {
		return null;
	}

	const num = Number(cleaned);
	return Number.isFinite(num) ? num : null;
}

export function checkChoiceTask(
	task: ChoiceTask,
	selectedIndex: number,
): ChoiceCheckResult {
	if (selectedIndex === task.correctIndex) {
		return {
			correct: true,
			feedback: task.explanation,
		};
	}
	const targeted = task.mistakeHints[selectedIndex];
	return {
		correct: false,
		feedback: targeted ?? task.hint,
	};
}

export function checkNumberTask(
	task: NumberTask,
	rawInput: string,
): NumberCheckResult {
	const parsed = parseGermanNumber(rawInput);
	if (parsed === null) {
		return {
			validInput: false,
			correct: false,
			parsedValue: null,
			feedback: "Bitte gib eine Zahl ein (zum Beispiel 12 oder 1,5).",
		};
	}
	const tolerance = task.tolerance ?? 1e-6;
	if (Math.abs(parsed - task.expected) <= tolerance) {
		return {
			validInput: true,
			correct: true,
			parsedValue: parsed,
			feedback: task.explanation,
		};
	}
	const diagnosis = task.diagnoseMistake?.(parsed) ?? null;
	return {
		validInput: true,
		correct: false,
		parsedValue: parsed,
		feedback: diagnosis ?? task.hint,
	};
}

export function isNumberTask(task: ExerciseTask): task is NumberTask {
	return task.kind === "number";
}
