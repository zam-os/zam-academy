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
import { FIGURES, renderFigure } from "../src/figures";
import {
  BAVARIA_CITIES,
  CONTINENT_MARKERS,
  MAPS,
  ROME_MARKERS,
} from "../src/figures/maps";
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
    ...l.workshop.categories,
    ...l.workshop.entries.flatMap((e) => [e.text, e.feedback]),
    l.workshop.conclusion,
    ...Object.values(l.tasks).flatMap((t) => [
      t.prompt,
      t.model,
      ...t.hints,
      ...t.criteria,
    ]),
  ].join("\n");

describe("GPG 5 curriculum and teaching material", () => {
  it("covers the four Lernbereiche of the Fachlehrplan in 34 lessons", () => {
    expect(LESSONS).toHaveLength(34);
    expect(CORE_LESSONS).toBe(LESSONS);
    expect(STAGES.map((s) => s.lb)).toEqual([1, 2, 3, 4]);
    expect(STAGES.map((s) => s.title)).toEqual([
      "Lebensraum Erde",
      "Zeit und Wandel",
      "Politik und Gesellschaft",
      "Lebenswelt",
    ]);
    expect(
      STAGES.map((s) => LESSONS.filter((l) => l.lb === s.lb).length),
    ).toEqual([11, 10, 5, 8]);
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(34);
  });

  it("traces all 15 verbatim expectations and every lesson to the official page", () => {
    expect(coverage.curriculum).toBe(
      "https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/gpg",
    );
    expect(coverage.curriculum_sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(coverage.rows).toHaveLength(15);
    expect(
      [1, 2, 3, 4].map((lb) => coverage.rows.filter((r) => r.lb === lb).length),
    ).toEqual([5, 4, 2, 4]);
    for (const r of coverage.rows) {
      expect(r.lessons.length).toBeGreaterThan(0);
      for (const id of r.lessons) expect(findLesson(id)?.lb).toBe(r.lb);
      expect(["implemented", "supported"]).toContain(r.status);
      expect(r.evidence.length).toBeGreaterThan(60);
      expect(r.additional.length).toBeGreaterThan(25);
    }
    const cited = new Set(coverage.rows.flatMap((r) => r.lessons));
    expect(
      LESSONS.filter(
        (l) =>
          !cited.has(l.id) &&
          !(coverage.optional_lessons as string[]).includes(l.id),
      ),
    ).toEqual([]);
    // Behaviour in real groups cannot happen in an app; these rows are not claimed.
    expect(
      coverage.rows.filter((r) => r.status === "supported").map((r) => [r.lb, r.position]),
    ).toEqual([
      [1, 4],
      [1, 5],
      [4, 2],
      [4, 4],
    ]);
  });

  it.each(LESSONS)(
    "provides explanation, checks, a figure and two distinct tasks: $id",
    (l) => {
      expect(l.id).toMatch(/^gpg5-[a-z0-9-]+$/);
      expect(l.paragraphs).toHaveLength(2);
      expect(l.paragraphs.join(" ").length).toBeGreaterThan(300);
      expect(l.takeaway.length).toBeGreaterThan(40);
      expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
      expect(l.quiz.explanation.length).toBeGreaterThan(35);
      expect(l.sourceIds[0]).toBe("lehrplan");
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
    // Decimal comma, no thousands point (4,6 Milliarden; 18 000 km).
    expect(text).not.toMatch(/\d\.\d/);
    // No ASCII hyphen as a minus sign before a number.
    expect(text).not.toMatch(/(^|[\s(])-\d/);
    // A space between number and unit.
    expect(text).not.toMatch(/\d(km|m|cm|Prozent)\b/);
    // Learners are addressed with "du", never with "Sie".
    expect(text).not.toMatch(/\b(Ihr Ergebnis|Sie sollen|Ihre Antwort)\b/);
  });

  it("checks the facts most likely to be mistyped", () => {
    const all = LESSONS.map(learnerText).join("\n");
    expect(all).toContain("4,6 Milliarden Jahren");
    expect(all).toContain("2962 m");
    expect(all).toContain("6650 km");
    expect(all).toContain("117 n. Chr.");
    expect(all).toContain("etwa 550 km");
    expect(all).toContain("776 v. Chr.");
    expect(all).toContain("Seit 2017");
    expect(all).toContain("Ab Jahrgangsstufe 5");
    expect(findLesson("gpg5-zeitleiste")!.tasks[2].model).toContain(
      "15 + 2025 = 2040",
    );
    expect(findLesson("gpg5-pyramide")!.paragraphs.join(" ")).toContain(
      "Modell",
    );
    expect(findLesson("gpg5-familienwandel")!.tasks[2].prompt).toContain(
      "Statistischen Bundesamts",
    );
  });
});

describe("figures and maps", () => {
  it.each(Object.keys(FIGURES))("renders an accessible, finite SVG: %s", (id) => {
    const html = renderFigure(id);
    expect(html).toMatch(/^<figure class="lesson-figure"/);
    expect(html).toMatch(/<svg class="figure-svg" viewBox="0 0 \d+ \d+"/);
    expect(html).toMatch(/role="img" aria-label="[^"]{40,}"/);
    expect(html).not.toMatch(/NaN|undefined|Infinity/);
    expect(FIGURES[id].caption.length).toBeGreaterThan(20);
  });

  it("uses every figure in a lesson and keeps simplified drawings labelled", () => {
    const used = new Set(LESSONS.flatMap((l) => l.figures));
    expect([...used].sort()).toEqual(Object.keys(FIGURES).sort());
    for (const id of ["sonnensystem", "rom-karte", "klimazonen", "landschaften-profil", "limes-karte"])
      expect(FIGURES[id].caption).toMatch(/vereinfacht|nicht maßstabsgetreu|überhöht|Skizze/i);
    expect(renderFigure("missing")).toBe("");
  });

  it("draws the farmers, not the slaves, as the widest layer of the pyramid", () => {
    const svg = renderFigure("pyramide");
    expect(svg).toContain("Bauern: die größte Gruppe");
    expect(svg).toContain("kleine Gruppe, oft Kriegsgefangene");
    const layer = (cls: string) =>
      [...svg.matchAll(new RegExp(`<path class="${cls}" d="([^"]+)"`, "g"))].flatMap(
        (m) => [...m[1].matchAll(/[ML]([\d.]+) /g)].map((x) => Number(x[1])),
      );
    const width = (xs: number[]) => Math.max(...xs) - Math.min(...xs);
    for (const upper of ["layer-1", "layer-2", "layer-3", "layer-4"])
      expect(width(layer("layer-5"))).toBeGreaterThan(width(layer(upper)));
    const slaves = svg.match(/<rect class="layer-6"[^>]*width="(\d+)"/)!;
    expect(Number(slaves[1])).toBeLessThan(width(layer("layer-5")) / 3);
    const lesson = findLesson("gpg5-pyramide")!;
    expect(lesson.quiz.answer).toBe("die Bauern");
    expect(lesson.paragraphs.join(" ")).toContain("Sklaven und Unfreie, oft Kriegsgefangene, waren eine kleine Gruppe");
  });

  it("keeps Europe in Europe: no French Guiana or Siberia in the purple area", () => {
    const europe = MAPS.world.layers.continents.find((c) => c.id === "Europe")!;
    const xs = [...europe.d.matchAll(/[ML](-?[\d.]+) /g)].map((m) => Number(m[1]));
    const lonOf = (x: number) => x / (MAPS.world.proj.k * MAPS.world.proj.c) + MAPS.world.proj.lonMin;
    expect(lonOf(Math.min(...xs))).toBeGreaterThan(-32);
    expect(lonOf(Math.max(...xs))).toBeLessThanOrEqual(60.5);
  });

  it("numbers map markers to match the workshops that ask for them", () => {
    const continents = findLesson("gpg5-kontinente")!.workshop;
    expect(continents.entries.map((e) => e.text)).toEqual(
      CONTINENT_MARKERS.map(([, , n]) => `Nummer ${n}`),
    );
    const bavaria = findLesson("gpg5-bayern")!.workshop;
    expect(bavaria.entries.map((e) => e.text)).toEqual(
      BAVARIA_CITIES.map(([, , n]) => `Nummer ${n}`),
    );
    const rome = findLesson("gpg5-rom-reich")!.workshop;
    expect(rome.entries.map((e) => e.text.split(":")[0])).toEqual(
      ROME_MARKERS.map(([, , n]) => `Nummer ${n}`),
    );
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
      for (const wrong of [
        [],
        right.map(() => -1),
        right.map(() => 999),
        [...right, 0],
      ])
        expect(checkWorkshop(work, wrong).every(Boolean)).toBe(false);
      expect(work.entries.length).toBeGreaterThanOrEqual(4);
      if (work.kind === "timeline") {
        expect(work.categories).toEqual([]);
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
        expect(checkWorkshop(work, initialOrder(work, l.id)).every(Boolean)).toBe(false);
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
    expect(completion(p)).toEqual({ completed: 1, total: 34, percent: 3 });
  });
});

describe("offline progress and links", () => {
  it("uses its own storage key on the shared Academy origin", () => {
    expect(STORAGE_KEY).toBe("gpg_ms5_academy_progress_v1");
  });
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
    expect(esc('<img src=x onerror="x">')).toBe(
      "&lt;img src=x onerror=&quot;x&quot;&gt;",
    );
  });
  it("resolves every cited lesson and rejects unsafe or invalid links", () => {
    expect(ZAM_ACADEMY_APP_URL).toBe(
      "https://academy.zam-os.org/gpg-mittelschule-5/",
    );
    for (const l of LESSONS)
      expect(parseTrainingDeepLink(`#lesson=${l.id}&level=2`)).toEqual({
        lessonId: l.id,
        level: 2,
      });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
    expect(
      parseTrainingDeepLink(
        "#lesson=gpg5-limes&level=2",
        "?lesson=gpg5-nil&level=1",
      ),
    ).toEqual({ lessonId: "gpg5-limes", level: 2 });
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

  it("binds 68 concise cards to real lessons, Mittelschule grade 5 and GPG", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(items).toHaveLength(68);
    expect(cell.atoms.map((a) => a.slug)).toEqual(LESSONS.map((l) => l.id));
    for (const l of LESSONS) {
      const a = cell.atoms.find((a) => a.slug === l.id)!;
      expect(a.source_link).toBe(lessonLink(l.id));
      expect(a.title).toBe(l.title);
      const b = a.curricula.find((b) => b.provider === "lehrplanplus-bayern")!;
      expect(b).toMatchObject({
        school_type: "mittelschule",
        grade: 5,
        subject: "gpg",
        topic_code: `lb${l.lb}`,
        topic_title: STAGES.find((s) => s.lb === l.lb)!.title,
        exam_relevant: true,
      });
      expect("track" in b).toBe(false);
      expect(a.practice_items).toHaveLength(2);
      const [fast, recall] = a.practice_items;
      expect(fast.tier).toBe("tier1_fast");
      expect(fast.fast_check!.options).toHaveLength(2);
      expect(fast.fast_check!.correct_index).toBe(0);
      expect(fast.fast_check!.options[0]).toBe(l.quiz.answer);
      expect(l.quiz.wrong).toContain(fast.fast_check!.options[1]);
      expect(recall.tier).toBe("tier2_synthesis");
      expect(recall.question).not.toBe(l.quiz.question);
      expect(recall.question.length).toBeGreaterThan(15);
      expect(recall.concept.length).toBeLessThan(190);
      expect(recall.sample_solution).toBe(recall.concept);
      for (const i of a.practice_items) {
        expect(i.source_link).toBe(lessonLink(l.id));
        expect(i.language).toBe("de");
        expect(i.concept).not.toMatch(/\d\.\d/);
      }
    }
  });

  it("links prerequisites to earlier lessons and keeps fast checks answerable", () => {
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
    expect(linked).toBeGreaterThanOrEqual(14);
    // A fast check that only works with the options in view names them.
    for (const a of cell.atoms) {
      const fast = a.practice_items[0];
      if (/^(Was war früher\?|Welche Regel|Welcher Satz|Was ist für die Umwelt)/.test(fast.question))
        for (const option of fast.fast_check!.options) expect(fast.question).toContain(option);
    }
    for (const slug of ["gpg5-zeitleiste", "gpg5-regeln", "gpg5-streit-loesen", "gpg5-umwelt-alltag"]) {
      const fast = cell.atoms.find((a) => a.slug === slug)!.practice_items[0];
      for (const option of fast.fast_check!.options) expect(fast.question).toContain(option);
    }
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
    expect(new Set(ids).size).toBe(102);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
  });
});
