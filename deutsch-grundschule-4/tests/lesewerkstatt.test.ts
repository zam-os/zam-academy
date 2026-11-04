import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { FACT_TEXTS, POEMS, STORIES, TABLES } from "../src/curriculum/lesetexte";
import { checkAnswer, makeTask } from "../src/exercises/tasks";
import type { Level, Task } from "../src/types";
import { initialState } from "../src/workshop/engine";
import { workshopHtml } from "../src/workshop/view";

const IDS = ["textarten-erkennen", "lesestrategien", "sachtexte-tabellen", "geschichten-verstehen", "figuren-verstehen", "sprachbilder-gedichte", "medien-verstehen"];
const PASSAGES = [...FACT_TEXTS, ...STORIES, ...POEMS];
const textOf = (paragraphs: string[]) => paragraphs.join(" ");

function tasks(id: string, level: Level, runs = 1500): Task[] {
	const lesson = LESSONS.find((l) => l.id === id);
	if (!lesson) throw new Error(id);
	return Array.from({ length: runs }, (_, i) => makeTask(lesson.id, lesson.generators, level, i + 1));
}

describe("Lesewerkstatt: Texte", () => {
	it("gives each question three different answers", () => {
		for (const p of [...PASSAGES, ...TABLES])
			for (const q of [...p.literal, ...p.deeper]) {
				expect(new Set([q.a, ...q.wrong]).size, q.q).toBe(3);
				expect(q.why.length, q.q).toBeGreaterThan(5);
			}
	});

	it("finds every word to copy in its text, as a whole word", () => {
		for (const p of PASSAGES)
			for (const e of p.extract) {
				expect(e.q, e.a).toContain("heraus");
				expect(new RegExp(`(^|[^\\p{L}])${e.a}($|[^\\p{L}])`, "u").test(textOf(p.paragraphs)), `${p.id}: ${e.a}`).toBe(true);
			}
	});

	it("uses rhyme pairs that really end alike and stand at line ends", () => {
		for (const p of POEMS) {
			const ends = p.paragraphs.map((line) => line.replace(/[,.]$/, "").split(" ").at(-1) as string);
			for (const e of p.extract) {
				const asked = e.q.match(/„(.+)“/)?.[1] as string;
				expect(ends, e.q).toContain(asked);
				expect(ends, e.q).toContain(e.a);
				expect(asked.slice(-2), e.q).toBe(e.a.slice(-2));
			}
		}
	});

	it("states the table answers the questions expect", () => {
		const q = (id: string, text: string) => {
			const t = TABLES.find((x) => x.id === id);
			return [...(t?.literal ?? []), ...(t?.deeper ?? [])].find((x) => x.q.includes(text))?.a;
		};
		const rows = (id: string) => TABLES.find((t) => t.id === id)?.rows ?? [];
		const num = (s: string) => Number.parseInt(s, 10);
		const hottest = [...rows("wetter")].sort((a, b) => num(b[1]) - num(a[1]))[0][0];
		const coldest = [...rows("wetter")].sort((a, b) => num(a[1]) - num(b[1]))[0][0];
		expect(q("wetter", "am wärmsten")).toBe(`am ${hottest}`);
		expect(q("wetter", "am kältesten")).toBe(`am ${coldest}`);
		expect(q("wetter", "zusammen")).toBe(`${rows("wetter").reduce((s, r) => s + num(r[2]), 0)} mm`);
		expect(q("lesen", "zusammen")).toBe(String(rows("lesen").reduce((s, r) => s + num(r[1]), 0)));
		expect(q("lesen", "die meisten")).toBe([...rows("lesen")].sort((a, b) => num(b[1]) - num(a[1]))[0][0]);
	});

	it("keeps table answers true to the table", () => {
		const cell = (id: string, row: string, col: number) => TABLES.find((t) => t.id === id)?.rows.find((r) => r[0] === row)?.[col];
		expect(cell("wetter", "Dienstag", 1)).toBe("15 °C");
		const numbers = (id: string, col: number) => (TABLES.find((t) => t.id === id)?.rows ?? []).map((r) => Number.parseInt(r[col], 10));
		expect(Math.max(...numbers("wetter", 1))).toBe(18);
		expect(Math.min(...numbers("wetter", 1))).toBe(9);
		expect(numbers("wetter", 2).reduce((a, b) => a + b, 0)).toBe(12);
		expect(numbers("lesen", 1).reduce((a, b) => a + b, 0)).toBe(24);
		for (const r of TABLES.find((t) => t.id === "lesen")?.rows ?? []) expect(r[2].length, r[0]).toBe(Number(r[1]));
	});
});

