import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "../src/curriculum";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
} from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import { mathMarkup, richText } from "../src/ui/math-text";

/** What the learner reads: tags removed, entities decoded far enough to see stray markers. */
function visible(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-zA-Z]+;|&#\d+;/g, " ")
    .replace(/\s+/g, " ");
}

/** Raw notation that must never reach the page. */
const RAW = [
  { name: "caret", pattern: /\^/ },
  { name: "underscore", pattern: /_/ },
  { name: "decimal point", pattern: /\d\.\d/ },
  { name: "hyphen as minus", pattern: /(^|[\s(=:|,{±/])-\d/ },
  { name: "coefficient 1", pattern: /(^|[\s(=+−·])1[a-z](?![a-zA-Z])/ },
];

function expectClean(text: string, where: string): void {
  for (const { name, pattern } of RAW) {
    const match = text.match(pattern);
    expect(
      match,
      `${where}: ${name} in „…${match ? text.slice(Math.max(0, (match.index ?? 0) - 30), (match.index ?? 0) + 20) : ""}…“`,
    ).toBeNull();
  }
}

describe("Was Lernende lesen (Gymnasium 12)", () => {
  it("shows every lesson, quiz, formula and lab text without raw notation", () => {
    for (const lesson of ALL_LESSONS) {
      const plain = [
        // the lesson number "1.1" in front of a title is no decimal number
        lesson.title.replace(/^\d+\.\d+ /, ""),
        lesson.subtitle,
        lesson.whyItMatters,
        lesson.quiz.question,
        ...lesson.quiz.options,
        lesson.quiz.explanation,
        lesson.lab.title,
        lesson.lab.intro,
        ...lesson.lab.goals.map((goal) => goal.text),
        ...lesson.lab.readouts.map((readout) => readout.label),
        ...lesson.lab.params.map((param) => ("label" in param ? param.label : "")),
        ...lesson.formulas.flatMap((formula) => [
          formula.name,
          formula.quantities ?? "",
        ]),
      ];
      for (const text of plain) expectClean(visible(richText(text)), lesson.id);
      for (const html of [
        lesson.explanationHtml,
        ...lesson.formulas.map((formula) => formula.html),
      ])
        expectClean(visible(html), `${lesson.id} (HTML)`);
    }
  });

  it("labels every lab drawing without raw notation", () => {
    for (const lesson of ALL_LESSONS) {
      const view = labView(lesson.lab.kind);
      for (const values of [
        defaultLabValues(lesson.lab),
        ...enumerateLabGrid(lesson.lab, 3),
      ]) {
        const svg = view.render(values, computeReadouts(lesson.lab, values));
        const texts = [...svg.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/g)]
          .map((match) => visible(match[1]))
          .join(" | ");
        expectClean(texts, `${lesson.id} at ${JSON.stringify(values)}`);
      }
    }
  });

  it("labels every task field without raw notation on both levels", () => {
    for (const lesson of ALL_LESSONS) {
      for (const generator of lesson.exercises) {
        for (const level of [1, 2] as const) {
          for (let counter = 1; counter <= 40; counter++) {
            const task = generator.make(
              createRng(seedFrom(`${lesson.id}:${generator.id}:${level}:${counter}`)),
              level,
            );
            const where = `${lesson.id}/${generator.id} L${level} #${counter}`;
            const html = [
              task.prompt,
              ...task.given,
              ...task.steps,
              task.formulaHint ?? "",
              task.feedbackHint ?? "",
              ...task.fields.flatMap((field) => [
                mathMarkup(field.label),
                ...(field.kind === "choice" ? field.options.map(richText) : []),
              ]),
            ].join(" | ");
            expectClean(visible(html), where);
          }
        }
      }
    }
  });
});
