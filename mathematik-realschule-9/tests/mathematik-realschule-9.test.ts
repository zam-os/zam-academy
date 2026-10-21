import { describe, expect, it } from "vitest";
import cellJson from "../cell.json";
import replacesJson from "../replaces-de-by.json";
import { ALL_LESSONS, findLessonById, lessonsForTrack, STAGES } from "../src/curriculum";
import { checkTask, parseNumber, parseNumberCandidates, toleranceOf, wrongAnswerHint } from "../src/exercises/checker";
import { factorForm, fmt, linear, quadratic, vertexForm } from "../src/exercises/format";
import { quizOrder } from "../src/exercises/quiz-order";
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
import type { ExerciseTask, LabDefinition, LabValues, NumberField } from "../src/model/types";
import {
  isLessonComplete,
  isStageComplete,
  isTransferDone,
  type LearnerProgress,
  overallStats,
  relevantLessons,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink, ZAM_ACADEMY_APP_URL } from "../src/zam/zam-link";
import { GOAL_WITNESSES, LESSON_IDS } from "./witnesses";

/**
 * The settings a lab test walks: the full grid for few sliders, a coarser
 * one for more, and 400 seeded random settings for the data labs with a
 * slider per data point.
 */
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
      if (param.type === "range") values[param.key] = clampParam(param, param.min + rng.next() * (param.max - param.min));
      if (param.type === "choice") values[param.key] = rng.pick(param.options).value;
    }
    return values;
  });
}

/** Where a handle is drawn: the centre of its circles. */
function handlePosition(svg: string, id: string): { x: number; y: number } | null {
  const match = new RegExp(`data-handle="${id}"[^>]*>\\s*<circle cx="([-\\d.]+)" cy="([-\\d.]+)"`).exec(svg);
  return match ? { x: Number(match[1]), y: Number(match[2]) } : null;
}

function answerText(task: ExerciseTask, style: "comma" | "point"): string[] {
  return task.fields.map((field) => {
    if (field.kind === "choice") return String(field.correctIndex);
    return style === "comma" ? fmt(field.answer, field.digits).replace("−", "-") : field.answer.toFixed(field.digits);
  });
}

describe("Lernpfad", () => {
  it("has five stages in LehrplanPLUS order and lessons with stable ids", () => {
    expect(STAGES.map((stage) => stage.stageNumber)).toEqual([1, 2, 3, 4, 5]);
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(new Set(LESSON_IDS).size).toBe(LESSON_IDS.length);
    for (const stage of STAGES) {
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title.startsWith(`${stage.stageNumber}.${index + 1} `), lesson.id).toBe(true);
        expect(lesson.tracks.length).toBeGreaterThan(0);
        expect(lesson.lehrplan.length).toBeGreaterThan(10);
        expect(lesson.formulas.length).toBeGreaterThan(0);
        expect(lesson.requiredCorrect).toBeGreaterThanOrEqual(2);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
        expect(lesson.lab.goals.length).toBe(3);
        expect(new Set(lesson.exercises.map((e) => e.id)).size).toBe(lesson.exercises.length);
      });
    }
  });

  it("puts Raumgeometrie and the quadratic functions in Zweig I only, as LehrplanPLUS does", () => {
    const trackI = lessonsForTrack("I").map((lesson) => lesson.id);
    const trackII = lessonsForTrack("II_III").map((lesson) => lesson.id);
    expect(trackI).toEqual(LESSON_IDS);
    for (const id of trackII) expect(id.startsWith("qf-") || id.startsWith("rg-"), id).toBe(false);
    for (const prefix of ["rd-", "kr-", "lg-", "dz-"]) {
      expect(trackII.some((id) => id.startsWith(prefix)), prefix).toBe(true);
    }
  });

  it("shows the right quick-check answer at different positions across lessons", () => {
    const shownAt = new Set<number>();
    for (const lesson of ALL_LESSONS) {
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(new Set(lesson.quiz.options).size).toBe(lesson.quiz.options.length);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(20);
      const order = quizOrder(lesson);
      expect([...order].sort()).toEqual(lesson.quiz.options.map((_, i) => i));
      shownAt.add(order.indexOf(lesson.quiz.correctIndex));
    }
    expect([...shownAt].sort()).toEqual([0, 1, 2]);
  });

  it("provides a teacher explainer video for every lesson with a verified YouTube link", () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.teacherVideo, `Missing teacherVideo in lesson ${lesson.id}`).toBeDefined();
      expect(lesson.teacherVideo?.author).toBe("Daniel Jung");
      expect(lesson.teacherVideo?.title.length).toBeGreaterThan(5);
      expect(lesson.teacherVideo?.url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=[A-Za-z0-9_-]{11}$/);
    }
  });
});

