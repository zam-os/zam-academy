// Tinto as a companion, the step flow of a lesson and the visible effects of
// the Werkstätten. The DOM side (animations) is checked in the browser; here
// the pure parts are pinned: what is rendered, said and computed.
import { afterEach, describe, expect, it, vi } from "vitest";
import html from "../index.html?raw";
import { companionHtml, EVENTS, reaction } from "../src/companion";
import { findLesson, LESSONS } from "../src/curriculum";
import { makeTask } from "../src/exercises/tasks";
import { isStep, keepsLesson, learnHtml, learnNextHtml, learnPieces, stepperHtml, stepsOf } from "../src/flow";
import { esc } from "../src/format";
import { MOTION_KEY, typewrite } from "../src/motion";
import { freshProgress, stars } from "../src/storage/progress";
import css from "../src/styles.css?raw";
import { MOODS, type Mood, tinto } from "../src/tinto";
import type { MachineWorkshop, SlotWorkshop, TrainWorkshop } from "../src/types";
import { capitalFirst, changedWords, cutPieces } from "../src/workshop/effects";
import {
	initialMachine,
	initialSlots,
	initialTrain,
	isStatement,
	moveWagon,
	moveWagonTo,
	setEnd,
	solvedSlots,
	tapSlot,
	trainSentence,
	wagonToFront,
} from "../src/workshop/engine";
import { workshopHtml } from "../src/workshop/view";

const lesson = (id: string) => {
	const l = findLesson(id);
	if (!l) throw new Error(id);
	return l;
};

