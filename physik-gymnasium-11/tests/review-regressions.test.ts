import { describe, expect, it } from "vitest";
import { curriculumUrl, findLesson, trackLabel } from "../src/curriculum";
import {
  createAttempt,
  revealSolution,
  skipAttempt,
  submitAnswer,
} from "../src/exercises/attempt";
import { checkAnswer, wrongAnswerHint } from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { makeExercise } from "../src/exercises/generators";
import type { Rng } from "../src/exercises/rng";
import { createRng } from "../src/exercises/rng";
import type { CalculationKind } from "../src/model/types";
import { pathLesson, visitLesson } from "../src/navigation";
import {
  freshProgress,
  parseProgress,
  writingKey,
} from "../src/storage/progress";

describe("exercise attempts across reloads", () => {
  const lesson = findLesson("kb-groessen")!;
  it("consumes a revealed task before serialization and restores a new attempt without credit", () => {
    const progress = freshProgress(),
      attempt = createAttempt(progress, lesson, 1);
    revealSolution(progress, attempt);
    expect(progress.exerciseSerial[attempt.key]).toBe(1);
    expect(progress.calculationDone[attempt.key] ?? 0).toBe(0);
    expect(
      submitAnswer(progress, attempt, String(attempt.task.answer)),
    ).toBeNull();
    const restored = parseProgress(JSON.stringify(progress));
    const next = createAttempt(restored, lesson, 1);
    expect(next.task.prompt).not.toBe(attempt.task.prompt);
    expect(next.solution).toBe(false);
    expect(restored.calculationDone[attempt.key] ?? 0).toBe(0);
  });
  it("does not advance twice when moving on from a revealed or correctly solved task", () => {
    const progress = freshProgress(),
      assisted = createAttempt(progress, lesson, 1);
    revealSolution(progress, assisted);
    revealSolution(progress, assisted);
    skipAttempt(progress, assisted);
    expect(progress.exerciseSerial[assisted.key]).toBe(1);
    const independent = createAttempt(progress, lesson, 1);
    expect(
      submitAnswer(progress, independent, String(independent.task.answer))
        ?.status,
    ).toBe("correct");
    expect(
      submitAnswer(progress, independent, String(independent.task.answer)),
    ).toBeNull();
    skipAttempt(progress, independent);
    expect(progress.exerciseSerial[independent.key]).toBe(2);
    expect(progress.calculationDone[independent.key]).toBe(1);
  });
  it("keeps incorrect and empty submissions retryable and skipped attempts uncredited", () => {
    const progress = freshProgress(),
      attempt = createAttempt(progress, lesson, 1);
    expect(submitAnswer(progress, attempt, "")?.status).toBe("invalid");
    expect(submitAnswer(progress, attempt, "9999")?.status).toBe("wrong");
    expect(progress.exerciseSerial[attempt.key]).toBeUndefined();
    skipAttempt(progress, attempt);
    expect(
      submitAnswer(progress, attempt, String(attempt.task.answer)),
    ).toBeNull();
    expect(progress.calculationDone[attempt.key]).toBeUndefined();
  });
  it("does not credit a reveal in level 2 to level 1", () => {
    const progress = freshProgress(),
      attempt = createAttempt(progress, lesson, 2);
    revealSolution(progress, attempt);
    expect(progress.exerciseSerial[writingKey(lesson.id, 1)]).toBeUndefined();
    expect(progress.calculationDone[writingKey(lesson.id, 1)]).toBeUndefined();
  });
  it("stops counting at the three tasks a lesson requires", () => {
    const progress = freshProgress();
    for (let i = 0; i < 5; i++) {
      const attempt = createAttempt(progress, lesson, 1);
      submitAnswer(progress, attempt, String(attempt.task.answer));
    }
    expect(progress.calculationDone[writingKey(lesson.id, 1)]).toBe(3);
  });
});

describe("Ausbildungsrichtung and recovery", () => {
  it("opens an NTG card without changing the selected path", () => {
    const progress = freshProgress();
    expect(visitLesson(progress, "nt-kennlinie")?.id).toBe("nt-kennlinie");
    expect(progress.activeLessonId).toBe("nt-kennlinie");
    expect(progress.track).toBe("ANDERE");
    expect(pathLesson(progress).tracks).toContain("ANDERE");
    expect(pathLesson(progress).id).not.toBe("nt-kennlinie");
    const restored = parseProgress(JSON.stringify(progress));
    expect(restored.track).toBe("ANDERE");
    visitLesson(restored, "nt-kennlinie");
    restored.track = "NTG";
    expect(pathLesson(restored).id).toBe("nt-kennlinie");
    expect(visitLesson(progress, "unknown")).toBeUndefined();
    expect(progress.activeLessonId).toBe("nt-kennlinie");
  });
  it("uses one Fachlehrplan for both paths and names them", () => {
    expect(curriculumUrl("NTG")).toBe(curriculumUrl("ANDERE"));
    expect(curriculumUrl("NTG")).toMatch(/gymnasium\/11\/physik$/);
    expect(trackLabel("NTG")).toBe("NTG");
    expect(trackLabel("ANDERE")).not.toContain("NTG");
  });
  it("keeps each experiment slot bound to its own Lernbereich", () => {
    const defaults = freshProgress().experiments;
    expect(parseProgress("{}").experiments).toEqual(defaults);
    expect(parseProgress('{"experiments":[{}]}').experiments).toEqual(defaults);
    const restored = parseProgress(
      JSON.stringify({
        experiments: [{ lb: 2, status: "done" }, { lb: "bad" }, { lb: 1 }],
      }),
    );
    expect(restored.experiments.map((e) => e.lb)).toEqual([1, 2, 4]);
    expect(restored.experiments[0].status).toBe("done");
  });
});

