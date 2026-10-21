import { afterEach, describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import matrix from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { CORE_LESSONS, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { MODEL_SCENARIOS } from "../src/models";
import {
  completion,
  freshProgress,
  isComplete,
  loadProgress,
  parseProgress,
  saveProgress,
  writingKey,
} from "../src/storage/progress";
import {
  canAcceptSelfAssessment,
  canReviewDraft,
  checkWorkshop,
  esc,
  initialOrder,
  moveEntry,
  shuffle,
} from "../src/workshop";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import geneticRaw from "./fixtures/de-by-realschule-9-biologie-genetik-vererbung-kvt.json?raw";
import nerveRaw from "./fixtures/de-by-realschule-9-biologie-nervensystem-sinne-kvt.json?raw";
import evolutionRaw from "./fixtures/de-by-realschule-10-biologie-evolution-abstammung-kvt.json?raw";
import contract from "./fixtures/public-contract.json";

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const snapshots = [geneticRaw, nerveRaw, evolutionRaw];
const legacy = snapshots.flatMap((raw) =>
  JSON.parse(raw).atoms.flatMap(
    (a: {
      practice_items: Array<{
        id: string;
        question: string;
        concept: string;
        sample_solution?: string;
      }>;
    }) => a.practice_items,
  ),
) as Array<{ id: string; question: string; concept: string; sample_solution?: string }>;

describe("official scope and permanent identities", () => {
  it("covers all four Bio10 areas in the common curriculum and separates supplementary material", () => {
    expect(STAGES.map((s) => [s.lb, s.hours ?? null])).toEqual([
      [1, null],
      [2, 20],
      [3, 8],
      [4, 8],
      [5, null],
      [6, null],
    ]);
    expect(CORE_LESSONS).toHaveLength(37);
    expect(LESSONS).toHaveLength(46);
    for (const source of SOURCES) {
      expect(cell.sources.some((entry) => entry.uri === source.url)).toBe(true);
    }
    expect(STAGES.map((s) => LESSONS.filter((l) => l.lb === s.lb).length)).toEqual([
      5, 18, 7, 7, 4, 5,
    ]);
    expect(matrix.areas.map((a) => a.lb)).toEqual([1, 2, 3, 4]);
    const referenced = matrix.areas.flatMap((area) => area.competencies.flatMap((c) => c.lessons));
    expect(new Set(referenced)).toEqual(new Set(CORE_LESSONS.map((l) => l.id)));
    expect(matrix.supplementary.flatMap((s) => s.lessons)).toEqual(
      LESSONS.filter((l) => l.optional).map((l) => l.id),
    );
    expect(LESSONS.filter((l) => l.projectStep).map((l) => l.projectStep)).toEqual([
      "question",
      "evidence",
      "judgment",
    ]);
  });
  it("pins every published atom, item, slug and linked anchor independently", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(46);
    expect(items).toHaveLength(93);
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        lesson: a.source_link,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    expect(LESSONS.map((l) => lessonLink(l.id))).toEqual(contract.map((a) => a.lesson));
    const ids = [...cell.atoms, ...items].map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
  });
  it.each(LESSONS)("has distinct sourced exercises and correct bindings: $id", (lesson) => {
    expect(lesson.paragraphs).toHaveLength(2);
    expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(400);
    expect(lesson.sourceIds.length).toBeGreaterThan(0);
    for (const id of lesson.sourceIds)
      expect(SOURCES.find((s) => s.id === id)?.url).toMatch(/^https:\/\//);
    expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
    expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
    for (const task of Object.values(lesson.tasks)) {
      expect(task.model.length).toBeGreaterThan(120);
      expect(task.criteria).toHaveLength(3);
      expect(task.hints).toHaveLength(2);
    }
    const atom = cell.atoms.find((a) => a.source_link === lessonLink(lesson.id))!;
    expect(atom.title).toBe(lesson.title);
    const official = atom.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
    if (lesson.optional) expect(official).toEqual([]);
    else {
      expect(official).toHaveLength(1);
      expect(official[0]).toMatchObject({
        school_type: "realschule",
        grade: 10,
        subject: "biologie",
        topic_code: `lb${lesson.lb}`,
      });
      expect("track" in official[0]).toBe(false);
    }
    expect(atom.practice_items[0]).toMatchObject({
      question: lesson.quiz.question,
      concept: lesson.quiz.answer,
      edge_representative: true,
    });
    expect(atom.practice_items[1]).toMatchObject({
      question: lesson.tasks[1].prompt,
      concept: lesson.tasks[1].model,
    });
    for (const item of atom.practice_items) expect(item.source_link).toBe(lessonLink(lesson.id));
    for (const edge of atom.prerequisites)
      expect(cell.atoms.some((a) => a.id === edge.atom_id)).toBe(true);
  });
  it("contains no invented Biology 9 binding and no false full coverage for grade 7 or 8", () => {
    const bindings = cell.atoms.flatMap((a) =>
      a.curricula.filter((c) => c.provider === "lehrplanplus-bayern"),
    );
    expect(bindings.every((c) => c.grade === 10)).toBe(true);
    expect(new Set(bindings.map((c) => c.topic_code))).toEqual(
      new Set(["lb1", "lb2", "lb3", "lb4"]),
    );
  });
});
describe("explicit approved learning-state mapping", () => {
  it("classifies all 26 snapshot items once under this package's own approval", async () => {
    expect(mapping.approved).toBe("2026-10-21");
    expect(mapping.authorization).toContain("zam-os/zam-academy#16");
    expect(mapping.source).toContain("Freigabe erteilt");
    expect(mapping.rows).toHaveLength(26);
    expect(new Set(mapping.rows.map((r) => r.de_by_id))).toEqual(new Set(legacy.map((i) => i.id)));
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(10);
    expect(mapping.rows.filter((r) => r.category === "B")).toHaveLength(1);
    expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(15);
    for (const [index, source] of mapping.sources.entries()) {
      const bytes = new TextEncoder().encode(snapshots[index]);
      const hash = await crypto.subtle.digest("SHA-256", bytes);
      expect([...new Uint8Array(hash)].map((n) => n.toString(16).padStart(2, "0")).join("")).toBe(
        source.sha256,
      );
    }
    for (const row of mapping.rows) {
      expect(row.de_by_question).toBe(legacy.find((i) => i.id === row.de_by_id)!.question);
      const successors = items.filter((item) =>
        ((item as { replaces?: string[] }).replaces ?? []).includes(row.de_by_id),
      );
      if (row.category === "C") {
        expect(successors).toHaveLength(0);
        expect(row.academy_slug).toBeNull();
        expect(cell.retired_items.some((i) => i.id === row.de_by_id)).toBe(true);
      } else {
        expect(successors).toHaveLength(1);
        expect(successors[0].slug).toBe(row.academy_slug);
        expect(cell.retired_items.some((i) => i.id === row.de_by_id)).toBe(false);
      }
    }
    const old = legacy.find((i) => i.id === "01K4B9G0000000000000000J04")!;
    const full = items.find((i) => i.slug === "bio10-dna-gesamt")!;
    expect(full.question).toBe(old.question);
    expect(full.concept).toBe(old.concept);
    expect("sample_solution" in full ? full.sample_solution : undefined).toEqual(
      old.sample_solution,
    );
  });
});
describe("workshop and self-assessment", () => {
  it.each(LESSONS)(
    "checks the whole authored exercise without accepting empty work: $id",
    (lesson) => {
      const work = lesson.workshop;
      const solution =
        work.kind === "timeline"
          ? work.entries.map((_, i) => i)
          : work.entries.map((e) => e.target);
      expect(work.entries.length).toBeGreaterThanOrEqual(3);
      expect(checkWorkshop(work, solution).every(Boolean)).toBe(true);
      for (const wrong of [[], solution.map(() => -1), solution.map(() => 999), [...solution, 0]])
        expect(checkWorkshop(work, wrong).every(Boolean)).toBe(false);
      if (work.kind === "timeline")
        for (let i = 0; i < 10; i++)
          expect(checkWorkshop(work, initialOrder(work, `${lesson.id}-${i}`)).every(Boolean)).toBe(
            false,
          );
    },
  );
  it("requires authored text and every criterion; escapes user text", () => {
    expect(canReviewDraft(" ")).toBe(false);
    expect(
      canAcceptSelfAssessment("Eine selbst formulierte begründete Antwort.", [true, true, false]),
    ).toBe(false);
    expect(
      canAcceptSelfAssessment("Eine selbst formulierte begründete Antwort.", [true, true, true]),
    ).toBe(true);
    expect(esc('<img src=x onerror="x">')).toBe("&lt;img src=x onerror=&quot;x&quot;&gt;");
    expect(moveEntry([2, 0, 1], 0, 1)).toEqual([0, 2, 1]);
    expect(moveEntry([2, 0, 1], 0, -1)).toEqual([2, 0, 1]);
    expect(new Set(LESSONS.map((l) => shuffle([0, 1, 2], l.id)[0])).size).toBeGreaterThan(1);
  });
});
describe("browser progress and lesson links", () => {
  afterEach(() => vi.unstubAllGlobals());
  it("defaults to core lessons and does not confuse optional work with core progress", () => {
    const p = freshProgress();
    expect(completion(p)).toEqual({ completed: 0, total: 37, percent: 0 });
    expect(completion(p, true, true).total).toBe(46);
    for (const l of LESSONS.filter((l) => l.optional)) {
      p.quizDone.push(l.id);
      p.workshopDone.push(l.id);
      p.writingDone.push(writingKey(l.id, 1));
    }
    expect(completion(p).completed).toBe(0);
  });
  it("rejects unknown ids, forged empty writing and malformed storage, preserving only known fields", () => {
    const id = LESSONS[0].id;
    const p = parseProgress(
      JSON.stringify({
        activeLessonId: "missing",
        level: 42,
        quizDone: [id, id, "bad"],
        writingDone: [`${id}:1`],
        drafts: { [`${id}:1`]: "x", bad: "<script>" },
        explored: { [id]: ["bad"] },
        project: { unknown: "x" },
      }),
    );
    expect(p.activeLessonId).toBe(id);
    expect(p.level).toBe(1);
    expect(p.quizDone).toEqual([id]);
    expect(p.writingDone).toEqual([]);
    expect(p.drafts.bad).toBeUndefined();
    for (const raw of [null, "broken", "[]", "null", "42"])
      expect(parseProgress(raw)).toEqual(freshProgress());
  });
  it("requires model comparisons, the real project fields and core writing separately", () => {
    const lesson = LESSONS.find((l) => l.model === "division")!,
      p = freshProgress();
    p.quizDone.push(lesson.id);
    p.workshopDone.push(lesson.id);
    p.writingDone.push(writingKey(lesson.id, 1));
    expect(isComplete(p, lesson.id)).toBe(false);
    p.explored[lesson.id] = MODEL_SCENARIOS.division.map((s) => s.id);
    expect(isComplete(p, lesson.id)).toBe(true);
    const project = LESSONS.find((l) => l.projectStep)!;
    p.quizDone.push(project.id);
    p.workshopDone.push(project.id);
    p.writingDone.push(writingKey(project.id, 1));
    expect(isComplete(p, project.id)).toBe(false);
    expect(isComplete(p, "missing")).toBe(false);
  });
  it("degrades to in-memory work when browser storage is unavailable", () => {
    vi.stubGlobal("localStorage", {
      getItem() {
        throw Error("denied");
      },
      setItem() {
        throw Error("denied");
      },
    });
    expect(loadProgress()).toEqual(freshProgress());
    expect(saveProgress(freshProgress())).toBe(false);
  });
  it("accepts only supported lesson ids and levels from fragment or query", () => {
    expect(parseTrainingDeepLink("#lesson=bio-meiose&level=2")).toEqual({
      lessonId: "bio-meiose",
      level: 2,
    });
    expect(parseTrainingDeepLink("", "?lesson=bio-dna-bau&level=1")).toEqual({
      lessonId: "bio-dna-bau",
      level: 1,
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
    expect(lessonLink("bio-meiose")).toBe(
      "https://academy.zam-os.org/biologie-realschule-10/#lesson=bio-meiose",
    );
  });
});
