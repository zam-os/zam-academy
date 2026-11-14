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
	optional?: boolean;
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
		| "poster";
	goals: [WorkshopGoal, WorkshopGoal, WorkshopGoal];
}
export interface Lesson {
	id: string;
	stage: string;
	title: string;
	skill: string;
	bindings: string[];
	optional?: boolean;
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
	listening?: boolean;
	speaking?: boolean;
}
