import initSqlJs, { type SqlJsStatic } from "sql.js";
import { beforeAll, describe, expect, it } from "vitest";
import cellJson from "../cell.json";
import replacesJson from "../replaces-de-by.json";
import { ALL_LESSONS, findLessonById, lessonsForFilter, STAGES } from "../src/curriculum";
import { q, setupSql } from "../src/db/dataset";
import { createDatabase, runSql } from "../src/db/engine";
import { checkTask } from "../src/exercises/checker";
import { quizOrder } from "../src/exercises/quiz-order";
import { createRng, seedFrom } from "../src/exercises/rng";
import { UI_STRINGS } from "../src/i18n/translations";
import type { AppLocale, Cardinality, ErLabDefinition, Lesson, SqlLabContext, SqlLabDefinition } from "../src/model/types";
import {
  isLessonComplete,
  isStageComplete,
  isTransferDone,
  type LearnerProgress,
  overallStats,
  relevantLessons,
  stageStats,
} from "../src/storage/progress";
import { lessonLink, parseTrainingDeepLink, ZAM_ACADEMY_APP_URL } from "../src/zam/zam-link";

const LOCALES: AppLocale[] = ["de", "en"];

let SQL: SqlJsStatic;
beforeAll(async () => {
  SQL = await initSqlJs();
});

// ZAM cards (cell.json, zam-academy:sql) cite these ids. Renaming a lesson
// breaks every card that cites it: change the cell in the same step.
const LESSON_IDS = [
  "db-1-datenbanksystem",
  "db-2-datensatz-datenfeld",
  "db-3-datentypen",
  "db-4-primaerschluessel",
  "sql-1-where",
  "sql-2-und-oder",
  "sql-3-like",
  "sql-4-order-by",
  "sql-5-berechnen",
  "sql-6-aggregat",
  "er-1-redundanz",
  "er-2-kardinalitaet",
  "er-3-fremdschluessel",
  "join-1-zwei-tabellen",
  "join-2-drei-tabellen",
  "rep-1-group-by",
  "rep-2-left-join",
  "dml-1-einfuegen-aendern",
];

describe("Lernpfad", () => {
  it("keeps the lesson ids ZAM cards cite, in four stages", () => {
    expect(ALL_LESSONS.map((lesson) => lesson.id)).toEqual(LESSON_IDS);
    expect(STAGES.map((stage) => stage.lessons.length)).toEqual([4, 6, 5, 3]);
    for (const stage of STAGES) {
      stage.lessons.forEach((lesson, index) => {
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.stepNumber).toBe(index + 1);
      });
    }
  });

  it("scopes the path by IT module: 2.3.1, plus 2.3.2, everything", () => {
    expect(lessonsForFilter("2.3.1").map((l) => l.id)).toEqual(LESSON_IDS.slice(0, 10));
    expect(lessonsForFilter("2.3.2")).toHaveLength(16);
    expect(lessonsForFilter("alle")).toHaveLength(18);
    expect(ALL_LESSONS.filter((l) => l.module === "extra").map((l) => l.id)).toEqual(["rep-1-group-by", "rep-2-left-join"]);
  });

  it("says everything in both languages", () => {
    for (const locale of LOCALES) {
      for (const stage of STAGES) {
        const st = stage.text[locale];
        for (const value of [st.title, st.subtitle, st.badgeTitle, st.moduleLabel]) expect(value.length).toBeGreaterThan(2);
      }
      for (const lesson of ALL_LESSONS) {
        const text = lesson.text[locale];
        const label = `${lesson.id} (${locale})`;
        expect(text.title.length, label).toBeGreaterThan(5);
        expect(text.subtitle.length, label).toBeGreaterThan(10);
        expect(text.whyItMatters.length, label).toBeGreaterThan(40);
        expect(text.explanationHtml, label).toContain("<p>");
        expect(text.explanationHtml, label).not.toMatch(/\{[a-z_]+\}/);
        expect(text.syntax.length, label).toBeGreaterThanOrEqual(1);
        expect(text.quiz.options.length, label).toBeGreaterThanOrEqual(2);
        expect(text.quiz.correctIndex, label).toBeLessThan(text.quiz.options.length);
        expect(text.quiz.explanation.length, label).toBeGreaterThan(10);
        expect(text.celebrationMessage.length, label).toBeGreaterThan(10);
        for (const goal of lesson.lab.goals) {
          expect(text.lab.goals[goal.id], `${label}: goal ${goal.id} has text`).toBeTruthy();
        }
        expect(Object.keys(text.lab.goals).sort()).toEqual(lesson.lab.goals.map((goal) => goal.id).sort());
      }
      // The German and English texts of a lesson are not the same text.
      for (const lesson of ALL_LESSONS) {
        expect(lesson.text.de.title).not.toBe(lesson.text.en.title);
      }
    }
    expect(Object.keys(UI_STRINGS.de).sort()).toEqual(Object.keys(UI_STRINGS.en).sort());
  });

  it("does not always put the right quick-check answer first once shuffled", () => {
    const shown = ALL_LESSONS.map((lesson) => quizOrder(lesson).indexOf(lesson.text.de.quiz.correctIndex));
    expect(new Set(shown).size).toBeGreaterThanOrEqual(2);
  });
});

