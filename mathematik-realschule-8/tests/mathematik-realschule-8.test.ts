import { required } from "../src/model/required";
import { describe, expect, it } from "vitest";
import cellJson from "../cell.json";
import coverage from "../coverage.json";
import mapping from "../replaces-de-by.json";
import videos from "../video-tasks.json";
import {
  ALL_LESSONS,
  findLessonById,
  lessonsForTrack,
  nextLesson,
  previousLesson,
  STAGES,
} from "../src/curriculum";
import outline from "../src/curriculum/outline.json";
import { simulate } from "../src/curriculum/stage-7-zufall";
import { checkTask, parseNumber } from "../src/exercises/checker";
import { createRng } from "../src/exercises/rng";
import {
  applyAction,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  reachedGoals,
  withChanges,
} from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import {
  lineFromPoints,
  rotate,
  solveLinear,
  solveRatio,
  triangleArea,
  triangleExists,
  triangleVertex,
} from "../src/math";
import type { DifficultyLevel, ExerciseTask, NumberField } from "../src/model/types";
import {
  isLessonComplete,
  isStageComplete,
  overallStats,
  resetLearnerProgress,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink, ZAM_CELL_ID } from "../src/zam/zam-link";
import { WITNESSES } from "./witnesses";
import legacyGeo from "./fixtures/de-by-realschule-8-mathematik-ebene-geometrie-vierecke-kvt.json";
import legacyFunctions from "./fixtures/de-by-realschule-8-mathematik-lineare-funktionen-kvt.json";
import legacyTerms from "./fixtures/de-by-realschule-8-mathematik-terme-gleichungen-kvt.json";

interface ItemContract {
  id: string;
  slug: string;
  source_link: string;
  fast_check: { options: unknown[] };
  [key: string]: unknown;
}
interface AtomContract {
  id: string;
  source_link: string;
  curricula: {
    provider: string;
    track?: string;
    topic_code: string;
    grade?: number;
    school_type?: string;
  }[];
  prerequisites: { atom_id: string; type: string }[];
  practice_items: ItemContract[];
}
const cell = cellJson as unknown as { tile_id: string; atoms: AtomContract[] };

const IDS = [
  "dv-1-dreiecksungleichung",
  "dv-2-dreieckskonstruktion",
  "dv-3-kongruenz",
  "dv-4-vierecke",
  "dv-5-viereckskonstruktion",
  "dr-1-drehung",
  "dr-2-drehsymmetrie",
  "dr-3-vektoren",
  "rg-1-koerpersymmetrie",
  "rg-2-axialschnitte",
  "rg-3-raumkoordinaten",
  "rg-4-schraegbilder",
  "rg-5-wahre-groesse",
  "tg-1-termoperationen",
  "tg-2-binomische-formeln",
  "tg-3-faktorisieren",
  "tg-4-extremwerte",
  "tg-5-gleichungen",
  "tg-6-sachaufgaben",
  "tg-7-ungleichungen",
  "br-1-definitionsmenge",
  "br-2-verhaeltnisgleichungen",
  "br-3-formeln",
  "fu-1-zuordnungen",
  "fu-2-darstellungen",
  "fu-3-ursprungsgeraden",
  "fu-4-geradenlagen",
  "fu-5-achsenabschnitt",
  "fu-6-geraden-bestimmen",
  "fu-7-flaechenmodelle",
  "dz-1-ergebnis-ereignis",
  "dz-2-baum-tafel",
  "dz-3-haeufigkeiten",
];
const fields = (t: ExerciseTask): number[] =>
  t.fields.filter((f): f is NumberField => f.kind === "number").map((f) => f.answer);
const get = (id: string) => required(findLessonById(id)).lesson;

