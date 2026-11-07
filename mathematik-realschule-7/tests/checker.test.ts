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
    const two = task([field(3, 0, "Breite ="), field(7, 0, "Höhe =")]);
    expect(wrongAnswerHint(two, checkTask(two, ["7", "3"]))).toContain(
      "vertauscht",
    );
    const signed = task([field(-7)]);
    expect(wrongAnswerHint(signed, checkTask(signed, ["7"]))).toBe(
      "Prüfe das Vorzeichen.",
    );
  });

  it("keeps targeted equation-slip hints available on transfer level two", () => {
    const generator = findLessonById("al-2-gleichungen")!.lesson.exercises.find(
      (g) => g.id === "ax-plus-b",
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

  it("does not let rounded distance displays flip the circle yes/no decision", () => {
    const lab = findLessonById("ol-1-kreisbereiche")!.lesson.lab;
    const decision = lab.readouts.find((readout) => readout.key === "belongs")!;
    // Both distances display as 3,00, but only the true distance decides membership.
    for (const mode of [1, 2, 3]) {
      const inside = decision.compute({ x: 2.999, y: 0, radius: 3, mode });
      const outside = decision.compute({ x: 3.001, y: 0, radius: 3, mode });
      expect(inside).not.toBe(outside);
    }
    expect(decision.compute({ x: 3, y: 0, radius: 3, mode: 0 })).toBe("ja");
    expect(decision.compute({ x: 2.999, y: 0, radius: 3, mode: 0 })).toBe(
      "nein",
    );
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
  const statusOf = (task: ExerciseTask, typed: string) => checkTask(task, [typed]).status;

  it("rejects a neighbouring whole number at any size", () => {
    for (const answer of [999999999, 2999999999, 4000000001, 990000000000]) {
      const task = numberTask(answer, 0);
      expect(statusOf(task, String(answer))).toBe("correct");
      for (const off of [answer - 1, answer + 1, answer - 2, answer + 3])
        expect(statusOf(task, String(off)), String(off)).toBe("wrong");
    }
  });

  it("rejects a neighbouring last digit but accepts floating-point noise", () => {
    expect(statusOf(numberTask(9000000, 6), "9000000,000001")).toBe("wrong");
    expect(statusOf(numberTask(16, 8), "16,00000001")).toBe("wrong");
    const noisy = (0.1 + 0.2) * 1e7;
    expect(noisy).not.toBe(3000000);
    expect(statusOf(numberTask(noisy, 0), "3000000")).toBe("correct");
    expect(statusOf(numberTask(noisy, 0), "3000001")).toBe("wrong");
  });

  it("accepts one third rounded to nine decimal places", () => {
    const task = numberTask(1 / 3, 9);
    expect(statusOf(task, "0,333333333")).toBe("correct");
    expect(statusOf(task, "0.333333333")).toBe("correct");
    expect(statusOf(task, "1/3")).toBe("correct");
    expect(statusOf(task, "0,34")).toBe("wrong");
  });

  it("leaves deliberately tolerant and rounded answers as they are", () => {
    const relative = numberTask(2000000000, 0, { tolerance: 0.01 });
    expect(statusOf(relative, "2020000000")).toBe("correct");
    expect(statusOf(relative, "2030000000")).toBe("wrong");
    const absolute = numberTask(2000000000, 0, { absTolerance: 5 });
    expect(statusOf(absolute, "2000000005")).toBe("correct");
    expect(statusOf(absolute, "2000000006")).toBe("wrong");
    const rounded = numberTask(Math.sqrt(52), 1);
    expect(statusOf(rounded, "7,2")).toBe("correct");
    expect(statusOf(rounded, "7,3")).toBe("wrong");
    const largeRounded = numberTask(1234567.5678, 2);
    expect(statusOf(largeRounded, "1234567,57")).toBe("correct");
    expect(statusOf(largeRounded, "1240000")).toBe("correct");
    expect(statusOf(largeRounded, "1300000")).toBe("wrong");
  });

  it("rejects the wrong last digit in the unit conversions of the Vorsilben lesson", () => {
    const generator = findLessonById("pt-5-vorsilben")!.lesson.exercises.find(
      (g) => g.id === "einheiten-umrechnen",
    )!;
    for (let seed = 1; seed <= 80; seed++) {
      const generated = generator.make(createRng(seed), 1);
      const value = generated.fields[1] as NumberField;
      const inputs = (typed: string) => [
        String((generated.fields[0] as NumberField).answer),
        typed,
      ];
      expect(checkTask(generated, inputs(value.answer.toFixed(6))).status).toBe("correct");
      for (const off of [value.answer - 1e-6, value.answer + 1e-6])
        expect(checkTask(generated, inputs(off.toFixed(6))).status, off.toFixed(6)).toBe("wrong");
    }
  });
});
