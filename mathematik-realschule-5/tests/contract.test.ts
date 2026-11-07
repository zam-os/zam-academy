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
import { validTriangle } from "../src/models";
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
  it("covers all six Lernbereiche with substantive lessons and one accent per stage", () => {
    expect(STAGES).toHaveLength(6);
    expect(ALL_LESSONS).toHaveLength(52);
    expect(STAGES.map((s) => s.lessons.length)).toEqual([18, 6, 12, 7, 6, 3]);
    expect(new Set(STAGES.map((s) => s.accent)).size).toBe(6);
    expect(new Set(IDS).size).toBe(52);
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

  it("maps all 38 official competences verbatim to lessons of their own Lernbereich", () => {
    expect(source.areas.map((a) => a.hours)).toEqual([50, 20, 30, 20, 15, 5]);
    expect(source.areas.map((a) => a.competences.length)).toEqual([12, 5, 6, 6, 6, 3]);
    expect(coverage.rows).toHaveLength(38);
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
    // Lab and generator ids are lower-case words with hyphens; lesson ids and prose are not checked here.
    const mentioned = coverage.rows.flatMap((r) =>
      [...r.evidence.matchAll(/\b[a-z]+(?:-[a-z]+)+\b/g)].map((m) => m[0]),
    );
    const unknown = mentioned.filter(
      (word) => !names.has(word) && !IDS.includes(word) && !word.startsWith("nz-"),
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

  it("walks the whole path forward and backward without Zweig filters", () => {
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

  it("does not teach later grades in the task texts", () => {
    for (const lesson of ALL_LESSONS) {
      const text = lesson.explanationHtml + lesson.quiz.question;
      expect(text, lesson.id).not.toMatch(/\bPythagoras\b|\bProzent\b|\bVolumen\b|\bDeterminante\b/);
    }
  });
});

describe("Plausible Werte", () => {
  /** Every generated task text of a generator on both levels. */
  function* tasks(lessonId: string, generatorId: string) {
    const generator = findLessonById(lessonId)!.lesson.exercises.find((g) => g.id === generatorId)!;
    for (const level of [1, 2] as const)
      for (let seed = 1; seed <= 200; seed++)
        yield generator.make(createRng(seedFrom(`${lessonId}:${generatorId}:${seed}`)), level);
  }

  it("keeps triangles possible", () => {
    for (const task of tasks("ge-4-dreiecke", "nach-seiten")) {
      const match = task.prompt.match(/Seiten (\d+) cm, (\d+) cm, (\d+) cm/)!;
      const [a, b, c] = match.slice(1).map(Number);
      expect(validTriangle(a, b, c), task.prompt).toBe(true);
    }
    for (const task of tasks("ge-4-dreiecke", "nach-winkeln")) {
      const match = task.prompt.match(/größte Winkel eines Dreiecks ist (\d+)°/);
      if (match) {
        expect(Number(match[1]), "the largest of three angles is at least 60°").toBeGreaterThanOrEqual(60);
        expect(Number(match[1])).toBeLessThan(180);
      }
    }
  });

  it("gives polygons sides that close and rooms a sensible size", () => {
    for (const task of tasks("uf-2-umfang-vielecke", "vieleck")) {
      const sides = [...task.prompt.matchAll(/(\d+) (?:cm|m)(?:,|\.)/g)].map((m) => Number(m[1]));
      const longest = Math.max(...sides.slice(0, 5));
      expect(longest).toBeLessThan(sides.slice(0, 5).reduce((a, b) => a + b, 0) - longest);
    }
    for (const task of tasks("gr-5-massstab", "massstab-zeichnen")) {
      for (const field of task.fields)
        if (field.kind === "number") expect(field.answer, task.prompt).toBeLessThanOrEqual(30);
    }
  });

  it("never lets a claim in the task be true when the task calls it false", () => {
    for (const task of tasks("nz-2-stufenzahlen", "stelle-wert")) {
      const claim = task.prompt.match(/ist die (\d) genau \1 wert/);
      const field = task.fields[0];
      if (claim && field.kind === "number") expect(field.answer).not.toBe(Number(claim[1]));
    }
  });

  it("uses money that exists and seats everybody at the tables", () => {
    for (const task of tasks("gr-7-sachaufgaben", "tabelle"))
      expect(task.prompt).not.toMatch(/-€-Schein/);
    for (const task of tasks("nz-4-runden", "runden-sinnvoll")) {
      const field = task.fields[0];
      const persons = task.prompt.match(/kommen (\d+) Personen/);
      if (persons && field.kind === "number")
        expect(field.answer * 10).toBeGreaterThanOrEqual(Number(persons[1]));
    }
  });

  it("makes the Dreisatz and the scale agree with an independent calculation", () => {
    for (const task of tasks("gr-6-dreisatz", "preis")) {
      const m = task.prompt.match(/^(\d+) \S+ kosten ([\d.]+) (?:€|ct)\. Was kosten (\d+)/)!;
      const [n, total, t] = [Number(m[1]), Number(m[2].replace(/\./g, "")), Number(m[3])];
      const field = task.fields[0];
      if (field.kind === "number") expect(field.answer).toBe((total * t) / n);
    }
    for (const task of tasks("gr-5-massstab", "massstab-bestimmen")) {
      const field = task.fields.find((f) => f.kind === "number");
      if (field?.kind === "number") expect(field.answer).toBeGreaterThan(1);
    }
  });
});

describe("Befunde aus dem Review von PR 91", () => {
  function* tasks(lessonId: string, generatorId: string, level?: 1 | 2) {
    const generator = findLessonById(lessonId)!.lesson.exercises.find((g) => g.id === generatorId)!;
    for (const lv of level ? [level] : ([1, 2] as const))
      for (let seed = 1; seed <= 300; seed++)
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
  const number = (text: string) => Number(text.replace(/\./g, ""));

  it("keeps populations at a size a real country can have", () => {
    for (const [lesson, generator] of [["nz-13-zehnerpotenzen", "exponent-finden"], ["nz-4-runden", "runden-stelle"]])
      for (const task of tasks(lesson, generator, 2)) {
        const match = task.prompt.match(/Ein Land hat ([\d.]+) Einwohner/);
        if (match) expect(number(match[1]), task.prompt).toBeLessThanOrEqual(1_500_000_000);
      }
  });

  it("writes no empty step and the fitting hint for a time span", () => {
    let sameHour = 0;
    for (const task of tasks("gr-3-geld-zeit-hohlmass", "zeitspanne")) {
      expect(task.steps[0]).not.toMatch(/\b0 min/);
      const same = /derselben Stunde/.test(task.steps[0]);
      if (same) sameHour++;
      expect(task.feedbackHint!.includes("derselben Stunde"), task.steps[0]).toBe(same);
    }
    expect(sameHour).toBeGreaterThan(0);
  });

  it("does not read metres as whole kilometres on a map", () => {
    let whole = 0;
    for (const task of tasks("gr-5-massstab", "karte-wirklichkeit", 2)) {
      const field = task.fields[0];
      if (field.kind !== "number") throw new Error("number field expected");
      expect(checkTask(task, [String(field.answer).replace(".", ",")]).status, task.prompt).toBe("correct");
      if (!Number.isInteger(field.answer)) continue;
      whole++;
      expect(checkTask(task, [`${field.answer}.000`]).status, task.prompt).toBe("wrong");
    }
    expect(whole).toBeGreaterThan(0);
  });

  it("asks for whole centimetres when drawing to scale", () => {
    for (const task of tasks("gr-5-massstab", "massstab-zeichnen"))
      for (const field of task.fields)
        if (field.kind === "number") expect(Number.isInteger(field.answer), task.prompt).toBe(true);
    expect(answers("gr-5-massstab", "massstab-zeichnen", 2).size).toBeGreaterThan(5);
  });

  it("keeps counters and cupboards plausible", () => {
    for (const task of tasks("nz-1-zahlenmenge", "nachbarn", 2))
      expect(task.prompt).toContain("Videozähler");
    for (const task of tasks("gr-5-massstab", "massstab-bestimmen", 1)) {
      const height = Number(task.prompt.match(/Schrank ist (\d+) cm/)![1]);
      expect(height).toBeGreaterThanOrEqual(150);
      expect(height).toBeLessThanOrEqual(250);
      const inPlan = Number(task.prompt.match(/Im Plan ist er (\d+) cm/)![1]);
      const field = task.fields[0];
      if (field.kind === "number") expect(inPlan * field.answer).toBe(height);
    }
    expect(answers("gr-5-massstab", "massstab-bestimmen", 1).size).toBeGreaterThan(2);
  });

  it("derives the accepted time span in the worked solution", () => {
    for (const task of tasks("gr-3-geld-zeit-hohlmass", "zeitspanne")) {
      const field = task.fields[0];
      if (field.kind !== "number") throw new Error("number field expected");
      const minutes = [...task.steps[0].matchAll(/(\d+) min/g)].map((m) => Number(m[1]));
      const same = task.steps[0].match(/^(\d+) − (\d+) = (\d+)/);
      if (same) {
        expect(Number(same[1]) - Number(same[2]), task.steps[0]).toBe(field.answer);
        expect(Number(same[3])).toBe(field.answer);
      } else {
        expect(minutes.reduce((a, b) => a + b, 0), task.steps[0]).toBe(field.answer);
      }
    }
  });

  it("asks for the most exact name wherever several names are true", () => {
    for (const [lesson, generator] of [
      ["ge-4-dreiecke", "nach-seiten"],
      ["ge-5-vierecke", "eigenschaft-name"],
    ])
      for (const task of tasks(lesson, generator)) expect(task.prompt).toMatch(/genauesten/);
    for (const task of tasks("ge-5-vierecke", "wahr-falsch", 2)) expect(task.prompt).toMatch(/genauesten/);
    for (const task of tasks("ge-9-koerper", "erkennen", 2)) expect(task.prompt).toMatch(/genauesten/);
    const item = cell.atoms.flatMap((a) => a.practice_items).find((i) => i.slug === "m5-name-finden")!;
    expect(item.choice_distractors.map((d) => d.text).join(" ")).not.toMatch(/Trapez|Parallelogramm|Drachen/);
  });

  it("gives every angle exactly one name in the explanation", () => {
    const text = findLessonById("ge-7-winkel")!.lesson.explanationHtml;
    expect(text).toContain("Nullwinkel (genau 0°)");
    expect(text).toContain("spitz (über 0° und unter 90°)");
    expect(text).not.toMatch(/\d° bis \d/);
  });

  it("no longer claims a fixed number of decimals for a unit", () => {
    const lesson = findLessonById("gr-4-schreibweisen")!.lesson;
    expect(lesson.explanationHtml).toContain("1,5 kg, 1,25 kg und 1,250 kg");
    const item = cell.atoms.flatMap((a) => a.practice_items).find((i) => i.slug === "m5-komma-kg") as unknown as { question: string };
    expect(item.question).toContain("ganze Gramm");
  });

  it("does not let a generator always have the same answer", () => {
    expect(answers("gz-3-zahlengerade", "vergleichen", 1).size).toBe(2);
    expect(answers("ge-4-dreiecke", "nach-winkeln", 2).size).toBe(2);
    expect(answers("da-3-verzerrungen", "wirkung", 2).size).toBe(2);
    expect(answers("da-1-diagramme", "saeule-einteilung", 2).size).toBe(4);
    expect(answers("nz-1-zahlenmenge", "groesste-zahl", 1).size).toBe(3);
    expect(answers("nz-18-kombinatorik", "ohne-wiederholung", 2).size).toBe(3);
    const firstValues = new Set<string>();
    for (const task of tasks("gz-3-zahlengerade", "vergleichen", 2))
      firstValues.add(task.prompt.match(/Höhen (\S+) m/)![1].startsWith("−") ? "negativ" : "positiv");
    expect(firstValues.size).toBe(2);
  });

  it("keeps singular and plural apart in tasks, solutions, hints and drawings", () => {
    const wrong = /(?<![\d.,])1 (?:Striche|volle Fünferbündel|einzelne Striche|Erwachsene|Schritten|Möglichkeiten|Kanten|Ecken|Flächen|Nullen|Packungen|Kinder|Stunden|Tische|Einheiten|Felder|Augen|Personen|negative Faktoren|Busse)\b|\b(?:sind es|fehlen noch|kommen) 1 (?:Grad|m|min|cm)\b/;
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
    expect(overallStats(p, STAGES).total).toBe(52);
    expect(overallStats(p, STAGES).totalStages).toBe(6);
    expect(isStageComplete(p, STAGES[5])).toBe(false);
    for (const l of STAGES[5].lessons) {
      p.quizDone.push(l.id);
      p.labGoals[l.id] = l.lab.goals.map((g) => g.id);
      p.solved[l.id] = { 1: 3, 2: 3 };
    }
    expect(stageStats(p, STAGES[5]).percent).toBe(100);
    expect(isStageComplete(p, STAGES[5])).toBe(true);
    expect(overallStats(p, STAGES).completed).toBe(3);
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
  it("pins all 52 lesson identities and 208 atom and item ids", () => {
    expect(
      cell.atoms.map((a) => ({
        lesson: a.slug,
        atom_id: a.id,
        slug: a.slug,
        items: a.practice_items.map((i) => ({ id: i.id, slug: i.slug })),
      })),
    ).toEqual(contract);
    expect(cell.atoms.map((a) => a.slug)).toEqual(IDS);
    expect(cell.tile_id).toBe("zam-academy:mathematik-realschule-5");
    expect(cell.atoms).toHaveLength(52);
    expect(cell.atoms.flatMap((a) => a.practice_items)).toHaveLength(156);
    const ids = cell.atoms.flatMap((a) => [a.id, ...a.practice_items.map((i) => i.id)]);
    expect(new Set(ids).size).toBe(208);
    for (const id of ids) expect(id).toMatch(/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
  });

  it("binds each atom to its stage and Lernbereich, without Zweige, and cites its lesson", () => {
    const earlier = new Set<string>();
    for (const [n, a] of cell.atoms.entries()) {
      const l = ALL_LESSONS[n];
      const stage = findLessonById(l.id)!.stage;
      expect(a.source_link).toBe(lessonLink(l.id));
      const official = a.curricula.filter((c) => c.provider === "lehrplanplus-bayern");
      expect(official).toHaveLength(1);
      expect(official[0].track, "one Fachlehrplan for all").toBeUndefined();
      expect([official[0].grade, official[0].subject, official[0].topic_code, official[0].topic_title]).toEqual([
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
          expect(i.sample_solution?.length).toBeGreaterThan(30);
        }
        for (const key of ["question_segments", "concept_segments"] as const)
          for (const s of i[key] ?? [])
            if (s.type === "math") expect(s.speech?.length).toBeGreaterThan(0);
      }
    }
    expect(JSON.stringify(cell)).toContain('"type":"math"');
  });

  it("accounts for 16 old items with eight transfer proposals and no applied migration", () => {
    expect(mapping.approved).toBeNull();
    expect(mapping.status).toBe("proposal-only");
    expect(mapping.rows).toHaveLength(16);
    expect(new Set(mapping.rows.map((r) => r.de_by_id)).size).toBe(16);
    expect(mapping.sources).toHaveLength(2);
    expect(mapping.rows.filter((r) => r.category === "A")).toHaveLength(8);
    expect(mapping.rows.filter((r) => r.category === "C")).toHaveLength(8);
    const successors = mapping.rows
      .map((r) => r.academy_slug)
      .filter((slug) => slug !== null);
    expect(new Set(successors).size, "one history per successor").toBe(8);
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