describe("Tinto", () => {
	const moods = Object.keys(MOODS) as Mood[];

	it("has eight arms and a spoken label in every mood", () => {
		for (const mood of moods) {
			const svg = tinto(mood);
			expect(svg.match(/class="t-arm /g), mood).toHaveLength(8);
			expect(svg).toContain(`class="tinto mood-${mood}"`);
			expect(svg).toContain(`aria-label="${MOODS[mood]}"`);
			expect(svg).not.toMatch(/undefined|NaN/);
			// The parts that change with the mood carry the classes the morph looks for.
			for (const part of ["t-extras", "t-eyes", "t-face", "t-body"]) expect(svg, `${mood}/${part}`).toContain(part);
		}
	});

	it("gives every mood its own body colour", () => {
		const colours = moods.map((m) => css.match(new RegExp(`\\.tinto\\.mood-${m} \\{\\s*--tb: (#[0-9a-f]{6})`))?.[1]);
		// "happy" uses the base colour of .tinto.
		expect(colours.slice(1).every(Boolean)).toBe(true);
		expect(new Set(colours.slice(1)).size).toBe(moods.length - 1);
	});

	it("reacts to every event with a line, and takes turns", () => {
		for (const event of EVENTS) {
			const r = reaction(event, 0);
			expect(r.line.trim(), event).not.toBe("");
			expect(moods, event).toContain(r.mood);
		}
		expect(reaction("task-right", 0).line).not.toBe(reaction("task-right", 1).line);
		expect(reaction("task-right", 4).line).toBe(reaction("task-right", 0).line);
	});

	it("never judges: mistakes make him encourage, never cheer or say 'falsch'", () => {
		for (const event of ["quiz-wrong", "task-wrong", "task-reveal"] as const)
			for (let n = 0; n < 4; n += 1) {
				const r = reaction(event, n);
				expect(r.mood, event).toBe("encourage");
				expect(r.line, event).not.toMatch(/falsch|schlecht|dumm/i);
			}
		for (const event of ["quiz-right", "quiz-star", "goal", "workshop-star", "task-right", "level1-star", "level2-star", "sticker"] as const)
			expect(reaction(event).mood, event).toBe("cheer");
	});

	it("tells important news (stars, goals, mistakes) also outside the panel", () => {
		for (const event of ["quiz-star", "goal", "workshop-star", "level1-star", "level2-star", "quiz-wrong"] as const)
			expect(reaction(event).important, event).toBe(true);
		expect(reaction("wave").important).toBe(false);
	});

	it("renders the panel with escaped text and the right buttons", () => {
		const awake = companionHtml({ mood: "happy", line: "<b>Hallo</b>", resting: false });
		expect(awake).toContain("&lt;b&gt;Hallo&lt;/b&gt;");
		expect(awake).toContain('data-action="wave"');
		expect(awake).toContain('data-action="rest"');
		expect(awake).toContain('aria-live="polite"');
		const asleep = companionHtml({ mood: "sleep", line: "z", resting: true });
		expect(asleep).toContain('data-action="wake"');
		expect(asleep).toContain('class="scene resting"');
	});
});

describe("Lektionsfluss", () => {
	it("hands out every explanation in pieces and keeps all of it in the page", () => {
		for (const l of LESSONS) {
			const pieces = learnPieces(l);
			expect(pieces, l.id).toHaveLength(l.paragraphs.length + 3);
			const page = learnHtml(l, 1);
			// Exactly one piece is visible at the start.
			expect(page.match(/data-piece="\d+" tabindex="-1">/g), l.id).toHaveLength(1);
			expect(page.match(/ hidden>/g), l.id).toHaveLength(pieces.length - 1);
			for (const p of l.paragraphs) expect(page, l.id).toContain(esc(p));
			for (const line of l.example.lines) expect(page, l.id).toContain(esc(line));
			expect(page, l.id).toContain(`<span class="sr-only">${esc(l.takeaway)}</span>`);
			for (const t of l.terms) expect(page, l.id).toContain(`data-meaning="${esc(t.meaning)}"`);
			expect(page, l.id).not.toMatch(/undefined|NaN|\[object/);
			// Shown in full, nothing is hidden.
			expect(learnHtml(l, pieces.length), l.id).not.toContain(" hidden>");
		}
	});

	it("offers 'Weiter lesen' until the end, then the Schnellcheck", () => {
		expect(learnNextHtml(1, 6)).toContain('data-action="learn-more"');
		expect(learnNextHtml(1, 6)).toContain('data-action="learn-all"');
		expect(learnNextHtml(6, 6)).toContain('data-step="2"');
		expect(learnNextHtml(6, 6)).not.toContain("learn-more");
	});

	it("keeps a lesson as it was when the child comes back from Tinto's game", () => {
		// Review of PR #156: the way back from the game used to reset the lesson.
		expect(keepsLesson("spiel", "nomen-artikel", "nomen-artikel", "nomen-artikel")).toBe(true);
		expect(keepsLesson("lesson", "nomen-artikel", null, "nomen-artikel")).toBe(true);
		// Other ways in start afresh.
		expect(keepsLesson("spiel", "nomen-artikel", null, "nomen-artikel")).toBe(false);
		expect(keepsLesson("spiel", "nomen-artikel", "vier-faelle", "nomen-artikel")).toBe(false);
		expect(keepsLesson("path", "nomen-artikel", "nomen-artikel", "nomen-artikel")).toBe(false);
		expect(keepsLesson("lesson", "nomen-artikel", null, "vier-faelle")).toBe(false);
	});

	it("has four steps, and a fifth only with a Schreibtisch", () => {
		for (const l of LESSONS) {
			expect(stepsOf(l), l.id).toEqual(l.desk ? [1, 2, 3, 4, 5] : [1, 2, 3, 4]);
			expect(isStep(l, 5), l.id).toBe(!!l.desk);
			expect(isStep(l, 0)).toBe(false);
		}
	});

	it("marks the current step and shows the stars of each step", () => {
		const l = lesson("nomen-artikel");
		const progress = freshProgress();
		progress.quizDone.push(l.id);
		const bar = stepperHtml(l, 3, stars(progress, l.id));
		expect(bar.match(/aria-current="step"/g)).toHaveLength(1);
		expect(bar).toMatch(/data-step="3" aria-label="Werkstatt, 0 von 1 Stern" aria-current="step"/);
		expect(bar).toContain('aria-label="Schnellcheck, 1 von 1 Stern"');
		expect(bar).toContain('aria-label="Üben, 0 von 2 Sternen"');
		expect(bar.match(/class="star on"/g)).toHaveLength(1);
	});
});

describe("Lektionsfluss: Layout und Wegweiser (Zweitprüfung)", () => {
	const rule = (selector: string) => css.match(new RegExp(`(^|\\n)${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")} \\{[^}]*\\}`))?.[0] ?? "";

	it("lets every step take the room it needs; number and stars never shrink out of the button", () => {
		expect(rule(".stepper li")).toContain("flex: 1 1 auto");
		expect(rule(".stepper li")).toContain("min-width: 0");
		expect(rule(".stepper li")).not.toMatch(/min-width: \d*\.?\d+rem/);
		expect(rule(".stepper-item .step,\n.stepper-stars")).toContain("flex: none");
		expect(rule(".stepper-label")).toContain("text-overflow: ellipsis");
		// Five steps (Schreibtisch) switch to the compact form earlier than four.
		expect(css).toMatch(/@container \(max-width: 872px\) \{\s*\.stepper ol:has\(> li:nth-child\(5\)\)/);
		expect(css).toMatch(/@container \(max-width: 700px\)/);
	});

	it("keeps the steps and Tinto's panel below the sticky header, however tall it wraps", () => {
		expect(rule(".stepper")).toContain("scroll-margin-top: calc(var(--header-h");
		expect(css).toContain("top: calc(var(--header-h, 4.6rem) + 1rem);");
	});

	it("points to steps, not to 'oben' or 'unten' on a page that no longer scrolls", () => {
		const stale = /(Übungen|Aufgaben) (weiter )?unten|Text (weiter )?oben|(siehe|wie) (oben|unten)/;
		for (const l of LESSONS) {
			expect(l.workshop.intro, l.id).not.toMatch(stale);
			for (const level of [1, 2] as const)
				for (let i = 1; i <= 30; i += 1) {
					const t = makeTask(l.id, l.generators, level, i);
					expect(`${t.prompt} ${t.hint}`, `${l.id}/${level}`).not.toMatch(stale);
				}
		}
	});
});

describe("Werkstatt-Effekte", () => {
	it("finds the words a machine changed", () => {
		expect(changedWords(undefined, "der Hund")).toEqual([false, false]);
		expect(changedWords("der Hund", "der Hund")).toEqual([false, false]);
		expect(changedWords("Ich sehe der Hund.", "Ich sehe den Hund.")).toEqual([false, false, true, false]);
		expect(changedWords("der Hund", "der kleine Hund")).toEqual([false, true, false]);
		expect(changedWords("A B C", "X Y Z")).toEqual([true, true, true]);
	});

	it("cuts a word into the pieces the child chose", () => {
		const letters = [..."Sonnenschirm"];
		const at = (...k: number[]) => letters.map((_, i) => k.includes(i));
		expect(cutPieces(letters, at())).toEqual(["Sonnenschirm"]);
		expect(cutPieces(letters, at(2, 5))).toEqual(["Son", "nen", "schirm"]);
		expect(cutPieces(letters, at(11))).toEqual(["Sonnenschirm"]);
	});

	it("writes capital letters, umlauts included", () => {
		expect(capitalFirst("hund")).toBe("Hund");
		expect(capitalFirst("überraschung")).toBe("Überraschung");
		expect(capitalFirst("äpfel")).toBe("Äpfel");
		expect(capitalFirst("")).toBe("");
	});

	it("types capitals only in the two capital-letter workshops", () => {
		const flagged = LESSONS.filter((l) => l.workshop.kind === "slots" && (l.workshop as SlotWorkshop).capitals).map((l) => [
			l.id,
			(l.workshop as SlotWorkshop).capitals,
		]);
		expect(flagged).toEqual([
			["nomen-artikel", "type"],
			["grossschreibung", "crown"],
		]);
		const ws = lesson("nomen-artikel").workshop as SlotWorkshop;
		const marked = tapSlot(ws, initialSlots(ws), "hund", 2);
		const page = workshopHtml(ws, marked);
		expect(page).toContain('<span class="cap">H</span>und');
		expect(page).toContain('aria-label="Hund, markiert als Nomen"');
		expect(page).toContain(">garten<");
		const crown = lesson("grossschreibung").workshop as SlotWorkshop;
		expect(workshopHtml(crown, tapSlot(crown, initialSlots(crown), "reise", 0))).toContain('<span class="crown" aria-hidden="true">👑</span>');
	});

	it("puts syllables on arcs and building blocks in boxes, as cut now", () => {
		const silben = lesson("silbentrennung").workshop as SlotWorkshop;
		const start = workshopHtml(silben, initialSlots(silben));
		expect(start.match(/class="syl"/g)).toHaveLength(3);
		const cut = tapSlot(silben, tapSlot(silben, initialSlots(silben), "sonnenschirm", 2), "sonnenschirm", 5);
		expect(workshopHtml(silben, cut).match(/class="syl ok"/g)).toHaveLength(3);
		const bausteine = lesson("wortbausteine").workshop as SlotWorkshop;
		expect(workshopHtml(bausteine, solvedSlots(bausteine))).toContain('class="brick ok"');
		expect(workshopHtml(bausteine, initialSlots(bausteine))).not.toContain("syl");
	});

	it("lets a solved gap word snap together, keeping the chosen letters tappable", () => {
		const ws = lesson("kurze-selbstlaute").workshop as SlotWorkshop;
		const page = workshopHtml(ws, solvedSlots(ws, ["doppelt"]));
		const doppelt = page.slice(page.indexOf('data-puzzle-box="doppelt"'), page.indexOf('data-puzzle-box="ck"'));
		expect(doppelt.match(/gap-group done/g)).toHaveLength(3);
		expect(doppelt.match(/data-action="slot"/g)).toHaveLength(3);
		expect(doppelt).toContain('data-choice="tt" aria-pressed="true"');
		// The other puzzles still offer all their choices.
		expect(page.slice(page.indexOf('data-puzzle-box="ck"'))).not.toContain("gap-group done");
	});

	it("draws a locomotive that steams only while the sentence is right", () => {
		const ws = lesson("satzglieder-umstellprobe").workshop as TrainWorkshop;
		const start = initialTrain(ws);
		expect(workshopHtml(ws, start)).toContain('class="train ok"');
		expect(workshopHtml(ws, start)).toContain('<li class="loco" aria-hidden="true">');
		expect(workshopHtml(ws, start).match(/data-drag="\d"/g)).toHaveLength(ws.wagons.length);
		expect(workshopHtml(ws, wagonToFront(ws, start, 3))).toContain('class="train"');
	});

	it("lights up the words a machine changed", () => {
		const ws = lesson("vier-faelle").workshop as MachineWorkshop;
		const state = initialMachine(ws);
		const before = ws.view(state.values).display;
		expect(workshopHtml(ws, state)).not.toContain("mark");
		expect(workshopHtml(ws, state, [], before)).not.toContain('class="changed"');
		const page = workshopHtml(ws, { ...state, values: { ...state.values, fall: "4. Fall" } }, [], before);
		expect(page).toContain('<mark class="changed">');
		expect(page).toContain('class="gears turn"');
	});
});

describe("Satzzug: Ziehen und Ablegen", () => {
	const ws = lesson("satzglieder-umstellprobe").workshop as TrainWorkshop;

	it("moves one wagon to its new place in one move", () => {
		const s = moveWagonTo(ws, initialTrain(ws), 3, 0);
		expect(trainSentence(ws, s)).toBe("Am Montag Tinto bringt seiner Oma einen Kuchen.");
		expect(s.moves).toBe(1);
		expect(moveWagonTo(ws, s, 2, 2)).toBe(s);
		expect(moveWagonTo(ws, s, -1, 2)).toBe(s);
		expect(moveWagonTo(ws, s, 0, 9)).toBe(s);
	});

	it("gives no credit for the places a wagon passes while it is dragged", () => {
		// Ja-Nein-Frage "Bringt seiner Oma Tinto …?", then the verb is dragged to the end.
		let s = moveWagon(ws, wagonToFront(ws, initialTrain(ws), 1), 1, 1);
		s = setEnd(ws, s, ".");
		expect(trainSentence(ws, s).startsWith("Bringt seiner Oma")).toBe(true);
		const dragged = moveWagonTo(ws, s, 0, s.order.length - 1);
		expect(isStatement(ws, dragged)).toBe(false);
		// Step by step the train would pass "Seiner Oma bringt …" and count it as seen.
		const oma = ws.wagons.findIndex((w) => w.mid === "seiner Oma");
		expect(dragged.frontSeen).not.toContain(oma);
		expect(moveWagon(ws, s, 0, 1).frontSeen).toContain(oma);
	});
});

describe("Ruhige Ansicht", () => {
	afterEach(() => {
		vi.useRealTimers();
		vi.unstubAllGlobals();
	});

	it("finishes Tinto's writing at once when 'Ruhig' is switched on midway", () => {
		vi.useFakeTimers();
		const dataset: Record<string, string> = {};
		vi.stubGlobal("document", { documentElement: { dataset } });
		vi.stubGlobal("matchMedia", () => ({ matches: false }));
		vi.stubGlobal("window", globalThis);
		const classes = new Set<string>();
		const target = { textContent: "", classList: { add: (c: string) => classes.add(c), remove: (c: string) => classes.delete(c) } };
		const text = "Nomen benennen Lebewesen, Dinge und Gedachtes. Sie haben einen Artikel.";
		typewrite(target as unknown as HTMLElement, text);
		vi.advanceTimersByTime(90);
		expect(target.textContent.length).toBeGreaterThan(0);
		expect(target.textContent.length).toBeLessThan(text.length);
		dataset.motion = "calm";
		vi.advanceTimersByTime(30);
		expect(target.textContent).toBe(text);
		expect(classes.has("writing")).toBe(false);
	});

	it("stops every movement for the calm view and for the device setting", () => {
		expect(css).toMatch(/:root\[data-motion="calm"\] \*,[^{]*\{\s*animation: none !important;\s*transition: none !important;/);
		expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{\s*\*,[^{]*\{\s*animation: none !important;/);
	});

	it("applies the stored choice before the page is drawn", () => {
		expect(MOTION_KEY).toBe("deutsch_gs4_motion");
		expect(html).toContain(`localStorage.getItem('${MOTION_KEY}') === 'calm'`);
		expect(html).toMatch(/id="motion" aria-pressed="false"/);
	});

	it("defines every animation it uses", () => {
		const defined = new Set([...css.matchAll(/@keyframes ([\w-]+)/g)].map((m) => m[1]));
		const used = new Set<string>();
		for (const m of css.matchAll(/animation: ([^;]+);/g))
			for (const part of m[1].split(","))
				for (const word of part.trim().split(/\s+/))
					if (/^[a-z][\w-]*$/.test(word) && !["none", "infinite", "linear", "alternate", "alternate-reverse", "normal", "backwards", "forwards", "ease", "ease-in", "ease-out", "ease-in-out"].includes(word)) used.add(word);
		for (const name of used) expect(defined, name).toContain(name);
	});
});
