import { q } from "../db/dataset";
import { compareResults, firstKeyword, tableSchema, type AffinityGroup } from "../db/engine";
import type { SqlCell, SqlLabContext } from "../model/types";

/**
 * Checks a lab goal can make against the sandbox: what the learner's last
 * run returned, what the database now holds, which error they ran into.
 * Templates carry {tokens} and are resolved for the sandbox's language.
 */

/** The learner's last run returned exactly the rows the template returns now. */
export function lastResultEquals(ctx: SqlLabContext, template: string, ordered = false): boolean {
  const last = ctx.last;
  if (!last || !last.outcome.ok || last.outcome.results.length !== 1) return false;
  const expected = ctx.query(q(ctx.locale, template));
  if (!expected.ok || expected.results.length !== 1) return false;
  return compareResults(last.outcome.results[0], expected.results[0], ordered) === null;
}

/** The learner's last run failed with an error containing `text`. */
export function lastErrorIncludes(ctx: SqlLabContext, text: string): boolean {
  const last = ctx.last;
  return Boolean(last && !last.outcome.ok && last.outcome.error.toLowerCase().includes(text.toLowerCase()));
}

/**
 * The statement that made the learner's last run fail is one of these kinds
 * ("INSERT", "DELETE" …). Only the failing statement counts, not other text
 * left in the editor.
 */
export function lastFailedStatementIs(ctx: SqlLabContext, ...kinds: string[]): boolean {
  const last = ctx.last;
  return Boolean(last && !last.outcome.ok && kinds.includes(firstKeyword(last.outcome.failedSql)));
}

/** The first cell the template returns against the current state. */
export function scalarNow(ctx: SqlLabContext, template: string): SqlCell | undefined {
  const outcome = ctx.query(q(ctx.locale, template));
  if (!outcome.ok || outcome.results.length === 0) return undefined;
  return outcome.results[0].values[0]?.[0];
}

/**
 * The count the template returns against the current state. A lookup that
 * fails (a dropped or renamed table) is NaN, which fails every comparison,
 * so `DROP TABLE` never passes for "no row left".
 */
export function countNow(ctx: SqlLabContext, template: string): number {
  const value = scalarNow(ctx, template);
  if (value === undefined) return Number.NaN;
  return typeof value === "number" ? value : Number(value ?? 0);
}

export interface ExpectedColumn {
  /** Column name as a {token} or literal. */
  name: string;
  group: AffinityGroup;
  pk?: boolean;
}

/** The table exists and has (at least) these columns with these affinities. */
export function tableHasColumns(ctx: SqlLabContext, tableToken: string, expected: ExpectedColumn[]): boolean {
  const actual = tableSchema(ctx.query, q(ctx.locale, tableToken));
  if (!actual) return false;
  return expected.every((column) => {
    const name = q(ctx.locale, column.name).toLowerCase();
    const found = actual.find((a) => a.name === name);
    if (!found) return false;
    if (found.group !== column.group) return false;
    if (column.pk !== undefined && found.pk !== column.pk) return false;
    return true;
  });
}
