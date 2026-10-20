import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
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
import legacy from "./fixtures/de-by-realschule-9-geographie-klima-ressourcen-kvt.json";
import contract from "./fixtures/public-contract.json";

const items = cell.atoms.flatMap((a) => a.practice_items);
const oldItems = legacy.atoms.flatMap((a) => a.practice_items);

describe("curriculum and stable public contract", () => {
  it("maps all core lessons to actual official areas and keeps optional material separate", () => {
    expect(coverage.areas.map((area) => area.lb)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    const referenced = coverage.areas.flatMap((area) =>
      area.competencies.flatMap((competency) => competency.lessons),
    );
    expect(new Set(referenced)).toEqual(new Set(CORE_LESSONS.map((lesson) => lesson.id)));
    for (const area of coverage.areas)
      for (const competency of area.competencies)
        for (const id of competency.lessons) {
          expect(LESSONS.some((lesson) => lesson.id === id && !lesson.optional)).toBe(true);
        }
    expect(coverage.optional_bilingual.lessons).toEqual(
      LESSONS.filter((lesson) => lesson.lb === 8).map((lesson) => lesson.id),
    );
    expect(coverage.foundations.lessons).toEqual(
      LESSONS.filter((lesson) => lesson.lb === 9).map((lesson) => lesson.id),
    );
  });

  it("covers the seven mandatory areas, optional English and separate refreshers", () => {
    expect(CORE_LESSONS).toHaveLength(35);
    expect(LESSONS).toHaveLength(45);
    expect(STAGES.map((s) => LESSONS.filter((l) => l.lb === s.lb).length)).toEqual([
      5, 7, 6, 4, 5, 5, 3, 7, 3,
    ]);
    expect(STAGES.map((s) => s.hours ?? null)).toEqual([9, 10, 10, 8, 10, 5, 4, null, null]);
    expect(LESSONS.filter((l) => l.language === "en")).toHaveLength(7);
    expect(LESSONS.filter((l) => l.optional).every((l) => l.lb >= 8)).toBe(true);
    expect(LESSONS.filter((l) => l.projectStep).map((l) => l.projectStep)).toEqual([
      "question",
      "evidence",
      "judgment",
    ]);
    expect(LESSONS.filter((l) => l.model)).toHaveLength(8);
  });
  it.each(LESSONS)("has sourced material and distinct written tasks: $id", (lesson) => {
    expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(300);
    expect(lesson.sourceIds.length).toBeGreaterThan(0);
    for (const id of lesson.sourceIds)
      expect(SOURCES.find((s) => s.id === id)?.url).toMatch(/^https:\/\//);
    expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
    expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
    for (const task of Object.values(lesson.tasks)) {
      expect(task.model.length).toBeGreaterThan(100);
      expect(task.criteria).toHaveLength(3);
      expect(task.hints).toHaveLength(2);
    }
  });
  it("pins all public ids, slugs and lesson anchors", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(45);
    expect(items).toHaveLength(91);
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        lesson: a.source_link,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    const ids = [...cell.atoms, ...items].map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
    expect(LESSONS.map((l) => lessonLink(l.id))).toEqual(contract.map((a) => a.lesson));
  });
  it.each(LESSONS)("binds actual Geo9 areas and keeps fresh content separate: $id", (lesson) => {
    const atom = cell.atoms.find((a) => a.source_link === lessonLink(lesson.id))!;
    expect(atom.title).toBe(lesson.title);
    const binding = atom.curricula.find((c) => c.provider === "lehrplanplus-bayern");
    if (lesson.lb === 9) expect(binding).toBeUndefined();
    else {
      expect(binding).toMatchObject({
        school_type: "realschule",
        grade: 9,
        subject: "geographie",
        topic_code: `lb${lesson.lb}`,
        exam_relevant: !lesson.optional,
      });
      expect("track" in binding!).toBe(false);
    }
    expect(atom.practice_items).toHaveLength(lesson.id === "geo-treibhauseffekt" ? 3 : 2);
    expect(atom.practice_items[0]).toMatchObject({
      question: lesson.quiz.question,
      concept: lesson.quiz.answer,
      language: lesson.language ?? "de",
    });
    expect(atom.practice_items[1]).toMatchObject({
      question: lesson.tasks[1].prompt,
      concept: lesson.tasks[1].model,
    });
    for (const item of atom.practice_items) expect(item.source_link).toBe(lessonLink(lesson.id));
    for (const prerequisite of atom.prerequisites)
      expect(cell.atoms.some((a) => a.id === prerequisite.atom_id)).toBe(true);
  });
});
describe("workshops and self-assessment", () => {
  it.each(LESSONS)("rejects incomplete, extra and wrong assignments: $id", (lesson) => {
    const w = lesson.workshop,
      correct = w.kind === "timeline" ? w.entries.map((_, i) => i) : w.entries.map((e) => e.target);
    expect(w.entries.length).toBeGreaterThanOrEqual(3);
    expect(checkWorkshop(w, correct).every(Boolean)).toBe(true);
    for (const wrong of [[], correct.map(() => -1), correct.map(() => 1000), [...correct, 0]])
      expect(checkWorkshop(w, wrong).every(Boolean)).toBe(false);
    if (w.kind === "timeline")
      for (let i = 0; i < 20; i++)
        expect(checkWorkshop(w, initialOrder(w, `${lesson.id}:${i}`)).every(Boolean)).toBe(false);
  });
  it("moves entries without mutation and varies answer positions", () => {
    const order = [2, 0, 1];
    expect(moveEntry(order, 0, 1)).toEqual([0, 2, 1]);
    expect(order).toEqual([2, 0, 1]);
    expect(moveEntry(order, 0, -1)).toEqual(order);
    expect(new Set(LESSONS.map((l) => shuffle([0, 1, 2], `${l.id}:quiz`)[0])).size).toBeGreaterThan(
      1,
    );
  });
  it("requires a real answer and all three criteria", () => {
    expect(canReviewDraft("kurz")).toBe(false);
    expect(
      canAcceptSelfAssessment("Ein ausführlicher eigener Gedankengang.", [true, true, false]),
    ).toBe(false);
    expect(
      canAcceptSelfAssessment("Ein ausführlicher eigener Gedankengang.", [true, true, true]),
    ).toBe(true);
    expect(canAcceptSelfAssessment("kurz", [true, true, true])).toBe(false);
  });
});
describe("local progress", () => {
  it("counts core completion separately and requires model exploration", () => {
    const p = freshProgress(),
      l = CORE_LESSONS[0];
    p.quizDone.push(l.id);
    p.workshopDone.push(l.id);
    p.writingDone.push(writingKey(l.id, 1));
    expect(isComplete(p, l.id)).toBe(false);
    p.explored[l.id] = MODEL_SCENARIOS[l.model!].map((s) => s.id);
    expect(isComplete(p, l.id)).toBe(true);
    expect(completion(p)).toEqual({ completed: 1, total: 35, percent: 3 });
    expect(completion(p, true).total).toBe(42);
    expect(completion(p, true, true).total).toBe(45);
  });
  it("round trips separate drafts, project and comparison state and drops unknown input", () => {
    const p = freshProgress(),
      key = writingKey(p.activeLessonId, 1);
    p.drafts[key] = "Eine eigene begründete Antwort bleibt erhalten.";
    p.writingDone.push(key);
    p.includeEnglish = true;
    p.includeFoundations = true;
    p.explored[p.activeLessonId] = ["hamburg"];
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
    const parsed = parseProgress(
      JSON.stringify({
        ...p,
        explored: { [p.activeLessonId]: ["hamburg", "hamburg", "unknown"], unknown: ["x"] },
        drafts: { [key]: "x".repeat(9000), unknown: "bad" },
      }),
    );
    expect(parsed.explored).toEqual({ [p.activeLessonId]: ["hamburg"] });
    expect(parsed.drafts[key]).toHaveLength(8000);
    expect(parsed.drafts.unknown).toBeUndefined();
  });
  it.each([null, "null", "[]", "12", "broken json"])("recovers from invalid data: %s", (raw) =>
    expect(parseProgress(raw)).toEqual(freshProgress()),
  );
  it("keeps learning available if persistence is blocked", () => {
    vi.stubGlobal("localStorage", {
      getItem() {
        throw Error("blocked");
      },
      setItem() {
        throw Error("blocked");
      },
    });
    try {
      expect(loadProgress()).toEqual(freshProgress());
      expect(saveProgress(freshProgress())).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });
  it("escapes learner text", () =>
    expect(esc("<script>\"&'</script>")).toBe("&lt;script&gt;&quot;&amp;&#39;&lt;/script&gt;"));
});
describe("conservative migration", () => {
  it("pins exact legacy bytes and classifies every old item once", () => {
    // The published-kernel integration check verifies the original SHA-256 bytes.
    expect(mapping.sources[0].sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(new Set(mapping.rows.map((r) => r.de_by_id))).toEqual(
      new Set(oldItems.map((i) => i.id)),
    );
    expect(mapping.rows.map((r) => r.category)).toEqual(["A", "C", "C", "C", "A", "C", "A", "B"]);
    expect(mapping.approved).toBe("2026-10-20");
    expect(mapping.authorization).toContain("zam-os/zam-academy#15");
    expect(mapping.source).toContain("Thomas in diesem Codex-Chat");
  });
  it("moves each explicit history to only one successor and retains the entire B question", () => {
    const successors = items as Array<(typeof items)[number] & { replaces?: string[] }>;
    expect(successors.flatMap((i) => i.replaces ?? [])).toHaveLength(4);
    for (const row of mapping.rows) {
      const target = successors.filter((i) => i.replaces?.includes(row.de_by_id));
      if (row.category === "C") {
        expect(target).toHaveLength(0);
        expect(cell.retired_items.find((i) => i.id === row.de_by_id)?.reason).toBe(row.note);
      } else {
        expect(target).toHaveLength(1);
        expect(target[0].slug).toBe(row.academy_slug);
      }
      if (row.category === "B") {
        const old = oldItems.find((i) => i.id === row.de_by_id)!;
        for (const field of ["question", "concept", "sample_solution"] as const)
          expect(target[0][field]).toBe(old[field]);
      }
    }
    expect(cell.retired_items).toHaveLength(4);
  });
  it("resolves real anchors and level-specific links safely", () => {
    for (const l of LESSONS)
      expect(parseTrainingDeepLink(`#lesson=${l.id}&level=2`)).toEqual({
        lessonId: l.id,
        level: 2,
      });
    expect(parseTrainingDeepLink("#lesson=geo-ozon&level=2", "?lesson=geo-hunger&level=1")).toEqual(
      { lessonId: "geo-ozon", level: 2 },
    );
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
  });
});
