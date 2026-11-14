import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import replacesMapping from "../replaces-de-by.json";
import outline from "../src/curriculum/outline.json";
import { LESSONS, SOURCES, STAGES, findLesson } from "../src/curriculum";
import { renderQuizFeedback, renderWorkshopFeedback } from "../src/feedback";
import { FIGURES, renderFigure } from "../src/figures";
import type { LabKind } from "../src/model/types";
import {
  STORAGE_KEY,
  completion,
  confirmWriting,
  freshProgress,
  isComplete,
  recordQuizAnswer,
  recordWorkshopAnswer,
  updateDraft,
} from "../src/storage/progress";
import {
  canAcceptSelfAssessment,
  canReviewDraft,
  checkWorkshop,
  initialOrder,
  moveEntry,
} from "../src/workshop";
import {
  ZAM_CELL_ID,
  lessonLink,
  parseTrainingDeepLink,
} from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const ULID_RE = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
const LAB_KINDS: readonly LabKind[] = [
  "seasons",
  "thermometer",
  "eyeLens",
  "torso",
  "armLever",
  "particles",
];

function learnerText(l: (typeof LESSONS)[number]): string {
  const work = l.workshop;
  const excerpt = work.sourceExcerpt
    ? [
        work.sourceExcerpt.title,
        work.sourceExcerpt.author,
        work.sourceExcerpt.date,
        work.sourceExcerpt.audience,
        work.sourceExcerpt.text,
        work.sourceExcerpt.context,
      ]
    : [];
  const table = work.dataTable
    ? [
        work.dataTable.title,
        work.dataTable.unit,
        work.dataTable.note,
        ...work.dataTable.rows.map((r) => r.label),
      ]
    : [];
  return [
    l.title,
    l.period,
    l.intro,
    l.review ?? "",
    ...l.paragraphs,
    l.takeaway,
    l.quiz.question,
    l.quiz.answer,
    ...l.quiz.wrong,
    l.quiz.explanation,
    work.title,
    work.instruction,
    work.material ?? "",
    work.materialLabel ?? "",
    ...excerpt,
    ...table,
    ...work.categories,
    ...work.entries.flatMap((e) => [e.text, e.feedback]),
    work.conclusion,
    l.tasks[1].prompt,
    ...l.tasks[1].hints,
    l.tasks[1].model,
    ...l.tasks[1].criteria,
    l.tasks[2].prompt,
    ...l.tasks[2].hints,
    l.tasks[2].model,
    ...l.tasks[2].criteria,
  ].join("\n");
}

