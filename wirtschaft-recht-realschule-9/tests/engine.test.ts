import { describe, expect, it } from "vitest";
import { checkExercise, numberMatches, parseNumbers } from "../src/exercises/checker";
import { makeExercise } from "../src/exercises/generators";
import { createRng } from "../src/exercises/rng";
import { rich } from "../src/format";
import { clampState, goalsReached, initialState, type LabDef, type LabState } from "../src/labs/engine";
import { LABS } from "../src/labs/registry";
import type { CaseFile, PracticeKind, Workshop } from "../src/model/types";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import {
  canAcceptSelfAssessment,
  checkCase,
  checkWorkshop,
  initialOrder,
  moveEntry,
  shownOptions,
} from "../src/workshop";

const defs = Object.values(LABS);

/** Every control at its lowest, middle and highest value, in every combination. */
function grid(def: LabDef): LabState[] {
  let states: LabState[] = [{}];
  for (const s of def.sliders) {
    const values = [s.min, Math.round(((s.min + s.max) / 2 / s.step)) * s.step, s.max];
    states = states.flatMap((state) => values.map((v) => ({ ...state, [s.key]: v })));
  }
  for (const s of def.selects)
    states = states.flatMap((state) => s.options.map((o) => ({ ...state, [s.key]: o.value })));
  return states.map((state) => clampState(def, state));
}

describe("labs", () => {
  for (const def of defs) {
    it(`${def.kind}: every assignment has a state that reaches it`, () => {
      expect(def.goals.length).toBeGreaterThanOrEqual(3);
      expect(new Set(def.goals.map((g) => g.id)).size).toBe(def.goals.length);
      for (const goal of def.goals) {
        const witness = def.witness[goal.id];
        expect(witness, `witness for ${goal.id}`).toBeDefined();
        // A witness is a legal state: every value sits on its control's grid.
        expect(clampState(def, witness)).toEqual({ ...initialState(def), ...witness });
        expect(goalsReached(def, witness)).toContain(goal.id);
      }
      expect(Object.keys(def.witness).sort()).toEqual(def.goals.map((g) => g.id).sort());
    });
    it(`${def.kind}: draws a finite, readable view in every corner of its controls`, () => {
      for (const state of grid(def)) {
        const view = def.view(state);
        const text = `${view.figure}${view.readouts.flat().join(" ")}${view.note}`;
        expect(text, JSON.stringify(state)).not.toMatch(/NaN|Infinity|undefined/);
        expect(view.figure.length).toBeGreaterThan(40);
        expect(view.readouts.length).toBeGreaterThan(0);
        expect(view.note.length).toBeGreaterThan(20);
      }
    });
    it(`${def.kind}: not every assignment is reached at the start`, () => {
      expect(goalsReached(def, initialState(def)).length).toBeLessThan(def.goals.length);
    });
  }
  it("clamps to range and grid", () => {
    const def = LABS.markt;
    expect(clampState(def, { n: 999, a: -999, p: 7.3 })).toEqual({ n: 30, a: -30, p: 7.5 });
    expect(clampState(def, { n: Number.NaN })).toEqual(initialState(def));
  });
});

describe("practice", () => {
  const kinds: PracticeKind[] = [
    "gleichgewicht",
    "ueberhang",
    "zins",
    "zinseszins",
    "ratenkredit",
    "sozialabgaben",
    "verzugszins",
  ];
  for (const kind of kinds)
    for (const level of [1, 2] as const)
      it(`${kind} level ${level}: answers are exact, finite and solvable by the learner's own input`, () => {
        const seen = new Set<string>();
        for (let seed = 1; seed <= 300; seed++) {
          const task = makeExercise(kind, createRng(seed), level);
          seen.add(`${task.prompt}${JSON.stringify(task.table ?? null)}`);
          expect(task.fields.length).toBeGreaterThan(0);
          expect(task.prompt.length).toBeGreaterThan(30);
          expect(task.hint.length).toBeGreaterThan(10);
          expect(`${task.prompt}${task.solution}`).not.toMatch(/NaN|Infinity|undefined/);
          for (const field of task.fields) {
            expect(Number.isFinite(field.answer)).toBe(true);
            expect(field.answer).toBeGreaterThan(0);
            expect(Math.round(field.answer * 100) / 100).toBe(field.answer);
          }
          const correct = task.fields.map((f) => String(f.answer).replace(".", ","));
          expect(checkExercise(task, correct), `${kind} seed ${seed}`).toBe(true);
          const wrong = task.fields.map((f, i) => String(i === 0 ? f.answer + 1 : f.answer));
          expect(checkExercise(task, wrong)).toBe(false);
          expect(checkExercise(task, correct.slice(1))).toBe(false);
          expect(task.solution.length).toBeGreaterThan(20);
          if (task.table) {
            for (const row of task.table.rows) expect(row).toHaveLength(task.table.head.length);
          }
        }
        expect(seen.size).toBeGreaterThan(8);
      });
  it("market tables have a whole equilibrium that the table shows", () => {
    for (let seed = 1; seed <= 300; seed++) {
      const task = makeExercise("gleichgewicht", createRng(seed), 1);
      const rows = task.table?.rows ?? [];
      const eq = rows.find((row) => row[1] === row[2]);
      expect(eq).toBeDefined();
      expect(task.fields[1].answer).toBe(eq?.[1]);
    }
  });
  it("accepts decimal commas, grouping and units but not ambiguous junk", () => {
    expect(numberMatches("1.234,50", 1234.5)).toBe(true);
    expect(numberMatches("1234.5 Euro", 1234.5)).toBe(true);
    expect(numberMatches("7,5 %", 7.5)).toBe(true);
    expect(numberMatches("1,234,50", 1234.5)).toBe(false);
    expect(numberMatches("zwölf", 12)).toBe(false);
    expect(parseNumbers("−3,5")).toEqual([-3.5]);
  });
});

