import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { circle, handle, type LabView, line, open, rect, text } from "./svg";

/** Probabilities of the four fields from P(A), P_A(B) and P_Ā(B). */
export interface Fields {
  ab: number;
  anb: number;
  nab: number;
  nanb: number;
  a: number;
  b: number;
}

export function fieldsOf(v: LabValues): Fields {
  const ab = v.pA * v.pBA;
  const anb = v.pA * (1 - v.pBA);
  const nab = (1 - v.pA) * v.pBnA;
  const nanb = (1 - v.pA) * (1 - v.pBnA);
  return { ab, anb, nab, nanb, a: v.pA, b: ab + nab };
}

/** P_B(A), or NaN when P(B) = 0. */
export function pAgivenB(v: LabValues): number {
  const f = fieldsOf(v);
  return f.b < 1e-12 ? Number.NaN : f.ab / f.b;
}

export function independent(v: LabValues): boolean {
  return Math.abs(v.pBA - v.pBnA) < 1e-9;
}

/** A probability with up to four decimals, the way the table shows it. */
export function prob(value: number): string {
  return Number.isFinite(value) ? fmt(value, 4) : "–";
}

// The unit square on the left, the Vierfeldertafel on the right.
const SQ = { x: 30, y: 46, s: 230 };
const TABLE = { x: 284, y: 70, cw: 60, rh: 46, lw: 46 };

function areaSquare(v: LabValues, highlight: "ab" | "b" | "none"): string {
  const { x, y, s } = SQ;
  const wA = s * v.pA;
  const hAB = s * v.pBA;
  const hNAB = s * v.pBnA;
  let out = "";
  // A ∩ B bottom-left, A ∩ B̄ top-left, Ā ∩ B bottom-right, Ā ∩ B̄ top-right.
  out += rect(x, y + s - hAB, wA, hAB, highlight === "none" ? "lab-fill-a" : "lab-fill-ok");
  out += rect(x, y, wA, s - hAB, "lab-cell");
  out += rect(x + wA, y + s - hNAB, s - wA, hNAB, highlight === "b" ? "lab-fill-ok" : "lab-fill-b");
  out += rect(x + wA, y, s - wA, s - hNAB, "lab-cell");
  out += text(x + wA / 2, y + s + 18, "A", "lab-text lab-text-a", "middle");
  out += text(x + wA + (s - wA) / 2, y + s + 18, "Ā", "lab-text", "middle");
  out += text(x - 8, y + s - 6, "B", "lab-text-small", "end");
  out += text(x + wA / 2, y + s - hAB / 2 + 4, hAB > 18 && wA > 40 ? fmt(v.pA * v.pBA, 3) : "", "lab-text-small", "middle");
  out += text(x + wA + (s - wA) / 2, y + s - hNAB / 2 + 4, hNAB > 18 && s - wA > 40 ? fmt((1 - v.pA) * v.pBnA, 3) : "", "lab-text-small", "middle");
  out += text(x + s / 2, y - 14, "Einheitsquadrat: Fläche = Wahrscheinlichkeit", "lab-text-small", "middle");
  return out;
}

function fourTable(v: LabValues): string {
  const f = fieldsOf(v);
  const { x, y, cw, rh } = TABLE;
  const cells = [
    ["", "B", "B̄", "Summe"],
    ["A", prob(f.ab), prob(f.anb), prob(f.a)],
    ["Ā", prob(f.nab), prob(f.nanb), prob(1 - f.a)],
    ["Summe", prob(f.b), prob(1 - f.b), "1"],
  ];
  let out = "";
  cells.forEach((row, r) => {
    row.forEach((cell, c) => {
      const cx = x + (c === 0 ? 0 : TABLE.lw + (c - 1) * cw);
      const w = c === 0 ? TABLE.lw : cw;
      const header = r === 0 || c === 0;
      out += rect(cx, y + r * rh * 0.62, w, rh * 0.62, header || r === 3 || c === 3 ? "lab-cell-sum" : "lab-cell");
      out += text(cx + w / 2, y + r * rh * 0.62 + rh * 0.4, cell, "lab-text-small", "middle");
    });
  });
  return out;
}

function areaHandles(v: LabValues): string {
  const { x, y, s } = SQ;
  const wA = s * v.pA;
  return (
    handle("A", x + wA, y + s + 2, "Trennlinie P(A)") +
    handle("BA", x + wA / 2, y + s - s * v.pBA, "Höhe P_A(B)", "lab-handle lab-handle-b") +
    handle("BN", x + wA + (s - wA) / 2, y + s - s * v.pBnA, "Höhe P_Ā(B)", "lab-handle lab-handle-b")
  );
}