describe("nt-mittelschule-5 curriculum and content", () => {
  it("covers all 41 verbatim LehrplanPLUS rows across 32 lessons in 4 stages", () => {
    expect(STAGES).toHaveLength(4);
    expect(LESSONS).toHaveLength(32);
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(32);
    expect(coverage.curriculum_sha256).toBe(
      "456b05f9d83b5b7b79e6723ebe892bb63f65890bd807947bd29f52a0a213d9b0",
    );
    expect(coverage.rows).toHaveLength(41);
    for (const r of coverage.rows) {
      expect(r.lessons.length).toBeGreaterThan(0);
      expect(findLesson(r.lessons[0])?.lb).toBe(r.lb);
      for (const id of r.lessons) expect(findLesson(id)).toBeDefined();
      expect(["implemented", "supported"]).toContain(r.status);
      expect(r.evidence.length).toBeGreaterThan(60);
      expect(r.additional.length).toBeGreaterThan(25);
    }
    const cited = new Set(coverage.rows.flatMap((r) => r.lessons));
    expect(
      LESSONS.filter(
        (l) =>
          !cited.has(l.id) &&
          !(coverage.optional_lessons as string[]).includes(l.id),
      ),
    ).toEqual([]);
    expect(
      coverage.rows
        .filter((r) => r.status === "supported")
        .map((r) => [r.lb, r.position]),
    ).toEqual([
      [1, 1],
      [1, 2],
      [1, 4],
      [2, 5],
      [2, 6],
      [2, 7],
      [2, 9],
      [2, 12],
      [3, 7],
      [3, 9],
      [4, 3],
      [4, 4],
    ]);
    expect(outline.stages).toHaveLength(4);
    expect(SOURCES.length).toBeGreaterThanOrEqual(50);
  });

  it.each(LESSONS)(
    "provides explanation, check, figure/lab and two distinct tasks: $id",
    (l) => {
      expect(l.id).toMatch(/^nt5-[a-z0-9-]+$/);
      expect(l.paragraphs).toHaveLength(2);
      expect(l.paragraphs.join(" ").length).toBeGreaterThan(300);
      expect(l.takeaway.length).toBeGreaterThan(40);
      expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
      expect(l.quiz.explanation.length).toBeGreaterThan(35);
      expect(l.sourceIds[0]).toBe("lehrplan");
      for (const id of l.sourceIds) {
        expect(SOURCES.find((s) => s.id === id)?.url).toMatch(/^https:\/\//);
      }
      expect(l.figures.length + (l.lab ? 1 : 0)).toBeGreaterThan(0);
      for (const id of l.figures) expect(FIGURES[id]).toBeDefined();
      if (l.lab) expect(LAB_KINDS).toContain(l.lab);
      expect("teacherVideo" in l).toBe(false);
      expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
      expect(l.tasks[1].model).not.toBe(l.tasks[2].model);
      for (const t of Object.values(l.tasks)) {
        expect(t.model.length).toBeGreaterThan(100);
        expect(t.hints).toHaveLength(2);
        expect(t.criteria).toHaveLength(3);
      }
    },
  );

  it.each(LESSONS)("follows German writing conventions: $id", (l) => {
    const text = learnerText(l);
    expect(text).not.toMatch(/\d\.\d/);
    expect(text).not.toMatch(/(?<![A-Za-z0-9ÄÖÜäöüß])-\d/);
    expect(text).not.toMatch(/\b(TODO|TBD|Lorem|undefined|NaN)\b/i);
  });
});

describe("figures, workshops and feedback", () => {
  it("renders every registered figure cleanly and rejects unknown keys", () => {
    expect(renderFigure("missing")).toBe("");
    for (const id of Object.keys(FIGURES)) {
      const html = renderFigure(id);
      expect(html).toContain("<svg");
      expect(html).toContain('role="img"');
      expect(html).toContain("<figcaption>");
      const match = html.match(/aria-label="([^"]+)"/);
      expect(match?.[1].length ?? 0).toBeGreaterThanOrEqual(40);
      expect(html).not.toMatch(/\b(NaN|undefined|Infinity)\b/);
    }
  });

  it.each(LESSONS)("builds a solvable workshop for $id", (l) => {
    const w = l.workshop;
    expect(w.entries.length).toBeGreaterThanOrEqual(4);

    if (w.kind === "timeline") {
      expect(w.categories).toEqual([]);
      const start = initialOrder(w, l.id);
      expect(checkWorkshop(w, start).every(Boolean)).toBe(false);
      const solved = w.entries.map((_, i) => i);
      expect(checkWorkshop(w, solved).every(Boolean)).toBe(true);
      const moved = moveEntry(solved, 0, 1);
      expect(moved[0]).toBe(1);
      expect(renderWorkshopFeedback(w, solved)).toContain(w.conclusion);
    } else {
      expect(w.categories.length).toBeGreaterThanOrEqual(2);
      expect(new Set(w.entries.map((e) => e.target)).size).toBe(
        w.categories.length,
      );
      const solved = w.entries.map((e) => e.target);
      expect(checkWorkshop(w, solved).every(Boolean)).toBe(true);
      expect(renderWorkshopFeedback(w, solved)).toContain(w.conclusion);
    }

    expect(renderQuizFeedback(l.quiz, 0)).toContain(l.quiz.explanation);
    expect(renderQuizFeedback(l.quiz, 1)).not.toContain(l.quiz.explanation);
    expect(canReviewDraft("")).toBe(false);
    expect(canReviewDraft(l.tasks[1].model)).toBe(true);
    expect(
      canAcceptSelfAssessment(l.tasks[1].model, [true, true, true]),
    ).toBe(true);
  });
});

