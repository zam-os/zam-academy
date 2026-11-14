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
  CONTINENT_MARKERS,
  CONURBATIONS,
  DISTRICT_SEATS,
  FARM_REGIONS,
  MAPS,
} from "../src/figures/maps";
import { LABS, reachedGoals, renderLab, settle } from "../src/labs";
import { fmt } from "../src/labs/core";
import {
  direction,
  distanceText,
  latText,
  lonText,
  profileMax,
  RAIN_VALUES,
  realMetres,
  shellAt,
} from "../src/labs/erde";
import {
  allgaeu,
  bestUse,
  gaeuboden,
  IN_CITY,
  STREET,
  waterLevel,
  WEDNESDAY,
  WEEK_TEMPS,
} from "../src/labs/raum";
import {
  completion,
  freshProgress,
  isComplete,
  labGoalKey,
  loadProgress,
  parseProgress,
  recordLabGoal,
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
  CARD_COUNT,
  lessonLink,
  parseTrainingDeepLink,
  ZAM_ACADEMY_APP_URL,
  ZAM_CELL_ID,
} from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";
import oldCell from "./fixtures/de-by-gymnasium-5-geographie-erde-gradnetz-orientierung-kvt.json";
import oldCellRaw from "./fixtures/de-by-gymnasium-5-geographie-erde-gradnetz-orientierung-kvt.json?raw";

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
const labLessons = LESSONS.filter((l) => l.lab);
/** Visible text of a lab: readout, goals, controls; SVG coordinates excluded. */
const labText = (html: string) =>
  html
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ");

