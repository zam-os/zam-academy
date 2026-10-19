import { describe, expect, it } from "vitest";
import cellJson from "../cell.json";
import { ALL_LESSONS, findLessonById, lessonsForTrack, STAGES } from "../src/curriculum";
import { checkAnswer, parseNumber, parseNumberCandidates, toleranceOf } from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  clampParam,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
} from "../src/lab/engine";
import { renderLabVisual } from "../src/lab/visuals";
import type { LabValues } from "../src/model/types";
import {
  lessonLink,
  parseTrainingDeepLink,
  ZAM_ACADEMY_APP_URL,
} from "../src/zam/zam-link";

/**
 * ZAM cards (zam-academy:physik-realschule-9) cite these ids. Renaming a
 * lesson breaks every card that cites it: change the cell in the same step.
 */
const LESSON_IDS = [
  "dr-1-druck",
  "dr-2-hydraulik",
  "dr-3-schweredruck",
  "dr-4-auftrieb",
  "dr-5-boyle-mariotte",
  "me-1-kraftwandler",
  "me-2-arbeit-leistung",
  "me-3-energieerhaltung",
  "me-4-wirkungsgrad",
  "wl-1-temperatur",
  "wl-2-waermekapazitaet",
  "wl-3-mischung",
  "wl-4-aggregatzustand",
  "wl-5-wasseranomalie",
  "wl-6-gasgleichung",
  "el-1-elektromagnet",
  "el-2-lorentzkraft-motor",
  "el-3-energie-leistung",
  "el-4-kennlinie-ohm",
  "el-5-widerstandsgesetz",
  "el-6-halbleiter",
];

/** One slider setting per lab goal that reaches it: the proof that every Laborauftrag is doable. */
const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "dr-1-druck": {
    "ein-bar": { F: 500, A: 50 },
    reisszwecke: { F: 50, A: 5 },
    schneeschuh: { F: 800, A: 2000 },
  },
  "dr-2-hydraulik": {
    auto: { F1: 300, A1: 10, A2: 400, s1: 20 },
    zehntel: { F1: 100, A1: 10, A2: 100, s1: 20 },
    gleich: { F1: 100, A1: 50, A2: 50, s1: 20 },
  },
  "dr-3-schweredruck": {
    "ein-bar": { h: 10, rho: 1000 },
    "vier-bar": { h: 30, rho: 1025 },
    oel: { h: 20, rho: 900 },
  },
  "dr-4-auftrieb": {
    schweben: { V: 2, rhoK: 1000, rhoFl: 1000 },
    eisen: { V: 2, rhoK: 7800, rhoFl: 13_600 },
    eisberg: { V: 2, rhoK: 920, rhoFl: 1025 },
  },
  "dr-5-boyle-mariotte": {
    halbieren: { p1: 1000, V1: 100, V2: 50 },
    viertausend: { p1: 1000, V1: 100, V2: 25 },
    ausdehnen: { p1: 1000, V1: 100, V2: 300 },
  },
  "me-1-kraftwandler": {
    dreihundert: { m: 100, h: 3, l: 10 },
    vierfach: { m: 100, h: 2, l: 8 },
    arbeit: { m: 100, h: 2, l: 20 },
  },
  "me-2-arbeit-leistung": {
    kilowatt: { m: 100, h: 30, t: 1 },
    "zwei-kj": { m: 20, h: 10, t: 30 },
    "hundert-watt": { m: 20, h: 6, t: 120 },
  },
  "me-3-energieerhaltung": {
    haelfte: { m: 60, h0: 5, x: 50 },
    schnell: { m: 60, h0: 12, x: 100 },
    masse: { m: 10, h0: 5, x: 100 },
  },
  "me-4-wirkungsgrad": {
    achtzig: { device: 0.9, Ezu: 100 },
    waerme: { device: 0.05, Ezu: 50 },
    zwoelf: { device: 0.3, Ezu: 40 },
  },
  "wl-1-temperatur": {
    nullpunkt: { theta: -273 },
    dreihundert: { theta: 27 },
    sieden: { theta: 100 },
  },
  "wl-2-waermekapazitaet": {
    kochen: { m: 1, P: 2000, t: 170, theta0: 20 },
    "zehn-kelvin": { m: 0.5, P: 100, t: 210, theta0: 20 },
    "halbe-leistung": { m: 1, P: 500, t: 400, theta0: 20 },
  },
  "wl-3-mischung": {
    dreissig: { m1: 0.5, t1: 60, m2: 1.5, t2: 20 },
    bad: { m1: 1.2, t1: 60, m2: 1, t2: 10 },
    mitte: { m1: 1, t1: 80, m2: 1, t2: 20 },
  },
  "wl-4-aggregatzustand": {
    geschmolzen: { m: 1, Q: 380 },
    plateau: { m: 1, Q: 200 },
    verdampft: { m: 1, Q: 3100 },
  },
  "wl-5-wasseranomalie": {
    dichteste: { theta: 4 },
    warm: { theta: 20 },
    null: { theta: 0 },
  },
  "wl-6-gasgleichung": {
    erwaermen: { V: 5, theta: 170 },
    abkuehlen: { V: 2.5, theta: -90 },
    boyle: { V: 10, theta: 20 },
  },
  "el-1-elektromagnet": {
    tausend: { N: 500, I: 2, dir: 0, core: 0 },
    umpolen: { N: 200, I: 1, dir: 1, core: 0 },
    kern: { N: 500, I: 1, dir: 0, core: 1 },
  },
  "el-2-lorentzkraft-motor": {
    oben: { e: 0, b: 0, I: 1.5 },
    "unten-heraus": { e: 1, b: 0, I: 1.5 },
    beides: { e: 1, b: 1, I: 1.5 },
  },
  "el-3-energie-leistung": {
    "zwei-kw": { U: 230, I: 8.7, t: 1, price: 35 },
    lampe: { U: 230, I: 0.26, t: 1, price: 35 },
    euro: { U: 230, I: 16, t: 24, price: 50 },
  },
  "el-4-kennlinie-ohm": {
    "halbes-ampere": { U: 6, R: 12, device: 0 },
    doppelt: { U: 8, R: 20, device: 1 },
    proportional: { U: 6, R: 30, device: 0 },
  },
  "el-5-widerstandsgesetz": {
    "zehn-ohm": { mat: 3, l: 10, A: 0.5 },
    kupfer: { mat: 0, l: 10, A: 2 },
    doppelt: { mat: 2, l: 10, A: 2 },
  },
  "el-6-halbleiter": {
    ntc: { dev: 0, theta: 97, E: 100, U: 0.6 },
    diode: { dev: 2, theta: 25, E: 100, U: 0.75 },
    ldr: { dev: 1, theta: 25, E: 2, U: 0.6 },
  },
};

