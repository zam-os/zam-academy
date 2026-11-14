import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import outline from "../src/curriculum/outline.json";
import { LESSONS, SOURCES, STAGES, findLesson } from "../src/curriculum";
import { renderQuizFeedback, renderWorkshopFeedback } from "../src/feedback";
import { FIGURES, renderFigure } from "../src/figures";
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
const APP = "https://academy.zam-os.org/biologie-gymnasium-5/";
const stageOf = (id: string) =>
  STAGES.find((stage) => stage.lb === findLesson(id)!.lb)!;

function learnerText(l: (typeof LESSONS)[number]): string {
  const work = l.workshop;
  const table = work.dataTable
    ? [work.dataTable.title, work.dataTable.unit, work.dataTable.note, ...work.dataTable.rows.map((r) => r.label)]
    : [];
  return [
    l.title,
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
    ...table,
    ...work.categories,
    ...work.entries.flatMap((e) => [e.text, e.feedback]),
    work.conclusion,
    ...[1, 2].flatMap((level) => {
      const t = l.tasks[level as 1 | 2];
      return [t.prompt, ...t.hints, t.model, ...t.criteria];
    }),
  ].join("\n");
}

/** The four A successors Thomas approved on 2026-11-14; no other card declares replaces. */
const APPROVED_REPLACES: Record<string, string[]> = {
  "bg5-skelett-check": ["01K4YB5M000000000000000J01"],
  "bg5-bluete-check": ["01K4YB5P000000000000000J03"],
  "bg5-bestaeubung-befruchtung-check": ["01K4YB5P000000000000000J05"],
  "bg5-zellen-check": ["01K4YT5N000000000000000J03"],
};

