/** The arithmetic of grade 5 the labs and task generators share; tested on its own. */

const SUPERSCRIPTS = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** 12 → "¹²", for exponents inside SVG text. */
export const sup = (n: number): string =>
  String(n)
    .split("")
    .map((digit) => SUPERSCRIPTS[Number(digit)])
    .join("");

const ROMAN: Array<[number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function roman(n: number): string {
  let rest = n;
  let out = "";
  for (const [value, sign] of ROMAN) {
    while (rest >= value) {
      out += sign;
      rest -= value;
    }
  }
  return out;
}

/** 14 → [[10, "X"], [4, "IV"]]: the signs the number is written with, one group per value. */
export function romanParts(n: number): Array<[number, string]> {
  const out: Array<[number, string]> = [];
  let rest = n;
  for (const [value, sign] of ROMAN) {
    while (rest >= value) {
      out.push([value, sign]);
      rest -= value;
    }
  }
  return out;
}

export function fromRoman(text: string): number {
  const value: Record<string, number> = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  for (let i = 0; i < text.length; i++) {
    const here = value[text[i]];
    const next = value[text[i + 1]] ?? 0;
    total += here < next ? -here : here;
  }
  return total;
}

export const digitSum = (n: number): number =>
  String(Math.abs(n))
    .split("")
    .reduce((sum, digit) => sum + Number(digit), 0);

export function divisors(n: number): number[] {
  const out: number[] = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d);
  return out;
}

export const isPrime = (n: number): boolean =>
  n >= 2 && divisors(n).length === 2;

/** 60 → [2, 2, 3, 5]. */
export function primeFactors(n: number): number[] {
  const out: number[] = [];
  let rest = n;
  for (let p = 2; p * p <= rest; p++) {
    while (rest % p === 0) {
      out.push(p);
      rest /= p;
    }
  }
  if (rest > 1) out.push(rest);
  return out;
}

/** 60 → "2² · 3 · 5". */
export function factorText(n: number): string {
  const counts = new Map<number, number>();
  for (const p of primeFactors(n)) counts.set(p, (counts.get(p) ?? 0) + 1);
  return [...counts]
    .map(([p, count]) => (count > 1 ? `${p}${sup(count)}` : String(p)))
    .join(" · ");
}

/** Round to the nearest multiple of `place`; a 5 at the next digit rounds up. */
export const roundTo = (n: number, place: number): number =>
  Math.floor(n / place + 0.5) * place;

/** The carries of the written addition a + b, per column from the right. */
export function carries(a: number, b: number): number[] {
  const out: number[] = [];
  let carry = 0;
  for (let x = a, y = b; x > 0 || y > 0; x = Math.floor(x / 10), y = Math.floor(y / 10)) {
    carry = x % 10 + y % 10 + carry >= 10 ? 1 : 0;
    out.push(carry);
  }
  return out;
}

/** The columns that must break a bundle in the written subtraction a − b (a ≥ b). */
export function borrows(a: number, b: number): number[] {
  const out: number[] = [];
  let borrow = 0;
  for (let x = a, y = b; x > 0 || y > 0; x = Math.floor(x / 10), y = Math.floor(y / 10)) {
    borrow = x % 10 - y % 10 - borrow < 0 ? 1 : 0;
    out.push(borrow);
  }
  return out;
}

export interface DivisionStep {
  /** The part of the dividend being divided at this digit. */
  part: number;
  digit: number;
  rest: number;
}

/** The written division, digit by digit. */
export function divisionSteps(dividend: number, divisor: number): DivisionStep[] {
  const steps: DivisionStep[] = [];
  let rest = 0;
  for (const char of String(dividend)) {
    const part = rest * 10 + Number(char);
    const digit = Math.floor(part / divisor);
    rest = part - digit * divisor;
    if (steps.length > 0 || digit > 0) steps.push({ part, digit, rest });
  }
  return steps;
}