describe("Lernpfad", () => {
  it("has four stages in LehrplanPLUS order and 21 lessons with stable ids", () => {
    expect(STAGES.map((stage) => stage.stageNumber)).toEqual([1, 2, 3, 4]);
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(new Set(LESSON_IDS).size).toBe(LESSON_IDS.length);
    for (const stage of STAGES) {
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.tracks.length).toBeGreaterThan(0);
        expect(lesson.lehrplan.length).toBeGreaterThan(10);
        expect(lesson.formulas.length).toBeGreaterThan(0);
        expect(lesson.requiredCorrect).toBeGreaterThanOrEqual(2);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
      });
    }
  });

  it("covers both Wahlpflichtfächergruppen", () => {
    const trackI = lessonsForTrack("I").map((lesson) => lesson.id);
    const trackII = lessonsForTrack("II_III").map((lesson) => lesson.id);
    expect(trackI).toContain("dr-4-auftrieb");
    expect(trackI).not.toContain("me-2-arbeit-leistung");
    expect(trackII).toContain("me-2-arbeit-leistung");
    expect(trackII).not.toContain("el-6-halbleiter");
    for (const id of ["dr-1-druck", "wl-2-waermekapazitaet", "el-4-kennlinie-ohm"]) {
      expect(trackI).toContain(id);
      expect(trackII).toContain(id);
    }
    expect(lessonsForTrack("alle")).toHaveLength(21);
  });

  it("asks quick checks whose right answer is not always the first option", () => {
    const indices = new Set<number>();
    for (const lesson of ALL_LESSONS) {
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(20);
      indices.add(lesson.quiz.correctIndex);
    }
    expect([...indices].sort()).toEqual([0, 1, 2]);
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
      for (const values of enumerateLabGrid(lesson.lab, 7)) {
        const readouts = computeReadouts(lesson.lab, values);
        for (const readout of lesson.lab.readouts) {
          const value = readouts[readout.key];
          if (typeof value === "number") {
            expect(Number.isFinite(value), `${lesson.id}.${readout.key} at ${JSON.stringify(values)}`).toBe(true);
          } else {
            expect(value.length, `${lesson.id}.${readout.key}`).toBeGreaterThan(0);
          }
        }
        const svg = renderLabVisual(lesson.lab, values, readouts);
        expect(svg.startsWith("<svg"), lesson.id).toBe(true);
        expect(svg, `${lesson.id} draws NaN at ${JSON.stringify(values)}`).not.toContain("NaN");
        expect(svg, `${lesson.id} draws undefined`).not.toContain("undefined");
      }
    }
  });

  it("have a reachable witness for every Laborauftrag, and the default settings reach none", () => {
    for (const lesson of ALL_LESSONS) {
      const witnesses = GOAL_WITNESSES[lesson.id];
      expect(witnesses, `witnesses for ${lesson.id}`).toBeDefined();
      expect(Object.keys(witnesses).sort()).toEqual(lesson.lab.goals.map((g) => g.id).sort());
      for (const goal of lesson.lab.goals) {
        const witness = witnesses[goal.id];
        for (const param of lesson.lab.params) {
          expect(witness[param.key], `${lesson.id}/${goal.id} sets ${param.key}`).toBeDefined();
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
});

describe("Aufgaben", () => {
  it("generate solvable tasks for many seeds on both levels", () => {
    for (const lesson of ALL_LESSONS) {
      for (const generator of lesson.exercises) {
        for (const level of [1, 2] as const) {
          for (let seed = 1; seed <= 60; seed++) {
            const task = generator.make(createRng(seedFrom(`${lesson.id}:${generator.id}:${level}:${seed}`)), level);
            const where = `${lesson.id}/${generator.id} L${level} seed ${seed}`;
            expect(Number.isFinite(task.answer), where).toBe(true);
            expect(Math.abs(task.answer), where).toBeGreaterThan(0);
            expect(task.prompt.length, where).toBeGreaterThan(30);
            expect(task.unit.length, where).toBeGreaterThan(0);
            expect(task.given.length, where).toBeGreaterThan(0);
            expect(task.solutionHtml, where).toContain("<strong>");
            if (level === 1) expect(task.formulaHint, where).toBeTruthy();
            // The learner types the rounded result with a decimal comma.
            expect(checkAnswer(task, fmt(task.answer, task.digits)).status, where).toBe("correct");
            // and also with a decimal point and no thousands separator.
            expect(checkAnswer(task, task.answer.toFixed(task.digits)).status, where).toBe("correct");
            // A value far off is wrong.
            expect(checkAnswer(task, String(task.answer * 3 + 7)).status, where).toBe("wrong");
            expect(toleranceOf(task), where).toBeLessThan(Math.abs(task.answer) * 0.2 + 1);
          }
        }
      }
    }
  });

  it("reads numbers the way learners type them", () => {
    expect(parseNumber("2,5")).toBe(2.5);
    expect(parseNumber("2.5")).toBe(2.5);
    expect(parseNumber("1.500")).toBe(1.5);
    expect(parseNumberCandidates("1.500")).toEqual([1.5, 1500]);
    expect(parseNumberCandidates("100.000")).toEqual([100, 100_000]);
    expect(parseNumberCandidates("12.34")).toEqual([12.34]);
    expect(parseNumber("1.000.000")).toBe(1_000_000);
    expect(parseNumber("1 500")).toBe(1500);
    expect(parseNumber("1.234,5")).toBe(1234.5);
    expect(parseNumber("-3,2")).toBe(-3.2);
    expect(parseNumber("12 Pa")).toBe(12);
    expect(parseNumber("0,004")).toBe(0.004);
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("1,2,3")).toBeNull();
    expect(parseNumber("")).toBeNull();
  });

  it("accepts rounding to the shown decimals and rejects a factor-1000 slip", () => {
    const task = {
      prompt: "",
      given: [],
      answer: 9.81,
      unit: "N",
      digits: 0,
      solutionHtml: "",
    };
    expect(checkAnswer(task, "10").status).toBe("correct");
    expect(checkAnswer(task, "9810").status).toBe("wrong");
    // "100.000" is read as 100 000 Pa when that is what the task expects, and
    // "1.636" as 1,636 L when that is expected.
    const pascal = { ...task, answer: 100_000, unit: "Pa" };
    expect(checkAnswer(pascal, "100.000").status).toBe("correct");
    const litres = { ...task, answer: 1.636, unit: "L", digits: 3 };
    expect(checkAnswer(litres, "1.636").status).toBe("correct");
    expect(checkAnswer(litres, "1,636").status).toBe("correct");
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
    expect(parseTrainingDeepLink("#lesson=el-4-kennlinie-ohm&level=2")).toEqual({
      lessonId: "el-4-kennlinie-ohm",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E")).toEqual({});
    expect(parseTrainingDeepLink("#lesson=1.2")).toEqual({});
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
  const prefix = `${ZAM_ACADEMY_APP_URL}#lesson=`;
  const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/;
  const lessonOf = (link: string | undefined) => (link?.startsWith(prefix) ? link.slice(prefix.length) : "");

  it("is the cell of this app with one atom per lesson, in lesson order", () => {
    expect(cell.tile_id).toBe("zam-academy:physik-realschule-9");
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
      const tracks = (atom.curricula ?? [])
        .filter((binding) => binding.provider === "lehrplanplus-bayern")
        .map((binding) => {
          expect(binding.school_type).toBe("realschule");
          expect(binding.grade).toBe(9);
          expect(binding.subject).toBe("physik");
          return binding.track;
        })
        .sort();
      expect(tracks, `${atom.slug} carries the lesson's Zweige`).toEqual([...lesson.tracks].sort());
      expect(atom.practice_items.length, `${atom.slug} has cards`).toBeGreaterThanOrEqual(2);
      for (const item of atom.practice_items) {
        expect(lessonOf(item.source_link), `${item.id} cites its atom's lesson`).toBe(lessonId);
      }
    }
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
    expect(ids.size).toBe(cell.atoms.length + cell.atoms.reduce((n, atom) => n + atom.practice_items.length, 0));
  });
});
