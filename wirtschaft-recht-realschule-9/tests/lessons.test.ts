import { describe, expect, it } from "vitest";
import { findLesson, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { goalsOf, LABS } from "../src/labs/registry";
import type { PracticeKind } from "../src/model/types";
import { checkWorkshop, shownOptions } from "../src/workshop";

const UNITS: Record<number, string[]> = {
  1: ["1.1", "1.2"],
  2: ["2.1", "2.2"],
  3: ["3"],
  4: ["4.1", "4.2", "4.3"],
  5: ["1.1", "1.2", "2.1", "2.2"],
};
const PRACTICE: PracticeKind[] = [
  "gleichgewicht",
  "ueberhang",
  "zins",
  "zinseszins",
  "ratenkredit",
  "sozialabgaben",
  "verzugszins",
];

/** All authored text of a lesson, to check it for markup that must not be there. */
function texts(lesson: (typeof LESSONS)[number]): string[] {
  const out: string[] = [lesson.title, lesson.intro, ...lesson.paragraphs, lesson.takeaway];
  for (const t of lesson.terms) out.push(t.term, t.text);
  for (const l of lesson.law ?? []) out.push(l.ref, l.text);
  out.push(lesson.quiz.question, lesson.quiz.answer, ...lesson.quiz.wrong, lesson.quiz.explanation);
  out.push(lesson.workshop.title, lesson.workshop.instruction, lesson.workshop.conclusion);
  out.push(...lesson.workshop.categories);
  for (const e of lesson.workshop.entries) out.push(e.text, e.feedback);
  out.push(lesson.casework.title, lesson.casework.story, lesson.casework.verdict);
  for (const s of lesson.casework.steps) out.push(s.question, ...s.options, s.explanation);
  for (const level of [1, 2] as const) {
    const t = lesson.tasks[level];
    out.push(t.prompt, ...t.hints, t.model, ...t.criteria);
  }
  return out;
}

describe("lesson contract", () => {
  it("has unique, well-formed ids and every lesson belongs to a known Lernbereich", () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of LESSONS) {
      expect(l.id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(l.id.length).toBeLessThanOrEqual(40);
      expect(STAGES.some((s) => s.lb === l.lb)).toBe(true);
      expect(UNITS[l.lb], l.id).toContain(l.unit);
      expect(!!l.optional).toBe(l.lb === 5);
    }
  });
  it("names its Zweige and its place in the Fachlehrplan on every lesson", () => {
    for (const l of LESSONS) {
      expect(l.tracks, l.id).toEqual(["I", "III"]);
      expect(l.lehrplan, l.id).toMatch(/^WR9 LB \d(\.\d)? \(I\/III\): .{8,}/);
      if (l.lb !== 5) expect(l.lehrplan, l.id).toContain(`LB ${l.unit} `);
      else expect(l.lehrplan, l.id).toContain("Bilingualer Sachfachunterricht");
    }
  });
  it("lists the lessons in Lernbereich order", () => {
    const order = LESSONS.map((l) => l.lb);
    expect(order).toEqual([...order].sort((a, b) => a - b));
    const units = LESSONS.filter((l) => l.lb === 4).map((l) => l.unit);
    expect(units).toEqual([...units].sort());
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
        expect(lesson.terms.length).toBeLessThanOrEqual(5);
        for (const t of lesson.terms) {
          expect(t.term.length).toBeGreaterThan(2);
          expect(t.text.length).toBeGreaterThan(25);
        }
        expect(lesson.takeaway.length).toBeGreaterThan(60);
        expect(lesson.takeaway.length).toBeLessThan(420);
        expect(lesson.quiz.wrong).not.toContain(lesson.takeaway);
        expect(lesson.sourceIds).toContain("lp");
        for (const id of lesson.sourceIds) expect(SOURCES.some((s) => s.id === id)).toBe(true);
      });
      it("uses plain text with **bold** as its only markup", () => {
        for (const text of texts(lesson)) {
          expect(text, text).not.toMatch(/[<>`_]|\s{2,}|\*\*\*/);
          expect(text.replace(/\*\*[^*]+\*\*/g, ""), text).not.toContain("*");
          expect(text.trim()).toBe(text);
          expect(text.length).toBeGreaterThan(0);
        }
      });
      it("states laws in its own words and links only to the statute", () => {
        for (const note of lesson.law ?? []) {
          expect(note.ref).toMatch(/§|Art\.|Artikel/);
          expect(note.text.length).toBeGreaterThan(30);
          if (note.url) expect(note.url).toMatch(/^https:\/\/www\.gesetze-im-internet\.de\/[a-z0-9_]+\/((__|art_)\w+\.html)?$/);
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
        expect(checkWorkshop(w, solution).every(Boolean)).toBe(true);
        expect(checkWorkshop(w, []).some(Boolean)).toBe(false);
      });
      it("has a case with three or four steps, each with a single right option", () => {
        const c = lesson.casework;
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
        // Across the lesson the right option is not always the first one written.
        expect(new Set(c.steps.map((s) => s.answer)).size).toBeGreaterThan(0);
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
      it("names a lab and practice that exist, with assignments it can reach", () => {
        if (lesson.lab) {
          expect(LABS[lesson.lab]).toBeDefined();
          const goals = goalsOf(lesson);
          expect(goals.length).toBeGreaterThan(0);
          for (const id of lesson.labGoals ?? []) expect(LABS[lesson.lab].goals.some((g) => g.id === id)).toBe(true);
        } else expect(lesson.labGoals).toBeUndefined();
        if (lesson.practice) expect(PRACTICE).toContain(lesson.practice);
      });
    });

  it("finds each lesson by its id", () => {
    for (const l of LESSONS) expect(findLesson(l.id)).toBe(l);
  });
});
