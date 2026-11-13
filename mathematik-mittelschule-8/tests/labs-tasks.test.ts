import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "../src/curriculum";
import {
  checkTask,
  toleranceOf,
  wrongAnswerHint,
} from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { shuffleTaskChoices } from "../src/exercises/choice-order";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  applyAction,
  clampParam,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  withChanges,
} from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import type {
  ExerciseTask,
  LabDefinition,
  LabValues,
} from "../src/model/types";
import { GOAL_WITNESSES } from "./witnesses";

function labGrid(lab: LabDefinition): LabValues[] {
  const sliders = lab.params.filter((p) => p.type === "range").length;
  if (sliders <= 6) {
    const samples = sliders <= 2 ? 9 : sliders <= 3 ? 6 : sliders <= 4 ? 4 : 3;
    return enumerateLabGrid(lab, samples);
  }
  const rng = createRng(seedFrom(lab.kind));
  return Array.from({ length: 400 }, () => {
    const values = defaultLabValues(lab);
    for (const param of lab.params) {
      if (param.type === "range")
        values[param.key] = clampParam(
          param,
          param.min + rng.next() * (param.max - param.min),
        );
      if (param.type === "choice")
        values[param.key] = rng.pick(param.options).value;
    }
    return values;
  });
}

function handlePosition(
  svg: string,
  id: string,
): { x: number; y: number } | null {
  const match = new RegExp(
    `data-handle="${id}"[^>]*>\\s*<circle cx="([-\\d.]+)" cy="([-\\d.]+)"`,
  ).exec(svg);
  return match ? { x: Number(match[1]), y: Number(match[2]) } : null;
}

function answerText(task: ExerciseTask, style: "comma" | "point"): string[] {
  return task.fields.map((field) => {
    if (field.kind === "choice") return String(field.correctIndex);
    return style === "comma"
      ? fmt(field.answer, field.digits).replace("−", "-")
      : field.answer.toFixed(field.digits);
  });
}

