import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "../src/curriculum";
import {
  checkTask,
  parseNumberCandidates,
  wrongAnswerHint,
} from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { createRng } from "../src/exercises/rng";
import {
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
} from "../src/lab/engine";
import type {
  ExerciseTask,
  NumberField,
  ReadoutValues,
} from "../src/model/types";
import { GOAL_WITNESSES } from "./witnesses";

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

  it("keeps targeted slip hints available on transfer level two", () => {
    // Every slip of every generator on level 2 answers with its own hint when
    // that slip is typed, and the other fields are filled correctly.
    let exercised = 0;
    for (const lesson of ALL_LESSONS) {
      for (const generator of lesson.exercises) {
        for (let seed = 1; seed <= 40; seed++) {
          const generated = generator.make(createRng(seed), 2);
          generated.fields.forEach((field, index) => {
            if (field.kind !== "number") return;
            for (const slip of field.slips ?? []) {
              const inputs = generated.fields.map((other, at) => {
                if (at === index) return String(slip.value);
                return other.kind === "number"
                  ? fmt(other.answer, other.digits).replace("−", "-")
                  : String(other.correctIndex);
              });
              const result = checkTask(generated, inputs);
              expect(result.status, `${lesson.id}/${generator.id}`).toBe("wrong");
              expect(wrongAnswerHint(generated, result), `${lesson.id}/${generator.id}`).toBe(slip.hint);
              exercised++;
            }
          });
        }
      }
    }
    expect(exercised).toBeGreaterThan(30);
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

  it("reads a euro sign as a unit", () => {
    const exercise = task([{ ...field(12, 0), unit: "€" }]);
    expect(checkTask(exercise, ["12 €"]).status).toBe("correct");
    expect(checkTask(exercise, ["13 €"]).status).toBe("wrong");
  });

  it("does not let a rounded readout decide a lab goal", () => {
    // Goal checks take the exact values and readouts; rounding a readout for
    // display must never turn a goal on or off.
    for (const lesson of ALL_LESSONS) {
      const lab = lesson.lab;
      const settings = [
        defaultLabValues(lab),
        ...Object.values(GOAL_WITNESSES[lesson.id] ?? {}).map((w) => ({ ...defaultLabValues(lab), ...w })),
        ...enumerateLabGrid(lab, 2),
      ];
      for (const values of settings) {
        const exact = computeReadouts(lab, values);
        const rounded: ReadoutValues = {};
        for (const readout of lab.readouts) {
          const value = exact[readout.key];
          rounded[readout.key] =
            typeof value === "number" ? Number(value.toFixed(readout.digits ?? 2)) : value;
        }
        const before = lab.goals.filter((goal) => goal.check(values, exact)).map((g) => g.id);
        const after = lab.goals.filter((goal) => goal.check(values, rounded)).map((g) => g.id);
        expect(after, `${lesson.id} at ${JSON.stringify(values)}`).toEqual(before);
      }
    }
  }, 120_000);

  it("rejects a neighbouring whole number at any size", () => {
    for (const answer of [999999999, 2999999999, 4000000001, 990000000000]) {
      const exact = task([field(answer, 0)]);
      expect(checkTask(exact, [String(answer)]).status).toBe("correct");
      for (const off of [answer - 1, answer + 1, answer - 2, answer + 3])
        expect(checkTask(exact, [String(off)]).status, String(off)).toBe("wrong");
    }
  });

  it("names the opposite neighbour of a large number instead of dropping the hint", () => {
    // A slip hint belongs to the typed value alone: the neighbouring number
    // gets the slip's hint, any other number does not.
    const base = 1234567890;
    const large = task([
      { ...field(base, 0), slips: [{ value: base + 1, hint: "Der Nachfolger ist eine Einheit größer." }] },
    ]);
    const neighbour = checkTask(large, [String(base + 1)]);
    expect(neighbour.status).toBe("wrong");
    expect(wrongAnswerHint(large, neighbour)).toBe("Der Nachfolger ist eine Einheit größer.");
    for (const typed of [base - 1, base + 2, 2 * base]) {
      const other = checkTask(large, [String(typed)]);
      expect(other.status, String(typed)).toBe("wrong");
      expect(wrongAnswerHint(large, other), String(typed)).not.toBe("Der Nachfolger ist eine Einheit größer.");
    }
  });
});
