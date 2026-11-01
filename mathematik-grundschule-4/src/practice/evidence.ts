import {
	CONTENT_VERSION,
	REQUIRED_CORRECT,
	STEPS,
	taskFor,
	type Step,
	type Task,
} from "./tasks";
import { ulid } from "../id";
import {
	validCounts,
	digits,
	MAX_NUMBER,
	type Counts,
} from "../math/place-value";

export interface Attempt {
	id: string;
	key: string;
	family: string;
	goal: string;
	seed: number;
	at: number;
	outcome: boolean;
	helped: boolean;
	first: boolean;
	mode: "guided" | "entry" | "exit" | "later";
	version: number;
	example?: { prompt: string; model: Counts; answer: number };
}
export interface Practice {
	id: string;
	level: 1 | 2;
	seed: number;
	index: number;
	correct: number;
	requiredCorrect: number | null;
}
export interface Progress {
	schema: 1;
	version: number;
	seed: number;
	step: Step;
	workspace: Counts;
	undo: Counts[];
	attempts: Attempt[];
	helped: string[];
	rewards: string[];
	consumed: string[];
	completed: Record<string, number>;
	resting: boolean;
	startedAt: number;
	explained: boolean;
	practice?: Practice | null;
	later: { id: string; seed: number; index: number; at: number } | null;
}
export function fresh(now = Date.now()): Progress {
	return {
		schema: 1,
		version: CONTENT_VERSION,
		seed: crypto.getRandomValues(new Uint32Array(1))[0],
		step: "welcome",
		workspace: digits(0),
		undo: [],
		attempts: [],
		helped: [],
		rewards: [],
		consumed: [],
		completed: {},
		resting: false,
		startedAt: now,
		explained: false,
		practice: null,
		later: null,
	};
}

const ULID = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const object = (v: unknown): v is Record<string, unknown> =>
	!!v && typeof v === "object" && !Array.isArray(v);
const strings = (v: unknown): v is string[] =>
	Array.isArray(v) &&
	v.length <= 1000 &&
	v.every((x) => typeof x === "string" && x.length <= 160);
const stamp = (n: unknown): n is number =>
	Number.isSafeInteger(n) && Number(n) >= 0 && Number(n) <= 281474976710655;
const seed = (n: unknown): n is number =>
	Number.isSafeInteger(n) && Number(n) >= 0 && Number(n) <= 4294967295;

export function validProgress(v: unknown): v is Progress {
	if (
		!object(v) ||
		v.schema !== 1 ||
		(v.version !== 1 && v.version !== CONTENT_VERSION) ||
		!seed(v.seed) ||
		!STEPS.includes(v.step as Step) ||
		!validCounts(v.workspace) ||
		!stamp(v.startedAt) ||
		typeof v.resting !== "boolean" ||
		typeof v.explained !== "boolean"
	)
		return false;
	if (
		!Array.isArray(v.undo) ||
		v.undo.length > 100 ||
		!v.undo.every(validCounts) ||
		!strings(v.helped) ||
		!strings(v.rewards) ||
		!strings(v.consumed)
	)
		return false;
	if (
		!v.rewards.every((x) => x === "mission-a" || x === "mission-b") ||
		new Set(v.rewards).size !== v.rewards.length ||
		new Set(v.consumed).size !== v.consumed.length ||
		!v.consumed.every(
			(x) => x === "mission-b" && (v.rewards as string[]).includes(x),
		)
	)
		return false;
	if (
		!object(v.completed) ||
		!Object.entries(v.completed).every(
			([k, n]) => ["mission-a", "mission-b"].includes(k) && stamp(n),
		)
	)
		return false;
	const completed = v.completed;
	const rewards = v.rewards;
	if (
		rewards.some((key) => !Object.hasOwn(completed, key)) ||
		Object.keys(completed).some((key) => !new Set<string>(rewards).has(key))
	)
		return false;
	if (
		!Array.isArray(v.attempts) ||
		v.attempts.length > 2000 ||
		!v.attempts.every(
			(a) =>
				object(a) &&
				typeof a.id === "string" &&
				ULID.test(a.id) &&
				typeof a.key === "string" &&
				a.key.length <= 160 &&
				[
					"read",
					"build",
					"digit",
					"zero",
					"bundle",
					"exchange",
					"reason",
				].includes(String(a.family)) &&
				["G1", "G2", "G3", "G4"].includes(String(a.goal)) &&
				seed(a.seed) &&
				stamp(a.at) &&
				typeof a.outcome === "boolean" &&
				typeof a.helped === "boolean" &&
				typeof a.first === "boolean" &&
				["guided", "entry", "exit", "later"].includes(String(a.mode)) &&
				(a.version === 1 || a.version === CONTENT_VERSION) &&
				(a.example === undefined ||
					(object(a.example) &&
						typeof a.example.prompt === "string" &&
						a.example.prompt.length <= 2000 &&
						validCounts(a.example.model) &&
						stamp(a.example.answer) &&
						a.example.answer <= MAX_NUMBER)),
		)
	)
		return false;
	if (
		v.practice !== undefined &&
		v.practice !== null &&
		(!object(v.practice) ||
			typeof v.practice.id !== "string" ||
			!ULID.test(v.practice.id) ||
			(v.practice.level !== 1 && v.practice.level !== 2) ||
			!seed(v.practice.seed) ||
			!seed(v.practice.index) ||
			!seed(v.practice.correct) ||
			(v.practice.requiredCorrect !== null &&
				v.practice.requiredCorrect !== REQUIRED_CORRECT))
	)
		return false;
	return (
		v.later === null ||
		(object(v.later) &&
			typeof v.later.id === "string" &&
			ULID.test(v.later.id) &&
			seed(v.later.seed) &&
			Number.isInteger(v.later.index) &&
			Number(v.later.index) >= 0 &&
			Number(v.later.index) < 3 &&
			stamp(v.later.at))
	);
}

