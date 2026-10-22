import { describe, expect, it } from "vitest";
import { ALL_EXPECTATIONS, findLesson, LESSONS, SOURCES, STAGES, UNITS } from "../src/curriculum";
import { ROUND_SIZE } from "../src/exercises/practice";
import type { ChooseItem, CommaItem, Lesson } from "../src/model/types";
import {
  checkChoose,
  checkCommas,
  checkMarks,
  checkSort,
  markTargets,
  shownOptions,
} from "../src/workshop";

/** All authored text of a lesson, to check it for markup that must not be there. */
function texts(lesson: Lesson): string[] {
  const out: string[] = [lesson.title, lesson.intro, ...lesson.paragraphs, lesson.takeaway];
  for (const t of lesson.terms) out.push(t.term, t.text);
  for (const x of lesson.examples ?? []) out.push(x.title, x.analysis, ...(x.source ? [x.source] : []));
  out.push(lesson.quiz.question, lesson.quiz.answer, ...lesson.quiz.wrong, lesson.quiz.explanation);
  out.push(lesson.workshop.title, lesson.workshop.instruction, lesson.workshop.conclusion);
  const w = lesson.workshop;
  if (w.kind === "classify" || w.kind === "timeline") {
    out.push(...w.categories);
    for (const e of w.entries) out.push(e.text, e.feedback);
  } else if (w.kind === "mark") {
    out.push(...w.labels);
    for (const s of w.text) if (s.feedback) out.push(s.feedback);
  } else if (w.kind === "commas") {
    for (const i of w.items) out.push(...i.words, i.feedback);
  } else {
    for (const i of w.items) out.push(...i.options, i.feedback);
  }
  out.push(lesson.casework.title, lesson.casework.story, lesson.casework.verdict);
  for (const s of lesson.casework.steps) out.push(s.question, ...s.options, s.explanation);
  for (const level of [1, 2] as const) {
    const t = lesson.tasks[level];
    out.push(t.prompt, ...t.hints, t.model, ...t.criteria);
  }
  if (lesson.practice) {
    out.push(lesson.practice.title, lesson.practice.instruction);
    for (const level of [1, 2] as const)
      for (const item of lesson.practice.pool[level]) {
        out.push(item.feedback);
        if ("words" in item) out.push(...item.words);
        else out.push(...item.options);
      }
  }
  return out;
}

