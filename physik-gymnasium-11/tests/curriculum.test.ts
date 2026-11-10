import { describe, expect, it } from "vitest";
import cellData from "../cell.json";
import coverageData from "../coverage.json";
import mappingData from "../replaces-de-by.json";
import {
  CORE_LESSONS,
  findLesson,
  LESSONS,
  lessonsFor,
  SOURCES,
  STAGES,
} from "../src/curriculum";
import { MODEL_SCENARIOS } from "../src/models";
import {
  completion,
  experimentSummary,
  freshExperiment,
  freshProgress,
  isComplete,
  parseProgress,
  writingKey,
} from "../src/storage/progress";
import {
  canAcceptSelfAssessment,
  checkWorkshop,
  initialOrder,
  moveEntry,
} from "../src/workshop";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import circleLegacy from "./fixtures/de-by-gymnasium-10-physik-kreisbewegung-gravitation-kepler-gesetze-kvt.json";
import waveLegacy from "./fixtures/de-by-gymnasium-10-physik-wellenlehre-akustik-doppler-effekt-kvt.json";
import fieldLegacy from "./fixtures/de-by-gymnasium-11-physik-elektrisches-feld-kondensator-millikan-kvt.json";
import inductionLegacy from "./fixtures/de-by-gymnasium-11-physik-induktion-schwingkreis-wechselstrom-kvt.json";
import magnetLegacy from "./fixtures/de-by-gymnasium-11-physik-magnetfeld-lorentz-massenspektrometer-zyklotron-kvt.json";

interface Item {
  id: string;
  slug: string;
  tier: string;
  source_link: string;
  question: string;
  concept?: string;
  concept_segments?: unknown[];
  sample_solution?: string;
  fast_check?: { options: unknown[]; correct_index: number };
  replaces?: string[];
}
interface Binding {
  provider: string;
  track?: string;
  school_type?: string;
  grade?: number;
  subject?: string;
  topic_code?: string;
}
interface Tile {
  atoms: Array<{
    id: string;
    slug: string;
    title: string;
    source_link: string;
    prerequisites: Array<{ atom_id: string }>;
    curricula: Binding[];
    practice_items: Item[];
  }>;
  retired_items?: Array<{ id: string }>;
}
interface Mapping {
  status: string;
  approved: string | null;
  sources: Array<{ file: string; sha256: string; tile_id: string }>;
  rows: Array<{
    de_by_id: string;
    category: "A" | "B" | "C";
    academy_slug: string | null;
    action: string;
    reason: string;
  }>;
}
interface Coverage {
  optional_lessons: string[];
  rows: Array<{
    lb: number;
    section: string;
    track: "alle" | "NTG";
    competence: string;
    lessons: string[];
    status: string;
    evidence: string;
  }>;
}
const cell = cellData as unknown as Tile;
const mapping = mappingData as unknown as Mapping;
const coverage = coverageData as unknown as Coverage;
const legacyTiles = [
  circleLegacy,
  waveLegacy,
  fieldLegacy,
  inductionLegacy,
  magnetLegacy,
] as unknown as Array<{
  tile_id: string;
  atoms: Array<{ practice_items: Array<{ id: string }> }>;
}>;

const PINNED_IDS = [
  "kb-groessen",
  "kb-zentripetalkraft",
  "kb-experiment",
  "kb-verkehr",
  "kb-gravitation",
  "kb-satelliten",
  "sw-schwingung",
  "sw-federpendel",
  "sw-fadenpendel",
  "sw-messunsicherheit",
  "sw-wellen",
  "sw-superposition",
  "sw-interferenz",
  "sw-stehende-wellen",
  "sw-doppelspalt",
  "sw-lichtmodelle",
  "ew-weltbilder",
  "ew-kepler",
  "ew-universum",
  "ew-postulate",
  "ew-zeitdilatation",
  "ew-laengenkontraktion",
  "ew-deutsche-physik",
  "ew-energieentwertung",
  "ew-energieversorgung",
  "ew-energiesparen",
  "nt-kleine-schritte",
  "nt-luftwiderstand",
  "nt-schwingung-simulieren",
  "nt-kennlinie",
  "nt-pv-anlage",
  "nt-aktivitaet",
  "nt-jahrmarkt",
  "nt-chaos",
];

