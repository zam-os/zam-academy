import { fmt, MINUS, paren, quadratic, round, shifted, sum, vertexForm } from "../exercises/format";
import type { LabValues } from "../model/types";
import { circle, handle, type LabView, line, open, Plot, rect, text } from "./svg";

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

// ─── 4.4 Quadrate legen ─────────────────────────────────────────────────────

export interface TileFit {
  /** Equal groups the tiles fall into: A x²-tiles are `groups` squares of s² tiles each. */
  groups: number;
  s: number;
  /** The k of (sx + k)², or null when the strips cannot be split evenly. */
  k: number | null;
  /** Unit squares the target square(s) need, −1 when there is no target. */
  need: number;
  ok: boolean;
}

/**
 * Can A x²-tiles, B x-strips and C unit squares be laid as a square
 * (sx + k)², or, after ausklammern, as `groups` equal squares (x + k)²?
 */
export function tileFit(A: number, B: number, C: number): TileFit {
  const root = Math.round(Math.sqrt(A));
  const s = root * root === A ? root : 1;
  const groups = A / (s * s);
  const per = 2 * s * groups;
  const k = B % per === 0 ? B / per : null;
  const need = k === null ? -1 : groups * k * k;
  return { groups, s, k, need, ok: k !== null && C === need };
}

/** The product form of a fitting tile set: "(2x + 3)²", "2(x + 3)²", "x²". */
export function tileFactor(fit: TileFit): string {
  const sx = fit.s === 1 ? "x" : `${fit.s}x`;
  const k = fit.k ?? 0;
  if (fit.groups === 1) return k === 0 ? (fit.s === 1 ? "x²" : `(${sx})²`) : `(${sx} + ${k})²`;
  return k === 0 ? `${fit.groups}x²` : `${fit.groups}(x + ${k})²`;
}

const TILE = { X: 62, U: 15 };