describe("biologie-gymnasium-5 curriculum and content", () => {
  it("covers all 47 verbatim competences of NT5 Lernbereich 2 in 44 lessons and 8 stations", () => {
    expect(STAGES).toHaveLength(8);
    expect(STAGES.map((s) => s.code)).toEqual(["2.1", "2.2", "2.3", "2.3", "2.3", "2.3", "2.4", "2.5"]);
    expect(LESSONS).toHaveLength(44);
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(44);
    expect(coverage.curriculum).toBe("https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/nt_gym");
    expect(coverage.curriculum_sha256).toBe("c22960dc12b56f17929c58fdc7a1519583ae6869cb1d3ffe442067522bb58d58");
    expect(coverage.rows).toHaveLength(47);
    const perLb: Record<string, number> = {};
    for (const r of coverage.rows) {
      perLb[r.lb] = (perLb[r.lb] ?? 0) + 1;
      expect(r.lessons.length).toBeGreaterThan(0);
      for (const id of r.lessons) expect(findLesson(id), id).toBeDefined();
      // 2.1 is taught across the stations; all other rows sit in their own station.
      if (r.lb !== "2.1") expect(r.lessons.some((id) => stageOf(id).code === r.lb)).toBe(true);
      expect(["implemented", "supported"]).toContain(r.status);
      expect(r.evidence.length).toBeGreaterThan(60);
      if (r.status === "supported") expect((r as { in_class?: string }).in_class?.length ?? 0).toBeGreaterThan(25);
      else expect("in_class" in r).toBe(false);
    }
    expect(perLb).toEqual({ "2.1": 15, "2.2": 3, "2.3": 21, "2.4": 5, "2.5": 3 });
    const cited = new Set(coverage.rows.flatMap((r) => r.lessons));
    expect(LESSONS.filter((l) => !cited.has(l.id)).map((l) => l.id)).toEqual([]);
    expect(coverage.optional_lessons).toEqual([]);
    expect(outline.stages).toHaveLength(8);
    expect(SOURCES.length).toBeGreaterThanOrEqual(90);
    expect(new Set(SOURCES.map((s) => s.id)).size).toBe(SOURCES.length);
  });

  it.each(LESSONS)("provides explanation, check, figure or lab and two distinct tasks: $id", (l) => {
    expect(l.id).toMatch(/^bg5-[a-z0-9-]+$/);
    expect(l.period).toMatch(/^NT5 2\.[1-5] · /);
    expect(l.period.startsWith(`NT5 ${stageOf(l.id).code}`)).toBe(true);
    expect(l.paragraphs).toHaveLength(2);
    expect(l.paragraphs.join(" ").length).toBeGreaterThan(700);
    expect(l.takeaway.length).toBeGreaterThan(60);
    expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
    expect(l.quiz.explanation.length).toBeGreaterThan(35);
    expect(l.sourceIds[0]).toBe("lehrplan");
    expect(l.sourceIds.length).toBeGreaterThanOrEqual(3);
    for (const id of l.sourceIds) expect(SOURCES.find((s) => s.id === id)?.url, id).toMatch(/^https:\/\//);
    expect(l.figures.length + (l.lab ? 1 : 0)).toBeGreaterThan(0);
    for (const id of l.figures) expect(FIGURES[id], id).toBeDefined();
    expect("teacherVideo" in l).toBe(false);
    expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
    expect(l.tasks[1].model).not.toBe(l.tasks[2].model);
    for (const t of Object.values(l.tasks)) {
      expect(t.model.length).toBeGreaterThan(150);
      expect(t.hints).toHaveLength(2);
      expect(t.criteria).toHaveLength(3);
    }
  });

  it.each(LESSONS)("follows German writing conventions: $id", (l) => {
    const text = learnerText(l);
    expect(text).not.toMatch(/\d\.\d/);
    expect(text).not.toMatch(/(?<![A-Za-z0-9ÄÖÜäöüß])-\d/);
    expect(text).not.toMatch(/\b(TODO|TBD|Lorem|undefined|NaN)\b/i);
    expect(text).not.toMatch(/\d(°C|kJ|cm|mm|dB|kg)\b/);
  });

  it("uses every registered figure and every source at least once", () => {
    const usedFigures = new Set(LESSONS.flatMap((l) => l.figures));
    expect(Object.keys(FIGURES).filter((id) => !usedFigures.has(id))).toEqual([]);
    const usedSources = new Set(LESSONS.flatMap((l) => l.sourceIds));
    expect(SOURCES.filter((s) => !usedSources.has(s.id)).map((s) => s.id)).toEqual([]);
  });

  it("keeps hormonal regulation, placenta and photosynthesis out (later grades)", () => {
    const all = LESSONS.map(learnerText).join("\n");
    expect(all).not.toMatch(/Östrogen|Progesteron|Testosteron|Plazenta|Fotosynthese|Photosynthese|Xylem|Phloem/);
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
      const label = html.match(/aria-label="([^"]+)"/);
      expect(label?.[1].length ?? 0, id).toBeGreaterThanOrEqual(40);
      expect(html).not.toMatch(/\b(NaN|undefined|Infinity)\b/);
    }
  });

  it.each(LESSONS)("builds a solvable workshop for $id", (l) => {
    const w = l.workshop;
    expect(w.entries.length).toBeGreaterThanOrEqual(5);
    if (w.kind === "timeline") {
      expect(w.categories).toEqual([]);
      w.entries.forEach((e, i) => expect(e.target).toBe(i));
      const start = initialOrder(w, l.id);
      expect(checkWorkshop(w, start).every(Boolean)).toBe(false);
      const solved = w.entries.map((_, i) => i);
      expect(checkWorkshop(w, solved).every(Boolean)).toBe(true);
      expect(moveEntry(solved, 0, 1)[0]).toBe(1);
      expect(renderWorkshopFeedback(w, solved)).toContain(w.conclusion.slice(0, 30));
    } else {
      expect(w.categories.length).toBeGreaterThanOrEqual(2);
      expect(new Set(w.entries.map((e) => e.target)).size).toBe(w.categories.length);
      const solved = w.entries.map((e) => e.target);
      expect(checkWorkshop(w, solved).every(Boolean)).toBe(true);
      expect(checkWorkshop(w, w.entries.map(() => -1)).some(Boolean)).toBe(false);
    }
    expect(renderQuizFeedback(l.quiz, 0)).toContain("Richtig");
    expect(renderQuizFeedback(l.quiz, 1)).not.toContain("Richtig");
    expect(canReviewDraft("")).toBe(false);
    expect(canAcceptSelfAssessment(l.tasks[1].model, [true, true, true])).toBe(true);
  });
});

