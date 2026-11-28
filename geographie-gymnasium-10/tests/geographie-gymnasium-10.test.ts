import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import publication from "../publication.json";
import replacesMapping from "../replaces-de-by.json";
import { CORE_LESSONS, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { isExplorerFigure, renderFigure } from "../src/figures";
import { LABS, reachedGoals, renderLab } from "../src/labs";
import { checkWorkshop, initialOrder } from "../src/workshop";
import { CARD_COUNT, lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import fixtureEight from "./fixtures/de-by-gymnasium-8-geographie-tropen-passatzirkulation-wuesten-kvt.json";
import fixtureNine from "./fixtures/de-by-gymnasium-9-geographie-disparitaeten-hdi-demographie-megastaedte-kvt.json";
import fixtureTen from "./fixtures/de-by-gymnasium-10-geographie-geooekozonen-klimawandel-kippelemente-kvt.json";
import contract from "./fixtures/public-contract.json";

describe("curriculum and lessons", () => {
  it("contains 30 lessons across 7 Lernbereiche matching the public contract", () => {
    expect(LESSONS).toHaveLength(30);
    expect(CORE_LESSONS).toHaveLength(30);
    expect(STAGES).toHaveLength(7);
    expect(STAGES.map((s) => s.lb)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(LESSONS.map((l) => l.id)).toEqual(contract.map((c) => c.lesson));
    for (const stage of STAGES) {
      expect(LESSONS.some((l) => l.lb === stage.lb)).toBe(true);
    }
  });

  it("resolves all sources, avoids video links, and follows German notation conventions", () => {
    const sourceIds = new Set(SOURCES.map((s) => s.id));
    for (const lesson of LESSONS) {
      expect(lesson.sourceIds.length).toBeGreaterThan(0);
      for (const id of lesson.sourceIds) expect(sourceIds.has(id)).toBe(true);
      expect("teacherVideo" in lesson).toBe(false);

      const texts = [
        lesson.title,
        lesson.period,
        lesson.intro,
        ...lesson.paragraphs,
        lesson.workedExample,
        lesson.takeaway,
        lesson.quiz.question,
        lesson.quiz.answer,
        ...lesson.quiz.wrong,
        lesson.quiz.explanation,
        lesson.transferCheck.question,
        lesson.transferCheck.answer,
        ...lesson.transferCheck.wrong,
        lesson.transferCheck.explanation,
        lesson.workshop.title,
        lesson.workshop.instruction,
        lesson.workshop.material ?? "",
        lesson.workshop.conclusion,
        ...lesson.workshop.entries.flatMap((e) => [e.text, e.feedback]),
        lesson.tasks[1].prompt,
        ...lesson.tasks[1].hints,
        lesson.tasks[1].model,
        ...lesson.tasks[1].criteria,
        lesson.tasks[2].prompt,
        ...lesson.tasks[2].hints,
        lesson.tasks[2].model,
        ...lesson.tasks[2].criteria,
      ];

      for (const text of texts) {
        expect(text).not.toMatch(/\d\.\d/);
        expect(text).not.toMatch(/(?:^|[\s(])-\d/);
        expect(text).not.toContain("×");
      }
      expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
    }
  });
});

describe("figures and interactive 3-part explorers", () => {
  it("renders every lesson figure cleanly without NaN or undefined", () => {
    for (const lesson of LESSONS) {
      expect(lesson.figures.length).toBeGreaterThan(0);
      for (const figId of lesson.figures) {
        if (isExplorerFigure(figId)) {
          for (const part of [0, 1, 2]) {
            const html = renderFigure(figId, part);
            expect(html).toContain("<svg");
            expect(html).not.toContain("NaN");
            expect(html).not.toContain("undefined");
            expect(html).toContain(`data-explore-set="${part}"`);
          }
        } else {
          const html = renderFigure(figId);
          expect(html).toContain("<svg");
          expect(html).not.toContain("NaN");
          expect(html).not.toContain("undefined");
        }
      }
    }
  });
});

describe("interactive SVG labs", () => {
  it("covers 10 lessons, starts with 0 reached goals, and reaches every goal via its witness", () => {
    const labLessons = LESSONS.filter((l) => l.lab);
    expect(labLessons).toHaveLength(10);
    expect(Object.keys(LABS)).toHaveLength(10);

    for (const lab of Object.values(LABS)) {
      const start = lab.initial();
      expect(reachedGoals(lab, start)).toEqual([false, false, false]);
      const startHtml = renderLab(lab, start, [false, false, false]);
      expect(startHtml).toContain("<svg");
      expect(startHtml).not.toContain("NaN");
      expect(startHtml).not.toContain("undefined");

      lab.witnesses.forEach((witness, index) => {
        const done = reachedGoals(lab, witness);
        expect(done[index]).toBe(true);
        const witnessHtml = renderLab(lab, witness, done);
        expect(witnessHtml).toContain("<svg");
        expect(witnessHtml).not.toContain("NaN");
        expect(witnessHtml).not.toContain("undefined");
      });
    }
  });
});

describe("workshops", () => {
  it("never starts timelines already solved and verifies exact solutions", () => {
    for (const lesson of LESSONS) {
      const work = lesson.workshop;
      if (work.kind === "timeline") {
        const initial = initialOrder(work, lesson.id);
        expect(checkWorkshop(work, initial).every(Boolean)).toBe(false);
        const solved = Array.from({ length: work.entries.length }, (_, pos) =>
          work.entries.findIndex((e) => e.target === pos),
        );
        expect(checkWorkshop(work, solved).every(Boolean)).toBe(true);
      } else {
        const solved = work.entries.map((e) => e.target);
        expect(checkWorkshop(work, solved).every(Boolean)).toBe(true);
        expect(checkWorkshop(work, work.entries.map(() => -1)).some(Boolean)).toBe(false);
      }
    }
  });
});

describe("ZAM cell, coverage and proposal-only legacy mapping", () => {
  it("pins 30 atoms, 60 items, clean contracts and no self-approved replacements", () => {
    expect(publication.status).toBe("ready");
    expect(publication.version).toBe("0.0");
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(30);

    const allItems = cell.atoms.flatMap((a) => a.practice_items);
    expect(allItems).toHaveLength(CARD_COUNT);

    const cellContract = cell.atoms.map((a) => ({
      lesson: new URL(a.source_link).hash.replace(/^#lesson=/, ""),
      atom: a.id,
      slug: a.slug,
      items: a.practice_items.map((item) => ({ id: item.id, slug: item.slug })),
    }));
    expect(cellContract).toEqual(contract);

    for (const atom of cell.atoms) {
      expect(atom.source_link).toBe(lessonLink(new URL(atom.source_link).hash.replace(/^#lesson=/, "")));
      for (const item of atom.practice_items) {
        expect("replaces" in item).toBe(false);
        expect(item.source_link).toBe(atom.source_link);
        const texts = [
          item.question,
          item.concept,
          ...(item.sample_solution ? [item.sample_solution] : []),
          ...(item.fast_check ? item.fast_check.options : []),
          ...item.choice_distractors.flatMap((d) => [d.text, d.reason]),
        ];
        for (const text of texts) {
          if (!/^https?:/.test(text)) expect(text).not.toMatch(/\d\.\d/);
          expect(text).not.toMatch(/(?:^|[\s(])-\d/);
          expect(text).not.toContain("×");
        }
      }
    }
    expect("retired_items" in cell).toBe(false);
  });

  it("keeps replaces-de-by.json proposal-only and maps every legacy item once", () => {
    expect(replacesMapping.status).toBe("proposal-only");
    expect(replacesMapping.approved).toBeNull();

    const oldIds = [fixtureEight, fixtureNine, fixtureTen].flatMap((tile) =>
      tile.atoms.flatMap((a) => a.practice_items.map((item) => item.id)),
    );
    expect(oldIds).toHaveLength(12);
    expect(replacesMapping.rows.map((r) => r.de_by_id).sort()).toEqual([...oldIds].sort());

    const itemSlugs = new Set(cell.atoms.flatMap((a) => a.practice_items.map((item) => item.slug)));
    for (const row of replacesMapping.rows) {
      if (row.action === "propose-replace-after-approval") {
        expect(row.academy_slug).toBeTruthy();
        expect(itemSlugs.has(row.academy_slug!)).toBe(true);
      } else {
        expect(row.academy_slug).toBeNull();
      }
    }
  });

  it("covers all curriculum rows and cites every lesson in coverage.json", () => {
    const lessonIds = new Set(LESSONS.map((l) => l.id));
    const cited = new Set<string>(coverage.optional_lessons);
    for (const row of coverage.rows) {
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        expect(lessonIds.has(id)).toBe(true);
        cited.add(id);
      }
    }
    for (const id of lessonIds) expect(cited.has(id)).toBe(true);
  });

  it("parses deep links cleanly", () => {
    expect(parseTrainingDeepLink("#lesson=karten-und-satellitenbilder&level=2", "")).toEqual({
      lessonId: "karten-und-satellitenbilder",
      level: 2,
    });
    expect(lessonLink("klimadiagramme-und-zonen")).toBe(
      "https://academy.zam-os.org/geographie-gymnasium-10/#lesson=klimadiagramme-und-zonen",
    );
  });
});