describe("workshop and case logic", () => {
  const timeline: Workshop = {
    kind: "timeline",
    title: "t",
    instruction: "i",
    categories: [],
    entries: [
      { text: "a", target: 0, feedback: "" },
      { text: "b", target: 1, feedback: "" },
      { text: "c", target: 2, feedback: "" },
    ],
    conclusion: "",
  };
  it("never starts a timeline solved and rejects duplicates", () => {
    for (const key of ["x", "y", "z", "lesson-1"]) {
      const order = initialOrder(timeline, key);
      expect(checkWorkshop(timeline, order).every(Boolean)).toBe(false);
    }
    expect(checkWorkshop(timeline, [0, 1, 2]).every(Boolean)).toBe(true);
    expect(checkWorkshop(timeline, [0, 0, 2]).some(Boolean)).toBe(false);
    expect(checkWorkshop(timeline, [0, 1]).some(Boolean)).toBe(false);
    expect(moveEntry([0, 1, 2], 0, -1)).toEqual([0, 1, 2]);
    expect(moveEntry([0, 1, 2], 0, 1)).toEqual([1, 0, 2]);
  });
  const file: CaseFile = {
    title: "t",
    story: "s",
    verdict: "v",
    steps: [
      { question: "q1", options: ["right", "wrong", "other"], answer: 0, explanation: "e" },
      { question: "q2", options: ["x", "right"], answer: 1, explanation: "e" },
    ],
  };
  it("keeps the right option right after shuffling", () => {
    for (const key of ["a", "b", "c", "wh-gleichgewicht"]) {
      for (let i = 0; i < file.steps.length; i++) {
        const shown = shownOptions(file, i, key);
        expect(shown.options[shown.answer]).toBe(file.steps[i].options[file.steps[i].answer]);
        expect([...shown.options].sort()).toEqual([...file.steps[i].options].sort());
      }
      const answers = file.steps.map((_, i) => shownOptions(file, i, key).answer);
      expect(checkCase(file, key, answers)).toEqual([true, true]);
      expect(checkCase(file, key, [])).toEqual([false, false]);
    }
  });
  it("needs a real sentence and all three criteria for a self-assessment", () => {
    expect(canAcceptSelfAssessment("zu kurz", [true, true, true])).toBe(false);
    expect(canAcceptSelfAssessment("Das ist eine längere Begründung.", [true, true, false])).toBe(false);
    expect(canAcceptSelfAssessment("Das ist eine längere Begründung.", [true, true, true])).toBe(true);
  });
});

describe("text and links", () => {
  it("escapes everything and allows bold only", () => {
    expect(rich("<img src=x onerror=1> **fett**")).toBe("&lt;img src=x onerror=1&gt; <strong>fett</strong>");
  });
  it("parses the link a ZAM card cites and refuses injection", () => {
    expect(lessonLink("re-lebensalter")).toBe(
      "https://academy.zam-os.org/wirtschaft-recht-realschule-9/#lesson=re-lebensalter",
    );
    expect(parseTrainingDeepLink("#lesson=re-lebensalter&level=2")).toEqual({
      lessonId: "re-lebensalter",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=7")).toEqual({});
  });
});
