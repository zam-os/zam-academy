import { measureFamily } from "./measurement";
import { isMeasure } from "./worlds";
import { isWorldLesson } from "./worlds";
import { validWorkshop } from "./workshop";
import { ulid } from "../id";
import {
	EXTRA_LESSON_IDS,
	type ExtraLessonId,
	type ForestLesson,
	forestLesson,
} from "./catalog";
import {
	combinationIdentity,
	combinationTuple,
	validCombinationChoice,
} from "./combinations";
import { isInvestigation, validInvestigationWork } from "./investigations";
import {
	type Answer,
	correctForest,
	type ForestTask,
	forestExit,
	forestLab,
	forestTask,
} from "./tasks";
import { emptyColumnWork } from "./written-addition";
import { isWrittenAlgorithm, validAlgorithmWork } from "./written-algorithms";
import {
	bundleValue,
	type SubtractionWork,
	validSubtractionWork,
} from "./written-subtraction";
export const FOREST_STAGES = [
	"welcome",
	"learn",
	"lab",
	"quiz",
	"practice-1",
	"transfer",
	"practice-2",
	"exit",
	"finished",
] as const;
export type ForestStage = (typeof FOREST_STAGES)[number];
export interface ForestAttempt {
	id: string;
	key: string;
	goal: 1 | 2 | 3;
	at: number;
	outcome: boolean;
	helped: boolean;
	first: boolean;
	mode: "guided" | "exit" | "later";
	signature: string;
	prompt: string;
	explanation: string;
}
export interface ForestProgress {
	schema: 1;
	lesson: ExtraLessonId;
	seed: number;
	startedAt: number;
	stage: ForestStage;
	index: number;
	position: number;
	selection: number[];
	columnWork?: string[];
	subtractionWork?: SubtractionWork | null;
	algorithmWork?: string[] | null;
	investigationWork?: string[] | null;
	modelWork?: number[] | null;
	combinationChoice?: number[] | null;
	labGoals: number[];
	quiz: boolean;
	solved: { 1: number; 2: number };
	attempts: ForestAttempt[];
	helped: string[];
	rewards: string[];
	consumed: string[];
	completed: Record<string, number>;
	resting: boolean;
	optional: 1 | 2 | null;
	round: number;
	recall: { seed: number; at: number; index: number } | null;
}
export function freshForest(
	lesson: ExtraLessonId,
	now = Date.now(),
): ForestProgress {
	return {
		schema: 1,
		lesson,
		seed: crypto.getRandomValues(new Uint32Array(1))[0],
		startedAt: now,
		stage: "welcome",
		index: 0,
		position: 0,
		selection: [],
		...(lesson === "schriftlich-addieren"
			? { columnWork: emptyColumnWork() }
			: {}),
		...(lesson === "schriftlich-subtrahieren" ? { subtractionWork: null } : {}),
		...(isWrittenAlgorithm(lesson) ? { algorithmWork: null } : {}),
		...(isInvestigation(lesson) || isWorldLesson(lesson)
			? { investigationWork: null }
			: {}),
		...(isWorldLesson(lesson) ? { modelWork: null } : {}),
		...(lesson === "systematisch-kombinieren"
			? { combinationChoice: null }
			: {}),
		labGoals: [],
		quiz: false,
		solved: { 1: 0, 2: 0 },
		attempts: [],
		helped: [],
		rewards: [],
		consumed: [],
		completed: {},
		resting: false,
		optional: null,
		round: 0,
		recall: null,
	};
}
const obj = (v: unknown): v is Record<string, unknown> =>
	!!v && typeof v === "object" && !Array.isArray(v);
const integer = (v: unknown, max = 1000000): v is number =>
	Number.isSafeInteger(v) && Number(v) >= 0 && Number(v) <= max;
const stamp = (v: unknown): v is number => integer(v, 281474976710655);
const array = (v: unknown, max: number): v is number[] =>
	Array.isArray(v) && v.length <= max && v.every((n) => integer(n));
const strings = (v: unknown): v is string[] =>
	Array.isArray(v) &&
	v.length <= 1000 &&
	v.every((s) => typeof s === "string" && s.length <= 200);
