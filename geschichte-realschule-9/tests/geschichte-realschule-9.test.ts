import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import { CORE_LESSONS, findLesson, LESSONS, SOURCES, STAGES } from "../src/curriculum";
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
import legacy from "./fixtures/de-by-realschule-9-geschichte-weimar-ns-kvt.json";
import publicContract from "./fixtures/public-contract.json";

// Published lesson anchors and item ids must not change after first publication.
const LESSON_IDS = [
  "g-quellen-pruefen",
  "g-propaganda",
  "g-zeit-und-daten",
  "g-geschichte-vor-ort",
  "g-imperialismus",
  "g-kolonialherrschaft",
  "g-julikrise",
  "g-materialschlacht",
  "g-kriegspropaganda",
  "g-1917",
  "g-versailles",
  "g-novemberrevolution",
  "g-weimar-verfassung",
  "g-krisenjahr-1923",
  "g-zwanziger",
  "g-weltwirtschaftskrise",
  "g-weimar-scheitern",
  "g-30-januar",
  "g-demokratie-zerstoerung",
  "g-ns-ideologie",
  "g-entrechtung",
  "g-ns-alltag-bayern",
  "g-ns-aussenpolitik",
  "g-kriegsbeginn-1939",
  "g-vernichtungskrieg",
  "g-holocaust",
  "g-widerstand",
  "g-kriegsende",
  "g-erinnerung",
  "g-bildung-laengsschnitt",
  "g-jugend-im-ns",
  "g-jugendkulturen",
  "g-menschenrechte-entwicklung",
  "g-menschenrechte-schutz",
  "g-menschenrechte-urteilen",
  "g-en-empire",
  "g-en-britain-1914",
  "g-en-allies",
  "g-en-civil-rights",
];
const items = cell.atoms.flatMap((atom) => atom.practice_items);

