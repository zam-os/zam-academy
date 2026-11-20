import { describe, expect, it } from "vitest";
import coverage from "../coverage.json";
import {
  ALL_LESSONS,
  continuationLesson,
  findLessonById,
  nextLesson,
  previousLesson,
  STAGES,
} from "../src/curriculum/index";
import { quizOrder } from "../src/exercises/quiz-order";
import {
  applyAction,
  clampParam,
  computeReadouts,
  defaultLabValues,
  enumerateLabGrid,
  reachedGoals,
} from "../src/lab/engine";
import { fieldLabel, runSequence, startAt } from "../src/lab/figur";
import type { LabDefinition, LabValues } from "../src/model/types";
import { lessonLink, parseTrainingDeepLink } from "../src/zam/zam-link";
import { LESSON_IDS } from "./lesson-ids";

function must<T>(value: T | undefined | null, label = "expected value"): T {
  if (value === undefined || value === null) throw new Error(label);
  return value;
}

function sampledGrid(lab: LabDefinition, samples: number, limit = 1500): LabValues[] {
  const grid = enumerateLabGrid(lab, samples);
  if (grid.length <= limit) return grid;
  const stride = Math.ceil(grid.length / limit);
  return grid.filter((_, index) => index % stride === 0);
}

const MODULES = ["1", "2"] as const;

describe("LehrplanPLUS Mittelschule Informatik 6 (LB 1–2)", () => {
  it("pins all 12 stable lesson ids across two stages, one per Lernbereich, each with its own accent", () => {
    expect(STAGES.map((stage) => stage.module)).toEqual([...MODULES]);
    expect(new Set(STAGES.map((stage) => stage.accent)).size).toBe(STAGES.length);
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual([...LESSON_IDS]);
    expect(new Set(ALL_LESSONS.map((lesson) => lesson.lab.kind)).size).toBe(ALL_LESSONS.length);
    for (const stage of STAGES) {
      expect(stage.stageNumber).toBe(MODULES.indexOf(stage.module) + 1);
      for (const lesson of stage.lessons) {
        expect(lesson.module).toBe(stage.module);
        expect(lesson.stageId).toBe(stage.id);
      }
    }
  });

  it("ships complete explanations, quick checks, key terms, workshops and two generators on every lesson", () => {
    for (const lesson of ALL_LESSONS) {
      expect(lesson.lehrplan, lesson.id).toMatch(/^Inf6 LB [12] /);
      expect(lesson.explanationHtml.length, lesson.id).toBeGreaterThan(600);
      expect(lesson.explanationHtml, lesson.id).toContain('<div class="example">');
      expect(lesson.explanationHtml, lesson.id).toContain('<div class="merke">');
      expect(lesson.explanationHtml, lesson.id).not.toMatch(/https?:\/\/|youtube|vimeo|<iframe/i);
      expect(lesson.formulas.length, lesson.id).toBeGreaterThanOrEqual(3);
      expect(lesson.exercises.length, lesson.id).toBeGreaterThanOrEqual(2);
      expect(new Set(lesson.exercises.map((g) => g.id)).size, lesson.id).toBe(lesson.exercises.length);
      expect(lesson.lab.goals.length, lesson.id).toBe(3);
      expect(lesson.quiz.options, lesson.id).toHaveLength(3);
      expect(new Set(lesson.quiz.options).size, lesson.id).toBe(3);
      expect(lesson.quiz.explanation.length, lesson.id).toBeGreaterThan(40);
      expect(lesson.requiredCorrect).toBe(3);
      const order = quizOrder(lesson);
      expect([...order].sort((a, b) => a - b)).toEqual([0, 1, 2]);
      for (const text of [lesson.explanationHtml, lesson.whyItMatters, lesson.quiz.question, ...lesson.quiz.options]) {
        expect(text, `${lesson.id}: real minus sign`).not.toMatch(/(^|[\s(:=>])-\d/);
      }
      const strippedHtml = lesson.explanationHtml.replace(/<[^>]+>/g, " ");
      expect(strippedHtml, `${lesson.id}: decimal comma`).not.toMatch(/\d\.\d/);
    }
    const longestCorrectCount = ALL_LESSONS.filter((lesson) => {
      const rightLen = lesson.quiz.options[lesson.quiz.correctIndex].length;
      const maxWrongLen = Math.max(
        ...lesson.quiz.options
          .filter((_, idx) => idx !== lesson.quiz.correctIndex)
          .map((opt) => opt.length),
      );
      return rightLen > maxWrongLen;
    }).length;
    expect(longestCorrectCount).toBeLessThanOrEqual(4);
  });

  it("maps every verbatim Kompetenzerwartung and content bullet of Inf6 LB 1–2 to lessons, and covers every lesson", () => {
    expect(coverage.rows).toHaveLength(6);
    expect(coverage.contents).toHaveLength(7);
    expect(coverage.optional_lessons).toEqual([]);
    const seen = new Set<string>();
    for (const row of coverage.rows) {
      expect(MODULES).toContain(row.lb);
      expect(row.competence.length).toBeGreaterThan(30);
      expect(row.evidence.length).toBeGreaterThan(30);
      expect(["implemented", "supported"]).toContain(row.status);
      expect(seen.has(row.competence), `duplicate competence: ${row.competence}`).toBe(false);
      seen.add(row.competence);
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        const lesson = must(findLessonById(id)?.lesson, id);
        expect(lesson.module, `${id} serves LB ${row.lb}`).toBe(row.lb);
      }
    }
    for (const row of coverage.contents) {
      expect(MODULES).toContain(row.lb);
      expect(row.lessons.length).toBeGreaterThan(0);
      for (const id of row.lessons) {
        must(findLessonById(id)?.lesson, id);
      }
    }
    for (const module of MODULES) {
      expect(coverage.rows.filter((row) => row.lb === module)).toHaveLength(3);
    }
    for (const lesson of ALL_LESSONS) {
      expect(
        coverage.rows.some((row) => row.lessons.includes(lesson.id)),
        `${lesson.id} covers at least one competence`,
      ).toBe(true);
    }
  });

  it("navigates cleanly and resolves canonical deep links", () => {
    expect(previousLesson(LESSON_IDS[0])).toBeUndefined();
    expect(nextLesson(LESSON_IDS[0])?.id).toBe(LESSON_IDS[1]);
    expect(previousLesson(LESSON_IDS[1])?.id).toBe(LESSON_IDS[0]);
    expect(nextLesson(LESSON_IDS[LESSON_IDS.length - 1])).toBeUndefined();
    expect(continuationLesson("unknown-id").id).toBe(LESSON_IDS[0]);
    for (const id of LESSON_IDS) {
      expect(parseTrainingDeepLink(new URL(lessonLink(id)).hash).lessonId).toBe(id);
    }
    expect(parseTrainingDeepLink("#lesson=ms6-testen-optimieren&level=2")).toEqual({
      lessonId: "ms6-testen-optimieren",
      level: 2,
    });
    expect(parseTrainingDeepLink("#lesson=<script>&level=9")).toEqual({});
  });
});

