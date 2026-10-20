import type { Database, SqlJsStatic, Statement } from "sql.js";
import type { ResultSet, SqlCell, SqlOutcome } from "../model/types";

/** A fresh in-memory database built by `setupSql`. */
export function createDatabase(SQL: SqlJsStatic, setupSql: string): Database {
  const db = new SQL.Database();
  db.run(setupSql);
  return db;
}

/**
 * Runs one or more statements. Every statement that yields columns adds a
 * result set (also when it has no rows); the others count their changes.
 * A failing statement stops the run; what ran before it stays applied.
 */
export function runSql(db: Database, sql: string): SqlOutcome {
  const results: ResultSet[] = [];
  let changes = 0;
  let statements = 0;
  let active: Statement | null = null;
  try {
    const iterator = db.iterateStatements(sql);
    let remaining = sql;
    while (true) {
      const next = iterator.next();
      if (next.done) break;
      const stmt = next.value;
      active = stmt;
      statements += 1;
      // The text of this statement, so only INSERT/UPDATE/DELETE count their
      // rows (sqlite3_changes keeps the last such count across other statements).
      const after = iterator.getRemainingSQL();
      const text = remaining.slice(0, remaining.length - after.length);
      remaining = after;
      const columns = stmt.getColumnNames();
      const values: SqlCell[][] = [];
      while (stmt.step()) values.push(stmt.get() as SqlCell[]);
      if (columns.length > 0) results.push({ columns, values });
      else if (/^\s*(INSERT|UPDATE|DELETE|REPLACE)\b/i.test(text)) changes += db.getRowsModified();
      active = null;
    }
    return { ok: true, results, changes, statements };
  } catch (error) {
    try {
      active?.free();
    } catch {
      // already freed
    }
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}

/** A cell as text so rows can be compared: numbers to two decimals, NULL marked. */
export function normalizeCell(cell: SqlCell): string {
  if (cell === null || cell === undefined) return "∅";
  if (typeof cell === "number") {
    return Number.isInteger(cell) ? String(cell) : (Math.round(cell * 100) / 100).toFixed(2);
  }
  if (typeof cell === "string") {
    const asNumber = Number(cell);
    if (cell.trim() !== "" && Number.isFinite(asNumber) && /^-?\d+(\.\d+)?$/.test(cell.trim())) {
      return normalizeCell(asNumber);
    }
    return cell;
  }
  return "<blob>";
}

export type ResultDifference = "columns" | "row-count" | "rows" | "order" | null;

/**
 * Compares two result sets. Columns are matched by name when the actual
 * result carries every expected column name (so `SELECT b, a` passes for
 * `SELECT a, b`), otherwise by position. Row order counts only when asked.
 */
export function compareResults(actual: ResultSet, expected: ResultSet, ordered: boolean): ResultDifference {
  if (actual.columns.length !== expected.columns.length) return "columns";
  const lowerActual = actual.columns.map((c) => c.toLowerCase());
  const lowerExpected = expected.columns.map((c) => c.toLowerCase());
  const byName = lowerExpected.every((name) => lowerActual.includes(name));
  const positions = byName
    ? lowerExpected.map((name) => lowerActual.indexOf(name))
    : expected.columns.map((_, index) => index);
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
  group: AffinityGroup;
  pk: boolean;
  notNull: boolean;
}

/** Column names, affinity groups and key flags of a table, sorted by name; null when it does not exist. */
export function tableSchema(db: Database, table: string): SchemaColumn[] | null {
  const outcome = runSql(db, `PRAGMA table_info("${table.replace(/"/g, '""')}");`);
  if (!outcome.ok || outcome.results.length !== 1 || outcome.results[0].values.length === 0) return null;
  const { columns, values } = outcome.results[0];
  const index = (name: string) => columns.indexOf(name);
  return values
    .map((row) => ({
      name: String(row[index("name")]).toLowerCase(),
      group: affinityGroup(String(row[index("type")] ?? "")),
      pk: Number(row[index("pk")]) > 0,
      notNull: Number(row[index("notnull")]) > 0,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** True when both tables have the same columns with the same affinity group and primary key flag. */
export function sameSchema(actual: SchemaColumn[], expected: SchemaColumn[]): boolean {
  if (actual.length !== expected.length) return false;
  return actual.every(
    (column, i) => column.name === expected[i].name && column.group === expected[i].group && column.pk === expected[i].pk,
  );
}

/** The first cell of the first row, or undefined. */
export function scalar(db: Database, sql: string): SqlCell | undefined {
  const outcome = runSql(db, sql);
  if (!outcome.ok || outcome.results.length === 0) return undefined;
  return outcome.results[0].values[0]?.[0];
}
