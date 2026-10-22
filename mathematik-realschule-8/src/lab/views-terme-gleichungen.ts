import { fmt, MINUS, paren, quadratic, round, sum } from "../exercises/format";
import type { LabValues } from "../model/types";
import { circle, handle, type LabView, line, open, rect, text } from "./svg";

// ─── Shared algebra of this stage ──────────────────────────────────────────
//
// Terms with several variables are lists of monomials c · aᵖ bᑫ xʳ yˢ. The
// stage file builds its tasks with them and the tests recompute with them,
// so every printed term is the term that was calculated.

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** An integer as Unicode superscript for plain texts: 2 → "²", −1 → "⁻¹". */
export function supText(n: number): string {
  const digits = String(Math.abs(Math.round(n)))
    .split("")
    .map((digit) => SUPERSCRIPT[Number(digit)])
    .join("");
  return `${n < 0 ? "⁻" : ""}${digits}`;
}

export const VARS = ["a", "b", "x", "y"] as const;
export type Var = (typeof VARS)[number];

/** The variables of a monomial with their exponents; a missing variable has exponent 0. */
export type Mono = Partial<Record<Var, number>>;

export interface Term {
  c: number;
  m: Mono;
}

export type Poly = Term[];

const exp = (m: Mono, v: Var) => m[v] ?? 0;

function cleanMono(m: Mono): Mono {
  const out: Mono = {};
  for (const v of VARS) if (exp(m, v) !== 0) out[v] = exp(m, v);
  return out;
}

function monoKey(m: Mono): string {
  return VARS.map((v) => exp(m, v)).join(",");
}

/** Alphabetical order, falling exponents: a³, a²b, ab², b³; x², x, constant. */
function compareTerms(s: Term, t: Term): number {
  for (const v of VARS) {
    const d = exp(t.m, v) - exp(s.m, v);
    if (d !== 0) return d;
  }
  return 0;
}

/** Like terms combined, zero terms dropped, ordered as a result is written. */
export function norm(p: Poly): Poly {
  const map = new Map<string, Term>();
  for (const t of p) {
    const key = monoKey(t.m);
    const before = map.get(key);
    map.set(key, { c: (before?.c ?? 0) + t.c, m: cleanMono(t.m) });
  }
  return [...map.values()]
    .map((t) => ({ c: round(t.c, 9), m: t.m }))
    .filter((t) => t.c !== 0)
    .sort(compareTerms);
}

export function polyMul(p: Poly, q: Poly): Poly {
  const out: Poly = [];
  for (const s of p) {
    for (const t of q) {
      const m: Mono = {};
      for (const v of VARS) m[v] = exp(s.m, v) + exp(t.m, v);
      out.push({ c: s.c * t.c, m });
    }
  }
  return norm(out);
}

export function polyAdd(...ps: Poly[]): Poly {
  return norm(ps.flat());
}

export function polyScale(p: Poly, k: number): Poly {
  return norm(p.map((t) => ({ c: t.c * k, m: t.m })));
}

export function polySub(p: Poly, q: Poly): Poly {
  return polyAdd(p, polyScale(q, -1));
}

export function polyPow(p: Poly, n: number): Poly {
  let out: Poly = [{ c: 1, m: {} }];
  for (let i = 0; i < n; i++) out = polyMul(out, p);
  return out;
}

export function polyEval(p: Poly, values: Partial<Record<Var, number>>): number {
  return p.reduce((total, t) => total + t.c * VARS.reduce((f, v) => f * (values[v] ?? 0) ** exp(t.m, v), 1), 0);
}

/** The coefficient of one monomial in a polynomial (0 when it does not occur). */
export function coefOf(p: Poly, m: Mono): number {
  const key = monoKey(m);
  return norm(p).find((t) => monoKey(t.m) === key)?.c ?? 0;
}

/** The variables of a monomial in HTML: "x<sup>2</sup>y". */
export function varsHtml(m: Mono): string {
  return VARS.filter((v) => exp(m, v) !== 0)
    .map((v) => (exp(m, v) === 1 ? v : `${v}<sup>${exp(m, v)}</sup>`))
    .join("");
}

