import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import { CORE_LESSONS, findLesson, FORMULAS, LESSONS, lessonsFor, SOURCES, STAGES } from "../src/curriculum";
import { FIGURES, renderFigure, renderStageArt, stageIcon } from "../src/figures";
import { LABS, renderResult } from "../src/labs";
import type { LabKind } from "../src/model/types";
import {
  completion,
  freshProgress,
  isComplete,
  keyOf,
  parseProgress,
  resetProgress,
  STORAGE_KEY,
} from "../src/storage/progress";
import { canAcceptSelfAssessment, checkWorkshop } from "../src/workshop";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";

interface Segment {
  type: string;
  text?: string;
  tex?: string;
  speech?: string;
}

interface Item {
  id: string;
  slug: string;
  tier: string;
  question?: string;
  question_segments?: Segment[];
  concept?: string;
  concept_segments?: Segment[];
  sample_solution?: string;
  source_link: string;
  fast_check?: { type: string; options: string[]; correct_index: number };
  choice_distractors?: unknown[];
  replaces?: string[];
}

const ITEMS = cell.atoms.flatMap((a) => a.practice_items as unknown as Item[]);
const plain = (text?: string, segments?: Segment[]) =>
  text ?? (segments ?? []).map((s) => s.text ?? s.tex ?? "").join("");
const CARD_CONCEPTS = ITEMS.map((i) => plain(i.concept, i.concept_segments));
const LEARNER_TEXT = JSON.stringify([
  LESSONS,
  ITEMS.map((i) => [i.question, i.concept, i.sample_solution, i.fast_check]),
]);

