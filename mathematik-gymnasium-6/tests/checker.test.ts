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