export type AngleName =
  | "Nullwinkel"
  | "spitzer Winkel"
  | "rechter Winkel"
  | "stumpfer Winkel"
  | "gestreckter Winkel"
  | "überstumpfer Winkel"
  | "Vollwinkel";

export function angleName(alpha: number): AngleName {
  if (alpha === 0) return "Nullwinkel";
  if (alpha < 90) return "spitzer Winkel";
  if (alpha === 90) return "rechter Winkel";
  if (alpha < 180) return "stumpfer Winkel";
  if (alpha === 180) return "gestreckter Winkel";
  if (alpha < 360) return "überstumpfer Winkel";
  return "Vollwinkel";
}

/** Six squares on a grid, as [column, row], numbered 1 to 6 in this order. */
export interface NetPattern {
  name: string;
  cells: Array<[number, number]>;
}

export const NET_PATTERNS: NetPattern[] = [
  { name: "Kreuz", cells: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] },
  { name: "Treppe", cells: [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]] },
  { name: "Streifen mit zwei Laschen", cells: [[0, 0], [0, 1], [1, 1], [2, 1], [3, 1], [3, 2]] },
  { name: "Zwei Dreierreihen", cells: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]] },
  { name: "Langer Streifen", cells: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0]] },
  { name: "Viererblock mit Schwanz", cells: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [0, 3]] },
];

/**
 * Rolls a cube over the net: each square lands on one side of the cube. Returns
 * the pairs of opposite squares, or null when two squares land on the same side
 * (the pattern does not fold to a cube).
 */
export function foldNet(cells: Array<[number, number]>): Array<[number, number]> | null {
  // Sides of the cube as [bottom, top, north, south, east, west].
  const roll: Record<string, (d: number[]) => number[]> = {
    "1,0": ([b, t, n, s, e, w]) => [e, w, n, s, t, b],
    "-1,0": ([b, t, n, s, e, w]) => [w, e, n, s, b, t],
    "0,1": ([b, t, n, s, e, w]) => [s, n, b, t, e, w],
    "0,-1": ([b, t, n, s, e, w]) => [n, s, t, b, e, w],
  };
  const sideOf = new Map<number, number>();
  const seen = new Set<number>();
  let valid = true;
  const visit = (index: number, die: number[]) => {
    seen.add(index);
    if ([...sideOf.values()].includes(die[0])) valid = false;
    sideOf.set(index, die[0]);
    cells.forEach(([x, y], next) => {
      if (seen.has(next)) return;
      const key = `${x - cells[index][0]},${y - cells[index][1]}`;
      if (roll[key]) visit(next, roll[key](die));
    });
  };
  visit(0, [0, 1, 2, 3, 4, 5]);
  if (!valid || seen.size !== cells.length) return null;
  const pairs: Array<[number, number]> = [];
  for (const [first, second] of [[0, 1], [2, 3], [4, 5]]) {
    const face = (side: number) =>
      [...sideOf].find(([, value]) => value === side)![0] + 1;
    pairs.push([face(first), face(second)]);
  }
  return pairs;
}

export const oppositeFace = (pattern: NetPattern, face: number): number | null => {
  const pairs = foldNet(pattern.cells);
  const pair = pairs?.find(([a, b]) => a === face || b === face);
  return pair ? (pair[0] === face ? pair[1] : pair[0]) : null;
};

/** A ladder of units: each step names how many of the smaller unit fit the next one. */
export interface UnitLadder {
  name: string;
  units: string[];
  /** factors[i] smaller units units[i] make one units[i + 1]. */
  factors: number[];
}

export const LENGTH: UnitLadder = { name: "Länge", units: ["mm", "cm", "dm", "m", "km"], factors: [10, 10, 10, 1000] };
export const MASS: UnitLadder = { name: "Masse", units: ["mg", "g", "kg", "t"], factors: [1000, 1000, 1000] };
export const MONEY: UnitLadder = { name: "Geld", units: ["ct", "€"], factors: [100] };
export const TIME: UnitLadder = { name: "Zeit", units: ["s", "min", "h"], factors: [60, 60] };
export const AREA: UnitLadder = { name: "Fläche", units: ["mm²", "cm²", "dm²", "m²", "a", "ha", "km²"], factors: [100, 100, 100, 100, 100, 100] };

