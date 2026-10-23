import { describe, expect, it } from "vitest";
import cellJson from "../cell.json";
import coverageJson from "../coverage.json";
import replacesJson from "../replaces-de-by.json";
import { ALL_LESSONS, findLessonById, lessonsForTrack, STAGES } from "../src/curriculum";
import {
  checkAnswer,
  parseNumber,
  parseNumberCandidates,
  toleranceOf,
  wrongAnswerHint,
} from "../src/exercises/checker";
import { esc, escScript, fmt } from "../src/exercises/format";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  clampParam,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
} from "../src/lab/engine";
import { hasLabVisual, renderLabVisual } from "../src/lab/visuals";
import {
  isElectiveStage,
  isLessonComplete,
  isStageComplete,
  isTransferDone,
  type LearnerProgress,
  overallStats,
  relevantLessons,
  requiredLessons,
  stageStats,
} from "../src/storage/progress";
import {
  lessonLink,
  parseTrainingDeepLink,
  ZAM_ACADEMY_APP_URL,
} from "../src/zam/zam-link";
import { GOAL_WITNESSES } from "./witnesses";

/**
 * ZAM cards (zam-academy:physik-realschule-8) cite these ids. Renaming a
 * lesson breaks every card that cites it: change the cell in the same step.
 */
const LESSON_IDS = [
  // Etappe 1: Mechanik (II/III)
  "kr-1-messen",
  "kr-2-geschwindigkeit",
  "kr-3-kraft",
  "kr-4-wechselwirkung",
  "kr-5-hooke",
  "kr-6-masse-gewicht",
  "kr-7-teilchenmodell",
  "kr-8-dichte",
  "kr-9-reibung",
  // Etappe 2: Optik (II/III)
  "op-1-lichtausbreitung",
  "op-2-schatten",
  "op-3-finsternisse",
  "op-4-reflexion",
  "op-5-brechung",
  "op-6-totalreflexion",
  "op-7-sammellinse",
  "op-8-abbildung",
  "op-9-geraete",
  // Etappe 3: Mechanik und Energie (I)
  "en-1-schiefe-ebene",
  "en-2-hebel",
  "en-3-flaschenzug",
  "en-4-arbeit",
  "en-5-leistung",
  "en-6-energieformen",
  "en-7-energieerhaltung",
  "en-8-wirkungsgrad",
  // Etappe 4: Wärmelehre (I)
  "wl-1-innere-energie",
  "wl-2-temperatur",
  "wl-3-aggregatzustaende",
  "wl-4-ausdehnung",
  "wl-5-wasseranomalie",
  "wl-6-waermeleitung",
  "wl-7-konvektion-strahlung",
  // Etappe 5: Magnetismus und Elektrizitätslehre (II/III und I)
  "el-1-magnete",
  "el-2-magnetfeld",
  "el-3-ladung",
  "el-4-elektrisches-feld",
  "el-5-elektrostatik-anwendung",
  "el-6-strom",
  "el-7-stromkreis",
  "el-8-stromstaerke-messen",
  "el-9-stromfluss-fluessigkeit-gas",
  "el-10-gefahren-schutz",
  // Etappe 6: Wahlbereich Akustik (I)
  "ak-1-schall",
  "ak-2-ausbreitung",
  // Etappe 7: Wahlbereich Astronomie (I)
  "as-1-weltbilder",
  "as-2-sonnensystem",
];