describe("German numbers and targeted hints", () => {
  function values(...ints: number[]): Rng {
    return { int: () => ints.shift()! };
  }
  const kinds = [
    ...new Set(
      [
        "circular",
        "centripetal",
        "centriexp",
        "curve",
        "gravity",
        "orbit",
        "oscillation",
        "spring",
        "pendulum",
        "uncertainty",
        "wave",
        "interference",
        "standing",
        "light",
        "kepler",
        "hubble",
        "lorentz",
        "contraction",
        "efficiency",
        "fullload",
        "saving",
        "euler",
        "airfall",
        "solar",
        "pvplant",
        "ride",
      ] as CalculationKind[],
    ),
  ];
  it("formats non-integer givens with decimal commas", () => {
    expect(makeExercise("centripetal", values(4, 3, 3), 1).prompt).toContain(
      "m = 0,4 kg",
    );
    expect(makeExercise("centripetal", values(4, 3, 3), 1).prompt).toContain(
      "r = 1,5 m",
    );
    expect(makeExercise("lorentz", values(4, 3, 2), 1).prompt).toContain(
      "0,6 c",
    );
    expect(makeExercise("pendulum", values(4, 3, 2), 2).prompt).toContain(
      "60,5 s",
    );
    expect(fmt(-0.0001)).toBe("0");
    expect(fmt(1234.5)).toBe("1.234,5");
  });
  it("does not emit decimal points in any generated learner-facing numbers", () => {
    expect(kinds).toHaveLength(26);
    for (const kind of kinds)
      for (const level of [1, 2] as const)
        for (let seed = 1; seed <= 80; seed++) {
          const task = makeExercise(kind, createRng(seed), level);
          const text = `${task.prompt} ${task.solutionHtml} ${task.formulaHint}`;
          for (const match of text.matchAll(/\d[\d.,]*/g)) {
            const number = match[0].replace(/[.,]$/, "");
            if (number.includes("."))
              expect(number, text).toMatch(/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/);
          }
          // Real minus sign and "·" in learner text.
          expect(text).not.toMatch(/\d\s*\*\s*\d/);
          expect(text).not.toMatch(/[= (]-\d/);
          expect(text).not.toMatch(/NaN|undefined|Infinity/);
        }
  });
  it("names the typical slips: unit factor, sign and swapped division", () => {
    const wave = makeExercise("wave", values(4, 3, 2), 2);
    expect(wave.answer).toBe(34);
    // Metres instead of centimetres.
    expect(wrongAnswerHint(checkAnswer(wave, "0,34"), wave)).toContain(
      "Faktor 100",
    );
    const euler = makeExercise("euler", values(4, 3, 2), 2);
    expect(wrongAnswerHint(checkAnswer(euler, "0,24"), euler)).toContain(
      "Vorzeichen",
    );
    expect(checkAnswer(euler, "−0,24").status).toBe("correct");
    const fullload = makeExercise("fullload", values(4, 3, 2), 1);
    expect(wrongAnswerHint(checkAnswer(fullload, "6"), fullload)).toContain(
      "Faktor 1000",
    );
    const light = makeExercise("light", values(4, 3, 2), 2);
    expect(wrongAnswerHint(checkAnswer(light, "0,002"), light)).toContain(
      "falschen Wert geteilt",
    );
  });
});

describe("worked solutions keep units and brackets (review of #111)", () => {
  it("brackets the denominator and converts m/s to km/s for the orbit speed", () => {
    for (let seed = 1; seed <= 40; seed++) {
      const html = makeExercise("orbit", createRng(seed), 1).solutionHtml;
      expect(html).toMatch(/\/ \(\d+ · 10⁶\)\) m\/s = [\d.]+ m\/s = [\d,]+ km\/s/);
    }
  });
  it("states the flight distance in metres before kilometres", () => {
    for (let seed = 1; seed <= 40; seed++) {
      const html = makeExercise("contraction", createRng(seed), 2).solutionHtml;
      expect(html).toMatch(/10⁻⁶ s = [\d.]+ m = [\d,]+ km\./);
    }
  });
  it("does not claim that satellite clocks simply run slow", () => {
    const text = JSON.stringify(findLesson("ew-zeitdilatation"));
    expect(text).not.toContain("gehen diese Sekunden langsamer");
    expect(text).toContain("vorgehen");
    const orbit = JSON.stringify(findLesson("kb-satelliten"));
    expect(orbit).toContain("35 800 km über der Erdoberfläche");
    expect(orbit).not.toMatch(/\/ \d,\d+ · 10⁶\)/);
  });
});
