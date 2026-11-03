import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import type { Goal, MachineState, MachineWorkshop, SlotState, SlotWorkshop, TrainState, TrainWorkshop } from "../src/types";
import {
	choosePen,
	initialMachine,
	initialSlots,
	initialState,
	initialTrain,
	isQuestion,
	isSlot,
	isStatement,
	moveWagon,
	puzzleSolved,
	reachedGoals,
	setControl,
	setEnd,
	slotsOf,
	solvedSlots,
	tapSlot,
	trainSentence,
	verbPosition,
	wagonToFront,
} from "../src/workshop/engine";
import { workshopHtml } from "../src/workshop/view";

/** Every reachable machine state, visiting all combinations in turn. */
function* machineWalk(ws: MachineWorkshop): Generator<MachineState> {
	let state = initialMachine(ws);
	const combos = ws.controls.reduce<Record<string, string>[]>(
		(acc, c) => acc.flatMap((a) => c.options.map((o) => ({ ...a, [c.id]: o }))),
		[{}],
	);
	for (const combo of combos) {
		for (const [id, value] of Object.entries(combo)) state = setControl(ws, state, id, value);
		yield state;
	}
}

/** Put wagon `w` in front and move the verb to second place. */
function statementWith(ws: TrainWorkshop, state: TrainState, w: number): TrainState {
	let s = wagonToFront(ws, state, state.order.indexOf(w));
	while (verbPosition(ws, s) > 1) s = moveWagon(ws, s, verbPosition(ws, s), -1);
	return s;
}

describe("Werkstätten: drei Ziele, keines am Start, jedes erreichbar", () => {
	for (const lesson of LESSONS) {
		const ws = lesson.workshop;
		it(`${lesson.id} (${ws.kind})`, () => {
			expect(ws.goals).toHaveLength(3);
			expect(new Set(ws.goals.map((g) => g.id)).size).toBe(3);
			expect(reachedGoals(ws, initialState(ws)), "nothing at the start").toEqual([]);
			if (ws.kind === "slots") {
				const goals = ws.goals as Goal<SlotState>[];
				// Each puzzle alone reaches exactly its own goal.
				ws.puzzles.forEach((p, i) => {
					const only = solvedSlots(ws, [p.id]);
					expect(goals.filter((g) => g.reached(only)).map((g) => g.id)).toEqual([goals[i].id]);
				});
				expect(reachedGoals(ws, solvedSlots(ws))).toHaveLength(3);
			} else if (ws.kind === "train") {
				const goals = ws.goals as Goal<TrainState>[];
				let s = initialTrain(ws);
				const nonVerb = ws.wagons.map((_, i) => i).filter((i) => !ws.wagons[i].verb);
				for (const w of nonVerb) {
					s = statementWith(ws, s, w);
					expect(isStatement(ws, s), trainSentence(ws, s)).toBe(true);
				}
				expect(goals[0].reached(s) && goals[1].reached(s)).toBe(true);
				const verb = ws.wagons.findIndex((w) => w.verb);
				s = setEnd(ws, wagonToFront(ws, s, s.order.indexOf(verb)), "?");
				expect(goals[2].reached(s), trainSentence(ws, s)).toBe(true);
			} else {
				const goals = ws.goals as Goal<MachineState>[];
				const hit = new Set<string>();
				for (const state of machineWalk(ws))
					for (const g of goals) if (g.reached(state)) hit.add(g.id);
				expect([...hit].sort()).toEqual(goals.map((g) => g.id).sort());
			}
		});
	}
});

