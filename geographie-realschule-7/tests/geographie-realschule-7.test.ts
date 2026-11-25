import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import { LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { FIGURE_IDS, renderFigure } from "../src/figures";
import {
  climateFacts, dayLength, fallowYears, floodedZones, fmt, foehn, humidMonths, STATIONS,
  tsunamiMinutes, zoneForHumidMonths, type StationId,
} from "../src/figures/models";
import { DRAWN_SPECS, onLand } from "../src/figures/maps";
import { localTime } from "../src/figures/regional";
import { LABS, reachedGoals, renderLab } from "../src/labs";
import { densityPerUnit } from "../src/labs/geo7";
import { checkWorkshop } from "../src/workshop";
import { CARD_COUNT, lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import contract from "./fixtures/public-contract.json";

const SCENARIO_LABS = new Set(["jahreszeiten", "klimadiagramme", "afrika", "passat", "orient", "medina", "inselwelt", "japan-australien"]);

describe("course contract", () => {
  it("maps the six compulsory areas and every lesson to the curriculum", () => {
    expect(STAGES.map((stage) => stage.lb)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(STAGES.map((stage) => [stage.lb, stage.title, stage.hours])).toEqual(
      coverage.areas.map((area) => [area.lb, area.title, area.hours]),
    );
    expect(coverage.rows).toHaveLength(28);
    expect(coverage.optional_curriculum).toHaveLength(3);
    const lessonIds = LESSONS.map((lesson) => lesson.id);
    expect(new Set(lessonIds).size).toBe(lessonIds.length);
    expect(new Set(lessonIds)).toEqual(new Set(coverage.rows.flatMap((row) => row.lessons)));
    for (const row of coverage.rows) {
      expect(["implemented", "supported"]).toContain(row.status);
      expect(row.evidence.length).toBeGreaterThan(20);
      for (const id of row.lessons) expect(LESSONS.find((lesson) => lesson.id === id)?.lb).toBe(row.lb);
    }
    const activeLabs = LESSONS.flatMap((lesson) => lesson.lab ? [lesson.lab] : []);
    expect(new Set(activeLabs).size).toBe(activeLabs.length);
    expect(new Set(activeLabs)).toEqual(new Set(Object.keys(LABS)));
  });

  it("links only sources that exist and uses every listed source", () => {
    const used = new Set(LESSONS.flatMap((lesson) => lesson.sourceIds));
    for (const id of used) expect(SOURCES.some((source) => source.id === id)).toBe(true);
    for (const source of SOURCES) {
      expect(used.has(source.id)).toBe(true);
      expect(source.url).toMatch(/^https:\/\//);
    }
  });

  it.each(LESSONS)("$id has a visual, two checks, a solvable workshop and two distinct tasks", (lesson) => {
    expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(3);
    expect(lesson.workedExample.length).toBeGreaterThan(80);
    expect(lesson.figures).toHaveLength(1);
    const drawing = renderFigure(lesson.figures[0]);
    expect(drawing).toContain("<svg");
    expect(drawing).not.toMatch(/NaN|undefined/);
    const checks = [lesson.quiz, lesson.transferCheck];
    expect(checks[0].question).not.toBe(checks[1].question);
    for (const check of checks) {
      expect(new Set([check.answer, ...check.wrong]).size).toBe(3);
      expect(check.explanation).not.toBe("");
    }
    const learnerText = JSON.stringify({
      intro: lesson.intro, paragraphs: lesson.paragraphs,
      example: lesson.workedExample, takeaway: lesson.takeaway,
      tasks: lesson.tasks, checks, workshop: lesson.workshop,
    });
    // Decimal comma, real minus sign, "·" for multiplication.
    expect(learnerText).not.toMatch(/\d\.\d|[ (]-\d|\d\s*[×*]\s*\d/u);
    expect(lesson.workshop.entries.length).toBeGreaterThanOrEqual(3);
    expect(checkWorkshop(lesson.workshop, lesson.workshop.entries.map(({ target }) => target)).every(Boolean)).toBe(true);
    expect(checkWorkshop(lesson.workshop, lesson.workshop.entries.map(() => -1)).every(Boolean)).toBe(false);
    expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
    for (const task of Object.values(lesson.tasks)) {
      expect(task.criteria).toHaveLength(3);
      expect(task.hints).toHaveLength(2);
    }
    expect(lesson.period).toMatch(new RegExp(`^Geo7 LB ${lesson.lb} · `));
    expect(parseTrainingDeepLink(`#lesson=${lesson.id}&level=2`)).toEqual({ lessonId: lesson.id, level: 2 });
  });

  it("uses every drawing exactly once and none of them prints NaN", () => {
    const used = LESSONS.flatMap((lesson) => lesson.figures);
    expect(new Set(used).size).toBe(used.length);
    expect(new Set(used)).toEqual(new Set(FIGURE_IDS));
  });
});

describe("map labels", () => {
  it("puts every sea name on water and every land name on land", () => {
    DRAWN_SPECS.length = 0;
    for (const id of FIGURE_IDS) renderFigure(id);
    for (const lab of Object.values(LABS)) {
      lab.render(lab.initial());
      for (const scenario of ["0", "1", "2"]) lab.render({ ...lab.initial(), scenario });
    }
    const checked = new Map<string, boolean>();
    for (const spec of DRAWN_SPECS)
      for (const [text, lon, lat, cls, surface] of spec.names ?? []) {
        const expected = surface ?? (cls === "sea-label" ? "sea" : cls === "desert-label" ? "land" : undefined);
        if (!expected) continue;
        checked.set(`${spec.region} · ${text} (${lon}, ${lat}) should be ${expected}`, onLand([lon, lat]) === (expected === "land"));
      }
    expect(checked.size).toBeGreaterThan(40);
    expect([...checked].filter(([, ok]) => !ok).map(([name]) => name)).toEqual([]);
  });

  it("finds known land and sea points", () => {
    expect(onLand([11.5, 48.1])).toBe(true); // Munich
    expect(onLand([-30, 30])).toBe(false); // Atlantic
    expect(onLand([140, 36])).toBe(true); // Honshu
  });
});

describe("interactive labs", () => {
  it.each(Object.values(LABS))("$id starts without completed goals and every goal is reachable", (lab) => {
    const start = lab.initial();
    expect(reachedGoals(lab, start)).toEqual([false, false, false]);
    expect(renderLab(lab, start, [false, false, false])).not.toMatch(/NaN|undefined/);
    for (const [i, witness] of lab.witnesses.entries()) {
      expect(reachedGoals(lab, witness)[i]).toBe(true);
      const html = renderLab(lab, witness, reachedGoals(lab, witness));
      expect(html).toContain("data-lab-");
      expect(html).toContain('role="status"');
      expect(html).not.toMatch(/NaN|undefined/);
      // Readouts use the real minus sign and the decimal comma.
      const readouts = [...html.matchAll(/<p class="lab-readout[^"]*" role="status">([^<]*)/g)].map((m) => m[1]).join(" ");
      expect(readouts).not.toMatch(/\d\.\d|(^|[ (])-\d/);
    }
  });

  it.each(Object.values(LABS).filter(({ id }) => SCENARIO_LABS.has(id)))(
    "$id requires a correct answer in every view",
    (lab) => {
      for (const scenario of ["0", "1", "2"]) {
        const key = `answer-${scenario}`;
        const opened = { scenario };
        expect(reachedGoals(lab, opened)).toEqual([false, false, false]);
        expect(reachedGoals(lab, { ...opened, [key]: "1" })).toEqual([false, false, false]);
        expect(reachedGoals(lab, { ...opened, [key]: "2" })).toEqual([false, false, false]);
        expect(reachedGoals(lab, { ...opened, [key]: "0" })[Number(scenario)]).toBe(true);
      }
    },
  );

  it("sweeps every slider of the model labs without NaN", () => {
    const sweeps: Record<string, Record<string, number[]>> = {
      zeitzonen: { hour: Array.from({ length: 24 }, (_, i) => i) },
      foehn: { base: Array.from({ length: 26 }, (_, i) => 500 + i * 100) },
      feuchtmonate: { humid: Array.from({ length: 13 }, (_, i) => i) },
      wanderfeldbau: { fields: Array.from({ length: 10 }, (_, i) => i + 3) },
      tsunami: { km: Array.from({ length: 20 }, (_, i) => 100 + i * 100) },
    };
    for (const [id, sliders] of Object.entries(sweeps)) {
      const lab = LABS[id as keyof typeof LABS];
      for (const [key, values] of Object.entries(sliders))
        for (const value of values)
          expect(lab.render({ ...lab.initial(), [key]: value })).not.toMatch(/NaN|undefined/);
    }
    for (const area of [5, 10, 18]) for (const water of [5, 8, 14])
      expect(LABS.oase.render({ area, water })).not.toMatch(/NaN|undefined/);
    for (const rise of [0, 50, 100]) for (const surge of [0, 60, 120])
      expect(LABS.meeresspiegel.render({ rise, surge })).not.toMatch(/NaN|undefined/);
    for (const mountains of [40, 60, 80]) for (const reclaimed of [0, 5, 10])
      expect(LABS.raumenge.render({ mountains, reclaimed })).not.toMatch(/NaN|undefined/);
    for (const price of [40, 80, 120]) for (const branches of ["0", "1"])
      expect(LABS.staatshaushalt.render({ price, branches })).not.toMatch(/NaN|undefined/);
  });
});

describe("numbers in explanations and labs", () => {
  it("formats with the decimal comma and the real minus sign", () => {
    expect(fmt(-2.5)).toBe("−2,5");
    expect(fmt(22.5)).toBe("22,5");
  });

  it("matches the Föhn example and tasks", () => {
    expect(foehn(1500)).toMatchObject({ atBase: 5, atCrest: -2.5, lee: 22.5, gain: 7.5 });
    expect(foehn(1000)).toMatchObject({ atCrest: 0, lee: 25, gain: 10 });
    expect(foehn(2000).gain).toBe(5);
    expect(foehn(3000).gain).toBe(0);
  });

  it("matches humid months, zones and facts stated for the model stations", () => {
    const expected: Record<StationId, number> = {
      regenwald: 12, feuchtsavanne: 7, trockensavanne: 5, dornsavanne: 3, wueste: 0, japan: 12, outback: 0,
    };
    for (const [id, humid] of Object.entries(expected)) expect(humidMonths(id as StationId)).toBe(humid);
    expect(zoneForHumidMonths(humidMonths("regenwald"))).toBe("Tropischer Regenwald");
    expect(zoneForHumidMonths(humidMonths("feuchtsavanne"))).toBe("Feuchtsavanne");
    expect(zoneForHumidMonths(humidMonths("trockensavanne"))).toBe("Trockensavanne");
    expect(zoneForHumidMonths(humidMonths("dornsavanne"))).toBe("Dornsavanne");
    expect(zoneForHumidMonths(humidMonths("wueste"))).toBe("Halbwüste und Wüste");
    expect(climateFacts("feuchtsavanne").range).toBe(5);
    expect(climateFacts("outback")).toMatchObject({ range: 17, warmest: "Januar", humid: 0 });
    // Worked example of the lesson: April humid, March arid.
    expect(STATIONS.feuchtsavanne.rain[3]).toBeGreaterThan(2 * STATIONS.feuchtsavanne.temp[3]);
    expect(STATIONS.feuchtsavanne.rain[2]).toBeLessThan(2 * STATIONS.feuchtsavanne.temp[2]);
  });

  it("matches day lengths, clock times and tsunami arrival times in the lessons", () => {
    expect(Math.round(dayLength(48, "juni"))).toBe(16);
    expect(Math.round(dayLength(48, "dezember"))).toBe(8);
    expect(Math.round(dayLength(48, "maerz"))).toBe(12);
    expect(dayLength(70, "juni")).toBe(24);
    expect(dayLength(70, "dezember")).toBe(0);
    expect(localTime(14, 9)).toEqual({ hour: 22, day: 0 });
    expect(localTime(14, -5)).toEqual({ hour: 8, day: 0 });
    expect(localTime(9, 3)).toEqual({ hour: 11, day: 0 });
    expect(localTime(18, 7)).toEqual({ hour: 0, day: 1 });
    expect(localTime(2, 9)).toEqual({ hour: 10, day: 0 });
    expect(tsunamiMinutes(700)).toBe(60);
    expect(tsunamiMinutes(100)).toBe(9);
    expect(tsunamiMinutes(1400)).toBe(120);
  });

  it("matches the field, island, water, budget and density models", () => {
    expect(fallowYears(6)).toBe(10);
    expect(fallowYears(4)).toBe(6);
    expect(floodedZones(0, 60)).toBe(1);
    expect(floodedZones(30, 60)).toBe(2);
    expect(floodedZones(40, 80)).toBe(3);
    expect(LABS.oase.render({ area: 15, water: 8 })).toContain("15 · 8 = 120 Einheiten");
    expect(LABS.staatshaushalt.render({ price: 70, branches: "0" })).toContain("Es fehlen 30 Einheiten.");
    expect(LABS.staatshaushalt.render({ price: 40, branches: "1" })).toContain("40 + 60 = 100");
    expect(densityPerUnit(70, 0)).toBeCloseTo(3.33, 2);
    expect(densityPerUnit(70, 10)).toBe(2.5);
  });
});

describe("ZAM cell", () => {
  it("keeps stable IDs, lesson anchors and the curriculum scope", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(LESSONS.length);
    const idPattern = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;
    expect(cell.atoms.flatMap((atom) => atom.practice_items)).toHaveLength(CARD_COUNT);
    const ids = cell.atoms.flatMap((atom) => [atom.id, ...atom.practice_items.map((item) => item.id)]);
    expect(ids.every((id) => idPattern.test(id))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(cell.atoms.map((atom, i) => ({
      lesson: LESSONS[i].id, atom: atom.id, slug: atom.slug,
      items: atom.practice_items.map(({ id, slug }) => ({ id, slug })),
    }))).toEqual(contract);
    const atomIds = new Set(cell.atoms.map((atom) => atom.id));
    for (const [i, atom] of cell.atoms.entries()) {
      const lesson = LESSONS[i];
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(atom.curricula).toContainEqual(expect.objectContaining({
        provider: "lehrplanplus-bayern", school_type: "realschule", grade: 7,
        subject: "geographie", topic_code: `lb${lesson.lb}`,
      }));
      for (const prerequisite of atom.prerequisites) {
        expect(atomIds.has(prerequisite.atom_id)).toBe(true);
        expect(prerequisite.atom_id).not.toBe(atom.id);
      }
      const [fast, synthesis] = atom.practice_items;
      expect(fast.tier).toBe("tier1_fast");
      expect(fast.fast_check?.options).toHaveLength(2);
      expect(fast.fast_check?.correct_index).toBe(0);
      expect(fast.fast_check?.options[0]).toBe(fast.concept);
      expect(fast.fast_check?.options[1]).not.toBe(fast.concept);
      expect(synthesis.tier).toBe("tier2_synthesis");
      expect(synthesis.sample_solution).toBeTruthy();
      for (const item of atom.practice_items) {
        expect(item.source_link).toBe(atom.source_link);
        expect(JSON.stringify(item)).not.toMatch(/\d\.\d/);
      }
    }
  });

  it("asks other questions than the lesson's quick checks", () => {
    const lessonQuestions = new Set(LESSONS.flatMap((lesson) => [lesson.quiz.question, lesson.transferCheck.question]));
    const cardQuestions = cell.atoms.flatMap((atom) => atom.practice_items.map((item) => item.question));
    expect(cardQuestions.filter((question) => lessonQuestions.has(question))).toEqual([]);
  });

  it("proposes no history transfer while the mapping is unapproved", () => {
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    expect(mapping.rows).toEqual([]);
    expect(cell).not.toHaveProperty("retired_items");
    expect(JSON.stringify(cell)).not.toContain("\"replaces\"");
  });
});
