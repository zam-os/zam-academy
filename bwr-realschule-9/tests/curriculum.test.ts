import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import coverage from "../coverage.json";
import legacy from "./fixtures/de-by-realschule-9-bwr-anlagenkauf-abschreibung-umsatzsteuer-kvt.json";
import { CORE_LESSONS, findLesson, LESSONS, SOURCES } from "../src/curriculum";
import {
  completion,
  freshProgress,
  isComplete,
  keyOf,
  noteDocumented,
  parseProgress,
} from "../src/storage/progress";
import { canAcceptSelfAssessment, checkWorkshop } from "../src/workshop";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";

describe("public learning contract", () => {
  it("accounts for every curriculum competence and every core lesson", () => {
    expect(coverage.rows).toHaveLength(28);
    expect(coverage.track).toBe("II");
    const covered = new Set(coverage.rows.flatMap((row) => row.lessons));
    expect(new Set(CORE_LESSONS.map((l) => l.id))).toEqual(covered);
    for (const row of coverage.rows) {
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) expect(findLesson(id)).toBeDefined();
      expect(row.lessons.some((id) => findLesson(id)?.lb === row.lb)).toBe(true);
    }
  });
  it("pins the actual curriculum: 44 core lessons in II and two non-core refreshers", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
    expect(CORE_LESSONS).toHaveLength(44);
    expect([1, 2, 3, 4, 5].map((lb) => CORE_LESSONS.filter((l) => l.lb === lb).length)).toEqual([
      7, 11, 9, 8, 9,
    ]);
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({
          id: i.id,
          slug: i.slug,
          source_link: i.source_link,
        })),
      })),
    ).toEqual(contract.atoms);
    expect(cell.atoms.flatMap((a) => a.practice_items)).toHaveLength(92);
    expect(
      new Set(cell.atoms.flatMap((a) => [a.id, ...a.practice_items.map((i) => i.id)])).size,
    ).toBe(138);
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice(8));
      expect(lesson).toBeDefined();
      if (!lesson) throw new Error("Unbekannter Lektionsanker");
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      const bindings = atom.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(bindings).toHaveLength(lesson.optional ? 0 : 1);
      for (const b of bindings)
        expect(b).toMatchObject({
          school_type: "realschule",
          grade: 9,
          track: "II",
          subject: "bwr",
          topic_code: `lb${lesson.lb}`,
        });
      for (const item of atom.practice_items) {
        expect(item.source_link).toBe(atom.source_link);
        expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
        expect(item.concept.trim().length).toBeGreaterThan(0);
      }
    }
    expect(JSON.stringify(LESSONS)).not.toContain('"practice_items"');
  });
  for (const lesson of LESSONS)
    it(`${lesson.id}: sourced explanations and an unambiguous case workshop`, () => {
      expect(lesson.paragraphs).toHaveLength(2);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      for (const id of lesson.sourceIds) expect(SOURCES.some((s) => s.id === id)).toBe(true);
      const solution = lesson.workshop.entries.map((e) => e.target);
      expect(checkWorkshop(lesson.workshop, solution).every(Boolean)).toBe(true);
      expect(checkWorkshop(lesson.workshop, []).some(Boolean)).toBe(false);
      for (const level of [1, 2] as const) {
        expect(lesson.tasks[level].model.length).toBeGreaterThan(80);
        expect(lesson.tasks[level].criteria).toHaveLength(3);
      }
    });
  it("maps each old card once, with two exact recalls and two unsplit histories", () => {
    const oldIds = legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id));
    expect(mapping.rows.map((r) => r.de_by_id)).toEqual(oldIds);
    const items = cell.atoms.flatMap((a) => a.practice_items) as Array<{
      slug: string;
      replaces?: string[];
    }>;
    for (const row of mapping.rows) {
      const successors = items.filter((i) => i.replaces?.includes(row.de_by_id));
      expect(successors).toHaveLength(row.category === "A" ? 1 : 0);
      if (row.category === "A") expect(successors[0].slug).toBe(row.academy_slug);
      else expect(cell.retired_items.some((r) => r.id === row.de_by_id)).toBe(true);
    }
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(2);
    expect(cell.retired_items).toHaveLength(2);
    expect(mapping.approved).toBe("2026-10-21");
  });
});
describe("learning evidence and local recovery", () => {
  it("requires three independent tasks and an explicit written self-assessment", () => {
    const p = freshProgress(),
      id = "an-linear",
      key = keyOf(id, 1);
    p.quiz.push(id);
    p.workshop.push(id);
    p.assessed.push(key);
    p.drafts[key] = "Die Anschaffungskosten werden gleichmäßig auf fünf Jahre verteilt.";
    expect(isComplete(p, id)).toBe(false);
    p.solved[key] = 2;
    expect(isComplete(p, id)).toBe(false);
    p.solved[key] = 3;
    expect(isComplete(p, id)).toBe(true);
    p.extra = true;
    expect(completion(p).total).toBe(44);
    expect(canAcceptSelfAssessment(p.drafts[key], [true, true, false])).toBe(false);
    expect(canAcceptSelfAssessment("kurz", [true, true, true])).toBe(false);
  });
  it("sanitizes corrupt storage and preserves optional card links without changing the denominator", () => {
    expect(parseProgress("bad")).toEqual(freshProgress());
    expect(parseProgress("[]")).toEqual(freshProgress());
    const p = parseProgress(
      JSON.stringify({
        active: "gr-vorsteuer",
        quiz: ["gr-vorsteuer", "gr-vorsteuer", "bad"],
        drafts: { "an-linear:1": "x".repeat(9000), bad: "x" },
        assessed: ["an-linear:1", "uf-privat:1"],
        solved: { "an-linear:1": 900, "uf-privat:1": -1, "fo-ewb:1": 1.5 },
        serial: { "an-linear:1": 999999999 },
      }),
    );
    expect(p.active).toBe("gr-vorsteuer");
    expect(p.extra).toBe(false);
    expect(p.quiz).toEqual(["gr-vorsteuer"]);
    expect(p.drafts["an-linear:1"]).toHaveLength(8000);
    expect(p.assessed).toEqual(["an-linear:1"]);
    expect(p.solved).toEqual({ "an-linear:1": 3 });
    expect(p.serial).toEqual({ "an-linear:1": 1000000 });
    expect(completion(p).total).toBe(44);
    expect(parseTrainingDeepLink("#lesson=gr-vorsteuer&level=2")).toEqual({
      lessonId: "gr-vorsteuer",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=7")).toEqual({});
  });
  it("keeps a documented external activity separate from lesson completion", () => {
    const p = freshProgress();
    p.note = {
      question: "x".repeat(25),
      source: "x".repeat(25),
      observation: "x".repeat(25),
      conclusion: "x".repeat(25),
      performed: false,
    };
    expect(noteDocumented(p.note)).toBe(false);
    p.note.performed = true;
    expect(noteDocumented(p.note)).toBe(true);
    expect(completion(p).done).toBe(0);
  });
});