describe("public learning contract", () => {
  it("maps every Kompetenzerwartung of R8 and M8 to lessons of its Lernbereich and track", () => {
    expect(coverage.rows).toHaveLength(34);
    const rRows = coverage.rows.filter((r) => r.track === "R");
    const mRows = coverage.rows.filter((r) => r.track === "M");
    expect(rRows).toHaveLength(16);
    expect(mRows).toHaveLength(18);
    for (const lb of [1, 2, 3, 4, 5]) {
      expect(rRows.some((r) => r.lb === lb)).toBe(true);
      expect(mRows.some((r) => r.lb === lb)).toBe(true);
    }

    expect(new Set(lessonsFor("R").map((l) => l.id))).toEqual(
      new Set(rRows.flatMap((r) => r.lessons)),
    );
    expect(new Set(lessonsFor("M").map((l) => l.id))).toEqual(
      new Set(mRows.flatMap((r) => r.lessons)),
    );

    for (const row of coverage.rows) {
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(["implemented", "supported"]).toContain(row.status);
      for (const id of row.lessons) {
        const lesson = findLesson(id);
        expect(lesson?.lb).toBe(row.lb);
        expect(lesson?.tracks).toContain(row.track);
      }
    }
    expect(coverage.optional_lessons).toEqual([]);
  });

  it("pins 31 lessons (28 in R8, 29 in M8), five Lernbereiche, and the cell's ULIDs", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
    expect(CORE_LESSONS).toHaveLength(31);
    expect(lessonsFor("R")).toHaveLength(28);
    expect(lessonsFor("M")).toHaveLength(29);
    expect([1, 2, 3, 4, 5].map((lb) => lessonsFor("R").filter((l) => l.lb === lb).length)).toEqual([
      3, 10, 8, 3, 4,
    ]);
    expect([1, 2, 3, 4, 5].map((lb) => lessonsFor("M").filter((l) => l.lb === lb).length)).toEqual([
      4, 9, 8, 3, 5,
    ]);

    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug, source_link: i.source_link })),
      })),
    ).toEqual(contract.atoms);
    expect(cell.atoms).toHaveLength(LESSONS.length);
    expect(ITEMS).toHaveLength(62);
    expect(new Set(cell.atoms.flatMap((a) => [a.id, ...a.practice_items.map((i) => i.id)])).size).toBe(93);
    expect(new Set(ITEMS.map((i) => i.slug)).size).toBe(62);
  });

  it("binds each atom to its lesson, stage and exact LehrplanPLUS tracks", () => {
    const atomIds = new Set(cell.atoms.map((a) => a.id));
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice(8));
      if (!lesson) throw new Error(`Unbekannter Lektionsanker ${atom.source_link}`);
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(atom.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      const academy = atom.curricula.filter((c) => c.provider === "zam-academy");
      expect(academy).toEqual([expect.objectContaining({ subject: "wirtschaft-mittelschule-8" })]);
      const bindings = atom.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(bindings.map((b) => b.track)).toEqual(lesson.tracks);
      for (const b of bindings)
        expect(b).toMatchObject({
          school_type: "mittelschule",
          grade: 8,
          subject: "wib",
          topic_code: `lb${lesson.lb}`,
          exam_relevant: false,
        });
      for (const p of atom.prerequisites) expect(atomIds.has(p.atom_id)).toBe(true);
      expect(atom.practice_items.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps cards short, exact, in one form per field and without premature replaces", () => {
    expect((cell as { retired_items?: unknown[] }).retired_items).toBeUndefined();
    for (const item of ITEMS) {
      expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      expect(item.source_link).toMatch(
        /^https:\/\/academy\.zam-os\.org\/wirtschaft-mittelschule-8\/#lesson=[a-z0-9-]+$/,
      );
      expect(item.replaces).toBeUndefined();
      expect(item.question !== undefined).not.toBe(item.question_segments !== undefined);
      expect(item.concept !== undefined).not.toBe(item.concept_segments !== undefined);
      for (const s of [...(item.question_segments ?? []), ...(item.concept_segments ?? [])])
        if (s.type === "math") expect(s.speech?.trim().length).toBeGreaterThan(0);
      expect(plain(item.concept, item.concept_segments).length).toBeLessThan(180);
      expect(item.sample_solution?.length).toBeGreaterThan(30);
      if (item.tier === "tier1_fast") {
        expect(item.fast_check?.options).toHaveLength(2);
        expect(item.fast_check?.correct_index).toBe(0);
        expect(new Set(item.fast_check?.options).size).toBe(2);
      } else {
        expect(item.tier).toBe("tier2_synthesis");
      }
      expect(item.choice_distractors).toBeUndefined();
    }
    expect(JSON.stringify(LESSONS)).not.toContain('"practice_items"');
  });

  it("writes German learner text with the real minus sign, decimal comma and du-Ansprache", () => {
    expect(LEARNER_TEXT).not.toMatch(/(^|[\s(„"])-\d/);
    expect(LEARNER_TEXT).not.toMatch(/\d\.\d{1,2}(?!\d)/);
    expect(LEARNER_TEXT).not.toMatch(/\bSie (können|müssen|sollen)\b/);
  });

  it("has a Formelsammlung whose every rule names an existing lesson of its stage and filters cleanly for R", () => {
    expect(FORMULAS.length).toBeGreaterThanOrEqual(20);
    for (const f of FORMULAS) expect(findLesson(f.lesson)?.lb).toBe(f.lb);
    for (const lb of [1, 2, 3, 4, 5]) expect(FORMULAS.some((f) => f.lb === lb)).toBe(true);
    expect(new Set(STAGES.map((s) => s.hue)).size).toBe(STAGES.length);

    const rStages = STAGES.filter((s) => s.tracks.includes("R"));
    expect(rStages.map((s) => s.lb)).toEqual([1, 2, 3, 4, 5]);
    const rFormulas = FORMULAS.filter((f) => Boolean(findLesson(f.lesson)?.tracks.includes("R")));
    expect(rFormulas.length).toBeLessThan(FORMULAS.length);
    for (const f of rFormulas) expect(findLesson(f.lesson)?.tracks).toContain("R");
  });

  for (const lesson of LESSONS)
    it(`${lesson.id}: sourced explanation, key rule, quick check, case workshop and two task levels`, () => {
      expect(lesson.paragraphs).toHaveLength(2);
      for (const p of lesson.paragraphs) expect(p.length).toBeGreaterThan(150);
      expect(lesson.paragraphs.join(" ")).toMatch(/Beispiel/);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
      expect(lesson.takeaway.length).toBeGreaterThan(50);
      expect(lesson.quiz.wrong).not.toContain(lesson.takeaway);
      expect(CARD_CONCEPTS).not.toContain(lesson.takeaway);
      expect(lesson.sourceIds.length).toBeGreaterThan(0);
      for (const id of lesson.sourceIds) expect(SOURCES.some((s) => s.id === id)).toBe(true);
      const solution = lesson.workshop.entries.map((e) => e.target);
      expect(lesson.workshop.entries.length).toBeGreaterThanOrEqual(3);
      expect(new Set(solution).size).toBeGreaterThanOrEqual(2);
      expect(checkWorkshop(lesson.workshop, solution).every(Boolean)).toBe(true);
      expect(checkWorkshop(lesson.workshop, solution.map(() => -1)).some(Boolean)).toBe(false);
      expect(checkWorkshop(lesson.workshop, []).some(Boolean)).toBe(false);
      expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
      for (const level of [1, 2] as const) {
        expect(lesson.tasks[level].model.length).toBeGreaterThan(80);
        expect(lesson.tasks[level].criteria).toHaveLength(3);
        expect(lesson.tasks[level].hints).toHaveLength(2);
      }
      expect(ITEMS.filter((i) => i.source_link === lessonLink(lesson.id)).length).toBeGreaterThanOrEqual(2);
    });
});

describe("existing ZAM cards (proposal-only inventory)", () => {
  it("documents no existing Mittelschule WiB cell and proposes no replacements", () => {
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    expect(mapping.sources).toEqual([]);
    expect(mapping.rows).toEqual([]);
  });
});

describe("learning evidence, track switching and local recovery", () => {
  it("tracks R8 (28) and M8 (29) separately and requires three solved tasks plus written check", () => {
    const p = freshProgress(),
      id = "wi-lohnabrechnung",
      key = keyOf(id, 1);
    expect(completion(p).total).toBe(28);
    p.track = "M";
    expect(completion(p).total).toBe(29);
    p.quiz.push(id);
    p.workshop.push(id);
    p.assessed.push(key);
    p.drafts[key] = "Vom Brutto gehen Lohnsteuer und der Arbeitnehmeranteil zur Sozialversicherung ab.";
    expect(isComplete(p, id)).toBe(false);
    p.solved[key] = 2;
    expect(isComplete(p, id)).toBe(false);
    p.solved[key] = 3;
    expect(isComplete(p, id)).toBe(true);
    expect(completion(p).done).toBe(1);
    expect(canAcceptSelfAssessment(p.drafts[key], [true, true, false])).toBe(false);
    expect(canAcceptSelfAssessment("kurz", [true, true, true])).toBe(false);
  });

  it("sanitizes corrupt storage and parses training deep links safely", () => {
    expect(parseProgress("bad")).toEqual(freshProgress());
    expect(parseProgress("[]")).toEqual(freshProgress());
    const p = parseProgress(
      JSON.stringify({
        active: "wi-lohnabrechnung",
        track: "R",
        level: 2,
        quiz: ["wi-lohnabrechnung", "wi-lohnabrechnung", "bad"],
        drafts: { "wi-lohnabrechnung:1": "x".repeat(9000), bad: "x" },
        assessed: ["wi-lohnabrechnung:1", "te-vor-nachteile-abwaegen:1"],
        solved: {
          "wi-lohnabrechnung:1": 900,
          "re-praktikum-bestimmungen:1": -1,
          "wi-entlohnungsformen:1": 1.5,
        },
        serial: { "wi-lohnabrechnung:1": 999999999 },
        labs: ["wi-lohnabrechnung", "te-vor-nachteile-abwaegen", "nope"],
      }),
    );
    expect(p.active).toBe("wi-lohnabrechnung");
    expect(p.track).toBe("R");
    expect(p.level).toBe(2);
    expect(p.quiz).toEqual(["wi-lohnabrechnung"]);
    expect(p.drafts["wi-lohnabrechnung:1"]).toHaveLength(8000);
    expect(p.assessed).toEqual(["wi-lohnabrechnung:1"]);
    expect(p.solved).toEqual({ "wi-lohnabrechnung:1": 3 });
    expect(p.serial).toEqual({ "wi-lohnabrechnung:1": 1000000 });
    expect(p.labs).toEqual(["wi-lohnabrechnung", "te-vor-nachteile-abwaegen"]);
    expect(parseTrainingDeepLink("#lesson=wi-lohnabrechnung&level=2")).toEqual({
      lessonId: "wi-lohnabrechnung",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=7")).toEqual({});
  });

  it("resets progress and free learner texts via resetProgress", () => {
    const store = new Map<string, string>([[STORAGE_KEY, '{"drafts":{"pr-komplexe-aufgabe:1":"Eigener Text"}}']]);
    const prevStorage = (globalThis as { localStorage?: unknown }).localStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { removeItem: (k: string) => store.delete(k) },
    });
    try {
      const wiped = resetProgress("R");
      expect(store.has(STORAGE_KEY)).toBe(false);
      expect(wiped).toEqual({ ...freshProgress(), track: "R" });
    } finally {
      if (prevStorage === undefined) delete (globalThis as { localStorage?: unknown }).localStorage;
      else Object.defineProperty(globalThis, "localStorage", { configurable: true, value: prevStorage });
    }
  });
});

describe("illustrations and dynamic lab diagrams", () => {
  it("provides a three-part interactive SVG figure for all 31 lessons and stage banners for LB 1–5", () => {
    expect(Object.keys(FIGURES).sort()).toEqual(LESSONS.map((l) => l.id).sort());
    for (const lesson of LESSONS) {
      const fig = FIGURES[lesson.id];
      expect(fig.parts).toHaveLength(3);
      const html = renderFigure(lesson.id);
      expect(html, lesson.id).toContain('<figure class="concept-figure"');
      expect(html, lesson.id).toContain('<svg class="concept-svg"');
      for (const part of [1, 2, 3]) {
        expect(html, `${lesson.id} part ${part}`).toContain(`data-part="${part}"`);
        expect(html, `${lesson.id} button ${part}`).toContain(`data-figure-focus="${part}"`);
      }
      expect(html, lesson.id).toContain('data-figure-focus="0"');
      expect(html, lesson.id).not.toMatch(/\bNaN\b|\bundefined\b/);
    }
    for (const stage of STAGES) {
      expect(renderStageArt(stage.lb)).toContain("<svg");
      expect(stageIcon(stage.lb)).toContain("<svg");
    }

    expect(renderFigure("pr-komplexe-aufgabe")).toContain("78,00 €");
    expect(renderFigure("pr-projektsteuerung")).toContain("28,8 Std.");
    expect(renderFigure("bo-stellenmarkt-recherche")).toContain("826 €");
    expect(renderFigure("bo-kompetenzprofil")).toContain("95 %");
    expect(renderFigure("wi-gewinn-verlust")).toContain("36,00 €");
    expect(renderFigure("wi-mindestlohn-tariflohn")).toContain("13,90 €");
    expect(renderFigure("wi-lohnabrechnung")).toContain("1.690,80 €");
    expect(renderFigure("re-praktikum-bestimmungen")).toContain("§ 5 Abs. 2 Nr. 2");
    expect(renderFigure("te-ergonomie-arbeitssicherheit")).toContain("85 dB(A)");
    expect(renderFigure("te-vor-nachteile-abwaegen")).toContain("6.250");
    // Figures must not overflow the 760 × 270 canvas.
    for (const lesson of LESSONS) {
      const svg = FIGURES[lesson.id].draw();
      for (const m of svg.matchAll(/\b(?:x|x1|x2|cx)="(-?[\d.]+)"/g)) expect(Number(m[1]), lesson.id).toBeLessThanOrEqual(760);
      for (const m of svg.matchAll(/\b(?:y|y1|y2|cy)="(-?[\d.]+)"/g)) expect(Number(m[1]), lesson.id).toBeLessThanOrEqual(270);
    }
  });

  it("renders a live SVG visualization in all 9 interactive labs without NaN or undefined", () => {
    for (const kind of Object.keys(LABS) as LabKind[]) {
      const html = renderResult(kind, LABS[kind].defaults);
      expect(html, kind).toContain("<svg");
      expect(html, kind).toContain('class="chart lab-svg"');
      expect(html, kind).not.toMatch(/\bNaN\b|\bundefined\b/);
    }
    const planOk = renderResult("internshipCheck", { start: 8, end: 16, pause: 60, days: 5 });
    expect(planOk).toContain("§§ 16, 17");
    expect(planOk).toContain("§ 22");
    expect(renderResult("netPay", { ...LABS.netPay.defaults })).toContain("unterschritten");
  });
});
