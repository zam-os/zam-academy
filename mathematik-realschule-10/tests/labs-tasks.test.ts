import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "../src/curriculum";
import { checkTask, toleranceOf, wrongAnswerHint } from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
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
import type { ExerciseTask, LabDefinition, LabValues } from "../src/model/types";
import cell from "../cell.json";
import { GOAL_WITNESSES } from "./witnesses";

/**
 * Definitions- and Wertemenge are written 𝔻 and 𝕎 in every stage (stage 7
 * needs D for the discriminant). A plain D or W naming a set is a slip; in a
 * card it would also make the answer stand out from its distractors.
 */
const PLAIN_SET = /(?<![\w$.])[DW] = (?:ℝ|\\?\{)|(?:\bin|∉|\bzu) [DW](?![\w(₁₂ₙ'′])|menge [DW]\b|(?<![\w$.])[DW] und [DW]\b|(?<![\w$.])[DW]\(f|(?<![\w$.])D: 0 </;
const plain = (html: string) => html.replace(/<[^>]+>/g, " ");

/**
 * The settings a lab test walks: the full grid for few sliders, a coarser
 * one for more, and 400 seeded random settings for labs with many sliders.
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
            expect(value, `${lesson.id}.${readout.key} writes a set as D or W`).not.toMatch(PLAIN_SET);
          }
        }
        const svg = view.render(values, readouts);
        expect(svg.startsWith("<svg"), lesson.id).toBe(true);
        expect(svg.endsWith("</svg>"), lesson.id).toBe(true);
        expect(svg, `${lesson.id} draws NaN at ${JSON.stringify(values)}`).not.toContain("NaN");
        expect(svg, `${lesson.id} draws undefined`).not.toContain("undefined");
        expect(svg, `${lesson.id} draws Infinity`).not.toContain("Infinity");
        expect(plain(svg), `${lesson.id} writes a set as D or W at ${JSON.stringify(values)}`).not.toMatch(PLAIN_SET);
        // The 𝔻 and 𝕎 bars of the function labs carry the set's name on its own.
        if (/^(pt|el)-/.test(lesson.id)) expect(svg, `${lesson.id} labels a set D or W`).not.toMatch(/>[DW]<\/text>/);
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
          const shown = [html, ...task.fields.flatMap((field) => [field.label, ...(field.kind === "choice" ? field.options : (field.slips ?? []).map((slip) => slip.hint))])];
          for (const part of shown) expect(plain(part), `${where}: a set written as D or W`).not.toMatch(PLAIN_SET);
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
          // A value far off is wrong, and the hint says something. 3a + 7 is
          // rounded (at a = −7/3 it would print as 8.9e−16) and replaced where
          // it lands next to a (a = −3,5).
          const farOff = (answer: number) => {
            const far = Math.round((answer * 3 + 7) * 1e6) / 1e6;
            return Math.abs(far - answer) < 1 ? answer + 50 : far;
          };
          const wrong = task.fields.map((field) =>
            field.kind === "choice" ? String((field.correctIndex + 1) % field.options.length) : String(farOff(field.answer)),
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

describe("Schreibweise", () => {
  it("writes the Definitions- and Wertemenge as 𝔻 and 𝕎 in every lesson text and card", () => {
    for (const lesson of ALL_LESSONS) {
      const texts = [
        lesson.title,
        lesson.subtitle,
        lesson.whyItMatters,
        lesson.explanationHtml,
        ...lesson.formulas.flatMap((formula) => [formula.name, formula.html, formula.quantities ?? ""]),
        lesson.quiz.question,
        ...lesson.quiz.options,
        lesson.quiz.explanation,
        lesson.lab.title,
        lesson.lab.intro,
        ...lesson.lab.params.flatMap((param) => [(param as { label?: string }).label ?? "", ...(param.type === "choice" ? param.options.map((o) => o.label) : [])]),
        ...lesson.lab.readouts.map((readout) => readout.label),
        ...lesson.lab.goals.map((goal) => goal.text),
      ];
      for (const text of texts) expect(plain(text), lesson.id).not.toMatch(PLAIN_SET);
    }
    // Every string a card shows: questions, answers, segments, fast checks, distractors.
    const strings = (value: unknown, key = ""): string[] =>
      typeof value === "string"
        ? ["id", "slug", "source_link", "tier", "language"].includes(key) ? [] : [value]
        : Array.isArray(value)
          ? value.flatMap((item) => strings(item, key))
          : value && typeof value === "object"
            ? Object.entries(value).flatMap(([k, v]) => strings(v, k))
            : [];
    for (const atom of cell.atoms) {
      for (const item of atom.practice_items) {
        for (const text of strings(item)) expect(text, `${item.slug}: a set written as D or W`).not.toMatch(PLAIN_SET);
      }
    }
  });
});
