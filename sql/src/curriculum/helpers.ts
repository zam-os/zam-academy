import { q } from "../db/dataset";
import { code, sqlBlock } from "../exercises/format";
import type { Rng } from "../exercises/rng";
import type {
  AppLocale,
  ChoiceTask,
  DifficultyLevel,
  Localized,
  MutationTask,
  QueryTask,
  SqlLabContext,
  SqlLabDefinition,
  SqlLabGoal,
  TableKey,
} from "../model/types";

/** The same text in both languages. */
export const L = <T>(de: T, en: T): Localized<T> => ({ de, en });

export const tr = <T>(text: Localized<T>, locale: AppLocale): T => text[locale];

/** Resolves `{tokens}` in a prompt as inline code in the locale's names. */
export function p(locale: AppLocale, template: string): string {
  return template.replace(/\{([^{}]+)\}/g, (_match, token: string) => code(q(locale, `{${token}}`)));
}

export interface QuerySpec {
  /** Level 1 prompt (names tables and columns), a template with {tokens}. */
  prompt: Localized;
  /** Level 2 prompt in words; the Level 1 prompt is used when missing. */
  prompt2?: Localized;
  /** Statement shape shown in Level 1. */
  hint?: Localized;
  /** Reference SQL as a template. */
  sql: string;
  ordered?: boolean;
  /** A sentence under the solution. */
  note?: Localized;
  meta?: Record<string, string | number>;
}

export function queryTask(locale: AppLocale, level: DifficultyLevel, spec: QuerySpec): QueryTask {
  const prompt = level === 2 && spec.prompt2 ? spec.prompt2 : spec.prompt;
  const sql = q(locale, spec.sql);
  return {
    kind: "query",
    prompt: p(locale, tr(prompt, locale)),
    ...(level === 1 && spec.hint ? { hint: tr(spec.hint, locale) } : {}),
    referenceSql: sql,
    ordered: spec.ordered ?? false,
    solutionHtml: sqlBlock(sql) + (spec.note ? `<p>${p(locale, tr(spec.note, locale))}</p>` : ""),
    ...(spec.meta ? { meta: spec.meta } : {}),
  };
}

export interface MutationSpec extends Omit<QuerySpec, "ordered"> {
  /** Tables (tokens) whose contents must match the reference afterwards. */
  verifyTables: string[];
  /** Tables (tokens) whose schema must match the reference afterwards. */
  verifySchemaOf?: string[];
}

export function mutationTask(locale: AppLocale, level: DifficultyLevel, spec: MutationSpec): MutationTask {
  const prompt = level === 2 && spec.prompt2 ? spec.prompt2 : spec.prompt;
  const sql = q(locale, spec.sql);
  return {
    kind: "mutation",
    prompt: p(locale, tr(prompt, locale)),
    ...(level === 1 && spec.hint ? { hint: tr(spec.hint, locale) } : {}),
    referenceSql: sql,
    verifyTables: spec.verifyTables.map((table) => q(locale, table)),
    ...(spec.verifySchemaOf ? { verifySchemaOf: spec.verifySchemaOf.map((table) => q(locale, table)) } : {}),
    solutionHtml: sqlBlock(sql) + (spec.note ? `<p>${p(locale, tr(spec.note, locale))}</p>` : ""),
    ...(spec.meta ? { meta: spec.meta } : {}),
  };
}

export interface ChoiceSpec {
  prompt: Localized;
  /** Options in both languages, same order; `correctIndex` points into them. */
  options: Localized<string[]>;
  correctIndex: number;
  explanation: Localized;
  meta?: Record<string, string | number>;
}

/** A pick-one task; the options are shuffled with `rng` so the right one moves around. */
export function choiceTask(locale: AppLocale, rng: Rng, spec: ChoiceSpec): ChoiceTask {
  const order = rng.shuffle(spec.options.de.map((_, index) => index));
  const options = order.map((index) => p(locale, tr(spec.options, locale)[index]));
  return {
    kind: "choice",
    prompt: p(locale, tr(spec.prompt, locale)),
    options,
    correctIndex: order.indexOf(spec.correctIndex),
    solutionHtml: `<p><strong>${options[order.indexOf(spec.correctIndex)]}</strong></p><p>${p(locale, tr(spec.explanation, locale))}</p>`,
    ...(spec.meta ? { meta: spec.meta } : {}),
  };
}

export function goal(id: string, check: (ctx: SqlLabContext) => boolean): SqlLabGoal {
  return { id, check };
}

export function sqlLab(tables: TableKey[], starterSql: string, goals: SqlLabGoal[]): SqlLabDefinition {
  return { kind: "sql", tables, starterSql, goals };
}

/** The shop tables every lesson works with. */
export { SHOP_TABLES as SHOP } from "../db/dataset";
