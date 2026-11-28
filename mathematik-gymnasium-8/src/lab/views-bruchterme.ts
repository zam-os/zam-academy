import { fmt, linear, MINUS } from "../exercises/format";
import {
  hyperbolaEval,
  intPower,
  solveSimpleFracEq,
} from "../curriculum/math";
import {
  circle,
  clipped,
  dashedLine,
  handle,
  infoBox,
  line,
  open,
  Plot,
  rect,
  text,
  type LabView,
} from "./svg";
import { rail, railHandle, title } from "./view-helpers";

/** Lab views for Stage 4: Bruchterme und Bruchgleichungen. */

const rationalSimplify: LabView = {
  render(v) {
    const k = v.k;
    const a = v.a;
    const x = v.x;
    const gap = Math.abs(x) === a;
    const val = gap ? Number.NaN : k / (x - a);
    let out = open("Bruchterm faktorisieren und kürzen");
    out += title(`(${fmt(k, 0)}x + ${fmt(k * a, 0)}) / (x² ${MINUS} ${fmt(a * a, 0)})`);

    // Three step cards
    out += rect(20, 48, 150, 96, "lab-cell", 'rx="8"');
    out += text(95, 78, `${fmt(k, 0)}x + ${fmt(k * a, 0)}`, "lab-text", "middle");
    out += line(40, 92, 150, 92, "lab-side-a");
    out += text(95, 118, `x² ${MINUS} ${fmt(a * a, 0)}`, "lab-text", "middle");

    out += text(184, 98, "=", "lab-text-big", "middle");

    out += rect(198, 48, 174, 96, "lab-fill-a lab-cell", 'rx="8"');
    out += text(285, 78, `${fmt(k, 0)} · (x + ${fmt(a, 0)})`, "lab-text-a", "middle");
    out += line(214, 92, 356, 92, "lab-side-a");
    out += text(285, 118, `(x ${MINUS} ${fmt(a, 0)})(x + ${fmt(a, 0)})`, "lab-text-a", "middle");

    out += text(386, 98, "=", "lab-text-big", "middle");

    out += rect(400, 48, 100, 96, "lab-fill-ok lab-cell", 'rx="8"');
    out += text(450, 78, fmt(k, 0), "lab-text-ok", "middle");
    out += line(416, 92, 484, 92, "lab-side-ok");
    out += text(450, 118, `x ${MINUS} ${fmt(a, 0)}`, "lab-text-ok", "middle");

    out += rect(20, 166, 480, 68, "lab-panel", 'rx="8"');
    out += text(260, 192, `D = ℚ \\ {${MINUS}${fmt(a, 0)}; ${fmt(a, 0)}}   (vor dem Kürzen bestimmt!)`, "lab-text", "middle");
    out += text(
      260,
      218,
      gap
        ? `An der Stelle x = ${fmt(x, 0)} ist der ursprüngliche Term NICHT definiert!`
        : `Einsetzprobe x = ${fmt(x, 0)}: gekürzt ${fmt(k, 0)}/(${fmt(x, 0)} ${MINUS} ${fmt(a, 0)}) = ${fmt(val, 2)}`,
      gap ? "lab-text-bad" : "lab-text-ok",
      "middle",
    );
    out += rail("x", "Stelle x", x, 1, 6, 294);
    return out + "</svg>";
  },
  handles: { x: railHandle("x", 1, 6) },
};

