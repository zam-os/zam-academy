export type Level = 1 | 2;
export type Track = "R" | "M";
export type TrackFilter = Track | "all";
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
	language?: "de" | "en";
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
	goals: [WorkshopGoal, WorkshopGoal, WorkshopGoal];
}
export interface Diagram {
	title: string;
	tiles: { label: string; detail: string }[];
}
export interface Lesson {
	id: string;
	stage: string;
	title: string;
	skill: string;
	bindings: string[];
	tracks: Track[];
	paragraphs: string[];
	takeaway: string;
	material: string;
	materialLabel: string;
	materialLanguage: "de" | "en";
	sourceIds: string[];
	quiz: {
		optionLanguage: "de" | "en";
		question: string;
		answer: string;
		wrong: [string, string];
		explanation: string;
	};
	practice: Practice[];
	tasks: Record<Level, Task>;
	workshop: Workshop;
	listening?: boolean;
	listeningAccent?: "en-GB" | "en-US";
	speaking?: boolean;
	diagram?: Diagram;
}
