import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { CURRICULUM_URL, findLesson, LESSONS, SOURCES, STAGES, TERMS } from "../src/curriculum";
import { FIGURES, renderFigure } from "../src/figures";
import { checkWorkshop } from "../src/workshop";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID, ZAM_CELL_TITLE } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const items = cell.atoms.flatMap((atom) => atom.practice_items);

describe("Grade 6 Politics and Society lessons", () => {
  it("covers both official expectations in the Grade 6 GPG learning area", () => {
    expect(STAGES).toMatchObject([{ lb: 3, title: "Politik und Gesellschaft" }]);
    expect(LESSONS).toHaveLength(7);
    expect(coverage).toMatchObject({
      curriculum: CURRICULUM_URL, school_type: "mittelschule", grade: 6, subject: "gpg",
    });
    expect(coverage.rows.map((row) => [row.lb, row.position])).toEqual([[3, 1], [3, 2]]);
    expect(coverage.rows.flatMap((row) => row.lessons).sort()).toEqual(LESSONS.map((lesson) => lesson.id).sort());
    expect(new Set(LESSONS.map((lesson) => lesson.id)).size).toBe(7);
    expect(TERMS.length).toBeGreaterThan(5);
  });

  it.each(LESSONS)("explains $id with a diagram, a check and two writing tasks", (lesson) => {
    expect(lesson.lb).toBe(3);
    expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(300);
    expect(lesson.takeaway.length).toBeGreaterThan(40);
    expect(lesson.sourceIds[0]).toBe("lehrplan");
    for (const id of lesson.sourceIds) expect(SOURCES.find((source) => source.id === id)?.url).toMatch(/^https:\/\//);
    expect(lesson.figures).toHaveLength(1);
    for (const id of lesson.figures) {
      expect(FIGURES[id]?.items.length).toBeGreaterThanOrEqual(2);
      expect(renderFigure(id)).toContain("<figcaption>");
      expect(renderFigure(id)).toContain('role="list"');
    }
    expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
    expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
    expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
    for (const task of Object.values(lesson.tasks)) {
      expect(task.hints).toHaveLength(2);
      expect(new Set(task.criteria).size).toBe(3);
      expect(task.model.length).toBeGreaterThan(100);
    }
  });

  it.each(LESSONS)("starts unsolved and gives actionable feedback for $id", ({ workshop }) => {
    const solution = workshop.entries.map((entry) => entry.target);
    expect(solution.length).toBeGreaterThanOrEqual(5);
    expect(new Set(solution).size).toBe(workshop.categories.length);
    expect(solution.every((target) => Number.isInteger(target) && target >= 0 && target < workshop.categories.length)).toBe(true);
    expect(workshop.entries.every((entry) => entry.feedback.length > 20)).toBe(true);
    expect(checkWorkshop(workshop, solution.map(() => -1))).toEqual(solution.map(() => false));
    expect(checkWorkshop(workshop, solution)).toEqual(solution.map(() => true));
    const oneWrong = solution.map((target, index) => index === 0 ? (target + 1) % workshop.categories.length : target);
    expect(checkWorkshop(workshop, oneWrong)).toEqual(solution.map((_, index) => index !== 0));
  });
});

describe("ZAM cell and published anchors", () => {
  it("binds two answerable cards per lesson to the official learning area", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.title).toBe(ZAM_CELL_TITLE);
    expect(cell.atoms.map((atom) => atom.slug)).toEqual(LESSONS.map((lesson) => lesson.id));
    expect(items).toHaveLength(14);
    for (const atom of cell.atoms) {
      expect(atom.title).toBe(findLesson(atom.slug)?.title);
      expect(atom.source_link).toBe(lessonLink(atom.slug));
      expect(atom.curricula.find((binding) => binding.provider === "lehrplanplus-bayern")).toEqual({
        provider: "lehrplanplus-bayern", school_type: "mittelschule", grade: 6, subject: "gpg",
        topic_code: "lb3", topic_title: "Politik und Gesellschaft",
      });
      expect(atom.practice_items).toHaveLength(2);
      const [fast, recall] = atom.practice_items;
      expect(fast.tier).toBe("tier1_fast");
      expect(fast.fast_check).toMatchObject({ type: "binary_choice", correct_index: 0 });
      expect(new Set(fast.fast_check?.options).size).toBe(2);
      expect(fast.fast_check?.options[0]).toBe(fast.concept);
      expect(recall.tier).toBe("tier2_synthesis");
      expect(recall.sample_solution).toBe(recall.concept);
      for (const item of atom.practice_items) {
        expect(item.language).toBe("de");
        expect(item.source_link).toBe(lessonLink(atom.slug));
        expect(parseTrainingDeepLink(new URL(item.source_link).hash)).toEqual({ lessonId: atom.slug });
      }
    }
  });

  it("pins the identifiers and links only to prerequisites earlier in the path", () => {
    expect(cell.atoms.map((atom) => ({
      id: atom.id, slug: atom.slug, lesson: atom.source_link,
      items: atom.practice_items.map((item) => ({ id: item.id, slug: item.slug })),
    }))).toEqual(contract);
    const ids = [...cell.atoms, ...items].map((entry) => entry.id);
    expect(new Set(ids).size).toBe(21);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    for (const [index, atom] of cell.atoms.entries()) {
      const earlier = cell.atoms.slice(0, index).map((entry) => entry.id);
      for (const prerequisite of atom.prerequisites) {
        expect(earlier).toContain(prerequisite.atom_id);
        expect(prerequisite.type).toBe("soft");
      }
    }
  });

  it("proposes no card history transfer", () => {
    expect(mapping).toMatchObject({ status: "proposal-only", approved: null, sources: [], rows: [] });
    expect(cell).not.toHaveProperty("retired_items");
    for (const item of items) expect(item).not.toHaveProperty("replaces");
  });
});
