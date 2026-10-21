import { describe, expect, it } from "vitest";
import cellData from "../cell.json";
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
import inductionLegacy from "./fixtures/de-by-realschule-10-physik-induktion-wechselstrom-kvt.json";
import nuclearLegacy from "./fixtures/de-by-realschule-10-physik-kernphysik-strahlung-kvt.json";

interface Item {
  id: string;
  slug: string;
  source_link: string;
  question: string;
  concept?: string;
  concept_segments?: unknown[];
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
    source_link: string;
    curricula: Binding[];
    practice_items: Item[];
  }>;
  retired_items: Array<{ id: string }>;
}
interface Mapping {
  sources: Array<{ file: string; sha256: string }>;
  rows: Array<{
    de_by_id: string;
    category: "A" | "C";
    academy_slug: string | null;
  }>;
}
const cell = cellData as unknown as Tile;
const mapping = mappingData as Mapping;
const PINNED_IDS = [
  "me-bewegung",
  "me-beschleunigung",
  "me-freier-fall",
  "me-kraft",
  "me-energie",
  "me-anhalteweg",
  "me-impuls",
  "me-stoesse",
  "el-reihe",
  "el-parallel",
  "el-messen",
  "el-messbereich",
  "el-induktion",
  "el-uvw",
  "el-lenz",
  "el-generator",
  "el-trafo",
  "el-fernleitung",
  "ke-entdeckung",
  "ke-kern",
  "ke-quarks",
  "ke-strahlung",
  "ke-nachweis",
  "ke-zerfall",
  "ke-halbwertszeit",
  "ke-zerfallsgesetz",
  "ke-bindung",
  "ke-kettenreaktion",
  "ke-dosis",
  "ke-schutz-nutzen",
  "en-kraftwerke",
  "en-waermekraftmaschine",
  "en-kwk",
  "en-speicher",
  "en-urteil",
  "ex-effektivwert",
];

