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

/** 13 → "1101". */
export const dual = (n: number): string => n.toString(2);

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

export function ggt(a: number, b: number): number {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x;
}

export const kgv = (a: number, b: number): number => (a * b) / ggt(a, b);

/** Round to the nearest multiple of `place`; a 5 at the next digit rounds up. */
export const roundTo = (n: number, place: number): number =>
  Math.floor(n / place + 0.5) * place;

/** The carries of the written addition a + b, per column from the right. */
export function carries(a: number, b: number): number[] {
  const out: number[] = [];
  let carry = 0;
  for (
    let x = a, y = b;
    x > 0 || y > 0;
    x = Math.floor(x / 10), y = Math.floor(y / 10)
  ) {
    carry = (x % 10) + (y % 10) + carry >= 10 ? 1 : 0;
    out.push(carry);
  }
  return out;
}

/** The columns that must break a bundle in the written subtraction a − b (a ≥ b). */
export function borrows(a: number, b: number): number[] {
  const out: number[] = [];
  let borrow = 0;
  for (
    let x = a, y = b;
    x > 0 || y > 0;
    x = Math.floor(x / 10), y = Math.floor(y / 10)
  ) {
    borrow = (x % 10) - (y % 10) - borrow < 0 ? 1 : 0;
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
export function divisionSteps(
  dividend: number,
  divisor: number,
): DivisionStep[] {
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

export type SideKind = "gleichseitig" | "gleichschenklig" | "unregelmäßig";
export type AngleKind = "spitzwinklig" | "rechtwinklig" | "stumpfwinklig";

export const validTriangle = (a: number, b: number, c: number): boolean =>
  a + b > c && a + c > b && b + c > a;

export const sideKind = (a: number, b: number, c: number): SideKind =>
  a === b && b === c
    ? "gleichseitig"
    : a === b || b === c || a === c
      ? "gleichschenklig"
      : "unregelmäßig";

export function angleKind(a: number, b: number, c: number): AngleKind {
  const [x, y, z] = [a, b, c].sort((p, q) => p - q);
  const compare = x * x + y * y - z * z;
  return compare === 0
    ? "rechtwinklig"
    : compare > 0
      ? "spitzwinklig"
      : "stumpfwinklig";
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

export interface QuadShape {
  /** Lower left A, lower right B, upper right C, upper left D, in grid units. */
  points: Array<{ x: number; y: number }>;
  name: string;
}

/**
 * A quadrilateral from base w, height h, sideways shift s of the top and an
 * inset t that shortens the top side on both ends.
 */
export function quadrilateral(
  w: number,
  h: number,
  s: number,
  t: number,
): QuadShape {
  const inset = Math.min(t, Math.floor((w - 1) / 2));
  const points = [
    { x: 0, y: 0 },
    { x: w, y: 0 },
    { x: w + s - inset, y: h },
    { x: s + inset, y: h },
  ];
  let name: string;
  if (inset > 0) name = s === 0 ? "gleichschenkliges Trapez" : "Trapez";
  else if (s === 0) name = w === h ? "Quadrat" : "Rechteck";
  else name = s * s + h * h === w * w ? "Raute" : "Parallelogramm";
  return { points, name };
}

/** Faces of a body: corners, edges, faces and what its boundary looks like. */
export interface Solid {
  name: string;
  ecken: number;
  kanten: number;
  flaechen: number;
  form: string;
}

export const SOLIDS: Solid[] = [
  {
    name: "Würfel",
    ecken: 8,
    kanten: 12,
    flaechen: 6,
    form: "6 gleich große Quadrate",
  },
  {
    name: "Quader",
    ecken: 8,
    kanten: 12,
    flaechen: 6,
    form: "6 Rechtecke, gegenüberliegende sind gleich groß",
  },
  {
    name: "Prisma (dreiseitig)",
    ecken: 6,
    kanten: 9,
    flaechen: 5,
    form: "2 Dreiecke und 3 Rechtecke",
  },
  {
    name: "Pyramide (viereckig)",
    ecken: 5,
    kanten: 8,
    flaechen: 5,
    form: "1 Viereck und 4 Dreiecke",
  },
  {
    name: "Zylinder",
    ecken: 0,
    kanten: 2,
    flaechen: 3,
    form: "2 Kreise und 1 gekrümmte Fläche",
  },
  {
    name: "Kegel",
    ecken: 0,
    kanten: 1,
    flaechen: 2,
    form: "1 Kreis, 1 gekrümmte Fläche und eine Spitze",
  },
  {
    name: "Kugel",
    ecken: 0,
    kanten: 0,
    flaechen: 1,
    form: "nur 1 gekrümmte Fläche",
  },
];

/** Six squares on a grid, as [column, row], numbered 1 to 6 in this order. */
export interface NetPattern {
  name: string;
  cells: Array<[number, number]>;
}

export const NET_PATTERNS: NetPattern[] = [
  {
    name: "Kreuz",
    cells: [
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [1, 2],
    ],
  },
  {
    name: "Treppe",
    cells: [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
      [2, 2],
      [3, 2],
    ],
  },
  {
    name: "Streifen mit zwei Laschen",
    cells: [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
    ],
  },
  {
    name: "Zwei Dreierreihen",
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
  },
  {
    name: "Langer Streifen",
    cells: [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
      [4, 0],
      [5, 0],
    ],
  },
  {
    name: "Viererblock mit Schwanz",
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
      [0, 3],
    ],
  },
];

/**
 * Rolls a cube over the net: each square lands on one side of the cube. Returns
 * the pairs of opposite squares, or null when two squares land on the same side
 * (the pattern does not fold to a cube).
 */
export function foldNet(
  cells: Array<[number, number]>,
): Array<[number, number]> | null {
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
  for (const [first, second] of [
    [0, 1],
    [2, 3],
    [4, 5],
  ]) {
    const face = (side: number) =>
      [...sideOf].find(([, value]) => value === side)![0] + 1;
    pairs.push([face(first), face(second)]);
  }
  return pairs;
}

export const oppositeFace = (
  pattern: NetPattern,
  face: number,
): number | null => {
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

export const LENGTH: UnitLadder = {
  name: "Länge",
  units: ["mm", "cm", "dm", "m", "km"],
  factors: [10, 10, 10, 1000],
};
export const MASS: UnitLadder = {
  name: "Masse",
  units: ["mg", "g", "kg", "t"],
  factors: [1000, 1000, 1000],
};
export const MONEY: UnitLadder = {
  name: "Geld",
  units: ["ct", "€"],
  factors: [100],
};
export const TIME: UnitLadder = {
  name: "Zeit",
  units: ["s", "min", "h", "d"],
  factors: [60, 60, 24],
};
export const VOLUME: UnitLadder = {
  name: "Hohlmaß",
  units: ["ml", "l", "hl"],
  factors: [1000, 100],
};
export const AREA: UnitLadder = {
  name: "Fläche",
  units: ["mm²", "cm²", "dm²", "m²", "a", "ha", "km²"],
  factors: [100, 100, 100, 100, 100, 100],
};

/** How many of `units[from]` make up one of `units[to]`, as a factor on the value. */
export function convertFactor(
  ladder: UnitLadder,
  from: number,
  to: number,
): number {
  let factor = 1;
  if (from > to) for (let i = to; i < from; i++) factor *= ladder.factors[i];
  else for (let i = from; i < to; i++) factor /= ladder.factors[i];
  return factor;
}

/** Converts exactly by multiplying before dividing, so 2500 g is 2,5 kg and not 2,4999…. */
export function convert(
  ladder: UnitLadder,
  value: number,
  from: number,
  to: number,
): number {
  let result = value;
  if (from > to) for (let i = to; i < from; i++) result *= ladder.factors[i];
  else {
    let divisor = 1;
    for (let i = from; i < to; i++) divisor *= ladder.factors[i];
    result /= divisor;
  }
  return result;
}

/** Perimeter of a rectangle with a rectangular notch in one corner: the same as without it. */
export const notchPerimeter = (w: number, h: number): number => 2 * (w + h);

/** Area of a rectangle with a rectangular notch in one corner. */
export const notchArea = (
  w: number,
  h: number,
  cw: number,
  ch: number,
): number => w * h - cw * ch;

export interface TermSteps {
  /** The term with its numbers. */
  text: string;
  /** The steps after the first "=", the last one being the value. */
  steps: string[];
  value: number;
  /** The value of the typical slip: strictly from left to right, ignoring the rules. */
  wrong: number;
}

/** The three term forms of the order-of-operations lab. */
export function termSteps(
  term: number,
  a: number,
  b: number,
  c: number,
): TermSteps {
  if (term === 1)
    return {
      text: `(${a} + ${b}) · ${c}`,
      steps: [`${a + b} · ${c}`, `${(a + b) * c}`],
      value: (a + b) * c,
      wrong: a + b * c,
    };
  if (term === 2)
    return {
      text: `${a}² + ${b} · ${c}`,
      steps: [
        `${a * a} + ${b} · ${c}`,
        `${a * a} + ${b * c}`,
        `${a * a + b * c}`,
      ],
      value: a * a + b * c,
      wrong: (a * a + b) * c,
    };
  return {
    text: `${a} + ${b} · ${c}`,
    steps: [`${a} + ${b * c}`, `${a + b * c}`],
    value: a + b * c,
    wrong: (a + b) * c,
  };
}
