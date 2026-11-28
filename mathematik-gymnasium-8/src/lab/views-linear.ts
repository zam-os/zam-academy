import { fmt, linear } from "../exercises/format";
import {
  intersectLines,
  lineThroughPoints,
  lineZero,
  solveLinearInequality,
  type InequalityOp,
} from "../curriculum/math";
import {
  circle,
  clipped,
  dashedLine,
  handle,
  infoBox,
  line,
  numberLine,
  open,
  Plot,
  polygon,
  type LabView,
} from "./svg";
import { coordinateHandle, title } from "./view-helpers";

/** Lab views for Stage 2: Lineare Funktionen. */

const OPS: InequalityOp[] = ["<", "<=", ">", ">="];

const lineMT: LabView = {
  render(v) {
    const m = v.m;
    const t = v.t;
    const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Lineare Funktion y = m·x + t");
    out += title(`y = ${linear(m, t, 1)}`);
    out += plot.grid(1, 2, "x", "y");
    out += clipped("lmt-clip", plot.clip("lmt-clip") + plot.lineThrough(m, t, "lab-curve"));
    // Slope triangle from (0, t) to (1, t + m) or (2, t + 2m)
    const dx = 2;
    out += line(plot.X(0), plot.Y(t), plot.X(dx), plot.Y(t), "lab-side-ok");
    out += line(plot.X(dx), plot.Y(t), plot.X(dx), plot.Y(t + dx * m), "lab-side-b");
    out += handle("t", plot.X(0), plot.Y(t), "y-Achsenabschnitt t");
    out += handle("step", plot.X(dx), plot.Y(t + dx * m), "Steigungspunkt");
    out += infoBox(505, 86, [
      [`m = ${fmt(m, 1)}`, "lab-text-b"],
      [`t = ${fmt(t, 1)}`, "lab-text-a"],
      [`Sy(0 | ${fmt(t, 1)})`, "lab-text-small"],
      [m > 0 ? "steigend" : m < 0 ? "fallend" : "waagrecht", "lab-text-ok"],
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
    step: {
      y: "m",
      drag: (p, v) => {
        const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
        return { m: (plot.invY(p.y) - v.t) / 2 };
      },
    },
  },
};

const lineReadGraph: LabView = {
  render(v) {
    const m = v.m;
    const t = v.t;
    const dx = v.dx;
    const plot = new Plot(-4, 6, -4, 6, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Gerade zeichnen und ablesen");
    out += title(`y = ${linear(m, t, 1)}`);
    out += plot.grid(1, 2, "x", "y");
    out += clipped("lrg-clip", plot.clip("lrg-clip") + plot.lineThrough(m, t, "lab-curve"));
    const xEnd = dx;
    const yEnd = m * xEnd + t;
    out += line(plot.X(0), plot.Y(t), plot.X(xEnd), plot.Y(t), "lab-side-a");
    out += line(plot.X(xEnd), plot.Y(t), plot.X(xEnd), plot.Y(yEnd), "lab-side-b");
    out += circle(plot.X(0), plot.Y(t), 4.5, "lab-point-a");
    out += handle("dx", plot.X(xEnd), plot.Y(yEnd), "Steigungsdreieck Δx");
    out += infoBox(505, 86, [
      [`Sy(0 | ${fmt(t, 0)})`, "lab-text-a"],
      [`Δx = ${fmt(dx, 0)}`, "lab-text"],
      [`Δy = ${fmt(m * dx, 1)}`, "lab-text-b"],
      [`m = Δy/Δx = ${fmt(m, 1)}`, "lab-text-ok"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    dx: {
      x: "dx",
      drag: (p) => {
        const plot = new Plot(-4, 6, -4, 6, { x: 26, y: 42, w: 292, h: 250 });
        return { dx: plot.invX(p.x) };
      },
    },
  },
};

const lineTwoPoints: LabView = {
  render(v) {
    const p = { x: v.px, y: v.py };
    const q = { x: v.qx, y: v.qy };
    const lineRes = lineThroughPoints(p, q);
    const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Geradengleichung durch zwei Punkte P und Q");
    out += title(lineRes ? `y = ${linear(lineRes.m, lineRes.t, 2)}` : `Senkrechte x = ${fmt(p.x, 0)} (keine Funktion)`);
    out += plot.grid(1, 2, "x", "y");
    if (lineRes) {
      out += clipped("ltp-clip", plot.clip("ltp-clip") + plot.lineThrough(lineRes.m, lineRes.t, "lab-curve"));
    } else {
      out += dashedLine(plot.X(p.x), plot.Y(-5), plot.X(p.x), plot.Y(5), "lab-asymptote");
    }
    out += handle("p", plot.X(p.x), plot.Y(p.y), "Punkt P");
    out += handle("q", plot.X(q.x), plot.Y(q.y), "Punkt Q");
    out += infoBox(505, 80, [
      [`P(${fmt(p.x, 0)} | ${fmt(p.y, 0)})`, "lab-text-a"],
      [`Q(${fmt(q.x, 0)} | ${fmt(q.y, 0)})`, "lab-text-b"],
      [lineRes ? `m = ${fmt(lineRes.m, 2)}` : "Δx = 0 (nicht def.)", lineRes ? "lab-text-ok" : "lab-text-bad"],
      [lineRes ? `t = ${fmt(lineRes.t, 2)}` : "x₁ ≠ x₂ wählen", "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    p: coordinateHandle("px", "py", (pt) => {
      const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
      return { x: plot.invX(pt.x), y: plot.invY(pt.y) };
    }),
    q: coordinateHandle("qx", "qy", (pt) => {
      const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
      return { x: plot.invX(pt.x), y: plot.invY(pt.y) };
    }),
  },
};

const lineZeroPoint: LabView = {
  render(v) {
    const m = v.m;
    const t = v.t;
    const x0 = lineZero(m, t);
    const plot = new Plot(-6, 6, -6, 6, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Nullstelle einer linearen Funktion");
    out += title(`f(x) = ${linear(m, t, 1)}`);
    out += plot.grid(1, 2, "x", "y");
    out += clipped("lzp-clip", plot.clip("lzp-clip") + plot.lineThrough(m, t, "lab-curve"));
    if (x0 !== null && plot.contains(x0, 0)) {
      out += circle(plot.X(x0), plot.Y(0), 5.5, "lab-point-ok");
    }
    out += handle("t", plot.X(0), plot.Y(t), "y-Achsenabschnitt t");
    out += infoBox(505, 86, [
      [`m = ${fmt(m, 1)}, t = ${fmt(t, 0)}`, "lab-text-a"],
      [x0 !== null ? `Nullstelle x₀ = ${fmt(x0, 2)}` : t === 0 ? "alle x ∈ ℝ" : "keine Nullstelle", x0 !== null ? "lab-text-ok" : "lab-text-bad"],
      [x0 !== null ? `N(${fmt(x0, 2)} | 0)` : "m = 0 → waagrecht", "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    t: {
      y: "t",
      drag: (p) => {
        const plot = new Plot(-6, 6, -6, 6, { x: 26, y: 42, w: 292, h: 250 });
        return { t: plot.invY(p.y) };
      },
    },
  },
};

const lineIntersection: LabView = {
  render(v) {
    const m1 = v.m1;
    const t1 = v.t1;
    const m2 = v.m2;
    const t2 = v.t2;
    const res = intersectLines(m1, t1, m2, t2);
    const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
    let out = open("Schnittpunkt zweier Geraden");
    out += title(
      res.kind === "one"
        ? `S(${fmt(res.point.x, 2)} | ${fmt(res.point.y, 2)})`
        : res.kind === "parallel"
          ? "Echt parallel (kein Schnittpunkt)"
          : "Identische Geraden",
    );
    out += plot.grid(1, 2, "x", "y");
    out += clipped(
      "li-clip",
      plot.clip("li-clip") +
        plot.lineThrough(m1, t1, "lab-curve") +
        plot.lineThrough(m2, t2, "lab-curve-2"),
    );
    if (res.kind === "one" && plot.contains(res.point.x, res.point.y)) {
      out += circle(plot.X(res.point.x), plot.Y(res.point.y), 5.5, "lab-point-ok");
    }
    out += handle("t1", plot.X(0), plot.Y(t1), "Gerade g: t₁");
    out += handle("t2", plot.X(0), plot.Y(t2), "Gerade h: t₂");
    out += infoBox(505, 86, [
      [`g: y = ${linear(m1, t1, 1)}`, "lab-text-a"],
      [`h: y = ${linear(m2, t2, 1)}`, "lab-text-b"],
      [res.kind === "one" ? `S(${fmt(res.point.x, 2)} | ${fmt(res.point.y, 2)})` : res.kind === "parallel" ? "m₁ = m₂, t₁ ≠ t₂" : "m₁ = m₂, t₁ = t₂", "lab-text-ok"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    t1: {
      y: "t1",
      drag: (p) => {
        const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
        return { t1: plot.invY(p.y) };
      },
    },
    t2: {
      y: "t2",
      drag: (p) => {
        const plot = new Plot(-5, 5, -5, 5, { x: 26, y: 42, w: 292, h: 250 });
        return { t2: plot.invY(p.y) };
      },
    },
  },
};

const linearTariffs: LabView = {
  render(v) {
    const baseA = v.baseA;
    const rateA = v.rateA;
    const baseB = v.baseB;
    const rateB = v.rateB;
    const res = intersectLines(rateA, baseA, rateB, baseB);
    const plot = new Plot(0, 60, 0, 50, { x: 34, y: 42, w: 286, h: 250 });
    let out = open("Sachzusammenhang Tarifvergleich");
    out += title("Kostenvergleich zweier Tarife");
    out += plot.grid(10, 20, "x", "€");
    out += clipped(
      "ltar-clip",
      plot.clip("ltar-clip") +
        plot.lineThrough(rateA, baseA, "lab-curve") +
        plot.lineThrough(rateB, baseB, "lab-curve-2"),
    );
    if (res.kind === "one" && res.point.x >= 0 && plot.contains(res.point.x, res.point.y)) {
      out += circle(plot.X(res.point.x), plot.Y(res.point.y), 5.5, "lab-point-ok");
    }
    out += handle("baseA", plot.X(0), plot.Y(baseA), "Grundgebühr A");
    out += handle("baseB", plot.X(0), plot.Y(baseB), "Grundgebühr B");
    out += infoBox(505, 86, [
      [`A: ${fmt(baseA, 0)} + ${fmt(rateA, 2)}·x`, "lab-text-a"],
      [`B: ${fmt(baseB, 0)} + ${fmt(rateB, 2)}·x`, "lab-text-b"],
      [res.kind === "one" && res.point.x >= 0 ? `Gleich bei x = ${fmt(res.point.x, 1)}` : "Kein Treffpunkt x ≥ 0", "lab-text-ok"],
      [res.kind === "one" && res.point.x >= 0 ? `Preis: ${fmt(res.point.y, 1)} €` : "Tarife bleiben getrennt", "lab-text-small"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    baseA: {
      y: "baseA",
      drag: (p) => {
        const plot = new Plot(0, 60, 0, 50, { x: 34, y: 42, w: 286, h: 250 });
        return { baseA: plot.invY(p.y) };
      },
    },
    baseB: {
      y: "baseB",
      drag: (p) => {
        const plot = new Plot(0, 60, 0, 50, { x: 34, y: 42, w: 286, h: 250 });
        return { baseB: plot.invY(p.y) };
      },
    },
  },
};

const linearInequality: LabView = {
  render(v) {
    const a = v.a;
    const b = v.b;
    const op = OPS[v.op] ?? "<";
    const c = v.c;
    const sol = solveLinearInequality(a, b, op, 0, c);
    const plot = new Plot(-6, 6, -6, 8, { x: 26, y: 38, w: 292, h: 204 });
    let out = open("Lineare Ungleichung graphisch und am Zahlenstrahl");
    out += title(`${linear(a, b, 0)} ${op.replace("<=", "≤").replace(">=", "≥")} ${fmt(c, 0)}   ⇒   L = ${sol.interval}`);
    out += plot.grid(1, 2, "x", "y");
    if (sol.kind === "ray") {
      const xStart = sol.dir === ">" ? Math.max(-6, sol.bound) : -6;
      const xEnd = sol.dir === "<" ? Math.min(6, sol.bound) : 6;
      if (xEnd > xStart) {
        out += polygon(
          [plot.P(xStart, -6), plot.P(xEnd, -6), plot.P(xEnd, 8), plot.P(xStart, 8)],
          "lab-region",
        );
      }
    }
    out += clipped(
      "lineq-clip",
      plot.clip("lineq-clip") +
        plot.lineThrough(a, b, "lab-curve") +
        plot.lineThrough(0, c, "lab-curve-2"),
    );
    if (sol.kind === "ray" && plot.contains(sol.bound, c)) {
      out += circle(plot.X(sol.bound), plot.Y(c), 5, sol.closed ? "lab-point-ok" : "lab-open");
    }
    out += handle("c", plot.X(0), plot.Y(c), "Schranke c");
    out += infoBox(505, 76, [
      [`Links: y = ${linear(a, b, 0)}`, "lab-text-a"],
      [`Rechts: y = ${fmt(c, 0)}`, "lab-text-b"],
      [`L = ${sol.interval}`, "lab-text-ok"],
      [a < 0 ? "a < 0: Zeichen dreht um!" : "Zeichen bleibt", a < 0 ? "lab-text-bad" : "lab-text-small"],
    ], "end");
    out += numberLine(
      292,
      -6,
      6,
      sol.kind === "ray" ? sol.bound : null,
      sol.kind === "ray" ? sol.dir : sol.kind,
      sol.kind === "ray" ? sol.closed : false,
    );
    return out + "</svg>";
  },
  handles: {
    c: {
      y: "c",
      drag: (p) => {
        const plot = new Plot(-6, 6, -6, 8, { x: 26, y: 38, w: 292, h: 204 });
        return { c: plot.invY(p.y) };
      },
    },
  },
};

const directProportion: LabView = {
  render(v) {
    const a = v.a;
    const t = v.t;
    const x = v.x;
    const y = a * x + t;
    const prop = Math.abs(t) < 1e-6;
    const plot = new Plot(0, 6, 0, 14, { x: 30, y: 42, w: 288, h: 250 });
    let out = open("Ursprungsgerade und direkte Proportionalität");
    out += title(prop ? `y = ${fmt(a, 1)}·x (direkt proportional)` : `y = ${fmt(a, 1)}·x + ${fmt(t, 1)} (nicht proportional)`);
    out += plot.grid(1, 2, "x", "y");
    out += clipped("dp-clip", plot.clip("dp-clip") + plot.lineThrough(a, t, prop ? "lab-curve-ok" : "lab-curve-2"));
    out += circle(plot.X(0), plot.Y(t), 4.5, prop ? "lab-point-ok" : "lab-point-bad");
    out += handle("x", plot.X(x), plot.Y(y), "Messpunkt (x | y)");
    const q1 = a * 2 + t;
    const q2 = a * 4 + t;
    out += infoBox(505, 80, [
      [`x = ${fmt(x, 0)} → y = ${fmt(y, 1)}`, "lab-text-a"],
      [`y / x = ${fmt(y / x, 2)}`, "lab-text"],
      [`bei x=2: ${fmt(q1 / 2, 2)}; x=4: ${fmt(q2 / 4, 2)}`, "lab-text-small"],
      [prop ? "Ursprungsgerade ✓" : "t ≠ 0 → nicht prop.", prop ? "lab-text-ok" : "lab-text-bad"],
    ], "end");
    return out + "</svg>";
  },
  handles: {
    x: {
      x: "x",
      drag: (p) => {
        const plot = new Plot(0, 6, 0, 14, { x: 30, y: 42, w: 288, h: 250 });
        return { x: plot.invX(p.x) };
      },
    },
  },
};

export const VIEWS_LINEAR: Record<string, LabView> = {
  "line-m-t": lineMT,
  "line-read-graph": lineReadGraph,
  "line-two-points": lineTwoPoints,
  "line-zero-point": lineZeroPoint,
  "line-intersection": lineIntersection,
  "linear-tariffs": linearTariffs,
  "linear-inequality": linearInequality,
  "direct-proportion": directProportion,
};
