/**
 * Pure models of Mathematik 9: the lessons, their labs and the tests share
 * them, so a drawing, a readout and a generated solution never disagree.
 */
import { round } from "./exercises/format";

// ─── Lernbereich 1: Prozent- und Zinsrechnung ─────────────────────────────

/** Days of a year and of a month in the German commercial convention (30/360). */
export const BANK_YEAR = 360;
export const BANK_MONTH = 30;

/** Annual interest Z = K · p/100. */
export function yearInterest(capital: number, rate: number): number {
  return (capital * rate) / 100;
}

/** Interest for `days` days: Z = K · p/100 · t/360. */
export function interest(capital: number, rate: number, days: number): number {
  return (capital * rate * days) / (100 * BANK_YEAR);
}

/** The capital that yields `z` in `days` days at `rate` percent. */
export function capitalFor(z: number, rate: number, days: number): number {
  return (z * 100 * BANK_YEAR) / (rate * days);
}

/** The rate that turns `capital` into `z` interest in `days` days. */
export function rateFor(z: number, capital: number, days: number): number {
  return (z * 100 * BANK_YEAR) / (capital * days);
}

/** The days in which `capital` at `rate` percent yields `z`. */
export function daysFor(z: number, capital: number, rate: number): number {
  return (z * 100 * BANK_YEAR) / (capital * rate);
}

/** Effective annual rate of costs `cost` for `capital` over `days` days, in percent. */
export function effectiveRate(capital: number, cost: number, days: number): number {
  return rateFor(cost, capital, days);
}

/** Interest factor q = 1 + p/100. */
export const factorOf = (rate: number): number => 1 + rate / 100;

/** Compound capital K₀ · qⁿ, unrounded. */
export function compound(start: number, rate: number, years: number): number {
  return start * factorOf(rate) ** years;
}

export interface InterestYear {
  year: number;
  start: number;
  interest: number;
  end: number;
}

/**
 * The bank's year-by-year table: each year's interest is rounded to cents
 * and added to the capital, so next year's interest is computed on it.
 */
export function compoundTable(
  start: number,
  rate: number,
  years: number,
): InterestYear[] {
  const rows: InterestYear[] = [];
  let capital = round(start, 2);
  for (let year = 1; year <= years; year++) {
    const z = round(yearInterest(capital, rate), 2);
    const end = round(capital + z, 2);
    rows.push({ year, start: capital, interest: z, end });
    capital = end;
  }
  return rows;
}

/** The first whole year in which K₀ · qⁿ reaches `target`. */
export function yearsUntil(start: number, rate: number, target: number): number {
  let years = 0;
  while (compound(start, rate, years) < target - 1e-9 && years < 1000) years++;
  return years;
}

/** "1. März" style day count between two dates of one year in the 30/360 convention. */
export function days360(
  fromDay: number,
  fromMonth: number,
  toDay: number,
  toMonth: number,
): number {
  const d1 = Math.min(fromDay, 30);
  const d2 = Math.min(toDay, 30);
  return (toMonth - fromMonth) * BANK_MONTH + (d2 - d1);
}

export const MONTHS = [
  "Januar",
  "Februar",
  "März",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Dezember",
];

// ─── Lernbereich 2: Potenzen ───────────────────────────────────────────────

/** a · 10ⁿ with 1 ≤ |a| < 10 (a rounded to `digits` decimals); 0 gives 0 · 10⁰. */
export function sci(value: number, digits = 6): { a: number; n: number } {
  if (value === 0 || !Number.isFinite(value)) return { a: 0, n: 0 };
  let n = Math.floor(Math.log10(Math.abs(value)));
  let a = round(value / 10 ** n, digits);
  if (Math.abs(a) >= 10) {
    a = round(a / 10, digits);
    n += 1;
  }
  return { a, n };
}

/** a · 10ⁿ, evaluated without binary noise for small exponents. */
export function fromSci(a: number, n: number): number {
  return Number(`${a}e${n}`);
}

/** The decimal prefixes of the curriculum, from Nano to Peta. */
export const PREFIXES = [
  { name: "Nano", symbol: "n", exp: -9 },
  { name: "Mikro", symbol: "µ", exp: -6 },
  { name: "Milli", symbol: "m", exp: -3 },
  { name: "Zenti", symbol: "c", exp: -2 },
  { name: "Dezi", symbol: "d", exp: -1 },
  { name: "(ohne)", symbol: "", exp: 0 },
  { name: "Hekto", symbol: "h", exp: 2 },
  { name: "Kilo", symbol: "k", exp: 3 },
  { name: "Mega", symbol: "M", exp: 6 },
  { name: "Giga", symbol: "G", exp: 9 },
  { name: "Tera", symbol: "T", exp: 12 },
  { name: "Peta", symbol: "P", exp: 15 },
];

/** Converts `value` from prefix exponent `from` to prefix exponent `to`. */
export function convertPrefix(value: number, from: number, to: number): number {
  return fromSci(value, from - to);
}

