/**
 * Number formatting the way a German physics lesson writes it: decimal
 * comma and thousands separated by a point.
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
