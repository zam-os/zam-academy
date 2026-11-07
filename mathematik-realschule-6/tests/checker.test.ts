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

  it("names an unreduced fraction instead of calling it simply wrong", () => {
    const generator = findLessonById("rz-5-erweitern-kuerzen")!.lesson.exercises.find(
      (g) => g.id === "kuerzen",
    )!;
    let exercised = 0;
    for (let seed = 1; seed <= 40; seed++) {
      const generated = generator.make(createRng(seed), 1);
      const [first, second] = generated.fields as NumberField[];
      const slip = first.slips?.[0];
      if (!slip) continue;
      const result = checkTask(generated, [
        String(slip.value),
        String(second.slips?.[0]?.value ?? second.answer),
      ]);
      expect(result.status).toBe("wrong");
      expect(wrongAnswerHint(generated, result)).toBe(slip.hint);
      exercised++;
    }
    expect(exercised).toBeGreaterThan(30);
  });

  it("keeps targeted slip hints available on transfer level two", () => {
    const generator = findLessonById("fl-6-oberflaeche")!.lesson.exercises.find(
      (g) => g.id === "quader",
    )!;
    for (let seed = 1; seed <= 40; seed++) {
      const generated = generator.make(createRng(seed), 2);
      const first = generated.fields[0] as NumberField;
      const slip = first.slips![0];
      const result = checkTask(generated, [String(slip.value)]);
      expect(result.status).toBe("wrong");
      expect(wrongAnswerHint(generated, result)).toBe(slip.hint);
    }
  });
});