const rationalAddSub: LabView = {
  render(v) {
    const c1 = v.c1;
    const op = v.op;
    const c2 = v.c2;
    const a = v.a;
    const x = v.x;
    const sign = op === 0 ? 1 : -1;
    const opChar = op === 0 ? "+" : MINUS;
    const numX = c1 + sign * c2;
    const numConst = (c1 - sign * c2) * a;
    const val = (c1 / (x - a)) + sign * (c2 / (x + a));
    let out = open("Bruchterme auf Hauptnenner bringen");
    out += title(`${fmt(c1, 0)}/(x ${MINUS} ${fmt(a, 0)}) ${opChar} ${fmt(c2, 0)}/(x + ${fmt(a, 0)})`);

    out += rect(20, 48, 224, 90, "lab-cell", 'rx="8"');
    out += text(132, 76, `${fmt(c1, 0)}(x + ${fmt(a, 0)}) ${opChar} ${fmt(c2, 0)}(x ${MINUS} ${fmt(a, 0)})`, "lab-text", "middle");
    out += line(38, 92, 226, 92, "lab-side-a");
    out += text(132, 118, `(x ${MINUS} ${fmt(a, 0)})(x + ${fmt(a, 0)})`, "lab-text-small", "middle");

    out += text(260, 98, "=", "lab-text-big", "middle");

    out += rect(276, 48, 224, 90, "lab-fill-ok lab-cell", 'rx="8"');
    out += text(388, 76, linear(numX, numConst, 0), "lab-text-ok", "middle");
    out += line(294, 92, 482, 92, "lab-side-ok");
    out += text(388, 118, `x² ${MINUS} ${fmt(a * a, 0)}`, "lab-text-small", "middle");

    out += rect(20, 160, 480, 68, "lab-panel", 'rx="8"');
    out += text(260, 186, `Hauptnenner HN = (x ${MINUS} ${fmt(a, 0)})(x + ${fmt(a, 0)}), D = ℚ \\ {${MINUS}${fmt(a, 0)}; ${fmt(a, 0)}}`, "lab-text", "middle");
    out += text(260, 212, `Termwert bei x = ${fmt(x, 0)}: ${fmt(val, 3)}`, "lab-text-a", "middle");
    out += rail("x", "Testwert x", x, 4, 6, 294);
    return out + "</svg>";
  },
  handles: { x: railHandle("x", 4, 6) },
};

const rationalMulDiv: LabView = {
  render(v) {
    const div = v.mode === 1;
    const p = v.p;
    const q = v.q;
    const x = v.x;
    const resVal = div ? (p * q * x) / ((x + 1) * (x + 1)) : (p * x) / q;
    let out = open("Bruchterme multiplizieren und dividieren");
    out += title(div ? `(${fmt(p, 0)}x)/(x+1) : (x+1)/${fmt(q, 0)}` : `(${fmt(p, 0)}x)/(x+1) · (x+1)/${fmt(q, 0)}`);

    out += rect(20, 48, 224, 92, "lab-cell", 'rx="8"');
    out += text(132, 78, div ? `Kehrwert von (x+1)/${fmt(q, 0)} bilden:` : `Über Kreuz kürzen mit (x + 1):`, "lab-text-small", "middle");
    out += text(132, 110, div ? `(${fmt(p, 0)}x)/(x+1) · ${fmt(q, 0)}/(x+1)` : `(${fmt(p, 0)}x · (x+1)) / ((x+1) · ${fmt(q, 0)})`, "lab-text-a", "middle");

    out += text(260, 98, "=", "lab-text-big", "middle");

    out += rect(276, 48, 224, 92, "lab-fill-ok lab-cell", 'rx="8"');
    out += text(388, 76, div ? `${fmt(p * q, 0)}x` : `${fmt(p, 0)}x`, "lab-text-ok", "middle");
    out += line(312, 92, 464, 92, "lab-side-ok");
    out += text(388, 118, div ? `(x + 1)²` : fmt(q, 0), "lab-text-ok", "middle");

    out += rect(20, 162, 480, 66, "lab-panel", 'rx="8"');
    out += text(260, 190, `D = ℚ \\ {${MINUS}1}   ·   Wert bei x = ${fmt(x, 0)}: ${fmt(resVal, 3)}`, "lab-text", "middle");
    out += text(260, 214, div ? "Division = Multiplikation mit dem Kehrwert!" : "Gleiche Faktoren in Zähler und Nenner kürzen sich weg.", "lab-text-small", "middle");
    out += rail("x", "Testwert x", x, 1, 4, 294);
    return out + "</svg>";
  },
  handles: { x: railHandle("x", 1, 4) },
};

