import { afterEach, describe, expect, it, vi } from "vitest";
import { findLesson, LESSONS } from "../src/curriculum";
import { type Model, type Readout } from "../src/model/readout";
import {
  atpSeries,
  diffusionRate,
  divisionReadout,
  dnaComplement,
  enzymeRate,
  initialModelState,
  mean,
  MODELS,
  type ModelKind,
  modelReady,
  recordGoals,
} from "../src/models";
import {
  completion,
  freshProgress,
  isComplete,
  loadProgress,
  parseProgress,
  saveProgress,
  writingKey,
} from "../src/storage/progress";
import { renderDataset, renderModel } from "../src/ui/models";
import { canAcceptSelfAssessment, esc } from "../src/workshop";

const kinds = Object.keys(MODELS) as ModelKind[];
const states = (model: Model) =>
  model.controls.reduce<number[][]>(
    (prior, control) => prior.flatMap((state) => control.options.map((_, i) => [...state, i])),
    [[]],
  );

describe("interactive biology models", () => {
  it("uses every model in exactly one lesson", () => {
    expect(LESSONS.flatMap((lesson) => lesson.model ?? []).sort()).toEqual([...kinds].sort());
  });

  it.each(kinds)("%s has reachable goals and renders every allowed setting", (kind) => {
    const model: Model = MODELS[kind];
    const initial = initialModelState(kind);
    expect(initial).toHaveLength(model.controls.length);
    expect(model.goals.every((goal) => !goal.reached(initial))).toBe(true);
    const lesson = LESSONS.find((entry) => entry.model === kind)!;
    const goalIds: string[] = [];
    for (const state of states(model)) {
      const readout: Readout = model.read(state);
      expect(readout.summary.trim()).not.toBe("");
      if (readout.chart) {
        const { ticks, values, max } = readout.chart;
        expect(ticks.length).toBe(values.length);
        expect(ticks.length).toBeGreaterThan(1);
        expect(
          ticks
            .map(Number)
            .every((v, i) => Number.isFinite(v) && (i === 0 || v > Number(ticks[i - 1]))),
        ).toBe(true);
        expect(values.every((v) => Number.isFinite(v) && v >= 0 && v <= max)).toBe(true);
      }
      if (readout.table) {
        expect(
          readout.table.rows.every(
            (row) =>
              row.length === readout.table!.columns.length &&
              row.every((v) => (typeof v === "string" ? v.length > 0 : Number.isFinite(v))),
          ),
        ).toBe(true);
      }
      expect(renderModel(lesson, [], state)).not.toMatch(/\b(undefined|NaN|Infinity)\b/);
      goalIds.splice(0, goalIds.length, ...recordGoals(kind, goalIds, state));
    }
    expect(new Set(goalIds)).toEqual(new Set(model.goals.map((goal) => goal.id)));
    expect(modelReady(kind, goalIds)).toBe(true);
  });

  it("varies the enzyme inputs independently and saturates as substrate grows", () => {
    expect(enzymeRate([2, 2, 0])).toBe(0);
    expect(enzymeRate([2, 2, 3])).toBeGreaterThan(enzymeRate([0, 2, 3]));
    expect(enzymeRate([3, 2, 3])).toBeLessThan(enzymeRate([2, 2, 3]));
    expect(enzymeRate([2, 0, 3])).toBeLessThan(enzymeRate([2, 2, 3]));
    const readings = [0, 1, 2, 3, 4].map((s) => enzymeRate([2, 2, s]));
    expect(readings[4] - readings[3]).toBeLessThan(readings[1] - readings[0]);
    expect(mean([6, 5, 7])).toBe(6);
  });

  it("has no net diffusion without a gradient, and doubled area can offset doubled distance", () => {
    expect(diffusionRate([2, 0, 0])).toBe(0);
    expect(diffusionRate([0, 0, 1])).toBe(2);
    expect(diffusionRate([1, 1, 1])).toBe(2);
    expect(diffusionRate([0, 1, 1])).toBe(1);
  });

  it("reuses ATP and ADP and shows when a demand cannot be met", () => {
    const steady = atpSeries(5, 5);
    expect(steady.every((step) => step.atp === 8 && step.used === 5 && step.made === 5)).toBe(true);
    expect(atpSeries(3, 5)[1].atp).toBe(4);
    expect(atpSeries(0, 5).map((step) => step.used)).toEqual([5, 3, 0, 0]);
    expect(atpSeries(7, 0).every(({ atp, adp }) => atp + adp === 12 && atp <= 12 && adp >= 0)).toBe(
      true,
    );
  });

  it("pairs DNA correctly and halves chromosome count before sister chromatids separate", () => {
    expect(dnaComplement("CAGT")).toBe("GTCA");
    expect(dnaComplement("AU")).toBeNull();
    expect(divisionReadout(0, false)).toMatchObject({ nuclei: 1, chromosomes: 4, chromatids: 4 });
    expect(divisionReadout(1, false)).toMatchObject({ nuclei: 1, chromosomes: 4, chromatids: 8 });
    expect(divisionReadout(2, false)).toMatchObject({
      nuclei: 2,
      chromosomes: 2,
      chromatids: 4,
      left: "1m + 2m",
    });
    expect(divisionReadout(3, true)).toMatchObject({
      nuclei: 4,
      chromosomes: 2,
      chromatids: 2,
      left: "1m + 2v",
    });
  });

  it("produces two complementary combinations in one model meiosis and four across orientations", () => {
    const combinations = [false, true].flatMap((orientation) => {
      const { left, right, nuclei } = divisionReadout(3, orientation);
      expect(nuclei).toBe(4);
      expect(left).not.toBe(right);
      expect(left + right).toContain("1m");
      expect(left + right).toContain("1v");
      expect(left + right).toContain("2m");
      expect(left + right).toContain("2v");
      return [left, right];
    });
    expect(new Set(combinations).size).toBe(4);
    const separated = MODELS.teilung.goals.find(({ id }) => id === "schwestern")!;
    expect([0, 1, 2, 3].map((phase) => separated.reached([phase, 0]))).toEqual([
      false,
      false,
      false,
      true,
    ]);
  });

  it("renders bacterial growth as a numeric curve and an equivalent table", () => {
    const dataset = findLesson("bakterien-und-viren")!.dataset!;
    expect(dataset.ticks.map(Number)).toEqual([0, 1, 2, 3, 4, 5, 6]);
    expect(dataset.values.slice(0, 3)).toEqual([100, 200, 400]);
    expect(dataset.values.at(-1)).toBe(dataset.values.at(-2));
    expect(dataset.values.every((value) => Number.isFinite(value) && value <= dataset.max)).toBe(
      true,
    );
    const markup = renderDataset(dataset);
    expect(markup).toContain('<svg class="bio-figure"');
    expect(markup).toContain("<caption>" + dataset.caption + "</caption>");
    expect(markup.match(/<td>/g)).toHaveLength(dataset.values.length * 2);
    expect(markup).not.toMatch(/\b(undefined|NaN|Infinity)\b/);
  });

  it("keeps the movement comparison separate from the feeding comparison", () => {
    expect(MODELS.attrappe.read([2, 0]).table?.rows[0].slice(2)).toEqual([8, 2]);
    expect(MODELS.attrappe.read([1, 0]).table?.rows[0].slice(2)).toEqual([2, 8]);
    expect(MODELS.attrappe.read([2, 1]).table?.rows[0].slice(2)).toEqual([3, 7]);
    expect(MODELS.synapse.read([1, 1]).diagram).toMatchObject({ active: 1 });
    expect(MODELS.synapse.read([1, 0]).diagram).toMatchObject({ active: 2 });
  });
});

