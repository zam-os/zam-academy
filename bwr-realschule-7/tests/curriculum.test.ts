import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import legacyKonten from "./fixtures/de-by-realschule-7-bwr-bestandskonten-buchungssatz-eroeffnung-kvt.json";
import legacyBilanz from "./fixtures/de-by-realschule-7-bwr-unternehmen-inventur-bilanz-kvt.json";
import contract from "./fixtures/public-contract.json";
import { CORE_LESSONS, findLesson, FORMULAS, LESSONS, lessonsFor, SOURCES, STAGES } from "../src/curriculum";
import { ACCOUNT_LIST } from "../src/finance";
import { FIGURES, renderFigure, renderStageArt, stageIcon } from "../src/figures";
import { LABS, renderResult } from "../src/labs";
import type { LabKind } from "../src/model/types";
import { completion, freshProgress, isComplete, keyOf, parseProgress, resetProgress, STORAGE_KEY } from "../src/storage/progress";
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
  it("maps every Kompetenzerwartung of Zweig II and Zweig IIIa to lessons of its Lernbereich and track", () => {
    expect(coverage.rows).toHaveLength(48);
    const iiRows = coverage.rows.filter((r) => r.track === "II");
    const iiiaRows = coverage.rows.filter((r) => r.track === "IIIa");
    expect(iiRows).toHaveLength(28);
    expect(iiiaRows).toHaveLength(20);
    expect([1, 2, 3, 4, 5].map((lb) => iiRows.filter((r) => r.lb === lb).length)).toEqual([6, 4, 7, 4, 7]);
    expect([1, 2, 3, 4, 5].map((lb) => iiiaRows.filter((r) => r.lb === lb).length)).toEqual([5, 4, 7, 4, 0]);

    expect(new Set(lessonsFor("II").map((l) => l.id))).toEqual(
      new Set(iiRows.flatMap((r) => r.lessons)),
    );
    expect(new Set(lessonsFor("IIIa").map((l) => l.id))).toEqual(
      new Set(iiiaRows.flatMap((r) => r.lessons)),
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

  it("pins 36 core lessons (25 also in IIIa), five Lernbereiche, and the cell's ULIDs", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
    expect(CORE_LESSONS).toHaveLength(36);
    expect(lessonsFor("II")).toHaveLength(36);
    expect(lessonsFor("IIIa")).toHaveLength(25);
    expect([1, 2, 3, 4, 5].map((lb) => lessonsFor("II").filter((l) => l.lb === lb).length)).toEqual([7, 7, 9, 6, 7]);
    expect([1, 2, 3, 4, 5].map((lb) => lessonsFor("IIIa").filter((l) => l.lb === lb).length)).toEqual([5, 6, 9, 5, 0]);

    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug, source_link: i.source_link })),
      })),
    ).toEqual(contract.atoms);
    expect(cell.atoms).toHaveLength(LESSONS.length);
    expect(ITEMS).toHaveLength(72);
    expect(new Set(cell.atoms.flatMap((a) => [a.id, ...a.practice_items.map((i) => i.id)])).size).toBe(108);
    expect(new Set(ITEMS.map((i) => i.slug)).size).toBe(72);
  });

  it("binds each atom to its lesson, stage and exact LehrplanPLUS tracks", () => {
    const atomIds = new Set(cell.atoms.map((a) => a.id));
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice(8));
      if (!lesson) throw new Error(`Unbekannter Lektionsanker ${atom.source_link}`);
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(atom.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      const academy = atom.curricula.filter((c) => c.provider === "zam-academy");
      expect(academy).toEqual([expect.objectContaining({ subject: "bwr-realschule-7" })]);
      const bindings = atom.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(bindings.map((b) => b.track)).toEqual(lesson.tracks);
      for (const b of bindings)
        expect(b).toMatchObject({
          school_type: "realschule",
          grade: 7,
          subject: "bwr",
          topic_code: `lb${lesson.lb}`,
        });
      for (const p of atom.prerequisites) expect(atomIds.has(p.atom_id)).toBe(true);
      expect(atom.practice_items.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps cards short, exact, in one form per field and free of unapproved replaces", () => {
    expect((cell as { retired_items?: unknown[] }).retired_items).toBeUndefined();
    for (const item of ITEMS) {
      expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      expect(item.source_link).toMatch(
        /^https:\/\/academy\.zam-os\.org\/bwr-realschule-7\/#lesson=[a-z0-9-]+$/,
      );
      expect(item.replaces).toBeUndefined();
      // ZAM's bundle check: a field is either plain text or segments, never both.
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
      } else expect(item.tier).toBe("tier2_synthesis");
      expect(item.choice_distractors).toBeUndefined();
    }
    expect(JSON.stringify(LESSONS)).not.toContain('"practice_items"');
  });

  it("writes German learner text with the real minus sign, decimal comma and BwR 7 Kürzel", () => {
    expect(LEARNER_TEXT).not.toMatch(/(^|[\s(„"])-\d/);
    expect(LEARNER_TEXT).not.toMatch(/\d\.\d{1,2}(?!\d)/);
    expect(LEARNER_TEXT).not.toMatch(/\bSie (können|müssen|sollen)\b/);
    expect(LEARNER_TEXT).not.toMatch(
      /\b(?:0500|0530|0700|0840|0860|0870|2000|2010|2020|2030|2400|2600|2800|2880|3000|4200|4250|4400|4800|5000|6000|6010|6020|6030|8010|8020)\s+(?:GR|BVG|MA|FP|BM|BGA|R|F|H|B|FO|VORST|BK|KA|EK|KBKV|LBKV|VE|UST|UEFE|AWR|AWF|AWH|AWB|SBK|GUV)\b/,
    );
  });

  it("has a Formelsammlung whose every rule names an existing lesson of its stage and filters cleanly for IIIa", () => {
    expect(FORMULAS.length).toBeGreaterThanOrEqual(20);
    for (const f of FORMULAS) expect(findLesson(f.lesson)?.lb).toBe(f.lb);
    for (const lb of [1, 2, 3, 4, 5]) expect(FORMULAS.some((f) => f.lb === lb)).toBe(true);
    expect(new Set(STAGES.map((s) => s.hue)).size).toBe(STAGES.length);

    const iiiaStages = STAGES.filter((s) => s.tracks.includes("IIIa"));
    expect(iiiaStages.map((s) => s.lb)).toEqual([1, 2, 3, 4]);
    const iiiaFormulas = FORMULAS.filter((f) => Boolean(findLesson(f.lesson)?.tracks.includes("IIIa")));
    expect(iiiaFormulas.length).toBeGreaterThan(0);
    for (const f of iiiaFormulas) expect(findLesson(f.lesson)?.tracks).toContain("IIIa");
    expect(ACCOUNT_LIST.filter((a) => a.tracks.includes("IIIa"))).toHaveLength(21);
    expect(ACCOUNT_LIST.filter((a) => a.tracks.includes("II"))).toHaveLength(23);
  });

  for (const lesson of LESSONS)
    it(`${lesson.id}: sourced explanation, key rule, quick check, case workshop and two task levels`, () => {
      expect(lesson.paragraphs).toHaveLength(2);
      for (const p of lesson.paragraphs) expect(p.length).toBeGreaterThan(150);
      expect(lesson.paragraphs.join(" ")).toMatch(/Beispiel/);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
      // A takeaway stands alone: never a distractor, never a card answer without its question.
      expect(lesson.takeaway.length).toBeGreaterThan(50);
      expect(lesson.quiz.wrong).not.toContain(lesson.takeaway);
      expect(CARD_CONCEPTS).not.toContain(lesson.takeaway);
      expect(lesson.sourceIds.length).toBeGreaterThan(0);
      for (const id of lesson.sourceIds) expect(SOURCES.some((s) => s.id === id)).toBe(true);
      const solution = lesson.workshop.entries.map((e) => e.target);
      expect(lesson.workshop.entries.length).toBeGreaterThanOrEqual(3);
      expect(new Set(solution).size).toBeGreaterThanOrEqual(2);
      expect(checkWorkshop(lesson.workshop, solution).every(Boolean)).toBe(true);
      // The workshop starts unanswered: nothing is reached before the learner acts.
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

describe("existing ZAM cards (proposal-only)", () => {
  const oldItems = [
    ...legacyBilanz.atoms.flatMap((a) => a.practice_items as unknown as Item[]),
    ...legacyKonten.atoms.flatMap((a) => a.practice_items as unknown as Item[]),
  ];

  it("maps all ten old Grade 7 items as proposal-only without declaring replaces or retired_items", () => {
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    expect(mapping.rows.map((r) => r.de_by_id)).toEqual(oldItems.map((i) => i.id));
    expect(mapping.sources.map((s) => s.tile_id)).toEqual([legacyBilanz.tile_id, legacyKonten.tile_id]);
    expect(ITEMS.filter((i) => i.replaces?.length)).toHaveLength(0);

    const aSlugs: string[] = [];
    for (const row of mapping.rows) {
      const old = oldItems.find((i) => i.id === row.de_by_id);
      expect(row.de_by_question).toBe(old?.question);
      expect(row.reason.length).toBeGreaterThan(60);
      if (row.category === "A") {
        expect(row.action).toBe("propose-replace-after-approval");
        expect(row.academy_slug).toBeTruthy();
        const matches = ITEMS.filter((i) => i.slug === row.academy_slug);
        expect(matches).toHaveLength(1);
        aSlugs.push(row.academy_slug!);
      } else {
        expect(row.category).toBe("C");
        expect(["keep-active", "propose-retire-after-approval"]).toContain(row.action);
        expect(row.academy_slug).toBeNull();
      }
    }
    expect(aSlugs).toEqual([
      "bwr7-gb-bilanz-check",
      "bwr7-gb-bilanzveraenderungen-check",
      "bwr7-gb-bestandskonten-check",
      "bwr7-gb-buchungssatz-check",
    ]);
  });
});

describe("learning evidence, track switching and local recovery", () => {
  it("tracks Zweig II (36) and Zweig IIIa (25) separately and requires three solved tasks plus written check", () => {
    const p = freshProgress(),
      id = "gb-umsatzsteuer-rechnen",
      key = keyOf(id, 1);
    expect(completion(p).total).toBe(36);
    p.track = "IIIa";
    expect(completion(p).total).toBe(25);
    p.quiz.push(id);
    p.workshop.push(id);
    p.assessed.push(key);
    p.drafts[key] = "Der Nettobetrag entspricht 100 %, der Bruttobetrag bei 19 % Steuer 119 %.";
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
        active: "gb-bilanz",
        track: "IIIa",
        level: 2,
        quiz: ["gb-bilanz", "gb-bilanz", "bad"],
        drafts: { "gb-bilanz:1": "x".repeat(9000), bad: "x" },
        assessed: ["gb-bilanz:1", "hh-konsum:1"],
        solved: { "gb-bilanz:1": 900, "hh-belege:1": -1, "gb-umsatzsteuer-rechnen:1": 1.5 },
        serial: { "gb-bilanz:1": 999999999 },
        labs: ["gb-bilanz", "hh-konsum", "nope"],
      }),
    );
    expect(p.active).toBe("gb-bilanz");
    expect(p.track).toBe("IIIa");
    expect(p.level).toBe(2);
    expect(p.quiz).toEqual(["gb-bilanz"]);
    expect(p.drafts["gb-bilanz:1"]).toHaveLength(8000);
    expect(p.assessed).toEqual(["gb-bilanz:1"]);
    expect(p.solved).toEqual({ "gb-bilanz:1": 3 });
    expect(p.serial).toEqual({ "gb-bilanz:1": 1000000 });
    expect(p.labs).toEqual(["gb-bilanz"]);
    expect(parseTrainingDeepLink("#lesson=gb-bilanz&level=2")).toEqual({
      lessonId: "gb-bilanz",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=7")).toEqual({});
  });

  it("resets progress and free learner texts via resetProgress", () => {
    const store = new Map<string, string>([[STORAGE_KEY, '{"drafts":{"hh-konsum:1":"Eigener Testtext"}}']]);
    const prevStorage = (globalThis as { localStorage?: unknown }).localStorage;
    Object.defineProperty(globalThis, "localStorage", {
      configurable: true,
      value: { removeItem: (k: string) => store.delete(k) },
    });
    try {
      const wiped = resetProgress("IIIa");
      expect(store.has(STORAGE_KEY)).toBe(false);
      expect(wiped).toEqual({ ...freshProgress(), track: "IIIa" });
    } finally {
      if (prevStorage === undefined) delete (globalThis as { localStorage?: unknown }).localStorage;
      else Object.defineProperty(globalThis, "localStorage", { configurable: true, value: prevStorage });
    }
  });
});

describe("illustrations and dynamic lab diagrams", () => {
  it("provides a three-part interactive SVG figure for all 36 lessons and stage banners for LB 1–5", () => {
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
  });

  it("renders a live SVG visualization in all 8 interactive labs without NaN or undefined", () => {
    for (const kind of Object.keys(LABS) as LabKind[]) {
      const html = renderResult(kind, LABS[kind].defaults);
      expect(html, kind).toContain("<svg");
      expect(html, kind).toContain('class="chart lab-svg"');
      expect(html, kind).not.toMatch(/\bNaN\b|\bundefined\b/);
    }
  });
});
