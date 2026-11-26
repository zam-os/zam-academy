export type Level = 1 | 2;

export interface Source {
	id: string;
	label: string;
	url: string;
}

export type StageIconId =
	| "nomina"
	| "passiv"
	| "partizip"
	| "konjunktiv"
	| "wortschatz"
	| "imperium"
	| "respublica"
	| "mythos";

export interface Stage {
	id: StageIconId;
	title: string;
	subtitle: string;
	lehrplan: string;
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

export interface ExplorerPart {
	tag: string;
	title: string;
	formula: string;
	note: string;
}

export interface ExplorerDiagram {
	title: string;
	subtitle: string;
	layout: "triptych" | "flow" | "contrast" | "hierarchy";
	parts: [ExplorerPart, ExplorerPart, ExplorerPart];
}

export type LiveModelKind =
	| "numeral"
	| "passive"
	| "timeline"
	| "consecutio"
	| "paenultima"
	| "mediterranean"
	| "epochs"
	| "cursus";

export interface Workshop {
	kind:
		| "forms"
		| "syntax"
		| "participle"
		| "mood"
		| "vocab"
		| "map"
		| "history"
		| "myth";
	liveModel?: LiveModelKind;
	goals: [WorkshopGoal, WorkshopGoal, WorkshopGoal];
}

export interface Lesson {
	id: string;
	stage: StageIconId;
	title: string;
	skill: string;
	lehrplan: string;
	bindings: string[];
	optional?: boolean;
	paragraphs: string[];
	diagram: ExplorerDiagram;
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
	readingAloud?: boolean;
}
