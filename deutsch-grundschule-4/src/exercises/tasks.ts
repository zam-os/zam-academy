import type { Generator, Level, Rng, Task } from "../types";

/** mulberry32: small, fast and reproducible for a given seed. */
export function seeded(seed: number): Rng {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function hash(text: string): number {
	let h = 2166136261;
	for (const ch of text) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
	return h;
}

export const pick = <T>(rng: Rng, list: readonly T[]): T =>
	list[Math.floor(rng() * list.length) % list.length];

export function shuffle<T>(rng: Rng, list: readonly T[]): T[] {
	const copy = [...list];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

/** Choice task with shuffled, de-duplicated options. */
export function choice(
	rng: Rng,
	task: Omit<Task, "kind" | "options" | "accept"> & {
		answer: string;
		wrong: string[];
	},
): Task {
	const { answer, wrong, ...rest } = task;
	const options = shuffle(rng, [
		answer,
		...new Set(wrong.filter((w) => w !== answer)),
	]);
	return { ...rest, kind: "choice", options, accept: [answer] };
}

export function text(
	task: Omit<Task, "kind" | "accept"> & { accept: string[] },
): Task {
	return { ...task, kind: "text" };
}

/** Whitespace and quote style never decide; letters and their case do. */
export const normaliseAnswer = (value: string): string =>
	value
		.normalize("NFC")
		.replace(/[„“”"]/g, '"')
		.replace(/[‚‘’']/g, "'")
		.replace(/\s+/g, " ")
		.trim();

export interface CheckResult {
	correct: boolean;
	/** Targeted hint for a known typical mistake, if any. */
	hint?: string;
}

export function checkAnswer(task: Task, answer: string): CheckResult {
	const given = normaliseAnswer(answer);
	if (!given) return { correct: false };
	if (task.accept.some((a) => normaliseAnswer(a) === given))
		return { correct: true };
	for (const [wrong, hint] of Object.entries(task.mistakes ?? {}))
		if (normaliseAnswer(wrong) === given) return { correct: false, hint };
	// Same letters, other case: say so instead of a general "not yet".
	if (
		task.kind === "text" &&
		task.accept.some(
			(a) => normaliseAnswer(a).toLowerCase() === given.toLowerCase(),
		)
	)
		return {
			correct: false,
			hint: "Fast! Schau noch einmal auf große und kleine Anfangsbuchstaben.",
		};
	return { correct: false };
}

/**
 * The task for a lesson, level and attempt number. The generator is chosen
 * in turn so both kinds of task appear; a repeat of the previous question is
 * avoided by trying the following seeds.
 */
export function makeTask(
	lessonId: string,
	generators: Record<Level, Generator[]>,
	level: Level,
	attempt: number,
	previousKey?: string,
): Task {
	const list = generators[level];
	let task: Task | undefined;
	for (let extra = 0; extra < 12; extra++) {
		const n = attempt + extra * 7919;
		const generator = list[n % list.length];
		task = generator(seeded(hash(`${lessonId}:${level}:${n}`)));
		if (task.key !== previousKey) return task;
	}
	return task as Task;
}

/** Render [[marked]] parts as underlined text; everything else is escaped. */
export function markup(value: string, esc: (s: string) => string): string {
	return esc(value).replace(/\[\[(.+?)\]\]/g, '<u class="mark">$1</u>');
}

export const plain = (value: string): string =>
	value.replace(/\[\[(.+?)\]\]/g, "$1");
