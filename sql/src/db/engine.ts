import type { Database, SqlJsStatic, Statement } from "sql.js";
import type { ResultSet, SqlCell, SqlOutcome } from "../model/types";

/** A fresh in-memory database built by `setupSql`. */
export function createDatabase(SQL: SqlJsStatic, setupSql: string): Database {
  const db = new SQL.Database();
  db.run(setupSql);
  return db;
}

/**
 * More rows than any lesson needs: a missing JOIN condition or a runaway
 * recursive query. The run stops instead of freezing the page.
 */
export const MAX_RESULT_ROWS = 10_000;

/**
 * Runs one or more statements. Every statement that yields columns adds a
 * result set (also when it has no rows); `changes` counts the rows that
 * INSERT, UPDATE and DELETE touched. A failing statement stops the run; what
 * ran before it stays applied, and `failedSql` names the statement that failed.
 */
export function runSql(db: Database, sql: string, maxRows = MAX_RESULT_ROWS): SqlOutcome {
  const results: ResultSet[] = [];
  let statements = 0;
  let active: Statement | null = null;
  let remaining = sql;
  let current: string | null = null;
  try {
    const changesBefore = totalChanges(db);
    const iterator = db.iterateStatements(sql);
    while (true) {
      const next = iterator.next();
      if (next.done) break;
      const stmt = next.value;
      active = stmt;
      statements += 1;
      const after = iterator.getRemainingSQL();
      current = remaining.slice(0, remaining.length - after.length);
      remaining = after;
      const columns = stmt.getColumnNames();
      const values: SqlCell[][] = [];
      while (stmt.step()) {
        if (values.length >= maxRows) {
          throw new Error(`result too large: more than ${maxRows} rows (a missing join condition?)`);
        }
        values.push(stmt.get() as SqlCell[]);
      }
      if (columns.length > 0) results.push({ columns, values });
      active = null;
      current = null;
    }
    return { ok: true, results, changes: totalChanges(db) - changesBefore, statements };
  } catch (error) {
    try {
      active?.free();
    } catch {
      // already freed
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
      // A statement that fails to compile is the start of what was left.
      failedSql: (current ?? remaining).trim(),
    };
  }
}

/** Rows changed by INSERT, UPDATE and DELETE since the database was opened. */
function totalChanges(db: Database): number {
  return Number(db.exec("SELECT total_changes();")[0]?.values[0]?.[0] ?? 0);
}

/** The first keyword of a statement, upper case, after leading comments: "INSERT", "WITH" … */
export function firstKeyword(sql: string): string {
  const code = sql.replace(/^(?:\s+|--[^\n]*(?:\n|$)|\/\*[\s\S]*?\*\/)+/, "");
  return (/^[A-Za-z]+/.exec(code)?.[0] ?? "").toUpperCase();
}

/** A cell as text so rows can be compared: numbers to two decimals, NULL marked. */
export function normalizeCell(cell: SqlCell): string {
  if (cell === null || cell === undefined) return "∅";
  if (typeof cell === "number") {
    return Number.isInteger(cell) ? String(cell) : (Math.round(cell * 100) / 100).toFixed(2);
  }
  if (typeof cell === "string") {
    // A number stored as text compares as that number ('49.90' = 49.9), but a
    // code with a leading zero stays text: '01069' is a postcode, not 1069.
    const text = cell.trim();
    if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(text)) return normalizeCell(Number(text));
    return cell;
  }
  return "<blob>";
}

export type ResultDifference = "columns" | "row-count" | "rows" | "order" | null;

/**
 * Compares two result sets. A column that carries an expected name is matched
 * by that name (so `SELECT b, a` passes for `SELECT a, b`); the others are
 * matched in order of position (so an alias such as `COUNT(*) AS n` still
 * lines up). Row order counts only when asked.
 */
