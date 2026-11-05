import { describe, expect, it } from "vitest";
import coverage from "../coverage.json";
import css from "../src/styles.css?raw";
import { LESSONS } from "../src/curriculum";
import { checkAnswer, makeTask } from "../src/exercises/tasks";
import type { Level, MachineWorkshop, Task } from "../src/types";
import { initialMachine, setControl } from "../src/workshop/engine";

const WRITING = ["ideen-sammeln", "erzaehlen-aufbauen", "erzaehlen-lebendig", "genau-beschreiben", "berichten", "standpunkt-begruenden", "schreiben-und-verstehen", "texte-ueberarbeiten"];
const LANGUAGE = ["sprache-wirkt", "verstaendigung", "muendlich-schriftlich", "sprachen-im-umfeld"];

const lesson = (id: string) => {
	const l = LESSONS.find((x) => x.id === id);
	if (!l) throw new Error(id);
	return l;
};
const tasks = (id: string, level: Level, runs = 600): Task[] => Array.from({ length: runs }, (_, i) => makeTask(id, lesson(id).generators, level, i + 1));
const learnerText = (id: string) => {
	const l = lesson(id);
	const asked = [...tasks(id, 1, 200), ...tasks(id, 2, 200)].flatMap((t) => [t.prompt, t.material ?? "", t.hint, t.explanation, ...(t.options ?? [])]);
	return [...l.paragraphs, ...l.example.lines, l.takeaway, l.skill, ...l.terms.flatMap((t) => [t.term, t.meaning]), l.desk?.task ?? "", ...(l.desk?.checklist ?? []), ...asked].join(" ");
};

describe("Schreibwerkstatt", () => {
	it("offers a free writing desk in every writing lesson and nowhere else", () => {
		for (const l of LESSONS) {
			if (WRITING.includes(l.id)) {
				expect(l.stage, l.id).toBe("schreibwerkstatt");
				expect(l.desk?.task.length, l.id).toBeGreaterThan(30);
				expect(l.desk?.checklist.length, l.id).toBeGreaterThanOrEqual(3);
			} else expect(l.desk, l.id).toBeUndefined();
		}
	});

	it("takes reports' open question from the four basic questions and explains the others", () => {
		const open = tasks("berichten", 1).filter((t) => t.key.startsWith("offen:"));
		expect(new Set(open.map((t) => t.key)).size).toBe(5);
		for (const t of open) {
			expect(["Wer", "Wann", "Wo", "Was"]).toContain(t.accept[0]);
			expect(checkAnswer(t, `${t.accept[0]}?`).correct, t.key).toBe(true);
			expect(checkAnswer(t, "Warum").hint, t.key).toContain("Grundfragen");
		}
	});

	it("really leaves that question open in the report", () => {
		const says: Record<string, RegExp> = { Wann: /\b(Am|Um|Gestern)\b/, Wo: /\b(auf dem|in der|im)\b/ };
		for (const t of tasks("berichten", 1).filter((x) => x.key.startsWith("offen:"))) {
			const pattern = says[t.accept[0]];
			if (pattern) expect(t.material, t.key).not.toMatch(pattern);
		}
	});

	it("shows the story or text with every question about a voice, a diary or a summary", () => {
		const about = [...tasks("schreiben-und-verstehen", 1), ...tasks("schreiben-und-verstehen", 2)].filter((t) => /^(sicht|tagebuch|zusammen):/.test(t.key));
		expect(new Set(about.map((t) => t.key)).size).toBe(6 + 2 + 5);
		for (const t of about) expect(t.passage?.paragraphs.length, t.key).toBeGreaterThan(0);
	});

	it("needs a matching verb and addition to show how Ben moves", () => {
		const ws = lesson("erzaehlen-lebendig").workshop as MachineWorkshop;
		const set = (verb: string, wie: string) => setControl(ws, setControl(ws, initialMachine(ws), "verb", verb), "wie", wie);
		expect(ws.view({ verb: "schlich", wie: "mit rotem Kopf" }).found).toBeUndefined();
		expect(ws.view({ verb: "ging", wie: "ohne Zusatz" }).display).toBe("Ben ging durch den Flur.");
		expect(ws.view({ verb: "rannte", wie: "so schnell er konnte" }).display).toBe("Ben rannte, so schnell er konnte, durch den Flur.");
		expect(set("stampfte", "mit rotem Kopf").found).toEqual(["wuetend"]);
		expect(set("schlich", "auf Zehenspitzen").found).toEqual(["leise"]);
	});
});

describe("Sprachlabor", () => {
	it("compares the same word in four forms", () => {
		const ws = lesson("sprachen-im-umfeld").workshop as MachineWorkshop;
		const say = (wort: string, sprache: string) => ws.view({ wort, sprache }).display;
		expect(say("Schule", "Englisch")).toBe("Schule → school");
		expect(say("Milch", "Türkisch")).toBe("Milch → süt");
		expect(say("Schule", "Bairisch")).toBe("Schule → Schui");
		expect(ws.view({ wort: "Haus", sprache: "Standarddeutsch" }).found).toBeUndefined();
	});
});

describe("Abgrenzung", () => {
	it("uses no term the curriculum reserves for Grade 5", () => {
		for (const id of [...WRITING, ...LANGUAGE]) expect(learnerText(id), id).not.toMatch(/Textlupe|Schreibkonferenz|Cluster|Brainstorming|konzeptionell|medial/);
	});

	it("leaves no expectation planned and names what stays open", () => {
		expect(coverage.rows.filter((r) => r.status === "planned")).toEqual([]);
		expect(coverage.rows.filter((r) => r.status === "partial")).toHaveLength(69);
		expect(coverage.rows.filter((r) => r.status === "outside-app")).toHaveLength(47);
		for (const r of coverage.rows.filter((x) => ["3.2", "3.3", "4.1", "4.2"].includes(x.section) && x.lessons.some((l) => [...WRITING, ...LANGUAGE].includes(l))))
			expect(r.evidence, `${r.section}.${r.position}`).toMatch(/bewert|außerhalb|nicht|beurteilt|Einzelbeispiele/i);
	});
});

describe("Farben", () => {
	const lum = (hex: string) => {
		const [r, g, b] = [1, 3, 5].map((i) => {
			const v = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
			return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	};
	const contrast = (a: string, b: string) => {
		const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
		return (x + 0.05) / (y + 0.05);
	};
	const all = (name: string) => [...css.matchAll(new RegExp(`--${name}: (#[0-9a-f]{3,6});`, "g"))].map((m) => (m[1].length === 4 ? "#ffffff" : m[1]));

	it("keeps chosen buttons readable on every station colour, light and dark", () => {
		const on = all("on-stage");
		expect(on).toHaveLength(3);
		for (const stage of ["accent", "werkstatt", "bahnhof", "detektiv", "woerterschatz", "lesewerkstatt", "schreibwerkstatt", "sprachlabor"]) {
			const colours = all(stage);
			expect(colours.length, stage).toBeGreaterThanOrEqual(2);
			// Light palette first, then the dark ones (media query and chosen theme).
			expect(contrast(on[0], colours[0]), `${stage} hell`).toBeGreaterThanOrEqual(3);
			for (const dark of colours.slice(1)) expect(contrast(on[1], dark), `${stage} dunkel`).toBeGreaterThanOrEqual(4.5);
		}
	});

	it("never prints white on a station colour", () => {
		expect(css).not.toMatch(/background: var\(--stage\);\n(\tborder-color: var\(--stage\);\n)?\tcolor: #fff/);
	});
});
