import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { CORE_LESSONS, findLesson, LESSONS, SOURCES, STAGES, TERMS } from "../src/curriculum";
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
import legacy from "./fixtures/de-by-realschule-10-geschichte-kalter-krieg-teilung-wiedervereinigung-kvt.json";
import publicContract from "./fixtures/public-contract.json";

// Published lesson anchors and item ids must not change after first publication.
const LESSON_IDS = [
  "g10-karikatur",
  "g10-bild-und-lied",
  "g10-perspektiven",
  "g10-schaubild",
  "g10-zeitzeugen",
  "g10-film",
  "g10-potsdam",
  "g10-nachkriegsalltag",
  "g10-flucht-vertreibung",
  "g10-verfassung-bayern",
  "g10-zwei-staaten",
  "g10-sed-diktatur",
  "g10-17-juni-1953",
  "g10-stasi",
  "g10-mauerbau",
  "g10-aera-adenauer",
  "g10-ns-vergangenheit",
  "g10-gastarbeiter",
  "g10-1968",
  "g10-sozialliberale-reformen",
  "g10-juedisches-leben",
  "g10-deutsche-frage",
  "g10-blockbildung",
  "g10-kuba-krise",
  "g10-vietnamkrieg",
  "g10-entkolonialisierung",
  "g10-entspannung",
  "g10-umbruch-ostblock",
  "g10-friedliche-revolution",
  "g10-weg-zur-einheit",
  "g10-innere-einheit",
  "g10-rolle-deutschlands",
  "g10-europa",
  "g10-weltordnung",
  "g10-uno",
  "g10-jugoslawien",
  "g10-nahost-wurzeln",
  "g10-nahost-seit-1967",
  "g10-terror-9-11",
  "g10-globalisierung",
  "g10-aktuelle-konflikte",
  "g10-migration-epochen",
  "g10-auswanderung",
  "g10-einwanderung",
  "g10-einwanderungsland",
  "g10-geschichtskultur-frueher",
  "g10-instrumentalisierung",
  "g10-geschichte-unterhaltung",
  "g10-gedenkkultur",
  "g10-en-postwar",
  "g10-en-airlift",
  "g10-en-india",
  "g10-en-cold-war",
];
type Item = (typeof cell.atoms)[number]["practice_items"][number] & {
  replaces?: string[];
  sample_solution?: string;
  fast_check?: { type: string; options: string[]; correct_index: number };
  choice_distractors?: Array<{ text: string; reason: string }>;
};
const items = cell.atoms.flatMap((atom) => atom.practice_items) as Item[];

/** zam-core's checkShownSet: the right option must not stand out by length. */
const lengthCue = (answer: string, others: string[]) =>
  others.every((other) => answer.trim().length >= other.trim().length * 1.4) ||
  others.every((other) => answer.trim().length * 1.4 <= other.trim().length);

