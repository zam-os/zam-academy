import { CONTENT_VERSION, STEPS, taskFor, type Step, type Task } from "./tasks";
import { ulid } from "../id";
import { validCounts, type Counts } from "../math/place-value";

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
	later: { id: string; seed: number; index: number; at: number } | null;
}
export function fresh(now = Date.now()): Progress {
	return {
		schema: 1,
		version: CONTENT_VERSION,
		seed: crypto.getRandomValues(new Uint32Array(1))[0],
		step: "welcome",
		workspace: [0, 0, 0, 0],
		undo: [],
		attempts: [],
		helped: [],
		rewards: [],
		consumed: [],
		completed: {},
		resting: false,
		startedAt: now,
		explained: false,
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
		v.version !== CONTENT_VERSION ||
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
				a.version === CONTENT_VERSION,
		)
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
		seed: p.later?.seed ?? p.seed,
		at: now,
		outcome,
		helped,
		first,
		mode,
		version: CONTENT_VERSION,
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
	p.workspace = taskFor(p.step, p.seed)?.model ?? [0, 0, 0, 0];
	p.undo = [];
}

export function independent(a: Attempt): boolean {
	return (
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
