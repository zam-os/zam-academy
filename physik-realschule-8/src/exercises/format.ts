/**
 * Number formatting the way a German physics lesson writes it: decimal
 * comma, a thin space before the unit, thousands separated by a point.
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

/** `fmt(1234.5)` → "1.234,5"; up to `digits` decimals, trailing zeros dropped. */
export function fmt(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "–";
  const rounded = Number(value.toFixed(digits));
  // Avoid "-0".
  return formatter(digits).format(rounded === 0 ? 0 : rounded);
}

/** `fmtUnit(2.5, "A")` → "2,5 A" (narrow no-break space). */
export function fmtUnit(value: number, unit: string, digits = 2): string {
  const text = fmt(value, digits);
  return unit ? `${text} ${unit}` : text;
}

/** Rounds to `n` significant digits, for readable generated values. */
export function roundSig(value: number, n = 3): number {
  if (value === 0 || !Number.isFinite(value)) return value;
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  const factor = 10 ** (n - 1 - magnitude);
  return Math.round(value * factor) / factor;
}

/** Decimals needed so that a value rounded to `n` significant digits shows. */
export function sigDigits(value: number, n = 3): number {
  if (value === 0 || !Number.isFinite(value)) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(value)));
  return Math.max(0, n - 1 - magnitude);
}

/** Escapes text for insertion into HTML. */
export function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
