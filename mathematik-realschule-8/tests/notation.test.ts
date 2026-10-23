import { describe, expect, it } from "vitest";
import { STAGES } from "../src/curriculum";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, defaultLabValues } from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import type { Lesson, LabValues } from "../src/model/types";
import { GOAL_WITNESSES } from "./witnesses";

/**
 * Lengths are written as in Bavarian schools and in the Abschlussprüfung:
 * [AB] is the Strecke, the overlined AB its length (format.ts: len() in HTML,
 * lenSvg() in drawings, lenText() with U+0305 in plain text), AB without
 * brackets the Gerade. Checked for stages 1 to 6; stage 7 has no segments.
 */
const STAGES_CHECKED = STAGES.filter((stage) => stage.stageNumber <= 6);

/** Every text a learner reads, as plain text; an overlined name becomes a marker. */
function readable(html: string): string {
  return html
    .replace(/<(t?span) class="len">[^<]*<\/\1>/g, "‾len‾")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * The ways a length can be written without its bar: "[AB] = 5 cm",
 * "[AB]: 5 cm", "AB = 5 cm", "AB = CD", "|ZP|". Not caught: vector names
 * (an arrow before or after the letters), the units FE, LE and VE, and names
 * that already carry the combining overline (lenText).
 */
const WRONG: Array<[RegExp, string]> = [
  [/\[[A-Z]'?[A-Z]'?\] ?[=≈<>]/, "[AB] = …: the brackets name the Strecke, its length is the overlined AB"],
  [/\[[A-Z]'?[A-Z]'?\]: ?[−\d]/, "[AB]: 5 cm: write the length as the overlined AB = 5 cm"],
  [/(?<![A-Za-z⟶→̅'’])(?!(?:FE|LE|VE)\b)[A-Z]'?[A-Z]'? ?[=≈<>] ?(?:[−\d]|\[|‾len‾|[A-Z]'?[A-Z]'?(?![A-Za-z(]))/, "AB = …: a length gets its bar"],
  [/\|[A-Z]'?[A-Z]'?\|/, "|ZP|: the distance is the overlined ZP"],
];

/** Collects every bare length in a text, with a little context, once per wording. */
function bareLengths(text: string, where: string, found: Map<string, string>): void {
  const plain = readable(text);
  for (const [pattern, why] of WRONG) {
    const global = new RegExp(pattern.source, "g");
    for (const match of plain.matchAll(global)) {
      const context = plain
        .slice(Math.max(0, match.index - 30), match.index + 30)
        .replace(/\s+/g, " ")
        .replace(/[\d,]+/g, "#");
      if (!found.has(context)) found.set(context, `${where}: ${why}: „…${context}…“`);
    }
  }
}

/** Texts the app escapes or shows with textContent: a <span class="len"> would show as code. */
function plainTextsOf(lesson: Lesson): string[] {
  const lab = lesson.lab;
  return [
    lesson.title,
    lesson.subtitle,
    lesson.whyItMatters,
    lesson.quiz.question,
    ...lesson.quiz.options,
    lesson.quiz.explanation,
    lab.title,
    lab.intro,
    ...lab.goals.map((goal) => goal.text),
    ...lab.readouts.map((readout) => readout.label),
    ...lab.params.flatMap((param) => (param.type === "range" ? [param.label] : param.type === "choice" ? [param.label, ...param.options.map((o) => o.label)] : [])),
    ...lesson.formulas.flatMap((formula) => [formula.name, formula.quantities]),
  ];
}

/** The start and every goal witness: readouts and drawings change with the settings. */
function labSettings(lesson: Lesson): LabValues[] {
  const defaults = defaultLabValues(lesson.lab);
  return [defaults, ...Object.values(GOAL_WITNESSES[lesson.id] ?? {}).map((witness) => ({ ...defaults, ...witness }))];
}

describe("Lengths of segments are overlined names (stages 1 to 6)", () => {
  for (const stage of STAGES_CHECKED) {
    for (const lesson of stage.lessons) {
      it(`${lesson.id}: lesson text, quiz, formulas and lab`, () => {
        const found = new Map<string, string>();
        for (const text of plainTextsOf(lesson)) {
          expect(text, `${lesson.id}: plain text with HTML`).not.toMatch(/<span|<tspan/);
          bareLengths(text, `${lesson.id} (plain text)`, found);
        }
        bareLengths(lesson.explanationHtml, `${lesson.id} explanation`, found);
        for (const formula of lesson.formulas) bareLengths(formula.html, `${lesson.id} formula ${formula.name}`, found);
        for (const values of labSettings(lesson)) {
          const readouts = computeReadouts(lesson.lab, values);
          for (const [key, value] of Object.entries(readouts)) {
            if (typeof value !== "string") continue;
            expect(value, `${lesson.id} readout ${key}: plain text with HTML`).not.toMatch(/<span|<tspan/);
            bareLengths(value, `${lesson.id} readout ${key}`, found);
          }
          const svg = labView(lesson.lab.kind).render(values, readouts);
          const labels = [...svg.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map((m) => m[1]).join(" · ");
          expect(labels, `${lesson.id}: a <span> inside SVG text`).not.toMatch(/<span/);
          bareLengths(labels, `${lesson.id} drawing`, found);
        }
        expect([...found.values()]).toEqual([]);
      });

      it(`${lesson.id}: tasks on both levels`, () => {
        const found = new Map<string, string>();
        for (const generator of lesson.exercises) {
          for (const level of [1, 2] as const) {
            for (let i = 0; i < 60; i++) {
              const task = generator.make(createRng(seedFrom(`${lesson.id}:notation:${generator.id}:${i}`)), level);
              const where = `${lesson.id}/${generator.id} L${level}`;
              for (const html of [task.prompt, ...task.given, task.formulaHint ?? "", ...task.steps]) bareLengths(html, where, found);
              for (const field of task.fields) {
                bareLengths(field.label, `${where} label`, found);
                const plainTexts = field.kind === "number" ? (field.slips ?? []).map((slip) => slip.hint) : field.options;
                for (const text of plainTexts) {
                  expect(text, `${where}: plain text with HTML`).not.toMatch(/<span|<tspan/);
                  bareLengths(text, `${where} (plain text)`, found);
                }
              }
            }
          }
        }
        expect([...found.values()]).toEqual([]);
      });
    }
  }

  it("draws the bar with the helpers where lengths are named", () => {
    const html = STAGES_CHECKED.flatMap((stage) => stage.lessons.map((lesson) => lesson.explanationHtml)).join(" ");
    expect(html).toContain('<span class="len">');
  });
});
