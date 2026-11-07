import { describe, expect, it } from "vitest";
import {
  ALL_LESSONS,
  STAGES,
  findLessonById,
  nextLesson,
  previousLesson,
} from "../src/curriculum";
import { checkTask } from "../src/exercises/checker";
import { createRng, seedFrom } from "../src/exercises/rng";
import { computeReadouts, enumerateLabGrid } from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import {
  isLessonComplete,
  isStageComplete,
  overallStats,
  stageStats,
  type LearnerProgress,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import source from "../src/curriculum/source.json";
import coverage from "../coverage.json";
import rawCell from "../cell.json";
import mapping from "../replaces-de-by.json";
import contract from "./fixtures/public-contract.json";

interface Item {
  id: string;
  slug: string;
  source_link: string;
  tier: string;
  choice_distractors: { text: string; reason: string }[];
  fast_check?: { options: unknown[]; correct_index: number };
  sample_solution?: string;
  question?: string;
  question_segments?: { type: string; speech?: string }[];
  concept_segments?: { type: string; speech?: string }[];
}
interface Atom {
  id: string;
  slug: string;
  source_link: string;
  prerequisites: { atom_id: string }[];
  curricula: {
    provider: string;
    track?: string;
    grade?: number;
    subject?: string;
    school_type?: string;
    topic_code: string;
    topic_title: string;
  }[];
  practice_items: Item[];
}
const cell = rawCell as unknown as {
  tile_id: string;
  atoms: Atom[];
  sources: { uri: string }[];
};
const IDS = ALL_LESSONS.map((l) => l.id);
const LESSONS = 55;
const CARDS = 165;
const blank = (): LearnerProgress => ({
  activeLessonId: IDS[0],
  difficultyLevel: 1,
  quizDone: [],
  labGoals: {},
  solved: {},
  attempts: {},
  celebratedStageIds: [],
  celebratedLessonIds: [],
});

describe("Lehrplan und Umfang", () => {
  it("covers all four Lernbereiche with substantive lessons and one accent per stage", () => {
    expect(STAGES).toHaveLength(4);
    expect(ALL_LESSONS).toHaveLength(LESSONS);
    expect(STAGES.map((s) => s.lessons.length)).toEqual([15, 9, 16, 15]);
    expect(new Set(STAGES.map((s) => s.accent)).size).toBe(4);
    expect(new Set(IDS).size).toBe(LESSONS);
    for (const lesson of ALL_LESSONS) {
      expect(lesson.explanationHtml, lesson.id).toContain('class="example"');
      expect(lesson.explanationHtml, lesson.id).toContain('class="merke"');
      expect(lesson.formulas.length, lesson.id).toBeGreaterThanOrEqual(1);
      expect(lesson.lab.goals, lesson.id).toHaveLength(3);
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(lesson.requiredCorrect).toBe(3);
      expect(lesson.lehrplan).toMatch(/^M5 LB \d(\.\d)?: /);
      expect(lesson.teacherVideo, `${lesson.id}: videos follow in a later step`).toBeUndefined();
      expect(
        [
          lesson.quiz.question,
          ...lesson.quiz.options,
          lesson.quiz.explanation,
          ...lesson.formulas.map((f) => f.quantities),
        ].join(" "),
      ).not.toMatch(/&(?:lt|gt|amp);/);
      expect(new Set(lesson.quiz.options).size).toBe(lesson.quiz.options.length);
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
    }
  });

  it("keeps the Lernbereich labels of the official plan on every stage and lesson", () => {
    source.areas.forEach((area, index) => {
      const stage = STAGES[index];
      expect(stage.title).toBe(area.title);
      expect(stage.lehrplanLabel).toBe(`M5 LB ${area.lb}: ${area.title}`);
      for (const lesson of stage.lessons) {
        const section = lesson.lehrplan.match(/^M5 LB (\d\.\d): (.+)$/);
        if (section) {
          expect((area.sections as Record<string, string>)[section[1]]).toBe(section[2]);
        } else {
          expect(lesson.lehrplan).toBe(stage.lehrplanLabel);
        }
      }
    });
  });

  it("maps all 39 official competences verbatim to lessons of their own Lernbereich", () => {
    expect(source.areas.map((a) => a.hours)).toEqual([30, 14, 34, 34]);
    expect(source.areas.map((a) => a.competences.length)).toEqual([12, 5, 12, 10]);
    expect(coverage.rows).toHaveLength(39);
    const expected = source.areas.flatMap((a) =>
      a.competences.map((c) => `${a.lb}:${c.text}`),
    );
    expect(coverage.rows.map((r) => `${r.lb}:${r.competence}`)).toEqual(expected);
    for (const row of coverage.rows) {
      expect(row.status).toBe("implemented");
      expect(row.lessons.length).toBeGreaterThan(0);
      expect(row.evidence.length).toBeGreaterThan(40);
      for (const id of row.lessons) {
        const found = findLessonById(id);
        expect(found, id).toBeDefined();
        expect(found!.stage.stageNumber, `${id} in LB ${row.lb}`).toBe(row.lb);
      }
    }
    expect(new Set(coverage.rows.flatMap((r) => r.lessons))).toEqual(new Set(IDS));
    expect(coverage.optional_lessons).toEqual([]);
  });

  it("names the labs and generators the evidence relies on", () => {
    const names = new Set(
      ALL_LESSONS.flatMap((l) => [l.lab.kind, ...l.exercises.map((g) => g.id)]),
    );
    const known = new Set(["angle", "account", "laws", "locus", "power", "scale", "chain"]);
    // Lab and generator ids are lower-case words with hyphens; lesson ids and prose are not checked here.
    const mentioned = coverage.rows.flatMap((r) =>
      [...r.evidence.matchAll(/\b[a-z]+(?:-[a-z]+)+\b/g)].map((m) => m[0]),
    );
    const unknown = mentioned.filter(
      (word) => !names.has(word) && !IDS.includes(word) && !known.has(word),
    );
    expect(unknown).toEqual([]);
  });

  it("gives level 2 a different task than level 1 from the same seed", () => {
    for (const lesson of ALL_LESSONS)
      for (const generator of lesson.exercises)
        for (let seed = 1; seed <= 20; seed++) {
          const one = generator.make(createRng(seedFrom(`${lesson.id}:${seed}`)), 1);
          const two = generator.make(createRng(seedFrom(`${lesson.id}:${seed}`)), 2);
          expect(one.prompt, `${lesson.id}/${generator.id}`).not.toBe(two.prompt);
          expect(one.formulaHint, `${lesson.id}/${generator.id}`).toBeTruthy();
          expect(two.formulaHint, `${lesson.id}/${generator.id}`).toBeUndefined();
        }
  });

  it("walks the whole path forward and backward", () => {
    expect(previousLesson(IDS[0])).toBeUndefined();
    expect(nextLesson(IDS[IDS.length - 1])).toBeUndefined();
    for (let i = 0; i + 1 < IDS.length; i++) {
      expect(nextLesson(IDS[i])?.id).toBe(IDS[i + 1]);
      expect(previousLesson(IDS[i + 1])?.id).toBe(IDS[i]);
    }
    STAGES.forEach((stage) => {
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title).toMatch(new RegExp(`^${stage.stageNumber}\\.${index + 1} `));
      });
    });
  });

  it("does not teach later grades or other school types", () => {
    // M6: Dezimalbrüche, Prozent, Volumen, Dreiecksfläche. Realschule 5: Dualsystem, ggT, kgV, Daten.
    const later = /\bPythagoras\b|\bProzent\b|\bVolumen\b|\bDualzahl\b|\bggT\b|\bkgV\b|\bDreieck\b|\bBruch\b|\bHohlmaß\b/;
    for (const lesson of ALL_LESSONS)
      expect(lesson.explanationHtml + lesson.quiz.question + lesson.quiz.explanation, lesson.id).not.toMatch(later);
    for (const item of cell.atoms.flatMap((a) => a.practice_items))
      expect(JSON.stringify(item), item.slug).not.toMatch(/Prozent|Volumen|Kathete|Fakultät/);
  });
});

