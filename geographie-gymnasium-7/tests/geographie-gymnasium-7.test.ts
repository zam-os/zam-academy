import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { renderFigure } from "../src/figures";
import { LABS, reachedGoals, renderLab } from "../src/labs";
import { checkWorkshop } from "../src/workshop";
import { CARD_COUNT, lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";
import grade6 from "./fixtures/de-by-gymnasium-6-geographie-europa-raeume-wirtschaft-eu-kvt.json";
import grade7 from "./fixtures/de-by-gymnasium-7-geographie-europa-naturraeume-klima-plattentektonik-kvt.json";

describe("course contract", () => {
  it("maps all six areas and every lesson to the curriculum", () => {
    expect(STAGES.map((stage) => stage.lb)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(coverage.competencies).toHaveLength(29);
    const lessonIds = LESSONS.map((lesson) => lesson.id);
    expect(new Set(lessonIds)).toEqual(new Set(coverage.competencies.flatMap((row) => row.lessons)));
    const activeLabs = new Set(LESSONS.flatMap((lesson) => lesson.lab ? [lesson.lab] : []));
    expect(activeLabs).toEqual(new Set(Object.keys(LABS)));
  });

  it.each(LESSONS)("$id has a visual, a check, a solvable workshop and two distinct tasks", (lesson) => {
    expect(lesson.sourceIds.every((id) => SOURCES.some((source) => source.id === id))).toBe(true);
    expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(lesson.figures).toHaveLength(1);
    const drawing = renderFigure(lesson.figures[0]);
    expect(drawing).toContain("<svg");
    expect(drawing).not.toMatch(/NaN|undefined/);
    expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
    expect(checkWorkshop(lesson.workshop, lesson.workshop.entries.map(({ target }) => target)).every(Boolean)).toBe(true);
    expect(checkWorkshop(lesson.workshop, lesson.workshop.entries.map(() => -1)).every(Boolean)).toBe(false);
    expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
    for (const task of Object.values(lesson.tasks)) {
      expect(task.criteria).toHaveLength(3);
      expect(task.hints).toHaveLength(2);
    }
    expect(parseTrainingDeepLink(`#lesson=${lesson.id}&level=2`)).toEqual({ lessonId: lesson.id, level: 2 });
  });
});

describe("interactive models", () => {
  it.each(Object.values(LABS))("$id starts without completed goals and every goal is reachable", (lab) => {
    const start = lab.initial();
    expect(reachedGoals(lab, start)).toEqual([false, false, false]);
    for (const [i, witness] of lab.witnesses.entries()) {
      expect(reachedGoals(lab, witness)[i]).toBe(true);
      const html = renderLab(lab, witness, reachedGoals(lab, witness));
      expect(html).toContain("data-lab-");
      expect(html).toContain("role=\"status\"");
      expect(html).not.toMatch(/NaN|undefined/);
    }
  });

  it("shows increasing total withdrawal when irrigation efficiency improves but area expands enough", () => {
    expect(LABS.bewasserung.render({ area: 10, water: 8 })).toContain("80 Einheiten");
    const expanded = LABS.bewasserung.render({ area: 15, water: 8 });
    expect(expanded).toContain("120 Einheiten");
    expect(expanded).toContain("Der Vorrat nimmt im Modell ab.");
  });
});

describe("ZAM cell", () => {
  it("keeps stable IDs, lesson anchors and the correct curriculum scope", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(LESSONS.length);
    const idPattern = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
    expect(cell.atoms.flatMap((atom) => atom.practice_items)).toHaveLength(CARD_COUNT);
    const ids = cell.atoms.flatMap((atom) => [atom.id, ...atom.practice_items.map((item) => item.id)]);
    expect(ids.every((id) => idPattern.test(id))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(cell.atoms.map((atom, i) => ({
      lesson: LESSONS[i].id, atom: atom.id, slug: atom.slug,
      items: atom.practice_items.map(({ id, slug }) => ({ id, slug })),
    }))).toEqual(contract);
    for (const [i, atom] of cell.atoms.entries()) {
      const lesson = LESSONS[i];
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(atom.curricula).toContainEqual(expect.objectContaining({
        provider: "lehrplanplus-bayern", school_type: "gymnasium", grade: 7,
        subject: "geographie", topic_code: `lb${lesson.lb}`,
      }));
      const [fast, synthesis] = atom.practice_items;
      expect(fast.fast_check?.correct_index).toBe(0);
      expect(fast.fast_check?.options[0]).toBe(fast.concept);
      expect(synthesis.sample_solution).toBeTruthy();
      for (const item of atom.practice_items) expect(item.source_link).toBe(atom.source_link);
    }
  });

  it("accounts for every legacy item with no unapproved history change", () => {
    const legacy = [grade6, grade7].flatMap((tile) =>
      tile.atoms.flatMap((atom) => atom.practice_items.map(({ id }) => [tile.tile_id, id])));
    expect(mapping.rows.map(({ de_by_cell, de_by_id }) => [de_by_cell, de_by_id]).sort()).toEqual(legacy.sort());
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    expect(cell).not.toHaveProperty("retired_items");
    const items = cell.atoms.flatMap((atom) => atom.practice_items);
    for (const item of items) expect(item).not.toHaveProperty("replaces");
    for (const row of mapping.rows) {
      expect(row.reason).not.toBe("");
      if (row.category === "A") {
        expect(items.filter(({ slug }) => slug === row.academy_slug)).toHaveLength(1);
        expect(row.action).toBe("propose-replace-after-approval");
      } else {
        expect(row.academy_slug).toBeNull();
        expect(row.action).toBe("keep-active");
      }
    }
  });
});
