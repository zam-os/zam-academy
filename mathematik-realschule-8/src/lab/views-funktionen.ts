import { functionValue, MAPPINGS, relationSlopes } from "../curriculum/stage-6-funktionen";
import { fmt } from "../exercises/format";
import { lineFromPoints } from "../math";
import type { LabKind } from "../model/types";
import {
  arrow,
  circle,
  clipped,
  handle,
  line,
  open,
  Plot,
  polygon,
  text,
  type LabView,
} from "./svg";

const mappings: LabView = {
  render: (v) => {
    let out =
      open("Zuordnungsdiagramm für den Definitionsbereich eins, zwei und drei") +
      text(125, 35, "D = {1, 2, 3}", "lab-text", "middle") +
      text(385, 35, "Werte", "lab-text", "middle");
    for (let i = 1; i <= 3; i++)
      out +=
        circle(125, i * 80, 20, "lab-shape") +
        text(125, i * 80 + 5, String(i), "lab-text", "middle") +
        circle(385, i * 80, 20, "lab-shape-2") +
        text(385, i * 80 + 5, String(i), "lab-text", "middle");
    for (const [x, y] of MAPPINGS[v.mode].pairs)
      out += arrow(149, x * 80, 361, y * 80, "lab-side-a");
    return (
      out +
      text(
        260,
        320,
        MAPPINGS[v.mode].valid
          ? "Zu jedem Eingang genau ein Ausgang"
          : v.mode === 2
            ? "Eingang 1 hat zwei Werte"
            : "Zu Eingang 3 fehlt ein Wert",
        MAPPINGS[v.mode].valid ? "lab-text-ok" : "lab-text-bad",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const repPlot = new Plot(-3, 3, -5, 5, { x: 65, y: 15, w: 180, h: 300 });
const representations: LabView = {
  render: (v) => {
    const p = repPlot;
    let out =
      open("Funktion als endliche Punktmenge und Wertetabelle") +
      p.grid(1, 2) +
      text(385, 45, "x       f(x)", "lab-text", "middle");
    for (let x = -2; x <= 2; x++) {
      const y = functionValue(v.mode, x),
        P = p.P(x, y);
      out +=
        circle(P.x, P.y, x === v.x ? 7 : 4, x === v.x ? "lab-point-ok" : "lab-point-a") +
        text(
          385,
          90 + (x + 2) * 40,
          `${fmt(x)}       ${fmt(y)}`,
          x === v.x ? "lab-text-ok" : "lab-text",
          "middle",
        );
    }
    return (
      out +
      text(
        260,
        335,
        "Nur die fünf erlaubten Eingaben gehören zum Graphen.",
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const graphPlot = new Plot(-6, 6, -6, 6, { x: 105, y: 15, w: 300, h: 300 });
const origins: LabView = {
  render: (v) => {
    const p = graphPlot,
      O = p.P(0, 0),
      P = p.P(v.run, v.rise),
      F = p.P(v.run, 0);
    return (
      open("Ursprungsgerade mit veränderlichem Steigungsdreieck") +
      p.grid(1, 2) +
      p.clip("origin-clip") +
      clipped("origin-clip", p.lineThrough(v.rise / v.run, 0, "lab-curve")) +
      line(O.x, O.y, F.x, F.y, "lab-side-a") +
      line(F.x, F.y, P.x, P.y, "lab-side-b") +
      text((O.x + F.x) / 2, O.y + 19, `Δx=${v.run}`, "lab-text-small", "middle") +
      text(F.x + 9, (F.y + P.y) / 2, `Δy=${v.rise}`, "lab-text-small") +
      handle("P", P.x, P.y, "Punkt des Steigungsdreiecks") +
      "</svg>"
    );
  },
  handles: {
    P: {
      x: "run",
      y: "rise",
      drag: (p) => ({ run: graphPlot.invX(p.x), rise: graphPlot.invY(p.y) }),
    },
  },
};

const relations: LabView = {
  render: (v) => {
    const p = graphPlot,
      m = relationSlopes[v.first],
      n = relationSlopes[v.second];
    return (
      open("Zwei Ursprungsgeraden zum Vergleichen ihrer Steigungen") +
      p.grid(1, 2) +
      p.clip("relations-clip") +
      clipped(
        "relations-clip",
        p.lineThrough(m, 0, "lab-curve") + p.lineThrough(n, 0, "lab-curve-2"),
      ) +
      text(
        260,
        335,
        `m₁ = ${fmt(m, 1)}, m₂ = ${fmt(n, 1)}, Produkt = ${fmt(m * n, 2)}`,
        "lab-text-small",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const intercept: LabView = {
  render: (v) => {
    const p = graphPlot,
      P = p.P(0, v.t);
    return (
      open("Gerade mit Achsenabschnitt oder senkrechte Sonderform") +
      p.grid(1, 2) +
      p.clip("intercept-clip") +
      clipped(
        "intercept-clip",
        v.mode === 1
          ? line(p.X(v.t), p.Y(-6), p.X(v.t), p.Y(6), "lab-curve-2")
          : p.lineThrough(v.m, v.t, "lab-curve"),
      ) +
      (v.mode === 0
        ? circle(P.x, P.y, 5, "lab-point-ok") + text(P.x + 9, P.y - 8, `(0|${v.t})`)
        : "") +
      text(
        260,
        335,
        v.mode === 1 ? `x = ${v.t}` : `y = ${fmt(v.m, 1)}x + (${v.t})`,
        "lab-text",
        "middle",
      ) +
      "</svg>"
    );
  },
};

const points: LabView = {
  render: (v) => {
    const p = graphPlot,
      P = p.P(v.x1, v.y1),
      Q = p.P(v.x2, v.y2),
      l = lineFromPoints({ x: v.x1, y: v.y1 }, { x: v.x2, y: v.y2 });
    let out =
      open("Gerade durch zwei verschiebbare Punkte") + p.grid(1, 2) + p.clip("two-points-clip");
    if (l) out += clipped("two-points-clip", p.lineThrough(l.m, l.t, "lab-curve"));
    else if (v.y1 !== v.y2) out += line(P.x, p.Y(-6), P.x, p.Y(6), "lab-curve-2");
    return (
      out +
      handle("P", P.x, P.y, "Punkt P") +
      handle("Q", Q.x, Q.y, "Punkt Q") +
      text(P.x + 10, P.y - 10, "P") +
      text(Q.x + 10, Q.y - 10, "Q") +
      text(260, 335, `P(${v.x1}|${v.y1}) · Q(${v.x2}|${v.y2})`, "lab-text", "middle") +
      "</svg>"
    );
  },
  handles: {
    P: { x: "x1", y: "y1", drag: (p) => ({ x1: graphPlot.invX(p.x), y1: graphPlot.invY(p.y) }) },
    Q: { x: "x2", y: "y2", drag: (p) => ({ x2: graphPlot.invX(p.x), y2: graphPlot.invY(p.y) }) },
  },
};

const areaPlot = new Plot(0, 8, 0, 8, { x: 115, y: 20, w: 280, h: 280 });
const areas: LabView = {
  render: (v) => {
    const p = areaPlot,
      O = p.P(0, 0),
      A = p.P(v.x, 0),
      B = p.P(v.x, 8 - v.x);
    return (
      open("Dreieck mit funktional voneinander abhängigen Eckpunkten") +
      p.grid(1, 2) +
      line(p.X(0), p.Y(8), p.X(8), p.Y(0), "lab-curve-2") +
      polygon([O, A, B], "lab-shape") +
      handle("A", A.x, A.y, "Punkt A auf der x-Achse") +
      circle(B.x, B.y, 5, "lab-point-ok") +
      text(B.x + 9, B.y - 8, "B(x|8−x)", "lab-text-small") +
      text(260, 335, `Fläche = ${fmt((v.x * (8 - v.x)) / 2, 2)} FE`, "lab-text", "middle") +
      "</svg>"
    );
  },
  handles: { A: { x: "x", drag: (p) => ({ x: areaPlot.invX(p.x) }) } },
};

export const FUNKTIONEN_VIEWS: Partial<Record<LabKind, LabView>> = {
  mapping: mappings,
  representations,
  "origin-line": origins,
  "line-relations": relations,
  intercept,
  "line-from-points": points,
  "functional-area": areas,
};
