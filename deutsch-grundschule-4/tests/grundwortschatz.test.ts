import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
	groupOf,
	type GroupId,
	plainSource,
	spellable,
	WORD_GROUPS,
	wordsIn,
	wordsOfGroup,
} from "../src/curriculum/grundwortschatz";
import { checkAnswer, makeTask, plain } from "../src/exercises/tasks";
import type { Level, Task } from "../src/types";
import official from "./fixtures/official-grundwortschatz.json";

const LESSON_IDS = ["grundwortschatz-regeln", "grundwortschatz-formen", "grundwortschatz-merkwoerter"];
const lessons = LESSON_IDS.map((id) => {
	const lesson = LESSONS.find((l) => l.id === id);
	if (!lesson) throw new Error(id);
	return lesson;
});

function allTasks(lessonId: string, level: Level, runs = 4000): Task[] {
	const lesson = LESSONS.find((l) => l.id === lessonId);
	if (!lesson) throw new Error(lessonId);
	return Array.from({ length: runs }, (_, i) => makeTask(lesson.id, lesson.generators, level, i + 1));
}

/** Whether a word fits its gap, as in "Br…f". */
const maskMatches = (masked: string, word: string): boolean =>
	new RegExp(`^${masked.replaceAll("…", ".+")}$`, "u").test(word);

describe("Grundwortschatz: Abgleich mit dem ISB", () => {
	it("keeps every group word for word", () => {
		const groups = official.groups as Record<string, string>;
		expect(WORD_GROUPS.map((g) => g.id)).toEqual(Object.keys(groups));
		for (const g of WORD_GROUPS) expect(plainSource(g.source), g.id).toBe(groups[g.id]);
	});

	it("names the source of the words", () => {
		expect(official.publisher).toContain("ISB");
		expect(official.pdf_sha256).toMatch(/^[0-9a-f]{64}$/);
		for (const l of lessons) expect(l.wordbook?.note, l.id).toContain("Staatsinstitut");
	});

	it("shows every group in exactly one lesson", () => {
		const shown = lessons.flatMap((l) => l.wordbook?.groups.map((g) => g.title) ?? []);
		expect([...shown].sort()).toEqual(WORD_GROUPS.map((g) => g.title).sort());
		for (const l of lessons)
			for (const g of l.wordbook?.groups ?? [])
				expect(g.words, g.title).toBe(plainSource(WORD_GROUPS.find((x) => x.title === g.title)?.source ?? ""));
	});
});

describe("Grundwortschatz: Wortdaten", () => {
	it("gives every marked word a different misspelling and a gap that hides the letter count", () => {
		for (const g of WORD_GROUPS)
			for (const w of wordsOfGroup(g)) {
				if (!w.wrong || !w.masked) continue;
				expect(w.wrong, w.word).not.toBe(w.word);
				expect(w.masked, w.word).toContain("…");
				expect(w.masked, w.word).not.toContain("_");
				expect(maskMatches(w.masked, w.word), `${w.masked} / ${w.word}`).toBe(true);
			}
	});

	it("never offers another word of the list as the misspelling", () => {
		const all = new Set(WORD_GROUPS.flatMap(wordsOfGroup).map((w) => w.word));
		// Leib is a real word, but it is not in the list; its task asks for the bread.
		for (const g of WORD_GROUPS)
			for (const w of wordsOfGroup(g)) if (w.wrong) expect(all.has(w.wrong), `${w.word} → ${w.wrong}`).toBe(false);
	});

	it("marks every word except the separate groups and reference forms", () => {
		const plainGroups: GroupId[] = ["silben", "flexion"];
		for (const g of WORD_GROUPS.filter((x) => !plainGroups.includes(x.id)))
			expect(wordsOfGroup(g).filter((w) => w.wrong).length, g.id).toBeGreaterThan(0);
		// Reference forms exist only where a form helps another: lesen – liest, Berg – Berge.
		for (const w of spellable(["verhaertung", "umlaut", "kombination", "praeteritum"]))
			expect(w.clue, w.word).toBeTruthy();
	});

	it("splits words only between syllables, and never leaves one letter alone", () => {
		for (const w of wordsIn(["silben"])) {
			if (!w.hyphenated) continue;
			expect(w.hyphenated.replaceAll("-", ""), w.word).toBe(w.word);
			for (const part of w.hyphenated.split("-")) {
				expect(part.length, w.hyphenated).toBeGreaterThan(1);
				expect(part, w.hyphenated).toMatch(/[aeiouäöüy]/i);
			}
			expect(w.hyphenated, w.word).not.toMatch(/s-ch|c-h/);
		}
		expect(wordsIn(["silben"]).find((w) => w.word === "oben")?.hyphenated).toBeUndefined();
	});
});