describe("Geographie 5 Gymnasium: curriculum and teaching material", () => {
  it("covers the five Lernbereiche of the Fachlehrplan in 44 lessons", () => {
    expect(LESSONS).toHaveLength(44);
    expect(CORE_LESSONS).toBe(LESSONS);
    expect(STAGES.map((s) => s.title)).toEqual([
      "Geographische Arbeitstechniken",
      "Planet Erde",
      "Naturräume in Bayern und Deutschland",
      "Ländliche Räume in Bayern und Deutschland",
      "Städtische Räume in Bayern und Deutschland",
    ]);
    expect(
      STAGES.map((s) => LESSONS.filter((l) => l.lb === s.lb).length),
    ).toEqual([5, 11, 13, 6, 9]);
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(44);
    expect(labLessons).toHaveLength(13);
    expect(new Set(labLessons.map((l) => l.lab)).size).toBe(13);
  });

  it("traces all 28 verbatim expectations and every lesson to the official page", () => {
    expect(coverage.curriculum).toBe(
      "https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/geographie",
    );
    expect(coverage.curriculum_sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(coverage.rows).toHaveLength(28);
    expect(
      [1, 2, 3, 4, 5].map(
        (lb) => coverage.rows.filter((r) => r.lb === lb).length,
      ),
    ).toEqual([10, 4, 5, 4, 5]);
    for (const r of coverage.rows) {
      expect(r.lessons.length).toBeGreaterThan(0);
      for (const id of r.lessons) expect(findLesson(id)).toBeDefined();
      // Lernbereich 1 is taught across the year; every other row cites its own LB.
      if (r.lb > 1)
        expect(r.lessons.some((id) => findLesson(id)!.lb === r.lb)).toBe(true);
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
    // Real measurements, experiments, field work and presentations are not claimed.
    expect(
      coverage.rows
        .filter((r) => r.status === "supported")
        .map((r) => [r.lb, r.position]),
    ).toEqual([
      [1, 6],
      [1, 8],
      [1, 9],
      [1, 10],
      [4, 2],
      [5, 4],
      [5, 5],
    ]);
    expect(coverage.contents).toHaveLength(16);
    for (const c of coverage.contents)
      for (const id of c.lessons) expect(findLesson(id)?.lb).toBe(c.lb);
  });

  it.each(LESSONS)(
    "provides explanation, checks, a picture or lab and two distinct tasks: $id",
    (l) => {
      expect(l.id).toMatch(/^geogym5-[a-z0-9-]+$/);
      expect(l.paragraphs).toHaveLength(2);
      expect(l.paragraphs.join(" ").length).toBeGreaterThan(300);
      expect(l.takeaway.length).toBeGreaterThan(40);
      expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
      expect(l.quiz.explanation.length).toBeGreaterThan(35);
      expect(l.sourceIds[0]).toBe("lehrplan");
      for (const id of l.sourceIds)
        expect(SOURCES.find((s) => s.id === id)?.url).toMatch(/^https:\/\//);
      expect(l.figures.length + (l.lab ? 1 : 0)).toBeGreaterThan(0);
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
    // Decimal comma, no thousands point (6371 km; 320 000 cm).
    expect(text).not.toMatch(/\d\.\d/);
    // No ASCII hyphen as a minus sign before a number.
    expect(text).not.toMatch(/(^|[\s(])-\d/);
    // A space between number and unit.
    expect(text).not.toMatch(/\d(km|m|cm|mm|Prozent)\b/);
    // Learners are addressed with "du", never with "Sie".
    expect(text).not.toMatch(/\b(Ihr Ergebnis|Sie sollen|Ihre Antwort)\b/);
  });

  it("keeps the facts and calculations most likely to be mistyped", () => {
    const all = LESSONS.map(learnerText).join("\n");
    for (const fact of [
      "2962 m",
      "1456 m",
      "rund 6371 km",
      "etwa 2900 km Tiefe",
      "48° 8′ N und 11° 35′ O",
      "12 Stunden und 25 Minuten",
      "71 Landkreise und 25 kreisfreie Städte",
      "1158",
      "1970",
      "Seit 2009",
      "1 mm Niederschlag bedeutet, dass auf einen Quadratmeter 1 Liter Wasser gefallen ist",
    ])
      expect(all).toContain(fact);
    expect(findLesson("geogym5-massstab")!.paragraphs[1]).toContain(
      "6,4 cm mal 50 000 = 320 000 cm = 3200 m = 3,2 km",
    );
    expect(findLesson("geogym5-materialien")!.tasks[1].model).toContain(
      "Zusammen waren es 22 mm",
    );
    expect(RAIN_VALUES.reduce((a, b) => a + b, 0)).toBe(22);
    expect(findLesson("geogym5-wetter-messen")!.paragraphs[1]).toContain(
      "(4 + 11 + 6) : 3 = 7 °C",
    );
    expect(WEDNESDAY.reduce((a, b) => a + b, 0) / 3).toBe(WEEK_TEMPS[2]);
    expect(findLesson("geogym5-diagramm")!.tasks[1].model).toContain(
      "4 cm, 5 cm, 3,5 cm, 2,5 cm und 4,5 cm",
    );
    expect(findLesson("geogym5-kartierung")!.tasks[2].model).toContain(
      "15 von 20",
    );
    expect(findLesson("geogym5-hoehen")!.tasks[2].model).toContain(
      "200 Höhenmeter",
    );
  });
});

describe("figures and maps", () => {
  it.each(Object.keys(FIGURES))(
    "renders an accessible, finite SVG: %s",
    (id) => {
      const html = renderFigure(id);
      expect(html).toMatch(/^<figure class="lesson-figure"/);
      expect(html).toMatch(/<svg class="figure-svg" viewBox="0 0 \d+ \d+"/);
      expect(html).toMatch(/role="img" aria-label="[^"]{40,}"/);
      expect(html).not.toMatch(/NaN|undefined|Infinity/);
      expect(FIGURES[id].caption.length).toBeGreaterThan(20);
    },
  );

  it("uses every figure in a lesson and labels simplified drawings", () => {
    const used = new Set(LESSONS.flatMap((l) => l.figures));
    expect([...used].sort()).toEqual(Object.keys(FIGURES).sort());
    for (const id of Object.keys(FIGURES))
      expect(FIGURES[id].caption).toMatch(
        /vereinfacht|nicht maßstab|überhöht|Schema|schematisch|erfunden|Natural Earth|gerundet|Beispiel/i,
      );
    expect(renderFigure("missing")).toBe("");
  });

  it("keeps the trimmed map data to world, Germany and Bavaria", () => {
    expect(Object.keys(MAPS).sort()).toEqual(["bavaria", "germany", "world"]);
    expect(MAPS.germany.layers.states).toHaveLength(16);
  });

  it("numbers map markers to match the workshops that ask for them", () => {
    expect(
      findLesson("geogym5-kontinente")!.workshop.entries.map((e) => e.text),
    ).toEqual(CONTINENT_MARKERS.map(([, , n]) => `Nummer ${n}`));
    expect(
      findLesson("geogym5-agrarraeume")!.workshop.entries.map(
        (e) => e.text.split(":")[0],
      ),
    ).toEqual(FARM_REGIONS.map(([, , n]) => `Nummer ${n}`));
    expect(
      findLesson("geogym5-verdichtungsraeume")!.workshop.entries.map(
        (e) => e.text,
      ),
    ).toEqual(CONURBATIONS.map(([, , , n]) => `Nummer ${n}`));
    const seats = findLesson("geogym5-verwaltung")!.workshop;
    expect(seats.entries.map((e) => e.text)).toEqual(
      DISTRICT_SEATS.map(([, , city]) => city),
    );
    expect(seats.categories).toEqual(
      DISTRICT_SEATS.map(([, , , district]) => district),
    );
  });
});

describe("interactive labs", () => {
  it.each(labLessons)(
    "starts with no goal reached and proves each goal reachable: $id",
    (l) => {
      const lab = LABS[l.lab!];
      expect(lab.goals).toHaveLength(3);
      const start = settle(lab, lab.initial());
      expect(reachedGoals(lab, start)).toEqual([false, false, false]);
      lab.witnesses.forEach((w, i) => {
        expect(reachedGoals(lab, settle(lab, w))[i]).toBe(true);
      });
      // The three goals ask for different things: no witness reaches all three.
      expect(
        lab.witnesses.some(
          (w) => !reachedGoals(lab, settle(lab, w)).every(Boolean),
        ),
      ).toBe(true);
    },
  );

  it.each(labLessons)(
    "renders finite, accessible drawings and German numbers: $id",
    (l) => {
      const lab = LABS[l.lab!];
      for (const state of [lab.initial(), ...lab.witnesses]) {
        const html = renderLab(lab, settle(lab, state), [false, true, false]);
        expect(html).not.toMatch(/NaN|undefined|Infinity/);
        expect(html).toMatch(/class="figure-svg lab-svg" viewBox="0 0 \d+ \d+" role="img" aria-label="[^"]{40,}"/);
        const text = labText(html);
        expect(text).not.toMatch(/\d\.\d/);
        expect(text).not.toMatch(/(^|[\s(])-\d/);
        expect(text).not.toMatch(/\d(km|m|cm|mm)\b/);
      }
      expect(lab.note.length).toBeGreaterThan(40);
    },
  );

  it.each(labLessons.filter((l) => LABS[l.lab!].handles))(
    "moves every handle towards the pointer and stays put when dropped in place: $id",
    (l) => {
      const lab = LABS[l.lab!];
      const start = settle(lab, lab.initial());
      for (const h of Object.values(lab.handles!)) {
        const [x, y] = h.pos(start);
        expect(settle(lab, h.move(start, x, y))).toEqual(start);
        for (const [dx, dy] of [
          [1, 1],
          [-1, -1],
          [1, -1],
          [-1, 1],
        ]) {
          const target: [number, number] = [x + dx * 4 * h.step, y + dy * 4 * h.step];
          const moved = h.move(start, ...target);
          const [mx, my] = h.pos(moved);
          for (const v of Object.values(moved))
            if (typeof v === "number") expect(Number.isFinite(v)).toBe(true);
          const before = Math.hypot(x - target[0], y - target[1]);
          const after = Math.hypot(mx - target[0], my - target[1]);
          expect(after).toBeLessThanOrEqual(before);
        }
      }
    },
  );

  it("computes the lab models correctly", () => {
    expect(realMetres(4, 25000)).toBe(1000);
    expect(realMetres(6.4, 50000)).toBe(3200);
    expect(distanceText(realMetres(7, 1000000))).toBe("70 km");
    expect(distanceText(500)).toBe("500 m");
    expect(fmt(-3.5)).toBe("−3,5");
    expect(fmt(25000, 0)).toBe("25 000");
    expect(fmt(6371, 0)).toBe("6371");
    expect(fmt(1000000, 0)).toBe("1 000 000");
    expect(direction(440, 85).code).toBe("NO");
    expect(direction(320, 330).code).toBe("S");
    expect(direction(330, 205).code).toBe("");
    expect(latText(-34)).toBe("34° S");
    expect(lonText(0)).toBe("0° (Nullmeridian)");
    expect(profileMax(130).west).toBe(540);
    expect(profileMax(230).east).toBe(410);
    expect(shellAt(10).name).toBe("Erdkruste");
    expect(shellAt(3000).name).toBe("äußerer Erdkern");
    expect(shellAt(6371).name).toBe("innerer Erdkern");
    expect(waterLevel(0, false)).toBeCloseTo(1.5);
    expect(waterLevel(6.21, false)).toBeCloseTo(-1.5, 2);
    expect(waterLevel(0, true)).toBeCloseTo(5.5);
    expect(bestUse(8.5, 700, "loess")).toBe("Ackerbau");
    expect(bestUse(7, 1500, "lehm")).toBe("Grünland");
    expect(bestUse(6, 800, "sand")).toBe("Wald");
    expect(IN_CITY).toHaveLength(24);
    expect(STREET).toHaveLength(8);
  });

  it("states the land-use goals so the model agrees on every matching setting", () => {
    for (let temp = 5; temp <= 10; temp += 0.5)
      for (let rain = 500; rain <= 2000; rain += 50)
        for (const soil of ["sand", "lehm", "loess"] as const) {
          const s = { temp, rain, soil };
          if (gaeuboden(s)) expect(bestUse(temp, rain, soil)).toBe("Ackerbau");
          if (allgaeu(s)) expect(bestUse(temp, rain, soil)).toBe("Grünland");
        }
  });

  it("remembers found grid squares and rejects unknown painting", () => {
    const lab = LABS.planquadrat;
    let s = settle(lab, { ...lab.initial(), cell: "C3" });
    s = settle(lab, { ...s, cell: "A1" });
    expect(reachedGoals(lab, s)).toEqual([true, false, false]);
    const map = LABS.kartierung;
    const painted = settle(map, { ...map.initial(), e0: 2 });
    expect(reachedGoals(map, painted)).toEqual([false, false, false]);
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
        for (let seed = 0; seed < 20; seed++) {
          const order = initialOrder(work, `${l.id}:${seed}`);
          expect([...order].sort((a, b) => a - b)).toEqual(right);
          expect(checkWorkshop(work, order).every(Boolean)).toBe(false);
        }
        expect(
          checkWorkshop(work, initialOrder(work, l.id)).every(Boolean),
        ).toBe(false);
      } else {
        expect(work.categories.length).toBeGreaterThanOrEqual(2);
        // Every category is needed, so guessing one answer for all fails.
        expect(new Set(right).size).toBe(work.categories.length);
        for (let c = 0; c < work.categories.length; c++)
          expect(
            checkWorkshop(
              work,
              right.map(() => c),
            ).every(Boolean),
          ).toBe(false);
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

  it("requires a draft and all criteria; Level 2 and labs alone do not complete a lesson", () => {
    expect(canReviewDraft("   ")).toBe(false);
    expect(
      canAcceptSelfAssessment("Ein ausführlicher eigener Gedankengang.", [
        true,
        true,
        false,
      ]),
    ).toBe(false);
    const p = freshProgress(),
      id = "geogym5-diagramm";
    p.quizDone.push(id);
    p.workshopDone.push(id);
    p.writingDone.push(writingKey(id, 2));
    for (const g of [0, 1, 2]) recordLabGoal(p, labGoalKey(id, g));
    expect(isComplete(p, id)).toBe(false);
    p.writingDone.push(writingKey(id, 1));
    expect(completion(p)).toEqual({ completed: 1, total: 44, percent: 2 });
  });
});

describe("offline progress and links", () => {
  it("uses its own storage key on the shared Academy origin", () => {
    expect(STORAGE_KEY).toBe("geo_gym5_academy_progress_v1");
  });
  it.each([null, "null", "[]", "42", "invalid json"])(
    "recovers from invalid storage: %s",
    (raw) => expect(parseProgress(raw)).toEqual(freshProgress()),
  );
  it("round trips drafts and lab goals and filters malformed storage", () => {
    const p = freshProgress(),
      key = writingKey(p.activeLessonId, 1);
    p.drafts[key] = "Eine begründete und selbst geschriebene Antwort.";
    p.writingDone.push(key);
    expect(recordLabGoal(p, labGoalKey("geogym5-gradnetz", 1))).toBe(true);
    expect(recordLabGoal(p, labGoalKey("geogym5-gradnetz", 1))).toBe(false);
    // Lessons without a lab and goal numbers above 2 have no goals.
    expect(recordLabGoal(p, labGoalKey("geogym5-atlas", 0))).toBe(false);
    expect(recordLabGoal(p, labGoalKey("geogym5-gradnetz", 3))).toBe(false);
    expect(parseProgress(JSON.stringify(p))).toEqual(p);
    const parsed = parseProgress(
      JSON.stringify({
        activeLessonId: "bad",
        quizDone: [p.activeLessonId, p.activeLessonId, "bad"],
        writingDone: [key],
        drafts: { [key]: "short", bad: "wrong" },
        labGoals: ["geogym5-hoehen:0", "geogym5-hoehen:7", "x:0", 3],
      }),
    );
    expect(parsed.quizDone).toEqual([p.activeLessonId]);
    expect(parsed.writingDone).toEqual([]);
    expect(parsed.drafts).toEqual({ [key]: "short" });
    expect(parsed.labGoals).toEqual(["geogym5-hoehen:0"]);
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
      "https://academy.zam-os.org/geographie-gymnasium-5/",
    );
    for (const l of LESSONS)
      expect(parseTrainingDeepLink(`#lesson=${l.id}&level=2`)).toEqual({
        lessonId: l.id,
        level: 2,
      });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
  });
});

describe("cell, pinned contract and mapping proposal", () => {
  it("binds 88 concise cards to real lessons, Gymnasium grade 5 and Geographie", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(items).toHaveLength(88);
    expect(CARD_COUNT).toBe(items.length);
    expect(cell.atoms.map((a) => a.slug)).toEqual(LESSONS.map((l) => l.id));
    for (const l of LESSONS) {
      const a = cell.atoms.find((a) => a.slug === l.id)!;
      expect(a.source_link).toBe(lessonLink(l.id));
      expect(a.title).toBe(l.title);
      const b = a.curricula.find((b) => b.provider === "lehrplanplus-bayern")!;
      expect(b).toMatchObject({
        school_type: "gymnasium",
        grade: 5,
        subject: "geographie",
        topic_code: `lb${l.lb}`,
        topic_title: STAGES.find((s) => s.lb === l.lb)!.title,
        exam_relevant: true,
      });
      expect("track" in b).toBe(false);
      expect(a.practice_items).toHaveLength(2);
      const [fast, recall] = a.practice_items;
      expect(fast.tier).toBe("tier1_fast");
      expect(fast.question).toBe(l.quiz.question);
      expect(fast.fast_check!.options).toEqual([l.quiz.answer, l.quiz.wrong[0]]);
      expect(fast.fast_check!.correct_index).toBe(0);
      expect(recall.tier).toBe("tier2_synthesis");
      expect(recall.question).not.toBe(l.quiz.question);
      expect(recall.question.length).toBeGreaterThan(15);
      expect(recall.concept.length).toBeLessThan(190);
      expect(recall.sample_solution).toBe(recall.concept);
      for (const i of a.practice_items) {
        expect(i.source_link).toBe(lessonLink(l.id));
        expect(i.language).toBe("de");
        expect(`${i.question} ${i.concept}`).not.toMatch(/\d\.\d|(^|\s)-\d/);
      }
    }
  });

  it("links soft prerequisites only to earlier atoms", () => {
    const order = cell.atoms.map((a) => a.id);
    let linked = 0;
    for (const [i, a] of cell.atoms.entries())
      for (const pre of a.prerequisites as Array<{
        atom_id: string;
        type: string;
        rationale: string;
      }>) {
        expect(order.indexOf(pre.atom_id)).toBeGreaterThanOrEqual(0);
        expect(order.indexOf(pre.atom_id)).toBeLessThan(i);
        expect(pre.type).toBe("soft");
        expect(pre.rationale.length).toBeGreaterThan(30);
        linked++;
      }
    expect(linked).toBeGreaterThanOrEqual(25);
  });

  it("pins ids and anchors and transfers only the approved histories", () => {
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        lesson: a.source_link,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    const ids = [...cell.atoms, ...items].map((x) => x.id);
    expect(new Set(ids).size).toBe(132);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    expect(JSON.stringify(cell)).not.toMatch(/"retired_items"/);
    const transfers = items.flatMap((i) =>
      "replaces" in i ? [[i.slug, i.replaces]] : [],
    );
    expect(transfers).toEqual(
      mapping.rows
        .filter((r) => r.category === "A")
        .map((r) => [r.academy_slug, [r.de_by_id]]),
    );
  });

  it("maps every old item exactly once with Thomas's recorded approval", async () => {
    expect(mapping.status).toBe("approved");
    expect(mapping.approved).toBe("2026-11-14");
    expect(mapping.source).toContain("Freigabe deines Vorschlages");
    expect(mapping.source_commit).toMatch(/^[0-9a-f]{40}$/);
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(oldCellRaw),
    );
    const hex = [...new Uint8Array(digest)]
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    expect(mapping.sources).toEqual([
      expect.objectContaining({ tile_id: oldCell.tile_id, sha256: hex }),
    ]);
    const oldItems = oldCell.atoms.flatMap(
      (a) => a.practice_items as Array<{ id: string; tier: string }>,
    );
    const oldIds = oldItems.map((i) => i.id);
    expect(mapping.rows.map((r) => r.de_by_id)).toEqual(oldIds);
    expect(mapping.rows.map((r) => r.category)).toEqual([
      "A",
      "C",
      "A",
      "C",
      "C",
      "C",
      "A",
      "C",
    ]);
    const slugs = items.map((i) => i.slug);
    const successors = mapping.rows.flatMap((r) =>
      r.academy_slug ? [r.academy_slug] : [],
    );
    expect(new Set(successors).size).toBe(successors.length);
    for (const r of mapping.rows) {
      expect(r.reason.length).toBeGreaterThan(60);
      if (r.category === "A") {
        expect(r.action).toBe("replace");
        expect(slugs.filter((s) => s === r.academy_slug)).toHaveLength(1);
        const old = oldItems.find((i) => i.id === r.de_by_id)!;
        const successor = items.find((i) => i.slug === r.academy_slug)!;
        // Same atomic retrieval: both are binary fast checks.
        expect(old.tier).toBe("tier1_fast");
        expect(successor.tier).toBe("tier1_fast");
      } else {
        expect(r.academy_slug).toBeNull();
        expect(r.action).toBe("keep-active");
      }
    }
  });
});
