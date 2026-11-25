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

export type WorkshopKind =
	| "prosody"
	| "vocab-card"
	| "wordfield"
	| "wordbuild"
	| "inscription"
	| "etymology"
	| "declension"
	| "kng"
	| "pronoun"
	| "numerals"
	| "conjugation"
	| "irregulars"
	| "tense-timeline"
	| "perfekt"
	| "aspect"
	| "abfrage"
	| "syntax"
	| "cases"
	| "clauses"
	| "aci"
	| "rome-map"
	| "arch"
	| "compare-gr"
	| "values"
	| "tria-nomina"
	| "society-scale"
	| "school-kit"
	| "calendar"
	| "religion"
	| "pantheon"
	| "underworld"
	| "myth-heroes"
	| "timeline-rome"
	| "text-map"
	| "error-check"
	| "study-plan"
	| "team-roles";

export interface Workshop {
	kind: WorkshopKind;
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
	recitation?: boolean;
}
