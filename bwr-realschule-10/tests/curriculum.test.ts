import { describe, expect, it } from "vitest";
import cell from "../cell.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";
import coverage from "../coverage.json";
import legacy from "./fixtures/de-by-realschule-10-bwr-kosten-leistungsrechnung-kalkulation-bilanzanalyse-kvt.json";
import { CORE_LESSONS, findLesson, FORMULAS, LESSONS, SOURCES, STAGES } from "../src/curriculum";
import { completion, freshProgress, isComplete, keyOf, parseProgress } from "../src/storage/progress";
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
const LEARNER_TEXT = JSON.stringify([LESSONS, ITEMS.map((i) => [i.question, i.concept, i.sample_solution, i.fast_check])]);

describe("public learning contract", () => {
  it("maps every Kompetenzerwartung of the Fachlehrplan to lessons of its Lernbereich", () => {
    expect(coverage.rows).toHaveLength(16);
    expect(coverage.track).toBe("II");
    expect([1, 2, 3, 4].map((lb) => coverage.rows.filter((r) => r.lb === lb).length)).toEqual([4, 3, 5, 4]);
    const covered = new Set(coverage.rows.flatMap((row) => row.lessons));
    expect(new Set(CORE_LESSONS.map((l) => l.id))).toEqual(covered);
    for (const row of coverage.rows) {
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) expect(findLesson(id)?.lb).toBe(row.lb);
    }
    expect(coverage.optional_lessons).toEqual(LESSONS.filter((l) => l.optional).map((l) => l.id));
  });
  it("pins 36 core lessons in four Lernbereiche, two refreshers, and the cell's ids", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(contract.lessons);
    expect(CORE_LESSONS).toHaveLength(36);
    expect([1, 2, 3, 4].map((lb) => CORE_LESSONS.filter((l) => l.lb === lb).length)).toEqual([7, 8, 12, 9]);
    expect(
      cell.atoms.map((a) => ({
        id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug, source_link: i.source_link })),
      })),
    ).toEqual(contract.atoms);
    expect(cell.atoms).toHaveLength(LESSONS.length);
    expect(ITEMS).toHaveLength(76);
    expect(new Set(cell.atoms.flatMap((a) => [a.id, ...a.practice_items.map((i) => i.id)])).size).toBe(114);
    expect(new Set(ITEMS.map((i) => i.slug)).size).toBe(76);
  });
  it("binds each atom to its lesson, its stage and the Lernbereich of Zweig II", () => {
    const atomIds = new Set(cell.atoms.map((a) => a.id));
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice(8));
      if (!lesson) throw new Error(`Unbekannter Lektionsanker ${atom.source_link}`);
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(atom.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      const academy = atom.curricula.filter((c) => c.provider === "zam-academy");
      expect(academy).toEqual([expect.objectContaining({ subject: "bwr-realschule-10" })]);
      const bindings = atom.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(bindings).toHaveLength(lesson.optional ? 0 : 1);
      for (const b of bindings)
        expect(b).toMatchObject({
          school_type: "realschule",
          grade: 10,
          track: "II",
          subject: "bwr",
          topic_code: `lb${lesson.lb}`,
        });
      for (const p of atom.prerequisites) expect(atomIds.has(p.atom_id)).toBe(true);
      expect(atom.practice_items.length).toBeGreaterThanOrEqual(2);
    }
  });
  it("keeps cards short, exact and in one form per field", () => {
    for (const item of ITEMS) {
      expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      expect(item.source_link).toMatch(/^https:\/\/academy\.zam-os\.org\/bwr-realschule-10\/#lesson=[a-z0-9-]+$/);
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
  it("writes German learner text with the real minus sign and decimal comma", () => {
    expect(LEARNER_TEXT).not.toMatch(/(^|[\s(„"])-\d/);
    expect(LEARNER_TEXT).not.toMatch(/\d\.\d{1,2}(?!\d)/);
    expect(LEARNER_TEXT).not.toMatch(/\bSie (können|müssen|sollen)\b/);
  });
  it("has a Formelsammlung whose every rule names an existing lesson of its stage", () => {
    expect(FORMULAS.length).toBeGreaterThanOrEqual(20);
    for (const f of FORMULAS) expect(findLesson(f.lesson)?.lb).toBe(f.lb);
    for (const lb of [1, 2, 3, 4]) expect(FORMULAS.some((f) => f.lb === lb)).toBe(true);
    expect(new Set(STAGES.map((s) => s.hue)).size).toBe(STAGES.length);
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

describe("existing ZAM cards", () => {
  const oldItems = legacy.atoms.flatMap((a) => a.practice_items as unknown as Item[]);
  it("maps every old card once and ships no history change before Thomas approves", () => {
    expect(mapping.rows.map((r) => r.de_by_id)).toEqual(oldItems.map((i) => i.id));
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.approved).toBeNull();
    expect(mapping.rows.filter((r) => r.category === "A").map((r) => r.academy_slug)).toEqual([
      "bwr10-vk-zuschlagskalkulation-check",
      "bwr10-tk-db-check",
    ]);
    for (const row of mapping.rows) {
      expect(row.reason.length).toBeGreaterThan(60);
      if (row.category === "A") expect(ITEMS.some((i) => i.slug === row.academy_slug)).toBe(true);
      else expect(row.academy_slug).toBeNull();
    }
    expect(ITEMS.some((i) => i.replaces?.length)).toBe(false);
    expect("retired_items" in cell).toBe(false);
    expect(mapping.sources[0].tile_id).toBe(legacy.tile_id);
  });
  it("proposes successors that ask the very same retrieval", () => {
    const succ = (slug: string) => ITEMS.find((i) => i.slug === slug);
    expect(plain(succ("bwr10-tk-db-check")?.concept, succ("bwr10-tk-db-check")?.concept_segments)).toBe(
      "db = p - k_v",
    );
    expect(succ("bwr10-vk-zuschlagskalkulation-check")?.question).toMatch(/Herstellkosten/);
    const hk = succ("bwr10-vk-zuschlagskalkulation-check");
    expect(plain(hk?.concept, hk?.concept_segments)).toMatch(/^\\text\{HK\} = \\text\{MK\} \+ \\text\{FK\}/);
    expect(hk?.fast_check?.options[0]).toBe("Materialkosten + Fertigungskosten");
  });
});

describe("learning evidence and local recovery", () => {
  it("requires three independent tasks and an explicit written self-assessment", () => {
    const p = freshProgress(),
      id = "tk-gewinnschwelle",
      key = keyOf(id, 1);
    p.quiz.push(id);
    p.workshop.push(id);
    p.assessed.push(key);
    p.drafts[key] = "Die Fixkosten werden durch den Stückdeckungsbeitrag geteilt und aufgerundet.";
    expect(isComplete(p, id)).toBe(false);
    p.solved[key] = 2;
    expect(isComplete(p, id)).toBe(false);
    p.solved[key] = 3;
    expect(isComplete(p, id)).toBe(true);
    p.extra = true;
    expect(completion(p).total).toBe(36);
    expect(canAcceptSelfAssessment(p.drafts[key], [true, true, false])).toBe(false);
    expect(canAcceptSelfAssessment("kurz", [true, true, true])).toBe(false);
  });
  it("completes a lesson without exercises after check, workshop and own reasoning; lab goals stay optional", () => {
    const p = freshProgress(),
      id = "vk-rechnungskreise",
      key = keyOf(id, 1);
    p.quiz.push(id);
    p.workshop.push(id);
    p.drafts[key] = "Die Geschäftsbuchführung informiert nach außen, die KLR nach innen.";
    p.assessed.push(key);
    expect(isComplete(p, id)).toBe(true);
    const lab = "ua-aufbereiten",
      labKey = keyOf(lab, 1);
    p.quiz.push(lab);
    p.workshop.push(lab);
    p.drafts[labKey] = "Forderungen, flüssige Mittel und kurzfristiges Fremdkapital zusammenfassen.";
    p.assessed.push(labKey);
    p.solved[labKey] = 3;
    expect(isComplete(p, lab)).toBe(true);
  });
  it("sanitizes corrupt storage and preserves optional card links without changing the denominator", () => {
    expect(parseProgress("bad")).toEqual(freshProgress());
    expect(parseProgress("[]")).toEqual(freshProgress());
    const p = parseProgress(
      JSON.stringify({
        active: "gr-vorsteuer",
        quiz: ["gr-vorsteuer", "gr-vorsteuer", "bad"],
        drafts: { "tk-db:1": "x".repeat(9000), bad: "x" },
        assessed: ["tk-db:1", "pe-ara:1"],
        solved: { "tk-db:1": 900, "pe-ara:1": -1, "ua-vergleich:1": 1.5 },
        serial: { "tk-db:1": 999999999 },
        labs: ["tk-gewinnschwelle", "tk-db", "nope"],
        note: { performed: true },
      }),
    );
    expect(p.active).toBe("gr-vorsteuer");
    expect(p.extra).toBe(false);
    expect(p.quiz).toEqual(["gr-vorsteuer"]);
    expect(p.drafts["tk-db:1"]).toHaveLength(8000);
    expect(p.assessed).toEqual(["tk-db:1"]);
    expect(p.solved).toEqual({ "tk-db:1": 3 });
    expect(p.serial).toEqual({ "tk-db:1": 1000000 });
    expect(p.labs).toEqual(["tk-gewinnschwelle"]);
    expect("note" in p).toBe(false);
    expect(completion(p).total).toBe(36);
    expect(parseTrainingDeepLink("#lesson=gr-vorsteuer&level=2")).toEqual({
      lessonId: "gr-vorsteuer",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=7")).toEqual({});
  });
});