describe("Labore", () => {
  it("start with every slider on its own range and every choice on an option", () => {
    for (const lesson of ALL_LESSONS) {
      const values = defaultLabValues(lesson.lab);
      for (const param of lesson.lab.params) {
        expect(clampParam(param, values[param.key]), `${lesson.id}.${param.key}`).toBe(values[param.key]);
      }
      expect(new Set(lesson.lab.params.map((p) => p.key)).size).toBe(lesson.lab.params.length);
      expect(new Set(lesson.lab.readouts.map((r) => r.key)).size).toBe(lesson.lab.readouts.length);
      expect(new Set(lesson.lab.goals.map((g) => g.id)).size).toBe(lesson.lab.goals.length);
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
            expect(Number.isFinite(value), `${lesson.id}.${readout.key} at ${JSON.stringify(values)}`).toBe(true);
          } else {
            expect(value.length, `${lesson.id}.${readout.key}`).toBeGreaterThan(0);
          }
        }
        const svg = view.render(values, readouts);
        expect(svg.startsWith("<svg"), lesson.id).toBe(true);
        expect(svg.endsWith("</svg>"), lesson.id).toBe(true);
        expect(svg, `${lesson.id} draws NaN at ${JSON.stringify(values)}`).not.toContain("NaN");
        expect(svg, `${lesson.id} draws undefined`).not.toContain("undefined");
        expect(svg, `${lesson.id} draws Infinity`).not.toContain("Infinity");
      }
    }
  });

  it("have a reachable witness for every Laborauftrag, and the start reaches none", () => {
    for (const lesson of ALL_LESSONS) {
      const witnesses = GOAL_WITNESSES[lesson.id];
      expect(witnesses, `witnesses for ${lesson.id}`).toBeDefined();
      expect(Object.keys(witnesses).sort()).toEqual(lesson.lab.goals.map((g) => g.id).sort());
      for (const goal of lesson.lab.goals) {
        const witness = { ...defaultLabValues(lesson.lab), ...witnesses[goal.id] };
        for (const param of lesson.lab.params) {
          if (param.type === "state") continue;
          expect(witnesses[goal.id][param.key], `${lesson.id}/${goal.id} sets ${param.key}`).toBeDefined();
          expect(clampParam(param, witness[param.key]), `${lesson.id}/${goal.id}: ${param.key} is a slider value`).toBe(witness[param.key]);
        }
        const readouts = computeReadouts(lesson.lab, witness);
        expect(goal.check(witness, readouts), `${lesson.id}/${goal.id} is reached by ${JSON.stringify(witness)}`).toBe(true);
      }
      const defaults = defaultLabValues(lesson.lab);
      const atStart = lesson.lab.goals.filter((goal) => goal.check(defaults, computeReadouts(lesson.lab, defaults)));
      expect(atStart.map((g) => g.id), `${lesson.id} hands out goals for free`).toEqual([]);
    }
  });

  it("move every handle along with the pointer: a drag to where it is drawn changes nothing", () => {
    for (const lesson of ALL_LESSONS) {
      const view = labView(lesson.lab.kind);
      const handles = view.handles ?? {};
      const settings = [defaultLabValues(lesson.lab), ...Object.values(GOAL_WITNESSES[lesson.id] ?? {}).map((w) => ({ ...defaultLabValues(lesson.lab), ...w }))];
      for (const [id, spec] of Object.entries(handles)) {
        for (const key of [spec.x, spec.y]) {
          if (key) expect(lesson.lab.params.some((p) => p.key === key && p.type !== "state"), `${lesson.id}: handle ${id} steps ${key}`).toBe(true);
        }
        for (const values of settings) {
          const svg = view.render(values, computeReadouts(lesson.lab, values));
          const at = handlePosition(svg, id);
          if (!at) continue; // a handle may be hidden in another view of the lab
          const changes = spec.drag(at, values);
          const moved = withChanges(lesson.lab, values, changes);
          for (const key of Object.keys(changes)) {
            const param = lesson.lab.params.find((p) => p.key === key);
            expect(param, `${lesson.id}: handle ${id} drags ${key}`).toBeDefined();
            if (param?.type !== "range") continue;
            expect(Math.abs(moved[key] - values[key]), `${lesson.id}: handle ${id} jumps on ${key} at ${JSON.stringify(values)}`).toBeLessThanOrEqual(param.step + 1e-9);
          }
        }
      }
    }
  });

  it("run their actions without leaving the ranges, and changing a slider starts a simulation over", () => {
    for (const lesson of ALL_LESSONS) {
      for (const action of lesson.lab.actions ?? []) {
        let values = defaultLabValues(lesson.lab);
        for (let i = 0; i < 5; i++) values = applyAction(lesson.lab, values, action.id);
        for (const param of lesson.lab.params) {
          expect(Number.isFinite(values[param.key]), `${lesson.id}/${action.id} ${param.key}`).toBe(true);
          expect(clampParam(param, values[param.key])).toBe(values[param.key]);
        }
        const readouts = computeReadouts(lesson.lab, values);
        expect(labView(lesson.lab.kind).render(values, readouts)).not.toContain("NaN");
        const slider = lesson.lab.params.find((p) => p.type === "range" || p.type === "choice");
        const states = lesson.lab.params.filter((p) => p.type === "state" && p.resetOnChange);
        if (slider && states.length > 0) {
          const other = slider.type === "range" ? (values[slider.key] === slider.max ? slider.min : slider.max) : slider.options.find((o) => o.value !== values[slider.key])!.value;
          const changed = withChanges(lesson.lab, values, { [slider.key]: other });
          for (const state of states) expect(changed[state.key], `${lesson.id}: ${state.key} restarts`).toBe(state.value);
        }
      }
    }
  });
});

