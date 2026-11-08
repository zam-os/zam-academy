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
    const two = task([field(3, 0, "x₁ ="), field(7, 0, "x₂ =")]);
    expect(wrongAnswerHint(two, checkTask(two, ["7", "3"]))).toContain(
      "vertauscht",
    );
    const signed = task([field(-7)]);
    expect(wrongAnswerHint(signed, checkTask(signed, ["7"]))).toBe(
      "Prüfe das Vorzeichen.",
    );
  });

  it("keeps targeted slip hints available on generators with slips", () => {
    const lesson = findLessonById("g12-schar-ganzrational")!.lesson;
    const generator = lesson.exercises[0];
    let exercised = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const generated = generator.make(createRng(seed), 1);
      const first = generated.fields[0];
      if (first.kind === "number") {
        for (const slip of first.slips ?? []) {
          const result = checkTask(generated, [String(slip.value)]);
          expect(result.status).toBe("wrong");
          expect(wrongAnswerHint(generated, result)).toBe(slip.hint);
          exercised++;
        }
      }
    }
    expect(exercised).toBeGreaterThan(0);
  });

  it("reads German thousands points in large natural numbers", () => {
    expect(parseNumberCandidates("1.234.567")).toEqual([1234567]);
    expect(checkTask(task([field(1000000, 0)]), ["1.000.000"]).status).toBe("correct");
    expect(checkTask(task([field(1000000, 0)]), ["1000000"]).status).toBe("correct");
    expect(checkTask(task([field(1500, 0)]), ["1.500"]).status).toBe("correct");
  });

  it("reads a point in a whole-number field as thousands only", () => {
    for (const [answer, typed] of [[16, "16.000"], [36, "36.000"], [206, "206.000"], [3, "3.000"], [8, "0.008"], [500, "0.500"]] as const)
      expect(checkTask(task([field(answer, 0)]), [typed]).status, typed).toBe("wrong");
    for (const [answer, typed] of [[1500, "1.500"], [5000, "5.000"], [16, "16,000"], [16, "16"]] as const)
      expect(checkTask(task([field(answer, 0)]), [typed]).status, typed).toBe("correct");
    // A field with decimals keeps both readings.
    expect(checkTask(task([field(1.5, 1)]), ["1.500"]).status).toBe("correct");
    expect(checkTask(task([field(1.5, 1)]), ["1.5"]).status).toBe("correct");
    const slip = task([field(16, 0)]);
    expect(wrongAnswerHint(slip, checkTask(slip, ["16.000"]))).toContain("Faktor 1000");
  });

  it("names a general slip only when it was typed exactly", () => {
    const hint = (answer: number, typed: string) => {
      const exercise = task([field(answer, 0)]);
      return wrongAnswerHint(exercise, checkTask(exercise, [typed]));
    };
    for (const [answer, typed] of [[3, "2"], [3, "1"], [9, "5"], [9, "4"], [6001, "3001"], [50, "1"], [50, "0"]] as const) {
      expect(hint(answer, typed), typed).not.toContain("doppelt oder halb");
      expect(hint(answer, typed), typed).not.toContain("Faktor");
    }
    expect(hint(6, "3")).toContain("doppelt oder halb");
    expect(hint(6, "12")).toContain("doppelt oder halb");
    expect(hint(3, "1,5")).toContain("doppelt oder halb");
    expect(hint(50, "5000")).toContain("Faktor 100");
    expect(hint(50, "0,5")).toContain("Faktor 100");
  });

  it("reads scientific notation or percentage units if present", () => {
    const pField = { ...field(15, 1), unit: "%" };
    expect(checkTask(task([pField]), ["15 %"]).status).toBe("correct");
    expect(checkTask(task([pField]), ["15%"]).status).toBe("correct");
    expect(checkTask(task([pField]), ["16 %"]).status).toBe("wrong");
  });
});
