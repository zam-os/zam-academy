export type Level = 1 | 2;

/** One place in the Wörterstadt; each has its own accent colour. */
export interface Stage {
	id: "werkstatt" | "bahnhof" | "detektiv" | "woerterschatz" | "lesewerkstatt";
	title: string;
	subtitle: string;
	icon: string;
	/** What Tinto says when the child arrives at this place. */
	greeting: string;
}

export interface Source {
	id: string;
	label: string;
	url: string;
}

/**
 * A generated practice task. `material` may mark the part the task is about
 * with [[double brackets]]; the app shows it underlined.
 */
export interface Task {
	prompt: string;
	material?: string;
	/** A text to read; shown as plain paragraphs above the question. */
	passage?: { title: string; paragraphs: string[] };
	/** A table or simple bar chart to read. */
	table?: { title: string; head: string[]; rows: string[][] };
	kind: "choice" | "text";
	/** Choice tasks: every option as shown. */
	options?: string[];
	/** Accepted answers. Text answers are compared case-sensitively. */
	accept: string[];
	/** Level 1 shows the hint at once, level 2 after a wrong try. */
	hint: string;
	/** Why the answer is right; shown after solving or revealing. */
	explanation: string;
	/** Targeted help for typical wrong answers (key: the wrong answer). */
	mistakes?: Record<string, string>;
	/** Identity of the underlying question, used to avoid repeats. */
	key: string;
}

export type Rng = () => number;
export type Generator = (rng: Rng) => Task;

export interface Goal<S> {
	id: string;
	label: string;
	reached: (state: S) => boolean;
}

/* ---------- Werkstatt engines ---------- */

/** A slot is something the child changes: a word to mark, a gap to fill. */
export interface Slot {
	/** Shown token for marking (a word or a Satzglied). */
	text?: string;
	/** Own small option buttons (gap filling); otherwise the pens apply. */
	options?: string[];
	/** Expected value; "" means: leave empty / unmarked. */
	answer: string;
}

export type Part = string | Slot;

export interface SlotPuzzle {
	id: string;
	label?: string;
	/** Optional help behind Tinto's magnifying glass. */
	help?: string;
	parts: Part[];
}

export interface Pen {
	value: string;
	label: string;
	/** Colour name from the stylesheet palette. */
	colour: "blue" | "red" | "green" | "purple" | "orange" | "teal" | "ink";
}

export interface SlotState {
	values: Record<string, string[]>;
	pen: string;
}

export interface SlotWorkshop {
	kind: "slots";
	/** mark: tap words · letters: tap gaps between letters · punct: put marks into gaps · gap: choose letters */
	variant: "mark" | "letters" | "punct" | "gap";
	title: string;
	intro: string;
	pens: Pen[];
	puzzles: SlotPuzzle[];
	goals: [Goal<SlotState>, Goal<SlotState>, Goal<SlotState>];
}

export interface Wagon {
	/** Text inside the sentence. */
	mid: string;
	/** Text at the start of the sentence (capital letter). */
	start: string;
	/** The finite verb: the locomotive's partner, Prädikat. */
	verb?: boolean;
}

export interface TrainState {
	order: number[];
	end: "." | "?";
	/** Wagons that already stood at the front of a correct sentence. */
	frontSeen: number[];
	moves: number;
}

export interface TrainWorkshop {
	kind: "train";
	title: string;
	intro: string;
	wagons: Wagon[];
	/** Initial arrangement. */
	order: number[];
	goals: [Goal<TrainState>, Goal<TrainState>, Goal<TrainState>];
}

export interface Control {
	id: string;
	label: string;
	options: string[];
}

export interface MachineView {
	/** Big result line. */
	display: string;
	/** Short explanation below. */
	note: string;
	/** Present when the setting produced something collectable (e.g. a real word). */
	found?: string;
	/** Visual tone of the result. */
	tone?: "ok" | "miss";
}

export interface MachineState {
	values: Record<string, string>;
	found: string[];
}

export interface MachineWorkshop {
	kind: "machine";
	title: string;
	intro: string;
	controls: Control[];
	initial: Record<string, string>;
	view: (values: Record<string, string>) => MachineView;
	goals: [Goal<MachineState>, Goal<MachineState>, Goal<MachineState>];
}

export type Workshop = SlotWorkshop | TrainWorkshop | MachineWorkshop;

export interface Term {
	term: string;
	meaning: string;
}

export interface Lesson {
	id: string;
	stage: Stage["id"];
	title: string;
	/** One line: what the child can do afterwards. */
	skill: string;
	/** Official reference, e.g. "D3/4 4.3 · Wortarten". */
	lehrplan: string;
	/** Positions in coverage.json, e.g. "4.3-06". */
	bindings: string[];
	/** Sticker the child earns for Tinto's album. */
	sticker: { emoji: string; name: string };
	/** Plain-text explanation, short sentences. */
	paragraphs: string[];
	example: { title: string; lines: string[] };
	takeaway: string;
	terms: Term[];
	/** Optional word list shown in the lesson, with its source. */
	wordbook?: { groups: { title: string; words: string }[]; note: string };
	/** The quick check reuses the lesson's first tier-1 card from cell.json. */
	check: { wrong: string; explanation: string };
	workshop: Workshop;
	generators: Record<Level, Generator[]>;
	requiredCorrect: number;
}

export interface Quiz {
	question: string;
	answer: string;
	wrong: [string, string];
	explanation: string;
}

export type ReadyLesson = Lesson & { quiz: Quiz };