function areaDiagram(v: LabValues): string {
  const f = fieldsOf(v);
  let out = open("Einheitsquadrat und Vierfeldertafel zu zwei Ereignissen A und B");
  out += areaSquare(v, "none") + fourTable(v);
  const { x, y } = TABLE;
  out += text(x, y + 150, `P_B(A) = ${prob(f.ab)} : ${prob(f.b)} = ${prob(pAgivenB(v))}`, "lab-text lab-text-a");
  out += text(x, y + 172, `P_A(B) = ${prob(v.pBA)}`, "lab-text");
  out += text(x, y + 194, "Bedingung B: Nur die beiden farbigen", "lab-text-small");
  out += text(x, y + 210, "Flächen zählen, zusammen P(B).", "lab-text-small");
  out += areaHandles(v);
  return out + "</svg>";
}

const AREA_HANDLES = {
  A: { x: "pA", drag: (p: { x: number }) => ({ pA: (p.x - SQ.x) / SQ.s }) },
  BA: { y: "pBA", drag: (p: { y: number }) => ({ pBA: (SQ.y + SQ.s - p.y) / SQ.s }) },
  BN: { y: "pBnA", drag: (p: { y: number }) => ({ pBnA: (SQ.y + SQ.s - p.y) / SQ.s }) },
};

// ─── 3.2 Diagnosetest mit natürlichen Häufigkeiten ─────────────────────────

export interface Diagnosis {
  sick: number;
  healthy: number;
  truePos: number;
  falseNeg: number;
  falsePos: number;
  trueNeg: number;
  ppv: number;
  npv: number;
}

/** Natural frequencies in a population of 10 000 and the predictive values. */
export function diagnose(v: LabValues, population = 10000): Diagnosis {
  const sick = population * v.prev;
  const healthy = population - sick;
  const truePos = sick * v.sens;
  const falseNeg = sick - truePos;
  const trueNeg = healthy * v.spec;
  const falsePos = healthy - trueNeg;
  const pos = truePos + falsePos;
  const neg = trueNeg + falseNeg;
  return {
    sick,
    healthy,
    truePos,
    falseNeg,
    falsePos,
    trueNeg,
    ppv: pos > 0 ? truePos / pos : 0,
    npv: neg > 0 ? trueNeg / neg : 0,
  };
}

function diagnosticTest(v: LabValues): string {
  const d = diagnose(v);
  let out = open("Baumdiagramm mit natürlichen Häufigkeiten für 10 000 getestete Personen");
  const root = { x: 70, y: 170 };
  const sick = { x: 210, y: 90 };
  const healthy = { x: 210, y: 250 };
  const leaves = [
    { x: 360, y: 50, label: "positiv", n: d.truePos, cls: "lab-dot-tp" },
    { x: 360, y: 130, label: "negativ", n: d.falseNeg, cls: "lab-dot-fn" },
    { x: 360, y: 210, label: "positiv", n: d.falsePos, cls: "lab-dot-fp" },
    { x: 360, y: 290, label: "negativ", n: d.trueNeg, cls: "lab-dot-tn" },
  ];
  out += line(root.x, root.y, sick.x - 52, sick.y, "lab-thin") + line(root.x, root.y, healthy.x - 58, healthy.y, "lab-thin");
  for (const [i, leaf] of leaves.entries()) {
    const parent = i < 2 ? sick : healthy;
    out += line(parent.x + 52, parent.y, leaf.x - 10, leaf.y, leaf.label === "positiv" ? "lab-side-a" : "lab-thin");
    out += circle(leaf.x, leaf.y, 6, leaf.cls);
    out += text(leaf.x + 12, leaf.y + 5, `${leaf.label}: ${fmt(leaf.n, 1)}`, "lab-text");
  }
  out += text(root.x - 4, root.y + 5, "10 000", "lab-text lab-text-big", "end");
  out += rect(sick.x - 52, sick.y - 13, 104, 24, "lab-panel", 'rx="8"') + text(sick.x, sick.y + 5, `krank ${fmt(d.sick, 1)}`, "lab-text lab-text-a", "middle");
  out += rect(healthy.x - 58, healthy.y - 13, 116, 24, "lab-panel", 'rx="8"') + text(healthy.x, healthy.y + 5, `gesund ${fmt(d.healthy, 1)}`, "lab-text", "middle");
  out += text(130, 118, fmt(v.prev, 3), "lab-text-small", "middle");
  out += text(130, 232, fmt(1 - v.prev, 3), "lab-text-small", "middle");
  out += text(305, 58, fmt(v.sens, 2), "lab-text-small", "middle");
  out += text(305, 300, fmt(v.spec, 2), "lab-text-small", "middle");
  out += rect(20, 10, 300, 26, "lab-panel", 'rx="8"');
  out += text(30, 28, `P_T(K) = ${fmt(d.truePos, 1)} : ${fmt(d.truePos + d.falsePos, 1)} ≈ ${fmt(d.ppv, 3)}`, "lab-text lab-text-a");
  return out + "</svg>";
}

// ─── 3.3 Stochastische Unabhängigkeit ──────────────────────────────────────