/** The variables of a monomial as plain text: "x²y". */
export function varsText(m: Mono): string {
  return VARS.filter((v) => exp(m, v) !== 0)
    .map((v) => (exp(m, v) === 1 ? v : `${v}${supText(exp(m, v))}`))
    .join("");
}

/** A polynomial in HTML: "3x<sup>2</sup>y − 5xy<sup>2</sup> + 4"; normalised unless `ordered` is false. */
export function polyHtml(p: Poly, ordered = true): string {
  return sum((ordered ? norm(p) : p).map((t) => [t.c, varsHtml(t.m)] as [number, string]));
}

/** A polynomial as plain text with Unicode exponents. */
export function polyText(p: Poly, ordered = true): string {
  return sum((ordered ? norm(p) : p).map((t) => [t.c, varsText(t.m)] as [number, string]));
}

/** One monomial in HTML, its coefficient included: "−3a<sup>2</sup>b", "x". */
export function monoHtml(c: number, m: Mono): string {
  return polyHtml([{ c, m }], false);
}

/** A monomial as a factor of a product: in brackets when negative, "(−4ab<sup>3</sup>)". */
export function factorHtml(c: number, m: Mono): string {
  const body = monoHtml(c, m);
  return c < 0 ? `(${body})` : body;
}

/** "x + 3", "x − 2", "x": a variable plus a number, for brackets. */
export function plusText(variable: string, k: number): string {
  if (k === 0) return variable;
  return k > 0 ? `${variable} + ${fmt(k)}` : `${variable} ${MINUS} ${fmt(-k)}`;
}

/** "(x + 3)" or "x" when k = 0. */
export function bracket(variable: string, k: number): string {
  return k === 0 ? variable : `(${plusText(variable, k)})`;
}

/** k · x as written: "x", "−x", "3x". */
function timesX(k: number): string {
  return k === 1 ? "x" : k === -1 ? `${MINUS}x` : `${fmt(k)}x`;
}

// ─── 4.1 Die Einsetzprobe ───────────────────────────────────────────────────

export interface Claim {
  text: string;
  /** True when the Umformung is right for every x and y. */
  right: boolean;
  left: (x: number, y: number) => number;
  rightSide: (x: number, y: number) => number;
}

/** Nine Umformungen, six of them wrong in the ways learners get them wrong. */
export const CLAIMS: Claim[] = [
  { text: "3x²y + 5x²y = 8x²y", right: true, left: (x, y) => 3 * x * x * y + 5 * x * x * y, rightSide: (x, y) => 8 * x * x * y },
  { text: "x² + x² = x⁴", right: false, left: (x) => x * x + x * x, rightSide: (x) => x ** 4 },
  { text: "x² · x³ = x⁶", right: false, left: (x) => x ** 2 * x ** 3, rightSide: (x) => x ** 6 },
  { text: "2x · 3y = 6xy", right: true, left: (x, y) => 2 * x * 3 * y, rightSide: (x, y) => 6 * x * y },
  { text: "(−3x)² = −9x²", right: false, left: (x) => (-3 * x) ** 2, rightSide: (x) => -9 * x * x },
  { text: "3x²y + 5xy² = 8x²y", right: false, left: (x, y) => 3 * x * x * y + 5 * x * y * y, rightSide: (x, y) => 8 * x * x * y },
  { text: "2x · 3x = 6x", right: false, left: (x) => 2 * x * 3 * x, rightSide: (x) => 6 * x },
  { text: "5x − (2x − 3y) = 3x − 3y", right: false, left: (x, y) => 5 * x - (2 * x - 3 * y), rightSide: (x, y) => 3 * x - 3 * y },
  { text: "(−2x²y)³ = −8x⁶y³", right: true, left: (x, y) => (-2 * x * x * y) ** 3, rightSide: (x, y) => -8 * x ** 6 * y ** 3 },
];

export const WRONG_CLAIMS = CLAIMS.filter((claim) => !claim.right).length;

/** Per claim: both sides at (x | y) and whether they agree. */
export function claimResults(x: number, y: number): Array<{ claim: Claim; l: number; r: number; equal: boolean }> {
  return CLAIMS.map((claim) => {
    const l = claim.left(x, y);
    const r = claim.rightSide(x, y);
    return { claim, l, r, equal: Math.abs(l - r) < 1e-9 };
  });
}