describe("published lesson and cell contract", () => {
  it("pins every lesson anchor and the scope of each Ausbildungsrichtung", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(PINNED_IDS);
    expect(CORE_LESSONS).toHaveLength(34);
    expect(lessonsFor("NTG")).toHaveLength(34);
    expect(lessonsFor("ANDERE")).toHaveLength(26);
    expect([...new Set(lessonsFor("ANDERE").map((l) => l.lb))]).toEqual([
      1, 2, 3,
    ]);
    expect([...new Set(lessonsFor("NTG").map((l) => l.lb))]).toEqual([
      1, 2, 3, 4,
    ]);
    for (const lesson of LESSONS) {
      expect(lesson.tracks).toEqual(
        lesson.lb === 4 ? ["NTG"] : ["NTG", "ANDERE"],
      );
      expect(lesson.period).toContain(
        lesson.lb === 4 ? "NTG" : "alle Ausbildungsrichtungen",
      );
      expect(lesson.period.startsWith("Ph11 · Lernbereich ")).toBe(true);
    }
  });
  for (const lesson of LESSONS)
    it(`${lesson.id}: explanation, example, formulas, quiz and a solvable workshop`, () => {
      expect(STAGES.some((s) => s.lb === lesson.lb)).toBe(true);
      expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(3);
      for (const paragraph of lesson.paragraphs) {
        expect(paragraph.length).toBeGreaterThan(200);
        // The JSON shell escapes its text: plain text only.
        expect(paragraph).not.toMatch(/<[a-z/]/i);
      }
      // A worked example wherever the lesson calculates.
      if (lesson.calculation)
        expect(lesson.paragraphs.join(" ")).toMatch(/Beispiel/);
      expect(lesson.takeaway.length).toBeGreaterThan(40);
      expect(lesson.formulas?.length).toBeGreaterThanOrEqual(2);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      expect(lesson.quiz.question.trim().endsWith("?")).toBe(true);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
      expect(lesson.sourceIds[0]).toBe("lp");
      for (const source of lesson.sourceIds)
        expect(SOURCES.some((s) => s.id === source)).toBe(true);
      for (const level of [1, 2] as const) {
        const task = lesson.tasks[level];
        expect(task.prompt.length).toBeGreaterThan(60);
        expect(task.model.length).toBeGreaterThan(120);
        expect(task.criteria).toHaveLength(3);
        expect(task.hints).toHaveLength(2);
      }
      expect(lesson.tasks[1].prompt).not.toBe(lesson.tasks[2].prompt);
      const work = lesson.workshop,
        solution =
          work.kind === "timeline"
            ? work.entries.map((_, i) => i)
            : work.entries.map((e) => e.target);
      expect(work.entries.length).toBeGreaterThanOrEqual(4);
      expect(checkWorkshop(work, solution).every(Boolean)).toBe(true);
      expect(checkWorkshop(work, []).some(Boolean)).toBe(false);
      if (work.kind === "timeline") {
        expect(work.entries.map((e) => e.target)).toEqual(solution);
        expect(initialOrder(work, lesson.id)).not.toEqual(solution);
        expect(
          checkWorkshop(
            work,
            work.entries.map(() => 0),
          ).some(Boolean),
        ).toBe(false);
      } else {
        // Every category is used, so no pile stays empty.
        expect(new Set(work.entries.map((e) => e.target)).size).toBe(
          work.categories.length,
        );
        for (const entry of work.entries)
          expect(entry.target).toBeLessThan(work.categories.length);
      }
      // German learner text: decimal comma, real minus, "·" for products.
      // The period label carries section numbers such as "3.1".
      const text = JSON.stringify({ ...lesson, period: "" });
      expect(text).not.toMatch(/\d\.\d/);
      expect(text).not.toMatch(/\d \* \d|\d x \d/);
      expect(text).not.toMatch(/ - \d/);
    });
  it("gives every stage lessons, and the interactive parts to the lessons that need them", () => {
    for (const stage of STAGES)
      expect(LESSONS.some((l) => l.lb === stage.lb)).toBe(true);
    const models = LESSONS.filter((l) => l.model).map((l) => l.model);
    expect(new Set(models).size).toBe(models.length);
    expect(models).toHaveLength(Object.keys(MODEL_SCENARIOS).length);
    expect(LESSONS.filter((l) => l.calculation)).toHaveLength(26);
    // A lesson without a model still has its workshop and both written tasks.
    expect(LESSONS.filter((l) => !l.model).map((l) => l.id)).toEqual([
      "sw-lichtmodelle",
      "ew-weltbilder",
      "ew-deutsche-physik",
      "nt-aktivitaet",
    ]);
  });
  it("maps every competence of the Fachlehrplan to lessons and every lesson to a competence", () => {
    expect(coverage.rows).toHaveLength(34);
    expect(coverage.optional_lessons).toEqual([]);
    const perSection: Record<string, number> = {};
    for (const row of coverage.rows) {
      perSection[row.section] = (perSection[row.section] ?? 0) + 1;
      expect(row.competence.length).toBeGreaterThan(80);
      expect(row.evidence.length).toBeGreaterThan(40);
      expect(["implemented", "supported"]).toContain(row.status);
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(row.track).toBe(row.lb === 4 ? "NTG" : "alle");
      expect(Number(row.section[0])).toBe(row.lb);
      for (const id of row.lessons) {
        const lesson = findLesson(id);
        expect(lesson, id).toBeDefined();
        // A competence for all is never served only by an NTG lesson.
        if (row.track === "alle") expect(lesson!.lb).toBe(row.lb);
      }
    }
    expect(perSection).toEqual({
      "1": 4,
      "2": 6,
      "3.1": 2,
      "3.2": 3,
      "3.3": 2,
      "4.1": 4,
      "4.2": 3,
      "4.3": 7,
      "4.4": 3,
    });
    const covered = new Set(coverage.rows.flatMap((row) => row.lessons));
    for (const lesson of LESSONS) expect(covered.has(lesson.id), lesson.id).toBe(true);
  });
  it("keeps cards solely in the cell and binds each atom to its Lernbereich and track", () => {
    const items = cell.atoms.flatMap((a) => a.practice_items);
    expect(cell.atoms.map((a) => a.slug)).toEqual(
      PINNED_IDS.map((id) => `ph11-${id}`),
    );
    expect(items).toHaveLength(102);
    expect(new Set([...cell.atoms, ...items].map((x) => x.id)).size).toBe(136);
    expect(new Set(items.map((i) => i.slug)).size).toBe(102);
    const seen = new Set<string>();
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice(8))!;
      expect(lesson).toBeDefined();
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      expect(atom.title).toBe(lesson.title);
      expect(atom.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
      // Prerequisites point to atoms earlier in the path: no cycles.
      for (const prerequisite of atom.prerequisites)
        expect(seen.has(prerequisite.atom_id)).toBe(true);
      seen.add(atom.id);
      const bindings = atom.curricula.filter(
        (b) => b.provider === "lehrplanplus-bayern",
      );
      expect(bindings).toHaveLength(1);
      expect(bindings[0].track).toBe(lesson.lb === 4 ? "NTG" : undefined);
      expect([
        bindings[0].school_type,
        bindings[0].grade,
        bindings[0].subject,
        bindings[0].topic_code,
      ]).toEqual(["gymnasium", 11, "physik", `lb${lesson.lb}`]);
      expect(
        atom.curricula.find((b) => b.provider === "zam-academy")?.subject,
      ).toBe("physik-gymnasium-11");
      expect(atom.practice_items).toHaveLength(3);
      expect(
        atom.practice_items.filter((i) => i.tier === "tier1_fast").length,
      ).toBeGreaterThanOrEqual(2);
      for (const item of atom.practice_items) {
        expect(item.source_link).toBe(atom.source_link);
        expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
        expect(item.slug.startsWith("ph11-")).toBe(true);
        expect(item.question.trim().length).toBeGreaterThan(12);
        // Plain text or segments, never both.
        expect(Boolean(item.concept) !== Boolean(item.concept_segments)).toBe(
          true,
        );
        if (item.tier === "tier1_fast") {
          expect(item.fast_check?.options).toHaveLength(2);
          expect(item.fast_check?.correct_index).toBe(0);
          expect(item.fast_check?.options[0]).toEqual(
            item.concept ?? item.concept_segments,
          );
          expect(item.fast_check?.options[1]).not.toEqual(
            item.fast_check?.options[0],
          );
        } else {
          expect(item.tier).toBe("tier2_synthesis");
          expect(item.sample_solution?.length).toBeGreaterThan(80);
        }
      }
    }
    expect(JSON.stringify(LESSONS)).not.toContain('"practice_items"');
  });
  it("documents every legacy card once and transfers no history without approval", () => {
    const legacyIds = legacyTiles.flatMap((tile) =>
      tile.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id)),
    );
    expect(legacyIds).toHaveLength(20);
    expect(mapping.sources.map((s) => s.tile_id).sort()).toEqual(
      legacyTiles.map((t) => t.tile_id).sort(),
    );
    for (const source of mapping.sources)
      expect(source.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(mapping.rows).toHaveLength(20);
    expect(new Set(mapping.rows.map((r) => r.de_by_id))).toEqual(
      new Set(legacyIds),
    );
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(3);
    expect(mapping.rows.filter((r) => r.category === "B")).toHaveLength(0);
    expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(17);
    const items = cell.atoms.flatMap((a) => a.practice_items);
    for (const row of mapping.rows) {
      expect(row.reason.length).toBeGreaterThan(40);
      if (row.category === "A") {
        expect(row.action).toBe("replace");
        // Exactly one successor declares the transfer; one history never spreads over two cards.
        const successor = items.filter((i) => i.slug === row.academy_slug);
        expect(successor).toHaveLength(1);
        expect(successor[0].replaces).toEqual([row.de_by_id]);
      } else {
        expect(row.academy_slug).toBeNull();
        expect(row.action).toBe("keep-active");
      }
    }
    const successors = mapping.rows
      .filter((r) => r.category === "A")
      .map((r) => r.academy_slug);
    expect(new Set(successors).size).toBe(successors.length);
    // Approved by Thomas on 2026-11-10: three A transfers, nothing else moves.
    expect(mapping.status).toBe("approved");
    expect(mapping.approved).toBe("2026-11-10");
    expect(items.filter((i) => (i.replaces?.length ?? 0) > 0)).toHaveLength(3);
    expect(cell.retired_items ?? []).toEqual([]);
  });
});
describe("learner progress", () => {
  it("starts with nothing reached and requires calculation, self-assessment and every model comparison", () => {
    const p = freshProgress(),
      id = "kb-groessen",
      key = writingKey(id, 1);
    for (const lesson of LESSONS) expect(isComplete(p, lesson.id)).toBe(false);
    expect(p.explored).toEqual({});
    p.quizDone = [id];
    p.workshopDone = [id];
    p.writingDone = [key];
    p.drafts[key] = "Eine eigene ausführliche Begründung zu den Messwerten.";
    expect(isComplete(p, id)).toBe(false);
    p.explored[id] = MODEL_SCENARIOS.circular.map((s) => s.id);
    expect(isComplete(p, id)).toBe(false);
    p.calculationDone[key] = 2;
    expect(isComplete(p, id)).toBe(false);
    p.calculationDone[key] = 3;
    expect(isComplete(p, id)).toBe(true);
    expect(p.track).toBe("ANDERE");
    expect(completion(p).total).toBe(26);
    p.track = "NTG";
    expect(completion(p).total).toBe(34);
    expect(completion(p).completed).toBe(1);
    expect(canAcceptSelfAssessment("Kurz", [true, true, true])).toBe(false);
    expect(canAcceptSelfAssessment(p.drafts[key], [true, true, false])).toBe(
      false,
    );
  });
  it("recovers corrupt storage, sanitizes counters, and fixes hidden active lessons", () => {
    expect(parseProgress("broken")).toEqual(freshProgress());
    expect(parseProgress("[]")).toEqual(freshProgress());
    const p = parseProgress(
      JSON.stringify({
        track: "ANDERE",
        activeLessonId: "nt-kennlinie",
        drafts: { "kb-groessen:1": "x".repeat(9000), unknown: "bad" },
        writingDone: ["kb-groessen:1", "unknown"],
        calculationDone: {
          "kb-groessen:1": 99,
          "sw-wellen:1": -1,
          "ew-kepler:1": 2.5,
        },
        explored: { "kb-groessen": ["base", "unknown", "base"] },
      }),
    );
    expect(p.activeLessonId).toBe("kb-groessen");
    expect(p.drafts["kb-groessen:1"]).toHaveLength(8000);
    expect(p.drafts.unknown).toBeUndefined();
    expect(p.calculationDone).toEqual({ "kb-groessen:1": 3 });
    expect(p.explored["kb-groessen"]).toEqual(["base"]);
    expect(parseProgress(JSON.stringify({ track: "NTG" })).track).toBe("NTG");
    expect(parseProgress(JSON.stringify({ track: "I" })).track).toBe("ANDERE");
  });
  it("counts the two Schülerexperimente for all and the third only for the NTG", () => {
    const completed = {
      ...freshExperiment(),
      status: "done" as const,
      question: "x".repeat(20),
      setup: "x".repeat(20),
      data: "x".repeat(20),
      conclusion: "x".repeat(20),
    };
    const two = [completed, { ...completed, lb: 2 as const }];
    expect(experimentSummary([completed, completed], "ANDERE")).toMatchObject({
      count: 1,
      total: 2,
      ready: false,
    });
    expect(experimentSummary(two, "ANDERE")).toMatchObject({
      count: 2,
      total: 2,
      ready: true,
    });
    expect(experimentSummary(two, "NTG")).toMatchObject({
      count: 2,
      total: 3,
      ready: false,
    });
    expect(
      experimentSummary([...two, { ...completed, lb: 4 as const }], "NTG").ready,
    ).toBe(true);
    expect(
      experimentSummary(
        [completed, { ...completed, lb: 2, status: "planned" }],
        "ANDERE",
      ).count,
    ).toBe(1);
    expect(experimentSummary([{ ...completed, data: "" }], "ANDERE").count).toBe(
      0,
    );
    expect(freshProgress().experiments.map((e) => e.lb)).toEqual([1, 2, 4]);
  });
  it("accepts published deep links without permitting arbitrary lesson strings", () => {
    expect(parseTrainingDeepLink("#lesson=sw-doppelspalt&level=2")).toEqual({
      lessonId: "sw-doppelspalt",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=7")).toEqual({});
    expect(moveEntry([0, 1, 2], 0, -1)).toEqual([0, 1, 2]);
  });
});
