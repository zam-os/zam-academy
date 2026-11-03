import type {
	ChoiceTask,
	ExerciseTask,
	NumberTask,
	QuickCheck,
} from "../model/types";

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

export interface PresentedQuickCheckOption {
	optionId: 0 | 1 | 2;
	text: string;
	isCorrect: boolean;
}

export function parseGermanNumber(raw: string): number | null {
	const trimmed = raw.trim();
	if (!trimmed) return null;

	// Strip optional trailing units and ordinal dots (e.g. "1,5 km", "1.500 m", "19. Jh.", "19 . Jahrhundert")
	// while keeping internal dots and commas untouched.
	let cleaned = trimmed
		.replace(/[a-zA-ZäöüÄÖÜß%°()²³/\s.]+$/u, "")
		.replace(/\u2212/g, "-")
		.replace(/\s+/g, "");
	if (!cleaned) return null;

	if (cleaned.includes(",")) {
		// Comma is the decimal separator; any dots must form 3-digit thousands groups.
		if (!/^-?(?:\d+|\d{1,3}(?:\.\d{3})+),\d+$/.test(cleaned)) {
			return null;
		}
		cleaned = cleaned.replace(/\./g, "").replace(",", ".");
	} else if (/^-?[1-9]\d{0,2}(?:\.\d{3})+$/.test(cleaned)) {
		// German thousands grouping without decimal fraction (e.g. "1.000", "1.500", "25.000").
		cleaned = cleaned.replace(/\./g, "");
	} else if (!/^-?\d+(?:\.\d+)?$/.test(cleaned)) {
		return null;
	}

	const num = Number(cleaned);
	return Number.isFinite(num) ? num : null;
}

export function buildQuickCheckOptions(
	quickCheck: QuickCheck,
	seed: number,
): ReadonlyArray<PresentedQuickCheckOption> {
	const items: PresentedQuickCheckOption[] = [
		{
			optionId: 0,
			text: quickCheck.options[0],
			isCorrect: quickCheck.correctIndex === 0,
		},
		{
			optionId: 1,
			text: quickCheck.options[1],
			isCorrect: quickCheck.correctIndex === 1,
		},
		{
			optionId: 2,
			text: quickCheck.options[2],
			isCorrect: quickCheck.correctIndex === 2,
		},
	];
	let state = seed >>> 0 || 0x9e3779b9;
	const nextRand = (): number => {
		state ^= state << 13;
		state ^= state >>> 17;
		state ^= state << 5;
		return (state >>> 0) / 0x100000000;
	};
	for (let i = items.length - 1; i > 0; i--) {
		const j = Math.floor(nextRand() * (i + 1));
		const tmp = items[i];
		items[i] = items[j];
		items[j] = tmp;
	}
	return items;
}

export function checkQuickCheckAnswer(
	quickCheck: QuickCheck,
	pickedOptionId: number,
): ChoiceCheckResult {
	const correct = pickedOptionId === quickCheck.correctIndex;
	return {
		correct,
		feedback: correct
			? `Super! ${quickCheck.explanation}`
			: "Fast! Überlege noch einmal mit Blick auf den Merksatz und probiere eine andere Antwort.",
	};
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
