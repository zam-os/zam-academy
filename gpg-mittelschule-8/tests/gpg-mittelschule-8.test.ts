import { describe, expect, it, vi } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import {
  CORE_LESSONS,
  findLesson,
  LESSONS,
  lessonsForTrack,
  SOURCES,
  STAGES,
} from "../src/curriculum";
import { FIGURES, renderFigure } from "../src/figures";
import { GERMANY_ZONE_MARKERS, NORTH_AMERICA_MARKERS } from "../src/figures/maps";
import {
  bindLab,
  ENERGY_MIX_DEFAULT,
  evaluateEnergyMix,
  evaluateFarmCosts,
  evaluateHousehold,
  evaluateLegislation,
  evaluatePension,
  evaluateTurnout,
  FARM_COST_DEFAULT,
  fmt,
  HOUSEHOLD_DEFAULT,
  LEGISLATION_DEFAULT,
  PENSION_DEFAULT,
  renderLab,
  TURNOUT_DEFAULT,
} from "../src/labs";
import type { LabId } from "../src/model/types";
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

describe("GPG 8 curriculum and teaching material", () => {
  it("covers the four Lernbereiche of the Fachlehrplan in 32 lessons (31 R, 32 M)", () => {
    expect(LESSONS).toHaveLength(32);
    expect(CORE_LESSONS).toBe(LESSONS);
    expect(lessonsForTrack("R")).toHaveLength(31);
    expect(lessonsForTrack("M")).toHaveLength(32);
    expect(STAGES.map((s) => s.lb)).toEqual([1, 2, 3, 4]);
    expect(STAGES.map((s) => s.title)).toEqual([
      "Lebensraum Erde",
      "Zeit und Wandel",
      "Politik und Gesellschaft",
      "Lebenswelt",
    ]);
    expect(
      STAGES.map((s) => LESSONS.filter((l) => l.lb === s.lb).length),
    ).toEqual([7, 10, 7, 8]);
    expect(new Set(LESSONS.map((l) => l.id)).size).toBe(32);
  });

  it("traces all 41 verbatim R/M expectations and every lesson to the official pages", () => {
    expect(coverage.curriculum_r).toBe(
      "https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/gpg/regelklasse",
    );
    expect(coverage.curriculum_m).toBe(
      "https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/gpg/mittlere-reife-klasse",
    );
    expect(coverage.curriculum_r_sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(coverage.curriculum_m_sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(coverage.rows).toHaveLength(41);
    expect(coverage.rows.filter((r) => r.track === "R")).toHaveLength(20);
    expect(coverage.rows.filter((r) => r.track === "M")).toHaveLength(21);
    for (const r of coverage.rows) {
      expect(r.lessons.length).toBeGreaterThan(0);
      for (const id of r.lessons) {
        const lesson = findLesson(id);
        expect(lesson?.lb).toBe(r.lb);
        expect(lesson?.tracks).toContain(r.track);
      }
      expect(["implemented", "supported"]).toContain(r.status);
      expect(r.evidence.length).toBeGreaterThan(40);
    }
    const cited = new Set(coverage.rows.flatMap((r) => r.lessons));
    expect(LESSONS.filter((l) => !cited.has(l.id))).toEqual([]);
  });

  it.each(LESSONS)(
    "provides explanation, checks, a figure and two distinct tasks: $id",
    (l) => {
      expect(l.id).toMatch(/^gpg8-[a-z0-9-]+$/);
      expect(l.tracks.length).toBeGreaterThan(0);
      expect(l.lehrplan).toContain("GPG8 LB");
      expect(l.paragraphs).toHaveLength(2);
      expect(l.paragraphs.join(" ").length).toBeGreaterThan(300);
      expect(l.takeaway.length).toBeGreaterThan(40);
      expect(new Set([l.quiz.answer, ...l.quiz.wrong]).size).toBe(3);
      expect(l.quiz.explanation.length).toBeGreaterThan(35);
      expect(l.sourceIds[0]).toBe(l.tracks.includes("R") ? "lehrplan" : "lehrplan-m");
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
    expect(text).not.toMatch(/\d\.\d/);
    expect(text).not.toMatch(/(^|[\s(])-\d/);
    expect(text).not.toMatch(/\d(km|m|cm|Prozent|%|€|°C|kWh|ha|kg|g|ct)\b/);
    expect(text).not.toMatch(/\b(Ihr Ergebnis|Sie sollen|Ihre Antwort)\b/);
  });

  it("checks core historical dates and curriculum distinctions", () => {
    const all = LESSONS.map(learnerText).join("\n");
    expect(all).toContain("30. Januar 1933");
    expect(all).toContain("24. März 1933");
    expect(all).toContain("1. September 1939");
    expect(all).toContain("8. Mai 1945");
    expect(all).toContain("20. Juli 1944");
    expect(all).toContain("Dietrich Bonhoeffer");
    expect(all).toContain("Pater Rupert Mayer");
    expect(all).toContain("Legitimität");
    expect(all).toContain("Allgemeinwohl");
    expect(findLesson("gpg8-oekolandbau-kosten")?.tracks).toEqual(["M"]);
  });
});

describe("figures and maps", () => {
  it.each(Object.keys(FIGURES))("renders an accessible, finite SVG: %s", (id) => {
    const html = renderFigure(id);
    expect(html).toMatch(/^<figure class="lesson-figure"/);
    expect(html).toMatch(/<svg class="figure-svg" viewBox="0 0 \d+ \d+"/);
    expect(html).toMatch(/role="img" aria-label="[^"]{35,}"/);
    expect(html).not.toMatch(/NaN|undefined|Infinity/);
    expect(FIGURES[id].caption.length).toBeGreaterThan(20);
  });

  it("uses every figure in a lesson and keeps simplified drawings labelled", () => {
    const used = new Set(LESSONS.flatMap((l) => l.figures));
    expect([...used].sort()).toEqual(Object.keys(FIGURES).sort());
    for (const id of [
      "nordamerika-klima",
      "krieg-europa-1942",
      "besatzungszonen-1945",
      "weimar-verfassung",
      "energie-verbund",
    ])
      expect(FIGURES[id].caption).toMatch(/vereinfacht|Skizze/i);
    expect(renderFigure("missing")).toBe("");
  });

  it("numbers map markers to match the workshops that ask for them", () => {
    const na = findLesson("gpg8-nordamerika-orientierung")!.workshop;
    expect(na.entries.map((e) => e.text)).toEqual(
      NORTH_AMERICA_MARKERS.map(([, , n]) => `Nummer ${n}`),
    );
    const deu = findLesson("gpg8-potsdam-teilung")!.workshop;
    expect(deu.entries.map((e) => e.text.split(" (")[0])).toEqual(
      GERMANY_ZONE_MARKERS.map(([, , n]) => `Nummer ${n}`),
    );
  });
});

describe("interactive labs and workshops", () => {
  it("formats German numbers with comma and true minus sign", () => {
    expect(fmt(-360, 0)).toBe("−360");
    expect(fmt(12.34, 1)).toBe("12,3");
    expect(fmt(-0, 1)).toBe("0");
  });

  it("has six labs with 0 goals met at start and finite readouts on grids", () => {
    const labIds: LabId[] = [
      "energiemix",
      "haushalt-energie",
      "gesetzgebung",
      "wahlbeteiligung",
      "generationenvertrag",
      "oekolandbau-kosten",
    ];
    expect(LESSONS.filter((l) => l.labId).map((l) => l.labId)).toEqual(labIds);
    for (const id of labIds) {
      const html = renderLab(id);
      expect(html).toContain('class="figure-svg lab-svg"');
      expect(html).not.toMatch(/NaN|undefined|Infinity/);
    }
    expect(evaluateEnergyMix(ENERGY_MIX_DEFAULT).goals.some((g) => g.met)).toBe(false);
    expect(evaluateHousehold(HOUSEHOLD_DEFAULT).goals.some((g) => g.met)).toBe(false);
    expect(evaluateLegislation(LEGISLATION_DEFAULT).goals.some((g) => g.met)).toBe(false);
    expect(evaluateTurnout(TURNOUT_DEFAULT).goals.some((g) => g.met)).toBe(false);
    expect(evaluatePension(PENSION_DEFAULT).goals.some((g) => g.met)).toBe(false);
    expect(evaluateFarmCosts(FARM_COST_DEFAULT).goals.some((g) => g.met)).toBe(false);
    expect(typeof bindLab).toBe("function");
  });

  it("proves every goal in every lab reachable by explicit witnesses and finite across grids", () => {
    // 1. EnergyMix
    for (const w of [0, 30, 60])
      for (const s of [0, 20, 40])
        for (const h of [0, 10])
          for (const g of [0, 20, 40]) {
            const res = evaluateEnergyMix({ wind: w, solar: s, hydro: h, gas: g });
            expect(Number.isFinite(res.co2)).toBe(true);
            expect(Number.isFinite(res.renewable)).toBe(true);
          }
    expect(evaluateEnergyMix({ wind: 45, solar: 25, hydro: 10, gas: 20 }).goals.every((g) => g.met)).toBe(true);

    // 2. Household
    for (const temp of [18, 20, 22, 23])
      for (const shower of [4, 8, 12])
        for (const led of [false, true])
          for (const efficiency of [false, true]) {
            const res = evaluateHousehold({ temp, shower, led, efficiency });
            expect(Number.isFinite(res.total)).toBe(true);
            expect(Number.isFinite(res.savingsPct)).toBe(true);
          }
    expect(evaluateHousehold({ temp: 19, shower: 6, led: true, efficiency: true }).goals.every((g) => g.met)).toBe(true);

    // 3. Legislation witnesses per goal
    expect(evaluateLegislation({ lawType: "zustimmung", btVotes: "simple", brStance: "agree", committee: false }).goals[0].met).toBe(true);
    expect(evaluateLegislation({ lawType: "einspruch", btVotes: "absolute", brStance: "object", committee: false }).goals[1].met).toBe(true);
    expect(evaluateLegislation({ lawType: "zustimmung", btVotes: "simple", brStance: "object", committee: true }).goals[2].met).toBe(true);

    // 4. Turnout witnesses
    for (const y of [20, 50, 80])
      for (const m of [30, 60, 90])
        for (const s of [30, 60, 90]) {
          const res = evaluateTurnout({ young: y, middle: m, senior: s });
          expect(Number.isFinite(res.overallTurnout)).toBe(true);
          expect(Number.isFinite(res.shareYoung)).toBe(true);
        }
    expect(evaluateTurnout({ young: 85, middle: 70, senior: 75 }).goals[0].met).toBe(true);
    expect(evaluateTurnout({ young: 85, middle: 70, senior: 75 }).goals[1].met).toBe(true);
    expect(evaluateTurnout({ young: 35, middle: 50, senior: 60 }).goals[2].met).toBe(true);

    // 5. Pension witnesses
    for (const contributors of [1.5, 2.5, 4.0, 6.0])
      for (const rate of [14, 18, 24])
        for (const level of [40, 48, 55]) {
          const res = evaluatePension({ contributors, rate, level });
          expect(Number.isFinite(res.balance)).toBe(true);
          expect(Number.isFinite(res.coveredLevel)).toBe(true);
        }
    expect(evaluatePension({ contributors: 4.0, rate: 18, level: 48 }).goals[0].met).toBe(true);
    expect(evaluatePension({ contributors: 2.0, rate: 24, level: 48 }).goals[1].met).toBe(true);
    expect(evaluatePension({ contributors: 1.5, rate: 18, level: 48 }).goals[2].met).toBe(true);

    // 6. Farm costs witnesses
    for (const mode of ["konventionell", "oeko"] as const)
      for (const wage of [14, 18, 22])
        for (const yieldPct of [80, 100, 120])
          for (const directSale of [false, true]) {
            const res = evaluateFarmCosts({ mode, wage, yieldPct, directSale });
            expect(Number.isFinite(res.active.ctPerKg)).toBe(true);
          }
    expect(evaluateFarmCosts({ mode: "oeko", wage: 16, yieldPct: 100, directSale: false }).goals[0].met).toBe(true);
    expect(evaluateFarmCosts({ mode: "oeko", wage: 16, yieldPct: 80, directSale: false }).goals[1].met).toBe(true);
    expect(evaluateFarmCosts({ mode: "oeko", wage: 22, yieldPct: 100, directSale: true }).goals[2].met).toBe(true);
  });

  it.each(LESSONS)(
    "workshop is solvable, not solved at start and rejects wrong input: $id",
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
      } else {
        expect(work.categories.length).toBeGreaterThanOrEqual(2);
        expect(new Set(right).size).toBe(work.categories.length);
        for (let c = 0; c < work.categories.length; c++)
          expect(checkWorkshop(work, right.map(() => c)).every(Boolean)).toBe(false);
      }
    },
  );

  it("moves timeline entries and handles writing completion per track", () => {
    const order = [2, 0, 1];
    expect(moveEntry(order, 0, 1)).toEqual([0, 2, 1]);
    expect(moveEntry(order, 0, -1)).toEqual(order);
    expect(shuffle([0, 1, 2], "seed")).toEqual(shuffle([0, 1, 2], "seed"));
    expect(canReviewDraft("   ")).toBe(false);
    expect(canAcceptSelfAssessment("Ein ausführlicher Gedankengang.", [true, true, false])).toBe(false);
    expect(canAcceptSelfAssessment("Ein ausführlicher Gedankengang.", [true, true, true])).toBe(true);
    const p = freshProgress(),
      id = p.activeLessonId;
    p.quizDone.push(id);
    p.workshopDone.push(id);
    p.writingDone.push(writingKey(id, 2));
    expect(isComplete(p, id)).toBe(false);
    p.writingDone.push(writingKey(id, 1));
    expect(completion(p)).toEqual({ completed: 1, total: 32, percent: 3 });
    p.track = "R";
    expect(completion(p)).toEqual({ completed: 1, total: 31, percent: 3 });
  });
});

describe("offline progress and links", () => {
  it("uses its own storage key on the shared Academy origin", () => {
    expect(STORAGE_KEY).toBe("gpg_ms8_academy_progress_v1");
  });
  it.each([null, "null", "[]", "42", "invalid json"])(
    "recovers from invalid storage: %s",
    (raw) => expect(parseProgress(raw)).toEqual(freshProgress()),
  );
  it("survives blocked storage and resolves deep links", async () => {
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
    expect(ZAM_ACADEMY_APP_URL).toBe(
      "https://academy.zam-os.org/gpg-mittelschule-8/",
    );
    for (const l of LESSONS)
      expect(parseTrainingDeepLink(`#lesson=${l.id}&level=2`)).toEqual({
        lessonId: l.id,
        level: 2,
      });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E&level=3")).toEqual({});
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

  it("binds 64 concise cards to real lessons, Mittelschule grade 8 and GPG R/M tracks", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(items).toHaveLength(64);
    expect(cell.atoms.map((a) => a.slug)).toEqual(LESSONS.map((l) => l.id));
    for (const l of LESSONS) {
      const a = cell.atoms.find((a) => a.slug === l.id)!;
      expect(a.source_link).toBe(lessonLink(l.id));
      expect(a.title).toBe(l.title);
      const lppBindings = a.curricula.filter(
        (b) => b.provider === "lehrplanplus-bayern",
      );
      expect(lppBindings.map((b) => b.track)).toEqual(l.tracks);
      for (const b of lppBindings) {
        expect(b).toMatchObject({
          school_type: "mittelschule",
          grade: 8,
          subject: "gpg",
          topic_code: `lb${l.lb}`,
          topic_title: STAGES.find((s) => s.lb === l.lb)!.title,
          exam_relevant: true,
        });
      }
      expect(a.practice_items).toHaveLength(2);
      const [fast, recall] = a.practice_items;
      expect(fast.tier).toBe("tier1_fast");
      expect(fast.fast_check!.options).toHaveLength(2);
      expect(fast.fast_check!.correct_index).toBe(0);
      expect(fast.fast_check!.options[0]).toBe(l.quiz.answer);
      expect(l.quiz.wrong).toContain(fast.fast_check!.options[1]);
      expect(fast.choice_distractors).toHaveLength(2);
      expect(recall.tier).toBe("tier2_synthesis");
      expect(recall.question).not.toBe(l.quiz.question);
      expect(recall.question.length).toBeGreaterThan(15);
      expect(recall.concept.length).toBeLessThan(190);
      expect(recall.sample_solution).toBe(recall.concept);
      expect(recall.choice_distractors).toHaveLength(2);
      for (const i of a.practice_items) {
        expect(i.source_link).toBe(lessonLink(l.id));
        expect(i.language).toBe("de");
        expect(i.concept).not.toMatch(/\d\.\d/);
      }
    }
  });

  it("links prerequisites strictly to earlier atoms and pins ULIDs", () => {
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
    expect(linked).toBeGreaterThanOrEqual(20);
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        lesson: a.source_link,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    const ids = [...cell.atoms, ...items].map((x) => x.id);
    expect(new Set(ids).size).toBe(96);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
    expect(JSON.stringify(cell)).not.toMatch(/"replaces"|"retired_items"/);
  });
});