describe("Aufgaben", () => {
  it("generates tasks whose reference answer passes and whose prompts are fully resolved, over many seeds", () => {
    const kinds = new Set<string>();
    for (const lesson of ALL_LESSONS) {
      for (const generator of lesson.exercises) {
        for (const locale of LOCALES) {
          for (const level of [1, 2] as const) {
            for (let seed = 1; seed <= 8; seed++) {
              const rng = createRng(seedFrom(`${lesson.id}:${level}:${seed}`));
              const task = generator.make(rng, level, locale);
              const label = `${lesson.id}/${generator.id} ${locale} L${level} #${seed}`;
              kinds.add(task.kind);
              expect(task.prompt, label).not.toMatch(/[{}]/);
              expect(task.prompt.length, label).toBeGreaterThan(20);
              expect(task.solutionHtml, label).not.toMatch(/\{[a-z_]+\}/);
              if (level === 2) expect(task.hint, label).toBeUndefined();
              if (task.kind === "choice") {
                expect(task.options.length, label).toBeGreaterThanOrEqual(3);
                expect(checkTask(SQL, lesson.tables, task, task.correctIndex, locale).status, label).toBe("correct");
                const wrong = (task.correctIndex + 1) % task.options.length;
                expect(checkTask(SQL, lesson.tables, task, wrong, locale).status, label).toBe("wrong");
                continue;
              }
              expect(task.referenceSql, label).not.toMatch(/[{}]/);
              const reference = checkTask(SQL, lesson.tables, task, task.referenceSql, locale);
              expect(reference, label).toMatchObject({ status: "correct" });
              expect(checkTask(SQL, lesson.tables, task, "", locale).status, label).toBe("empty");
              if (task.kind === "query") {
                const db = createDatabase(SQL, setupSql(locale, lesson.tables));
                const outcome = runSql(db, task.referenceSql);
                db.close();
                expect(outcome.ok, label).toBe(true);
                if (outcome.ok) {
                  expect(outcome.results, label).toHaveLength(1);
                  expect(outcome.results[0].values.length, `${label}: reference returns rows`).toBeGreaterThan(0);
                }
                expect(checkTask(SQL, lesson.tables, task, "SELECT -12345 AS x;", locale).status, label).toBe("wrong");
                expect(checkTask(SQL, lesson.tables, task, "SELEC 1;", locale).status, label).toBe("error");
              } else {
                expect(checkTask(SQL, lesson.tables, task, "SELECT 1;", locale).status, label).toBe("wrong");
              }
            }
          }
        }
      }
    }
    expect([...kinds].sort()).toEqual(["choice", "mutation", "query"]);
  }, 60_000); // 8 seeds × 2 levels × 2 languages × 54 generators: ~3 s here, ~9 s on a CI runner

  it("judges a query by its result, not its wording", () => {
    const lesson = findLessonById("sql-1-where")!.lesson;
    const task = lesson.exercises[0].make(createRng(1), 1, "de");
    if (task.kind !== "query") throw new Error("expected a query task");
    const city = String(task.meta?.city);
    expect(checkTask(SQL, lesson.tables, task, `select * from KUNDEN where ort='${city}'`, "de").status).toBe("correct");
    expect(checkTask(SQL, lesson.tables, task, `SELECT vorname FROM kunden WHERE ort = '${city}';`, "de").message).toContain("Spalte");
    expect(checkTask(SQL, lesson.tables, task, "SELECT * FROM kunden;", "de").message).toContain("Zeile");
  });

  it("judges a change by every table it leaves behind", () => {
    const lesson = findLessonById("dml-1-einfuegen-aendern")!.lesson;
    const make = lesson.exercises.find((generator) => generator.id === "loeschen")!.make;
    // A deletion that leaves kunden alone, so changing kunden is the learner's extra.
    const task = Array.from({ length: 20 }, (_, seed) => make(createRng(seed + 1), 1, "de")).find(
      (candidate) => candidate.kind === "mutation" && !candidate.referenceSql.includes("kunden"),
    );
    if (task?.kind !== "mutation") throw new Error("expected a change task");
    expect(checkTask(SQL, lesson.tables, task, task.referenceSql, "de").status).toBe("correct");
    const dropped = checkTask(SQL, lesson.tables, task, `${task.referenceSql}\nPRAGMA foreign_keys = OFF;\nDROP TABLE kunden;`, "de");
    expect(dropped).toMatchObject({ status: "wrong", message: expect.stringContaining("kunden") });
    const emptied = checkTask(SQL, lesson.tables, task, `${task.referenceSql}\nDELETE FROM kunden WHERE kunden_id = 13;`, "de");
    expect(emptied).toMatchObject({ status: "wrong", message: expect.stringContaining("kunden") });
    const extra = checkTask(SQL, lesson.tables, task, `${task.referenceSql}\nCREATE TABLE notizen (text TEXT);`, "de");
    expect(extra).toMatchObject({ status: "wrong", message: expect.stringContaining("notizen") });
  });

  it("accepts an equivalent schema and a different alias", () => {
    const create = findLessonById("db-3-datentypen")!.lesson;
    const task = create.exercises[1].make(createRng(3), 1, "en");
    if (task.kind !== "mutation") throw new Error("expected a mutation task");
    const relaxed = task.referenceSql.replace(/\bTEXT\b/g, "VARCHAR(80)").replace(/\bREAL\b/g, "DECIMAL(8,2)");
    expect(checkTask(SQL, create.tables, task, relaxed, "en").status).toBe("correct");
    const missing = task.referenceSql.replace(/,\n\s+\{?[a-z_]+\}? (TEXT|REAL|INTEGER)\n\)/, "\n)");
    expect(checkTask(SQL, create.tables, task, missing, "en").status).toBe("wrong");

    const calc = findLessonById("sql-5-berechnen")!.lesson;
    const calcTask = calc.exercises[0].make(createRng(2), 1, "de");
    if (calcTask.kind !== "query") throw new Error("expected a query task");
    expect(checkTask(SQL, calc.tables, calcTask, calcTask.referenceSql.replace(/ FROM/, " AS irgendwas FROM"), "de").status).toBe("correct");
  });
});

