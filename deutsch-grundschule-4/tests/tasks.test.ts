import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { checkAnswer, makeTask, markup, normaliseAnswer, plain, seeded } from "../src/exercises/tasks";
import { esc } from "../src/format";
import type { Level, Task } from "../src/types";

const RUNS = 80;

function tasks(lessonId: string, level: Level): Task[] {
	const lesson = LESSONS.find((l) => l.id === lessonId);
	if (!lesson) throw new Error(lessonId);
	return Array.from({ length: RUNS }, (_, i) => makeTask(lesson.id, lesson.generators, level, i + 1));
}

describe("Generierte Aufgaben", () => {
	for (const lesson of LESSONS) {
		it(`${lesson.id}: 80 gültige Aufgaben je Stufe, die Stufen unterscheiden sich`, () => {
			expect(lesson.generators[1].length).toBeGreaterThanOrEqual(2);
			expect(lesson.generators[2].length).toBeGreaterThanOrEqual(2);
			const prompts: Record<Level, Set<string>> = { 1: new Set(), 2: new Set() };
			for (const level of [1, 2] as Level[]) {
				const list = tasks(lesson.id, level);
				for (const t of list) {
					const where = `${lesson.id} L${level}: ${t.prompt} ${t.material ?? ""}`;
					prompts[level].add(t.prompt);
					const visible = [t.prompt, t.material ?? "", t.hint, t.explanation, ...(t.options ?? []), ...t.accept].join(" ");
					expect(visible, where).not.toMatch(/undefined|NaN|\[object|null/);
					expect(t.key, where).not.toBe("");
					expect(t.hint.length, where).toBeGreaterThan(10);
					expect(t.accept.length, where).toBeGreaterThan(0);
					expect(checkAnswer(t, t.accept[0]).correct, where).toBe(true);
					if (t.kind === "choice") {
						const options = t.options ?? [];
						expect(options.length, where).toBeGreaterThanOrEqual(2);
						expect(new Set(options).size, where).toBe(options.length);
						expect(options.filter((o) => t.accept.includes(o)), where).toHaveLength(1);
						for (const o of options)
							if (!t.accept.includes(o)) expect(checkAnswer(t, o).correct, `${where} → ${o}`).toBe(false);
					} else {
						expect(checkAnswer(t, "").correct).toBe(false);
						// The answer is never printed in the task, except when copying it out is the task.
						if (!t.prompt.includes("heraus"))
							expect(plain(`${t.prompt} ${t.material ?? ""}`).includes(t.accept[0]), where).toBe(false);
					}
					for (const [wrong, hint] of Object.entries(t.mistakes ?? {})) {
						expect(hint.length, where).toBeGreaterThan(5);
						if (!t.accept.includes(wrong)) expect(checkAnswer(t, wrong), where).toEqual({ correct: false, hint });
					}
				}
				// Enough variety: at least six different questions per level.
				expect(new Set(list.map((t) => t.key)).size, `${lesson.id} L${level}`).toBeGreaterThanOrEqual(6);
			}
			const shared = [...prompts[1]].filter((p) => prompts[2].has(p));
			expect(shared, `${lesson.id}: level must change the task`).toEqual([]);
		});
	}

	it("never repeats the previous task when another one exists", () => {
		for (const lesson of LESSONS)
			for (const level of [1, 2] as Level[]) {
				let previous: string | undefined;
				for (let i = 1; i <= 40; i++) {
					const t = makeTask(lesson.id, lesson.generators, level, i, previous);
					expect(t.key, `${lesson.id} L${level} #${i}`).not.toBe(previous);
					previous = t.key;
				}
			}
	});

	it("is reproducible for the same attempt", () => {
		const l = LESSONS[1];
		expect(makeTask(l.id, l.generators, 2, 17)).toEqual(makeTask(l.id, l.generators, 2, 17));
		const a = seeded(5);
		const b = seeded(5);
		expect([a(), a(), a()]).toEqual([b(), b(), b()]);
	});
});

describe("Gleichwertige Antworten zählen", () => {
	const all = (id: string, level: Level) => {
		const l = LESSONS.find((x) => x.id === id);
		if (!l) throw new Error(id);
		return Array.from({ length: 200 }, (_, i) => makeTask(l.id, l.generators, level, i + 1));
	};
	it("accepts every word order behind the verb in the Umstellprobe", () => {
		const t = all("satzglieder-umstellprobe", 2).find((x) => x.kind === "text" && x.accept[0] === "Im Hof spielen die Kinder nach der Schule Fußball.");
		expect(t).toBeDefined();
		expect(checkAnswer(t as Task, "Im Hof spielen nach der Schule die Kinder Fußball.").correct).toBe(true);
		expect(checkAnswer(t as Task, "Im Hof die Kinder spielen nach der Schule Fußball.").correct).toBe(false);
	});
	it("accepts the short genitive and both perfect forms of schwimmen", () => {
		const baum = all("vier-faelle", 2).find((x) => x.accept[0] === "des Baumes");
		expect(checkAnswer(baum as Task, "des Baums").correct).toBe(true);
		const swim = all("zeitformen", 2).find((x) => x.accept[0] === "ist geschwommen");
		expect(checkAnswer(swim as Task, "hat geschwommen").correct).toBe(true);
	});
	it("offers no second correct article in the case gaps", () => {
		// "___ Nachbarn" also took "den" (dative plural); such nouns are not used.
		for (const t of all("vier-faelle", 1).filter((x) => x.key.startsWith("artikel-fall:")))
			expect(t.material, t.key).not.toMatch(/Nachbarn/);
	});
});

describe("Antworten prüfen", () => {
	const t: Task = {
		prompt: "p",
		kind: "text",
		accept: ["Mia sagt: „Ich komme mit.“"],
		hint: "h",
		explanation: "e",
		key: "k",
		mistakes: { Hunt: "Verlängere!" },
	};
	it("ignores spaces and the quote style, not letters or case", () => {
		expect(checkAnswer(t, '  Mia  sagt: "Ich komme mit."  ').correct).toBe(true);
		expect(checkAnswer(t, "Mia sagt: „Ich komme mit.“").correct).toBe(true);
		expect(checkAnswer(t, "mia sagt: „ich komme mit.“")).toEqual({
			correct: false,
			hint: "Fast! Schau noch einmal auf große und kleine Anfangsbuchstaben.",
		});
		expect(checkAnswer(t, "Mia sagt: „Ich komme mit“").correct).toBe(false);
		expect(checkAnswer(t, "Hunt")).toEqual({ correct: false, hint: "Verlängere!" });
		expect(normaliseAnswer("a  b")).toBe("a b");
	});
	it("underlines marked parts and escapes the rest", () => {
		expect(markup("Ich sehe [[den <Hund>]].", esc)).toBe('Ich sehe <u class="mark">den &lt;Hund&gt;</u>.');
	});
});