function factorise(v: LabValues): string {
  const { A, B, C } = v;
  const fit = tileFit(A, B, C);
  const { X, U } = TILE;
  let out = open("Algebra-Kacheln: x²-Quadrate, x-Streifen und Einerquadrate werden zu einem Quadrat gelegt");
  out += text(16, 27, `${quadratic(A, B, C)} als Kacheln`, "lab-text lab-text-big");
  const lines: Array<[string, string]> = [];
  if (fit.k !== null) {
    const { s, k, groups } = fit;
    const side = s * X + k * U;
    const extra = Math.max(0, C - fit.need);
    const extraRows = Math.ceil(extra / 18);
    const width = Math.max(groups * side + (groups - 1) * 14, extra > 0 ? Math.min(extra, 18) * (U + 3) : 0);
    const height = side + (extraRows ? 26 + extraRows * (U + 3) : 0);
    const f = Math.min(1, 284 / width, 262 / height);
    const y0 = 50;
    let placed = 0;
    for (let g = 0; g < groups; g++) {
      const ox = 18 + g * (side + 14) * f;
      for (let i = 0; i < s; i++) {
        for (let j = 0; j < s; j++) {
          out += rect(ox + i * X * f, y0 + j * X * f, X * f, X * f, "lab-fill-a");
          if (X * f > 26) out += text(ox + (i + 0.5) * X * f, y0 + (j + 0.5) * X * f + 5, "x²", "lab-text lab-text-a", "middle");
        }
        for (let c = 0; c < k; c++) out += rect(ox + (s * X + c * U) * f, y0 + i * X * f, U * f, X * f, "lab-fill-b");
        for (let r = 0; r < k; r++) out += rect(ox + i * X * f, y0 + (s * X + r * U) * f, X * f, U * f, "lab-fill-b");
      }
      for (let r = 0; r < k; r++) {
        for (let c = 0; c < k; c++) {
          const filled = placed < C;
          if (filled) placed++;
          out += rect(ox + (s * X + c * U) * f, y0 + (s * X + r * U) * f, U * f, U * f, filled ? "lab-fill-c" : "lab-target");
        }
      }
      out += rect(ox, y0, side * f, side * f, fit.ok ? "lab-side-ok" : "lab-ink");
    }
    if (extra > 0) {
      const ey = y0 + side * f + 22;
      out += text(18, ey - 6, `${extra} Einerquadrat${extra === 1 ? "" : "e"} zu viel:`, "lab-text-small lab-text-bad");
      for (let n = 0; n < extra; n++) out += rect(18 + (n % 18) * (U + 3) * f, ey + Math.floor(n / 18) * (U + 3) * f, U * f, U * f, "lab-fill-c");
    }
    const target = tileFactor({ ...fit, ok: true });
    lines.push([`Ziel: ${target}`, "lab-text"], [`= ${quadratic(A, B, fit.need)}`, "lab-text"], ["", ""], [`Einerquadrate: ${C} von ${fit.need}`, "lab-text"]);
    if (fit.ok) {
      lines.push(["Vollständiges Quadrat!", "lab-text lab-text-ok"], ["", ""]);
      if (groups > 1) lines.push([`Ausklammern: ${groups}(${quadratic(1, B / groups, C / groups)})`, "lab-text-small"]);
      lines.push([`= ${target}`, "lab-text lab-text-ok lab-text-big"]);
      if (groups === 1 && s > 1 && k > 0 && k % s === 0) lines.push([`= ${s * s}(x + ${k / s})²`, "lab-text lab-text-ok lab-text-big"]);
    } else {
      lines.push([C < fit.need ? `Es fehlen ${fit.need - C}.` : `${C - fit.need} zu viel.`, "lab-text lab-text-bad"]);
      lines.push(["", ""], [`Zu ${B} Streifen gehören`, "lab-text-small"], [`genau ${fit.need} Einerquadrate.`, "lab-text-small"]);
    }
  } else {
    // No square fits: the tiles lie loose, sorted by kind.
    const { s, groups } = fit;
    const per = 2 * s * groups;
    const rowsA = Math.ceil(A / 5);
    const rowsB = Math.ceil(B / 12);
    const rowsC = Math.ceil(C / 12);
    const width = Math.max(Math.min(A, 5) * (X + 6), Math.min(B, 12) * (U + 6), Math.min(C, 12) * (U + 6));
    const height = rowsA * (X + 6) + 10 + rowsB * (X + 6) + 10 + rowsC * (U + 6);
    const f = Math.min(1, 284 / width, 268 / height);
    let y = 52;
    for (let n = 0; n < A; n++) {
      const [tx, ty] = [18 + (n % 5) * (X + 6) * f, y + Math.floor(n / 5) * (X + 6) * f];
      out += rect(tx, ty, X * f, X * f, "lab-fill-a");
      if (X * f > 26) out += text(tx + (X * f) / 2, ty + (X * f) / 2 + 5, "x²", "lab-text lab-text-a", "middle");
    }
    y += (rowsA * (X + 6) + 10) * f;
    for (let n = 0; n < B; n++) out += rect(18 + (n % 12) * (U + 6) * f, y + Math.floor(n / 12) * (X + 6) * f, U * f, X * f, "lab-fill-b");
    y += (rowsB * (X + 6) + 10) * f;
    for (let n = 0; n < C; n++) out += rect(18 + (n % 12) * (U + 6) * f, y + Math.floor(n / 12) * (U + 6) * f, U * f, U * f, "lab-fill-c");
    const form = groups === 1 ? `(${s === 1 ? "x" : `${s}x`} + k)²` : `${groups}(x + k)²`;
    lines.push(["Kein Quadrat möglich:", "lab-text lab-text-bad"], ["", ""], [`${form} hat ${per}k x-Streifen.`, "lab-text-small"], [`${B} ist kein Vielfaches von ${per}.`, "lab-text-small"]);
  }
  let ly = 56;
  for (const [content, cls] of lines) {
    if (content) out += text(318, ly, content, cls);
    ly += content ? 23 : 9;
  }
  out += "</svg>";
  return out;
}