describe("Labore", () => {
  it("start with every slider on its own range and every choice on an option", () => {
    for (const lesson of ALL_LESSONS) {
      const values = defaultLabValues(lesson.lab);
      for (const param of lesson.lab.params) {
        expect(
          clampParam(param, values[param.key]),
          `${lesson.id}.${param.key}`,
        ).toBe(values[param.key]);
      }
      expect(new Set(lesson.lab.params.map((p) => p.key)).size).toBe(
        lesson.lab.params.length,
      );
      expect(new Set(lesson.lab.readouts.map((r) => r.key)).size).toBe(
        lesson.lab.readouts.length,
      );
      expect(new Set(lesson.lab.goals.map((g) => g.id)).size).toBe(
        lesson.lab.goals.length,
      );
    }
  });

  it("give finite readouts and a clean drawing for every grid point", () => {
    for (const lesson of ALL_LESSONS) {
      const view = labView(lesson.lab.kind);
      expect(view, lesson.lab.kind).toBeDefined();
      for (const values of labGrid(lesson.lab)) {
        const readouts = computeReadouts(lesson.lab, values);
        for (const readout of lesson.lab.readouts) {
          const value = readouts[readout.key];
          if (typeof value === "number") {
            expect(
              Number.isFinite(value),
              `${lesson.id}.${readout.key} at ${JSON.stringify(values)}`,
            ).toBe(true);
          } else {
            expect(value.length, `${lesson.id}.${readout.key}`).toBeGreaterThan(
              0,
            );
          }
        }
        const svg = view.render(values, readouts);
        expect(svg.startsWith("<svg"), lesson.id).toBe(true);
        expect(svg.endsWith("</svg>"), lesson.id).toBe(true);
        expect(
          svg,
          `${lesson.id} draws NaN at ${JSON.stringify(values)}`,
        ).not.toContain("NaN");
        expect(svg, `${lesson.id} draws undefined`).not.toContain("undefined");
        expect(svg, `${lesson.id} draws Infinity`).not.toContain("Infinity");
      }
    }
  });

  it("have a reachable witness for every Laborauftrag, and the start reaches none", () => {
    for (const lesson of ALL_LESSONS) {
      const witnesses = GOAL_WITNESSES[lesson.id];
      expect(witnesses, `witnesses for ${lesson.id}`).toBeDefined();
      expect(Object.keys(witnesses).sort()).toEqual(
        lesson.lab.goals.map((g) => g.id).sort(),
      );
      for (const goal of lesson.lab.goals) {
        const witness = {
          ...defaultLabValues(lesson.lab),
          ...witnesses[goal.id],
        };
        for (const param of lesson.lab.params) {
          if (param.type === "state") continue;
          expect(
            witnesses[goal.id][param.key],
            `${lesson.id}/${goal.id} sets ${param.key}`,
          ).toBeDefined();
          expect(
            clampParam(param, witness[param.key]),
            `${lesson.id}/${goal.id}: ${param.key} is a slider value`,
          ).toBe(witness[param.key]);
        }
        const readouts = computeReadouts(lesson.lab, witness);
        expect(
          goal.check(witness, readouts),
          `${lesson.id}/${goal.id} is reached by ${JSON.stringify(witness)}`,
        ).toBe(true);
      }
      const defaults = defaultLabValues(lesson.lab);
      const atStart = lesson.lab.goals.filter((goal) =>
        goal.check(defaults, computeReadouts(lesson.lab, defaults)),
      );
      expect(
        atStart.map((g) => g.id),
        `${lesson.id} hands out goals for free`,
      ).toEqual([]);
    }
  });

  it("reach simulation trial goals cleanly via real button actions and reset cleanly", () => {
    for (const lesson of ALL_LESSONS) {
      if (!lesson.lab.actions?.length) continue;
      let values = defaultLabValues(lesson.lab);
      const runAct = lesson.lab.actions[0];
      for (let i = 0; i < 6; i++) {
        values = applyAction(lesson.lab, values, runAct.id);
      }
      expect(values.trials, lesson.id).toBeGreaterThan(0);
      const resetAct = lesson.lab.actions.find((a) => a.id === "reset");
      if (resetAct) {
        values = applyAction(lesson.lab, values, resetAct.id);
        expect(values.trials, lesson.id).toBe(0);
      }
    }
  });

  it("move every handle along with the pointer: a drag to where it is drawn changes nothing", () => {
    for (const lesson of ALL_LESSONS) {
      const view = labView(lesson.lab.kind);
      const handles = view.handles ?? {};
      const settings = [
        defaultLabValues(lesson.lab),
        ...Object.values(GOAL_WITNESSES[lesson.id] ?? {}).map((w) => ({
          ...defaultLabValues(lesson.lab),
          ...w,
        })),
      ];
      for (const [id, spec] of Object.entries(handles)) {
        for (const key of [spec.x, spec.y]) {
          if (key)
            expect(
              lesson.lab.params.some(
                (p) => p.key === key && p.type !== "state",
              ),
              `${lesson.id}: handle ${id} steps ${key}`,
            ).toBe(true);
        }
        for (const values of settings) {
          const svg = view.render(values, computeReadouts(lesson.lab, values));
          const at = handlePosition(svg, id);
          if (!at) continue;
          const changes = spec.drag(at, values);
          const moved = withChanges(lesson.lab, values, changes);
          for (const key of Object.keys(changes)) {
            const param = lesson.lab.params.find((p) => p.key === key);
            expect(
              param,
              `${lesson.id}: handle ${id} drags ${key}`,
            ).toBeDefined();
            if (param?.type !== "range") continue;
            expect(
              Math.abs(moved[key] - values[key]),
              `${lesson.id}: handle ${id} jumps on ${key} at ${JSON.stringify(values)}`,
            ).toBeLessThanOrEqual(param.step + 1e-9);
          }
        }
      }
    }
  });
});

