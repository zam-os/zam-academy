export type StageId = "lb1" | "lb2" | "lb3" | "lb4" | "lb5" | "lb6";

export interface Stage {
	id: StageId;
	lb: 1 | 2 | 3 | 4 | 5 | 6;
	worldName: string;
	officialTitle: string;
	subtitle: string;
	icon: string;
	accentLight: string;
	accentDark: string;
	softLight: string;
	softDark: string;
	probenFocus: string;
	parentEverydayTip: string;
}

export interface LabOption {
	value: string;
	label: string;
}

export interface LabControl {
	key: string;
	label: string;
	options: ReadonlyArray<LabOption>;
}

export type LabState = Record<string, string>;

export interface LabGoal {
	id: string;
	title: string;
	check: (state: LabState) => boolean;
	witness: LabState;
}

export interface LabReadout {
	label: string;
	value: string;
}

export interface LabSpec {
	title: string;
	intro: string;
	controls: ReadonlyArray<LabControl>;
	initialState: LabState;
	goals: readonly [LabGoal, LabGoal, LabGoal];
	readouts: (state: LabState) => ReadonlyArray<LabReadout>;
}

export interface QuickCheck {
	question: string;
	options: readonly [string, string, string];
	correctIndex: 0 | 1 | 2;
	explanation: string;
}

export interface FactCard {
	icon: string;
	title: string;
	text: string;
}

export interface WorkedExample {
	title: string;
	scenario: string;
	steps: ReadonlyArray<string>;
	conclusion: string;
}

export interface ProbenTerm {
	term: string;
	definition: string;
}

export interface StampSpec {
	id: string;
	title: string;
	subtitle: string;
	symbol: string;
}

export interface Lesson {
	id: string;
	number: number;
	stageId: StageId;
	lb: 1 | 2 | 3 | 4 | 5 | 6;
	sectionCode: string;
	title: string;
	shortTitle: string;
	icon: string;
	hook: string;
	foundationNote: string;
	storyParagraphs: ReadonlyArray<string>;
	factCards: ReadonlyArray<FactCard>;
	workedExample: WorkedExample;
	merksatz: string;
	probenWissen: ReadonlyArray<ProbenTerm>;
	realWorldQuest: string;
	quickCheck: QuickCheck;
	lab: LabSpec;
	stamp: StampSpec;
}

export interface ChoiceTask {
	kind: "choice";
	id: string;
	lessonId: string;
	level: 1 | 2;
	contextTag: string;
	prompt: string;
	options: ReadonlyArray<string>;
	correctIndex: number;
	hint: string;
	explanation: string;
	mistakeHints: Readonly<Record<number, string>>;
}

export interface NumberTask {
	kind: "number";
	id: string;
	lessonId: string;
	level: 1 | 2;
	contextTag: string;
	prompt: string;
	expected: number;
	unit: string;
	tolerance?: number;
	placeholder: string;
	hint: string;
	explanation: string;
	diagnoseMistake?: (value: number) => string | null;
}

export type ExerciseTask = ChoiceTask | NumberTask;

export interface AttemptEvidence {
	at: string;
	lessonId: string;
	lessonTitle: string;
	stageId: StageId;
	level: 1 | 2;
	promptSummary: string;
	helped: boolean;
	correctFirstTry: boolean;
}

export interface LessonProgress {
	goalsReached: string[];
	quizSolved: boolean;
	level1Correct: number;
	level2Correct: number;
	stampEarnedAt: string | null;
}

export interface AppProgress {
	schema: 1;
	lessons: Record<string, LessonProgress>;
	recentEvidence: AttemptEvidence[];
	quietMode: boolean;
	soundEnabled: boolean;
}