// ─── 4.5 Das Quadrat entscheidet ────────────────────────────────────────────

/** T(x) = ax² + bx + c = a(x − d)² + e. */
export function completedSquare(v: LabValues): { d: number; e: number } {
  return { d: -v.b / (2 * v.a), e: v.c - (v.b * v.b) / (4 * v.a) };
}

export const termValue = (v: LabValues, x: number) => v.a * x * x + v.b * x + v.c;

/** The factor in front of a bracket: "", "−", "2", "−0,5". */
function factorText(a: number): string {
  return a === 1 ? "" : a === -1 ? MINUS : fmt(a);
}

/** The lines of the quadratische Ergänzung of ax² + bx + c, plain text. */
export function completionLines(a: number, b: number, c: number): string[] {
  const d = -b / (2 * a);
  const e = c - (b * b) / (4 * a);
  const h = Math.abs(b / (2 * a));
  const cText = c === 0 ? "" : c > 0 ? ` + ${fmt(c, 3)}` : ` ${MINUS} ${fmt(-c, 3)}`;
  const finalForm = vertexForm(a, d, e, 4);
  if (b === 0) return [`= ${finalForm}`, "kein x-Glied: nichts zu ergänzen"];
  const inner = quadratic(1, b / a, 0, 4);
  const lines: string[] = [];
  if (a === 1) {
    lines.push(`= ${inner} + ${fmt(h, 3)}² ${MINUS} ${fmt(h, 3)}²${cText}`);
  } else {
    lines.push(`= ${factorText(a)}[${inner}]${cText}`);
    lines.push(`= ${factorText(a)}[${shifted(d, 4)}² ${MINUS} ${fmt(h * h, 4)}]${cText}`);
  }
  lines.push(`= ${finalForm}`);
  return lines;
}

const CS_PLOT = { x: 278, y: 18, w: 230, h: 196 };

/** The plot of the value table: x from −6,5 to 6,5, y over the values shown. */
function csPlot(v: LabValues): Plot {
  const xs = [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, v.x];
  const ys = [...xs.map((x) => termValue(v, x)), completedSquare(v).e];
  const lo = Math.min(...ys);
  const hi = Math.max(...ys);
  const pad = Math.max(1, (hi - lo) * 0.08);
  return new Plot(-6.6, 6.6, lo - pad, hi + pad, CS_PLOT);
}

