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
import legacy from "./fixtures/de-by-realschule-6-geschichte-urgeschichte-antike-kvt.json";
import publicContract from "./fixtures/public-contract.json";

// Published lesson anchors and item ids must not change after first publication.
const LESSON_IDS = [
  "g6-quellen",
  "g6-zeitleiste",
  "g6-karten",
  "g6-archaeologie",
  "g6-informieren",
  "g6-erzaehlen",
  "g6-zeit-und-quellen",
  "g6-altsteinzeit",
  "g6-jungsteinzeit",
  "g6-kelten",
  "g6-nil",
  "g6-pharao",
  "g6-pyramiden",
  "g6-hochkultur",
  "g6-polis",
  "g6-kolonisation",
  "g6-kultur-griechen",
  "g6-kunst-griechen",
  "g6-verfassungen",
  "g6-perserkriege",
  "g6-perikles",
  "g6-rom-anfaenge",
  "g6-republik",
  "g6-caesar-augustus",
  "g6-stadt-rom",
  "g6-familie",
  "g6-provinzen",
  "g6-juden",
  "g6-christentum",
  "g6-erbe-roms",
  "g6-untergang-roms",
  "g6-dreiteilung",
  "g6-islam",
  "g6-franken",
  "g6-karl",
  "g6-ueberleben",
  "g6-technik-aegypten",
  "g6-technik-antike",
  "g6-technik-heute",
  "g6-hatschepsut",
  "g6-alexander",
  "g6-staatsmaenner",
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
  it("covers all eight Lernbereiche in 42 lessons", () => {
    expect(LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(CORE_LESSONS).toHaveLength(42);
    expect(STAGES.map((stage) => LESSONS.filter((lesson) => lesson.lb === stage.lb).length)).toEqual([
      6, 4, 4, 7, 9, 5, 4, 3,
    ]);
    // Hours as the plan states them; Lernbereich 1 runs through the whole year.
    expect(STAGES.map((stage) => stage.hours ?? null)).toEqual([null, 8, 6, 10, 12, 10, 5, 5]);
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
      expect(task.model.length).toBeGreaterThan(150);
      expect(task.criteria).toHaveLength(3);
      expect(task.hints).toHaveLength(2);
    }
    expect(lesson.workshop.entries.length).toBeGreaterThanOrEqual(4);
    if (lesson.workshop.material)
      expect(lesson.workshop.materialLabel).toMatch(/keine historische Originalquelle/);
  });

  it("uses German conventions in all learner text", () => {
    for (const lesson of LESSONS) {
      const text = lessonText(lesson);
      // Typographic quotes only; straight double quotes would mark untranslated text.
      expect(text, lesson.id).not.toMatch(/"/);
      // Decimal comma, and large numbers grouped by a space, never 10.000 or 10,000.
      expect(text, lesson.id).not.toMatch(/\d\.\d|\b\d{1,3},\d{3}\b/);
      // Arithmetic uses the real minus sign.
      expect(text, lesson.id).not.toMatch(/\d\s?-\s?\d/);
      // The learner is addressed with "du", never "Sie" as a polite form.
      expect(text, lesson.id).not.toMatch(/\b(Ihr|Ihre|Ihnen) (Antwort|Text|Fortschritt)/);
    }
    expect(findLesson("g6-zeitleiste")!.paragraphs.join(" ")).toContain("753 + 14 − 1 = 766");
    expect(findLesson("g6-technik-heute")!.period).toContain("Stand November 2026");
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
    // Prehistory lies left of the scale, the present right of it.
    // The zones end exactly where the scale starts, so no gap opens beside the epochs.
    expect(stripRange(findLesson("g6-altsteinzeit")!.span)).toEqual({ left: 0, width: 12 });
    expect(stripRange(findLesson("g6-technik-heute")!.span)).toEqual({ left: 88, width: 12 });
    expect(stripPosition(-3000)).toBe(12);
    expect(stripPosition(1000)).toBe(88);
    expect(stripPosition(-753)).toBeLessThan(stripPosition(-450));
  });

  it("gives overlapping lessons of a Geschichtsfries row their own lanes", () => {
    for (const stage of STAGES.filter((entry) => entry.lb >= 2)) {
      const ranges = LESSONS.filter((lesson) => lesson.lb === stage.lb).map((lesson) =>
        stripRange(lesson.span),
      );
      const lanes = assignLanes(ranges);
      for (let a = 0; a < ranges.length; a++)
        for (let b = a + 1; b < ranges.length; b++) {
          if (lanes[a] !== lanes[b]) continue;
          const [first, second] = ranges[a].left <= ranges[b].left ? [ranges[a], ranges[b]] : [ranges[b], ranges[a]];
          expect(first.left + first.width, `LB ${stage.lb}`).toBeLessThanOrEqual(second.left);
        }
    }
    // Reported in review: Stadt Rom and Juden, Provinzen and Erbe Roms shared a lane.
    const rome = LESSONS.filter((lesson) => lesson.lb === 5);
    const lanes = assignLanes(rome.map((lesson) => stripRange(lesson.span)));
    const lane = (id: string) => lanes[rome.findIndex((lesson) => lesson.id === id)];
    expect(lane("g6-stadt-rom")).not.toBe(lane("g6-juden"));
    expect(lane("g6-provinzen")).not.toBe(lane("g6-erbe-roms"));
  });

  it("spreads the pins of close years on the solved timeline", () => {
    const positions = [-500, -490, -480, -479, -478, -462].map((year) => stripPosition(year));
    const spread = spreadPins(positions);
    for (let i = 1; i < spread.length; i++) expect(spread[i] - spread[i - 1]).toBeGreaterThanOrEqual(3.999);
    const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
    expect(Math.abs(mean(spread) - mean(positions))).toBeLessThan(0.01);
    // Pins far apart stay where they are.
    expect(spreadPins([20, 50, 80])).toEqual([20, 50, 80]);
  });

  it("teaches the century rule with the boundary of full hundreds", () => {
    const text = findLesson("g6-zeitleiste")!.paragraphs.join(" ");
    expect(text).toContain("Teile die Jahreszahl durch 100 und runde auf");
    expect(text).toContain("500 v. Chr. noch zum 5. Jahrhundert v. Chr., 501 v. Chr. dagegen schon zum 6.");
    expect(text).not.toContain("Hunderterstelle");
    const century = (year: number) => Math.ceil(year / 100);
    expect([century(753), century(500), century(501), century(100), century(1)]).toEqual([8, 5, 6, 1, 1]);
  });

  it("reads years before and after Christ", () => {
    expect(yearOf("753 v. Chr.: Romulus")).toBe(-753);
    expect(yearOf("478/477 v. Chr.: Seebund")).toBe(-478);
    expect(yearOf("117 n. Chr.: größte Ausdehnung")).toBe(117);
    expect(yearOf("ohne Jahr")).toBeNull();
    expect(yearLabel(-3000)).toBe("3000 v. Chr.");
    expect(yearLabel(800)).toBe("800 n. Chr.");
  });

  it("draws 21 Schaubilder with complete content", () => {
    const drawn = LESSONS.filter((lesson) => lesson.diagram);
    expect(drawn).toHaveLength(21);
    expect(coverage.rows.find((row) => row.lb === 1 && row.lessons.includes("g6-karten"))!.evidence).toContain(
      "21 Lektionen ein Schaubild",
    );
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
    expect(findLesson("g6-nil")!.diagram).toMatchObject({ kind: "steps", repeats: true });
    expect(findLesson("g6-pharao")!.diagram!.kind).toBe("pyramid");
    expect(findLesson("g6-technik-antike")!.diagram!.kind).toBe("layers");
  });

  it("links every source at least once and labels it as checked", () => {
    const used = new Set(LESSONS.flatMap((lesson) => lesson.sourceIds));
    for (const source of SOURCES) {
      expect(used.has(source.id), source.id).toBe(true);
      expect(source.url).toMatch(/^https:\/\//);
    }
    expect(new Set(SOURCES.map((source) => source.id)).size).toBe(SOURCES.length);
  });

  it("quotes two original sources in a marked translation with the Latin text linked", () => {
    const excerpts = LESSONS.flatMap((lesson) =>
      lesson.workshop.sourceExcerpt ? [[lesson.id, lesson.workshop.sourceExcerpt] as const] : [],
    );
    expect(excerpts.map(([id]) => id)).toEqual(["g6-caesar-augustus", "g6-christentum"]);
    for (const [, excerpt] of excerpts) {
      expect(excerpt.context).toContain("Übersetzung für diese App aus dem Lateinischen");
      expect([excerpt.author, excerpt.date, excerpt.audience].every(Boolean)).toBe(true);
      expect(SOURCES.find((source) => source.id === excerpt.sourceId)!.url).toContain(
        "thelatinlibrary.com",
      );
    }
    expect(excerpts[0][1].text).toContain("an Amtsgewalt aber besaß ich nicht mehr");
    expect(excerpts[1][1].text).toContain("Wer dabei blieb, den ließ ich abführen.");
  });
});

describe("coverage of the Kompetenzerwartungen", () => {
  it("maps all 44 competences to existing lessons and every lesson to a competence", () => {
    expect(coverage.curriculum).toBe(
      "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/geschichte",
    );
    expect(coverage.curriculum_sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(coverage.grade).toBe(6);
    expect(coverage.rows).toHaveLength(44);
    expect(coverage.core_lessons).toBe(CORE_LESSONS.length);
    expect(coverage.optional_lessons).toEqual([]);
    expect(coverage.rows.map((row) => row.lb).filter((lb, i, all) => all.indexOf(lb) === i)).toEqual(
      [1, 2, 3, 4, 5, 6, 7, 8],
    );
    expect(STAGES.map((stage) => coverage.rows.filter((row) => row.lb === stage.lb).length)).toEqual([
      5, 4, 5, 7, 9, 6, 4, 4,
    ]);
    for (const row of coverage.rows) {
      expect(row.competence.length).toBeGreaterThan(40);
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(["implemented", "supported"]).toContain(row.status);
      expect(row.evidence.length).toBeGreaterThan(60);
      for (const id of row.lessons) {
        const lesson = findLesson(id);
        expect(lesson, `${id} in coverage`).toBeDefined();
        // Methods (LB 1) are applied everywhere; content rows may reach back, never ahead.
        if (row.lb > 1) expect(lesson!.lb, id).toBeLessThanOrEqual(row.lb);
      }
      if (row.lb > 1) expect(row.lessons.some((id) => findLesson(id)!.lb === row.lb)).toBe(true);
      expect("track" in row).toBe(false);
    }
    expect(
      coverage.rows.filter((row) => row.status === "supported").map((row) => row.lessons[0]),
    ).toEqual(["g6-erzaehlen", "g6-karten", "g6-informieren", "g6-polis", "g6-rom-anfaenge", "g6-dreiteilung"]);
    // The app describes historical maps but shows none: every map row says which map the learner needs.
    const mapRows = coverage.rows.filter((row) => row.competence.includes("Geschichtskarte"));
    expect(mapRows).toHaveLength(4);
    for (const row of mapRows) {
      expect(row.status).toBe("supported");
      expect(row.evidence).toContain("aus Schulbuch oder Geschichtsatlas");
    }
    const covered = new Set(coverage.rows.flatMap((row) => row.lessons));
    for (const lesson of LESSONS) expect(covered.has(lesson.id), lesson.id).toBe(true);
  });

  it("lists every Grundlegende Daten und Begriffe verbatim with the lesson that teaches it", () => {
    expect([2, 3, 4, 5, 6, 7].map((lb) => TERMS.filter((term) => term.lb === lb).length)).toEqual([
      3, 3, 8, 11, 7, 1,
    ]);
    for (const term of TERMS) {
      const lesson = findLesson(term.lessonId);
      expect(lesson, term.term).toBeDefined();
      expect(lesson!.lb, term.term).toBeLessThanOrEqual(term.lb);
      expect(term.explanation.length).toBeGreaterThan(40);
      // The plan's own wording appears in a row of the Lernbereich that names it.
      expect(
        coverage.rows.some((row) => row.lb === term.lb && row.competence.includes(term.term)),
        term.term,
      ).toBe(true);
    }
    const dated = TERMS.filter((term) => term.year !== undefined).map((term) => term.year);
    expect(dated).toEqual([-3000, -450, -753, -50, 1, 500, 800]);
  });
});

describe("workshops", () => {
  it.each(LESSONS)("checks complete, wrong and missing answers: $id", (lesson) => {
    const work = lesson.workshop;
    const correct =
      work.kind === "timeline" ? work.entries.map((_, i) => i) : work.entries.map((entry) => entry.target);
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
      expect(work.categories.length).toBeGreaterThanOrEqual(2);
      expect(work.categories.length).toBeLessThanOrEqual(4);
      for (const entry of work.entries)
        expect(entry.target >= 0 && entry.target < work.categories.length).toBe(true);
      // Every category is needed, so guessing one category for all entries fails.
      expect(new Set(work.entries.map((entry) => entry.target)).size).toBe(work.categories.length);
      for (let category = 0; category < work.categories.length; category++)
        expect(checkWorkshop(work, work.entries.map(() => category)).every(Boolean)).toBe(false);
    }
  });

  it("orders every timeline by its dates, before and after Christ", () => {
    const timelines = LESSONS.filter((lesson) => lesson.workshop.kind === "timeline");
    expect(timelines.map((lesson) => lesson.id)).toEqual([
      "g6-zeitleiste",
      "g6-perserkriege",
      "g6-rom-anfaenge",
      "g6-juden",
      "g6-alexander",
    ]);
    for (const lesson of timelines) {
      const years = lesson.workshop.entries.map((entry) => yearOf(entry.text));
      expect(years.every((year) => year !== null), lesson.id).toBe(true);
      expect(years, lesson.id).toEqual([...years].sort((a, b) => a! - b!));
    }
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

  it("requires a real draft and all three self-assessment criteria", () => {
    expect(canReviewDraft("     ")).toBe(false);
    expect(canReviewDraft("Zu kurz")).toBe(false);
    expect(canAcceptSelfAssessment("Ein begründeter eigener Gedankengang.", [true, true, false])).toBe(false);
    expect(canAcceptSelfAssessment("Ein begründeter eigener Gedankengang.", [])).toBe(false);
    expect(canAcceptSelfAssessment("Ein begründeter eigener Gedankengang.", [true, true, true])).toBe(true);
    expect(canAcceptSelfAssessment("kurz", [true, true, true])).toBe(false);
  });
});

describe("learner progress and offline storage", () => {
  it("requires quiz, workshop and level-1 self-assessment", () => {
    const progress = freshProgress(),
      id = CORE_LESSONS[0].id;
    progress.quizDone.push(id);
    progress.workshopDone.push(id);
    progress.writingDone.push(writingKey(id, 2));
    expect(isComplete(progress, id)).toBe(false);
    progress.writingDone.push(writingKey(id, 1));
    expect(isComplete(progress, id)).toBe(true);
    expect(completion(progress)).toEqual({ completed: 1, total: 42, percent: 2 });
  });

  it("round trips separate drafts for both levels", () => {
    const progress = freshProgress();
    const key = writingKey(progress.activeLessonId, 1);
    progress.drafts[key] = "Eine eigene begründete Antwort bleibt erhalten.";
    progress.drafts[writingKey(progress.activeLessonId, 2)] = "Eine andere Antwort für den Transfer.";
    progress.writingDone.push(key);
    progress.level = 2;
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
    expect(parseProgress(JSON.stringify({ drafts: { [key]: "x".repeat(9000) } })).drafts[key]).toHaveLength(8000);
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
  it("binds every lesson to one atom with three cards and its Lernbereich", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(42);
    expect(items).toHaveLength(126);
    for (const lesson of LESSONS) {
      const atom = cell.atoms.find((entry) => entry.source_link === lessonLink(lesson.id))!;
      expect(atom).toBeDefined();
      expect(atom.slug).toBe(lesson.id);
      expect(atom.title).toBe(lesson.title);
      expect(atom.typical_age_min).toBe(11);
      const binding = atom.curricula.find((entry) => entry.provider === "lehrplanplus-bayern")!;
      expect(binding).toMatchObject({
        school_type: "realschule",
        grade: 6,
        subject: "geschichte",
        topic_code: `lb${lesson.lb}`,
        topic_title: STAGES.find((stage) => stage.lb === lesson.lb)!.title,
        exam_relevant: true,
      });
      // One Fachlehrplan for all Wahlpflichtfächergruppen: no track.
      expect("track" in binding).toBe(false);
      expect([
        "geschichte/methoden",
        "geschichte/anfaenge",
        "geschichte/antike",
        "geschichte/mittelalter",
        "geschichte/zeitgeschichte",
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
        expect(item.language).toBe("de");
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
    expect(ZAM_ACADEMY_APP_URL).toBe("https://academy.zam-os.org/geschichte-realschule-6/");
    for (const id of LESSON_IDS)
      expect(parseTrainingDeepLink(`#lesson=${id}&level=2`)).toEqual({ lessonId: id, level: 2 });
    expect(parseTrainingDeepLink("#lesson=g6-nil&level=2", "?lesson=g6-karl&level=1")).toEqual({
      lessonId: "g6-nil",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
    expect(parseTrainingDeepLink("#unrelated=value")).toEqual({});
  });
});

describe("approved mapping of the old ZAM cell", () => {
  const oldItems = legacy.atoms.flatMap((atom) => atom.practice_items) as Array<{
    id: string;
    question: string;
  }>;

  it("names the exact legacy snapshot and classifies all eight items once", () => {
    const source = mapping.sources[0];
    expect(source.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(source.tile_id).toBe(legacy.tile_id);
    expect(source.version).toBe(legacy.version);
    // validate-migration.mjs additionally verifies the SHA-256 of the original bytes.
    expect(mapping.rows.map((row) => row.de_by_id).sort()).toEqual(oldItems.map((item) => item.id).sort());
    for (const row of mapping.rows)
      expect(row.de_by_question).toBe(oldItems.find((item) => item.id === row.de_by_id)!.question);
    expect(mapping.rows.filter((row) => row.category === "A")).toHaveLength(4);
    expect(mapping.rows.filter((row) => row.category === "B")).toHaveLength(0);
    expect(mapping.rows.filter((row) => row.category === "C")).toHaveLength(4);
  });

  it("points each A row at one existing card and keeps the C cards active", () => {
    const slugs = items.map((item) => item.slug);
    for (const row of mapping.rows) {
      if (row.category === "A") {
        expect(slugs.filter((slug) => slug === row.academy_slug)).toHaveLength(1);
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

  it("declares exactly the approved replaces and no retirements", () => {
    expect(mapping.status).toBe("approved");
    expect(mapping.approved).toBe("2026-11-18");
    expect(mapping.source).toContain("„Mapping-Freigabe erteilt“");
    expect(mapping.source).toContain("4 A / 0 B / 4 C");
    const declared = items.flatMap((item) => (item.replaces ?? []).map((id) => [id, item.slug]));
    expect(declared.sort()).toEqual(
      mapping.rows
        .filter((row) => row.category === "A")
        .map((row) => [row.de_by_id, row.academy_slug])
        .sort(),
    );
    for (const item of items) expect((item.replaces ?? []).length).toBeLessThanOrEqual(1);
    expect("retired_items" in cell).toBe(false);
  });
});