describe("Lernpfad", () => {
  it("has the stages in LehrplanPLUS order and lessons with stable ids", () => {
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(new Set(LESSON_IDS).size).toBe(LESSON_IDS.length);
    STAGES.forEach((stage, index) => expect(stage.stageNumber).toBe(index + 1));
    for (const stage of STAGES) {
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title.startsWith(`${stage.stageNumber}.${index + 1} `), lesson.id).toBe(true);
        expect(lesson.tracks.length).toBeGreaterThan(0);
        expect(lesson.lehrplan.startsWith("Ph8 "), lesson.id).toBe(true);
        expect(lesson.formulas.length).toBeGreaterThan(0);
        expect(lesson.requiredCorrect).toBeGreaterThanOrEqual(2);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
        expect(new Set(lesson.exercises.map((e) => e.id)).size).toBe(lesson.exercises.length);
      });
    }
  });

  it("asks quick checks whose right answer is not always the first option", () => {
    const indices = new Set<number>();
    for (const lesson of ALL_LESSONS) {
      expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
      expect(lesson.quiz.correctIndex).toBeGreaterThanOrEqual(0);
      expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
      expect(lesson.quiz.explanation.length).toBeGreaterThan(20);
      expect(new Set(lesson.quiz.options).size, `${lesson.id} repeats an option`).toBe(lesson.quiz.options.length);
      indices.add(lesson.quiz.correctIndex);
    }
    expect([...indices].sort()).toEqual([0, 1, 2]);
  });

  it("keeps the teacher-video slot open and well-formed", () => {
    // Videos are added to lessons separately (teacherVideo); when one is set it must be a real link.
    for (const lesson of ALL_LESSONS) {
      const video = lesson.teacherVideo;
      if (!video) continue;
      expect(video.url, lesson.id).toMatch(/^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{11}/);
      expect(video.title.length, lesson.id).toBeGreaterThan(5);
    }
  });
});

