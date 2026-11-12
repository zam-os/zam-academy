/**
 * Number and term formatting the way a German maths lesson writes it:
 * decimal comma, thousands separated by a point, a real minus sign (−) and
 * terms without "+ −" or "1x".
 */
const formatters = new Map<number, Intl.NumberFormat>();

function formatter(maxDigits: number): Intl.NumberFormat {
  let cached = formatters.get(maxDigits);
  if (!cached) {
    cached = new Intl.NumberFormat("de-DE", {
      maximumFractionDigits: maxDigits,
      minimumFractionDigits: 0,
    });
    formatters.set(maxDigits, cached);
  }
  return cached;
}

export const MINUS = "−";

/** `fmt(1234.5)` → "1.234,5"; up to `digits` decimals, trailing zeros dropped, "−" for negatives. */
export function fmt(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "–";
  const rounded = Number(value.toFixed(digits));
  // Avoid "-0".
  return formatter(digits)
    .format(rounded === 0 ? 0 : rounded)
    .replace("-", MINUS);
}

/** `fmtUnit(2.5, "cm")` → "2,5 cm". */
export function fmtUnit(value: number, unit: string, digits = 2): string {
  const text = fmt(value, digits);
  return unit ? `${text} ${unit}` : text;
}

/** A number in brackets when negative, for products: "3 · (−2)". */
export function paren(value: number, digits = 2): string {
  const text = fmt(value, digits);
  return value < 0 && text !== "0" ? `(${text})` : text;
}

/** Rounds to `n` significant digits, for readable generated values. */
export function roundSig(value: number, n = 3): number {
  if (value === 0 || !Number.isFinite(value)) return value;
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const factor = 10 ** (n - 1 - magnitude);
  return Math.round(value * factor) / factor;
}

/** Rounds to `digits` decimals. */
export function round(value: number, digits = 2): number {
  return Number(value.toFixed(digits));
}

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

/** A reduced fraction as text: `fracText(6, 20)` → "3/10", `fracText(4, 2)` → "2". */
export function fracText(numerator: number, denominator: number): string {
  const g = gcd(numerator, denominator);
  const sign = numerator * denominator < 0 ? MINUS : "";
  const n = Math.abs(numerator) / g;
  const d = Math.abs(denominator) / g;
  return d === 1 ? `${sign}${n}` : `${sign}${n}/${d}`;
}

/** A stacked fraction in HTML: numerator over denominator. */
export function frac(
  numerator: string | number,
  denominator: string | number,
): string {
  return `<span class="frac"><span>${numerator}</span><span>${denominator}</span></span>`;
}

/** A reduced stacked fraction of two integers. */
export function fracHtml(numerator: number, denominator: number): string {
  const g = gcd(numerator, denominator);
  const sign = numerator * denominator < 0 ? MINUS : "";
  const n = Math.abs(numerator) / g;
  const d = Math.abs(denominator) / g;
  return d === 1 ? `${sign}${n}` : `${sign}${frac(n, d)}`;
}

/** A square root with its bar over the radicand, in HTML. */
export function sqrtHtml(radicand: string | number): string {
  return `√<span class="radicand">${radicand}</span>`;
}

/**
 * One term of a sum: `term(-2, "x", false)` → " − 2x", `term(1, "x²", true)`
 * → "x²", `term(0, "x", false)` → "". `variable` empty gives a constant.
 */
export function term(
  coefficient: number,
  variable: string,
  first: boolean,
  digits = 2,
): string {
  const rounded = round(coefficient, digits);
  if (rounded === 0) return "";
  const abs = Math.abs(rounded);
  const number = variable && abs === 1 ? "" : fmt(abs, digits);
  const body = `${number}${variable}`;
  if (first) return rounded < 0 ? `${MINUS}${body}` : body;
  return rounded < 0 ? ` ${MINUS} ${body}` : ` + ${body}`;
}

/** A sum of terms; "0" when every coefficient is zero. */
export function sum(parts: Array<[number, string]>, digits = 2): string {
  let out = "";
  for (const [coefficient, variable] of parts) {
    out += term(coefficient, variable, out === "", digits);
  }
  return out || "0";
}

/** `linear(0.5, -2)` → "0,5x − 2". */
export function linear(m: number, t: number, digits = 2): string {
  return sum(
    [
      [m, "x"],
      [t, ""],
    ],
    digits,
  );
}

/** `quadratic(2, -4, -6)` → "2x² − 4x − 6". */
export function quadratic(a: number, b: number, c: number, digits = 2): string {
  return sum(
    [
      [a, "x²"],
      [b, "x"],
      [c, ""],
    ],
    digits,
  );
}

/** `shifted(3)` → "(x − 3)", `shifted(-2)` → "(x + 2)", `shifted(0)` → "x". */
export function shifted(d: number, digits = 2): string {
  const rounded = round(d, digits);
  if (rounded === 0) return "x";
  return rounded > 0
    ? `(x ${MINUS} ${fmt(rounded, digits)})`
    : `(x + ${fmt(-rounded, digits)})`;
}

/** `vertexForm(2, 3, 1)` → "2(x − 3)² + 1". */
export function vertexForm(
  a: number,
  d: number,
  e: number,
  digits = 2,
): string {
  const factor =
    round(a, digits) === 1
      ? ""
      : round(a, digits) === -1
        ? MINUS
        : fmt(a, digits);
  const inner = shifted(d, digits);
  const square = inner === "x" ? "x²" : `${inner}²`;
  return `${factor}${square}${term(e, "", false, digits)}`;
}

/** `factorForm(1, 2, -5)` → "(x − 2)(x + 5)"; a double root gives a square. */
export function factorForm(
  a: number,
  x1: number,
  x2: number,
  digits = 2,
): string {
  const factor =
    round(a, digits) === 1
      ? ""
      : round(a, digits) === -1
        ? MINUS
        : fmt(a, digits);
  let f1 = shifted(x1, digits);
  let f2 = shifted(x2, digits);
  if (round(x1, digits) === round(x2, digits)) {
    return `${factor}${f1 === "x" ? "x²" : `${f1}²`}`;
  }
  // A bare x goes first: "x(x − 5)", never "(x − 5)x".
  if (f2 === "x") [f1, f2] = [f2, f1];
  return `${factor}${f1}${f2}`;
}

/** A point as the German school writes it: "(3 | −2)". */
export function point(x: number, y: number, digits = 2): string {
  return `(${fmt(x, digits)} | ${fmt(y, digits)})`;
}

/** Escapes text for insertion into HTML. */
export function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
