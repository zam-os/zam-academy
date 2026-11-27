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

export type DiagramKind =
	| "paenultima-lab"
	| "verb-lab"
	| "gerundiv-lab"
	| "nci-lab"
	| "modus-lab"
	| "kaiserzeit-timeline"
	| "limes-map"
	| "recht-lab"
	| "philo-lab"
	| "morph-lab"
	| "myth-values"
	| "syntax-tree";

export interface DiagramNode {
	id: string;
	label: string;
	badge: string;
	detail: string;
	latin?: string;
}

export interface LessonDiagram {
	kind: DiagramKind;
	title: string;
	caption: string;
	preset?: string;
	parts?: [DiagramNode, DiagramNode, DiagramNode];
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

export interface Workshop {
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
	diagram: LessonDiagram;
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
}
