import { describe, expect, it } from "vitest";
import { checkTask, parseNumberCandidates, wrongAnswerHint } from "../src/exercises/checker";
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
    expect(wrongAnswerHint(two, checkTask(two, ["7", "3"]))).toContain("vertauscht");
    const signed = task([field(-7)]);
    expect(wrongAnswerHint(signed, checkTask(signed, ["7"]))).toBe("Prüfe das Vorzeichen.");
  });

  it("reads German thousands points in large natural numbers", () => {
    expect(parseNumberCandidates("1.234.567")).toEqual([1234567]);
    expect(checkTask(task([field(1000000, 0)]), ["1.000.000"]).status).toBe("correct");
    expect(checkTask(task([field(1500, 0)]), ["1.500"]).status).toBe("correct");
  });

  it("reads a point in a whole-number field as thousands only", () => {
    for (const [answer, typed] of [[16, "16.000"], [36, "36.000"], [3, "3.000"]] as const)
      expect(checkTask(task([field(answer, 0)]), [typed]).status, typed).toBe("wrong");
    for (const [answer, typed] of [[1500, "1.500"], [16, "16"]] as const)
      expect(checkTask(task([field(answer, 0)]), [typed]).status, typed).toBe("correct");
    expect(checkTask(task([field(1.5, 1)]), ["1.500"]).status).toBe("correct");
  });

  it("reads a euro sign as a unit", () => {
    const exercise = task([{ ...field(12, 0), unit: "€" }]);
    expect(checkTask(exercise, ["12 €"]).status).toBe("correct");
    expect(checkTask(exercise, ["13 €"]).status).toBe("wrong");
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
  const statusOf = (exercise: ExerciseTask, typed: string) =>
    checkTask(exercise, [typed]).status;

  it("rejects a neighbouring whole number at any size", () => {
    for (const answer of [999999999, 2999999999, 4000000001, 990000000000]) {
      const exercise = numberTask(answer, 0);
      expect(statusOf(exercise, String(answer))).toBe("correct");
      for (const off of [answer - 1, answer + 1, answer - 2, answer + 3])
        expect(statusOf(exercise, String(off)), String(off)).toBe("wrong");
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
    const exercise = numberTask(1 / 3, 9);
    expect(statusOf(exercise, "0,333333333")).toBe("correct");
    expect(statusOf(exercise, "0.333333333")).toBe("correct");
    expect(statusOf(exercise, "1/3")).toBe("correct");
    expect(statusOf(exercise, "0,34")).toBe("wrong");
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
  });
});