export function validForest(raw: unknown): raw is ForestProgress {
	if (
		!obj(raw) ||
		raw.schema !== 1 ||
		!EXTRA_LESSON_IDS.includes(raw.lesson as ExtraLessonId) ||
		!integer(raw.seed, 4294967295) ||
		!stamp(raw.startedAt) ||
		!FOREST_STAGES.includes(raw.stage as ForestStage) ||
		!integer(raw.index, 1000000) ||
		!integer(raw.position, 10) ||
		!array(
			raw.selection,
			raw.lesson === "systematisch-kombinieren" ? 36 : 10,
		) ||
		new Set(raw.selection).size !== raw.selection.length ||
		!array(raw.labGoals, 3) ||
		raw.labGoals.some((n) => n > 2) ||
		new Set(raw.labGoals).size !== raw.labGoals.length ||
		typeof raw.quiz !== "boolean" ||
		!obj(raw.solved) ||
		!integer(raw.solved[1], 3) ||
		!integer(raw.solved[2], 3) ||
		typeof raw.resting !== "boolean" ||
		!(raw.optional === null || raw.optional === 1 || raw.optional === 2) ||
		!integer(raw.round, 1000000)
	)
		return false;
	if (
		!strings(raw.helped) ||
		!strings(raw.rewards) ||
		!strings(raw.consumed) ||
		!obj(raw.completed)
	)
		return false;
	if (
		raw.lesson === "schriftlich-addieren" &&
		(!Array.isArray(raw.columnWork) ||
			raw.columnWork.length !== 13 ||
			!raw.columnWork.every(
				(n, i) =>
					typeof n === "string" && (i < 7 ? /^[0-9]?$/ : /^[01]?$/).test(n),
			))
	)
		return false;
	if (
		raw.lesson === "schriftlich-subtrahieren" &&
		raw.subtractionWork !== null &&
		!validSubtractionWork(raw.subtractionWork)
	)
		return false;
	const rewards = raw.rewards,
		consumed = raw.consumed,
		completed = raw.completed;
	if (
		!Object.entries(completed).every(
			([k, n]) => ["mission-a", "mission-b"].includes(k) && stamp(n),
		) ||
		rewards.some((k) => !["mission-a", "mission-b"].includes(k)) ||
		new Set(rewards).size !== rewards.length ||
		new Set(consumed).size !== consumed.length ||
		consumed.some((k) => k !== "mission-b" || !rewards.includes(k)) ||
		rewards.some((k) => !Object.hasOwn(completed, k)) ||
		Object.keys(completed).some((k) => !rewards.includes(k))
	)
		return false;
	if (rewards.includes("mission-a") && raw.solved[1] !== 3) return false;
	if (
		rewards.includes("mission-b") &&
		(raw.solved[1] !== 3 || raw.solved[2] !== 3 || raw.stage !== "finished")
	)
		return false;
	if (raw.optional !== null && raw.stage !== "finished") return false;
	if (
		(raw.stage === "lab" ||
			raw.stage === "exit" ||
			raw.stage === "practice-1" ||
			raw.stage === "practice-2") &&
		raw.index > 2
	)
		return false;
	if (
		["practice-1", "transfer", "practice-2", "exit", "finished"].includes(
			String(raw.stage),
		) &&
		(raw.labGoals.length !== 3 || !raw.quiz)
	)
		return false;
	if (
		raw.recall !== null &&
		(raw.stage !== "finished" ||
			raw.optional !== null ||
			!obj(raw.recall) ||
			!integer(raw.recall.seed, 4294967295) ||
			!stamp(raw.recall.at) ||
			!integer(raw.recall.index, 2))
	)
		return false;
	if (
		!Array.isArray(raw.attempts) ||
		raw.attempts.length > 2000 ||
		!raw.attempts.every(
			(a) =>
				obj(a) &&
				typeof a.id === "string" &&
				/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(a.id) &&
				typeof a.key === "string" &&
				a.key.length <= 200 &&
				typeof a.goal === "number" &&
				[1, 2, 3].includes(a.goal) &&
				stamp(a.at) &&
				typeof a.outcome === "boolean" &&
				typeof a.helped === "boolean" &&
				typeof a.first === "boolean" &&
				["guided", "exit", "later"].includes(String(a.mode)) &&
				["signature", "prompt", "explanation"].every(
					(k) => typeof a[k] === "string" && String(a[k]).length <= 4000,
				),
		)
	)
		return false;
	if (
		isWrittenAlgorithm(raw.lesson as ExtraLessonId) &&
		raw.algorithmWork !== null
	) {
		const task = activeForestTask(raw as unknown as ForestProgress);
		if (
			!task?.algorithm ||
			!validAlgorithmWork(raw.algorithmWork, task.algorithm)
		)
			return false;
	}
	if (
		(isInvestigation(String(raw.lesson)) ||
			isWorldLesson(String(raw.lesson))) &&
		raw.investigationWork !== null
	) {
		const task = activeForestTask(raw as unknown as ForestProgress);
		if (
			!task?.investigation ||
			!validInvestigationWork(raw.investigationWork, task.investigation)
		)
			return false;
	}
	if (isWorldLesson(String(raw.lesson)) && raw.modelWork != null) {
		const task = activeForestTask(raw as unknown as ForestProgress);
		if (!task?.model || !validWorkshop(raw.modelWork, task.model)) return false;
	}
	if (raw.lesson === "systematisch-kombinieren") {
		const task = activeForestTask(raw as unknown as ForestProgress);
		if (
			raw.combinationChoice !== null &&
			(!task?.combination ||
				!validCombinationChoice(raw.combinationChoice, task.combination))
		)
			return false;
		const model = task?.combination;
		if (
			raw.selection.length &&
			(!model || raw.selection.some((n) => !combinationTuple(model, n)))
		)
			return false;
	}
	if (raw.lesson === "schriftlich-subtrahieren" && raw.subtractionWork) {
		const task = activeForestTask(raw as unknown as ForestProgress);
		if (
			!task?.subtraction ||
			bundleValue((raw.subtractionWork as SubtractionWork).bundles) !==
				task.subtraction.a
		)
			return false;
	}
	return true;
}
export function forestKey(p: ForestProgress): string {
	return p.recall
		? `later/${p.recall.at}/${p.recall.index}`
		: `${p.stage}/${p.round}/${p.optional ?? 0}/${p.index}`;
}
export function forestQuizTask(quiz: ForestLesson["quiz"]): ForestTask {
	const correct = quiz.choices.flatMap((choice, i) =>
		choice.correct ? [i + 1] : [],
	);
	if (correct.length !== 1)
		throw new Error("A lesson quiz needs exactly one correct choice");
	return {
		kind: "choice",
		goal: quiz.goal,
		prompt: quiz.prompt,
		answer: correct[0],
		choices: quiz.choices.map((choice, i) => ({
			value: i + 1,
			label: choice.label,
		})),
		hint: "Lies die Erklärung noch einmal und prüfe das Beispiel.",
		explanation: quiz.explanation,
	};
}
export function activeForestTask(p: ForestProgress): ForestTask | null {
	if (p.recall) return forestExit(p.lesson, p.recall.seed, p.recall.index);
	if (p.optional) return forestTask(p.lesson, p.optional, p.seed, p.index);
	if (p.stage === "lab") return forestLab(p.lesson, p.index);
	if (p.stage === "quiz") {
		const quiz = forestLesson(p.lesson)?.quiz;
		return quiz ? forestQuizTask(quiz) : null;
	}
	if (p.stage === "practice-1" || p.stage === "practice-2")
		return forestTask(
			p.lesson,
			p.stage === "practice-1" ? 1 : 2,
			p.seed,
			p.index,
		);
	if (p.stage === "exit")
		return forestExit(p.lesson, (p.seed + 15485863) >>> 0, p.index);
	return null;
}
export function independentForest(a: ForestAttempt): boolean {
	return (
		a.first &&
		a.outcome &&
		!a.helped &&
		(a.mode === "exit" || a.mode === "later")
	);
}
// A displayed model or inverse operation has already exposed the same fact family.
// Wording, commuted factors and an inverse probe must not create fresh evidence.
function calculationFamily({
	a,
	b,
	op,
}: NonNullable<ForestTask["calculation"]>): (string | number)[] {
	if (op === ":" && a % b !== 0) return ["division-with-remainder", a, b];
	const multiplicative = op === "·" || op === ":";
	const parts = op === ":" ? [b, a / b] : op === "−" ? [b, a - b] : [a, b];
	return [
		multiplicative ? "multiplicative" : "additive",
		...parts.sort((x, y) => x - y),
	];
}
export function recordForest(
	p: ForestProgress,
	task: ForestTask,
	answer: Answer | null,
	now = Date.now(),
): boolean {
	if (answer === null) return false;
	const key = forestKey(p),
		signature = JSON.stringify(
			isMeasure(p.lesson)
				? ["measure", ...measureFamily(task)]
				: task.model
					? ["model", ...task.model.identity]
					: task.combination
						? ["combinations", combinationIdentity(task.combination)]
						: task.divisorTotal
							? ["divisors-1-to-10", task.divisorTotal]
							: task.investigation
								? ["investigation", ...task.investigation.identity]
								: task.calculation
									? calculationFamily(task.calculation)
									: [
											task.kind,
											task.prompt,
											task.kind === "order" || task.kind === "parts"
												? [...(task.numbers ?? [])].sort((a, b) => a - b)
												: task.numbers,
											task.line,
											task.whole,
											task.choices
												? [...task.choices].sort((a, b) => a.value - b.value)
												: undefined,
										],
		);
	const first = !p.attempts.some(
		(a) => a.key === key || a.signature === signature,
	);
	const outcome = correctForest(task, answer);
	p.attempts.push({
		id: ulid(now),
		key,
		goal: task.goal,
		at: now,
		outcome,
		first,
		helped: p.helped.includes(key) || !first,
		mode: p.recall
			? "later"
			: p.stage === "exit" && !p.optional
				? "exit"
				: "guided",
		signature,
		prompt: task.combination
			? `${task.prompt} Auswahlreihen: ${task.combination.axes.map((a) => `${a.label}: ${a.options.join(", ")}`).join("; ")}.`
			: task.investigation
				? `${task.prompt} ${task.investigation.caption}: ${task.investigation.headers.join(" / ")}; ${task.investigation.rows.map((row) => row.join(" / ")).join("; ")}.`
				: task.prompt,
		explanation: task.explanation,
	});
	p.attempts = p.attempts.slice(-2000);
	return outcome;
}
function grant(p: ForestProgress, key: string, now: number) {
	if (!p.rewards.includes(key)) p.rewards.push(key);
	p.completed[key] ??= now;
}
export function advanceForest(p: ForestProgress, now = Date.now()): boolean {
	const task = activeForestTask(p);
	if (task && !p.attempts.some((a) => a.key === forestKey(p) && a.outcome))
		return false;
	p.position = 0;
	p.selection = [];
	if (p.lesson === "schriftlich-addieren") p.columnWork = emptyColumnWork();
	if (p.lesson === "schriftlich-subtrahieren") p.subtractionWork = null;
	if (isWrittenAlgorithm(p.lesson)) p.algorithmWork = null;
	if (isInvestigation(p.lesson) || isWorldLesson(p.lesson))
		p.investigationWork = null;
	if (isWorldLesson(p.lesson)) p.modelWork = null;
	if (p.lesson === "systematisch-kombinieren") p.combinationChoice = null;
	if (p.recall) {
		if (p.recall.index === 2) p.recall = null;
		else p.recall.index++;
		return true;
	}
	if (p.optional) {
		p.index++;
		return true;
	}
	if (p.stage === "lab") {
		if (!p.labGoals.includes(p.index)) p.labGoals.push(p.index);
		if (p.index < 2) {
			p.index++;
			return true;
		}
	}
	if (p.stage === "quiz") p.quiz = true;
	if (p.stage === "practice-1" || p.stage === "practice-2") {
		const level = p.stage === "practice-1" ? 1 : 2;
		p.solved[level] = Math.min(3, p.solved[level] + 1);
		if (p.solved[level] < 3) {
			p.index++;
			return true;
		}
		if (level === 1) grant(p, "mission-a", now);
	}
	if (p.stage === "exit" && p.index < 2) {
		p.index++;
		return true;
	}
	if (p.stage === "finished") return false;
	p.stage = FOREST_STAGES[FOREST_STAGES.indexOf(p.stage) + 1];
	p.index = 0;
	if (p.stage === "finished") grant(p, "mission-b", now);
	return true;
}
export function startForestPractice(
	p: ForestProgress,
	level: 1 | 2,
	nextSeed: number,
): void {
	if (p.stage !== "finished" || p.recall) return;
	p.optional = level;
	p.round++;
	p.seed = nextSeed;
	p.index = 0;
	p.position = 0;
	p.selection = [];
	if (p.lesson === "schriftlich-addieren") p.columnWork = emptyColumnWork();
	if (p.lesson === "schriftlich-subtrahieren") p.subtractionWork = null;
	if (isWrittenAlgorithm(p.lesson)) p.algorithmWork = null;
	if (isInvestigation(p.lesson) || isWorldLesson(p.lesson))
		p.investigationWork = null;
	if (isWorldLesson(p.lesson)) p.modelWork = null;
	if (p.lesson === "systematisch-kombinieren") p.combinationChoice = null;
}
export function forestRecallEligible(
	p: ForestProgress,
	now = Date.now(),
): boolean {
	const done = p.completed["mission-b"];
	return done !== undefined && now >= done && now - done >= 86400000;
}