describe("curriculum and publication contracts", () => {
  it("pins every public lesson address and both distinct grade-8 paths", () => {
    expect(ALL_LESSONS.map((l) => l.id)).toEqual(IDS);
    expect(STAGES).toHaveLength(7);
    expect(lessonsForTrack("I")).toHaveLength(28);
    expect(lessonsForTrack("II_III")).toHaveLength(23);
    expect(lessonsForTrack("II_III").map((l) => l.id)).not.toContain("fu-5-achsenabschnitt");
    expect(nextLesson("dv-5-viereckskonstruktion", "II_III")?.id).toBe("rg-4-schraegbilder");
    expect(previousLesson("rg-4-schraegbilder", "II_III")?.id).toBe("dv-5-viereckskonstruktion");
    expect(nextLesson("unknown", "I")).toBeUndefined();
  });

  it("maps all 23 and 19 official expectations to offered, correctly bound lessons", () => {
    expect(coverage.competences).toHaveLength(42);
    expect(coverage.competences.filter((c) => c.track === "I")).toHaveLength(23);
    expect(coverage.competences.filter((c) => c.track === "II_III")).toHaveLength(19);
    const covered = new Set<string>();
    for (const entry of coverage.competences) {
      expect(entry.lessons.length).toBeGreaterThan(0);
      expect(entry.evidence.length).toBeGreaterThan(20);
      for (const id of entry.lessons) {
        const lesson = required(outline.lessons.find((l) => l.id === id));
        expect(lesson, id).toBeDefined();
        expect((lesson.bindings as Record<string, number>)[entry.track]).toBe(entry.lb);
        covered.add(id);
      }
    }
    expect([...covered].sort()).toEqual([...IDS].sort());
    expect(coverage.outside_app.join(" ")).toMatch(/Zirkel/);
  });

  it("keeps card identity, prerequisites, source links and scope aligned with the app", () => {
    expect(cell.tile_id).toBe(ZAM_CELL_ID);
    expect(cell.atoms).toHaveLength(33);
    const items = cell.atoms.flatMap((a) => a.practice_items);
    expect(items).toHaveLength(99);
    const ids = [...cell.atoms, ...items].map((a) => a.id);
    expect(new Set(ids).size).toBe(132);
    expect(ids.every((id) => /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(id))).toBe(true);
    for (const atom of cell.atoms) {
      const url = new URL(atom.source_link),
        lessonId = required(new URLSearchParams(url.hash.slice(1)).get("lesson"));
      const lesson = get(lessonId),
        meta = required(outline.lessons.find((l) => l.id === lessonId));
      expect(atom.source_link).toBe(lessonLink(lesson.id));
      const official = atom.curricula.filter((b) => b.provider === "lehrplanplus-bayern");
      expect(
        Object.fromEntries(official.map((b) => [b.track, Number(b.topic_code.slice(2))])),
      ).toEqual(meta.bindings);
      expect(official.every((b) => b.grade === 8 && b.school_type === "realschule")).toBe(true);
      for (const prerequisite of atom.prerequisites) {
        const parent = required(cell.atoms.find((a) => a.id === prerequisite.atom_id));
        expect(parent).toBeDefined();
        expect(prerequisite.type).toBe("soft");
      }
      for (const item of atom.practice_items) {
        expect(item.source_link).toBe(atom.source_link);
        expect(item.fast_check.options).toHaveLength(2);
        const content = item as Record<string, unknown>;
        expect(content.replaces).toBeUndefined();
        for (const key of ["question_segments", "concept_segments"]) {
          const segments = content[key] as
            | { type: string; tex?: string; speech?: string; text?: string }[]
            | undefined;
          for (const part of segments ?? [])
            if (part.type === "math") expect(part.speech?.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("preserves all 24 legacy snapshots and keeps the 9/15 mapping a proposal", () => {
    expect(mapping.approved).toBeNull();
    expect(mapping.rows).toHaveLength(24);
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(9);
    expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(15);
    const slugs = new Set(cell.atoms.flatMap((a) => a.practice_items).map((i) => i.slug));
    const legacyIds: string[] = [];
    for (const tile of [legacyGeo, legacyFunctions, legacyTerms])
      legacyIds.push(...tile.atoms.map((a) => a.practice_items.map((i) => i.id)).flat());
    expect(mapping.sources.every((s) => /^[0-9a-f]{64}$/.test(s.sha256))).toBe(true);
    expect(mapping.rows.map((r) => r.de_by_id).sort()).toEqual(legacyIds.sort());
    for (const row of mapping.rows)
      if (row.category === "A") expect(slugs.has(required(row.academy_slug))).toBe(true);
      else expect(row.academy_slug).toBeNull();
    expect((cell as Record<string, unknown>).retired_items).toBeUndefined();
  });

  it("keeps every video task open without placeholder video links", () => {
    expect(videos.lessons.map((l) => l.id)).toEqual(IDS);
    expect(videos.lessons.every((l) => l.url === null && l.status === "pending")).toBe(true);
    expect(ALL_LESSONS.every((l) => l.teacherVideo === undefined)).toBe(true);
  });
});

describe.each(ALL_LESSONS)("$id", (lesson) => {
  it("has reachable lab goals that require learner action", () => {
    const lab = lesson.lab,
      defaults = defaultLabValues(lab);
    expect(reachedGoals(lab, defaults)).toEqual([]);
    if (lesson.id === "dz-3-haeufigkeiten") {
      let v = applyAction(lab, defaults, "hundred");
      expect(reachedGoals(lab, v).map((g) => g.id)).toContain("fair");
      v = withChanges(lab, v, { model: 1 });
      expect(v.throws).toBe(0);
      for (let i = 0; i < 10; i++) v = applyAction(lab, v, "hundred");
      expect(reachedGoals(lab, v).map((g) => g.id)).toContain("verzerrt");
    } else {
      const reached = new Set(
        WITNESSES[lesson.id].flatMap((w) =>
          reachedGoals(lab, withChanges(lab, defaults, w)).map((g) => g.id),
        ),
      );
      expect([...reached].sort()).toEqual(lab.goals.map((g) => g.id).sort());
    }
  });

  it("draws every coarse boundary configuration with finite coordinates and meaningful readouts", () => {
    const view = labView(lesson.lab.kind);
    for (const v of enumerateLabGrid(lesson.lab, 3)) {
      const r = computeReadouts(lesson.lab, v),
        svg = view.render(v, r);
      for (const value of Object.values(r))
        if (typeof value === "number") expect(Number.isFinite(value)).toBe(true);
      expect(svg).toContain('role="img"');
      expect(svg).not.toMatch(/NaN|Infinity|undefined/);
    }
  });

  it("generates valid, reproducible tasks at both levels with correct rounded input accepted", () => {
    expect(lesson.quiz.options[lesson.quiz.correctIndex]).toBeTruthy();
    for (const generator of lesson.exercises)
      for (const level of [1, 2] as DifficultyLevel[]) {
        const variety = new Set<string>();
        for (let seed = 1; seed <= 100; seed++) {
          const t = generator.make(createRng(seed), level);
          expect(t).toEqual(generator.make(createRng(seed), level));
          expect(t.fields.length).toBeGreaterThan(0);
          expect(t.steps.length).toBeGreaterThan(1);
          expect(t.prompt + t.steps.join(" ")).not.toMatch(/NaN|Infinity|undefined/);
          const input = t.fields.map((f) => {
            if (f.kind === "choice") {
              expect(f.correctIndex).toBeGreaterThanOrEqual(0);
              expect(f.correctIndex).toBeLessThan(f.options.length);
              return String(f.correctIndex);
            }
            expect(Number.isFinite(f.answer)).toBe(true);
            return f.answer.toFixed(f.digits).replace(".", ",");
          });
          expect(checkTask(t, input).status).toBe("correct");
          expect(
            checkTask(
              t,
              t.fields.map(() => ""),
            ).status,
          ).toBe("invalid");
          variety.add(t.prompt);
        }
        expect(variety.size).toBeGreaterThanOrEqual(4);
      }
  });
});

describe("independent mathematical checks", () => {
  it("handles impossible triangles, mirrored SSS intersections and degenerate lines", () => {
    expect(triangleExists(3, 4, 7)).toBe(false);
    expect(triangleVertex(3, 4, 7)).toBeNull();
    const p = required(triangleVertex(5, 6, 7));
    expect(Math.hypot(p.x, p.y)).toBeCloseTo(6);
    expect(Math.hypot(p.x - 7, p.y)).toBeCloseTo(5);
    expect(lineFromPoints({ x: 2, y: 1 }, { x: 2, y: 4 })).toBeNull();
    expect(solveLinear(2, 3, 2, 3)).toEqual({ kind: "all" });
    expect(solveLinear(2, 3, 2, 4)).toEqual({ kind: "none" });
  });

  it("preserves distance under rotation about arbitrary centres and inverts a turn", () => {
    const centre = { x: 2, y: -1 },
      p = { x: -3, y: 4 };
    for (let angle = -180; angle <= 180; angle += 15) {
      const image = rotate(p, angle, centre),
        back = rotate(image, -angle, centre);
      expect(Math.hypot(image.x - centre.x, image.y - centre.y)).toBeCloseTo(
        Math.hypot(p.x - centre.x, p.y - centre.y),
      );
      expect(back.x).toBeCloseTo(p.x);
      expect(back.y).toBeCloseTo(p.y);
    }
  });

  it("checks generated expansions and extrema by substituting values into the original expressions", () => {
    for (let seed = 1; seed <= 200; seed++) {
      for (const level of [1, 2] as DifficultyLevel[]) {
        const t = get("tg-1-termoperationen").exercises[0].make(createRng(seed), level),
          m = required(t.meta),
          f = fields(t);
        for (const [x, y] of [
          [-2, 3],
          [0, -1],
          [3, 2],
        ])
          expect(f[0] * x ** (2 * m.p) + f[1] * x ** m.p * y + f[2] * y * y).toBe(
            (m.a * x ** m.p + m.b * y) * (m.c * x ** m.p + m.d * y) - m.e * x ** m.p * y,
          );
      }
      const t = get("tg-4-extremwerte").exercises[0].make(createRng(seed), 1),
        m = required(t.meta),
        [x, value] = fields(t);
      const original = (z: number) => m.a * z * z + m.b * z + m.c;
      expect(original(x)).toBe(value);
      expect((original(x - 1) - value) * Math.sign(m.a)).toBeGreaterThan(0);
      expect((original(x + 1) - value) * Math.sign(m.a)).toBeGreaterThan(0);
    }
  });

  it("checks candidate equation answers in the original products and original rational denominators", () => {
    const cases = new Set<string>();
    for (let seed = 1; seed <= 200; seed++) {
      const eq = get("tg-5-gleichungen").exercises[1].make(createRng(seed), 2),
        m = required(eq.meta);
      const field = eq.fields.find((f) => f.kind === "number") as NumberField | undefined;
      if (field)
        expect((field.answer + m.b) ** 2 - field.answer ** 2).toBeCloseTo(m.a * field.answer + m.d);
      const t = get("br-2-verhaeltnisgleichungen").exercises[1].make(createRng(seed), 2),
        n = required(t.meta),
        answer = t.fields[2] as NumberField;
      expect(answer.answer).not.toBe(n.p);
      expect(answer.answer).not.toBe(n.q);
      expect(n.a / (answer.answer - n.p)).toBeCloseTo(n.b / (answer.answer - n.q));
      const candidateTask = get("br-2-verhaeltnisgleichungen").exercises[0].make(
          createRng(seed),
          2,
        ),
        candidate = required(candidateTask.meta);
      cases.add(candidate.p === candidate.q ? "excluded" : "one");
    }
    expect([...cases].sort()).toEqual(["excluded", "one"]);
    expect(solveRatio(2, 1, 3, 1)).toEqual({ kind: "none" });
    expect(solveRatio(2, 1, 2, 1)).toEqual({ kind: "all" });
  });

  it("checks generated lines against both defining points and deterministic area orientation", () => {
    for (let seed = 1; seed <= 100; seed++) {
      const t = get("fu-6-geraden-bestimmen").exercises[0].make(createRng(seed), 1),
        data = required(t.meta),
        [m, intercept] = fields(t);
      expect(m * data.x1 + intercept).toBe(data.y1);
      expect(m * data.x2 + intercept).toBe(data.y2);
      const a = { x: data.x1, y: data.y1 },
        b = { x: data.x2, y: data.y2 };
      expect(triangleArea(a, b)).toBe(triangleArea(b, a));
    }
    expect(triangleArea({ x: 3, y: 0 }, { x: 0, y: 4 })).toBe(6);
  });

  it("uses reproducible simulations and never mixes a changed setup with past counts", () => {
    const lab = get("dz-3-haeufigkeiten").lab,
      initial = defaultLabValues(lab),
      once = simulate(initial, 1000);
    let chunks = { ...initial };
    for (let i = 0; i < 10; i++) chunks = simulate(chunks, 100);
    expect(chunks).toEqual(once);
    expect(once.throws).toBe(1000);
    expect(once.hits).toBeGreaterThan(0);
    expect(once.hits).toBeLessThan(1000);
    expect(withChanges(lab, once, { event: 1 }).throws).toBe(0);
    expect(withChanges(lab, once, { model: 1 }).hits).toBe(0);
    expect(applyAction(lab, once, "reset")).toEqual(initial);
  });
});

describe("learner state and inputs", () => {
  it("keeps exact quarter steps in sliders and generated measurements", () => {
    const lab = get("rg-4-schraegbilder").lab;
    for (const q of [0.25, 0.5, 0.75, 1]) {
      expect(withChanges(lab, defaultLabValues(lab), { q }).q).toBe(q);
    }
    const rng = createRng(22),
      values = Array.from({ length: 100 }, () => rng.stepped(0.25, 1, 0.25));
    expect(new Set(values)).toEqual(new Set([0.25, 0.5, 0.75, 1]));
  });

  it("requires checks, lab goals and practice, and counts only the chosen track", () => {
    const p = resetLearnerProgress(),
      l = get("dv-4-vierecke");
    p.quizDone.push(l.id);
    p.solved[l.id] = { 1: 3, 2: 3 };
    expect(isLessonComplete(p, l)).toBe(false);
    p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
    expect(isLessonComplete(p, l)).toBe(true);
    expect(overallStats(p, STAGES, "II_III").total).toBe(23);
    expect(isStageComplete(p, STAGES[1], "II_III")).toBe(false);
  });

  it("accepts decimal commas and exact fractions without accepting a wrong coefficient", () => {
    expect(parseNumber("−7/2")).toBe(-3.5);
    expect(parseNumber("15 %")).toBe(0.15);
    const t = get("tg-2-binomische-formeln").exercises[0].make(createRng(3), 1);
    const correct = fields(t).map(String);
    expect(checkTask(t, correct).status).toBe("correct");
    correct[0] = String(Number(correct[0]) + 1);
    expect(checkTask(t, correct).status).toBe("wrong");
  });

  it("resolves a card lesson deep link and ignores script-like fragments", () => {
    expect(parseTrainingDeepLink("#lesson=br-2-verhaeltnisgleichungen&level=2")).toEqual({
      lessonId: "br-2-verhaeltnisgleichungen",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>")).toEqual({});
  });
});
