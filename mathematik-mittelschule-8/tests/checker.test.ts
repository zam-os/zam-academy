import { describe, expect, it } from "vitest";
import { findLessonById } from "../src/curriculum";
import {
  checkTask,
  parseNumberCandidates,
  wrongAnswerHint,
} from "../src/exercises/checker";
import { createRng } from "../src/exercises/rng";
import type { ExerciseTask, NumberField } from "../src/model/types";

const field = (answer: number, digits = 2, label = "x ="): NumberField => ({
  kind: "number",
  label,
  answer,
  unit: "",
  digits,
});
const task = (fields: ExerciseTask["fields"]): ExerciseTask => ({
  fields,
  prompt: "",
  given: [],
  steps: [],
});

describe("Zahlenprüfung und Hinweise", () => {
  it("accepts decimal comma, fractions, written minus and units but rejects empty or malformed inputs", () => {
    expect(parseNumberCandidates("x = −7,5 cm")).toEqual([-7.5]);
    expect(parseNumberCandidates("−15/2")).toEqual([-7.5]);
    expect(parseNumberCandidates("25 %", "%")).toEqual([25]);
    expect(parseNumberCandidates("25 %")).toEqual([0.25]);
    for (const value of ["", "-", "3/0", "1/2/3", "keine Zahl"])
      expect(parseNumberCandidates(value)).toEqual([]);
    expect(checkTask(task([field(2)]), [""]).status).toBe("invalid");
  });

  it("accepts the required rounding but rejects a neighbouring tenth and wrong exact integers", () => {
    const rounded = task([field(Math.sqrt(52), 1)]);
    expect(checkTask(rounded, ["7,2"]).status).toBe("correct");
    expect(checkTask(rounded, ["7.3"]).status).toBe("wrong");
    expect(checkTask(task([field(30, 0)]), ["29"]).status).toBe("wrong");
    expect(checkTask(task([field(0.6, 1)]), ["0,61"]).status).toBe("wrong");
  });

  it("detects reversed answers and sign errors without giving away the result", () => {
    const two = task([field(3, 0, "Radius ="), field(7, 0, "Höhe =")]);
    expect(wrongAnswerHint(two, checkTask(two, ["7", "3"]))).toContain(
      "vertauscht",
    );
    const signed = task([field(-7)]);
    expect(wrongAnswerHint(signed, checkTask(signed, ["7"]))).toBe(
      "Prüfe das Vorzeichen.",
    );
  });

  it("keeps targeted bracket-equation slip hints available on transfer level two", () => {
    const generator = findLessonById("gl-2-gleichungen-klammern")!.lesson.exercises.find(
      (g) => g.id === "bracket-both-sides",
    )!;
    let exercised = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const generated = generator.make(createRng(seed), 2);
      const first = generated.fields[0];
      if (first.kind !== "number") throw new Error("missing number field");
      for (const slip of first.slips ?? []) {
        const values = generated.fields.map((f) =>
          f.kind === "number" ? String(f.answer) : String(f.correctIndex),
        );
        values[0] = String(slip.value);
        const result = checkTask(generated, values);
        expect(result.status).toBe("wrong");
        expect(wrongAnswerHint(generated, result)).toBe(slip.hint);
        exercised++;
      }
    }
    expect(exercised).toBeGreaterThan(30);
  });

  it("computes annulus and sector readouts consistently at full circle and half ring", () => {
    const lab = findLessonById("kf-3-kreisring-sektor")!.lesson.lab;
    const area = lab.readouts.find((r) => r.key === "area")!;
    expect(Number(area.compute({ R: 5, r: 3, mu: 360 }))).toBeCloseTo(16 * Math.PI, 4);
    expect(Number(area.compute({ R: 5, r: 3, mu: 180 }))).toBeCloseTo(8 * Math.PI, 4);
  });
});

describe("Exact answers of any size", () => {
  const numberTask = (
    answer: number,
    digits: number,
    tolerances: { tolerance?: number; absTolerance?: number } = {},
  ): ExerciseTask => ({
    prompt: "",
    given: [],
    steps: [],
    fields: [{ kind: "number", label: "x =", answer, unit: "", digits, ...tolerances }],
  });
  const statusOf = (t: ExerciseTask, typed: string) => checkTask(t, [typed]).status;

  it("rejects a neighbouring whole number at any size and checks tolerances", () => {
    for (const answer of [999999999, 2999999999, 4000000001, 990000000000]) {
      const t = numberTask(answer, 0);
      expect(statusOf(t, String(answer))).toBe("correct");
      for (const off of [answer - 1, answer + 1, answer - 2, answer + 3])
        expect(statusOf(t, String(off)), String(off)).toBe("wrong");
    }
    const noisy = (0.1 + 0.2) * 1e7;
    expect(statusOf(numberTask(noisy, 0), "3000000")).toBe("correct");
    expect(statusOf(numberTask(noisy, 0), "3000001")).toBe("wrong");
    expect(statusOf(numberTask(1 / 3, 9), "1/3")).toBe("correct");
    expect(statusOf(numberTask(1 / 3, 9), "0,34")).toBe("wrong");
    const rounded = numberTask(Math.sqrt(52), 1);
    expect(statusOf(rounded, "7,2")).toBe("correct");
    expect(statusOf(rounded, "7,3")).toBe("wrong");
    expect(statusOf(numberTask(Math.PI, 2, { tolerance: 0.01 }), "3,14")).toBe("correct");
    expect(statusOf(numberTask(Math.PI, 2, { tolerance: 0.01 }), "3,2")).toBe("wrong");
  });
});
