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
	language?: "de" | "en";
	prompt: string;
	model: string;
	criteria: [string, string, string];
}

export interface WorkshopGoal {
	label: string;
	answer: string;
	explanation: string;
}

export interface WorkshopPiece {
	id: string;
	label: string;
	note: string;
}

export type WorkshopVisual =
	| {
			kind: "map";
			id: "canada" | "wales" | "southwest" | "usa-expansion";
	  }
	| {
			kind: "scene";
			id:
				| "history-frieze"
				| "holiday-calendar"
				| "condition-scale"
				| "passive-flow"
				| "film-media";
	  }
	| {
			kind: "board" | "timeline" | "comparison";
			caption: string;
			language?: "de" | "en";
			pieces: WorkshopPiece[];
	  };

export interface Workshop {
	goals: [WorkshopGoal, WorkshopGoal, WorkshopGoal];
	visual: WorkshopVisual;
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
	materialLanguage: "de" | "en";
	sourceIds: string[];
	quiz: {
		optionLanguage: "de" | "en";
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
	accent?: "en-GB" | "en-US" | "en-CA";
	speaking?: boolean;
}
