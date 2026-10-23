import { describe, expect, it } from "vitest";
import { ALL_LESSONS, findLessonById } from "../src/curriculum";
import { checkTask } from "../src/exercises/checker";
import { shuffleTaskChoices } from "../src/exercises/choice-order";
import { fmt } from "../src/exercises/format";
import { quizOrder } from "../src/exercises/quiz-order";
import { createRng } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues } from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import type { DifficultyLevel } from "../src/model/types";

function generate(
  id: string,
  generatorId: string,
  seed: number,
  level: DifficultyLevel = 2,
) {
  const lesson = findLessonById(id)!.lesson;
  return lesson.exercises
    .find((generator) => generator.id === generatorId)!
    .make(createRng(seed), level);
}

describe("Review: verständliche Aufgaben und faire Auswahl", () => {
  it("keeps answers attached through reproducible shuffles without changing the source task", () => {
    const task = generate("da-4-diagramme", "verbessern", 12);
    const original = structuredClone(task);
    const positions = new Set<number>();
    for (let seed = 1; seed <= 80; seed++) {
      const shown = shuffleTaskChoices(task, createRng(seed));
      expect(shown).toEqual(shuffleTaskChoices(task, createRng(seed)));
      const typed = shown.fields.map((field, index) => {
        if (field.kind === "number") return fmt(field.answer, field.digits);
        const source = task.fields[index];
        if (source.kind !== "choice") throw new Error("choice kind changed");
        expect([...field.options].sort()).toEqual([...source.options].sort());
        expect(field.options[field.correctIndex]).toBe(
          source.options[source.correctIndex],
        );
        positions.add(field.correctIndex);
        return String(field.correctIndex);
      });
      expect(checkTask(shown, typed).status).toBe("correct");
    }
    expect(task).toEqual(original);
    expect([...positions].sort()).toEqual([0, 1, 2]);
  });

  it("shows every quick-check option exactly once, stably per lesson, with answers in all positions", () => {
    const positions = new Set<number>();
    for (const lesson of ALL_LESSONS) {
      const order = quizOrder(lesson);
      expect(order).toEqual(quizOrder(lesson));
      expect([...order].sort()).toEqual(
        lesson.quiz.options.map((_, index) => index),
      );
      positions.add(order.indexOf(lesson.quiz.correctIndex));
    }
    expect([...positions].sort()).toEqual([0, 1, 2, 3]);
  });

  it("gives the reviewed explanation choices plausible alternatives of comparable length", () => {
    const cases = [
      ["dr-3-kongruenz", "ssw-pruefen"],
      ["dr-4-begruenden", "basiswinkel"],
      ["dr-4-begruenden", "beweiskette"],
      ["rg-1-lagebeziehungen", "winkel-definition"],
      ["rg-3-wahre-groessen", "hilfsfigur"],
      ["ol-3-thales", "begruendung"],
      ["ol-7-umkreis-inkreis", "lage-kontrolle"],
      ["pr-4-indirekt-proportional", "darstellungen"],
      ["da-4-diagramme", "verbessern"],
    ];
    for (const [lessonId, generatorId] of cases) {
      for (let seed = 1; seed <= 30; seed++) {
        for (const field of generate(lessonId, generatorId, seed).fields) {
          if (field.kind !== "choice") continue;
          const correct = field.options[field.correctIndex];
          const wrong = field.options.filter(
            (_, index) => index !== field.correctIndex,
          );
          if (correct.length > 15)
            expect(
              Math.max(...wrong.map((option) => option.length)),
              `${lessonId}/${generatorId}: ${correct}`,
            ).toBeGreaterThanOrEqual(correct.length * 0.8);
          expect(field.options.join(" ")).not.toMatch(
            /Lieblingsfarbe|Wetter|Sonntag/,
          );
        }
      }
    }
  });

  it("keeps the strict integer budget excluded in the hint, checker and worked solution", () => {
    for (let seed = 1; seed <= 80; seed++) {
      for (const level of [1, 2] as const) {
        const task = generate(
          "al-5-sachungleichungen",
          "maximale-anzahl",
          seed,
          level,
        );
        const { fee, price, budget } = task.meta!;
        const feasible = Array.from({ length: 20 }, (_, n) => n).filter((n) =>
          level === 1 ? fee + price * n <= budget : fee + price * n < budget,
        );
        const largest = Math.max(...feasible);
        const first = task.fields[0];
        expect(first.kind === "number" && first.answer).toBe(largest);
        expect(task.feedbackHint).toContain(level === 1 ? "≤" : "< Budget");
        if (level === 2) {
          expect(task.feedbackHint).not.toContain("≤");
          expect(task.steps.at(-1)).toContain(
            `${largest + 1} Fahrten kosten ${fmt(budget)} €`,
          );
          expect(task.steps.at(-1)).toContain("ausgeschlossene Budget");
        }
        const input = task.fields.map((field) =>
          field.kind === "number"
            ? String(field.answer)
            : String(field.correctIndex),
        );
        input[0] = String(largest + 1);
        expect(checkTask(task, input).status).toBe("wrong");
      }
    }
  });

  it("covers all eight conjunction/disjunction cases, including an impossible OR result", () => {
    const seen = new Set<string>();
    for (let seed = 1; seed <= 200; seed++) {
      const task = generate("ol-6-ortsschnitte", "beide-bedingungen", seed);
      const { a, b, radius, and } = task.meta!;
      const inside = [a <= radius, b <= radius];
      const allowed = and ? inside.every(Boolean) : inside.some(Boolean);
      const field = task.fields[0];
      if (field.kind !== "choice") throw new Error("missing decision");
      expect(field.options[field.correctIndex]).toBe(allowed ? "ja" : "nein");
      expect(task.steps[0]).toContain(
        `${b} ≤ ${radius}: ${inside[1] ? "wahr" : "falsch"}`,
      );
      seen.add(`${and}:${inside.join(":")}`);
    }
    expect(seen.size).toBe(8);
  });

  it("shows the common substitution value as well as x in two-sided equation solutions", () => {
    for (let seed = 1; seed <= 80; seed++) {
      const task = generate("al-2-gleichungen", "ax-plus-b", seed);
      const { a, b, c, d, x } = task.meta!;
      const left = (a + d) * x + b;
      expect(left).toBe(d * x + c);
      expect(task.steps.at(-1)).toContain(`= ${fmt(left)}.`);
      expect(task.steps.at(-1)).toContain(`L = {${fmt(x)}}`);
      expect(task.prompt).not.toMatch(/\+ \(−|\b1x\b/);
    }
  });

  it("uses the actual sample composition and the known school composition, without expected-value calculus", () => {
    for (const level of [1, 2] as const) {
      const task = generate("da-3-stichproben", "gruppenanteile", 19, level);
      const field = task.fields[0];
      expect(field.kind === "number" && field.answer).toBe(
        level === 1 ? 50 : 25,
      );
      expect(task.prompt).toContain("gleich groß");
      expect([task.prompt, ...task.steps].join(" ")).not.toMatch(
        /Erwartungswert|erwarteter Anteil/,
      );
      if (level === 2) expect(task.steps.at(-1)).toContain("untervertreten");
    }
  });

  it("formats negative constants and unit coefficients in the algebra labs", () => {
    for (const id of ["al-1-terme", "al-2-gleichungen", "al-3-ungleichungen"]) {
      const lab = findLessonById(id)!.lesson.lab;
      for (const a of [-1, 0, 1]) {
        const values = { ...defaultLabValues(lab), a, b: -1, c: -2, d: 1 };
        const html = labView(lab.kind).render(
          values,
          computeReadouts(lab, values),
        );
        expect(html).not.toMatch(/\+ \(−|\b1x\b/);
      }
    }
  });
});

describe("Review: Konstruktionen", () => {
  it("constructs the SsW example with centre C and two rays at the given angle", () => {
    const explanation =
      findLessonById("dr-3-kongruenz")!.lesson.explanationHtml;
    expect(explanation).toContain("Kreis um C");
    // Independent ray/circle intersection: A=(0,0), C=(6,0), |BC|=4, alpha=30°.
    const t0 = 6 * Math.cos(Math.PI / 6);
    const offset = Math.sqrt(4 ** 2 - (6 * Math.sin(Math.PI / 6)) ** 2);
    for (const t of [t0 - offset, t0 + offset]) {
      const x = t * Math.cos(Math.PI / 6),
        y = t * Math.sin(Math.PI / 6);
      expect(t).toBeGreaterThan(0);
      expect(Math.hypot(x - 6, y)).toBeCloseTo(4);
    }
  });

  it("defines the unshortened Schrägbildachse separately from the shortened depth direction", () => {
    const lesson = findLessonById("rg-2-schraegbilder")!.lesson;
    expect(lesson.explanationHtml).toContain("Schrägbildachse");
    expect(lesson.explanationHtml).toContain("AB");
    expect(lesson.explanationHtml).toContain("unverzerrte Bezugslinie");
    expect(lesson.explanationHtml).toContain("Verzerrungsmaßstab");
    expect(
      lesson.lab.params.some(
        (param) =>
          param.type !== "state" && param.label === "Verzerrungsmaßstab q",
      ),
    ).toBe(true);
  });
});