describe("Markier- und Lückenrätsel sind sauber gebaut", () => {
	const slotLessons = LESSONS.filter((l) => l.workshop.kind === "slots");
	it("uses only known pens and offers every right gap option", () => {
		for (const l of slotLessons) {
			const ws = l.workshop as SlotWorkshop;
			const pens = new Set(ws.pens.map((p) => p.value));
			for (const p of ws.puzzles) {
				const slots = slotsOf(p);
				expect(slots.some((s) => s.answer !== ""), `${l.id}/${p.id}`).toBe(true);
				for (const s of slots) {
					if (s.options) {
						expect(s.options, `${l.id}/${p.id}`).toContain(s.answer);
						expect(new Set(s.options).size).toBe(s.options.length);
					} else if (s.answer) expect(pens.has(s.answer), `${l.id}/${p.id}: ${s.answer}`).toBe(true);
				}
				if (ws.variant === "mark") expect(slots.every((s) => s.text), `${l.id}/${p.id}`).toBe(true);
			}
		}
	});

	it("cannot be solved by marking everything with one pen", () => {
		for (const l of slotLessons) {
			const ws = l.workshop as SlotWorkshop;
			if (ws.variant === "gap") continue;
			for (const pen of ws.pens) {
				let s = choosePen(ws, initialSlots(ws), pen.value);
				for (const p of ws.puzzles) slotsOf(p).forEach((_, i) => (s = tapSlot(ws, s, p.id, i)));
				for (const p of ws.puzzles) expect(puzzleSolved(ws, s, p.id), `${l.id}/${p.id}/${pen.value}`).toBe(false);
			}
		}
	});

	it("toggles a mark off when tapped twice and ignores foreign choices", () => {
		const ws = LESSONS[0].workshop as SlotWorkshop;
		const p = ws.puzzles[0];
		let s = tapSlot(ws, initialSlots(ws), p.id, 2);
		expect(s.values[p.id][2]).toBe("N");
		s = tapSlot(ws, s, p.id, 2);
		expect(s.values[p.id][2]).toBe("");
		expect(tapSlot(ws, s, "nope", 0)).toBe(s);
		const gap = LESSONS.find((l) => l.id === "kurze-selbstlaute")?.workshop as SlotWorkshop;
		const g0 = gap.puzzles[0];
		const before = initialSlots(gap);
		expect(tapSlot(gap, before, g0.id, 0, "xyz")).toBe(before);
		expect(tapSlot(gap, before, g0.id, 0, "tt").values[g0.id][0]).toBe("tt");
	});

	it("keeps the cut words intact", () => {
		const silben = LESSONS.find((l) => l.id === "silbentrennung")?.workshop as SlotWorkshop;
		const words = silben.puzzles.map((p) =>
			p.parts.map((x) => (isSlot(x) ? (x.answer ? "-" : "") : x)).join(""),
		);
		expect(words).toEqual(["Son-nen-schirm", "Zu-cker-do-se", "Scho-ko-la-den-ku-chen"]);
	});
});

describe("Satzzug", () => {
	const ws = LESSONS.find((l) => l.id === "satzglieder-umstellprobe")?.workshop as TrainWorkshop;
	it("starts with a correct statement whose verb is second", () => {
		const s = initialTrain(ws);
		expect(trainSentence(ws, s)).toBe("Tinto bringt seiner Oma am Montag einen Kuchen.");
		expect(isStatement(ws, s)).toBe(true);
	});
	it("capitalises the front wagon and rejects a verb in third place", () => {
		const s = wagonToFront(ws, initialTrain(ws), 3);
		expect(trainSentence(ws, s)).toBe("Am Montag Tinto bringt seiner Oma einen Kuchen.");
		expect(isStatement(ws, s)).toBe(false);
		expect(isQuestion(ws, s)).toBe(false);
		expect(moveWagon(ws, s, 0, -1)).toBe(s);
	});
});

describe("Werkstatt-HTML", () => {
	it("renders every workshop at the start without leaking undefined", () => {
		for (const l of LESSONS) {
			const html = workshopHtml(l.workshop, initialState(l.workshop));
			expect(html, l.id).not.toMatch(/undefined|NaN|\[object/);
			expect(html, l.id).toContain('data-action="');
		}
	});
	it("escapes the text it shows", () => {
		const ws: SlotWorkshop = {
			kind: "slots",
			variant: "mark",
			title: "t",
			intro: "i",
			pens: [{ value: "N", label: "Nomen", colour: "blue" }],
			puzzles: [{ id: "x", parts: [{ text: "<b>", answer: "N" }, "&"] }],
			goals: [] as unknown as SlotWorkshop["goals"],
		};
		const html = workshopHtml(ws, initialSlots(ws));
		expect(html).toContain("&lt;b&gt;");
		expect(html).not.toContain("<b>");
	});
});