function completingSquareView(v: LabValues): string {
  const { a, b, c, x } = v;
  const { d, e } = completedSquare(v);
  const T = termValue(v, x);
  const sq = (x - d) ** 2;
  let out = open("Quadratische Ergänzung: das Quadrat (x − d)² als Fläche, dazu die Werte des Terms als Punkte");
  out += text(14, 27, `T(x) = ${quadratic(a, b, c, 3)}`, "lab-text lab-text-big");
  completionLines(a, b, c).forEach((content, i) => {
    out += text(30, 52 + i * 21, content, "lab-text");
  });
  const top = 52 + completionLines(a, b, c).length * 21;
  out += text(14, top + 4, a > 0 ? `Kleinster Wert ${fmt(e, 3)} für x = ${fmt(d, 3)}` : `Größter Wert ${fmt(e, 3)} für x = ${fmt(d, 3)}`, "lab-text lab-text-ok");
  // The square (x − d)², drawn with its side |x − d|.
  const u = 12;
  const S = Math.abs(x - d) * u;
  const sx = 24;
  const sy = top + 30;
  const label = `${shifted(d, 3)}²`;
  if (S > 0) {
    out += rect(sx, sy, S, S, "lab-fill-a");
    if (S >= 64) out += text(sx + S / 2, sy + S / 2 + 5, label, "lab-text lab-text-a", "middle");
    out += text(sx + S + 8, sy + 14, `${S >= 64 ? "" : `${label} `}= ${fmt(sq, 3)}`, "lab-text lab-text-a");
    out += text(sx + S / 2, sy - 5, `|x ${MINUS} d| = ${fmt(Math.abs(x - d), 3)}`, "lab-text-small", "middle");
  } else {
    out += circle(sx + 3, sy + 4, 4, "lab-point-ok");
    out += text(sx + 14, sy + 9, `${label} = 0: Das Quadrat ist weg.`, "lab-text lab-text-ok");
  }
  out += text(14, 330, `T(${fmt(x)}) = ${factorText(a) === "" ? "" : `${paren(a)} · `}${fmt(sq, 3)}${e < 0 ? ` ${MINUS} ${fmt(-e, 3)}` : ` + ${fmt(e, 3)}`} = ${fmt(T, 3)}`, "lab-text");

  // The value table as points, the current x highlighted.
  const plot = csPlot(v);
  const { box } = plot;
  out += rect(box.x, box.y, box.w, box.h, "lab-plot-bg");
  if (plot.ymin < 0 && plot.ymax > 0) out += line(box.x, plot.Y(0), box.x + box.w, plot.Y(0), "lab-axis");
  out += line(plot.X(0), box.y, plot.X(0), box.y + box.h, "lab-axis");
  out += line(plot.X(d), box.y, plot.X(d), box.y + box.h, "lab-dashed");
  // the label of x = d where the points are not: at the top for a smallest value, at the bottom for a greatest
  out += text(plot.X(d) + (d > 3 ? -4 : 4), a > 0 ? box.y + 12 : box.y + box.h - 6, `x = ${fmt(d, 3)}`, "lab-text-small", d > 3 ? "end" : "start");
  for (let k = -6; k <= 6; k++) {
    out += circle(plot.X(k), plot.Y(termValue(v, k)), 3.2, "lab-point-a");
    if (k % 2 === 0 && k !== 0) out += text(plot.X(k), box.y + box.h + 12, fmt(k), "lab-text-tick", "middle");
  }
  out += text(box.x - 4, box.y + 10, fmt(plot.ymax, 0), "lab-text-tick", "end");
  out += text(box.x - 4, box.y + box.h, fmt(plot.ymin, 0), "lab-text-tick", "end");
  const P = plot.P(x, T);
  out += line(P.x, P.y, P.x, plot.Y(e), "lab-thin");
  out += circle(plot.X(d), plot.Y(e), 4.5, "lab-point-ok");
  // A small value table around d.
  const ty = 240;
  const cw = 29;
  out += rect(box.x, ty, cw, 22, "lab-cell-sum") + rect(box.x, ty + 22, cw, 22, "lab-cell-sum");
  out += text(box.x + cw / 2, ty + 15, "x", "lab-text-tick", "middle") + text(box.x + cw / 2, ty + 37, "T(x)", "lab-text-tick", "middle");
  for (let k = -3; k <= 3; k++) {
    const cx = box.x + (k + 4) * cw;
    const hit = k === 0;
    out += rect(cx, ty, cw, 22, hit ? "lab-fill-ok" : "lab-cell") + rect(cx, ty + 22, cw, 22, hit ? "lab-fill-ok" : "lab-cell");
    out += text(cx + cw / 2, ty + 15, fmt(d + k, 2), "lab-text-tick", "middle");
    out += text(cx + cw / 2, ty + 37, fmt(termValue(v, d + k), 2), "lab-text-tick", "middle");
  }
  out += text(box.x, ty + 62, "Gleiche Werte liegen symmetrisch zu x = d.", "lab-text-small");
  out += handle("x", P.x, P.y, "Punkt beim eingestellten x: x ändern");
  out += "</svg>";
  return out;
}

// ─── 4.6 Das beste Rechteck ─────────────────────────────────────────────────