/** How many of `units[from]` make up one of `units[to]`, as a factor on the value. */
export function convertFactor(ladder: UnitLadder, from: number, to: number): number {
  let factor = 1;
  if (from > to) for (let i = to; i < from; i++) factor *= ladder.factors[i];
  else for (let i = from; i < to; i++) factor /= ladder.factors[i];
  return factor;
}

/** Converts exactly by multiplying before dividing, so 2500 g is 2,5 kg and not 2,4999…. */
export function convert(ladder: UnitLadder, value: number, from: number, to: number): number {
  let result = value;
  if (from > to) for (let i = to; i < from; i++) result *= ladder.factors[i];
  else {
    let divisor = 1;
    for (let i = from; i < to; i++) divisor *= ladder.factors[i];
    result /= divisor;
  }
  return result;
}

/** Area of a rectangle with a rectangular notch in one corner. */
export const notchArea = (w: number, h: number, cw: number, ch: number): number =>
  w * h - cw * ch;

/** The most exact name of a quadrilateral A, B, C, D on the grid (corners in order). */
export type QuadName =
  | "Quadrat"
  | "Rechteck"
  | "Raute"
  | "Parallelogramm"
  | "Drachenviereck"
  | "Trapez"
  | "allgemeines Viereck"
  | "kein einfaches Viereck";

export interface GridPoint {
  x: number;
  y: number;
}

