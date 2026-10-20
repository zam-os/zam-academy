import type { SqlJsStatic } from "sql.js";
import { setupSql } from "../db/dataset";
import { compareResults, createDatabase, dumpTable, runSql, sameSchema, tableSchema } from "../db/engine";
import { UI_STRINGS } from "../i18n/translations";
import type { AppLocale, ExerciseTask, TableKey } from "../model/types";

export type CheckStatus = "correct" | "wrong" | "error" | "empty";

export interface CheckResult {
  status: CheckStatus;
  message: string;
}

/**
 * Checks a learner's answer. SQL answers run against a fresh copy of the
 * lesson's database and are judged by their effect, never by their wording:
 * a query by its result set, a change by the tables it leaves behind.
 */
export function checkTask(
  SQL: SqlJsStatic,
  tables: TableKey[],
  task: ExerciseTask,
  answer: string | number,
  locale: AppLocale,
): CheckResult {
  const t = UI_STRINGS[locale].check;
  if (task.kind === "choice") {
    return Number(answer) === task.correctIndex
      ? { status: "correct", message: t.correct }
      : { status: "wrong", message: t.wrongChoice };
  }
  const sql = String(answer).trim();
  if (!sql) return { status: "empty", message: t.empty };
  const setup = setupSql(locale, tables);

  if (task.kind === "query") {
    const learnerDb = createDatabase(SQL, setup);
    try {
      const outcome = runSql(learnerDb, sql);
      if (!outcome.ok) return { status: "error", message: t.sqlError(outcome.error) };
      if (outcome.results.length === 0) return { status: "wrong", message: t.noResult };
      if (outcome.results.length > 1) return { status: "wrong", message: t.oneQuery };
      const referenceDb = createDatabase(SQL, setup);
      try {
        const expected = runSql(referenceDb, task.referenceSql);
        if (!expected.ok || expected.results.length !== 1) {
          throw new Error(`reference query failed: ${expected.ok ? "no result" : expected.error}`);
        }
        const actual = outcome.results[0];
        const difference = compareResults(actual, expected.results[0], task.ordered);
        switch (difference) {
          case null:
            return { status: "correct", message: t.correct };
          case "columns":
            return { status: "wrong", message: t.columns(actual.columns.length, expected.results[0].columns.length) };
          case "row-count":
            return { status: "wrong", message: t.rowCount(actual.values.length, expected.results[0].values.length) };
          case "order":
            return { status: "wrong", message: t.order };
          default:
            return { status: "wrong", message: t.rows };
        }
      } finally {
        referenceDb.close();
      }
    } finally {
      learnerDb.close();
    }
  }

  const learnerDb = createDatabase(SQL, setup);
  const referenceDb = createDatabase(SQL, setup);
  try {
    const outcome = runSql(learnerDb, sql);
    if (!outcome.ok) return { status: "error", message: t.sqlError(outcome.error) };
    const expected = runSql(referenceDb, task.referenceSql);
    if (!expected.ok) throw new Error(`reference statement failed: ${expected.error}`);
    for (const table of task.verifySchemaOf ?? []) {
      const actualSchema = tableSchema(learnerDb, table);
      const expectedSchema = tableSchema(referenceDb, table);
      if (!expectedSchema) throw new Error(`reference did not create ${table}`);
      if (!actualSchema) return { status: "wrong", message: t.tableMissing(table) };
      if (!sameSchema(actualSchema, expectedSchema)) return { status: "wrong", message: t.schemaDiffers(table) };
    }
    for (const table of task.verifyTables) {
      const actualRows = dumpTable(learnerDb, table);
      const expectedRows = dumpTable(referenceDb, table);
      if (!expectedRows) throw new Error(`reference left no table ${table}`);
      if (!actualRows) return { status: "wrong", message: t.tableMissing(table) };
      if (compareResults(actualRows, expectedRows, false) !== null) {
        return { status: "wrong", message: t.tableDiffers(table, actualRows.values.length, expectedRows.values.length) };
      }
    }
    return { status: "correct", message: t.correct };
  } finally {
    learnerDb.close();
    referenceDb.close();
  }
}
