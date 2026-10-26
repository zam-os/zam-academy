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
}
export interface Case {
	prompt: string;
	options: string[];
	answer: string;
	feedback: string;
}
export interface Task {
	hints: [string, string];
	prompt: string;
	model: string;
	criteria: [string, string, string];
}
export interface Lesson {
	lab?: import("./labs").LabKind;
	id: string;
	stage: string;
	title: string;
	skill: string;
	bindings: string[];
	paragraphs: string[];
	material: string;
	materialLabel: string;
	sourceIds: string[];
	quiz: {
		question: string;
		answer: string;
		wrong: [string, string];
		explanation: string;
	};
	takeaway: string;
	cases: Case[];
	tasks: Record<Level, Task>;
	extension?: string;
}