describe("Lerntexte ohne sichtbares Markup", () => {
  // main.ts escapes these fields, so a tag in them would show up as text on the page.
  const TAG = /<\/?[a-z][^>]*>|&[a-z]+;/i;

  it("keeps HTML out of every field the app prints as plain text", () => {
    for (const stage of STAGES) {
      for (const text of [stage.title, stage.subtitle, stage.lehrplanLabel, stage.badgeTitle]) expect(text, stage.id).not.toMatch(TAG);
    }
    for (const lesson of ALL_LESSONS) {
      const plain = [
        lesson.title,
        lesson.subtitle,
        lesson.lehrplan,
        lesson.whyItMatters,
        lesson.celebrationMessage,
        lesson.quiz.question,
        lesson.quiz.explanation,
        ...lesson.quiz.options,
        lesson.lab.title,
        lesson.lab.intro,
        ...lesson.lab.goals.map((goal) => goal.text),
        ...lesson.lab.readouts.map((readout) => readout.label),
        ...lesson.lab.params.flatMap((param) => [param.label, ...(param.type === "choice" ? param.options.map((option) => option.label) : [])]),
        ...lesson.formulas.map((formula) => formula.name),
      ];
      for (const text of plain) expect(text, `${lesson.id}: ${text}`).not.toMatch(TAG);
      for (const formula of lesson.formulas) {
        // Quantity lines may carry <sub> and <sup>, nothing else.
        expect(formula.quantities.replace(/<\/?(sub|sup)>/g, ""), `${lesson.id}: ${formula.quantities}`).not.toMatch(TAG);
      }
      for (const generator of lesson.exercises) {
        for (const level of [1, 2] as const) {
          for (let seed = 1; seed <= 20; seed++) {
            const task = generator.make(createRng(seed), level);
            for (const text of [...task.given, task.formulaHint ?? "", task.unit]) expect(text, `${lesson.id}/${generator.id}`).not.toMatch(TAG);
          }
        }
      }
    }
  });

  it("prints sub- and superscripts in quantity lines and escapes everything else", () => {
    expect(escScript("E<sub>pot</sub> = 10<sup>−3</sup> J")).toBe("E<sub>pot</sub> = 10<sup>−3</sup> J");
    expect(escScript('<img src=x onerror="a">')).toBe(esc('<img src=x onerror="a">'));
    expect(escScript("<sub onclick=x>")).not.toContain("<sub");
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
      expect(lesson.lab.goals.length, `${lesson.id} has Laboraufträge`).toBeGreaterThanOrEqual(3);
      expect(hasLabVisual(lesson.lab.kind), `${lesson.id} draws ${lesson.lab.kind}`).toBe(true);
    }
  });

  it("give finite readouts and a clean drawing for every grid point", () => {
    for (const lesson of ALL_LESSONS) {
      for (const values of enumerateLabGrid(lesson.lab, 6)) {
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
        expect(svg.endsWith("</svg>"), lesson.id).toBe(true);
        expect(svg, `${lesson.id} draws NaN at ${JSON.stringify(values)}`).not.toContain("NaN");
        expect(svg, `${lesson.id} draws undefined`).not.toContain("undefined");
        expect(svg, `${lesson.id} draws Infinity`).not.toContain("Infinity");
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
  it("generate solvable tasks along the task streams learners get, on both levels", () => {
    for (const lesson of ALL_LESSONS) {
      for (const level of [1, 2] as const) {
        // The app seeds task number `counter` of a lesson and level exactly so
        // (main.ts, startTask), alternating between the lesson's generators.
        for (let counter = 1; counter <= 120; counter++) {
          const generator = lesson.exercises[(counter - 1) % lesson.exercises.length];
          const task = generator.make(createRng(seedFrom(`${lesson.id}:${level}:${counter}`)), level);
          const where = `${lesson.id}/${generator.id} L${level} task ${counter}`;
          expect(Number.isFinite(task.answer), where).toBe(true);
          expect(Math.abs(task.answer), where).toBeGreaterThan(0);
          expect(task.prompt.length, where).toBeGreaterThan(30);
          expect(task.unit.length, where).toBeGreaterThan(0);
          expect(task.given.length, where).toBeGreaterThan(0);
          for (const part of [task.prompt, task.solutionHtml, ...task.given]) {
            expect(part, `${where} prints NaN/undefined`).not.toMatch(/NaN|undefined|Infinity/);
          }
          expect(task.solutionHtml, where).toContain("<strong>");
          if (level === 1) expect(task.formulaHint, where).toBeTruthy();
          // The learner types the rounded result with a decimal comma.
          expect(checkAnswer(task, fmt(task.answer, task.digits)).status, where).toBe("correct");
          // and also with a decimal point and no thousands separator.
          expect(checkAnswer(task, task.answer.toFixed(task.digits)).status, where).toBe("correct");
          // A value far off is wrong.
          expect(checkAnswer(task, String(task.answer * 3 + 7)).status, where).toBe("wrong");
          expect(toleranceOf(task), where).toBeLessThan(Math.abs(task.answer) * 0.2 + 1);
          // The answer shown to the learner is not rounded to zero.
          expect(Number(task.answer.toFixed(task.digits)), `${where}: ${task.answer} vanishes at ${task.digits} digits`).not.toBe(0);
        }
      }
    }
  });

  it("tells a learner who divided the wrong way round, and not one who is merely a bit off", () => {
    const task = { prompt: "", given: [], answer: 50, unit: "Pa", digits: 0, solutionHtml: "" };
    const swapped = checkAnswer(task, "0,02");
    expect(swapped.status).toBe("wrong");
    expect(wrongAnswerHint(swapped, task)).toContain("falschen Wert");
    const tight = { ...task, answer: 300.15, digits: 2, tolerance: 0.001 };
    const nearMiss = checkAnswer(tight, "303");
    expect(nearMiss.status).toBe("wrong");
    expect(wrongAnswerHint(nearMiss, tight)).not.toContain("falschen Wert");
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
    // The app shows the real minus sign; a keyboard gives a hyphen or an en dash.
    expect(parseNumber("−196,15")).toBe(-196.15);
    expect(parseNumber("–4 dpt")).toBe(-4);
    expect(fmt(-196.15, 2)).toBe("−196,15");
    expect(fmt(-0.001, 2)).toBe("0");
    expect(parseNumber("12 N")).toBe(12);
    expect(parseNumber("0,004")).toBe(0.004);
    expect(parseNumber("abc")).toBeNull();
    expect(parseNumber("1,2,3")).toBeNull();
    expect(parseNumber("")).toBeNull();
  });

  it("accepts rounding to the shown decimals and rejects a factor-1000 slip", () => {
    const task = { prompt: "", given: [], answer: 9.81, unit: "N", digits: 0, solutionHtml: "" };
    expect(checkAnswer(task, "10").status).toBe("correct");
    expect(checkAnswer(task, "9810").status).toBe("wrong");
    const litres = { ...task, answer: 1.636, unit: "L", digits: 3 };
    expect(checkAnswer(litres, "1.636").status).toBe("correct");
    expect(checkAnswer(litres, "1,636").status).toBe("correct");
  });
});

describe("Lektionsabschluss", () => {
  const blank = (): LearnerProgress => ({
    activeLessonId: "kr-1-messen",
    difficultyLevel: 1,
    trackFilter: "alle",
    quizDone: [],
    labGoals: {},
    solved: {},
    attempts: {},
    celebratedStageIds: [],
    celebratedLessonIds: [],
  });
  const finish = (progress: LearnerProgress, lessonId: string, level2 = 0) => {
    const lesson = findLessonById(lessonId)!.lesson;
    progress.quizDone.push(lesson.id);
    progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: level2 };
  };

  it("needs the quick check, every lab goal and the required Level-1 tasks; the transfer badge needs Level 2 too", () => {
    const progress = blank();
    const lesson = findLessonById("kr-1-messen")!.lesson;
    expect(isLessonComplete(progress, lesson)).toBe(false);
    progress.quizDone.push(lesson.id);
    progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect - 1, 2: lesson.requiredCorrect };
    expect(isLessonComplete(progress, lesson)).toBe(false);
    expect(isTransferDone(progress, lesson)).toBe(false);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: 0 };
    expect(isLessonComplete(progress, lesson)).toBe(true);
    expect(isTransferDone(progress, lesson)).toBe(false);
    progress.labGoals[lesson.id] = progress.labGoals[lesson.id].slice(1);
    expect(isLessonComplete(progress, lesson), "one lab goal missing").toBe(false);
    progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: lesson.requiredCorrect };
    expect(isTransferDone(progress, lesson)).toBe(true);
  });

  it("links every lesson from a card and finishes a stage only with the lessons of the chosen Zweig", () => {
    const progress = blank();
    const mechanik = STAGES[0];
    expect(relevantLessons(mechanik, "I")).toHaveLength(0);
    expect(isStageComplete(progress, mechanik, "I")).toBe(false);
    for (const lesson of relevantLessons(mechanik, "II_III")) finish(progress, lesson.id);
    expect(isStageComplete(progress, mechanik, "II_III")).toBe(true);
    expect(stageStats(progress, mechanik, "II_III")).toMatchObject({ completed: 9, total: 9, percent: 100 });
    expect(isElectiveStage(mechanik)).toBe(false);
    expect(requiredLessons(mechanik, "II_III")).toHaveLength(9);
    expect(overallStats(progress, STAGES, "II_III").completed).toBe(9);
    expect(lessonsForTrack("I").every((lesson) => lesson.tracks.includes("I"))).toBe(true);
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
    expect(parseTrainingDeepLink("#lesson=kr-5-hooke&level=2")).toEqual({
      lessonId: "kr-5-hooke",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=%3Cscript%3E")).toEqual({});
    expect(parseTrainingDeepLink("#lesson=1.2")).toEqual({});
    expect(parseTrainingDeepLink("")).toEqual({});
  });
});

describe("Zweige und Wahl", () => {
  it("offers Zweig II/III Mechanik, Optik and Magnetismus, and Zweig I Energie, Wärme, Elektrizität and the Wahlbereich", () => {
    const ids = (track: "I" | "II_III") => lessonsForTrack(track).map((lesson) => lesson.id);
    const prefixes = (track: "I" | "II_III") => [...new Set(ids(track).map((id) => id.split("-")[0]))];
    expect(prefixes("II_III")).toEqual(["kr", "op", "el"]);
    expect(prefixes("I")).toEqual(["en", "wl", "el", "ak", "as"]);
    expect(ids("II_III")).toContain("el-1-magnete");
    expect(ids("I")).not.toContain("el-1-magnete");
    expect(ids("I")).toContain("el-8-stromstaerke-messen");
    expect(ids("II_III")).not.toContain("el-8-stromstaerke-messen");
    // Elektrostatik, Strom und Gefahren are shared.
    for (const id of ["el-3-ladung", "el-4-elektrisches-feld", "el-5-elektrostatik-anwendung", "el-6-strom", "el-7-stromkreis", "el-10-gefahren-schutz"]) {
      expect(ids("I")).toContain(id);
      expect(ids("II_III")).toContain(id);
    }
  });

  it("lets a Wahl lesson and the Wahlbereiche count on their own", () => {
    const energie = STAGES[2];
    expect(isElectiveStage(energie)).toBe(false);
    expect(relevantLessons(energie, "I")).toHaveLength(8);
    expect(requiredLessons(energie, "I")).toHaveLength(7);
    expect(requiredLessons(energie, "I").map((lesson) => lesson.id)).not.toContain("en-3-flaschenzug");
    const akustik = STAGES[5];
    const astronomie = STAGES[6];
    expect(isElectiveStage(akustik)).toBe(true);
    expect(isElectiveStage(astronomie)).toBe(true);
    expect(requiredLessons(akustik, "I")).toHaveLength(2);
    expect(requiredLessons(akustik, "II_III")).toHaveLength(0);

    const progress: LearnerProgress = {
      activeLessonId: "kr-1-messen",
      difficultyLevel: 1,
      trackFilter: "I",
      quizDone: [],
      labGoals: {},
      solved: {},
      attempts: {},
      celebratedStageIds: [],
      celebratedLessonIds: [],
    };
    const finishLesson = (id: string) => {
      const lesson = findLessonById(id)!.lesson;
      progress.quizDone.push(lesson.id);
      progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
      progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: 0 };
    };
    for (const lesson of requiredLessons(energie, "I")) finishLesson(lesson.id);
    expect(isStageComplete(progress, energie, "I"), "Flaschenzug is a Wahl and does not block the stage").toBe(true);
    for (const lesson of akustik.lessons) finishLesson(lesson.id);
    expect(isStageComplete(progress, akustik, "I")).toBe(true);
    // Wahlbereiche are outside the total; the regular stages count 3 + 4 + 10 lessons of Zweig I.
    const total = overallStats(progress, STAGES, "I");
    expect(total.total).toBe(7 + 7 + 10 - 2);
    expect(total.totalStages).toBe(3);
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
  const prefix = `${ZAM_ACADEMY_APP_URL}#lesson=`;
  const ULID = /^[0-9A-HJKMNP-TV-Z]{26}$/;
  const lessonOf = (link: string | undefined) => (link?.startsWith(prefix) ? link.slice(prefix.length) : "");

  it("is the cell of this app with one atom per lesson, in lesson order", () => {
    expect(cell.tile_id).toBe("zam-academy:physik-realschule-8");
    expect(/^\d+(\.\d+)*$/.test(cell.version)).toBe(true);
    expect(cell.atoms.map((atom) => lessonOf(atom.source_link))).toEqual(ALL_LESSONS.map((lesson) => lesson.id));
  });

  it("cites for every card the lesson of its atom, and binds the atom to its stage, Zweige and Lernbereich", () => {
    for (const atom of cell.atoms) {
      const lessonId = lessonOf(atom.source_link);
      const found = findLessonById(lessonId);
      expect(found, `${atom.id} cites ${atom.source_link}`).toBeDefined();
      const { stage, lesson } = found!;
      const academy = atom.curricula?.find((binding) => binding.provider === "zam-academy");
      expect(academy?.topic_code, `${atom.slug} is bound to its stage`).toBe(stage.id);
      const bindings = (atom.curricula ?? []).filter((binding) => binding.provider === "lehrplanplus-bayern");
      for (const binding of bindings) {
        expect(binding.school_type).toBe("realschule");
        expect(binding.grade).toBe(8);
        expect(binding.subject).toBe("physik");
        expect(binding.topic_code).toMatch(/^lb\d(\.\d)?$/);
      }
      expect(bindings.map((binding) => binding.track).sort(), `${atom.slug} carries the lesson's Zweige`).toEqual([...lesson.tracks].sort());
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
      expect(atom.slug.startsWith("ph8-"), atom.slug).toBe(true);
      for (const prereq of atom.prerequisites ?? []) {
        expect(cell.atoms.some((other) => other.id === prereq.atom_id), `${atom.slug} needs ${prereq.atom_id}`).toBe(true);
      }
      for (const item of atom.practice_items) {
        expect(ULID.test(item.id), item.id).toBe(true);
        expect(ids.has(item.id), `${item.id} is unique`).toBe(false);
        ids.add(item.id);
        expect(slugs.has(item.slug), `${item.slug} is unique`).toBe(false);
        slugs.add(item.slug);
        expect(item.slug.startsWith("ph8-"), item.slug).toBe(true);
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
          for (const option of item.fast_check.options) expect(option, `${item.slug}: fast check shows no markup`).not.toMatch(/[\\{}$]/);
        }
        expect(item.choice_distractors?.length, `${item.slug} has distractors`).toBe(2);
        for (const distractor of item.choice_distractors ?? []) {
          expect(distractor.reason, `${item.slug}: every distractor says why`).toBeTruthy();
        }
      }
    }
    expect(ids.size).toBe(cell.atoms.length + cell.atoms.reduce((n, atom) => n + atom.practice_items.length, 0));
  });

  describe("proposes the takeover from the two de-by Realschule 8 physics cells without applying it", () => {
    interface MappingRow {
      de_by_cell: string;
      de_by_id: string;
      de_by_question: string;
      category: "A" | "C";
      academy_slug: string | null;
      action: "replace" | "retire" | "keep";
      note: string;
      retire_reason?: string;
    }
    const table = replacesJson as unknown as { approved: string | null; status: string; rows: MappingRow[] };
    const items = cell.atoms.flatMap((atom) => atom.practice_items);
    const bySlug = new Map(items.map((item) => [item.slug, item]));
    const DE_BY = /^01K4P8[EM]0000000000000000J\d{2}$/;

    it("lists every de-by item exactly once: 4 replaced, 10 retired, 2 left alone", () => {
      expect(table.rows).toHaveLength(16);
      const ids = table.rows.map((row) => row.de_by_id);
      expect(new Set(ids).size).toBe(16);
      for (const id of ids) expect(DE_BY.test(id), id).toBe(true);
      const count = (action: string) => table.rows.filter((row) => row.action === action).length;
      expect({ replace: count("replace"), retire: count("retire"), keep: count("keep") }).toEqual({ replace: 4, retire: 10, keep: 2 });
      for (const row of table.rows) {
        expect(row.note, `${row.de_by_id} needs a reason`).toBeTruthy();
        expect(row.category === "A", `${row.de_by_id}: only replaced rows are category A`).toBe(row.action === "replace");
      }
    });

    it("names an existing successor for every replaced row and a reason for every retired row", () => {
      for (const row of table.rows.filter((r) => r.action === "replace")) {
        expect(bySlug.get(row.academy_slug ?? ""), `${row.de_by_id} → ${row.academy_slug}`).toBeDefined();
      }
      const successors = table.rows.filter((r) => r.action === "replace").map((r) => r.academy_slug);
      expect(new Set(successors).size, "one history per successor").toBe(4);
      for (const row of table.rows.filter((r) => r.action === "retire")) {
        expect(row.academy_slug, `${row.de_by_id} has no successor`).toBeNull();
        expect(row.retire_reason?.length, row.de_by_id).toBeGreaterThan(30);
      }
    });

    it("ships the cell without replaces and retired_items while the mapping is only a proposal", () => {
      // Package standard: a new cell ships first without declarations, so it needs no approval.
      // scripts/build-catalog.mjs blocks any cell with replaces or retired_items until `approved` is a valid date.
      expect(table.approved).toBeNull();
      expect(table.status).toBe("proposal-only");
      expect("retired_items" in cell).toBe(false);
      for (const item of items) expect("replaces" in item, `${item.slug} replaces nothing`).toBe(false);
    });
  });
});

describe("Lehrplan-Abdeckung (coverage.json)", () => {
  interface CoverageRow {
    track: "I" | "II_III";
    lb: number;
    unit?: string;
    competence: string;
    lessons: string[];
    status: string;
    evidence: string;
  }
  const coverage = coverageJson as unknown as {
    checked: string;
    curriculum: Record<string, string>;
    learning_areas: Array<{ track: string; lb: number; hours: number }>;
    optional_lessons: string[];
    elective_lessons: string[];
    rows: CoverageRow[];
  };
  const unitOf = (row: CoverageRow) => row.unit ?? String(row.lb);

  it("lists every Kompetenzerwartung of both Fachlehrpläne: 20 for Zweig II/III, 19 for Zweig I", () => {
    expect(coverage.checked).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Object.keys(coverage.curriculum).sort()).toEqual(["I", "II_III"]);
    const perUnit = (track: string) => {
      const counts: Record<string, number> = {};
      for (const row of coverage.rows.filter((r) => r.track === track)) counts[unitOf(row)] = (counts[unitOf(row)] ?? 0) + 1;
      return counts;
    };
    expect(perUnit("II_III")).toEqual({ "1": 9, "2": 5, "3": 6 });
    expect(perUnit("I")).toEqual({ "1": 4, "2": 6, "3": 4, "4.1": 3, "4.2": 2 });
    const hours = (track: string) => coverage.learning_areas.filter((a) => a.track === track).reduce((n, a) => n + a.hours, 0);
    expect({ I: hours("I"), II_III: hours("II_III") }).toEqual({ I: 56, II_III: 56 });
    expect(new Set(coverage.rows.map((row) => `${row.track}|${row.competence}`)).size, "no competence is listed twice").toBe(coverage.rows.length);
    for (const row of coverage.rows) {
      expect(row.competence.length, `${row.track} LB ${unitOf(row)}`).toBeGreaterThan(60);
      expect(row.competence).not.toContain("\u00ad");
    }
  });

  it("gives every competence a lesson of its Zweig and its Lernbereich, with evidence", () => {
    for (const row of coverage.rows) {
      const where = `${row.track} LB ${unitOf(row)}: ${row.competence.slice(0, 40)}`;
      expect(row.status, where).toBe("implemented");
      expect(row.lessons.length, where).toBeGreaterThan(0);
      expect(row.evidence.length, where).toBeGreaterThan(40);
      for (const id of row.lessons) {
        const lesson = findLessonById(id)?.lesson;
        expect(lesson, `${where}: ${id}`).toBeDefined();
        expect(lesson?.tracks, `${where}: ${id} serves the Zweig`).toContain(row.track);
        expect(lesson?.lehrplan, `${where}: ${id} names the Lernbereich`).toContain(`Ph8 LB ${unitOf(row)} (`);
      }
    }
  });

  it("gives every lesson a competence, and keeps the elective lessons out of the progress total", () => {
    const covered = new Set(coverage.rows.flatMap((row) => row.lessons));
    for (const lesson of ALL_LESSONS) {
      expect(covered.has(lesson.id) || coverage.optional_lessons.includes(lesson.id), `${lesson.id} serves a competence`).toBe(true);
    }
    expect(coverage.elective_lessons.slice().sort()).toEqual(ALL_LESSONS.filter((lesson) => lesson.optional).map((lesson) => lesson.id).sort());
  });

  it("binds every ZAM atom to the Lernbereich of the competences its lesson serves, per Zweig", () => {
    for (const atom of (cellJson as unknown as { atoms: Array<{ source_link: string; curricula: Array<{ provider: string; track?: string; topic_code: string }> }> }).atoms) {
      const lessonId = atom.source_link.split("#lesson=")[1];
      const bindings = atom.curricula.filter((binding) => binding.provider === "lehrplanplus-bayern");
      for (const binding of bindings) {
        const units = coverage.rows.filter((row) => row.track === binding.track && row.lessons.includes(lessonId)).map(unitOf);
        expect(units.map((unit) => `lb${unit}`), `${lessonId} (${binding.track})`).toContain(binding.topic_code);
      }
    }
  });
});