describe("curriculum and public lesson contract", () => {
  it("covers all seven core Lernbereiche and four optional English lessons", () => {
    expect(LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(CORE_LESSONS).toHaveLength(49);
    expect(
      STAGES.map((stage) => LESSONS.filter((lesson) => lesson.lb === stage.lb).length),
    ).toEqual([6, 5, 11, 11, 8, 4, 4, 4]);
    expect(
      LESSONS.filter((lesson) => lesson.optional).every(
        (lesson) => lesson.lb === 8 && lesson.language === "en",
      ),
    ).toBe(true);
    expect(STAGES.map((stage) => stage.hours ?? null)).toEqual([null, 7, 9, 11, 11, 5, 5, null]);
  });

  it("gives every stage its own accent hue", () => {
    expect(new Set(STAGES.map((stage) => stage.hue)).size).toBe(STAGES.length);
    for (const stage of STAGES) expect(stage.hue >= 0 && stage.hue < 360).toBe(true);
  });

  it.each(LESSONS)("has reviewed material, sources and two distinct writing tasks: $id", (lesson) => {
    expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(600);
    expect(lesson.sourceIds.length).toBeGreaterThan(0);
    for (const id of lesson.sourceIds)
      expect(SOURCES.find((source) => source.id === id)?.url).toMatch(/^https:\/\//);
    expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
    expect(lesson.quiz.explanation.length).toBeGreaterThan(30);
    for (const hint of lesson.quiz.whyWrong) expect(hint.length).toBeGreaterThan(20);
    expect(lengthCue(lesson.quiz.answer, lesson.quiz.wrong)).toBe(false);
    expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
    for (const task of Object.values(lesson.tasks)) {
      expect(task.model.length).toBeGreaterThan(150);
      expect(task.criteria).toHaveLength(3);
      expect(task.hints).toHaveLength(2);
    }
    expect(lesson.workshop.entries.length).toBeGreaterThanOrEqual(4);
    if (lesson.workshop.material)
      expect(lesson.workshop.materialLabel).toMatch(/keine historische Originalquelle/);
    if (lesson.workshop.sourceExcerpt) {
      const excerpt = lesson.workshop.sourceExcerpt;
      expect(excerpt.text.length).toBeGreaterThan(20);
      expect(SOURCES.some((source) => source.id === excerpt.sourceId)).toBe(true);
      expect([excerpt.author, excerpt.date, excerpt.audience, excerpt.context].every(Boolean)).toBe(
        true,
      );
    }
  });

  it("uses German conventions in German lessons and names its time frame for the present", () => {
    for (const lesson of LESSONS.filter((entry) => !entry.language)) {
      const text = [lesson.intro, ...lesson.paragraphs, lesson.takeaway].join(" ");
      // Typographic quotes only; straight double quotes would mark untranslated text.
      expect(text).not.toMatch(/"/);
      // Thousands are grouped with a point, as in 2.800.000 or 47.000.
      expect(text).not.toMatch(/\b\d{1,3},\d{3}\b/);
    }
    for (const id of ["g10-nahost-seit-1967", "g10-aktuelle-konflikte"])
      expect(findLesson(id)!.paragraphs.join(" ")).toContain("Stand");
  });

  it("teaches the corrections the review of the old cell asked for", () => {
    // 155 km are the border installations round West Berlin, not one concrete wall.
    expect(findLesson("g10-mauerbau")!.paragraphs.join(" ")).toContain(
      "Grenzanlagen um West-Berlin wurden rund 155 Kilometer lang",
    );
    // The plan lists the Kuba-Krise as 1961/62: Bay of Pigs and missile crisis.
    expect(findLesson("g10-kuba-krise")!.workshop.conclusion).toContain("1961/62");
    expect(findLesson("g10-weg-zur-einheit")!.lb).toBe(4);
    expect(findLesson("g10-nahost-wurzeln")!.paragraphs.join(" ")).toContain("Nakba");
    expect(findLesson("g10-nahost-wurzeln")!.paragraphs.join(" ")).toContain(
      "Juden arabische Länder",
    );
  });
});

describe("coverage of the Kompetenzerwartungen", () => {
  it("maps all 41 competences verbatim to existing lessons and every lesson to a competence", () => {
    expect(coverage.curriculum).toBe(
      "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/geschichte",
    );
    expect(coverage.grade).toBe(10);
    expect(coverage.rows).toHaveLength(41);
    expect(coverage.core_lessons).toBe(CORE_LESSONS.length);
    expect(coverage.optional_lessons).toEqual(
      LESSONS.filter((lesson) => lesson.optional).map((lesson) => lesson.id),
    );
    expect(coverage.rows.map((row) => row.lb).filter((lb, i, all) => all.indexOf(lb) === i)).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8],
    );
    for (const row of coverage.rows) {
      expect(row.competence.length).toBeGreaterThan(40);
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        const lesson = findLesson(id);
        expect(lesson, `${id} in coverage`).toBeDefined();
        // Methods (LB 1) are applied everywhere; content rows may reach back, never ahead.
        if (row.lb > 1) expect(lesson!.lb, id).toBeLessThanOrEqual(row.lb);
      }
      if (row.lb > 1)
        expect(row.lessons.some((id) => findLesson(id)!.lb === row.lb)).toBe(true);
      expect("track" in row).toBe(false);
    }
    const covered = new Set(coverage.rows.flatMap((row) => row.lessons));
    for (const lesson of LESSONS) expect(covered.has(lesson.id), lesson.id).toBe(true);
  });

  it("lists every Grundlegende Daten und Begriffe with the lesson that teaches it", () => {
    expect(
      [2, 3, 4, 5, 6, 7].map((lb) => TERMS.filter((term) => term.lb === lb).length),
    ).toEqual([6, 12, 11, 5, 5, 2]);
    for (const term of TERMS) {
      const lesson = findLesson(term.lessonId);
      expect(lesson, term.term).toBeDefined();
      expect(lesson!.lb).toBe(term.lb);
      expect(term.explanation.length).toBeGreaterThan(40);
    }
    // Each LB 2–5 term of the plan appears in the row that names the terms.
    for (const lb of [2, 3, 4, 5]) {
      const row = coverage.rows.find(
        (entry) => entry.lb === lb && /Grundlegenden Daten/.test(entry.competence),
      )!;
      for (const term of TERMS.filter((entry) => entry.lb === lb)) {
        const core = term.term.replace(/^\d[\d./ ]*|^ab \d{4}\/\d{2} |[„“]/g, "").split(" ")[0];
        expect(row.competence, term.term).toContain(core);
      }
    }
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
    expect(checkWorkshop(work, correct.map(() => -1)).every(Boolean)).toBe(false);
    expect(checkWorkshop(work, correct.map(() => 1000)).every(Boolean)).toBe(false);
    expect(checkWorkshop(work, [...correct, 0]).every(Boolean)).toBe(false);
    if (work.kind === "timeline") {
      expect(work.entries.map((entry) => entry.target)).toEqual(correct);
      expect(checkWorkshop(work, [...correct].reverse()).every(Boolean)).toBe(false);
      for (let seed = 0; seed < 100; seed++) {
        const order = initialOrder(work, `${lesson.id}:${seed}`);
        expect([...order].sort((a, b) => a - b)).toEqual(correct);
        expect(checkWorkshop(work, order).every(Boolean)).toBe(false);
      }
      // The goal is not reached when the lesson opens.
      expect(checkWorkshop(work, initialOrder(work, lesson.id)).every(Boolean)).toBe(false);
    } else {
      for (const entry of work.entries)
        expect(entry.target >= 0 && entry.target < work.categories.length).toBe(true);
      // Every category is needed, so guessing one category for all entries fails.
      expect(new Set(work.entries.map((entry) => entry.target)).size).toBe(work.categories.length);
      for (let category = 0; category < work.categories.length; category++)
        expect(checkWorkshop(work, work.entries.map(() => category)).every(Boolean)).toBe(false);
    }
  });

  it("orders every timeline by its dates", () => {
    for (const lesson of LESSONS.filter((entry) => entry.workshop.kind === "timeline")) {
      const years = lesson.workshop.entries.map(
        (entry) => Number(entry.text.match(/\b(1[0-9]|20)\d{2}\b/g)?.[0]) || null,
      );
      const known = years.filter((year): year is number => year !== null);
      expect(known, lesson.id).toEqual([...known].sort((a, b) => a - b));
    }
  });

  it("does not mistake duplicate or extra entries for a valid chronology", () => {
    const work = LESSONS.find((lesson) => lesson.workshop.kind === "timeline")!.workshop;
    expect(checkWorkshop(work, work.entries.map(() => 0)).every(Boolean)).toBe(false);
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
    expect(firsts.size).toBe(3);
  });

  it("labels real data with units, scale, provenance and interpretive limits", () => {
    const tables = LESSONS.flatMap((lesson) =>
      lesson.workshop.dataTable ? [[lesson.id, lesson.workshop.dataTable] as const] : [],
    );
    expect(tables.map(([id]) => id)).toEqual([
      "g10-schaubild",
      "g10-mauerbau",
      "g10-gastarbeiter",
      "g10-friedliche-revolution",
      "g10-innere-einheit",
    ]);
    for (const [, table] of tables) {
      expect(table.rows.length).toBeGreaterThanOrEqual(2);
      for (const row of table.rows) expect(row.value > 0 && row.value <= table.max).toBe(true);
      expect(table.columns.every(Boolean)).toBe(true);
      expect(table.note.length).toBeGreaterThan(40);
      expect(SOURCES.some((source) => source.id === table.sourceId)).toBe(true);
    }
    expect(findLesson("g10-friedliche-revolution")!.workshop.dataTable!.rows.map((r) => r.value)).toEqual(
      [20000, 70000, 120000, 250000, 300000],
    );
    expect(findLesson("g10-gastarbeiter")!.workshop.dataTable!.rows.map((r) => r.value)).toEqual([
      330000, 1500000, 2600000,
    ]);
  });

  it("quotes the Bavarian constitution exactly and with provenance", () => {
    const excerpt = findLesson("g10-verfassung-bayern")!.workshop.sourceExcerpt!;
    expect(excerpt.sourceId).toBe("bayverf");
    expect(excerpt.text.startsWith("Angesichts des Trümmerfeldes, zu dem eine Staats-")).toBe(true);
    expect(excerpt.text.endsWith("nachstehende demokratische Verfassung.")).toBe(true);
  });

  it("requires a real draft and all three self-assessment criteria", () => {
    expect(canReviewDraft("     ")).toBe(false);
    expect(canReviewDraft("A short reply")).toBe(false);
    expect(canAcceptSelfAssessment("Ein begründeter eigener Gedankengang.", [true, true, false])).toBe(
      false,
    );
    expect(canAcceptSelfAssessment("Ein begründeter eigener Gedankengang.", [])).toBe(false);
    expect(canAcceptSelfAssessment("Ein begründeter eigener Gedankengang.", [true, true, true])).toBe(
      true,
    );
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
    expect(completion(progress)).toEqual({ completed: 1, total: 49, percent: 2 });
    expect(completion(progress, true).total).toBe(53);
  });

  it("round trips separate drafts and both levels without touching other apps", () => {
    const progress = freshProgress();
    const key = writingKey(progress.activeLessonId, 1);
    progress.drafts[key] = "Eine eigene begründete Antwort bleibt erhalten.";
    progress.drafts[writingKey(progress.activeLessonId, 2)] = "Eine andere Antwort für den Transfer.";
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
    expect(parseProgress(JSON.stringify({ drafts: { [key]: "x".repeat(9000) } })).drafts[key]).toHaveLength(
      8000,
    );
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

describe("cell", () => {
  it("binds every lesson to one atom with three cards and the common Lernbereich", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(53);
    expect(items).toHaveLength(159);
    for (const lesson of LESSONS) {
      const atom = cell.atoms.find((entry) => entry.source_link === lessonLink(lesson.id))!;
      expect(atom).toBeDefined();
      expect(atom.slug).toBe(lesson.id);
      expect(atom.title).toBe(lesson.title);
      const binding = atom.curricula.find((entry) => entry.provider === "lehrplanplus-bayern")!;
      expect(binding).toMatchObject({
        school_type: "realschule",
        grade: 10,
        subject: "geschichte",
        topic_code: `lb${lesson.lb}`,
        topic_title: STAGES.find((stage) => stage.lb === lesson.lb)!.title,
        exam_relevant: !lesson.optional,
      });
      expect("track" in binding).toBe(false);
      const [quiz, fact, reason] = atom.practice_items as Item[];
      expect(atom.practice_items).toHaveLength(3);
      expect(quiz).toMatchObject({
        slug: `${lesson.id}-check`,
        question: lesson.quiz.question,
        concept: lesson.quiz.answer,
        tier: "tier1_fast",
      });
      expect(quiz.choice_distractors).toEqual([
        { text: lesson.quiz.wrong[0], reason: lesson.quiz.whyWrong[0] },
        { text: lesson.quiz.wrong[1], reason: lesson.quiz.whyWrong[1] },
      ]);
      expect(fact).toMatchObject({ slug: `${lesson.id}-merken`, tier: "tier1_fast" });
      expect(reason).toMatchObject({
        slug: `${lesson.id}-begruenden`,
        question: lesson.tasks[1].prompt,
        sample_solution: lesson.tasks[1].model,
        tier: "tier2_synthesis",
      });
      expect(reason.concept.length).toBeLessThan(lesson.tasks[1].model.length);
      for (const item of atom.practice_items as Item[]) {
        expect(item.source_link).toBe(lessonLink(lesson.id));
        expect(item.language).toBe(lesson.language ?? "de");
      }
      for (const prereq of atom.prerequisites) {
        const target = cell.atoms.find((entry) => entry.id === prereq.atom_id);
        expect(target).toBeDefined();
        expect(cell.atoms.indexOf(target!)).toBeLessThan(cell.atoms.indexOf(atom));
      }
    }
    const ids = [...cell.atoms, ...items].map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[0-9A-HJKMNP-TV-Z]{26}$/);
  });

  it("gives every quick card a binary check and two curated distractors without length cues", () => {
    for (const item of items.filter((entry) => entry.tier === "tier1_fast")) {
      expect(item.fast_check).toEqual({
        type: "binary_choice",
        options: [item.concept, item.choice_distractors![0].text],
        correct_index: 0,
      });
      expect(item.choice_distractors).toHaveLength(2);
      for (const distractor of item.choice_distractors!) {
        expect(distractor.text).not.toBe(item.concept);
        expect(distractor.reason.length).toBeGreaterThan(20);
      }
      expect(
        lengthCue(
          item.concept,
          item.choice_distractors!.map((distractor) => distractor.text),
        ),
        item.slug,
      ).toBe(false);
    }
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

  it("uses only real lesson anchors and resolves level-specific deep links safely", () => {
    expect(ZAM_ACADEMY_APP_URL).toBe("https://academy.zam-os.org/geschichte-realschule-10/");
    for (const id of LESSON_IDS)
      expect(parseTrainingDeepLink(`#lesson=${id}&level=2`)).toEqual({ lessonId: id, level: 2 });
    expect(parseTrainingDeepLink("#lesson=g10-stasi&level=2", "?lesson=g10-uno&level=1")).toEqual({
      lessonId: "g10-stasi",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
    expect(parseTrainingDeepLink("#unrelated=value")).toEqual({});
  });
});

describe("approved mapping of the old ZAM cell", () => {
  // The two old atoms have differently shaped sample solutions; only id and question matter here.
  const oldAtoms = legacy.atoms as unknown as Array<{
    practice_items: Array<{ id: string; question: string }>;
  }>;
  const oldItems = oldAtoms.flatMap((atom) => atom.practice_items);

  it("names the exact legacy snapshot and classifies all four items once", () => {
    const source = mapping.sources[0];
    expect(source.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(source.tile_id).toBe(legacy.tile_id);
    expect(source.version).toBe(legacy.version);
    // validate-migration.mjs additionally verifies the SHA-256 of the original bytes.
    expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
      oldItems.map((item) => item.id).sort(),
    );
    for (const row of mapping.rows)
      expect(row.de_by_question).toBe(oldItems.find((item) => item.id === row.de_by_id)!.question);
    expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(2);
    expect(mapping.rows.filter((row) => row.category === "B")).toHaveLength(0);
    expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(2);
  });

  it("points each A row at one existing quick card and never transfers a C history", () => {
    const slugs = new Set(items.map((item) => item.slug));
    for (const row of mapping.rows) {
      if (row.category === "A") {
        expect(slugs.has(row.academy_slug!)).toBe(true);
        expect(row.action).toBe("replace");
      } else {
        expect(row.academy_slug).toBeNull();
        expect(row.action).toBe("retire");
      }
      expect(row.reason.length).toBeGreaterThan(80);
    }
    const targets = mapping.rows.flatMap((row) => (row.academy_slug ? [row.academy_slug] : []));
    expect(new Set(targets).size).toBe(targets.length);
  });

  it("declares exactly the approved replaces and retirements in version 2026.10.2", () => {
    expect(cell.version).toBe("2026.10.2");
    expect(mapping.status).toBe("approved");
    expect(mapping.approved).toBe("2026-10-25");
    expect(mapping.source).toContain("Ich gebe die Zuordnung 2 A / 0 B / 2 C");
    expect(mapping.authorization).toContain("2 A, 0 B, 2 C");
    const declared = items.flatMap((item) => (item.replaces ?? []).map((id) => [id, item.slug]));
    expect(declared.sort()).toEqual(
      mapping.rows
        .filter((row) => row.category === "A")
        .map((row) => [row.de_by_id, row.academy_slug])
        .sort(),
    );
    for (const item of items) expect((item.replaces ?? []).length).toBeLessThanOrEqual(1);
    const retired = (cell as { retired_items?: Array<{ id: string; reason: string }> })
      .retired_items!;
    expect(retired).toEqual(
      mapping.rows
        .filter((row) => row.category === "C")
        .map((row) => ({ id: row.de_by_id, reason: row.reason })),
    );
  });
});
