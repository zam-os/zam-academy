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
	hue: number;
	optional?: boolean;
}

export interface Practice {
	prompt: string;
	answers: string[];
	feedback: string;
}

export interface Task {
	language?: "de" | "la";
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

export interface DiagramNode {
	id: string;
	label: string;
	detail: string;
	explanation: string;
}

export interface Workshop {
	kind:
		| "concept"
		| "syllable"
		| "declension"
		| "numeral"
		| "verb"
		| "tense"
		| "irregular"
		| "aci"
		| "rome"
		| "italy"
		| "timeline"
		| "olympiers";
	diagramTitle?: string;
	diagramCaption?: string;
	nodes?: [DiagramNode, DiagramNode, DiagramNode];
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
	materialLanguage: "de" | "la";
	sourceIds: string[];
	quiz: {
		optionLanguage: "de" | "la";
		question: string;
		answer: string;
		wrong: [string, string];
		explanation: string;
	};
	takeaway: string;
	practice: Practice[];
	tasks: Record<Level, Task>;
	workshop: Workshop;
	aloud?: boolean;
}