interface Witness {
  goal: string;
  steps: string[];
}

/** For every SQL sandbox goal: statements (templates) that reach it, in lesson order. */
const WITNESSES: Record<string, Witness[]> = {
  "db-1-datenbanksystem": [
    { goal: "g1", steps: ["SELECT * FROM {produkte};"] },
    { goal: "g2", steps: ["SELECT * FROM {bestellungen};"] },
    { goal: "g3", steps: ["SELECT * FROM {positionen};"] },
  ],
  "db-2-datensatz-datenfeld": [
    { goal: "g1", steps: ["SELECT {vorname}, {nachname} FROM {kunden};"] },
    { goal: "g2", steps: ["SELECT DISTINCT {ort} FROM {kunden};"] },
    { goal: "g3", steps: ["SELECT {ort}, {vorname}, {nachname} FROM {kunden};"] },
  ],
  "db-3-datentypen": [
    { goal: "g1", steps: ["CREATE TABLE {mitglieder} ({mitglied_id} INTEGER PRIMARY KEY, {vorname} VARCHAR(40) NOT NULL, {nachname} TEXT NOT NULL);"] },
    { goal: "g2", steps: ["ALTER TABLE {mitglieder} ADD COLUMN {geburtsdatum} TEXT;", "ALTER TABLE {mitglieder} ADD COLUMN {beitrag} DECIMAL(6,2);"] },
    { goal: "g3", steps: ["INSERT INTO {mitglieder} ({vorname}, {nachname}) VALUES ('Mia', 'Roth');"] },
  ],
  "db-4-primaerschluessel": [
    { goal: "g1", steps: ["INSERT INTO {kunden} ({kunden_id}, {vorname}, {nachname}) VALUES (3, 'Nora', 'Lang');"] },
    { goal: "g2", steps: ["INSERT INTO {kunden} ({vorname}, {nachname}, {ort}) VALUES ('Nora', 'Lang', 'Ulm');"] },
    { goal: "g3", steps: ["SELECT * FROM {kunden} WHERE {kunden_id} > 13;"] },
  ],
  "sql-1-where": [
    { goal: "g1", steps: ["SELECT * FROM {kunden} WHERE {ort} = 'Augsburg';"] },
    { goal: "g2", steps: ["SELECT {bezeichnung}, {preis} FROM {produkte} WHERE {preis} > 20;"] },
    { goal: "g3", steps: ["SELECT * FROM {bestellungen} WHERE {status} = '{offen}';"] },
  ],
  "sql-2-und-oder": [
    { goal: "g1", steps: ["SELECT {bezeichnung}, {preis} FROM {produkte} WHERE {kategorie} = '{Schule}' AND {preis} < 20;"] },
    { goal: "g2", steps: ["SELECT * FROM {kunden} WHERE {ort} = 'Ulm' OR {ort} = 'Augsburg';"] },
    { goal: "g3", steps: ["SELECT {bezeichnung}, {preis} FROM {produkte} WHERE {preis} >= 10 AND {preis} <= 30;"] },
  ],
  "sql-3-like": [
    { goal: "g1", steps: ["SELECT {nachname} FROM {kunden} WHERE {nachname} LIKE 'B%';"] },
    { goal: "g2", steps: ["SELECT {vorname}, {nachname}, {ort} FROM {kunden} WHERE {ort} LIKE '%burg';"] },
    { goal: "g3", steps: ["SELECT {vorname}, {nachname} FROM {kunden} WHERE {vorname} LIKE '____';"] },
  ],
  "sql-4-order-by": [
    { goal: "g1", steps: ["SELECT {bezeichnung}, {preis} FROM {produkte} ORDER BY {preis} DESC;"] },
    { goal: "g2", steps: ["SELECT {nachname}, {ort} FROM {kunden} ORDER BY {ort} ASC, {nachname} ASC;"] },
    { goal: "g3", steps: ["SELECT {bezeichnung}, {preis} FROM {produkte} ORDER BY {preis} DESC LIMIT 3;"] },
  ],
  "sql-5-berechnen": [
    { goal: "g1", steps: ["SELECT {bezeichnung}, {preis} * {lagerbestand} AS wert FROM {produkte};"] },
    { goal: "g2", steps: ["SELECT '{Hallo} ' || {vorname} || '!' AS {anrede} FROM {kunden};"] },
    { goal: "g3", steps: ["SELECT {bezeichnung}, ROUND({preis}) FROM {produkte};"] },
  ],
  "sql-6-aggregat": [
    { goal: "g1", steps: ["SELECT COUNT(*) AS n FROM {kunden};"] },
    { goal: "g2", steps: ["SELECT AVG({preis}) FROM {produkte};"] },
    { goal: "g3", steps: ["SELECT SUM({preis} * {lagerbestand}) FROM {produkte};"] },
  ],
  "er-1-redundanz": [
    { goal: "g1", steps: ["SELECT * FROM {bestellungen_flach} WHERE {nachname} = 'Berg';"] },
    { goal: "g2", steps: ["UPDATE {bestellungen_flach} SET {ort} = 'Augsburg' WHERE {bestell_id} = 103;"] },
    { goal: "g3", steps: ["SELECT DISTINCT {nachname}, {ort} FROM {bestellungen_flach} WHERE {nachname} = 'Berg';"] },
  ],
  "er-3-fremdschluessel": [
    { goal: "g1", steps: ["INSERT INTO {bestellungen} ({bestell_id}, {kunden_id}, {bestelldatum}) VALUES (115, 99, '2026-10-20');"] },
    { goal: "g2", steps: ["INSERT INTO {bestellungen} ({bestell_id}, {kunden_id}, {bestelldatum}) VALUES (115, 4, '2026-10-20');"] },
    { goal: "g3", steps: ["DELETE FROM {kunden} WHERE {kunden_id} = 1;"] },
  ],
  "join-1-zwei-tabellen": [
    { goal: "g1", steps: ["SELECT {bestellungen}.{bestell_id}, {bestellungen}.{bestelldatum}, {kunden}.{nachname} FROM {bestellungen} JOIN {kunden} ON {bestellungen}.{kunden_id} = {kunden}.{kunden_id};"] },
    { goal: "g2", steps: ["SELECT k.{vorname}, k.{nachname}, b.{bestelldatum} FROM {kunden} k JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} WHERE b.{status} = '{offen}';"] },
    { goal: "g3", steps: ["SELECT p.{bezeichnung}, pos.{menge} FROM {positionen} pos, {produkte} p WHERE pos.{produkt_id} = p.{produkt_id};"] },
  ],
  "join-2-drei-tabellen": [
    { goal: "g1", steps: ["SELECT b.{bestelldatum}, p.{bezeichnung}, pos.{menge} FROM {positionen} pos JOIN {bestellungen} b ON b.{bestell_id} = pos.{bestell_id} JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id};"] },
    { goal: "g2", steps: ["SELECT k.{nachname}, p.{bezeichnung} FROM {positionen} pos JOIN {bestellungen} b ON b.{bestell_id} = pos.{bestell_id} JOIN {kunden} k ON k.{kunden_id} = b.{kunden_id} JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id};"] },
    { goal: "g3", steps: ["SELECT DISTINCT p.{bezeichnung} FROM {positionen} pos JOIN {bestellungen} b ON b.{bestell_id} = pos.{bestell_id} JOIN {kunden} k ON k.{kunden_id} = b.{kunden_id} JOIN {produkte} p ON p.{produkt_id} = pos.{produkt_id} WHERE k.{nachname} = 'Berg';"] },
  ],
  "rep-1-group-by": [
    { goal: "g1", steps: ["SELECT {kategorie}, COUNT(*) AS n FROM {produkte} GROUP BY {kategorie};"] },
    { goal: "g2", steps: ["SELECT {status}, COUNT(*) FROM {bestellungen} GROUP BY {status};"] },
    { goal: "g3", steps: ["SELECT k.{nachname}, COUNT(*) FROM {bestellungen} b JOIN {kunden} k ON b.{kunden_id} = k.{kunden_id} GROUP BY k.{nachname} HAVING COUNT(*) >= 2;"] },
  ],
  "rep-2-left-join": [
    { goal: "g1", steps: ["SELECT k.{nachname}, b.{bestell_id} FROM {kunden} k LEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id};"] },
    { goal: "g2", steps: ["SELECT k.{vorname}, k.{nachname} FROM {kunden} k LEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} WHERE b.{bestell_id} IS NULL;"] },
    { goal: "g3", steps: ["SELECT k.{nachname}, COUNT(b.{bestell_id}) FROM {kunden} k LEFT JOIN {bestellungen} b ON b.{kunden_id} = k.{kunden_id} GROUP BY k.{kunden_id};"] },
  ],
  "dml-1-einfuegen-aendern": [
    { goal: "g1", steps: ["UPDATE {produkte} SET {preis} = 8.99 WHERE {produkt_id} = 5;"] },
    { goal: "g2", steps: ["INSERT INTO {produkte} ({bezeichnung}, {kategorie}, {preis}) VALUES ('X', 'Y', -1);"] },
    { goal: "g3", steps: ["DELETE FROM {positionen} WHERE {bestell_id} = 105;", "DELETE FROM {bestellungen} WHERE {bestell_id} = 105;"] },
  ],
};

