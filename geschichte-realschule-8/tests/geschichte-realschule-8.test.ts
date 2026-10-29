import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import {
  CORE_LESSONS,
  findLesson,
  LESSONS,
  SOURCES,
  STAGES,
} from "../src/curriculum";
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
import {
  lessonLink,
  parseTrainingDeepLink,
  ZAM_ACADEMY_APP_URL,
  ZAM_CELL_ID,
} from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-geschichte-8.json";
import contract from "./fixtures/public-contract.json";
const items = cell.atoms.flatMap((a) => a.practice_items);

describe("Grade 8 curriculum and teaching material", () => {
  it("covers all eight core areas and three optional English extensions", () => {
    expect(CORE_LESSONS).toHaveLength(35);
    expect(LESSONS).toHaveLength(38);
    expect(
      STAGES.map((s) => LESSONS.filter((l) => l.lb === s.lb).length),
    ).toEqual([4, 7, 4, 4, 5, 5, 3, 3, 3]);
    expect(STAGES.map((s) => s.hours ?? null)).toEqual([
      null,
      12,
      9,
      8,
      9,
      8,
      5,
      5,
      null,
    ]);
    expect(
      LESSONS.filter((l) => l.optional).every(
        (l) => l.lb === 9 && l.language === "en",
      ),
    ).toBe(true);
  });
  it("traces every indexed expectation and explicitly identifies additional practice", () => {
    expect(coverage.rows).toHaveLength(38);
    expect(new Set(coverage.rows.map((e) => e.id)).size).toBe(38);
    for (const e of coverage.rows) {
      expect(e.lessons.length).toBeGreaterThan(0);
      for (const id of e.lessons) expect(findLesson(id)).toBeDefined();
      expect(e.additionalPractice.length).toBeGreaterThan(25);
    }
    for (const id of [
      "G8.1.K1",
      "G8.1.K3",
      "G8.1.K4",
      "G8.5.K4",
      "G8.6.K3",
      "G8.8.K3",
    ])
      expect(coverage.rows.find((e) => e.id === id)?.treatment).toBe(
        "preparation",
      );
  });
  it.each(LESSONS)(
    "provides distinct checks, reasoning and traceable sources: $id",
    (l) => {
      expect(l.id).toMatch(/^g8-[a-z0-9-]+$/);
      expect(l.paragraphs).toHaveLength(2);
      expect(l.paragraphs.join(" ").length).toBeGreaterThan(300);
      expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
      expect(l.quiz.explanation.length).toBeGreaterThan(35);
      for (const id of l.sourceIds)
        expect(SOURCES.find((s) => s.id === id)?.url).toMatch(/^https:\/\//);
      expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
      for (const t of Object.values(l.tasks)) {
        expect(t.model.length).toBeGreaterThan(100);
        expect(t.hints).toHaveLength(2);
        expect(t.criteria).toHaveLength(3);
      }
      if (l.workshop.sourceExcerpt) {
        const e = l.workshop.sourceExcerpt;
        expect([e.author, e.date, e.audience, e.context].every(Boolean)).toBe(
          true,
        );
        expect(l.sourceIds).toContain(e.sourceId);
      }
    },
  );
  it("avoids inherited oversimplifications and separates actual sources from exercises", () => {
    expect(findLesson("g8-reich-verfassung")!.paragraphs.join(" ")).toContain(
      "kein bloß bedeutungsloses",
    );
    expect(findLesson("g8-usa-perspektiven")!.paragraphs.join(" ")).toContain(
      "keine einheitliche Gruppe",
    );
    expect(
      findLesson("g8-revolution-ursachen")!.paragraphs.join(" "),
    ).toContain("nicht einfach eine einzige Ursache");
    expect(findLesson("g8-protest-heute")!.paragraphs.join(" ")).toContain(
      "erfundenen Fall",
    );
    expect(findLesson("g8-saekularisation")!.quiz.answer).toContain("Besitz");
    expect(findLesson("g8-krieg-technik")!.paragraphs.join(" ")).toContain(
      "datierte",
    );
    expect(findLesson("g8-usa")!.workshop.sourceExcerpt!.text).toBe(
      "all men are created equal",
    );
  });
});

describe("interactive reasoning", () => {
  it.each(LESSONS)(
    "rejects wrong, incomplete and extra workshop input: $id",
    (l) => {
      const work = l.workshop;
      const right =
        work.kind === "timeline"
          ? work.entries.map((_, i) => i)
          : work.entries.map((e) => e.target);
      expect(checkWorkshop(work, right).every(Boolean)).toBe(true);
      for (const wrong of [
        [],
        right.map(() => -1),
        right.map(() => 999),
        [...right, 0],
      ])
        expect(checkWorkshop(work, wrong).every(Boolean)).toBe(false);
      if (work.kind === "timeline") {
        expect(
          checkWorkshop(
            work,
            right.map(() => 0),
          ).every(Boolean),
        ).toBe(false);
        for (let seed = 0; seed < 20; seed++) {
          const order = initialOrder(work, `${l.id}:${seed}`);
          expect([...order].sort((a, b) => a - b)).toEqual(right);
          expect(checkWorkshop(work, order).every(Boolean)).toBe(false);
        }
      } else
        for (const e of work.entries)
          expect(e.target >= 0 && e.target < work.categories.length).toBe(true);
    },
  );
  it("moves timeline entries without mutating or dropping data", () => {
    const order = [2, 0, 1];
    expect(moveEntry(order, 0, 1)).toEqual([0, 2, 1]);
    expect(moveEntry(order, 0, -1)).toEqual(order);
    expect(order).toEqual([2, 0, 1]);
    expect(shuffle([0, 1, 2], "seed")).toEqual(shuffle([0, 1, 2], "seed"));
  });
  it("requires a draft and all criteria, with optional work outside core completion", () => {
    expect(canReviewDraft("   ")).toBe(false);
    expect(
      canAcceptSelfAssessment("Ein ausführlicher eigener Gedankengang.", [
        true,
        true,
        false,
      ]),
    ).toBe(false);
    expect(
      canAcceptSelfAssessment("Ein ausführlicher eigener Gedankengang.", [
        true,
        true,
        true,
      ]),
    ).toBe(true);
    const p = freshProgress(),
      id = p.activeLessonId;
    p.quizDone.push(id);
    p.workshopDone.push(id);
    p.writingDone.push(writingKey(id, 2));
    expect(isComplete(p, id)).toBe(false);
    p.writingDone.push(writingKey(id, 1));
    expect(completion(p)).toEqual({ completed: 1, total: 35, percent: 3 });
    expect(completion(p, true).total).toBe(38);
  });
});

describe("offline progress and links", () => {
  it.each([null, "null", "[]", "42", "invalid json"])(
    "recovers from invalid storage: %s",
    (raw) => expect(parseProgress(raw)).toEqual(freshProgress()),
  );
  it("round trips independent drafts and filters malformed storage", () => {
    const p = freshProgress(),
      key = writingKey(p.activeLessonId, 1);
    p.drafts[key] = "Eine begründete und selbst geschriebene Antwort.";
    p.writingDone.push(key);
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
    const parsed = parseProgress(
      JSON.stringify({
        activeLessonId: "bad",
        quizDone: [p.activeLessonId, p.activeLessonId, "bad"],
        writingDone: [key],
        drafts: { [key]: "short", bad: "wrong" },
      }),
    );
    expect(parsed.quizDone).toEqual([p.activeLessonId]);
    expect(parsed.writingDone).toEqual([]);
    expect(parsed.drafts).toEqual({ [key]: "short" });
    expect(
      parseProgress(JSON.stringify({ drafts: { [key]: "a".repeat(9000) } }))
        .drafts[key],
    ).toHaveLength(8000);
  });
  it("survives blocked storage and escapes entered text", () => {
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
    expect(esc('<img src=x onerror="x">')).toBe(
      "&lt;img src=x onerror=&quot;x&quot;&gt;",
    );
  });
  it("resolves every cited lesson and rejects unsafe or invalid links", () => {
    expect(ZAM_ACADEMY_APP_URL).toBe(
      "https://academy.zam-os.org/geschichte-realschule-8/",
    );
    for (const l of LESSONS)
      expect(parseTrainingDeepLink(`#lesson=${l.id}&level=2`)).toEqual({
        lessonId: l.id,
        level: 2,
      });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
    expect(
      parseTrainingDeepLink(
        "#lesson=g8-usa&level=2",
        "?lesson=g8-bayern&level=1",
      ),
    ).toEqual({ lessonId: "g8-usa", level: 2 });
  });
});

describe("independent cell and pinned contract", () => {
  it("records every legacy item as an unapproved keep-active inventory row", () => {
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    expect(mapping.rows).toHaveLength(8);
    expect(new Set(mapping.rows.map((r) => r.de_by_id))).toEqual(
      new Set(legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id))),
    );
    for (const row of mapping.rows) {
      expect(row.category).toBe("C");
      expect(row.action).toBe("keep-active");
      expect(row.academy_slug).toBeNull();
      expect(row.reason.length).toBeGreaterThan(50);
    }
  });

  it("binds 76 concise cards to real lessons and the correct grade without a track", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(items).toHaveLength(76);
    for (const l of LESSONS) {
      const a = cell.atoms.find((a) => a.slug === l.id)!;
      expect(a.source_link).toBe(lessonLink(l.id));
      const b = a.curricula.find((b) => b.provider === "lehrplanplus-bayern")!;
      expect(b).toMatchObject({
        school_type: "realschule",
        grade: 8,
        subject: "geschichte",
        topic_code: `lb${l.lb}`,
        exam_relevant: !l.optional,
      });
      expect("track" in b).toBe(false);
      expect(a.practice_items).toHaveLength(2);
      const recall = a.practice_items[1];
      expect(recall.question).not.toBe(l.quiz.question);
      expect(recall.question.length).toBeGreaterThan(15);
      expect(recall.concept.length).toBeLessThan(190);
      expect(recall.sample_solution).toBe(recall.concept);
      for (const i of a.practice_items) {
        expect(i.source_link).toBe(lessonLink(l.id));
        expect(i.language).toBe(l.language ?? "de");
      }
      const fast = a.practice_items[0].fast_check!;
      expect(fast.options[fast.correct_index]).toBe(l.quiz.answer);
    }
  });
  it("pins ids and anchors and introduces no implicit history transfer", () => {
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        lesson: a.source_link,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    const ids = [...cell.atoms, ...items].map((x) => x.id);
    expect(new Set(ids).size).toBe(114);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    const oldIds = new Set(
      legacy.atoms.flatMap((a) => a.practice_items.map((i) => i.id)),
    );
    expect(ids.some((id) => oldIds.has(id))).toBe(false);
    expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
  });
});