/**
 * a · 10ⁿ written out in German decimal notation from its digits, so no
 * binary noise appears: decimalString(4.5, 6) → "4.500.000",
 * decimalString(7.2, -4) → "0,00072".
 */
export function decimalString(a: number, n: number): string {
  const negative = a < 0;
  const [whole, fraction = ""] = String(Math.abs(a)).split(".");
  let digits = whole + fraction;
  let point = whole.length + n; // digits before the decimal comma
  if (point <= 0) {
    digits = "0".repeat(1 - point) + digits;
    point = 1;
  }
  if (digits.length < point) digits += "0".repeat(point - digits.length);
  let intPart = digits.slice(0, point).replace(/^0+(?=\d)/, "");
  const fracPart = digits.slice(point).replace(/0+$/, "");
  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "−" : ""}${intPart}${fracPart ? `,${fracPart}` : ""}`;
}

// ─── Lernbereich 3 und 4: Figuren, Körper, Flächen ────────────────────────

/** Angles (in degrees) and perimeter of a regular n-gon with side s. */
export function regularPolygon(n: number, s: number) {
  const centre = 360 / n;
  const base = (180 - centre) / 2;
  return {
    centre,
    base,
    interior: 2 * base,
    perimeter: n * s,
    /** Height of a determining triangle (centre to the side). */
    apothem: s / (2 * Math.tan(Math.PI / n)),
    /** Distance from the centre to a corner. */
    radius: s / (2 * Math.sin(Math.PI / n)),
  };
}

/** Area of a regular n-gon with side s and inradius ρ: n triangles of s · ρ : 2. */
export function regularPolygonArea(n: number, s: number, apothem: number): number {
  return (n * s * apothem) / 2;
}

export const SOLIDS = [
  "quadratische Pyramide",
  "rechteckige Pyramide",
  "dreieckige Pyramide",
  "sechseckige Pyramide",
  "Kegel",
] as const;
export type SolidKind = (typeof SOLIDS)[number];

/** Base corners (x right, y into the picture), counts and a note for a pyramid or cone. */
export function pyramidSolid(kind: SolidKind, a: number, h: number) {
  let base: Array<{ x: number; y: number }> = [];
  let centre = { x: a / 2, y: a / 2 };
  if (kind === "quadratische Pyramide")
    base = [{ x: 0, y: 0 }, { x: a, y: 0 }, { x: a, y: a }, { x: 0, y: a }];
  else if (kind === "rechteckige Pyramide") {
    base = [{ x: 0, y: 0 }, { x: a, y: 0 }, { x: a, y: 0.6 * a }, { x: 0, y: 0.6 * a }];
    centre = { x: a / 2, y: 0.3 * a };
  } else if (kind === "dreieckige Pyramide") {
    base = [{ x: 0, y: 0 }, { x: a, y: 0 }, { x: a / 2, y: (a * Math.sqrt(3)) / 2 }];
    centre = { x: a / 2, y: (a * Math.sqrt(3)) / 6 };
  } else if (kind === "sechseckige Pyramide") {
    base = Array.from({ length: 6 }, (_, i) => {
      const t = ((240 + i * 60) * Math.PI) / 180;
      return { x: a / 2 + (a / 2) * Math.cos(t), y: a / 2 + (a / 2) * Math.sin(t) };
    });
  }
  const n = base.length;
  return kind === "Kegel"
    ? { name: kind, base, centre, h, vertices: 0, edges: 1, faces: 2, note: "1 Spitze, keine Ecke" }
    : { name: kind, base, centre, h, vertices: n + 1, edges: 2 * n, faces: n + 1, note: `${n} Seitenflächen + Grundfläche` };
}

/** Pythagoras in the pyramid: Seitenhöhe and Seitenkante of a square pyramid. */
export function squarePyramid(a: number, h: number) {
  const hs = Math.hypot(h, a / 2);
  return { hs, s: Math.hypot(hs, a / 2) };
}

/** The composite figures of lesson 4.2. */
export const COMPOSITES = ["L-Form", "Giebelwand mit Fenster", "Rahmen"] as const;

/**
 * Corner cut-out, window or frame width kept inside the figure, so every
 * setting of the sliders is a real figure: x along w, y along h.
 */
export function compositeDims(shape: number, w: number, h: number, x: number, y: number) {
  if (shape === 0) return { x: Math.min(x, w - 1), y: Math.min(y, h - 1) };
  if (shape === 1) return { x: Math.min(x, w - 1), y };
  const t = Math.min(x, (Math.min(w, h) - 1) / 2);
  return { x: t, y: t };
}

/**
 * Area of a composite figure, both ways: `parts` when cut into pieces,
 * `whole − missing` when completed to a larger figure. For the gable wall,
 * y is the height of the triangle on top; the window is x wide and h/2 high.
 */
export function compositeArea(shape: number, w: number, h: number, x0: number, y0: number) {
  const { x, y } = compositeDims(shape, w, h, x0, y0);
  if (shape === 0) {
    const parts = [w * (h - y), (w - x) * y];
    return { parts, whole: w * h, missing: x * y, area: w * h - x * y };
  }
  if (shape === 1) {
    const triangle = (w * y) / 2;
    const window = x * (h / 2);
    return { parts: [w * h, triangle], whole: w * h + triangle, missing: window, area: w * h + triangle - window };
  }
  const inner = (w - 2 * x) * (h - 2 * x);
  return { parts: [2 * w * x, 2 * (h - 2 * x) * x], whole: w * h, missing: inner, area: w * h - inner };
}

// ─── Lernbereich 5: Rauminhalt ────────────────────────────────────────────

export const COMPOSITE_SOLIDS = ["Haus mit Satteldach", "Turm mit Pyramidendach", "Silo mit Kegeldach"] as const;

/**
 * Volume of a composite solid in m³: Haus = Quader a × b × h1 with a
 * triangular prism roof (height h2, length b); Turm = square cuboid a × a × h1
 * with a pyramid of height h2; Silo = cylinder of diameter a and height h1
 * with a cone of height h2.
 */
export function compositeSolid(shape: number, a: number, b: number, h1: number, h2: number) {
  if (shape === 0)
    return {
      lower: a * b * h1,
      upper: (a * h2 * b) / 2,
      total: a * b * h1 + (a * h2 * b) / 2,
      lowerName: "Quader",
      lowerFormula: `a · b · h₁`,
      upperName: "Dach: Dreiecksprisma",
      upperFormula: `a · h₂ : 2 · b`,
    };
  if (shape === 1)
    return {
      lower: a * a * h1,
      upper: (a * a * h2) / 3,
      total: a * a * h1 + (a * a * h2) / 3,
      lowerName: "Quader mit quadratischer Grundfläche",
      lowerFormula: `a² · h₁`,
      upperName: "Dach: Pyramide",
      upperFormula: `⅓ · a² · h₂`,
    };
  const G = Math.PI * (a / 2) ** 2;
  return {
    lower: G * h1,
    upper: (G * h2) / 3,
    total: G * h1 + (G * h2) / 3,
    lowerName: "Zylinder",
    lowerFormula: `π · r² · h₁`,
    upperName: "Dach: Kegel",
    upperFormula: `⅓ · π · r² · h₂`,
  };
}

// ─── Lernbereich 6: Wahrscheinlichkeiten ──────────────────────────────────

/** Laplace experiments with numbered outcomes 1 … n. */
export const EXPERIMENTS = [
  { name: "Würfel", n: 6 },
  { name: "Glücksrad mit 8 Feldern", n: 8 },
  { name: "Urne mit 10 Kugeln", n: 10 },
  { name: "Zwölfflächner", n: 12 },
] as const;

const isPrime = (k: number) => k > 1 && Array.from({ length: k - 2 }, (_, i) => i + 2).every((d) => k % d !== 0);

/** Events on the numbers 1 … n. */
export const EVENTS: Array<{ name: string; test: (k: number) => boolean }> = [
  { name: "gerade Zahl", test: (k) => k % 2 === 0 },
  { name: "ungerade Zahl", test: (k) => k % 2 === 1 },
  { name: "Primzahl", test: isPrime },
  { name: "größer als 4", test: (k) => k > 4 },
  { name: "Vielfaches von 3", test: (k) => k % 3 === 0 },
  { name: "kleiner als 3", test: (k) => k < 3 },
];

/** Ω = {1; …; n} and the outcomes of the event. */
export function outcomes(n: number, event: number): { omega: number[]; favourable: number[] } {
  const omega = Array.from({ length: n }, (_, i) => i + 1);
  return { omega, favourable: omega.filter((k) => EVENTS[event].test(k)) };
}

/** A set in German school notation: {2; 4; 6}. */
export const setText = (items: Array<number | string>): string =>
  items.length ? `{${items.join("; ")}}` : "{ }";

/** Events on two distinguishable dice (red, blue). */
export const DICE_EVENTS = [
  "Augensumme gleich s",
  "Augensumme mindestens s",
  "Pasch (beide gleich)",
  "mindestens eine 6",
  "beide Zahlen gerade",
];

/** Whether the pair (r, b) belongs to the event. */
export function diceEvent(type: number, s: number, r: number, b: number): boolean {
  if (type === 0) return r + b === s;
  if (type === 1) return r + b >= s;
  if (type === 2) return r === b;
  if (type === 3) return r === 6 || b === 6;
  return r % 2 === 0 && b % 2 === 0;
}

/** How many of the 36 pairs belong to the event. */
export function diceCount(type: number, s: number): number {
  let count = 0;
  for (let r = 1; r <= 6; r++) for (let b = 1; b <= 6; b++) if (diceEvent(type, s, r, b)) count++;
  return count;
}