describe("Simulationen", () => {
  it("reach the simulation goal of the urn by pressing „100× ziehen“ five times", () => {
    const lesson = findLessonById("dz-1-baumdiagramm")!.lesson;
    let values = defaultLabValues(lesson.lab);
    for (let i = 0; i < 5; i++) values = applyAction(lesson.lab, values, "hundert");
    const goal = lesson.lab.goals.find((g) => g.id === "simulation")!;
    expect(values.n).toBe(500);
    expect(goal.check(values, computeReadouts(lesson.lab, values))).toBe(true);
  });

  it("count series with at least one success close to the probability", () => {
    const lesson = findLessonById("dz-2-gegenereignis")!.lesson;
    let values = withChanges(lesson.lab, defaultLabValues(lesson.lab), { n: 4 });
    for (let i = 0; i < 10; i++) values = applyAction(lesson.lab, values, "hundert");
    expect(values.series).toBe(1000);
    expect(Math.abs(values.hits / values.series - (1 - (5 / 6) ** 4))).toBeLessThan(0.05);
  });
});

describe("Aufgaben", () => {
  it("generate solvable tasks along the task streams learners get, on both levels", () => {
    for (const lesson of ALL_LESSONS) {
      for (const level of [1, 2] as const) {
        // The app seeds task number `counter` of a lesson and level exactly so
        // (main.ts, startTask), alternating between the lesson's generators.
        for (let counter = 1; counter <= 80; counter++) {
          const generator = lesson.exercises[(counter - 1) % lesson.exercises.length];
          const task = generator.make(createRng(seedFrom(`${lesson.id}:${level}:${counter}`)), level);
          const where = `${lesson.id}/${generator.id} L${level} task ${counter}`;
          expect(task.fields.length, where).toBeGreaterThan(0);
          expect(task.prompt.length, where).toBeGreaterThan(30);
          expect(task.steps.length, `${where}: a tip and a result`).toBeGreaterThanOrEqual(2);
          expect(task.steps[task.steps.length - 1], where).toContain("<strong>");
          if (level === 1) expect(task.formulaHint, where).toBeTruthy();
          const html = [task.prompt, ...task.given, ...task.steps, task.formulaHint ?? ""].join(" ");
          expect(html, where).not.toMatch(/NaN|undefined|Infinity|\+ −|− −|\+ -/);
          // Negative numbers carry a real minus sign (−), as fmt() writes them.
          expect(html.replace(/<[^>]+>/g, " "), `${where}: hyphen as minus`).not.toMatch(/(^|[\s(=:|,{±])-\d/);
          for (const field of task.fields) {
            if (field.kind === "number") {
              expect(Number.isFinite(field.answer), `${where}: ${field.label}`).toBe(true);
              expect(toleranceOf(field), where).toBeLessThan(Math.abs(field.answer) * 0.05 + 0.06);
            } else {
              expect(field.correctIndex, where).toBeGreaterThanOrEqual(0);
              expect(field.correctIndex, where).toBeLessThan(field.options.length);
            }
          }
          // The learner types the rounded result with a decimal comma or point.
          expect(checkTask(task, answerText(task, "comma")).status, where).toBe("correct");
          expect(checkTask(task, answerText(task, "point")).status, where).toBe("correct");
          // With any order, reversed number fields are right too.
          if (task.anyOrder?.length) {
            const typed = answerText(task, "comma");
            const swappable = task.anyOrder;
            const reversed = [...typed];
            swappable.forEach((index, k) => (reversed[index] = typed[swappable[swappable.length - 1 - k]]));
            expect(checkTask(task, reversed).status, `${where} reversed`).toBe("correct");
            for (const index of swappable) expect(task.fields[index].kind, where).toBe("number");
          }
          // A value far off is wrong, and the hint says something.
          const wrong = task.fields.map((field) =>
            field.kind === "choice" ? String((field.correctIndex + 1) % field.options.length) : String(field.answer * 3 + 7),
          );
          const result = checkTask(task, wrong);
          expect(result.status, where).toBe("wrong");
          expect(wrongAnswerHint(task, result).length, where).toBeGreaterThan(10);
          // Every slip the task predicts is a wrong answer.
          for (const field of task.fields) {
            if (field.kind !== "number") continue;
            for (const slip of field.slips ?? []) {
              expect(Math.abs(slip.value - field.answer) > toleranceOf(field), `${where}: slip ${slip.value} equals the answer ${field.answer}`).toBe(true);
            }
          }
        }
      }
    }
  });
});

describe("Entscheidungen in Aufgaben", () => {
  const generator = (lessonId: string, id: string) => {
    const found = findLessonById(lessonId)?.lesson.exercises.find((exercise) => exercise.id === id);
    if (!found) throw new Error(`${lessonId}/${id}`);
    return found;
  };
  const number = (text: string) => Number(text.replace(",", "."));
  const SEEDS = Array.from({ length: 400 }, (_, i) => seedFrom(`decision:${i}`));

  it("say yes or no only where the rounded answer says the same: the wardrobe and the ceiling", () => {
    let seen = 0;
    for (const seed of SEEDS) {
      const task = generator("rd-1-pythagoras", "hypotenuse").make(createRng(seed), 2);
      const ceilingText = task.given.find((line) => line.startsWith("Raumhöhe"));
      if (!ceilingText) continue;
      seen += 1;
      const ceiling = number(/([\d,]+) cm/.exec(ceilingText)![1]);
      const [diagonal, fits] = task.fields;
      if (diagonal.kind !== "number" || fits.kind !== "choice") throw new Error("fields");
      expect(Math.abs(diagonal.answer - ceiling), `seed ${seed}`).toBeGreaterThanOrEqual(1);
      expect(fits.correctIndex === 0, `seed ${seed}`).toBe(Number(diagonal.answer.toFixed(1)) < ceiling);
    }
    expect(seen).toBeGreaterThan(100);
  });

  it("say yes or no only where the rounded answer says the same: the log and the gate", () => {
    for (const seed of SEEDS) {
      const task = generator("kr-1-kreiszahl", "radius-aus-umfang").make(createRng(seed), 2);
      const gate = number(/Torbreite (\d+) cm/.exec(task.given.join(" "))![1]) / 100;
      const [diameter, fits] = task.fields;
      if (diameter.kind !== "number" || fits.kind !== "choice") throw new Error("fields");
      expect(Math.abs(diameter.answer - gate), `seed ${seed}`).toBeGreaterThanOrEqual(0.01);
      expect(fits.correctIndex === 0, `seed ${seed}`).toBe(Number(diameter.answer.toFixed(2)) < gate);
    }
  });

  it("state only triangles that exist", () => {
    for (const seed of SEEDS) {
      for (const id of ["pruefen", "winkelart"]) {
        const task = generator("rd-2-umkehrung", id).make(createRng(seed), 1);
        const sides = [...task.prompt.matchAll(/([\d,]+) cm/g)].map((match) => number(match[1])).sort((a, b) => a - b);
        expect(sides, `${id} seed ${seed}: ${task.prompt}`).toHaveLength(3);
        expect(sides[0] + sides[1], `${id} seed ${seed}: ${task.prompt}`).toBeGreaterThan(sides[2]);
      }
    }
  });

  it("let the candles meet while both still burn", () => {
    for (const seed of SEEDS) {
      const task = generator("lg-4-loesungsfaelle", "fall").make(createRng(seed), 2);
      const [, a, rateA, b, rateB] = /A ist (\d+) cm lang und brennt in jeder Stunde ([\d,]+) cm ab\. Kerze B ist (\d+) cm lang und brennt ([\d,]+) cm/.exec(task.prompt)!.map(number);
      const asked = task.fields[1];
      if (asked.kind !== "number") throw new Error("fields");
      // At the meeting time, or after the 3 h asked for, both candles are still at least 1 cm long.
      const hours = asked.label.startsWith("gleich lang") ? asked.answer : 3;
      expect(Math.min(a - rateA * hours, b - rateB * hours), `seed ${seed}: ${task.prompt}`).toBeGreaterThanOrEqual(1);
    }
  });

  it("show n − 1 tries visibly under the target probability", () => {
    for (const seed of SEEDS) {
      const task = generator("dz-2-gegenereignis", "mindestens").make(createRng(seed), 2);
      const target = number(/mindestens (\d+) %/.exec(task.given.join(" "))![1]);
      const [before, after] = [...task.steps[1].matchAll(/([\d,]+) %/g)].map((match) => number(match[1]));
      expect(before, `seed ${seed}: ${task.steps[1]}`).toBeLessThan(target);
      expect(after, `seed ${seed}: ${task.steps[1]}`).toBeGreaterThanOrEqual(target);
    }
  });
});

describe("Prüfen der Eingabe", () => {
  const field = (answer: number, digits = 2, unit = ""): NumberField => ({ kind: "number", label: "x =", answer, unit, digits });
  const task = (...fields: NumberField[]): ExerciseTask => ({ prompt: "", given: [], fields, steps: ["", "<strong></strong>"] });

  it("reads numbers, fractions, multiples of π and percentages the way learners type them", () => {
    expect(parseNumber("2,5")).toBe(2.5);
    expect(parseNumber("2.5")).toBe(2.5);
    expect(parseNumberCandidates("1.500")).toEqual([1.5, 1500]);
    expect(parseNumber("1.234,5")).toBe(1234.5);
    expect(parseNumber("−3,2")).toBe(-3.2);
    expect(parseNumber("x = 4")).toBe(4);
    expect(parseNumber("12 cm²")).toBe(12);
    expect(parseNumber("3/5")).toBeCloseTo(0.6);
    expect(parseNumber("-7/2")).toBeCloseTo(-3.5);
    expect(parseNumber("60 %")).toBeCloseTo(0.6);
    expect(parseNumber("60 %", "%")).toBe(60);
    expect(parseNumber("4π")).toBeCloseTo(4 * Math.PI);
    expect(parseNumber("2·π")).toBeCloseTo(2 * Math.PI);
    expect(parseNumber("pi")).toBeCloseTo(Math.PI);
    expect(parseNumber("π/2")).toBeCloseTo(Math.PI / 2);
    expect(parseNumber("4/3π")).toBeCloseTo((4 * Math.PI) / 3);
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("1/0")).toBeNull();
    expect(parseNumber("")).toBeNull();
  });

  it("wants exact answers exact and accepts rounding for the others", () => {
    expect(checkTask(task(field(3, 0)), ["3"]).status).toBe("correct");
    expect(checkTask(task(field(3, 0)), ["3,4"]).status).toBe("wrong");
    expect(checkTask(task(field(Math.sqrt(52), 2)), ["7,21"]).status).toBe("correct");
    expect(checkTask(task(field(Math.sqrt(52), 2)), ["7,2"]).status).toBe("correct");
    expect(checkTask(task(field(Math.sqrt(52), 2)), ["7,3"]).status).toBe("wrong");
    expect(checkTask(task(field(1 / 3, 2)), ["1/3"]).status).toBe("correct");
    expect(checkTask(task(field(0.6, 2)), ["60 %"]).status).toBe("correct");
    expect(checkTask(task(field(12 * Math.PI, 2)), ["12π"]).status).toBe("correct");
  });

  it("accepts both solutions in any order only where the task says so", () => {
    const solutions = { ...task(field(2, 0), field(-5, 0)), anyOrder: [0, 1] };
    expect(checkTask(solutions, ["-5", "2"]).status).toBe("correct");
    const point = task(field(2, 0), field(-5, 0));
    const swapped = checkTask(point, ["-5", "2"]);
    expect(swapped.status).toBe("wrong");
    expect(wrongAnswerHint(point, swapped)).toContain("vertauscht");
  });

  it("names the predicted slip, the sign and a forgotten π", () => {
    const slip = task({ ...field(5, 2), slips: [{ value: 25, hint: "Das ist c². Ziehe noch die Wurzel." }] });
    expect(wrongAnswerHint(slip, checkTask(slip, ["25"]))).toContain("Wurzel");
    const sign = task(field(4, 0));
    expect(wrongAnswerHint(sign, checkTask(sign, ["-4"]))).toContain("Vorzeichen");
    const pi = task(field(9 * Math.PI, 2));
    expect(wrongAnswerHint(pi, checkTask(pi, ["9"]))).toContain("π");
    const empty = task(field(1, 0), field(2, 0));
    expect(checkTask(empty, ["1", ""]).status).toBe("invalid");
  });

  it("writes terms the way the blackboard does", () => {
    expect(linear(0.5, -2)).toBe("0,5x − 2");
    expect(linear(-1, 0)).toBe("−x");
    expect(quadratic(2, -4, -6)).toBe("2x² − 4x − 6");
    expect(quadratic(1, 0, 0)).toBe("x²");
    expect(vertexForm(1, 3, 5)).toBe("(x − 3)² + 5");
    expect(vertexForm(-0.5, -2, 0)).toBe("−0,5(x + 2)²");
    expect(factorForm(1, 2, -5)).toBe("(x − 2)(x + 5)");
    expect(factorForm(2, 0, 5)).toBe("2x(x − 5)");
    expect(factorForm(-1, 3, 3)).toBe("−(x − 3)²");
  });
});

describe("Lektionsabschluss", () => {
  const blank = (): LearnerProgress => ({
    activeLessonId: LESSON_IDS[0],
    difficultyLevel: 1,
    trackFilter: "alle",
    quizDone: [],
    labGoals: {},
    solved: {},
    attempts: {},
    celebratedStageIds: [],
    celebratedLessonIds: [],
  });

  it("needs the quick check, every lab goal and the required Level-1 tasks; the transfer badge needs Level 2 too", () => {
    const progress = blank();
    const lesson = ALL_LESSONS[0];
    expect(isLessonComplete(progress, lesson)).toBe(false);
    progress.quizDone.push(lesson.id);
    progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect - 1, 2: lesson.requiredCorrect };
    expect(isLessonComplete(progress, lesson)).toBe(false);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: 0 };
    expect(isLessonComplete(progress, lesson)).toBe(true);
    expect(isTransferDone(progress, lesson)).toBe(false);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: lesson.requiredCorrect };
    expect(isTransferDone(progress, lesson)).toBe(true);
  });

  it("counts only the lessons of the chosen Zweig: Zweig II/III has no quadratic functions in grade 9", () => {
    const progress = blank();
    const quadratisch = STAGES[3];
    expect(relevantLessons(quadratisch, "II_III")).toHaveLength(0);
    expect(isStageComplete(progress, quadratisch, "II_III")).toBe(false);
    expect(overallStats(progress, STAGES, "II_III").totalStages).toBe(4);
    expect(overallStats(progress, STAGES, "I").totalStages).toBe(5);
    expect(overallStats(progress, STAGES, "alle").total).toBe(LESSON_IDS.length);
    const kreis = STAGES[1];
    for (const lesson of relevantLessons(kreis, "II_III")) {
      progress.quizDone.push(lesson.id);
      progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
      progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: 0 };
    }
    expect(isStageComplete(progress, kreis, "II_III")).toBe(true);
    expect(isStageComplete(progress, kreis, "I")).toBe(false);
  });
});

