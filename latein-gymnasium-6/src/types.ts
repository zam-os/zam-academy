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
	| "context-lex"
	| "wordfield"
	| "wordbuild"
	| "inscriptions"
	| "etymology"
	| "adj-third"
	| "demonstratives"
	| "idem-ipse"
	| "numerals1000"
	| "ire-stems"
	| "passiv"
	| "passiv-perf"
	| "konjunktiv"
	| "konj-plusq"
	| "ppa-forms"
	| "ppp-forms"
	| "praedikativum"
	| "kasus-erweitert"
	| "irrealis"
	| "ut-clauses"
	| "cum-clauses"
	| "passiv-aci"
	| "partizip"
	| "italy-map"
	| "vesuv-sites"
	| "plinius-letters"
	| "pompeii-art"
	| "greek-mind"
	| "republic-timeline"
	| "republic-organs"
	| "punic-wars"
	| "values-sacrifice"
	| "modern-echoes"
	| "myth-gallery"
	| "daedalus-wing"
	| "underworld-myth"
	| "trojan-cycle"
	| "odysseus-route"
	| "ovid-sources"
	| "pc-parse"
	| "trans-methods"
	| "error-check"
	| "study-plan"
	| "team-present";

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
	recitation?: boolean;
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
}