describe("local progress", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("requires workshop, check, guided rubric and any lab goals, separately from transfer", () => {
    const id = "enzymaktivitaet";
    const model = findLesson(id)!.model!;
    const progress = freshProgress();
    expect(completion(progress)).toEqual({ completed: 0, total: 28, percent: 0 });
    progress.quizDone.push(id);
    progress.workshopDone.push(id);
    progress.writingDone.push(writingKey(id, 2));
    progress.explored[id] = MODELS[model].goals.map((goal) => goal.id);
    expect(isComplete(progress, id)).toBe(false);
    progress.writingDone.push(writingKey(id, 1));
    expect(isComplete(progress, id)).toBe(true);
    progress.explored[id].pop();
    expect(isComplete(progress, id)).toBe(false);
  });

  it("rejects stale goals and rubric credit without a written answer", () => {
    const parsed = parseProgress(
      JSON.stringify({
        activeLessonId: "unknown",
        level: 9,
        quizDone: ["unknown", "immunabwehr", "immunabwehr"],
        explored: { enzymaktivitaet: ["hoch", "hoch", "unknown"] },
        writingDone: ["immunabwehr:1", "immunabwehr:2"],
        drafts: {
          "immunabwehr:1": "Zu kurz",
          "immunabwehr:2": "Das ist ein längerer eigener Antwortversuch.",
        },
      }),
    );
    expect(parsed).toMatchObject({
      activeLessonId: LESSONS[0].id,
      level: 1,
      quizDone: ["immunabwehr"],
      explored: { enzymaktivitaet: ["hoch"] },
      writingDone: ["immunabwehr:2"],
    });
    expect(
      canAcceptSelfAssessment("Eine ausführlich begründete Antwort.", [true, true, false]),
    ).toBe(false);
    expect(
      canAcceptSelfAssessment("Eine ausführlich begründete Antwort.", [true, true, true]),
    ).toBe(true);
    expect(esc("</textarea><img>")).toBe("&lt;/textarea&gt;&lt;img&gt;");
  });

  it("continues in memory if the browser refuses storage", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw Error("disabled");
      },
      setItem: () => {
        throw Error("disabled");
      },
    });
    expect(loadProgress()).toEqual(freshProgress());
    expect(saveProgress(freshProgress())).toBe(false);
  });
});