export function compareResults(actual: ResultSet, expected: ResultSet, ordered: boolean): ResultDifference {
  if (actual.columns.length !== expected.columns.length) return "columns";
  const positions = matchColumns(actual.columns, expected.columns);
  const actualRows = actual.values.map((row) => positions.map((p) => normalizeCell(row[p])).join("\u0001"));
  const expectedRows = expected.values.map((row) => row.map(normalizeCell).join("\u0001"));
  if (actualRows.length !== expectedRows.length) return "row-count";
  if (ordered && actualRows.every((row, index) => row === expectedRows[index])) return null;
  const sortedActual = [...actualRows].sort();
  const sortedExpected = [...expectedRows].sort();
  if (sortedActual.every((row, index) => row === sortedExpected[index])) {
    return ordered ? "order" : null;
  }
  return "rows";
}

/** For every expected column, the actual column it is compared with; each actual column is used once. */
function matchColumns(actual: string[], expected: string[]): number[] {
  const lowerActual = actual.map((name) => name.toLowerCase());
  const taken = actual.map(() => false);
  const byName = expected.map((name) => {
    const index = lowerActual.findIndex((candidate, i) => !taken[i] && candidate === name.toLowerCase());
    if (index >= 0) taken[index] = true;
    return index;
  });
  return byName.map((index) => {
    if (index >= 0) return index;
    const free = taken.indexOf(false);
    taken[free] = true;
    return free;
  });
}

/** Every row of a table, for comparing database states after changes. */
export function dumpTable(db: Database, table: string): ResultSet | null {
  const outcome = runSql(db, `SELECT * FROM "${table.replace(/"/g, '""')}";`);
  if (!outcome.ok || outcome.results.length !== 1) return null;
  return outcome.results[0];
}

export type AffinityGroup = "INTEGER" | "TEXT" | "DECIMAL" | "BLOB";

/**
 * SQLite's type affinity, with REAL and NUMERIC folded into one group so
 * that `DECIMAL(6,2)`, `NUMERIC` and `REAL` all count as "number with
 * decimals" (what a price needs).
 */
export function affinityGroup(declaredType: string): AffinityGroup {
  const type = declaredType.toUpperCase();
  if (type.includes("INT")) return "INTEGER";
  if (type.includes("CHAR") || type.includes("CLOB") || type.includes("TEXT")) return "TEXT";
  if (type.includes("BLOB") || type === "") return "BLOB";
  return "DECIMAL";
}

export interface SchemaColumn {
  name: string;
  /** The declared type, e.g. "VARCHAR(40)". */
  type: string;
  group: AffinityGroup;
  pk: boolean;
  notNull: boolean;
}

/** Runs read-only SQL: a database, or a sandbox's query function. */
export type SqlSource = Database | ((sql: string) => SqlOutcome);

function querier(source: SqlSource): (sql: string) => SqlOutcome {
  return typeof source === "function" ? source : (sql) => runSql(source, sql);
}

/** Column names, affinity groups and key flags of a table, sorted by name; null when it does not exist. */
export function tableSchema(source: SqlSource, table: string): SchemaColumn[] | null {
  const outcome = querier(source)(`PRAGMA table_info("${table.replace(/"/g, '""')}");`);
  if (!outcome.ok || outcome.results.length !== 1 || outcome.results[0].values.length === 0) return null;
  const { columns, values } = outcome.results[0];
  const index = (name: string) => columns.indexOf(name);
  return values
    .map((row) => ({
      name: String(row[index("name")]).toLowerCase(),
      type: String(row[index("type")] ?? ""),
      group: affinityGroup(String(row[index("type")] ?? "")),
      pk: Number(row[index("pk")]) > 0,
      notNull: Number(row[index("notnull")]) > 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** The user tables of a database, by name as created. */
export function tableNames(source: SqlSource): string[] {
  const outcome = querier(source)("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name;");
  if (!outcome.ok || outcome.results.length !== 1) return [];
  return outcome.results[0].values.map((row) => String(row[0]));
}

/** True when both tables have the same columns with the same affinity group and primary key flag. */
export function sameSchema(actual: SchemaColumn[], expected: SchemaColumn[]): boolean {
  if (actual.length !== expected.length) return false;
  return actual.every(
    (column, i) => column.name === expected[i].name && column.group === expected[i].group && column.pk === expected[i].pk,
  );
}