describe("ZAM cell and public contract", () => {
  it("contains 32 atoms and 64 cards synced with lessons and ULID contract", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(32);
    expect(contract).toHaveLength(32);

    const allIds = new Set<string>();
    const atomById = new Map<string, number>();

    cell.atoms.forEach((atom, idx) => {
      const lesson = LESSONS[idx];
      expect(atom.slug).toBe(lesson.id);
      expect(atom.id).toMatch(ULID_RE);
      expect(allIds.has(atom.id)).toBe(false);
      allIds.add(atom.id);
      atomById.set(atom.id, idx);
      expect(atom.source_link).toBe(
        `https://academy.zam-os.org/nt-mittelschule-5/#lesson=${lesson.id}`,
      );
      expect("replaces" in atom).toBe(false);
      expect(atom.practice_items).toHaveLength(2);
      expect(atom.curricula).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            provider: "lehrplanplus-bayern",
            school_type: "mittelschule",
            grade: 5,
            subject: "nt",
            topic_code: `lb${lesson.lb}`,
          }),
        ]),
      );

      for (const prereq of atom.prerequisites) {
        const reqIdx = atomById.get(prereq.atom_id);
        expect(reqIdx).toBeDefined();
        expect(reqIdx!).toBeLessThan(idx);
      }

      const [t1, t2] = atom.practice_items;
      expect(t1.id).toMatch(ULID_RE);
      expect(t2.id).toMatch(ULID_RE);
      expect(allIds.has(t1.id)).toBe(false);
      allIds.add(t1.id);
      expect(allIds.has(t2.id)).toBe(false);
      allIds.add(t2.id);

      expect(t1.tier).toBe("tier1_fast");
      expect(t1.question).toBe(lesson.quiz.question);
      expect(t1.concept).toBe(lesson.quiz.answer);
      expect(t1.fast_check?.options).toEqual([
        lesson.quiz.answer,
        lesson.quiz.wrong[0],
      ]);
      expect(t1.fast_check?.correct_index).toBe(0);

      expect(t2.tier).toBe("tier2_synthesis");
      expect(t2.question).not.toBe(t1.question);
      expect(t2.concept.length).toBeLessThan(190);
      expect(t2.sample_solution).toBe(t2.concept);
      expect(t2.concept).not.toMatch(/\d\.\d/);
      expect(t2.concept).not.toMatch(/(?<![A-Za-z0-9ÄÖÜäöüß])-\d/);

      expect(contract[idx]).toEqual({
        id: atom.id,
        slug: atom.slug,
        lesson: atom.source_link,
        items: [
          { id: t1.id, slug: t1.slug },
          { id: t2.id, slug: t2.slug },
        ],
      });
    });

    expect(allIds.size).toBe(96);
    const totalPrereqs = cell.atoms.reduce(
      (sum, a) => sum + a.prerequisites.length,
      0,
    );
    expect(totalPrereqs).toBeGreaterThanOrEqual(18);
  });

  it("keeps replaces-de-by.json proposal-only without active overrides", () => {
    expect(replacesMapping.status).toBe("proposal-only");
    expect(replacesMapping.approved).toBeNull();
    expect(replacesMapping.rows).toEqual([]);
    expect("retired_items" in cell).toBe(false);
  });

  it("builds lesson deep links and tracks completion progress", () => {
    expect(STORAGE_KEY).toBe("nt_ms5_academy_progress_v1");
    expect(lessonLink("nt5-forscherweg")).toBe(
      "https://academy.zam-os.org/nt-mittelschule-5/#lesson=nt5-forscherweg",
    );
    expect(parseTrainingDeepLink("#lesson=nt5-forscherweg&level=2")).toEqual({
      lessonId: "nt5-forscherweg",
      level: 2,
    });
    const p = freshProgress();
    const id = LESSONS[0].id;
    recordQuizAnswer(p, id, true);
    recordWorkshopAnswer(p, id, true);
    updateDraft(p, id, 1, LESSONS[0].tasks[1].model);
    expect(isComplete(p, id)).toBe(false);
    expect(confirmWriting(p, id, 1, LESSONS[0].tasks[1].model)).toBe(true);
    expect(isComplete(p, id)).toBe(true);
    expect(completion(p).completed).toBe(1);
    expect(completion(p).total).toBe(32);
  });
});