export function recordAttempt(
	p: Progress,
	task: Task,
	key: string,
	outcome: boolean,
	now: number,
	mode: Attempt["mode"],
): void {
	const first = !p.attempts.some((a) => a.key === key);
	const helped = p.helped.includes(key) || !first;
	p.attempts.push({
		id: ulid(now),
		key,
		family: task.family,
		goal: task.goal,
		seed: p.practice?.seed ?? p.later?.seed ?? p.seed,
		at: now,
		outcome,
		helped,
		first,
		mode,
		version: CONTENT_VERSION,
		example: {
			prompt:
				task.numeral === undefined
					? task.prompt
					: `${task.prompt} Zahl: ${task.numeral}; markierte Ziffer: ${digits(task.numeral)[task.column ?? 0]}.`,
			model: task.family === "build" ? digits(task.answer) : [...task.model],
			answer: task.answer,
		},
	});
	// Retain recent evidence, not an unbounded local activity log.
	p.attempts = p.attempts.slice(-2000);
}

export function grant(
	p: Progress,
	mission: "mission-a" | "mission-b",
	now: number,
): void {
	if (!p.rewards.includes(mission)) p.rewards.push(mission);
	p.completed[mission] ??= now;
}

export function nextStep(p: Progress): void {
	p.step = STEPS[Math.min(STEPS.indexOf(p.step) + 1, STEPS.length - 1)];
	p.workspace = taskFor(p.step, p.seed)?.model ?? digits(0);
	if (p.step === "practice-a" || p.step === "practice-b") {
		p.practice = newPractice(
			p.step === "practice-a" ? 1 : 2,
			p.seed,
			REQUIRED_CORRECT,
		);
	}
	p.undo = [];
}

export function independent(a: Attempt): boolean {
	return (
		a.version >= 2 &&
		a.first &&
		a.outcome &&
		!a.helped &&
		(a.mode === "exit" || a.mode === "later")
	);
}

export function laterEligible(p: Progress, now: number): boolean {
	const completed = p.completed["mission-b"];
	return (
		completed !== undefined && now >= completed && now - completed >= 86_400_000
	);
}

export function newPractice(
	level: 1 | 2,
	seed: number,
	requiredCorrect: number | null,
): Practice {
	return { id: ulid(), level, seed, index: 0, correct: 0, requiredCorrect };
}
/** Preserve draft rewards and logs, never promote old answer-revealing tasks to new evidence. */
export function normaliseProgress(raw: unknown): Progress | null {
	if (!validProgress(raw)) return null;
	const next = structuredClone(raw);
	if (next.version === 1) {
		next.workspace = taskFor(next.step, next.seed)?.model ?? digits(0);
		next.undo = [];
	}
	next.version = CONTENT_VERSION;
	next.practice ??= null;
	return next;
}

/** A build example describes the requested number, never its empty starting workspace. */
export function attemptExample(attempt: Attempt): Attempt["example"] {
	const example = attempt.example;
	if (!example) return undefined;
	return {
		...example,
		model:
			attempt.family === "build" ? digits(example.answer) : [...example.model],
	};
}
