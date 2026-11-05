import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import { LESSONS } from "../src/curriculum";
import { deskHtml } from "../src/desk";
import { checkAnswer, makeTask, plain } from "../src/exercises/tasks";
import { MAX_TEXT } from "../src/storage/texts";
import css from "../src/styles.css?raw";
import type { Level, MachineWorkshop, SlotWorkshop, Task } from "../src/types";
import { initialMachine, setControl, slotsOf } from "../src/workshop/engine";

const WRITING = ["ideen-sammeln", "erzaehlen-aufbauen", "erzaehlen-lebendig", "genau-beschreiben", "berichten", "standpunkt-begruenden", "schreiben-und-verstehen", "texte-ueberarbeiten"];
const LANGUAGE = ["sprache-wirkt", "verstaendigung", "muendlich-schriftlich", "sprachen-im-umfeld"];
const NEW = [...WRITING, ...LANGUAGE];

const lesson = (id: string) => {
	const l = LESSONS.find((x) => x.id === id);
	if (!l) throw new Error(id);
	return l;
};
const tasks = (id: string, level: Level, runs = 600): Task[] => Array.from({ length: runs }, (_, i) => makeTask(id, lesson(id).generators, level, i + 1));
const distinct = (list: Task[]): Task[] => [...new Map(list.map((t) => [t.key, t])).values()];
/** Everything a child can read: the whole lesson data, its tasks and its cards. */
const learnerText = (id: string) => {
	const atom = cell.atoms.find((a) => a.slug === `gs4d-${id}`);
	return JSON.stringify([lesson(id), atom?.practice_items, tasks(id, 1, 200), tasks(id, 2, 200)]);
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

	it("escapes the stored text and warns about names and shared devices", () => {
		const desk = lesson("berichten").desk;
		if (!desk) throw new Error("desk");
		const html = deskHtml("berichten", desk, '</textarea><img src=x onerror="alert(1)">');
		expect(html).not.toContain("<img");
		expect(html).toContain("&lt;img");
		expect(html).toContain(`maxlength="${MAX_TEXT}"`);
		expect(html).toMatch(/gemeinsamen Gerät/);
		expect(html).toMatch(/keine Namen/);
	});

	it("leaves exactly the named basic question open in each report", () => {
		const open = distinct(tasks("berichten", 1)).filter((t) => t.key.startsWith("offen:"));
		expect(Object.fromEntries(open.map((t) => [t.material, t.accept[0]]))).toEqual({
			"Lena stürzte auf dem Pausenhof und verletzte sich am Knie.": "Wann",
			"Tom fand in der Turnhalle eine Geldbörse.": "Wann",
			"Am Montag stürzte Lena und verletzte sich am Knie.": "Wo",
			"Am Freitag wurde im Museum ein Preis überreicht.": "Wer",
			"Am Dienstag war Jonas im Schulgarten.": "Was",
		});
		for (const t of open) {
			expect(checkAnswer(t, `${t.accept[0]}?`).correct, t.key).toBe(true);
			for (const other of ["Warum", "Warum?", "Wie", "Wie?"]) expect(checkAnswer(t, other).hint, `${t.key} ${other}`).toContain("Grundfragen");
		}
	});

	it("shows the story or text with every question about a voice, a diary or a summary", () => {
		const about = distinct([...tasks("schreiben-und-verstehen", 1), ...tasks("schreiben-und-verstehen", 2)]).filter((t) => /^(sicht|tagebuch|zusammen):/.test(t.key));
		expect(about).toHaveLength(6 + 2 + 5);
		for (const t of about) expect(t.passage?.paragraphs.length, t.key).toBeGreaterThan(0);
	});

	it("needs a matching verb and addition to show how Ben moves", () => {
		const ws = lesson("erzaehlen-lebendig").workshop as MachineWorkshop;
		const set = (verb: string, wie: string) => setControl(ws, setControl(ws, initialMachine(ws), "verb", verb), "wie", wie);
		expect(ws.view({ verb: "schlich", wie: "mit rotem Kopf" }).found).toBeUndefined();
		expect(ws.view({ verb: "ging", wie: "ohne Zusatz" }).display).toBe("Ben ging durch den Flur.");
		expect(ws.view({ verb: "schlich", wie: "ohne Zusatz" }).note).toContain("Schon lebendig");
		expect(ws.view({ verb: "rannte", wie: "so schnell er konnte" }).display).toBe("Ben rannte, so schnell er konnte, durch den Flur.");
		expect(set("stampfte", "mit rotem Kopf").found).toEqual(["wuetend"]);
		expect(set("schlich", "auf Zehenspitzen").found).toEqual(["leise"]);
	});
});

describe("Sprachlabor", () => {
	it("compares the same word in four forms", () => {
		const ws = lesson("sprachen-im-umfeld").workshop as MachineWorkshop;
		const say = (wort: string, sprache: string) => ws.view({ wort, sprache });
		expect(say("Wasser", "Englisch").display).toBe("Wasser → water");
		expect(say("Milch", "Türkisch").display).toBe("Milch → süt");
		expect(say("Milch", "Bairisch").display).toBe("Milch → Milli");
		expect(say("Haus", "Standardsprache").found).toBeUndefined();
	});

	it("does not count a dialect word that looks the same", () => {
		const ws = lesson("sprachen-im-umfeld").workshop as MachineWorkshop;
		expect(ws.view({ wort: "Haus", sprache: "Bairisch" }).found).toBeUndefined();
		expect(ws.view({ wort: "Milch", sprache: "Bairisch" }).found).toBe("dialekt");
	});

	it("does not call borrowed words proof of relationship", () => {
		const lab = JSON.stringify(lesson("sprachen-im-umfeld"));
		expect(lab).not.toMatch(/school/);
		expect(JSON.stringify(distinct(tasks("sprachen-im-umfeld", 2)))).not.toMatch(/school/);
	});

	it("only marks real rhymes as rhymes", () => {
		const ws = lesson("sprache-wirkt").workshop as SlotWorkshop;
		const rhymes = ws.puzzles.flatMap((p) => slotsOf(p).filter((s) => s.answer === "R").map((s) => s.text));
		expect(rhymes).toEqual(["Saft mit Kraft!", "Flitzer-Schuh: schnell im Nu!", "Spaß und Spiel, und davon viel!"]);
	});
});

