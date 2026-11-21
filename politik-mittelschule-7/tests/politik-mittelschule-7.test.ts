import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import {
  CORE_LESSONS,
  CURRICULUM_URLS,
  findLesson,
  LESSONS,
  lessonsForTrack,
  SOURCES,
  STAGES,
} from "../src/curriculum";
import { FIGURES, renderFigure } from "../src/figures";
import {
  SECTOR_SHARES,
  TOWN_NEWS,
  TOWN_YEARS,
  VERSAILLES_LOSSES,
} from "../src/figures/scenes";
import {
  completion,
  freshProgress,
  isComplete,
  loadProgress,
  parseProgress,
  saveProgress,
  STORAGE_KEY,
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
import contract from "./fixtures/public-contract.json";

const items = cell.atoms.flatMap((a) => a.practice_items);
/** Everything a learner reads in a lesson, without ids and URLs. */
const learnerText = (l: (typeof LESSONS)[number]) =>
  [
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
    l.workshop.title,
    l.workshop.instruction,
    l.workshop.material ?? "",
    ...l.workshop.categories,
    ...l.workshop.entries.flatMap((e) => [e.text, e.feedback]),
    l.workshop.conclusion,
    ...Object.values(l.tasks).flatMap((t) => [
      t.prompt,
      t.model,
      ...t.hints,
      ...t.criteria,
    ]),
  ]
    .join("\n")
    // Thousands are grouped with a no-break space; compare as plain spaces.
    .replace(/\u00a0/g, " ");
const M_ONLY = ["sozialstaat", "neue-berufe"];

describe("Politik und Gesellschaft 7: curriculum and teaching material", () => {
  it("covers GPG 7 Lernbereich 3 in three stages: 13 lessons in R7, 15 in M7", () => {
    expect(LESSONS).toHaveLength(15);
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(15);
    expect(STAGES.map((s) => s.id)).toEqual([1, 2, 3]);
    expect(STAGES.map((s) => LESSONS.filter((l) => l.stage === s.id).length)).toEqual([6, 4, 5]);
    expect(LESSONS.every((l) => l.lb === 3)).toBe(true);
    expect(lessonsForTrack("R")).toHaveLength(13);
    expect(lessonsForTrack("M")).toHaveLength(15);
    expect(CORE_LESSONS).toEqual(lessonsForTrack("R"));
    expect(LESSONS.filter((l) => !l.tracks.includes("R")).map((l) => l.id)).toEqual(M_ONLY);
    for (const l of LESSONS) {
      expect(l.tracks.length).toBeGreaterThan(0);
      expect(l.lehrplan).toMatch(/^GPG 7 LB 3 \((R7, M7|M7)\): /);
      expect(l.lehrplan.includes("R7")).toBe(l.tracks.includes("R"));
    }
  });

  it("traces all eight verbatim expectations of R7 and M7 and every lesson to them", () => {
    expect(coverage.curriculum).toEqual(CURRICULUM_URLS);
    expect(coverage.curriculum_sha256.R).toMatch(/^[0-9a-f]{64}$/);
    expect(coverage.curriculum_sha256.M).toMatch(/^[0-9a-f]{64}$/);
    expect(coverage.rows).toHaveLength(8);
    for (const track of ["R", "M"] as const) {
      const rows = coverage.rows.filter((r) => r.track === track);
      expect(rows.map((r) => r.position)).toEqual([1, 2, 3, 4]);
      const cited = new Set(rows.flatMap((r) => r.lessons));
      for (const id of cited) expect(findLesson(id)?.tracks).toContain(track);
      const optional: string[] = coverage.optional_lessons[track];
      expect(
        LESSONS.filter((l) => !cited.has(l.id) && !optional.includes(l.id)).map((l) => l.id),
      ).toEqual([]);
      for (const id of optional) expect(findLesson(id)?.tracks).not.toContain(track);
    }
    for (const r of coverage.rows) {
      expect(r.lb).toBe(3);
      expect(r.status).toBe("implemented");
      expect(r.evidence.length).toBeGreaterThan(60);
      expect(r.additional.length).toBeGreaterThan(25);
    }
    // The M7 additions have their own lessons.
    const m = coverage.rows.filter((r) => r.track === "M");
    expect(m[0].competence).toContain("sozialen Sicherungssystem");
    expect(m[0].lessons).toContain("sozialstaat");
    expect(m[1].competence).toContain("neue Berufsbilder");
    expect(m[1].lessons).toContain("neue-berufe");
  });

  it.each(LESSONS)(
    "provides explanation, checks, a figure and two distinct tasks: $id",
    (l) => {
      expect(l.id).toMatch(/^[a-z][a-z0-9-]+$/);
      expect(l.paragraphs).toHaveLength(2);
      expect(l.paragraphs.join(" ").length).toBeGreaterThan(600);
      expect(l.takeaway.length).toBeGreaterThan(40);
      expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
      expect(l.quiz.explanation.length).toBeGreaterThan(35);
      expect(l.sourceIds.slice(0, l.tracks.length)).toEqual(
        l.tracks.map((t) => (t === "R" ? "lehrplan-r7" : "lehrplan-m7")),
      );
      expect(l.sourceIds.length).toBeGreaterThan(l.tracks.length);
      for (const id of l.sourceIds)
        expect(SOURCES.find((s) => s.id === id)?.url).toMatch(/^https:\/\//);
      expect(l.figures.length).toBeGreaterThan(0);
      for (const id of l.figures) expect(FIGURES[id]).toBeDefined();
      expect(l.tasks[1].prompt).not.toBe(l.tasks[2].prompt);
      expect(l.tasks[1].model).not.toBe(l.tasks[2].model);
      for (const t of Object.values(l.tasks)) {
        expect(t.model.length).toBeGreaterThan(100);
        expect(t.hints).toHaveLength(2);
        expect(t.criteria).toHaveLength(3);
      }
    },
  );

  it.each(LESSONS)("follows the German writing conventions: $id", (l) => {
    const text = learnerText(l);
    // Decimal comma, no thousands point (100 000 Berufssoldaten).
    expect(text).not.toMatch(/\d\.\d/);
    // No ASCII hyphen as a minus sign before a number.
    expect(text).not.toMatch(/(^|[\s(])-\d/);
    // A space between number and unit.
    expect(text).not.toMatch(/\d(km|m|Prozent|%)\b/);
    // Learners are addressed with "du", never with "Sie".
    expect(text).not.toMatch(/\b(Ihr Ergebnis|Sie sollen|Ihre Antwort)\b/);
  });

  it("never breaks a number at its thousands space", () => {
    const raw = JSON.stringify(LESSONS) + JSON.stringify(cell);
    expect(raw).not.toMatch(/\d \d{3}\b/);
  });

  it("uses every source in a lesson and only HTTPS links", () => {
    const used = new Set(LESSONS.flatMap((l) => l.sourceIds));
    expect(SOURCES.map((s) => s.id).filter((id) => !used.has(id))).toEqual([]);
    expect(new Set(SOURCES.map((s) => s.url)).size).toBe(SOURCES.length);
  });

  it("checks the facts most likely to be mistyped against the cited sources", () => {
    const all = LESSONS.map(learnerText).join("\n");
    const text = (id: string) => learnerText(findLesson(id)!);
    // LeMO Sozialgesetzgebung
    expect(text("fabrik")).toContain("12 bis 14 Stunden");
    expect(text("sozialgesetze")).toMatch(/1883[\s\S]*1884[\s\S]*1889/);
    expect(text("sozialgesetze")).toContain("70. Lebensjahr");
    expect(text("sozialgesetze")).toContain("zu zwei Dritteln die Arbeiter");
    expect(text("sozialgesetze")).toContain("elf Stunden");
    // LeMO Arbeiterfrage und Streikbewegung, Arbeiterbewegung
    expect(text("zusammenschluss")).toContain("fast 90 000 Bergleute");
    expect(text("zusammenschluss")).toMatch(/1863[\s\S]*1869[\s\S]*1875[\s\S]*1878/);
    // Kolping Deutschland
    expect(text("kirche-unternehmer")).toContain("1849 gründete er in Köln");
    // DRV Historie, BMG Pflegeversicherung
    expect(text("sozialstaat")).toContain("1927");
    expect(text("sozialstaat")).toContain("1995");
    // LeMO Industrie und Wirtschaft, Urbanisierung
    expect(text("agrar-industrie")).toContain("auf 34 Prozent");
    expect(text("agrar-industrie")).toContain("von rund 29 auf 40 Prozent");
    expect(text("agrar-industrie")).toContain("von 41 auf 65 Millionen");
    expect(text("stadtwachstum")).toContain("nur acht Städte mehr als 100 000 Einwohner");
    expect(text("stadtwachstum")).toContain("48 Großstädte");
    expect(text("neue-berufe")).toContain("etwa 600 Chemiker");
    // LeMO Weg in den Krieg, Juli-Krise 1914, Kriegserklärungen
    expect(text("kriegsursachen")).toContain("um 136 000 auf über 800 000");
    expect(text("julikrise")).toContain("Am 23. Juli");
    expect(text("julikrise")).toContain("am 4. August");
    // bpb Mombauer
    expect(text("kriegsschuld")).toContain("Artikel 231");
    expect(text("kriegsschuld")).toContain("1961");
    expect(text("kriegsschuld")).toContain("nicht die alleinige Schuld");
    // LeMO Versailler Vertrag
    expect(text("versailles")).toContain("ein Siebtel seines Gebiets mit einem Zehntel");
    expect(text("versailles")).toContain("100 000 Berufssoldaten");
    expect(text("versailles")).toContain("15 000 Mann");
    expect(text("versailles")).toContain("132 Milliarden Goldmark");
    expect(text("versailles")).toContain("10. Januar 1920");
    // Fischer did not claim sole guilt; the Dolchstoß claim is called false.
    expect(all).not.toMatch(/Fischer[^.]*Alleinschuld/);
    expect(text("unzufriedenheit")).toContain("behauptete falsch");
  });
});

describe("figures", () => {
  it.each(Object.keys(FIGURES))("renders an accessible, finite SVG: %s", (id) => {
    const html = renderFigure(id);
    expect(html).toMatch(/^<figure class="lesson-figure"/);
    expect(html).toMatch(/<svg class="figure-svg" viewBox="0 0 \d+ \d+"/);
    expect(html).toMatch(/role="img" aria-label="[^"]{80,}"/);
    expect(html).not.toMatch(/NaN|undefined|Infinity/);
    expect(FIGURES[id].caption.length).toBeGreaterThan(40);
  });

  it("uses every figure in a lesson and labels schematic drawings", () => {
    const used = new Set(LESSONS.flatMap((l) => l.figures));
    expect([...used].sort()).toEqual(Object.keys(FIGURES).sort());
    for (const id of ["fabrikhalle", "buendnisse", "versailles-karte", "modellstadt", "stadtviertel", "mietskaserne"])
      expect(FIGURES[id].caption).toMatch(/Schema|schematisch|Erfunden|erfunden|Vereinfacht/i);
    expect(renderFigure("missing")).toBe("");
  });

  it("draws the sector bars with the LeMO shares and in proportion", () => {
    expect(SECTOR_SHARES).toEqual({
      1871: { agrar: 50, industrie: 29 },
      1907: { agrar: 34, industrie: 40 },
    });
    const svg = renderFigure("sektoren");
    const widths = [...svg.matchAll(/<rect class="sec-agrar"[^>]*width="([\d.]+)"/g)].map((m) => Number(m[1]));
    expect(widths[0] / widths[2 - 1]).toBeCloseTo(50 / 34, 2);
    const findLessonText = learnerText(findLesson("agrar-industrie")!);
    expect(findLessonText).toContain("rund die Hälfte");
  });

  it("starts the model town in 1850 and offers each year once, matching the workshop order", () => {
    const html = renderFigure("modellstadt");
    expect(html).toContain('data-town="1850"');
    expect([...html.matchAll(/data-town-year="(\d+)"/g)].map((m) => Number(m[1]))).toEqual([...TOWN_YEARS]);
    expect(html).toMatch(/data-town-year="1850" aria-pressed="true"/);
    expect((html.match(/aria-pressed="true"/g) ?? []).length).toBe(1);
    // Only the 1850 text is visible at the start.
    expect([...html.matchAll(/<span data-news="(\d+)"( hidden)?>/g)].map((m) => [m[1], Boolean(m[2])])).toEqual([
      ["1850", false],
      ["1870", true],
      ["1890", true],
      ["1910", true],
    ]);
    for (const layer of ["from-1870", "from-1890", "from-1910", "until-1870"]) expect(html).toContain(`class="${layer}"`);
    const steps = findLesson("stadtwachstum")!.workshop.entries.map((e) => e.feedback);
    for (const year of TOWN_YEARS) expect(steps.some((f) => f.startsWith(`${year}:`))).toBe(true);
    expect(Object.keys(TOWN_NEWS).map(Number)).toEqual([...TOWN_YEARS]);
  });

  it("names every territorial loss of the Versailles lesson in the diagram", () => {
    const text = learnerText(findLesson("versailles")!);
    for (const [, , region] of VERSAILLES_LOSSES)
      for (const part of region.split(", ")) expect(text).toContain(part);
    expect(renderFigure("versailles-karte")).toContain("Alle Kolonien");
  });
});

describe("interactive workshops", () => {
  it.each(LESSONS)(
    "is solvable, not solved at the start and rejects wrong input: $id",
    (l) => {
      const work = l.workshop;
      const right =
        work.kind === "timeline"
          ? work.entries.map((_, i) => i)
          : work.entries.map((e) => e.target);
      expect(checkWorkshop(work, right).every(Boolean)).toBe(true);
      for (const wrong of [[], right.map(() => -1), right.map(() => 999), [...right, 0]])
        expect(checkWorkshop(work, wrong).every(Boolean)).toBe(false);
      expect(work.entries.length).toBeGreaterThanOrEqual(5);
      if (work.kind === "timeline") {
        expect(work.categories).toEqual([]);
        expect(checkWorkshop(work, right.map(() => 0)).every(Boolean)).toBe(false);
        for (let seed = 0; seed < 20; seed++) {
          const order = initialOrder(work, `${l.id}:${seed}`);
          expect([...order].sort((a, b) => a - b)).toEqual(right);
          expect(checkWorkshop(work, order).every(Boolean)).toBe(false);
        }
        expect(checkWorkshop(work, initialOrder(work, l.id)).every(Boolean)).toBe(false);
        // The texts themselves carry no year, so ordering needs understanding.
        for (const e of work.entries) expect(e.text).not.toMatch(/\b1[89]\d\d\b/);
      } else {
        expect(work.categories.length).toBeGreaterThanOrEqual(2);
        // Every category is needed, so guessing one answer for all fails.
        expect(new Set(right).size).toBe(work.categories.length);
        for (let c = 0; c < work.categories.length; c++)
          expect(checkWorkshop(work, right.map(() => c)).every(Boolean)).toBe(false);
      }
    },
  );

  it("moves timeline entries without mutating or dropping data", () => {
    const order = [2, 0, 1];
    expect(moveEntry(order, 0, 1)).toEqual([0, 2, 1]);
    expect(moveEntry(order, 0, -1)).toEqual(order);
    expect(order).toEqual([2, 0, 1]);
    expect(shuffle([0, 1, 2], "seed")).toEqual(shuffle([0, 1, 2], "seed"));
  });

  it("requires a draft and all criteria; Level 2 alone does not complete a lesson", () => {
    expect(canReviewDraft("   ")).toBe(false);
    expect(canAcceptSelfAssessment("Ein ausführlicher eigener Gedankengang.", [true, true, false])).toBe(false);
    expect(canAcceptSelfAssessment("Ein ausführlicher eigener Gedankengang.", [true, true, true])).toBe(true);
    const p = freshProgress(),
      id = p.activeLessonId;
    p.quizDone.push(id);
    p.workshopDone.push(id);
    p.writingDone.push(writingKey(id, 2));
    expect(isComplete(p, id)).toBe(false);
    p.writingDone.push(writingKey(id, 1));
    expect(completion(p)).toEqual({ completed: 1, total: 13, percent: 8 });
  });

  it("counts lessons per Zweig: M7 lessons count only in the M-Zug", () => {
    const p = freshProgress();
    for (const id of M_ONLY) {
      p.quizDone.push(id);
      p.workshopDone.push(id);
      p.drafts[writingKey(id, 1)] = "Eine eigene begründete Antwort zum Vergleich.";
      p.writingDone.push(writingKey(id, 1));
    }
    expect(completion(p)).toEqual({ completed: 0, total: 13, percent: 0 });
    p.track = "M";
    expect(completion(p)).toEqual({ completed: 2, total: 15, percent: 13 });
  });
});

describe("offline progress and links", () => {
  it("uses its own storage key on the shared Academy origin", () => {
    expect(STORAGE_KEY).toBe("politik_ms7_academy_progress_v1");
  });
  it.each([null, "null", "[]", "42", "invalid json"])(
    "recovers from invalid storage: %s",
    (raw) => expect(parseProgress(raw)).toEqual(freshProgress()),
  );
  it("round trips independent drafts and the Zweig, and filters malformed storage", () => {
    const p = freshProgress(),
      key = writingKey(p.activeLessonId, 1);
    p.drafts[key] = "Eine begründete und selbst geschriebene Antwort.";
    p.writingDone.push(key);
    p.track = "M";
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
    const parsed = parseProgress(
      JSON.stringify({
        activeLessonId: "bad",
        track: "X",
        quizDone: [p.activeLessonId, p.activeLessonId, "bad"],
        writingDone: [key],
        drafts: { [key]: "short", bad: "wrong" },
      }),
    );
    expect(parsed.track).toBe("R");
    expect(parsed.quizDone).toEqual([p.activeLessonId]);
    expect(parsed.writingDone).toEqual([]);
    expect(parsed.drafts).toEqual({ [key]: "short" });
    expect(parseProgress(JSON.stringify({ drafts: { [key]: "a".repeat(9000) } })).drafts[key]).toHaveLength(8000);
  });
  it("survives blocked storage and escapes entered text", async () => {
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
      expect(await saveProgress(freshProgress())).toBe(false);
    } finally {
      vi.unstubAllGlobals();
    }
    expect(esc('<img src=x onerror="x">')).toBe("&lt;img src=x onerror=&quot;x&quot;&gt;");
  });
  it("resolves every cited lesson and rejects unsafe or invalid links", () => {
    expect(ZAM_ACADEMY_APP_URL).toBe("https://academy.zam-os.org/politik-mittelschule-7/");
    for (const l of LESSONS)
      expect(parseTrainingDeepLink(`#lesson=${l.id}&level=2`)).toEqual({ lessonId: l.id, level: 2 });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
    expect(parseTrainingDeepLink("#lesson=versailles&level=2", "?lesson=fabrik&level=1")).toEqual({
      lessonId: "versailles",
      level: 2,
    });
  });
});

describe("independent cell and pinned contract", () => {
  it("keeps the empty legacy inventory unapproved and proposal-only", () => {
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    expect(mapping.sources).toEqual([]);
    expect(mapping.rows).toEqual([]);
    expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);
  });

  it("binds 45 concise cards to real lessons, Mittelschule grade 7, GPG LB 3 and each lesson's Zweige", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(items).toHaveLength(45);
    expect(cell.atoms.map((a) => a.slug)).toEqual(LESSONS.map((l) => l.id));
    expect(cell.sources.map((s) => s.uri)).toEqual(SOURCES.map((s) => s.url));
    for (const l of LESSONS) {
      const a = cell.atoms.find((a) => a.slug === l.id)!;
      expect(a.source_link).toBe(lessonLink(l.id));
      expect(a.title).toBe(l.title);
      const bindings = a.curricula.filter((b) => b.provider === "lehrplanplus-bayern");
      expect(bindings.map((b) => b.track)).toEqual(l.tracks);
      for (const b of bindings)
        expect(b).toMatchObject({
          school_type: "mittelschule",
          grade: 7,
          subject: "gpg",
          topic_code: "lb3",
          topic_title: "Politik und Gesellschaft",
          exam_relevant: true,
        });
      expect(a.curricula.find((b) => b.provider === "zam-academy")).toMatchObject({
        topic_code: `stage${l.stage}`,
        topic_title: STAGES[l.stage - 1].title,
      });
      expect(a.practice_items).toHaveLength(3);
      const [check, fact, recall] = a.practice_items;
      for (const fast of [check, fact]) {
        expect(fast.tier).toBe("tier1_fast");
        expect(fast.fast_check!.options).toHaveLength(2);
        expect(fast.fast_check!.correct_index).toBe(0);
        expect(fast.fast_check!.options[0]).toBe(fast.concept);
        expect(fast.fast_check!.options[1]).not.toBe(fast.concept);
      }
      expect(check.fast_check!.options[0]).toBe(l.quiz.answer);
      expect(l.quiz.wrong).toContain(check.fast_check!.options[1]);
      expect(fact.question).not.toBe(check.question);
      expect(recall.tier).toBe("tier2_synthesis");
      expect(recall.question).not.toBe(l.quiz.question);
      expect(recall.concept.length).toBeLessThan(190);
      expect(recall.sample_solution).toBe(recall.concept);
      for (const i of a.practice_items) {
        expect(i.source_link).toBe(lessonLink(l.id));
        expect(i.language).toBe("de");
        expect(i.concept).not.toMatch(/\d\.\d/);
        expect(i.question.length).toBeGreaterThan(15);
      }
    }
  });

  it("links prerequisites to earlier lessons only", () => {
    const order = cell.atoms.map((a) => a.id);
    let linked = 0;
    for (const [i, a] of cell.atoms.entries())
      for (const pre of a.prerequisites as Array<{ atom_id: string; type: string; rationale: string }>) {
        expect(order.indexOf(pre.atom_id)).toBeGreaterThanOrEqual(0);
        expect(order.indexOf(pre.atom_id)).toBeLessThan(i);
        expect(pre.type).toBe("soft");
        expect(pre.rationale.length).toBeGreaterThan(30);
        linked++;
      }
    expect(linked).toBe(13);
  });

  it("pins ids and anchors and introduces no history transfer", () => {
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        lesson: a.source_link,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    const ids = [...cell.atoms, ...items].map((x) => x.id);
    expect(new Set(ids).size).toBe(60);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
  });
});