/** Every generated task of a generator on both levels, or one level. */
function* tasks(lessonId: string, generatorId: string, level?: 1 | 2, seeds = 300) {
  const generator = findLessonById(lessonId)!.lesson.exercises.find((g) => g.id === generatorId)!;
  for (const lv of level ? [level] : ([1, 2] as const))
    for (let seed = 1; seed <= seeds; seed++)
      yield generator.make(createRng(seedFrom(`${lessonId}:${generatorId}:${seed}`)), lv);
}
const answers = (lessonId: string, generatorId: string, level: 1 | 2, index = 0) => {
  const out = new Set<string | number>();
  for (const task of tasks(lessonId, generatorId, level)) {
    const field = task.fields[index];
    out.add(field.kind === "number" ? field.answer : field.options[field.correctIndex]);
  }
  return out;
};
const number = (text: string) => Number(text.replace(/\./g, "").replace("−", "-"));

describe("Plausible Werte und Texte", () => {
  it("lets no generator on any level always have the same answer", () => {
    // Only the Quader counts ask for a fixed fact on purpose; everything else varies.
    for (const lesson of ALL_LESSONS)
      for (const generator of lesson.exercises)
        for (const level of [1, 2] as const)
          expect(answers(lesson.id, generator.id, level).size, `${lesson.id}/${generator.id} L${level}`).toBeGreaterThan(1);
  });

  it("gives every yes/no and wahr/falsch generator both answers", () => {
    for (const lesson of ALL_LESSONS)
      for (const generator of lesson.exercises)
        for (const level of [1, 2] as const) {
          const task = generator.make(createRng(1), level);
          const field = task.fields[0];
          if (field.kind !== "choice" || field.options.length !== 2) continue;
          const seen = new Set<number>();
          for (const generated of tasks(lesson.id, generator.id, level)) {
            const choice = generated.fields[0];
            if (choice.kind === "choice") seen.add(choice.correctIndex);
          }
          // Two options that name the numbers themselves are mixed at runtime; the rest must vary.
          if (/^(ja|wahr|stimmt|kann|positiv|recht|größer|Rechenzeichen|Rechteck 1|Ergänzen|Summe|Differenz|Kommutativgesetz|parallel)/.test(field.options[0]))
            expect(seen.size, `${lesson.id}/${generator.id} L${level}`).toBe(2);
        }
  });

  it("keeps singular and plural apart in tasks, solutions, hints and drawings", () => {
    const wrong = /(?<![\d.,])1 (?:Busse|Kisten|Äpfel|Tage|Stunden|Minuten|Sekunden|Punkte|Reihen|Plätze|Stücke|Flächen|Ecken|Kanten|Karten|Tüten|Portionen|Kinder|Stockwerke|Abschnitte|Teilstriche|Möglichkeiten|Faktoren|negative Faktoren|gleiche Faktoren)\b|\bsind 1 Punkt\b|\b(?:sind es|fehlen noch) 1 (?:Grad|m|min|cm)\b/;
    const texts = (value: unknown): string[] =>
      typeof value === "string"
        ? [value]
        : Array.isArray(value)
          ? value.flatMap(texts)
          : value && typeof value === "object"
            ? Object.values(value).flatMap(texts)
            : [];
    for (const lesson of ALL_LESSONS) {
      for (const generator of lesson.exercises)
        for (const lv of [1, 2] as const)
          for (let seed = 1; seed <= 120; seed++) {
            const task = generator.make(createRng(seedFrom(`${lesson.id}:${generator.id}:${seed}`)), lv);
            for (const text of texts(task)) expect(text, `${lesson.id}/${generator.id}`).not.toMatch(wrong);
          }
      const view = labView(lesson.lab.kind);
      for (const values of enumerateLabGrid(lesson.lab, 3)) {
        const svg = view.render(values, computeReadouts(lesson.lab, values));
        expect(svg, lesson.id).not.toMatch(wrong);
      }
    }
  });

  it("writes large numbers with a separator and sizes with all their places", () => {
    const bare = /(?<![\d.,:|(])\d{4,}(?![\d.,])/;
    for (const lesson of ALL_LESSONS)
      for (const generator of lesson.exercises)
        for (const lv of [1, 2] as const)
          for (let seed = 1; seed <= 60; seed++) {
            const task = generator.make(createRng(seedFrom(`${lesson.id}:${generator.id}:${seed}`)), lv);
            const shown = [task.prompt, ...task.steps].join(" ").replace(/<[^>]+>/g, " ");
            // Years are written without a separator, as on a building.
            if (generator.id !== "roemisch-lesen") expect(shown, `${lesson.id}/${generator.id}`).not.toMatch(bare);
          }
    for (const task of tasks("gr-4-rechnen", "gemischte-einheiten", 2))
      expect(task.prompt).toMatch(/kostet \d+,\d\d €/);
    for (const task of tasks("gr-4-rechnen", "gemischte-einheiten", 1))
      expect(task.prompt).toMatch(/\d+,\d\d m \+|\d+,\d{3} kg [+−]/);
  });

  it("uses no comma from the following grade outside sizes", () => {
    // Dezimalbrüche come in M6 LB 1.2; here a comma only appears with Geld, Länge, Masse and Flächen.
    const allowed = new Set(["gr-3-kommaschreibweise", "gr-4-rechnen", "gr-5-schaetzen", "fl-2-einheiten", "fl-1-rechteck"]);
    for (const lesson of ALL_LESSONS)
      for (const generator of lesson.exercises)
        for (const lv of [1, 2] as const)
          for (const task of tasks(lesson.id, generator.id, lv, 80)) {
            const text = [task.prompt, ...task.steps].join(" ").replace(/<[^>]+>/g, " ");
            if (!allowed.has(lesson.id)) expect(text, `${lesson.id}/${generator.id}`).not.toMatch(/\d,\d/);
            for (const field of task.fields)
              if (field.kind === "number" && !allowed.has(lesson.id))
                expect(Number.isInteger(field.answer), `${lesson.id}/${generator.id}: ${field.answer}`).toBe(true);
          }
  });

  it("keeps values plausible", () => {
    for (const task of tasks("nz-11-summen", "vor-rechenzeichen", 2)) {
      const field = task.fields[0];
      if (field.kind === "number") expect(field.answer, task.prompt).toBeGreaterThanOrEqual(-3);
    }
    for (const task of tasks("nz-8-zahlengerade", "ordnen", 2)) {
      expect(number(task.prompt.match(/Berggipfel: (\S+) m/)![1])).toBeGreaterThan(0);
      expect(number(task.prompt.match(/Meeresgrund: (\S+) m/)![1])).toBeLessThan(0);
    }
    for (const task of tasks("gr-7-massstab", "massstab-bestimmen", 1)) {
      const height = Number(task.prompt.match(/Regal ist (\d+) cm/)![1]);
      expect(height).toBeGreaterThanOrEqual(100);
      expect(height).toBeLessThanOrEqual(250);
    }
    for (const task of tasks("gr-7-massstab", "karte-wirklichkeit", 2)) {
      const field = task.fields[0];
      if (field.kind === "number") {
        expect(Number.isInteger(field.answer), task.prompt).toBe(true);
        expect(field.answer, task.prompt).toBeLessThanOrEqual(40);
      }
    }
    for (const task of tasks("te-4-vorwaerts-rueckwaerts", "vorwaerts-rechnen", 2)) {
      const field = task.fields[0];
      if (field.kind === "number") expect(field.answer).toBeGreaterThan(0);
    }
    for (const task of tasks("gr-4-rechnen", "gemischte-einheiten", 2)) {
      const field = task.fields[0];
      if (field.kind === "number") expect(field.answer).toBeGreaterThan(0);
    }
    for (const task of tasks("fl-6-oberflaeche", "waende-streichen", 2)) {
      const field = task.fields[0];
      if (field.kind === "number") expect(field.answer).toBeGreaterThan(0);
    }
  });

  it("answers the review findings of PR 102", () => {
    for (const task of tasks("ge-7-winkel", "ueberstumpf-rechnen", 2)) {
      expect(task.prompt).not.toContain("genau 6 Uhr");
      expect(task.steps[0]).not.toMatch(/\b1 Stundenabschnitte/);
    }
    for (const task of tasks("nz-6-runden", "runden-sinnvoll", 2))
      expect(task.steps[0]).not.toMatch(/Rest 1\. Für die übrigen/);
    for (const task of tasks("nz-12-differenzen", "temperaturunterschied", 2)) {
      const field = task.fields[0];
      if (field.kind !== "number") throw new Error("number field expected");
      expect(field.answer, task.prompt).toBeGreaterThanOrEqual(-20);
      expect(field.answer, task.prompt).toBeLessThanOrEqual(15);
      expect(Number(task.prompt.match(/(\d+) Grad/)![1]), task.prompt).toBeLessThanOrEqual(15);
    }
    for (const task of tasks("nz-15-terme", "term-wert", 1)) expect(task.steps[0]).toContain(" = ");
    for (const task of tasks("mu-2-dividieren", "quotient", 1)) expect(task.steps[0]).not.toMatch(/\b0 : \d/);
    for (const task of tasks("nz-4-roemisch", "roemisch-lesen")) expect(task.steps[0]).not.toContain("ergibt");
    for (const task of tasks("nz-4-roemisch", "roemisch-lesen", 2))
      expect(Number(String(task.fields[0].kind === "number" && task.fields[0].answer))).toBeLessThan(2000);
    // Level 2 of the Viereck statements is its own pool.
    const prompts = (level: 1 | 2) => new Set([...tasks("ge-9-viereck-eigenschaften", "jedes-ist", level)].map((t) => t.prompt.split(": ").pop()!.replace("Stimmt die Aussage? ", "")));
    for (const claim of prompts(2)) expect(prompts(1).has(claim), claim).toBe(false);
    const power = findLessonById("mu-8-potenzen")!.lesson.lab.goals.find((g) => g.id === "plus-sechzehn")!;
    expect(power.check({ base: -4, exp: 2 }, {})).toBe(true);
    expect(power.check({ base: -2, exp: 4 }, {})).toBe(true);
    const same = findLessonById("te-2-punkt-vor-strich")!.lesson.lab.goals.find((g) => g.id === "gleich")!;
    expect(same.check({ term: 0, a: 5, b: 1, d: 1 }, {})).toBe(true);
  });

  it("asks whether the Zählprinzip fits and when it does not", () => {
    expect(answers("mu-5-zaehlprinzip", "zaehlprinzip-erkennen", 1).size).toBe(2);
    for (const task of tasks("mu-5-zaehlprinzip", "zaehlprinzip-erkennen", 2)) {
      const sauces = [...task.prompt.matchAll(/(\d+) Soßen/g)].map((m) => Number(m[1]));
      const field = task.fields[0];
      if (field.kind === "number") expect(field.answer).toBe(sauces.reduce((a, b) => a + b, 0));
    }
  });

  it("practises mass with a comma and a size divided by a number", () => {
    const prompts = [...tasks("gr-4-rechnen", "gemischte-einheiten", 1)].map((t) => t.prompt);
    expect(prompts.some((p) => p.includes(" kg "))).toBe(true);
    expect(prompts.some((p) => p.includes(" m "))).toBe(true);
    for (const task of tasks("gr-4-rechnen", "groesse-teilen")) {
      const field = task.fields[0];
      if (field.kind === "number") {
        expect(Number.isInteger(field.answer), task.prompt).toBe(true);
        expect(field.unit).toMatch(/^(g|m)$/);
      }
    }
  });

  it("writes no empty step for a time span and derives the accepted span", () => {
    let sameHour = 0;
    for (const task of tasks("gr-2-geld-zeit", "zeitspanne")) {
      expect(task.steps[0]).not.toMatch(/\b0 min/);
      const same = /derselben Stunde/.test(task.steps[0]);
      if (same) sameHour++;
      expect(task.feedbackHint!.includes("derselben Stunde"), task.steps[0]).toBe(same);
      const field = task.fields[0];
      if (field.kind !== "number") throw new Error("number field expected");
      const stated = /zusammen (\d+) min|= (\d+) min/.exec(task.steps[0]);
      if (stated) expect(Number(stated[1] ?? stated[2]), task.steps[0]).toBe(field.answer);
    }
    expect(sameHour).toBeGreaterThan(0);
  });

  it("asks for the most exact name wherever several names are true", () => {
    for (const [lesson, generator] of [
      ["ge-8-vierecke", "name-finden"],
      ["ge-8-vierecke", "koordinaten-viereck"],
    ])
      for (const task of tasks(lesson, generator))
        if (task.fields[0].kind === "choice") expect(task.prompt).toMatch(/genauesten?/);
    const item = cell.atoms.flatMap((a) => a.practice_items).find((i) => i.slug === "g5-name-finden")!;
    expect(item.choice_distractors.map((d) => d.text).join(" ")).not.toMatch(/Trapez|Parallelogramm|Drachen/);
  });

  it("gives every angle exactly one name in the explanation", () => {
    const text = findLessonById("ge-7-winkel")!.lesson.explanationHtml;
    expect(text).toContain("über 0° und unter 90°");
    expect(text).not.toMatch(/\d° bis \d/);
  });

  it("uses the time ladder only with the units of the plan and no comma", () => {
    const lab = findLessonById("gr-2-geld-zeit")!.lesson.lab;
    const readout = lab.readouts.find((r) => r.key === "ergebnis")!;
    expect(readout.compute({ kind: 1, amount: 90, from: 1, to: 2 })).toBe("1 h 30 min");
    expect(readout.compute({ kind: 1, amount: 3, from: 2, to: 1 })).toBe("180 min");
    const view = labView(lab.kind);
    expect(view.render({ kind: 1, amount: 90, from: 1, to: 2 }, {})).not.toMatch(/1,5/);
  });

  it("never reads a thousands point as a decimal point in a whole-number answer", () => {
    for (const task of tasks("gr-7-massstab", "karte-wirklichkeit", 2)) {
      const field = task.fields[0];
      if (field.kind !== "number") throw new Error("number field expected");
      expect(checkTask(task, [String(field.answer)]).status, task.prompt).toBe("correct");
      expect(checkTask(task, [`${field.answer}.000`]).status, task.prompt).toBe("wrong");
    }
  });
});

describe("Fortschritt und Links", () => {
  it("requires every goal, quiz and three correct tasks at each level", () => {
    const p = blank();
    const l = ALL_LESSONS[0];
    p.quizDone.push(l.id);
    p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
    p.solved[l.id] = { 1: 3, 2: 2 };
    expect(isLessonComplete(p, l)).toBe(false);
    p.solved[l.id][2] = 3;
    expect(isLessonComplete(p, l)).toBe(true);
    p.labGoals[l.id].pop();
    expect(isLessonComplete(p, l)).toBe(false);
  });

  it("counts the whole path and each stage", () => {
    const p = blank();
    expect(overallStats(p, STAGES).total).toBe(LESSONS);
    expect(overallStats(p, STAGES).totalStages).toBe(4);
    expect(isStageComplete(p, STAGES[1])).toBe(false);
    for (const l of STAGES[1].lessons) {
      p.quizDone.push(l.id);
      p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
      p.solved[l.id] = { 1: 3, 2: 3 };
    }
    expect(stageStats(p, STAGES[1]).percent).toBe(100);
    expect(isStageComplete(p, STAGES[1])).toBe(true);
    expect(overallStats(p, STAGES).completed).toBe(9);
    expect(overallStats(p, STAGES).completedStages).toBe(1);
  });

  it("resolves every card deep link and ignores malformed fragments", () => {
    for (const l of ALL_LESSONS) {
      expect(parseTrainingDeepLink(new URL(lessonLink(l.id)).hash).lessonId).toBe(l.id);
      expect(findLessonById(l.id)?.lesson).toBe(l);
    }
    expect(parseTrainingDeepLink(`#lesson=${IDS[0]}&level=2`)).toEqual({
      lessonId: IDS[0],
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E")).toEqual({});
  });
});

describe("ZAM-Karten", () => {
  it("pins all lesson identities, atom and item ids", () => {
    expect(
      cell.atoms.map((a) => ({
        lesson: a.slug,
        atom_id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    expect(cell.atoms.map((a) => a.slug)).toEqual(IDS);
    expect(cell.tile_id).toBe("zam-academy:mathematik-gymnasium-5");
    expect(cell.atoms).toHaveLength(LESSONS);
    expect(cell.atoms.flatMap((a) => a.practice_items)).toHaveLength(CARDS);
    const ids = cell.atoms.flatMap((a) => [a.id, ...a.practice_items.map((i) => i.id)]);
    expect(new Set(ids).size).toBe(LESSONS + CARDS);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  });

  it("binds each atom to its stage and Lernbereich at the Gymnasium and cites its lesson", () => {
    const earlier = new Set<string>();
    for (const [n, a] of cell.atoms.entries()) {
      const l = ALL_LESSONS[n];
      const stage = findLessonById(l.id)!.stage;
      expect(a.source_link).toBe(lessonLink(l.id));
      const official = a.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(official).toHaveLength(1);
      expect(official[0].track, "no Zweige at the Gymnasium in grade 5").toBeUndefined();
      expect([official[0].school_type, official[0].grade, official[0].subject, official[0].topic_code, official[0].topic_title]).toEqual([
        "gymnasium",
        5,
        "mathematik",
        `lb${stage.stageNumber}`,
        stage.title,
      ]);
      const own = a.curricula.find((c) => c.provider === "zam-academy");
      expect(own?.topic_code).toBe(stage.id);
      for (const prereq of a.prerequisites) {
        expect(earlier.has(prereq.atom_id), `${a.slug} builds only on earlier atoms`).toBe(true);
      }
      earlier.add(a.id);
      for (const i of a.practice_items) {
        expect(i.source_link).toBe(a.source_link);
        expect("replaces" in i).toBe(false);
      }
    }
    expect("retired_items" in cell).toBe(false);
  });

  it("has binary checks, meaningful curated reasons, transfer solutions and spoken formulas", () => {
    for (const a of cell.atoms) {
      expect(a.practice_items).toHaveLength(3);
      for (const i of a.practice_items) {
        expect(i.choice_distractors).toHaveLength(2);
        expect(i.choice_distractors.every((d) => d.reason.length > 15)).toBe(true);
        if (i.tier === "tier1_fast") {
          expect(i.fast_check?.options).toHaveLength(2);
          expect(i.fast_check?.correct_index).toBe(0);
        } else {
          expect(i.tier).toBe("tier2_transfer");
          expect(i.fast_check).toBeUndefined();
          expect(i.sample_solution?.length).toBeGreaterThan(3);
        }
        for (const key of ["question_segments", "concept_segments"] as const)
          for (const s of i[key] ?? [])
            if (s.type === "math") expect(s.speech?.length).toBeGreaterThan(0);
      }
    }
    expect(JSON.stringify(cell)).toContain('"type":"math"');
  });

  it("accounts for 16 old items with five transfer proposals and no applied migration", () => {
    expect(mapping.approved).toBeNull();
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.rows).toHaveLength(16);
    expect(new Set(mapping.rows.map((r) => r.de_by_id)).size).toBe(16);
    expect(mapping.sources).toHaveLength(2);
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(5);
    expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(11);
    const successors = mapping.rows.map((r) => r.academy_slug).filter((slug) => slug !== null);
    expect(new Set(successors).size, "one history per successor").toBe(5);
    for (const r of mapping.rows) {
      expect(r.reason.length).toBeGreaterThan(30);
      if (r.category === "A") {
        const item = cell.atoms
          .flatMap((a) => a.practice_items)
          .find((i) => i.slug === r.academy_slug);
        expect(item, r.academy_slug ?? "").toBeDefined();
        expect(item?.tier).toBe("tier1_fast");
        expect(r.action).toBe("propose-replace-after-approval");
      } else {
        expect(r.academy_slug).toBeNull();
        expect(r.action).toBe("keep-active");
      }
    }
  });
});
