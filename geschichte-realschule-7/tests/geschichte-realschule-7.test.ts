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
  assignLanes,
  canAcceptSelfAssessment,
  canReviewDraft,
  checkWorkshop,
  esc,
  initialOrder,
  moveEntry,
  shuffle,
  spreadPins,
  stripPosition,
  stripRange,
  yearLabel,
  yearOf,
} from "../src/workshop";
import {
  lessonLink,
  parseTrainingDeepLink,
  ZAM_ACADEMY_APP_URL,
  ZAM_CELL_ID,
} from "../src/zam/zam-link";
import legacy from "./fixtures/de-by-realschule-7-geschichte-mittelalter-fruehe-neuzeit-kvt.json";
import publicContract from "./fixtures/public-contract.json";

// Published lesson anchors and item ids must not change after first publication.
const LESSON_IDS = [
  "g7-quellen-und-bilder",
  "g7-perspektiven-erzaehlen",
  "g7-karten-und-daten",
  "g7-baustile-erkennen",
  "g7-medien-recherchieren",
  "g7-christentum-und-herrschaft",
  "g7-ottonen-und-reisekoenigtum",
  "g7-grundherrschaft-und-staende",
  "g7-lehnswesen",
  "g7-kloester",
  "g7-investiturstreit",
  "g7-koenig-reich-kurfuersten",
  "g7-staufer-ritter-architektur",
  "g7-stadt-und-buerger",
  "g7-juedisches-leben-mittelalter",
  "g7-seuchen-und-krisen",
  "g7-kreuzzuege",
  "g7-renaissance-und-antike",
  "g7-menschenbild-und-wissenschaft",
  "g7-buchdruck",
  "g7-konstantinopel-1453",
  "g7-entdeckungsfahrten-1492",
  "g7-kolonialisierung-folgen",
  "g7-luther-und-1517",
  "g7-bauernkrieg-und-reich",
  "g7-konfessionalisierung",
  "g7-hexenverfolgung",
  "g7-dreissigjaehriger-krieg",
  "g7-westfaelischer-friede",
  "g7-absolutismus-frankreich",
  "g7-barock-in-bayern",
  "g7-hegemonie-und-balance",
  "g7-bauwerke-antike-mittelalter",
  "g7-bauwerke-religionen",
  "g7-bauwerke-barock-heute",
  "g7-handel-am-limes",
  "g7-hanse-und-fugger",
  "g7-welthandel-heute",
  "g7-en-village-and-town",
  "g7-en-monks-and-knights",
  "g7-en-new-horizons",
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

const lessonText = (lesson: (typeof LESSONS)[number]) =>
  [
    lesson.intro,
    ...lesson.paragraphs,
    lesson.takeaway,
    lesson.quiz.question,
    lesson.quiz.answer,
    ...lesson.quiz.wrong,
    ...lesson.quiz.whyWrong,
    lesson.quiz.explanation,
    lesson.workshop.material ?? "",
    lesson.workshop.conclusion,
    ...lesson.workshop.entries.flatMap((entry) => [entry.text, entry.feedback]),
    ...Object.values(lesson.tasks).flatMap((task) => [task.prompt, task.model, ...task.hints]),
  ].join(" ");

describe("curriculum and public lesson contract", () => {
  it("covers all seven core Lernbereiche in 38 lessons plus three optional English lessons", () => {
    expect(LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(CORE_LESSONS).toHaveLength(38);
    expect(LESSONS).toHaveLength(41);
    expect(STAGES.map((stage) => LESSONS.filter((lesson) => lesson.lb === stage.lb).length)).toEqual([
      5, 12, 6, 4, 5, 3, 3, 3,
    ]);
    // Hours as the plan states them; LB 1 runs through the year, LB 8 is optional.
    expect(STAGES.map((stage) => stage.hours ?? null)).toEqual([null, 20, 8, 8, 10, 5, 5, null]);
    expect(LESSONS.filter((lesson) => lesson.optional).map((lesson) => [lesson.lb, lesson.language])).toEqual([
      [8, "en"],
      [8, "en"],
      [8, "en"],
    ]);
  });

  it("gives every stage its own accent hue and icon", () => {
    expect(new Set(STAGES.map((stage) => stage.hue)).size).toBe(STAGES.length);
    expect(new Set(STAGES.map((stage) => stage.icon)).size).toBe(STAGES.length);
    for (const stage of STAGES) expect(stage.hue >= 0 && stage.hue < 360).toBe(true);
  });

  it.each(LESSONS)("has reviewed material, sources and two distinct writing tasks: $id", (lesson) => {
    expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(lesson.paragraphs.join(" ").length).toBeGreaterThan(900);
    expect(lesson.sourceIds.length).toBeGreaterThan(0);
    for (const id of lesson.sourceIds)
      expect(SOURCES.find((source) => source.id === id)?.url).toMatch(/^https:\/\//);
    expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
    expect(lesson.quiz.explanation.length).toBeGreaterThan(30);
    for (const hint of lesson.quiz.whyWrong) expect(hint.length).toBeGreaterThan(20);
    expect(lengthCue(lesson.quiz.answer, lesson.quiz.wrong)).toBe(false);
    expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
    for (const task of Object.values(lesson.tasks)) {
      expect(task.model.length).toBeGreaterThanOrEqual(140);
      expect(task.criteria).toHaveLength(3);
      expect(task.hints).toHaveLength(2);
    }
    expect(lesson.workshop.entries.length).toBeGreaterThanOrEqual(4);
    if (lesson.workshop.material)
      expect(lesson.workshop.materialLabel).toMatch(/keine historische Originalquelle/);
  });

  it("uses clean typography and language conventions in all lessons", () => {
    for (const lesson of LESSONS) {
      const text = lessonText(lesson);
      // Typographic quotes only; straight double quotes would mark unedited text.
      expect(text, lesson.id).not.toMatch(/"/);
      if (!lesson.language) {
        // Decimal comma, and large numbers grouped by a space, never 10.000 or 10,000.
        expect(text, lesson.id).not.toMatch(/\d\.\d|\b\d{1,3},\d{3}\b/);
        // Arithmetic and ranges use the real minus/en-dash, not ASCII hyphen between digits.
        expect(text, lesson.id).not.toMatch(/\d\s?-\s?\d/);
        // The learner is addressed with "du", never "Sie" as a polite form.
        expect(text, lesson.id).not.toMatch(/\b(Ihr|Ihre|Ihnen) (Antwort|Text|Fortschritt)/);
      }
    }
  });

  it("places every lesson in time for the strip", () => {
    for (const lesson of LESSONS) {
      const [from, to] = lesson.span;
      expect(from, lesson.id).toBeLessThanOrEqual(to);
      expect([from, to]).not.toContain(0);
      const range = stripRange(lesson.span);
      expect(range.left).toBeGreaterThanOrEqual(0);
      expect(range.left + range.width).toBeLessThanOrEqual(100.0001);
      expect(range.width).toBeGreaterThanOrEqual(1);
    }
    // Antiquity lies left of the 500–1800 scale, the present right of it.
    expect(stripPosition(500)).toBe(12);
    expect(stripPosition(1800)).toBe(88);
    expect(stripPosition(-450)).toBe(6);
    expect(stripPosition(2026)).toBe(94);
    expect(stripPosition(962)).toBeLessThan(stripPosition(1517));
  });

  it("gives overlapping lessons of a Geschichtsfries row their own lanes", () => {
    for (const stage of STAGES.filter((entry) => entry.lb >= 2 && !entry.optional)) {
      const ranges = LESSONS.filter((lesson) => lesson.lb === stage.lb).map((lesson) =>
        stripRange(lesson.span),
      );
      const lanes = assignLanes(ranges);
      for (let a = 0; a < ranges.length; a++)
        for (let b = a + 1; b < ranges.length; b++) {
          if (lanes[a] !== lanes[b]) continue;
          const [first, second] =
            ranges[a].left <= ranges[b].left ? [ranges[a], ranges[b]] : [ranges[b], ranges[a]];
          expect(first.left + first.width, `LB ${stage.lb}`).toBeLessThanOrEqual(second.left);
        }
    }
  });

  it("spreads the pins of close years on the solved timeline", () => {
    const positions = [1453, 1492, 1517, 1521].map((year) => stripPosition(year));
    const spread = spreadPins(positions);
    for (let i = 1; i < spread.length; i++)
      expect(spread[i] - spread[i - 1]).toBeGreaterThanOrEqual(3.999);
    const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
    expect(Math.abs(mean(spread) - mean(positions))).toBeLessThan(0.01);
    expect(spreadPins([20, 50, 80])).toEqual([20, 50, 80]);
  });

  it("reads years with and without explicit v./n. Chr. labels", () => {
    expect(yearOf("450 v. Chr.: Athen")).toBe(-450);
    expect(yearOf("962 n. Chr.: Kaiserkrönung")).toBe(962);
    expect(yearOf("1487/88 n. Chr.: Kap der Guten Hoffnung")).toBe(1487);
    expect(yearOf("um 1200: Stauferzeit")).toBe(1200);
    expect(yearOf("1618–1648: Dreißigjähriger Krieg")).toBe(1618);
    expect(yearOf("ohne Jahr")).toBeNull();
    expect(yearLabel(-450)).toBe("450 v. Chr.");
    expect(yearLabel(962)).toBe("962 n. Chr.");
  });

  it("draws Schaubilder with complete content", () => {
    const drawn = LESSONS.filter((lesson) => lesson.diagram);
    expect(drawn.length).toBeGreaterThanOrEqual(15);
    for (const lesson of drawn) {
      const diagram = lesson.diagram!;
      expect(diagram.title.length, lesson.id).toBeGreaterThan(5);
      expect(diagram.caption.length, lesson.id).toBeGreaterThan(40);
      if (diagram.kind === "compare") {
        expect(diagram.rows.length).toBeGreaterThanOrEqual(3);
        for (const row of diagram.rows) expect(row.values.every(Boolean)).toBe(true);
      } else if (diagram.kind === "steps") {
        expect(diagram.steps.length).toBeGreaterThanOrEqual(3);
      } else {
        expect(diagram.layers.length).toBeGreaterThanOrEqual(4);
      }
    }
    expect(findLesson("g7-ottonen-und-reisekoenigtum")!.diagram).toMatchObject({
      kind: "steps",
      repeats: true,
    });
    expect(findLesson("g7-grundherrschaft-und-staende")!.diagram!.kind).toBe("pyramid");
    expect(findLesson("g7-kloester")!.diagram!.kind).toBe("layers");
  });

  it("links every source at least once and marks Luther's 95 Theses excerpt clearly", () => {
    const used = new Set(LESSONS.flatMap((lesson) => lesson.sourceIds));
    for (const source of SOURCES) {
      expect(used.has(source.id), source.id).toBe(true);
      expect(source.url).toMatch(/^https:\/\//);
    }
    expect(new Set(SOURCES.map((source) => source.id)).size).toBe(SOURCES.length);

    const excerpts = LESSONS.flatMap((lesson) =>
      lesson.workshop.sourceExcerpt ? [[lesson.id, lesson.workshop.sourceExcerpt] as const] : [],
    );
    expect(excerpts.map(([id]) => id)).toEqual(["g7-luther-und-1517"]);
    const [, luther] = excerpts[0];
    expect([luther.author, luther.date, luther.audience].every(Boolean)).toBe(true);
    expect(SOURCES.find((source) => source.id === luther.sourceId)!.url).toContain("wikisource.org");
    expect(luther.text).toContain("ohne Ablassbriefe");
  });
});

describe("coverage of the Kompetenzerwartungen", () => {
  it("maps all 42 competences to existing lessons and every lesson to a competence", () => {
    expect(coverage.curriculum).toBe(
      "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/geschichte",
    );
    expect(coverage.curriculum_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(coverage.grade).toBe(7);
    expect(coverage.rows).toHaveLength(42);
    expect(coverage.core_lessons).toBe(CORE_LESSONS.length);
    expect(coverage.optional_lessons).toEqual([
      "g7-en-village-and-town",
      "g7-en-monks-and-knights",
      "g7-en-new-horizons",
    ]);
    expect(coverage.rows.map((row) => row.lb).filter((lb, i, all) => all.indexOf(lb) === i)).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8],
    );
    expect(STAGES.map((stage) => coverage.rows.filter((row) => row.lb === stage.lb).length)).toEqual([
      5, 10, 6, 5, 6, 4, 4, 2,
    ]);
    for (const row of coverage.rows) {
      expect(row.competence.length).toBeGreaterThan(40);
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(["implemented", "supported"]).toContain(row.status);
      expect(row.evidence.length).toBeGreaterThan(60);
      for (const id of row.lessons) {
        const lesson = findLesson(id);
        expect(lesson, `${id} in coverage`).toBeDefined();
        if (row.lb > 1) expect(lesson!.lb, id).toBeLessThanOrEqual(row.lb);
      }
      if (row.lb > 1) expect(row.lessons.some((id) => findLesson(id)!.lb === row.lb)).toBe(true);
      expect("track" in row).toBe(false);
    }
    const mapRows = coverage.rows.filter((row) => row.competence.includes("Geschichtskarten"));
    expect(mapRows).toHaveLength(2);
    for (const row of mapRows) {
      expect(row.status).toBe("supported");
      expect(row.evidence).toContain("Schulbuch oder Geschichtsatlas");
    }
    const covered = new Set(coverage.rows.flatMap((row) => row.lessons));
    for (const lesson of LESSONS) expect(covered.has(lesson.id), lesson.id).toBe(true);
  });

  it("lists every Grundlegende Daten und Begriffe verbatim with the lesson that teaches it", () => {
    expect([2, 3, 4, 5, 6, 7].map((lb) => TERMS.filter((term) => term.lb === lb).length)).toEqual([
      13, 4, 3, 5, 11, 4,
    ]);
    for (const term of TERMS) {
      const lesson = findLesson(term.lessonId);
      expect(lesson, term.term).toBeDefined();
      expect(lesson!.lb, term.term).toBeLessThanOrEqual(term.lb);
      expect(term.explanation.length).toBeGreaterThan(40);
      expect(
        coverage.rows.some((row) => row.lb === term.lb && row.competence.includes(term.term)),
        term.term,
      ).toBe(true);
    }
    const dated = TERMS.filter((term) => term.year !== undefined).map((term) => term.year);
    expect(dated).toEqual([962, 1200, 1453, 1492, 1517, 1618, 1700, -450, 800]);
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
      expect(checkWorkshop(work, initialOrder(work, lesson.id)).every(Boolean)).toBe(false);
    } else {
      expect(work.categories.length).toBeGreaterThanOrEqual(2);
      expect(work.categories.length).toBeLessThanOrEqual(4);
      for (const entry of work.entries)
        expect(entry.target >= 0 && entry.target < work.categories.length).toBe(true);
      expect(new Set(work.entries.map((entry) => entry.target)).size).toBe(work.categories.length);
      for (let category = 0; category < work.categories.length; category++)
        expect(checkWorkshop(work, work.entries.map(() => category)).every(Boolean)).toBe(false);
    }
  });

  it("orders every timeline chronologically by its dates", () => {
    const timelines = LESSONS.filter((lesson) => lesson.workshop.kind === "timeline");
    expect(timelines.map((lesson) => lesson.id)).toEqual([
      "g7-ottonen-und-reisekoenigtum",
      "g7-investiturstreit",
      "g7-entdeckungsfahrten-1492",
      "g7-bauernkrieg-und-reich",
      "g7-dreissigjaehriger-krieg",
    ]);
    for (const lesson of timelines) {
      const years = lesson.workshop.entries.map((entry) => yearOf(entry.text));
      expect(years.every((year) => year !== null), lesson.id).toBe(true);
      expect(years, lesson.id).toEqual([...years].sort((a, b) => a! - b!));
    }
  });

  it("moves entries, shuffles deterministically and checks self-assessment", () => {
    const original = [2, 0, 1];
    expect(moveEntry(original, 0, 1)).toEqual([0, 2, 1]);
    expect(moveEntry(original, 2, -1)).toEqual([2, 1, 0]);
    expect(moveEntry(original, 0, -1)).toEqual(original);
    expect(moveEntry(original, 3, -1)).toEqual(original);
    expect(original).toEqual([2, 0, 1]);

    expect(shuffle([0, 1, 2], "same")).toEqual(shuffle([0, 1, 2], "same"));
    const firsts = new Set(LESSONS.map((lesson) => shuffle([0, 1, 2], `${lesson.id}:quiz`)[0]));
    expect(firsts.size).toBe(3);

    expect(canReviewDraft("     ")).toBe(false);
    expect(canReviewDraft("Zu kurz")).toBe(false);
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
  it("counts the 38 core lessons and requires quiz, workshop and level-1 self-assessment", () => {
    const progress = freshProgress(),
      id = CORE_LESSONS[0].id;
    progress.quizDone.push(id);
    progress.workshopDone.push(id);
    progress.writingDone.push(writingKey(id, 2));
    expect(isComplete(progress, id)).toBe(false);
    progress.writingDone.push(writingKey(id, 1));
    expect(isComplete(progress, id)).toBe(true);
    expect(completion(progress)).toEqual({ completed: 1, total: 38, percent: 3 });

    const opt = "g7-en-village-and-town";
    progress.quizDone.push(opt);
    progress.workshopDone.push(opt);
    progress.writingDone.push(writingKey(opt, 1));
    expect(isComplete(progress, opt)).toBe(true);
    expect(completion(progress)).toEqual({ completed: 1, total: 38, percent: 3 });
  });

  it("round trips drafts and recovers from invalid or blocked storage", () => {
    const progress = freshProgress();
    const key = writingKey(progress.activeLessonId, 1);
    progress.drafts[key] = "Eine eigene begründete Antwort bleibt erhalten.";
    progress.drafts[writingKey(progress.activeLessonId, 2)] = "Eine andere Antwort für den Transfer.";
    progress.writingDone.push(key);
    progress.level = 2;
    expect(parseProgress(JSON.stringify(progress))).toEqual(progress);

    for (const raw of [null, "null", "[]", "12", "broken json", '{"level":"2","drafts":[]}']) {
      expect(parseProgress(raw)).toEqual(freshProgress());
    }

    const parsed = parseProgress(
      JSON.stringify({
        activeLessonId: "unknown",
        quizDone: [CORE_LESSONS[0].id, CORE_LESSONS[0].id, "unknown", 4],
        writingDone: [key],
        drafts: { [key]: "tiny", unknown: "<script>" },
      }),
    );
    expect(parsed.activeLessonId).toBe(CORE_LESSONS[0].id);
    expect(parsed.quizDone).toEqual([CORE_LESSONS[0].id]);
    expect(parsed.writingDone).toEqual([]);
    expect(parsed.drafts).toEqual({ [key]: "tiny" });
    expect(parseProgress(JSON.stringify({ drafts: { [key]: "x".repeat(9000) } })).drafts[key]).toHaveLength(
      8000,
    );

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
    expect(esc("<script>\"&'</script>")).toBe("&lt;script&gt;&quot;&amp;&#39;&lt;/script&gt;");
  });
});

describe("cell and pinned contract", () => {
  it("binds every lesson to one atom with three cards and its Lernbereich without track", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(41);
    expect(items).toHaveLength(123);
    for (const lesson of LESSONS) {
      const atom = cell.atoms.find((entry) => entry.source_link === lessonLink(lesson.id))!;
      expect(atom).toBeDefined();
      expect(atom.slug).toBe(lesson.id);
      expect(atom.title).toBe(lesson.title);
      expect(atom.typical_age_min).toBe(12);
      const binding = atom.curricula.find((entry) => entry.provider === "lehrplanplus-bayern")!;
      expect(binding).toMatchObject({
        school_type: "realschule",
        grade: 7,
        subject: "geschichte",
        topic_code: `lb${lesson.lb}`,
        topic_title: STAGES.find((stage) => stage.lb === lesson.lb)!.title,
        exam_relevant: !lesson.optional,
      });
      expect("track" in binding).toBe(false);
      expect([
        "geschichte/methoden",
        "geschichte/mittelalter",
        "geschichte/fruehe-neuzeit",
        "geschichte/laengsschnitt",
      ]).toContain(atom.domain);
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
      expect(fact.question).not.toBe(quiz.question);
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
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
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

  it("pins every published id and slug and declares only the four approved replaces", () => {
    expect(
      cell.atoms.map((atom) => ({
        id: atom.id,
        slug: atom.slug,
        lesson: atom.source_link,
        items: atom.practice_items.map((item) => ({ id: item.id, slug: item.slug })),
      })),
    ).toEqual(publicContract);
    expect(JSON.stringify(cell)).not.toMatch(/"retired_items"/);
    expect(items.filter((item) => (item.replaces?.length ?? 0) > 0)).toHaveLength(4);
  });

  it("uses only real lesson anchors and resolves level-specific deep links safely", () => {
    expect(ZAM_ACADEMY_APP_URL).toBe("https://academy.zam-os.org/geschichte-realschule-7/");
    for (const id of LESSON_IDS)
      expect(parseTrainingDeepLink(`#lesson=${id}&level=2`)).toEqual({ lessonId: id, level: 2 });
    expect(parseTrainingDeepLink("#lesson=g7-luther-und-1517&level=2", "?lesson=g7-kloester&level=1")).toEqual({
      lessonId: "g7-luther-und-1517",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
    expect(parseTrainingDeepLink("#unrelated=value")).toEqual({});
  });
});

describe("approved mapping of the legacy ZAM cell", () => {
  const oldItems = legacy.atoms.flatMap((atom) => atom.practice_items) as Array<{
    id: string;
    question: string;
  }>;

  it("names the exact legacy snapshot and classifies all eight items once", () => {
    const source = mapping.sources[0];
    expect(source.sha256).toBe("83bd564c4efea040d9a48d21d348b84e8e4f2e5c626968f853f125850ffece67");
    expect(source.tile_id).toBe(legacy.tile_id);
    expect(source.version).toBe(legacy.version);
    expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(
      oldItems.map((item) => item.id).sort(),
    );
    for (const row of mapping.rows)
      expect(row.de_by_question).toBe(oldItems.find((item) => item.id === row.de_by_id)!.question);
    expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(4);
    expect(mapping.rows.filter((row) => row.category === "B")).toHaveLength(0);
    expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(4);
  });

  it("records approved A transfers and declares matching replaces on each successor", () => {
    expect(mapping.status).toBe("approved");
    expect(mapping.approved).toBe("2026-11-22");
    for (const row of mapping.rows) {
      if (row.category === "A") {
        const matches = items.filter((item) => item.slug === row.academy_slug);
        expect(matches).toHaveLength(1);
        expect(matches[0].replaces).toEqual([row.de_by_id]);
        expect(row.action).toBe("replace");
      } else {
        expect(row.academy_slug).toBeNull();
        expect(row.action).toBe("keep-active");
      }
      expect(row.reason.length).toBeGreaterThan(80);
    }
    const targets = mapping.rows.flatMap((row) => (row.academy_slug ? [row.academy_slug] : []));
    expect(new Set(targets).size).toBe(targets.length);
  });
});