const PLAIN = /[<>`_]|\s{2,}|\*\*\*/;

function checkCommaItem(item: CommaItem, where: string) {
  expect(item.words.length, where).toBeGreaterThanOrEqual(4);
  for (const word of item.words) {
    expect(word, where).not.toContain(",");
    expect(word.trim(), where).toBe(word);
    expect(word.length, where).toBeGreaterThan(0);
    expect(word, where).not.toMatch(/\s/);
  }
  expect(item.feedback.length, where).toBeGreaterThanOrEqual(30);
  expect(new Set(item.commas).size, where).toBe(item.commas.length);
  for (const gap of item.commas) {
    expect(Number.isInteger(gap), where).toBe(true);
    expect(gap, where).toBeGreaterThanOrEqual(0);
    expect(gap, where).toBeLessThanOrEqual(item.words.length - 2);
  }
  expect(checkCommas(item, item.commas), where).toBe(true);
  // An extra comma in a gap that has none is wrong, and so is leaving one out.
  const free = item.words.map((_, i) => i).filter((i) => i <= item.words.length - 2 && !item.commas.includes(i));
  if (free.length) expect(checkCommas(item, [...item.commas, free[0]]), where).toBe(false);
  if (item.commas.length) expect(checkCommas(item, item.commas.slice(1)), where).toBe(false);
}

function checkChooseItem(item: ChooseItem, where: string) {
  expect(item.options.length, where).toBeGreaterThanOrEqual(2);
  expect(item.options.length, where).toBeLessThanOrEqual(3);
  expect(new Set(item.options).size, where).toBe(item.options.length);
  expect(Number.isInteger(item.answer), where).toBe(true);
  expect(item.answer, where).toBeGreaterThanOrEqual(0);
  expect(item.answer, where).toBeLessThan(item.options.length);
  expect((item.before + item.after).trim().length, where).toBeGreaterThan(10);
  expect(item.feedback.length, where).toBeGreaterThanOrEqual(30);
  for (const option of item.options) expect(option.trim().length, where).toBeGreaterThan(0);
  expect(checkChoose(item, item.answer), where).toBe(true);
  expect(checkChoose(item, -1), where).toBe(false);
  expect(checkChoose(item, (item.answer + 1) % item.options.length), where).toBe(false);
}

describe("lesson contract", () => {
  it("has unique, well-formed ids and every lesson belongs to a known unit of the Fachlehrplan", () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of LESSONS) {
      expect(l.id).toMatch(/^de-[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(l.id.length).toBeLessThanOrEqual(40);
      expect(STAGES.some((s) => s.lb === l.lb)).toBe(true);
      expect(UNITS[l.unit], l.id).toBeDefined();
      expect(UNITS[l.unit].lb, l.id).toBe(l.lb);
      expect(l.covers.length, l.id).toBeGreaterThan(0);
      for (const code of l.covers) {
        expect(ALL_EXPECTATIONS, `${l.id}: ${code}`).toContain(code);
        expect(code.startsWith(`${l.unit}.`), `${l.id}: ${code} gehört nicht zu Einheit ${l.unit}`).toBe(true);
      }
    }
  });
  it("names its place in the Fachlehrplan on every lesson", () => {
    for (const l of LESSONS) {
      expect(l.lehrplan, l.id).toMatch(/^D9 LB \d\.\d: .{8,}/);
      expect(l.lehrplan, l.id).toContain(`LB ${l.unit}:`);
    }
  });
  it("lists the lessons in Lernbereich and unit order", () => {
    const order = LESSONS.map((l) => `${l.unit}`);
    expect(order).toEqual([...order].sort());
    expect(LESSONS.map((l) => l.lb)).toEqual([...LESSONS.map((l) => l.lb)].sort((a, b) => a - b));
  });
  it("finds each lesson by its id", () => {
    for (const l of LESSONS) expect(findLesson(l.id)).toBe(l);
  });
  it("uses the four Lernbereiche of the plan", () => {
    expect(STAGES.map((s) => s.lb)).toEqual([1, 2, 3, 4]);
    expect(new Set(Object.values(UNITS).map((u) => u.lb))).toEqual(new Set([1, 2, 3, 4]));
    expect(ALL_EXPECTATIONS).toHaveLength(51);
  });

  for (const lesson of LESSONS)
    describe(lesson.id, () => {
      it("explains in three or four paragraphs with terms and a stand-alone takeaway", () => {
        expect(lesson.title.length).toBeGreaterThan(5);
        expect(lesson.intro.length).toBeGreaterThan(20);
        expect(lesson.intro.length).toBeLessThanOrEqual(150);
        expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(3);
        expect(lesson.paragraphs.length).toBeLessThanOrEqual(4);
        for (const p of lesson.paragraphs) {
          expect(p.length).toBeGreaterThan(150);
          expect(p.length).toBeLessThan(1100);
        }
        expect(lesson.terms.length).toBeGreaterThanOrEqual(2);
        expect(lesson.terms.length).toBeLessThanOrEqual(6);
        for (const t of lesson.terms) {
          expect(t.term.length).toBeGreaterThan(2);
          expect(t.text.length).toBeGreaterThan(25);
        }
        expect((lesson.examples ?? []).length).toBeLessThanOrEqual(2);
        for (const x of lesson.examples ?? []) {
          expect(x.title.length).toBeGreaterThan(5);
          expect(x.text.length).toBeGreaterThan(40);
          expect(x.analysis.length).toBeGreaterThan(80);
          expect(x.text, x.title).not.toMatch(/[<>`_]|[ \t]{2,}|\n\n|\*\*\*/);
        }
        expect(lesson.takeaway.length).toBeGreaterThan(60);
        expect(lesson.takeaway.length).toBeLessThan(420);
        expect(lesson.quiz.wrong).not.toContain(lesson.takeaway);
        expect(lesson.sourceIds).toContain("lp");
        for (const id of lesson.sourceIds) expect(SOURCES.some((s) => s.id === id)).toBe(true);
      });
      it("uses plain text with **bold** as its only markup", () => {
        for (const text of texts(lesson)) {
          expect(text, text).not.toMatch(PLAIN);
          expect(text.replace(/\*\*[^*]+\*\*/g, ""), text).not.toContain("*");
          expect(text.trim()).toBe(text);
          expect(text.length).toBeGreaterThan(0);
        }
        for (const x of lesson.examples ?? []) {
          expect(x.text.replace(/\*\*[^*]+\*\*/g, ""), x.title).not.toContain("*");
          expect(x.text.trim()).toBe(x.text);
        }
      });
      it("has a quick check whose wrong answers are as plausible as the right one", () => {
        const { answer, wrong } = lesson.quiz;
        expect(new Set([answer, ...wrong]).size).toBe(3);
        expect(lesson.quiz.explanation.length).toBeGreaterThan(30);
        expect(lesson.quiz.question.endsWith("?")).toBe(true);
        // The right answer must not stand out by being much longer than its distractors.
        expect(Math.max(...wrong.map((w) => w.length))).toBeGreaterThan(answer.length * 0.6);
      });
      it("has a workshop that can be solved and is not solved by chance", () => {
        const w = lesson.workshop;
        expect(w.title.length).toBeGreaterThan(5);
        expect(w.instruction.length).toBeGreaterThan(30);
        expect(w.conclusion.length).toBeGreaterThan(30);
        if (w.kind === "classify" || w.kind === "timeline") {
          expect(w.entries.length).toBeGreaterThanOrEqual(4);
          expect(w.entries.length).toBeLessThanOrEqual(6);
          for (const e of w.entries) {
            expect(e.text.length).toBeGreaterThan(30);
            expect(e.feedback.length).toBeGreaterThan(15);
          }
          const solution = w.entries.map((e) => e.target);
          if (w.kind === "classify") {
            expect(w.categories.length).toBeGreaterThanOrEqual(2);
            expect(w.categories.length).toBeLessThanOrEqual(4);
            expect(new Set(w.categories).size).toBe(w.categories.length);
            for (const t of solution) expect(t).toBeLessThan(w.categories.length);
            // Every category is the right answer at least once.
            expect(new Set(solution).size).toBe(w.categories.length);
          } else {
            expect([...solution].sort()).toEqual(w.entries.map((_, i) => i));
            expect(w.categories).toEqual([]);
          }
          expect(checkSort(w, solution).every(Boolean)).toBe(true);
          expect(checkSort(w, []).some(Boolean)).toBe(false);
        } else if (w.kind === "mark") {
          expect(w.labels.length).toBeGreaterThanOrEqual(2);
          expect(w.labels.length).toBeLessThanOrEqual(4);
          expect(new Set(w.labels).size).toBe(w.labels.length);
          const targets = markTargets(w);
          expect(targets.length).toBeGreaterThanOrEqual(3);
          expect(targets.length).toBeLessThanOrEqual(10);
          // Every label is the right answer at least once.
          expect(new Set(targets.map((i) => w.text[i].label)).size).toBe(w.labels.length);
          for (const i of targets) {
            const s = w.text[i];
            expect(Number.isInteger(s.label)).toBe(true);
            expect(s.label ?? -1).toBeGreaterThanOrEqual(0);
            expect(s.label ?? 99).toBeLessThan(w.labels.length);
            expect(s.t.trim(), s.t).toMatch(/[\p{L}\p{N}]/u);
            expect(s.feedback?.length ?? 0, s.t).toBeGreaterThanOrEqual(25);
          }
          // The text has pieces to leave alone, and reads as one text.
          const distractors = w.text.filter((s) => s.label === undefined && /[\p{L}]/u.test(s.t));
          expect(distractors.length).toBeGreaterThanOrEqual(4);
          const joined = w.text.map((s) => s.t).join("");
          expect(joined.length).toBeGreaterThan(120);
          expect(joined.length).toBeLessThan(900);
          expect(joined, "Text mit doppelten Leerzeichen").not.toMatch(/ {2,}/);
          expect(joined.trim()).toBe(joined);
          for (const s of w.text) expect(s.t, s.t).not.toMatch(/[<>`_*]/);
          const solution = w.text.map((s) => s.label);
          expect(checkMarks(w, solution).every(Boolean)).toBe(true);
          expect(checkMarks(w, []).every(Boolean)).toBe(false);
          // A mark on a piece to leave alone makes the result wrong.
          const free = w.text.findIndex((s) => s.label === undefined && /[\p{L}]/u.test(s.t));
          expect(checkMarks(w, solution.map((l, i) => (i === free ? 0 : l))).every(Boolean)).toBe(false);
        } else if (w.kind === "commas") {
          expect(w.items.length).toBeGreaterThanOrEqual(3);
          expect(w.items.length).toBeLessThanOrEqual(6);
          w.items.forEach((item, i) => checkCommaItem(item, `${lesson.id} Satz ${i + 1}`));
          expect(w.items.filter((item) => item.commas.length === 0).length).toBeLessThanOrEqual(1);
        } else {
          expect(w.items.length).toBeGreaterThanOrEqual(3);
          expect(w.items.length).toBeLessThanOrEqual(6);
          w.items.forEach((item, i) => checkChooseItem(item, `${lesson.id} Satz ${i + 1}`));
        }
      });
      it("has a text case with three or four steps, each with a single right option", () => {
        const c = lesson.casework;
        expect(c.title.length).toBeGreaterThan(5);
        expect(c.story.length).toBeGreaterThan(90);
        expect(c.verdict.length).toBeGreaterThan(50);
        expect(c.steps.length).toBeGreaterThanOrEqual(3);
        expect(c.steps.length).toBeLessThanOrEqual(4);
        c.steps.forEach((step, i) => {
          expect(step.question.endsWith("?")).toBe(true);
          expect(step.options.length).toBeGreaterThanOrEqual(2);
          expect(step.options.length).toBeLessThanOrEqual(4);
          expect(new Set(step.options).size).toBe(step.options.length);
          expect(Number.isInteger(step.answer)).toBe(true);
          expect(step.answer).toBeGreaterThanOrEqual(0);
          expect(step.answer).toBeLessThan(step.options.length);
          expect(step.explanation.length).toBeGreaterThan(25);
          const shown = shownOptions(c, i, lesson.id);
          expect(shown.options[shown.answer]).toBe(step.options[step.answer]);
        });
      });
      it("asks for two different written tasks with their own model answers", () => {
        const { 1: one, 2: two } = lesson.tasks;
        for (const t of [one, two]) {
          expect(t.prompt.length).toBeGreaterThan(40);
          expect(t.hints).toHaveLength(2);
          expect(t.criteria).toHaveLength(3);
          expect(new Set(t.criteria).size).toBe(3);
          expect(t.model.length).toBeGreaterThan(160);
        }
        expect(one.prompt).not.toBe(two.prompt);
        expect(one.model).not.toBe(two.model);
        expect(one.model).not.toContain(two.model);
        expect(two.model).not.toContain(one.model);
      });
      it("has practice rounds drawn from pools that fill every round on both levels", () => {
        const practice = lesson.practice;
        if (!practice) return;
        expect(practice.title.length).toBeGreaterThan(5);
        expect(practice.instruction.length).toBeGreaterThan(30);
        for (const level of [1, 2] as const) {
          const pool = practice.pool[level];
          expect(pool.length, `Niveau ${level}`).toBeGreaterThanOrEqual(8);
          expect(pool.length, `Niveau ${level}`).toBeLessThanOrEqual(12);
          expect(ROUND_SIZE).toBe(3);
          pool.forEach((item, i) => {
            const where = `${lesson.id} Niveau ${level} Satz ${i + 1}`;
            if (practice.kind === "commas") checkCommaItem(item as CommaItem, where);
            else checkChooseItem(item as ChooseItem, where);
          });
          const keys = pool.map((item) =>
            "words" in item ? item.words.join(" ") : `${item.before}|${item.after}`,
          );
          expect(new Set(keys).size, `Niveau ${level}: doppelte Sätze`).toBe(keys.length);
        }
        const one = practice.pool[1].map((item) => ("words" in item ? item.words.join(" ") : `${item.before}|${item.after}`));
        const two = practice.pool[2].map((item) => ("words" in item ? item.words.join(" ") : `${item.before}|${item.after}`));
        expect(one.filter((k) => two.includes(k)), "Niveau 1 und 2 teilen Sätze").toEqual([]);
        // Level 2 is a transfer: its sentences are longer on average.
        const length = (item: CommaItem | ChooseItem) =>
          "words" in item ? item.words.length : (item.before + item.after).split(/\s+/).length;
        const mean = (items: Array<CommaItem | ChooseItem>) => items.reduce((n, item) => n + length(item), 0) / items.length;
        expect(mean(practice.pool[2] as Array<CommaItem | ChooseItem>)).toBeGreaterThan(
          mean(practice.pool[1] as Array<CommaItem | ChooseItem>),
        );
      });
    });
});