function independence(v: LabValues): string {
  const f = fieldsOf(v);
  const indep = independent(v);
  let out = open("Einheitsquadrat zu zwei Ereignissen: Bei Unabhängigkeit sind beide B-Flächen gleich hoch");
  out += areaSquare(v, "b") + fourTable(v);
  const { x, y } = TABLE;
  out += text(x, y + 150, `P(A) · P(B) = ${prob(f.a * f.b)}`, "lab-text");
  out += text(x, y + 172, `P(A ∩ B) = ${prob(f.ab)}`, "lab-text lab-text-a");
  out += text(x, y + 196, indep ? "gleich: A und B sind unabhängig" : "verschieden: A und B sind abhängig", indep ? "lab-text lab-text-ok" : "lab-text lab-text-bad");
  if (indep) out += line(SQ.x, SQ.y + SQ.s - SQ.s * v.pBA, SQ.x + SQ.s, SQ.y + SQ.s - SQ.s * v.pBA, "lab-target");
  out += areaHandles(v);
  return out + "</svg>";
}

// ─── 3.4 Daten kritisch hinterfragen: das Simpson-Paradoxon ────────────────

export function overallRate(v: LabValues, k: 1 | 2): number {
  return k === 1 ? (1 - v.s1) * v.r1l + v.s1 * v.r1s : (1 - v.s2) * v.r2l + v.s2 * v.r2s;
}

/** True when clinic 1 is better than clinic 2 in both groups. */
export function betterInBoth(v: LabValues): boolean {
  return v.r1l > v.r2l + 1e-9 && v.r1s > v.r2s + 1e-9;
}

const BARS = { y0: 290, h: 220, w: 200, gap: 50, x0: 40 };

function clinicBars(v: LabValues, k: 1 | 2): string {
  const { y0, h, w, gap, x0 } = BARS;
  const x = x0 + (k - 1) * (w + gap);
  const s = k === 1 ? v.s1 : v.s2;
  const rl = k === 1 ? v.r1l : v.r2l;
  const rs = k === 1 ? v.r1s : v.r2s;
  // Severe cases on the left (width = their share), mild ones on the right.
  const ws = w * s;
  let out = "";
  out += rect(x, y0 - h, w, h, "lab-cell");
  out += rect(x, y0 - h * rs, ws, h * rs, "lab-fill-b");
  out += rect(x + ws, y0 - h * rl, w - ws, h * rl, "lab-fill-a");
  const o = overallRate(v, k);
  out += line(x - 6, y0 - h * o, x + w + 6, y0 - h * o, "lab-side-c");
  out += text(x + w / 2, y0 + 18, `Klinik ${k}: insgesamt ${fmt(o * 100, 1)} %`, "lab-text", "middle");
  if (ws > 30) out += text(x + ws / 2, y0 - 6, "schwer", "lab-text-small", "middle");
  if (w - ws > 30) out += text(x + ws + (w - ws) / 2, y0 - 6, "leicht", "lab-text-small", "middle");
  return out;
}

function simpson(v: LabValues): string {
  const { y0, h, w, gap, x0 } = BARS;
  let out = open("Heilungsquoten zweier Kliniken für schwere und leichte Fälle; Breite = Anteil der Fälle");
  out += clinicBars(v, 1) + clinicBars(v, 2);
  out += text(x0, 40, "Höhe: Heilungsquote · Breite: Anteil der Fälle · Linie: Gesamtquote", "lab-text-small");
  for (const k of [1, 2] as const) {
    const x = x0 + (k - 1) * (w + gap);
    const ws = w * (k === 1 ? v.s1 : v.s2);
    out += handle(`S${k}`, x + ws / 2, y0 - h * (k === 1 ? v.r1s : v.r2s), `Heilungsquote schwer, Klinik ${k}`, "lab-handle lab-handle-b");
    out += handle(`L${k}`, x + ws + (w - ws) / 2, y0 - h * (k === 1 ? v.r1l : v.r2l), `Heilungsquote leicht, Klinik ${k}`);
    out += handle(`M${k}`, x + ws, y0 + 34, `Anteil schwerer Fälle, Klinik ${k}`, "lab-handle lab-handle-a");
  }
  return out + "</svg>";
}

function simpsonHandles(): LabView["handles"] {
  const { y0, h, w, gap, x0 } = BARS;
  const rate = (p: { y: number }) => (y0 - p.y) / h;
  const share = (k: 1 | 2, p: { x: number }) => (p.x - (x0 + (k - 1) * (w + gap))) / w;
  return {
    L1: { y: "r1l", drag: (p) => ({ r1l: rate(p) }) },
    S1: { y: "r1s", drag: (p) => ({ r1s: rate(p) }) },
    L2: { y: "r2l", drag: (p) => ({ r2l: rate(p) }) },
    S2: { y: "r2s", drag: (p) => ({ r2s: rate(p) }) },
    M1: { x: "s1", drag: (p) => ({ s1: share(1, p) }) },
    M2: { x: "s2", drag: (p) => ({ s2: share(2, p) }) },
  };
}

export const WAHRSCHEINLICHKEIT_VIEWS: Record<string, LabView> = {
  "area-diagram": { render: areaDiagram, handles: AREA_HANDLES },
  "diagnostic-test": { render: diagnosticTest },
  independence: { render: independence, handles: AREA_HANDLES },
  simpson: { render: simpson, handles: simpsonHandles() },
};