const intPowersLab: LabView = {
  render(v) {
    const a = v.base;
    const m = v.m;
    const n = v.n;
    const sumExp = m + n;
    const diffExp = m - n;
    const prodVal = intPower(a, sumExp);
    const quotVal = intPower(a, diffExp);
    let out = open("Potenzen mit ganzzahligen Exponenten");
    out += title(`Basis a = ${fmt(a, 0)}:   m = ${fmt(m, 0)},   n = ${fmt(n, 0)}`);

    out += rect(20, 52, 228, 112, "lab-fill-a lab-cell", 'rx="10"');
    out += text(134, 80, "Multiplikation (gleiche Basis)", "lab-text-small", "middle");
    out += text(134, 112, `${fmt(a, 0)}^(${fmt(m, 0)}) · ${fmt(a, 0)}^(${fmt(n, 0)}) = ${fmt(a, 0)}^(${fmt(sumExp, 0)})`, "lab-text-a", "middle");
    out += text(134, 144, sumExp < 0 ? `= 1 / ${fmt(a ** -sumExp, 0)} ≈ ${fmt(prodVal, 4)}` : `= ${fmt(prodVal, 0)}`, "lab-text", "middle");

    out += rect(272, 52, 228, 112, "lab-fill-b lab-cell", 'rx="10"');
    out += text(386, 80, "Division (gleiche Basis)", "lab-text-small", "middle");
    out += text(386, 112, `${fmt(a, 0)}^(${fmt(m, 0)}) : ${fmt(a, 0)}^(${fmt(n, 0)}) = ${fmt(a, 0)}^(${fmt(diffExp, 0)})`, "lab-text-b", "middle");
    out += text(386, 144, diffExp < 0 ? `= 1 / ${fmt(a ** -diffExp, 0)} ≈ ${fmt(quotVal, 4)}` : `= ${fmt(quotVal, 0)}`, "lab-text", "middle");

    out += rect(20, 182, 480, 56, "lab-panel", 'rx="8"');
    out += text(260, 215, `Kehrwertregel: a^(−k) = 1 / a^k   ·   Sonderfall: a⁰ = 1`, "lab-text", "middle");
    out += rail("m", "Exponent m", m, -3, 3, 294);
    return out + "</svg>";
  },
  handles: { m: railHandle("m", -3, 3) },
};

const fracEqSolver: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const c = v.c;
    const d = v.d;
    const sol = solveSimpleFracEq(a, b, c, d);
    const fmtDen = (k: number) => (k === 0 ? "x" : k > 0 ? `x + ${fmt(k, 0)}` : `x ${MINUS} ${fmt(-k, 0)}`);
    let out = open("Bruchgleichung lösen und Definitionsmenge prüfen");
    out += title(`${fmt(a, 0)} / (${fmtDen(b)}) = ${fmt(c, 0)} / (${fmtDen(d)})`);

    out += rect(24, 52, 472, 48, "lab-cell", 'rx="8"');
    out += text(260, 81, `1. Definitionsmenge: D = ℚ \\ {${fmt(-b, 0)}${b !== d ? `; ${fmt(-d, 0)}` : ""}}`, "lab-text", "middle");

    out += rect(24, 114, 472, 48, "lab-cell", 'rx="8"');
    out += text(260, 143, `2. Überkreuz multiplizieren: ${fmt(a, 0)}·(${fmtDen(d)}) = ${fmt(c, 0)}·(${fmtDen(b)})`, "lab-text-a", "middle");

    out += rect(24, 176, 472, 54, sol.kind === "one" ? "lab-fill-ok lab-cell" : "lab-fill-b lab-cell", 'rx="8"');
    const msg =
      sol.kind === "one"
        ? `3. Lösung x = ${fmt(sol.x, 2)} ∈ D  ⇒  L = {${fmt(sol.x, 2)}}`
        : sol.kind === "extraneous"
          ? `3. x = ${fmt(sol.candidate, 0)} ∉ D (Scheinlösung!)  ⇒  L = ∅`
          : sol.kind === "all"
            ? `3. Immer wahr auf D  ⇒  L = D`
            : `3. Widerspruch (${fmt(a, 0)} ≠ ${fmt(c, 0)})  ⇒  L = ∅`;
    out += text(260, 209, msg, sol.kind === "one" ? "lab-text-ok" : "lab-text-bad", "middle");

    out += rail("a", "Zähler links a", a, 2, 6, 294);
    return out + "</svg>";
  },
  handles: { a: railHandle("a", 2, 6) },
};