/** How many wrong Umformungen an Einsetzung exposes, and how many slip through. */
export function probeCounts(x: number, y: number): { exposed: number; slipped: number } {
  const wrong = claimResults(x, y).filter((result) => !result.claim.right);
  return { exposed: wrong.filter((result) => !result.equal).length, slipped: wrong.filter((result) => result.equal).length };
}

function likeTerms(v: LabValues): string {
  const { x, y } = v;
  const results = claimResults(x, y);
  const { exposed, slipped } = probeCounts(x, y);
  let out = open("Einsetzprobe: neun Umformungen, links und rechts dieselben Zahlen eingesetzt");
  out += text(16, 27, `Einsetzprobe mit x = ${fmt(x)} und y = ${fmt(y)}`, "lab-text lab-text-big");
  const head = 54;
  out += text(16, head, "Umformung", "lab-text-muted");
  out += text(318, head, "links", "lab-text-muted", "end");
  out += text(398, head, "rechts", "lab-text-muted", "end");
  out += text(418, head, "Probe", "lab-text-muted");
  out += line(12, head + 7, 508, head + 7, "lab-thin");
  results.forEach((result, i) => {
    const y0 = 80 + i * 27;
    if (i % 2 === 1) out += rect(12, y0 - 18, 496, 27, "lab-fill-only");
    out += text(16, y0, result.claim.text, "lab-text");
    out += text(318, y0, fmt(result.l, 3), "lab-text", "end");
    out += text(398, y0, fmt(result.r, 3), "lab-text", "end");
    if (result.equal) {
      out += circle(424, y0 - 4, 4, "lab-dot-small");
      out += text(434, y0, "gleich", "lab-text-muted");
    } else {
      out += circle(424, y0 - 4, 5, "lab-point-bad");
      out += text(434, y0, "verschieden", "lab-text lab-text-bad");
    }
  });
  out += text(
    16,
    328,
    `Entlarvt: ${exposed} von ${WRONG_CLAIMS} falschen Umformungen · unentdeckt: ${slipped}`,
    exposed === WRONG_CLAIMS ? "lab-text lab-text-ok" : "lab-text",
  );
  out += "</svg>";
  return out;
}

// ─── 4.2 Das Rechteckmodell ─────────────────────────────────────────────────

const RECT = { x0: 46, y0: 58, u: 21 };

/** The value of (x + p)(x + q). */
export function productValue(v: LabValues): number {
  return (v.x + v.p) * (v.x + v.q);
}