describe("Aufgaben", () => {
  it("generate solvable tasks along the task streams learners get, on both levels", () => {
    for (const lesson of ALL_LESSONS) {
      for (const level of [1, 2] as const) {
        for (let counter = 1; counter <= 80; counter++) {
          const generator =
            lesson.exercises[(counter - 1) % lesson.exercises.length];
          const rng = createRng(seedFrom(`${lesson.id}:${level}:${counter}`));
          const task = shuffleTaskChoices(generator.make(rng, level), rng);
          const where = `${lesson.id}/${generator.id} L${level} task ${counter}`;
          expect(task.fields.length, where).toBeGreaterThan(0);
          expect(task.prompt.length, where).toBeGreaterThan(30);
          expect(
            task.steps.length,
            `${where}: a tip and a result`,
          ).toBeGreaterThanOrEqual(2);
          expect(task.steps[task.steps.length - 1], where).toContain(
            "<strong>",
          );
          if (level === 1) expect(task.formulaHint, where).toBeTruthy();
          const html = [
            task.prompt,
            ...task.given,
            ...task.steps,
            task.formulaHint ?? "",
          ].join(" ");
          expect(html, where).not.toMatch(
            /NaN|undefined|Infinity|\+ −|− −|\+ -/,
          );
          expect(
            html.replace(/<[^>]+>/g, " "),
            `${where}: hyphen as minus`,
          ).not.toMatch(/(^|[\s(=:|,{±])-\d/);
          for (const field of task.fields) {
            if (field.kind === "number") {
              expect(
                Number.isFinite(field.answer),
                `${where}: ${field.label}`,
              ).toBe(true);
              expect(toleranceOf(field), where).toBeLessThan(
                Math.abs(field.answer) * 0.05 + 0.06,
              );
            } else {
              expect(field.correctIndex, where).toBeGreaterThanOrEqual(0);
              expect(field.correctIndex, where).toBeLessThan(
                field.options.length,
              );
            }
          }
          expect(checkTask(task, answerText(task, "comma")).status, where).toBe(
            "correct",
          );
          expect(checkTask(task, answerText(task, "point")).status, where).toBe(
            "correct",
          );
          const wrong = task.fields.map((field) =>
            field.kind === "choice"
              ? String((field.correctIndex + 1) % field.options.length)
              : String(field.answer >= 0 ? -field.answer - 7 : -field.answer + 7),
          );
          const result = checkTask(task, wrong);
          expect(result.status, where).toBe("wrong");
          expect(wrongAnswerHint(task, result).length, where).toBeGreaterThan(
            10,
          );
          for (const field of task.fields) {
            if (field.kind !== "number") continue;
            for (const slip of field.slips ?? []) {
              expect(
                Math.abs(slip.value - field.answer) > toleranceOf(field),
                `${where}: slip ${slip.value} equals the answer ${field.answer}`,
              ).toBe(true);
            }
          }
        }
      }
    }
  });
});

describe("Review-Regressionen MS8", () => {
  it("allows 1 %-step changes and exact cent reversals in Prozentrechnung", () => {
    const pr2 = ALL_LESSONS.find((l) => l.id === "pr-2-skonto-umsatzsteuer")!;
    const p1Param = pr2.lab.params.find((p) => p.key === "p1")!;
    expect(p1Param.type === "range" && p1Param.step).toBe(1);
    const updated = withChanges(pr2.lab, defaultLabValues(pr2.lab), {
      p1: 7,
      p2: -3,
    });
    expect(updated.p1).toBe(7);
    expect(updated.p2).toBe(-3);

    const pr4 = ALL_LESSONS.find((l) => l.id === "pr-4-wachstumsfaktor")!;
    const revGen = pr4.exercises.find((g) => g.id === "reverse-with-q")!;
    for (let i = 0; i < 40; i++) {
      const task = revGen.make(createRng(i + 1), 2);
      const numField = task.fields.find((f) => f.kind === "number");
      if (numField && numField.kind === "number") {
        expect(Math.round(numField.answer * 100) / 100).toBe(numField.answer);
      }
    }

    const pr6 = ALL_LESSONS.find((l) => l.id === "pr-6-schaubilder-prozent")!;
    const pr6m = ALL_LESSONS.find((l) => l.id === "pr-6m-halbkreis-plus-minus")!;
    expect(pr6.tracks).toEqual(["R", "M"]);
    expect(pr6.lab.kind).toBe("percent-charts-basic");
    expect(pr6m.tracks).toEqual(["M"]);
    expect(pr6m.lab.kind).toBe("percent-diagrams-8");
  });

  it("caps Laplace probabilities at 100 % and supports 100 % hits when win >= totalSeg", () => {
    const zf1 = ALL_LESSONS.find((l) => l.id === "zf-1-zufall-laplace")!;
    const v = withChanges(zf1.lab, defaultLabValues(zf1.lab), {
      win: 7,
      totalSeg: 4,
    });
    const readouts = computeReadouts(zf1.lab, v);
    expect(readouts.theoPct).toBe(100);
    const svg = labView(zf1.lab.kind).render(v, readouts);
    expect(svg).toContain("4 von 4 Treffer");

    const spun = applyAction(zf1.lab, v, "spin-10");
    expect(spun.trials).toBe(10);
    expect(spun.hits).toBe(10);
  });

  it("clips function plots cleanly instead of flattening and marks exact squares vs approximations", () => {
    const fk1 = ALL_LESSONS.find((l) => l.id === "fk-1-zuordnungen-massstab")!;
    const v = withChanges(fk1.lab, defaultLabValues(fk1.lab), {
      kind: 1,
      m: 3,
      t: 4,
      scaleZoom: 1,
    });
    const fkSvg = labView(fk1.lab.kind).render(v, computeReadouts(fk1.lab, v));
    expect(fkSvg).toContain('<clipPath id="func-clip">');
    expect(fkSvg).toContain('clip-path="url(#func-clip)"');
    // Only p0 (0, 4) is in [0; 10]; p3 (3, 13) is outside yMax=10 and omitted
    const dotCount = (fkSvg.match(/class="lab-point"/g) ?? []).length;
    expect(dotCount).toBe(1);

    const wz1 = ALL_LESSONS.find((l) => l.id === "wz-1-quadrieren-radizieren")!;
    const vExact = { area: 64 };
    const exactSvg = labView(wz1.lab.kind).render(
      vExact,
      computeReadouts(wz1.lab, vExact),
    );
    expect(exactSvg).toContain("√64 = 8 (exakt!)");
    expect(exactSvg).not.toContain("≈");
    const vApprox = { area: 50 };
    const approxSvg = labView(wz1.lab.kind).render(
      vApprox,
      computeReadouts(wz1.lab, vApprox),
    );
    expect(approxSvg).toContain("≈");
    expect(approxSvg).toContain("&lt;");
  });

  it("aligns cylinder-liter units, sector units, and linear slope decimals", () => {
    const zy2 = ALL_LESSONS.find(
      (l) => l.id === "zy-2-zylinder-zusammengesetzt",
    )!;
    expect(zy2.lab.kind).toBe("cylinder-compound");
    const zyDefaults = defaultLabValues(zy2.lab);
    const zySvg = labView(zy2.lab.kind).render(
      zyDefaults,
      computeReadouts(zy2.lab, zyDefaults),
    );
    expect(zySvg).toContain("dm");
    expect(zySvg).toContain("dm³ (l)");

    const kf3 = ALL_LESSONS.find((l) => l.id === "kf-3-kreisring-sektor")!;
    const secRev = kf3.exercises.find((g) => g.id === "sector-area-reverse")!;
    for (let i = 0; i < 20; i++) {
      const task = secRev.make(createRng(i + 10), 1);
      const numField = task.fields.find((f) => f.kind === "number");
      if (numField && numField.kind === "number") {
        expect(numField.unit).toBe("cm²");
      }
      expect(task.prompt).toContain("cm");
    }

    const fk2 = ALL_LESSONS.find(
      (l) => l.id === "fk-2-lineare-funktionen-mxt",
    )!;
    const mAndT = fk2.exercises.find((g) => g.id === "read-m-and-t")!;
    for (let i = 0; i < 20; i++) {
      const task = mAndT.make(createRng(i + 5), 1);
      const mField = task.fields.find(
        (f) => f.kind === "number" && f.label === "Steigung m",
      );
      if (mField && mField.kind === "number") {
        expect(Math.round(mField.answer * 100) / 100).toBe(mField.answer);
      }
    }
  });
});
