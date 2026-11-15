export type Level = 1 | 2;
export type Track = "I";
export type ModelKind =
	| "measurement"
	| "motion"
	| "forces"
	| "spring"
	| "particles"
	| "friction"
	| "density"
	| "light"
	| "reflection"
	| "refraction"
	| "spectrum"
	| "lens"
	| "magnet"
	| "circuit";
export type CalculationKind =
	| "length"
	| "speed"
	| "spring"
	| "weight"
	| "volume"
	| "density";
export interface Source {
	id: string;
	label: string;
	url: string;
}
export interface Check {
	question: string;
	answer: string;
	wrong: [string, string];
	explanation: string;
}
export interface Workshop {
	kind: "timeline" | "classify";
	title: string;
	instruction: string;
	material?: string;
	materialLabel?: string;
	categories: string[];
	entries: Array<{ text: string; target: number; feedback: string }>;
	conclusion: string;
}
export interface WrittenTask {
	prompt: string;
	hints: [string, string];
	model: string;
	criteria: [string, string, string];
}
export interface Lesson {
	/** Stable when first published: every ZAM card cites this anchor. */
	id: string;
	lb: number;
	title: string;
	period: string;
	intro: string;
	tracks: Track[];
	paragraphs: string[];
	takeaway: string;
	sourceIds: string[];
	quiz: Check;
	workshop: Workshop;
	tasks: Record<Level, WrittenTask>;
	optional?: boolean;
	model?: ModelKind;
	calculation?: CalculationKind;
	illustration: ModelKind;
}
export interface Stage {
	lb: number;
	title: string;
	shortTitle: string;
	icon: string;
}
export interface ExerciseTask {
	prompt: string;
	formulaHint?: string;
	answer: number;
	unit: string;
	digits: number;
	tolerance?: number;
	absTolerance?: number;
	solutionHtml: string;
}