function expandProducts(v: LabValues): string {
  const { x, p, q } = v;
  const { x0, y0, u } = RECT;
  const X = x * u;
  const P = p * u;
  const Q = q * u;
  const exists = x + q > 0;
  // What is left of the square's height when q < 0 cuts a strip off the bottom.
  const H = exists ? X + Math.min(0, Q) : 0;
  let out = open("Rechteckmodell: Jedes Glied der einen Klammer wird mit jedem Glied der anderen multipliziert");
  out += text(16, 27, `${bracket("x", p)} · ${bracket("x", q)} als Rechteck`, "lab-text lab-text-big");
  out += rect(x0, y0, X, X, "lab-fill-a");
  out += rect(x0 + X, y0, P, X, "lab-fill-b");
  if (q > 0) {
    out += rect(x0, y0 + X, X, Q, "lab-fill-b");
    out += rect(x0 + X, y0 + X, P, Q, "lab-fill-c");
  }
  if (q < 0) {
    // The strip of height |q| at the bottom is cut away: −|q| · x under the square, −p|q| under the strip.
    const top = y0 + Math.max(0, X + Q);
    const height = Math.min(-Q, X);
    out += rect(x0, top, X + P, height, "lab-fill-only");
    out += rect(x0, top, X, height, "lab-dashed lab-bad-stroke") + rect(x0 + X, top, P, height, "lab-dashed lab-bad-stroke");
    if (height >= 15 && exists) {
      out += text(x0 + X / 2, top + height / 2 + 4, timesX(q), "lab-text-small lab-text-bad", "middle");
      if (P >= 28) out += text(x0 + X + P / 2, top + height / 2 + 4, fmt(p * q), "lab-text-small lab-text-bad", "middle");
    }
  }
  // labels of the parts that are left
  const labelY = y0 + (q < 0 ? H : X) / 2 + 5;
  if (X > 34 && (q >= 0 || H > 22)) out += text(x0 + X / 2, labelY, "x²", "lab-text lab-text-a", "middle");
  if (q >= 0 || H > 22) out += text(x0 + X + P / 2, labelY, timesX(p), P >= 26 ? "lab-text lab-text-b" : "lab-text-small lab-text-b", "middle");
  if (q > 0 && Q >= 15) {
    out += text(x0 + X / 2, y0 + X + Q / 2 + 5, timesX(q), "lab-text lab-text-b", "middle");
    out += text(x0 + X + P / 2, y0 + X + Q / 2 + 5, fmt(p * q), P >= 26 ? "lab-text lab-text-c" : "lab-text-small lab-text-c", "middle");
  }
  if (exists) out += rect(x0, y0, X + P, X + Q, "lab-side-ok");
  // side lengths
  out += text(x0 + X / 2, y0 - 8, "x", "lab-text-axis", "middle");
  out += text(x0 + X + P / 2, y0 - 8, fmt(p), "lab-text-axis", "middle");
  if (q >= 0) {
    out += text(x0 - 8, y0 + X / 2 + 4, "x", "lab-text-axis", "end");
    if (q > 0) out += text(x0 - 8, y0 + X + Q / 2 + 4, fmt(q), "lab-text-axis", "end");
  } else if (exists) {
    out += text(x0 - 8, y0 + H / 2 + 4, plusText("x", q), "lab-text-axis", "end");
    out += text(x0 - 8, y0 + H - Q / 2 + 4, fmt(-q), "lab-text-axis lab-text-bad", "end");
  }
  const area = productValue(v);

  // The multiplication table: every term of one bracket with every term of the other.
  const T = { x: 318, y: 44, cw: 62, ch: 28 };
  const cols: number[] = q === 0 ? [1] : [1, q];
  const cell = (cx: number, cy: number, content: string, cls: string, box: string) =>
    rect(T.x + cx * T.cw, T.y + cy * T.ch, T.cw, T.ch, box) + text(T.x + cx * T.cw + T.cw / 2, T.y + cy * T.ch + 19, content, cls, "middle");
  out += cell(0, 0, "·", "lab-text-muted", "lab-cell-sum");
  cols.forEach((cv, j) => (out += cell(j + 1, 0, j === 0 ? "x" : fmt(cv), "lab-text", "lab-cell-sum")));
  out += cell(0, 1, "x", "lab-text", "lab-cell-sum") + cell(0, 2, fmt(p), "lab-text", "lab-cell-sum");
  out += cell(1, 1, "x²", "lab-text lab-text-a", "lab-cell") + cell(1, 2, timesX(p), "lab-text lab-text-b", "lab-cell");
  if (q !== 0) out += cell(2, 1, timesX(q), "lab-text lab-text-b", "lab-cell") + cell(2, 2, fmt(p * q), "lab-text lab-text-c", "lab-cell");
  const lines: Array<[string, string]> = [
    [`${bracket("x", p)}${bracket("x", q)}`, "lab-text"],
    [`= ${sum([[1, "x²"], [q, "x"], [p, "x"], [p * q, ""]])}`, "lab-text"],
    [`= ${quadratic(1, p + q, p * q)}`, "lab-text lab-text-ok"],
    ["", ""],
    [`Bei x = ${fmt(x)}: ${fmt(x * x + (p + q) * x + p * q)}`, "lab-text-small"],
  ];
  if (q !== 0) {
    lines.push(
      [`Falsch wäre x² ${p * q < 0 ? MINUS : "+"} ${fmt(Math.abs(p * q))} = ${fmt(x * x + p * q)}:`, "lab-text-small lab-text-bad"],
      [`Es fehlt ${paren(p + q)} · ${fmt(x)} = ${fmt((p + q) * x)}.`, "lab-text-small lab-text-bad"],
    );
  }
  let ly = T.y + 3 * T.ch + 28;
  for (const [content, cls] of lines) {
    if (content) out += text(T.x - 6, ly, content, cls);
    ly += content ? 22 : 8;
  }
  out += text(
    T.x - 6,
    326,
    exists ? `A = ${fmt(x + p)} · ${fmt(x + q)} = ${fmt(area)} FE` : `${plusText("x", q)} ≤ 0: kein Rechteck`,
    exists ? "lab-text" : "lab-text lab-text-bad",
  );
  out += handle("x", x0 + X, y0 + X, "Ecke des Quadrats x²: x ändern");
  out += handle("p", x0 + X + P, y0 + (q < 0 && exists ? H : X) / 2, "rechte Seite: p ändern", "lab-handle lab-handle-b");
  if (exists) out += handle("q", x0 + X / 2, y0 + X + Q, "untere Seite: q ändern", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── 4.3 Die binomischen Formeln am Quadrat ───────────────────────────────────

const SQ = { x0: 34, y0: 62 };
/** Pixels per unit in each picture: (a + b)², (a − b)², (a + b)(a − b). */
const SQ_UNIT = [25, 40, 18];

export const BINOMIAL_FORMULAS = ["(a + b)² = a² + 2ab + b²", "(a − b)² = a² − 2ab + b²", "(a + b)(a − b) = a² − b²"];

/** The left side of the chosen formula at a and b. */
export function binomialLeft(v: LabValues): number {
  return v.mode === 0 ? (v.a + v.b) ** 2 : v.mode === 1 ? (v.a - v.b) ** 2 : (v.a + v.b) * (v.a - v.b);
}

function binomialSquares(v: LabValues): string {
  const { a, b, mode } = v;
  const { x0, y0 } = SQ;
  const u = SQ_UNIT[mode];
  const A = a * u;
  const B = b * u;
  let out = open("Die binomischen Formeln als Flächen: Quadrat, Restquadrat und umgelegtes Rechteck");
  out += text(16, 27, BINOMIAL_FORMULAS[mode], "lab-text lab-text-big");
  const lines: Array<[string, string]> = [];
  const sq = (k: number) => fmt(k * k);
  if (mode === 0) {
    out += rect(x0, y0, A, A, "lab-fill-a") + rect(x0 + A, y0, B, A, "lab-fill-b");
    out += rect(x0, y0 + A, A, B, "lab-fill-b") + rect(x0 + A, y0 + A, B, B, "lab-fill-c");
    if (A > 26) out += text(x0 + A / 2, y0 + A / 2 + 6, "a²", "lab-text lab-text-a lab-text-big", "middle");
    if (B > 22 && A > 26) {
      out += text(x0 + A + B / 2, y0 + A / 2 + 5, "ab", "lab-text lab-text-b", "middle");
      out += text(x0 + A / 2, y0 + A + B / 2 + 5, "ab", "lab-text lab-text-b", "middle");
    }
    if (B > 22) out += text(x0 + A + B / 2, y0 + A + B / 2 + 5, "b²", "lab-text lab-text-c", "middle");
    out += rect(x0, y0, A + B, A + B, "lab-ink");
    out += text(x0 + A / 2, y0 - 8, "a", "lab-text-axis", "middle") + text(x0 + A + B / 2, y0 - 8, "b", "lab-text-axis", "middle");
    out += text(x0 - 8, y0 + A / 2 + 4, "a", "lab-text-axis", "end") + text(x0 - 8, y0 + A + B / 2 + 4, "b", "lab-text-axis", "end");
    lines.push(
      [`(${fmt(a)} + ${fmt(b)})² = ${fmt(a + b)}² = ${fmt((a + b) ** 2)}`, "lab-text lab-text-ok"],
      ["", ""],
      [`a² = ${sq(a)}`, "lab-text lab-text-a"],
      [`2ab = 2 · ${fmt(a)} · ${fmt(b)} = ${fmt(2 * a * b)}`, "lab-text lab-text-b"],
      [`b² = ${sq(b)}`, "lab-text lab-text-c"],
      [`Summe: ${fmt(a * a + 2 * a * b + b * b)}`, "lab-text"],
      ["", ""],
      [`Ohne Mischglied: a² + b² = ${fmt(a * a + b * b)}`, "lab-text-small lab-text-bad"],
      [`Das sind ${fmt(2 * a * b)} FE zu wenig.`, "lab-text-small lab-text-bad"],
    );
    out += handle("a", x0 + A, y0 + A, "Ecke des Quadrats a²: a ändern", "lab-handle lab-handle-a");
    out += handle("b", x0 + A + B, y0 + A + B, "äußere Ecke: b ändern", "lab-handle lab-handle-b");
  } else if (mode === 1) {
    out += rect(x0, y0, A, A, "lab-ink");
    out += text(x0 + A / 2, y0 - 8, "a", "lab-text-axis", "middle") + text(x0 - 8, y0 + A / 2 + 4, "a", "lab-text-axis", "end");
    if (a > b) {
      const R = A - B;
      out += rect(x0, y0, R, R, "lab-fill-ok");
      out += rect(x0 + R, y0, B, A, "lab-fill-b") + rect(x0, y0 + R, A, B, "lab-fill-b");
      out += rect(x0 + R, y0 + R, B, B, "lab-fill-c");
      if (R > 60) out += text(x0 + R / 2, y0 + R / 2 + 5, "(a − b)²", "lab-text lab-text-ok", "middle");
      if (B > 24 && R > 30) {
        out += text(x0 + R + B / 2, y0 + R / 2 + 5, "ab", "lab-text lab-text-b", "middle");
        out += text(x0 + R / 2, y0 + R + B / 2 + 5, "ab", "lab-text lab-text-b", "middle");
      }
      if (B > 24) out += text(x0 + R + B / 2, y0 + R + B / 2 + 5, "b²", "lab-text lab-text-c", "middle");
      out += text(x0 + R + B / 2, y0 + A + 16, "b", "lab-text-axis", "middle");
      out += text(x0 + A + 8, y0 + R + B / 2 + 4, "b", "lab-text-axis");
      lines.push(
        [`(${fmt(a)} − ${fmt(b)})² = ${fmt(a - b)}² = ${fmt((a - b) ** 2)}`, "lab-text lab-text-ok"],
        ["", ""],
        [`a² = ${sq(a)}`, "lab-text"],
        [`− 2ab = − ${fmt(2 * a * b)}`, "lab-text lab-text-b"],
        [`+ b² = + ${sq(b)}`, "lab-text lab-text-c"],
        [`= ${fmt(a * a - 2 * a * b + b * b)}`, "lab-text"],
        ["", ""],
        ["Zwei Streifen ab abschneiden:", "lab-text-small"],
        ["Die Ecke b² ist dann doppelt weg,", "lab-text-small"],
        ["also kommt sie einmal dazu: + b².", "lab-text-small"],
      );
      out += handle("b", x0 + R, y0 + R, "Ecke des Restquadrats: b ändern", "lab-handle lab-handle-b");
    } else {
      out += rect(x0, y0, A, A, "lab-fill-a");
      lines.push(
        [`(${fmt(a)} − ${fmt(b)})² = ${paren(a - b)}² = ${fmt((a - b) ** 2)}`, "lab-text lab-text-ok"],
        [`a² − 2ab + b² = ${fmt(a * a - 2 * a * b + b * b)}`, "lab-text"],
        ["", ""],
        ["Das Bild braucht a > b.", "lab-text-small lab-text-bad"],
        ["Die Formel gilt trotzdem.", "lab-text-small"],
      );
    }
    out += handle("a", x0 + A, y0 + A, "Ecke des Quadrats a²: a ändern", "lab-handle lab-handle-a");
  } else {
    // a² minus the corner b², cut into two rectangles; the lower one is laid to the right.
    const R = A - B;
    out += text(x0 + A / 2, y0 - 8, "a", "lab-text-axis", "middle");
    if (a > b) {
      out += rect(x0, y0, A, R, "lab-fill-a") + rect(x0, y0 + R, R, B, "lab-fill-b");
      out += rect(x0 + R, y0 + R, B, B, "lab-dashed");
      out += text(x0 + A + 8, y0 + R + B / 2 + 4, "b² weg", "lab-text-small");
      const y1 = y0 + A + 38;
      out += line(x0 + R / 2, y0 + A + 6, x0 + R / 2, y1 - 6, "lab-dashed");
      out += text(x0 + R / 2 + 8, y0 + A + 24, "Streifen umlegen", "lab-text-small");
      out += rect(x0, y1, A, R, "lab-fill-a") + rect(x0 + A, y1, B, R, "lab-fill-b");
      out += rect(x0, y1, A + B, R, "lab-side-ok");
      out += text(x0 + A / 2, y1 + R + 16, "a", "lab-text-axis", "middle") + text(x0 + A + B / 2, y1 + R + 16, "b", "lab-text-axis", "middle");
      out += text(x0 + A + B + 8, y1 + R / 2 + 4, "a − b", "lab-text-axis");
      lines.push(
        [`(${fmt(a)} + ${fmt(b)}) · (${fmt(a)} − ${fmt(b)})`, "lab-text"],
        [`= ${fmt(a + b)} · ${fmt(a - b)} = ${fmt((a + b) * (a - b))}`, "lab-text lab-text-ok"],
        ["", ""],
        [`a² − b² = ${sq(a)} − ${sq(b)} = ${fmt(a * a - b * b)}`, "lab-text"],
        ["", ""],
        ["Das L aus a² ohne b² wird", "lab-text-small"],
        ["zum Rechteck (a + b) · (a − b).", "lab-text-small"],
      );
      out += handle("b", x0 + R, y0 + R, "Ecke des weggenommenen Quadrats: b ändern", "lab-handle lab-handle-b");
    } else {
      out += rect(x0, y0, A, A, "lab-fill-a");
      lines.push(
        [`(${fmt(a)} + ${fmt(b)}) · ${paren(a - b)} = ${fmt((a + b) * (a - b))}`, "lab-text"],
        [`a² − b² = ${fmt(a * a - b * b)}`, "lab-text"],
        ["", ""],
        ["Das Bild braucht a > b.", "lab-text-small lab-text-bad"],
      );
    }
    out += handle("a", x0 + A, y0, "rechte obere Ecke: a ändern", "lab-handle lab-handle-a");
  }
  let ly = 66;
  for (const [content, cls] of lines) {
    if (content) out += text(300, ly, content, cls);
    ly += content ? 23 : 10;
  }
  out += "</svg>";
  return out;
}

/** The mean of the two coordinates of a dragged corner, in units of the picture. */
function cornerUnits(p: { x: number; y: number }, u: number): number {
  return ((p.x - SQ.x0) / u + (p.y - SQ.y0) / u) / 2;
}

// Placeholder drawings until the later labs of the stage are written.
const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const TERME_GLEICHUNGEN_VIEWS: Record<"like-terms" | "expand-products" | "binomial-squares" | "factorise" | "completing-square" | "extremum-problem" | "linear-equation" | "word-problem" | "inequality", LabView> = {
  "like-terms": { render: likeTerms },
  "expand-products": {
    render: expandProducts,
    handles: {
      x: { x: "x", drag: (p) => ({ x: ((p.x - RECT.x0) / RECT.u + (p.y - RECT.y0) / RECT.u) / 2 }) },
      p: { x: "p", drag: (p, v) => ({ p: (p.x - RECT.x0) / RECT.u - v.x }) },
      q: { y: "q", drag: (p, v) => ({ q: (p.y - RECT.y0) / RECT.u - v.x }) },
    },
  },
  "binomial-squares": {
    render: binomialSquares,
    handles: {
      a: {
        x: "a",
        drag: (p, v) => (v.mode === 2 ? { a: (p.x - SQ.x0) / SQ_UNIT[2] } : { a: cornerUnits(p, SQ_UNIT[v.mode]) }),
      },
      b: {
        x: "b",
        drag: (p, v) => (v.mode === 0 ? { b: cornerUnits(p, SQ_UNIT[0]) - v.a } : { b: v.a - cornerUnits(p, SQ_UNIT[v.mode]) }),
      },
    },
  },
  "factorise": placeholder,
  "completing-square": placeholder,
  "extremum-problem": placeholder,
  "linear-equation": placeholder,
  "word-problem": placeholder,
  "inequality": placeholder,
};
