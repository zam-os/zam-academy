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
	prompt: string;
	model: string;
	criteria: [string, string, string];
}
export interface Lesson {
	id: string;
	stage: string;
	title: string;
	skill: string;
	bindings: string[];
	optional?: boolean;
	paragraphs: string[];
	takeaway: string;
	material: string;
	materialLabel: string;
	materialLanguage: "de" | "en";
	sourceIds: string[];
	quiz: {
		question: string;
		answer: string;
		wrong: [string, string];
		explanation: string;
	};
	practice: Practice[];
	tasks: Record<Level, Task>;
	listening?: boolean;
	speaking?: boolean;
	graphic?: "survey" | "climate";
}