export interface ExtremumModel {
  title: string;
  unit: string;
  /** x must lie in ]0; upper[. */
  upper: number;
  area: (x: number) => number;
  xBest: number;
  best: number;
  max: boolean;
  steps: string[];
}

export const EXTREMUM_MODELS: ExtremumModel[] = [
  {
    title: "Rechteck 8 cm × 5 cm: Länge − x, Breite + 2x",
    unit: "cm",
    upper: 8,
    area: (x) => (8 - x) * (5 + 2 * x),
    xBest: 2.75,
    best: 55.125,
    max: true,
    steps: ["A(x) = (8 − x)(5 + 2x)", "= −2x² + 11x + 40", "= −2[x² − 5,5x] + 40", "= −2[(x − 2,75)² − 7,5625] + 40", "= −2(x − 2,75)² + 55,125", "größter Wert 55,125 cm² für x = 2,75"],
  },
  {
    title: "40 m Zaun an einer Mauer",
    unit: "m",
    upper: 20,
    area: (x) => x * (40 - 2 * x),
    xBest: 10,
    best: 200,
    max: true,
    steps: ["A(x) = x · (40 − 2x)", "= −2x² + 40x", "= −2[x² − 20x]", "= −2[(x − 10)² − 100]", "= −2(x − 10)² + 200", "größter Wert 200 m² für x = 10"],
  },
  {
    title: "Quadrat 8 cm: inneres Quadrat",
    unit: "cm",
    upper: 8,
    area: (x) => 64 - 2 * x * (8 - x),
    xBest: 4,
    best: 32,
    max: false,
    steps: ["A(x) = 64 − 4 · ½ · x · (8 − x)", "= 2x² − 16x + 64", "= 2[x² − 8x] + 64", "= 2[(x − 4)² − 16] + 64", "= 2(x − 4)² + 32", "kleinster Wert 32 cm² für x = 4"],
  },
  {
    title: "Rechtecke mit 20 cm Umfang",
    unit: "cm",
    upper: 10,
    area: (x) => x * (10 - x),
    xBest: 5,
    best: 25,
    max: true,
    steps: ["A(x) = x · (10 − x)", "= −x² + 10x", "= −[x² − 10x]", "= −[(x − 5)² − 25]", "= −(x − 5)² + 25", "größter Wert 25 cm² für x = 5"],
  },
];

export const inDomain = (v: LabValues) => v.x > 0 && v.x < EXTREMUM_MODELS[v.mode].upper;

/** The side lengths of the figure, as the readout and the drawing name them. */
export function extremumSides(v: LabValues): string {
  const { x, mode } = v;
  if (!inDomain(v)) return `x = ${fmt(x)} liegt nicht in ]0; ${EXTREMUM_MODELS[mode].upper}[`;
  if (mode === 0) return `${fmt(8 - x)} cm × ${fmt(5 + 2 * x)} cm`;
  if (mode === 1) return `x = ${fmt(x)} m, Länge ${fmt(40 - 2 * x)} m`;
  if (mode === 2) return `Katheten ${fmt(x)} cm und ${fmt(8 - x)} cm`;
  return `${fmt(x)} cm × ${fmt(10 - x)} cm`;
}

const EX = { x0: 44, y0: 60 };
const EX_SCALE = [11.5, 6.2, 29, 22];
const EX_PLOT = { x: 318, y: 46, w: 188, h: 150 };

function extremumPlot(mode: number): Plot {
  const model = EXTREMUM_MODELS[mode];
  const top = model.max ? model.best : model.area(0);
  return new Plot(0, model.upper, 0, top * 1.15, EX_PLOT);
}