const fracEqGraph: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const m = v.m;
    const t = v.t;
    // Solve a/(x+b) = m*x + t -> m*x^2 + (m*b + t)*x + (b*t - a) = 0
    const roots: number[] = [];
    if (Math.abs(m) < 1e-9) {
      if (Math.abs(t) > 1e-9) {
        const xr = a / t - b;
        if (Math.abs(xr + b) > 1e-6) roots.push(xr);
      }
    } else {
      const qa = m;
      const qb = m * b + t;
      const qc = b * t - a;
      const disc = qb * qb - 4 * qa * qc;
      if (disc >= -1e-9) {
        const sd = Math.sqrt(Math.max(0, disc));
        const r1 = (-qb - sd) / (2 * qa);
        const r2 = (-qb + sd) / (2 * qa);
        if (Math.abs(r1 + b) > 1e-6) roots.push(r1);
        if (Math.abs(r2 - r1) > 1e-6 && Math.abs(r2 + b) > 1e-6) roots.push(r2);
      }
    }
    const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Bruchgleichung als Schnittproblem zweier Graphen");
    out += title(`Hyperbel ${fmt(a, 0)}/(x${b >= 0 ? `+${fmt(b, 0)}` : `${MINUS}${fmt(-b, 0)}`}) = ${linear(m, t, 1)}`);
    out += plot.grid(1, 2, "x", "y");
    out += dashedLine(plot.X(-b), plot.Y(-5), plot.X(-b), plot.Y(5), "lab-asymptote");
    out += clipped(
      "feg-clip",
      plot.clip("feg-clip") +
        plot.graph((x) => hyperbolaEval(x, a, b, 0), "lab-curve", 280) +
        plot.lineThrough(m, t, "lab-curve-2"),
    );
    for (const xr of roots) {
      const yr = m * xr + t;
      if (plot.contains(xr, yr)) out += circle(plot.X(xr), plot.Y(yr), 5, "lab-point-ok");
    }
    out += handle("t", plot.X(0), plot.Y(t), "Gerade t");
    out += infoBox(505, 86, [
      [`Schnittpunkte: ${roots.length}`, "lab-text-ok"],
      ...roots.slice(0, 2).map((xr, i): [string, string] => [`x${i + 1} = ${fmt(xr, 2)}`, "lab-text-a"]),
      ...(roots.length === 0 ? [["L = ∅ (kein Schnitt)", "lab-text-bad"] as [string, string]] : []),
    ], "end");
    return out + "</svg>";
  },
  handles: {
    t: {
      y: "t",
      drag: (p) => {
        const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
        return { t: plot.invY(p.y) };
      },
    },
  },
};

const formulaRearranger: LabView = {
  render(v) {
    const target = v.target;
    const R = v.R;
    const I = v.I;
    const U = R * I;
    let out = open("Formel aus der Physik nach einer Variablen auflösen");
    out += title(`Ohmsches Gesetz: U = ${fmt(U, 0)} V, R = ${fmt(R, 0)} Ω, I = ${fmt(I, 0)} A`);

    const cards = [
      { id: 0, title: "Nach R aufgelöst", eq: `R = U / I = ${fmt(U, 0)} / ${fmt(I, 0)} = ${fmt(R, 0)} Ω` },
      { id: 1, title: "Nach I aufgelöst", eq: `I = U / R = ${fmt(U, 0)} / ${fmt(R, 0)} = ${fmt(I, 0)} A` },
      { id: 2, title: "Nach U aufgelöst", eq: `U = R · I = ${fmt(R, 0)} · ${fmt(I, 0)} = ${fmt(U, 0)} V` },
    ];
    cards.forEach((c, idx) => {
      const y = 52 + idx * 62;
      const active = target === c.id;
      out += rect(36, y, 448, 50, active ? "lab-fill-ok lab-cell" : "lab-cell", 'rx="8"');
      out += text(54, y + 30, c.title, active ? "lab-text-ok" : "lab-text-small");
      out += text(466, y + 30, c.eq, active ? "lab-text-ok" : "lab-text", "end");
    });

    out += rail("R", "Widerstand R (Ω)", R, 2, 12, 294);
    return out + "</svg>";
  },
  handles: { R: railHandle("R", 2, 12) },
};

export const VIEWS_BRUCHTERME: Record<string, LabView> = {
  "rational-simplify": rationalSimplify,
  "rational-add-sub": rationalAddSub,
  "rational-mul-div": rationalMulDiv,
  "int-powers-lab": intPowersLab,
  "frac-eq-solver": fracEqSolver,
  "frac-eq-graph": fracEqGraph,
  "formula-rearranger": formulaRearranger,
};