describe("Grundwortschatz: Aufgaben", () => {
	const reached = (ids: GroupId[], tasks: Task[]) => {
		const answers = new Set(tasks.flatMap((t) => [...t.accept, ...(t.options ?? [])]));
		return wordsIn(ids).filter((w) => w.wrong && !answers.has(w.word)).map((w) => w.word);
	};

	it("practises every marked word of its lesson on level 1", () => {
		expect(reached(["r", "ie", "doppel", "tz", "ck", "h"], allTasks(LESSON_IDS[0], 1))).toEqual([]);
		expect(reached(["verhaertung", "umlaut", "kombination", "praeteritum"], allTasks(LESSON_IDS[1], 1))).toEqual([]);
		expect(
			reached(["haeufig", "sz", "ch", "v", "y", "ks", "zz", "dt", "dehnung", "doppelvokal", "ae", "i", "ai"], allTasks(LESSON_IDS[2], 1)),
		).toEqual([]);
	});

	it("makes the child write every marked word of its lesson on level 2", () => {
		const missing = (ids: GroupId[], id: string) => {
			const written = new Set(allTasks(id, 2).filter((t) => t.kind === "text").flatMap((t) => t.accept));
			return wordsIn(ids).filter((w) => w.wrong && !written.has(w.word)).map((w) => w.word);
		};
		expect(missing(["r", "ie", "doppel", "tz", "ck", "h"], LESSON_IDS[0])).toEqual([]);
		expect(missing(["haeufig", "sz", "ch", "v", "y", "ks", "zz", "dt", "dehnung", "doppelvokal", "ae", "i", "ai"], LESSON_IDS[2])).toEqual([]);
		expect(missing(["verhaertung", "umlaut", "kombination", "praeteritum"], LESSON_IDS[1])).toEqual([]);
	});

	it("makes every inflected form of the list the right answer at least once", () => {
		const right = new Set(allTasks(LESSON_IDS[1], 1).filter((t) => t.key.startsWith("satzwort:")).map((t) => t.accept[0].toLowerCase()));
		const missing = wordsIn(["flexion"]).filter((w) => !right.has(w.word)).map((w) => w.word);
		expect(missing).toEqual([]);
	});

	it("also makes the child type inflected forms and one-syllable words", () => {
		const typed = allTasks(LESSON_IDS[1], 2).filter((t) => t.key.startsWith("satzform:"));
		expect(new Set(typed.map((t) => t.accept[0])).size).toBeGreaterThan(15);
		// The base form in brackets decides between meinem, seinem and deinem.
		for (const t of typed) expect(t.material, t.key).toMatch(/\(\p{L}+\)$/u);
		const written = new Set(allTasks(LESSON_IDS[0], 2).flatMap((t) => t.accept));
		const whole = wordsIn(["silben"]).filter((w) => !w.hyphenated && !written.has(w.word)).map((w) => w.word);
		expect(whole).toEqual([]);
	});

	it("always gives a typed gap a sentence, so that it has one meaning", () => {
		for (const id of LESSON_IDS)
			for (const t of allTasks(id, 2, 800)) {
				if (!t.material?.includes("…")) continue;
				expect(t.material.split(" ").length, t.key).toBeGreaterThan(2);
				expect(t.material, t.key).not.toContain("_");
			}
	});

	it("accepts the article, the feminine form and leaves the kaufen task unambiguous", () => {
		const tasks = allTasks(LESSON_IDS[1], 2);
		const wald = tasks.find((t) => t.accept[0] === "Wälder") as Task;
		expect(checkAnswer(wald, "die Wälder").correct).toBe(true);
		const sale = tasks.find((t) => t.accept[0] === "Verkäufer") as Task;
		expect(sale.prompt).toContain("verkauft");
		expect(checkAnswer(sale, "Verkäuferin").correct).toBe(true);
		expect(checkAnswer(tasks.find((t) => t.accept[0] === "Bäcker") as Task, "Bäckerin").correct).toBe(true);
	});

	it("does not repeat the app's own prefix in a mistake hint", () => {
		for (const id of LESSON_IDS)
			for (const t of allTasks(id, 2, 800))
				for (const hint of Object.values(t.mistakes ?? {})) expect(hint, t.key).not.toMatch(/^Noch nicht/);
	});

	it("gives every past form a sentence of its own", () => {
		const past = allTasks(LESSON_IDS[1], 2).filter((t) => t.key.startsWith("praeteritum:"));
		expect(new Set(past.map((t) => t.material)).size).toBe(wordsIn(["praeteritum"]).filter((w) => w.wrong).length);
	});

	it("keeps every gap in a sentence true to its answer", () => {
		for (const id of LESSON_IDS)
			for (const t of allTasks(id, 2, 800)) {
				const gap = plain(t.material ?? "").match(/[\p{L}]*…[\p{L}…]*/u)?.[0];
				if (!gap) continue;
				expect(maskMatches(gap, t.accept[0]), `${gap} / ${t.accept[0]}`).toBe(true);
			}
	});

	it("gives a targeted hint for the typical misspelling", () => {
		for (const id of LESSON_IDS)
			for (const t of allTasks(id, 2, 800)) {
				if (/^(striche|satzform|satzwort)/.test(t.key)) continue;
				const word = WORD_GROUPS.flatMap(wordsOfGroup).find((w) => w.word === t.accept[0] && w.wrong);
				if (word?.wrong) expect(checkAnswer(t, word.wrong).hint, `${t.key}: ${word.wrong}`).toBeTruthy();
			}
	});

	it("asks for the bread when it offers Laib and Leib", () => {
		const laib = allTasks(LESSON_IDS[2], 1).find((t) => t.accept[0] === "Laib");
		expect(laib?.material).toContain("Brot");
		expect(groupOf("ai").source).toContain("L{ai|ei}b");
	});
});