describe("published lesson and cell contract", () => {
  it("pins every lesson anchor and the honest track scopes", () => {
    expect(LESSONS.map((l) => l.id)).toEqual(PINNED_IDS);
    expect(CORE_LESSONS).toHaveLength(35);
    expect(lessonsFor("I")).toHaveLength(34);
    expect(lessonsFor("II_III")).toHaveLength(25);
    expect(lessonsFor("I").some((l) => l.id === "en-waermekraftmaschine")).toBe(
      false,
    );
    expect(lessonsFor("II_III").some((l) => l.id === "me-impuls")).toBe(false);
    expect(
      lessonsFor("II_III", true)
        .filter((l) => l.optional)
        .map((l) => l.id),
    ).toEqual(["ex-effektivwert"]);
    for (const track of ["I", "II_III"] as const)
      expect([...new Set(lessonsFor(track).map((l) => l.lb))]).toEqual([
        1, 2, 3, 4,
      ]);
  });
  for (const lesson of LESSONS)
    it(`${lesson.id}: usable content and a solvable workshop`, () => {
      expect(STAGES.some((s) => s.lb === lesson.lb)).toBe(true);
      expect(lesson.paragraphs.length).toBeGreaterThanOrEqual(2);
      expect(new Set([lesson.quiz.answer, ...lesson.quiz.wrong]).size).toBe(3);
      expect(lesson.quiz.question.trim().endsWith("?")).toBe(true);
      for (const source of lesson.sourceIds)
        expect(SOURCES.some((s) => s.id === source)).toBe(true);
      for (const level of [1, 2] as const) {
        const task = lesson.tasks[level];
        expect(task.model.length).toBeGreaterThan(60);
        expect(task.criteria).toHaveLength(3);
        expect(task.hints).toHaveLength(2);
      }
      const work = lesson.workshop,
        solution =
          work.kind === "timeline"
            ? work.entries.map((_, i) => i)
            : work.entries.map((e) => e.target);
      expect(checkWorkshop(work, solution).every(Boolean)).toBe(true);
      expect(checkWorkshop(work, []).some(Boolean)).toBe(false);
      if (work.kind === "timeline") {
        expect(initialOrder(work, lesson.id)).not.toEqual(solution);
        expect(
          checkWorkshop(
            work,
            work.entries.map(() => 0),
          ).some(Boolean),
        ).toBe(false);
      }
    });
  it("keeps cards solely in the cell and binds each core atom to its actual tracks", () => {
    const items = cell.atoms.flatMap((a) => a.practice_items);
    expect(items).toHaveLength(72);
    expect(new Set([...cell.atoms, ...items].map((x) => x.id)).size).toBe(108);
    for (const atom of cell.atoms) {
      const lesson = findLesson(new URL(atom.source_link).hash.slice(8))!;
      expect(lesson).toBeDefined();
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      const bindings = atom.curricula.filter(
        (b) => b.provider === "lehrplanplus-bayern",
      );
      expect(bindings.map((b) => b.track).sort()).toEqual(
        lesson.optional ? [] : [...lesson.tracks].sort(),
      );
      for (const b of bindings)
        expect([b.school_type, b.grade, b.subject, b.topic_code]).toEqual([
          "realschule",
          10,
          "physik",
          `lb${lesson.lb}`,
        ]);
      for (const item of atom.practice_items) {
        expect(item.source_link).toBe(atom.source_link);
        expect(item.id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
        expect(item.question?.trim().length).toBeGreaterThan(12);
        expect(item.concept || item.concept_segments?.length).toBeTruthy();
      }
    }
    expect(JSON.stringify(LESSONS)).not.toContain('"practice_items"');
  });
  it("maps every legacy id exactly once with no split mastery or guessed approval", () => {
    const legacyIds = [
      ...inductionLegacy.atoms.flatMap((atom) =>
        atom.practice_items.map((item) => item.id),
      ),
      ...nuclearLegacy.atoms.flatMap((atom) =>
        atom.practice_items.map((item) => item.id),
      ),
    ];
    expect(mapping.rows).toHaveLength(16);
    expect(new Set(mapping.rows.map((r) => r.de_by_id))).toEqual(
      new Set(legacyIds),
    );
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(7);
    expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(9);
    const items = cell.atoms.flatMap((a) => a.practice_items);
    for (const row of mapping.rows) {
      const successors = items.filter((i) =>
        i.replaces?.includes(row.de_by_id),
      );
      if (row.category === "A") {
        expect(successors).toHaveLength(1);
        expect(successors[0].slug).toBe(row.academy_slug);
        expect(successors[0].replaces).toEqual([row.de_by_id]);
      } else {
        expect(successors).toHaveLength(0);
        expect(cell.retired_items.some((i) => i.id === row.de_by_id)).toBe(
          true,
        );
      }
    }
    expect(new Set(cell.retired_items.map((i) => i.id)).size).toBe(9);
  });
});
describe("learner progress", () => {
  it("requires independent calculation plus explicit self-assessment and model comparisons", () => {
    const p = freshProgress(),
      id = "me-bewegung",
      key = writingKey(id, 1);
    p.quizDone = [id];
    p.workshopDone = [id];
    p.writingDone = [key];
    p.drafts[key] = "Eine eigene ausführliche Begründung zu den Messwerten.";
    expect(isComplete(p, id)).toBe(false);
    p.explored[id] = MODEL_SCENARIOS.motion.map((s) => s.id);
    expect(isComplete(p, id)).toBe(false);
    p.calculationDone[key] = 2;
    expect(isComplete(p, id)).toBe(false);
    p.calculationDone[key] = 3;
    expect(isComplete(p, id)).toBe(true);
    p.track = "I";
    expect(completion(p).total).toBe(34);
    p.track = "II_III";
    expect(completion(p).total).toBe(25);
    p.includeExtra = true;
    expect(completion(p).total).toBe(25);
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
        track: "II_III",
        activeLessonId: "me-impuls",
        drafts: { "me-bewegung:1": "x".repeat(9000), unknown: "bad" },
        writingDone: ["me-bewegung:1", "unknown"],
        calculationDone: {
          "me-bewegung:1": 99,
          "el-reihe:1": -1,
          "el-trafo:1": 2.5,
        },
        explored: { "me-bewegung": ["uniform", "unknown", "uniform"] },
      }),
    );
    expect(p.activeLessonId).toBe("me-bewegung");
    expect(p.drafts["me-bewegung:1"]).toHaveLength(8000);
    expect(p.drafts.unknown).toBeUndefined();
    expect(p.calculationDone).toEqual({ "me-bewegung:1": 3 });
    expect(p.explored["me-bewegung"]).toEqual(["uniform"]);
  });
  it("requires three self-reported real experiments and both learning areas", () => {
    const completed = {
      ...freshExperiment(),
      status: "done" as const,
      question: "x".repeat(20),
      setup: "x".repeat(20),
      data: "x".repeat(20),
      conclusion: "x".repeat(20),
    };
    expect(experimentSummary([completed, completed, completed]).ready).toBe(
      false,
    );
    expect(
      experimentSummary([completed, { ...completed, lb: 2 }, completed]).ready,
    ).toBe(true);
    expect(
      experimentSummary([
        completed,
        { ...completed, lb: 2, status: "planned" },
        completed,
      ]).count,
    ).toBe(2);
    expect(experimentSummary([{ ...completed, data: "" }]).count).toBe(0);
  });
  it("accepts published deep links without permitting arbitrary lesson strings", () => {
    expect(parseTrainingDeepLink("#lesson=el-trafo&level=2")).toEqual({
      lessonId: "el-trafo",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=7")).toEqual({});
    expect(moveEntry([0, 1, 2], 0, -1)).toEqual([0, 1, 2]);
  });
});