describe("Lesewerkstatt: Aufgaben", () => {
	it("reaches every question and word to copy across its lessons", () => {
		const all = IDS.flatMap((id) => [...tasks(id, 1), ...tasks(id, 2)]);
		const asked = new Set(all.map((t) => t.prompt));
		const missing = PASSAGES.flatMap((p) => [...p.literal.map((q) => q.q), ...p.deeper.map((q) => q.q), ...p.extract.map((e) => e.q)]).concat(TABLES.flatMap((t) => [...t.literal, ...t.deeper].map((q) => q.q))).filter((q) => !asked.has(q));
		expect(missing).toEqual([]);
	});

	it("always shows the text or table a question is about", () => {
		const prompts = new Set(PASSAGES.flatMap((p) => [...p.literal, ...p.deeper, ...p.extract].map((q) => q.q)));
		const tablePrompts = new Set(TABLES.flatMap((t) => [...t.literal, ...t.deeper].map((q) => q.q)));
		for (const id of IDS)
			for (const level of [1, 2] as Level[])
				for (const t of tasks(id, level, 400)) {
					if (prompts.has(t.prompt)) expect(t.passage?.paragraphs.length, t.key).toBeGreaterThan(0);
					if (tablePrompts.has(t.prompt)) expect(t.table?.rows.length, t.key).toBeGreaterThan(0);
				}
	});

	it("accepts the copied word and rejects another word from the text", () => {
		const copy = tasks("lesestrategien", 1).find((t) => t.accept[0] === "Laub") as Task;
		expect(checkAnswer(copy, "Laub").correct).toBe(true);
		expect(checkAnswer(copy, "aus Laub").correct).toBe(true);
		expect(checkAnswer(copy, "Stacheln").correct).toBe(false);
	});

	it("accepts the natural ways to copy an answer from the text", () => {
		const storyTasks = tasks("geschichten-verstehen", 1);
		const tree = storyTasks.find((t) => t.accept[0] === "Kastanie") as Task;
		expect(checkAnswer(tree, "in der Kastanie").correct).toBe(true);
		const attic = storyTasks.find((t) => t.accept[0] === "Dachboden") as Task;
		expect(checkAnswer(attic, "auf dem Dachboden").correct).toBe(true);
		const sea = tasks("lesestrategien", 1).find((t) => t.accept[0] === "Meer") as Task;
		expect(checkAnswer(sea, "ins Meer").correct).toBe(true);
		for (const p of PASSAGES)
			for (const e of p.extract)
				for (const form of e.also ?? []) expect(form.toLowerCase(), e.q).toContain(e.a.toLowerCase());
	});

	it("keeps copying on level 1, so that level 2 really asks for more", () => {
		for (const id of IDS)
			for (const t of tasks(id, 2, 600)) expect(t.key.startsWith("heraus:"), `${id}: ${t.key}`).toBe(false);
	});

	it("takes every proof sentence from the text it belongs to", () => {
		const proofs = tasks("lesestrategien", 2).filter((t) => t.key.startsWith("beleg:"));
		expect(new Set(proofs.map((t) => t.key)).size).toBe(6);
		for (const t of proofs) {
			const whole = textOf(t.passage?.paragraphs ?? []);
			for (const option of t.options ?? []) expect(whole, option).toContain(option);
		}
	});

	it("only asks about figures in the figure lesson", () => {
		for (const t of tasks("figuren-verstehen", 2, 600)) expect(t.passage?.title ?? "Der neue Junge", t.key).toBe("Der neue Junge");
	});

	it("gives every sentence of an ordering puzzle its own row, without leaking marks", () => {
		const lesson = LESSONS.find((l) => l.id === "geschichten-verstehen");
		const html = lesson ? workshopHtml(lesson.workshop, initialState(lesson.workshop)) : "";
		expect(html).toContain('class="row-end"');
		expect(html).not.toContain("\u0001");
	});
});