describe("Stifte", () => {
	it("gives every pen a first word of its own, because marked words show only that", () => {
		for (const id of NEW) {
			const ws = lesson(id).workshop;
			if (ws.kind !== "slots" || ws.variant !== "mark") continue;
			const first = ws.pens.map((p) => p.label.split(/[ :(]/)[0]);
			expect(new Set(first).size, id).toBe(first.length);
		}
	});
});

describe("Aufgabenqualität", () => {
	const choices = (level: Level) => NEW.flatMap((id) => distinct(tasks(id, level))).filter((t) => t.kind === "choice");
	const longestIsRight = (t: Task) => {
		const right = t.accept[0].length;
		return (t.options ?? []).every((o) => t.accept.includes(o) || o.length < right);
	};

	it("does not give the right answer away by its length", () => {
		for (const [level, limit] of [[1, 0.6], [2, 0.5]] as [Level, number][]) {
			const list = choices(level);
			expect(list.filter(longestIsRight).length / list.length, `Stufe ${level}`).toBeLessThanOrEqual(limit);
		}
	});

	it("makes learners type on level 2 in every new lesson", () => {
		for (const id of NEW) expect(tasks(id, 2).filter((t) => t.kind === "text").length, id).toBeGreaterThan(0);
	});

	it("does not print a typed answer, unless copying it is the task", () => {
		for (const id of NEW)
			for (const t of distinct(tasks(id, 2)).filter((x) => x.kind === "text" && !x.prompt.includes("heraus")))
				expect(plain(`${t.prompt} ${t.material ?? ""}`), `${id}: ${t.key}`).not.toContain(t.accept[0]);
	});

	it("keeps copied answers inside their material", () => {
		for (const id of NEW)
			for (const t of distinct(tasks(id, 2)).filter((x) => x.kind === "text" && x.prompt.includes("heraus")))
				expect(plain(t.material ?? ""), `${id}: ${t.key}`).toContain(t.accept[0]);
	});
});

describe("Abgrenzung", () => {
	it("uses no term the curriculum reserves for Grade 5, in anything a child can read", () => {
		for (const id of NEW) expect(learnerText(id), id).not.toMatch(/Textlupe|Schreibkonferenz|Schreibplan|Cluster|Brainstorming|konzeptionell|medial/);
	});

	it("names tenses with the primary-school word as well", () => {
		for (const id of NEW) {
			const text = learnerText(id);
			for (const match of text.matchAll(/Präsens|Präteritum|Futur/g)) {
				const around = text.slice(Math.max(0, (match.index ?? 0) - 25), (match.index ?? 0) + 35);
				expect(around, id).toMatch(/Gegenwart|Vergangenheit|Zukunft/);
			}
		}
	});

	it("leaves no expectation planned and names what stays open", () => {
		expect(coverage.rows.filter((r) => r.status === "planned")).toEqual([]);
		expect(coverage.rows.filter((r) => r.status === "partial")).toHaveLength(69);
		expect(coverage.rows.filter((r) => r.status === "outside-app")).toHaveLength(47);
		for (const r of coverage.rows.filter((x) => x.lessons.some((l) => NEW.includes(l)) && ["3.2", "3.3", "4.1", "4.2"].includes(x.section)))
			expect(r.evidence, `${r.section}.${r.position}`).toMatch(/bewert|beurteil|prüft|außerhalb der App|führt die App nicht/i);
	});

	it("promises nothing further from the Schreibwerkstatt", () => {
		for (const r of coverage.rows) expect(r.evidence, `${r.section}.${r.position}`).not.toMatch(/folg(t|en) (in|mit) der Schreibwerkstatt|Geplant/);
	});
});

describe("Farben und Breite", () => {
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
	const long = (hex: string) => (hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex);
	const all = (name: string) => [...css.matchAll(new RegExp(`--${name}: (#[0-9a-f]{3,6});`, "g"))].map((m) => long(m[1]));

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

	it("never prints white on a station colour, whatever the order of the properties", () => {
		for (const rule of css.match(/[^{}]+\{[^{}]*\}/g) ?? [])
			if (/background: var\(--(stage|bahnhof|werkstatt|detektiv|woerterschatz|lesewerkstatt|schreibwerkstatt|sprachlabor)\)/.test(rule)) expect(rule).not.toMatch(/\bcolor: #fff/);
	});

	it("lets gap puzzles and speech bubbles wrap on narrow screens", () => {
		const rule = (selector: string) => css.match(new RegExp(`(^|\\n)${selector.replace(".", "\\.")} \\{[^}]*\\}`))?.[0] ?? "";
		expect(rule(".word")).toContain("flex-wrap: wrap");
		expect(rule(".gap-group")).toContain("flex-wrap: wrap");
		// Otherwise a full stop right after a gap drops to a row of its own at 320 px.
		expect(rule(".gap-group")).toContain("flex: 1 1 0");
		expect(rule(".bubble")).toContain("overflow-wrap: anywhere");
		// "✓ geschafft" and the Lupe widen the head of a solved puzzle: 389 px at a 320 px width.
		expect(rule(".puzzle-head")).toContain("flex-wrap: wrap");
	});
});
