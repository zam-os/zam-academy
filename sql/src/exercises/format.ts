import type { AppLocale } from "../model/types";

/** Escapes text for insertion into HTML. */
export function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** A price the way the shop's country writes it: "49,90 €" or "€49.90". */
export function money(locale: AppLocale, value: number): string {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}

/** A number with the locale's decimal separator and at most `digits` decimals. */
export function num(locale: AppLocale, value: number, digits = 2): string {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", {
    maximumFractionDigits: digits,
  }).format(value);
}

/** An SQL string literal: single quotes, inner quotes doubled. */
export function lit(value: string | number | null): string {
  if (value === null) return "NULL";
  if (typeof value === "number") return Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `'${value.replace(/'/g, "''")}'`;
}

/** Inline code for prompts and explanations. */
export function code(text: string): string {
  return `<code>${esc(text)}</code>`;
}

/** A SQL block for explanations and solutions. */
export function sqlBlock(sql: string): string {
  return `<pre class="sql"><code>${esc(sql)}</code></pre>`;
}