describe("Sandbox-Aufträge", () => {
  const sqlLessons = ALL_LESSONS.filter((lesson): lesson is Lesson & { lab: SqlLabDefinition } => lesson.lab.kind === "sql");

  it("has a witness for every goal of every SQL sandbox", () => {
    expect(Object.keys(WITNESSES).sort()).toEqual(sqlLessons.map((lesson) => lesson.id).sort());
    for (const lesson of sqlLessons) {
      expect(WITNESSES[lesson.id].map((w) => w.goal)).toEqual(lesson.lab.goals.map((goal) => goal.id));
    }
  });

  for (const locale of LOCALES) {
    it(`reaches no goal at the start or by running the starter, and every goal after its witness (${locale})`, () => {
      for (const lesson of sqlLessons) {
        const db = createDatabase(SQL, setupSql(locale, lesson.lab.tables));
        const ctx: SqlLabContext = { locale, query: (sql) => runSql(db, sql), last: null };
        for (const goal of lesson.lab.goals) {
          expect(goal.check(ctx), `${lesson.id} ${goal.id} not reached at the start`).toBe(false);
        }
        // The starter shows the shape on a neighbouring example; running it unchanged earns nothing.
        const starter = q(locale, lesson.lab.starterSql);
        ctx.last = { sql: starter, outcome: runSql(db, starter) };
        expect(ctx.last.outcome.ok, `${lesson.id} starter runs`).toBe(true);
        for (const goal of lesson.lab.goals) {
          expect(goal.check(ctx), `${lesson.id} ${goal.id} not reached by the starter`).toBe(false);
        }
        for (const witness of WITNESSES[lesson.id]) {
          for (const step of witness.steps) {
            const sql = q(locale, step);
            ctx.last = { sql, outcome: runSql(db, sql) };
          }
          const goal = lesson.lab.goals.find((g) => g.id === witness.goal)!;
          expect(goal.check(ctx), `${lesson.id} ${witness.goal} reached by its witness (${locale})`).toBe(true);
        }
        db.close();
      }
    });
  }

  it("does not count a run that only looks like the goal", () => {
    for (const locale of LOCALES) {
      const goalsAfter = (lessonId: string, steps: string[]) => {
        const lesson = findLessonById(lessonId)!.lesson as Lesson & { lab: SqlLabDefinition };
        const db = createDatabase(SQL, setupSql(locale, lesson.lab.tables));
        const ctx: SqlLabContext = { locale, query: (sql) => runSql(db, sql), last: null };
        for (const step of steps) {
          const sql = q(locale, step);
          ctx.last = { sql, outcome: runSql(db, sql) };
        }
        const reached = lesson.lab.goals.filter((goal) => goal.check(ctx)).map((goal) => goal.id);
        db.close();
        return reached;
      };
      // The failing INSERT stops the run; the DELETE after it never ran.
      expect(goalsAfter("er-3-fremdschluessel", [
        "INSERT INTO {bestellungen} ({bestell_id}, {kunden_id}, {bestelldatum}) VALUES (115, 99, '2026-10-20');\nDELETE FROM {kunden} WHERE {kunden_id} = 1;",
      ])).toEqual(["g1"]);
      expect(goalsAfter("er-3-fremdschluessel", [
        "INSERT INTO {bestellungen} ({bestell_id}, {kunden_id}, {bestelldatum}) VALUES (115, 4, '2026-10-21');",
      ])).toEqual([]);
      // UPDATE without WHERE: every price is 8.99, which the lesson warns about.
      expect(goalsAfter("dml-1-einfuegen-aendern", ["UPDATE {produkte} SET {preis} = 8.99;"])).toEqual([]);
      // Another CHECK than the one on the price.
      expect(goalsAfter("dml-1-einfuegen-aendern", ["UPDATE {produkte} SET {lagerbestand} = -1 WHERE {produkt_id} = 1;"])).toEqual([]);
      expect(goalsAfter("dml-1-einfuegen-aendern", ["UPDATE {produkte} SET {preis} = -1 WHERE {produkt_id} = 1;"])).toEqual(["g2"]);
      // A dropped table is no deleted order.
      expect(goalsAfter("dml-1-einfuegen-aendern", ["PRAGMA foreign_keys = OFF;", "DROP TABLE {bestellungen};"])).toEqual([]);
    }
  });

  it("marks the ER workshop's goals only for the right cardinalities", () => {
    const lesson = findLessonById("er-2-kardinalitaet")!.lesson;
    const lab = lesson.lab as ErLabDefinition;
    expect(lab.kind).toBe("er");
    const right: Record<string, Cardinality> = Object.fromEntries(lab.pairs.map((pair) => [pair.id, pair.answer]));
    expect(lab.goals.every((goal) => goal.check({ choices: right }))).toBe(true);
    expect(lab.goals.some((goal) => goal.check({ choices: {} }))).toBe(false);
    const wrong = { ...right, "kunde-bestellung": "n:m" as Cardinality };
    expect(lab.goals.find((goal) => goal.id === "g1")!.check({ choices: wrong })).toBe(false);
    expect(new Set(lab.pairs.map((pair) => pair.answer)).size).toBe(3);
  });
});

