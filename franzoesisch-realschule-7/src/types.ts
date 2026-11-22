export type Level = 1 | 2;
export interface Source {
	id: string;
	label: string;
	url: string;
}
export interface Stage {
	id: string;
	title: string;
	subtitle: string;
	icon: string;
	hue: number;
}
export interface Practice {
	prompt: string;
	answers: string[];
	feedback: string;
}
export interface Task {
	language?: "de" | "fr";
	prompt: string;
	model: string;
	criteria: [string, string, string];
}
export interface WorkshopGoal {
	label: string;
	before: string;
	after: string;
	options: [string, string, string];
	answer: string;
	explanation: string;
}
export interface Workshop {
	kind:
		| "sentence"
		| "dialogue"
		| "sequence"
		| "sound"
		| "number"
		| "family"
		| "map"
		| "clock"
		| "poster"
		| "scene"
		| "route"
		| "recipe"
		| "storyboard";
	goals: [WorkshopGoal, WorkshopGoal, WorkshopGoal];
}
/** Colour code shared by every explorer: gender, number and verb endings. */
export type Tone = "m" | "f" | "pl" | "v";
export interface ExplorerStep {
	label: string;
	icon: string;
	example: string;
	detail: string;
	tone?: Tone;
}
export interface Explorer {
	caption: string;
	steps: [ExplorerStep, ExplorerStep, ExplorerStep];
}
/** One present-tense table: [subject, stem, ending]; an empty ending marks an irregular form. */
export interface Conjugation {
	verb: string;
	meaning: string;
	rows: [string, string, string][];
	note: string;
}
export interface Lesson {
	id: string;
	stage: string;
	title: string;
	skill: string;
	bindings: string[];
	paragraphs: string[];
	material: string;
	materialLabel: string;
	materialLanguage: "de" | "fr";
	sourceIds: string[];
	quiz: {
		optionLanguage: "de" | "fr";
		question: string;
		answer: string;
		wrong: [string, string];
		explanation: string;
	};
	takeaway: string;
	practice: Practice[];
	tasks: Record<Level, Task>;
	workshop: Workshop;
	explorer?: Explorer;
	conjugation?: Conjugation[];
	listening?: boolean;
	speaking?: boolean;
}