describe("Links from ZAM cards", () => {
  it("opens every lesson from the link a card cites", () => {
    for (const lesson of ALL_LESSONS) {
      const link = lessonLink(lesson.id);
      expect(link.startsWith(`${ZAM_ACADEMY_APP_URL}#lesson=`)).toBe(true);
      const hash = link.slice(link.indexOf("#"));
      expect(parseTrainingDeepLink(hash).lessonId).toBe(lesson.id);
      expect(findLessonById(lesson.id)?.lesson.id).toBe(lesson.id);
    }
  });

  it("reads the level next to the lesson and ignores values that are no lesson id", () => {
    expect(parseTrainingDeepLink("#lesson=rd-1-pythagoras&level=2")).toEqual({ lessonId: "rd-1-pythagoras", level: 2 });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E")).toEqual({});
    expect(parseTrainingDeepLink("")).toEqual({});
  });
});

describe("ZAM-Zelle (cell.json)", () => {
  interface CellBinding {
    provider: string;
    school_type?: string;
    grade?: number;
    track?: string;
    subject?: string;
    topic_code: string;
  }
  interface CellSegment {
    type: string;
    text?: string;
    tex?: string;
    speech?: string;
  }
  interface CellItem {
    id: string;
    slug: string;
    tier?: string;
    bloom_level: number;
    source_link?: string;
    question?: string;
    concept?: string;
    question_segments?: CellSegment[];
    concept_segments?: CellSegment[];
    fast_check?: { options: string[]; correct_index: number };
    choice_distractors?: Array<{ text: string; reason?: string }>;
    replaces?: string[];
  }
  interface CellAtom {
    id: string;
    slug: string;
    source_link?: string;
    prerequisites?: Array<{ atom_id: string }>;
    curricula?: CellBinding[];
    practice_items: CellItem[];
  }
  const cell = cellJson as unknown as { tile_id: string; version: string; atoms: CellAtom[] };
  const items = cell.atoms.flatMap((atom) => atom.practice_items);
  const prefix = `${ZAM_ACADEMY_APP_URL}#lesson=`;
  const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/;
  const lessonOf = (link: string | undefined) => (link?.startsWith(prefix) ? link.slice(prefix.length) : "");

  /** LehrplanPLUS M9: the Lernbereich of each lesson family per Zweig. */
  const LERNBEREICH: Record<string, Partial<Record<string, string>>> = {
    rd: { I: "lb3", II_III: "lb3" },
    kr: { I: "lb4", II_III: "lb4" },
    rg: { I: "lb5" },
    lg: { I: "lb6", II_III: "lb6" },
    qf: { I: "lb7" },
    dz: { I: "lb8", II_III: "lb7" },
  };

  it("is the cell of this app with one atom per lesson, in lesson order", () => {
    expect(cell.tile_id).toBe("zam-academy:mathematik-realschule-9");
    expect(/^\d+(\.\d+)*$/.test(cell.version)).toBe(true);
    expect(cell.atoms.map((atom) => lessonOf(atom.source_link))).toEqual(ALL_LESSONS.map((lesson) => lesson.id));
  });

  it("cites for every card the lesson of its atom, and binds the atom to its stage and Lernbereich", () => {
    for (const atom of cell.atoms) {
      const lessonId = lessonOf(atom.source_link);
      const found = findLessonById(lessonId);
      expect(found, `${atom.id} cites ${atom.source_link}`).toBeDefined();
      const { stage, lesson } = found!;
      const academy = atom.curricula?.find((binding) => binding.provider === "zam-academy");
      expect(academy?.topic_code, `${atom.slug} is bound to its stage`).toBe(stage.id);
      const lehrplan = (atom.curricula ?? []).filter((binding) => binding.provider === "lehrplanplus-bayern");
      for (const binding of lehrplan) {
        expect(binding.school_type).toBe("realschule");
        expect(binding.grade).toBe(9);
        expect(binding.subject).toBe("mathematik");
        expect(binding.topic_code, `${atom.slug} in Zweig ${binding.track}`).toBe(LERNBEREICH[lessonId.slice(0, 2)][binding.track ?? ""]);
      }
      expect(lehrplan.map((binding) => binding.track).sort(), `${atom.slug} carries the lesson's Zweige`).toEqual([...lesson.tracks].sort());
      expect(atom.practice_items.length, `${atom.slug} has cards`).toBeGreaterThanOrEqual(2);
      for (const item of atom.practice_items) {
        expect(lessonOf(item.source_link), `${item.id} cites its atom's lesson`).toBe(lessonId);
      }
    }
  });

  it("keeps fixed ids: atoms A01–A29 and cards K001–K108 in lesson order", () => {
    expect(cell.atoms.map((atom) => atom.id)).toEqual(
      Array.from({ length: 29 }, (_, i) => `01K8MATH9RS000000000000A${String(i + 1).padStart(2, "0")}`),
    );
    expect(items.map((item) => item.id)).toEqual(
      Array.from({ length: 108 }, (_, i) => `01K8MATH9RS00000000000K${String(i + 1).padStart(3, "0")}`),
    );
  });

  it("has well-formed cards: ULID-shaped ids, unique slugs, valid fast checks, formulas with speech", () => {
    const ids = new Set<string>();
    const slugs = new Set<string>();
    for (const atom of cell.atoms) {
      expect(ULID.test(atom.id), atom.id).toBe(true);
      expect(ids.has(atom.id)).toBe(false);
      ids.add(atom.id);
      for (const prereq of atom.prerequisites ?? []) {
        expect(cell.atoms.some((other) => other.id === prereq.atom_id), `${atom.slug} needs ${prereq.atom_id}`).toBe(true);
      }
      for (const item of atom.practice_items) {
        expect(ULID.test(item.id), item.id).toBe(true);
        expect(ids.has(item.id), `${item.id} is unique`).toBe(false);
        ids.add(item.id);
        expect(slugs.has(item.slug), `${item.slug} is unique`).toBe(false);
        slugs.add(item.slug);
        expect(item.bloom_level).toBeGreaterThanOrEqual(1);
        expect(item.bloom_level).toBeLessThanOrEqual(3);
        const hasQuestion = Boolean(item.question) || Boolean(item.question_segments?.length);
        const hasConcept = Boolean(item.concept) || Boolean(item.concept_segments?.length);
        expect(hasQuestion && hasConcept, `${item.slug} has question and answer`).toBe(true);
        for (const segment of [...(item.question_segments ?? []), ...(item.concept_segments ?? [])]) {
          if (segment.type === "math") {
            expect(segment.speech, `${item.slug}: formula ${segment.tex} is spoken`).toBeTruthy();
            expect(segment.speech).not.toMatch(/[\\$<]/);
          } else {
            expect(segment.text, `${item.slug}: text segment`).toBeTruthy();
            expect(segment.text).not.toMatch(/[$\\]|<[a-z]/);
          }
        }
        for (const plain of [item.question, item.concept]) {
          if (plain) expect(plain, `${item.slug}: no markup in plain text`).not.toMatch(/\$|\\[a-z]|\*\*/);
        }
        if (item.tier === "tier1_fast") {
          expect(item.fast_check, `${item.slug} has a fast check`).toBeDefined();
        }
        if (item.fast_check) {
          expect(item.fast_check.options.length).toBe(2);
          expect(item.fast_check.correct_index).toBe(0);
        }
        expect(item.choice_distractors?.length, `${item.slug} has distractors`).toBe(2);
        for (const distractor of item.choice_distractors ?? []) {
          expect(distractor.reason, `${item.slug}: every distractor says why`).toBeTruthy();
        }
      }
    }
    expect(ids.size).toBe(cell.atoms.length + items.length);
  });

  it("writes minus signs as − in every text a learner reads", () => {
    for (const item of items) {
      const texts = [
        item.question,
        item.concept,
        ...(item.question_segments ?? []).map((segment) => segment.text),
        ...(item.concept_segments ?? []).map((segment) => segment.text),
        ...(item.fast_check?.options ?? []),
        ...(item.choice_distractors ?? []).flatMap((distractor) => [distractor.text, distractor.reason]),
      ];
      for (const text of texts) {
        if (text) expect(text, item.slug).not.toMatch(/(^|[\s(|=])-(?=[\s\d(a-zα-ω])/);
      }
    }
  });

  describe("replaces the five de-by Realschule 9 mathematics cells as approved", () => {
    interface MappingRow {
      de_by_cell: string;
      de_by_id: string;
      de_by_question: string;
      category: "A" | "B" | "C";
      academy_slug?: string;
      note?: string;
    }
    const table = replacesJson as unknown as { approved: string | null; source?: string; rows: MappingRow[] };
    const bySlug = new Map(items.map((item) => [item.slug, item]));
    const DE_BY = /^01K4[TKSQ]9[MP]0000000000000000[0-9A-Z]{3}$/;

    it("records who approved it and where", () => {
      expect(table.approved).toBe("2026-10-20");
      expect(table.source).toMatch(/^https:\/\/github\.com\/zam-os\/zam-academy\/pull\/9#issuecomment-\d+$/);
    });

    it("lists every de-by item exactly once, 41 A, 4 B and 4 C", () => {
      expect(table.rows).toHaveLength(49);
      const ids = table.rows.map((row) => row.de_by_id);
      expect(new Set(ids).size).toBe(49);
      for (const id of ids) expect(DE_BY.test(id), id).toBe(true);
      expect(new Set(table.rows.map((row) => row.de_by_cell))).toEqual(
        new Set([
          "de-by:realschule-9-mathematik-pythagoras-trigonometrie",
          "de-by:realschule-9-mathematik-kreis-raumgeometrie",
          "de-by:realschule-9-mathematik-lineare-gleichungssysteme",
          "de-by:realschule-9-mathematik-quadratische-funktionen",
          "de-by:realschule-9-mathematik-stochastik-daten",
        ]),
      );
      const counts = { A: 0, B: 0, C: 0 };
      for (const row of table.rows) counts[row.category] += 1;
      expect(counts).toEqual({ A: 41, B: 4, C: 4 });
      for (const row of table.rows) {
        if (row.category === "C") expect(row.note, `${row.de_by_id} needs a reason`).toBeTruthy();
      }
    });

    it("names only cards of this cell in its notes", () => {
      for (const row of table.rows) {
        for (const slug of row.note?.match(/m9-[a-z0-9-]+[a-z0-9]/g) ?? []) {
          expect(bySlug.has(slug), `${row.de_by_id} names ${slug}`).toBe(true);
        }
      }
    });

    it("declares exactly the approved replaces, one de-by item per card", () => {
      const declared = items.flatMap((item) => (item.replaces ?? []).map((id) => [item.slug, id] as const));
      expect(declared.map(([, id]) => id).sort()).toEqual(
        table.rows.filter((row) => row.category !== "C").map((row) => row.de_by_id).sort(),
      );
      for (const item of items) {
        expect((item.replaces ?? []).length, `${item.slug} replaces at most one item`).toBeLessThanOrEqual(1);
      }
      for (const row of table.rows) {
        if (row.category === "C") {
          expect(declared.some(([, id]) => id === row.de_by_id), `${row.de_by_id} has no successor`).toBe(false);
          continue;
        }
        const item = bySlug.get(row.academy_slug ?? "");
        expect(item, `${row.de_by_id} → ${row.academy_slug}`).toBeDefined();
        expect(item?.replaces).toEqual([row.de_by_id]);
      }
    });
  });
});