describe("Fortschritt", () => {
  const blank = (): LearnerProgress => ({
    locale: "de",
    activeLessonId: LESSON_IDS[0],
    difficultyLevel: 1,
    moduleFilter: "alle",
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

  it("needs the quick check, every sandbox goal and the required Level-1 tasks; the transfer badge needs Level 2 too", () => {
    const progress = blank();
    const lesson = findLessonById("sql-1-where")!.lesson;
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
    expect(isLessonComplete(progress, lesson), "one goal missing").toBe(false);
    progress.labGoals[lesson.id] = lesson.lab.goals.map((goal) => goal.id);
    progress.solved[lesson.id] = { 1: lesson.requiredCorrect, 2: lesson.requiredCorrect };
    expect(isTransferDone(progress, lesson)).toBe(true);
  });

  it("counts only the lessons of the chosen module scope for stages, badges and the total", () => {
    const progress = blank();
    const berichte = STAGES[3];
    expect(relevantLessons(berichte, "2.3.1")).toHaveLength(0);
    expect(relevantLessons(berichte, "2.3.2").map((l) => l.id)).toEqual(["dml-1-einfuegen-aendern"]);
    expect(overallStats(progress, STAGES, "2.3.1").totalStages).toBe(2);
    expect(overallStats(progress, STAGES, "2.3.1").total).toBe(10);
    expect(overallStats(progress, STAGES, "alle").total).toBe(18);

    // A 2.3.2 learner finishes stage 4 with the data maintenance lesson alone.
    finish(progress, "dml-1-einfuegen-aendern");
    expect(isStageComplete(progress, berichte, "2.3.2")).toBe(true);
    expect(isStageComplete(progress, berichte, "alle")).toBe(false);
    expect(stageStats(progress, berichte, "alle")).toMatchObject({ completed: 1, total: 3 });
    expect(overallStats(progress, STAGES, "2.3.2").completedStages).toBe(1);
    expect(overallStats(progress, STAGES, "alle").completedStages).toBe(0);
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

  it("reads level and language next to the lesson and ignores values that are no lesson id", () => {
    expect(parseTrainingDeepLink("#lesson=join-1-zwei-tabellen&level=2", "?lang=en")).toEqual({
      lessonId: "join-1-zwei-tabellen",
      level: 2,
      locale: "en",
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
  interface CellItem {
    id: string;
    slug: string;
    language?: string;
    tier?: string;
    bloom_level: number;
    source_link?: string;
    question?: string;
    concept?: string;
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
    expect(cell.tile_id).toBe("zam-academy:sql");
    expect(/^\d+(\.\d+)*$/.test(cell.version)).toBe(true);
    expect(cell.atoms.map((atom) => lessonOf(atom.source_link))).toEqual(LESSON_IDS);
  });

  it("cites for every card the lesson of its atom, and binds the atom to its stage and IT module", () => {
    for (const atom of cell.atoms) {
      const lessonId = lessonOf(atom.source_link);
      const found = findLessonById(lessonId);
      expect(found, `${atom.id} cites ${atom.source_link}`).toBeDefined();
      const { stage, lesson } = found!;
      const academy = atom.curricula?.find((binding) => binding.provider === "zam-academy");
      expect(academy?.topic_code, `${atom.slug} is bound to its stage`).toBe(stage.id);
      const lehrplan = (atom.curricula ?? []).filter((binding) => binding.provider === "lehrplanplus-bayern");
      if (lesson.module === "extra") {
        expect(lehrplan, `${atom.slug} is beyond the curriculum`).toHaveLength(0);
      } else {
        expect(lehrplan.map((binding) => binding.track).sort(), `${atom.slug} binds both Wahlpflichtfächergruppen`).toEqual(["I", "II_III"]);
        for (const binding of lehrplan) {
          expect(binding.school_type).toBe("realschule");
          expect(binding.grade).toBe(9);
          expect(binding.subject).toBe("informatik");
          expect(binding.topic_code).toBe(`it-${lesson.module}`);
        }
      }
      expect(atom.practice_items.length, `${atom.slug} has cards`).toBeGreaterThanOrEqual(3);
      for (const item of atom.practice_items) {
        expect(lessonOf(item.source_link), `${item.id} cites its atom's lesson`).toBe(lessonId);
        expect(item.language, `${item.id} is German like the UML cell`).toBe("de");
      }
    }
  });

  it("has well-formed cards: ULID-shaped ids, unique slugs, valid fast checks, no markup", () => {
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
        expect(item.question?.length, `${item.slug} has a question`).toBeGreaterThan(20);
        expect(item.concept?.length, `${item.slug} has an answer`).toBeGreaterThan(1);
        for (const plain of [item.question, item.concept]) {
          expect(plain, `${item.slug}: no markup in plain text`).not.toMatch(/\$|\[a-z]|\*\*|<[a-z]/);
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

  describe("replaces the de-by Realschule 9 database cell", () => {
    interface MappingRow {
      de_by_cell: string;
      de_by_id: string;
      de_by_question: string;
      category: "A" | "B" | "C";
      academy_slug?: string;
      note?: string;
    }
    const table = replacesJson as unknown as { rows: MappingRow[] };
    const items = cell.atoms.flatMap((atom) => atom.practice_items);
    const bySlug = new Map(items.map((item) => [item.slug, item]));
    const DE_BY = /^01K4D9B0000000000000000J\d{2}$/;

    it("lists every de-by item exactly once", () => {
      expect(table.rows).toHaveLength(8);
      const ids = table.rows.map((row) => row.de_by_id);
      expect(new Set(ids).size).toBe(8);
      for (const id of ids) expect(DE_BY.test(id), id).toBe(true);
      for (const row of table.rows) {
        expect(row.de_by_cell).toBe("de-by:realschule-9-informatik-datenbanken-sql");
        if (row.category === "C") expect(row.note, `${row.de_by_id} needs a reason`).toBeTruthy();
      }
    });

    it("declares exactly the mapped replaces, one de-by item per card", () => {
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