describe("curriculum and public lesson contract", () => {
  it("covers all seven core Lernbereiche and four optional English deepening topics", () => {
    expect(LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(CORE_LESSONS).toHaveLength(35);
    expect(
      STAGES.map((stage) => LESSONS.filter((lesson) => lesson.lb === stage.lb).length),
    ).toEqual([4, 8, 5, 6, 6, 3, 3, 4]);
    expect(
      LESSONS.filter((lesson) => lesson.optional).every(
        (lesson) => lesson.lb === 8 && lesson.language === "en",
      ),
    ).toBe(true);
    expect(STAGES.map((stage) => stage.hours ?? null)).toEqual([null, 16, 10, 10, 10, 5, 5, null]);
  });

  it.each(LESSONS)(
    "has reviewed material, sources and two distinct writing tasks: $id",
    (lesson) => {
      expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(300);
      expect(lesson.sourceIds.length).toBeGreaterThan(0);
      for (const id of lesson.sourceIds)
        expect(SOURCES.find((source) => source.id === id)?.url).toMatch(/^https:\/\//);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(30);
      expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
      for (const task of Object.values(lesson.tasks)) {
        expect(task.model.length).toBeGreaterThan(100);
        expect(task.criteria).toHaveLength(3);
        expect(task.hints).toHaveLength(2);
      }
      expect(lesson.workshop.entries.length).toBeGreaterThanOrEqual(3);
      if (lesson.workshop.material)
        expect(lesson.workshop.materialLabel).toMatch(/keine historische Originalquelle/);
      if (lesson.workshop.sourceExcerpt) {
        const excerpt = lesson.workshop.sourceExcerpt;
        expect(excerpt.text.length).toBeGreaterThan(20);
        expect(SOURCES.some((source) => source.id === excerpt.sourceId)).toBe(true);
        expect(
          [excerpt.author, excerpt.date, excerpt.audience, excerpt.context].every(Boolean),
        ).toBe(true);
      }
    },
  );

  it("teaches the main corrections rather than carrying old misconceptions forward", () => {
    expect(findLesson("g-demokratie-zerstoerung")!.paragraphs.join(" ")).toContain(
      "23. März beschlossene und am 24. März veröffentlichte",
    );
    expect(findLesson("g-holocaust")!.paragraphs.join(" ")).toContain(
      "Dort wurde der Holocaust nicht erstmals beschlossen",
    );
    expect(findLesson("g-holocaust")!.paragraphs.join(" ")).toContain("Sinti und Roma");
    expect(findLesson("g-weltwirtschaftskrise")!.quiz.question).not.toContain("Schwarzer Freitag");
    expect(findLesson("g-geschichte-vor-ort")!.paragraphs.join(" ")).toContain(
      "außerhalb dieser App",
    );
    expect(findLesson("g-erinnerung")!.paragraphs.join(" ")).toContain(
      "ersetzt den außerschulischen Lernort jedoch nicht",
    );
  });
});

describe("workshops", () => {
  it.each(LESSONS)("checks complete, wrong and missing answers: $id", (lesson) => {
    const work = lesson.workshop;
    const correct =
      work.kind === "timeline"
        ? work.entries.map((_, i) => i)
        : work.entries.map((entry) => entry.target);
    expect(checkWorkshop(work, correct).every(Boolean)).toBe(true);
    expect(checkWorkshop(work, []).every(Boolean)).toBe(false);
    expect(
      checkWorkshop(
        work,
        correct.map(() => -1),
      ).every(Boolean),
    ).toBe(false);
    expect(
      checkWorkshop(
        work,
        correct.map(() => 1000),
      ).every(Boolean),
    ).toBe(false);
    expect(checkWorkshop(work, [...correct, 0]).every(Boolean)).toBe(false);
    if (work.kind === "timeline") {
      expect(work.entries.map((entry) => entry.target)).toEqual(correct);
      expect(checkWorkshop(work, [...correct].reverse()).every(Boolean)).toBe(false);
      for (let seed = 0; seed < 100; seed++) {
        const order = initialOrder(work, `${lesson.id}:${seed}`);
        expect([...order].sort()).toEqual(correct);
        expect(checkWorkshop(work, order).every(Boolean)).toBe(false);
      }
    } else {
      for (const entry of work.entries)
        expect(entry.target >= 0 && entry.target < work.categories.length).toBe(true);
    }
  });

  it("does not mistake duplicate or extra entries for a valid chronology", () => {
    const work = LESSONS.find((lesson) => lesson.workshop.kind === "timeline")!.workshop;
    expect(
      checkWorkshop(
        work,
        work.entries.map(() => 0),
      ).every(Boolean),
    ).toBe(false);
    expect(checkWorkshop(work, [...work.entries.map((_, i) => i), 0]).every(Boolean)).toBe(false);
  });

  it("moves one entry without losing or mutating any entry", () => {
    const original = [2, 0, 1];
    expect(moveEntry(original, 0, 1)).toEqual([0, 2, 1]);
    expect(moveEntry(original, 2, -1)).toEqual([2, 1, 0]);
    expect(moveEntry(original, 0, -1)).toEqual(original);
    expect(moveEntry(original, 3, -1)).toEqual(original);
    expect(original).toEqual([2, 0, 1]);
  });

  it("keeps option order reproducible and permits a non-first correct answer", () => {
    expect(shuffle([0, 1, 2], "same")).toEqual(shuffle([0, 1, 2], "same"));
    const firsts = new Set(LESSONS.map((lesson) => shuffle([0, 1, 2], `${lesson.id}:quiz`)[0]));
    expect(firsts.size).toBeGreaterThan(1);
  });

  it("labels real election data with units, dates, provenance and interpretive limits", () => {
    const table = findLesson("g-zeit-und-daten")!.workshop.dataTable!;
    expect(table.rows.map((row) => row.value)).toEqual([18.3, 37.3, 33.1]);
    expect(table.note).toContain("keine individuellen Motive");
    expect(SOURCES.some((source) => source.id === table.sourceId)).toBe(true);
  });

  it("requires a real draft and all three self-assessment criteria", () => {
    expect(canReviewDraft("     ")).toBe(false);
    expect(canReviewDraft("A short reply")).toBe(false);
    expect(
      canAcceptSelfAssessment("Ein begründeter eigener Gedankengang.", [true, true, false]),
    ).toBe(false);
    expect(canAcceptSelfAssessment("Ein begründeter eigener Gedankengang.", [])).toBe(false);
    expect(
      canAcceptSelfAssessment("Ein begründeter eigener Gedankengang.", [true, true, true]),
    ).toBe(true);
    expect(canAcceptSelfAssessment("kurz", [true, true, true])).toBe(false);
  });
});

describe("learner progress and offline storage", () => {
  it("requires quiz, workshop and level-1 self-assessment without optional English", () => {
    const progress = freshProgress(),
      id = CORE_LESSONS[0].id;
    progress.quizDone.push(id);
    progress.workshopDone.push(id);
    progress.writingDone.push(writingKey(id, 2));
    expect(isComplete(progress, id)).toBe(false);
    progress.writingDone.push(writingKey(id, 1));
    expect(isComplete(progress, id)).toBe(true);
    expect(completion(progress)).toEqual({ completed: 1, total: 35, percent: 3 });
    expect(completion(progress, true).total).toBe(39);
  });

  it("round trips separate drafts and both levels without touching other apps", () => {
    const progress = freshProgress();
    const key = writingKey(progress.activeLessonId, 1);
    progress.drafts[key] = "Eine eigene begründete Antwort bleibt erhalten.";
    progress.drafts[writingKey(progress.activeLessonId, 2)] =
      "Eine andere Antwort für den Transfer.";
    progress.writingDone.push(key);
    progress.includeEnglish = true;
    expect(parseProgress(JSON.stringify(progress))).toEqual(progress);
  });

  it.each([null, "null", "[]", "12", "broken json", '{"level":"2","drafts":[]}'])(
    "recovers from invalid data: %s",
    (raw) => {
      expect(parseProgress(raw)).toEqual(freshProgress());
    },
  );

  it("drops unknown keys, invalid completions and oversized drafts", () => {
    const id = CORE_LESSONS[0].id,
      key = writingKey(id, 1);
    const parsed = parseProgress(
      JSON.stringify({
        activeLessonId: "unknown",
        quizDone: [id, id, "unknown", 4],
        writingDone: [key],
        drafts: { [key]: "tiny", unknown: "<script>" },
      }),
    );
    expect(parsed.activeLessonId).toBe(id);
    expect(parsed.quizDone).toEqual([id]);
    expect(parsed.writingDone).toEqual([]);
    expect(parsed.drafts).toEqual({ [key]: "tiny" });
    expect(
      parseProgress(JSON.stringify({ drafts: { [key]: "x".repeat(9000) } })).drafts[key],
    ).toHaveLength(8000);
  });

  it("keeps the app working if localStorage is blocked", () => {
    vi.stubGlobal("localStorage", {
      getItem() {
        throw new Error("blocked");
      },
      setItem() {
        throw new Error("blocked");
      },
    });
    try {
      expect(loadProgress()).toEqual(freshProgress());
      expect(saveProgress(freshProgress())).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("escapes learner text before rendering HTML", () => {
    expect(esc("<script>\"&'</script>")).toBe("&lt;script&gt;&quot;&amp;&#39;&lt;/script&gt;");
  });
});

describe("cell and conservative migration", () => {
  it("keeps one library topic and binds every lesson to the correct common Lernbereich", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(39);
    expect(items).toHaveLength(78);
    for (const lesson of LESSONS) {
      const atom = cell.atoms.find((entry) => entry.source_link === lessonLink(lesson.id))!;
      expect(atom).toBeDefined();
      expect(atom.title).toBe(lesson.title);
      const binding = atom.curricula.find((entry) => entry.provider === "lehrplanplus-bayern")!;
      expect(binding).toMatchObject({
        school_type: "realschule",
        grade: 9,
        subject: "geschichte",
        topic_code: `lb${lesson.lb}`,
        exam_relevant: !lesson.optional,
      });
      expect("track" in binding).toBe(false);
      expect(atom.practice_items).toHaveLength(2);
      expect(atom.practice_items[0]).toMatchObject({
        question: lesson.quiz.question,
        concept: lesson.quiz.answer,
        language: lesson.language ?? "de",
      });
      expect(atom.practice_items[1]).toMatchObject({
        question: lesson.tasks[1].prompt,
        concept: lesson.tasks[1].model,
        tier: "tier2_synthesis",
      });
      for (const item of atom.practice_items) expect(item.source_link).toBe(lessonLink(lesson.id));
      for (const prereq of atom.prerequisites)
        expect(cell.atoms.find((entry) => entry.id === prereq.atom_id)).toBeDefined();
    }
    const ids = [...cell.atoms, ...items].map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
  });

  it("pins every published id and slug independently of content edits", () => {
    expect(
      cell.atoms.map((atom) => ({
        id: atom.id,
        slug: atom.slug,
        lesson: atom.source_link,
        items: atom.practice_items.map((item) => ({ id: item.id, slug: item.slug })),
      })),
    ).toEqual(publicContract);
  });

  it("identifies the exact legacy snapshot and classifies all eight items once", () => {
    const source = mapping.sources[0];
    expect(source.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(source.tile_id).toBe(legacy.tile_id);
    expect(source.version).toBe(legacy.version);
    // validate-migration.mjs additionally verifies the SHA-256 of the original bytes.
    const oldItems = legacy.atoms.flatMap((atom) => atom.practice_items);
    expect(new Set(mapping.rows.map((row) => row.de_by_id))).toEqual(
      new Set(oldItems.map((item) => item.id)),
    );
    expect(mapping.rows).toHaveLength(8);
    expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(4);
    expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(4);
    expect(mapping.rows.filter((row) => row.category === "B")).toHaveLength(0);
  });

  it("moves mastery only on the four explicit atomic matches; keeps four corrected histories retired", () => {
    const successorItems = items as Array<(typeof items)[number] & { replaces?: string[] }>;
    const allReplaces = successorItems.flatMap((item) => item.replaces ?? []);
    expect(allReplaces).toHaveLength(4);
    expect(new Set(allReplaces).size).toBe(4);
    for (const row of mapping.rows) {
      if (row.category === "A") {
        const target = successorItems.find((item) => item.slug === row.academy_slug)!;
        expect(target.replaces).toEqual([row.de_by_id]);
        expect(cell.retired_items.some((entry) => entry.id === row.de_by_id)).toBe(false);
      } else {
        expect(row.academy_slug).toBeNull();
        expect(allReplaces).not.toContain(row.de_by_id);
        expect(cell.retired_items.find((entry) => entry.id === row.de_by_id)?.reason).toBe(
          row.note,
        );
      }
    }
    expect(cell.retired_items).toHaveLength(4);
  });

  it("records its own owner approval; never reuses the Chemie authorization", () => {
    expect(mapping.authorization).not.toContain("als Admin mergen");
    expect(mapping.source_commit).toBe("5a334c0c9050cf3590a036e7b451481462966d0e");
    expect(mapping.approved).toBe("2026-10-20");
    expect(mapping.authorization).toContain("zam-os/zam-academy#14");
  });

  it("uses only real lesson anchors and resolves level-specific deep links safely", () => {
    expect(ZAM_ACADEMY_APP_URL).toBe("https://academy.zam-os.org/geschichte-realschule-9/");
    for (const id of LESSON_IDS)
      expect(parseTrainingDeepLink(`#lesson=${id}&level=2`)).toEqual({ lessonId: id, level: 2 });
    expect(parseTrainingDeepLink("#lesson=g-holocaust&level=2", "?lesson=g-1917&level=1")).toEqual({
      lessonId: "g-holocaust",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
    expect(parseTrainingDeepLink("#unrelated=value")).toEqual({});
  });
});