describe("ZAM cell and public contract", () => {
  it("contains 44 atoms and 88 cards in lesson order, pinned by the public contract", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(44);
    expect(contract).toHaveLength(44);
    const seen = new Set<string>();
    const index = new Map<string, number>();
    cell.atoms.forEach((atom, i) => {
      const lesson = LESSONS[i];
      expect(atom.slug).toBe(lesson.id);
      expect(atom.title).toBe(lesson.title);
      expect(atom.id).toMatch(ULID_RE);
      expect(seen.has(atom.id)).toBe(false);
      seen.add(atom.id);
      index.set(atom.id, i);
      expect(atom.source_link).toBe(`${APP}#lesson=${lesson.id}`);
      expect(atom.curricula).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ provider: "zam-academy", subject: "biologie-gymnasium-5", topic_code: `s${lesson.lb}` }),
          expect.objectContaining({ provider: "lehrplanplus-bayern", school_type: "gymnasium", grade: 5, subject: "nt_gym", topic_code: `lb${stageOf(lesson.id).code}` }),
        ]),
      );
      for (const p of atom.prerequisites) {
        expect(p.type).toBe("soft");
        expect(index.get(p.atom_id)).toBeLessThan(i);
      }
      const [t1, t2] = atom.practice_items;
      expect(atom.practice_items).toHaveLength(2);
      for (const item of [t1, t2]) {
        expect(item.id).toMatch(ULID_RE);
        expect(seen.has(item.id)).toBe(false);
        seen.add(item.id);
        if (APPROVED_REPLACES[item.slug]) expect(item).toHaveProperty("replaces", APPROVED_REPLACES[item.slug]);
        else expect("replaces" in item).toBe(false);
        expect(item.source_link).toBe(atom.source_link);
      }
      expect(t1.slug).toBe(`${lesson.id}-check`);
      expect(t1.tier).toBe("tier1_fast");
      expect(t1.question).toBe(lesson.quiz.question);
      expect(t1.concept).toBe(lesson.quiz.answer);
      expect(t1.fast_check).toEqual({ type: "binary_choice", options: [lesson.quiz.answer, lesson.quiz.wrong[0]], correct_index: 0 });
      expect(t2.slug).toBe(`${lesson.id}-recall`);
      expect(t2.tier).toBe("tier2_synthesis");
      expect(t2.question).not.toBe(t1.question);
      expect(t2.concept.length).toBeLessThan(190);
      expect(t2.sample_solution).toBe(t2.concept);
      expect(t2.concept).not.toMatch(/\d\.\d/);
      expect(contract[i]).toEqual({
        id: atom.id,
        slug: atom.slug,
        lesson: atom.source_link,
        items: [
          { id: t1.id, slug: t1.slug },
          { id: t2.id, slug: t2.slug },
        ],
      });
    });
    expect(seen.size).toBe(132);
    expect(cell.atoms.reduce((n, a) => n + a.prerequisites.length, 0)).toBeGreaterThanOrEqual(40);
    expect(cell.sources.map((s) => s.uri)).toEqual(SOURCES.map((s) => s.url));
  });

  it("applies Thomas's approved mapping and maps every old item exactly once", async () => {
    expect(mapping.status).toBe("approved");
    expect(mapping.approved).toBe("2026-11-14");
    expect(mapping.source).toContain("Mapping freigegeben, 4 A und Ausmusterung J04 ok");
    expect(cell.retired_items).toEqual([expect.objectContaining({ id: "01K4YB5P000000000000000J04" })]);
    expect(mapping.sources).toHaveLength(3);
    const fixtures = import.meta.glob<{ default: { tile_id: string; atoms: Array<{ practice_items: Array<{ id: string }> }> } }>(
      "./fixtures/de-by-*.json",
      { eager: true },
    );
    const oldIds = Object.values(fixtures).flatMap((f) => f.default.atoms.flatMap((a) => a.practice_items.map((it) => it.id)));
    expect(oldIds).toHaveLength(24);
    expect(mapping.rows.map((r) => r.de_by_id).sort()).toEqual([...oldIds].sort());
    const slugs = cell.atoms.flatMap((a) => a.practice_items.map((it) => it.slug));
    for (const row of mapping.rows) {
      expect(["A", "B", "C"]).toContain(row.category);
      expect(row.note.length).toBeGreaterThan(30);
      if (row.category === "C") {
        expect(row.academy_slug).toBeNull();
        expect(row.action).toBe(row.de_by_id === "01K4YB5P000000000000000J04" ? "retire" : "keep-active");
      } else {
        expect(row.action).toBe("replace");
        expect(slugs.filter((s) => s === row.academy_slug)).toHaveLength(1);
        expect(APPROVED_REPLACES[row.academy_slug!]).toEqual([row.de_by_id]);
      }
    }
    const successors = mapping.rows.filter((r) => r.academy_slug).map((r) => r.academy_slug);
    expect(new Set(successors).size).toBe(successors.length);
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(4);
    expect(Object.keys(APPROVED_REPLACES)).toHaveLength(4);
  });

  it("builds lesson deep links and tracks completion", () => {
    expect(STORAGE_KEY).toBe("biologie_gy5_academy_progress_v1");
    expect(lessonLink("bg5-zellen")).toBe(`${APP}#lesson=bg5-zellen`);
    expect(parseTrainingDeepLink("#lesson=bg5-zellen&level=2")).toEqual({ lessonId: "bg5-zellen", level: 2 });
    const p = freshProgress();
    const id = LESSONS[0].id;
    recordQuizAnswer(p, id, true);
    recordWorkshopAnswer(p, id, true);
    updateDraft(p, id, 1, LESSONS[0].tasks[1].model);
    expect(isComplete(p, id)).toBe(false);
    expect(confirmWriting(p, id, 1, LESSONS[0].tasks[1].model)).toBe(true);
    expect(isComplete(p, id)).toBe(true);
    expect(completion(p)).toMatchObject({ completed: 1, total: 44 });
  });
});
