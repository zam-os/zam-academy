/** SI prefixes in the interval the M7 curriculum specifies, including the base unit. */
export const PREFIXES = [
  { exponent: -18, name: "Atto", symbol: "a" },
  { exponent: -15, name: "Femto", symbol: "f" },
  { exponent: -12, name: "Piko", symbol: "p" },
  { exponent: -9, name: "Nano", symbol: "n" },
  { exponent: -6, name: "Mikro", symbol: "µ" },
  { exponent: -3, name: "Milli", symbol: "m" },
  { exponent: -2, name: "Zenti", symbol: "c" },
  { exponent: -1, name: "Dezi", symbol: "d" },
  { exponent: 0, name: "ohne Vorsilbe", symbol: "" },
  { exponent: 1, name: "Deka", symbol: "da" },
  { exponent: 2, name: "Hekto", symbol: "h" },
  { exponent: 3, name: "Kilo", symbol: "k" },
  { exponent: 6, name: "Mega", symbol: "M" },
  { exponent: 9, name: "Giga", symbol: "G" },
  { exponent: 12, name: "Tera", symbol: "T" },
  { exponent: 15, name: "Peta", symbol: "P" },
  { exponent: 18, name: "Exa", symbol: "E" },
] as const;

export const superscript = (value: number): string =>
  String(value)
    .split("")
    .map((char) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(char)] ?? "⁻")
    .join("");

/** Very small values stay visible; the normal two-decimal formatter would show zero. */
export function decimal(value: number): string {
  return new Intl.NumberFormat("de-DE", { maximumFractionDigits: 20 })
    .format(Number(value.toPrecision(12)))
    .replace("-", "−");
}

export const powerText = (base: number | string, exponent: number): string =>
  `${base}${superscript(exponent)}`;