describe("All 12 workshops", () => {
  for (const lesson of ALL_LESSONS) {
    it(`${lesson.id} (${lesson.lab.kind}) starts open, reaches every goal and renders clean SVG`, () => {
      const lab = lesson.lab;
      const start = defaultLabValues(lab);
      expect(reachedGoals(lab, start), `${lesson.id}: no goal at the start`).toHaveLength(0);
      const grid = lab.witnesses ? [] : sampledGrid(lab, 21, 200000);
      for (const goal of lab.goals) {
        const witness =
          lab.witnesses?.[goal.id] ?? grid.find((values) => goal.check(values, computeReadouts(lab, values)));
        expect(witness, `${lesson.id}: ${goal.text}`).toBeDefined();
        const reached = { ...start, ...must(witness) };
        for (const param of lab.params) {
          expect(clampParam(param, reached[param.key]), `${lesson.id}: witness ${param.key} in range`).toBe(
            reached[param.key],
          );
        }
        expect(goal.check(reached, computeReadouts(lab, reached)), `${lesson.id}: ${goal.id}`).toBe(true);
      }
      for (const values of sampledGrid(lab, 3)) {
        const readouts = computeReadouts(lab, values);
        for (const val of Object.values(readouts)) {
          if (typeof val === "number") expect(Number.isFinite(val)).toBe(true);
          else {
            expect(val).not.toMatch(/\bNaN\b|undefined|Infinity/);
            expect(val, `${lesson.id}: readout minus`).not.toMatch(/(^|[\s(:=])-\d/);
          }
        }
        const svg = lab.view.render(values, readouts);
        expect(svg).toContain('role="img"');
        expect(svg.trim().endsWith("</svg>")).toBe(true);
        expect(svg).not.toMatch(/\bNaN\b|undefined|Infinity/);
        for (const [, text] of svg.matchAll(/>([^<]+)</g)) {
          expect(text, `${lesson.id}: SVG minus`).not.toMatch(/(^|[\s(:=])-\d/);
        }
      }
      for (const action of lab.actions ?? []) {
        const after = applyAction(lab, start, action.id);
        expect(Object.keys(after).sort()).toEqual(Object.keys(start).sort());
      }
    });
  }

  it("lets drag handles move their parameters to finite values", () => {
    const withHandles = ALL_LESSONS.filter((lesson) => Object.keys(lesson.lab.view.handles ?? {}).length > 0);
    expect(withHandles.length).toBeGreaterThanOrEqual(5);
    for (const lesson of withHandles) {
      for (const spec of Object.values(must(lesson.lab.view.handles))) {
        const raw = spec.drag({ x: 250, y: 150 }, defaultLabValues(lesson.lab));
        for (const [key, value] of Object.entries(raw)) {
          const param = must(lesson.lab.params.find((p) => p.key === key), key);
          expect(Number.isFinite(clampParam(param, value ?? 0))).toBe(true);
        }
      }
    }
  });
});

describe("Subject details checked in review", () => {
  it("labels both stages with Inf6 LB 1 and Inf6 LB 2", () => {
    expect(STAGES[0].lehrplanLabel).toBe("Inf6 LB 1");
    expect(STAGES[1].lehrplanLabel).toBe("Inf6 LB 2");
  });

  it("filters search results cleanly and checks Creative Commons rules accurately", () => {
    const searchLesson = must(findLessonById("ms6-suchstrategien")).lesson;
    const filtered = computeReadouts(searchLesson.lab, {
      begriff: 1,
      ausschluss: 2,
      siteFilter: 1,
      zeitraum: 2022,
    });
    expect(String(filtered.hits)).toBe("3 (3 fachlich · 0 unpassend)");
    expect(String(filtered.query)).toContain("-bettwäsche -shop");
    expect(String(filtered.query)).not.toContain("−");

    const ccLesson = must(findLessonById("ms6-urheberrecht-lizenzen")).lesson;
    expect(computeReadouts(ccLesson.lab, { lizenz: 5, nutzung: 1 }).status).toBe("Erlaubt");
    expect(computeReadouts(ccLesson.lab, { lizenz: 5, nutzung: 2 }).status).toBe("Nicht erlaubt");
    expect(computeReadouts(ccLesson.lab, { lizenz: 2, nutzung: 2 }).status).toBe("Erlaubt");
    expect(computeReadouts(ccLesson.lab, { lizenz: 1, nutzung: 4 }).status).toBe("Erlaubt");

    const pwLesson = must(findLessonById("ms6-passwoerter-virenschutz")).lesson;
    expect(computeReadouts(pwLesson.lab, { laenge: 22, zeichensatz: 1, persoenlich: 1, schutz: 1 }).status).toBe("Sehr gut geschützt");
    expect(computeReadouts(pwLesson.lab, { laenge: 12, zeichensatz: 3, persoenlich: 1, schutz: 1 }).status).toBe("Sehr gut geschützt");
    expect(computeReadouts(pwLesson.lab, { laenge: 12, zeichensatz: 3, persoenlich: 0, schutz: 1 }).status).not.toBe("Sehr gut geschützt");
    expect(computeReadouts(pwLesson.lab, { laenge: 10, zeichensatz: 3, persoenlich: 1, schutz: 1 }).status).not.toBe("Sehr gut geschützt");
  });

  it("renders full workshop and structogram texts without mid-word splits or truncated endings", () => {
    const joinedSvgText = (svg: string) =>
      [...svg.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)]
        .map((m) =>
          m[1]
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"'),
        )
        .join(" ")
        .replace(/\s+/g, " ");

    const search = must(findLessonById("ms6-suchstrategien")).lesson.lab;
    for (const begriff of [0, 1]) {
      for (const ausschluss of [0, 1, 2]) {
        for (const siteFilter of [0, 1]) {
          const vals = { begriff, ausschluss, siteFilter, zeitraum: 2022 };
          const readouts = computeReadouts(search, vals);
          const rendered = joinedSvgText(search.view.render(vals, readouts));
          expect(rendered).toContain(`Suche: ${String(readouts.query)}`);
        }
      }
    }

    const quellen = must(findLessonById("ms6-informationsqualitaet")).lesson.lab;
    for (const tonfall of [0, 1]) {
      const vals = { absender: 2, tonfall, quellenAnzahl: 2, alterJahre: 1 };
      const rendered = joinedSvgText(quellen.view.render(vals, computeReadouts(quellen, vals)));
      expect(rendered).toContain(
        tonfall === 1
          ? "Trinkwasserbericht 2026: Messwerte im Überblick"
          : "SCHOCK-BERICHT: DAS VERSCHWEIGEN SIE DIR!!",
      );
    }

    const cc = must(findLessonById("ms6-urheberrecht-lizenzen")).lesson.lab;
    for (let lizenz = 0; lizenz <= 5; lizenz++) {
      for (let nutzung = 0; nutzung <= 4; nutzung++) {
        const vals = { lizenz, nutzung };
        const readouts = computeReadouts(cc, vals);
        const rendered = joinedSvgText(cc.view.render(vals, readouts));
        expect(rendered, `CC ${lizenz}/${nutzung}`).toContain(String(readouts.hinweis));
      }
    }

    const backup = must(findLessonById("ms6-datensicherung")).lesson.lab;
    for (let ort = 0; ort <= 3; ort++) {
      for (let ereignis = 0; ereignis <= 3; ereignis++) {
        const vals = { ort, intervall: 7, ereignis };
        const readouts = computeReadouts(backup, vals);
        const rendered = joinedSvgText(backup.view.render(vals, readouts));
        expect(rendered, `Backup ${ort}/${ereignis}`).toContain(String(readouts.erklaerung));
      }
    }

    const schleife = must(findLessonById("ms6-bedingte-wiederholung")).lesson.lab;
    const sVals = { hindernisZeile: 2, schleifenArt: 1, koerper: 2 };
    const sText = joinedSvgText(schleife.view.render(sVals, computeReadouts(schleife, sVals)));
    expect(sText).toContain("solange vorne frei");
    expect(sText).toContain("links drehen · rechts drehen");

    const alt = must(findLessonById("ms6-alternative")).lesson.lab;
    const aVals = { sensor: 1, art: 1, dannAktion: 1, sonstAktion: 0 };
    const aText = joinedSvgText(alt.view.render(aVals, computeReadouts(alt, aVals)));
    expect(aText).toContain("vorne Hindernis?");
    expect(aText).toContain("rechts drehen");
    expect(aText).toContain("links drehen");

    const schachtel = must(findLessonById("ms6-schachtelung")).lesson.lab;
    const scVals = { parcours: 0, aussen: 1, wennFrei: 1, sonst: 2 };
    const scText = joinedSvgText(schachtel.view.render(scVals, computeReadouts(schachtel, scVals)));
    expect(scText).toContain("solange nicht auf Stern");
    expect(scText).toContain("vorne frei?");
    expect(scText).toContain("vor gehen");
  });

  it("tracks figure movement, endless loops, nested courses, and boundary debugging", () => {
    const end = runSequence(
      { size: 5, obstacles: [{ x: 0, y: 2 }] },
      ["rechts", "vor", "vor", "links", "vor"],
      startAt(0, 4, 0),
    );
    expect(fieldLabel(end.x, end.y)).toBe("C4");
    expect(end.bumps).toBe(0);

    const schachtel = must(findLessonById("ms6-schachtelung")).lesson;
    const p1 = computeReadouts(schachtel.lab, { parcours: 0, aussen: 1, wennFrei: 1, sonst: 2 });
    expect(p1.ziel).toContain("E1");
    const p2 = computeReadouts(schachtel.lab, { parcours: 1, aussen: 1, wennFrei: 1, sonst: 2 });
    expect(p2.ziel).toContain("E5");
    const stuck = computeReadouts(schachtel.lab, { parcours: 0, aussen: 1, wennFrei: 1, sonst: 0 });
    expect(stuck.runden).toBe("Endlos (abgebrochen)");

    const debug = must(findLessonById("ms6-testen-optimieren")).lesson;
    expect(computeReadouts(debug.lab, { gangLaenge: 0, programm: 0 }).testfall).toContain("Fehlgeschlagen");
    expect(computeReadouts(debug.lab, { gangLaenge: 0, programm: 3 }).testfall).toContain("Bestanden");
    expect(computeReadouts(debug.lab, { gangLaenge: 5, programm: 3 }).testfall).toContain("Bestanden");
  });
});