/** Where the handle of the figure sits, and the x a drag to a point gives. */
function figureHandle(v: LabValues): { x: number; y: number } {
  const { x0, y0 } = EX;
  const s = EX_SCALE[v.mode];
  const x = v.x;
  if (v.mode === 0) return { x: x0 + (8 - x) * s, y: y0 + ((5 + 2 * x) * s) / 2 };
  if (v.mode === 1) return { x: x0 + (40 - 2 * x) * s, y: y0 + x * s };
  if (v.mode === 2) return { x: x0 + x * s, y: y0 };
  return { x: x0 + x * s, y: y0 + ((10 - x) * s) / 2 };
}

function figureDrag(p: { x: number; y: number }, v: LabValues): number {
  const { x0, y0 } = EX;
  const s = EX_SCALE[v.mode];
  if (v.mode === 0) return 8 - (p.x - x0) / s;
  if (v.mode === 1) return (p.y - y0) / s;
  return (p.x - x0) / s;
}

function extremumProblem(v: LabValues): string {
  const { mode, x } = v;
  const model = EXTREMUM_MODELS[mode];
  const s = EX_SCALE[mode];
  const { x0, y0 } = EX;
  const inside = inDomain(v);
  const A = model.area(x);
  const u = model.unit;
  let out = open("Ein Extremwertproblem: Die Figur ändert sich mit x, rechts der Flächeninhalt für viele x");
  out += text(16, 27, model.title, "lab-text lab-text-big");
  if (!inside) {
    out += text(x0, y0 + 40, `x = ${fmt(x)} liegt nicht in ]0; ${model.upper}[:`, "lab-text lab-text-bad");
    out += text(x0, y0 + 62, x <= 0 ? "Für x = 0 ändert sich nichts." : "Eine Seite wäre nicht mehr positiv.", "lab-text lab-text-bad");
  } else if (mode === 0) {
    const w = (8 - x) * s;
    const h = (5 + 2 * x) * s;
    out += rect(x0, y0, w, h, "lab-fill-ok");
    out += rect(x0, y0, 8 * s, 5 * s, "lab-dashed");
    out += text(x0, y0 - 6, "gestrichelt: das alte Rechteck 8 cm × 5 cm", "lab-text-small");
    out += text(x0 + w / 2, y0 + h + 16, `${fmt(8 - x)} cm`, "lab-text", "middle");
    out += text(x0 + Math.max(w, 8 * s) + 14, y0 + Math.max(h / 2, 5 * s + 16), `${fmt(5 + 2 * x)} cm`, "lab-text");
  } else if (mode === 1) {
    out += rect(x0 - 6, y0 - 10, 40 * s + 12, 10, "lab-shape-2");
    out += text(x0 + 20 * s, y0 - 14, "Mauer", "lab-text-small", "middle");
    const w = (40 - 2 * x) * s;
    const h = x * s;
    out += rect(x0, y0, w, h, "lab-fill-ok");
    out += `<path d="M${x0} ${y0} V${(y0 + h).toFixed(1)} H${(x0 + w).toFixed(1)} V${y0}" class="lab-fence" />`;
    out += text(x0 + w / 2, y0 + h + 18, `${fmt(40 - 2 * x)} m`, "lab-text", "middle");
    out += text(x0, y0 + h + 38, `Seiten senkrecht zur Mauer: x = ${fmt(x)} m`, "lab-text-small");
  } else if (mode === 2) {
    const P = (px: number, py: number) => ({ x: x0 + px * s, y: y0 + py * s });
    const [Aa, Bb, Cc, Dd] = [P(0, 0), P(8, 0), P(8, 8), P(0, 8)];
    const [P1, P2, P3, P4] = [P(x, 0), P(8, x), P(8 - x, 8), P(0, 8 - x)];
    const poly = (pts: Array<{ x: number; y: number }>, cls: string) => `<polygon points="${pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}" class="${cls}" />`;
    out += poly([Aa, P1, P4], "lab-fill-b") + poly([Bb, P2, P1], "lab-fill-b") + poly([Cc, P3, P2], "lab-fill-b") + poly([Dd, P4, P3], "lab-fill-b");
    out += poly([P1, P2, P3, P4], "lab-fill-ok");
    out += rect(x0, y0, 8 * s, 8 * s, "lab-ink");
    out += text((Aa.x + P1.x) / 2, y0 - 6, "x", "lab-text-axis", "middle");
    out += text(x0 - 6, (Aa.y + P4.y) / 2 + 4, "8 − x", "lab-text-axis", "end");
  } else {
    const w = x * s;
    const h = (10 - x) * s;
    out += rect(x0, y0, w, h, "lab-fill-ok");
    out += text(x0 + w / 2, y0 + h + 16, `${fmt(x)} cm`, "lab-text", "middle");
    // the height label right of the rectangle, or under it when the rectangle is too wide
    if (x0 + w + 16 + 56 < 306) out += text(x0 + w + 16, y0 + h / 2 + 4, `${fmt(10 - x)} cm`, "lab-text");
    else out += text(x0 + w / 2, y0 + h + 34, `Höhe ${fmt(10 - x)} cm`, "lab-text", "middle");
  }
  if (inside) out += text(16, 332, `A = ${fmt(A, 4)} ${u}²`, "lab-text lab-text-ok lab-text-big");
  // A(x) for many x as points.
  const plot = extremumPlot(mode);
  const { box } = plot;
  out += rect(box.x, box.y, box.w, box.h, "lab-plot-bg");
  out += line(box.x, box.y + box.h, box.x + box.w, box.y + box.h, "lab-axis") + line(box.x, box.y, box.x, box.y + box.h, "lab-axis");
  out += text(box.x, box.y - 8, `A in ${u}²`, "lab-text-axis");
  out += text(box.x + box.w, box.y + box.h + 26, `x in ${u}`, "lab-text-axis", "end");
  for (const t of [0, model.upper / 2, model.upper]) out += text(plot.X(t), box.y + box.h + 12, fmt(t), "lab-text-tick", "middle");
  out += text(box.x - 4, plot.Y(plot.ymax / 1.15) + 4, fmt(plot.ymax / 1.15), "lab-text-tick", "end");
  const stepX = model.upper / 32;
  for (let i = 1; i < 32; i++) out += circle(plot.X(i * stepX), plot.Y(model.area(i * stepX)), 1.8, "lab-dot-small");
  if (inside) {
    const P = plot.P(x, A);
    out += line(P.x, P.y, P.x, box.y + box.h, "lab-dashed");
    out += handle("plot", P.x, P.y, "Punkt auf A(x): x ändern", "lab-handle lab-handle-b");
    const H = figureHandle(v);
    out += handle("figure", H.x, H.y, "Figur verändern: x ändern");
  }
  // the calculation, when asked for
  const ly = 238;
  if (v.show === 1) {
    model.steps.forEach((content, i) => {
      out += text(box.x - 12, ly + i * 17, content, i === model.steps.length - 1 ? "lab-text-small lab-text-ok" : "lab-text-small");
    });
  } else {
    out += text(box.x - 12, ly, "Die Rechnung ist verdeckt.", "lab-text-small");
    out += text(box.x - 12, ly + 17, "Finde das beste x erst selbst.", "lab-text-small");
  }
  out += "</svg>";
  return out;
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
  "factorise": { render: factorise },
  "completing-square": {
    render: completingSquareView,
    handles: {
      x: { x: "x", drag: (p, v) => ({ x: csPlot(v).invX(p.x) }) },
    },
  },
  "extremum-problem": {
    render: extremumProblem,
    handles: {
      plot: { x: "x", drag: (p, v) => ({ x: extremumPlot(v.mode).invX(p.x) }) },
      figure: { x: "x", drag: (p, v) => ({ x: figureDrag(p, v) }) },
    },
  },
  "linear-equation": placeholder,
  "word-problem": placeholder,
  "inequality": placeholder,
};