const cross = (a: GridPoint, b: GridPoint, c: GridPoint): number =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
const dist2 = (a: GridPoint, b: GridPoint): number =>
  (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
const parallel = (a: GridPoint, b: GridPoint, c: GridPoint, d: GridPoint): boolean =>
  (b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x) === 0;
const rightAngle = (a: GridPoint, b: GridPoint, c: GridPoint): boolean =>
  (a.x - b.x) * (c.x - b.x) + (a.y - b.y) * (c.y - b.y) === 0;

/** True when the four corners form a convex quadrilateral without a straight corner. */
export function isConvexQuad(points: GridPoint[]): boolean {
  const turns = points.map((p, i) =>
    cross(p, points[(i + 1) % 4], points[(i + 2) % 4]),
  );
  return turns.every((turn) => turn > 0) || turns.every((turn) => turn < 0);
}

/** True when no three corners lie on a line and the sides do not cross. */
export function isSimpleQuad(points: GridPoint[]): boolean {
  const [a, b, c, d] = points;
  const turns = [cross(a, b, c), cross(b, c, d), cross(c, d, a), cross(d, a, b)];
  if (turns.some((turn) => turn === 0)) return false;
  const crossing = (p: GridPoint, q: GridPoint, r: GridPoint, s: GridPoint) =>
    cross(p, q, r) * cross(p, q, s) < 0 && cross(r, s, p) * cross(r, s, q) < 0;
  return !crossing(a, b, c, d) && !crossing(b, c, d, a);
}

export function quadName(points: GridPoint[]): QuadName {
  if (!isSimpleQuad(points)) return "kein einfaches Viereck";
  const [a, b, c, d] = points;
  const sides = [dist2(a, b), dist2(b, c), dist2(c, d), dist2(d, a)];
  const allEqual = sides.every((side) => side === sides[0]);
  const parallelOne = parallel(a, b, d, c);
  const parallelTwo = parallel(b, c, a, d);
  const right = rightAngle(d, a, b);
  if (parallelOne && parallelTwo) {
    if (allEqual) return right ? "Quadrat" : "Raute";
    return right ? "Rechteck" : "Parallelogramm";
  }
  const kite =
    (sides[0] === sides[3] && sides[1] === sides[2]) ||
    (sides[0] === sides[1] && sides[2] === sides[3]);
  if (kite) return "Drachenviereck";
  if (parallelOne || parallelTwo) return "Trapez";
  return "allgemeines Viereck";
}

export type CircleLinePlace = "Passante" | "Tangente" | "Sekante";

/** A line at distance d from the centre of a circle with radius r. */
export const circleLine = (d: number, r: number): CircleLinePlace =>
  d > r ? "Passante" : d === r ? "Tangente" : "Sekante";

export const circleLinePoints = (d: number, r: number): number =>
  d > r ? 0 : d === r ? 1 : 2;

export type TwoCirclesPlace =
  | "liegen außerhalb voneinander"
  | "berühren sich von außen"
  | "schneiden sich"
  | "berühren sich von innen"
  | "liegen ineinander"
  | "haben denselben Mittelpunkt";

/** Two circles with radii r and s whose centres are d apart. */
export function twoCircles(d: number, r: number, s: number): TwoCirclesPlace {
  if (d === 0) return "haben denselben Mittelpunkt";
  if (d > r + s) return "liegen außerhalb voneinander";
  if (d === r + s) return "berühren sich von außen";
  const inner = Math.abs(r - s);
  if (d > inner) return "schneiden sich";
  return d === inner ? "berühren sich von innen" : "liegen ineinander";
}

export const twoCirclesPoints = (d: number, r: number, s: number): number => {
  const place = twoCircles(d, r, s);
  if (place === "schneiden sich") return 2;
  return place.startsWith("berühren") ? 1 : d === 0 && r === s ? Infinity : 0;
};

export type EquationForm = 0 | 1 | 2;

export interface EquationModel {
  /** The equation with the numbers filled in and x in place. */
  text: (x: string) => string;
  left: (x: number) => number;
  /** The Umkehraufgabe written out, the last step being x = value. */
  inverse: string;
  /** The solution, or null when no whole number solves it. */
  solution: number | null;
}

const signed = (n: number): string =>
  n < 0 ? `(−${-n})` : String(n);
const plain = (n: number): string => (n < 0 ? `−${-n}` : String(n));

/** a + x = b, x − a = b and a − x = b. */
export function additiveEquation(form: number, a: number, b: number): EquationModel {
  if (form === 1)
    return {
      text: (x) => `${x} − ${signed(a)} = ${plain(b)}`,
      left: (x) => x - a,
      inverse: `x = ${plain(b)} + ${signed(a)} = ${plain(b + a)}`,
      solution: b + a,
    };
  if (form === 2)
    return {
      text: (x) => `${plain(a)} − ${x} = ${plain(b)}`,
      left: (x) => a - x,
      inverse: `x = ${plain(a)} − ${signed(b)} = ${plain(a - b)}`,
      solution: a - b,
    };
  return {
    text: (x) => `${plain(a)} + ${x} = ${plain(b)}`,
    left: (x) => a + x,
    inverse: `x = ${plain(b)} − ${signed(a)} = ${plain(b - a)}`,
    solution: b - a,
  };
}

/** a · x = b, x : a = b and a : x = b, with a ≠ 0. */
export function multiplicativeEquation(form: number, a: number, b: number): EquationModel {
  const whole = (value: number): number | null =>
    Number.isInteger(value) ? (value === 0 ? 0 : value) : null;
  if (form === 1)
    return {
      text: (x) => `${x} : ${signed(a)} = ${plain(b)}`,
      left: (x) => x / a,
      inverse: `x = ${plain(b)} · ${signed(a)} = ${plain(b * a)}`,
      solution: whole(b * a),
    };
  if (form === 2) {
    const solution = b === 0 ? null : whole(a / b);
    return {
      text: (x) => `${plain(a)} : ${x} = ${plain(b)}`,
      left: (x) => (x === 0 ? Number.NaN : a / x),
      inverse:
        a === 0 && b === 0
          ? "Mit a = 0 und b = 0 gibt es keine Umkehraufgabe."
          : solution === null
            ? "Keine ganze Zahl löst diese Gleichung."
            : `x = ${plain(a)} : ${signed(b)} = ${plain(solution)}`,
      solution,
    };
  }
  const solution = a === 0 ? null : whole(b / a);
  return {
    text: (x) => `${plain(a)} · ${x} = ${plain(b)}`,
    left: (x) => a * x,
    inverse:
      a === 0
        ? "Mit a = 0 gibt es keine Umkehraufgabe."
        : solution === null
          ? "Keine ganze Zahl löst diese Gleichung."
          : `x = ${plain(b)} : ${signed(a)} = ${plain(solution)}`,
    solution,
  };
}

/** A term as a tree: leaves are numbers, inner nodes one calculation. */
export type TermNode =
  | number
  | { op: "+" | "−" | "·" | ":" | "^"; left: TermNode; right: TermNode };

export const TERM_KIND: Record<string, string> = {
  "+": "Summe",
  "−": "Differenz",
  "·": "Produkt",
  ":": "Quotient",
  "^": "Potenz",
};

const PART_NAMES: Record<string, [string, string]> = {
  "+": ["1. Summand", "2. Summand"],
  "−": ["Minuend", "Subtrahend"],
  "·": ["1. Faktor", "2. Faktor"],
  ":": ["Dividend", "Divisor"],
  "^": ["Basis", "Exponent"],
};

export const partNames = (op: string): [string, string] => PART_NAMES[op];

export function termValue(node: TermNode): number {
  if (typeof node === "number") return node;
  const l = termValue(node.left);
  const r = termValue(node.right);
  switch (node.op) {
    case "+":
      return l + r;
    case "−":
      return l - r;
    case "·":
      return l * r;
    case ":":
      return l / r;
    default:
      return l ** r;
  }
}

const RANK: Record<string, number> = { "+": 1, "−": 1, "·": 2, ":": 2, "^": 3 };

/** The term as text, with the brackets it needs and negative numbers in brackets. */
export function termText(node: TermNode, rank = 0, isRight = false): string {
  if (typeof node === "number") return node < 0 ? `(−${-node})` : String(node);
  const own = RANK[node.op];
  const body =
    node.op === "^"
      ? `${termText(node.left, 4)}${sup(node.right as number)}`
      : `${termText(node.left, own)} ${node.op} ${termText(node.right, own, true)}`;
  const needs = own < rank || (own === rank && isRight && node.op !== "^");
  return needs ? `(${body})` : body;
}

/** "eine Summe", "ein Produkt": the kind with its article. */
export const termKindPhrase = (node: TermNode): string => {
  const kind = termKind(node);
  return kind === "Produkt" || kind === "Quotient" ? `ein ${kind}` : `eine ${kind}`;
};

/** The kind of a term: the calculation that comes last. */
export const termKind = (node: TermNode): string =>
  typeof node === "number" ? "Zahl" : TERM_KIND[node.op];

/** Calculates the term one step at a time: first innermost calculation from the left. */
export function termSolve(node: TermNode): string[] {
  const out: string[] = [];
  let current = node;
  const step = (n: TermNode): TermNode => {
    if (typeof n === "number") return n;
    // Powers and products bind first; a calculation runs once both sides are numbers.
    if (typeof n.left !== "number") return { ...n, left: step(n.left) };
    if (typeof n.right !== "number") return { ...n, right: step(n.right) };
    return termValue(n);
  };
  while (typeof current !== "number") {
    current = step(current);
    out.push(termText(current).replace(/^\(−(\d+)\)$/, "−$1"));
  }
  return out;
}

export const boxSurface = (a: number, b: number, c: number): number =>
  2 * (a * b + b * c + a * c);

/** A cube with edge k on top of a box a, b, c: its base and the covered part leave the surface. */
export const stackSurface = (a: number, b: number, c: number, k: number): number =>
  boxSurface(a, b, c) + 4 * k * k;
